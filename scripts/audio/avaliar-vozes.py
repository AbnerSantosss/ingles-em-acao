# Escolhe as vozes do Kokoro por critério objetivo: cada voz candidata fala as mesmas frases de
# aula, o faster-whisper (base.en) transcreve e conta quantas palavras voltaram certas. A voz que
# o reconhecedor entende melhor é, na prática, a de pronúncia mais clara para o aluno iniciante.
# Empate fica com a ordem de preferência (af_heart e am_michael primeiro).
#
# Uso (da pasta app-web):
#   scripts/audio/.venv/Scripts/python.exe -B scripts/audio/avaliar-vozes.py [pasta-das-amostras]
#
# Grava scripts/audio/vozes.json com F1, F2, M1, M2 e o registro das notas em "escolha".

import json
import re
import sys
from datetime import date
from pathlib import Path

import soundfile as sf
from faster_whisper import WhisperModel
from kokoro_onnx import Kokoro

PASTA = Path(__file__).resolve().parent
PASTA_MODELOS = PASTA / "modelos"
ARQUIVO_VOZES = PASTA / "vozes.json"

FEMININAS = ["af_heart", "af_bella", "af_sarah", "af_nicole"]
MASCULINAS = ["am_michael", "am_fenrir", "am_puck", "am_adam"]
VELOCIDADE_NATURAL = 0.92
VELOCIDADE_REDUZIDA = 0.8

# Frases no nível das 42 aulas: verbo to be, presente simples, perguntas, passado.
FRASES = [
    "Hello, my name is Anna. I am from Brazil.",
    "Where are you from? I am from New York.",
    "She is a teacher and they are students.",
    "What time is it? It is half past seven.",
    "Do you like coffee? Yes, I do.",
    "My brother works at the hospital every day.",
    "We went to the beach last weekend.",
    "I did not go to school yesterday because I was sick.",
    "There are three books on the table.",
    "Can you open the window, please?",
]


def normalizar(texto):
    texto = texto.lower().replace("'", "")
    return re.sub(r"[^a-z0-9 ]+", " ", texto).split()


def distancia(a, b):
    # Distância de edição por palavra (Levenshtein).
    anterior = list(range(len(b) + 1))
    for i, pa in enumerate(a, 1):
        atual = [i]
        for j, pb in enumerate(b, 1):
            atual.append(min(anterior[j] + 1, atual[j - 1] + 1, anterior[j - 1] + (pa != pb)))
        anterior = atual
    return anterior[-1]


def main():
    pasta_amostras = Path(sys.argv[1]) if len(sys.argv) > 1 else PASTA / "amostras-temp"
    pasta_amostras.mkdir(parents=True, exist_ok=True)

    kokoro = Kokoro(str(PASTA_MODELOS / "kokoro-v1.0.onnx"), str(PASTA_MODELOS / "voices-v1.0.bin"))
    whisper = WhisperModel(
        "base.en", device="cpu", compute_type="int8", download_root=str(PASTA_MODELOS / "whisper")
    )

    total_palavras = sum(len(normalizar(f)) for f in FRASES)
    notas = {}
    for voz in FEMININAS + MASCULINAS:
        erros = 0
        for n, frase in enumerate(FRASES, 1):
            amostras, taxa = kokoro.create(frase, voice=voz, speed=VELOCIDADE_NATURAL, lang="en-us")
            arquivo = pasta_amostras / f"{voz}-{n:02d}.wav"
            sf.write(str(arquivo), amostras, taxa)
            trechos, _ = whisper.transcribe(str(arquivo), language="en", beam_size=5)
            ouvido = " ".join(t.text for t in trechos)
            erros += distancia(normalizar(frase), normalizar(ouvido))
        acerto = round(100 * (1 - erros / total_palavras), 2)
        notas[voz] = acerto
        print(f"{voz:12s} acerto {acerto:6.2f}%  ({erros} erros em {total_palavras} palavras)")

    # sorted é estável: em empate, vale a ordem das listas (preferência).
    fem = sorted(FEMININAS, key=lambda v: -notas[v])
    mas = sorted(MASCULINAS, key=lambda v: -notas[v])

    dados = {
        "vozes": {"F1": fem[0], "F2": fem[1], "M1": mas[0], "M2": mas[1]},
        "velocidades": {"natural": VELOCIDADE_NATURAL, "reduzida": VELOCIDADE_REDUZIDA},
        "pausaEntreFalasMs": 350,
        "pausaEntreItensMs": 600,
        "escolha": {
            "data": date.today().isoformat(),
            "criterio": "acerto de palavras na transcricao do faster-whisper base.en int8",
            "frases": len(FRASES),
            "acertoPorVoz": notas,
        },
    }
    ARQUIVO_VOZES.write_text(json.dumps(dados, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("vozes escolhidas:", dados["vozes"])


if __name__ == "__main__":
    main()
