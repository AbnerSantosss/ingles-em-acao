"""Caminhos e leituras comuns aos scripts de imagem do e-book.

Os recortes vêm de `Páginas do App/Aulas/Aula_NN/fotos_cortadas/Aula_NN_Pagina_PP/`.
Cada recorte é um pedaço exato (mesma escala) da página inteira
`Aula_NN/Aula_NN_Pagina_PP.png` (ou `.jpeg`), por isso dá para achar a posição
dele na página por template matching com nota 1.000.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFont

# O console do Windows não é UTF-8 por padrão e estraga os acentos das mensagens.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

RAIZ_DO_APP = Path(__file__).resolve().parents[2]
PASTA_DO_EBOOK = RAIZ_DO_APP.parent / 'Páginas do App' / 'Aulas'
PASTA_DE_TRABALHO = RAIZ_DO_APP / 'var' / 'imagens'
PASTA_DE_DECISOES = RAIZ_DO_APP / 'content' / 'imagens' / 'decisoes'
PASTA_PUBLICA = RAIZ_DO_APP / 'public' / 'lessons' / 'aulas'
URL_PUBLICA = '/lessons/aulas'

# Página do app → página do e-book, quando não é a mesma.
# Aula 04: a página 4 do e-book não entrou no app (pendência 26).
# Aula 38: a página 13 do app é o fechamento padrão, que o e-book não tem.
MAPA_ESPECIAL = {
    4: {4: 5, 5: 6, 6: 7, 7: 8},
    38: {13: None},
}


def pagina_do_ebook(aula, pagina_do_app):
    return MAPA_ESPECIAL.get(aula, {}).get(pagina_do_app, pagina_do_app)


def pasta_da_aula(aula):
    return PASTA_DO_EBOOK / f'Aula_{aula:02d}'


def _nomes_da_pagina(aula, pagina):
    # Quatro páginas vieram com três dígitos (Aula_13_Pagina_010, Aula_23_Pagina_013...).
    return [f'Aula_{aula:02d}_Pagina_{pagina:02d}', f'Aula_{aula:02d}_Pagina_{pagina:03d}']


def arquivo_da_pagina(aula, pagina):
    pasta = pasta_da_aula(aula)
    for nome in _nomes_da_pagina(aula, pagina):
        for ext in ('.png', '.jpeg', '.jpg'):
            caminho = pasta / f'{nome}{ext}'
            if caminho.exists():
                return caminho
    return None


def paginas_do_ebook(aula):
    pasta = pasta_da_aula(aula)
    numeros = set()
    for arq in pasta.glob(f'Aula_{aula:02d}_Pagina_*'):
        if arq.is_file():
            numeros.add(int(arq.stem.rsplit('_', 1)[1]))
    return sorted(numeros)


def recortes_da_pagina(aula, pagina):
    for nome in _nomes_da_pagina(aula, pagina):
        pasta = pasta_da_aula(aula) / 'fotos_cortadas' / nome
        if pasta.exists():
            return sorted(pasta.glob('*.png'))
    return []


def abrir_pagina_rgb(caminho):
    imagem = Image.open(caminho)
    if imagem.mode in ('RGBA', 'LA', 'P'):
        imagem = imagem.convert('RGBA')
        fundo = Image.new('RGBA', imagem.size, (255, 255, 255, 255))
        imagem = Image.alpha_composite(fundo, imagem)
    return imagem.convert('RGB')


def fonte(tamanho, negrito=False):
    nome = 'arialbd.ttf' if negrito else 'arial.ttf'
    try:
        return ImageFont.truetype(nome, tamanho)
    except OSError:
        return ImageFont.load_default()


def ler_vagas():
    caminho = PASTA_DE_TRABALHO / 'vagas.json'
    if not caminho.exists():
        raise SystemExit('Falta var/imagens/vagas.json. Rode antes: node scripts/imagens/vagas.mjs')
    return {a['aula']: a for a in json.loads(caminho.read_text(encoding='utf-8'))}


def ler_recortes(aula):
    caminho = PASTA_DE_TRABALHO / f'aula-{aula:02d}' / 'recortes.json'
    if not caminho.exists():
        raise SystemExit(f'Falta {caminho}. Rode antes: python scripts/imagens/preparar.py {aula}')
    return json.loads(caminho.read_text(encoding='utf-8'))


def quadriculado(tamanho, lado=12):
    """Fundo xadrez cinza-claro, para a transparência aparecer na conferência."""
    largura, altura = tamanho
    ys, xs = np.mgrid[0:altura, 0:largura]
    escuro = ((xs // lado) + (ys // lado)) % 2 == 1
    matriz = np.full((altura, largura, 3), 255, dtype=np.uint8)
    matriz[escuro] = (226, 228, 234)
    return Image.fromarray(matriz, 'RGB')


def sobre_quadriculado(imagem):
    fundo = quadriculado(imagem.size)
    if imagem.mode != 'RGBA':
        imagem = imagem.convert('RGBA')
    fundo.paste(imagem, (0, 0), imagem)
    return fundo


def aulas_do_argumento(argumentos):
    if not argumentos:
        return list(range(1, 43))
    aulas = []
    for arg in argumentos:
        if '-' in arg:
            a, b = arg.split('-')
            aulas.extend(range(int(a), int(b) + 1))
        else:
            aulas.append(int(arg))
    return aulas
