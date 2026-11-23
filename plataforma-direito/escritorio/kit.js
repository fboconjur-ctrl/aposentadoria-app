// Kit de protocolo: junta a peça e os documentos numerados (Doc 01, Doc 02…) numa pasta pronta para o PJe,
// com checklist. Tudo no navegador. Baixe o .zip e arraste para o Google Drive (ou salve na pasta do Drive no computador).
(() => {
  const V = document.getElementById("v-kit"); if (!V) return;
  const $q = (s) => V.querySelector(s);
  const limpaNome = (t) => String(t).replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim();
  const extDe = (n) => (String(n).match(/\.[a-z0-9]+$/i) || [""])[0].toLowerCase();
  const MB = (b) => (b / 1048576).toFixed(1).replace(".", ",") + " MB";
  const PJE = { "8.15": ["TJPB", "https://pje.tjpb.jus.br/pje/login.seam"], "8.07": ["TJDFT", "https://pje.tjdft.jus.br/pje/login.seam"], "4.01": ["TRF1", "https://pje1g.trf1.jus.br/pje/login.seam"], "4.05": ["TRF5", "https://pje.trf5.jus.br/pje/login.seam"], "5.13": ["TRT13", "https://pje.trt13.jus.br/primeirograu/login.seam"], "5.10": ["TRT10", "https://pje.trt10.jus.br/primeirograu/login.seam"] };
  let peca = null, docs = []; // docs: { file, nome, cat }

  function tribunal(n) { const m = String(n).replace(/\D/g, "").match(/^\d{7}\d{2}\d{4}(\d)(\d{2})\d{4}$/); return m ? PJE[`${m[1]}.${m[2]}`] : null; }
  function render() {
    const cli = cliPorId($q("#kt-cli").value);
    $q("#kt-proc").innerHTML = `<option value="">— sem processo (petição inicial) —</option>` + (cli ? procsDe(cli).map((n) => `<option value="${n}">${esc(mascara(n))}</option>`).join("") : "");
    $q("#kt-dp").hidden = !(cli?.docsPedido?.length && window.DocsPedido);
    lista();
  }
  function lista() {
    $q("#kt-peca-info").textContent = peca ? `${peca.name} · ${MB(peca.size)}${extDe(peca.name) !== ".pdf" ? " · ⚠️ o PJe só aceita PDF: salve a peça como PDF antes de protocolar" : ""}` : "Nenhuma peça escolhida.";
    $q("#kt-docs").innerHTML = docs.map((d, i) => {
      const av = [extDe(d.file.name) !== ".pdf" ? "não é PDF" : "", d.file.size > 5 * 1048576 ? "acima de 5 MB (confira o limite do tribunal)" : ""].filter(Boolean).join(" · ");
      return `<li><span class="pd-cont">${String(i + 1).padStart(2, "0")}</span><div style="flex:1"><input class="search small" data-kt-nome="${i}" value="${esc(d.nome)}" style="width:100%;box-sizing:border-box"><br><span class="small muted">${esc(d.cat.replace(/^\d+ /, ""))} · ${MB(d.file.size)}</span>${av ? ` <span class="small atrasada">⚠️ ${av}</span>` : ""}</div>
        <button class="linkish small" data-kt-sobe="${i}" title="Subir">↑</button><button class="del" data-kt-tira="${i}" aria-label="Tirar">×</button></li>`;
    }).join("") || `<li class="muted small">Nenhum documento ainda.</li>`;
  }
  const rotulo = (f, texto) => { const cat = window.Organizador?.classificar(f.name, texto || "") || "09 Outros"; return { cat, nome: (window.Organizador?.nomeSugerido(f, texto || "", cat, 0, "") || f.name).replace(/\.[^.]+$/, "").replace(/^\d+\s*-\s*/, "") }; };
  async function adicionar(files) {
    for (const f of files) {
      const d = { file: f, ...rotulo(f, "") }; docs.push(d); lista();
      try { const t = await LeituraDocs.lerArquivo(f); Object.assign(d, rotulo(f, t)); } catch {}
      docs.sort((a, b) => a.cat.localeCompare(b.cat)); lista();
    }
  }
  $q("#kt-cli").addEventListener("focus", () => { const s = $q("#kt-cli"), v = s.value; s.innerHTML = `<option value="">— escolha o cliente —</option>` + clientes.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); s.value = v; });
  $q("#kt-cli").addEventListener("change", render);
  $q("#kt-peca").addEventListener("change", (e) => { peca = e.target.files[0] || null; e.target.value = ""; lista(); });
  $q("#kt-arq").addEventListener("change", (e) => { adicionar([...e.target.files]); e.target.value = ""; });
  $q("#kt-dp").addEventListener("click", async () => {
    const c = cliPorId($q("#kt-cli").value); if (!c) return; $q("#kt-st").textContent = "Baixando os documentos enviados pelo cliente…";
    for (const d of c.docsPedido || []) { try { const b = await DocsPedido.baixar(d.caminho); await adicionar([new File([b], d.nome, { type: b.type })]); } catch {} }
    $q("#kt-st").textContent = "";
  });
  V.addEventListener("input", (e) => { const i = e.target.dataset.ktNome; if (i !== undefined) docs[+i].nome = e.target.value; });
  V.addEventListener("click", (e) => {
    const t = e.target.closest("[data-kt-tira]"); if (t) { docs.splice(+t.dataset.ktTira, 1); lista(); }
    const s = e.target.closest("[data-kt-sobe]"); if (s) { const i = +s.dataset.ktSobe; if (i > 0) { [docs[i - 1], docs[i]] = [docs[i], docs[i - 1]]; } lista(); }
  });
  function montar() {
    const c = cliPorId($q("#kt-cli").value), n = $q("#kt-proc").value, st = $q("#kt-st");
    if (!c) { st.textContent = "Escolha o cliente."; return null; }
    if (!peca && !docs.length) { st.textContent = "Escolha a peça e/ou os documentos."; return null; }
    const tipo = $q("#kt-tipo").value || "Protocolo";
    const pasta = limpaNome(`${n ? mascara(n) + " - " : ""}${tipo} - ${fmt(hoje).replace(/\//g, "-")}`);
    const arqs = [];
    if (peca) arqs.push({ pasta: ["01 Peça"], nome: limpaNome(`${$q("#kt-tipo").value || "Peça"} - ${c.nome}${extDe(peca.name)}`), blob: peca });
    docs.forEach((d, i) => arqs.push({ pasta: ["02 Documentos"], nome: limpaNome(`Doc ${String(i + 1).padStart(2, "0")} - ${d.nome}${extDe(d.file.name)}`), blob: d.file }));
    const tr = n ? tribunal(n) : null;
    const ck = [`KIT DE PROTOCOLO — ${c.nome}`, n ? `Processo: ${mascara(n)}${tr ? ` (${tr[0]})` : ""}` : "Petição inicial (processo ainda não distribuído)", `Peça: ${$q("#kt-tipo").value || "—"}`, `Montado em: ${new Date().toLocaleString("pt-BR")}`, "",
      "CONFERIR ANTES DE PROTOCOLAR", "[ ] Peça revisada, sem [PREENCHER] nem [CONFERIR]", "[ ] Peça salva em PDF (o PJe só aceita PDF)", "[ ] Procuração e documentos pessoais legíveis", "[ ] Cada arquivo dentro do limite de tamanho do tribunal", "[ ] Custas recolhidas ou pedido de gratuidade com declaração", "[ ] Prazo conferido (data final)", "[ ] Após protocolar: anotar o número/recibo no painel", "",
      "ORDEM DOS DOCUMENTOS", ...docs.map((d, i) => `Doc ${String(i + 1).padStart(2, "0")} - ${d.nome}`), "", tr ? `PJe do ${tr[0]}: ${tr[1]}` : "Acesse o PJe do tribunal com seu certificado digital."].join("\r\n");
    arqs.push({ pasta: [], nome: "03 Checklist do protocolo.txt", blob: new Blob([ck], { type: "text/plain" }) });
    return { c, pasta, arqs, tr, cliPasta: limpaNome(c.nome) };
  }
  const pje = (tr) => (tr ? ` <a href="${tr[1]}" target="_blank" rel="noopener">Abrir o PJe do ${tr[0]}</a>` : "");
  $q("#kt-gerar").addEventListener("click", async () => {
    const m = montar(); if (!m) return;
    const nomeZip = `${m.cliPasta} - ${m.pasta}`, z = new JSZip(), raiz = z.folder(nomeZip);
    m.arqs.forEach((a) => (a.pasta.length ? raiz.folder(a.pasta.join("/")) : raiz).file(a.nome, a.blob));
    const blob = await z.generateAsync({ type: "blob" }), l = document.createElement("a");
    l.href = URL.createObjectURL(blob); l.download = nomeZip + ".zip"; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(l.href), 5000);
    (m.c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Kit de protocolo montado (${docs.length} documento(s))` }); salvarCrm();
    $q("#kt-st").innerHTML = `✅ Kit baixado: <b>${esc(nomeZip)}.zip</b>.${pje(m.tr)}`;
  });
  $q("#kt-drive").hidden = !window.Drive;
  $q("#kt-drive").addEventListener("click", async () => {
    const m = montar(); if (!m) return; const st = $q("#kt-st");
    st.textContent = "Pedindo permissão ao Google…";
    try {
      const link = await Drive.salvar(["Escritório", "Clientes", m.cliPasta, m.pasta], m.arqs, (i, t) => (st.textContent = `Enviando ao Drive… ${i} de ${t}`));
      (m.c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Kit de protocolo salvo no Drive (${docs.length} documento(s))` }); m.c.drive = link; salvarCrm();
      st.innerHTML = `✅ Salvo no Drive em <b>Escritório › Clientes › ${esc(m.cliPasta)} › ${esc(m.pasta)}</b>. <a href="${esc(link)}" target="_blank" rel="noopener">Abrir a pasta</a>${pje(m.tr)}`;
    } catch (er) { st.textContent = "Não foi possível salvar no Drive: " + er.message; }
  });
  window.KitProtocolo = { tribunal };
  lista();
})();
