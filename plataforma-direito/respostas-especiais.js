// Perguntas "estranhas", fora do roteiro ou sensíveis: o site responde com cuidado, sem IA.
// Vale para a busca da página inicial e para o relato livre ("conte com suas palavras").
// A ordem importa: emergências primeiro.
(() => {
  const N = (t) => norm(String(t || "")).replace(/\s+/g, " ");
  const R = [
    { id: "vida", re: /suicid|me matar|tirar (a )?minha vida|nao quero mais viver|acabar com (a )?minha vida|me machucar/,
      titulo: "Você não está sozinho(a)",
      texto: "Se você está pensando em tirar a própria vida, fale agora com o CVV, pelo telefone 188 (ligação gratuita, 24 horas) ou pelo chat em cvv.org.br. Em perigo imediato, ligue 192 (SAMU) ou vá ao pronto-socorro mais próximo. As questões jurídicas podem esperar: cuidar de você vem primeiro.",
      acoes: [["Ligar para o CVV (188)", "tel:188"], ["Ligar para o SAMU (192)", "tel:192"]] },
    { id: "saude-urgente", re: /passando mal|infarto|avc|nao consigo respirar|sangrando|desmai/,
      titulo: "Emergência de saúde",
      texto: "Ligue agora para o SAMU (192) ou vá ao pronto-socorro. Se o plano de saúde ou o hospital negar atendimento de urgência, guarde nomes, horários e protocolos e fale com a advogada depois: a lei garante o atendimento de urgência e emergência.",
      acoes: [["Ligar para o SAMU (192)", "tel:192"]] },
    { id: "violencia", re: /me bate|me bateu|apanh|agress|violencia domestica|me ameac|ameaca de morte|medida protetiva|estupr|abuso sexual|maria da penha/,
      titulo: "Sua segurança vem primeiro",
      texto: "Em perigo agora, ligue 190 (Polícia Militar). A Central de Atendimento à Mulher atende pelo 180, de graça, 24 horas. Você pode registrar ocorrência em qualquer delegacia ou na Delegacia da Mulher e pedir medida protetiva de urgência, que o juiz decide em até 48 horas (Lei Maria da Penha). Para filhos, pensão e divórcio depois disso, a advogada pode ajudar.",
      acoes: [["Ligar 190", "tel:190"], ["Ligar 180", "tel:180"], ["Falar com a advogada", "zap"]] },
    { id: "preso", seguir: true, re: /\bpres[oa]\b|foi preso|prisao em flagrante|flagrante|delegacia levou|audiencia de custodia|mandado de prisao|policia (levou|prendeu)/,
      titulo: "Prisão ou flagrante: aja rápido",
      texto: "Este escritório não atua na área criminal, mas pode indicar um(a) advogado(a) criminalista de confiança. Se a pessoa não tiver advogado, a Defensoria Pública atende presos e acompanha a audiência de custódia. A pessoa presa tem direito de ficar em silêncio e de falar com um advogado.",
      acoes: [["Pedir indicação de criminalista", "zap"], ["Defensoria Pública do DF", "https://www.defensoria.df.gov.br/"]] },
    { id: "ilicito", re: /sonega|burlar|fraudar|falsific|atestado falso|laudo falso|laranja|esconder (bens|dinheiro|patrimonio)|lavar dinheiro|como enganar|driblar o inss|receber sem ter direito|nao declarar (renda|bens) para/,
      titulo: "Não podemos ajudar com isso",
      texto: "Não orientamos sobre formas de burlar a lei, esconder bens ou obter benefício indevido: além de ilegal, isso costuma gerar devolução de valores, multa e até processo criminal. Se você tem receio de estar numa situação irregular, a advogada pode avaliar como regularizar da forma mais segura.",
      acoes: [["Quero regularizar minha situação", "zap"]] },
    { id: "dados-terceiros", re: /endereco de (alguem|uma pessoa|fulano)|descobrir (onde|o endereco|o telefone|o cpf)|cpf de outra pessoa|dados de (alguem|outra pessoa)|rastrear (alguem|uma pessoa)|espionar/,
      titulo: "Dados de outras pessoas",
      texto: "Não fornecemos nem buscamos dados pessoais de terceiros, em respeito à Lei Geral de Proteção de Dados. Se você precisa localizar alguém para um processo (por exemplo, para cobrar pensão), isso é feito pela própria Justiça, que consulta os cadastros oficiais. Processos públicos podem ser consultados no site do tribunal pelo número.",
      acoes: [["Conversar com a advogada", "zap"]] },
    { id: "preco", seguir: true, re: /quanto custa|qual o valor|qual (e )?o preco|honorario|cobra quanto|consulta (e )?(gratis|gratuita|paga)|tem custo|e de graca|parcel(a|o) (os )?honorario/,
      titulo: "Valores e consulta",
      texto: "Os honorários dependem do tipo de caso e seguem a tabela da OAB. O valor é informado com clareza antes de qualquer contratação, por escrito, e pode ser parcelado conforme o caso. As informações deste site são gratuitas. Atendimentos depois das 17h são feitos como consulta paga.",
      acoes: [["Perguntar o valor no WhatsApp", "zap"]] },
    { id: "robo", re: /voce e (um )?robo|e (um )?robo|inteligencia artificial|chatgpt|quem (esta )?(me )?respond|e uma pessoa|tem alguem ai|falar com (um )?humano|falar com (a )?advogada/,
      titulo: "Quem responde aqui",
      texto: "Este site funciona sozinho: os textos foram escritos e revisados pela advogada, e você navega por eles. Para falar com a advogada de verdade, use o WhatsApp. Ela responde nos horários de atendimento: segunda, quarta e sexta, das 9h às 12h; terça e quinta, das 14h às 17h.",
      acoes: [["Falar com a advogada", "zap"]] },
    { id: "urgente-prazo", seguir: true, re: /prazo (vence|acaba|termina) (hoje|amanha)|vence (hoje|amanha)|ultimo dia|audiencia (hoje|amanha)|pericia (hoje|amanha)|urgente|urgencia/,
      titulo: "É urgente?",
      texto: "Se o prazo vence hoje ou amanhã, ou se há audiência ou perícia marcada para os próximos dias, não espere: mande agora uma mensagem para a advogada com o documento (foto da intimação, notificação ou decisão). Quanto antes ela vir, mais opções existem.",
      acoes: [["Mandar agora no WhatsApp", "zap"]] },
    { id: "golpe-agora", seguir: true, re: /(estao|esta) me ligando|pediram (o )?(codigo|senha|token)|central de seguranca|falso funcionario|clicaram no link|cliquei no link|me pediram pix/,
      titulo: "Pode ser golpe: pare agora",
      texto: "Desligue a ligação e não informe senhas, códigos ou tokens: o banco nunca pede isso. Ligue você mesmo(a) para o número oficial do banco (atrás do cartão ou no aplicativo). Se já fez um Pix, peça ao banco o MED (devolução) o quanto antes e guarde comprovantes e prints.",
      acoes: [["Ver: caí em golpe no Pix", "s:pix-golpe"]] },
    { id: "fora-area", seguir: true, re: /area criminal|processo criminal|homicid|trafico de|eleitoral|imigra|visto|cidadania (italiana|portuguesa)|patente|marca registrada|falencia|recuperacao judicial/,
      titulo: "Tema fora das áreas do site",
      texto: "Esse assunto não está entre os temas que este site explica. A advogada pode avaliar se atua no caso ou indicar um(a) colega de confiança da área.",
      acoes: [["Perguntar à advogada", "zap"]] },
    { id: "saudacao", re: /^(oi|ola|bom dia|boa tarde|boa noite|e ai|alo|opa|teste|testando|hello|hi)[\s!.?]*$/,
      titulo: "Olá! Como podemos ajudar?",
      texto: "Conte em poucas palavras o seu problema (por exemplo: \"o INSS negou meu benefício\" ou \"respondo a um PAD\") ou escolha um dos assuntos abaixo. Se preferir, fale direto com a advogada.",
      acoes: [["Ver os assuntos", "home"], ["Falar com a advogada", "zap"]] },
    { id: "agradece", re: /^(obrigad[oa]|valeu|muito obrigad[oa]|grat[oa])[\s!.]*$/,
      titulo: "Por nada!",
      texto: "Se surgir outra dúvida, é só voltar. E, se quiser que a advogada veja o seu caso, o WhatsApp está sempre aqui.",
      acoes: [["Falar com a advogada", "zap"]] },
    { id: "ofensa", re: /\b(idiota|burr[oa]|lixo|merda|porcaria|bost|caralh|porra|vagabund|otari[oa])\b/,
      titulo: "Sentimos muito pela frustração",
      texto: "Problemas jurídicos cansam mesmo. Conte o que aconteceu, com suas palavras, que tentamos mostrar o caminho. Se preferir, fale direto com a advogada.",
      acoes: [["Falar com a advogada", "zap"]] },
    { id: "brincadeira", re: /receita de|futebol|piada|horoscopo|signo|previsao do tempo|jogo do bicho|loteria|mega.?sena|namor(o|ada|ado) (comigo|voce)/,
      titulo: "Aqui o assunto é Direito 🙂",
      texto: "Este site explica direitos em linguagem simples: servidor e concurso, INSS, saúde, bancos, consumo, família, cartório e outros. Escolha um assunto ou conte o seu problema.",
      acoes: [["Ver os assuntos", "home"]] },
  ];
  // Texto sem palavras reconhecíveis (ex.: "asdfgh", "kkkkk", só números).
  const semSentido = (t) => { const n = N(t); const letras = n.replace(/[^a-z]/g, ""); return n.length >= 3 && (!/[aeiou]/.test(letras) || /^(k|h|a|s|d|f|j|rs)+$/.test(letras) || /^[\d\s.,-]+$/.test(n)); };

  function achar(t) {
    const n = N(t);
    const r = R.find((x) => x.re.test(n));
    if (r) return r;
    if (semSentido(t)) return { id: "sem-sentido", titulo: "Não entendi bem", texto: "Pode escrever de outro jeito? Conte em poucas palavras o que aconteceu, por exemplo: \"o plano negou minha cirurgia\". Ou escolha um dos assuntos.", acoes: [["Ver os assuntos", "home"], ["Falar com a advogada", "zap"]] };
    return null;
  }
  const zap = (t) => window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(`Olá! Vim pelo site.${t ? ` ${t}` : ""}`)}`, "_blank", "noopener");
  function agir(destino, t) {
    if (destino === "zap") return zap(t);
    if (destino === "home") return go("home");
    if (destino.startsWith("s:")) return window.abrirSituacao?.(destino.slice(2));
    window.open(destino, destino.startsWith("tel:") ? "_self" : "_blank", "noopener");
  }

  // No relato livre (conversa): responde e oferece os caminhos.
  // Casos "seguir": dá o aviso e continua a leitura normal do relato (ex.: "urgente" junto com um caso real).
  let visto = null;
  window.respostaEspecial = function (t) {
    if (visto === t) return false;
    visto = t;
    const r = achar(t); if (!r) return false;
    if (r.seguir && N(t).length > 40) { say(`⚠️ ${r.titulo}. ${r.texto}`); return false; }
    say(`${r.titulo}. ${r.texto}`);
    offer([...r.acoes.map((a) => a[0]), "Voltar ao início"], (o) => {
      const a = r.acoes.find((x) => x[0] === o);
      if (!a) return go("home");
      agir(a[1], r.id === "robo" || r.id === "preco" ? "" : t);
    });
    return true;
  };
  // Também antes da leitura automática do relato.
  const sug = window.sugerirSituacoes;
  window.sugerirSituacoes = function (t) { if (window.respostaEspecial(t)) return; return sug.apply(this, arguments); };

  // Na busca da página inicial: mostra um cartão antes dos resultados.
  const inp = document.getElementById("busca-q"), res = document.getElementById("busca-res");
  if (inp && res) {
    const cartao = document.createElement("div"); cartao.className = "busca-especial"; cartao.hidden = true;
    res.before(cartao);
    let tm;
    inp.addEventListener("input", () => { clearTimeout(tm); tm = setTimeout(() => {
      const r = inp.value.trim().length >= 2 ? achar(inp.value) : null;
      cartao.hidden = !r; if (!r) return;
      cartao.innerHTML = `<b>${esc(r.titulo)}</b><p>${esc(r.texto)}</p><div class="modelo-acoes">${r.acoes.filter((a) => a[1] !== "home").map((a, i) => `<button type="button" class="btn-sec" data-i="${i}">${esc(a[0])}</button>`).join("")}</div>`;
      const ac = r.acoes.filter((a) => a[1] !== "home");
      cartao.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => agir(ac[+b.dataset.i][1], "")));
      // Emergências e pedidos indevidos não mostram sugestões de situação embaixo.
      if (["vida", "saude-urgente", "violencia", "ilicito", "dados-terceiros", "sem-sentido", "saudacao", "brincadeira", "ofensa", "agradece"].includes(r.id)) res.innerHTML = "";
    }, 230); });
  }
})();
