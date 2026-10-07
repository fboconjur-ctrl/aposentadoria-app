// Login com Google + sincronização do painel no Firestore.
// Enquanto FIREBASE_CONFIG estiver vazio, o painel funciona como hoje (dados só neste navegador).
(() => {
  const CFG = window.FIREBASE_CONFIG;
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  const status = (t) => { const el = document.getElementById("nuvem-status"); if (el) el.textContent = t; };
  if (!CFG) { status("Dados só neste navegador"); return; }

  const carregar = (f) => new Promise((ok, erro) => { const s = document.createElement("script"); s.src = SDK + f; s.onload = ok; s.onerror = erro; document.head.appendChild(s); });
  const capa = document.createElement("div");
  capa.id = "login-capa";
  capa.innerHTML = `<div class="login-box"><h1>Escritório</h1><p class="muted">Acesso restrito.</p><button class="btn" id="login-google">Entrar com Google</button><p class="small muted" id="login-msg"></p></div>`;
  document.body.appendChild(capa);

  (async () => {
    await carregar("firebase-app-compat.js"); await carregar("firebase-auth-compat.js"); await carregar("firebase-firestore-compat.js");
    firebase.initializeApp(CFG);
    const auth = firebase.auth(), db = firebase.firestore();
    document.getElementById("login-google").onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch((e) => (document.getElementById("login-msg").textContent = e.message));

    auth.onAuthStateChanged(async (user) => {
      if (!user) { capa.hidden = false; return; }
      const estado = db.collection("escritorio").doc(user.uid).collection("estado");
      try {
        // 1) Traz o que está na nuvem para este navegador (a nuvem é a fonte da verdade).
        const snap = await estado.get();
        if (!snap.empty) { snap.forEach((d) => localStorage.setItem(d.id, d.data().valor)); if (!sessionStorage.getItem("pd-sync-ok")) { sessionStorage.setItem("pd-sync-ok", "1"); location.reload(); return; } }
        else { // primeira vez: envia o que já existe neste navegador
          const lote = db.batch();
          Object.keys(localStorage).filter((k) => k.startsWith("pd-")).forEach((k) => lote.set(estado.doc(k), { valor: localStorage.getItem(k), em: Date.now() }));
          await lote.commit();
        }
      } catch (e) {
        document.getElementById("login-msg").textContent = "Sem permissão para este painel (" + user.email + "). " + e.message;
        auth.signOut(); return;
      }
      capa.hidden = true; status(`Sincronizado · ${user.email}`);
      // 2) Toda gravação do painel passa a ir também para a nuvem.
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        original.call(this, k, v);
        if (this === localStorage && k.startsWith("pd-")) estado.doc(k).set({ valor: String(v), em: Date.now() }).then(() => status(`Sincronizado · ${user.email}`), () => status("Erro ao sincronizar — tente recarregar"));
      };
      // 3) Pedidos da plataforma chegam sozinhos.
      db.collection("pedidos").where("importado", "==", false).onSnapshot((q) => q.forEach(async (d) => {
        if (typeof importarPacote === "function" && importarPacote(d.data().pacote)) await d.ref.update({ importado: true });
      }));
      document.getElementById("sair")?.addEventListener("click", () => { sessionStorage.removeItem("pd-sync-ok"); auth.signOut().then(() => location.reload()); });
    });
  })().catch(() => status("Não foi possível carregar o login"));
})();
