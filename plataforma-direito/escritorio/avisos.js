// Avisos: quando chega mensagem pela área do cliente ou pedido novo pelo site, o painel avisa
// (número na aba do navegador e, se permitido, notificação na tela). Nada sai do computador.
(() => {
  const TIT = document.title, K = "avisos-vistos-local";
  let vistos; try { vistos = new Set(JSON.parse(localStorage.getItem(K) || "[]")); } catch { vistos = new Set(); }
  let primeira = true;
  const pode = () => "Notification" in window && Notification.permission === "granted";
  const box = document.getElementById("auto");
  if (box && "Notification" in window && Notification.permission === "default") {
    const b = document.createElement("button");
    b.className = "linkish small"; b.textContent = "🔔 Avisar na tela quando um cliente escrever";
    b.onclick = () => Notification.requestPermission().then(() => b.remove());
    box.parentNode.insertBefore(b, box);
  }
  function verificar() {
    const lista = typeof clientes !== "undefined" ? clientes : [];
    const msgs = (window.msgsPortalNaoLidas?.() || []).map((m) => {
      const c = lista.find((x) => x.portal?.token === m.token);
      return { k: `m:${m.id}`, t: `${c?.nome || "Cliente"} mandou mensagem`, s: String(m.texto || "").slice(0, 120), cli: c?.id };
    });
    const peds = lista.filter((c) => c.origem === "Plataforma" && c.etapa === "Novo pedido")
      .map((c) => ({ k: `p:${c.id}`, t: `Pedido novo: ${c.nome}`, s: c.area || "", cli: c.id }));
    const todos = [...msgs, ...peds];
    document.title = todos.length ? `(${todos.length}) ${TIT}` : TIT;
    const novos = todos.filter((a) => !vistos.has(a.k));
    if (!primeira && pode()) for (const a of novos.slice(0, 3)) {
      const n = new Notification(a.t, { body: a.s, icon: "/favicon.svg", tag: a.k });
      n.onclick = () => { window.focus(); if (a.cli && typeof abrirFicha === "function") abrirFicha(a.cli); n.close(); };
    }
    novos.forEach((a) => vistos.add(a.k)); primeira = false;
    try { localStorage.setItem(K, JSON.stringify([...vistos].slice(-500))); } catch {}
  }
  setTimeout(verificar, 5000); setInterval(verificar, 30000);
})();
