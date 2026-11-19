// Área do cliente: link secreto por cliente. O painel publica um resumo do caso (etapa, próximos passos,
// documentos que faltam, processos explicados, agenda, pagamentos e recados) e traz de volta mensagens e documentos.
(() => {
  const SITE = "https://plataformadodireito.com.br/plataforma-direito/minha-area/";
  const link = (t) => `${SITE}#${t}`;
  const ETAPAS_CLI = [["Novo pedido", "Pedido recebido"], ["Consulta marcada", "Consulta"], ["Proposta enviada", "Proposta"], ["Contratado", "Início do trabalho"], ["Caso ativo", "Em andamento"], ["Encerrado", "Concluído"]];
  const PROXIMO = { "Novo pedido": "A advogada vai analisar o que você contou e entrar em contato para conversar.", "Consulta marcada": "Na consulta, a advogada vai entender os detalhes e explicar os caminhos possíveis.", "Proposta enviada": "Leia a proposta com calma. Se tiver dúvidas, mande uma mensagem aqui.", "Contratado": "Agora reunimos os documentos e preparamos as medidas do seu caso.", "Caso ativo": "Seu caso está em andamento. Você será avisado(a) aqui sempre que houver novidade.", "Encerrado": "Seu caso foi concluído. Obrigada pela confiança!" };

  function dadosDoCliente(c) {
    const a = window.DocGerador?.adv() || {}, ac = window.Acervo?.dados() || {};
    const idx = Math.max(0, ETAPAS_CLI.findIndex(([e]) => e === c.etapa));
    return {
      nome: primeiroNome(c.nome), area: c.area || "", assunto: c.assunto || "", etapa: ETAPAS_CLI[idx]?.[1] || c.etapa, etapas: ETAPAS_CLI.map(([, t]) => t), etapaIdx: idx,
      proximo: c.proximoCliente || PROXIMO[c.etapa] || "", recado: c.recado || "", advogada: a.nome ? nomeProprio(a.nome) : "", atualizado: new Date().toISOString(),
      precisamos: ["Contratado", "Caso ativo"].includes(c.etapa) ? (window.docsFaltando?.(c) || []) : [],
      agenda: itens.filter((x) => x.cli === c.id && x.tipo === "compromisso" && !x.feita && x.quando >= hojeIso).sort((x, y) => x.quando.localeCompare(y.quando)).slice(0, 8).map((x) => ({ quando: x.quando, hora: x.hora || "", texto: x.texto, local: x.local || "" })),
      processos: procsDe(c).map((n) => { const p = ac[n] || {}, mv = acomp[n]?.movs || []; return { numero: mascara(n), tribunal: p.trib || acomp[n]?.tribunal || "", classe: p.classe || acomp[n]?.classe || "", orgao: p.orgao || acomp[n]?.orgao || "",
        eventos: [...(p.pubs || []).slice(0, 6).map((x) => ({ data: x.data, titulo: x.tipo, explicacao: window.Acervo?.explicar(x.tipo, x.texto) || "" })), ...mv.slice(0, 4).map((m) => ({ data: String(m.data).slice(0, 10), titulo: m.nome, explicacao: "" }))].sort((x, y) => y.data.localeCompare(x.data)).slice(0, 8) }; }),
      pagamentos: fin.filter((l) => l.cli === c.id && l.tipo === "receita").sort((x, y) => x.venc.localeCompare(y.venc)).map((l) => ({ desc: l.desc, parcela: l.parcela || "", valor: l.valor, venc: l.venc, pago: l.pago || "" })),
      documentosRecebidos: [...(c.docsRecebidos || []), ...(c.docsPedido || [])].slice(-20).map((d) => d.nome),
    };
  }
  // Publica (só quando mudou) para todos os clientes com link ativo.
  const publicados = new Map(); let timer;
  const publicarTodos = () => { clearTimeout(timer); timer = setTimeout(async () => {
    if (!window.Portal) return;
    for (const c of clientes.filter((x) => x.portal?.token && x.portal.ativo !== false)) {
      const d = dadosDoCliente(c), { atualizado, ...semData } = d, pk = JSON.stringify(semData);
      if (publicados.get(c.portal.token) === pk) continue;
      try { await Portal.publicar(c.portal.token, d); publicados.set(c.portal.token, pk); } catch {}
    }
  }, 2000); };
  const setOrig = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) { setOrig.call(this, k, v); if (this === localStorage && /^pd-(crm|itens|financeiro|acervo|adv)$/.test(k)) publicarTodos(); };

  // Mensagens e documentos que chegam da área do cliente.
  let ultimasMsgs = [];
  async function puxar() {
    if (!window.Portal) return;
    const msgs = await Portal.msgs(); ultimasMsgs = msgs;
    let mudou = false;
    for (const c of clientes.filter((x) => x.portal?.token)) {
      const minhas = msgs.filter((m) => m.token === c.portal.token);
      for (const m of minhas) if (!(c.msgsPortal ||= []).some((x) => x.id === m.id)) { c.msgsPortal.unshift({ id: m.id, texto: m.texto, em: m.criado }); (c.hist ||= []).unshift({ em: m.criado, o: `Mensagem pela área do cliente: ${m.texto.slice(0, 80)}` }); mudou = true; }
      const docs = await Portal.docs(c.portal.token).catch(() => []);
      for (const d of docs) if (!(c.docsPedido ||= []).some((x) => x.caminho === d.caminho)) { c.docsPedido.push(d); (c.hist ||= []).unshift({ em: d.em || new Date().toISOString(), o: `Documento enviado pela área do cliente: ${d.nome}` }); mudou = true; }
    }
    if (mudou) { salvarCrm(); renderTudo(); }
  }
  window.msgsPortalNaoLidas = () => ultimasMsgs.filter((m) => !m.lida);

  // Quadro na ficha.
  function render() {
    const c = cliPorId(fichaAtual), box = $("fi-portal"); if (!c || !box) return;
    const p = c.portal, naoLidas = ultimasMsgs.filter((m) => !m.lida && m.token === p?.token);
    $("fi-portal-corpo").innerHTML = !window.Portal ? `<p class="small muted">Disponível com o login do painel.</p>`
      : !p ? `<p class="small">O cliente acompanha o caso por um link pessoal: etapa, próximos passos, documentos que faltam, processos explicados, agenda e pagamentos. Ele também pode mandar mensagens e documentos.</p><button class="btn" id="fi-portal-criar">🔗 Criar a área deste cliente</button>`
      : `<div class="as-linha"><code class="small" style="word-break:break-all">${esc(link(p.token))}</code></div>
        <div class="as-linha"><button class="wa-btn" id="fi-portal-wa">Enviar link pelo WhatsApp</button><button class="back" id="fi-portal-copiar">Copiar link</button><a class="back" href="${esc(link(p.token))}" target="_blank" rel="noopener">Ver como o cliente vê</a><button class="linkish small" id="fi-portal-desligar">${p.ativo === false ? "reativar link" : "desativar link"}</button></div>
        <p class="small muted">${p.ativo === false ? "⛔ Link desativado: o cliente não consegue abrir." : p.visto ? `Última visita do cliente: ${new Date(p.visto).toLocaleString("pt-BR")}` : "O cliente ainda não abriu."}</p>
        <label class="small">Recado para o cliente (aparece no topo da área dele)<textarea id="fi-portal-recado" class="search" rows="2" style="width:100%;box-sizing:border-box">${esc(c.recado || "")}</textarea></label>
        <label class="small">Próximo passo (se vazio, usa o texto padrão da etapa)<input id="fi-portal-prox" class="search" style="width:100%;box-sizing:border-box" value="${esc(c.proximoCliente || "")}" placeholder="${esc(PROXIMO[c.etapa] || "")}"></label>
        ${(c.msgsPortal || []).length ? `<h3 class="small">Mensagens do cliente ${naoLidas.length ? `<span class="pill-s amber">${naoLidas.length} nova(s)</span>` : ""}</h3><ul class="list small">${c.msgsPortal.slice(0, 10).map((m) => `<li><span class="when">${new Date(m.em).toLocaleString("pt-BR")}</span><span>${esc(m.texto)}</span></li>`).join("")}</ul>${naoLidas.length ? `<button class="linkish small" id="fi-portal-lidas">marcar como lidas</button>` : ""}` : ""}`;
    $("fi-portal-criar")?.addEventListener("click", async () => { try { const t = await Portal.criar(c.id); c.portal = { token: t, ativo: true }; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: "Área do cliente criada" }); salvarCrm(); publicarTodos(); render(); } catch (e) { alert("Não consegui criar: " + e.message); } });
    $("fi-portal-copiar")?.addEventListener("click", () => navigator.clipboard?.writeText(link(p.token)));
    $("fi-portal-wa")?.addEventListener("click", () => { if (!telWa(c.tel)) return alert("Cadastre o WhatsApp do cliente em “Editar dados”."); open(`https://wa.me/${telWa(c.tel)}?text=${encodeURIComponent(`Olá, ${primeiroNome(c.nome)}! Criei uma área só sua para acompanhar o seu caso: em que etapa está, próximos passos, documentos que faltam e novidades do processo. Por ali você também pode me mandar mensagens e documentos.\n\n${link(p.token)}\n\nGuarde este link: ele é pessoal.`)}`, "_blank", "noopener"); (c.hist ||= []).unshift({ em: new Date().toISOString(), o: "WhatsApp: link da área do cliente" }); salvarCrm(); });
    $("fi-portal-desligar")?.addEventListener("click", async () => { const ativo = p.ativo === false; if (!ativo && !confirm("Desativar o link? O cliente deixa de conseguir abrir a área.")) return; await Portal.ativar(p.token, ativo); p.ativo = ativo; salvarCrm(); render(); });
    $("fi-portal-recado")?.addEventListener("change", (e) => { c.recado = e.target.value.trim(); salvarCrm(); });
    $("fi-portal-prox")?.addEventListener("change", (e) => { c.proximoCliente = e.target.value.trim(); salvarCrm(); });
    $("fi-portal-lidas")?.addEventListener("click", async () => { await Portal.marcarLidas(naoLidas.map((m) => m.id)); naoLidas.forEach((m) => (m.lida = true)); render(); renderHoje(); });
  }
  const orig = window.renderOnb;
  window.renderOnb = (...a) => { orig?.(...a); render(); };
  // começa quando o login estiver pronto
  const esperar = setInterval(() => { if (window.Portal) { clearInterval(esperar); Portal.info().then((inf) => { inf.forEach((i) => { const c = clientes.find((x) => x.id === i.cli_id); if (c) c.portal = { token: i.token, ativo: i.ativo, visto: i.visto }; }); }); puxar().then(publicarTodos); setInterval(puxar, 60000); } }, 1000);
})();
