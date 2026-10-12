#!/usr/bin/env python3
"""
Gera o áudio da conversa de exemplo da landing (seção "Conversa com IA").

Um MP3 só, com as falas na ordem e uma voz para cada lado: voz masculina para a IA, voz feminina
para "Você". As falas são lidas de src/components/landing/copy.ts (ia.chat), então o áudio diz
exatamente o que está escrito no cartão.

Grava:
  public/audio/landing/conversa.<hash8>.mp3
  src/components/landing/conversa-audio.json   caminho do MP3 e o começo e a duração de cada fala

O ConversaComRobo.tsx lê o manifesto para animar no compasso do áudio. Mudou o texto da conversa
no copy.ts? Rode de novo: tests/landing/conversa-audio.test.ts acusa o manifesto desatualizado.

Usa o motor, as vozes (vozes.json) e o tratamento de volume do pipeline das aulas (gerar.py), mas
fica fora das tabelas content/audio e do banco.

Uso, a partir da pasta app-web:
  scripts\\audio\\.venv\\Scripts\\python.exe -B scripts\\audio\\landing.py
"""

from __future__ import annotations

import hashlib
import os
import re
import sys
import tempfile
from pathlib import Path

import gerar

VOZ_POR_AUTOR = {"ia": "M1", "aluno": "F1"}
VELOCIDADE = "natural"

ARQUIVO_COPY = gerar.RAIZ_PADRAO / "src" / "components" / "landing" / "copy.ts"
ARQUIVO_MANIFESTO = gerar.RAIZ_PADRAO / "src" / "components" / "landing" / "conversa-audio.json"
PASTA_PUBLICA = gerar.RAIZ_PADRAO / "public" / "audio" / "landing"

PADRAO_CHAT = re.compile(r"\bchat: \[(.*?)\]", re.DOTALL)
PADRAO_FALA = re.compile(r"\{\s*autor: '(\w+)',\s*texto: '([^']*)'\s*\}")


def ler_falas() -> list[tuple[str, str]]:
    """Lista de (autor, texto) de ia.chat, na ordem da conversa."""
    bloco = PADRAO_CHAT.search(ARQUIVO_COPY.read_text(encoding="utf-8"))
    falas = PADRAO_FALA.findall(bloco.group(1)) if bloco else []
    if not falas:
        raise ValueError(f"{ARQUIVO_COPY.name}: não achei as falas de ia.chat.")
    for autor, _texto in falas:
        if autor not in VOZ_POR_AUTOR:
            raise ValueError(f"{ARQUIVO_COPY.name}: autor {autor!r} sem voz definida.")
    return falas


def main() -> int:
    gerar.configurar_saida()
    problemas = gerar.problemas_do_ambiente()
    if problemas:
        print("Ambiente incompleto:\n  " + "\n  ".join(problemas))
        return 2

    import numpy as np

    cfg = gerar.carregar_config_vozes()
    velocidade = float(cfg["velocidades"][VELOCIDADE])
    pausa_ms = int(cfg["pausaEntreFalasMs"])
    falas = [(autor, cfg["vozes"][VOZ_POR_AUTOR[autor]], texto) for autor, texto in ler_falas()]

    # O nome leva o hash do que muda o som, como nas aulas: /audio/ é servido com cache de um ano.
    base = "\n".join(f"{voz}|{gerar.formatar_velocidade(velocidade)}|{texto}" for _, voz, texto in falas)
    hash8 = hashlib.sha256(f"{base}\n#pausa={pausa_ms}".encode("utf-8")).hexdigest()[:8]
    destino = PASTA_PUBLICA / f"conversa.{hash8}.mp3"

    motor = gerar.carregar_motor(cfg)
    partes = [gerar.silencio(gerar.RESPIRO_MS)]
    amostras = partes[0].size
    marcas = []
    for indice, (autor, voz, texto) in enumerate(falas):
        trecho = gerar.aparar_silencio(motor.sintetizar(voz, gerar.texto_para_motor(texto), velocidade))
        if trecho.size < gerar.TAXA * gerar.MINIMO_DE_FALA_S:
            raise RuntimeError(f"o motor devolveu áudio vazio ou curto demais para {texto!r}.")
        if indice > 0:
            partes.append(gerar.silencio(pausa_ms))
            amostras += partes[-1].size
        marcas.append(
            {
                "autor": autor,
                "voz": voz,
                "texto": texto,
                "inicioMs": round(amostras * 1000 / gerar.TAXA),
                "duracaoMs": round(trecho.size * 1000 / gerar.TAXA),
            }
        )
        partes.append(trecho)
        amostras += trecho.size
    partes.append(gerar.silencio(gerar.RESPIRO_MS))
    audio = np.concatenate(partes).astype(np.float32)

    PASTA_PUBLICA.mkdir(parents=True, exist_ok=True)
    provisorio = destino.with_name(destino.name[: -len(".mp3")] + gerar.SUFIXO_TEMPORARIO)
    with tempfile.TemporaryDirectory() as pasta:
        wav = Path(pasta) / "conversa.wav"
        gerar.gravar_wav(audio, wav)
        try:
            gerar.codificar_mp3(wav, provisorio)
            os.replace(provisorio, destino)
        finally:
            provisorio.unlink(missing_ok=True)
    for antigo in PASTA_PUBLICA.glob("conversa.*.mp3"):
        if antigo != destino:
            antigo.unlink()

    gerar.gravar_json(
        ARQUIVO_MANIFESTO,
        {
            "src": f"/audio/landing/{destino.name}",
            "duracaoMs": round(audio.size * 1000 / gerar.TAXA),
            "falas": marcas,
        },
    )
    print(f"{destino.relative_to(gerar.RAIZ_PADRAO)}: {audio.size / gerar.TAXA:.2f} s")
    for marca in marcas:
        print(f"  {marca['inicioMs']:>5} ms  {marca['duracaoMs']:>5} ms  {marca['voz']:<11} {marca['texto']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
