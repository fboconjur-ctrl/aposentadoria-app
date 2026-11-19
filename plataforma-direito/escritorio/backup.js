// Cópia de segurança: baixa tudo o que o painel guarda (chaves pd-*) num arquivo e permite restaurar.
// O arquivo tem dados de clientes: guarde só no seu computador, nunca em lugar público.
(() => {
  const chaves = () => Object.keys(localStorage).filter((k) => k.startsWith("pd-") && k !== "pd-timbrado");
  document.getElementById("bk-baixar")?.addEventListener("click", () => {
    const dados = {}; for (const k of chaves()) dados[k] = localStorage.getItem(k);
    const blob = new Blob([JSON.stringify({ tipo: "copia-painel", em: new Date().toISOString(), dados })], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `copia-painel-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    try { localStorage.setItem("copia-ultima", new Date().toISOString()); } catch {}
  });
  document.getElementById("bk-restaurar")?.addEventListener("change", async (e) => {
    const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
    let j; try { j = JSON.parse(await f.text()); } catch { return alert("Este arquivo não é uma cópia do painel."); }
    if (j?.tipo !== "copia-painel" || typeof j.dados !== "object") return alert("Este arquivo não é uma cópia do painel.");
    const n = Object.keys(j.dados).filter((k) => k.startsWith("pd-")).length;
    if (!confirm(`Restaurar a cópia de ${new Date(j.em).toLocaleString("pt-BR")}? Os dados atuais do painel serão trocados pelos da cópia (${n} itens).`)) return;
    for (const [k, v] of Object.entries(j.dados)) if (k.startsWith("pd-") && typeof v === "string") localStorage.setItem(k, v);
    alert("Cópia restaurada. O painel vai recarregar."); location.reload();
  });
  // Lembrete mensal na tela de Ferramentas
  try {
    const u = localStorage.getItem("copia-ultima"), b = document.querySelector("#bk-baixar .meta");
    if (b) b.textContent = u ? `Última cópia: ${new Date(u).toLocaleDateString("pt-BR")}${Date.now() - new Date(u) > 30 * 864e5 ? " — faça uma nova" : ""}` : "Você ainda não fez nenhuma. Recomendo uma por mês";
  } catch {}
})();
