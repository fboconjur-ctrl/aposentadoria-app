// Gerador de documentos: modelos baseados na redação da advogada. Tudo roda no navegador.
(() => {
  const ADV_KEY = "pd-adv";
  const ADV_PADRAO = { nome: "FERNANDA BORGES OLIVEIRA", oab: "35.332/DF", end: "", cidade: "Brasília/DF" };
  let adv = { ...ADV_PADRAO };
  try { adv = { ...adv, ...JSON.parse(localStorage.getItem(ADV_KEY) || "{}") }; } catch {}
  const ADV_CAMPOS = { nome: "adv-nome", oab: "adv-oab", end: "adv-end", cidade: "adv-cidade" };
  Object.entries(ADV_CAMPOS).forEach(([k, id]) => {
    $(id).value = adv[k] || "";
    $(id).oninput = () => { adv[k] = $(id).value; try { localStorage.setItem(ADV_KEY, JSON.stringify(adv)); } catch {} };
  });
  if (!adv.end) $("meus-dados").open = true;

  // Valor por extenso em reais (até bilhões).
  const UN = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const DEZ = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const CEM = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  function ate999(n) {
    if (n === 100) return "cem";
    const c = Math.floor(n / 100), r = n % 100, partes = [];
    if (c) partes.push(CEM[c]);
    if (r < 20) { if (r) partes.push(UN[r]); } else { partes.push(DEZ[Math.floor(r / 10)] + (r % 10 ? " e " + UN[r % 10] : "")); }
    return partes.join(" e ");
  }
  function inteiroExtenso(n) {
    if (n === 0) return "zero";
    const grupos = [["", ""], ["mil", "mil"], ["milhão", "milhões"], ["bilhão", "bilhões"]];
    const partes = [];
    for (let i = 0; n > 0; i++, n = Math.floor(n / 1000)) {
      const g = n % 1000; if (!g) continue;
      const txt = i === 0 ? ate999(g) : i === 1 ? (g === 1 ? "mil" : ate999(g) + " mil") : (g === 1 ? "um " + grupos[i][0] : ate999(g) + " " + grupos[i][1]);
      partes.unshift({ g, txt });
    }
    // Norma usual: "e" antes do último grupo quando ele é menor que 100 ou centena redonda.
    return partes.map((p, i) => (i === 0 ? "" : p.g < 100 || p.g % 100 === 0 ? " e " : " ") + p.txt).join("");
  }
  function reais(v) {
    const n = Math.round(Number(String(v).replace(/\./g, "").replace(",", ".")) * 100);
    if (!isFinite(n)) return "";
    const r = Math.floor(n / 100), c = n % 100;
    const txtR = r ? `${inteiroExtenso(r)}${/(lhão|lhões)$/.test(inteiroExtenso(r)) ? " de" : ""} rea${r === 1 ? "l" : "is"}` : "";
    const txtC = c ? `${inteiroExtenso(c)} centavo${c === 1 ? "" : "s"}` : "";
    const num = (n / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return `${num} (${[txtR, txtC].filter(Boolean).join(" e ")})`;
  }
  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const dataExtenso = (d = new Date()) => `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  const B = (t) => `<b>${esc(t)}</b>`;

  // Qualificação da parte, no padrão dos modelos da advogada.
  function qualificacao(p) {
    if (p.tipo === "pj") {
      return `${B(p.nome.toUpperCase())}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${B(p.doc)}, com sede em ${esc(p.end)}${p.rep ? `, neste ato representada por ${esc(p.rep)}` : ""}`;
    }
    const base = [esc(p.nac), esc(p.civil), esc(p.prof)].filter(Boolean).join(", ");
    return `${B(p.nome.toUpperCase())}, ${base}${p.rg ? `, portador(a) da Carteira de Identidade n.º ${esc(p.rg)}` : ""}, inscrito(a) no CPF sob o n.º ${esc(p.doc)}, residente e domiciliado(a) em ${esc(p.end)}` +
      (p.menor ? `, em nome próprio e na qualidade de representante legal de ${B(p.menor)}, nos termos dos arts. 1.630, 1.631 e 1.634 do Código Civil` : "");
  }
  const advQualif = () => `${B(adv.nome.toUpperCase())}, advogada, inscrita na Ordem dos Advogados do Brasil sob o nº ${esc(adv.oab)}${adv.end ? `, com escritório profissional situado em ${esc(adv.end)}` : ""}`;
  const local = (f) => `${esc(f.cidade || adv.cidade)}, ${dataExtenso()}.`;
  const assinatura = (nome, linha2 = "") => `<p class="ass">_______________________________________<br>${B(nome.toUpperCase())}${linha2 ? `<br>${esc(linha2)}` : ""}</p>`;

  const PODERES = "inerentes ao bom e fiel cumprimento deste mandato, para o foro em geral com extensão ao art. 5º, §2º, da Lei nº 8.906/94, podendo, portanto, promover quaisquer medidas judiciais ou administrativas, em qualquer instância, assinar termo, substabelecer com ou sem reserva de poderes, e praticar ainda, todos e quaisquer atos necessários e convenientes ao bom e fiel desempenho deste mandato, com poderes específicos para receber citação, transigir, desistir, renunciar ao direito sobre o qual se funda a ação, inclusive, renunciar aos valores que excederem ao teto de 60 (sessenta) salários mínimos, receber, pedir a justiça gratuita, em conformidade com a norma do art. 105 da Lei 13.105/2015.";

  const MODELOS = {
    procuracao: {
      nome: "Procuração",
      campos: [["especial", "Poderes especiais / finalidade (opcional)", "area"], ["cidade", "Cidade/UF", ""]],
      gerar: (p, f) => `<h3>PROCURAÇÃO</h3>
        <p><b>Outorgante:</b> ${qualificacao(p)}.</p>
        <p><b>Outorgada:</b> ${advQualif()}.</p>
        <p><b>Poderes que neste ato confere:</b> ${PODERES}</p>
        ${f.especial ? `<p><b>${esc(f.especial)}</b></p>` : ""}
        <p>${local(f)}</p>${assinatura(p.nome)}`,
    },
    contrato: {
      nome: "Contrato de honorários",
      campos: [["objeto", "Objeto (o que será feito, contra quem)", "area"], ["fixo", "Honorários fixos (R$)", ""], ["pagamento", "Forma de pagamento dos fixos", ""],
        ["exito", "Honorários de êxito (%) — vazio se não houver", ""], ["foro", "Foro (comarca/UF)", ""], ["cidade", "Cidade/UF da assinatura", ""]],
      gerar: (p, f) => {
        let n = 0; const cl = (t) => `<p><b>CLÁUSULA ${["PRIMEIRA", "SEGUNDA", "TERCEIRA", "QUARTA", "QUINTA", "SEXTA", "SÉTIMA", "OITAVA"][n++]} - ${t}</b></p>`;
        const pct = f.exito ? `${f.exito}% (${inteiroExtenso(+String(f.exito).replace(",", "."))} por cento)` : "";
        return `<h3>CONTRATO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</h3>
        <p><b>CONTRATANTE:</b> ${qualificacao(p)}.</p>
        <p><b>CONTRATADA:</b> ${advQualif()}.</p>
        <p>As partes resolvem celebrar o presente Contrato Particular de Prestação de Serviços Advocatícios, que será regido pelas cláusulas seguintes.</p>
        ${cl("DO OBJETO")}<p>Constitui objeto do presente contrato a prestação de serviços advocatícios visando à defesa dos interesses da CONTRATANTE ${esc(f.objeto || "[descrever]")}, compreendendo a elaboração da estratégia, análise documental, elaboração das peças necessárias, acompanhamento do processo, manifestações, audiências, recursos eventualmente cabíveis e demais providências necessárias ao regular andamento da demanda.</p>
        ${f.fixo ? `${cl("DOS HONORÁRIOS CONTRATUAIS")}<p>Pelos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA honorários advocatícios fixos no valor de <b>${reais(f.fixo) || "R$ [COMPLETAR] ([valor por extenso])"}</b>${f.pagamento ? `, ${esc(f.pagamento)}` : ""}.</p>` : ""}
        ${pct ? `${cl("DOS HONORÁRIOS DE ÊXITO")}<p>${f.fixo ? "Além dos honorários previstos na cláusula anterior, a" : "A"} CONTRATANTE pagará à CONTRATADA honorários correspondentes a <b>${pct}</b> sobre todo o proveito econômico obtido, compreendendo indenizações, acordos judiciais ou extrajudiciais, restituição de valores, pagamentos espontâneos, cumprimento de sentença, precatórios, requisições de pequeno valor e qualquer outro benefício econômico decorrente da atuação profissional.</p>` : ""}
        ${cl("DOS HONORÁRIOS SUCUMBENCIAIS")}<p>Os honorários sucumbenciais eventualmente arbitrados pelo Juízo pertencem exclusivamente à CONTRATADA, nos termos do art. 85, §14, do Código de Processo Civil e do Estatuto da Advocacia (Lei n.º 8.906/94), não se confundindo com os honorários contratuais previstos neste instrumento.</p>
        ${cl("DAS DESPESAS")}<p>Custas processuais, diligências, despesas com cópias, autenticações, deslocamentos, correios, perícias, taxas e quaisquer outras despesas necessárias ao desenvolvimento da demanda correrão por conta da CONTRATANTE, mediante prévia comunicação.</p>
        ${cl("DA RESCISÃO")}<p>A rescisão unilateral por iniciativa da CONTRATANTE não prejudicará o direito da CONTRATADA ao recebimento dos honorários proporcionais ao trabalho já desenvolvido, observando-se os critérios previstos no Estatuto da Advocacia e no Código de Ética e Disciplina da OAB.</p>
        ${cl("DO FORO")}<p>Fica eleito o foro da Comarca de <b>${esc(f.foro || adv.cidade)}</b> para dirimir quaisquer dúvidas oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.</p>
        <p>E, por estarem justas e contratadas, firmam o presente instrumento em duas vias de igual teor.</p>
        <p>${local(f)}</p>${assinatura(p.nome, p.doc ? (p.tipo === "pj" ? "CNPJ " : "CPF n.º ") + p.doc : "")}${assinatura(adv.nome, "Advogada OAB " + adv.oab)}`;
      },
    },
    recibo: {
      nome: "Recibo de honorários",
      campos: [["valor", "Valor recebido (R$)", ""], ["referente", "Referente a (serviço prestado)", "area"], ["cidade", "Cidade/UF", ""]],
      gerar: (p, f) => `<h3>RECIBO DE HONORÁRIOS ADVOCATÍCIOS</h3>
        <p>${advQualif()}, DECLARO, para os devidos fins, que recebi de ${B(p.nome.toUpperCase())}, inscrito(a) no ${p.tipo === "pj" ? "CNPJ" : "CPF"} sob o n.º ${esc(p.doc)}, a importância de:</p>
        <p style="text-align:center"><b>${reais(f.valor || 0)}</b></p>
        <p>referente ao pagamento dos honorários advocatícios contratuais decorrentes ${esc(f.referente || "[descrever o serviço]")}, conforme Contrato Particular de Prestação de Serviços Advocatícios firmado entre as partes.</p>
        <p>Declaro, ainda, que o presente recibo confere quitação do valor acima especificado, sem prejuízo dos honorários de êxito eventualmente convencionados no contrato de prestação de serviços advocatícios.</p>
        <p>${local(f)}</p>${assinatura(adv.nome, "OAB " + adv.oab)}`,
    },
    hipossuficiencia: {
      nome: "Declaração de hipossuficiência",
      campos: [["cidade", "Cidade/UF", ""]],
      gerar: (p, f) => `<h3>DECLARAÇÃO DE HIPOSSUFICIÊNCIA ECONÔMICA</h3>
        <p>${qualificacao(p)}, DECLARA, para os fins dos arts. 98 e 99 do Código de Processo Civil, sob as penas da lei, que não possui condições de arcar com as custas e despesas processuais e com os honorários advocatícios sem prejuízo do próprio sustento e do de sua família, razão pela qual requer os benefícios da gratuidade da justiça.</p>
        <p>Declara, ainda, estar ciente de que a falsidade desta declaração pode ensejar as sanções civis, administrativas e criminais previstas na legislação.</p>
        <p>${local(f)}</p>${assinatura(p.nome)}`,
    },
    substabelecimento: {
      nome: "Substabelecimento",
      campos: [["substabelecido", "Advogado(a) substabelecido(a) (nome, OAB e endereço)", "area"], ["reserva", "Com ou sem reserva de poderes", "sel:com reserva|sem reserva"], ["processo", "Processo / finalidade", ""], ["cidade", "Cidade/UF", ""]],
      gerar: (p, f) => `<h3>SUBSTABELECIMENTO</h3>
        <p>${advQualif()}, nos autos ${f.processo ? `do processo n.º ${esc(f.processo)}` : "em que atua"} em favor de ${B(p.nome.toUpperCase())}, SUBSTABELECE, <b>${esc((f.reserva || "com reserva").toUpperCase())} DE PODERES</b>, os poderes que lhe foram conferidos a ${esc(f.substabelecido || "[advogado(a) substabelecido(a)]")}.</p>
        <p>${local(f)}</p>${assinatura(adv.nome, "OAB " + adv.oab)}`,
    },
  };

  $("doc-modelo").innerHTML = Object.entries(MODELOS).map(([k, m]) => `<option value="${k}">${m.nome}</option>`).join("");
  function camposModelo() {
    const m = MODELOS[$("doc-modelo").value];
    $("doc-campos").innerHTML = m.campos.map(([k, rot, tipo]) =>
      tipo === "area" ? `<label class="wide">${rot}<textarea id="f-${k}" rows="2" class="search"></textarea></label>` :
      tipo.startsWith("sel:") ? `<label>${rot}<select id="f-${k}" class="search">${tipo.slice(4).split("|").map((o) => `<option>${o}</option>`).join("")}</select></label>` :
      `<label>${rot}<input id="f-${k}" class="search"${k === "cidade" ? ` value="${esc(adv.cidade)}"` : ""}></label>`).join("");
  }
  function tipoParte() { document.querySelectorAll("#v-docs .pf").forEach((e) => (e.hidden = $("p-tipo").value !== "pf")); document.querySelectorAll("#v-docs .pj").forEach((e) => (e.hidden = $("p-tipo").value !== "pj")); }
  function listaClientes() { $("doc-cliente").innerHTML = `<option value="">—</option>` + clientes.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); }
  $("doc-modelo").onchange = camposModelo;
  $("p-tipo").onchange = tipoParte;
  $("doc-cliente").onfocus = listaClientes;
  $("doc-cliente").onchange = () => {
    const c = clientes.find((x) => x.id === $("doc-cliente").value); if (!c) return;
    $("p-nome").value = c.nome;
    if (c.cpf) { $("p-doc").value = c.cpf; $("p-tipo").value = DocId.cnpj(c.cpf) ? "pj" : "pf"; tipoParte(); }
    const caso = CASOS.find((k) => k.id === c.caso);
    if (caso && !$("kit-historia").value) $("kit-historia").value = [caso.resumo, ...(caso.orientacoes || [])].filter((x) => x && x !== "—").join("\n");
  };

  const PARTE = { tipo: "p-tipo", nome: "p-nome", nac: "p-nac", civil: "p-civil", prof: "p-prof", rg: "p-rg", doc: "p-doc", end: "p-end", rep: "p-rep", menor: "p-menor" };
  $("doc-gerar").onclick = () => {
    const p = Object.fromEntries(Object.entries(PARTE).map(([k, id]) => [k, $(id).value.trim()]));
    if (!p.nome) { $("p-nome").focus(); return; }
    if (!DocId.valido(p.doc)) { $("p-doc").setCustomValidity("Informe um CPF ou CNPJ válido"); $("p-doc").reportValidity(); return; }
    $("p-doc").setCustomValidity("");
    const m = MODELOS[$("doc-modelo").value];
    const f = Object.fromEntries(m.campos.map(([k]) => [k, ($(`f-${k}`)?.value || "").trim()]));
    $("doc-texto").innerHTML = m.gerar(p, f);
    $("doc-saida").hidden = false; $("doc-saida").scrollIntoView({ behavior: "smooth" });
    const c = clientes.find((x) => x.id === $("doc-cliente").value);
    if (c) { (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Documento gerado: ${m.nome}` }); salvarCrm(); renderCrm(); }
  };
  const nomeArquivo = () => `${MODELOS[$("doc-modelo").value].nome} - ${$("p-nome").value.trim() || "cliente"}`.replace(/[\\/:*?"<>|]/g, "");
  $("doc-word").onclick = () => {
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>body{font:12pt/1.5 "Times New Roman",serif}h3{text-align:center}p{text-align:justify}.ass{text-align:center;margin-top:36pt}</style></head><body>${$("doc-texto").innerHTML}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿", html], { type: "application/msword" }));
    a.download = nomeArquivo() + ".doc"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $("doc-pdf").onclick = () => window.print();
  $("doc-copiar").onclick = async () => { try { await navigator.clipboard.writeText($("doc-texto").innerText); $("doc-copiar").textContent = "Copiado!"; setTimeout(() => ($("doc-copiar").textContent = "Copiar texto"), 1500); } catch {} };

  // ---------- leitura dos documentos do cliente ----------
  const MAPA = { nome: "p-nome", cpf: "p-doc", endereco: "p-end" };
  async function processar(files) {
    for (const f of files) {
      const li = document.createElement("li"); li.innerHTML = `<span class="when">${esc(f.name.slice(0, 28))}</span><span>lendo…</span>`; $("dz-lista").appendChild(li);
      try {
        const txt = await LeituraDocs.lerArquivo(f, (pc) => (li.lastChild.textContent = `lendo… ${pc}%`));
        const d = LeituraDocs.extrair(txt);
        const achados = [];
        Object.entries(MAPA).forEach(([k, id]) => { if (d[k] && !$(id).value) { $(id).value = d[k]; $(id).classList.add("preenchido"); achados.push(k); } });
        if (d.rg && !$("p-rg").value) { $("p-rg").value = d.rg + (d.orgao ? ` ${d.orgao}` : ""); $("p-rg").classList.add("preenchido"); achados.push("RG"); }
        if (d.cep && !$("p-end").value) { $("p-end").value = `[COMPLETAR], CEP ${d.cep}`; achados.push("CEP"); }
        $("p-tipo").value = "pf"; tipoParte();
        li.lastChild.textContent = achados.length ? `encontrado: ${achados.join(", ")}${d.nascimento ? ` · nasc. ${d.nascimento}` : ""}${d.naturalidade ? ` · ${d.naturalidade}` : ""}` : "não consegui ler dados — confira a nitidez da foto";
      } catch (e) { li.lastChild.textContent = "erro: " + e.message; }
    }
    $("doc-avulso").open = true;
  }
  const dz = $("dz");
  $("dz-input").onchange = (e) => processar([...e.target.files]);
  dz.ondragover = (e) => { e.preventDefault(); dz.classList.add("over"); };
  dz.ondragleave = () => dz.classList.remove("over");
  dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove("over"); processar([...e.dataTransfer.files]); };

  // ---------- kit da ação ----------
  const KIT = [["proposta", "Proposta de honorários", true], ["procuracao", "Procuração", true], ["contrato", "Contrato de honorários", true], ["hipossuficiencia", "Declaração de hipossuficiência", false], ["peticao", "Minuta da petição (pedido pronto para o Claude)", true], ["checklist", "Checklist de documentos", true], ["protocolo", "Ficha de protocolo PJe (e instruções para o Claude)", true]];
  $("kit-opcoes").innerHTML = KIT.map(([k, n, on]) => `<label><input type="checkbox" value="${k}"${on ? " checked" : ""}> ${n}</label>`).join("");
  const docHtml = (corpo) => `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>body{font:12pt/1.5 "Times New Roman",serif}h3{text-align:center}p{text-align:justify}.ass{text-align:center;margin-top:36pt}</style></head><body>${corpo}</body></html>`;
  $("kit-gerar").onclick = async () => {
    const p = Object.fromEntries(Object.entries(PARTE).map(([k, id]) => [k, $(id).value.trim()]));
    if (!p.nome) { $("doc-avulso").open = true; $("p-nome").focus(); $("kit-status").textContent = "Envie os documentos ou preencha o nome do cliente."; return; }
    if (!DocId.valido(p.doc)) { $("doc-avulso").open = true; $("p-doc").focus(); $("kit-status").textContent = "Falta o CPF (ou CNPJ) válido do cliente. Envie o documento ou digite o número."; return; }
    const escolhidos = [...document.querySelectorAll("#kit-opcoes input:checked")].map((i) => i.value);
    const hist = $("kit-historia").value.trim(), reu = $("kit-reu").value.trim(), foro = $("kit-foro").value.trim() || adv.cidade;
    const objeto = reu ? `em ação judicial em face de ${reu}` : "";
    const base = { cidade: foro, foro, objeto, especial: reu ? `Especialmente para propor e acompanhar ação judicial em face de ${reu}.` : "" };
    const zip = new JSZip(); const pasta = zip.folder(`Kit - ${p.nome}`.replace(/[\\/:*?"<>|]/g, ""));
    const n = (i, t) => `${String(i).padStart(2, "0")} - ${t}`;
    let i = 1;
    const pr = window.PrecoAtual, opc = $("kit-opcao").value;
    const doContrato = pr ? (opc === "2" ? { fixo: String(pr.fixoMisto).replace(".", ","), exito: String(pr.pctExito) } : { fixo: String(pr.sugerido).replace(".", ","), exito: "" }) : { fixo: "[COMPLETAR]", exito: "" };
    const pagto = pr ? (opc === "2" ? (pr.fixoMisto >= 2000 ? `em ${Math.min(12, Math.round(pr.fixoMisto / 1000))} parcelas mensais, a primeira na assinatura` : "na assinatura") : (pr.parcelas > 1 ? `em ${pr.parcelas} parcelas mensais, a primeira na assinatura` : "na assinatura")) : "[forma de pagamento]";
    if (escolhidos.includes("proposta")) {
      const R = (v) => (+v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const op1 = pr && `<p><b>Opção 1 — Honorários fixos:</b> ${reais(pr.sugerido)}, ${pr.parcelas > 1 ? `em até ${pr.parcelas} parcelas mensais de ${R(pr.sugerido / pr.parcelas)}` : "na assinatura do contrato"}.</p>`;
      const op2 = pr && `<p><b>Opção 2 — Fixo + êxito:</b> ${reais(pr.fixoMisto)} na contratação, mais ${pr.pctExito}% (${inteiroExtenso(pr.pctExito)} por cento) sobre o proveito econômico obtido ao final${pr.proveito ? ` (estimativa: ${R(pr.proveito * pr.pctExito / 100)})` : ""}.</p>`;
      const ops = !pr ? `<p><b>Honorários:</b> [COMPLETAR — calcule no passo 3 do kit].</p>` : opc === "1" ? op1 : opc === "2" ? op2 : op1 + op2;
      pasta.file(n(i++, "Proposta de honorários.doc"), "\ufeff" + docHtml(`<h3>PROPOSTA DE HONORÁRIOS ADVOCATÍCIOS</h3>
        <p><b>Cliente:</b> ${esc(p.nome)}${p.doc ? ` — ${p.tipo === "pj" ? "CNPJ" : "CPF"} ${esc(p.doc)}` : ""}</p>
        <p><b>Serviço:</b> ${esc(pr ? pr.servico.replace(/[,—–-]?\s*\d+%\s*a\s*\d+%.*$/, "").replace(/[\s—–-]+$/, "") : "[descrever]")}${reu ? `, em face de ${esc(reu)}` : ""}.</p>
        <p><b>O que está incluído:</b> análise do caso e dos documentos, definição da estratégia, elaboração e protocolo das peças, acompanhamento do processo em primeiro grau, audiências e a interposição ou resposta de recurso ao segundo grau. Sustentação oral, recursos aos tribunais superiores, cumprimento de sentença e incidentes não estão incluídos e serão orçados à parte, se necessários.</p>
        ${ops}
        <p><b>Honorários de sucumbência:</b> eventualmente fixados pelo juízo, pertencem à advogada (Lei 8.906/1994, art. 23; CPC, art. 85, §14) e não se confundem com os honorários acima.</p>
        <p><b>Despesas:</b> custas, perícias, cópias, deslocamentos e demais despesas do processo correm por conta do cliente, mediante prévia comunicação.</p>
        <p><b>Validade da proposta:</b> 15 dias.</p>
        <p>${esc(foro)}, ${dataExtenso()}.</p>${assinatura(adv.nome, "Advogada OAB " + adv.oab)}`));
    }
    if (escolhidos.includes("procuracao")) pasta.file(n(i++, "Procuração.doc"), "\ufeff" + docHtml(MODELOS.procuracao.gerar(p, base)));
    if (escolhidos.includes("contrato")) pasta.file(n(i++, "Contrato de honorários.doc"), "\ufeff" + docHtml(MODELOS.contrato.gerar(p, { ...base, ...doContrato, pagamento: pagto })));
    if (escolhidos.includes("hipossuficiencia")) pasta.file(n(i++, "Declaração de hipossuficiência.doc"), "\ufeff" + docHtml(MODELOS.hipossuficiencia.gerar(p, base)));
    if (escolhidos.includes("peticao")) pasta.file(n(i++, "Pedido da petição - colar no Claude.txt"),
      `Petição: monte a petição inicial com a skill "peticao".\n\nCLIENTE (autor):\n${["Nome: " + p.nome, p.nac && "Nacionalidade: " + p.nac, p.civil && "Estado civil: " + p.civil, p.prof && "Profissão: " + p.prof, p.rg && "RG: " + p.rg, p.doc && "CPF/CNPJ: " + p.doc, p.end && "Endereço: " + p.end].filter(Boolean).join("\n")}\n\nRÉU: ${reu || "[informar]"}\nCIDADE/FORO PRETENDIDO: ${foro}\n\nHISTÓRIA DO CASO:\n${hist || "[narrar]"}\n\nUse a jurisprudência do tribunal desse foro, verificada com link. Salve a petição no meu Google Drive.`);
    if (escolhidos.includes("checklist")) pasta.file(n(i++, "Checklist.txt"),
      `KIT DA AÇÃO — ${p.nome}${reu ? " x " + reu : ""}\nGerado em ${new Date().toLocaleString("pt-BR")}\n\nDOCUMENTOS DO CLIENTE\n[${p.doc ? "x" : " "}] CPF\n[${p.rg ? "x" : " "}] RG / CNH\n[${p.end ? "x" : " "}] Comprovante de endereço\n[ ] Provas do fato (contratos, prints, notas, protocolos)\n\nPARA ASSINAR\n[ ] Procuração\n[ ] Contrato de honorários (preencher valores)\n${escolhidos.includes("hipossuficiencia") ? "[ ] Declaração de hipossuficiência\n" : ""}\nPETIÇÃO\n[ ] Colar o arquivo "Pedido da petição" no Claude e revisar a minuta\n[ ] Conferir o quadro de verificação da jurisprudência\n[ ] Completar os campos [COMPLETAR]\n`);
    if (escolhidos.includes("protocolo")) {
      const docsCli = [...($("dz-input").files || [])].map((f) => f.name);
      const anexos = [["Petição inicial", "petição final em PDF, revisada por você (a assinatura é feita no próprio PJe)"],
        ["Procuração", "01 - Procuração (assinada pelo cliente)"],
        ...docsCli.map((n) => [/comprov|conta|fatura|endere/i.test(n) ? "Comprovante de residência" : /cpf|rg|cnh|ident/i.test(n) ? "Documento de identificação" : "Outros documentos", "Documentos do cliente/" + n]),
        ...(escolhidos.includes("hipossuficiencia") || $("kit-grat").checked ? [["Declaração de hipossuficiência", "Declaração de hipossuficiência (assinada)"]] : []),
        ["Outros documentos", "provas do caso (contratos, prints, laudos, protocolos)"]];
      const pedidos = [$("kit-grat").checked && "Justiça gratuita", $("kit-tutela").checked && "Tutela de urgência / liminar", $("kit-prior").checked && "Prioridade de tramitação", $("kit-segredo").checked && "Segredo de justiça"].filter(Boolean);
      pasta.file(n(i++, "Ficha de protocolo PJe.txt"),
`FICHA DE PROTOCOLO — PJe
Use com a skill "protocolo-pje" no Claude Desktop (com o Claude in Chrome): "Protocole este kit no PJe".

TRIBUNAL / SISTEMA: ${$("kit-trib").value || "[escolher]"}
FORO / COMARCA: ${foro}
CLASSE PROCESSUAL: [confirmar na Tabela Processual Unificada do CNJ no próprio PJe]
ASSUNTO: [confirmar na TPU — ${reu ? "ação em face de " + reu : "conforme a petição"}]
VALOR DA CAUSA: ${$("kit-valor").value ? "R$ " + $("kit-valor").value : "[conforme a petição]"}
PEDIDOS NA AUTUAÇÃO: ${pedidos.join("; ") || "nenhum"}

POLO ATIVO
- ${p.nome} — ${p.tipo === "pj" ? "CNPJ" : "CPF"} ${p.doc}${p.end ? " — " + p.end : ""}
  Advogada: ${adv.nome} — OAB ${adv.oab}

POLO PASSIVO
- ${reu || "[réu]"} — [CPF/CNPJ do réu, se souber; o PJe permite buscar pelo nome]

ANEXOS (nesta ordem; tipo de documento no PJe → arquivo)
${anexos.map(([t, a], k) => `${k + 1}. ${t} → ${a}`).join("\n")}

REGRAS PARA O ROBÔ
- Preencher e anexar; NUNCA clicar em "Assinar" ou "Protocolar": parar e chamar a advogada.
- Nunca digitar PIN/senha do token ou do certificado.
- Se algum campo não bater com a ficha, parar e perguntar.
`);
    }
    for (const f of $("dz-input").files || []) pasta.folder("Documentos do cliente").file(f.name, f);
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `Kit - ${p.nome}.zip`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    $("kit-status").textContent = `Kit gerado com ${i - 1} arquivo(s).` + (window.PrecoAtual ? "" : " Calcule os honorários no passo 3 para a proposta e o contrato saírem com valores.");
    const c = clientes.find((x) => semAcento(x.nome) === semAcento(p.nome));
    if (c) { (c.hist ||= []).unshift({ em: new Date().toISOString(), o: "Kit da ação gerado" }); salvarCrm(); renderCrm(); }
  };

  camposModelo(); tipoParte(); listaClientes();
  window.__reais = reais; // usado nos testes
  window.DocGerador = { MODELOS, reais, adv: () => adv }; // usado pelo financeiro (recibo)
})();
