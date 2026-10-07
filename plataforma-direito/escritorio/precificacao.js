// Precificação de serviços com base na tabela de honorários da OAB/DF (valores mínimos em URH).
// Sugestão = maior entre: piso da tabela × critérios do caso (CED, art. 49), horas × valor-hora × critérios,
// e o percentual da tabela sobre o proveito econômico. Nunca abaixo do piso (CED, art. 48, §6º).
(() => {
  const CFG_KEY = "pd-precificacao";
  const TABELAS = {
    DF: { nome: "OAB/DF (tabela de 12/07/2023, em URH)", itens: TABELA_OABDF.map((i) => ({ ...i, id: "DF-" + i.n + "-" + i.nome.slice(0, 20) })), urh: true, horaPiso: (c) => 2 * c.urh },
  };
  const FATORES = [
    ["complexidade", "Complexidade jurídica", [["Baixa", 1], ["Média", 1.15], ["Alta", 1.4], ["Muito alta", 1.8]], 1],
    ["urgencia", "Urgência", [["Normal", 1], ["Urgente (liminar, prazo curto)", 1.25], ["Plantão / imediato", 1.5]], 0],
    ["valor", "Valor econômico em jogo", [["Até R$ 20 mil", 1], ["R$ 20 a 100 mil", 1.15], ["R$ 100 a 500 mil", 1.35], ["Acima de R$ 500 mil", 1.6]], 0],
    ["cliente", "Condição econômica do cliente", [["Hipossuficiente", 1], ["Média", 1.1], ["Elevada / empresa", 1.3]], 1],
    ["local", "Local / deslocamento", [["Online / mesma cidade", 1], ["Região metropolitana", 1.1], ["Outro estado (com viagens)", 1.3]], 0],
  ];
  let cfg = { tabela: "DF", urh: "", valorHora: "" };
  try { cfg = { ...cfg, ...JSON.parse(localStorage.getItem(CFG_KEY) || "{}") }; } catch {}
  const salvar = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch {} };
  const num = (t) => { const s = String(t ?? "").trim(); return parseFloat(/,\d{1,2}$/.test(s) ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "")) || 0; };
  const R = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const arred = (v) => Math.ceil(v / 50) * 50;
  const tab = () => TABELAS.DF;
  const item = () => tab().itens.find((i) => i.id === $("pr-servico").value);

  $("pr-fatores").innerHTML = FATORES.map(([k, rot, ops, padrao]) => `<label>${rot}<select id="pr-f-${k}" class="search">${ops.map(([n, m], i) => `<option value="${m}"${i === padrao ? " selected" : ""}>${n}</option>`).join("")}</select></label>`).join("");
  function listaServicos() {
    const f = semAcento($("pr-busca").value), t = tab();
    const pal = f.split(/\s+/).filter(Boolean);
    const vis = t.itens.filter((i) => { const alvo = semAcento(i.nome + " " + i.area); return pal.every((w) => alvo.includes(w)); });
    const areas = [...new Set(vis.map((i) => i.area))];
    $("pr-servico").innerHTML = areas.map((a) => `<optgroup label="${esc(a)}">${vis.filter((i) => i.area === a).map((i) => `<option value="${esc(i.id)}">${esc(i.nome.length > 110 ? i.nome.slice(0, 107) + "…" : i.nome)}</option>`).join("")}</optgroup>`).join("") || `<option value="">Nada encontrado</option>`;
    mostraItem();
  }
  function mostraItem() {
    const i = item(), t = tab();
    $("pr-urh-box").hidden = !t.urh;
    if (!i) { $("pr-item").innerHTML = ""; return; }
    const piso = t.urh ? (i.vm ? i.vm * num($("pr-urh").value) : 0) : i.valor;
    $("pr-item").innerHTML = `<b>Tabela:</b> ${t.urh ? (i.vm ? `mínimo ${i.vm} URH${num($("pr-urh").value) ? ` = ${R(piso)}` : " (informe o valor da URH)"}` : "sem valor mínimo fixo") : `mínimo ${R(i.valor)}`}${i.pct ? ` · ${i.pct[0] === i.pct[1] || !i.pct[1] ? `${i.pct[0]}%` : `${i.pct[0]}% a ${i.pct[1]}%`} sobre o proveito/valor` : ""}`;
    if (i.pct && !$("pr-exito").dataset.mexido) $("pr-exito").value = i.pct[0];
  }
  $("pr-urh").value = cfg.urh; $("pr-hora").value = cfg.valorHora;
  $("pr-busca").oninput = listaServicos;
  $("pr-servico").onchange = mostraItem;
  $("pr-urh").oninput = () => { cfg.urh = $("pr-urh").value; salvar(); mostraItem(); };
  $("pr-hora").onchange = () => { cfg.valorHora = $("pr-hora").value; salvar(); };
  $("pr-exito").oninput = () => ($("pr-exito").dataset.mexido = "1");
  listaServicos();

  let ultima = null;
  $("pr-calcular").onclick = () => {
    const i = item(), t = tab(); if (!i) return;
    const urh = num($("pr-urh").value);
    if (t.urh && i.vm && !urh) { $("pr-urh").focus(); $("pr-res").hidden = false; $("pr-res").innerHTML = `<p>Informe o valor da URH do mês (publicado no site da OAB/DF). Fica salvo.</p>`; return; }
    const piso = t.urh ? (i.vm || 0) * urh : i.valor;
    const mult = FATORES.reduce((m, [k]) => m * +$(`pr-f-${k}`).value, 1);
    const horas = num($("pr-horas").value), hora = Math.max(num($("pr-hora").value), t.horaPiso({ urh }));
    const proveito = num($("pr-proveito").value);
    const bases = [["Piso da tabela × critérios do caso", piso * mult]];
    if (horas) bases.push([`${String(horas).replace(".", ",")} h × ${R(hora)} × critérios`, horas * hora * mult]);
    if (i.pct && proveito) { const media = i.pct[1] ? (i.pct[0] + i.pct[1]) / 2 : i.pct[0]; bases.push([`${media}% da tabela sobre ${R(proveito)}`, proveito * media / 100]); }
    const sugerido = Math.max(arred(Math.max(...bases.map((b) => b[1]))), piso);
    const pctExito = +$("pr-exito").value || 0;
    const fixoMisto = Math.max(arred(sugerido * 0.5), arred(piso));
    const parcelas = Math.min(12, Math.max(1, Math.round(sugerido / 1000)));
    ultima = { servico: i.nome, item: i.n, sugerido, fixoMisto, pctExito, parcelas, piso, proveito };
    window.PrecoAtual = ultima;
    $("pr-res").hidden = false;
    $("pr-res").innerHTML = `
      <div class="kpis">
        <div class="kpi"><span class="muted small">Piso da tabela OAB/DF</span><strong style="font-size:1.4rem">${piso ? R(piso) : "—"}</strong><span class="small">${t.urh && i.vm ? `${i.vm} URH × ${R(urh)}` : piso ? "valor mínimo" : "item sem mínimo fixo"}</span></div>
        <div class="kpi alert"><span class="muted small">Opção 1 · Honorários fixos</span><strong style="font-size:1.6rem">${R(sugerido)}</strong><span class="small">até ${parcelas}x de ${R(sugerido / parcelas)}</span></div>
        <div class="kpi"><span class="muted small">Opção 2 · Fixo + êxito</span><strong style="font-size:1.6rem">${R(fixoMisto)}</strong><span class="small">+ ${pctExito}% do proveito${proveito ? ` (≈ ${R(proveito * pctExito / 100)})` : ""}</span></div>
      </div>
      ${i.pct && !proveito ? `<p class="small">Este item da tabela prevê percentual sobre o proveito/valor. Informe o proveito estimado para considerar.</p>` : ""}
      <p class="small muted">Esses valores entram na proposta e no contrato do kit (escolha a opção abaixo).</p><details class="small"><summary>Como chegamos a esse valor</summary><ul>${bases.map(([t2, v]) => `<li>${esc(t2)}: ${R(v)}</li>`).join("")}
        <li>Multiplicador dos critérios: ×${mult.toFixed(2).replace(".", ",")}</li><li>Sugestão = a maior das bases, arredondada, nunca abaixo do piso.</li></ul>
        <p>Item: ${esc(i.nome)} (${esc(t.nome)}). Critérios do Código de Ética e Disciplina, art. 49; vedado cobrar abaixo do mínimo da tabela (art. 48, §6º); êxito + sucumbência não podem superar o benefício do cliente (art. 50). Custas e despesas à parte.</p></details>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="back" id="pr-wa">Copiar proposta</button></div>`;
    $("pr-wa").onclick = async () => {
      const txt = `Proposta de honorários — ${i.nome}\n\nOpção 1: ${R(sugerido)} (até ${parcelas}x de ${R(sugerido / parcelas)})\nOpção 2: ${R(fixoMisto)} + ${pctExito}% do valor obtido ao final\n\nCustas e despesas do processo à parte. Fico à disposição para esclarecer.`;
      try { await navigator.clipboard.writeText(txt); $("pr-wa").textContent = "Copiado!"; } catch {}
    };
  };
})();
