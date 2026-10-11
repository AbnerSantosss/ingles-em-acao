/**
 * Todo o texto da landing (`docs/LANDING.md`). Nenhuma frase nasce no JSX.
 * O critério de escrita (vícios a evitar, o que manter) está em `docs/ESCRITA.md`.
 *
 * ⚠️ LOCK 25: a página vende evolução e capacidade concreta — nunca fluência nem
 * prazo. Não há depoimentos nem avaliações. Os dados do professor (20 anos,
 * mais de 500 alunos) foram confirmados pelo responsável em 2026-10-10.
 *
 * ⚠️ Só promete o que existe no app: não há revisão espaçada nem app instalável. A prática
 * com IA é um roteiro pronto que o aluno leva para a IA que preferir. O plano é liberado
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
    { href: '#conversa-ia', rotulo: 'Conversa com IA' },
    { href: '#metodo', rotulo: 'O método' },
    { href: '#planos', rotulo: 'Planos' },
    { href: '#perguntas', rotulo: 'Perguntas' },
  ],
  entrar: 'Entrar',

  hero: {
    // Duas partes porque a segunda sai em amarelo. Lidas em sequência formam uma
    // frase só; o leitor de tela não percebe a emenda.
    titulo: {
      antes: 'Aprenda inglês do zero e',
      destaque: 'converse de verdade com a IA, desde as primeiras aulas.',
    },
    subtitulo:
      '42 aulas curtas + prática de conversação com IA, orientada pelo que você já estudou.',
    cta: 'ASSISTIR PRIMEIRA AULA',
    ctaConversa: 'Ver como funciona a conversa',
    jaTenhoConta: 'Já tenho conta · Entrar',
    nota: 'Cadastro em menos de um minuto. A Aula 01 abre logo em seguida.',
    // Faixa do pé da primeira dobra. `icone` é o nome do arquivo em
    // `public/brand/icone-<nome>.webp`.
    recursos: [
      { icone: 'raio', titulo: 'Aulas curtas', corpo: 'De 8 a 15 minutos' },
      {
        icone: 'progresso',
        titulo: 'Seu progresso',
        corpo: 'Veja o que já sabe',
      },
      { icone: 'estrela', titulo: 'Conversa com IA', corpo: 'No WSA Premium' },
    ],
    // Em inglês de propósito: são as assinaturas da marca, decorativas na arte.
    lema: 'Small steps, big results',
    assinatura: 'A better you',
  },

  dor: {
    titulo: 'Você já tentou e travou',
    corpo:
      'O problema quase nunca é você. É o curso que não foi feito para a sua rotina.',
    itens: [
      {
        titulo: 'Falta tempo para estudar',
        fala: 'Fiquei 2 semanas sem estudar e perdi tudo.',
        corpo:
          'Ficou duas semanas sem estudar? Parece que perdeu tudo e precisa voltar do zero.',
        respostaIA: null,
      },
      {
        titulo: 'Você estuda, mas não vê progresso',
        fala: 'Já fiz várias aulas e não falo nada.',
        corpo: 'Você vê quantas aulas fez, mas não vê o que já aprendeu.',
        respostaIA: null,
      },
      {
        titulo: 'Falar dá vergonha',
        fala: 'Tenho vergonha de errar na frente dos outros.',
        corpo: 'Com medo de errar, você lê, escuta e nunca fala.',
        respostaIA:
          'Aqui você começa falando com a IA, sem ninguém olhando. No WSA Premium.',
      },
      {
        titulo: 'O curso começa onde você ainda não chegou',
        fala: 'Já na primeira aula pedem algo que eu nunca aprendi.',
        corpo:
          'Já na primeira aula pedem o que ninguém te ensinou. E você acha que o problema é você.',
        respostaIA: null,
      },
    ],
    notaFalas: 'Você se reconhece em alguma dessas frases?',
    imagemAlt:
      'Jovem estudante com moletom azul marinho e relógio roxo, frustrada ao estudar.',
  },

  conquistas: {
    titulo: 'O que você vai conseguir dizer, aula por aula',
    corpo:
      'São 42 aulas em sequência. Cada trecho termina com algo que você consegue usar numa conversa.',
    marcos: [
      {
        aulas: 'Aulas 01 a 05',
        titulo: 'Me apresentar e cumprimentar',
        exemplo: 'Hi! I’m Ana. Nice to meet you.',
      },
      {
        aulas: 'Aulas 06 a 09',
        titulo: 'Dizer de onde sou e falar da família',
        exemplo: 'I’m from Brazil. This is my sister.',
      },
      {
        aulas: 'Aulas 10 a 20',
        titulo: 'Descrever a casa, objetos, cores e números',
        exemplo: 'There is a blue sofa in the living room.',
      },
      {
        aulas: 'Aulas 21 a 29',
        titulo: 'Dizer as horas e falar da rotina e do trabalho',
        exemplo: 'I work on Mondays. It’s seven o’clock.',
      },
      {
        aulas: 'Aulas 31 a 39',
        titulo: 'Pedir direções, dizer do que gosto e pedir comida',
        exemplo: 'Where is the bank? I love cooking.',
      },
      {
        aulas: 'Aulas 40 a 42',
        titulo: 'Contar o que fiz no passado',
        exemplo: 'Yesterday I went to the park.',
      },
    ],
  },

  comoFunciona: {
    titulo: 'Como o WSA English resolve isso',
    corpo: 'Você sempre sabe qual é a próxima aula. É só abrir o app e seguir.',
    passos: [
      {
        titulo: 'Aprenda',
        corpo:
          'Uma aula curta por vez, na ordem certa, com textos, explicações e áudios feitos para o celular.',
      },
      {
        titulo: 'Pratique',
        corpo:
          'Exercícios logo depois da explicação. Quando você erra, a correção explica o motivo.',
      },
      {
        titulo: 'Avance',
        corpo: 'O app mostra o que você já consegue e qual é a próxima aula.',
      },
    ],
  },

  ia: {
    selo: 'Conversa com IA · WSA Premium',
    titulo: 'Estudou a aula? Agora converse sobre ela.',
    corpo:
      'No fim de cada aula, você abre a IA e pratica o que acabou de aprender, como numa conversa de verdade. Sem vergonha, sem plateia, quantas vezes quiser.',
    pontos: [
      {
        titulo: 'Sem vergonha de errar',
        corpo: 'A IA não julga. Você pode tentar de novo, no seu ritmo.',
      },
      {
        titulo: 'Só o que você já estudou',
        corpo:
          'O roteiro orienta a IA a praticar a aula do dia e as anteriores, sem cobrar conteúdo novo.',
      },
      {
        titulo: 'Qualquer hora',
        corpo: 'Treina no ônibus, no intervalo, em casa.',
      },
    ],
    nota: 'É só tocar em Praticar a aula. O ChatGPT abre automaticamente na sua conta, já com o roteiro da conversa preparado para você começar.',
    cta: 'Quero conversar com a IA',
    chatRotulo: 'Prática da aula · Apresentações',
    chatNota: 'Exemplo de conversa com IA',
    chat: [
      { autor: 'ia', texto: 'Hi! What’s your name?' },
      { autor: 'aluno', texto: 'I’m Ana.' },
      { autor: 'ia', texto: 'Nice to meet you, Ana!' },
      { autor: 'aluno', texto: 'Nice to meet you, too!' },
    ],
  },

  metodo: {
    titulo: 'Por que nosso método funciona',
    corpo: 'Do zero ao inglês que você usa de verdade, em 42 aulas curtas.',
    pilares: [
      {
        selo: '1 aula por vez',
        titulo: 'Sem dúvida do que estudar',
        corpo:
          'Você sempre sabe qual é a próxima aula. É só abrir o app e seguir.',
      },
      {
        selo: 'Correção que explica',
        titulo: 'Você pratica na hora',
        corpo:
          'Você pratica na hora: cada regra vira exercício, e você escreve as suas próprias frases.',
      },
      {
        selo: 'Volta de onde parou',
        titulo: 'Continuidade',
        corpo:
          'Parou um tempo? Volta de onde parou. Sem sequência para perder, sem bronca.',
      },
      {
        selo: 'Zero cobrança do que não foi ensinado',
        titulo: 'Começa do zero',
        corpo:
          'Nenhum exercício usa algo que você ainda não aprendeu. Dá para começar do zero sem se perder.',
      },
    ],
    garantiaSelo: 'Nossa garantia de método',
    firewallTitulo: 'Você nunca é cobrado por algo que ainda não foi ensinado',
    firewallCorpo:
      'Nenhum exercício usa algo que você ainda não aprendeu. Dá para começar do zero sem se perder.',
  },

  recebe: {
    titulo: 'O que você recebe',
    corpo:
      'Compare os planos. Os dois têm as 42 aulas; o Premium acrescenta conversa com IA e videoaulas.',
    tabelaLegenda:
      'Compare o que está incluído no WSA Essencial e no WSA Premium',
    incluido: 'Incluído',
    naoIncluido: 'Não incluído',
    itens: [
      {
        titulo: 'Roteiros prontos para conversar com a IA',
        corpo:
          'Toque em Praticar a aula: o ChatGPT abre na sua conta com a conversa pronta.',
        plano: 'Só no WSA Premium',
        premium: true,
        essencial: false,
        premiumIncluso: true,
      },
      {
        titulo: 'Videoaulas com o professor',
        corpo: 'A explicação da aula em vídeo, com o professor, direto no app.',
        plano: 'Só no WSA Premium',
        premium: true,
        essencial: false,
        premiumIncluso: true,
      },
      {
        titulo: 'As 42 aulas do Módulo 01',
        corpo:
          'Vocabulário, textos, explicações e exercícios, aula por aula, feitos para estudar no celular.',
        plano: 'Nos dois planos',
        premium: false,
        essencial: true,
        premiumIncluso: true,
      },
      {
        titulo: 'Exercícios com correção que explica',
        corpo: 'Quando você erra, o retorno explica o motivo.',
        plano: 'Nos dois planos',
        premium: false,
        essencial: true,
        premiumIncluso: true,
      },
      {
        titulo: 'Gabarito só depois que você tenta',
        corpo:
          'Gabarito só depois que você tenta, para você pensar antes de ver a resposta.',
        plano: 'Nos dois planos',
        premium: false,
        essencial: true,
        premiumIncluso: true,
      },
      {
        titulo: 'Áudios para ouvir a pronúncia',
        corpo:
          'Frases e diálogos das aulas em áudio, em inglês americano, para ouvir quantas vezes quiser.',
        plano: 'Nos dois planos',
        premium: false,
        essencial: true,
        premiumIncluso: true,
      },
      {
        titulo: 'Revisões que mostram o quanto você já evoluiu',
        corpo:
          'Duas aulas de revisão, seus acertos aula por aula e o próximo passo sempre à vista.',
        plano: 'Nos dois planos',
        premium: false,
        essencial: true,
        premiumIncluso: true,
      },
    ],
  },

  professor: {
    rotulo: 'O professor',
    nome: 'Walber Santana',
    papel: 'Professor de inglês há 20 anos.',
    alunos: 'Já ajudei mais de 500 alunos a aprender inglês.',
    corpo:
      'Criei o WSA English a partir do que funciona na minha sala de aula: aulas curtas, na ordem certa, e prática desde o primeiro dia.',
    corpo2:
      'O aplicativo acompanha você aula a aula, lembra onde parou e mostra o que você já consegue.',
    citacao:
      'Eu não quero que você decore regras. Quero que você consiga falar.',
    retratoAlt: 'Walber Santana, professor e autor do método WSA English',
  },

  planos: {
    titulo: 'Escolha como quer estudar',
    corpo:
      'Os dois têm 42 aulas. O Premium acrescenta conversa com IA e videoaulas.',
    lista: [
      {
        chave: 'PREMIUM',
        selo: 'Mais completo',
        seloIA: 'Conversa com IA',
        cta: 'Quero praticar com IA',
        subtitulo: 'Tudo do Essencial + conversa com a IA depois de cada aula.',
        corpo:
          'Toque em Praticar a aula e comece no seu ChatGPT. Aprofunde as explicações com as videoaulas do professor.',
        destaque: {
          antes: 'eu reconheço isso quando vejo',
          depois: 'eu consigo usar quando preciso',
        },
        itens: [
          'Conversa no ChatGPT ao tocar em Praticar a aula',
          'Prática com a aula do dia e as anteriores',
          'Tudo do WSA Essencial',
          'Videoaulas com o professor, direto na aula',
        ],
      },
      {
        chave: 'ESSENCIAL',
        selo: null,
        seloIA: null,
        cta: 'Quero o Essencial',
        subtitulo: 'Aprenda do zero, passo a passo',
        corpo:
          'As 42 aulas no app, na ordem certa, com tudo o que você precisa para aprender e praticar.',
        destaque: null,
        itens: [
          '42 aulas com textos, vocabulário e explicações',
          'Exercícios com correção que explica',
          'Áudios para praticar a pronúncia',
          'Revisões e progresso sempre à vista',
        ],
      },
    ],
    comprar: 'QUERO GARANTIR MEU ACESSO',
    escolher: 'QUERO ESCOLHER MEU PLANO',
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
      {
        p: 'Preciso saber alguma coisa de inglês?',
        r: 'Não. A Aula 01 começa pelos pronomes pessoais e assume conhecimento zero. Se você já sabe algo, avança mais rápido.',
      },
      {
        p: 'Como funciona a prática com IA do WSA Premium?',
        r: 'Toque em Praticar a aula e o ChatGPT abre na sua conta, já com o roteiro da conversa preparado. Ele orienta a prática com a aula do dia e as anteriores. A conversa acontece no seu ChatGPT; se necessário, o app também permite copiar o roteiro.',
      },
      {
        p: 'Quanto tempo por dia eu preciso?',
        r: 'Cada aula leva de 8 a 15 minutos. Não existe meta diária obrigatória nem punição por faltar.',
      },
      {
        p: 'E se eu parar por algumas semanas?',
        r: 'Você volta e o app mostra onde parou. Não há sequência a perder nem mensagem de culpa.',
      },
      {
        p: 'Em quanto tempo eu fico fluente?',
        r: 'Não prometemos prazo, porque o tempo varia de pessoa para pessoa. O que este módulo entrega é base: 42 aulas que levam do zero a se apresentar, falar de pessoas, lugares, rotina, horas e passado simples.',
      },
      {
        p: 'Vou ter que falar em voz alta com outras pessoas?',
        r: 'Não. Não há aula ao vivo nem turma. No WSA Premium, a prática de conversa acontece entre você e a IA que você escolher, na sua própria conta.',
      },
      {
        p: 'Funciona no celular?',
        r: 'Foi feito primeiro para o celular e funciona também no navegador do computador.',
      },
      {
        p: 'Qual a diferença entre o WSA Essencial e o WSA Premium?',
        r: 'Os dois têm as 42 aulas completas no app, com exercícios, áudios, revisões e progresso. O WSA Premium acrescenta as videoaulas com o professor e os roteiros prontos para conversar com a IA, para você usar numa conversa o que acabou de estudar.',
      },
    ],
  },

  fecho: {
    titulo: 'Comece pela primeira aula',
    corpo: 'Faça a Aula 01 e veja se este jeito de estudar combina com você.',
    cta: 'ASSISTIR PRIMEIRA AULA',
    assinatura: 'Small steps, big results.',
  },

  rodape: {
    tagline:
      'Curso de inglês do zero, em 42 aulas, com prática e progresso que você consegue perceber.',
    colunaPagina: 'Nesta página',
    colunaConta: 'Conta',
    colunaLegal: 'Legal',
    termos: 'Termos de uso',
    privacidade: 'Política de privacidade',
    criarConta: 'Criar conta',
    esqueci: 'Esqueci minha senha',
    contato: 'Contato',
    email: 'contato@wsaenglish.com.br',
    direitos: (ano: number) =>
      `© ${ano} WSA English. Todos os direitos reservados.`,
    feitoNo: 'Feito no Brasil.',
  },
} as const;
