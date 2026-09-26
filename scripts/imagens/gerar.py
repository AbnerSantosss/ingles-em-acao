"""Gera as imagens das vagas de uma aula a partir da decisão gravada.

Lê `content/imagens/decisoes/aula-NN.json`:

    {
      "aula": 5,
      "vagas": {
        "a5p1":  {"pagina": 1, "recortes": ["02"], "alt": "..."},
        "a5p3":  {"pagina": 3, "recortes": ["10", "11"], "alt": "..."},
        "a5p4a": {"pagina": 4, "caixa": [40, 300, 520, 610], "alt": "..."},
        "a5p6":  {"pagina": 6, "recortes": ["04"], "caixas": [[560, 390, 706, 541]], "alt": "..."},
        "w10p1": {"manter": true},
        "a5p9":  {"sem": "o e-book não tem figura nesse lugar"}
      },
      "sobras": [{"pagina": 2, "recortes": ["07"], "nota": "..."}]
    }

`pagina` é a página do E-BOOK. `recortes` junta os recortes indicados na
posição que eles têm na página, mantendo a transparência. `caixa`
([x0, y0, x1, y1], em pixels da página) corta direto da página, opaca: serve
quando o recorte pegou só parte da figura ou não existe. `caixas` (lista de
caixas) corta vários pedaços da página e junta na posição que eles têm, sozinha
ou com `recortes`: serve para tirar do meio da figura um texto ou um ícone de
interface, ou para somar um pedaço que ficou sem recorte. `manter` só vale
para vaga que já tem imagem.

Grava `public/lessons/aulas/aula-NN/<id>.webp` e a folha de prova
`var/imagens/aula-NN/prova-KK.png` (vaga, `ph`, `alt` e a imagem gerada, lado
a lado), e apaga os `.webp` da aula que não têm mais decisão.

Uso: python scripts/imagens/gerar.py 5   (ou 1-42, ou 3 7 9)
"""
import json
import sys

from PIL import Image, ImageDraw

from comum import (
    PASTA_DE_DECISOES, PASTA_DE_TRABALHO, PASTA_PUBLICA, RAIZ_DO_APP,
    abrir_pagina_rgb, arquivo_da_pagina, aulas_do_argumento, fonte, ler_recortes,
    ler_vagas, recortes_da_pagina, sobre_quadriculado,
)

LARGURA_MAXIMA = 1400
CHAVES = {'pagina', 'recortes', 'caixa', 'caixas', 'alt', 'manter', 'sem'}


class DecisaoInvalida(Exception):
    pass


def erro_da_caixa(caixa, tamanho):
    if (not isinstance(caixa, list) or len(caixa) != 4
            or not all(isinstance(n, (int, float)) for n in caixa)):
        return 'precisa ser [x0, y0, x1, y1]'
    largura, altura = tamanho
    x0, y0, x1, y1 = caixa
    if not (0 <= x0 < x1 <= largura and 0 <= y0 < y1 <= altura):
        return f'{caixa} fora da página ({largura}×{altura})'
    if x1 - x0 < 16 or y1 - y0 < 16:
        return f'{caixa} pequena demais'
    return None


def validar(aula, info, decisoes, recortes):
    vagas = {v['id']: (p['pagina'], v) for p in info['paginas'] for v in p['vagas']}
    erros = []
    faltando = [i for i in vagas if i not in decisoes]
    if faltando:
        erros.append(f'vagas sem decisão: {", ".join(faltando)}')
    for id_, d in decisoes.items():
        if id_ not in vagas:
            erros.append(f'{id_}: não é vaga da Aula {aula}')
            continue
        if not isinstance(d, dict):
            erros.append(f'{id_}: a decisão precisa ser um objeto')
            continue
        extras = set(d) - CHAVES
        if extras:
            erros.append(f'{id_}: chave desconhecida {sorted(extras)}')
        juntar = [m for m in ('recortes', 'caixas') if m in d]
        modos = (['+'.join(juntar)] if juntar else []) + [m for m in ('caixa', 'manter', 'sem') if m in d]
        if len(modos) != 1:
            erros.append(f'{id_}: use exatamente um entre recortes (com ou sem caixas), caixas, caixa, manter e sem (veio {modos})')
            continue
        modo = 'juntar' if juntar else modos[0]
        if modo == 'manter':
            if not vagas[id_][1]['src']:
                erros.append(f'{id_}: "manter" só vale para vaga que já tem imagem')
            continue
        if modo == 'sem':
            if not isinstance(d['sem'], str) or len(d['sem'].strip()) < 5:
                erros.append(f'{id_}: "sem" precisa do motivo por escrito')
            continue
        alt = d.get('alt')
        if not isinstance(alt, str) or not 5 <= len(alt.strip()) <= 180:
            erros.append(f'{id_}: "alt" obrigatório, de 5 a 180 caracteres')
        pagina = d.get('pagina')
        if str(pagina) not in recortes:
            erros.append(f'{id_}: página {pagina} não existe no e-book da Aula {aula}')
            continue
        dados = recortes[str(pagina)]
        if modo == 'juntar':
            ks = d.get('recortes', [])
            caixas = d.get('caixas', [])
            if not isinstance(ks, list) or ('recortes' in d and not ks):
                erros.append(f'{id_}: "recortes" precisa ser uma lista de números, ex.: ["03"]')
                continue
            if not isinstance(caixas, list) or ('caixas' in d and not caixas):
                erros.append(f'{id_}: "caixas" precisa ser uma lista de [x0, y0, x1, y1]')
                continue
            pedacos = len(ks) + len(caixas)
            existentes = {r['k']: r for r in dados['recortes']}
            for k in ks:
                k = str(k).zfill(2)
                if k not in existentes:
                    erros.append(f'{id_}: recorte {k} não existe na página {pagina}')
                elif pedacos > 1 and not existentes[k]['caixa']:
                    erros.append(f'{id_}: recorte {k} não tem posição na página, não dá para juntar')
            for caixa in caixas:
                problema = erro_da_caixa(caixa, dados['tamanho'])
                if problema:
                    erros.append(f'{id_}: caixa {problema}')
        else:
            problema = erro_da_caixa(d['caixa'], dados['tamanho'])
            if problema:
                erros.append(f'{id_}: caixa {problema}')
    if erros:
        raise DecisaoInvalida('\n'.join(f'  - {e}' for e in erros))
    return vagas


def montar(aula, d, recortes, paginas_abertas):
    pagina = d['pagina']
    dados = recortes[str(pagina)]

    def cortar(caixa):
        if pagina not in paginas_abertas:
            paginas_abertas[pagina] = abrir_pagina_rgb(arquivo_da_pagina(aula, pagina))
        return paginas_abertas[pagina].crop(tuple(caixa))

    if 'caixa' in d:
        return cortar([int(round(n)) for n in d['caixa']])
    por_k = {r['k']: r for r in dados['recortes']}
    arquivos = {c.stem.rsplit('_', 1)[1]: c for c in recortes_da_pagina(aula, pagina)}
    ks = [str(k).zfill(2) for k in d.get('recortes', [])]
    caixas = [[int(round(n)) for n in c] for c in d.get('caixas', [])]
    if len(ks) == 1 and not caixas:
        imagem = Image.open(arquivos[ks[0]])
        imagem.load()
        return imagem
    # Cada pedaço vai para a posição que tem na página, sobre fundo transparente.
    pedacos = [(Image.open(arquivos[k]).convert('RGBA'), por_k[k]['caixa']) for k in ks]
    pedacos += [(cortar(c).convert('RGBA'), c) for c in caixas]
    ux0, uy0 = min(c[0] for _, c in pedacos), min(c[1] for _, c in pedacos)
    ux1, uy1 = max(c[2] for _, c in pedacos), max(c[3] for _, c in pedacos)
    tela = Image.new('RGBA', (ux1 - ux0, uy1 - uy0), (0, 0, 0, 0))
    for pedaco, c in pedacos:
        tela.alpha_composite(pedaco, (c[0] - ux0, c[1] - uy0))
    return tela


def salvar_webp(imagem, destino):
    if imagem.mode == 'RGBA' and imagem.getchannel('A').getextrema()[0] >= 250:
        imagem = imagem.convert('RGB')
    elif imagem.mode not in ('RGB', 'RGBA'):
        imagem = imagem.convert('RGBA')
    if imagem.width > LARGURA_MAXIMA:
        escala = LARGURA_MAXIMA / imagem.width
        imagem = imagem.resize((LARGURA_MAXIMA, round(imagem.height * escala)), Image.LANCZOS)
    imagem.save(destino, 'WEBP', quality=90, method=6)
    return imagem.size


def quebrar(texto, fonte_, largura, desenho):
    linhas, atual = [], ''
    for palavra in texto.split():
        teste = f'{atual} {palavra}'.strip()
        if desenho.textlength(teste, font=fonte_) <= largura:
            atual = teste
        else:
            if atual:
                linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas


def folhas_de_prova(aula, itens, pasta):
    for velha in pasta.glob('prova-*.png'):
        velha.unlink()
    por_folha, colunas, cel_l, cel_a, area = 8, 2, 820, 340, 320
    negrito, normal = fonte(20, negrito=True), fonte(16)
    for n in range(0, len(itens), por_folha):
        lote = itens[n:n + por_folha]
        linhas = -(-len(lote) // colunas)
        folha = Image.new('RGB', (colunas * cel_l, linhas * cel_a), (255, 255, 255))
        desenho = ImageDraw.Draw(folha)
        for i, item in enumerate(lote):
            cx, cy = (i % colunas) * cel_l, (i // colunas) * cel_a
            desenho.rectangle([cx, cy, cx + cel_l - 1, cy + cel_a - 1], outline=(190, 190, 200))
            imagem = item['imagem']
            if imagem is not None:
                escala = min(area / imagem.width, area / imagem.height, 2.5)
                mini = imagem.resize((max(1, int(imagem.width * escala)), max(1, int(imagem.height * escala))), Image.LANCZOS)
                mini = sobre_quadriculado(mini)
                folha.paste(mini, (cx + 10 + (area - mini.width) // 2, cy + 10 + (area - mini.height) // 2))
            else:
                desenho.rectangle([cx + 10, cy + 10, cx + 10 + area, cy + 10 + area], fill=(255, 235, 235))
                desenho.text((cx + 110, cy + 160), 'SEM IMAGEM', fill=(200, 0, 0), font=negrito)
            tx, ty, largura = cx + area + 24, cy + 10, cel_l - area - 34
            desenho.text((tx, ty), item['titulo'], fill=(10, 10, 60), font=negrito)
            ty += 28
            for bloco, cor in ((item['origem'], (0, 110, 140)), ('ph: ' + item['ph'], (40, 40, 40)), (item['nota'], (150, 0, 90))):
                for linha in quebrar(bloco, normal, largura, desenho):
                    if ty > cy + cel_a - 22:
                        break
                    desenho.text((tx, ty), linha, fill=cor, font=normal)
                    ty += 20
                ty += 6
        folha.save(pasta / f'prova-{n // por_folha + 1:02d}.png', optimize=True)


def gerar(aula, vagas_por_aula):
    caminho = PASTA_DE_DECISOES / f'aula-{aula:02d}.json'
    if not caminho.exists():
        raise DecisaoInvalida(f'  - falta {caminho.relative_to(RAIZ_DO_APP)}')
    documento = json.loads(caminho.read_text(encoding='utf-8'))
    decisoes = documento.get('vagas', {})
    recortes = ler_recortes(aula)
    vagas = validar(aula, vagas_por_aula[aula], decisoes, recortes)
    destino = PASTA_PUBLICA / f'aula-{aula:02d}'
    destino.mkdir(parents=True, exist_ok=True)
    paginas_abertas, itens, feitos = {}, [], set()
    contagem = {'imagem': 0, 'manter': 0, 'sem': 0}
    for id_, (pagina_app, vaga) in vagas.items():
        d = decisoes[id_]
        titulo = f'{id_} · pág. {pagina_app} do app ({vaga["tipo"]})'
        if 'sem' in d:
            contagem['sem'] += 1
            itens.append({'imagem': None, 'titulo': titulo, 'origem': 'sem imagem', 'ph': vaga['ph'], 'nota': 'motivo: ' + d['sem']})
            continue
        if 'manter' in d:
            contagem['manter'] += 1
            atual = RAIZ_DO_APP / 'public' / vaga['src'].lstrip('/')
            imagem = Image.open(atual) if atual.exists() else None
            itens.append({'imagem': imagem, 'titulo': titulo, 'origem': f'mantida: {vaga["src"]}', 'ph': vaga['ph'], 'nota': 'alt: ' + (vaga['alt'] or '')})
            continue
        imagem = montar(aula, d, recortes, paginas_abertas)
        largura, altura = salvar_webp(imagem, destino / f'{id_}.webp')
        feitos.add(f'{id_}.webp')
        contagem['imagem'] += 1
        partes = []
        if 'recortes' in d:
            partes.append(f'recortes {"+".join(str(k).zfill(2) for k in d["recortes"])}')
        if 'caixas' in d:
            partes.append(f'caixas {" + ".join(str(c) for c in d["caixas"])}')
        if 'caixa' in d:
            partes.append(f'caixa {d["caixa"]}')
        origem = f'e-book pág. {d["pagina"]}, {", ".join(partes)}'
        itens.append({'imagem': imagem, 'titulo': titulo, 'origem': f'{origem} → {largura}×{altura}', 'ph': vaga['ph'], 'nota': 'alt: ' + d['alt']})
    for velho in destino.glob('*.webp'):
        if velho.name not in feitos:
            velho.unlink()
    if not any(destino.iterdir()):
        destino.rmdir()
    pasta = PASTA_DE_TRABALHO / f'aula-{aula:02d}'
    folhas_de_prova(aula, itens, pasta)
    return contagem, -(-len(itens) // 8)


if __name__ == '__main__':
    vagas_por_aula = ler_vagas()
    falhou = False
    for aula in aulas_do_argumento(sys.argv[1:]):
        try:
            contagem, folhas = gerar(aula, vagas_por_aula)
        except DecisaoInvalida as erro:
            falhou = True
            print(f'Aula {aula:02d}: DECISÃO INVÁLIDA\n{erro}')
            continue
        print(f'Aula {aula:02d}: {contagem["imagem"]} imagens, {contagem["manter"]} mantidas, '
              f'{contagem["sem"]} sem imagem · prova em var/imagens/aula-{aula:02d}/prova-01..{folhas:02d}.png')
    sys.exit(1 if falhou else 0)
