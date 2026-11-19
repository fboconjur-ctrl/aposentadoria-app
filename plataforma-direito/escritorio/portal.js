// Área do cliente: link secreto por cliente. O painel publica um resumo do caso (etapa, próximos passos,
// documentos que faltam, processos explicados, agenda, pagamentos e recados) e traz de volta mensagens e documentos.
(() => {
  const SITE = "https://plataformadodireito.com.br/plataforma-direito/minha-area/";
  const link = (t) => `${SITE}#${t}`;
  const ETAPAS_CLI = [["Novo pedido", "Pedido recebido"], ["Consulta marcada", "Consulta"], ["Proposta enviada", "Proposta"], ["Contratado", "Início do trabalho"], ["Caso ativo", "Em andamento"], ["Encerrado", "Concluído"]];
  const PROXIMO = { "Novo pedido": "A advogada vai analisar o que você contou e entrar em contato para conversar.", "Consulta marcada": "Na consulta, a advogada vai entender os detalhes e explicar os caminhos possíveis.", "Proposta enviada": "Leia a proposta com calma. Se tiver dúvidas, mande uma mensagem aqui.", "Contratado": "Agora reunimos os documentos e preparamos as medidas do seu caso.", "Caso ativo": "Estamos acompanhando cada movimentação. Você será avisado(a) aqui sempre que houver novidade.", "Encerrado": "Seu caso foi concluído. Obrigada pela confiança!" };

  // Guia por área: como esse tipo de caso costuma andar (informativo, sem prometer resultado nem prazo).
  const GUIA = {
    "Previdenciário": { t: "Como funciona um caso no INSS", passos: ["Reunimos seus documentos e o extrato do CNIS (o histórico das suas contribuições).", "Fazemos o pedido ou o recurso no INSS, pelo Meu INSS. Se houver perícia, você é avisado(a) da data.", "O INSS analisa. Se negar, cabe recurso administrativo ou ação na Justiça Federal (muitas vezes no Juizado Especial Federal).", "Na Justiça, costuma haver perícia médica ou social e, ao final, sentença. Se ganhar, os atrasados são pagos por requisição (RPV ou precatório)."], tempo: "O INSS tem prazos legais, mas na prática a análise pode levar alguns meses. Na Justiça, o tempo varia muito de uma vara para outra." },
    "Saúde": { t: "Como funciona um caso contra plano de saúde ou SUS", passos: ["Reunimos o relatório médico, a negativa e o contrato do plano.", "Quando há urgência, pedimos ao juiz uma decisão rápida (liminar) para garantir o tratamento.", "O plano ou o ente público é citado e apresenta defesa.", "O juiz decide o caso na sentença; pode haver recurso."], tempo: "Pedidos urgentes costumam ser analisados em poucos dias. O processo inteiro pode levar meses." },
    "Consumidor": { t: "Como funciona um caso de consumidor", passos: ["Reunimos contrato, notas, faturas, protocolos e conversas com a empresa.", "Quando faz sentido, tentamos resolver antes (notificação, Procon ou consumidor.gov.br).", "Se não resolver, entramos com a ação, muitas vezes no Juizado Especial.", "Há uma audiência de conciliação. Sem acordo, o juiz decide."], tempo: "No Juizado, a primeira audiência costuma acontecer em algumas semanas ou meses, conforme a cidade." },
    "Administrativo": { t: "Como funciona um caso com órgão público", passos: ["Analisamos o ato do órgão (portaria, decisão, edital) e os prazos para reagir.", "Apresentamos defesa, recurso ou pedido ao próprio órgão, quando cabível.", "Se necessário, levamos o caso à Justiça, às vezes com pedido de liminar ou mandado de segurança.", "O órgão ou o juiz decide; pode haver recurso."], tempo: "Prazos administrativos costumam ser curtos (às vezes 5 a 15 dias), por isso agimos rápido." },
    "Trabalhista": { t: "Como funciona um caso trabalhista", passos: ["Reunimos documentos do contrato, contracheques e provas.", "Apresentamos a reclamação (ou a defesa) na Justiça do Trabalho.", "Há audiência, em geral com tentativa de acordo e, às vezes, depoimentos e testemunhas.", "O juiz decide na sentença; pode haver recurso ao Tribunal."], tempo: "O tempo varia conforme a vara e se houver recurso." },
    "Cartório/Extrajudicial": { t: "Como funciona um procedimento em cartório", passos: ["Reunimos certidões e documentos das pessoas e dos bens.", "Conferimos impostos e taxas (por exemplo, ITCD no inventário).", "Preparamos a minuta e agendamos a assinatura no cartório.", "Após a assinatura, fazemos os registros necessários."], tempo: "Quando há acordo e os documentos estão em ordem, costuma ser mais rápido que um processo judicial." },
  };
  const DUVIDAS = [
    ["Quanto tempo vai demorar?", "Depende do órgão ou da vara e de haver recurso. A advogada avisa aqui sempre que houver novidade, e você pode perguntar quando quiser."],
    ["Preciso ir ao fórum?", "Na maioria dos casos, não. Quando sua presença for necessária (por exemplo, numa audiência ou perícia), a data aparece na Agenda e você é avisado(a) antes."],
    ["Por que às vezes passa muito tempo sem novidade?", "Processos têm fases de espera (prazos da outra parte, fila do juiz ou do órgão). Mesmo sem novidade, o caso está sendo acompanhado."],
    ["Posso falar com a advogada?", "Sim. Mande uma mensagem por esta página ou pelo WhatsApp. As respostas vêm em horário comercial."],
    ["Meus dados estão seguros?", "Sim. Este link é pessoal e só você e a advogada têm acesso às informações do seu caso. Não compartilhe o link."],
  ];
  const GLOSSARIO = [[/intima/i, "Intimação", "aviso oficial de que algo aconteceu no processo ou de que alguém precisa fazer algo."], [/cita/i, "Citação", "aviso oficial à outra parte de que existe um processo contra ela."], [/senten/i, "Sentença", "a decisão do juiz que resolve o pedido."], [/despacho/i, "Despacho", "ordem do juiz para o processo andar (pedir um documento, marcar uma data…)."], [/decis/i, "Decisão", "o juiz decide um ponto do processo, às vezes de forma provisória."], [/ac[óo]rd/i, "Acórdão", "decisão de um tribunal, tomada por um grupo de juízes."], [/audi[êe]ncia|pauta/i, "Audiência", "encontro marcado pelo juiz, presencial ou online, com as partes."], [/recurso|apela/i, "Recurso", "pedido para que outro juiz ou tribunal revise a decisão."], [/per[íi]cia/i, "Perícia", "exame feito por um especialista nomeado pelo juiz."], [/embargos/i, "Embargos", "pedido ao juiz para esclarecer ou corrigir uma decisão."]];
  const AMIGAVEL = [[/^Novo caso registrado|^Pedido pela plataforma/, "Seu caso foi aberto"], [/^Etapa: (.*)/, "Etapa do caso atualizada"], [/^Petição gerada/, "Peça preparada pela advogada"], [/^Documentos? (organizados|enviado)/, "Documentos recebidos e organizados"], [/^Processo .* (vinculado|ligado)/, "Processo acompanhado"], [/^(WhatsApp|E-mail): (Primeiro contato|Confirmar consulta|Boas-vindas|Pedir documentos|Atualização|Informar andamento|Avisar|Lembrete de documento)/, "Contato com você"], [/^Mensagem pela área do cliente/, "Você enviou uma mensagem"], [/^Área do cliente criada/, "Sua área de acompanhamento foi criada"]];
  const feitos = (c) => { const vistos = new Set(); return (c.hist || []).map((h) => { const a = AMIGAVEL.find(([re]) => re.test(h.o)); return a ? { data: String(h.em).slice(0, 10), texto: a[1] } : null; }).filter((x) => x && !vistos.has(x.data + x.texto) && vistos.add(x.data + x.texto)).slice(0, 15); };

  function dadosDoCliente(c) {
    const a = window.DocGerador?.adv() || {}, ac = window.Acervo?.dados() || {};
    const idx = Math.max(0, ETAPAS_CLI.findIndex(([e]) => e === c.etapa));
    const d = {
      nome: primeiroNome(c.nome), area: c.area || "", assunto: c.assunto || "", etapa: ETAPAS_CLI[idx]?.[1] || c.etapa, etapas: ETAPAS_CLI.map(([, t]) => t), etapaIdx: idx,
      proximo: c.proximoCliente || PROXIMO[c.etapa] || "", recado: c.recado || "", advogada: a.nome ? nomeProprio(a.nome) : "", atualizado: new Date().toISOString(),
      precisamos: ["Contratado", "Caso ativo"].includes(c.etapa) ? (window.docsFaltando?.(c) || []) : [],
      agenda: itens.filter((x) => x.cli === c.id && x.tipo === "compromisso" && !x.feita && x.quando >= hojeIso).sort((x, y) => x.quando.localeCompare(y.quando)).slice(0, 8).map((x) => ({ quando: x.quando, hora: x.hora || "", texto: x.texto, local: x.local || "" })),
      processos: procsDe(c).map((n) => { const p = ac[n] || {}, mv = acomp[n]?.movs || []; return { numero: mascara(n), tribunal: p.trib || acomp[n]?.tribunal || "", classe: p.classe || acomp[n]?.classe || "", orgao: p.orgao || acomp[n]?.orgao || "",
        eventos: [...(p.pubs || []).slice(0, 6).map((x) => ({ data: x.data, titulo: x.tipo, explicacao: window.Acervo?.explicar(x.tipo, x.texto) || "" })), ...mv.slice(0, 4).map((m) => ({ data: String(m.data).slice(0, 10), titulo: m.nome, explicacao: "" }))].sort((x, y) => y.data.localeCompare(x.data)).slice(0, 8) }; }),
      pagamentos: fin.filter((l) => l.cli === c.id && l.tipo === "receita").sort((x, y) => x.venc.localeCompare(y.venc)).map((l) => ({ desc: l.desc, parcela: l.parcela || "", valor: l.valor, venc: l.venc, pago: l.pago || "" })),
      documentosRecebidos: [...(c.docsRecebidos || []), ...(c.docsPedido || [])].slice(-20).map((d) => d.nome),
      docsStatus: ["Contratado", "Caso ativo"].includes(c.etapa) ? (window.docsStatus?.(c) || []) : [],
      feitos: feitos(c), guia: GUIA[c.area] || null, duvidas: DUVIDAS,
      contato: { horario: "Segunda a sexta, das 9h às 18h", resposta: "Respondemos em até 1 dia útil." },
    };
    const textoProc = JSON.stringify(d.processos);
    d.glossario = GLOSSARIO.filter(([re]) => re.test(textoProc)).map(([, t, e]) => [t, e]);
    return d;
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
  // E-mail pelo Resend (função /api/email do site, só com login do painel).
  window.enviarEmail = async (para, assunto, texto) => {
    const t = await window.tokenPainel?.(); if (!t) throw new Error("Entre no painel com seu login.");
    const r = await fetch("/api/email", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${t}` }, body: JSON.stringify({ para, assunto, texto }) });
    const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.erro || `Erro ${r.status}`); return d;
  };
  window.botaoEmail = (idBotao, cli, assunto, getTexto, aoEnviar) => {
    const b = $(idBotao); if (!b) return;
    b.hidden = !cli?.email; b.onclick = async () => {
      if (!cli.email) return;
      b.disabled = true; const antes = b.textContent; b.textContent = "Enviando…";
      try { await enviarEmail(cli.email, assunto, getTexto()); b.textContent = "✅ E-mail enviado"; (cli.hist ||= []).unshift({ em: new Date().toISOString(), o: `E-mail: ${assunto}` }); salvarCrm(); aoEnviar?.(); }
      catch (e) { alert("Não foi possível enviar o e-mail: " + e.message); b.textContent = antes; }
      setTimeout(() => { b.disabled = false; b.textContent = antes; }, 4000);
    };
  };
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
