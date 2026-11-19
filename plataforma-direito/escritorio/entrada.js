// Entrada do cliente: checagem de conflito de interesses e roteiro dos primeiros dias (onboarding).
// Tudo roda no navegador, com os dados do próprio painel (clientes em pd-crm). Nada é enviado.
(() => {
  // ---------- Conflito de interesses ----------
  const SUFIXOS = /\b(ltda|me|epp|eireli|s\/?a|sa|cia|companhia|do|da|de|dos|das|e)\b/g;
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9\/ ]/g, " ").replace(SUFIXOS, " ").replace(/\s+/g, " ").trim();
  const dig = (s) => String(s || "").replace(/\D/g, "");
  const partes = (txt) => String(txt || "").split(/\n|;/).map((l) => l.trim()).filter(Boolean);
  const tokens = (s) => new Set(norm(s).split(" ").filter((t) => t.length > 3));
  // "igual" = mesmo documento ou mesmo nome normalizado; "parecido" = 2+ palavras relevantes em comum ou um nome contido no outro.
  function compara(a, b) {
    const da = dig(a), db = dig(b);
    if (da.length >= 11 && da === db) return "igual";
    const na = norm(a), nb = norm(b); if (!na || !nb) return null;
    if (na === nb) return "igual";
    if (na.length > 6 && nb.length > 6 && (na.includes(nb) || nb.includes(na))) return "parecido";
    const ta = tokens(a), tb = tokens(b); let comum = 0; ta.forEach((t) => tb.has(t) && comum++);
    return comum >= 2 ? "parecido" : null;
  }
  const EX = ["Encerrado", "Indicado a colega"];
  /** dados: { nome, cpf, contra } do cadastro; proprioId: id do cliente em edição (ignorado na busca). */
  function checarConflito(dados, proprioId) {
    const achados = [];
    const outros = clientes.filter((c) => c.id !== proprioId);
    const quem = [dados.nome, dados.cpf].filter(Boolean);
    outros.forEach((c) => {
      // 1) o novo cliente aparece como parte contrária de alguém da carteira
      partes(c.contra).forEach((p) => quem.forEach((q) => {
        const r = compara(q, p); if (!r) return;
        achados.push({ grau: r === "igual" && !EX.includes(c.etapa) ? "direto" : "potencial", txt: `“${p}” é parte contrária no caso de ${c.nome}${EX.includes(c.etapa) ? " (caso encerrado)" : ""}.` });
      }));
      // 2) a parte contrária informada é (ou foi) cliente
      partes(dados.contra).forEach((p) => [c.nome, c.cpf].filter(Boolean).forEach((q) => {
        const r = compara(p, q); if (!r) return;
        const ex = EX.includes(c.etapa);
        achados.push({ grau: r === "igual" && !ex ? "direto" : "potencial", txt: `A parte contrária “${p}” ${r === "igual" ? "é" : "parece ser"} ${ex ? "ex-cliente" : "cliente"}: ${c.nome}${ex ? ". Atuar contra ex-cliente exige cuidado com o sigilo do que foi confiado no caso anterior." : "."}` });
      }));
    });
    const vistos = new Set(), lista = achados.filter((a) => !vistos.has(a.txt) && vistos.add(a.txt));
    const grau = lista.some((a) => a.grau === "direto") ? "direto" : lista.length ? "potencial" : "sem indício";
    return { grau, achados: lista, quando: new Date().toISOString() };
  }
  const ROTULO = { direto: ["red", "Conflito direto"], potencial: ["amber", "Possível conflito — confira"], "sem indício": ["green", "Sem indício de conflito na carteira"] };
  function htmlConflito(r) {
    const [cor, t] = ROTULO[r.grau];
    return `<p><span class="pill-s ${cor}">${t}</span></p>` + (r.achados.length ? `<ul class="small">${r.achados.map((a) => `<li>${esc(a.txt)}</li>`).join("")}</ul>` : "") +
      `<p class="small muted">A busca considera só os clientes cadastrados neste painel (inclusive encerrados). Confira também vínculos seus com as partes e o grupo econômico de empresas.</p>`;
  }
  const atualizar = () => {
    const box = $("c-conflito"); if (!box) return;
    const d = { nome: $("c-nome").value, cpf: $("c-cpf").value, contra: $("c-contra").value };
    if (!d.nome.trim() && !d.contra.trim()) { box.hidden = true; return; }
    box.hidden = false; box.innerHTML = htmlConflito(checarConflito(d, editando?.id));
  };
  ["c-nome", "c-cpf", "c-contra"].forEach((id) => $(id)?.addEventListener("change", atualizar));
  $("crm-novo")?.addEventListener("click", () => ($("c-conflito").hidden = true));
  $("fi-editar")?.addEventListener("click", () => setTimeout(atualizar));
  window.checarConflito = checarConflito;

  // ---------- Primeiros passos do cliente contratado ----------
  const BASE = [
    ["contrato", "Contrato de honorários assinado"],
    ["procuracao", "Procuração assinada"],
    ["docpessoal", "RG/CNH, CPF e comprovante de residência"],
    ["expectativa", "Explicar ao cliente as etapas, o tempo provável e que não há garantia de resultado"],
    ["canal", "Combinar o canal de contato e a frequência das atualizações"],
    ["retorno", "Dar o primeiro retorno sobre o andamento em até 7 dias"],
  ];
  const DOCS_AREA = {
    "Previdenciário": ["Extrato do CNIS (Meu INSS)", "Carteiras de trabalho (todas as páginas com vínculos)", "Carta de indeferimento ou de concessão, se houver", "PPP/LTCAT, se houve atividade especial", "Laudos e exames médicos, se o caso envolver saúde"],
    "Consumidor": ["Contrato, nota fiscal ou fatura", "Protocolos de atendimento e reclamações (SAC, Procon, consumidor.gov.br)", "Prints de conversas, e-mails e anúncios", "Comprovantes de pagamento"],
    "Saúde": ["Carteirinha e contrato do plano de saúde", "Relatório médico com a indicação e a urgência", "Negativa do plano (por escrito ou protocolo)", "Exames e orçamento do tratamento"],
    "Administrativo": ["Ato ou decisão questionada (portaria, despacho, publicação)", "Cópia do processo administrativo", "Ficha funcional e contracheques, se servidor", "Edital, se for concurso ou licitação"],
    "Cartório/Extrajudicial": ["Certidões de nascimento, casamento ou óbito", "Matrícula atualizada dos imóveis", "Documentos dos herdeiros ou das partes", "Relação de bens, dívidas e contas"],
    "Trabalhista": ["Carteira de trabalho", "Contracheques e extrato do FGTS", "Termo de rescisão (TRCT), se houver", "Provas: mensagens, e-mails, nomes de testemunhas"],
    "Empresas": ["Contrato social e última alteração", "Cartão CNPJ", "Documentos dos sócios", "Contratos ou documentos ligados ao caso"],
  };
  const passos = (c) => [...BASE, ...(DOCS_AREA[c.area] || []).map((t, i) => [`doc${i}`, t])];
  const docsFaltando = (c) => (DOCS_AREA[c.area] || []).filter((_, i) => !(c.onb || []).includes(`doc${i}`))
    .concat((c.onb || []).includes("docpessoal") ? [] : ["RG/CNH, CPF e comprovante de residência"]);
  function renderOnb() {
    const c = cliPorId(fichaAtual), box = $("fi-onb"); if (!c || !box) return;
    const ativo = ["Contratado", "Caso ativo"].includes(c.etapa);
    const lista = passos(c), feitos = lista.filter(([k]) => (c.onb || []).includes(k)).length;
    box.hidden = !ativo || (feitos === lista.length && c.etapa === "Caso ativo");
    if (box.hidden) return;
    $("fi-onb-prog").textContent = `${feitos} de ${lista.length}`;
    $("fi-onb-lista").innerHTML = lista.map(([k, t]) => `<li><label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" data-onb="${k}"${(c.onb || []).includes(k) ? " checked" : ""}> <span${(c.onb || []).includes(k) ? ' class="muted" style="text-decoration:line-through"' : ""}>${esc(t)}</span></label></li>`).join("");
  }
  $("fi-onb-lista")?.addEventListener("change", (e) => {
    const k = e.target.dataset.onb; if (!k) return;
    const c = cliPorId(fichaAtual), s = new Set(c.onb || []);
    e.target.checked ? s.add(k) : s.delete(k); c.onb = [...s]; salvarCrm(); renderOnb();
  });
  $("fi-onb-pedir")?.addEventListener("click", () => {
    $("fi-wa").click(); $("wa-modelo").value = "Pedir documentos"; $("wa-modelo").dispatchEvent(new Event("change"));
  });
  window.renderOnb = renderOnb; window.docsFaltando = docsFaltando;
  window.docsStatus = (c) => passos(c).filter(([k]) => k === "docpessoal" || k.startsWith("doc")).map(([k, t]) => ({ doc: t, ok: (c.onb || []).includes(k) }));
  $("fi-etapa")?.addEventListener("change", renderOnb);
})();
