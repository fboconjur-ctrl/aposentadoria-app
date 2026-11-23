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
      renderTermo(lista).catch(() => {});
    } catch (e) { $("eq-status").textContent = "Erro: " + e.message; }
  }
  const TERMO_MODELO = "TERMO DE ADESÃO E DE USO DA PLATAFORMA DO ESCRITÓRIO — ADVOGADO(A) ASSOCIADO(A)\n\nVersão 1 — minuta para revisão da titular. Os trechos [PREENCHER] devem ser completados antes de liberar o acesso.\n\n1. OBJETO\n1.1. Este termo regula o acesso do(a) advogado(a) associado(a) (\"ASSOCIADO\") à plataforma digital do escritório de [PREENCHER: nome da titular / sociedade], inscrita na OAB sob o nº [PREENCHER] (\"TITULAR\"), para atuação nos casos que lhe forem expressamente atribuídos.\n1.2. Este termo trata do uso do sistema e dos dados. A relação profissional entre as partes (associação, divisão de honorários, responsabilidades perante clientes) é regida por contrato próprio, que, quando exigido, deve ser registrado na Seccional da OAB, nos termos do Regulamento Geral do Estatuto da Advocacia. [PREENCHER: referência ao contrato de associação, se houver]\n\n2. ACESSO\n2.1. O acesso é pessoal e intransferível. O ASSOCIADO não compartilhará sua senha e comunicará imediatamente à TITULAR qualquer suspeita de uso indevido.\n2.2. O ASSOCIADO terá acesso somente aos casos que a TITULAR lhe atribuir, podendo o acesso ser retirado ou encerrado a qualquer momento, sem aviso prévio.\n2.3. Os acessos e as alterações feitas pelo ASSOCIADO são registrados pelo sistema, com data e hora, para fins de segurança e de prestação de contas.\n\n3. SIGILO PROFISSIONAL\n3.1. Todas as informações de clientes, processos, documentos, estratégias e honorários acessadas pela plataforma estão protegidas pelo sigilo profissional (Lei 8.906/1994, art. 7º, II, e Código de Ética e Disciplina da OAB), que permanece mesmo após o término da relação.\n\n4. PROTEÇÃO DE DADOS (LGPD — Lei 13.709/2018)\n4.1. A TITULAR é a controladora dos dados pessoais dos clientes. O ASSOCIADO atua como operador, tratando os dados somente conforme as orientações da TITULAR e exclusivamente para a execução dos casos atribuídos.\n4.2. É vedado ao ASSOCIADO: (a) copiar, exportar, baixar em massa, fotografar ou transferir dados ou documentos para fora da plataforma, salvo o estritamente necessário à prática de atos no processo; (b) usar dados de clientes para qualquer outra finalidade; (c) contatar clientes do escritório para fins alheios ao caso atribuído.\n4.3. O ASSOCIADO adotará medidas de segurança razoáveis em seus equipamentos (senha, bloqueio de tela, antivírus) e comunicará à TITULAR, em até 24 horas, qualquer incidente envolvendo dados de clientes.\n\n5. CARTEIRA DE CLIENTES\n5.1. Os clientes atendidos por meio da plataforma são clientes do escritório da TITULAR. O ASSOCIADO não captará, direta ou indiretamente, esses clientes para si ou para terceiros, durante a relação e por [PREENCHER: prazo] após o seu término, respeitada a liberdade de escolha do cliente.\n\n6. HONORÁRIOS\n6.1. A divisão de honorários dos casos atribuídos segue o contrato de associação ou o acordo escrito entre as partes. [PREENCHER: percentual ou forma de remuneração]\n\n7. TÉRMINO\n7.1. Encerrada a relação, o acesso será cortado e o ASSOCIADO devolverá ou eliminará, em até [PREENCHER: prazo] dias, qualquer cópia de dados ou documentos de clientes que tenha em seu poder, confirmando por escrito.\n7.2. As obrigações de sigilo, de proteção de dados e de não captação permanecem após o término.\n\n8. RESPONSABILIDADE\n8.1. O ASSOCIADO responde pelos atos que praticar e pelos danos que causar por descumprimento deste termo, sem prejuízo das responsabilidades ético-disciplinares.\n\n9. ACEITE\n9.1. O aceite eletrônico na plataforma, registrado com data, hora e identificação do usuário, vale como assinatura deste termo. Nova versão do termo exigirá novo aceite.\n\nForo: [PREENCHER: comarca].\n";
  const ACAO = { abriu_caso: "abriu o caso", alterou_caso: "alterou o caso", aceitou_termo: "aceitou o termo", desligou_associado: "desligou um associado" };
  async function renderTermo(lista) {
    const at = await Equipe.termoAtual(), ac = await Equipe.aceites(), atv = await Equipe.atividades();
    const nome = (uid) => lista.find((a) => a.uid === uid)?.nome || "Titular";
    const caso = (id) => clientes.find((c) => c.id === id)?.nome || id || "";
    $("eq-termo-st").innerHTML = at ? `Em vigor: <b>versão ${at.versao}</b>, publicada em ${new Date(at.criado).toLocaleDateString("pt-BR")}.<br>${lista.filter((a) => a.ativo).map((a) => { const x = ac.find((y) => y.uid === a.uid && y.versao === at.versao); return `${esc(a.nome)}: ${x ? `✅ aceitou em ${new Date(x.em).toLocaleString("pt-BR")}` : "⏳ ainda não aceitou (sem acesso aos casos até aceitar)"}`; }).join("<br>")}` : "Nenhum termo publicado ainda. Revise o modelo abaixo, complete os [PREENCHER] e publique antes de liberar associados.";
    if (!$("eq-termo").value) $("eq-termo").value = at?.texto || TERMO_MODELO;
    $("eq-ativ").innerHTML = atv.map((x) => `<li class="small"><span class="when">${new Date(x.em).toLocaleString("pt-BR")}</span><span><b>${esc(nome(x.uid))}</b> ${esc(ACAO[x.acao] || x.acao)}${x.caso_id ? `: ${esc(caso(x.caso_id))}` : ""}</span></li>`).join("") || `<li class="muted small">Nenhuma atividade registrada ainda.</li>`;
  }
  $("eq-publicar").onclick = async () => {
    const t = $("eq-termo").value.trim();
    if (/\[PREENCHER/.test(t) && !confirm("Ainda há trechos [PREENCHER] no termo. Publicar mesmo assim?")) return;
    if (!confirm("Publicar esta versão? Todos os associados terão de aceitar de novo antes de acessar os casos.")) return;
    try { await Equipe.publicarTermo(t); $("eq-termo").value = ""; renderEquipe(); } catch (er) { alert("Não foi possível publicar: " + er.message); }
  };
  $("eq-lista").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-eq]"); if (!b) return;
    if (b.dataset.ativo === "0" && !confirm("Desativar o acesso deste associado? Ele perde o acesso aos casos na hora e é desconectado de todos os aparelhos.")) return;
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
