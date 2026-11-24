// Autismo (TEA): direitos na escola, no dia a dia, do servidor com filho autista e benefícios.
// Revisado pela advogada em 24/11/2026 (Tema 1.097, ADI 5.357, LC 840/2011 art. 61, passe livre).
const LTEA = ["Lei 12.764/2012 (Política Nacional da Pessoa com TEA)", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm"];
const LBI = ["Lei 13.146/2015 (Estatuto da Pessoa com Deficiência)", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm"];
const LCIPTEA = ["Lei 13.977/2020 (Carteira de Identificação da Pessoa com TEA)", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l13977.htm"];
Object.assign(ROTEIROS, {
  "tea-escola": {
    acolhe: "A criança autista tem direito de estudar na escola regular, com o apoio de que precisa — e a escola não pode recusar a matrícula nem cobrar a mais por isso.",
    perguntas: [{ q: "Qual é o problema na escola?", a: ["Recusaram a matrícula", "Não dão acompanhante ou mediador", "Querem cobrar taxa extra", "Reduziram o horário da criança", "Outro"] }, { q: "A escola é pública ou particular?", a: ["Pública", "Particular"] }],
    lei: [
      "A pessoa com TEA é considerada pessoa com deficiência para todos os efeitos legais (Lei 12.764/2012, art. 1º, §2º).",
      "Em caso de necessidade comprovada, a pessoa com TEA incluída em classe comum tem direito a acompanhante especializado (Lei 12.764/2012, art. 3º, parágrafo único).",
      "A escola deve oferecer profissional de apoio escolar e adaptações razoáveis; a escola particular não pode cobrar valor adicional de qualquer natureza por isso (Lei 13.146/2015, art. 28, XVII e §1º).",
      "O gestor escolar que recusar a matrícula de aluno com TEA ou outra deficiência pode ser punido com multa (Lei 12.764/2012, art. 7º).",
    ],
    juris: ["STF, ADI 5.357: o STF manteve a validade do art. 28, §1º, e do art. 30 da Lei 13.146/2015. A escola particular deve cumprir as obrigações de inclusão e acessibilidade sem cobrar valor adicional na matrícula, na mensalidade ou na anuidade. A proteção alcança estudantes com TEA."],
    prazos: ["Não há prazo específico, mas cada semana sem apoio prejudica a criança: registre o pedido por escrito logo."],
    docs: ["Laudo com o diagnóstico (CID F84 ou 6A02)", "Relatório do médico ou terapeuta indicando a necessidade de acompanhante", "Pedido feito à escola e resposta (e-mail, protocolo)", "Contrato e boletos, se for escola particular"],
    passos: ["Peça por escrito à escola o profissional de apoio ou o acompanhante, juntando o laudo.", "Guarde a resposta. Na escola pública, também é possível reclamar na Secretaria de Educação.", "Se houver recusa, cobrança extra ou redução de horário, procure a advogada: cabe ação, inclusive com pedido urgente."],
    urgente: ["A escola recusou a matrícula", "A criança está sem ir à escola por falta de apoio"],
    fontes: [LTEA, LBI],
  },
  "tea-direitos": {
    acolhe: "Quem tem autismo tem uma série de direitos no dia a dia — muitos pouco conhecidos pelas famílias.",
    perguntas: [{ q: "O que você quer saber?", a: ["Carteira de identificação (CIPTEA)", "Atendimento prioritário", "Benefício do INSS (BPC)", "Isenção na compra de carro", "Passe livre em ônibus e metrô"] }],
    lei: [
      "A pessoa com TEA é pessoa com deficiência para todos os efeitos legais e tem direito a atendimento prioritário (Lei 12.764/2012, art. 1º, §2º; Lei 10.048/2000).",
      "A Carteira de Identificação da Pessoa com TEA (CIPTEA) é emitida gratuitamente pelos órgãos estaduais e municipais responsáveis e serve para garantir atenção integral e prioridade (Lei 13.977/2020).",
      "Pessoas com TEA podem ter isenção de IPI e de IOF na compra de veículo, conforme as regras e os limites da Receita Federal (Lei 8.989/1995).",
      "Com renda familiar baixa, a pessoa com TEA pode ter direito ao BPC/LOAS: um salário mínimo por mês, pago pelo INSS, após avaliação da deficiência e da renda.",
      "Passe livre interestadual: pessoa com deficiência, inclusive com TEA, e com renda familiar de até um salário mínimo por pessoa pode viajar de graça em ônibus, trem ou barco entre estados, com dois assentos reservados por veículo no serviço convencional; o acompanhante também viaja de graça quando a necessidade é registrada pelo médico no sistema da ANTT (Lei 8.899/1994; Decreto 3.691/2000).",
      "No DF, a pessoa com TEA pode pedir o Passe Livre Especial para ônibus, BRT e metrô da rede integrada, com laudo e comprovante de residência no DF. O GDF não exige mais comprovação de renda. A gratuidade vale também para um acompanhante cadastrado por viagem, quando a necessidade constar no laudo (Lei distrital 6.637/2020; Portaria Conjunta 4/2025).",
    ],
    juris: [],
    prazos: [],
    docs: ["Laudo com o diagnóstico", "Documentos pessoais e do responsável", "Comprovantes de renda da família (para o BPC)", "Inscrição no CadÚnico atualizada (para o BPC)"],
    passos: ["Tire a CIPTEA no órgão indicado pelo seu estado ou município.", "Para o BPC, atualize o CadÚnico e faça o pedido pelo Meu INSS ou pelo 135.", "Se algum direito for negado, guarde a negativa por escrito e procure a advogada."],
    urgente: ["BPC negado ou cortado"],
    fontes: [LTEA, LCIPTEA, ["Lei 8.989/1995 (isenção de IPI)", "https://www.planalto.gov.br/ccivil_03/leis/l8989.htm"], ["Lei 8.899/1994 (passe livre interestadual)", "https://www.planalto.gov.br/ccivil_03/leis/l8899.htm"]],
  },
  "tea-servidor-horario": {
    acolhe: "Servidor público que tem filho, cônjuge ou dependente com autismo pode ter direito a horário especial, sem compensar horas e sem perder salário.",
    perguntas: [{ q: "Você é servidor de qual esfera?", a: ["Federal", "Do DF", "Estadual", "Municipal"] }, { q: "O pedido já foi feito?", a: ["Ainda não", "Foi negado", "Está parado"] }],
    lei: [
      "No regime federal, o servidor que tenha cônjuge, filho ou dependente com deficiência tem direito a horário especial, independentemente de compensação de horário, comprovada a necessidade por junta médica oficial (Lei 8.112/1990, art. 98, §§2º e 3º).",
      "A pessoa com TEA é considerada pessoa com deficiência para todos os efeitos legais (Lei 12.764/2012, art. 1º, §2º).",
      "No DF, o servidor com deficiência ou doença falciforme, ou que tenha cônjuge ou dependente nessa condição (o filho entra como dependente), tem direito a redução de até 50% da jornada, sem compensação. A junta médica oficial atesta a necessidade e a dependência é comprovada na gestão de pessoas (LC distrital 840/2011, art. 61).",
    ],
    juris: ["STF, Tema 1.097 (RE 1.237.867): na falta de previsão local, o art. 98, §§2º e 3º, da Lei 8.112/1990 se aplica, para todos os efeitos, aos servidores estaduais e municipais — tanto ao servidor com deficiência quanto ao que tenha cônjuge, filho ou dependente com deficiência, com necessidade comprovada por junta médica oficial e sem compensação de horário. A tese não fixa percentual de redução."],
    prazos: [],
    docs: ["Laudo do filho ou dependente", "Relatório com a rotina de terapias e cuidados", "Certidão de nascimento ou comprovante de dependência", "Pedido feito ao órgão e resposta"],
    passos: ["Faça o pedido por escrito ao setor de pessoal, com o laudo e a rotina de terapias.", "Compareça à junta médica oficial, se for convocado(a).", "Se negado ou parado, procure a advogada: cabe recurso e, se preciso, ação com pedido urgente."],
    urgente: ["Pedido negado e rotina de terapias prejudicada"],
    fontes: [["Lei 8.112/1990, art. 98", "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm"], ["LC distrital 840/2011, art. 61", "https://www.sinj.df.gov.br/sinj/Norma/70196/LC_840.html"], ["STF, Tema 1.097", "https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?classeProcesso=RE&incidente=5785185&numeroProcesso=1237867&numeroTema=1097"], LTEA],
  },
});
Object.assign(DUVIDAS_CASOS, {
  "tea-escola": [
    ["A escola particular pode cobrar a mais pelo acompanhante?", "Não. A lei proíbe cobrança adicional de qualquer natureza, e o STF confirmou essa regra."],
    ["A escola pode reduzir o horário do meu filho por causa do autismo?", "Não como regra. A redução só faz sentido se for indicada pela equipe que acompanha a criança e combinada com a família. Imposta pela escola, pode ser discriminação."],
    ["Mediador e acompanhante são a mesma coisa?", "Os nomes variam. O que a lei garante é o apoio de que a criança precisa, conforme indicação profissional, na sala de aula comum."],
  ],
  "tea-direitos": [
    ["Autismo é considerado deficiência?", "Sim. A Lei 12.764/2012 diz que a pessoa com TEA é pessoa com deficiência para todos os efeitos legais."],
    ["Meu filho autista tem passe livre no ônibus do DF?", "Pode pedir o Passe Livre Especial, com laudo e comprovante de residência no DF; não é mais exigida comprovação de renda. Se o laudo indicar necessidade, um acompanhante cadastrado também viaja de graça."],
    ["Preciso da CIPTEA para ter prioridade?", "A carteira facilita, mas o direito à prioridade decorre da lei. O laudo também serve para comprovar."],
    ["Meu filho autista pode receber BPC?", "Pode, se a família tiver renda baixa e a avaliação do INSS confirmar a deficiência. Vale atualizar o CadÚnico antes do pedido."],
  ],
  "tea-servidor-horario": [
    ["Vou perder salário com o horário especial?", "Não. Na regra federal, o horário especial é concedido sem compensação e sem redução da remuneração."],
    ["Sou servidor do estado ou do município. Tenho esse direito?", "Sim. No Tema 1.097, o STF decidiu que, se a lei local não prevê, vale a regra federal do art. 98 da Lei 8.112/1990, com junta médica oficial e sem compensação de horário."],
    ["Sou servidor do DF. Quanto posso reduzir?", "A LC distrital 840/2011 (art. 61) prevê redução de até 50% da jornada, sem compensação, atestada pela junta médica oficial."],
    ["O órgão negou porque já tenho redução de jornada. E agora?", "Cada caso precisa de análise. Leve a negativa à advogada para avaliar recurso ou ação."],
  ],
});

["tea-escola", "tea-direitos", "tea-servidor-horario"].forEach((id) => (ROTEIROS_REVISADOS[id] = "2026-11-24"));
