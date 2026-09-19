#!/usr/bin/env python3
"""
Gera os MP3 das aulas do WSA English com o Kokoro-82M (voz sintética local, roda na CPU).

Lê as tabelas de produção em content/audio/aula-NN.json (contrato 2.4), grava os MP3 em
public/audio/aula-NN/<id>.<hash8>.mp3 (contrato 2.3) e escreve o manifesto que entra no banco
em content/audio/gerado/aula-NN.json (contrato 2.5). Contratos: docs/plano-v2/01-CONTRATOS.md.

O servidor de produção nunca roda este script: ele só serve os MP3 já gerados.

Uso, a partir da pasta app-web:
  npm run audio:gerar -- --aula 1
  npm run audio:gerar -- --aula 1 --aula 2
  npm run audio:gerar -- --todas
  npm run audio:gerar -- --todas --so-prioridade P0
  npm run audio:gerar -- --todas --simular
  npm run audio:gerar -- --aula 3 --forcar

Códigos de saída: 0 tudo certo, 1 erro de tabela ou de geração, 2 ambiente incompleto,
130 interrompido com Ctrl+C.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import wave
from dataclasses import dataclass, field
from pathlib import Path

# numpy e kokoro_onnx são importados só na hora de sintetizar. Assim o --simular e os testes
# rodam em qualquer Python 3.10, mesmo fora do venv.

PASTA_SCRIPT = Path(__file__).resolve().parent
RAIZ_PADRAO = PASTA_SCRIPT.parent.parent  # a pasta app-web
ARQUIVO_CONFIG_VOZES = PASTA_SCRIPT / "vozes.json"
PASTA_MODELOS = PASTA_SCRIPT / "modelos"

TOTAL_DE_AULAS = 42
TAXA = 24000  # Hz. O Kokoro devolve 24 kHz e o contrato 2.3 pede MP3 a 24 kHz.
RESPIRO_MS = 120  # silêncio no começo e no fim de cada clipe
LIMIAR_SILENCIO_DB = -50.0  # abaixo disto, em relação ao pico, conta como silêncio
MARGEM_CORTE_MS = 60  # margem mantida antes da primeira e depois da última fala
RAMPA_MS = 5  # fade curto nas pontas para não estalar
MINIMO_DE_FALA_S = 0.08  # menos que isto é áudio vazio

FILTRO_VOLUME = "loudnorm=I=-16:TP=-1.5:LRA=11"
COMENTARIO_MP3 = "Voz sintetica gerada por IA (Kokoro-82M, Apache 2.0)"

# Ordem de preferência: o modelo cheio soa melhor. Os outros só se o cheio não estiver lá.
CANDIDATOS_MODELO = ("kokoro-v1.0.onnx", "kokoro-v1.0.fp16.onnx", "kokoro-v1.0.int8.onnx")
NOME_VOZES_MODELO = "voices-v1.0.bin"

CATEGORIAS = frozenset(
    {
        "VOCABULARY_PRONUNCIATION",
        "GRAMMAR_IN_CONTEXT",
        "FIXED_CHUNK",
        "DIALOGUE",
        "TEXT_LISTENING",
        "LISTENING_PRACTICE",
        "PRONUNCIATION_MODEL",
    }
)
ALVOS = frozenset({"texto", "bloco"})
STATUS_VALIDOS = frozenset({"pronta", "pendente"})
VELOCIDADES = ("natural", "reduzida")
PRIORIDADES = ("P0", "P1", "P2")
CHAVES_TABELA = frozenset({"aula", "titulo", "status", "clips"})
CHAVES_CLIPE = frozenset(
    {
        "id",
        "pagina",
        "local",
        "alvo",
        "ancora",
        "texto",
        "falas",
        "categoria",
        "voz",
        "velocidade",
        "lento",
        "prioridade",
        "obrigatorio",
        "motivo",
    }
)
CHAVES_FALA = frozenset({"voz", "texto"})
PADRAO_ID = re.compile(r"^lesson_(\d{3})_audio_(\d{3})$")
PADRAO_ARQUIVO = re.compile(r"^(lesson_\d{3}_audio_\d{3})\.([0-9a-f]{8})\.mp3$")
SUFIXO_TEMPORARIO = ".tmp.mp3"
# Caracteres especiais escritos por código (chr) para o arquivo continuar só com ASCII neles.
TRAVESSAO = chr(0x2014)
TROCAS_PARA_ASCII = str.maketrans(
    {
        chr(0x2018): "'",
        chr(0x2019): "'",
        chr(0x201C): '"',
        chr(0x201D): '"',
        chr(0x2026): "...",
    }
)


class ErroDeAmbiente(Exception):
    """Falta algo na máquina (ffmpeg, venv, modelo). Sai com código 2."""


# ---------------------------------------------------------------------------------------------
# Terminal, arquivos e pastas
# ---------------------------------------------------------------------------------------------


def configurar_saida() -> None:
    """Força UTF-8 no terminal do Windows para acentos e aspas curvas não quebrarem a saída."""
    for fluxo in (sys.stdout, sys.stderr):
        try:
            fluxo.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass


def ler_json(arquivo: Path):
    # utf-8-sig aceita o BOM que o Bloco de Notas do Windows às vezes grava.
    with open(arquivo, encoding="utf-8-sig") as entrada:
        return json.load(entrada)


def gravar_json(arquivo: Path, dados) -> bool:
    """Grava JSON estável (indentação 2, UTF-8, fim de linha LF). Devolve False se nada mudou."""
    texto = json.dumps(dados, ensure_ascii=False, indent=2) + "\n"
    arquivo.parent.mkdir(parents=True, exist_ok=True)
    if arquivo.is_file():
        with open(arquivo, encoding="utf-8", newline="") as atual:
            if atual.read() == texto:
                return False
    provisorio = arquivo.with_name(arquivo.name + ".tmp")
    with open(provisorio, "w", encoding="utf-8", newline="\n") as saida:
        saida.write(texto)
    os.replace(provisorio, arquivo)
    return True


@dataclass(frozen=True)
class Caminhos:
    """Pastas do projeto. `raiz` é a pasta app-web, ou uma pasta de teste passada em --raiz."""

    raiz: Path

    @property
    def tabelas(self) -> Path:
        return self.raiz / "content" / "audio"

    @property
    def manifestos(self) -> Path:
        return self.raiz / "content" / "audio" / "gerado"

    @property
    def publica(self) -> Path:
        return self.raiz / "public" / "audio"

    def tabela(self, aula: int) -> Path:
        return self.tabelas / f"aula-{aula:02d}.json"

    def manifesto(self, aula: int) -> Path:
        return self.manifestos / f"aula-{aula:02d}.json"

    def pasta_da_aula(self, aula: int) -> Path:
        return self.publica / f"aula-{aula:02d}"


def carregar_config_vozes(arquivo: Path = ARQUIVO_CONFIG_VOZES) -> dict:
    """Lê scripts/audio/vozes.json (contrato 2.4) e confere as chaves que o pipeline usa."""
    cfg = ler_json(arquivo)
    if not isinstance(cfg, dict):
        raise ValueError(f"{arquivo.name}: precisa ser um objeto JSON.")
    for chave in ("vozes", "velocidades", "pausaEntreFalasMs", "pausaEntreItensMs"):
        if chave not in cfg:
            raise ValueError(f"{arquivo.name}: falta a chave {chave!r}.")
    if not isinstance(cfg["vozes"], dict) or not cfg["vozes"]:
        raise ValueError(f"{arquivo.name}: 'vozes' precisa ter pelo menos um apelido.")
    for chave in VELOCIDADES:
        if chave not in cfg["velocidades"]:
            raise ValueError(f"{arquivo.name}: falta a velocidade {chave!r}.")
    return cfg


# ---------------------------------------------------------------------------------------------
# Hash, nomes e texto para o motor
# ---------------------------------------------------------------------------------------------


def formatar_velocidade(valor) -> str:
    return f"{float(valor):.2f}"


def pausa_do_clipe(clipe: dict, cfg: dict) -> int:
    """Diálogo usa a pausa entre falas. Lista de "ouvir todos" usa a pausa entre itens."""
    if clipe["categoria"] == "DIALOGUE":
        return int(cfg["pausaEntreFalasMs"])
    return int(cfg["pausaEntreItensMs"])


def segmentos_do_clipe(clipe: dict, cfg: dict) -> list[tuple[str, str]]:
    """Lista de (voz do Kokoro, texto) na ordem em que são falados."""
    if clipe["falas"]:
        return [(cfg["vozes"][fala["voz"]], fala["texto"]) for fala in clipe["falas"]]
    return [(cfg["vozes"][clipe["voz"]], clipe["texto"])]


def base_do_hash(clipe: dict, cfg: dict) -> str:
    """
    Texto que entra no SHA-256 (contrato 2.3). Usa a voz do Kokoro (af_heart), não o apelido
    (F1): trocar a voz em vozes.json gera arquivo novo sozinho. Em clipe com falas, uma linha
    por fala e a pausa no fim, porque a pausa também muda o áudio.
    """
    velocidade = formatar_velocidade(cfg["velocidades"][clipe["velocidade"]])
    linhas = [f"{voz}|{velocidade}|{texto}" for voz, texto in segmentos_do_clipe(clipe, cfg)]
    if clipe["falas"]:
        return "\n".join(linhas) + f"\n#pausa={pausa_do_clipe(clipe, cfg)}"
    return linhas[0]


def calcular_hash8(clipe: dict, cfg: dict) -> str:
    return hashlib.sha256(base_do_hash(clipe, cfg).encode("utf-8")).hexdigest()[:8]


def nome_do_arquivo(ident: str, hash8: str) -> str:
    return f"{ident}.{hash8}.mp3"


def src_do_clipe(aula: int, nome: str) -> str:
    return f"/audio/aula-{aula:02d}/{nome}"


def texto_para_motor(texto: str) -> str:
    """
    Texto enviado ao Kokoro. Só ajustes que não mudam o que é falado: aspas retas, espaços
    simples e pontuação final. Sem ponto final, palavra curta sai cortada ou com entonação de
    pergunta ("he" vira "he.").
    """
    t = re.sub(r"\s+", " ", texto.translate(TROCAS_PARA_ASCII)).strip()
    if t and t[-1] not in ".!?":
        t += "."
    return t


def segundos_estimados(clipe: dict) -> float:
    """Estimativa grosseira de CPU por clipe. A medida real sai da primeira geração."""
    return 0.6 + 0.02 * len(clipe["texto"])


def formatar_tempo(segundos: float) -> str:
    segundos = max(0, int(round(segundos)))
    if segundos < 60:
        return f"{segundos} s"
    minutos = math.ceil(segundos / 60)
    if minutos < 60:
        return f"{minutos} min"
    return f"{minutos // 60} h {minutos % 60} min"


def milhar(n: int) -> str:
    return f"{n:,}".replace(",", ".")


# ---------------------------------------------------------------------------------------------
# Validação das tabelas (contrato 2.4)
# ---------------------------------------------------------------------------------------------


def _inteiro(valor) -> bool:
    return isinstance(valor, int) and not isinstance(valor, bool)


def _texto_preenchido(valor) -> bool:
    return isinstance(valor, str) and valor.strip() != ""


def validar_clipe(clipe, aula: int, cfg: dict, ids_vistos: dict, posicao: int) -> tuple[list[str], list[str]]:
    """Confere um clipe. Devolve (erros, avisos). Um erro impede gerar a aula inteira."""
    erros: list[str] = []
    avisos: list[str] = []
    if not isinstance(clipe, dict):
        return [f"clips[{posicao}]: precisa ser um objeto JSON."], avisos
    rotulo = clipe["id"] if isinstance(clipe.get("id"), str) else f"clips[{posicao}]"

    chaves = set(clipe)
    faltam = sorted(CHAVES_CLIPE - chaves)
    sobram = sorted(chaves - CHAVES_CLIPE)
    if faltam:
        erros.append(f"{rotulo}: faltam os campos {', '.join(faltam)}.")
    if sobram:
        erros.append(f"{rotulo}: campos que não existem no contrato 2.4: {', '.join(sobram)}.")
    if faltam:
        return erros, avisos

    ident = clipe["id"]
    achado = PADRAO_ID.match(ident) if isinstance(ident, str) else None
    if achado is None:
        erros.append(f"{rotulo}: id fora do padrão lesson_NNN_audio_MMM.")
    else:
        if int(achado.group(1)) != aula:
            erros.append(f"{rotulo}: o id é de outra aula. Esperado lesson_{aula:03d}_audio_MMM.")
        if achado.group(2) == "000":
            erros.append(f"{rotulo}: a numeração do id começa em 001.")
    if isinstance(ident, str):
        if ident in ids_vistos:
            erros.append(f"{rotulo}: id repetido. Já aparece em {ids_vistos[ident]}.")
        else:
            ids_vistos[ident] = f"aula-{aula:02d}.json"

    if not _inteiro(clipe["pagina"]) or clipe["pagina"] < 1:
        erros.append(f"{rotulo}: pagina precisa ser um número inteiro a partir de 1.")
    if not isinstance(clipe["local"], str):
        erros.append(f"{rotulo}: local precisa ser texto.")
    if not isinstance(clipe["motivo"], str):
        erros.append(f"{rotulo}: motivo precisa ser texto.")
    if clipe["alvo"] not in ALVOS:
        erros.append(f'{rotulo}: alvo precisa ser "texto" ou "bloco".')
    if not _texto_preenchido(clipe["ancora"]):
        erros.append(f"{rotulo}: ancora vazia. Copie do conteúdo o texto exibido na tela.")
    if not _texto_preenchido(clipe["texto"]):
        erros.append(f"{rotulo}: texto vazio. Escreva o que deve ser falado.")
    if clipe["categoria"] not in CATEGORIAS:
        erros.append(f"{rotulo}: categoria desconhecida {clipe['categoria']!r}.")
    if clipe["velocidade"] not in VELOCIDADES:
        erros.append(f'{rotulo}: velocidade precisa ser "natural" ou "reduzida".')
    if not isinstance(clipe["lento"], bool):
        erros.append(f"{rotulo}: lento precisa ser true ou false.")
    if not isinstance(clipe["obrigatorio"], bool):
        erros.append(f"{rotulo}: obrigatorio precisa ser true ou false.")
    if clipe["prioridade"] not in PRIORIDADES:
        erros.append(f'{rotulo}: prioridade precisa ser "P0", "P1" ou "P2".')

    vozes = cfg["vozes"]
    apelidos = ", ".join(sorted(vozes))
    falas = clipe["falas"]
    texto = clipe["texto"]
    if falas is None:
        if clipe["voz"] not in vozes:
            erros.append(f"{rotulo}: voz {clipe['voz']!r} desconhecida. Use um destes apelidos: {apelidos}.")
        if isinstance(texto, str) and "\n" in texto:
            erros.append(f"{rotulo}: texto com quebra de linha precisa de falas, uma por linha.")
        if clipe["categoria"] == "DIALOGUE":
            avisos.append(f"{rotulo}: DIALOGUE com uma voz só. Confira se não faltou preencher falas.")
    elif isinstance(falas, list):
        if clipe["voz"] is not None:
            erros.append(f"{rotulo}: quando há falas, voz precisa ser null. A voz fica em cada fala.")
        if len(falas) < 2:
            erros.append(
                f"{rotulo}: falas precisa de 2 itens ou mais. Para uma fala só, use falas: null e preencha voz."
            )
        estrutura_ok = True
        for j, fala in enumerate(falas):
            if not isinstance(fala, dict) or set(fala) != CHAVES_FALA:
                erros.append(f"{rotulo}: falas[{j}] precisa ter só os campos voz e texto.")
                estrutura_ok = False
                continue
            if fala["voz"] not in vozes:
                erros.append(
                    f"{rotulo}: falas[{j}] com voz {fala['voz']!r} desconhecida. Use um destes apelidos: {apelidos}."
                )
            if not _texto_preenchido(fala["texto"]):
                erros.append(f"{rotulo}: falas[{j}] com texto vazio.")
                estrutura_ok = False
            elif "\n" in fala["texto"]:
                erros.append(f"{rotulo}: falas[{j}] tem quebra de linha. Cada fala fica numa linha só.")
                estrutura_ok = False
        if estrutura_ok and isinstance(texto, str):
            juncao = "\n".join(fala["texto"] for fala in falas)
            if texto != juncao:
                erros.append(
                    f"{rotulo}: texto precisa ser as falas juntadas com \\n, na mesma ordem e com as mesmas letras."
                )
    else:
        erros.append(f"{rotulo}: falas precisa ser null ou uma lista.")

    if isinstance(texto, str):
        if re.search(r"\d", texto):
            avisos.append(
                f'{rotulo}: texto com algarismos. Escreva por extenso o que deve ser falado '
                f'(ancora "9:30", texto "nine thirty").'
            )
        maiusculas = sorted(set(re.findall(r"\b[A-Z]{2,}\b", texto)))
        if maiusculas:
            avisos.append(
                f"{rotulo}: texto com palavra toda em maiúsculas ({', '.join(maiusculas)}). "
                f"O motor pode soletrar. Escreva em minúsculas o que deve ser falado."
            )
    for campo in ("ancora", "texto"):
        if isinstance(clipe[campo], str) and TRAVESSAO in clipe[campo]:
            avisos.append(f"{rotulo}: {campo} tem travessão (U+2014). O conteúdo das aulas não usa mais esse caractere.")
    return erros, avisos


def validar_tabela(tabela, aula: int, cfg: dict, ids_vistos: dict) -> tuple[list[str], list[str]]:
    """Confere uma tabela content/audio/aula-NN.json inteira. Devolve (erros, avisos)."""
    erros: list[str] = []
    avisos: list[str] = []
    if not isinstance(tabela, dict):
        return ["o arquivo precisa ser um objeto JSON com aula, titulo, status e clips."], avisos
    chaves = set(tabela)
    faltam = sorted(CHAVES_TABELA - chaves)
    sobram = sorted(chaves - CHAVES_TABELA)
    if faltam:
        erros.append(f"faltam os campos {', '.join(faltam)}.")
    if sobram:
        erros.append(f"campos que não existem no contrato 2.4: {', '.join(sobram)}.")
    if faltam:
        return erros, avisos
    if not _inteiro(tabela["aula"]) or tabela["aula"] != aula:
        erros.append(f"o campo aula precisa ser {aula}, igual ao número do arquivo.")
    if not _texto_preenchido(tabela["titulo"]):
        erros.append("titulo vazio.")
    if tabela["status"] not in STATUS_VALIDOS:
        erros.append('status precisa ser "pronta" ou "pendente".')
    clips = tabela["clips"]
    if not isinstance(clips, list):
        erros.append("clips precisa ser uma lista.")
        return erros, avisos
    if tabela["status"] == "pendente":
        if clips:
            avisos.append(f'status pendente com {len(clips)} clipe(s): nada é gerado até o status virar "pronta".')
        return erros, avisos
    if not clips:
        avisos.append("status pronta sem nenhum clipe.")
    for posicao, clipe in enumerate(clips):
        erros_do_clipe, avisos_do_clipe = validar_clipe(clipe, aula, cfg, ids_vistos, posicao)
        erros.extend(erros_do_clipe)
        avisos.extend(avisos_do_clipe)
    return erros, avisos


# ---------------------------------------------------------------------------------------------
# Plano de geração
# ---------------------------------------------------------------------------------------------


@dataclass
class ItemDoPlano:
    clipe: dict
    hash8: str
    nome: str
    destino: Path
    acao: str  # "GERAR", "PULAR" (arquivo já existe) ou "FORA" (fora de --so-prioridade)


@dataclass
class PlanoDaAula:
    aula: int
    situacao: str  # "pronta", "pendente", "ausente" ou "invalida"
    tabela: dict | None = None
    itens: list[ItemDoPlano] = field(default_factory=list)
    erros: list[str] = field(default_factory=list)
    avisos: list[str] = field(default_factory=list)
    antigos: list[Path] = field(default_factory=list)  # mesmo id, hash diferente
    orfaos: list[Path] = field(default_factory=list)  # id que não está mais na tabela
    temporarios: list[Path] = field(default_factory=list)  # sobra de geração interrompida


def ids_das_outras_aulas(caminhos: Caminhos, aulas_escolhidas: set[int]) -> dict[str, str]:
    """Ids usados nas tabelas que não serão geradas agora. O id é único no curso inteiro."""
    vistos: dict[str, str] = {}
    for aula in range(1, TOTAL_DE_AULAS + 1):
        if aula in aulas_escolhidas:
            continue
        arquivo = caminhos.tabela(aula)
        if not arquivo.is_file():
            continue
        try:
            tabela = ler_json(arquivo)
        except (OSError, ValueError):
            continue
        if not isinstance(tabela, dict) or tabela.get("status") != "pronta":
            continue
        clips = tabela.get("clips")
        if not isinstance(clips, list):
            continue
        for clipe in clips:
            if isinstance(clipe, dict) and isinstance(clipe.get("id"), str):
                vistos.setdefault(clipe["id"], arquivo.name)
    return vistos


def montar_plano_da_aula(
    aula: int, caminhos: Caminhos, cfg: dict, ids_vistos: dict, prioridades: set[str], forcar: bool
) -> PlanoDaAula:
    arquivo = caminhos.tabela(aula)
    if not arquivo.is_file():
        return PlanoDaAula(aula, "ausente")
    try:
        tabela = ler_json(arquivo)
    except (OSError, ValueError) as erro:
        return PlanoDaAula(aula, "invalida", erros=[f"JSON inválido: {erro}"])
    erros, avisos = validar_tabela(tabela, aula, cfg, ids_vistos)
    if erros:
        return PlanoDaAula(aula, "invalida", erros=erros, avisos=avisos)

    plano = PlanoDaAula(aula, tabela["status"], tabela=tabela, avisos=avisos)
    pasta = caminhos.pasta_da_aula(aula)
    existentes = sorted(p for p in pasta.iterdir() if p.is_file()) if pasta.is_dir() else []
    plano.temporarios = [p for p in existentes if p.name.endswith(SUFIXO_TEMPORARIO)]
    if plano.situacao == "pendente":
        return plano  # aula pendente: os MP3 que existirem ficam como estão

    atuais: dict[str, str] = {}
    for clipe in tabela["clips"]:
        hash8 = calcular_hash8(clipe, cfg)
        nome = nome_do_arquivo(clipe["id"], hash8)
        destino = pasta / nome
        if prioridades and clipe["prioridade"] not in prioridades:
            acao = "FORA"
        elif destino.is_file() and not forcar:
            acao = "PULAR"
        else:
            acao = "GERAR"
        plano.itens.append(ItemDoPlano(clipe, hash8, nome, destino, acao))
        atuais[clipe["id"]] = nome

    for existente in existentes:
        achado = PADRAO_ARQUIVO.match(existente.name)
        if achado is None:
            continue
        ident = achado.group(1)
        if ident not in atuais:
            plano.orfaos.append(existente)
        elif existente.name != atuais[ident]:
            plano.antigos.append(existente)
    return plano


def montar_manifesto(aula: int, tabela: dict, cfg: dict, pasta_da_aula: Path) -> dict:
    """
    Manifesto do contrato 2.5: só os clipes cujo MP3 da versão atual existe, em ordem de
    página e id. `lento` só aparece quando é true (é opcional em AudioClip).
    """
    if tabela["status"] == "pendente":
        return {"aula": aula, "clips": []}
    entradas = []
    for clipe in tabela["clips"]:
        nome = nome_do_arquivo(clipe["id"], calcular_hash8(clipe, cfg))
        if not (pasta_da_aula / nome).is_file():
            continue
        dados = {
            "id": clipe["id"],
            "alvo": clipe["alvo"],
            "ancora": clipe["ancora"],
            "texto": clipe["texto"],
            "src": src_do_clipe(aula, nome),
            "categoria": clipe["categoria"],
        }
        if clipe["lento"] is True:
            dados["lento"] = True
        entradas.append({"pagina": clipe["pagina"], "clip": dados})
    entradas.sort(key=lambda entrada: (entrada["pagina"], entrada["clip"]["id"]))
    return {"aula": aula, "clips": entradas}


def resumir_texto(clipe: dict, limite: int = 60) -> str:
    texto = clipe["texto"].replace("\n", " / ")
    return texto if len(texto) <= limite else texto[: limite - 3] + "..."


def rotulo_de_voz(clipe: dict) -> str:
    if clipe["falas"]:
        apelidos: list[str] = []
        for fala in clipe["falas"]:
            if fala["voz"] not in apelidos:
                apelidos.append(fala["voz"])
        return "+".join(apelidos)
    return clipe["voz"]


def imprimir_plano(planos: list[PlanoDaAula], simular: bool) -> None:
    for plano in planos:
        rotulo = f"aula-{plano.aula:02d}"
        if plano.situacao == "ausente":
            print(f"{rotulo}  AUSENTE   content/audio/{rotulo}.json não existe.")
            continue
        if plano.situacao == "invalida":
            print(f"{rotulo}  COM ERRO  {len(plano.erros)} erro(s). Nada desta aula será gerado.")
            for erro in plano.erros:
                print(f"    ERRO  {erro}")
            for aviso in plano.avisos:
                print(f"    AVISO {aviso}")
            continue
        if plano.situacao == "pendente":
            print(f"{rotulo}  PENDENTE  manifesto vazio. Os MP3 que existirem ficam como estão.")
            for aviso in plano.avisos:
                print(f"    AVISO {aviso}")
            continue
        conta = {acao: sum(1 for item in plano.itens if item.acao == acao) for acao in ("GERAR", "PULAR", "FORA")}
        print(
            f"{rotulo}  PRONTA    {len(plano.itens)} clipes · GERAR {conta['GERAR']} · PULAR {conta['PULAR']}"
            f" · FORA {conta['FORA']} · antigos {len(plano.antigos)} · órfãos {len(plano.orfaos)}"
        )
        for aviso in plano.avisos:
            print(f"    AVISO {aviso}")
        for orfao in plano.orfaos:
            print(f"    AVISO {orfao.name}: id fora da tabela. Apague à mão se não for mais usado.")
        if simular:
            for item in plano.itens:
                if item.acao != "GERAR":
                    continue
                clipe = item.clipe
                print(
                    f"    GERAR     {clipe['id']}  p.{clipe['pagina']}  {rotulo_de_voz(clipe)} {clipe['velocidade']}"
                    f"  {resumir_texto(clipe)}  ->  {item.nome}"
                )
            for antigo in plano.antigos:
                print(f"    APAGARIA  {antigo.name} (versão antiga, depois que a nova existir)")


# ---------------------------------------------------------------------------------------------
# Ambiente e motor
# ---------------------------------------------------------------------------------------------


def localizar_modelo() -> tuple[Path | None, Path | None]:
    """Acha o .onnx e o .bin de vozes do Kokoro. KOKORO_MODELO e KOKORO_VOZES têm prioridade."""
    modelo: Path | None = None
    vozes: Path | None = None
    if os.environ.get("KOKORO_MODELO"):
        modelo = Path(os.environ["KOKORO_MODELO"])
    else:
        for nome in CANDIDATOS_MODELO:
            if (PASTA_MODELOS / nome).is_file():
                modelo = PASTA_MODELOS / nome
                break
        if modelo is None and PASTA_MODELOS.is_dir():
            achados = sorted(PASTA_MODELOS.rglob("kokoro*.onnx"))
            modelo = achados[0] if achados else None
    if os.environ.get("KOKORO_VOZES"):
        vozes = Path(os.environ["KOKORO_VOZES"])
    elif (PASTA_MODELOS / NOME_VOZES_MODELO).is_file():
        vozes = PASTA_MODELOS / NOME_VOZES_MODELO
    elif PASTA_MODELOS.is_dir():
        achados = sorted(PASTA_MODELOS.rglob("voices*.bin"))
        vozes = achados[0] if achados else None
    if modelo is not None and not modelo.is_file():
        modelo = None
    if vozes is not None and not vozes.is_file():
        vozes = None
    return modelo, vozes


def problemas_do_ambiente() -> list[str]:
    problemas = []
    if shutil.which("ffmpeg") is None:
        problemas.append("ffmpeg não está no PATH. Instale com: winget install Gyan.FFmpeg e abra um terminal novo.")
    for modulo in ("numpy", "kokoro_onnx"):
        if importlib.util.find_spec(modulo) is None:
            problemas.append(
                f"o módulo {modulo} não está instalado neste Python ({sys.executable}). "
                f"Rode pelo venv: npm run audio:gerar (ou scripts\\audio\\.venv\\Scripts\\python.exe)."
            )
    modelo, vozes = localizar_modelo()
    if modelo is None:
        problemas.append(f"modelo do Kokoro não encontrado em {PASTA_MODELOS}. Esperado: kokoro-v1.0.onnx.")
    if vozes is None:
        problemas.append(f"arquivo de vozes do Kokoro não encontrado em {PASTA_MODELOS}. Esperado: voices-v1.0.bin.")
    return problemas


class Motor:
    """Carrega o Kokoro uma vez e sintetiza (voz, texto) em float32 a 24 kHz."""

    def __init__(self, arquivo_modelo: Path, arquivo_vozes: Path):
        from kokoro_onnx import Kokoro

        self.arquivo_modelo = arquivo_modelo
        self.kokoro = Kokoro(str(arquivo_modelo), str(arquivo_vozes))
        try:
            self.vozes_disponiveis: set[str] | None = set(self.kokoro.get_voices())
        except Exception:  # versões antigas do kokoro-onnx não têm get_voices
            self.vozes_disponiveis = None

    def sintetizar(self, voz: str, texto: str, velocidade: float):
        import numpy as np

        amostras, taxa = self.kokoro.create(texto, voice=voz, speed=float(velocidade), lang="en-us")
        if int(taxa) != TAXA:
            raise RuntimeError(f"o Kokoro devolveu {taxa} Hz e o pipeline espera {TAXA} Hz.")
        return np.asarray(amostras, dtype=np.float32).reshape(-1)


def carregar_motor(cfg: dict) -> Motor:
    modelo, vozes = localizar_modelo()
    if modelo is None or vozes is None:
        raise ErroDeAmbiente("modelo ou vozes do Kokoro não encontrados.")
    motor = Motor(modelo, vozes)
    if motor.vozes_disponiveis is not None:
        faltando = sorted(set(cfg["vozes"].values()) - motor.vozes_disponiveis)
        if faltando:
            raise ErroDeAmbiente(
                f"o arquivo de vozes não tem: {', '.join(faltando)}. Troque em scripts/audio/vozes.json."
            )
    return motor


# ---------------------------------------------------------------------------------------------
# Áudio: montagem, silêncio e ffmpeg
# ---------------------------------------------------------------------------------------------


def silencio(ms: int):
    import numpy as np

    return np.zeros(int(round(TAXA * ms / 1000)), dtype=np.float32)


def aparar_silencio(amostras):
    """Corta o silêncio das pontas, deixa uma margem curta e faz fade de 5 ms para não estalar."""
    import numpy as np

    if amostras.size == 0:
        return amostras
    pico = float(np.max(np.abs(amostras)))
    if pico <= 0.0:
        return amostras[:0]
    quadro = int(TAXA * 0.010)
    quantidade = amostras.size // quadro
    if quantidade == 0:
        return amostras
    blocos = amostras[: quantidade * quadro].reshape(quantidade, quadro).astype(np.float64)
    energia = np.sqrt(np.mean(blocos**2, axis=1))
    limiar = pico * (10 ** (LIMIAR_SILENCIO_DB / 20))
    ativos = np.nonzero(energia > limiar)[0]
    if ativos.size == 0:
        return amostras
    margem = int(TAXA * MARGEM_CORTE_MS / 1000)
    inicio = max(0, int(ativos[0]) * quadro - margem)
    fim = min(amostras.size, (int(ativos[-1]) + 1) * quadro + margem)
    trecho = amostras[inicio:fim].astype(np.float32, copy=True)
    rampa = min(int(TAXA * RAMPA_MS / 1000), trecho.size // 2)
    if rampa > 0:
        janela = np.linspace(0.0, 1.0, rampa, dtype=np.float32)
        trecho[:rampa] *= janela
        trecho[-rampa:] *= janela[::-1]
    return trecho


def montar_audio(clipe: dict, cfg: dict, motor: Motor):
    """Uma voz: um trecho. Falas: cada uma com a sua voz, separadas pela pausa do contrato."""
    import numpy as np

    velocidade = float(cfg["velocidades"][clipe["velocidade"]])
    pausa = silencio(pausa_do_clipe(clipe, cfg))
    partes = []
    for indice, (voz, texto) in enumerate(segmentos_do_clipe(clipe, cfg)):
        trecho = aparar_silencio(motor.sintetizar(voz, texto_para_motor(texto), velocidade))
        if trecho.size < TAXA * MINIMO_DE_FALA_S:
            raise RuntimeError(f"o motor devolveu áudio vazio ou curto demais para {texto!r}.")
        if indice > 0:
            partes.append(pausa)
        partes.append(trecho)
    audio = aparar_silencio(np.concatenate(partes))
    respiro = silencio(RESPIRO_MS)
    return np.concatenate([respiro, audio, respiro]).astype(np.float32)


def gravar_wav(amostras, arquivo: Path) -> None:
    """WAV mono 16 bits. Se o pico passar de 0,99, baixa o volume antes para não distorcer."""
    import numpy as np

    pico = float(np.max(np.abs(amostras))) if amostras.size else 0.0
    if pico > 0.99:
        amostras = amostras * (0.99 / pico)
    pcm = np.round(amostras * 32767.0).astype("<i2")
    with wave.open(str(arquivo), "wb") as saida:
        saida.setnchannels(1)
        saida.setsampwidth(2)
        saida.setframerate(TAXA)
        saida.writeframes(pcm.tobytes())


def _rodar(comando: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(comando, capture_output=True, text=True, encoding="utf-8", errors="replace")


def medir_volume(wav: Path) -> dict | None:
    """Primeira passada do loudnorm. None quando a medida não serve (clipe curto demais)."""
    comando = [
        "ffmpeg", "-hide_banner", "-nostdin", "-i", str(wav),
        "-af", FILTRO_VOLUME + ":print_format=json", "-f", "null", "-",
    ]
    resultado = _rodar(comando)
    if resultado.returncode != 0:
        return None
    achado = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", resultado.stderr)
    if achado is None:
        return None
    try:
        medidas = json.loads(achado.group(0))
        for chave in ("input_i", "input_tp", "input_lra", "input_thresh", "target_offset"):
            if not math.isfinite(float(medidas[chave])):
                return None
    except (KeyError, ValueError):
        return None
    return medidas


def codificar_mp3(wav: Path, destino: Path) -> None:
    """Segunda passada do loudnorm (linear) e MP3 mono 24 kHz 64 kbps, sem metadados do WAV."""
    medidas = medir_volume(wav)
    if medidas is not None:
        filtro = (
            f"{FILTRO_VOLUME}:measured_I={medidas['input_i']}:measured_TP={medidas['input_tp']}"
            f":measured_LRA={medidas['input_lra']}:measured_thresh={medidas['input_thresh']}"
            f":offset={medidas['target_offset']}:linear=true"
        )
    else:
        filtro = FILTRO_VOLUME
    comando = [
        "ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error", "-y", "-i", str(wav),
        "-af", filtro, "-ac", "1", "-ar", str(TAXA), "-c:a", "libmp3lame", "-b:a", "64k",
        "-map_metadata", "-1", "-metadata", f"comment={COMENTARIO_MP3}", str(destino),
    ]
    resultado = _rodar(comando)
    if resultado.returncode != 0:
        raise RuntimeError("ffmpeg falhou: " + resultado.stderr.strip()[-500:])


def gerar_clipe(item: ItemDoPlano, cfg: dict, motor: Motor, pasta_temporaria: Path) -> float:
    """Sintetiza, normaliza e grava um clipe. Devolve a duração do áudio em segundos."""
    audio = montar_audio(item.clipe, cfg, motor)
    wav = pasta_temporaria / f"{item.clipe['id']}.wav"
    gravar_wav(audio, wav)
    item.destino.parent.mkdir(parents=True, exist_ok=True)
    provisorio = item.destino.with_name(item.destino.name[: -len(".mp3")] + SUFIXO_TEMPORARIO)
    try:
        codificar_mp3(wav, provisorio)
        # Troca atômica: um Ctrl+C no meio nunca deixa um MP3 pela metade com o nome final.
        os.replace(provisorio, item.destino)
    finally:
        provisorio.unlink(missing_ok=True)
        wav.unlink(missing_ok=True)
    return audio.size / TAXA


def finalizar_aula(plano: PlanoDaAula, caminhos: Caminhos, cfg: dict) -> None:
    """Apaga as versões antigas que já têm substituta e grava o manifesto da aula."""
    atuais = {item.clipe["id"]: item for item in plano.itens}
    for antigo in plano.antigos:
        achado = PADRAO_ARQUIVO.match(antigo.name)
        item = atuais.get(achado.group(1)) if achado else None
        if item is not None and item.destino.is_file():
            antigo.unlink(missing_ok=True)
            print(f"    apagado {antigo.name} (versão antiga)")
    manifesto = montar_manifesto(plano.aula, plano.tabela, cfg, caminhos.pasta_da_aula(plano.aula))
    mudou = gravar_json(caminhos.manifesto(plano.aula), manifesto)
    faltando = [item for item in plano.itens if not item.destino.is_file()]
    obrigatorios = sum(1 for item in faltando if item.clipe["obrigatorio"])
    texto = f"aula-{plano.aula:02d}: manifesto {'gravado' if mudou else 'sem mudança'}, {len(manifesto['clips'])} clipe(s)"
    if faltando:
        texto += f", faltam {len(faltando)} ({obrigatorios} obrigatório(s))"
    print(texto + ".")


# ---------------------------------------------------------------------------------------------
# Linha de comando
# ---------------------------------------------------------------------------------------------


def ler_argumentos(argv: list[str] | None) -> argparse.Namespace:
    leitor = argparse.ArgumentParser(
        prog="gerar.py",
        description="Gera os MP3 das aulas com o Kokoro (voz sintética local).",
    )
    escolha = leitor.add_mutually_exclusive_group(required=True)
    escolha.add_argument("--aula", type=int, action="append", metavar="N", help="aula de 1 a 42. Pode repetir.")
    escolha.add_argument("--todas", action="store_true", help="todas as aulas de 1 a 42.")
    leitor.add_argument(
        "--so-prioridade",
        dest="so_prioridade",
        action="append",
        choices=PRIORIDADES,
        help="gera só os clipes desta prioridade. Pode repetir.",
    )
    leitor.add_argument("--forcar", action="store_true", help="gera de novo mesmo se o arquivo já existir.")
    leitor.add_argument("--simular", action="store_true", help="só valida as tabelas e mostra o plano. Não grava nada.")
    leitor.add_argument("--raiz", type=Path, default=RAIZ_PADRAO, help="pasta app-web. Troque só em teste.")
    argumentos = leitor.parse_args(argv)
    if argumentos.aula:
        fora = [n for n in argumentos.aula if not 1 <= n <= TOTAL_DE_AULAS]
        if fora:
            leitor.error(f"aula fora de 1 a {TOTAL_DE_AULAS}: {', '.join(str(n) for n in fora)}")
    return argumentos


def main(argv: list[str] | None = None) -> int:
    configurar_saida()
    argumentos = ler_argumentos(argv)
    caminhos = Caminhos(argumentos.raiz.resolve())
    try:
        cfg = carregar_config_vozes()
    except (OSError, ValueError) as erro:
        print(f"ERRO: não consegui ler {ARQUIVO_CONFIG_VOZES}: {erro}")
        return 2

    aulas = list(range(1, TOTAL_DE_AULAS + 1)) if argumentos.todas else sorted(set(argumentos.aula))
    prioridades = set(argumentos.so_prioridade or [])
    ids_vistos = ids_das_outras_aulas(caminhos, set(aulas))
    planos = [
        montar_plano_da_aula(aula, caminhos, cfg, ids_vistos, prioridades, argumentos.forcar) for aula in aulas
    ]

    print("Simulação: nada será gravado." if argumentos.simular else "Geração de áudio com o Kokoro.")
    print(f"Pasta do app: {caminhos.raiz}")
    if prioridades:
        print(f"Só as prioridades: {', '.join(sorted(prioridades))}")
    print()
    imprimir_plano(planos, argumentos.simular)

    prontas = [p for p in planos if p.situacao == "pronta"]
    ausentes = [p for p in planos if p.situacao == "ausente"]
    invalidas = [p for p in planos if p.situacao == "invalida"]
    pendentes = [p for p in planos if p.situacao == "pendente"]
    a_gerar = [item for p in prontas for item in p.itens if item.acao == "GERAR"]
    total_de_clipes = sum(len(p.itens) for p in prontas)
    print()
    print(
        f"Resumo: {len(planos)} aula(s) pedida(s) · {len(prontas)} pronta(s) · {len(pendentes)} pendente(s)"
        f" · {len(ausentes)} ausente(s) · {len(invalidas)} com erro"
    )
    print(
        f"Clipes: {milhar(total_de_clipes)} no total · GERAR {milhar(len(a_gerar))}"
        f" · PULAR {milhar(sum(1 for p in prontas for i in p.itens if i.acao == 'PULAR'))}"
        f" · FORA {milhar(sum(1 for p in prontas for i in p.itens if i.acao == 'FORA'))}"
    )
    print(f"Tabelas ausentes: {len(ausentes)}")
    print(f"Tempo estimado na CPU: cerca de {formatar_tempo(sum(segundos_estimados(i.clipe) for i in a_gerar))}")

    # Tabela ausente só é erro quando a aula foi pedida pelo número.
    houve_erro = bool(invalidas) or (bool(ausentes) and not argumentos.todas)

    if argumentos.simular:
        problemas = problemas_do_ambiente()
        if problemas:
            print("Ambiente para gerar: incompleto (não impede a simulação).")
            for problema in problemas:
                print(f"    - {problema}")
        else:
            modelo, _ = localizar_modelo()
            print(f"Ambiente para gerar: pronto (modelo {modelo.name}).")
        print("Simulação: nada foi gravado.")
        return 1 if houve_erro else 0

    motor = None
    if a_gerar:
        problemas = problemas_do_ambiente()
        if problemas:
            print("ERRO: o ambiente não está pronto para gerar:")
            for problema in problemas:
                print(f"    - {problema}")
            return 2
        print("Carregando o modelo do Kokoro...")
        try:
            motor = carregar_motor(cfg)
        except ErroDeAmbiente as erro:
            print(f"ERRO: {erro}")
            return 2
        except Exception as erro:  # modelo corrompido, onnxruntime incompatível etc.
            print(f"ERRO ao carregar o Kokoro: {erro}")
            return 2
        print(f"Modelo: {motor.arquivo_modelo.name}")

    feitos = 0
    falhas = 0
    inicio = time.monotonic()
    with tempfile.TemporaryDirectory(prefix="wsa-audio-") as temporaria:
        pasta_temporaria = Path(temporaria)
        for plano in planos:
            if plano.situacao not in ("pronta", "pendente"):
                continue
            for sobra in plano.temporarios:
                sobra.unlink(missing_ok=True)
            for item in plano.itens:
                if item.acao != "GERAR":
                    continue
                comeco = time.monotonic()
                try:
                    duracao = gerar_clipe(item, cfg, motor, pasta_temporaria)
                except Exception as erro:  # um clipe com problema não para os outros
                    falhas += 1
                    feitos += 1
                    print(f"[{feitos}/{len(a_gerar)}] ERRO {item.clipe['id']}: {erro}")
                    continue
                feitos += 1
                decorrido = time.monotonic() - inicio
                restante = decorrido / feitos * (len(a_gerar) - feitos)
                print(
                    f"[{feitos}/{len(a_gerar)}] {item.clipe['id']} ok"
                    f" ({duracao:.1f} s de áudio em {time.monotonic() - comeco:.1f} s)"
                    f" · falta cerca de {formatar_tempo(restante)}"
                )
            finalizar_aula(plano, caminhos, cfg)

    print()
    print(
        f"Fim em {formatar_tempo(time.monotonic() - inicio)}. Gerados: {milhar(feitos - falhas)}"
        f" · falhas: {falhas} · tabelas com erro: {len(invalidas)}."
    )
    if falhas:
        print("Rode o mesmo comando de novo para tentar só os que faltam.")
    if feitos - falhas > 0:
        print("Próximo passo: npm run audio:conferir -- --todas")
    return 1 if (houve_erro or falhas) else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print()
        print("Interrompido. Os clipes já gravados ficam. Rode o mesmo comando de novo para continuar de onde parou.")
        sys.exit(130)
