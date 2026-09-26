"""Monta o pacote de trabalho de cada aula para o casamento vaga × recorte.

Para cada página do e-book da aula:
  - acha a posição de cada recorte na página (template matching, nota 1.000
    quando o recorte é um pedaço exato da página);
  - desenha a página com a caixa e o número de cada recorte e uma grade de
    coordenadas a cada 100 px (`pagina-PP.png`), para quem precisar pedir um
    recorte novo por caixa;
  - monta a folha de contato dos recortes sobre xadrez (`recortes-PP.png`),
    que mostra o que é transparente.

E escreve `recortes.json` (posição, tamanho e transparência de cada recorte)
e `pacote.md` (vagas de cada página do app com o `ph`, lado a lado com os
recortes da página do e-book correspondente).

Uso: python scripts/imagens/preparar.py [aulas]   ex.: 5  |  1-42  |  3 7 9
Saída: var/imagens/aula-NN/
"""
import json
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

from comum import (
    PASTA_DE_TRABALHO, abrir_pagina_rgb, arquivo_da_pagina, aulas_do_argumento,
    fonte, ler_vagas, pagina_do_ebook, paginas_do_ebook, recortes_da_pagina,
    sobre_quadriculado,
)

COR_DA_CAIXA = (230, 0, 126)
COR_DA_GRADE = (0, 170, 200)


def localizar(pagina_cinza, recorte):
    cinza = cv2.cvtColor(np.array(recorte.convert('RGB')), cv2.COLOR_RGB2GRAY)
    ph, pw = pagina_cinza.shape
    h, w = cinza.shape
    if h > ph or w > pw:
        return None, 0.0
    resultado = cv2.matchTemplate(pagina_cinza, cinza, cv2.TM_CCOEFF_NORMED)
    _, nota, _, (x, y) = cv2.minMaxLoc(resultado)
    return (x, y, x + w, y + h), float(nota)


def transparencia(recorte):
    if recorte.mode != 'RGBA':
        return 0
    alfa = np.array(recorte)[:, :, 3]
    return round(100 * float((alfa < 250).mean()))


def desenhar_pagina(pagina, recortes, destino):
    tela = pagina.copy()
    desenho = ImageDraw.Draw(tela, 'RGBA')
    largura, altura = tela.size
    pequena = fonte(15, negrito=True)
    for x in range(100, largura, 100):
        desenho.line([(x, 0), (x, altura)], fill=COR_DA_GRADE + (70,), width=1)
        desenho.text((x + 2, 2), str(x), fill=COR_DA_GRADE + (255,), font=pequena)
    for y in range(100, altura, 100):
        desenho.line([(0, y), (largura, y)], fill=COR_DA_GRADE + (70,), width=1)
        desenho.text((2, y + 2), str(y), fill=COR_DA_GRADE + (255,), font=pequena)
    rotulo = fonte(24, negrito=True)
    for r in recortes:
        if not r['caixa']:
            continue
        x0, y0, x1, y1 = r['caixa']
        desenho.rectangle([x0, y0, x1 - 1, y1 - 1], outline=COR_DA_CAIXA + (255,), width=3)
        texto = r['k']
        tx0, ty0, tx1, ty1 = desenho.textbbox((0, 0), texto, font=rotulo)
        lx, ly = x0, max(0, y0 - (ty1 - ty0) - 8) if (x1 - x0) < 60 else y0
        desenho.rectangle([lx, ly, lx + tx1 - tx0 + 8, ly + ty1 - ty0 + 8], fill=COR_DA_CAIXA + (235,))
        desenho.text((lx + 4 - tx0, ly + 4 - ty0), texto, fill=(255, 255, 255), font=rotulo)
    tela.save(destino, optimize=True)


def folha_de_contato(recortes, imagens, destino):
    colunas, celula_l, celula_a, area = 4, 250, 250, 210
    linhas = max(1, -(-len(recortes) // colunas))
    folha = Image.new('RGB', (colunas * celula_l, linhas * celula_a), (255, 255, 255))
    desenho = ImageDraw.Draw(folha)
    texto_fonte = fonte(15, negrito=True)
    for i, (r, im) in enumerate(zip(recortes, imagens)):
        cx, cy = (i % colunas) * celula_l, (i // colunas) * celula_a
        escala = min(area / im.width, (area - 20) / im.height, 3)
        miniatura = im.resize((max(1, int(im.width * escala)), max(1, int(im.height * escala))), Image.LANCZOS)
        miniatura = sobre_quadriculado(miniatura)
        folha.paste(miniatura, (cx + (celula_l - miniatura.width) // 2, cy + 6))
        legenda = f"{r['k']}  {r['w']}×{r['h']}" + (f"  {r['transp']}% transp" if r['transp'] else '')
        desenho.text((cx + 8, cy + celula_a - 24), legenda, fill=(20, 20, 20), font=texto_fonte)
        desenho.rectangle([cx, cy, cx + celula_l - 1, cy + celula_a - 1], outline=(200, 200, 205))
    folha.save(destino, optimize=True)


def preparar(aula, vagas):
    pasta = PASTA_DE_TRABALHO / f'aula-{aula:02d}'
    pasta.mkdir(parents=True, exist_ok=True)
    dados = {}
    for pagina in paginas_do_ebook(aula):
        arquivo = arquivo_da_pagina(aula, pagina)
        imagem_da_pagina = abrir_pagina_rgb(arquivo)
        cinza = cv2.cvtColor(np.array(imagem_da_pagina), cv2.COLOR_RGB2GRAY)
        recortes, imagens = [], []
        for caminho in recortes_da_pagina(aula, pagina):
            recorte = Image.open(caminho)
            recorte.load()
            caixa, nota = localizar(cinza, recorte)
            recortes.append({
                'k': caminho.stem.rsplit('_', 1)[1], 'arquivo': caminho.name,
                'w': recorte.width, 'h': recorte.height, 'transp': transparencia(recorte),
                'caixa': list(caixa) if caixa and nota > 0.9 else None, 'nota': round(nota, 3),
            })
            imagens.append(recorte)
        dados[str(pagina)] = {'arquivo': arquivo.name, 'tamanho': list(imagem_da_pagina.size), 'recortes': recortes}
        desenhar_pagina(imagem_da_pagina, recortes, pasta / f'pagina-{pagina:02d}.png')
        if recortes:
            folha_de_contato(recortes, imagens, pasta / f'recortes-{pagina:02d}.png')
    (pasta / 'recortes.json').write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding='utf-8')
    (pasta / 'pacote.md').write_text(pacote(aula, vagas, dados), encoding='utf-8')
    sem_lugar = sum(1 for p in dados.values() for r in p['recortes'] if not r['caixa'])
    total = sum(len(p['recortes']) for p in dados.values())
    return total, sem_lugar


def pacote(aula, vagas, dados):
    info = vagas[aula]
    linhas = [
        f"# Aula {aula:02d} · {info['titulo']}", '',
        f"Pasta de trabalho: `var/imagens/aula-{aula:02d}/`. Para cada página do e-book PP há",
        '`pagina-PP.png` (página inteira com a caixa rosa e o número de cada recorte e uma grade',
        'de coordenadas a cada 100 px) e `recortes-PP.png` (os recortes sobre xadrez).', '',
    ]
    for pagina in info['paginas']:
        pe = pagina_do_ebook(aula, pagina['pagina'])
        linhas.append(f"## Página {pagina['pagina']} do app → página {pe if pe else '(nenhuma)'} do e-book")
        linhas.append('')
        linhas.append(f"Texto da página: {pagina['resumo']}")
        linhas.append('')
        if pagina['vagas']:
            linhas.append('Vagas:')
            for v in pagina['vagas']:
                onde = v['tipo'] + (f" item {v['item'] + 1}" if v['item'] is not None else '')
                if v.get('colunas'):
                    onde += f", grade de {v['colunas']} coluna(s)"
                linhas.append(f"- **{v['id']}** ({onde}) · {v['ph']}")
                if v.get('contexto') and v['item'] is not None:
                    linhas.append(f"  - texto do item: {v['contexto']}")
                if v['src']:
                    linhas.append(f"  - JÁ TEM IMAGEM: `{v['src']}` (alt: {v['alt']})")
        else:
            linhas.append('Vagas: nenhuma.')
        linhas.append('')
        if pe and str(pe) in dados:
            d = dados[str(pe)]
            linhas.append(f"Recortes da página {pe} do e-book ({d['arquivo']}, {d['tamanho'][0]}×{d['tamanho'][1]}):")
            for r in d['recortes']:
                pos = f"caixa {r['caixa']}" if r['caixa'] else f"NÃO ACHADO NA PÁGINA (nota {r['nota']})"
                transp = f", {r['transp']}% transparente" if r['transp'] else ''
                linhas.append(f"- {r['k']}: {r['w']}×{r['h']}{transp}, {pos}")
            linhas.append('')
    return '\n'.join(linhas) + '\n'


if __name__ == '__main__':
    vagas = ler_vagas()
    for aula in aulas_do_argumento(sys.argv[1:]):
        total, sem_lugar = preparar(aula, vagas)
        aviso = f', {sem_lugar} sem posição na página' if sem_lugar else ''
        print(f'Aula {aula:02d}: {total} recortes{aviso}')
