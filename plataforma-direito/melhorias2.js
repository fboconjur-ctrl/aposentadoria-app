// Mais ferramentas nas situações (sem API, tudo no navegador):
// calculadoras do servidor (prescrição do PAD, posse/exercício, estabilidade), "como costuma ser o caminho"
// do caso e "prepare sua consulta" (linha do tempo + o que quer perguntar, enviado pelo WhatsApp).
(() => {
  const fmt = (d) => d.toLocaleDateString("pt-BR");
  const dia = (v) => new Date(v + "T12:00:00");
  const soma = (d, { anos = 0, dias = 0 }) => { const x = new Date(d.getTime()); x.setFullYear(x.getFullYear() + anos); x.setDate(x.getDate() + dias); return x; };
  const hojeMeio = () => { const h = new Date(); h.setHours(12, 0, 0, 0); return h; };
  const falta = (d) => Math.round((d - hojeMeio()) / 864e5);
  const AVISO = `<span class="small muted">Regra federal (Lei 8.112/1990). Estados, DF e municípios podem ter regras próprias. Cálculo aproximado: confirme com a advogada.</span>`;
  const hoje = () => new Date().toISOString().slice(0, 10);

  // ---------- Calculadoras do servidor ----------
  const CALC = {
    "pad-prescricao": {
      titulo: "🧮 O PAD pode estar prescrito?",
      campos: `<label>Pena em discussão<select data-c="pena"><option value="5a">Demissão, cassação ou destituição (5 anos)</option><option value="2a">Suspensão (2 anos)</option><option value="180d">Advertência (180 dias)</option></select></label>
        <label>Quando a autoridade competente soube do fato?<input type="date" data-c="ciencia" max="${hoje()}"></label>
        <label>Quando o PAD foi instaurado (portaria)? <span class="small muted">Deixe em branco se ainda não foi.</span><input type="date" data-c="inst" max="${hoje()}"></label>`,
      calc: (v) => {
        if (!v.ciencia) return "";
        const prazo = v.pena === "5a" ? { anos: 5 } : v.pena === "2a" ? { anos: 2 } : { dias: 180 };
        const ci = dia(v.ciencia), semInst = soma(ci, prazo);
        if (!v.inst) return falta(semInst) < 0 ? `Pela data informada, a prescrição teria ocorrido em <b>${fmt(semInst)}</b>, antes da instauração. É um ponto forte para a defesa.` : `Se o PAD não for instaurado, a prescrição ocorre em <b>${fmt(semInst)}</b> (faltam ${falta(semInst)} dias).`;
        const ins = dia(v.inst);
        if (ins > semInst) return `A instauração (${fmt(ins)}) aconteceu depois da data de prescrição (<b>${fmt(semInst)}</b>). Pela conta, a punição estaria prescrita.`;
        // STJ, Súmula 635: a instauração interrompe; o prazo volta a correr por inteiro após 140 dias.
        const volta = soma(ins, { dias: 140 }), fim = soma(volta, prazo);
        return `A instauração interrompeu a contagem. Ela volta a correr por inteiro em ${fmt(volta)} (140 dias depois, conforme a Súmula 635 do STJ), e a prescrição ocorre em <b>${fmt(fim)}</b>${falta(fim) < 0 ? " — <b>data já passada: a punição pode estar prescrita</b>" : ` (faltam ${falta(fim)} dias)`}.`;
      },
    },
    "posse-nomeacao": {
      titulo: "🧮 Prazos de posse e exercício",
      campos: `<label>Data de publicação da nomeação<input type="date" data-c="nom"></label>
        <label>Data da posse <span class="small muted">(se já tomou posse)</span><input type="date" data-c="posse"></label>`,
      calc: (v) => {
        if (!v.nom && !v.posse) return "";
        let t = "";
        if (v.nom) { const p = soma(dia(v.nom), { dias: 30 }); t += `Prazo para a posse: até <b>${fmt(p)}</b> (30 dias da publicação)${falta(p) >= 0 ? `, faltam ${falta(p)} dias` : ""}.<br>`; }
        if (v.posse) { const e = soma(dia(v.posse), { dias: 15 }); t += `Prazo para entrar em exercício: até <b>${fmt(e)}</b> (15 dias da posse)${falta(e) >= 0 ? `, faltam ${falta(e)} dias` : ""}.`; }
        return t;
      },
    },
    "estagio-probatorio": {
      titulo: "🧮 Quando termina o estágio probatório?",
      campos: `<label>Data em que entrou em exercício<input type="date" data-c="ex" max="${hoje()}"></label>
        <label>Dias de afastamento que suspendem o estágio <span class="small muted">(se houver; ex.: licenças sem remuneração)</span><input type="number" min="0" data-c="susp" value="0"></label>`,
      calc: (v) => {
        if (!v.ex) return "";
        const fim = soma(soma(dia(v.ex), { anos: 3 }), { dias: +v.susp || 0 });
        return `A estabilidade exige 3 anos de efetivo exercício e aprovação na avaliação especial (Constituição, art. 41). Pela conta, o período termina em <b>${fmt(fim)}</b>${falta(fim) > 0 ? ` (faltam ${falta(fim)} dias)` : ""}.`;
      },
    },
  };

  // ---------- Como costuma ser o caminho (sem estimar tempo: cada caso e cada órgão têm o seu ritmo) ----------
  const CAMINHOS = {
    adm: ["Conversa com a advogada e análise dos documentos.", "Pedido de cópia do processo, se ainda não houver.", "Defesa, recurso ou pedido escrito no próprio órgão, dentro do prazo.", "O órgão analisa e decide. Você recebe a decisão por escrito.", "Se a decisão for contrária, avaliamos novo recurso ou ação na Justiça."],
    ms: ["Conversa com a advogada e conferência do prazo de 120 dias.", "Reunião das provas: o mandado de segurança exige prova documental desde o início.", "Ajuizamento, muitas vezes com pedido de liminar.", "O juiz decide a liminar, o órgão presta informações e o Ministério Público se manifesta.", "Sentença. Ainda cabe recurso às partes."],
    acaoServidor: ["Conversa com a advogada e análise da ficha funcional e dos contracheques.", "Pedido administrativo, quando for útil ou necessário.", "Ação na Justiça, com os cálculos do que é devido.", "O órgão apresenta defesa; pode haver perícia ou audiência.", "Sentença e recursos. Valores atrasados contra o poder público são pagos por RPV ou precatório."],
    licitacao: ["Leitura da notificação, do edital e do contrato.", "Defesa ou recurso administrativo no prazo (em dias úteis).", "Decisão da autoridade, com possibilidade de recurso ou reconsideração.", "Se necessário, ação judicial com pedido urgente."],
    inss: ["Conversa com a advogada e análise do CNIS e da decisão do INSS.", "Recurso administrativo ou novo pedido, conforme o caso.", "Se não resolver, ação na Justiça Federal (em geral no Juizado Especial).", "Perícia ou audiência, quando o caso exigir.", "Sentença; se favorável, implantação do benefício e pagamento dos atrasados."],
    saude: ["Conversa com a advogada e análise da negativa e do pedido médico.", "Reclamação na ANS ou no plano, quando houver tempo.", "Em urgência, ação com pedido de liminar.", "O juiz decide a liminar; o plano é intimado a cumprir.", "O processo segue até a sentença."],
    cartorio: ["Conversa com a advogada e lista de documentos.", "Reunião das certidões e, se houver, pagamento de impostos.", "Minuta da escritura revisada pela advogada.", "Assinatura no cartório.", "Registro nos órgãos (imóveis, bancos, Detran), quando necessário."],
    consumo: ["Conversa com a advogada e análise das provas (contrato, prints, protocolos).", "Reclamação na empresa, no consumidor.gov.br ou no Procon, quando útil.", "Se não resolver, ação no Juizado Especial ou na Justiça comum.", "Audiência de conciliação.", "Sentença e cumprimento."],
  };
  const CAMINHO_DE = {};
  const por = (tipo, ids) => ids.forEach((id) => (CAMINHO_DE[id] = tipo));
  por("adm", ["pad-prazo", "pad-prescricao", "processo-administrativo", "estagio-probatorio", "reposicao-erario", "sancao-administrativa", "auto-infracao", "multa-transito", "remocao", "acumulacao-cargos", "lai"]);
  por("ms", ["concurso-vagas", "concurso-eliminacao", "questao-concurso", "requisitos-concurso", "investigacao-social", "heteroidentificacao", "pcd-concurso", "posse-nomeacao"]);
  por("acaoServidor", ["direitos-servidor", "progressao-servidor", "desvio-funcao", "insalubridade-servidor", "demissao-servidor", "orgao-nao-paga", "servidor-aposentadoria", "responsabilidade-estado"]);
  por("licitacao", ["sancao-licitante", "licitacao-recurso", "reequilibrio-contrato", "tribunal-contas", "improbidade"]);
  por("inss", ["indeferido", "auxilio-incapacidade", "invalidez", "bpc-renda", "revisao-beneficio", "pericia-inss", "pensao-duracao", "salario-maternidade", "auxilio-acidente", "professor", "especial-ppp", "rural", "descontos-beneficio"]);
  por("saude", ["plano-negou", "prazo-atendimento", "liminar-medicamento", "tea-terapia", "home-care", "oncologico", "bariatrica", "opme-protese", "saude-mental", "fila-sus", "uti-sus", "sus-remedio"]);
  por("cartorio", ["inventario-cartorio", "divorcio-cartorio", "uniao-estavel", "inventario-negativo", "testamento", "emancipacao", "alteracao-nome", "retificacao-registro", "reconhecer-filho", "socioafetiva"]);
  por("consumo", ["perda-conta", "defeito", "compra-nao-entregue", "cobranca-dobro", "negativado", "voo", "telefonia", "pix-golpe", "consignado-nao-contratado", "compra-nao-reconhecida", "conta-alta", "falta-energia"]);

  // ---------- Prepare sua consulta: linha do tempo + perguntas, guardadas só neste aparelho ----------
  const chave = (id) => `pd-preparo-${id}`;
  const ler = (id) => { try { return JSON.parse(localStorage.getItem(chave(id)) || "{}"); } catch { return {}; } };
  const gravar = (id, v) => { try { localStorage.setItem(chave(id), JSON.stringify(v)); } catch {} };

  const anterior = window.mostrarRoteiro;
  window.mostrarRoteiro = function (f) {
    anterior.apply(this, arguments);
    try { extras(f); } catch (e) { console.warn(e); }
  };
  function extras(f) {
    const id = f.id, r = $("result"), camadas = r.querySelector(".camadas");
    // Calculadora do servidor
    const C = CALC[id];
    if (C) {
      const box = document.createElement("section"); box.className = "card rt-prazo";
      box.innerHTML = `<h2>${C.titulo}</h2>${C.campos}<p class="rt-prazo-res" data-res hidden></p>${AVISO}`;
      (r.querySelector(".rt-prazo") || r.querySelector(".rt-urgente-box") || r.querySelector(".rt-essencial"))?.after(box);
      const rodar = () => { const v = {}; box.querySelectorAll("[data-c]").forEach((x) => (v[x.dataset.c] = x.value)); const t = C.calc(v), o = box.querySelector("[data-res]"); o.hidden = !t; o.innerHTML = t; };
      box.querySelectorAll("[data-c]").forEach((x) => (x.oninput = x.onchange = rodar));
    }
    // Como costuma ser o caminho
    const etapas = CAMINHOS[CAMINHO_DE[id]];
    if (etapas && camadas) {
      const d = document.createElement("details"); d.className = "camada"; d.id = "c-caminho";
      d.innerHTML = `<summary><span class="camada-ico">🗺️</span><span><b>Como costuma ser o caminho</b><br><span class="small muted">As etapas, depois que você procura a advogada</span></span></summary>
        <div class="camada-corpo"><ol class="etapas">${etapas.map((x) => `<li>${esc(x)}</li>`).join("")}</ol><p class="small muted">O tempo de cada etapa varia conforme o órgão, o tribunal e o caso. A cada etapa importante, a advogada avisa você, e o andamento fica na sua Área do Cliente.</p></div>`;
      camadas.appendChild(d);
    }
    // Prepare sua consulta
    if (camadas) {
      const st = ler(id); st.eventos ||= [];
      const d = document.createElement("details"); d.className = "camada"; d.id = "c-preparo";
      d.innerHTML = `<summary><span class="camada-ico">🗂️</span><span><b>Prepare sua conversa com a advogada</b><br><span class="small muted">Anote as datas e as suas dúvidas e envie tudo de uma vez</span></span></summary>
        <div class="camada-corpo">
          <p class="small muted">Fica salvo só neste aparelho. Nada é enviado até você tocar no botão.</p>
          <h3>Linha do tempo</h3>
          <ul class="tl-lista" data-tl></ul>
          <div class="tl-novo"><input type="date" data-tl-data><input type="text" data-tl-txt placeholder="O que aconteceu (ex.: recebi a notificação)"><button type="button" class="btn-sec" data-tl-add>Adicionar</button></div>
          <h3>O que você quer perguntar</h3>
          <textarea rows="4" data-perg placeholder="Ex.: ainda dá tempo de recorrer? preciso levar algum documento?"></textarea>
          <div class="modelo-acoes"><button type="button" class="btn" data-prep-env>Enviar para a advogada no WhatsApp</button><button type="button" class="btn-sec" data-prep-limpar>Apagar anotações</button></div>
        </div>`;
      camadas.appendChild(d);
      const ul = d.querySelector("[data-tl]"), perg = d.querySelector("[data-perg]");
      perg.value = st.perg || "";
      const desenha = () => {
        st.eventos.sort((a, b) => (a.d || "").localeCompare(b.d || ""));
        ul.innerHTML = st.eventos.map((e, i) => `<li><b>${e.d ? fmt(dia(e.d)) : "sem data"}</b> — ${esc(e.t)} <button type="button" class="linkish" data-del="${i}" aria-label="Remover">✕</button></li>`).join("") || `<li class="small muted">Nenhum acontecimento anotado ainda.</li>`;
        ul.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { st.eventos.splice(+b.dataset.del, 1); gravar(id, st); desenha(); }));
      };
      desenha();
      d.querySelector("[data-tl-add]").onclick = () => {
        const dt = d.querySelector("[data-tl-data]"), tx = d.querySelector("[data-tl-txt]");
        if (!tx.value.trim()) { tx.focus(); return; }
        st.eventos.push({ d: dt.value, t: tx.value.trim() }); gravar(id, st); dt.value = ""; tx.value = ""; desenha();
      };
      perg.oninput = () => { st.perg = perg.value; gravar(id, st); };
      d.querySelector("[data-prep-limpar]").onclick = () => { if (confirm("Apagar as anotações desta situação?")) { st.eventos = []; st.perg = ""; perg.value = ""; gravar(id, st); desenha(); } };
      d.querySelector("[data-prep-env]").onclick = () => {
        const linhas = [`Olá! Vim pelo site. Assunto: ${titulo(id)}.`];
        if (state.answers?.length) linhas.push(`Minhas respostas no site: ${state.followSummary || state.answers.join(", ")}`);
        if (st.eventos.length) linhas.push("", "Linha do tempo:", ...st.eventos.map((e) => `• ${e.d ? fmt(dia(e.d)) : "sem data"}: ${e.t}`));
        if ((st.perg || "").trim()) linhas.push("", "Minhas dúvidas:", st.perg.trim());
        window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
      };
    }
  }
})();
