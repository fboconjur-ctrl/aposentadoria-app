// Acervo de processos: lista permanente de todos os processos do escritório, montada sozinha
// a partir das publicações (DJEN/Recorte), dos processos cadastrados nos clientes e do DataJud.
// Cada processo pode ser ligado a um cliente e dali sai a mensagem pronta pelo WhatsApp
// (andamento, cobrança, documento, audiência/prazo), registrada no histórico do cliente.
(() => {
  const KEY = "pd-acervo";
  let acervo = ler(KEY, {}); // num(20 dígitos) → { trib, orgao, classe, partes[], pubs[{id,data,tipo,texto}], arquivado, criado }
  const salvar = () => gravar(KEY, acervo);
  const item = (n) => (acervo[n] ||= { pubs: [], partes: [], criado: hojeIso });

  // ---------- Coleta ----------
  function ingerir() {
    let mudou = false;
    for (const p of pubsTodas()) {
      const n = so20(numPub(p)); if (n.length !== 20) continue;
      const a = item(n), id = String(p.id ?? `${n}-${p.data_disponibilizacao}`);
      a.trib ||= p.siglaTribunal || ""; a.orgao ||= p.nomeOrgao || ""; a.classe ||= p.nomeClasse || "";
      (p.destinatarios || []).map((d) => d.nome).filter(Boolean).forEach((x) => a.partes.includes(x) || a.partes.push(x));
      a.polos ||= {}; (p.destinatarios || []).forEach((d) => { if (d.nome && d.polo) a.polos[d.nome] = d.polo; });
      if (!a.pubs.some((x) => x.id === id)) {
        a.pubs.unshift({ id, data: String(p.data_disponibilizacao || p.datadisponibilizacao || "").slice(0, 10), tipo: p.tipoComunicacao || p.tipoDocumento || "Publicação", texto: String(p.texto || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 600) });
        a.pubs.sort((x, y) => y.data.localeCompare(x.data)); a.pubs = a.pubs.slice(0, 15); mudou = true;
      }
    }
    for (const c of clientes) for (const n of procsDe(c)) if (n.length === 20 && !acervo[n]) { item(n); mudou = true; }
    for (const [n, d] of Object.entries(acomp)) if (acervo[n]) { const a = acervo[n]; a.trib ||= d.tribunal || ""; a.orgao ||= d.orgao || ""; a.classe ||= d.classe || ""; }
    // Parte com o mesmo nome de um cliente já cadastrado: liga o processo à ficha dele.
    const porNome = new Map(clientes.map((c) => [semAcento(c.nome).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(), c]));
    let crm = false;
    for (const [n, a] of Object.entries(acervo)) for (const nome of a.partes || []) {
      const c = porNome.get(semAcento(nome).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim());
      if (c && !procsDe(c).includes(n) && !cliDoProc(n)) { c.procs = [String(c.procs || "").trim(), mascara(n)].filter(Boolean).join("\n"); (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Processo ${mascara(n)} ligado automaticamente (nome nas publicações)` }); crm = true; }
    }
    if (crm) salvarCrm();
    if (mudou) salvar();
  }
  const origRender = window.renderPubs;
  window.renderPubs = (...x) => { origRender(...x); ingerir(); if ($("v-acervo").classList.contains("on")) render(); };

  // ---------- Lista ----------
  const ultimaData = (n, a) => { const m = acomp[n]?.movs?.[0]?.data; const p = a.pubs[0]?.data; return [m && String(m).slice(0, 10), p].filter(Boolean).sort().pop() || ""; };
  const temNovidade = (a) => a.pubs.some((p) => !vistas.has(String(p.id)));
  function render() {
    ingerir();
    const busca = semAcento($("ac-busca").value), filtro = $("ac-filtro").value;
    const linhas = Object.entries(acervo).map(([n, a]) => ({ n, a, c: cliDoProc(n), ult: ultimaData(n, a) }))
      .filter(({ a, c }) => filtro === "arquivados" ? a.arquivado : !a.arquivado && (filtro !== "semcli" || !c) && (filtro !== "novos" || temNovidade(a)))
      .filter(({ n, a, c }) => !busca || semAcento([mascara(n), n, a.trib, a.orgao, a.classe, a.partes.join(" "), c?.nome].join(" ")).includes(busca))
      .sort((x, y) => y.ult.localeCompare(x.ult));
    const total = Object.values(acervo).filter((a) => !a.arquivado).length, semCli = Object.entries(acervo).filter(([n, a]) => !a.arquivado && !cliDoProc(n)).length;
    $("ac-resumo").textContent = `${total} processo(s) ativos · ${semCli} sem cliente vinculado · mostrando ${linhas.length}`;
    $("ac-lista").innerHTML = linhas.map(({ n, a, c, ult }) => {
      const nova = temNovidade(a), mov = acomp[n]?.movs?.[0], p0 = a.pubs[0];
      return `<article class="ac-item${nova ? " nova" : ""}" data-n="${n}">
        <div class="ac-topo"><b class="ac-num">${esc(mascara(n))}</b>${a.trib ? `<span class="pill-s">${esc(a.trib)}</span>` : ""}${nova ? `<span class="pill-s amber">novidade</span>` : ""}</div>
        <div class="small muted">${esc([a.classe, a.orgao].filter(Boolean).join(" · ") || "Classe e órgão aparecem após a primeira publicação ou atualização")}</div>
        ${a.partes.length ? `<div class="small">Partes intimadas: ${esc(a.partes.slice(0, 4).join(", "))}</div>` : ""}
        <div class="small">${p0 ? `Última publicação: <b>${brData(p0.data)}</b> — ${esc(p0.tipo)}` : ""}${mov ? `${p0 ? "<br>" : ""}Última movimentação: <b>${fmt(new Date(mov.data))}</b> — ${esc(mov.nome)}` : ""}${!p0 && !mov ? `<span class="muted">Sem andamento carregado — clique em Atualizar.</span>` : ""}</div>
        <div class="ac-cli">${c ? `Cliente: <button class="linkish" data-cli="${c.id}">${esc(c.nome)}</button>` : `<label class="small">Vincular ao cliente <select class="search ac-vinc"><option value="">— escolher —</option>${[...clientes].sort((x, y) => x.nome.localeCompare(y.nome)).map((x) => `<option value="${x.id}">${esc(x.nome)}</option>`).join("")}</select></label> <button class="linkish small" data-ac="novo">ou cadastrar cliente novo</button>`}</div>
        <div class="ac-acoes">
          ${c ? `<button class="wa-btn" data-ac="msg">💬 Mensagem ao cliente</button>` : ""}
          <button class="back" data-ac="prazo">📅 Prazo</button>
          <button class="back" data-ac="ver">${a.pubs.length ? `Publicações (${a.pubs.length})` : "Publicações"}</button>
          <button class="back" data-ac="juris">⚖️ Jurisprudência</button>
          <button class="back" data-ac="atualizar">🔄 Atualizar</button>
          <button class="linkish small" data-ac="arquivar">${a.arquivado ? "desarquivar" : "arquivar"}</button>
        </div>
        <div class="ac-pubs" hidden>${a.pubs.map((p) => `<div class="small"><b>${brData(p.data)}</b> · ${esc(p.tipo)}<br><span class="muted">${esc(p.texto)}</span></div>`).join("") || `<p class="small muted">Nenhuma publicação guardada ainda.</p>`}</div>
      </article>`;
    }).join("") || `<p class="muted">Nenhum processo aqui. Busque em <button class="linkish" data-view="djen">Publicações</button> ou inclua números na ficha dos clientes.</p>`;
  }

  // ---------- Mensagens ao cliente ----------
  const EXPLICA = [
    [/senten/i, "saiu a sentença, que é a decisão do juiz sobre o pedido. Vou analisar com cuidado e te explico o resultado e os próximos passos"],
    [/ac[óo]rd/i, "o tribunal julgou o recurso (acórdão). Vou analisar a decisão e te explico o que muda"],
    [/cita/i, "houve a citação, que é o ato que avisa formalmente a outra parte sobre o processo"],
    [/audi[êe]ncia|pauta/i, "foi marcada uma audiência/sessão. Vou te passar a data, o horário e como se preparar"],
    [/despacho/i, "o juiz deu um despacho, que é uma ordem para o processo andar (por exemplo, pedir uma manifestação ou documento)"],
    [/decis/i, "o juiz tomou uma decisão no processo. Vou analisar e te explico o que significa"],
    [/edital/i, "foi publicado um edital no processo"],
    [/intima/i, "o escritório foi intimado de um novo ato no processo e já está cuidando do que precisa ser feito"],
  ];
  const explicar = (tipo, texto) => (EXPLICA.find(([re]) => re.test(tipo) || re.test(texto || "")) || [, "houve uma nova movimentação no processo e já estou acompanhando"])[1];
  const proxItem = (c) => itens.filter((x) => x.cli === c.id && !x.feita && x.quando >= hojeIso).sort((a, b) => a.quando.localeCompare(b.quando))[0];
  const MODELOS = {
    "Informar andamento": (c, n, a) => { const p = a.pubs[0], m = acomp[n]?.movs?.[0];
      const quando = p ? brData(p.data) : m ? fmt(new Date(m.data)) : "recentemente";
      return `Olá, ${primeiroNome(c.nome)}! Atualização do seu processo nº ${mascara(n)}:\n\nEm ${quando}, ${explicar(p?.tipo || m?.nome || "", p?.texto)}.\n\nNão é preciso fazer nada agora, a menos que eu te avise. Qualquer dúvida, estou à disposição.`; },
    "Cobrar honorários": (c) => { const ab = fin.filter((l) => l.cli === c.id && l.tipo === "receita" && !l.pago).sort((a, b) => a.venc.localeCompare(b.venc));
      const atras = ab.filter((l) => l.venc < hojeIso), tot = (atras.length ? atras : ab.slice(0, 1)).reduce((t, l) => t + l.valor, 0);
      if (!ab.length) return `Olá, ${primeiroNome(c.nome)}! [Não há parcelas em aberto lançadas para este cliente.]`;
      return atras.length ? `Olá, ${primeiroNome(c.nome)}, tudo bem? Consta em aberto ${atras.length > 1 ? `${atras.length} parcelas dos honorários, somando` : "a parcela dos honorários de"} ${reaisBR(tot)} (vencimento ${fmt(deIso(atras[0].venc))}). Pode me confirmar quando consegue fazer o pagamento? Se precisar, conversamos sobre a melhor forma.`
        : `Olá, ${primeiroNome(c.nome)}! Lembrete: a próxima parcela dos honorários (${reaisBR(ab[0].valor)}) vence em ${fmt(deIso(ab[0].venc))}. Qualquer dúvida, estou à disposição.`; },
    "Pedir documento": (c, n) => { const f = window.docsFaltando?.(c) || []; return `Olá, ${primeiroNome(c.nome)}! Para o andamento do processo nº ${mascara(n)}, preciso que você me envie:\n${(f.length ? f : ["[documento]"]).map((d) => "- " + d).join("\n")}\n\nPode mandar foto ou PDF por aqui mesmo. Obrigada!`; },
    "Avisar audiência ou prazo": (c, n) => { const it = proxItem(c); return `Olá, ${primeiroNome(c.nome)}! Aviso importante sobre o processo nº ${mascara(n)}: ${it ? `${it.texto} em ${fmt(deIso(it.quando))}${it.hora ? ` às ${it.hora}` : ""}` : "[o que vai acontecer] em [data]"}.\n\n[O que o cliente precisa fazer ou levar.] Me confirme que recebeu, por favor.`; },
    "Mensagem livre": (c) => `Olá, ${primeiroNome(c.nome)}! `,
  };
  let atual = null;
  function abrirMsg(n) {
    const c = cliDoProc(n); if (!c) return;
    atual = { n, c };
    $("ac-msg-nome").textContent = `${c.nome} · ${mascara(n)}`;
    const temAtraso = fin.some((l) => l.cli === c.id && l.tipo === "receita" && !l.pago && l.venc < hojeIso);
    $("ac-msg-modelo").innerHTML = Object.keys(MODELOS).map((m) => `<option>${m}</option>`).join("");
    $("ac-msg-modelo").value = "Informar andamento";
    $("ac-msg-aviso").textContent = temAtraso ? "⚠️ Este cliente tem honorários em atraso." : "";
    preencher(); $("ac-msg").hidden = false; $("ac-msg").scrollIntoView({ behavior: "smooth", block: "center" });
    $("ac-msg-semtel").hidden = !!telWa(c.tel);
  }
  const preencher = () => ($("ac-msg-texto").value = MODELOS[$("ac-msg-modelo").value](atual.c, atual.n, acervo[atual.n]));
  $("ac-msg-modelo").onchange = preencher;
  $("ac-msg-fechar").onclick = () => ($("ac-msg").hidden = true);
  $("ac-msg-enviar").onclick = () => {
    const { c, n } = atual; if (!telWa(c.tel)) { $("ac-msg-semtel").hidden = false; return; }
    window.open(`https://wa.me/${telWa(c.tel)}?text=${encodeURIComponent($("ac-msg-texto").value)}`, "_blank", "noopener");
    (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `WhatsApp (${mascara(n)}): ${$("ac-msg-modelo").value}` }); salvarCrm();
    acervo[n].pubs.forEach((p) => vistas.add(String(p.id))); gravar(VISTAS_KEY, [...vistas]);
    $("ac-msg").hidden = true; render();
  };

  window.Acervo = { dados: () => (ingerir(), acervo), abrirMsg: (n, modelo) => { go("acervo"); abrirMsg(n); if (modelo) { $("ac-msg-modelo").value = modelo; preencher(); } } };
  // ---------- Ações ----------
  $("ac-lista").addEventListener("change", (e) => {
    if (!e.target.classList.contains("ac-vinc") || !e.target.value) return;
    const n = e.target.closest("[data-n]").dataset.n, c = cliPorId(e.target.value);
    c.procs = [String(c.procs || "").trim(), mascara(n)].filter(Boolean).join("\n");
    (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Processo ${mascara(n)} vinculado` }); salvarCrm(); render();
  });
  $("ac-lista").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ac]"); if (!b) return;
    const art = b.closest("[data-n]"), n = art.dataset.n, a = acervo[n];
    if (b.dataset.ac === "msg") abrirMsg(n);
    if (b.dataset.ac === "ver") { art.querySelector(".ac-pubs").hidden = !art.querySelector(".ac-pubs").hidden; a.pubs.forEach((p) => vistas.add(String(p.id))); gravar(VISTAS_KEY, [...vistas]); art.classList.remove("nova"); }
    if (b.dataset.ac === "prazo") { const c = cliDoProc(n); go("prazos"); $("pz-caso").dispatchEvent(new Event("focus")); $("pz-caso").value = c?.id || ""; if (a.pubs[0]) { $("pz-data").value = a.pubs[0].data; $("pz-tipo").value = "disponibilizacao"; } $("pz-prov").focus(); }
    if (b.dataset.ac === "atualizar") { b.textContent = "Atualizando…"; Promise.resolve(atualizarAcomp([n])).finally(() => { ingerir(); render(); }); }
    if (b.dataset.ac === "juris") window.pesquisarJurDoProcesso?.(n);
    if (b.dataset.ac === "arquivar") { a.arquivado = !a.arquivado; salvar(); render(); }
    if (b.dataset.ac === "novo") { abrirForm(null); $("c-procs").value = mascara(n); }
  });
  // Carga inicial: busca tudo o que o DJEN tem na OAB (últimos 3 anos) uma única vez; depois as buscas normais mantêm atualizado.
  const CARGA_KEY = "pd-acervo-carga";
  const mostrarCarga = () => { const feita = ler(CARGA_KEY, null); $("ac-carga").hidden = !!feita; $("ac-carga-ok").textContent = feita ? `Carga completa feita em ${fmt(new Date(feita.em))} (${feita.n} processos).` : ""; };
  const PAUSA_KEY = "pd-acervo-carga-pausa";
  let rodando = false;
  async function carga({ auto } = {}) {
    if (rodando) return; rodando = true; window.pararDjen = false;
    const b = $("ac-carga-btn"); b.disabled = true; b.textContent = auto ? "Continuando sozinho…" : "Buscando… pode levar alguns minutos";
    $("ac-carga-parar").hidden = false;
    window.aoProgressoDjen = (f) => ($("ac-carga-prog").textContent = `${Math.min(99, Math.round(f * 100))}%`);
    try {
      const feitas = new Set(ler("pd-acervo-carga-ok", []));
      const r = await buscarDjen({ dias: 3 * 365, soOab: true, feitas });
      r.okJanelas.forEach((k) => feitas.add(k)); gravar("pd-acervo-carga-ok", [...feitas]);
      const faltam = r.totalJanelas - feitas.size;
      if (window.pararDjen) $("ac-carga-prog").textContent = `Parado com ${Math.round((feitas.size / r.totalJanelas) * 100)}% do histórico. Clique no botão azul quando quiser continuar.`;
      else if (faltam > 0) $("ac-carga-prog").textContent = `Já veio ${Math.round((feitas.size / r.totalJanelas) * 100)}% do histórico. O DJEN limitou as consultas; com o painel aberto, continuo sozinho a cada hora até completar.`;
      else { gravar(CARGA_KEY, { em: new Date().toISOString(), n: Object.keys(acervo).length }); $("ac-carga-prog").textContent = ""; }
    } catch (e) { $("ac-carga-prog").textContent = "Erro: " + e.message + " — tento de novo daqui a uma hora."; }
    finally { rodando = false; window.aoProgressoDjen = null; b.disabled = false; b.textContent = "📥 Trazer todos os processos da minha OAB"; $("ac-carga-parar").hidden = true; mostrarCarga(); render(); }
  }
  $("ac-carga-btn").onclick = () => { gravar(PAUSA_KEY, false); carga(); };
  $("ac-carga-parar").onclick = () => { gravar(PAUSA_KEY, true); window.pararDjen = true; $("ac-carga-prog").textContent = "Busca automática parada. Clique no botão azul quando quiser retomar."; };
  // Continua sozinho: ao abrir o painel e a cada hora, enquanto houver parte do histórico faltando e não estiver pausado.
  const pendente = () => !ler(CARGA_KEY, null) && ler("pd-acervo-carga-ok", []).length > 0 && !ler(PAUSA_KEY, false);
  setTimeout(() => pendente() && carga({ auto: true }), 20000);
  setInterval(() => pendente() && carga({ auto: true }), 3600e3);
  mostrarCarga();
  $("ac-busca").oninput = render; $("ac-filtro").onchange = render;
  $("ac-csv").onclick = () => {
    const linhas = [["Processo", "Tribunal", "Classe", "Órgão", "Cliente", "Última publicação", "Tipo", "Arquivado"], ...Object.entries(acervo).map(([n, a]) => [mascara(n), a.trib, a.classe, a.orgao, cliDoProc(n)?.nome || "", a.pubs[0]?.data || "", a.pubs[0]?.tipo || "", a.arquivado ? "sim" : ""])];
    const csv = "﻿" + linhas.map((r) => r.map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
    const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); l.download = "acervo-processos.csv"; document.body.appendChild(l); l.click(); l.remove();
  };
  const origGo = window.go;
  window.go = (v, o) => { origGo(v, o); if (v === "acervo") render(); };
  // ---------- Clientes encontrados nos processos (sugestões para confirmar) ----------
  const IGN_KEY = "pd-partes-ignoradas";
  let ignoradas = new Set(ler(IGN_KEY, []));
  const chaveNome = (x) => semAcento(x).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const ehOrgao = (x) => /\b(uniao|instituto nacional|inss|estado|municipio|distrito federal|fazenda|ministerio publico|defensoria|banco|caixa economica|s\.?\/?a\b|ltda|me\b|eireli|seguro|saude|fundacao|autarquia|conselho|universidade|tribunal|procuradoria)\b/i.test(semAcento(x));
  function sugestoes() {
    const jaCli = new Set(clientes.map((c) => chaveNome(c.nome)));
    const m = new Map();
    for (const [n, a] of Object.entries(acervo)) for (const nome of a.partes || []) {
      const k = chaveNome(nome); if (!k || k.length < 5 || jaCli.has(k) || ignoradas.has(k)) continue;
      const s = m.get(k) || { nome: nomeProprio(nome), procs: [], polo: a.polos?.[nome] || "", orgao: ehOrgao(nome) };
      if (!s.procs.includes(n)) s.procs.push(n); m.set(k, s);
    }
    return [...m.entries()].sort((x, y) => x[1].orgao - y[1].orgao || y[1].procs.length - x[1].procs.length || x[1].nome.localeCompare(y[1].nome));
  }
  const POLO = { A: "polo ativo", P: "polo passivo" };
  function renderSug() {
    const box = $("cli-sug"); if (!box) return;
    const lista = sugestoes(); box.hidden = !lista.length && !ignoradas.size;
    $("cli-sug-desc").innerHTML = ignoradas.size ? `<details><summary class="small">Nomes que você marcou como “não é cliente” (${ignoradas.size}) — clique para desfazer</summary><ul class="list small">${[...ignoradas].map((k) => `<li>${esc(nomeProprio(k))} <button class="linkish small" data-sug="volta" data-k2="${esc(k)}">desfazer</button></li>`).join("")}</ul></details>` : "";
    $("cli-sug-n").textContent = `${lista.length} nome(s)`;
    $("cli-sug-lista").innerHTML = lista.map(([k, s]) => `<li data-k="${esc(k)}"><label style="display:flex;gap:10px;align-items:flex-start;flex:1"><input type="checkbox" class="cli-sug-ck"${s.orgao ? "" : " checked"}>
      <span><b>${esc(s.nome)}</b>${s.orgao ? ` <span class="pill-s">órgão/empresa</span>` : ""}<br><span class="small muted">${s.procs.map((n) => esc(mascara(n))).join(" · ")}${s.polo ? ` · ${POLO[s.polo] || s.polo}` : ""}</span></span></label>
      <button class="linkish small" data-sug="ign">não é cliente</button></li>`).join("");
  }
  $("cli-sug")?.addEventListener("click", (e) => {
    const v = e.target.closest("[data-sug=volta]"); if (v) { ignoradas.delete(v.dataset.k2); gravar(IGN_KEY, [...ignoradas]); renderSug(); return; }
    const b = e.target.closest("[data-sug=ign]"); if (!b) return;
    ignoradas.add(b.closest("[data-k]").dataset.k); gravar(IGN_KEY, [...ignoradas]); renderSug();
  });
  $("cli-sug-add")?.addEventListener("click", () => {
    const mapa = new Map(sugestoes()); let n = 0;
    document.querySelectorAll("#cli-sug-lista li").forEach((li) => {
      const s = mapa.get(li.dataset.k);
      if (li.querySelector(".cli-sug-ck").checked && s) { clientes.push({ id: novoId("CL-"), criado: new Date().toISOString(), nome: s.nome, cpf: "", tel: "", email: "", area: "", origem: "Processos (DJEN)", etapa: "Caso ativo", procs: s.procs.map(mascara).join("\n"), hist: [{ em: new Date().toISOString(), o: "Cadastrado a partir das publicações do DJEN" }] }); n++; }
      else if (s) { ignoradas.add(li.dataset.k); }
    });
    gravar(IGN_KEY, [...ignoradas]); salvarCrm(); renderClientes(); renderSug();
    $("cli-sug-msg").textContent = n ? `${n} cliente(s) cadastrados. Complete o WhatsApp e o CPF na ficha de cada um.` : "";
  });
  $("cli-sug-todos")?.addEventListener("click", () => { const marcar = [...document.querySelectorAll(".cli-sug-ck")].some((c) => !c.checked); document.querySelectorAll(".cli-sug-ck").forEach((c) => (c.checked = marcar)); });
  const origRC = window.renderClientes;
  window.renderClientes = (...x) => { origRC(...x); renderSug(); };
  ingerir();
})();
