// Base de respostas diretas. Cada entrada responde UMA pergunta frequente.
// `all`: grupos de termos — o texto precisa conter ao menos um termo de cada grupo.
// Conteúdo sujeito a validação da advogada responsável (ver conteudo/01-previdenciario.md).
const FAQ = [
  {
    id: "pcd-grau",
    area: "previdenciario",
    all: [["deficien", "pcd"], ["grave", "moderad", "leve", "grau"]],
    q: "Quais deficiências são consideradas graves para a aposentadoria da pessoa com deficiência?",
    a: [
      "A lei não traz uma lista de doenças ou deficiências graves. O grau (leve, moderada ou grave) não depende do diagnóstico, e sim de quanto a deficiência limita a sua vida e o seu trabalho.",
      "O INSS define o grau em uma avaliação biopsicossocial: perícia médica e avaliação com assistente social. Elas aplicam um questionário de funcionalidade (IF-Br) que dá uma pontuação. Quanto menor a pontuação, mais grave a deficiência.",
      "A mesma condição, como uma deficiência visual, pode ser classificada como leve para uma pessoa e grave para outra, conforme as barreiras que cada uma enfrenta.",
    ],
    table: {
      head: ["Grau", "Tempo de contribuição — homem", "Tempo de contribuição — mulher"],
      rows: [["Grave", "25 anos", "20 anos"], ["Moderada", "29 anos", "24 anos"], ["Leve", "33 anos", "28 anos"]],
      note: "Aposentadoria por tempo, sem idade mínima. Há também a aposentadoria por idade: 60 anos (homem) ou 55 anos (mulher) com 15 anos de contribuição na condição de pessoa com deficiência.",
    },
    tips: [
      "Leve à avaliação laudos que descrevam as limitações do dia a dia (locomoção, comunicação, cuidados pessoais, trabalho), e não só o CID.",
      "Se a deficiência começou ou mudou de grau ao longo da vida, os períodos são convertidos proporcionalmente.",
      "O grau atribuído pelo INSS pode ser contestado em recurso ou na Justiça.",
    ],
    sources: [
      ["LC 142/2013, arts. 3º e 4º", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp142.htm"],
      ["Decreto 3.048/1999, arts. 70-A a 70-I", "https://www.planalto.gov.br/ccivil_03/decreto/d3048.htm"],
      ["Portaria Interministerial 1/2014 (IF-Br)", "https://www.gov.br/inss"],
    ],
    next: "Quer saber se você já pode se aposentar nessa regra?",
  },
  {
    id: "pcd-quem",
    area: "previdenciario",
    all: [["deficien", "pcd"], ["quem", "tenho direito", "posso", "requisito", "como funciona", "o que é"]],
    q: "Quem tem direito à aposentadoria da pessoa com deficiência?",
    a: [
      "Tem direito o segurado do INSS com impedimento de longo prazo (físico, mental, intelectual ou sensorial) que, junto com barreiras, dificulta sua participação plena na sociedade.",
      "Existem duas modalidades: por tempo de contribuição, sem idade mínima, com tempo que varia conforme o grau; e por idade, aos 60 anos (homem) ou 55 anos (mulher), com 15 anos de contribuição como pessoa com deficiência.",
      "Essas regras não foram alteradas pela Reforma da Previdência de 2019.",
    ],
    sources: [["LC 142/2013", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp142.htm"]],
    next: "Quer simular ou analisar o seu caso?",
  },
  {
    id: "pontos-2026",
    area: "previdenciario",
    all: [["ponto"]],
    q: "Como funciona a regra dos pontos?",
    a: [
      "Somam-se a idade e o tempo de contribuição. Em 2026 são necessários 93 pontos (mulher) ou 103 pontos (homem), além de 30 anos (mulher) ou 35 anos (homem) de contribuição.",
      "A exigência sobe 1 ponto por ano até chegar a 100 (mulher) e 105 (homem). Só vale para quem já contribuía antes de 13/11/2019.",
      "Professores da educação básica: 88 (mulher) ou 98 (homem) pontos em 2026, com 25 ou 30 anos de magistério.",
    ],
    sources: [["EC 103/2019, art. 15", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
    next: "Quer simular em qual regra você se encaixa primeiro?",
  },
  {
    id: "idade-minima",
    area: "previdenciario",
    all: [["idade"], ["aposent"], ["qual", "quantos", "mínima", "minima", "com que"]],
    q: "Com que idade posso me aposentar?",
    a: [
      "Pela regra permanente, aos 62 anos (mulher) ou 65 anos (homem), com 15 anos de contribuição. Homens que começaram a contribuir depois de 13/11/2019 precisam de 20 anos.",
      "Quem já contribuía antes da Reforma pode se aposentar mais cedo por regras de transição. Em 2026, a idade mínima progressiva é de 59 anos e 6 meses (mulher) ou 64 anos e 6 meses (homem), com 30 ou 35 anos de contribuição. Também existem as regras dos pontos e dos pedágios.",
      "Há regras próprias para professor, atividade especial, rural e pessoa com deficiência.",
    ],
    sources: [["EC 103/2019, arts. 16, 18 e 19", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
    next: "Quer simular a sua data?",
  },
  {
    id: "calculo-valor",
    area: "previdenciario",
    all: [["valor", "quanto vou receber", "cálculo", "calculo", "calcula"], ["aposent", "benefício", "beneficio"]],
    q: "Como é calculado o valor da aposentadoria?",
    a: [
      "Calcula-se a média de todos os salários de contribuição desde julho de 1994. O benefício é 60% dessa média mais 2% por ano de contribuição acima de 15 anos (mulher) ou 20 anos (homem).",
      "Exceções: no pedágio de 100%, o valor é 100% da média; no pedágio de 50%, é a média multiplicada pelo fator previdenciário. Nenhum benefício fica abaixo do salário mínimo.",
    ],
    sources: [["EC 103/2019, art. 26", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
    next: "Quer comparar o valor entre as regras?",
  },
  {
    id: "recurso-prazo",
    area: "previdenciario",
    all: [["recurso", "recorrer"], ["prazo", "quanto tempo", "quando", "como"]],
    q: "Qual o prazo para recorrer de uma decisão do INSS?",
    a: [
      "São 30 dias a partir da ciência da decisão. O recurso é apresentado pelo Meu INSS e julgado pelo Conselho de Recursos da Previdência Social (CRPS).",
      "Também é possível ir direto à Justiça Federal. Como recurso administrativo e ação judicial sobre o mesmo pedido não andam juntos, a escolha do caminho deve ser pensada.",
    ],
    sources: [["Lei 8.213/1991, art. 126", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["Decreto 3.048/1999, art. 305", "https://www.planalto.gov.br/ccivil_03/decreto/d3048.htm"]],
    next: "Seu benefício foi negado? Posso orientar o próximo passo.",
  },
  {
    id: "especial-ppp",
    area: "previdenciario",
    all: [["especial", "insalubr", "ppp", "periculos"]],
    q: "Como funciona a aposentadoria especial?",
    a: [
      "É para quem trabalhou exposto a agentes nocivos à saúde, como ruído, agentes químicos, biológicos ou eletricidade. A exposição é comprovada pelo PPP (Perfil Profissiográfico Previdenciário), emitido pela empresa.",
      "Depois da Reforma, exige idade mínima de 55, 58 ou 60 anos para 15, 20 ou 25 anos de exposição, conforme o agente. Quem já contribuía antes pode usar a transição por pontos (66, 76 ou 86).",
      "Períodos especiais anteriores a 13/11/2019 podem ser convertidos em tempo comum com acréscimo.",
    ],
    sources: [["Lei 8.213/1991, arts. 57 e 58", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["EC 103/2019, arts. 19 e 21", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
    next: "Quer analisar seus períodos especiais?",
  },
  {
    id: "bpc-renda",
    area: "previdenciario",
    all: [["bpc", "loas"]],
    q: "Quem tem direito ao BPC/LOAS?",
    a: [
      "Pessoas com 65 anos ou mais, ou com deficiência de longo prazo, cuja família tenha renda por pessoa de até 1/4 do salário mínimo. A lei permite considerar outros elementos de vulnerabilidade.",
      "É obrigatório estar inscrito e com o CadÚnico atualizado. O benefício é de um salário mínimo, não paga 13º e não gera pensão por morte.",
    ],
    sources: [["Lei 8.742/1993, art. 20", "https://www.planalto.gov.br/ccivil_03/leis/l8742.htm"]],
    next: "Quer verificar se você se encaixa?",
  },
  {
    id: "pensao-duracao",
    area: "previdenciario",
    all: [["pensão", "pensao"]],
    q: "Como funciona a pensão por morte?",
    a: [
      "É paga aos dependentes de quem contribuía ou era aposentado. O valor é de 50% da aposentadoria (recebida ou a que teria direito) mais 10% por dependente, até 100%.",
      "Se pedida em até 90 dias do óbito (180 dias para filhos menores de 16), é paga desde a data do falecimento. Para cônjuge ou companheiro(a), a duração depende da idade, do tempo de união e de contribuição: pode ir de 4 meses a vitalícia.",
    ],
    sources: [["Lei 8.213/1991, arts. 74 a 77", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["EC 103/2019, art. 23", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
    next: "Quer orientação para o seu caso?",
  },
];

const QUESTION_START = /^(o que|que|qual|quais|quando|quanto|quantos|quantas|como|quem|onde|posso|pode|tenho direito|existe|é possível|e possivel|preciso)\b/;

function isQuestion(text) {
  const t = text.trim().toLowerCase();
  return t.endsWith("?") || QUESTION_START.test(t);
}

function findFaq(text) {
  const t = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const f of FAQ) {
    if (!f.all.every((group) => group.some((k) => t.includes(k)))) continue;
    const score = f.all.flat().filter((k) => t.includes(k)).length;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best;
}
