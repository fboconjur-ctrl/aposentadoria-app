// Continuações (perguntas que avaliam o caso) ligadas a respostas existentes.
// Parâmetros que mudam no tempo ficam aqui, num lugar só.
const PARAMS = {
  salarioMinimo: 1518, // [VALIDAR/ATUALIZAR] valor usado nos cálculos; aparece na tela para transparência
};
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmt = (d) => d.toLocaleDateString("pt-BR");
function attach(id, fu) { const f = FAQ.find((x) => x.id === id); if (f) f.followUp = fu; }

/* ---------- BPC/LOAS ---------- */
attach("bpc-renda", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "4 perguntas.",
  questions: [
    { id: "quem", q: "O pedido é para:", a: ["Pessoa com 65 anos ou mais", "Pessoa com deficiência"] },
    { id: "pessoas", q: "Quantas pessoas moram na casa (contando você)?", input: "number" },
    { id: "renda", q: "Somando todas as rendas da casa, quanto entra por mês (R$)? Não conte Bolsa Família nem outro BPC de idoso ou deficiente.", input: "number" },
    { id: "cad", q: "O CadÚnico está atualizado (últimos 2 anos)?", a: ["Sim", "Não", "Não sei"] },
  ],
  evaluate(a) {
    const sm = PARAMS.salarioMinimo, items = [];
    if (!a.pessoas || a.renda === null) return { headline: "Sem a renda e o número de pessoas, não dá para calcular.", tone: "info", items: ["O critério principal é renda por pessoa de até 1/4 do salário mínimo."], lawyer: false, summary: "BPC: dados incompletos." };
    const pc = a.renda / a.pessoas;
    let headline, tone;
    if (pc <= sm / 4) { headline = `Renda por pessoa de ${brl(pc)}: dentro do limite de 1/4 do salário mínimo (${brl(sm / 4)}).`; tone = "good"; }
    else if (pc <= sm / 2) { headline = `Renda por pessoa de ${brl(pc)}: acima de 1/4, mas até 1/2 salário mínimo. Ainda é possível, com prova de vulnerabilidade.`; tone = "near";
      items.push("A lei e o STF admitem avaliar outros sinais de vulnerabilidade: gastos com remédios, fraldas, tratamentos e alimentação especial podem ser considerados."); }
    else { headline = `Renda por pessoa de ${brl(pc)}: acima de 1/2 salário mínimo. O BPC tende a ser negado.`; tone = "info";
      items.push("Confira se a composição da família está certa: só entram cônjuge, pais, irmãos solteiros, filhos e enteados solteiros que moram na mesma casa."); }
    items.push("Não entram no cálculo: outro BPC ou aposentadoria de 1 salário mínimo de idoso ou pessoa com deficiência da família, e o Bolsa Família. [VALIDAR]");
    if (a.cad !== "Sim") items.push("Atualize o CadÚnico no CRAS antes de pedir: sem isso, o pedido é negado.");
    if (a.quem === "Pessoa com deficiência") items.push("Haverá perícia médica e avaliação social sobre as barreiras que a deficiência causa.");
    items.push(`Cálculo feito com salário mínimo de ${brl(sm)}.`);
    return { headline, tone, items, lawyer: tone !== "good", summary: `BPC: ${a.quem}; ${a.pessoas} pessoas; renda ${brl(a.renda)}; por pessoa ${brl(pc)}; CadÚnico ${a.cad}.` };
  },
});

/* ---------- Pensão por morte ---------- */
attach("pensao-duracao", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "Para cônjuge ou companheiro(a). 5 perguntas.",
  questions: [
    { id: "obito", q: "Data do falecimento:", input: "date" },
    { id: "idade", q: "Sua idade na data do falecimento:", input: "number" },
    { id: "uniao", q: "Vocês estavam casados ou em união estável havia pelo menos 2 anos?", a: ["Sim", "Não", "Não sei"] },
    { id: "contrib", q: "A pessoa tinha pelo menos 18 contribuições ao INSS (ou era aposentada)?", a: ["Sim", "Não", "Não sei"] },
    { id: "prova", q: "(União estável) Você tem documentos que provam a união?", a: ["Sim, vários", "Poucos", "Não", "Era casamento"] },
  ],
  evaluate(a) {
    const items = [];
    let dur;
    if (a.uniao === "Não" || a.contrib === "Não") dur = "4 meses";
    else if (a.idade == null) dur = null;
    else dur = a.idade < 22 ? "3 anos" : a.idade < 28 ? "6 anos" : a.idade < 31 ? "10 anos" : a.idade < 42 ? "15 anos" : a.idade < 45 ? "20 anos" : "vitalícia";
    const headline = dur ? `Pela sua resposta, a pensão seria ${dur === "vitalícia" ? "vitalícia" : "paga por " + dur}.` : "Informe sua idade para estimar a duração.";
    if (a.uniao === "Não" || a.contrib === "Não") items.push("Com menos de 2 anos de união ou menos de 18 contribuições, a pensão dura 4 meses. Exceção: se o óbito decorreu de acidente ou doença do trabalho, valem as faixas por idade.");
    else items.push("Faixas por idade: menos de 22 anos, 3 anos; 22 a 27, 6 anos; 28 a 30, 10 anos; 31 a 41, 15 anos; 42 a 44, 20 anos; 45 ou mais, vitalícia. [VALIDAR faixas vigentes]");
    if (a.obito) {
      const lim = addDays(a.obito, 90), left = daysLeft(lim);
      items.push(left >= 0 ? `Peça até ${fmt(lim)} (90 dias do óbito) para receber desde a data do falecimento. Restam ${left} dias.` : `Os 90 dias terminaram em ${fmt(lim)}: o benefício será pago a partir da data do pedido. Peça o quanto antes.`);
    }
    if (a.prova === "Poucos" || a.prova === "Não") items.push("A união estável precisa de início de prova documental: conta conjunta, mesmo endereço, plano de saúde, filhos em comum, declaração de IR. Sem documentos, o INSS costuma negar.");
    items.push("O valor é de 50% mais 10% por dependente, até 100%, calculado sobre a aposentadoria que a pessoa recebia ou teria direito.");
    return { headline, tone: dur === "vitalícia" ? "good" : "near", items, lawyer: a.prova === "Poucos" || a.prova === "Não" || a.uniao !== "Sim",
      summary: `Pensão: óbito ${a.obito ? fmt(a.obito) : "?"}; idade ${a.idade ?? "?"}; união ≥2 anos ${a.uniao}; 18 contrib ${a.contrib}; prova ${a.prova}; duração estimada ${dur || "?"}.` };
  },
});

/* ---------- Salário-maternidade ---------- */
attach("salario-maternidade", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "4 perguntas.",
  questions: [
    { id: "tipo", q: "Na época do parto (ou adoção), você era:", a: ["Empregada com carteira", "Desempregada", "MEI / autônoma / facultativa", "Trabalhadora rural"] },
    { id: "parto", q: "Data do parto ou da adoção:", input: "date" },
    { id: "ultima", q: "Data da sua última contribuição ou do fim do último emprego:", input: "date" },
    { id: "pediu", q: "Você já pediu o benefício?", a: ["Não", "Sim, e foi negado", "Sim, está em análise"] },
  ],
  evaluate(a) {
    const items = [];
    let headline = "Veja como pedir.", tone = "good";
    if (a.parto) {
      const lim = new Date(a.parto); lim.setFullYear(lim.getFullYear() + 5);
      items.push(daysLeft(lim) >= 0 ? `Você pode pedir até ${fmt(lim)} (5 anos do parto).` : `O prazo de 5 anos terminou em ${fmt(lim)}.`);
    }
    if (a.tipo === "Desempregada" && a.parto && a.ultima) {
      const meses = (a.parto.getFullYear() - a.ultima.getFullYear()) * 12 + a.parto.getMonth() - a.ultima.getMonth();
      if (meses <= 12) { headline = "O parto foi dentro do período de graça: você pode ter direito."; }
      else if (meses <= 24) { headline = "O parto ocorreu entre 12 e 24 meses após a última contribuição: pode ter direito se tiver mais de 120 contribuições ou comprovar desemprego."; tone = "near"; }
      else { headline = "O parto ocorreu mais de 24 meses após a última contribuição: o direito depende de situações específicas."; tone = "info"; }
      items.push("Desempregada pede direto pelo Meu INSS ou pelo 135.");
    }
    if (a.tipo === "Empregada com carteira") { headline = "Quem paga é a empresa, durante a licença de 120 dias."; items.push("Se a empresa não pagar ou você foi demitida durante a gravidez, há proteção: a gestante tem estabilidade desde a confirmação da gravidez até 5 meses após o parto."); }
    if (a.tipo === "Trabalhadora rural") items.push("Trabalhadora rural precisa comprovar 10 meses de atividade rural antes do parto, com documentos e autodeclaração.");
    if (a.tipo === "MEI / autônoma / facultativa") items.push("Para MEI, autônoma e facultativa, o STF afastou a exigência de 10 contribuições de carência. [VALIDAR aplicação atual pelo INSS]");
    if (a.pediu === "Sim, e foi negado") { items.push("Negado? Cabe recurso em 30 dias ou ação judicial. Envie a carta de indeferimento abaixo."); tone = "near"; }
    return { headline, tone, items, lawyer: a.pediu === "Sim, e foi negado" || tone !== "good",
      summary: `Salário-maternidade: ${a.tipo}; parto ${a.parto ? fmt(a.parto) : "?"}; última contribuição ${a.ultima ? fmt(a.ultima) : "?"}; pedido ${a.pediu}.` };
  },
});

/* ---------- Auxílio-acidente ---------- */
attach("auxilio-acidente", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "4 perguntas.",
  questions: [
    { id: "tipo", q: "Na época do acidente, você era:", a: ["Empregado(a) com carteira", "Empregado(a) doméstico(a)", "Autônomo / MEI / facultativo", "Trabalhador(a) rural", "Desempregado(a)"] },
    { id: "sequela", q: "Ficou com sequela permanente (perda de movimento, força, audição, visão, dor crônica)?", a: ["Sim", "Não", "Não sei"] },
    { id: "reduz", q: "A sequela dificulta o trabalho que você fazia na época?", a: ["Sim", "Não"] },
    { id: "auxdoenca", q: "Você recebeu auxílio-doença por causa do acidente?", a: ["Sim", "Não"] },
  ],
  evaluate(a) {
    const items = [];
    if (a.tipo === "Autônomo / MEI / facultativo") return { headline: "Autônomos, MEI e facultativos não têm direito ao auxílio-acidente pela lei atual.", tone: "info", lawyer: false, items: ["Se houver incapacidade, o caminho é o auxílio por incapacidade ou a aposentadoria por incapacidade."], summary: "Auxílio-acidente: contribuinte individual (sem direito)." };
    if (a.sequela === "Não" || a.reduz === "Não") return { headline: "Sem sequela que reduza a capacidade de trabalho, o benefício não é devido.", tone: "info", lawyer: false, items: ["Se a sequela apareceu depois ou piorou, vale nova avaliação médica."], summary: "Auxílio-acidente: sem redução de capacidade." };
    if (a.auxdoenca === "Sim") items.push("Como você recebeu auxílio-doença, o auxílio-acidente deveria começar no dia seguinte ao fim dele. Se o INSS não concedeu automaticamente, é possível pedir os atrasados (dos últimos 5 anos).");
    items.push("O benefício é de 50% do salário de benefício, pago junto com o salário, até a aposentadoria.");
    items.push("Documentos: laudos que descrevam a sequela e a limitação, boletim de ocorrência ou CAT, prontuário do atendimento.");
    if (a.tipo === "Desempregado(a)") items.push("Desempregado(a): o acidente precisa ter ocorrido no período de graça.");
    return { headline: "Pelo que você respondeu, você pode ter direito ao auxílio-acidente.", tone: "good", items, lawyer: true,
      summary: `Auxílio-acidente: ${a.tipo}; sequela ${a.sequela}; reduz capacidade ${a.reduz}; recebeu auxílio-doença ${a.auxdoenca}.` };
  },
});

/* ---------- Aposentadoria especial ---------- */
attach("especial-ppp", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "4 perguntas.",
  questions: [
    { id: "agente", q: "A que você ficava exposto(a)?", a: ["Ruído", "Produtos químicos", "Agentes biológicos (saúde, lixo)", "Eletricidade", "Vigilância armada", "Outro / não sei"] },
    { id: "antes", q: "Esses períodos foram antes de 13/11/2019?", a: ["Todos", "Parte", "Todos depois"] },
    { id: "anos", q: "Quantos anos de atividade especial, aproximadamente?", input: "number" },
    { id: "ppp", q: "Você tem o PPP das empresas?", a: ["Sim, de todas", "De algumas", "Não", "A empresa fechou"] },
  ],
  evaluate(a) {
    const items = [];
    const anos = a.anos || 0;
    if (a.antes !== "Todos depois" && anos) items.push(`Convertendo para tempo comum (até 13/11/2019), ${anos} anos especiais podem virar cerca de ${(anos * 1.4).toFixed(1)} anos (homem) ou ${(anos * 1.2).toFixed(1)} anos (mulher).`);
    if (anos >= 25) items.push("Com 25 anos de atividade especial, você pode ter direito à aposentadoria especial. Quem já cumpria antes da Reforma não precisa de idade mínima.");
    if (a.agente === "Ruído") items.push("Para ruído, os limites mudaram ao longo do tempo (80 dB até 1997, 90 dB até 2003 e 85 dB depois). O PPP deve indicar o nível e a técnica de medição.");
    if (a.agente === "Vigilância armada") items.push("Vigilância pode ser reconhecida como especial pela periculosidade, conforme o STJ (Tema 1.031), com prova da exposição ao risco.");
    if (a.agente === "Eletricidade") items.push("Eletricidade acima de 250 volts pode ser reconhecida como especial mesmo após 1997, segundo a jurisprudência.");
    if (a.ppp !== "Sim, de todas") items.push(a.ppp === "A empresa fechou" ? "Empresa fechada: é possível usar laudos de empresas semelhantes, prova testemunhal ou perícia judicial." : "Peça o PPP por escrito ao RH de cada empresa: é obrigação delas fornecer.");
    items.push("O uso de EPI eficaz pode afastar o tempo especial, exceto para ruído (STF, Tema 555).");
    return { headline: anos ? `Seus ${anos} anos especiais podem antecipar ou aumentar sua aposentadoria.` : "Períodos especiais podem antecipar ou aumentar sua aposentadoria.", tone: "good", items, lawyer: true,
      summary: `Especial: ${a.agente}; períodos ${a.antes}; ${anos} anos; PPP ${a.ppp}.` };
  },
});

/* ---------- Consumidor: negativação ---------- */
attach("negativado", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "4 perguntas.",
  questions: [
    { id: "divida", q: "A dívida existe?", a: ["Não reconheço", "Já paguei", "Existe, mas o valor está errado", "Existe e está em aberto"] },
    { id: "aviso", q: "Você recebeu aviso por escrito antes da negativação?", a: ["Sim", "Não", "Não sei"] },
    { id: "outras", q: "Seu nome tem outras negativações?", a: ["Não", "Sim", "Não sei"] },
    { id: "pagamento", q: "(Se pagou) Quando foi o pagamento?", input: "date" },
  ],
  evaluate(a) {
    const items = [];
    let strong = false;
    if (a.divida === "Não reconheço") { strong = true; items.push("Dívida que você não contraiu: a empresa responde pela negativação indevida, inclusive se foi fraude de terceiros."); }
    if (a.divida === "Já paguei" && a.pagamento) {
      const lim = addBusinessDays(a.pagamento, 5);
      items.push(daysLeft(lim) < 0 ? `Pago em ${fmt(a.pagamento)}: a baixa deveria ter ocorrido até ${fmt(lim)} (5 dias úteis). A demora é irregular.` : `A empresa tem até ${fmt(lim)} para retirar seu nome (5 dias úteis do pagamento).`);
      strong = daysLeft(lim) < 0;
    }
    if (a.aviso === "Não") items.push("Sem comunicação prévia por escrito, a negativação é irregular. Quem deve avisar é o órgão de proteção ao crédito (Serasa, SPC).");
    if (a.outras === "Sim") { items.push("Atenção: com outra negativação legítima anterior, o STJ entende que não cabe dano moral (Súmula 385), mas você pode exigir a retirada da indevida."); strong = false; }
    items.push("Consulte seu CPF gratuitamente no Serasa, SPC e Boa Vista e guarde o print com data.");
    return { headline: strong ? "Seu caso tem elementos fortes para retirada do nome e indenização." : a.divida === "Existe e está em aberto" ? "A negativação de dívida existente é permitida, mas você pode negociar e questionar abusos." : "Você pode exigir a correção; a indenização depende dos detalhes.",
      tone: strong ? "good" : "near", items, lawyer: strong, summary: `Negativação: dívida ${a.divida}; aviso ${a.aviso}; outras ${a.outras}; pagamento ${a.pagamento ? fmt(a.pagamento) : "-"}.` };
  },
});

/* ---------- Consumidor: defeito e arrependimento ---------- */
attach("defeito", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "3 perguntas.",
  questions: [
    { id: "duravel", q: "O produto é:", a: ["Durável (eletrônico, móvel, veículo, roupa)", "Não durável (alimento, cosmético)"] },
    { id: "surgiu", q: "Quando o defeito apareceu (ou quando recebeu o produto, se já veio com defeito)?", input: "date" },
    { id: "assist", q: "Quando entregou para conserto (se entregou)?", input: "date" },
  ],
  evaluate(a) {
    const items = [];
    const prazo = a.duravel.startsWith("Durável") ? 90 : 30;
    let headline = `Você tem ${prazo} dias para reclamar.`, tone = "good";
    if (a.surgiu) { const d = deadlineText(addDays(a.surgiu, prazo)); headline = `Prazo para reclamar: ${d.text}`; tone = d.tone; }
    items.push("Reclamar por escrito à loja ou ao fabricante suspende o prazo até a resposta. Guarde o protocolo.");
    if (a.assist) {
      const lim = addDays(a.assist, 30), left = daysLeft(lim);
      items.push(left < 0 ? `Já se passaram mais de 30 dias desde ${fmt(a.assist)}: você pode exigir agora troca, dinheiro de volta ou abatimento.` : `A assistência tem até ${fmt(lim)} para consertar (${left} dias). Depois disso, você escolhe: troca, dinheiro de volta ou abatimento.`);
      if (left < 0) tone = "good";
    }
    items.push("Garantia do fabricante soma-se ao prazo legal: ela não o substitui.");
    return { headline, tone, items, lawyer: false, summary: `Defeito: ${a.duravel}; surgiu ${a.surgiu ? fmt(a.surgiu) : "?"}; assistência ${a.assist ? fmt(a.assist) : "-"}.` };
  },
});
attach("arrependimento", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "Informe quando recebeu o produto (ou assinou o contrato).",
  questions: [{ id: "data", q: "Data de recebimento ou de assinatura:", input: "date" }],
  evaluate(a) {
    if (!a.data) return { headline: "O prazo é de 7 dias do recebimento ou da assinatura.", tone: "info", items: [], lawyer: false, summary: "Arrependimento: data não informada." };
    const d = deadlineText(addDays(a.data, 7));
    return { headline: `Direito de arrependimento: ${d.text}`, tone: d.tone, lawyer: false,
      items: ["Comunique a desistência por escrito (e-mail, chat ou formulário da loja) e guarde o comprovante. Basta a comunicação dentro do prazo.", "A loja deve devolver tudo, inclusive o frete, e não pode cobrar a devolução.", "Pagou com cartão? Peça também o estorno à administradora se a loja não devolver."],
      summary: `Arrependimento: recebimento ${fmt(a.data)}.` };
  },
});

/* ---------- Administrativo: concurso e multa ---------- */
attach("concurso-vagas", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "3 perguntas.",
  questions: [
    { id: "posicao", q: "Sua classificação está:", a: ["Dentro do número de vagas do edital", "No cadastro reserva", "Não sei"] },
    { id: "validade", q: "Quando termina a validade do concurso (com a prorrogação, se houver)?", input: "date" },
    { id: "fatos", q: "Aconteceu alguma destas situações?", a: ["Nomearam alguém atrás de mim", "Contrataram temporários ou terceirizados para a mesma função", "Abriram novo concurso", "Nenhuma"] },
  ],
  evaluate(a) {
    const items = [];
    let strong = a.posicao === "Dentro do número de vagas do edital";
    if (a.fatos !== "Nenhuma") { strong = true; items.push("Isso pode configurar preterição: mesmo no cadastro reserva, o direito à nomeação pode surgir (STF, Tema 784)."); }
    let headline = strong ? "Você tem elementos para exigir a nomeação." : "No cadastro reserva, em regra há expectativa de direito. Acompanhe de perto.";
    let tone = strong ? "good" : "info";
    if (a.validade) {
      const left = daysLeft(a.validade);
      items.push(left >= 0 ? `A validade termina em ${fmt(a.validade)} (${left} dias). O pedido judicial costuma ser feito antes ou logo após o fim da validade.` : `A validade terminou em ${fmt(a.validade)}. Se você estava dentro das vagas, ainda é possível buscar a nomeação, mas atenção ao prazo.`);
      if (strong && left < 120) tone = "near";
    }
    items.push("Junte: edital, resultado final, publicações de nomeação, provas de contratação temporária ou terceirização para o mesmo cargo.");
    return { headline, tone, items, lawyer: strong, summary: `Concurso: ${a.posicao}; validade ${a.validade ? fmt(a.validade) : "?"}; fatos: ${a.fatos}.` };
  },
});
attach("multa-transito", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "3 perguntas com base na notificação.",
  questions: [
    { id: "fase", q: "Qual notificação você recebeu?", a: ["Notificação de autuação (1ª)", "Notificação de penalidade (2ª)", "Processo de suspensão da CNH"] },
    { id: "infracao", q: "Data da infração:", input: "date" },
    { id: "expedicao", q: "Data de expedição da notificação de autuação (consta no documento):", input: "date" },
  ],
  evaluate(a) {
    const items = [];
    let headline = "Confira o prazo de defesa impresso na notificação.", tone = "near";
    if (a.infracao && a.expedicao) {
      const dias = Math.round((a.expedicao - a.infracao) / DAY_MS);
      if (dias > 30) { headline = `A notificação de autuação foi expedida ${dias} dias após a infração: acima do limite de 30 dias. A autuação deve ser arquivada.`; tone = "good"; }
      else items.push(`A autuação foi expedida em ${dias} dias, dentro do limite de 30 dias.`);
    }
    if (a.fase === "Notificação de autuação (1ª)") items.push("Nesta fase: indique o condutor (se não era você) e apresente defesa prévia no prazo da notificação.");
    if (a.fase === "Notificação de penalidade (2ª)") items.push("Nesta fase: recurso à JARI no prazo da notificação. Depois, recurso ao Cetran.");
    if (a.fase === "Processo de suspensão da CNH") items.push("Na suspensão, há defesa e recursos próprios. Enquanto houver recurso pendente, a penalidade não é aplicada.");
    items.push("Confira também: placa, modelo e cor corretos; local e horário; e, em radar, a aferição do equipamento pelo Inmetro.");
    return { headline, tone, items, lawyer: a.fase === "Processo de suspensão da CNH", summary: `Trânsito: ${a.fase}; infração ${a.infracao ? fmt(a.infracao) : "?"}; expedição ${a.expedicao ? fmt(a.expedicao) : "?"}.` };
  },
});

/* ---------- Cartório: divórcio e usucapião ---------- */
attach("divorcio-cartorio", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "3 perguntas.",
  questions: [
    { id: "acordo", q: "Vocês estão de acordo com o divórcio e a divisão dos bens?", a: ["Sim", "Não", "Em parte"] },
    { id: "filhos", q: "Há filhos menores ou incapazes, ou gravidez?", a: ["Não", "Sim, e guarda e pensão já estão definidas na Justiça", "Sim, ainda sem definição"] },
    { id: "bens", q: "Há bens a dividir?", a: ["Sim", "Não"] },
  ],
  evaluate(a) {
    const items = [];
    let headline, tone;
    if (a.acordo !== "Sim") { headline = "Sem acordo total, o divórcio é judicial. Ele pode ser decretado logo, e a partilha discutida depois."; tone = "info"; }
    else if (a.filhos === "Sim, ainda sem definição") { headline = "Guarda, convivência e pensão precisam ser definidas na Justiça primeiro."; tone = "near"; items.push("Resolvidas essas questões, o divórcio em si pode ser concluído em cartório em algumas situações. [VALIDAR]"); }
    else { headline = "Seu divórcio pode ser feito em cartório, de forma rápida."; tone = "good"; }
    items.push("Advogado é obrigatório também no cartório. Um único advogado pode atender o casal.");
    if (a.bens === "Sim") items.push("Na partilha, pode haver imposto (ITCMD) se a divisão não for igual, e ITBI em alguns casos. Leve documentos dos bens.");
    items.push("Documentos: certidão de casamento atualizada, documentos pessoais, pacto antenupcial (se houver) e documentos dos bens.");
    return { headline, tone, items, lawyer: true, summary: `Divórcio: acordo ${a.acordo}; filhos ${a.filhos}; bens ${a.bens}.` };
  },
});
attach("usucapiao", {
  title: "Responda algumas perguntas e veja o que a lei diz sobre a sua situação",
  intro: "5 perguntas.",
  questions: [
    { id: "anos", q: "Há quantos anos você tem a posse do imóvel?", input: "number" },
    { id: "urbano", q: "O imóvel é:", a: ["Urbano", "Rural"] },
    { id: "area", q: "Tamanho aproximado (m² se urbano, hectares se rural):", input: "number" },
    { id: "moradia", q: "Você mora no imóvel (ou produz nele, se rural)?", a: ["Sim", "Não"] },
    { id: "outro", q: "Você é dono(a) de outro imóvel?", a: ["Não", "Sim"] },
  ],
  evaluate(a) {
    const anos = a.anos || 0, items = [];
    const opts = [];
    if (a.urbano === "Urbano" && a.area != null && a.area <= 250 && a.moradia === "Sim" && a.outro === "Não") opts.push(["Especial urbana", 5]);
    if (a.urbano === "Rural" && a.area != null && a.area <= 50 && a.moradia === "Sim" && a.outro === "Não") opts.push(["Especial rural", 5]);
    opts.push(["Extraordinária com moradia ou obras produtivas", 10]);
    opts.push(["Extraordinária", 15]);
    const ok = opts.filter(([n, t]) => (n !== "Extraordinária com moradia ou obras produtivas" || a.moradia === "Sim") && anos >= t);
    items.push(`Modalidades e prazos de posse: ${opts.map(([n, t]) => `${n} (${t} anos)`).join("; ")}. Com justo título e boa-fé (contrato, recibo), há a ordinária: 10 anos, ou 5 em casos específicos.`);
    items.push("A posse precisa ser contínua, sem oposição e como se fosse dono(a).");
    items.push("Pode ser feita em cartório (Registro de Imóveis), com advogado, ata notarial, planta e memorial descritivo.");
    return { headline: ok.length ? `Pelo tempo de posse informado, você pode se encaixar na usucapião ${ok[0][0].toLowerCase()}.` : "Pelo tempo informado, ainda não se completa o prazo de nenhuma modalidade.", tone: ok.length ? "good" : "info", items, lawyer: ok.length > 0,
      summary: `Usucapião: ${anos} anos; ${a.urbano}; área ${a.area ?? "?"}; moradia ${a.moradia}; outro imóvel ${a.outro}.` };
  },
});
