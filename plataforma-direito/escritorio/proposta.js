// Gerador de proposta de honorários: escopo claro, opções de pagamento, validade.
// Pode ser impressa/salva em PDF, enviada pelo WhatsApp e liberada na área do cliente, onde ele aceita com um toque.
(() => {
  const V = document.getElementById("v-proposta"); if (!V) return;
  const $q = (s) => V.querySelector(s);
  const R = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const num = (t) => +String(t || "").replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".") || 0;
  const INCLUI = "Análise do caso e dos documentos; definição da estratégia; elaboração e protocolo das peças; acompanhamento do processo em primeira instância, inclusive audiências; interposição ou resposta de recurso à segunda instância; atualizações periódicas pela área do cliente.";
  const NAO_INCLUI = "Recursos aos tribunais superiores (STJ/STF), sustentação oral, cumprimento de sentença ou execução em processo separado e demandas novas, que serão objeto de nova proposta.";
  let cli = null;

  function preencher() {
    const pr = window.PrecoAtual;
    if (pr && !$q("#pp-v1").value) { $q("#pp-v1").value = String(pr.sugerido).replace(".", ","); $q("#pp-parc").value = pr.parcelas || 1; $q("#pp-v2").value = String(pr.fixoMisto).replace(".", ","); $q("#pp-pct").value = pr.pctExito || 20; }
  }
  function abrirPara(c) {
    cli = c; go("proposta");
    const s = $q("#pp-cli"); s.innerHTML = clientes.map((x) => `<option value="${x.id}">${esc(x.nome)}</option>`).join(""); if (c) s.value = c.id;
    const x = cliPorId(s.value); cli = x;
    $q("#pp-serv").value = x?.proposta?.dados?.serv || [x?.area, x?.assunto].filter(Boolean).join(" — ");
    $q("#pp-contra").value = x?.contra?.split("\n")[0] || "";
    if (!$q("#pp-inclui").value) $q("#pp-inclui").value = INCLUI;
    if (!$q("#pp-nao").value) $q("#pp-nao").value = NAO_INCLUI;
    preencher(); status();
  }
  function status() {
    const p = cli?.proposta;
    $q("#pp-st").innerHTML = !p ? "" : p.aceita ? `✅ Proposta nº ${esc(p.num)} <b>aceita pelo cliente</b> em ${new Date(p.aceita).toLocaleString("pt-BR")}.` : p.html ? `📤 Proposta nº ${esc(p.num)} liberada na área do cliente em ${new Date(p.em).toLocaleDateString("pt-BR")} · aguardando aceite.` : "";
  }
  function dados() {
    return { serv: $q("#pp-serv").value.trim(), contra: $q("#pp-contra").value.trim(), inclui: $q("#pp-inclui").value.trim(), nao: $q("#pp-nao").value.trim(),
      v1: num($q("#pp-v1").value), parc: Math.max(1, +$q("#pp-parc").value || 1), op2: $q("#pp-op2").checked, v2: num($q("#pp-v2").value), pct: +$q("#pp-pct").value || 0,
      validade: Math.max(1, +$q("#pp-val").value || 15), obs: $q("#pp-obs").value.trim() };
  }
  function html(c, d, numero) {
    const G = window.DocGerador, a = G?.adv() || {}, e = G?.esc || esc;
    const ate = new Date(Date.now() + d.validade * 864e5).toLocaleDateString("pt-BR");
    const op1 = d.v1 ? `<div class="op"><b>Opção 1 — Honorários fixos</b><p class="v">${R(d.v1)}</p><p>${d.parc > 1 ? `Em até ${d.parc} parcelas mensais de ${R(d.v1 / d.parc)}, a primeira na assinatura do contrato.` : "Na assinatura do contrato."}</p></div>` : "";
    const op2 = d.op2 && d.v2 ? `<div class="op"><b>Opção 2 — Fixo + êxito</b><p class="v">${R(d.v2)} + ${d.pct}%</p><p>${R(d.v2)} na contratação, mais ${d.pct}% sobre o proveito econômico obtido ao final, apenas se houver êxito.</p></div>` : "";
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Proposta ${e(numero)}</title><style>
      body{font:11.5pt/1.6 Georgia,"Times New Roman",serif;color:#16224a;max-width:720px;margin:36px auto;padding:0 24px}
      h1{font:700 20pt Arial,sans-serif;margin:0}.sub{color:#556;margin:2px 0 18px;font-family:Arial,sans-serif;font-size:10pt}
      h2{font:700 12pt Arial,sans-serif;margin:22px 0 6px;color:#2340b8;border-bottom:2px solid #e3e7f5;padding-bottom:4px}
      .ops{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.op{border:1.5px solid #cfd6ee;border-radius:10px;padding:12px 14px}.op p{margin:4px 0}.v{font:700 16pt Arial,sans-serif;color:#16224a}
      .ass{text-align:center;margin-top:48px}.nota{font-size:9.5pt;color:#556}@media print{body{margin:12mm}}</style></head><body>
      <h1>Proposta de honorários advocatícios</h1>
      <p class="sub">Nº ${e(numero)} · ${new Date().toLocaleDateString("pt-BR")} · válida até ${ate}</p>
      <p><b>Para:</b> ${e(c.nome)}<br><b>Advogada:</b> ${e(a.nome || "[seu nome]")} — OAB ${e(a.oab || "[OAB]")}</p>
      <h2>O serviço</h2><p>${e(d.serv || "[descrever o serviço]")}${d.contra ? `, em face de ${e(d.contra)}` : ""}.</p>
      <h2>O que está incluído</h2><p>${e(d.inclui)}</p>
      <h2>O que não está incluído</h2><p>${e(d.nao)}</p>
      <h2>Honorários</h2><div class="ops">${op1}${op2 || ""}</div>${!op1 && !op2 ? "<p>[COMPLETAR valores]</p>" : ""}
      <h2>Outras condições</h2><ul>
        <li>Custas, perícias e demais despesas do processo ficam por conta do cliente, sempre com aviso prévio.</li>
        <li>Honorários de sucumbência eventualmente fixados pelo juiz pertencem à advogada (Lei 8.906/1994, art. 23) e não se confundem com os honorários acima.</li>
        <li>O trabalho começa após a assinatura do contrato de honorários e da procuração (pode ser pelo gov.br) <b>e da conversa com a advogada, agendada após o pagamento da entrada ou da consulta</b>. Mesmo com os documentos já enviados, o caso só segue depois dessa conversa.</li>
        <li>Não há garantia de resultado: a advocacia é atividade de meio, e a advogada se compromete com a atuação técnica e diligente.</li>
        ${d.obs ? `<li>${e(d.obs)}</li>` : ""}</ul>
      <p class="nota">Proposta elaborada conforme o Código de Ética e Disciplina da OAB e a tabela de honorários da Seccional.</p>
      <p class="ass">_______________________________________<br><b>${e((a.nome || "").toUpperCase())}</b><br>OAB ${e(a.oab || "")}</p>
      </body></html>`;
  }
  const abrir = (h) => { const w = open(URL.createObjectURL(new Blob([h], { type: "text/html" })), "_blank"); if (!w) alert("Permita janelas deste site."); };
  const numero = () => { let s; try { s = JSON.parse(localStorage.getItem("pd-proposta-seq") || "{}"); } catch { s = {}; } const a = new Date().getFullYear(); s[a] = (s[a] || 0) + 1; localStorage.setItem("pd-proposta-seq", JSON.stringify(s)); return `P${String(s[a]).padStart(3, "0")}/${a}`; };
  const exige = () => { if (!cli) { alert("Escolha o cliente."); return false; } if (!window.DocGerador?.adv().nome) { alert("Preencha seus dados (nome e OAB) em Ferramentas → Procuração e contrato → Meus dados."); return false; } return true; };

  $q("#pp-cli").addEventListener("change", (e) => abrirPara(cliPorId(e.target.value)));
  $q("#pp-ver").onclick = () => { if (exige()) abrir(html(cli, dados(), cli.proposta?.num || "prévia")); };
  $q("#pp-liberar").onclick = () => {
    if (!exige()) return; if (!cli.portal?.token) { alert("Crie a área do cliente na ficha antes de liberar a proposta."); return; }
    if (!confirm("Liberar esta proposta na área do cliente? Ele poderá ver, imprimir e aceitar.")) return;
    const d = dados(), n = numero();
    cli.proposta = { num: n, em: new Date().toISOString(), validade: new Date(Date.now() + d.validade * 864e5).toISOString().slice(0, 10), html: html(cli, d, n), dados: d };
    if (["Novo pedido", "Consulta marcada"].includes(cli.etapa)) cli.etapa = "Proposta enviada";
    (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: `Proposta nº ${n} liberada na área do cliente` }); salvarCrm(); status();
  };
  $q("#pp-wa").onclick = () => {
    if (!exige()) return; const d = dados(), t = telWa(cli.tel);
    const txt = `Olá, ${primeiroNome(cli.nome)}! Conforme conversamos, segue a proposta para o seu caso (${d.serv}):\n\n${d.v1 ? `• Opção 1: ${R(d.v1)}${d.parc > 1 ? ` em até ${d.parc}x de ${R(d.v1 / d.parc)}` : ""}\n` : ""}${d.op2 && d.v2 ? `• Opção 2: ${R(d.v2)} + ${d.pct}% apenas se houver êxito\n` : ""}\n${cli.proposta?.html && cli.portal?.token ? `A proposta completa está na sua área, onde você pode aceitar com um toque:\nhttps://plataformadodireito.com.br/plataforma-direito/minha-area/#${cli.portal.token}\n\n` : ""}Validade: ${d.validade} dias. Fico à disposição para qualquer dúvida.`;
    if (!t) { navigator.clipboard?.writeText(txt); alert("Cliente sem WhatsApp cadastrado: o texto foi copiado."); return; }
    open(`https://wa.me/${t}?text=${encodeURIComponent(txt)}`, "_blank", "noopener"); (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: "WhatsApp: proposta de honorários" }); salvarCrm();
  };
  $q("#pp-calc").onclick = () => { go("docs"); setTimeout(() => document.getElementById("pr-busca")?.focus(), 200); };
  window.Proposta = { abrirPara, preencher };
})();
