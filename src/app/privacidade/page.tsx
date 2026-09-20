import type { Metadata } from 'next';

import { EMAIL_DE_CONTATO, ListaLegal, PaginaLegal, SecaoLegal } from '@/components/legal/PaginaLegal';

/**
 * Política de privacidade — versão preliminar, a revisar juridicamente.
 *
 * Cada afirmação aqui foi conferida no código em 2026-09-18:
 * - dados: `prisma/schema.prisma` (User, Session, VerificationToken,
 *   LoginAttempt, LessonProgress, ExerciseAnswer, StudyDay, AuditLog);
 * - senha: argon2id (`src/lib/auth/password.ts`);
 * - sessão: cookie httpOnly `iea_session`, 24 h ou 30 dias com "lembrar de mim";
 * - tokens de e-mail: 1 h (redefinir senha) e 24 h (confirmar e-mail), uso único;
 * - tentativas de login: janela de 15 minutos (`rate-limit.ts`);
 * - áudios das aulas: arquivos estáticos em `public/audio/`, servidos sem
 *   sessão, com um hash de 8 dígitos no nome (`src/lib/content/blocks.ts`).
 *   Proteger esse acesso é decisão futura; enquanto for assim, a seção 6 avisa.
 * Mudou o código? Mude este texto junto.
 */
export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: 'Quais dados o WSA English coleta, para que usa e como você exerce seus direitos pela LGPD.',
};

const link = 'font-bold text-navy underline underline-offset-4';

export default function PrivacidadePage() {
  return (
    <PaginaLegal
      titulo="Política de privacidade"
      atualizadoEm="19 de setembro de 2026"
      introducao={
        <p>
          Aqui explicamos quais dados o <strong>WSA English</strong> coleta, por que coleta e o que você
          pode pedir sobre eles, conforme a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
          Coletamos só o necessário para o curso funcionar.
        </p>
      }
    >
      <SecaoLegal titulo="1. Quem é responsável">
        <p>
          A WSA English é a controladora dos dados tratados no app. Para qualquer assunto de privacidade,
          fale com a gente em{' '}
          <a href={`mailto:${EMAIL_DE_CONTATO}`} className={link}>
            {EMAIL_DE_CONTATO}
          </a>
          .
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="2. Quais dados coletamos">
        <ListaLegal
          itens={[
            <>
              <strong>Cadastro:</strong> nome, e-mail e senha (guardada só em forma cifrada).
            </>,
            <>
              <strong>Plano:</strong> qual plano está ativo na sua conta. Os dados de pagamento ficam com a
              plataforma de pagamento parceira; nós não vemos nem guardamos o número do cartão.
            </>,
            <>
              <strong>Estudo:</strong> aulas iniciadas e concluídas, página em que você parou, respostas dos
              exercícios e os dias em que estudou.
            </>,
            <>
              <strong>Segurança:</strong> endereço IP e navegador de cada sessão, e as tentativas de login,
              para proteger sua conta contra acessos indevidos.
            </>,
          ]}
        />
        <p>
          Não pedimos CPF, telefone nem endereço, e não usamos cookies de publicidade ou rastreamento.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="3. Para que usamos">
        <ListaLegal
          itens={[
            'Manter sua conta e o acesso ao seu plano.',
            'Guardar seu progresso e liberar a próxima aula.',
            'Enviar e-mails de serviço: confirmação de e-mail e recuperação de senha. Não enviamos propaganda sem o seu consentimento.',
            'Proteger a conta, bloqueando tentativas repetidas de login e registrando ações administrativas.',
          ]}
        />
      </SecaoLegal>

      <SecaoLegal titulo="4. Senha, sessão e cookies">
        <ListaLegal
          itens={[
            'Sua senha é guardada com argon2id, um algoritmo feito para que nem nós consigamos lê-la.',
            'Usamos um único cookie essencial, que mantém você conectado: vale 24 horas ou, se você marcar "lembrar de mim", 30 dias. Ele não pode ser lido por scripts da página.',
            'Os links de recuperação de senha valem 1 hora e os de confirmação de e-mail, 24 horas. Cada link funciona uma única vez.',
            'Depois de 5 tentativas erradas de login em 15 minutos, o acesso por aquele e-mail e endereço fica pausado por 15 minutos.',
          ]}
        />
      </SecaoLegal>

      <SecaoLegal titulo="5. Voz e prática oral">
        <p>
          A prática oral com inteligência artificial ainda não está disponível, então hoje o app não grava
          nem guarda sua voz. Antes de ativar esse recurso, atualizaremos esta política e pediremos a sua
          autorização.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="6. Com quem compartilhamos">
        <p>Não vendemos seus dados. Eles passam apenas por fornecedores necessários para o app funcionar:</p>
        <ListaLegal
          itens={[
            'o provedor de hospedagem e de banco de dados, onde o app e os dados ficam guardados;',
            'o serviço de envio de e-mails, que recebe seu nome e e-mail para entregar as mensagens de serviço;',
            'o serviço de armazenamento de mídia, que guarda os vídeos e imagens das aulas;',
            'a plataforma de pagamento, quando você compra um plano.',
          ]}
        />
        <p>
          <strong>Sobre os áudios das aulas:</strong> cada áudio fica num endereço próprio, com um código
          embaralhado no nome do arquivo. Quem tiver o endereço completo abre o áudio sem entrar na conta.
          Esses endereços aparecem só dentro da aula, para quem tem acesso a ela, e não ficam listados em
          nenhuma página pública. Ainda assim, evite repassar o link de um áudio para quem não é aluno.
        </p>
        <p>Também podemos compartilhar dados quando a lei ou uma ordem judicial exigir.</p>
      </SecaoLegal>

      <SecaoLegal titulo="7. Por quanto tempo guardamos">
        <p>
          Guardamos os dados enquanto sua conta existir. Sessões e links de e-mail deixam de funcionar assim
          que expiram. Se você pedir o encerramento da conta, apagamos os dados pessoais, exceto o que a
          lei nos obriga a manter (como registros de acesso e de compra, pelo prazo legal).
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="8. Seus direitos">
        <p>Pela LGPD, você pode pedir a qualquer momento:</p>
        <ListaLegal
          itens={[
            'confirmação de que tratamos seus dados e uma cópia deles;',
            'correção de dados incompletos ou errados;',
            'exclusão da conta e dos dados pessoais;',
            'informação sobre com quem compartilhamos seus dados;',
            'revogação de um consentimento que você tenha dado.',
          ]}
        />
        <p>
          Basta escrever para{' '}
          <a href={`mailto:${EMAIL_DE_CONTATO}`} className={link}>
            {EMAIL_DE_CONTATO}
          </a>{' '}
          a partir do e-mail cadastrado. Respondemos em até 15 dias. Você também pode procurar a Autoridade
          Nacional de Proteção de Dados (ANPD).
        </p>
        <p>
          <strong>Excluir sua conta:</strong> em Perfil → Excluir minha conta, com a sua senha, você apaga a
          sua conta a qualquer momento. Na hora, apagamos seu nome, e-mail, foto e senha, as aulas
          concluídas, as respostas dos exercícios, os dias de estudo, as tentativas de login e todas as
          sessões abertas, em todos os aparelhos. Guardamos apenas o registro das suas compras, sem nome nem
          e-mail, ligado a uma conta anônima, porque a lei fiscal nos obriga a manter esses registros (LGPD,
          art. 16, I), e o registro de que o pedido de exclusão foi feito e atendido, para podermos comprovar
          isso. O acesso ao plano termina junto com a conta. A exclusão não pode ser desfeita, mas o seu
          e-mail fica livre: se quiser voltar, pode criar uma conta nova, que começa do zero. Se preferir,
          também pode pedir a exclusão pelo nosso contato; nesse caso quem faz é a nossa equipe, e o motivo
          fica registrado.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="9. Mudanças nesta política">
        <p>
          Se esta política mudar de forma importante, avisaremos no app ou por e-mail. A data no topo da
          página mostra a versão em vigor.
        </p>
      </SecaoLegal>
    </PaginaLegal>
  );
}
