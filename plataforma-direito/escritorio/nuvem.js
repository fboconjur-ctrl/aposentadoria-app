// Login por e-mail e senha + sincronização do painel no Supabase.
// Enquanto SUPABASE_CONFIG estiver vazio, o painel funciona como antes (dados só neste navegador).
(() => {
  const CFG = window.SUPABASE_CONFIG;
  const status = (t) => { const el = document.getElementById("nuvem-status"); if (el) el.textContent = t; };
  if (!CFG) { status("Dados só neste navegador"); return; }

  const capa = document.createElement("div");
  capa.id = "login-capa";
  capa.innerHTML = `<div class="login-box"><h1>Escritório</h1><p class="muted">Acesso restrito.</p>
    ${CFG.google ? `<button class="btn" type="button" id="login-google">Entrar com Google</button><p class="small muted">ou</p>` : ""}
    <form id="login-form"><input id="login-email" type="email" required placeholder="seu e-mail" autocomplete="email"><br><input id="login-senha" type="password" required minlength="8" placeholder="senha (mín. 8 caracteres)" autocomplete="current-password"><br><button class="btn">Entrar</button></form>
    <p class="small"><button type="button" class="linkish" id="login-criar">Primeiro acesso? Criar minha senha</button></p>
    <p class="small muted" id="login-msg"></p></div>`;
  document.body.appendChild(capa);
  const msg = (t) => (document.getElementById("login-msg").textContent = t);

  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.99.3/dist/umd/supabase.js";
  s.onerror = () => status("Não foi possível carregar o login");
  s.onload = async () => {
    const sb = supabase.createClient(CFG.url, CFG.anonKey);
    document.getElementById("login-google")?.addEventListener("click", () => sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } }).then(({ error }) => error && msg(error.message)));
    const dados = () => ({ email: document.getElementById("login-email").value.trim(), password: document.getElementById("login-senha").value });
    document.getElementById("login-form").onsubmit = async (e) => {
      e.preventDefault();
      const { error } = await sb.auth.signInWithPassword(dados());
      if (error) return msg(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message === "Email not confirmed" ? "Acesso ainda não liberado. Avise o Claude." : error.message);
      location.reload();
    };
    document.getElementById("login-criar").onclick = async () => {
      if (!document.getElementById("login-form").reportValidity()) return;
      const { error } = await sb.auth.signUp(dados());
      msg(error ? error.message : "Senha criada. Agora avise o Claude para liberar seu acesso.");
    };

    const { data: { session } } = await sb.auth.getSession();
    const user = session?.user;
    if (!user) { capa.hidden = false; return; }

    // 0) Quem entrou: titular (vê tudo) ou associado (vê só os casos atribuídos a ele).
    const { data: papel, error: ePapel } = await sb.rpc("meu_papel");
    if (ePapel) { msg("Erro ao conferir o acesso: " + ePapel.message); capa.hidden = false; return; }
    if (!papel) { msg(`Acesso ainda não liberado para ${user.email}. Peça à titular do escritório.`); capa.hidden = false; await sb.auth.signOut(); return; }
    document.getElementById("trocar-senha")?.addEventListener("click", async () => {
      const nova = prompt("Digite a NOVA senha (mínimo 8 caracteres):"); if (!nova) return;
      if (nova.length < 8) return alert("A senha precisa ter pelo menos 8 caracteres.");
      if (prompt("Digite a nova senha de novo, para confirmar:") !== nova) return alert("As duas senhas não são iguais. Tente de novo.");
      const { error } = await sb.auth.updateUser({ password: nova });
      alert(error ? "Não foi possível trocar: " + error.message : "Senha trocada! Use a nova senha da próxima vez.");
    });
    document.getElementById("sair")?.addEventListener("click", () => { sessionStorage.removeItem("pd-sync-ok"); sb.auth.signOut().then(() => location.reload()); });
    if (papel === "associado") return modoAssociado(sb, user);

    // 1) Traz o que está na nuvem para este navegador (a nuvem é a fonte da verdade).
    const { data: linhas, error } = await sb.from("estado").select("chave, valor");
    if (error) { msg("Erro ao ler o painel: " + error.message); return; }
    if (linhas.length) {
      linhas.forEach((l) => localStorage.setItem(l.chave, l.valor));
      if (!sessionStorage.getItem("pd-sync-ok")) { sessionStorage.setItem("pd-sync-ok", "1"); location.reload(); return; }
    } else {
      // Primeira vez (ou e-mail sem permissão): envia o que já existe neste navegador.
      const lote = Object.keys(localStorage).filter((k) => k.startsWith("pd-")).map((k) => ({ chave: k, valor: localStorage.getItem(k), em: Date.now() }));
      const { error: e2 } = lote.length ? await sb.from("estado").upsert(lote) : await sb.from("estado").upsert({ chave: "pd-teste", valor: "1", em: Date.now() });
      if (e2) { msg(`Sem permissão para este painel (${user.email}).`); capa.hidden = false; await sb.auth.signOut(); return; }
    }
    capa.hidden = true; status(`Sincronizado · ${user.email}`);

    // 2) Toda gravação do painel passa a ir também para a nuvem.
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      original.call(this, k, v);
      if (this === localStorage && k.startsWith("pd-")) sb.from("estado").upsert({ chave: k, valor: String(v), em: Date.now() })
        .then(({ error }) => status(error ? "Erro ao sincronizar — tente recarregar" : `Sincronizado · ${user.email}`));
    };

    // Exclusão a pedido do cliente: apaga também o pedido original guardado no banco.
    window.apagarPedidoNuvem = async (protocolo) => {
      if (!protocolo) return 0;
      const { data } = await sb.from("pedidos").select("id, pacote");
      const ids = (data || []).filter((p) => { try { return JSON.parse(decodeURIComponent(escape(atob(String(p.pacote).replace(/^PD1:/, ""))))).protocolo === protocolo; } catch { return false; } }).map((p) => p.id);
      if (ids.length) await sb.from("pedidos").delete().in("id", ids);
      return ids.length;
    };
    // 3) Pedidos da plataforma chegam sozinhos (verifica ao abrir e a cada minuto).
    const buscarPedidos = async () => {
      const { data } = await sb.from("pedidos").select("id, pacote").eq("importado", false);
      for (const p of data || []) if (typeof importarPacote === "function" && importarPacote(p.pacote)) await sb.from("pedidos").update({ importado: true }).eq("id", p.id);
    };
    buscarPedidos(); setInterval(buscarPedidos, 60000);

    // 4) Equipe: casos atribuídos a associados vão para a tabela "casos"; o que o associado altera volta para cá.
    window.Equipe = {
      listar: async () => { const { data, error } = await sb.from("associados").select("uid, nome, email, oab, ativo").order("nome"); if (error) throw error; localStorage.setItem("pd-equipe", JSON.stringify(data.map(({ uid, nome, ativo }) => ({ uid, nome, ativo })))); return data; },
      adicionar: async (email, nome, oab) => { const { data, error } = await sb.rpc("adicionar_associado", { p_email: email, p_nome: nome, p_oab: oab || null }); if (error) throw error; return data; },
      ativar: async (uid, ativo) => { const { error } = await sb.from("associados").update({ ativo }).eq("uid", uid); if (error) throw error; },
    };
    Equipe.listar().catch(() => {});
    const enviados = new Map(); // id → JSON do último envio/recebimento (evita reenviar o que não mudou)
    const pacoteDe = (c) => JSON.stringify({ ficha: c, itens: itens.filter((x) => x.cli === c.id) });
    const puxarCasos = async () => {
      const { data, error } = await sb.from("casos").select("id, ficha, itens, em, por"); if (error) return;
      let mudou = false;
      for (const r of data) {
        const c = clientes.find((x) => x.id === r.id);
        if (c && r.por !== user.id && r.em > (c.casoEm || 0)) {
          const { resp, ...resto } = r.ficha; Object.assign(c, resto, { casoEm: r.em });
          itens = itens.filter((x) => x.cli !== r.id).concat(r.itens);
          mudou = true;
        }
        if (c) enviados.set(r.id, pacoteDe(c));
      }
      if (mudou) { localStorage.setItem("pd-crm", JSON.stringify(clientes)); localStorage.setItem("pd-itens", JSON.stringify(itens)); renderTudo(); }
      return data;
    };
    let timer;
    const enviarCasos = () => { clearTimeout(timer); timer = setTimeout(async () => {
      const atribuidos = clientes.filter((c) => c.resp);
      for (const c of atribuidos) {
        const pk = pacoteDe(c); if (enviados.get(c.id) === pk) continue;
        const em = Date.now(); c.casoEm = em;
        const { error } = await sb.from("casos").upsert({ id: c.id, associado: c.resp, ficha: c, itens: itens.filter((x) => x.cli === c.id), em });
        if (!error) enviados.set(c.id, pacoteDe(c)); else status("Erro ao compartilhar caso: " + error.message);
      }
      const ids = new Set(atribuidos.map((c) => c.id)), sobrando = [...enviados.keys()].filter((id) => !ids.has(id));
      if (sobrando.length) { await sb.from("casos").delete().in("id", sobrando); sobrando.forEach((id) => enviados.delete(id)); }
    }, 1500); };
    puxarCasos().then((rows) => { (rows || []).forEach((r) => enviados.has(r.id) || enviados.set(r.id, "")); enviarCasos(); });
    setInterval(puxarCasos, 60000);
    const setItemTitular = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { setItemTitular.call(this, k, v); if (this === localStorage && (k === "pd-crm" || k === "pd-itens")) enviarCasos(); };
  };

  // ---------- Modo associado: só os casos atribuídos, sem financeiro nem cadastro de clientes ----------
  async function modoAssociado(sb, user) {
    const { data: rows, error } = await sb.from("casos").select("id, ficha, itens, em");
    if (error) { msg("Erro ao ler seus casos: " + error.message); return; }
    const montar = (rs) => ({ crm: JSON.stringify(rs.map((r) => ({ ...r.ficha, casoEm: r.em }))), itens: JSON.stringify(rs.flatMap((r) => r.itens)) });
    if (!sessionStorage.getItem("pd-sync-ok") || localStorage.getItem("pd-papel") !== "associado") {
      // Limpa qualquer dado de outra pessoa que tenha ficado neste navegador e carrega só os casos dele.
      Object.keys(localStorage).filter((k) => k.startsWith("pd-")).forEach((k) => localStorage.removeItem(k));
      const m = montar(rows);
      localStorage.setItem("pd-papel", "associado"); localStorage.setItem("pd-crm", m.crm); localStorage.setItem("pd-itens", m.itens);
      sessionStorage.setItem("pd-sync-ok", "1"); location.reload(); return;
    }
    document.body.classList.add("modo-associado");
    capa.hidden = true; status(`Associado · ${user.email}`);
    const enviados = new Map(rows.map((r) => [r.id, JSON.stringify({ ficha: { ...r.ficha, casoEm: r.em }, itens: r.itens })]));
    let timer;
    const enviar = () => { clearTimeout(timer); timer = setTimeout(async () => {
      for (const c of clientes) {
        if (!enviados.has(c.id)) continue; // não cria casos novos
        const ii = itens.filter((x) => x.cli === c.id), pk = JSON.stringify({ ficha: c, itens: ii });
        if (enviados.get(c.id) === pk) continue;
        const em = Date.now(); c.casoEm = em;
        const { error } = await sb.from("casos").update({ ficha: c, itens: ii, em }).eq("id", c.id);
        status(error ? "Erro ao salvar — tente recarregar" : `Associado · ${user.email}`);
        if (!error) enviados.set(c.id, JSON.stringify({ ficha: c, itens: ii }));
      }
    }, 1500); };
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { original.call(this, k, v); if (this === localStorage && (k === "pd-crm" || k === "pd-itens")) enviar(); };
    // Novidades da titular (ou caso retirado) a cada minuto.
    setInterval(async () => {
      const { data } = await sb.from("casos").select("id, ficha, itens, em"); if (!data) return;
      const ids = new Set(data.map((r) => r.id));
      let mudou = clientes.some((c) => !ids.has(c.id));
      for (const r of data) { const c = clientes.find((x) => x.id === r.id); if (!c || r.em > (c.casoEm || 0)) mudou = true; }
      if (!mudou) return;
      const m = montar(data); original.call(localStorage, "pd-crm", m.crm); original.call(localStorage, "pd-itens", m.itens);
      clientes = JSON.parse(m.crm); itens = JSON.parse(m.itens);
      data.forEach((r) => enviados.set(r.id, JSON.stringify({ ficha: { ...r.ficha, casoEm: r.em }, itens: r.itens })));
      [...enviados.keys()].forEach((id) => ids.has(id) || enviados.delete(id));
      renderTudo();
    }, 60000);
  }
  document.head.appendChild(s);
})();
