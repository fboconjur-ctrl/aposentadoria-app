// Leitores de documentos por área. Rodam no navegador: o arquivo não sai do aparelho.
// Cada leitor extrai fatos (datas, motivos, prazos) e devolve próximos passos. Resultado preliminar.

function datesIn(text) {
  return [...text.matchAll(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g)].map((m) => new Date(+m[3], +m[2] - 1, +m[1], 12)).filter((d) => d.getFullYear() > 1990 && d <= new Date());
}
function latest(dates) { return dates.length ? new Date(Math.max(...dates)) : null; }
function matchAll(text, rules) { return rules.filter((r) => r.re.test(text)); }

const DOC_READERS = {
  previdenciario: {
    title: "Recebeu carta de indeferimento? Envie que a gente lê",
    hint: "No Meu INSS: Consultar pedidos → detalhes → baixar a decisão (PDF).",
    analyze(text) {
      const t = text.replace(/\s+/g, " ");
      if (!/indefer|negad|não reconhec|nao reconhec/i.test(t)) return null;
      const beneficio = t.match(/(Aposentadoria[^.,;]{0,60}|Aux[ií]lio[^.,;]{0,40}|Benef[ií]cio de Presta[cç][aã]o Continuada[^.,;]{0,30}|Pens[aã]o por Morte|Sal[aá]rio[- ]Maternidade)/i)?.[0];
      const nb = t.match(/\b\d{3}\.?\d{3}\.?\d{3}-?\d\b/)?.[0];
      const motivos = matchAll(t, [
        { re: /car[eê]ncia/i, label: "Falta de carência", fix: "Confira no CNIS se há contribuições faltando ou abaixo do mínimo. Vínculos sem registro podem ser comprovados." },
        { re: /qualidade de segurad/i, label: "Perda da qualidade de segurado", fix: "Verifique o período de graça: 12 meses após a última contribuição, podendo chegar a 24 ou 36 meses (desemprego e mais de 120 contribuições)." },
        { re: /incapacidade|per[ií]cia|parecer m[eé]dico contr[aá]rio/i, label: "Perícia não reconheceu a incapacidade", fix: "Reúna laudos recentes com CID, limitações e tempo de afastamento. Avalie novo pedido ou ação com perícia judicial." },
        { re: /renda (mensal )?(familiar )?per capita|renda.*superior/i, label: "Renda familiar acima do limite (BPC)", fix: "Despesas com saúde e a composição correta do grupo familiar podem mudar o resultado." },
        { re: /tempo (m[ií]nimo )?de contribui[cç][aã]o/i, label: "Tempo de contribuição insuficiente", fix: "Verifique períodos que faltam no CNIS: atividade especial, rural, serviço militar, tempo de aluno-aprendiz ou de serviço público." },
        { re: /exig[eê]ncia|n[aã]o apresenta[cç][aã]o|documenta[cç][aã]o/i, label: "Exigência não cumprida ou falta de documentos", fix: "Um novo pedido com todos os documentos costuma ser o caminho mais rápido." },
        { re: /depend[eê]ncia|uni[aã]o est[aá]vel|companheir/i, label: "Dependência ou união estável não comprovada", fix: "É preciso início de prova documental: conta conjunta, endereço comum, plano de saúde, filhos em comum." },
        { re: /atividade especial|ppp|agente nocivo/i, label: "Atividade especial não reconhecida", fix: "Confira se o PPP indica o agente nocivo, a intensidade e o responsável técnico. Pode ser preciso o LTCAT." },
      ]);
      const ciencia = latest(datesIn(t));
      const items = motivos.map((m) => `${m.label}: ${m.fix}`);
      if (!items.length) items.push("Não identifiquei o motivo automaticamente. Ele aparece no campo “Motivo” ou “Fundamentação” da decisão.");
      let deadline = null;
      if (ciencia) { deadline = addDays(ciencia, 30); }
      const d = deadline ? deadlineText(deadline) : null;
      return {
        facts: [["Benefício", beneficio || "não identificado"], ["Número do benefício", nb || "não identificado"], ["Data mais recente no documento", ciencia ? ciencia.toLocaleDateString("pt-BR") : "não identificada"]],
        headline: d ? `Recurso ao CRPS: ${d.text}` : "Confira a data em que você tomou ciência da decisão.",
        tone: d ? d.tone : "info", items,
        note: "O prazo foi calculado pela data mais recente do documento. Se você tomou ciência depois, o prazo também termina depois.",
        summary: `Carta de indeferimento: ${beneficio || "benefício ?"}; motivos: ${motivos.map((m) => m.label).join("; ") || "não identificados"}; ciência aprox. ${ciencia ? ciencia.toLocaleDateString("pt-BR") : "?"}.`,
      };
    },
  },
  saude: {
    title: "Recebeu a negativa do plano? Envie que a gente lê",
    hint: "Pode ser o PDF ou o e-mail da operadora salvo em PDF.",
    analyze(text) {
      const t = text.replace(/\s+/g, " ");
      if (!/negad|indeferid|n[aã]o autoriza|recusa|sem cobertura|n[aã]o coberto/i.test(t)) return null;
      const tuss = t.match(/\b\d{8}\b/)?.[0];
      const motivos = matchAll(t, [
        { re: /\brol\b/i, label: "Fora do rol da ANS", fix: "Pela Lei 14.454/2022, a cobertura fora do rol é possível com comprovação científica ou recomendação de órgão técnico. Peça ao médico relatório com a literatura." },
        { re: /car[eê]ncia/i, label: "Carência", fix: "Em urgência e emergência, a carência máxima é de 24 horas. Confira as datas do contrato." },
        { re: /preexist|\bDLP\b|\bCPT\b/i, label: "Doença preexistente", fix: "Só vale se a doença foi declarada na contratação e por até 24 meses. Peça a declaração de saúde que você assinou." },
        { re: /contrat|exclu[ií]d|segmenta[cç][aã]o/i, label: "Exclusão contratual", fix: "Procedimentos do rol são obrigatórios para a segmentação do plano, mesmo que o contrato não os cite." },
        { re: /junta m[eé]dica|diverg[eê]ncia t[eé]cnica|auditoria/i, label: "Divergência técnica ou junta médica", fix: "A junta deve seguir as regras da ANS, com participação do seu médico e prazo definido. Peça o parecer por escrito." },
        { re: /home care|interna[cç][aã]o domiciliar/i, label: "Home care", fix: "Quando substitui a internação, a jurisprudência tende a exigir a cobertura. Peça ao médico relatório que mostre isso." },
      ]);
      const items = motivos.map((m) => `${m.label}: ${m.fix}`);
      if (!items.length) items.push("Não encontrei o motivo da recusa no texto. A operadora deve informá-lo por escrito: peça pelo SAC e anote o protocolo.");
      items.push("Registre NIP na ANS (site ou 0800 701 9656) anexando esta negativa.");
      return {
        facts: [["Código do procedimento (TUSS)", tuss || "não identificado"], ["Data", latest(datesIn(t))?.toLocaleDateString("pt-BR") || "não identificada"]],
        headline: motivos.length ? `Motivo identificado: ${motivos.map((m) => m.label).join(", ")}.` : "Negativa sem motivo claro.",
        tone: "near", items,
        summary: `Negativa do plano: motivos ${motivos.map((m) => m.label).join("; ") || "não identificados"}; TUSS ${tuss || "?"}.`,
      };
    },
  },
  administrativo: {
    title: "Recebeu citação, notificação ou decisão? Envie que a gente lê",
    hint: "Portaria, mandado de citação, termo de indiciamento ou decisão em PDF.",
    analyze(text) {
      const t = text.replace(/\s+/g, " ");
      const kind = /indiciament|indiciad/i.test(t) ? "Termo de indiciamento / citação para defesa"
        : /cita[cç][aã]o|citad/i.test(t) ? "Citação" : /notifica/i.test(t) ? "Notificação" : /portaria/i.test(t) ? "Portaria de instauração" : /decis[aã]o|julgament|aplica[cç][aã]o da penalidade/i.test(t) ? "Decisão" : null;
      if (!kind) return null;
      const prazo = t.match(/prazo de (\d{1,3}) \(?[a-zç ]*\)? ?dias( [úu]teis)?/i);
      const lei = ["8.112", "14.133", "9.784", "8.429", "12.846"].filter((n) => t.includes(n));
      const pena = t.match(/\b(advert[eê]ncia|suspens[aã]o|demiss[aã]o|cassa[cç][aã]o|destitui[cç][aã]o|multa|impedimento|inidoneidade)\b/i)?.[0];
      const base = latest(datesIn(t));
      let d = null;
      if (prazo && base) d = deadlineText(prazo[2] ? addBusinessDays(base, +prazo[1]) : addDays(base, +prazo[1]));
      const items = [];
      if (prazo) items.push(`O documento fixa prazo de ${prazo[1]} dias${prazo[2] ? " úteis" : ""}. Confirme a data em que você recebeu: o prazo conta dela.`);
      else if (/indiciad|cita[cç][aã]o/i.test(t) && lei.includes("8.112")) items.push("Pela Lei 8.112, a defesa escrita é de 10 dias da citação (20 dias se houver mais de um indiciado).");
      items.push("Peça cópia integral dos autos antes de redigir a defesa.");
      if (pena) items.push(`Penalidade mencionada: ${pena}. Verifique a prescrição dessa pena antes de qualquer outra tese.`);
      if (lei.includes("14.133") || lei.includes("12.846")) items.push("Processo ligado a contratação pública: a defesa deve considerar os efeitos no cadastro de sanções (CEIS/CNEP) e no Tribunal de Contas.");
      items.push("A acusação precisa descrever a sua conduta concreta. Responsabilização por decisão técnica exige dolo ou erro grosseiro (art. 28 da LINDB).");
      return {
        facts: [["Tipo de documento", kind], ["Leis citadas", lei.join(", ") || "nenhuma identificada"], ["Data mais recente", base ? base.toLocaleDateString("pt-BR") : "não identificada"]],
        headline: d ? d.text : `${kind} identificada. Confira o prazo indicado no documento.`,
        tone: d ? d.tone : "near", items,
        summary: `Documento administrativo: ${kind}; leis ${lei.join(", ") || "?"}; pena ${pena || "?"}; prazo ${prazo ? prazo[1] + " dias" : "?"}.`,
      };
    },
  },
};

function docCard(key) {
  const r = DOC_READERS[key];
  if (!r) return "";
  return `<section class="cnis-card doc-card" id="doc-card">
    <p class="eyebrow">Leitura de documento</p>
    <h2>${esc(r.title)}</h2>
    <p class="muted">${esc(r.hint)} A leitura acontece no seu aparelho; o arquivo não é enviado.</p>
    <label class="btn" for="doc-file">Escolher PDF</label>
    <input type="file" id="doc-file" accept="application/pdf" hidden>
    <details><summary>Prefere colar o texto?</summary><textarea id="doc-text" rows="5"></textarea><button class="btn secondary" id="doc-paste">Analisar texto</button></details>
    <div id="doc-out" aria-live="polite"></div>
  </section>`;
}

function htmlLeitura(r, btnId) {
  return `<dl class="facts">${r.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <div class="fu-result info"><h3>O que a lei diz sobre esse tipo de documento</h3><ul>${r.items.map((i) => `<li>${esc(String(i).replace(/\s*\[(VALIDAR|COMPLETAR|PESQUISAR|CONFERIR)[^\]]*\]/g, ""))}</li>`).join("")}</ul>
      <p><strong>Para ter certeza da avaliação no seu caso, consulte a advogada.</strong> Os dados lidos já vão junto com o pedido.</p>
      <div class="actions"><button class="btn" id="${btnId}">Quero a avaliação da advogada</button></div></div>
      <p class="muted small">Leitura automática do arquivo, só para organizar os dados. Não é análise nem orientação jurídica.</p>`;
}

// Página inicial: qualquer documento (carta do INSS, negativa do plano, citação, notificação, decisão) — descobre o tipo e lê.
function bindHomeDoc() {
  const out = $("home-doc-out"); if (!out) return;
  const run = (text) => {
    // Descobre o tipo pelas palavras do documento e tenta o leitor mais provável primeiro.
    const t = String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const pontos = {
      saude: (t.match(/plano de saude|operadora|\bans\b|beneficiario|rol |cobertura|procedimento|carencia/g) || []).length,
      previdenciario: (t.match(/\binss\b|previdencia|seguro social|segurado|aposentadoria|auxilio|beneficio|nb\b|cnis/g) || []).length,
      administrativo: (t.match(/citac|notificac|intimac|processo administrativo|disciplinar|\bpad\b|sindicancia|comissao|auto de infracao|multa|decisao/g) || []).length,
    };
    const ordem = Object.keys(pontos).sort((a, b) => pontos[b] - pontos[a]).filter((k) => pontos[k] > 0);
    for (const key of ordem) {
      const r = DOC_READERS[key].analyze(text || "");
      if (!r) continue;
      Object.assign(state, { key, flow: FLOWS[key], docSummary: r.summary, text: state.text || `Documento enviado: ${r.facts?.[0]?.[1] || "documento"}` });
      out.innerHTML = htmlLeitura(r, "home-doc-help");
      $("home-doc-help").onclick = openLawyer;
      return;
    }
    if (typeof analyzeCnis === "function" && analyzeCnis(text || "").readable) {
      out.innerHTML = `<p>Este é um <strong>extrato do CNIS</strong>. <button class="linkish" id="home-doc-cnis">Abrir a leitura do CNIS</button></p>`;
      $("home-doc-cnis").onclick = () => { $("home-doc-cnis").closest("section").scrollIntoView(); document.querySelector('[data-topic=previdenciario]').click(); };
      return;
    }
    Object.assign(state, { key: null, flow: null, docSummary: "Documento enviado pela página inicial (tipo não reconhecido automaticamente).", text: state.text || "Documento enviado para análise" });
    out.innerHTML = `<p class="warn-text">Não reconheci automaticamente este documento — mas a advogada pode analisar.</p><div class="actions"><button class="btn" id="home-doc-help">Enviar para a advogada</button></div>`;
    $("home-doc-help").onclick = openLawyer;
  };
  $("home-doc-file").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    out.innerHTML = "<p>Lendo o documento…</p>";
    try { run(await extractPdfText(f)); } catch { out.innerHTML = `<p class="warn-text">Não consegui ler esse PDF (pode ser imagem escaneada). Cole o texto abaixo.</p>`; }
  };
  $("home-doc-paste").onclick = () => run($("home-doc-text").value);
}

function bindDoc(key) {
  const out = $("doc-out");
  if (!out) return;
  const run = (text) => {
    const r = DOC_READERS[key].analyze(text || "");
    if (!r) { out.innerHTML = `<p class="warn-text">Não reconheci este documento. Confira se é o arquivo certo ou cole o texto.</p>`; return; }
    state.docSummary = r.summary;
    out.innerHTML = htmlLeitura(r, "doc-help");
    $("doc-help").onclick = openLawyer;
  };
  $("doc-file").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    out.innerHTML = "<p>Lendo o documento…</p>";
    try { run(await extractPdfText(f)); } catch { out.innerHTML = `<p class="warn-text">Não consegui ler esse PDF (pode ser imagem escaneada). Cole o texto no campo acima.</p>`; }
  };
  $("doc-paste").onclick = () => run($("doc-text").value);
}
