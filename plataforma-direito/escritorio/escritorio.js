// Escritório — painel interno (etapa 1). Casos FICTÍCIOS para validar o desenho;
// na etapa 2 os casos virão dos pedidos reais da plataforma, com login.
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const DAY = 864e5;
const hoje = new Date(); hoje.setHours(12, 0, 0, 0);
const d = (n) => new Date(hoje.getTime() + n * DAY);
const fmt = (x) => x.toLocaleDateString("pt-BR");
const dias = (x) => Math.round((x - hoje) / DAY);

const ETAPAS = ["Orientação", "Consulta sugerida", "Agendada", "Realizada", "Proposta", "Contratado", "Caso ativo", "Encerrado"];

const CASOS = [
  {
    id: "PD-0001", nome: "Maria A. (exemplo)", area: "Saúde", titulo: "Plano negou cirurgia bariátrica",
    atlas: "OPP-SAU-002", origem: "Google", etapa: "Agendada", consulta: { quando: d(0), hora: "14:00" },
    resumo: "Beneficiária de plano individual, IMC 41, com diabetes tipo 2. A operadora negou a bariátrica alegando carência, embora o contrato tenha mais de 2 anos.",
    objetivo: "Fazer a cirurgia o quanto antes.",
    cronologia: [[d(-900), "Contratação do plano individual"], [d(-30), "Pedido médico de gastroplastia"], [d(-12), "Negativa por escrito: carência"], [d(-3), "Orientação na plataforma e pedido de consulta"]],
    partes: ["Beneficiária", "Operadora de plano de saúde (individual)"],
    docs: { ok: ["Carteirinha", "Negativa por escrito", "Pedido médico"], falta: ["Relatório médico com IMC e comorbidades", "Contrato do plano"] },
    questoes: ["Carência já cumprida (contrato > 2 anos)", "Critérios de cobertura da bariátrica (IMC ≥ 40)", "Urgência relativa: comorbidade grave"],
    prazos: [{ data: d(5), o: "Registrar NIP na ANS", f: "Lei 9.656/1998; ANS" }],
    normas: ["Lei 9.656/1998, arts. 12 e 35-C", "Rol ANS — DUT gastroplastia"],
    orientacoes: ["Pedir negativa por escrito (feito)", "Registrar NIP na ANS", "Relatório médico detalhado"],
    decidir: ["Ajuizar com pedido de liminar ou aguardar NIP?", "Pedir danos morais pela negativa?"],
  },
  {
    id: "PD-0002", nome: "João P. (exemplo)", area: "Previdenciário", titulo: "Aposentadoria da pessoa com deficiência",
    atlas: "OPP-PREV-001", origem: "Indicação", etapa: "Consulta sugerida",
    resumo: "Homem, 58 anos, cerca de 25 anos e meio de contribuição; trabalhou 12 anos em associação de pessoas com deficiência. Possível deficiência grave (relato) — tempo exigido 25 anos.",
    objetivo: "Saber se já pode se aposentar e pedir o benefício.",
    cronologia: [[d(-20), "Envio do CNIS pela plataforma"], [d(-20), "Continuação PcD: estimativa grave, tempo suficiente"], [d(-19), "Pedido de consulta"]],
    partes: ["Segurado", "INSS"],
    docs: { ok: ["CNIS (relações declaradas)", "Documento com foto"], falta: ["Laudos que descrevam as limitações", "Extrato CNIS completo"] },
    questoes: ["Grau da deficiência (avaliação biopsicossocial)", "Deficiência em todo o período ou conversão proporcional", "2 lacunas sem contribuição (2007–2009 e 2015–2018)"],
    prazos: [],
    normas: ["LC 142/2013, arts. 3º e 4º", "Decreto 3.048/1999, arts. 70-A a 70-I"],
    orientacoes: ["Leitura automática do CNIS", "Estimativa de grau (indicativa)"],
    decidir: ["Pedir já ou reunir laudos antes da avaliação?", "Investigar as lacunas (vínculos não registrados)?"],
  },
  {
    id: "PD-0003", nome: "Carla S. (exemplo)", area: "Administrativo", titulo: "PAD — citação para defesa",
    atlas: "OPP-ADM-001", dac: "DA-21 · DA-03 · DA-04", origem: "Instagram", etapa: "Contratado",
    resumo: "Servidora federal indiciada em PAD por suposta irregularidade em fiscalização de contrato. Citada para defesa escrita.",
    objetivo: "Apresentar defesa e evitar a demissão.",
    cronologia: [[d(-60), "Portaria de instauração"], [d(-4), "Citação após indiciamento"], [d(-3), "Leitura da citação na plataforma"]],
    partes: ["Servidora indiciada", "Comissão processante", "Órgão federal"],
    docs: { ok: ["Citação", "Portaria de instauração"], falta: ["Cópia integral dos autos", "Relatórios de fiscalização assinados"] },
    questoes: ["Individualização da conduta", "Dolo ou erro grosseiro (art. 28 da LINDB)", "Condições reais da fiscalização (art. 22 da LINDB)", "Prescrição"],
    prazos: [{ data: d(6), o: "Defesa escrita (10 dias da citação)", f: "Lei 8.112/1990, art. 161, §1º" }],
    normas: ["Lei 8.112/1990, arts. 142 a 182", "LINDB, arts. 22 e 28"],
    orientacoes: ["Prazo de defesa calculado", "Pedir cópia integral dos autos"],
    decidir: ["Pedir prorrogação do prazo para diligências?", "Arrolar quais testemunhas?"],
  },
  {
    id: "PD-0004", nome: "Roberto L. (exemplo)", area: "Consumidor", titulo: "Voo cancelado sem assistência",
    atlas: "OPP-CON-004", origem: "ChatGPT/IA", etapa: "Orientação",
    resumo: "Voo nacional cancelado; espera de 9 horas sem alimentação nem hotel; perdeu compromisso de trabalho.",
    objetivo: "Ser reembolsado e indenizado.",
    cronologia: [[d(-8), "Cancelamento do voo"], [d(-2), "Continuação de voo na plataforma"]],
    partes: ["Passageiro", "Companhia aérea"],
    docs: { ok: ["Cartão de embarque"], falta: ["Comprovantes de gastos", "Prova do compromisso perdido"] },
    questoes: ["Assistência material não prestada (Res. ANAC 400)", "Dano moral precisa ser demonstrado (CBA, art. 251-A)"],
    prazos: [],
    normas: ["Resolução ANAC 400/2016", "CDC, art. 14"],
    orientacoes: ["Direitos por tempo de espera", "Reclamação no consumidor.gov.br"],
    decidir: ["Vale ação no Juizado (até 20 SM sem advogado)?"],
  },
  {
    id: "PD-0005", nome: "Família R. (exemplo)", area: "Cartório", titulo: "Inventário extrajudicial",
    atlas: "OPP-SUC-001", origem: "Orgânico", etapa: "Proposta",
    resumo: "Três herdeiros maiores e de acordo; um imóvel e saldo bancário. Falecimento há 40 dias.",
    objetivo: "Fazer o inventário em cartório, rápido.",
    cronologia: [[d(-40), "Falecimento"], [d(-10), "Continuação de inventário: cartório possível"], [d(-9), "Consulta realizada"]],
    partes: ["3 herdeiros", "Tabelionato de Notas"],
    docs: { ok: ["Certidão de óbito", "Documentos dos herdeiros"], falta: ["Matrícula atualizada do imóvel", "Extratos bancários"] },
    questoes: ["Recolhimento do ITCMD antes da escritura", "Prazo de 2 meses para abertura"],
    prazos: [{ data: d(20), o: "Abertura do inventário (2 meses do óbito)", f: "CPC, art. 611" }],
    normas: ["CPC, arts. 610 e 611", "Resolução CNJ 35/2007"],
    orientacoes: ["Inventário em cartório é possível", "Lista de documentos"],
    decidir: ["Honorários: valor fixo ou percentual?"],
  },
  {
    id: "PD-0006", nome: "Ana T. (exemplo)", area: "Previdenciário", titulo: "Auxílio-doença negado",
    atlas: "OPP-PREV-002", origem: "Google", etapa: "Caso ativo",
    resumo: "Benefício por incapacidade negado na perícia; laudo particular indica incapacidade por hérnia de disco.",
    objetivo: "Receber o benefício desde o pedido.",
    cronologia: [[d(-50), "Pedido no INSS"], [d(-22), "Indeferimento (perícia)"], [d(-20), "Leitura da carta: motivo perícia"], [d(-15), "Contratação"]],
    partes: ["Segurada", "INSS"],
    docs: { ok: ["Carta de indeferimento", "Laudos e exames", "CNIS"], falta: [] },
    questoes: ["Recurso ao CRPS ou ação judicial com perícia?", "Qualidade de segurada e carência ok"],
    prazos: [{ data: d(8), o: "Recurso ao CRPS (30 dias da ciência)", f: "Lei 8.213/1991, art. 126" }],
    normas: ["Lei 8.213/1991, arts. 59 a 63"],
    orientacoes: ["Prazo de recurso calculado", "Novo pedido x recurso x ação"],
    decidir: ["Recorrer administrativamente ou ajuizar?"],
  },
];

// Casos importados pela advogada: ficam só no localStorage deste navegador.
const IMP_KEY = "pd-escritorio-importados";
const TRIB = { "8.07": "TJDFT", "4.01": "TRF1", "5.10": "TRT10", "8.26": "TJSP", "8.13": "TJMG", "8.19": "TJRJ", "8.09": "TJGO" };
const RAMO = { 1: "STF", 3: "STJ", 4: "Justiça Federal", 5: "Justiça do Trabalho", 6: "Justiça Eleitoral", 8: "Justiça Estadual" };
const CNJ_RE = /\b(\d{7})-?(\d{2})\.?(\d{4})\.?(\d)\.?(\d{2})\.?(\d{4})\b/g;
const fmtCnj = (m) => `${m[1]}-${m[2]}.${m[3]}.${m[4]}.${m[5]}.${m[6]}`;
const tribunalDe = (m) => TRIB[`${m[4]}.${m[5]}`] || `${RAMO[m[4]] || "Tribunal"} ${m[5]}`;
const semAcento = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const parseData = (t) => { const m = String(t || "").match(/(\d{1,2})\/(\d{1,2})\/(\d{4})|(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; const x = m[1] ? new Date(+m[3], m[2] - 1, +m[1], 12) : new Date(+m[4], m[5] - 1, +m[6], 12); return isNaN(x) ? null : x; };

function casoImportado(n, o) {
  return {
    id: o.processo || `IMP-${String(n).padStart(4, "0")}`, nome: o.cliente || "Cliente não informado", area: o.area || "A classificar",
    titulo: o.assunto || (o.processo ? `Processo ${o.tribunal || ""}`.trim() : "Caso importado"), atlas: "", origem: "Importado",
    etapa: ETAPAS.find((e) => semAcento(e) === semAcento(o.etapa || "")) || "Caso ativo",
    resumo: o.obs || "Importado da sua lista. Complete o resumo.", objetivo: "—",
    cronologia: [], partes: [o.cliente, o.tribunal].filter(Boolean), docs: { ok: [], falta: [] },
    questoes: [], normas: [], orientacoes: [], decidir: [],
    prazos: o.prazo ? [{ data: o.prazo, o: o.providencia || "Prazo", f: o.tribunal || "" }] : [],
  };
}

function lerLista(texto) {
  texto = String(texto || "").trim(); if (!texto) return [];
  if (texto[0] === "[") { try { return JSON.parse(texto).map((o, i) => casoImportado(i + 1, { ...o, prazo: parseData(o.prazo) })); } catch {} }
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim());
  const sep = [";", "\t", ","].find((s) => linhas[0].includes(s)) || ";";
  const cab = linhas[0].split(sep).map(semAcento);
  const COL = { processo: /processo|numero|cnj/, cliente: /cliente|nome|parte|autor/, area: /area|materia/, assunto: /assunto|titulo|classe|objeto|acao/, tribunal: /tribunal|orgao|vara|juizo/, etapa: /etapa|situacao|status|fase/, prazo: /prazo|vencimento|data/, providencia: /providencia|tarefa|ato/, obs: /obs|resumo|nota/ };
  const idx = {}; Object.entries(COL).forEach(([k, re]) => { const i = cab.findIndex((c) => re.test(c) && !Object.values(idx).includes(cab.indexOf(c))); if (i >= 0) idx[k] = i; });
  const temCab = Object.keys(idx).length >= 2;
  const casos = []; const vistos = new Set();
  if (temCab) {
    linhas.slice(1).forEach((l) => {
      const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, "")); const o = {};
      Object.entries(idx).forEach(([k, i]) => (o[k] = v[i] || ""));
      const m = [...(o.processo || l).matchAll(CNJ_RE)][0];
      if (m) { o.processo = fmtCnj(m); o.tribunal = o.tribunal || tribunalDe(m); }
      o.prazo = parseData(o.prazo);
      if (o.processo && vistos.has(o.processo)) return; vistos.add(o.processo);
      if (Object.values(o).some(Boolean)) casos.push(casoImportado(casos.length + 1, o));
    });
  } else {
    linhas.forEach((l) => [...l.matchAll(CNJ_RE)].forEach((m) => {
      const num = fmtCnj(m); if (vistos.has(num)) return; vistos.add(num);
      const resto = l.replace(m[0], "").replace(/^[\s;,|\t-]+|[\s;,|\t-]+$/g, "");
      casos.push(casoImportado(casos.length + 1, { processo: num, tribunal: tribunalDe(m), obs: resto, prazo: parseData(resto) }));
    }));
  }
  return casos;
}

let importados = [];
try { importados = (JSON.parse(localStorage.getItem(IMP_KEY) || "[]")).map(revive); } catch {}
function revive(c) { c.prazos.forEach((p) => (p.data = new Date(p.data))); c.cronologia = c.cronologia.map(([t, x]) => [new Date(t), x]); if (c.consulta) c.consulta.quando = new Date(c.consulta.quando); return c; }
if (importados.length) CASOS.splice(0, CASOS.length, ...importados);

// Etapa de cada caso pode ser alterada aqui (fica salva neste navegador).
const ETAPA_KEY = "pd-escritorio-etapas";
let etapasSalvas = {};
try { etapasSalvas = JSON.parse(localStorage.getItem(ETAPA_KEY) || "{}"); } catch {}
CASOS.forEach((c) => { if (etapasSalvas[c.id]) c.etapa = etapasSalvas[c.id]; });
function salvarEtapa(c) { if (importados.includes(c)) { try { localStorage.setItem(IMP_KEY, JSON.stringify(importados)); } catch {} } salvarEtapaDemo(c); }
function salvarEtapaDemo(c) { etapasSalvas[c.id] = c.etapa; try { localStorage.setItem(ETAPA_KEY, JSON.stringify(etapasSalvas)); } catch {} }

const todosPrazos = () => CASOS.flatMap((c) => c.prazos.map((p) => ({ ...p, caso: c }))).sort((a, b) => a.data - b.data);
const situacao = (p) => { const n = dias(p.data); return n < 0 ? ["vencido", "red"] : n <= 3 ? [`${n} dia(s)`, "red"] : n <= 7 ? [`${n} dias`, "amber"] : [`${n} dias`, "green"]; };

function go(view) {
  document.querySelectorAll(".oview").forEach((v) => v.classList.toggle("on", v.id === "v-" + view));
  document.querySelectorAll(".nav").forEach((b) => b.classList.toggle("on", b.dataset.view === view));
  window.scrollTo(0, 0);
}

function renderHoje() {
  $("hoje-data").textContent = hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const consultas = CASOS.filter((c) => c.consulta && dias(c.consulta.quando) === 0);
  const prazos7 = todosPrazos().filter((p) => dias(p.data) >= 0 && dias(p.data) <= 7);
  const faltas = CASOS.reduce((n, c) => n + c.docs.falta.length, 0);
  const novos = CASOS.filter((c) => ["Orientação", "Consulta sugerida"].includes(c.etapa));
  $("kpis").innerHTML = [
    ["Consultas hoje", consultas.length, ""], ["Prazos em 7 dias", prazos7.length, prazos7.length ? "alert" : ""],
    ["Documentos pendentes", faltas, ""], ["Novos pedidos", novos.length, ""],
  ].map(([t, n, cl]) => `<div class="kpi ${cl}"><span class="muted small">${t}</span><strong>${n}</strong></div>`).join("");
  $("agenda").innerHTML = consultas.length ? consultas.map((c) => `<li><span class="when">${c.consulta.hora}</span><div><button class="linkish" data-caso="${c.id}">${esc(c.nome)}</button><br><span class="muted small">${esc(c.titulo)} · dossiê pronto</span></div></li>`).join("") : `<li class="muted">Nenhuma consulta hoje.</li>`;
  $("prazos-hoje").innerHTML = todosPrazos().slice(0, 5).map((p) => { const [s, cl] = situacao(p); return `<li><span class="when">${fmt(p.data)}</span><div><b>${esc(p.o)}</b> <span class="pill-s ${cl}">${s}</span><br><button class="linkish small" data-caso="${p.caso.id}">${esc(p.caso.nome)} · ${esc(p.caso.titulo)}</button></div></li>`; }).join("");
  $("novos").innerHTML = novos.map((c) => `<li><span class="pill-s">${esc(c.area)}</span><div><button class="linkish" data-caso="${c.id}">${esc(c.titulo)}</button><br><span class="muted small">${esc(c.nome)} · origem: ${esc(c.origem)} · ${esc(c.atlas)}</span></div></li>`).join("");
}

function renderFunil(filtro = "") {
  const f = filtro.toLowerCase();
  const vis = CASOS.filter((c) => !f || [c.nome, c.area, c.titulo, c.atlas, c.id].join(" ").toLowerCase().includes(f));
  $("board").innerHTML = ETAPAS.map((e) => {
    const cs = vis.filter((c) => c.etapa === e);
    return `<div class="col"><h3>${e}<span>${cs.length}</span></h3>${cs.map((c) => `<button class="card-c" data-caso="${c.id}"><span class="pill-s">${esc(c.area)}</span><b>${esc(c.titulo)}</b><span class="meta">${esc(c.nome)} · ${esc(c.atlas)}</span>${c.prazos.length ? `<span class="meta">Prazo: ${fmt(c.prazos[0].data)}</span>` : ""}</button>`).join("")}</div>`;
  }).join("");
}

function renderPrazos() {
  $("tab-prazos").innerHTML = todosPrazos().map((p) => { const [s, cl] = situacao(p); return `<tr><td><b>${fmt(p.data)}</b></td><td><button class="linkish" data-caso="${p.caso.id}">${esc(p.caso.nome)}</button><br><span class="muted small">${esc(p.caso.titulo)}</span></td><td>${esc(p.o)}</td><td class="small">${esc(p.f)}</td><td><span class="pill-s ${cl}">${s}</span></td></tr>`; }).join("");
}

function abrirCaso(id) {
  const c = CASOS.find((x) => x.id === id);
  $("caso-codigo").textContent = `${c.id} · ${c.area}`;
  $("caso-titulo").textContent = c.titulo;
  $("caso-sub").textContent = `${c.nome} · origem: ${c.origem}`;
  $("caso-etapa").innerHTML = ETAPAS.map((e) => `<option${e === c.etapa ? " selected" : ""}>${e}</option>`).join("");
  $("caso-etapa").onchange = (e) => { c.etapa = e.target.value; salvarEtapa(c); renderAll(); };
  const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join("");
  $("dossie").innerHTML = `
    <div class="panel wide"><h2>Resumo executivo</h2><p>${esc(c.resumo)}</p><p><b>Objetivo do cliente:</b> ${esc(c.objetivo)}</p>
      <div class="codes">${c.atlas ? `<span class="pill-s">Atlas ${esc(c.atlas)}</span>` : ""}${c.dac ? `<span class="pill-s">DAC ${esc(c.dac)}</span>` : ""}</div></div>
    <div class="panel"><h2>Cronologia</h2><ul class="timeline-d">${c.cronologia.map(([t, x]) => `<li><time>${fmt(t)}</time><span>${esc(x)}</span></li>`).join("")}</ul></div>
    <div class="panel"><h2>Documentos</h2><ul class="docs-d">${c.docs.ok.map((x) => `<li>${esc(x)}</li>`).join("")}${c.docs.falta.map((x) => `<li class="missing">${esc(x)} — <i>pendente</i></li>`).join("")}</ul></div>
    <div class="panel"><h2>Questões jurídicas identificadas</h2><ul>${li(c.questoes)}</ul></div>
    <div class="panel"><h2>Prazos</h2>${c.prazos.length ? `<ul>${c.prazos.map((p) => { const [s, cl] = situacao(p); return `<li><b>${fmt(p.data)}</b> — ${esc(p.o)} <span class="pill-s ${cl}">${s}</span><br><span class="muted small">${esc(p.f)}</span></li>`; }).join("")}</ul>` : `<p class="muted">Nenhum prazo identificado.</p>`}</div>
    <div class="panel"><h2>Normas relacionadas</h2><ul>${li(c.normas)}</ul></div>
    <div class="panel"><h2>Partes</h2><ul>${li(c.partes)}</ul></div>
    <div class="panel"><h2>Orientações já fornecidas pela plataforma</h2><ul>${li(c.orientacoes)}</ul></div>
    <div class="panel decide wide"><h2>Pontos que exigem decisão profissional</h2><ul>${li(c.decidir)}</ul></div>`;
  go("caso");
}

function renderAll() { renderHoje(); renderFunil($("busca").value); renderPrazos(); }

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-caso]"); if (b) return abrirCaso(b.dataset.caso);
  const n = e.target.closest(".nav"); if (n) go(n.dataset.view);
});
$("imp-arquivo").onchange = async (e) => { const f = e.target.files[0]; if (f) $("imp-texto").value = await f.text(); };
$("imp-ok").onclick = () => {
  const novos = lerLista($("imp-texto").value);
  if (!novos.length) { $("imp-msg").textContent = "Não encontrei processos nesse texto. Confira se há números CNJ ou um cabeçalho com colunas."; return; }
  importados = novos; try { localStorage.setItem(IMP_KEY, JSON.stringify(importados)); } catch {}
  CASOS.splice(0, CASOS.length, ...importados);
  $("imp-msg").textContent = `${novos.length} caso(s) importado(s). Os exemplos fictícios foram ocultados.`;
  document.querySelector(".demo-note").textContent = "Seus casos importados — guardados só neste navegador.";
  renderAll();
};
$("imp-limpar").onclick = () => { try { localStorage.removeItem(IMP_KEY); } catch {} location.reload(); };
if (importados.length) document.querySelector(".demo-note").textContent = "Seus casos importados — guardados só neste navegador.";
// Publicações do DJEN: consulta pela função /api/djen (Netlify), que repassa à API pública do CNJ.
const VISTAS_KEY = "pd-djen-vistas", MONIT_KEY = "pd-djen-monitorados";
let vistas = new Set();
try { vistas = new Set(JSON.parse(localStorage.getItem(VISTAS_KEY) || "[]")); $("djen-monit").value = localStorage.getItem(MONIT_KEY) || ""; } catch {}
const iso = (x) => x.toISOString().slice(0, 10);
const so20 = (t) => String(t || "").replace(/\D/g, "");
const mascara = (n) => (n = so20(n)).length === 20 ? `${n.slice(0, 7)}-${n.slice(7, 9)}.${n.slice(9, 13)}.${n[13]}.${n.slice(14, 16)}.${n.slice(16)}` : n;

async function consultaDjen(params) {
  const itens = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const qs = new URLSearchParams({ ...params, pagina, itensPorPagina: 100 });
    // 1º direto do navegador (IP brasileiro); se o navegador bloquear, usa a função do Netlify.
    let r = null;
    try { r = await fetch(`https://comunicaapi.pje.jus.br/api/v1/comunicacao?${qs}`, { headers: { Accept: "application/json" } }); } catch { r = null; }
    if (!r || !r.ok) { const v = await fetch(`/api/djen?${qs}`).catch(() => null); if (v && (v.ok || !r)) r = v; }
    if (!r) throw new Error("sem conexão com o DJEN");
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.erro || j.message || `DJEN respondeu ${r.status}${r.status === 403 ? " (acesso recusado pelo CNJ)" : ""}`);
    const lote = j.items || j.itens || [];
    itens.push(...lote);
    if (lote.length < 100) break;
  }
  return itens;
}

async function buscarDjen() {
  const oab = $("djen-oab").value.trim(), uf = $("djen-uf").value.trim().toUpperCase();
  const n = Math.min(60, Math.max(1, +$("djen-dias").value || 7));
  const datas = { dataDisponibilizacaoInicio: iso(new Date(hoje.getTime() - n * DAY)), dataDisponibilizacaoFim: iso(new Date(hoje.getTime() + DAY)) };
  try { localStorage.setItem(MONIT_KEY, $("djen-monit").value); } catch {}
  const processos = new Set([...$("djen-monit").value.matchAll(CNJ_RE)].map((m) => so20(m[0])));
  CASOS.forEach((c) => { if (so20(c.id).length === 20) processos.add(so20(c.id)); });
  $("djen-status").textContent = "Consultando o DJEN…";
  const consultas = [];
  // Alguns tribunais (ex.: TRT10) gravam a OAB com zeros à esquerda (035332); consulta as duas formas.
  if (oab) new Set([oab.replace(/^0+/, ""), oab.replace(/^0+/, "").padStart(6, "0")]).forEach((n) => consultas.push(consultaDjen({ numeroOab: n, ufOab: uf, ...datas })));
  // Alguns tribunais publicam sem vincular a OAB; a busca pelo nome cobre esses casos.
  const nome = $("djen-nome").value.trim();
  if (nome) consultas.push(consultaDjen({ nomeAdvogado: nome, ...datas }));
  processos.forEach((p) => consultas.push(consultaDjen({ numeroProcesso: p, ...datas })));
  const res = await Promise.allSettled(consultas);
  const falhas = res.filter((r) => r.status === "rejected");
  const porId = new Map();
  res.forEach((r) => r.status === "fulfilled" && r.value.forEach((it) => porId.set(it.id ?? JSON.stringify(it).slice(0, 200), it)));
  const pubs = [...porId.values()].sort((a, b) => String(b.data_disponibilizacao || b.datadisponibilizacao).localeCompare(String(a.data_disponibilizacao || a.datadisponibilizacao)));
  const novas = pubs.filter((p) => !vistas.has(String(p.id))).length;
  $("djen-status").textContent = `${pubs.length} publicação(ões) em ${n} dia(s) · ${novas} nova(s)` + (falhas.length ? ` · ${falhas.length} consulta(s) falharam: ${falhas[0].reason.message}` : "");
  ultimasDjen = pubs; mostrarTudo();
}

function renderPubs(pubs) {
  $("djen-lista").innerHTML = pubs.map((p) => {
    const num = p.numeroprocessocommascara || mascara(p.numero_processo || p.numeroProcesso);
    const data = String(p.data_disponibilizacao || p.datadisponibilizacao || "").slice(0, 10).split("-").reverse().join("/");
    const caso = CASOS.find((c) => so20(c.id) === so20(num));
    const nova = !vistas.has(String(p.id));
    const advs = (p.destinatarioadvogados || []).map((a) => a.advogado?.nome).filter(Boolean).join(", ");
    const partes = (p.destinatarios || []).map((x) => x.nome).filter(Boolean).join(", ");
    return `<article class="pub${nova ? " nova" : ""}" data-pub="${esc(p.id)}">
      <header>${nova ? `<span class="pill-s amber">nova</span>` : ""}<b>${esc(data)}</b><span class="pill-s">${esc(p.siglaTribunal || "")}</span><span class="pill-s">${esc(p.tipoComunicacao || p.tipoDocumento || "")}</span>${p.fonte ? `<span class="pill-s">${esc(p.fonte)}</span>` : ""}</header>
      <div><b>${esc(num)}</b> ${caso ? `· <button class="linkish" data-caso="${esc(caso.id)}">${esc(caso.nome)}</button>` : ""}<br><span class="muted small">${esc(p.nomeOrgao || "")}${p.nomeClasse ? " · " + esc(p.nomeClasse) : ""}</span></div>
      ${partes ? `<div class="small"><b>Partes:</b> ${esc(partes)}</div>` : ""}${advs ? `<div class="small muted">Advogados: ${esc(advs)}</div>` : ""}
      <div class="texto">${esc(String(p.texto || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())}</div>
      <div class="acoes"><button class="linkish small" data-acao="abrir">Ler inteiro</button><button class="linkish small" data-acao="vista">Marcar como vista</button>
        ${caso ? "" : `<button class="linkish small" data-acao="add" data-num="${esc(num)}">Adicionar ao painel</button>`}${p.link ? `<a class="small" href="${esc(p.link)}" target="_blank" rel="noopener">Documento no tribunal</a>` : ""}</div>
      <p class="small muted">Prazo: confira a intimação e lance o prazo no caso — o painel não calcula prazo processual automaticamente.</p></article>`;
  }).join("") || `<p class="muted">Nenhuma publicação no período.</p>`;
}

// Recorte Digital da OAB/DF colado do e-mail: vira publicações no mesmo formato do DJEN.
const REC_KEY = "pd-recorte-pubs";
let recorte = [];
try { recorte = JSON.parse(localStorage.getItem(REC_KEY) || "[]"); } catch {}
let ultimasDjen = [];
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
function mostrarTudo() {
  const ids = new Set(ultimasDjen.map((p) => so20(p.numeroprocessocommascara || p.numero_processo) + String(p.data_disponibilizacao || "").slice(0, 10)));
  const extra = recorte.filter((p) => !ids.has(so20(p.numeroprocessocommascara) + p.data_disponibilizacao));
  renderPubs([...ultimasDjen, ...extra].sort((a, b) => String(b.data_disponibilizacao || "").localeCompare(String(a.data_disponibilizacao || ""))));
}
$("rec-ok").onclick = () => {
  const novas = lerRecorte($("rec-texto").value);
  if (!novas.length) { $("djen-status").textContent = "Não encontrei publicações nesse texto. Copie o e-mail inteiro do Recorte Digital."; return; }
  const porId = new Map([...recorte, ...novas].map((p) => [p.id, p]));
  recorte = [...porId.values()].filter((p) => new Date(p.data_disponibilizacao) > new Date(hoje.getTime() - 60 * DAY));
  try { localStorage.setItem(REC_KEY, JSON.stringify(recorte)); } catch {}
  $("rec-texto").value = ""; $("djen-status").textContent = `${novas.length} publicação(ões) lida(s) do Recorte Digital.`;
  mostrarTudo();
};
if (recorte.length) mostrarTudo();

$("djen-buscar").onclick = buscarDjen;
$("djen-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-acao]"); if (!b) return;
  const art = b.closest(".pub");
  if (b.dataset.acao === "abrir") art.classList.toggle("aberta");
  if (b.dataset.acao === "vista") { vistas.add(art.dataset.pub); art.classList.remove("nova"); art.querySelector(".pill-s.amber")?.remove(); try { localStorage.setItem(VISTAS_KEY, JSON.stringify([...vistas])); } catch {} }
  if (b.dataset.acao === "add") {
    const c = casoImportado(importados.length + 1, { processo: b.dataset.num, tribunal: art.querySelector("header .pill-s:not(.amber)")?.textContent, obs: "Adicionado a partir de publicação do DJEN." });
    if (!importados.length) CASOS.splice(0, CASOS.length);
    importados.push(c); CASOS.push(c); try { localStorage.setItem(IMP_KEY, JSON.stringify(importados)); } catch {}
    document.querySelector(".demo-note").textContent = "Seus casos importados — guardados só neste navegador.";
    b.remove(); renderAll();
  }
});

$("voltar").onclick = () => go("funil");
$("busca").oninput = (e) => renderFunil(e.target.value);
renderAll();
