// Lote 2 de aprofundamento: temas de alta procura (ver conteudo/temas-mercado.md).
// Conteúdo sujeito a validação da advogada responsável.

const P = "https://www.planalto.gov.br/ccivil_03/";

/* ===== PREVIDENCIÁRIO ===== */
const IR_DOENCA_FU = {
  title: "Vamos ver se você tem direito à isenção e à restituição?",
  intro: "4 perguntas. Calculamos até quando dá para pedir a devolução do imposto.",
  questions: [
    { id: "renda", q: "Que renda você recebe?", a: ["Aposentadoria", "Pensão", "Reforma militar", "Salário (ainda trabalho)"] },
    { id: "doenca", q: "A doença está na lista da lei (câncer, cardiopatia grave, Parkinson, cegueira, esclerose múltipla, etc.)?", a: ["Sim", "Não sei"] },
    { id: "diag", q: "Quando a doença foi diagnosticada?", input: "date" },
    { id: "laudo", q: "Você tem laudo médico com CID e data do diagnóstico?", a: ["Sim", "Não"] },
  ],
  evaluate(a) {
    const items = [];
    if (a.renda === "Salário (ainda trabalho)") {
      return { headline: "A isenção não alcança salário: vale só para aposentadoria, pensão e reforma.", tone: "info", lawyer: false,
        items: ["Quando você se aposentar, a isenção passa a valer para os proventos.", "Se também recebe aposentadoria ou pensão, ela pode ser isenta mesmo que você continue trabalhando."], summary: "IR doença grave: recebe salário (não se aplica)." };
    }
    let headline = "Você pode ter direito à isenção do Imposto de Renda.";
    if (a.diag) {
      const limite = new Date(); limite.setFullYear(limite.getFullYear() - 5);
      const desde = a.diag > limite ? a.diag : limite;
      headline = `Você pode pedir a isenção e a devolução do imposto retido desde ${desde.toLocaleDateString("pt-BR")}.`;
      items.push(a.diag > limite ? "A restituição alcança todo o período desde o diagnóstico." : "A restituição alcança os últimos 5 anos. Períodos mais antigos prescreveram.");
    }
    if (a.doenca === "Não sei") items.push("A lista é fechada (art. 6º, XIV, da Lei 7.713/1988). Confira se o diagnóstico se enquadra: muitas condições entram como cardiopatia, nefropatia ou hepatopatia grave.");
    items.push("Peça a isenção à fonte pagadora (INSS: pelo Meu INSS, serviço “Isenção de Imposto de Renda”), com laudo médico.");
    items.push("A devolução do que já foi retido é pedida na declaração retificadora de IR de cada ano ou na Justiça.");
    items.push("O STJ entende que não é preciso que os sintomas continuem ativos (Súmula 627) e que o laudo não precisa ser de serviço oficial se houver outras provas (Súmula 598).");
    if (a.laudo === "Não") items.push("Providencie o laudo com CID e data do diagnóstico: ele define desde quando vale a isenção.");
    return { headline, tone: "good", items, lawyer: true, summary: `IR doença grave: renda ${a.renda}; diagnóstico ${a.diag ? a.diag.toLocaleDateString("pt-BR") : "?"}; laudo ${a.laudo}.` };
  },
};

FAQ.push(
  { id: "salario-maternidade", area: "previdenciario", all: [["maternidade", "gestante", "grávida", "gravida", "licença-maternidade", "licenca maternidade", "adoção", "adocao"]],
    q: "Quem tem direito ao salário-maternidade?",
    a: ["Têm direito as seguradas do INSS que têm filho ou adotam: empregadas, domésticas, contribuintes individuais e MEI, facultativas, seguradas especiais (rurais) e desempregadas que ainda mantêm a qualidade de segurada.",
      "O benefício dura 120 dias. A empregada recebe pela empresa; as demais pedem direto no Meu INSS ou pelo 135.",
      "Desempregada pode ter direito se o parto ocorreu dentro do período de graça (em geral, até 12 meses após a última contribuição, podendo chegar a 24 ou 36).",
      "O pedido pode ser feito até 5 anos depois do parto."],
    tips: ["Desde 2024, o STF afastou a exigência de carência para contribuintes individuais, facultativas e seguradas especiais. [VALIDAR]", "Pai ou companheiro(a) pode receber em caso de morte da mãe ou em adoção."],
    sources: [["Lei 8.213/1991, arts. 71 a 73", P + "leis/l8213cons.htm"]], next: "Quer verificar o seu caso?" },
  { id: "ir-doenca-grave", area: "previdenciario", all: [["imposto de renda", "ir ", "isenção", "isencao", "irpf"], ["doença", "doenca", "câncer", "cancer", "grave", "cardiopatia", "parkinson", "aposentad"]],
    q: "Aposentado com doença grave tem isenção de Imposto de Renda?",
    a: ["Sim. Aposentadoria, pensão e reforma de quem tem doença grave da lista legal são isentas de IR. A lista inclui câncer (neoplasia maligna), cardiopatia grave, Parkinson, esclerose múltipla, cegueira (inclusive de um olho), alienação mental, nefropatia e hepatopatia graves, AIDS, tuberculose ativa, hanseníase e outras.",
      "A isenção vale desde o diagnóstico, e é possível pedir de volta o imposto retido nos últimos 5 anos.",
      "Não é preciso que a doença esteja ativa: quem teve câncer e está em remissão mantém a isenção (STJ, Súmula 627)."],
    sources: [["Lei 7.713/1988, art. 6º, XIV", P + "leis/l7713.htm"], ["STJ — Súmulas 598 e 627", "https://scon.stj.jus.br/SCON/sumstj/"]], next: "Vamos calcular sua restituição?", followUp: IR_DOENCA_FU },
  { id: "descontos-beneficio", area: "previdenciario", all: [["desconto", "descontando", "mensalidade", "associação", "associacao", "sindicato", "contribuição associativa"], ["benefício", "beneficio", "aposentadoria", "inss", "pensão", "pensao"]],
    q: "Estão descontando valores da minha aposentadoria sem autorização. O que fazer?",
    a: ["Confira o extrato de pagamento no Meu INSS (“Extrato de pagamento de benefício”): ele mostra cada desconto e quem recebe.",
      "Descontos de associações ou sindicatos exigem autorização sua. Sem ela, peça a exclusão e a devolução pelo Meu INSS ou pelo 135, e registre reclamação na Ouvidoria.",
      "Empréstimo consignado que você não contratou deve ser contestado no banco e no INSS. Peça também o bloqueio do benefício para novos consignados, no próprio Meu INSS.",
      "Valores descontados indevidamente podem ser devolvidos, e em alguns casos em dobro, com indenização."],
    sources: [["Meu INSS", "https://meu.inss.gov.br"], ["CDC, art. 42", P + "leis/l8078compilado.htm"]], next: "Quer ajuda para reaver os valores?" },
  { id: "pericia-inss", area: "previdenciario", all: [["perícia", "pericia", "perito"]],
    q: "Como me preparar para a perícia do INSS?",
    a: ["Leve documento com foto e todos os documentos médicos, em ordem: laudos recentes (com CID, limitações e tempo estimado de afastamento), exames, receitas e relatórios de internação.",
      "O laudo mais útil descreve o que você não consegue fazer no seu trabalho específico, e não só o diagnóstico.",
      "Explique sua atividade com detalhes: esforço físico, postura, jornada. A perícia avalia a incapacidade para o seu trabalho.",
      "Se não puder comparecer por motivo de saúde, remarque pelo Meu INSS ou pelo 135 antes da data. Faltar sem justificativa leva ao indeferimento."],
    sources: [["Lei 8.213/1991, arts. 59 a 63", P + "leis/l8213cons.htm"]], next: "A perícia negou seu benefício?" },
  { id: "servidor-aposentadoria", area: "previdenciario", all: [["servidor", "rpps", "regime próprio", "regime proprio", "abono de permanência", "abono de permanencia"], ["aposent", "abono", "pensão", "pensao"]],
    q: "Como funciona a aposentadoria do servidor público?",
    a: ["O servidor efetivo se aposenta pelo regime próprio (RPPS) do seu ente: União, estado ou município. Cada ente pode ter regras próprias após a Reforma de 2019.",
      "Na União, a regra geral é 62 anos (mulher) ou 65 anos (homem), com 25 anos de contribuição, 10 anos no serviço público e 5 no cargo. Há regras de transição para quem ingressou antes, inclusive com integralidade e paridade para os mais antigos.",
      "Quem já cumpre os requisitos e continua trabalhando pode receber o abono de permanência (devolução da contribuição previdenciária).",
      "Tempo trabalhado no setor privado pode ser somado com a Certidão de Tempo de Contribuição (CTC) do INSS."],
    sources: [["EC 103/2019, arts. 4º, 10 e 20", P + "constituicao/emendas/emc/emc103.htm"]], next: "Quer analisar sua regra de aposentadoria como servidor?" },
);

/* ===== CONSUMIDOR ===== */
const BUSCA_APREENSAO_FU = {
  title: "Vamos calcular seus prazos?",
  intro: "Informe a data em que o veículo foi apreendido (ou em que você foi citado).",
  questions: [
    { id: "data", q: "Quando o veículo foi apreendido?", input: "date" },
    { id: "parcelas", q: "Quantas parcelas estão em atraso?", a: ["1 ou 2", "3 a 6", "Mais de 6"] },
    { id: "notif", q: "Você recebeu notificação de atraso antes da ação?", a: ["Sim", "Não", "Não sei"] },
  ],
  evaluate(a) {
    const items = [];
    let headline = "Veja os prazos e as defesas possíveis.", tone = "near";
    if (a.data) {
      const purga = deadlineText(addDays(a.data, 5));
      const defesa = deadlineText(addDays(a.data, 15));
      headline = `Para pagar a dívida e recuperar o veículo: ${purga.text}`;
      tone = purga.tone;
      items.push(`Defesa (contestação): ${defesa.text}`);
    }
    items.push("Para reaver o veículo, o STJ exige o pagamento de toda a dívida em aberto (parcelas vencidas e vincendas), não só das atrasadas.");
    if (a.notif !== "Sim") items.push("Sem notificação válida de atraso (mora), a ação pode ser extinta. Verifique o comprovante juntado pelo banco.");
    items.push("Juros e encargos abusivos no contrato podem ser discutidos na defesa.");
    return { headline, tone, items, lawyer: true, summary: `Busca e apreensão: apreensão ${a.data ? a.data.toLocaleDateString("pt-BR") : "?"}; atraso ${a.parcelas}; notificação ${a.notif}.` };
  },
};

FAQ.push(
  { id: "consignado-nao-contratado", area: "consumidor", all: [["consignado", "rmc", "rcc", "cartão consignado", "cartao consignado", "empréstimo", "emprestimo"], ["não fiz", "nao fiz", "não contratei", "nao contratei", "sem autoriza", "não reconheço", "nao reconheco", "fraude", "indevid"]],
    q: "Apareceu um empréstimo consignado que eu não contratei. O que fazer?",
    a: ["Peça ao banco cópia do contrato e do comprovante de depósito. Se não houver contrato assinado por você, o desconto é indevido.",
      "Registre reclamação no banco, no consumidor.gov.br e no INSS (se for aposentado ou pensionista). No Meu INSS, peça o bloqueio do benefício para novos empréstimos.",
      "Os valores descontados podem ser devolvidos, em dobro quando não há engano justificável, e costuma caber indenização.",
      "Atenção ao cartão consignado (RMC/RCC): muitas pessoas pensam que contrataram empréstimo comum e recebem um cartão com desconto mínimo que nunca quita a dívida."],
    sources: [["CDC, arts. 6º, 39 e 42", P + "leis/l8078compilado.htm"], ["consumidor.gov.br", "https://www.consumidor.gov.br"], ["STJ — Súmula 479", "https://scon.stj.jus.br/SCON/sumstj/"]], next: "Quer ajuda para cancelar e reaver os valores?" },
  { id: "superendividamento", area: "consumidor", all: [["superendivid", "endividad", "muitas dívidas", "muitas dividas", "não consigo pagar", "nao consigo pagar", "renegoci", "repactua"]],
    q: "Estou superendividado(a). O que a lei permite?",
    a: ["A Lei do Superendividamento (Lei 14.181/2021) permite reunir as dívidas de consumo em um plano de pagamento de até 5 anos, preservando o mínimo existencial (parte da renda para despesas básicas).",
      "O pedido pode ser feito no Judiciário (audiência de conciliação com todos os credores) ou em órgãos como Procon e Defensoria, que fazem a repactuação extrajudicial.",
      "Ficam de fora dívidas de financiamento imobiliário com garantia, crédito rural, impostos e pensão alimentícia.",
      "Se um credor não comparecer à audiência sem justificativa, a cobrança dele fica suspensa e ele entra no plano no fim da fila."],
    sources: [["Lei 14.181/2021", P + "_ato2019-2022/2021/lei/l14181.htm"], ["CDC, arts. 104-A a 104-C", P + "leis/l8078compilado.htm"]], next: "Quer organizar suas dívidas em um plano?" },
  { id: "busca-apreensao", area: "consumidor", all: [["busca e apreensão", "busca e apreensao", "apreenderam", "tomaram meu carro", "guincharam", "apreensão do veículo", "apreensão do carro"]],
    q: "O banco pediu busca e apreensão do meu carro. E agora?",
    a: ["No financiamento com alienação fiduciária, o atraso permite ao banco pedir a apreensão do veículo, desde que tenha notificado você do atraso antes.",
      "Depois da apreensão, você tem 5 dias para pagar a dívida e recuperar o veículo. Segundo o STJ, é preciso pagar o total em aberto, e não só as parcelas atrasadas. O prazo de defesa é de 15 dias.",
      "Na defesa é possível discutir falta de notificação válida, juros e encargos abusivos e o valor cobrado."],
    sources: [["Decreto-Lei 911/1969, art. 3º", P + "decreto-lei/del0911.htm"]], next: "Vamos calcular seus prazos?", followUp: BUSCA_APREENSAO_FU },
  { id: "telefonia", area: "consumidor", all: [["operadora", "telefonia", "internet", "celular", "vivo", "claro", "tim", "oi "], ["cancel", "cobran", "multa", "fidelidade", "velocidade", "sem sinal"]],
    q: "Quais meus direitos com operadora de telefone ou internet?",
    a: ["Você pode cancelar a qualquer momento, por telefone, internet ou loja, e o cancelamento deve ser imediato, sem precisar falar com atendente.",
      "Multa de fidelidade só vale se você recebeu um benefício em troca (desconto, aparelho), e deve ser proporcional ao tempo que falta.",
      "Cobrança indevida deve ser contestada: a operadora tem prazo para responder e, se você pagou, devolve em dobro.",
      "Reclame na operadora (anote o protocolo), depois na Anatel (1331 ou site) ou no consumidor.gov.br."],
    sources: [["Anatel — Regulamento de Direitos do Consumidor", "https://www.gov.br/anatel/pt-br/consumidor"], ["CDC, art. 42", P + "leis/l8078compilado.htm"]], next: "A operadora não resolveu?" },
  { id: "seguro-negado", area: "consumidor", all: [["seguro", "seguradora", "sinistro", "indenização do seguro"], ["neg", "recus", "não pagou", "nao pagou", "não paga", "nao paga"]],
    q: "A seguradora negou o pagamento. O que fazer?",
    a: ["Peça a negativa por escrito, com o motivo e a cláusula do contrato usada. Peça também cópia da apólice e das condições gerais.",
      "Negativas comuns: doença preexistente (só vale se a seguradora exigiu exames ou provar má-fé), suicídio nos 2 primeiros anos (seguro de vida), agravamento do risco e falta de pagamento.",
      "Atenção ao prazo: o segurado tem, em regra, 1 ano para cobrar a seguradora, contado da ciência da negativa. Para beneficiários de seguro de vida, o prazo é maior. [VALIDAR]",
      "Reclame na Susep e no consumidor.gov.br antes de ir à Justiça."],
    sources: [["Código Civil, arts. 757 a 802 e 206, §1º, II", P + "leis/2002/l10406compilada.htm"], ["Susep", "https://www.gov.br/susep"]], next: "Quer analisar a negativa?" },
  { id: "compra-nao-entregue", area: "consumidor", all: [["não entreg", "nao entreg", "não chegou", "nao chegou", "atraso na entrega", "site falso", "loja virtual"]],
    q: "Comprei pela internet e não recebi. O que fazer?",
    a: ["Se a loja não cumprir a entrega, você escolhe: exigir a entrega, aceitar outro produto equivalente ou cancelar e receber todo o dinheiro de volta, com correção.",
      "Pagou com cartão de crédito? Peça o estorno (chargeback) à administradora do cartão, com os prints da compra e das tentativas de contato.",
      "Comprou em marketplace? A plataforma responde junto com o vendedor.",
      "Suspeita de site falso: registre boletim de ocorrência e avise o banco imediatamente."],
    sources: [["CDC, arts. 7º, 18 e 35", P + "leis/l8078compilado.htm"], ["consumidor.gov.br", "https://www.consumidor.gov.br"]], next: "A loja não devolveu o dinheiro?" },
  { id: "corte-luz-agua", area: "consumidor", all: [["corte", "cortaram", "cortar", "suspens"], ["luz", "energia", "água", "agua", "saneamento"]],
    q: "A concessionária pode cortar minha luz ou água?",
    a: ["Pode cortar por falta de pagamento de conta atual, mas só depois de aviso prévio por escrito.",
      "Dívidas antigas não justificam corte: devem ser cobradas pelos meios normais, segundo o STJ.",
      "Não pode cortar por dívida de morador anterior, nem por valor apurado unilateralmente em suposta fraude no medidor sem direito de defesa.",
      "Corte indevido gera religação imediata e pode gerar indenização. Reclame na concessionária, depois na agência reguladora (Aneel para energia)."],
    sources: [["Lei 8.987/1995, art. 6º, §3º", P + "leis/l8987cons.htm"], ["Aneel — Resolução 1.000/2021", "https://www.gov.br/aneel"]], next: "Seu corte foi indevido?" },
  { id: "imovel-planta", area: "consumidor", all: [["planta", "construtora", "incorporadora", "distrato", "apartamento novo"], ["atraso", "entrega", "desist", "distrato", "cancelar", "devolu"]],
    q: "A construtora atrasou a entrega do imóvel ou quero desistir. Quais meus direitos?",
    a: ["O contrato pode prever tolerância de até 180 dias. Passado esse prazo, você pode desistir e receber tudo de volta com multa, ou manter o contrato e receber indenização de 1% ao mês do valor pago.",
      "Se a desistência for sua, sem culpa da construtora (distrato), ela pode reter parte do valor pago: até 25%, ou até 50% se o empreendimento tiver patrimônio de afetação, além da comissão de corretagem.",
      "Lucros cessantes (aluguel que você deixou de economizar) costumam ser reconhecidos em atraso da construtora."],
    sources: [["Lei 4.591/1964, art. 43-A, e Lei 13.786/2018", P + "_ato2015-2018/2018/lei/l13786.htm"]], next: "Quer calcular o que você pode receber?" },
);

/* ===== SAÚDE ===== */
const MANTER_PLANO_FU = {
  title: "Por quanto tempo você pode manter o plano?",
  intro: "3 perguntas e calculamos.",
  questions: [
    { id: "motivo", q: "Você foi demitido(a) ou se aposentou?", a: ["Demitido(a) sem justa causa", "Aposentei", "Pedi demissão / justa causa"] },
    { id: "contribuia", q: "Você pagava parte da mensalidade do plano (desconto em folha)?", a: ["Sim", "Não, a empresa pagava tudo", "Só coparticipação"] },
    { id: "anos", q: "Por quantos anos você contribuiu para o plano?", a: ["Menos de 1", "1 a 3", "3 a 6", "6 a 10", "Mais de 10"] },
  ],
  evaluate(a) {
    if (a.motivo === "Pedi demissão / justa causa") return { headline: "Nesses casos, a lei não garante manter o plano empresarial.", tone: "info", lawyer: false, items: ["Você pode fazer portabilidade de carências para um plano individual ou coletivo por adesão, sem cumprir novas carências, se cumprir os requisitos da ANS."], summary: "Manter plano: pediu demissão/justa causa." };
    if (a.contribuia !== "Sim") return { headline: "Sem contribuição sua para a mensalidade, a lei não garante a permanência.", tone: "info", lawyer: true, items: ["Coparticipação (pagar só quando usa) não conta como contribuição, segundo a ANS e o STJ.", "Avalie a portabilidade de carências.", "Vale verificar o contrato: há empresas que garantem a permanência por política própria."], summary: `Manter plano: ${a.motivo}; sem contribuição.` };
    const anos = { "Menos de 1": 0.5, "1 a 3": 2, "3 a 6": 4.5, "6 a 10": 8, "Mais de 10": 11 }[a.anos];
    let headline;
    if (a.motivo === "Aposentei") headline = anos >= 10 ? "Você pode manter o plano por tempo indeterminado." : `Você pode manter o plano por cerca de ${Math.max(1, Math.round(anos))} ano(s): 1 ano para cada ano de contribuição.`;
    else { const meses = Math.min(24, Math.max(6, Math.round(anos * 12 / 3))); headline = `Você pode manter o plano por cerca de ${meses} meses (1/3 do tempo de contribuição, entre 6 e 24 meses).`; }
    return { headline, tone: "good", lawyer: false, items: ["Você passa a pagar a mensalidade integral (a sua parte mais a que a empresa pagava).", "Mantém as mesmas coberturas e a mesma rede.", "Manifeste o interesse à empresa no prazo informado no comunicado de desligamento (em geral, 30 dias).", "Se a empresa ou a operadora negar, reclame na ANS (NIP)."], summary: `Manter plano: ${a.motivo}; contribuía; ${a.anos} anos.` };
  },
};

FAQ.push(
  { id: "manter-plano", area: "saude", all: [["plano"], ["demiti", "demissão", "demissao", "aposentei", "aposentad", "desligad", "manter"]],
    q: "Fui demitido(a) ou me aposentei. Posso continuar no plano da empresa?",
    a: ["Sim, se você pagava parte da mensalidade. Demitido(a) sem justa causa: pode manter por 1/3 do tempo de contribuição, no mínimo 6 e no máximo 24 meses. Aposentado(a) com 10 anos ou mais de contribuição: por tempo indeterminado. Com menos de 10: 1 ano para cada ano de contribuição.",
      "Você passa a pagar a mensalidade integral, com as mesmas coberturas.",
      "Coparticipação, em que você paga só quando usa, não conta como contribuição."],
    sources: [["Lei 9.656/1998, arts. 30 e 31", P + "leis/l9656.htm"], ["ANS — RN 488/2022", "https://www.gov.br/ans"]], next: "Vamos calcular por quanto tempo?", followUp: MANTER_PLANO_FU },
  { id: "bariatrica", area: "saude", all: [["bariátrica", "bariatrica", "redução de estômago", "reducao de estomago", "gastroplastia", "pós-bariátrica", "pos bariatrica", "reparadora"]],
    q: "O plano é obrigado a cobrir cirurgia bariátrica e a reparadora depois dela?",
    a: ["A bariátrica está no rol da ANS e é de cobertura obrigatória nos planos hospitalares quando a pessoa cumpre os critérios: em geral, IMC a partir de 40, ou a partir de 35 com doenças associadas (diabetes, hipertensão, apneia), após tentativa de tratamento clínico. [VALIDAR critérios atuais da DUT]",
      "As cirurgias reparadoras após a bariátrica (retirada de excesso de pele, por exemplo) devem ser cobertas quando têm caráter funcional, e não apenas estético, segundo o STJ (Tema 1.069).",
      "Peça ao médico relatório com IMC, comorbidades, tratamentos anteriores e, na reparadora, as complicações funcionais (dermatites, infecções, limitação de movimentos)."],
    sources: [["Lei 9.656/1998", P + "leis/l9656.htm"], ["STJ — Tema 1.069", "https://processo.stj.jus.br/repetitivos/temas_repetitivos/"]], next: "O plano negou sua cirurgia?", followUp: SAUDE_NEGATIVA_FU },
  { id: "oncologico", area: "saude", all: [["câncer", "cancer", "oncológ", "oncolog", "quimio", "radioterapia", "imunoterapia", "tumor"]],
    q: "O plano é obrigado a cobrir tratamento de câncer?",
    a: ["Sim. Quimioterapia (inclusive a oral, em casa), radioterapia e cirurgias oncológicas são de cobertura obrigatória nos planos com segmentação ambulatorial ou hospitalar.",
      "Medicamentos antineoplásicos orais registrados na Anvisa devem ser fornecidos, mesmo para uso domiciliar.",
      "Imunoterapia e medicamentos mais novos podem ser negados por estarem fora do rol, mas a negativa pode ser questionada com base na Lei 14.454/2022 e no relatório do oncologista.",
      "Em tratamento de câncer, a urgência costuma justificar pedido de liminar."],
    sources: [["Lei 9.656/1998, art. 12, I, c, e II, g", P + "leis/l9656.htm"], ["Lei 14.454/2022", P + "_ato2019-2022/2022/lei/l14454.htm"]], next: "O plano negou parte do tratamento?", followUp: SAUDE_NEGATIVA_FU },
  { id: "reembolso", area: "saude", all: [["reembolso", "reembolsar", "particular", "fora da rede"]],
    q: "Quando o plano tem que reembolsar consulta ou procedimento particular?",
    a: ["Se o seu plano tem livre escolha, o reembolso segue a tabela do contrato.",
      "Se o plano não oferecer profissional ou serviço da rede dentro dos prazos máximos da ANS, deve garantir o atendimento fora da rede ou reembolsar integralmente as despesas, conforme as regras da ANS.",
      "Em urgência e emergência, quando não foi possível usar a rede, o reembolso também é devido.",
      "Guarde notas fiscais, recibos com CPF/CNPJ do profissional, pedido médico e protocolos em que o plano informou falta de rede."],
    sources: [["Lei 9.656/1998, art. 12, VI", P + "leis/l9656.htm"], ["ANS — prazos de atendimento", "https://www.gov.br/ans"]], next: "O plano negou ou pagou menos?" },
  { id: "erro-medico", area: "saude", all: [["erro médico", "erro medico", "negligência", "negligencia", "imperícia", "impericia", "cirurgia deu errado", "infecção hospitalar", "infeccao hospitalar"]],
    q: "Fui vítima de erro médico. O que fazer?",
    a: ["Peça cópia integral do prontuário ao hospital ou à clínica. É seu direito e deve ser fornecida.",
      "Hospitais e clínicas respondem pelos danos independentemente de culpa quanto aos serviços que prestam (hotelaria, enfermagem, infecção hospitalar). O médico responde se ficar provada a culpa.",
      "O prazo para pedir indenização é, em regra, de 5 anos a partir do conhecimento do dano e de quem o causou.",
      "Além da indenização, é possível representar no Conselho Regional de Medicina."],
    sources: [["CDC, arts. 14 e 27", P + "leis/l8078compilado.htm"], ["Código Civil, art. 951", P + "leis/2002/l10406compilada.htm"]], next: "Quer avaliar seu caso?" },
);

/* ===== ADMINISTRATIVO ===== */
FAQ.push(
  { id: "concurso-eliminacao", area: "administrativo", all: [["concurso"], ["eliminad", "reprovad", "inapto", "psicotécnico", "psicotecnico", "taf", "teste físico", "teste fisico", "investigação social", "investigacao social", "exame médico", "exame medico"]],
    q: "Fui eliminado(a) no psicotécnico, TAF ou exame médico do concurso. Posso recorrer?",
    a: ["Sim. Primeiro use o recurso administrativo previsto no edital, dentro do prazo, e peça acesso ao laudo, à gravação ou ao resultado detalhado.",
      "O exame psicotécnico só é válido se previsto em lei, com critérios objetivos e direito a recurso (Súmula Vinculante 44).",
      "No exame médico, a eliminação deve se basear em incompatibilidade real com o cargo, e não apenas em uma condição de saúde.",
      "Candidatas gestantes têm direito de remarcar o teste físico (STF, Tema 973)."],
    sources: [["STF — Súmula Vinculante 44", "https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp"], ["STF — Tema 973", "https://portal.stf.jus.br/jurisprudenciaRepercussao/"]], next: "Quer analisar sua eliminação?" },
  { id: "heteroidentificacao", area: "administrativo", all: [["heteroidentifica", "cotas", "cotista", "banca de verificação", "comissão de verificação", "pardo", "negro"]],
    q: "Fui eliminado(a) das cotas na banca de heteroidentificação. O que fazer?",
    a: ["A heteroidentificação é válida (STF, ADC 41), mas o procedimento deve respeitar o edital, avaliar apenas o fenótipo (características físicas), ser registrado (filmado) e permitir recurso.",
      "Peça a gravação e a fundamentação da decisão. Decisões sem motivação ou com critérios diferentes do edital podem ser questionadas.",
      "Em regra, quem é excluído das cotas sem má-fé continua concorrendo na ampla concorrência, se tiver nota para isso. Confira o edital."],
    sources: [["STF — ADC 41", "https://portal.stf.jus.br"], ["Lei 15.142/2025 (cotas em concursos) [VALIDAR]", P]], next: "Quer analisar sua exclusão?" },
  { id: "multa-transito", area: "administrativo", all: [["multa", "cnh", "carteira de motorista", "pontos na carteira", "suspensão da cnh", "detran", "infração de trânsito"]],
    q: "Como recorrer de multa de trânsito ou de suspensão da CNH?",
    a: ["Há três etapas: defesa prévia (ou indicação do condutor), recurso à JARI e recurso ao Cetran ou Contran. Os prazos vêm na notificação e, em geral, são de pelo menos 30 dias.",
      "Confira vícios formais: notificação enviada depois de 30 dias da infração, dados errados do veículo, equipamento sem aferição.",
      "A suspensão da CNH acontece com 20 pontos em 12 meses se houver 2 ou mais infrações gravíssimas, 30 pontos se houver 1, e 40 pontos se não houver nenhuma. Motoristas profissionais têm regra própria.",
      "Recorrer não gera pontos nem multa adicional, e a infração só é registrada depois de esgotados os recursos."],
    sources: [["Código de Trânsito Brasileiro, arts. 261, 280 a 290", P + "leis/l9503compilado.htm"]], next: "Quer ajuda com o recurso?" },
  { id: "tribunal-contas", area: "administrativo", all: [["tribunal de contas", "tcu", "tce", "tcm", "tomada de contas", "tce "]],
    q: "Fui citado(a) pelo Tribunal de Contas. O que significa?",
    a: ["A citação ocorre quando o Tribunal aponta possível dano aos cofres públicos e chama você a se defender ou a devolver o valor. A audiência ocorre quando há irregularidade sem dano, que pode gerar multa.",
      "O prazo de defesa vem na comunicação; no TCU, costuma ser de 15 dias. [VALIDAR para cada tribunal]",
      "A defesa deve mostrar sua conduta concreta, as condições reais da época (art. 22 da LINDB) e que não houve dolo ou erro grosseiro (art. 28).",
      "Débito e multa têm regras diferentes de prescrição. A cobrança de débito imputado pelo Tribunal prescreve em 5 anos (STF, Tema 899)."],
    sources: [["Lei 8.443/1992 (Lei Orgânica do TCU)", P + "leis/l8443.htm"], ["LINDB, arts. 22 e 28", P + "decreto-lei/del4657compilado.htm"]], next: "Quer ajuda com a defesa?", followUp: PAD_FU },
);

/* ===== CARTÓRIO ===== */
FAQ.push(
  { id: "testamento", area: "cartorio", all: [["testamento", "testar", "deixar meus bens", "deixar para"]],
    q: "Como fazer um testamento?",
    a: ["O mais seguro é o testamento público, feito no Tabelionato de Notas com duas testemunhas. Também existem o cerrado (lacrado) e o particular (escrito pela pessoa, com três testemunhas).",
      "Quem tem herdeiros necessários (filhos, netos, pais ou cônjuge) só pode dispor livremente de metade do patrimônio. A outra metade, a legítima, pertence a eles por lei.",
      "O testamento pode ser alterado ou revogado a qualquer momento.",
      "Também é possível incluir disposições não patrimoniais, como reconhecimento de filho ou nomeação de tutor."],
    sources: [["Código Civil, arts. 1.845 a 1.990", P + "leis/2002/l10406compilada.htm"]], next: "Quer planejar sua sucessão?" },
  { id: "planejamento-sucessorio", area: "cartorio", all: [["planejamento sucessório", "planejamento sucessorio", "holding", "doação", "doacao", "usufruto", "herança em vida", "heranca em vida"]],
    q: "O que é planejamento sucessório? Doação com usufruto vale a pena?",
    a: ["É organizar em vida como o patrimônio será transmitido, para reduzir custos, conflitos e tempo de inventário.",
      "Na doação com reserva de usufruto, os bens passam aos herdeiros, mas você continua usando e recebendo os rendimentos enquanto viver. O ITCMD é pago na doação.",
      "Doação a filhos é considerada adiantamento da herança, salvo se dispensada da colação no próprio ato.",
      "Holding familiar pode ser útil para patrimônios maiores, mas envolve custos e tributos que precisam ser calculados caso a caso."],
    sources: [["Código Civil, arts. 538 a 564 e 2.002", P + "leis/2002/l10406compilada.htm"]], next: "Quer avaliar a melhor estratégia?" },
  { id: "adjudicacao", area: "cartorio", all: [["adjudicação", "adjudicacao", "vendedor sumiu", "vendedor faleceu", "não passa a escritura", "nao passa a escritura", "quitado mas sem escritura"]],
    q: "Paguei o imóvel, mas o vendedor não passa a escritura. O que fazer?",
    a: ["Desde 2022 é possível a adjudicação compulsória extrajudicial, direto no Registro de Imóveis, com advogado. O imóvel é registrado em seu nome sem processo judicial.",
      "É preciso apresentar o contrato de compra, prova da quitação, ata notarial e notificação do vendedor (ou dos herdeiros) para que façam a escritura.",
      "Se houver oposição fundamentada, o caso vai para a Justiça."],
    sources: [["Lei 6.015/1973, art. 216-B (Lei 14.382/2022)", P + "leis/l6015compilada.htm"]], next: "Quer regularizar seu imóvel?" },
  { id: "protesto", area: "cartorio", all: [["protest", "cartório de protesto", "título protestado", "titulo protestado"]],
    q: "Meu nome foi protestado em cartório. Como cancelar?",
    a: ["Pague a dívida ao credor e peça a carta de anuência (documento em que ele autoriza o cancelamento). Leve a carta ao Tabelionato de Protesto e pague os emolumentos.",
      "Se a dívida já foi paga e o credor não fornece a carta, ou se o protesto é indevido, é possível pedir o cancelamento na Justiça, com indenização conforme o caso.",
      "Você pode consultar protestos em seu CPF gratuitamente pelo site da Central de Protestos (CENPROT)."],
    sources: [["Lei 9.492/1997", P + "leis/l9492.htm"], ["CENPROT — consulta", "https://www.pesquisaprotesto.com.br"]], next: "O protesto é indevido?" },
  { id: "ata-notarial", area: "cartorio", all: [["ata notarial", "print", "prints", "conversa de whatsapp", "provar conversa", "prova de mensagem"]],
    q: "Como transformar prints e conversas em prova?",
    a: ["A ata notarial é feita pelo tabelião, que verifica o conteúdo (site, rede social, conversa no celular) e registra o que viu em documento com fé pública.",
      "É recomendada quando o conteúdo pode ser apagado ou quando a outra parte pode contestar a autenticidade dos prints.",
      "Leve o celular ou o link ao Tabelionato de Notas. O custo segue a tabela de emolumentos do estado."],
    sources: [["CPC, art. 384", P + "_ato2015-2018/2015/lei/l13105.htm"]], next: "Precisa de orientação sobre a prova?" },
  { id: "itcmd", area: "cartorio", all: [["itcmd", "itcd", "imposto sobre herança", "imposto de herança", "imposto sobre doação", "imposto de doação"]],
    q: "Como funciona o ITCMD na herança e na doação?",
    a: ["É o imposto estadual sobre herança e doação. Cada estado define a alíquota, limitada a 8%. Desde a Reforma Tributária (EC 132/2023), a cobrança deve ser progressiva conforme o valor.",
      "É devido ao estado onde se processa o inventário (bens móveis) ou onde está o imóvel.",
      "Atrasar a abertura do inventário pode gerar multa, conforme a lei do estado. Alguns estados têm isenções para valores pequenos ou para o único imóvel residencial."],
    sources: [["Constituição Federal, art. 155, I e §1º", P + "constituicao/constituicao.htm"], ["EC 132/2023", P + "constituicao/emendas/emc/emc132.htm"]], next: "Quer estimar o imposto do seu caso?" },
);

/* ===== SAÚDE: temas do repositório de teses do Escritório Digital ===== */
const HOME_CARE_FU = {
  title: "Vamos organizar o pedido de home care?",
  intro: "Perguntas da triagem do Escritório Digital. No fim, mostramos o que falta para um pedido forte.",
  questions: [
    { id: "indicacao", q: "O médico indicou expressamente home care (internação domiciliar)?", a: ["Sim, por escrito", "Só verbalmente", "Não"] },
    { id: "itens", q: "O que foi prescrito?", a: ["Equipe (enfermagem 24h, fisio, fono)", "Equipamentos e insumos", "Tudo isso", "Não sei"] },
    { id: "negativa", q: "Como foi a negativa?", a: ["Total", "Parcial (reduziram horas ou itens)", "Ainda não pedi", "Sem resposta"] },
    { id: "escrita", q: "A negativa foi por escrito?", a: ["Sim", "Não"] },
    { id: "internado", q: "O paciente está internado agora?", a: ["Sim, com alta prevista", "Sim, sem previsão", "Não, já está em casa"] },
    { id: "risco", q: "Qual o risco se o atendimento demorar?", a: ["Alto (risco de vida ou de piora grave)", "Moderado", "Não sei"] },
    { id: "despesas", q: "A família já está pagando parte do tratamento?", a: ["Sim", "Não"] },
  ],
  evaluate(a) {
    const items = [];
    if (a.indicacao !== "Sim, por escrito") items.push("Peça ao médico relatório escrito indicando home care em substituição à internação hospitalar, com a lista de serviços, horas de enfermagem e equipamentos.");
    if (a.escrita === "Não" || a.negativa === "Sem resposta") items.push("Peça a negativa por escrito à operadora (anote o protocolo). Sem resposta no prazo, registre NIP na ANS.");
    if (a.negativa === "Parcial (reduziram horas ou itens)") items.push("Redução de horas ou de itens prescritos também pode ser questionada: a operadora não pode substituir a prescrição médica.");
    if (a.internado === "Sim, com alta prevista") items.push("Com alta prevista, o pedido é urgente: sem home care, a alta pode colocar o paciente em risco.");
    if (a.despesas === "Sim") items.push("Guarde notas e recibos: o que a família pagou pode ser cobrado de volta.");
    items.push("Documentos: relatório médico detalhado, prescrição, negativa, carteirinha e contrato, prontuário e exames.");
    const urgent = a.risco.startsWith("Alto") || a.internado === "Sim, com alta prevista";
    return { headline: urgent ? "O caso é urgente: cabe pedido de liminar." : "Veja o que organizar para pedir o home care.",
      tone: urgent ? "near" : "good", items, lawyer: true,
      summary: `Home care: indicação ${a.indicacao}; itens ${a.itens}; negativa ${a.negativa} (${a.escrita === "Sim" ? "escrita" : "não escrita"}); internado ${a.internado}; risco ${a.risco}; despesas ${a.despesas}.` };
  },
};

FAQ.push(
  { id: "home-care", area: "saude", all: [["home care", "homecare", "internação domiciliar", "internacao domiciliar", "enfermagem em casa", "atendimento domiciliar"]],
    q: "O plano é obrigado a cobrir home care?",
    a: ["Quando o médico indica a internação domiciliar em substituição à internação hospitalar, a jurisprudência tende a considerar abusiva a negativa, mesmo que o contrato exclua o home care.",
      "A cobertura deve abranger o que foi prescrito: equipe de enfermagem, fisioterapia, equipamentos e insumos necessários. A operadora não pode reduzir horas ou itens por conta própria.",
      "O ponto central é o relatório médico: ele deve mostrar que o paciente precisaria estar internado se não houvesse o atendimento em casa."],
    sources: [["Lei 9.656/1998", P + "leis/l9656.htm"], ["STJ — jurisprudência sobre home care", "https://scon.stj.jus.br/SCON/"]], next: "Vamos organizar o seu pedido?", followUp: HOME_CARE_FU },
  { id: "cancelamento-plano", area: "saude", all: [["plano"], ["cancel", "rescind", "rescis", "encerr", "excluíd", "excluid"]],
    q: "O plano de saúde pode ser cancelado durante um tratamento?",
    a: ["Em planos coletivos, a operadora pode rescindir o contrato, mas o STJ decidiu que, se houver beneficiário em tratamento que garanta sua sobrevivência ou integridade física, a cobertura deve continuar até a alta, desde que pagas as mensalidades (Tema 1.082).",
      "Em planos individuais, o cancelamento só é permitido por fraude ou por atraso de mais de 60 dias nos últimos 12 meses, com notificação até o 50º dia de atraso.",
      "Planos coletivos com poucas vidas (os “falsos coletivos”) podem receber proteção semelhante à dos individuais."],
    sources: [["Lei 9.656/1998, art. 13", P + "leis/l9656.htm"], ["STJ — Tema 1.082", "https://processo.stj.jus.br/repetitivos/temas_repetitivos/"]], next: "Seu plano foi cancelado?", followUp: SAUDE_NEGATIVA_FU },
  { id: "saude-mental", area: "saude", all: [["psiquiátr", "psiquiatr", "saúde mental", "saude mental", "dependência química", "dependencia quimica", "ludopatia", "jogo", "apostas", "bets", "depressão", "depressao", "clínica de reabilitação", "internação involuntária"]],
    q: "O plano cobre tratamento psiquiátrico, dependência química ou vício em jogos?",
    a: ["Sim. Transtornos mentais, inclusive dependência química e o transtorno do jogo (ludopatia), estão entre as doenças de cobertura obrigatória pelos planos de saúde.",
      "A limitação do tempo de internação psiquiátrica é considerada abusiva pelo STJ (Súmula 302, aplicada também a esses casos). A coparticipação após 30 dias de internação é admitida se prevista no contrato.",
      "Psicoterapia e consultas com psiquiatra seguem o rol e as diretrizes da ANS. Quando a rede não tem clínica adequada, a operadora deve garantir o atendimento."],
    sources: [["Lei 9.656/1998, arts. 10 e 12", P + "leis/l9656.htm"], ["Lei 10.216/2001", P + "leis/leis_2001/l10216.htm"], ["STJ — Súmula 302", "https://scon.stj.jus.br/SCON/sumstj/"]], next: "O plano negou ou limitou o tratamento?", followUp: SAUDE_NEGATIVA_FU },
  { id: "liminar-descumprida", area: "saude", all: [["liminar", "decisão", "decisao", "ordem do juiz", "tutela"], ["descumpr", "não cumpr", "nao cumpr", "não está cumprindo", "ignor", "atras"]],
    q: "Consegui uma liminar, mas o plano ou o governo não está cumprindo. E agora?",
    a: ["Avise o juiz imediatamente, por meio do advogado, com provas do descumprimento: protocolos, negativas, mensagens e datas.",
      "O juiz pode aumentar a multa diária, determinar o bloqueio de valores nas contas do plano ou do ente público para custear o tratamento, e até mandar comprar o medicamento diretamente.",
      "Guarde orçamentos de onde o tratamento ou o remédio pode ser obtido: eles agilizam o bloqueio de valores."],
    sources: [["CPC, arts. 297, 536 e 537", P + "_ato2015-2018/2015/lei/l13105.htm"]], next: "Precisa de ajuda para fazer cumprir a decisão?" },
);
