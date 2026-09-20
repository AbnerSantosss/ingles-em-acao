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
        { t: "next", kicker: "PRÓXIMA AULA", title: "AULA 08 · Numbers 1-100" },
        { t: "note", v: "lilac", bar: true, bold: true, kicker: "GREAT JOB!", text: "Continue praticando e logo você será cada vez melhor no inglês!" } ] }
    ]
  },

  {
    id: 8, code: "AULA 08", title: "Numbers 1-100", sub: "Contar, dizer idade e preços.",
    time: "15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 08" },
        { t: "title", en: "NUMBERS 1-100", pt: "Os números que você mais usa." },
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
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Escreva forty (40), não fourty." } ] },

      { blocks: [
        { t: "badge", label: "AULA 08", page: "PÁGINA 04" },
        { t: "title", en: "ONDE USAMOS", pt: "Idade, telefone e preço." },
        { t: "grid", cols: 3, items: [
          { kicker: "IDADE", title: "I’m thirty years old.", body: "Eu tenho 30 anos.", v: "mint" },
          { kicker: "TELEFONE", title: "nine, eight, seven…", body: "Número dito dígito a dígito.", v: "lilac" },
          { kicker: "PREÇO", title: "It’s fifteen dollars.", body: "Custa 15 dólares.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "ATENÇÃO À IDADE", text: "Em inglês, você não “tem” anos: você “é”. I am 30 years old." },
        { t: "mc", id: "a8mc1", title: "ESCOLHA A FORMA CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 08", body: "Pronúncia dos números e dos pares difíceis (13 × 30).", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga números aleatórios e confira sua pronúncia.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 09 · Days and Months" } ] }
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
        { t: "match", id: "a9match1", title: "LIGUE O DIA OU MÊS (AULA 09)",
          left: ["Monday", "Wednesday", "Saturday", "January", "July", "December"],
          right: ["dezembro", "janeiro", "julho", "quarta-feira", "sábado", "segunda-feira"],
          answer: [5, 3, 4, 1, 2, 0] },
        { t: "mc", id: "a9mc1", title: "ESCOLHA A PREPOSIÇÃO", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 09", body: "Pronúncia dos dias e meses.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Marque um encontro fictício em inglês.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 10 · Colors and Shapes" } ] }
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
        { t: "mc", id: "a10mc1", title: "ORDEM CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 10", body: "Cores, formas e descrições no dia a dia.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva o que está na sua mesa agora.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 11 · Articles a / an / the" } ] }
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
        { t: "mc", id: "a11mc1", title: "A OU AN?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 11", body: "Exemplos reais de a, an e the.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva objetos usando artigos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 12 · Plural Nouns" } ] }
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
        { t: "objective", v: "red", title: "NÃO ACRESCENTE -S NOS IRREGULARES", text: "Diga children, nunca childrens. Diga people, nunca peoples." } ] },

      { blocks: [
        { t: "badge", label: "AULA 12", page: "PÁGINA 04" },
        { t: "title", en: "LIGUE E ESCOLHA", pt: "Fixe as três regras." },
        { t: "match", id: "a12match1", title: "LIGUE O PLURAL (AULA 12)",
          left: ["city", "box", "child", "man", "book", "life"],
          right: ["books", "boxes", "children", "cities", "lives", "men"],
          answer: [3, 1, 2, 5, 0, 4] },
        { t: "mc", id: "a12mc1", title: "QUAL ESTÁ CORRETO?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 12", body: "Pronúncia dos plurais: /s/, /z/ e /ɪz/.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Fale sobre quantidades usando plurais.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 3 · Referência e lugar", body: "This/That, possessivos, there is/are, preposições e presente simples." } ] }
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
        { t: "mc", id: "a13mc1", title: "ESCOLHA A OPÇÃO CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 13", body: "Exemplos práticos com objetos reais.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva o que está perto e longe de você.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 14 · Possessive Adjectives" } ] }
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
          { a: "I", b: "my: meu / minha", v: "mint" },
          { a: "you", b: "your: seu / sua", v: "lilac" },
          { a: "he", b: "his: dele", v: "cream" },
          { a: "she", b: "her: dela", v: "mint" },
          { a: "it", b: "its: dele/dela (coisa)", v: "lilac" },
          { a: "we", b: "our: nosso / nossa", v: "cream" },
          { a: "they", b: "their: deles / delas", v: "mint" } ] },
        { t: "objective", v: "red", title: "NÃO CONFUNDA", text: "its = posse (its name) · it’s = it is (it’s new)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 14", page: "PÁGINA 03" },
        { t: "title", en: "COMBINA COM O DONO", pt: "O objeto não muda nada." },
        { t: "grid", cols: 2, items: [
          { kicker: "DONO: HOMEM", title: "his car · his sister", body: "Mesmo se o objeto for feminino, use his.", v: "mint", c: "teal" },
          { kicker: "DONA: MULHER", title: "her car · her brother", body: "Mesmo se o objeto for masculino, use her.", v: "lilac", c: "purple" } ] },
        { t: "mc", id: "a14mc1", title: "ESCOLHA O POSSESSIVO", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 14", body: "Possessivos em diálogos curtos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Fale sobre suas coisas e as de sua família.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 15 · There is / There are" } ] }
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
        { t: "mc", id: "a15mc1", title: "IS OU ARE?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 15", body: "Descrevendo ambientes em inglês.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva sua casa em voz alta.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 16 · Prepositions of Place" } ] }
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
        { t: "match", id: "a16match1", title: "LIGUE A PREPOSIÇÃO (AULA 16)",
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
        { t: "mc", id: "a16mc1", title: "ESCOLHA A PREPOSIÇÃO", v: "gray", questions: [
          { q: "Eu estou no Brasil.", options: ["I am in Brazil.", "I am on Brazil."], answer: 0 },
          { q: "A TV está na parede.", options: ["The TV is in the wall.", "The TV is on the wall."], answer: 1 } ] } ] },

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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 16", body: "Preposições com exemplos visuais.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva seu quarto item por item.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 17 · Simple Present: Affirmative" } ] }
    ]
  },

  {
    id: 17, code: "AULA 17", title: "Simple Present: Affirmative", sub: "Rotinas e fatos no presente.",
    time: "16 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 17" },
        { t: "title", en: "SIMPLE PRESENT", pt: "O tempo da rotina e dos fatos." },
        { t: "image", id: "a17p1", ph: "Ilustração: rotina diária (acordar, estudar, trabalhar)" },
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
        { t: "mc", id: "a17mc1", title: "ESCOLHA A FORMA CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 17", body: "A regra do -s explicada com exemplos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Conte sua rotina em voz alta.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 18 · Simple Present: Negative" } ] }
    ]
  },

  {
    id: 18, code: "AULA 18", title: "Simple Present: Negative", sub: "Don’t e doesn’t.",
    time: "15 minutos",
    pages: [
      { blocks: [
        { t: "badge", label: "AULA 18" },
        { t: "title", en: "DON’T / DOESN’T", pt: "Negar rotinas e fatos." },
        { t: "image", id: "a18p1", ph: "Ilustração: pessoa dizendo não com gesto" },
        { t: "note", v: "gray", bar: true, kicker: "A IDEIA-CHAVE", bold: true, text: "Aqui o auxiliar do / does entra em cena,\ne o verbo principal volta à forma básica." },
        { t: "objective", v: "navy", title: "OBJETIVO DA AULA", text: "Formar frases negativas no presente simples." },
        { t: "meta", label: "TEMPO ESTIMADO", value: "15 min" } ] },

      { blocks: [
        { t: "badge", label: "AULA 18", page: "PÁGINA 02" },
        { t: "title", en: "A REGRA", pt: "O -s passa para o auxiliar." },
        { t: "rule", v: "mint", c: "teal", kicker: "I · YOU · WE · THEY", from: "do not", to: "don’t + verbo", ex: "I don’t work on Sunday.", tr: "Eu não trabalho no domingo." },
        { t: "rule", v: "lilac", c: "purple", kicker: "HE · SHE · IT", from: "does not", to: "doesn’t + verbo", ex: "She doesn’t work here.", tr: "Ela não trabalha aqui." },
        { t: "objective", v: "red", title: "ERRO CLÁSSICO", text: "Depois de doesn’t, o verbo perde o -s. Diga: She doesn’t work. Nunca: She doesn’t works." },
        { t: "compare", items: [
          { wrong: "He doesn’t works here.", note: "O -s já está em doesn’t.", right: "He doesn’t work here.", rnote: "Ele não trabalha aqui." },
          { wrong: "I no like coffee.", right: "I don’t like coffee." } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 18", page: "PÁGINA 03" },
        { t: "title", en: "VERB TO BE × OUTROS VERBOS", pt: "Não misture as duas negativas." },
        { t: "grid", cols: 2, items: [
          { kicker: "COM VERB TO BE", title: "She isn’t a doctor.", body: "Use not, sem do/does.", v: "mint", c: "teal" },
          { kicker: "COM OUTROS VERBOS", title: "She doesn’t work here.", body: "Use doesn’t + verbo.", v: "lilac", c: "purple" } ] },
        { t: "mc", id: "a18mc1", title: "QUAL É A CORRETA?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 18", body: "Negativas do presente simples na prática.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga cinco coisas que você não faz.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 4 · Presente simples", body: "Perguntas, frequência, rotina, horas, comida e o verbo can." } ] }
    ]
  }
  ,{
    id: 19, code: "AULA 19", title: "Simple Present: Questions", sub: "Perguntas com do e does.",
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
        { t: "objective", v: "red", title: "ATENÇÃO", text: "Depois de does, o verbo não leva -s: Does she work? Nunca: Does she works?" } ] },

      { blocks: [
        { t: "badge", label: "AULA 19", page: "PÁGINA 03" },
        { t: "title", en: "RESPOSTAS CURTAS", pt: "Repita o auxiliar." },
        { t: "table", head: ["PERGUNTA", "RESPOSTA CURTA"], rows: [
          { a: "Do you like coffee?", b: "Yes, I do. / No, I don’t.", v: "mint" },
          { a: "Does he work here?", b: "Yes, he does. / No, he doesn’t.", v: "lilac" },
          { a: "Do they study English?", b: "Yes, they do. / No, they don’t.", v: "cream" },
          { a: "Does she speak French?", b: "Yes, she does. / No, she doesn’t.", v: "mint" } ] },
        { t: "match", id: "a19match1", title: "LIGUE PERGUNTA E RESPOSTA (AULA 19)",
          left: ["Do you like music?", "Does he play soccer?", "Do they work here?", "Does she speak English?"],
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 19", body: "Perguntas do dia a dia com do e does.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Entreviste a IA com cinco perguntas.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 20 · Adverbs of Frequency" } ] }
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
          { a: "always", b: "100%: sempre", v: "mint" },
          { a: "usually", b: "80%: geralmente", v: "lilac" },
          { a: "often", b: "60%: frequentemente", v: "cream" },
          { a: "sometimes", b: "40%: às vezes", v: "mint" },
          { a: "rarely / seldom", b: "10%: raramente", v: "lilac" },
          { a: "never", b: "0%: nunca", v: "cream" } ] },
        { t: "note", v: "gray", bold: true, text: "never já é negativo: diga I never drink coffee. (não: I don’t never…)" } ] },

      { blocks: [
        { t: "badge", label: "AULA 20", page: "PÁGINA 03" },
        { t: "title", en: "ONDE COLOCAR", pt: "Antes do verbo, mas depois do verb to be." },
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
        { t: "mc", id: "a20mc1", title: "ONDE ENTRA O ADVÉRBIO?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 20", body: "Frequência na fala natural.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Conte seus hábitos da semana.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 21 · Daily Routine" } ] }
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 21", body: "Uma rotina completa narrada em inglês.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Conte sua rotina do começo ao fim do dia.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 22 · Telling the Time" } ] }
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
          { kicker: "MANHÃ", title: "in the morning", body: "das 6 a.m. às 12 p.m.", v: "mint" },
          { kicker: "TARDE", title: "in the afternoon", body: "das 12 p.m. às 6 p.m.", v: "lilac" },
          { kicker: "NOITE", title: "at night", body: "depois das 9 p.m.", v: "cream" } ] },
        { t: "objective", v: "navy", title: "PREPOSIÇÃO DE HORÁRIO", text: "Use at com hora exata: The class is at 7 p.m." },
        { t: "mc", id: "a22mc1", title: "ESCOLHA A OPÇÃO CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 22", body: "Horas na prática, com relógios reais.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Marque um horário com a IA.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 23 · Food and Drinks" } ] }
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
        { t: "match", id: "a23match1", title: "LIGUE A REFEIÇÃO (AULA 23)",
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 23", body: "Um diálogo completo em um café.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça um pedido em um restaurante fictício.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 24 · Can / Can’t" } ] }
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 24", body: "Can no dia a dia: pedidos e permissões.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Diga cinco coisas que você sabe fazer.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 5 · Ações e rotina", body: "Imperativo, presente contínuo, roupas, clima e profissões." } ] }
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
        { t: "mc", id: "a25mc1", title: "ESCOLHA A FORMA CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 25", body: "Instruções em situações reais.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Dê instruções para uma receita simples.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 26 · Present Continuous" } ] }
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
        { t: "objective", v: "red", title: "NÃO ESQUEÇA O VERB TO BE", text: "Diga: She is working. Nunca: She working." } ] },

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
        { t: "mc", id: "a26mc1", title: "QUAL É A CORRETA?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 26", body: "Descrevendo cenas em tempo real.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Narre o que você está fazendo agora.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 27 · Present Continuous: Questions" } ] }
    ]
  },

  {
    id: 27, code: "AULA 27", title: "Present Continuous: Questions", sub: "Perguntar o que está acontecendo.",
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
        { t: "match", id: "a27match1", title: "LIGUE PERGUNTA E RESPOSTA (AULA 27)",
          left: ["Are you studying?", "Is he working?", "Are they playing?", "Is it raining?"],
          right: ["No, it isn’t.", "Yes, I am.", "Yes, they are.", "No, he isn’t."],
          answer: [1, 3, 2, 0] },
        { t: "mc", id: "a27mc1", title: "QUAL É A CORRETA?", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 27", body: "Diálogos em tempo real.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Pergunte à IA o que ela está fazendo.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 28 · Clothes" } ] }
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
        { t: "title", en: "COMO DESCREVER", pt: "wear e be wearing." },
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
        { t: "mc", id: "a28mc1", title: "ESCOLHA A FRASE CORRETA", v: "gray", questions: [
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 28", body: "Roupas e compras em inglês.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Descreva sua roupa de hoje.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 29 · Weather" } ] }
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
        { t: "match", id: "a29match1", title: "LIGUE A ESTAÇÃO (AULA 29)",
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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 29", body: "Previsão do tempo em inglês.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Faça uma previsão do tempo de 30 segundos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMA AULA", title: "Aula 30 · Jobs" } ] }
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
        { t: "objective", v: "red", title: "ERRO COMUM", text: "Diga: I’m a doctor. Não: I’m doctor." } ] },

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
          { icon: "play", v: "teal", title: "ASSISTA À VIDEOAULA 30", body: "Apresentações profissionais em inglês.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "ASSISTIR", c: "white" },
          { icon: "mic", v: "purple", title: "PRATIQUE COM A IA", body: "Apresente-se profissionalmente em 30 segundos.", plan: "EXCLUSIVO DO WSA PREMIUM", btn: "INICIAR PRÁTICA ORAL", c: "yellow" } ] },
        { t: "next", kicker: "PRÓXIMO MÓDULO", title: "Módulo 6 · Dia a dia e preferências", body: "Direções, preferências, frequência, can, pronomes objeto e restaurante." } ] }
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
          { tag: "LOVE · BOOKS", c: "purple", v: "lilac", id: "a32p1a", ph: "Foto: homem abraçando uma pilha de livros", lines: ["He loves books."] },
          { tag: "LIKE · ANIMALS", c: "blue", v: "blue", id: "a32p1b", ph: "Foto: mulher abraçando um cachorro; cão e gato ao lado", lines: ["He likes animals."] },
          { tag: "DISLIKE · COFFEE", c: "orange", v: "cream", id: "a32p1c", ph: "Foto: mulher com cara de desagrado segurando caneca; xícara de café", lines: ["She dislikes coffee."] },
          { tag: "HATE · ONIONS", c: "red", v: "red", id: "a32p1d", ph: "Foto: homem recusando com a mão; cebolas ao lado", lines: ["He hates onions."] } ] },
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
        { t: "image", id: "a36p4", ph: "Foto: almoço completo (arroz, feijão, carne, salada, batata frita, macarrão)" },
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
        { t: "image", id: "a42p3", ph: "Foto: rapaz no cinema com pipoca" },
        { t: "key", v: "gray", text: "My name is Brian. I’m 16 years old. On a weekday I usually get up at 6:00 a.m. I take a shower, get dressed, brush my teeth and have breakfast. I don’t drink coffee, but I sometimes drink orange juice for breakfast. I always have a cheese and ham sandwich. After breakfast I go to school. I study near my house at ABC School." },
        { t: "rows", items: [
          { text: "At noon I go back home and have lunch.", c: "teal" },
          { text: "In the afternoon I do my homework and I take a nap at 4:00 p.m.", c: "purple" },
          { text: "In the evening I always have dinner with my parents and after that I go to the gym. I sometimes go out with my best friend Nathaly. I never sleep late. I always go to bed at 10:00, read a little, and then sleep.", c: "teal" } ] } ] },

      { blocks: [
        { t: "badge", label: "AULA 42 · PRATIQUE" },
        { t: "title", en: "CHECK YOUR READING", pt: "ANSWER THE QUESTIONS" },
        { t: "image", id: "a42p4", ph: "Foto: rapaz no cinema com pipoca" },
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
  { n: 7, t: "Family" }, { n: 8, t: "Numbers 1-100" }, { n: 9, t: "Days and Months" }, { n: 10, t: "Colors and Shapes" },
  { n: 11, t: "Articles a / an / the" }, { n: 12, t: "Plural Nouns" }, { n: 13, t: "This / That / These / Those" },
  { n: 14, t: "Possessive Adjectives" }, { n: 15, t: "There is / There are" }, { n: 16, t: "Prepositions of Place" },
  { n: 17, t: "Simple Present: Affirmative" }, { n: 18, t: "Simple Present: Negative" }, { n: 19, t: "Simple Present: Questions" },
  { n: 20, t: "Adverbs of Frequency" }, { n: 21, t: "Daily Routine" }, { n: 22, t: "Telling the Time" },
  { n: 23, t: "Food and Drinks" }, { n: 24, t: "Can / Can’t" }, { n: 25, t: "Imperatives" }, { n: 26, t: "Present Continuous" },
  { n: 27, t: "Present Continuous: Questions" }, { n: 28, t: "Clothes" }, { n: 29, t: "Weather" }, { n: 30, t: "Jobs" },
  { n: 31, t: "Directions" }, { n: 32, t: "Like, Love, Dislike & Hate" }, { n: 33, t: "How Often? Frequency" },
  { n: 34, t: "Can: Abilities" }, { n: 35, t: "Object Pronouns" }, { n: 36, t: "Meals and Restaurant" },
  { n: 37, t: "Count and Noncount Nouns" }, { n: 38, t: "A lot of / Many / Much" }, { n: 39, t: "Simple Past: Verb to be" }, { n: 40, t: "Simple Past: Regular Verbs" },
  { n: 41, t: "Simple Past: Irregular Verbs" }, { n: 42, t: "Unit Review 2" }
];
