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

const GRUPOS = {
  docs: [["docs", "Kit da ação"]],
  funil: [["funil", "Funil"], ["acomp", "Acompanhamento"], ["importar", "Importar casos"]],
  agenda: [["agenda", "Agenda"], ["tarefas", "Tarefas"], ["prazos", "Prazos e calculadoras"]],
  djen: [["djen", "Publicações"]],
};
const grupoDe = (v) => Object.keys(GRUPOS).find((g) => GRUPOS[g].some(([x]) => x === v)) || v;
function go(view) {
  const g = grupoDe(view), sub = GRUPOS[g];
  $("subnav").hidden = !sub || sub.length < 2;
  if (sub && sub.length > 1) $("subnav").innerHTML = sub.map(([v, n]) => `<button data-sub="${v}" class="${v === view ? "on" : ""}">${n}</button>`).join("");
  document.querySelectorAll(".oview").forEach((v) => v.classList.toggle("on", v.id === "v-" + view));
  document.querySelectorAll(".nav").forEach((b) => b.classList.toggle("on", b.dataset.view === g));
  document.querySelector(`.nav[data-view="${g}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
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
  const li = (a) => (a || []).length ? a.map((x) => `<li>${esc(x)}</li>`).join("") : `<li class="muted" style="list-style:none">A preencher na consulta.</li>`;
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

function renderAll() { renderHoje(); if (typeof renderAgenda === "function" && typeof agenda !== "undefined") renderAgenda(); renderFunil($("busca").value); renderPrazos(); }

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-caso]"); if (b) return abrirCaso(b.dataset.caso);
  const n = e.target.closest(".nav"); if (n) go(n.dataset.view);
  const sb = e.target.closest("[data-sub]"); if (sb) go(sb.dataset.sub);
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
const VISTAS_KEY = "pd-djen-vistas", MONIT_KEY = "pd-djen-monitorados", PARTES_KEY = "pd-djen-partes";
let vistas = new Set();
try { vistas = new Set(JSON.parse(localStorage.getItem(VISTAS_KEY) || "[]")); $("djen-monit").value = localStorage.getItem(MONIT_KEY) || ""; $("djen-partes").value = localStorage.getItem(PARTES_KEY) || ""; } catch {}
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
  const rot = (nome, pr) => pr.then((v) => ((v.rotulo = nome), v), (e) => { e.rotulo = nome; throw e; });
  // Alguns tribunais (ex.: TRT10) gravam a OAB com zeros à esquerda (035332); consulta as duas formas.
  if (oab) new Set([oab.replace(/^0+/, ""), oab.replace(/^0+/, "").padStart(6, "0")]).forEach((n) => consultas.push(rot(`OAB ${n}`, consultaDjen({ numeroOab: n, ufOab: uf, ...datas }))));
  // Alguns tribunais publicam sem vincular a OAB; a busca pelo nome cobre esses casos.
  const nome = $("djen-nome").value.trim();
  if (nome) consultas.push(rot("Seu nome", consultaDjen({ nomeAdvogado: nome, ...datas })));
  try { localStorage.setItem(PARTES_KEY, $("djen-partes").value); } catch {}
  $("djen-partes").value.split(/\n/).map((x) => x.trim()).filter((x) => x.length >= 5).forEach((parte) => {
    // Os diários costumam grafar nomes em maiúsculas e sem acento; consulta também nessa forma.
    const formas = new Set([parte, parte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()]);
    formas.forEach((f) => consultas.push(rot(`Parte "${f}"`, consultaDjen({ nomeParte: f, ...datas }))));
  });
  processos.forEach((p) => consultas.push(rot(`Processo ${mascara(p)}`, consultaDjen({ numeroProcesso: p, ...datas }))));
  const res = await Promise.allSettled(consultas);
  const falhas = res.filter((r) => r.status === "rejected");
  const porId = new Map();
  res.forEach((r) => r.status === "fulfilled" && r.value.forEach((it) => porId.set(it.id ?? JSON.stringify(it).slice(0, 200), it)));
  const pubs = [...porId.values()].sort((a, b) => String(b.data_disponibilizacao || b.datadisponibilizacao).localeCompare(String(a.data_disponibilizacao || a.datadisponibilizacao)));
  const novas = pubs.filter((p) => !vistas.has(String(p.id))).length;
  const detalhe = res.map((r) => r.status === "fulfilled" ? `${r.value.rotulo}: ${r.value.length}` : `${r.reason.rotulo}: ERRO (${r.reason.message})`).join(" · ");
  $("djen-status").textContent = `${pubs.length} publicação(ões) em ${n} dia(s) · ${novas} nova(s) — ${detalhe}`;
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

// Acompanhamento por número no DataJud (CNJ): funciona sem a OAB da advogada nos autos.
// Chave PÚBLICA divulgada pelo CNJ na wiki do DataJud.
const DATAJUD_CHAVE = "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";
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
let acomp = {};
try { acomp = JSON.parse(localStorage.getItem(ACOMP_KEY) || "{}"); } catch {}
const listaAcomp = () => { const s = new Set([...$("djen-monit").value.matchAll(CNJ_RE)].map((m) => so20(m[0]))); CASOS.forEach((c) => so20(c.id).length === 20 && s.add(so20(c.id))); return [...s]; };

async function consultaDatajud(n) {
  const alias = aliasDe(n); if (!alias) throw new Error("tribunal não reconhecido pelo número");
  // 1º direto do navegador (IP brasileiro); se bloquear, tenta pela função do Netlify.
  let r = null;
  try {
    r = await fetch(`https://api-publica.datajud.cnj.jus.br/api_publica_${alias}/_search`, {
      method: "POST", headers: { Authorization: DATAJUD_CHAVE, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { match: { numeroProcesso: n } }, size: 5 }),
    });
  } catch { r = null; }
  if (!r || !r.ok) { const v = await fetch(`/api/datajud?${new URLSearchParams({ tribunal: alias, numero: n })}`).catch(() => null); if (v && (v.ok || !r)) r = v; }
  if (!r) throw new Error("sem conexão com o DataJud");
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.erro || `DataJud respondeu ${r.status}${r.status === 504 ? " (o CNJ demorou demais; tente de novo)" : ""}`);
  const hits = (j.hits?.hits || []).map((h) => h._source);
  if (!hits.length) throw new Error("processo não encontrado no DataJud (pode ser sigiloso ou ainda não indexado)");
  // Pode haver um registro por grau/sistema; junta as movimentações de todos.
  const movs = hits.flatMap((h) => (h.movimentos || []).map((m) => ({ data: m.dataHora, nome: m.nome, compl: (m.complementosTabelados || []).map((c) => c.nome || c.descricao).filter(Boolean).join(", "), grau: h.grau })));
  movs.sort((a, b) => String(b.data).localeCompare(String(a.data)));
  const h = hits[0];
  return { tribunal: (h.tribunal || alias).toUpperCase(), classe: h.classe?.nome || "", orgao: h.orgaoJulgador?.nome || "", ajuizamento: h.dataAjuizamento || "", atualizado: hits.map((x) => x.dataHoraUltimaAtualizacao).sort().pop() || "", assuntos: (h.assuntos || []).map((a) => a.nome).filter(Boolean).join("; "), movs };
}

async function atualizarAcomp() {
  const nums = listaAcomp();
  if (!nums.length) { $("acomp-status").textContent = "Nenhum processo na lista. Cole os números em Publicações → Processos de terceiros."; renderAcomp(); return; }
  $("acomp-status").textContent = `Consultando ${nums.length} processo(s) no DataJud…`;
  const res = await Promise.allSettled(nums.map((n) => consultaDatajud(n)));
  let novos = 0, erros = 0;
  res.forEach((r, i) => {
    const n = nums[i], antigo = acomp[n] || {};
    if (r.status === "rejected") { erros++; acomp[n] = { ...antigo, erro: r.reason.message, checado: new Date().toISOString() }; return; }
    const ult = r.value.movs[0]?.data || "";
    const novo = antigo.vistoAte !== undefined && ult > (antigo.vistoAte || "");
    if (novo) novos++;
    acomp[n] = { ...r.value, erro: "", checado: new Date().toISOString(), vistoAte: antigo.vistoAte ?? ult };
  });
  try { localStorage.setItem(ACOMP_KEY, JSON.stringify(acomp)); localStorage.setItem(ACOMP_KEY + "-ultima", String(Date.now())); } catch {}
  $("acomp-status").textContent = `${nums.length} processo(s) consultado(s) · ${novos} com movimentação nova` + (erros ? ` · ${erros} com erro` : "") + ` · ${new Date().toLocaleString("pt-BR")}`;
  renderAcomp();
}

function renderAcomp() {
  const fmtDH = (x) => x ? new Date(x).toLocaleDateString("pt-BR") : "—";
  $("acomp-lista").innerHTML = listaAcomp().map((n) => {
    const a = acomp[n] || {}, caso = CASOS.find((c) => so20(c.id) === n);
    const novas = (a.movs || []).filter((m) => m.data > (a.vistoAte || "9"));
    return `<article class="pub${novas.length ? " nova" : ""}" data-proc="${n}">
      <header>${novas.length ? `<span class="pill-s amber">${novas.length} nova(s)</span>` : ""}<b>${esc(mascara(n))}</b>${a.tribunal ? `<span class="pill-s">${esc(a.tribunal)}</span>` : ""}${caso ? `<button class="linkish small" data-caso="${esc(caso.id)}">${esc(caso.nome)}</button>` : ""}</header>
      ${a.erro ? `<p class="small" style="color:#b42318">${esc(a.erro)}</p>` : ""}
      ${a.classe ? `<div class="small"><b>${esc(a.classe)}</b> · ${esc(a.orgao)}<br><span class="muted">${esc(a.assuntos)} · ajuizado em ${fmtDH(a.ajuizamento)} · base atualizada em ${fmtDH(a.atualizado)}</span></div>` : ""}
      ${(a.movs || []).length ? `<ul class="small">${a.movs.slice(0, 8).map((m) => `<li${m.data > (a.vistoAte || "9") ? ' style="font-weight:600"' : ""}><b>${fmtDH(m.data)}</b> — ${esc(m.nome)}${m.compl ? ` <span class="muted">(${esc(m.compl)})</span>` : ""}</li>`).join("")}</ul>` : ""}
      <div class="acoes">${novas.length ? `<button class="linkish small" data-acao="lido">Marcar como lido</button>` : ""}</div></article>`;
  }).join("") || `<p class="muted">Nenhum processo acompanhado ainda.</p>`;
}

$("acomp-atualizar").onclick = atualizarAcomp;
$("djen-monit").addEventListener("input", () => { try { localStorage.setItem(MONIT_KEY, $("djen-monit").value); } catch {} renderAcomp(); });
$("acomp-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-acao=lido]"); if (!b) return;
  const n = b.closest("[data-proc]").dataset.proc; const a = acomp[n];
  a.vistoAte = a.movs?.[0]?.data || a.vistoAte; try { localStorage.setItem(ACOMP_KEY, JSON.stringify(acomp)); } catch {}
  renderAcomp();
});
renderAcomp();
try { if (listaAcomp().length && Date.now() - +(localStorage.getItem(ACOMP_KEY + "-ultima") || 0) > 6 * 3600e3) atualizarAcomp(); } catch {}

// CRM: clientes guardados só neste navegador; WhatsApp por link wa.me com mensagem pronta.
const CRM_KEY = "pd-crm";
let clientes = [];
try { clientes = JSON.parse(localStorage.getItem(CRM_KEY) || "[]"); } catch {}
const salvarCrm = () => { try { localStorage.setItem(CRM_KEY, JSON.stringify(clientes)); } catch {} };
const soDig = (t) => String(t || "").replace(/\D/g, "");
const telWa = (t) => { const d = soDig(t); return d.length >= 12 ? d : d.length >= 10 ? "55" + d : ""; };
const primeiroNome = (n) => String(n || "").trim().split(/\s+/)[0] || "";
const MODELOS = {
  "Primeiro contato": (c) => `Olá, ${primeiroNome(c.nome)}! Aqui é a Fernanda Borges Oliveira, advogada (OAB/DF 35.332). Recebi seu pedido sobre ${c.area.toLowerCase()} e gostaria de entender melhor o seu caso. Qual o melhor horário para conversarmos?`,
  "Confirmar consulta": (c) => `Olá, ${primeiroNome(c.nome)}! Confirmando nossa consulta${c.quando ? ` em ${fmt(new Date(c.quando + "T12:00"))}` : ""}. Se puder, separe os documentos que tiver sobre o caso. Qualquer imprevisto, me avise por aqui.`,
  "Pedir documentos": (c) => `Olá, ${primeiroNome(c.nome)}! Para darmos andamento, preciso dos seguintes documentos:\n- \n- \nPode enviar foto ou PDF por aqui mesmo. Obrigada!`,
  "Proposta de honorários": (c) => `Olá, ${primeiroNome(c.nome)}! Conforme conversamos, segue a proposta para atuação no seu caso. Fico à disposição para qualquer dúvida.`,
  "Atualização do processo": (c) => `Olá, ${primeiroNome(c.nome)}! Passando para atualizar sobre o seu processo${c.procs ? ` (${c.procs.split(/\n/)[0]})` : ""}: `,
  "Lembrete": (c) => `Olá, ${primeiroNome(c.nome)}! Passando para lembrar: ${c.acao || ""}.`,
  "Mensagem livre": (c) => `Olá, ${primeiroNome(c.nome)}! `,
};
let editando = null, conversando = null;

function renderCrm() {
  const f = semAcento($("crm-busca").value);
  const vis = clientes.filter((c) => !f || semAcento([c.nome, c.tel, c.area, c.etapa, c.email].join(" ")).includes(f))
    .sort((a, b) => (a.quando || "9") .localeCompare(b.quando || "9"));
  const hojeIso = iso(hoje);
  const atrasadas = clientes.filter((c) => c.quando && c.quando < hojeIso).length;
  const hojeN = clientes.filter((c) => c.quando === hojeIso).length;
  $("crm-kpis").innerHTML = [["Clientes", clientes.length, ""], ["Ações para hoje", hojeN, hojeN ? "alert" : ""], ["Ações atrasadas", atrasadas, atrasadas ? "alert" : ""],
    ["Sem CPF", clientes.filter((c) => !DocId.valido(c.cpf)).length, clientes.some((c) => !DocId.valido(c.cpf)) ? "alert" : ""], ["Em negociação", clientes.filter((c) => ["Consulta sugerida", "Agendada", "Realizada", "Proposta"].includes(c.etapa)).length, ""]]
    .map(([t, n, cl]) => `<div class="kpi ${cl}"><span class="muted small">${t}</span><strong>${n}</strong></div>`).join("");
  $("crm-tab").innerHTML = vis.map((c) => {
    const ult = (c.hist || [])[0];
    return `<tr><td><button class="linkish" data-cli="${c.id}">${esc(c.nome)}</button>${DocId.valido(c.cpf) ? "" : ` <span class="pill-s red">CPF pendente</span>`}<br><span class="muted small">${esc(c.area)} · ${esc(c.origem)}</span></td>
      <td><span class="pill-s">${esc(c.etapa)}</span></td>
      <td>${esc(c.acao || "—")}${c.quando ? `<br><span class="small ${c.quando < hojeIso ? "atrasada" : "muted"}">${fmt(new Date(c.quando + "T12:00"))}</span>` : ""}</td>
      <td class="small">${ult ? `${fmt(new Date(ult.em))}<br><span class="muted">${esc(ult.o)}</span>` : "—"}</td>
      <td>${telWa(c.tel) ? `<button class="wa-btn" data-wa="${c.id}">WhatsApp</button>` : `<span class="muted small">sem telefone</span>`}</td></tr>`;
  }).join("") || `<tr><td colspan="5" class="muted">Nenhum cliente ainda. Clique em "Novo cliente".</td></tr>`;
}

const CAMPOS = { nome: "c-nome", cpf: "c-cpf", tel: "c-tel", email: "c-email", area: "c-area", origem: "c-origem", etapa: "c-etapa", acao: "c-acao", quando: "c-quando", procs: "c-procs", notas: "c-notas" };
function abrirForm(c) {
  editando = c || null;
  $("c-etapa").innerHTML = ETAPAS.map((e) => `<option>${e}</option>`).join("");
  Object.entries(CAMPOS).forEach(([k, id]) => ($(id).value = c ? c[k] || "" : k === "etapa" ? "Orientação" : k === "area" ? "Previdenciário" : k === "origem" ? "Plataforma" : ""));
  $("crm-form-titulo").textContent = c ? c.nome : "Novo cliente";
  $("crm-excluir").hidden = !c; $("crm-form").hidden = false; $("crm-wa").hidden = true; $("c-nome").focus();
}
$("crm-novo").onclick = () => abrirForm(null);
$("crm-cancelar").onclick = () => ($("crm-form").hidden = true);
$("crm-salvar").onclick = () => {
  const dados = Object.fromEntries(Object.entries(CAMPOS).map(([k, id]) => [k, $(id).value.trim()]));
  if (!dados.nome) { $("c-nome").focus(); return; }
  if (!DocId.valido(dados.cpf)) { $("c-cpf").setCustomValidity("CPF ou CNPJ inválido"); $("c-cpf").reportValidity(); $("c-cpf").focus(); return; }
  $("c-cpf").setCustomValidity(""); dados.cpf = DocId.formatar(dados.cpf);
  if (editando) Object.assign(editando, dados); else clientes.push({ id: "CL-" + Date.now().toString(36), criado: new Date().toISOString(), hist: [], ...dados });
  // Processos do cliente entram no acompanhamento automático.
  const nums = [...dados.procs.matchAll(CNJ_RE)].map((m) => fmtCnj(m));
  if (nums.length) { const atual = $("djen-monit").value; const novos = nums.filter((n) => !atual.includes(n)); if (novos.length) { $("djen-monit").value = (atual.trim() ? atual.trim() + "\n" : "") + novos.join("\n"); try { localStorage.setItem(MONIT_KEY, $("djen-monit").value); } catch {} } }
  salvarCrm(); $("crm-form").hidden = true; renderCrm(); renderAcomp();
};
$("crm-excluir").onclick = () => { if (!editando) return; clientes = clientes.filter((c) => c !== editando); salvarCrm(); $("crm-form").hidden = true; renderCrm(); };

function abrirWa(c) {
  conversando = c; $("crm-form").hidden = true; $("crm-wa").hidden = false; $("wa-nome").textContent = c.nome;
  const sugerido = { "Orientação": "Primeiro contato", "Consulta sugerida": "Primeiro contato", "Agendada": "Confirmar consulta", "Realizada": "Proposta de honorários", "Proposta": "Proposta de honorários", "Contratado": "Pedir documentos", "Caso ativo": "Atualização do processo" }[c.etapa] || "Mensagem livre";
  $("wa-modelo").innerHTML = Object.keys(MODELOS).map((m) => `<option${m === sugerido ? " selected" : ""}>${m}</option>`).join("");
  $("wa-texto").value = MODELOS[sugerido](c);
  $("wa-hist").innerHTML = (c.hist || []).map((h) => `<li><span class="when">${fmt(new Date(h.em))}</span><span>${esc(h.o)}</span></li>`).join("") || `<li class="muted">Sem registros.</li>`;
  $("crm-wa").scrollIntoView({ behavior: "smooth" });
}
$("wa-modelo").onchange = () => conversando && ($("wa-texto").value = MODELOS[$("wa-modelo").value](conversando));
$("wa-fechar").onclick = () => ($("crm-wa").hidden = true);
$("wa-abrir").onclick = () => {
  const c = conversando; if (!c) return;
  window.open(`https://wa.me/${telWa(c.tel)}?text=${encodeURIComponent($("wa-texto").value)}`, "_blank", "noopener");
  (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `WhatsApp: ${$("wa-modelo").value}` });
  salvarCrm(); renderCrm(); abrirWa(c);
};
$("crm-tab").addEventListener("click", (e) => {
  const w = e.target.closest("[data-wa]"); if (w) return abrirWa(clientes.find((c) => c.id === w.dataset.wa));
  const n = e.target.closest("[data-cli]"); if (n) abrirForm(clientes.find((c) => c.id === n.dataset.cli));
});
$("crm-busca").oninput = renderCrm;
renderCrm();

// Pedido vindo da plataforma pública: cria o caso (com o que a pessoa contou e os documentos já lidos) e o cliente no CRM.
function lerPacote(texto) {
  const m = String(texto).replace(/\s+/g, "").match(/PD1:([A-Za-z0-9+/=]+)/);
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(escape(atob(m[1])))); } catch { return null; }
}
$("ped-ok").onclick = () => {
  const pk = lerPacote($("ped-texto").value);
  if (!pk) { $("ped-msg").textContent = "Não encontrei o pacote do pedido (linha que começa com PD1:)."; return; }
  if (CASOS.some((c) => c.id === pk.protocolo)) { $("ped-msg").textContent = `O pedido ${pk.protocolo} já foi importado.`; return; }
  const area = { previdenciario: "Previdenciário", consumidor: "Consumidor", saude: "Saúde", administrativo: "Administrativo", cartorio: "Cartório/Extrajudicial" }[pk.key] || pk.area || "A classificar";
  const caso = {
    id: pk.protocolo, nome: pk.nome, area, titulo: pk.area || "Pedido da plataforma", atlas: (pk.codigo || "").split(" · ")[0], dac: (pk.codigo || "").split(" · ")[1] || "",
    origem: "Plataforma", etapa: "Consulta sugerida", resumo: pk.relato || "—", objetivo: pk.respostas?.slice(-1)[0] || "—",
    cronologia: [[new Date(pk.criado), "Pedido de consulta pela plataforma"]], partes: [pk.nome],
    docs: { ok: [pk.cnis && "CNIS (lido na plataforma)", pk.documento && "Documento lido na plataforma"].filter(Boolean), falta: ["RG", "CPF", "Comprovante de endereço"] },
    questoes: [], normas: [], orientacoes: [pk.cnis, pk.documento, pk.continuacao, ...(pk.respostas || [])].filter(Boolean),
    decidir: [], prazos: [], contato: { email: pk.email, telefone: pk.telefone, periodo: pk.periodo },
  };
  if (!importados.length) CASOS.splice(0, CASOS.length);
  importados.push(caso); CASOS.push(caso); try { localStorage.setItem(IMP_KEY, JSON.stringify(importados)); } catch {}
  if (!clientes.some((c) => c.caso === pk.protocolo)) {
    clientes.push({ id: "CL-" + Date.now().toString(36), caso: pk.protocolo, criado: new Date().toISOString(), nome: pk.nome, cpf: pk.cpf || "", tel: pk.telefone, email: pk.email, area, origem: "Plataforma",
      etapa: "Consulta sugerida", acao: `Retornar contato (prefere ${String(pk.periodo || "").toLowerCase()})`, quando: iso(hoje), procs: "", notas: `Protocolo ${pk.protocolo}\n${pk.relato || ""}`,
      hist: [{ em: pk.criado, o: "Pedido pela plataforma" }] });
    salvarCrm(); renderCrm();
  }
  document.querySelector(".demo-note").textContent = "Seus casos importados — guardados só neste navegador.";
  $("ped-texto").value = ""; $("ped-msg").textContent = `Pedido ${pk.protocolo} importado: caso criado e cliente adicionado.`;
  renderAll();
};

// Tarefas: lista simples ligada a caso/cliente; guardada neste navegador.
const TAREFAS_KEY = "pd-tarefas";
let tarefas = [];
try { tarefas = JSON.parse(localStorage.getItem(TAREFAS_KEY) || "[]"); } catch {}
const salvarTarefas = () => { try { localStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas)); } catch {} };
function opcoesVinculo() {
  $("t-vinculo").innerHTML = `<option value="">— nenhum —</option>` +
    CASOS.map((c) => `<option value="caso:${esc(c.id)}">${esc(c.nome)} · ${esc(c.titulo)}</option>`).join("") +
    clientes.filter((c) => !c.caso).map((c) => `<option value="cli:${c.id}">${esc(c.nome)} (cliente)</option>`).join("");
}
function rotuloVinculo(v) {
  if (!v) return "";
  const [tipo, id] = v.split(/:(.+)/);
  if (tipo === "caso") { const c = CASOS.find((x) => x.id === id); return c ? `<button class="linkish small" data-caso="${esc(c.id)}">${esc(c.nome)}</button>` : ""; }
  const c = clientes.find((x) => x.id === id); return c ? `<span class="small muted">${esc(c.nome)}</span>` : "";
}
function itemTarefa(t) {
  const hojeIso = iso(hoje), atras = !t.feita && t.quando && t.quando < hojeIso;
  return `<li class="tarefa${t.feita ? " feita" : ""}${t.prio === "1" ? " prio-1" : ""}" data-tarefa="${t.id}">
    <input type="checkbox"${t.feita ? " checked" : ""} aria-label="Concluir">
    <div class="t-txt">${esc(t.texto)}<br>${t.quando ? `<span class="small ${atras ? "atrasada" : "muted"}">${atras ? "atrasada · " : ""}${fmt(new Date(t.quando + "T12:00"))}</span> ` : ""}${rotuloVinculo(t.vinculo)}</div>
    <button class="del" title="Excluir" aria-label="Excluir">×</button></li>`;
}
function renderTarefas() {
  const f = $("t-filtro").value, hojeIso = iso(hoje);
  const vis = tarefas.filter((t) => f === "todas" || (f === "feitas" ? t.feita : !t.feita && (f !== "hoje" || (t.quando && t.quando <= hojeIso))))
    .sort((a, b) => (a.quando || "9999").localeCompare(b.quando || "9999") || a.prio.localeCompare(b.prio));
  $("t-lista").innerHTML = vis.map(itemTarefa).join("") || `<li class="muted">Nenhuma tarefa aqui.</li>`;
  const doDia = tarefas.filter((t) => !t.feita && t.quando && t.quando <= hojeIso).sort((a, b) => a.quando.localeCompare(b.quando));
  $("tarefas-hoje").innerHTML = doDia.map(itemTarefa).join("") || `<li class="muted">Nada para hoje.</li>`;
}
$("t-form").onsubmit = (e) => {
  e.preventDefault();
  tarefas.push({ id: "T-" + Date.now().toString(36), texto: $("t-texto").value.trim(), quando: $("t-quando").value, prio: $("t-prio").value, vinculo: $("t-vinculo").value, feita: false, criada: new Date().toISOString() });
  salvarTarefas(); $("t-texto").value = ""; $("t-texto").focus(); renderTarefas();
};
$("t-filtro").onchange = renderTarefas;
$("t-vinculo").onfocus = opcoesVinculo;
document.addEventListener("change", (e) => {
  const li = e.target.closest("[data-tarefa]"); if (!li || e.target.type !== "checkbox") return;
  const t = tarefas.find((x) => x.id === li.dataset.tarefa); t.feita = e.target.checked; t.concluida = t.feita ? new Date().toISOString() : null;
  salvarTarefas(); renderTarefas();
});
document.addEventListener("click", (e) => {
  const b = e.target.closest(".tarefa .del"); if (!b) return;
  tarefas = tarefas.filter((x) => x.id !== b.closest("[data-tarefa]").dataset.tarefa); salvarTarefas(); renderTarefas();
});
$("t-quando").value = iso(hoje); opcoesVinculo(); renderTarefas();

// Agenda: compromissos ligados a caso/cliente; exporta para o Google Agenda (link) ou qualquer agenda (.ics).
const AGENDA_KEY = "pd-agenda";
let agenda = [];
try { agenda = JSON.parse(localStorage.getItem(AGENDA_KEY) || "[]"); } catch {}
const salvarAgenda = () => { try { localStorage.setItem(AGENDA_KEY, JSON.stringify(agenda)); } catch {} };
const inicioDe = (a) => new Date(`${a.data}T${a.hora || "09:00"}:00`);
const gcalData = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
function linkGoogle(a) {
  const ini = inicioDe(a), fim = new Date(ini.getTime() + (+a.dur || 60) * 60000);
  return "https://calendar.google.com/calendar/render?" + new URLSearchParams({ action: "TEMPLATE", text: `${a.tipo}: ${a.titulo}`, dates: `${gcalData(ini)}/${gcalData(fim)}`, details: a.obs || "", location: a.local || "" });
}
function baixarIcs(a) {
  const ini = inicioDe(a), fim = new Date(ini.getTime() + (+a.dur || 60) * 60000), e = (t) => String(t || "").replace(/[,;\\]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Plataforma do Direito//Escritorio//PT", "BEGIN:VEVENT", `UID:${a.id}@plataforma-direito`, `DTSTAMP:${gcalData(new Date())}`,
    `DTSTART:${gcalData(ini)}`, `DTEND:${gcalData(fim)}`, `SUMMARY:${e(a.tipo + ": " + a.titulo)}`, `LOCATION:${e(a.local)}`, `DESCRIPTION:${e(a.obs)}`,
    "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", "DESCRIPTION:Lembrete", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); l.download = `${a.tipo} ${a.data}.ics`;
  document.body.appendChild(l); l.click(); l.remove();
}
function renderAgenda() {
  const hojeIso = iso(hoje), limite = iso(new Date(hoje.getTime() + 60 * DAY));
  const prox = agenda.filter((a) => a.data >= hojeIso && a.data <= limite).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  let dia = "";
  $("ag-lista").innerHTML = prox.map((a) => {
    const cab = a.data !== dia ? `<p class="ag-dia${a.data === hojeIso ? " hoje" : ""}">${new Date(a.data + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}${a.data === hojeIso ? " · hoje" : ""}</p>` : "";
    dia = a.data;
    return `${cab}<div class="list"><li class="ag-item" data-ag="${a.id}"><span class="when">${esc(a.hora || "—")}</span><div style="flex:1"><span class="pill-s">${esc(a.tipo)}</span> <b>${esc(a.titulo)}</b> ${rotuloVinculo(a.vinculo)}
      ${a.local ? `<br><span class="small muted">${/^https?:/.test(a.local) ? `<a href="${esc(a.local)}" target="_blank" rel="noopener">${esc(a.local)}</a>` : esc(a.local)}</span>` : ""}${a.obs ? `<br><span class="small">${esc(a.obs)}</span>` : ""}
      <div class="acoes-ag small"><a href="${linkGoogle(a)}" target="_blank" rel="noopener">Adicionar ao Google Agenda</a><button class="linkish small" data-ag-acao="ics">Baixar .ics</button><button class="linkish small" data-ag-acao="del" style="color:#b42318">Excluir</button></div></div></li></div>`;
  }).join("") || `<p class="muted">Nenhum compromisso nos próximos 60 dias.</p>`;
  // Tela Hoje: compromissos do dia + consultas marcadas nos casos.
  const doDia = agenda.filter((a) => a.data === hojeIso).sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));
  const consultas = CASOS.filter((c) => c.consulta && dias(c.consulta.quando) === 0);
  $("agenda").innerHTML = [...doDia.map((a) => `<li><span class="when">${esc(a.hora || "—")}</span><div><b>${esc(a.titulo)}</b> <span class="pill-s">${esc(a.tipo)}</span><br>${rotuloVinculo(a.vinculo)}${a.local ? ` <span class="small muted">${esc(a.local)}</span>` : ""}</div></li>`),
    ...consultas.map((c) => `<li><span class="when">${c.consulta.hora}</span><div><button class="linkish" data-caso="${c.id}">${esc(c.nome)}</button><br><span class="muted small">${esc(c.titulo)} · dossiê pronto</span></div></li>`)].join("") || `<li class="muted">Nada na agenda hoje.</li>`;
}
$("ag-form").onsubmit = (e) => {
  e.preventDefault();
  agenda.push({ id: "A-" + Date.now().toString(36), tipo: $("ag-tipo").value, data: $("ag-data").value, hora: $("ag-hora").value, dur: $("ag-dur").value, titulo: $("ag-titulo").value.trim(), local: $("ag-local").value.trim(), obs: $("ag-obs").value.trim(), vinculo: $("ag-vinculo").value });
  salvarAgenda(); $("ag-titulo").value = ""; $("ag-local").value = ""; $("ag-obs").value = ""; renderAgenda();
};
$("ag-vinculo").onfocus = () => { opcoesVinculo(); $("ag-vinculo").innerHTML = $("t-vinculo").innerHTML; };
$("ag-lista").addEventListener("click", (e) => {
  const b = e.target.closest("[data-ag-acao]"); if (!b) return;
  const a = agenda.find((x) => x.id === b.closest("[data-ag]").dataset.ag);
  if (b.dataset.agAcao === "ics") baixarIcs(a);
  if (b.dataset.agAcao === "del") { agenda = agenda.filter((x) => x !== a); salvarAgenda(); renderAgenda(); }
});
$("ag-data").value = iso(hoje); $("ag-vinculo").innerHTML = $("t-vinculo").innerHTML; renderAgenda();

// Calculadora de prazos (prazos-calc.js) + lançamento no caso e na lista de tarefas.
const PZ_EXTRAS_KEY = "pd-feriados-locais";
try { $("pz-extras").value = localStorage.getItem(PZ_EXTRAS_KEY) || ""; } catch {}
const lerExtras = () => new Map($("pz-extras").value.split("\n").map((l) => l.match(/(\d{2})\/(\d{2})\/(\d{4})\s*(.*)/)).filter(Boolean).map((m) => [`${m[3]}-${m[2]}-${m[1]}`, m[4] || "feriado local / suspensão"]));
const brData = (k) => k.split("-").reverse().join("/");
let ultimoPrazo = null;
$("pz-caso").onfocus = () => { $("pz-caso").innerHTML = `<option value="">— só calcular —</option>` + CASOS.map((c) => `<option value="${esc(c.id)}">${esc(c.nome)} · ${esc(c.titulo)}</option>`).join(""); };
$("pz-form").onsubmit = (e) => {
  e.preventDefault();
  try { localStorage.setItem(PZ_EXTRAS_KEY, $("pz-extras").value); } catch {}
  const r = Prazos.calcular({ marco: $("pz-data").value, tipoMarco: $("pz-tipo").value, dias: $("pz-dias").value, contagem: $("pz-contagem").value,
    dobro: $("pz-dobro").checked, recesso: $("pz-recesso").checked, forenses: $("pz-forenses").checked, extras: lerExtras() });
  ultimoPrazo = r;
  const venc = new Date(r.vencimento + "T12:00");
  $("pz-res").hidden = false;
  $("pz-res").innerHTML = `<div class="kpi alert" style="margin-top:12px"><span class="muted small">Vencimento</span><strong>${venc.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</strong><span class="small">${dias(venc)} dia(s) a partir de hoje</span></div>
    <ol class="small" style="margin:12px 0">${r.passos.map(([t, d]) => `<li><b>${brData(d)}</b> — ${esc(t)}</li>`).join("")}</ol>
    ${r.pulos.length ? `<details class="small"><summary>${r.pulos.length} dia(s) pulado(s) (sem expediente ou suspensão)</summary><ul>${r.pulos.map(([d, m]) => `<li>${brData(d)} — ${esc(m)}</li>`).join("")}</ul></details>` : ""}
    <p class="small muted">Confira no calendário do tribunal: feriados locais, pontos facultativos e suspensões de expediente variam e não são calculados sem que você os informe acima. A data é uma conferência, não substitui a sua verificação.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn" id="pz-lancar">Lançar no caso + criar tarefa</button></div>`;
  $("pz-lancar").onclick = () => {
    const prov = $("pz-prov").value.trim() || "Prazo";
    const caso = CASOS.find((c) => c.id === $("pz-caso").value);
    if (caso) { caso.prazos.push({ data: venc, o: prov, f: `${$("pz-dias").value} dias ${$("pz-contagem").value === "penal" ? "corridos (CPP, art. 798)" : "úteis"} a partir de ${brData($("pz-data").value)}` }); if (importados.includes(caso)) try { localStorage.setItem(IMP_KEY, JSON.stringify(importados)); } catch {} }
    tarefas.push({ id: "T-" + Date.now().toString(36), texto: `${prov} — vence ${brData(r.vencimento)}`, quando: r.vencimento, prio: "1", vinculo: caso ? `caso:${caso.id}` : "", feita: false, criada: new Date().toISOString() });
    salvarTarefas(); renderAll(); renderTarefas();
    $("pz-lancar").replaceWith(Object.assign(document.createElement("span"), { className: "small", textContent: caso ? "Lançado no caso e na lista de tarefas." : "Tarefa criada (nenhum caso escolhido)." }));
  };
};
$("pz-data").value = iso(hoje);
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

// Financeiro: honorários parcelados, recebimentos e despesas; guardado neste navegador.
const FIN_KEY = "pd-financeiro";
let fin = [];
try { fin = JSON.parse(localStorage.getItem(FIN_KEY) || "[]"); } catch {}
const salvarFin = () => { try { localStorage.setItem(FIN_KEY, JSON.stringify(fin)); } catch {} };
const numBR = (t) => { const s = String(t || "").trim(); const n = /,\d{1,2}$/.test(s) ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, ""); return Math.round(parseFloat(n) * 100) / 100 || 0; };
const reaisBR = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const addMes = (isoD, n) => { const [a, m, d] = isoD.split("-").map(Number); const x = new Date(a, m - 1 + n, d, 12); if (x.getDate() !== d) x.setDate(0); return iso(x); };
function nomeVinculo(v) { if (!v) return ""; const [t, id] = v.split(/:(.+)/); return (t === "caso" ? CASOS.find((c) => c.id === id) : clientes.find((c) => c.id === id))?.nome || ""; }
function renderFin() {
  const mes = $("fin-mes").value, hojeIso = iso(hoje);
  const doMes = fin.filter((l) => (l.pago || l.venc).slice(0, 7) === mes || l.venc.slice(0, 7) === mes);
  const soma = (arr) => arr.reduce((t, l) => t + l.valor, 0);
  const recebido = soma(fin.filter((l) => l.tipo === "receita" && l.pago && l.pago.slice(0, 7) === mes));
  const aReceber = soma(fin.filter((l) => l.tipo === "receita" && !l.pago && l.venc.slice(0, 7) === mes));
  const atrasado = soma(fin.filter((l) => l.tipo === "receita" && !l.pago && l.venc < hojeIso));
  const despesas = soma(fin.filter((l) => l.tipo === "despesa" && (l.pago || l.venc).slice(0, 7) === mes));
  $("fin-kpis").innerHTML = [["Recebido no mês", recebido, ""], ["A receber no mês", aReceber, ""], ["Em atraso (total)", atrasado, atrasado ? "alert" : ""], ["Despesas do mês", despesas, ""], ["Resultado do mês", recebido - despesas, ""]]
    .map(([t, v, cl]) => `<div class="kpi ${cl}"><span class="muted small">${t}</span><strong style="font-size:1.4rem">${reaisBR(v)}</strong></div>`).join("");
  $("fin-tab").innerHTML = doMes.sort((a, b) => a.venc.localeCompare(b.venc)).map((l) => {
    const atras = !l.pago && l.venc < hojeIso;
    const sit = l.pago ? `<span class="pill-s green">${l.tipo === "receita" ? "recebido" : "pago"} ${fmt(new Date(l.pago + "T12:00"))}</span>` : `<span class="pill-s ${atras ? "red" : "amber"}">${atras ? "atrasado" : "em aberto"}</span>`;
    return `<tr data-fin="${l.id}"><td>${fmt(new Date(l.venc + "T12:00"))}</td><td>${esc(l.desc)}${l.parcela ? ` <span class="small muted">(${l.parcela})</span>` : ""}<br><span class="small muted">${esc(l.cat || "")}${nomeVinculo(l.vinculo) ? " · " + esc(nomeVinculo(l.vinculo)) : ""}</span></td>
      <td class="v-${l.tipo}">${l.tipo === "despesa" ? "−" : ""}${reaisBR(l.valor)}</td><td>${sit}</td>
      <td><div class="fin-acoes small">${l.pago ? `<button class="linkish small" data-fa="desfazer">desfazer</button>` : `<button class="linkish small" data-fa="pagar">${l.tipo === "receita" ? "receber" : "pagar"}</button>`}${l.tipo === "receita" ? `<button class="linkish small" data-fa="recibo">recibo</button>` : ""}${l.tipo === "receita" && !l.pago ? `<button class="linkish small" data-fa="cobrar">cobrar no WhatsApp</button>` : ""}<button class="linkish small" data-fa="del" style="color:#b42318">excluir</button></div></td></tr>`;
  }).join("") || `<tr><td colspan="5" class="muted">Nenhum lançamento neste mês.</td></tr>`;
}
const opcoesFin = () => { opcoesVinculo(); $("fh-vinculo").innerHTML = $("fl-vinculo").innerHTML = $("t-vinculo").innerHTML; };
$("fh-vinculo").onfocus = $("fl-vinculo").onfocus = () => { const a = $("fh-vinculo").value, b = $("fl-vinculo").value; opcoesFin(); $("fh-vinculo").value = a; $("fl-vinculo").value = b; };
$("fin-hon").onsubmit = (e) => {
  e.preventDefault();
  const total = numBR($("fh-valor").value), n = Math.max(1, +$("fh-n").value || 1);
  const base = Math.floor(total / n * 100) / 100, resto = Math.round((total - base * n) * 100) / 100;
  for (let i = 0; i < n; i++) fin.push({ id: "F-" + Date.now().toString(36) + i, tipo: "receita", cat: "Honorários", desc: $("fh-desc").value.trim(), valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base,
    venc: addMes($("fh-venc").value, i), pago: null, vinculo: $("fh-vinculo").value, parcela: n > 1 ? `${i + 1}/${n}` : "" });
  salvarFin(); $("fin-mes").value = $("fh-venc").value.slice(0, 7); $("fh-valor").value = ""; renderFin();
};
$("fin-lanc").onsubmit = (e) => {
  e.preventDefault();
  fin.push({ id: "F-" + Date.now().toString(36), tipo: $("fl-tipo").value, cat: $("fl-cat").value, desc: $("fl-desc").value.trim(), valor: numBR($("fl-valor").value), venc: $("fl-data").value, pago: $("fl-pago").checked ? $("fl-data").value : null, vinculo: $("fl-vinculo").value });
  salvarFin(); $("fl-valor").value = ""; $("fl-desc").value = ""; renderFin();
};
$("fin-tab").addEventListener("click", (e) => {
  const b = e.target.closest("[data-fa]"); if (!b) return;
  const l = fin.find((x) => x.id === b.closest("[data-fin]").dataset.fin), acao = b.dataset.fa;
  if (acao === "pagar") l.pago = iso(hoje);
  if (acao === "desfazer") l.pago = null;
  if (acao === "del") fin = fin.filter((x) => x !== l);
  if (acao === "recibo") {
    const D = window.DocGerador; const nome = nomeVinculo(l.vinculo) || "[NOME DO CLIENTE]";
    const cli = clientes.find((c) => c.nome === nome) || {};
    if (!DocId.valido(cli.cpf)) { alert("Cadastre o CPF/CNPJ do cliente em Clientes antes de emitir o recibo."); go("crm"); if (cli.id) abrirForm(cli); return; }
    const html = D.MODELOS.recibo.gerar({ nome, tipo: DocId.cnpj(cli.cpf) ? "pj" : "pf", doc: cli.cpf }, { valor: String(l.valor).replace(".", ","), referente: `da prestação de serviços jurídicos (${l.desc}${l.parcela ? `, parcela ${l.parcela}` : ""})`, cidade: D.adv().cidade });
    const w = open("", "_blank"); w.document.write(`<html><head><meta charset="utf-8"><title>Recibo</title><style>body{font:12pt/1.6 "Times New Roman",serif;max-width:700px;margin:40px auto;padding:0 24px}h3{text-align:center}p{text-align:justify}.ass{text-align:center;margin-top:48px}</style></head><body>${html}<script>print()<\/script></body></html>`); w.document.close();
  }
  if (acao === "cobrar") {
    const cli = clientes.find((c) => c.nome === nomeVinculo(l.vinculo));
    if (!cli || !telWa(cli.tel)) { alert("Cadastre o WhatsApp do cliente em Clientes."); return; }
    const txt = `Olá, ${primeiroNome(cli.nome)}! Lembrete: a parcela ${l.parcela || ""} dos honorários (${reaisBR(l.valor)}) vence em ${fmt(new Date(l.venc + "T12:00"))}. Qualquer dúvida, estou à disposição.`;
    open(`https://wa.me/${telWa(cli.tel)}?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
    (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: "WhatsApp: cobrança de parcela" }); salvarCrm();
  }
  salvarFin(); renderFin();
});
$("fin-csv").onclick = () => {
  const linhas = [["Tipo", "Vencimento", "Pago em", "Descrição", "Parcela", "Categoria", "Cliente/caso", "Valor"], ...fin.map((l) => [l.tipo, l.venc, l.pago || "", l.desc, l.parcela || "", l.cat || "", nomeVinculo(l.vinculo), String(l.valor).replace(".", ",")])];
  const csv = "\ufeff" + linhas.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "financeiro.csv"; document.body.appendChild(a); a.click(); a.remove();
};
$("fin-mes").value = iso(hoje).slice(0, 7); $("fin-mes").onchange = renderFin;
$("fh-venc").value = $("fl-data").value = iso(hoje); opcoesFin(); renderFin();

$("voltar").onclick = () => go("funil");
$("busca").oninput = (e) => renderFunil(e.target.value);
renderAll();
