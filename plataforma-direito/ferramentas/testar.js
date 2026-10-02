// Bateria de testes: cada pergunta deve cair na resposta indicada.
// Uso: node plataforma-direito/ferramentas/testar.js   (sai com erro se alguma falhar)
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "..");
const ctx = { console, Date, Math, URLSearchParams };
vm.createContext(ctx);
for (const f of ["flows.js", "faq.js", "faq-areas.js", "faq-lote2.js", "faq-lote3.js", "continuacoes.js", "atlas.js"]) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
const { FAQ, findFaq, isQuestion } = vm.runInContext("({ FAQ, findFaq, isQuestion })", ctx);

// [pergunta, id esperado]
const CASOS = [
  // Previdenciário
  ["que deficiencias são consideradas graves para fins de aposentadoria do pcd ?", "pcd-grau"],
  ["qual o grau de deficiencia para aposentar mais cedo?", "pcd-grau"],
  ["quem tem direito a aposentadoria da pessoa com deficiencia?", "pcd-quem"],
  ["como funciona a regra dos pontos?", "pontos-2026"],
  ["com que idade posso me aposentar?", "idade-minima"],
  ["quanto vou receber de aposentadoria?", "calculo-valor"],
  ["qual o prazo pra recorrer do inss?", "recurso-prazo"],
  ["o inss negou meu beneficio o que fazer?", "indeferido"],
  ["como funciona aposentadoria especial por insalubridade?", "especial-ppp"],
  ["quem tem direito ao bpc loas?", "bpc-renda"],
  ["como funciona a pensao por morte?", "pensao-duracao"],
  ["quem tem direito ao salario maternidade?", "salario-maternidade"],
  ["desempregada tem direito a salario-maternidade?", "salario-maternidade"],
  ["aposentado com cancer tem isencao de imposto de renda?", "ir-doenca-grave"],
  ["estao descontando mensalidade de associacao da minha aposentadoria", "descontos-beneficio"],
  ["como me preparar para a pericia do inss?", "pericia-inss"],
  ["como funciona a aposentadoria do servidor publico?", "servidor-aposentadoria"],
  ["parei de contribuir, ate quando continuo segurado?", "periodo-graca"],
  ["quem tem direito ao auxilio acidente?", "auxilio-acidente"],
  ["como funciona a aposentadoria rural?", "rural"],
  ["posso converter tempo especial em comum?", "conversao-especial"],
  ["como funciona o auxilio reclusao?", "auxilio-reclusao"],
  ["ainda da pra pedir a revisao da vida toda?", "vida-toda"],
  ["quem tem direito ao acrescimo de 25% na aposentadoria?", "adicional-25"],
  ["contribuo como mei, conta pra aposentadoria?", "complementacao"],
  ["servico militar conta como tempo de contribuicao?", "tempo-militar"],
  // Saúde
  ["o plano pode negar cirurgia que o medico pediu?", "plano-negou"],
  ["como funciona a carencia do plano?", "carencia-urgencia"],
  ["qual o prazo maximo para o plano marcar consulta?", "prazo-atendimento"],
  ["o plano pode aumentar a mensalidade por idade depois dos 60?", "reajuste-idade"],
  ["como conseguir remedio pelo sus?", "sus-remedio"],
  ["o plano tem que cobrir terapia para autismo?", "tea-terapia"],
  ["consigo uma liminar para tomar monjaro?", "liminar-medicamento"],
  ["o plano tem que pagar ozempic?", "liminar-medicamento"],
  ["fui demitido, posso manter o plano de saude?", "manter-plano"],
  ["o plano cobre bariatrica?", "bariatrica"],
  ["o plano tem que cobrir quimioterapia?", "oncologico"],
  ["quando o plano tem que dar reembolso?", "reembolso"],
  ["fui vitima de erro medico, o que fazer?", "erro-medico"],
  ["o plano tem que cobrir home care?", "home-care"],
  ["o plano pode cancelar meu contrato durante o tratamento?", "cancelamento-plano"],
  ["o plano cobre internacao por vicio em apostas?", "saude-mental"],
  ["ganhei a liminar mas o plano nao esta cumprindo", "liminar-descumprida"],
  ["o plano pode negar a protese da cirurgia?", "opme-protese"],
  ["o plano cobre fertilizacao in vitro?", "fertilizacao"],
  ["como fazer portabilidade de carencias?", "portabilidade"],
  ["nao tem vaga de uti no sus, o que fazer?", "uti-sus"],
  ["o plano odontologico cobre implante?", "odontologico"],
  // Consumidor
  ["posso desistir de compra pela internet?", "arrependimento"],
  ["comprei um produto com defeito, quais meus direitos?", "defeito"],
  ["quais meus direitos com voo atrasado?", "voo"],
  ["minha mala foi extraviada, o que fazer?", "voo"],
  ["meu nome foi negativado, o que fazer?", "negativado"],
  ["paguei uma cobranca indevida, recebo em dobro?", "cobranca-dobro"],
  ["cai num golpe no pix, consigo o dinheiro de volta?", "pix-golpe"],
  ["apareceu um consignado que eu nao contratei", "consignado-nao-contratado"],
  ["estou superendividado, o que posso fazer?", "superendividamento"],
  ["o banco fez busca e apreensao do meu carro", "busca-apreensao"],
  ["como cancelar a operadora de internet?", "telefonia"],
  ["a seguradora negou o pagamento do seguro", "seguro-negado"],
  ["comprei na internet e nao chegou", "compra-nao-entregue"],
  ["podem cortar minha luz?", "corte-luz-agua"],
  ["a construtora atrasou a entrega do apartamento", "imovel-planta"],
  ["os juros do meu financiamento sao abusivos?", "juros-abusivos"],
  ["apareceram compras no cartao que nao fiz", "compra-nao-reconhecida"],
  ["roubaram meu celular e mexeram no aplicativo do banco", "conta-invadida"],
  ["o banco cobrou seguro prestamista que nao pedi", "tarifas-venda-casada"],
  ["posso cancelar a academia sem multa?", "academia-curso"],
  ["tive problema com pacote de viagem, quem responde?", "turismo"],
  ["meus dados vazaram, tenho direito a indenizacao?", "vazamento-dados"],
  // Administrativo
  ["como funciona a defesa no pad?", "pad-prazo"],
  ["qual a prescricao de infracao disciplinar?", "pad-prescricao"],
  ["fui aprovado no concurso, tenho direito a nomeacao?", "concurso-vagas"],
  ["fui eliminado no psicotecnico do concurso, posso recorrer?", "concurso-eliminacao"],
  ["fui eliminado na heteroidentificacao", "heteroidentificacao"],
  ["qual o prazo para recorrer em licitacao?", "licitacao-recurso"],
  ["o orgao publico nao paga minha empresa", "orgao-nao-paga"],
  ["como recorrer de multa de transito?", "multa-transito"],
  ["vou ter a cnh suspensa, o que fazer?", "multa-transito"],
  ["fui citado pelo tribunal de contas, o que significa?", "tribunal-contas"],
  ["quais direitos do servidor costumam ser negados, como progressao?", "direitos-servidor"],
  ["fui acusado de improbidade, o que mudou?", "improbidade"],
  ["a prefeitura causou um acidente por buraco, posso pedir indenizacao?", "responsabilidade-estado"],
  ["meu imovel vai ser desapropriado", "desapropriacao"],
  ["como fazer pedido de acesso a informacao?", "lai"],
  ["recebi auto de infracao da vigilancia sanitaria", "auto-infracao"],
  // Cartório
  ["como fazer inventario em cartorio?", "inventario-cartorio"],
  ["posso me divorciar em cartorio?", "divorcio-cartorio"],
  ["posso mudar meu nome no cartorio?", "mudar-nome"],
  ["como regularizar imovel por usucapiao?", "usucapiao"],
  ["como formalizar uniao estavel?", "uniao-estavel"],
  ["como fazer um testamento?", "testamento"],
  ["doacao com usufruto vale a pena?", "planejamento-sucessorio"],
  ["paguei o imovel e o vendedor nao passa a escritura", "adjudicacao"],
  ["como cancelar um protesto?", "protesto"],
  ["como usar prints de whatsapp como prova?", "ata-notarial"],
  ["como funciona o itcmd?", "itcmd"],
  ["o que preciso para comprar um imovel com seguranca?", "compra-imovel"],
  ["moro em area irregular, como fazer reurb?", "reurb"],
  ["posso reconhecer filho socioafetivo no cartorio?", "socioafetiva"],
  ["posso mudar o regime de bens?", "regime-bens"],
  ["como apostilar documento para cidadania?", "apostila"],
  ["como sacar o fgts de quem faleceu?", "alvara-valores"],
  ["preciso fazer inventario negativo?", "inventario-negativo"],
  ["posso vender minha parte da heranca?", "cessao-hereditaria"],
  ["o que acontece com criptomoedas de quem morreu?", "heranca-digital"],
];

let falhas = 0;
for (const [q, esperado] of CASOS) {
  const f = findFaq(q);
  const obtido = f ? f.id : "(sem resposta)";
  if (obtido !== esperado) { falhas++; console.log(`✗ "${q}"\n    esperado: ${esperado} · obtido: ${obtido}`); }
  if (!isQuestion(q) && !q.endsWith("?")) {} // frases afirmativas também são aceitas como relato
}
const semTeste = FAQ.map((f) => f.id).filter((id) => !CASOS.some(([, e]) => e === id));
console.log(`\n${CASOS.length - falhas}/${CASOS.length} perguntas na resposta certa.`);
if (semTeste.length) console.log(`Respostas sem pergunta de teste: ${semTeste.join(", ")}`);
process.exit(falhas ? 1 : 0);
