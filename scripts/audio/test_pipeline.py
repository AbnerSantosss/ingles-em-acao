"""
Testes do pipeline de áudio (gerar.py e conferir.py). Só biblioteca padrão: não precisa do
Kokoro, do faster-whisper nem do numpy. Rode a partir da pasta app-web:

  scripts\\audio\\.venv\\Scripts\\python.exe scripts\\audio\\test_pipeline.py -v
"""

from __future__ import annotations

import copy
import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

PASTA = Path(__file__).resolve().parent
sys.path.insert(0, str(PASTA))

import conferir  # noqa: E402
import gerar  # noqa: E402

CFG = {
    "vozes": {"F1": "af_heart", "F2": "af_bella", "M1": "am_michael", "M2": "am_fenrir"},
    "velocidades": {"natural": 0.92, "reduzida": 0.8},
    "pausaEntreFalasMs": 350,
    "pausaEntreItensMs": 600,
}
EXEMPLO = PASTA / "exemplo" / "aula-01.json"
ESPERADOS = {
    "lesson_001_audio_001": "d5e6ff22",
    "lesson_001_audio_002": "92b87823",
    "lesson_001_audio_003": "800c69c2",
    "lesson_001_audio_004": "0dd57b54",
    "lesson_001_audio_005": "480a1303",
}


def exemplo() -> dict:
    return gerar.ler_json(EXEMPLO)


def clipe(indice: int) -> dict:
    return copy.deepcopy(exemplo()["clips"][indice])


def rodar_main(modulo, argumentos: list[str]) -> tuple[int, str]:
    saida = io.StringIO()
    with redirect_stdout(saida):
        codigo = modulo.main(argumentos)
    return codigo, saida.getvalue()


class TestHash(unittest.TestCase):
    def test_base_de_uma_voz(self):
        self.assertEqual(gerar.base_do_hash(clipe(0), CFG), "af_heart|0.92|I am ready.")

    def test_base_de_dialogo_tem_as_falas_e_a_pausa(self):
        self.assertEqual(
            gerar.base_do_hash(clipe(3), CFG),
            "af_heart|0.92|Hi! I am Ana.\nam_michael|0.92|Hello, Ana. I am Tom.\n#pausa=350",
        )

    def test_ouvir_todos_usa_a_pausa_entre_itens(self):
        self.assertTrue(gerar.base_do_hash(clipe(4), CFG).endswith("\n#pausa=600"))
        self.assertIn("af_heart|0.80|you", gerar.base_do_hash(clipe(4), CFG))

    def test_hash8_do_exemplo(self):
        for c in exemplo()["clips"]:
            self.assertEqual(gerar.calcular_hash8(c, CFG), ESPERADOS[c["id"]], c["id"])

    def test_hash_muda_com_voz_velocidade_e_texto(self):
        base = gerar.calcular_hash8(clipe(0), CFG)
        for campo, valor in (("voz", "F2"), ("velocidade", "reduzida"), ("texto", "I am ready!")):
            mudado = clipe(0)
            mudado[campo] = valor
            if campo == "texto":
                mudado["ancora"] = valor
            self.assertNotEqual(gerar.calcular_hash8(mudado, CFG), base, campo)

    def test_hash_muda_quando_a_voz_do_apelido_muda(self):
        outra = copy.deepcopy(CFG)
        outra["vozes"]["F1"] = "af_bella"
        self.assertNotEqual(gerar.calcular_hash8(clipe(0), outra), gerar.calcular_hash8(clipe(0), CFG))

    def test_hash_nao_muda_com_campos_de_tela(self):
        base = gerar.calcular_hash8(clipe(0), CFG)
        for campo, valor in (
            ("ancora", "I AM READY."),
            ("local", "outro"),
            ("motivo", "outro"),
            ("prioridade", "P2"),
            ("obrigatorio", False),
            ("lento", True),
            ("pagina", 9),
            ("categoria", "FIXED_CHUNK"),
        ):
            mudado = clipe(0)
            mudado[campo] = valor
            self.assertEqual(gerar.calcular_hash8(mudado, CFG), base, campo)

    def test_nome_e_src(self):
        nome = gerar.nome_do_arquivo("lesson_002_audio_001", "1a2b3c4d")
        self.assertEqual(nome, "lesson_002_audio_001.1a2b3c4d.mp3")
        self.assertEqual(gerar.src_do_clipe(2, nome), "/audio/aula-02/lesson_002_audio_001.1a2b3c4d.mp3")

    def test_vozes_json_do_projeto_segue_o_contrato(self):
        cfg = gerar.carregar_config_vozes()
        self.assertEqual(set(cfg["vozes"]), {"F1", "F2", "M1", "M2"})
        self.assertEqual(set(cfg["velocidades"]), {"natural", "reduzida"})
        self.assertIsInstance(cfg["pausaEntreFalasMs"], int)
        self.assertIsInstance(cfg["pausaEntreItensMs"], int)


class TestValidacao(unittest.TestCase):
    def validar(self, tabela, aula=1, ids=None):
        return gerar.validar_tabela(tabela, aula, CFG, {} if ids is None else ids)

    def erros_com(self, tabela, trecho, aula=1, ids=None):
        erros, _ = self.validar(tabela, aula, ids)
        self.assertTrue(any(trecho in e for e in erros), f"esperava erro com {trecho!r}, veio {erros}")

    def test_exemplo_e_valido_e_sem_avisos(self):
        self.assertEqual(self.validar(exemplo()), ([], []))

    def test_id_fora_do_padrao(self):
        t = exemplo()
        t["clips"][0]["id"] = "lesson_1_audio_1"
        self.erros_com(t, "fora do padrão")

    def test_id_de_outra_aula(self):
        t = exemplo()
        t["clips"][0]["id"] = "lesson_002_audio_001"
        self.erros_com(t, "outra aula")

    def test_id_000(self):
        t = exemplo()
        t["clips"][0]["id"] = "lesson_001_audio_000"
        self.erros_com(t, "começa em 001")

    def test_id_repetido_na_mesma_tabela(self):
        t = exemplo()
        t["clips"][1]["id"] = t["clips"][0]["id"]
        self.erros_com(t, "id repetido")

    def test_id_repetido_em_outra_aula(self):
        self.erros_com(exemplo(), "aula-07.json", ids={"lesson_001_audio_001": "aula-07.json"})

    def test_voz_desconhecida(self):
        t = exemplo()
        t["clips"][0]["voz"] = "F3"
        self.erros_com(t, "desconhecida")

    def test_voz_de_fala_desconhecida(self):
        t = exemplo()
        t["clips"][3]["falas"][1]["voz"] = "am_michael"
        self.erros_com(t, "falas[1] com voz")

    def test_texto_precisa_bater_com_as_falas(self):
        t = exemplo()
        t["clips"][3]["texto"] = "Hi! I am Ana. Hello, Ana. I am Tom."
        self.erros_com(t, "juntadas")

    def test_falas_com_voz_preenchida(self):
        t = exemplo()
        t["clips"][3]["voz"] = "F1"
        self.erros_com(t, "voz precisa ser null")

    def test_falas_com_um_item_so(self):
        t = exemplo()
        t["clips"][3]["falas"] = t["clips"][3]["falas"][:1]
        t["clips"][3]["texto"] = "Hi! I am Ana."
        self.erros_com(t, "2 itens")

    def test_quebra_de_linha_sem_falas(self):
        t = exemplo()
        t["clips"][0]["texto"] = "I am ready.\nYou are ready."
        self.erros_com(t, "quebra de linha")

    def test_ancora_vazia(self):
        t = exemplo()
        t["clips"][0]["ancora"] = "   "
        self.erros_com(t, "ancora vazia")

    def test_pagina_zero(self):
        t = exemplo()
        t["clips"][0]["pagina"] = 0
        self.erros_com(t, "pagina precisa")

    def test_campo_a_mais_e_campo_faltando(self):
        t = exemplo()
        t["clips"][0]["extra"] = 1
        self.erros_com(t, "não existem no contrato")
        t = exemplo()
        del t["clips"][0]["motivo"]
        self.erros_com(t, "faltam os campos motivo")

    def test_enums(self):
        for campo, valor, trecho in (
            ("alvo", "frase", "alvo"),
            ("categoria", "MUSIC", "categoria"),
            ("velocidade", "rapida", "velocidade"),
            ("prioridade", "P9", "prioridade"),
            ("lento", "sim", "lento"),
            ("obrigatorio", 1, "obrigatorio"),
        ):
            t = exemplo()
            t["clips"][0][campo] = valor
            self.erros_com(t, trecho)

    def test_aula_diferente_do_arquivo(self):
        t = exemplo()
        t["aula"] = 2
        self.erros_com(t, "igual ao número do arquivo")

    def test_status_invalido(self):
        t = exemplo()
        t["status"] = "rascunho"
        self.erros_com(t, "status")

    def test_pendente_sem_clipes_e_valida(self):
        t = {"aula": 5, "titulo": "Aula 5", "status": "pendente", "clips": []}
        self.assertEqual(self.validar(t, aula=5), ([], []))

    def test_pendente_com_clipes_so_avisa(self):
        t = exemplo()
        t["status"] = "pendente"
        erros, avisos = self.validar(t)
        self.assertEqual(erros, [])
        self.assertTrue(any("pendente" in a for a in avisos))

    def test_avisos(self):
        casos = (
            ("texto", "It is 9:30.", "algarismos"),
            ("texto", "I am OK.", "maiúsculas"),
            ("texto", "I am ready " + chr(0x2014) + " now.", "U+2014"),
        )
        for campo, valor, trecho in casos:
            t = exemplo()
            t["clips"][0][campo] = valor
            t["clips"][0]["ancora"] = valor
            erros, avisos = self.validar(t)
            self.assertEqual(erros, [], valor)
            self.assertTrue(any(trecho in a for a in avisos), f"{valor!r}: {avisos}")
        t = exemplo()
        t["clips"][0]["categoria"] = "DIALOGUE"
        _, avisos = self.validar(t)
        self.assertTrue(any("DIALOGUE com uma voz" in a for a in avisos))

    def test_tabelas_reais_do_projeto(self):
        caminhos = gerar.Caminhos(gerar.RAIZ_PADRAO)
        arquivos = [caminhos.tabela(n) for n in range(1, gerar.TOTAL_DE_AULAS + 1) if caminhos.tabela(n).is_file()]
        if not arquivos:
            self.skipTest("nenhuma tabela content/audio/aula-NN.json ainda (quem cria é o pacote 12)")
        cfg = gerar.carregar_config_vozes()
        ids: dict[str, str] = {}
        for arquivo in arquivos:
            aula = int(arquivo.stem.split("-")[1])
            erros, _ = gerar.validar_tabela(gerar.ler_json(arquivo), aula, cfg, ids)
            self.assertEqual(erros, [], arquivo.name)


class TestTextoParaMotor(unittest.TestCase):
    def test_pontuacao_final_e_espacos(self):
        self.assertEqual(gerar.texto_para_motor("he"), "he.")
        self.assertEqual(gerar.texto_para_motor("I am ready."), "I am ready.")
        self.assertEqual(gerar.texto_para_motor("Are you OK?"), "Are you OK?")
        self.assertEqual(gerar.texto_para_motor("  Hello   there  "), "Hello there.")

    def test_aspas_curvas_e_reticencias(self):
        self.assertEqual(gerar.texto_para_motor("I" + chr(0x2019) + "m fine"), "I'm fine.")
        self.assertEqual(gerar.texto_para_motor("Wait" + chr(0x2026)), "Wait...")


class TestConferencia(unittest.TestCase):
    def test_normalizacao(self):
        casos = (
            ("9:30", "nine thirty"),
            ("9:00", "nine oclock"),
            ("nine o'clock", "nine oclock"),
            ("9:05", "nine oh five"),
            ("It's $5.", "its five dollars"),
            ("$1", "one dollar"),
            ("$2.50", "two dollars and fifty cents"),
            ("1st", "first"),
            ("22nd", "twenty second"),
            ("12th", "twelfth"),
            ("20th", "twentieth"),
            ("1990", "nineteen ninety"),
            ("2005", "two thousand five"),
            ("2024", "twenty twenty four"),
            ("21", "twenty one"),
            ("Twenty-one", "twenty one"),
            ("105", "one hundred five"),
            ("3.5", "three point five"),
            ("50%", "fifty percent"),
            ("Mr. Smith", "mister smith"),
            ("OK!", "okay"),
            ("U.S.A.", "usa"),
            ("I can not go.", "i cannot go"),
            ("Hi! I am Ana.\nHello, Ana.", "hi i am ana hello ana"),
        )
        for entrada, esperado in casos:
            self.assertEqual(conferir.normalizar(entrada), esperado, entrada)

    def test_contracao_nao_e_expandida(self):
        self.assertNotEqual(conferir.normalizar("I'm fine."), conferir.normalizar("I am fine."))
        self.assertEqual(conferir.normalizar("I" + chr(0x2019) + "m fine."), conferir.normalizar("I'm fine"))

    def test_esperado_e_ouvido_no_mesmo_formato(self):
        self.assertEqual(conferir.normalizar("nine thirty"), conferir.normalizar("9:30."))

    def test_contar_palavras(self):
        self.assertEqual(conferir.contar_palavras("he"), 1)
        self.assertEqual(conferir.contar_palavras("nine thirty"), 2)
        self.assertEqual(conferir.contar_palavras("I'm ready."), 2)
        self.assertEqual(conferir.contar_palavras("I\nyou\nhe\nshe"), 4)

    def test_faixa_e_segundos_de_fala(self):
        self.assertEqual(conferir.faixa_de_duracao(4), (1.0, 3.4))
        self.assertAlmostEqual(conferir.segundos_de_fala(3.0, clipe(3), CFG), 2.41)
        self.assertAlmostEqual(conferir.segundos_de_fala(3.0, clipe(4), CFG), 0.96)
        self.assertAlmostEqual(conferir.segundos_de_fala(1.0, clipe(0), CFG), 0.76)

    def test_escuta_nao_deixa_texto_fechar_o_script(self):
        html = conferir.montar_escuta([{"texto": "</script><b>&"}])
        self.assertEqual(html.count("</script>"), 2)
        self.assertNotIn("<b>&", html)
        self.assertNotIn("__DADOS__", html)

    def test_registrar_escuta(self):
        with tempfile.TemporaryDirectory() as pasta:
            registro = Path(pasta) / "escuta-aprovada.json"
            decisoes = Path(pasta) / "escuta-decisoes.json"
            decisoes.write_text(
                json.dumps(
                    {
                        "geradoEm": "2026-09-19T12:00:00.000Z",
                        "decisoes": [
                            {"id": "lesson_001_audio_002", "aula": 1, "src": "/audio/aula-01/a.mp3", "decisao": "aprovado", "observacao": ""},
                            {"id": "lesson_001_audio_003", "aula": 1, "src": "/audio/aula-01/b.mp3", "decisao": "reprovado", "observacao": "cortou"},
                        ],
                    }
                ),
                encoding="utf-8",
            )
            with mock.patch.object(conferir, "ARQUIVO_ESCUTA", registro):
                codigo, texto = rodar_main(conferir, ["--registrar-escuta", str(decisoes)])
            self.assertEqual(codigo, 0)
            dados = json.loads(registro.read_text(encoding="utf-8"))
            self.assertEqual(list(dados["aprovados"]), ["/audio/aula-01/a.mp3"])
            self.assertIn("Reprovados: 1", texto)


class TestPlanoEManifesto(unittest.TestCase):
    def setUp(self):
        self._pasta = tempfile.TemporaryDirectory()
        self.raiz = Path(self._pasta.name)
        self.caminhos = gerar.Caminhos(self.raiz)
        self.caminhos.tabelas.mkdir(parents=True)
        self.caminhos.tabela(1).write_text(EXEMPLO.read_text(encoding="utf-8"), encoding="utf-8")
        self.pasta_mp3 = self.caminhos.pasta_da_aula(1)

    def tearDown(self):
        self._pasta.cleanup()

    def criar_mp3(self, nome: str) -> Path:
        self.pasta_mp3.mkdir(parents=True, exist_ok=True)
        arquivo = self.pasta_mp3 / nome
        arquivo.write_bytes(b"ID3")
        return arquivo

    def plano(self, prioridades=frozenset(), forcar=False):
        return gerar.montar_plano_da_aula(1, self.caminhos, CFG, {}, set(prioridades), forcar)

    def test_manifesto_so_tem_clipe_com_mp3_e_em_ordem(self):
        for ident in ("lesson_001_audio_005", "lesson_001_audio_004", "lesson_001_audio_002", "lesson_001_audio_001"):
            self.criar_mp3(f"{ident}.{ESPERADOS[ident]}.mp3")
        self.criar_mp3("lesson_001_audio_003.00000000.mp3")  # versão antiga não entra
        manifesto = gerar.montar_manifesto(1, exemplo(), CFG, self.pasta_mp3)
        self.assertEqual(manifesto["aula"], 1)
        ids = [(e["pagina"], e["clip"]["id"]) for e in manifesto["clips"]]
        self.assertEqual(
            ids,
            [(1, "lesson_001_audio_001"), (1, "lesson_001_audio_002"), (1, "lesson_001_audio_004"), (2, "lesson_001_audio_005")],
        )
        primeiro = manifesto["clips"][0]
        self.assertEqual(set(primeiro), {"pagina", "clip"})
        self.assertEqual(set(primeiro["clip"]), {"id", "alvo", "ancora", "texto", "src", "categoria"})
        self.assertEqual(primeiro["clip"]["src"], "/audio/aula-01/lesson_001_audio_001.d5e6ff22.mp3")
        self.assertIs(manifesto["clips"][1]["clip"]["lento"], True)

    def test_manifesto_de_aula_pendente_e_vazio(self):
        t = exemplo()
        t["status"] = "pendente"
        self.assertEqual(gerar.montar_manifesto(1, t, CFG, self.pasta_mp3), {"aula": 1, "clips": []})

    def test_plano_acha_antigos_orfaos_e_temporarios(self):
        self.criar_mp3("lesson_001_audio_001." + ESPERADOS["lesson_001_audio_001"] + ".mp3")
        antigo = self.criar_mp3("lesson_001_audio_001.deadbeef.mp3")
        orfao = self.criar_mp3("lesson_001_audio_099.12345678.mp3")
        sobra = self.criar_mp3("lesson_001_audio_002.92b87823.tmp.mp3")
        plano = self.plano()
        acoes = {item.clipe["id"]: item.acao for item in plano.itens}
        self.assertEqual(acoes["lesson_001_audio_001"], "PULAR")
        self.assertEqual(acoes["lesson_001_audio_002"], "GERAR")
        self.assertEqual(plano.antigos, [antigo])
        self.assertEqual(plano.orfaos, [orfao])
        self.assertEqual(plano.temporarios, [sobra])

    def test_forcar_e_prioridade(self):
        self.criar_mp3("lesson_001_audio_001." + ESPERADOS["lesson_001_audio_001"] + ".mp3")
        acoes = {i.clipe["id"]: i.acao for i in self.plano(forcar=True).itens}
        self.assertEqual(acoes["lesson_001_audio_001"], "GERAR")
        acoes = {i.clipe["id"]: i.acao for i in self.plano(prioridades={"P0"}).itens}
        self.assertEqual(acoes["lesson_001_audio_003"], "FORA")
        self.assertEqual(acoes["lesson_001_audio_005"], "FORA")
        self.assertEqual(acoes["lesson_001_audio_004"], "GERAR")

    def test_gravar_json_e_estavel(self):
        arquivo = self.raiz / "x.json"
        self.assertTrue(gerar.gravar_json(arquivo, {"b": 1, "a": "ç"}))
        self.assertFalse(gerar.gravar_json(arquivo, {"b": 1, "a": "ç"}))
        conteudo = arquivo.read_bytes()
        self.assertTrue(conteudo.endswith(b"\n"))
        self.assertNotIn(b"\r", conteudo)
        self.assertIn("ç".encode("utf-8"), conteudo)

    def test_simular_nao_grava_nada(self):
        codigo, texto = rodar_main(gerar, ["--aula", "1", "--simular", "--raiz", str(self.raiz)])
        self.assertEqual(codigo, 0, texto)
        self.assertIn("Simulação: nada foi gravado.", texto)
        self.assertIn("GERAR 5", texto)
        self.assertFalse(self.caminhos.manifestos.exists())
        self.assertFalse(self.caminhos.publica.exists())

    def test_todas_sem_tabelas_nao_e_erro(self):
        with tempfile.TemporaryDirectory() as vazia:
            codigo, texto = rodar_main(gerar, ["--todas", "--simular", "--raiz", vazia])
        self.assertEqual(codigo, 0, texto)
        self.assertIn("Tabelas ausentes: 42", texto)

    def test_aula_pedida_sem_tabela_e_erro(self):
        codigo, texto = rodar_main(gerar, ["--aula", "3", "--simular", "--raiz", str(self.raiz)])
        self.assertEqual(codigo, 1, texto)

    def test_tabela_com_erro_da_codigo_1(self):
        t = exemplo()
        t["clips"][0]["voz"] = "F9"
        self.caminhos.tabela(1).write_text(json.dumps(t), encoding="utf-8")
        codigo, texto = rodar_main(gerar, ["--aula", "1", "--simular", "--raiz", str(self.raiz)])
        self.assertEqual(codigo, 1)
        self.assertIn("COM ERRO", texto)


if __name__ == "__main__":
    unittest.main()
