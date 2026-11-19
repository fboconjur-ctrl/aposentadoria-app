// Números do escritório: funil de clientes, origem, resposta, financeiro e prazos — com o período anterior para comparar.
// Usa só os dados do painel (pd-crm, pd-itens, pd-financeiro). Fórmulas explicadas na própria tela.
(() => {
  const ms = (d) => new Date(d).getTime();
  const CONTRATOU = ["Contratado", "Caso ativo", "Encerrado"];
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const varia = (agora, antes, { dinheiro, menorMelhor } = {}) => {
    if (!antes && !agora) return "";
    if (!antes) return `<span class="small muted">sem base no período anterior</span>`;
    const d = Math.round(((agora - antes) / antes) * 100); if (!d) return `<span class="small muted">igual ao período anterior</span>`;
    const bom = menorMelhor ? d < 0 : d > 0;
    return `<span class="small" style="color:${bom ? "var(--ok)" : "#b42318"}">${d > 0 ? "▲" : "▼"} ${Math.abs(d)}% vs. período anterior${dinheiro ? ` (${reaisBR(antes)})` : ` (${antes})`}</span>`;
  };
  const barras = (pares) => { const max = Math.max(1, ...pares.map(([, n]) => n)); return pares.length ? `<div class="mt-barras">${pares.map(([r, n]) => `<div class="mt-linha"><span>${esc(r)}</span><div class="mt-trilho"><div class="mt-barra" style="width:${(n / max) * 100}%"></div></div><b>${n}</b></div>`).join("")}</div>` : `<p class="muted small">Sem dados no período.</p>`; };
  const conta = (arr, f) => Object.entries(arr.reduce((o, x) => ((o[f(x) || "Não informado"] = (o[f(x) || "Não informado"] || 0) + 1), o), {})).sort((a, b) => b[1] - a[1]);
  const kpi = (titulo, valor, extra = "", alerta = false) => `<div class="kpi${alerta ? " alert" : ""}"><span class="muted small">${titulo}</span><strong style="font-size:1.6rem">${valor}</strong>${extra}</div>`;

  function periodo(dias) {
    const fim = Date.now(), ini = fim - dias * 864e5, iniAnt = ini - dias * 864e5;
    return { ini, fim, iniAnt };
  }
  function calcular(dias) {
    const { ini, fim, iniAnt } = periodo(dias);
    const dentro = (t, a, b) => t >= a && t < b;
    const novos = (a, b) => clientes.filter((c) => c.criado && dentro(ms(c.criado), a, b));
    const n = novos(ini, fim), nAnt = novos(iniAnt, ini);
    const conv = (arr) => arr.filter((c) => CONTRATOU.includes(c.etapa)).length;
    // 1ª resposta: do cadastro até o primeiro contato registrado no histórico (WhatsApp, etapa…).
    const resp = n.map((c) => { const h = (c.hist || []).map((x) => ms(x.em)).filter((t) => t > ms(c.criado)).sort((a, b) => a - b)[0]; return h ? (h - ms(c.criado)) / 36e5 : null; }).filter((x) => x != null);
    const respMed = resp.length ? resp.sort((a, b) => a - b)[Math.floor(resp.length / 2)] : null;
    const isoIni = new Date(ini).toISOString().slice(0, 10), isoAnt = new Date(iniAnt).toISOString().slice(0, 10);
    const rec = (a, b) => fin.filter((l) => l.tipo === "receita" && l.pago && l.pago >= a && l.pago < b).reduce((t, l) => t + l.valor, 0);
    const recebido = rec(isoIni, "9999"), recebidoAnt = rec(isoAnt, isoIni);
    const atrasado = fin.filter((l) => l.tipo === "receita" && !l.pago && l.venc < hojeIso).reduce((t, l) => t + l.valor, 0);
    const venceuNoPeriodo = fin.filter((l) => l.tipo === "receita" && l.venc >= isoIni && l.venc < hojeIso);
    const inad = pct(venceuNoPeriodo.filter((l) => !l.pago).reduce((t, l) => t + l.valor, 0), venceuNoPeriodo.reduce((t, l) => t + l.valor, 0));
    const ticket = (() => { const hon = fin.filter((l) => l.tipo === "receita" && l.cli && n.some((c) => c.id === l.cli)); const porCli = new Set(hon.map((l) => l.cli)).size; return porCli ? hon.reduce((t, l) => t + l.valor, 0) / porCli : 0; })();
    const prazosAbertos = itens.filter((x) => x.tipo === "prazo" && !x.feita);
    const prazosAtrasados = prazosAbertos.filter((x) => x.quando && x.quando < hojeIso);
    const parados = clientes.filter((c) => c.etapa === "Novo pedido" && c.criado && Date.now() - ms(c.criado) > 2 * 864e5);
    const propostas = clientes.filter((c) => c.etapa === "Proposta enviada");
    return { n, nAnt, conv: conv(n), convAnt: conv(nAnt), respMed, recebido, recebidoAnt, atrasado, inad, ticket, prazosAbertos, prazosAtrasados, parados, propostas };
  }
  function leituras(m) {
    const t = [];
    if (m.prazosAtrasados.length) t.push(`<b>${m.prazosAtrasados.length} prazo(s) com data vencida e não marcados como feitos.</b> Confira primeiro: ou já foram cumpridos (marque como feito) ou precisam de providência hoje.`);
    if (m.parados.length) t.push(`${m.parados.length} pedido(s) novos há mais de 2 dias sem avançar de etapa. Quem espera muito procura outro escritório: vale um primeiro contato hoje.`);
    if (m.propostas.length) t.push(`${m.propostas.length} proposta(s) aguardando resposta. O modelo “Retomar proposta” do WhatsApp ajuda a reabrir a conversa.`);
    if (m.inad >= 20) t.push(`Inadimplência de ${m.inad}% nas parcelas que venceram no período. Use “cobrar” nas parcelas atrasadas e considere pedir entrada maior nos próximos contratos.`);
    if (m.respMed != null && m.respMed > 24) t.push(`O primeiro contato está levando cerca de ${Math.round(m.respMed)} horas. Responder no mesmo dia costuma aumentar muito a contratação.`);
    if (m.n.length >= 5 && pct(m.conv, m.n.length) < 20) t.push(`Só ${pct(m.conv, m.n.length)}% dos novos contatos viraram clientes. Veja abaixo de qual origem vêm os que contratam e concentre esforço nela.`);
    return t.length ? t : ["Nada pedindo atenção agora. 👍"];
  }
  function render() {
    const dias = +$("mt-periodo").value, m = calcular(dias);
    $("mt-leitura").innerHTML = `<ul>${leituras(m).map((x) => `<li>${x}</li>`).join("")}</ul>`;
    $("mt-kpis").innerHTML = [
      kpi("Novos contatos", m.n.length, varia(m.n.length, m.nAnt.length)),
      kpi("Viraram clientes", `${m.conv} <span class="small muted">(${pct(m.conv, m.n.length)}%)</span>`, varia(m.conv, m.convAnt)),
      kpi("1º contato (mediana)", m.respMed == null ? "—" : m.respMed < 1 ? "< 1 h" : `${Math.round(m.respMed)} h`, `<span class="small muted">do cadastro ao 1º registro na ficha</span>`, m.respMed > 24),
      kpi("Recebido", reaisBR(m.recebido), varia(m.recebido, m.recebidoAnt, { dinheiro: true })),
      kpi("Em atraso (total)", reaisBR(m.atrasado), `<span class="small muted">inadimplência no período: ${m.inad}%</span>`, m.atrasado > 0),
      kpi("Honorários por cliente novo", m.ticket ? reaisBR(m.ticket) : "—", `<span class="small muted">média do contratado</span>`),
      kpi("Prazos em aberto", m.prazosAbertos.length, m.prazosAtrasados.length ? `<span class="small atrasada">${m.prazosAtrasados.length} com data vencida</span>` : `<span class="small muted">nenhum vencido</span>`, m.prazosAtrasados.length > 0),
    ].join("");
    const etapas = ETAPAS.map((e) => [e, m.n.filter((c) => c.etapa === e).length]).filter(([, q]) => q);
    $("mt-funil").innerHTML = barras(etapas);
    const origem = conta(m.n, (c) => c.origem).map(([o, q]) => [`${o} — ${pct(m.n.filter((c) => (c.origem || "Não informado") === o && CONTRATOU.includes(c.etapa)).length, q)}% contrataram`, q]);
    $("mt-origem").innerHTML = barras(origem);
    $("mt-area").innerHTML = barras(conta(m.n, (c) => c.area));
  }
  $("mt-periodo").onchange = render;
  document.addEventListener("click", (e) => { if (e.target.closest('[data-view="metricas"]')) setTimeout(render); });
})();
