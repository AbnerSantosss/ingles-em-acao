-- Plano v2, Onda 0 (pacote 02): dois planos (ESSENCIAL e PREMIUM) e a ficha de prática com IA.
--
-- Decisão 2 do dono do produto: toda conta do plano COMPLETO (extinto) passa para o PREMIUM.
-- Tudo numa transação só: se um passo falhar, nada muda. Cada linha alterada ganha um registro
-- em "AuditLog" com o antes e o depois ("outcome" e "createdAt" ficam com o padrão da tabela).
--
-- Escrita à mão. Não gere outra por cima com `prisma migrate dev`.

BEGIN;

-- 1. Contas do plano Completo: primeiro a auditoria, depois a troca.
INSERT INTO "AuditLog" ("id", "actorEmail", "action", "resource", "reason", "before", "after")
SELECT gen_random_uuid()::text,
       '(migracao)',
       'user.plan.migrate',
       'User:' || "id",
       'Plano Completo extinto: a conta passou para o Premium (decisão 2 do dono do produto).',
       '{"plan": "COMPLETO"}'::jsonb,
       '{"plan": "PREMIUM"}'::jsonb
FROM "User"
WHERE "plan" = 'COMPLETO';

UPDATE "User"
SET "plan" = 'PREMIUM', "updatedAt" = CURRENT_TIMESTAMP
WHERE "plan" = 'COMPLETO';

-- 2. Pagamentos gravados com o plano Completo.
INSERT INTO "AuditLog" ("id", "actorEmail", "action", "resource", "reason", "before", "after")
SELECT gen_random_uuid()::text,
       '(migracao)',
       'payment.plan.migrate',
       'Payment:' || "id",
       'Plano Completo extinto: o pagamento passou a apontar para o Premium (decisão 2 do dono do produto).',
       '{"planCode": "COMPLETO"}'::jsonb,
       '{"planCode": "PREMIUM"}'::jsonb
FROM "Payment"
WHERE "planCode" = 'COMPLETO';

UPDATE "Payment"
SET "planCode" = 'PREMIUM', "updatedAt" = CURRENT_TIMESTAMP
WHERE "planCode" = 'COMPLETO';

-- O JSON de AppSetting (pagamento.produtos e checkout.link) NÃO é remapeado aqui (contrato 10.10):
-- item antigo com COMPLETO fica como está; o painel avisa e o webhook ignora com aviso no log.

-- 3. O enum "Plan" perde o COMPLETO. Nenhuma linha usa mais o valor (passos 1 e 2).
CREATE TYPE "Plan_new" AS ENUM ('ESSENCIAL', 'PREMIUM');
ALTER TABLE "User" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TABLE "Payment" ALTER COLUMN "planCode" TYPE "Plan_new" USING ("planCode"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "Plan_old";
ALTER TABLE "User" ALTER COLUMN "plan" SET DEFAULT 'ESSENCIAL';

-- 4. Ficha de prática com IA da aula (FichaDePratica, src/lib/pratica/tipos.ts). null = sem ficha.
ALTER TABLE "Lesson" ADD COLUMN "practice" JSONB;

COMMIT;
