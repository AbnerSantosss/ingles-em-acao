import { describe, expect, it } from 'vitest';

import { prisma } from '@/lib/db';

describe('infra de testes', () => {
  it('resolve o alias @ e conversa com o banco de teste', async () => {
    const [{ banco }] = await prisma.$queryRaw<{ banco: string }[]>`SELECT current_database() AS banco`;
    expect(banco).toMatch(/_test$/);
  });
});
