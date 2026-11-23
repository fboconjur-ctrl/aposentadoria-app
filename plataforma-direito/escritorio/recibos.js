// Recibos numerados de honorários: um por pagamento recebido e, ao final, o recibo de quitação geral.
// "Liberar" publica o recibo na área do cliente, que pode ver e imprimir.
(() => {
  const D = () => window.DocGerador;
  const ano = () => new Date().getFullYear();
  function proximoNumero() {
    let s; try { s = JSON.parse(localStorage.getItem("pd-recibo-seq") || "{}"); } catch { s = {}; }
    const a = ano(); s[a] = (s[a] || 0) + 1; localStorage.setItem("pd-recibo-seq", JSON.stringify(s));
    return `${String(s[a]).padStart(3, "0")}/${a}`;
  }
  const pagador = (cli) => ({ nome: cli.nome, tipo: DocId.cnpj(cli.cpf) ? "CNPJ" : "CPF", doc: cli.cpf });
  const casca = (titulo, corpo) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title><style>body{font:12pt/1.6 "Times New Roman",serif;max-width:700px;margin:40px auto;padding:0 24px;color:#111}h3{text-align:center;margin-bottom:4px}.num{text-align:center;margin-top:0;color:#444}p{text-align:justify}.ass{text-align:center;margin-top:56px}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{border-bottom:1px solid #ccc;padding:4px 6px;text-align:left;font-size:11pt}.v{text-align:right}@media print{body{margin:15mm}}</style></head><body>${corpo}</body></html>`;
  function htmlParcela(l, cli, num) {
    const G = D(), p = pagador(cli), e = G.esc;
    return casca(`Recibo ${num}`, `<h3>RECIBO DE HONORÁRIOS ADVOCATÍCIOS</h3><p class="num">Nº ${num}</p>
      <p>${G.advQualif()}, DECLARO, para os devidos fins, que recebi de <b>${e(p.nome.toUpperCase())}</b>, inscrito(a) no ${p.tipo} sob o n.º ${e(p.doc)}, a importância de:</p>
      <p style="text-align:center"><b>${G.reais(String(l.valor).replace(".", ","))}</b></p>
      <p>referente a ${e(l.desc || "honorários advocatícios")}${l.parcela ? `, parcela ${e(l.parcela)}` : ""}, paga em ${fmt(deIso(l.pago))}, conforme o Contrato de Prestação de Serviços Advocatícios firmado entre as partes.</p>
      <p>O presente recibo dá quitação somente do valor acima, sem prejuízo das demais parcelas e dos honorários de êxito eventualmente convencionados.</p>
      <p>${G.local({})}</p>${G.assinatura(G.adv().nome || "", "OAB " + (G.adv().oab || ""))}`);
  }
  function htmlQuitacao(cli, lanc, num) {
    const G = D(), p = pagador(cli), e = G.esc, total = lanc.reduce((t, l) => t + (+l.valor || 0), 0);
    return casca(`Quitação ${num}`, `<h3>RECIBO DE QUITAÇÃO GERAL DE HONORÁRIOS</h3><p class="num">Nº ${num}</p>
      <p>${G.advQualif()}, DECLARO, para os devidos fins, que recebi de <b>${e(p.nome.toUpperCase())}</b>, inscrito(a) no ${p.tipo} sob o n.º ${e(p.doc)}, a importância total de <b>${G.reais(String(total.toFixed(2)).replace(".", ","))}</b>, correspondente aos pagamentos abaixo:</p>
      <table><thead><tr><th>Data</th><th>Descrição</th><th class="v">Valor</th></tr></thead><tbody>${lanc.map((l) => `<tr><td>${fmt(deIso(l.pago))}</td><td>${e(l.desc || "Honorários")}${l.parcela ? ` (${e(l.parcela)})` : ""}${l.reciboNum ? ` — recibo nº ${e(l.reciboNum)}` : ""}</td><td class="v">${reaisBR(l.valor)}</td></tr>`).join("")}</tbody></table>
      <p>Com o recebimento integral dos valores acima, dou <b>plena, geral e irrevogável quitação</b> dos honorários contratuais devidos em razão do Contrato de Prestação de Serviços Advocatícios firmado entre as partes, nada mais havendo a receber a esse título. [CONFERIR: se houver honorários de êxito ainda pendentes, ressalvar aqui.]</p>
      <p>${G.local({})}</p>${G.assinatura(G.adv().nome || "", "OAB " + (G.adv().oab || ""))}`);
  }
  const abrir = (html) => { const w = open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank"); if (!w) alert("Permita janelas deste site para ver o recibo."); };
  const exige = (cli) => {
    if (!cli || !DocId.valido(cli.cpf)) { alert("Para o recibo, cadastre o CPF/CNPJ do cliente (Editar dados → Mais dados)."); return false; }
    if (!D().adv().nome || !D().adv().oab) { alert("Preencha seus dados (nome e OAB) em Ferramentas → Procuração e contrato → Meus dados."); return false; }
    return true;
  };
  window.Recibos = {
    parcela(l, { liberar } = {}) {
      const cli = cliPorId(l.cli); if (!exige(cli)) return;
      l.reciboNum ||= proximoNumero();
      const html = htmlParcela(l, cli, l.reciboNum);
      if (liberar) { l.reciboLib = { num: l.reciboNum, em: new Date().toISOString(), html }; (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: `Recibo nº ${l.reciboNum} liberado na área do cliente` }); salvarCrm(); }
      salvarFin(); if (!liberar) abrir(html); return true;
    },
    quitacao(cli, { liberar } = {}) {
      if (!exige(cli)) return;
      const lanc = fin.filter((l) => l.cli === cli.id && l.tipo === "receita").sort((a, b) => String(a.pago).localeCompare(String(b.pago)));
      if (!lanc.length || lanc.some((l) => !l.pago)) { alert("A quitação geral só pode ser emitida quando todos os pagamentos do cliente estiverem recebidos."); return; }
      cli.quitacao ||= { num: proximoNumero() };
      const html = htmlQuitacao(cli, lanc, cli.quitacao.num);
      if (liberar) { cli.quitacao = { ...cli.quitacao, em: new Date().toISOString(), html }; (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: `Recibo de quitação geral nº ${cli.quitacao.num} liberado` }); }
      salvarCrm(); if (!liberar) abrir(html); return true;
    },
  };
})();
