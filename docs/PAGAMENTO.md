# Pagamento — como plugar o gateway

Hoje o pagamento está **simulado**: `PAYMENT_PROVIDER` fica vazia na stack, o webhook
`POST /api/webhooks/pagamento` responde `503` e nenhum plano muda sozinho. O plano do aluno é
liberado à mão em `/admin/alunos`.

O código já está pronto para receber **uma** plataforma de venda (Appmax ou outra). Plugá-la é
escrever um adaptador e preencher duas variáveis. Rota, idempotência, mapa produto→plano,
referência do aluno e auditoria não mudam.

## Como funciona

1. O link de compra (`/perfil`, página da aula) leva a `User.paymentRef` do aluno num parâmetro
   de query. É uma referência opaca: não é e-mail nem id.
2. A plataforma avisa o app pelo webhook, com o corpo assinado.
3. O adaptador confere a assinatura do **corpo bruto** e traduz o corpo para um
   `EventoDePagamento` (`src/lib/pagamento/provedor.ts`).
4. `src/lib/pagamento/processar.ts` decide o que o evento vale, igual para qualquer plataforma:
   - acha o aluno pela referência;
   - acha o plano pelo **código do produto**, no mapa do painel. O que o payload diz sobre
     plano não vale nada;
   - nunca rebaixa um plano;
   - `REFUNDED` e `CANCELED` só ficam registrados.
5. O mesmo evento repetido é ignorado (`Payment.provider` + `externalId`).

## Passo a passo

1. **Adaptador.** Crie `src/lib/pagamento/<plataforma>.ts` exportando uma fábrica
   `(segredo: string) => PaymentProvider`. Use `src/lib/pagamento/fake.ts` como modelo. O
   adaptador faz três coisas:
   - `verificarAssinatura`: do jeito que a plataforma documenta, comparando em tempo constante.
     Nunca lança; qualquer coisa estranha devolve `false`.
   - `extrairEvento`: devolve `externalId`, `status`, `productCode`, `referencia` e
     `amountCents`, ou `null` quando não reconhece o corpo.
   - `parametroDeReferencia`: o nome do parâmetro de query que a plataforma devolve no webhook.
2. **Registro.** Acrescente **uma linha** em `PROVEDORES`, em `src/lib/pagamento/provedor.ts`:
   ```ts
   ['appmax', criarProvedorAppmax],
   ```
   Se a plataforma pedir outra credencial além do segredo, a fábrica lê essa variável de
   `process.env`, e ela entra no `.env.example` e no `docker-compose.prod.yml`.
3. **Testes.** Adicione casos em `tests/pagamento/` com um corpo de exemplo real da plataforma:
   assinatura boa, assinatura ruim e corpo torto.
4. **Variáveis na stack do Portainer.** Digite você mesmo, nunca no repositório:
   - `PAYMENT_PROVIDER`: o nome da linha do passo 2, por exemplo `appmax`.
   - `PAYMENT_WEBHOOK_SECRET`: o segredo que a plataforma usa para assinar. Tem de ter 16
     caracteres ou mais; se for você quem escolhe, gere 32 bytes em hexadecimal
     (`openssl rand -hex 32`).

   Depois, faça **Update the stack**.
5. **Webhook na plataforma.** Em `/admin/configuracoes`, copie o **Endereço do webhook** e cole
   no painel da plataforma de venda.
6. **Produtos.** Ainda em `/admin/configuracoes`, ligue cada código de produto da plataforma a
   um plano (WSA Essencial ou WSA Premium; no banco, `ESSENCIAL` ou `PREMIUM`) e salve.
7. **Venda de teste.** Compre com uma conta de aluno pelo link do app e confira:
   - o plano do aluno em `/admin/alunos`;
   - a linha nova na auditoria.

   Uma compra que chega sem referência ou com produto fora do mapa fica registrada e aparece em
   `/admin/configuracoes` como "aprovado sem liberação". Nesse caso, libere o plano à mão na
   ficha do aluno.
8. **Textos.** Só depois da venda de teste aprovada, troque os textos de "liberação manual" nos
   termos, na landing e nas telas de compra.

## Quando algo dá errado

| Sintoma | Causa provável |
|---|---|
| Webhook responde `503` | `PAYMENT_PROVIDER` vazia, com nome desconhecido, ou segredo ausente ou curto. O painel mostra o motivo em `/admin/configuracoes`, sem mostrar o segredo. |
| Webhook responde `401` | Assinatura não confere: segredo diferente do da plataforma, ou corpo alterado por proxy. |
| Venda aprovada e o plano não mudou | Produto fora do mapa, ou link de compra sem a referência do aluno. |

> ⚠️ Ligar `PAYMENT_PROVIDER` sem o adaptador certo deixa o webhook recusando tudo. Não quebra
> o app, mas nenhuma venda libera plano.
