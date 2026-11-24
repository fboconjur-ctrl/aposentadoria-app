// Aba "Treinamentos e consultorias": monta a lista de temas e envia o pedido de proposta pelo WhatsApp.
(() => {
  const form = document.getElementById("tr-form"); if (!form) return;
  const temas = [...document.querySelectorAll("[data-tema]")].map((x) => x.dataset.tema);
  const sel = document.getElementById("tr-tema");
  sel.innerHTML = [...temas, "Outro tema"].map((t) => `<option>${esc(t)}</option>`).join("");
  // Tocar num cartão escolhe o tema e leva ao formulário.
  document.querySelectorAll("[data-tema]").forEach((c) => {
    c.tabIndex = 0; c.style.cursor = "pointer";
    const ir = () => { sel.value = c.dataset.tema; form.scrollIntoView({ behavior: "smooth", block: "start" }); };
    c.onclick = ir; c.onkeydown = (e) => { if (e.key === "Enter") ir(); };
  });
  form.onsubmit = (e) => {
    e.preventDefault();
    const v = (id) => document.getElementById(id).value.trim();
    const linhas = ["Olá! Vim pelo site e gostaria de uma proposta de treinamento/consultoria.", `Tema: ${v("tr-tema")}`, `Formato: ${v("tr-formato")}`];
    if (v("tr-org")) linhas.push(`Órgão/empresa: ${v("tr-org")}`);
    if (v("tr-pessoas")) linhas.push(`Participantes: ${v("tr-pessoas")}`);
    if (v("tr-obs")) linhas.push(`Detalhes: ${v("tr-obs")}`);
    window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
  };
})();
