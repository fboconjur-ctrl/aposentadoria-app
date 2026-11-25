// Leitor de documentos mais esperto: reconhece muitos tipos (judiciais, INSS, trânsito, protesto, cobrança,
// banco, aluguel, trabalho) e, em qualquer documento, separa o que importa: prazos, audiência, valores e
// o que o documento pede de você. Tudo no navegador; nada é enviado. Prazos são as regras gerais.
(() => {
  const N = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ");
  const T = (t) => String(t || "").replace(/\s+/g, " ");
  const conta = (n, re) => (n.match(re) || []).length;
  const JUD = /sentenca|juiz|juiza|vistos|tribunal de justica|tribunal regional|\bvara\b|juizado|acordao|desembargador|\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g;
  const ehJuizado = (n) => /juizado|turma recursal|lei 9\.099/.test(n);
  const proc = (t) => t.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/)?.[0];
  const dataBR = (d) => (d ? d.toLocaleDateString("pt-BR") : "não identificada");
  const ultima = (t) => latest(datesIn(t));
  const res = (kind, facts, items, summary, headline) => ({ facts: [["Tipo de documento", kind], ...facts], headline: headline || `Documento reconhecido: ${kind}.`, tone: "near", items, summary });

  // Pontuação dos leitores que já existiam (para escolher o leitor certo).
  DOC_READERS.previdenciario.score = (n) => conta(n, /\binss\b|previdencia|seguro social|segurado|aposentadoria|auxilio|beneficio|\bnb\b|cnis/g) + (/indefer/.test(n) ? 3 : 0);
  DOC_READERS.saude.score = (n) => conta(n, /plano de saude|operadora|\bans\b|beneficiario|rol |cobertura|procedimento|carencia/g) + (/negativa|nao autoriz/.test(n) ? 2 : 0);
  DOC_READERS.administrativo.score = (n) => conta(n, /processo administrativo|disciplinar|\bpad\b|sindicancia|comissao|auto de infracao|tribunal de contas|licitac|servidor/g);
  DOC_READERS.judicial.score = (n) => conta(n, JUD) * 2;

  Object.assign(DOC_READERS, {
    citacao: {
      score: (n) => (/(mandado|carta) de citacao|fica (o reu |a re |)citad|cite-se|citacao do reu/.test(n) && conta(n, JUD) ? 12 : 0),
      analyze(text) {
        const t = T(text), n = N(text);
        if (!/citacao|citad|cite-se/.test(n)) return null;
        const jz = ehJuizado(n), items = [];
        if (jz) items.push("Nos Juizados, a citação chama para a audiência de conciliação. Se o réu faltar, presumem-se verdadeiros os fatos alegados (revelia — Lei 9.099/1995, art. 20). A defesa costuma ser apresentada até a audiência de instrução.");
        else items.push("Na Justiça comum, a contestação é de 15 dias úteis, contados em regra da audiência de conciliação ou, se não houver, da juntada do comprovante de citação (CPC, art. 335). Sem defesa no prazo, os fatos podem ser presumidos verdadeiros.");
        items.push("Procure um advogado logo: a defesa precisa reunir documentos e, às vezes, testemunhas.");
        return res("Citação em processo judicial", [["Número do processo", proc(t) || "não identificado"], ["Data mais recente", dataBR(ultima(t))]], items, `Citação judicial; processo ${proc(t) || "?"}; ${jz ? "Juizado" : "Justiça comum"}.`, "Você foi citado(a) em um processo: há prazo para se defender.");
      },
    },
    cumprimento: {
      score: (n) => (/cumprimento de sentenca|art\.? ?523|execucao de titulo|art\.? ?829|penhora/.test(n) ? 11 : 0),
      analyze(text) {
        const t = T(text), n = N(text), items = [];
        if (/cumprimento de sentenca|523/.test(n)) items.push("Cumprimento de sentença: quem foi condenado é intimado para pagar em 15 dias úteis; se não pagar, o valor sobe 10% de multa e 10% de honorários (CPC, art. 523). Depois desse prazo, abre-se outro de 15 dias úteis para a impugnação (art. 525).");
        if (/execucao de titulo|829/.test(n)) items.push("Execução de título extrajudicial (cheque, nota promissória, contrato): o devedor é citado para pagar em 3 dias (CPC, art. 829), e tem 15 dias úteis para os embargos à execução (art. 915).");
        if (/penhora/.test(n)) items.push("Há menção a penhora. Alguns bens e valores são impenhoráveis, como salário e poupança até 40 salários mínimos, com exceções (CPC, art. 833).");
        if (!items.length) return null;
        items.push("Confira o valor cobrado e os cálculos antes de pagar: podem existir erros de juros e correção.");
        const valor = t.match(/R\$ ?\d[\d.]*,\d{2}/)?.[0];
        return res("Cobrança judicial (cumprimento ou execução)", [["Número do processo", proc(t) || "não identificado"], ["Valor citado", valor || "não identificado"]], items, `Cobrança judicial; processo ${proc(t) || "?"}; valor ${valor || "?"}.`, "Cobrança na Justiça: há prazos curtos para pagar ou se defender.");
      },
    },
    inssConcessao: {
      score: (n) => (/carta de concessao|concedido o beneficio|beneficio concedido|renda mensal inicial|\brmi\b/.test(n) ? 10 : 0),
      analyze(text) {
        const t = T(text), n = N(text);
        if (!/concess|concedid|renda mensal/.test(n)) return null;
        const rmi = t.match(/renda mensal inicial[^R]{0,40}(R\$ ?\d[\d.]*,\d{2})/i)?.[1] || t.match(/R\$ ?\d[\d.]*,\d{2}/)?.[0];
        const dib = t.match(/(?:DIB|data de in[ií]cio do benef[ií]cio)[^\d]{0,20}(\d{2}\/\d{2}\/\d{4})/i)?.[1];
        return res("Carta de concessão do INSS", [["Valor (renda inicial)", rmi || "não identificado"], ["Início do benefício (DIB)", dib || "não identificado"]],
          ["Guarde esta carta: ela mostra como o valor foi calculado.", "Se achar que o valor ficou baixo, ainda dá para pedir revisão: o prazo é de 10 anos, contado do mês seguinte ao primeiro pagamento (Lei 8.213/1991, art. 103).", "Compare os salários usados no cálculo com o seu CNIS: períodos faltando reduzem o valor."],
          `Carta de concessão INSS; RMI ${rmi || "?"}; DIB ${dib || "?"}.`, "Benefício concedido. Confira se o valor está certo.");
      },
    },
    inssExigencia: {
      score: (n) => (/\binss\b|meu inss/.test(n) && /exigencia|cumprir a exigencia|apresentar os documentos/.test(n) ? 10 : 0),
      analyze(text) {
        const t = T(text);
        const prazo = t.match(/prazo de (\d{1,3}) ?(?:\([^)]*\))? ?dias/i)?.[1];
        return res("Exigência do INSS", [["Prazo indicado", prazo ? `${prazo} dias` : "veja na carta"], ["Data mais recente", dataBR(ultima(t))]],
          ["O INSS está pedindo documentos para continuar a análise. Se o prazo passar sem resposta, o pedido pode ser negado.", "Envie pelo Meu INSS (Consultar pedidos → Cumprir exigência) e guarde o comprovante.", "Se não tiver algum documento, explique por escrito e peça mais prazo dentro do próprio prazo."],
          `Exigência INSS; prazo ${prazo || "?"} dias.`, prazo ? `O INSS deu prazo de ${prazo} dias para você responder.` : "O INSS está pedindo documentos.");
      },
    },
    transito: {
      score: (n) => (/notificacao de (autuacao|penalidade)|auto de infracao de transito|detran|\bjari\b|indicacao (do|de) condutor|codigo de transito|\bctb\b/.test(n) ? 10 : 0),
      analyze(text) {
        const t = T(text), n = N(text);
        const pen = /notificacao de penalidade|penalidade de multa/.test(n);
        const limite = t.match(/(?:data limite|at[eé] (?:o dia )?|prazo final)[^\d]{0,90}(\d{2}\/\d{2}\/\d{4})/i)?.[1];
        const items = pen
          ? ["Notificação de penalidade: a multa já foi aplicada. Você pode recorrer à JARI até a data indicada na notificação; depois, ao Cetran (CTB, arts. 285 e 288).", "Pagar a multa não impede o recurso; se ganhar, o valor é devolvido."]
          : ["Notificação de autuação: ainda dá para apresentar defesa prévia até a data indicada, e indicar o condutor se não era você dirigindo (CTB, arts. 257 e 281).", "Confira placa, local, data, hora e o enquadramento: erros podem anular a autuação."];
        if (/suspensao do direito de dirigir|cassacao/.test(n)) items.push("Há processo de suspensão ou cassação da CNH: a defesa é independente da multa e tem prazos próprios.");
        return res(pen ? "Notificação de penalidade de trânsito" : "Notificação de autuação de trânsito", [["Data limite indicada", limite || "veja no documento"], ["Data mais recente", dataBR(ultima(t))]], items, `Trânsito: ${pen ? "penalidade" : "autuação"}; limite ${limite || "?"}.`, limite ? `Prazo para defesa ou recurso: até ${limite}.` : null);
      },
    },
    protesto: {
      score: (n) => (/tabelionato de protesto|intimacao de protesto|cartorio de protesto|protesto de titulo/.test(n) ? 11 : 0),
      analyze(text) {
        const t = T(text);
        const valor = t.match(/R\$ ?\d[\d.]*,\d{2}/)?.[0];
        return res("Intimação de protesto", [["Valor", valor || "não identificado"], ["Data mais recente", dataBR(ultima(t))]],
          ["O cartório dá, em regra, 3 dias úteis da intimação para pagar ou resolver antes do protesto ser lavrado (Lei 9.492/1997, art. 12).", "Se a dívida não é sua, já foi paga ou está errada, é possível pedir na Justiça a sustação do protesto com urgência.", "Se o protesto for feito e você pagar depois, peça a carta de anuência ao credor para cancelar no cartório."],
          `Intimação de protesto; valor ${valor || "?"}.`, "Prazo curto: em regra, 3 dias úteis para pagar ou contestar.");
      },
    },
    negativacao: {
      score: (n) => (/serasa|\bspc\b|boa vista|scpc/.test(n) && /inclusao|registro|negativ|comunicad/.test(n) ? 9 : 0),
      analyze(text) {
        const t = T(text);
        const valor = t.match(/R\$ ?\d[\d.]*,\d{2}/)?.[0];
        return res("Aviso de negativação", [["Valor", valor || "não identificado"], ["Data mais recente", dataBR(ultima(t))]],
          ["A inclusão do nome nos cadastros de devedores deve ser comunicada antes, por escrito (CDC, art. 43, §2º).", "Se a dívida não é sua, já foi paga ou tem mais de 5 anos, conteste com o credor e com o próprio cadastro, e guarde os protocolos.", "Negativação indevida pode gerar indenização; negativação de dívida real, em regra, não."],
          `Aviso de negativação; valor ${valor || "?"}.`);
      },
    },
    buscaApreensao: {
      score: (n) => (/busca e apreensao|alienacao fiduciaria|decreto-lei 911|dl 911/.test(n) ? 11 : 0),
      analyze(text) {
        const t = T(text);
        return res("Busca e apreensão (veículo financiado)", [["Número do processo", proc(t) || "não identificado"], ["Data mais recente", dataBR(ultima(t))]],
          ["Depois que o bem é apreendido, o devedor tem 5 dias para pagar a dívida em aberto e recuperar o bem livre (Decreto-Lei 911/1969, art. 3º, §2º).", "A defesa (contestação) é de 15 dias após a apreensão (art. 3º, §3º).", "Confira se houve notificação de atraso antes da ação: ela é obrigatória."],
          `Busca e apreensão; processo ${proc(t) || "?"}.`, "Prazos curtos: 5 dias para pagar após a apreensão.");
      },
    },
    despejo: {
      score: (n) => (/despejo|desocupacao do imovel|denuncia (vazia|da locacao)|lei 8\.245|locat[aá]rio|locador/.test(n) ? 9 : 0),
      analyze(text) {
        const t = T(text), n = N(text), items = [];
        if (/acao de despejo|liminar/.test(n) && /juiz|vara|processo|\d{7}-/.test(n)) items.push("Ação de despejo: em alguns casos, o juiz pode dar liminar para desocupar em 15 dias (Lei 8.245/1991, art. 59, §1º).");
        if (/falta de pagamento|aluguel(is)? (em atraso|atrasad)|debito/.test(n)) items.push("Despejo por falta de pagamento: dá para evitar a saída pagando todo o débito atualizado em 15 dias da citação (purga da mora, Lei 8.245/1991, art. 62, II).");
        if (/notificacao|denuncia/.test(n) && !items.length) items.push("Notificação para desocupar: em contrato por prazo indeterminado, a lei dá em regra 30 dias para a saída (Lei 8.245/1991, arts. 46, §2º, e 57).");
        if (!items.length) items.push("Confira o contrato, os recibos e a data de vencimento. Guarde tudo por escrito.");
        return res("Documento de locação / despejo", [["Número do processo", proc(t) || "não se aplica ou não identificado"], ["Data mais recente", dataBR(ultima(t))]], items, `Locação/despejo; processo ${proc(t) || "?"}.`);
      },
    },
    cobranca: {
      score: (n) => (/notificacao extrajudicial|cobranca|debito em aberto|divida|acordo para quitacao/.test(n) && !conta(n, JUD) ? 6 : 0),
      analyze(text) {
        const t = T(text);
        const valor = t.match(/R\$ ?\d[\d.]*,\d{2}/)?.[0];
        return res("Cobrança extrajudicial", [["Valor", valor || "não identificado"], ["Data mais recente", dataBR(ultima(t))]],
          ["Antes de pagar, confira se a dívida é sua, se o valor está certo e se não está prescrita (em regra, 5 anos para dívidas de contrato, Código Civil, art. 206, §5º, I).", "Cobrança de valor que você não deve, se paga, deve ser devolvida em dobro (CDC, art. 42, parágrafo único).", "A cobrança não pode expor você ao ridículo nem ameaçar (CDC, art. 42)."],
          `Cobrança extrajudicial; valor ${valor || "?"}.`);
      },
    },
    trabalho: {
      score: (n) => (/termo de rescisao|trct|aviso previo|verbas rescisorias|\bclt\b|ctps/.test(n) ? 9 : 0),
      analyze(text) {
        const t = T(text);
        return res("Documento trabalhista", [["Data mais recente", dataBR(ultima(t))], ["Valores citados", (t.match(/R\$ ?\d[\d.]*,\d{2}/g) || []).slice(0, 3).join(" · ") || "não identificados"]],
          ["Na rescisão, as verbas devem ser pagas em até 10 dias do fim do contrato (CLT, art. 477, §6º). Atraso gera multa de um salário.", "Confira saldo de salário, férias + 1/3, 13º proporcional, aviso prévio e FGTS com a multa de 40% (na dispensa sem justa causa).", "Você tem até 2 anos depois de sair para entrar com ação, cobrando os últimos 5 anos (Constituição, art. 7º, XXIX)."],
          "Documento trabalhista.");
      },
    },
  });

  // ---------- Extração geral: vale para qualquer documento ----------
  function extras(text) {
    const t = T(text);
    const achados = [];
    const aud = t.match(/audi[eê]ncia[^.]{0,120}?(\d{2}\/\d{2}\/\d{4})[^.]{0,40}?(\d{1,2}[:h]\d{2})?/i);
    if (aud) achados.push(`Audiência: <b>${aud[1]}${aud[2] ? " às " + aud[2].replace("h", ":") : ""}</b>. Anote na agenda e confirme se é presencial ou por vídeo.`);
    const prazos = [...new Set([...t.matchAll(/prazo (?:de|m[aá]ximo de) (\d{1,3}) ?(?:\([^)]*\))? ?(dias? [úu]teis|dias|horas)/gi)].map((m) => `${+m[1]} ${m[2].toLowerCase()}`))].slice(0, 3);
    if (prazos.length) achados.push(`Prazo(s) citado(s) no documento: <b>${prazos.join(", ")}</b>. Descubra a partir de quando cada um conta (em geral, da intimação ou do recebimento).`);
    const t2 = t.replace(/(\d)\.(\d)/g, "$1·$2");
    const pede = (t2.match(/[^.]{0,160}\b(dever[aá]|fica (?:intimad|notificad|citad)\w*|comparecer|apresentar|efetuar o pagamento|pagar|regularizar)\b[^.]{0,160}\./gi) || [])
      .map((x) => x.trim().replace(/·/g, ".")).filter((x) => x.length < 320).slice(0, 2);
    pede.forEach((x) => achados.push(`O documento pede: “${x.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, "***")}”`));
    return achados;
  }
  window.extrasDocumento = extras;

  // Escolhe o leitor pela pontuação; se o melhor não reconhecer, tenta o próximo.
  window.escolherLeitor = function (text) {
    const n = N(text);
    const ordem = Object.entries(DOC_READERS).map(([k, r]) => [k, r.score ? r.score(n) : 0]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]);
    for (const [key] of ordem) { const r = DOC_READERS[key].analyze(text || ""); if (r) return { key, r }; }
    return null;
  };
})();
