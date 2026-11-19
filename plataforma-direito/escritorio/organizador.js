// Organizador de documentos do cliente: lê os arquivos no próprio navegador (PDF com texto ou foto via OCR),
// separa por categoria, sugere nomes padronizados, mostra o que falta e baixa tudo em um ZIP com pastas.
// Nenhum arquivo é enviado a servidor.
(() => {
  const CATS = [
    ["01 Documentos pessoais", /\b(rg|cin|carteira de identidade|identidade|cnh|carteira nacional de habilita|cpf|certid[aã]o de (nascimento|casamento|[oó]bito)|t[ií]tulo de eleitor|passaporte)\b/i],
    ["02 Comprovante de residência", /(comprovante de (endere[cç]o|resid[eê]ncia)|conta de (luz|[aá]gua|energia|g[aá]s|telefone)|neoenergia|caesb|\bceb\b|sabesp|enel|cemig|copel|light|vivo|claro|tim\b|oi fibra)/i],
    ["03 Procuração e contrato", /(procura[cç][aã]o|contrato de (presta[cç][aã]o de servi[cç]os|honor[aá]rios)|declara[cç][aã]o de hipossufici[eê]ncia|substabelecimento)/i],
    ["04 INSS e previdência", /(\bcnis\b|\binss\b|meu inss|benef[ií]cio|carta de (concess[aã]o|indeferimento)|\bppp\b|perfil profissiogr[aá]fico|ltcat|ctps|carteira de trabalho|per[ií]cia m[eé]dica federal|\bnb\b ?\d)/i],
    ["05 Saúde e laudos", /(laudo|atestado|relat[oó]rio m[eé]dico|\bcid\b|exame|receitu[aá]rio|prontu[aá]rio|operadora|plano de sa[uú]de|ans\b|negativa|unimed|amil|hapvida|sulam[eé]rica|bradesco sa[uú]de|cassi|geap|notredame)/i],
    ["06 Trabalho e renda", /(contracheque|holerite|demonstrativo de pagamento|fgts|rescis[aã]o|\btrct\b|ficha funcional|portaria|di[aá]rio oficial|imposto de renda|declara[cç][aã]o de ajuste)/i],
    ["07 Bancos e consumo", /(extrato|fatura|boleto|nota fiscal|cupom fiscal|empr[eé]stimo|consignado|cart[aã]o de cr[eé]dito|protocolo de atendimento|procon|consumidor\.gov)/i],
    ["08 Processo", /(\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}|senten[cç]a|despacho|intima[cç][aã]o|cita[cç][aã]o|peti[cç][aã]o|ac[oó]rd[aã]o|decis[aã]o|mandado)/i],
  ];
  const OUTROS = "09 Outros";
  const ROTULO = { "01 Documentos pessoais": (t) => (/cnh|habilita/i.test(t) ? "CNH" : /cpf/i.test(t) && !/rg|identidade|cin/i.test(t) ? "CPF" : /certid/i.test(t) ? "Certidão" : "Documento de identidade"), "02 Comprovante de residência": () => "Comprovante de residência", "04 INSS e previdência": (t) => (/cnis/i.test(t) ? "CNIS" : /ppp|profissiogr/i.test(t) ? "PPP" : /ctps|carteira de trabalho/i.test(t) ? "CTPS" : /indeferimento/i.test(t) ? "Carta de indeferimento" : "Documento INSS"), "05 Saúde e laudos": (t) => (/laudo/i.test(t) ? "Laudo" : /atestado/i.test(t) ? "Atestado" : /exame/i.test(t) ? "Exame" : "Documento médico"), "06 Trabalho e renda": (t) => (/contracheque|holerite|demonstrativo/i.test(t) ? "Contracheque" : /fgts/i.test(t) ? "FGTS" : "Documento de trabalho") };
  function classificar(nome, texto) {
    const alvo = `${nome}\n${texto.slice(0, 6000)}`;
    let melhor = OUTROS, pontos = 0;
    for (const [cat, re] of CATS) { const n = (alvo.match(new RegExp(re.source, "gi")) || []).length + (re.test(nome) ? 3 : 0); if (n > pontos) { pontos = n; melhor = cat; } }
    return melhor;
  }
  const dataNoTexto = (t) => { const m = t.match(/\b(\d{2})\/(\d{2})\/(20\d{2})\b/); return m ? `${m[3]}-${m[2]}` : ""; };
  let arquivos = []; // { file, texto, cat, nome }
  const ext = (f) => (f.name.match(/\.[a-z0-9]+$/i) || [""])[0].toLowerCase();
  function nomeSugerido(a, i) {
    const c = cliPorId($("or-cli").value), quem = c ? ` - ${c.nome}` : "";
    const base = a.file.name.replace(/\.[^.]+$/, "").trim();
    const rot = a.cat === OUTROS ? base : (ROTULO[a.cat] || ((x) => a.cat.replace(/^\d+ /, "")))(`${a.file.name} ${a.texto}`);
    const d = dataNoTexto(a.texto);
    return `${String(i + 1).padStart(2, "0")} - ${rot}${d ? ` ${d}` : ""}${quem}${ext(a.file)}`.replace(/[\\/:*?"<>|]/g, "");
  }
  function render() {
    const todas = [...CATS.map((c) => c[0]), OUTROS];
    arquivos.sort((x, y) => x.cat.localeCompare(y.cat));
    $("or-tab").innerHTML = arquivos.map((a, i) => `<tr data-i="${i}"><td class="small">${esc(a.file.name)}${a.lendo ? ' <span class="muted">(lendo…)</span>' : ""}</td>
      <td><select class="search or-cat">${todas.map((t) => `<option${t === a.cat ? " selected" : ""}>${t}</option>`).join("")}</select></td>
      <td><input class="search or-nome" value="${esc(a.nome || nomeSugerido(a, i))}"></td><td><button class="linkish small" data-or="del">remover</button></td></tr>`).join("");
    $("or-saida").hidden = !arquivos.length;
    // o que falta, pela lista de documentos da área do cliente
    const c = cliPorId($("or-cli").value), falta = c && window.docsFaltando ? window.docsFaltando(c) : [];
    const temCat = new Set(arquivos.map((a) => a.cat));
    const pede = { "Documento de identidade": "01", "RG/CNH, CPF e comprovante de residência": "01" };
    $("or-falta").innerHTML = c ? (falta.length ? `<b>Ainda podem faltar</b> (pela lista da área ${esc(c.area || "")}):<ul>${falta.map((f) => `<li>${esc(f)}${pede[f] && temCat.has(CATS[0][0]) ? " — <span class='muted'>talvez já esteja entre os arquivos</span>" : ""}</li>`).join("")}</ul><button class="linkish small" id="or-pedir">Pedir pelo WhatsApp o que falta</button>` : "Todos os documentos da lista foram marcados como recebidos na ficha.") : `<span class="muted">Escolha o cliente para ver o que falta.</span>`;
    $("or-pedir")?.addEventListener("click", () => { abrirFicha(c.id); $("fi-onb-pedir")?.click(); });
  }
  async function adicionar(files) {
    const ocr = $("or-ocr").checked;
    for (const file of files) {
      const a = { file, texto: "", cat: classificar(file.name, ""), lendo: true }; arquivos.push(a); render();
      try { if (/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name) || (ocr && /^image\//.test(file.type))) a.texto = await LeituraDocs.lerArquivo(file, (p) => ($("or-status").textContent = `Lendo ${file.name}… ${p}%`)); } catch {}
      a.cat = classificar(file.name, a.texto); a.lendo = false; a.nome = ""; render();
    }
    $("or-status").textContent = `${arquivos.length} arquivo(s) organizados. Confira as categorias antes de baixar.`;
  }
  $("or-arquivos").onchange = (e) => { adicionar([...e.target.files]); e.target.value = ""; };
  const zona = $("or-zona");
  zona.ondragover = (e) => { e.preventDefault(); zona.classList.add("sobre"); };
  zona.ondragleave = () => zona.classList.remove("sobre");
  zona.ondrop = (e) => { e.preventDefault(); zona.classList.remove("sobre"); adicionar([...e.dataTransfer.files]); };
  $("or-tab").addEventListener("change", (e) => { const i = +e.target.closest("[data-i]").dataset.i; if (e.target.classList.contains("or-cat")) { arquivos[i].cat = e.target.value; arquivos[i].nome = ""; render(); } if (e.target.classList.contains("or-nome")) arquivos[i].nome = e.target.value; });
  $("or-tab").addEventListener("click", (e) => { if (e.target.dataset.or === "del") { arquivos.splice(+e.target.closest("[data-i]").dataset.i, 1); render(); } });
  $("or-cli").onfocus = () => { const v = $("or-cli").value; $("or-cli").innerHTML = `<option value="">— escolher —</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); $("or-cli").value = v; };
  $("or-cli").onchange = () => { arquivos.forEach((a) => (a.nome = "")); render(); };
  $("or-limpar").onclick = () => { arquivos = []; render(); $("or-status").textContent = ""; };
  $("or-zip").onclick = async () => {
    const c = cliPorId($("or-cli").value), z = new JSZip(), raiz = z.folder(`Documentos - ${c?.nome || "cliente"}`.replace(/[\\/:*?"<>|]/g, ""));
    arquivos.forEach((a, i) => raiz.folder(a.cat).file(a.nome || nomeSugerido(a, i), a.file));
    const blob = await z.generateAsync({ type: "blob" }), l = document.createElement("a");
    l.href = URL.createObjectURL(blob); l.download = `Documentos - ${c?.nome || "cliente"}.zip`; document.body.appendChild(l); l.click(); l.remove();
    if (c) { (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Documentos organizados (${arquivos.length} arquivo(s))` }); salvarCrm(); }
  };
  window.abrirOrganizador = (cliId) => { go("organizador"); $("or-cli").dispatchEvent(new Event("focus")); $("or-cli").value = cliId || ""; render(); };
  $("or-cli").dispatchEvent(new Event("focus")); render();
})();
