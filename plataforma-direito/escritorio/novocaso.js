// Novo caso: um lugar só para cadastrar o cliente, contar o caso e jogar os documentos.
// O painel lê os documentos no navegador, tira os dados pessoais (CPF, RG, endereço…), separa por tipo,
// cria ou atualiza a ficha, confere conflito de interesses, marca os documentos recebidos e sugere peça e modelo.
(() => {
  let docs = []; // { file, texto, cat, dados }
  const AREAS = ["Previdenciário", "Consumidor", "Saúde", "Administrativo", "Cartório/Extrajudicial", "Trabalhista", "Empresas", "Outra"];
  $("nc-area").innerHTML = AREAS.map((a) => `<option>${a}</option>`).join("");
  $("nc-cli").onfocus = () => { const v = $("nc-cli").value; $("nc-cli").innerHTML = `<option value="">➕ Cliente novo</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); $("nc-cli").value = v; };
  $("nc-cli").onchange = () => { const c = cliPorId($("nc-cli").value); $("nc-novo").hidden = !!c; if (c) { $("nc-area").value = c.area || "Outra"; $("nc-contra").value = c.contra || ""; } };

  // Junta o que os documentos revelaram (o primeiro valor encontrado vale).
  const dadosLidos = () => docs.reduce((o, d) => { for (const [k, v] of Object.entries(d.dados || {})) if (v && !o[k]) o[k] = v; return o; }, {});
  function render() {
    $("nc-docs").innerHTML = docs.map((d, i) => `<li><span class="ico">${d.lendo ? "⏳" : "📄"}</span><div class="t-txt">${esc(d.file.name)}<br><span class="small muted">${esc(d.cat)}${d.dados && Object.keys(d.dados).length ? " · dados lidos: " + esc(Object.keys(d.dados).join(", ")) : ""}</span></div><button class="linkish small" data-nc-del="${i}">remover</button></li>`).join("");
    const L = dadosLidos();
    $("nc-lidos").innerHTML = Object.keys(L).length ? `<b>Encontrado nos documentos:</b> ${[["nome", "Nome"], ["cpf", "CPF"], ["rg", "RG"], ["orgao", "Órgão"], ["nascimento", "Nascimento"], ["naturalidade", "Naturalidade"], ["endereco", "Endereço"]].filter(([k]) => L[k]).map(([k, t]) => `${t}: <b>${esc(L[k])}</b>`).join(" · ")}` : "";
    if (L.nome && !$("nc-nome").value && !$("nc-cli").value) $("nc-nome").value = nomeProprio(L.nome);
    if (L.cpf && !$("nc-cpf").value && !$("nc-cli").value) $("nc-cpf").value = L.cpf;
  }
  async function adicionar(files) {
    for (const file of files) {
      const d = { file, texto: "", cat: "lendo…", lendo: true }; docs.push(d); render();
      try { d.texto = await LeituraDocs.lerArquivo(file, (p) => ($("nc-status").textContent = `Lendo ${file.name}… ${p}%`)); } catch {}
      d.cat = window.Organizador?.classificar(file.name, d.texto) || "09 Outros";
      d.dados = /^0[12] /.test(d.cat) ? Object.fromEntries(Object.entries(LeituraDocs.extrair(d.texto)).filter(([, v]) => v)) : {};
      d.lendo = false; render();
    }
    $("nc-status").textContent = `${docs.length} documento(s) lido(s) no seu computador.`;
  }
  $("nc-arq").onchange = (e) => { adicionar([...e.target.files]); e.target.value = ""; };
  const zona = $("nc-zona");
  zona.ondragover = (e) => { e.preventDefault(); zona.classList.add("sobre"); };
  zona.ondragleave = () => zona.classList.remove("sobre");
  zona.ondrop = (e) => { e.preventDefault(); zona.classList.remove("sobre"); adicionar([...e.dataTransfer.files]); };
  $("nc-docs").addEventListener("click", (e) => { const b = e.target.closest("[data-nc-del]"); if (b) { docs.splice(+b.dataset.ncDel, 1); render(); } });

  // Sugestão de modelo: mesma área e mais palavras em comum entre o título do modelo e o relato.
  function modeloSugerido(c) {
    const mods = ler("pd-modelos-peticao", []); if (!mods.length) return -1;
    const rel = new Set(semAcento(c.relato || "").split(/\W+/).filter((w) => w.length > 4));
    let melhor = -1, nota = 0;
    mods.forEach((m, i) => { let n = semAcento(m.area || "") && semAcento(c.area || "").startsWith(semAcento(m.area).slice(0, 5)) ? 3 : 0; semAcento(m.titulo).split(/\W+/).forEach((w) => w.length > 4 && rel.has(w) && n++); if (n > nota) { nota = n; melhor = i; } });
    return melhor;
  }

  $("nc-criar").onclick = () => {
    const relato = $("nc-relato").value.trim();
    let c = cliPorId($("nc-cli").value);
    const nome = c?.nome || $("nc-nome").value.trim();
    if (!nome) { $("nc-msg").textContent = "Informe o nome do cliente (ou escolha um já cadastrado)."; $("nc-nome").focus(); return; }
    const cpf = $("nc-cpf").value.trim();
    if (cpf && !DocId.valido(cpf)) { $("nc-msg").textContent = "O CPF/CNPJ não confere. Corrija ou deixe em branco."; $("nc-cpf").closest("details").open = true; $("nc-cpf").focus(); return; }
    const L = dadosLidos(), agora = new Date().toISOString();
    const procs = [...$("nc-proc").value.matchAll(CNJ_RE)].map(fmtCnj).join("\n");
    if (!c) { c = { id: novoId("CL-"), criado: agora, etapa: "Contratado", hist: [], nome, origem: "Indicação" }; clientes.push(c); }
    Object.assign(c, {
      tel: c.tel || $("nc-tel").value.trim(), email: c.email || $("nc-email").value.trim(), cpf: c.cpf || (cpf ? DocId.formatar(cpf) : L.cpf || ""),
      area: $("nc-area").value, contra: $("nc-contra").value.trim() || c.contra || "", assunto: c.assunto || relato.split(/[.\n]/)[0].slice(0, 90),
      procs: [c.procs, procs].filter(Boolean).join("\n"), relato: [c.relato, relato].filter(Boolean).join("\n\n"),
      resumo: c.resumo || relato.slice(0, 400), qualif: { ...(c.qualif || {}), ...Object.fromEntries(["rg", "orgao", "nascimento", "naturalidade", "endereco"].filter((k) => L[k]).map((k) => [k, L[k]])) },
    });
    // documentos recebidos (só os nomes; os arquivos ficam no seu computador)
    const cats = new Set(docs.map((d) => d.cat));
    if (cats.has("01 Documentos pessoais") && cats.has("02 Comprovante de residência")) c.onb = [...new Set([...(c.onb || []), "docpessoal"])];
    c.docsRecebidos = [...(c.docsRecebidos || []), ...docs.map((d) => ({ nome: d.file.name, cat: d.cat, em: agora.slice(0, 10) }))];
    (c.hist ||= []).unshift({ em: agora, o: `Novo caso registrado${docs.length ? ` com ${docs.length} documento(s)` : ""}` });
    const conflito = window.checarConflito?.({ nome: c.nome, cpf: c.cpf, contra: c.contra }, c.id);
    if (conflito) c.hist.unshift({ em: agora, o: `Verificação de conflito: ${conflito.grau}` });
    itens.push({ id: novoId("I-"), tipo: "tarefa", texto: "Revisar documentos e montar a peça do caso novo", quando: hojeIso, cli: c.id, feita: false });
    salvarCrm(); salvarItens();
    const mi = modeloSugerido(c), mods = ler("pd-modelos-peticao", []);
    $("nc-resultado").hidden = false;
    $("nc-resultado").innerHTML = `<h2>✅ Caso registrado: ${esc(c.nome)}</h2>
      <ul class="small">
        <li>Ficha ${$("nc-cli").value ? "atualizada" : "criada"} com área, parte contrária, relato${c.cpf ? ", CPF" : ""}${c.qualif.endereco ? ", endereço" : ""}${c.qualif.rg ? ", RG" : ""}.</li>
        ${conflito ? `<li>Conflito de interesses: <b>${esc(conflito.grau)}</b>${conflito.achados.length ? " — " + conflito.achados.map((a) => esc(a.txt)).join(" ") : ""}</li>` : ""}
        <li>${docs.length} documento(s) separados por tipo. Os arquivos não saem do seu computador: baixe a pasta organizada abaixo.</li>
        <li>Tarefa criada para hoje: revisar documentos e montar a peça.</li>
      </ul>
      <div class="as-linha">
        ${docs.length ? `<button class="btn" id="nc-zip">📂 Baixar documentos organizados</button>` : ""}
        <button class="back" id="nc-kit">🧾 Procuração e contrato</button>
        <button class="back" id="nc-peca">✍️ Montar peça${mi >= 0 ? `: ${esc(mods[mi].titulo.split(" – ")[0])}` : ""}</button>
        <button class="back" id="nc-juris">⚖️ Pesquisar jurisprudência</button>
        <button class="back" data-cli="${c.id}">Abrir ficha</button>
      </div>`;
    $("nc-zip")?.addEventListener("click", async () => {
      const z = new JSZip(), raiz = z.folder(`Documentos - ${c.nome}`.replace(/[\\/:*?"<>|]/g, ""));
      docs.forEach((d, i) => raiz.folder(d.cat).file(window.Organizador?.nomeSugerido(d.file, d.texto, d.cat, i, c.nome) || d.file.name, d.file));
      const l = document.createElement("a"); l.href = URL.createObjectURL(await z.generateAsync({ type: "blob" })); l.download = `Documentos - ${c.nome}.zip`; document.body.appendChild(l); l.click(); l.remove();
    });
    $("nc-kit").onclick = () => { abrirFicha(c.id); $("fi-docs").click(); };
    $("nc-peca").onclick = () => { go("peticoes"); $("pe-cli").dispatchEvent(new Event("focus")); $("pe-cli").value = c.id; $("pe-cli").dispatchEvent(new Event("change")); if (mi >= 0) { $("pe-modelo").value = String(mi); $("pe-modelo").dispatchEvent(new Event("change")); } };
    $("nc-juris").onclick = () => { go("peticoes"); document.querySelectorAll("#v-peticoes details").forEach((d) => d.querySelector("#pe-jur-form") && (d.open = true)); $("pe-jur-pesq").value = [c.area, ...semAcento(relato).split(/\W+/).filter((w) => w.length > 6)].slice(0, 7).join(" "); $("pe-jur-tese").focus(); };
    $("nc-resultado").scrollIntoView({ behavior: "smooth" });
    if (procs) atualizarAcomp?.(procsDe(c));
  };
  $("nc-limpar").onclick = () => { docs = []; ["nc-nome", "nc-tel", "nc-cpf", "nc-email", "nc-contra", "nc-proc", "nc-relato"].forEach((id) => ($(id).value = "")); $("nc-cli").value = ""; $("nc-novo").hidden = false; $("nc-resultado").hidden = true; render(); };
  window.abrirNovoCaso = (cliId) => { go("novocaso"); $("nc-cli").dispatchEvent(new Event("focus")); $("nc-cli").value = cliId || ""; $("nc-cli").dispatchEvent(new Event("change")); };
  $("nc-cli").dispatchEvent(new Event("focus"));
})();
