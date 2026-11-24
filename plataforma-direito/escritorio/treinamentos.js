// Treinamentos e consultorias (área da titular): cadastro dos eventos e contratos, situação
// (proposta → confirmado → realizado → pago), proposta pronta para enviar, lista de presença e certificados.
// Os dados ficam na chave "pd-treinamentos", que vai para a nuvem junto com o resto do painel.
(() => {
  const KEY = "pd-treinamentos";
  const ST = { proposta: "📝 Proposta enviada", confirmado: "✅ Confirmado", realizado: "🎓 Realizado", pago: "💰 Pago", cancelado: "✖️ Cancelado" };
  const TEMAS = ["Nova Lei de Licitações na prática", "Gestão e fiscalização de contratos", "PAD e sindicância para comissões", "Responsabilidade do gestor público", "LAI e LGPD no setor público", "Direitos do servidor público", "Consultoria para empresas que licitam", "Programa de integridade (compliance)", "Pareceres jurídicos", "Consultoria para associações de servidores"];
  let lista = ler(KEY, []), editando = null, filtro = "ativos";
  const salvar = () => gravar(KEY, lista);
  const adv = () => window.DocGerador?.adv() || {};
  const dataBR = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR") : "sem data");
  const box = $("tr-int");
  if (!box) return;

  $("tr-temas").innerHTML = TEMAS.map((t) => `<option>${esc(t)}</option>`).join("");
  function render() {
    const ord = [...lista].sort((a, b) => (a.data || "9").localeCompare(b.data || "9"));
    const vis = ord.filter((t) => filtro === "todos" || (filtro === "ativos" ? !["pago", "cancelado"].includes(t.status) : t.status === filtro));
    const soma = (f) => lista.filter(f).reduce((s, t) => s + (+t.valor || 0), 0);
    $("tr-resumo").innerHTML = `<span>📝 Em proposta: <b>${lista.filter((t) => t.status === "proposta").length}</b></span><span>📅 Confirmados: <b>${lista.filter((t) => t.status === "confirmado").length}</b></span><span>⏳ A receber: <b>${reaisBR(soma((t) => ["confirmado", "realizado"].includes(t.status)))}</b></span><span>💰 Recebido: <b>${reaisBR(soma((t) => t.status === "pago"))}</b></span>`;
    $("tr-itens").innerHTML = vis.map((t) => `<li class="tr-item">
      <div><b>${esc(t.tema)}</b> <span class="small muted">· ${esc(t.formato || "")}</span><br>
      <span class="small">${esc(t.org || "sem órgão/empresa")} · ${dataBR(t.data)}${t.hora ? " às " + esc(t.hora) : ""}${t.local ? " · " + esc(t.local) : ""}${t.pessoas ? ` · ${esc(t.pessoas)} participantes` : ""}${t.valor ? " · " + reaisBR(t.valor) : ""}</span></div>
      <div class="tr-acoes"><select data-st="${t.id}">${Object.entries(ST).map(([k, v]) => `<option value="${k}"${t.status === k ? " selected" : ""}>${v}</option>`).join("")}</select>
      <button class="linkish small" data-ed="${t.id}">editar</button><button class="linkish small" data-prop="${t.id}">proposta</button><button class="linkish small" data-pres="${t.id}">presença</button><button class="linkish small" data-cert="${t.id}">certificados</button></div></li>`).join("") || `<li class="muted">Nada por aqui${filtro === "ativos" ? ". Cadastre o primeiro treinamento ou consultoria acima." : "."}</li>`;
    $("tr-itens").querySelectorAll("[data-st]").forEach((s) => (s.onchange = () => { const t = lista.find((x) => x.id === s.dataset.st); t.status = s.value; salvar(); render(); }));
    $("tr-itens").querySelectorAll("[data-ed]").forEach((b) => (b.onclick = () => editar(lista.find((x) => x.id === b.dataset.ed))));
    $("tr-itens").querySelectorAll("[data-prop]").forEach((b) => (b.onclick = () => proposta(lista.find((x) => x.id === b.dataset.prop))));
    $("tr-itens").querySelectorAll("[data-pres]").forEach((b) => (b.onclick = () => presenca(lista.find((x) => x.id === b.dataset.pres))));
    $("tr-itens").querySelectorAll("[data-cert]").forEach((b) => (b.onclick = () => certificados(lista.find((x) => x.id === b.dataset.cert))));
  }
  const campos = ["tema", "formato", "org", "contato", "data", "hora", "carga", "local", "pessoas", "valor", "obs", "participantes"];
  function editar(t) {
    editando = t ? t.id : null;
    campos.forEach((c) => ($("tr-" + c).value = t ? t[c] || "" : ""));
    if (!$("tr-formato").value) $("tr-formato").selectedIndex = 0;
    $("tr-salvar").textContent = t ? "Salvar alterações" : "Cadastrar";
    $("tr-excluir").hidden = !t;
    $("tr-cad").open = true; $("tr-cad").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("tr-form-int").onsubmit = (e) => {
    e.preventDefault();
    const d = {}; campos.forEach((c) => (d[c] = $("tr-" + c).value.trim()));
    d.valor = d.valor ? +String(d.valor).replace(/\./g, "").replace(",", ".") || 0 : 0;
    if (editando) Object.assign(lista.find((x) => x.id === editando), d);
    else lista.push({ id: "tr" + Date.now().toString(36), status: "proposta", criado: Date.now(), ...d });
    salvar(); editar(null); $("tr-cad").open = false; render();
  };
  $("tr-excluir").onclick = () => { if (editando && confirm("Excluir este registro?")) { lista = lista.filter((x) => x.id !== editando); salvar(); editar(null); $("tr-cad").open = false; render(); } };
  $("tr-novo").onclick = () => editar(null);
  document.querySelectorAll("[data-trf]").forEach((b) => (b.onclick = () => { filtro = b.dataset.trf; document.querySelectorAll("[data-trf]").forEach((x) => x.classList.toggle("on", x === b)); render(); }));

  // Janela de impressão
  function imprimir(titulo, corpo, css = "") {
    const w = window.open("", "_blank"); if (!w) return alert("Libere as janelas pop-up para imprimir.");
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>body{font:12pt/1.6 Georgia,serif;color:#111;margin:0}.pg{padding:22mm 20mm;page-break-after:always}h1{font:700 18pt/1.2 Arial,sans-serif}table{width:100%;border-collapse:collapse}td,th{border:1px solid #999;padding:8px;text-align:left}${css}</style></head><body>${corpo}</body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 400);
  }
  function proposta(t) {
    const a = adv();
    const texto = `PROPOSTA DE ${/consultoria|parecer/i.test(t.tema + t.formato) ? "SERVIÇOS DE CONSULTORIA" : "TREINAMENTO"}\n\nPara: ${t.org || "[ÓRGÃO/EMPRESA]"}${t.contato ? `\nA/C: ${t.contato}` : ""}\n\nTema: ${t.tema}\nFormato: ${t.formato || "[FORMATO]"}${t.carga ? `\nCarga horária: ${t.carga}` : ""}${t.pessoas ? `\nParticipantes: até ${t.pessoas}` : ""}${t.data ? `\nData sugerida: ${dataBR(t.data)}${t.hora ? " às " + t.hora : ""}` : ""}${t.local ? `\nLocal: ${t.local}` : ""}\n\nConteúdo:\n[DESCREVA OS TÓPICOS]\n\nInclui: material de apoio${/consultoria|parecer/i.test(t.tema + t.formato) ? "" : " e certificado de participação"}.\n\nHonorários: ${t.valor ? reaisBR(t.valor) : "[VALOR]"}\nForma de pagamento: [CONDIÇÕES]\nValidade desta proposta: 30 dias.\n${t.obs ? `\nObservações: ${t.obs}\n` : ""}\n${a.nome || "[NOME]"}\nAdvogada · OAB ${a.oab || "[OAB]"}`;
    $("tr-saida").value = texto; $("tr-saida-box").hidden = false; $("tr-saida-tit").textContent = "Proposta (edite à vontade antes de enviar)";
    $("tr-saida-box").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("tr-copiar").onclick = async () => { try { await navigator.clipboard.writeText($("tr-saida").value); $("tr-copiar").textContent = "Copiado ✓"; setTimeout(() => ($("tr-copiar").textContent = "Copiar"), 1500); } catch { $("tr-saida").select(); } };
  $("tr-imprimir").onclick = () => imprimir("Proposta", `<div class="pg"><pre style="white-space:pre-wrap;font:inherit">${esc($("tr-saida").value)}</pre></div>`);
  const nomes = (t) => (t.participantes || "").split(/\n/).map((x) => x.trim()).filter(Boolean);
  function presenca(t) {
    const ns = nomes(t), linhas = (ns.length ? ns : Array(Math.max(15, +t.pessoas || 15)).fill(""));
    imprimir("Lista de presença", `<div class="pg"><h1>Lista de presença</h1><p><b>${esc(t.tema)}</b><br>${esc(t.org || "")} · ${dataBR(t.data)}${t.hora ? " às " + esc(t.hora) : ""}${t.local ? " · " + esc(t.local) : ""}</p>
      <table><tr><th style="width:6%">#</th><th>Nome</th><th style="width:22%">Matrícula/CPF</th><th style="width:30%">Assinatura</th></tr>${linhas.map((n, i) => `<tr><td>${i + 1}</td><td>${esc(n)}</td><td></td><td style="height:26px"></td></tr>`).join("")}</table></div>`);
  }
  function certificados(t) {
    const ns = nomes(t);
    if (!ns.length) { alert("Preencha os nomes dos participantes (um por linha) em \"editar\" para gerar os certificados."); return editar(t); }
    const a = adv();
    imprimir("Certificados", ns.map((n) => `<div class="pg cert"><p class="selo">CERTIFICADO</p><p>Certificamos que</p><p class="nome">${esc(n)}</p><p>participou do ${/curso/i.test(t.formato) ? "curso" : /workshop/i.test(t.formato) ? "workshop" : "treinamento"} <b>${esc(t.tema)}</b>${t.org ? `, promovido para ${esc(t.org)}` : ""}, realizado em ${dataBR(t.data)}${t.carga ? `, com carga horária de ${esc(t.carga)}` : ""}.</p><div class="ass"><p>__________________________________</p><p>${esc(a.nome || "")}<br>Advogada · OAB ${esc(a.oab || "")}</p></div></div>`).join(""),
      "@page{size:A4 landscape;margin:0}.cert{text-align:center;padding:30mm 28mm;border:10px double #2340b8;margin:10mm;height:calc(210mm - 20mm - 60mm - 20px);font-size:15pt}.selo{font:800 30pt Arial,sans-serif;letter-spacing:.2em;color:#2340b8;margin:0 0 10mm}.nome{font:700 24pt Georgia,serif;margin:6mm 0}.ass{margin-top:16mm;font-size:12pt}");
  }
  render();
  // Atualiza quando a nuvem traz dados novos.
  addEventListener("storage", (e) => { if (e.key === KEY) { lista = ler(KEY, []); render(); } });
})();
