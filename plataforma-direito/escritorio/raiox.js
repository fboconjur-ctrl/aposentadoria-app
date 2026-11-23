// Raio-x do cliente (CNPJ) e Licitações abertas compatíveis com as atividades da empresa.
// Fontes oficiais/públicas: Receita (via BrasilAPI) e PNCP. Só "pontos a verificar": nada é afirmado como direito.
(() => {
  const V = document.getElementById("v-raiox"); if (!V) return;
  const $q = (s) => V.querySelector(s);
  const FN = "https://apgrgbotrrhtxfhcjsgq.supabase.co/functions/v1/empresa";
  const KEY = "sb_publishable_DmfEqquL-n4VPBaTpbPumw_sSC6gmnW";
  const soNum = (t) => String(t || "").replace(/\D/g, "");
  const fmtCnpj = (c) => soNum(c).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  const br = (d) => (d ? String(d).slice(0, 10).split("-").reverse().join("/") : "");
  const reais = (v) => (v || v === 0 ? Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "");
  const anos = (d) => (d ? Math.floor((Date.now() - new Date(d)) / (365.25 * 864e5)) : null);
  const cnpjValido = (c) => {
    c = soNum(c); if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
    const dv = (n) => { let s = 0, p = n - 7; for (let i = 0; i < n; i++) { s += +c[i] * p--; if (p < 2) p = 9; } const r = s % 11; return r < 2 ? 0 : 11 - r; };
    return dv(12) === +c[12] && dv(13) === +c[13];
  };
  async function chamar(corpo) {
    const t = await window.tokenPainel?.(); if (!t) throw new Error("Entre no painel com seu login.");
    const r = await fetch(FN, { method: "POST", headers: { "content-type": "application/json", apikey: KEY, authorization: `Bearer ${t}` }, body: JSON.stringify(corpo) });
    const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.erro || `Erro ${r.status}`); return d;
  }
  // Palavras-chave a partir das atividades (CNAE): tira palavras vazias e fica com o núcleo.
  const VAZIAS = new Set("de da do das dos e em para com sem por a o as os ou não nao especificadas especificados anteriormente outras outros outro outra exceto inclusive serviços servicos serviço servico atividades atividade comércio comercio varejista atacadista fabricação fabricacao geral em geral".split(" "));
  const termosDe = (cnaes) => [...new Set(cnaes.map((c) => String(c.descricao || "").toLowerCase().replace(/[;,()]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !VAZIAS.has(w)).slice(0, 2).join(" ")).filter(Boolean))].slice(0, 6);
  let empresa = null;

  function pontos(d) {
    const p = [];
    const sit = String(d.situacao || "").toUpperCase();
    if (sit && sit !== "ATIVA") p.push(["🔴", `Situação cadastral: ${sit}${d.motivoSituacao && d.motivoSituacao !== "SEM MOTIVO" ? ` (${d.motivoSituacao})` : ""}`, "Verificar a causa e a regularização perante a Receita Federal. Empresa fora da situação ativa tem dificuldade para emitir notas, obter certidões e contratar com o poder público."]);
    if (d.situacaoEspecial) p.push(["🟠", `Situação especial: ${d.situacaoEspecial}`, "Verificar o que significa no caso (ex.: recuperação judicial, liquidação) e os efeitos para a empresa."]);
    if (d.mei) p.push(["🔵", "Optante pelo MEI", "Verificar se o faturamento e a atividade continuam dentro dos limites do MEI; se ultrapassou, avaliar o desenquadramento para evitar cobrança retroativa."]);
    else if (d.simples) p.push(["🔵", `Optante pelo Simples Nacional desde ${br(d.dataSimples)}`, "Verificar, com o contador, se há receitas com tributação concentrada (monofásica) ou com substituição tributária sendo tributadas de novo no Simples — se houver, pode existir valor pago a mais a recuperar. Conferir também se as atividades permitem o anexo mais favorável."]);
    else if (["ME", "MICRO EMPRESA", "EPP", "EMPRESA DE PEQUENO PORTE"].some((x) => String(d.porte || "").toUpperCase().includes(x))) p.push(["🟡", `Porte ${d.porte} fora do Simples`, "Verificar se a empresa poderia optar pelo Simples Nacional (e se foi excluída, por quê). A mudança de regime pode reduzir a carga tributária."]);
    if (d.exclusaoSimples && d.dataSimples && d.exclusaoSimples > d.dataSimples && !d.simples) p.push(["🟠", `Excluída do Simples em ${br(d.exclusaoSimples)}`, "Verificar o motivo da exclusão (débitos, atividade, faturamento). Exclusão por débito pode ser revertida com a regularização no prazo."]);
    const id = anos(d.abertura); if (id !== null && id < 2) p.push(["⚪", `Empresa aberta há ${id === 0 ? "menos de 1 ano" : "1 ano"}`, "Verificar se todas as inscrições estão em dia (estadual, municipal, alvarás)."]);
    if (!d.socios?.length) p.push(["⚪", "Sem sócios informados na base pública", "Normal para empresário individual e MEI; em sociedade, verificar o cadastro."]);
    p.push(["🧾", "Certidões e dívidas", "Conferir nos sites oficiais abaixo: certidão federal, FGTS, trabalhista e dívida ativa da União. Débito em dívida ativa pode ser negociado (transação/parcelamento) — avaliar caso a caso."]);
    return p;
  }

  function renderEmpresa(d) {
    const c = soNum(d.cnpj), cn = [d.cnae, ...(d.cnaes || [])];
    const links = [
      ["Certidão federal (Receita/PGFN)", "https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir"],
      ["Regularidade do FGTS (CRF)", "https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf"],
      ["Certidão trabalhista (CNDT)", "https://cndt-certidao.tst.jus.br/inicio.faces"],
      ["Dívida ativa da União (Regularize)", "https://www.regularize.pgfn.gov.br/"],
      ["Comprovante de inscrição (Receita)", "https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp"],
      ["Publicações em processos pelo nome (DJEN)", `https://comunica.pje.jus.br/consulta?nomeParte=${encodeURIComponent(d.razao || "")}`],
    ];
    $q("#rx-res").innerHTML = `
      <div class="fi-tit"><h2>${esc(d.razao || "")}</h2><span class="small muted">${fmtCnpj(c)}</span></div>
      <p class="small">${esc([d.fantasia, d.natureza, d.porte, d.matriz].filter(Boolean).join(" · "))}<br>
      ${esc([d.municipio, d.uf].filter(Boolean).join("/"))} · aberta em ${br(d.abertura)}${anos(d.abertura) !== null ? ` (${anos(d.abertura)} anos)` : ""} · capital ${reais(d.capital)}<br>
      Situação: <b>${esc(d.situacao || "")}</b> desde ${br(d.dataSituacao)} · Simples: <b>${d.simples ? "sim" : "não"}</b> · MEI: <b>${d.mei ? "sim" : "não"}</b></p>
      <h3>Pontos a verificar</h3><p class="small muted">Sugestões de análise a partir dos dados públicos. Não são conclusões: confirme com documentos e com o contador.</p>
      <ul class="list small">${pontos(d).map(([i, t, s]) => `<li><span class="ico">${i}</span><div><b>${esc(t)}</b><br>${esc(s)}</div></li>`).join("")}</ul>
      <h3>Atividades (CNAE)</h3><ul class="list small">${cn.filter((x) => x?.codigo).map((x, i) => `<li>${i === 0 ? "<b>Principal:</b> " : ""}${esc(String(x.codigo))} — ${esc(x.descricao || "")}</li>`).join("")}</ul>
      ${d.socios?.length ? `<h3>Sócios e administradores</h3><ul class="list small">${d.socios.map((s) => `<li>${esc(s.nome)} — ${esc(s.qualificacao || "")}${s.entrada ? ` (desde ${br(s.entrada)})` : ""}</li>`).join("")}</ul>` : ""}
      <h3>Consultas oficiais (abrem em nova aba; o CNPJ foi copiado)</h3>
      <div class="as-linha" style="flex-wrap:wrap">${links.map(([t, u]) => `<a class="back" href="${u}" target="_blank" rel="noopener" data-copiar="${c}">${esc(t)}</a>`).join("")}</div>
      <div class="as-linha"><button class="btn" type="button" id="rx-ir-lic">🏛️ Ver licitações abertas para estas atividades</button><button class="back" type="button" id="rx-salvar">Salvar resumo na ficha do cliente</button><span class="small muted" id="rx-salvo"></span></div>`;
    $q("#rx-termos").value = termosDe(cn).join("; ");
    $q("#rx-uf").value = d.uf || "";
  }

  // Tela
  V.addEventListener("click", async (e) => {
    const a = e.target.closest("[data-copiar]"); if (a) navigator.clipboard?.writeText(a.dataset.copiar);
    if (e.target.id === "rx-ir-lic") { $q("#rx-lic").scrollIntoView({ behavior: "smooth" }); buscarLic(); }
    if (e.target.id === "rx-salvar" && empresa) {
      const c = clientes.find((x) => x.id === $q("#rx-cli").value); if (!c) { $q("#rx-salvo").textContent = "Escolha o cliente acima."; return; }
      const txt = `Raio-x CNPJ ${fmtCnpj(empresa.cnpj)} (${new Date().toLocaleDateString("pt-BR")}): ${empresa.razao} · situação ${empresa.situacao} · Simples ${empresa.simples ? "sim" : "não"} · MEI ${empresa.mei ? "sim" : "não"}. Pontos: ${pontos(empresa).map((p) => p[1]).join("; ")}.`;
      c.notas = (c.notas ? c.notas + "\n\n" : "") + txt; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Raio-x do CNPJ ${fmtCnpj(empresa.cnpj)}` }); salvarCrm();
      $q("#rx-salvo").textContent = "✅ Salvo nas anotações do cliente.";
    }
  });
  $q("#rx-cli").addEventListener("focus", () => {
    const sel = $q("#rx-cli"), v = sel.value;
    sel.innerHTML = `<option value="">— sem cliente —</option>` + clientes.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); sel.value = v;
  });
  $q("#rx-cli").addEventListener("change", (e) => { const c = clientes.find((x) => x.id === e.target.value); const n = soNum(c?.cnpj || c?.cpf); if (n.length === 14) $q("#rx-cnpj").value = fmtCnpj(n); });
  $q("#rx-form").addEventListener("submit", async (e) => {
    e.preventDefault(); const st = $q("#rx-st"), c = soNum($q("#rx-cnpj").value);
    if (!cnpjValido(c)) { st.textContent = "CNPJ inválido. Confira os números."; return; }
    if (!$q("#rx-ok").checked) { st.textContent = "Marque a autorização do cliente para consultar."; return; }
    st.textContent = "Consultando a base pública da Receita…"; $q("#rx-res").innerHTML = "";
    try { empresa = await chamar({ acao: "cnpj", cnpj: c }); renderEmpresa(empresa); st.textContent = ""; }
    catch (er) { st.textContent = er.message; }
  });

  async function buscarLic() {
    const st = $q("#rx-lic-st"), termos = $q("#rx-termos").value.split(/[;\n]/).map((x) => x.trim()).filter(Boolean);
    if (!termos.length) { st.textContent = "Escreva ao menos uma palavra-chave (ex.: limpeza; construção; software)."; return; }
    st.textContent = "Buscando no Portal Nacional de Contratações Públicas (PNCP)… pode levar alguns segundos."; $q("#rx-lic-res").innerHTML = "";
    try {
      const d = await chamar({ acao: "licitacoes", termos, uf: $q("#rx-uf").value });
      const it = d.itens || [];
      st.textContent = `${it.length} licitação(ões) recebendo propostas${d.falhas?.length ? ` · o portal não respondeu para: ${d.falhas.join(", ")} (tente de novo)` : ""}.`;
      $q("#rx-lic-res").innerHTML = it.length ? it.slice(0, 80).map((x) => `<li><div><b>${esc(x.objeto || x.titulo)}</b><br>
        <span class="small">${esc(x.orgao || "")}${x.municipio ? ` · ${esc(x.municipio)}/${esc(x.uf)}` : ""} · ${esc(x.modalidade || "")}${x.valor ? ` · ${reais(x.valor)}` : ""}</span><br>
        <span class="small">Propostas até <b>${br(x.fim)}</b> · palavra: ${esc(x.termo)}</span></div>
        ${x.link ? `<a class="back" href="${esc(x.link)}" target="_blank" rel="noopener">Abrir edital</a>` : ""}</li>`).join("") : `<li class="small muted">Nada encontrado agora. Tente outras palavras ou outro estado.</li>`;
    } catch (er) { st.textContent = er.message; }
  }
  $q("#rx-lic").addEventListener("submit", (e) => { e.preventDefault(); buscarLic(); });
  window.RaioX = { termosDe, cnpjValido, pontos };
})();
