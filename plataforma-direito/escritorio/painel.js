// Painel "Hoje" em cartões: semana clicável, números, agenda do dia escolhido (com tarefa rápida),
// prazos que vêm aí, mensagens e pedidos novos, recebimentos — e impressão/PDF do dia.
(() => {
  const box = document.getElementById("painel-dia"); if (!box) return;
  let dia = hojeIso;
  const DSEM = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const addDias = (isoD, n) => iso(new Date(deIso(isoD).getTime() + n * DAY));
  const segunda = (isoD) => { const d = deIso(isoD), w = (d.getDay() + 6) % 7; return addDias(isoD, -w); };
  const doDia = (d) => [...itens.filter((x) => x.quando === d), ...parcelasAbertas().filter((x) => x.quando === d)].sort(ordem);
  const atrasados = () => [...itens.filter((x) => !x.feita && x.quando && x.quando < hojeIso), ...parcelasAbertas().filter((x) => x.quando < hojeIso)].sort(ordem);
  const longo = (d) => deIso(d).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  function render() {
    const ini = segunda(dia), sem = [...Array(7)].map((_, i) => addDias(ini, i)), fimSem = sem[6];
    const abertosSem = itens.filter((x) => !x.feita && x.quando >= ini && x.quando <= fimSem);
    const prazosSem = abertosSem.filter((x) => x.tipo === "prazo").length;
    const compSem = abertosSem.filter((x) => x.tipo === "compromisso").length;
    const tarefasSem = itens.filter((x) => x.tipo === "tarefa" && x.quando >= ini && x.quando <= fimSem);
    const receber = parcelasAbertas().filter((x) => x.quando >= ini && x.quando <= fimSem).reduce((s, x) => s + (+x.valor || 0), 0);
    const lista = doDia(dia), atr = dia === hojeIso ? atrasados() : [];
    const prox = itens.filter((x) => !x.feita && x.tipo === "prazo" && x.quando > hojeIso && x.quando <= addDias(hojeIso, 15)).sort(ordem).slice(0, 6);
    const msgs = window.msgsPortalNaoLidas?.() || [];
    const pedidos = clientes.filter((c) => c.etapa === "Novo pedido");
    const diasAte = (d) => Math.round((deIso(d) - deIso(hojeIso)) / DAY);

    box.innerHTML = `
      <div class="pd-topo">
        <div class="pd-semana">${sem.map((d) => { const n = doDia(d).filter((x) => !x.feita).length, dd = deIso(d);
          return `<button class="pd-dia${d === dia ? " on" : ""}${d === hojeIso ? " hoje" : ""}" data-pd-dia="${d}"><span>${DSEM[dd.getDay()]}</span><b>${dd.getDate()}</b>${n ? `<i>${n}</i>` : ""}</button>`; }).join("")}
          <button class="pd-nav" data-pd-mov="-7" aria-label="Semana anterior">‹</button><button class="pd-nav" data-pd-mov="7" aria-label="Próxima semana">›</button></div>
        <div class="pd-nums">
          <div><b>${prazosSem}</b><span>prazos na semana</span></div>
          <div><b>${compSem}</b><span>compromissos</span></div>
          <div><b>${tarefasSem.filter((x) => x.feita).length}/${tarefasSem.length}</b><span>tarefas feitas</span></div>
          <div class="so-titular"><b>${reaisBR(receber)}</b><span>a receber na semana</span></div>
        </div>
      </div>
      <div class="pd-grade">
        <section class="pd-card pd-lilas pd-largo">
          <div class="pd-tit"><h2>${dia === hojeIso ? "Para hoje" : "Agenda de " + esc(longo(dia))}</h2>
            <div><button class="linkish small" id="pd-imprimir">🖨️ Imprimir / PDF do dia</button>${dia !== hojeIso ? ` · <button class="linkish small" data-pd-dia="${hojeIso}">voltar para hoje</button>` : ""}</div></div>
          ${atr.length ? `<p class="small atrasada" style="margin:4px 0">⚠️ ${atr.length} atrasado(s)</p><ul class="list">${atr.slice(0, 8).map((x) => linha(x)).join("")}</ul>` : ""}
          <ul class="list">${lista.map((x) => linha(x)).join("") || `<li class="muted" style="justify-content:center">${dia === hojeIso && !atr.length ? "Tudo em dia. 🎉" : "Nada marcado para este dia."}</li>`}</ul>
          <form class="pd-rapida" id="pd-rapida" autocomplete="off">
            <select id="pd-tipo" class="search" aria-label="Tipo"><option value="tarefa">✓ Tarefa</option><option value="compromisso">📅 Compromisso</option><option value="prazo">⚖️ Prazo</option></select>
            <input id="pd-hora" class="search" type="time" aria-label="Hora">
            <input id="pd-txt" class="search" placeholder="Adicionar em ${dia === hojeIso ? "hoje" : esc(fmt(deIso(dia)))}… (ex.: ligar para Ana)">
            <select id="pd-cli" class="search" aria-label="Cliente"><option value="">sem cliente</option>${clientes.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join("")}</select>
            <button class="btn">+</button>
          </form>
        </section>
        <section class="pd-card pd-verde">
          <div class="pd-tit"><h2>Prazos que vêm aí</h2><button class="linkish small" data-view="prazos">calcular prazo</button></div>
          <ul class="list small">${prox.map((x) => { const c = cliPorId(x.cli), n = diasAte(x.quando);
            return `<li><span class="pd-cont${n <= 3 ? " urg" : ""}">${n}d</span><div>${esc(x.texto)}<br><span class="muted">${fmt(deIso(x.quando))}${c ? ` · <button class="linkish small" data-cli="${c.id}">${esc(c.nome)}</button>` : ""}</span></div></li>`; }).join("") || `<li class="muted">Nenhum prazo nos próximos 15 dias.</li>`}</ul>
        </section>
        <section class="pd-card pd-rosa">
          <div class="pd-tit"><h2>Clientes esperando</h2><button class="linkish small" data-view="clientes">ver clientes</button></div>
          <ul class="list small">
            ${msgs.slice(0, 5).map((m) => { const c = clientes.find((x) => x.portal?.token === m.token); return `<li><span class="ico">💬</span><div>${c ? `<button class="linkish small" data-cli="${c.id}">${esc(c.nome)}</button>` : "Cliente"} escreveu<br><span class="muted">${esc(String(m.texto || "").slice(0, 90))}</span></div></li>`; }).join("")}
            ${pedidos.slice(0, 5).map((c) => `<li><span class="ico">📥</span><div>Pedido novo: <button class="linkish small" data-cli="${c.id}">${esc(c.nome)}</button><br><span class="muted">${esc(c.area || "")}</span></div></li>`).join("")}
            ${!msgs.length && !pedidos.length ? `<li class="muted">Ninguém esperando resposta.</li>` : ""}
          </ul>
        </section>
        <section class="pd-card pd-amarelo so-titular">
          <div class="pd-tit"><h2>A receber</h2><button class="linkish small" data-view="fin">financeiro</button></div>
          <ul class="list small">${parcelasAbertas().filter((x) => x.quando <= addDias(hojeIso, 15)).sort(ordem).slice(0, 6).map((x) => { const c = cliPorId(x.cli), at = x.quando < hojeIso;
            return `<li><div>${reaisBR(x.valor)} <span class="muted">${esc(x.desc || "")}</span><br><span class="${at ? "atrasada" : "muted"}">${at ? "atrasado · " : ""}${fmt(deIso(x.quando))}${c ? ` · <button class="linkish small" data-cli="${c.id}">${esc(c.nome)}</button>` : ""}</span></div></li>`; }).join("") || `<li class="muted">Nada a receber nos próximos 15 dias.</li>`}</ul>
        </section>
      </div>`;
  }

  function imprimir() {
    const atr = dia === hojeIso ? atrasados() : [], lista = doDia(dia);
    const lin = (x) => { const c = cliPorId(x.cli); const t = x.tipo === "parcela" ? `Receber ${reaisBR(x.valor)} — ${x.desc || ""}` : x.texto;
      return `<tr><td class="ck">${x.feita ? "☑" : "☐"}</td><td>${esc(x.hora || "")}</td><td>${{ prazo: "Prazo", compromisso: "Compromisso", tarefa: "Tarefa", parcela: "Pagamento" }[x.tipo] || ""}</td><td>${esc(t)}${x.local ? ` <small>(${esc(x.local)})</small>` : ""}${x.quando && x.quando !== dia ? ` <small>— ${fmt(deIso(x.quando))}</small>` : ""}</td><td>${c ? esc(c.nome) : ""}</td></tr>`; };
    const tab = (tit, arr) => arr.length ? `<h2>${tit}</h2><table><thead><tr><th></th><th>Hora</th><th>Tipo</th><th>O quê</th><th>Cliente</th></tr></thead><tbody>${arr.map(lin).join("")}</tbody></table>` : "";
    const prox = itens.filter((x) => !x.feita && x.tipo === "prazo" && x.quando > dia && x.quando <= addDias(dia, 15)).sort(ordem);
    const w = open("", "_blank"); if (!w) return alert("Permita janelas deste site para imprimir.");
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Agenda ${fmt(deIso(dia))}</title><style>
      body{font:13px/1.45 Arial,Helvetica,sans-serif;color:#16224a;margin:24px}h1{font-size:20px;margin:0 0 2px}h2{font-size:14px;margin:18px 0 6px;border-bottom:2px solid #16224a;padding-bottom:3px}
      table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ccd;padding:6px 4px;text-align:left;vertical-align:top}th{font-size:11px;color:#556}.ck{width:18px;font-size:15px}
      .notas{border:1px solid #ccd;height:150px;border-radius:6px}small{color:#667}@media print{body{margin:10mm}}</style></head><body>
      <h1>Agenda do dia — ${esc(longo(dia))}</h1><small>Impresso em ${new Date().toLocaleString("pt-BR")}</small>
      ${tab("Atrasados", atr)}${tab("Do dia", lista) || "<h2>Do dia</h2><p>Nada marcado.</p>"}${tab("Prazos dos próximos 15 dias", prox)}
      <h2>Anotações</h2><div class="notas"></div>
      <script>onload=()=>{print()}<\/script></body></html>`);
    w.document.close();
  }

  box.addEventListener("click", (e) => {
    const d = e.target.closest("[data-pd-dia]"); if (d) { dia = d.dataset.pdDia; render(); return; }
    const m = e.target.closest("[data-pd-mov]"); if (m) { dia = addDias(dia, +m.dataset.pdMov); render(); return; }
    if (e.target.id === "pd-imprimir") imprimir();
  });
  box.addEventListener("submit", (e) => {
    if (e.target.id !== "pd-rapida") return; e.preventDefault();
    const t = $("pd-txt").value.trim(); if (!t) return;
    itens.push({ id: novoId("I-"), tipo: $("pd-tipo").value, texto: t, quando: dia, hora: $("pd-hora").value || "", cli: $("pd-cli").value, feita: false });
    salvarItens(); renderTudo();
  });
  const orig = window.renderHoje;
  window.renderHoje = (...a) => { orig(...a); render(); };
  window.PainelDia = { imprimir, render };
  render();
})();
