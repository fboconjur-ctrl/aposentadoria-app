// Documentos que o cliente anexou no site: ficam na área privada até a análise (ou 60 dias) e aparecem na ficha.
(() => {
  const dias = (d) => Math.max(0, 60 - Math.floor((Date.now() - new Date(d).getTime()) / 864e5));
  function render() {
    const c = cliPorId(fichaAtual), box = $("fi-dp"); if (!c || !box) return;
    const docs = c.docsPedido || []; box.hidden = !docs.length; if (!docs.length) return;
    $("fi-dp-prazo").textContent = `apagados automaticamente em ${dias(docs[0].em)} dia(s)`;
    $("fi-dp-lista").innerHTML = docs.map((d, i) => `<li><span class="ico">📄</span><div class="t-txt">${esc(d.nome)}<br><span class="small muted">${(d.tamanho / 1024 / 1024).toFixed(1)} MB</span></div><button class="linkish small" data-dp="${i}">baixar</button></li>`).join("");
    $("fi-dp-msg").textContent = window.DocsPedido ? "" : "Entre com o login do painel para acessar os documentos.";
  }
  const salvarArq = (blob, nome) => { const l = document.createElement("a"); l.href = URL.createObjectURL(blob); l.download = nome; document.body.appendChild(l); l.click(); l.remove(); };
  $("fi-dp-lista").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-dp]"); if (!b) return; const d = cliPorId(fichaAtual).docsPedido[+b.dataset.dp];
    try { salvarArq(await DocsPedido.baixar(d.caminho), d.nome); } catch (er) { $("fi-dp-msg").textContent = "Não consegui baixar: " + (er.message || "o arquivo pode ter expirado."); }
  });
  $("fi-dp-zip").onclick = async () => {
    const c = cliPorId(fichaAtual), z = new JSZip(), raiz = z.folder(`Documentos - ${c.nome}`.replace(/[\\/:*?"<>|]/g, ""));
    $("fi-dp-msg").textContent = "Baixando e organizando…";
    try {
      for (const [i, d] of c.docsPedido.entries()) {
        const blob = await DocsPedido.baixar(d.caminho), f = new File([blob], d.nome, { type: d.tipo });
        let texto = ""; try { texto = /pdf/i.test(d.tipo) ? await LeituraDocs.lerArquivo(f) : ""; } catch {}
        const cat = window.Organizador?.classificar(d.nome, texto) || "09 Outros";
        raiz.folder(cat).file(window.Organizador?.nomeSugerido(f, texto, cat, i, c.nome) || d.nome, f);
      }
      salvarArq(await z.generateAsync({ type: "blob" }), `Documentos - ${c.nome}.zip`);
      $("fi-dp-msg").textContent = "Pasta baixada. Depois de salvar no seu computador, clique em “Já baixei — apagar do servidor”.";
    } catch (er) { $("fi-dp-msg").textContent = "Não consegui baixar tudo: " + (er.message || er); }
  };
  async function apagar(motivo) {
    const c = cliPorId(fichaAtual);
    try { await DocsPedido.apagar(c.docsPedido.map((d) => d.caminho)); } catch (er) { $("fi-dp-msg").textContent = "Não consegui apagar: " + er.message; return false; }
    (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Documentos do pedido apagados do servidor (${motivo})` }); c.docsPedido = []; salvarCrm(); abrirFicha(c.id, { manterScroll: true }); return true;
  }
  $("fi-dp-ok").onclick = () => confirm("Apagar do servidor os documentos enviados pelo cliente? Faça isso depois de baixar.") && apagar("analisados");
  $("fi-dp-recusar").onclick = async () => {
    if (!confirm("Recusar o pedido e apagar os documentos enviados pelo cliente?")) return;
    const c = cliPorId(fichaAtual);
    if (await apagar("pedido recusado")) { c.etapa = "Encerrado"; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: "Pedido recusado" }); salvarCrm(); abrirFicha(c.id, { manterScroll: true }); }
  };
  const orig = window.renderOnb;
  window.renderOnb = (...a) => { orig?.(...a); render(); };
})();
