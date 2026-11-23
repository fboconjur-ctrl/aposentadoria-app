// Salvar no Google Drive (permissão "drive.file": o painel só enxerga as pastas e arquivos que ele mesmo criar).
// Estrutura: Escritório / Clientes / <Nome do cliente> / <subpastas…>. O token fica só na memória desta aba.
(() => {
  const ID = window.SUPABASE_CONFIG?.googleClientId; if (!ID) return;
  const API = "https://www.googleapis.com/drive/v3", UP = "https://www.googleapis.com/upload/drive/v3/files";
  let token = null, expira = 0, gisPronto;
  const carregaGis = () => gisPronto ||= new Promise((ok, erro) => {
    const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.onload = ok; s.onerror = () => erro(new Error("Não consegui carregar o Google.")); document.head.appendChild(s);
  });
  async function autorizar() {
    if (token && Date.now() < expira - 60000) return token;
    await carregaGis();
    return new Promise((ok, erro) => {
      const cli = google.accounts.oauth2.initTokenClient({ client_id: ID, scope: "https://www.googleapis.com/auth/drive.file",
        callback: (r) => { if (r.error) return erro(new Error(r.error_description || r.error)); token = r.access_token; expira = Date.now() + (+r.expires_in || 3600) * 1000; ok(token); },
        error_callback: (e) => erro(new Error(e?.type === "popup_closed" ? "Janela do Google fechada antes de autorizar." : "O Google não autorizou.")) });
      cli.requestAccessToken({ prompt: token ? "" : "consent" });
    });
  }
  const api = async (url, opt = {}) => {
    const r = await fetch(url, { ...opt, headers: { Authorization: `Bearer ${token}`, ...(opt.headers || {}) } });
    if (!r.ok) throw new Error(`Drive respondeu ${r.status}`); return r.json();
  };
  const aspas = (t) => String(t).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  async function pasta(nome, pai) {
    const q = `name='${aspas(nome)}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '${pai || "root"}' in parents`;
    const l = await api(`${API}/files?q=${encodeURIComponent(q)}&fields=files(id,webViewLink)&spaces=drive`);
    if (l.files?.length) return l.files[0];
    return api(`${API}/files?fields=id,webViewLink`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nome, mimeType: "application/vnd.google-apps.folder", parents: [pai || "root"] }) });
  }
  async function caminho(partes) { let p = null; for (const n of partes) p = await pasta(n, p?.id); return p; }
  async function enviar(blob, nome, paiId) {
    const meta = new Blob([JSON.stringify({ name: nome, parents: [paiId] })], { type: "application/json" });
    const fd = new FormData(); fd.append("metadata", meta); fd.append("file", blob, nome);
    return api(`${UP}?uploadType=multipart&fields=id`, { method: "POST", body: fd });
  }
  // arquivos: [{ pasta: ["01 Peça"], nome, blob }]; base: ["Escritório","Clientes","Maria", "Kit …"]
  async function salvar(base, arquivos, progresso) {
    await autorizar();
    const raiz = await caminho(base), cache = new Map();
    let i = 0;
    for (const a of arquivos) {
      const k = (a.pasta || []).join("/");
      if (!cache.has(k)) { let p = raiz; for (const n of a.pasta || []) p = await pasta(n, p.id); cache.set(k, p); }
      await enviar(a.blob, a.nome, cache.get(k).id); progresso?.(++i, arquivos.length);
    }
    return raiz.webViewLink || `https://drive.google.com/drive/folders/${raiz.id}`;
  }
  window.Drive = { salvar, autorizar };
})();
