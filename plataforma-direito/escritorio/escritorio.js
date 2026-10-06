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

// Etapa de cada caso pode ser alterada aqui (fica salva neste navegador).
const ETAPA_KEY = "pd-escritorio-etapas";
let etapasSalvas = {};
try { etapasSalvas = JSON.parse(localStorage.getItem(ETAPA_KEY) || "{}"); } catch {}
CASOS.forEach((c) => { if (etapasSalvas[c.id]) c.etapa = etapasSalvas[c.id]; });
function salvarEtapa(c) { etapasSalvas[c.id] = c.etapa; try { localStorage.setItem(ETAPA_KEY, JSON.stringify(etapasSalvas)); } catch {} }

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
      <div class="codes"><span class="pill-s">Atlas ${esc(c.atlas)}</span>${c.dac ? `<span class="pill-s">DAC ${esc(c.dac)}</span>` : ""}</div></div>
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
$("voltar").onclick = () => go("funil");
$("busca").oninput = (e) => renderFunil(e.target.value);
renderAll();
