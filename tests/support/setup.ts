/**
 * Roda em cada worker antes dos arquivos de teste: aponta o Prisma Client para
 * o banco de teste. Precisa vir antes de qualquer import de `@/lib/db`, que lê
 * DATABASE_URL no momento em que o módulo é carregado.
 */
import { urlDoBancoDeTeste } from './banco';

process.env.DATABASE_URL = urlDoBancoDeTeste();
