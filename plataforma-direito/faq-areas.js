// Respostas diretas e continuações das áreas Saúde, Consumidor, Administrativo e Cartório,
// mais continuações extras do Previdenciário. Conteúdo sujeito a validação (ver conteudo/0X-*.md).

const L = {
  l9656: ["Lei 9.656/1998", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"],
  l14454: ["Lei 14.454/2022", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14454.htm"],
  ans: ["ANS — canais de atendimento", "https://www.gov.br/ans/pt-br/canais_atendimento"],
  cdc: ["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"],
  cgov: ["consumidor.gov.br", "https://www.consumidor.gov.br"],
  anac: ["ANAC — direitos do passageiro", "https://www.gov.br/anac/pt-br/assuntos/passageiros"],
  l8112: ["Lei 8.112/1990", "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm"],
  lindb: ["LINDB (Decreto-Lei 4.657/1942)", "https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm"],
  l14133: ["Lei 14.133/2021", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm"],
  codex: ["Codex 14133", "https://www.codex14133.com.br"],
  cpc: ["Código de Processo Civil", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm"],
  l6015: ["Lei 6.015/1973 (Registros Públicos)", "https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm"],
  rc: ["Registro Civil", "https://registrocivil.org.br"],
  l8213: ["Lei 8.213/1991", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"],
};

const DAY_MS = 86400000;
function addDays(d, n) { return new Date(d.getTime() + n * DAY_MS); }
function addBusinessDays(d, n) { let x = new Date(d); while (n > 0) { x = addDays(x, 1); if (x.getDay() % 6) n--; } return x; }
function daysLeft(deadline) { return Math.ceil((deadline - new Date()) / DAY_MS); }
function deadlineText(deadline) {
  const left = daysLeft(deadline);
  const when = deadline.toLocaleDateString("pt-BR");
  if (left < 0) return { tone: "info", text: `O prazo terminou em ${when}, há ${-left} dia(s).` };
  if (left <= 7) return { tone: "near", text: `Atenção: o prazo termina em ${when}. Restam ${left} dia(s).` };
  return { tone: "good", text: `O prazo vai até ${when}. Restam ${left} dias.` };
}

/* ---------------- SAÚDE ---------------- */
const SAUDE_NEGATIVA_FU = {
  title: "Vamos ver o que fazer com a negativa?",
  intro: "4 perguntas rápidas para indicar o caminho mais rápido.",
  questions: [
    { id: "urg", q: "Há risco à saúde se o tratamento esperar?", a: ["Sim, é urgente", "Não é urgente", "Não sei"] },
    { id: "motivo", q: "Qual motivo o plano deu?", a: ["Fora do rol da ANS", "Carência", "Doença preexistente", "Não está no contrato", "Não informou"] },
    { id: "escrito", q: "Você tem a negativa por escrito?", a: ["Sim", "Não"] },
    { id: "relatorio", q: "Seu médico fez relatório explicando a necessidade?", a: ["Sim", "Não"] },
  ],
  evaluate(a) {
    const items = [];
    const urgent = a.urg === "Sim, é urgente";
    if (urgent) items.push("Urgência: procure atendimento de urgência agora. Em paralelo, um advogado pode pedir uma liminar, que costuma ser analisada em horas ou dias.");
    if (a.escrito === "Não") items.push("Peça a negativa por escrito, com o motivo, pelo SAC da operadora. Anote o protocolo.");
    if (a.relatorio === "Não") items.push("Peça ao médico um relatório com diagnóstico, por que o procedimento é necessário e o risco de não fazer. É a prova mais importante.");
    const byReason = {
      "Fora do rol da ANS": "“Fora do rol” não encerra a questão: a Lei 14.454/2022 admite cobertura fora do rol quando há comprovação científica ou recomendação de órgão técnico.",
      "Carência": "Em urgência e emergência, a carência máxima é de 24 horas. Para outros casos, confira as datas de contratação e de carência no contrato.",
      "Doença preexistente": "A operadora só pode limitar cobertura por doença preexistente se ela foi declarada na contratação, por até 24 meses (cobertura parcial temporária). Fora disso, a negativa é questionável.",
      "Não está no contrato": "Procedimentos do rol da ANS são obrigatórios para o tipo de plano (ambulatorial, hospitalar, obstétrico), mesmo que o contrato não os cite.",
      "Não informou": "Sem motivo informado, a negativa é irregular: a operadora deve justificar por escrito.",
    };
    items.push(byReason[a.motivo]);
    items.push("Registre reclamação na ANS (NIP) pelo site ou no 0800 701 9656. A operadora é notificada e costuma responder rápido.");
    return {
      headline: urgent ? "Seu caso é urgente: aja em duas frentes ao mesmo tempo." : "Há caminhos concretos para reverter essa negativa.",
      tone: urgent ? "near" : "good", items, lawyer: urgent || a.motivo !== "Não informou",
      summary: `Saúde — negativa do plano. Urgência: ${a.urg}. Motivo: ${a.motivo}. Negativa escrita: ${a.escrito}. Relatório médico: ${a.relatorio}.`,
    };
  },
};

FAQ.push(
  { id: "plano-negou", area: "saude", all: [["plano", "operadora", "convênio", "convenio"], ["neg", "recus", "não cobre", "nao cobre", "cobertura"]],
    q: "O plano de saúde pode negar um procedimento pedido pelo médico?",
    a: ["Pode negar apenas com fundamento no contrato e na regulação da ANS, e precisa informar o motivo por escrito quando você pedir.",
      "Procedimentos do rol da ANS são de cobertura obrigatória conforme o tipo de plano. Desde a Lei 14.454/2022, tratamentos fora do rol também podem ter de ser cobertos se houver comprovação científica de eficácia ou recomendação de órgão técnico.",
      "Em urgência e emergência, a carência máxima é de 24 horas."],
    sources: [L.l9656, L.l14454, L.ans], next: "Seu plano negou algo? Vamos ver o caminho.", followUp: SAUDE_NEGATIVA_FU },
  { id: "carencia-urgencia", area: "saude", all: [["carência", "carencia"]],
    q: "Como funciona a carência do plano de saúde?",
    a: ["A lei fixa carências máximas: 24 horas para urgência e emergência, 300 dias para parto e 180 dias para os demais casos (consultas, exames, cirurgias e internações).",
      "Doenças preexistentes declaradas na contratação podem ter cobertura parcial por até 24 meses para cirurgias, leitos de alta tecnologia e procedimentos de alta complexidade.",
      "Na portabilidade de carências, você troca de plano sem cumprir novas carências, se cumprir os requisitos da ANS."],
    sources: [["Lei 9.656/1998, art. 12, V", L.l9656[1]], L.ans], next: "Negaram atendimento por carência?", followUp: SAUDE_NEGATIVA_FU },
  { id: "prazo-atendimento", area: "saude", all: [["prazo", "demora", "quanto tempo", "dias"], ["plano", "consulta", "exame", "cirurgia", "atendimento"]],
    q: "Qual o prazo máximo para o plano marcar consulta, exame ou cirurgia?",
    a: ["A ANS fixa prazos máximos de atendimento. Alguns exemplos: consulta básica (pediatria, clínica médica, ginecologia, cirurgia geral) em até 7 dias úteis; demais especialidades em até 14 dias úteis; exames simples em até 3 dias úteis; alta complexidade e internação eletiva em até 21 dias úteis; urgência e emergência imediatamente.",
      "Se não houver profissional da rede no prazo, a operadora deve garantir o atendimento fora da rede ou reembolsar, conforme as regras da ANS."],
    sources: [["ANS — prazos máximos de atendimento (RN 566/2022)", "https://www.gov.br/ans/pt-br"], L.ans], next: "O plano está descumprindo o prazo?" },
  { id: "reajuste-idade", area: "saude", all: [["reajuste", "aument", "mensalidade"], ["idade", "60", "idos", "faixa"]],
    q: "O plano pode aumentar a mensalidade por idade depois dos 60 anos?",
    a: ["Em planos contratados ou adaptados a partir de 2004, a última faixa de reajuste por idade é aos 59 anos. Depois dos 60, não pode haver aumento por mudança de faixa etária, só o reajuste anual.",
      "O Estatuto da Pessoa Idosa proíbe a cobrança de valores diferenciados em razão da idade.",
      "Planos antigos (anteriores a 1999, não adaptados) seguem o contrato, mas aumentos abusivos podem ser questionados."],
    sources: [["Estatuto da Pessoa Idosa, art. 15, §3º", "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm"], L.ans], next: "Seu plano aumentou por idade?" },
  { id: "sus-remedio", area: "saude", all: [["sus", "farmácia", "alto custo", "governo", "estado"], ["remédio", "remedio", "medicamento"]],
    q: "Como conseguir remédio pelo SUS?",
    a: ["Primeiro veja se o medicamento está na lista oficial (RENAME) ou na lista do seu estado. Se estiver, peça na farmácia do SUS ou na farmácia de alto custo, com receita e laudo.",
      "Se faltar ou for negado, registre o pedido por escrito e guarde a negativa ou o protocolo.",
      "Medicamento fora da lista pode ser obtido na Justiça em situações específicas definidas pelo STF e pelo STJ: imprescindibilidade comprovada por laudo, ineficácia das alternativas do SUS, registro na Anvisa e incapacidade financeira."],
    sources: [["Lei 8.080/1990", "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"], ["RENAME", "https://www.gov.br/saude/pt-br/composicao/sectics/rename"]], next: "Seu medicamento foi negado?" },
  { id: "tea-terapia", area: "saude", all: [["autismo", "tea", "autista", "tgd"]],
    q: "O plano é obrigado a cobrir terapias para autismo (TEA)?",
    a: ["Sim. A ANS determinou cobertura obrigatória para qualquer método ou técnica indicada pelo médico para transtornos globais do desenvolvimento, como o autismo, sem limite de número de sessões com psicólogos, fonoaudiólogos, terapeutas ocupacionais e fisioterapeutas.",
      "A operadora deve oferecer profissionais habilitados na rede. Se não houver, pode haver direito a reembolso ou atendimento fora da rede."],
    sources: [["ANS — RN 539/2022", "https://www.gov.br/ans/pt-br"], L.l9656], next: "O plano está negando ou limitando as terapias?", followUp: SAUDE_NEGATIVA_FU },
);

/* ---------------- CONSUMIDOR ---------------- */
const VOO_FU = {
  title: "Vamos ver o que a companhia deve a você?",
  intro: "4 perguntas e mostramos seus direitos no seu caso.",
  questions: [
    { id: "tipo", q: "O que aconteceu?", a: ["Atraso", "Cancelamento", "Não me deixaram embarcar", "Bagagem extraviada"] },
    { id: "horas", q: "Quanto tempo você esperou (ou espera)?", a: ["Menos de 1h", "1 a 2h", "2 a 4h", "Mais de 4h", "Não se aplica"] },
    { id: "assist", q: "A companhia deu alimentação, hotel ou outro voo?", a: ["Sim, tudo que precisei", "Só em parte", "Não"] },
    { id: "prejuizo", q: "Você teve gastos extras ou perdeu compromisso importante?", a: ["Sim", "Não"] },
  ],
  evaluate(a) {
    const items = [];
    const h = { "Menos de 1h": 0, "1 a 2h": 1, "2 a 4h": 2, "Mais de 4h": 4, "Não se aplica": -1 }[a.horas];
    if (a.tipo === "Bagagem extraviada") {
      items.push("Registre o extravio no balcão da companhia antes de sair do aeroporto (RIB) e guarde o comprovante.");
      items.push("A companhia tem até 7 dias (voo nacional) ou 21 dias (internacional) para devolver a mala. Depois disso, deve indenizar.");
      items.push("Se precisou comprar itens de primeira necessidade, guarde as notas: a companhia deve reembolsar.");
    } else {
      if (h >= 1) items.push("A partir de 1h de espera: direito a informação e comunicação (internet, telefone).");
      if (h >= 2) items.push("A partir de 2h: direito a alimentação (voucher ou refeição).");
      if (h >= 4 || a.tipo !== "Atraso") items.push("A partir de 4h, ou em cancelamento ou embarque negado: você escolhe entre outro voo, reembolso integral ou outro meio de transporte. Se precisar pernoitar, hotel e traslado.");
      if (a.tipo === "Não me deixaram embarcar") items.push("Em embarque negado por excesso de passageiros (overbooking), a companhia deve pagar compensação imediata, além das opções acima.");
    }
    if (a.assist !== "Sim, tudo que precisei") items.push("A companhia não deu toda a assistência obrigatória. Guarde comprovantes de tudo que você pagou.");
    items.push("Registre reclamação no consumidor.gov.br. Se não resolver, cabe ação no Juizado Especial Cível.");
    const strong = a.assist === "Não" || a.prejuizo === "Sim" || h >= 4 || a.tipo === "Não me deixaram embarcar";
    return { headline: strong ? "Seu caso tem elementos para pedir reembolso e, possivelmente, indenização." : "Veja os direitos que se aplicam ao seu caso.",
      tone: strong ? "near" : "good", items, lawyer: strong,
      summary: `Consumidor — voo: ${a.tipo}; espera ${a.horas}; assistência: ${a.assist}; prejuízo extra: ${a.prejuizo}.` };
  },
};

FAQ.push(
  { id: "arrependimento", area: "consumidor", all: [["arrepend", "desist", "devolver", "cancelar a compra", "cancelar compra"]],
    q: "Posso desistir de uma compra feita pela internet?",
    a: ["Sim. Em compras feitas fora da loja física (internet, telefone, catálogo), você pode desistir em até 7 dias, contados da assinatura ou do recebimento do produto, sem precisar justificar.",
      "A loja deve devolver todo o valor pago, inclusive o frete, com correção.",
      "Em compras na loja física, a troca por arrependimento não é obrigatória por lei: depende da política da loja. Defeito é outra coisa e sempre dá direito à reclamação."],
    sources: [["CDC, art. 49", L.cdc[1]], L.cgov], next: "A loja está se recusando a aceitar a desistência?" },
  { id: "defeito", area: "consumidor", all: [["defeito", "estragou", "quebrou", "não funciona", "nao funciona", "garantia"]],
    q: "Comprei um produto com defeito. Quais são meus direitos?",
    a: ["Você tem 30 dias (produto não durável) ou 90 dias (durável) para reclamar. O prazo conta da entrega, se o defeito é aparente, ou de quando ele aparece, se é oculto.",
      "A loja e o fabricante têm até 30 dias para consertar. Se não resolverem, você escolhe: troca por outro produto, devolução do dinheiro corrigido ou abatimento no preço.",
      "Para produtos essenciais, você pode exigir a solução imediata."],
    sources: [["CDC, arts. 18 e 26", L.cdc[1]], L.cgov], next: "Já se passaram 30 dias sem conserto?" },
  { id: "voo", area: "consumidor", all: [["voo", "aérea", "aerea", "avião", "aviao", "aeroporto", "bagagem", "mala"]],
    q: "Quais são meus direitos quando o voo atrasa ou é cancelado?",
    a: ["A assistência é obrigatória e aumenta com o tempo de espera: a partir de 1h, comunicação; a partir de 2h, alimentação; a partir de 4h, hospedagem (se precisar pernoitar) e traslado.",
      "Com atraso acima de 4h, cancelamento ou embarque negado, você escolhe entre outro voo, reembolso integral ou outro meio de transporte.",
      "Danos morais não são automáticos: é preciso demonstrar o prejuízo, como perda de compromisso importante ou falta de assistência."],
    sources: [["ANAC — Resolução 400/2016", L.anac[1]], L.cgov], next: "Vamos ver o seu caso?", followUp: VOO_FU },
  { id: "negativado", area: "consumidor", all: [["negativ", "serasa", "spc", "nome sujo", "boa vista"]],
    q: "Meu nome foi negativado. O que posso fazer?",
    a: ["A inclusão em cadastro de inadimplentes deve ser comunicada antes, por escrito. Sem esse aviso, a negativação é irregular.",
      "Se a dívida não existe ou já foi paga, a empresa deve retirar seu nome. Em dívida paga, a retirada deve ocorrer em até 5 dias úteis.",
      "Negativação indevida costuma gerar indenização. Mas, se você já tinha outra negativação legítima, o STJ entende que não cabe dano moral (Súmula 385)."],
    sources: [["CDC, art. 43", L.cdc[1]], ["STJ — Súmulas 359 e 385", "https://scon.stj.jus.br/SCON/sumstj/"]], next: "Sua negativação é de uma dívida que você não reconhece?" },
  { id: "cobranca-dobro", area: "consumidor", all: [["cobrança", "cobranca", "cobrado", "cobraram"], ["indevid", "dobro", "errad", "não reconheço", "nao reconheco"]],
    q: "Paguei uma cobrança indevida. Tenho direito a receber em dobro?",
    a: ["Sim. Quem paga valor cobrado indevidamente tem direito à devolução em dobro, com correção e juros, salvo engano justificável da empresa.",
      "Se a cobrança não foi paga, você não recebe em dobro, mas pode exigir o cancelamento e, conforme o caso, indenização.",
      "Reúna faturas, comprovantes de pagamento e protocolos de atendimento."],
    sources: [["CDC, art. 42, parágrafo único", L.cdc[1]], L.cgov], next: "Quer ajuda para pedir a devolução?" },
  { id: "pix-golpe", area: "consumidor", all: [["pix", "golpe", "fraude"]],
    q: "Caí em golpe no Pix. Consigo o dinheiro de volta?",
    a: ["Avise o seu banco imediatamente e peça a abertura do MED (Mecanismo Especial de Devolução). O banco do golpista pode bloquear o valor que ainda estiver na conta.",
      "Registre boletim de ocorrência e guarde os comprovantes e as conversas.",
      "Se o banco falhou na segurança (transação muito fora do seu perfil, por exemplo), pode responder pelo prejuízo."],
    sources: [["Banco Central — MED", "https://www.bcb.gov.br/estabilidadefinanceira/pix"], ["STJ — Súmula 479", "https://scon.stj.jus.br/SCON/sumstj/"]], next: "O banco se recusou a ajudar?" },
);

/* ---------------- ADMINISTRATIVO ---------------- */
const PAD_FU = {
  title: "Vamos calcular seu prazo de defesa?",
  intro: "Com a data da citação, mostramos o prazo e o que preparar.",
  questions: [
    { id: "esfera", q: "Você é servidor(a) de qual esfera?", a: ["Federal", "Estadual", "Municipal"] },
    { id: "fase", q: "Em que fase está o processo?", a: ["Recebi a notificação inicial", "Fui citado(a) após o indiciamento", "Já houve decisão"] },
    { id: "data", q: "Em que data você recebeu a citação ou a decisão?", input: "date" },
    { id: "dano", q: "O caso envolve dinheiro público, contrato ou licitação?", a: ["Sim", "Não", "Não sei"] },
  ],
  evaluate(a) {
    const items = [];
    let tone = "info", headline = "Veja o que preparar para sua defesa.";
    if (a.fase === "Fui citado(a) após o indiciamento" && a.data) {
      const d = deadlineText(addDays(a.data, 10));
      tone = d.tone;
      headline = a.esfera === "Federal" ? d.text : `${d.text} (referência: 10 dias da lei federal; confira o estatuto do seu ${a.esfera === "Estadual" ? "estado" : "município"}).`;
      items.push("Na lei federal, o prazo de defesa escrita é de 10 dias da citação. Com dois ou mais indiciados, é de 20 dias. Ele pode ser prorrogado em dobro para diligências indispensáveis.");
    } else if (a.fase === "Já houve decisão" && a.data) {
      const d = deadlineText(addDays(a.data, 30));
      tone = d.tone;
      headline = `Recurso: ${d.text} (referência: 30 dias da lei federal).`;
      items.push("Cabe pedido de reconsideração e recurso. Na lei federal, o prazo é de 30 dias da ciência da decisão.");
    } else {
      items.push("Na fase inicial, acompanhe todos os atos: você pode indicar testemunhas, pedir provas e fazer perguntas.");
    }
    items.push("Peça cópia integral do processo. Você tem direito de acesso aos autos.");
    items.push("A acusação precisa individualizar sua conduta: qual ato você praticou e qual dever violou. “A comissão errou” não basta.");
    items.push("Por decisões e opiniões técnicas, o agente só responde por dolo ou erro grosseiro (art. 28 da LINDB), e as dificuldades reais da época devem ser consideradas (art. 22).");
    items.push("Verifique a prescrição. Na lei federal, 5 anos para demissão, 2 para suspensão e 180 dias para advertência, contados do conhecimento do fato.");
    if (a.dano !== "Não") items.push("Envolvendo dinheiro público, o mesmo fato pode gerar processo no Tribunal de Contas, ação de improbidade e ação penal. A defesa precisa ser pensada em conjunto.");
    return { headline, tone, items, lawyer: true,
      summary: `Administrativo — PAD. Esfera: ${a.esfera}. Fase: ${a.fase}. Data: ${a.data ? a.data.toLocaleDateString("pt-BR") : "não informada"}. Envolve recursos/contratos: ${a.dano}.` };
  },
};

FAQ.push(
  { id: "pad-prazo", area: "administrativo", all: [["pad", "processo disciplinar", "processo administrativo disciplinar", "sindicância", "sindicancia", "comissão processante"]],
    q: "Como funciona a defesa em processo disciplinar (PAD)?",
    a: ["O PAD tem três fases: instauração (portaria), inquérito (instrução, defesa e relatório) e julgamento. Você tem direito ao contraditório e à ampla defesa em todas.",
      "Depois da instrução, se a comissão entender que há infração, você é indiciado(a) e citado(a). Na lei federal, a defesa escrita deve ser apresentada em 10 dias (20 dias se houver mais de um indiciado).",
      "A acusação precisa individualizar sua conduta. Por decisão técnica, você só responde por dolo ou erro grosseiro (art. 28 da LINDB)."],
    sources: [["Lei 8.112/1990, arts. 143 a 182", L.l8112[1]], L.lindb], next: "Já recebeu citação ou decisão?", followUp: PAD_FU },
  { id: "pad-prescricao", area: "administrativo", all: [["prescri"], ["pad", "disciplinar", "servidor", "punição", "punicao", "advertência", "suspensão", "demissão"]],
    q: "Qual o prazo de prescrição de uma infração disciplinar?",
    a: ["No estatuto federal: 5 anos para infrações puníveis com demissão, cassação ou destituição; 2 anos para suspensão; 180 dias para advertência.",
      "O prazo conta da data em que a Administração tomou conhecimento do fato. A instauração do PAD interrompe a prescrição, que volta a correr depois de 140 dias, segundo o entendimento do STJ.",
      "Estados e municípios têm estatutos próprios, com prazos que podem ser diferentes."],
    sources: [["Lei 8.112/1990, art. 142", L.l8112[1]]], next: "Quer verificar se o seu caso prescreveu?", followUp: PAD_FU },
  { id: "concurso-vagas", area: "administrativo", all: [["concurso", "aprovad", "nomea", "convoca"]],
    q: "Fui aprovado(a) em concurso. Tenho direito à nomeação?",
    a: ["Se você foi aprovado(a) dentro do número de vagas do edital, tem direito à nomeação durante o prazo de validade do concurso (STF, Tema 161).",
      "No cadastro reserva, em regra há apenas expectativa. O direito surge se houver nomeação fora da ordem de classificação, se surgirem novas vagas com preterição arbitrária ou se houver contratação precária para a mesma função (STF, Tema 784).",
      "Acompanhe o prazo de validade e a prorrogação no Diário Oficial."],
    sources: [["Constituição Federal, art. 37", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"], ["STF — Temas 161 e 784", "https://portal.stf.jus.br/jurisprudenciaRepercussao/"]], next: "O prazo do seu concurso está acabando sem nomeação?" },
  { id: "licitacao-recurso", area: "administrativo", all: [["licitação", "licitacao", "pregão", "pregao", "inabilit", "desclassific"]],
    q: "Qual o prazo para recorrer em licitação?",
    a: ["Na Lei 14.133/2021, a intenção de recorrer deve ser manifestada logo após o julgamento ou a habilitação, na própria sessão. Depois, o recurso é apresentado em 3 dias úteis.",
      "Contra sanções como advertência, multa e impedimento, o prazo de recurso é de 15 dias úteis. Para declaração de inidoneidade, cabe pedido de reconsideração em 15 dias úteis.",
      "Para aprofundar temas da Lei 14.133, consulte o Codex 14133."],
    sources: [["Lei 14.133/2021, arts. 165 a 168", L.l14133[1]], L.codex], next: "Sua empresa foi inabilitada ou sancionada?" },
  { id: "orgao-nao-paga", area: "administrativo", all: [["não paga", "nao paga", "pagamento atrasado", "atraso no pagamento", "não pagou", "nao pagou", "empenho"]],
    q: "O órgão público não paga minha empresa. O que fazer?",
    a: ["Formalize a cobrança por escrito, com notas fiscais, atestos do fiscal e empenho, e peça atualização monetária e juros pelo atraso.",
      "A Lei 14.133 exige pagamento em ordem cronológica. Ultrapassar a ordem sem justificativa publicada é irregular.",
      "Atrasos superiores a 2 meses podem permitir a suspensão da execução ou a extinção do contrato pela empresa."],
    sources: [["Lei 14.133/2021, arts. 137, 141 e 92", L.l14133[1]], L.codex], next: "Quer ajuda para cobrar o órgão?" },
);

/* ---------------- CARTÓRIO ---------------- */
const INVENTARIO_FU = {
  title: "O inventário pode ser feito em cartório?",
  intro: "4 perguntas e mostramos o caminho e o prazo.",
  questions: [
    { id: "acordo", q: "Todos os herdeiros concordam com a divisão?", a: ["Sim", "Não", "Ainda não conversamos"] },
    { id: "menor", q: "Há herdeiro menor de idade ou incapaz?", a: ["Sim", "Não"] },
    { id: "testamento", q: "A pessoa deixou testamento?", a: ["Sim", "Não", "Não sei"] },
    { id: "obito", q: "Qual a data do falecimento?", input: "date" },
  ],
  evaluate(a) {
    const items = [];
    const cartorio = a.acordo === "Sim";
    let headline = cartorio ? "Pelo que você respondeu, o inventário pode ser feito em cartório, que é mais rápido." : "Sem acordo entre os herdeiros, o caminho é o inventário judicial.";
    if (cartorio && (a.menor === "Sim" || a.testamento !== "Não")) {
      headline = "O cartório pode ser possível, mas com condições específicas.";
      items.push("Com herdeiro menor ou testamento, o inventário em cartório passou a ser admitido em algumas situações, com requisitos próprios (Resolução CNJ 35/2007, com as alterações de 2024). Isso precisa de análise.");
    }
    if (a.obito) {
      const limite = addDays(a.obito, 60);
      const left = daysLeft(limite);
      items.push(left >= 0 ? `O inventário deve ser aberto até ${limite.toLocaleDateString("pt-BR")} (2 meses do falecimento). Restam ${left} dias.` : `O prazo de 2 meses para abrir o inventário terminou em ${limite.toLocaleDateString("pt-BR")}. Conforme o estado, pode haver multa no ITCMD. Ainda assim, é possível fazer o inventário.`);
    }
    items.push("A lei exige advogado no inventário, inclusive em cartório.");
    items.push("Comece pelos documentos: certidão de óbito, documentos e certidões dos herdeiros, matrículas atualizadas dos imóveis, documentos de veículos e extratos bancários.");
    return { headline, tone: cartorio ? "good" : "info", items, lawyer: true,
      summary: `Cartório — inventário. Acordo: ${a.acordo}. Menor/incapaz: ${a.menor}. Testamento: ${a.testamento}. Óbito: ${a.obito ? a.obito.toLocaleDateString("pt-BR") : "não informado"}.` };
  },
};

FAQ.push(
  { id: "inventario-cartorio", area: "cartorio", all: [["inventário", "inventario", "herança", "heranca", "partilha"]],
    q: "Como fazer inventário em cartório?",
    a: ["O inventário pode ser feito por escritura em cartório quando todos os herdeiros são capazes e estão de acordo. Normalmente é bem mais rápido que o judicial.",
      "A presença de advogado é obrigatória. O imposto estadual (ITCMD) precisa ser recolhido antes da escritura.",
      "O prazo para abrir é de 2 meses do falecimento. O atraso pode gerar multa no ITCMD, conforme a lei do estado."],
    sources: [["CPC, arts. 610 e 611", L.cpc[1]], ["Resolução CNJ 35/2007", "https://atos.cnj.jus.br/atos/detalhar/179"]], next: "Vamos ver se o seu pode ser em cartório?", followUp: INVENTARIO_FU },
  { id: "divorcio-cartorio", area: "cartorio", all: [["divórcio", "divorci", "separação", "separacao", "separar"]],
    q: "Posso me divorciar em cartório?",
    a: ["Sim, se o casal estiver de acordo e não houver filhos menores ou incapazes, nem gravidez. O divórcio é feito por escritura pública, com advogado.",
      "Com filhos menores, guarda, convivência e pensão precisam passar pela Justiça. Resolvidas essas questões judicialmente, o divórcio pode ser concluído em cartório em algumas situações.",
      "Não é preciso esperar prazo nem apontar culpa."],
    sources: [["CPC, art. 733", L.cpc[1]], ["Resolução CNJ 35/2007", "https://atos.cnj.jus.br/atos/detalhar/179"]], next: "Quer orientação para o seu divórcio?" },
  { id: "mudar-nome", area: "cartorio", all: [["nome", "prenome", "sobrenome"], ["mudar", "trocar", "alterar", "retific", "incluir", "corrig"]],
    q: "Posso mudar meu nome direto no cartório?",
    a: ["Sim. Maiores de 18 anos podem mudar o prenome (primeiro nome) uma vez, direto no cartório de registro civil, sem justificar. Desfazer a mudança depois exige ação judicial.",
      "Sobrenomes podem ser incluídos ou excluídos no cartório nas hipóteses da lei, por exemplo para incluir sobrenome de família, do cônjuge ou de padrasto e madrasta.",
      "Erros evidentes de grafia são corrigidos no cartório, sem processo."],
    sources: [["Lei 6.015/1973, arts. 56, 57 e 110", L.l6015[1]], L.rc], next: "Quer saber os documentos para o seu caso?" },
  { id: "usucapiao", area: "cartorio", all: [["usucapi", "imóvel sem escritura", "imovel sem escritura", "contrato de gaveta", "regularizar"]],
    q: "Como regularizar um imóvel por usucapião em cartório?",
    a: ["A usucapião pode ser feita diretamente no Registro de Imóveis, sem processo judicial, com advogado.",
      "São necessários: ata notarial que comprove o tempo de posse, planta e memorial descritivo assinados por profissional habilitado, certidões negativas e documentos que provem a posse (IPTU, contas, contratos).",
      "Os prazos de posse variam de 2 a 15 anos, conforme a modalidade (por exemplo, 5 anos para imóvel urbano de até 250 m² usado como moradia, se você não tiver outro imóvel)."],
    sources: [["Lei 6.015/1973, art. 216-A", L.l6015[1]], ["Código Civil, arts. 1.238 a 1.244", "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm"]], next: "Quer saber se seu imóvel se encaixa?" },
  { id: "uniao-estavel", area: "cartorio", all: [["união estável", "uniao estavel", "companheir"]],
    q: "Como formalizar ou desfazer uma união estável em cartório?",
    a: ["A união estável pode ser declarada por escritura pública no Tabelionato de Notas e, se o casal quiser, registrada no Registro Civil. O registro facilita a prova perante terceiros, como INSS e bancos.",
      "A dissolução consensual também pode ser feita em cartório, com advogado, se não houver filhos menores ou incapazes.",
      "Sem contrato escrito, o regime de bens é o da comunhão parcial."],
    sources: [["Código Civil, arts. 1.723 a 1.727", "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm"], L.l6015], next: "Quer orientação para o seu caso?" },
);

/* ---------------- PREVIDENCIÁRIO: continuação do recurso ---------------- */
const RECURSO_FU = {
  title: "Vamos calcular seu prazo de recurso?",
  intro: "Com a data da decisão, mostramos quanto tempo resta e o melhor caminho.",
  questions: [
    { id: "beneficio", q: "Qual benefício foi negado?", a: ["Aposentadoria", "Auxílio por incapacidade", "BPC/LOAS", "Pensão por morte", "Outro"] },
    { id: "data", q: "Em que data você tomou ciência da decisão?", input: "date" },
    { id: "motivo", q: "Qual foi o motivo da negativa?", a: ["Falta de tempo ou carência", "Perícia não reconheceu incapacidade", "Renda acima do limite", "Faltaram documentos", "Não sei"] },
  ],
  evaluate(a) {
    const items = [];
    let headline = "Sem a data da decisão, confira no Meu INSS em “Consultar pedidos”.", tone = "info";
    if (a.data) { const d = deadlineText(addDays(a.data, 30)); headline = `Recurso ao CRPS: ${d.text}`; tone = d.tone; }
    const byReason = {
      "Falta de tempo ou carência": "Quase sempre o problema está no CNIS: vínculos faltando ou contribuições abaixo do mínimo. Envie seu CNIS abaixo para analisarmos.",
      "Perícia não reconheceu incapacidade": "Reúna laudos recentes com CID, limitações e tempo de afastamento. Muitas vezes é melhor um novo pedido com documentação completa ou uma ação judicial com perícia independente.",
      "Renda acima do limite": "O STF admite avaliar a vulnerabilidade além do critério de 1/4 do salário mínimo. Despesas com saúde e a composição da família pesam.",
      "Faltaram documentos": "Muitas vezes o caminho mais rápido é um novo pedido, já com os documentos que faltaram.",
      "Não sei": "Baixe a decisão completa no Meu INSS. O motivo define o melhor caminho.",
    };
    items.push(byReason[a.motivo]);
    items.push("Recurso administrativo e ação judicial sobre o mesmo pedido não andam juntos. A escolha do caminho é técnica.");
    return { headline, tone, items, lawyer: true,
      summary: `Previdenciário — indeferimento. Benefício: ${a.beneficio}. Ciência: ${a.data ? a.data.toLocaleDateString("pt-BR") : "não informada"}. Motivo: ${a.motivo}.` };
  },
};
FAQ.find((f) => f.id === "recurso-prazo").followUp = RECURSO_FU;
FAQ.push({ id: "indeferido", area: "previdenciario", all: [["negad", "indefer", "negou", "negaram"], ["inss", "benefício", "beneficio", "aposentadoria", "auxílio", "auxilio", "bpc", "pensão", "pensao"]],
  q: "Meu benefício do INSS foi negado. O que fazer?",
  a: ["Você tem três caminhos: novo pedido (quando faltou documento), recurso ao Conselho de Recursos da Previdência Social em 30 dias da ciência da decisão, ou ação na Justiça Federal.",
    "O motivo da negativa, que aparece na carta de indeferimento, define qual caminho é melhor."],
  sources: [["Lei 8.213/1991, art. 126", L.l8213[1]]], next: "Vamos ver o seu prazo e o melhor caminho?", followUp: RECURSO_FU });

/* ---------------- SAÚDE: medicamento por liminar ---------------- */
const MEDICAMENTOS = ["mounjaro", "monjaro", "tirzepatida", "ozempic", "wegovy", "semaglutida", "saxenda", "liraglutida", "canabidiol", "cannabis", "zolgensma", "spinraza", "insulina", "remédio", "remedio", "medicamento"];

const LIMINAR_MED_FU = {
  title: "Vamos avaliar as chances no seu caso?",
  intro: "5 perguntas. No fim, mostramos o que pesa a favor, o que falta e os documentos.",
  questions: [
    { id: "via", q: "Você quer o medicamento pelo plano de saúde ou pelo SUS?", a: ["Plano de saúde", "SUS", "Não sei"] },
    { id: "indicacao", q: "Para que o médico indicou?", a: ["Diabetes tipo 2", "Obesidade", "Outra doença"] },
    { id: "alternativas", q: "Você já tentou outros tratamentos que não deram resultado?", a: ["Sim, vários", "Sim, um", "Não"] },
    { id: "laudo", q: "O médico fez laudo explicando por que esse remédio é imprescindível?", a: ["Sim", "Não"] },
    { id: "renda", q: "Você consegue pagar o tratamento sem comprometer o sustento?", a: ["Não consigo", "Com muita dificuldade", "Consigo"] },
  ],
  evaluate(a) {
    const pro = [], contra = [];
    if (a.alternativas === "Sim, vários") pro.push("Outros tratamentos já falharam: é um dos requisitos mais importantes."); else contra.push("A Justiça exige demonstrar que as alternativas disponíveis (no SUS ou no rol do plano) não funcionaram ou não são indicadas.");
    if (a.laudo === "Sim") pro.push("Há laudo médico fundamentado."); else contra.push("Falta o laudo detalhado: diagnóstico, tratamentos anteriores, por que este remédio é imprescindível e o risco de não usar.");
    if (a.via === "SUS") {
      if (a.renda === "Consigo") contra.push("Pelo SUS, para medicamento fora da lista, é preciso demonstrar que você não consegue pagar."); else pro.push("Incapacidade financeira declarada: é requisito pelo SUS.");
      contra.push("Pelo SUS, medicamento fora da lista oficial segue requisitos rígidos do STF (Tema 6), e a prova é de quem pede.");
    }
    if (a.via === "Plano de saúde") contra.push("Planos em regra não são obrigados a fornecer medicamento de uso domiciliar (art. 10, VI, da Lei 9.656), salvo exceções como antineoplásicos orais e casos que a jurisprudência reconhece. Se for aplicado em ambiente hospitalar ou ambulatorial, a análise muda.");
    if (a.indicacao === "Obesidade") contra.push("Para obesidade, os tribunais costumam ser mais restritivos que para diabetes. Ajuda muito comprovar comorbidades e tentativas anteriores.");
    if (a.indicacao === "Diabetes tipo 2") pro.push("A indicação para diabetes tipo 2 consta no registro do medicamento na Anvisa.");
    const score = pro.length - contra.length;
    return {
      headline: score >= 1 ? "Seu caso tem elementos favoráveis, mas precisa de documentação forte." : score >= -1 ? "É possível tentar, mas há pontos fracos que precisam ser resolvidos antes." : "Hoje as chances de liminar são baixas. Veja o que pode fortalecer o pedido.",
      tone: score >= 1 ? "good" : score >= -1 ? "near" : "info",
      items: [...pro.map((t) => `A favor: ${t}`), ...contra.map((t) => `Atenção: ${t}`), "Antes da ação, faça o pedido administrativo (ao plano ou à Secretaria de Saúde) e guarde a negativa: ela costuma ser exigida.", "Sem condições de pagar advogado, a Defensoria Pública atende gratuitamente."],
      lawyer: true,
      summary: `Saúde — liminar de medicamento. Via: ${a.via}; indicação: ${a.indicacao}; alternativas: ${a.alternativas}; laudo: ${a.laudo}; renda: ${a.renda}.`,
    };
  },
};

FAQ.push({
  id: "liminar-medicamento", area: "saude",
  all: [["liminar", "justiça", "justica", "processo", "ação", "acao", "fornecer", "pagar", "cobrir", "pedir", "mounjaro", "monjaro", "ozempic", "wegovy", "canabidiol"], MEDICAMENTOS],
  q: "Consigo uma liminar para receber um medicamento (como Mounjaro ou Ozempic)?",
  a: [
    "É possível, mas não é automático. A Justiça analisa principalmente três coisas: se o medicamento é imprescindível para você, se as alternativas disponíveis não funcionaram e quem deve fornecer (plano de saúde ou SUS).",
    "Pelo plano de saúde: em regra, o plano não é obrigado a fornecer remédio de uso em casa. Medicamentos como Mounjaro e Ozempic, aplicados pelo próprio paciente, costumam ser negados, e os tribunais frequentemente confirmam a negativa. Há exceções analisadas caso a caso.",
    "Pelo SUS: para remédio fora da lista oficial, o STF fixou requisitos rígidos (Tema 6): registro na Anvisa, laudo que comprove a necessidade, falta de alternativa eficaz no SUS e incapacidade de pagar.",
    "Para obesidade, as decisões tendem a ser mais restritivas que para diabetes tipo 2. Um laudo completo e a prova de tratamentos anteriores fazem muita diferença.",
  ],
  tips: ["Peça primeiro ao plano ou à Secretaria de Saúde e guarde a negativa por escrito.", "O laudo deve citar o diagnóstico, os tratamentos já feitos, por que eles falharam e o risco de não usar o medicamento.", "Guarde exames que mostrem a evolução (glicada, peso, comorbidades)."],
  sources: [["Lei 9.656/1998, art. 10, VI", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"], ["STF — Tema 6 e Tema 1.234", "https://portal.stf.jus.br/jurisprudenciaRepercussao/"], ["Anvisa — consulta de registro", "https://consultas.anvisa.gov.br/"]],
  next: "Quer avaliar as chances no seu caso?", followUp: LIMINAR_MED_FU,
});
