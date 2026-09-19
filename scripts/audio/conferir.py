#!/usr/bin/env python3
"""
Confere os MP3 gerados pelo gerar.py antes de irem para o app.

Para cada clipe: transcreve com o faster-whisper (modelo base.en, CPU, int8) e compara com o
texto que devia ser falado, mede a duração e procura clipping. Grava, numa pasta temporária
fora do projeto:
  relatorio-conferencia.md   o que passou e o que precisa de atenção
  resultado-conferencia.json os mesmos dados, para outro script ler
  escuta.html                página para ouvir, aprovar e reprovar os clipes marcados

Uso, a partir da pasta app-web:
  npm run audio:conferir -- --aula 1
  npm run audio:conferir -- --todas
  npm run audio:conferir -- --todas --abrir
  npm run audio:conferir -- --registrar-escuta "CAMINHO/escuta-decisoes.json"

Códigos de saída: 0 relatório gerado (mesmo com clipes marcados), 1 arquivo de decisões
inválido, 2 ambiente incompleto.
"""

from __future__ import annotations

import argparse
import difflib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
import webbrowser
from datetime import date, datetime
from pathlib import Path

# Sem este aviso o huggingface_hub reclama de link simbólico no Windows a cada download.
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gerar  # noqa: E402  (mesmo diretório; reaproveita validação, hash e caminhos)

MODELO_PADRAO = "base.en"
PASTA_WHISPER = gerar.PASTA_MODELOS / "whisper"
SAIDA_PADRAO = Path(tempfile.gettempdir()) / "wsa-audio-conferencia"
ARQUIVO_ESCUTA = gerar.PASTA_SCRIPT / "escuta-aprovada.json"

LIMIAR_CLIPPING = 0.99  # amostra com valor absoluto a partir disto está no teto
MINIMO_CLIPPING = 3  # a partir de quantas amostras no teto o clipe é marcado
PALAVRAS_CURTAS = 2  # até 2 palavras a transcrição não é confiável: vai para a escuta
SEGUNDOS_MIN_POR_PALAVRA = 0.25
SEGUNDOS_MAX_POR_PALAVRA = 0.6
FOLGA_MAX_S = 1.0

ROTULOS_MOTIVO = {
    "curto": "Curto demais",
    "diferente": "Transcrição diferente",
    "duracao": "Duração fora do esperado",
    "clipping": "Clipping",
}

# ---------------------------------------------------------------------------------------------
# Normalização: deixa o esperado e o ouvido no mesmo formato antes de comparar
# ---------------------------------------------------------------------------------------------

UNIDADES = (
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
)
DEZENAS = ("", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety")
ORDINAIS_IRREGULARES = {
    "one": "first",
    "two": "second",
    "three": "third",
    "five": "fifth",
    "eight": "eighth",
    "nine": "ninth",
    "twelve": "twelfth",
}
ABREVIACOES = {"mr": "mister", "mrs": "missus", "dr": "doctor", "ok": "okay"}

PADRAO_DINHEIRO = re.compile(r"\$\s?(\d[\d,]*)(?:\.(\d{1,2}))?")
PADRAO_HORA = re.compile(r"\b(\d{1,2}):(\d{2})\b")
PADRAO_MILHAR = re.compile(r"(?<=\d),(?=\d{3}\b)")
PADRAO_ORDINAL = re.compile(r"\b(\d+)(?:st|nd|rd|th)\b")
PADRAO_DECIMAL = re.compile(r"\b(\d+)\.(\d+)\b")
PADRAO_PALAVRA = re.compile(r"[A-Za-z0-9']+")


def por_extenso(n: int) -> str:
    """Número cardinal em inglês americano, sem "and": 105 vira "one hundred five"."""
    if n < 20:
        return UNIDADES[n]
    if n < 100:
        dezena, unidade = divmod(n, 10)
        return DEZENAS[dezena] + (" " + UNIDADES[unidade] if unidade else "")
    if n < 1000:
        centena, resto = divmod(n, 100)
        return UNIDADES[centena] + " hundred" + (" " + por_extenso(resto) if resto else "")
    if n < 1_000_000:
        milhar, resto = divmod(n, 1000)
        return por_extenso(milhar) + " thousand" + (" " + por_extenso(resto) if resto else "")
    return " ".join(UNIDADES[int(d)] for d in str(n))


def ordinal(n: int) -> str:
    palavras = por_extenso(n).split(" ")
    ultima = palavras[-1]
    if ultima in ORDINAIS_IRREGULARES:
        palavras[-1] = ORDINAIS_IRREGULARES[ultima]
    elif ultima.endswith("y"):
        palavras[-1] = ultima[:-1] + "ieth"
    else:
        palavras[-1] = ultima + "th"
    return " ".join(palavras)


def numero_falado(n: int) -> str:
    """Como o número costuma ser dito: 1990 vira "nineteen ninety"; 2005, "two thousand five"."""
    if 1100 <= n <= 1999 or 2010 <= n <= 2099:
        alto, baixo = divmod(n, 100)
        if baixo == 0:
            return por_extenso(alto) + " hundred"
        if baixo < 10:
            return por_extenso(alto) + " oh " + UNIDADES[baixo]
        return por_extenso(alto) + " " + por_extenso(baixo)
    return por_extenso(n)


def _dinheiro(achado: re.Match) -> str:
    inteiro = int(achado.group(1).replace(",", ""))
    texto = por_extenso(inteiro) + (" dollar" if inteiro == 1 else " dollars")
    if achado.group(2):
        centavos = int(achado.group(2).ljust(2, "0"))
        if centavos:
            texto += " and " + por_extenso(centavos) + (" cent" if centavos == 1 else " cents")
    return f" {texto} "


def _hora(achado: re.Match) -> str:
    hora, minutos = int(achado.group(1)), int(achado.group(2))
    if minutos == 0:
        return f" {por_extenso(hora)} oclock "
    if minutos < 10:
        return f" {por_extenso(hora)} oh {UNIDADES[minutos]} "
    return f" {por_extenso(hora)} {por_extenso(minutos)} "


def _decimal(achado: re.Match) -> str:
    casas = " ".join(UNIDADES[int(d)] for d in achado.group(2))
    return f" {por_extenso(int(achado.group(1)))} point {casas} "


def normalizar(texto: str) -> str:
    """
    Minúsculas, números por extenso, sem pontuação e sem apóstrofo. Aplicada nos DOIS lados
    (texto esperado e transcrição), então "9:30" e "nine thirty" ficam iguais. Contrações não
    são expandidas de propósito: "I'm" e "I am" continuam diferentes.
    """
    t = unicodedata.normalize("NFKC", texto).translate(gerar.TROCAS_PARA_ASCII).lower()
    t = PADRAO_DINHEIRO.sub(_dinheiro, t)
    t = t.replace("%", " percent ")
    t = PADRAO_HORA.sub(_hora, t)
    t = PADRAO_MILHAR.sub("", t)
    t = PADRAO_ORDINAL.sub(lambda achado: f" {ordinal(int(achado.group(1)))} ", t)
    t = PADRAO_DECIMAL.sub(_decimal, t)
    t = re.sub(r"\d+", lambda achado: f" {numero_falado(int(achado.group(0)))} ", t)
    t = t.replace("&", " and ")
    t = re.sub(r"\bcan not\b", "cannot", t)
    t = t.replace("'", "")
    t = re.sub(r"[^a-z0-9]+", " ", t)
    palavras: list[str] = []
    letras: list[str] = []
    for palavra in t.split():
        if len(palavra) == 1 and palavra.isalpha():
            letras.append(palavra)  # letras soltas seguidas: "u s a" vira "usa"
            continue
        if letras:
            palavras.append("".join(letras))
            letras = []
        palavras.append(palavra)
    if letras:
        palavras.append("".join(letras))
    return " ".join(ABREVIACOES.get(palavra, palavra) for palavra in palavras)


def contar_palavras(texto: str) -> int:
    return len(PADRAO_PALAVRA.findall(texto.translate(gerar.TROCAS_PARA_ASCII)))


def semelhanca(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, a.split(), b.split()).ratio()


def faixa_de_duracao(palavras: int) -> tuple[float, float]:
    return SEGUNDOS_MIN_POR_PALAVRA * palavras, SEGUNDOS_MAX_POR_PALAVRA * palavras + FOLGA_MAX_S


def segundos_de_fala(duracao: float, clipe: dict, cfg: dict) -> float:
    """Duração sem o respiro das pontas e sem as pausas entre falas ou itens."""
    pausas = (len(clipe["falas"]) - 1) if clipe["falas"] else 0
    return duracao - 2 * gerar.RESPIRO_MS / 1000 - pausas * gerar.pausa_do_clipe(clipe, cfg) / 1000


# ---------------------------------------------------------------------------------------------
# Leitura do áudio e transcrição
# ---------------------------------------------------------------------------------------------


def ler_pcm(arquivo: Path):
    """Decodifica o MP3 com o ffmpeg para float32 mono a 24 kHz."""
    import numpy as np

    comando = [
        "ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error", "-i", str(arquivo),
        "-f", "f32le", "-ac", "1", "-ar", str(gerar.TAXA), "-",
    ]
    resultado = subprocess.run(comando, capture_output=True)
    if resultado.returncode != 0:
        erro = resultado.stderr.decode("utf-8", "replace").strip()[-300:]
        raise RuntimeError(f"ffmpeg não conseguiu ler {arquivo.name}: {erro}")
    return np.frombuffer(resultado.stdout, dtype="<f4")


def contar_clipping(amostras) -> int:
    import numpy as np

    return int(np.count_nonzero(np.abs(amostras) >= LIMIAR_CLIPPING))


def problemas_do_ambiente() -> list[str]:
    problemas = []
    if shutil.which("ffmpeg") is None:
        problemas.append("ffmpeg não está no PATH. Instale com: winget install Gyan.FFmpeg e abra um terminal novo.")
    for modulo in ("numpy", "faster_whisper"):
        if importlib.util.find_spec(modulo) is None:
            problemas.append(
                f"o módulo {modulo} não está instalado neste Python ({sys.executable}). Rode: "
                f"scripts\\audio\\.venv\\Scripts\\python.exe -m pip install -r scripts\\audio\\requirements-conferencia.txt"
            )
    return problemas


def carregar_whisper(nome: str):
    from faster_whisper import WhisperModel

    PASTA_WHISPER.mkdir(parents=True, exist_ok=True)
    return WhisperModel(nome, device="cpu", compute_type="int8", download_root=str(PASTA_WHISPER))


def transcrever(modelo, arquivo: Path) -> str:
    segmentos, _info = modelo.transcribe(
        str(arquivo), language="en", beam_size=5, condition_on_previous_text=False
    )
    return " ".join(segmento.text.strip() for segmento in segmentos).strip()


# ---------------------------------------------------------------------------------------------
# Registro da escuta humana
# ---------------------------------------------------------------------------------------------


def ler_aprovados() -> dict:
    if ARQUIVO_ESCUTA.is_file():
        dados = gerar.ler_json(ARQUIVO_ESCUTA)
        if isinstance(dados, dict) and isinstance(dados.get("aprovados"), dict):
            return dados
    return {"aprovados": {}}


def registrar_escuta(arquivo: Path) -> int:
    """Junta as decisões baixadas do escuta.html em scripts/audio/escuta-aprovada.json."""
    try:
        dados = gerar.ler_json(arquivo)
    except (OSError, ValueError) as erro:
        print(f"ERRO: não consegui ler {arquivo}: {erro}")
        return 1
    decisoes = dados.get("decisoes") if isinstance(dados, dict) else None
    if not isinstance(decisoes, list):
        print(f"ERRO: {arquivo} não é um arquivo baixado pelo botão Baixar decisões (JSON).")
        return 1
    registro = ler_aprovados()
    hoje = date.today().isoformat()
    aprovados = 0
    reprovados: list[dict] = []
    for decisao in decisoes:
        if not isinstance(decisao, dict) or not isinstance(decisao.get("src"), str):
            continue
        if decisao.get("decisao") == "aprovado":
            registro["aprovados"][decisao["src"]] = {
                "id": str(decisao.get("id", "")),
                "em": hoje,
                "observacao": str(decisao.get("observacao", "")),
            }
            aprovados += 1
        elif decisao.get("decisao") == "reprovado":
            registro["aprovados"].pop(decisao["src"], None)
            reprovados.append(decisao)
    registro["aprovados"] = dict(sorted(registro["aprovados"].items()))
    gerar.gravar_json(ARQUIVO_ESCUTA, registro)
    print(f"Aprovados registrados: {aprovados}. Total aprovado na escuta: {len(registro['aprovados'])}.")
    print(f"Arquivo: {ARQUIVO_ESCUTA}")
    if reprovados:
        print()
        print(f"Reprovados: {len(reprovados)}. Para cada um, ajuste a tabela content/audio/aula-NN.json")
        print("(texto, voz ou velocidade), gere de novo com npm run audio:gerar -- --aula N e confira outra vez.")
        for decisao in reprovados:
            observacao = str(decisao.get("observacao", "")).strip() or "sem observação"
            print(f"    {decisao.get('id', '?')}  {observacao}")
    return 0


# ---------------------------------------------------------------------------------------------
# Relatório, JSON e escuta.html
# ---------------------------------------------------------------------------------------------


def celula(texto) -> str:
    return str(texto).replace("|", "\\|").replace("\r", "").replace("\n", " / ")


def montar_relatorio(resultados: list[dict], ausentes: list[dict], planos, aulas_texto: str, modelo: str) -> str:
    def com(motivo: str) -> list[dict]:
        return [r for r in resultados if motivo in r["motivos"]]

    iguais = [r for r in resultados if r["palavras"] > PALAVRAS_CURTAS and r["normalEsperado"] == r["normalOuvido"]]
    diferentes = com("diferente")
    curtos = com("curto")
    duracao = com("duracao")
    clipping = com("clipping")
    ja_aprovados = [r for r in resultados if r["motivos"] and r["aprovadoNaEscuta"]]
    para_ouvir = [r for r in resultados if r["motivos"] and not r["aprovadoNaEscuta"]]
    invalidas = [p for p in planos if p.situacao == "invalida"]
    ausentes_tabela = [p for p in planos if p.situacao == "ausente"]

    linhas = [
        "# Conferência dos áudios",
        "",
        f"Gerado em {datetime.now().strftime('%Y-%m-%d %H:%M')} · aulas: {aulas_texto} · modelo de transcrição: {modelo}",
        "",
        "| Situação | Clipes |",
        "|---|---|",
        f"| Iguais | {len(iguais)} |",
        f"| Diferentes | {len(diferentes)} |",
        f"| Curtos demais (vão para a escuta) | {len(curtos)} |",
        f"| Duração fora do esperado | {len(duracao)} |",
        f"| Clipping | {len(clipping)} |",
        f"| Arquivo ausente | {len(ausentes)} |",
        f"| Já aprovados na escuta | {len(ja_aprovados)} |",
        f"| Para ouvir no escuta.html | {len(para_ouvir)} |",
        "",
    ]
    if invalidas or ausentes_tabela:
        linhas += ["## Tabelas não conferidas", ""]
        for plano in invalidas:
            linhas.append(f"- aula-{plano.aula:02d}.json com {len(plano.erros)} erro(s). Rode npm run audio:gerar -- --aula {plano.aula} --simular para ver.")
        if ausentes_tabela:
            numeros = ", ".join(f"{p.aula:02d}" for p in ausentes_tabela)
            linhas.append(f"- Sem tabela: aulas {numeros}.")
        linhas.append("")

    linhas += ["## Diferentes (esperado x ouvido)", ""]
    if diferentes:
        linhas += ["| Clipe | Página | Esperado | Ouvido | Semelhança |", "|---|---|---|---|---|"]
        for r in diferentes:
            linhas.append(
                f"| {r['id']} | {r['pagina']} | {celula(r['texto'])} | {celula(r['ouvido'])} | {round(r['semelhanca'] * 100)}% |"
            )
    else:
        linhas.append("Nenhum.")
    linhas += ["", "## Curtos demais (até 2 palavras: vão para a escuta humana)", ""]
    if curtos:
        linhas += ["| Clipe | Página | Esperado | Ouvido |", "|---|---|---|---|"]
        for r in curtos:
            linhas.append(f"| {r['id']} | {r['pagina']} | {celula(r['texto'])} | {celula(r['ouvido'])} |")
    else:
        linhas.append("Nenhum.")
    linhas += ["", "## Duração fora do esperado", ""]
    if duracao:
        linhas += ["| Clipe | Página | Texto | Palavras | Fala (s) | Faixa aceita (s) |", "|---|---|---|---|---|---|"]
        for r in duracao:
            minimo, maximo = r["faixa"]
            linhas.append(
                f"| {r['id']} | {r['pagina']} | {celula(r['texto'])} | {r['palavras']} | {r['fala']:.2f} | {minimo:.2f} a {maximo:.2f} |"
            )
    else:
        linhas.append("Nenhum.")
    linhas += ["", "## Clipping", ""]
    if clipping:
        linhas += ["| Clipe | Página | Amostras no teto |", "|---|---|---|"]
        for r in clipping:
            linhas.append(f"| {r['id']} | {r['pagina']} | {r['clipping']} |")
    else:
        linhas.append("Nenhum.")
    linhas += ["", "## Arquivo ausente", ""]
    if ausentes:
        linhas += ["| Clipe | Arquivo esperado |", "|---|---|"]
        for a in ausentes:
            linhas.append(f"| {a['id']} | {a['src']} |")
        linhas += ["", "Rode npm run audio:gerar com as mesmas aulas para gerar os que faltam."]
    else:
        linhas.append("Nenhum.")
    linhas += ["", "## Iguais", ""]
    if iguais:
        por_aula: dict[int, list[str]] = {}
        for r in iguais:
            por_aula.setdefault(r["aula"], []).append(r["id"])
        for aula in sorted(por_aula):
            linhas.append(f"- aula-{aula:02d} ({len(por_aula[aula])}): {', '.join(por_aula[aula])}")
    else:
        linhas.append("Nenhum.")
    linhas.append("")
    return "\n".join(linhas)


MODELO_ESCUTA = r"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Escuta dos áudios</title>
<style>
  :root { --navy: #0A1F4E; --amarelo: #FFC629; --fundo: #F4F6FB; --cartao: #FFFFFF; --texto: #14213D;
          --suave: #5B6B8C; --verde: #1E7A46; --vermelho: #B3261E; --borda: #D9DFEA; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: var(--fundo); color: var(--texto); }
  header { position: sticky; top: 0; z-index: 1; background: var(--navy); color: #FFFFFF; padding: 16px; }
  h1 { margin: 0 0 4px; font-size: 20px; }
  .contador { margin: 0 0 12px; font-size: 14px; opacity: .9; }
  .barra { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  button { font: inherit; font-size: 14px; border-radius: 999px; border: 1px solid var(--borda); padding: 8px 16px; cursor: pointer; background: #FFFFFF; color: var(--texto); }
  button.ativo { background: var(--amarelo); border-color: var(--amarelo); color: var(--navy); font-weight: 700; }
  .exportar { background: var(--amarelo); border-color: var(--amarelo); color: var(--navy); font-weight: 700; }
  .lento { display: flex; gap: 6px; align-items: center; font-size: 14px; color: #FFFFFF; }
  main { max-width: 880px; margin: 0 auto; padding: 16px; }
  .cartao { background: var(--cartao); border: 1px solid var(--borda); border-radius: 16px; padding: 16px; margin-bottom: 12px; }
  .cartao.aprovado { border-left: 6px solid var(--verde); }
  .cartao.reprovado { border-left: 6px solid var(--vermelho); }
  .topo { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--suave); }
  .selo { font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; background: var(--fundo); }
  .selo.aprovado { background: #E3F4EA; color: var(--verde); }
  .selo.reprovado { background: #FBE4E2; color: var(--vermelho); }
  .motivos { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
  .motivo { font-size: 12px; background: #FFF4D1; color: #6B4E00; border-radius: 999px; padding: 2px 10px; }
  .linha { margin: 6px 0; font-size: 15px; overflow-wrap: anywhere; white-space: pre-line; }
  .linha b { color: var(--suave); font-weight: 600; }
  .falado { font-size: 17px; }
  audio { width: 100%; margin: 8px 0; }
  .acoes { display: flex; flex-wrap: wrap; gap: 8px; }
  .aprovar { border-color: var(--verde); color: var(--verde); }
  .reprovar { border-color: var(--vermelho); color: var(--vermelho); }
  textarea { width: 100%; margin-top: 8px; font: inherit; font-size: 14px; border: 1px solid var(--borda); border-radius: 12px; padding: 8px 12px; min-height: 44px; }
  .vazio { text-align: center; color: var(--suave); padding: 48px 16px; }
  footer { max-width: 880px; margin: 0 auto; padding: 0 16px 48px; color: var(--suave); font-size: 13px; }
  code { background: #E8ECF5; padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere; }
</style>
</head>
<body>
<header>
  <h1>Escuta dos áudios</h1>
  <p class="contador" id="contador"></p>
  <div class="barra">
    <button type="button" data-filtro="todos" class="ativo">Todos</button>
    <button type="button" data-filtro="pendentes">Pendentes</button>
    <button type="button" data-filtro="reprovados">Reprovados</button>
    <label class="lento"><input type="checkbox" id="lento"> Tocar a 80%</label>
    <button type="button" class="exportar" id="exportar">Baixar decisões (JSON)</button>
  </div>
</header>
<main id="lista"></main>
<footer>
  Ao terminar, clique em <b>Baixar decisões (JSON)</b> e rode, na pasta app-web:
  <code>npm run audio:conferir -- --registrar-escuta "CAMINHO DO ARQUIVO BAIXADO"</code>
</footer>
<script type="application/json" id="dados">__DADOS__</script>
<script>
(function () {
  var itens = JSON.parse(document.getElementById('dados').textContent);
  var CHAVE = 'wsa-escuta-v1';
  var ROTULOS = { curto: 'Curto demais', diferente: 'Transcrição diferente', duracao: 'Duração fora do esperado', clipping: 'Clipping' };
  var decisoes = {};
  try { decisoes = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; } catch (e) { decisoes = {}; }
  var filtro = 'todos';
  var lista = document.getElementById('lista');
  var contador = document.getElementById('contador');
  var lento = document.getElementById('lento');

  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(decisoes)); } catch (e) { /* sem armazenamento: segue sem lembrar */ } }
  function decisaoDe(item) { return (decisoes[item.src] && decisoes[item.src].decisao) || ''; }
  function dois(n) { return (n < 10 ? '0' : '') + n; }
  function elemento(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }
  function linha(rotulo, texto, extra) {
    var p = elemento('p', 'linha' + (extra ? ' ' + extra : ''));
    p.appendChild(elemento('b', '', rotulo + ' '));
    p.appendChild(document.createTextNode(texto));
    return p;
  }

  function atualizarContador() {
    var a = 0, r = 0;
    itens.forEach(function (item) { var d = decisaoDe(item); if (d === 'aprovado') a++; if (d === 'reprovado') r++; });
    var p = itens.length - a - r;
    contador.textContent = itens.length + ' clipes para ouvir · ' + a + ' aprovados · ' + r + ' reprovados · ' + p + ' pendentes';
  }

  function decidir(item, valor) {
    var atual = decisoes[item.src] || {};
    decisoes[item.src] = { decisao: valor, observacao: atual.observacao || '' };
    salvar();
    desenhar();
  }

  function cartao(item) {
    var d = decisaoDe(item);
    var c = elemento('section', 'cartao' + (d ? ' ' + d : ''));
    var topo = elemento('div', 'topo');
    topo.appendChild(elemento('span', '', 'Aula ' + dois(item.aula) + ' · ' + item.id + ' · página ' + item.pagina));
    topo.appendChild(elemento('span', 'selo' + (d ? ' ' + d : ''), d === 'aprovado' ? 'Aprovado' : d === 'reprovado' ? 'Reprovado' : 'Pendente'));
    c.appendChild(topo);
    var motivos = elemento('div', 'motivos');
    item.motivos.forEach(function (m) { motivos.appendChild(elemento('span', 'motivo', ROTULOS[m] || m)); });
    c.appendChild(motivos);
    c.appendChild(linha('Texto falado:', item.texto, 'falado'));
    if (item.ancora !== item.texto) c.appendChild(linha('Na tela:', item.ancora));
    c.appendChild(linha('Ouvido pela transcrição:', item.ouvido || '(nada)'));
    var audio = elemento('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.src = item.arquivo;
    c.appendChild(audio);
    var acoes = elemento('div', 'acoes');
    var aprovar = elemento('button', 'aprovar', 'Aprovar');
    aprovar.type = 'button';
    aprovar.addEventListener('click', function () { decidir(item, 'aprovado'); });
    var reprovar = elemento('button', 'reprovar', 'Reprovar');
    reprovar.type = 'button';
    reprovar.addEventListener('click', function () { decidir(item, 'reprovado'); });
    acoes.appendChild(aprovar);
    acoes.appendChild(reprovar);
    c.appendChild(acoes);
    var obs = elemento('textarea');
    obs.placeholder = 'Observação (opcional): o que está errado?';
    obs.value = (decisoes[item.src] && decisoes[item.src].observacao) || '';
    obs.addEventListener('input', function () {
      var atual = decisoes[item.src] || { decisao: '' };
      atual.observacao = obs.value;
      decisoes[item.src] = atual;
      salvar();
    });
    c.appendChild(obs);
    return c;
  }

  function desenhar() {
    atualizarContador();
    lista.textContent = '';
    if (!itens.length) {
      lista.appendChild(elemento('p', 'vazio', 'Nada para ouvir. Todos os clipes passaram na conferência automática.'));
      return;
    }
    var visiveis = itens.filter(function (item) {
      var d = decisaoDe(item);
      if (filtro === 'pendentes') return !d;
      if (filtro === 'reprovados') return d === 'reprovado';
      return true;
    });
    if (!visiveis.length) {
      lista.appendChild(elemento('p', 'vazio', 'Nenhum clipe neste filtro.'));
      return;
    }
    visiveis.forEach(function (item) { lista.appendChild(cartao(item)); });
  }

  document.querySelectorAll('[data-filtro]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      filtro = botao.getAttribute('data-filtro');
      document.querySelectorAll('[data-filtro]').forEach(function (b) { b.classList.toggle('ativo', b === botao); });
      desenhar();
    });
  });

  // Um áudio por vez, na velocidade escolhida.
  document.addEventListener('play', function (evento) {
    document.querySelectorAll('audio').forEach(function (a) { if (a !== evento.target) a.pause(); });
    evento.target.playbackRate = lento.checked ? 0.8 : 1;
  }, true);
  lento.addEventListener('change', function () {
    document.querySelectorAll('audio').forEach(function (a) { a.playbackRate = lento.checked ? 0.8 : 1; });
  });

  document.getElementById('exportar').addEventListener('click', function () {
    var saida = { geradoEm: new Date().toISOString(), decisoes: [] };
    itens.forEach(function (item) {
      var d = decisaoDe(item);
      if (d) saida.decisoes.push({ id: item.id, aula: item.aula, src: item.src, decisao: d, observacao: (decisoes[item.src].observacao || '') });
    });
    var blob = new Blob([JSON.stringify(saida, null, 2)], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'escuta-decisoes.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  desenhar();
})();
</script>
</body>
</html>
"""

# Escape de "<", ">" e "&" dentro do JSON embutido: nenhum texto de aula fecha a tag <script>.
BARRA_U = "\\" + "u"


def montar_escuta(itens: list[dict]) -> str:
    dados = (
        json.dumps(itens, ensure_ascii=False)
        .replace("<", BARRA_U + "003c")
        .replace(">", BARRA_U + "003e")
        .replace("&", BARRA_U + "0026")
    )
    return MODELO_ESCUTA.replace("__DADOS__", dados)


# ---------------------------------------------------------------------------------------------
# Linha de comando
# ---------------------------------------------------------------------------------------------


def ler_argumentos(argv: list[str] | None) -> argparse.Namespace:
    leitor = argparse.ArgumentParser(
        prog="conferir.py",
        description="Confere os MP3 gerados: transcrição, duração e clipping.",
    )
    escolha = leitor.add_mutually_exclusive_group()
    escolha.add_argument("--aula", type=int, action="append", metavar="N", help="aula de 1 a 42. Pode repetir.")
    escolha.add_argument("--todas", action="store_true", help="todas as aulas de 1 a 42.")
    escolha.add_argument(
        "--registrar-escuta",
        dest="registrar_escuta",
        type=Path,
        metavar="ARQUIVO",
        help="registra as decisões baixadas do escuta.html e sai.",
    )
    leitor.add_argument("--so-prioridade", dest="so_prioridade", action="append", choices=gerar.PRIORIDADES)
    leitor.add_argument("--modelo", default=MODELO_PADRAO, help="modelo do faster-whisper. Padrão: base.en.")
    leitor.add_argument("--saida", type=Path, default=SAIDA_PADRAO, help="pasta do relatório. Fica fora do projeto.")
    leitor.add_argument("--abrir", action="store_true", help="abre o escuta.html no navegador ao terminar.")
    leitor.add_argument("--raiz", type=Path, default=gerar.RAIZ_PADRAO, help="pasta app-web. Troque só em teste.")
    argumentos = leitor.parse_args(argv)
    if not (argumentos.aula or argumentos.todas or argumentos.registrar_escuta):
        leitor.error("escolha --aula N, --todas ou --registrar-escuta ARQUIVO")
    if argumentos.aula:
        fora = [n for n in argumentos.aula if not 1 <= n <= gerar.TOTAL_DE_AULAS]
        if fora:
            leitor.error(f"aula fora de 1 a {gerar.TOTAL_DE_AULAS}: {', '.join(str(n) for n in fora)}")
    return argumentos


def main(argv: list[str] | None = None) -> int:
    gerar.configurar_saida()
    argumentos = ler_argumentos(argv)
    if argumentos.registrar_escuta:
        return registrar_escuta(argumentos.registrar_escuta)

    caminhos = gerar.Caminhos(argumentos.raiz.resolve())
    try:
        cfg = gerar.carregar_config_vozes()
    except (OSError, ValueError) as erro:
        print(f"ERRO: não consegui ler {gerar.ARQUIVO_CONFIG_VOZES}: {erro}")
        return 2
    aulas = list(range(1, gerar.TOTAL_DE_AULAS + 1)) if argumentos.todas else sorted(set(argumentos.aula))
    aulas_texto = "1 a 42" if argumentos.todas else ", ".join(str(n) for n in aulas)
    prioridades = set(argumentos.so_prioridade or [])
    ids_vistos = gerar.ids_das_outras_aulas(caminhos, set(aulas))
    planos = [gerar.montar_plano_da_aula(a, caminhos, cfg, ids_vistos, prioridades, False) for a in aulas]

    alvos = [(p, item) for p in planos if p.situacao == "pronta" for item in p.itens if item.acao != "FORA"]
    ausentes = [
        {"id": item.clipe["id"], "src": gerar.src_do_clipe(p.aula, item.nome)}
        for p, item in alvos
        if not item.destino.is_file()
    ]
    existentes = [(p, item) for p, item in alvos if item.destino.is_file()]
    for plano in planos:
        if plano.situacao == "invalida":
            print(f"aula-{plano.aula:02d}: tabela com erro, não conferida. Veja com npm run audio:gerar -- --aula {plano.aula} --simular")

    resultados: list[dict] = []
    if existentes:
        problemas = problemas_do_ambiente()
        if problemas:
            print("ERRO: o ambiente não está pronto para conferir:")
            for problema in problemas:
                print(f"    - {problema}")
            return 2
        print(f"Carregando o modelo de transcrição {argumentos.modelo}. Na primeira vez ele é baixado (cerca de 145 MB).")
        try:
            modelo = carregar_whisper(argumentos.modelo)
        except Exception as erro:  # sem internet no primeiro uso, pasta sem permissão etc.
            print(f"ERRO ao carregar o faster-whisper: {erro}")
            return 2
        aprovados = ler_aprovados()["aprovados"]
        inicio = time.monotonic()
        for indice, (plano, item) in enumerate(existentes, start=1):
            clipe = item.clipe
            src = gerar.src_do_clipe(plano.aula, item.nome)
            amostras = ler_pcm(item.destino)
            duracao = amostras.size / gerar.TAXA
            ouvido = transcrever(modelo, item.destino)
            palavras = contar_palavras(clipe["texto"])
            fala = segundos_de_fala(duracao, clipe, cfg)
            minimo, maximo = faixa_de_duracao(palavras)
            normal_esperado = normalizar(clipe["texto"])
            normal_ouvido = normalizar(ouvido)
            no_teto = contar_clipping(amostras)
            motivos = []
            if palavras <= PALAVRAS_CURTAS:
                motivos.append("curto")
            elif normal_esperado != normal_ouvido:
                motivos.append("diferente")
            if not minimo <= fala <= maximo:
                motivos.append("duracao")
            if no_teto >= MINIMO_CLIPPING:
                motivos.append("clipping")
            resultados.append(
                {
                    "id": clipe["id"],
                    "aula": plano.aula,
                    "pagina": clipe["pagina"],
                    "src": src,
                    "arquivo": item.destino.resolve().as_uri(),
                    "texto": clipe["texto"],
                    "ancora": clipe["ancora"],
                    "ouvido": ouvido,
                    "normalEsperado": normal_esperado,
                    "normalOuvido": normal_ouvido,
                    "semelhanca": round(semelhanca(normal_esperado, normal_ouvido), 3),
                    "palavras": palavras,
                    "duracao": round(duracao, 3),
                    "fala": round(fala, 3),
                    "faixa": [round(minimo, 2), round(maximo, 2)],
                    "clipping": no_teto,
                    "motivos": motivos,
                    "aprovadoNaEscuta": src in aprovados,
                }
            )
            situacao = ", ".join(ROTULOS_MOTIVO[m] for m in motivos) if motivos else "igual"
            print(f"[{indice}/{len(existentes)}] {clipe['id']}: {situacao}")
        print(f"Transcrição terminada em {gerar.formatar_tempo(time.monotonic() - inicio)}.")
    else:
        print("Nenhum MP3 para conferir nas aulas pedidas.")

    argumentos.saida.mkdir(parents=True, exist_ok=True)
    relatorio = argumentos.saida / "relatorio-conferencia.md"
    resultado_json = argumentos.saida / "resultado-conferencia.json"
    escuta = argumentos.saida / "escuta.html"
    relatorio.write_text(
        montar_relatorio(resultados, ausentes, planos, aulas_texto, argumentos.modelo), encoding="utf-8", newline="\n"
    )
    gerar.gravar_json(resultado_json, {"clips": resultados, "ausentes": ausentes})
    para_ouvir = [r for r in resultados if r["motivos"] and not r["aprovadoNaEscuta"]]
    itens_escuta = [
        {k: r[k] for k in ("id", "aula", "pagina", "src", "arquivo", "texto", "ancora", "ouvido", "motivos")}
        for r in para_ouvir
    ]
    escuta.write_text(montar_escuta(itens_escuta), encoding="utf-8", newline="\n")

    def conta(motivo: str) -> int:
        return sum(1 for r in resultados if motivo in r["motivos"])

    iguais = sum(1 for r in resultados if r["palavras"] > PALAVRAS_CURTAS and r["normalEsperado"] == r["normalOuvido"])
    print()
    print(
        f"Conferidos: {len(resultados)} · iguais {iguais} · diferentes {conta('diferente')} · curtos {conta('curto')}"
        f" · duração {conta('duracao')} · clipping {conta('clipping')} · ausentes {len(ausentes)}"
    )
    print(f"Para ouvir no escuta.html: {len(para_ouvir)}")
    print(f"Relatório: {relatorio}")
    print(f"Escuta:    {escuta}")
    if argumentos.abrir:
        webbrowser.open(escuta.resolve().as_uri())
    return 0


if __name__ == "__main__":
    sys.exit(main())
