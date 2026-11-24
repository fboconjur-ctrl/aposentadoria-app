// Melhorias para informar o cliente (sem API paga, tudo roda no navegador):
// busca por palavras, link próprio por situação, compartilhar, ouvir o texto, glossário no texto,
// lista de documentos para enviar/imprimir, calculadora de prazo e modelos de requerimento.
(() => {
  const N = (t) => norm(String(t || ""));
  const fmt = (d) => d.toLocaleDateString("pt-BR");

  // ---------- Glossário: termos novos ----------
  Object.assign(GLOSSARIO, {
    "ctc": "Certidão de Tempo de Contribuição: documento emitido pelo órgão ou instituto de previdência do servidor que permite levar esse tempo para outro regime, como o INSS.",
    "contagem recíproca": "Soma do tempo de contribuição entre o regime do servidor público e o INSS, com compensação financeira entre eles.",
    "estágio probatório": "Período inicial (em regra, 3 anos) em que o servidor concursado é avaliado antes de ganhar estabilidade.",
    "reposição ao erário": "Devolução, pelo servidor, de valores que o órgão considera ter pago a mais.",
    "inidoneidade": "Punição que proíbe a empresa de licitar e contratar com toda a Administração Pública, por 3 a 6 anos.",
    "lai": "Lei de Acesso à Informação (Lei 12.527/2011): permite a qualquer pessoa pedir informações a órgãos públicos.",
    "rpps": "Regime Próprio de Previdência Social: a previdência dos servidores públicos efetivos.",
    "rgps": "Regime Geral de Previdência Social: a previdência administrada pelo INSS.",
    "decadência": "Perda do direito por não ter sido exercido dentro do prazo legal.",
    "prescrição": "Perda do direito de cobrar na Justiça por ter passado o prazo legal.",
  });

  // ---------- Revisão da advogada (data em que revisou a situação inteira) ----------
  ["estagio-probatorio", "demissao-servidor", "acumulacao-cargos", "remocao", "progressao-servidor", "insalubridade-servidor", "desvio-funcao", "reposicao-erario", "questao-concurso", "requisitos-concurso", "investigacao-social", "posse-nomeacao", "pcd-concurso", "processo-administrativo", "sancao-licitante", "reequilibrio-contrato", "sancao-administrativa", "alteracao-nome", "retificacao-registro", "reconhecer-filho", "emancipacao"]
    .forEach((id) => (ROTEIROS_REVISADOS[id] ||= "2026-11-23"));

  // ---------- Onde cada situação mora (para abrir direto pelo link) ----------
  const PAI = { dividas: "consumidor", servicos: "consumidor", imovel: "cartorio", registro: "cartorio", servidor: "administrativo", autismo: "saude", concurso: "administrativo", licitacao: "administrativo", multas: "administrativo" };
  const areaDe = (id) => { for (const [k, l] of Object.entries(SITUACOES)) if (l.some((x) => x[1] === id)) return PAI[k] || k; return (FAQ.find((x) => x.id === id) || {}).area || null; };
  function abrir(id) {
    if (!ROTEIROS[id] && !FAQ.find((x) => x.id === id)) return false;
    const txt = titulo(id), area = areaDe(id);
    const f = FAQ.find((x) => x.id === id) || { id, q: txt, area, sources: [] };
    Object.assign(state, { text: "", answers: [], key: area, flow: FLOWS[area], followSummary: null, faqId: id, assunto: null, analise: null });
    answerQuestion(txt, f);
    return true;
  }
  window.abrirSituacao = abrir;

  // ---------- Prazos com cálculo (só regras gerais e bem estabelecidas) ----------
  const MS = { dias: 120, uteis: false, rotulo: "Mandado de segurança: 120 dias da ciência do ato (Lei 12.016/2009, art. 23)", pergunta: "Quando você foi comunicado(a) do ato (resultado, eliminação, publicação)?" };
  const PRAZO = {
    indeferido: { dias: 30, uteis: false, rotulo: "Recurso ao Conselho de Recursos (CRPS): 30 dias da ciência da decisão", pergunta: "Quando você foi avisado(a) da decisão do INSS?" },
    "processo-administrativo": { dias: 10, uteis: false, rotulo: "Recurso administrativo federal: 10 dias da ciência (Lei 9.784/1999, art. 59)", pergunta: "Quando você teve ciência da decisão?" },
    "pad-prazo": { dias: 10, uteis: false, rotulo: "Defesa escrita no PAD federal: 10 dias da citação (Lei 8.112/1990, art. 161, §1º)", pergunta: "Quando você foi citado(a) para a defesa?" },
    "sancao-licitante": { dias: 15, uteis: true, rotulo: "Defesa ou recurso da empresa: 15 dias úteis (Lei 14.133/2021, arts. 158 e 166)", pergunta: "Quando a empresa foi intimada?" },
    "licitacao-recurso": { dias: 3, uteis: true, rotulo: "Razões do recurso em licitação: 3 dias úteis (Lei 14.133/2021, art. 165)", pergunta: "Quando foi a intimação ou a lavratura da ata?" },
  };
  ["concurso-vagas", "concurso-eliminacao", "questao-concurso", "requisitos-concurso", "investigacao-social", "heteroidentificacao", "pcd-concurso", "posse-nomeacao"].forEach((id) => (PRAZO[id] = MS));
  // Conta a partir do dia seguinte; se terminar em fim de semana, passa para o próximo dia útil. Feriados não entram.
  function dataLimite(inicio, { dias, uteis }) {
    const d = new Date(inicio.getTime()); const util = (x) => x.getDay() !== 0 && x.getDay() !== 6;
    if (uteis) { let n = 0; while (n < dias) { d.setDate(d.getDate() + 1); if (util(d)) n++; } }
    else { d.setDate(d.getDate() + dias); while (!util(d)) d.setDate(d.getDate() + 1); }
    return d;
  }

  // ---------- Modelos de requerimento ----------
  const MODELOS = {
    "vista": { titulo: "Pedido de vista e cópia de processo administrativo", texto: `Ao(À) [ÓRGÃO OU AUTORIDADE]\n\nRef.: Processo administrativo nº [NÚMERO]\n\n[SEU NOME COMPLETO], [CPF], [ENDEREÇO], interessado(a) no processo acima, vem requerer, com base no art. 3º, II, e no art. 46 da Lei 9.784/1999 (ou na lei de processo administrativo do seu estado ou município), vista dos autos e cópia integral do processo, inclusive de documentos, pareceres e decisões.\n\nPede que as cópias sejam fornecidas em meio digital, quando possível.\n\n[CIDADE], [DATA].\n\n[ASSINATURA]` },
    "lai": { titulo: "Pedido de acesso à informação (LAI)", texto: `Ao Serviço de Informação ao Cidadão (SIC) do(a) [ÓRGÃO]\n\n[SEU NOME COMPLETO], [CPF ou documento], [E-MAIL], com base nos arts. 10 e 11 da Lei 12.527/2011 (Lei de Acesso à Informação), solicita as seguintes informações:\n\n1. [DESCREVA DE FORMA CLARA A INFORMAÇÃO OU O DOCUMENTO]\n2. [SE HOUVER, OUTRO ITEM]\n\nSolicita que a resposta seja enviada para o e-mail acima. A lei prevê resposta em até 20 dias, prorrogáveis por mais 10 com justificativa.\n\n[CIDADE], [DATA].\n\n[ASSINATURA]` },
    "ctc": { titulo: "Pedido de Certidão de Tempo de Contribuição (CTC)", texto: `Ao setor de gestão de pessoas / instituto de previdência do(a) [ÓRGÃO]\n\n[SEU NOME COMPLETO], [CPF], ex-ocupante do cargo de [CARGO], matrícula [NÚMERO], no período de [DATA DE INÍCIO] a [DATA DE SAÍDA], vem requerer a emissão de Certidão de Tempo de Contribuição, acompanhada da relação das remunerações de contribuição, para fins de contagem recíproca no Regime Geral de Previdência Social (Constituição, art. 201, §9º).\n\n[CIDADE], [DATA].\n\n[ASSINATURA]` },
    "certidao": { titulo: "Pedido de certidão ou de ficha funcional", texto: `Ao(À) [ÓRGÃO OU SETOR DE PESSOAL]\n\n[SEU NOME COMPLETO], [CPF], [CARGO E MATRÍCULA, se for servidor(a)], vem requerer, com base no art. 5º, XXXIV, "b", da Constituição e na Lei 9.051/1995, a expedição de certidão de [DESCREVA: ficha funcional, tempo de serviço, histórico de lotações, avaliações de desempenho etc.], para defesa de direitos e esclarecimento de situação pessoal.\n\nA Lei 9.051/1995 prevê a expedição em até 15 dias.\n\n[CIDADE], [DATA].\n\n[ASSINATURA]` },
  };
  const MODELO_DE = { "pad-prazo": "vista", "pad-prescricao": "vista", "processo-administrativo": "vista", "demissao-servidor": "vista", "reposicao-erario": "vista", "sancao-licitante": "vista", "auto-infracao": "vista", "sancao-administrativa": "vista", "estagio-probatorio": "vista", lai: "lai", "concurso-eliminacao": "lai", "questao-concurso": "lai", "investigacao-social": "lai", "tempo-servidor-inss": "ctc", "direitos-servidor": "certidao", "progressao-servidor": "certidao", "desvio-funcao": "certidao", "insalubridade-servidor": "certidao", "acumulacao-cargos": "certidao" };
  function abrirModelos(so) {
    let dlg = document.getElementById("dlg-modelos");
    if (!dlg) { dlg = document.createElement("dialog"); dlg.id = "dlg-modelos"; dlg.className = "dlg-modelos"; document.body.appendChild(dlg); }
    const lista = so ? [so] : Object.keys(MODELOS);
    dlg.innerHTML = `<div class="dlg-topo"><h2>📝 Modelos de requerimento</h2><button type="button" class="dlg-x" aria-label="Fechar">✕</button></div>
      <p class="small muted">Preencha os campos entre colchetes e protocole no órgão (presencialmente ou pelo sistema dele). São modelos simples, para pedidos que você mesmo(a) pode fazer. Para defesa, recurso ou ação, fale com a advogada.</p>
      ${lista.map((k) => `<details class="modelo"${so ? " open" : ""}><summary><b>${esc(MODELOS[k].titulo)}</b></summary><textarea rows="12">${esc(MODELOS[k].texto)}</textarea>
        <div class="modelo-acoes"><button type="button" class="btn-sec" data-copiar>Copiar texto</button><button type="button" class="btn-sec" data-imprimir>Imprimir</button></div></details>`).join("")}
      ${so ? `<p><a href="#" data-todos>Ver todos os modelos</a></p>` : ""}`;
    dlg.querySelector(".dlg-x").onclick = () => dlg.close();
    dlg.querySelector("[data-todos]")?.addEventListener("click", (e) => { e.preventDefault(); abrirModelos(); });
    dlg.querySelectorAll("[data-copiar]").forEach((b) => (b.onclick = async () => { const t = b.closest(".modelo").querySelector("textarea").value; try { await navigator.clipboard.writeText(t); b.textContent = "Copiado ✓"; } catch { b.closest(".modelo").querySelector("textarea").select(); } }));
    dlg.querySelectorAll("[data-imprimir]").forEach((b) => (b.onclick = () => imprimir(b.closest(".modelo").querySelector("summary").textContent, `<pre>${esc(b.closest(".modelo").querySelector("textarea").value)}</pre>`)));
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  }
  window.abrirModelos = abrirModelos;
  function imprimir(tit, corpo) {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(tit)}</title><style>body{font:12pt/1.6 Arial,sans-serif;margin:24mm;color:#111}pre{white-space:pre-wrap;font:inherit}h1{font-size:15pt}li{margin:6px 0}.rod{margin-top:30px;font-size:9pt;color:#666}</style></head><body><h1>${esc(tit)}</h1>${corpo}<p class="rod">Plataforma do Direito · plataformadodireito.com.br</p></body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
  }

  // ---------- Ouvir o texto ----------
  let falando = false;
  function ouvir(btn) {
    const sy = window.speechSynthesis; if (!sy) return;
    if (falando) { sy.cancel(); falando = false; btn.textContent = "🔊 Ouvir"; return; }
    const r = $("result"), partes = [r.querySelector("h1")?.textContent, r.querySelector(".lead")?.textContent, ...[...r.querySelectorAll(".rt-essencial li, .rt-alerta, #c-passos li")].map((x) => x.textContent)].filter(Boolean);
    const u = new SpeechSynthesisUtterance(partes.join(". ").replace(/\s+/g, " "));
    u.lang = "pt-BR"; u.rate = 0.95;
    const voz = sy.getVoices().find((v) => /pt[-_]BR/i.test(v.lang)); if (voz) u.voice = voz;
    u.onend = u.onerror = () => { falando = false; btn.textContent = "🔊 Ouvir"; };
    sy.cancel(); sy.speak(u); falando = true; btn.textContent = "⏹️ Parar";
  }

  // ---------- Glossário dentro do texto ----------
  function marcarGlossario(raiz) {
    const termos = Object.keys(GLOSSARIO).filter((t) => t.length >= 3).sort((a, b) => b.length - a.length);
    const usados = new Set();
    const alvos = raiz.querySelectorAll(".lead, .rt-essencial li, .camada-corpo li, .camada-corpo p");
    alvos.forEach((el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nos = []; while (w.nextNode()) nos.push(w.currentNode);
      nos.forEach((no) => {
        if (no.parentElement.closest("button, a, summary, .gl")) return;
        for (const t of termos) {
          if (usados.has(t)) continue;
          const sigla = t.length <= 4 && !t.includes(" ");
          const alvo = (sigla ? t.toUpperCase() : t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const m = no.data.match(new RegExp(`(^|[^\\p{L}])(${alvo})(?![\\p{L}])`, sigla ? "u" : "iu"));
          if (!m) continue;
          const ini = m.index + m[1].length, fim = ini + m[2].length;
          const depois = no.splitText(ini); depois.splitText(fim - ini);
          const b = document.createElement("button"); b.type = "button"; b.className = "gl"; b.textContent = depois.data; b.dataset.gl = t; b.title = "Toque para ver o que significa";
          depois.replaceWith(b); usados.add(t); break;
        }
      });
    });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".gl"); if (!b) return;
    const ja = b.nextElementSibling?.classList.contains("gl-def");
    document.querySelectorAll(".gl-def").forEach((x) => x.remove());
    if (ja) return;
    const s = document.createElement("span"); s.className = "gl-def"; s.textContent = GLOSSARIO[b.dataset.gl]; b.after(s);
  });

  // ---------- Depois de montar a situação: link, barra de ferramentas, prazo, documentos e modelo ----------
  const orig = window.mostrarRoteiro;
  window.mostrarRoteiro = function (f, R, text, an) {
    orig.apply(this, arguments);
    try { extras(f, R); } catch (e) { console.warn(e); }
  };
  function linkDe(id) { return `${location.origin}${location.pathname}?s=${encodeURIComponent(id)}`; }
  function extras(f, R) {
    const r = $("result"), id = f.id;
    if (ROTEIROS[id]) {
      // Entrada nova no histórico: o "voltar" do celular volta para onde a pessoa estava.
      const novo = `?s=${encodeURIComponent(id)}`;
      if (window.__voltando) window.__voltando = false;
      else if (location.search !== novo) history.pushState({ s: id }, "", novo);
      document.title = `${titulo(id)} · Plataforma do Direito`;
    }
    const docs = publico(R.docs);
    const barra = document.createElement("div"); barra.className = "rt-ferramentas";
    barra.innerHTML = `${window.speechSynthesis ? `<button type="button" data-ouvir>🔊 Ouvir</button>` : ""}<button type="button" data-compartilhar>🔗 Enviar esta página</button>${docs.length ? `<button type="button" data-docs>📋 Lista de documentos</button>` : ""}${MODELO_DE[id] ? `<button type="button" data-modelo>📝 Modelo de requerimento</button>` : ""}`;
    r.querySelector(".rt-atalho")?.after(barra);
    barra.querySelector("[data-ouvir]")?.addEventListener("click", (e) => ouvir(e.currentTarget));
    barra.querySelector("[data-compartilhar]").onclick = async () => {
      const url = linkDe(id), tit = titulo(id);
      if (navigator.share) { try { await navigator.share({ title: tit, text: `${tit} — explicado em linguagem simples:`, url }); return; } catch {} }
      window.open(`https://wa.me/?text=${encodeURIComponent(`${tit} — explicado em linguagem simples: ${url}`)}`, "_blank", "noopener");
    };
    barra.querySelector("[data-docs]")?.addEventListener("click", () => {
      const d = $("c-docs"); if (d) { d.open = true; d.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    barra.querySelector("[data-modelo]")?.addEventListener("click", () => abrirModelos(MODELO_DE[id]));
    // Ações dentro da camada de documentos
    const corpoDocs = $("c-docs")?.querySelector(".camada-corpo");
    if (corpoDocs && docs.length) {
      const ac = document.createElement("div"); ac.className = "modelo-acoes";
      ac.innerHTML = `<button type="button" class="btn-sec" data-docs-wa>Mandar a lista para meu WhatsApp</button><button type="button" class="btn-sec" data-docs-print>Imprimir a lista</button>`;
      corpoDocs.appendChild(ac);
      const texto = () => `Documentos para separar — ${titulo(id)}:\n` + [...corpoDocs.querySelectorAll(".rt-check li")].map((li) => `${li.querySelector("input").checked ? "✅" : "⬜"} ${li.textContent.trim()}`).join("\n");
      ac.querySelector("[data-docs-wa]").onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(texto() + `\n\nMais informações: ${linkDe(id)}`)}`, "_blank", "noopener");
      ac.querySelector("[data-docs-print]").onclick = () => imprimir(`Documentos para separar: ${titulo(id)}`, `<ul>${docs.map((x) => `<li>☐ ${esc(x)}</li>`).join("")}</ul>`);
    }
    // Calculadora de prazo
    const P = PRAZO[id];
    if (P) {
      const box = document.createElement("section"); box.className = "card rt-prazo";
      box.innerHTML = `<h2>⏰ Calcule o seu prazo</h2><p class="small muted">${esc(P.rotulo)}.</p>
        <label>${esc(P.pergunta)}<input type="date" data-prazo-ini max="${new Date().toISOString().slice(0, 10)}"></label><p data-prazo-res class="rt-prazo-res" hidden></p>`;
      (r.querySelector(".rt-urgente-box") || r.querySelector(".rt-essencial"))?.after(box);
      box.querySelector("[data-prazo-ini]").onchange = (e) => {
        const v = e.target.value, out = box.querySelector("[data-prazo-res]"); if (!v) { out.hidden = true; return; }
        const lim = dataLimite(new Date(v + "T12:00:00"), P), hoje = new Date(); hoje.setHours(12, 0, 0, 0);
        const falta = Math.round((lim - hoje) / 864e5);
        out.hidden = false;
        out.innerHTML = falta < 0 ? `O prazo estimado terminou em <b>${fmt(lim)}</b>. Mesmo assim, fale com a advogada: pode haver outros caminhos.`
          : `Data-limite estimada: <b>${fmt(lim)}</b> (${falta === 0 ? "é hoje!" : `faltam ${falta} dia${falta === 1 ? "" : "s"}`}). ${falta <= 7 ? "<b>O prazo está curto: procure a advogada agora.</b>" : ""}<br><span class="small muted">Cálculo aproximado: não considera feriados, suspensões nem regras do seu estado ou município. Confirme com a advogada.</span>`;
      };
    }
    marcarGlossario(r);
  }

  // ---------- Voltar à página inicial limpa o link ----------
  const goOrig = window.go;
  window.go = function (view) {
    goOrig.apply(this, arguments);
    if (view === "home" && location.search) { history.replaceState(null, "", location.pathname); document.title = "Plataforma do Direito"; }
  };

  // ---------- Busca por palavras ----------
  const PARADA = new Set("a o as os de da do das dos e em no na nos nas um uma uns umas para por com sem que meu minha meus minhas me mim eu ele ela isso esse essa este esta foi ser ter tem estou esta sou nao sim mais muito como qual quais quando onde porque pra pro ao aos se ja ou".split(" "));
  const tokens = (t) => N(t).split(/[^a-z0-9]+/).filter((x) => x.length > 2 && !PARADA.has(x));
  let indice = null;
  // Palavras equivalentes: a busca procura também pelo sinônimo.
  const EQUIV = { medicamento: ["remedio"], medicamentos: ["remedio"], remedio: ["medicamento"], remedios: ["medicamento"], farmaco: ["remedio", "medicamento"], caro: ["alto custo"], custo: ["caro"], demitido: ["demissao", "rescisao"], aposentar: ["aposentadoria"], morreu: ["faleceu", "falecimento"], faleceu: ["falecimento", "morte"], servidora: ["servidor"], concursado: ["concurso"], empregada: ["trabalho"], patrao: ["empresa", "empregador"] };
  function montarIndice() {
    const cat = catalogo(); indice = [];
    Object.entries(cat).forEach(([id, tit]) => {
      const R = ROTEIROS[id]; if (!R) return;
      const duv = DUVIDAS_CASOS[id] || [];
      const tudo = [R.acolhe, ...(R.lei || []), ...(R.juris || []), ...(R.passos || []), ...(R.docs || []), ...(R.prazos || []), ...(R.explica?.itens || []), ...duv.flat()].join(" ");
      indice.push({ id, tit, t: N(tit), q: N(duv.map((x) => x[0]).join(" ")), pl: (PISTAS[id] || []).map(N), p: N((PISTAS[id] || []).join(" ")), a: N(R.acolhe || ""), x: N(tudo) });
    });
  }
  function buscar(q) {
    if (!indice) montarIndice();
    const nq = N(q).trim();
    let tk = tokens(q); if (!tk.length) return [];
    tk = [...new Set(tk.flatMap((k) => [k, ...(EQUIV[k] || []).flatMap(tokens)]))];
    const raiz = (k) => (k.length > 5 ? k.slice(0, -2) : k);
    const total = indice.length;
    // Palavras que aparecem em quase tudo (ex.: "custo", "prazo") valem pouco; as raras valem muito.
    const peso = {}; tk.forEach((k) => { const r = raiz(k); const df = indice.filter((e) => e.x.includes(r) || e.t.includes(r) || e.p.includes(r)).length; peso[k] = df ? Math.log(1 + total / df) : 0; });
    const originais = tokens(q);
    const r = indice.map((e) => {
      let s = 0, cobre = 0;
      originais.forEach((k0) => {
        const grupo = [k0, ...(EQUIV[k0] || []).flatMap(tokens)];
        let melhor = 0;
        grupo.forEach((k) => { const rz = raiz(k), w = peso[k] || 0; const tem = (c) => (k.length <= 3 ? new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`).test(c) : c.includes(rz)); const v = tem(e.t) ? 4 * w : tem(e.p) ? 3.5 * w : tem(e.q) ? 2 * w : tem(e.a) ? 1.2 * w : tem(e.x) ? 0.6 * w : 0; melhor = Math.max(melhor, v); });
        if (melhor) cobre++; s += melhor;
      });
      // Frase reconhecida (ex.: "alto custo", "monjaro", "pensao por morte") pesa muito.
      e.pl.forEach((pp) => { if (pp.length >= 3 && new RegExp(`(^|\\W)${pp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${pp.length <= 4 ? "(\\W|$)" : ""}`).test(nq)) s += 6 + pp.length / 3; });
      if (nq.length >= 4 && e.t.includes(nq)) s += 6;
      s *= Math.pow(cobre / originais.length, 1.5);
      return [s, e];
    }).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]);
    if (!r.length) return [];
    const topo = r[0][0];
    return r.filter(([s]) => s >= Math.max(2, topo * 0.35)).slice(0, 6).map(([, e]) => e);
  }
  window.buscarSituacoes = buscar;
  const ancora = document.querySelector("#view-home .hero .eyebrow[style]") || document.getElementById("shortcuts");
  if (ancora) {
    const box = document.createElement("div"); box.className = "busca-box";
    box.innerHTML = `<label for="busca-q" class="eyebrow" style="margin-top:18px;display:block">Procure pelo seu problema</label>
      <input id="busca-q" type="search" placeholder="Ex.: INSS negou, PAD, plano negou cirurgia, golpe no Pix" autocomplete="off" enterkeyhint="search">
      <div id="busca-res" class="busca-res" aria-live="polite"></div>`;
    ancora.before(box);
    const inp = box.querySelector("#busca-q"), res = box.querySelector("#busca-res");
    let t;
    inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => {
      const q = inp.value.trim(); if (q.length < 3) { res.innerHTML = ""; return; }
      const r = buscar(q);
      res.innerHTML = (r.length ? r.map((e) => `<button type="button" data-ir="${esc(e.id)}">${esc(e.tit.replace(/\s*→$/, ""))}</button>`).join("") : `<p class="small muted">Não encontrei uma situação parecida.</p>`)
        + `<a href="#" class="busca-zap" data-wa>Não achei — falar com a advogada no WhatsApp</a>`;
      res.querySelectorAll("[data-ir]").forEach((b) => (b.onclick = () => abrir(b.dataset.ir)));
    }, 200); });
  }

  // ---------- Atalho para os modelos na página inicial ----------
  const guias = document.querySelectorAll("#view-home .guia-link");
  if (guias.length) {
    const a = document.createElement("a"); a.href = "#"; a.className = "guia-link"; a.textContent = "📝 Modelos de requerimento grátis: vista de processo, Lei de Acesso à Informação, CTC e certidões";
    a.onclick = (e) => { e.preventDefault(); abrirModelos(); };
    guias[guias.length - 1].after(a);
  }

  // ---------- Abrir direto pelo link (?s=situacao) ----------
  const s = new URLSearchParams(location.search).get("s");
  // Espera os outros scripts (melhorias2.js) terminarem de se ligar antes de abrir.
  if (s) setTimeout(() => { window.__voltando = true; if (!abrir(s)) { window.__voltando = false; history.replaceState(null, "", location.pathname); } }, 0);
  // Botão "voltar" do navegador/celular.
  addEventListener("popstate", () => {
    const id = new URLSearchParams(location.search).get("s");
    if (id) { window.__voltando = true; abrir(id); } else goOrig("home");
  });

  // ---------- Letra maior (fica lembrado neste aparelho) ----------
  const nav = document.querySelector(".topbar nav");
  if (nav) {
    const b = document.createElement("button"); b.type = "button"; b.className = "btn-letra"; b.textContent = "A+"; b.title = "Aumentar o tamanho da letra"; b.setAttribute("aria-label", "Aumentar o tamanho da letra");
    const aplicar = (on) => { document.documentElement.classList.toggle("letra-grande", on); b.textContent = on ? "A−" : "A+"; b.setAttribute("aria-pressed", on); };
    let on = false; try { on = localStorage.getItem("pd-letra") === "1"; } catch {}
    aplicar(on);
    b.onclick = () => { on = !on; aplicar(on); try { localStorage.setItem("pd-letra", on ? "1" : "0"); } catch {} };
    nav.prepend(b);
  }
})();
