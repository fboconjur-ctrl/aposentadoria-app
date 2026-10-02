// Fluxos de triagem do protótipo. Cada fluxo é uma árvore curta de perguntas
// com um resultado estruturado. A classificação por área é interna: o usuário
// nunca vê "você está no módulo X".
const FLOWS = {
  saude: {
    keywords: ["plano de saúde", "plano", "cirurgia", "operadora", "sus", "medicamento", "remédio", "unimed", "exame", "tratamento", "internação"],
    understood: "Entendi. Seu problema envolve cobertura de saúde — plano de saúde ou SUS.",
    subject: "Plano de saúde → negativa de cobertura",
    caseTitle: "Plano de saúde — cobertura negada",
    questions: [
      { q: "O atendimento é pelo plano de saúde ou pelo SUS?", a: ["Plano de saúde", "SUS", "Não sei"] },
      { q: "Você recebeu a negativa por escrito?", a: ["Sim", "Não", "Não sei"] },
      { q: "Há urgência médica? (risco à saúde se esperar)", a: ["Sim, é urgente", "Não é urgente", "Não sei"] },
      { q: "Você tem o pedido e o relatório do médico?", a: ["Tenho os dois", "Só o pedido", "Nenhum"] },
    ],
    steps: [
      { t: "Solicite a negativa por escrito", d: "A operadora deve informar o motivo da recusa por escrito quando solicitado." },
      { t: "Separe estes documentos", d: "Carteirinha · relatório médico · pedido médico · negativa · contrato do plano" },
      { t: "Registre reclamação na ANS", d: "A Notificação de Intermediação Preliminar (NIP) costuma ter resposta rápida.", link: ["Ver procedimento oficial", "https://www.gov.br/ans/pt-br/canais_atendimento"] },
    ],
    law: "Os planos de saúde são regulados pela Lei 9.656/1998 e pelas normas da ANS, que definem coberturas obrigatórias e prazos de atendimento. Uma recusa precisa ter fundamento no contrato e na regulação.",
    sources: [["Lei 9.656/1998", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"], ["ANS — canais de atendimento", "https://www.gov.br/ans/pt-br/canais_atendimento"]],
    needsLawyer: (ans) => ans[2] === "Sim, é urgente" || ans[1] === "Sim",
  },
  previdenciario: {
    keywords: ["inss", "aposentadoria", "aposentar", "benefício", "auxílio", "pensão", "bpc", "loas", "cnis", "perícia", "indeferido"],
    understood: "Entendi. Sua situação envolve um benefício do INSS.",
    subject: "INSS → benefício",
    caseTitle: "Benefício do INSS",
    questions: [
      { q: "Qual é a situação?", a: ["Quero me aposentar", "Benefício negado", "Benefício cortado", "Outro"] },
      { q: "Você já fez pedido no Meu INSS?", a: ["Sim", "Não", "Não sei"] },
      { q: "Você tem acesso ao seu extrato do CNIS?", a: ["Sim", "Não", "Não sei o que é"] },
    ],
    steps: [
      { t: "Baixe seu extrato do CNIS", d: "Ele mostra os vínculos e contribuições que o INSS considera.", link: ["Acessar Meu INSS", "https://meu.inss.gov.br"] },
      { t: "Separe estes documentos", d: "Documento com foto · CPF · carteiras de trabalho · carta de indeferimento (se houver)" },
      { t: "Verifique o prazo de recurso", d: "Em caso de indeferimento, o recurso administrativo tem prazo de 30 dias da ciência da decisão." },
    ],
    law: "Os benefícios do Regime Geral seguem a Lei 8.213/1991 e as regras de transição da Emenda Constitucional 103/2019.",
    sources: [["Lei 8.213/1991", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["EC 103/2019", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
    needsLawyer: (ans) => ans[0] !== "Quero me aposentar",
  },
  administrativo: {
    keywords: ["servidor", "concurso", "pad", "processo administrativo", "licitação", "prefeitura", "órgão público", "exoneração", "posse", "nomeação"],
    understood: "Entendi. Sua situação envolve a Administração Pública.",
    subject: "Administração Pública → servidor / concurso",
    caseTitle: "Questão com a Administração Pública",
    questions: [
      { q: "Do que se trata?", a: ["Concurso público", "Vida funcional de servidor", "Processo disciplinar (PAD)", "Outro"] },
      { q: "Existe algum prazo correndo (recurso, defesa, posse)?", a: ["Sim", "Não", "Não sei"] },
      { q: "Você tem a decisão ou o edital por escrito?", a: ["Sim", "Não"] },
    ],
    steps: [
      { t: "Identifique o prazo", d: "Prazos administrativos costumam ser curtos. Anote a data em que você foi notificado." },
      { t: "Separe estes documentos", d: "Edital ou ato · notificação · decisão · comprovantes" },
      { t: "Peça vista do processo", d: "Você tem direito de acesso aos autos do processo que lhe diz respeito." },
    ],
    law: "No âmbito federal, o processo administrativo segue a Lei 9.784/1999, que garante contraditório, ampla defesa e decisões motivadas. Estados e municípios podem ter leis próprias.",
    sources: [["Lei 9.784/1999", "https://www.planalto.gov.br/ccivil_03/leis/l9784.htm"]],
    needsLawyer: (ans) => ans[0] === "Processo disciplinar (PAD)" || ans[1] === "Sim",
  },
  consumidor: {
    keywords: ["compra", "loja", "produto", "banco", "cobrança", "voo", "companhia aérea", "cartão", "empresa", "serviço", "defeito", "reembolso", "negativado"],
    understood: "Entendi. Seu problema é com uma empresa — uma relação de consumo.",
    subject: "Consumidor → problema com empresa",
    caseTitle: "Problema de consumo",
    questions: [
      { q: "Qual é o tipo de problema?", a: ["Produto com defeito", "Cobrança indevida", "Voo ou viagem", "Nome negativado", "Outro"] },
      { q: "Você já reclamou com a empresa?", a: ["Sim, sem solução", "Não", "Está em andamento"] },
      { q: "Qual o valor aproximado envolvido?", a: ["Até R$ 1 mil", "R$ 1 mil a 10 mil", "Acima de R$ 10 mil"] },
    ],
    steps: [
      { t: "Registre reclamação no consumidor.gov.br", d: "Muitas empresas respondem em até 10 dias.", link: ["Abrir reclamação", "https://www.consumidor.gov.br"] },
      { t: "Separe estes documentos", d: "Nota fiscal · protocolos de atendimento · prints · faturas" },
      { t: "Procure o Procon", d: "Se não houver solução, o Procon do seu estado pode intermediar." },
    ],
    law: "O Código de Defesa do Consumidor (Lei 8.078/1990) protege o consumidor contra defeitos, cobranças indevidas e práticas abusivas.",
    sources: [["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"]],
    needsLawyer: (ans) => ans[0] === "Nome negativado" || ans[2] === "Acima de R$ 10 mil",
  },
  cartorio: {
    keywords: ["cartório", "certidão", "registro", "escritura", "inventário", "divórcio", "usucapião", "imóvel", "nome", "casamento"],
    understood: "Entendi. Sua situação envolve um procedimento de cartório.",
    subject: "Cartório → procedimento extrajudicial",
    caseTitle: "Procedimento em cartório",
    questions: [
      { q: "O que você precisa?", a: ["Certidão", "Inventário ou divórcio", "Regularizar imóvel", "Retificar registro", "Outro"] },
      { q: "Todos os envolvidos estão de acordo?", a: ["Sim", "Não", "Não se aplica"] },
    ],
    steps: [
      { t: "Confirme o cartório competente", d: "Depende do tipo de ato e, em geral, do local do imóvel ou do registro." },
      { t: "Separe estes documentos", d: "Documentos pessoais · certidões atualizadas · documentos do imóvel, se houver" },
      { t: "Solicite certidões online", d: "Muitas certidões podem ser pedidas pela internet.", link: ["Registro Civil", "https://registrocivil.org.br"] },
    ],
    law: "Inventário e divórcio consensuais podem ser feitos em cartório quando há acordo, mas exigem a presença de advogado (Código de Processo Civil, arts. 610 e 733).",
    sources: [["Código de Processo Civil", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm"]],
    needsLawyer: (ans) => ans[0] === "Inventário ou divórcio" || ans[0] === "Regularizar imóvel" || ans[1] === "Não",
  },
};

const OBJECTIVE_Q = { q: "E o que você gostaria que acontecesse?", a: ["Resolver rápido", "Ser indenizado(a)", "Entender meus direitos", "Outro"] };

function classify(text) {
  const t = text.toLowerCase();
  let best = null, score = 0;
  for (const [key, f] of Object.entries(FLOWS)) {
    const s = f.keywords.filter((k) => t.includes(k)).length;
    if (s > score) { score = s; best = key; }
  }
  return best;
}
