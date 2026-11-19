// Equipe (titular): cadastro de associados e "Responsável" de cada cliente.
// O compartilhamento em si (tabela "casos" no Supabase) fica em nuvem.js.
(() => {
  const equipeLocal = () => { try { return JSON.parse(localStorage.getItem("pd-equipe") || "[]"); } catch { return []; } };
  const semNuvem = () => !window.Equipe;
  async function renderEquipe() {
    if (semNuvem()) { $("eq-lista").innerHTML = `<li class="muted">A equipe precisa do login do escritório (Supabase) ativo.</li>`; $("eq-form").hidden = true; return; }
    $("eq-status").textContent = "Carregando…";
    try {
      const lista = await Equipe.listar();
      const casos = (uid) => clientes.filter((c) => c.resp === uid).length;
      $("eq-lista").innerHTML = lista.map((a) => `<li><div class="t-txt"><b>${esc(a.nome)}</b>${a.oab ? ` <span class="small muted">OAB ${esc(a.oab)}</span>` : ""}<br><span class="small muted">${esc(a.email)} · ${casos(a.uid)} caso(s)</span></div>
        <span class="pill-s ${a.ativo ? "green" : "red"}">${a.ativo ? "ativo" : "sem acesso"}</span>
        <button class="linkish small" data-eq="${a.uid}" data-ativo="${a.ativo ? "0" : "1"}">${a.ativo ? "desativar acesso" : "reativar"}</button></li>`).join("") || `<li class="muted">Nenhum associado ainda.</li>`;
      $("eq-status").textContent = "";
    } catch (e) { $("eq-status").textContent = "Erro: " + e.message; }
  }
  $("eq-lista").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-eq]"); if (!b) return;
    if (b.dataset.ativo === "0" && !confirm("Desativar o acesso deste associado? Ele deixa de ver todos os casos na hora.")) return;
    try { await Equipe.ativar(b.dataset.eq, b.dataset.ativo === "1"); renderEquipe(); } catch (er) { alert(er.message); }
  });
  $("eq-form").onsubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await Equipe.adicionar($("eq-email").value.trim(), $("eq-nome").value.trim(), $("eq-oab").value.trim());
      if (r === "sem-conta") { $("eq-status").textContent = "Esse e-mail ainda não criou senha no painel. Peça ao associado o passo 1 e tente de novo."; return; }
      $("eq-form").reset(); renderEquipe();
    } catch (er) { $("eq-status").textContent = "Erro: " + er.message; }
  };
  document.addEventListener("click", (e) => { if (e.target.closest('[data-view="equipe"]')) setTimeout(renderEquipe); });

  // Responsável pelo cliente (na ficha).
  window.renderResp = () => {
    const c = cliPorId(fichaAtual), eq = equipeLocal(); if (!c) return;
    $("fi-resp-box").hidden = !eq.length || document.body.classList.contains("modo-associado");
    $("fi-resp").innerHTML = `<option value="">Eu (titular)</option>` + eq.map((a) => `<option value="${a.uid}"${a.uid === c.resp ? " selected" : ""}${a.ativo ? "" : " disabled"}>${esc(a.nome)}${a.ativo ? "" : " (sem acesso)"}</option>`).join("");
  };
  $("fi-resp").onchange = () => {
    const c = cliPorId(fichaAtual), uid = $("fi-resp").value, nome = equipeLocal().find((a) => a.uid === uid)?.nome;
    if (uid && !confirm(`Compartilhar o caso de ${c.nome} com ${nome}? Ele passa a ver a ficha, os prazos e as tarefas deste cliente (não vê pagamentos).`)) { $("fi-resp").value = c.resp || ""; return; }
    c.resp = uid; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: uid ? `Caso atribuído a ${nome}` : "Caso voltou para a titular" });
    salvarCrm(); abrirFicha(c.id, { manterScroll: true });
  };
})();
