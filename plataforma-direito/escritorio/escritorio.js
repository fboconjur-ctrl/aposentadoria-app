// Escritório — tudo gira em torno do CLIENTE. Prazos, compromissos, tarefas, pagamentos,
// processos e publicações apontam para o mesmo cliente e aparecem na ficha dele e na tela Hoje.
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const DAY = 864e5;
const hoje = new Date(); hoje.setHours(12, 0, 0, 0);
const fmt = (x) => x.toLocaleDateString("pt-BR");
const dias = (x) => Math.round((x - hoje) / DAY);
const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
const hojeIso = iso(hoje);
const deIso = (k) => new Date(k + "T12:00");
const brData = (k) => k.split("-").reverse().join("/");
const semAcento = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const soDig = (t) => String(t || "").replace(/\D/g, "");
const so20 = soDig;
const novoId = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const ETAPAS = ["Novo pedido", "Consulta marcada", "Proposta enviada", "Contratado", "Caso ativo", "Encerrado", "Indicado a colega"];
const TRIB = { "8.07": "TJDFT", "4.01": "TRF1", "5.10": "TRT10", "8.26": "TJSP", "8.13": "TJMG", "8.19": "TJRJ", "8.09": "TJGO" };
const RAMO = { 1: "STF", 3: "STJ", 4: "Justiça Federal", 5: "Justiça do Trabalho", 6: "Justiça Eleitoral", 8: "Justiça Estadual" };
const CNJ_RE = /\b(\d{7})-?(\d{2})\.?(\d{4})\.?(\d)\.?(\d{2})\.?(\d{4})\b/g;
const fmtCnj = (m) => `${m[1]}-${m[2]}.${m[3]}.${m[4]}.${m[5]}.${m[6]}`;
const tribunalDe = (m) => TRIB[`${m[4]}.${m[5]}`] || `${RAMO[m[4]] || "Tribunal"} ${m[5]}`;
const mascara = (n) => (n = so20(n)).length === 20 ? `${n.slice(0, 7)}-${n.slice(7, 9)}.${n.slice(9, 13)}.${n[13]}.${n.slice(14, 16)}.${n.slice(16)}` : n;
const numBR = (t) => { const s = String(t || "").replace(/r\$\s*/i, "").trim(); const n = /,\d{1,2}$/.test(s) ? s.replace(/\./g, "").replace(",", ".") : s.replace(/\.(?=\d{3}\b)/g, "").replace(/,/g, ""); return Math.round(parseFloat(n) * 100) / 100 || 0; };
const reaisBR = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const addMes = (k, n) => { const [a, m, d] = k.split("-").map(Number); const x = new Date(a, m - 1 + n, d, 12); if (x.getDate() !== d) x.setDate(0); return iso(x); };

// ---------- Dados ----------
const CRM_KEY = "pd-crm", ITENS_KEY = "pd-itens", FIN_KEY = "pd-financeiro";
let clientes = ler(CRM_KEY, []);
let itens = ler(ITENS_KEY, []);      // {id, tipo: prazo|compromisso|tarefa, texto, quando, hora, local, cli, feita}
let fin = ler(FIN_KEY, []);          // {id, tipo: receita|despesa, desc, valor, venc, pago, cli, parcela, cat}
const salvarCrm = () => gravar(CRM_KEY, clientes);
const salvarItens = () => gravar(ITENS_KEY, itens);
const salvarFin = () => gravar(FIN_KEY, fin);
const cliPorId = (id) => clientes.find((c) => c.id === id);
const procsDe = (c) => [...String(c?.procs || "").matchAll(CNJ_RE)].map((m) => so20(m[0]));
const cliDoProc = (n) => clientes.find((c) => procsDe(c).includes(so20(n)));
const primeiroNome = (n) => String(n || "").trim().split(/\s+/)[0] || "";

// Migração única do formato antigo (abas separadas) para o formato ligado ao cliente.
(function migrar() {
  if (localStorage.getItem("pd-migrado-v2")) return;
  // Só marca como migrado se havia algo no formato antigo (num aparelho novo, os dados chegam da nuvem depois).
  if (!["pd-escritorio-importados", "pd-tarefas", "pd-agenda", "pd-crm", "pd-financeiro"].some((k) => localStorage.getItem(k))) return;
  const casos = ler("pd-escritorio-importados", []);
  const cliDoCaso = {};
  casos.forEach((k) => {
    let c = clientes.find((x) => x.caso === k.id) || clientes.find((x) => semAcento(x.nome) === semAcento(k.nome));
    if (!c) { c = { id: novoId("CL-"), criado: new Date().toISOString(), nome: k.nome, cpf: "", tel: k.contato?.telefone || "", email: k.contato?.email || "", area: k.area, origem: k.origem, etapa: k.etapa, hist: [] }; clientes.push(c); }
    c.assunto ||= k.titulo; c.resumo ||= k.resumo !== "—" ? k.resumo : "";
    if (so20(k.id).length === 20 && !procsDe(c).includes(so20(k.id))) c.procs = [c.procs, mascara(k.id)].filter(Boolean).join("\n");
    (k.prazos || []).forEach((p) => itens.push({ id: novoId("I-"), tipo: "prazo", texto: p.o + (p.f ? ` (${p.f})` : ""), quando: iso(new Date(p.data)), cli: c.id, feita: false }));
    cliDoCaso[k.id] = c.id;
  });
  const conv = (v) => { if (!v) return ""; const [t, id] = v.split(/:(.+)/); return t === "caso" ? cliDoCaso[id] || "" : id || v; };
  ler("pd-tarefas", []).forEach((t) => itens.push({ id: t.id, tipo: /vence/.test(t.texto) ? "prazo" : "tarefa", texto: t.texto, quando: t.quando, cli: conv(t.vinculo), feita: !!t.feita }));
  ler("pd-agenda", []).forEach((a) => itens.push({ id: a.id, tipo: "compromisso", texto: `${a.tipo}: ${a.titulo}`, quando: a.data, hora: a.hora, local: a.local, cli: conv(a.vinculo), feita: false }));
  fin.forEach((l) => { if (l.vinculo !== undefined) { l.cli = conv(l.vinculo); delete l.vinculo; } });
  const ETAPA_NOVA = { "Orientação": "Novo pedido", "Consulta sugerida": "Novo pedido", "Agendada": "Consulta marcada", "Realizada": "Consulta marcada", "Proposta": "Proposta enviada" };
  clientes.forEach((c) => { c.etapa = ETAPA_NOVA[c.etapa] || c.etapa || "Novo pedido"; if (c.acao) { itens.push({ id: novoId("I-"), tipo: "tarefa", texto: c.acao, quando: c.quando || "", cli: c.id, feita: false }); delete c.acao; delete c.quando; } });
  salvarCrm(); salvarItens(); salvarFin();
  localStorage.setItem("pd-migrado-v2", "1");
})();

// ---------- Navegação ----------
let historico = [];
function go(view, { semHistorico } = {}) {
  const atual = document.querySelector(".oview.on")?.id.slice(2);
  if (!semHistorico && atual && atual !== view) historico.push(atual);
  document.querySelectorAll(".oview").forEach((v) => v.classList.toggle("on", v.id === "v-" + view));
  const grupo = ["hoje", "clientes"].includes(view) ? view : view === "ficha" ? "clientes" : "mais";
  document.querySelectorAll(".nav[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === grupo));
  window.scrollTo(0, 0);
  if (view === "hoje") renderHoje();
  if (view === "clientes") renderClientes();
  if (view === "fin") renderFin();
}
document.addEventListener("click", (e) => {
  const v = e.target.closest("[data-view]"); if (v) { e.preventDefault(); historico = []; return go(v.dataset.view); }
  const vt = e.target.closest("[data-voltar]"); if (vt) { e.preventDefault(); return go(historico.pop() || "hoje", { semHistorico: true }); }
  const f = e.target.closest("[data-cli]"); if (f) { e.preventDefault(); return abrirFicha(f.dataset.cli); }
});

// ---------- Itens (prazo, compromisso, tarefa) + parcelas: uma linha do mesmo jeito em todo lugar ----------
const ICONE = { prazo: "⚖️", compromisso: "📅", tarefa: "✓", parcela: "💰" };
function linha(x, { comCliente = true } = {}) {
  const c = cliPorId(x.cli);
  const atras = !x.feita && x.quando && x.quando < hojeIso;
  const quando = x.quando ? `${x.quando === hojeIso ? "hoje" : fmt(deIso(x.quando))}${x.hora ? " " + x.hora : ""}` : "sem data";
  const cliTxt = comCliente && c ? ` · <button class="linkish small" data-cli="${c.id}">${esc(c.nome)}</button>` : "";
  if (x.tipo === "parcela") return `<li class="item" data-fin-id="${x.id}"><span class="ico" title="Pagamento">${ICONE.parcela}</span><div class="t-txt">Receber ${reaisBR(x.valor)} <span class="muted small">${esc(x.desc)}${x.parcela ? ` (${x.parcela})` : ""}</span><br><span class="small ${atras ? "atrasada" : "muted"}">${atras ? "atrasado · " : ""}${quando}</span>${cliTxt}</div><button class="linkish small" data-fa="pagar">recebido</button></li>`;
  return `<li class="item${x.feita ? " feita" : ""}" data-item="${x.id}"><input type="checkbox"${x.feita ? " checked" : ""} aria-label="Concluir"><span class="ico" title="${x.tipo}">${ICONE[x.tipo] || "✓"}</span>
    <div class="t-txt">${esc(x.texto)}<br><span class="small ${atras ? "atrasada" : "muted"}">${atras ? "atrasado · " : ""}${quando}</span>${x.local ? ` <span class="small muted">· ${esc(x.local)}</span>` : ""}${cliTxt}
    ${x.tipo === "compromisso" && x.quando ? ` · <a class="small" href="${linkGoogle(x)}" target="_blank" rel="noopener">Google Agenda</a>` : ""}</div>
    <button class="del" title="Excluir" aria-label="Excluir">×</button></li>`;
}
function linkGoogle(x) {
  const ini = new Date(`${x.quando}T${x.hora || "09:00"}:00`), fim = new Date(ini.getTime() + 3600e3);
  const g = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return "https://calendar.google.com/calendar/render?" + new URLSearchParams({ action: "TEMPLATE", text: x.texto + (cliPorId(x.cli) ? ` — ${cliPorId(x.cli).nome}` : ""), dates: `${g(ini)}/${g(fim)}`, location: x.local || "" });
}
const ordem = (a, b) => (a.quando || "9999").localeCompare(b.quando || "9999") || (a.hora || "99").localeCompare(b.hora || "99");
const parcelasAbertas = () => fin.filter((l) => l.tipo === "receita" && !l.pago).map((l) => ({ ...l, tipo: "parcela", quando: l.venc, receita: true }));
function renderTudo() {
  if ($("v-hoje").classList.contains("on")) renderHoje();
  if ($("v-clientes").classList.contains("on")) renderClientes();
  if ($("v-ficha").classList.contains("on") && fichaAtual) abrirFicha(fichaAtual, { manterScroll: true });
  if ($("v-fin").classList.contains("on")) renderFin();
}
document.addEventListener("change", (e) => {
  const li = e.target.closest("[data-item]"); if (!li || e.target.type !== "checkbox") return;
  const x = itens.find((i) => i.id === li.dataset.item); x.feita = e.target.checked; x.concluida = x.feita ? new Date().toISOString() : null;
  salvarItens(); setTimeout(renderTudo, 250);
});
document.addEventListener("click", (e) => {
  const d = e.target.closest(".item .del"); if (d) { itens = itens.filter((x) => x.id !== d.closest("[data-item]").dataset.item); salvarItens(); renderTudo(); return; }
  const p = e.target.closest("[data-fin-id] [data-fa=pagar]");
  if (p) { const l = fin.find((x) => x.id === p.closest("[data-fin-id]").dataset.finId); l.pago = hojeIso; salvarFin(); renderTudo(); }
});

// ---------- Anotar rápido: uma linha, o sistema entende e põe no lugar certo ----------
const DIAS_SEM = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
function entender(texto, cliFixo) {
  const t = semAcento(texto);
  const r = { texto: texto.trim(), tipo: "tarefa", quando: "", hora: "", valor: 0, cli: cliFixo || "", candidatos: [] };
  // data
  let m;
  if (/\bdepois de amanha\b/.test(t)) r.quando = iso(new Date(hoje.getTime() + 2 * DAY));
  else if (/\bamanha\b/.test(t)) r.quando = iso(new Date(hoje.getTime() + DAY));
  else if (/\bhoje\b/.test(t)) r.quando = hojeIso;
  else if ((m = t.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/))) {
    let a = m[3] ? +m[3] : hoje.getFullYear(); if (a < 100) a += 2000;
    let dt = new Date(a, m[2] - 1, +m[1], 12); if (!m[3] && dt < hoje - 30 * DAY) dt = new Date(a + 1, m[2] - 1, +m[1], 12);
    r.quando = iso(dt);
  } else if ((m = t.match(/\bem (\d{1,3}) dias?\b/))) r.quando = iso(new Date(hoje.getTime() + m[1] * DAY));
  else if ((m = t.match(/\bdia (\d{1,2})\b/))) { let dt = new Date(hoje.getFullYear(), hoje.getMonth(), +m[1], 12); if (dt < hoje) dt = new Date(hoje.getFullYear(), hoje.getMonth() + 1, +m[1], 12); r.quando = iso(dt); }
  else { const i = DIAS_SEM.findIndex((d) => new RegExp(`\\b${d}(-feira)?\\b`).test(t)); if (i >= 0) { const n = ((i - hoje.getDay() + 7) % 7) || 7; r.quando = iso(new Date(hoje.getTime() + n * DAY)); } }
  if ((m = t.match(/\b(\d{1,2})\s?(?:h|:)\s?(\d{2})?\b(?!\/)/)) && +m[1] < 24) r.hora = `${m[1].padStart(2, "0")}:${m[2] || "00"}`;
  // valor
  if ((m = t.match(/r\$\s*([\d.,]+)/) || t.match(/\b(?:pagou|recebi|recebido|pago|paga|honorarios?|parcela|cobrar)\D{0,12}([\d][\d.,]*)/))) r.valor = numBR(m[1]);
  // tipo
  if (r.valor && /pagou|recebi|recebido|\bpago\b|\bpaga\b/.test(t)) r.tipo = "recebimento";
  else if (r.valor) r.tipo = "a receber";
  else if (/audiencia|consulta|reuniao|pericia|diligencia|sustentacao|atendimento|despacho com/.test(t)) r.tipo = "compromisso";
  else if (/\bprazo\b|\bvence|contestac|replica|recurso|embargos|manifestac|contrarraz|impugnac|apelac|agravo/.test(t)) r.tipo = "prazo";
  // cliente (nome completo ou primeiro nome)
  if (!cliFixo) {
    const ach = clientes.filter((c) => { const n = semAcento(c.nome); if (n.length >= 3 && t.includes(n)) return true; const p = semAcento(primeiroNome(c.nome)); return p.length >= 3 && new RegExp(`\\b${p}\\b`).test(t); });
    const exato = ach.filter((c) => t.includes(semAcento(c.nome)));
    const lista = exato.length ? exato : ach;
    if (lista.length === 1) r.cli = lista[0].id; else r.candidatos = lista.map((c) => c.id);
    const proc = [...texto.matchAll(CNJ_RE)][0]; if (!r.cli && proc) r.cli = cliDoProc(proc[0])?.id || "";
  }
  return r;
}
const TIPOS = ["tarefa", "prazo", "compromisso", "a receber", "recebimento"];
let pendente = null;
function mostrarPrevia(r, alvo) {
  pendente = r;
  const opcCli = `<option value="">— sem cliente —</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}"${c.id === r.cli ? " selected" : ""}>${esc(c.nome)}</option>`).join("");
  alvo.hidden = false;
  alvo.innerHTML = `<div class="qa-linha">
    <select id="qp-tipo" class="search">${TIPOS.map((x) => `<option${x === r.tipo ? " selected" : ""}>${x}</option>`).join("")}</select>
    <select id="qp-cli" class="search">${opcCli}</select>
    <input id="qp-data" class="search" type="date" value="${r.quando}">
    <input id="qp-hora" class="search" type="time" value="${r.hora}">
    <input id="qp-valor" class="search" inputmode="decimal" placeholder="valor" value="${r.valor ? String(r.valor).replace(".", ",") : ""}">
    <button class="btn" id="qp-ok" type="button">Salvar</button><button class="back" id="qp-x" type="button">Cancelar</button></div>
    <p class="small muted" style="margin:6px 0 0">Confira e aperte Enter de novo (ou Salvar).</p>
    ${r.candidatos.length > 1 ? `<p class="small atrasada">Qual cliente? Encontrei ${r.candidatos.length} com esse nome — escolha acima.</p>` : ""}`;
  const ajusta = () => { const tp = $("qp-tipo").value; $("qp-valor").hidden = !/receb/.test(tp); $("qp-hora").hidden = tp !== "compromisso"; };
  $("qp-tipo").onchange = ajusta; ajusta();
  $("qp-x").onclick = () => { alvo.hidden = true; pendente = null; };
  $("qp-ok").onclick = () => salvarPrevia(alvo);
}
function salvarPrevia(alvo) {
  const r = pendente; if (!r) return;
  const tipo = $("qp-tipo").value, cli = $("qp-cli").value, quando = $("qp-data").value, hora = $("qp-hora").value, valor = numBR($("qp-valor").value);
  if (/receb/.test(tipo)) {
    if (!valor) { $("qp-valor").focus(); return; }
    fin.push({ id: novoId("F-"), tipo: "receita", cat: "Honorários", desc: r.texto, valor, venc: quando || hojeIso, pago: tipo === "recebimento" ? quando || hojeIso : null, cli });
    salvarFin();
  } else {
    itens.push({ id: novoId("I-"), tipo, texto: r.texto, quando, hora: tipo === "compromisso" ? hora : "", cli, feita: false });
    salvarItens();
  }
  const c = cliPorId(cli); if (c) { (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Anotado: ${r.texto}` }); salvarCrm(); }
  alvo.hidden = true; pendente = null;
  $("qa-texto").value = ""; if ($("fi-qa-texto")) $("fi-qa-texto").value = "";
  renderTudo();
}
// 1º Enter mostra o que foi entendido; 2º Enter (sem mudar o texto) salva.
function anotar(t, cliFixo, alvo) {
  if (!t) return;
  if (pendente && !alvo.hidden && pendente.texto === t) return salvarPrevia(alvo);
  ["qa-prev", "fi-qa-prev"].forEach((id) => { if ($(id) !== alvo) { $(id).hidden = true; $(id).innerHTML = ""; } });
  mostrarPrevia(entender(t, cliFixo), alvo);
}
$("qa").onsubmit = (e) => { e.preventDefault(); anotar($("qa-texto").value.trim(), $("v-ficha").classList.contains("on") ? fichaAtual : "", $("qa-prev")); };
$("fi-qa").onsubmit = (e) => { e.preventDefault(); anotar($("fi-qa-texto").value.trim(), fichaAtual, $("fi-qa-prev")); };
["qa-prev", "fi-qa-prev"].forEach((id) => $(id).addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName !== "BUTTON") { e.preventDefault(); salvarPrevia($(id)); } if (e.key === "Escape") $("qp-x")?.click(); }));

// ---------- Hoje ----------
function renderHoje() {
  $("hoje-data").textContent = hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const abertos = [...itens.filter((x) => !x.feita), ...parcelasAbertas()].sort(ordem);
  const ate7 = iso(new Date(hoje.getTime() + 7 * DAY));
  const agora = abertos.filter((x) => x.quando && x.quando <= hojeIso);
  const semana = abertos.filter((x) => x.quando > hojeIso && x.quando <= ate7);
  const semData = itens.filter((x) => !x.feita && !x.quando);
  $("h-agora").innerHTML = agora.map((x) => linha(x)).join("") || `<li class="muted">Nada atrasado nem para hoje. 🎉</li>`;
  $("h-semana").innerHTML = semana.map((x) => linha(x)).join("") + (semData.length ? `<li class="muted small" style="display:block">Sem data: ${semData.map((x) => esc(x.texto)).join(" · ")}</li>` : "") || `<li class="muted">Nada nos próximos 7 dias.</li>`;
  const nov = [];
  clientes.filter((c) => c.etapa === "Novo pedido" && c.origem === "Plataforma").forEach((c) => nov.push(`<li><span class="ico">📥</span><div><b>Novo pedido:</b> <button class="linkish" data-cli="${c.id}">${esc(c.nome)}</button><br><span class="small muted">${esc(c.area || "")}${c.assunto ? " · " + esc(c.assunto) : ""}</span></div></li>`));
  const pubsNovas = pubsTodas().filter((p) => !vistas.has(String(p.id)));
  if (pubsNovas.length) nov.push(`<li><span class="ico">📰</span><div><b>${pubsNovas.length} publicação(ões) nova(s)</b> — ${[...new Set(pubsNovas.map((p) => cliDoProc(numPub(p))?.nome).filter(Boolean))].map(esc).join(", ") || "processos sem cliente"}<br><button class="linkish small" data-view="djen">Ver publicações</button></div></li>`);
  Object.entries(acomp).forEach(([n, a]) => { const k = (a.movs || []).filter((m) => m.data > (a.vistoAte || "9")).length; if (k) { const c = cliDoProc(n); nov.push(`<li><span class="ico">🔔</span><div><b>${k} movimentação(ões)</b> no processo ${esc(mascara(n))}${c ? ` · <button class="linkish" data-cli="${c.id}">${esc(c.nome)}</button>` : ""}</div></li>`); } });
  $("h-novidades").innerHTML = nov.join("") || `<li class="muted">Nenhuma novidade.</li>`;
}

// ---------- Clientes ----------
function proximoDe(c) { return [...itens.filter((x) => x.cli === c.id && !x.feita), ...parcelasAbertas().filter((x) => x.cli === c.id)].sort(ordem)[0]; }
function renderClientes() {
  const f = semAcento($("crm-busca").value);
  const vis = clientes.filter((c) => !f || semAcento([c.nome, c.tel, c.area, c.etapa, c.email, c.assunto, c.procs].join(" ")).includes(f) || (soDig(f).length >= 6 && soDig(c.procs).includes(soDig(f))))
    .map((c) => ({ c, p: proximoDe(c) })).sort((a, b) => (a.p?.quando || "9999").localeCompare(b.p?.quando || "9999") || a.c.nome.localeCompare(b.c.nome));
  $("cli-lista").innerHTML = vis.map(({ c, p }) => `<li class="cli-li"><div style="flex:1"><button class="linkish" data-cli="${c.id}">${esc(c.nome)}</button> <span class="pill-s">${esc(c.etapa || "")}</span><br><span class="small muted">${esc(c.area || "")}${c.assunto ? " · " + esc(c.assunto) : ""}</span></div>
    <div class="small" style="text-align:right">${p ? `${ICONE[p.tipo] || ""} ${esc(p.texto || p.desc)}<br><span class="${p.quando && p.quando < hojeIso ? "atrasada" : "muted"}">${p.quando ? fmt(deIso(p.quando)) : "sem data"}</span>` : `<span class="muted">nada pendente</span>`}</div></li>`).join("")
    || `<li class="muted">${clientes.length ? "Nenhum cliente encontrado." : 'Nenhum cliente ainda. Clique em "Novo cliente" ou anote algo com o nome da pessoa.'}</li>`;
}
$("crm-busca").oninput = renderClientes;
const renderCrm = () => { renderClientes(); if (fichaAtual) renderTudo(); };

// ---------- Ficha do cliente ----------
let fichaAtual = null;
function abrirFicha(id, { manterScroll } = {}) {
  const c = cliPorId(id); if (!c) return;
  fichaAtual = id;
  if (!$("v-ficha").classList.contains("on")) { go("ficha"); }
  else if (!manterScroll) window.scrollTo(0, 0);
  $("fi-nome").textContent = c.nome;
  $("fi-sub").innerHTML = [c.area, c.assunto, c.tel, c.cpf && `CPF ${c.cpf}`].filter(Boolean).map(esc).concat(c.cpf ? [] : [`<span class="atrasada">CPF pendente</span>`]).join(" · ");
  $("fi-etapa").innerHTML = ETAPAS.map((e) => `<option${e === c.etapa ? " selected" : ""}>${e}</option>`).join("");
  const abertos = [...itens.filter((x) => x.cli === id && !x.feita), ...parcelasAbertas().filter((x) => x.cli === id)].sort(ordem);
  $("fi-itens").innerHTML = abertos.map((x) => linha(x, { comCliente: false })).join("") || `<li class="muted">Nada pendente para este cliente.</li>`;
  const feitos = itens.filter((x) => x.cli === id && x.feita).sort((a, b) => (b.concluida || "").localeCompare(a.concluida || ""));
  $("fi-feitos").innerHTML = feitos.map((x) => linha(x, { comCliente: false })).join(""); $("fi-feitos-box").hidden = !feitos.length;
  // processos: dados do DataJud + publicações daquele número
  const procs = procsDe(c);
  $("fi-procs").innerHTML = procs.map((n) => {
    const a = acomp[n] || {}, pubs = pubsTodas().filter((p) => so20(numPub(p)) === n);
    const novas = (a.movs || []).filter((m) => m.data > (a.vistoAte || "9"));
    return `<div class="proc" data-proc="${n}"><b>${esc(mascara(n))}</b> ${a.tribunal ? `<span class="pill-s">${esc(a.tribunal)}</span>` : ""}${novas.length ? ` <span class="pill-s amber">${novas.length} nova(s)</span>` : ""}
      ${a.classe ? `<br><span class="small muted">${esc(a.classe)} · ${esc(a.orgao)}</span>` : ""}${a.erro ? `<br><span class="small atrasada">${esc(a.erro)}</span>` : ""}
      ${(a.movs || []).length ? `<ul class="small">${a.movs.slice(0, 4).map((m) => `<li${m.data > (a.vistoAte || "9") ? ' style="font-weight:600"' : ""}>${fmt(new Date(m.data))} — ${esc(m.nome)}</li>`).join("")}</ul>` : ""}
      ${novas.length ? `<button class="linkish small" data-acao="lido">Marcar movimentações como lidas</button>` : ""}
      ${pubs.length ? `<p class="small"><b>Publicações:</b> ${pubs.slice(0, 3).map((p) => `${esc(String(p.data_disponibilizacao || p.datadisponibilizacao || "").slice(0, 10).split("-").reverse().join("/"))} ${esc(p.tipoComunicacao || "")}`).join(" · ")} <button class="linkish small" data-view="djen">ver</button></p>` : ""}</div>`;
  }).join("") || `<p class="muted small">Nenhum processo. Inclua o número em “Editar dados”.</p>`;
  // pagamentos
  const meus = fin.filter((l) => l.cli === id).sort((a, b) => a.venc.localeCompare(b.venc));
  const recebido = meus.filter((l) => l.tipo === "receita" && l.pago).reduce((t, l) => t + l.valor, 0), aberto = meus.filter((l) => l.tipo === "receita" && !l.pago).reduce((t, l) => t + l.valor, 0);
  $("fi-fin").innerHTML = (meus.length ? `<li class="small" style="display:block">Recebido ${reaisBR(recebido)} · em aberto <b>${reaisBR(aberto)}</b></li>` : "") + meus.map((l) => {
    const atras = !l.pago && l.venc < hojeIso;
    return `<li data-fin="${l.id}"><span class="ico">💰</span><div class="t-txt">${reaisBR(l.valor)} <span class="small muted">${esc(l.desc)}${l.parcela ? ` (${l.parcela})` : ""}</span><br><span class="small ${l.pago ? "muted" : atras ? "atrasada" : "muted"}">${l.pago ? `recebido em ${fmt(deIso(l.pago))}` : `${atras ? "atrasado · " : ""}vence ${fmt(deIso(l.venc))}`}</span></div>
      <div class="fin-acoes small">${l.pago ? `<button class="linkish small" data-fa="desfazer">desfazer</button><button class="linkish small" data-fa="recibo">recibo</button>` : `<button class="linkish small" data-fa="pagar">recebido</button><button class="linkish small" data-fa="cobrar">cobrar</button>`}<button class="linkish small" data-fa="del" style="color:#b42318">×</button></div></li>`;
  }).join("") || `<li class="muted">Nenhum pagamento lançado.</li>`;
  $("fi-historia").innerHTML = c.resumo ? `<p>${esc(c.resumo)}</p>` : "";
  $("fi-notas").value = c.notas || "";
  $("fi-hist").innerHTML = (c.hist || []).map((h) => `<li><span class="when">${fmt(new Date(h.em))}</span><span>${esc(h.o)}</span></li>`).join("") || `<li class="muted">Sem registros.</li>`;
  $("fi-wa").hidden = !telWa(c.tel);
  $("crm-form").hidden = true; $("crm-wa").hidden = true; $("fi-ind").hidden = true;
}
$("fi-etapa").onchange = () => { const c = cliPorId(fichaAtual); c.etapa = $("fi-etapa").value; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Etapa: ${c.etapa}` }); salvarCrm(); renderTudo(); };
let notasTimer;
$("fi-notas").oninput = () => { clearTimeout(notasTimer); notasTimer = setTimeout(() => { const c = cliPorId(fichaAtual); if (c) { c.notas = $("fi-notas").value; salvarCrm(); } }, 600); };
$("fi-calc").onclick = () => { go("prazos"); $("pz-caso").dispatchEvent(new Event("focus")); $("pz-caso").value = fichaAtual; };
$("fi-docs").onclick = () => { const c = cliPorId(fichaAtual); go("docs"); $("doc-cliente").dispatchEvent(new Event("focus")); $("doc-cliente").value = c.id; $("doc-cliente").dispatchEvent(new Event("change")); prepararKit(c); };
$("fi-hon-abrir").onclick = () => { $("fi-hon").hidden = !$("fi-hon").hidden; $("fi-hon-venc").value ||= hojeIso; $("fi-hon-valor").focus(); };
$("fi-hon").onsubmit = (e) => { e.preventDefault(); gerarParcelas(numBR($("fi-hon-valor").value), +$("fi-hon-n").value || 1, $("fi-hon-venc").value, "Honorários contratuais", fichaAtual); $("fi-hon").hidden = true; $("fi-hon-valor").value = ""; renderTudo(); };
$("fi-procs").addEventListener("click", (e) => { const b = e.target.closest("[data-acao=lido]"); if (!b) return; const n = b.closest("[data-proc]").dataset.proc; acomp[n].vistoAte = acomp[n].movs?.[0]?.data; gravar(ACOMP_KEY, acomp); renderTudo(); });
$("fi-atualizar").onclick = () => atualizarAcomp(procsDe(cliPorId(fichaAtual)));

// Cadastro (novo/editar) — CPF pode ficar para depois.
const CAMPOS = { nome: "c-nome", cpf: "c-cpf", tel: "c-tel", email: "c-email", area: "c-area", origem: "c-origem", assunto: "c-assunto", procs: "c-procs" };
let editando = null;
function abrirForm(c) {
  editando = c || null;
  if (!c) { fichaAtual = null; go("ficha"); $("fi-nome").textContent = "Novo cliente"; $("fi-sub").textContent = ""; document.querySelector("#v-ficha .dossie").hidden = true; document.querySelector("#v-ficha .fi-acoes").hidden = true; }
  Object.entries(CAMPOS).forEach(([k, id]) => ($(id).value = c ? c[k] || "" : k === "area" ? "Previdenciário" : k === "origem" ? "Indicação" : ""));
  $("crm-form-titulo").textContent = c ? "Dados do cliente" : "Novo cliente";
  $("crm-excluir").hidden = !c; $("crm-form").hidden = false; $("crm-wa").hidden = true; $("c-nome").focus();
}
const fecharForm = () => { $("crm-form").hidden = true; document.querySelector("#v-ficha .dossie").hidden = false; document.querySelector("#v-ficha .fi-acoes").hidden = false; };
$("crm-novo").onclick = () => abrirForm(null);
$("fi-editar").onclick = () => abrirForm(cliPorId(fichaAtual));
$("crm-cancelar").onclick = () => { fecharForm(); if (!fichaAtual) go("clientes"); };
$("crm-salvar").onclick = () => {
  const dados = Object.fromEntries(Object.entries(CAMPOS).map(([k, id]) => [k, $(id).value.trim()]));
  if (!dados.nome) { $("c-nome").focus(); return; }
  if (dados.cpf && !DocId.valido(dados.cpf)) { $("c-cpf").setCustomValidity("CPF ou CNPJ inválido"); $("c-cpf").reportValidity(); return; }
  $("c-cpf").setCustomValidity(""); if (dados.cpf) dados.cpf = DocId.formatar(dados.cpf);
  dados.procs = [...dados.procs.matchAll(CNJ_RE)].map(fmtCnj).join("\n") || dados.procs;
  let c = editando;
  if (c) Object.assign(c, dados); else { c = { id: novoId("CL-"), criado: new Date().toISOString(), etapa: "Novo pedido", hist: [], ...dados }; clientes.push(c); }
  salvarCrm(); fecharForm(); abrirFicha(c.id);
  if (procsDe(c).some((n) => !acomp[n])) atualizarAcomp(procsDe(c));
};
$("crm-excluir").onclick = () => {
  if (!editando || !confirm(`Excluir ${editando.nome}? Prazos, tarefas e pagamentos dele também serão apagados.`)) return;
  const id = editando.id; clientes = clientes.filter((c) => c.id !== id); itens = itens.filter((x) => x.cli !== id); fin = fin.filter((l) => l.cli !== id);
  salvarCrm(); salvarItens(); salvarFin(); fecharForm(); fichaAtual = null; go("clientes");
};

// WhatsApp com mensagem pronta. Nome e OAB vêm de "Meus dados" (não ficam no código, que é público).
const meusDados = () => window.DocGerador?.adv() || {};
const nomeProprio = (n) => String(n || "").toLowerCase().replace(/(^|\s)\S/g, (x) => x.toUpperCase());
const eu = () => { const a = meusDados(); return a.nome ? `${nomeProprio(a.nome)}, advogada${a.oab ? ` (OAB ${a.oab})` : ""}` : "a sua advogada"; };
const telWa = (t) => { const d = soDig(t); return d.length >= 12 ? d : d.length >= 10 ? "55" + d : ""; };
const MODELOS_WA = {
  "Primeiro contato": (c) => `Olá, ${primeiroNome(c.nome)}! Aqui é ${eu()}. Recebi seu pedido${c.assunto ? ` sobre ${c.assunto.toLowerCase()}` : ""} e gostaria de entender melhor o seu caso. Qual o melhor horário para conversarmos?`,
  "Confirmar consulta": (c) => { const p = itens.find((x) => x.cli === c.id && x.tipo === "compromisso" && !x.feita && x.quando >= hojeIso); return `Olá, ${primeiroNome(c.nome)}! Confirmando nossa conversa${p ? ` em ${fmt(deIso(p.quando))}${p.hora ? ` às ${p.hora}` : ""}` : ""}. Se puder, separe os documentos que tiver sobre o caso.`; },
  "Pedir documentos": (c) => `Olá, ${primeiroNome(c.nome)}! Para darmos andamento, preciso dos seguintes documentos:\n- \n- \nPode enviar foto ou PDF por aqui mesmo. Obrigada!`,
  "Proposta de honorários": (c) => `Olá, ${primeiroNome(c.nome)}! Conforme conversamos, segue a proposta para atuação no seu caso. Fico à disposição para qualquer dúvida.`,
  "Atualização do processo": (c) => `Olá, ${primeiroNome(c.nome)}! Passando para atualizar sobre o seu processo${procsDe(c)[0] ? ` (${mascara(procsDe(c)[0])})` : ""}: `,
  "Mensagem livre": (c) => `Olá, ${primeiroNome(c.nome)}! `,
};
$("fi-wa").onclick = () => {
  const c = cliPorId(fichaAtual);
  const sug = { "Novo pedido": "Primeiro contato", "Consulta marcada": "Confirmar consulta", "Proposta enviada": "Proposta de honorários", "Contratado": "Pedir documentos", "Caso ativo": "Atualização do processo" }[c.etapa] || "Mensagem livre";
  $("wa-nome").textContent = c.nome;
  $("wa-modelo").innerHTML = Object.keys(MODELOS_WA).map((m) => `<option${m === sug ? " selected" : ""}>${m}</option>`).join("");
  $("wa-texto").value = MODELOS_WA[sug](c); $("crm-wa").hidden = false; $("crm-form").hidden = true; $("wa-texto").focus();
};
$("wa-modelo").onchange = () => ($("wa-texto").value = MODELOS_WA[$("wa-modelo").value](cliPorId(fichaAtual)));
$("wa-fechar").onclick = () => ($("crm-wa").hidden = true);
$("wa-abrir").onclick = () => {
  const c = cliPorId(fichaAtual);
  window.open(`https://wa.me/${telWa(c.tel)}?text=${encodeURIComponent($("wa-texto").value)}`, "_blank", "noopener");
  (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `WhatsApp: ${$("wa-modelo").value}` }); salvarCrm(); abrirFicha(c.id, { manterScroll: true });
};

// Indicar a colega: manda o caso pronto pelo WhatsApp e registra na ficha.
let colegas = ler("pd-colegas", []);
$("fi-ind-abrir").onclick = () => {
  $("ind-lista").innerHTML = colegas.map((k) => `<option value="${esc(k.nome)}">`).join("");
  $("fi-ind").hidden = false; $("crm-wa").hidden = true; $("ind-nome").focus();
};
$("ind-nome").oninput = () => { const k = colegas.find((x) => x.nome === $("ind-nome").value); if (k) $("ind-tel").value = k.tel; };
$("ind-x").onclick = () => ($("fi-ind").hidden = true);
$("fi-ind").onsubmit = (e) => {
  e.preventDefault();
  const c = cliPorId(fichaAtual), nome = $("ind-nome").value.trim(), tel = $("ind-tel").value.trim();
  if (!telWa(tel)) { $("ind-tel").setCustomValidity("Informe o WhatsApp com DDD"); $("ind-tel").reportValidity(); return; }
  $("ind-tel").setCustomValidity("");
  const txt = [`Olá, ${primeiroNome(nome.replace(/^(dra?\.?|doutora?)\s+/i, ""))}! Tudo bem? Aqui é ${eu()}. Gostaria de te indicar um caso:`, "",
    `*Cliente:* ${c.nome}${c.tel ? ` — ${c.tel}` : ""}`, `*Área:* ${c.area || "—"}${c.assunto ? ` · ${c.assunto}` : ""}`,
    c.resumo ? `*Resumo:* ${c.resumo.slice(0, 600)}` : "", procsDe(c).length ? `*Processo(s):* ${procsDe(c).map(mascara).join(", ")}` : "", "",
    "O cliente já autorizou o repasse. Consegue atender?"].filter((x) => x !== null).join("\n").replace(/\n{3,}/g, "\n\n");
  window.open(`https://wa.me/${telWa(tel)}?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  colegas = [{ nome, tel }, ...colegas.filter((k) => k.nome !== nome)]; gravar("pd-colegas", colegas);
  c.etapa = "Indicado a colega"; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Indicado a ${nome}` }); salvarCrm();
  $("fi-ind").hidden = true; $("ind-ok").checked = false; abrirFicha(c.id, { manterScroll: true });
};

// ---------- Pedido vindo do site ----------
function lerPacote(texto) {
  const m = String(texto).replace(/\s+/g, "").match(/PD1:([A-Za-z0-9+/=]+)/);
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(escape(atob(m[1])))); } catch { return null; }
}
function importarPacote(texto) {
  const pk = lerPacote(texto);
  if (!pk) { $("ped-msg").textContent = "Não encontrei o pacote do pedido (linha que começa com PD1:)."; return false; }
  if (clientes.some((c) => c.protocolo === pk.protocolo)) { $("ped-msg").textContent = `O pedido ${pk.protocolo} já foi importado.`; return true; }
  const area = { previdenciario: "Previdenciário", consumidor: "Consumidor", saude: "Saúde", administrativo: "Administrativo", cartorio: "Cartório/Extrajudicial" }[pk.key] || pk.area || "Outra";
  const resumo = [pk.relato && `Relato: ${pk.relato}`, pk.cnis, pk.documento, pk.continuacao, ...(pk.respostas || [])].filter(Boolean).join("\n");
  const c = { id: novoId("CL-"), protocolo: pk.protocolo, criado: new Date().toISOString(), nome: pk.nome, cpf: pk.cpf || "", tel: pk.telefone, email: pk.email || "", area, origem: "Plataforma",
    etapa: "Novo pedido", assunto: pk.area || "", resumo, notas: `Protocolo ${pk.protocolo}${pk.periodo ? ` · prefere ${String(pk.periodo).toLowerCase()}` : ""}`, procs: "", hist: [{ em: pk.criado, o: "Pedido pela plataforma" }] };
  clientes.push(c); salvarCrm();
  itens.push({ id: novoId("I-"), tipo: "tarefa", texto: `Retornar contato${pk.periodo ? ` (prefere ${String(pk.periodo).toLowerCase()})` : ""}`, quando: hojeIso, cli: c.id, feita: false }); salvarItens();
  $("ped-texto").value = ""; $("ped-msg").textContent = `Pedido ${pk.protocolo} importado.`;
  renderTudo(); return true;
}
$("ped-ok").onclick = () => importarPacote($("ped-texto").value);

// ---------- Importar lista de processos ----------
const parseData = (t) => { const m = String(t || "").match(/(\d{1,2})\/(\d{1,2})\/(\d{4})|(\d{4})-(\d{2})-(\d{2})/); if (!m) return ""; const x = m[1] ? new Date(+m[3], m[2] - 1, +m[1], 12) : new Date(+m[4], m[5] - 1, +m[6], 12); return isNaN(x) ? "" : iso(x); };
function importarLista(texto) {
  texto = String(texto || "").trim(); if (!texto) return 0;
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim());
  const sep = [";", "\t", ","].find((s) => linhas[0].includes(s)) || ";";
  const cab = linhas[0].split(sep).map(semAcento);
  const COL = { processo: /processo|numero|cnj/, cliente: /cliente|nome|parte|autor/, area: /area|materia/, assunto: /assunto|titulo|classe|objeto|acao/, prazo: /prazo|vencimento|data/, providencia: /providencia|tarefa|ato/, obs: /obs|resumo|nota/ };
  const idx = {}; Object.entries(COL).forEach(([k, re]) => { const i = cab.findIndex((c) => re.test(c)); if (i >= 0 && !Object.values(idx).includes(i)) idx[k] = i; });
  const temCab = Object.keys(idx).length >= 2;
  const regs = temCab ? linhas.slice(1).map((l) => { const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, "")); return Object.fromEntries(Object.entries(idx).map(([k, i]) => [k, v[i] || ""])); })
    : linhas.flatMap((l) => [...l.matchAll(CNJ_RE)].map((m) => ({ processo: m[0], obs: l.replace(m[0], "").replace(/^[\s;,|\t-]+|[\s;,|\t-]+$/g, "") })));
  let n = 0;
  regs.forEach((o) => {
    const m = [...String(o.processo || "").matchAll(CNJ_RE)][0]; if (!m && !o.cliente) return;
    const num = m ? fmtCnj(m) : "";
    let c = (num && cliDoProc(num)) || (o.cliente && clientes.find((x) => semAcento(x.nome) === semAcento(o.cliente)));
    if (!c) { c = { id: novoId("CL-"), criado: new Date().toISOString(), nome: o.cliente || `Cliente do processo ${num}`, cpf: "", tel: "", email: "", area: o.area || "Outra", origem: "Importado", etapa: "Caso ativo", assunto: o.assunto || (m ? tribunalDe(m) : ""), resumo: o.obs || "", procs: "", hist: [] }; clientes.push(c); }
    if (num && !procsDe(c).includes(so20(num))) c.procs = [c.procs, num].filter(Boolean).join("\n");
    const pz = parseData(o.prazo) || parseData(o.obs);
    if (pz) itens.push({ id: novoId("I-"), tipo: "prazo", texto: o.providencia || "Prazo (importado)", quando: pz, cli: c.id, feita: false });
    n++;
  });
  salvarCrm(); salvarItens(); return n;
}
$("imp-arquivo").onchange = async (e) => { const f = e.target.files[0]; if (f) $("imp-texto").value = await f.text(); };
$("imp-ok").onclick = () => {
  const n = importarLista($("imp-texto").value);
  $("imp-msg").textContent = n ? `${n} processo(s) importado(s) para as fichas dos clientes. Complete nome e telefone na ficha de cada um.` : "Não encontrei processos nesse texto. Confira se há números CNJ ou um cabeçalho com colunas.";
  if (n) { $("imp-texto").value = ""; atualizarAcomp(); }
};

// ---------- Publicações (DJEN + Recorte Digital) ----------
const VISTAS_KEY = "pd-djen-vistas", MONIT_KEY = "pd-djen-monitorados", PARTES_KEY = "pd-djen-partes", REC_KEY = "pd-recorte-pubs";
let vistas = new Set(ler(VISTAS_KEY, []));
let recorte = ler(REC_KEY, []);
let ultimasDjen = [];
try { $("djen-monit").value = localStorage.getItem(MONIT_KEY) || ""; $("djen-partes").value = localStorage.getItem(PARTES_KEY) || ""; } catch {}
// OAB e nome para a busca no DJEN: ficam salvos na conta; se vazios, vêm de "Meus dados".
const DJEN_ID_KEY = "pd-djen-id";
setTimeout(() => {
  const salvo = ler(DJEN_ID_KEY, {}), a = meusDados();
  $("djen-oab").value = salvo.oab || soDig(a.oab || "");
  $("djen-uf").value = salvo.uf || ((a.oab || "").match(/[A-Z]{2}/i)?.[0] || "DF").toUpperCase();
  $("djen-nome").value = salvo.nome || nomeProprio(a.nome || "");
  if (a.nome) $("hoje-ola").textContent = `Bom dia, ${primeiroNome(nomeProprio(a.nome))}.`;
  ["djen-oab", "djen-uf", "djen-nome"].forEach((id) => ($(id).oninput = () => gravar(DJEN_ID_KEY, { oab: $("djen-oab").value.trim(), uf: $("djen-uf").value.trim(), nome: $("djen-nome").value.trim() })));
}, 0);
const numPub = (p) => p.numeroprocessocommascara || mascara(p.numero_processo || p.numeroProcesso || "");
const todosProcs = () => { const s = new Set([...$("djen-monit").value.matchAll(CNJ_RE)].map((m) => so20(m[0]))); clientes.forEach((c) => procsDe(c).forEach((n) => s.add(n))); return [...s]; };

async function consultaDjen(params) {
  const lista = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const qs = new URLSearchParams({ ...params, pagina, itensPorPagina: 100 });
    let r = null;
    try { r = await fetch(`https://comunicaapi.pje.jus.br/api/v1/comunicacao?${qs}`, { headers: { Accept: "application/json" } }); } catch { r = null; }
    if (!r || !r.ok) { const v = await fetch(`/api/djen?${qs}`).catch(() => null); if (v && (v.ok || !r)) r = v; }
    if (!r) throw new Error("sem conexão com o DJEN");
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.erro || j.message || `DJEN respondeu ${r.status}${r.status === 403 ? " (acesso recusado pelo CNJ)" : ""}`);
    const lote = j.items || j.itens || [];
    lista.push(...lote);
    if (lote.length < 100) break;
  }
  return lista;
}
async function buscarDjen() {
  const oab = $("djen-oab").value.trim(), uf = $("djen-uf").value.trim().toUpperCase();
  const n = Math.min(60, Math.max(1, +$("djen-dias").value || 7));
  const datas = { dataDisponibilizacaoInicio: iso(new Date(hoje.getTime() - n * DAY)), dataDisponibilizacaoFim: iso(new Date(hoje.getTime() + DAY)) };
  try { localStorage.setItem(MONIT_KEY, $("djen-monit").value); localStorage.setItem(PARTES_KEY, $("djen-partes").value); } catch {}
  $("djen-status").textContent = "Consultando o DJEN…";
  const consultas = [];
  const rot = (nome, pr) => pr.then((v) => ((v.rotulo = nome), v), (e) => { e.rotulo = nome; throw e; });
  // Alguns tribunais (ex.: TRT10) gravam a OAB com zeros à esquerda (ex.: 012345); consulta as duas formas.
  if (oab) new Set([oab.replace(/^0+/, ""), oab.replace(/^0+/, "").padStart(6, "0")]).forEach((x) => consultas.push(rot(`OAB ${x}`, consultaDjen({ numeroOab: x, ufOab: uf, ...datas }))));
  const nome = $("djen-nome").value.trim();
  if (nome) consultas.push(rot("Seu nome", consultaDjen({ nomeAdvogado: nome, ...datas })));
  $("djen-partes").value.split(/\n/).map((x) => x.trim()).filter((x) => x.length >= 5).forEach((parte) => {
    new Set([parte, parte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()]).forEach((f) => consultas.push(rot(`Parte "${f}"`, consultaDjen({ nomeParte: f, ...datas }))));
  });
  todosProcs().forEach((p) => consultas.push(rot(`Processo ${mascara(p)}`, consultaDjen({ numeroProcesso: p, ...datas }))));
  const res = await Promise.allSettled(consultas);
  const porId = new Map();
  res.forEach((r) => r.status === "fulfilled" && r.value.forEach((it) => porId.set(it.id ?? JSON.stringify(it).slice(0, 200), it)));
  ultimasDjen = [...porId.values()];
  const novas = ultimasDjen.filter((p) => !vistas.has(String(p.id))).length;
  const detalhe = res.map((r) => r.status === "fulfilled" ? `${r.value.rotulo}: ${r.value.length}` : `${r.reason.rotulo}: ERRO (${r.reason.message})`).join(" · ");
  $("djen-status").textContent = `${ultimasDjen.length} publicação(ões) em ${n} dia(s) · ${novas} nova(s) — ${detalhe}`;
  try { localStorage.setItem("pd-djen-ultima", String(Date.now())); } catch {}
  renderPubs(); renderTudo();
}
function pubsTodas() {
  const ids = new Set(ultimasDjen.map((p) => so20(numPub(p)) + String(p.data_disponibilizacao || "").slice(0, 10)));
  return [...ultimasDjen, ...recorte.filter((p) => !ids.has(so20(p.numeroprocessocommascara) + p.data_disponibilizacao))]
    .sort((a, b) => String(b.data_disponibilizacao || b.datadisponibilizacao || "").localeCompare(String(a.data_disponibilizacao || a.datadisponibilizacao || "")));
}
function renderPubs() {
  $("djen-lista").innerHTML = pubsTodas().map((p) => {
    const num = numPub(p);
    const data = String(p.data_disponibilizacao || p.datadisponibilizacao || "").slice(0, 10).split("-").reverse().join("/");
    const c = cliDoProc(num);
    const nova = !vistas.has(String(p.id));
    const partes = (p.destinatarios || []).map((x) => x.nome).filter(Boolean).join(", ");
    return `<article class="pub${nova ? " nova" : ""}" data-pub="${esc(p.id)}" data-num="${esc(num)}">
      <header>${nova ? `<span class="pill-s amber">nova</span>` : ""}<b>${esc(data)}</b><span class="pill-s">${esc(p.siglaTribunal || "")}</span><span class="pill-s">${esc(p.tipoComunicacao || p.tipoDocumento || "")}</span>${p.fonte ? `<span class="pill-s">${esc(p.fonte)}</span>` : ""}</header>
      <div><b>${esc(num)}</b> ${c ? `· <button class="linkish" data-cli="${c.id}">${esc(c.nome)}</button>` : ""}<br><span class="muted small">${esc(p.nomeOrgao || "")}${p.nomeClasse ? " · " + esc(p.nomeClasse) : ""}</span></div>
      ${partes ? `<div class="small"><b>Partes:</b> ${esc(partes)}</div>` : ""}
      <div class="texto">${esc(String(p.texto || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())}</div>
      <div class="acoes"><button class="linkish small" data-acao="abrir">Ler inteiro</button><button class="linkish small" data-acao="prazo">Lançar prazo</button><button class="linkish small" data-acao="vista">Marcar como vista</button>
        ${c ? "" : `<button class="linkish small" data-acao="add">Criar cliente com este processo</button>`}${p.link ? `<a class="small" href="${esc(p.link)}" target="_blank" rel="noopener">Documento no tribunal</a>` : ""}</div></article>`;
  }).join("") || `<p class="muted">Nenhuma publicação. Clique em “Buscar agora”.</p>`;
}
function lerRecorte(txt) {
  const t = String(txt).replace(/\|/g, " ").replace(/[ \t]+/g, " ");
  return t.split(/Publica[çc][ãa]o:\s*\d+\s*\./i).slice(1).map((b) => {
    const pega = (re) => (b.match(re) || [])[1]?.trim() || "";
    const disp = pega(/Disponibiliza[çc][ãa]o:\s*(\d{2}\/\d{2}\/\d{4})/i);
    const trib = pega(/Tribunal:\s*([^\n]+?)\s*(?:Vara:|\n)/i);
    const m = [...b.matchAll(CNJ_RE)][0];
    const corpo = pega(/T[íi]tulo:[\s\S]*?Publica[çc][ãa]o:\s*([\s\S]+?)(?:Total de Publica|$)/i) || pega(/Publica[çc][ãa]o:\s*([\s\S]+)/i) || b;
    const intimado = pega(/Intimado \(s\)[^-]*-\s*([^|\n]+?)\s*(?:POLO|$)/i);
    return {
      id: "rec-" + (m ? so20(m[0]) : "") + "-" + (pega(/Identificador do documento:\s*(\d+)/i) || disp + corpo.length),
      data_disponibilizacao: disp.split("/").reverse().join("-"), siglaTribunal: (trib.split(" - ").pop() || "").trim(),
      tipoComunicacao: pega(/T[íi]tulo:\s*([A-Za-zÀ-ú ]+?)\s*(?:Publica|\n)/i) || "Publicação", nomeOrgao: pega(/Vara:\s*([^\n]+?)\s*(?:P[áa]gina:|\n)/i),
      numeroprocessocommascara: m ? fmtCnj(m) : "", texto: corpo, link: pega(/Acesso ao documento:\s*(https?:\/\/\S+)/i),
      destinatarios: intimado ? [{ nome: intimado }] : [], fonte: "Recorte OAB/DF",
    };
  }).filter((p) => p.numeroprocessocommascara || p.texto);
}
$("rec-ok").onclick = () => {
  const novas = lerRecorte($("rec-texto").value);
  if (!novas.length) { $("djen-status").textContent = "Não encontrei publicações nesse texto. Copie o e-mail inteiro do Recorte Digital."; return; }
  recorte = [...new Map([...recorte, ...novas].map((p) => [p.id, p])).values()].filter((p) => new Date(p.data_disponibilizacao) > new Date(hoje.getTime() - 60 * DAY));
  gravar(REC_KEY, recorte); $("rec-texto").value = ""; $("djen-status").textContent = `${novas.length} publicação(ões) lida(s) do Recorte Digital.`;
  renderPubs(); renderTudo();
};
$("djen-buscar").onclick = buscarDjen;
$("djen-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-acao]"); if (!b) return;
  const art = b.closest(".pub"), num = art.dataset.num;
  if (b.dataset.acao === "abrir") art.classList.toggle("aberta");
  if (b.dataset.acao === "vista") { vistas.add(art.dataset.pub); gravar(VISTAS_KEY, [...vistas]); art.classList.remove("nova"); art.querySelector(".pill-s.amber")?.remove(); renderTudo(); }
  if (b.dataset.acao === "prazo") { const c = cliDoProc(num); go("prazos"); $("pz-caso").dispatchEvent(new Event("focus")); $("pz-caso").value = c?.id || ""; $("pz-data").value = String(pubsTodas().find((p) => String(p.id) === art.dataset.pub)?.data_disponibilizacao || hojeIso).slice(0, 10); $("pz-tipo").value = "disponibilizacao"; $("pz-prov").focus(); vistas.add(art.dataset.pub); gravar(VISTAS_KEY, [...vistas]); }
  if (b.dataset.acao === "add") { abrirForm(null); $("c-procs").value = num; }
});

// ---------- Acompanhamento DataJud (por número, mesmo sem a OAB nos autos) ----------
const DATAJUD_CHAVE = "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=="; // chave pública divulgada pelo CNJ
const ACOMP_KEY = "pd-acomp", UF_TR = ["", "ac", "al", "ap", "am", "ba", "ce", "dft", "es", "go", "ma", "mt", "ms", "mg", "pa", "pb", "pr", "pe", "pi", "rj", "rn", "rs", "ro", "rr", "sc", "se", "sp", "to"];
function aliasDe(n) {
  const j = n[13], tr = +n.slice(14, 16);
  if (j === "8") return UF_TR[tr] ? "tj" + UF_TR[tr] : null;
  if (j === "5") return "trt" + tr;
  if (j === "4") return "trf" + tr;
  if (j === "3") return "stj";
  if (j === "6") return UF_TR[tr] ? "tre-" + UF_TR[tr] : null;
  return null;
}
let acomp = ler(ACOMP_KEY, {});
async function consultaDatajud(n) {
  const alias = aliasDe(n); if (!alias) throw new Error("tribunal não reconhecido pelo número");
  let r = null;
  try { r = await fetch(`https://api-publica.datajud.cnj.jus.br/api_publica_${alias}/_search`, { method: "POST", headers: { Authorization: DATAJUD_CHAVE, "Content-Type": "application/json" }, body: JSON.stringify({ query: { match: { numeroProcesso: n } }, size: 5 }) }); } catch { r = null; }
  if (!r || !r.ok) { const v = await fetch(`/api/datajud?${new URLSearchParams({ tribunal: alias, numero: n })}`).catch(() => null); if (v && (v.ok || !r)) r = v; }
  if (!r) throw new Error("sem conexão com o DataJud");
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.erro || `DataJud respondeu ${r.status}`);
  const hits = (j.hits?.hits || []).map((h) => h._source);
  if (!hits.length) throw new Error("processo não encontrado no DataJud (pode ser sigiloso ou ainda não indexado)");
  const movs = hits.flatMap((h) => (h.movimentos || []).map((m) => ({ data: m.dataHora, nome: m.nome }))).sort((a, b) => String(b.data).localeCompare(String(a.data)));
  const h = hits[0];
  return { tribunal: (h.tribunal || alias).toUpperCase(), classe: h.classe?.nome || "", orgao: h.orgaoJulgador?.nome || "", movs: movs.slice(0, 30) };
}
async function atualizarAcomp(nums = todosProcs()) {
  if (!nums.length) return;
  const res = await Promise.allSettled(nums.map(consultaDatajud));
  res.forEach((r, i) => {
    const n = nums[i], antigo = acomp[n] || {};
    if (r.status === "rejected") { acomp[n] = { ...antigo, erro: r.reason.message }; return; }
    const ult = r.value.movs[0]?.data || "";
    acomp[n] = { ...r.value, erro: "", vistoAte: antigo.vistoAte ?? ult };
  });
  gravar(ACOMP_KEY, acomp); try { localStorage.setItem(ACOMP_KEY + "-ultima", String(Date.now())); } catch {}
  renderTudo();
}

// ---------- Calculadora de prazos → lança na ficha do cliente ----------
const PZ_EXTRAS_KEY = "pd-feriados-locais";
try { $("pz-extras").value = localStorage.getItem(PZ_EXTRAS_KEY) || ""; } catch {}
const lerExtras = () => new Map($("pz-extras").value.split("\n").map((l) => l.match(/(\d{2})\/(\d{2})\/(\d{4})\s*(.*)/)).filter(Boolean).map((m) => [`${m[3]}-${m[2]}-${m[1]}`, m[4] || "feriado local / suspensão"]));
$("pz-caso").onfocus = () => { const v = $("pz-caso").value; $("pz-caso").innerHTML = `<option value="">— só calcular —</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); $("pz-caso").value = v; };
$("pz-form").onsubmit = (e) => {
  e.preventDefault();
  try { localStorage.setItem(PZ_EXTRAS_KEY, $("pz-extras").value); } catch {}
  const r = Prazos.calcular({ marco: $("pz-data").value, tipoMarco: $("pz-tipo").value, dias: $("pz-dias").value, contagem: $("pz-contagem").value,
    dobro: $("pz-dobro").checked, recesso: $("pz-recesso").checked, forenses: $("pz-forenses").checked, extras: lerExtras() });
  const venc = deIso(r.vencimento);
  $("pz-res").hidden = false;
  $("pz-res").innerHTML = `<div class="kpi alert" style="margin-top:12px"><span class="muted small">Vencimento</span><strong>${venc.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</strong><span class="small">${dias(venc)} dia(s) a partir de hoje</span></div>
    <ol class="small" style="margin:12px 0">${r.passos.map(([t, d]) => `<li><b>${brData(d)}</b> — ${esc(t)}</li>`).join("")}</ol>
    ${r.pulos.length ? `<details class="small"><summary>${r.pulos.length} dia(s) pulado(s) (sem expediente ou suspensão)</summary><ul>${r.pulos.map(([d, m]) => `<li>${brData(d)} — ${esc(m)}</li>`).join("")}</ul></details>` : ""}
    <p class="small muted">Confira no calendário do tribunal: feriados locais, pontos facultativos e suspensões variam e só entram no cálculo se você os informar acima.</p>
    <div><button type="button" class="btn" id="pz-lancar">Lançar prazo${$("pz-caso").value ? " na ficha do cliente" : ""}</button></div>`;
  $("pz-lancar").onclick = () => {
    const prov = $("pz-prov").value.trim() || "Prazo";
    const cli = $("pz-caso").value;
    itens.push({ id: novoId("I-"), tipo: "prazo", texto: `${prov} (${$("pz-dias").value} dias ${$("pz-contagem").value === "penal" ? "corridos" : "úteis"} de ${brData($("pz-data").value)})`, quando: r.vencimento, cli, feita: false });
    salvarItens();
    if (cli) abrirFicha(cli); else go("hoje");
  };
};
$("pz-data").value = hojeIso;
Calculadoras.prescricao($("esc-prescricao"));
const PZ_AREA = {
  civel: { regra: "<b>Cível, trabalhista, Juizado e previdenciário:</b> dias úteis (CPC, art. 219); exclui o dia do começo e inclui o do vencimento (art. 224).", recesso: "Recesso 20/12–20/01 (CPC, art. 220)", dobro: "Prazo em dobro (Fazenda, MP, Defensoria, litisconsortes em autos físicos)" },
  penal: { regra: "<b>Penal:</b> dias corridos (CPP, art. 798) — fins de semana e feriados contam; começa no 1º dia útil após a intimação (Súmula 310/STF); vencimento em dia sem expediente prorroga.", recesso: "Suspensão 20/12–20/01 (CPP, art. 798-A) — desmarque se réu preso, Maria da Penha ou medida urgente", dobro: "Defensoria Pública (prazo em dobro)" },
};
function areaPrazo(a) {
  document.querySelectorAll("[data-pz-area]").forEach((b) => b.classList.toggle("on", b.dataset.pzArea === a));
  $("pz-contagem").value = a === "penal" ? "penal" : "uteis";
  $("pz-regra").innerHTML = PZ_AREA[a].regra; $("pz-recesso-txt").textContent = PZ_AREA[a].recesso; $("pz-dobro-txt").textContent = PZ_AREA[a].dobro;
  $("pz-presc-box").hidden = a !== "penal"; $("pz-res").hidden = true;
}
document.querySelectorAll("[data-pz-area]").forEach((b) => (b.onclick = () => areaPrazo(b.dataset.pzArea)));
areaPrazo("civel");

// ---------- Financeiro (visão do mês; os lançamentos são os mesmos da ficha) ----------
function gerarParcelas(total, n, venc1, desc, cli) {
  if (!total || !venc1) return;
  const base = Math.floor(total / n * 100) / 100, resto = Math.round((total - base * n) * 100) / 100;
  for (let i = 0; i < n; i++) fin.push({ id: novoId("F-") + i, tipo: "receita", cat: "Honorários", desc, valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base, venc: addMes(venc1, i), pago: null, cli, parcela: n > 1 ? `${i + 1}/${n}` : "" });
  salvarFin();
}
const nomeCli = (id) => cliPorId(id)?.nome || "";
function opcoesCli(sel) { const v = sel.value; sel.innerHTML = `<option value="">— nenhum —</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); sel.value = v; }
function renderFin() {
  const mes = $("fin-mes").value;
  const soma = (arr) => arr.reduce((t, l) => t + l.valor, 0);
  const recebido = soma(fin.filter((l) => l.tipo === "receita" && l.pago && l.pago.slice(0, 7) === mes));
  const aReceber = soma(fin.filter((l) => l.tipo === "receita" && !l.pago && l.venc.slice(0, 7) === mes));
  const atrasado = soma(fin.filter((l) => l.tipo === "receita" && !l.pago && l.venc < hojeIso));
  const despesas = soma(fin.filter((l) => l.tipo === "despesa" && (l.pago || l.venc).slice(0, 7) === mes));
  $("fin-kpis").innerHTML = [["Recebido no mês", recebido, ""], ["A receber no mês", aReceber, ""], ["Em atraso (total)", atrasado, atrasado ? "alert" : ""], ["Despesas do mês", despesas, ""], ["Resultado do mês", recebido - despesas, ""]]
    .map(([t, v, cl]) => `<div class="kpi ${cl}"><span class="muted small">${t}</span><strong style="font-size:1.4rem">${reaisBR(v)}</strong></div>`).join("");
  $("fin-tab").innerHTML = fin.filter((l) => (l.pago || l.venc).slice(0, 7) === mes || l.venc.slice(0, 7) === mes).sort((a, b) => a.venc.localeCompare(b.venc)).map((l) => {
    const atras = !l.pago && l.venc < hojeIso;
    const sit = l.pago ? `<span class="pill-s green">${l.tipo === "receita" ? "recebido" : "pago"} ${fmt(deIso(l.pago))}</span>` : `<span class="pill-s ${atras ? "red" : "amber"}">${atras ? "atrasado" : "em aberto"}</span>`;
    return `<tr data-fin="${l.id}"><td>${fmt(deIso(l.venc))}</td><td>${esc(l.desc)}${l.parcela ? ` <span class="small muted">(${l.parcela})</span>` : ""}<br><span class="small muted">${esc(l.cat || "")}${l.cli ? ` · <button class="linkish small" data-cli="${l.cli}">${esc(nomeCli(l.cli))}</button>` : ""}</span></td>
      <td class="v-${l.tipo}">${l.tipo === "despesa" ? "−" : ""}${reaisBR(l.valor)}</td><td>${sit}</td>
      <td><div class="fin-acoes small">${l.pago ? `<button class="linkish small" data-fa="desfazer">desfazer</button>` : `<button class="linkish small" data-fa="pagar">${l.tipo === "receita" ? "receber" : "pagar"}</button>`}${l.tipo === "receita" ? `<button class="linkish small" data-fa="recibo">recibo</button>` : ""}${l.tipo === "receita" && !l.pago ? `<button class="linkish small" data-fa="cobrar">cobrar</button>` : ""}<button class="linkish small" data-fa="del" style="color:#b42318">excluir</button></div></td></tr>`;
  }).join("") || `<tr><td colspan="5" class="muted">Nenhum lançamento neste mês.</td></tr>`;
}
$("fh-vinculo").onfocus = () => opcoesCli($("fh-vinculo"));
$("fl-vinculo").onfocus = () => opcoesCli($("fl-vinculo"));
$("fin-hon").onsubmit = (e) => { e.preventDefault(); gerarParcelas(numBR($("fh-valor").value), Math.max(1, +$("fh-n").value || 1), $("fh-venc").value, $("fh-desc").value.trim(), $("fh-vinculo").value); $("fin-mes").value = $("fh-venc").value.slice(0, 7); $("fh-valor").value = ""; renderFin(); };
$("fin-lanc").onsubmit = (e) => {
  e.preventDefault();
  fin.push({ id: novoId("F-"), tipo: $("fl-tipo").value, cat: $("fl-cat").value, desc: $("fl-desc").value.trim(), valor: numBR($("fl-valor").value), venc: $("fl-data").value, pago: $("fl-pago").checked ? $("fl-data").value : null, cli: $("fl-vinculo").value });
  salvarFin(); $("fl-valor").value = ""; $("fl-desc").value = ""; renderFin();
};
// Ações de pagamento valem igual na ficha e no financeiro.
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-fin] [data-fa]"); if (!b) return;
  const l = fin.find((x) => x.id === b.closest("[data-fin]").dataset.fin), acao = b.dataset.fa;
  const cli = cliPorId(l.cli);
  if (acao === "pagar") l.pago = hojeIso;
  if (acao === "desfazer") l.pago = null;
  if (acao === "del" && confirm("Excluir este lançamento?")) fin = fin.filter((x) => x !== l);
  if (acao === "recibo") {
    if (!cli || !DocId.valido(cli.cpf)) { alert("Para o recibo, cadastre o CPF/CNPJ na ficha do cliente (Editar dados)."); return; }
    const D = window.DocGerador;
    const html = D.MODELOS.recibo.gerar({ nome: cli.nome, tipo: DocId.cnpj(cli.cpf) ? "pj" : "pf", doc: cli.cpf }, { valor: String(l.valor).replace(".", ","), referente: `da prestação de serviços jurídicos (${l.desc}${l.parcela ? `, parcela ${l.parcela}` : ""})`, cidade: D.adv().cidade });
    const w = open("", "_blank"); w.document.write(`<html><head><meta charset="utf-8"><title>Recibo</title><style>body{font:12pt/1.6 "Times New Roman",serif;max-width:700px;margin:40px auto;padding:0 24px}h3{text-align:center}p{text-align:justify}.ass{text-align:center;margin-top:48px}</style></head><body>${html}<script>print()<\/script></body></html>`); w.document.close();
  }
  if (acao === "cobrar") {
    if (!cli || !telWa(cli.tel)) { alert("Cadastre o WhatsApp na ficha do cliente (Editar dados)."); return; }
    const txt = `Olá, ${primeiroNome(cli.nome)}! Lembrete: ${l.parcela ? `a parcela ${l.parcela} dos honorários` : "o pagamento dos honorários"} (${reaisBR(l.valor)}) vence em ${fmt(deIso(l.venc))}. Qualquer dúvida, estou à disposição.`;
    open(`https://wa.me/${telWa(cli.tel)}?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
    (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: "WhatsApp: cobrança" }); salvarCrm();
  }
  salvarFin(); renderTudo();
});
$("fin-csv").onclick = () => {
  const linhas = [["Tipo", "Vencimento", "Pago em", "Descrição", "Parcela", "Categoria", "Cliente", "Valor"], ...fin.map((l) => [l.tipo, l.venc, l.pago || "", l.desc, l.parcela || "", l.cat || "", nomeCli(l.cli), String(l.valor).replace(".", ",")])];
  const csv = "\ufeff" + linhas.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "financeiro.csv"; document.body.appendChild(a); a.click(); a.remove();
};
$("fin-mes").value = hojeIso.slice(0, 7); $("fin-mes").onchange = renderFin;
$("fh-venc").value = $("fl-data").value = hojeIso;

// ---------- Kit da ação a partir da ficha ----------
const SERVICO_POR_AREA = { "Previdenciário": "postulação administrativa", "Saúde": "ações contenciosas", "Consumidor": "juizados especiais petição inicial", "Administrativo": "processo administrativo", "Cartório/Extrajudicial": "inventários", "Trabalhista": "reclamante" };
function prepararKit(c) {
  if (!$("kit-historia").value) $("kit-historia").value = [c.resumo, c.notas].filter(Boolean).join("\n");
  const termo = SERVICO_POR_AREA[c.area]; if (termo) { $("pr-busca").value = termo; $("pr-busca").dispatchEvent(new Event("input")); }
  if (!DocId.valido(c.cpf)) { $("doc-avulso").open = true; $("kit-status").textContent = "Falta o CPF do cliente: arraste o documento (passo 1) ou digite em “Dados do cliente”."; }
}

// ---------- Início ----------
renderHoje(); renderPubs();
try {
  if (todosProcs().length && Date.now() - +(localStorage.getItem(ACOMP_KEY + "-ultima") || 0) > 6 * 3600e3) atualizarAcomp();
  if (Date.now() - +(localStorage.getItem("pd-djen-ultima") || 0) > 6 * 3600e3) buscarDjen().catch(() => {});
} catch {}
