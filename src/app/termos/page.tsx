import type { Metadata } from 'next';
import Link from 'next/link';

import { EMAIL_DE_CONTATO, ListaLegal, PaginaLegal, SecaoLegal } from '@/components/legal/PaginaLegal';

/**
 * Termos de uso — versão preliminar, a revisar juridicamente antes da venda.
 *
 * Descreve só o que o app faz HOJE: liberação de plano manual (sem webhook),
 * prática oral com IA ainda não disponível, nenhuma promessa de fluência ou
 * prazo (LOCK 25). Ao mudar o produto, mude o texto junto.
 */
export const metadata: Metadata = {
  title: 'Termos de uso',
  description: 'As regras de uso do WSA English, o curso de inglês do zero.',
};

const link = 'font-bold text-navy underline underline-offset-4';

export default function TermosPage() {
  return (
    <PaginaLegal
      titulo="Termos de uso"
      atualizadoEm="18 de setembro de 2026"
      introducao={
        <p>
          Estes termos explicam como funciona o <strong>Inglês em Ação</strong>, o curso de inglês da
          WSA English, e o que você e nós podemos esperar um do outro. Ao criar sua conta, você concorda
          com eles. Escrevemos em linguagem simples de propósito: se algo não ficar claro, pergunte.
        </p>
      }
    >
      <SecaoLegal titulo="1. O que é o Inglês em Ação">
        <p>
          Um curso de inglês para quem começa do zero, organizado em 42 aulas curtas. Cada aula combina
          leitura (a página do e-book), vídeo e exercícios, e o app guarda o seu progresso.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="2. Sua conta">
        <ListaLegal
          itens={[
            'Para usar o curso, você cria uma conta com nome, e-mail e senha.',
            'A conta é pessoal: não compartilhe sua senha nem o acesso com outras pessoas.',
            'Mantenha seu e-mail atualizado: é por ele que você recupera a senha.',
            'Se perceber algum acesso que não foi seu, troque a senha e nos avise.',
          ]}
        />
      </SecaoLegal>

      <SecaoLegal titulo="3. Como as aulas são liberadas">
        <p>
          As aulas seguem uma ordem pedagógica: cada uma se apoia na anterior. Por isso, a próxima aula
          abre quando você conclui a atual. As revisões fazem parte da trilha e seguem a mesma regra.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="4. Planos e pagamento">
        <ListaLegal
          itens={[
            'O curso é oferecido em dois planos: WSA Essencial e WSA Premium. O que cada um inclui está descrito na página inicial.',
            'O pagamento é feito na página de uma plataforma de pagamento parceira, que tem os próprios termos. Nós não recebemos nem guardamos os dados do seu cartão.',
            'Depois da confirmação do pagamento, o plano é liberado na sua conta pela nossa equipe.',
            <>
              Garantia: você pode desistir da compra em até 7 dias e receber o valor pago de volta. Basta
              escrever para{' '}
              <a href={`mailto:${EMAIL_DE_CONTATO}`} className={link}>
                {EMAIL_DE_CONTATO}
              </a>
              .
            </>,
          ]}
        />
      </SecaoLegal>

      <SecaoLegal titulo="5. O que prometemos e o que não prometemos">
        <p>
          Prometemos um caminho claro, do zero até conseguir falar de você, da sua rotina e do que fez
          ontem, com prática em cada aula. Não prometemos fluência nem resultado em prazo determinado:
          o ritmo de cada pessoa é diferente e depende da prática.
        </p>
        <p>
          A prática oral com inteligência artificial ainda não está disponível. Quando estiver, avisaremos
          no app, e estes termos serão atualizados.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="6. Uso do conteúdo">
        <p>
          Textos, vídeos, áudios, ilustrações e exercícios são da WSA English e protegidos por direito
          autoral. Você pode usá-los para estudar. Não é permitido copiar, revender, redistribuir ou
          publicar o conteúdo, no todo ou em parte, sem autorização por escrito.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="7. Uso adequado">
        <ListaLegal
          itens={[
            'Não tente acessar contas de outras pessoas nem áreas do sistema que não são suas.',
            'Não use robôs ou programas para baixar o conteúdo em massa.',
            'Não tente burlar a ordem das aulas ou os limites do seu plano.',
          ]}
        />
        <p>Se isso acontecer, podemos suspender a conta, sempre avisando o motivo.</p>
      </SecaoLegal>

      <SecaoLegal titulo="8. Disponibilidade">
        <p>
          Trabalhamos para o app ficar no ar o tempo todo, mas pode haver pausas para manutenção. Quando
          forem planejadas, avisaremos com antecedência dentro do app.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="9. Encerrar a conta">
        <p>
          Você pode pedir o encerramento da sua conta a qualquer momento, por e-mail para{' '}
          <a href={`mailto:${EMAIL_DE_CONTATO}`} className={link}>
            {EMAIL_DE_CONTATO}
          </a>
          . Como seus dados são tratados nesse caso está na{' '}
          <Link href="/privacidade" className={link}>
            política de privacidade
          </Link>
          .
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="10. Mudanças nestes termos">
        <p>
          Se estes termos mudarem de forma importante, avisaremos no app ou por e-mail antes de a mudança
          valer. A data no topo da página mostra a versão em vigor.
        </p>
      </SecaoLegal>

      <SecaoLegal titulo="11. Lei aplicável">
        <p>
          Estes termos seguem as leis brasileiras, incluindo o Código de Defesa do Consumidor. Eventuais
          conflitos podem ser levados ao foro do domicílio do consumidor.
        </p>
      </SecaoLegal>
    </PaginaLegal>
  );
}
