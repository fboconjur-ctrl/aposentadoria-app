// Assistente jurídico: as tarefas do dia a dia (triagem, sentença, resumo, notificação…) direto no painel.
// O texto vai para /api/assistente (só com login) e a resposta aparece aos poucos, conforme é escrita.
(() => {
  const TAREFAS = [
    ["triagem", "📲 Responder novo contato (triagem)", "Cole a conversa do WhatsApp ou o pedido do site."],
    ["sentenca", "⚖️ Analisar sentença ou decisão", "Cole o texto da sentença (ou carregue o PDF)."],
    ["resumo", "📄 Resumir peça ou processo", "Cole a peça ou carregue o PDF do processo."],
    ["prazos", "⏰ Identificar prazo de uma intimação", "Cole a intimação, publicação ou despacho."],
    ["comunicado", "💬 Explicar andamento ao cliente", "Cole o despacho ou decisão que o cliente precisa entender."],
    ["notificacao", "✉️ Redigir notificação extrajudicial", "Conte os fatos, quem notifica, quem recebe e o que se pede."],
    ["jurisprudencia", "🔎 Planejar pesquisa de jurisprudência", "Descreva a questão jurídica e os fatos principais."],
    ["conteudo", "📣 Criar post para redes sociais", "Diga o tema do post (ex.: revisão da vida toda, plano negou cirurgia)."],
    ["etica", "✅ Conferir ética OAB de um post ou anúncio", "Cole o texto do post, anúncio ou página."],
    ["anonimizar", "🕶️ Tirar dados pessoais de um texto", "Cole o texto que quer anonimizar."],
  ];
  const sel = $("as-tarefa");
  sel.innerHTML = TAREFAS.map(([v, t]) => `<option value="${v}">${t}</option>`).join("");
  const dica = () => ($("as-texto").placeholder = TAREFAS.find((t) => t[0] === sel.value)[2]);
  sel.onchange = dica; dica();
  const contar = () => ($("as-conta").textContent = `${$("as-texto").value.length.toLocaleString("pt-BR")} caracteres`);
  $("as-texto").oninput = contar;

  $("as-pdf").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    $("as-status").textContent = "Lendo o arquivo no seu computador…";
    try {
      const txt = await LeituraDocs.lerArquivo(f, (p) => ($("as-status").textContent = `Lendo… ${p}%`));
      $("as-texto").value = ($("as-texto").value ? $("as-texto").value + "\n\n" : "") + txt.trim();
      $("as-status").textContent = `Arquivo lido: ${f.name}`; contar();
    } catch (er) { $("as-status").textContent = "Não consegui ler o arquivo: " + er.message; }
    e.target.value = "";
  };

  // Markdown simples → HTML (títulos, negrito, listas, tabelas), com o texto escapado antes.
  function md(t) {
    const linhas = esc(t).split("\n"), out = []; let lista = null, tabela = [];
    const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|\W)\*(?!\s)(.+?)\*(?=\W|$)/g, "$1<i>$2</i>");
    const fecha = () => { if (lista) { out.push(`</${lista}>`); lista = null; } if (tabela.length) { out.push(`<div class="as-tab"><table>${tabela.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r)).map((r, i) => `<tr>${r.replace(/^\s*\||\|\s*$/g, "").split("|").map((c) => `<${i ? "td" : "th"}>${inline(c.trim())}</${i ? "td" : "th"}>`).join("")}</tr>`).join("")}</table></div>`); tabela = []; } };
    for (const l of linhas) {
      if (/^\s*\|.*\|\s*$/.test(l)) { if (lista) { out.push(`</${lista}>`); lista = null; } tabela.push(l); continue; }
      if (tabela.length) fecha();
      const h = l.match(/^(#{1,4})\s+(.*)/), ul = l.match(/^\s*[-•*]\s+(.*)/), ol = l.match(/^\s*\d+[.)]\s+(.*)/);
      if (h) { fecha(); out.push(`<h${Math.min(4, h[1].length + 2)}>${inline(h[2])}</h${Math.min(4, h[1].length + 2)}>`); }
      else if (ul || ol) { const tipo = ul ? "ul" : "ol"; if (lista !== tipo) { fecha(); out.push(`<${tipo}>`); lista = tipo; } out.push(`<li>${inline((ul || ol)[1])}</li>`); }
      else if (!l.trim()) fecha();
      else { fecha(); out.push(`<p>${inline(l)}</p>`); }
    }
    fecha(); return out.join("");
  }

  let controle = null, bruto = "";
  $("as-form").onsubmit = async (e) => {
    e.preventDefault();
    // Sem API paga: monta o pedido, copia e abre o Claude da assinatura da advogada.
    const texto0 = $("as-texto").value.trim();
    if (texto0.length < 20) { $("as-status").textContent = "Escreva ou cole um texto maior."; return; }
    const nome = TAREFAS.find((t) => t[0] === sel.value)[1].replace(/^\S+\s/, "");
    const pedido = `Tarefa: ${nome}.\nSou advogada no Brasil. Responda em português, com linguagem clara, sem inventar jurisprudência, números de processo ou dados: marque [CONFERIR] o que precisar de verificação. Respeite a ética da OAB (Provimento 205/2021). Não repita dados pessoais desnecessários.\n\n---\n${texto0}`;
    try { await navigator.clipboard.writeText(pedido); } catch { $("as-status").textContent = "Não consegui copiar. Selecione o texto e copie manualmente."; return; }
    window.open("https://claude.ai/new", "_blank", "noopener");
    $("as-status").textContent = "Pedido copiado. No Claude que abriu, cole com Ctrl+V e envie.";
    return;
    if (controle) { controle.abort(); return; }
    const texto = $("as-texto").value.trim();
    if (texto.length < 20) { $("as-status").textContent = "Escreva ou cole um texto maior."; return; }
    const token = await window.tokenPainel?.();
    if (!token) { $("as-status").textContent = "Entre no painel com seu login para usar o assistente."; return; }
    bruto = ""; $("as-saida").hidden = false; $("as-resultado").innerHTML = `<p class="muted">Pensando…</p>`; $("as-acoes").hidden = true;
    $("as-enviar").textContent = "Parar"; $("as-status").textContent = "";
    controle = new AbortController();
    try {
      const r = await fetch("/api/assistente", { method: "POST", signal: controle.signal, headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ tarefa: sel.value, texto }) });
      if (!r.ok || !(r.headers.get("content-type") || "").includes("event-stream")) { const j = await r.json().catch(() => ({})); throw new Error(j.erro || `Erro ${r.status}`); }
      const leitor = r.body.getReader(), dec = new TextDecoder(); let buf = "";
      for (;;) {
        const { value, done } = await leitor.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        let i; while ((i = buf.indexOf("\n\n")) >= 0) {
          const ev = buf.slice(0, i); buf = buf.slice(i + 2);
          const dado = ev.split("\n").find((l) => l.startsWith("data:")); if (!dado) continue;
          let d; try { d = JSON.parse(dado.slice(5)); } catch { continue; }
          if (d.type === "content_block_delta" && d.delta?.type === "text_delta") { bruto += d.delta.text; $("as-resultado").innerHTML = md(bruto); }
          if (d.type === "message_delta" && d.delta?.stop_reason === "refusal") throw new Error("O assistente recusou este pedido. Reformule o texto.");
          if (d.type === "message_delta" && d.delta?.stop_reason === "max_tokens") $("as-status").textContent = "A resposta ficou longa demais e foi cortada no fim.";
          if (d.type === "error") throw new Error(d.error?.message || "Erro no assistente.");
        }
      }
      $("as-acoes").hidden = !bruto;
      const cli = $("as-cli").value;
      if (cli && bruto) { const c = cliPorId(cli); (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `Assistente: ${sel.options[sel.selectedIndex].text.replace(/^\S+\s/, "")}` }); salvarCrm(); }
    } catch (er) {
      if (er.name !== "AbortError") { $("as-resultado").innerHTML = ""; $("as-saida").hidden = true; $("as-status").textContent = er.message; }
      else $("as-status").textContent = "Parado.";
    } finally { controle = null; $("as-enviar").textContent = "Copiar e abrir no Claude"; }
  };
  $("as-copiar").onclick = async () => { try { await navigator.clipboard.writeText(bruto); $("as-status").textContent = "Copiado! Cole no Word, e-mail ou WhatsApp."; } catch { $("as-status").textContent = "Não consegui copiar; selecione o texto e use Ctrl+C."; } };
  $("as-notas").onclick = () => {
    const cli = $("as-cli").value; if (!cli) { $("as-status").textContent = "Escolha o cliente (acima) para salvar nas anotações dele."; return; }
    const c = cliPorId(cli); c.notas = `${c.notas ? c.notas + "\n\n" : ""}— ${new Date().toLocaleDateString("pt-BR")} · ${sel.options[sel.selectedIndex].text.replace(/^\S+\s/, "")}\n${bruto}`; salvarCrm();
    $("as-status").textContent = `Salvo nas anotações de ${c.nome}.`;
  };
  $("as-cli").onfocus = () => { const v = $("as-cli").value; $("as-cli").innerHTML = `<option value="">— nenhum —</option>` + [...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join(""); $("as-cli").value = v; };
  $("as-cli").dispatchEvent(new Event("focus"));
})();
