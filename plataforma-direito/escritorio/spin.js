// Roteiro de conversa consultiva no WhatsApp (método SPIN: Situação, Problema, Implicação, Necessidade).
// Mensagens prontas e éticas (sem promessa de resultado, sem pressão, sem falar de preço antes de entender o caso).
// As respostas do cliente ficam anotadas na ficha e o avanço aparece no histórico.
(() => {
  const AREA = {
    "Previdenciário": { s: "Hoje você está trabalhando, afastado(a) ou já recebe algum benefício do INSS? Já pediu algo ao INSS antes?", p: "O INSS chegou a negar, cortar ou demorar para responder algum pedido seu? O que dizia a carta ou o aplicativo Meu INSS?", i: "Sem esse benefício, como fica a renda da casa hoje? Há algum prazo correndo, como recurso ou perícia marcada?" },
    "Saúde": { s: "Qual é o seu plano de saúde (ou atendimento pelo SUS) e qual tratamento o médico indicou?", p: "O plano ou a rede pública negou, atrasou ou limitou o tratamento? Você recebeu a negativa por escrito ou um número de protocolo?", i: "Quanto a demora pode afetar a sua saúde? O médico falou em urgência ou prazo para o procedimento?" },
    "Consumidor": { s: "Com qual empresa aconteceu o problema e quando começou?", p: "O que a empresa fez (ou deixou de fazer)? Você já reclamou no SAC, Procon ou consumidor.gov.br?", i: "Que prejuízo isso já trouxe: valores cobrados, nome negativado, tempo perdido?" },
    "Administrativo": { s: "Você é servidor(a), candidato(a) em concurso ou tem um processo em algum órgão público? Qual órgão?", p: "Qual ato ou decisão do órgão está te prejudicando? Já houve publicação, portaria ou notificação?", i: "Esse ato tem prazo para recurso ou defesa? O que muda na sua carreira ou na sua renda se nada for feito?" },
    "Trabalhista": { s: "Você ainda trabalha na empresa ou já saiu? Quanto tempo trabalhou lá e qual era a função?", p: "O que ficou sem pagar ou o que aconteceu de errado no trabalho?", i: "Quando foi a saída? (Há prazos para reclamar na Justiça do Trabalho.) Isso afetou suas contas ou sua saúde?" },
    "Cartório/Extrajudicial": { s: "O assunto é inventário, divórcio, imóvel ou outro documento de cartório? Quem são as pessoas envolvidas?", p: "O que está impedindo resolver hoje: falta de acordo, documentos, dívidas, imóvel irregular?", i: "Há algum prazo ou custo correndo, como multa do ITCD, venda de imóvel parada ou partilha pendente?" },
  };
  const GERAL = { s: "Para eu entender melhor, me conta um pouco da sua situação hoje e desde quando isso acontece?", p: "Qual é a principal dificuldade que você está enfrentando com isso?", i: "Se isso continuar como está, o que pode acontecer com você nos próximos meses?" };
  const PASSOS = [
    ["s", "1. Situação", "Entenda o contexto. Pergunte, não explique ainda.", (c, a) => `Olá, ${primeiroNome(c.nome)}! Obrigada por entrar em contato. ${a.s}`],
    ["p", "2. Problema", "Descubra o que realmente incomoda. Peça documentos só depois.", (c, a) => `Entendi, ${primeiroNome(c.nome)}. ${a.p}`],
    ["i", "3. Implicação", "Ajude a pessoa a enxergar prazos e consequências. Sem assustar e sem prometer resultado.", (c, a) => `Obrigada por explicar. ${a.i}`],
    ["n", "4. Necessidade", "Deixe a pessoa dizer o que espera. Só então apresente o caminho e a consulta.", (c) => `Pelo que você me contou, o que seria resolver isso para você? Se fizer sentido, posso analisar seus documentos com calma numa consulta e te explicar quais caminhos existem e quais são os riscos. Prefere conversar por vídeo ou aqui pelo WhatsApp?`],
    ["f", "5. Próximo passo", "Com o interesse claro: proposta por escrito, sem pressão. Lembre: nada de garantir resultado.", (c) => `${primeiroNome(c.nome)}, conforme combinamos, vou te enviar a proposta por escrito com o que está incluído, os prazos e a forma de pagamento. Fique à vontade para tirar qualquer dúvida antes de decidir.`],
  ];
  const MOSTRAR = ["Novo pedido", "Consulta marcada", "Proposta enviada"];
  function render() {
    const c = cliPorId(fichaAtual), box = $("fi-spin"); if (!c || !box) return;
    box.hidden = !MOSTRAR.includes(c.etapa); if (box.hidden) return;
    const a = AREA[c.area] || GERAL, sp = c.spin || {};
    const atual = PASSOS.findIndex(([k]) => !sp[k]?.feito);
    $("fi-spin-passos").innerHTML = PASSOS.map(([k, tit, dica, msg], i) => {
      const feito = sp[k]?.feito, aberto = i === (atual < 0 ? PASSOS.length - 1 : atual);
      return `<details class="spin-passo${feito ? " feito" : ""}" data-k="${k}"${aberto ? " open" : ""}><summary><b>${feito ? "✅ " : ""}${tit}</b> <span class="small muted">${dica}</span></summary>
        <textarea class="search spin-msg" rows="3">${esc(sp[k]?.msg || msg(c, a))}</textarea>
        <div class="as-linha"><button class="wa-btn" type="button" data-spin="wa">Enviar no WhatsApp</button><button class="linkish small" type="button" data-spin="ok">${feito ? "desmarcar" : "marcar como feito"}</button></div>
        <label class="small">O que a pessoa respondeu (fica nas anotações)<textarea class="search spin-resp" rows="2">${esc(sp[k]?.resp || "")}</textarea></label></details>`;
    }).join("");
  }
  $("fi-spin-passos")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-spin]"); if (!b) return;
    const c = cliPorId(fichaAtual), d = b.closest("[data-k]"), k = d.dataset.k, sp = (c.spin ||= {}), it = (sp[k] ||= {});
    it.msg = d.querySelector(".spin-msg").value;
    if (b.dataset.spin === "wa") {
      if (!telWa(c.tel)) { alert("Cadastre o WhatsApp do cliente em “Editar dados”."); return; }
      window.open(`https://wa.me/${telWa(c.tel)}?text=${encodeURIComponent(it.msg)}`, "_blank", "noopener");
      it.feito = true; (c.hist ||= []).unshift({ em: new Date().toISOString(), o: `WhatsApp (roteiro): ${PASSOS.find((p) => p[0] === k)[1]}` });
    } else it.feito = !it.feito;
    salvarCrm(); render();
  });
  $("fi-spin-passos")?.addEventListener("change", (e) => {
    if (!e.target.classList.contains("spin-resp")) return;
    const c = cliPorId(fichaAtual), d = e.target.closest("[data-k]"), k = d.dataset.k, sp = (c.spin ||= {}), it = (sp[k] ||= {});
    const tit = PASSOS.find((p) => p[0] === k)[1], antes = it.resp; it.resp = e.target.value.trim();
    if (it.resp && it.resp !== antes) c.notas = `${c.notas ? c.notas + "\n" : ""}[${tit}] ${it.resp}`;
    salvarCrm(); $("fi-notas").value = c.notas || "";
  });
  window.renderSpin = render;
})();
