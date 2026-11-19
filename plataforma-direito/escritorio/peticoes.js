// Redator de petições a partir do SEU banco de modelos e do SEU banco de jurisprudência.
// Nada é inventado: o texto final usa só o modelo escolhido, os dados do cliente e os julgados que você cadastrou
// (e conferiu). O que faltar fica marcado como [PREENCHER: …].
(() => {
  const MOD_KEY = "pd-modelos-peticao", JUR_KEY = "pd-jurisprudencia";
  let modelos = ler(MOD_KEY, []), juris = ler(JUR_KEY, []);
  const salvarM = () => gravar(MOD_KEY, modelos), salvarJ = () => gravar(JUR_KEY, juris);
  const FIXOS = { CLIENTE: "nome do cliente", CPF: "CPF/CNPJ", EMAIL: "e-mail", TELEFONE: "telefone", PROCESSO: "número do processo", ADVOGADA: "seu nome", OAB: "sua OAB", CIDADE_DATA: "cidade e data", JURISPRUDENCIA: "julgados escolhidos" };
  const marcadores = (t) => [...new Set([...String(t).matchAll(/\{\{\s*([A-Z0-9_ÁÉÍÓÚÂÊÔÃÕÇ]+)\s*\}\}/gi)].map((m) => m[1].toUpperCase()))];

  // ---------- Banco de modelos ----------
  function renderModelos() {
    $("pe-mod-lista").innerHTML = modelos.map((m, i) => `<li><div class="t-txt"><b>${esc(m.titulo)}</b> <span class="small muted">${esc(m.area || "")}</span><br><span class="small muted">${marcadores(m.corpo).map((x) => `{{${x}}}`).join(" ") || "sem marcadores"}</span></div><button class="linkish small" data-pm="edit" data-i="${i}">editar</button><button class="linkish small" data-pm="del" data-i="${i}" style="color:#b42318">excluir</button></li>`).join("") || `<li class="muted">Nenhum modelo ainda. Cadastre abaixo as suas petições-modelo.</li>`;
    $("pe-modelo").innerHTML = `<option value="">— escolher modelo —</option>` + modelos.map((m, i) => `<option value="${i}">${esc(m.titulo)}</option>`).join("");
  }
  let editM = null;
  $("pe-mod-form").onsubmit = (e) => {
    e.preventDefault();
    const m = { titulo: $("pe-mod-tit").value.trim(), area: $("pe-mod-area").value.trim(), corpo: $("pe-mod-corpo").value };
    if (!m.titulo || !m.corpo.trim()) return;
    if (editM != null) modelos[editM] = m; else modelos.push(m);
    editM = null; $("pe-mod-form").reset(); $("pe-mod-salvar").textContent = "Salvar modelo"; salvarM(); renderModelos();
  };
  $("pe-mod-lista").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pm]"); if (!b) return; const i = +b.dataset.i;
    if (b.dataset.pm === "del" && confirm(`Excluir o modelo "${modelos[i].titulo}"?`)) { modelos.splice(i, 1); salvarM(); renderModelos(); }
    if (b.dataset.pm === "edit") { editM = i; $("pe-mod-tit").value = modelos[i].titulo; $("pe-mod-area").value = modelos[i].area || ""; $("pe-mod-corpo").value = modelos[i].corpo; $("pe-mod-salvar").textContent = "Salvar alterações"; $("pe-banco").open = true; $("pe-mod-tit").focus(); }
  });
  $("pe-mod-arq").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; $("pe-mod-corpo").value = /\.docx$/i.test(f.name) ? await textoDocx(f) : await f.text(); if (!$("pe-mod-tit").value) $("pe-mod-tit").value = f.name.replace(/\.[^.]+$/, ""); e.target.value = ""; };
  async function textoDocx(f) { // extrai os parágrafos do Word (.docx) com o JSZip já carregado no painel
    const z = await JSZip.loadAsync(f), xml = await z.file("word/document.xml").async("string");
    return xml.split(/<\/w:p>/).map((p) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("")).join("\n").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\n{3,}/g, "\n\n").trim();
  }

  // ---------- Banco de jurisprudência ----------
  function renderJuris() {
    const q = semAcento($("pe-jur-busca").value);
    const lista = juris.map((j, i) => ({ j, i })).filter(({ j }) => !q || semAcento([j.trib, j.num, j.tema, j.ementa].join(" ")).includes(q));
    $("pe-jur-lista").innerHTML = lista.map(({ j, i }) => `<li><label style="display:flex;gap:10px;align-items:flex-start;flex:1"><input type="checkbox" class="pe-jur-ck" data-i="${i}">
      <span><b>${esc(j.trib)} — ${esc(j.num)}</b>${j.tema ? ` <span class="pill-s">${esc(j.tema)}</span>` : ""}${j.conf ? ` <span class="pill-s green">conferido ${esc(brData(j.conf))}</span>` : ` <span class="pill-s amber">não conferido</span>`}<br><span class="small muted">${esc(j.ementa.slice(0, 260))}${j.ementa.length > 260 ? "…" : ""}</span></span></label>
      <button class="linkish small" data-pj="del" data-i="${i}" style="color:#b42318">excluir</button></li>`).join("") || `<li class="muted">${juris.length ? "Nada encontrado." : "Seu banco está vazio. Cadastre os julgados que você já leu e conferiu."}</li>`;
  }
  $("pe-jur-form").onsubmit = (e) => {
    e.preventDefault();
    juris.push({ trib: $("pe-jur-trib").value.trim(), num: $("pe-jur-num").value.trim(), rel: $("pe-jur-rel").value.trim(), data: $("pe-jur-data").value, tema: $("pe-jur-tema").value.trim(), ementa: $("pe-jur-ementa").value.trim(), link: $("pe-jur-link").value.trim(), conf: $("pe-jur-conf").checked ? hojeIso : "" });
    $("pe-jur-form").reset(); salvarJ(); renderJuris();
  };
  $("pe-jur-busca").oninput = renderJuris;
  $("pe-jur-lista").addEventListener("click", (e) => { const b = e.target.closest("[data-pj=del]"); if (b && confirm("Excluir este julgado do banco?")) { juris.splice(+b.dataset.i, 1); salvarJ(); renderJuris(); } });

  // ---------- Montar a petição ----------
  const citacao = (j) => `<p class="cit">“${esc(j.ementa)}” (${esc(j.trib)}, ${esc(j.num)}${j.rel ? `, Rel. ${esc(j.rel)}` : ""}${j.data ? `, julgado em ${esc(brData(j.data))}` : ""})${j.link ? `.<br><small>${esc(j.link)}</small>` : "."}</p>`;
  function camposExtras() {
    const m = modelos[$("pe-modelo").value]; if (!m) { $("pe-campos").innerHTML = ""; return; }
    const extras = marcadores(m.corpo).filter((x) => !FIXOS[x]);
    $("pe-campos").innerHTML = extras.map((x) => `<label>${esc(x.replace(/_/g, " ").toLowerCase())}<input class="search pe-extra" data-k="${x}"></label>`).join("") || `<p class="small muted">Este modelo só usa os dados automáticos.</p>`;
  }
  function montar() {
    const m = modelos[$("pe-modelo").value]; if (!m) { $("pe-status").textContent = "Escolha um modelo."; return null; }
    const c = cliPorId($("pe-cli").value), a = window.DocGerador?.adv() || {};
    const escolhidos = [...document.querySelectorAll(".pe-jur-ck:checked")].map((x) => juris[+x.dataset.i]);
    const v = { CLIENTE: c?.nome, CPF: c?.cpf, EMAIL: c?.email, TELEFONE: c?.tel, PROCESSO: $("pe-proc").value, ADVOGADA: a.nome, OAB: a.oab, CIDADE_DATA: `${a.cidade || "Brasília/DF"}, ${new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}` };
    document.querySelectorAll(".pe-extra").forEach((i) => (v[i.dataset.k] = i.value.trim()));
    const faltam = [];
    let html = esc(m.corpo).replace(/\{\{\s*([A-Z0-9_ÁÉÍÓÚÂÊÔÃÕÇ]+)\s*\}\}/gi, (_, k) => {
      k = k.toUpperCase();
      if (k === "JURISPRUDENCIA") return escolhidos.length ? `@@JUR@@` : (faltam.push("jurisprudência"), `[PREENCHER: jurisprudência]`);
      if (v[k]) return esc(v[k]);
      faltam.push(k.toLowerCase().replace(/_/g, " ")); return `<mark>[PREENCHER: ${esc(k.toLowerCase().replace(/_/g, " "))}]</mark>`;
    });
    html = html.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("").replace(/<p>@@JUR@@<\/p>|@@JUR@@/g, escolhidos.map(citacao).join(""));
    if (escolhidos.length && !/\{\{\s*JURISPRUDENCIA\s*\}\}/i.test(m.corpo)) html += escolhidos.map(citacao).join("");
    const naoConf = escolhidos.filter((j) => !j.conf).length;
    $("pe-status").innerHTML = [faltam.length ? `⚠️ Falta preencher: ${[...new Set(faltam)].map(esc).join(", ")}.` : "✅ Todos os campos preenchidos.", naoConf ? ` ⚠️ ${naoConf} julgado(s) ainda sem conferência.` : ""].join("");
    return { html, titulo: `${m.titulo} - ${c?.nome || "cliente"}`.replace(/[\\/:*?"<>|]/g, ""), c };
  }
  $("pe-modelo").onchange = () => { camposExtras(); $("pe-prev").hidden = true; };
  $("pe-cli").onfocus = () => { const val = $("pe-cli").value; $("pe-cli").innerHTML = `<option value="">— escolher —</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); $("pe-cli").value = val; };
  $("pe-cli").onchange = () => { const c = cliPorId($("pe-cli").value); $("pe-proc").innerHTML = (c ? procsDe(c) : []).map((n) => `<option>${mascara(n)}</option>`).join("") + `<option value="">— sem processo —</option>`; };
  $("pe-montar").onclick = () => { const r = montar(); if (!r) return; $("pe-folha").innerHTML = r.html; $("pe-prev").hidden = false; };
  const docHtml = (corpo) => `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>body{font:12pt/1.5 "Times New Roman",serif}p{text-align:justify;text-indent:2cm}.cit{margin-left:4cm;text-indent:0;font-size:11pt;line-height:1.2}mark{background:#ff0}</style></head><body>${corpo}</body></html>`;
  $("pe-word").onclick = () => {
    const r = montar(); if (!r) return;
    const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob(["﻿" + docHtml(r.html)], { type: "application/msword" })); l.download = `${r.titulo}.doc`; document.body.appendChild(l); l.click(); l.remove();
    if (r.c) { (r.c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Petição gerada: ${r.titulo}` }); salvarCrm(); }
  };
  renderModelos(); renderJuris(); $("pe-cli").dispatchEvent(new Event("focus"));
})();
