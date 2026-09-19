# Licenças, créditos e transparência do pipeline de áudio

Leitura técnica das licenças, feita em 2026-09. Não é parecer jurídico.

## O que vai para o app e o que fica só na máquina

- **Vai para o app:** só os arquivos MP3 de `public/audio/` e os manifestos JSON. Nenhum modelo,
  biblioteca ou programa desta pasta deve entrar na imagem Docker (as linhas do `.dockerignore`
  estão em `LEIA-ME.md`, seção "Publicação").
- **Fica só na máquina do dono do produto:** o Python do pipeline, os modelos e o ffmpeg. Eles
  servem para produzir os MP3 e não são distribuídos.

## Componentes

| Componente | Para que serve aqui | Licença | Autor | Endereço |
|---|---|---|---|---|
| Kokoro-82M (pesos do modelo de voz) | Gera as vozes | Apache 2.0 | hexgrad | https://huggingface.co/hexgrad/Kokoro-82M |
| kokoro-onnx 0.6.1 | Roda o Kokoro no ONNX Runtime | MIT | thewh1teagle | https://github.com/thewh1teagle/kokoro-onnx |
| Arquivos `kokoro-v1.0.onnx` e `voices-v1.0.bin` | Modelo e vozes no formato ONNX | Apache 2.0 (os pesos do Kokoro) | thewh1teagle (conversão) | https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0 |
| ONNX Runtime | Executa o modelo na CPU | MIT | Microsoft | https://github.com/microsoft/onnxruntime |
| phonemizer e espeak-ng (pelo espeakng-loader) | Convertem o texto em fonemas | GPL-3.0 | Mathieu Bernard e colaboradores; projeto espeak-ng | https://github.com/bootphon/phonemizer e https://github.com/espeak-ng/espeak-ng |
| NumPy | Contas com o áudio | BSD-3-Clause | NumPy Developers | https://numpy.org |
| faster-whisper 1.2.1 | Transcreve os MP3 na conferência | MIT | SYSTRAN | https://github.com/SYSTRAN/faster-whisper |
| CTranslate2 | Executa o Whisper na CPU | MIT | OpenNMT | https://github.com/OpenNMT/CTranslate2 |
| Whisper `base.en` (pesos convertidos) | Modelo de transcrição | MIT | OpenAI; conversão da SYSTRAN | https://huggingface.co/Systran/faster-whisper-base.en |
| FFmpeg | Normaliza o volume e grava o MP3 | GPL (build da gyan.dev) | Projeto FFmpeg | https://ffmpeg.org |

Sobre as peças GPL (phonemizer, espeak-ng, FFmpeg): são usadas só localmente, como ferramentas,
para produzir os arquivos de áudio. Elas não são copiadas para o app nem para o servidor.

## Crédito

- Cada MP3 leva no metadado `comment` o texto
  `Voz sintetica gerada por IA (Kokoro-82M, Apache 2.0)`.
- Crédito sugerido, se o dono do produto quiser citar em uma página de créditos ou no rodapé dos
  termos: "Vozes sintéticas geradas com o Kokoro-82M (hexgrad, licença Apache 2.0)."

## Nota de transparência

O aluno deve saber que as vozes são sintéticas. Texto sugerido para o dono do produto publicar
onde decidir (por exemplo, nas perguntas frequentes ou nos termos de uso):

> Os áudios das aulas usam vozes sintéticas, geradas por inteligência artificial, com pronúncia
> do inglês americano. Cada áudio passa por conferência automática e, quando necessário, por
> escuta humana antes de ser publicado.

Onde esse texto aparece é decisão do dono do produto. O texto jurídico de `/termos` e
`/privacidade` não é mexido pelo pipeline.

## Endereços dos modelos

- Kokoro: https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  (325.532.387 bytes)
- Vozes: https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
  (28.214.398 bytes)
- Whisper `base.en`: baixado sozinho pelo `conferir.py` na primeira vez, para
  `scripts/audio/modelos/whisper/`.
