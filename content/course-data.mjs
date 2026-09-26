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
        { t: "mc", id: "a1mc1", title: "TESTE RELÂMPAGO", v: "cream", questions: [
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
        { t: "mc", id: "a1mc2", title: "PENSE RAPIDAMENTE", v: "cream", questions: [
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
        { t: "mc", id: "a1mc3", title: "ESCOLHA EM 2 PASSOS", v: "cream", questions: [
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
        { t: "match", id: "a1match1", title: "LIGUE O PRONOME AO SIGNIFICADO",
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
          { icon: "play", v: "mint", title: "ASSISTA À VIDEOAULA", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Escute, responda e receba sugestões para melhorar.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 02 · Verb to be: Affirmative" } ] }
    ]
  },

  {
    id: 2, code: "AULA 02", title: "Verb to be: Affirmative", sub: "Frases afirmativas com am, is e are.",
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
        { t: "meta", label: "TEMPO ESTIMADO", value: "12 a 15 min" },
        { t: "note", v: "gray", bold: true, text: "Siga com calma.\nVocê não precisa decorar tudo agora: primeiro, observe as combinações." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
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
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
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
        { t: "objective", v: "navy", title: "ATENÇÃO AO APÓSTROFO", text: "Ele faz parte da forma curta. Escreva I’m, não Im. Escreva She’s, não Shes." },
        { t: "note", v: "gray", kicker: "PARA LEMBRAR", bold: true, text: "Em uma conversa, You’re, He’s e We’re soam mais naturais." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
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
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
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
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
        { t: "title", en: "CONFIRA E FALE", pt: "Gabarito da prática guiada" },
        { t: "objective", v: "navy", title: "COMO CONFERIR", text: "Veja o verbo em destaque. Depois, leia a frase inteira em voz alta." },
        { t: "pron", code: "I + am", pt: "PADRÃO 1", c: "teal", v: "mint", title: "I am Brazilian.", body: "I / am / Brazilian." },
        { t: "pron", code: "he · she · it + is", pt: "PADRÃO 2", c: "purple", v: "lilac", title: "He is an engineer. · She is a singer. · It is in France.", body: "it = The Eiffel Tower" },
        { t: "pron", code: "you · we · they + are", pt: "PADRÃO 3", c: "yellow", v: "cream", title: "You are from France. · We are friends. · You are good students. · They are happy.", body: "you = plural nesta frase" },
        { t: "objective", v: "navy", title: "MINIPRÁTICA ORAL", text: "Leia cada frase em 3 batidas:  She / is / a singer." } ] },

      { blocks: [
        { t: "badge", label: "AULA 02" },
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
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
        { t: "kicker", text: "VERB TO BE: AFFIRMATIVE" },
        { t: "title", en: "AULA CONCLUÍDA!", pt: "Você já pode formar frases afirmativas com o verb to be." },
        { t: "check", id: "a2c1", title: "EU CONSIGO...", items: [
          "Escolher am, is ou are conforme o sujeito.",
          "Reconhecer e usar formas curtas, como I’m e They’re.",
          "Escrever quatro frases afirmativas sobre o meu mundo." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 02", body: "Acompanhe os exemplos e revise o conteúdo no seu ritmo.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "TOQUE PARA ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga suas quatro frases e receba feedback de pronúncia e clareza.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "TOQUE PARA PRATICAR COM A IA", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO PASSO", title: "Aula 03 · Verb to be: Negative", body: "Você aprenderá a dizer o que alguém não é e o que não está." } ] }
    ]
  },

  {
    id: 3, code: "AULA 03", title: "Verb to be: Negative", sub: "Frases negativas com am not, isn’t e aren’t.",
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
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 a 18 min" },
        { t: "note", v: "gray", bold: true, text: "Uma palavra faz a diferença.\nVocê vai aprender a inserir not no lugar certo e a falar com segurança." } ] },

      { blocks: [
        { t: "badge", label: "AULA 03", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA DA FRASE NEGATIVA", pt: "Uma palavra muda o sentido: not." },
        { t: "note", v: "gray", bar: true, kicker: "REGRA CENTRAL", bold: true, text: "Para negar uma informação, coloque not logo depois de am, is ou are." },
        { t: "chips", items: [
          { t: "SUJEITO", c: "mint" }, { t: "AM / IS / ARE", c: "lilac" }, { t: "NOT", c: "cream" }, { t: "INFORMAÇÃO", c: "lilac" } ] },
        { t: "objective", v: "navy", title: "VEJA A TRANSFORMAÇÃO", text: "1. She is a dentist. → Ela é dentista.\n2. She is not a dentist. → Ela não é dentista." },
        { t: "objective", v: "mint", title: "GUARDE ISTO", text: "O not nunca vem antes do verb to be. Diga: She is not… • Não diga: She not is…" },
        { t: "mc", id: "a3mc1", title: "MINI-CHECAGEM", v: "gray", questions: [
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
        { t: "mc", id: "a3mc2", title: "ESCOLHA A FRASE CORRETA", v: "gray", questions: [
          { q: "Ele não é meu irmão.", options: ["He doesn’t is my brother.", "He isn’t my brother."], answer: 1, explain: "Com o verb to be, use not, nunca don’t/doesn’t." },
          { q: "Nós não estamos em casa.", options: ["We aren’t at home.", "We don’t are at home."], answer: 0 } ] },
        { t: "key", v: "navy", text: "Viu am, is ou are? Use not, e não don’t/doesn’t." } ] },

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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 03", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga três frases negativas. Peça que a IA confirme se você usou a forma correta.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 04 · Verb to be: Interrogative", body: "Você aprenderá a fazer perguntas com am, is e are." } ] }
    ]
  }
  ,{
    id: 4, code: "AULA 04", title: "Verb to be: Interrogative", sub: "Perguntas com am, is e are.",
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
        { t: "objective", v: "red", title: "ATENÇÃO À CONTRAÇÃO", text: "Na resposta afirmativa, não contraia. Diga: Yes, I am. Nunca: Yes, I’m." },
        { t: "match", id: "a4match1", title: "LIGUE A PERGUNTA À RESPOSTA CURTA (AULA 04)",
          left: ["Are you tired?", "Is he your brother?", "Are they students?", "Is it new?"],
          right: ["Yes, they are.", "Yes, I am.", "No, it isn’t.", "Yes, he is."],
          answer: [1, 3, 0, 2] } ] },

      { blocks: [
        { t: "badge", label: "AULA 04", page: "PÁGINA 04" },
        { t: "title", en: "ATENÇÃO, BRASILEIRO!", pt: "Um erro comum tem uma correção simples." },
        { t: "objective", v: "red", title: "NÃO USE do / does", text: "para perguntar com am, is ou are." },
        { t: "compare", items: [
          { wrong: "Do you are Brazilian?", note: "O verb to be já forma a pergunta.", right: "Are you Brazilian?", rnote: "Você é brasileiro(a)?" },
          { wrong: "Does she is a doctor?", right: "Is she a doctor?", rnote: "Ela é médica?" } ] },
        { t: "mc", id: "a4mc1", title: "ESCOLHA A PERGUNTA CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 04", body: "Veja a entonação das perguntas com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça três perguntas e receba feedback de pronúncia.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 05 · Verb to be: Review", body: "As três formas juntas: afirmativa, negativa e interrogativa." } ] }
    ]
  },

  {
    id: 5, code: "AULA 05", title: "Verb to be: Review", sub: "Afirmativa, negativa e interrogativa juntas.",
    time: "18 a 20 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 05" },
        { t: "title", en: "VERB TO BE: REVIEW", pt: "As três formas do verb to be em uma só aula." },
        { t: "kicker", text: "AFFIRMATIVE + NEGATIVE + INTERROGATIVE" },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Nas aulas anteriores, você aprendeu a usar o verb to be nas formas afirmativa, negativa e interrogativa.\nAgora chegou a hora de juntar tudo e usar as três formas com confiança!" },
        { t: "image", id: "a5p1", ph: "Foto: um rapaz de jaqueta jeans e uma moça de blusa amarela conversando sentados à mesa de um café, com copos de café e um caderno sobre a mesa." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { kicker: "AFIRMAR", title: "I am happy.", body: "Eu sou, ele é, ela é, nós somos, vocês são, eles são.", v: "mint", c: "teal" },
          { kicker: "NEGAR", title: "I am not tired.", body: "Eu não sou, ele não é, ela não é, nós não somos, vocês não são, eles não são.", v: "red", c: "red" },
          { kicker: "PERGUNTAR", title: "Are you ready?", body: "Eu sou?, ele é?, ela é?, nós somos?, vocês são?, eles são?", v: "lilac", c: "purple" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Ao final desta aula, você será capaz de usar o verb to be para afirmar, negar e perguntar em diferentes situações do dia a dia, de forma natural e correta." },
        { t: "meta", label: "DURAÇÃO ESTIMADA", value: "18 a 20 minutos" },
        { t: "meta", label: "VÍDEO DA AULA", value: "Assista à videoaula 05 para revisar e praticar." },
        { t: "note", v: "cream", bar: true, bold: true, text: "Você já aprendeu muito! Vamos revisar, praticar e dar mais um passo importante na sua jornada no inglês. Conto com você!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 02" },
        { t: "title", en: "O MAPA DO VERB TO BE", pt: "O verbo muda de acordo com a intenção da frase." },
        { t: "lead", text: "O verb to be muda de acordo com a intenção da frase. Veja como usamos nas três formas:" },
        { t: "sec", text: "1 · AFFIRMATIVE (AFIRMATIVA) · USAMOS PARA AFIRMAR ALGO." },
        { t: "table", head: ["AFFIRMATIVE · AFIRMATIVA", "TRADUÇÃO"], rows: [
          { a: "I am happy.", b: "Eu estou feliz.", note: "I", v: "mint" },
          { a: "He is tall.", b: "Ele é alto.", note: "he", v: "mint" },
          { a: "She is kind.", b: "Ela é gentil.", note: "she", v: "mint" },
          { a: "It is a cat.", b: "Isso é um gato.", note: "it", v: "mint" },
          { a: "You are my friend.", b: "Você é meu amigo.", note: "you", v: "mint" },
          { a: "We are ready.", b: "Nós estamos prontos.", note: "we", v: "mint" },
          { a: "They are here.", b: "Eles estão aqui.", note: "they", v: "mint" } ] },
        { t: "sec", text: "2 · NEGATIVE (NEGATIVA) · USAMOS PARA NEGAR ALGO." },
        { t: "table", head: ["NEGATIVE · NEGATIVA", "TRADUÇÃO"], rows: [
          { a: "I am not happy.", b: "Eu não estou feliz.", note: "I", v: "red" },
          { a: "He isn’t tall.", b: "Ele não é alto.", note: "he", v: "red" },
          { a: "She isn’t kind.", b: "Ela não é gentil.", note: "she", v: "red" },
          { a: "It isn’t a cat.", b: "Isso não é um gato.", note: "it", v: "red" },
          { a: "You aren’t my friend.", b: "Você não é meu amigo.", note: "you", v: "red" },
          { a: "We aren’t ready.", b: "Nós não estamos prontos.", note: "we", v: "red" },
          { a: "They aren’t here.", b: "Eles não estão aqui.", note: "they", v: "red" } ] },
        { t: "sec", text: "3 · INTERROGATIVE (INTERROGATIVA) · USAMOS PARA FAZER PERGUNTAS." },
        { t: "table", head: ["INTERROGATIVE · INTERROGATIVA", "TRADUÇÃO"], rows: [
          { a: "Am I happy?", b: "Eu estou feliz?", note: "I", v: "lilac" },
          { a: "Is he tall?", b: "Ele é alto?", note: "he", v: "lilac" },
          { a: "Is she kind?", b: "Ela é gentil?", note: "she", v: "lilac" },
          { a: "Is it a cat?", b: "Isso é um gato?", note: "it", v: "lilac" },
          { a: "Are you my friend?", b: "Você é meu amigo?", note: "you", v: "lilac" },
          { a: "Are we ready?", b: "Nós estamos prontos?", note: "we", v: "lilac" },
          { a: "Are they here?", b: "Eles estão aqui?", note: "they", v: "lilac" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA DE OURO", bold: true, text: "Na pergunta, o verbo vem antes do sujeito.\nEx.: You are late. → Are you late?" },
        { t: "sec", text: "LEMBRE-SE!" },
        { t: "rows", items: [
          { text: "Affirmative: sujeito + am / is / are + complemento.", c: "teal" },
          { text: "Negative: sujeito + am / is / are + not + complemento.", c: "red" },
          { text: "Interrogative: am / is / are + sujeito + complemento?", c: "purple" } ] },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Vamos praticar com frases que mostram as três intenções." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 03" },
        { t: "title", en: "AM, IS OU ARE?", pt: "O verbo muda de acordo com o sujeito nas três formas." },
        { t: "lead", text: "O verbo to be muda de acordo com o sujeito em todas as três formas. Veja o resumo abaixo." },
        { t: "sec", text: "1 · AFFIRMATIVE (AFIRMATIVA)" },
        { t: "table", head: ["AFFIRMATIVE · AFIRMATIVA", "TRADUÇÃO"], rows: [
          { a: "I am happy.", b: "Eu estou feliz.", note: "I", v: "mint" },
          { a: "He is a student.", b: "Ele é um aluno.", note: "he", v: "mint" },
          { a: "She is kind.", b: "Ela é gentil.", note: "she", v: "mint" },
          { a: "It is a cat.", b: "Isso é um gato.", note: "it", v: "mint" },
          { a: "You are my friend.", b: "Você é meu amigo.", note: "you", v: "mint" },
          { a: "We are ready.", b: "Nós estamos prontos.", note: "we", v: "mint" },
          { a: "They are here.", b: "Eles estão aqui.", note: "they", v: "mint" } ] },
        { t: "sec", text: "2 · NEGATIVE (NEGATIVA)" },
        { t: "table", head: ["NEGATIVE · NEGATIVA", "TRADUÇÃO"], rows: [
          { a: "I am not happy.", b: "Eu não estou feliz.", note: "I", v: "red" },
          { a: "He isn’t a student.", b: "Ele não é um aluno.", note: "he", v: "red" },
          { a: "She isn’t kind.", b: "Ela não é gentil.", note: "she", v: "red" },
          { a: "It isn’t a cat.", b: "Isso não é um gato.", note: "it", v: "red" },
          { a: "You aren’t my friend.", b: "Você não é meu amigo.", note: "you", v: "red" },
          { a: "We aren’t ready.", b: "Nós não estamos prontos.", note: "we", v: "red" },
          { a: "They aren’t here.", b: "Eles não estão aqui.", note: "they", v: "red" } ] },
        { t: "sec", text: "3 · INTERROGATIVE (INTERROGATIVA)" },
        { t: "table", head: ["INTERROGATIVE · INTERROGATIVA", "TRADUÇÃO"], rows: [
          { a: "Am I happy?", b: "Eu estou feliz?", note: "I", v: "lilac" },
          { a: "Is he a student?", b: "Ele é um aluno?", note: "he", v: "lilac" },
          { a: "Is she kind?", b: "Ela é gentil?", note: "she", v: "lilac" },
          { a: "Is it a cat?", b: "Isso é um gato?", note: "it", v: "lilac" },
          { a: "Are you my friend?", b: "Você é meu amigo?", note: "you", v: "lilac" },
          { a: "Are we ready?", b: "Nós estamos prontos?", note: "we", v: "lilac" },
          { a: "Are they here?", b: "Eles estão aqui?", note: "they", v: "lilac" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA DE OURO", bold: true, text: "Para escolher entre am, is e are, pense no sujeito da frase." },
        { t: "image", id: "a5p3", ph: "Ilustração: menino de camiseta azul com a mão no queixo, pensando, e um balão de pensamento ao lado com as palavras I? he? they?" },
        { t: "rule", v: "cream", c: "yellow", kicker: "DICA RÁPIDA · 1", from: "I", to: "am", ex: "I am happy.", tr: "Eu estou feliz." },
        { t: "rule", v: "mint", c: "teal", kicker: "DICA RÁPIDA · 2", from: "he · she · it", to: "is", ex: "She is kind.", tr: "Ela é gentil." },
        { t: "rule", v: "lilac", c: "purple", kicker: "DICA RÁPIDA · 3", from: "you · we · they", to: "are", ex: "They are here.", tr: "Eles estão aqui." },
        { t: "note", v: "lilac", kicker: "VAMOS PRATICAR?", text: "Nas próximas páginas, você vai usar as três formas do verb to be em diferentes situações do dia a dia." },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Você vai ver como mudar a intenção da frase: afirmar, negar e perguntar." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 04" },
        { t: "title", en: "UMA IDEIA, TRÊS INTENÇÕES", pt: "A mesma situação pode ser afirmada, negada ou perguntada." },
        { t: "lead", text: "A mesma situação pode ser afirmada, negada ou perguntada. Veja os exemplos abaixo:" },
        { t: "sec", text: "AFIRMAR (AFFIRMATIVE) · NEGAR (NEGATIVE) · PERGUNTAR (INTERROGATIVE)" },
        { t: "cards", cols: 1, items: [
          { tag: "01 · AT HOME", c: "teal", v: "mint", id: "a5p4a", ph: "Foto: sala de estar clara e aconchegante, com sofá bege, almofadas, mesa de centro e plantas.",
            lines: ["I am at home.", "I am not at home.", "Am I at home?"],
            note: "Eu estou em casa. · Eu não estou em casa. · Eu estou em casa?" },
          { tag: "02 · HUNGRY", c: "purple", v: "lilac", id: "a5p4b", ph: "Foto: jovem de blusa amarela sentada à mesa, sorrindo enquanto come uma fatia de pizza.",
            lines: ["She is hungry.", "She isn’t hungry.", "Is she hungry?"],
            note: "Ela está com fome. · Ela não está com fome. · Ela está com fome?" },
          { tag: "03 · FRIENDS", c: "teal", v: "mint", id: "a5p4c", ph: "Foto: dois rapazes sentados frente a frente conversando e sorrindo, um de jaqueta jeans e outro de moletom verde.",
            lines: ["They are friends.", "They aren’t friends.", "Are they friends?"],
            note: "Eles são amigos. · Eles não são amigos. · Eles são amigos?" },
          { tag: "04 · COLD", c: "purple", v: "lilac", id: "a5p4d", ph: "Foto: parque coberto de neve, com árvores sem folhas, um banco e um poste de luz.",
            lines: ["It is very cold.", "It isn’t very cold.", "Is it very cold?"],
            note: "Está muito frio. · Não está muito frio. · Está muito frio?" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA IMPORTANTE", bold: true, text: "A intenção da frase muda a estrutura." },
        { t: "rows", items: [
          { text: "Afirmar → sujeito + am / is / are + complemento.", c: "teal" },
          { text: "Negar → sujeito + am / is / are + not + complemento.", c: "red" },
          { text: "Perguntar → am / is / are + sujeito + complemento?", c: "purple" } ] },
        { t: "image", id: "a5p4e", ph: "Ilustração: menino de camiseta roxa sorrindo com o dedo indicador levantado e um balão de fala ao lado com a frase Mude a intenção, mude a forma!" },
        { t: "mc", id: "a5mc2", title: "A · ESCOLHA A INTENÇÃO CORRETA PARA CADA SITUAÇÃO", v: "gray", questions: [
          { q: "01. Você quer saber se ele é professor.", options: ["Afirmar", "Negar", "Perguntar"], answer: 2, explain: "Você quer saber algo, então a frase vira pergunta: Is he a teacher?" },
          { q: "02. Você diz que não está cansado.", options: ["Afirmar", "Negar", "Perguntar"], answer: 1, explain: "Você nega algo: I am not tired." },
          { q: "03. Você diz que eles estão aqui.", options: ["Afirmar", "Negar", "Perguntar"], answer: 0, explain: "Você afirma algo: They are here." },
          { q: "04. Você pergunta se ela está feliz.", options: ["Afirmar", "Negar", "Perguntar"], answer: 2, explain: "Você quer saber algo: Is she happy?" } ] },
        { t: "note", v: "lilac", kicker: "VAMOS PRATICAR!", text: "Nas próximas páginas, você vai transformar frases, completar diálogos e escrever com as três formas do verb to be." },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Vamos ver diálogos curtos com as três intenções juntas!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 05" },
        { t: "title", en: "CONVERSAÇÃO REAL", pt: "As três formas do verb to be nas conversas do dia a dia." },
        { t: "lead", text: "Nas conversas do dia a dia, usamos as três formas do verb to be o tempo todo. Veja os diálogos abaixo:" },
        { t: "sec", text: "1 · EM CASA" },
        { t: "image", id: "a5p5a", ph: "Foto: rapaz de moletom verde falando ao celular na rua, sorrindo, com prédios ao fundo." },
        { t: "dialogue", items: [
          { s: "a", text: "Are you at home?" },
          { s: "b", text: "No, I’m not. I’m at work." },
          { s: "a", text: "Is your brother home?" },
          { s: "b", text: "Yes, he is." } ] },
        { t: "sec", text: "2 · NO CAFÉ" },
        { t: "image", id: "a5p5b", ph: "Foto: duas jovens conversando e sorrindo em um café, cada uma com um copo de café na mão." },
        { t: "dialogue", items: [
          { s: "a", text: "Is this coffee hot?" },
          { s: "b", text: "No, it isn’t. It’s warm." },
          { s: "a", text: "Are you ready to order?" },
          { s: "b", text: "Yes, we are." } ] },
        { t: "sec", text: "3 · NA ESCOLA" },
        { t: "image", id: "a5p5c", ph: "Foto: três rapazes sentados à mesa de uma sala de aula, conversando com cadernos abertos à frente." },
        { t: "dialogue", items: [
          { s: "a", text: "Are they your classmates?" },
          { s: "b", text: "Yes, they are." },
          { s: "a", text: "Is the class interesting?" },
          { s: "b", text: "Yes, it is!" } ] },
        { t: "fill", id: "a5e2", title: "A · COMPLETE OS DIÁLOGOS COM A FORMA CORRETA DO VERB TO BE", sub: "Exemplo resolvido: A: Are you from Brazil? → B: Yes, I am.", items: [
          { pre: "02. A:", answers: ["Is"], post: "your sister a doctor?", v: "mint" },
          { pre: "02. B: No, she", answers: ["isn’t", "isn't", "is not"], post: ".", v: "mint" },
          { pre: "03. A:", answers: ["Is"], post: "the weather nice today?", v: "lilac" },
          { pre: "03. B: Yes, it", answers: ["is"], post: ".", v: "lilac" },
          { pre: "04. A:", answers: ["Are"], post: "you and your friends free?", v: "cream" },
          { pre: "04. B: No, we", answers: ["aren’t", "aren't", "are not"], post: ".", v: "cream" },
          { pre: "05. A:", answers: ["Is"], post: "he at the gym now?", v: "mint" },
          { pre: "05. B: Yes, he", answers: ["is"], post: ".", v: "mint" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA RÁPIDA", bold: true, text: "Para conversar bem, pratique as três formas: afirmar (.), negar (n’t) e perguntar (?).\nAssim, você se entende em qualquer situação!" },
        { t: "image", id: "a5p5d", ph: "Ilustração: menina de camiseta roxa com o dedo indicador levantado e um balão de fala ao lado com as frases Yes, I am. No, I’m not. Are you ready?" },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Vamos encontrar e corrigir erros comuns com o verb to be." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 06" },
        { t: "title", en: "CUIDADO COM OS ERROS MAIS COMUNS", pt: "Veja os erros mais frequentes e como corrigir." },
        { t: "lead", text: "Muitos alunos ainda confundem o verbo to be com outros verbos. Veja os erros mais frequentes e como corrigir:" },
        { t: "compare", items: [
          { wrong: "She are happy.", note: "“She” é terceira pessoa, usa is.", right: "She is happy.", rnote: "“She” + is." },
          { wrong: "I isn’t tired.", note: "“I” usa am, não is.", right: "I am not tired.", rnote: "“I” + am not." },
          { wrong: "Are he at home?", note: "Na pergunta, o verbo vem antes do sujeito.", right: "Is he at home?", rnote: "Pergunta com he → is." },
          { wrong: "They is here.", note: "“They” usa are.", right: "They are here.", rnote: "“They” + are." },
          { wrong: "Does she is a teacher?", note: "Não usamos does / doesn’t com o verb to be.", right: "Is she a teacher?", rnote: "Pergunta com she → is." } ] },
        { t: "fill", id: "a5e3", wide: true, title: "A · ENCONTRE E CORRIJA O ERRO EM CADA FRASE", sub: "Reescreva a frase inteira já corrigida.", items: [
          { pre: "01. Are she a student?", answers: ["Is she a student?"], v: "mint" },
          { pre: "02. I are from Spain.", answers: ["I am from Spain.", "I’m from Spain.", "I'm from Spain."], v: "lilac" },
          { pre: "03. He am my brother.", answers: ["He is my brother.", "He’s my brother.", "He's my brother."], v: "cream" },
          { pre: "04. They isn’t at school.", answers: ["They aren’t at school.", "They aren't at school.", "They are not at school.", "They’re not at school.", "They're not at school."], v: "mint" },
          { pre: "05. Is you ready?", answers: ["Are you ready?"], v: "lilac" },
          { pre: "06. We is happy today.", answers: ["We are happy today.", "We’re happy today.", "We're happy today."], v: "cream" },
          { pre: "07. Are it cold outside?", answers: ["Is it cold outside?"], v: "mint" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA DE OURO", bold: true, text: "Sempre pense primeiro no sujeito da frase. Depois escolha: am, is ou are." },
        { t: "chips", title: "OS TRÊS PASSOS", items: [
          { t: "1. QUEM É O SUJEITO?", c: "blue" },
          { t: "2. QUAL FORMA USAR?", c: "purple" },
          { t: "3. AFIRMAR, NEGAR OU PERGUNTAR?", c: "teal" } ] },
        { t: "image", id: "a5p6", ph: "Ilustração: troféu dourado com brilhos ao redor, ao lado dos três passos para escolher a forma do verb to be." },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Você vai escolher a forma correta do verb to be de acordo com a intenção da frase." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 07" },
        { t: "title", en: "ESCOLHA A INTENÇÃO CORRETA", pt: "Para cada situação, escolha afirmar, negar ou perguntar." },
        { t: "lead", text: "Na comunicação, a intenção muda tudo! Para cada situação, escolha se você deve afirmar, negar ou perguntar e complete a frase corretamente." },
        { t: "grid", cols: 3, items: [
          { kicker: "AFIRMAR", title: "Você diz que algo é verdade.", v: "mint", c: "teal" },
          { kicker: "NEGAR", title: "Você diz que algo não é verdade.", v: "red", c: "red" },
          { kicker: "PERGUNTAR", title: "Você quer saber algo.", v: "lilac", c: "purple" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Pense na situação e escolha a melhor intenção!" },
        { t: "steps", items: [
          { n: "1", tag: "SITUAÇÃO 01", c: "teal", v: "mint", id: "a5p7a", ph: "Foto: mulher sentada no sofá da sala, lendo um livro aberto, com uma planta ao fundo.",
            lines: ["Você quer dizer que está em casa agora."],
            note: "A · Afirmar: I ____ at home now.   B · Negar: I ____ at home now.   C · Perguntar: ____ I at home now?" },
          { n: "2", tag: "SITUAÇÃO 02", c: "purple", v: "lilac", id: "a5p7b", ph: "Foto: rapaz de casaco e mochila em pé na calçada, olhando para o lado, com árvores desfocadas ao fundo.",
            lines: ["Você quer dizer que não está com fome."],
            note: "A · Afirmar: I ____ hungry.   B · Negar: I ____ hungry.   C · Perguntar: ____ I hungry?" },
          { n: "3", tag: "SITUAÇÃO 03", c: "teal", v: "mint", id: "a5p7c", ph: "Foto: duas mulheres conversando e sorrindo em uma mesa de café ao ar livre, uma apontando para a outra.",
            lines: ["Você quer saber se ela é sua amiga."],
            note: "A · Afirmar: She ____ your friend.   B · Negar: She ____ your friend.   C · Perguntar: ____ she your friend?" },
          { n: "4", tag: "SITUAÇÃO 04", c: "purple", v: "lilac", id: "a5p7d", ph: "Foto: homem de óculos e camisa azul trabalhando em um notebook sobre a mesa, concentrado.",
            lines: ["Você quer dizer que eles não estão no trabalho hoje."],
            note: "A · Afirmar: They ____ at work today.   B · Negar: They ____ at work today.   C · Perguntar: ____ they at work today?" },
          { n: "5", tag: "SITUAÇÃO 05", c: "teal", v: "mint", id: "a5p7e", ph: "Foto: mulher de touca e cachecol na rua em um dia de neve, abraçando os próprios braços de frio.",
            lines: ["Você quer saber se ele está com frio."],
            note: "A · Afirmar: He ____ cold.   B · Negar: He ____ cold.   C · Perguntar: ____ he cold?" } ] },
        { t: "mc", id: "a5mc3", title: "1 · ESCOLHA A MELHOR INTENÇÃO PARA CADA SITUAÇÃO", v: "gray", questions: [
          { q: "01. Você quer dizer que está em casa agora.", options: ["Afirmar", "Negar", "Perguntar"], answer: 0, explain: "Você afirma algo sobre você: I am at home now." },
          { q: "02. Você quer dizer que não está com fome.", options: ["Afirmar", "Negar", "Perguntar"], answer: 1, explain: "Você nega algo: I am not hungry." },
          { q: "03. Você quer saber se ela é sua amiga.", options: ["Afirmar", "Negar", "Perguntar"], answer: 2, explain: "Você quer saber algo: Is she your friend?" },
          { q: "04. Você quer dizer que eles não estão no trabalho hoje.", options: ["Afirmar", "Negar", "Perguntar"], answer: 1, explain: "Você nega algo: They aren’t at work today." },
          { q: "05. Você quer saber se ele está com frio.", options: ["Afirmar", "Negar", "Perguntar"], answer: 2, explain: "Você quer saber algo: Is he cold?" } ] },
        { t: "fill", id: "a5e4", title: "2 · AGORA COMPLETE A FRASE DA INTENÇÃO QUE VOCÊ ESCOLHEU", items: [
          { pre: "01. I", answers: ["am"], post: "at home now.", note: "afirmar · am / is / are", v: "mint" },
          { pre: "02. I", answers: ["am not"], post: "hungry.", note: "negar · am not / isn’t / aren’t", v: "red" },
          { pre: "03.", answers: ["Is"], post: "she your friend?", note: "perguntar · Am / Is / Are", v: "lilac" },
          { pre: "04. They", answers: ["aren’t", "aren't", "are not"], post: "at work today.", note: "negar · am not / isn’t / aren’t", v: "red" },
          { pre: "05.", answers: ["Is"], post: "he cold?", note: "perguntar · Am / Is / Are", v: "lilac" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA DE OURO", bold: true, text: "Antes de falar, pense:" },
        { t: "rows", items: [
          { text: "Quero afirmar? → uso am / is / are.", c: "teal" },
          { text: "Quero negar? → uso am not / isn’t / aren’t.", c: "red" },
          { text: "Quero perguntar? → coloco am / is / are antes do sujeito.", c: "purple" } ] },
        { t: "image", id: "a5p7f", ph: "Ilustração: menino de camiseta azul com a mão no queixo e um balão de pensamento ao lado com a frase O que eu quero fazer com esta frase?" },
        { t: "note", v: "lilac", kicker: "VAMOS PRATICAR!", text: "Na próxima página, complete diálogos usando as três formas do verb to be." },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Você vai completar diálogos reais com afirmar, negar e perguntar." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 08" },
        { t: "title", en: "DESAFIO INTEGRADO", pt: "Use tudo junto: complete, transforme e escreva." },
        { t: "image", id: "a5p8", ph: "Foto: três jovens sentados à mesa de uma biblioteca, conversando e sorrindo, com livros e cadernos abertos e um copo de café sobre a mesa." },
        { t: "lead", text: "Agora é a hora de usar tudo junto! Complete diálogos, transforme frases e escreva com as três formas do verb to be." },
        { t: "fill", id: "a5e5", title: "A · COMPLETE OS DIÁLOGOS 01 A 03 COM A FORMA CORRETA DO VERB TO BE", items: [
          { pre: "01. A:", answers: ["Are"], post: "you a student?", v: "mint" },
          { pre: "01. B: Yes, I", answers: ["am"], post: ".", v: "mint" },
          { pre: "01. A:", answers: ["Is"], post: "your school far?", v: "mint" },
          { pre: "01. B: No, it", answers: ["isn’t", "isn't", "is not"], post: ".", v: "mint" },
          { pre: "02. A:", answers: ["Is"], post: "this your book?", v: "lilac" },
          { pre: "02. B: No, it", answers: ["isn’t", "isn't", "is not"], post: ".", v: "lilac" },
          { pre: "02. A:", answers: ["Are"], post: "they your books?", v: "lilac" },
          { pre: "02. B: Yes, they", answers: ["are"], post: ".", v: "lilac" },
          { pre: "03. A:", answers: ["Are"], post: "you tired?", v: "cream" },
          { pre: "03. B: Yes, I", answers: ["am"], post: ".", v: "cream" },
          { pre: "03. A:", answers: ["Is"], post: "your friend tired too?", v: "cream" },
          { pre: "03. B: No, he", answers: ["isn’t", "isn't", "is not"], post: ".", v: "cream" } ] },
        { t: "fill", id: "a5e6", title: "A · COMPLETE OS DIÁLOGOS 04 A 06 COM A FORMA CORRETA DO VERB TO BE", items: [
          { pre: "04. A:", answers: ["Is"], post: "the bank near here?", v: "mint" },
          { pre: "04. B: Yes, it", answers: ["is"], post: ".", v: "mint" },
          { pre: "04. A:", answers: ["Are"], post: "the restaurants near here?", v: "mint" },
          { pre: "04. B: Yes, they", answers: ["are"], post: ".", v: "mint" },
          { pre: "05. A:", answers: ["Are"], post: "they at the gym?", v: "lilac" },
          { pre: "05. B: No, they", answers: ["aren’t", "aren't", "are not"], post: ".", v: "lilac" },
          { pre: "05. A:", answers: ["Are"], post: "they at home?", v: "lilac" },
          { pre: "05. B: Yes, they", answers: ["are"], post: ".", v: "lilac" },
          { pre: "06. A:", answers: ["Is"], post: "the weather nice today?", v: "cream" },
          { pre: "06. B: Yes, it", answers: ["is"], post: ".", v: "cream" },
          { pre: "06. A:", answers: ["Is"], post: "it cold at night?", v: "cream" },
          { pre: "06. B: No, it", answers: ["isn’t", "isn't", "is not"], post: ".", v: "cream" } ] },
        { t: "fill", id: "a5e7", wide: true, title: "B · TRANSFORME AS FRASES CONFORME A INDICAÇÃO", sub: "Exemplo resolvido: He is my brother. → He isn’t my brother. → Is he my brother?", items: [
          { pre: "02. NEGATIVA · They are at the park.", answers: ["They aren’t at the park.", "They aren't at the park.", "They are not at the park.", "They’re not at the park.", "They're not at the park."], v: "mint" },
          { pre: "02. INTERROGATIVA · They are at the park.", answers: ["Are they at the park?"], v: "mint" },
          { pre: "03. NEGATIVA · I am happy.", answers: ["I am not happy.", "I’m not happy.", "I'm not happy."], v: "lilac" },
          { pre: "03. INTERROGATIVA · I am happy.", answers: ["Am I happy?"], v: "lilac" },
          { pre: "04. NEGATIVA · She is a teacher.", answers: ["She isn’t a teacher.", "She isn't a teacher.", "She is not a teacher.", "She’s not a teacher.", "She's not a teacher."], v: "cream" },
          { pre: "04. INTERROGATIVA · She is a teacher.", answers: ["Is she a teacher?"], v: "cream" },
          { pre: "05. NEGATIVA · We are friends.", answers: ["We aren’t friends.", "We aren't friends.", "We are not friends.", "We’re not friends.", "We're not friends."], v: "mint" },
          { pre: "05. INTERROGATIVA · We are friends.", answers: ["Are we friends?"], v: "mint" } ] },
        { t: "sec", text: "C · ESCREVA FRASES SUAS USANDO AS TRÊS FORMAS DO VERB TO BE" },
        { t: "free", id: "a5f2", cols: 2, items: [
          { n: "1", kicker: "AFIRMATIVA", prefix: "I am…", ideas: "Ex.: I am a student.", v: "mint", c: "teal" },
          { n: "2", kicker: "AFIRMATIVA", prefix: "She is…", ideas: "Escreva outra frase afirmativa.", v: "mint", c: "teal" },
          { n: "3", kicker: "NEGATIVA", prefix: "I’m not…", ideas: "Ex.: I am not tired.", v: "red", c: "red" },
          { n: "4", kicker: "NEGATIVA", prefix: "He isn’t…", ideas: "Escreva outra frase negativa.", v: "red", c: "red" },
          { n: "5", kicker: "INTERROGATIVA", prefix: "Are you…?", ideas: "Ex.: Are you ready?", v: "lilac", c: "purple" },
          { n: "6", kicker: "INTERROGATIVA", prefix: "Is she…?", ideas: "Escreva outra pergunta.", v: "lilac", c: "purple" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA DE OURO", bold: true, text: "A intenção da frase define a estrutura. Afirme, negue e pergunte com clareza." },
        { t: "image", id: "a5p8b", ph: "Ilustração: menina de camiseta roxa com o dedo indicador levantado e um balão de fala ao lado com a frase Você já domina as três formas! Continue praticando!" },
        { t: "note", v: "lilac", kicker: "VAMOS PRATICAR!", text: "Na próxima página, você vai revisar rapidamente o que aprendeu na Aula 05." },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA AULA", text: "Na Aula 06, você vai aprender a falar sobre países e nacionalidades." } ] },

      { blocks: [
        { t: "badge", label: "AULA 05", page: "PÁGINA 09" },
        { t: "title", en: "VERB TO BE: REVIEW", pt: "Você já sabe afirmar, negar e perguntar em inglês." },
        { t: "kicker", text: "AULA CONCLUÍDA · USE ESTE CHECKLIST ANTES DE AVANÇAR" },
        { t: "check", id: "a5c2", title: "EU CONSIGO...", items: [
          "escolher am, is ou are pelo sujeito da frase.",
          "afirmar com sujeito + am / is / are.",
          "negar com am not, isn’t e aren’t.",
          "perguntar colocando am, is ou are antes do sujeito.",
          "responder com Yes, I am. / No, I’m not.",
          "não usar do, does nem doesn’t com o verb to be." ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 02 A 07", text: "Se ainda confunde am, is e are ou a ordem das palavras na pergunta." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 05", body: "Aprofunde com o professor e reveja as três formas.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: diga uma frase afirmativa, uma negativa e uma pergunta com o verb to be. Peça que a IA confirme se você usou a forma correta.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 06 · COUNTRIES AND NATIONALITIES", body: "Você vai aprender a dizer de onde é e qual é a sua nacionalidade." },
        { t: "bar", label: "PROGRESSO", value: "05 DE 42 AULAS", pct: "12%" },
        { t: "note", v: "cream", bold: true, text: "Pratique um pouco todo dia. A Aula 06 já está esperando por você." } ] }
    ]
  },

  {
    id: 6, code: "AULA 06", title: "Countries and Nationalities", sub: "Países e nacionalidades.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 06" },
        { t: "title", en: "COUNTRIES AND NATIONALITIES", pt: "De onde você é?" },
        { t: "lead", text: "Nesta aula, você vai aprender a falar sobre países e nacionalidades e a perguntar e responder de onde as pessoas são. Vamos lá?" },
        { t: "image", id: "a6p1", ph: "Ilustração: Ana e Leo conversando em pé ao ar livre, com prédios da cidade ao fundo. Ana, de camiseta azul-turquesa e mochila, acena com a mão aberta. Leo, de moletom roxo e mochila, sorri de frente para ela. Quatro balões de fala saem dos dois." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Hi! I’m Ana." },
          { s: "b", text: "Leo: Hi! I’m Leo." },
          { s: "a", text: "Ana: Where are you from?" },
          { s: "b", text: "Leo: I’m from Brazil." } ] },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI APRENDER A:" },
        { t: "grid", cols: 3, items: [
          { title: "Falar sobre países e nacionalidades.", v: "mint", c: "teal" },
          { title: "Perguntar e responder de onde você é.", v: "lilac", c: "purple" },
          { title: "Usar o verbo to be para falar sobre outras pessoas.", v: "mint", c: "teal" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Você já sabe se apresentar e cumprimentar. Agora, vamos descobrir de onde as pessoas são!" },
        { t: "meta", label: "TEMPO ESTIMADO", value: "14 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 02" },
        { t: "title", en: "COUNTRY × NATIONALITY", pt: "País e nacionalidade não são a mesma coisa." },
        { t: "cards", cols: 2, items: [
          { tag: "COUNTRY", c: "teal", v: "mint", id: "a6p2a", ph: "Ilustração: globo terrestre azul com a América do Sul virada para a frente e o Brasil destacado em verde, com a bandeira do Brasil ao lado.", lines: ["Brazil"], note: "= country (país)" },
          { tag: "NATIONALITY", c: "purple", v: "lilac", id: "a6p2b", ph: "Ilustração: menino de moletom roxo sorrindo e apontando para si mesmo com o polegar, com a bandeira do Brasil ao lado.", lines: ["Brazilian"], note: "= nationality (nacionalidade)" } ] },
        { t: "sec", text: "MODELOS:" },
        { t: "cards", cols: 2, items: [
          { tag: "ORIGEM", c: "teal", v: "mint", id: "a6p2c", ph: "Ilustração: Ana, de camiseta azul-turquesa e mochila, sorrindo com o dedo indicador levantado, e um balão de fala grande ao lado dela.", lines: ["I’m from Brazil."], note: "Usamos para dizer de onde somos." },
          { tag: "NACIONALIDADE", c: "purple", v: "lilac", id: "a6p2d", ph: "Ilustração: Leo, de moletom roxo, sorrindo com a mão no peito, e um balão de fala grande ao lado dele.", lines: ["I’m Brazilian."], note: "Usamos para dizer qual é a nossa nacionalidade." } ] },
        { t: "sec", text: "MAIS EXEMPLOS:" },
        { t: "table", head: ["COUNTRY · PAÍS", "NATIONALITY · NACIONALIDADE"], rows: [
          { a: "Canada", b: "Canadian", v: "mint" },
          { a: "Japan", b: "Japanese", v: "lilac" },
          { a: "Italy", b: "Italian", v: "cream" },
          { a: "France", b: "French", v: "mint" } ] },
        { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", bold: true, text: "Country = país  ·  Nationality = nacionalidade" },
        { t: "sec", text: "VAMOS PRATICAR?" },
        { t: "free", id: "a6f2", cols: 2, items: [
          { n: "1", kicker: "COUNTRY", prefix: "I’m from…", ideas: "Escreva o seu país em inglês.", v: "mint", c: "teal" },
          { n: "2", kicker: "NATIONALITY", prefix: "I’m…", ideas: "Escreva a sua nacionalidade em inglês.", v: "lilac", c: "purple" } ] },
        { t: "note", v: "gray", kicker: "PENSE", text: "De onde você é? Qual é a sua nacionalidade?" },
        { t: "key", v: "cream", text: "Agora você já sabe diferenciar país e nacionalidade." } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 03" },
        { t: "title", en: "COUNTRIES & NATIONALITIES", pt: "Parte 1: aprenda mais pares de país e nacionalidade." },
        { t: "lead", text: "Veja como o nome do país muda para a nacionalidade." },
        { t: "table", head: ["COUNTRY · PAÍS", "NATIONALITY · NACIONALIDADE"], rows: [
          { a: "Brazil", b: "Brazilian", v: "mint" },
          { a: "England", b: "English", v: "lilac" },
          { a: "Canada", b: "Canadian", v: "cream" },
          { a: "Belgium", b: "Belgian", v: "mint" },
          { a: "United Kingdom", b: "British", v: "lilac" },
          { a: "Japan", b: "Japanese", v: "cream" },
          { a: "Germany", b: "German", v: "mint" },
          { a: "Portugal", b: "Portuguese", v: "lilac" } ] },
        { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", bold: true, text: "United Kingdom e England não são a mesma coisa.\nUnited Kingdom é o país. England é uma parte dele." },
        { t: "sec", text: "MODELOS:" },
        { t: "cards", cols: 2, items: [
          { tag: "MODELO 1", c: "teal", v: "mint", id: "a6p3a", ph: "Ilustração: menina de camiseta azul-turquesa e mochila sorrindo com o polegar levantado, com a bandeira do Brasil ao lado e um balão de fala.", lines: ["I’m from Brazil.", "I’m Brazilian."] },
          { tag: "MODELO 2", c: "purple", v: "lilac", id: "a6p3b", ph: "Ilustração: menino de camiseta azul acenando, com a bandeira do Japão ao lado e um balão de fala.", lines: ["She’s from Japan.", "She’s Japanese."] } ] },
        { t: "sec", text: "VAMOS PRATICAR?" },
        { t: "match", id: "a6match2", title: "1 · LIGUE COM A NACIONALIDADE CORRETA",
          left: ["Brazil", "Japan", "Portugal"],
          right: ["Japanese", "Brazilian", "Portuguese"],
          answer: [1, 0, 2] },
        { t: "key", v: "cream", text: "Pratique todos os dias e logo você vai falar com confiança!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 04" },
        { t: "title", en: "COUNTRIES & NATIONALITIES", pt: "Parte 2: mais pares de país e nacionalidade." },
        { t: "lead", text: "Veja mais exemplos e pratique a relação entre país e nacionalidade." },
        { t: "table", head: ["COUNTRY · PAÍS", "NATIONALITY · NACIONALIDADE"], rows: [
          { a: "China", b: "Chinese", v: "mint" },
          { a: "Australia", b: "Australian", v: "lilac" },
          { a: "Austria", b: "Austrian", v: "cream" },
          { a: "Italy", b: "Italian", v: "mint" },
          { a: "Spain", b: "Spanish", v: "lilac" },
          { a: "France", b: "French", v: "cream" },
          { a: "United States", b: "American", v: "mint" },
          { a: "Russia", b: "Russian", v: "lilac" } ] },
        { t: "sec", text: "VAMOS PRATICAR?" },
        { t: "image", id: "a6p4a", ph: "Ilustração: quatro bandeiras retangulares em fila, numeradas de 1 a 4: China, Itália, França e Estados Unidos." },
        { t: "fill", id: "a6e2", title: "1 · OBSERVE A BANDEIRA E COMPLETE COM O PAÍS OU A NACIONALIDADE", items: [
          { pre: "1. I’m from", answers: ["China"], post: ".", note: "bandeira da China", v: "mint" },
          { pre: "1. I’m", answers: ["Chinese"], post: ".", v: "mint" },
          { pre: "2. I’m from", answers: ["Italy"], post: ".", note: "bandeira da Itália", v: "lilac" },
          { pre: "2. I’m", answers: ["Italian"], post: ".", v: "lilac" },
          { pre: "3. I’m from", answers: ["France"], post: ".", note: "bandeira da França", v: "cream" },
          { pre: "3. I’m", answers: ["French"], post: ".", v: "cream" },
          { pre: "4. I’m from", answers: ["the United States", "United States"], post: ".", note: "bandeira dos Estados Unidos", v: "mint" },
          { pre: "4. I’m", answers: ["American"], post: ".", v: "mint" } ] },
        { t: "sec", text: "MODELOS:" },
        { t: "cards", cols: 2, items: [
          { tag: "MODELO 1", c: "teal", v: "mint", id: "a6p4b", ph: "Ilustração: menina de camiseta azul-turquesa e mochila sorrindo, com a bandeira da Itália ao lado e um balão de fala.", lines: ["I’m from Italy.", "I’m Italian."] },
          { tag: "MODELO 2", c: "purple", v: "lilac", id: "a6p4c", ph: "Ilustração: menino de moletom roxo sorrindo, com a bandeira dos Estados Unidos ao lado e um balão de fala.", lines: ["He’s from the United States.", "He’s American."] } ] },
        { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", bold: true, text: "O nome do país pode ser bem diferente do nome da nacionalidade." },
        { t: "key", v: "cream", text: "Quanto mais você praticar, mais rápido vai memorizar!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 05" },
        { t: "title", en: "WHERE ARE YOU FROM?", pt: "Pergunte e responda de onde alguém é e qual é a sua nacionalidade." },
        { t: "sec", text: "AS PERGUNTAS E RESPOSTAS PRINCIPAIS:" },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Where are you from?", b: "I’m from Brazil.", note: "country", v: "mint" },
          { a: "What’s your nationality?", b: "I’m Brazilian.", note: "nationality", v: "lilac" },
          { a: "Where are you from?", b: "I’m from Canada.", note: "country", v: "cream" } ] },
        { t: "sec", text: "PARA ENTENDER:" },
        { t: "grid", cols: 2, items: [
          { title: "country", body: "= país", v: "mint", c: "teal" },
          { title: "nationality", body: "= nacionalidade", v: "lilac", c: "purple" },
          { title: "I’m from Brazil.", body: "= origem, o país", v: "mint", c: "teal" },
          { title: "I’m Brazilian.", body: "= nacionalidade", v: "lilac", c: "purple" } ] },
        { t: "sec", text: "VAMOS VER UM DIÁLOGO:" },
        { t: "image", id: "a6p5", ph: "Ilustração: dois quadros lado a lado. No primeiro, uma menina de camiseta azul-turquesa e mochila acena para um rapaz ruivo de moletom verde. No segundo, os dois continuam conversando de frente um para o outro, com prédios da cidade ao fundo." },
        { t: "dialogue", items: [
          { s: "a", text: "Hi! Where are you from?" },
          { s: "b", text: "I’m from Canada." },
          { s: "a", text: "What’s your nationality?" },
          { s: "b", text: "I’m Canadian." } ] },
        { t: "sec", text: "VAMOS PRATICAR?" },
        { t: "free", id: "a6f3", items: [
          { n: "1", kicker: "COMPLETE SOBRE VOCÊ", prefix: "Where are you from?", ideas: "Responda: I’m from… e depois I’m…", v: "mint", c: "teal" } ] },
        { t: "fill", id: "a6e3", title: "2 · COMPLETE COM O PAÍS E A NACIONALIDADE (BANDEIRA DO CANADÁ)", items: [
          { pre: "Where are you from? I’m from", answers: ["Canada"], post: ".", v: "mint" },
          { pre: "What’s your nationality? I’m", answers: ["Canadian"], post: ".", v: "lilac" } ] },
        { t: "match", id: "a6match3", title: "3 · LIGUE O PAÍS À NACIONALIDADE CORRETA",
          left: ["Brazil", "Canada", "Japan"],
          right: ["Japanese", "Canadian", "Brazilian"],
          answer: [2, 1, 0] },
        { t: "note", v: "cream", bar: true, kicker: "FIQUE LIGADO!", bold: true, text: "A forma completa e preferida é: Where are you from?\nCountry (país) e nationality (nacionalidade) são ideias diferentes." } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 06" },
        { t: "title", en: "WHERE IS HE FROM? WHERE ARE THEY FROM?", pt: "Agora vamos perguntar sobre outras pessoas e também sobre objetos." },
        { t: "sec", text: "1 · PERGUNTAS E RESPOSTAS SOBRE PESSOAS" },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Where is he from?", b: "He’s from the U.K. He’s British.", v: "mint" },
          { a: "Where is she from?", b: "She’s from Japan. She’s Japanese.", v: "lilac" },
          { a: "Where are they from?", b: "They’re from China. They’re Chinese.", v: "cream" } ] },
        { t: "sec", text: "2 · PERGUNTA E RESPOSTA SOBRE OBJETOS (ORIGEM)" },
        { t: "image", id: "a6p6a", ph: "Ilustração: câmera fotográfica vermelha vista de frente, com a bandeira do Japão ao lado." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Where is it from?", b: "It’s from Japan.", note: "country of origin", v: "mint" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA!", bold: true, text: "Objetos têm origem (country of origin), não nationality." },
        { t: "sec", text: "3 · PRONOMES: QUEM USA?" },
        { t: "table", head: ["PRONOME", "QUEM É"], rows: [
          { a: "he", b: "ele", v: "mint" },
          { a: "she", b: "ela", v: "lilac" },
          { a: "they", b: "eles / elas", v: "cream" },
          { a: "it", b: "ele / ela para coisas, objetos e animais (quando apropriado)", v: "gray" } ] },
        { t: "sec", text: "4 · VAMOS VER UM DIÁLOGO!" },
        { t: "image", id: "a6p6b", ph: "Ilustração: em três quadros, uma menina de camiseta azul-turquesa conversa com um rapaz ruivo de moletom verde, apontando para a foto de um terceiro rapaz, com prédios da cidade ao fundo." },
        { t: "dialogue", items: [
          { s: "a", text: "Hi! Who is he?" },
          { s: "b", text: "He’s Ken." },
          { s: "a", text: "Where is he from?" },
          { s: "b", text: "He’s from Japan." },
          { s: "b", text: "He’s Japanese!" } ] },
        { t: "sec", text: "5 · VAMOS PRATICAR?" },
        { t: "fill", id: "a6e4", title: "1 E 2 · COMPLETE COM O PAÍS E A NACIONALIDADE", items: [
          { pre: "1. Where is she from? She’s from", answers: ["Japan"], post: ".", note: "bandeira do Japão", v: "mint" },
          { pre: "1. She’s", answers: ["Japanese"], post: ".", v: "mint" },
          { pre: "2. Where are they from? They’re from", answers: ["China"], post: ".", note: "bandeira da China", v: "lilac" },
          { pre: "2. They’re", answers: ["Chinese"], post: ".", v: "lilac" } ] },
        { t: "mc", id: "a6mc2", title: "3 · ESCOLHA A PERGUNTA CORRETA PARA O OBJETO", v: "gray", questions: [
          { q: "O objeto da figura é um carro vermelho.", options: ["Where is he from?", "Where are they from?", "Where is it from?"], answer: 2, explain: "Para objetos, use it." } ] },
        { t: "note", v: "cream", bar: true, kicker: "FIQUE LIGADO!", bold: true, text: "Use is com he, she e it.\nUse are com they.\nPara objetos, use Where is it from? e responda com o país de origem." } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 07" },
        { t: "title", en: "LET’S TALK!", pt: "Agora vamos usar o inglês em pequenas conversas." },
        { t: "note", v: "cream", bar: true, bold: true, text: "Lembre-se: use cumprimentos, nome, país e nacionalidade para conversar de forma simples e natural." },
        { t: "sec", text: "1 · DIALOGUE 1: FIRST MEETING" },
        { t: "image", id: "a6p7a", ph: "Ilustração: Sofia, de camiseta azul-turquesa e mochila, acena para Daniel, de moletom verde e mochila, em um parque com prédios ao fundo. Balões de fala saem dos dois." },
        { t: "dialogue", items: [
          { s: "a", text: "Sofia: Hi! I’m Sofia. What’s your name?" },
          { s: "b", text: "Daniel: I’m Daniel. Nice to meet you." },
          { s: "a", text: "Sofia: Nice to meet you, too. Where are you from?" },
          { s: "b", text: "Daniel: I’m from Canada. I’m Canadian. How about you?" },
          { s: "a", text: "Sofia: I’m from Brazil. I’m Brazilian." } ] },
        { t: "sec", text: "2 · DIALOGUE 2: TALKING ABOUT OTHERS" },
        { t: "image", id: "a6p7b", ph: "Ilustração: duas meninas conversam na calçada, uma de camiseta azul-turquesa e outra de camiseta rosa, com o retrato de um rapaz japonês e a bandeira do Japão ao lado." },
        { t: "dialogue", items: [
          { s: "a", text: "Who is he?" },
          { s: "b", text: "He’s Ken." },
          { s: "b", text: "He’s from Japan. He’s Japanese." } ] },
        { t: "image", id: "a6p7c", ph: "Ilustração: as mesmas duas meninas conversam na calçada, com o retrato de um casal de jovens chineses e a bandeira da China ao lado." },
        { t: "dialogue", items: [
          { s: "a", text: "Where are they from?" },
          { s: "b", text: "They’re from China. They’re Chinese." } ] },
        { t: "sec", text: "3 · LET’S PRACTICE!" },
        { t: "free", id: "a6f4", cols: 2, items: [
          { n: "1", kicker: "COMPLETE YOUR DIALOGUE", prefix: "Hi! I’m…", ideas: "Depois: I’m from… e I’m…", v: "mint", c: "teal" },
          { n: "2", kicker: "ASK A FRIEND", prefix: "What’s your name?", ideas: "Where are you from? · What’s your nationality?", v: "lilac", c: "purple" },
          { n: "3", kicker: "CRIE UM MINI DIÁLOGO", prefix: "Use nome, país e nacionalidade.", ideas: "Escreva uma fala para cada pessoa.", v: "cream", c: "yellow" } ] },
        { t: "note", v: "gray", bar: true, kicker: "PARA LEMBRAR", bold: true, text: "Pergunte: Where are you from?\nResponda: I’m from Brazil.\nNationality: I’m Brazilian." },
        { t: "key", v: "cream", text: "Mantenha o diálogo simples, claro e natural. Fale com confiança!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 06", page: "PÁGINA 08" },
        { t: "title", en: "COUNTRIES AND NATIONALITIES", pt: "Você já sabe falar sobre países e nacionalidades." },
        { t: "kicker", text: "AULA CONCLUÍDA · USE ESTE CHECKLIST ANTES DE AVANÇAR" },
        { t: "check", id: "a6c2", title: "EU CONSIGO...", items: [
          "diferenciar country e nationality.",
          "perguntar: Where are you from?",
          "responder: I’m from…",
          "perguntar: What’s your nationality?",
          "responder sobre mim e sobre outras pessoas." ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 03 A 06", text: "Se ainda confunde country × nationality ou o uso de is e are." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 06", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: diga seu nome, de onde você é e a sua nacionalidade. Depois, fale sobre outra pessoa.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 07 · FAMILY", body: "Você vai aprender a falar sobre os membros da família." },
        { t: "bar", label: "PROGRESSO", value: "06 DE 42 AULAS", pct: "14%" } ] }
    ]
  }
  ,{
    id: 7, code: "AULA 07", title: "Family", sub: "Fale sobre a sua família.",
    time: "13 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 01" },
        { t: "title", en: "FAMILY", pt: "Conheça os membros da família" },
        { t: "note", v: "gray", text: "Nesta aula, você vai aprender os principais membros da família em inglês e começar a falar sobre eles!" },
        { t: "image", id: "a7p1", ph: "Ilustração: a família da Ana reunida na sala de casa, com janela, quadro e estante ao fundo. Da esquerda para a direita: Ana acenando, de camiseta azul-turquesa; o pai barbudo de polo azul, com a etiqueta roxa Dad (father); a irmã menor de camiseta rosa e tiara, com a etiqueta Sister; a mãe de blusa amarela, com a etiqueta Mom (mother); o irmão de moletom verde, com a etiqueta Brother; e um cachorro caramelo. Balão de fala branco saindo da Ana com o texto Hi! I’m Ana. This is my family." },
        { t: "dialogue", items: [
          { s: "a", text: "Hi! I’m Ana." },
          { s: "a", text: "This is my family." } ] },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "Aprender os nomes dos membros da família em inglês.", v: "mint", c: "teal" },
          { title: "Reconhecer relações familiares em frases simples.", v: "lilac", c: "purple" },
          { title: "Começar a falar sobre sua própria família em inglês.", v: "cream", c: "yellow" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Vamos conhecer a família da Ana e aprender os nomes de cada membro!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 02" },
        { t: "title", en: "MY FAMILY", pt: "Os membros mais próximos da família" },
        { t: "note", v: "gray", text: "Estas são algumas pessoas da família. Observe os nomes e as relações." },
        { t: "image", id: "a7p2", ph: "Ilustração: cinco pessoas lado a lado, cada uma com uma etiqueta roxa acima da cabeça. Da esquerda para a direita: Dad (father), o pai barbudo de polo azul; Mom (mother), a mãe de blusa amarela; Brother, o irmão de moletom verde; Sister, a irmã de camiseta rosa e tiara; Me, a Ana de camiseta azul-turquesa acenando. Embaixo, linhas de árvore genealógica ligam os cinco a um balão amarelo com a frase We are a family! e um coração rosa." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "dad", note: "(father)", b: "pai", v: "mint" },
          { a: "mom", note: "(mother)", b: "mãe", v: "lilac" },
          { a: "brother", b: "irmão", v: "cream" },
          { a: "sister", b: "irmã", v: "mint" },
          { a: "me", b: "eu", v: "lilac" } ] },
        { t: "key", v: "cream", text: "We are a family!" },
        { t: "chips", title: "EQUIVALÊNCIAS ÚTEIS", items: [
          { t: "Dad = Father", c: "teal" },
          { t: "Mom = Mother", c: "purple" } ] },
        { t: "sec", text: "EXEMPLOS", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "FATHER", c: "teal", v: "mint", id: "a7p2a", ph: "Ilustração: retrato circular do pai barbudo de polo azul, sobre fundo azul-claro", lines: ["He is my father."] },
          { tag: "MOTHER", c: "purple", v: "lilac", id: "a7p2b", ph: "Ilustração: retrato circular da mãe de cabelo castanho e blusa amarela, sobre fundo amarelo-claro", lines: ["She is my mother."] },
          { tag: "BROTHER", c: "navy", v: "gray", id: "a7p2c", ph: "Ilustração: retrato circular do irmão de moletom verde, sobre fundo verde-claro", lines: ["He is my brother."] },
          { tag: "SISTER", c: "yellow", v: "cream", id: "a7p2d", ph: "Ilustração: retrato circular da irmã de camiseta rosa e tiara, sobre fundo rosa-claro", lines: ["She is my sister."] } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA!", text: "Use he para pessoas do sexo masculino e she para pessoas do sexo feminino." } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 03" },
        { t: "title", en: "MY BIG FAMILY", pt: "Outros membros da família" },
        { t: "note", v: "gray", text: "Agora vamos conhecer mais pessoas da família." },
        { t: "image", id: "a7p3", ph: "Ilustração: árvore genealógica em dois níveis. Em cima, dois retratos circulares ligados por uma linha roxa: Grandpa (grandfather), senhor de óculos, cabelo e bigode brancos e suéter verde; e Grandma (grandmother), senhora de óculos, coque grisalho e blusa roxa. Do meio da linha descem três setas roxas para Uncle (uncle), homem de camisa verde; Aunt (aunt), mulher de blusa amarela; e Cousin (cousin), menino de camiseta vermelha acenando." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "grandpa", note: "(grandfather)", b: "avô", v: "mint" },
          { a: "grandma", note: "(grandmother)", b: "avó", v: "lilac" },
          { a: "uncle", b: "tio", v: "cream" },
          { a: "aunt", b: "tia", v: "mint" },
          { a: "cousin", b: "primo ou prima", v: "lilac" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Cousin = primo ou prima." },
        { t: "chips", title: "EQUIVALÊNCIAS ÚTEIS", items: [
          { t: "Grandpa = Grandfather", c: "teal" },
          { t: "Grandma = Grandmother", c: "purple" } ] },
        { t: "sec", text: "EXEMPLOS", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "GRANDFATHER", c: "teal", v: "mint", id: "a7p3a", ph: "Ilustração: retrato circular do avô de óculos, cabelo branco e suéter verde, sobre fundo azul-claro", lines: ["He is my grandfather."] },
          { tag: "GRANDMOTHER", c: "purple", v: "lilac", id: "a7p3b", ph: "Ilustração: retrato circular da avó de óculos, coque grisalho e blusa roxa, sobre fundo rosa-claro", lines: ["She is my grandmother."] },
          { tag: "UNCLE", c: "navy", v: "gray", id: "a7p3c", ph: "Ilustração: retrato circular do tio de camisa verde, sobre fundo verde-claro", lines: ["He is my uncle."] },
          { tag: "AUNT", c: "yellow", v: "cream", id: "a7p3d", ph: "Ilustração: retrato circular da tia de blusa amarela e cabelo castanho comprido, sobre fundo amarelo-claro", lines: ["She is my aunt."] },
          { tag: "COUSIN", c: "teal", v: "mint", id: "a7p3e", ph: "Ilustração: retrato circular do primo, menino de camiseta vermelha acenando, sobre fundo azul-claro", lines: ["He is my cousin.", "She is my cousin."] } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA!", text: "Use he para pessoas do sexo masculino e she para pessoas do sexo feminino." } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 04" },
        { t: "title", en: "A FAMILY GROWS", pt: "Novos membros da família" },
        { t: "note", v: "gray", text: "Agora vamos conhecer mais pessoas da família." },
        { t: "image", id: "a7p4", ph: "Ilustração: árvore genealógica em três níveis, com etiquetas roxas ligadas por linhas. No topo, Husband (marido), homem barbudo de polo azul, ao lado de Wife (esposa), mulher de blusa amarela. No meio, Son (filho), rapaz de moletom verde, e Daughter (filha), menina de camiseta rosa e tiara. Embaixo, Grandson (neto), menino de camiseta vermelha acenando, e Granddaughter (neta), menina de laço rosa e jardineira roxa acenando; uma chave liga os dois à etiqueta Grandchildren (netos / netas)." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "husband", b: "marido", v: "mint" },
          { a: "wife", b: "esposa", v: "lilac" },
          { a: "son", b: "filho", v: "cream" },
          { a: "daughter", b: "filha", v: "mint" },
          { a: "grandson", b: "neto", v: "lilac" },
          { a: "granddaughter", b: "neta", v: "cream" },
          { a: "grandchildren", b: "netos / netas", v: "mint" } ] },
        { t: "sec", text: "EXEMPLOS", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "HUSBAND", c: "teal", v: "mint", id: "a7p4a", ph: "Ilustração: retrato circular do marido, homem barbudo de polo azul, sobre fundo azul-claro", lines: ["He is the husband."] },
          { tag: "WIFE", c: "purple", v: "lilac", id: "a7p4b", ph: "Ilustração: retrato circular da esposa, mulher de blusa amarela, sobre fundo amarelo-claro", lines: ["She is the wife."] },
          { tag: "SON", c: "navy", v: "gray", id: "a7p4c", ph: "Ilustração: retrato circular do filho, rapaz de moletom verde, sobre fundo verde-claro", lines: ["He is the son."] },
          { tag: "DAUGHTER", c: "yellow", v: "cream", id: "a7p4d", ph: "Ilustração: retrato circular da filha, menina de camiseta rosa e tiara, sobre fundo rosa-claro", lines: ["She is the daughter."] },
          { tag: "GRANDSON", c: "teal", v: "mint", id: "a7p4e", ph: "Ilustração: retrato circular do neto, menino de camiseta vermelha acenando, sobre fundo azul-claro", lines: ["He is the grandson."] },
          { tag: "GRANDDAUGHTER", c: "purple", v: "lilac", id: "a7p4f", ph: "Ilustração: retrato circular da neta, menina de laço rosa e jardineira roxa acenando, sobre fundo rosa-claro", lines: ["She is the granddaughter."] },
          { tag: "GRANDCHILDREN", c: "navy", v: "gray", id: "a7p4g", ph: "Ilustração: retrato do neto e da neta juntos, os dois acenando", lines: ["They are the grandchildren."] } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA!", text: "Grandchildren é o plural de grandson e granddaughter: netos / netas." } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 05" },
        { t: "title", en: "FAMILY CONNECTIONS", pt: "Mais relações da família" },
        { t: "note", v: "gray", text: "Agora vamos completar o vocabulário da família e praticar um pouco." },
        { t: "image", id: "a7p5", ph: "Ilustração: árvore genealógica. No topo, Husband (marido), homem barbudo de polo azul, ligado a Wife (esposa), mulher de blusa amarela. Abaixo, dois casais de retratos circulares: Son (filho), rapaz de moletom verde, ao lado da nora de camiseta rosa; e Daughter (filha), moça de jardineira roxa e laço rosa, ao lado do genro de camisa verde-água. Chaves roxas apontam para as etiquetas Son-in-law (genro) e Daughter-in-law (nora). Embaixo, duas caixas com os retratos do genro e da nora e as frases He is the son-in-law. e She is the daughter-in-law." },
        { t: "table", head: ["INGLÊS", "PORTUGUÊS"], rows: [
          { a: "son-in-law", b: "genro", v: "mint" },
          { a: "daughter-in-law", b: "nora", v: "lilac" } ] },
        { t: "cards", cols: 2, items: [
          { tag: "SON-IN-LAW", c: "teal", v: "mint", id: "a7p5a", ph: "Ilustração: retrato circular do genro, rapaz de camisa verde-água, sobre fundo azul-claro", lines: ["He is the son-in-law."] },
          { tag: "DAUGHTER-IN-LAW", c: "purple", v: "lilac", id: "a7p5b", ph: "Ilustração: retrato circular da nora, moça de laço rosa e jardineira roxa, sobre fundo rosa-claro", lines: ["She is the daughter-in-law."] } ] },
        { t: "sec", text: "VAMOS PRATICAR!", c: "purple" },
        { t: "mc", id: "a7mc2", title: "1 · CHOOSE.", v: "gray", questions: [
          { q: "1. He is my ________ .", options: ["brother", "uncle", "son-in-law"], answer: 2, explain: "Son-in-law é o genro: o marido da filha." },
          { q: "2. She is my ________ .", options: ["aunt", "daughter-in-law", "sister"], answer: 1, explain: "Daughter-in-law é a nora: a esposa do filho." } ] },
        { t: "match", id: "a7match2", title: "2 · MATCH.",
          left: ["neto", "nora", "tio"],
          right: ["daughter-in-law", "grandson", "uncle"],
          answer: [1, 0, 2] },
        { t: "fill", id: "a7e2", title: "3 · COMPLETE.", sub: "Use the words in the box: wife · grandson · aunt · daughter-in-law", items: [
          { pre: "1. She is my", answers: ["wife", "aunt", "daughter-in-law"], post: ".", v: "mint" },
          { pre: "2. He is my", answers: ["grandson"], post: ".", v: "lilac" },
          { pre: "3. They are my", answers: ["grandchildren", "parents", "grandparents"], post: ".", note: "Aqui entra uma palavra no plural.", v: "cream" } ] },
        { t: "note", v: "cream", bar: true, kicker: "TIP!", text: "Son-in-law = genro e daughter-in-law = nora." } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 06" },
        { t: "title", en: "LET’S TALK!", pt: "This is my family" },
        { t: "note", v: "gray", text: "Leia o diálogo e veja a família da Emma." },
        { t: "image", id: "a7p6", ph: "Ilustração: quatro pessoas sentadas no sofá da sala, com janela, plantas e estante ao fundo. Da esquerda para a direita, cada uma com etiqueta roxa: Emma, menina de laço rosa e jardineira roxa acenando; Alex, menino de moletom verde; Lisa, mulher de blusa amarela; Mark, homem barbudo de polo azul." },
        { t: "dialogue", items: [
          { s: "a", text: "Emma: Hi! I’m Emma." },
          { s: "a", text: "Emma: I’m from Canada. I’m Canadian." },
          { s: "a", text: "Emma: He is my brother, Alex." },
          { s: "a", text: "Emma: She is my mother, Lisa." },
          { s: "a", text: "Emma: He is my father, Mark." },
          { s: "a", text: "Emma: They are my family." } ] },
        { t: "sec", text: "AGORA É SUA VEZ!", c: "purple" },
        { t: "lead", text: "Observe a família e apresente 3 pessoas." },
        { t: "image", id: "a7p6b", ph: "Ilustração: família de seis pessoas posando na sala. Atrás, o avô de óculos e suéter verde, a avó de óculos e blusa roxa, a mãe de blusa laranja e o pai de polo verde-água. Na frente, um menino de camiseta listrada azul e uma menina de camiseta amarela com tiara." },
        { t: "fill", id: "a7e3", title: "APRESENTE TRÊS PESSOAS", items: [
          { pre: "1. He is my", answers: ["father", "brother"], post: ".", v: "mint" },
          { pre: "2. She is my", answers: ["mother", "sister"], post: ".", v: "lilac" },
          { pre: "3. They are my", answers: ["family", "grandparents"], post: ".", v: "cream" } ] },
        { t: "chips", title: "WORD BANK", items: [
          { t: "father", c: "teal" },
          { t: "mother", c: "purple" },
          { t: "brother", c: "teal" },
          { t: "sister", c: "purple" },
          { t: "grandparents", c: "teal" },
          { t: "family", c: "purple" } ] },
        { t: "note", v: "cream", bar: true, kicker: "TIP!", text: "Use as palavras do word bank para falar sobre as pessoas da sua família." } ] },

      { blocks: [
        { t: "badge", label: "AULA 07", page: "PÁGINA 07" },
        { t: "title", en: "AULA CONCLUÍDA!", pt: "Você aprendeu os principais membros da família e já pode falar sobre eles em inglês!" },
        { t: "check", id: "a7c2", title: "EU CONSIGO...", items: [
          "reconhecer os principais membros da família.",
          "usar dad/father e mom/mother.",
          "diferenciar uncle, aunt e cousin.",
          "reconhecer relações como husband, wife, son e daughter.",
          "apresentar membros de uma família com frases simples." ] },
        { t: "image", id: "a7p7", ph: "Ilustração: a família inteira reunida e sorrindo, com estante e quadro ao fundo. Atrás, o avô de óculos e suéter verde, a avó de óculos e blusa roxa, o pai barbudo de polo azul e a mãe de blusa amarela. Na frente, o irmão de moletom verde, a irmã de camiseta rosa e tiara, a Ana de camiseta azul-turquesa acenando e o cachorro caramelo. Balão de fala com um coração rosa e o texto That’s our family! We love each other!" },
        { t: "key", v: "lilac", text: "That’s our family! We love each other!" },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "VIDEOAULA 07 · FAMILY", body: "Assista à videoaula completa e revise tudo o que você aprendeu nesta aula.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça a missão oral com a IA e descreva os membros da família.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "sec", text: "SUA MISSÃO COM A IA", c: "purple" },
        { t: "lead", text: "A IA vai mostrar uma família e fazer perguntas como:" },
        { t: "chips", items: [
          { t: "Who is the boy?", c: "teal" },
          { t: "Who is the woman?", c: "purple" },
          { t: "Who is the older man?", c: "navy" } ] },
        { t: "note", v: "gray", text: "Responda em inglês usando frases simples.\nExemplo: He is the brother." },
        { t: "bar", label: "PROGRESSO", value: "07 DE 42 AULAS", pct: "17%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 08 · POSSESSIVE ’S", body: "Você vai aprender a dizer de quem é cada coisa usando o ’s." },
        { t: "note", v: "lilac", bar: true, bold: true, kicker: "GREAT JOB!", text: "Continue praticando e logo você será cada vez melhor no inglês!" } ] }
    ]
  },

  {
    id: 8, code: "AULA 08", title: "Possessive ’S", sub: "Mostre de quem é cada coisa.",
    time: "15 minutos",
    pages: [
      // ───────────────────────── página impressa 01 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08" },
        { t: "title", en: "POSSESSIVE ’S", pt: "De quem é?" },
        { t: "note", v: "gray", text: "Usamos ’s para mostrar que algo pertence a alguém ou que existe uma relação." },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "PENSE ASSIM:", text: "nome da pessoa\n+ ’s\n+ coisa ou relação" },
        { t: "sec", text: "VEJA ESTE EXEMPLO:", c: "purple" },
        { t: "steps", items: [
          { tag: "MIKE", c: "teal", v: "mint", id: "w08p1a", alt: "Retrato de Mike sorrindo",
            ph: "Foto: retrato circular de um rapaz branco de cabelo castanho curto, camisa verde-oliva aberta sobre camiseta branca, sorrindo de frente para a câmera, com o ambiente interno de uma cafeteria desfocado ao fundo.",
            lines: ["Mike"] },
          { tag: "WATCH", c: "yellow", v: "cream", id: "w08p1b", alt: "Relógio de pulso com pulseira de couro marrom",
            ph: "Foto: recorte circular de um relógio de pulso analógico de mostrador preto, caixa prateada e pulseira de couro marrom, apoiado sobre fundo claro.",
            lines: ["watch"], note: "(relógio)" },
          { tag: "MIKE’S WATCH", c: "purple", v: "lilac", id: "w08p1c", alt: "Mike segurando o relógio de couro marrom",
            ph: "Foto: recorte circular do mesmo rapaz de camisa verde-oliva sorrindo e segurando na mão direita, à altura do rosto, o relógio de pulseira de couro marrom.",
            lines: ["Mike’s watch"] } ] },
        { t: "key", v: "cream", text: "Mike’s watch = o relógio de Mike." },
        { t: "sec", text: "TAMBÉM USAMOS ’S PARA RELAÇÕES ENTRE PESSOAS." },
        { t: "steps", items: [
          { tag: "ANNA", c: "teal", v: "mint", id: "w08p1d", alt: "Retrato de Anna de perfil, sorrindo",
            ph: "Foto: retrato circular de uma jovem branca de cabelo castanho comprido e suéter azul-claro, vista de perfil, sorrindo e olhando para a direita.",
            lines: ["Anna"] },
          { tag: "BROTHER", c: "yellow", v: "cream", id: "w08p1e", alt: "Retrato de um rapaz de moletom escuro, sorrindo",
            ph: "Foto: retrato circular de um rapaz branco de cabelo castanho curto e moletom azul-marinho escuro, sorrindo e olhando para a esquerda.",
            lines: ["brother"], note: "(irmão)" },
          { tag: "ANNA’S BROTHER", c: "purple", v: "lilac", id: "w08p1f", alt: "Anna e o irmão juntos, sorrindo",
            ph: "Foto: recorte circular da jovem de suéter azul-claro e do rapaz de moletom azul-marinho lado a lado, muito próximos, os dois sorrindo e olhando um para o outro.",
            lines: ["Anna’s brother"], note: "= o irmão da Anna." } ] },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI:", c: "purple" },
        { t: "grid", cols: 2, items: [
          { title: "Entender o que é o possessive ’s.", v: "mint", c: "teal" },
          { title: "Fazer perguntas com Whose…?", v: "lilac", c: "purple" },
          { title: "Usar ’s para objetos e para membros da família.", v: "cream", c: "yellow" },
          { title: "Diferenciar singular e plural no possessive ’s.", v: "mint", c: "teal" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Vamos aprender a falar sobre o que pertence às pessoas e as relações entre elas!" } ] },

      // ───────────────────────── página impressa 02 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 02" },
        { t: "title", en: "NAME + ’S", pt: "Como formar frases simples de posse" },
        { t: "note", v: "gray", text: "Usamos ’s após o nome da pessoa para mostrar que algo lhe pertence ou tem relação." },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "PADRÃO PRINCIPAL:", text: "nome da pessoa\n+ ’s\n+ objeto ou relação" },
        { t: "key", v: "cream", text: "A pessoa vem primeiro. Depois, adicionamos ’s. Em seguida, vem o objeto ou relação." },
        { t: "steps", items: [
          { tag: "RICHARD", c: "teal", v: "mint", id: "w08p2a", alt: "Retrato de Richard sorrindo",
            ph: "Foto: retrato circular de um homem branco de barba curta, cabelo castanho e camisa verde-oliva sobre camiseta branca, sorrindo de frente para a câmera.",
            lines: ["Richard"] },
          { tag: "’S", c: "purple", v: "lilac", lines: ["’s"] },
          { tag: "SMARTPHONE", c: "navy", v: "gray", id: "w08p2b", alt: "Smartphone preto visto de frente",
            ph: "Foto: recorte circular de um smartphone preto deitado sobre superfície clara, visto de cima, com a tela desligada.",
            lines: ["smartphone"] },
          { tag: "RICHARD’S SMARTPHONE", c: "yellow", v: "cream", lines: ["Richard’s smartphone"] } ] },
        { t: "steps", items: [
          { tag: "KATIE", c: "teal", v: "mint", id: "w08p2c", alt: "Retrato de Katie sorrindo",
            ph: "Foto: retrato circular de uma mulher branca de cabelo castanho-claro ondulado na altura dos ombros, blusa clara, sorrindo de frente para a câmera.",
            lines: ["Katie"] },
          { tag: "’S", c: "purple", v: "lilac", lines: ["’s"] },
          { tag: "DOG", c: "navy", v: "gray", id: "w08p2d", alt: "Cachorro golden retriever com a língua de fora",
            ph: "Foto: recorte circular de um cachorro golden retriever adulto, pelo dourado, de língua para fora, sentado em um gramado ao ar livre.",
            lines: ["dog"] },
          { tag: "KATIE’S DOG", c: "yellow", v: "cream", lines: ["Katie’s dog"] } ] },
        { t: "sec", text: "EXEMPLOS", c: "purple" },
        { t: "steps", items: [
          { n: "1", tag: "RICHARD’S SMARTPHONE", c: "purple", v: "lilac", id: "w08p2e", alt: "Richard segurando o smartphone",
            ph: "Foto: homem de barba curta e camisa verde-oliva sorrindo e segurando um smartphone preto na mão direita, à altura do peito, em ambiente interno desfocado.",
            lines: ["Richard’s smartphone"], note: "o smartphone do Richard" },
          { n: "2", tag: "KATIE’S DOG", c: "teal", v: "mint", id: "w08p2f", alt: "Katie abraçada ao seu golden retriever",
            ph: "Foto: mulher de cabelo castanho-claro ondulado e suéter bege sorrindo ao lado de um golden retriever de língua para fora, os dois ao ar livre com vegetação desfocada ao fundo.",
            lines: ["Katie’s dog"], note: "o cachorro da Katie" },
          { n: "3", tag: "SARAH’S HOUSE", c: "purple", v: "lilac", id: "w08p2g", alt: "Sarah em frente à casa dela",
            ph: "Foto: jovem de cabelo castanho comprido e suéter bege sorrindo em pé no jardim, tendo atrás dela uma casa americana de madeira clara com telhado de duas águas e varanda.",
            lines: ["Sarah’s house"], note: "a casa da Sarah" },
          { n: "4", tag: "PETER’S BOOK", c: "teal", v: "mint", id: "w08p2h", alt: "Peter lendo um livro",
            ph: "Foto: homem de óculos, barba curta e camisa jeans azul sorrindo enquanto lê um livro aberto de capa escura, com uma estante e plantas desfocadas ao fundo.",
            lines: ["Peter’s book"], note: "o livro do Peter" } ] },
        { t: "sec", text: "COMPLETE O PADRÃO", c: "purple" },
        { t: "steps", items: [
          { tag: "SARAH", c: "teal", v: "mint", id: "w08p2i", alt: "Retrato de Sarah sorrindo",
            ph: "Foto: retrato circular de uma jovem branca de cabelo castanho comprido e suéter bege, sorrindo de frente para a câmera, com fundo claro desfocado.",
            lines: ["Sarah"] },
          { tag: "HOUSE", c: "yellow", v: "cream", lines: ["house"] },
          { tag: "SARAH’S HOUSE", c: "purple", v: "lilac", lines: ["Sarah’s house"] } ] },
        { t: "steps", items: [
          { tag: "PETER", c: "teal", v: "mint", id: "w08p2j", alt: "Retrato de Peter de óculos, sorrindo",
            ph: "Foto: retrato circular de um homem branco de óculos de armação escura, barba curta e camisa jeans azul sobre camiseta branca, sorrindo de frente para a câmera.",
            lines: ["Peter"] },
          { tag: "BOOK", c: "yellow", v: "cream", lines: ["book"] },
          { tag: "PETER’S BOOK", c: "purple", v: "lilac", lines: ["Peter’s book"] } ] },
        { t: "key", v: "cream", text: "Com o possessive ’s, mostramos que algo pertence a alguém." } ] },

      // ───────────────────────── página impressa 03 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 03" },
        { t: "title", en: "WHOSE…?", pt: "Como perguntar: de quem é?" },
        { t: "note", v: "gray", text: "Usamos WHOSE para perguntar a quem algo pertence." },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "PADRÃO:", text: "Whose + objeto + verbo to be…?" },
        { t: "sec", text: "ESTRUTURA", c: "purple" },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Whose watch is this?", b: "It’s Mike’s watch.", v: "lilac" } ] },
        { t: "sec", text: "DIÁLOGO", c: "purple" },
        { t: "image", id: "w08p3a", alt: "Ana mostra um relógio e Brian responde",
          ph: "Foto: dois retratos circulares lado a lado. À esquerda, Ana, jovem de cabelo castanho ondulado comprido e suéter bege, sorrindo e segurando um relógio de pulso entre os dedos. À direita, Brian, rapaz de cabelo castanho curto e camisa jeans azul sobre camiseta branca, sorrindo de perfil. Balões de fala saem dos dois." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Whose watch is this?" },
          { s: "b", text: "Brian: It’s Mike’s watch." } ] },
        { t: "image", id: "w08p3b", alt: "Ana mostra um smartphone e Brian responde",
          ph: "Foto: dois retratos circulares lado a lado. À esquerda, a mesma Ana de suéter bege segurando um smartphone preto na mão. À direita, Brian de camisa jeans azul, sorrindo de perfil. Balões de fala saem dos dois." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Whose smartphone is this?" },
          { s: "b", text: "Brian: It’s Richard’s smartphone." } ] },
        { t: "sec", text: "MAIS EXEMPLOS", c: "purple" },
        { t: "steps", items: [
          { n: "1", tag: "LAPTOP", c: "purple", v: "lilac", id: "w08p3c", alt: "Laptop aberto sobre uma mesa de madeira",
            ph: "Foto: laptop prateado aberto sobre uma mesa de madeira clara, visto de frente, com plantas e janela desfocadas ao fundo.",
            lines: ["Whose laptop is this?", "It’s Peter’s laptop."], note: "É o laptop do Peter." },
          { n: "2", tag: "BAG", c: "teal", v: "mint", id: "w08p3d", alt: "Bolsa de couro marrom sobre a mesa",
            ph: "Foto: bolsa de couro marrom com alças e alça de ombro, apoiada de frente sobre uma mesa de madeira, com parede clara desfocada ao fundo.",
            lines: ["Whose bag is this?", "It’s Sarah’s bag."], note: "É a bolsa da Sarah." },
          { n: "3", tag: "BOOK", c: "purple", v: "lilac", id: "w08p3e", alt: "Livro de capa azul-escura fechado sobre a mesa",
            ph: "Foto: livro grosso de capa dura azul-escura, fechado, apoiado sobre uma mesa de madeira clara.",
            lines: ["Whose book is this?", "It’s Emma’s book."], note: "É o livro da Emma." },
          { n: "4", tag: "DOG", c: "teal", v: "mint", id: "w08p3f", alt: "Golden retriever sentado na grama",
            ph: "Foto: cachorro golden retriever adulto de pelo dourado, sentado na grama de um parque, de língua para fora, com árvores desfocadas ao fundo.",
            lines: ["Whose dog is this?", "It’s Katie’s dog."], note: "É o cachorro da Katie." } ] },
        { t: "sec", text: "PRATIQUE", c: "purple" },
        { t: "rows", items: [
          { n: "1", text: "Whose watch is this? → It’s Mike’s watch.", c: "purple" },
          { n: "2", text: "Whose bag is this? → It’s Sarah’s bag.", c: "purple" },
          { n: "3", text: "Whose book is this? → It’s Emma’s book.", c: "purple" } ] },
        { t: "key", v: "cream", text: "Com WHOSE, perguntamos a quem algo pertence." } ] },

      // ───────────────────────── página impressa 04 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 04" },
        { t: "title", en: "POSSESSIVE ’S", pt: "De quem é?" },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "LEMBRE-SE:", text: "’s mostra que algo pertence a alguém ou que existe uma relação." },
        { t: "sec", text: "VAMOS VER OUTROS EXEMPLOS COM COISAS E LUGARES", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "THE CAR", c: "purple", v: "lilac", id: "w08p4a", alt: "Carro sedã cinza estacionado na rua",
            ph: "Foto: carro sedã cinza-escuro visto de três quartos na frente, parado em uma rua arborizada de cidade, com prédios desfocados ao fundo.",
            lines: ["John’s car"], note: "(o carro) = o carro de John." },
          { tag: "THE HOUSE", c: "purple", v: "lilac", id: "w08p4b", alt: "Casa moderna de dois andares",
            ph: "Foto: casa moderna de dois andares, fachada branca e bege com detalhes de madeira, garagem escura, palmeiras e jardim na frente, sob céu azul.",
            lines: ["Mary’s house"], note: "(a casa) = a casa da Mary." },
          { tag: "THE BOOK", c: "purple", v: "lilac", id: "w08p4c", alt: "Livro antigo de capa azul-escura sobre a mesa",
            ph: "Foto: livro antigo de capa dura azul-escura com letras douradas, The Adventures of Sherlock Holmes, de Arthur Conan Doyle, fechado sobre uma mesa de madeira escura.",
            lines: ["Tom’s book"], note: "(o livro) = o livro do Tom." } ] },
        { t: "sec", text: "AGORA, VAMOS VER O ’S USADO ENTRE PESSOAS DE FORMA SIMPLES.", c: "teal" },
        { t: "cards", cols: 2, items: [
          { tag: "MY FRIEND", c: "teal", v: "mint", id: "w08p4d", alt: "Rapaz sorrindo ao ar livre, de jaqueta jeans",
            ph: "Foto: rapaz branco de barba curta, jaqueta jeans sobre moletom cinza com capuz e mochila nas costas, sorrindo ao ar livre, com prédios e árvores desfocados ao fundo.",
            lines: ["my friend’s name"], note: "(meu amigo) = o nome do meu amigo." },
          { tag: "MY SISTER", c: "teal", v: "mint", id: "w08p4e", alt: "Jovem sorrindo com a mão no rosto",
            ph: "Foto: jovem branca de cabelo castanho comprido e suéter bege, sentada com a mão apoiada no rosto, sorrindo, com estante e planta desfocadas ao fundo.",
            lines: ["my sister’s phone"], note: "(minha irmã) = o celular da minha irmã." } ] },
        { t: "sec", text: "OBSERVE:", c: "teal" },
        { t: "rows", items: [
          { text: "Usamos ’s depois do nome da pessoa.", c: "teal" },
          { text: "Quando o nome já termina em -s, apenas acrescentamos ’s.", c: "teal" },
          { text: "Ex.: Carlos’s car (= o carro de Carlos)", c: "teal" } ] },
        { t: "sec", text: "VOCÊ SABIA?", c: "purple" },
        { t: "note", v: "lilac", text: "O ’s não é um verbo.\nEle é um sinal (apóstrofo + s) que mostra posse ou relação." },
        { t: "note", v: "gray", kicker: "NA PRÓXIMA PÁGINA", text: "Você vai aprender a usar em frases e perguntas." },
        { t: "key", v: "cream", text: "Pequeno sinal, grande significado! O ’s ajuda a deixar suas frases mais completas e naturais." } ] },

      // ───────────────────────── página impressa 05 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 05" },
        { t: "title", en: "DE PESSOAS PARA COISAS E RELAÇÕES", pt: "Também usamos ’s para mostrar que algo pertence a uma coisa ou a uma relação." },
        { t: "note", v: "gray", bar: true, kicker: "OBSERVE BEM OS EXEMPLOS!", text: "O significado é sempre de posse ou relação." },
        { t: "sec", text: "EXEMPLOS", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "THE DOG’S TOY", c: "purple", v: "lilac", id: "w08p5a", alt: "Cachorro deitado no tapete com um brinquedo de corda",
            ph: "Foto: golden retriever deitado no tapete claro da sala, de língua para fora, com um brinquedo de corda azul entre as patas da frente.",
            lines: ["the dog’s toy"], note: "o brinquedo do cachorro" },
          { tag: "THE MOVIE’S ENDING", c: "purple", v: "lilac", id: "w08p5b", alt: "Televisão exibindo THE END numa sala",
            ph: "Foto: televisão de tela plana sobre um rack de madeira em sala com luz baixa, exibindo em letras brancas sobre fundo escuro a frase THE END, com abajur e planta ao lado.",
            lines: ["the movie’s ending"], note: "o final do filme" },
          { tag: "MY FRIEND’S BIRTHDAY", c: "purple", v: "lilac", id: "w08p5c", alt: "Calendário com um coração e um bilhete escrito BIRTHDAY!",
            ph: "Foto: calendário de mesa aberto com um dia circulado por um coração rosa e um bilhete adesivo bege escrito BIRTHDAY!, ao lado de uma caneta rosé e uma xícara de café.",
            lines: ["my friend’s birthday"], note: "o aniversário do meu amigo" } ] },
        { t: "sec", text: "NA PRÁTICA", c: "teal" },
        { t: "lead", text: "Veja este diálogo:" },
        { t: "image", id: "w08p5d", alt: "Sara e Tom conversando à mesa ao lado de uma mochila",
          ph: "Foto: jovem de jaqueta jeans e camiseta branca, cabelo castanho comprido, sorrindo e apontando para uma mochila bege sobre a mesa de madeira; ao lado dela, um rapaz de suéter verde-escuro sorri olhando para a mochila. Sobre a mesa há também um caderno azul e um copo de café, com janela e plantas desfocadas ao fundo." },
        { t: "dialogue", items: [
          { s: "a", text: "Sara: What is this?" },
          { s: "b", text: "Tom: It’s Sarah’s backpack." },
          { s: "a", text: "Sara: Is this your notebook?" },
          { s: "b", text: "Tom: Yes, it is. It’s my notebook." },
          { s: "a", text: "Sara: When is your brother’s birthday?" },
          { s: "b", text: "Tom: It’s on May 12th." } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "FIQUE LIGADO!", text: "O significado do ’s é sempre:" },
        { t: "grid", cols: 3, items: [
          { title: "De uma pessoa para algo", v: "mint", c: "teal" },
          { title: "De uma coisa para algo", v: "lilac", c: "purple" },
          { title: "Entre pessoas (relação de parentesco ou amizade)", v: "cream", c: "yellow" } ] },
        { t: "key", v: "cream", text: "Posse, relação, pertencimento." } ] },

      // ───────────────────────── página impressa 06 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 06" },
        { t: "title", en: "BABY’S × BABIES’", pt: "Um bebê ou vários bebês?" },
        { t: "lead", text: "Observe a posição do apóstrofo quando o possuidor está no singular ou no plural." },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "FOCO DE HOJE", text: "Nesta página, o mais importante é perceber onde o apóstrofo fica." },
        { t: "cards", cols: 2, items: [
          { tag: "1. SINGULAR", c: "purple", v: "lilac", id: "w08p6a", alt: "Um bebê em pé no berço, sorrindo",
            ph: "Foto: um bebê de body bege claro, em pé segurando a grade de um berço de madeira clara, sorrindo de boca aberta, em um quarto com quadro de arco-íris, quadro de estrela e planta ao fundo.",
            lines: ["one baby → the baby’s crib"], note: "(o berço do bebê) · Singular → adicione ’s." },
          { tag: "2. PLURAL", c: "teal", v: "mint", id: "w08p6b", alt: "Dois bebês em pé no mesmo berço, sorrindo",
            ph: "Foto: dois bebês em pé lado a lado segurando a grade de um berço de madeira clara, um de body bege e outro de body verde-claro, os dois sorrindo, em um quarto com quadros de balão e de nuvens e uma planta ao fundo.",
            lines: ["two babies → the babies’ crib"], note: "(o berço dos bebês) · Plural já terminado em s → adicione apenas ’." } ] },
        { t: "sec", text: "ATENÇÃO!", c: "red" },
        { t: "compare", items: [
          { wrong: "babies’s", right: "babies’", rnote: "O apóstrofo vem depois do s." } ] },
        { t: "sec", text: "PRATIQUE", c: "teal" },
        { t: "lead", text: "Transforme usando o possessivo correto." },
        { t: "rows", items: [
          { n: "1", text: "one baby / blanket → the baby’s blanket", c: "teal" },
          { n: "2", text: "two babies / toys → the babies’ toys", c: "teal" },
          { n: "3", text: "two babies / room → the babies’ room", c: "teal" } ] },
        { t: "sec", text: "RESUMINDO", c: "yellow" },
        { t: "table", head: ["SINGULAR / PLURAL", "POSSESSIVO"], rows: [
          { a: "baby", b: "baby’s", v: "lilac" },
          { a: "babies", b: "babies’", v: "mint" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Hoje, concentre-se na posição do apóstrofo." } ] },

      // ───────────────────────── página impressa 07 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 07" },
        { t: "title", en: "NAMES ENDING IN S", pt: "E quando o nome já termina em s?" },
        { t: "lead", text: "Nesta aula, vamos usar a forma mais prática para iniciantes: nome + ’s." },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "REGRA DE HOJE", text: "Quando um nome termina em s, neste curso usaremos nome + ’s." },
        { t: "image", id: "w08p7a", alt: "Lucas sorrindo à mesa diante de um prato de massa",
          ph: "Foto: rapaz branco de cabelo castanho cacheado e barba curta, camisa verde-escura sobre camiseta branca, sentado à mesa sorrindo para a câmera, com um garfo na mão e uma tigela branca de espaguete ao molho de tomate à sua frente." },
        { t: "note", v: "cream", bold: true, text: "Lucas’s food\nExemplo: a comida de Lucas." },
        { t: "grid", cols: 3, items: [
          { kicker: "1 DONO", title: "the dog’s food", v: "lilac", c: "purple" },
          { kicker: "VÁRIOS DONOS", title: "the dogs’ food", v: "mint", c: "teal" },
          { kicker: "NOME TERMINADO EM S", title: "Lucas’s food", v: "cream", c: "green" } ] },
        { t: "note", v: "gray", text: "Observe onde o apóstrofo aparece em cada caso." },
        { t: "sec", text: "PRACTIQUE", c: "teal" },
        { t: "fill", id: "w08e4", sub: "Escreva a forma possessiva correta.", items: [
          { pre: "1. Emily / aunt →", answers: ["Emily’s aunt"], v: "mint" },
          { pre: "2. friends / cats →", answers: ["friends’ cats"], v: "lilac" },
          { pre: "3. father / car →", answers: ["father’s car"], v: "cream" },
          { pre: "4. Joe / bag →", answers: ["Joe’s bag"], v: "mint" },
          { pre: "5. Peter / book →", answers: ["Peter’s book"], v: "lilac" },
          { pre: "6. parents / house →", answers: ["parents’ house"], v: "cream" } ] },
        { t: "sec", text: "RESUMINDO", c: "purple" },
        { t: "table", head: ["PALAVRA", "POSSESSIVO"], rows: [
          { a: "dog", b: "dog’s", v: "lilac" },
          { a: "dogs", b: "dogs’", v: "mint" },
          { a: "Lucas", b: "Lucas’s", v: "cream" } ] },
        { t: "key", v: "lilac", text: "Agora você já conhece três formas importantes do possessive ’s." } ] },

      // ───────────────────────── página impressa 08 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 08" },
        { t: "title", en: "LET’S TALK!", pt: "Use possessive ’s em diálogos curtos." },
        { t: "image", id: "w08p8a", alt: "Ana, Daniel e Emma conversando na biblioteca ao lado de uma mochila",
          ph: "Foto: três jovens sentados a uma mesa de madeira em uma biblioteca. À esquerda, Ana, de jaqueta jeans e camiseta branca, cabelo castanho comprido; ao centro, Daniel, de moletom verde-escuro, sorrindo; à direita, Emma, loira de suéter branco com listras pretas. Sobre a mesa há um laptop aberto, um smartphone preto, um caderno com caneta e uma mochila verde-oliva no centro. Cada pessoa tem uma etiqueta branca com o seu nome." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Hi, Daniel!" },
          { s: "b", text: "Daniel: Hi, Ana!" },
          { s: "a", text: "Ana: Whose backpack is this?" },
          { s: "b", text: "Daniel: It’s Lucas’s backpack." },
          { s: "a", text: "Ana: And who is Lucas?" },
          { s: "b", text: "Daniel: He is Emma’s brother." } ] },
        { t: "note", v: "lilac", text: "Observe como usamos possessive ’s para objetos e relações familiares." },
        { t: "sec", text: "YOUR TURN", c: "teal" },
        { t: "lead", text: "Observe a cena e responda usando possessive ’s." },
        { t: "image", id: "w08p8b", alt: "Emma, Lucas e Sofia à mesa da biblioteca com celular, mochila e livro",
          ph: "Foto: três jovens sentados a uma mesa de madeira em uma biblioteca. À esquerda, Emma, de cabelo louro-escuro e suéter bege; ao centro, Lucas, de cabelo castanho cacheado e moletom azul-marinho, segurando um smartphone preto; à direita, Sofia, de cabelo castanho comprido e jaqueta jeans. Sobre a mesa há um livro de capa escura e uma mochila bege. Cada pessoa tem uma etiqueta branca com o seu nome." },
        { t: "free", id: "w08f1", items: [
          { n: "1", kicker: "RESPONDA", prefix: "Whose phone is this?", ideas: "", v: "mint", c: "teal" },
          { n: "2", kicker: "RESPONDA", prefix: "Whose bag is this?", ideas: "", v: "lilac", c: "purple" },
          { n: "3", kicker: "RESPONDA", prefix: "Who is Emma’s brother?", ideas: "", v: "cream", c: "yellow" } ] },
        { t: "note", v: "gray", bar: true, kicker: "DICA RÁPIDA", text: "Use ’s para mostrar posse ou relação:\nEmma’s phone, Lucas’s bag, Emma’s brother." } ] },

      // ───────────────────────── página impressa 09 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 09" },
        { t: "title", en: "REVISANDO O QUE APRENDEMOS", pt: "Vamos revisar os principais pontos desta aula." },
        { t: "grid", cols: 1, items: [
          { kicker: "USAMOS ’S PARA PESSOAS", title: "Mostra posse ou relação.", body: "My mother’s car.", foot: "(O carro da minha mãe.)", v: "lilac", c: "purple" },
          { kicker: "NÃO USAMOS ’S COM OBJETOS, LUGARES, ANIMAIS OU IDEIAS", title: "Usamos apenas ’.", body: "the laptop (o laptop)\nthe city (a cidade)", v: "mint", c: "teal" },
          { kicker: "SE O NOME JÁ TERMINA COM S", title: "acrescentamos apenas ’.", body: "James’ book", foot: "(o livro do James)", v: "cream", c: "yellow" },
          { kicker: "REGRA DE OURO", title: "Pessoas e relações → ’s", body: "Objetos, lugares, animais e ideias → ’", v: "gray", c: "navy" } ] },
        { t: "note", v: "gray", kicker: "EXEMPLOS RÁPIDOS:", text: "my friend’s phone (o celular do meu amigo)\nthe dog (o cachorro)\nthe idea (a ideia)" },
        { t: "sec", text: "EXERCÍCIO FINAL", c: "purple" },
        { t: "image", id: "w08p9a", alt: "Rapaz estudando com caderno e laptop",
          ph: "Foto: rapaz branco de cabelo castanho cacheado e camiseta azul-marinho, sentado à mesa de madeira, escrevendo com uma caneta em um caderno aberto ao lado de um laptop aberto, com estante e plantas desfocadas ao fundo." },
        { t: "fill", id: "w08e5", sub: "Complete as frases com ’s ou ’.", wide: true, items: [
          { pre: "1. This is Maria", answers: ["’s"], post: " backpack.", v: "lilac" },
          { pre: "2. I love my sister", answers: ["’s"], post: " smile.", v: "lilac" },
          { pre: "3. We visited the city", answers: ["’"], post: " museum.", v: "mint" },
          { pre: "4. Lucas is my brother", answers: ["’s"], post: " best friend.", v: "lilac" },
          { pre: "5. The teacher", answers: ["’s"], post: " desk is near the window.", v: "lilac" },
          { pre: "6. My cousin", answers: ["’s"], post: " car is very fast.", v: "lilac" },
          { pre: "7. The dog", answers: ["’"], post: " tail is wagging.", v: "mint" },
          { pre: "8. That is the restaurant", answers: ["’"], post: " menu.", v: "mint" },
          { pre: "9. James is Tom", answers: ["’s"], post: " classmate.", v: "lilac" },
          { pre: "10. The children", answers: ["’s"], post: " toys are on the floor.", v: "lilac" } ] },
        { t: "note", v: "navy", bar: true, bold: true, kicker: "PARABÉNS!", text: "Você concluiu a Aula 08.\nContinue praticando para fixar ainda mais!" },
        { t: "key", v: "teal", text: "“Practice makes progress.” · A prática gera progresso." },
        { t: "sec", text: "PRÓXIMA ETAPA: PRATIQUE MAIS!", c: "teal" },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 08", body: "Assista à videoaula completa desta aula.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Quer praticar conversação com IA? Use o possessive ’s e as perguntas com Whose…?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "note", v: "gray", text: "Use ao final das frases: ’s para pessoas e relações / ’ para objetos, lugares, animais e ideias." },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 09 · POSSESSIVE ADJECTIVES" },
        { t: "bar", label: "PROGRESSO", value: "08 DE 42 AULAS", pct: "19%" } ] }
    ]
  },

  {
      id: 9, code: "AULA 09", title: "Possessive Adjectives", sub: "De quem é cada coisa: my, your, his, her, its, our e their.",
      time: "15 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 09" },
          { t: "title", en: "POSSESSIVE ADJECTIVES", pt: "De quem estamos falando?" },
          { t: "lead", text: "Usamos possessive adjectives para indicar a quem algo pertence ou com quem algo está relacionado." },
          { t: "image", id: "w09p1", ph: "Foto: uma moça de jaqueta jeans e um rapaz de suéter verde sentados lado a lado à mesa de uma cafeteria, sorrindo e conversando, com um notebook aberto e um copo de café sobre a mesa.", alt: "Dupla conversando numa cafeteria" },
          { t: "note", v: "navy", bold: true, kicker: "LEMBRE-SE", text: "Possessive adjective + substantivo." },
          { t: "note", v: "cream", bar: true, bold: true, text: "Eles vêm antes do substantivo." },
          { t: "sec", text: "CORRESPONDÊNCIA ENTRE SUBJECT PRONOUNS E POSSESSIVE ADJECTIVES" },
          { t: "table", head: ["SUBJECT PRONOUN", "POSSESSIVE ADJECTIVE"], rows: [
            { a: "I", b: "my", v: "mint" },
            { a: "you", b: "your", v: "lilac" },
            { a: "he", b: "his", v: "cream" },
            { a: "she", b: "her", v: "mint" },
            { a: "it", b: "its", v: "lilac" },
            { a: "we", b: "our", v: "cream" },
            { a: "you", b: "your", v: "mint" },
            { a: "they", b: "their", v: "lilac" } ] },
          { t: "note", v: "gray", kicker: "PRESTE ATENÇÃO!", text: "O possessive adjective mostra posse ou relação e sempre vem antes do substantivo que ele acompanha." },
          { t: "sec", text: "PONTE DA AULA ANTERIOR:", c: "purple" },
          { t: "lead", text: "Na Aula 08, vimos a ideia de posse usando ’s (apóstrofo + s)." },
          { t: "cards", cols: 2, items: [
            { tag: "MIKE", c: "teal", v: "mint", id: "w09p1a", ph: "Foto: rapaz de camisa jeans sobre camiseta branca, sorrindo, sentado ao ar livre numa praça arborizada.", alt: "Mike sorrindo ao ar livre", lines: ["Mike’s car", "his car"], note: "Mike’s car = o carro do Mike · his car = o carro dele" },
            { tag: "ANNA", c: "purple", v: "lilac", id: "w09p1b", ph: "Foto: moça de óculos e blusa bege segurando livros diante das estantes de uma biblioteca.", alt: "Anna com livros na biblioteca", lines: ["Anna’s book", "her book"], note: "Anna’s book = o livro da Anna · her book = o livro dela" } ] },
          { t: "note", v: "navy", bar: true, bold: true, text: "Nesta aula, você vai aprender a evitar repetição de nomes usando my, your, his, her, its, our e their antes dos substantivos!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 02" },
          { t: "title", en: "MY × YOUR", pt: "Use my para falar de algo relacionado a mim e your para falar de algo relacionado a você." },
          { t: "grid", cols: 2, items: [
            { title: "I → my", v: "mint", c: "teal" },
            { title: "you → your", v: "lilac", c: "purple" } ] },
          { t: "steps", items: [
            { n: "1", tag: "EXEMPLO 1", c: "teal", v: "mint", id: "w09p2a", ph: "Foto: moça de jaqueta jeans sobre camiseta branca, sorrindo para a câmera, sentada à mesa de uma cafeteria com um caderno e um copo de café.", alt: "Kelly sorrindo na cafeteria", lines: ["Hi!", "I’m Kelly.", "My last name is Silva."] },
            { n: "2", tag: "EXEMPLO 2", c: "purple", v: "lilac", id: "w09p2b", ph: "Foto: moça de suéter bege segurando um copo de café e rapaz de suéter verde sorrindo, olhando um para o outro numa cafeteria.", alt: "Dupla conversando numa cafeteria", lines: ["You have black eyes.", "Your eyes are black."] },
            { n: "3", tag: "EXEMPLO 3", c: "navy", v: "gray", id: "w09p2c", ph: "Foto: celular preto deitado sobre uma mesa de madeira, com um vasinho de planta ao lado.", alt: "Celular preto sobre a mesa", lines: ["My phone is black."] },
            { n: "4", tag: "EXEMPLO 4", c: "yellow", v: "cream", id: "w09p2d", ph: "Foto: mochila azul-marinho apoiada no encosto de uma cadeira de madeira.", alt: "Mochila azul numa cadeira", lines: ["Your bag is blue."] } ] },
          { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE:", text: "Use my para coisas relacionadas a você (I)\ne your para coisas relacionadas ao seu ouvinte (you)." } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 03" },
          { t: "title", en: "HIS × HER", pt: "Use his para falar de algo relacionado a ele e her para falar de algo relacionado a ela." },
          { t: "cards", cols: 2, items: [
            { tag: "HE → HIS", c: "teal", v: "mint", id: "w09p3a", ph: "Foto: retrato circular de um rapaz de camisa azul-marinho, de braços cruzados e sorrindo, sobre fundo azul-claro.", alt: "Retrato de rapaz de braços cruzados", note: "Use his para falar de algo relacionado a ele." },
            { tag: "SHE → HER", c: "purple", v: "lilac", id: "w09p3b", ph: "Foto: retrato circular de uma moça de blusa verde-azulada, de braços cruzados e sorrindo, sobre fundo azul-claro.", alt: "Retrato de moça de braços cruzados", note: "Use her para falar de algo relacionado a ela." } ] },
          { t: "steps", items: [
            { n: "1", tag: "EXEMPLO 1", c: "teal", v: "mint", id: "w09p3c", ph: "Foto: homem sorridente de camisa azul-marinho e relógio de pulso, de braços cruzados, em pé na rua diante de um táxi amarelo.", alt: "Taxista ao lado do táxi amarelo", lines: ["He’s a taxi driver.", "His car is yellow."] },
            { n: "2", tag: "EXEMPLO 2", c: "purple", v: "lilac", id: "w09p3d", ph: "Foto: cantora no palco com microfone na mão e jaqueta brilhante, sob luzes coloridas, com um letreiro de neon rosa escrito POP ao fundo.", alt: "Cantora no palco com letreiro POP", lines: ["Lisa is a singer.", "Her favorite kind of music is pop."] } ] },
          { t: "note", v: "gray", kicker: "LÓGICA:", text: "O pronome pessoal (he / she) sempre vira o possessivo (his / her)." },
          { t: "table", head: ["NOME", "PRONOME → POSSESSIVE ADJECTIVE"], rows: [
            { a: "Daniel", b: "he → his", v: "mint" },
            { a: "Lisa", b: "she → her", v: "lilac" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 04" },
          { t: "title", en: "IT → ITS", pt: "Use its para falar de algo relacionado a coisas, animais ou seres quando usamos it." },
          { t: "image", id: "w09p4", ph: "Foto: coruja marrom e bege de olhos amarelos pousada num galho coberto de musgo, olhando para a frente, com o fundo desfocado.", alt: "Coruja de olhos amarelos num galho" },
          { t: "cards", items: [
            { tag: "EXEMPLO 1", c: "teal", v: "mint", lines: ["It’s an owl.", "Its eyes are yellow."] } ] },
          { t: "note", v: "gray", kicker: "ATENÇÃO", text: "it’s = it is\nits = possessive adjective" },
          { t: "cards", items: [
            { tag: "EXEMPLO 2", c: "yellow", v: "cream", id: "w09p4a", ph: "Foto: logotipo azul da empresa Global Solutions, com um símbolo circular e o nome escrito embaixo.", alt: "Logotipo azul da Global Solutions", lines: ["The company has a logo.", "Its logo is blue."] } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 05" },
          { t: "title", en: "OUR, YOUR & THEIR", pt: "Agora vamos falar de posse ou relação com we, you e they." },
          { t: "cards", items: [
            { tag: "WE → OUR", c: "teal", v: "mint", id: "w09p5a", ph: "Foto: moça de jaqueta jeans e rapaz de suéter verde sentados à mesa de um parque, sorrindo um para o outro, com copos de café na mesa e árvores ao fundo.", alt: "Dois amigos conversando no parque", lines: ["We’re friends.", "Our favorite hobby is playing in the park."] },
            { tag: "YOU → YOUR", c: "purple", v: "lilac", id: "w09p5b", ph: "Foto: moça de suéter bege e rapaz de óculos e camisa jeans estudando juntos diante de um notebook aberto, numa sala com estantes ao fundo.", alt: "Dois estudantes diante de um notebook", lines: ["You’re students.", "Your English classes are online."] },
            { tag: "THEY → THEIR", c: "navy", v: "gray", id: "w09p5c", ph: "Foto: dois alunos sentados à mesa com cadernos abertos conversando com um professor de camisa azul-clara e tablet na mão, com um quadro branco escrito ENGLISH ao fundo.", alt: "Alunos e professor numa sala de aula", lines: ["Bob and Stephany are students.", "Their English teacher is Mr. Peter."] } ] },
          { t: "sec", text: "VOCABULÁRIO AUXILIAR · TÍTULOS E TRATAMENTOS", c: "purple" },
          { t: "table", head: ["TRATAMENTO", "SIGNIFICADO"], rows: [
            { a: "Mr.", b: "senhor (usado antes do sobrenome de um homem)", v: "mint" },
            { a: "Mrs.", b: "senhora (usado antes do sobrenome de uma mulher casada)", v: "lilac" },
            { a: "Ms.", b: "senhora ou senhorita (uso geral, estado civil desconhecido ou não especificado)", v: "cream" },
            { a: "Miss", b: "senhorita (usado antes do sobrenome de uma mulher solteira)", v: "mint" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 06" },
          { t: "title", en: "SUBJECT PRONOUN × POSSESSIVE ADJECTIVE", pt: "A tabela completa para consultar sempre que precisar." },
          { t: "table", head: ["SUBJECT PRONOUN", "POSSESSIVE ADJECTIVE"], rows: [
            { a: "I", b: "my", v: "mint" },
            { a: "you", b: "your", v: "lilac" },
            { a: "he", b: "his", v: "cream" },
            { a: "she", b: "her", v: "mint" },
            { a: "it", b: "its", v: "lilac" },
            { a: "we", b: "our", v: "cream" },
            { a: "they", b: "their", v: "mint" } ] },
          { t: "note", v: "gray", kicker: "REGRA:", text: "O possessive adjective vem antes de um substantivo." },
          { t: "sec", text: "EXEMPLOS", c: "purple" },
          { t: "table", head: ["FRASE COM O PRONOME", "FRASE COM O POSSESSIVO"], rows: [
            { a: "I am Ana.", b: "My name is Ana.", v: "mint" },
            { a: "She is Lisa.", b: "Her book is new.", v: "lilac" },
            { a: "They are friends.", b: "Their teacher is Peter.", v: "cream" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 07" },
          { t: "title", en: "YOUR TURN! CHOOSE THE RIGHT WORD", pt: "Complete as frases com o possessive adjective correto." },
          { t: "chips", title: "WORD BANK", items: [
            { t: "my", c: "teal" },
            { t: "your", c: "purple" },
            { t: "her", c: "teal" },
            { t: "our", c: "purple" },
            { t: "their", c: "teal" },
            { t: "its", c: "purple" } ] },
          { t: "fill", id: "w09f1", title: "COMPLETE COM O POSSESSIVE ADJECTIVE CORRETO", sub: "Use as palavras do word bank: my · your · her · our · their · its", items: [
            { pre: "1. The dog is very cute.", answers: ["Its"], post: "name is Ben.", v: "mint" },
            { pre: "2. We are at school.", answers: ["Our"], post: "school is very nice.", v: "lilac" },
            { pre: "3. I have a new laptop.", answers: ["My"], post: "laptop is white.", v: "cream" },
            { pre: "4. Sandra and Jenny are friends.", answers: ["Their"], post: "school is near my house.", v: "mint" },
            { pre: "5. Nick has a sister.", answers: ["Her"], post: "name is Debbie.", v: "lilac" },
            { pre: "6. Hello! What’s", answers: ["your"], post: "name?", v: "cream" } ] },
          { t: "check", id: "w09c1", title: "SELF-CHECK", items: [
            "After finishing, check your answers.",
            "Did you choose the correct possessive adjective?" ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 08" },
          { t: "title", en: "LET’S TALK!", pt: "My, your, his, her…" },
          { t: "image", id: "w09p8", ph: "Foto: moça de jaqueta jeans gesticulando enquanto conversa com um rapaz de suéter verde diante de um notebook aberto, numa cafeteria movimentada com outras pessoas estudando ao fundo.", alt: "Ana e Daniel conversando na cafeteria" },
          { t: "dialogue", items: [
            { s: "a", text: "Ana: Hi, Daniel! Is this your laptop?" },
            { s: "b", text: "Daniel: Yes. My laptop is new." },
            { s: "a", text: "Ana: And who is Emma?" },
            { s: "b", text: "Daniel: She is my sister. Her laptop is black." },
            { s: "a", text: "Ana: And Lucas?" },
            { s: "b", text: "Daniel: He is my friend. His classes are online." } ] },
          { t: "sec", text: "YOUR TURN", c: "purple" },
          { t: "lead", text: "Create 2 short sentences using possessive adjectives. Use the prompts or your own ideas." },
          { t: "free", id: "w09f2", cols: 2, items: [
            { n: "1", kicker: "COMPLETE A FRASE", prefix: "My phone is …", ideas: "Use a sugestão ou a sua própria ideia.", v: "mint", c: "teal" },
            { n: "2", kicker: "COMPLETE A FRASE", prefix: "Our teacher is …", ideas: "Use a sugestão ou a sua própria ideia.", v: "lilac", c: "purple" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 09", page: "PÁGINA 09" },
          { t: "title", en: "POSSESSIVE ADJECTIVES", pt: "Você já sabe usar possessive adjectives." },
          { t: "kicker", text: "AULA CONCLUÍDA · USE ESTE CHECKLIST ANTES DE AVANÇAR" },
          { t: "check", id: "w09c2", title: "EU CONSIGO...", items: [
            "usar my e your.",
            "usar his e her.",
            "usar its corretamente.",
            "usar our e their.",
            "relacionar subject pronouns e possessive adjectives.",
            "usar possessive adjectives em pequenas conversas." ] },
          { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 8", text: "Se ainda confunde my, your, his, her, its, our e their." },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 09", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: descreva pessoas e objetos usando my, your, his, her, its, our e their.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 10 · THE ALPHABET", body: "Você vai aprender a soletrar nomes e palavras." },
          { t: "bar", label: "PROGRESSO", value: "09 DE 42 AULAS", pct: "21%" } ] }
      ]
    },

  {
      id: 10, code: "AULA 10", title: "The Alphabet", sub: "Reconheça, pronuncie e soletre as letras em inglês.",
      time: "15 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 01" },
          { t: "title", en: "THE ALPHABET", pt: "Spell it!" },
          { t: "lead", text: "Aprenda a reconhecer, pronunciar e soletrar letras em inglês." },
          { t: "note", v: "mint", kicker: "ANTES DE COMEÇAR", text: "Você já precisou soletrar seu nome em um cadastro, hotel ou aeroporto?" },
          { t: "image", id: "w10p1", src: "/lessons/fotos/aula_10_pagina_01_foto_01.jpg", alt: "Atendente e passageiro conversando no balcão do aeroporto", ph: "Foto: balcão de atendimento de um aeroporto. Atrás do balcão, uma atendente sorridente de cabelo preso, blazer azul-marinho, camisa branca e lenço no pescoço. Na frente, um rapaz de cabelo castanho cacheado, camisa bege e mochila nas costas, sorrindo para ela. Ao fundo, uma placa com o símbolo de avião, painéis de voo e janelas amplas. Dois balões de fala brancos sobre a foto: um com A: What’s your name? e outro com B: My name is Robert Clarkson Wilson." },
          { t: "dialogue", items: [
            { s: "a", text: "What’s your name?" },
            { s: "b", text: "My name is Robert Clarkson Wilson." } ] },
          { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A:", c: "purple" },
          { t: "grid", cols: 3, items: [
            { title: "dizer seu nome.", v: "mint", c: "teal" },
            { title: "identificar first, middle e last name.", v: "lilac", c: "purple" },
            { title: "soletrar nomes e palavras simples.", v: "cream", c: "yellow" } ] },
          { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Reconhecer o alfabeto em inglês e usar as letras para soletrar nomes e palavras." },
          { t: "meta", label: "TEMPO ESTIMADO", value: "10–15 min" },
          { t: "note", v: "lilac", bar: true, text: "O alfabeto é a base para entender nomes, cadastros, soletração e comunicação do dia a dia." } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 02" },
          { t: "title", en: "FIRST, MIDDLE & LAST NAME", pt: "Aprenda a identificar as partes de um nome completo." },
          { t: "image", id: "w10p2", alt: "Recepcionista sorrindo sob a placa COURSE REGISTRATION", ph: "Foto: recepcionista de cabelo preso e blazer azul-marinho com camisa branca e lenço, sorrindo de perfil atrás do balcão de atendimento, com a mão no teclado. Acima dela, uma placa azul-escura com os dizeres COURSE REGISTRATION. Ao fundo, uma planta e janelas amplas." },
          { t: "sec", text: "REGISTRATION" },
          { t: "lead", text: "Full name (as in your ID or passport)" },
          { t: "key", v: "gray", text: "Robert Clarkson Wilson" },
          { t: "grid", cols: 3, items: [
            { kicker: "first name = Robert", title: "primeiro nome", v: "mint", c: "teal" },
            { kicker: "middle name = Clarkson", title: "nome do meio", v: "lilac", c: "purple" },
            { kicker: "last name = Wilson", title: "sobrenome", v: "cream", c: "yellow" } ] },
          { t: "dialogue", items: [
            { s: "a", text: "What’s your name?" },
            { s: "b", text: "My name is Robert Clarkson Wilson." } ] },
          { t: "sec", text: "DICAS IMPORTANTES", c: "purple" },
          { t: "rows", items: [
            { n: "1", text: "Use seu nome completo em formulários, cadastros e documentos oficiais.", c: "teal" },
            { n: "2", text: "Em muitos países, o first name é o que as pessoas usam no dia a dia.", c: "purple" },
            { n: "3", text: "Atente-se à ordem do nome ao viajar ou fazer reservas internacionais.", c: "yellow" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 03" },
          { t: "title", en: "HOW DO YOU SPELL YOUR NAME?", pt: "Aprenda a perguntar e responder como se soletra um nome." },
          { t: "image", id: "w10p3a", alt: "Diálogo em balões sobre a foto do balcão do aeroporto", ph: "Foto: o mesmo balcão do aeroporto. A atendente de blazer azul-marinho sorri atrás do balcão e o rapaz de camisa bege e mochila conversa com ela. Ao fundo, a placa com o símbolo de avião, um painel de voo e janelas. Sobre a foto, seis balões de fala brancos com o diálogo completo, alternando A e B." },
          { t: "dialogue", items: [
            { s: "a", text: "What’s your name?" },
            { s: "b", text: "My name is Robert Clarkson Wilson." },
            { s: "a", text: "How do you spell your first name?" },
            { s: "b", text: "R-O-B-E-R-T." },
            { s: "a", text: "How do you spell your last name?" },
            { s: "b", text: "W-I-L-S-O-N." } ] },
          { t: "note", v: "lilac", bar: true, kicker: "FICA A DICA!", text: "Em inglês, usamos o verbo spell quando queremos dizer soletrar." } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 04" },
          { t: "title", en: "THE ALPHABET: A TO Z", pt: "Veja as 26 letras do alfabeto em inglês." },
          { t: "chips", items: [
            { t: "A", c: "teal" },
            { t: "B", c: "navy" },
            { t: "C", c: "navy" },
            { t: "D", c: "navy" },
            { t: "E", c: "teal" },
            { t: "F", c: "navy" },
            { t: "G", c: "navy" },
            { t: "H", c: "navy" },
            { t: "I", c: "teal" },
            { t: "J", c: "navy" },
            { t: "K", c: "navy" },
            { t: "L", c: "navy" },
            { t: "M", c: "navy" },
            { t: "N", c: "navy" },
            { t: "O", c: "teal" },
            { t: "P", c: "navy" },
            { t: "Q", c: "navy" },
            { t: "R", c: "navy" },
            { t: "S", c: "navy" },
            { t: "T", c: "navy" },
            { t: "U", c: "teal" },
            { t: "V", c: "navy" },
            { t: "W", c: "navy" },
            { t: "X", c: "navy" },
            { t: "Y", c: "navy" },
            { t: "Z", c: "navy" } ] },
          { t: "grid", cols: 2, items: [
            { kicker: "VOWELS", title: "As vogais são as letras usadas para formar os sons das palavras.", body: "Vowels: A, E, I, O, U", v: "mint", c: "teal" },
            { kicker: "CONSONANTS", title: "As consoantes são as outras letras do alfabeto.", body: "Consonants: as outras letras", v: "lilac", c: "purple" } ] },
          { t: "note", v: "cream", bar: true, kicker: "DICA IMPORTANTE", text: "Aprender o alfabeto é o primeiro passo para soletrar nomes, palavras e se comunicar com confiança em inglês." } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 05" },
          { t: "title", en: "ALPHABET PRONUNCIATION – A TO M", pt: "Ouça e pratique a pronúncia das letras de A até M." },
          { t: "table", head: ["LETRA", "PRONÚNCIA"], rows: [
            { a: "A", b: "/eɪ/", v: "mint" },
            { a: "B", b: "/biː/", v: "lilac" },
            { a: "C", b: "/siː/", v: "cream" },
            { a: "D", b: "/diː/", v: "mint" },
            { a: "E", b: "/iː/", v: "lilac" },
            { a: "F", b: "/ef/", v: "cream" },
            { a: "G", b: "/dʒiː/", v: "mint" },
            { a: "H", b: "/eɪtʃ/", v: "lilac" },
            { a: "I", b: "/aɪ/", v: "cream" },
            { a: "J", b: "/dʒeɪ/", v: "mint" },
            { a: "K", b: "/keɪ/", v: "lilac" },
            { a: "L", b: "/el/", v: "cream" },
            { a: "M", b: "/em/", v: "mint" } ] },
          { t: "note", v: "lilac", bar: true, kicker: "WATCH OUT", text: "Alguns sons das letras podem confundir quem fala português.\nPreste atenção nestes pares:" },
          { t: "cards", cols: 2, items: [
            { tag: "E × I", c: "teal", v: "mint", lines: ["/iː/ (E) é mais longo e fechado."], note: "Ex.: see /siː/ × sit /sɪt/" },
            { tag: "G × J", c: "purple", v: "lilac", lines: ["/dʒiː/ (G) é diferente de /dʒeɪ/ (J)."], note: "Ex.: go /ɡoʊ/ × joke /dʒoʊk/" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 06" },
          { t: "title", en: "ALPHABET PRONUNCIATION: N TO Z", pt: "Ouça e pratique a pronúncia das letras de N até Z." },
          { t: "table", head: ["LETRA", "PRONÚNCIA"], rows: [
            { a: "N", b: "/en/", v: "mint" },
            { a: "O", b: "/oʊ/", v: "lilac" },
            { a: "P", b: "/piː/", v: "cream" },
            { a: "Q", b: "/kjuː/", v: "mint" },
            { a: "R", b: "/ɑːr/", v: "lilac" },
            { a: "S", b: "/es/", v: "cream" },
            { a: "T", b: "/tiː/", v: "mint" },
            { a: "U", b: "/juː/", v: "lilac" },
            { a: "V", b: "/viː/", v: "cream" },
            { a: "W", b: "/ˈdʌbəljuː/", v: "mint" },
            { a: "X", b: "/eks/", v: "lilac" },
            { a: "Y", b: "/waɪ/", v: "cream" },
            { a: "Z", b: "/ziː/", v: "mint" } ] },
          { t: "note", v: "cream", bar: true, bold: true, text: "American English: Z = zee /ziː/\nBritish English: Z = zed /zed/" },
          { t: "note", v: "lilac", bar: true, kicker: "WATCH OUT: M × N", text: "Em inglês, M e N são diferentes.\nPreste atenção ao som nasal:" },
          { t: "cards", cols: 2, items: [
            { tag: "M", c: "purple", v: "lilac", lines: ["/em/"], note: "lábios fechados" },
            { tag: "N", c: "purple", v: "lilac", lines: ["/en/"], note: "língua nos dentes" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 07" },
          { t: "title", en: "SPELL IT! LET’S PRACTICE", pt: "Agora pratique a soletração de nomes e palavras." },
          { t: "sec", text: "EXAMPLES: SPELL THESE NAMES AND WORDS" },
          { t: "table", head: ["WORD", "SPELLING"], rows: [
            { a: "Elizabeth", b: "E-L-I-Z-A-B-E-T-H", v: "mint" },
            { a: "Clark", b: "C-L-A-R-K", v: "lilac" },
            { a: "house", b: "H-O-U-S-E", v: "cream" },
            { a: "computer", b: "C-O-M-P-U-T-E-R", v: "mint" },
            { a: "students", b: "S-T-U-D-E-N-T-S", v: "lilac" },
            { a: "mirror", b: "M-I-R-R-O-R", v: "cream" } ] },
          { t: "sec", text: "USE THESE EXPRESSIONS", c: "purple" },
          { t: "chips", items: [
            { t: "How do you spell that?", c: "purple" },
            { t: "Can you spell that?", c: "purple" },
            { t: "How do you spell it?", c: "purple" } ] },
          { t: "sec", text: "YOUR TURN", c: "purple" },
          { t: "image", id: "w10p7", src: "/lessons/fotos/aula_10_pagina_07_foto_01.jpg", alt: "Recepção de um coworking com a atendente e o visitante", ph: "Foto: recepção de um espaço de coworking, com parede de tijolos, luminárias pendentes e as letras COWORKING SPACE na parede. Atrás do balcão, uma moça de cabelo preso, camiseta preta e crachá no cordão, sorrindo. Na frente, o rapaz de camisa bege e mochila, apoiado no balcão. Vasos de planta sobre o balcão e ao fundo." },
          { t: "lead", text: "Imagine you are at a coworking reception. The receptionist asks:" },
          { t: "free", id: "w10f1", cols: 2, items: [
            { n: "1", kicker: "RESPONDA", prefix: "What’s your name?", ideas: "Escreva a sua resposta em inglês.", v: "mint", c: "teal" },
            { n: "2", kicker: "SOLETRE", prefix: "How do you spell it?", ideas: "Soletre o seu nome, letra por letra.", v: "cream", c: "yellow" } ] },
          { t: "key", v: "cream", text: "Great! Practice with a partner. Then switch roles." } ] },

        { blocks: [
          { t: "badge", label: "AULA 10", page: "PÁGINA 08" },
          { t: "title", en: "AULA CONCLUÍDA", pt: "Você já sabe o alfabeto em inglês." },
          { t: "kicker", text: "USE ESTE CHECKLIST ANTES DE AVANÇAR" },
          { t: "check", id: "w10c1", title: "EU CONSIGO...", items: [
            "identificar first, middle e last name.",
            "perguntar How do you spell...?",
            "reconhecer as letras do alfabeto.",
            "distinguir vowels e consonants.",
            "pronunciar letras do alfabeto.",
            "soletrar meu nome e palavras simples." ] },
          { t: "objective", v: "red", title: "REVISE AS PÁGINAS 4 A 7", text: "Se ainda confunde nomes de letras parecidas." },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 10", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: diga seu nome e soletre seu first name e seu last name. Depois, soletre uma palavra simples.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 11 · SCHOOL VOCABULARY", body: "Você aprenderá vocabulário básico de sala de aula e objetos escolares." },
          { t: "bar", label: "PROGRESSO", value: "10 DE 42 AULAS", pct: "24%" } ] }
      ]
    },

  {
    id: 11, code: "AULA 11", title: "School Vocabulary", sub: "Vocabulário e expressões da sala de aula.",
    time: "14 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 11" },
        { t: "title", en: "SCHOOL VOCABULARY", pt: "Around the classroom" },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Você consegue identificar objetos e pedir ajuda em inglês dentro da sala de aula?" },
        { t: "image", id: "w11p1a", alt: "Professor e quatro alunos numa sala de aula, com o quadro branco escrito Classroom language.",
          ph: "Ilustração: sala de aula clara com janelas grandes e prédios ao fundo. O professor, de camisa verde-escura e calça bege, sorri em pé e aponta com a caneta para o quadro branco, onde está escrito à mão “Classroom language / Open your book. / Take out your notebook. / Work in pairs. / Any questions?”. À esquerda, um cartaz com LEARN PRACTICE SPEAK REPEAT e uma aluna de jaqueta jeans sentada com livro e copo de café; ao lado dela, um rapaz de camiseta verde-oliva e óculos com um notebook. De costas, um aluno de camiseta azul-marinho; à direita, uma aluna de blusa amarela com caneta na mão. Sobre as mesas há livros abertos, garrafa térmica e estojo roxo; no mural, um post-it amarelo com You’ve got this!." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "identificar objetos da sala.", v: "mint", c: "teal" },
          { title: "entender comandos simples.", v: "lilac", c: "purple" },
          { title: "pedir ajuda e permissão.", v: "cream", c: "yellow" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Reconhecer vocabulário escolar e usar expressões simples para se comunicar em sala." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12–16 min" },
        { t: "note", v: "gray", text: "Você vai aprender palavras e expressões úteis para estudar, perguntar e interagir em inglês com mais segurança." } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 02" },
        { t: "title", en: "IN THE CLASSROOM", pt: "Objetos e pessoas da sala" },
        { t: "image", id: "w11p2a", alt: "Sala de aula com etiquetas apontando os objetos e as pessoas em inglês.",
          ph: "Ilustração: a mesma sala de aula, agora com etiquetas brancas ligadas por um fio a cada elemento: windows (as janelas à esquerda), shelf (a estante de livros), whiteboard (o quadro branco com o texto Classroom language), teacher (o professor de camisa verde-escura apontando para o quadro), world map (o mapa-múndi na parede à direita), books (os livros da estante), pupils (o aluno de camiseta azul-marinho visto de costas), desk (a mesa da aluna de jaqueta jeans) e chair (a cadeira preta em primeiro plano)." },
        { t: "note", v: "mint", text: "pupils = alunos (termo mais escolar)\nstudents = termo mais geral" },
        { t: "sec", text: "OBSERVE E APRENDA", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "WHAT’S THIS?", c: "purple", v: "lilac", lines: ["It’s a desk.", "It’s a chair."] },
          { tag: "WHO’S THIS?", c: "teal", v: "mint", lines: ["She’s the teacher.", "They are students."] } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "FOCO DA PÁGINA", text: "Reconhecer palavras do ambiente da sala e relacioná-las à imagem." } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 03" },
        { t: "title", en: "SCHOOL SUPPLIES", pt: "Materiais escolares do dia a dia" },
        { t: "image", id: "w11p3a", alt: "Mesa de madeira com mochila, livros, caderno e material escolar.",
          ph: "Foto: mesa de madeira clara vista de cima e de frente, com uma mochila azul-marinho ao centro, uma pilha de livros amarelo e verde, um caderno espiral aberto com caneta preta, um lápis amarelo, uma borracha rosa, uma régua metálica, um apontador azul, um estojo azul-marinho, uma tesoura de cabo azul e um porta-lápis de tela preta. À esquerda, um vaso de planta verde e uma caneca azul-marinho; à direita, uma suculenta e um quadro com LEARN PRACTICE SPEAK REPEAT; ao fundo, uma janela com luz do dia." },
        { t: "cards", cols: 2, items: [
          { tag: "pen", c: "teal", v: "mint", id: "w11p3b", alt: "Caneta esferográfica preta.", ph: "Foto: caneta esferográfica preta de ponta retrátil, na diagonal, sobre fundo branco." },
          { tag: "pencil", c: "purple", v: "lilac", id: "w11p3c", alt: "Lápis amarelo de grafite.", ph: "Foto: lápis amarelo de grafite com ponta apontada, na diagonal, sobre fundo branco." },
          { tag: "eraser / rubber", c: "yellow", v: "cream", id: "w11p3d", alt: "Borracha escolar rosa.", ph: "Foto: borracha escolar retangular rosa, vista de lado, sobre fundo branco." },
          { tag: "ruler", c: "teal", v: "mint", id: "w11p3e", alt: "Régua metálica com escala.", ph: "Foto: régua metálica prateada com a escala em centímetros, na diagonal, sobre fundo branco." },
          { tag: "pencil case", c: "purple", v: "lilac", id: "w11p3f", alt: "Estojo azul-marinho fechado.", ph: "Foto: estojo de tecido azul-marinho fechado, com zíper e puxador de couro, sobre fundo branco." },
          { tag: "pencil sharpener", c: "yellow", v: "cream", id: "w11p3g", alt: "Apontador de plástico azul.", ph: "Foto: apontador de plástico azul translúcido com lâmina metálica, visto de frente, sobre fundo branco." },
          { tag: "school bag", c: "teal", v: "mint", id: "w11p3h", alt: "Mochila escolar azul-marinho.", ph: "Foto: mochila escolar azul-marinho de frente, com alça superior e bolso frontal com zíper, sobre fundo branco." },
          { tag: "scissors", c: "purple", v: "lilac", id: "w11p3i", alt: "Tesoura com cabo azul.", ph: "Foto: tesoura aberta com lâminas prateadas e cabo azul, sobre fundo branco." } ] },
        { t: "sec", text: "DICA RÁPIDA", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "AMERICAN × BRITISH", c: "purple", v: "lilac", lines: ["eraser = mais comum no inglês americano", "rubber = forma comum no inglês britânico"] },
          { tag: "EXEMPLOS", c: "teal", v: "mint", lines: ["This is a pen.", "That’s an eraser."] } ] },
        { t: "sec", text: "YOUR TURN", c: "yellow" },
        { t: "rows", items: [
          { n: "1", text: "Aponte para um objeto e diga o nome em inglês.", c: "yellow" },
          { n: "2", text: "Escolha um item e diga: This is a…", c: "yellow" },
          { n: "3", text: "Se souber, soletre a palavra.", c: "yellow" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 04" },
        { t: "title", en: "CLASSROOM COMMANDS", pt: "Entenda instruções simples em sala" },
        { t: "cards", cols: 2, items: [
          { tag: "COMANDO 1", c: "teal", v: "mint", id: "w11p4a", alt: "Professor pede que os alunos se sentem.", ph: "Ilustração: o professor de camisa verde-escura, em pé diante do quadro branco, sorri e aponta com a mão para baixo. Três alunos estão sentados nas carteiras: a aluna de jaqueta jeans, o aluno de camiseta azul-marinho de costas e a aluna de blusa amarela. No fundo, o cartaz LEARN PRACTICE SPEAK REPEAT e um vaso de planta.", lines: ["Sit down."], note: "sente-se" },
          { tag: "COMANDO 2", c: "purple", v: "lilac", id: "w11p4b", alt: "Professor pede que os alunos fiquem de pé.", ph: "Ilustração: o professor de camisa verde-escura, em pé diante do quadro branco, levanta o dedo indicador. Três alunos estão de pé, de costas para quem vê: a aluna de blusa amarela, o aluno de camiseta azul-marinho e a aluna de jaqueta jeans. No fundo, o cartaz LEARN PRACTICE SPEAK REPEAT e o post-it You’ve got this!.", lines: ["Stand up."], note: "levante-se" },
          { tag: "COMANDO 3", c: "yellow", v: "cream", id: "w11p4c", alt: "Três alunos com os livros abertos sobre a mesa.", ph: "Ilustração: três alunos sentados lado a lado numa mesa de madeira, com os livros abertos à frente: a aluna de jaqueta jeans, o aluno de camiseta azul-marinho e a aluna de blusa amarela, todos sorrindo e olhando para as páginas. Ao fundo, o cartaz LEARN PRACTICE SPEAK REPEAT, uma estante e um copo de café sobre a mesa.", lines: ["Open your books."], note: "abra seus livros" },
          { tag: "COMANDO 4", c: "teal", v: "mint", id: "w11p4d", alt: "Três alunos com os livros fechados sobre a mesa.", ph: "Ilustração: os mesmos três alunos sentados à mesa, agora com as mãos sobre os livros verde-azulados fechados: a aluna de jaqueta jeans, o aluno de camiseta azul-marinho e a aluna de blusa amarela, todos sorrindo. Ao fundo, o cartaz LEARN PRACTICE SPEAK REPEAT e a estante de livros.", lines: ["Close your books."], note: "feche seus livros" } ] },
        { t: "mc", id: "w11mc1", title: "LISTEN & DO", v: "gray", questions: [
          { q: "1. Quando o professor diz “Stand up.”, você…", options: ["senta", "levanta"], answer: 1 },
          { q: "2. Quando o professor diz ‘Open your books.’, você…", options: ["abre", "fecha"], answer: 0 } ] },
        { t: "objective", v: "navy", title: "FOCO DA PÁGINA:", text: "reconhecer comandos frequentes sem precisar de tradução palavra por palavra." } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 05" },
        { t: "title", en: "EXCUSE ME…", pt: "Pedindo ajuda com educação" },
        { t: "image", id: "w11p5a", alt: "Aluna levanta a mão na sala enquanto o professor escreve no quadro.",
          ph: "Ilustração: sala de aula com janelas amplas e prédios ao fundo. Uma aluna de jaqueta jeans, sentada, levanta a mão e sorri. Ao lado dela, dois rapazes sentados (um de camiseta azul-marinho e outro de camiseta verde-oliva e óculos) e, à direita, uma aluna de blusa amarela. O professor, de camisa verde-escura, sorri em pé junto ao quadro branco, onde está escrito à mão “Classroom language / Be polite. / Ask with respect. / Help and learn together.”. À esquerda, o cartaz LEARN PRACTICE SPEAK REPEAT; sobre as mesas, cadernos, garrafa térmica e estojo roxo." },
        { t: "dialogue", items: [
          { s: "a", text: "Excuse me, may I drink some water, please?" },
          { s: "b", text: "Yes." } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Excuse me, how do you say this in English?" },
          { s: "b", text: "That’s an eraser." } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Excuse me, can you repeat that, please?" },
          { s: "b", text: "Sure." } ] },
        { t: "sec", text: "USE PARA…", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "pedir ajuda", v: "lilac", c: "purple" },
          { title: "pedir repetição", v: "mint", c: "teal" },
          { title: "falar com educação", v: "cream", c: "yellow" } ] },
        { t: "sec", text: "EXPRESSÕES-CHAVE", c: "purple" },
        { t: "rows", items: [
          { text: "Excuse me… = para chamar a atenção com educação.", c: "yellow" },
          { text: "How do you say this in English? = para perguntar uma palavra.", c: "yellow" },
          { text: "Can you repeat that, please? = para pedir repetição.", c: "yellow" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 06" },
        { t: "title", en: "MAY I…?", pt: "Pedindo permissão" },
        { t: "image", id: "w11p6a", alt: "Professor conversa com dois alunos sentados à mesa.",
          ph: "Ilustração: o professor de camisa verde-escura, à direita, sorri e fala com a mão aberta em gesto de explicação, com uma caneca branca escrita WSA ao lado. À esquerda, uma aluna de jaqueta jeans sorri e olha para ele; ao lado dela, um rapaz de camiseta verde-oliva, cabelo cacheado e óculos, segura uma caneta sobre um caderno aberto, com um notebook à frente. Ao fundo, janela com prédios, o cartaz LEARN PRACTICE SPEAK REPEAT, o quadro branco e vasos de planta." },
        { t: "dialogue", items: [
          { s: "a", text: "Student: Excuse me, may I go to the bathroom, please?" },
          { s: "b", text: "Teacher: Yes, you may." } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Student: May I drink some water, please?" },
          { s: "b", text: "Teacher: Yes, you may." } ] },
        { t: "sec", text: "PADRÃO ÚTIL", c: "purple" },
        { t: "key", v: "lilac", text: "May I + ação + please?" },
        { t: "rows", items: [
          { text: "May I open the window, please?", c: "purple" },
          { text: "May I sit here, please?", c: "purple" } ] },
        { t: "sec", text: "YOUR TURN", c: "teal" },
        { t: "rows", items: [
          { n: "1", text: "Complete oralmente: May I ____________, please?", c: "teal" },
          { n: "2", text: "Pratique com um colega: um pede permissão e o outro responde ‘Yes, you may.’", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 07" },
        { t: "title", en: "BATHROOM, RESTROOM, TOILET…?", pt: "Variações comuns em contextos diferentes" },
        { t: "cards", cols: 2, items: [
          { tag: "USA", c: "teal", v: "mint", id: "w11p7a", alt: "Bandeira dos Estados Unidos em um círculo.", ph: "Ilustração: ícone circular com a bandeira dos Estados Unidos, listras vermelhas e brancas e o cantão azul com estrelas.", lines: ["restroom", "bathroom"] },
          { tag: "UK", c: "purple", v: "lilac", id: "w11p7b", alt: "Bandeira do Reino Unido em um círculo.", ph: "Ilustração: ícone circular com a bandeira do Reino Unido, cruzes vermelhas e brancas sobre fundo azul.", lines: ["toilet"] },
          { tag: "AIRPLANE / FORMAL", c: "yellow", v: "cream", id: "w11p7c", alt: "Ícone de avião amarelo.", ph: "Ilustração: ícone de avião visto de cima, desenhado em traço amarelo sobre fundo creme.", lines: ["lavatory"] },
          { tag: "SIGNS", c: "teal", v: "mint", id: "w11p7d", alt: "Ícone circular com a sigla WC.", ph: "Ilustração: círculo azul-petróleo com as letras WC em branco, no estilo das placas de sinalização.", lines: ["WC"] } ] },
        { t: "note", v: "mint", text: "WC ainda aparece em placas e sinalização, especialmente em alguns países europeus." },
        { t: "image", id: "w11p7e", alt: "Placa de banheiro e sinalização de aeroporto indicando os restrooms.",
          ph: "Foto: imagem dividida em duas partes. À esquerda, uma placa azul-marinho na parede com os pictogramas de homem e mulher, a palavra Restrooms e uma seta apontando para a direita. À direita, o saguão de um aeroporto com pé-direito alto e paredes de vidro: painéis de voos pretos no teto, uma placa amarela com “↑ Gates A1–A12 / Baggage Claim / Restrooms →” e passageiros de costas caminhando com mochilas e malas." },
        { t: "sec", text: "PERGUNTAS ÚTEIS", c: "purple" },
        { t: "rows", items: [
          { text: "Where’s the restroom?", c: "purple" },
          { text: "Where’s the bathroom?", c: "purple" },
          { text: "Where’s the men’s room?", c: "purple" },
          { text: "Where’s the ladies’ room?", c: "purple" } ] },
        { t: "objective", v: "navy", title: "QUANDO USAR", text: "Use a expressão que fizer mais sentido no lugar e no país." } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 08" },
        { t: "title", en: "LET’S TALK!", pt: "Usando o vocabulário em contexto" },
        { t: "image", id: "w11p8a", alt: "Ana, Daniel e o professor conversam à mesa com livros abertos.",
          ph: "Ilustração: três pessoas sentadas à mesa de madeira, com etiquetas roxas com os nomes. À esquerda, Ana, de jaqueta jeans e brincos de argola, sorri e aponta para o lápis. Ao centro, Daniel, de camiseta verde-oliva, cabelo cacheado e óculos, segura um lápis amarelo levantado. À direita, Teacher, o professor de camisa verde-escura, sorri com as mãos entrelaçadas sobre a mesa. Sobre a mesa há livros abertos, um copo de café, um livro azul fechado e uma garrafa térmica preta. Ao fundo, o cartaz LEARN PRACTICE SPEAK REPEAT e o quadro branco com o texto “Classroom language / Excuse me. / Can you repeat that, please? / May I…? / Yes, you may.”." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Excuse me, Daniel. What’s this?" },
          { s: "b", text: "Daniel: It’s a pencil." },
          { s: "a", text: "Ana: How do you spell it?" },
          { s: "b", text: "Daniel: P-E-N-C-I-L." },
          { s: "a", text: "Ana: Thanks!" } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Excuse me, teacher. Can you repeat that, please?" },
          { s: "b", text: "Teacher: Sure." },
          { s: "a", text: "Ana: May I drink some water, please?" },
          { s: "b", text: "Teacher: Yes, you may." } ] },
        { t: "sec", text: "YOUR TURN", c: "purple" },
        { t: "rows", items: [
          { n: "1", text: "Escolha dois objetos perto de você e diga o nome em inglês.", c: "purple" },
          { n: "2", text: "Soletre uma das palavras.", c: "purple" },
          { n: "3", text: "Faça um pedido com ‘Excuse me…’ ou ‘May I…?’", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 11", page: "PÁGINA 09" },
        { t: "kicker", text: "AULA CONCLUÍDA" },
        { t: "title", en: "VOCÊ JÁ SABE USAR VOCABULÁRIO DE SALA.", pt: "Use este checklist antes de avançar." },
        { t: "check", id: "w11c1", title: "EU CONSIGO...", items: [
          "identificar objetos comuns da sala.",
          "reconhecer materiais escolares.",
          "entender comandos simples.",
          "pedir ajuda com Excuse me…",
          "pedir permissão com May I…?",
          "perguntar onde fica o banheiro." ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 8", text: "se ainda confunde os objetos da sala, os comandos ou os pedidos com Excuse me / May I." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 11", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: peça ajuda, peça repetição e faça um pedido com May I…?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 12 · COLORS", body: "Você aprenderá a perguntar e responder sobre cores em inglês." },
        { t: "bar", label: "PROGRESSO", value: "11 DE 42 AULAS", pct: "26%" } ] }
    ]
  },

  {
      id: 12, code: "AULA 12", title: "Colors", sub: "Reconheça e diga as cores em inglês.",
      time: "14 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 12" },
          { t: "title", en: "COLORS", pt: "What color is it?" },
          { t: "lead", text: "Nesta aula, você vai aprender a reconhecer e dizer cores em inglês." },
          { t: "image", id: "w12p1a", alt: "Dois amigos conversando na mesa de um café", ph: "Foto: dois amigos sentados à mesa de um café, de frente para um notebook prateado. À esquerda, uma mulher de blusa lilás segura uma caneca azul; à direita, um homem de camisa verde aponta para a tela. Sobre a mesa há um vaso de planta, um caderno preto, um livro aberto, um caderno azul com um celular verde em cima, uma garrafa térmica amarela e um estojo vermelho. Ao fundo, parede roxa, prateleiras e janelas grandes." },
          { t: "dialogue", items: [
            { s: "a", text: "What color is it?" },
            { s: "b", text: "It’s blue." } ] },
          { t: "image", id: "w12p1b", alt: "Caneca azul vista de lado", ph: "Foto: caneca de cerâmica azul-royal vista de lado, com a alça virada para a direita, sobre fundo lilás claro, com três risquinhos roxos de destaque no canto superior direito." },
          { t: "sec", text: "CORES QUE VOCÊ VAI APRENDER:", c: "purple" },
          { t: "chips", items: [
            { t: "black", c: "navy" },
            { t: "blue", c: "blue" },
            { t: "brown", c: "cream" },
            { t: "white", c: "white" },
            { t: "gray", c: "gray" },
            { t: "green", c: "green" },
            { t: "orange", c: "orange" },
            { t: "pink", c: "lilac" },
            { t: "red", c: "red" },
            { t: "yellow", c: "yellow" } ] },
          { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Aprender vocabulário básico de cores e como responder à pergunta “What color is it?”." } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 02" },
          { t: "title", en: "10 COLORS YOU NEED TO KNOW", pt: "What color is it?" },
          { t: "lead", text: "Estas são as cores básicas mais usadas no inglês do dia a dia." },
          { t: "cards", cols: 2, items: [
            { tag: "BLACK", c: "navy", v: "gray", id: "w12p2a", alt: "Celular preto", ph: "Foto: celular preto de costas, em pé e levemente inclinado, mostrando o bloco de três câmeras, sobre fundo branco." },
            { tag: "BLUE", c: "blue", v: "mint", id: "w12p2b", alt: "Mochila azul", ph: "Foto: mochila de tecido azul-marinho, de frente, com alças pretas e um zíper vertical no bolso da frente, sobre fundo branco." },
            { tag: "BROWN", c: "cream", v: "cream", id: "w12p2c", alt: "Caneca marrom com café", ph: "Foto: caneca de cerâmica marrom cheia de café preto, vista de lado com a alça à direita, sobre fundo branco." },
            { tag: "WHITE", c: "white", v: "gray", id: "w12p2d", alt: "Camiseta branca", ph: "Foto: camiseta branca de manga curta, estendida de frente, sobre fundo branco." },
            { tag: "GRAY", c: "gray", v: "gray", id: "w12p2e", alt: "Notebook cinza", ph: "Foto: notebook cinza aberto, visto de trás e de lado, sobre fundo branco." },
            { tag: "GREEN", c: "green", v: "mint", id: "w12p2f", alt: "Planta verde em vaso", ph: "Foto: planta de folhas verdes largas em um vaso bege claro, sobre fundo branco." },
            { tag: "ORANGE", c: "orange", v: "cream", id: "w12p2g", alt: "Laranja com folha", ph: "Foto: uma laranja inteira com uma folha verde presa ao cabinho, sobre fundo branco." },
            { tag: "PINK", c: "lilac", v: "lilac", id: "w12p2h", alt: "Caderno rosa espiral", ph: "Foto: caderno de capa rosa com espiral dourada, levemente inclinado, sobre fundo branco." },
            { tag: "RED", c: "red", v: "gray", id: "w12p2i", alt: "Carro vermelho", ph: "Foto: carro sedã vermelho visto de frente e de três quartos, sobre fundo branco." },
            { tag: "YELLOW", c: "yellow", v: "cream", id: "w12p2j", alt: "Garrafa térmica amarela", ph: "Foto: garrafa térmica amarela em pé, com tampa preta e alça de rosca, sobre fundo branco." } ] },
          { t: "note", v: "lilac", kicker: "DICA", text: "Aprenda as cores com objetos reais.\nIsso ajuda você a memorizar mais rápido." } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 03" },
          { t: "title", en: "WHAT COLOR IS IT?", pt: "Perguntar e responder cores." },
          { t: "lead", text: "Use esta estrutura para perguntar e responder em inglês." },
          { t: "table", head: ["QUESTION", "ANSWER"], rows: [
            { a: "What color is it?", b: "It’s + color.", v: "lilac" } ] },
          { t: "steps", items: [
            { n: "1", tag: "WHAT COLOR IS IT?", c: "purple", v: "lilac", lines: ["It’s black."], id: "w12p3a", alt: "Celular preto sobre a mesa", ph: "Foto: celular preto deitado de costas sobre uma superfície branca, levemente inclinado, mostrando o bloco de três câmeras." },
            { n: "2", tag: "WHAT COLOR IS IT?", c: "yellow", v: "cream", lines: ["It’s yellow."], id: "w12p3b", alt: "Garrafa térmica amarela sobre a mesa", ph: "Foto: garrafa térmica amarela com tampa preta em pé sobre uma mesa de madeira clara, com parede branca e uma plantinha ao fundo." },
            { n: "3", tag: "WHAT COLOR IS IT?", c: "blue", v: "mint", lines: ["It’s blue."], id: "w12p3c", alt: "Caderno azul sobre a mesa", ph: "Foto: caderno de capa azul com espiral, fechado sobre uma mesa de madeira clara, com uma caneta preta ao lado." },
            { n: "4", tag: "WHAT COLOR IS IT?", c: "green", v: "mint", lines: ["It’s green."], id: "w12p3d", alt: "Planta verde em vaso sobre a mesa", ph: "Foto: planta de folhas verdes largas em vaso bege claro, sobre uma mesinha redonda de madeira, com uma estante desfocada ao fundo." } ] },
          { t: "note", v: "cream", bar: true, kicker: "ESTRUTURA", text: "What color is it? = Que cor é isso?\nIt’s blue. = É azul." },
          { t: "sec", text: "LEIA EM VOZ ALTA", c: "purple" },
          { t: "rows", items: [
            { n: "1", text: "What color is it? It’s red.", c: "red" },
            { n: "2", text: "What color is it? It’s white.", c: "white" },
            { n: "3", text: "What color is it? It’s orange.", c: "orange" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 04" },
          { t: "title", en: "YOUR TURN", pt: "Colors in real life" },
          { t: "lead", text: "Agora é a sua vez de observar e dizer cores." },
          { t: "cards", cols: 2, items: [
            { tag: "1", c: "purple", v: "mint", note: "What color is it?", id: "w12p4a", alt: "Celular verde em pé", ph: "Foto: celular verde-escuro apoiado em pé sobre uma mesa de madeira, visto de costas, com a parede clara ao fundo." },
            { tag: "2", c: "purple", v: "lilac", note: "What color is it?", id: "w12p4b", alt: "Mochila azul-marinho", ph: "Foto: mochila de tecido azul-marinho com fivelas e alças de couro caramelo, apoiada no chão, com uma planta e a parede clara ao fundo." },
            { tag: "3", c: "purple", v: "cream", note: "What color is it?", id: "w12p4c", alt: "Carro branco na rua", ph: "Foto: carro utilitário branco parado na rua, visto de frente e de três quartos, com árvores e prédios ao fundo." },
            { tag: "4", c: "purple", v: "mint", note: "What color is it?", id: "w12p4d", alt: "Caneca amarela sobre a mesa", ph: "Foto: caneca de cerâmica amarela vista de lado, com a alça à direita, sobre uma mesa de madeira, com a sala desfocada ao fundo." },
            { tag: "5", c: "purple", v: "lilac", note: "What color is it?", id: "w12p4e", alt: "Camiseta rosa no cabide", ph: "Foto: camiseta rosa-escura de manga curta pendurada em um cabide de madeira, sobre fundo claro." },
            { tag: "6", c: "purple", v: "cream", note: "What color is it?", id: "w12p4f", alt: "Planta verde em vaso sobre a mesa", ph: "Foto: planta de folhas verdes largas em vaso bege claro, sobre uma mesa de madeira, com um quadro colorido na parede ao fundo." } ] },
          { t: "fill", id: "w12e1", title: "COMPLETE COM A COR DE CADA OBJETO", items: [
            { pre: "1. It’s", answers: ["green"], post: ".", note: "celular verde", v: "mint" },
            { pre: "2. It’s", answers: ["blue"], post: ".", note: "mochila azul-marinho", v: "lilac" },
            { pre: "3. It’s", answers: ["white"], post: ".", note: "carro branco", v: "cream" },
            { pre: "4. It’s", answers: ["yellow"], post: ".", note: "caneca amarela", v: "mint" },
            { pre: "5. It’s", answers: ["pink"], post: ".", note: "camiseta rosa", v: "lilac" },
            { pre: "6. It’s", answers: ["green"], post: ".", note: "planta verde", v: "cream" } ] },
          { t: "sec", text: "LOOK AROUND YOU", c: "purple" },
          { t: "lead", text: "Escolha 3 objetos perto de você e diga as cores deles em inglês." },
          { t: "free", id: "w12f1", items: [
            { n: "1", kicker: "OBJETO 1", prefix: "It’s…", ideas: "Diga a cor do primeiro objeto perto de você.", v: "mint", c: "teal" },
            { n: "2", kicker: "OBJETO 2", prefix: "It’s…", ideas: "Diga a cor do segundo objeto perto de você.", v: "lilac", c: "purple" },
            { n: "3", kicker: "OBJETO 3", prefix: "It’s…", ideas: "Diga a cor do terceiro objeto perto de você.", v: "cream", c: "yellow" } ] },
          { t: "note", v: "cream", bar: true, bold: true, text: "Fale em voz alta para treinar sua pronúncia." } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 05" },
          { t: "kicker", text: "BONUS" },
          { t: "title", en: "IDIOMS WITH COLORS", pt: "Expressões com cores" },
          { t: "note", v: "gray", text: "Idiom = expressão cujo significado não é apenas a tradução literal das palavras." },
          { t: "cards", items: [
            { tag: "1 · A WHITE LIE", c: "teal", v: "mint", lines: ["It was just a white lie."], note: "uma pequena mentira, geralmente dita para não magoar alguém.", id: "w12p5a", src: "/lessons/fotos/aula_12_pagina_02_foto_01.jpg", alt: "Duas amigas conversando no sofá", ph: "Foto: duas amigas sentadas no sofá da sala. À esquerda, uma mulher de suéter verde com a mão no peito segura uma xícara branca; à direita, uma mulher de blusa lilás com o cabelo preso escuta sorrindo, apoiada na mão. Um balão de fala saindo da mulher de verde diz “Your new hairstyle looks amazing!”. Ao fundo, abajur aceso, estante e quadro na parede." },
            { tag: "2 · THE BLACK SHEEP", c: "purple", v: "lilac", lines: ["Uncle John is the black sheep of the family."], note: "a pessoa considerada diferente do restante do grupo ou da família.", id: "w12p5b", src: "/lessons/fotos/aula_12_pagina_02_foto_02.jpg", alt: "Família reunida à mesa com um bolo de aniversário", ph: "Foto: família de cinco pessoas reunida à mesa, à noite, em volta de um bolo com uma vela acesa. Da esquerda para a direita: senhora de cabelo branco e blusa creme, senhor grisalho de suéter laranja, moça de cabelo castanho e blusa creme, rapaz de jaqueta de couro preta com estampa de banda, e mulher de blusa azul. Sobre a mesa, canecas azuis e um vasinho de planta; ao fundo, luzinhas penduradas." } ] },
          { t: "note", v: "lilac", text: "Estas expressões são um bônus cultural desta aula." } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 06" },
          { t: "kicker", text: "BONUS" },
          { t: "title", en: "MORE IDIOMS WITH COLORS", pt: "Mais expressões com cores" },
          { t: "steps", items: [
            { n: "1", tag: "FEELING BLUE", c: "purple", v: "lilac", lines: ["Erik feels blue when he is alone."], note: "sentir-se triste ou para baixo.", id: "w12p6a", alt: "Rapaz triste sentado no sofá", ph: "Foto: rapaz de moletom azul sentado sozinho no sofá azul da sala, com a cabeça apoiada na mão e olhar cabisbaixo. Sobre a mesinha à frente, uma caneca azul e um caderno azul; ao fundo, janela à noite com a cidade acesa, estante de livros e um abajur." },
            { n: "2", tag: "GIVE THE GREEN LIGHT", c: "teal", v: "mint", lines: ["The manager gave the green light to the project."], note: "aprovar ou dar permissão para alguma coisa.", id: "w12p6b", alt: "Dupla no escritório aprovando um projeto no tablet", ph: "Foto: no escritório, uma mulher de blazer bege sentada à mesa sorri para um homem de camisa verde em pé ao lado. Os dois seguram um tablet que mostra um círculo verde com um sinal de confirmação e a etiqueta “PROJECT APPROVED”. Sobre a mesa, notebook, caneca azul e um caderno aberto com caneta." },
            { n: "3", tag: "RED CARPET TREATMENT", c: "yellow", v: "cream", lines: ["When my parents visit me, I give them the red carpet treatment."], note: "tratar alguém de forma muito especial.", id: "w12p6c", alt: "Homem recebendo os pais na porta de casa", ph: "Foto: homem de camisa vermelha recebe os pais na porta de casa, com o braço estendido em sinal de boas-vindas. A mãe, de cabelo branco e casaco bege, e o pai, de suéter azul-marinho, entram por um tapete vermelho no corredor. Ao fundo, luzinhas penduradas e plantas." } ] },
          { t: "note", v: "lilac", bar: true, text: "Você não precisa decorar todos agora.\nO objetivo é começar a reconhecê-los." } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 07" },
          { t: "title", en: "LET’S TALK!", pt: "Colors around us" },
          { t: "image", id: "w12p7", alt: "Ana e Daniel conversando sobre a mochila azul no café", ph: "Foto: Ana e Daniel sentados à mesa de um café. Ana, de camiseta amarela e cabelo preso, aponta para a mochila azul-marinho que Daniel, de camisa verde, segura sobre a mesa. Sobre a mesa há um livro aberto, uma caneca verde, um vaso de planta, um caderno preto e um notebook prateado. Ao fundo, parede roxa, estantes e outras pessoas trabalhando." },
          { t: "dialogue", items: [
            { s: "a", text: "Ana: I like your bag!" },
            { s: "b", text: "Daniel: Thanks!" },
            { s: "a", text: "Ana: What color is it?" },
            { s: "b", text: "Daniel: It’s blue." },
            { s: "a", text: "Ana: And your notebook?" },
            { s: "b", text: "Daniel: It’s black." } ] },
          { t: "sec", text: "YOUR TURN", c: "purple" },
          { t: "free", id: "w12f2", cols: 2, items: [
            { n: "1", kicker: "WHAT COLOR IS YOUR PHONE?", prefix: "It’s…", ideas: "Diga a cor do seu celular.", v: "mint", c: "teal" },
            { n: "2", kicker: "WHAT COLOR IS YOUR BAG?", prefix: "It’s…", ideas: "Diga a cor da sua mochila ou bolsa.", v: "lilac", c: "purple" } ] },
          { t: "sec", text: "BONUS CHALLENGE", c: "purple" },
          { t: "lead", text: "Qual expressão combina melhor com cada situação?" },
          { t: "chips", items: [
            { t: "feeling blue", c: "blue" },
            { t: "green light", c: "green" },
            { t: "red carpet treatment", c: "red" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 12", page: "PÁGINA 08" },
          { t: "kicker", text: "AULA CONCLUÍDA" },
          { t: "title", en: "COLORS", pt: "Você já sabe falar sobre cores." },
          { t: "lead", text: "Use este checklist antes de avançar." },
          { t: "check", id: "w12c1", title: "EU CONSIGO...", items: [
            "reconhecer as dez cores da aula.",
            "perguntar What color is it?",
            "responder It’s + color.",
            "identificar cores em objetos do cotidiano.",
            "dizer a cor de objetos próximos de mim.",
            "reconhecer algumas expressões com cores." ] },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 12", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: responda perguntas como What color is it? e diga a cor de objetos ao seu redor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 13 · ARTICLES A / AN", body: "Você aprenderá a usar a e an corretamente." },
          { t: "bar", label: "PROGRESSO", value: "12 DE 42 AULAS", pct: "29%" } ] }
      ]
    },

  {
    id: 13, code: "AULA 13", title: "Articles a / an",
    sub: "Use a antes de som consonantal e an antes de som vocálico.",
    time: "15–20 minutos",
    pages: [

      // ───────────────────────── página impressa 01 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13" },
        { t: "title", en: "ARTICLES: A / AN", pt: "Use a before a consonant sound. Use an before a vowel sound." },
        { t: "note", v: "gray", bar: true, kicker: "ANTES DE COMEÇAR", bold: true, text: "Você escolhe pelo som ou pela letra?" },
        { t: "image", id: "w13p1", alt: "Dois estudantes conversando com um notebook sobre a mesa de um café",
          ph: "Ilustração: dois estudantes sentados lado a lado à mesa de madeira de um café-biblioteca, sorrindo e conversando. À esquerda, uma jovem de cabelo escuro preso, blusa lilás e brincos de argola segura um lápis; à direita, um rapaz de barba curta e camisa verde aponta para a tela de um notebook prateado aberto entre os dois. Sobre a mesa: vaso de planta, copo de café para viagem, livro aberto, cadernos azul-marinho com bloco de notas amarelo, maçã verde, fone de ouvido preto, garrafa térmica azul-marinho, estojo preto e lápis coloridos. Ao fundo, janelas grandes com árvores, luminárias pendentes e estantes de livros." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "PENCIL", c: "teal", v: "mint", id: "w13p1a", alt: "Lápis amarelo apontado",
            ph: "Ilustração: lápis amarelo apontado, na diagonal, com borracha rosa na ponta e grafite preto.",
            lines: ["a pencil"], note: "um lápis" },
          { tag: "APPLE", c: "purple", v: "lilac", id: "w13p1b", alt: "Maçã vermelha com folha verde",
            ph: "Ilustração: maçã vermelha brilhante vista de frente, com cabinho marrom e uma folha verde, sobre fundo branco.",
            lines: ["an apple"], note: "uma maçã" },
          { tag: "UNIVERSITY", c: "teal", v: "mint", id: "w13p1c", alt: "Prédio histórico de universidade",
            ph: "Ilustração: prédio histórico de universidade em tijolo avermelhado, com colunas brancas na entrada e árvores verdes nas laterais, sobre fundo branco.",
            lines: ["a university"], note: "uma universidade" },
          { tag: "HOUR", c: "purple", v: "lilac", id: "w13p1d", alt: "Relógio de parede redondo",
            ph: "Ilustração: relógio de parede redondo com aro preto, mostrador branco, números de 1 a 12 e ponteiros pretos.",
            lines: ["an hour"], note: "uma hora" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Escolher corretamente entre a e an ouvindo o som inicial da palavra." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15–20 min" },
        { t: "note", v: "mint", bar: true, bold: true, kicker: "O SOM VEM PRIMEIRO", text: "Nesta aula, você vai descobrir que a escolha depende do som da palavra, não apenas da primeira letra." } ] },

      // ───────────────────────── página impressa 02 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 02" },
        { t: "title", en: "A + CONSONANT SOUND", pt: "Use a before a consonant sound." },
        { t: "note", v: "mint", bar: true, bold: true, kicker: "RULE", text: "Use a before words that begin with a consonant sound." },
        { t: "cards", cols: 2, items: [
          { tag: "PENCIL", c: "teal", v: "mint", id: "w13p2a", alt: "Lápis amarelo apontado",
            ph: "Ilustração: lápis amarelo apontado, na diagonal, com borracha rosa na ponta e grafite preto, sobre fundo branco.",
            lines: ["a pencil"], note: "um lápis" },
          { tag: "HOUSE", c: "purple", v: "lilac", id: "w13p2b", alt: "Casa moderna de dois andares",
            ph: "Ilustração: casa moderna de dois andares com fachada bege e azul-marinho, janelas grandes iluminadas, caminho de pedra, grama verde e arbustos na frente.",
            lines: ["a house"], note: "uma casa" },
          { tag: "LAPTOP", c: "teal", v: "mint", id: "w13p2c", alt: "Notebook prateado aberto",
            ph: "Ilustração: notebook prateado aberto, visto de frente e um pouco de lado, com a tela preta desligada e o teclado à mostra, sobre fundo branco.",
            lines: ["a laptop"], note: "um laptop" },
          { tag: "BOOK", c: "purple", v: "lilac", id: "w13p2d", alt: "Livro fechado de capa dura azul-marinho",
            ph: "Ilustração: livro fechado de capa dura azul-marinho, visto de lado, com as páginas amareladas aparecendo, sobre fundo branco.",
            lines: ["a book"], note: "um livro" },
          { tag: "SCHOOL BAG", c: "teal", v: "mint", id: "w13p2e", alt: "Mochila escolar azul-marinho",
            ph: "Ilustração: mochila escolar azul-marinho de frente, com alças acolchoadas, bolso frontal com zíper e etiqueta de couro marrom na base.",
            lines: ["a school bag"], note: "uma mochila" },
          { tag: "PAINTER", c: "purple", v: "lilac", id: "w13p2f", alt: "Pintora diante do cavalete",
            ph: "Ilustração: mulher de cabelo preso em coque, camiseta cinza e avental marrom, segurando pincel e paleta de cores, pintando manchas coloridas numa tela sobre um cavalete de madeira.",
            lines: ["a painter"], note: "uma pintora" } ] },
        { t: "note", v: "mint", bar: true, bold: true, kicker: "LEMBRE-SE", text: "Escute o primeiro som da palavra." },
        { t: "sec", text: "DIGA EM VOZ ALTA", c: "purple" },
        { t: "rows", items: [
          { n: "1", text: "a dog", c: "purple" },
          { n: "2", text: "a veterinarian", c: "purple" },
          { n: "3", text: "a pencil case", c: "purple" } ] } ] },

      // ───────────────────────── página impressa 03 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 03" },
        { t: "title", en: "AN + VOWEL SOUND", pt: "Use an before a vowel sound." },
        { t: "note", v: "white", bold: true, text: "Use an before words that begin with a vowel sound." },
        { t: "cards", cols: 2, items: [
          { tag: "APARTMENT", c: "teal", v: "mint", id: "w13p3a", alt: "Prédio de apartamentos moderno",
            ph: "Ilustração: prédio de apartamentos moderno de cinco andares, com sacadas de vidro, madeira clara e concreto cinza, céu azul e árvores na calçada.",
            lines: ["an apartment"], note: "um apartamento" },
          { tag: "APPLE", c: "purple", v: "lilac", id: "w13p3b", alt: "Maçã vermelha com folha verde",
            ph: "Ilustração: maçã vermelha brilhante vista de frente, com cabinho marrom e uma folha verde inclinada, sobre fundo branco.",
            lines: ["an apple"], note: "uma maçã" },
          { tag: "ANIMAL", c: "teal", v: "mint", id: "w13p3c", alt: "Cachorro golden retriever sentado",
            ph: "Ilustração: cachorro golden retriever sentado de frente, pelo dourado, boca aberta e língua para fora, sobre fundo branco.",
            lines: ["an animal"], note: "um animal" },
          { tag: "ELEPHANT", c: "purple", v: "lilac", id: "w13p3d", alt: "Elefante na savana",
            ph: "Ilustração: elefante africano adulto de perfil, com presas brancas e orelhas abertas, caminhando na savana de capim seco, com árvores e morros ao fundo.",
            lines: ["an elephant"], note: "um elefante" },
          { tag: "UMBRELLA", c: "teal", v: "mint", id: "w13p3e", alt: "Guarda-chuva azul aberto",
            ph: "Ilustração: guarda-chuva azul-marinho aberto, apoiado de lado, com cabo curvo preto, sobre fundo branco.",
            lines: ["an umbrella"], note: "um guarda-chuva" },
          { tag: "ENGINEER", c: "purple", v: "lilac", id: "w13p3f", alt: "Engenheiro de capacete com um tablet",
            ph: "Ilustração: engenheiro de capacete branco, óculos e camisa azul-marinho, sorrindo e segurando um tablet, em frente a uma obra com guindaste e estrutura de concreto ao fundo.",
            lines: ["an engineer"], note: "um engenheiro" } ] },
        { t: "note", v: "mint", bar: true, kicker: "DICA", text: "a escolha depende do som, não apenas da letra." },
        { t: "sec", text: "DIGA EM VOZ ALTA", c: "purple" },
        { t: "rows", items: [
          { n: "1", text: "an artist", c: "purple" },
          { n: "2", text: "an orange", c: "purple" },
          { n: "3", text: "an awesome movie", c: "purple" } ] } ] },

      // ───────────────────────── página impressa 04 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 04" },
        { t: "title", en: "LISTEN TO THE SOUND!", pt: "The sound decides." },
        { t: "cards", cols: 2, items: [
          { tag: "A UNIVERSITY", c: "purple", v: "lilac", id: "w13p4a", alt: "Ícone roxo de prédio de universidade entre ondas sonoras",
            ph: "Ilustração: círculo roxo com o desenho branco da fachada de uma universidade (colunas, frontão e bandeirinha no topo), com ondas sonoras lilás saindo dos dois lados do círculo.",
            lines: ["a university", "/juː.../ = sounds like ‘you’"], note: "Começa com som consonantal. Por isso usamos a." },
          { tag: "AN HOUR", c: "teal", v: "mint", id: "w13p4b", alt: "Ícone azul-esverdeado de relógio entre ondas sonoras",
            ph: "Ilustração: círculo azul-esverdeado com o desenho branco de um relógio redondo marcando as horas, com ondas sonoras azul-esverdeadas saindo dos dois lados do círculo.",
            lines: ["an hour", "/aʊər/ = the h is silent"], note: "Começa com som vocálico. Por isso usamos an." } ] },
        { t: "objective", v: "navy", title: "NÃO OLHE SÓ PARA A LETRA.", text: "ESCUTE O SOM INICIAL." },
        { t: "sec", text: "COMPARE", c: "teal" },
        { t: "grid", cols: 2, items: [
          { title: "a university", v: "lilac", c: "purple" },
          { title: "an hour", v: "mint", c: "teal" } ] } ] },

      // ───────────────────────── página impressa 05 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 05" },
        { t: "title", en: "A OR AN? PEOPLE & JOBS", pt: "Use a or an with singular nouns." },
        { t: "cards", cols: 2, items: [
          { tag: "VETERINARIAN", c: "teal", v: "mint", id: "w13p5a", alt: "Veterinária de uniforme verde ao lado de um cachorro",
            ph: "Ilustração: veterinária sorrindo, de uniforme verde-esmeralda e estetoscópio no pescoço, cabelo preso, ao lado de um golden retriever sentado. Ao fundo, o consultório com cartazes de anatomia de cães.",
            lines: ["I’m a veterinarian."], note: "Eu sou veterinária." },
          { tag: "ENGINEER", c: "purple", v: "lilac", id: "w13p5b", alt: "Engenheiro de braços cruzados no escritório",
            ph: "Ilustração: engenheiro sorrindo, de óculos e camisa azul-marinho, braços cruzados. Ao fundo, monitores com gráficos, plantas de projeto na parede e um capacete branco sobre a bancada.",
            lines: ["I’m an engineer."], note: "Eu sou engenheiro." },
          { tag: "PAINTER", c: "teal", v: "mint", id: "w13p5c", alt: "Pintor com pincel diante de uma tela",
            ph: "Ilustração: pintor de barba e cabelo cacheado, camiseta escura e avental manchado de tinta, sorrindo enquanto pinta uma tela colorida com o pincel na mão. Ao fundo, o ateliê com quadros pendurados.",
            lines: ["I’m a painter."], note: "Eu sou pintor." },
          { tag: "ARTIST", c: "purple", v: "lilac", id: "w13p5d", alt: "Artista no ateliê diante do cavalete",
            ph: "Ilustração: artista de cabelo preso em coque, camisa branca aberta e pincel na mão, olhando para a tela sobre o cavalete. Ao fundo, o ateliê com quadros coloridos, plantas e potes de pincéis.",
            lines: ["She’s an artist."], note: "Ela é artista." } ] },
        { t: "grid", cols: 2, items: [
          { title: "What do you do?", v: "mint", c: "teal" },
          { title: "Observe o primeiro som da profissão.", v: "mint", c: "teal" } ] },
        { t: "sec", text: "OUÇA O COMEÇO", c: "purple" },
        { t: "rows", items: [
          { text: "veterinarian → /v/ → a", c: "purple" },
          { text: "engineer → /e/ → an", c: "purple" },
          { text: "painter → /p/ → a", c: "purple" },
          { text: "artist → /ɑː/ → an", c: "purple" } ] } ] },

      // ───────────────────────── página impressa 06 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 06" },
        { t: "title", en: "A OR AN? OBJECTS AROUND US", pt: "Look at the next word." },
        { t: "cards", cols: 2, items: [
          { tag: "BOOK", c: "teal", v: "mint", id: "w13p6a", alt: "Livro aberto",
            ph: "Ilustração: livro aberto ao meio, de capa dura azul, com as páginas creme cheias de texto e um marcador azul-claro, sobre fundo branco.",
            lines: ["a book"] },
          { tag: "SCHOOL BAG", c: "purple", v: "lilac", id: "w13p6b", alt: "Mochila escolar azul-marinho",
            ph: "Ilustração: mochila escolar azul-marinho de frente, com alças acolchoadas, bolso frontal com zíper, losango laranja no centro e base de couro marrom.",
            lines: ["a school bag"] },
          { tag: "PENCIL CASE", c: "teal", v: "mint", id: "w13p6c", alt: "Estojo azul-marinho fechado",
            ph: "Ilustração: estojo retangular azul-marinho fechado, visto de lado, com zíper preto ao longo da tampa, sobre fundo branco.",
            lines: ["a pencil case"] },
          { tag: "UMBRELLA", c: "purple", v: "lilac", id: "w13p6d", alt: "Guarda-chuva azul aberto",
            ph: "Ilustração: guarda-chuva azul-marinho aberto, apoiado de lado, com cabo curvo de madeira, sobre fundo branco.",
            lines: ["an umbrella"] },
          { tag: "ELEPHANT", c: "teal", v: "mint", id: "w13p6e", alt: "Elefante de corpo inteiro",
            ph: "Ilustração: elefante africano cinza de corpo inteiro, visto de lado, com presas brancas, tromba baixa e orelhas abertas, sobre fundo branco.",
            lines: ["an elephant"] },
          { tag: "ORANGE PENCIL CASE", c: "purple", v: "lilac", id: "w13p6f", alt: "Estojo laranja fechado",
            ph: "Ilustração: estojo retangular laranja fechado, visto de lado, com zíper preto ao longo da tampa, sobre fundo branco.",
            lines: ["an orange pencil case"] } ] },
        { t: "note", v: "mint", bar: true, bold: true, kicker: "ATENÇÃO", text: "a pencil case → an orange pencil case\nO artigo acompanha a palavra seguinte." },
        { t: "sec", text: "MINI-PRACTICE", c: "purple" },
        { t: "dialogue", items: [
          { s: "a", text: "What is it?" },
          { s: "b", text: "It’s a book. / It’s an umbrella." } ] } ] },

      // ───────────────────────── página impressa 07 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 07" },
        { t: "title", en: "EXTRA DA VIDEOAULA: THE", pt: "Specific or known in the context." },
        { t: "note", v: "mint", text: "Usamos the quando a pessoa entende qual coisa específica estamos mencionando ou quando ela é identificável no contexto." },
        { t: "cards", cols: 2, items: [
          { tag: "SUN", c: "teal", v: "mint", id: "w13p7a", alt: "Sol brilhando no céu azul",
            ph: "Ilustração: sol brilhando forte no meio de um céu azul, com raios de luz se abrindo e nuvens brancas embaixo.",
            lines: ["the sun"] },
          { tag: "MOON", c: "teal", v: "mint", id: "w13p7b", alt: "Lua cheia no céu noturno",
            ph: "Ilustração: lua cheia branca e detalhada num céu noturno azul-escuro estrelado, com nuvens escuras passando embaixo dela.",
            lines: ["the moon"] },
          { tag: "DOOR", c: "teal", v: "mint", id: "w13p7c", alt: "Porta azul de uma casa branca",
            ph: "Ilustração: porta de madeira azul-esverdeada fechada numa parede branca, com uma lanterna preta de parede ao lado, um vaso de planta verde no chão e sombras de folhas na parede.",
            lines: ["the door"], note: "quando sabemos qual porta" },
          { tag: "BOOK", c: "teal", v: "mint", id: "w13p7d", alt: "Livro azul sobre a mesa de madeira",
            ph: "Ilustração: livro fechado de capa dura azul-marinho apoiado numa mesa de madeira clara, com um vaso de planta desfocado ao fundo.",
            lines: ["the book"], note: "quando falamos de um livro específico" } ] },
        { t: "key", v: "cream", text: "FOCO PRINCIPAL DA AULA: a / an" } ] },

      // ───────────────────────── página impressa 08 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 08" },
        { t: "title", en: "YOUR TURN: A OR AN?", pt: "Complete with a or an." },
        { t: "fill", id: "w13e1", title: "COMPLETE WITH A OR AN.", items: [
          { pre: "1. I’m", answers: ["a"], post: "painter.", v: "mint" },
          { pre: "2. This is", answers: ["a"], post: "school bag.", v: "lilac" },
          { pre: "3. He’s", answers: ["an"], post: "engineer.", v: "mint" },
          { pre: "4. It’s", answers: ["an"], post: "orange pencil case.", v: "lilac" },
          { pre: "5. I’m", answers: ["a"], post: "taxi driver.", v: "mint" },
          { pre: "6. It’s", answers: ["a"], post: "good book.", v: "lilac" },
          { pre: "7. She’s", answers: ["an"], post: "artist.", v: "mint" },
          { pre: "8. That’s", answers: ["an"], post: "awesome movie.", v: "lilac" },
          { pre: "9. He’s", answers: ["a"], post: "scientist.", v: "mint" } ] },
        { t: "answers", v: "mint", title: "CHECK YOUR ANSWERS", items: [
          { k: "1", a: "a", c: "teal" },
          { k: "2", a: "a", c: "teal" },
          { k: "3", a: "an", c: "purple" },
          { k: "4", a: "an", c: "purple" },
          { k: "5", a: "a", c: "teal" },
          { k: "6", a: "a", c: "teal" },
          { k: "7", a: "an", c: "purple" },
          { k: "8", a: "an", c: "purple" },
          { k: "9", a: "a", c: "teal" } ] } ] },

      // ───────────────────────── página impressa 09 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 09" },
        { t: "title", en: "LET’S TALK!", pt: "Using a and an in real life." },
        { t: "image", id: "w13p9a", alt: "Ana mostra um estojo laranja para Daniel na mesa do café",
          ph: "Ilustração: Ana e Daniel sentados à mesa de madeira de um café, um de frente para o outro, com etiquetas brancas com os nomes Ana e Daniel acima de cada um. Ana, de camisa lilás por cima de camiseta branca, cabelo preso e brincos de argola, segura um estojo laranja e mostra para Daniel, de camisa verde aberta e camiseta branca, que sorri olhando para ela. Sobre a mesa: livro aberto, caneca azul, notebook prateado aberto, cadernos azul e verde com caneta e um celular. Ao fundo, janelas grandes com árvores, plantas, luminárias pendentes e outra cliente sentada." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: What’s this?" },
          { s: "b", text: "Daniel: It’s a pencil case." },
          { s: "a", text: "Ana: What color is it?" },
          { s: "b", text: "Daniel: It’s orange." },
          { s: "a", text: "Ana: So, it’s an orange pencil case." },
          { s: "b", text: "Daniel: Yes!" } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: And this?" },
          { s: "b", text: "Daniel: It’s an umbrella." } ] },
        { t: "free", id: "w13f1", items: [
          { n: "1", kicker: "YOUR TURN", prefix: "Look around you and say 3 sentences with It’s a… or It’s an…", ideas: "", v: "lilac", c: "purple" } ] } ] },

      // ───────────────────────── página impressa 10 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 13", page: "PÁGINA 10" },
        { t: "kicker", text: "AULA CONCLUÍDA" },
        { t: "title", en: "VOCÊ JÁ SABE ESCOLHER ENTRE A E AN.", pt: "Use este checklist antes de avançar." },
        { t: "check", id: "w13c1", title: "EU CONSIGO...", items: [
          "usar a antes de som consonantal.",
          "usar an antes de som vocálico.",
          "lembrar que o som decide a escolha.",
          "usar corretamente a university e an hour.",
          "completar frases simples com a/an." ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 6", text: "Se ainda confunde som e letra." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 13", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: diga 5 frases com a ou an. Peça que a IA confirme se você usou a forma correta.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 14 · PLURAL NOUNS", body: "Você aprenderá a formar plurais em inglês." },
        { t: "bar", label: "PROGRESSO", value: "13 DE 42 AULAS", pct: "31%" } ] }
    ]
  },

  {
      id: 14, code: "AULA 14", title: "Plural Nouns", sub: "Aprenda a formar plurais em inglês.",
      time: "15 a 18 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 14" },
          { t: "title", en: "PLURAL NOUNS", pt: "One or more? Aprenda a formar plurais em inglês." },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Quando existe mais de uma coisa, como a palavra muda em inglês?" },
          { t: "image", id: "w14p1a", alt: "Três jovens conversando à mesa com livros, lápis e mochilas", ph: "Ilustração: três jovens sentados a uma mesa de madeira em um espaço de estudo claro. À esquerda, uma moça de cabelo castanho ondulado preso em rabo de cavalo, camisa verde sobre blusa branca e argolas douradas, segura um lápis amarelo; à frente dela, um notebook prateado aberto, um copo de café para viagem e um livro azul-marinho. No centro, um rapaz de cabelo escuro cacheado e camisa jeans sobre camiseta branca segura um porta-lápis preto telado cheio de lápis coloridos, com uma pilha de livros à frente. À direita, uma moça negra de cabelo cacheado preso, suéter amarelo e argolas douradas, segura uma mochila bege; ao lado dela, uma mochila azul-marinho sobre a mesa. Ao fundo, estantes de livros, plantas, luminárias pendentes e janelas grandes com prédios da cidade." },
          { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ:", c: "purple" },
          { t: "grid", cols: 3, items: [
            { title: "girl → girls", body: "Plural com -s.", v: "mint", c: "teal" },
            { title: "bench → benches", body: "Plural com -es.", v: "lilac", c: "purple" },
            { title: "child → children", body: "Plural irregular.", v: "cream", c: "yellow" } ] },
          { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Formar plurais corretamente em situações simples do dia a dia." },
          { t: "meta", label: "TEMPO ESTIMADO", value: "15–18 min" },
          { t: "note", v: "gray", bold: true, text: "Uma palavra pode mudar bastante.\nNesta aula, você vai aprender os padrões mais comuns do plural em inglês." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 02" },
          { t: "title", en: "MOST NOUNS: +S", pt: "Na maioria dos casos, basta adicionar -s." },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "REGRA PRINCIPAL", text: "Para a maioria dos substantivos, adicionamos -s para formar o plural." },
          { t: "cards", cols: 2, items: [
            { tag: "GIRL", c: "purple", v: "lilac", lines: ["girl → girls"], id: "w14p2a", alt: "Moça de camisa verde vista de perfil", ph: "Ilustração: moça de cabelo castanho ondulado preso em rabo de cavalo, camisa verde sobre blusa branca e argolas douradas, vista de perfil e sorrindo, sobre fundo lilás claro." },
            { tag: "APPLE", c: "teal", v: "mint", lines: ["apple → apples"], id: "w14p2b", alt: "Maçã vermelha com uma folha verde", ph: "Ilustração: uma maçã vermelha brilhante, inteira, com o cabinho marrom e uma folha verde presa nele, sobre fundo azul bem claro." },
            { tag: "CAR", c: "yellow", v: "cream", lines: ["car → cars"], id: "w14p2c", alt: "Carro azul visto de frente", ph: "Ilustração: carro sedã azul visto de frente e levemente de três quartos, com faróis acesos e rodas prateadas, sobre fundo creme." },
            { tag: "PENCIL", c: "purple", v: "lilac", lines: ["pencil → pencils"], id: "w14p2d", alt: "Lápis amarelo apontado", ph: "Ilustração: lápis amarelo apontado, na diagonal, com ponta de grafite escura e borracha rosa presa por um anel metálico, sobre fundo lilás claro." } ] },
          { t: "sec", text: "EM FRASES", c: "purple" },
          { t: "steps", items: [
            { n: "1", tag: "CAR", c: "teal", v: "mint", lines: ["It’s a car.", "They’re cars."] },
            { n: "2", tag: "PENCIL", c: "purple", v: "lilac", lines: ["It’s a pencil.", "They’re pencils."] } ] },
          { t: "note", v: "gray", bold: true, text: "Comece pela regra mais comum: singular + s." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 03" },
          { t: "title", en: "CH, SH, S, X, Z → +ES", pt: "Algumas terminações pedem -es." },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "QUANDO USAR", text: "Se a palavra termina em ch, sh, s, x ou z, geralmente usamos -es." },
          { t: "sec", text: "VEJA OS EXEMPLOS:", c: "purple" },
          { t: "cards", cols: 1, items: [
            { tag: "BENCH", c: "teal", v: "mint", lines: ["bench → benches"], id: "w14p3a", alt: "Banco de praça de madeira", ph: "Ilustração: banco de praça com ripas de madeira clara e laterais de ferro preto, visto de três quartos, com um pequeno tufo de folhas verdes ao lado esquerdo, sobre fundo branco." },
            { tag: "DISH", c: "purple", v: "lilac", lines: ["dish → dishes"], id: "w14p3b", alt: "Pilha de pratos com uma tigela em cima", ph: "Ilustração: pilha de pratos brancos e bege empilhados, com uma tigela funda verde-acinzentada em cima, sobre fundo branco." },
            { tag: "BUS", c: "yellow", v: "cream", lines: ["bus → buses"], id: "w14p3c", alt: "Ônibus urbano azul", ph: "Ilustração: ônibus urbano azul visto de frente e de três quartos, com faixa preta de janelas, para-brisa grande e painel de destino iluminado, sobre fundo branco." },
            { tag: "BOX", c: "teal", v: "mint", lines: ["box → boxes"], id: "w14p3d", alt: "Caixa de papelão fechada", ph: "Ilustração: caixa de papelão marrom fechada, vista de três quartos, com as abas do topo dobradas, sobre fundo branco." },
            { tag: "WATCH", c: "purple", v: "lilac", lines: ["watch → watches"], id: "w14p3e", alt: "Relógio de pulso com pulseira de couro", ph: "Ilustração: relógio de pulso com caixa prateada, mostrador azul-marinho com números e ponteiros claros, e pulseira de couro marrom aberta em curva, sobre fundo branco." } ] },
          { t: "objective", v: "navy", title: "DICA IMPORTANTE", text: "Observe a última letra ou grupo de letras antes de escolher o plural." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 04" },
          { t: "title", en: "WORDS ENDING IN Y", pt: "Veja a diferença entre consoante + y e vogal + y." },
          { t: "cards", cols: 2, items: [
            { tag: "CONSONANT + Y", c: "purple", v: "lilac", lines: ["Troque y por ies."] },
            { tag: "VOWEL + Y", c: "teal", v: "mint", lines: ["Apenas adicione s."] },
            { tag: "CANDY", c: "purple", v: "lilac", lines: ["candy → candies"], id: "w14p4a", alt: "Pirulito em espiral vermelho e branco", ph: "Ilustração: pirulito redondo com espiral vermelha e branca, preso a um cabinho branco, inclinado para a esquerda, sobre fundo lilás claro." },
            { tag: "TOY", c: "teal", v: "mint", lines: ["toy → toys"], id: "w14p4b", alt: "Robô de brinquedo azul", ph: "Ilustração: robô de brinquedo azul de corda, com chave amarela nas costas da cabeça, olhos redondos, mãos e pés vermelhos e uma telinha com um gráfico no peito, sobre fundo azul bem claro." },
            { tag: "PUPPY", c: "purple", v: "lilac", lines: ["puppy → puppies"], id: "w14p4c", alt: "Filhote de cachorro sentado", ph: "Ilustração: filhote de golden retriever de pelo dourado sentado de frente, com a língua para fora e orelhas caídas, sobre fundo lilás claro." },
            { tag: "MONKEY", c: "teal", v: "mint", lines: ["monkey → monkeys"], id: "w14p4d", alt: "Macaco pendurado em um galho", ph: "Ilustração: macaquinho marrom pendurado por um braço em um galho verde com folhas, sorrindo, com o rabo enrolado para cima, sobre fundo azul bem claro." } ] },
          { t: "note", v: "cream", center: true, bold: true, text: "Consonant + y  ≠  Vowel + y" },
          { t: "note", v: "mint", bold: true, text: "Primeiro observe a letra antes do y." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 05" },
          { t: "title", en: "SOME -F / -FE → -VES", pt: "Algumas palavras mudam mais." },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "ATENÇÃO", text: "Alguns substantivos terminados em -f ou -fe mudam para -ves." },
          { t: "cards", cols: 2, items: [
            { tag: "KNIFE", c: "teal", v: "mint", lines: ["knife → knives"], id: "w14p5a", alt: "Faca de cozinha com cabo preto", ph: "Ilustração: faca de cozinha com lâmina prateada larga e cabo preto com três rebites, na diagonal, sobre fundo azul bem claro." },
            { tag: "LEAF", c: "teal", v: "mint", lines: ["leaf → leaves"], id: "w14p5b", alt: "Folha verde", ph: "Ilustração: uma folha verde grande e lisa, com nervuras visíveis e cabinho marrom, inclinada para a direita, sobre fundo azul bem claro." },
            { tag: "WOLF", c: "teal", v: "mint", lines: ["wolf → wolves"], id: "w14p5c", alt: "Cabeça de lobo cinza", ph: "Ilustração: cabeça de lobo cinza vista de frente, com pelo cinza e branco, orelhas em pé e olhos âmbar, sobre fundo azul bem claro." },
            { tag: "CALF", c: "teal", v: "mint", lines: ["calf → calves"], id: "w14p5d", alt: "Bezerro preto e branco", ph: "Ilustração: bezerro preto e branco em pé, visto de perfil com a cabeça virada para a frente, sobre fundo azul bem claro." },
            { tag: "SHELF", c: "teal", v: "mint", lines: ["shelf → shelves"], id: "w14p5e", alt: "Prateleira de madeira com livros e uma planta", ph: "Ilustração: prateleira de madeira presa à parede, com quatro livros coloridos em pé à esquerda, um vasinho branco com planta verde no centro e um porta-retrato pequeno à direita, sobre fundo azul bem claro." },
            { tag: "THIEF", c: "teal", v: "mint", lines: ["thief → thieves"], id: "w14p5f", alt: "Ladrão de máscara carregando um saco", ph: "Ilustração: ladrão de desenho vestido de preto, com gorro preto e máscara sobre os olhos, correndo curvado enquanto carrega um saco marrom nas costas, sobre fundo azul bem claro." } ] },
          { t: "sec", text: "NEM TODAS", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "ROOF", c: "purple", v: "lilac", lines: ["roof → roofs"], id: "w14p5g", alt: "Telhado de telhas vermelhas com chaminé", ph: "Ilustração: telhado de telhas vermelhas de uma casa, visto de frente e de lado, com uma chaminé de tijolos à esquerda e as paredes de madeira clara logo abaixo, sobre fundo lilás claro." },
            { tag: "CHIEF", c: "purple", v: "lilac", lines: ["chief → chiefs"], id: "w14p5h", alt: "Medalha dourada com uma estrela", ph: "Ilustração: medalha dourada redonda com uma estrela azul-escura no centro, borda serrilhada e duas fitas douradas embaixo, sobre fundo lilás claro." } ] },
          { t: "note", v: "cream", bold: true, text: "Use esta regra com cuidado:\nela não vale para todas as palavras." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 06" },
          { t: "title", en: "IRREGULAR PLURALS", pt: "Nem todos os plurais seguem uma regra previsível." },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Algumas palavras mudam completamente no plural." },
          { t: "image", id: "w14p6a", alt: "Grupo de pessoas de várias idades caminhando em um parque", ph: "Ilustração: sete pessoas caminhando lado a lado por um parque arborizado, com prédios da cidade ao fundo. Da esquerda para a direita: menina negra de maria-chiquinha, camiseta amarela e jardineira jeans, de mãos dadas com um homem barbudo de camiseta verde-azulada; mulher de cabelo escuro comprido, camiseta roxa e calça bege; senhor de cabelo e barba brancos, óculos e cardigã marrom; senhora de cabelo branco curto e suéter azul-marinho segurando um copo de café; moça negra de cabelo cacheado preso e blusa amarela, gesticulando; rapaz de camisa verde e camiseta branca com mochila nas costas." },
          { t: "cards", cols: 2, items: [
            { tag: "CHILD", c: "teal", v: "mint", lines: ["child → children"], id: "w14p6b", alt: "Ícone de uma menina e um menino", ph: "Ilustração: ícone chapado roxo de duas crianças lado a lado (uma menina de maria-chiquinha e um menino), sorrindo, sobre fundo verde-água bem claro." },
            { tag: "MAN", c: "purple", v: "lilac", lines: ["man → men"], id: "w14p6c", alt: "Ícone de dois homens", ph: "Ilustração: ícone chapado roxo de dois homens adultos lado a lado, sorrindo, sobre fundo lilás bem claro." },
            { tag: "WOMAN", c: "yellow", v: "cream", lines: ["woman → women"], id: "w14p6d", alt: "Ícone de duas mulheres", ph: "Ilustração: ícone chapado roxo de duas mulheres lado a lado (uma de cabelo solto e outra de coque), sorrindo, sobre fundo creme." },
            { tag: "PERSON", c: "teal", v: "mint", lines: ["person → people"], id: "w14p6e", alt: "Ícone de três pessoas", ph: "Ilustração: ícone chapado roxo de três silhuetas de pessoas lado a lado, sem traços no rosto, sobre fundo verde-menta bem claro." } ] },
          { t: "sec", text: "NESTA AULA, VOCÊ VAI USAR ASSIM:", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "CHILDREN", c: "teal", v: "mint", lines: ["They’re children."], id: "w14p6f", alt: "Ícone de uma menina e um menino", ph: "Ilustração: ícone chapado roxo de duas crianças lado a lado (uma menina de maria-chiquinha e um menino), sorrindo, sobre fundo verde-água bem claro." },
            { tag: "MEN", c: "purple", v: "lilac", lines: ["They’re men."], id: "w14p6g", alt: "Ícone de dois homens", ph: "Ilustração: ícone chapado roxo de dois homens adultos lado a lado, sorrindo, sobre fundo lilás bem claro." },
            { tag: "WOMEN", c: "yellow", v: "cream", lines: ["They’re women."], id: "w14p6h", alt: "Ícone de duas mulheres", ph: "Ilustração: ícone chapado roxo de duas mulheres lado a lado (uma de cabelo solto e outra de coque), sorrindo, sobre fundo creme." },
            { tag: "PEOPLE", c: "teal", v: "mint", lines: ["They’re people."], id: "w14p6i", alt: "Ícone de três pessoas", ph: "Ilustração: ícone chapado roxo de três silhuetas de pessoas lado a lado, sem traços no rosto, sobre fundo verde-menta bem claro." } ] },
          { t: "note", v: "navy", bold: true, text: "Esses plurais precisam ser memorizados.\nNão seguem uma regra, mas são muito comuns!" },
          { t: "meta", label: "TEMPO ESTIMADO", value: "15–18 min" } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 07" },
          { t: "title", en: "SINGULAR × PLURAL IN SENTENCES", pt: "Veja como o plural aparece em frases simples." },
          { t: "cards", cols: 2, items: [
            { tag: "1 · SINGULAR", c: "teal", v: "mint", lines: ["It’s a car."], note: "É um carro.", id: "w14p7a", alt: "Um carro azul", ph: "Ilustração: um carro hatch azul visto de frente e de três quartos, com faróis acesos, sobre fundo azul bem claro." },
            { tag: "1 · PLURAL", c: "purple", v: "lilac", lines: ["They’re cars."], note: "Eles são carros.", id: "w14p7b", alt: "Dois carros lado a lado", ph: "Ilustração: dois carros lado a lado, um hatch azul à frente e um sedã branco atrás, vistos de frente e de três quartos, sobre fundo lilás claro." },
            { tag: "2 · SINGULAR", c: "teal", v: "mint", lines: ["It’s a pencil."], note: "É um lápis.", id: "w14p7c", alt: "Um lápis amarelo", ph: "Ilustração: um lápis amarelo apontado, deitado na diagonal, com borracha rosa na ponta, sobre fundo azul bem claro." },
            { tag: "2 · PLURAL", c: "purple", v: "lilac", lines: ["They’re pencils."], note: "Eles são lápis.", id: "w14p7d", alt: "Três lápis coloridos", ph: "Ilustração: três lápis apontados deitados em leque (um amarelo, um azul e um verde), cada um com borracha na ponta, sobre fundo lilás claro." },
            { tag: "3 · SINGULAR", c: "teal", v: "mint", lines: ["It’s a bench."], note: "É um banco.", id: "w14p7e", alt: "Um banco de praça", ph: "Ilustração: um banco de praça de ripas de madeira clara com laterais de ferro preto, visto de três quartos, sobre fundo azul bem claro." },
            { tag: "3 · PLURAL", c: "purple", v: "lilac", lines: ["They’re benches."], note: "Eles são bancos.", id: "w14p7f", alt: "Dois bancos de praça", ph: "Ilustração: dois bancos de praça de ripas de madeira clara com laterais de ferro preto, lado a lado e levemente afastados, sobre fundo lilás claro." },
            { tag: "4 · SINGULAR", c: "teal", v: "mint", lines: ["It’s a watch."], note: "É um relógio.", id: "w14p7g", alt: "Um relógio de pulso", ph: "Ilustração: um relógio de pulso com caixa prateada, mostrador azul-marinho e pulseira azul-escura, visto de frente, sobre fundo azul bem claro." },
            { tag: "4 · PLURAL", c: "purple", v: "lilac", lines: ["They’re watches."], note: "Eles são relógios.", id: "w14p7h", alt: "Dois relógios de pulso", ph: "Ilustração: dois relógios de pulso lado a lado (um de mostrador preto com pulseira escura e outro de mostrador branco com pulseira de couro marrom), sobre fundo lilás claro." } ] },
          { t: "note", v: "cream", bar: true, bold: true, text: "It’s = uma coisa.\nThey’re = mais de uma." },
          { t: "meta", label: "TEMPO ESTIMADO", value: "15–18 min" } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 08" },
          { t: "title", en: "YOUR TURN", pt: "Transforme as palavras para o plural." },
          { t: "fill", id: "w14e1", title: "MAKE IT PLURAL", items: [
            { pre: "1. pencil →", answers: ["pencils"], v: "mint" },
            { pre: "2. church →", answers: ["churches"], v: "mint" },
            { pre: "3. key →", answers: ["keys"], v: "mint" },
            { pre: "4. puppy →", answers: ["puppies"], v: "mint" },
            { pre: "5. person →", answers: ["people"], v: "mint" },
            { pre: "6. child →", answers: ["children"], v: "mint" } ] },
          { t: "answers", v: "lilac", title: "RESPOSTAS", items: [
            { k: "1", a: "pencils", c: "purple" },
            { k: "2", a: "churches", c: "purple" },
            { k: "3", a: "keys", c: "purple" },
            { k: "4", a: "puppies", c: "purple" },
            { k: "5", a: "people", c: "purple" },
            { k: "6", a: "children", c: "purple" } ] },
          { t: "note", v: "cream", bold: true, text: "Faça primeiro sozinho e depois confira." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 09" },
          { t: "title", en: "LET’S TALK! ONE OR MORE?", pt: "Use singular e plural em um contexto real." },
          { t: "image", id: "w14p9a", alt: "Ana e Daniel conversando sobre livros na biblioteca", ph: "Ilustração: Ana e Daniel sentados a uma mesa de madeira dentro de uma biblioteca. Ana, de cabelo castanho ondulado preso, camisa verde sobre blusa branca e argolas douradas, aponta com o dedo para o livro verde que Daniel segura. Daniel tem cabelo escuro cacheado e usa camisa jeans sobre camiseta branca. Sobre a mesa há uma pilha de livros amarelo, verde e azul, um copo de café para viagem, um porta-lápis preto telado com lápis amarelos e um caderno azul-marinho com uma caneta em cima. Ao fundo, estantes cheias de livros com uma placa escrita “New Arrivals”, luminárias pendentes pretas, plantas e uma janela grande com árvores." },
          { t: "dialogue", items: [
            { s: "a", text: "Ana: What is it?" },
            { s: "b", text: "Daniel: It’s a book." },
            { s: "a", text: "Ana: And what are they?" },
            { s: "b", text: "Daniel: They’re books." },
            { s: "a", text: "Ana: What are they?" },
            { s: "b", text: "Daniel: They’re pencils." },
            { s: "a", text: "Ana: And the people?" },
            { s: "b", text: "Daniel: They’re students." } ] },
          { t: "sec", text: "YOUR TURN", c: "purple" },
          { t: "lead", text: "Look at the pictures and complete the sentences." },
          { t: "cards", cols: 2, items: [
            { tag: "1", c: "teal", v: "mint", lines: ["It’s a ______."], id: "w14p9b", alt: "Mochila azul-marinho", ph: "Ilustração: mochila de tecido azul-marinho vista de lado, com alças pretas acolchoadas, bolso frontal com zíper e alça de mão no topo, sobre fundo branco." },
            { tag: "2", c: "teal", v: "mint", lines: ["They’re ______."], id: "w14p9c", alt: "Dois cadernos espirais, um verde e um amarelo", ph: "Ilustração: dois cadernos de espiral sobrepostos, um de capa verde por baixo e um de capa amarela por cima, vistos de cima e levemente inclinados, sobre fundo branco." },
            { tag: "3", c: "teal", v: "mint", lines: ["They’re ______."], id: "w14p9d", alt: "Três estudantes conversando no corredor", ph: "Ilustração: três estudantes conversando em pé no corredor de uma escola. À esquerda, um rapaz de moletom verde com mochila nas costas; no centro, uma moça de cabelo cacheado e blusa listrada segurando um livro verde; à direita, uma moça de jaqueta jeans segurando um copo de café e cadernos. Ao fundo, parede clara e janelas." } ] },
          { t: "free", id: "w14f1", items: [
            { n: "1", kicker: "PICTURE", prefix: "It’s a ______.", ideas: "", v: "mint", c: "teal" },
            { n: "2", kicker: "PICTURE", prefix: "They’re ______.", ideas: "", v: "lilac", c: "purple" },
            { n: "3", kicker: "PICTURE", prefix: "They’re ______.", ideas: "", v: "cream", c: "yellow" } ] },
          { t: "note", v: "gray", bold: true, text: "Think and speak.\nPratique com um colega. Observe os objetos e as pessoas ao seu redor e descreva usando a / an ou one e plural." } ] },

        { blocks: [
          { t: "badge", label: "AULA 14", page: "PÁGINA 10" },
          { t: "kicker", text: "AULA CONCLUÍDA" },
          { t: "title", en: "PLURAL NOUNS", pt: "Você já sabe formar plurais em inglês." },
          { t: "lead", text: "Use este checklist antes de avançar." },
          { t: "check", id: "w14c1", title: "EU CONSIGO...", items: [
            "usar -s na maioria dos substantivos.",
            "usar -es com palavras terminadas em ch, sh, s, x e z.",
            "formar plurais com palavras terminadas em y.",
            "reconhecer alguns plurais irregulares, como children e people." ] },
          { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 8", text: "se ainda tiver dúvida sobre as terminações e os plurais irregulares." },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 14", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: diga o plural de six words: pencil, church, puppy, knife, person e child.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 15 · DEMONSTRATIVES", body: "Você aprenderá a usar this, that, these e those." },
          { t: "bar", label: "PROGRESSO", value: "14 DE 42 AULAS", pct: "33%" } ] }
      ]
    },

  {
    id: 15, code: "AULA 15", title: "Demonstratives", sub: "This, that, these e those.",
    time: "15 a 18 minutos",
    pages: [

      // ───────────────────────────── página 01 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15" },
        { t: "title", en: "DEMONSTRATIVES", pt: "This, that, these e those." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Quando algo está perto ou longe,\ncomo você mostra isso em inglês?" },
        { t: "image", id: "w15p1a", alt: "Dois amigos conversando à mesa de um café enquanto uma mulher aponta para a rua",
          ph: "Ilustração: mesa de um café com fachada de vidro aberta para a calçada. À esquerda, uma mulher de cabelo castanho comprido, brincos de argola dourados e camiseta laranja-terracota sorri e aponta o dedo indicador para o celular que o rapaz segura. Ao lado dela, um rapaz de óculos, barba curta e camisa verde-oliva sobre camiseta branca segura um celular preto e sorri. Sobre a mesa de madeira: um notebook prateado aberto, uma caneca azul-marinho, um vaso com suculenta e uma pilha de dois livros (verde e amarelo). Ao fundo, na calçada, uma mulher de blusa bege, calça jeans e bolsa marrom no ombro aponta para a rua, onde passam carros branco e vermelho e há prédios e árvores. À direita, outra mesa redonda com uma mochila azul-marinho e uma pilha de livros vermelho, azul e amarelo." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 2, items: [
          { title: "This is a phone.", body: "Este é um telefone.", v: "mint", c: "teal" },
          { title: "That is a bag.", body: "Aquela é uma bolsa.", v: "lilac", c: "purple" },
          { title: "These are books.", body: "Estes são livros.", v: "cream", c: "yellow" },
          { title: "Those are cars.", body: "Aqueles são carros.", v: "green", c: "green" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Falar de objetos e pessoas usando distância e número." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15–18 min" },
        { t: "note", v: "gray", text: "Primeiro você descobre:\nestá perto ou longe? É um ou mais de um?" } ] },

      // ───────────────────────────── página 02 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 02" },
        { t: "title", en: "THIS, THAT, THESE, THOSE", pt: "Perto ou longe? Um ou mais de um?" },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "IDEIA-CHAVE", text: "Primeiro veja se é um ou mais de um.\nDepois veja se está perto ou longe." },
        { t: "sec", text: "MAPA RÁPIDO" },
        { t: "cards", cols: 2, items: [
          { tag: "SINGULAR + PERTO", c: "teal", v: "mint", id: "w15p2a", alt: "Mulher segurando um celular perto do corpo e apontando para ele",
            ph: "Ilustração recortada sobre fundo azul-claro: mulher de cabelo castanho ondulado, brincos de argola e camiseta laranja-terracota, vista da cintura para cima. Ela segura um celular preto na mão direita, junto ao corpo, e aponta para ele com o indicador da mão esquerda, sorrindo.",
            lines: ["THIS"], note: "This is a phone." },
          { tag: "SINGULAR + LONGE", c: "purple", v: "lilac", id: "w15p2b", alt: "Homem apontando para um celular sobre uma mesa distante",
            ph: "Ilustração sobre fundo lilás-claro: rapaz de óculos, barba curta e camisa verde-oliva, de perfil, com o braço esticado apontando para a direita. Uma seta pontilhada roxa sai do dedo dele e chega a um celular preto em pé sobre uma mesinha redonda de madeira, do outro lado do quadro.",
            lines: ["THAT"], note: "That is a phone." },
          { tag: "PLURAL + PERTO", c: "yellow", v: "cream", id: "w15p2c", alt: "Pilha de três livros vista de perto",
            ph: "Ilustração sobre fundo amarelo-claro: pilha de três livros grossos empilhados, vistos de lado e bem de perto: o de cima verde, o do meio vermelho-alaranjado e o de baixo azul-marinho, com as páginas brancas à mostra.",
            lines: ["THESE"], note: "These are books." },
          { tag: "PLURAL + LONGE", c: "green", v: "green", id: "w15p2d", alt: "Mulher apontando para livros sobre uma mesa distante",
            ph: "Ilustração sobre fundo verde-claro: mulher de cabelo castanho comprido e camiseta laranja-terracota, de perfil, com o braço esticado apontando para a direita. Uma seta tracejada verde sai do dedo dela e chega a uma pilha de três livros (verde, vermelho e azul) sobre uma mesinha redonda de madeira.",
            lines: ["THOSE"], note: "Those are books." } ] },
        { t: "note", v: "blue", text: "NEAR E FAR DEPENDEM DA POSIÇÃO DE QUEM FALA." },
        { t: "sec", text: "REGRA RÁPIDA", c: "yellow" },
        { t: "rows", items: [
          { text: "THIS / THAT = singular", c: "teal" },
          { text: "THESE / THOSE = plural", c: "yellow" },
          { text: "THIS / THESE = perto | THAT / THOSE = longe", c: "purple" } ] } ] },

      // ───────────────────────────── página 03 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 03" },
        { t: "title", en: "THIS × THAT", pt: "Uma coisa: perto ou longe." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "SINGULAR", text: "Use THIS para algo perto de você.\nUse THAT para algo mais longe." },
        { t: "cards", cols: 2, items: [
          { tag: "NEAR", c: "teal", v: "mint", id: "w15p3a", alt: "Mulher sentada à mesa apontando para o celular na sua frente",
            ph: "Ilustração: mulher de cabelo castanho comprido, brincos de argola e camiseta laranja-terracota, sentada a uma mesa de madeira dentro de um café. Ela olha para baixo, sorrindo, e toca com o indicador um celular preto deitado na mesa, ao lado de uma caneca azul-marinho e de um notebook prateado. Ao fundo, desfocado, um rapaz de camisa verde trabalha em um notebook.",
            lines: ["This is a phone."], note: "Este é um telefone." },
          { tag: "FAR", c: "teal", v: "cream", id: "w15p3b", alt: "Homem de costas olhando para uma bolsa sobre uma mesa ao longe",
            ph: "Ilustração: rapaz de camisa verde-oliva e calça jeans, visto de costas, em pé no salão de um café com janelas grandes para a rua. Ao fundo, sobre uma mesa redonda de madeira junto à janela, está uma bolsa azul-marinho de alças. Em primeiro plano, outra mesa com um caderno branco fechado e uma caneta preta, e um vaso de planta pequeno.",
            lines: ["That is a bag."], note: "Aquela é uma bolsa." } ] },
        { t: "sec", text: "OUTROS EXEMPLOS", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "THIS", c: "teal", v: "white", id: "w15p3c", alt: "Rapaz apontando para o irmão que está ao lado dele",
            ph: "Ilustração: dois rapazes em pé, lado a lado e bem próximos. O da frente, de óculos, camisa verde-oliva e camiseta branca, sorri e aponta com o polegar para o rapaz ao lado, de camisa jeans azul e calça escura, que também sorri.",
            lines: ["This is", "my brother."], note: "Este é meu irmão." },
          { tag: "THAT", c: "teal", v: "white", id: "w15p3d", alt: "Rapaz de costas olhando para o irmão que acena de longe",
            ph: "Ilustração: à esquerda, o rapaz de camisa verde-oliva visto de costas, olhando para frente. À direita, ao longe e em tamanho menor, o irmão de camisa jeans azul e calça bege acena com a mão levantada, de corpo inteiro.",
            lines: ["That is", "my brother."], note: "Aquele é\nmeu irmão." } ] },
        { t: "note", v: "mint", text: "AMBOS FALAM DE UMA COISA SÓ." } ] },

      // ───────────────────────────── página 04 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 04" },
        { t: "title", en: "THESE × THOSE", pt: "Mais de uma coisa." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "PLURAL", text: "Use THESE para coisas perto.\nUse THOSE para coisas mais longe." },
        { t: "cards", cols: 2, items: [
          { tag: "NEAR", c: "teal", v: "gray", id: "w15p4a", alt: "Pilha de livros sobre uma mesa de escritório, bem perto de quem olha",
            ph: "Ilustração: pilha de três livros (verde por cima, vermelho no meio, azul-marinho embaixo) sobre uma mesa de madeira clara, em primeiro plano. Ao lado, uma caneca azul-marinho, um vaso com suculenta e a lateral de um notebook prateado aberto. Ao fundo, desfocado, um escritório com mesas, cadeiras pretas e plantas.",
            lines: ["These are books."], note: "Estes são livros." },
          { tag: "FAR", c: "teal", v: "gray", id: "w15p4b", alt: "Carros passando na avenida vistos da mesa de uma calçada",
            ph: "Ilustração: avenida movimentada vista de uma calçada. Vários carros (branco, vermelho, preto e prata) trafegam pela pista; ao fundo, prédios altos envidraçados e árvores verdes. Em primeiro plano, à direita, uma mesa redonda de madeira com um vaso de planta pequeno e duas cadeiras pretas de metal.",
            lines: ["Those are cars."], note: "Aqueles são carros." } ] },
        { t: "sec", text: "OUTROS EXEMPLOS", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "THESE", c: "teal", v: "white", id: "w15p4c", alt: "Tigela de maçãs vermelhas sobre a mesa, bem perto",
            ph: "Ilustração: tigela de madeira clara cheia de maçãs vermelhas brilhantes, sobre uma mesa de madeira, em primeiro plano. Ao fundo, desfocado, um ambiente interno claro.",
            lines: ["These are", "apples."], note: "Estes são\nmaçãs." },
          { tag: "THOSE", c: "teal", v: "white", id: "w15p4d", alt: "Maçãs sobre uma mesa de piquenique distante em um parque",
            ph: "Ilustração: parque com gramado verde e árvores altas; ao fundo, prédios da cidade. No centro, ao longe, uma mesa de piquenique de madeira com bancos, e sobre ela um pequeno prato com maçãs vermelhas.",
            lines: ["Those are", "apples."], note: "Aqueles são\nmaçãs." } ] },
        { t: "key", v: "navy", text: "THESE e THOSE sempre combinam com ARE." } ] },

      // ───────────────────────────── página 05 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 05" },
        { t: "title", en: "HOW DO THEY SOUND?", pt: "Pronúncia dos demonstratives." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "OUÇA E REPITA", text: "Todos começam com o mesmo som inicial." },
        { t: "pron", code: "THIS", pt: "/ðɪs/", title: "som curto", c: "teal", v: "mint" },
        { t: "pron", code: "THAT", pt: "/ðæt/", title: "boca mais aberta", c: "purple", v: "lilac" },
        { t: "pron", code: "THESE", pt: "/ði:z/", title: "som longo", c: "yellow", v: "cream" },
        { t: "pron", code: "THOSE", pt: "/ðoʊz/", title: "som de ou", c: "green", v: "green" },
        { t: "note", v: "mint", bar: true, bold: true, kicker: "LEMBRE-SE", text: "THIS / THAT = singular\nTHESE / THOSE = plural" },
        { t: "note", v: "lilac", bar: true, bold: true, kicker: "DIGA EM VOZ ALTA:", text: "this, that, these, those." } ] },

      // ───────────────────────────── página 06 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 06" },
        { t: "title", en: "LOOK & CHOOSE", pt: "Formas e demonstratives." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "OBSERVE", text: "Veja o número e a distância antes de escolher." },
        { t: "cards", cols: 2, items: [
          { tag: "THIS", c: "teal", v: "white", id: "w15p6a", alt: "Homem apontando para um triângulo sobre a mesa ao lado dele",
            ph: "Ilustração: rapaz de óculos e camisa verde-oliva, visto de costas e de perfil, aponta com o indicador para um triângulo azul-petróleo apoiado em uma mesa de madeira clara encostada na parede. Na parede, um quadro abstrato claro; ao lado da mesa, um vaso com planta verde.",
            lines: ["This is a triangle."] },
          { tag: "THAT", c: "teal", v: "white", id: "w15p6b", alt: "Homem apontando para um painel retangular roxo do outro lado da praça",
            ph: "Ilustração: o mesmo rapaz de camisa verde-oliva, de costas, na praça de um centro urbano, com o braço esticado apontando para frente. Ao longe, um grande painel retangular roxo instalado no calçadão. Ao redor, prédios envidraçados e árvores.",
            lines: ["That is a rectangle."] },
          { tag: "THESE", c: "teal", v: "white", id: "w15p6c", alt: "Mulher apontando para dois triângulos sobre a mesa ao lado dela",
            ph: "Ilustração: mulher de cabelo castanho comprido e camiseta laranja-terracota, sentada, sorrindo e apontando com o indicador para dois triângulos azul-petróleo lado a lado sobre uma mesa de madeira clara. Ao fundo, parede clara com um quadro abstrato e um vaso com planta.",
            lines: ["These are triangles."] },
          { tag: "THOSE", c: "teal", v: "white", id: "w15p6d", alt: "Mulher apontando para dois painéis retangulares roxos ao longe",
            ph: "Ilustração: a mesma mulher de camiseta laranja-terracota, vista de costas, na praça, com o braço esticado apontando para frente. Ao longe, dois grandes painéis retangulares roxos lado a lado no calçadão, entre prédios envidraçados e árvores.",
            lines: ["Those are rectangles."] } ] },
        { t: "cards", cols: 2, items: [
          { tag: "THIS", c: "teal", v: "white", id: "w15p6e", alt: "Homem apontando para um círculo sobre a mesa ao lado dele",
            ph: "Ilustração pequena: rapaz de óculos e camisa verde-oliva, de perfil, apontando para um círculo azul-petróleo apoiado em uma mesa de madeira clara junto à parede, com dois vasinhos de planta ao lado.",
            lines: ["This is a", "circle."] },
          { tag: "THAT", c: "teal", v: "white", id: "w15p6f", alt: "Homem apontando para uma placa quadrada ao longe na praça",
            ph: "Ilustração pequena: rapaz de camisa verde-oliva, de costas, apontando para frente na praça; ao longe, uma placa quadrada azul-petróleo entre prédios envidraçados e árvores.",
            lines: ["That is a", "square."] } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "PERTO + UM = THIS | LONGE + UM = THAT\nPERTO + MAIS DE UM = THESE | LONGE + MAIS DE UM = THOSE" } ] },

      // ───────────────────────────── página 07 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 07" },
        { t: "title", en: "THIS, THAT, THESE OR THOSE?", pt: "Pessoas e objetos do dia a dia." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "PENSE ASSIM", text: "Primeiro: é um ou mais de um?\nDepois: está perto ou longe?" },
        { t: "steps", items: [
          { n: "1", tag: "THIS", c: "teal", v: "white", id: "w15p7a", alt: "Rapaz de moletom verde apontando para si mesmo, dentro de casa",
            ph: "Ilustração: rapaz jovem de cabelo castanho encaracolado e moletom verde-escuro, sorrindo dentro de uma sala clara, apontando com o polegar para o lado do próprio corpo. Ao fundo, um quadro na parede e um vaso com planta.",
            lines: ["This is my brother."] },
          { n: "2", tag: "THAT", c: "teal", v: "white", id: "w15p7b", alt: "Rapaz de costas olhando o irmão que acena de longe no parque",
            ph: "Ilustração: à esquerda, o rapaz de moletom verde visto de costas, olhando para frente. Ao longe, no calçadão de um parque com árvores e prédios ao fundo, o irmão de camiseta clara, jaqueta verde e calça jeans acena com a mão levantada.",
            lines: ["That is my brother."] },
          { n: "3", tag: "THIS", c: "teal", v: "white", id: "w15p7c", alt: "Mulher segurando uma maçã vermelha na mão, perto do rosto",
            ph: "Ilustração: mulher de cabelo castanho ondulado, brincos de argola e camiseta laranja-terracota, sorrindo dentro de um café, segurando uma maçã vermelha brilhante ao lado do rosto. Pequenos traços amarelos de brilho saem da maçã. Ao fundo, plantas e mesas de madeira.",
            lines: ["This is an apple."] },
          { n: "4", tag: "THAT", c: "teal", v: "white", id: "w15p7d", alt: "Mulher de costas apontando para uma maçã sobre uma mesa distante",
            ph: "Ilustração: a mesma mulher de camiseta laranja-terracota, vista de costas, aponta com o indicador para uma maçã vermelha sozinha sobre uma mesa redonda de madeira do outro lado do café, perto das janelas.",
            lines: ["That is an apple."] },
          { n: "5", tag: "THESE", c: "teal", v: "white", id: "w15p7e", alt: "Três maçãs vermelhas em um prato de madeira, bem perto",
            ph: "Ilustração: três maçãs vermelhas grandes e brilhantes em um prato raso de madeira, sobre uma mesa de madeira, em primeiro plano. Ao fundo, um vaso com planta verde.",
            lines: ["These are apples."] },
          { n: "6", tag: "THOSE", c: "teal", v: "white", id: "w15p7f", alt: "Caixote de maçãs sobre uma mesa ao longe no café",
            ph: "Ilustração: caixote de madeira cheio de maçãs vermelhas sobre uma mesa redonda de madeira, mais ao fundo do café, junto às janelas. À esquerda, um vaso com planta verde.",
            lines: ["Those are apples."] } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "SINGULAR: this / that  •  PLURAL: these / those" } ] },

      // ───────────────────────────── página 08 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 08" },
        { t: "title", en: "ASKING QUESTIONS", pt: "Is this...? Are those...?" },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "ESTRUTURA", text: "SINGULAR: Is this/that + noun? → Yes, it is.\nPLURAL: Are these/those + noun? → Yes, they are." },
        { t: "steps", items: [
          { n: "1", tag: "Is this a clock?", c: "teal", v: "white", id: "w15p8a", alt: "Mulher apontando para um relógio em cima da mesa ao lado dela",
            ph: "Ilustração: mulher de cabelo castanho comprido, brincos de argola e camiseta laranja-terracota, sorrindo e apontando com o indicador para um relógio redondo de mesa, de moldura preta e ponteiros pretos, sobre uma mesinha de madeira. Ao lado, um vaso branco com planta verde.",
            lines: ["Yes, it is."] },
          { n: "2", tag: "Is that a clock?", c: "teal", v: "white", id: "w15p8b", alt: "Homem apontando para um relógio pendurado na parede ao longe",
            ph: "Ilustração: rapaz de óculos e camisa verde-oliva sobre camiseta branca, de perfil, com o braço esticado apontando para um relógio redondo de parede, de moldura preta, pendurado na parede à direita. Abaixo, um aparador de madeira com livros e um vaso com planta.",
            lines: ["Yes, it is."] },
          { n: "3", tag: "Are these old cars?", c: "teal", v: "white", id: "w15p8c", alt: "Mulher apontando para dois carros antigos estacionados ao lado dela",
            ph: "Ilustração: mulher de coque, blusa branca e bolsa marrom a tiracolo, de perfil, apontando para dois carros antigos estacionados bem à frente dela: um azul-petróleo e um vermelho-escuro, com para-choques cromados. Ao fundo, prédios da cidade e árvores.",
            lines: ["Yes, they are."] },
          { n: "4", tag: "Are those old cars?", c: "teal", v: "white", id: "w15p8d", alt: "Homem de costas apontando para dois carros antigos ao longe",
            ph: "Ilustração: rapaz de óculos e camisa verde-oliva, visto de costas, apontando para frente em um estacionamento. Ao longe, dois carros antigos (um verde e um bege) estacionados lado a lado, com prédios e árvores ao fundo.",
            lines: ["Yes, they are."] } ] },
        { t: "key", v: "navy", text: "IS + singular  •  ARE + plural" },
        { t: "note", v: "gray", center: true, text: "resposta curta: it / they" } ] },

      // ───────────────────────────── página 09 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 09" },
        { t: "title", en: "LET’S TALK!", pt: "Near or far?" },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "VAMOS CONVERSAR", text: "Use this, that, these e those\nem uma situação real." },
        { t: "image", id: "w15p9a", alt: "Ana e Daniel conversando à mesa de um café com cadernos, canetas e livros",
          ph: "Ilustração: Ana, de cabelo castanho comprido, brincos de argola e camiseta laranja-terracota, sentada à esquerda de uma mesa redonda de madeira, sorri e aponta com o indicador para os objetos da mesa. À direita, Daniel, de óculos, barba curta e camisa verde-oliva sobre camiseta branca, escreve em um caderno com uma caneta e sorri para ela. Sobre a mesa: um caderno espiral cinza fechado, um estojo azul-marinho, três canetas (verde, vermelha e azul) e uma pilha de livros verde, vermelho e azul. Ao lado da cadeira de Daniel, uma mochila azul-marinho. Ao fundo, o salão do café com luminárias pendentes, plantas, janelas grandes e outros clientes." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Is this your notebook?" },
          { s: "b", text: "Daniel: Yes, it is." },
          { s: "a", text: "Ana: Is that your bag?" },
          { s: "b", text: "Daniel: Yes, it is." },
          { s: "a", text: "Ana: Are these your pens?" },
          { s: "b", text: "Daniel: Yes, they are." },
          { s: "a", text: "Ana: And those books?" },
          { s: "b", text: "Daniel: They are Julia’s books." } ] },
        { t: "objective", v: "navy", title: "YOUR TURN", text: "Olhe ao redor e diga 4 frases:\n1 com this, 1 com that, 1 com these e 1 com those." },
        { t: "key", v: "mint", text: "Fale em voz alta." } ] },

      // ───────────────────────────── página 10 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 15", page: "PÁGINA 10" },
        { t: "kicker", text: "AULA CONCLUÍDA" },
        { t: "title", en: "VOCÊ JÁ SABE USAR DEMONSTRATIVES.", pt: "Use este checklist antes de avançar." },
        { t: "check", id: "w15c1", title: "EU CONSIGO...", items: [
          "usar this e that no singular.",
          "usar these e those no plural.",
          "perceber o que está perto ou longe.",
          "fazer perguntas com Is this/that...? e Are these/those...?" ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 8", text: "se ainda confunde singular/plural ou perto/longe." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 15", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: olhe ao redor e diga 4 frases: this, that, these e those.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 16 · HOUSE AND FURNITURE", body: "Você aprenderá vocabulário da casa e dos móveis." },
        { t: "bar", label: "PROGRESSO", value: "15 DE 42 AULAS", pct: "36%" } ] }
    ]
  },

  {
    id: 16, code: "AULA 16", title: "House and Furniture", sub: "Cômodos, móveis e objetos da casa.",
    time: "12 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 16" },
        { t: "title", en: "HOUSE AND FURNITURE", pt: "Explore rooms, furniture and objects around the house." },
        { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Você já sabe dizer o nome de\nalguns cômodos e móveis em inglês?" },
        { t: "image", id: "w16p1a", alt: "Casa moderna em corte, mostrando todos os cômodos por dentro.",
          ph: "Foto: casa moderna de dois andares vista em corte, como uma casa de bonecas, com a fachada aberta. No andar de cima, da esquerda para a direita: escritório de parede verde-oliva com escrivaninha de madeira, cadeira preta e estantes de livros; quarto bege com cama de casal de roupa de cama verde, abajur e planta; banheiro de porcelanato claro com box de vidro, chuveiro preto, espelho redondo e pia com bancada. No andar de baixo: sala de estar com sofá cinza-claro em L, TV grande sobre rack de madeira, mesa de centro e janelão; cozinha verde-escura com ilha, dois banquinhos de madeira, coifa, fogão e geladeira inox; e, à direita, uma pequena lavanderia com máquina de lavar. Do lado de fora, jardim com grama, arbustos, flores roxas, árvores, caminho de pedra e varanda com mesa e cadeiras verdes." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "This is a house.", body: "Esta é uma casa.", v: "mint", c: "teal" },
          { title: "That is the kitchen.", body: "Aquela é a cozinha.", v: "lilac", c: "purple" },
          { title: "These are chairs.", body: "Estas são cadeiras.", v: "cream", c: "yellow" } ] },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Reconhecer e nomear em inglês os principais ambientes, móveis e objetos de uma casa." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12–15 min" },
        { t: "note", v: "gray", text: "Você vai aprender vocabulário útil para falar\nda casa e se preparar para a próxima aula." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 02" },
        { t: "title", en: "THE HOUSE & GARDEN", pt: "Primeiro, vamos reconhecer a casa e a área externa." },
        { t: "image", id: "w16p2a", alt: "Fachada de uma casa moderna com jardim florido, com as etiquetas house e garden.",
          ph: "Foto: fachada de uma casa moderna de dois andares em dia de céu azul com nuvens. Paredes de concreto claro e ripado de madeira, janelões escuros, sacada com guarda-corpo de vidro e vasos de plantas, porta de entrada alta de madeira. À frente, gramado verde cortado por um caminho de placas retangulares de concreto, canteiros com flores roxas, rosas e brancas, arbustos e árvores dos dois lados. Duas etiquetas brancas com fio e bolinha: “house”, apontando para a parte de cima da casa, e “garden”, apontando para o canteiro de flores à direita." },
        { t: "note", v: "lilac", bar: true, bold: true, kicker: "LOOK AND SAY", text: "What’s this? It’s a house.\nWhat’s that? It’s the garden." },
        { t: "sec", text: "PALAVRAS-CHAVE", c: "purple" },
        { t: "rows", items: [
          { text: "house = casa", c: "teal" },
          { text: "garden = jardim", c: "purple" } ] },
        { t: "note", v: "gray", text: "Agora você já consegue identificar a parte externa\nda casa em inglês." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 03" },
        { t: "title", en: "THE LIVING ROOM", pt: "Aprenda palavras úteis para falar da sala de estar." },
        { t: "image", id: "w16p3a", alt: "Sala de estar com sofá, mesa de centro, poltrona e janela, com etiquetas em inglês.",
          ph: "Foto: sala de estar moderna com parede verde-oliva à esquerda, TV grande de tela plana presa na parede, soundbar e rack de madeira ripada com livros e revistas embaixo. Estante embutida iluminada com livros, vasos e porta-retratos. No centro, sofá bege de três lugares com almofadas verde, laranja e estampada; à frente, mesa de centro retangular de madeira com estrutura preta, com vasinho de planta, livros empilhados, xícara e cesto na prateleira de baixo. À direita, janelão do chão ao teto com cortinas bege e árvores lá fora, mesa lateral redonda preta com vasinhos, poltrona verde-oliva de estrutura preta com almofada cinza-escura e plantas grandes em vasos. Tapete claro sobre piso de madeira e quadros abstratos nas paredes. Seis etiquetas brancas apontam para: “living room”, “window”, “sofa / couch”, “side table”, “coffee table” e “chair”." },
        { t: "note", v: "lilac", kicker: "VOCAB TIP", text: "Sofa and couch are both correct." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "This is a sofa.", body: "Este é um sofá.", v: "mint", c: "teal" },
          { title: "That is the coffee table.", body: "Aquela é a mesa de centro.", v: "lilac", c: "purple" },
          { title: "These are chairs.", body: "Estas são cadeiras.", v: "cream", c: "yellow" } ] },
        { t: "note", v: "gray", text: "Observe o ambiente e associe cada palavra ao objeto correto." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 04" },
        { t: "title", en: "THE KITCHEN", pt: "Conheça os principais itens da cozinha em inglês." },
        { t: "image", id: "w16p4a", alt: "Cozinha moderna com ilha, geladeira e armários, com etiquetas em inglês.",
          ph: "Foto: cozinha moderna com armários superiores verde-escuros e armários inferiores de madeira clara, bancada branca e revestimento de azulejos brancos. Ao centro, coifa inox embutida em capa escura, fogão com panela preta, tábua de madeira e potes com utensílios. Duas luminárias pendentes pretas em forma de cúpula. À esquerda, janela com plantas, cuba com torneira preta e lava-louças inox embutido sob a bancada. À direita, geladeira inox de duas portas com dispenser de água e uma planta grande em vaso preto. No meio da cozinha, ilha escura com tampo de pedra clara, fruteira com limões e dois banquinhos altos de assento de madeira e pés pretos. Piso de madeira clara. Cinco etiquetas brancas apontam para: “kitchen”, “cooker hood”, “cabinets”, “refrigerator” e “dishwasher”." },
        { t: "note", v: "lilac", kicker: "LOOK CLOSELY", text: "Leia os rótulos e aponte\ncada objeto na imagem." },
        { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DIZER:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "This is the refrigerator.", body: "Esta é a geladeira.", v: "mint", c: "teal" },
          { title: "These are cabinets.", body: "Estes são os armários.", v: "lilac", c: "purple" },
          { title: "That is the dishwasher.", body: "Aquela é a lava-louças.", v: "cream", c: "yellow" } ] },
        { t: "meta", label: "TEMPO ESTIMADO", value: "12–15 min" },
        { t: "note", v: "gray", text: "Essas palavras serão importantes para\ndescrever ambientes nas próximas aulas." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 05" },
        { t: "title", en: "BEDROOM & STUDY AREA", pt: "Agora vamos observar o quarto e a área de estudo." },
        { t: "image", id: "w16p5a", alt: "Quarto com cama e, ao lado, área de estudo com escrivaninha e computador.",
          ph: "Foto: ambiente dividido em dois. À esquerda, o quarto: parede azul-petróleo, cama de casal com cabeceira de madeira, roupa de cama verde e almofadas verdes e brancas, dois quadros abstratos em tons de azul e amarelo, criado-mudo de madeira com abajur preto, janela com cortina clara, planta em vaso e tapete claro sobre piso de madeira. No meio, uma estante alta de madeira e azul-escuro com livros, vasos e plantas pendentes. À direita, a área de estudo: prateleiras de madeira suspensas com livros, vasos e plantas, bancada de madeira com monitor preto, teclado, mouse, luminária de mesa preta e vasinhos, gavetas azul-escuras embaixo e cadeira de escritório preta com rodinhas. Quatro etiquetas brancas apontam para: “bedroom”, “bed”, “desk” e “computer”." },
        { t: "sec", text: "PRACTICE", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "This is the bed.", body: "Esta é a cama.", v: "mint", c: "teal" },
          { title: "That is the desk.", body: "Aquela é a mesa de estudos.", v: "lilac", c: "purple" },
          { title: "It’s a computer.", body: "É um computador.", v: "cream", c: "yellow" } ] },
        { t: "image", id: "w16p5b", alt: "Duas pessoas conversando, com balões de fala.",
          ph: "Ilustração: uma mulher de pele morena, cabelo cacheado preso, brincos de argola dourados e blusa amarela conversa com um homem de cabelo cacheado escuro e barba, de camisa azul-petróleo aberta sobre camiseta branca. Ela fala com a mão aberta à frente. Entre os dois, um balão roxo com um ponto de interrogação e um balão azul-turquesa com reticências." },
        { t: "dialogue", items: [
          { s: "a", text: "What’s this?" },
          { s: "b", text: "It’s a desk." } ] },
        { t: "note", v: "gray", text: "Use o vocabulário para nomear os objetos ao seu redor." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 06" },
        { t: "title", en: "THE BATHROOM", pt: "Veja como nomear itens básicos do banheiro." },
        { t: "image", id: "w16p6a", alt: "Banheiro com box de vidro, vaso sanitário e pia, com etiquetas em inglês.",
          ph: "Foto: banheiro moderno revestido de porcelanato cinza. À esquerda, box de vidro com porta de correr e perfis pretos, ducha de teto redonda, nicho na parede com plantinha e frascos, e uma toalha azul pendurada em um gancho preto do lado de fora. No centro, vaso sanitário branco suspenso com papel higiênico na parede e um quadro abstrato em tons de azul acima, ao lado de uma planta em vaso. À direita, gabinete de madeira escura com duas gavetas, bancada branca com cuba integrada, torneira preta alta, saboneteira âmbar, planta pequena, espelho redondo grande com moldura preta e luz por trás, e uma luminária pendente preta. No chão, tapete cinza-escuro. Quatro etiquetas brancas apontam para: “shower”, “sink”, “toilet” e “bathroom”." },
        { t: "note", v: "white", bar: true, kicker: "LOOK AND SAY", text: "This is the sink.\nThat is the shower.\nThis is the toilet." },
        { t: "sec", text: "VOCABULARY SUPPORT", c: "purple" },
        { t: "rows", items: [
          { text: "shower = chuveiro", c: "teal" },
          { text: "sink = pia", c: "purple" },
          { text: "toilet = vaso sanitário", c: "navy" } ] },
        { t: "meta", label: "TEMPO ESTIMADO", value: "10–12 min" },
        { t: "note", v: "gray", text: "Quanto mais você associa imagem e palavra, mais fácil fica memorizar." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 07" },
        { t: "title", en: "YOUR TURN!", pt: "Agora é a sua vez de praticar o vocabulário da aula." },
        { t: "sec", text: "1 · MATCH THE ROOM", c: "purple" },
        { t: "lead", text: "Faça as combinações corretas." },
        { t: "image", id: "w16p7a", alt: "Dez miniaturas em duas colunas, com móveis à esquerda e cômodos à direita.",
          ph: "Foto: dez miniaturas em cartões brancos, organizadas em duas colunas ligadas por bolinhas roxas, com uma seta roxa da primeira linha da esquerda para a primeira da direita. Coluna da esquerda, de cima para baixo: sofá bege de três lugares com almofada verde, ao lado da palavra “sofa”; geladeira inox de duas portas, “refrigerator”; cama de madeira com roupa de cama verde e dois criados-mudos, “bed”; box de banheiro de vidro com ducha preta, “shower”; escrivaninha de madeira com notebook, cadeira de escritório preta e uma plantinha, “desk”. Coluna da direita, de cima para baixo: foto de uma sala de estar com sofá e quadros, “living room”; cozinha verde-escura com ilha e banquinhos, “kitchen”; quarto com cama de roupa de cama verde e abajur, “bedroom”; banheiro com box de vidro, espelho redondo e gabinete de madeira, “bathroom”; área de estudo com estante, escrivaninha e cadeira preta, “study area”." },
        { t: "match", id: "w16match1", title: "MATCH THE ROOM",
          left: ["sofa", "refrigerator", "bed", "shower", "desk"],
          right: ["living room", "kitchen", "bedroom", "bathroom", "study area"],
          answer: [0, 1, 2, 3, 4] },
        { t: "sec", text: "2 · NAME IT!", c: "purple" },
        { t: "lead", text: "Observe as imagens e responda em inglês." },
        { t: "image", id: "w16p7b", alt: "Quatro fotos de objetos da casa: poltrona, luminária, almofadas e cadeiras.",
          ph: "Foto: quatro cartões brancos lado a lado, cada um com um objeto recortado em fundo branco. 1) Poltrona verde-escura de encosto alto com pés de madeira. 2) Luminária pendente preta em forma de cúpula, com o interior dourado. 3) Duas almofadas quadradas encostadas, uma bege-clara atrás e uma verde-escura à frente. 4) Duas cadeiras de madeira com assento claro, uma ao lado da outra." },
        { t: "free", id: "w16f1", cols: 2, items: [
          { n: "1", kicker: "POLTRONA VERDE", prefix: "What’s this?", ideas: "", v: "mint", c: "teal" },
          { n: "2", kicker: "LUMINÁRIA PENDENTE", prefix: "What’s that?", ideas: "", v: "lilac", c: "purple" },
          { n: "3", kicker: "DUAS ALMOFADAS", prefix: "What are these?", ideas: "", v: "cream", c: "yellow" },
          { n: "4", kicker: "DUAS CADEIRAS", prefix: "What are these?", ideas: "", v: "mint", c: "teal" } ] },
        { t: "note", v: "gray", text: "Tente responder em voz alta\nantes de conferir mentalmente." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 08" },
        { t: "title", en: "LET’S TALK!", pt: "Use o vocabulário da casa em uma conversa simples." },
        { t: "image", id: "w16p8a", alt: "Ana e Daniel conversando na sala de um apartamento moderno.",
          ph: "Ilustração: Ana, mulher de cabelo escuro comprido, camisa creme aberta sobre blusa branca, calça jeans e bolsa marrom a tiracolo, conversa gesticulando com Daniel, homem de cabelo castanho cacheado e barba, camisa verde aberta sobre camiseta branca e calça preta, que aponta com a mão direita. Ao fundo, um apartamento moderno de planta aberta: à esquerda, porta de vidro para a varanda com prédios da cidade; no centro, sofá bege com almofadas verdes, mesa de centro redonda escura com livros e planta e tapete claro; à direita, mesa de jantar de madeira com cadeiras verdes e a cozinha com armários verde-escuros, ilha com banquinhos, três luminárias pendentes douradas e geladeira inox. Plantas em vasos e um quadro abstrato na parede." },
        { t: "dialogue", items: [
          { s: "a", text: "Ana: Is this the living room?" },
          { s: "b", text: "Daniel: Yes, it is." },
          { s: "a", text: "Ana: Is that a sofa?" },
          { s: "b", text: "Daniel: Yes, it is." },
          { s: "a", text: "Ana: What are these?" },
          { s: "b", text: "Daniel: They’re chairs." },
          { s: "a", text: "Ana: And what’s that?" },
          { s: "b", text: "Daniel: It’s the kitchen." } ] },
        { t: "sec", text: "YOUR TURN", c: "purple" },
        { t: "lead", text: "Use as frases abaixo para falar da sua casa:" },
        { t: "chips", items: [
          { t: "This is…", c: "teal" },
          { t: "That is…", c: "purple" },
          { t: "These are…", c: "yellow" },
          { t: "Those are…", c: "green" } ] },
        { t: "note", v: "gray", text: "Fale em voz alta para transformar vocabulário em comunicação real." } ] },

      { blocks: [
        { t: "badge", label: "AULA 16", page: "PÁGINA 09" },
        { t: "kicker", text: "AULA CONCLUÍDA" },
        { t: "title", en: "VOCÊ JÁ SABE FALAR SOBRE A CASA.", pt: "Use este checklist antes de avançar." },
        { t: "check", id: "w16c1", title: "EU CONSIGO...", items: [
          "identificar house, garden, living room e kitchen.",
          "reconhecer sofa / couch, coffee table e side table.",
          "reconhecer bedroom, desk, shower, sink e toilet.",
          "associar cada objeto ao cômodo correto.",
          "usar frases curtas com this, that, these e those." ] },
        { t: "objective", v: "red", title: "REVISE AS PÁGINAS 2 A 8", text: "se ainda confunde os cômodos e os objetos da casa." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 16", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: olhe para sua casa ou imagine um cômodo. Diga 5 frases curtas usando this, that, these ou those.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 17 · THERE IS / THERE ARE", body: "Você aprenderá a descrever o que existe em cada ambiente." },
        { t: "bar", label: "PROGRESSO", value: "16 DE 42 AULAS", pct: "38%" } ] }
    ]
  },

  {
      id: 17, code: "AULA 17", title: "There is / There are", sub: "Fale sobre o que existe em um lugar.",
      time: "16 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 17" },
          { t: "title", en: "THERE IS / THERE ARE", pt: "What is there? Falando sobre o que existe em um lugar." },
          { t: "image", id: "w17p1", alt: "Sala de estar com sofá verde, poltronas e estante de livros", ph: "Foto: sala de estar ampla e iluminada. No centro, um sofá de três lugares em tecido verde-petróleo com uma almofada bege e outra laranja. À esquerda, uma poltrona bege com almofada azul-marinho e, atrás dela, uma estante alta de prateleiras de madeira com estrutura de metal preto, cheia de livros, vasinhos e objetos de cerâmica, com uma luminária articulada preta presa a uma das prateleiras. À direita, uma poltrona azul e uma planta grande de folhas largas em vaso branco, junto a uma janela de esquadria preta com árvores lá fora. Ao centro, uma mesa de centro de madeira com livros empilhados, uma plantinha em vaso branco e uma caneca azul-marinho, sobre um tapete claro. Na parede do fundo, um quadro abstrato em azul, bege e laranja, e uma luminária pendente preta de cúpula arredondada." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "A IDEIA PRINCIPAL", text: "Usamos THERE IS / THERE ARE para dizer que algo existe ou está presente em um lugar." },
          { t: "cards", cols: 2, items: [
            { tag: "ONE · singular", c: "green", v: "mint", lines: ["THERE IS", "There is a sofa."] },
            { tag: "MORE THAN ONE · plural", c: "teal", v: "blue", lines: ["THERE ARE", "There are chairs."] } ] },
          { t: "answers", title: "NÃO CONFUNDA", v: "cream", items: [
            { k: "I have a sofa.", a: "Eu tenho um sofá.", c: "yellow" },
            { k: "There is a sofa here.", a: "Há / Tem um sofá aqui.", c: "yellow" } ] },
          { t: "objective", v: "blue", title: "OBJETIVO", text: "Aprender a dizer o que existe, ou não existe, em diferentes ambientes." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 02" },
          { t: "title", en: "THERE IS: ONE THING", pt: "Afirmativa no singular." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "ESTRUTURA", text: "THERE IS + A/AN + SINGULAR NOUN" },
          { t: "cards", cols: 1, items: [
            { tag: "PENCIL", c: "teal", v: "mint", id: "w17p2a", alt: "Lápis amarelo apontado", ph: "Ilustração: lápis amarelo apontado, inclinado na diagonal, com ponta de grafite escura e borracha rosa presa por um anel metálico na outra extremidade, dentro de um círculo branco.", lines: ["There is a pencil on this table."] },
            { tag: "SOFA", c: "teal", v: "mint", id: "w17p2b", alt: "Sofá verde-petróleo de dois lugares", ph: "Ilustração: sofá de dois lugares em tecido verde-petróleo, visto de frente, com duas almofadas de encosto, braços arredondados e pés curtos de madeira, dentro de um círculo branco.", lines: ["There is a sofa in the living room."] },
            { tag: "BED", c: "teal", v: "mint", id: "w17p2c", alt: "Cama de casal com cabeceira de madeira", ph: "Ilustração: cama de casal vista de lado, com cabeceira e pés de madeira escura, colchão branco, colcha verde-petróleo dobrada sobre os pés e dois travesseiros azul-claros, dentro de um círculo branco.", lines: ["There is a bed in the bedroom."] },
            { tag: "ERASER", c: "teal", v: "mint", id: "w17p2d", alt: "Borracha escolar rosa e azul", ph: "Ilustração: borracha escolar retangular vista de lado e levemente inclinada, com a parte de baixo rosa e a de cima azul, dentro de um círculo branco.", lines: ["There is an eraser on this table."] } ] },
          { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", text: "Use a antes de som consonantal: a sofa, a bed.\nUse an antes de som vocálico: an eraser." },
          { t: "key", v: "cream", text: "ONE → THERE IS" },
          { t: "note", v: "blue", bar: true, kicker: "FALE EM VOZ ALTA", text: "Repita os quatro exemplos antes de seguir." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 03" },
          { t: "title", en: "THERE ISN’T: ONE THING", pt: "Negativa no singular." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "ESTRUTURA", text: "THERE ISN’T + A/AN + SINGULAR NOUN" },
          { t: "cards", cols: 1, items: [
            { tag: "EXEMPLO 1", c: "red", v: "gray", id: "w17p3a", alt: "Mesa redonda de madeira com um vaso de planta", ph: "Foto: mesa redonda de madeira clara com um vaso branco de plantinha verde no centro do tampo, vista de cima e de lado. Ao lado direito, uma cadeira estofada verde-petróleo com pés de madeira. A mesa está sobre um tapete claro, com a parede branca ao fundo. Não há nenhum livro sobre a mesa.", lines: ["There isn’t a book on this table."] },
            { tag: "EXEMPLO 2", c: "red", v: "gray", id: "w17p3b", alt: "Banheiro com box de vidro, pia e espelho redondo", ph: "Foto: banheiro com paredes de azulejo verde-água. À esquerda, um box de vidro com chuveiro de teto. À direita, uma bancada estreita de madeira com pia branca de louça, um sabonete líquido e uma plantinha, espelho redondo de moldura fina dourada na parede e uma toalha verde-clara pendurada na lateral da bancada. No chão, ladrilho estampado em azul-escuro e branco.", lines: ["There isn’t a bed in the bathroom."] },
            { tag: "EXEMPLO 3", c: "red", v: "gray", id: "w17p3c", alt: "Sala com sofá verde e planta em vaso", ph: "Foto: sala de estar com um sofá de três lugares em tecido verde-petróleo, com almofadas bege e laranja. À frente, uma mesa de centro redonda de madeira com livros empilhados, uma plantinha em vaso branco e uma caneca azul-marinho. À direita, uma planta grande de folhas largas em vaso de fibra. Na parede do fundo, um quadro emoldurado. Não há geladeira nenhuma na sala.", lines: ["There isn’t a refrigerator in the living room."] },
            { tag: "EXEMPLO 4", c: "red", v: "gray", id: "w17p3d", alt: "Poltrona azul ao lado de uma estante de livros", ph: "Foto: canto de sala com uma poltrona azul-escura de madeira com almofada bege. Ao lado, uma estante baixa de madeira cheia de livros coloridos, com vasinhos de planta e livros empilhados em cima. À esquerda, um abajur de chão preto de haste fina e cúpula arredondada. Parede branca ao fundo e piso de madeira clara. Não há computador nenhum no ambiente.", lines: ["There isn’t a computer in my living room."] } ] },
          { t: "sec", text: "COMPARE", c: "yellow" },
          { t: "rows", items: [
            { n: "✓", text: "There is a bed.", c: "green" },
            { n: "✗", text: "There isn’t a bed.", c: "red" } ] },
          { t: "note", v: "blue", bar: true, kicker: "ATALHO", text: "isn’t = is not. A ideia é dizer que algo não existe/não está presente." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 04" },
          { t: "title", en: "IS THERE…?", pt: "Perguntas no singular e respostas curtas." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "ESTRUTURA", text: "IS THERE + A/AN + SINGULAR NOUN?" },
          { t: "steps", items: [
            { n: "1", tag: "Is there an eraser on this table?", c: "purple", v: "white", lines: ["Yes, there is.", "No, there isn’t."] },
            { n: "2", tag: "Is there a sink in the kitchen?", c: "purple", v: "white", lines: ["Yes, there is.", "No, there isn’t."] },
            { n: "3", tag: "Is there a shower in the bedroom?", c: "purple", v: "white", lines: ["Yes, there is.", "No, there isn’t."] } ] },
          { t: "answers", title: "MUDANÇA DE ORDEM", v: "blue", items: [
            { k: "There is a sink.", a: "Is there a sink?", c: "teal" } ] },
          { t: "note", v: "cream", bar: true, bold: true, kicker: "RESPONDA CURTO", text: "Yes, there is. / No, there isn’t." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 05" },
          { t: "title", en: "THERE ARE: MORE THAN ONE", pt: "Afirmativa no plural." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "ESTRUTURA", text: "THERE ARE + SOME + PLURAL NOUN" },
          { t: "cards", cols: 1, items: [
            { tag: "EXEMPLO 1", c: "teal", v: "blue", id: "w17p5a", alt: "Lava-louças aberto com pratos dentro", ph: "Ilustração: lava-louças de aço prateado com a porta aberta e abaixada, mostrando o cesto cheio de pratos brancos e verde-petróleo em pé. No painel superior, botões e um visor pequeno.", lines: ["There are some plates in the dishwasher."] },
            { tag: "EXEMPLO 2", c: "teal", v: "blue", id: "w17p5b", alt: "Cadeira estofada azul de encosto alto", ph: "Ilustração: cadeira estofada azul-marinho vista de frente, com encosto alto e acolchoado, braços baixos e arredondados, assento largo e quatro pés finos de madeira escura inclinados para fora.", lines: ["There are some chairs in the dining room."] },
            { tag: "EXEMPLO 3", c: "teal", v: "blue", id: "w17p5c", alt: "Porta-lápis azul com quatro lápis amarelos", ph: "Ilustração: porta-lápis cilíndrico azul-marinho com quatro lápis amarelos apontados dentro, com as pontas de grafite viradas para cima e borrachas rosa à mostra.", lines: ["There are 4 pencils on this table."] } ] },
          { t: "note", v: "cream", bar: true, bold: true, kicker: "ONE × MORE THAN ONE", text: "There is a chair.\nThere are some chairs." },
          { t: "note", v: "cream", text: "Nesta aula, some aparece em frases afirmativas no plural." },
          { t: "note", v: "blue", bar: true, bold: true, kicker: "CHAVE", text: "Plural → THERE ARE." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 06" },
          { t: "title", en: "THERE AREN’T: MORE THAN ONE", pt: "Negativa no plural." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "ESTRUTURA", text: "THERE AREN’T + ANY + PLURAL NOUN" },
          { t: "rows", items: [
            { n: "✗", text: "There aren’t any books on this table.", c: "red" },
            { n: "✗", text: "There aren’t any people in this photo.", c: "red" },
            { n: "✗", text: "There aren’t any computers in my living room.", c: "red" } ] },
          { t: "sec", text: "COMPARE", c: "yellow" },
          { t: "rows", items: [
            { n: "✓", text: "There are some computers.", c: "green" },
            { n: "✗", text: "There aren’t any computers.", c: "red" } ] },
          { t: "key", v: "cream", text: "aren’t = are not." },
          { t: "note", v: "blue", bar: true, kicker: "PADRÃO", text: "Nesta aula: some no plural afirmativo;\nany no plural negativo." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 07" },
          { t: "title", en: "ARE THERE…?", pt: "Perguntas no plural e respostas curtas." },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "ESTRUTURA", text: "ARE THERE + ANY + PLURAL NOUN?" },
          { t: "steps", items: [
            { n: "1.", tag: "Are there any erasers on this table?", c: "teal", v: "white", lines: ["Yes, there are.", "No, there aren’t."] },
            { n: "2.", tag: "Are there any windows in the living room?", c: "teal", v: "white", lines: ["Yes, there are.", "No, there aren’t."] } ] },
          { t: "answers", title: "AFIRMATIVA → PERGUNTA", v: "blue", items: [
            { k: "There are windows.", a: "Are there any windows?", c: "blue" } ] },
          { t: "note", v: "cream", bold: true, center: true, kicker: "RESPOSTAS CURTAS", text: "Yes, there are.  /  No, there aren’t." },
          { t: "note", v: "lilac", bar: true, kicker: "DICA", text: "Em perguntas no plural desta aula, use ANY." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 08" },
          { t: "title", en: "A / AN, SOME OR ANY?", pt: "Organizando as escolhas dentro de THERE IS / THERE ARE." },
          { t: "cards", cols: 1, items: [
            { tag: "SINGULAR · AFFIRMATIVE", c: "teal", v: "mint", id: "w17p8a", alt: "Ícone de poltrona verde", ph: "Ilustração: ícone de poltrona verde-petróleo, vista de frente, com encosto arredondado e braços largos, dentro de um círculo de borda fina verde-petróleo.", lines: ["a/an", "There is a sofa.", "There is an eraser."] },
            { tag: "PLURAL · AFFIRMATIVE", c: "purple", v: "lilac", id: "w17p8b", alt: "Ícone de duas cadeiras roxas", ph: "Ilustração: ícone roxo de duas cadeiras iguais lado a lado, vistas de frente, com encosto alto e pés retos, dentro de um círculo de borda fina roxa.", lines: ["some", "There are some chairs.", "There are some plates."] },
            { tag: "PLURAL · NEGATIVE", c: "yellow", v: "cream", id: "w17p8c", alt: "Ícone de livro aberto amarelo", ph: "Ilustração: ícone amarelo-dourado de livro aberto ao meio, com as páginas viradas para cima, dentro de um círculo de borda fina amarela.", lines: ["any", "There aren’t any chairs.", "There aren’t any books."] },
            { tag: "PLURAL · QUESTION", c: "blue", v: "blue", id: "w17p8d", alt: "Ícone de janela azul de quatro vidraças", ph: "Ilustração: ícone azul de janela quadrada dividida em quatro vidraças por caixilhos em cruz, dentro de um círculo de borda fina azul.", lines: ["any", "Are there any chairs?", "Are there any windows?"] } ] },
          { t: "note", v: "cream", bar: true, kicker: "RESUMO OPERACIONAL", text: "a/an → singular  ·  some → plural afirmativo  ·  any → plural negativo/perguntas" },
          { t: "note", v: "blue", bar: true, kicker: "IMPORTANTE", text: "Este é o uso necessário para esta aula.\nNão é ainda uma teoria completa de some/any." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 09" },
          { t: "title", en: "YOUR TURN: WHAT IS THERE?", pt: "Complete as frases e depois confira a lógica." },
          { t: "image", id: "w17p9", alt: "Sala de estar com sofá bege e janela com vista da cidade", ph: "Foto: sala de estar com um sofá de três lugares em tecido bege, com uma almofada azul-marinho e outra laranja. À frente, uma mesa de centro de madeira com livros empilhados, uma plantinha em vaso branco e uma caneca azul-escura, sobre um tapete claro. À esquerda, uma planta alta de folhas largas em vaso de cerâmica bege e um abajur de chão preto de cúpula arredondada; na parede bege, um quadro emoldurado com formas abstratas em bege, azul-escuro e laranja. Ao centro e à direita, uma estante alta de prateleiras de madeira com estrutura de metal preto, com livros, vasos e plantinhas, e uma janela grande com vista para árvores e prédios da cidade. Junto à janela, uma poltrona azul-escura de madeira e um aparador com um abajur aceso." },
          { t: "fill", id: "w17e1", title: "COMPLETE", items: [
            { pre: "1.", answers: ["There is"], post: "a sofa in the living room.", v: "mint" },
            { pre: "2.", answers: ["There isn’t"], post: "a refrigerator in the bedroom.", v: "lilac" },
            { pre: "3.", answers: ["Are there"], post: "any chairs in the kitchen?", v: "cream" },
            { pre: "4.", answers: ["There are"], post: "some windows in the living room.", v: "mint" },
            { pre: "5.", answers: ["Is there"], post: "a shower in the kitchen?", v: "lilac" },
            { pre: "6.", answers: ["There aren’t"], post: "any people in the room.", v: "cream" } ] },
          { t: "chips", title: "OPÇÕES", items: [
            { t: "There is", c: "teal" },
            { t: "There isn’t", c: "red" },
            { t: "Is there", c: "purple" },
            { t: "There are", c: "teal" },
            { t: "There aren’t", c: "red" },
            { t: "Are there", c: "purple" } ] },
          { t: "note", v: "blue", bar: true, bold: true, kicker: "SEGUNDO PASSO", text: "Depois escolha a/an, some ou any quando for necessário." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 10" },
          { t: "title", en: "LET’S TALK! MY HOME", pt: "Use a nova estrutura em uma conversa curta." },
          { t: "image", id: "w17p10", alt: "Casal olhando um tablet dentro de um apartamento", ph: "Foto: dentro de um apartamento integrado, uma mulher de cabelo castanho comprido, camiseta bege e bolsa de couro a tiracolo aponta para a tela de um tablet preto segurado por um homem de barba e cabelo escuro cacheado, de camisa jeans azul-escura aberta sobre camiseta branca e relógio no pulso. Os dois sorriem olhando para o tablet. À esquerda, a sala com sofá bege, almofada azul, mesa de centro com livros e uma plantinha, quadro colorido na parede e uma janela grande com vista da cidade. À direita, a cozinha com armários claros, luminárias pendentes pretas, geladeira de inox e uma mesa de jantar de madeira com cadeiras azuis e um vaso de planta no centro." },
          { t: "dialogue", items: [
            { s: "a", text: "Ana: Is there a living room?" },
            { s: "b", text: "Daniel: Yes, there is." },
            { s: "a", text: "Ana: Is there a sofa?" },
            { s: "b", text: "Daniel: Yes, there is." },
            { s: "a", text: "Ana: Are there any chairs?" },
            { s: "b", text: "Daniel: Yes, there are." },
            { s: "a", text: "Ana: Are there any computers?" },
            { s: "b", text: "Daniel: No, there aren’t." },
            { s: "a", text: "Ana: Is there a desk in the bedroom?" },
            { s: "b", text: "Daniel: Yes, there is." } ] },
          { t: "note", v: "cream", bar: true, bold: true, kicker: "YOUR TURN", text: "Fale sobre sua casa:\nThere is… / There isn’t… / There are… / There aren’t…\ne faça uma pergunta." } ] },

        { blocks: [
          { t: "badge", label: "AULA 17", page: "PÁGINA 11" },
          { t: "title", en: "AULA CONCLUÍDA!", pt: "Você já consegue falar sobre o que existe em diferentes ambientes." },
          { t: "check", id: "w17c1", title: "EU CONSIGO...", items: [
            "entender quando usamos there is / there are.",
            "usar there is com singular.",
            "usar there are com plural.",
            "formar negativas com there isn’t / there aren’t.",
            "perguntar Is there…? / Are there…?",
            "responder Yes/No com there is/are.",
            "usar a/an, some e any nas estruturas da aula.",
            "falar sobre o que existe em uma casa ou ambiente." ] },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 17", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Missão: descreva um cômodo real da sua casa e responda a perguntas com Is there…? e Are there…?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "note", v: "cream", bar: true, kicker: "MICRODESAFIO", text: "Diga 4 frases sobre um cômodo: uma com There is, uma com There isn’t,\numa com There are e uma com There aren’t." },
          { t: "bar", label: "PROGRESSO", value: "17 DE 42 AULAS", pct: "40%" },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 18 · PREPOSITIONS OF PLACE", body: "onde as coisas estão" } ] }
      ]
    },

  {
      id: 18, code: "AULA 18", title: "Prepositions of Place", sub: "Diga onde as pessoas e as coisas estão.",
      time: "15 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 18" },
          { t: "title", en: "PREPOSITIONS OF PLACE", pt: "Where is it?" },
          { t: "lead", text: "Prepositions of place são palavras que usamos para dizer onde as pessoas e as coisas estão." },
          { t: "image", id: "w18p1a", alt: "Sala de estar clara com sofá bege, mesa de centro e janela para o jardim", ph: "Foto: sala de estar clara e ensolarada vista de frente. No centro, um sofá bege de três lugares com almofadas azul-marinho, estampada em preto e branco e laranja-queimado. À direita, janelas do chão ao teto com cortina bege mostram o jardim verde; ao lado do sofá, um abajur de tripé de madeira com cúpula branca e uma planta grande de folhas verdes em vaso. Na parede bege, um quadro abstrato em bege, preto e azul com moldura clara. À frente, uma mesa de centro oval de madeira escura com uma pilha de livros e um vaso preto redondo com uma plantinha; embaixo dela, um tapete bege de pelo alto sobre piso de madeira." },
          { t: "note", v: "gray", kicker: "PENSE ASSIM", text: "Você já sabe o que existe com “There is” e “There are”.\nAgora vamos aprender onde está cada coisa!" },
          { t: "sec", text: "O QUE VOCÊ VAI APRENDER", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "on", note: "em cima", c: "teal", v: "mint", id: "w18p1b", alt: "Ícone de bola laranja em cima de um cubo", ph: "Ilustração: ícone plano com contorno escuro de um cubo azul-petróleo em perspectiva, com uma bola laranja apoiada em cima da face superior." },
            { tag: "above", note: "acima de", c: "purple", v: "lilac", id: "w18p1c", alt: "Ícone de bola laranja flutuando acima de um cubo", ph: "Ilustração: ícone plano de um cubo azul-petróleo em perspectiva com uma bola laranja flutuando acima dele, ligada ao cubo por uma linha vertical tracejada." },
            { tag: "under", note: "embaixo de", c: "yellow", v: "cream", id: "w18p1d", alt: "Ícone de bola laranja embaixo de uma mesa", ph: "Ilustração: ícone plano de uma mesa azul-petróleo de quatro pernas vista de frente, com uma bola laranja embaixo do tampo." },
            { tag: "in / inside", note: "dentro de", c: "teal", v: "mint", id: "w18p1e", alt: "Ícone de bola laranja dentro de uma caixa aberta", ph: "Ilustração: ícone plano de uma caixa azul-petróleo aberta vista de frente, com uma bola laranja dentro dela aparecendo na abertura." },
            { tag: "in front of", note: "na frente de", c: "purple", v: "lilac", id: "w18p1f", alt: "Ícone de bola laranja na frente de um cubo", ph: "Ilustração: ícone plano de um cubo azul-petróleo com uma bola laranja posicionada à frente da face do cubo, no canto inferior esquerdo." },
            { tag: "behind", note: "atrás de", c: "yellow", v: "cream", id: "w18p1g", alt: "Ícone de bola laranja atrás de um cubo", ph: "Ilustração: ícone plano de um cubo azul-petróleo com uma bola laranja atrás dele, aparecendo só pela metade na lateral direita." },
            { tag: "between", note: "entre", c: "teal", v: "mint", id: "w18p1h", alt: "Ícone de bola laranja entre dois cubos", ph: "Ilustração: ícone plano de dois cubos azul-petróleo lado a lado com uma bola laranja no espaço entre eles." },
            { tag: "beside", note: "ao lado de", c: "purple", v: "lilac", id: "w18p1i", alt: "Ícone de bola laranja ao lado de um cubo", ph: "Ilustração: ícone plano de um cubo azul-petróleo com uma bola laranja encostada na base da lateral direita." },
            { tag: "near", note: "perto de", c: "yellow", v: "cream", id: "w18p1j", alt: "Ícone de bola laranja perto de um cubo", ph: "Ilustração: ícone plano de um cubo azul-petróleo com uma bola laranja um pouco afastada à direita, próxima mas sem encostar." },
            { tag: "opposite", note: "em frente a", c: "teal", v: "mint", id: "w18p1k", alt: "Ícone de poltrona em frente a uma TV", ph: "Ilustração: ícone plano de uma poltrona azul-petróleo à esquerda e uma televisão preta de tela plana à direita, com uma seta horizontal de duas pontas ligando as duas." },
            { tag: "at", note: "à mesa / no lugar", c: "purple", v: "lilac", id: "w18p1l", alt: "Ícone de mesa com vaso e cadeira ao lado", ph: "Ilustração: ícone plano de uma mesa azul-petróleo com um vasinho de planta em cima e uma cadeira de madeira clara de costas ao lado direito." },
            { tag: "in the middle of", note: "no meio de", c: "yellow", v: "cream", id: "w18p1m", alt: "Ícone de bola laranja no meio de um tapete", ph: "Ilustração: ícone plano de um tapete marrom retangular visto em perspectiva, com uma bola laranja no centro dele." } ] },
          { t: "grid", cols: 2, items: [
            { kicker: "VOCÊ JÁ SABE", title: "We use “There is” and “There are” to say what exists.", body: "There is a sofa.\nThere are two chairs.", v: "mint", c: "teal" },
            { kicker: "AGORA VAMOS AVANÇAR!", title: "Vamos descrever onde tudo está usando as prepositions of place.", body: "There is a rug under the coffee table.", v: "lilac", c: "purple" } ] },
          { t: "note", v: "navy", kicker: "IMPORTANTE", bold: true, text: "Essas palavras nos ajudam a falar com mais clareza e entender melhor o mundo à nossa volta em inglês." },
          { t: "key", v: "teal", text: "Saber onde as coisas estão é essencial para se comunicar de verdade!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 02" },
          { t: "title", en: "ON × ABOVE × UNDER", pt: "Entenda a diferença" },
          { t: "lead", text: "Essas três preposições descrevem posições no espaço. A chave é lembrar o contato e a relação entre os objetos." },
          { t: "image", id: "w18p2a", alt: "Sala com quadro na parede, mesa lateral, sofá e mesa de centro com um livro", ph: "Foto: sala de estar clara vista em diagonal. Na parede bege, um quadro em preto e branco de uma árvore solitária num campo, com moldura preta; ao lado, uma luminária pendente preta em forma de cúpula. À esquerda, uma mesa lateral redonda preta de duas prateleiras, com um vasinho de planta e uma tigela de madeira em cima e livros embaixo. Ao centro-direita, um sofá bege com almofadas azul-marinho e estampada em preto e branco, e uma almofada laranja-queimado. À frente, uma mesa de centro redonda de madeira escura com um livro verde fechado da KINFOLK e um vaso preto redondo com planta. Embaixo da mesa, um tapete bege de tricô sobre piso de madeira clara; à direita, uma planta grande e a janela com cortina." },
          { t: "steps", items: [
            { n: "1", tag: "ON", c: "teal", v: "mint", note: "Usamos ON para indicar contato. Algo está em cima de uma superfície.", lines: ["The book is on the table.", "O livro está em cima da mesa."] },
            { n: "2", tag: "ABOVE", c: "purple", v: "lilac", note: "Usamos ABOVE para indicar que algo está acima de outra coisa, sem contato.", lines: ["The photo is above the side table.", "A foto está acima da mesa lateral."] },
            { n: "3", tag: "UNDER", c: "teal", v: "mint", note: "Usamos UNDER para indicar que algo está embaixo de outra coisa.", lines: ["The rug is under the coffee table.", "O tapete está embaixo da mesa de centro."] } ] },
          { t: "note", v: "navy", kicker: "PARA NÃO ESQUECER", bold: true, text: "ON = há contato\nABOVE = está acima, sem contato\nUNDER = está abaixo" },
          { t: "sec", text: "VAMOS PRATICAR?", c: "teal" },
          { t: "lead", text: "Observe a sala e diga:" },
          { t: "rows", items: [
            { n: "1", text: "What is on the table?", c: "teal" },
            { n: "2", text: "What is above the side table?", c: "purple" },
            { n: "3", text: "What is under the coffee table?", c: "teal" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 03" },
          { t: "title", en: "IN / INSIDE × IN FRONT OF × BEHIND", pt: "Veja a posição com clareza" },
          { t: "lead", text: "Essas expressões mostram se algo está dentro, à frente ou atrás de outra coisa. Observe a relação entre pessoas e objetos." },
          { t: "image", id: "w18p3a", alt: "Bruno na frente e dois amigos atrás dele, com uma caixa sobre a mesa", ph: "Foto: ambiente claro de escritório ou sala de estar. Em primeiro plano, Bruno, homem de cabelo castanho cacheado, barba curta e camiseta verde-escura, sorri de frente com a mão no bolso da calça bege e um relógio no pulso esquerdo. Atrás dele, à esquerda, uma mulher de cabelo castanho ondulado, suéter bege claro e calça jeans, de braços cruzados e sorrindo; à direita, um homem de óculos, cabelo cacheado, camisa marrom-clara aberta sobre camiseta creme e calça escura, com as mãos nos bolsos. Sobre a mesa de madeira à frente, uma caixa de papelão aberta com um fone de ouvido preto dentro, a tampa da caixa encostada atrás, um caderno verde-escuro com espiral e uma caneca preta. Ao fundo, prateleiras com livros e plantas e um quadro na parede." },
          { t: "steps", items: [
            { n: "1", tag: "IN / INSIDE", c: "teal", v: "mint", note: "Usamos IN / INSIDE para indicar que algo está dentro de um espaço ou recipiente.", lines: ["The object is in the box.", "O objeto está dentro da caixa."] },
            { n: "2", tag: "IN FRONT OF", c: "purple", v: "lilac", note: "Usamos IN FRONT OF para indicar que algo está à frente de outra coisa.", lines: ["The person is in front of the box.", "A pessoa está na frente da caixa."] },
            { n: "3", tag: "BEHIND", c: "teal", v: "mint", note: "Usamos BEHIND para indicar que algo está atrás de outra coisa.", lines: ["Bruno’s friends are behind him in this photo.", "Os amigos de Bruno estão atrás dele nesta foto."] } ] },
          { t: "image", id: "w18p3b", alt: "Dois quadros lado a lado: câmera dentro da caixa e mulher na frente da caixa", ph: "Foto: dois quadros lado a lado com etiquetas no topo. À esquerda, a etiqueta azul-marinho “IN / INSIDE” sobre a foto de uma caixa de papelão aberta vista de cima e de frente, com uma câmera fotográfica preta dentro dela, sobre piso de madeira e parede clara. À direita, a etiqueta roxa “IN FRONT OF” sobre a foto de uma mulher de cabelo castanho, suéter bege claro, calça jeans e tênis branco, em pé e sorrindo bem na frente de uma caixa de papelão fechada que fica atrás das pernas dela, junto à parede clara." },
          { t: "note", v: "navy", kicker: "REPARE NA DIFERENÇA", bold: true, text: "IN / INSIDE = dentro\nIN FRONT OF = na frente de\nBEHIND = atrás de" },
          { t: "sec", text: "OBSERVE E RESPONDA", c: "teal" },
          { t: "lead", text: "Olhe para as imagens e responda:" },
          { t: "rows", items: [
            { n: "1", text: "What is in the box?", c: "teal" },
            { n: "2", text: "Who is in front of the box?", c: "purple" },
            { n: "3", text: "Who is behind Bruno?", c: "teal" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 04" },
          { t: "title", en: "BETWEEN × BESIDE × NEAR", pt: "Entenda relações de proximidade" },
          { t: "lead", text: "Essas preposições de lugar mostram como as coisas e as pessoas estão posicionadas em relação umas às outras." },
          { t: "image", id: "w18p4a", alt: "Três amigos numa mesa de café, com etiquetas BETWEEN, BESIDE e NEAR", ph: "Foto: café moderno com pé-direito alto, luminárias pendentes e parede de ripas de madeira ao fundo. Numa mesa redonda de madeira estão três pessoas: à esquerda, Sarah, de cabelo loiro comprido e suéter creme, segura um copo de café com tampa preta; ao centro, Juan, de cabelo escuro cacheado, barba e camisa verde-escura, sorri atrás de um notebook aberto; à direita, Julia, de cabelo castanho escuro e cardigã creme, segura uma caneca preta. Sobre a mesa há também um vasinho de planta e um caderno preto. À direita, janelas grandes dão para a rua, com uma poltrona verde-azulada e uma mesinha redonda perto da janela; em primeiro plano à direita, uma cadeira de madeira de encosto curvo ao lado da mesa. Etiquetas brancas com balões apontam para a cena: “BETWEEN: Juan is between Sarah and Julia.” no alto ao centro, “NEAR: The chair is near the window.” no alto à direita e “BESIDE: The chair is beside the table.” embaixo à direita." },
          { t: "steps", items: [
            { n: "1", tag: "BETWEEN", c: "teal", v: "mint", note: "Usamos BETWEEN para indicar que algo ou alguém está entre duas pessoas, objetos ou lugares.", lines: ["Juan is between Sarah and Julia.", "Juan está entre Sarah e Julia."] },
            { n: "2", tag: "BESIDE", c: "purple", v: "lilac", note: "Usamos BESIDE para indicar que algo está ao lado de outra coisa.", lines: ["The chair is beside the table.", "A cadeira está ao lado da mesa."] },
            { n: "3", tag: "NEAR", c: "teal", v: "mint", note: "Usamos NEAR para indicar que algo está perto de outra coisa.", lines: ["The chair is near the window.", "A cadeira está perto da janela."] } ] },
          { t: "note", v: "navy", kicker: "REPARE NA DIFERENÇA", bold: true, text: "BETWEEN = entre (2 referências)\nBESIDE = ao lado de\nNEAR = perto de" },
          { t: "sec", text: "OBSERVE E RESPONDA", c: "teal" },
          { t: "rows", items: [
            { n: "1", text: "Who is between Sarah and Julia?", c: "teal" },
            { n: "2", text: "What is beside the table?", c: "purple" },
            { n: "3", text: "What is near the window?", c: "teal" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 05" },
          { t: "title", en: "OPPOSITE", pt: "Veja posições em contextos reais" },
          { t: "image", id: "w18p5a", alt: "Sala com o sofá de um lado e a TV do outro, ligados por uma seta", ph: "Foto: sala de estar clara vista de frente. À esquerda, um sofá bege com almofadas azul-marinho e laranja-queimado, com a etiqueta branca “sofa” apontando para ele; atrás, janelas altas com o jardim verde e um abajur de tripé com cúpula branca. Ao centro, uma mesa de centro oval de madeira escura com uma pilha de livros e um vaso preto com planta, sobre um tapete bege. À direita, um rack de madeira com uma televisão preta de tela plana em cima, com a etiqueta branca “TV” apontando para ela, ao lado de uma estante de madeira com livros e vasos e de plantas grandes. Na parede bege há dois quadros abstratos. Uma seta pontilhada de duas pontas atravessa a sala ligando o sofá à TV, e no centro uma tarja branca traz “The TV is opposite the sofa.” e, em itálico, “A TV está em frente ao sofá.”" },
          { t: "note", v: "gray", kicker: "LEMBRE-SE!", text: "OPPOSITE = em frente / em frente a" },
          { t: "steps", items: [
            { n: "1", tag: "at", c: "teal", v: "mint", lines: ["They are at the table.", "Eles estão à mesa."], id: "w18p5b", alt: "Três amigos sentados à mesa redonda de um café", ph: "Foto: três amigos sentados a uma mesa redonda de madeira num café. À esquerda, uma mulher loira de suéter creme segura um copo de café; ao centro, um homem de barba e camisa verde-escura sorri; à direita, uma mulher de cabelo castanho e cardigã creme segura uma caneca preta. Sobre a mesa, um vasinho de planta e um caderno preto; ao fundo, o balcão do café com plantas e prateleiras de madeira." },
            { n: "2", tag: "in the middle of", c: "purple", v: "lilac", lines: ["There is a rug in the middle of Sophia’s bedroom.", "Há um tapete no meio do quarto da Sophia."], id: "w18p5c", alt: "Quarto claro com um tapete redondo no meio do piso", ph: "Foto: quarto claro e arrumado. À esquerda, uma cama de casal com roupa de cama rosa-claro e pêssego e almofadas; na parede acima, dois quadrinhos e prateleiras com objetos. À direita, uma janela com cortina bege, uma escrivaninha branca com cadeira clara e um espelho redondo na parede. No centro do piso de madeira, um tapete redondo bege de pelo alto, com uma linha pontilhada descendo até o ponto roxo no meio dele." },
            { n: "3", tag: "on the right / on the left", c: "teal", v: "mint", lines: ["Sarah is on the right.", "Julia is on the left.", "Sarah está à direita.", "Julia está à esquerda."], id: "w18p5d", alt: "Duas mulheres lado a lado com etiquetas de esquerda e direita", ph: "Foto: duas jovens em pé lado a lado, sorrindo, diante de uma parede clara. À esquerda, Julia, de cabelo castanho escuro comprido, jaqueta jeans sobre camiseta branca e calça jeans. À direita, Sarah, de cabelo loiro escuro, suéter verde-oliva e calça jeans. Embaixo de cada uma há uma etiqueta branca: “Julia (left)” à esquerda e “Sarah (right)” à direita, ligadas às moças por linhas pontilhadas." } ] },
          { t: "note", v: "lilac", bar: true, kicker: "FOQUE NA POSIÇÃO!", text: "Use opposite para dizer que algo está em frente de outra coisa.\nObserve bem as imagens e pratique em voz alta!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 06" },
          { t: "kicker", text: "OBSERVE E MEMORIZE" },
          { t: "title", en: "BOX CHALLENGE!", pt: "Vamos revisar todas as posições usando uma caixa e uma bola." },
          { t: "lead", text: "Veja as imagens com atenção. Depois, tente descrever cada posição em voz alta!" },
          { t: "steps", items: [
            { n: "1", tag: "ON", note: "em cima de", c: "teal", v: "mint", lines: ["The ball is on the box."], id: "w18p6a", alt: "Bola laranja em cima de uma caixa de papelão", ph: "Foto: caixa de papelão fechada sobre uma mesa de madeira clara, com uma bola laranja apoiada bem no centro da tampa. Ao fundo, uma sala desfocada com estante de madeira e plantas." },
            { n: "2", tag: "ABOVE", note: "acima de", c: "purple", v: "lilac", lines: ["The ball is above the box."], id: "w18p6b", alt: "Bola laranja no ar, acima de uma caixa aberta", ph: "Foto: caixa de papelão aberta sobre uma mesa de madeira clara, com uma bola laranja suspensa no ar bem acima dela, sem encostar. Ao fundo, parede clara e uma planta desfocada." },
            { n: "3", tag: "IN / INSIDE", note: "dentro de", c: "orange", v: "cream", lines: ["The ball is in the box."], id: "w18p6c", alt: "Bola laranja dentro de uma caixa de papelão aberta", ph: "Foto: caixa de papelão aberta sobre uma mesa de madeira clara, vista de cima e de frente, com uma bola laranja dentro dela, encostada no canto do fundo. Ao fundo, uma planta e uma estante desfocadas." },
            { n: "4", tag: "UNDER", note: "embaixo de", c: "teal", v: "mint", lines: ["The ball is under the box."], id: "w18p6d", alt: "Caixa de papelão apoiada em cima de uma bola laranja", ph: "Foto: caixa de papelão inclinada sobre uma mesa de madeira clara, apoiada em cima de uma bola laranja que fica embaixo dela, aparecendo pela lateral. Ao fundo, uma planta e uma estante desfocadas." },
            { n: "5", tag: "IN FRONT OF", note: "na frente de", c: "purple", v: "lilac", lines: ["The ball is in front of the box."], id: "w18p6e", alt: "Bola laranja na frente de uma caixa de papelão", ph: "Foto: caixa de papelão aberta sobre uma mesa de madeira clara, com uma bola laranja no chão da mesa bem à frente da caixa, mais próxima da câmera. Ao fundo, sala desfocada com plantas e quadros." },
            { n: "6", tag: "BEHIND", note: "atrás de", c: "orange", v: "cream", lines: ["The ball is behind the box."], id: "w18p6f", alt: "Bola laranja escondida atrás de uma caixa de papelão", ph: "Foto: caixa de papelão sobre uma mesa de madeira clara, com uma bola laranja atrás dela, aparecendo só em parte pela lateral direita. Ao fundo, parede clara com quadros desfocados." },
            { n: "7", tag: "BESIDE", note: "ao lado de", c: "teal", v: "mint", lines: ["The ball is beside the box."], id: "w18p6g", alt: "Bola laranja encostada ao lado de uma caixa de papelão", ph: "Foto: caixa de papelão fechada sobre uma mesa de madeira clara, com uma bola laranja encostada na lateral direita da caixa. Ao fundo, uma planta em vaso e uma estante desfocadas." },
            { n: "8", tag: "NEAR", note: "perto de", c: "purple", v: "lilac", lines: ["The ball is near the box."], id: "w18p6h", alt: "Bola laranja perto de uma caixa de papelão, sem encostar", ph: "Foto: caixa de papelão fechada sobre uma mesa de madeira clara, com uma bola laranja à direita, próxima da caixa mas sem encostar nela. Ao fundo, uma planta em vaso e uma estante desfocadas." } ] },
          { t: "note", v: "gray", kicker: "DICA!", text: "As preposições de lugar nos ajudam a falar com clareza onde as coisas estão em relação a outras." },
          { t: "note", v: "lilac", kicker: "DESAFIO RÁPIDO", text: "Feche o livro e tente lembrar todas as posições.\nDepois, descreva-as sem olhar!\nVocê consegue?" },
          { t: "key", v: "cream", text: "Muito bem! Você dominou as posições básicas.\nNa próxima página, vamos ver como elas aparecem na vida real!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 07" },
          { t: "kicker", text: "EXTRA DA VIDEOAULA" },
          { t: "title", en: "MOVEMENT", pt: "Estas preposições indicam movimento. Observe a direção!" },
          { t: "note", v: "teal", kicker: "IMPORTANTE!", text: "Into, out of e through mostram que algo está se movendo.\nNão é uma posição parada." },
          { t: "steps", items: [
            { n: "1", tag: "INTO", note: "para dentro", c: "purple", v: "lilac", lines: ["The ball goes into the box."], id: "w18p7a", alt: "Bola azul entrando em uma caixa de papelão", ph: "Foto: dois quadros lado a lado, separados por um corte diagonal branco. No primeiro, uma bola azul está sobre a mesa de madeira, à esquerda de uma caixa de papelão aberta, e uma seta roxa curva sai da bola e entra na caixa. No segundo, a mesma caixa aparece com a bola azul já dentro dela. Ao fundo, prateleiras de madeira com plantas e potes, desfocadas." },
            { n: "2", tag: "OUT OF", note: "para fora", c: "orange", v: "cream", lines: ["The ball comes out of the box."], id: "w18p7b", alt: "Bola azul saindo de uma caixa de papelão", ph: "Foto: dois quadros lado a lado, separados por um corte diagonal branco. No primeiro, uma caixa de papelão aberta sobre a mesa de madeira com a bola azul dentro dela. No segundo, a caixa está vazia e uma seta laranja curva sai de dentro dela apontando para a bola azul, agora sobre a mesa à direita. Ao fundo, prateleiras de madeira com plantas e potes, desfocadas." },
            { n: "3", tag: "THROUGH", note: "através de", c: "teal", v: "mint", lines: ["The train goes through the tunnel."], id: "w18p7c", alt: "Trem atravessando um túnel de pedra", ph: "Foto: trem azul e branco saindo em velocidade de um túnel de arco feito de blocos de pedra, coberto de vegetação verde. Os trilhos aparecem em primeiro plano e o movimento do trem deixa um rastro borrado. Uma seta horizontal azul-petróleo atravessa a imagem da esquerda para a direita, saindo de dentro do túnel." } ] },
          { t: "cards", cols: 2, items: [
            { tag: "VOCABULÁRIO", lines: ["box"], note: "caixa", c: "purple", v: "lilac", id: "w18p7d", alt: "Ícone de caixa de papelão aberta", ph: "Ilustração: ícone de linha roxa, sobre fundo branco, de uma caixa de papelão aberta vista em perspectiva, com as quatro abas viradas para fora." },
            { tag: "VOCABULÁRIO", lines: ["ball"], note: "bola", c: "orange", v: "cream", id: "w18p7e", alt: "Ícone de bola", ph: "Ilustração: ícone de linha laranja, sobre fundo branco, de uma bola redonda com as linhas curvas de gomos desenhadas por cima." },
            { tag: "VOCABULÁRIO", lines: ["tunnel"], note: "túnel", c: "teal", v: "mint", id: "w18p7f", alt: "Ícone de túnel em arco", ph: "Ilustração: ícone de linha azul-petróleo, sobre fundo branco, de um túnel em arco visto de frente, com a boca escura no centro e a base apoiada no chão." } ] },
          { t: "note", v: "gray", kicker: "RESUMINDO", text: "Into = movimento para dentro\nOut of = movimento para fora\nThrough = movimento através de algo" },
          { t: "sec", text: "VAMOS PRATICAR?", c: "teal" },
          { t: "lead", text: "Em voz alta, descreva estas ações usando as preposições:" },
          { t: "rows", items: [
            { n: "1", text: "The dog jumps into the box.", c: "purple" },
            { n: "2", text: "The cat comes out of the box.", c: "orange" },
            { n: "3", text: "The car goes through the tunnel.", c: "teal" } ] },
          { t: "image", id: "w18p7g", alt: "Rapaz sorrindo com o balão de fala “Let’s practice!”", ph: "Foto: rapaz jovem de cabelo escuro curto e camiseta verde-oliva, visto de perfil da cintura para cima, sorrindo e olhando para a esquerda. Ao lado da cabeça dele, um balão de fala branco arredondado com o texto “Let’s practice!” em letras escuras e um pequeno ícone de balão de conversa laranja." },
          { t: "key", v: "navy", text: "BOA! VOCÊ JÁ ENTENDEU COMO AS COISAS SE MOVEM.\nNa próxima página, veremos essas preposições em situações reais!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 08" },
          { t: "title", en: "PREPOSITIONS IN A REAL ROOM", pt: "Veja como usamos as preposições para descrever onde as coisas estão no dia a dia!" },
          { t: "note", v: "gray", kicker: "OBSERVE A CENA!", text: "Todas as frases se referem a esta sala. Leia com atenção e veja cada posição." },
          { t: "image", id: "w18p8a", alt: "Sala de estar com etiquetas apontando as preposições de lugar", ph: "Foto: sala de estar com parede de tijolinho claro. À esquerda, uma televisão preta de tela plana presa na parede, acima de um rack de madeira com portas, livros e vasos de cerâmica; ao lado do rack, vasos e uma planta no chão. Na parede há quadros em preto e branco e, mais ao centro, um quadro abstrato. Ao fundo à direita, uma janela alta com cortina bege mostra árvores, e abaixo dela uma mesa lateral redonda de metal com dois vasinhos de planta. À direita, um sofá bege em L com almofadas azul-marinho, laranja-queimado e estampada em preto e branco. Ao centro, uma mesa de centro retangular de madeira com pés pretos, com uma pilha de livros de arquitetura, um vasinho de planta e uma tigela de madeira em cima; embaixo dela, um tapete bege estampado sobre piso de madeira. Etiquetas brancas com linhas coloridas apontam para os objetos: “ON: The TV is on the wall.”, “ABOVE: The photo is above the side table.”, “ON: There are some vases on the side table.”, “OPPOSITE: The sofa is opposite the TV.”, “UNDER: The side table is under the photo.”, “UNDER: The rug is under the coffee table.”, “ON: The books are on the coffee table.” e “BESIDE: The pillows are beside each other.”" },
          { t: "grid", cols: 2, items: [
            { kicker: "ON", title: "The TV is on the wall.", v: "white", c: "teal" },
            { kicker: "ABOVE", title: "The photo is above the side table.", v: "white", c: "purple" },
            { kicker: "UNDER", title: "The side table is under the photo.", v: "white", c: "orange" },
            { kicker: "ON", title: "There are some vases on the side table.", v: "white", c: "teal" },
            { kicker: "OPPOSITE", title: "The sofa is opposite the TV.", v: "white", c: "green" },
            { kicker: "UNDER", title: "The rug is under the coffee table.", v: "white", c: "red" },
            { kicker: "ON", title: "The books are on the coffee table.", v: "white", c: "blue" },
            { kicker: "BESIDE", title: "The pillows are beside each other.", v: "white", c: "purple" } ] },
          { t: "sec", text: "OUTROS EXEMPLOS DA CENA", c: "teal" },
          { t: "grid", cols: 3, items: [
            { title: "The window is near the sofa.", v: "white", c: "teal" },
            { title: "The lamp is on the side table.", v: "white", c: "teal" },
            { title: "The books are between the plant and the vase.", v: "white", c: "green" },
            { title: "The plant is beside the window.", v: "white", c: "teal" },
            { title: "The vase is in front of the photo.", v: "white", c: "purple" },
            { title: "The painting is above the side table.", v: "white", c: "purple" },
            { title: "They are at the table.", v: "white", c: "teal" },
            { title: "The rug is in the middle of the room.", v: "white", c: "red" },
            { title: "The sofa is opposite the TV.", v: "white", c: "green" } ] },
          { t: "note", v: "cream", kicker: "DICA!", text: "Use as preposições para falar com clareza sobre onde as pessoas e os objetos estão." },
          { t: "note", v: "blue", kicker: "LEMBRE-SE", text: "As preposições não mudam a forma do verbo.\nEx.: The books are on the coffee table.\nApenas indicam a relação entre as coisas." } ] },

        { blocks: [
          { t: "badge", label: "AULA 18", page: "PÁGINA 09" },
          { t: "title", en: "REVISÃO COMPLETA: POSIÇÕES E MOVIMENTOS", pt: "Você aprendeu muitas preposições! Agora, veja tudo junto em uma cena completa." },
          { t: "note", v: "gray", kicker: "FOQUE E USE!", text: "Observe, leia e tente descrever a cena em voz alta usando as preposições que aprendeu." },
          { t: "image", id: "w18p9a", alt: "Sala de estar numerada de 1 a 9 com cachorro, mochila, bola e sofá", ph: "Foto: sala de estar aconchegante. À esquerda, um rack de madeira com uma televisão de tela plana em cima mostrando uma paisagem de montanhas e lago; dentro do rack, cestos e caixas. No chão, encostados no rack, uma mochila azul-marinho e uma bola de futebol preta e branca. Ao centro-esquerda, uma estante de madeira com livros, plantas e um porta-retrato, e uma mesa lateral com vasinhos. Ao centro, uma mesa de centro redonda de madeira com pés pretos, com um vaso branco de planta verde, uma pilha de livros e uma caneca azul; embaixo, um tapete bege claro. À direita, um sofá bege de três lugares com almofadas verde-escura, mostarda e estampada em preto e branco; atrás dele, uma janela com cortina clara mostrando árvores, e um abajur de tripé com cúpula bege. Deitado no tapete, à frente do sofá, um cachorro golden retriever com a língua para fora. Marcadores redondos numerados de 1 a 9 estão espalhados pela cena, apontando para o cachorro, a mochila, a bola, os livros, as almofadas, a TV, os livros da estante, a janela e a planta." },
          { t: "sec", text: "DESCREVA USANDO AS PREPOSIÇÕES:", c: "teal" },
          { t: "rows", items: [
            { n: "1", text: "The dog is on the rug.", c: "purple" },
            { n: "2", text: "The backpack is beside the table.", c: "teal" },
            { n: "3", text: "The ball is under the TV stand.", c: "green" },
            { n: "4", text: "The books are on the coffee table.", c: "red" },
            { n: "5", text: "The pillows are on the sofa.", c: "orange" },
            { n: "6", text: "The TV is on the TV stand.", c: "green" },
            { n: "7", text: "The books are above the side table.", c: "blue" },
            { n: "8", text: "The window is behind the sofa.", c: "yellow" },
            { n: "9", text: "The plant is in front of the books.", c: "red" } ] },
          { t: "sec", text: "VAMOS FALAR?", c: "teal" },
          { t: "lead", text: "Responda em voz alta:" },
          { t: "rows", items: [
            { n: "1", text: "Where is the dog?", c: "teal" },
            { n: "2", text: "Where are the books?", c: "purple" },
            { n: "3", text: "Where is the backpack?", c: "teal" },
            { n: "4", text: "Where is the plant?", c: "purple" },
            { n: "5", text: "Where is the window?", c: "teal" } ] },
          { t: "image", id: "w18p9b", alt: "Rapaz sorrindo com o balão de fala “I can describe everything!”", ph: "Foto: rapaz jovem de cabelo escuro curto e camiseta verde-oliva, visto de perfil da cintura para cima, sorrindo e olhando para a esquerda. Ao lado da cabeça dele, um balão de fala branco arredondado com o texto “I can describe everything!” em letras escuras, com a palavra “everything” em destaque." },
          { t: "sec", text: "PARA MEMORIZAR", c: "yellow" },
          { t: "grid", cols: 1, items: [
            { title: "Preposições de lugar mostram onde as coisas estão.", v: "mint", c: "teal" },
            { title: "Preposições de movimento mostram para onde ou através de algo.", v: "lilac", c: "purple" },
            { title: "Pratique todos os dias e você vai lembrar naturalmente!", v: "cream", c: "yellow" } ] },
          { t: "sec", text: "QUER CONTINUAR APRENDENDO?", c: "yellow" },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 18", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: descreva um cômodo da sua casa dizendo onde cada coisa está, com on, above, under, in, in front of, behind, between, beside, near e opposite.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "key", v: "cream", text: "PARABÉNS! Você completou a Aula 18!\nDominar as preposições é um grande passo para falar inglês com confiança." },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 19 · ADJECTIVES", body: "Você vai aprender a descrever pessoas, lugares e coisas com adjetivos." },
          { t: "bar", label: "PROGRESSO", value: "18 DE 42 AULAS", pct: "43%" } ] }
      ]
    },

  {
      id: 19, code: "AULA 19", title: "Adjectives", sub: "Descreva pessoas, objetos e coisas em inglês.",
      time: "15 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 19" },
          { t: "title", en: "ADJECTIVES", pt: "Describe it!" },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Adjectives descrevem pessoas, animais, objetos ou coisas." },
          { t: "image", id: "w19p1a", alt: "Mulher numa loja com etiquetas de adjetivos apontando para os objetos", ph: "Ilustração: dentro de um showroom claro, com janelas grandes do chão ao teto, coluna de concreto e um lounge ao fundo: sofá bege com almofadas azul-petróleo, poltrona azul, mesa de centro de madeira, abajur de pé de cúpula clara e um quadro abstrato grande em azul e dourado na parede. À direita, em pé, uma mulher jovem de pele morena, cabelo escuro preso em coque, brincos de argola dourados, colares finos, blazer bege sobre blusa branca, jeans e cinto preto, segurando um copo de café com tampa e com uma bolsa preta de alça comprida a tiracolo. À esquerda dela, um SUV preto; na frente, uma mesa de madeira com um vaso de planta verde, uma câmera fotográfica antiga prateada e preta, um livro verde, uma suculenta num vaso branco e uma bolsa preta matelassê de corrente dourada com monograma dourado. Seis etiquetas brancas arredondadas, cada uma com um ícone colorido e uma linha de chamada terminando em bolinha branca, apontam para a cena: “big” (ícone teal de setas de expandir) aponta para o SUV preto; “small” (ícone azul de lupa) aponta para a câmera antiga; “new” (ícone roxo de brilho) aponta para o blazer bege da mulher; “old” (ícone laranja de relógio) aponta para o quadro abstrato na parede; “beautiful” (ícone vermelho de coração) aponta para o lounge, com a linha terminando na mesa de centro ao lado do sofá; “expensive” (ícone teal de diamante) aponta para a bolsa preta de corrente dourada." },
          { t: "sec", text: "NESTA AULA, VOCÊ APRENDERÁ A DESCREVER:", c: "purple" },
          { t: "grid", cols: 3, items: [
            { title: "a new car", v: "mint", c: "teal" },
            { title: "a beautiful house", v: "lilac", c: "purple" },
            { title: "an expensive bag", v: "cream", c: "yellow" } ] },
          { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Aprender a usar adjectives para descrever pessoas e coisas." },
          { t: "meta", label: "TEMPO ESTIMADO", value: "12–15 min" },
          { t: "note", v: "gray", bold: true, text: "Uma palavra pode mudar tudo.\nVocê vai aprender a descrever com mais clareza e naturalidade." } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 02" },
          { t: "title", en: "WHERE DOES THE ADJECTIVE GO?", pt: "Before the noun ou after the verb to be." },
          { t: "note", v: "gray", bar: true, text: "Você pode usar o adjective de duas maneiras em inglês.\nVeja os exemplos." },
          { t: "cards", cols: 2, items: [
            { tag: "1 · BEFORE THE NOUN", note: "Adjective + Noun", c: "teal", v: "mint", id: "w19p2a", alt: "Tigela de morangos vermelhos sobre a mesa", ph: "Foto: uma tigela branca de cerâmica cheia de morangos vermelhos com cabinhos verdes, sobre uma mesa de madeira com um pano xadrez azul e branco ao lado, com luz do sol entrando.", lines: ["This is a red strawberry."] },
            { tag: "2 · AFTER THE VERB TO BE", note: "Noun + Verb to be + Adjective", c: "purple", v: "lilac", id: "w19p2b", alt: "Um morango sozinho num pratinho", ph: "Foto: um único morango vermelho com o cabinho verde, no centro de um pratinho de cerâmica clara, sobre mesa de madeira. Ao fundo, desfocados, um vaso de planta e uma caneca bege.", lines: ["This strawberry is red."] },
            { tag: "BEFORE THE NOUN", c: "teal", v: "mint", id: "w19p2c", alt: "Carro sedã azul novo em frente a um prédio de vidro", ph: "Foto: carro sedã azul-escuro novo, visto de frente e de três quartos, parado no estacionamento de um prédio de fachada de vidro, com árvores de folhas amareladas ao fundo e céu azul.", lines: ["It’s a new car."] },
            { tag: "AFTER THE VERB TO BE", c: "purple", v: "lilac", id: "w19p2d", alt: "O mesmo carro sedã azul num enquadramento mais aberto", ph: "Foto: o mesmo carro sedã azul-escuro, na mesma pose de três quartos dianteiro, num enquadramento um pouco mais aberto (a árvore da esquerda aparece inteira e vê-se mais da calçada), parado em frente ao mesmo prédio de fachada de vidro, com céu azul ao fundo.", lines: ["This car is new."] } ] },
          { t: "note", v: "lilac", bar: true, kicker: "TIP!", text: "O meaning é o mesmo.\nA posição do adjective muda, mas a ideia não muda." },
          { t: "key", v: "mint", text: "Adjectives descrevem e deixam tudo mais claro e interessante." } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 03" },
          { t: "title", en: "BIG × SMALL • FAST × SLOW", pt: "Adjectives describe size and speed." },
          { t: "sec", text: "1 · BIG × SMALL", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "BIG", c: "teal", v: "mint", id: "w19p3a", alt: "Golden retriever grande em pé na grama", ph: "Foto: um golden retriever adulto de pelo dourado, em pé de perfil sobre a grama de um parque, com a língua para fora, olhando para a câmera. Ao fundo, árvores verdes iluminadas pelo sol.", lines: ["This dog is big."] },
            { tag: "SMALL", c: "purple", v: "lilac", id: "w19p3b", alt: "Gato pequeno sentado no sofá", ph: "Foto: um gato cinza rajado, pequeno, sentado sobre o assento de um sofá cinza, olhando de frente para a câmera. Atrás dele, duas almofadas verdes e uma estante desfocada.", lines: ["This cat is small."] } ] },
          { t: "sec", text: "2 · FAST × SLOW", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "FAST", c: "teal", v: "mint", id: "w19p3c", alt: "Carro esportivo vermelho em alta velocidade numa estrada", ph: "Foto: carro esportivo vermelho, baixo e aerodinâmico, correndo por uma estrada de montanha; o fundo verde aparece borrado pelo movimento.", lines: ["They’re fast cars."] },
            { tag: "SLOW", c: "purple", v: "lilac", id: "w19p3d", alt: "Carrinho amarelo antigo parado numa rua de paralelepípedos", ph: "Foto: um carrinho amarelo antigo, tipo Fiat 500, com teto de lona preta, parado numa ladeira de paralelepípedos de uma cidade europeia, entre vasos de plantas e prédios coloridos com janelas floridas.", lines: ["They’re slow cars."] } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 04" },
          { t: "title", en: "HOT × COLD • NEW × OLD • EXPENSIVE × CHEAP", pt: "More adjectives for everyday things." },
          { t: "sec", text: "1 · HOT × COLD", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "HOT", c: "teal", v: "mint", id: "w19p4a", alt: "Xícara de café quente fumegando", ph: "Foto: xícara de cerâmica clara cheia de café preto, com fumacinha subindo, sobre uma mesa de madeira escura. Ao lado, grãos de café espalhados e um saco de estopa.", lines: ["hot coffee"] },
            { tag: "COLD", c: "purple", v: "lilac", id: "w19p4b", alt: "Copo de suco de laranja gelado", ph: "Foto: copo alto de suco de laranja com gelo e uma rodela de laranja na borda, sobre uma mesa de madeira ao ar livre, com folhagem verde desfocada ao fundo.", lines: ["cold juice"] } ] },
          { t: "sec", text: "2 · NEW × OLD", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "NEW", c: "teal", v: "mint", id: "w19p4c", alt: "Carro sedã azul novo em frente a um prédio de vidro", ph: "Foto: carro sedã azul-escuro novo e brilhante, visto de frente e de três quartos, parado na calçada em frente a um prédio de fachada de vidro, com árvores ao fundo.", lines: ["This car is new.", "It’s a new car."] },
            { tag: "OLD", c: "purple", v: "lilac", id: "w19p4d", alt: "Carro verde antigo e desgastado estacionado na rua", ph: "Foto: carro verde antigo, com pintura desbotada e ferrugem, para-choques cromados e faróis redondos, estacionado numa rua com prédios velhos e palmeiras ao fundo.", lines: ["This car is old.", "It’s an old car."] } ] },
          { t: "sec", text: "3 · EXPENSIVE × CHEAP", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "EXPENSIVE", c: "teal", v: "mint", id: "w19p4e", alt: "Sandálias de couro caras numa vitrine", ph: "Foto: par de sandálias de couro marrom com fivelas douradas, expostas sobre uma base de madeira numa vitrine iluminada. Atrás, uma placa escrita “LEATHER ATELIER” e, na frente, uma etiqueta bege escrita “PREMIUM COLLECTION $$$”.", lines: ["They’re expensive sandals."] },
            { tag: "CHEAP", c: "purple", v: "lilac", id: "w19p4f", alt: "Chinelos de dedo baratos numa banca de rua", ph: "Foto: par de chinelos de dedo pretos sobre uma mesa de madeira de uma banca de rua, com roupas coloridas desfocadas ao fundo e uma plaquinha de papelão ao lado escrita “GREAT VALUE $”.", lines: ["They’re cheap sandals."] } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 05" },
          { t: "title", en: "DESCRIBING PEOPLE", pt: "Young, old, tall, short, long hair and short hair." },
          { t: "sec", text: "1 · YOUNG × OLD", c: "purple" },
          { t: "image", id: "w19p5a", src: "/lessons/fotos/aula_19_pagina_05_foto_01.jpg", alt: "Mulher jovem e mulher idosa lado a lado", ph: "Ilustração: dois retratos lado a lado. À esquerda, uma mulher jovem de pele morena, cabelo escuro preso em coque, brincos de argola dourados e blazer bege sobre blusa branca, com colares finos, olhando de lado e sorrindo, dentro de um escritório claro com janela e planta. À direita, uma senhora de cabelo branco ondulado na altura do queixo, cardigã bege claro e colar fino, sorrindo de frente para a câmera na sala de casa, com porta-retratos, abajur e planta ao fundo." },
          { t: "cards", cols: 2, items: [
            { tag: "YOUNG", c: "teal", v: "mint", lines: ["She is young.", "She is a young woman."] },
            { tag: "OLD", c: "purple", v: "lilac", lines: ["She is old.", "She is an old woman."] } ] },
          { t: "sec", text: "2 · TALL × SHORT", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "TALL", c: "teal", v: "mint", id: "w19p5b", src: "/lessons/fotos/aula_19_pagina_05_foto_02.jpg", alt: "Homem alto em pé num escritório", ph: "Foto: homem alto, de barba curta e cabelo escuro, em pé de frente para a câmera com as mãos nos bolsos, usando camisa azul-marinho de manga comprida, cinto preto e calça bege. Ao fundo, um escritório claro com divisórias de vidro, mesas de madeira e vasos de plantas.", lines: ["He is tall."] },
            { tag: "SHORT", c: "purple", v: "lilac", id: "w19p5c", src: "/lessons/fotos/aula_19_pagina_05_foto_03.jpg", alt: "Homem baixo em pé na sala de casa", ph: "Foto: homem asiático de óculos, cabelo curto escuro, sorrindo de frente para a câmera com os braços soltos, usando jaqueta camisa verde-oliva sobre camiseta branca. Ao fundo, uma sala com estante de livros, quadro na parede, abajur aceso, poltrona amarela e uma planta.", lines: ["He is short."] } ] },
          { t: "sec", text: "3 · LONG × SHORT HAIR", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "LONG HAIR", c: "teal", v: "mint", id: "w19p5d", src: "/lessons/fotos/aula_19_pagina_05_foto_04.jpg", alt: "Mulher de cabelo longo e ondulado", ph: "Foto: mulher jovem de cabelo castanho comprido e ondulado caindo sobre os ombros, camisa branca aberta, olhando de frente para a câmera com um sorriso leve. Ao fundo, a sala de casa com quadro na parede, sofá bege e uma planta.", lines: ["Her hair is long.", "She has long hair."] },
            { tag: "SHORT HAIR", c: "purple", v: "lilac", id: "w19p5e", src: "/lessons/fotos/aula_19_pagina_05_foto_05.jpg", alt: "Mulher de cabelo curto estilo pixie", ph: "Foto: mulher de cabelo castanho bem curto, estilo pixie, brinco de argola dourado e blusa preta de gola alta, vista de perfil olhando para o lado. Ao fundo, parede clara com espelho redondo, um aparador de madeira e uma planta.", lines: ["Her hair is short."] } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 06" },
          { t: "title", en: "MORE ADJECTIVES", pt: "Beautiful, pretty, handsome, ugly, rich and poor." },
          { t: "sec", text: "1 · BEAUTIFUL × PRETTY", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "BEAUTIFUL", c: "teal", v: "mint", id: "w19p6a", alt: "Casa moderna iluminada com piscina", ph: "Foto: casa moderna de dois andares ao anoitecer, com grandes janelas de vidro iluminadas por dentro, paredes de concreto claro, jardim com plantas tropicais e uma piscina refletindo as luzes.", lines: ["It’s a beautiful house."] },
            { tag: "PRETTY", c: "purple", v: "lilac", id: "w19p6b", alt: "Mulher jovem sorrindo dentro de casa", ph: "Ilustração: mulher jovem de pele morena, cabelo escuro preso em coque, brincos de argola dourados, colares finos e blazer bege sobre blusa branca, olhando de lado com um sorriso discreto. Ao fundo, parede clara com quadro, uma planta verde e uma janela.", lines: ["She is pretty."] } ] },
          { t: "sec", text: "2 · HANDSOME × UGLY", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "HANDSOME", c: "teal", v: "mint", id: "w19p6c", alt: "Homem de terno sorrindo num ambiente elegante", ph: "Foto: homem de cabelo escuro e barba curta, sorrindo de frente para a câmera, usando terno azul-marinho sobre camisa escura, sentado num ambiente elegante com abajures acesos, poltronas e plantas ao fundo.", lines: ["He is handsome."] },
            { tag: "UGLY", c: "purple", v: "lilac", id: "w19p6d", alt: "Poltrona velha e rasgada num canto da sala", ph: "Foto: poltrona antiga de tecido verde-acinzentado, com o estofado rasgado e manchado, num canto de parede descascada, sobre um tapete gasto, ao lado de um abajur de pé com cúpula bege.", lines: ["This chair is ugly."] } ] },
          { t: "sec", text: "3 · RICH × POOR", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "RICH", c: "teal", v: "mint", id: "w19p6e", alt: "Homem de terno sentado num escritório com vista para a cidade", ph: "Foto: homem grisalho de óculos, terno escuro e camisa branca, sentado numa poltrona de couro marrom num escritório alto, com janelas panorâmicas mostrando os prédios da cidade, uma mesa de madeira com livros e um vaso dourado.", lines: ["He is rich.", "He is a rich man."] },
            { tag: "POOR", c: "purple", v: "lilac", id: "w19p6f", alt: "Homem simples sentado à mesa segurando uma caneca", ph: "Foto: homem de boné e jaqueta cinza gasta, sentado a uma mesa simples de madeira segurando uma caneca branca, com uma parede de concreto sem acabamento ao fundo e alguns potes e garrafas sobre a mesa.", lines: ["This man is poor.", "He is a poor man."] } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 07" },
          { t: "title", en: "ADJECTIVES DON’T CHANGE!", pt: "Adjectives do not have a plural form." },
          { t: "sec", text: "1 · NEW", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "SINGULAR", c: "teal", v: "mint", id: "w19p7a", alt: "Um carro cinza novo na concessionária", ph: "Foto: um carro sedã cinza novo, visto de frente e de três quartos, exposto no salão de uma concessionária com piso brilhante, janelas grandes e vasos de plantas ao fundo.", lines: ["a new car"] },
            { tag: "PLURAL", c: "purple", v: "lilac", id: "w19p7b", alt: "Vários carros novos enfileirados na concessionária", ph: "Foto: três carros novos enfileirados lado a lado no salão de uma concessionária (um preto, um cinza e um prata), com piso espelhado e janelas grandes mostrando palmeiras lá fora. Entre esta foto e a anterior, um círculo branco com a palavra “VS”.", lines: ["new cars"] } ] },
          { t: "note", v: "cream", center: true, bold: true, text: "NEW stays NEW." },
          { t: "sec", text: "2 · EXPENSIVE", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "SINGULAR", c: "teal", v: "mint", id: "w19p7c", alt: "Uma sandália de salto dourada", ph: "Foto: uma única sandália de salto alto dourada, com tiras de brilhantes, em pé sobre uma superfície clara, com um vaso de planta e um abajur dourado desfocados ao fundo.", lines: ["an expensive sandal"] },
            { tag: "PLURAL", c: "purple", v: "lilac", id: "w19p7d", alt: "Várias sandálias de salto enfileiradas", ph: "Foto: cinco sandálias de salto enfileiradas lado a lado (douradas, prateadas e pretas, com tiras de brilhantes) sobre uma superfície clara, com plantas e um móvel bege ao fundo. Entre esta foto e a anterior, um círculo branco com a palavra “VS”.", lines: ["expensive sandals"] } ] },
          { t: "note", v: "cream", center: true, bold: true, text: "EXPENSIVE stays EXPENSIVE." },
          { t: "sec", text: "3 · BIG", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "SINGULAR", c: "teal", v: "mint", id: "w19p7e", alt: "Um golden retriever sentado na sala", ph: "Foto: um golden retriever sentado sobre um tapete claro na sala de casa, com a língua para fora, olhando para a câmera. Ao fundo, poltrona cinza, parede branca e um vaso de planta.", lines: ["a big dog"] },
            { tag: "PLURAL", c: "purple", v: "lilac", id: "w19p7f", alt: "Três cachorros grandes sentados lado a lado", ph: "Foto: três cachorros grandes sentados lado a lado no tapete da sala (um golden retriever, um labrador preto e um labrador amarelo), todos olhando para a câmera, com poltrona e plantas ao fundo. Entre esta foto e a anterior, um círculo branco com a palavra “VS”.", lines: ["big dogs"] } ] },
          { t: "note", v: "cream", center: true, bold: true, text: "BIG stays BIG." },
          { t: "note", v: "navy", bar: true, bold: true, text: "SINGULAR: adjective + noun\nPLURAL: adjective + noun\nOnly the noun changes." } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 08" },
          { t: "title", en: "ONE", pt: "Don’t repeat the noun in the singular." },
          { t: "steps", items: [
            { n: "1", tag: "SAME NOUN, SHORTER SENTENCE", c: "purple", v: "mint", id: "w19p8a", alt: "Cinco smartphones coloridos expostos numa loja", ph: "Foto: cinco smartphones em pé, lado a lado, sobre a mesa de madeira clara de uma loja de eletrônicos, vistos de costas: preto, branco, amarelo, rosa e verde. Ao fundo, prateleiras, telas e uma planta desfocadas.", lines: ["I like the yellow smartphone. → I like the yellow one."] },
            { n: "2", tag: "ANOTHER EXAMPLE", c: "purple", v: "lilac", id: "w19p8b", alt: "Arara de camisetas numa loja de roupas", ph: "Foto: arara preta com camisetas penduradas em cabides de madeira, em degradê do branco ao preto, passando por bege, verde-militar e azul-escuro. Ao fundo, prateleiras de roupas dobradas e uma planta.", lines: ["These are t-shirts. → I like the black one."] } ] },
          { t: "sec", text: "3 · HOW TO USE ONE", c: "purple" },
          { t: "note", v: "mint", bar: true, bold: true, text: "Use ONE to replace a singular noun you said before." },
          { t: "grid", cols: 3, items: [
            { title: "ONE = singular", v: "gray", c: "purple" },
            { title: "the yellow one", v: "cream", c: "yellow" },
            { title: "the black one", v: "lilac", c: "purple" } ] },
          { t: "note", v: "mint", center: true, text: "The noun is already clear." } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 09" },
          { t: "title", en: "ONES", pt: "Use ONES to avoid repeating plural nouns." },
          { t: "steps", items: [
            { n: "1", tag: "SAME NOUN, SHORTER SENTENCE", c: "purple", v: "mint", id: "w19p9a", src: "/lessons/fotos/aula_19_pagina_09_foto_01.jpg", alt: "Quatro cachorros na sala de casa", ph: "Foto: quatro cachorros na sala de casa, sobre um tapete claro: um golden retriever deitado à esquerda, um border collie preto e branco deitado no centro, um labrador amarelo sentado atrás e um poodle caramelo pequeno deitado à direita. Ao fundo, sofá cinza, quadro abstrato, estante e vasos de plantas.", lines: ["These are dogs.", "↓", "I like the big ones."] },
            { n: "2", tag: "ANOTHER EXAMPLE", c: "purple", v: "lilac", id: "w19p9b", src: "/lessons/fotos/aula_19_pagina_09_foto_02.jpg", alt: "Notebooks enfileirados numa loja de eletrônicos", ph: "Foto: fileira de notebooks abertos sobre uma bancada de madeira clara numa loja de eletrônicos, todos com papéis de parede coloridos na tela. Ao fundo, prateleiras iluminadas, telas e o letreiro da loja, desfocados.", lines: ["These are computers.", "↓", "I like the new ones."] } ] },
          { t: "note", v: "lilac", bar: true, bold: true, kicker: "HOW TO USE ONES", text: "Use ONES to replace a plural noun you said before." },
          { t: "grid", cols: 3, items: [
            { title: "ONES = plural", v: "gray", c: "teal" },
            { title: "the big ones", v: "mint", c: "teal" },
            { title: "the new ones", v: "mint", c: "teal" } ] },
          { t: "note", v: "gray", center: true, text: "The noun is already clear." } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 10" },
          { t: "title", en: "YOUR TURN", pt: "Describe and choose." },
          { t: "lead", text: "Agora é sua vez de usar adjectives, one e ones." },
          { t: "fill", id: "w19e1", title: "1 · COMPLETE WITH THE ADJECTIVE", items: [
            { pre: "1. Sonia and Tim are", answers: ["good"], post: "friends.", note: "(good)", v: "mint" },
            { pre: "2. Mark is a", answers: ["great"], post: "teacher.", note: "(great)", v: "lilac" },
            { pre: "3. This house is", answers: ["beautiful"], post: ".", note: "(beautiful)", v: "cream" },
            { pre: "4. This is a", answers: ["beautiful"], post: "house.", note: "(beautiful)", v: "mint" },
            { pre: "5. Are they", answers: ["happy"], post: "children?", note: "(happy)", v: "lilac" } ] },
          { t: "sec", text: "2 · DESCRIBE & CHOOSE", c: "purple" },
          { t: "cards", cols: 2, items: [
            { tag: "SMARTPHONES", c: "purple", v: "lilac", id: "w19p10a", alt: "Três smartphones coloridos expostos numa loja", ph: "Foto: três smartphones em pé sobre suportes brancos, na mesa de madeira clara de uma loja de eletrônicos, vistos de costas: amarelo, preto e azul-claro. Ao fundo, telas e prateleiras desfocadas.", lines: ["These are smartphones.", "↓", "I like the yellow one."] },
            { tag: "COMPUTERS", c: "teal", v: "mint", id: "w19p10b", alt: "Notebooks enfileirados numa loja de informática", ph: "Foto: quatro notebooks abertos enfileirados sobre uma bancada de madeira clara numa loja de informática, com papéis de parede coloridos nas telas. Ao fundo, prateleiras iluminadas e uma placa escrita “LAPTOPS”.", lines: ["These are computers.", "↓", "I like the new ones."] } ] },
          { t: "note", v: "gray", bar: true, kicker: "Adjective + noun", text: "one = singular  /  ones = plural" } ] },

        { blocks: [
          { t: "badge", label: "AULA 19", page: "PÁGINA 11" },
          { t: "kicker", text: "AULA CONCLUÍDA" },
          { t: "title", en: "ADJECTIVES", pt: "Você já sabe usar adjectives, one e ones." },
          { t: "lead", text: "Use este checklist antes de avançar." },
          { t: "check", id: "w19c1", title: "EU CONSIGO...", items: [
            "entender a função de um adjective.",
            "usar adjective antes de um noun.",
            "usar adjective depois do verb to be.",
            "reconhecer contrastes como big/small, fast/slow e new/old.",
            "usar expensive/cheap.",
            "descrever pessoas com vocabulário básico.",
            "lembrar que adjectives não recebem plural.",
            "usar one para substituir um substantivo singular já conhecido.",
            "usar ones para substituir substantivos plurais já conhecidos.",
            "compreender the yellow one / the big ones." ] },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 19", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: descreva pessoas, objetos e produtos com adjectives. Depois escolha entre opções semelhantes usando frases como the yellow one e the new ones.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 20 · NUMBERS", body: "Você aprenderá a usar números em inglês." },
          { t: "bar", label: "PROGRESSO", value: "19 DE 42 AULAS", pct: "45%" } ] }
      ]
    },

  {
      id: 20, code: "AULA 20", title: "Numbers", sub: "Reconheça, diga e use números em situações reais.",
      time: "16 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 20" },
          { t: "title", en: "NUMBERS", pt: "Numbers are everywhere." },
          { t: "note", v: "gray", bar: true, bold: true, kicker: "ANTES DE COMEÇAR", text: "Os números aparecem o tempo todo no inglês do dia a dia." },
          { t: "image", id: "w20p1a", alt: "Homem no café mexendo no celular, cercado de cartões com números", ph: "Foto: homem jovem de cabelo escuro cacheado e barba curta, com jaqueta verde-escura por cima de uma camiseta branca, sentado a uma mesa de madeira de uma cafeteria, segurando um celular branco com as duas mãos e sorrindo para a tela. Em volta dele flutuam cartões brancos: no alto à esquerda, um cartão de contato com ícone redondo azul-petróleo de pessoa e o texto “Daniel Alves · (11) 98765-4321”; no alto à direita, um quadrado roxo com “AGE 18”; à esquerda, uma etiqueta de preço com “COFFEE BEANS · 500g · $ 18.45”; à direita, um cupom com “TOTAL · 2,357 points · Thank you!”. Sobre a mesa há um pacote preto de café “COFFEE ROASTERS”, uma caneca azul-escura, um lápis e um caderno verde; à direita, um vaso de planta e, ao fundo, prateleiras com plantas e a vitrine da loja." },
          { t: "sec", text: "VOCÊ VERÁ NÚMEROS EM MUITAS SITUAÇÕES:", c: "purple" },
          { t: "grid", cols: 3, items: [
            { title: "Contatos", body: "(11) 98765-4321", foot: "Phone numbers", v: "mint", c: "teal" },
            { title: "Idade", body: "18", foot: "Age", v: "lilac", c: "purple" },
            { title: "Preços e valores", body: "$ 18.45", foot: "Prices & amounts", v: "cream", c: "yellow" } ] },
          { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Reconhecer, dizer e usar números em situações reais." } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 02" },
          { t: "title", en: "NUMBERS", pt: "Numbers are everywhere." },
          { t: "lead", text: "Números fazem parte do nosso dia a dia em muitas situações: no celular, na idade, nos preços, nos endereços e muito mais." },
          { t: "image", id: "w20p2a", alt: "Homem sorrindo no café com celular e café, cercado de cartões de telefone, idade, preço e endereço", ph: "Foto: homem jovem de cabelo castanho e barba curta, com jaqueta jeans azul-marinho por cima de uma camiseta branca, sentado a uma mesa de café. Ele sorri olhando para o lado, segura um celular preto na mão direita e um copo de papel de café na mão esquerda. Sobre a mesa há um notebook fechado, dois livros empilhados e um prato com um croissant. Flutuando sobre a foto: um cartão branco com ícone de telefone azul-petróleo e o texto “PHONE NUMBER · 90765-0023”; um cartão roxo “AGE” com “I’m 24 years old.”; um cartão amarelo “PRICE” com “$45.90”; e um cartão branco com alfinete de mapa azul-petróleo e o texto “ADDRESS · Av. Brasil, 250 · Campina Grande - PB”. Ao fundo, a cafeteria com luminárias penduradas e um quadro-negro de menu." },
          { t: "sec", text: "NESTA AULA, VOCÊ VAI APRENDER A:", c: "purple" },
          { t: "rows", items: [
            { text: "reconhecer e dizer os números de 0 até milhares;", c: "teal" },
            { text: "usar números para falar de telefone, idade e preços;", c: "teal" },
            { text: "compreender a diferença entre as formas americana e britânica.", c: "teal" } ] },
          { t: "sec", text: "PREVIEW: NUMBERS YOU WILL SEE TODAY" },
          { t: "grid", cols: 2, items: [
            { title: "18", body: "eighteen", v: "mint", c: "teal" },
            { title: "45", body: "forty-five", v: "lilac", c: "purple" },
            { title: "100", body: "a hundred", v: "mint", c: "teal" },
            { title: "2,357", body: "two thousand three hundred fifty-seven", v: "lilac", c: "purple" } ] },
          { t: "note", v: "lilac", kicker: "DICA!", text: "Em inglês, os números seguem padrões simples e lógicos. Com prática, você vai ler e dizer qualquer número com confiança!" },
          { t: "sec", text: "EXEMPLOS DO DIA A DIA", c: "teal" },
          { t: "rows", items: [
            { text: "Phone number: It’s 90765-0023.", c: "teal" },
            { text: "Age: I’m twenty-four.", c: "purple" },
            { text: "Price: It’s forty-five dollars.", c: "yellow" },
            { text: "Address: 250 Brasil Avenue.", c: "teal" } ] },
          { t: "note", v: "cream", bar: true, bold: true, kicker: "PREPARE-SE!", text: "Vamos começar pelos números mais básicos: de 0 a 9." } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 03" },
          { t: "title", en: "NUMBERS", pt: "10–19: The teens" },
          { t: "lead", text: "Os números de 10 a 19 têm formas especiais. Vamos aprender e praticar!" },
          { t: "rows", items: [
            { n: "10", text: "ten", c: "purple" },
            { n: "11", text: "eleven", c: "purple" },
            { n: "12", text: "twelve", c: "purple" },
            { n: "13", text: "thirteen", c: "purple" },
            { n: "14", text: "fourteen", c: "purple" },
            { n: "15", text: "fifteen", c: "purple" },
            { n: "16", text: "sixteen", c: "purple" },
            { n: "17", text: "seventeen", c: "purple" },
            { n: "18", text: "eighteen", c: "purple" },
            { n: "19", text: "nineteen", c: "purple" } ] },
          { t: "image", id: "w20p3a", alt: "Jovem estudando na biblioteca entre estantes numeradas", ph: "Foto: jovem de cabelo castanho comprido e solto, com jaqueta verde-oliva por cima de uma blusa branca, sentada a uma mesa de madeira de uma biblioteca. Ela escreve em um caderno com uma caneta e tem um notebook aberto à direita e um copo de papel de café à esquerda. Atrás dela, estantes de livros com placas verticais numeradas 10, 17 e 19; ao fundo, outro estudante sentado." },
          { t: "sec", text: "EXAMPLES", c: "purple" },
          { t: "rows", items: [
            { text: "Room ten.", c: "purple" },
            { text: "Chapter thirteen.", c: "purple" },
            { text: "Lesson nineteen.", c: "purple" } ] },
          { t: "note", v: "lilac", bar: true, kicker: "DICA IMPORTANTE", text: "Os números de 10 a 12 não seguem um padrão com “teen”.\nA partir de 13, muitos números terminam com “teen”." },
          { t: "grid", cols: 3, items: [
            { title: "10", body: "ten", v: "lilac", c: "purple" },
            { title: "11", body: "eleven", v: "lilac", c: "purple" },
            { title: "12", body: "twelve", v: "lilac", c: "purple" },
            { title: "13–19", body: "thirteen – nineteen", foot: "terminam com “teen”", v: "mint", c: "teal" } ] },
          { t: "sec", text: "PRACTICE TIME! · READ ALOUD", c: "teal" },
          { t: "lead", text: "Leia os números em voz alta." },
          { t: "chips", items: [
            { t: "10", c: "teal" },
            { t: "11", c: "teal" },
            { t: "12", c: "teal" },
            { t: "13", c: "teal" },
            { t: "14", c: "teal" },
            { t: "15", c: "teal" },
            { t: "16", c: "teal" },
            { t: "17", c: "teal" },
            { t: "18", c: "teal" },
            { t: "19", c: "teal" } ] },
          { t: "note", v: "cream", bar: true, kicker: "GOOD TO KNOW", text: "Você já conhece alguns desses números em português.\nPerceba como o inglês tem sons diferentes e formas únicas!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 04" },
          { t: "title", en: "NUMBERS", pt: "20–99: Build the number" },
          { t: "lead", text: "Em inglês, números entre 20 e 99 são formados com dezenas + unidades. Lembra? Usamos hífen (-) para conectar!" },
          { t: "image", id: "w20p4a", alt: "Homem escolhendo roupa na loja diante de uma placa de preço", ph: "Foto: homem jovem de cabelo escuro cacheado e barba curta, com jaqueta verde-escura por cima de uma camiseta branca, em pé dentro de uma loja de roupas. Ele segura na mão direita um cabide com um suéter bege e na esquerda o celular, sorrindo. Atrás dele, uma arara com camisas e calças jeans e uma pilha de roupas dobradas; à direita, uma placa preta de quadro-negro com o texto “NEW COLLECTION · FROM $21.99”." },
          { t: "sec", text: "AS DEZENAS", c: "teal" },
          { t: "rows", items: [
            { n: "20", text: "twenty", c: "teal" },
            { n: "30", text: "thirty", c: "teal" },
            { n: "40", text: "forty", c: "teal" },
            { n: "50", text: "fifty", c: "teal" },
            { n: "60", text: "sixty", c: "teal" },
            { n: "70", text: "seventy", c: "teal" },
            { n: "80", text: "eighty", c: "teal" },
            { n: "90", text: "ninety", c: "teal" } ] },
          { t: "sec", text: "COMO FUNCIONA", c: "purple" },
          { t: "rule", v: "lilac", c: "purple", kicker: "DEZENA + UNIDADE", from: "20 + 7", to: "twenty-seven", ex: "20 = twenty (dezena) · 7 = seven (unidade)", tr: "Sempre com hífen!" },
          { t: "sec", text: "VEJA MAIS EXEMPLOS:", c: "purple" },
          { t: "rows", items: [
            { text: "20 + 1 = 21 · twenty-one", c: "purple" },
            { text: "30 + 5 = 35 · thirty-five", c: "purple" },
            { text: "40 + 8 = 48 · forty-eight", c: "purple" },
            { text: "70 + 2 = 72 · seventy-two", c: "purple" },
            { text: "90 + 9 = 99 · ninety-nine", c: "purple" } ] },
          { t: "note", v: "cream", bar: true, kicker: "REGRINHA DE OURO", text: "Usamos o hífen (-) em todos os números compostos de 21 a 99, EXCETO nas dezenas exatas:\n20, 30, 40, 50, 60, 70, 80 e 90." },
          { t: "sec", text: "NUMBERS IN REAL LIFE", c: "teal" },
          { t: "cards", cols: 2, items: [
            { tag: "Bus 25", lines: ["twenty-five"], c: "teal", v: "mint", id: "w20p4b", alt: "Ônibus urbano azul com o número 25", ph: "Foto: ônibus urbano azul com a frente inferior amarela, visto de frente, parado numa rua, com o número 25 em laranja no letreiro eletrônico acima do para-brisa. Ao fundo, carros, árvores e prédios desfocados." },
            { tag: "Room 305", lines: ["three hundred five"], c: "purple", v: "lilac", id: "w20p4c", alt: "Placa de porta de hotel com o número 305", ph: "Foto: placa quadrada preta com moldura dourada, presa num nicho de parede bege clara, com “ROOM” em letras douradas pequenas na parte de cima e “305” em letras douradas grandes embaixo." },
            { tag: "Table 48", lines: ["forty-eight"], c: "yellow", v: "cream", id: "w20p4d", alt: "Numerador de mesa com o número 48", ph: "Foto: cartão branco dobrado em cavalete, em pé sobre uma mesa de madeira clara, impresso com o número 48 em preto. Ao fundo, o interior desfocado de uma cafeteria." },
            { tag: "Price $79.90", lines: ["seventy-nine dollars and ninety cents"], c: "teal", v: "mint", id: "w20p4e", alt: "Etiqueta de preço de 79,90 dólares com código de barras", ph: "Foto: etiqueta de papel branca presa por um cordão preto a uma peça de malha bege, impressa com “$79.90” em letras grandes e um código de barras abaixo, sobre uma tábua de madeira clara." } ] },
          { t: "sec", text: "PRACTICE!", c: "teal" },
          { t: "lead", text: "Leia os números em voz alta. Depois, pratique com a IA!" },
          { t: "grid", cols: 2, items: [
            { title: "21", body: "twenty-one", v: "mint", c: "teal" },
            { title: "34", body: "thirty-four", v: "lilac", c: "purple" },
            { title: "56", body: "fifty-six", v: "mint", c: "teal" },
            { title: "63", body: "sixty-three", v: "lilac", c: "purple" },
            { title: "74", body: "seventy-four", v: "mint", c: "teal" },
            { title: "88", body: "eighty-eight", v: "lilac", c: "purple" },
            { title: "95", body: "ninety-five", v: "mint", c: "teal" },
            { title: "99", body: "ninety-nine", v: "lilac", c: "purple" } ] },
          { t: "rule", v: "lilac", c: "purple", kicker: "DICA RÁPIDA!", from: "twenty + six", to: "twenty-six", ex: "20 + 6 = 26", tr: "Para formar números entre 20 e 99, pense sempre: dezena + unidade = número." } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 05" },
          { t: "title", en: "NUMBERS", pt: "How old are you? + 100" },
          { t: "lead", text: "Agora vamos usar números para falar da idade e conhecer 100." },
          { t: "image", id: "w20p5a", alt: "Dois amigos conversando no café sobre idade", ph: "Foto: mulher de cabelo castanho comprido e suéter bege, à esquerda, segurando uma xícara branca, e homem de cabelo escuro e jaqueta verde, à direita, segurando uma caneca preta, sentados frente a frente à mesa de madeira de uma cafeteria. Três balões de fala brancos sobre a cena: “How old are you?” acima da mulher, “I’m twenty-four.” saindo do homem e “I’m twenty-four years old.” logo abaixo. Sobre a mesa, um caderno com caneta e um vasinho de planta; ao fundo, o balcão da cafeteria com prateleiras e quadro-negro." },
          { t: "dialogue", items: [
            { s: "a", text: "How old are you?" },
            { s: "b", text: "I’m twenty-four." },
            { s: "b", text: "I’m twenty-four years old." } ] },
          { t: "sec", text: "FALAR DA IDADE", c: "purple" },
          { t: "lead", text: "Podemos responder de duas formas:" },
          { t: "rows", items: [
            { text: "I’m twenty-four.", c: "purple" },
            { text: "I’m twenty-four years old.", c: "purple" } ] },
          { t: "sec", text: "OUTROS EXEMPLOS:", c: "teal" },
          { t: "table", head: ["ENGLISH", "PORTUGUÊS"], rows: [
            { a: "I’m fifteen.", b: "(Eu tenho quinze.)", v: "mint" },
            { a: "I’m thirty.", b: "(Eu tenho trinta.)", v: "lilac" },
            { a: "I’m forty-two.", b: "(Eu tenho quarenta e dois.)", v: "cream" },
            { a: "I’m sixty.", b: "(Eu tenho sessenta.)", v: "mint" } ] },
          { t: "sec", text: "100 – A HUNDRED", c: "teal" },
          { t: "note", v: "mint", bar: true, bold: true, text: "100 = a hundred\n100 = one hundred" },
          { t: "lead", text: "Exemplos:" },
          { t: "rows", items: [
            { n: "100", text: "one hundred", c: "teal" },
            { n: "135", text: "one hundred thirty-five", c: "teal" },
            { n: "178", text: "one hundred seventy-eight", c: "teal" },
            { n: "199", text: "one hundred ninety-nine", c: "teal" } ] },
          { t: "sec", text: "DE 1 A 100 – DANDO UM SALTO!", c: "yellow" },
          { t: "rows", items: [
            { n: "1", text: "one", c: "yellow" },
            { n: "10", text: "ten", c: "yellow" },
            { n: "20", text: "twenty", c: "yellow" },
            { n: "50", text: "fifty", c: "yellow" },
            { n: "100", text: "one hundred", c: "yellow" } ] },
          { t: "note", v: "cream", text: "Em inglês, contamos de 1 em 1 ou de 10 em 10.\nAssim, fica muito mais fácil!" },
          { t: "note", v: "lilac", bar: true, kicker: "DICA IMPORTANTE", text: "Em inglês, 100 pode ser:\na hundred\none hundred\nAs duas formas estão corretas!" },
          { t: "note", v: "lilac", text: "Em frases, usamos os números assim:\nI’m ten.\nI’m ten years old." },
          { t: "sec", text: "PRACTICE TIME!", c: "teal" },
          { t: "lead", text: "Fale a sua idade (fictícia)! Escreva e depois pratique em voz alta." },
          { t: "steps", items: [
            { n: "1", tag: "Choose an age.", lines: ["12 · 21 · 33 · 47 · 60"], c: "teal", v: "mint", id: "w20p5b", alt: "Cinco velas de aniversário com os números 12, 21, 33, 47 e 60", ph: "Ilustração: cinco velinhas de aniversário lado a lado, cada uma com listras de uma cor diferente (amarela, roxa, azul-petróleo escuro, laranja e azul-petróleo) e a chama amarela acesa no topo. Embaixo de cada vela, um número grande na mesma cor da vela: 12, 21, 33, 47 e 60." },
            { n: "2", tag: "Write.", lines: ["I’m __________.", "I’m __________ years old."], c: "purple", v: "lilac" },
            { n: "3", tag: "Say it!", c: "yellow", v: "cream" } ] },
          { t: "free", id: "w20f1", cols: 2, items: [
            { n: "1", kicker: "WRITE", prefix: "I’m…", ideas: "Escreva a sua idade fictícia em inglês.", v: "mint", c: "teal" },
            { n: "2", kicker: "WRITE", prefix: "I’m… years old.", ideas: "Escreva a mesma idade na forma completa.", v: "lilac", c: "purple" } ] },
          { t: "note", v: "cream", bar: true, bold: true, kicker: "VOCÊ ESTÁ INDO BEM!", text: "Números ajudam você a falar sobre você, sobre preços, telefones e muito mais!" },
          { t: "chips", items: [
            { t: "Idade", c: "purple" },
            { t: "Telefone", c: "teal" },
            { t: "Preços", c: "orange" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 06" },
          { t: "title", en: "NUMBERS", pt: "OVER 100 · 101–199 and more" },
          { t: "lead", text: "Vamos formar números acima de 100 e entender a diferença entre American English e British English." },
          { t: "image", id: "w20p6a", alt: "Recepção de hotel com a placa do quarto 142", ph: "Foto: balcão de check-in de um hotel. À esquerda, um homem de cabelo escuro e jaqueta verde entrega um cartão; à direita, atrás do balcão, uma recepcionista de cabelo castanho preso e blazer escuro sorri ao recebê-lo, com um computador ao lado. Na parede de ripas de madeira ao fundo, uma placa preta com “CHECK-IN” e, ao lado, um painel grande com “ROOM 142 · Floor 1”. À direita, um vaso de planta." },
          { t: "note", v: "navy", bold: true, text: "Os números acima de 100 seguem uma lógica: hundred + o restante do número." },
          { t: "sec", text: "CONSTRUINDO NÚMEROS ACIMA DE 100", c: "purple" },
          { t: "rows", items: [
            { n: "101", text: "a hundred one", c: "purple" },
            { n: "102", text: "a hundred two", c: "purple" },
            { n: "110", text: "a hundred ten", c: "purple" },
            { n: "120", text: "a hundred twenty", c: "purple" },
            { n: "141", text: "a hundred forty-one", c: "purple" },
            { n: "152", text: "a hundred fifty-two", c: "purple" },
            { n: "174", text: "a hundred seventy-four", c: "purple" },
            { n: "199", text: "a hundred ninety-nine", c: "purple" } ] },
          { t: "sec", text: "AMERICAN ENGLISH × BRITISH ENGLISH", c: "teal" },
          { t: "table", head: ["AMERICAN ENGLISH", "BRITISH ENGLISH"], rows: [
            { a: "101 = a hundred one", b: "101 = a hundred and one", v: "lilac" },
            { a: "142 = a hundred forty-one", b: "142 = a hundred and forty-one", v: "mint" } ] },
          { t: "note", v: "mint", bar: true, text: "As duas formas estão corretas.\nNesta aula, vamos usar principalmente o padrão americano (sem and)." },
          { t: "sec", text: "DICAS IMPORTANTES", c: "teal" },
          { t: "note", v: "lilac", bold: true, center: true, text: "100 = a hundred ou one hundred" },
          { t: "rows", items: [
            { text: "Após 100, usamos hundred + o resto do número.", c: "teal" },
            { text: "De 101 a 199, não usamos and no inglês americano.", c: "teal" },
            { text: "A partir de 200, continuamos sem and na forma americana.", c: "teal" } ] },
          { t: "sec", text: "OBSERVE:", c: "purple" },
          { t: "rows", items: [
            { n: "200", text: "two hundred", c: "purple" },
            { n: "342", text: "three hundred forty-two", c: "purple" },
            { n: "505", text: "five hundred five", c: "purple" },
            { n: "999", text: "nine hundred ninety-nine", c: "purple" } ] },
          { t: "sec", text: "PRACTICE! · READ AND SAY!", c: "purple" },
          { t: "lead", text: "Leia os números em voz alta." },
          { t: "grid", cols: 3, items: [
            { title: "101", body: "a hundred one", v: "mint", c: "teal" },
            { title: "115", body: "a hundred fifteen", v: "lilac", c: "purple" },
            { title: "130", body: "a hundred thirty", v: "cream", c: "yellow" },
            { title: "147", body: "a hundred forty-seven", v: "mint", c: "teal" },
            { title: "160", body: "a hundred sixty", v: "lilac", c: "purple" },
            { title: "178", body: "a hundred seventy-eight", v: "cream", c: "yellow" },
            { title: "199", body: "a hundred ninety-nine", v: "mint", c: "teal" } ] },
          { t: "note", v: "cream", bar: true, kicker: "THINK ABOUT IT!", text: "Tente encontrar números acima de 100 no seu dia a dia: número do quarto do hotel, do assento do avião, da casa, da sala, etc." },
          { t: "cards", cols: 2, items: [
            { tag: "Quarto", c: "purple", v: "lilac", id: "w20p6b", alt: "Ícone de placa de quarto de hotel 305", ph: "Ilustração: ícone circular roxo-claro com uma porta roxa escura vista de frente; na porta, uma plaquinha com a palavra “ROOM” e, embaixo, o número “305” em letras brancas." },
            { tag: "Assento 24A", c: "teal", v: "mint", id: "w20p6c", alt: "Ícone de poltrona de avião", ph: "Ilustração: ícone circular azul-petróleo com uma poltrona de avião creme vista de frente, com encosto de cabeça branco e braços arredondados; à direita da poltrona, uma janelinha oval azul-escura." },
            { tag: "Casa 178", c: "orange", v: "cream", id: "w20p6d", alt: "Ícone de casa", ph: "Ilustração: ícone circular laranja com uma casinha de paredes creme vista de frente, telhado triangular vermelho-alaranjado, porta marrom-avermelhada no centro e um pequeno óculo redondo acima da porta." },
            { tag: "Sala 12", c: "green", v: "mint", id: "w20p6e", alt: "Ícone de porta de sala", ph: "Ilustração: ícone circular verde com uma porta entreaberta: à esquerda, o batente creme com uma plaquinha verde; à direita, a folha da porta em verde-escuro com um visor oval claro." } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 07" },
          { t: "title", en: "NUMBERS", pt: "HUNDREDS · 200–999 and more" },
          { t: "lead", text: "Depois de 100, usamos “hundred” para formar centenas e números maiores." },
          { t: "image", id: "w20p7a", alt: "Homem trabalhando na varanda com vista para a cidade", ph: "Foto: homem jovem negro, de cabelo crespo curto e barba, com camisa jeans azul-clara por cima de uma camiseta branca e fones de ouvido brancos, sentado a uma mesa de madeira na varanda de um apartamento, digitando em um notebook e sorrindo. Sobre a mesa, uma caneca cinza-escura, um caderno com caneta e um vasinho de planta. Ao fundo, a vista dos prédios da cidade. Um balão de fala branco à direita diz: “In my city, there are 682 cafés and 245 parks!”." },
          { t: "dialogue", items: [
            { s: "a", text: "In my city, there are 682 cafés and 245 parks!" } ] },
          { t: "note", v: "navy", kicker: "REGRA GERAL", text: "[number] + hundred + [restante do número]" },
          { t: "sec", text: "AS CENTENAS", c: "teal" },
          { t: "rows", items: [
            { n: "200", text: "two hundred", c: "teal" },
            { n: "300", text: "three hundred", c: "teal" },
            { n: "400", text: "four hundred", c: "teal" },
            { n: "500", text: "five hundred", c: "teal" },
            { n: "600", text: "six hundred", c: "teal" },
            { n: "700", text: "seven hundred", c: "teal" },
            { n: "800", text: "eight hundred", c: "teal" },
            { n: "900", text: "nine hundred", c: "teal" } ] },
          { t: "sec", text: "COMO CONSTRUÍMOS", c: "purple" },
          { t: "rule", v: "lilac", c: "purple", kicker: "CENTENA + RESTO DO NÚMERO", from: "600 + 82", to: "six hundred eighty-two", ex: "600 = six hundred (centena) · 82 = eighty-two (resto do número)", tr: "682 = six hundred eighty-two" },
          { t: "sec", text: "MAIS EXEMPLOS", c: "purple" },
          { t: "rows", items: [
            { n: "245", text: "two hundred forty-five", c: "purple" },
            { n: "378", text: "three hundred seventy-eight", c: "purple" },
            { n: "513", text: "five hundred thirteen", c: "purple" },
            { n: "720", text: "seven hundred twenty", c: "purple" },
            { n: "913", text: "nine hundred thirteen", c: "purple" } ] },
          { t: "note", v: "cream", bar: true, kicker: "ATENÇÃO!", text: "Nas centenas exatas (200, 300, 400...), não adicionamos nada depois de “hundred”.\nQuando há outro número, usamos “hundred” + o restante." },
          { t: "sec", text: "OBSERVE", c: "teal" },
          { t: "grid", cols: 3, items: [
            { title: "342", body: "three hundred forty-two", v: "mint", c: "teal" },
            { title: "505", body: "five hundred five", v: "mint", c: "teal" },
            { title: "999", body: "nine hundred ninety-nine", v: "mint", c: "teal" } ] },
          { t: "sec", text: "PRACTICE! · READ THESE NUMBERS ALOUD!", c: "purple" },
          { t: "lead", text: "Leia em voz alta estes números." },
          { t: "grid", cols: 3, items: [
            { title: "200", body: "two hundred", v: "lilac", c: "purple" },
            { title: "256", body: "two hundred fifty-six", v: "lilac", c: "purple" },
            { title: "389", body: "three hundred eighty-nine", v: "lilac", c: "purple" },
            { title: "644", body: "six hundred forty-four", v: "lilac", c: "purple" },
            { title: "872", body: "eight hundred seventy-two", v: "lilac", c: "purple" },
            { title: "999", body: "nine hundred ninety-nine", v: "lilac", c: "purple" } ] },
          { t: "sec", text: "NUMBERS IN REAL LIFE", c: "teal" },
          { t: "cards", cols: 2, items: [
            { tag: "Bus 512", lines: ["five hundred twelve"], c: "teal", v: "mint", id: "w20p7b", alt: "Frente de um ônibus azul com o número 512", ph: "Foto: frente de um ônibus urbano moderno, azul com faixas brancas e prateadas, parado sob a cobertura de uma estação, com o número 512 em amarelo no letreiro eletrônico acima do para-brisa e os faróis acesos." },
            { tag: "720 items", lines: ["seven hundred twenty"], c: "yellow", v: "cream", id: "w20p7c", alt: "Caixa de papelão com a etiqueta 720 Items", ph: "Foto: caixa de papelão fechada, vista de canto, sobre um piso de madeira, com uma placa branca presa na frente escrita “720” em números grandes pretos e “Items” abaixo." },
            { tag: "Room 389", lines: ["three hundred eighty-nine"], c: "purple", v: "lilac", id: "w20p7d", alt: "Placa de porta com o número 389", ph: "Foto: placa quadrada preta com moldura dourada, presa a um painel de madeira clara, com “ROOM” em letras douradas pequenas e “389” em letras grandes cor de creme." },
            { tag: "872 subscribers", lines: ["eight hundred seventy-two"], c: "blue", v: "mint", id: "w20p7e", alt: "Tela mostrando 872 inscritos", ph: "Foto: televisor de moldura preta pendurado numa parede cinza-clara, com a tela preta mostrando o número “872” em azul vivo e a palavra “Subscribers” logo abaixo, em azul menor." },
            { tag: "Section 999", lines: ["nine hundred ninety-nine"], c: "navy", v: "gray", id: "w20p7f", alt: "Placa de estádio com a seção 999", ph: "Foto: placa retangular verde-escura presa no alto de um poste dentro de um estádio, com “SECTION” em letras brancas pequenas e “999” em letras brancas grandes; ao fundo, o gramado e as arquibancadas." } ] },
          { t: "note", v: "mint", kicker: "FUN FACT!", text: "Números grandes fazem parte do nosso dia a dia: tecnologia, esportes, transporte, lojas e muito mais!" } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 08" },
          { t: "title", en: "NUMBERS", pt: "THOUSANDS · 1,000–9,999" },
          { t: "lead", text: "Nesta aula, seguimos principalmente o padrão americano sem ‘and’." },
          { t: "image", id: "w20p8a", alt: "Estudante na biblioteca falando sobre os 2.357 alunos da universidade", ph: "Foto: jovem de cabelo castanho comprido, com jaqueta jeans azul por cima de uma blusa branca, sentada a uma mesa de biblioteca escrevendo em um caderno, com um notebook aberto à frente e um copo de papel de café ao lado. À direita, uma pilha de livros com as lombadas escritas “WORLD ATLAS”, “SCIENCE TODAY” e “HISTORY OF CITIES”; ao fundo, estantes de livros e uma janela grande. Um balão de fala branco no alto diz: “My university has 2,357 students from 28 countries!”." },
          { t: "dialogue", items: [
            { s: "a", text: "My university has 2,357 students from 28 countries!" } ] },
          { t: "note", v: "navy", kicker: "REGRA GERAL", text: "[number] + thousand + [restante do número]" },
          { t: "sec", text: "OS NÚMEROS", c: "teal" },
          { t: "rows", items: [
            { n: "1,000", text: "a thousand / one thousand", c: "teal" },
            { n: "1,010", text: "a thousand ten", c: "teal" },
            { n: "2,357", text: "two thousand three hundred fifty-seven", c: "teal" },
            { n: "4,921", text: "four thousand nine hundred twenty-one", c: "teal" },
            { n: "9,465", text: "nine thousand four hundred sixty-five", c: "teal" } ] },
          { t: "sec", text: "COMO CONSTRUÍMOS", c: "purple" },
          { t: "rule", v: "lilac", c: "purple", kicker: "MILHAR + CENTENA + RESTO", from: "2,000 + 300 + 57", to: "two thousand three hundred fifty-seven", ex: "2,000 = two thousand (thousand) · 300 = three hundred (hundreds) · 57 = fifty-seven (restante do número)", tr: "2,357 = 2,000 + 300 + 57" },
          { t: "note", v: "mint", bar: true, text: "Nesta aula, seguimos principalmente o padrão americano sem ‘and’." },
          { t: "sec", text: "PRONÚNCIA", c: "teal" },
          { t: "table", head: ["PALAVRA", "PRONÚNCIA"], rows: [
            { a: "thousand", b: "/ ˈθaʊ.zənd /", v: "mint" },
            { a: "hundred", b: "/ ˈhʌn.drəd /", v: "mint" },
            { a: "twenty", b: "/ ˈtwen.ti /", v: "lilac" },
            { a: "thirty", b: "/ ˈθɜːr.ti /", v: "lilac" },
            { a: "forty", b: "/ ˈfɔːr.ti /", v: "cream" },
            { a: "fifty", b: "/ ˈfɪf.ti /", v: "cream" },
            { a: "sixty", b: "/ ˈsɪk.sti /", v: "mint" },
            { a: "ninety", b: "/ ˈnaɪn.ti /", v: "mint" } ] },
          { t: "note", v: "gray", text: "Pratique a pronúncia em voz alta várias vezes!" },
          { t: "sec", text: "PRACTICE! · READ THESE NUMBERS ALOUD!", c: "purple" },
          { t: "grid", cols: 3, items: [
            { title: "1,245", body: "one thousand two hundred forty-five", v: "lilac", c: "purple" },
            { title: "3,680", body: "three thousand six hundred eighty", v: "lilac", c: "purple" },
            { title: "5,102", body: "five thousand one hundred two", v: "lilac", c: "purple" },
            { title: "7,402", body: "seven thousand four hundred two", v: "lilac", c: "purple" },
            { title: "9,999", body: "nine thousand nine hundred ninety-nine", v: "lilac", c: "purple" } ] },
          { t: "sec", text: "WRITE IT!", c: "teal" },
          { t: "fill", id: "w20e1", title: "WRITE THE NUMBER IN WORDS.", items: [
            { pre: "1. 1,356", answers: ["one thousand three hundred fifty-six"], v: "mint" },
            { pre: "2. 2,701", answers: ["two thousand seven hundred one"], v: "lilac" },
            { pre: "3. 4,803", answers: ["four thousand eight hundred three"], v: "cream" },
            { pre: "4. 6,250", answers: ["six thousand two hundred fifty"], v: "mint" },
            { pre: "5. 8,964", answers: ["eight thousand nine hundred sixty-four"], v: "lilac" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 09" },
          { t: "title", en: "YOUR TURN!", pt: "Numbers in real life." },
          { t: "lead", text: "Agora é sua vez de usar números em situações reais." },
          { t: "image", id: "w20p9a", alt: "Homem no café com cartões de telefone, idade e preços", ph: "Foto: recorte da cena da cafeteria: homem jovem de cabelo escuro cacheado e jaqueta verde-escura, sentado à mesa de madeira olhando para o celular que segura com as duas mãos. Sobre a foto, o quadrado roxo “AGE 18” no alto à direita, a ponta do cartão de contato com o final do número “…321” à esquerda, o cupom “TOTAL 2,357” à direita e, na frente, um cartão branco com o texto “REAL-LIFE NUMBERS · phone • age • prices”. Ao fundo, prateleiras com plantas." },
          { t: "sec", text: "1 · LISTEN & WRITE", c: "purple" },
          { t: "lead", text: "Ouça e escreva os números ditados." },
          { t: "note", v: "gray", text: "Na prática com áudio, você ouvirá 5 números." },
          { t: "free", id: "w20f2", cols: 2, items: [
            { n: "1", kicker: "NÚMERO 1", prefix: "Escreva o número que você ouviu.", ideas: "", v: "mint", c: "teal" },
            { n: "2", kicker: "NÚMERO 2", prefix: "Escreva o número que você ouviu.", ideas: "", v: "lilac", c: "purple" },
            { n: "3", kicker: "NÚMERO 3", prefix: "Escreva o número que você ouviu.", ideas: "", v: "cream", c: "yellow" },
            { n: "4", kicker: "NÚMERO 4", prefix: "Escreva o número que você ouviu.", ideas: "", v: "mint", c: "teal" },
            { n: "5", kicker: "NÚMERO 5", prefix: "Escreva o número que você ouviu.", ideas: "", v: "lilac", c: "purple" } ] },
          { t: "sec", text: "2 · PHONE NUMBER", c: "teal" },
          { t: "dialogue", items: [
            { s: "a", text: "What’s your phone number?" },
            { s: "b", text: "It’s 90765-0023." } ] },
          { t: "note", v: "gray", bold: true, text: "Use apenas números fictícios." },
          { t: "sec", text: "3 · AGE", c: "purple" },
          { t: "lead", text: "Role-play com idades fictícias:" },
          { t: "cards", cols: 2, items: [
            { tag: "26", lines: ["I’m twenty-six."], c: "teal", v: "mint" },
            { tag: "34", lines: ["I’m thirty-four years old."], c: "purple", v: "lilac" } ] },
          { t: "sec", text: "4 · PRICES", c: "yellow" },
          { t: "lead", text: "Leia os números nas etiquetas." },
          { t: "note", v: "gray", text: "O foco é o número, não a moeda." },
          { t: "chips", items: [
            { t: "$18", c: "yellow" },
            { t: "$45", c: "yellow" },
            { t: "$120", c: "yellow" },
            { t: "$2,350", c: "yellow" } ] },
          { t: "note", v: "navy", bar: true, bold: true, kicker: "READ IT ALOUD!", text: "18 • 45 • 120 • 2,350" } ] },

        { blocks: [
          { t: "badge", label: "AULA 20", page: "PÁGINA 10" },
          { t: "kicker", text: "AULA CONCLUÍDA" },
          { t: "title", en: "NUMBERS", pt: "Você já sabe usar Numbers." },
          { t: "lead", text: "Use este checklist antes de avançar." },
          { t: "check", id: "w20c1", title: "EU CONSIGO...", items: [
            "reconhecer e dizer números de 0 a 9.",
            "usar zero e oh em sequências como telefone.",
            "dizer números de 10 a 19.",
            "formar números de 20 a 99.",
            "usar How old are you? e responder com idade.",
            "usar a hundred / one hundred e centenas.",
            "reconhecer a diferença entre o padrão americano e britânico com and.",
            "ler números de 1,000 a 9,999.",
            "usar números em telefone, idade e preços fictícios." ] },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 20", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Microdesafio de fala: ouvir, repetir e dizer números; praticar telefone fictício, idade fictícia e preços.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 21 · WHAT TIME IS IT?", body: "Você aprenderá a perguntar e dizer as horas em inglês." },
          { t: "bar", label: "PROGRESSO", value: "20 DE 42 AULAS", pct: "48%" } ] }
      ]
    },

  {
    id: 21,
    code: "AULA 21",
    title: "What time is it?",
    sub: "Perguntar e dizer as horas em inglês.",
    time: "15 minutos",
    pages: [
      // ───────────────────────────── página 01 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21" },
          { t: "title", en: "WHAT TIME IS IT?", pt: "Perguntar e dizer as horas em inglês." },
          { t: "lead", text: "Você já sabe os números. Agora vai aprender a usá-los para perguntar e dizer as horas em inglês." },
          {
            t: "image",
            id: "w21p1a",
            alt: "Homem em uma estação de trem olhando o relógio de pulso.",
            ph: "Foto: homem jovem de cabelo castanho ondulado, camisa jaqueta verde-oliva sobre camiseta branca e mochila de couro marrom no ombro, dentro do saguão envidraçado de uma estação de trem, olhando para o relógio de pulso preto. À direita, um painel eletrônico preto mostra um relógio analógico, o horário 10:25 em branco e PLATFORM 3 em amarelo, e abaixo a lista de destinos: New York 10:40, Boston 11:15, Washington 11:45. Ao fundo, passageiros caminhando e o teto de vidro da estação.",
          },
          { t: "sec", text: "NESTE AULA, VOCÊ VAI:" },
          { t: "grid", cols: 3, items: [
            { title: "perguntar as horas;", v: "mint", c: "teal" },
            { title: "compreender diferentes formas de dizer a hora;", v: "lilac", c: "purple" },
            { title: "ler relógios analógicos e digitais.", v: "cream", c: "yellow" } ] },
          { t: "sec", text: "COMO FUNCIONA?" },
          { t: "steps", items: [
            { n: "1", tag: "ASK", c: "teal", v: "mint", note: "Pergunte a hora.", lines: ["What time is it?", "What’s the time?"] },
            {
              n: "2",
              tag: "LOOK",
              c: "purple",
              v: "lilac",
              note: "Olhe o relógio.",
              id: "w21p1b",
              alt: "Relógio analógico marcando dez horas e vinte e cinco minutos.",
              ph: "Ilustração: relógio analógico redondo com aro azul-marinho grosso e mostrador branco, números de 1 a 12 em azul-marinho, ponteiro das horas no 10 e ponteiro dos minutos no 5 (10:25). Setas pontilhadas verde-azulada e roxa entram e saem do relógio, ligando o balão da pergunta ao balão da resposta.",
            },
            { n: "3", tag: "SAY", c: "yellow", v: "cream", note: "Diga a hora em inglês.", lines: ["It’s ten twenty-five."] } ] },
          { t: "objective", v: "cream", title: "OBJETIVO DA AULA", text: "Aprender a perguntar, compreender e dizer as horas em diferentes situações do dia a dia." },
        ],
      },

      // ───────────────────────────── página 02 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 02" },
          { t: "title", en: "IT’S × AT", pt: "Use it’s for the time now. Use at before the time of an action." },
          { t: "cards", cols: 1, items: [
            {
              tag: "TIME NOW",
              c: "teal",
              v: "mint",
              id: "w21p2a",
              alt: "Homem sentado à mesa olhando o relógio de pulso.",
              ph: "Ilustração em estilo pintura digital: homem de cabelo castanho ondulado, camisa jaqueta verde-oliva sobre camiseta branca, sentado a uma mesa de madeira à noite, olhando para o relógio de pulso preto no braço esquerdo. Sobre a mesa, uma caneca azul-marinho e um livro aberto. Ao fundo, luminária acesa, planta verde e estante com livros e vasos.",
              lines: ["What time is it?", "It’s six o’clock."],
            },
            {
              tag: "TIME OF AN ACTION",
              c: "purple",
              v: "lilac",
              id: "w21p2b",
              alt: "Mulher se espreguiçando na cama ao acordar.",
              ph: "Ilustração em estilo pintura digital: mulher de cabelo preto preso em coque, camiseta amarelo-clara, sentada na cama com os dois braços esticados para cima se espreguiçando e os olhos fechados, sorrindo. Edredom azul-petróleo, travesseiros claros e cabeceira de madeira. Ao lado, criado-mudo com abajur aceso e um vaso de planta; cortina branca com luz do amanhecer entrando pela janela.",
              lines: ["What time do you get up?", "At six o’clock."],
            } ] },
          { t: "note", v: "cream", bar: true, bold: true, text: "IT’S = the time now  |  AT = before the time of an action" },
        ],
      },

      // ───────────────────────────── página 03 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 03" },
          { t: "title", en: "A.M. × P.M.", pt: "Antes do meio-dia × depois do meio-dia." },
          { t: "lead", text: "Usamos a.m. para as horas da manhã e p.m. para as horas da tarde, da noite e noite." },
          {
            t: "image",
            id: "w21p3a",
            alt: "Ícone de sol para a.m. e ícone de lua com estrelas para p.m.",
            ph: "Ilustração: dois ícones redondos lado a lado dentro de uma faixa branca. À esquerda, um círculo verde-azulado cheio com um sol de traço branco (raios ao redor), que acompanha o texto a.m. À direita, um círculo roxo cheio com uma lua crescente branca e três estrelinhas, que acompanha o texto p.m. Uma linha vertical cinza-clara separa os dois.",
          },
          { t: "grid", cols: 2, items: [
            { title: "a.m.", body: "Antes do meio-dia.", v: "mint", c: "teal" },
            { title: "p.m.", body: "Depois do meio-dia.", v: "lilac", c: "purple" } ] },
          { t: "sec", text: "VEJA COMO O DIA MUDA:" },
          { t: "cards", cols: 2, items: [
            {
              tag: "MORNING",
              c: "teal",
              v: "mint",
              id: "w21p3b",
              alt: "Amanhecer na cidade com um relógio marcando seis horas.",
              ph: "Foto: amanhecer visto de um deck de madeira à beira d’água, com uma mesa redonda, um vaso de planta e uma xícara de café branca em primeiro plano; o sol nasce entre os prédios da cidade ao fundo, com o céu laranja e dourado. Sobre a foto, um relógio analógico com aro verde-azulado marcando seis horas em ponto.",
              lines: ["6:00 a.m.", "It’s six o’clock in the morning."],
            },
            {
              tag: "AFTERNOON",
              c: "blue",
              v: "gray",
              id: "w21p3c",
              alt: "Parque ensolarado ao meio-dia com um relógio marcando doze horas.",
              ph: "Foto: calçada de um parque urbano à tarde, com árvores verdes, bancos de madeira e arranha-céus de vidro ao fundo sob um céu azul com nuvens brancas. Sobre a foto, um relógio analógico com aro azul marcando doze horas em ponto.",
              lines: ["12:00 p.m.", "It’s twelve o’clock.", "It’s noon.", "It’s midday."],
            },
            {
              tag: "EVENING",
              c: "orange",
              v: "cream",
              id: "w21p3d",
              alt: "Pôr do sol na cidade com um relógio marcando seis horas.",
              ph: "Foto: pôr do sol alaranjado sobre a silhueta dos prédios da cidade, vista de um terraço com uma mesa posta, taças de vinho e uma vela acesa em primeiro plano. Sobre a foto, um relógio analógico com aro laranja marcando seis horas em ponto.",
              lines: ["6:00 p.m.", "It’s six o’clock in the evening."],
            },
            {
              tag: "NIGHT",
              c: "purple",
              v: "lilac",
              id: "w21p3e",
              alt: "Cidade iluminada à noite com um relógio marcando dez horas.",
              ph: "Foto: cidade à noite, com arranha-céus iluminados refletidos na água escura e céu azul-escuro. Sobre a foto, um relógio analógico com aro roxo marcando dez horas em ponto.",
              lines: ["10:00 p.m.", "It’s ten o’clock at night."],
            } ] },
          { t: "note", v: "mint", bar: true, kicker: "IMPORTANTE!", text: "Use a.m. com as horas antes do meio-dia.\nUse p.m. com as horas depois do meio-dia." },
          { t: "sec", text: "OUTROS EXEMPLOS:" },
          { t: "rows", items: [
            { text: "7:30 a.m. = morning (manhã)", c: "teal" },
            { text: "2:45 p.m. = afternoon (tarde)", c: "purple" },
            { text: "8:15 p.m. = evening (noite)", c: "purple" },
            { text: "11:30 p.m. = night (noite)", c: "purple" } ] },
          { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", bold: true, text: "12:00 p.m. é meio-dia.\n12:00 a.m. é meia-noite." },
        ],
      },

      // ───────────────────────────── página 04 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 04" },
          { t: "title", en: "O’CLOCK, NOON & MIDDAY", pt: "Horas cheias e meio-dia." },
          { t: "lead", text: "Usamos o’clock para horas cheias. Para 12:00 p.m., também podemos dizer noon ou midday." },
          {
            t: "image",
            id: "w21p4a",
            alt: "Homem em um café olhando o relógio de pulso.",
            ph: "Foto: homem de cabelo castanho ondulado, camisa jaqueta verde-oliva sobre camiseta branca, sentado a uma mesa de madeira de um café claro, com um caderno aberto e um lápis à frente, olhando para o relógio de pulso preto. Ao lado, um copo de café para viagem e um vaso de planta; ao fundo, janelas grandes com a rua e estantes com livros.",
          },
          { t: "sec", text: "HORAS CHEIAS" },
          {
            t: "image",
            id: "w21p4b",
            alt: "Três relógios analógicos marcando uma, seis e nove horas.",
            ph: "Ilustração: três relógios analógicos iguais em fila, com aro azul-marinho grosso, mostrador branco e números de 1 a 12. O primeiro marca uma hora em ponto (1:00), o segundo marca seis horas em ponto (6:00) e o terceiro marca nove horas em ponto (9:00). Acima de cada relógio, o horário escrito em verde-azulado.",
          },
          { t: "grid", cols: 3, items: [
            { title: "1:00", body: "It’s one o’clock.", v: "mint", c: "teal" },
            { title: "6:00", body: "It’s six o’clock.", v: "mint", c: "teal" },
            { title: "9:00", body: "It’s nine o’clock.", v: "mint", c: "teal" } ] },
          { t: "cards", cols: 1, items: [
            {
              tag: "MEIO-DIA",
              c: "yellow",
              v: "cream",
              id: "w21p4c",
              alt: "Relógio marcando doze horas ao lado de um desenho de sol e cidade.",
              ph: "Ilustração: relógio analógico com aro amarelo-dourado, mostrador branco e os dois ponteiros juntos apontando para o 12 (12:00). Ao lado, desenho de traço amarelo com sol, nuvens, prédios e árvores de uma cidade.",
              lines: ["12:00 p.m.", "It’s noon.", "It’s midday."],
            } ] },
          { t: "note", v: "mint", bar: true, kicker: "LEMBRE-SE", bold: true, text: "Use o’clock com horas cheias.\nNoon e midday significam meio-dia." },
        ],
      },

      // ───────────────────────────── página 05 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 05" },
          { t: "title", en: "HALF & QUARTER", pt: "Como dizer :30 e :15." },
          { t: "lead", text: "Usamos half past para meia hora (:30).\nUsamos a quarter past para quinze minutos (:15)." },
          { t: "cards", cols: 2, items: [
            {
              tag: "HALF PAST",
              c: "purple",
              v: "lilac",
              id: "w21p5a",
              alt: "Relógio marcando sete e meia e homem olhando o relógio de pulso.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro roxo marcando sete e meia (ponteiro das horas entre o 7 e o 8, ponteiro dos minutos no 6). Embaixo, foto de um homem de cabelo castanho ondulado, camisa jaqueta verde-oliva sobre camiseta branca, sentado a uma mesa de café olhando para o relógio de pulso preto, com um copo de café para viagem ao lado.",
              lines: ["It’s half past seven."],
              note: "Também podemos dizer: It’s seven thirty.",
            },
            {
              tag: "A QUARTER PAST",
              c: "teal",
              v: "mint",
              id: "w21p5b",
              alt: "Relógio marcando nove e quinze e mulher olhando o relógio de pulso.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro verde-azulado marcando nove e quinze (ponteiro das horas no 9, ponteiro dos minutos no 3). Embaixo, foto de uma mulher de cabelo preto comprido e jaqueta jeans, sentada junto à janela de um café, sorrindo e olhando para o relógio de pulso preto, com uma xícara branca sobre a mesa de madeira.",
              lines: ["It’s a quarter past nine."],
              note: "Também podemos dizer: It’s nine fifteen.",
            } ] },
          { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", text: ":30 = half past\n:15 = a quarter past\nPodemos usar a forma com past ou a forma numérica." },
          { t: "rows", items: [
            { text: "7:30 → half past seven", c: "purple" },
            { text: "9:15 → a quarter past nine", c: "teal" } ] },
        ],
      },

      // ───────────────────────────── página 06 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 06" },
          { t: "title", en: "PAST & TO", pt: "Como falar os minutos depois e antes da hora." },
          { t: "lead", text: "Usamos past para minutos depois da hora.\nUsamos to para minutos antes da próxima hora." },
          {
            t: "image",
            id: "w21p6a",
            alt: "Linha do tempo mostrando quando usar past e quando usar to.",
            ph: "Ilustração: faixa branca com um relógio analógico pequeno no centro e a legenda A HORA embaixo dele. À esquerda, uma seta roxa apontando para fora com os marcos :30, :10, :20 e :05 e o rótulo Minutos depois da hora = past. À direita, uma seta verde-azulada apontando para fora com os marcos :05, :10, :20 e :25 e o rótulo Minutos antes da próxima hora = to.",
          },
          { t: "cards", cols: 2, items: [
            {
              tag: "PAST",
              c: "purple",
              v: "lilac",
              id: "w21p6b",
              alt: "Relógio marcando oito e vinte e homem olhando o relógio de pulso.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro roxo marcando oito e vinte (ponteiro das horas no 8, ponteiro dos minutos no 4). Embaixo, foto de um homem de cabelo castanho ondulado, camisa jaqueta verde-oliva sobre camiseta branca, sentado a uma mesa de café olhando para o relógio de pulso, com papéis e uma caneca ao lado.",
              lines: ["It’s twenty past eight."],
              note: "Também podemos dizer: It’s eight twenty.",
            },
            {
              tag: "TO",
              c: "teal",
              v: "mint",
              id: "w21p6c",
              alt: "Relógio marcando dez para as cinco e mulher olhando o relógio de pulso.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro verde-azulado marcando dez para as cinco (ponteiro das horas perto do 5, ponteiro dos minutos no 10). Embaixo, foto de uma mulher de cabelo castanho comprido, blazer bege e bolsa de couro no ombro, em pé num escritório claro, sorrindo e olhando para o relógio de pulso.",
              lines: ["It’s ten to five."],
              note: "Também podemos dizer: It’s four fifty.",
            } ] },
          { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", text: "past = depois da hora\nto = antes da próxima hora\nPodemos usar a forma com past/to ou a forma numérica." },
          { t: "rows", items: [
            { text: "8:20 → twenty past eight", c: "purple" },
            { text: "4:50 → ten to five", c: "teal" } ] },
        ],
      },

      // ───────────────────────────── página 07 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 07" },
          { t: "title", en: "A.M. & P.M.", pt: "Como indicar horários da manhã, tarde e noite." },
          { t: "lead", text: "Usamos a.m. para horários antes do meio-dia.\nUsamos p.m. para horários do meio-dia até a noite." },
          {
            t: "image",
            id: "w21p7a",
            alt: "Linha do tempo de 00:00 a 23:59 dividida entre a.m. e p.m.",
            ph: "Ilustração: faixa branca com um sol de traço verde-azulado à esquerda e uma lua crescente de traço roxo com duas estrelinhas à direita. No meio, uma linha do tempo horizontal com bolinhas nas pontas: a metade esquerda verde-azulada, com o rótulo 00:00–11:59 = a.m. acima, e a metade direita roxa, com o rótulo 12:00–23:59 = p.m. acima; embaixo da linha, os marcos 00:00, 11:59, 12:00 e 23:59. Abaixo de tudo, uma faixa cinza-clara com dois relógios analógicos pequenos: um de aro verde-azulado ao lado de 12:00 p.m. = noon e um de aro roxo ao lado de 12:00 a.m. = midnight.",
          },
          { t: "cards", cols: 2, items: [
            {
              tag: "MORNING",
              c: "teal",
              v: "mint",
              id: "w21p7b",
              alt: "Homem andando na rua de manhã com um copo de café.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro verde-azulado marcando oito horas em ponto. Embaixo, foto de um homem de cabelo castanho ondulado, camisa jaqueta verde-oliva sobre camiseta branca e mochila no ombro, caminhando por uma calçada de manhã com um copo de café para viagem na mão, prédios de vidro ao fundo.",
              lines: ["8:00 a.m.", "It’s eight a.m."],
            },
            {
              tag: "AFTERNOON",
              c: "purple",
              v: "lilac",
              id: "w21p7c",
              alt: "Homem e mulher estudando juntos no notebook à tarde.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro roxo marcando duas e meia. Embaixo, foto de uma mulher de suéter bege e um homem de camisa jeans azul sentados lado a lado a uma mesa, olhando para a tela de um notebook prateado, com caderno, caneta e caneca por perto; ambiente claro de escritório ou café.",
              lines: ["2:30 p.m.", "It’s two thirty p.m."],
            },
            {
              tag: "NIGHT",
              c: "navy",
              v: "gray",
              id: "w21p7d",
              alt: "Mulher jantando à noite em um ambiente iluminado.",
              ph: "Ilustração e foto no mesmo cartão: em cima, relógio analógico com aro verde-azulado marcando nove e quinze. Embaixo, foto de uma mulher de cabelo castanho comprido e suéter bege, sentada à mesa de jantar à noite, sorrindo diante de um prato de massa e um copo d’água; ao fundo, abajur aceso, sofá e a janela com as luzes da cidade.",
              lines: ["9:15 p.m.", "It’s nine fifteen p.m."],
            } ] },
          { t: "note", v: "cream", bar: true, kicker: "LEMBRE-SE", text: "a.m. = antes do meio-dia\np.m. = depois do meio-dia\n12:00 p.m. = noon\n12:00 a.m. = midnight" },
          { t: "rows", items: [
            { text: "7:00 a.m. → seven a.m.", c: "teal" },
            { text: "6:45 p.m. → six forty-five p.m.", c: "purple" } ] },
        ],
      },

      // ───────────────────────────── página 08 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 08" },
          { t: "title", en: "VAMOS CONVERSAR", pt: "Pergunte e responda as horas em situações do dia a dia." },
          { t: "cards", cols: 1, items: [
            {
              tag: "AT SCHOOL",
              c: "teal",
              v: "white",
              id: "w21p8a",
              alt: "Dois estudantes conversando no corredor da escola.",
              ph: "Foto: rapaz de camisa jaqueta verde-oliva e mochila conversando com uma moça de cabelo preto comprido, suéter bege e caderno azul-marinho no braço, no saguão envidraçado de uma escola, com outros estudantes ao fundo. Ao lado do diálogo, ilustração de um relógio analógico com aro verde-azulado marcando oito horas em ponto.",
              lines: ["A: What time is the class?", "B: It’s at eight o’clock."],
              note: "8:00 a.m.",
            },
            {
              tag: "AT WORK",
              c: "purple",
              v: "white",
              id: "w21p8b",
              alt: "Colegas de trabalho conversando diante de um notebook.",
              ph: "Foto: mulher de blazer bege, sentada com um caderno e uma caneta, conversando e sorrindo com um homem de suéter azul-marinho que gesticula com as mãos, os dois em uma mesa de escritório com notebook prateado, caneca e um vaso pequeno de planta; colegas ao fundo. Ao lado do diálogo, ilustração de um relógio analógico com aro roxo marcando três e quinze.",
              lines: ["A: What time is the meeting?", "B: It’s at quarter past three."],
              note: "3:15 p.m.",
            },
            {
              tag: "AT THE MOVIES",
              c: "teal",
              v: "white",
              id: "w21p8c",
              alt: "Casal conversando na entrada do cinema com pipoca e refrigerante.",
              ph: "Foto: rapaz de jaqueta jeans com capuz segurando um balde de pipoca escrito CINEMA e uma moça de jaqueta de couro preta segurando um copo vermelho, os dois conversando no saguão de um cinema, com cartazes iluminados ao fundo. Ao lado do diálogo, ilustração de um relógio analógico com aro verde-azulado marcando quinze para as oito.",
              lines: ["A: What time is the movie?", "B: It’s at quarter to eight."],
              note: "7:45 p.m.",
            } ] },
          { t: "sec", text: "SUA VEZ · PERGUNTE E RESPONDA:" },
          { t: "cards", cols: 2, items: [
            {
              tag: "6:00 a.m.",
              c: "teal",
              v: "mint",
              id: "w21p8d",
              alt: "Relógio analógico marcando seis horas.",
              ph: "Ilustração: relógio analógico pequeno com aro verde-azulado, mostrador branco e números de 1 a 12, marcando seis horas em ponto; abaixo dele, a etiqueta verde-azulada 6:00 a.m.",
            },
            {
              tag: "12:30 p.m.",
              c: "purple",
              v: "lilac",
              id: "w21p8e",
              alt: "Relógio analógico marcando doze e meia.",
              ph: "Ilustração: relógio analógico pequeno com aro roxo, mostrador branco e números de 1 a 12, marcando doze e meia; abaixo dele, a etiqueta roxa 12:30 p.m.",
            },
            {
              tag: "9:15 p.m.",
              c: "yellow",
              v: "cream",
              id: "w21p8f",
              alt: "Relógio analógico marcando nove e quinze.",
              ph: "Ilustração: relógio analógico pequeno com aro amarelo-dourado, mostrador branco e números de 1 a 12, marcando nove e quinze; abaixo dele, a etiqueta amarela 9:15 p.m.",
            } ] },
          { t: "note", v: "cream", bar: true, bold: true, text: "Diga as horas em voz alta usando: o’clock, half past, quarter past ou a.m./p.m." },
        ],
      },

      // ───────────────────────────── página 09 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 09" },
          { t: "title", en: "SUA VEZ COM AS HORAS", pt: "Observe os relógios e complete as expressões em inglês." },
          {
            t: "image",
            id: "w21p9a",
            alt: "Homem e mulher escrevendo em cadernos em um café.",
            ph: "Foto: homem de cabelo castanho ondulado e camisa jaqueta verde-oliva e mulher de cabelo castanho comprido e jaqueta jeans, sentados lado a lado a uma mesa de madeira de um café, os dois sorrindo e escrevendo em cadernos abertos. Sobre a mesa, um notebook, um copo de café para viagem e um vaso de planta; ao fundo, outras pessoas, um quadro-negro escrito COFFEE FOCUS IDEAS TIME e um relógio de parede redondo.",
          },
          { t: "sec", text: "OLHE E COMPLETE", c: "purple" },
          {
            t: "image",
            id: "w21p9b",
            alt: "Quatro relógios analógicos numerados de 1 a 4.",
            ph: "Ilustração: quatro relógios analógicos em fila dentro de uma caixa branca de borda roxa, separados por linhas pontilhadas verticais. Cada relógio tem um círculo roxo numerado no canto superior esquerdo (1, 2, 3 e 4; os quatro círculos são roxos). O relógio 1 tem aro roxo e marca três horas em ponto; o 2 tem aro verde-azulado e marca seis e quinze; o 3 tem aro roxo e marca oito e meia; o 4 tem aro verde-azulado e marca quinze para as dez. Todos têm mostrador branco, números de 1 a 12 em preto e ponteiros pretos grossos.",
          },
          { t: "fill", id: "w21e1", title: "1 · OLHE O RELÓGIO E COMPLETE A EXPRESSÃO", items: [
            { pre: "1. It’s", answers: ["three o’clock"], post: ".", note: "São três horas.", v: "lilac" },
            { pre: "2. It’s", answers: ["quarter past six", "a quarter past six"], post: ".", note: "São seis e quinze.", v: "mint" },
            { pre: "3. It’s", answers: ["half past eight"], post: ".", note: "São oito e meia.", v: "lilac" },
            { pre: "4. It’s", answers: ["quarter to ten", "a quarter to ten"], post: ".", note: "São quinze para as dez.", v: "mint" } ] },
          { t: "sec", text: "A.M. OU P.M.?" },
          {
            t: "image",
            id: "w21p9c",
            alt: "Quatro ícones: nascer do sol, livro, talheres e claquete.",
            ph: "Ilustração: quatro ícones verde-azulados, cada um dentro de um círculo de contorno fino verde-azulado, em linha e separados por linhas pontilhadas verticais: sol nascendo sobre o horizonte com raios (breakfast), livro aberto de páginas viradas para cima (class), garfo à esquerda e faca à direita, em pé lado a lado (lunch) e claquete de cinema com um botão de play triangular (movie).",
          },
          { t: "fill", id: "w21e2", title: "2 · COMPLETE COM A.M. OU P.M.", sub: "a.m. = manhã  |  p.m. = tarde / noite", items: [
            { pre: "Breakfast · 7:00", answers: ["a.m."], v: "mint" },
            { pre: "Class · 10:00", answers: ["a.m."], v: "mint" },
            { pre: "Lunch · 12:30", answers: ["p.m."], v: "lilac" },
            { pre: "Movie · 8:00", answers: ["p.m."], v: "lilac" } ] },
          { t: "note", v: "cream", bar: true, kicker: "DICA RÁPIDA", text: "Quando você fala as horas em inglês, observe se é hora cheia, quarter past, half past ou quarter to. Depois pense se o horário é a.m. ou p.m." },
        ],
      },

      // ───────────────────────────── página 10 ─────────────────────────────
      {
        blocks: [
          { t: "badge", label: "AULA 21", page: "PÁGINA 10" },
          { t: "title", en: "AULA CONCLUÍDA!", pt: "Você já consegue perguntar e dizer as horas em inglês." },
          {
            t: "image",
            id: "w21p10a",
            alt: "Desenho de relógio de parede, calendário e relógio digital.",
            ph: "Ilustração de traço verde-azulado sobre fundo azul-claro: um relógio de parede redondo com ponteiros marcando cerca de dez e dez, ao lado de um calendário de mesa com argolas, um relógio digital mostrando 10:25 e um vaso com uma plantinha.",
          },
          { t: "check", id: "w21c1", title: "EU CONSIGO...", items: [
            "perguntar as horas: What time is it? What’s the time?",
            "dizer horas cheias com o’clock.",
            "usar noon / midday para 12:00 p.m.",
            "dizer quarter past, half past e quarter to.",
            "entender a diferença entre a.m. e p.m.",
            "ler relógios analógicos e digitais.",
            "falar as horas em situações do dia a dia." ] },
          { t: "cta", items: [
            { icon: "play", v: "teal", c: "white", title: "ASSISTA À VIDEOAULA 21", body: "WHAT TIME IS IT?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR AGORA" },
            { icon: "mic", v: "purple", c: "yellow", title: "PRATIQUE COM A IA", body: "Missão: diga em voz alta 5 horários do seu dia. Use pelo menos: one o’clock, half past, quarter past, quarter to, a.m. ou p.m.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "PRATICAR AGORA" } ] },
          { t: "note", v: "cream", bar: true, kicker: "MICRODESAFIO", bold: true, text: "Diga em voz alta: It’s seven o’clock. It’s quarter past nine. It’s half past six. It’s quarter to ten. Depois, diga um horário com a.m. e outro com p.m." },
          { t: "bar", label: "PROGRESSO", value: "21 DE 42 AULAS", pct: "50%" },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 22 · QUESTION WORDS" },
        ],
      },
    ],
  },

  {
    id: 22, code: "AULA 22", title: "Question Words", sub: "A pergunta certa leva à informação certa.",
    time: "16 minutos",
    pages: [
      // ── página 01 (impressa 01) — capa: QUESTION WORDS ──────────────────
      { blocks: [
        { t: "badge", label: "AULA 22" },
        { t: "title", en: "QUESTION WORDS", pt: "A pergunta certa leva à informação certa." },
        { t: "image", id: "w22p1a", alt: "Um homem e uma mulher conversando em uma mesa de café.",
          ph: "Foto: um homem jovem branco, de cabelo castanho cacheado e barba por fazer, camisa jeans azul e camiseta branca por baixo, com os braços apoiados na mesa de madeira, sorri de perfil para uma mulher jovem de cabelo castanho longo e suéter amarelo-mostarda de gola V, que sorri de volta e gesticula com a mão aberta. Sobre a mesa há um caderno espiral aberto com uma caneta e um copo de café para viagem com tampa preta. Ao fundo, um café claro com uma planta de folhas largas, luminárias pretas suspensas e uma janela. Dois balões de fala brancos no alto: o da esquerda, acima do homem, diz “What’s your name?” (com “What’s” em azul); o da direita, acima da mulher, diz “I’m Adam.”." },
        { t: "sec", text: "VOCÊ JÁ CONHECE ALGUMAS DELAS", c: "navy" },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "What’s your name?", b: "I’m Adam.", v: "mint" },
          { a: "Where are you from?", b: "I’m from Brazil.", v: "lilac" },
          { a: "How are you?", b: "I’m fine, thanks!", v: "cream" } ] },
        { t: "note", v: "white", bar: true, text: "Question words são palavras que ajudam a mostrar que tipo de informação queremos descobrir." },
        { t: "steps", items: [
          { tag: "PERGUNTA", lines: ["Fazemos uma pergunta."], c: "blue", v: "blue" },
          { tag: "INFORMAÇÃO PROCURADA", lines: ["Queremos encontrar uma informação específica."], c: "green", v: "green" },
          { tag: "RESPOSTA", lines: ["Recebemos a resposta certa."], c: "purple", v: "lilac" } ] },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI:", c: "green" },
        { t: "grid", cols: 2, items: [
          { title: "reconhecer as principais question words;", c: "green", v: "mint" },
          { title: "relacionar cada question word ao tipo de informação esperado;", c: "orange", v: "cream" },
          { title: "escolher a question word correta;", c: "blue", v: "white" },
          { title: "formular e responder perguntas simples.", c: "purple", v: "lilac" } ] },
        { t: "image", id: "w22p1b", alt: "Prancheta com uma lista de itens marcados e um lápis.",
          ph: "Ilustração: prancheta azul-marinho vista de frente, com uma folha branca presa por um clipe prateado. Na folha há três linhas cinzas, cada uma com um visto verde à esquerda. Um lápis amarelo apontado está apoiado na diagonal sobre a borda direita da prancheta." } ] },

      // ── página 02 (impressa 02) — QUAL INFORMAÇÃO VOCÊ QUER? ────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 02" },
        { t: "title", en: "QUAL INFORMAÇÃO VOCÊ QUER?", pt: "Cada question word aponta para um tipo de resposta." },
        { t: "image", id: "w22p2a", alt: "Bússola sobre um mapa-múndi cercada de balões com pontos de interrogação.",
          ph: "Ilustração: bússola de bolso com aro azul-marinho e rosa dos ventos azul e amarela, vista de frente, sobre um mapa-múndi pontilhado em azul claro. Ao redor da bússola há quatro balões de fala arredondados com um ponto de interrogação branco dentro: roxo em cima à direita, laranja à direita, azul embaixo à direita e verde à esquerda, ligados por linhas tracejadas azuis." },
        { t: "grid", cols: 2, items: [
          { title: "What", body: "coisas", c: "teal", v: "mint" },
          { title: "What time", body: "horário específico", c: "orange", v: "cream" },
          { title: "When", body: "dia | mês | ano", c: "green", v: "mint" },
          { title: "Who", body: "pessoas", c: "purple", v: "lilac" },
          { title: "Where", body: "lugares", c: "blue", v: "white" },
          { title: "Why", body: "motivo", c: "red", v: "white" },
          { title: "How", body: "maneira / estado", c: "teal", v: "mint" },
          { title: "How old", body: "idade", c: "yellow", v: "cream" } ] },
        { t: "sec", text: "COMO USAR ESTE MAPA", c: "navy" },
        { t: "steps", items: [
          { n: "1", tag: "VEJA", lines: ["que informação você quer descobrir."], c: "navy", v: "white" },
          { n: "2", tag: "IDENTIFIQUE", lines: ["o tipo de resposta que você espera receber."], c: "navy", v: "white" },
          { n: "3", tag: "ESCOLHA", lines: ["a question word que combina com essa informação."], c: "navy", v: "white" } ] },
        { t: "note", v: "cream", bar: true, kicker: "ATENÇÃO", text: "Não escolha apenas pela tradução.\nObserve principalmente o tipo de informação que a resposta deve trazer." },
        { t: "image", id: "w22p2b", alt: "Silhueta de uma pessoa pensando com um balão de interrogação.",
          ph: "Ilustração: silhueta azul-marinho do busto de um homem de perfil, com a mão fechada apoiada no queixo em gesto de quem pensa. À direita da cabeça sai um balão de pensamento branco com contorno azul e um grande ponto de interrogação azul dentro, precedido por duas bolinhas menores." },
        { t: "key", v: "blue", text: "Dominar as question words é dar o primeiro passo para fazer perguntas melhores e entender respostas com clareza!" } ] },

      // ── página 03 (impressa 03) — WHAT × WHAT TIME ──────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 03" },
        { t: "title", en: "WHAT × WHAT TIME", pt: "Coisas × horário específico." },
        { t: "image", id: "w22p3a", alt: "Um homem e uma mulher conversando sentados em um sofá.",
          ph: "Foto: um homem negro jovem, de camisa jeans azul-clara, sorri de perfil à esquerda; à direita, de costas em primeiro plano, uma mulher loira de suéter bege sorri olhando para ele. Os dois estão sentados em um sofá cinza claro de sala, com vasos de plantas e uma janela iluminada ao fundo." },
        { t: "sec", text: "WHAT", c: "teal" },
        { t: "note", v: "mint", text: "Use para buscar informação sobre coisas." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "What’s your name?", b: "My name is Adam.", v: "mint" },
          { a: "What’s your favorite kind of food?", b: "It’s Italian food.", v: "lilac" } ] },
        { t: "answers", title: "O QUE AS RESPOSTAS ENTREGAM?", v: "lilac", items: [
          { k: "Adam", a: "um nome", c: "purple" },
          { k: "Italian food", a: "uma preferência/coisa", c: "purple" } ] },
        { t: "sec", text: "WHAT TIME", c: "teal" },
        { t: "note", v: "mint", text: "Use quando a informação procurada é um horário específico." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "What time is it?", b: "It’s 9:15.", v: "mint" } ] },
        { t: "answers", title: "COMPARE", v: "cream", items: [
          { k: "What", a: "informação sobre uma coisa", c: "purple" },
          { k: "What time", a: "informação sobre um horário", c: "teal" } ] } ] },

      // ── página 04 (impressa 04) — WHERE × WHEN ──────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 04" },
        { t: "title", en: "WHERE × WHEN", pt: "Lugar × momento ou data." },
        { t: "image", id: "w22p4a", alt: "Um casal de viajantes conversando sobre um mapa aberto na mesa.",
          ph: "Foto: um homem jovem de jaqueta verde-militar e mochila azul, à esquerda, olha sorrindo para uma mulher jovem de jaqueta jeans que gesticula com a mão aberta. Sobre a mesa de madeira há um mapa rodoviário aberto, uma câmera fotográfica preta, um passaporte azul-marinho e um caderno espiral. Ao fundo, uma mala de viagem e uma parede de tijolos com plantas." },
        { t: "sec", text: "WHERE", c: "teal" },
        { t: "note", v: "mint", text: "Pergunta por informação relacionada a um lugar." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Where are you from?", b: "I’m from Brazil.", v: "mint" } ] },
        { t: "sec", text: "WHEN", c: "purple" },
        { t: "note", v: "lilac", text: "Pergunta quando queremos saber quando algo acontece." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "When’s your birthday?", b: "It’s on December 1st.", v: "lilac" } ] },
        { t: "answers", title: "LEIA A RESPOSTA", v: "lilac", items: [
          { k: "Brazil", a: "lugar/origem", c: "purple" },
          { k: "December 1st", a: "data", c: "purple" } ] },
        { t: "answers", title: "PORTANTO", v: "mint", items: [
          { k: "WHERE", a: "LUGAR", c: "teal" },
          { k: "WHEN", a: "DIA / MÊS / ANO", c: "teal" } ] },
        { t: "answers", title: "COMPARE", v: "cream", items: [
          { k: "Where?", a: "lugar", c: "teal" },
          { k: "When?", a: "momento/data", c: "purple" } ] } ] },

      // ── página 05 (impressa 05) — WHO × WHY ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 05" },
        { t: "title", en: "WHO × WHY", pt: "Pessoa × motivo." },
        { t: "image", id: "w22p5a", alt: "Três amigos conversando à mesa com uma pizza.",
          ph: "Foto: três jovens sorrindo e conversando ao redor de uma mesa de madeira em um restaurante. À esquerda, um rapaz de cabelo escuro cacheado, jaqueta jeans e camiseta branca gesticula com as duas mãos; no centro, uma moça de cabelo longo castanho e suéter bege apoia os braços na mesa e sorri de frente; à direita, de perfil, outra moça de cabelo ondulado castanho-claro e jaqueta verde-militar gesticula com a mão aberta. No centro da mesa há uma pizza inteira com tomate-cereja e folhas de manjericão sobre uma tábua redonda de madeira, um copo de água à esquerda, um copo de refrigerante escuro à direita e a borda de um prato redondo escuro na frente. Ao fundo, o salão do restaurante com luminárias pendentes e plantas." },
        { t: "sec", text: "WHO", c: "teal" },
        { t: "note", v: "mint", text: "Usamos quando queremos identificar uma pessoa." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Who is she?", b: "She’s my friend, Karen.", v: "mint" } ] },
        { t: "sec", text: "WHY", c: "purple" },
        { t: "note", v: "lilac", text: "Usamos quando queremos descobrir um motivo ou uma razão." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Why is pizza so famous?", b: "Because it is delicious.", v: "lilac" } ] },
        { t: "answers", title: "OBSERVE A RESPOSTA", v: "lilac", items: [
          { k: "Karen", a: "pessoa", c: "purple" },
          { k: "Because it is delicious.", a: "motivo / razão", c: "purple" } ] },
        { t: "note", v: "mint", bar: true, kicker: "PISTA IMPORTANTE", text: "Perguntas com Why procuram um motivo.\nNo exemplo, Because introduz esse motivo." },
        { t: "answers", title: "COMPARE", v: "cream", items: [
          { k: "Who?", a: "pessoa", c: "teal" },
          { k: "Why?", a: "motivo", c: "purple" } ] } ] },

      // ── página 06 (impressa 06) — HOW × HOW OLD ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 06" },
        { t: "title", en: "HOW × HOW OLD", pt: "Estado ou maneira × idade." },
        { t: "image", id: "w22p6a", alt: "Um homem e uma mulher conversando sentados em um sofá.",
          ph: "Foto: a mesma cena da página 03: um homem negro jovem, de camisa jeans azul-clara, sorri de perfil à esquerda e, à direita, uma mulher loira de suéter bege o observa sorrindo. Os dois estão sentados em um sofá cinza de sala, com vasos de plantas e uma janela clara ao fundo." },
        { t: "sec", text: "HOW", c: "teal" },
        { t: "note", v: "mint", text: "Para esta aula:\nHOW → maneira / estado" },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "Hey, Lis. How are you?", b: "I’m great, thanks.", v: "mint" } ] },
        { t: "sec", text: "HOW OLD", c: "purple" },
        { t: "note", v: "lilac", text: "As duas palavras trabalham juntas para perguntar a idade." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA"], rows: [
          { a: "How old is she?", b: "She’s 31 years old.", v: "lilac" } ] },
        { t: "answers", title: "OBSERVE A RESPOSTA", v: "lilac", items: [
          { k: "great", a: "estado", c: "teal" },
          { k: "31 years old", a: "idade", c: "purple" } ] },
        { t: "chips", title: "LOGO, NESSE EXEMPLO:", items: [
          { t: "HOW → ESTADO", c: "teal" } ] },
        { t: "chips", title: "LOGO:", items: [
          { t: "HOW OLD → IDADE", c: "purple" } ] },
        { t: "note", v: "cream", bar: true, kicker: "ATENÇÃO", bold: true, text: "How e How old não procuram o mesmo tipo de informação." },
        { t: "chips", items: [
          { t: "HOW → ESTADO / MANEIRA", c: "teal" },
          { t: "HOW OLD → IDADE", c: "purple" } ] } ] },

      // ── página 07 (impressa 07) — QUAL QUESTION WORD COMBINA? ───────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 07" },
        { t: "title", en: "QUAL QUESTION WORD COMBINA?", pt: "A resposta pode revelar qual pergunta você precisa fazer." },
        { t: "match", id: "w22m1", title: "LIGUE CADA RESPOSTA À QUESTION WORD QUE PROCURA ESSE TIPO DE INFORMAÇÃO.",
          left: [
            "My name is Adam.",
            "It’s 9:15.",
            "It’s on December 1st.",
            "She’s my friend, Karen.",
            "I’m from Brazil.",
            "Because it is delicious.",
            "I’m great, thanks.",
            "She’s 31 years old." ],
          right: ["Who", "How old", "Why", "What time", "What", "How", "When", "Where"],
          answer: [4, 3, 6, 0, 7, 2, 5, 1] },
        { t: "note", v: "cream", bar: true, kicker: "PENSE PRIMEIRO NA RESPOSTA:", text: "coisa • horário • data • pessoa • lugar • motivo • estado • idade" } ] },

      // ── página 08 (impressa 08) — VAMOS PRATICAR! ───────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 08" },
        { t: "title", en: "VAMOS PRATICAR!", pt: "Escolha a question word certa para cada resposta." },
        { t: "fill", id: "w22e1", title: "LEIA A RESPOSTA E JÁ PENSE:", sub: "que tipo de informação essa resposta traz?", items: [
          { pre: "1. It’s on July 20th. →", answers: ["When"], note: "ícone de calendário", v: "mint" },
          { pre: "2. At 7:30 p.m. →", answers: ["What time"], note: "ícone de relógio", v: "lilac" },
          { pre: "3. My brother, Lucas. →", answers: ["Who"], note: "ícone de pessoa", v: "cream" },
          { pre: "4. In the park. →", answers: ["Where"], note: "ícone de marcador de lugar", v: "mint" },
          { pre: "5. She’s 25 years old. →", answers: ["How old"], note: "ícone de bolo de aniversário", v: "lilac" },
          { pre: "6. Because I like it. →", answers: ["Why"], note: "ícone de joinha", v: "cream" },
          { pre: "7. By bus. →", answers: ["How"], note: "ícone de engrenagem", v: "mint" } ] },
        { t: "note", v: "cream", bar: true, kicker: "DICA RÁPIDA", text: "Pense sempre: coisa • horário • data • pessoa • lugar • idade • motivo • estado • maneira" },
        { t: "chips", title: "QUESTION WORDS PARA USAR", items: [
          { t: "Where", c: "purple" },
          { t: "When", c: "purple" },
          { t: "Who", c: "purple" },
          { t: "How old", c: "purple" },
          { t: "Why", c: "purple" },
          { t: "What", c: "purple" },
          { t: "What time", c: "purple" },
          { t: "How", c: "purple" } ] },
        { t: "image", id: "w22p8a", alt: "Menino pensativo com um balão de interrogação.",
          ph: "Ilustração: menino de cabelo castanho curto e moletom azul-marinho, visto do peito para cima, com a mão fechada apoiada no queixo e o olhar voltado para cima, em gesto de quem pensa. À esquerda da cabeça dele há um balão de fala branco com contorno azul-turquesa e um ponto de interrogação azul-turquesa dentro." },
        { t: "key", v: "lilac", text: "ÓTIMO! Você está aprendendo a identificar e escolher a question word certa." } ] },

      // ── página 09 (impressa 09) — YOUR TURN! ────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 09" },
        { t: "title", en: "YOUR TURN!", pt: "Preencha os espaços em branco com a question word adequada." },
        { t: "fill", id: "w22e2", items: [
          { pre: "6.", answers: ["Where"], post: "are your children?", note: "They’re at school right now.", v: "mint" },
          { pre: "7.", answers: ["What"], post: "is this?", note: "It’s my flash drive.", v: "lilac" },
          { pre: "8.", answers: ["Why"], post: "are you at home?", note: "Because I’m tired.", v: "mint" },
          { pre: "9.", answers: ["When"], post: "is Christmas Day?", note: "It’s on December 25th.", v: "lilac" },
          { pre: "10.", answers: ["Who"], post: "is your best friend?", note: "Luke is my best friend.", v: "mint" } ] } ] },

      // ── página 10 (impressa 10) — AGORA FAÇA A PERGUNTA + LET’S TALK! ───
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 10" },
        { t: "title", en: "AGORA FAÇA A PERGUNTA", pt: "Leia a resposta e escreva a pergunta correspondente." },
        { t: "free", id: "w22f1", items: [
          { n: "1", kicker: "My name is Adam.", prefix: "Question:", ideas: "", c: "teal", v: "mint" },
          { n: "2", kicker: "I’m from Brazil.", prefix: "Question:", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "She’s my friend, Karen.", prefix: "Question:", ideas: "", c: "teal", v: "mint" },
          { n: "4", kicker: "She’s 31 years old.", prefix: "Question:", ideas: "", c: "purple", v: "lilac" } ] },
        { t: "title", en: "LET’S TALK!", pt: "Faça uma mini-entrevista." },
        { t: "rows", items: [
          { text: "What’s your name?", c: "teal" },
          { text: "What’s your favorite kind of food?", c: "purple" },
          { text: "Where are you from?", c: "teal" },
          { text: "When’s your birthday?", c: "purple" },
          { text: "How are you?", c: "teal" },
          { text: "How old are you?", c: "purple" } ] },
        { t: "image", id: "w22p10a", alt: "Três amigos conversando à mesa de um restaurante.",
          ph: "Foto: recorte horizontal da mesma cena da página 05: três jovens sorrindo e conversando ao redor de uma mesa de madeira. À esquerda, um rapaz de cabelo escuro cacheado e jaqueta jeans gesticula; no centro, uma moça de suéter bege e cabelo castanho longo sorri de frente; à direita, de perfil, outra moça de jaqueta verde-militar gesticula com a mão aberta. A borda da pizza aparece cortada na parte de baixo do recorte." },
        { t: "note", v: "mint", bar: true, text: "Escolha 4 perguntas.\nPergunte e responda. Depois troque os papéis.\nVocê pode usar informações fictícias." } ] },

      // ── página 11 (impressa 11) — AULA CONCLUÍDA! ───────────────────────
      { blocks: [
        { t: "badge", label: "AULA 22", page: "PÁGINA 11" },
        { t: "title", en: "AULA CONCLUÍDA!", pt: "QUESTION WORDS" },
        { t: "check", id: "w22c1", title: "EU CONSIGO...", items: [
          "reconhecer What, What time, When, Who, Where, Why, How e How old;",
          "relacionar cada question word ao tipo de informação procurado;",
          "usar a resposta como pista para escolher a question word;",
          "completar perguntas simples;",
          "formular perguntas a partir de respostas;",
          "participar de uma mini-entrevista usando as perguntas desta aula." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 22", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Entrevista rápida: responda e formule perguntas usando diferentes question words.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 23 · SIMPLE PRESENT: I, YOU, WE, THEY" },
        { t: "bar", label: "PROGRESSO", value: "22 DE 42 AULAS", pct: "52%" } ] }
    ]
  },

  {
      id: 23, code: "AULA 23", title: "Simple Present: I, You, We, They", sub: "Fale sobre a sua rotina com I, you, we e they.",
      time: "18 minutos",
      pages: [
        { blocks: [
          { t: "badge", label: "AULA 23" },
          { t: "title", en: "SIMPLE PRESENT", pt: "I, YOU, WE, THEY" },
          { t: "note", v: "mint", bar: true, bold: true, text: "We use the Simple Present to talk about routine." },
          { t: "lead", text: "Usamos o Simple Present para falar de ações e hábitos que fazem parte da nossa rotina." },
          { t: "image", id: "w23p1a", alt: "Mulher se espreguiçando na cama ao acordar", ph: "Foto: mulher jovem de cabelo castanho ondulado sentada na cama ao acordar, de regata branca e calça de moletom cinza, com os dois braços esticados para cima e as mãos unidas, olhos fechados e sorriso no rosto. Edredom branco amassado à frente; à direita, janela com persiana e luz forte da manhã, vaso de planta, caneca verde-azulada e livros sobre a mesa de cabeceira." },
          { t: "sec", text: "EXAMPLES OF ROUTINE", c: "navy" },
          { t: "steps", items: [
            { tag: "wake up", c: "teal", v: "mint", id: "w23p1b", alt: "Mulher se espreguiçando ao acordar", ph: "Foto em recorte redondo: mulher de camiseta branca sentada na cama de lençóis claros, espreguiçando-se com os braços abertos e um sorriso, em quarto iluminado pela janela." },
            { tag: "have breakfast", c: "purple", v: "lilac", id: "w23p1c", alt: "Tigela de cereal com frutas e suco de laranja", ph: "Foto em recorte redondo: tigela branca de cereal com mirtilos e morangos sobre a mesa do café da manhã, com dois copos altos de suco de laranja ao lado." },
            { tag: "go to work / school", c: "teal", v: "mint", id: "w23p1d", alt: "Rapaz de mochila andando pela calçada", ph: "Foto em recorte redondo: rapaz de camiseta branca e mochila azul visto de costas, caminhando por uma calçada arborizada da cidade, com pessoas desfocadas ao fundo." },
            { tag: "have dinner", c: "purple", v: "lilac", id: "w23p1e", alt: "Prato de salmão com arroz e salada", ph: "Foto em recorte redondo: prato branco visto de cima com salmão grelhado, arroz e salada de folhas verdes com tomate." },
            { tag: "go to bed", c: "teal", v: "mint", id: "w23p1f", alt: "Mulher dormindo na cama", ph: "Foto em recorte redondo: mulher de camiseta branca dormindo de lado sobre o travesseiro branco, com os olhos fechados e o cabelo cacheado solto." } ] },
          { t: "sec", text: "NESTA AULA, VOCÊ VAI:", c: "purple" },
          { t: "grid", cols: 3, items: [
            { title: "aprender ações comuns da rotina;", v: "mint", c: "teal" },
            { title: "formar frases com I, you, we e they;", v: "lilac", c: "purple" },
            { title: "usar don’t para negar;", v: "mint", c: "teal" },
            { title: "usar do para fazer perguntas;", v: "lilac", c: "purple" },
            { title: "falar sobre sua própria rotina.", v: "cream", c: "yellow" } ] },
          { t: "image", id: "w23p1g", alt: "Dois estudantes escrevendo juntos à mesa", ph: "Foto: dois estudantes sorrindo um para o outro à mesa de estudo. À esquerda, rapaz de cabelo cacheado, jaqueta jeans e fone de ouvido branco no pescoço, escrevendo num caderno com caneta azul; à direita, moça de cabelo cacheado e camiseta listrada preta e branca, também escrevendo. Sobre a mesa, cadernos abertos, livros, um copo de café com tampa branca e um notebook prateado. Ao fundo, cozinha clara com prateleiras de madeira." } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 02" },
          { t: "title", en: "MORNING ROUTINE", pt: "Como o dia começa." },
          { t: "image", id: "w23p2a", alt: "Mulher se espreguiçando na cama diante da janela", ph: "Foto: mulher de regata branca e calça cinza sentada na cama, vista de costas, com os dois braços erguidos ao se espreguiçar diante da janela de cortina branca. Lençol verde-acinzentado amassado sobre a cama; ao fundo, mesa branca de trabalho e cadeira branca." },
          { t: "sec", text: "MORNING", c: "teal" },
          { t: "rows", items: [
            { text: "wake up / get up", c: "teal" },
            { text: "take a shower / take a bath", c: "purple" },
            { text: "have breakfast", c: "teal" },
            { text: "eat / drink", c: "purple" },
            { text: "get dressed", c: "teal" },
            { text: "brush your hair / comb your hair", c: "purple" },
            { text: "brush your teeth", c: "teal" } ] },
          { t: "cards", cols: 2, items: [
            { tag: "take a shower / take a bath", c: "teal", v: "mint", id: "w23p2b", alt: "Homem tomando banho de chuveiro", ph: "Foto: homem de barba por fazer debaixo do chuveiro, com o rosto virado para cima e os olhos fechados enquanto a água cai sobre ele, em box de azulejos brancos com ducha prateada." },
            { tag: "have breakfast", c: "purple", v: "lilac", id: "w23p2c", alt: "Mulher tomando café da manhã", ph: "Foto: mulher de cabelo castanho e regata branca sentada à mesa do café da manhã, segurando uma xícara branca em uma das mãos e uma cafeteira italiana de alumínio na outra. Sobre a mesa, copo de suco de laranja, croissants numa travessa e maçãs verdes; ao fundo, um monitor escuro." },
            { tag: "get dressed", c: "yellow", v: "cream", id: "w23p2d", alt: "Homem abotoando a camisa branca", ph: "Foto: homem careca de camisa social branca em pé sobre fundo cinza-claro, abotoando a camisa com as duas mãos e olhando para a câmera." } ] },
          { t: "sec", text: "WAKE UP × GET UP", c: "purple" },
          { t: "grid", cols: 2, items: [
            { title: "wake up", body: "→ acordar", v: "mint", c: "teal" },
            { title: "get up", body: "→ levantar-se", v: "lilac", c: "purple" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 03" },
          { t: "title", en: "DURING THE DAY", pt: "Estudo, trabalho e refeições." },
          { t: "image", id: "w23p3a", alt: "Cinco pessoas de roupa social caminhando em frente a um prédio", ph: "Foto: cinco pessoas de roupa social caminhando lado a lado pela calçada em frente a um prédio de escritórios de vidro. Da esquerda para a direita: mulher de blazer preto, homem de terno escuro e gravata, mulher de blusa branca e saia preta, homem de terno azul-royal e mulher de blazer branco e saia azul." },
          { t: "image", id: "w23p3b", alt: "Mesa de refeição em família com pratos sendo passados", ph: "Foto: mesa de refeição em família vista de perto, com toalha branca bordada em dourado. Duas mãos passam um prato com costeletas de cordeiro, arroz e salada. Ao redor, travessas com pão, omelete, tâmaras e saladas; ao fundo, pessoas sentadas à mesa, desfocadas." },
          { t: "chips", items: [
            { t: "go to work", c: "teal" },
            { t: "go to school", c: "purple" },
            { t: "have lunch", c: "teal" },
            { t: "have a snack", c: "purple" },
            { t: "do homework", c: "teal" },
            { t: "go back home", c: "purple" },
            { t: "go home", c: "teal" } ] },
          { t: "cards", cols: 2, items: [
            { tag: "GO HOME", c: "purple", v: "lilac", lines: ["go home", "go to my house", "go to my apartment"], id: "w23p3c", alt: "Casa moderna de dois andares", ph: "Foto: casa moderna de dois andares com fachada branca e detalhes de madeira clara, varanda com guarda-corpo preto, janelas grandes e céu azul com nuvens ao fundo." },
            { tag: "MEALS", c: "yellow", v: "cream", lines: ["have breakfast", "have lunch", "have dinner"] } ] },
          { t: "sec", text: "SEQUÊNCIA DO DIA", c: "teal" },
          { t: "steps", items: [
            { tag: "go to work / school", c: "teal", v: "mint" },
            { tag: "have lunch", c: "purple", v: "lilac" },
            { tag: "go back home", c: "yellow", v: "cream" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 04" },
          { t: "title", en: "FREE TIME & EVENING", pt: "Lazer e final do dia." },
          { t: "cards", cols: 2, items: [
            { tag: "go shopping", c: "teal", v: "mint", id: "w23p4a", alt: "Três amigas com sacolas diante de uma vitrine", ph: "Foto: três amigas com muitas sacolas de compras coloridas paradas diante de uma vitrine do shopping. A da direita, de blusa vermelha, aponta para alguma coisa na vitrine enquanto as outras duas, de vestido vermelho e blusa rosa, olham na mesma direção." },
            { tag: "go out with friends", c: "purple", v: "lilac", id: "w23p4b", alt: "Três amigos abraçados à noite na rua", ph: "Foto: três amigos jovens abraçados à noite, ao ar livre, com as luzes da cidade desfocadas e um guarda-corpo de metal ao fundo. À esquerda, moça asiática de cabelo escuro comprido, casaco claro e cachecol xadrez; no meio, rapaz negro de cabelo black power volumoso, casaco preto sobre camisa amarela; à direita, moça branca sardenta de cabelo louro-avermelhado bem cacheado, jaqueta jeans sobre casaco marrom, sorrindo para a câmera." },
            { tag: "watch TV", c: "teal", v: "mint", id: "w23p4c", alt: "Família e amigos assistindo a um jogo na TV", ph: "Foto: família e amigos reunidos no sofá cinza da sala assistindo a um jogo de futebol americano na televisão. Alguns comemoram com os braços erguidos; há copos de bebida e petiscos na mesinha de centro, uma planta grande no canto e janelas com parede de tijolos ao fundo." },
            { tag: "go to bed / sleep", c: "purple", v: "lilac", id: "w23p4d", alt: "Mulher dormindo à noite", ph: "Foto: mulher dormindo de lado na cama à noite, com o rosto apoiado no travesseiro e o edredom estampado de espirais puxado até o ombro, sob luz azulada do abajur." } ] },
          { t: "chips", items: [
            { t: "go biking", c: "teal" },
            { t: "walk the dog", c: "purple" },
            { t: "see a movie", c: "teal" },
            { t: "have dinner", c: "purple" } ] },
          { t: "sec", text: "GO SHOPPING × GO TO THE SHOPPING MALL", c: "yellow" },
          { t: "grid", cols: 2, items: [
            { title: "GO SHOPPING", body: "atividade:\nfazer compras.", v: "lilac", c: "purple" },
            { title: "GO TO THE SHOPPING MALL", body: "deslocamento:\nir ao shopping.", v: "mint", c: "teal" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 05" },
          { t: "title", en: "SIMPLE PRESENT: AFFIRMATIVE", pt: "Frases afirmativas com I, you, we e they." },
          { t: "sec", text: "SUBJECT + VERB + COMPLEMENT", c: "navy" },
          { t: "chips", items: [
            { t: "I live", c: "teal" },
            { t: "You live", c: "purple" },
            { t: "We live", c: "teal" },
            { t: "They live", c: "purple" } ] },
          { t: "image", id: "w23p5a", alt: "Estátua da Liberdade sobre fundo preto", ph: "Foto: Estátua da Liberdade vista de perto, do busto para cima, com a coroa de pontas e o braço erguido segurando a tocha, recortada sobre fundo preto." },
          { t: "image", id: "w23p5b", alt: "Estudantes entrando no ônibus escolar", ph: "Foto: fila de estudantes com mochilas coloridas entrando em um ônibus escolar amarelo parado na rua, vista de trás, com árvores e placa de trânsito ao fundo." },
          { t: "image", id: "w23p5c", alt: "Família de braços abertos diante da casa nova", ph: "Foto: casal com uma criança visto de costas, de braços abertos diante de uma casa bege de dois andares. O homem usa camisa azul-clara; a mulher, vestido listrado e chapéu de palha; a menina está entre os dois." },
          { t: "rows", items: [
            { text: "I live in New York.", c: "teal" },
            { text: "They take the bus in the morning.", c: "purple" },
            { text: "I like when we have lunch together.", c: "teal" },
            { text: "My friends and I study in the afternoon.", c: "purple" },
            { text: "They have a new house.", c: "teal" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 06" },
          { t: "title", en: "SIMPLE PRESENT: NEGATIVE", pt: "Frases negativas com don’t." },
          { t: "note", v: "lilac", kicker: "DO NOT = DON’T", bold: true, text: "SUBJECT + DON’T + VERB" },
          { t: "cards", cols: 2, items: [
            { tag: "1", c: "purple", v: "lilac", lines: ["I don’t live in New York."], id: "w23p6a", alt: "Estátua da Liberdade sobre fundo preto", ph: "Foto: Estátua da Liberdade vista de perto, do busto para cima, com a coroa de pontas e o braço erguido segurando a tocha, recortada sobre fundo preto." },
            { tag: "2", c: "purple", v: "lilac", lines: ["I don’t like shopping."], id: "w23p6b", alt: "Mulher desanimada segurando sacolas de compras", ph: "Foto: mulher de cabelo cacheado castanho, camisa listrada clara e brincos vermelhos, com expressão de desânimo, segurando várias sacolas de compras coloridas nas duas mãos, sobre fundo rosa-magenta." },
            { tag: "3", c: "purple", v: "lilac", lines: ["We don’t work in an office."], id: "w23p6c", alt: "Três trabalhadores de capacete e colete refletivo", ph: "Foto: três trabalhadores de capacete (branco e amarelos), colete refletivo e máscara no rosto, de braços cruzados, em pé diante de um campo de painéis solares sob céu azul com nuvens." } ] },
          { t: "sec", text: "COMPARE", c: "teal" },
          { t: "grid", cols: 2, items: [
            { title: "I live in New York.", body: "→ afirmativa", v: "mint", c: "teal" },
            { title: "I don’t live in New York.", body: "→ negativa", v: "lilac", c: "purple" } ] },
          { t: "note", v: "cream", bar: true, text: "Don’t entra antes do verbo para formar a negativa com I, you, we e they." } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 07" },
          { t: "title", en: "DO YOU…?", pt: "Agora vamos transformar afirmações em perguntas." },
          { t: "note", v: "mint", kicker: "DO + SUBJECT + VERB + ?", bold: true, text: "You live in New York. → Do you live in New York?" },
          { t: "cards", items: [
            { tag: "1", c: "purple", v: "gray", lines: ["Do they have a child?"], note: "Yes, they do.   No, they don’t.", id: "w23p7a", alt: "Casal com uma menina no colo em um parque", ph: "Foto: família negra sorrindo ao ar livre em um parque gramado, com árvores verdes ao fundo. A mulher tem cabelo cacheado volumoso e usa jaqueta jeans azul-clara sobre camiseta amarela; o homem, de barba curta, usa camisa cinza aberta sobre camiseta branca e carrega no colo uma menina pequena de cabelo cacheado, com vestido rosa-claro de babados." },
            { tag: "2", c: "teal", v: "gray", lines: ["Do you like salad?"], note: "Yes, I do.   No, I don’t.", id: "w23p7b", alt: "Mulher segurando uma tigela de salada", ph: "Foto: mulher sorridente de blusa clara segurando com as duas mãos uma tigela branca de salada de folhas verdes, pepino e tomate, em uma cozinha de parede rosa desfocada." },
            { tag: "3", c: "purple", v: "gray", lines: ["Do you take photos every day?"], note: "Yes, I do.   No, I don’t.", id: "w23p7c", alt: "Fotógrafo com a câmera diante do rosto", ph: "Foto: fotógrafo de blusa preta segurando uma câmera fotográfica grande diante do rosto, com a lente apontada para a câmera, sobre fundo escuro." } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 08" },
          { t: "title", en: "QUESTION WORDS + DO", pt: "Agora a Aula 22 entra em ação." },
          { t: "chips", items: [
            { t: "QUESTION WORD", c: "purple" },
            { t: "DO", c: "teal" },
            { t: "SUBJECT", c: "navy" },
            { t: "VERB", c: "teal" },
            { t: "?", c: "purple" } ] },
          { t: "cards", items: [
            { tag: "1", c: "teal", v: "gray", lines: ["When do you study English?"], note: "I study English on Mondays.", id: "w23p8a", alt: "Professora apontando com uma bandeira dos Estados Unidos na mão", ph: "Foto: mulher loira de óculos redondos e batom vermelho, cabelo preso, sentada à mesa de madeira entre duas pilhas de livros, com um caderno aberto à frente. Usa blazer marrom-camelo sobre blusa bege, aponta para a frente com o dedo indicador e segura uma bandeirinha dos Estados Unidos na outra mão, sobre fundo amarelo." },
            { tag: "2", c: "purple", v: "gray", lines: ["Where do you live?"], note: "I live in Egypt.", id: "w23p8b", alt: "Vista aérea do Cairo com o rio Nilo", ph: "Foto: vista aérea do Cairo, com o rio Nilo atravessando a cidade, uma ponte, prédios modernos altos e mesquitas de cúpula clara, sob céu azul com nuvens brancas." },
            { tag: "3", c: "teal", v: "gray", lines: ["What time do you get up?"], note: "I get up at 6:00.", id: "w23p8c", alt: "Despertador vermelho e mulher esticando o braço para desligá-lo", ph: "Foto: despertador vermelho de dois sinos em primeiro plano sobre a cama e, ao fundo desfocado, mulher deitada de lado esticando o braço para desligá-lo, em quarto claro." } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 09" },
          { t: "title", en: "LET’S TALK ABOUT ROUTINE", pt: "Lucas e Emma conversam sobre a rotina." },
          { t: "image", id: "w23p9", alt: "Casal brindando com taças de vinho no jantar", ph: "Foto: casal jantando em um restaurante à noite, brindando com taças de vinho tinto por cima da mesa. Ele, de barba castanha e camisa estampada em tons de vinho; ela, de vestido preto e cabelo castanho escuro liso. Sobre a mesa branca, pratos de massa, uma garrafa de vinho, velas e flores; ao fundo, cortina amarela e janelas escuras." },
          { t: "dialogue", items: [
            { s: "a", text: "Lucas: What time do you get up?" },
            { s: "b", text: "Emma: I get up at 7:00. I have breakfast and go to work." },
            { s: "a", text: "Lucas: Do you have lunch at work?" },
            { s: "b", text: "Emma: Yes, I do. My friends and I have lunch together." },
            { s: "a", text: "Lucas: Do you go out with friends?" },
            { s: "b", text: "Emma: No, I don’t. I go home and watch TV." } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 10" },
          { t: "title", en: "MY DAILY ROUTINE", pt: "Escreva a sua rotina e pergunte a rotina de alguém." },
          { t: "sec", text: "PARTE 1: MINI-DIÁRIO", c: "purple" },
          { t: "free", id: "w23f1", items: [
            { n: "1", kicker: "MINI-DIÁRIO", prefix: "I get up at ______.", ideas: "", v: "lilac", c: "purple" },
            { n: "2", kicker: "MINI-DIÁRIO", prefix: "I have breakfast at ______.", ideas: "", v: "lilac", c: "purple" },
            { n: "3", kicker: "FRASE LIVRE", prefix: "I ______________________.", ideas: "", v: "mint", c: "teal" },
            { n: "4", kicker: "MINI-DIÁRIO", prefix: "I have lunch at ______.", ideas: "", v: "lilac", c: "purple" },
            { n: "5", kicker: "FRASE LIVRE", prefix: "I ______________________.", ideas: "", v: "mint", c: "teal" },
            { n: "6", kicker: "MINI-DIÁRIO", prefix: "I go to bed at ______.", ideas: "", v: "lilac", c: "purple" } ] },
          { t: "sec", text: "PARTE 2: ASK A PARTNER", c: "teal" },
          { t: "rows", items: [
            { text: "What time do you get up?", c: "teal" },
            { text: "Do you have breakfast?", c: "purple" },
            { text: "Do you have lunch at home?", c: "teal" },
            { text: "Do you watch TV?", c: "purple" },
            { text: "Do you go out with friends?", c: "teal" } ] },
          { t: "image", id: "w23p10", alt: "Três amigos abraçados à noite na rua", ph: "Foto: três amigos jovens abraçados à noite, ao ar livre, com as luzes da cidade desfocadas e um guarda-corpo de metal ao fundo. À esquerda, moça asiática de cabelo escuro comprido, casaco claro e cachecol xadrez; no meio, rapaz negro de cabelo black power volumoso, casaco preto sobre camisa amarela; à direita, moça branca sardenta de cabelo louro-avermelhado bem cacheado, jaqueta jeans sobre casaco marrom, sorrindo para a câmera." },
          { t: "note", v: "mint", text: "Você pode usar informações fictícias." } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 11" },
          { t: "title", en: "YOUR TURN!", pt: "Complete as frases com a forma correta do verbo." },
          { t: "fill", id: "w23e1", title: "1 A 4 · COMPLETE COM A FORMA CORRETA DO VERBO", items: [
            { pre: "1. I", answers: ["don’t write", "do not write"], post: "letters. (not / write)", v: "lilac" },
            { pre: "2. My parents", answers: ["like"], post: "meat. (like)", v: "mint" },
            { pre: "3.", answers: ["Do you have", "do you have"], post: "any siblings? (have)", v: "lilac" },
            { pre: "4. My friends", answers: ["don’t ride", "do not ride"], post: "motorcycles. (not / ride)", v: "mint" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 12" },
          { t: "title", en: "YOUR TURN!", pt: "Complete as frases com a forma correta do verbo." },
          { t: "fill", id: "w23e2", title: "5 A 8 · COMPLETE COM A FORMA CORRETA DO VERBO", items: [
            { pre: "5. My friend and I", answers: ["want"], post: "to be dancers. (want)", v: "lilac" },
            { pre: "6. I", answers: ["make"], post: "delicious cakes. (make)", v: "mint" },
            { pre: "7.", answers: ["Do they live", "do they live"], post: "in Austria? (live)", v: "lilac" },
            { pre: "8. My children", answers: ["don’t eat", "do not eat"], post: "vegetables. (not / eat)", v: "mint" } ] } ] },

        { blocks: [
          { t: "badge", label: "AULA 23", page: "PÁGINA 13" },
          { t: "title", en: "SIMPLE PRESENT", pt: "I, YOU, WE, THEY" },
          { t: "check", id: "w23c1", title: "EU CONSIGO...", items: [
            "reconhecer ações comuns de rotina;",
            "formar frases afirmativas com I, you, we e they;",
            "usar don’t em frases negativas;",
            "usar do para formular perguntas;",
            "responder perguntas com do/don’t;",
            "combinar Question Words com do;",
            "falar e escrever um pouco sobre minha rotina." ] },
          { t: "cta", items: [
            { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 23", body: "Simple Present: I, You, We, They.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
            { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "My routine conversation: converse sobre sua rotina usando afirmações, negativas e perguntas com do/don’t.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
          { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 24 · JOBS" },
          { t: "bar", label: "PROGRESSO", value: "23 DE 42 AULAS", pct: "55%" } ] }
      ]
    },

  {
    id: 24, code: "AULA 24", title: "Jobs", sub: "Fale sobre ocupações e profissões.",
    time: "16 minutos",
    pages: [
      // ── PÁGINA 01 (impressa 01) — capa ──────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 24" },
        { t: "title", en: "JOBS", pt: "Talking about occupations." },
        { t: "image", id: "w24p1a", alt: "Professora sorrindo em uma sala de aula com crianças ao fundo",
          ph: "Foto: professora de pele morena, cabelo preso, camisa vermelha e cardigã bege tricotado, de braços cruzados e relógio preto no pulso, sorrindo para a câmera. Ao fundo, uma sala de aula com lousa branca interativa, mapa na parede e crianças sentadas em mesas coloridas desenhando." },
        { t: "image", id: "w24p1b", alt: "Um médico e uma médica de jaleco branco sorrindo",
          ph: "Foto: em primeiro plano e em foco, um médico jovem de barba curta castanha, jaleco branco por cima de um pijama cirúrgico azul-claro e estetoscópio preto no pescoço, sorrindo para a câmera. Atrás dele, à esquerda e desfocada, uma médica de cabelo claro preso, também de jaleco branco sobre pijama azul e estetoscópio no pescoço. Ao fundo, prateleiras e armários desfocados de consultório." },
        { t: "image", id: "w24p1c", alt: "Mão de um contador apertando as teclas de uma calculadora",
          ph: "Foto: em close, a mão esquerda de uma pessoa de camisa branca aperta as teclas de uma calculadora branca e cinza (com uma tecla rosa) sobre uma mesa de madeira clara. A mão direita da mesma pessoa está no teclado de um notebook prateado, ao fundo. Em volta, planilhas e gráficos impressos em azul e branco e uma caneta grafite de clipe prateado sobre uma das folhas." },
        { t: "image", id: "w24p1d", alt: "Padeiro de uniforme branco segurando um saco de pães",
          ph: "Foto: padeiro sorridente de uniforme branco de chef e chapéu alto de cozinheiro segurando com um braço um saco de papel pardo cheio de pães e baguetes, e fazendo sinal de positivo com a outra mão. Ao fundo, uma parede de tijolos à vista, a bancada da padaria com mais pães e um rolo de massa." },
        { t: "note", v: "lilac", kicker: "What do you do?", bold: true, text: "I teach. I’m a teacher." },
        { t: "check", id: "w24c1", title: "NESTA AULA, VOCÊ VAI:", items: [
          "conhecer diferentes ocupações;",
          "perguntar sobre o trabalho de alguém;",
          "responder qual é sua ocupação;",
          "compreender pequenas descrições profissionais;",
          "praticar uma conversa simples sobre Jobs." ] } ] },

      // ── PÁGINA 02 (impressa 02) — people & professions ──────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 02" },
        { t: "title", en: "PEOPLE & PROFESSIONS", pt: "Education, office and health." },
        { t: "sec", text: "EDUCATION" },
        { t: "cards", cols: 2, items: [
          { tag: "teacher", c: "teal", v: "mint", id: "w24p2a", alt: "Professora sorrindo na sala de aula",
            ph: "Foto: professora de camisa vermelha e cardigã bege, de braços cruzados, sorrindo em uma sala de aula com lousa branca e crianças sentadas em mesas coloridas ao fundo.",
            lines: ["I’m a teacher."] },
          { tag: "student", c: "purple", v: "lilac", id: "w24p2b", alt: "Estudante sorrindo segurando um caderno na rua",
            ph: "Foto: jovem estudante de cabelo preto comprido, blusa estampada em azul, preto e amarelo e mochila branca no ombro, sorrindo enquanto segura um caderno aberto. Ao fundo, a fachada bege de um prédio antigo.",
            lines: ["I’m a student."] } ] },
        { t: "sec", text: "OFFICE", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "manager", c: "purple", v: "lilac", id: "w24p2c", alt: "Ícone de maleta de trabalho",
            ph: "Ilustração: ícone de maleta de trabalho desenhada em traço roxo fino, com alça retangular no topo, centralizada sobre um fundo lilás claro." },
          { tag: "accountant", c: "teal", v: "mint", id: "w24p2d", alt: "Mão de um contador apertando as teclas de uma calculadora",
            ph: "Foto: mão de pessoa de camisa branca apertando as teclas de uma calculadora branca e cinza sobre uma mesa de madeira clara, ao lado de planilhas com gráficos em azul, uma caneta grafite de clipe prateado e um notebook prateado aberto.",
            lines: ["I’m an accountant."] } ] },
        { t: "sec", text: "HEALTH & SCIENCE" },
        { t: "cards", cols: 2, items: [
          { tag: "doctor", c: "teal", v: "mint", id: "w24p2e", alt: "Médico e médica de jaleco branco sorrindo",
            ph: "Foto: em primeiro plano, um médico jovem de barba curta castanha, jaleco branco sobre pijama cirúrgico azul-claro e estetoscópio preto no pescoço, sorrindo. Atrás, desfocada, uma médica de cabelo claro preso, também de jaleco branco; ao fundo, prateleiras desfocadas de consultório.",
            lines: ["I’m a doctor."] },
          { tag: "dentist", c: "purple", v: "lilac", id: "w24p2f", alt: "Dentista atendendo uma paciente na cadeira",
            ph: "Foto: dentista de jaleco branco, máscara e luvas, inclinada sobre uma paciente deitada na cadeira odontológica. A paciente, de cabelo escuro, está de boca aberta enquanto a dentista trabalha com os instrumentos.",
            lines: ["I’m a dentist."] },
          { tag: "scientist", c: "teal", v: "mint", id: "w24p2g", alt: "Cientista pipetando líquido em um tubo de ensaio",
            ph: "Foto: cientista de jaleco branco, óculos de proteção transparentes, touca e luvas azuis, pingando líquido com uma pipeta em um tubo de ensaio. Ao fundo, a bancada do laboratório com frascos desfocados.",
            lines: ["I’m a scientist."] } ] } ] },

      // ── PÁGINA 03 (impressa 03) — creative & media jobs ─────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 03" },
        { t: "title", en: "CREATIVE & MEDIA JOBS", pt: "Creative work and communication." },
        { t: "cards", items: [
          { tag: "explorer", c: "teal", v: "mint", id: "w24p3a", alt: "Explorador com mochila diante de um vale de montanhas",
            ph: "Foto: explorador de casaco vermelho e mochila grande de pé sobre uma rocha, de costas para a câmera, olhando um vale de montanhas escuras cortado por um rio, sob um céu carregado de nuvens.",
            lines: ["I’m an explorer."] },
          { tag: "artist", c: "purple", v: "lilac", id: "w24p3b", alt: "Artista segurando uma tela com pintura colorida",
            ph: "Foto sobre fundo branco: homem de cabelo escuro cacheado, barba, óculos redondos de armação preta, boina preta e blusa preta de gola alta, sorrindo de lado e segurando na altura do peito, com as duas mãos, uma placa branca com pinceladas coloridas em azul-claro, turquesa, rosa e magenta.",
            lines: ["I paint. I’m an artist."] },
          { tag: "photographer", c: "teal", v: "mint", id: "w24p3c", alt: "Fotógrafo com câmera no tripé entre um guarda-chuva e um rebatedor",
            ph: "Foto sobre fundo branco: homem jovem de barba escura e camisa xadrez vermelha e azul-marinho, curvado com o olho na câmera fotográfica profissional preta montada em um tripé prateado. Atrás dele, à esquerda, um guarda-chuva difusor preto aberto; à direita, uma softbox branca de estúdio no pedestal.",
            lines: ["I take pictures of people, places and events. I’m a photographer."] },
          { tag: "filmmaker", c: "purple", v: "lilac", id: "w24p3d", alt: "Cineasta segurando uma claquete de cinema",
            ph: "Foto sobre fundo vermelho: jovem mulher de cabelo castanho comprido, suéter felpudo amarelo e calça amarela, de olhos fechados e boca aberta comemorando. Ela segura uma claquete de cinema preta e branca com o braço estendido para a esquerda de quem vê e fecha a outra mão em punho, com um relógio no pulso.",
            lines: ["I make films. I’m a filmmaker."] },
          { tag: "writer", c: "teal", v: "mint", id: "w24p3e", alt: "Escritor diante de uma máquina de escrever antiga",
            ph: "Foto em tom sépia: homem jovem de óculos, camisa branca, suspensórios azuis e gravata-borboleta azul, com um cachimbo na boca, sentado à mesa diante de uma máquina de escrever antiga azul-escura com uma folha de papel presa. A fumaça do cachimbo sobe e se espalha à esquerda; fundo bege esfumaçado.",
            lines: ["I write books. I’m a writer."] } ] } ] },

      // ── PÁGINA 04 (impressa 04) — service, travel & technical ───────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 04" },
        { t: "title", en: "SERVICE, TRAVEL &", pt: "TECHNICAL JOBS" },
        { t: "cards", items: [
          { tag: "waiter / waitress / server", c: "teal", v: "mint", id: "w24p4a", alt: "Garçom e garçonete de uniforme, de braços cruzados",
            ph: "Foto: um garçom e uma garçonete lado a lado, os dois de camisa branca, colete preto e gravata-borboleta preta, de braços cruzados e sorrindo. Ao fundo, o salão desfocado de um restaurante.",
            lines: ["waiter", "waitress", "server"] } ] },
        { t: "cards", cols: 2, items: [
          { tag: "baker", c: "teal", v: "mint", id: "w24p4b", alt: "Padeiro segurando um saco de pães",
            ph: "Foto: padeiro sorridente de uniforme branco e chapéu de cozinheiro, segurando um saco de papel pardo cheio de pães e baguetes e fazendo sinal de positivo. Ao fundo, parede de tijolos à vista.",
            lines: ["I work in a bakery. I’m a baker."] },
          { tag: "sailor", c: "purple", v: "lilac", id: "w24p4c", alt: "Marinheiro de barba grisalha e camiseta listrada segurando um cachimbo",
            ph: "Foto sobre fundo preto: homem de barba e bigode grisalhos, quepe branco de capitão com faixa preta, camiseta de listras azuis e brancas e casaco verde-oliva, segurando um cachimbo escuro junto à boca com a mão direita.",
            lines: ["I sail a ship. I’m a sailor."] },
          { tag: "pilot", c: "teal", v: "mint", id: "w24p4d", alt: "Farda azul-marinho de piloto com asas douradas",
            ph: "Foto: detalhe do uniforme de um piloto: paletó azul-marinho de botões dourados em fila dupla, com o distintivo de asas douradas preso acima do bolso. Ao fundo, o céu azul desfocado.",
            lines: ["I fly an airplane. I’m a pilot."] },
          { tag: "driver", c: "purple", v: "lilac", id: "w24p4e", alt: "Motorista ao lado de um caminhão vermelho com carreta azul",
            ph: "Foto: caminhoneiro de camisa xadrez vermelha e calça jeans de pé ao lado de um caminhão vermelho com carreta baú azul, em um pátio aberto sob céu claro.",
            lines: ["I drive a truck. I’m a driver."] },
          { tag: "engineer", c: "teal", v: "mint", id: "w24p4f", alt: "Engenheira de capacete branco e colete segurando um tablet",
            ph: "Foto: engenheira de óculos, capacete branco de obra, camisa quadriculada e colete laranja refletivo, sorrindo enquanto segura um tablet. Ao fundo, a estrutura de concreto de uma construção.",
            lines: ["I plan, design and build buildings. I’m an engineer."] },
          { tag: "UNEMPLOYED", c: "yellow", v: "cream", id: "w24p4g", alt: "Homem sentado em uma escada lendo o jornal",
            ph: "Foto: homem de camisa xadrez e calça jeans sentado em uma escadaria de concreto, lendo um jornal aberto, com um copo descartável de café ao lado no degrau.",
            lines: ["I’m not working right now."], note: "unemployed → sem trabalho no momento" } ] },
        { t: "note", v: "lilac", bold: true, text: "Todas essas palavras descrevem ocupações ou uma situação profissional." } ] },

      // ── PÁGINA 05 (impressa 05) — what do you do? ───────────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 05" },
        { t: "title", en: "WHAT DO YOU DO?", pt: "Two ways to ask about someone’s occupation." },
        { t: "grid", cols: 2, items: [
          { title: "What do you do?", v: "mint", c: "teal" },
          { title: "What’s your job?", v: "lilac", c: "purple" } ] },
        { t: "lead", text: "Ambas podem perguntar sobre a ocupação de alguém." },
        { t: "sec", text: "RESPOSTAS-MODELO" },
        { t: "cards", cols: 2, items: [
          { tag: "I’m a teacher.", c: "teal", v: "mint", id: "w24p5a", alt: "Professora sorrindo na sala de aula",
            ph: "Foto: professora de camisa vermelha e cardigã bege, de braços cruzados, sorrindo em uma sala de aula com lousa branca ao fundo." },
          { tag: "I’m an accountant.", c: "purple", v: "lilac", id: "w24p5b", alt: "Mão apertando as teclas de uma calculadora",
            ph: "Foto em recorte vertical: mão de pessoa de camisa branca apertando as teclas de uma calculadora branca e cinza sobre a mesa de madeira clara, ao lado de planilhas com gráficos em azul e de um notebook prateado aberto." },
          { tag: "I’m an engineer.", c: "teal", v: "mint", id: "w24p5c", alt: "Engenheira de capacete branco segurando um tablet",
            ph: "Foto: engenheira de óculos, capacete branco de obra e colete laranja refletivo, sorrindo com um tablet nas mãos, diante da estrutura de concreto de uma construção." },
          { tag: "I’m an artist.", c: "purple", v: "lilac", id: "w24p5d", alt: "Mão segurando uma tela com pintura colorida",
            ph: "Foto sobre fundo branco, em recorte vertical bem fechado (a mesma foto do artista da página 03, aqui cortada acima do rosto): vê-se a boina preta no alto, a blusa preta e a mão direita segurando na altura do peito uma placa branca com pinceladas coloridas em turquesa, azul-claro, rosa e magenta." } ] },
        { t: "chips", items: [
          { t: "a teacher", c: "teal" },
          { t: "an accountant", c: "purple" },
          { t: "an engineer", c: "teal" },
          { t: "an artist", c: "purple" } ] } ] },

      // ── PÁGINA 06 (impressa 06) — from action to job ────────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 06" },
        { t: "title", en: "FROM ACTION TO JOB", pt: "A descrição pode revelar a profissão." },
        { t: "match", id: "w24match1", title: "ASSOCIE CADA DESCRIÇÃO À PROFISSÃO CORRETA",
          left: [
            "I teach.",
            "I take pictures of people, places and events.",
            "I make films.",
            "I write books.",
            "I drive a truck." ],
          right: ["photographer", "driver", "teacher", "writer", "filmmaker"],
          answer: [2, 0, 4, 3, 1] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Pense na ação antes de escolher a profissão." } ] },

      // ── PÁGINA 07 (impressa 07) — let’s talk about jobs ─────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 07" },
        { t: "title", en: "LET’S TALK ABOUT JOBS", pt: "Leo e Mia conversam sobre trabalho." },
        { t: "cards", cols: 2, items: [
          { tag: "LEO", c: "purple", v: "lilac", id: "w24p7a", alt: "Leo, padeiro de uniforme branco, segurando um saco de pães",
            ph: "Foto com a etiqueta roxa escrita LEO no canto superior esquerdo, por cima da imagem: padeiro sorridente de barba e bigode castanhos curtos, uniforme branco de chef e chapéu alto de cozinheiro, segurando com o braço esquerdo um saco de papel pardo cheio de pães e baguetes e fazendo sinal de positivo com a mão direita. Ao fundo, parede de tijolos à vista, janelas de esquadria escura e a bancada da padaria com mais pães e um rolo de massa." },
          { tag: "MIA", c: "teal", v: "mint", id: "w24p7b", alt: "Fotógrafo de camisa xadrez vermelha com o olho na câmera montada em tripé",
            ph: "Foto sobre fundo branco, com a etiqueta verde-azulada escrita MIA no canto superior esquerdo, por cima da imagem: homem jovem de barba escura e camisa xadrez vermelha e azul-marinho, curvado com o olho na câmera fotográfica profissional preta montada em um tripé prateado. Atrás dele, à esquerda, um guarda-chuva difusor preto aberto; à direita, uma softbox branca de estúdio no pedestal. Atenção: a arte da página traz este homem barbudo sob a etiqueta MIA, a mesma foto do fotógrafo da página 03." } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Mia: What do you do?" },
          { s: "b", text: "Leo: I work in a bakery. I’m a baker." },
          { s: "a", text: "Mia: Are you a manager?" },
          { s: "b", text: "Leo: No, I’m not. I’m a baker." },
          { s: "b", text: "Leo: What do you do?" },
          { s: "a", text: "Mia: I take pictures of people, places and events. I’m a photographer." },
          { s: "b", text: "Leo: Are you a filmmaker?" },
          { s: "a", text: "Mia: No, I’m not. I’m a photographer." } ] } ] },

      // ── PÁGINA 08 (impressa 08) — which job is it? ──────────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 08" },
        { t: "title", en: "WHICH JOB IS IT?", pt: "Leia a descrição e escolha a profissão correta." },
        { t: "mc", id: "w24mc1", title: "LEIA A DESCRIÇÃO E ESCOLHA A PROFISSÃO CORRETA", v: "gray", questions: [
          { q: "1. I teach.", options: ["teacher", "dentist", "pilot"], answer: 0 },
          { q: "2. I make films.", options: ["photographer", "filmmaker", "writer"], answer: 1 },
          { q: "3. I drive a truck.", options: ["driver", "sailor", "engineer"], answer: 0 },
          { q: "4. I work in a bakery.", options: ["baker", "manager", "scientist"], answer: 0 },
          { q: "5. I take pictures of people, places and events.", options: ["photographer", "artist", "explorer"], answer: 0 } ] } ] },

      // ── PÁGINA 09 (impressa 09) — your turn! ────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 09" },
        { t: "title", en: "YOUR TURN!", pt: "Agora é a sua vez!" },
        { t: "sec", text: "PARTE 1: CHOOSE A JOB" },
        { t: "lead", text: "Escolha uma ocupação da aula." },
        { t: "image", id: "w24p9a", alt: "Estudante sorrindo segurando um caderno na rua",
          ph: "Foto: jovem de cabelo preto comprido, blusa estampada em azul, preto e amarelo e mochila branca no ombro, sorrindo enquanto segura um caderno aberto. Ao fundo, a fachada bege de um prédio antigo com sacada." },
        { t: "sec", text: "PARTE 2: ASK", c: "purple" },
        { t: "grid", cols: 1, items: [
          { title: "What do you do?", v: "lilac", c: "purple" },
          { title: "What’s your job?", v: "lilac", c: "purple" },
          { title: "Are you a/an ________?", v: "lilac", c: "purple" } ] },
        { t: "sec", text: "PARTE 3: ANSWER" },
        { t: "grid", cols: 1, items: [
          { title: "I’m a/an ________.", v: "mint", c: "teal" },
          { title: "Yes, I am.", v: "mint", c: "teal" },
          { title: "No, I’m not. I’m a/an ________.", v: "mint", c: "teal" } ] },
        { t: "image", id: "w24p9b", alt: "Mão apertando as teclas de uma calculadora ao lado de um notebook",
          ph: "Foto (a mesma da página 01, em recorte mais largo): a mão de uma pessoa de camisa branca aperta as teclas de uma calculadora branca e cinza, com uma tecla rosa, sobre a mesa de madeira clara; a outra mão está no teclado do notebook prateado, no alto à direita. Em volta, planilhas impressas com gráficos de barras em azul e uma caneta grafite de clipe prateado deitada sobre uma das folhas." },
        { t: "note", v: "mint", kicker: "AÇÕES DE APOIO", text: "I teach.\nI make films.\nI write books.\nI drive a truck." },
        { t: "note", v: "cream", bar: true, bold: true, text: "Você pode usar informações fictícias." } ] },

      // ── PÁGINA 10 (impressa 10) — fechamento ────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 24", page: "PÁGINA 10" },
        { t: "title", en: "JOBS", pt: "Você já sabe falar sobre ocupações." },
        { t: "check", id: "w24c2", title: "EU CONSIGO...", items: [
          "reconhecer diferentes profissões;",
          "perguntar What do you do?;",
          "perguntar What’s your job?;",
          "responder com I’m a/an...;",
          "compreender descrições simples de profissões;",
          "usar Are you a/an...?;",
          "falar brevemente sobre uma ocupação fictícia." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "VIDEOAULA 24 · JOBS", body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "JOB INTERVIEW · Pratique perguntas e respostas sobre ocupações usando as estruturas desta aula.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "bar", label: "PROGRESSO", value: "24 DE 42 AULAS", pct: "57%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 25 · SIMPLE PRESENT: HE, SHE, IT" } ] }
    ]
  },

  {
    id: 25,
    code: "AULA 25",
    title: "Simple Present: He, She, It",
    sub: "Como o verbo muda quando falamos de he, she e it.",
    time: "18 minutos",
    pages: [
      // ── PÁGINA 01 (impressa 01) · SIMPLE PRESENT — HE, SHE, IT ──────────────
      { blocks: [
        { t: "badge", label: "AULA 25" },
        { t: "title", en: "SIMPLE PRESENT", pt: "HE, SHE, IT" },
        { t: "cards", cols: 2, items: [
          { tag: "HE", c: "teal", v: "mint", id: "w25p1a",
            alt: "Policial acenando",
            ph: "Foto: homem jovem de barba curta e cabelo escuro, com uniforme de policial azul-claro, gravata preta e cinto tático, acenando com a mão direita aberta, de corpo até a cintura, sobre fundo preto." },
          { tag: "SHE", c: "purple", v: "lilac", id: "w25p1b",
            alt: "Mulher de óculos sorrindo",
            ph: "Foto: mulher jovem de cabelo escuro liso e comprido e óculos de armação preta, com camisa xadrez azul, sorrindo de frente para a câmera, sobre fundo branco." },
          { tag: "IT", c: "yellow", v: "cream", id: "w25p1c",
            alt: "Carro perua antigo laranja",
            ph: "Foto: carro perua antigo cor de laranja, visto de três quartos pela frente, com bagageiro no teto, faróis retangulares e calotas prateadas, sobre fundo preto." } ] },
        { t: "note", v: "lilac", kicker: "I / YOU / WE / THEY", bold: true, text: "Agora: HE / SHE / IT" },
        { t: "note", v: "cream", bar: true, bold: true, text: "Com he, she e it, o Simple Present muda." },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI:" },
        { t: "grid", cols: 3, items: [
          { title: "formar afirmativas com he, she e it;", v: "mint", c: "teal" },
          { title: "aprender quando usar -s, -ies e -es;", v: "lilac", c: "purple" },
          { title: "usar has;", v: "mint", c: "teal" },
          { title: "formar negativas com doesn’t;", v: "lilac", c: "purple" },
          { title: "fazer perguntas com does;", v: "mint", c: "teal" },
          { title: "falar sobre a rotina de outra pessoa.", v: "lilac", c: "purple" } ] } ] },

      // ── PÁGINA 02 (impressa 02) · WHAT CHANGES? ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 02" },
        { t: "title", en: "WHAT CHANGES?", pt: "Compare com o que você já sabe." },
        { t: "grid", cols: 1, items: [
          { kicker: "I", title: "live in New York.", v: "mint", c: "teal" },
          { kicker: "You", title: "live in New York.", v: "mint", c: "teal" },
          { kicker: "He", title: "lives in New York.", v: "lilac", c: "purple" },
          { kicker: "She", title: "lives in New York.", v: "lilac", c: "purple" },
          { kicker: "It", title: "lives …", v: "lilac", c: "purple" },
          { kicker: "We", title: "live in New York.", v: "mint", c: "teal" },
          { kicker: "They", title: "live in New York.", v: "mint", c: "teal" } ] },
        { t: "cards", cols: 2, items: [
          { tag: "I / YOU / WE / THEY", c: "teal", v: "mint", lines: ["LIVE"] },
          { tag: "HE / SHE / IT", c: "purple", v: "lilac", lines: ["LIVES"] } ] } ] },

      // ── PÁGINA 03 (impressa 03) · HE, SHE, IT — AFFIRMATIVE ─────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 03" },
        { t: "title", en: "HE, SHE, IT: AFFIRMATIVE", pt: "Quando o verbo ganha -s, -ies ou -es." },
        { t: "cards", cols: 2, items: [
          { tag: "REGRA GERAL", c: "teal", v: "mint",
            lines: ["add -S", "work → works", "eat → eats", "play → plays"] },
          { tag: "CONSONANT + Y", c: "purple", v: "lilac",
            lines: ["Y → IES", "study → studies", "cry → cries", "try → tries"] },
          { tag: "SH / CH / X / SS / O", c: "yellow", v: "cream",
            lines: ["add -ES", "relax → relaxes", "watch → watches", "do → does"] },
          { tag: "IRREGULAR", c: "teal", v: "mint",
            lines: ["have → has"] } ] },
        { t: "chips", items: [
          { t: "work → works", c: "teal" },
          { t: "study → studies", c: "teal" },
          { t: "watch → watches", c: "teal" },
          { t: "have → has", c: "teal" } ] } ] },

      // ── PÁGINA 04 (impressa 04) · AFFIRMATIVE IN ACTION ─────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 04" },
        { t: "title", en: "AFFIRMATIVE IN ACTION", pt: "Veja a regra funcionando." },
        { t: "cards", cols: 1, items: [
          { tag: "work → works", c: "teal", v: "mint", id: "w25p4a",
            alt: "Policial acenando",
            ph: "Foto: homem jovem de barba curta, com uniforme de policial azul-claro, gravata preta e cinto tático, acenando com a mão direita aberta, sobre fundo preto.",
            lines: ["He works as a police officer."] },
          { tag: "like → likes", c: "purple", v: "lilac", id: "w25p4b",
            alt: "Macaco comendo uma banana",
            ph: "Foto: macaco de pelo cinza-esverdeado e topete alaranjado, sentado sobre um deque de madeira clara, segurando e mordendo uma banana descascada; ao fundo, uma janela desfocada.",
            lines: ["It likes bananas."] },
          { tag: "study → studies", c: "teal", v: "mint", id: "w25p4c",
            alt: "Mulher de óculos sorrindo",
            ph: "Foto: mulher jovem de cabelo escuro comprido e óculos de armação preta, com camisa xadrez azul, sorrindo de frente para a câmera, sobre fundo branco.",
            lines: ["My sister studies at home."] } ] } ] },

      // ── PÁGINA 05 (impressa 05) · MORE AFFIRMATIVE FORMS ────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 05" },
        { t: "title", en: "MORE AFFIRMATIVE FORMS", pt: "Mais verbos com he, she e it." },
        { t: "cards", cols: 1, items: [
          { tag: "cry → cries", note: "watch → watches", c: "teal", v: "mint", id: "w25p5a",
            alt: "Mulher chorando diante do notebook",
            ph: "Foto: mulher de óculos e suéter listrado chorando à noite diante de um notebook aberto, enxugando o rosto com um lenço de papel, num quarto escuro com luminária acesa e luzinhas amarelas ao fundo.",
            lines: ["Karen cries when she watches sad movies."] },
          { tag: "wash → washes", c: "purple", v: "lilac", id: "w25p5b",
            alt: "Homem lavando a louça abraçado pela esposa",
            ph: "Foto: casal na cozinha branca; o homem de camiseta branca e braços tatuados lava a louça na pia enquanto a mulher o abraça por trás, os dois rindo.",
            lines: ["My husband washes the dishes every day."] },
          { tag: "go → goes", c: "teal", v: "mint", id: "w25p5c",
            alt: "Mergulhador sobre um recife de corais",
            ph: "Foto: mergulhador com cilindro, máscara e roupa preta nadando sobre um recife de corais amarelos e rosados, com peixinhos alaranjados ao redor, em água azul-turquesa.",
            lines: ["My uncle goes scuba diving on the weekends."] },
          { tag: "do → does", c: "purple", v: "lilac", id: "w25p5d",
            alt: "Homem de terno sorrindo diante do notebook",
            ph: "Foto: homem negro de barba, terno escuro e camisa branca, sentado a uma mesa clara diante de um notebook aberto, com as duas mãos levantadas e sorrindo; ao lado, um copo de café para viagem.",
            lines: ["He does his homework in the afternoon."] },
          { tag: "have → has", c: "teal", v: "mint", id: "w25p5e",
            alt: "Família sentada no sofá",
            ph: "Foto: família de quatro sentada junta no sofá da sala (o pai de camisa cinza com um bebê de macacão azul no colo, uma menina de camiseta listrada e a mãe de blusa clara), todos sorrindo.",
            lines: ["Lessie has a beautiful house."] } ] },
        { t: "chips", items: [
          { t: "cry → cries", c: "yellow" },
          { t: "watch → watches", c: "yellow" },
          { t: "wash → washes", c: "yellow" },
          { t: "go → goes", c: "yellow" },
          { t: "do → does", c: "yellow" },
          { t: "have → has", c: "yellow" } ] } ] },

      // ── PÁGINA 06 (impressa 06) · SIMPLE PRESENT — NEGATIVE ─────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 06" },
        { t: "title", en: "SIMPLE PRESENT: NEGATIVE", pt: "Com he, she e it, a negativa usa doesn’t." },
        { t: "cards", cols: 2, items: [
          { tag: "I / YOU / WE / THEY", c: "teal", v: "mint", lines: ["→ DON’T"] },
          { tag: "HE / SHE / IT", c: "purple", v: "lilac", lines: ["→ DOESN’T"] } ] },
        { t: "note", v: "gray", bold: true, text: "HE / SHE / IT + DOESN’T + BASE VERB" },
        { t: "image", id: "w25p6a",
          alt: "Carro perua antigo laranja",
          ph: "Foto: carro perua antigo cor de laranja, visto de três quartos pela frente, com bagageiro no teto e faróis retangulares, sobre fundo preto." },
        { t: "key", v: "mint", text: "He doesn’t have a modern car." },
        { t: "image", id: "w25p6b",
          alt: "Mulher de óculos sorrindo",
          ph: "Foto: mulher jovem de cabelo escuro comprido e óculos de armação preta, com camisa xadrez azul, sorrindo de frente para a câmera, sobre fundo branco." },
        { t: "key", v: "white", text: "She teaches English." },
        { t: "image", id: "w25p6c",
          alt: "Mulher de óculos sorrindo",
          ph: "Foto: a mesma mulher de cabelo escuro comprido e óculos de armação preta, com camisa xadrez azul, sorrindo de frente para a câmera, sobre fundo branco." },
        { t: "key", v: "lilac", text: "She doesn’t teach Japanese." },
        { t: "note", v: "cream", bar: true, bold: true, text: "Depois de doesn’t, o verbo volta à forma-base." },
        { t: "compare", items: [
          { wrong: "She doesn’t teaches.", right: "She doesn’t teach.", rnote: "She teaches." } ] },
        { t: "key", v: "mint", text: "She teaches. → She doesn’t teach." } ] },

      // ── PÁGINA 07 (impressa 07) · DOES HE…? / DOES SHE…? ────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 07" },
        { t: "title", en: "DOES HE…? / DOES SHE…?", pt: "Perguntas com does e o verbo na forma-base." },
        { t: "note", v: "lilac", bold: true, text: "DOES + HE / SHE / IT + BASE VERB + ?" },
        { t: "key", v: "mint", text: "Do you live in New York? → Does he live in New York?" },
        { t: "cards", cols: 1, items: [
          { tag: "Does she speak English?", c: "navy", v: "gray", id: "w25p7a",
            alt: "Mulher de óculos sorrindo",
            ph: "Foto: mulher jovem de cabelo escuro comprido e óculos de armação preta, com camisa xadrez azul, sorrindo de frente para a câmera, sobre fundo branco.",
            lines: ["Yes, she does.", "No, she doesn’t."] },
          { tag: "Does he like coffee?", c: "navy", v: "gray", id: "w25p7b",
            alt: "Homem de moletom azul apontando para o lado",
            ph: "Foto: homem jovem de barba e cabelo curto, com blusa de moletom azul-royal, apontando para o lado com o dedo indicador, sobre fundo preto.",
            lines: ["Yes, he does.", "No, he doesn’t."] } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Depois de DOES: BASE VERB." },
        { t: "compare", items: [
          { wrong: "Does he likes coffee?", right: "Does he like coffee?" } ] } ] },

      // ── PÁGINA 08 (impressa 08) · QUESTION WORDS + DOES ─────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 08" },
        { t: "title", en: "QUESTION WORDS + DOES", pt: "Agora podemos perguntar mais sobre outra pessoa." },
        { t: "note", v: "lilac", bold: true, text: "QUESTION WORD + DOES + HE / SHE / IT + BASE VERB + ?" },
        { t: "cards", cols: 1, items: [
          { tag: "Where does she work?", c: "teal", v: "mint", id: "w25p8a",
            alt: "Garçonete com bandeja de taças",
            ph: "Foto: garçonete sorridente de camisa branca e gravata-borboleta preta, segurando uma bandeja redonda com duas taças de vinho branco, num restaurante com luzes douradas desfocadas ao fundo.",
            lines: ["She works in a restaurant."] },
          { tag: "What does he do?", c: "purple", v: "lilac", id: "w25p8b",
            alt: "Enfermeiro anotando numa prancheta",
            ph: "Foto: enfermeiro de uniforme azul e estetoscópio no pescoço, sentado com uma prancheta na mão num quarto de hospital; ao fundo, uma paciente na cama e outra profissional de saúde.",
            lines: ["He’s a nurse."] },
          { tag: "When does she study English?", c: "teal", v: "mint", id: "w25p8c",
            alt: "Mulher de óculos sorrindo",
            ph: "Foto: mulher jovem de cabelo escuro comprido e óculos de armação preta, com camisa xadrez azul, sorrindo de frente para a câmera, sobre fundo branco.",
            lines: ["She studies English on Fridays."] },
          { tag: "Who does he live with?", c: "purple", v: "lilac", id: "w25p8d",
            alt: "Família sentada no sofá",
            ph: "Foto: família de quatro sentada junta no sofá da sala (o pai de camisa cinza com um bebê no colo, uma menina de camiseta listrada e a mãe de blusa clara), todos sorrindo.",
            lines: ["He lives with his wife and his children."] },
          { tag: "Why does he study English?", c: "teal", v: "mint", id: "w25p8e",
            alt: "Homem de moletom azul apontando para o lado",
            ph: "Foto: homem jovem de barba e blusa de moletom azul-royal, apontando para o lado com o dedo indicador, sobre fundo preto.",
            lines: ["Because he wants to travel around the world."] } ] },
        { t: "chips", items: [
          { t: "QUESTION: does + base verb", c: "navy" },
          { t: "ANSWER: third-person verb", c: "navy" } ] } ] },

      // ── PÁGINA 09 (impressa 09) · ONE RULE TO REMEMBER ──────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 09" },
        { t: "title", en: "ONE RULE TO REMEMBER", pt: "O verbo recebe a marca da terceira pessoa ou volta à forma-base." },
        { t: "cards", cols: 2, items: [
          { tag: "AFFIRMATIVE", c: "teal", v: "mint", lines: ["HE / SHE / IT"],
            note: "o VERBO recebe a marca da terceira pessoa." },
          { tag: "NEGATIVE / QUESTION", c: "purple", v: "lilac", lines: ["DOES / DOESN’T"],
            note: "o VERBO volta à forma-base." } ] },
        { t: "table", head: ["AFFIRMATIVE", "NEGATIVE / QUESTION"], rows: [
          { a: "She teaches English.", b: "She doesn’t teach Japanese.", v: "gray" },
          { a: "He likes coffee.", b: "Does he like coffee?", v: "gray" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "She works. → She doesn’t work.\nDoes she work?" } ] },

      // ── PÁGINA 10 (impressa 10) · LET’S TALK ABOUT SOMEONE ──────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 10" },
        { t: "title", en: "LET’S TALK ABOUT SOMEONE", pt: "Mia e Leo falam sobre o irmão do Leo." },
        { t: "image", id: "w25p10a",
          alt: "Homem tomando café da manhã, com dois retratos menores sobrepostos",
          ph: "Foto: homem de barba e camisa jeans clara sentado à mesa do café da manhã, sorrindo para a câmera e estendendo uma xícara branca; na mesa há pães, um ovo cozido e uma jarra de água, e ao fundo a cozinha desfocada. Sobrepostos no canto superior esquerdo, dois retratos menores, sem legenda: a mulher de cabelo escuro comprido, óculos de armação preta e camisa xadrez azul, sobre fundo branco, e o homem de barba e moletom azul-royal apontando para o lado, sobre fundo preto." },
        { t: "dialogue", items: [
          { s: "a", text: "Mia: What does your brother do?" },
          { s: "b", text: "Leo: He’s a baker." },
          { s: "a", text: "Mia: What time does he go to work?" },
          { s: "b", text: "Leo: He goes to work at 7:00." },
          { s: "a", text: "Mia: Does he have lunch at work?" },
          { s: "b", text: "Leo: Yes, he does." },
          { s: "a", text: "Mia: Does he watch TV at night?" },
          { s: "b", text: "Leo: No, he doesn’t. He goes to bed at 10:00." } ] } ] },

      // ── PÁGINA 11 (impressa 11) · TALK ABOUT A PERSON ───────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 11" },
        { t: "title", en: "TALK ABOUT A PERSON", pt: "Fale sobre a rotina de uma pessoa." },
        { t: "image", id: "w25p11a",
          alt: "Dupla conversando com cadernos abertos sobre a mesa",
          ph: "Foto: uma mulher de camisa jeans e cabelo castanho ondulado e um homem de camisa verde-oliva com a mão no queixo, sentados lado a lado a uma mesa branca; cada um tem um caderno aberto e uma caneta na mão, e os dois conversam sorrindo. Ao fundo, um vaso de planta e uma caneca preta sobre a mesa." },
        { t: "sec", text: "PARTE 1 · CHOOSE", c: "teal" },
        { t: "chips", title: "Escolha:", items: [
          { t: "he", c: "teal" },
          { t: "she", c: "purple" } ] },
        { t: "sec", text: "PARTE 2 · WRITE", c: "purple" },
        { t: "free", id: "w25f1", items: [
          { n: "1", kicker: "WRITE", prefix: "He/She gets up at ______.", ideas: "", v: "mint", c: "teal" },
          { n: "2", kicker: "WRITE", prefix: "He/She ______________.", ideas: "", v: "lilac", c: "purple" },
          { n: "3", kicker: "WRITE", prefix: "He/She has lunch at ______.", ideas: "", v: "mint", c: "teal" },
          { n: "4", kicker: "WRITE", prefix: "He/She ______________.", ideas: "", v: "lilac", c: "purple" },
          { n: "5", kicker: "WRITE", prefix: "He/She goes to bed at ______.", ideas: "", v: "mint", c: "teal" } ] },
        { t: "sec", text: "PARTE 3 · ASK", c: "yellow" },
        { t: "rows", items: [
          { text: "What does he/she do?", c: "teal" },
          { text: "What time does he/she get up?", c: "teal" },
          { text: "Does he/she have lunch at home?", c: "teal" },
          { text: "Does he/she watch TV?", c: "teal" } ] },
        { t: "note", v: "mint", text: "Você pode usar informações fictícias." } ] },

      // ── PÁGINA 12 (impressa 12) · YOUR TURN! — PARTE 1 ──────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 12" },
        { t: "title", en: "YOUR TURN!", pt: "Complete as frases com a forma correta do Simple Present." },
        { t: "kicker", text: "PARTE 1" },
        { t: "image", id: "w25p12a",
          alt: "Moça escrevendo num caderno",
          ph: "Foto: moça de cabelo castanho comprido e suéter bege, sentada a uma mesa clara, escrevendo com uma caneta preta em um caderno aberto; ao fundo, uma estante desfocada com um vaso de planta." },
        { t: "fill", id: "w25e1", title: "COMPLETE AS FRASES COM A FORMA CORRETA DO SIMPLE PRESENT.", items: [
          { pre: "1. She", answers: ["doesn’t", "does not", "doesn't"], note: "(not / speak)", v: "lilac" },
          { pre: "1. She doesn’t", answers: ["speak"], post: "Chinese.", v: "lilac" },
          { pre: "2. My dad", answers: ["works"], post: "at a bank.", note: "(work)", v: "mint" },
          { pre: "3.", answers: ["Does", "does"], post: "Sarah", note: "(have)", v: "cream" },
          { pre: "3. Does Sarah", answers: ["have"], post: "two sisters?", v: "cream" },
          { pre: "4.", answers: ["Does", "does"], post: "Mark", note: "(live)", v: "lilac" },
          { pre: "4. Does Mark", answers: ["live"], post: "with his parents?", v: "lilac" },
          { pre: "5. I have a friend who", answers: ["watches"], post: "TV all day long.", note: "(watch)", v: "mint" } ] } ] },

      // ── PÁGINA 13 (impressa 13) · YOUR TURN! — PARTE 2 ──────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 13" },
        { t: "title", en: "YOUR TURN!", pt: "Complete as frases com a forma correta do Simple Present." },
        { t: "kicker", text: "PARTE 2" },
        { t: "image", id: "w25p13a",
          alt: "Rapaz de óculos escrevendo num caderno",
          ph: "Foto: rapaz de óculos de armação preta, camisa jeans azul por cima de uma camiseta branca, sentado a uma mesa clara escrevendo com uma caneta em um caderno aberto; ao fundo, uma estante branca com um vaso de planta." },
        { t: "fill", id: "w25e2", title: "COMPLETE AS FRASES COM A FORMA CORRETA DO SIMPLE PRESENT.", items: [
          { pre: "6. Mary and Josh", answers: ["live"], post: "together.", note: "(live)", v: "mint" },
          { pre: "7.", answers: ["Does", "does"], post: "your daughter", note: "(go)", v: "lilac" },
          { pre: "7. Does your daughter", answers: ["go"], post: "to school alone?", v: "lilac" },
          { pre: "8. Charles", answers: ["doesn’t", "does not", "doesn't"], note: "(not / eat)", v: "cream" },
          { pre: "8. Charles doesn’t", answers: ["eat"], post: "vegetables.", v: "cream" },
          { pre: "9. My grandma", answers: ["studies"], post: "French.", note: "(study)", v: "mint" } ] } ] },

      // ── PÁGINA 14 (impressa 14) · FECHAMENTO ────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 25", page: "PÁGINA 14" },
        { t: "title", en: "SIMPLE PRESENT", pt: "HE, SHE, IT" },
        { t: "check", id: "w25c1", title: "EU CONSIGO...", items: [
          "formar afirmativas com he, she e it;",
          "usar -s, -ies e -es;",
          "usar has;",
          "formar negativas com doesn’t;",
          "usar o verbo-base depois de doesn’t;",
          "fazer perguntas com does;",
          "responder com does/doesn’t;",
          "combinar Question Words com does;",
          "falar sobre a rotina de outra pessoa." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "VIDEOAULA 25 · SIMPLE PRESENT: HE, SHE, IT",
            body: "Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA · TALK ABOUT SOMEONE",
            body: "Descreva uma pessoa fictícia e responda perguntas sobre sua rotina usando he/she, does e doesn’t.",
            plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "bar", label: "PROGRESSO", value: "25 DE 42 AULAS", pct: "60%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 26 · DAYS OF THE WEEK" } ] }
    ]
  },

  {
    id: 26, code: "AULA 26", title: "Days of the Week", sub: "Organize sua semana em inglês.",
    time: "13 minutos",
    pages: [
      // ── página impressa 01 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26" },
        { t: "title", en: "DAYS OF THE WEEK", pt: "Organize sua semana em inglês." },
        // As sete pastilhas da página são claras (azul-turquesa pálido de Monday a
        // Friday, creme em Saturday e Sunday): `mint`/`cream` são as variantes
        // pálidas; `teal`/`yellow` seriam pastilhas chapadas, que a página não tem.
        { t: "chips", items: [
          { t: "Monday", c: "mint" },
          { t: "Tuesday", c: "mint" },
          { t: "Wednesday", c: "mint" },
          { t: "Thursday", c: "mint" },
          { t: "Friday", c: "mint" },
          { t: "Saturday", c: "cream" },
          { t: "Sunday", c: "cream" } ] },
        { t: "image", id: "w26p1a",
          alt: "Homem de camisa jeans escrevendo num caderno ao lado do notebook.",
          ph: "Foto: homem jovem, cabelo escuro e barba curta, de camisa jeans azul aberta sobre camiseta branca, sentado a uma mesa de madeira clara numa sala muito iluminada. Ele sorri olhando para baixo e escreve com a mão direita num caderno aberto; ao lado, um notebook cinza aberto e um celular sobre a mesa. Ao fundo, uma estante branca com vasos de plantas verdes e objetos de decoração, tudo desfocado." },
        { t: "check", id: "w26c1", title: "NESTA AULA, VOCÊ VAI:", items: [
          "aprender os sete dias da semana;",
          "reconhecer suas abreviações;",
          "usar on com dias;",
          "entender week e weekend;",
          "relacionar dias à sua rotina;",
          "perguntar e responder sobre sua semana." ] } ] },

      // ── página impressa 02 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 02" },
        { t: "title", en: "THE SEVEN DAYS", pt: "Monday to Sunday." },
        { t: "table", head: ["DAY · DIA", "ABREVIAÇÃO"], rows: [
          { a: "Monday", b: "MON", v: "mint" },
          { a: "Tuesday", b: "TUE", v: "lilac" },
          { a: "Wednesday", b: "WED", v: "cream" },
          { a: "Thursday", b: "THU", v: "mint" },
          { a: "Friday", b: "FRI", v: "lilac" },
          { a: "Saturday", b: "SAT", v: "cream" },
          { a: "Sunday", b: "SUN", v: "mint" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Days of the week start with a capital letter.\nOs dias da semana começam com letra maiúscula em inglês." },
        { t: "note", v: "lilac", bold: true, text: "Leia os sete dias em voz alta, em ordem." } ] },

      // ── página impressa 03 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 03" },
        { t: "title", en: "WEEK & WEEKEND", pt: "A semana e o fim de semana." },
        { t: "cards", cols: 2, items: [
          { tag: "DURING THE WEEK", c: "teal", v: "mint",
            lines: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
          { tag: "ON THE WEEKEND", c: "purple", v: "lilac",
            lines: ["Saturday", "Sunday"] } ] },
        // Cartão creme com o título "ON + DAY" em roxo e as duas frases embaixo:
        // é exatamente o formato do `note` com `kicker` (kicker sempre roxo).
        { t: "note", v: "cream", kicker: "ON + DAY", text: "on Monday\non Saturdays" },
        // Na página, "on the weekend" e "at the weekend" estão empilhados dentro
        // de um mesmo cartão, um sobre o outro — daí `cols: 1`.
        { t: "grid", cols: 1, items: [
          { title: "on the weekend", v: "mint", c: "teal" },
          { title: "at the weekend", body: "mais comum no inglês britânico.", v: "lilac", c: "purple" } ] },
        { t: "note", v: "mint", bold: true, text: "I work on Mondays, Tuesdays, Wednesdays, Thursdays and Fridays." } ] },

      // ── página impressa 04 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 04" },
        { t: "title", en: "DAYS IN REAL LIFE", pt: "Veja os dias funcionando dentro da rotina." },
        // `cards` e não `steps`: na página a foto vem ANTES do texto (o `steps`
        // imprime a foto depois das frases) e os cartões não são numerados (o
        // `steps` desenha bolinhas 1, 2, 3 que a página não tem).
        { t: "cards", cols: 1, items: [
          { tag: "Sandra", c: "teal", v: "mint", id: "w26p4a",
            alt: "Mulher de óculos e blazer bege trabalhando no notebook.",
            ph: "Foto: mulher jovem de cabelos escuros presos em coque, óculos de armação grossa escura, blazer bege claro sobre blusa branca de gola V, sentada a uma mesa clara e sorrindo enquanto usa um notebook cinza. Sobre a mesa, um caderno e uma caneta preta; ao fundo, uma planta em vaso e prateleiras claras desfocadas.",
            lines: ["Sandra works during the week, but she doesn’t work on the weekend."] },
          { tag: "Melissa", c: "purple", v: "cream", id: "w26p4b",
            alt: "Mulher de chapéu de palha e óculos escuros sentada na praia.",
            ph: "Foto: mulher jovem de cabelos longos castanhos, chapéu de palha com faixa preta, óculos escuros e top de biquíni cinza-escuro, sentada na areia abraçando os joelhos e sorrindo de lado. Ao fundo, o mar azul-turquesa com a espuma branca das ondas quebrando.",
            lines: [
              "Melissa goes to the beach on Sundays.",
              "She doesn’t go to the beach on Saturdays.",
              "When do you go to the beach?"] } ] } ] },

      // ── página impressa 05 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 05" },
        { t: "title", en: "MORE WEEKLY ROUTINES", pt: "Mais rotinas espalhadas pela semana." },
        // Mesma razão da página 04: foto antes do texto e sem numeração.
        { t: "cards", cols: 1, items: [
          { tag: "JOSH", c: "teal", v: "mint", id: "w26p5a",
            alt: "Dois homens sentados lado a lado, sorrindo um para o outro.",
            ph: "Foto: dois homens sentados lado a lado a uma mesa clara, em casa. À esquerda, um rapaz de cabelo escuro, barba curta e camisa preta; à direita, um senhor de cabelo grisalho e camisa social azul-clara, de relógio no pulso. Os dois se olham e sorriem; ao fundo, uma parede clara e prateleiras desfocadas.",
            lines: [
              "Josh visits his parents on Mondays, Wednesdays and Fridays.",
              "He doesn’t visit them every day.",
              "Do you see your parents every day?"] },
          { tag: "ADAM", c: "purple", v: "lilac", id: "w26p5b",
            alt: "Homem de fones de ouvido escrevendo num caderno.",
            ph: "Foto: homem jovem de cabelo escuro e barba curta, com fones de ouvido grandes pretos e suéter verde-musgo, sentado a uma mesa clara escrevendo num caderno aberto com uma caneta. Usa um relógio escuro no pulso esquerdo; ao fundo, uma sala clara com planta desfocada.",
            lines: [
              "Adam studies English on Tuesdays and Thursdays.",
              "He doesn’t study English every day.",
              "Do you study English every day?"] },
          { tag: "SAMANTHA", c: "yellow", v: "cream", id: "w26p5c",
            alt: "Mulher de avental e luvas limpando a mesa da cozinha.",
            ph: "Foto: mulher de cabelo escuro preso, cardigã bege claro e avental preto, usando luvas de borracha azuis, inclinada sobre uma bancada de madeira clara enquanto limpa. Ao fundo, uma planta verde em vaso e a cozinha clara desfocada.",
            lines: [
              "Samantha cleans her house on the weekend.",
              "She doesn’t clean her house on Wednesdays.",
              "Does she clean her house on Fridays?"] } ] } ] },

      // ── página impressa 06 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 06" },
        { t: "title", en: "LET’S TALK ABOUT MY WEEK", pt: "Mia e Leo conversam sobre a semana deles." },
        { t: "dialogue", items: [
          { s: "b", text: "Mia: What’s your favorite day of the week?" },
          { s: "a", text: "Leo: Saturday." },
          { s: "b", text: "Mia: What do you do on Saturdays?" },
          { s: "a", text: "Leo: I go to the beach with my friends." },
          { s: "b", text: "Mia: Do you study English on the weekend?" },
          { s: "a", text: "Leo: No, I don’t. I study English on Tuesdays and Thursdays." },
          { s: "b", text: "Mia: When do you have English classes?" },
          { s: "a", text: "Leo: On Tuesdays and Thursdays." } ] } ] },

      // ── página impressa 07 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 07" },
        { t: "title", en: "MY WEEK", pt: "Agora escreva e responda sobre a sua própria semana." },
        { t: "sec", text: "PARTE 1: MY WEEK" },
        { t: "lead", text: "Escreva uma atividade simples para alguns dias da sua semana." },
        { t: "free", id: "w26f1", cols: 1, items: [
          { n: "1", kicker: "MONDAY", prefix: "Monday", ideas: "", v: "mint", c: "purple" },
          { n: "2", kicker: "TUESDAY", prefix: "Tuesday", ideas: "", v: "mint", c: "purple" },
          { n: "3", kicker: "WEDNESDAY", prefix: "Wednesday", ideas: "", v: "mint", c: "purple" },
          { n: "4", kicker: "THURSDAY", prefix: "Thursday", ideas: "", v: "mint", c: "purple" },
          { n: "5", kicker: "FRIDAY", prefix: "Friday", ideas: "", v: "mint", c: "purple" },
          { n: "6", kicker: "SATURDAY", prefix: "Saturday", ideas: "", v: "mint", c: "purple" },
          { n: "7", kicker: "SUNDAY", prefix: "Sunday", ideas: "", v: "mint", c: "purple" } ] },
        { t: "sec", text: "PARTE 2: ASK & ANSWER", c: "purple" },
        { t: "rows", items: [
          { n: "?", text: "What’s your favorite day of the week?", c: "purple" },
          { n: "?", text: "When do you have English classes?", c: "purple" },
          { n: "?", text: "Where do you go on the weekends?", c: "purple" } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "Você pode usar informações fictícias." } ] },

      // ── página impressa 08 ────────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 26", page: "PÁGINA 08" },
        { t: "title", en: "DAYS OF THE WEEK", pt: "Você já sabe falar sobre os dias da semana." },
        { t: "check", id: "w26c2", title: "EU CONSIGO...", items: [
          "reconhecer os sete dias da semana;",
          "usar as abreviações MON–SUN;",
          "escrever os dias com inicial maiúscula;",
          "compreender week e weekend nos contextos desta aula;",
          "usar on + day;",
          "usar on the weekend;",
          "relacionar dias da semana à rotina;",
          "perguntar e responder sobre minha semana." ] },
        { t: "cta", items: [
          // `body` traz só o que está impresso no cartão da página. A frase
          // "Aprofunde com o professor." é da aula 06 e não existe aqui.
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 26", body: "VIDEOAULA 26 · DAYS OF THE WEEK", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          // "MY WEEK" é o subtítulo do cartão e o parágrafo começa com "Converse";
          // o `body` do `cta` é um parágrafo só, então os dois entram juntos.
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "MY WEEK · Converse sobre sua semana, diga em quais dias você realiza algumas atividades e responda perguntas sobre sua rotina.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 27 · MONTHS OF THE YEAR" },
        { t: "bar", label: "PROGRESSO", value: "26 DE 42 AULAS", pct: "62%" } ] }
    ]
  },

  {
    id: 27, code: "AULA 27", title: "Months of the Year", sub: "Organize o ano em inglês.",
    time: "12 minutos",
    pages: [
      // ───────────────────────────── página impressa 01 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 01" },
        { t: "title", en: "MONTHS OF THE YEAR", pt: "Organize o ano em inglês." },
        { t: "image", id: "w27p1a", alt: "Mulher escrevendo o planejamento do ano em um caderno.",
          ph: "Foto: jovem de coque e jaqueta bege clara, sentada a uma mesa de madeira perto de uma janela, escrevendo com caneta preta em um caderno espiral. Na página do caderno está escrito à mão My Year e, abaixo, uma tabela de doze quadradinhos com JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC. Colado na página, um post-it rosa com a frase Plan Dream Do e um coraçãozinho. Ao lado, uma caneca azul-escura, óculos de grau e uma planta ao fundo." },
        { t: "sec", text: "Leia e repita os meses em voz alta.", c: "teal" },
        { t: "rows", items: [
          { n: "1", text: "January", c: "purple" },
          { n: "2", text: "February", c: "purple" },
          { n: "3", text: "March", c: "purple" },
          { n: "4", text: "April", c: "purple" },
          { n: "5", text: "May", c: "purple" },
          { n: "6", text: "June", c: "purple" },
          { n: "7", text: "July", c: "purple" },
          { n: "8", text: "August", c: "purple" },
          { n: "9", text: "September", c: "purple" },
          { n: "10", text: "October", c: "purple" },
          { n: "11", text: "November", c: "purple" },
          { n: "12", text: "December", c: "purple" } ] },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI:", c: "purple" },
        { t: "grid", cols: 3, items: [
          { title: "aprender os 12 meses do ano;", v: "mint", c: "teal" },
          { title: "reconhecer meses em datas;", v: "lilac", c: "purple" },
          { title: "usar in com meses;", v: "cream", c: "yellow" },
          { title: "usar on com datas;", v: "mint", c: "teal" },
          { title: "perguntar quando é o aniversário de alguém;", v: "lilac", c: "purple" },
          { title: "falar sobre algumas datas importantes.", v: "cream", c: "yellow" } ] } ] },

      // ───────────────────────────── página impressa 02 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 02" },
        { t: "title", en: "MONTHS & DATES · JANUARY–JUNE", pt: "Veja como usamos os meses com in e as datas com on." },
        { t: "cards", cols: 2, items: [
          { tag: "IN + MONTH", c: "teal", v: "mint", lines: ["Fala sobre o mês.", "in January"] },
          { tag: "ON + DATE", c: "purple", v: "lilac", lines: ["Fala sobre o dia exato.", "on January 1st"] } ] },
        { t: "steps", items: [
          { n: "1", tag: "JANUARY", c: "teal", v: "mint",
            lines: ["New Year’s Day is on January 1st.", "New Year’s Day is in January."],
            id: "w27p2a", alt: "Fogos de artifício sobre a cidade na virada do ano.",
            ph: "Foto redonda: fogos de artifício coloridos explodindo no céu noturno sobre os prédios iluminados de uma cidade, na virada do ano. Entre a foto e o texto, um pictograma chapado turquesa de fogos de artifício estourando sobre a silhueta branca de prédios." },
          { n: "2", tag: "FEBRUARY", c: "purple", v: "lilac",
            lines: ["Valentine’s Day is on February 14th.", "Valentine’s Day is in February."],
            id: "w27p2b", alt: "Dois corações vermelhos sobre pétalas de rosa.",
            ph: "Foto redonda: dois corações vermelhos de tecido, lado a lado sobre uma mesa clara, cercados por pétalas de rosa vermelhas espalhadas. Entre a foto e o texto, um pictograma chapado roxo de coração." },
          { n: "3", tag: "MARCH", c: "teal", v: "mint",
            lines: ["International Women’s Day is on March 8th.", "International Women’s Day is in March."],
            id: "w27p2c", alt: "Três mulheres sorrindo juntas com um buquê de flores.",
            ph: "Foto redonda: três mulheres jovens de etnias diferentes, abraçadas e sorrindo para a câmera; a da direita, de blusa rosa, segura um buquê de flores roxas. Entre a foto e o texto, um pictograma chapado turquesa do símbolo feminino (círculo com cruz embaixo) dentro de um quadrado de cantos arredondados." },
          { n: "4", tag: "APRIL", c: "red", v: "red",
            lines: ["My vacation starts on April 10th.", "My vacation starts in April."],
            id: "w27p2d", alt: "Mala amarela e chapéu diante da janela do aeroporto.",
            ph: "Foto redonda: mala de viagem amarela com um chapéu de palha em cima, diante da janela de um aeroporto; do lado de fora, um avião decolando em um céu azul com nuvens. Entre a foto e o texto, um pictograma chapado rosa-magenta de mala de viagem com alça." },
          { n: "5", tag: "MAY", c: "green", v: "green",
            lines: ["Labor Day in Brazil is on May 1st.", "Labor Day in Brazil is in May."],
            id: "w27p2e", alt: "Bandeira do Brasil tremulando no mastro.",
            ph: "Foto redonda: bandeira do Brasil tremulando no alto de um mastro, com céu azul e nuvens brancas ao fundo. Entre a foto e o texto, um pictograma chapado verde de um grupo de três pessoas." },
          { n: "6", tag: "JUNE", c: "orange", v: "cream",
            lines: ["Valentine’s Day in Brazil is on June 12th.", "Valentine’s Day in Brazil is in June."],
            id: "w27p2f", alt: "Presente com laço vermelho cercado de corações.",
            ph: "Foto redonda vista de cima: caixa de presente de papel kraft bege com um laço grande de fita vermelha no topo, sobre uma superfície clara, cercada por corações vermelhos espalhados. Entre a foto e o texto, um pictograma chapado laranja de coração com contorno branco por dentro." } ] },
        { t: "note", v: "gray", bar: true, text: "Use in com meses para falar de períodos.\nUse on com datas para falar de dias específicos." } ] },

      // ───────────────────────────── página impressa 03 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 03" },
        { t: "title", en: "MONTHS & DATES · JULY–DECEMBER", pt: "Veja como usamos os meses com in e as datas com on." },
        { t: "cards", cols: 2, items: [
          { tag: "IN + MONTH", c: "teal", v: "mint", lines: ["Fala sobre o mês.", "in July"] },
          { tag: "ON + DATE", c: "purple", v: "lilac", lines: ["Fala sobre o dia exato.", "on July 7th"] } ] },
        { t: "chips", items: [
          { t: "IN → MONTH", c: "teal" },
          { t: "ON → DATE", c: "purple" } ] },
        { t: "steps", items: [
          { n: "7", tag: "JULY", c: "teal", v: "mint",
            lines: ["When’s your birthday?", "It’s in July.", "It’s on July 7th."],
            id: "w27p3a", alt: "Cupcake de aniversário com uma vela acesa.",
            ph: "Foto redonda: cupcake com cobertura branca e granulado colorido, com uma vela fina acesa em cima, sobre fundo azul desfocado com luzes de festa. Entre a foto e o texto, um pictograma chapado turquesa de bolo de aniversário com três velas acesas." },
          { n: "8", tag: "AUGUST", c: "purple", v: "lilac",
            lines: ["Father’s Day in Brazil is in August."],
            id: "w27p3b", alt: "Dois homens abraçados e sorrindo ao ar livre.",
            ph: "Foto redonda: dois homens adultos de barba, ao ar livre em um dia claro; o de trás abraça o outro por cima dos ombros e os dois sorriem. Entre a foto e o texto, um pictograma chapado roxo de duas pessoas se abraçando com um coração acima delas." },
          { n: "9", tag: "SEPTEMBER", c: "teal", v: "mint",
            lines: ["Independence Day in Brazil is on September 7th.", "Independence Day in Brazil is in September."],
            id: "w27p3c", alt: "Bandeira do Brasil tremulando contra o céu azul.",
            ph: "Foto redonda: bandeira do Brasil aberta e tremulando ao vento, presa a um mastro, com céu azul e nuvens brancas ao fundo. Entre a foto e o texto, um pictograma chapado turquesa de bandeira lisa em um mastro." },
          { n: "10", tag: "OCTOBER", c: "purple", v: "lilac",
            lines: ["Halloween is on October 31st.", "Halloween is in October."],
            id: "w27p3d", alt: "Abóbora de Halloween iluminada por dentro.",
            ph: "Foto redonda: abóbora de Halloween esculpida com cara sorridente e vela acesa por dentro, em um ambiente escuro com luzes alaranjadas e folhas secas ao redor. Entre a foto e o texto, um pictograma chapado roxo de fantasminha com os olhos e a boca vazados em branco." },
          { n: "11", tag: "NOVEMBER", c: "teal", v: "mint",
            lines: ["Katarine’s birthday is on November 2nd.", "Katarine’s birthday is in November."],
            id: "w27p3e", alt: "Balões brancos e rosa de festa de aniversário.",
            ph: "Foto redonda: buquê de balões brancos e rosa-claro de festa de aniversário, com fitas soltas, sobre fundo rosa suave. Entre a foto e o texto, um pictograma chapado turquesa de bolo de aniversário com três velas acesas (o mesmo de JULY)." },
          { n: "12", tag: "DECEMBER", c: "purple", v: "lilac",
            lines: ["Christmas is on December 25th.", "Christmas is in December."],
            id: "w27p3f", alt: "Árvore de Natal decorada com presentes embaixo.",
            ph: "Foto redonda: árvore de Natal decorada com luzes douradas e bolas vermelhas, dentro de uma sala aconchegante, com caixas de presente embrulhadas no chão. Entre a foto e o texto, um pictograma chapado roxo de árvore de Natal com uma estrela no topo." } ] },
        { t: "note", v: "cream", bar: true, text: "Use in para falar de meses e períodos.\nUse on para falar de datas específicas." } ] },

      // ───────────────────────────── página impressa 04 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 04" },
        { t: "title", en: "IN, ON & BIRTHDAYS", pt: "Use in com meses e on com datas." },
        { t: "cards", cols: 2, items: [
          { tag: "IN + MONTH", c: "teal", v: "mint",
            lines: ["Usamos in para falar de meses e períodos.", "My birthday is in December."],
            id: "w27p4a", alt: "Calendário azul-turquesa com um selo de confirmação.",
            ph: "Ilustração: calendário de mesa desenhado em traço azul-turquesa, com a grade de dias em cinza e um círculo turquesa com um visto branco no canto inferior direito. No centro da página, entre este calendário e o roxo do lado, um círculo azul-marinho com a palavra VS." },
          { tag: "ON + DATE", c: "purple", v: "lilac",
            lines: ["Usamos on para falar de datas específicas.", "My birthday is on December 1st."],
            id: "w27p4b", alt: "Calendário roxo com o dia 1 destacado e um selo de confirmação.",
            ph: "Ilustração: calendário de mesa desenhado em traço roxo, com a grade de dias em cinza, o quadradinho do dia 1 preenchido de roxo com o número 1 em branco e um círculo roxo com um visto branco no canto inferior direito." } ] },
        { t: "chips", items: [
          { t: "IN → MONTH", c: "teal" },
          { t: "ON → DATE", c: "purple" } ] },
        { t: "sec", text: "LET’S TALK ABOUT BIRTHDAYS", c: "teal" },
        { t: "image", id: "w27p4c", alt: "Mia e Leo conversando em uma cafeteria.",
          ph: "Foto: uma moça de cabelo castanho longo e suéter bege claro, sentada à mesa de madeira de uma cafeteria, conversa sorrindo com um rapaz de jaqueta jeans e camiseta branca. Sobre a mesa há duas xícaras de café e um caderno espiral com uma caneta. Ao fundo, luminárias pendentes e plantas." },
        { t: "dialogue", items: [
          { s: "a", text: "Mia: When is your birthday?" },
          { s: "b", text: "Leo: My birthday is in July. It’s on July 7th." },
          { s: "a", text: "Mia: What do you do on your birthday?" },
          { s: "b", text: "Leo: I have dinner with my family." },
          { s: "b", text: "Leo: When is your birthday?" },
          { s: "a", text: "Mia: My birthday is in November. It’s on November 2nd." },
          { s: "b", text: "Leo: What do you do on your birthday?" },
          { s: "a", text: "Mia: I go out with friends." } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "LEMBRE-SE", text: "in → para meses e períodos.\non → para datas específicas." } ] },

      // ───────────────────────────── página impressa 05 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 05" },
        { t: "title", en: "IN OR ON? YOUR TURN!", pt: "Complete as frases com in ou on." },
        { t: "cards", cols: 2, items: [
          { tag: "IN + MONTH", c: "teal", v: "mint", lines: ["Usamos in para meses e períodos.", "in July"] },
          { tag: "ON + DATE", c: "purple", v: "lilac", lines: ["Usamos on para datas específicas.", "on July 7th"] } ] },
        { t: "image", id: "w27p5a", alt: "Caderno com a lista Important Dates, caneta e xícara de café.",
          ph: "Foto vista de cima: caderno espiral aberto sobre uma mesa branca, com o título escrito à mão Important Dates e, abaixo, quatro itens marcados com vistos coloridos: Birthday, Vacation, Holidays e Special days. Ao lado do caderno, uma caneta azul-petróleo, um vaso pequeno com suculenta e uma xícara azul-clara com café preto." },
        { t: "fill", id: "w27e1", title: "COMPLETE AS FRASES COM IN OU ON", items: [
          { pre: "1. My birthday is", answers: ["in"], post: "December.", note: "bolo de aniversário", v: "mint" },
          { pre: "2. Christmas is", answers: ["on"], post: "December 25th.", note: "árvore de Natal", v: "lilac" },
          { pre: "3. Valentine’s Day is", answers: ["in"], post: "February.", note: "coração rosa", v: "mint" },
          { pre: "4. Independence Day in Brazil is", answers: ["on"], post: "September 7th.", note: "bandeira do Brasil", v: "lilac" },
          { pre: "5. My vacation starts", answers: ["in"], post: "April.", note: "mala de viagem amarela com uma câmera fotográfica ao lado", v: "mint" },
          { pre: "6. My vacation starts", answers: ["on"], post: "April 10th.", note: "calendário com um dia circulado", v: "lilac" } ] },
        { t: "note", v: "cream", bar: true, text: "Use in quando falamos de meses e períodos.\nUse on quando falamos de datas específicas." } ] },

      // ───────────────────────────── página impressa 06 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 06" },
        { t: "title", en: "MY YEAR", pt: "Fale sobre as suas datas importantes usando in e on." },
        { t: "cards", cols: 2, items: [
          { tag: "IN + MONTH", c: "teal", v: "mint", lines: ["Usamos in para meses e períodos.", "in May"] },
          { tag: "ON + DATE", c: "purple", v: "lilac", lines: ["Usamos on para datas específicas.", "on May 10th"] } ] },
        { t: "image", id: "w27p6a", alt: "Planner aberto com os doze meses do ano, caneta e recado colado.",
          ph: "Foto vista de cima: caderno espiral aberto sobre uma mesa clara, com o título escrito à mão MY PLANNER e, abaixo, uma grade de doze quadros vazios com os nomes dos meses em cores diferentes: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC. Ao lado, uma caneta verde-menta, um vaso com planta e um post-it verde-claro com a frase Make Good Memories! e um coração desenhado." },
        { t: "free", id: "w27f1", items: [
          { n: "1", kicker: "MY BIRTHDAY", prefix: "When is your birthday?", ideas: "My birthday is in ______.  ·  My birthday is on ______ ______.", v: "mint", c: "teal" },
          { n: "2", kicker: "MY VACATION", prefix: "My vacation is in ______.", ideas: "My vacation starts on ______ ______.", v: "lilac", c: "purple" },
          { n: "3", kicker: "ASK A PARTNER", prefix: "When is your birthday?", ideas: "What do you do on your birthday?", v: "cream", c: "yellow" } ] },
        { t: "note", v: "gray", text: "Você pode usar informações fictícias.\nPractice with a partner and have fun!" },
        { t: "sec", text: "MONTHS OF THE YEAR", c: "teal" },
        { t: "chips", items: [
          { t: "JAN", c: "teal" },
          { t: "FEB", c: "purple" },
          { t: "MAR", c: "red" },
          { t: "APR", c: "green" },
          { t: "MAY", c: "orange" },
          { t: "JUN", c: "teal" },
          { t: "JUL", c: "purple" },
          { t: "AUG", c: "green" },
          { t: "SEP", c: "orange" },
          { t: "OCT", c: "purple" },
          { t: "NOV", c: "red" },
          { t: "DEC", c: "teal" } ] },
        { t: "note", v: "gray", bar: true, text: "Use in para meses e períodos.\nUse on para datas específicas." } ] },

      // ───────────────────────────── página impressa 07 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 27", page: "PÁGINA 07" },
        { t: "title", en: "MONTHS OF THE YEAR", pt: "Agora você já sabe usar in com meses e on com datas para falar sobre o ano." },
        { t: "image", id: "w27p7a", alt: "Calendário de mesa com os doze meses do ano.",
          ph: "Ilustração: calendário de mesa apoiado em um cavalete azul-petróleo em forma de A, sobre uma superfície branca. No quadro do calendário, os doze meses abreviados em quadrinhos coloridos, em quatro linhas de três: JAN, FEB, MAR / APR, MAY, JUN / JUL, AUG, SEP / OCT, NOV, DEC. Ao lado, uma caneta verde-menta deitada e um vaso bege salpicado de branco com uma planta verde." },
        { t: "check", id: "w27c1", title: "EU CONSIGO...", items: [
          "reconhecer os 12 meses do ano;",
          "dizer os meses em sequência;",
          "compreender meses em datas;",
          "usar in + month;",
          "usar on + date;",
          "perguntar When is your birthday?;",
          "informar o mês do meu aniversário;",
          "informar uma data simples;",
          "falar brevemente sobre datas importantes." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "VIDEOAULA 27 · MONTHS OF THE YEAR", body: "Assista à videoaula completa desta aula e pratique sua compreensão.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA · MY IMPORTANT DATES", body: "Converse sobre seu aniversário, férias e outras datas usando os meses e as estruturas in/on desta aula.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "bar", label: "PROGRESSO", value: "27 DE 42 AULAS", pct: "64%" },
        { t: "note", v: "gray", text: "Continue assim! Você está no caminho certo." },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 28 · ORDINAL NUMBERS", body: "Vamos aprender a falar sobre ordem, posições e datas com números ordinais." } ] }
    ]
  },

  {
    id: 28, code: "AULA 28", title: "Ordinal Numbers", sub: "Fale sobre ordem e posição.",
    time: "15 minutos",
    pages: [
      // ───────────────────────────── página impressa 01 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28" },
        { t: "title", en: "ORDINAL NUMBERS", pt: "Talking about order and position." },
        { t: "lead", text: "Os números ordinais indicam ordem ou posição em uma lista." },
        { t: "image", id: "w28p1a", alt: "Três estudantes sorrindo e caminhando juntos com livros nos braços",
          ph: "Foto: três jovens estudantes caminhando lado a lado ao ar livre, diante de um prédio moderno de vidro com árvores ao fundo. À esquerda, uma moça de cabelo castanho longo, jaqueta jeans sobre camiseta branca, abraçando um caderno verde-azulado. No centro, um rapaz de cabelo escuro cacheado, camiseta verde-oliva e mochila preta, segurando um livro azul-escuro. À direita, uma moça de cabelo castanho ondulado, suéter amarelo-mostarda e mochila, segurando um livro roxo. Os três estão sorrindo e olhando um para o outro." },
        { t: "grid", cols: 2, items: [
          { title: "An ordinal number tells the position of something in a sequence.", v: "white", c: "teal" },
          { title: "Um número ordinal indica a posição de algo em uma sequência.", v: "white", c: "navy" } ] },
        { t: "grid", cols: 3, items: [
          { n: "1", title: "1st", body: "first", v: "mint", c: "teal" },
          { n: "2", title: "2nd", body: "second", v: "lilac", c: "purple" },
          { n: "3", title: "3rd", body: "third", v: "cream", c: "orange" } ] },
        { t: "note", v: "cream", bar: true, text: "Na Aula 27, você aprendeu a usar datas como July 7th e December 25th.\nAgora você vai descobrir como os números ordinais funcionam!" },
        { t: "sec", text: "NESTA AULA, VOCÊ VAI..." },
        { t: "grid", cols: 3, items: [
          { title: "compreender o que os números ordinais indicam;", v: "mint", c: "teal" },
          { title: "reconhecer 1st, 2nd e 3rd;", v: "lilac", c: "purple" },
          { title: "usar os sufixos st, nd, rd e th;", v: "cream", c: "yellow" },
          { title: "reconhecer 11th, 12th e 13th como casos especiais;", v: "mint", c: "teal" },
          { title: "ler números ordinais frequentes;", v: "lilac", c: "purple" },
          { title: "compreender ordinais compostos;", v: "cream", c: "yellow" },
          { title: "usar ordinais em posições e datas;", v: "mint", c: "teal" },
          { title: "reconhecer diferenças entre datas americanas e britânicas;", v: "lilac", c: "purple" },
          { title: "compreender ordinais em títulos, séculos e andares.", v: "cream", c: "yellow" } ] },
        { t: "note", v: "gray", bar: true, text: "Você está aprendendo cada vez mais!\nVamos juntos dar mais um passo no inglês." } ] },

      // ───────────────────────────── página impressa 02 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 02" },
        { t: "title", en: "HOW ORDINAL NUMBERS WORK", pt: "Aprenda a formar e reconhecer os números ordinais." },
        { t: "sec", text: "SUFFIXES – REGRAS" },
        { t: "lead", text: "Veja como os sufixos são usados." },
        { t: "steps", items: [
          { n: "1", tag: "st", lines: ["1st · first"], c: "teal", v: "mint" },
          { n: "2", tag: "nd", lines: ["2nd · second"], c: "purple", v: "lilac" },
          { n: "3", tag: "rd", lines: ["3rd · third"], c: "orange", v: "cream" },
          { n: "4+", tag: "th", lines: ["4th · fourth"], c: "navy", v: "gray" } ] },
        { t: "note", v: "gray", bar: true, kicker: "CASOS ESPECIAIS", text: "11, 12 e 13 sempre usam -th." },
        { t: "grid", cols: 3, items: [
          { title: "11th", body: "eleventh", v: "mint", c: "teal" },
          { title: "12th", body: "twelfth", v: "mint", c: "teal" },
          { title: "13th", body: "thirteenth", v: "mint", c: "teal" } ] },
        { t: "sec", text: "NÚMEROS ORDINAIS – PRINCIPAIS", c: "purple" },
        { t: "table", head: ["NUMERAL", "ORDINAL (ESCRITO)"], rows: [
          { a: "1st", b: "first", v: "mint" },
          { a: "2nd", b: "second", v: "lilac" },
          { a: "3rd", b: "third", v: "cream" },
          { a: "4th", b: "fourth", v: "mint" },
          { a: "5th", b: "fifth", v: "lilac" },
          { a: "6th", b: "sixth", v: "cream" },
          { a: "7th", b: "seventh", v: "mint" },
          { a: "8th", b: "eighth", v: "lilac" },
          { a: "9th", b: "ninth", v: "cream" },
          { a: "10th", b: "tenth", v: "mint" },
          { a: "11th", b: "eleventh", v: "lilac" },
          { a: "12th", b: "twelfth", v: "cream" },
          { a: "13th", b: "thirteenth", v: "mint" },
          { a: "14th", b: "fourteenth", v: "lilac" },
          { a: "15th", b: "fifteenth", v: "cream" },
          { a: "16th", b: "sixteenth", v: "mint" },
          { a: "17th", b: "seventeenth", v: "lilac" },
          { a: "18th", b: "eighteenth", v: "cream" },
          { a: "19th", b: "nineteenth", v: "mint" },
          { a: "20th", b: "twentieth", v: "lilac" } ] },
        { t: "table", head: ["NUMERAL", "ORDINAL (ESCRITO)"], rows: [
          { a: "30th", b: "thirtieth", v: "cream" },
          { a: "40th", b: "fortieth", v: "mint" },
          { a: "50th", b: "fiftieth", v: "lilac" },
          { a: "60th", b: "sixtieth", v: "cream" },
          { a: "70th", b: "seventieth", v: "mint" },
          { a: "80th", b: "eightieth", v: "lilac" },
          { a: "90th", b: "ninetieth", v: "cream" },
          { a: "100th", b: "hundredth", v: "mint" } ] },
        { t: "grid", cols: 1, items: [
          { title: "21st", body: "twenty-first", v: "mint", c: "teal" } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "LEMBRE-SE!", text: "Use st, nd, rd ou th de acordo com a regra e os casos especiais!" },
        { t: "sec", text: "EXEMPLOS RÁPIDOS – LEIA EM VOZ ALTA!" },
        { t: "grid", cols: 3, items: [
          { title: "1st", body: "first", v: "mint", c: "teal" },
          { title: "2nd", body: "second", v: "lilac", c: "purple" },
          { title: "3rd", body: "third", v: "cream", c: "orange" },
          { title: "4th", body: "fourth", v: "gray", c: "navy" },
          { title: "11th", body: "eleventh", v: "mint", c: "teal" },
          { title: "21st", body: "twenty-first", v: "lilac", c: "purple" },
          { title: "100th", body: "hundredth", v: "gray", c: "navy" } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "DICA", text: "Quando o número termina em 1, 2 ou 3, usamos st, nd e rd.\nNos demais números, usamos th. Mas 11, 12 e 13 são especiais!" } ] },

      // ───────────────────────────── página impressa 03 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 03" },
        { t: "title", en: "COMPOUND ORDINALS & POSITION", pt: "Usamos números ordinais para indicar ordem e posição." },
        { t: "image", id: "w28p3a", alt: "Homem escrevendo em um caderno ao lado de um notebook",
          ph: "Foto: homem jovem de camisa jeans sobre camiseta branca, cabelo escuro curto, sentado a uma mesa de madeira clara perto de uma janela. Ele sorri enquanto escreve com uma caneta em um caderno aberto; à direita, um notebook prateado aberto; à esquerda, um copo de café para viagem com tampa marrom. Ao fundo, prateleiras e uma planta verde." },
        { t: "sec", text: "1 · COMPOUND ORDINALS", c: "purple" },
        { t: "lead", text: "Em números compostos, somente a última parte fica na forma ordinal." },
        { t: "cards", cols: 2, items: [
          { tag: "21st", c: "teal", v: "mint", lines: ["twenty-first"], note: "21 → twenty-first" },
          { tag: "221st", c: "purple", v: "lilac", lines: ["two hundred twenty-first"], note: "221 → two hundred twenty-first" } ] },
        { t: "sec", text: "2 · POSITION IN CONTEXT" },
        { t: "cards", cols: 2, items: [
          { tag: "IN THE ALPHABET", c: "teal", v: "mint", id: "w28p3b", alt: "Letra K verde apoiada em uma pilha de livros",
            ph: "Foto: uma letra K grande, de madeira pintada de verde, em pé sobre uma mesa de madeira clara, encostada em uma pilha de três livros. À esquerda, um pequeno vaso branco com uma planta verde; parede branca ao fundo.",
            lines: ["K is the eleventh letter of the alphabet.", "11th · eleventh"], note: "11th = eleventh (11º)" },
          { tag: "IN THE FAMILY", c: "purple", v: "lilac", id: "w28p3c", alt: "Família de cinco pessoas sentada sorrindo em um sofá",
            ph: "Foto: família de cinco pessoas sentada em um sofá bege-claro, todos sorrindo e olhando uns para os outros. Da esquerda para a direita: um menino de camiseta amarelo-mostarda, em primeiro plano; o pai, de barba curta e camisa verde-escura, logo atrás dele; uma menina de camiseta rosa; uma menina maior de camiseta listrada preto e branco; e a mãe, de suéter bege claro. Parede clara ao fundo.",
            lines: ["My parents have three children.", "I’m the second one.", "2nd · second"], note: "2nd = second (2º)" } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "LEMBRE-SE!", text: "Os números ordinais ajudam a dizer a posição de algo na ordem." },
        { t: "steps", items: [
          { n: "1", tag: "first", lines: ["(primeiro)"], c: "teal", v: "mint" },
          { n: "2", tag: "second", lines: ["(segundo)"], c: "purple", v: "lilac" },
          { n: "3", tag: "third", lines: ["(terceiro)"], c: "orange", v: "cream" } ] },
        { t: "key", v: "cream", text: "Você já sabe os números cardinais. Agora, aprenda a usar os ordinais para falar sobre ordem e posição!" } ] },

      // ───────────────────────────── página impressa 04 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 04" },
        { t: "title", en: "ORDINAL NUMBERS IN DATES", pt: "Usamos números ordinais para dizer datas em inglês." },
        { t: "image", id: "w28p4a", alt: "Calendário de mesa de abril de 2024 com o dia 10 circulado",
          ph: "Foto: calendário de mesa branco com espiral metálica, em pé sobre uma mesa de madeira clara. Na folha, o título APRIL 2024 em azul-petróleo, a grade dos dias da semana (SUN a SAT) e o número 10 circulado em vermelho. À esquerda, um pequeno vaso branco com suculenta; à frente, uma caneta prateada sobre uma folha de papel; à direita, uma caneca azul-acinzentada." },
        { t: "sec", text: "1 · AMERICAN ENGLISH" },
        { t: "cards", cols: 2, items: [
          { tag: "FORMA ESCRITA", c: "teal", v: "mint", lines: ["April 10, 2024"] },
          { tag: "LEITURA", c: "purple", v: "lilac", lines: ["April tenth,", "two thousand twenty-four."] } ] },
        { t: "sec", text: "EXEMPLOS" },
        { t: "rows", items: [
          { text: "My birthday is on June 2nd.", c: "teal" },
          { text: "Christmas is on December 25th.", c: "teal" },
          { text: "New Year’s Day is on January 1st.", c: "teal" } ] },
        { t: "sec", text: "2 · BRITISH ENGLISH", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "FORMA ESCRITA", c: "purple", v: "lilac", lines: ["10 April 2024"] },
          { tag: "LEITURA", c: "purple", v: "lilac", lines: ["The tenth of April,", "two thousand twenty-four."] } ] },
        { t: "sec", text: "EXEMPLOS", c: "purple" },
        { t: "rows", items: [
          { text: "My birthday is on the 2nd of June.", c: "purple" },
          { text: "Christmas is on the 25th of December.", c: "purple" },
          { text: "New Year’s Day is on the 1st of January.", c: "purple" } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "ALERTA IMPORTANTE!", text: "Em datas escritas somente com números, como 5/11, o significado pode mudar de acordo com o país.\nNo WSA English, prefira sempre escrever o mês por extenso." },
        { t: "sec", text: "PODE SER:" },
        { t: "grid", cols: 2, items: [
          { kicker: "AMERICAN ENGLISH", title: "May 11th", v: "mint", c: "teal" },
          { kicker: "BRITISH ENGLISH", title: "5th November", v: "lilac", c: "purple" } ] },
        { t: "sec", text: "PRACTICE!" },
        { t: "lead", text: "Pergunte e responda sobre datas." },
        { t: "dialogue", items: [
          { s: "a", text: "When is your birthday?" },
          { s: "b", text: "My birthday is on July 7th." },
          { s: "a", text: "When is Christmas?" },
          { s: "b", text: "Christmas is on December 25th." } ] },
        { t: "key", v: "cream", text: "Os números ordinais tornam as datas claras e organizadas. Vamos continuar aprendendo mais e mais!" } ] },

      // ───────────────────────────── página impressa 05 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 05" },
        { t: "title", en: "OTHER USES OF ORDINAL NUMBERS", pt: "Os números ordinais também aparecem em títulos, séculos e andares." },
        { t: "image", id: "w28p5a", alt: "Big Ben e o Parlamento de Londres com a bandeira do Reino Unido",
          ph: "Foto: a torre do relógio Big Ben e o Palácio de Westminster, em Londres, vistos de baixo sob um céu azul com nuvens brancas. Em primeiro plano, à esquerda, a bandeira do Reino Unido (Union Jack) tremulando em um mastro dourado." },
        { t: "sec", text: "1 · TÍTULOS", c: "purple" },
        { t: "lead", text: "Usamos ordinais para ler títulos de reis, rainhas, papas, etc." },
        { t: "image", id: "w28p5b", alt: "Retrato da rainha Elizabeth II com tiara e colar de pérolas",
          ph: "Foto: retrato circular da rainha Elizabeth II, idosa, de cabelos brancos, usando uma tiara de diamantes, brincos de diamante, colar de pérolas e vestido creme com faixa azul e insígnias honoríficas. Ela sorri levemente; fundo marrom-escuro." },
        { t: "cards", cols: 1, items: [
          { tag: "Historical example", c: "purple", v: "lilac", lines: ["Elizabeth II", "→ Elizabeth the Second"], note: "Exemplo histórico." } ] },
        { t: "sec", text: "2 · SÉCULOS" },
        { t: "lead", text: "Usamos ordinais para falar sobre séculos." },
        { t: "image", id: "w28p5c", alt: "Arranha-céus de vidro refletidos em um rio sob céu azul",
          ph: "Foto: skyline de uma cidade moderna, com arranha-céus de vidro azul sob um céu ensolarado. À frente, um rio calmo refletindo os prédios, uma passarela para pedestres e árvores verdes ao longo da margem." },
        { t: "cards", cols: 1, items: [
          { tag: "21st century", c: "teal", v: "mint", lines: ["twenty-first century"], note: "Ex.: We live in the twenty-first century. · Vivemos no século XXI." } ] },
        { t: "sec", text: "3 · ANDARES" },
        { t: "sec", text: "BRITISH ENGLISH" },
        { t: "cards", cols: 2, items: [
          { tag: "ground floor", c: "teal", v: "mint", lines: ["(térreo)"], note: "É o andar de entrada do prédio." },
          { tag: "1st floor", c: "teal", v: "mint", lines: ["(primeiro andar)"], note: "Vem depois do ground floor." } ] },
        { t: "image", id: "w28p5d", alt: "Prédio moderno de três andares com grandes janelas de vidro",
          ph: "Ilustração: render 3D de um prédio moderno de três pavimentos, com fachada cinza-escura, grandes janelas de vidro e interiores iluminados onde se veem móveis, plantas nas varandas e arbustos verdes na entrada. Na página impressa ele fica no centro do quadro ANDARES: pontos azul-petróleo à esquerda ligam-no às caixas BRITISH ENGLISH e pontos roxos à direita, às caixas AMERICAN ENGLISH, marcando a altura de cada andar." },
        { t: "sec", text: "AMERICAN ENGLISH", c: "purple" },
        { t: "cards", cols: 2, items: [
          { tag: "1st floor", c: "purple", v: "lilac", lines: ["(primeiro andar)"], note: "Corresponde ao ground floor britânico." },
          { tag: "2nd floor", c: "purple", v: "lilac", lines: ["(segundo andar)"], note: "Corresponde ao 1st floor britânico." } ] },
        { t: "note", v: "cream", bar: true, text: "A numeração dos andares muda entre o inglês americano e o britânico.\nQual é o seu sistema?" },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "LEMBRE-SE!", text: "Números ordinais ajudam a organizar o mundo ao nosso redor: nomes, tempos, posições e lugares!" } ] },

      // ───────────────────────────── página impressa 06 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 06" },
        { t: "title", en: "ORDINAL NUMBERS", pt: "Your turn!" },
        { t: "sec", text: "1 · READ ALOUD!" },
        { t: "lead", text: "Leia os números ordinais em voz alta." },
        { t: "image", id: "w28p6a", alt: "Dois jovens sorrindo lado a lado estudando com caderno e notebook",
          ph: "Foto: uma jovem de cabelo castanho longo e jaqueta jeans e um rapaz de cabelo escuro cacheado e suéter verde-oliva sentados lado a lado a uma mesa, sorrindo e olhando um para o outro. Sobre a mesa, um caderno aberto com um lápis na mão dela, um notebook prateado aberto, um caderno preto e um copo de café para viagem com tampa marrom. Ao fundo, janelas amplas e uma planta." },
        { t: "rows", items: [
          { n: "1", text: "25th", c: "purple" },
          { n: "2", text: "46th", c: "purple" },
          { n: "3", text: "134th", c: "purple" },
          { n: "4", text: "92nd", c: "purple" },
          { n: "5", text: "63rd", c: "purple" },
          { n: "6", text: "57th", c: "purple" },
          { n: "7", text: "28th", c: "purple" } ] },
        { t: "sec", text: "2 · LET’S TALK!" },
        { t: "lead", text: "Leia o diálogo com atenção e pratique com um colega." },
        { t: "dialogue", items: [
          { s: "a", text: "Mia: Do you have brothers or sisters?" },
          { s: "b", text: "Leo: Yes. I have two sisters." },
          { s: "a", text: "Mia: Are you the first child?" },
          { s: "b", text: "Leo: No, I’m not. I’m the second one." },
          { s: "a", text: "Mia: When is your birthday?" },
          { s: "b", text: "Leo: My birthday is on July 7th." },
          { s: "a", text: "Mia: What floor is your English class on?" },
          { s: "b", text: "Leo: It’s on the third floor." } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "DICA!", text: "Os números ordinais indicam ordem ou posição e aparecem em datas, posições, títulos e outros usos." } ] },

      // ───────────────────────────── página impressa 07 ─────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 28", page: "PÁGINA 07" },
        { t: "title", en: "ORDINAL NUMBERS", pt: "Você já sabe falar sobre ordem e posição em inglês." },
        { t: "check", id: "w28c1", title: "EU CONSIGO...", items: [
          "compreender o que um número ordinal indica;",
          "reconhecer 1st, 2nd e 3rd;",
          "usar st, nd, rd e th;",
          "reconhecer 11th, 12th e 13th como casos especiais;",
          "ler números ordinais frequentes;",
          "compreender ordinais compostos;",
          "usar ordinais em posições e datas;",
          "reconhecer diferenças básicas entre datas americanas e britânicas;",
          "compreender ordinais em títulos, séculos e andares." ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 28", body: "VIDEOAULA 28 · ORDINAL NUMBERS. Aprofunde com o professor.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "ORDINALS IN REAL LIFE: pratique números ordinais em posições, datas e situações do cotidiano.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 29 · UNIT REVIEW", body: "Você vai revisar tudo o que aprendeu até aqui." },
        { t: "bar", label: "PROGRESSO", value: "28 DE 42 AULAS", pct: "67%" } ] }
    ]
  },

  {
    id: 29, code: "AULA 29", title: "Unit Review", sub: "Revise casa, there is / there are, dias, meses, datas e preposições.",
    time: "15 minutos",
    pages: [
      // ───────────────────────── página impressa 01 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29" },
        { t: "title", en: "UNIT REVIEW", pt: "Revisão da unidade: casa, there is / there are, dias, meses, números ordinais, datas e preposições." },
        { t: "chips", items: [
          { t: "HOUSE", c: "navy" },
          { t: "THERE IS / THERE ARE", c: "navy" },
          { t: "DAYS", c: "navy" },
          { t: "MONTHS", c: "navy" },
          { t: "ORDINAL NUMBERS", c: "navy" },
          { t: "DATES", c: "navy" },
          { t: "PREPOSITIONS", c: "navy" } ] },
        { t: "image", id: "w29p1a",
          alt: "Casa de três andares em corte, mostrando todos os cômodos mobiliados.",
          ph: "Foto: maquete realista de uma casa de dois andares mais térreo, vista em corte lateral, como uma casa de bonecas aberta de frente. Telhado escuro de duas águas com chaminé de tijolos, céu azul com nuvens brancas e gramado verde com arbustos e um caminho de pedras na frente. No andar de cima, à esquerda, um quarto com cama de casal e colcha azul-marinho, abajures acesos e quadro na parede; à direita, um closet de madeira clara com roupas penduradas e um vaso de planta. No andar do meio, à esquerda, uma cozinha branca com geladeira de inox, fogão, coifa, ilha com dois banquinhos e plantas; à direita, uma sala de estar com sofá cinza, poltrona, mesa de centro de madeira, luminária de chão e uma planta grande. No térreo, à esquerda, um banheiro com box de vidro, vaso sanitário, bancada com cuba e espelho redondo; à direita, um segundo quarto com cama de solteiro, criado-mudo e quadro na parede. Toda a casa está com as luzes acesas em tom quente." },
        { t: "image", id: "w29p1b",
          alt: "Calendário de mesa ao lado de um caderno com caneta e um relógio azul.",
          ph: "Foto: sobre uma mesa de madeira clara, um calendário de mesa espiralado em pé, com o cabeçalho SUN MON TUE WED THU FRI SAT em faixa azul-marinho e os domingos em vermelho, mostrando os dias de 1 a 31. À frente, um caderno pautado aberto com uma caneta preta apoiada sobre as folhas. À direita, um relógio despertador redondo de moldura azul-marinho e mostrador branco, marcando cerca de 10h10. Ao fundo, um vaso branco com uma planta verde e uma cortina clara desfocada." },
        { t: "cards", cols: 2, items: [
          { tag: "HOME", c: "teal", v: "mint", lines: ["House & Furniture", "There is / There are"] },
          { tag: "CALENDAR & TIME", c: "green", v: "mint", lines: ["Days", "Months", "Ordinal Numbers", "Dates", "Prepositions"] } ] },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 min" } ] },

      // ───────────────────────── página impressa 02 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 02" },
        { t: "title", en: "MARK’S HOUSE", pt: "Leia o texto sobre a casa do Mark." },
        { t: "sec", text: "READ THE TEXT." },
        { t: "note", v: "mint", bar: true, text: "My name is Mark. I live in a house. In my house there isn’t a dining room but there is a living room and a kitchen. There are three bedrooms and two bathrooms. There isn’t a garage in my house." },
        { t: "note", v: "lilac", bar: true, text: "In my bedroom there is a double bed, a bedside table, a wardrobe, a dresser, a TV and a mirror." },
        { t: "image", id: "w29p2a",
          alt: "Quarto com cama de casal, criados-mudos e abajures acesos.",
          ph: "Foto: quarto de casal amplo e claro, com parede verde-acinzentada e um quadro abstrato em moldura clara acima da cabeceira. Cama de casal com cabeceira estofada bege, colcha branca e almofadas cinza e brancas. De cada lado, um criado-mudo de madeira escura com um abajur de cúpula branca aceso. À direita, uma janela alta com cortina bege clara e um vaso com planta verde no chão. Piso de madeira clara." },
        { t: "note", v: "mint", bar: true, text: "In my kitchen there are some cupboards, a stove with a large oven, a sink, a microwave oven and a refrigerator." },
        { t: "image", id: "w29p2b",
          alt: "Cozinha branca com fogão, coifa e mesa redonda de jantar.",
          ph: "Foto: cozinha clara com armários brancos até o teto, coifa de inox sobre o fogão e forno embutido, bancada branca com potes, tábua e plantinhas. Luminária pendente preta sobre uma mesa redonda de madeira com quatro cadeiras estofadas cinza-escuras e uma fruteira com maçãs verdes no centro. À direita, uma janela com vista clara e um vaso com planta verde grande. Piso de madeira clara." },
        { t: "note", v: "lilac", bar: true, text: "In my living room there is another TV, two armchairs, a sofa, curtains, and a coffee table. There are also some pictures on the wall." },
        { t: "image", id: "w29p2c",
          alt: "Sala de estar com sofá, mesa de centro e TV sobre um rack de madeira.",
          ph: "Foto: sala de estar clara com sofá bege e almofada azul-marinho à esquerda, mesa de centro retangular de tampo claro e estrutura preta sobre um tapete cinza, com uma revista e um vasinho de suculenta em cima. À direita, um rack baixo de madeira com uma televisão de tela grande desligada, um vaso com planta pequena ao lado e uma planta alta em vaso de cimento no canto. Parede bege lisa e piso de madeira clara." },
        { t: "note", v: "mint", bar: true, text: "In my bathroom there is a bathtub, a shower, a toilet, a rug, two sinks, two cabinets and two mirrors" },
        { t: "image", id: "w29p2d",
          alt: "Banheiro com banheira embutida e bancada com duas cubas e dois espelhos.",
          ph: "Foto: banheiro revestido de porcelanato bege claro. À esquerda, uma banheira retangular embutida com torneira de parede e um nicho na parede com uma plantinha verde. À direita, uma bancada de madeira clara com duas cubas quadradas brancas de apoio, duas torneiras e dois espelhos grandes na parede, com uma plantinha em vaso branco entre as cubas. Iluminação quente e difusa." } ] },

      // ───────────────────────── página impressa 03 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 03" },
        { t: "title", en: "TRUE OR FALSE?", pt: "Responda sobre o texto da página anterior." },
        { t: "sec", text: "DO YOU HAVE A GOOD MEMORY?" },
        { t: "mc", id: "w29mc1", title: "TRUE OR FALSE?", v: "gray", questions: [
          { q: "1) His name is Marcos.", options: ["True", "False"], answer: 1 },
          { q: "2) There isn’t a dining room in his house.", options: ["True", "False"], answer: 0 },
          { q: "3) There are two bedrooms in his house.", options: ["True", "False"], answer: 1 },
          { q: "4) There is a single bed in his bedroom.", options: ["True", "False"], answer: 1 },
          { q: "5) There are some cupboards in his kitchen.", options: ["True", "False"], answer: 0 },
          { q: "6) His stove has a small oven.", options: ["True", "False"], answer: 1 },
          { q: "7) There is a sofa and two armchairs in his living room.", options: ["True", "False"], answer: 0 },
          { q: "8) There isn’t a bathtub in his bathroom.", options: ["True", "False"], answer: 1 },
          { q: "9) There is only one sink in his bathroom.", options: ["True", "False"], answer: 1 },
          { q: "10) There are two mirrors in his bathroom.", options: ["True", "False"], answer: 0 } ] } ] },

      // ───────────────────────── página impressa 04 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 04" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira o gabarito do True or False." },
        { t: "sec", text: "TRUE OR FALSE: ANSWER KEY" },
        { t: "meta", label: "SCORE", value: "___ / 10" },
        { t: "rows", items: [
          { n: "1", text: "False. His name is Mark.", c: "red" },
          { n: "2", text: "True.", c: "green" },
          { n: "3", text: "False. There are three bedrooms.", c: "red" },
          { n: "4", text: "False. There is a double bed.", c: "red" },
          { n: "5", text: "True.", c: "green" },
          { n: "6", text: "False. The stove has a large oven.", c: "red" },
          { n: "7", text: "True.", c: "green" },
          { n: "8", text: "False. There is a bathtub.", c: "red" },
          { n: "9", text: "False. There are two sinks.", c: "red" },
          { n: "10", text: "True.", c: "green" } ] } ] },

      // ───────────────────────── página impressa 05 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 05" },
        { t: "title", en: "CORRECT THE MISTAKES", pt: "Encontre os erros da conversa entre Mark e Nancy." },
        { t: "sec", text: "DAYS • MONTHS • DATES • PREPOSITIONS" },
        { t: "lead", text: "Read the conversation between Mark and Nancy." },
        { t: "note", v: "lilac", bar: true, bold: true, text: "There are 11 mistakes. Find and correct them on the next page." },
        { t: "cards", cols: 2, items: [
          { tag: "MARK", c: "teal", v: "mint", id: "w29p5a",
            alt: "Retrato do Mark, rapaz de camisa jeans, sorrindo.",
            ph: "Foto em recorte circular: rapaz jovem de pele clara, cabelo escuro ondulado e curto, vestindo camisa jeans azul aberta sobre camiseta branca. Ele sorri de lado, olhando para fora do quadro. Ao fundo, uma estante de madeira desfocada em tons quentes." },
          { tag: "NANCY", c: "purple", v: "lilac", id: "w29p5b",
            alt: "Retrato da Nancy, moça de blusa rosa, sorrindo.",
            ph: "Foto em recorte circular: moça jovem de pele clara, cabelo castanho longo e liso solto sobre os ombros, vestindo blusa de tricô rosa claro. Ela sorri olhando para fora do quadro. Ao fundo, uma parede clara com uma planta verde desfocada." } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Mark: Hi, Nancy! What are you doing March the 21st?" },
          { s: "b", text: "Nancy: Hi, Mark! Why we don’t go to the shopping center?" },
          { s: "a", text: "Mark: That’s a good idea! When you are free?" },
          { s: "b", text: "Nancy: I’m free at Thursday." },
          { s: "a", text: "Mark: OK! What time? I have a English class." },
          { s: "b", text: "Nancy: What their hours are on Thursday?" },
          { s: "a", text: "Mark: The class starts at the morning." },
          { s: "b", text: "Nancy: Oh, I see. But sunday is better for me." },
          { s: "a", text: "Mark: Why sunday?" },
          { s: "b", text: "Nancy: Because I have class on Saturday." },
          { s: "a", text: "Mark: Great! How about at sunday afternoon at the shopping center?" },
          { s: "b", text: "Nancy: Perfect! How about in 3:00 o’clock?" } ] },
        { t: "note", v: "cream", bar: true, kicker: "FIND THE MISTAKES", text: "Check grammar, spelling, articles, prepositions, formations of questions and use of capital letters." } ] },

      // ───────────────────────── página impressa 06 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 06" },
        { t: "title", en: "CHECK THE CORRECTIONS", pt: "Compare suas respostas com o gabarito." },
        { t: "sec", text: "COMPARE YOUR ANSWERS." },
        { t: "sec", text: "DATES", c: "teal" },
        { t: "compare", items: [
          { wrong: "March the 21st", right: "March 21st" } ] },
        { t: "sec", text: "QUESTIONS", c: "purple" },
        { t: "compare", items: [
          { wrong: "Why we don’t…?", right: "Why don’t we…?" },
          { wrong: "When you are free?", right: "When are you free?" },
          { wrong: "What their hours are…?", right: "What are their hours…?" } ] },
        { t: "sec", text: "ARTICLES & CAPITAL LETTERS", c: "orange" },
        { t: "compare", items: [
          { wrong: "thursday", right: "Thursday" },
          { wrong: "a English class", right: "an English class" },
          { wrong: "sunday", right: "Sunday" } ] },
        { t: "sec", text: "PREPOSITIONS", c: "blue" },
        { t: "compare", items: [
          { wrong: "at Thursday", right: "on Thursday" },
          { wrong: "at the morning", right: "in the morning" },
          { wrong: "at sunday afternoon", right: "on Sunday afternoon" },
          { wrong: "in 3:00 o’clock", right: "at 3:00" } ] } ] },

      // ───────────────────────── página impressa 07 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 07" },
        { t: "title", en: "PUT IT ALL TOGETHER", pt: "Junte tudo o que você estudou nesta unidade." },
        { t: "sec", text: "USE WHAT YOU KNOW." },
        { t: "lead", text: "Write your own answers. Use what you studied in this unit." },
        { t: "sec", text: "1 · HOME", c: "teal" },
        { t: "note", v: "mint", text: "Write three sentences about your home. Use there is / there are." },
        { t: "image", id: "w29p7a",
          alt: "Sala de estar com sofá claro, mesa de centro e plantas.",
          ph: "Foto: sala de estar clara e aconchegante, com sofá de três lugares em tecido bege e almofadas verde-escuras, mesa de centro redonda de madeira com um vaso de suculenta e uma xícara, tapete cinza claro no chão. À esquerda, uma luminária de chão preta e um vaso grande com planta de folhas largas; ao fundo, um quadro emoldurado com paisagem de montanhas e uma estante de madeira com vários vasos brancos de plantas. Piso de madeira clara." },
        { t: "free", id: "w29f1", cols: 1, items: [
          { n: "1", kicker: "HOME", prefix: "(There is…)", ideas: "", v: "mint", c: "teal" },
          { n: "2", kicker: "HOME", prefix: "(There are…)", ideas: "", v: "mint", c: "teal" },
          { n: "3", kicker: "HOME", prefix: "(There isn’t / There aren’t…)", ideas: "", v: "mint", c: "teal" } ] },
        { t: "sec", text: "2 · DATE", c: "purple" },
        { t: "note", v: "lilac", text: "Complete the sentence. Use a month and an ordinal number." },
        { t: "image", id: "w29p7b",
          alt: "Calendário de mesa entre um vaso de planta e um vaso decorativo.",
          ph: "Foto: calendário de mesa espiralado, de papel branco, apoiado sobre uma mesa de madeira clara, mostrando a grade de dias do mês em letras pequenas e cinza. À esquerda, um vaso branco com uma planta verde de folhas pequenas; à direita, um vaso bege claro com ramos secos. Parede de fundo branca e iluminação suave." },
        { t: "free", id: "w29f2", cols: 1, items: [
          { n: "1", kicker: "DATE", prefix: "My birthday is on", ideas: "", v: "lilac", c: "purple" } ] },
        { t: "sec", text: "3 · DAY & TIME", c: "yellow" },
        { t: "note", v: "cream", text: "Answer the question. Use a day and a time." },
        { t: "image", id: "w29p7c",
          alt: "Relógio despertador de madeira sobre uma mesa, ao lado de uma plantinha.",
          ph: "Foto: relógio despertador redondo com moldura de madeira clara e mostrador branco com números pretos de 1 a 12, marcando cerca de 10h10, apoiado sobre uma superfície clara. À direita, um vaso branco com uma plantinha verde. Ao fundo, uma parede clara e uma janela desfocada com luz natural." },
        { t: "note", v: "cream", bold: true, text: "When are you free?" },
        { t: "free", id: "w29f3", cols: 1, items: [
          { n: "1", kicker: "DAY", prefix: "I’m free on", ideas: "(day)", v: "cream", c: "yellow" },
          { n: "2", kicker: "TIME", prefix: "at", ideas: "(time)", v: "cream", c: "yellow" } ] },
        { t: "image", id: "w29p7d",
          alt: "Rapaz de camisa jeans sorrindo enquanto escreve em um caderno.",
          ph: "Foto: rapaz jovem de cabelo escuro ondulado, camisa jeans azul aberta sobre camiseta branca, sentado a uma mesa branca em uma sala clara. Ele sorri olhando para baixo enquanto escreve com a mão direita em um caderno aberto. À direita, um porta-lápis preto com lápis e canetas; ao fundo, prateleiras desfocadas com livros e plantas." },
        { t: "key", v: "cream", text: "KEEP GOING! You can use what you know. Practice a little every day. Great job!" } ] },

      // ───────────────────────── página impressa 08 ─────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 29", page: "PÁGINA 08" },
        { t: "title", en: "GREAT JOB!", pt: "Você concluiu o Unit Review." },
        { t: "image", id: "w29p8a",
          alt: "Rapaz e moça batendo um high five por cima da mesa de estudos.",
          ph: "Foto: um rapaz de camisa jeans azul sobre camiseta branca e uma moça de blusa rosa claro, sentados lado a lado a uma mesa de madeira, sorrindo e batendo as mãos em um high five no alto. Sobre a mesa, um livro aberto e outro livro fechado; ao fundo, uma estante clara com livros e um vaso com planta verde." },
        { t: "kicker", text: "You completed the Unit Review. Let’s see what you can do now." },
        { t: "check", id: "w29c1", title: "EU CONSIGO...", items: [
          "Descrever minha casa e os cômodos com there is / there are.",
          "Usar a forma negativa com there isn’t / there aren’t.",
          "Falar sobre móveis e objetos da casa.",
          "Usar days of the week corretamente.",
          "Usar months e ordinal numbers em datas.",
          "Usar in, on e at com datas, dias e horários.",
          "Fazer e responder perguntas com what e when.",
          "Identificar e corrigir erros comuns em frases." ] },
        { t: "image", id: "w29p8b",
          alt: "Casa de dois andares ao lado de um calendário de mesa e um relógio de parede.",
          ph: "Ilustração: composição em 3D realista sobre fundo branco. No alto, uma casa de dois andares com paredes bege claro, telhado escuro de duas águas, porta de madeira, janelas iluminadas em amarelo, garagem e um jardim verde com arbustos e uma árvore na base. Logo abaixo, um calendário de mesa espiralado com o cabeçalho SUN MON TUE WED THU FRI SAT, com os números 15 e 21 circulados em roxo, e, à frente dele, um relógio de parede redondo de moldura preta e mostrador branco, com ponteiros pretos e ponteiro de segundos vermelho, marcando cerca de 10h10." },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 29", body: "AULA 29: UNIT REVIEW. Revise os conteúdos desta aula assistindo à videoaula completa.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Converse com a IA e coloque em prática o que você aprendeu. MISSÃO ORAL: Descreva sua casa. Depois, diga um dia e um horário em que você está livre.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "bar", label: "PROGRESSO", value: "29 DE 42 AULAS", pct: "69%" },
        { t: "note", v: "cream", bold: true, center: true, text: "Continue assim! Você está evoluindo!" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 30 · PLACES IN A CITY" } ] }
    ]
  },

  {
    id: 30, code: "AULA 30", title: "Places in a City", sub: "Conheça os lugares de uma cidade em inglês.",
    time: "14 minutos",
    pages: [
      // ── página impressa 01 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30" },
        { t: "title", en: "PLACES IN A CITY", pt: "CITY VOCABULARY" },
        { t: "lead", text: "In this lesson, you will learn the names of some important places in a city." },
        { t: "image", id: "w30p1a", alt: "Vista panorâmica de uma cidade grande com arranha-céus, rio e parque.",
          ph: "Foto: vista aérea de uma cidade grande em dia de sol. À direita, um conjunto de arranha-céus de vidro azul; ao centro, um rio largo atravessado por uma ponte de concreto; à esquerda e em primeiro plano, um parque arborizado verde com avenidas e carros. Céu azul com nuvens brancas." },
        { t: "sec", text: "MEET THE PLACES" },
        { t: "lead", text: "Look, listen and repeat." },
        { t: "steps", items: [
          { n: "1", tag: "UNIVERSITY", c: "purple", v: "white", id: "w30v01",
            alt: "Prédio histórico de uma universidade com colunas.",
            ph: "Foto: fachada de um prédio histórico de universidade, em pedra clara, com escadaria, colunas e frontão triangular. Gramado verde e árvores na frente, alunos caminhando." },
          { n: "2", tag: "DRUGSTORE / PHARMACY", c: "purple", v: "white", id: "w30v02",
            alt: "Fachada de uma farmácia com letreiro verde PHARMACY.",
            ph: "Foto: fachada de farmácia com letreiro verde escrito PHARMACY e uma cruz branca ao lado. Vitrine de vidro mostrando prateleiras cheias de caixas de remédios coloridas." },
          { n: "3", tag: "SUPERMARKET", c: "purple", v: "white", id: "w30v03",
            alt: "Corredor de supermercado com frutas e um carrinho.",
            ph: "Foto: corredor de supermercado com prateleiras verdes de frutas e verduras dos dois lados, laranjas e maçãs em destaque, e um carrinho de compras vazio parado no meio do corredor." },
          { n: "4", tag: "BUS STOP", c: "purple", v: "white", id: "w30v04",
            alt: "Pessoas esperando em um ponto de ônibus enquanto um ônibus azul chega.",
            ph: "Foto: ponto de ônibus coberto, de vidro, com quatro pessoas em pé esperando. Um ônibus urbano azul se aproxima pela rua. Árvores verdes e céu azul ao fundo." },
          { n: "5", tag: "PARK", c: "purple", v: "white", id: "w30v05",
            alt: "Parque arborizado com gramado e pessoas sentadas.",
            ph: "Foto: parque com fileiras de árvores altas e copas verdes, caminho de pedestres ao centro e gramado dos lados, com grupos de pessoas sentadas na grama em dia ensolarado." },
          { n: "6", tag: "PARKING LOT", c: "purple", v: "white", id: "w30v06",
            alt: "Estacionamento com carros enfileirados e placa azul com a letra P.",
            ph: "Foto: estacionamento ao ar livre com carros prateados e cinzas enfileirados nas vagas demarcadas. Uma placa azul quadrada com a letra P branca fica à direita, e há árvores ao fundo." },
          { n: "7", tag: "AQUARIUM", c: "purple", v: "white", id: "w30v07",
            alt: "Visitantes diante de um grande túnel de aquário.",
            ph: "Foto: interior escuro de um aquário. Um grande painel de vidro curvo, iluminado em azul, mostra uma arraia e peixes nadando. Quatro visitantes em silhueta observam de costas." },
          { n: "8", tag: "SHOPPING MALL", c: "purple", v: "white", id: "w30v08",
            alt: "Interior de um shopping com escadas rolantes e lojas.",
            ph: "Foto: interior claro de um shopping center de vários andares, com escadas rolantes cruzadas ao centro, corrimãos de vidro, clarabóia no teto e pessoas caminhando entre as lojas." },
          { n: "9", tag: "OFFICE", c: "purple", v: "white", id: "w30v09",
            alt: "Escritório com mesas, computadores e cadeiras.",
            ph: "Foto: escritório moderno e claro, com mesas brancas enfileiradas, monitores de computador, cadeiras pretas de rodinhas e grandes janelas com vista para árvores." },
          { n: "10", tag: "MOVIE THEATER", c: "purple", v: "white", id: "w30v10",
            alt: "Fachada de cinema com letreiro de neon vermelho escrito CINEMA.",
            ph: "Foto: fachada de cinema à noite, com letreiro de neon vermelho escrito CINEMA sobre a marquise e cartazes de filmes iluminados na parede." },
          { n: "11", tag: "THEATER", c: "purple", v: "white", id: "w30v11",
            alt: "Palco de teatro com cortina vermelha e poltronas vermelhas.",
            ph: "Foto: interior de teatro visto da plateia, com palco iluminado e grande cortina vermelha franzida ao fundo, e fileiras de poltronas vermelhas vazias em primeiro plano." },
          { n: "12", tag: "HOTEL", c: "purple", v: "white", id: "w30v12",
            alt: "Recepção de hotel com placa HOTEL e recepcionistas.",
            ph: "Foto: recepção de hotel com balcão de madeira, placa iluminada escrita HOTEL na parede, dois recepcionistas de terno escuro atrás do balcão e uma mala de viagem no chão." },
          { n: "13", tag: "MUSEUM", c: "purple", v: "white", id: "w30v13",
            alt: "Salão de museu com esqueleto de dinossauro e visitantes.",
            ph: "Foto: salão amplo de museu de história natural, com um grande esqueleto de dinossauro montado ao centro, sob luz alta, e visitantes pequenos olhando de baixo." },
          { n: "14", tag: "LIBRARY", c: "purple", v: "white", id: "w30v14",
            alt: "Biblioteca com estantes altas de livros e mesas de leitura.",
            ph: "Foto: biblioteca com estantes de madeira altas e cheias de livros, janela arqueada ao fundo e pessoas sentadas lendo em mesas compridas de madeira." },
          { n: "15", tag: "BOOKSTORE", c: "purple", v: "white", id: "w30v15",
            alt: "Livraria com mesas de livros e uma cliente folheando um exemplar.",
            ph: "Foto: interior de livraria com estantes cheias de livros ao fundo e mesas de exposição com livros empilhados. Uma pessoa está em pé folheando um exemplar." } ] },
        { t: "note", v: "cream", bar: true, bold: true, text: "A city has many places.\nYou will see these places in real life and use them when you talk in English!" } ] },

      // ── página impressa 02 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 02" },
        { t: "title", en: "STUDY, WORK & BOOKS", pt: "Lugares de estudo, de trabalho e de livros." },
        { t: "cards", cols: 2, items: [
          { tag: "UNIVERSITY", c: "teal", v: "white", id: "w30p2a",
            alt: "Prédio de universidade com estudantes caminhando no gramado.",
            ph: "Foto: prédio histórico de universidade em tijolo vermelho, com colunas brancas e escadaria. Em primeiro plano, um caminho de pedra cortando o gramado verde, com estudantes de mochila caminhando entre as árvores.",
            lines: ["There is a university near my house."] },
          { tag: "OFFICE", c: "purple", v: "white", id: "w30p2b",
            alt: "Escritório moderno com pessoas trabalhando em notebooks.",
            ph: "Foto: escritório moderno com grandes janelas de vidro e vista para prédios da cidade. Uma mulher de blazer bege digita em um notebook em primeiro plano; ao fundo, colegas trabalham em mesas compridas de madeira, com plantas e xícaras de café.",
            lines: ["My sister is a lawyer. She works in an office."] },
          { tag: "LIBRARY", c: "purple", v: "white", id: "w30p2c",
            alt: "Biblioteca com corredores de estantes e pessoas lendo.",
            ph: "Foto: biblioteca com dois corredores de estantes de madeira cheias de livros e uma janela arqueada ao fundo. Um rapaz de camisa cinza lê sentado à mesa, com livros empilhados à sua frente, e outras pessoas leem ao fundo.",
            lines: ["You borrow books from a library."] },
          { tag: "BOOKSTORE", c: "teal", v: "white", id: "w30p2d",
            alt: "Livraria com mesas de livros e uma cliente folheando um livro.",
            ph: "Foto: livraria aconchegante com luminárias pendentes, estantes cheias de livros e mesas de exposição com pilhas de livros. Uma mulher de jaqueta jeans e bolsa a tiracolo folheia um livro em primeiro plano; outros clientes olham as prateleiras ao fundo.",
            lines: ["You buy books in a bookstore."] } ] } ] },

      // ── página impressa 03 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 03" },
        { t: "title", en: "EVERYDAY PLACES", pt: "Lugares do dia a dia." },
        { t: "cards", cols: 2, items: [
          { tag: "DRUGSTORE / PHARMACY", c: "teal", v: "white", id: "w30p3a",
            alt: "Cliente sendo atendida por um farmacêutico no balcão da farmácia.",
            ph: "Foto: interior de farmácia com prateleiras cheias de caixas coloridas de remédios. Uma cliente de jaqueta jeans e bolsa, de costas, conversa no balcão com um farmacêutico de jaleco branco, que sorri e mostra uma caixa de remédio.",
            lines: ["I buy medicine at the drugstore."] },
          { tag: "SUPERMARKET", c: "purple", v: "white", id: "w30p3b",
            alt: "Homem empurrando um carrinho cheio no corredor do supermercado.",
            ph: "Foto: corredor de supermercado com prateleiras de frutas, verduras e produtos dos dois lados. Um homem de jaqueta verde-escura empurra um carrinho de compras cheio de frutas e legumes.",
            lines: ["We do our weekly shopping on Saturdays."] },
          { tag: "SHOPPING MALL", c: "purple", v: "white", id: "w30p3c",
            alt: "Amigas caminhando com sacolas dentro de um shopping.",
            ph: "Foto: interior de shopping center com piso claro e corrimãos de vidro. Duas amigas caminham sorrindo, com sacolas de compras coloridas nas mãos; outras pessoas passam ao fundo.",
            lines: ["Sarah goes to the shopping mall on Saturdays."] },
          { tag: "HOTEL", c: "teal", v: "white", id: "w30p3d",
            alt: "Hóspede fazendo check-in com a recepcionista do hotel.",
            ph: "Foto: recepção de hotel com balcão de mármore, abajur aceso, plantas e quatro estrelas douradas na parede. Um hóspede de casaco bege, com uma mala de rodinhas, conversa com a recepcionista de terno escuro, que sorri atrás do balcão.",
            lines: ["You check in at a hotel."] } ] } ] },

      // ── página impressa 04 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 04" },
        { t: "title", en: "GETTING AROUND & FREE TIME", pt: "Places in our city for transport and leisure." },
        { t: "steps", items: [
          { n: "1", tag: "BUS STOP", c: "purple", v: "lilac", id: "w30p4a",
            alt: "Mulher esperando no ponto de ônibus enquanto um ônibus azul chega.",
            ph: "Foto: mulher de jaqueta jeans e mochila, com o celular na mão, sorri em pé num ponto de ônibus coberto de vidro. À direita, um ônibus azul com o letreiro CITY BUS se aproxima pela rua.",
            lines: ["I take the bus at the bus stop."],
            note: "Take the bus at the bus stop." },
          { n: "2", tag: "PARKING LOT", c: "purple", v: "lilac", id: "w30p4b",
            alt: "Homem destravando o carro em um estacionamento.",
            ph: "Foto: homem de camisa jeans, sorrindo, abre a porta de um carro escuro em um estacionamento ao ar livre com vários carros enfileirados e árvores verdes ao fundo.",
            lines: ["I park my car in the parking lot."],
            note: "Park your car in the parking lot." },
          { n: "3", tag: "PARK", c: "purple", v: "lilac", id: "w30p4c",
            alt: "Mulher caminhando por uma trilha arborizada do parque.",
            ph: "Foto: mulher de camiseta lilás e calça de ginástica caminha sorrindo por um caminho de terra clara em um parque, entre árvores altas de copas verdes iluminadas pelo sol.",
            lines: ["I walk in the park in the morning."],
            note: "Walk in the park." },
          { n: "4", tag: "AQUARIUM", c: "purple", v: "lilac", id: "w30p4d",
            alt: "Visitante observando peixes e corais em um grande aquário.",
            ph: "Foto: mulher de jaqueta jeans e mochila, de perfil, olha sorrindo para um grande painel de vidro iluminado em azul, com peixes coloridos e corais rosados e verdes.",
            lines: ["There is a large aquarium in my city."],
            note: "Visit the aquarium." } ] },
        { t: "note", v: "mint", bar: true, bold: true, kicker: "REMEMBER", text: "These places are part of our daily life.\nUse the right place for each activity." } ] },

      // ── página impressa 05 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 05" },
        { t: "title", en: "MOVIES, PLAYS & HISTORY", pt: "Cinema, teatro e museu." },
        { t: "cards", cols: 1, items: [
          { tag: "MOVIE THEATER", c: "teal", v: "mint", id: "w30p5a",
            alt: "Amigas rindo no cinema com óculos 3D e baldes de pipoca.",
            ph: "Foto: duas jovens sentadas em poltronas vermelhas de cinema, usando óculos 3D escuros e segurando baldes amarelos de pipoca, rindo. Atrás delas, outros espectadores também de óculos 3D.",
            lines: ["We watch movies at home.", "We see movies at a movie theater."],
            note: "go to the movies" },
          { tag: "THEATER", c: "purple", v: "lilac", id: "w30p5b",
            alt: "Plateia vazia de um teatro vista de cima, com poltronas vermelhas.",
            ph: "Foto: interior de um teatro visto do alto, com fileiras de poltronas vermelhas vazias, mesa de som ao centro, refletores no teto e a estrutura escura do palco ao fundo.",
            lines: ["We see plays at a theater."] },
          { tag: "MUSEUM", c: "yellow", v: "cream", id: "w30p5c",
            alt: "Visitante observando um grande quadro na parede de um museu.",
            ph: "Foto: sala clara de museu com um grande quadro antigo emoldurado na parede branca, retratando uma paisagem de inverno cheia de pessoas patinando no gelo. De costas, uma visitante de camiseta branca e bolsa de pano observa a obra.",
            lines: ["Are there good museums in your city?"] } ] } ] },

      // ── página impressa 06 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 06" },
        { t: "title", en: "WHERE CAN YOU...?", pt: "A USEFUL QUESTION FOR PLACES" },
        { t: "note", v: "blue", text: "Nesta aula, use Where can you...? como uma pergunta completa para descobrir em que lugar uma atividade acontece." },
        { t: "cards", cols: 2, items: [
          { tag: "SUPERMARKET", c: "teal", v: "white", id: "w30p6a",
            alt: "Mulher escolhendo uma maçã na seção de frutas do supermercado.",
            ph: "Foto: mulher de suéter bege escolhe uma maçã vermelha na seção de hortifrúti do supermercado, empurrando um carrinho cheio de frutas e verduras. Prateleiras coloridas de frutas dos dois lados.",
            lines: ["Where can you buy food?"], note: "Supermarket." },
          { tag: "OFFICE", c: "teal", v: "white", id: "w30p6b",
            alt: "Equipe trabalhando em notebooks num escritório com vista para a cidade.",
            ph: "Foto: escritório moderno com janelas do chão ao teto e vista para arranha-céus. Uma mulher de blazer bege digita em um notebook em primeiro plano; ao fundo, colegas trabalham em mesas de madeira, com plantas verdes ao redor.",
            lines: ["Where can you work?"], note: "Office." },
          { tag: "LIBRARY", c: "teal", v: "white", id: "w30p6c",
            alt: "Homem lendo um livro em pé entre as estantes da biblioteca.",
            ph: "Foto: homem de camisa clara lê um livro aberto em pé, ao lado de uma estante alta cheia de livros em uma biblioteca. Ao fundo, outras pessoas procuram livros e leem sentadas, sob uma grande janela.",
            lines: ["Where can you borrow books?"], note: "Library." },
          { tag: "HOTEL", c: "teal", v: "white", id: "w30p6d",
            alt: "Quarto de hotel com cama arrumada e mala de viagem.",
            ph: "Foto: quarto de hotel claro, com cama de casal arrumada com lençóis brancos, abajures acesos dos dois lados, poltrona, escrivaninha, televisão e uma mala de rodinhas preta ao lado da cama, com cortinas claras na janela.",
            lines: ["Where can you stay when you travel?"], note: "Hotel." } ] } ] },

      // ── página impressa 07 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 07" },
        { t: "title", en: "WHERE CAN YOU...?", pt: "FIND THE PLACE." },
        { t: "image", id: "w30p7a", alt: "Arranha-céus de vidro à beira de um lago, vistos de um calçadão arborizado.",
          ph: "Foto: conjunto de arranha-céus de vidro azul refletindo o sol do fim de tarde, à beira de um lago calmo. Em primeiro plano, um calçadão de pedra com canteiros, árvores verdes e guarda-corpo metálico." },
        { t: "fill", id: "w30e1", wide: true, title: "WHERE CAN YOU...? FIND THE PLACE.", items: [
          { pre: "1. Where can you see movies?", answers: ["Movie theater"], v: "mint" },
          { pre: "2. Where can you see a play?", answers: ["Theater"], v: "mint" },
          { pre: "3. Where can you learn about history?", answers: ["Museum"], v: "mint" },
          { pre: "4. Where can you park your car?", answers: ["Parking lot"], v: "mint" },
          { pre: "5. Where can you buy a book?", answers: ["Bookstore"], v: "lilac" },
          { pre: "6. Where can children play outside?", answers: ["Park"], v: "lilac" },
          { pre: "7. Where can you buy some medicine?", answers: ["Drugstore / Pharmacy", "Drugstore", "Pharmacy"], v: "lilac" },
          { pre: "8. Where can you take a bus?", answers: ["Bus stop"], v: "lilac" } ] } ] },

      // ── página impressa 08 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 08" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira o gabarito da página anterior." },
        { t: "image", id: "w30p8a", alt: "Calçadão arborizado à beira do rio entre prédios de vidro.",
          ph: "Foto: calçadão largo de pedra à beira de um rio, com bancos de madeira, luminárias altas, canteiros de plantas e árvores jovens de um lado; do outro, um guarda-corpo de cabos de aço sobre a água. Ao fundo, arranha-céus de vidro azul sob céu claro." },
        { t: "answers", title: "WHERE CAN YOU...?", items: [
          { k: "1. Where can you see movies?", a: "Movie theater", c: "teal" },
          { k: "2. Where can you see a play?", a: "Theater", c: "teal" },
          { k: "3. Where can you learn about history?", a: "Museum", c: "teal" },
          { k: "4. Where can you park your car?", a: "Parking lot", c: "teal" },
          { k: "5. Where can you buy a book?", a: "Bookstore", c: "purple" },
          { k: "6. Where can children play outside?", a: "Park", c: "purple" },
          { k: "7. Where can you buy some medicine?", a: "Drugstore / Pharmacy", c: "purple" },
          { k: "8. Where can you take a bus?", a: "Bus stop", c: "purple" } ] } ] },

      // ── página impressa 09 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 09" },
        { t: "title", en: "A DAY IN THE CITY", pt: "READ AND FIND THE PLACES." },
        { t: "image", id: "w30p9a", alt: "Casal conversando à mesa de um café com vista para a cidade.",
          ph: "Foto: uma mulher de jaqueta jeans, cabelo castanho, segura uma xícara branca e sorri olhando para um rapaz de suéter azul-marinho, que está com a mão no queixo. Eles estão sentados a uma mesa de madeira com um caderno e uma caneta e uma caneca preta. Atrás deles, uma janela grande com vista para prédios da cidade e uma planta verde." },
        { t: "dialogue", items: [
          { s: "a", text: "A: Are there good museums in your city?" },
          { s: "b", text: "B: Yes, there are. There is a museum near the park." },
          { s: "a", text: "A: Where can you buy books?" },
          { s: "b", text: "B: In a bookstore. There is one near the university." },
          { s: "a", text: "A: Where can you see movies?" },
          { s: "b", text: "B: In a movie theater." },
          { s: "a", text: "A: Great. I go there on Saturdays." } ] },
        { t: "image", id: "w30p9b", alt: "Mapa ilustrado de um bairro com seis lugares identificados por etiquetas.",
          ph: "Ilustração: mapa isométrico colorido de um bairro, visto de cima, com ruas, calçadas e muitas árvores. Seis etiquetas brancas arredondadas identificam os lugares: University sobre um prédio antigo de tijolos com colunas, no alto à esquerda; Park sobre uma praça arborizada com chafariz redondo de água azul, no alto ao centro; Museum sobre um edifício neoclássico com cúpula verde, no alto à direita; Bookstore sobre uma loja de dois andares com vitrines iluminadas, embaixo à esquerda; Movie theater sobre um cinema art déco escuro com faixas vermelhas e marquise iluminada, embaixo ao centro; e Supermarket sobre uma loja grande e clara com estacionamento, embaixo à direita." } ] },

      // ── página impressa 10 ───────────────────────────────────────────────
      { blocks: [
        { t: "badge", label: "AULA 30", page: "PÁGINA 10" },
        { t: "title", en: "PLACES IN A CITY", pt: "Você já sabe falar sobre os lugares de uma cidade." },
        { t: "image", id: "w30p10a", alt: "Mulher de jaqueta jeans conversando e sorrindo com um homem diante de uma janela com vista para a cidade.",
          ph: "Foto recortada em moldura arredondada: uma mulher jovem de cabelo castanho longo e solto, jaqueta jeans sobre camiseta branca, sorri de perfil enquanto fala com a mão aberta à frente, palma para cima. À direita, cortado pela borda do quadro, um homem de suéter verde-oliva a escuta sorrindo. Entre os dois, uma janela grande e clara com vista desfocada para prédios e árvores da cidade." },
        { t: "check", id: "w30c1", title: "EU CONSIGO...", items: [
          "nomear lugares comuns de uma cidade",
          "relacionar lugares a atividades cotidianas",
          "distinguir library / bookstore",
          "distinguir movie theater / theater",
          "usar Where can you...? como expressão funcional para perguntar sobre lugares" ] },
        { t: "cta", items: [
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 30", body: "VIDEOAULA · AULA 30 · PLACES IN A CITY", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga o nome de cinco lugares da cidade e faça três perguntas usando Where can you...?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "bar", label: "PROGRESSO", value: "30 DE 42 AULAS", pct: "71%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 31 · DIRECTIONS" } ] }
    ]
  },

  {
    id: 31, code: "AULA 31", title: "Directions", sub: "Pedir e dar direções na rua.",
    time: "14 a 18 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 31 · DIRECTIONS" },
        { t: "title", en: "NEAR OR FAR?", pt: "We use words to say how far places are from each other." },
        { t: "cards", items: [
          { tag: "NEAR / CLOSE TO", c: "teal", v: "mint", id: "a31p1a", ph: "Foto: museu ao lado do parque, com etiquetas PARK e MUSEUM",
            lines: ["The museum is near the park.", "The museum is close to the park."] },
          { tag: "FAR FROM / DISTANT FROM", c: "purple", v: "lilac", id: "a31p1b", ph: "Foto: hotel de um lado e aquário do outro, com seta dupla entre eles",
            lines: ["The hotel is far from the aquarium.", "The hotel is distant from the aquarium."] } ] },
        { t: "note", v: "mint", bar: true, text: "We use near / close to for places that are not far.\nWe use far from / distant from for places that are far away." } ] },

      { blocks: [
        { t: "badge", label: "AULA 31" },
        { t: "title", en: "ASKING FOR DIRECTIONS", pt: "Três formas de pedir informação na rua." },
        { t: "image", id: "a31p2", ph: "Foto: mulher pedindo informação a um homem na rua. Balão: “Excuse me.”" },
        { t: "rows", items: [
          { text: "Where is the drugstore?", c: "teal" },
          { text: "Is there a drugstore near here?", c: "purple" },
          { text: "How do I get to the drugstore?", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 31 · DIRECTIONS" },
        { t: "title", en: "MAP LANGUAGE", pt: "We use these words to understand and give directions." },
        { t: "sec", text: "NORTH · SOUTH · EAST · WEST" },
        { t: "grid", cols: 2, items: [
          { kicker: "N", title: "North", body: "The top of the map.", c: "teal", v: "mint" },
          { kicker: "S", title: "South", body: "The bottom of the map.", c: "purple", v: "lilac" },
          { kicker: "E", title: "East", body: "The right side of the map.", c: "purple", v: "lilac" },
          { kicker: "W", title: "West", body: "The left side of the map.", c: "teal", v: "mint" } ] },
        { t: "image", id: "a31p3", ph: "Mapa ilustrado com museu, parque, biblioteca, livraria, café e ponto de ônibus (NORTH / SOUTH / EAST / WEST)" },
        { t: "cards", items: [
          { tag: "ACROSS FROM", c: "teal", v: "mint", id: "a31p3a", ph: "Foto: livraria em frente ao museu, do outro lado da rua",
            lines: ["The bookstore is across from the museum."], note: "Across from = on the opposite side of the street." },
          { tag: "CORNER", c: "purple", v: "lilac", id: "a31p3b", ph: "Foto: hotel na esquina, com placas A Street e 15th Avenue",
            lines: ["The hotel is on the corner of A Street and 15th Avenue."], note: "On the corner of = at the place where two streets meet." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 31" },
        { t: "title", en: "BASIC MOVES", pt: "As quatro instruções que resolvem qualquer rota." },
        { t: "cards", items: [
          { tag: "TURN RIGHT", c: "teal", v: "mint", id: "a31p4a", ph: "Vista aérea: rota virando à direita depois da escola", lines: ["Turn right after the school."] },
          { tag: "TURN LEFT", c: "purple", v: "lilac", id: "a31p4b", ph: "Vista aérea: rota virando à esquerda na segunda rua", lines: ["Turn left on the second street."] },
          { tag: "GO STRAIGHT", c: "teal", v: "mint", id: "a31p4c", ph: "Vista aérea: avenida reta com seta para frente", lines: ["Go straight.", "Go straight ahead."] },
          { tag: "TAKE", c: "purple", v: "lilac", id: "a31p4d", ph: "Vista aérea: rota entrando numa rua e seguindo em frente", lines: ["Take this street and go straight ahead."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 31" },
        { t: "title", en: "KEEP MOVING", pt: "Seguir, passar e atravessar." },
        { t: "image", id: "a31p5", ph: "Vista aérea: calçada até o parque, passando pela livraria e faixa de pedestres" },
        { t: "steps", items: [
          { tag: "GO TOWARD", c: "teal", v: "mint", lines: ["Go toward the park."], note: "go in the direction of" },
          { tag: "GO PAST", c: "purple", v: "lilac", lines: ["Go past the bookstore."] },
          { tag: "CROSS", c: "purple", v: "lilac", lines: ["Cross the street."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 31 · DIRECTIONS" },
        { t: "title", en: "TURN AND TAKE", pt: "Use these words to change direction or choose a street." },
        { t: "steps", items: [
          { tag: "TURN LEFT", c: "teal", v: "gray", lines: ["Turn left at the corner."], id: "a31p6a", ph: "Foto: esquina de avenida arborizada com seta virando à esquerda", note: "left = the side where your heart is." },
          { tag: "TURN RIGHT", c: "teal", v: "gray", lines: ["Turn right after the museum."], id: "a31p6b", ph: "Foto: museu com colunas e seta virando à direita", note: "right = the opposite side of left." },
          { tag: "GO STRAIGHT", c: "teal", v: "gray", lines: ["Go straight for two blocks."], id: "a31p6c", ph: "Foto: rua reta com seta para frente (2 blocks)", note: "straight = continue in the same direction." },
          { tag: "TAKE", c: "teal", v: "gray", lines: ["Take Oak Street.", "Take the first street on your right."], id: "a31p6d", ph: "Foto: placa de rua OAK STREET na esquina", note: "take = choose a street." },
          { tag: "THE FIRST / NEXT", c: "teal", v: "gray", lines: ["Turn right at the first street.", "Turn left at the next street."], id: "a31p6e", ph: "Dois mapinhas: FIRST STREET e NEXT STREET", note: "first = the one closest to you. next = the one after the first." } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "REMEMBER", text: "Turn left or turn right to change direction.\nGo straight to continue in the same direction.\nTake a street and follow the route." } ] },

      { blocks: [
        { t: "badge", label: "AULA 31 · DIRECTIONS" },
        { t: "title", en: "FOLLOW THE ROUTE", pt: "Let’s read and practice asking for and giving directions." },
        { t: "steps", items: [
          { tag: "READ THE DIALOGUE", c: "teal", v: "gray", lines: ["Anna is asking for directions."], id: "a31p7a", ph: "Foto: duas mulheres conversando na rua + mapa com a rota até o museu" } ] },
        { t: "dialogue", items: [
          { s: "a", text: "Excuse me, where is the museum?" },
          { s: "b", text: "Go straight for two blocks. Then turn right at the first street. The museum is on your left." } ] },
        { t: "sec", text: "2 · PRACTICE THE DIALOGUE" },
        { t: "lead", text: "Complete the conversation with the phrases in the box." },
        { t: "chips", items: [
          { t: "Go straight", c: "teal" }, { t: "turn left", c: "teal" },
          { t: "first street", c: "teal" }, { t: "on your right", c: "teal" } ] },
        { t: "image", id: "a31p7b", ph: "Mapa: rota até a livraria, com marcador YOU ARE HERE" },
        { t: "fill", id: "a31e1", title: "A: WHERE IS THE BOOKSTORE?", v: "cream", items: [
          { pre: "B: 1.", answers: ["go straight"], post: "for two blocks.", v: "white" },
          { pre: "Then 2.", answers: ["turn left"], post: "at the", v: "white" },
          { pre: "3.", answers: ["first street"], post: ".", v: "white" },
          { pre: "The bookstore is 4.", answers: ["on your right"], post: ".", v: "white" } ] },
        { t: "note", v: "gray", bar: true, kicker: "TIP", text: "Always say the direction first.\nUse numbers to say how far.\nUse turn left or turn right to change direction.\nSay where the place is at the end." } ] },

      { blocks: [
        { t: "badge", label: "AULA 31" },
        { t: "title", en: "ASK & ANSWER", pt: "Um diálogo completo na rua." },
        { t: "image", id: "a31p8a", ph: "Foto: mulher e homem conversando na calçada" },
        { t: "image", id: "a31p8b", ph: "Mapa: livraria, parque, semáforo e supermercado" },
        { t: "dialogue", items: [
          { s: "a", text: "Excuse me. How do I get to the bookstore?" },
          { s: "b", text: "Go straight ahead. Turn left at the traffic light." },
          { s: "a", text: "Is it far from here?" },
          { s: "b", text: "No. It’s near the park. Go past the supermarket. The bookstore is across from the park." },
          { s: "a", text: "Thank you." },
          { s: "b", text: "You’re welcome." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 31 · PRATIQUE" },
        { t: "title", en: "GIVE DIRECTIONS", pt: "USE THE MAP." },
        { t: "image", id: "a31p9", ph: "Mapa ilustrado: universidade, parque, hotel, museu, livraria, supermercado, ponto de ônibus e cinema" },
        { t: "free", id: "a31f1", items: [
          { n: "1", kicker: "RESPONDA", prefix: "How do I get to the museum?", ideas: "Use go straight, turn right / turn left, across from…", c: "teal", v: "mint" },
          { n: "2", kicker: "RESPONDA", prefix: "Where is the hotel?", ideas: "Diga a direção e depois onde o lugar fica.", c: "purple", v: "lilac" },
          { n: "3", kicker: "RESPONDA", prefix: "Is there a bookstore near here?", ideas: "Comece com Yes, there is… ou No, there isn’t…", c: "teal", v: "mint" } ] },
        { t: "chips", title: "PALAVRAS PARA USAR", items: [
          { t: "go straight", c: "teal" }, { t: "turn right", c: "purple" }, { t: "turn left", c: "teal" },
          { t: "go past", c: "purple" }, { t: "cross", c: "teal" }, { t: "near / far", c: "purple" },
          { t: "across from", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 31 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "image", id: "a31p10", ph: "Foto: homem de mochila olhando a rua" },
        { t: "check", id: "a31c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "pedir uma direção educadamente",
          "dizer se um lugar está perto ou longe",
          "reconhecer North, South, East e West",
          "usar turn right / turn left / go straight",
          "usar go toward / go past / cross",
          "usar across from e corner",
          "seguir instruções usando traffic light e roundabout",
          "dar uma rota curta em inglês" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 31 · DIRECTIONS", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Peça uma direção e dê uma rota curta usando pelo menos quatro instruções da Aula 31.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "31 DE 42 AULAS", pct: "74%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 32 · Like / Love / Dislike / Hate + -ing" } ] }
    ]
  },
  {
    id: 32, code: "AULA 32", title: "Like, Love, Dislike & Hate", sub: "Preferências com substantivos e com verbo + -ing.",
    time: "14 a 18 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 32 · UNIT 8" },
        { t: "title", en: "LIKE, LOVE, DISLIKE & HATE", pt: "PREFERENCES WITH NOUNS" },
        { t: "lead", text: "We can use love, like, dislike and hate before nouns to talk about the things we enjoy or don’t enjoy." },
        { t: "note", v: "mint", bar: true, text: "Notice how each verb shows a different level of preference." },
        { t: "chips", items: [
          { t: "LOVE", c: "purple" }, { t: "LIKE", c: "blue" }, { t: "DISLIKE", c: "orange" }, { t: "HATE", c: "red" } ] },
        { t: "cards", items: [
          { tag: "LOVE · BOOKS", c: "purple", v: "lilac", id: "a32p1a", src: "/lessons/fotos/aula_32_pagina_01_foto_01.jpg", alt: "Homem sorrindo abraçado a uma pilha de livros", ph: "Foto: homem abraçando uma pilha de livros", lines: ["He loves books."] },
          { tag: "LIKE · ANIMALS", c: "blue", v: "blue", id: "a32p1b", src: "/lessons/fotos/aula_32_pagina_01_foto_03.jpg", alt: "Mulher sorrindo abraçada a um golden retriever", ph: "Foto: mulher abraçando um cachorro; cão e gato ao lado", lines: ["He likes animals."] },
          { tag: "DISLIKE · COFFEE", c: "orange", v: "cream", id: "a32p1c", src: "/lessons/fotos/aula_32_pagina_01_foto_05.jpg", alt: "Mulher com cara de desagrado segurando uma caneca preta", ph: "Foto: mulher com cara de desagrado segurando caneca; xícara de café", lines: ["She dislikes coffee."] },
          { tag: "HATE · ONIONS", c: "red", v: "red", id: "a32p1d", src: "/lessons/fotos/aula_32_pagina_01_foto_06.jpg", alt: "Homem fazendo careta e recusando com a mão", ph: "Foto: homem recusando com a mão; cebolas ao lado", lines: ["He hates onions."] } ] },
        { t: "note", v: "mint", bar: true, bold: true, text: "Use love, like, dislike and hate + noun to say what you really enjoy or what you really can’t stand!" } ] },

      { blocks: [
        { t: "badge", label: "AULA 32" },
        { t: "title", en: "VERB + -ING", pt: "PREFERENCES + ACTIVITIES" },
        { t: "key", v: "gray", text: "love / like / dislike / hate + verb-ing" },
        { t: "image", id: "a32p2", ph: "Foto: homem de fones de ouvido sorrindo, com selos LOVE / LIKE / DISLIKE / HATE" },
        { t: "rows", items: [
          { text: "Mike loves listening to music.", c: "purple" },
          { text: "Mike likes listening to music.", c: "blue" },
          { text: "Mike dislikes listening to music.", c: "orange" },
          { text: "Mike hates listening to music.", c: "red" } ] },
        { t: "note", v: "lilac", center: true, text: "Nesta aula, nosso foco é love / like / dislike / hate + verb-ing." } ] },

      { blocks: [
        { t: "badge", label: "AULA 32 · UNIT 8" },
        { t: "title", en: "HOW TO FORM -ING", pt: "We add -ing to verbs to talk about activities." },
        { t: "note", v: "mint", bar: true, text: "The spelling of -ing changes a little depending on the verb. Look below!" },
        { t: "sec", text: "1 · MOST VERBS: JUST ADD -ING" },
        { t: "table", head: ["BASE VERB", "+ -ING"], rows: [
          { a: "buy", b: "buying", v: "lilac" }, { a: "play", b: "playing", v: "lilac" }, { a: "do", b: "doing", v: "lilac" },
          { a: "cook", b: "cooking", v: "lilac" }, { a: "eat", b: "eating", v: "lilac" }, { a: "speak", b: "speaking", v: "lilac" } ] },
        { t: "image", id: "a32p3a", ph: "Foto: mulher cozinhando e mexendo uma salada" },
        { t: "note", v: "lilac", text: "These are very common verbs. Try to remember them!" },
        { t: "sec", text: "2 · VERBS ENDING IN -E: DROP THE -E AND ADD -ING" },
        { t: "table", head: ["BASE VERB", "-ING FORM"], rows: [
          { a: "dance", b: "dancing", v: "blue" }, { a: "live", b: "living", v: "blue" }, { a: "have", b: "having", v: "blue" },
          { a: "write", b: "writing", v: "blue" }, { a: "take", b: "taking", v: "blue" }, { a: "drive", b: "driving", v: "blue" } ] },
        { t: "note", v: "blue", text: "We remove the final -e before adding -ing." },
        { t: "sec", text: "3 · CVC VERBS: DOUBLE THE FINAL CONSONANT AND ADD -ING" },
        { t: "table", head: ["BASE VERB", "-ING FORM"], rows: [
          { a: "stop", b: "stopping", v: "cream" }, { a: "sit", b: "sitting", v: "cream" }, { a: "get", b: "getting", v: "cream" },
          { a: "plan", b: "planning", v: "cream" }, { a: "run", b: "running", v: "cream" } ] },
        { t: "note", v: "cream", bar: true, text: "CVC = consonant + vowel + consonant.\nExample: s t o p → C V C" },
        { t: "note", v: "gray", bar: true, kicker: "GOOD TO KNOW", text: "Most verbs follow one of these three rules. When you see a new verb, try to identify which rule it follows.\nPRACTICE TIP: read the verbs out loud. Say the base verb and then the -ing form." } ] },

      { blocks: [
        { t: "badge", label: "AULA 32" },
        { t: "title", en: "PREFERENCES IN ACTION", pt: "Preferências em frases reais." },
        { t: "cards", items: [
          { tag: "LIKE", c: "purple", v: "lilac", id: "a32p4a", ph: "Foto: mulher andando de bicicleta no parque", lines: ["She likes riding a bike."] },
          { tag: "LOVE", c: "blue", v: "blue", id: "a32p4b", ph: "Foto: amigos jogando futebol no fim da tarde", lines: ["My friends and I love playing soccer."] },
          { tag: "LIKE", c: "blue", v: "blue", id: "a32p4c", ph: "Foto: padeiro sovando pão na padaria", lines: ["Anthony is a baker.", "He likes making bread."] },
          { tag: "HATE", c: "red", v: "red", id: "a32p4d", ph: "Foto: homem cansado e desanimado na academia", lines: ["I hate going to the gym."] },
          { tag: "DISLIKE", c: "orange", v: "cream", id: "a32p4e", ph: "Foto: moça tímida afastada de um grupo conversando", lines: ["My cousin is very shy.", "She dislikes meeting new people."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 32" },
        { t: "title", en: "NEGATIVE PREFERENCES", pt: "DON’T / DOESN’T LIKE" },
        { t: "key", v: "gray", text: "I / you / we / they → don’t like + verb-ing\nhe / she / it → doesn’t like + verb-ing" },
        { t: "cards", items: [
          { tag: "DOESN’T LIKE", c: "teal", v: "mint", id: "a32p5a", ph: "Foto: rapaz no sofá com controle de TV, sem interesse", lines: ["William doesn’t like watching TV."] },
          { tag: "DOESN’T LIKE / LIKES", c: "purple", v: "lilac", id: "a32p5b", ph: "Foto: rapaz cantando no microfone e tocando guitarra", lines: ["He doesn’t like singing.", "He likes playing the guitar."] },
          { tag: "DON’T LIKE", c: "orange", v: "cream", id: "a32p5c", ph: "Foto: moça escrevendo uma carta à mesa", lines: ["My friends don’t like sending letters."] },
          { tag: "DOESN’T LIKE", c: "teal", v: "mint", id: "a32p5d", ph: "Foto: homem recusando um prato de legumes", lines: ["He doesn’t hate vegetables. He just doesn’t like eating vegetables."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 32" },
        { t: "title", en: "ASK ABOUT PREFERENCES", pt: "Do / Does + like + verb-ing." },
        { t: "cards", items: [
          { tag: "1 · DOES HE LIKE DRINKING COFFEE?", c: "teal", v: "mint", id: "a32p6a", ph: "Foto: homem tomando café na cafeteria", lines: ["Yes, he does.", "No, he doesn’t."] },
          { tag: "2 · DO THEY LIKE PLAYING VIDEO GAMES?", c: "purple", v: "lilac", id: "a32p6b", ph: "Foto: dois amigos jogando videogame", lines: ["Yes, they do.", "No, they don’t."] } ] },
        { t: "mc", id: "a32mc1", title: "ESCOLHA A RESPOSTA CERTA", v: "cream", questions: [
          { q: "Does she like cooking?", options: ["Yes, she does.", "Yes, she do."], answer: 0, explain: "Com he / she / it usamos does." },
          { q: "Do you like playing soccer?", options: ["No, I doesn’t.", "No, I don’t."], answer: 1, explain: "Com I / you / we / they usamos do." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 32" },
        { t: "title", en: "LET’S TALK", pt: "Um diálogo sobre tempo livre." },
        { t: "image", id: "a32p7", ph: "Foto: dois amigos conversando numa cafeteria" },
        { t: "dialogue", items: [
          { s: "a", text: "What do you like doing in your free time?" },
          { s: "b", text: "I like listening to music and cooking. I love playing soccer on Saturdays." },
          { s: "a", text: "Do you like going to the gym?" },
          { s: "b", text: "No, I don’t. I hate going to the gym. What about you?" },
          { s: "a", text: "I like riding a bike, but I don’t like watching TV." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 32 · PRATIQUE" },
        { t: "title", en: "YOUR PREFERENCES", pt: "CHOOSE, ASK & COMPARE" },
        { t: "cards", cols: 2, items: [
          { tag: "LISTENING TO MUSIC", c: "purple", v: "lilac", id: "a32p8a", ph: "Foto: mulher ouvindo música com fones" },
          { tag: "RIDING A BIKE", c: "teal", v: "mint", id: "a32p8b", ph: "Foto: homem pedalando à beira do rio" },
          { tag: "PLAYING SOCCER", c: "orange", v: "cream", id: "a32p8c", ph: "Foto: dois homens jogando futebol" },
          { tag: "COOKING", c: "orange", v: "cream", id: "a32p8d", ph: "Foto: mulher cozinhando" },
          { tag: "WATCHING TV", c: "teal", v: "mint", id: "a32p8e", ph: "Foto: homem assistindo TV no sofá" },
          { tag: "PLAYING VIDEO GAMES", c: "purple", v: "lilac", id: "a32p8f", ph: "Foto: rapaz jogando videogame" } ] },
        { t: "free", id: "a32f1", items: [
          { n: "1", kicker: "COMPLETE", prefix: "I love…", ideas: "Use uma atividade com verbo + -ing.", c: "purple", v: "lilac" },
          { n: "2", kicker: "COMPLETE", prefix: "I like…", ideas: "", c: "teal", v: "mint" },
          { n: "3", kicker: "COMPLETE", prefix: "I dislike…", ideas: "", c: "orange", v: "cream" },
          { n: "4", kicker: "COMPLETE", prefix: "I hate…", ideas: "", c: "red", v: "red" } ] },
        { t: "note", v: "blue", bar: true, bold: true, text: "Do you like ____________ ?\nYes, I do. / No, I don’t." },
        { t: "free", id: "a32f2", cols: 2, items: [
          { n: "5", kicker: "PERGUNTE", prefix: "Do you like…?", ideas: "Escreva sua pergunta.", c: "blue", v: "blue" },
          { n: "6", kicker: "RESPONDA", prefix: "Yes, I do. / No, I don’t.", ideas: "Escreva sua resposta completa.", c: "teal", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 32 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "image", id: "a32p9", ph: "Foto: três amigos estudando juntos à mesa" },
        { t: "check", id: "a32c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "expressar preferências com substantivos",
          "usar love / like / dislike / hate + verb-ing",
          "formar formas comuns em -ing",
          "usar don’t / doesn’t like",
          "perguntar sobre preferências com Do / Does",
          "responder com Yes, … do/does e No, … don’t/doesn’t",
          "falar brevemente sobre atividades de que gosto ou não gosto" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 32 · LIKE / LOVE / DISLIKE / HATE + -ING", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Missão oral: diga quatro preferências sobre atividades e faça duas perguntas usando Do you like…?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "32 DE 42 AULAS", pct: "76%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 33 · How Often? Frequency" } ] }
    ]
  },
  {
    id: 33, code: "AULA 33", title: "How Often? Frequency", sub: "Advérbios e expressões de frequência.",
    time: "15 a 20 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 33" },
        { t: "title", en: "HOW OFTEN?", pt: "ADVERBS & EXPRESSIONS OF FREQUENCY" },
        { t: "cards", items: [
          { tag: "HOW OFTEN DOES HE VISIT HIS GRANDPA?", c: "teal", v: "mint", id: "a33p1a", ph: "Foto: neto e avô conversando à mesa com café",
            lines: ["ADVERB · He usually visits his grandpa.", "EXPRESSION · He visits his grandpa once a week.", "EXPRESSION · He visits his grandpa every Sunday."] },
          { tag: "HOW OFTEN DO YOU GO TO THE BEACH?", c: "purple", v: "lilac", id: "a33p1b", ph: "Foto: casal sentado na praia conversando",
            lines: ["ADVERB · I rarely go to the beach.", "EXPRESSION · I go to the beach twice a year."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33 · UNIT 8" },
        { t: "title", en: "ADVERBS OF FREQUENCY", pt: "Adverbs of frequency tell us how often something happens." },
        { t: "note", v: "lilac", bar: true, kicker: "TIP", text: "They usually go before the main verb.\nShe often reads books.\nHe is always late." },
        { t: "sec", text: "THE SCALE OF FREQUENCY", c: "purple" },
        { t: "grid", cols: 1, items: [
          { kicker: "100%", title: "ALWAYS", body: "It happens all the time.", c: "purple", v: "lilac" },
          { kicker: "85%", title: "USUALLY", body: "It happens most of the time.", c: "blue", v: "blue" },
          { kicker: "70%", title: "OFTEN", body: "It happens many times.", c: "teal", v: "mint" },
          { kicker: "50%", title: "SOMETIMES", body: "It happens about half the time.", c: "teal", v: "green" },
          { kicker: "20%", title: "NOT OFTEN", body: "It doesn’t happen very often.", c: "orange", v: "cream" },
          { kicker: "10%", title: "RARELY", body: "It happens almost never.", c: "orange", v: "cream" },
          { kicker: "0%", title: "NEVER", body: "It doesn’t happen.", c: "red", v: "red" } ] },
        { t: "image", id: "a33p2", ph: "Fotos: rotinas do dia a dia (ler, tomar café, correr, assistir TV, dormir)" },
        { t: "note", v: "gray", bar: true, text: "Remember: these percentages are approximate. People’s routines can be different!" },
        { t: "sec", text: "EXAMPLES IN CONTEXT" },
        { t: "rows", items: [
          { text: "She always reads books in the morning.", c: "purple" },
          { text: "They usually have dinner together.", c: "blue" },
          { text: "He often goes running after work.", c: "teal" },
          { text: "I sometimes drink coffee in the afternoon.", c: "teal" },
          { text: "We don’t watch TV very often.", c: "orange" },
          { text: "She rarely travels on business.", c: "orange" },
          { text: "He never eats junk food.", c: "red" } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "KEY IDEA", text: "Use adverbs of frequency to talk about habits and routines in your life." } ] },

      { blocks: [
        { t: "badge", label: "AULA 33" },
        { t: "title", en: "WHERE DOES THE ADVERB GO?", pt: "MAIN VERB × VERB TO BE" },
        { t: "cards", items: [
          { tag: "SUBJECT + ADVERB + MAIN VERB", c: "teal", v: "mint", id: "a33p3a", ph: "Fotos pequenas: mulher lendo, casal comendo, homem bebendo suco",
            lines: ["She always reads books in the morning.", "They usually eat chocolate.", "He often drinks fruit juice for breakfast.", "She often gets up late on weekends."] },
          { tag: "SUBJECT + BE + ADVERB", c: "purple", v: "lilac", id: "a33p3b", ph: "Fotos pequenas: homem olhando o relógio, moça resfriada no inverno",
            lines: ["He is always late.", "My cousin is often sick in the winter."] } ] },
        { t: "image", id: "a33p3c", ph: "Foto: mulher ouvindo música com fones à noite" },
        { t: "rows", items: [
          { text: "I sometimes listen to music at night.", c: "purple" },
          { text: "Sometimes I listen to music at night.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33" },
        { t: "title", en: "EXPRESSIONS OF FREQUENCY", pt: "Every, once, twice e … times." },
        { t: "cards", items: [
          { tag: "EVERY", c: "teal", v: "mint", lines: ["every hour", "every day", "every week", "every month", "every year"] },
          { tag: "ONCE", c: "purple", v: "lilac", lines: ["once a day", "once a week", "once a month", "once a year"] },
          { tag: "TWICE", c: "orange", v: "cream", lines: ["twice a day", "twice a week", "twice a month", "twice a year"] },
          { tag: "THREE / FOUR TIMES", c: "navy", v: "gray", lines: ["three times a week", "four times a year"] } ] },
        { t: "image", id: "a33p4", ph: "Ilustração: relógio e calendário semanal marcados" },
        { t: "key", v: "gray", text: "every hour = once an hour" } ] },

      { blocks: [
        { t: "badge", label: "AULA 33" },
        { t: "title", en: "AT THE END OF THE SENTENCE", pt: "Expressions of frequency usually go at the end of the sentence." },
        { t: "image", id: "a33p5", ph: "Foto: planner semanal sobre a mesa com caneta e café" },
        { t: "rows", items: [
          { text: "I sleep at 10:00 p.m. every day.", c: "teal" },
          { text: "I don’t watch TV every day.", c: "purple" },
          { text: "My friends and I play soccer once a week.", c: "teal" },
          { text: "Sarah rides her bike twice a month.", c: "purple" },
          { text: "They go to the gym three times a week.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33" },
        { t: "title", en: "HOW OFTEN IN REAL LIFE", pt: "Um diálogo sobre rotina." },
        { t: "image", id: "a33p6", ph: "Foto: dois amigos conversando numa cafeteria" },
        { t: "dialogue", items: [
          { s: "a", text: "How often do you go to the gym?" },
          { s: "b", text: "I usually go in the evening. I go three times a week." },
          { s: "a", text: "How often do you play soccer?" },
          { s: "b", text: "I often play soccer on Saturdays. What about you?" },
          { s: "a", text: "I rarely play soccer, but I ride my bike twice a month." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33 · PRATIQUE" },
        { t: "title", en: "PRACTICE A", pt: "CHOOSE THE ADVERB" },
        { t: "image", id: "a33p7", ph: "Fotos: casal jantando fora, homem comendo bolo, moça recusando carne, rapaz atrasado para a aula" },
        { t: "mc", id: "a33mc1", title: "ESCOLHA O ADVÉRBIO", v: "cream", questions: [
          { q: "1. James and I ________ go out to dinner together. (≈50%)", options: ["always", "sometimes", "never"], answer: 1 },
          { q: "2. Dan ________ has chocolate cake for dessert. (100%)", options: ["always", "three times", "often"], answer: 0 },
          { q: "3. My niece ________ eats meat. (0%)", options: ["not often", "once a month", "never"], answer: 2 },
          { q: "4. Jordan is ________ late for class. (100%)", options: ["twice a day", "usually", "always"], answer: 2 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33 · PRATIQUE" },
        { t: "title", en: "PRACTICE B", pt: "CHOOSE THE EXPRESSION" },
        { t: "image", id: "a33p8", ph: "Fotos: homem estudando à noite, mulher na academia, homem assistindo TV" },
        { t: "mc", id: "a33mc2", title: "ESCOLHA A EXPRESSÃO", v: "cream", questions: [
          { q: "5. He ________ does his homework on time. (≈85%)", options: ["not often", "sometimes", "usually"], answer: 2 },
          { q: "6. I go to the gym ________. (Monday · Wednesday · Friday)", options: ["once a week", "every day", "three times a week"], answer: 2 },
          { q: "7. I watch TV ________. (one time every evening)", options: ["once a day", "twice a day", "three times a day"], answer: 0 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira com calma." },
        { t: "answers", v: "cream", title: "ADVERBS", items: [
          { k: "1", a: "sometimes", c: "teal" }, { k: "2", a: "always", c: "purple" }, { k: "3", a: "never", c: "red" },
          { k: "4", a: "always", c: "purple" }, { k: "5", a: "usually", c: "teal" } ] },
        { t: "answers", v: "mint", title: "EXPRESSIONS", items: [
          { k: "6", a: "three times a week", c: "purple" }, { k: "7", a: "once a day", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33 · PRATIQUE" },
        { t: "title", en: "HOW OFTEN ABOUT YOU?", pt: "YOUR ROUTINE" },
        { t: "lead", text: "Escreva um advérbio e uma expressão de frequência para cada atividade." },
        { t: "free", id: "a33f1", items: [
          { n: "1", kicker: "LISTEN TO MUSIC", prefix: "I ________ listen to music.", ideas: "always · usually · often · sometimes · rarely · never", c: "teal", v: "mint" },
          { n: "2", kicker: "WATCH TV", prefix: "I ________ watch TV.", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "PLAY SOCCER", prefix: "I play soccer ________.", ideas: "once a week · twice a month · every day", c: "orange", v: "cream" },
          { n: "4", kicker: "GO TO THE GYM", prefix: "I go to the gym ________.", ideas: "", c: "teal", v: "mint" },
          { n: "5", kicker: "RIDE A BIKE", prefix: "I ride a bike ________.", ideas: "", c: "purple", v: "lilac" } ] },
        { t: "image", id: "a33p10", ph: "Foto: dois amigos conversando (mesma cena do diálogo)" },
        { t: "note", v: "lilac", bar: true, bold: true, text: "How often do you ____________ ?" },
        { t: "free", id: "a33f2", items: [
          { n: "6", kicker: "SUA PERGUNTA", prefix: "How often do you…?", ideas: "Escreva a pergunta e depois a sua resposta.", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 33 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "image", id: "a33p11", ph: "Foto: dupla de estudantes sorrindo e anotando" },
        { t: "check", id: "a33c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "perguntar sobre frequência com How often…?",
          "usar always, usually, often, sometimes, not often, rarely e never",
          "posicionar advérbios antes do verbo principal",
          "posicionar advérbios depois do verb to be",
          "usar every day, once, twice e … times",
          "colocar expressions of frequency normalmente no final da frase",
          "falar sobre minha rotina e a frequência das minhas atividades" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 33 · ADVERBS AND EXPRESSIONS OF FREQUENCY", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Fale sobre sua rotina usando pelo menos três advérbios de frequência e três expressões de frequência. Depois, responda a perguntas com How often…?", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "33 DE 42 AULAS", pct: "79%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 34 · Can: Abilities" } ] }
    ]
  },
  {
    id: 34, code: "AULA 34", title: "Can: Abilities", sub: "Can e can’t: habilidades e limitações.",
    time: "14 a 18 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 34" },
        { t: "title", en: "CAN", pt: "TALK ABOUT ABILITIES" },
        { t: "key", v: "gray", text: "CAN + BASE VERB\nI / you / he / she / it / we / they + can + verb" },
        { t: "note", v: "lilac", center: true, bold: true, text: "CAN DOESN’T CHANGE." },
        { t: "cards", cols: 2, items: [
          { tag: "PLAY", c: "teal", v: "mint", id: "a34p1a", ph: "Foto: homem tocando guitarra na sala", lines: ["My husband can play the guitar."] },
          { tag: "PAINT", c: "purple", v: "lilac", id: "a34p1b", ph: "Foto: mulher pintando a parede com rolo", lines: ["She can paint the wall."] },
          { tag: "COOK", c: "teal", v: "mint", id: "a34p1c", ph: "Foto: casal cozinhando juntos", lines: ["They can cook."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34" },
        { t: "title", en: "CAN’T", pt: "TALK ABOUT LIMITATIONS" },
        { t: "key", v: "gray", text: "SUBJECT + CAN’T + BASE VERB\ncan’t = cannot" },
        { t: "cards", cols: 2, items: [
          { tag: "SPEAK", c: "teal", v: "mint", id: "a34p2a", ph: "Foto: mulher confusa lendo um livro", lines: ["I can’t speak Japanese."] },
          { tag: "COOK", c: "purple", v: "lilac", id: "a34p2b", ph: "Foto: homem preocupado com a panela queimando", lines: ["He can’t cook."] },
          { tag: "PLAY", c: "red", v: "red", id: "a34p2c", ph: "Foto: tenista com dor no ombro", lines: ["She can’t play tennis."] } ] },
        { t: "note", v: "lilac", bar: true, kicker: "CAN × CAN’T", text: "Na fala, can é curto e can’t é mais forte. Ouça a diferença com atenção." } ] },

      { blocks: [
        { t: "badge", label: "AULA 34" },
        { t: "title", en: "CAN YOU…?", pt: "QUESTIONS & SHORT ANSWERS" },
        { t: "key", v: "gray", text: "Can + subject + base verb?" },
        { t: "cards", items: [
          { tag: "CAN YOU RUN?", c: "teal", v: "mint", id: "a34p3a", ph: "Foto: homem correndo na orla", lines: ["Yes, I can.", "No, I can’t."] },
          { tag: "CAN HE PLAY TENNIS?", c: "purple", v: "lilac", id: "a34p3b", ph: "Foto: homem jogando tênis", lines: ["Yes, he can.", "No, he can’t."] },
          { tag: "CAN EAGLES FLY?", c: "teal", v: "mint", id: "a34p3c", ph: "Foto: águia voando no céu azul", lines: ["Yes, they can."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34" },
        { t: "title", en: "HOW WELL CAN YOU DO IT?", pt: "DEGREES OF ABILITY" },
        { t: "grid", cols: 1, items: [
          { title: "very well", body: "", c: "purple", v: "lilac" },
          { title: "well", body: "", c: "teal", v: "green" },
          { title: "quite well", body: "", c: "yellow", v: "cream" },
          { title: "not very well", body: "", c: "orange", v: "cream" },
          { title: "not at all", body: "", c: "red", v: "red" } ] },
        { t: "image", id: "a34p4a", ph: "Foto: homem andando a cavalo" },
        { t: "key", v: "navy", text: "James can ride a horse very well." },
        { t: "cards", cols: 2, items: [
          { tag: "SKATEBOARD", c: "teal", v: "mint", id: "a34p4b", ph: "Foto: rapaz andando de skate", lines: ["My brother can skateboard well."] },
          { tag: "SING", c: "purple", v: "lilac", id: "a34p4c", ph: "Foto: moça cantando no microfone", lines: ["I can sing quite well."] },
          { tag: "CAN’T SING", c: "red", v: "red", lines: ["I can’t sing at all."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34" },
        { t: "title", en: "CAN × BE GOOD AT", pt: "TWO WAYS TO TALK ABOUT ABILITY" },
        { t: "image", id: "a34p5", ph: "Foto: mulher desenhando um retrato no ateliê" },
        { t: "cards", items: [
          { tag: "CAN + BASE VERB", c: "teal", v: "mint", lines: ["My daughter can draw very well."] },
          { tag: "BE GOOD AT + NOUN / VERB + -ING", c: "purple", v: "lilac", lines: ["My daughter is good at drawing."] } ] },
        { t: "table", head: ["VERB", "NOUN / -ING"], rows: [
          { a: "draw", b: "drawing", v: "mint" }, { a: "ride a bike", b: "biking", v: "mint" },
          { a: "play the piano", b: "playing the piano", v: "lilac" }, { a: "swim", b: "swimming", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34" },
        { t: "title", en: "LET’S TALK", pt: "WHAT CAN YOU DO?" },
        { t: "image", id: "a34p6", ph: "Foto: dois amigos conversando numa cafeteria" },
        { t: "dialogue", items: [
          { s: "a", text: "Can you play the guitar?" },
          { s: "b", text: "Yes, I can. I can play quite well." },
          { s: "a", text: "How often do you play the guitar?" },
          { s: "b", text: "I usually play three times a week. Can you sing?" },
          { s: "a", text: "Yes, I can. I can sing well." },
          { s: "b", text: "Can you dance?" },
          { s: "a", text: "No, I can’t. I can’t dance at all." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34 · PRATIQUE" },
        { t: "title", en: "CAN OR CAN’T?", pt: "CHOOSE THE CORRECT FORM" },
        { t: "image", id: "a34p7", ph: "Fotos: pintora, bebê, músico com guitarra, jogador de basquete" },
        { t: "fill", id: "a34e1", title: "COMPLETE COM CAN OU CAN’T", v: "cream", items: [
          { pre: "1. Tom is an artist. He", answers: ["can"], post: "draw well.", v: "mint" },
          { pre: "2. My little brother is seven months old. He", answers: ["can't", "cant", "cannot"], post: "run at all.", v: "lilac" },
          { pre: "3. Maria is a musician. She", answers: ["can"], post: "play the guitar very well.", v: "lilac" },
          { pre: "4. I’m sick today. I", answers: ["can't", "cant", "cannot"], post: "jump very well.", v: "cream" },
          { pre: "5. Scientists", answers: ["can"], post: "do experiments in a lab.", v: "mint" },
          { pre: "6. My leg hurts. I", answers: ["can't", "cant", "cannot"], post: "play soccer very well.", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "CAN OR CAN’T?" },
        { t: "rows", items: [
          { text: "1. Tom is an artist. He can draw well.", c: "teal" },
          { text: "2. My little brother is seven months old. He can’t run at all.", c: "purple" },
          { text: "3. Maria is a musician. She can play the guitar very well.", c: "purple" },
          { text: "4. I’m sick today. I can’t jump very well.", c: "orange" },
          { text: "5. Scientists can do experiments in a lab.", c: "teal" },
          { text: "6. My leg hurts. I can’t play soccer very well.", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 34 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a34c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "talk about abilities with can",
          "talk about limitations with can’t",
          "ask and answer questions with can",
          "describe degrees of ability" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 34 · CAN / CAN’T", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Talk about three things you can do, two things you can’t do, and one thing you can do very well.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "34 DE 42 AULAS", pct: "81%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 35 · Object Pronouns" } ] }
    ]
  },
  {
    id: 35, code: "AULA 35", title: "Object Pronouns", sub: "Subject × object: me, you, him, her, it, us, them.",
    time: "15 a 20 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 35" },
        { t: "title", en: "OBJECT PRONOUNS", pt: "SUBJECT × OBJECT" },
        { t: "image", id: "a35p1", ph: "Foto: grupo de amigos assistindo futebol no sofá com pipoca" },
        { t: "cards", items: [
          { tag: "SUBJECT PRONOUN", c: "teal", v: "mint", lines: ["My friends and I love soccer.", "We watch soccer together every Sunday."] },
          { tag: "OBJECT PRONOUN", c: "purple", v: "lilac", lines: ["O subject pronoun pratica a ação. O object pronoun recebe a ação."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35" },
        { t: "title", en: "WHERE DOES THE OBJECT PRONOUN GO?", pt: "AFTER A VERB × AFTER A PREPOSITION" },
        { t: "cards", items: [
          { tag: "AFTER A VERB", c: "purple", v: "lilac", id: "a35p2a", ph: "Foto: filho beijando a mãe no rosto", lines: ["I love my mom.", "→ I love her."] },
          { tag: "AFTER A PREPOSITION", c: "teal", v: "mint", id: "a35p2b", ph: "Foto: neto e avó tomando café juntos", lines: ["I live with my grandma.", "→ I live with her."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35" },
        { t: "title", en: "SUBJECT → OBJECT", pt: "A tabela completa." },
        { t: "table", head: ["SUBJECT", "OBJECT"], rows: [
          { a: "I", b: "me", v: "mint" }, { a: "you", b: "you", v: "white" }, { a: "he", b: "him", v: "mint" },
          { a: "she", b: "her", v: "white" }, { a: "it", b: "it", v: "mint" }, { a: "we", b: "us", v: "white" },
          { a: "they", b: "them", v: "mint" } ] },
        { t: "sec", text: "HER × HER", c: "purple" },
        { t: "cards", items: [
          { tag: "OBJECT PRONOUN", c: "purple", v: "lilac", id: "a35p3a", ph: "Foto: duas mulheres conversando no sofá", lines: ["I live with her."] },
          { tag: "POSSESSIVE ADJECTIVE", c: "teal", v: "mint", id: "a35p3b", ph: "Foto: caderno com a frase “her lessons”", lines: ["her lessons"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35" },
        { t: "title", en: "REPLACE THE NOUN", pt: "OBJECT PRONOUNS IN CONTEXT" },
        { t: "cards", items: [
          { tag: "IT", c: "purple", v: "lilac", id: "a35p4a", ph: "Foto: mulher almoçando frango", lines: ["My mother likes chicken.", "→ My mother likes it."] },
          { tag: "THEM", c: "teal", v: "mint", id: "a35p4b", ph: "Foto: homem olhando os vizinhos com desconfiança", lines: ["He doesn’t like his neighbors.", "→ He doesn’t like them."] },
          { tag: "US", c: "purple", v: "lilac", id: "a35p4c", ph: "Foto: casal pedindo ajuda na recepção", lines: ["Can you help my boyfriend and me?", "→ Can you help us?"] },
          { tag: "HIM", c: "teal", v: "mint", id: "a35p4d", ph: "Foto: neto abraçando o avô", lines: ["My grandpa is awesome.", "→ I love him."] },
          { tag: "HIM / YOU", c: "purple", v: "lilac", id: "a35p4e", ph: "Fotos: homem ajudando outro no parque; mulher apontando para a câmera", lines: ["Let’s help him.", "I love you."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35 · PRATIQUE" },
        { t: "title", en: "YOUR TURN", pt: "CHOOSE THE OBJECT PRONOUN" },
        { t: "image", id: "a35p5", ph: "Fotos: amigas vendo fotos, rapaz de moletom, homem sorrindo, mulher com bicicleta, mãe e filha cozinhando" },
        { t: "fill", id: "a35e1", title: "COMPLETE COM O OBJECT PRONOUN", v: "cream", items: [
          { pre: "1. They like photos. → They like", answers: ["them"], post: ".", v: "mint" },
          { pre: "2. I like superheroes. → I like", answers: ["them"], post: ".", v: "lilac" },
          { pre: "3. He likes Superman. → He likes", answers: ["him"], post: ".", v: "mint" },
          { pre: "4. She likes her bike. → She likes", answers: ["it"], post: ".", v: "lilac" },
          { pre: "5. Carla cooks for her daughter. → Carla cooks for", answers: ["her"], post: ".", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "NOUN → OBJECT PRONOUN" },
        { t: "answers", v: "cream", title: "GABARITO", items: [
          { k: "1", a: "photos → them", c: "teal" }, { k: "2", a: "superheroes → them", c: "purple" },
          { k: "3", a: "the superhero → him", c: "purple" }, { k: "4", a: "bike → it", c: "teal" },
          { k: "5", a: "daughter → her", c: "purple" } ] },
        { t: "image", id: "a35p6", ph: "Ilustrações: fotos instantâneas, super-heróis, bicicleta, mãe e filha" } ] },

      { blocks: [
        { t: "badge", label: "AULA 35" },
        { t: "title", en: "OBJECT PRONOUNS", pt: "IN REAL LIFE" },
        { t: "image", id: "a35p7", ph: "Foto: dois amigos conversando numa cafeteria" },
        { t: "dialogue", items: [
          { s: "a", text: "Do you know Anna and Leo?" },
          { s: "b", text: "Yes, I know them. I work with them." },
          { s: "a", text: "Can you help Leo today?" },
          { s: "b", text: "Yes, I can help him. What about Anna?" },
          { s: "a", text: "I can talk to her after class." },
          { s: "b", text: "Great. Can you call me later?" },
          { s: "a", text: "Yes, I can call you at 6:00." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35 · PRATIQUE" },
        { t: "title", en: "CORRECT THE PRONOUNS", pt: "Reescreva o texto com os pronomes certos." },
        { t: "image", id: "a35p8", ph: "Foto: família nas férias (imagem de apoio do texto)" },
        { t: "free", id: "a35f1", items: [
          { n: "1", kicker: "CORRIJA", prefix: "I’m Nathaly. I’m 15. On vacation, I always spend a week at my cousins’ house. Them names are Juan and Karen.", ideas: "Dica: “Them names” → possessivo.", c: "purple", v: "lilac" },
          { n: "2", kicker: "CORRIJA", prefix: "Them are siblings. Him is 27 and her is 29. Their parents’ names are Mark and Linda. Juan and Karen live with they.", ideas: "Dica: sujeito × objeto.", c: "teal", v: "mint" },
          { n: "3", kicker: "CORRIJA", prefix: "Karen has dance lessons on Friday evenings, and she takes I with she to her lessons. Her loves dancing. She has a little dog named Destroyer. He is a poodle. She calls he Destroyer because him sometimes destroys her school books. But she loves he.", ideas: "Dica: depois do verbo, use object pronouns.", c: "purple", v: "lilac" },
          { n: "4", kicker: "CORRIJA", prefix: "I really like going there because my cousins are very friendly with I.", ideas: "Dica: depois de preposição, use object pronoun.", c: "teal", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35 · GABARITO" },
        { t: "title", en: "CORRECTED VERSION", pt: "Compare com a sua correção." },
        { t: "image", id: "a35p9", ph: "Foto: adolescente estudando no quarto com um poodle ao lado" },
        { t: "rows", items: [
          { text: "I’m Nathaly. I’m 15. On vacation, I always spend a week at my cousins’ house. Their names are Juan and Karen.", c: "purple" },
          { text: "They are siblings. He’s 27 and she’s 29. Their parents’ names are Mark and Linda. Juan and Karen live with them.", c: "teal" },
          { text: "Karen has dance lessons on Friday evenings, and she takes me with her to her lessons. She loves dancing. She has a little dog named Destroyer. He is a poodle. She calls him Destroyer because he sometimes destroys her school books. But she loves him.", c: "purple" },
          { text: "I really like going there because my cousins are very friendly with me.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35 · PRATIQUE" },
        { t: "title", en: "SAY IT WITH A PRONOUN", pt: "PEOPLE & THINGS" },
        { t: "cards", cols: 2, items: [
          { tag: "MARIA → HER", c: "teal", v: "mint", id: "a35p10a", ph: "Foto: mulher com bicicleta" },
          { tag: "DANIEL → HIM", c: "purple", v: "lilac", id: "a35p10b", ph: "Foto: rapaz de óculos sorrindo" },
          { tag: "ANNA AND LEO → THEM", c: "teal", v: "mint", id: "a35p10c", ph: "Foto: casal conversando na cafeteria" },
          { tag: "MY PHONE → IT", c: "purple", v: "lilac", id: "a35p10d", ph: "Ilustração: celular" },
          { tag: "MY FRIEND AND ME → US", c: "teal", v: "mint", id: "a35p10e", ph: "Foto: casal conversando com uma amiga" },
          { tag: "YOU → YOU", c: "purple", v: "lilac", id: "a35p10f", ph: "Foto: mulher apontando para a câmera" } ] },
        { t: "free", id: "a35f2", items: [
          { n: "1", kicker: "COMPLETE", prefix: "I know ________.", ideas: "Use her, him, them, it, us ou you.", c: "teal", v: "mint" },
          { n: "2", kicker: "COMPLETE", prefix: "I work with ________.", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "COMPLETE", prefix: "I can help ________.", ideas: "", c: "teal", v: "mint" },
          { n: "4", kicker: "COMPLETE", prefix: "I talk to ________.", ideas: "", c: "purple", v: "lilac" },
          { n: "5", kicker: "COMPLETE", prefix: "I like ________.", ideas: "", c: "teal", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 35 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a35c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "diferenciar Subject Pronouns e Object Pronouns",
          "usar me, you, him, her, it, us e them",
          "colocar object pronouns depois de verbos",
          "usar object pronouns depois de preposições",
          "distinguir her objeto de her possessivo",
          "substituir pessoas e coisas sem repetir o substantivo" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 35 · OBJECT PRONOUNS", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Substitua pessoas e objetos por object pronouns em cinco frases e use pelo menos duas delas depois de preposições.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "35 DE 42 AULAS", pct: "83%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 36 · Meals and Restaurant" } ] }
    ]
  },
  {
    id: 36, code: "AULA 36", title: "Meals and Restaurant", sub: "Refeições, comidas e como pedir num restaurante.",
    time: "16 a 20 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "MEALS AND RESTAURANT VOCABULARY", pt: "BREAKFAST · LUNCH · DINNER · SNACK" },
        { t: "cards", cols: 2, items: [
          { tag: "BREAKFAST · MORNING", c: "teal", v: "mint", id: "a36p1a", ph: "Foto: café, torrada, ovos mexidos e tigela de cereal com frutas" },
          { tag: "LUNCH · AFTERNOON", c: "purple", v: "lilac", id: "a36p1b", ph: "Foto: prato de arroz, feijão e salada" },
          { tag: "DINNER · EVENING", c: "navy", v: "gray", id: "a36p1c", ph: "Foto: salmão grelhado com brócolis e purê" },
          { tag: "SNACK", c: "yellow", v: "cream", id: "a36p1d", ph: "Foto: tigela de frutas com cereais" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "BREAKFAST", pt: "MORNING FOOD & DRINKS" },
        { t: "image", id: "a36p2", ph: "Composição com etiquetas: coffee, waffles, milk, pancakes, cheese, sausage, cereal, bread" },
        { t: "chips", title: "BREAKFAST WORDS", items: [
          { t: "coffee", c: "teal" }, { t: "waffles", c: "navy" }, { t: "milk", c: "purple" },
          { t: "pancakes", c: "teal" }, { t: "cheese", c: "navy" }, { t: "sausage", c: "purple" },
          { t: "cereal", c: "teal" }, { t: "bread", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "BREAKFAST IN CONTEXT", pt: "FRUIT, CROISSANTS & BREAD" },
        { t: "cards", cols: 2, items: [
          { tag: "FRUIT", c: "teal", v: "mint", id: "a36p3a", ph: "Foto: tigela de frutas com suco de laranja", lines: ["I have fruit for breakfast."] },
          { tag: "CROISSANT", c: "purple", v: "lilac", id: "a36p3b", ph: "Foto: croissants com café e geleia", lines: ["She has croissants and coffee for breakfast."] } ] },
        { t: "cards", cols: 2, items: [
          { tag: "A HAMBURGER BUN", c: "teal", v: "mint", id: "a36p3c", ph: "Foto: pão de hambúrguer com gergelim" },
          { tag: "A ROLL", c: "purple", v: "lilac", id: "a36p3d", ph: "Foto: pãozinho redondo rústico" },
          { tag: "FRENCH BREAD / A BAGUETTE", c: "navy", v: "gray", id: "a36p3e", ph: "Foto: baguete fatiada" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "LUNCH", pt: "WHAT DO YOU USUALLY HAVE?" },
        { t: "image", id: "a36p4", src: "/lessons/fotos/aula_36_pagina_04_foto_01.jpg", alt: "Prato de arroz, feijão e carne com salada, batata frita e macarrão", ph: "Foto: almoço completo (arroz, feijão, carne, salada, batata frita, macarrão)" },
        { t: "chips", title: "LUNCH WORDS", items: [
          { t: "rice", c: "teal" }, { t: "carrots", c: "purple" }, { t: "beans", c: "teal" }, { t: "pasta", c: "purple" },
          { t: "salad", c: "teal" }, { t: "French fries", c: "purple" }, { t: "meat", c: "teal" }, { t: "stroganoff", c: "purple" } ] },
        { t: "dialogue", items: [
          { s: "a", text: "What do you usually have for lunch?" },
          { s: "b", text: "I usually have rice, beans and meat for lunch." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "SNACK & DINNER", pt: "Lanche e jantar." },
        { t: "cards", cols: 2, items: [
          { tag: "A BLT", c: "purple", v: "lilac", id: "a36p5a", ph: "Foto: sanduíche de bacon, alface e tomate", note: "BLT = bacon, lettuce and tomato." },
          { tag: "CAKE", c: "teal", v: "mint", id: "a36p5b", ph: "Foto: fatia de bolo de chocolate" },
          { tag: "COOKIES", c: "purple", v: "lilac", id: "a36p5c", ph: "Foto: biscoitos com gotas de chocolate" },
          { tag: "FRUIT", c: "teal", v: "mint", id: "a36p5d", ph: "Foto: tigela de frutas picadas" },
          { tag: "PIZZA", c: "navy", v: "gray", id: "a36p5e", ph: "Foto: pizza inteira" },
          { tag: "SOUP", c: "teal", v: "mint", id: "a36p5f", ph: "Foto: prato de sopa" },
          { tag: "HAMBURGER", c: "navy", v: "gray", id: "a36p5g", ph: "Foto: hambúrguer completo" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "IN A RESTAURANT", pt: "APPETIZERS · DESSERTS · DRINKS" },
        { t: "cards", items: [
          { tag: "APPETIZERS", c: "teal", v: "mint", id: "a36p6a", ph: "Foto: pastéis com salada de entrada" },
          { tag: "DESSERTS", c: "purple", v: "lilac", id: "a36p6b", ph: "Fotos: sorvete, bolo de chocolate e pudim", lines: ["ice cream", "chocolate cake", "pudding"] },
          { tag: "DRINKS", c: "navy", v: "gray", id: "a36p6c", ph: "Fotos: refrigerante, água, suco e cerveja", lines: ["soda", "water", "juice", "beer"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "MEAT & FISH", pt: "Carnes e peixe." },
        { t: "cards", cols: 2, items: [
          { tag: "CHICKEN LEGS", c: "teal", v: "mint", id: "a36p7a", ph: "Foto: coxas de frango assadas" },
          { tag: "CHICKEN BREAST", c: "purple", v: "lilac", id: "a36p7b", ph: "Foto: filé de peito de frango grelhado" },
          { tag: "SAUSAGES", c: "navy", v: "gray", id: "a36p7c", ph: "Foto: linguiças grelhadas com molho" },
          { tag: "TWO STEAKS", c: "purple", v: "lilac", id: "a36p7d", ph: "Foto: dois bifes grelhados" },
          { tag: "GRILLED SKEWERS WITH MEAT AND VEGETABLES", c: "navy", v: "gray", id: "a36p7e", ph: "Foto: espetinhos de carne com legumes" },
          { tag: "FISH", c: "teal", v: "mint", id: "a36p7f", ph: "Foto: posta de peixe grelhado com limão" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36 · PRATIQUE" },
        { t: "title", en: "MEAL INTERVIEW", pt: "WHAT DO YOU USUALLY HAVE?" },
        { t: "image", id: "a36p8", ph: "Foto: dois amigos conversando na cafeteria com café e croissant" },
        { t: "free", id: "a36f1", items: [
          { n: "1", kicker: "BREAKFAST", prefix: "I usually have ________ for breakfast.", ideas: "coffee · bread · fruit · cereal", c: "teal", v: "mint" },
          { n: "2", kicker: "LUNCH", prefix: "I usually have ________ for lunch.", ideas: "rice · beans · meat · salad", c: "purple", v: "lilac" },
          { n: "3", kicker: "DINNER", prefix: "I usually have ________ for dinner.", ideas: "pizza · soup · hamburger", c: "navy", v: "blue" },
          { n: "4", kicker: "SNACK", prefix: "I usually have ________ for a snack.", ideas: "fruit · cookies · cake", c: "teal", v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 36" },
        { t: "title", en: "AT A RESTAURANT", pt: "ORDERING FOOD" },
        { t: "image", id: "a36p9", ph: "Foto: garçom anotando o pedido de uma cliente com menu" },
        { t: "dialogue", items: [
          { s: "b", text: "SERVER: Are you ready to order?" },
          { s: "a", text: "CUSTOMER: Yes. I’d like a cheeseburger, please." },
          { s: "b", text: "SERVER: Anything to drink?" },
          { s: "a", text: "CUSTOMER: I’d like a glass of soda, please." } ] },
        { t: "sec", text: "AFTER THE MEAL", c: "purple" },
        { t: "dialogue", items: [
          { s: "b", text: "SERVER: Can I bring you anything else?" },
          { s: "a", text: "CUSTOMER: No, thanks. Just the bill, please." } ] },
        { t: "key", v: "lilac", text: "Could I have a glass of soda, please?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 36 · PRATIQUE" },
        { t: "title", en: "ORDER YOUR MEAL", pt: "ROLE-PLAY" },
        { t: "cards", items: [
          { tag: "FOOD", c: "navy", v: "gray", lines: ["cheeseburger", "pizza", "soup", "pasta", "fish"] },
          { tag: "DESSERTS", c: "purple", v: "lilac", lines: ["ice cream", "chocolate cake", "pudding"] },
          { tag: "DRINKS", c: "teal", v: "mint", lines: ["water", "juice", "soda"] } ] },
        { t: "image", id: "a36p10", ph: "Foto: casal à mesa no restaurante" },
        { t: "fill", id: "a36e1", title: "COMPLETE O ROLE-PLAY", v: "cream", items: [
          { pre: "A: Are you ready to order?  B: Yes. I’d like", answers: ["pizza", "a cheeseburger", "soup", "pasta", "fish"], post: ", please.", v: "white" },
          { pre: "A: Anything to drink?  B: Could I have", answers: ["water", "juice", "soda", "a glass of soda"], post: ", please?", v: "white" },
          { pre: "A: Anything else?  B:", answers: ["ice cream", "chocolate cake", "pudding"], post: ", please.", v: "white" } ] },
        { t: "key", v: "navy", text: "B: No, thanks. Just the bill, please." } ] },

      { blocks: [
        { t: "badge", label: "AULA 36 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a36c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "identificar breakfast, lunch, dinner e snack",
          "nomear alimentos comuns das quatro situações",
          "reconhecer appetizers, desserts, drinks, meat e fish",
          "perguntar What do you usually have for…?",
          "dizer o que costumo comer",
          "pedir comida e bebida educadamente em um restaurante",
          "compreender um diálogo básico de pedido e pagamento" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 36 · MEALS AND RESTAURANT VOCABULARY", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Faça um pedido completo em um restaurante: escolha uma comida, uma bebida e uma sobremesa e finalize pedindo a conta.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "36 DE 42 AULAS", pct: "86%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 37 · Count and Noncount Nouns; a/an, some, any" } ] }
    ]
  },
  {
    id: 37, code: "AULA 37", title: "Count and Noncount Nouns", sub: "A/an, some e any com contáveis e não contáveis.",
    time: "18 a 22 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "COUNT AND NONCOUNT NOUNS", pt: "A/AN · SOME · ANY" },
        { t: "cards", cols: 2, items: [
          { tag: "COUNTABLE", c: "teal", v: "mint", id: "a37p1a", ph: "Foto: uma maçã e duas maçãs", lines: ["an apple → two apples"] },
          { tag: "UNCOUNTABLE", c: "purple", v: "lilac", id: "a37p1b", ph: "Foto: arroz numa tigela e um copo de água", lines: ["rice", "water"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "COUNTABLE NOUNS", pt: "SINGULAR → PLURAL" },
        { t: "key", v: "gray", text: "Countable nouns have a singular and a plural form." },
        { t: "cards", cols: 2, items: [
          { tag: "AN APPLE → TWO APPLES", c: "teal", v: "mint", id: "a37p2a", ph: "Foto: uma maçã e depois duas maçãs" },
          { tag: "AN ORANGE → TWO ORANGES", c: "purple", v: "lilac", id: "a37p2b", ph: "Foto: uma laranja e depois duas laranjas" },
          { tag: "A CHAIR → TWO CHAIRS", c: "teal", v: "mint", id: "a37p2c", ph: "Foto: uma cadeira e depois duas cadeiras" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "UNCOUNTABLE NOUNS", pt: "Substantivos não contáveis." },
        { t: "key", v: "gray", text: "Uncountable nouns are used as singular nouns and do not normally have a plural form in these meanings." },
        { t: "cards", cols: 2, items: [
          { tag: "MEAT", c: "purple", v: "lilac", id: "a37p3a", ph: "Foto: carne crua em tigela de madeira" },
          { tag: "CHOCOLATE", c: "purple", v: "lilac", id: "a37p3b", ph: "Foto: barras de chocolate" },
          { tag: "SUGAR", c: "purple", v: "lilac", id: "a37p3c", ph: "Foto: açúcar em tigela de madeira" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "COUNTABLE OR UNCOUNTABLE?", pt: "Compare os pares." },
        { t: "table", head: ["COUNTABLE", "UNCOUNTABLE"], rows: [
          { a: "orange", b: "orange juice", v: "mint" },
          { a: "grapes", b: "flour", v: "lilac" },
          { a: "tomato", b: "tomato sauce", v: "mint" },
          { a: "dollars", b: "money", v: "lilac" } ] },
        { t: "image", id: "a37p4", ph: "Fotos em pares: laranja/suco, uvas/farinha, tomate/molho, dólares/dinheiro" } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "WE COUNT THE CONTAINER", pt: "UNCOUNTABLE NOUN + COUNTABLE UNIT" },
        { t: "key", v: "gray", text: "The food or drink stays uncountable. We count the container or unit." },
        { t: "cards", items: [
          { tag: "RICE → A BAG OF RICE", c: "purple", v: "lilac", id: "a37p5a", ph: "Foto: arroz na tigela e um saco de arroz" },
          { tag: "WATER → TWO BOTTLES OF WATER", c: "teal", v: "mint", id: "a37p5b", ph: "Foto: copo de água e duas garrafas de água" },
          { tag: "SODA → A CAN OF SODA", c: "purple", v: "lilac", id: "a37p5c", ph: "Foto: copo de refrigerante e uma lata" },
          { tag: "BREAD → A SLICE OF BREAD", c: "teal", v: "mint", id: "a37p5d", ph: "Foto: pão fatiado e uma fatia no prato" } ] },
        { t: "chips", items: [
          { t: "water = uncountable", c: "purple" }, { t: "bottles = countable", c: "teal" },
          { t: "bread = uncountable", c: "purple" }, { t: "slice = countable", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "A OR AN?", pt: "LISTEN TO THE FIRST SOUND" },
        { t: "cards", cols: 2, items: [
          { tag: "A + CONSONANT SOUND", c: "teal", v: "mint", lines: ["a pencil", "a book", "a university"] },
          { tag: "AN + VOWEL SOUND", c: "purple", v: "lilac", lines: ["an eraser", "an apple", "an hour"] } ] },
        { t: "image", id: "a37p6", ph: "Fotos: lápis, livro, borracha, maçã, universidade e relógio" },
        { t: "key", v: "navy", text: "sound > spelling" } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "SOME / ANY", pt: "Afirmativas × negativas e perguntas." },
        { t: "cards", cols: 2, items: [
          { tag: "SOME: FOR AFFIRMATIVE SENTENCES", c: "teal", v: "mint", id: "a37p7a", ph: "Foto: copo de água na cozinha", lines: ["I usually drink some water when I go to the kitchen."] },
          { tag: "ANY: FOR NEGATIVES AND QUESTIONS", c: "purple", v: "lilac", id: "a37p7b", ph: "Foto: cesta de frutas vazia", lines: ["There aren’t any bananas in this basket."] },
          { tag: "SOME BANANAS", c: "teal", v: "mint", id: "a37p7c", ph: "Foto: bananas no prato", lines: ["There are some bananas on the table."] },
          { tag: "ANY ORANGE JUICE", c: "purple", v: "lilac", id: "a37p7d", ph: "Foto: caneca de suco de laranja", lines: ["Is there any orange juice in this cup?"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37" },
        { t: "title", en: "ANY", pt: "NEGATIVE SENTENCES + QUESTIONS" },
        { t: "key", v: "gray", text: "Use any with plural countable nouns and uncountable nouns in negative sentences and questions." },
        { t: "cards", cols: 2, items: [
          { tag: "NEGATIVE", c: "purple", v: "lilac", id: "a37p8a", ph: "Foto: cesta de frutas", lines: ["There aren’t any bananas in this basket.", "We don’t have any juice for breakfast."] },
          { tag: "QUESTIONS", c: "navy", v: "gray", id: "a37p8b", ph: "Fotos: caneca de suco e limões", lines: ["Is there any orange juice in this cup?", "Do you have any lemons?"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37 · MAPA" },
        { t: "title", en: "A/AN · SOME · ANY", pt: "THE COMPLETE MAP" },
        { t: "cards", items: [
          { tag: "SINGULAR COUNTABLE", c: "teal", v: "mint", id: "a37p9a", ph: "Foto: uma maçã", lines: ["Affirmative: I have an apple.", "Negative: I don’t have an apple.", "Question: Do you have an apple?"] },
          { tag: "PLURAL COUNTABLE", c: "navy", v: "blue", id: "a37p9b", ph: "Foto: bananas", lines: ["Affirmative: I have some bananas.", "Negative: I don’t have any bananas.", "Question: Do you have any bananas?"] },
          { tag: "UNCOUNTABLE", c: "purple", v: "lilac", id: "a37p9c", ph: "Foto: copo de água", lines: ["Affirmative: I have some water.", "Negative: I don’t have any water.", "Question: Do you have any water?"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37 · PRATIQUE" },
        { t: "title", en: "YOUR TURN", pt: "A / AN / SOME" },
        { t: "image", id: "a37p10", ph: "Composição numerada: pão, ovo, sal, fatias de pão, uvas, mel, lata de refrigerante, sopa" },
        { t: "fill", id: "a37e1", title: "COMPLETE COM A, AN OU SOME", v: "cream", items: [
          { pre: "1. I’d like", answers: ["some"], post: "bread.", v: "white" },
          { pre: "2. I’d like", answers: ["an"], post: "egg.", v: "white" },
          { pre: "3. I’d like", answers: ["some"], post: "salt.", v: "white" },
          { pre: "4. I’d like", answers: ["a"], post: "slice of bread.", v: "white" },
          { pre: "5. I’d like", answers: ["some"], post: "grapes.", v: "white" },
          { pre: "6. I’d like", answers: ["some"], post: "honey.", v: "white" },
          { pre: "7. I’d like", answers: ["a"], post: "can of soda.", v: "white" },
          { pre: "8. I’d like", answers: ["some"], post: "soup.", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira as respostas." },
        { t: "answers", v: "cream", title: "GABARITO", items: [
          { k: "1", a: "some bread", c: "purple" }, { k: "2", a: "an egg", c: "teal" },
          { k: "3", a: "some salt", c: "purple" }, { k: "4", a: "a slice of bread", c: "teal" },
          { k: "5", a: "some grapes", c: "teal" }, { k: "6", a: "some honey", c: "purple" },
          { k: "7", a: "a can of soda", c: "teal" }, { k: "8", a: "some soup", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37 · PRATIQUE" },
        { t: "title", en: "SHOP & ORDER", pt: "USE A/AN, SOME & ANY" },
        { t: "cards", cols: 2, items: [
          { tag: "STORE", c: "teal", v: "mint", id: "a37p12a", ph: "Foto: carrinho de compras com frutas, pão e água",
            lines: ["A: Do you have any grapes?", "B: Yes, we have some grapes.", "A: I’d like a bag of rice, please."] },
          { tag: "RESTAURANT", c: "purple", v: "lilac", id: "a37p12b", ph: "Foto: casal conversando no restaurante",
            lines: ["A: Would you like some soup?", "B: Yes, please.", "B: Can I have some water, please?"] } ] },
        { t: "note", v: "navy", center: true, bold: true, text: "Choose items and create your own shopping or restaurant conversation." },
        { t: "chips", items: [
          { t: "grapes", c: "teal" }, { t: "lemons", c: "purple" }, { t: "rice", c: "teal" }, { t: "bread", c: "purple" },
          { t: "water", c: "teal" }, { t: "soda", c: "purple" }, { t: "soup", c: "teal" }, { t: "fruit", c: "purple" } ] },
        { t: "free", id: "a37f1", items: [
          { n: "1", kicker: "SUA CONVERSA", prefix: "A: Do you have any…?", ideas: "Escreva a pergunta e a resposta usando some / any.", c: "teal", v: "mint" },
          { n: "2", kicker: "SEU PEDIDO", prefix: "I’d like…", ideas: "Use a/an, some ou uma unidade (bag, bottle, can, slice).", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 37 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a37c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "distinguir countable e uncountable nouns",
          "identificar substantivos contáveis no singular e plural",
          "reconhecer substantivos não contáveis",
          "usar unidades como bag, bottle, can e slice",
          "usar a/an com substantivos contáveis singulares",
          "usar some com plurais e não contáveis",
          "usar any em negativas e perguntas",
          "escolher a/an/some/any em situações básicas",
          "fazer uma compra ou pedido simples usando essas estruturas" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 37 · COUNT AND NONCOUNT NOUNS; A/AN, SOME, ANY", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Monte uma pequena lista de compras e faça um pedido usando um substantivo contável singular, um plural, um não contável e pelo menos uma unidade como bag, bottle, can ou slice.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "37 DE 42 AULAS", pct: "88%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 38 · A lot of / Many / Much" } ] }
    ]
  },
  {
    id: 38, code: "AULA 38", title: "A lot of / Many / Much", sub: "Quantidades: how many e how much.",
    time: "18 a 22 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 38" },
        { t: "title", en: "A LOT OF / MANY / MUCH", pt: "QUANTITIES · HOW MANY · HOW MUCH" },
        { t: "image", id: "a38p1", ph: "Foto: sacola de compras com frutas, pão, água, café e açúcar" },
        { t: "cards", cols: 2, items: [
          { tag: "COUNTABLE", c: "teal", v: "mint", lines: ["APPLES · BOTTLES · VEGETABLES"] },
          { tag: "UNCOUNTABLE", c: "purple", v: "lilac", lines: ["WATER · COFFEE · SUGAR"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38" },
        { t: "title", en: "A LOT OF / LOTS OF", pt: "COUNTABLE + UNCOUNTABLE" },
        { t: "cards", items: [
          { tag: "PLURAL COUNTABLE NOUNS", c: "purple", v: "lilac", id: "a38p2a", ph: "Foto: hotéis modernos com piscina ao anoitecer", lines: ["There are a lot of / lots of good hotels near here."] },
          { tag: "UNCOUNTABLE NOUNS", c: "teal", v: "mint", id: "a38p2b", ph: "Foto: copo de água, peixe grelhado, açúcar e café", lines: ["I drink a lot of water during the day.", "We eat a lot of fish.", "My uncle puts a lot of / lots of sugar in his coffee."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38" },
        { t: "title", en: "MANY OR MUCH?", pt: "COUNTABLE × UNCOUNTABLE" },
        { t: "cards", items: [
          { tag: "MANY / NOT MANY: PLURAL COUNTABLE", c: "purple", v: "lilac", id: "a38p3a", ph: "Foto: hambúrgueres e cesta de legumes", lines: ["I don’t eat many hamburgers.", "Are there many vegetables in the basket?"] },
          { tag: "MUCH / NOT MUCH: UNCOUNTABLE", c: "teal", v: "mint", id: "a38p3b", ph: "Foto: suco, café e açúcar sobre a mesa", lines: ["I don’t drink much coffee in the morning.", "Is there much sugar in this orange juice?"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38" },
        { t: "title", en: "HOW MANY OR HOW MUCH?", pt: "Perguntando quantidade." },
        { t: "cards", items: [
          { tag: "HOW MANY + PLURAL COUNTABLE", c: "purple", v: "lilac", id: "a38p4a", ph: "Foto: cesta de morangos e família no sofá", lines: ["How many strawberries are there in this basket?", "How many children do you have?"] },
          { tag: "HOW MUCH + UNCOUNTABLE", c: "teal", v: "mint", id: "a38p4b", ph: "Foto: colher de açúcar sobre a xícara de café", lines: ["How much sugar do you put in your coffee?"] },
          { tag: "PRICE", c: "navy", v: "gray", id: "a38p4c", ph: "Foto: livro fechado sobre a mesa", lines: ["How much is this book?", "It’s $20.00."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · MAPA" },
        { t: "title", en: "THE QUANTITY MAP", pt: "AFFIRMATIVE · NEGATIVE · QUESTIONS" },
        { t: "cards", cols: 2, items: [
          { tag: "COUNTABLE", c: "teal", v: "mint", id: "a38p5a", ph: "Foto: cesta com frutas, pão e água",
            lines: ["AFFIRMATIVE · a lot of", "NEGATIVE · a lot of / not many", "QUESTIONS · a lot of / many"] },
          { tag: "UNCOUNTABLE", c: "purple", v: "lilac", id: "a38p5b", ph: "Foto: água, café e açúcar",
            lines: ["AFFIRMATIVE · a lot of", "NEGATIVE · a lot of / not much", "QUESTIONS · a lot of / much"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38" },
        { t: "title", en: "QUANTITIES IN REAL LIFE", pt: "Mia e Leo na cozinha." },
        { t: "image", id: "a38p6", ph: "Foto: casal na cozinha com compras sobre a bancada" },
        { t: "dialogue", items: [
          { s: "a", text: "Mia: We need a lot of food for dinner." },
          { s: "b", text: "Leo: How many tomatoes do we need?" },
          { s: "a", text: "Mia: Six. We also need some bread." },
          { s: "b", text: "Leo: Do we need much sugar?" },
          { s: "a", text: "Mia: No, not much. How much water do we have?" },
          { s: "b", text: "Leo: We have a lot of water." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · PRATIQUE" },
        { t: "title", en: "YOUR TURN", pt: "CHOOSE THE BEST EXPRESSION" },
        { t: "image", id: "a38p7", ph: "Foto: flores, açúcar, café, farinha, tomates e carne sobre a mesa" },
        { t: "fill", id: "a38e1", title: "COMPLETE COM A LOT OF, MANY, MUCH, HOW MANY OU HOW MUCH", v: "cream", items: [
          { pre: "1. There are", answers: ["a lot of", "lots of", "many"], post: "flowers in the garden.", v: "white" },
          { pre: "2. Please, don’t put", answers: ["a lot of", "much", "lots of"], post: "salt in my food.", v: "white" },
          { pre: "3. She drinks", answers: ["a lot of", "lots of"], post: "cups of coffee every day.", v: "white" },
          { pre: "4. Do you eat", answers: ["a lot of", "much", "lots of"], post: "meat?", v: "white" },
          { pre: "5.", answers: ["how much"], post: "flour do you put in a cake?", v: "white" },
          { pre: "6.", answers: ["how many"], post: "tomatoes are there in the basket?", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira as respostas." },
        { t: "answers", v: "cream", title: "GABARITO", items: [
          { k: "1", a: "a lot of", c: "teal" }, { k: "2", a: "a lot of / much", c: "purple" },
          { k: "3", a: "a lot of", c: "teal" }, { k: "4", a: "a lot of / much", c: "purple" },
          { k: "5", a: "How much", c: "teal" }, { k: "6", a: "How many", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · PRATIQUE" },
        { t: "title", en: "CORRECT THE MISTAKES (1)", pt: "Reescreva as frases corrigidas." },
        { t: "free", id: "a38f1", items: [
          { n: "1", kicker: "CORRIJA", prefix: "I drink much water in the morning.", ideas: "", c: "teal", v: "mint" },
          { n: "2", kicker: "CORRIJA", prefix: "Would you like any fruit for dessert?", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "CORRIJA", prefix: "I don’t have some money.", ideas: "", c: "teal", v: "mint" },
          { n: "4", kicker: "CORRIJA", prefix: "Do you eat much vegetables?", ideas: "", c: "purple", v: "lilac" },
          { n: "5", kicker: "CORRIJA", prefix: "I don’t eat many bread in the morning.", ideas: "", c: "teal", v: "mint" },
          { n: "6", kicker: "CORRIJA", prefix: "Do you have some car?", ideas: "", c: "purple", v: "lilac" },
          { n: "7", kicker: "CORRIJA", prefix: "How a lot of bread do you eat a day?", ideas: "", c: "teal", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · PRATIQUE" },
        { t: "title", en: "CORRECT THE MISTAKES (2)", pt: "Continue corrigindo." },
        { t: "free", id: "a38f2", items: [
          { n: "8", kicker: "CORRIJA", prefix: "Would you like any appetizers?", ideas: "", c: "teal", v: "mint" },
          { n: "9", kicker: "CORRIJA", prefix: "Molly always eats a lot of apple after lunch.", ideas: "", c: "purple", v: "lilac" },
          { n: "10", kicker: "CORRIJA", prefix: "Brian doesn’t have much cousins.", ideas: "", c: "teal", v: "mint" },
          { n: "11", kicker: "CORRIJA", prefix: "Sarah has many time to study.", ideas: "", c: "purple", v: "lilac" },
          { n: "12", kicker: "CORRIJA", prefix: "I visit my grandma much times a week.", ideas: "", c: "teal", v: "mint" },
          { n: "13", kicker: "CORRIJA", prefix: "We have any minutes before the test.", ideas: "", c: "purple", v: "lilac" },
          { n: "14", kicker: "CORRIJA", prefix: "How much siblings do you have?", ideas: "", c: "teal", v: "mint" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · GABARITO" },
        { t: "title", en: "CHECK THE CORRECTIONS", pt: "Compare com as suas respostas." },
        { t: "rows", items: [
          { text: "1. I drink a lot of water in the morning.", c: "teal" },
          { text: "2. Would you like some fruit for dessert?", c: "teal" },
          { text: "3. I don’t have any money.", c: "teal" },
          { text: "4. Do you eat many vegetables?", c: "teal" },
          { text: "5. I don’t eat much bread in the morning.", c: "teal" },
          { text: "6. Do you have a car?", c: "teal" },
          { text: "7. How much bread do you eat a day?", c: "teal" },
          { text: "8. Would you like some appetizers?", c: "purple" },
          { text: "9. Molly always eats an apple after lunch.", c: "purple" },
          { text: "10. Brian doesn’t have many cousins.", c: "purple" },
          { text: "11. Sarah has a lot of time to study.", c: "purple" },
          { text: "12. I visit my grandma many times a week.", c: "purple" },
          { text: "13. We have some minutes before the test.", c: "purple" },
          { text: "14. How many siblings do you have?", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · PRATIQUE" },
        { t: "title", en: "ASK YOUR PARTNER", pt: "REAL QUANTITIES" },
        { t: "image", id: "a38p12", ph: "Foto: casal na cozinha conversando com as compras" },
        { t: "rows", items: [
          { text: "How much water do you drink during the day?", c: "teal" },
          { text: "How many cups of coffee do you drink every day?", c: "purple" },
          { text: "Do you eat many vegetables?", c: "teal" },
          { text: "Do you eat much bread?", c: "purple" },
          { text: "How many bottles of water do you drink a day?", c: "teal" },
          { text: "Do you have a lot of time to study?", c: "purple" } ] },
        { t: "cards", items: [
          { tag: "RESPOSTAS MODELO", c: "navy", v: "gray", lines: ["I drink a lot of water.", "I drink two cups of coffee.", "Yes, I do. / No, I don’t."] } ] },
        { t: "free", id: "a38f3", items: [
          { n: "1", kicker: "SUAS RESPOSTAS", prefix: "How much water do you drink during the day?", ideas: "Responda com a lot of, not much, two bottles…", c: "teal", v: "mint" },
          { n: "2", kicker: "SUAS RESPOSTAS", prefix: "How many cups of coffee do you drink every day?", ideas: "", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 38 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a38c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "usar a lot of / lots of com contáveis e não contáveis",
          "usar many com plurais em negativas e perguntas",
          "usar much com não contáveis em negativas e perguntas",
          "perguntar quantidade com How many…?",
          "perguntar quantidade com How much…?",
          "perguntar preço com How much is…?",
          "corrigir erros comuns de quantidade",
          "falar sobre quantidades da minha rotina" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 38 · A LOT OF / MANY / MUCH", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Missão oral sobre alimentação e rotina usando a lot of, many, much, how many e how much.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "38 DE 42 AULAS", pct: "90%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 39 · Simple Past: Verb to be" } ] }
    ]
  },
  {
    id: 39, code: "AULA 39", title: "Simple Past: Verb to be", sub: "Was, were, wasn’t e weren’t.",
    time: "18 a 22 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 39" },
        { t: "title", en: "SIMPLE PAST: VERB TO BE", pt: "WAS & WERE" },
        { t: "note", v: "mint", bar: true, text: "Usamos was e were para falar de estados e lugares no passado." },
        { t: "image", id: "a39p1", ph: "Foto de abertura da Aula 39 (página 01 não estava na pasta enviada)" },
        { t: "cards", cols: 2, items: [
          { tag: "WAS", c: "teal", v: "mint", lines: ["I · he · she · it"] },
          { tag: "WERE", c: "purple", v: "lilac", lines: ["you · we · they"] } ] },
        { t: "key", v: "gray", text: "I was at home yesterday. They were at work." } ] },

      { blocks: [
        { t: "badge", label: "AULA 39" },
        { t: "title", en: "WAS OR WERE?", pt: "AFFIRMATIVE" },
        { t: "cards", cols: 2, items: [
          { tag: "I · HE · SHE · IT → WAS", c: "teal", v: "mint", lines: ["WAS"] },
          { tag: "YOU · WE · THEY → WERE", c: "purple", v: "lilac", lines: ["WERE"] } ] },
        { t: "cards", cols: 2, items: [
          { tag: "WAS", c: "teal", v: "mint", id: "a39p2a", ph: "Foto: templo japonês com o Monte Fuji", lines: ["I was in Japan two years ago."] },
          { tag: "WAS", c: "teal", v: "mint", id: "a39p2b", ph: "Foto: mulher resfriada no sofá", lines: ["Rafaela was sick yesterday."] },
          { tag: "WERE", c: "purple", v: "lilac", id: "a39p2c", ph: "Foto: Coliseu em Roma", lines: ["They were in Italy last week."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39" },
        { t: "title", en: "YESTERDAY / LAST / AGO", pt: "PAST TIME" },
        { t: "cards", items: [
          { tag: "YESTERDAY", c: "teal", v: "mint", lines: ["yesterday"] },
          { tag: "LAST", c: "purple", v: "lilac", lines: ["last night", "last Sunday", "last week", "last month", "last year"] },
          { tag: "AGO", c: "yellow", v: "cream", lines: ["two days ago", "three months ago", "four years ago"] } ] },
        { t: "image", id: "a39p3", ph: "Foto: ampulheta sobre a mesa" } ] },

      { blocks: [
        { t: "badge", label: "AULA 39" },
        { t: "title", en: "WASN’T / WEREN’T", pt: "NEGATIVE" },
        { t: "cards", cols: 2, items: [
          { tag: "WAS NOT = WASN’T", c: "teal", v: "mint", lines: ["I · he · she · it → wasn’t"] },
          { tag: "WERE NOT = WEREN’T", c: "purple", v: "lilac", lines: ["you · we · they → weren’t"] } ] },
        { t: "cards", cols: 2, items: [
          { tag: "WEREN’T", c: "purple", v: "lilac", id: "a39p4a", ph: "Foto: Muralha da China", lines: ["They weren’t in China last month."] },
          { tag: "WASN’T", c: "teal", v: "mint", id: "a39p4b", ph: "Foto: homem cansado no escritório", lines: ["I wasn’t at work yesterday."] },
          { tag: "WASN’T", c: "purple", v: "lilac", id: "a39p4c", ph: "Foto: filhote de golden retriever", lines: ["My dog wasn’t ugly when it was a puppy. It was cute."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39" },
        { t: "title", en: "WAS…? / WERE…?", pt: "QUESTIONS + SHORT ANSWERS" },
        { t: "cards", cols: 2, items: [
          { tag: "WAS + I / HE / SHE / IT …?", c: "teal", v: "mint" },
          { tag: "WERE + YOU / WE / THEY …?", c: "purple", v: "lilac" } ] },
        { t: "cards", items: [
          { tag: "1 · WERE KATE AND HER DAUGHTER AT HOME LAST NIGHT?", c: "teal", v: "mint", id: "a39p5a", ph: "Foto: mãe e filha lendo no sofá", lines: ["Yes, they were.", "No, they weren’t."] },
          { tag: "2 · WERE THEY AT THE MOVIES LAST SATURDAY EVENING?", c: "purple", v: "lilac", id: "a39p5b", ph: "Foto: plateia no cinema", lines: ["Yes, they were.", "No, they weren’t."] },
          { tag: "3 · WAS THE CLOWN FUNNY?", c: "teal", v: "mint", id: "a39p5c", ph: "Foto: palhaço no parque", lines: ["Yes, he was.", "No, he wasn’t."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39" },
        { t: "title", en: "WHERE? / WHEN?", pt: "PAST QUESTIONS" },
        { t: "cards", items: [
          { tag: "WHERE WERE YOU LAST NIGHT?", c: "teal", v: "mint", id: "a39p6", ph: "Foto: festa de casamento ao ar livre com luzes", lines: ["I was at a wedding party."] },
          { tag: "WHEN WERE YOU BORN?", c: "purple", v: "lilac", lines: ["I was born in 2000."] } ] },
        { t: "note", v: "mint", bar: true, kicker: "BORN", text: "Em I was born…, born faz parte de uma expressão muito comum. A forma passada do verb to be continua sendo was/were." } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · MAPA" },
        { t: "title", en: "THE WAS / WERE MAP", pt: "AFFIRMATIVE · NEGATIVE · QUESTIONS" },
        { t: "cards", cols: 2, items: [
          { tag: "I · HE · SHE · IT → WAS", c: "teal", v: "mint", lines: ["AFFIRMATIVE · was", "NEGATIVE · wasn’t", "QUESTIONS · Was…?"] },
          { tag: "YOU · WE · THEY → WERE", c: "purple", v: "lilac", lines: ["AFFIRMATIVE · were", "NEGATIVE · weren’t", "QUESTIONS · Were…?"] } ] },
        { t: "image", id: "a39p7", ph: "Foto: festa de casamento (imagem de apoio do mapa)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · PRATIQUE" },
        { t: "title", en: "LISTEN AND COMPLETE", pt: "BIRTHDAY CONVERSATION" },
        { t: "image", id: "a39p8", ph: "Foto: casal com bolo de aniversário e presente" },
        { t: "fill", id: "a39e1", title: "COMPLETE O DIÁLOGO (H = HANNAH · T = TYLER)", v: "cream", items: [
          { pre: "T: Hey Hannah. It was your birthday", answers: ["yesterday"], post: ", right?", v: "white" },
          { pre: "T:", answers: ["happy birthday"], post: ".", v: "white" },
          { pre: "T:", answers: ["when were you born"], post: "?", v: "white" },
          { pre: "T:", answers: ["i was born"], post: "in 1994.", v: "white" },
          { pre: "H:", answers: ["why weren't you", "why weren’t you"], post: "at my birthday party yesterday?", v: "white" },
          { pre: "T:", answers: ["i'm really sorry about that", "i’m really sorry about that"], post: ". But yesterday I wasn’t free.", v: "white" },
          { pre: "T:", answers: ["i was at work"], post: "until 9:00 p.m.", v: "white" },
          { pre: "H:", answers: ["no problem"], post: ". That’s ok.", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · GABARITO" },
        { t: "title", en: "CHECK THE DIALOGUE", pt: "H = Hannah · T = Tyler" },
        { t: "image", id: "a39p9", ph: "Foto: casal com bolo de aniversário" },
        { t: "dialogue", items: [
          { s: "a", text: "T: Hey Hannah. It was your birthday yesterday, right?" },
          { s: "b", text: "H: Yes, it was." },
          { s: "a", text: "T: Happy birthday." },
          { s: "b", text: "H: Thanks." },
          { s: "a", text: "T: When were you born?" },
          { s: "b", text: "H: I was born in 1996. What about you?" },
          { s: "a", text: "T: I was born in 1994." },
          { s: "b", text: "H: Can I ask you a question?" },
          { s: "a", text: "T: Sure." },
          { s: "b", text: "H: Why weren’t you at my birthday party yesterday?" },
          { s: "a", text: "T: I’m really sorry about that. But yesterday I wasn’t free. I was at work until 9:00 p.m." },
          { s: "b", text: "H: No problem. That’s ok." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · PRATIQUE" },
        { t: "title", en: "YOUR TURN", pt: "COMPLETE WITH WAS / WERE / WASN’T / WEREN’T" },
        { t: "image", id: "a39p10", ph: "Foto: rapaz estudando e escrevendo no caderno" },
        { t: "fill", id: "a39e2", title: "COMPLETE AS FRASES", v: "cream", items: [
          { pre: "1. The test", answers: ["wasn't", "wasnt", "was not"], post: "difficult. It was easy.", v: "white" },
          { pre: "2. How many people", answers: ["were"], post: "at the party yesterday?", v: "white" },
          { pre: "3. Ten years ago, she", answers: ["was"], post: "a baby.", v: "white" },
          { pre: "4. My parents", answers: ["were"], post: "in France.", v: "white" },
          { pre: "5.", answers: ["were"], post: "the children in the park?", v: "white" },
          { pre: "6. The movie", answers: ["wasn't", "wasnt", "was not"], post: "exciting. It was boring.", v: "white" },
          { pre: "7. The books", answers: ["weren't", "werent", "were not"], post: "on the shelf. They were on the sofa.", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira as respostas." },
        { t: "rows", items: [
          { text: "1. The test wasn’t difficult. It was easy.", c: "teal" },
          { text: "2. How many people were at the party yesterday?", c: "purple" },
          { text: "3. Ten years ago, she was a baby.", c: "teal" },
          { text: "4. My parents were in France.", c: "purple" },
          { text: "5. Were the children in the park?", c: "teal" },
          { text: "6. The movie wasn’t exciting. It was boring.", c: "purple" },
          { text: "7. The books weren’t on the shelf. They were on the sofa.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · PRATIQUE" },
        { t: "title", en: "ASK YOUR PARTNER", pt: "WHERE WERE YOU?" },
        { t: "image", id: "a39p12", ph: "Foto: casal conversando com bolo de aniversário" },
        { t: "rows", items: [
          { text: "Where were you yesterday morning?", c: "teal" },
          { text: "Where were you yesterday afternoon?", c: "purple" },
          { text: "Where were you last night?", c: "teal" },
          { text: "Were you at home last night?", c: "purple" },
          { text: "Were you at work or school yesterday?", c: "teal" },
          { text: "Who was with you?", c: "purple" },
          { text: "When were you born? (Você pode não responder ao ano de nascimento.)", c: "purple" } ] },
        { t: "cards", items: [
          { tag: "RESPOSTAS MODELO", c: "navy", v: "gray", lines: ["I was at home.", "I was at work.", "I was with my family.", "Yes, I was. / No, I wasn’t."] } ] },
        { t: "free", id: "a39f1", items: [
          { n: "1", kicker: "SUA RESPOSTA", prefix: "Where were you last night?", ideas: "Use was / wasn’t.", c: "teal", v: "mint" },
          { n: "2", kicker: "SUA RESPOSTA", prefix: "Who was with you?", ideas: "", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 39 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "image", id: "a39p13", ph: "Foto: casal com bolo de aniversário" },
        { t: "check", id: "a39c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "usar was e were para falar sobre o passado",
          "usar wasn’t e weren’t em frases negativas",
          "fazer perguntas e dar respostas curtas com was e were" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 39 · SIMPLE PAST: VERB TO BE", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Missão oral: falar sobre onde você e outras pessoas estavam ontem, usando was, were, wasn’t, weren’t e perguntas com was/were.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "39 DE 42 AULAS", pct: "93%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 40 · Simple Past: Regular Verbs (Affirmative)" } ] }
    ]
  },
  {
    id: 40, code: "AULA 40", title: "Simple Past: Regular Verbs", sub: "Afirmativas com verbos regulares (-ed).",
    time: "18 a 22 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "SIMPLE PAST: REGULAR VERBS", pt: "AFFIRMATIVE" },
        { t: "image", id: "a40p1", ph: "Foto: mulher olhando o relógio a caminho do trabalho" },
        { t: "cards", items: [
          { tag: "QUANDO USAR", c: "teal", v: "mint", lines: ["We use the Simple Past to talk about actions that started and finished in the past."] },
          { tag: "EXEMPLO", c: "purple", v: "lilac", lines: ["She arrived ten minutes late for work."] } ] },
        { t: "cards", cols: 2, items: [
          { tag: "AULA 39 · WAS / WERE", c: "teal", v: "mint", lines: ["states and locations in the past"] },
          { tag: "AULA 40 · REGULAR VERBS", c: "purple", v: "lilac", lines: ["completed actions in the past"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "PAST TIME EXPRESSIONS", pt: "WHEN DID IT HAPPEN?" },
        { t: "cards", items: [
          { tag: "YESTERDAY", c: "teal", v: "mint", lines: ["yesterday morning", "yesterday afternoon", "yesterday evening"] },
          { tag: "LAST", c: "purple", v: "lilac", lines: ["last night", "last Sunday", "last week", "last month", "last Christmas", "last year"] },
          { tag: "AGO", c: "teal", v: "mint", lines: ["ten minutes ago", "an hour ago", "two days ago", "a week ago", "a month ago", "a year ago"] },
          { tag: "IN", c: "purple", v: "lilac", lines: ["in May", "in 2015", "in 1978"] } ] },
        { t: "image", id: "a40p2", ph: "Foto: pôr do sol no lago com deque de madeira" } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "ONE FORM FOR EVERY SUBJECT", pt: "BASE FORM + -ED" },
        { t: "key", v: "gray", text: "WORK → WORKED" },
        { t: "rows", items: [
          { text: "I worked", c: "teal" }, { text: "You worked", c: "purple" },
          { text: "He / She / It worked", c: "teal" }, { text: "We worked", c: "purple" },
          { text: "They worked", c: "teal" } ] },
        { t: "image", id: "a40p3", ph: "Foto: mulher caminhando na orla da cidade" },
        { t: "cards", items: [
          { tag: "EXEMPLOS", c: "teal", v: "mint", lines: ["Patricia showed a beautiful photo to her family.", "She walked 5 km this morning."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "VERBS ENDING IN -E", pt: "ADD -D" },
        { t: "table", head: ["BASE FORM", "SIMPLE PAST"], rows: [
          { a: "decide", b: "decided", v: "mint" }, { a: "die", b: "died", v: "lilac" },
          { a: "receive", b: "received", v: "mint" }, { a: "like", b: "liked", v: "lilac" } ] },
        { t: "image", id: "a40p4", ph: "Foto: mulher recebendo um buquê de flores" },
        { t: "cards", items: [
          { tag: "EXEMPLOS", c: "teal", v: "mint", lines: ["She received some flowers from her daughter.", "I lived in Brazil when I was a child.", "Ana’s grandma died two years ago."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "CONSONANT + Y", pt: "Y → I + ED" },
        { t: "table", head: ["BASE FORM", "SIMPLE PAST"], rows: [
          { a: "study", b: "studied", v: "mint" }, { a: "try", b: "tried", v: "lilac" },
          { a: "cry", b: "cried", v: "mint" }, { a: "play", b: "played", note: "(vogal + y)", v: "lilac" } ] },
        { t: "image", id: "a40p5", ph: "Foto: mulher chorando ao assistir a um filme triste" },
        { t: "cards", items: [
          { tag: "EXEMPLOS", c: "teal", v: "mint", lines: ["He cried because he watched a sad movie.", "She studied a lot this morning."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "DOUBLE THE LAST CONSONANT", pt: "FINAL STRESSED SYLLABLE" },
        { t: "key", v: "gray", text: "With a final stressed consonant + vowel + consonant pattern, double the last consonant and add -ed." },
        { t: "table", head: ["BASE FORM", "SIMPLE PAST"], rows: [
          { a: "stop", b: "stopped", v: "mint" }, { a: "plan", b: "planned", v: "mint" },
          { a: "prefer", b: "preferred", v: "mint" }, { a: "admit", b: "admitted", v: "mint" },
          { a: "listen", b: "listened", note: "(sílaba final não tônica)", v: "lilac" } ] },
        { t: "image", id: "a40p6", ph: "Foto: mulher correndo na esteira da academia" },
        { t: "cards", items: [
          { tag: "EXEMPLOS", c: "teal", v: "mint", lines: ["The bus stopped at the bus stop.", "He admitted that he was wrong.", "When Mary was a student, she preferred math to history.", "I listened to music this morning."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "THE -ED SOUNDS", pt: "/d/ · /t/ · /ɪd/" },
        { t: "image", id: "a40p7", ph: "Foto: mulher ouvindo música com fones" },
        { t: "cards", items: [
          { tag: "/d/: AFTER A VOICED SOUND, EXCEPT /d/", c: "teal", v: "mint", lines: ["arrived", "listened", "loved", "planned"] },
          { tag: "/t/: AFTER A VOICELESS SOUND, EXCEPT /t/", c: "purple", v: "lilac", lines: ["liked", "stopped", "watched", "washed"] },
          { tag: "/ɪd/: AFTER /d/ OR /t/", c: "navy", v: "gray", lines: ["decided", "hated", "wanted", "started"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40" },
        { t: "title", en: "YESTERDAY", pt: "REGULAR VERBS IN CONTEXT" },
        { t: "key", v: "cream", text: "Yesterday was a busy day." },
        { t: "cards", items: [
          { tag: "MORNING", c: "teal", v: "mint", id: "a40p8a", ph: "Foto: mulher trabalhando no notebook", lines: ["I worked in the morning."] },
          { tag: "AFTERNOON", c: "purple", v: "lilac", id: "a40p8b", ph: "Foto: rapaz estudando com caderno", lines: ["In the afternoon, I studied English and listened to music."] },
          { tag: "EVENING", c: "teal", v: "mint", id: "a40p8c", ph: "Foto: família assistindo a um filme no cinema", lines: ["In the evening, I watched a movie with my family. I liked the movie."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40 · PRATIQUE" },
        { t: "title", en: "YOUR TURN (1)", pt: "PUT THE VERBS IN PARENTHESES INTO THE SIMPLE PAST" },
        { t: "image", id: "a40p9", ph: "Foto: mulher escrevendo no caderno junto à janela" },
        { t: "fill", id: "a40e1", title: "COMPLETE COM O SIMPLE PAST", v: "cream", items: [
          { pre: "1. I", answers: ["visited"], post: "a farm two weeks ago. (visit)", v: "white" },
          { pre: "2. My parents", answers: ["liked"], post: "the movie. (like)", v: "white" },
          { pre: "3. We", answers: ["helped"], post: "our friends. (help)", v: "white" },
          { pre: "4. Jenny and I", answers: ["walked"], post: "around London this morning. (walk)", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40 · PRATIQUE" },
        { t: "title", en: "YOUR TURN (2)", pt: "PUT THE VERBS IN PARENTHESES INTO THE SIMPLE PAST" },
        { t: "fill", id: "a40e2", title: "CONTINUE COMPLETANDO", v: "cream", items: [
          { pre: "5. My sister", answers: ["moved"], post: "to a new house. (move)", v: "white" },
          { pre: "6. Nancy", answers: ["watched"], post: "TV last night. (watch)", v: "white" },
          { pre: "7. The boys", answers: ["studied"], post: "until eight o’clock. (study)", v: "white" } ] },
        { t: "image", id: "a40p10", ph: "Foto: mulher escrevendo no caderno" } ] },

      { blocks: [
        { t: "badge", label: "AULA 40 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira as respostas." },
        { t: "rows", items: [
          { text: "1. I visited a farm two weeks ago.", c: "teal" },
          { text: "2. My parents liked the movie.", c: "purple" },
          { text: "3. We helped our friends.", c: "teal" },
          { text: "4. Jenny and I walked around London this morning.", c: "purple" },
          { text: "5. My sister moved to a new house.", c: "teal" },
          { text: "6. Nancy watched TV last night.", c: "purple" },
          { text: "7. The boys studied until eight o’clock.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40 · PRATIQUE" },
        { t: "title", en: "MY YESTERDAY", pt: "REGULAR PAST IN REAL LIFE" },
        { t: "image", id: "a40p12", ph: "Foto: duas pessoas conversando à mesa com cadernos" },
        { t: "chips", title: "VERBOS PARA USAR", items: [
          { t: "worked", c: "teal" }, { t: "studied", c: "purple" }, { t: "listened", c: "teal" },
          { t: "watched", c: "purple" }, { t: "walked", c: "teal" }, { t: "visited", c: "purple" }, { t: "helped", c: "teal" } ] },
        { t: "free", id: "a40f1", items: [
          { n: "1", kicker: "YESTERDAY MORNING", prefix: "Yesterday morning, I…", ideas: "Ex.: Yesterday morning, I worked.", c: "teal", v: "mint" },
          { n: "2", kicker: "YESTERDAY AFTERNOON", prefix: "Yesterday afternoon, I…", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "LAST NIGHT", prefix: "Last night, I…", ideas: "Ex.: Last night, I watched TV.", c: "teal", v: "mint" },
          { n: "4", kicker: "TWO DAYS AGO", prefix: "Two days ago, I…", ideas: "Ex.: Two days ago, I visited my family.", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 40 · FINAL" },
        { t: "title", en: "TALKING ABOUT THE PAST", pt: "CONVERSATION PRACTICE" },
        { t: "note", v: "gray", bar: true, text: "Responda às perguntas usando o passado com DID. Dê respostas curtas e naturais." },
        { t: "cards", items: [
          { tag: "1 · DID YOU GO TO THE MOVIES YESTERDAY?", c: "teal", v: "mint", lines: ["Yes, I did.", "No, I didn’t."] },
          { tag: "2 · DID YOU STUDY LAST NIGHT?", c: "purple", v: "lilac", lines: ["Yes, I did.", "No, I didn’t."] },
          { tag: "3 · DID THEY VISIT THEIR GRANDPARENTS LAST SUNDAY?", c: "teal", v: "mint", lines: ["Yes, they did.", "No, they didn’t."] },
          { tag: "4 · DID HE CALL YOU YESTERDAY?", c: "purple", v: "lilac", lines: ["Yes, he did.", "No, he didn’t."] },
          { tag: "5 · DID SHE LIKE THE MOVIE?", c: "teal", v: "mint", lines: ["Yes, she did.", "No, she didn’t."] },
          { tag: "6 · DID THEY ARRIVE ON TIME?", c: "purple", v: "lilac", lines: ["Yes, they did.", "No, they didn’t."] } ] },
        { t: "note", v: "cream", bar: true, bold: true, kicker: "REMEMBER!", text: "Use DID (did + base form) para todas as pessoas no passado.\nRespostas curtas com DID deixam a conversa mais natural." },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 40 · SIMPLE PAST: REGULAR VERBS", body: "Assista à videoaula completa desta aula e pratique ainda mais!", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Converse com a IA sobre o tema e pratique seu inglês falando!", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "40 DE 42 AULAS", pct: "95%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 41 · Simple Past: Irregular Verbs (Affirmative)" } ] }
    ]
  },
  {
    id: 41, code: "AULA 41", title: "Simple Past: Irregular Verbs", sub: "Afirmativas com verbos irregulares.",
    time: "18 a 22 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 41" },
        { t: "title", en: "SIMPLE PAST: IRREGULAR VERBS", pt: "AFFIRMATIVE" },
        { t: "image", id: "a41p1", ph: "Foto de abertura: pessoas conversando sobre o fim de semana" },
        { t: "cards", items: [
          { tag: "REGULAR × IRREGULAR", c: "teal", v: "mint", lines: ["Verbos regulares: base form + -ed.", "Verbos irregulares: forma própria no passado."] },
          { tag: "EXEMPLO", c: "purple", v: "lilac", lines: ["go → went", "have → had", "see → saw"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41" },
        { t: "title", en: "IRREGULAR VERBS (1)", pt: "BASE FORM → PAST" },
        { t: "table", head: ["BASE FORM", "SIMPLE PAST"], rows: [
          { a: "become", b: "became", v: "mint" }, { a: "can", b: "could", v: "lilac" },
          { a: "cost", b: "cost", v: "mint" }, { a: "do", b: "did", v: "lilac" },
          { a: "drink", b: "drank", v: "mint" }, { a: "find", b: "found", v: "lilac" },
          { a: "get", b: "got", v: "mint" } ] },
        { t: "cards", items: [
          { tag: "EXEMPLOS", c: "teal", v: "mint", id: "a41p2", ph: "Fotos: mãe com filho, senhor correndo, casal limpando a casa, crianças com suco, casal de noivos",
            lines: ["Suzy became a mother four years ago.", "My uncle could run really fast when he was young.", "It cost only $40.00.", "My wife and I did housework yesterday.", "They drank orange juice for breakfast.", "I found my keys under the boxes.", "They got married two years ago."] } ] },
        { t: "key", v: "lilac", text: "CAN → COULD = PAST ABILITY" } ] },

      { blocks: [
        { t: "badge", label: "AULA 41" },
        { t: "title", en: "IRREGULAR VERBS (2)", pt: "BASE FORM → PAST" },
        { t: "table", head: ["BASE FORM", "SIMPLE PAST"], rows: [
          { a: "go", b: "went", v: "mint" }, { a: "have", b: "had", v: "lilac" },
          { a: "hear", b: "heard", v: "mint" }, { a: "know", b: "knew", v: "lilac" },
          { a: "make", b: "made", v: "mint" }, { a: "meet", b: "met", v: "lilac" },
          { a: "see", b: "saw", v: "mint" } ] },
        { t: "cards", items: [
          { tag: "EXEMPLOS", c: "purple", v: "lilac", id: "a41p3", ph: "Fotos: casal no shopping e plateia no cinema",
            lines: ["They went to the shopping mall together.", "I had a lot of friends when I was a child.", "Their mom heard when they talked to each other.", "She knew very well what she wanted.", "They made lunch together.", "Lisa met her best friend a long time ago.", "They saw a great movie last night."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41" },
        { t: "title", en: "THREE MORE IRREGULAR VERBS", pt: "TAKE · COME · READ" },
        { t: "cards", items: [
          { tag: "TAKE → TOOK", c: "teal", v: "mint", id: "a41p4a", ph: "Foto: homem tomando banho de chuveiro", lines: ["My son took a shower a few minutes ago."] },
          { tag: "COME → CAME", c: "purple", v: "lilac", id: "a41p4b", ph: "Foto: amigos chegando na porta de casa", lines: ["They came to my house last Friday."] },
          { tag: "READ → READ", c: "yellow", v: "cream", id: "a41p4c", ph: "Foto: mulher lendo no sofá", lines: ["She read those books last year."], note: "Past pronunciation: /red/" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41" },
        { t: "title", en: "A BUSY SATURDAY", pt: "IRREGULAR VERBS IN CONTEXT" },
        { t: "image", id: "a41p5", ph: "Fotos: casal no shopping, plateia no cinema e mão com chaves" },
        { t: "key", v: "gray", text: "Last Saturday, Mia and Leo went to the mall. They met a friend and had lunch together. Later, they saw a movie. At home, they made dinner and drank orange juice. Mia found her keys under the sofa, and Leo heard a noise outside." } ] },

      { blocks: [
        { t: "badge", label: "AULA 41 · PRATIQUE" },
        { t: "title", en: "YOUR TURN (1)", pt: "COMPLETE WITH THE SIMPLE PAST" },
        { t: "image", id: "a41p6", ph: "Foto: mulher segurando as chaves de casa" },
        { t: "fill", id: "a41e1", title: "COMPLETE COM O SIMPLE PAST", v: "cream", items: [
          { pre: "1. My son", answers: ["took"], post: "a shower a few minutes ago. (take)", v: "white" },
          { pre: "2. We", answers: ["did"], post: "nothing the whole day. (do)", v: "white" },
          { pre: "3. I", answers: ["went"], post: "to my parents’ house last night. (go)", v: "white" },
          { pre: "4. We", answers: ["saw"], post: "some beautiful rainbows. (see)", v: "white" },
          { pre: "5. She", answers: ["read"], post: "those books last year. (read)", v: "white" },
          { pre: "6. Billy", answers: ["got"], post: "up late this morning. (get)", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41 · PRATIQUE" },
        { t: "title", en: "YOUR TURN (2)", pt: "COMPLETE WITH THE SIMPLE PAST" },
        { t: "image", id: "a41p7", ph: "Foto: mulher com a mão no ouvido, escutando" },
        { t: "fill", id: "a41e2", title: "CONTINUE COMPLETANDO", v: "cream", items: [
          { pre: "7. They", answers: ["came"], post: "to my house last Friday. (come)", v: "white" },
          { pre: "8. Julian", answers: ["became"], post: "a doctor last month. (become)", v: "white" },
          { pre: "9. I", answers: ["could"], post: "swim very well when I was a child. (can)", v: "white" },
          { pre: "10. My niece", answers: ["drank"], post: "a lot of coffee last night. (drink)", v: "white" },
          { pre: "11. I", answers: ["found"], post: "my keys. They were under the sofa. (find)", v: "white" },
          { pre: "12. I", answers: ["heard"], post: "a noise outside. But it was just my dog. (hear)", v: "white" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS (1)", pt: "Confira as respostas." },
        { t: "rows", items: [
          { text: "1. My son took a shower a few minutes ago.", c: "teal" },
          { text: "2. We did nothing the whole day.", c: "purple" },
          { text: "3. I went to my parents’ house last night.", c: "teal" },
          { text: "4. We saw some beautiful rainbows.", c: "purple" },
          { text: "5. She read those books last year. (/red/)", c: "orange" },
          { text: "6. Billy got up late this morning.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS (2)", pt: "Confira as respostas." },
        { t: "rows", items: [
          { text: "7. They came to my house last Friday.", c: "teal" },
          { text: "8. Julian became a doctor last month.", c: "purple" },
          { text: "9. I could swim very well when I was a child.", c: "orange" },
          { text: "10. My niece drank a lot of coffee last night.", c: "teal" },
          { text: "11. I found my keys. They were under the sofa.", c: "purple" },
          { text: "12. I heard a noise outside. But it was just my dog.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41 · PRATIQUE" },
        { t: "title", en: "TELL YOUR STORY", pt: "IRREGULAR PAST IN REAL LIFE" },
        { t: "image", id: "a41p10", ph: "Foto: casal limpando a cozinha juntos" },
        { t: "chips", title: "VERBOS PARA USAR", items: [
          { t: "went", c: "teal" }, { t: "had", c: "purple" }, { t: "saw", c: "teal" }, { t: "made", c: "purple" },
          { t: "drank", c: "teal" }, { t: "met", c: "purple" }, { t: "found", c: "teal" }, { t: "got", c: "purple" },
          { t: "took", c: "teal" }, { t: "came", c: "purple" }, { t: "read", c: "orange" } ] },
        { t: "free", id: "a41f1", items: [
          { n: "1", kicker: "YESTERDAY", prefix: "Yesterday, I…", ideas: "Ex.: Yesterday, I had coffee and went to work.", c: "teal", v: "mint" },
          { n: "2", kicker: "LAST WEEKEND", prefix: "Last weekend, I…", ideas: "Ex.: Last weekend, I saw a movie.", c: "purple", v: "lilac" },
          { n: "3", kicker: "A FEW DAYS AGO", prefix: "A few days ago, I…", ideas: "Ex.: A few days ago, I met a friend.", c: "teal", v: "mint" },
          { n: "4", kicker: "WHEN I WAS A CHILD", prefix: "When I was a child, I could…", ideas: "Ex.: When I was a child, I could swim very well.", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 41 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a41c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "usar formas irregulares frequentes no Simple Past",
          "falar sobre ações concluídas usando verbos irregulares em frases afirmativas",
          "usar could para habilidade no passado e reconhecer read no passado com pronúncia /red/" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 41 · SIMPLE PAST: IRREGULAR VERBS (AFFIRMATIVE)", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Missão oral sobre acontecimentos passados usando formas irregulares trabalhadas na aula.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "41 DE 42 AULAS", pct: "98%" },
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 42 · Unit Review 2" } ] }
    ]
  },
  {
    id: 42, code: "AULA 42", title: "Unit Review 2", sub: "Revisão: restaurante, rotina, lugares, quantidades e passado.",
    time: "20 a 25 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 42 · UNIT REVIEW 2" },
        { t: "title", en: "UNIT REVIEW 2", pt: "RESTAURANT · ROUTINE · PLACES · QUANTITIES · PAST" },
        { t: "image", id: "a42p1", ph: "Foto de abertura da revisão (restaurante, rotina e passeio)" },
        { t: "cards", cols: 2, items: [
          { tag: "RESTAURANT", c: "teal", v: "mint", lines: ["pedir comida e bebida", "pedir a conta"] },
          { tag: "ROUTINE & FREQUENCY", c: "purple", v: "lilac", lines: ["always · usually · sometimes", "every day · twice a week"] },
          { tag: "PLACES", c: "teal", v: "mint", lines: ["near · across from · toward"] },
          { tag: "QUANTITIES", c: "purple", v: "lilac", lines: ["a lot of · many · much", "some · any"] },
          { tag: "PAST", c: "navy", v: "gray", lines: ["was / were", "regular + irregular verbs"] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42" },
        { t: "title", en: "AT THE RESTAURANT", pt: "BEFORE AND AFTER THE MEAL" },
        { t: "lead", text: "Veja como um cliente faz seu pedido e depois, ao final da refeição, pede a conta e realiza o pagamento." },
        { t: "sec", text: "BEFORE THE MEAL" },
        { t: "image", id: "a42p2a", ph: "Foto: garçom anotando o pedido da cliente com o menu" },
        { t: "dialogue", items: [
          { s: "b", text: "W: Good evening. Are you ready to order?" },
          { s: "a", text: "C: Yes, please. I’d like a ham and cheese sandwich, please." },
          { s: "b", text: "W: Is it for here or to go?" },
          { s: "a", text: "C: It’s for here." },
          { s: "b", text: "W: Can I get you anything to drink?" },
          { s: "a", text: "C: Yes, I’d like a bottle of water." },
          { s: "b", text: "W: Sparkling or still?" },
          { s: "a", text: "C: Sparkling." },
          { s: "b", text: "W: Any appetizers?" },
          { s: "a", text: "C: No, thanks. I’m fine." } ] },
        { t: "sec", text: "AFTER THE MEAL", c: "purple" },
        { t: "image", id: "a42p2b", ph: "Foto: cliente pagando a conta com cartão" },
        { t: "dialogue", items: [
          { s: "b", text: "W: How was your sandwich?" },
          { s: "a", text: "C: It was great." },
          { s: "b", text: "W: Can I get you anything else?" },
          { s: "a", text: "C: No, thanks. Could I have the bill, please?" },
          { s: "b", text: "W: Sure. That’s $8.50." },
          { s: "a", text: "C: Here you go. Keep the change." },
          { s: "b", text: "W: Thanks." } ] },
        { t: "cards", items: [
          { tag: "USEFUL EXPRESSIONS", c: "teal", v: "mint", lines: ["I’d like…", "Is it for here or to go?", "Can I get you anything to drink?", "Sparkling or still?", "Any appetizers?", "How was your…?", "Could I have the bill, please?", "Keep the change."] } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42" },
        { t: "title", en: "BRIAN’S WEEKDAY", pt: "READING: DAILY ROUTINE" },
        { t: "image", id: "a42p3", src: "/lessons/fotos/aula_42_pagina_03_foto_01.jpg", alt: "Rapaz surpreso comendo pipoca no cinema", ph: "Foto: rapaz no cinema com pipoca" },
        { t: "key", v: "gray", text: "My name is Brian. I’m 16 years old. On a weekday I usually get up at 6:00 a.m. I take a shower, get dressed, brush my teeth and have breakfast. I don’t drink coffee, but I sometimes drink orange juice for breakfast. I always have a cheese and ham sandwich. After breakfast I go to school. I study near my house at ABC School." },
        { t: "rows", items: [
          { text: "At noon I go back home and have lunch.", c: "teal" },
          { text: "In the afternoon I do my homework and I take a nap at 4:00 p.m.", c: "purple" },
          { text: "In the evening I always have dinner with my parents and after that I go to the gym. I sometimes go out with my best friend Nathaly. I never sleep late. I always go to bed at 10:00, read a little, and then sleep.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "CHECK YOUR READING", pt: "ANSWER THE QUESTIONS" },
        { t: "image", id: "a42p4", src: "/lessons/fotos/aula_42_pagina_03_foto_01.jpg", alt: "Rapaz surpreso comendo pipoca no cinema", ph: "Foto: rapaz no cinema com pipoca" },
        { t: "free", id: "a42f1", items: [
          { n: "1", kicker: "RESPONDA", prefix: "How old is Brian?", ideas: "", c: "teal", v: "mint" },
          { n: "2", kicker: "RESPONDA", prefix: "How often does Brian get up at 6:00 a.m.?", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "RESPONDA", prefix: "Does Brian drink coffee?", ideas: "", c: "teal", v: "mint" },
          { n: "4", kicker: "RESPONDA", prefix: "Where does he go after breakfast?", ideas: "", c: "purple", v: "lilac" },
          { n: "5", kicker: "RESPONDA", prefix: "When does he go to the gym?", ideas: "", c: "teal", v: "mint" },
          { n: "6", kicker: "RESPONDA", prefix: "Who is Nathaly?", ideas: "", c: "purple", v: "lilac" },
          { n: "7", kicker: "RESPONDA", prefix: "What time does he go to bed?", ideas: "", c: "teal", v: "mint" },
          { n: "8", kicker: "RESPONDA", prefix: "What does he do after he goes to bed?", ideas: "", c: "purple", v: "lilac" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · GABARITO" },
        { t: "title", en: "CHECK YOUR ANSWERS", pt: "Confira as respostas da leitura." },
        { t: "rows", items: [
          { text: "1. He’s 16 years old.", c: "teal" },
          { text: "2. Usually.", c: "purple" },
          { text: "3. No, he doesn’t.", c: "teal" },
          { text: "4. He goes to school.", c: "purple" },
          { text: "5. He goes to the gym after dinner.", c: "teal" },
          { text: "6. She’s his best friend.", c: "purple" },
          { text: "7. He goes to bed at 10:00.", c: "teal" },
          { text: "8. He reads.", c: "purple" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "CHOOSE THE BEST OPTION (1)", pt: "Escolha a melhor opção." },
        { t: "mc", id: "a42mc1", title: "PARTE 1", v: "cream", questions: [
          { q: "1. I live ________ the gym.", options: ["next", "near"], answer: 1 },
          { q: "2a. If you take my street ________ the shopping mall…", options: ["tower", "toward"], answer: 1 },
          { q: "2b. …you’ll see it ________ the left after three blocks.", options: ["in", "on"], answer: 1 },
          { q: "3. It’s ________ a big supermarket.", options: ["cross from", "across from"], answer: 1 },
          { q: "4a. I hate ________ to the gym…", options: ["go", "going"], answer: 1 },
          { q: "4b. …________ the afternoon.", options: ["in", "at"], answer: 0 },
          { q: "5. That’s why I ________ in the evening.", options: ["always go", "go always"], answer: 0 },
          { q: "6. Nathaly and I ________ playing the piano last year.", options: ["startied", "started"], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "CHOOSE THE BEST OPTION (2)", pt: "Continue escolhendo." },
        { t: "mc", id: "a42mc2", title: "PARTE 2", v: "cream", questions: [
          { q: "7a. She learns fast and ________ love…", options: ["I", "me"], answer: 0 },
          { q: "7b. …________ to ________ when she plays.", options: ["listen / she", "listening / her"], answer: 1 },
          { q: "8. The piano is not easy for ________.", options: ["I", "me"], answer: 1 },
          { q: "9. I can’t play ________ songs very well.", options: ["many", "much"], answer: 0 },
          { q: "10a. Our teacher told ________ that ________ have to practice…", options: ["we / us", "us / we"], answer: 1 },
          { q: "10b. …at least ________ a week…", options: ["twice", "two time"], answer: 0 },
          { q: "10c. …but I don’t have ________ free ________ to practice.", options: ["many / times", "much / time"], answer: 1 },
          { q: "12. That’s why she can ________ ________ songs pretty well.", options: ["plays / many", "play / a lot of"], answer: 1 } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · GABARITO" },
        { t: "title", en: "CHECK THE TEXT", pt: "THE BEST OPTIONS" },
        { t: "image", id: "a42p8", ph: "Foto: casal com sacolas no shopping" },
        { t: "key", v: "gray", text: "I live near the gym. If you take my street toward the shopping mall, you’ll see it on the left after three blocks. It’s across from a big supermarket. I hate going to the gym in the afternoon. That’s why I always go in the evening. Nathaly and I started playing the piano last year. She learns fast, and I love listening to her when she plays. The piano is not easy for me. I can’t play many songs very well. Our teacher told us that we have to practice at least twice a week, but I don’t have much free time to practice. But Nathaly practices every day. That’s why she can play a lot of songs pretty well." } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "PUT IT IN THE PAST (1)", pt: "CHANGE THE VERBS TO THE SIMPLE PAST" },
        { t: "image", id: "a42p9", ph: "Foto: moça pensativa" },
        { t: "free", id: "a42f2", items: [
          { n: "1", kicker: "REESCREVA NO PASSADO", prefix: "I’m Molly. Yesterday I have a really busy day. I get up at 7:00, take a shower, brush my teeth and have breakfast.", ideas: "", c: "teal", v: "mint" },
          { n: "2", kicker: "REESCREVA NO PASSADO", prefix: "I drink orange juice and have some fruit and cereal. After breakfast I go to school.", ideas: "", c: "purple", v: "lilac" },
          { n: "3", kicker: "REESCREVA NO PASSADO", prefix: "I have math, geography and history classes. At 12:30 I go back home and have lunch.", ideas: "", c: "yellow", v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "PUT IT IN THE PAST (2)", pt: "CHANGE THE VERBS TO THE SIMPLE PAST" },
        { t: "image", id: "a42p10", ph: "Fotos: casal no shopping, cinema e pai e filha cozinhando" },
        { t: "free", id: "a42f3", items: [
          { n: "4", kicker: "REESCREVA NO PASSADO", prefix: "I do a lot of homework after lunch. I work on my homework the whole afternoon. But when I finish it I can play video games.", ideas: "", c: "teal", v: "mint" },
          { n: "5", kicker: "REESCREVA NO PASSADO", prefix: "I play for 2 hours, then I meet a friend at the shopping mall. We see a movie together. After the movie, he come to my home for dinner.", ideas: "", c: "purple", v: "lilac" },
          { n: "6", kicker: "REESCREVA NO PASSADO", prefix: "My mom make some delicious hamburgers. She work in a restaurant some years ago. After that, my friend go home and I read a little. I am really tired, so I go to bed around 10:45 p.m.", ideas: "", c: "yellow", v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · GABARITO" },
        { t: "title", en: "YESTERDAY: ANSWERS 1", pt: "MOLLY’S BUSY DAY" },
        { t: "image", id: "a42p11", ph: "Foto: moça pensativa" },
        { t: "rows", items: [
          { text: "I’m Molly. Yesterday I had a really busy day. I got up at 7:00, took a shower, brushed my teeth and had breakfast.", c: "teal" },
          { text: "I drank orange juice and had some fruit and cereal. After breakfast I went to school.", c: "purple" },
          { text: "I had math, geography and history classes. At 12:30 I went back home and had lunch.", c: "orange" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · GABARITO" },
        { t: "title", en: "YESTERDAY: ANSWERS 2", pt: "MOLLY’S BUSY DAY" },
        { t: "image", id: "a42p12", ph: "Fotos: moça pensativa e plateia no cinema" },
        { t: "rows", items: [
          { text: "I did a lot of homework after lunch. I worked on my homework the whole afternoon. But when I finished it I could play video games.", c: "teal" },
          { text: "I played for 2 hours, then I met a friend at the shopping mall. We saw a movie together. After the movie, he came to my home for dinner.", c: "purple" },
          { text: "My mom made some delicious hamburgers. She worked in a restaurant some years ago. After that, my friend went home and I read a little. I was really tired, so I went to bed around 10:45 p.m.", c: "orange" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "FINAL SPEAKING CHALLENGE", pt: "USE WHAT YOU KNOW" },
        { t: "image", id: "a42p13", ph: "Fotos: pessoa escutando e casal no shopping" },
        { t: "free", id: "a42f4", items: [
          { n: "1", kicker: "ORDER A MEAL AND A DRINK", prefix: "I’d like…", ideas: "", c: "teal", v: "mint" },
          { n: "2", kicker: "ASK FOR THE BILL", prefix: "Could I have the bill, please?", ideas: "Escreva sua versão do pedido.", c: "purple", v: "lilac" },
          { n: "3", kicker: "SAY HOW OFTEN YOU DO ONE ACTIVITY", prefix: "I usually…", ideas: "", c: "purple", v: "lilac" },
          { n: "4", kicker: "SAY WHERE A PLACE IS", prefix: "It’s across from…", ideas: "", c: "teal", v: "mint" },
          { n: "5", kicker: "TALK ABOUT A REAL QUANTITY", prefix: "I drink a lot of…", ideas: "", c: "teal", v: "mint" },
          { n: "6", kicker: "TELL WHAT YOU DID YESTERDAY", prefix: "Yesterday I…", ideas: "", c: "yellow", v: "cream" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · FINAL" },
        { t: "title", en: "EU CONSIGO…", pt: "Marque o que você já consegue fazer em inglês." },
        { t: "check", id: "a42c1", title: "AO FINAL DESTA AULA, EU CONSIGO:", items: [
          "pedir comida e bebida e interagir em uma situação de restaurante",
          "compreender e responder perguntas sobre rotina, frequência e localização",
          "usar quantificadores, preposições, pronomes e estruturas já estudadas",
          "falar e escrever sobre ações no passado usando was/were e verbos regulares e irregulares" ] },
        { t: "cta", items: [
          { icon: "play", v: "mint", title: "VIDEOAULA · AULA 42 · UNIT REVIEW 2", body: "Veja a explicação completa e acompanhe os exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR À VIDEOAULA", c: "navy" },
          { icon: "mic", v: "lilac", title: "PRATIQUE COM A IA", body: "Missão oral final integrando restaurante, rotina, quantidades, localização e passado simples.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "purple" } ] },
        { t: "bar", label: "PROGRESSO", value: "42 DE 42 AULAS", pct: "100%" },
        { t: "key", v: "navy", text: "Você concluiu a trilha completa. Congratulations!" } ] }
    ]
  }
];

export const TRACK = [
  { n: 1, t: "Subject Pronouns" }, { n: 2, t: "Verb to be: Affirmative" }, { n: 3, t: "Verb to be: Negative" },
  { n: 4, t: "Verb to be: Interrogative" }, { n: 5, t: "Verb to be: Review" }, { n: 6, t: "Countries and Nationalities" },
  { n: 7, t: "Family" }, { n: 8, t: "Possessive ’S" }, { n: 9, t: "Possessive Adjectives" },
  { n: 10, t: "The Alphabet" }, { n: 11, t: "School Vocabulary" }, { n: 12, t: "Colors" },
  { n: 13, t: "Articles a / an" }, { n: 14, t: "Plural Nouns" }, { n: 15, t: "Demonstratives" },
  { n: 16, t: "House and Furniture" }, { n: 17, t: "There is / There are" }, { n: 18, t: "Prepositions of Place" },
  { n: 19, t: "Adjectives" }, { n: 20, t: "Numbers" }, { n: 21, t: "What time is it?" },
  { n: 22, t: "Question Words" }, { n: 23, t: "Simple Present: I, You, We, They" }, { n: 24, t: "Jobs" },
  { n: 25, t: "Simple Present: He, She, It" }, { n: 26, t: "Days of the Week" }, { n: 27, t: "Months of the Year" },
  { n: 28, t: "Ordinal Numbers" }, { n: 29, t: "Unit Review" }, { n: 30, t: "Places in a City" },
  { n: 31, t: "Directions" }, { n: 32, t: "Like, Love, Dislike & Hate" }, { n: 33, t: "How Often? Frequency" },
  { n: 34, t: "Can: Abilities" }, { n: 35, t: "Object Pronouns" }, { n: 36, t: "Meals and Restaurant" },
  { n: 37, t: "Count and Noncount Nouns" }, { n: 38, t: "A lot of / Many / Much" }, { n: 39, t: "Simple Past: Verb to be" },
  { n: 40, t: "Simple Past: Regular Verbs" }, { n: 41, t: "Simple Past: Irregular Verbs" }, { n: 42, t: "Unit Review 2" }
];
