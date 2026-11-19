// Busca rápida: aperte "/" (ou o botão 🔍) em qualquer tela e ache cliente ou processo pelo nome, CPF, telefone ou número.
(() => {
  const nav = document.querySelector("nav"); if (!nav) return;
  const bt = document.createElement("button"); bt.className = "nav"; bt.textContent = "🔍 Buscar"; bt.title = "Buscar (atalho: /)"; nav.appendChild(bt);
  const ov = document.createElement("div");
  ov.style.cssText = "position:fixed;inset:0;background:rgba(10,20,50,.45);z-index:9999;display:none;align-items:flex-start;justify-content:center;padding:10vh 16px";
  ov.innerHTML = `<div class="panel" style="width:min(640px,100%);max-height:75vh;overflow:auto;margin:0"><input id="bg-q" class="search" style="width:100%;box-sizing:border-box;font-size:17px" placeholder="Nome, CPF, telefone ou número do processo"><ul class="list" id="bg-res" style="margin-top:8px"></ul><p class="small muted" style="margin:6px 0 0">Enter abre o primeiro · Esc fecha</p></div>`;
  document.body.appendChild(ov);
  const q = ov.querySelector("#bg-q"), res = ov.querySelector("#bg-res"); let achados = [];
  const abrir = () => { ov.style.display = "flex"; q.value = ""; res.innerHTML = ""; q.focus(); };
  const fechar = () => { ov.style.display = "none"; };
  bt.onclick = abrir;
  ov.addEventListener("click", (e) => { if (e.target === ov) fechar(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ov.style.display === "flex") return fechar();
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) { e.preventDefault(); abrir(); }
  });
  function buscar() {
    const t = semAcento(q.value), d = soDig(q.value); achados = [];
    if (t.length < 2) { res.innerHTML = ""; return; }
    for (const c of clientes) {
      const alvo = semAcento([c.nome, c.area, c.protocolo, c.email].join(" ")), dig = soDig([c.cpf, c.tel].join(" ")) + " " + procsDe(c).join(" ");
      if (alvo.includes(t) || (d.length >= 4 && dig.includes(d))) achados.push({ ico: "👤", tit: c.nome, sub: [c.etapa, c.area].filter(Boolean).join(" · "), ir: () => abrirFicha(c.id) });
    }
    const ac = window.Acervo?.dados?.() || {};
    for (const [n, a] of Object.entries(ac)) {
      if ((d.length >= 4 && n.includes(d)) || semAcento([a.classe, a.orgao, (a.partes || []).join(" ")].join(" ")).includes(t))
        achados.push({ ico: "⚖️", tit: mascara(n), sub: [a.trib, a.classe, (a.partes || []).slice(0, 2).join(", ")].filter(Boolean).join(" · "), ir: () => { go("acervo"); const b = $("ac-busca"); if (b) { b.value = n; b.dispatchEvent(new Event("input")); } } });
    }
    achados = achados.slice(0, 30);
    res.innerHTML = achados.length ? achados.map((a, i) => `<li><button class="linkish" data-i="${i}" style="text-align:left">${a.ico} <b>${esc(a.tit)}</b><br><span class="small muted">${esc(a.sub)}</span></button></li>`).join("") : `<li class="small muted">Nada encontrado.</li>`;
  }
  q.addEventListener("input", buscar);
  q.addEventListener("keydown", (e) => { if (e.key === "Enter" && achados[0]) { fechar(); achados[0].ir(); } });
  res.addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) { fechar(); achados[+b.dataset.i].ir(); } });
})();
