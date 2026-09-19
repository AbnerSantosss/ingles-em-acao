# Pipeline de áudio do WSA English

Os áudios das aulas são gerados **na máquina do dono do produto**, com o Kokoro-82M (voz
sintética local, roda na CPU). O servidor de produção nunca gera áudio: ele só entrega os MP3 que
já estão em `public/audio/`, como entrega qualquer imagem.

Formatos e nomes: `docs/plano-v2/01-CONTRATOS.md`, seções 2.3 (arquivo), 2.4 (tabela) e 2.5
(manifesto). Todos os comandos abaixo rodam a partir da pasta `app-web`.

## Arquivos desta pasta

| Arquivo | Para que serve | Vai para o git |
|---|---|---|
| `gerar.py` | Lê as tabelas, gera os MP3 e grava os manifestos | sim |
| `conferir.py` | Transcreve cada MP3, compara com o texto e monta o relatório e a página de escuta | sim |
| `test_pipeline.py` | Testes dos dois scripts (só biblioteca padrão do Python) | sim |
| `vozes.json` | Apelidos de voz (F1, F2, M1, M2), velocidades e pausas. As vozes foram escolhidas por um teste automático de transcrição na preparação do pipeline | sim |
| `requirements*.txt` | Bibliotecas do venv: Kokoro (`kokoro-onnx`) e transcrição (`faster-whisper`, em `requirements-conferencia.txt`) | sim |
| `escuta-aprovada.json` | Clipes aprovados na escuta humana. Criado pelo `--registrar-escuta` | sim |
| `exemplo/aula-01.json` | Tabela de exemplo dos testes. Não é conteúdo de aula | sim |
| `LICENCAS.md` | Licenças, créditos e nota de transparência | sim |
| `.venv/` | Python do pipeline, com as bibliotecas | não |
| `modelos/` | Modelo do Kokoro e, depois da primeira conferência, o do Whisper | não |

Onde o resultado fica:

| Caminho | O que é | Vai para o git |
|---|---|---|
| `content/audio/aula-NN.json` | Tabela de produção da aula (quem escreve é o conteúdo) | sim |
| `public/audio/aula-NN/<id>.<hash8>.mp3` | Os áudios | sim |
| `content/audio/gerado/aula-NN.json` | Manifesto: o que entra no banco | sim |
| Pasta temporária `wsa-audio-conferencia` | Relatório da conferência e `escuta.html` | não (fica fora do projeto) |

## O fluxo, do começo ao fim

1. **Conferir as tabelas sem gerar nada.**
   `npm run audio:gerar -- --todas --simular`
   Mostra, aula por aula, o que seria gerado, os erros de tabela e o tempo estimado.
2. **Gerar.**
   `npm run audio:gerar -- --todas`
   Para começar pelo essencial: `npm run audio:gerar -- --todas --so-prioridade P0`.
3. **Conferir.**
   `npm run audio:conferir -- --todas --abrir`
   Transcreve cada MP3 e abre a página `escuta.html` no navegador com os clipes que precisam de
   ouvido humano.
4. **Escutar.** Na página, ouça cada clipe marcado e clique em **Aprovar** ou **Reprovar**
   (escreva o motivo na observação). No fim, clique em **Baixar decisões (JSON)**.
5. **Registrar a escuta.**
   `npm run audio:conferir -- --registrar-escuta "CAMINHO DO ARQUIVO BAIXADO"`
   Os aprovados ficam em `scripts/audio/escuta-aprovada.json` e não voltam para a escuta. Os
   reprovados aparecem no terminal com a observação.
6. **Corrigir os reprovados** na tabela `content/audio/aula-NN.json` (texto, voz ou velocidade),
   gerar de novo só aquela aula (`npm run audio:gerar -- --aula N`) e conferir de novo.
7. **Levar ao banco.** O seed e o script de migração do conteúdo leem os manifestos de
   `content/audio/gerado/` e gravam os áudios em cada página (função `aplicarAudios`).

## Texto da tela e texto falado

Cada clipe tem dois textos, e eles podem ser diferentes:

- `ancora`: o texto **exatamente como a tela mostra**, copiado do conteúdo com copiar e colar. É
  por ele que o botão de ouvir acha o seu lugar na página. Uma letra diferente e o botão some.
- `texto`: o que a voz **fala**. É ele que vira áudio.

| Na tela (`ancora`) | Falado (`texto`) | Por quê |
|---|---|---|
| `HE` | `he` | Palavra em maiúsculas pode ser soletrada letra por letra |
| `9:30` | `nine thirty` | Horário por extenso sai sempre do mesmo jeito |
| `$5` | `five dollars` | Símbolo de moeda nem sempre é lido |
| `Mr. Smith` | `Mister Smith` | Abreviação pode ser lida como sigla |
| `Yes, I am. / No, I’m not.` | `Yes, I am. No, I'm not.` | A barra é da tela, não da fala |
| `I'm` | `I'm` | Contração fica como está: não troque por `I am` |

O `texto` de um clipe de uma voz só fica numa linha só. Quebra de linha só existe quando há
`falas` (diálogo ou "ouvir todos"), e aí o `texto` é a junção das falas com quebra de linha.

## Palavras curtas

Palavra solta é o ponto fraco de qualquer voz sintética: o motor não tem frase em volta para
decidir a entonação. Por isso:

- o `gerar.py` põe um ponto final no que vai para o motor quando o texto não termina em `.`, `!`
  ou `?` (o `texto` da tabela não muda);
- a conferência automática não confia na transcrição de clipe com até 2 palavras, e todos eles
  vão para a escuta humana;
- se uma palavra soar estranha, tente, nesta ordem: escrever em minúsculas, trocar a voz (F1 por
  F2, M1 por M2) ou usar a velocidade `"reduzida"`.

## Trocar voz, velocidade ou pausa

O nome de cada MP3 tem um código (`hash8`) calculado a partir da voz real do Kokoro, da
velocidade, das pausas e do texto. Mudou um deles, o código muda e o clipe é gerado de novo.
Nada mais é refeito.

- **Voz.** Em `vozes.json`, troque o nome ao lado do apelido. Exemplo: `"M1": "am_michael"` para
  `"M1": "am_adam"`. Só os clipes que usam M1 são gerados de novo. As vozes de inglês americano
  começam com `af_` (feminina) e `am_` (masculina). Lista e notas de qualidade:
  https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- **Velocidade.** Em `vozes.json`, `"natural": 0.92` e `"reduzida": 0.8`. Mudar um valor refaz
  todos os clipes daquela velocidade.
- **Pausas.** `pausaEntreFalasMs` (diálogo) e `pausaEntreItensMs` ("ouvir todos"). Refaz só os
  clipes com `falas`.
- **Regra de processamento do `gerar.py`** (silêncio das pontas, volume, MP3). Isso **não** muda
  o código dos arquivos. Depois de mudar, gere com `--forcar`:
  `npm run audio:gerar -- --todas --forcar`

Depois de qualquer troca: gere, confira e escute de novo. Aprovação de escuta vale para um
arquivo específico: arquivo novo volta para a escuta.

## Parou no meio? Rode o mesmo comando de novo

Cada MP3 é gravado primeiro com um nome provisório e só depois ganha o nome final. Se a geração
parar (Ctrl+C, queda de energia, erro), rode **o mesmo comando** de novo: o que já existe aparece
como `PULAR` e só o que falta é gerado. Sobras provisórias (`.tmp.mp3`) são apagadas sozinhas.

## Quanto tempo leva

- Geração: o `--simular` mostra a estimativa. Para o curso inteiro, conte com algo entre 20 e 60
  minutos na CPU. O terminal mostra o andamento e o tempo que falta.
- Conferência: algo entre 10 e 20 minutos para o curso inteiro. Na primeira vez, baixa o modelo
  de transcrição (cerca de 145 MB, precisa de internet).

## Publicação

Por enquanto não há produção. Os MP3 ficam em `public/audio/` e o app local (`npm run dev`) os
entrega como entrega qualquer arquivo de `public/`, sem pedir login. Para o curso inteiro (de
1.200 a 1.800 clipes), espere algo entre 20 e 40 MB de áudio.

Cada versão de um clipe tem um nome diferente, então o navegador nunca toca um áudio velho
guardado em cache. O `gerar.py` apaga a versão antiga de um clipe assim que a nova existe.

Quando houver produção (recomendação, ainda não feita):

- Versionar no git os MP3 de `public/audio/` e os manifestos de `content/audio/gerado/`. O
  Dockerfile copia o projeto inteiro (`COPY . .`), então eles entram na imagem junto com o resto
  de `public/`. Não precisa de volume nem de serviço à parte.
- Antes do primeiro build com o pipeline instalado, acrescentar ao fim do `.dockerignore`:

  ```
  # pipeline de áudio: Python e modelos ficam na máquina de quem gera. Os MP3 (public/audio) entram.
  scripts/audio/.venv
  scripts/audio/modelos
  **/__pycache__
  **/*.pyc
  ```

  Sem isso, o venv e os modelos (mais de 350 MB) vão para a imagem, porque a etapa final do
  Dockerfile copia a pasta `scripts` inteira.
- Pedir ao servidor um cabeçalho de cache longo para `/audio/` (os nomes mudam a cada versão, então
  o cache pode ser imutável).

## Problemas comuns

| Mensagem | O que fazer |
|---|---|
| `ffmpeg não está no PATH` | `winget install Gyan.FFmpeg` e abra um terminal novo |
| `o módulo kokoro_onnx não está instalado` | Rode pelo `npm run`, não pelo `python` solto. Se continuar, o venv está incompleto: reinstale pelo `requirements*.txt` desta pasta que tem o `kokoro-onnx` |
| `o módulo faster_whisper não está instalado` | `scripts\audio\.venv\Scripts\python.exe -m pip install -r scripts\audio\requirements-conferencia.txt` |
| `modelo do Kokoro não encontrado` | Baixe `kokoro-v1.0.onnx` e `voices-v1.0.bin` para `scripts/audio/modelos/` (endereços em `LICENCAS.md`) |
| `o arquivo de vozes não tem: ...` | O nome em `vozes.json` está errado. Confira na lista de vozes |
| `ERRO ao carregar o faster-whisper` | Na primeira conferência precisa de internet para baixar o modelo |
| `COM ERRO` numa aula | A tabela dela tem erro. As linhas `ERRO` logo abaixo dizem qual campo corrigir |

## Testes

`scripts\audio\.venv\Scripts\python.exe scripts\audio\test_pipeline.py -v`
