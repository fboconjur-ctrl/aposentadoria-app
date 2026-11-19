// Guia "Primeiros passos" na tela Hoje: mostra o que falta configurar, em ordem, e leva direto ao lugar certo.
(() => {
  const KEY = "pd-guia-oculto";
  const adv = () => window.DocGerador?.adv() || {};
  const PASSOS = [
    ["Preencha seus dados (nome e OAB)", "Usados na procuração, contrato, petições e mensagens.", () => adv().nome && adv().oab, () => { go("docs"); $("meus-dados").open = true; $("adv-nome").focus(); }],
    ["Traga todos os seus processos", "Uma busca única pela sua OAB monta o acervo.", () => !!ler("pd-acervo-carga", null) || Object.keys(ler("pd-acervo", {})).length > 0, () => go("acervo")],
    ["Cadastre seus clientes", "Confirme os nomes encontrados nos processos ou cadastre à mão.", () => clientes.length > 0, () => go("clientes")],
    ["Complete o WhatsApp dos clientes", "Sem o número, as mensagens prontas não abrem.", () => clientes.length > 0 && clientes.every((c) => telWa(c.tel)), () => { const c = clientes.find((x) => !telWa(x.tel)); c ? (abrirFicha(c.id), $("fi-editar").click()) : go("clientes"); }],
    ["Cadastre um modelo de petição", "Cole ou importe do Word uma petição sua.", () => ler("pd-modelos-peticao", []).length > 0, () => { go("peticoes"); $("pe-banco").open = true; }],
  ];
  function render() {
    const box = $("guia"); if (!box) return;
    const feitos = PASSOS.map((p) => !!p[2]());
    const n = feitos.filter(Boolean).length;
    box.hidden = ler(KEY, false) || n === PASSOS.length || document.body.classList.contains("modo-associado");
    if (box.hidden) return;
    $("guia-prog").textContent = `${n} de ${PASSOS.length}`;
    const prox = feitos.indexOf(false);
    $("guia-lista").innerHTML = PASSOS.map(([t, d], i) => `<li class="${feitos[i] ? "feito" : i === prox ? "agora" : ""}"><div><b>${feitos[i] ? "✅ " : ""}${t}</b><br><span class="small muted">${d}</span></div>${feitos[i] ? "" : `<button class="${i === prox ? "btn" : "back"}" data-guia="${i}">${i === prox ? "Fazer agora" : "Ir"}</button>`}</li>`).join("");
  }
  $("guia-lista").addEventListener("click", (e) => { const b = e.target.closest("[data-guia]"); if (b) PASSOS[+b.dataset.guia][3](); });
  $("guia-ocultar").onclick = () => { gravar(KEY, true); render(); };
  const origHoje = window.renderHoje;
  window.renderHoje = (...x) => { origHoje(...x); render(); };
  render();
})();
// Fecha o menu "Mais ações" da ficha ao escolher uma opção ou clicar fora.
document.addEventListener("click", (e) => { document.querySelectorAll(".fi-mais[open]").forEach((d) => { if (!d.contains(e.target) || e.target.closest(".fi-mais-menu button")) d.open = false; }); });
