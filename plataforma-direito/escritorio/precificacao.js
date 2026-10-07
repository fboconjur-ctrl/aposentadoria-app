// Precificação de serviços: sugere honorários por horas estimadas × valor-hora, ajustados pelos
// critérios do Código de Ética e Disciplina da OAB (art. 49), respeitando o piso da tabela da seccional
// (informado pela advogada) e o limite do art. 50 para êxito. Guardado neste navegador.
(() => {
  const CFG_KEY = "pd-precificacao";
  // Horas estimadas: ponto de partida editável; piso: valor mínimo da tabela OAB/DF (preencher).
  const SERVICOS_PADRAO = [
    ["consulta", "Consulta / parecer verbal", 1.5, "Geral"],
    ["notificacao", "Notificação extrajudicial", 3, "Geral"],
    ["jec", "Ação no Juizado Especial Cível (até sentença)", 10, "Consumidor"],
    ["civel", "Ação cível — procedimento comum, 1º grau", 30, "Cível"],
    ["liminar_saude", "Ação contra plano de saúde com pedido de liminar", 18, "Saúde"],
    ["contestacao", "Contestação", 12, "Cível"],
    ["recurso", "Recurso (apelação, inominado, ordinário)", 14, "Cível"],
    ["audiencia", "Audiência avulsa / correspondente", 4, "Geral"],
    ["inss_adm", "Benefício no INSS — via administrativa", 10, "Previdenciário"],
    ["inss_jud", "Ação previdenciária judicial", 25, "Previdenciário"],
    ["pad", "Defesa em PAD / sindicância", 28, "Administrativo"],
    ["ms", "Mandado de segurança", 16, "Administrativo"],
    ["inventario_ext", "Inventário extrajudicial (cartório)", 20, "Cartório/Extrajudicial"],
    ["divorcio_ext", "Divórcio consensual em cartório", 8, "Cartório/Extrajudicial"],
    ["trabalhista", "Reclamação trabalhista (reclamante)", 25, "Trabalhista"],
    ["defesa_penal", "Defesa criminal — 1º grau", 40, "Penal"],
  ];
  const FATORES = [
    ["complexidade", "Complexidade jurídica", [["Baixa", 0.85], ["Média", 1], ["Alta", 1.3], ["Muito alta", 1.6]], 1],
    ["urgencia", "Urgência", [["Normal", 1], ["Urgente (liminar, prazo curto)", 1.25], ["Plantão / imediato", 1.5]], 0],
    ["valor", "Valor econômico em jogo", [["Até R$ 20 mil", 1], ["R$ 20 a 100 mil", 1.15], ["R$ 100 a 500 mil", 1.35], ["Acima de R$ 500 mil", 1.6]], 0],
    ["cliente", "Condição econômica do cliente", [["Hipossuficiente", 0.8], ["Média", 1], ["Elevada / empresa", 1.25]], 1],
    ["local", "Local / deslocamento", [["Online / DF", 1], ["Entorno", 1.1], ["Outro estado (com viagens)", 1.3]], 0],
  ];
  let cfg = { valorHora: "", servicos: {} };
  try { cfg = { ...cfg, ...JSON.parse(localStorage.getItem(CFG_KEY) || "{}") }; } catch {}
  const salvar = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch {} };
  const num = (t) => { const s = String(t ?? "").trim(); return parseFloat(/,\d{1,2}$/.test(s) ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "")) || 0; };
  const R = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const arred = (v) => Math.ceil(v / 50) * 50; // arredonda para cima, múltiplos de R$ 50
  const serv = (id) => { const p = SERVICOS_PADRAO.find((s) => s[0] === id); const c = cfg.servicos[id] || {}; return { id, nome: p[1], area: p[3], horas: c.horas ?? p[2], piso: c.piso ?? "" }; };

  $("pr-servico").innerHTML = [...new Set(SERVICOS_PADRAO.map((s) => s[3]))].map((a) => `<optgroup label="${a}">${SERVICOS_PADRAO.filter((s) => s[3] === a).map((s) => `<option value="${s[0]}">${s[1]}</option>`).join("")}</optgroup>`).join("");
  $("pr-fatores").innerHTML = FATORES.map(([k, rot, ops, padrao]) => `<label>${rot}<select id="pr-f-${k}" class="search">${ops.map(([n, m], i) => `<option value="${m}"${i === padrao ? " selected" : ""}>${n}</option>`).join("")}</select></label>`).join("");
  $("pr-hora").value = cfg.valorHora;
  function carregaServico() { const s = serv($("pr-servico").value); $("pr-horas").value = String(s.horas).replace(".", ","); $("pr-piso").value = s.piso; }
  $("pr-servico").onchange = carregaServico; carregaServico();
  $("pr-hora").onchange = () => { cfg.valorHora = $("pr-hora").value; salvar(); };
  $("pr-horas").onchange = $("pr-piso").onchange = () => { cfg.servicos[$("pr-servico").value] = { horas: num($("pr-horas").value), piso: $("pr-piso").value }; salvar(); };

  let ultima = null;
  $("pr-form").onsubmit = (e) => {
    e.preventDefault();
    const hora = num($("pr-hora").value), horas = num($("pr-horas").value), piso = num($("pr-piso").value);
    if (!hora) { $("pr-hora").focus(); $("pr-res").hidden = false; $("pr-res").innerHTML = `<p>Informe o seu valor-hora (fica salvo).</p>`; return; }
    const mult = FATORES.reduce((m, [k]) => m * +$(`pr-f-${k}`).value, 1);
    const base = hora * horas, calc = arred(base * mult), sugerido = Math.max(calc, piso ? arred(piso) : 0);
    const proveito = num($("pr-proveito").value);
    const pctExito = +$("pr-exito").value || 0;
    // Opção mista: fixo menor + êxito; limite do art. 50 CED: êxito + sucumbência não podem superar o benefício do cliente.
    const fixoMisto = Math.max(arred(sugerido * 0.5), piso ? arred(piso) : 0);
    const exitoEstimado = proveito ? proveito * pctExito / 100 : 0;
    const parcelas = Math.min(12, Math.max(1, Math.round(sugerido / 1000)));
    const s = serv($("pr-servico").value);
    ultima = { servico: s.nome, sugerido, fixoMisto, pctExito, parcelas };
    const linhas = FATORES.map(([k, rot]) => `${rot}: ${$(`pr-f-${k}`).selectedOptions[0].text} (×${(+$(`pr-f-${k}`).value).toFixed(2).replace(".", ",")})`);
    $("pr-res").hidden = false;
    $("pr-res").innerHTML = `
      <div class="kpis">
        <div class="kpi"><span class="muted small">Opção 1 · Honorários fixos</span><strong style="font-size:1.6rem">${R(sugerido)}</strong><span class="small">até ${parcelas}x de ${R(sugerido / parcelas)}</span></div>
        <div class="kpi"><span class="muted small">Opção 2 · Fixo + êxito</span><strong style="font-size:1.6rem">${R(fixoMisto)}</strong><span class="small">+ ${pctExito}% do proveito${exitoEstimado ? ` (≈ ${R(exitoEstimado)})` : ""}</span></div>
      </div>
      ${piso && calc < piso ? `<p class="small" style="color:#b42318"><b>O cálculo (${R(calc)}) ficou abaixo do piso da tabela (${R(piso)}).</b> A sugestão foi elevada ao piso — cobrar abaixo pode configurar aviltamento (CED, art. 48, §6º).</p>` : ""}
      ${!piso ? `<p class="small" style="color:#b42318">Informe o piso da tabela da OAB/DF para este serviço — a sugestão ainda não foi conferida com o mínimo.</p>` : ""}
      <details class="small"><summary>Como chegamos a esse valor</summary><ul>
        <li>${String(horas).replace(".", ",")} h × ${R(hora)} = ${R(base)}</li>${linhas.map((l) => `<li>${l}</li>`).join("")}
        <li>Multiplicador total ×${mult.toFixed(2).replace(".", ",")} → ${R(base * mult)} (arredondado: ${R(calc)})</li></ul>
        <p>Critérios do Código de Ética e Disciplina da OAB, art. 49 (relevância, complexidade, trabalho e tempo, valor da causa, condição econômica do cliente, local, caráter da intervenção). Êxito + sucumbência não podem superar o benefício do cliente (art. 50). Custas e despesas à parte.</p></details>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn" id="pr-contrato">Usar no contrato</button><button type="button" class="back" id="pr-wa">Copiar proposta</button></div>`;
    $("pr-contrato").onclick = () => {
      go("docs"); const d = document.querySelector("#v-docs details:not(#meus-dados)"); if (d) d.open = true;
      $("doc-modelo").value = "contrato"; $("doc-modelo").dispatchEvent(new Event("change"));
      setTimeout(() => { if ($("f-fixo")) $("f-fixo").value = String(ultima.sugerido).replace(".", ","); if ($("f-pagamento")) $("f-pagamento").value = ultima.parcelas > 1 ? `em ${ultima.parcelas} parcelas mensais` : "à vista, na assinatura"; if ($("f-objeto")) $("f-objeto").focus(); }, 0);
    };
    $("pr-wa").onclick = async () => {
      const txt = `Proposta de honorários — ${s.nome}\n\nOpção 1: ${R(sugerido)} (até ${parcelas}x de ${R(sugerido / parcelas)})\nOpção 2: ${R(fixoMisto)} + ${pctExito}% do valor obtido ao final\n\nCustas e despesas do processo à parte. Fico à disposição para esclarecer.`;
      try { await navigator.clipboard.writeText(txt); $("pr-wa").textContent = "Copiado!"; } catch {}
    };
  };
  window.Precificacao = { SERVICOS_PADRAO, serv };
})();
