const state = { text: "", flow: null, key: null, answers: [], qi: 0, slot: null };

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function go(view) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
  window.scrollTo(0, 0);
}

function setStep(n) {
  document.querySelectorAll("#steps li").forEach((li) => {
    const s = +li.dataset.step;
    li.className = s < n ? "done" : s === n ? "now" : "";
  });
}

function say(text, who = "bot") {
  const el = document.createElement("div");
  el.className = "msg " + who;
  el.innerHTML = (who === "bot" ? '<span class="who">Plataforma do Direito</span>' : "") + esc(text);
  $("messages").appendChild(el);
  el.scrollIntoView({ behavior: "smooth", block: "end" });
}

function offer(options, onPick) {
  const box = $("answers");
  box.innerHTML = "";
  options.forEach((o) => {
    const b = document.createElement("button");
    b.textContent = o;
    b.onclick = () => { box.innerHTML = ""; say(o, "user"); setTimeout(() => onPick(o), 350); };
    box.appendChild(b);
  });
}

function startChat(text, forcedKey, skipQuestion) {
  Object.assign(state, { text, answers: [], qi: 0, flow: null, followSummary: null, cnisSummary: null, docSummary: null, faqId: null });
  if (text && !forcedKey && !skipQuestion && isQuestion(text)) return answerQuestion(text);
  $("messages").innerHTML = "";
  go("chat");
  setStep(1);
  if (text) say(text, "user");
  const key = forcedKey || classify(text);
  setTimeout(() => {
    if (!key) {
      say("Obrigado por contar. Para eu entender melhor: com quem é o problema?");
      offer(["INSS", "Órgão público", "Plano de saúde ou SUS", "Uma empresa", "Cartório"], (o) => {
        const map = { "INSS": "previdenciario", "Órgão público": "administrativo", "Plano de saúde ou SUS": "saude", "Uma empresa": "consumidor", "Cartório": "cartorio" };
        begin(map[o]);
      });
      return;
    }
    begin(key);
  }, 400);
}

function begin(key) {
  state.key = key;
  state.flow = FLOWS[key];
  say(state.flow.understood + "\n\nPara conseguir orientar os próximos passos, preciso saber algumas coisas.");
  setTimeout(ask, 500);
}

function ask() {
  const qs = [...state.flow.questions, OBJECTIVE_Q];
  if (state.qi >= qs.length) return finish();
  const { q, a } = qs[state.qi];
  say(q);
  offer(a, (o) => { state.answers.push(o); state.qi++; ask(); });
}

function finish() {
  setStep(2);
  say("Obrigado. Já tenho o suficiente para uma orientação inicial.");
  setTimeout(() => { renderResult(); go("result"); setStep(3); }, 700);
}

function renderResult() {
  const f = state.flow;
  const lawyer = f.needsLawyer(state.answers);
  const steps = f.steps.filter((s) => !s.when || s.when(state.answers)).map((s) => `<li><strong>${esc(s.t)}</strong><br><span class="muted">${esc(s.d)}</span>${s.link ? `<br><a href="${s.link[1]}" ${s.link[1].startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(s.link[0])} →</a>` : ""}</li>`).join("");
  const sources = f.sources.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("");
  $("result").innerHTML = `
    <h1>Entendemos sua situação</h1>
    <p><span class="tag">${esc(f.subject)}</span></p>
    ${state.text ? `<p class="muted">“${esc(state.text)}”</p>` : ""}
    <h2>O que você pode fazer agora</h2>
    <ol class="steps-list">${steps}</ol>
    ${docCard(state.key)}
    ${state.key === "previdenciario" ? CNIS_CARD : ""}
    <h2>O que a lei prevê</h2>
    <p>${esc(f.law)}</p>
    <details><summary>Ver fundamento jurídico e fontes →</summary><ul>${sources}</ul></details>
    <div class="card decision">
      <h2>E no seu caso?</h2>
      <p>${lawyer
        ? "Pela situação que você descreveu, existem elementos que justificam uma análise individual dos documentos por um advogado."
        : "Pelo que você descreveu, é possível tentar resolver esta etapa sozinho(a) seguindo os passos acima. Se não der certo, estamos aqui."}</p>
      <div class="actions">
        <button class="btn${lawyer ? "" : " secondary"}" id="to-lawyer">Conversar com um advogado</button>
        <button class="btn${lawyer ? " secondary" : ""}" id="alone">Continuar sozinho</button>
      </div>
    </div>
    <p class="muted small">Orientação inicial informativa, gerada a partir do que você contou. Não substitui a análise individual por advogado.</p>`;
  bindCnis();
  bindDoc(state.key);
  $("to-lawyer").onclick = openLawyer;
  $("alone").onclick = () => (e => { e.target.textContent = "Orientação salva ✓"; e.target.disabled = true; })(event);
}

function openLawyer() {
  const n = state.answers.length;
  $("case-summary").innerHTML = (n
    ? ["Relato", `${n} perguntas respondidas`, "Documentos necessários identificados", "Orientação inicial concluída"]
    : ["Sua pergunta", "Área identificada"]).map((t) => `<li>${t}</li>`).join("");
  $("f-area").value = state.flow ? state.flow.subject : "Pergunta sem resposta pronta";
  const code = (state.faqId && ATLAS[state.faqId]) || ATLAS_AREA[state.key] || "";
  $("f-codigo").value = [code, state.faqId ? dacResumo(state.faqId) : ""].filter(Boolean).join(" · ");
  $("f-resumo").value = [state.text && `Relato: ${state.text}`, ...(state.cnisSummary ? [state.cnisSummary] : []), ...(state.docSummary ? [state.docSummary] : []), ...(state.followSummary ? [state.followSummary, ...state.answers] : state.answers.map((r, i) => `${i + 1}. ${[...state.flow.questions, OBJECTIVE_Q][i].q} ${r}`))].filter(Boolean).join("\n");
  go("lawyer");
}

function answerQuestion(text) {
  const f = findFaq(text);
  state.faqId = f ? f.id : null;
  const key = (f && f.area) || classify(text);
  state.key = key;
  state.flow = key ? FLOWS[key] : null;
  const sources = (list) => list.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("");
  if (f) {
    const table = f.table ? `<div class="table-wrap"><table><thead><tr>${f.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${f.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="muted small">${esc(f.table.note)}</p>` : "";
    $("result").innerHTML = `
      <p class="eyebrow">Resposta</p>
      <h1>${esc(f.q)}</h1>
      <p class="muted">Você perguntou: “${esc(text)}”</p>
      <div class="answer">${f.a.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      ${table}
      ${f.tips ? `<h2>Dicas práticas</h2><ul class="tips">${f.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      <details open><summary>Fundamento jurídico e fontes</summary><ul>${sources(f.sources)}</ul></details>
      ${f.followUp ? `<section class="followup" id="followup"><p class="eyebrow">Próximo passo</p><h2>${esc(f.followUp.title)}</h2><p class="muted">${esc(f.followUp.intro)}</p><div id="fu-log" class="fu-log"></div><div id="fu-answers" class="answers"></div></section>` : ""}
      ${docCard(key)}
      ${key === "previdenciario" ? CNIS_CARD : ""}
      <div class="card decision" id="faq-cta">
        <h2>${esc(f.next)}</h2>
        <div class="actions">
          ${key === "previdenciario" ? `<a class="btn" href="/simulador/">Abrir o simulador</a>` : ""}
          <button class="btn secondary" id="to-flow">Analisar meu caso</button>
          <button class="btn secondary" id="to-lawyer">Falar com advogado</button>
        </div>
      </div>
      <p class="muted small">Resposta informativa e geral (conteúdo em validação jurídica). Não substitui a análise do seu caso concreto.</p>`;
  } else {
    $("result").innerHTML = `
      <p class="eyebrow">Sua pergunta</p>
      <h1>Ainda não temos uma resposta pronta para essa pergunta.</h1>
      <p class="muted">Você perguntou: “${esc(text)}”</p>
      <p>Preferimos não responder no improviso. Envie sua pergunta para a advogada responsável: ela responde por escrito, e a resposta passa a fazer parte da nossa base.</p>
      <div class="card decision">
        <h2>Como prefere seguir?</h2>
        <div class="actions">
          <button class="btn" id="to-lawyer">Enviar minha pergunta</button>
          <button class="btn secondary" id="to-flow">Contar meu caso</button>
        </div>
      </div>`;
  }
  $("to-lawyer").onclick = openLawyer;
  if (f && f.followUp) runFollowUp(f.followUp);
  bindCnis();
  bindDoc(key);
  const tf = $("to-flow");
  if (tf) tf.onclick = () => { if (key) { $("messages").innerHTML = ""; go("chat"); setStep(1); say(text, "user"); begin(key); } else startChat(text, null, true); };
  go("result");
}

function runFollowUp(fu) {
  const ans = {};
  let i = 0;
  const log = $("fu-log");
  const step = () => {
    if (i >= fu.questions.length) return finishFollowUp(fu, ans);
    const { id, q, a, input } = fu.questions[i];
    const el = document.createElement("div");
    el.className = "msg bot";
    el.textContent = q;
    log.appendChild(el);
    $("fu-answers").innerHTML = "";
    const answer = (value, shown) => {
      ans[id] = value;
      state.answers.push(`${q} ${shown}`);
      const u = document.createElement("div");
      u.className = "msg user";
      u.textContent = shown;
      log.appendChild(u);
      i++;
      step();
    };
    if (input === "number") {
      const n = document.createElement("input");
      n.type = "number"; n.min = "0"; n.step = "any"; n.inputMode = "decimal";
      n.id = `fu-${id}`; n.className = "fu-date";
      const ok = document.createElement("button");
      ok.textContent = "Confirmar";
      ok.onclick = () => { if (n.value !== "") answer(Number(n.value), n.value); };
      const skip = document.createElement("button");
      skip.textContent = "Não sei";
      skip.onclick = () => answer(null, "Não sei");
      $("fu-answers").append(n, ok, skip);
      return;
    }
    if (input === "date") {
      const d = document.createElement("input");
      d.type = "date";
      d.id = `fu-${id}`;
      d.className = "fu-date";
      const ok = document.createElement("button");
      ok.textContent = "Confirmar data";
      ok.onclick = () => { if (d.value) answer(new Date(d.value + "T12:00:00"), new Date(d.value + "T12:00:00").toLocaleDateString("pt-BR")); };
      const skip = document.createElement("button");
      skip.textContent = "Não sei";
      skip.onclick = () => answer(null, "Não sei");
      $("fu-answers").append(d, ok, skip);
      return;
    }
    a.forEach((o) => {
      const b = document.createElement("button");
      b.textContent = o;
      b.onclick = () => answer(o, o);
      $("fu-answers").appendChild(b);
    });
  };
  step();
}

function finishFollowUp(fu, ans) {
  const r = fu.evaluate(ans);
  state.followSummary = r.summary;
  $("fu-answers").innerHTML = "";
  const box = document.createElement("div");
  box.className = "fu-result " + r.tone;
  box.innerHTML = `<h3>${esc(r.headline)}</h3><ul>${r.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="actions"><button class="btn" id="fu-help">${r.lawyer ? "Quero ajuda com meu caso" : "Quero que um advogado confira"}</button>
    ${state.key === "previdenciario" ? `<a class="btn secondary" href="/simulador/">Simular no detalhe</a>` : ""}</div>
    ${r.lawyer ? `<p class="small">Pelo que você respondeu, uma análise profissional pode fazer diferença no resultado. Seu caso chega organizado ao advogado.</p>` : ""}`;
  $("followup").appendChild(box);
  $("fu-help").onclick = openLawyer;
  $("faq-cta").hidden = true;
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

const CNIS_CARD = `
  <section class="cnis-card" id="cnis-card">
    <p class="eyebrow">Análise do seu CNIS</p>
    <h2>Envie seu extrato do CNIS e a gente lê para você</h2>
    <p class="muted">Baixe no Meu INSS: <strong>Extrato de Contribuição (CNIS)</strong> → Baixar PDF. A leitura acontece no seu aparelho; o arquivo não é enviado para nenhum servidor.</p>
    <label class="btn" for="cnis-file">Escolher PDF do CNIS</label>
    <input type="file" id="cnis-file" accept="application/pdf" hidden>
    <details><summary>O PDF não abre? Cole o texto do extrato</summary>
      <textarea id="cnis-text" rows="5" placeholder="Cole aqui o conteúdo do CNIS"></textarea>
      <button class="btn secondary" id="cnis-paste">Analisar texto</button>
    </details>
    <div id="cnis-out" aria-live="polite"></div>
  </section>`;

function bindCnis() {
  const out = $("cnis-out");
  if (!out) return;
  const run = (text) => {
    const r = analyzeCnis(text);
    if (!r.readable) { out.innerHTML = `<p class="warn-text">Não consegui identificar os vínculos. Confira se é o extrato completo do CNIS ou cole o texto no campo acima.</p>`; return; }
    state.cnisSummary = `CNIS: ${r.vinculos.length} vínculos; tempo aproximado ${r.totalText}; ${r.findings.length} pontos de atenção (${[...new Set(r.findings.map((f) => f.code))].join(", ")}).`;
    out.innerHTML = `
      <div class="stats">
        <div><span class="label">Tempo aproximado</span><strong>${r.totalText}</strong></div>
        <div><span class="label">${r.ageYears ? "Idade" : "Vínculos"}</span><strong>${r.ageYears ? r.ageYears + " anos" : r.vinculos.length}</strong></div>
        <div><span class="label">Pontos de atenção</span><strong>${r.findings.length}</strong></div>
      </div>
      ${r.declared ? `<p class="warn-text">Este arquivo é a lista de relações <strong>declaradas no pedido</strong>, não o extrato CNIS completo. Ele não mostra salários nem os indicadores de pendência. Para uma análise completa, envie também o <strong>Extrato de Contribuição (CNIS)</strong>.</p>` : ""}
      ${r.findings.length ? `<h3>O que precisa de atenção</h3><ul class="findings">${r.findings.map((f) => `<li><span class="code">${esc(f.code)}</span><div><strong>${esc(f.label)}</strong><br><span class="muted small">${esc(f.vinculo)}</span><p>${esc(f.fix)}</p></div></li>`).join("")}</ul>` : `<p>Não encontramos pendências marcadas no extrato. Ainda assim, confira se todos os seus empregos aparecem.</p>`}
      <details><summary>Ver vínculos lidos</summary><div class="table-wrap"><table><thead><tr><th>Origem</th><th>Tipo</th><th>Início</th><th>Fim</th></tr></thead><tbody>
        ${r.vinculos.map((v) => `<tr><td>${esc(v.origem)}</td><td>${esc(v.tipo)}</td><td>${fmtDate(v.start)}</td><td>${v.end ? fmtDate(v.end) : "sem data"}</td></tr>`).join("")}
      </tbody></table></div></details>
      <div class="fu-result ${r.findings.length ? "near" : "good"}">
        <h3>${r.findings.length ? "Seu extrato tem pontos que podem mudar seu tempo de contribuição." : "Seu extrato parece organizado."}</h3>
        <p>${r.before2019 ? "Você já contribuía antes da Reforma de 2019, então pode usar as regras de transição." : "Seu primeiro vínculo é posterior à Reforma: valem as regras permanentes."}${r.monthsSinceLast > 12 ? " Sua última contribuição tem mais de 12 meses: vale verificar se você ainda mantém a qualidade de segurado." : ""}</p>
        <div class="actions"><button class="btn" id="cnis-help">Quero que analisem meu CNIS</button><a class="btn secondary" href="/simulador/">Simular com ${r.totalText}</a></div>
      </div>
      <p class="muted small">Leitura automática e preliminar. O tempo exato depende da conferência de cada vínculo e das regras de carência.</p>`;
    $("cnis-help").onclick = openLawyer;
  };
  $("cnis-file").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    out.innerHTML = `<p>Lendo seu extrato…</p>`;
    try { run(await extractPdfText(file)); } catch { out.innerHTML = `<p class="warn-text">Não consegui ler esse PDF. Ele pode ser uma imagem escaneada. Baixe novamente pelo Meu INSS ou cole o texto no campo acima.</p>`; }
  };
  $("cnis-paste").onclick = () => run($("cnis-text").value);
}

$("lead-form").onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  $("f-send").disabled = true;
  try {
    // Pacote do caso: tudo o que a pessoa contou e os documentos já lidos, para o escritório importar com um clique.
    const protocolo = "PD-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const pacote = { v: 1, protocolo, criado: new Date().toISOString(), area: $("f-area").value, key: state.key, faqId: state.faqId || null, codigo: $("f-codigo").value,
      relato: state.text, cnis: state.cnisSummary || "", documento: state.docSummary || "", continuacao: state.followSummary || "",
      respostas: state.followSummary ? state.answers : state.answers.map((r, i) => `${[...(state.flow?.questions || []), OBJECTIVE_Q][i]?.q || ""} ${r}`),
      nome: $("f-nome").value.trim(), email: $("f-email").value.trim(), telefone: $("f-tel").value.trim(), periodo: $("f-periodo").value };
    $("f-protocolo").value = protocolo;
    $("f-pacote").value = "PD1:" + btoa(unescape(encodeURIComponent(JSON.stringify(pacote))));
    const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
    if (!r.ok) throw new Error(r.status);
    $("area-title").textContent = state.flow ? state.flow.caseTitle : "Pergunta enviada à advogada";
    $("area-meeting").textContent = `A combinar — retornaremos em até 1 dia útil · protocolo ${$("f-protocolo").value}`;
    go("area");
  } catch {
    $("f-msg").textContent = "Não conseguimos enviar agora. Verifique a conexão e tente de novo.";
    $("f-send").disabled = false;
  }
};

$("start-form").onsubmit = (e) => {
  e.preventDefault();
  const t = $("start-text").value.trim();
  if (t) startChat(t);
};
$("start-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("start-form").requestSubmit(); }
});
document.querySelectorAll("#shortcuts button").forEach((b) => (b.onclick = () => startChat("", b.dataset.topic)));
document.querySelectorAll("[data-go]").forEach((a) => a.addEventListener("click", (e) => {
  if (a.getAttribute("href") === "#") e.preventDefault();
  go(a.dataset.go);
}));

document.querySelectorAll("[data-tool]").forEach((b) => (b.onclick = () => {
  $("b2b-tool").value = b.dataset.tool;
  $("b2b-title").textContent = b.dataset.tool;
  $("b2b-form").hidden = false;
  $("b2b-msg").textContent = "";
  $("b2b-form").scrollIntoView({ behavior: "smooth", block: "start" });
}));
$("b2b-form").onsubmit = async (e) => {
  e.preventDefault();
  $("b2b-send").disabled = true;
  try {
    const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(e.target)).toString() });
    if (!r.ok) throw new Error(r.status);
    $("b2b-msg").textContent = "Recebido. Avisaremos você assim que a ferramenta abrir.";
    e.target.reset();
  } catch {
    $("b2b-msg").textContent = "Não conseguimos enviar agora. Verifique a conexão e tente de novo.";
  }
  $("b2b-send").disabled = false;
};
