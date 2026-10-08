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
  Object.assign(state, { text, answers: [], qi: 0, flow: null, followSummary: null, cnisSummary: null, docSummary: null, faqId: null, assunto: null, analise: null });
  if (text && !forcedKey && !skipQuestion && isQuestion(text)) return answerQuestion(text);
  $("messages").innerHTML = "";
  $("qcount").textContent = ""; $("voltar").hidden = true;
  go("chat");
  setStep(1);
  if (text) say(text, "user");
  const key = forcedKey || classify(text);
  // Relato com conteúdo: lê a história antes de qualquer pergunta.
  if (text && text.length >= 40) { state.key = key; state.flow = key ? FLOWS[key] : null; return setTimeout(() => sugerirSituacoes(text), 400); }
  setTimeout(() => {
    if (!key) {
      say("Com quem é a questão?");
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
  // Sem relato ainda (veio pelo botão de assunto): pede a história em poucas palavras antes das perguntas.
  if (!state.text) return pedirHistoria();
  setTimeout(ask, 300);
}

const EXEMPLO_HIST = {
  previdenciario: "Ex.: tenho 60 anos, pedi aposentadoria e o INSS negou",
  saude: "Ex.: meu plano negou a cirurgia que o médico pediu",
  administrativo: "Ex.: passei no concurso e não fui chamado",
  consumidor: "Ex.: comprei uma geladeira que veio com defeito e a loja não troca",
  cartorio: "Ex.: meu pai faleceu e somos 3 irmãos de acordo na partilha",
};
function pedirHistoria() {
  say("Conte em poucas palavras o que aconteceu.");
  const box = $("answers");
  box.innerHTML = `<form id="hist-form" class="hist-form"><textarea id="hist-txt" rows="3" placeholder="${esc(EXEMPLO_HIST[state.key] || "Ex.: o que aconteceu, quando e com quem")}"></textarea>
    <div class="actions"><button class="btn" type="submit">Continuar</button><button type="button" id="hist-pular">Prefiro só responder perguntas</button></div></form>`;
  $("hist-txt").focus();
  $("hist-txt").onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("hist-form").requestSubmit(); } };
  $("hist-form").onsubmit = (e) => {
    e.preventDefault();
    const t = $("hist-txt").value.trim(); if (!t) return $("hist-txt").focus();
    state.text = t; box.innerHTML = ""; say(t, "user");
    // Pergunta formulada como dúvida e com resposta pronta: mostra a informação geral direto.
    if (isQuestion(t) && findFaq(t)) return setTimeout(() => answerQuestion(t), 350);
    setTimeout(() => sugerirSituacoes(t), 350);
  };
  $("hist-pular").onclick = () => { box.innerHTML = ""; setTimeout(ask, 200); };
}

function ask() {
  const qs = [...state.flow.questions, OBJECTIVE_Q];
  if (state.qi >= qs.length) return finish();
  const { q, a } = qs[state.qi];
  $("qcount").textContent = `Pergunta ${state.qi + 1} de ${qs.length}`;
  $("voltar").hidden = state.qi === 0;
  say(q);
  offer(a, (o) => { state.answers.push(o); state.qi++; ask(); });
}

$("voltar").onclick = () => {
  if (!state.flow || state.qi === 0) return;
  state.qi--; state.answers.pop();
  const msgs = $("messages").children;
  for (let i = 0; i < 3 && msgs.length; i++) msgs[msgs.length - 1].remove(); // pergunta atual, resposta anterior, pergunta anterior
  ask();
};

function finish() {
  setStep(2);
  $("qcount").textContent = ""; $("voltar").hidden = true;
  say("Obrigado. Separei as informações sobre o seu assunto.");
  setTimeout(() => { renderResult(); go("result"); setStep(3); }, 700);
}

function renderResult(an) {
  const f = state.flow;
  const steps = f.steps.filter((s) => (!s.when || s.when(state.answers)) && !(an && an.feitos.some((c) => c.re.test(norm(s.t + " " + s.d))))).map((s) => `<li><strong>${esc(s.t)}</strong><br><span class="muted">${esc(s.d)}</span>${s.link ? `<br><a href="${s.link[1]}" ${s.link[1].startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(s.link[0])} →</a>` : ""}</li>`).join("");
  const sources = f.sources.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("");
  $("result").innerHTML = `
    <h1>Informações sobre o seu assunto</h1>
    <p><span class="tag">${esc(f.subject)}</span></p>
    ${an ? analiseHtml(an) : state.text ? `<p class="muted">“${esc(state.text)}”</p>` : ""}
    <h2>Passos e documentos que costumam ser necessários</h2>
    <ol class="steps-list">${steps}</ol>
    ${docCard(state.key)}
    ${state.key === "previdenciario" ? CNIS_CARD : ""}
    <h2>O que a lei prevê</h2>
    <p>${esc(f.law)}</p>
    <details><summary>Ver fundamento jurídico e fontes →</summary><ul>${sources}</ul></details>
    <div class="card decision">
      <h2>E no seu caso?</h2>
      <p>As informações acima são gerais. O que vale para o seu caso depende dos documentos e dos detalhes, e só uma advogada pode dizer. Se quiser, a advogada analisa o seu caso.</p>
      <div class="actions">
        <button class="btn" id="to-lawyer">Quero que a advogada analise meu caso</button>
        <button class="btn secondary" id="alone">Só queria a informação</button>
      </div>
    </div>
    <p class="muted small">Informações gerais, organizadas a partir de fontes oficiais. Não constituem orientação jurídica nem substituem a análise do seu caso pela advogada.</p>`;
  bindCnis();
  bindDoc(state.key);
  $("to-lawyer").onclick = openLawyer;
  document.querySelectorAll("[data-an-lawyer]").forEach((b) => (b.onclick = openLawyer));
  $("alone").onclick = () => (e => { e.target.textContent = "Informações salvas ✓"; e.target.disabled = true; })(event);
}

function openLawyer() {
  const n = state.answers.length, curto = (x, k) => (x.length > k ? x.slice(0, k - 1) + "…" : x);
  const itens = [
    (state.assunto || state.flow?.subject) && `Assunto: ${state.assunto || state.flow.subject}`,
    state.text && state.text.length >= 40 && `Você contou: “${curto(state.text, 140)}”`,
    state.analise?.fatos?.length && `${state.analise.fatos.length} fatos organizados do seu relato`,
    n && `${n} ${n > 1 ? "respostas suas" : "resposta sua"}`,
    (state.cnisSummary || state.docSummary) && "Dados lidos do seu documento",
  ].filter(Boolean);
  $("case-summary").innerHTML = (itens.length ? itens : ["Sua pergunta", "Área identificada"]).map((t) => `<li>${esc(t)}</li>`).join("");
  $("f-area").value = state.assunto || (state.flow ? state.flow.subject : "Pergunta sem resposta pronta");
  const code = (state.faqId && ATLAS[state.faqId]) || ATLAS_AREA[state.key] || "";
  $("f-codigo").value = [code, state.faqId ? dacResumo(state.faqId) : ""].filter(Boolean).join(" · ");
  $("f-resumo").value = [state.text && `Relato: ${state.text}`, ...(state.cnisSummary ? [state.cnisSummary] : []), ...(state.docSummary ? [state.docSummary] : []), ...(state.followSummary ? [state.followSummary, ...state.answers] : state.answers.map((r, i) => `${i + 1}. ${[...state.flow.questions, OBJECTIVE_Q][i].q} ${r}`))].filter(Boolean).join("\n");
  go("lawyer");
}

// Roteiro completo da situação: perguntas (com "ⓘ O que é isso?") e, depois, lei, tribunais, prazos, documentos e passos.
const publico = (lista) => (lista || []).filter((x) => !/\[CONFERIR\]/.test(x));
function ajudaHtml(termos) {
  return (termos || []).filter((t) => GLOSSARIO[t]).map((t) => `<details class="ajuda"><summary>ⓘ O que é ${esc(t)}?</summary><p>${esc(GLOSSARIO[t])}</p></details>`).join("");
}
// Transparência: quando as fontes foram conferidas, se a advogada já revisou e um canal para apontar erro.
function seloRevisao(id) {
  const rev = typeof ROTEIROS_REVISADOS !== "undefined" && ROTEIROS_REVISADOS[id];
  const quando = rev ? `Revisado pela advogada em ${rev.split("-").reverse().join("/")}.` : `Fontes oficiais conferidas em ${typeof ROTEIROS_CONFERIDO !== "undefined" ? ROTEIROS_CONFERIDO : "2026"}. Revisão da advogada em andamento.`;
  return `<p class="selo-rev small">🗓️ ${quando} <a href="#" data-avisar="${esc(id)}">Encontrou algo desatualizado? Avise</a></p>`;
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-avisar]"); if (!a) return;
  e.preventDefault();
  const titulo = document.querySelector("#result h1")?.textContent || a.dataset.avisar;
  window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(`Olá! Vi no site uma informação que pode estar desatualizada.\nPágina: ${titulo}\nO que encontrei: `)}`, "_blank", "noopener");
});

function mostrarRoteiro(f, R, text, an) {
  const resp = [];
  state.assunto = f.q;
  const passos = an ? publico(R.passos).filter((x) => !an.feitos.some((c) => c.re.test(norm(x)))) : publico(R.passos);
  go("result");
  const bloco = (titulo, itens, cls = "") => publico(itens).length ? `<section class="rt-bloco ${cls}"><h2>${titulo}</h2><ul>${publico(itens).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>` : "";
  $("result").innerHTML = `
    <p class="eyebrow">Sua situação</p>
    <h1>${esc(an ? f.q : text)}</h1>
    <p class="lead">${esc(R.acolhe)}</p>
    ${an ? analiseHtml(an, f.id) : ""}
    <div class="card rt-perguntas"${an ? " hidden" : ""}><h2>Para entender melhor, responda rapidinho</h2>
      ${R.perguntas.map((p, i) => `<div class="rt-q" data-i="${i}"><p><strong>${esc(p.q)}</strong></p><div class="answers">${p.a.map((a) => `<button type="button" data-r="${esc(a)}">${esc(a)}</button>`).join("")}</div>${ajudaHtml(p.ajuda)}</div>`).join("")}
      <p class="small muted">Suas respostas vão junto com o pedido, para a advogada. <button type="button" class="linkish small" id="rt-pular">Pular e ver as informações</button></p>
    </div>
    ${an && an.ia ? `<section class="card rt-relacao" id="rt-relacao"><h2>O que a lei e os tribunais dizem sobre os pontos do seu relato</h2><p class="muted">Lendo o conteúdo à luz do que você contou…</p></section>` : ""}
    <div id="rt-conteudo"${an ? "" : " hidden"}>
      ${R.explica ? `<section class="rt-bloco rt-explica card"><h2>${esc(R.explica.titulo)}</h2><ol>${publico(R.explica.itens).map((x) => { const i = x.indexOf(": "); return `<li>${i > 0 && i < 60 ? `<strong>${esc(x.slice(0, i))}:</strong> ${esc(x.slice(i + 2))}` : esc(x)}</li>`; }).join("")}</ol></section>` : ""}
      ${bloco("O que a lei diz", R.lei)}
      ${bloco("Como os tribunais têm decidido", R.juris)}
      ${bloco("Onde os tribunais ainda divergem", R.divergencia, "rt-diverge")}
      ${bloco("Prazos que importam", R.prazos, "rt-prazo")}
      ${publico(R.docs).length ? `<section class="rt-bloco"><h2>Documentos para separar</h2><ul class="rt-check">${publico(R.docs).map((x) => `<li><label><input type="checkbox"> ${esc(x)}</label></li>`).join("")}</ul></section>` : ""}
      ${passos.length ? `<section class="rt-bloco"><h2>${an && an.feitos.length ? "Próximos passos (sem repetir o que você já fez)" : "O que fazer agora"}</h2><ol>${passos.map((x) => `<li data-ref="passos.${publico(R.passos).indexOf(x)}">${esc(x)}</li>`).join("")}</ol></section>` : ""}
      ${bloco("Quando é urgente procurar a advogada", R.urgente, "rt-urgente")}
      <div class="card decision"><h2>Para ter certeza da avaliação no seu caso, consulte a advogada.</h2>
        <p class="muted">As informações acima são gerais. O que vale para você depende dos documentos e dos detalhes do caso.</p>
        <div class="actions"><button class="btn" id="to-lawyer">Quero a avaliação da advogada</button><a href="#" class="btn btn-wa" data-wa>Falar no WhatsApp</a></div>
        <p class="small"><a href="#" id="rt-guia">Onde reclamar e como consultar (Procon, Banco Central, agências, Registrato) →</a></p></div>
      ${R.fontes ? `<details><summary>Fontes oficiais →</summary><ul>${R.fontes.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul></details>` : ""}
      <p class="muted small">Informação geral com base na lei e na jurisprudência. Não constitui orientação jurídica nem substitui a análise do seu caso pela advogada.</p>
      ${seloRevisao(f.id)}
    </div>`;
  const revelar = () => { const c = $("rt-conteudo"); if (!c.hidden) return; c.hidden = false; c.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const registrar = () => { state.followSummary = `${f.q} — ` + R.perguntas.map((p, i) => `${p.q} ${resp[i] || "(sem resposta)"}`).join(" | "); state.answers = resp.filter(Boolean); };
  document.querySelectorAll(".rt-q").forEach((el) => el.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => {
    const i = +el.dataset.i; resp[i] = b.dataset.r;
    el.querySelectorAll("[data-r]").forEach((x) => x.classList.toggle("on", x === b));
    registrar();
    if (R.perguntas.every((_, k) => resp[k])) revelar();
  })));
  $("rt-pular").onclick = () => { registrar(); revelar(); };
  if (an && an.ia) relacionarTrechos(f, R, text);
  document.querySelectorAll("[data-an-lawyer]").forEach((b) => (b.onclick = openLawyer));
  if (an) { state.followSummary = `${f.q} — ${state.followSummary || "relato: " + text}`; document.querySelectorAll("[data-outro]").forEach((b) => (b.onclick = () => { const id = b.dataset.outro; mostrarRoteiro({ id, q: b.textContent, area: f.area, sources: [] }, ROTEIROS[id], text, { ...an }); window.scrollTo(0, 0); })); }
  $("rt-guia").onclick = (e) => { e.preventDefault(); go("guia"); };
  $("to-lawyer").onclick = () => { if (!an) registrar(); openLawyer(); };
  state.text = state.text || text;
}

function answerQuestion(text, faqFixa) {
  const f = faqFixa || findFaq(text);
  state.faqId = f ? f.id : null;
  const key = (f && f.area) || classify(text);
  state.key = key;
  state.flow = key ? FLOWS[key] : null;
  const sources = (list) => list.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("");
  if (f && typeof ROTEIROS !== "undefined" && ROTEIROS[f.id]) return mostrarRoteiro(f, ROTEIROS[f.id], text);
  if (f) {
    const table = f.table ? `<div class="table-wrap"><table><thead><tr>${f.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${f.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="muted small">${esc(f.table.note)}</p>` : "";
    $("result").innerHTML = `
      <p class="eyebrow">Informação geral</p>
      <h1>${esc(f.q)}</h1>
      <p class="muted">Você perguntou: “${esc(text)}”</p>
      <div class="answer">${f.a.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      ${table}
      ${f.tips ? `<h2>Dicas práticas</h2><ul class="tips">${f.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      <details open><summary>Fundamento jurídico e fontes</summary><ul>${sources(f.sources)}</ul></details>
      ${seloRevisao(f.id)}
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
  // Mostra o que a lei e a jurisprudência dizem sobre a situação descrita; a avaliação do caso é da advogada.
  const regras = r.items.map((t) => t.replace(/\s*\[(VALIDAR|COMPLETAR|PESQUISAR)[^\]]*\]/g, "")).filter(Boolean);
  box.className = "fu-result info";
  box.innerHTML = `<h3>O que a lei e a jurisprudência dizem sobre isso</h3><ul>${regras.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <p><strong>Para ter certeza da avaliação no seu caso, consulte a advogada.</strong> Suas respostas já vão junto com o pedido.</p>
    <div class="actions"><button class="btn" id="fu-help">Quero a avaliação da advogada</button></div>
    <p class="small muted">Informação geral com base na lei e na jurisprudência. Não substitui a análise do seu caso com os documentos.</p>`;
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
      <p>Lemos <strong>${r.vinculos.length} vínculo(s)</strong> no seu extrato.</p>
      ${r.declared ? `<p class="warn-text">Este arquivo é a lista de relações <strong>declaradas no pedido</strong>, não o extrato CNIS completo. Se puder, envie também o <strong>Extrato de Contribuição (CNIS)</strong>.</p>` : ""}
      <details open><summary>Ver vínculos lidos</summary><div class="table-wrap"><table><thead><tr><th>Origem</th><th>Tipo</th><th>Início</th><th>Fim</th></tr></thead><tbody>
        ${r.vinculos.map((v) => `<tr><td>${esc(v.origem)}</td><td>${esc(v.tipo)}</td><td>${fmtDate(v.start)}</td><td>${v.end ? fmtDate(v.end) : "sem data"}</td></tr>`).join("")}
      </tbody></table></div></details>
      <div class="fu-result info">
        <h3>A leitura vai junto com o seu pedido.</h3>
        <p>A conferência dos vínculos, do tempo de contribuição e das regras que valem para você é feita pela advogada.</p>
        <div class="actions"><button class="btn" id="cnis-help">Enviar para a advogada analisar</button></div>
      </div>
      <p class="muted small">Leitura automática do arquivo, só para organizar os dados. Não é análise nem orientação jurídica.</p>`;
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
      nome: $("f-nome").value.trim(), cpf: "", email: "", telefone: $("f-tel").value.trim(), periodo: $("f-periodo").value };
    $("f-protocolo").value = protocolo;
    $("f-pacote").value = "PD1:" + btoa(unescape(encodeURIComponent(JSON.stringify(pacote))));
    const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
    enviarPedidoNuvem($("f-pacote").value);
    if (!r.ok) throw new Error(r.status);
    $("area-title").textContent = state.flow ? state.flow.caseTitle : "Pergunta enviada à advogada";
    $("area-protocolo").textContent = $("f-protocolo").value;
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
document.querySelectorAll("#shortcuts [data-topic]").forEach((b) => (b.onclick = () => mostrarSituacoes(b.dataset.topic)));
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

// Calculadoras públicas (prazo processual e prescrição penal).
Calculadoras.prazo($("calc-civel"), "civel");
Calculadoras.prazo($("calc-penal"), "penal");
Calculadoras.prescricao($("calc-prescricao"));
document.querySelectorAll("[data-calc]").forEach((b) => (b.onclick = () => {
  document.querySelectorAll("[data-calc]").forEach((x) => x.classList.toggle("on", x === b));
  document.querySelectorAll(".calc-painel").forEach((p) => (p.hidden = p.id !== "calc-" + b.dataset.calc));
}));
$("calc-advogado").onclick = () => { state.text = state.text || "Dúvida sobre prazo ou prescrição (calculadora)"; state.key = null; state.flow = null; state.answers = []; openLawyer(); };

// Se o Supabase estiver configurado, o pedido também cai direto no painel do escritório (tabela "pedidos").
async function enviarPedidoNuvem(pacote) {
  const CFG = window.SUPABASE_CONFIG; if (!CFG) return;
  try {
    await fetch(CFG.url + "/rest/v1/pedidos", { method: "POST", headers: { apikey: CFG.anonKey, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ pacote }) });
  } catch { /* o e-mail do formulário continua sendo o caminho de reserva */ }
}

// WhatsApp do escritório: em todas as etapas, levando o que a pessoa já contou.
const WA_NUMERO = "5561999733111";
function waTexto() {
  const linhas = ["Olá! Vim pela Plataforma do Direito."];
  if (state.assunto || state.flow) linhas.push(`Assunto: ${state.assunto || state.flow.subject}`);
  if (state.text) linhas.push(`Meu caso: ${state.text}`);
  if (state.answers.length && !state.followSummary && state.flow) {
    const qs = [...state.flow.questions, OBJECTIVE_Q];
    state.answers.forEach((r, i) => qs[i] && linhas.push(`- ${qs[i].q} ${r}`));
  }
  if (state.followSummary) linhas.push(state.followSummary.slice(0, 900));
  if ($("f-protocolo").value) linhas.push(`Protocolo: ${$("f-protocolo").value}`);
  return linhas.join("\n");
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-wa]");
  if (!a) return;
  e.preventDefault();
  window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(waTexto())}`, "_blank", "noopener");
});
$("outro").onclick = () => {
  $("start-form").hidden = false;
  $("outro").setAttribute("aria-pressed", "true");
  $("start-text").focus();
};

// Cada assunto abre "Qual destas situações é a sua?": a situação leva direto à informação verificada;
// "Outra situação" pede a história em poucas palavras e segue com as perguntas do assunto.
const SITUACOES = {
  previdenciario: [["Meu benefício do INSS foi negado", "indeferido"], ["Quero saber com que idade posso me aposentar", "idade-minima"], ["Estão descontando da minha aposentadoria sem autorização", "descontos-beneficio"], ["Tenho deficiência e quero me aposentar", "pcd-quem"], ["BPC/LOAS para idoso ou pessoa com deficiência", "bpc-renda"], ["Pensão por morte", "pensao-duracao"]],
  saude: [["O plano negou exame, cirurgia ou tratamento", "plano-negou"], ["O plano demora para marcar consulta ou cirurgia", "prazo-atendimento"], ["Remédio caro: plano ou SUS não fornecem", "liminar-medicamento"], ["A mensalidade do plano aumentou muito", "reajuste-idade"], ["Terapias para autismo (TEA)", "tea-terapia"], ["Fui demitido(a) ou me aposentei e quero manter o plano", "manter-plano"]],
  administrativo: [["Passei no concurso e não fui chamado(a)", "concurso-vagas"], ["Fui eliminado(a) em etapa do concurso", "concurso-eliminacao"], ["Respondo a processo disciplinar (PAD)", "pad-prazo"], ["Sou servidor(a) e um direito meu foi negado", "direitos-servidor"], ["Multa de trânsito ou suspensão da CNH", "multa-transito"], ["O poder público me causou prejuízo", "responsabilidade-estado"]],
  dividas: [["Tenho muitas dívidas e não consigo pagar", "superendividamento"], ["Apareceu empréstimo ou desconto que não fiz", "consignado-nao-contratado"], ["Caí em golpe no Pix", "pix-golpe"], ["O banco quer tomar meu carro", "busca-apreensao"], ["Meu nome foi negativado", "negativado"], ["Compras no cartão que eu não fiz", "compra-nao-reconhecida"]],
  consumidor: [["Produto com defeito", "defeito"], ["Troca e devolução de produtos", "troca-devolucao"], ["Comprei pela internet e não recebi", "compra-nao-entregue"], ["Quero desistir de uma compra", "arrependimento"], ["Cobrança indevida", "cobranca-dobro"], ["Ligações demais de cobrança ou telemarketing", "ligacoes-cobranca"], ["Cancelei curso ou faculdade e querem cobrar tudo", "cancelamento-curso"], ["Luz, água, gás ou telefone →", "@servicos"], ["Voo atrasado ou cancelado", "voo"]],
  servicos: [["Falta de energia ou aparelho queimado", "falta-energia"], ["Conta de luz ou de água muito alta", "conta-alta"], ["Me acusaram de fraude no medidor (recuperação de consumo)", "fraude-medidor"], ["Dívida de luz ou água: parcelamento, cobrança, negativação ou corte", "contas-essenciais"], ["Problema com operadora de celular ou internet", "telefonia"]],
  cartorio: [["Inventário de quem faleceu", "inventario-cartorio"], ["Divórcio", "divorcio-cartorio"], ["União estável", "uniao-estavel"], ["Sacar FGTS ou saldo de quem faleceu", "alvara-valores"], ["Imóvel: registro, escritura, matrícula, usucapião →", "@imovel"], ["Meu nome foi protestado em cartório", "protesto"]],
  imovel: [["Regularizar ou registrar meu imóvel", "reurb"], ["Paguei o imóvel e não recebi a escritura (adjudicação)", "adjudicacao"], ["Moro há anos e não tenho documento (usucapião)", "usucapiao"], ["Tirar a certidão de matrícula", "certidao-matricula"]],
};
const OUTRA = "Outra situação — contar com minhas palavras";
function mostrarSituacoes(tema) {
  const key = tema === "dividas" || tema === "servicos" ? "consumidor" : tema === "imovel" ? "cartorio" : tema;
  Object.assign(state, { text: "", answers: [], qi: 0, key, flow: FLOWS[key], followSummary: null, cnisSummary: null, docSummary: null, faqId: null, assunto: null, analise: null });
  $("messages").innerHTML = "";
  $("qcount").textContent = ""; $("voltar").hidden = true;
  go("chat"); setStep(1);
  say("Vamos lá. Qual destas situações é a sua?");
  const lista = SITUACOES[tema];
  offer([...lista.map((x) => x[0]), OUTRA], (o) => {
    if (o === OUTRA) return pedirHistoria();
    const [txt, id] = lista.find((x) => x[0] === o);
    if (id.startsWith("@")) return mostrarSituacoes(id.slice(1));
    // Situação com roteiro próprio, mesmo sem pergunta frequente correspondente.
    const f = FAQ.find((x) => x.id === id) || (ROTEIROS[id] && { id, q: txt, area: key, sources: [] });
    if (f) answerQuestion(txt, f); else begin(key);
  });
}
// Relato livre: aponta as situações com roteiro que combinam com o que a pessoa escreveu.
const PISTAS = {
  "contas-essenciais": ["energisa", "neoenergia", "energia eletrica", "conta de luz", "contas de energia", "caesb", "conta de agua", "parcelamento", "concessionaria", "corte"],
  negativado: ["negativ", "nome sujo", "serasa", "spc", "score"],
  "ligacoes-cobranca": ["ligac", "ligam", "liga todo", "cobrancas insistentes", "insistent", "telemarketing", "mensagens de cobranca"],
  "cobranca-dobro": ["cobranca indevida", "cobrado indevid", "cobraram", "nao devo", "ja paguei", "cobranca errada"],
  superendividamento: ["muitas dividas", "nao consigo pagar", "superendivid", "endividad", "salario todo"],
  "consignado-nao-contratado": ["emprestimo que nao fiz", "consignado", "nao contratei"],
  "pix-golpe": ["pix", "golpe"],
  "busca-apreensao": ["tomar meu carro", "busca e apreensao", "apreens"],
  "compra-nao-reconhecida": ["nao reconhec", "cartao clonado", "compras que nao fiz"],
  protesto: ["protest"],
  defeito: ["defeito", "quebrou", "estragou"],
  "troca-devolucao": ["troca", "devolu"],
  "compra-nao-entregue": ["nao recebi", "nao chegou", "nao entreg"],
  arrependimento: ["desistir", "arrepend"],
  "cancelamento-curso": ["curso", "faculdade", "academia"],
  "falta-energia": ["falta de energia", "queimou", "queimado"],
  "conta-alta": ["conta alta", "conta muito alta", "conta veio"],
  "fraude-medidor": ["medidor", "recuperacao de consumo"],
  telefonia: ["operadora", "internet", "celular"],
  voo: ["voo", "companhia aerea", "bagagem"],
  "concurso-vagas": ["concurso", "dentro das vagas", "nao me chamaram", "nao fui chamad", "nomeac", "cadastro reserva"],
  "concurso-eliminacao": ["eliminad", "reprovad", "teste fisico", "psicotecnico", "heteroidentificacao"],
  "pad-prazo": ["processo disciplinar", "\\bpad\\b", "sindicancia"],
  "direitos-servidor": ["servidor", "licenca", "progressao", "adicional", "abono de permanencia"],
  "multa-transito": ["multa", "cnh", "detran", "suspensao da carteira"],
  "inventario-cartorio": ["faleceu", "falecimento", "inventario", "partilha", "heranca"],
  "divorcio-cartorio": ["divorcio", "separar", "separacao"],
  "uniao-estavel": ["uniao estavel"],
  usucapiao: ["usucapiao", "moro ha", "sem escritura"],
  "bpc-renda": ["bpc", "loas"],
  "pensao-duracao": ["pensao por morte"],
  "plano-negou": ["plano negou", "negou a cirurgia", "negou o exame", "negou cobertura"],
  indeferido: ["inss negou", "indeferid", "negaram meu beneficio"],
  "descontos-beneficio": ["desconto na aposentadoria", "descontando", "desconto no beneficio"],
};
// Lê o relato e separa o que a pessoa já contou: o que aconteceu, valores e onde já reclamou.
const CANAIS = [
  { nome: "a própria empresa", re: /reclam\w* (junto )?(a|à|com a|na) empresa|sac\b|ouvidoria/, passo: /reclame com a empresa|sac\b|ouvidoria/ },
  { nome: "o consumidor.gov.br", re: /consumidor\.?gov/, passo: /consumidor\.?gov/ },
  { nome: "o Procon", re: /procon/, passo: /procon/ },
  { nome: "o Banco Central", re: /banco central|bacen/, passo: /banco central|bacen/ },
  { nome: "a Aneel", re: /aneel/, passo: /aneel/ },
  { nome: "a Anatel", re: /anatel/, passo: /anatel/ },
  { nome: "a ANS", re: /\bans\b/, passo: /\bans\b/ },
];
function lerRelato(t) {
  const n = norm(t), fatos = [];
  const empresa = (t.match(/\b(Energisa|Neoenergia|CEB|Caesb|Enel|Light|Cemig|Sabesp|Vivo|Claro|Tim|Oi|Nubank|Ita[uú]|Bradesco|Santander|Caixa|Banco do Brasil|Serasa)\b/i) || [])[0];
  if (empresa) fatos.push(`Empresa envolvida: ${empresa[0].toUpperCase() + empresa.slice(1)}`);
  const valor = (t.match(/(R\$\s*)?\d[\d.,]*\s*(mil\s*)?(reais)?/gi) || []).find((v) => /R\$|reais|mil/i.test(v));
  if (valor) fatos.push(`Valor mencionado: ${valor.trim()}`);
  if (/parcel/.test(n)) fatos.push("Havia um parcelamento da dívida");
  if (/mud\w* de endereco|mudanca de endereco|me mudei/.test(n)) fatos.push("Houve mudança de endereço");
  if (/negativ|serasa|spc|nome sujo/.test(n)) fatos.push("Seu nome foi negativado");
  if (/cobranca|ligac|ligam/.test(n) && /insistent|diari|todo dia|varias vezes/.test(n)) fatos.push("Você recebe cobranças insistentes");
  if (/cort/.test(n)) fatos.push("Há corte ou ameaça de corte do serviço");
  const feitos = CANAIS.filter((c) => c.re.test(n)).map((c) => ({ nome: c.nome, re: c.passo }));
  return { fatos, feitos };
}
function analiseHtml(an, atual) {
  const outros = (an.ids || []).filter((id) => id !== atual);
  const nomes = {}; Object.values(SITUACOES).flat().forEach(([txt, id]) => (nomes[id] = txt));
  const tentou = an.tentou || an.feitos.map((c) => `Reclamou em ${c.nome}`);
  state.followSummary = [an.fatos.length && "Fatos: " + an.fatos.join("; "), tentou.length && "Já fez: " + tentou.join("; "), (an.faltando || []).length && "Falta saber: " + an.faltando.join("; ")].filter(Boolean).join(" | ");
  return `<div class="card rt-analise"><h2>O que entendemos do seu relato</h2>
    ${an.fatos.length ? `<ul>${an.fatos.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    ${tentou.length ? `<p><strong>O que você já fez:</strong></p><ul>${tentou.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="small muted">Por isso não repetimos esses passos.</p>` : ""}
    ${outros.length ? `<p><strong>Seu relato também envolve:</strong></p><div class="answers">${outros.map((id) => `<button type="button" data-outro="${id}">${esc(nomes[id] || titulo(id))}</button>`).join("")}</div>` : ""}
    ${(an.faltando || []).length ? `<p><strong>O que a advogada provavelmente vai querer saber:</strong></p><ul>${an.faltando.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    <div class="an-cta"><p><strong>Seu caso já está organizado.</strong> Se quiser, envie para a advogada: ela recebe este resumo e retorna para avaliar o seu caso.</p>
      <div class="actions"><button class="btn" type="button" data-an-lawyer>Enviar meu caso para a advogada</button><a href="#" class="btn btn-wa" data-wa>WhatsApp</a></div></div>
    <p class="small muted">${an.ia ? "Leitura feita por inteligência artificial apenas para organizar o seu relato; o texto não é guardado. " : ""}Se entendemos algo errado, a advogada corrige na análise.</p></div>`;
}
// Catálogo de assuntos com roteiro (para a IA escolher) e título de cada um.
function catalogo() {
  const m = {};
  Object.values(SITUACOES).flat().forEach(([txt, id]) => { if (ROTEIROS[id]) m[id] = txt.replace(/\s*→$/, ""); });
  FAQ.forEach((f) => { if (ROTEIROS[f.id] && !m[f.id]) m[f.id] = f.q; });
  return m;
}
function titulo(id) { return catalogo()[id] || id; }
async function api(corpo, ms = 25000) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  try { const r = await fetch("/api/analisar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo), signal: c.signal }); return r.ok ? await r.json() : null; }
  catch { return null; } finally { clearTimeout(t); }
}
async function analisarComIA(t) {
  // Limite por aparelho: a leitura com IA é para quem traz um caso real, não para uso livre.
  const hoje = new Date().toISOString().slice(0, 10);
  let uso = {}; try { uso = JSON.parse(localStorage.getItem("pd-ia-uso") || "{}"); } catch {}
  if (uso.dia !== hoje) uso = { dia: hoje, n: 0 };
  if (uso.n >= 3) return null;
  uso.n++; try { localStorage.setItem("pd-ia-uso", JSON.stringify(uso)); } catch {}
  const cat = catalogo();
  const d = await api({ modo: "triagem", relato: t, catalogo: Object.entries(cat).map(([id, titulo]) => ({ id, titulo })) });
  if (d && d.fora_do_tema) return { fora: true };
  if (!d || !Array.isArray(d.assuntos)) return null;
  const ids = d.assuntos.map((a) => a.id).filter((id) => cat[id] && ROTEIROS[id]).slice(0, 3);
  if (!ids.length) return null;
  return { ia: true, ids, fatos: (d.fatos || []).slice(0, 8), tentou: (d.ja_tentou || []).slice(0, 6), faltando: (d.faltando || []).slice(0, 3), feitos: [] };
}
async function relacionarTrechos(f, R, text) {
  const trechos = [];
  const add = (k, lista) => publico(lista || []).forEach((x, i) => trechos.push({ ref: `${k}.${i}`, texto: x }));
  if (R.explica) add("explica", R.explica.itens);
  add("lei", R.lei); add("juris", R.juris); add("divergencia", R.divergencia); add("prazos", R.prazos); add("passos", R.passos);
  const d = await api({ modo: "relacionar", relato: text, titulo: f.q, trechos });
  const box = $("rt-relacao"); if (!box) return;
  const por = Object.fromEntries(trechos.map((x) => [x.ref, x.texto]));
  const itens = (d && d.trechos || []).filter((x) => por[x.ref] && !x.ref.startsWith("passos"));
  if (!itens.length) { box.remove(); return; }
  box.innerHTML = `<h2>O que a lei e os tribunais dizem sobre os pontos do seu relato</h2>
    <ol>${itens.map((x) => `<li><p><strong>${esc(x.ligacao)}</strong></p><p class="muted">${esc(por[x.ref])}</p></li>`).join("")}</ol>
    <p><strong>Para ter certeza da avaliação no seu caso, consulte a advogada.</strong></p>
    <div class="actions"><button class="btn" type="button" data-an-lawyer>Quero que a advogada avalie meu caso</button></div>`;
  box.querySelector("[data-an-lawyer]").onclick = openLawyer;
  (d.ja_feitos || []).forEach((ref) => document.querySelector(`[data-ref="${ref}"]`)?.remove());
  state.followSummary = (state.followSummary || "") + " | Pontos relacionados: " + itens.map((x) => x.ligacao).join(" / ");
}
function sugerirSituacoes(t) {
  const n = norm(t);
  const nomes = {}; Object.values(SITUACOES).flat().forEach(([txt, id]) => (nomes[id] = txt));
  const cat = catalogo();
  let ids = Object.entries(PISTAS).map(([id, ks]) => [id, ks.filter((k) => new RegExp("\\b" + k).test(n)).length]).filter(([id, sc]) => sc && cat[id]).sort((a, b) => b[1] - a[1]).map(([id]) => id);
  // Também usa as palavras-chave das perguntas frequentes (cobre todos os assuntos com roteiro).
  const fq = findFaq(t);
  if (fq && cat[fq.id] && !ids.includes(fq.id)) ids.splice(ids.length ? 1 : 0, 0, fq.id);
  ids = ids.slice(0, 3);
  if (t.length >= 60 && window.SUPABASE_CONFIG?.ia !== false) {
    say("Lendo seu relato com atenção…");
    analisarComIA(t).then((ai) => mostrarAnalise(t, ai || { ...lerRelato(t), ids }));
    return;
  }
  mostrarAnalise(t, { ...lerRelato(t), ids });
}
function perguntarArea() {
  say("Com quem é a questão?");
  offer(["INSS", "Órgão público", "Plano de saúde ou SUS", "Uma empresa ou banco", "Cartório", "Outro"], (o) => {
    const map = { "INSS": "previdenciario", "Órgão público": "administrativo", "Plano de saúde ou SUS": "saude", "Uma empresa ou banco": "consumidor", "Cartório": "cartorio" };
    if (!map[o]) { say("Esse assunto talvez não esteja entre os temas deste portal. A advogada pode avaliar se ajuda ou indicar um(a) colega."); return offer(["Quero falar com a advogada"], openLawyer); }
    state.key = map[o]; state.flow = FLOWS[map[o]]; ask();
  });
}
function mostrarAnalise(t, an) {
  if (an.fora) {
    say("Esse assunto não está entre os temas que este portal explica. Se quiser, conte para a advogada: ela avalia se pode ajudar ou indica um(a) colega da área.");
    offer(["Quero falar com a advogada", "Ver os temas do portal"], (o) => (o.startsWith("Quero") ? openLawyer() : go("home")));
    return;
  }
  const ids = an.ids, nomes = catalogo();
  state.analise = an;
  // Relato curto e sem pistas: aí sim faz perguntas.
  if (!ids.length && (t.length < 120 || !state.flow)) return state.flow ? ask() : perguntarArea();
  setStep(2);
  say("Li seu relato. Separei o que entendemos e as informações que se aplicam.");
  setTimeout(() => {
    if (ids.length) return mostrarRoteiro({ id: ids[0], q: nomes[ids[0]], area: state.key, sources: [] }, ROTEIROS[ids[0]], t, an);
    state.answers = []; renderResult(an); go("result"); setStep(3);
  }, 600);
}
$("dividas").onclick = () => mostrarSituacoes("dividas");

bindHomeDoc();
// Botão flutuante do WhatsApp só aparece quando o da página inicial sai da tela (não cobre os assuntos).
(() => {
  const hero = $("wa-hero"), fl = document.querySelector(".wa-float");
  if (!hero || !fl) return;
  const ver = () => { const r = hero.getBoundingClientRect(); fl.classList.toggle("oculto", !!$("view-lawyer")?.offsetParent || r.height > 0 && r.top < innerHeight && r.bottom > 0 || r.height > 0 && r.top >= innerHeight); };
  addEventListener("scroll", ver, { passive: true }); addEventListener("resize", ver); setInterval(ver, 800); ver();
})();
