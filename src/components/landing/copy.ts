/**
 * Todo o texto da landing (`docs/LANDING.md`). Nenhuma frase nasce no JSX.
 * O critério de escrita (vícios a evitar, o que manter) está em `docs/ESCRITA.md`.
 *
 * ⚠️ LOCK 25: a página vende evolução e capacidade concreta — nunca fluência nem
 * prazo. E não há prova social: nenhum depoimento, nota ou número de alunos,
 * porque nenhum existe ainda.
 *
 * ⚠️ Só promete o que existe no app: não há revisão espaçada nem app instalável. A prática
 * com IA é um prompt pronto que o aluno leva para a IA que preferir. O plano é liberado
 * depois do pagamento: pelo webhook, quando o gateway real estiver plugado, ou pela equipe,
 * à mão (ver `docs/PAGAMENTO.md`).
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
    // Duas partes porque a segunda sai em amarelo. Lidas em sequência formam uma
    // frase só; o leitor de tela não percebe a emenda.
    titulo: { antes: 'Do zero a falar de você em inglês, em', destaque: '42 aulas curtas.' },
    subtitulo:
      'Se apresentar, falar da família e da rotina, pedir no restaurante, contar o que fez ontem. Cada aula termina com algo que você já consegue dizer, e o app mostra isso para você.',
    cta: 'QUERO COMEÇAR PELA AULA 01',
    jaTenhoConta: 'Já tenho conta · Entrar',
    nota: 'Cadastro em menos de um minuto. A Aula 01 abre logo em seguida.',
    // Faixa do pé da primeira dobra. `icone` é o nome do arquivo em
    // `public/brand/icone-<nome>.webp`.
    recursos: [
      { icone: 'raio', titulo: 'Aulas curtas', corpo: 'De 8 a 15 minutos' },
      { icone: 'progresso', titulo: 'Seu progresso', corpo: 'Veja o que já sabe' },
      { icone: 'estrela', titulo: 'Inglês na prática', corpo: 'Frases para usar' },
    ],
    // Em inglês de propósito: são as assinaturas da marca, decorativas na arte.
    lema: 'Small steps, big results',
    assinatura: 'A better you',
    garantias: [
      { titulo: 'Começa do zero', corpo: 'A Aula 01 não cobra nada que ninguém te ensinou.' },
      { titulo: 'Aulas de 8 a 15 minutos', corpo: 'Cabem num dia cheio, sem tomar a noite inteira.' },
      { titulo: 'Você retoma de onde parou', corpo: 'Se você sumir por duas semanas, o app mostra o próximo passo, sem cobrança.' },
    ],
  },

  dor: {
    titulo: 'Você já tentou antes e travou em algum destes pontos',
    corpo: 'A causa costuma ser a forma como o curso foi organizado, e não a sua capacidade.',
    itens: [
      { titulo: 'Falta tempo para estudar', corpo: 'Você fica duas semanas sem estudar e sente que precisa recomeçar do zero.' },
      { titulo: 'Você estuda, mas não vê progresso', corpo: '“Já fiz várias aulas e ainda não falo nada.” O curso só mostra quantas aulas você fez.' },
      { titulo: 'Falar dá vergonha', corpo: 'Com medo de errar na frente dos outros, você lê, escuta e nunca fala.' },
      { titulo: 'O curso não começa onde você está', corpo: 'A primeira aula já cobra algo que ninguém ensinou, e você acha que a culpa é sua.' },
    ],
  },

  conquistas: {
    titulo: 'O que você vai conseguir dizer, aula por aula',
    corpo:
      'São 42 aulas em sequência. Cada trecho termina com algo que você consegue usar numa conversa.',
    marcos: [
      { aulas: 'Aulas 01 a 05', titulo: 'Me apresentar e cumprimentar', exemplo: 'Hi! I’m Ana. Nice to meet you.' },
      { aulas: 'Aulas 06 a 09', titulo: 'Dizer de onde sou e falar da família', exemplo: 'I’m from Brazil. This is my sister.' },
      { aulas: 'Aulas 10 a 20', titulo: 'Descrever a casa, objetos, cores e números', exemplo: 'There is a blue sofa in the living room.' },
      { aulas: 'Aulas 21 a 29', titulo: 'Dizer as horas e falar da rotina e do trabalho', exemplo: 'I work on Mondays. It’s seven o’clock.' },
      { aulas: 'Aulas 31 a 39', titulo: 'Pedir direções, dizer do que gosto e pedir comida', exemplo: 'Where is the bank? I love cooking.' },
      { aulas: 'Aulas 40 a 42', titulo: 'Contar o que fiz no passado', exemplo: 'Yesterday I went to the park.' },
    ],
    nota: 'Duas aulas de revisão (30 e 42) juntam tudo antes de seguir.',
  },

  comoFunciona: {
    titulo: 'Como o WSA English resolve isso',
    corpo: 'As aulas têm uma ordem, e o app sempre mostra qual é o próximo passo.',
    passos: [
      { titulo: 'Aprenda', corpo: 'Uma aula curta por vez, na ordem certa, com textos, explicações e áudios feitos para o celular.' },
      { titulo: 'Pratique', corpo: 'Exercícios logo depois da explicação. Quando você erra, a correção explica o motivo.' },
      { titulo: 'Avance', corpo: 'O app mostra o que você já consegue e qual é a próxima aula.' },
    ],
  },

  metodo: {
    titulo: 'O que sustenta o método',
    corpo: 'O curso foi organizado em torno de quatro pontos.',
    pilares: [
      { titulo: 'Estrutura', corpo: 'Você nunca abre o app sem saber o que estudar. Uma aula por vez, na ordem certa.' },
      { titulo: 'Progresso que dá para ver', corpo: 'No lugar de nota, o que você já consegue: me apresentar, dizer de onde sou, falar da família.' },
      { titulo: 'Aplicação', corpo: 'Cada regra de gramática vira exercício e frase escrita por você.' },
      { titulo: 'Continuidade', corpo: 'Se você parar, volta de onde estava. Não há sequência de dias a perder nem mensagem de culpa.' },
    ],
    firewallTitulo: 'Você nunca é cobrado por algo que ainda não foi ensinado',
    firewallCorpo:
      'Nenhum exercício usa estrutura que você ainda não viu. Por isso dá para começar do zero sem se sentir perdido.',
  },

  recebe: {
    titulo: 'O que você recebe',
    corpo: 'Os dois planos seguem as mesmas 42 aulas. O WSA Premium acrescenta videoaulas e prática com IA.',
    itens: [
      {
        titulo: 'As 42 aulas do Módulo 01',
        corpo: 'Vocabulário, textos, explicações e exercícios, aula por aula, feitos para estudar no celular.',
        plano: 'Nos dois planos',
        premium: false,
      },
      {
        titulo: 'Exercícios com correção que explica',
        corpo: 'Quando você erra, o retorno explica o motivo.',
        plano: 'Nos dois planos',
        premium: false,
      },
      {
        titulo: 'Gabarito na hora certa',
        corpo: 'Liberado depois que você tenta, para você pensar antes de conferir.',
        plano: 'Nos dois planos',
        premium: false,
      },
      {
        titulo: 'Áudios para ouvir a pronúncia',
        corpo: 'Frases e diálogos das aulas em áudio, em inglês americano, para ouvir quantas vezes quiser.',
        plano: 'Nos dois planos',
        premium: false,
      },
      {
        titulo: 'Revisões e progresso que mostram o que você consegue',
        corpo: 'Duas aulas de revisão, seus acertos aula por aula e o próximo passo sempre à vista.',
        plano: 'Nos dois planos',
        premium: false,
      },
      {
        titulo: 'Videoaulas com o professor',
        corpo: 'A explicação da aula em vídeo, com o professor, direto no app.',
        plano: 'Só no WSA Premium',
        premium: true,
      },
      {
        titulo: 'Prompts prontos de prática com IA',
        corpo:
          'No fim das aulas, um prompt pronto leva o que você estudou para uma conversa com a IA que você preferir. A aula do dia é o foco, as anteriores são a base, e nada que ainda não foi ensinado entra.',
        plano: 'Só no WSA Premium',
        premium: true,
      },
    ],
  },

  professor: {
    rotulo: 'O professor',
    nome: 'Walber Santana',
    papel: 'Professor e autor do método WSA English',
    corpo:
      'As 42 aulas, a ordem delas e as videoaulas vêm de um método que o professor já usa em sala de aula.',
    corpo2:
      'O aplicativo segue esse mesmo curso: acompanha você aula a aula, lembra onde parou e mostra o que você já consegue.',
    retratoAlt: 'Ilustração de Walber Santana, professor e autor do método WSA English',
  },

  planos: {
    titulo: 'Escolha como quer estudar',
    corpo: 'Os dois planos seguem as mesmas 42 aulas, completas. O WSA Premium acrescenta videoaulas e prática com IA.',
    lista: [
      {
        chave: 'ESSENCIAL',
        subtitulo: 'Aprenda com a experiência estruturada do WSA English',
        corpo: 'A experiência completa de aprendizagem: as 42 aulas no app, na ordem certa, com tudo o que cada uma precisa.',
        itens: [
          'As 42 aulas do Módulo 01, com vocabulário, textos e explicações',
          'Exercícios com correção que explica o motivo',
          'Áudios em inglês para ouvir a pronúncia',
          'Revisões e progresso que mostram o que você já consegue',
        ],
      },
      {
        chave: 'PREMIUM',
        subtitulo: 'Aprenda, aprofunde e pratique',
        corpo:
          'Tudo do WSA Essencial, mais videoaulas e prompts prontos de prática com IA. É o passo de “eu reconheço isso quando vejo” para “eu consigo usar isso quando preciso”.',
        itens: [
          'Tudo do WSA Essencial',
          'Videoaulas com o professor, direto na aula',
          'Prompts prontos de prática com IA no fim das aulas',
          'A prática usa só o que você já estudou: a aula do dia e as anteriores',
        ],
      },
    ],
    comprar: 'QUERO GARANTIR MEU ACESSO',
    escolher: 'QUERO ESCOLHER MEU PLANO',
    notaSemLink: 'Crie sua conta e comece pela Aula 01. Preço e forma de pagamento aparecem nesta página quando a compra estiver aberta.',
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
      'O Código de Defesa do Consumidor dá 7 dias para desistir de uma compra feita pela internet. Vale aqui, sem precisar justificar.',
  },

  faq: {
    titulo: 'Antes de começar, você deve estar se perguntando',
    itens: [
      { p: 'Preciso saber alguma coisa de inglês?', r: 'Não. A Aula 01 começa pelos pronomes pessoais e assume conhecimento zero. Se você já sabe algo, avança mais rápido.' },
      { p: 'Quanto tempo por dia eu preciso?', r: 'Cada aula leva de 8 a 15 minutos. Não existe meta diária obrigatória nem punição por faltar.' },
      { p: 'E se eu parar por algumas semanas?', r: 'Você volta e o app mostra onde parou. Não há sequência a perder nem mensagem de culpa.' },
      { p: 'Em quanto tempo eu fico fluente?', r: 'Não prometemos prazo, porque o tempo varia de pessoa para pessoa. O que este módulo entrega é base: 42 aulas que levam do zero a se apresentar, falar de pessoas, lugares, rotina, horas e passado simples.' },
      { p: 'Vou ter que falar em voz alta com outras pessoas?', r: 'Não. Não há aula ao vivo nem turma. No WSA Premium, a prática de conversa acontece entre você e a IA que você escolher, na sua própria conta.' },
      { p: 'Funciona no celular?', r: 'Foi feito primeiro para o celular e funciona também no navegador do computador.' },
      {
        p: 'Qual a diferença entre o WSA Essencial e o WSA Premium?',
        r: 'Os dois têm as 42 aulas completas no app, com exercícios, áudios, revisões e progresso. O WSA Premium acrescenta as videoaulas com o professor e os prompts prontos de prática com IA, para você usar numa conversa o que acabou de estudar.',
      },
      {
        p: 'Como funciona a prática com IA do WSA Premium?',
        r: 'No fim da aula, o app entrega um prompt pronto. Com um toque, ele abre no ChatGPT, ou você copia e cola na IA que preferir. O prompt só usa o que você já estudou: a aula do dia é o foco e as anteriores servem de base. A IA é um serviço de outra empresa, e a conversa fica na sua conta de lá.',
      },
    ],
  },

  fecho: {
    titulo: 'Comece pela primeira aula',
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
