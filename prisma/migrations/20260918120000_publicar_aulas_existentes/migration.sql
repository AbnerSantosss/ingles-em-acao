-- A migration `painel_admin` criou `Lesson.published` com DEFAULT false, e o seed
-- só grava `published: true` ao CRIAR uma aula. Resultado: em todo banco que já
-- tinha as 42 aulas antes do painel, elas sumiam da trilha do aluno ("0 de 0").
--
-- Publica as aulas que nunca foram publicadas nem despublicadas por ninguém
-- (`publishedAt` nulo). Aula despublicada pelo admin tem `publishedAt` preenchido
-- e fica como está.
UPDATE "Lesson"
SET "published" = true,
    "publishedAt" = CURRENT_TIMESTAMP
WHERE "published" = false
  AND "publishedAt" IS NULL;
