// Sugestões automáticas na tela Hoje: o painel olha publicações, prazos, compromissos, parcelas e contatos
// e monta a lista do que fazer, cada item com a ação pronta em um clique. "Dispensar" esconde de vez.
(() => {
  const FEITO_KEY = "pd-auto-feitos";
  let feitos = new Set(ler(FEITO_KEY, []));
  const marcar = (k) => { feitos.add(k); gravar(FEITO_KEY, [...feitos].slice(-2000)); render(); };
  const diasAte = (k) => Math.round((deIso(k) - hoje) / DAY);
  const ultimoContato = (c) => (c.hist || []).filter((h) => /WhatsApp/i.test(h.o)).map((h) => h.em).sort().pop();
  // Prazo escrito na publicação ("no prazo de 15 dias") ou ato típico conhecido.
  const ATOS = [[/contrarraz/i, 15, "Contrarrazões"], [/embargos de declara/i, 5, "Embargos de declaração"], [/r[ée]plica/i, 15, "Réplica"], [/especificar (as )?provas/i, 15, "Especificação de provas"], [/emend(a|ar) (a|à) (peti[cç][aã]o )?inicial/i, 15, "Emenda à inicial"], [/alega[cç][õo]es finais|memoriais/i, 15, "Alegações finais"]];
  function prazoDaPub(p) {
    const t = p.texto || "";
    const m = t.match(/prazo (?:comum |legal )?de (\d{1,3})\s*(?:\([^)]*\)\s*)?dias?(\s*[úu]teis)?/i);
    const ato = ATOS.find(([re]) => re.test(t));
    if (!m && !ato) return null;
    return { dias: m ? +m[1] : ato[1], prov: ato ? ato[2] : `Manifestação (${p.tipo})`, uteis: true };
  }
  function sugestoes() {
    const lista = [];
    const ac = window.Acervo?.dados() || {};
    const uf = (() => { try { return localStorage.getItem("pd-pz-uf") ?? "DF"; } catch { return "DF"; } })();
    for (const [n, a] of Object.entries(ac)) {
      if (a.arquivado) continue;
      const c = cliDoProc(n);
      for (const p of (a.pubs || []).filter((x) => diasAte(x.data) >= -20)) {
        // 1) prazo detectado na publicação
        const pz = prazoDaPub(p), kP = `prazo:${p.id}`;
        if (pz && !feitos.has(kP)) {
          const r = Prazos.calcular({ marco: p.data, tipoMarco: "disponibilizacao", dias: pz.dias, contagem: "uteis", uf });
          if (r.vencimento >= hojeIso) lista.push({ k: kP, ord: r.vencimento, pri: 0, ico: "⏰", tit: `${pz.prov}: vence ${fmt(deIso(r.vencimento))}`, sub: `${mascara(n)}${c ? ` · ${c.nome}` : ""} · ${pz.dias} dias úteis da publicação de ${brData(p.data)} (rascunho: confira)`, acao: "Lançar prazo", fazer: () => {
            itens.push({ id: novoId("I-"), tipo: "prazo", texto: `${pz.prov} (${pz.dias} dias úteis de ${brData(p.data)}) — ${mascara(n)}`, quando: r.vencimento, cli: c?.id || "", feita: false });
            const rev = r.alertas.find(([d]) => d === 3); if (rev && rev[1] >= hojeIso) itens.push({ id: novoId("I-"), tipo: "tarefa", texto: `Revisar e protocolar: ${pz.prov} — ${mascara(n)}`, quando: rev[1], cli: c?.id || "", feita: false });
            salvarItens(); marcar(kP); renderHoje(); } });
        }
        // 2) cliente a avisar sobre a novidade
        const kA = `aviso:${p.id}`;
        if (c && !feitos.has(kA) && !(ultimoContato(c) > p.data)) lista.push({ k: kA, ord: p.data, pri: 3, ico: "💬", tit: `Avisar ${primeiroNome(c.nome)}: ${p.tipo} de ${brData(p.data)}`, sub: mascara(n), acao: "Escrever aviso", fazer: () => { marcar(kA); window.Acervo.abrirMsg(n, "Informar andamento"); } });
      }
    }
    for (const c of clientes) {
      const tel = telWa(c.tel);
      // 3) parcelas: lembrete (vence em até 3 dias) e cobrança (atrasada)
      for (const l of fin.filter((x) => x.cli === c.id && x.tipo === "receita" && !x.pago)) {
        const d = diasAte(l.venc), atras = d < 0, k = `fin:${l.id}:${atras ? "atraso" : "lembrete"}`;
        if (feitos.has(k) || d > 3 || !tel) continue;
        const txt = atras ? `Olá, ${primeiroNome(c.nome)}, tudo bem? Consta em aberto ${l.parcela ? `a parcela ${l.parcela} dos honorários` : "o pagamento dos honorários"} (${reaisBR(l.valor)}), vencida em ${fmt(deIso(l.venc))}. Pode me confirmar quando consegue pagar? Se precisar, conversamos.` : `Olá, ${primeiroNome(c.nome)}! Lembrete: ${l.parcela ? `a parcela ${l.parcela} dos honorários` : "o pagamento dos honorários"} (${reaisBR(l.valor)}) vence em ${fmt(deIso(l.venc))}. Obrigada!`;
        lista.push({ k, ord: l.venc, pri: atras ? 1 : 4, ico: atras ? "🔴" : "💰", tit: `${atras ? "Cobrar" : "Lembrar"} ${primeiroNome(c.nome)}: ${reaisBR(l.valor)} ${atras ? `vencido há ${-d} dia(s)` : d === 0 ? "vence hoje" : `vence em ${d} dia(s)`}`, sub: l.desc, acao: atras ? "Cobrar no WhatsApp" : "Lembrar no WhatsApp", fazer: () => { open(`https://wa.me/${tel}?text=${encodeURIComponent(txt)}`, "_blank", "noopener"); (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `WhatsApp: ${atras ? "cobrança" : "lembrete de pagamento"}` }); salvarCrm(); marcar(k); } });
      }
      // 4) compromisso amanhã: lembrar o cliente
      for (const it of itens.filter((x) => x.cli === c.id && x.tipo === "compromisso" && !x.feita && diasAte(x.quando) === 1)) {
        const k = `comp:${it.id}`; if (feitos.has(k) || !tel) continue;
        const txt = `Olá, ${primeiroNome(c.nome)}! Lembrete: amanhã (${fmt(deIso(it.quando))})${it.hora ? ` às ${it.hora}` : ""} — ${it.texto}. Qualquer dúvida, me chame.`;
        lista.push({ k, ord: it.quando, pri: 2, ico: "📆", tit: `Lembrar ${primeiroNome(c.nome)} do compromisso de amanhã`, sub: it.texto, acao: "Lembrar no WhatsApp", fazer: () => { open(`https://wa.me/${tel}?text=${encodeURIComponent(txt)}`, "_blank", "noopener"); (c.hist ||= []).unshift({ em: new Date().toISOString(), o: "WhatsApp: lembrete de compromisso" }); salvarCrm(); marcar(k); } });
      }
      // 5) contato novo sem resposta
      const kN = `novo:${c.id}`;
      if (c.etapa === "Novo pedido" && c.criado && Date.now() - new Date(c.criado) > 864e5 && !ultimoContato(c) && !feitos.has(kN))
        lista.push({ k: kN, ord: c.criado.slice(0, 10), pri: 2, ico: "📲", tit: `Responder ${c.nome}`, sub: `Contato novo há ${Math.floor((Date.now() - new Date(c.criado)) / 864e5)} dia(s) sem resposta`, acao: "Abrir roteiro", fazer: () => { marcar(kN); abrirFicha(c.id); $("fi-spin")?.scrollIntoView({ behavior: "smooth" }); } });
      // 6) cliente ativo sem notícias há 30 dias
      const ult = ultimoContato(c), kM = `mensal:${c.id}:${hojeIso.slice(0, 7)}`;
      if (c.etapa === "Caso ativo" && tel && procsDe(c).length && (!ult || Date.now() - new Date(ult) > 30 * 864e5) && !feitos.has(kM))
        lista.push({ k: kM, ord: "9", pri: 5, ico: "🗓️", tit: `Atualização mensal para ${c.nome}`, sub: ult ? `Último contato em ${fmt(new Date(ult))}` : "Nenhum contato registrado ainda", acao: "Enviar atualização", fazer: () => { marcar(kM); window.Acervo.abrirMsg(procsDe(c)[0], "Informar andamento"); } });
    }
    return lista.sort((a, b) => a.pri - b.pri || a.ord.localeCompare(b.ord));
  }
  let atuais = [];
  function render() {
    const box = $("auto"); if (!box) return;
    atuais = sugestoes();
    box.hidden = !atuais.length;
    $("auto-n").textContent = `${atuais.length} sugestão(ões)`;
    $("auto-lista").innerHTML = atuais.slice(0, 20).map((s, i) => `<li><span class="ico">${s.ico}</span><div class="t-txt"><b>${esc(s.tit)}</b><br><span class="small muted">${esc(s.sub || "")}</span></div>
      <div class="auto-acoes"><button class="btn" data-auto="${i}">${s.acao}</button><button class="linkish small" data-dispensar="${i}">dispensar</button></div></li>`).join("") + (atuais.length > 20 ? `<li class="small muted">+ ${atuais.length - 20} outras</li>` : "");
  }
  $("auto-lista").addEventListener("click", (e) => {
    const a = e.target.closest("[data-auto]"), d = e.target.closest("[data-dispensar]");
    if (a) atuais[+a.dataset.auto].fazer();
    if (d) marcar(atuais[+d.dataset.dispensar].k);
  });
  const origHoje = window.renderHoje;
  window.renderHoje = (...x) => { origHoje(...x); render(); };
  render();
})();
