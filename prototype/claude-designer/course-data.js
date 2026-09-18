// Conteúdo do curso — Aulas 01 a 03 (páginas fiéis às telas enviadas)
export const LESSONS = [
  {
    id: 1, code: "AULA 01", title: "Subject Pronouns", sub: "Pronomes pessoais do sujeito",
    time: "8 a 12 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 01" },
        { t: "title", en: "SUBJECT PRONOUNS", pt: "Pronomes pessoais do sujeito" },
        { t: "note", v: "cream", bar: true, bold: true, text: "QUEM FALA? COM QUEM FALAMOS?\nDE QUEM ESTAMOS FALANDO?" },
        { t: "image", id: "a1p1", ph: "Ilustração: grupo conversando na sala" },
        { t: "lead", text: "Em poucos minutos, você aprenderá a escolher entre:" },
        { t: "chips", items: [
          { t: "I", c: "navy" }, { t: "YOU", c: "teal" }, { t: "HE", c: "purple" }, { t: "SHE", c: "teal" },
          { t: "IT", c: "navy" }, { t: "WE", c: "purple" }, { t: "THEY", c: "teal" } ] },
        { t: "objective", v: "mint", title: "OBJETIVO DA AULA", text: "Substituir nomes de pessoas, grupos, animais e objetos pelo pronome correto." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "8 a 12 minutos" },
        { t: "note", v: "gray", bar: true, text: "Você não precisa decorar tudo agora.\nObserve os exemplos e avance um passo de cada vez." } ] },

      { blocks: [
        { t: "badge", label: "AULA 01 · CONTINUAÇÃO" },
        { t: "title", en: "I e YOU", pt: "Os dois primeiros pronomes da sua conversa." },
        { t: "note", v: "gray", center: true, bold: true, text: "Eu falo sobre mim ou falo com alguém?" },
        { t: "image", id: "a1p2", ph: "Ilustração: duas pessoas conversando" },
        { t: "pron", code: "I", pt: "EU", c: "navy", v: "gray", title: "Use I quando você fala sobre você.", body: "Pense: “eu”.", tag: "APONTE PARA SI: I" },
        { t: "pron", code: "YOU", pt: "VOCÊ", c: "teal", v: "mint", title: "Use YOU quando fala diretamente com outra pessoa.", body: "Também pode significar “vocês”." },
        { t: "mc", title: "TESTE RELÂMPAGO", v: "cream", questions: [
          { q: "“Eu quero falar de mim.”", options: ["I", "YOU"], answer: 0, explain: "Você fala sobre você mesmo → I." },
          { q: "“Estou falando com você.”", options: ["I", "YOU"], answer: 1, explain: "Você fala com a outra pessoa → YOU." } ] },
        { t: "note", v: "gray", bold: true, text: "Macete: I = eu. YOU = você ou vocês." } ] },

      { blocks: [
        { t: "badge", label: "AULA 01 · CONTINUAÇÃO" },
        { t: "title", en: "HE, SHE e IT", pt: "Para falar sobre alguém ou alguma coisa." },
        { t: "note", v: "gray", center: true, bold: true, text: "Você não fala com eles. Você fala sobre eles." },
        { t: "image", id: "a1p3", ph: "Ilustração: duas pessoas lendo e um cachorro" },
        { t: "pron", code: "HE", pt: "ELE", c: "navy", v: "gray", title: "Use para um homem ou menino.", body: "Exemplo: Rafael → HE" },
        { t: "pron", code: "SHE", pt: "ELA", c: "teal", v: "mint", title: "Use para uma mulher ou menina.", body: "Exemplo: Marina → SHE" },
        { t: "pron", code: "IT", pt: "ISSO", c: "purple", v: "lilac", title: "Use para coisas e animais em geral.", body: "Exemplo: a backpack → IT", foot: "Para um pet conhecido, HE ou SHE também é possível." },
        { t: "mc", title: "PENSE RAPIDAMENTE", v: "cream", questions: [
          { q: "Um homem →", options: ["HE", "SHE", "IT"], answer: 0 },
          { q: "Uma mulher →", options: ["HE", "SHE", "IT"], answer: 1 },
          { q: "Um objeto →", options: ["HE", "SHE", "IT"], answer: 2 } ] },
        { t: "note", v: "gray", bar: true, bold: true, text: "Não memorize pela pressa. Observe quem ou o que você quer substituir antes de escolher o pronome." } ] },

      { blocks: [
        { t: "badge", label: "AULA 01 · CONTINUAÇÃO" },
        { t: "title", en: "WE e THEY", pt: "Pronomes para falar de grupos." },
        { t: "note", v: "gray", center: true, bold: true, text: "Pergunta-chave: você faz parte desse grupo?" },
        { t: "image", id: "a1p4", ph: "Ilustração: selfie em grupo e reunião de estudo" },
        { t: "pron", code: "WE", pt: "NÓS", c: "teal", v: "mint", title: "Use quando você faz parte do grupo.", body: "Exemplo: eu + meus amigos → WE", tag: "VOCÊ ESTÁ INCLUÍDO" },
        { t: "pron", code: "THEY", pt: "ELES / ELAS", c: "purple", v: "lilac", title: "Use para um grupo do qual você não faz parte.", body: "Exemplo: Rafael + Marina → THEY" },
        { t: "mc", title: "ESCOLHA EM 2 PASSOS", v: "cream", questions: [
          { q: "Você está no grupo?", options: ["WE", "THEY"], answer: 0 },
          { q: "Você está fora do grupo?", options: ["WE", "THEY"], answer: 1 } ] },
        { t: "note", v: "gray", bold: true, text: "THEY também serve para mais de um animal ou objeto. Você verá isso com mais exemplos depois." },
        { t: "key", v: "gray", text: "WE inclui você. THEY deixa você de fora." } ] },

      { blocks: [
        { t: "badge", label: "AULA 01 · MAPA" },
        { t: "title", en: "Todos em um mapa", pt: "Os 7 subject pronouns em uma única tela." },
        { t: "note", v: "gray", center: true, bold: true, text: "Primeiro observe a referência. Depois escolha o pronome." },
        { t: "sec", text: "NA CONVERSA" },
        { t: "pron", code: "I", pt: "EU", c: "navy", v: "gray", title: "quem fala", body: "sobre si mesmo", small: true },
        { t: "pron", code: "YOU", pt: "VOCÊ(S)", c: "teal", v: "mint", title: "com quem", body: "se fala", small: true },
        { t: "sec", text: "UMA PESSOA, COISA OU ANIMAL" },
        { t: "grid", cols: 3, items: [
          { title: "HE", kicker: "ELE", body: "homem ou menino", c: "navy", v: "gray" },
          { title: "SHE", kicker: "ELA", body: "mulher ou menina", c: "teal", v: "mint" },
          { title: "IT", kicker: "ISSO", body: "coisa ou animal", c: "purple", v: "lilac" } ] },
        { t: "sec", text: "GRUPOS" },
        { t: "pron", code: "WE", pt: "NÓS", c: "teal", v: "mint", title: "grupo com", body: "você incluído", small: true },
        { t: "pron", code: "THEY", pt: "ELES / ELAS", c: "purple", v: "lilac", title: "grupo sem", body: "você incluído", small: true },
        { t: "match", title: "LIGUE O PRONOME AO SIGNIFICADO",
          left: ["I", "YOU", "HE", "SHE", "IT", "WE", "THEY"],
          right: ["eles / elas", "eu", "isso", "nós", "você(s)", "ele", "ela"],
          answer: [1, 4, 5, 6, 2, 3, 0] },
        { t: "note", v: "cream", bar: true, bold: true, text: "ROTEIRO DE ESCOLHA\n1. É quem fala? → I\n2. É com quem se fala? → YOU\n3. É alguém ou um grupo citado? → HE, SHE, IT, WE ou THEY" } ] },

      { blocks: [
        { t: "badge", label: "AULA 01 · PRATIQUE" },
        { t: "title", en: "Agora é sua vez", pt: "Escreva o subject pronoun correto." },
        { t: "note", v: "gray", bold: true, text: "TENTE PRIMEIRO SEM CONSULTAR O MAPA.\nAs respostas ficam salvas automaticamente." },
        { t: "fill", id: "a1e1", title: "EXERCÍCIO 1 · SUBSTITUA PELO PRONOME EM INGLÊS", items: [
          { pre: "1. Eu", answers: ["i"], v: "gray" },
          { pre: "2. Você", answers: ["you"], v: "mint" },
          { pre: "3. Lucas", answers: ["he"], v: "gray" },
          { pre: "4. Marina", answers: ["she"], v: "mint" },
          { pre: "5. A mochila", answers: ["it"], v: "lilac" },
          { pre: "6. Eu + meus amigos", answers: ["we"], v: "mint" },
          { pre: "7. Lucas + Marina", answers: ["they"], v: "lilac" } ] },
        { t: "fill", id: "a1e2", title: "DESAFIO DE GRUPO", v: "cream", sub: "Preste atenção: você está ou não está incluído?", items: [
          { pre: "A. Você + Ana + Paulo", answers: ["we"], v: "white" },
          { pre: "B. Ana + Paulo (sem você)", answers: ["they"], v: "white" } ] },
        { t: "key", v: "navy", text: "Errar faz parte do aprendizado. O importante é entender por que cada pronome foi escolhido." } ] },

      { blocks: [
        { t: "badge", label: "AULA 01 · FINAL" },
        { t: "title", en: "Confira e avance", pt: "Gabarito, revisão final e próxima prática." },
        { t: "note", v: "gray", center: true, bold: true, text: "Confira com calma. Entender vale mais do que decorar." },
        { t: "answers", v: "cream", title: "GABARITO · EXERCÍCIO 1", items: [
          { k: "1", a: "I", c: "navy" }, { k: "2", a: "YOU", c: "teal" }, { k: "3", a: "HE", c: "navy" },
          { k: "4", a: "SHE", c: "teal" }, { k: "5", a: "IT", c: "purple" }, { k: "6", a: "WE", c: "teal" },
          { k: "7", a: "THEY", c: "purple" }, { k: "A", a: "WE", c: "teal" }, { k: "B", a: "THEY", c: "purple" } ] },
        { t: "objective", v: "gray", title: "Terminou? Ótimo trabalho.", text: "Agora consolide o conteúdo com uma das experiências abaixo." },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "ASSISTA À VIDEOAULA", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO PARA O PLANO COMPLETO — INGLÊS EM AÇÃO", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE FALANDO COM A IA", body: "Escute, responda e receba sugestões para melhorar.", plan: "EXCLUSIVO PARA O PLANO PREMIUM — INGLÊS PRÁTICO COM IA", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Verb be — Affirmative" } ] }
    ]
  },

  {
    id: 2, code: "AULA 02", title: "Verb to be — Affirmative", sub: "Frases afirmativas com am, is e are.",
    time: "12 a 15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "title", en: "VERB TO BE", pt: "Frases afirmativas com am, is e are." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Quem você é? Onde você está?\nComo você se sente?" },
        { t: "image", id: "a2p1", ph: "Ilustração: três pessoas olhando um tablet" },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "I am Brazilian.", body: "Eu sou brasileiro(a).", v: "mint" },
          { title: "She is happy.", body: "Ela está feliz.", v: "lilac" },
          { title: "They are friends.", body: "Eles são amigos.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Criar frases afirmativas básicas com o verb to be." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12–15 min" },
        { t: "note", v: "gray", bold: true, text: "Siga com calma.\nVocê não precisa decorar tudo agora: primeiro, observe as combinações." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "O VERBO MUDA", pt: "O subject pronoun decide a forma de to be." },
        { t: "note", v: "gray", kicker: "A IDEIA-CHAVE", bold: true, text: "Primeiro vem quem é. Depois, a forma correta do verbo." },
        { t: "rule", v: "mint", c: "teal", kicker: "PARA FALAR DE MIM", from: "I", to: "am", ex: "I am ready.", tr: "Eu estou pronto(a)." },
        { t: "rule", v: "lilac", c: "purple", kicker: "PARA FALAR DE UMA PESSOA OU COISA", from: "he · she · it", to: "is", ex: "She is happy.", tr: "Ela está feliz." },
        { t: "rule", v: "cream", c: "yellow", kicker: "PARA FALAR DE VOCÊ OU DE MAIS DE UMA PESSOA", from: "you · we · they", to: "are", ex: "They are friends.", tr: "Eles são amigos." },
        { t: "dnd", id: "a2d1", title: "MONTE A FRASE ASSIM", sub: "Arraste ou toque nas peças para montar a frase.",
          slots: ["subject pronoun", "verb to be", "informação"],
          tokens: ["happy.", "She", "is"], answer: ["She", "is", "happy."] },
        { t: "note", v: "gray", bold: true, text: "Lembrete: os subject pronouns foram apresentados na Aula 01." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "FORMA COMPLETA OU CURTA?", pt: "As duas estão corretas. A forma curta é muito comum na fala." },
        { t: "note", v: "gray", kicker: "O QUE É UMA CONTRAÇÃO?", bold: true, text: "É uma maneira curta de unir o pronome + o verb to be." },
        { t: "table", head: ["FORMA COMPLETA", "FORMA CURTA"], rows: [
          { a: "I am", b: "I’m", v: "mint" },
          { a: "You are", note: "singular", b: "You’re", v: "lilac" },
          { a: "He is", b: "He’s", v: "cream" },
          { a: "She is", b: "She’s", v: "mint" },
          { a: "It is", b: "It’s", v: "lilac" },
          { a: "We are", b: "We’re", v: "cream" },
          { a: "You are", note: "plural", b: "You’re", v: "mint" },
          { a: "They are", b: "They’re", v: "lilac" } ] },
        { t: "objective", v: "navy", title: "ATENÇÃO AO APÓSTROFO", text: "Ele faz parte da forma curta. Escreva I’m — não Im. Escreva She’s — não Shes." },
        { t: "note", v: "gray", kicker: "PARA LEMBRAR", bold: true, text: "Em uma conversa, You’re, He’s e We’re soam mais naturais." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "O QUE VOCÊ PODE DIZER?", pt: "Depois de am, is ou are, acrescente uma informação." },
        { t: "note", v: "gray", kicker: "PENSE NO VERBO COMO UMA PONTE", bold: true, text: "Ele conecta uma pessoa ou coisa a uma informação sobre ela." },
        { t: "grid", cols: 2, items: [
          { n: "1", kicker: "NACIONALIDADE", title: "I am Brazilian.", body: "Eu sou brasileiro(a).", foot: "Quem você é / de onde você é.", v: "mint", c: "teal" },
          { n: "2", kicker: "PROFISSÃO", title: "He is a doctor.", body: "Ele é médico.", foot: "O que alguém faz.", v: "cream", c: "yellow" },
          { n: "3", kicker: "ESTADO", title: "She is happy.", body: "Ela está feliz.", foot: "Como alguém está.", v: "lilac", c: "purple" },
          { n: "4", kicker: "RELAÇÃO", title: "They are friends.", body: "Eles são amigos.", foot: "A ligação entre pessoas.", v: "mint", c: "teal" } ] },
        { t: "objective", v: "navy", tag: "LUGAR + IT", title: "The Eiffel Tower is in France.", text: "A Torre Eiffel fica na França.\n\nIt is in France.\nDepois de dizer “The Eiffel Tower”, podemos usar it para evitar repetir." },
        { t: "note", v: "gray", kicker: "NÃO PRECISA DECORAR TUDO AGORA", bold: true, text: "Observe a estrutura e os tipos de informação. A prática nas próximas páginas fará essas combinações ficarem naturais." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com am, is ou are." },
        { t: "objective", v: "navy", title: "COMO FAZER", text: "1. Observe o subject pronoun. 2. Escolha a forma correta." },
        { t: "note", v: "gray", bold: true, text: "LEMBRETE:   I → am      he / she / it → is      you / we / they → are" },
        { t: "fill", id: "a2e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. I", post: "Brazilian.", answers: ["am"], v: "mint" },
          { pre: "2. You (singular)", post: "from France.", answers: ["are"], v: "cream" },
          { pre: "3. He", post: "an engineer.", answers: ["is"], v: "lilac" },
          { pre: "4. She", post: "a singer.", answers: ["is"], v: "mint" },
          { pre: "5. It", post: "in France. (The Eiffel Tower)", answers: ["is"], v: "lilac" },
          { pre: "6. We", post: "friends.", answers: ["are"], v: "cream" },
          { pre: "7. You (plural)", post: "good students.", answers: ["are"], v: "mint" },
          { pre: "8. They", post: "happy.", answers: ["are"], v: "lilac" } ] },
        { t: "objective", v: "navy", title: "CHECKPOINT", text: "Antes de conferir: você olhou o pronome antes de escolher?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "CONFIRA E FALE", pt: "Gabarito da prática guiada" },
        { t: "objective", v: "navy", title: "COMO CONFERIR", text: "Veja o verbo em destaque. Depois, leia a frase inteira em voz alta." },
        { t: "pron", code: "I + am", pt: "PADRÃO 1", c: "teal", v: "mint", title: "I am Brazilian.", body: "I / am / Brazilian." },
        { t: "pron", code: "he · she · it + is", pt: "PADRÃO 2", c: "purple", v: "lilac", title: "He is an engineer. · She is a singer. · It is in France.", body: "it = The Eiffel Tower" },
        { t: "pron", code: "you · we · they + are", pt: "PADRÃO 3", c: "yellow", v: "cream", title: "You are from France. · We are friends. · You are good students. · They are happy.", body: "you = plural nesta frase" },
        { t: "objective", v: "navy", title: "MINIPRÁTICA ORAL", text: "Leia cada frase em 3 batidas:  She / is / a singer." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva 4 frases afirmativas sobre o seu mundo." },
        { t: "objective", v: "navy", title: "A ESTRUTURA NÃO MUDA", text: "subject pronoun + am / is / are + informação. Use suas ideias reais." },
        { t: "free", id: "a2f1", items: [
          { n: "1", kicker: "FALE SOBRE VOCÊ", prefix: "I am", ideas: "Ideias: Brazilian • happy • a student • an engineer", v: "mint", c: "teal" },
          { n: "2", kicker: "FALE SOBRE UMA PESSOA", prefix: "He is / She is", ideas: "Ideias: a teacher • my friend • happy • Brazilian", v: "lilac", c: "purple" },
          { n: "3", kicker: "FALE SOBRE UM GRUPO", prefix: "We are / They are", ideas: "Ideias: friends • students • happy • soccer fans", v: "cream", c: "yellow" },
          { n: "4", kicker: "FALE SOBRE UM LUGAR OU OBJETO", prefix: "The … is in", ideas: "Exemplo: The school is in Brazil.", v: "mint", c: "teal" } ] },
        { t: "objective", v: "navy", title: "DESAFIO FINAL", text: "Leia suas 4 frases em voz alta. Primeiro devagar. Depois, de forma natural." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE — AFFIRMATIVE" },
        { t: "title", en: "AULA CONCLUÍDA!", pt: "Você já pode formar frases afirmativas com o verb to be." },
        { t: "check", id: "a2c1", title: "EU CONSIGO...", items: [
          "Escolher am, is ou are conforme o sujeito.",
          "Reconhecer e usar formas curtas, como I’m e They’re.",
          "Escrever quatro frases afirmativas sobre o meu mundo." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 02", body: "Acompanhe os exemplos e revise o conteúdo no seu ritmo.", plan: "Disponível no Plano Completo — Inglês em Ação.", btn: "TOQUE PARA ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE POR VOZ", body: "Diga suas quatro frases e receba feedback de pronúncia e clareza.", plan: "Disponível no Plano Premium — Inglês Prático com IA.", btn: "TOQUE PARA PRATICAR COM A IA", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO PASSO", title: "Aula 03 — Verb to be: Negative", body: "Você aprenderá a dizer o que alguém não é, não está ou não tem." } ] }
    ]
  },

  {
    id: 3, code: "AULA 03", title: "Verb to be — Negative", sub: "Frases negativas com am not, isn’t e aren’t.",
    time: "15 a 18 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 03" },
        { t: "title", en: "VERB TO BE", pt: "Frases negativas com am not, isn’t e aren’t." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Nem toda informação é verdadeira.\nComo você a corrige em inglês?" },
        { t: "image", id: "a3p1", ph: "Ilustração: três pessoas estudando com tablet" },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "I’m not a teacher.", body: "Eu não sou professor(a).", v: "mint" },
          { title: "She isn’t a singer.", body: "Ela não é cantora.", v: "lilac" },
          { title: "They aren’t friends.", body: "Eles não são amigos.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Negar informações de forma correta usando o verb to be." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15–18 min" },
        { t: "note", v: "gray", bold: true, text: "Uma palavra faz a diferença.\nVocê vai aprender a inserir not no lugar certo e a falar com segurança." } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA DA FRASE NEGATIVA", pt: "Uma palavra muda o sentido: not." },
        { t: "note", v: "gray", bar: true, kicker: "REGRA CENTRAL", bold: true, text: "Para negar uma informação, coloque not logo depois de am, is ou are." },
        { t: "chips", items: [
          { t: "SUJEITO", c: "mint" }, { t: "AM / IS / ARE", c: "lilac" }, { t: "NOT", c: "cream" }, { t: "INFORMAÇÃO", c: "lilac" } ] },
        { t: "objective", v: "navy", title: "VEJA A TRANSFORMAÇÃO", text: "1. She is a dentist. → Ela é dentista.\n2. She is not a dentist. → Ela não é dentista." },
        { t: "objective", v: "mint", title: "GUARDE ISTO", text: "O not nunca vem antes do verb to be. Diga: She is not… • Não diga: She not is…" },
        { t: "mc", title: "MINI-CHECAGEM", v: "gray", questions: [
          { q: "Qual frase está correta?", options: ["They not are ready.", "They are not ready."], answer: 1, explain: "not vem sempre depois de am / is / are." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 03" },
        { t: "title", en: "O MAPA DAS FORMAS NEGATIVAS", pt: "Você só precisa reconhecer três grupos." },
        { t: "rule", v: "cream", c: "yellow", kicker: "1 · EU", from: "I", to: "I am not · I’m not", ex: "I’m not tired.", tr: "Eu não estou cansado(a)." },
        { t: "rule", v: "mint", c: "teal", kicker: "2 · ELE • ELA • ISTO/ISSO", from: "he · she · it", to: "is not · isn’t", ex: "She isn’t at home. · It isn’t new.", tr: "Ela não está em casa. · Isto não é novo." },
        { t: "rule", v: "lilac", c: "purple", kicker: "3 · VOCÊ • NÓS • ELES/ELAS", from: "you · we · they", to: "are not · aren’t", ex: "We aren’t ready. · They aren’t students.", tr: "Nós não estamos prontos. · Eles não são estudantes." },
        { t: "objective", v: "navy", title: "MACETE DE MEMÓRIA", text: "I → am not • he/she/it → isn’t • you/we/they → aren’t" },
        { t: "note", v: "gray", center: true, bold: true, text: "Na próxima página, você verá outras formas corretas de contrair." } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 04" },
        { t: "title", en: "TRÊS FORMAS, O MESMO SENTIDO", pt: "Com are, há mais de uma contração correta." },
        { t: "note", v: "gray", bar: true, bold: true, text: "AS TRÊS FRASES ABAIXO ESTÃO CORRETAS:\nTodas significam “Você não está atrasado(a).”" },
        { t: "grid", cols: 1, items: [
          { n: "1", kicker: "FORMA COMPLETA", title: "You are not late.", v: "mint", c: "teal" },
          { n: "2", kicker: "CONTRAÇÃO: ARE + NOT", title: "You aren’t late.", v: "lilac", c: "purple" },
          { n: "3", kicker: "CONTRAÇÃO: YOU + ARE", title: "You’re not late.", v: "cream", c: "yellow" } ] },
        { t: "objective", v: "navy", title: "DICA DE USO", text: "Na fala do dia a dia, as formas curtas são naturais. Você pode usar you aren’t ou you’re not." },
        { t: "grid", cols: 2, items: [
          { kicker: "WE", title: "We aren’t / We’re not", body: "Nós não estamos…", v: "gray" },
          { kicker: "THEY", title: "They aren’t / They’re not", body: "Eles/elas não estão…", v: "gray" } ] },
        { t: "objective", v: "red", title: "ATENÇÃO ESPECIAL COM I", text: "Use: I am not ou I’m not. No inglês-padrão deste curso, amn’t não existe." } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 05" },
        { t: "title", en: "ATENÇÃO, BRASILEIRO!", pt: "Um erro comum tem uma correção simples." },
        { t: "objective", v: "red", title: "NÃO USE don’t / doesn’t", text: "quando a frase tiver am, is ou are." },
        { t: "sec", text: "O VERB TO BE JÁ FAZ O TRABALHO", c: "purple" },
        { t: "chips", items: [ { t: "SUJEITO", c: "mint" }, { t: "AM / IS / ARE", c: "lilac" }, { t: "NOT", c: "cream" } ] },
        { t: "compare", items: [
          { wrong: "She doesn’t is a singer.", note: "Não misture doesn’t com is.", right: "She isn’t a singer.", rnote: "Ela não é cantora." },
          { wrong: "They don’t are ready.", right: "They aren’t ready." } ] },
        { t: "mc", title: "ESCOLHA A FRASE CORRETA", v: "gray", questions: [
          { q: "Ele não é meu irmão.", options: ["He doesn’t is my brother.", "He isn’t my brother."], answer: 1, explain: "Com o verb to be, use not — nunca don’t/doesn’t." },
          { q: "Nós não estamos em casa.", options: ["We aren’t at home.", "We don’t are at home."], answer: 0 } ] },
        { t: "key", v: "navy", text: "Viu am, is ou are? Use not — e não don’t/doesn’t." } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 06" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Transforme cada frase afirmativa em uma frase negativa." },
        { t: "note", v: "gray", bold: true, text: "SIGA ESTES 3 PASSOS\n1. Mantenha o sujeito. 2. Ache am / is / are. 3. Acrescente not." },
        { t: "fill", id: "a3e1", title: "ESCREVA A NOVA FRASE", wide: true, items: [
          { pre: "1. I am Brazilian.", note: "Use am not ou I’m not.", answers: ["i am not brazilian.", "i'm not brazilian.", "i’m not brazilian."], v: "mint" },
          { pre: "2. My mother is a teacher.", note: "Use is not ou isn’t.", answers: ["my mother is not a teacher.", "my mother isn't a teacher.", "my mother isn’t a teacher."], v: "lilac" },
          { pre: "3. Floki and Rex are my dogs.", note: "Use are not ou aren’t.", answers: ["floki and rex are not my dogs.", "floki and rex aren't my dogs.", "floki and rex aren’t my dogs."], v: "cream" },
          { pre: "4. You are from France.", note: "Use are not ou aren’t.", answers: ["you are not from france.", "you aren't from france.", "you aren’t from france.", "you're not from france.", "you’re not from france."], v: "gray" },
          { pre: "5. The Eiffel Tower is in France.", note: "Use is not ou isn’t.", answers: ["the eiffel tower is not in france.", "the eiffel tower isn't in france.", "the eiffel tower isn’t in france."], v: "lilac" },
          { pre: "6. We are friends.", note: "Use are not ou aren’t.", answers: ["we are not friends.", "we aren't friends.", "we aren’t friends.", "we're not friends.", "we’re not friends."], v: "mint" } ] },
        { t: "objective", v: "navy", title: "ANTES DE AVANÇAR", text: "Não troque o sujeito nem a informação. A única mudança necessária é inserir not no lugar certo." } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 07" },
        { t: "title", en: "CORRIJA A INFORMAÇÃO", pt: "Leia o perfil. Algumas frases não combinam com ele." },
        { t: "profile", name: "PERFIL: CAMILA", id: "a3camila", ph: "Foto: Camila no escritório", facts: ["She is Brazilian.", "She is a designer.", "She is in Recife."] },
        { t: "note", v: "gray", bold: true, text: "AS FRASES ABAIXO SÃO FALSAS. Escreva a correção em inglês usando is not ou isn’t." },
        { t: "fill", id: "a3e2", wide: true, items: [
          { pre: "1. Camila is from France.", answers: ["camila is not from france.", "camila isn't from france.", "camila isn’t from france."], v: "red" },
          { pre: "2. Camila is a teacher.", answers: ["camila is not a teacher.", "camila isn't a teacher.", "camila isn’t a teacher."], v: "red" },
          { pre: "3. Camila is in Paris.", answers: ["camila is not in paris.", "camila isn't in paris.", "camila isn’t in paris."], v: "red" } ] },
        { t: "objective", v: "navy", title: "LEMBRETE", text: "A correção começa com: Camila isn’t…" } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 08" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva quatro frases negativas simples e coerentes." },
        { t: "note", v: "gray", bold: true, text: "USE O MODELO\nsujeito + am / is / are + not + informação" },
        { t: "free", id: "a3f1", cols: 2, items: [
          { n: "1", kicker: "UMA PESSOA", prefix: "He isn’t… / She isn’t…", ideas: "Pense em alguém. O que essa pessoa não é ou não está?", v: "mint", c: "teal" },
          { n: "2", kicker: "UM GRUPO", prefix: "We aren’t… / They aren’t…", ideas: "Pense em amigos, família ou colegas.", v: "lilac", c: "purple" },
          { n: "3", kicker: "UM LUGAR", prefix: "It isn’t… / My city isn’t…", ideas: "Pense em uma cidade, casa ou escola.", v: "cream", c: "yellow" },
          { n: "4", kicker: "VOCÊ AGORA", prefix: "I am not… / I’m not…", ideas: "Pense em algo que você não é ou não está neste momento.", v: "gray", c: "navy" } ] },
        { t: "objective", v: "navy", title: "LEITURA ORAL AUTÔNOMA", text: "Leia suas quatro frases em voz alta. 1. Leia devagar. 2. Dê atenção a not. 3. Leia novamente com a forma curta.\nEx.: She is not → She isn’t" } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 09" },
        { t: "title", en: "VOCÊ JÁ SABE NEGAR EM INGLÊS.", pt: "Use este checklist antes de avançar." },
        { t: "check", id: "a3c1", title: "EU CONSIGO...", items: [
          "usar am not, isn’t e aren’t.",
          "colocar not depois de am, is ou are.",
          "criar e ler frases negativas simples.",
          "não usar don’t / doesn’t com verb to be." ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 5", text: "se ainda erra a posição de not ou usa don’t/doesn’t." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 03", body: "Aprofunde com o professor.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga três frases negativas. Peça que a IA confirme se você usou a forma correta.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 04 — Verb to be: Interrogative", body: "Você aprenderá a fazer perguntas com am, is e are." } ] }
    ]
  }
  ,{
    id: 4, code: "AULA 04", title: "Verb to be — Interrogative", sub: "Perguntas com am, is e are.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 04" },
        { t: "title", en: "VERB TO BE", pt: "Perguntas com am, is e are." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Você já sabe afirmar e negar.\nComo se pergunta em inglês?" },
        { t: "image", id: "a4p1", ph: "Ilustração: duas pessoas conversando e fazendo perguntas" },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A PERGUNTAR:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "Are you Brazilian?", body: "Você é brasileiro(a)?", v: "mint" },
          { title: "Is she a doctor?", body: "Ela é médica?", v: "lilac" },
          { title: "Are they friends?", body: "Eles são amigos?", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Fazer perguntas simples com o verb to be e responder de forma curta." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" },
        { t: "note", v: "gray", bold: true, text: "A mudança é só de ordem.\nO verbo passa na frente do sujeito." } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA DA PERGUNTA", pt: "Inverta: primeiro o verbo, depois o sujeito." },
        { t: "note", v: "gray", bar: true, kicker: "REGRA CENTRAL", bold: true, text: "Afirmação: You are ready.\nPergunta: Are you ready?" },
        { t: "chips", items: [
          { t: "AM / IS / ARE", c: "lilac" }, { t: "SUJEITO", c: "mint" }, { t: "INFORMAÇÃO", c: "cream" }, { t: "?", c: "yellow" } ] },
        { t: "rule", v: "cream", c: "yellow", kicker: "1 · EU", from: "I am", to: "Am I…?", ex: "Am I late?", tr: "Eu estou atrasado(a)?" },
        { t: "rule", v: "mint", c: "teal", kicker: "2 · ELE • ELA • ISTO/ISSO", from: "he · she · it is", to: "Is he…?", ex: "Is she a doctor?", tr: "Ela é médica?" },
        { t: "rule", v: "lilac", c: "purple", kicker: "3 · VOCÊ • NÓS • ELES/ELAS", from: "you · we · they are", to: "Are you…?", ex: "Are they friends?", tr: "Eles são amigos?" },
        { t: "dnd", id: "a4d1", title: "MONTE A PERGUNTA", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["verb to be", "sujeito", "informação"],
          tokens: ["a doctor?", "Is", "she"], answer: ["Is", "she", "a doctor?"] } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 03" },
        { t: "title", en: "RESPOSTAS CURTAS", pt: "Yes, I am. / No, I'm not." },
        { t: "note", v: "gray", bold: true, text: "Em inglês, ninguém responde só “yes” ou “no”.\nA resposta curta repete o verbo." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA CURTA"], rows: [
          { a: "Am I late?", b: "Yes, you are. / No, you aren’t.", v: "cream" },
          { a: "Are you Brazilian?", b: "Yes, I am. / No, I’m not.", v: "mint" },
          { a: "Is he a teacher?", b: "Yes, he is. / No, he isn’t.", v: "lilac" },
          { a: "Is she happy?", b: "Yes, she is. / No, she isn’t.", v: "mint" },
          { a: "Is it new?", b: "Yes, it is. / No, it isn’t.", v: "cream" },
          { a: "Are we ready?", b: "Yes, we are. / No, we aren’t.", v: "lilac" },
          { a: "Are they friends?", b: "Yes, they are. / No, they aren’t.", v: "mint" } ] },
        { t: "objective", v: "red", title: "ATENÇÃO À CONTRAÇÃO", text: "Na resposta afirmativa, não contraia. Diga: Yes, I am. — nunca Yes, I’m." },
        { t: "match", title: "LIGUE A PERGUNTA À RESPOSTA CURTA (AULA 04)",
          left: ["Are you tired?", "Is he your brother?", "Are they students?", "Is it expensive?"],
          right: ["Yes, they are.", "Yes, I am.", "No, it isn’t.", "Yes, he is."],
          answer: [1, 3, 0, 2] } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 04" },
        { t: "title", en: "ATENÇÃO, BRASILEIRO!", pt: "Um erro comum tem uma correção simples." },
        { t: "objective", v: "red", title: "NÃO USE do / does", text: "para perguntar com am, is ou are." },
        { t: "compare", items: [
          { wrong: "Do you are Brazilian?", note: "O verb to be já forma a pergunta.", right: "Are you Brazilian?", rnote: "Você é brasileiro(a)?" },
          { wrong: "Does she is a doctor?", right: "Is she a doctor?", rnote: "Ela é médica?" } ] },
        { t: "mc", title: "ESCOLHA A PERGUNTA CORRETA", v: "gray", questions: [
          { q: "Eles estão prontos?", options: ["Do they are ready?", "Are they ready?"], answer: 1, explain: "Com o verb to be, o próprio verbo vai para a frente." },
          { q: "Você é professor?", options: ["Are you a teacher?", "Does you a teacher?"], answer: 0 },
          { q: "Isto é novo?", options: ["Is it new?", "It is new?"], answer: 0, explain: "A ordem muda: verbo primeiro." } ] },
        { t: "key", v: "navy", text: "Viu am, is ou are? A pergunta começa pelo verbo." } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete a pergunta com Am, Is ou Are." },
        { t: "note", v: "gray", bold: true, text: "LEMBRETE:   I → Am      he / she / it → Is      you / we / they → Are" },
        { t: "fill", id: "a4e1", title: "COMPLETE AS PERGUNTAS", items: [
          { pre: "1.", post: "you from Brazil?", answers: ["are"], v: "mint" },
          { pre: "2.", post: "he a student?", answers: ["is"], v: "lilac" },
          { pre: "3.", post: "I late?", answers: ["am"], v: "cream" },
          { pre: "4.", post: "she your teacher?", answers: ["is"], v: "mint" },
          { pre: "5.", post: "they at home?", answers: ["are"], v: "lilac" },
          { pre: "6.", post: "it a good film?", answers: ["is"], v: "cream" },
          { pre: "7.", post: "we ready?", answers: ["are"], v: "mint" } ] },
        { t: "objective", v: "navy", title: "CHECKPOINT", text: "Leia cada pergunta em voz alta, subindo a entonação no final." } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva perguntas e responda de forma curta." },
        { t: "note", v: "gray", bold: true, text: "USE O MODELO\nAm / Is / Are + sujeito + informação + ?" },
        { t: "free", id: "a4f1", cols: 2, items: [
          { n: "1", kicker: "PERGUNTE SOBRE ALGUÉM", prefix: "Is he / Is she…?", ideas: "Ideias: a teacher • Brazilian • happy", v: "mint", c: "teal" },
          { n: "2", kicker: "PERGUNTE SOBRE UM GRUPO", prefix: "Are they…?", ideas: "Ideias: friends • students • ready", v: "lilac", c: "purple" },
          { n: "3", kicker: "PERGUNTE PARA ALGUÉM", prefix: "Are you…?", ideas: "Ideias: from Brazil • tired • a doctor", v: "cream", c: "yellow" },
          { n: "4", kicker: "RESPONDA A PERGUNTA 3", prefix: "Yes, I am. / No, I’m not.", ideas: "Escreva a resposta curta completa.", v: "gray", c: "navy" } ] },
        { t: "objective", v: "navy", title: "DESAFIO ORAL", text: "Leia sua pergunta e sua resposta em voz alta, como em uma conversa real." } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 07" },
        { t: "title", en: "VOCÊ JÁ SABE PERGUNTAR EM INGLÊS.", pt: "Use este checklist antes de avançar." },
        { t: "check", id: "a4c1", title: "EU CONSIGO...", items: [
          "começar a pergunta com Am, Is ou Are.",
          "usar respostas curtas: Yes, I am. / No, I’m not.",
          "não usar do / does com o verb to be.",
          "perguntar sobre pessoas, grupos e coisas." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 04", body: "Veja a entonação das perguntas com o professor.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça três perguntas e receba feedback de pronúncia.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 05 — Verb to be: Review", body: "As três formas juntas: afirmativa, negativa e interrogativa." } ] }
    ]
  },

  {
    id: 5, code: "AULA 05", title: "Verb to be — Review", sub: "Afirmativa, negativa e interrogativa juntas.",
    time: "16 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 05" },
        { t: "title", en: "VERB TO BE", pt: "Revisão: as três formas em uma só aula." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Você já sabe afirmar, negar e perguntar.\nAgora vamos juntar tudo." },
        { t: "image", id: "a5p1", ph: "Ilustração: aluno revisando anotações" },
        { t: "grid", cols: 3, items: [
          { kicker: "AFIRMATIVA", title: "She is a doctor.", body: "Ela é médica.", v: "mint" },
          { kicker: "NEGATIVA", title: "She isn’t a doctor.", body: "Ela não é médica.", v: "lilac" },
          { kicker: "INTERROGATIVA", title: "Is she a doctor?", body: "Ela é médica?", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Escolher a forma certa do verb to be em qualquer situação." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "16 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 02" },
        { t: "title", en: "O MAPA COMPLETO", pt: "Uma linha para cada sujeito." },
        { t: "table", head: ["SUJEITO", "FORMA DO VERBO"], rows: [
          { a: "I", b: "am · am not · Am I…?", v: "cream" },
          { a: "You", b: "are · aren’t · Are you…?", v: "mint" },
          { a: "He / She / It", b: "is · isn’t · Is he…?", v: "lilac" },
          { a: "We", b: "are · aren’t · Are we…?", v: "mint" },
          { a: "They", b: "are · aren’t · Are they…?", v: "lilac" } ] },
        { t: "objective", v: "mint", title: "TRÊS PERGUNTAS QUE RESOLVEM TUDO", text: "1. Qual é o sujeito? 2. É afirmação, negação ou pergunta? 3. Qual forma do verbo combina?" },
        { t: "match", title: "LIGUE A FRASE AO TIPO (AULA 05)",
          left: ["We are ready.", "We aren’t ready.", "Are we ready?", "I’m not late."],
          right: ["pergunta", "afirmativa", "negativa com I", "negativa"],
          answer: [1, 3, 0, 2] } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 03" },
        { t: "title", en: "TRANSFORME A FRASE", pt: "Da afirmativa para a negativa e a pergunta." },
        { t: "note", v: "gray", bar: true, bold: true, text: "FRASE-BASE\nThey are students. → Eles são estudantes." },
        { t: "grid", cols: 1, items: [
          { n: "1", kicker: "NEGATIVA", title: "They aren’t students.", body: "Acrescente not depois de are.", v: "lilac", c: "purple" },
          { n: "2", kicker: "PERGUNTA", title: "Are they students?", body: "Coloque are na frente do sujeito.", v: "cream", c: "yellow" },
          { n: "3", kicker: "RESPOSTA CURTA", title: "Yes, they are. / No, they aren’t.", body: "Repita o verbo na resposta.", v: "mint", c: "teal" } ] },
        { t: "dnd", id: "a5d1", title: "MONTE A PERGUNTA", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["verbo", "sujeito", "informação"],
          tokens: ["students?", "they", "Are"], answer: ["Are", "they", "students?"] } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com a forma correta." },
        { t: "fill", id: "a5e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. I", post: "a student. (afirmativa)", answers: ["am"], v: "mint" },
          { pre: "2. He", post: "my brother. (negativa)", answers: ["is not", "isn't", "isn’t"], v: "lilac" },
          { pre: "3.", post: "they Brazilian? (pergunta)", answers: ["are"], v: "cream" },
          { pre: "4. We", post: "at school. (afirmativa)", answers: ["are"], v: "mint" },
          { pre: "5. It", post: "expensive. (negativa)", answers: ["is not", "isn't", "isn’t"], v: "lilac" },
          { pre: "6.", post: "she your teacher? (pergunta)", answers: ["is"], v: "cream" } ] },
        { t: "objective", v: "navy", title: "DICA", text: "Leia o que está entre parênteses antes de escrever." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 05" },
        { t: "title", en: "ENCONTRE O ERRO", pt: "Cada frase tem um problema comum." },
        { t: "mc", title: "QUAL É A FORMA CORRETA?", v: "gray", questions: [
          { q: "Eu não estou cansado.", options: ["I amn’t tired.", "I’m not tired."], answer: 1, explain: "amn’t não existe no inglês-padrão." },
          { q: "Ela não é cantora.", options: ["She doesn’t is a singer.", "She isn’t a singer."], answer: 1, explain: "Com o verb to be, use not." },
          { q: "Vocês estão prontos?", options: ["Are you ready?", "Do you are ready?"], answer: 0 },
          { q: "Nós somos amigos.", options: ["We is friends.", "We are friends."], answer: 1, explain: "we → are." } ] },
        { t: "key", v: "navy", text: "Sujeito certo + forma certa = frase natural." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 06" },
        { t: "title", en: "FALE SOBRE VOCÊ", pt: "Três frases, três formas diferentes." },
        { t: "free", id: "a5f1", cols: 2, items: [
          { n: "1", kicker: "AFIRMATIVA", prefix: "I am…", ideas: "Algo verdadeiro sobre você agora.", v: "mint", c: "teal" },
          { n: "2", kicker: "NEGATIVA", prefix: "I’m not…", ideas: "Algo que você não é ou não está.", v: "lilac", c: "purple" },
          { n: "3", kicker: "PERGUNTA", prefix: "Are you…?", ideas: "Uma pergunta para um colega.", v: "cream", c: "yellow" },
          { n: "4", kicker: "RESPOSTA CURTA", prefix: "Yes, I am. / No, I’m not.", ideas: "Responda sua própria pergunta.", v: "gray", c: "navy" } ] },
        { t: "objective", v: "navy", title: "LEITURA ORAL", text: "Leia as quatro frases em sequência, como um pequeno diálogo." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 07" },
        { t: "title", en: "REVISÃO CONCLUÍDA!", pt: "Você domina o verb to be no presente." },
        { t: "check", id: "a5c1", title: "EU CONSIGO...", items: [
          "escolher am, is ou are pelo sujeito.",
          "negar com not e usar as contrações.",
          "perguntar invertendo verbo e sujeito.",
          "responder com Yes, I am. / No, I’m not." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 05", body: "Uma revisão guiada das três formas.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Converse usando as três formas em um diálogo curto.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 06 — Countries and Nationalities", body: "Diga de onde você é e qual é a sua nacionalidade." } ] }
    ]
  },

  {
    id: 6, code: "AULA 06", title: "Countries and Nationalities", sub: "Países e nacionalidades.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 06" },
        { t: "title", en: "COUNTRIES AND NATIONALITIES", pt: "De onde você é? Qual é a sua nacionalidade?" },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "País é o lugar. Nacionalidade é a pessoa.\nEm inglês, as duas palavras mudam." },
        { t: "image", id: "a6p1", ph: "Ilustração: mapa-múndi com pessoas de vários países" },
        { t: "grid", cols: 3, items: [
          { title: "I’m from Brazil.", body: "Eu sou do Brasil.", v: "mint" },
          { title: "I’m Brazilian.", body: "Eu sou brasileiro(a).", v: "lilac" },
          { title: "She’s from Japan.", body: "Ela é do Japão.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dizer seu país e sua nacionalidade, e perguntar isso a outra pessoa." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 02" },
        { t: "title", en: "FROM + PAÍS", pt: "Para dizer a origem, use from." },
        { t: "note", v: "gray", bar: true, kicker: "DUAS MANEIRAS DE DIZER O MESMO", bold: true, text: "I’m from Brazil.  =  I’m Brazilian." },
        { t: "rule", v: "mint", c: "teal", kicker: "ORIGEM (LUGAR)", from: "be + from", to: "I’m from Brazil.", ex: "Where are you from?", tr: "De onde você é?" },
        { t: "rule", v: "lilac", c: "purple", kicker: "NACIONALIDADE (PESSOA)", from: "be + nacionalidade", to: "I’m Brazilian.", ex: "He’s Italian.", tr: "Ele é italiano." },
        { t: "objective", v: "red", title: "ATENÇÃO", text: "Não diga: I’m from Brazilian. Diga: I’m from Brazil. ou I’m Brazilian." },
        { t: "mc", title: "ESCOLHA A FRASE CORRETA", v: "gray", questions: [
          { q: "Ela é do Japão.", options: ["She’s from Japanese.", "She’s from Japan."], answer: 1, explain: "Depois de from vem o país." },
          { q: "Ele é italiano.", options: ["He’s Italian.", "He’s from Italian."], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 03" },
        { t: "title", en: "OS TRÊS FINAIS MAIS COMUNS", pt: "-ian, -ish e -ese." },
        { t: "rule", v: "mint", c: "teal", kicker: "1 · TERMINAM EM -IAN", from: "Brazil · Italy", to: "Brazilian · Italian", ex: "Egypt → Egyptian", tr: "Também: Australia → Australian" },
        { t: "rule", v: "lilac", c: "purple", kicker: "2 · TERMINAM EM -ISH", from: "Spain · Poland", to: "Spanish · Polish", ex: "Ireland → Irish", tr: "Também: Turkey → Turkish" },
        { t: "rule", v: "cream", c: "yellow", kicker: "3 · TERMINAM EM -ESE", from: "Japan · China", to: "Japanese · Chinese", ex: "Portugal → Portuguese", tr: "Também: Vietnam → Vietnamese" },
        { t: "note", v: "gray", bold: true, text: "FORA DO PADRÃO\nFrance → French · Germany → German · Greece → Greek · The United States → American" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 04" },
        { t: "title", en: "PAÍS E NACIONALIDADE", pt: "Ligue cada país à sua nacionalidade." },
        { t: "match", title: "LIGUE PAÍS E NACIONALIDADE (AULA 06)",
          left: ["Brazil", "Japan", "Spain", "France", "The United States", "Italy"],
          right: ["American", "Brazilian", "French", "Italian", "Japanese", "Spanish"],
          answer: [1, 4, 5, 2, 0, 3] },
        { t: "objective", v: "navy", title: "LEMBRETE DE ESCRITA", text: "Países e nacionalidades sempre começam com letra maiúscula em inglês." } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com a nacionalidade correta." },
        { t: "fill", id: "a6e1", title: "ESCREVA A NACIONALIDADE EM INGLÊS", items: [
          { pre: "1. I’m from Brazil. I’m", answers: ["brazilian"], v: "mint" },
          { pre: "2. He’s from Japan. He’s", answers: ["japanese"], v: "lilac" },
          { pre: "3. She’s from Spain. She’s", answers: ["spanish"], v: "cream" },
          { pre: "4. They’re from Italy. They’re", answers: ["italian"], v: "mint" },
          { pre: "5. We’re from France. We’re", answers: ["french"], v: "lilac" },
          { pre: "6. You’re from Portugal. You’re", answers: ["portuguese"], v: "cream" } ] },
        { t: "note", v: "gray", bold: true, text: "Não se preocupe com a maiúscula no exercício: o importante é a palavra certa." } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Fale sobre a sua origem e a de outras pessoas." },
        { t: "free", id: "a6f1", cols: 2, items: [
          { n: "1", kicker: "VOCÊ", prefix: "I’m from…", ideas: "Escreva seu país em inglês.", v: "mint", c: "teal" },
          { n: "2", kicker: "SUA NACIONALIDADE", prefix: "I’m…", ideas: "Ex.: Brazilian", v: "lilac", c: "purple" },
          { n: "3", kicker: "UMA PESSOA FAMOSA", prefix: "He’s / She’s from…", ideas: "Pense em alguém que você admira.", v: "cream", c: "yellow" },
          { n: "4", kicker: "UMA PERGUNTA", prefix: "Where are you from?", ideas: "Escreva a resposta que você daria.", v: "gray", c: "navy" } ] },
        { t: "objective", v: "navy", title: "DIÁLOGO DE 4 LINHAS", text: "— Where are you from?\n— I’m from Brazil. And you?\n— I’m from Italy.\n— Nice to meet you!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 07" },
        { t: "title", en: "MÓDULO 1 CONCLUÍDO!", pt: "Você terminou o primeiro módulo da trilha." },
        { t: "check", id: "a6c1", title: "EU CONSIGO...", items: [
          "dizer de onde eu sou com from + país.",
          "dizer minha nacionalidade.",
          "reconhecer os finais -ian, -ish e -ese.",
          "perguntar: Where are you from?" ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 06", body: "Pronúncia de países e nacionalidades.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça o diálogo de apresentação com a IA.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 2 — Vocabulário essencial", body: "Família, números, dias, meses, cores e muito mais." } ] }
    ]
  }
  ,{
    id: 7, code: "AULA 07", title: "Family", sub: "Fale sobre a sua família.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 07" },
        { t: "title", en: "FAMILY", pt: "As palavras que você usa todos os dias." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Quem mora com você?\nQuem faz parte da sua família?" },
        { t: "image", id: "a7p1", ph: "Ilustração: família reunida em casa" },
        { t: "grid", cols: 3, items: [
          { title: "This is my mother.", body: "Esta é minha mãe.", v: "mint" },
          { title: "He is my brother.", body: "Ele é meu irmão.", v: "lilac" },
          { title: "They are my parents.", body: "Eles são meus pais.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Apresentar os membros da sua família em inglês." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 02" },
        { t: "title", en: "AS PALAVRAS DA FAMÍLIA", pt: "Comece pelas mais usadas." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "mother / mom", b: "mãe", v: "mint" },
          { a: "father / dad", b: "pai", v: "lilac" },
          { a: "sister", b: "irmã", v: "cream" },
          { a: "brother", b: "irmão", v: "mint" },
          { a: "son", b: "filho", v: "lilac" },
          { a: "daughter", b: "filha", v: "cream" },
          { a: "husband / wife", b: "marido / esposa", v: "mint" },
          { a: "grandmother / grandfather", b: "avó / avô", v: "lilac" } ] },
        { t: "note", v: "gray", bold: true, text: "PALAVRAS QUE JUNTAM DOIS\nparents = pai e mãe · children = filhos · siblings = irmãos" } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 03" },
        { t: "title", en: "DE QUEM É?", pt: "Use my, your, his, her — e o ’s de posse." },
        { t: "rule", v: "mint", c: "teal", kicker: "1 · POSSE COM ADJETIVO", from: "my · your · his · her", to: "my sister", ex: "This is my sister.", tr: "Esta é minha irmã." },
        { t: "rule", v: "lilac", c: "purple", kicker: "2 · POSSE COM ’S", from: "nome + ’s", to: "Ana’s brother", ex: "Ana’s brother is a doctor.", tr: "O irmão da Ana é médico." },
        { t: "objective", v: "red", title: "CUIDADO", text: "Em inglês, a ordem é invertida: “o irmão da Ana” vira Ana’s brother." },
        { t: "dnd", id: "a7d1", title: "MONTE A FRASE", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["posse", "parente", "resto"],
          tokens: ["is a teacher.", "Ana’s", "mother"], answer: ["Ana’s", "mother", "is a teacher."] } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 04" },
        { t: "title", en: "LIGUE AS PALAVRAS", pt: "Português e inglês lado a lado." },
        { t: "match", title: "LIGUE O PARENTE (AULA 07)",
          left: ["mother", "brother", "daughter", "grandfather", "wife", "parents"],
          right: ["avô", "esposa", "filha", "irmão", "mãe", "pais"],
          answer: [4, 3, 2, 0, 1, 5] },
        { t: "mc", title: "ESCOLHA A OPÇÃO CORRETA", v: "gray", questions: [
          { q: "O pai da Marina", options: ["Marina’s father", "father’s Marina"], answer: 0, explain: "O dono vem primeiro: Marina’s father." },
          { q: "Meus irmãos (irmão e irmã)", options: ["my siblings", "my parents"], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com a palavra certa." },
        { t: "fill", id: "a7e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. Minha mãe → my", answers: ["mother", "mom"], v: "mint" },
          { pre: "2. Meu pai → my", answers: ["father", "dad"], v: "lilac" },
          { pre: "3. Minha irmã → my", answers: ["sister"], v: "cream" },
          { pre: "4. Meu avô → my", answers: ["grandfather", "grandpa"], v: "mint" },
          { pre: "5. Minha filha → my", answers: ["daughter"], v: "lilac" },
          { pre: "6. Meus pais → my", answers: ["parents"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Apresente três pessoas da sua família." },
        { t: "free", id: "a7f1", cols: 2, items: [
          { n: "1", kicker: "UMA PESSOA", prefix: "This is my…", ideas: "Ex.: This is my mother.", v: "mint", c: "teal" },
          { n: "2", kicker: "O QUE ELA FAZ", prefix: "She is / He is…", ideas: "Ex.: She is a teacher.", v: "lilac", c: "purple" },
          { n: "3", kicker: "USANDO ’S", prefix: "… ’s …", ideas: "Ex.: My father’s name is Paulo.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a7c1", title: "EU CONSIGO...", items: [
          "nomear os parentes mais comuns em inglês.",
          "usar my, your, his e her.",
          "usar o ’s para indicar posse." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 07", body: "Pronúncia das palavras da família.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Apresente sua família em voz alta.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 08 — Numbers 1–100" } ] }
    ]
  },

  {
    id: 8, code: "AULA 08", title: "Numbers 1–100", sub: "Contar, dizer idade e preços.",
    time: "15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 08" },
        { t: "title", en: "NUMBERS 1–100", pt: "Os números que você mais usa." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Telefone, idade, preço, horário.\nTudo começa nos números." },
        { t: "image", id: "a8p1", ph: "Ilustração: números e pessoas contando" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Ler e escrever os números de 1 a 100 em inglês." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 02" },
        { t: "title", en: "DE 1 A 20", pt: "A base de tudo." },
        { t: "chips", title: "1 A 10", items: [
          { t: "1 one", c: "mint" }, { t: "2 two", c: "lilac" }, { t: "3 three", c: "cream" }, { t: "4 four", c: "mint" }, { t: "5 five", c: "lilac" },
          { t: "6 six", c: "cream" }, { t: "7 seven", c: "mint" }, { t: "8 eight", c: "lilac" }, { t: "9 nine", c: "cream" }, { t: "10 ten", c: "mint" } ] },
        { t: "chips", title: "11 A 20", items: [
          { t: "11 eleven", c: "lilac" }, { t: "12 twelve", c: "cream" }, { t: "13 thirteen", c: "mint" }, { t: "14 fourteen", c: "lilac" }, { t: "15 fifteen", c: "cream" },
          { t: "16 sixteen", c: "mint" }, { t: "17 seventeen", c: "lilac" }, { t: "18 eighteen", c: "cream" }, { t: "19 nineteen", c: "mint" }, { t: "20 twenty", c: "lilac" } ] },
        { t: "note", v: "gray", bold: true, text: "ATENÇÃO À ESCRITA\nthree → thirteen · five → fifteen · eight → eighteen (um só t)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 03" },
        { t: "title", en: "AS DEZENAS", pt: "De 20 a 100, tudo fica simples." },
        { t: "table", head: ["NÚMERO", "INGLÊS"], rows: [
          { a: "20 / 30", b: "twenty / thirty", v: "mint" },
          { a: "40 / 50", b: "forty / fifty", v: "lilac" },
          { a: "60 / 70", b: "sixty / seventy", v: "cream" },
          { a: "80 / 90", b: "eighty / ninety", v: "mint" },
          { a: "100", b: "one hundred", v: "lilac" } ] },
        { t: "rule", v: "cream", c: "yellow", kicker: "NÚMEROS COMPOSTOS", from: "20 + 1", to: "twenty-one", ex: "42 → forty-two · 87 → eighty-seven", tr: "Sempre com hífen." },
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Escreva forty (40) — não fourty." } ] },

      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 04" },
        { t: "title", en: "ONDE USAMOS", pt: "Idade, telefone e preço." },
        { t: "grid", cols: 3, items: [
          { kicker: "IDADE", title: "I’m thirty years old.", body: "Eu tenho 30 anos.", v: "mint" },
          { kicker: "TELEFONE", title: "nine, eight, seven…", body: "Número dito dígito a dígito.", v: "lilac" },
          { kicker: "PREÇO", title: "It’s fifteen dollars.", body: "Custa 15 dólares.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "ATENÇÃO À IDADE", text: "Em inglês, você não “tem” anos: você “é”. I am 30 years old." },
        { t: "mc", title: "ESCOLHA A FORMA CORRETA", v: "gray", questions: [
          { q: "Eu tenho 25 anos.", options: ["I have 25 years.", "I’m 25 years old."], answer: 1, explain: "Com idade, use o verb to be." },
          { q: "40 em inglês", options: ["fourty", "forty"], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva o número por extenso." },
        { t: "fill", id: "a8e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. 7 →", answers: ["seven"], v: "mint" },
          { pre: "2. 13 →", answers: ["thirteen"], v: "lilac" },
          { pre: "3. 21 →", answers: ["twenty-one", "twenty one"], v: "cream" },
          { pre: "4. 40 →", answers: ["forty"], v: "mint" },
          { pre: "5. 68 →", answers: ["sixty-eight", "sixty eight"], v: "lilac" },
          { pre: "6. 100 →", answers: ["one hundred", "a hundred", "hundred"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Use números reais da sua vida." },
        { t: "free", id: "a8f1", cols: 2, items: [
          { n: "1", kicker: "SUA IDADE", prefix: "I’m … years old.", ideas: "Escreva o número por extenso.", v: "mint", c: "teal" },
          { n: "2", kicker: "UM NÚMERO IMPORTANTE", prefix: "My lucky number is…", ideas: "Ex.: seventeen", v: "lilac", c: "purple" },
          { n: "3", kicker: "UM PREÇO", prefix: "It’s … reais.", ideas: "Ex.: It’s thirty reais.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a8c1", title: "EU CONSIGO...", items: [
          "contar de 1 a 20 sem consultar.",
          "formar números compostos com hífen.",
          "dizer minha idade com o verb to be." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 08", body: "Pronúncia dos números e dos pares difíceis (13 × 30).", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga números aleatórios e confira sua pronúncia.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 09 — Days and Months" } ] }
    ]
  },

  {
    id: 9, code: "AULA 09", title: "Days and Months", sub: "Dias da semana, meses e datas.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 09" },
        { t: "title", en: "DAYS AND MONTHS", pt: "Marque encontros e fale de datas." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Em inglês, dias e meses sempre começam\ncom letra maiúscula." },
        { t: "image", id: "a9p1", ph: "Ilustração: calendário e agenda" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dizer dias da semana, meses e datas simples." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 09", page: "PÁGINA 02" },
        { t: "title", en: "DAYS OF THE WEEK", pt: "Os sete dias." },
        { t: "chips", items: [
          { t: "Monday", c: "mint" }, { t: "Tuesday", c: "lilac" }, { t: "Wednesday", c: "cream" }, { t: "Thursday", c: "mint" },
          { t: "Friday", c: "lilac" }, { t: "Saturday", c: "cream" }, { t: "Sunday", c: "mint" } ] },
        { t: "rule", v: "mint", c: "teal", kicker: "PREPOSIÇÃO CERTA", from: "dia da semana", to: "on Monday", ex: "I study on Monday.", tr: "Eu estudo na segunda-feira." },
        { t: "note", v: "gray", bold: true, text: "weekend = fim de semana (Saturday + Sunday)\nweekdays = dias úteis" } ] },

      { blocks: [
        { t: "badge", label: "AULA 09", page: "PÁGINA 03" },
        { t: "title", en: "MONTHS OF THE YEAR", pt: "Os doze meses." },
        { t: "chips", items: [
          { t: "January", c: "mint" }, { t: "February", c: "lilac" }, { t: "March", c: "cream" }, { t: "April", c: "mint" },
          { t: "May", c: "lilac" }, { t: "June", c: "cream" }, { t: "July", c: "mint" }, { t: "August", c: "lilac" },
          { t: "September", c: "cream" }, { t: "October", c: "mint" }, { t: "November", c: "lilac" }, { t: "December", c: "cream" } ] },
        { t: "rule", v: "lilac", c: "purple", kicker: "PREPOSIÇÃO CERTA", from: "mês", to: "in July", ex: "My birthday is in July.", tr: "Meu aniversário é em julho." },
        { t: "rule", v: "cream", c: "yellow", kicker: "DATA COMPLETA", from: "dia exato", to: "on July 5th", ex: "The class is on May 3rd.", tr: "Com dia exato, use on." } ] },

      { blocks: [
        { t: "badge", label: "AULA 09", page: "PÁGINA 04" },
        { t: "title", en: "LIGUE E ESCOLHA", pt: "Fixe o vocabulário." },
        { t: "match", title: "LIGUE O DIA OU MÊS (AULA 09)",
          left: ["Monday", "Wednesday", "Saturday", "January", "July", "December"],
          right: ["dezembro", "janeiro", "julho", "quarta-feira", "sábado", "segunda-feira"],
          answer: [5, 3, 4, 1, 2, 0] },
        { t: "mc", title: "ESCOLHA A PREPOSIÇÃO", v: "gray", questions: [
          { q: "___ Monday", options: ["in", "on"], answer: 1, explain: "Dias da semana usam on." },
          { q: "___ March", options: ["in", "on"], answer: 0, explain: "Meses usam in." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 09", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com in ou on e a palavra certa." },
        { t: "fill", id: "a9e1", title: "COMPLETE AS FRASES", wide: true, items: [
          { pre: "1. Meu aniversário é em maio.", note: "Use: My birthday is…", answers: ["my birthday is in may.", "my birthday is in may"], v: "mint" },
          { pre: "2. Eu estudo no sábado.", note: "Use: I study…", answers: ["i study on saturday.", "i study on saturday"], v: "lilac" },
          { pre: "3. A aula é em setembro.", note: "Use: The class is…", answers: ["the class is in september.", "the class is in september"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 09", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Fale da sua semana e do seu ano." },
        { t: "free", id: "a9f1", cols: 2, items: [
          { n: "1", kicker: "SEU ANIVERSÁRIO", prefix: "My birthday is in…", ideas: "Escreva o mês em inglês.", v: "mint", c: "teal" },
          { n: "2", kicker: "SEU DIA FAVORITO", prefix: "My favorite day is…", ideas: "Ex.: Friday", v: "lilac", c: "purple" },
          { n: "3", kicker: "SUA ROTINA", prefix: "I study on…", ideas: "Ex.: I study on Monday and Wednesday.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a9c1", title: "EU CONSIGO...", items: [
          "dizer os sete dias da semana.",
          "dizer os doze meses.",
          "usar on para dias e in para meses.",
          "escrever dias e meses com maiúscula." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 09", body: "Pronúncia dos dias e meses.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Marque um encontro fictício em inglês.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 10 — Colors and Shapes" } ] }
    ]
  },

  {
    id: 10, code: "AULA 10", title: "Colors and Shapes", sub: "Cores, formas e como descrever coisas.",
    time: "12 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 10" },
        { t: "title", en: "COLORS AND SHAPES", pt: "Descreva o que você vê." },
        { t: "image", id: "a10p1", ph: "Ilustração: objetos coloridos e formas geométricas" },
        { t: "grid", cols: 3, items: [
          { title: "It’s a red car.", body: "É um carro vermelho.", v: "mint" },
          { title: "The circle is blue.", body: "O círculo é azul.", v: "lilac" },
          { title: "They are green.", body: "Eles são verdes.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Nomear cores e formas e descrever objetos simples." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 10", page: "PÁGINA 02" },
        { t: "title", en: "COLORS", pt: "As cores mais usadas." },
        { t: "chips", items: [
          { t: "red", c: "cream" }, { t: "blue", c: "mint" }, { t: "green", c: "lilac" }, { t: "yellow", c: "cream" },
          { t: "black", c: "navy" }, { t: "white", c: "mint" }, { t: "orange", c: "lilac" }, { t: "purple", c: "cream" },
          { t: "pink", c: "mint" }, { t: "brown", c: "lilac" }, { t: "gray", c: "cream" } ] },
        { t: "rule", v: "mint", c: "teal", kicker: "A COR VEM ANTES DO OBJETO", from: "um carro vermelho", to: "a red car", ex: "a blue house · a white shirt", tr: "Em inglês, o adjetivo vem primeiro." },
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Não diga a car red. Diga a red car." } ] },

      { blocks: [
        { t: "badge", label: "AULA 10", page: "PÁGINA 03" },
        { t: "title", en: "SHAPES", pt: "As formas básicas." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "circle", b: "círculo", v: "mint" },
          { a: "square", b: "quadrado", v: "lilac" },
          { a: "triangle", b: "triângulo", v: "cream" },
          { a: "rectangle", b: "retângulo", v: "mint" },
          { a: "star", b: "estrela", v: "lilac" },
          { a: "heart", b: "coração", v: "cream" } ] },
        { t: "dnd", id: "a10d1", title: "MONTE A DESCRIÇÃO", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["artigo", "cor", "forma"],
          tokens: ["circle", "a", "yellow"], answer: ["a", "yellow", "circle"] } ] },

      { blocks: [
        { t: "badge", label: "AULA 10", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva a cor ou a forma em inglês." },
        { t: "fill", id: "a10e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. vermelho →", answers: ["red"], v: "cream" },
          { pre: "2. azul →", answers: ["blue"], v: "mint" },
          { pre: "3. preto →", answers: ["black"], v: "lilac" },
          { pre: "4. quadrado →", answers: ["square"], v: "cream" },
          { pre: "5. triângulo →", answers: ["triangle"], v: "mint" },
          { pre: "6. coração →", answers: ["heart"], v: "lilac" } ] },
        { t: "mc", title: "ORDEM CORRETA", v: "gray", questions: [
          { q: "Uma casa branca", options: ["a house white", "a white house"], answer: 1 },
          { q: "Três estrelas amarelas", options: ["three yellow stars", "three stars yellow"], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 10", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Descreva três coisas ao seu redor." },
        { t: "free", id: "a10f1", cols: 2, items: [
          { n: "1", kicker: "UM OBJETO", prefix: "It’s a … …", ideas: "Ex.: It’s a black phone.", v: "mint", c: "teal" },
          { n: "2", kicker: "SUA COR FAVORITA", prefix: "My favorite color is…", ideas: "Ex.: My favorite color is green.", v: "lilac", c: "purple" },
          { n: "3", kicker: "UMA FORMA", prefix: "The … is …", ideas: "Ex.: The table is a rectangle.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a10c1", title: "EU CONSIGO...", items: [
          "nomear as cores mais comuns.",
          "nomear as formas básicas.",
          "colocar a cor antes do substantivo." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 10", body: "Cores, formas e descrições no dia a dia.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva o que está na sua mesa agora.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 11 — Articles a / an / the" } ] }
    ]
  },

  {
    id: 11, code: "AULA 11", title: "Articles a / an / the", sub: "Quando usar a, an e the.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 11" },
        { t: "title", en: "A / AN / THE", pt: "Três palavrinhas que mudam tudo." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "a e an = um / uma (algo indefinido)\nthe = o / a (algo específico)" },
        { t: "image", id: "a11p1", ph: "Ilustração: uma maçã e a maçã específica" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Escolher entre a, an e the com segurança." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 02" },
        { t: "title", en: "A OU AN?", pt: "Depende do som, não da letra." },
        { t: "rule", v: "mint", c: "teal", kicker: "SOM DE CONSOANTE", from: "a", to: "a book · a car", ex: "a university", tr: "Soa “iuniversity” → som de consoante." },
        { t: "rule", v: "lilac", c: "purple", kicker: "SOM DE VOGAL", from: "an", to: "an apple · an engineer", ex: "an hour", tr: "O h é mudo → som de vogal." },
        { t: "objective", v: "red", title: "A REGRA REAL", text: "Ouça o som da primeira letra falada, não a escrita." },
        { t: "mc", title: "A OU AN?", v: "gray", questions: [
          { q: "___ orange", options: ["a", "an"], answer: 1 },
          { q: "___ teacher", options: ["a", "an"], answer: 0 },
          { q: "___ hour", options: ["a", "an"], answer: 1, explain: "O h é mudo: soa “our”." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 03" },
        { t: "title", en: "QUANDO USAR THE", pt: "Quando a pessoa sabe de qual você fala." },
        { t: "grid", cols: 1, items: [
          { n: "1", kicker: "ALGO JÁ CITADO", title: "I have a dog. The dog is small.", body: "Na segunda vez, use the.", v: "mint", c: "teal" },
          { n: "2", kicker: "ALGO ÚNICO", title: "The sun · The Eiffel Tower", body: "Só existe um.", v: "lilac", c: "purple" },
          { n: "3", kicker: "ALGO ESPECÍFICO", title: "The book on the table.", body: "Aquele livro, não qualquer um.", v: "cream", c: "yellow" } ] },
        { t: "note", v: "gray", bold: true, text: "SEM ARTIGO\nCom ideias gerais no plural: I like dogs. (não: I like the dogs.)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com a, an ou the." },
        { t: "fill", id: "a11e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. She is", post: "engineer.", answers: ["an"], v: "mint" },
          { pre: "2. I have", post: "car.", answers: ["a"], v: "lilac" },
          { pre: "3.", post: "sun is hot.", answers: ["the"], v: "cream" },
          { pre: "4. He is", post: "teacher.", answers: ["a"], v: "mint" },
          { pre: "5. I eat", post: "apple every day.", answers: ["an"], v: "lilac" },
          { pre: "6.", post: "book on the table is mine.", answers: ["the"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva três frases com artigos." },
        { t: "free", id: "a11f1", cols: 2, items: [
          { n: "1", kicker: "COM A", prefix: "I have a…", ideas: "Ex.: I have a bike.", v: "mint", c: "teal" },
          { n: "2", kicker: "COM AN", prefix: "I have an…", ideas: "Ex.: I have an old phone.", v: "lilac", c: "purple" },
          { n: "3", kicker: "COM THE", prefix: "The … is …", ideas: "Ex.: The house is big.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a11c1", title: "EU CONSIGO...", items: [
          "usar a antes de som de consoante.",
          "usar an antes de som de vogal.",
          "usar the para algo específico ou único." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 11", body: "Exemplos reais de a, an e the.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva objetos usando artigos.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 12 — Plural Nouns" } ] }
    ]
  },

  {
    id: 12, code: "AULA 12", title: "Plural Nouns", sub: "Como formar o plural em inglês.",
    time: "15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 12" },
        { t: "title", en: "PLURAL NOUNS", pt: "De um para muitos." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Na maioria das vezes, basta um -s.\nMas há grupos que mudam mais." },
        { t: "image", id: "a12p1", ph: "Ilustração: um objeto e vários objetos" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Formar o plural das palavras mais comuns." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 12", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA GERAL", pt: "Acrescente -s." },
        { t: "rule", v: "mint", c: "teal", kicker: "1 · REGRA GERAL", from: "book", to: "books", ex: "car → cars · house → houses", tr: "A maioria das palavras." },
        { t: "rule", v: "lilac", c: "purple", kicker: "2 · TERMINA EM S, X, CH, SH, O", from: "bus · box", to: "buses · boxes", ex: "watch → watches · potato → potatoes", tr: "Acrescente -es." },
        { t: "rule", v: "cream", c: "yellow", kicker: "3 · CONSOANTE + Y", from: "city", to: "cities", ex: "baby → babies", tr: "Troque y por -ies." },
        { t: "note", v: "gray", bold: true, text: "ATENÇÃO\nVogal + y não muda: boy → boys · day → days" } ] },

      { blocks: [
        { t: "badge", label: "AULA 12", page: "PÁGINA 03" },
        { t: "title", en: "OS IRREGULARES", pt: "Estes você aprende de cor." },
        { t: "table", head: ["SINGULAR", "PLURAL"], rows: [
          { a: "man", b: "men", v: "mint" },
          { a: "woman", b: "women", v: "lilac" },
          { a: "child", b: "children", v: "cream" },
          { a: "person", b: "people", v: "mint" },
          { a: "foot", b: "feet", v: "lilac" },
          { a: "tooth", b: "teeth", v: "cream" },
          { a: "life", b: "lives", v: "mint" } ] },
        { t: "objective", v: "red", title: "NÃO ACRESCENTE -S NOS IRREGULARES", text: "Diga children — nunca childrens. Diga people — nunca peoples." } ] },

      { blocks: [
        { t: "badge", label: "AULA 12", page: "PÁGINA 04" },
        { t: "title", en: "LIGUE E ESCOLHA", pt: "Fixe as três regras." },
        { t: "match", title: "LIGUE O PLURAL (AULA 12)",
          left: ["city", "box", "child", "man", "book", "life"],
          right: ["books", "boxes", "children", "cities", "lives", "men"],
          answer: [3, 1, 2, 5, 0, 4] },
        { t: "mc", title: "QUAL ESTÁ CORRETO?", v: "gray", questions: [
          { q: "Plural de baby", options: ["babys", "babies"], answer: 1, explain: "Consoante + y → -ies." },
          { q: "Plural de person", options: ["persons", "people"], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 12", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva o plural." },
        { t: "fill", id: "a12e1", title: "ESCREVA O PLURAL", items: [
          { pre: "1. car →", answers: ["cars"], v: "mint" },
          { pre: "2. watch →", answers: ["watches"], v: "lilac" },
          { pre: "3. country →", answers: ["countries"], v: "cream" },
          { pre: "4. woman →", answers: ["women"], v: "mint" },
          { pre: "5. foot →", answers: ["feet"], v: "lilac" },
          { pre: "6. day →", answers: ["days"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 12", page: "PÁGINA 06" },
        { t: "title", en: "MÓDULO 2 CONCLUÍDO!", pt: "Você terminou o segundo módulo." },
        { t: "free", id: "a12f1", cols: 2, items: [
          { n: "1", kicker: "PLURAL SIMPLES", prefix: "I have two…", ideas: "Ex.: I have two brothers.", v: "mint", c: "teal" },
          { n: "2", kicker: "PLURAL IRREGULAR", prefix: "There are many…", ideas: "Ex.: There are many people here.", v: "lilac", c: "purple" } ] },
        { t: "check", id: "a12c1", title: "EU CONSIGO...", items: [
          "acrescentar -s na regra geral.",
          "usar -es depois de s, x, ch, sh e o.",
          "trocar y por -ies depois de consoante.",
          "reconhecer os plurais irregulares." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 12", body: "Pronúncia dos plurais: /s/, /z/ e /ɪz/.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Fale sobre quantidades usando plurais.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 3 — Referência e lugar", body: "This/That, possessivos, there is/are e preposições." } ] }
    ]
  }
  ,{
    id: 13, code: "AULA 13", title: "This / That / These / Those", sub: "Este, esse, estes e esses.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 13" },
        { t: "title", en: "THIS · THAT · THESE · THOSE", pt: "Aponte para o que está perto e para o que está longe." },
        { t: "note", v: "gray", bar: true, kicker: "DUAS PERGUNTAS", bold: true, text: "1. Está perto ou longe?\n2. É um ou mais de um?" },
        { t: "image", id: "a13p1", ph: "Ilustração: pessoa apontando para objetos perto e longe" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Escolher entre this, that, these e those." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 02" },
        { t: "title", en: "O MAPA DAS QUATRO PALAVRAS", pt: "Perto/longe × singular/plural." },
        { t: "pron", code: "THIS", pt: "ESTE / ESTA", c: "teal", v: "mint", title: "Perto · um só", body: "This is my book." },
        { t: "pron", code: "THAT", pt: "AQUELE / AQUELA", c: "purple", v: "lilac", title: "Longe · um só", body: "That is your car." },
        { t: "pron", code: "THESE", pt: "ESTES / ESTAS", c: "teal", v: "mint", title: "Perto · mais de um", body: "These are my books." },
        { t: "pron", code: "THOSE", pt: "AQUELES / AQUELAS", c: "purple", v: "lilac", title: "Longe · mais de um", body: "Those are your cars." },
        { t: "key", v: "navy", text: "Perto começa com TH-IS / TH-ESE. Longe começa com TH-AT / TH-OSE." } ] },

      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 03" },
        { t: "title", en: "COM O VERB TO BE", pt: "Singular pede is, plural pede are." },
        { t: "grid", cols: 2, items: [
          { kicker: "SINGULAR", title: "This is a pen.", body: "That is a pen.", v: "mint", c: "teal" },
          { kicker: "PLURAL", title: "These are pens.", body: "Those are pens.", v: "lilac", c: "purple" } ] },
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Não diga These is my friends. Diga These are my friends." },
        { t: "dnd", id: "a13d1", title: "MONTE A FRASE", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["demonstrativo", "verbo", "resto"],
          tokens: ["my books.", "These", "are"], answer: ["These", "are", "my books."] } ] },

      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com this, that, these ou those." },
        { t: "fill", id: "a13e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. (perto, singular)", post: "is my phone.", answers: ["this"], v: "mint" },
          { pre: "2. (longe, singular)", post: "is her house.", answers: ["that"], v: "lilac" },
          { pre: "3. (perto, plural)", post: "are my shoes.", answers: ["these"], v: "cream" },
          { pre: "4. (longe, plural)", post: "are his friends.", answers: ["those"], v: "mint" },
          { pre: "5. (perto, singular)", post: "is a good book.", answers: ["this"], v: "lilac" } ] },
        { t: "mc", title: "ESCOLHA A OPÇÃO CORRETA", v: "gray", questions: [
          { q: "___ are my keys. (aqui na mão)", options: ["This", "These"], answer: 1 },
          { q: "___ is my teacher. (do outro lado da sala)", options: ["That", "Those"], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Aponte para quatro coisas ao seu redor." },
        { t: "free", id: "a13f1", cols: 2, items: [
          { n: "1", kicker: "PERTO, UM", prefix: "This is…", ideas: "Ex.: This is my cup.", v: "mint", c: "teal" },
          { n: "2", kicker: "LONGE, UM", prefix: "That is…", ideas: "Ex.: That is the window.", v: "lilac", c: "purple" },
          { n: "3", kicker: "PERTO, VÁRIOS", prefix: "These are…", ideas: "Ex.: These are my books.", v: "cream", c: "yellow" },
          { n: "4", kicker: "LONGE, VÁRIOS", prefix: "Those are…", ideas: "Ex.: Those are the chairs.", v: "gray", c: "navy" } ] },
        { t: "check", id: "a13c1", title: "EU CONSIGO...", items: [
          "escolher entre perto e longe.",
          "escolher entre singular e plural.",
          "usar is com this/that e are com these/those." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 13", body: "Exemplos práticos com objetos reais.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva o que está perto e longe de você.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 14 — Possessive Adjectives" } ] }
    ]
  },

  {
    id: 14, code: "AULA 14", title: "Possessive Adjectives", sub: "My, your, his, her, its, our, their.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 14" },
        { t: "title", en: "POSSESSIVE ADJECTIVES", pt: "De quem é? Meu, seu, dele, dela." },
        { t: "image", id: "a14p1", ph: "Ilustração: pessoas mostrando objetos pessoais" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "O possessivo combina com o DONO,\nnão com o objeto." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Usar my, your, his, her, its, our e their corretamente." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 14", page: "PÁGINA 02" },
        { t: "title", en: "O MAPA DOS POSSESSIVOS", pt: "Um para cada subject pronoun." },
        { t: "table", head: ["PRONOME", "POSSESSIVO"], rows: [
          { a: "I", b: "my — meu / minha", v: "mint" },
          { a: "you", b: "your — seu / sua", v: "lilac" },
          { a: "he", b: "his — dele", v: "cream" },
          { a: "she", b: "her — dela", v: "mint" },
          { a: "it", b: "its — dele/dela (coisa)", v: "lilac" },
          { a: "we", b: "our — nosso / nossa", v: "cream" },
          { a: "they", b: "their — deles / delas", v: "mint" } ] },
        { t: "objective", v: "red", title: "NÃO CONFUNDA", text: "its = posse (its name) · it’s = it is (it’s new)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 14", page: "PÁGINA 03" },
        { t: "title", en: "COMBINA COM O DONO", pt: "O objeto não muda nada." },
        { t: "grid", cols: 2, items: [
          { kicker: "DONO: HOMEM", title: "his car · his sister", body: "Mesmo se o objeto for feminino, use his.", v: "mint", c: "teal" },
          { kicker: "DONA: MULHER", title: "her car · her brother", body: "Mesmo se o objeto for masculino, use her.", v: "lilac", c: "purple" } ] },
        { t: "mc", title: "ESCOLHA O POSSESSIVO", v: "gray", questions: [
          { q: "Rafael e a irmã dele:", options: ["his sister", "her sister"], answer: 0, explain: "O dono é Rafael → his." },
          { q: "Marina e o irmão dela:", options: ["his brother", "her brother"], answer: 1 },
          { q: "Nós e a nossa casa:", options: ["our house", "their house"], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 14", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com o possessivo correto." },
        { t: "fill", id: "a14e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. I have a dog.", post: "dog is small.", answers: ["my"], v: "mint" },
          { pre: "2. She is a teacher.", post: "students like her.", answers: ["her"], v: "lilac" },
          { pre: "3. He is my friend.", post: "name is Lucas.", answers: ["his"], v: "cream" },
          { pre: "4. We are students.", post: "school is big.", answers: ["our"], v: "mint" },
          { pre: "5. They are my parents.", post: "house is in Recife.", answers: ["their"], v: "lilac" },
          { pre: "6. It is a city.", post: "name is Salvador.", answers: ["its"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 14", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Fale de coisas suas e dos outros." },
        { t: "free", id: "a14f1", cols: 2, items: [
          { n: "1", kicker: "SEU", prefix: "My … is …", ideas: "Ex.: My city is Recife.", v: "mint", c: "teal" },
          { n: "2", kicker: "DELE OU DELA", prefix: "His / Her … is …", ideas: "Ex.: Her name is Ana.", v: "lilac", c: "purple" },
          { n: "3", kicker: "DE VOCÊS", prefix: "Our … is …", ideas: "Ex.: Our class is at 7.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a14c1", title: "EU CONSIGO...", items: [
          "escolher o possessivo pelo dono.",
          "diferenciar its de it’s.",
          "usar our e their com grupos." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 14", body: "Possessivos em diálogos curtos.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Fale sobre suas coisas e as de sua família.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 15 — There is / There are" } ] }
    ]
  },

  {
    id: 15, code: "AULA 15", title: "There is / There are", sub: "Dizer o que existe em um lugar.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 15" },
        { t: "title", en: "THERE IS / THERE ARE", pt: "Há, existe, tem." },
        { t: "image", id: "a15p1", ph: "Ilustração: sala com móveis e objetos" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "Para dizer que algo EXISTE em um lugar,\nnão use have. Use there is / there are." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Descrever o que existe em um ambiente." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 02" },
        { t: "title", en: "SINGULAR OU PLURAL?", pt: "É o que vem depois que manda." },
        { t: "rule", v: "mint", c: "teal", kicker: "UM SÓ", from: "there is", to: "There’s a book.", ex: "There is a problem.", tr: "Há um livro." },
        { t: "rule", v: "lilac", c: "purple", kicker: "MAIS DE UM", from: "there are", to: "There are three books.", ex: "There are many people.", tr: "Há três livros." },
        { t: "rule", v: "cream", c: "yellow", kicker: "NEGATIVA", from: "not / no", to: "There isn’t · There aren’t", ex: "There aren’t any chairs.", tr: "Não há cadeiras." },
        { t: "note", v: "gray", bold: true, text: "PERGUNTA\nIs there a bank near here? · Are there any restaurants?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 03" },
        { t: "title", en: "DESCREVA UM LUGAR", pt: "Comece pelo que existe." },
        { t: "grid", cols: 1, items: [
          { n: "1", kicker: "AFIRMATIVA", title: "There is a table in the kitchen.", body: "Há uma mesa na cozinha.", v: "mint", c: "teal" },
          { n: "2", kicker: "NEGATIVA", title: "There isn’t a TV in my room.", body: "Não há TV no meu quarto.", v: "lilac", c: "purple" },
          { n: "3", kicker: "PERGUNTA", title: "Are there any windows?", body: "Há janelas?", v: "cream", c: "yellow" } ] },
        { t: "mc", title: "IS OU ARE?", v: "gray", questions: [
          { q: "There ___ two chairs.", options: ["is", "are"], answer: 1 },
          { q: "There ___ a big window.", options: ["is", "are"], answer: 0 },
          { q: "Há pessoas na sala.", options: ["There is people.", "There are people."], answer: 1, explain: "people é plural." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com there is ou there are." },
        { t: "fill", id: "a15e1", title: "COMPLETE AS FRASES", wide: true, items: [
          { pre: "1. ___ a sofa in the living room.", answers: ["there is", "there's", "there’s"], v: "mint" },
          { pre: "2. ___ four people in my family.", answers: ["there are"], v: "lilac" },
          { pre: "3. ___ a park near my house.", answers: ["there is", "there's", "there’s"], v: "cream" },
          { pre: "4. ___ many books on the table.", answers: ["there are"], v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Descreva o lugar onde você está." },
        { t: "free", id: "a15f1", cols: 2, items: [
          { n: "1", kicker: "ALGO QUE EXISTE", prefix: "There is…", ideas: "Ex.: There is a window here.", v: "mint", c: "teal" },
          { n: "2", kicker: "VÁRIAS COISAS", prefix: "There are…", ideas: "Ex.: There are two chairs.", v: "lilac", c: "purple" },
          { n: "3", kicker: "ALGO QUE NÃO EXISTE", prefix: "There isn’t…", ideas: "Ex.: There isn’t a TV.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a15c1", title: "EU CONSIGO...", items: [
          "usar there is com singular.",
          "usar there are com plural.",
          "negar e perguntar sobre o que existe." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 15", body: "Descrevendo ambientes em inglês.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva sua casa em voz alta.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 16 — Prepositions of Place" } ] }
    ]
  },

  {
    id: 16, code: "AULA 16", title: "Prepositions of Place", sub: "In, on, under, next to e mais.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 16" },
        { t: "title", en: "PREPOSITIONS OF PLACE", pt: "Onde as coisas estão." },
        { t: "image", id: "a16p1", ph: "Ilustração: objetos dentro, sobre e embaixo da mesa" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dizer a posição exata de pessoas e objetos." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 02" },
        { t: "title", en: "AS TRÊS PRINCIPAIS", pt: "in, on e at." },
        { t: "rule", v: "mint", c: "teal", kicker: "IN · DENTRO", from: "in", to: "in the box", ex: "in Brazil · in the room", tr: "Espaços fechados, cidades, países." },
        { t: "rule", v: "lilac", c: "purple", kicker: "ON · SOBRE UMA SUPERFÍCIE", from: "on", to: "on the table", ex: "on the wall · on the bus", tr: "Em contato com a superfície." },
        { t: "rule", v: "cream", c: "yellow", kicker: "AT · EM UM PONTO", from: "at", to: "at home", ex: "at school · at the door", tr: "Um ponto ou lugar específico." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 03" },
        { t: "title", en: "AS OUTRAS POSIÇÕES", pt: "Para descrever com precisão." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "under", b: "embaixo de", v: "mint" },
          { a: "behind", b: "atrás de", v: "lilac" },
          { a: "in front of", b: "na frente de", v: "cream" },
          { a: "next to / beside", b: "ao lado de", v: "mint" },
          { a: "between", b: "entre (dois)", v: "lilac" },
          { a: "near", b: "perto de", v: "cream" },
          { a: "above / below", b: "acima / abaixo", v: "mint" } ] },
        { t: "match", title: "LIGUE A PREPOSIÇÃO (AULA 16)",
          left: ["under", "behind", "next to", "between", "in front of"],
          right: ["ao lado de", "atrás de", "embaixo de", "entre", "na frente de"],
          answer: [2, 1, 0, 3, 4] } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com a preposição correta." },
        { t: "fill", id: "a16e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. The book is", post: "the table. (sobre)", answers: ["on"], v: "mint" },
          { pre: "2. The cat is", post: "the box. (dentro)", answers: ["in"], v: "lilac" },
          { pre: "3. I am", post: "home. (em casa)", answers: ["at"], v: "cream" },
          { pre: "4. The bag is", post: "the chair. (embaixo)", answers: ["under"], v: "mint" },
          { pre: "5. The bank is", post: "the school. (ao lado)", answers: ["next to", "beside"], v: "lilac" } ] },
        { t: "mc", title: "ESCOLHA A PREPOSIÇÃO", v: "gray", questions: [
          { q: "Eu moro no Brasil.", options: ["I live in Brazil.", "I live on Brazil."], answer: 0 },
          { q: "A foto está na parede.", options: ["The photo is in the wall.", "The photo is on the wall."], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Descreva onde as coisas estão." },
        { t: "free", id: "a16f1", cols: 2, items: [
          { n: "1", kicker: "ALGO SOBRE A MESA", prefix: "… is on the table.", ideas: "Ex.: My phone is on the table.", v: "mint", c: "teal" },
          { n: "2", kicker: "ALGO PERTO DE VOCÊ", prefix: "… is next to …", ideas: "Ex.: The lamp is next to the bed.", v: "lilac", c: "purple" },
          { n: "3", kicker: "ONDE VOCÊ ESTÁ", prefix: "I am at / in…", ideas: "Ex.: I am at home.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a16c1", title: "EU CONSIGO...", items: [
          "diferenciar in, on e at.",
          "usar under, behind, next to e between.",
          "descrever a posição de objetos." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 16", body: "Preposições com exemplos visuais.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva seu quarto item por item.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 17 — Simple Present: Affirmative" } ] }
    ]
  },

  {
    id: 17, code: "AULA 17", title: "Simple Present — Affirmative", sub: "Rotinas e fatos no presente.",
    time: "16 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 17" },
        { t: "title", en: "SIMPLE PRESENT", pt: "O tempo da rotina e dos fatos." },
        { t: "image", id: "a17p1", ph: "Ilustração: rotina diária — acordar, estudar, trabalhar" },
        { t: "note", v: "gray", bar: true, kicker: "QUANDO USAR", bold: true, text: "Hábitos: I work every day.\nFatos: Water boils at 100°C." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Formar frases afirmativas no presente simples." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "16 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 17", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA DO -S", pt: "He, she e it ganham -s no verbo." },
        { t: "rule", v: "mint", c: "teal", kicker: "1 · I · YOU · WE · THEY", from: "verbo normal", to: "I work.", ex: "They study every day.", tr: "Sem mudança." },
        { t: "rule", v: "lilac", c: "purple", kicker: "2 · HE · SHE · IT", from: "verbo + s", to: "He works.", ex: "She studies. · It rains.", tr: "Acrescente -s." },
        { t: "objective", v: "red", title: "O ERRO MAIS COMUM", text: "Não esqueça o -s: She work → errado. She works → certo." },
        { t: "dnd", id: "a17d1", title: "MONTE A FRASE", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["sujeito", "verbo", "complemento"],
          tokens: ["English", "She", "studies"], answer: ["She", "studies", "English"] } ] },

      { blocks: [
        { t: "badge", label: "AULA 17", page: "PÁGINA 03" },
        { t: "title", en: "COMO ACRESCENTAR O -S", pt: "Três casos simples." },
        { t: "table", head: ["TERMINAÇÃO", "EXEMPLO"], rows: [
          { a: "regra geral: + s", b: "work → works", v: "mint" },
          { a: "s, x, ch, sh, o: + es", b: "watch → watches · go → goes", v: "lilac" },
          { a: "consoante + y: -ies", b: "study → studies", v: "cream" },
          { a: "vogal + y: + s", b: "play → plays", v: "mint" },
          { a: "irregular", b: "have → has", v: "lilac" } ] },
        { t: "mc", title: "ESCOLHA A FORMA CORRETA", v: "gray", questions: [
          { q: "She ___ TV every night.", options: ["watch", "watches"], answer: 1 },
          { q: "He ___ a car.", options: ["have", "has"], answer: 1 },
          { q: "They ___ in Recife.", options: ["live", "lives"], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 17", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva o verbo na forma correta." },
        { t: "fill", id: "a17e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. I", post: "English. (study)", answers: ["study"], v: "mint" },
          { pre: "2. She", post: "in a hospital. (work)", answers: ["works"], v: "lilac" },
          { pre: "3. We", post: "soccer on Sunday. (play)", answers: ["play"], v: "cream" },
          { pre: "4. He", post: "to school by bus. (go)", answers: ["goes"], v: "mint" },
          { pre: "5. They", post: "two cars. (have)", answers: ["have"], v: "lilac" },
          { pre: "6. My mother", post: "coffee every morning. (drink)", answers: ["drinks"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 17", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva sobre a sua rotina." },
        { t: "free", id: "a17f1", cols: 2, items: [
          { n: "1", kicker: "VOCÊ", prefix: "I … every day.", ideas: "Ex.: I study English every day.", v: "mint", c: "teal" },
          { n: "2", kicker: "ALGUÉM DA FAMÍLIA", prefix: "He / She …s …", ideas: "Ex.: My father works in an office.", v: "lilac", c: "purple" },
          { n: "3", kicker: "SEU GRUPO", prefix: "We …", ideas: "Ex.: We watch movies on Friday.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a17c1", title: "EU CONSIGO...", items: [
          "usar o verbo sem -s com I, you, we e they.",
          "acrescentar -s com he, she e it.",
          "usar goes, has e studies corretamente." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 17", body: "A regra do -s explicada com exemplos.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Conte sua rotina em voz alta.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 18 — Simple Present: Negative" } ] }
    ]
  },

  {
    id: 18, code: "AULA 18", title: "Simple Present — Negative", sub: "Don’t e doesn’t.",
    time: "15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 18" },
        { t: "title", en: "DON’T / DOESN’T", pt: "Negar rotinas e fatos." },
        { t: "image", id: "a18p1", ph: "Ilustração: pessoa dizendo não com gesto" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "Aqui o auxiliar do / does entra em cena —\ne o verbo principal volta à forma básica." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Formar frases negativas no presente simples." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 18", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA", pt: "O -s passa para o auxiliar." },
        { t: "rule", v: "mint", c: "teal", kicker: "I · YOU · WE · THEY", from: "do not", to: "don’t + verbo", ex: "I don’t work on Sunday.", tr: "Eu não trabalho no domingo." },
        { t: "rule", v: "lilac", c: "purple", kicker: "HE · SHE · IT", from: "does not", to: "doesn’t + verbo", ex: "She doesn’t work here.", tr: "Ela não trabalha aqui." },
        { t: "objective", v: "red", title: "ERRO CLÁSSICO", text: "Depois de doesn’t, o verbo perde o -s. Diga: She doesn’t work. — nunca She doesn’t works." },
        { t: "compare", items: [
          { wrong: "He doesn’t works here.", note: "O -s já está em doesn’t.", right: "He doesn’t work here.", rnote: "Ele não trabalha aqui." },
          { wrong: "I no like coffee.", right: "I don’t like coffee." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 18", page: "PÁGINA 03" },
        { t: "title", en: "VERB TO BE × OUTROS VERBOS", pt: "Não misture as duas negativas." },
        { t: "grid", cols: 2, items: [
          { kicker: "COM VERB TO BE", title: "She isn’t a doctor.", body: "Use not — sem do/does.", v: "mint", c: "teal" },
          { kicker: "COM OUTROS VERBOS", title: "She doesn’t work here.", body: "Use doesn’t + verbo.", v: "lilac", c: "purple" } ] },
        { t: "mc", title: "QUAL É A CORRETA?", v: "gray", questions: [
          { q: "Ela não é professora.", options: ["She doesn’t be a teacher.", "She isn’t a teacher."], answer: 1 },
          { q: "Ela não estuda inglês.", options: ["She doesn’t study English.", "She isn’t study English."], answer: 0 },
          { q: "Eu não gosto de café.", options: ["I don’t like coffee.", "I doesn’t like coffee."], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 18", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com don’t ou doesn’t." },
        { t: "fill", id: "a18e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. I", post: "like tea.", answers: ["don't", "do not", "don’t"], v: "mint" },
          { pre: "2. He", post: "live in Recife.", answers: ["doesn't", "does not", "doesn’t"], v: "lilac" },
          { pre: "3. They", post: "work on Saturday.", answers: ["don't", "do not", "don’t"], v: "cream" },
          { pre: "4. She", post: "speak French.", answers: ["doesn't", "does not", "doesn’t"], v: "mint" },
          { pre: "5. We", post: "have a car.", answers: ["don't", "do not", "don’t"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 18", page: "PÁGINA 05" },
        { t: "title", en: "MÓDULO 3 CONCLUÍDO!", pt: "Escreva o que você não faz." },
        { t: "free", id: "a18f1", cols: 2, items: [
          { n: "1", kicker: "VOCÊ", prefix: "I don’t…", ideas: "Ex.: I don’t drink coffee.", v: "mint", c: "teal" },
          { n: "2", kicker: "OUTRA PESSOA", prefix: "He / She doesn’t…", ideas: "Ex.: She doesn’t work on Friday.", v: "lilac", c: "purple" } ] },
        { t: "check", id: "a18c1", title: "EU CONSIGO...", items: [
          "usar don’t com I, you, we e they.",
          "usar doesn’t com he, she e it.",
          "deixar o verbo sem -s depois de doesn’t.",
          "não misturar isn’t com doesn’t." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 18", body: "Negativas do presente simples na prática.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga cinco coisas que você não faz.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 4 — Presente simples", body: "Perguntas, frequência, rotina, horas e comida." } ] }
    ]
  }
  ,{
    id: 19, code: "AULA 19", title: "Simple Present — Questions", sub: "Perguntas com do e does.",
    time: "15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 19" },
        { t: "title", en: "DO / DOES QUESTIONS", pt: "Perguntar sobre rotinas e gostos." },
        { t: "image", id: "a19p1", ph: "Ilustração: duas pessoas em entrevista descontraída" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "A pergunta começa pelo auxiliar:\nDo…? ou Does…?" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Fazer perguntas no presente simples e responder de forma curta." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 19", page: "PÁGINA 02" },
        { t: "title", en: "A ESTRUTURA", pt: "Do/Does + sujeito + verbo básico." },
        { t: "chips", items: [
          { t: "DO / DOES", c: "lilac" }, { t: "SUJEITO", c: "mint" }, { t: "VERBO", c: "cream" }, { t: "?", c: "yellow" } ] },
        { t: "rule", v: "mint", c: "teal", kicker: "I · YOU · WE · THEY", from: "do", to: "Do you work?", ex: "Do they live here?", tr: "Você trabalha?" },
        { t: "rule", v: "lilac", c: "purple", kicker: "HE · SHE · IT", from: "does", to: "Does he work?", ex: "Does she study English?", tr: "Ele trabalha?" },
        { t: "objective", v: "red", title: "ATENÇÃO", text: "Depois de does, o verbo não leva -s: Does she work? — nunca Does she works?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 19", page: "PÁGINA 03" },
        { t: "title", en: "RESPOSTAS CURTAS", pt: "Repita o auxiliar." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA CURTA"], rows: [
          { a: "Do you like coffee?", b: "Yes, I do. / No, I don’t.", v: "mint" },
          { a: "Does he work here?", b: "Yes, he does. / No, he doesn’t.", v: "lilac" },
          { a: "Do they study English?", b: "Yes, they do. / No, they don’t.", v: "cream" },
          { a: "Does she speak French?", b: "Yes, she does. / No, she doesn’t.", v: "mint" } ] },
        { t: "match", title: "LIGUE PERGUNTA E RESPOSTA (AULA 19)",
          left: ["Do you like pizza?", "Does he play soccer?", "Do they work here?", "Does she speak English?"],
          right: ["Yes, he does.", "Yes, I do.", "Yes, she does.", "No, they don’t."],
          answer: [1, 0, 3, 2] } ] },

      { blocks: [
        { t: "badge", label: "AULA 19", page: "PÁGINA 04" },
        { t: "title", en: "PERGUNTAS COM WH-", pt: "Where, what, when e how." },
        { t: "grid", cols: 2, items: [
          { kicker: "WHERE · ONDE", title: "Where do you live?", body: "Onde você mora?", v: "mint", c: "teal" },
          { kicker: "WHAT · O QUE", title: "What do you do?", body: "O que você faz?", v: "lilac", c: "purple" },
          { kicker: "WHEN · QUANDO", title: "When does she study?", body: "Quando ela estuda?", v: "cream", c: "yellow" },
          { kicker: "HOW · COMO", title: "How do you go to work?", body: "Como você vai ao trabalho?", v: "gray", c: "navy" } ] },
        { t: "note", v: "gray", bold: true, text: "A ordem é sempre: Wh- + do/does + sujeito + verbo?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 19", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com Do ou Does." },
        { t: "fill", id: "a19e1", title: "COMPLETE AS PERGUNTAS", items: [
          { pre: "1.", post: "you like music?", answers: ["do"], v: "mint" },
          { pre: "2.", post: "she work here?", answers: ["does"], v: "lilac" },
          { pre: "3.", post: "they speak English?", answers: ["do"], v: "cream" },
          { pre: "4. Where", post: "he live?", answers: ["does"], v: "mint" },
          { pre: "5. What time", post: "you start?", answers: ["do"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 19", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva três perguntas reais." },
        { t: "free", id: "a19f1", cols: 2, items: [
          { n: "1", kicker: "PARA UM AMIGO", prefix: "Do you…?", ideas: "Ex.: Do you like coffee?", v: "mint", c: "teal" },
          { n: "2", kicker: "SOBRE ALGUÉM", prefix: "Does he / she…?", ideas: "Ex.: Does she work here?", v: "lilac", c: "purple" },
          { n: "3", kicker: "COM WH-", prefix: "Where / What / When…?", ideas: "Ex.: Where do you study?", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a19c1", title: "EU CONSIGO...", items: [
          "começar perguntas com Do ou Does.",
          "deixar o verbo na forma básica.",
          "responder com Yes, I do. / No, he doesn’t.",
          "usar where, what, when e how." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 19", body: "Perguntas do dia a dia com do e does.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Entreviste a IA com cinco perguntas.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 20 — Adverbs of Frequency" } ] }
    ]
  },

  {
    id: 20, code: "AULA 20", title: "Adverbs of Frequency", sub: "Always, usually, never e companhia.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 20" },
        { t: "title", en: "ADVERBS OF FREQUENCY", pt: "Com que frequência você faz isso?" },
        { t: "image", id: "a20p1", ph: "Ilustração: calendário semanal com hábitos marcados" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dizer com que frequência algo acontece." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 20", page: "PÁGINA 02" },
        { t: "title", en: "A ESCALA DA FREQUÊNCIA", pt: "De 100% a 0%." },
        { t: "table", head: ["ADVÉRBIO", "FREQUÊNCIA"], rows: [
          { a: "always", b: "100% — sempre", v: "mint" },
          { a: "usually", b: "80% — geralmente", v: "lilac" },
          { a: "often", b: "60% — frequentemente", v: "cream" },
          { a: "sometimes", b: "40% — às vezes", v: "mint" },
          { a: "rarely / seldom", b: "10% — raramente", v: "lilac" },
          { a: "never", b: "0% — nunca", v: "cream" } ] },
        { t: "note", v: "gray", bold: true, text: "never já é negativo: diga I never drink coffee. (não: I don’t never…)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 20", page: "PÁGINA 03" },
        { t: "title", en: "ONDE COLOCAR", pt: "Antes do verbo — mas depois do verb to be." },
        { t: "rule", v: "mint", c: "teal", kicker: "COM VERBO NORMAL", from: "antes do verbo", to: "I always study.", ex: "She never works on Sunday.", tr: "Sujeito + advérbio + verbo." },
        { t: "rule", v: "lilac", c: "purple", kicker: "COM VERB TO BE", from: "depois do verbo", to: "I am always late.", ex: "He is usually happy.", tr: "Sujeito + to be + advérbio." },
        { t: "dnd", id: "a20d1", title: "MONTE A FRASE", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["sujeito", "advérbio", "verbo + resto"],
          tokens: ["studies at night.", "She", "usually"], answer: ["She", "usually", "studies at night."] } ] },

      { blocks: [
        { t: "badge", label: "AULA 20", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Coloque o advérbio no lugar certo." },
        { t: "fill", id: "a20e1", title: "REESCREVA A FRASE", wide: true, items: [
          { pre: "1. I study at night. (always)", answers: ["i always study at night.", "i always study at night"], v: "mint" },
          { pre: "2. He is late. (never)", answers: ["he is never late.", "he is never late"], v: "lilac" },
          { pre: "3. They work on Saturday. (sometimes)", answers: ["they sometimes work on saturday.", "they sometimes work on saturday"], v: "cream" } ] },
        { t: "mc", title: "ONDE ENTRA O ADVÉRBIO?", v: "gray", questions: [
          { q: "Ela está sempre feliz.", options: ["She always is happy.", "She is always happy."], answer: 1, explain: "Com o verb to be, o advérbio vem depois." },
          { q: "Eu nunca chego atrasado.", options: ["I never arrive late.", "I arrive never late."], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 20", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Descreva seus hábitos." },
        { t: "free", id: "a20f1", cols: 2, items: [
          { n: "1", kicker: "SEMPRE", prefix: "I always…", ideas: "Ex.: I always drink water.", v: "mint", c: "teal" },
          { n: "2", kicker: "ÀS VEZES", prefix: "I sometimes…", ideas: "Ex.: I sometimes study at night.", v: "lilac", c: "purple" },
          { n: "3", kicker: "NUNCA", prefix: "I never…", ideas: "Ex.: I never watch TV in the morning.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a20c1", title: "EU CONSIGO...", items: [
          "reconhecer a escala de frequência.",
          "colocar o advérbio antes do verbo comum.",
          "colocar o advérbio depois do verb to be." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 20", body: "Frequência na fala natural.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Conte seus hábitos da semana.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 21 — Daily Routine" } ] }
    ]
  },

  {
    id: 21, code: "AULA 21", title: "Daily Routine", sub: "Conte o seu dia do começo ao fim.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 21" },
        { t: "title", en: "DAILY ROUTINE", pt: "Do despertador até a hora de dormir." },
        { t: "image", id: "a21p1", ph: "Ilustração: sequência da rotina do dia" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Descrever sua rotina em ordem, com horários." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 21", page: "PÁGINA 02" },
        { t: "title", en: "OS VERBOS DA ROTINA", pt: "As ações que se repetem todo dia." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "wake up", b: "acordar", v: "mint" },
          { a: "get up", b: "levantar da cama", v: "lilac" },
          { a: "take a shower", b: "tomar banho", v: "cream" },
          { a: "have breakfast", b: "tomar café da manhã", v: "mint" },
          { a: "go to work / school", b: "ir ao trabalho / escola", v: "lilac" },
          { a: "have lunch / dinner", b: "almoçar / jantar", v: "cream" },
          { a: "get home", b: "chegar em casa", v: "mint" },
          { a: "go to bed", b: "ir dormir", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 21", page: "PÁGINA 03" },
        { t: "title", en: "COLOQUE EM ORDEM", pt: "Use as palavras de sequência." },
        { t: "chips", items: [
          { t: "first", c: "mint" }, { t: "then", c: "lilac" }, { t: "after that", c: "cream" }, { t: "finally", c: "mint" } ] },
        { t: "objective", v: "navy", title: "EXEMPLO COMPLETO", text: "First, I wake up at 6. Then I take a shower. After that, I have breakfast. Finally, I go to work." },
        { t: "dnd", id: "a21d1", title: "MONTE A ROTINA", sub: "Arraste ou toque nas peças na ordem lógica.",
          slots: ["1º", "2º", "3º"],
          tokens: ["I have breakfast.", "I wake up.", "I take a shower."],
          answer: ["I wake up.", "I take a shower.", "I have breakfast."] } ] },

      { blocks: [
        { t: "badge", label: "AULA 21", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva a ação em inglês." },
        { t: "fill", id: "a21e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. acordar →", answers: ["wake up"], v: "mint" },
          { pre: "2. tomar banho →", answers: ["take a shower", "have a shower"], v: "lilac" },
          { pre: "3. almoçar →", answers: ["have lunch"], v: "cream" },
          { pre: "4. ir dormir →", answers: ["go to bed"], v: "mint" },
          { pre: "5. chegar em casa →", answers: ["get home", "arrive home"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 21", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva sua rotina em quatro passos." },
        { t: "free", id: "a21f1", cols: 2, items: [
          { n: "1", kicker: "MANHÃ", prefix: "First, I…", ideas: "Ex.: First, I wake up at 6.", v: "mint", c: "teal" },
          { n: "2", kicker: "DEPOIS", prefix: "Then I…", ideas: "Ex.: Then I have breakfast.", v: "lilac", c: "purple" },
          { n: "3", kicker: "TARDE", prefix: "After that, I…", ideas: "Ex.: After that, I go to work.", v: "cream", c: "yellow" },
          { n: "4", kicker: "NOITE", prefix: "Finally, I…", ideas: "Ex.: Finally, I go to bed at 11.", v: "gray", c: "navy" } ] },
        { t: "check", id: "a21c1", title: "EU CONSIGO...", items: [
          "nomear as ações do meu dia.",
          "usar first, then, after that e finally.",
          "contar minha rotina em ordem." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 21", body: "Uma rotina completa narrada em inglês.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Conte seu dia de ontem até hoje.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 22 — Telling the Time" } ] }
    ]
  },

  {
    id: 22, code: "AULA 22", title: "Telling the Time", sub: "Que horas são?",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 22" },
        { t: "title", en: "WHAT TIME IS IT?", pt: "Dizer e perguntar as horas." },
        { t: "image", id: "a22p1", ph: "Ilustração: relógios marcando horários diferentes" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dizer as horas de duas maneiras e marcar compromissos." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 02" },
        { t: "title", en: "DUAS MANEIRAS", pt: "A simples e a tradicional." },
        { t: "rule", v: "mint", c: "teal", kicker: "1 · A MAIS FÁCIL", from: "hora + minutos", to: "It’s seven thirty.", ex: "8:15 → It’s eight fifteen.", tr: "Leia os números na ordem." },
        { t: "rule", v: "lilac", c: "purple", kicker: "2 · COM PAST E TO", from: "past / to", to: "It’s half past seven.", ex: "8:45 → It’s a quarter to nine.", tr: "past = depois · to = para" },
        { t: "table", head: ["HORÁRIO", "COMO DIZER"], rows: [
          { a: "7:00", b: "It’s seven o’clock.", v: "mint" },
          { a: "7:15", b: "It’s a quarter past seven.", v: "lilac" },
          { a: "7:30", b: "It’s half past seven.", v: "cream" },
          { a: "7:45", b: "It’s a quarter to eight.", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 03" },
        { t: "title", en: "MANHÃ, TARDE E NOITE", pt: "a.m., p.m. e as preposições." },
        { t: "grid", cols: 3, items: [
          { kicker: "MANHÃ", title: "in the morning", body: "6 a.m. – 12 p.m.", v: "mint" },
          { kicker: "TARDE", title: "in the afternoon", body: "12 p.m. – 6 p.m.", v: "lilac" },
          { kicker: "NOITE", title: "at night", body: "depois das 9 p.m.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "PREPOSIÇÃO DE HORÁRIO", text: "Use at com hora exata: The class is at 7 p.m." },
        { t: "mc", title: "ESCOLHA A OPÇÃO CORRETA", v: "gray", questions: [
          { q: "A aula é às 8.", options: ["The class is in 8.", "The class is at 8."], answer: 1 },
          { q: "9:30", options: ["It’s half past nine.", "It’s half to nine."], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva o horário em inglês." },
        { t: "fill", id: "a22e1", title: "COMO SE DIZ?", wide: true, items: [
          { pre: "1. 6:00", note: "Use o’clock.", answers: ["it's six o'clock.", "it’s six o’clock.", "six o'clock", "it's six o'clock"], v: "mint" },
          { pre: "2. 10:30", note: "Use half past.", answers: ["it's half past ten.", "it’s half past ten.", "half past ten"], v: "lilac" },
          { pre: "3. 4:15", note: "Use a quarter past.", answers: ["it's a quarter past four.", "it’s a quarter past four.", "a quarter past four"], v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Fale dos seus horários." },
        { t: "free", id: "a22f1", cols: 2, items: [
          { n: "1", kicker: "VOCÊ ACORDA", prefix: "I wake up at…", ideas: "Ex.: I wake up at six thirty.", v: "mint", c: "teal" },
          { n: "2", kicker: "VOCÊ ESTUDA", prefix: "I study at…", ideas: "Ex.: I study at eight p.m.", v: "lilac", c: "purple" },
          { n: "3", kicker: "VOCÊ DORME", prefix: "I go to bed at…", ideas: "Ex.: I go to bed at eleven.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a22c1", title: "EU CONSIGO...", items: [
          "dizer as horas do jeito simples.",
          "usar past, to, half e quarter.",
          "usar at antes do horário." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 22", body: "Horas na prática, com relógios reais.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Marque um horário com a IA.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 23 — Food and Drinks" } ] }
    ]
  },

  {
    id: 23, code: "AULA 23", title: "Food and Drinks", sub: "Comidas, bebidas e pedidos.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 23" },
        { t: "title", en: "FOOD AND DRINKS", pt: "No mercado, no café e no restaurante." },
        { t: "image", id: "a23p1", ph: "Ilustração: mesa com comidas e bebidas" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Nomear alimentos e fazer um pedido simples." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 23", page: "PÁGINA 02" },
        { t: "title", en: "O VOCABULÁRIO ESSENCIAL", pt: "O que você come todo dia." },
        { t: "chips", title: "FOOD", items: [
          { t: "bread", c: "cream" }, { t: "rice", c: "mint" }, { t: "beans", c: "lilac" }, { t: "chicken", c: "cream" },
          { t: "meat", c: "mint" }, { t: "fish", c: "lilac" }, { t: "cheese", c: "cream" }, { t: "egg", c: "mint" },
          { t: "fruit", c: "lilac" }, { t: "salad", c: "cream" } ] },
        { t: "chips", title: "DRINKS", items: [
          { t: "water", c: "mint" }, { t: "coffee", c: "lilac" }, { t: "tea", c: "cream" }, { t: "juice", c: "mint" },
          { t: "milk", c: "lilac" }, { t: "soda", c: "cream" } ] },
        { t: "note", v: "gray", bold: true, text: "REFEIÇÕES\nbreakfast · lunch · dinner · snack" } ] },

      { blocks: [
        { t: "badge", label: "AULA 23", page: "PÁGINA 03" },
        { t: "title", en: "FAZENDO UM PEDIDO", pt: "Frases prontas que sempre funcionam." },
        { t: "grid", cols: 1, items: [
          { n: "1", kicker: "PEDIR", title: "I’d like a coffee, please.", body: "Eu gostaria de um café, por favor.", v: "mint", c: "teal" },
          { n: "2", kicker: "PERGUNTAR O PREÇO", title: "How much is it?", body: "Quanto custa?", v: "lilac", c: "purple" },
          { n: "3", kicker: "DIZER O QUE GOSTA", title: "I like fish. / I don’t like soda.", body: "Eu gosto de peixe. / Não gosto de refrigerante.", v: "cream", c: "yellow" } ] },
        { t: "objective", v: "navy", title: "MAIS EDUCADO", text: "I’d like… soa melhor que I want… ao pedir algo." } ] },

      { blocks: [
        { t: "badge", label: "AULA 23", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva em inglês." },
        { t: "fill", id: "a23e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. pão →", answers: ["bread"], v: "cream" },
          { pre: "2. arroz →", answers: ["rice"], v: "mint" },
          { pre: "3. frango →", answers: ["chicken"], v: "lilac" },
          { pre: "4. suco →", answers: ["juice"], v: "cream" },
          { pre: "5. leite →", answers: ["milk"], v: "mint" },
          { pre: "6. café da manhã →", answers: ["breakfast"], v: "lilac" } ] },
        { t: "match", title: "LIGUE A REFEIÇÃO (AULA 23)",
          left: ["breakfast", "lunch", "dinner", "snack"],
          right: ["almoço", "café da manhã", "jantar", "lanche"],
          answer: [1, 0, 2, 3] } ] },

      { blocks: [
        { t: "badge", label: "AULA 23", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Monte o seu pedido." },
        { t: "free", id: "a23f1", cols: 2, items: [
          { n: "1", kicker: "SEU CAFÉ DA MANHÃ", prefix: "For breakfast, I have…", ideas: "Ex.: For breakfast, I have bread and coffee.", v: "mint", c: "teal" },
          { n: "2", kicker: "UM PEDIDO", prefix: "I’d like…", ideas: "Ex.: I’d like a chicken salad, please.", v: "lilac", c: "purple" },
          { n: "3", kicker: "O QUE VOCÊ NÃO GOSTA", prefix: "I don’t like…", ideas: "Ex.: I don’t like soda.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a23c1", title: "EU CONSIGO...", items: [
          "nomear comidas e bebidas comuns.",
          "pedir algo com I’d like.",
          "dizer do que gosto e do que não gosto." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 23", body: "Um diálogo completo em um café.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça um pedido em um restaurante fictício.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 24 — Can / Can’t" } ] }
    ]
  },

  {
    id: 24, code: "AULA 24", title: "Can / Can’t", sub: "Habilidade, permissão e pedidos.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 24" },
        { t: "title", en: "CAN / CAN’T", pt: "O que você consegue fazer?" },
        { t: "image", id: "a24p1", ph: "Ilustração: pessoas mostrando habilidades diferentes" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "can nunca muda de forma.\nE o verbo depois dele fica na forma básica." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Falar de habilidades, pedir e dar permissão." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 02" },
        { t: "title", en: "AS TRÊS FORMAS", pt: "Afirmativa, negativa e pergunta." },
        { t: "rule", v: "mint", c: "teal", kicker: "AFIRMATIVA", from: "can", to: "I can swim.", ex: "She can speak English.", tr: "Sem -s, mesmo com she." },
        { t: "rule", v: "lilac", c: "purple", kicker: "NEGATIVA", from: "cannot", to: "I can’t swim.", ex: "He can’t drive.", tr: "can’t = cannot" },
        { t: "rule", v: "cream", c: "yellow", kicker: "PERGUNTA", from: "Can + sujeito", to: "Can you swim?", ex: "Yes, I can. / No, I can’t.", tr: "Resposta curta repete can." },
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Não diga She cans. Nem I can to swim. Diga: She can swim." } ] },

      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 03" },
        { t: "title", en: "TRÊS USOS DE CAN", pt: "A mesma palavra, três situações." },
        { t: "grid", cols: 3, items: [
          { kicker: "HABILIDADE", title: "I can cook.", body: "Eu sei cozinhar.", v: "mint" },
          { kicker: "PERMISSÃO", title: "Can I go out?", body: "Posso sair?", v: "lilac" },
          { kicker: "PEDIDO", title: "Can you help me?", body: "Você pode me ajudar?", v: "cream" } ] },
        { t: "dnd", id: "a24d1", title: "MONTE A PERGUNTA", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["can", "sujeito", "verbo + resto"],
          tokens: ["help me?", "Can", "you"], answer: ["Can", "you", "help me?"] } ] },

      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com can ou can’t." },
        { t: "fill", id: "a24e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. She", post: "speak three languages. (sabe)", answers: ["can"], v: "mint" },
          { pre: "2. I", post: "swim. (não sei)", answers: ["can't", "cannot", "can’t"], v: "lilac" },
          { pre: "3.", post: "you help me? (pedido)", answers: ["can"], v: "cream" },
          { pre: "4. He", post: "drive a car. (sabe)", answers: ["can"], v: "mint" },
          { pre: "5. They", post: "come today. (não podem)", answers: ["can't", "cannot", "can’t"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 05" },
        { t: "title", en: "MÓDULO 4 CONCLUÍDO!", pt: "Fale sobre o que você sabe fazer." },
        { t: "free", id: "a24f1", cols: 2, items: [
          { n: "1", kicker: "HABILIDADE", prefix: "I can…", ideas: "Ex.: I can cook rice.", v: "mint", c: "teal" },
          { n: "2", kicker: "AINDA NÃO", prefix: "I can’t… yet.", ideas: "Ex.: I can’t drive yet.", v: "lilac", c: "purple" },
          { n: "3", kicker: "UM PEDIDO", prefix: "Can you…?", ideas: "Ex.: Can you repeat, please?", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a24c1", title: "EU CONSIGO...", items: [
          "usar can sem -s e sem to.",
          "negar com can’t.",
          "perguntar com Can…? e responder curto.",
          "usar can para habilidade, permissão e pedido." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 24", body: "Can no dia a dia: pedidos e permissões.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga cinco coisas que você sabe fazer.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 5 — Ações e rotina", body: "Imperativo, presente contínuo, roupas, clima e profissões." } ] }
    ]
  }
  ,{
    id: 25, code: "AULA 25", title: "Imperatives", sub: "Instruções, ordens e conselhos.",
    time: "12 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 25" },
        { t: "title", en: "IMPERATIVES", pt: "Dar instruções sem complicação." },
        { t: "image", id: "a25p1", ph: "Ilustração: placas e instruções em um espaço público" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "Sem sujeito. Só o verbo na forma básica." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dar instruções, ordens e conselhos em inglês." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 02" },
        { t: "title", en: "AFIRMATIVO E NEGATIVO", pt: "Duas formas simples." },
        { t: "rule", v: "mint", c: "teal", kicker: "AFIRMATIVO", from: "verbo", to: "Open the door.", ex: "Sit down. · Listen.", tr: "Abra a porta." },
        { t: "rule", v: "lilac", c: "purple", kicker: "NEGATIVO", from: "don’t + verbo", to: "Don’t open the door.", ex: "Don’t worry. · Don’t be late.", tr: "Não abra a porta." },
        { t: "objective", v: "navy", title: "MAIS EDUCADO", text: "Acrescente please: Please sit down. · Sit down, please." } ] },

      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 03" },
        { t: "title", en: "ONDE VOCÊ VÊ ISSO", pt: "Sala de aula, receitas e placas." },
        { t: "grid", cols: 3, items: [
          { kicker: "NA AULA", title: "Open your book.", body: "Abra seu livro.", v: "mint" },
          { kicker: "NA RECEITA", title: "Add the milk.", body: "Acrescente o leite.", v: "lilac" },
          { kicker: "NA PLACA", title: "Don’t smoke.", body: "Não fume.", v: "cream" } ] },
        { t: "dnd", id: "a25d1", title: "MONTE A INSTRUÇÃO", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["negativo", "verbo", "resto"],
          tokens: ["late.", "Don’t", "be"], answer: ["Don’t", "be", "late."] } ] },

      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva a instrução em inglês." },
        { t: "fill", id: "a25e1", title: "ESCREVA EM INGLÊS", wide: true, items: [
          { pre: "1. Abra a janela.", answers: ["open the window.", "open the window"], v: "mint" },
          { pre: "2. Não fale agora.", answers: ["don't speak now.", "don’t speak now.", "don't talk now.", "don’t talk now."], v: "lilac" },
          { pre: "3. Sente-se, por favor.", answers: ["sit down, please.", "please sit down.", "sit down please."], v: "cream" } ] },
        { t: "mc", title: "ESCOLHA A FORMA CORRETA", v: "gray", questions: [
          { q: "Não se preocupe.", options: ["You don’t worry.", "Don’t worry."], answer: 1, explain: "O imperativo não leva sujeito." },
          { q: "Feche a porta.", options: ["Close the door.", "You close the door."], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Escreva três instruções." },
        { t: "free", id: "a25f1", cols: 2, items: [
          { n: "1", kicker: "UMA ORDEM SIMPLES", prefix: "…", ideas: "Ex.: Close the window.", v: "mint", c: "teal" },
          { n: "2", kicker: "UM PEDIDO EDUCADO", prefix: "Please…", ideas: "Ex.: Please repeat that.", v: "lilac", c: "purple" },
          { n: "3", kicker: "UM CONSELHO NEGATIVO", prefix: "Don’t…", ideas: "Ex.: Don’t study at the last minute.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a25c1", title: "EU CONSIGO...", items: [
          "usar o verbo sem sujeito.",
          "negar com Don’t.",
          "suavizar o pedido com please." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 25", body: "Instruções em situações reais.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Dê instruções para uma receita simples.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 26 — Present Continuous" } ] }
    ]
  },

  {
    id: 26, code: "AULA 26", title: "Present Continuous", sub: "O que está acontecendo agora.",
    time: "16 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 26" },
        { t: "title", en: "PRESENT CONTINUOUS", pt: "Ações acontecendo neste momento." },
        { t: "image", id: "a26p1", ph: "Ilustração: pessoas fazendo coisas diferentes agora" },
        { t: "note", v: "gray", bar: true, kicker: "A FÓRMULA", bold: true, text: "am / is / are + verbo + -ing" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Descrever o que está acontecendo agora." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "16 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 02" },
        { t: "title", en: "A ESTRUTURA", pt: "Verb to be + verbo com -ing." },
        { t: "chips", items: [
          { t: "SUJEITO", c: "mint" }, { t: "AM / IS / ARE", c: "lilac" }, { t: "VERBO + ING", c: "cream" } ] },
        { t: "rule", v: "cream", c: "yellow", kicker: "EU", from: "I am", to: "I am studying.", ex: "I’m working now.", tr: "Estou estudando." },
        { t: "rule", v: "mint", c: "teal", kicker: "HE · SHE · IT", from: "is", to: "She is reading.", ex: "It is raining.", tr: "Ela está lendo." },
        { t: "rule", v: "lilac", c: "purple", kicker: "YOU · WE · THEY", from: "are", to: "They are playing.", ex: "We’re waiting.", tr: "Eles estão jogando." },
        { t: "objective", v: "red", title: "NÃO ESQUEÇA O VERB TO BE", text: "Diga She is working. — nunca She working." } ] },

      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 03" },
        { t: "title", en: "COMO ESCREVER O -ING", pt: "Três ajustes de escrita." },
        { t: "table", head: ["REGRA", "EXEMPLO"], rows: [
          { a: "geral: + ing", b: "work → working", v: "mint" },
          { a: "termina em e: tira o e", b: "write → writing", v: "lilac" },
          { a: "consoante-vogal-consoante: dobra", b: "run → running · sit → sitting", v: "cream" },
          { a: "termina em ie: vira y", b: "lie → lying", v: "mint" } ] },
        { t: "dnd", id: "a26d1", title: "MONTE A FRASE", sub: "Arraste ou toque nas peças na ordem correta.",
          slots: ["sujeito", "to be", "verbo + ing"],
          tokens: ["studying.", "is", "She"], answer: ["She", "is", "studying."] } ] },

      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 04" },
        { t: "title", en: "AGORA × TODO DIA", pt: "Present continuous × simple present." },
        { t: "grid", cols: 2, items: [
          { kicker: "AGORA", title: "I am working now.", body: "Neste momento.", v: "mint", c: "teal" },
          { kicker: "TODO DIA", title: "I work every day.", body: "Rotina, hábito.", v: "lilac", c: "purple" } ] },
        { t: "mc", title: "QUAL É A CORRETA?", v: "gray", questions: [
          { q: "Ela está estudando agora.", options: ["She studies now.", "She is studying now."], answer: 1 },
          { q: "Eu trabalho todos os dias.", options: ["I work every day.", "I am working every day."], answer: 0 },
          { q: "Está chovendo.", options: ["It rains.", "It is raining."], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 05" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete com o verbo no -ing." },
        { t: "fill", id: "a26e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1. I am", post: "English. (study)", answers: ["studying"], v: "mint" },
          { pre: "2. She is", post: "a book. (read)", answers: ["reading"], v: "lilac" },
          { pre: "3. They are", post: "soccer. (play)", answers: ["playing"], v: "cream" },
          { pre: "4. He is", post: "in the park. (run)", answers: ["running"], v: "mint" },
          { pre: "5. We are", post: "a letter. (write)", answers: ["writing"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 06" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "O que está acontecendo à sua volta?" },
        { t: "free", id: "a26f1", cols: 2, items: [
          { n: "1", kicker: "VOCÊ AGORA", prefix: "I am…", ideas: "Ex.: I am studying English.", v: "mint", c: "teal" },
          { n: "2", kicker: "ALGUÉM PERTO", prefix: "He / She is…", ideas: "Ex.: My brother is watching TV.", v: "lilac", c: "purple" },
          { n: "3", kicker: "O TEMPO", prefix: "It is…", ideas: "Ex.: It is raining.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a26c1", title: "EU CONSIGO...", items: [
          "usar am/is/are + verbo -ing.",
          "escrever o -ing corretamente.",
          "diferenciar agora de rotina." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 26", body: "Descrevendo cenas em tempo real.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Narre o que você está fazendo agora.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 27 — Present Continuous: Questions" } ] }
    ]
  },

  {
    id: 27, code: "AULA 27", title: "Present Continuous — Questions", sub: "Perguntar o que está acontecendo.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 27" },
        { t: "title", en: "ARE YOU …ING?", pt: "Perguntas e negativas no presente contínuo." },
        { t: "image", id: "a27p1", ph: "Ilustração: videochamada com pessoas em atividades" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Perguntar e negar ações em andamento." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 02" },
        { t: "title", en: "PERGUNTA E NEGATIVA", pt: "Mexe só no verb to be." },
        { t: "rule", v: "mint", c: "teal", kicker: "PERGUNTA", from: "to be na frente", to: "Are you working?", ex: "Is she studying?", tr: "Você está trabalhando?" },
        { t: "rule", v: "lilac", c: "purple", kicker: "NEGATIVA", from: "not depois do to be", to: "I’m not working.", ex: "He isn’t studying.", tr: "Não estou trabalhando." },
        { t: "rule", v: "cream", c: "yellow", kicker: "RESPOSTA CURTA", from: "repete o to be", to: "Yes, I am. / No, I’m not.", ex: "Yes, she is. / No, she isn’t.", tr: "Nunca contraia o yes." },
        { t: "note", v: "gray", bold: true, text: "COM WH-\nWhat are you doing? · Where is he going?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 03" },
        { t: "title", en: "LIGUE E ESCOLHA", pt: "Fixe a estrutura." },
        { t: "match", title: "LIGUE PERGUNTA E RESPOSTA (AULA 27)",
          left: ["Are you studying?", "Is he working?", "Are they playing?", "Is it raining?"],
          right: ["No, it isn’t.", "Yes, I am.", "Yes, they are.", "No, he isn’t."],
          answer: [1, 3, 2, 0] },
        { t: "mc", title: "QUAL É A CORRETA?", v: "gray", questions: [
          { q: "Ela está trabalhando?", options: ["Does she working?", "Is she working?"], answer: 1 },
          { q: "Eles não estão estudando.", options: ["They don’t studying.", "They aren’t studying."], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete as perguntas e negativas." },
        { t: "fill", id: "a27e1", title: "COMPLETE AS FRASES", items: [
          { pre: "1.", post: "you listening? (pergunta)", answers: ["are"], v: "mint" },
          { pre: "2.", post: "she cooking? (pergunta)", answers: ["is"], v: "lilac" },
          { pre: "3. I", post: "sleeping. (negativa)", answers: ["am not", "'m not", "’m not"], v: "cream" },
          { pre: "4. They", post: "working today. (negativa)", answers: ["aren't", "are not", "aren’t"], v: "mint" },
          { pre: "5. What", post: "you doing? (pergunta)", answers: ["are"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Faça perguntas sobre o momento." },
        { t: "free", id: "a27f1", cols: 2, items: [
          { n: "1", kicker: "UMA PERGUNTA", prefix: "Are you…?", ideas: "Ex.: Are you studying now?", v: "mint", c: "teal" },
          { n: "2", kicker: "SUA RESPOSTA", prefix: "Yes, I am. / No, I’m not.", ideas: "Responda sua própria pergunta.", v: "lilac", c: "purple" },
          { n: "3", kicker: "COM WH-", prefix: "What are you…?", ideas: "Ex.: What are you doing?", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a27c1", title: "EU CONSIGO...", items: [
          "perguntar com am/is/are na frente.",
          "negar com not depois do to be.",
          "responder de forma curta." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 27", body: "Diálogos em tempo real.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Pergunte à IA o que ela está fazendo.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 28 — Clothes" } ] }
    ]
  },

  {
    id: 28, code: "AULA 28", title: "Clothes", sub: "Roupas e como descrever o que vestimos.",
    time: "12 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 28" },
        { t: "title", en: "CLOTHES", pt: "O que você está vestindo hoje?" },
        { t: "image", id: "a28p1", ph: "Ilustração: arara de roupas variadas" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Nomear roupas e descrever o que alguém veste." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 02" },
        { t: "title", en: "O GUARDA-ROUPA BÁSICO", pt: "As peças mais usadas." },
        { t: "chips", items: [
          { t: "shirt", c: "mint" }, { t: "t-shirt", c: "lilac" }, { t: "pants", c: "cream" }, { t: "jeans", c: "mint" },
          { t: "dress", c: "lilac" }, { t: "skirt", c: "cream" }, { t: "shoes", c: "mint" }, { t: "socks", c: "lilac" },
          { t: "jacket", c: "cream" }, { t: "coat", c: "mint" }, { t: "hat", c: "lilac" }, { t: "shorts", c: "cream" } ] },
        { t: "note", v: "gray", bold: true, text: "SEMPRE NO PLURAL\npants · jeans · shorts · shoes · socks · glasses" } ] },

      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 03" },
        { t: "title", en: "COMO DESCREVER", pt: "wear, put on e be wearing." },
        { t: "rule", v: "mint", c: "teal", kicker: "ROTINA", from: "wear", to: "I wear a uniform.", ex: "She wears glasses.", tr: "Todo dia." },
        { t: "rule", v: "lilac", c: "purple", kicker: "AGORA", from: "be wearing", to: "I’m wearing jeans.", ex: "He is wearing a blue shirt.", tr: "Neste momento." },
        { t: "objective", v: "navy", title: "A ORDEM DAS PALAVRAS", text: "cor antes da peça: a white t-shirt · black shoes" } ] },

      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Escreva em inglês." },
        { t: "fill", id: "a28e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. camisa →", answers: ["shirt", "a shirt"], v: "mint" },
          { pre: "2. sapatos →", answers: ["shoes"], v: "lilac" },
          { pre: "3. vestido →", answers: ["dress", "a dress"], v: "cream" },
          { pre: "4. calça →", answers: ["pants", "trousers"], v: "mint" },
          { pre: "5. jaqueta →", answers: ["jacket", "a jacket"], v: "lilac" } ] },
        { t: "mc", title: "ESCOLHA A FRASE CORRETA", v: "gray", questions: [
          { q: "Estou usando uma camiseta branca.", options: ["I’m wearing a white t-shirt.", "I’m wearing a t-shirt white."], answer: 0 },
          { q: "Ela usa óculos.", options: ["She wears glasses.", "She wear glasses."], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Descreva o que você veste." },
        { t: "free", id: "a28f1", cols: 2, items: [
          { n: "1", kicker: "AGORA", prefix: "I’m wearing…", ideas: "Ex.: I’m wearing blue jeans.", v: "mint", c: "teal" },
          { n: "2", kicker: "NO TRABALHO", prefix: "At work, I wear…", ideas: "Ex.: At work, I wear a uniform.", v: "lilac", c: "purple" },
          { n: "3", kicker: "SUA PEÇA FAVORITA", prefix: "My favorite … is …", ideas: "Ex.: My favorite jacket is black.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a28c1", title: "EU CONSIGO...", items: [
          "nomear as roupas mais comuns.",
          "usar wear para rotina e be wearing para agora.",
          "colocar a cor antes da peça." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 28", body: "Roupas e compras em inglês.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva sua roupa de hoje.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 29 — Weather" } ] }
    ]
  },

  {
    id: 29, code: "AULA 29", title: "Weather", sub: "Falar do tempo e das estações.",
    time: "12 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 29" },
        { t: "title", en: "WEATHER", pt: "O assunto que começa qualquer conversa." },
        { t: "image", id: "a29p1", ph: "Ilustração: sol, chuva, neve e vento" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Descrever o tempo e as estações do ano." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 02" },
        { t: "title", en: "COMO ESTÁ O TEMPO?", pt: "Duas estruturas resolvem tudo." },
        { t: "rule", v: "mint", c: "teal", kicker: "1 · IT’S + ADJETIVO", from: "it’s", to: "It’s sunny.", ex: "It’s cold. · It’s hot.", tr: "Está ensolarado." },
        { t: "rule", v: "lilac", c: "purple", kicker: "2 · IT’S + VERBO -ING", from: "it’s …ing", to: "It’s raining.", ex: "It’s snowing.", tr: "Está chovendo." },
        { t: "chips", items: [
          { t: "sunny", c: "cream" }, { t: "cloudy", c: "mint" }, { t: "rainy", c: "lilac" }, { t: "windy", c: "cream" },
          { t: "hot", c: "mint" }, { t: "warm", c: "lilac" }, { t: "cold", c: "cream" }, { t: "cool", c: "mint" } ] },
        { t: "note", v: "gray", bold: true, text: "PERGUNTA PADRÃO\nWhat’s the weather like today?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 03" },
        { t: "title", en: "AS ESTAÇÕES", pt: "The four seasons." },
        { t: "grid", cols: 2, items: [
          { kicker: "SPRING", title: "primavera", body: "It’s warm and rainy.", v: "mint" },
          { kicker: "SUMMER", title: "verão", body: "It’s hot and sunny.", v: "cream" },
          { kicker: "FALL / AUTUMN", title: "outono", body: "It’s cool and windy.", v: "lilac" },
          { kicker: "WINTER", title: "inverno", body: "It’s cold.", v: "mint" } ] },
        { t: "match", title: "LIGUE A ESTAÇÃO (AULA 29)",
          left: ["spring", "summer", "fall", "winter"],
          right: ["inverno", "outono", "primavera", "verão"],
          answer: [2, 3, 1, 0] } ] },

      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete as frases." },
        { t: "fill", id: "a29e1", title: "COMPLETE EM INGLÊS", items: [
          { pre: "1. Está chovendo. → It’s", answers: ["raining"], v: "mint" },
          { pre: "2. Está frio. → It’s", answers: ["cold"], v: "lilac" },
          { pre: "3. Está ensolarado. → It’s", answers: ["sunny"], v: "cream" },
          { pre: "4. Está ventando. → It’s", answers: ["windy"], v: "mint" },
          { pre: "5. verão →", answers: ["summer"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 05" },
        { t: "title", en: "AGORA É COM VOCÊ", pt: "Fale do tempo onde você está." },
        { t: "free", id: "a29f1", cols: 2, items: [
          { n: "1", kicker: "HOJE", prefix: "Today it’s…", ideas: "Ex.: Today it’s hot and sunny.", v: "mint", c: "teal" },
          { n: "2", kicker: "SUA ESTAÇÃO FAVORITA", prefix: "My favorite season is…", ideas: "Ex.: My favorite season is winter.", v: "lilac", c: "purple" },
          { n: "3", kicker: "NA SUA CIDADE", prefix: "In my city, it’s usually…", ideas: "Ex.: In my city, it’s usually warm.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a29c1", title: "EU CONSIGO...", items: [
          "usar It’s + adjetivo.",
          "usar It’s + verbo -ing.",
          "nomear as quatro estações." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 29", body: "Previsão do tempo em inglês.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça uma previsão do tempo de 30 segundos.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 30 — Jobs" } ] }
    ]
  },

  {
    id: 30, code: "AULA 30", title: "Jobs", sub: "Profissões e o que cada um faz.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 30" },
        { t: "title", en: "JOBS", pt: "What do you do?" },
        { t: "image", id: "a30p1", ph: "Ilustração: pessoas de diferentes profissões" },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Dizer sua profissão e perguntar a de outra pessoa." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "13 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 02" },
        { t: "title", en: "AS PROFISSÕES MAIS COMUNS", pt: "Vocabulário de trabalho." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "teacher", b: "professor(a)", v: "mint" },
          { a: "doctor / nurse", b: "médico(a) / enfermeiro(a)", v: "lilac" },
          { a: "engineer", b: "engenheiro(a)", v: "cream" },
          { a: "driver", b: "motorista", v: "mint" },
          { a: "salesperson", b: "vendedor(a)", v: "lilac" },
          { a: "cook / chef", b: "cozinheiro(a)", v: "cream" },
          { a: "lawyer", b: "advogado(a)", v: "mint" },
          { a: "student", b: "estudante", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 03" },
        { t: "title", en: "COMO PERGUNTAR E RESPONDER", pt: "Três frases que resolvem." },
        { t: "grid", cols: 1, items: [
          { n: "1", kicker: "PERGUNTAR", title: "What do you do?", body: "O que você faz? (profissão)", v: "mint", c: "teal" },
          { n: "2", kicker: "RESPONDER", title: "I’m a teacher.", body: "Não esqueça o a / an.", v: "lilac", c: "purple" },
          { n: "3", kicker: "ONDE TRABALHA", title: "I work in a school.", body: "Eu trabalho em uma escola.", v: "cream", c: "yellow" } ] },
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Diga I’m a doctor. — não I’m doctor." } ] },

      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 04" },
        { t: "title", en: "PRÁTICA GUIADA", pt: "Complete as frases." },
        { t: "fill", id: "a30e1", title: "ESCREVA EM INGLÊS", items: [
          { pre: "1. professor →", answers: ["teacher", "a teacher"], v: "mint" },
          { pre: "2. enfermeira →", answers: ["nurse", "a nurse"], v: "lilac" },
          { pre: "3. motorista →", answers: ["driver", "a driver"], v: "cream" },
          { pre: "4. Eu sou engenheiro. → I’m", answers: ["an engineer"], v: "mint" },
          { pre: "5. Ela é advogada. → She’s", answers: ["a lawyer"], v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 05" },
        { t: "title", en: "MÓDULO 5 CONCLUÍDO!", pt: "Fale sobre o seu trabalho." },
        { t: "free", id: "a30f1", cols: 2, items: [
          { n: "1", kicker: "SUA PROFISSÃO", prefix: "I’m a / an…", ideas: "Ex.: I’m a student.", v: "mint", c: "teal" },
          { n: "2", kicker: "ONDE VOCÊ TRABALHA", prefix: "I work in / at…", ideas: "Ex.: I work in an office.", v: "lilac", c: "purple" },
          { n: "3", kicker: "ALGUÉM DA FAMÍLIA", prefix: "My … is a …", ideas: "Ex.: My mother is a nurse.", v: "cream", c: "yellow" } ] },
        { t: "check", id: "a30c1", title: "EU CONSIGO...", items: [
          "nomear profissões comuns.",
          "perguntar What do you do?",
          "usar a / an antes da profissão." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 30", body: "Apresentações profissionais em inglês.", plan: "Exclusivo do Plano Completo — Inglês em Ação.", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Apresente-se profissionalmente em 30 segundos.", plan: "Exclusivo do Plano Premium — Inglês Prático com IA.", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 6 — Passado", body: "O passado do verb to be e dos verbos regulares e irregulares." } ] }
    ]
  }
];

export const TRACK = [
  { n: 1, t: "Subject Pronouns" }, { n: 2, t: "Verb to be — Affirmative" }, { n: 3, t: "Verb to be — Negative" },
  { n: 4, t: "Verb to be — Interrogative" }, { n: 5, t: "Verb to be — Review" }, { n: 6, t: "Countries and Nationalities" },
  { n: 7, t: "Family" }, { n: 8, t: "Numbers 1–100" }, { n: 9, t: "Days and Months" }, { n: 10, t: "Colors and Shapes" },
  { n: 11, t: "Articles a / an / the" }, { n: 12, t: "Plural Nouns" }, { n: 13, t: "This / That / These / Those" },
  { n: 14, t: "Possessive Adjectives" }, { n: 15, t: "There is / There are" }, { n: 16, t: "Prepositions of Place" },
  { n: 17, t: "Simple Present — Affirmative" }, { n: 18, t: "Simple Present — Negative" }, { n: 19, t: "Simple Present — Questions" },
  { n: 20, t: "Adverbs of Frequency" }, { n: 21, t: "Daily Routine" }, { n: 22, t: "Telling the Time" },
  { n: 23, t: "Food and Drinks" }, { n: 24, t: "Can / Can’t" }, { n: 25, t: "Imperatives" }, { n: 26, t: "Present Continuous" },
  { n: 27, t: "Present Continuous — Questions" }, { n: 28, t: "Clothes" }, { n: 29, t: "Weather" }, { n: 30, t: "Jobs" },
  { n: 31, t: "Simple Past — to be" }, { n: 32, t: "Simple Past — Regular Verbs" }, { n: 33, t: "Simple Past — Irregular Verbs" },
  { n: 34, t: "Past Questions" }, { n: 35, t: "Countable / Uncountable" }, { n: 36, t: "Some / Any" },
  { n: 37, t: "Comparatives" }, { n: 38, t: "Superlatives" }, { n: 39, t: "Going to — Future" }, { n: 40, t: "Will — Future" },
  { n: 41, t: "Object Pronouns" }, { n: 42, t: "Final Review" }
];
