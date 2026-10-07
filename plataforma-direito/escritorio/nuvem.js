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

    // 3) Pedidos da plataforma chegam sozinhos (verifica ao abrir e a cada minuto).
    const buscarPedidos = async () => {
      const { data } = await sb.from("pedidos").select("id, pacote").eq("importado", false);
      for (const p of data || []) if (typeof importarPacote === "function" && importarPacote(p.pacote)) await sb.from("pedidos").update({ importado: true }).eq("id", p.id);
    };
    buscarPedidos(); setInterval(buscarPedidos, 60000);
    document.getElementById("sair")?.addEventListener("click", () => { sessionStorage.removeItem("pd-sync-ok"); sb.auth.signOut().then(() => location.reload()); });
  };
  document.head.appendChild(s);
})();
