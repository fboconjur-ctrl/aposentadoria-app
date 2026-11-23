// Ferramentas de leitura de peças (tudo no navegador, nada é enviado):
// 1) Análise de sentença  2) Resumo de peça da outra parte  3) Tirar dados pessoais de um texto.
// Não inventa nada: só aponta o que está escrito no texto, com o trecho de onde tirou.
(() => {
  const V = document.getElementById("v-pecas"); if (!V) return;
  const $q = (s) => V.querySelector(s);
  const limpa = (t) => String(t || "").replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  const trecho = (t, i, n = 220) => t.slice(Math.max(0, i - 40), i + n).replace(/\s+/g, " ").trim();
  const uniq = (a) => [...new Set(a.map((x) => x.trim()))].filter(Boolean);
  let aba = "sentenca";

  // ---------- 1) Sentença ----------
  function analisarSentenca(T) {
    const t = limpa(T), low = t.toLowerCase();
    const iDisp = Math.max(low.lastIndexOf("dispositivo"), low.lastIndexOf("ante o exposto"), low.lastIndexOf("diante do exposto"), low.lastIndexOf("isto posto"), low.lastIndexOf("pelo exposto"));
    const disp = iDisp >= 0 ? t.slice(iDisp) : t.slice(-3000);
    const d = disp.toLowerCase(), r = [];
    const res =
      /julgo\s+parcialmente\s+procedente|procedentes?\s+em\s+parte|concedo\s+(em\s+)?parte|parcialmente\s+a\s+seguran/.test(d) ? ["🟡", "Parcialmente favorável", "parte dos pedidos foi aceita"]
      : /julgo\s+improcedente|denego\s+a\s+seguran|julgo\s+extint|indefiro\s+a\s+peti/.test(d) ? ["🔴", "Desfavorável ao autor/impetrante", "os pedidos não foram aceitos ou o processo foi extinto"]
      : /julgo\s+procedente|concedo\s+a\s+seguran|condeno\s+(o|a)\s+r[ée]u|condeno\s+(o|a)s?\s+(requerid|demandad|reclamad)/.test(d) ? ["🟢", "Favorável ao autor/impetrante", "os pedidos foram aceitos"]
      : ["⚪", "Resultado não identificado", "leia o dispositivo abaixo"];
    r.push(`<h3>${res[0]} ${res[1]}</h3><p class="small muted">Conclusão automática pelas palavras do dispositivo — confira.</p>`);
    const achados = [];
    const busca = (re, rot) => { const m = re.exec(disp); if (m) achados.push([rot, trecho(disp, m.index)]); };
    busca(/honor[áa]rios[^.]{0,200}/i, "Honorários");
    busca(/custas[^.]{0,160}/i, "Custas");
    busca(/(gratuidade|justi[çc]a gratuita|art\.?\s*98)[^.]{0,160}/i, "Gratuidade");
    busca(/(remessa necess[áa]ria|reexame necess[áa]rio|duplo grau)[^.]{0,160}/i, "Remessa necessária");
    busca(/(juros|corre[çc][ãa]o monet[áa]ria|selic|ipca)[^.]{0,160}/i, "Juros/correção");
    busca(/(multa|astreintes?)[^.]{0,160}/i, "Multa");
    busca(/(tutela|liminar)[^.]{0,160}/i, "Tutela/liminar");
    busca(/(prazo de|no prazo de)\s+\d+[^.]{0,120}/i, "Prazo para cumprir");
    if (achados.length) r.push(`<h3>O que o dispositivo diz</h3><ul class="list small">${achados.map(([a, b]) => `<li><b>${a}:</b> “${esc(b)}…”</li>`).join("")}</ul>`);
    const fazenda = /estado d[aeo]|munic[íi]pio|uni[ãa]o|inss|fazenda p[úu]blica|autarquia|instituto nacional do seguro/i.test(t);
    r.push(`<h3>Prazos para recorrer (conferir a intimação)</h3><ul class="list small"><li>Embargos de declaração: <b>5 dias úteis</b> (art. 1.023 CPC)</li><li>Apelação: <b>15 dias úteis</b> (art. 1.003, §5º CPC)</li>${fazenda ? `<li>⚠️ Parece haver ente público: para ele os prazos contam <b>em dobro</b> (art. 183 CPC).</li>` : ""}<li>No Juizado Especial: recurso inominado em 10 dias e embargos em 5 dias.</li></ul><p class="small">Use <b>📅 Calcular prazo</b> para a data exata.</p>`);
    const ck = [
      ["Todos os pedidos da inicial foram decididos?", "Se algum ficou sem resposta → embargos por omissão (art. 1.022, II)."],
      ["Os honorários foram fixados (percentual e base)?", /honor[áa]rios/i.test(disp) ? "Há menção a honorários no dispositivo — confira percentual e base de cálculo." : "Não achei honorários no dispositivo → possível omissão."],
      ["A fundamentação enfrenta os argumentos capazes de mudar o resultado?", "Se não → art. 489, §1º, IV (omissão)."],
      ["Há contradição entre fundamentação e dispositivo?", "Se o texto concede e o dispositivo nega (ou vice-versa) → embargos por contradição."],
      ["Houve erro material (nome, número, valor, data)?", "Correção por embargos ou simples petição (art. 494, I)."],
      ["Gratuidade de justiça foi apreciada?", /gratuidade|justi[çc]a gratuita/i.test(t) ? "Há menção — confira se foi deferida e se afeta custas/honorários." : "Não achei menção → verificar se foi pedida."],
    ];
    r.push(`<h3>Checklist para embargos / recurso</h3><ol class="small">${ck.map(([a, b]) => `<li><b>${a}</b><br>${esc(b)}</li>`).join("")}</ol>`);
    r.push(`<h3>Dispositivo</h3><div class="small" style="white-space:pre-wrap;max-height:260px;overflow:auto;border:1px solid var(--line);padding:8px;border-radius:8px">${esc(disp.slice(0, 4000))}</div>`);
    const cli = {
      "🟢": "Saiu a decisão do juiz no seu processo e ela foi favorável: o pedido foi aceito. A outra parte ainda pode recorrer; vou acompanhar e aviso sobre os próximos passos.",
      "🟡": "Saiu a decisão do juiz no seu processo: parte do que pedimos foi aceita e parte não. Estou analisando se vale recorrer da parte que não foi aceita e te explico em seguida.",
      "🔴": "Saiu a decisão do juiz no seu processo e, neste momento, ela não foi favorável. Ainda cabe recurso. Estou analisando o melhor caminho e vou conversar com você sobre isso.",
      "⚪": "Saiu uma decisão no seu processo. Estou analisando o conteúdo e te explico em seguida o que ela significa.",
    }[res[0]];
    r.push(`<h3>Resumo para o cliente (edite antes de enviar)</h3><textarea class="search" rows="4" style="width:100%;box-sizing:border-box" id="pc-cli">${esc(cli)}</textarea><button class="back" type="button" id="pc-copiar-cli">Copiar</button>`);
    return r.join("");
  }

  // ---------- 2) Resumo de peça ----------
  function resumirPeca(T) {
    const t = limpa(T), linhas = t.split("\n").map((l) => l.trim()).filter(Boolean), r = [];
    const tipo = (t.match(/\b(RECURSO DE APELA[ÇC][ÃA]O|APELA[ÇC][ÃA]O|CONTESTA[ÇC][ÃA]O|AGRAVO DE INSTRUMENTO|AGRAVO INTERNO|EMBARGOS DE DECLARA[ÇC][ÃA]O|RECURSO INOMINADO|RECURSO ESPECIAL|CONTRARRAZ[ÕO]ES|IMPUGNA[ÇC][ÃA]O|R[ÉE]PLICA|MANIFESTA[ÇC][ÃA]O)\b/i) || [])[1];
    if (tipo) r.push(`<h3>Peça: ${esc(tipo.toUpperCase())}</h3>`);
    const numerados = linhas.filter((l) => l.length < 160 && /^(\d+(\.\d+)*[.)\-–]?\s+|[IVX]+\s*[-–.)]\s+)[A-ZÁ-Ú]/.test(l));
    const tit = uniq(numerados.length >= 3 ? numerados : linhas.filter((l) => l.length < 120 && /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 .,:–\-]{8,}$/.test(l) && /[A-Z]{4}/.test(l) && !/[.,]$/.test(l)))
      .filter((l) => !/^(EXCELENT|EGR[ÉE]GIO|COLENDA|EMINENTE|PROCESSO|APELANTE|APELAD|AGRAVANT|AGRAVAD|ORIGEM|RELATOR|EMENTA|AC[ÓO]RD)/i.test(l)).slice(0, 40);
    if (tit.length) r.push(`<h3>Argumentos (títulos da peça) — um a um para rebater</h3><ol class="small">${tit.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`);
    const iPed = Math.max(t.search(/\b(DOS PEDIDOS|PEDIDOS E REQUERIMENTOS|ANTE O EXPOSTO|DIANTE DO EXPOSTO|ISTO POSTO)\b/i), -1);
    if (iPed >= 0) {
      const ped = t.slice(iPed, iPed + 3500).split(/\n|(?=\b[a-h]\)\s)/).map((x) => x.trim()).filter((x) => /^[a-h]\)|requer/i.test(x)).slice(0, 12);
      r.push(`<h3>O que ela pede</h3><ul class="list small">${(ped.length ? ped : [t.slice(iPed, iPed + 600)]).map((x) => `<li>${esc(x.replace(/\s+/g, " ").slice(0, 400))}</li>`).join("")}</ul>`);
    }
    const leis = uniq((t.match(/\bart(?:igo|s?\.)\s*\d+[ºo°]?(?:[^.;\n]{0,60}?)(?:da\s+Constitui[çc][ãa]o(?:\s+Federal)?|da\s+CF|do\s+C[óo]digo\s+de\s+Processo\s+Civil|do\s+CPC|do\s+CC|do\s+CDC|da\s+Lei\s+(?:Federal\s+|Estadual\s+|Complementar\s+)?n?[ºo°.]*\s*[\d.\/]+)/gi) || []).map((x) => x.replace(/\s+/g, " "))).slice(0, 40);
    if (leis.length) r.push(`<h3>Dispositivos legais citados</h3><ul class="list small">${leis.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`);
    const jul = uniq([
      ...(t.match(/\b(?:AgInt|AgRg|EDcl|REsp|AREsp|RMS|MS|RE|ARE|HC|RHC|AI|RR|AIRR|Ag)\b(?:\s+(?:no|nos|na|em)\s+\w+)*\s+n?[ºo°.]*\s*[\d.]+(?:\/[A-Z]{2})?/g) || []),
      ...(t.match(/\b\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\b/g) || []),
      ...(t.match(/S[úu]mula(?:\s+Vinculante)?\s+n?[ºo°.]*\s*\d+(?:\s+do\s+(?:STF|STJ|TST))?/gi) || []),
      ...(t.match(/Tema\s+(?:n[ºo°.]*\s*)?\d+/gi) || []),
    ].map((x) => x.replace(/\s+/g, " "))).slice(0, 40);
    if (jul.length) r.push(`<h3>Julgados, súmulas e temas citados — conferir no site oficial</h3><p class="small muted">Verifique se existem, se dizem isso mesmo e se o caso é parecido (distinção). Se forem de outro assunto, aponte na resposta.</p><ul class="list small">${jul.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`);
    const ids = uniq(t.match(/\bID[ \t]*\d{6,}/g) || []).slice(0, 40);
    if (ids.length) r.push(`<h3>Documentos dos autos mencionados</h3><p class="small">${ids.map(esc).join(" · ")}</p>`);
    const datas = uniq(t.match(/\b\d{2}\/\d{2}\/\d{4}\b/g) || []).slice(0, 20);
    if (datas.length) r.push(`<h3>Datas que aparecem</h3><p class="small">${datas.join(" · ")}</p>`);
    r.push(`<h3>Roteiro da resposta</h3><ol class="small"><li>Tempestividade (data da intimação + prazo).</li><li>Síntese do processado (o que já foi decidido a seu favor).</li><li>Rebater as preliminares, na ordem dos títulos acima.</li><li>Rebater o mérito, um argumento por vez.</li><li>Distinguir os julgados citados que não se aplicam ao caso.</li><li>Prequestionamento e pedidos.</li></ol>`);
    return r.join("") || "<p>Não encontrei a estrutura da peça. Confira se o texto foi lido corretamente.</p>";
  }

  // ---------- 3) Anonimização ----------
  function anonimizar(T, nomesExtra) {
    let t = String(T || ""); const cont = {}, mapa = [];
    const troca = (re, rot) => { t = t.replace(re, (m) => { const k = rot + "|" + m; if (!cont[k]) { cont[rot] = (cont[rot] || 0) + 1; cont[k] = `[${rot}${cont[rot] > 1 ? " " + cont[rot] : ""}]`; mapa.push([m, cont[k]]); } return cont[k]; }); };
    const nomes = uniq([...(nomesExtra || []), ...(typeof clientes !== "undefined" ? clientes.map((c) => c.nome) : [])]).filter((n) => n && n.split(/\s+/).length >= 2).sort((a, b) => b.length - a.length);
    for (const n of nomes) { const re = new RegExp(n.normalize("NFC").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"), "gi"); troca(re, "NOME"); }
    troca(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "CPF");
    troca(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "CNPJ");
    troca(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "E-MAIL");
    troca(/(?:\+?55\s?)?\(?\b\d{2}\)?\s?9?\d{4}-?\d{4}\b/g, "TELEFONE");
    troca(/\b\d{5}-\d{3}\b/g, "CEP");
    troca(/\b(?:RG|C[ée]dula de Identidade|Identidade)\s*(?:n[ºo°.]*\s*)?[:\s]*[\d.\-xX]{5,14}/gi, "RG");
    troca(/\b(?:NB|benef[íi]cio)\s*(?:n[ºo°.]*\s*)?[:\s]*\d{3}\.?\d{3}\.?\d{3}-?\d\b/gi, "BENEFÍCIO");
    troca(/\b(?:Rua|Avenida|Av\.|Travessa|Rodovia|Quadra|SQS|SQN|QNM|Alameda)\s[^,\n]{2,60},?\s*(?:n[ºo°.]*\s*)?\d+[^\n]{0,40}/gi, "ENDEREÇO");
    troca(/\b(?:conta|ag[êe]ncia)\s*(?:corrente\s*)?(?:n[ºo°.]*\s*)?[:\s]*[\d.\-xX]{3,15}/gi, "DADO BANCÁRIO");
    return { texto: t, mapa };
  }

  // ---------- Tela ----------
  const AJUDA = {
    sentenca: "Cole a sentença ou decisão (ou carregue o PDF). O painel mostra o resultado, o que o dispositivo diz, os prazos, um checklist de embargos/recurso e um resumo pronto para o cliente.",
    peca: "Cole a peça da outra parte (apelação, contestação, agravo…). O painel lista os argumentos na ordem, o que ela pede, as leis e os julgados citados para você conferir, e um roteiro da resposta.",
    anon: "Cole o texto. O painel troca nomes dos seus clientes, CPF, CNPJ, RG, telefone, e-mail, CEP, endereço e dados bancários por marcadores. Use antes de guardar como modelo ou compartilhar.",
  };
  function mostrarAba() {
    V.querySelectorAll("[data-pc-aba]").forEach((b) => b.classList.toggle("on", b.dataset.pcAba === aba));
    $q("#pc-ajuda").textContent = AJUDA[aba];
    $q("#pc-nomes-l").hidden = aba !== "anon";
    $q("#pc-ir").textContent = { sentenca: "Analisar sentença", peca: "Resumir peça", anon: "Tirar dados pessoais" }[aba];
    $q("#pc-saida").hidden = true;
  }
  V.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pc-aba]"); if (b) { aba = b.dataset.pcAba; mostrarAba(); }
    if (e.target.id === "pc-copiar-cli") navigator.clipboard?.writeText($q("#pc-cli").value);
    if (e.target.id === "pc-copiar-anon") navigator.clipboard?.writeText($q("#pc-anon").value);
  });
  $q("#pc-arq").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return; const st = $q("#pc-st");
    st.textContent = "Lendo o arquivo no seu computador…";
    try { const txt = await LeituraDocs.lerArquivo(f, (p) => (st.textContent = `Lendo… ${p}%`)); $q("#pc-texto").value = txt.trim(); st.textContent = `Arquivo lido: ${f.name}`; }
    catch (er) { st.textContent = "Não consegui ler o arquivo: " + er.message; }
    e.target.value = "";
  };
  $q("#pc-ir").onclick = () => {
    const T = $q("#pc-texto").value; if (T.trim().length < 50) { $q("#pc-st").textContent = "Cole o texto ou carregue o arquivo primeiro."; return; }
    const out = $q("#pc-res");
    if (aba === "sentenca") out.innerHTML = analisarSentenca(T);
    else if (aba === "peca") out.innerHTML = resumirPeca(T);
    else {
      const { texto, mapa } = anonimizar(T, $q("#pc-nomes").value.split(/[;\n]/));
      out.innerHTML = `<h3>Texto sem dados pessoais</h3><textarea class="search" rows="14" style="width:100%;box-sizing:border-box" id="pc-anon">${esc(texto)}</textarea><button class="back" type="button" id="pc-copiar-anon">Copiar</button>
        <p class="small">${mapa.length} troca(s). ⚠️ Leia antes de usar: nomes de pessoas que não são seus clientes só saem se você os colocar no campo de nomes.</p>
        ${mapa.length ? `<details class="small"><summary>Ver o que foi trocado (fica só nesta tela)</summary><ul class="list">${mapa.map(([a, b]) => `<li>${esc(b)} ← ${esc(a)}</li>`).join("")}</ul></details>` : ""}`;
    }
    $q("#pc-saida").hidden = false; $q("#pc-saida").scrollIntoView({ behavior: "smooth" });
  };
  window.PecasJuridicas = { analisarSentenca, resumirPeca, anonimizar };
  mostrarAba();
})();
