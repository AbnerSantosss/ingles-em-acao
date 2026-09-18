/**
 * Todo o texto da landing (`docs/LANDING.md`). Nenhuma frase nasce no JSX.
 *
 * ⚠️ LOCK 25: a página vende evolução e capacidade concreta — nunca fluência nem
 * prazo. E não há prova social: nenhum depoimento, nota ou número de alunos,
 * porque nenhum existe ainda.
 *
 * ⚠️ Só promete o que existe no app: a prática de fala com IA é "em breve", não há
 * revisão espaçada nem app instalável, e o plano é liberado pela equipe depois do
 * pagamento (não há webhook).
 */
export const copyDaLanding = {
  a11y: {
    pular: 'Ir para o conteúdo',
    navegacao: 'Seções da página',
    abreEmOutraAba: ' (abre em outra aba)',
  },
  nav: [
    { href: '#o-que-voce-vai-dizer', rotulo: 'O que você vai dizer' },
    { href: '#como-funciona', rotulo: 'Como funciona' },
    { href: '#metodo', rotulo: 'O método' },
    { href: '#planos', rotulo: 'Planos' },
    { href: '#perguntas', rotulo: 'Perguntas' },
  ],
  entrar: 'Entrar',

  hero: {
    selo: 'Inglês do zero · Método WSA English · 42 aulas',
    titulo: 'Do zero a falar de você em inglês — em 42 aulas curtas.',
    subtitulo:
      'Se apresentar, falar da família e da rotina, pedir no restaurante, contar o que fez ontem. Cada aula termina com algo que você já consegue dizer — e o app mostra isso para você.',
    cta: 'QUERO COMEÇAR PELA AULA 01',
    jaTenhoConta: 'Já tenho conta · Entrar',
    nota: 'Cadastro em menos de um minuto. A Aula 01 abre logo em seguida.',
    garantias: [
      { titulo: 'Começa do zero de verdade', corpo: 'A Aula 01 não cobra nada que ninguém te ensinou.' },
      { titulo: 'Aulas de 8 a 15 minutos', corpo: 'Cabem num dia cheio. Não tomam a noite inteira.' },
      { titulo: 'Você retoma de onde parou', corpo: 'Sumiu duas semanas? O app mostra o próximo passo, sem cobrança.' },
    ],
  },

  dor: {
    titulo: 'Você já tentou antes. E travou em algum destes pontos.',
    corpo: 'Não é falta de capacidade sua. É como o curso foi organizado.',
    itens: [
      { titulo: 'O tempo nunca fecha', corpo: 'Duas semanas fora e bate a sensação de recomeçar do zero.' },
      { titulo: 'Você estuda, mas não vê progresso', corpo: '“Já fiz várias aulas e ainda não falo nada.” Contar aulas não é progresso.' },
      { titulo: 'Falar dá vergonha', corpo: 'Medo de errar na frente dos outros. Então você lê, escuta e nunca fala.' },
      { titulo: 'O curso não começa onde você está', corpo: 'A primeira aula já cobra algo que ninguém ensinou. E a culpa parece sua.' },
    ],
  },

  conquistas: {
    titulo: 'O que você vai conseguir dizer, aula por aula',
    corpo:
      'Sem promessa de fluência e sem prazo mágico. Uma trilha de 42 aulas em que cada trecho vira algo que você usa de verdade.',
    marcos: [
      { aulas: 'Aulas 01–05', titulo: 'Me apresentar e cumprimentar', exemplo: 'Hi! I’m Ana. Nice to meet you.' },
      { aulas: 'Aulas 06–09', titulo: 'Dizer de onde sou e falar da família', exemplo: 'I’m from Brazil. This is my sister.' },
      { aulas: 'Aulas 10–20', titulo: 'Descrever a casa, objetos, cores e números', exemplo: 'There is a blue sofa in the living room.' },
      { aulas: 'Aulas 21–29', titulo: 'Dizer as horas e falar da rotina e do trabalho', exemplo: 'I work on Mondays. It’s seven o’clock.' },
      { aulas: 'Aulas 31–39', titulo: 'Pedir direções, dizer do que gosto e pedir comida', exemplo: 'Where is the bank? I love cooking.' },
      { aulas: 'Aulas 40–42', titulo: 'Contar o que fiz no passado', exemplo: 'Yesterday I went to the park.' },
    ],
    nota: 'Duas aulas de revisão (30 e 42) juntam tudo antes de seguir.',
  },

  comoFunciona: {
    titulo: 'Como o WSA English resolve isso',
    corpo: 'Não é catálogo de vídeo. É uma jornada com ordem e próximo passo visível.',
    passos: [
      { titulo: 'Aprenda', corpo: 'Uma aula curta por vez, na ordem certa, no e-book digital feito para o celular.' },
      { titulo: 'Pratique', corpo: 'Exercícios logo depois da explicação. Errou? A correção diz por quê.' },
      { titulo: 'Avance', corpo: 'O app mostra o que você já consegue e qual é a próxima aula.' },
    ],
  },

  metodo: {
    titulo: 'O que sustenta o método',
    corpo: 'Quatro decisões que pesam mais que qualquer recurso isolado.',
    pilares: [
      { titulo: 'Estrutura', corpo: 'Você nunca abre o app sem saber o que estudar. Uma aula por vez, na ordem certa.' },
      { titulo: 'Progresso que dá para ver', corpo: 'No lugar de nota, o que você já consegue: me apresentar, dizer de onde sou, falar da família.' },
      { titulo: 'Aplicação', corpo: 'Gramática é meio, não fim. Cada regra vira exercício e frase escrita por você.' },
      { titulo: 'Continuidade', corpo: 'Parou? Volta de onde estava. Sem sequência a perder e sem mensagem de culpa.' },
    ],
    firewallTitulo: 'Você nunca é cobrado por algo que ainda não foi ensinado',
    firewallCorpo:
      'Nenhum exercício usa estrutura que você ainda não viu. É isso que deixa começar do zero sem se sentir perdido.',
  },

  recebe: {
    titulo: 'O que você recebe',
    corpo: 'Todos os planos seguem as mesmas 42 aulas. Muda o que acompanha cada uma.',
    itens: [
      { titulo: 'As 42 aulas do Módulo 01', corpo: 'O e-book completo, aula por aula, feito para ler no celular.', plano: 'Todos os planos' },
      { titulo: 'Exercícios com correção que explica', corpo: 'Errou? O retorno diz por quê, não só que errou.', plano: 'Todos os planos' },
      { titulo: 'Gabarito na hora certa', corpo: 'Liberado depois que você tenta. Conferir antes de pensar não ensina.', plano: 'Todos os planos' },
      { titulo: 'Progresso que mostra o que você consegue', corpo: 'Aula por aula, com seus acertos e o próximo passo sempre à vista.', plano: 'Todos os planos' },
      { titulo: 'Videoaulas com o professor', corpo: 'A explicação completa de cada aula, direto no app.', plano: 'Completo e Premium' },
      { titulo: 'Prática de fala com IA, sem plateia', corpo: 'Fale em voz alta e erre quantas vezes quiser. Só você ouve. Em breve no app.', plano: 'Premium' },
    ],
  },

  professor: {
    rotulo: 'O professor',
    nome: 'Walber Santana',
    papel: 'Professor e autor do método WSA English',
    corpo:
      'As 42 aulas, a ordem delas e as videoaulas vêm de um método já usado em sala — não de um curso montado às pressas para virar aplicativo.',
    corpo2:
      'O aplicativo não inventa um curso novo. Ele acompanha você aula a aula, lembra onde parou e mostra o que você já consegue.',
    retratoAlt: 'Ilustração de Walber Santana, professor e autor do método WSA English',
  },

  planos: {
    titulo: 'Escolha como quer estudar',
    corpo: 'Todos os planos seguem a mesma jornada de 42 aulas. O que muda é o que acompanha cada aula.',
    lista: [
      {
        chave: 'ESSENCIAL',
        nome: 'Essencial',
        subtitulo: 'A base completa',
        corpo: 'E-book + as 42 aulas no app, com exercícios, gabaritos e progresso.',
      },
      {
        chave: 'COMPLETO',
        nome: 'Completo',
        subtitulo: 'Inglês em Ação',
        corpo: 'Tudo do Essencial + as videoaulas com o professor.',
      },
      {
        chave: 'PREMIUM',
        nome: 'Premium',
        subtitulo: 'Inglês Prático com IA',
        corpo: 'Tudo do Completo + prática oral com IA em todas as aulas (em breve).',
      },
    ],
    comprar: 'QUERO GARANTIR MEU ACESSO',
    escolher: 'QUERO ESCOLHER MEU PLANO',
    notaSemLink: 'Preço e formas de pagamento entram em breve. Por enquanto, crie sua conta e comece pela Aula 01.',
    notaComLink:
      'O pagamento acontece numa página segura da plataforma, fora do app. Aprovado o pagamento, o plano é liberado na sua conta.',
  },

  /**
   * ⚠️ Artigo 49 do CDC (7 dias de arrependimento em compra pela internet).
   * Depende de revisão jurídica, e o prazo precisa ser o mesmo da plataforma de
   * pagamento. Só aparece quando há link de compra.
   */
  garantia: {
    titulo: 'Se não for para você, você tem 7 dias',
    corpo:
      'O Código de Defesa do Consumidor dá 7 dias para desistir de uma compra feita pela internet. Vale aqui, sem justificativa e sem discussão.',
  },

  faq: {
    titulo: 'Antes de começar, você deve estar se perguntando',
    itens: [
      { p: 'Preciso saber alguma coisa de inglês?', r: 'Não. A Aula 01 começa pelos pronomes pessoais e assume conhecimento zero. Se você já sabe algo, avança mais rápido.' },
      { p: 'Quanto tempo por dia eu preciso?', r: 'Cada aula leva de 8 a 15 minutos. Não existe meta diária obrigatória nem punição por faltar.' },
      { p: 'E se eu parar por algumas semanas?', r: 'Você volta e o app mostra onde parou. Não há sequência a perder nem mensagem de culpa.' },
      { p: 'Em quanto tempo eu fico fluente?', r: 'Não vamos prometer prazo, porque ninguém honesto consegue. O que este módulo entrega é base: 42 aulas que levam do zero a se apresentar, falar de pessoas, lugares, rotina, horas e passado simples.' },
      { p: 'Vou ter que falar em voz alta com outras pessoas?', r: 'Nunca. Não há aula ao vivo nem turma. A prática de fala do Premium é com a IA, e só você ouve.' },
      { p: 'Funciona no celular?', r: 'Foi feito primeiro para o celular e funciona também no navegador do computador.' },
    ],
  },

  fecho: {
    titulo: 'O único passo que falta é a primeira aula.',
    corpo: 'Faça a Aula 01 e veja se este jeito de estudar combina com você.',
    cta: 'QUERO FAZER MINHA PRIMEIRA AULA',
    assinatura: 'Small steps, big results.',
  },

  rodape: {
    tagline: 'Curso de inglês do zero, em 42 aulas, com prática e progresso que você consegue perceber.',
    colunaPagina: 'Nesta página',
    colunaConta: 'Conta',
    colunaLegal: 'Legal',
    termos: 'Termos de uso',
    privacidade: 'Política de privacidade',
    criarConta: 'Criar conta',
    esqueci: 'Esqueci minha senha',
    contato: 'Contato',
    email: 'contato@wsaenglish.com.br',
    direitos: (ano: number) => `© ${ano} WSA English. Todos os direitos reservados.`,
    feitoNo: 'Feito no Brasil.',
  },
} as const;
