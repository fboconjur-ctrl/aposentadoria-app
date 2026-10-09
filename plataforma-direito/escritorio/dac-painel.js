// Motor "Direito Administrativo Computável" (DAC) dentro do painel.
// O motor (dac/motor.html) roda num quadro oculto deste navegador; o texto do caso não é enviado a lugar nenhum.
// É ferramenta de apoio à análise da advogada: mostra fatos, regras com fonte, lacunas e perguntas. A conclusão é dela.
(() => {
  let quadro = null, pronto = null, ultimo = null, cliDac = null;
  const carregar = () => pronto || (pronto = new Promise((ok, erro) => {
    quadro = document.createElement("iframe");
    quadro.src = "dac/motor.html"; quadro.hidden = true; quadro.title = "Motor DAC";
    quadro.onload = () => ok(quadro.contentWindow);
    quadro.onerror = erro;
    document.body.appendChild(quadro);
  }));
  let respostas = {}, textoBase = "";
  const comRespostas = (t) => t + Object.entries(respostas).filter(([, v]) => v !== "nao sei").map(([k, v]) => `\n[Resposta complementar — PRED_${k}: ${v}]`).join("");
  async function analisarDAC(texto) {
    const w = await carregar();
    w.document.getElementById("caseText").value = texto;
    w.engineAnalyzeCore();
    const L = w.eval("LAST");
    // Condições que faltam para as regras candidatas valerem (para a advogada completar).
    L._pendencias = w.eval(`(() => { const t = ${JSON.stringify(texto)}; const agg = {};
      for (const rule of LAST.rules) { const e = evaluateRuleCompiled(rule, LAST.canonicalFacts, t); if (e.state !== "BLOCKED_UNKNOWN") continue;
        const faltam = [...e.required, ...e.any].filter((x) => x.status === "UNKNOWN" && x.compiled && x.predicate && x.predicate.key && x.predicate.key !== "META_GUARD");
        if (faltam.length > 2) continue;
        for (const x of faltam) { const k = x.predicate.key; const a = agg[k] || (agg[k] = { key: k, raw: x.predicate.raw, op: x.predicate.op, value: x.predicate.value, n: 0, fontes: [] });
          a.n++; if (a.fontes.length < 2) a.fontes.push((rule.source || "") + (rule.article ? ", " + rule.article : "") + " — " + (rule.topic || rule.id)); } }
      return Object.values(agg).sort((a, b) => b.n - a.n).slice(0, 8); })()`);
    return L;
  }
  window.analisarDAC = analisarDAC;

  const NOME = { ENTE_FEDERATIVO: "Ente federativo", AGENTE_PUBLICO: "Agente público", SERVIDOR_PUBLICO: "Servidor público", PESSOA_JURIDICA: "Pessoa jurídica",
    LICITACAO_OU_CONTRATACAO: "Licitação ou contratação", PROCESSO_ADMINISTRATIVO: "Processo administrativo", PROCESSO_PREVIO: "Processo prévio",
    MOTIVACAO_EXPRESSA: "Motivação expressa", CONTRADITORIO_OBSERVADO: "Contraditório e ampla defesa", VANTAGEM_INDEVIDA: "Vantagem indevida", DOLO: "Dolo",
    CONLUIO: "Conluio", DANO_ERARIO: "Dano ao erário", IMPROBIDADE_MENCIONADA: "Improbidade mencionada", CONTROLE_EXTERNO: "Controle externo (TCU/TCE)",
    REJEICAO_CONTAS: "Rejeição de contas", APROVACAO_CONTAS: "Aprovação de contas", ABSOLVICAO_PENAL: "Absolvição penal",
    ABSOLVICAO_INEXISTENCIA_FATO: "Absolvição por inexistência do fato", ABSOLVICAO_NEGATIVA_AUTORIA: "Absolvição por negativa de autoria",
    DADOS_PESSOAIS: "Dados pessoais", DADOS_SENSIVEIS: "Dados sensíveis", PEDIDO_LAI: "Pedido pela LAI", PUBLICACAO_INTEGRAL: "Publicação integral",
    ANONIMIZACAO_POSSIVEL: "Anonimização possível", CONCESSAO_SERVICO_PUBLICO: "Concessão de serviço público", PEDIDO_REEQUILIBRIO: "Pedido de reequilíbrio",
    RISCO_CONTRATUAL_PREALOCADO: "Risco pré-alocado no contrato", RECURSO_INTERPOSTO: "Recurso interposto", ATO_ILEGAL: "Ato ilegal" };
  const nome = (k) => NOME[k] || k.toLowerCase().replace(/_/g, " ").replace(/^./, (x) => x.toUpperCase());
  const ESTADO = { ALLEGED: "alegado", HYPOTHETICAL: "hipótese", DENIED: "negado por uma das partes", UNCERTAIN: "não esclarecido", MENTION_ONLY: "apenas mencionado" };
  const valor = (f) => {
    if (f.value === true) return `<span class="dac-v sim">Sim</span>`;
    if (f.value === false) return `<span class="dac-v nao">Não</span>`;
    if (typeof f.value === "string" && f.value !== "UNKNOWN") return `<span class="dac-v sim">${esc2(f.value)}</span>`;
    const e = ESTADO[f.epistemic_status] || (f.contested ? "contestado" : "não esclarecido");
    return `<span class="dac-v inc">${e}${f.contested && f.epistemic_status !== "DENIED" ? " · contestado" : ""}</span>`;
  };
  // Rótulos técnicos das conclusões ("avaliar dolo culpa", "enforce dano nao presumido") em português legível.
  const ACENTO = { nao: "não", e: "é", previo: "prévio", publico: "público", publica: "pública", erario: "erário", licitacao: "licitação", motivacao: "motivação", contraditorio: "contraditório", decisao: "decisão", sancao: "sanção", prescricao: "prescrição", reequilibrio: "reequilíbrio", concessao: "concessão", informacao: "informação", anonimizacao: "anonimização", violacao: "violação", perturbacao: "perturbação", improbidade: "improbidade", absolvicao: "absolvição", autoria: "autoria", obrigatoria: "obrigatória", juridica: "jurídica", administracao: "Administração", servico: "serviço", tecnica: "técnica", vinculacao: "vinculação", competencia: "competência", publicacao: "publicação", contratacao: "contratação", excecoes: "exceções", forca: "força", especifico: "específico", peticao: "petição", capitulo: "capítulo", pad: "PAD", numero: "número", prorrogacao: "prorrogação", diligencia: "diligência", indispensavel: "indispensável", nomeacao: "nomeação", maxima: "máxima", obrigatorio: "obrigatório", reconsideracao: "reconsideração", inquerito: "inquérito", instauracao: "instauração", inicio: "início" };
  const legivel = (t) => {
    let x = String(t || "").trim(); let tipo = "";
    if (/^enforce\s+/i.test(x)) { tipo = "Salvaguarda"; x = x.replace(/^enforce\s+/i, ""); }
    else if (/^avaliar\s+/i.test(x)) { tipo = "Avaliar"; x = x.replace(/^avaliar\s+/i, ""); }
    x = x.replace(/_/g, " ").replace(/'/g, "").replace(/\s*=\s*/g, ": ");
    x = x.split(/\s+/).map((w) => ACENTO[w.toLowerCase()] || w).join(" ");
    return (tipo ? tipo + ": " : "") + x;
  };
  const pergunta = (p) => {
    let t = String(p.raw || p.key).replace(/_/g, " ").replace(/\s*=\s*(true|false)$/i, "").replace(/\s*present$/i, "");
    t = t.split(/\s+/).map((w) => ACENTO[w.toLowerCase()] || w).join(" ");
    return t.charAt(0).toUpperCase() + t.slice(1) + "?";
  };
  const esc2 = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function render(L) {
    const fatos = Object.entries(L.canonicalFacts || {}).filter(([k, f]) => !k.startsWith("_") && f && (f.value !== "UNKNOWN" || (f.epistemic_status && f.epistemic_status !== "ASSERTED")));
    // Conclusões técnicas sem conteúdo ("enforce", "vedar") somem; roteamentos ("rotear DA05") viram "ver também".
    const NOMES_DOM = Object.fromEntries((L.domains || []).map((d) => [d.id.replace("-", ""), d.name]));
    const rotas = new Set(); const conc = [];
    for (const c of (L.conclusions || [])) {
      const t = String(c.text || "").trim();
      if (/nenhuma atravessou/i.test(t) || /^(enforce|vedar|avaliar|exigir|permitir)$/i.test(t)) continue;
      if (/^rotear\b/i.test(t)) { (t.match(/DA\d{2}/g) || []).forEach((d) => rotas.add(d)); continue; }
      if (!conc.some((x) => x.text === t)) conc.push(c);
    }
    const regras = (L.rules || []).slice(0, 12);
    $("dac-out").innerHTML = `
      <div class="panel"><h2>Fatos extraídos</h2>
        ${fatos.length ? `<table class="dac-t"><tbody>${fatos.map(([k, f]) => `<tr><td>${esc2(nome(k))}</td><td>${valor(f)}</td><td class="small muted">${esc2(f.evidence && f.evidence !== "não identificado" ? "“" + f.evidence + "”" : "")}</td></tr>`).join("")}</tbody></table>` : `<p class="muted">Nenhum fato identificado com segurança.</p>`}
        <p class="small muted">Alegação, hipótese e contestação nunca viram fato. ${L.engineCounts ? `${L.engineCounts.knownFacts} fato(s) conhecido(s) · ${L.engineCounts.unknownFacts} em aberto.` : ""}</p></div>
      <div class="panel"><h2>Domínios envolvidos</h2><p>${(L.domains || []).map((d) => `<span class="pill-s">${esc2(d.id)} ${esc2(d.name)}</span>`).join(" ") || "—"}</p>
        <p class="small muted">Escopo: ${esc2([L.scope?.entity, L.scope?.branch, L.scope?.stage].filter((x) => x && x !== "UNKNOWN").join(" · ") || "não identificado")}</p></div>
      <div class="panel"><h2>Pontos a avaliar</h2>${conc.length ? `<ul>${conc.map((c) => `<li><b>${esc2(legivel(c.text))}</b>${(() => { const r = (L.rules || []).find((x) => x.id === c.rule); return r ? ` <span class="small muted">— ${esc2(r.source || "")}${r.article ? ", " + esc2(r.article) : ""} (${esc2(c.rule)})</span>` : c.domain ? ` <span class="small muted">(${esc2(c.domain)} · ${esc2(c.rule || "")})</span>` : ""; })()}${(c.salvo || []).length ? `<br><span class="small muted">Salvo se: ${esc2(c.salvo.map((x) => legivel(x)).join("; "))} — confirme antes de usar.</span>` : c.uncertain ? ` <span class="dac-v inc">depende de fato em aberto</span>` : ""}</li>`).join("")}</ul>` : `<p class="muted">Nenhuma regra atravessou todos os filtros com os fatos atuais. Complete os fatos (perguntas abaixo) e analise de novo.</p>`}</div>
      ${rotas.size ? `<p class="small muted" style="margin-top:8px"><b>Ver também:</b> ${[...rotas].map((d) => esc2(d.replace(/^DA/, "DA-") + (NOMES_DOM[d] ? " " + NOMES_DOM[d] : ""))).join(" · ")}</p>` : ""}
      <div class="panel"><h2>Regras relacionadas, com fonte</h2>${regras.length ? `<ul>${regras.map((r) => `<li><b>${esc2(r.source || "")}${r.article ? ", " + esc2(r.article) : ""}</b> — ${esc2(r.topic || r.id)} <span class="small muted">(${esc2(r.id)} · ${esc2(r.domainName || r.domain)})</span></li>`).join("")}</ul>${L.rules.length > 12 ? `<p class="small muted">+${L.rules.length - 12} regra(s) — veja no motor completo.</p>` : ""}` : `<p class="muted">Nenhuma.</p>`}</div>
      ${(L._pendencias || []).length ? `<div class="panel" id="dac-pend"><h2>Completar fatos <span class="small muted">(destrava regras)</span></h2>
        <p class="small muted">O relato não diz isto com segurança. Responda o que você já sabe; a resposta é sua, não uma inferência do motor.</p>
        ${L._pendencias.map((p) => { const valorSim = p.op === "=" && typeof p.value !== "boolean" ? String(p.value) : "sim"; return `<div class="dac-q" data-k="${esc2(p.key)}"><div><b>${esc2(pergunta(p))}</b><br><span class="small muted">${p.n} regra(s): ${esc2(p.fontes.join(" · "))}</span></div>
          <div class="dac-opts">${[["Sim", valorSim], ["Não", "nao"], ["Não sei", "nao sei"]].map(([r, v]) => `<button type="button" class="back${respostas[p.key] === v ? " on" : ""}" data-v="${esc2(v)}">${r}</button>`).join("")}</div></div>`; }).join("")}
        <button class="btn" id="dac-reanalisar" style="margin-top:10px">Analisar de novo com as respostas</button></div>` : ""}
      <div class="panel"><h2>Perguntas para o cliente</h2>${(L.questions || []).length ? `<ol>${L.questions.map((q) => `<li>${esc2(q.q)}</li>`).join("")}</ol>` : `<p class="muted">Nenhuma.</p>`}
        ${(L.missing || []).length ? `<p class="small muted"><b>Lacunas:</b> ${esc2(L.missing.slice(0, 10).join("; "))}</p>` : ""}</div>
      <p class="small muted">Corpus de ${esc2(L.snapshot || "")} · motor ${esc2(L.engineVersion || "")} + NFV2 13.8. Ferramenta de apoio: a avaliação jurídica é sua.</p>`;
  }
  function resumo(L) {
    const fatos = Object.entries(L.canonicalFacts || {}).filter(([k, f]) => !k.startsWith("_") && f && f.value !== "UNKNOWN").map(([k, f]) => `${nome(k)}: ${typeof f.value === "string" ? f.value : f.value ? "sim" : "não"}`);
    const conc = (L.conclusions || []).filter((c) => !/nenhuma atravessou/i.test(c.text)).map((c) => legivel(c.text));
    return [`[Motor DAC ${new Date().toLocaleDateString("pt-BR")}]`, `Domínios: ${(L.domains || []).map((d) => d.id + " " + d.name).join("; ")}`,
      fatos.length && `Fatos: ${fatos.join("; ")}`, conc.length && `Pontos a avaliar: ${conc.join("; ")}`,
      Object.keys(respostas).length && `Respostas da advogada: ${Object.entries(respostas).map(([k, v]) => `${k.toLowerCase().replace(/_/g, " ")}: ${v}`).join("; ")}`,
      (L.questions || []).length && `Perguntar: ${L.questions.map((q) => q.q).join(" | ")}`].filter(Boolean).join("\n");
  }

  $("dac-run").onclick = async () => {
    const t = $("dac-txt").value.trim(); if (t.length < 15) return $("dac-txt").focus();
    $("dac-status").textContent = "Analisando…"; $("dac-run").disabled = true;
    if (t !== textoBase) { respostas = {}; textoBase = t; }
    try { ultimo = await analisarDAC(comRespostas(t)); render(ultimo); ligarPendencias(); $("dac-status").textContent = `${(ultimo.rules || []).length} regra(s) candidata(s) · ${(ultimo.domains || []).length} domínio(s).`; $("dac-salvar").hidden = !cliDac; }
    catch (e) { $("dac-status").textContent = "Não foi possível rodar o motor: " + e.message; }
    finally { $("dac-run").disabled = false; }
  };
  function ligarPendencias() {
    document.querySelectorAll("#dac-pend .dac-q").forEach((q) => q.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => {
      respostas[q.dataset.k] = b.dataset.v; q.querySelectorAll("[data-v]").forEach((x) => x.classList.toggle("on", x === b));
    })));
    const r = $("dac-reanalisar"); if (r) r.onclick = () => $("dac-run").click();
  }
  $("dac-salvar").onclick = () => {
    const c = cliDac && cliPorId(cliDac); if (!c || !ultimo) return;
    c.notas = [c.notas, resumo(ultimo)].filter(Boolean).join("\n\n");
    (c.hist ||= []).unshift({ em: new Date().toISOString(), o: "Análise do motor DAC salva" }); salvarCrm();
    $("dac-status").textContent = `Análise salva nas anotações de ${c.nome}.`; $("dac-salvar").hidden = true;
  };
  // Da ficha do cliente: abre o motor já com a história do cliente.
  $("fi-dac").onclick = () => {
    const c = cliPorId(fichaAtual); cliDac = c.id;
    $("dac-cli").textContent = `· ${c.nome}`; $("dac-txt").value = [c.resumo, c.notas].filter(Boolean).join("\n").replace(/^Relato:\s*/m, "");
    $("dac-out").innerHTML = ""; $("dac-status").textContent = ""; $("dac-salvar").hidden = true;
    go("dac"); $("dac-run").click();
  };
  document.querySelector('[data-view="dac"]')?.addEventListener("click", () => { cliDac = null; $("dac-cli").textContent = ""; });
})();
