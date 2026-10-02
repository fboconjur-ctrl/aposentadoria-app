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

function startChat(text, forcedKey) {
  Object.assign(state, { text, answers: [], qi: 0 });
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
  const steps = f.steps.map((s) => `<li><strong>${esc(s.t)}</strong><br><span class="muted">${esc(s.d)}</span>${s.link ? `<br><a href="${s.link[1]}" target="_blank" rel="noopener">${esc(s.link[0])} →</a>` : ""}</li>`).join("");
  const sources = f.sources.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("");
  $("result").innerHTML = `
    <h1>Entendemos sua situação</h1>
    <p><span class="tag">${esc(f.subject)}</span></p>
    ${state.text ? `<p class="muted">“${esc(state.text)}”</p>` : ""}
    <h2>O que você pode fazer agora</h2>
    <ol class="steps-list">${steps}</ol>
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
  $("to-lawyer").onclick = openLawyer;
  $("alone").onclick = () => (e => { e.target.textContent = "Orientação salva ✓"; e.target.disabled = true; })(event);
}

function openLawyer() {
  const n = state.flow.questions.length + 1;
  $("case-summary").innerHTML = [
    "Relato",
    `${n} perguntas respondidas`,
    "Documentos necessários identificados",
    "Orientação inicial concluída",
  ].map((t) => `<li>${t}</li>`).join("");
  const slots = ["06/10 — 10h", "06/10 — 16h", "07/10 — 9h", "08/10 — 14h"];
  $("slots").innerHTML = "";
  slots.forEach((s) => {
    const b = document.createElement("button");
    b.textContent = s;
    b.onclick = () => {
      document.querySelectorAll("#slots button").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      state.slot = s;
      $("confirm-slot").disabled = false;
    };
    $("slots").appendChild(b);
  });
  $("confirm-slot").disabled = true;
  go("lawyer");
}

$("confirm-slot").onclick = () => {
  $("area-title").textContent = state.flow ? state.flow.caseTitle : $("area-title").textContent;
  if (state.slot) $("area-meeting").textContent = state.slot;
  go("area");
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
