// Roteiros por situação: acolhimento → 3 perguntas (vão para a advogada) → o que a lei diz → como os tribunais
// decidem → prazos → documentos → o que fazer → quando é urgente → "consulte a advogada".
// Itens que começam com "[CONFERIR]" NÃO aparecem para o público até a revisão da advogada.

// Caixinhas "ⓘ O que é isso?" — termos técnicos em linguagem simples.
const GLOSSARIO = {
  "plano individual": "Plano contratado por você, direto com a operadora, só para você ou sua família. O reajuste anual tem limite fixado pela ANS.",
  "plano coletivo": "Plano contratado por meio de uma empresa (coletivo empresarial) ou de uma associação, sindicato ou conselho de classe (coletivo por adesão). O reajuste é negociado entre a operadora e quem contratou.",
  "autogestão": "Plano mantido por uma empresa, órgão público ou entidade só para seus funcionários e familiares (ex.: Cassi, Geap, Saúde Caixa). Segundo o STJ, o Código de Defesa do Consumidor não se aplica a eles, mas a Lei dos Planos de Saúde sim.",
  "urgência": "Situação causada por acidente pessoal ou por complicação na gravidez (Lei 9.656/1998, art. 35-C).",
  "emergência": "Situação com risco imediato de morte ou de lesão irreparável, declarada pelo médico (Lei 9.656/1998, art. 35-C).",
  "rol da ans": "Lista de exames, consultas, cirurgias e terapias que os planos são obrigados a cobrir. É atualizada pela ANS. Tratamentos fora da lista podem ter de ser cobertos em situações definidas em lei e pelo STF.",
  "nip": "Notificação de Intermediação Preliminar: a reclamação que você registra na ANS. A ANS avisa a operadora, que tem prazo para resolver ou se justificar.",
  "carência": "Tempo que você precisa esperar, depois de contratar o plano, para usar certos serviços. A lei fixa os prazos máximos.",
  "anvisa": "Agência que autoriza (registra) remédios e produtos de saúde no Brasil.",
  "liminar": "Decisão rápida do juiz, no começo do processo, para garantir algo urgente (como um remédio ou cirurgia) antes da decisão final.",
  "coparticipação": "Quando você paga uma parte de cada consulta ou exame que usa, além (ou no lugar) da mensalidade.",
};

const ROTEIROS = {
  "plano-negou": {
    acolhe: "Isso acontece bastante, e a lei tem regras claras para a negativa de cobertura.",
    perguntas: [
      { q: "Você recebeu a negativa por escrito?", a: ["Sim", "Não", "Só por telefone ou aplicativo"] },
      { q: "É urgência ou emergência?", a: ["Sim", "Não", "Não sei"], ajuda: ["urgência", "emergência"] },
      { q: "Qual o tipo do seu plano?", a: ["Individual ou familiar", "Coletivo (empresa ou associação)", "Autogestão", "Não sei"], ajuda: ["plano individual", "plano coletivo", "autogestão"] },
    ],
    lei: [
      "O plano só pode negar com base no contrato e nas regras da ANS, e toda negativa deve ser informada por escrito, com o motivo (Resolução Normativa ANS 623/2024).",
      "O que está no rol da ANS é de cobertura obrigatória conforme o tipo de plano. Tratamento fora do rol pode ter de ser coberto quando houver comprovação científica de eficácia ou recomendação de órgão técnico (Lei 9.656/1998, art. 10, §13, incluído pela Lei 14.454/2022).",
      "Em urgência e emergência, o atendimento é obrigatório e a carência máxima é de 24 horas (Lei 9.656/1998, arts. 12, V, “c”, e 35-C).",
    ],
    juris: [
      "STJ, Súmula 608: o Código de Defesa do Consumidor se aplica aos planos de saúde, exceto os de autogestão.",
      "STJ, Súmula 597: é abusiva a carência acima de 24 horas para atendimento de urgência ou emergência.",
      "STF, ADI 7265 (2025): fixou requisitos que, juntos, obrigam a cobertura fora do rol — prescrição do médico, ausência de negativa expressa da ANS, inexistência de alternativa no rol, eficácia e segurança comprovadas por evidência científica e registro na Anvisa.",
    ],
    prazos: [
      "A operadora deve responder ao pedido: na hora, em urgência e emergência; em até 5 dias úteis, em consultas, exames e procedimentos comuns; em até 10 dias úteis, em alta complexidade e internação eletiva (RN ANS 623/2024).",
      "Na reclamação à ANS (NIP), a operadora é notificada e tem prazo curto para resolver ou se justificar.",
    ],
    docs: ["Pedido médico com justificativa (e relatório, se possível)", "Negativa por escrito ou número de protocolo", "Carteirinha e contrato do plano", "Exames e laudos relacionados"],
    passos: ["Peça a negativa por escrito e anote o protocolo.", "Peça reanálise à Ouvidoria da operadora.", "Registre reclamação na ANS (NIP) pelo site ou pelo 0800 701 9656.", "Se for urgente, procure a advogada no mesmo dia: pode caber pedido de liminar."],
    urgente: ["Risco à vida ou à saúde", "Cirurgia já marcada ou tratamento interrompido", "Internação negada"],
    fontes: [["Lei 9.656/1998", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"], ["Lei 14.454/2022", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14454.htm"], ["ANS — reclamações (NIP)", "https://www.gov.br/ans/pt-br/canais_atendimento"], ["STF — ADI 7265", "https://portal.stf.jus.br/processos/detalhe.asp?incidente=6501465"]],
  },

  "prazo-atendimento": {
    acolhe: "A ANS fixa prazos máximos para o plano garantir o atendimento — e eles valem para todos os planos.",
    perguntas: [
      { q: "O que você está esperando?", a: ["Consulta", "Exame", "Terapia (fono, psicólogo, fisio...)", "Cirurgia ou internação"] },
      { q: "Há quantos dias úteis?", a: ["Até 7", "De 8 a 21", "Mais de 21"] },
      { q: "Você tem o número de protocolo do pedido?", a: ["Sim", "Não"] },
    ],
    lei: [
      "Os prazos máximos, contados em dias úteis desde o pedido, são: consulta em pediatria, clínica médica, cirurgia geral, ginecologia e obstetrícia — 7 dias; demais especialidades — 14 dias; consulta e sessão com fonoaudiólogo, nutricionista, psicólogo, terapeuta ocupacional e fisioterapeuta — 10 dias; exames laboratoriais — 3 dias; demais exames e terapias ambulatoriais — 10 dias; procedimentos de alta complexidade e internação eletiva — 21 dias; urgência e emergência — imediato (Resolução Normativa ANS 566/2022).",
      "Os prazos valem depois de cumpridas as carências.",
      "Se não houver profissional disponível na rede dentro do prazo, a operadora deve garantir o atendimento por outro prestador, conforme as regras da RN 566/2022.",
    ],
    juris: ["Os tribunais costumam reconhecer o dever de a operadora garantir o atendimento quando a demora descumpre os prazos da ANS, inclusive com reembolso de atendimento particular, conforme o caso."],
    prazos: ["Conte os dias úteis a partir do pedido. Passou do prazo, você já pode reclamar na ANS."],
    docs: ["Número de protocolo do pedido", "Pedido médico", "Prints ou e-mails da operadora sobre a falta de horário"],
    passos: ["Peça à operadora um horário dentro do prazo e anote o protocolo.", "Se não resolver, registre reclamação na ANS (NIP).", "Se precisou pagar particular, guarde notas e recibos."],
    urgente: ["Tratamento contínuo interrompido", "Piora do quadro enquanto espera", "Cirurgia ou internação sem data"],
    fontes: [["ANS — prazos máximos de atendimento", "https://www.gov.br/ans/pt-br/assuntos/consumidor/prazos-maximos-de-atendimento"], ["Lei 9.656/1998", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"]],
  },

  "liminar-medicamento": {
    acolhe: "Remédio caro negado é uma das situações mais comuns na Justiça — e há regras específicas para o plano e para o SUS.",
    perguntas: [
      { q: "Quem negou o remédio?", a: ["Plano de saúde", "SUS", "Os dois"] },
      { q: "O remédio tem registro na Anvisa?", a: ["Sim", "Não", "Não sei"], ajuda: ["anvisa"] },
      { q: "O uso indicado pelo médico é o que está na bula?", a: ["Sim", "Não (uso fora da bula)", "Não sei"] },
    ],
    lei: [
      "Planos: devem cobrir o que está no rol da ANS; fora do rol, a cobertura depende dos critérios da Lei 9.656/1998, art. 10, §13 (Lei 14.454/2022).",
      "SUS: fornece os medicamentos incorporados às listas oficiais; fora delas, o pedido precisa seguir os requisitos fixados pelo STF.",
    ],
    juris: [
      "STJ, Tema 990: o plano não é obrigado a fornecer medicamento sem registro na Anvisa.",
      "STF, ADI 7265 (2025): requisitos para a cobertura fora do rol pelos planos, entre eles eficácia comprovada por evidência científica e registro na Anvisa.",
      "STF, Temas 6 e 1234 e Súmulas Vinculantes 60 e 61: definem quem deve fornecer e os requisitos para obter na Justiça remédio não incorporado ao SUS, entre eles registro na Anvisa, negativa administrativa, falta de alternativa no SUS e comprovação científica.",
    ],
    prazos: ["Não há prazo curto para pedir, mas a demora pode agravar a doença: em caso de risco, peça com urgência."],
    docs: ["Receita e relatório médico detalhado (diagnóstico, por que este remédio, por que não as alternativas)", "Negativa do plano ou do SUS por escrito", "Exames que mostram a gravidade", "Orçamento do remédio"],
    passos: ["Peça a negativa por escrito.", "Peça ao médico um relatório completo, citando estudos e as alternativas já tentadas.", "No SUS, faça o pedido administrativo na Secretaria de Saúde e guarde o protocolo.", "Procure a advogada para avaliar o pedido de liminar."],
    urgente: ["Doença grave ou progressiva", "Tratamento já iniciado e interrompido", "Risco de sequela ou morte"],
    fontes: [["Lei 9.656/1998", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"], ["STF — medicamentos (Temas 6 e 1234)", "https://portal.stf.jus.br/"], ["STJ — Tema 990", "https://processo.stj.jus.br/repetitivos/temas_repetitivos/"]],
  },

  "reajuste-idade": {
    acolhe: "Reajuste alto assusta, mas há limites na lei — principalmente depois dos 60 anos.",
    perguntas: [
      { q: "Que tipo de reajuste foi?", a: ["Por mudança de idade", "Anual", "Os dois", "Não sei"] },
      { q: "Você tem 60 anos ou mais?", a: ["Sim", "Não"] },
      { q: "Qual o tipo do seu plano?", a: ["Individual ou familiar", "Coletivo (empresa ou associação)", "Autogestão", "Não sei"], ajuda: ["plano individual", "plano coletivo", "autogestão"] },
    ],
    lei: [
      "O Estatuto da Pessoa Idosa proíbe cobrar valores diferentes em razão da idade da pessoa idosa (Lei 10.741/2003, art. 15, §3º).",
      "Nos contratos a partir de 2004, as faixas de idade vão até 59 anos; depois disso não há novo reajuste por idade, e o valor da última faixa não pode passar de 6 vezes o da primeira (Resolução Normativa ANS 63/2003).",
      "O reajuste anual dos planos individuais tem limite máximo fixado pela ANS; nos coletivos, é negociado, mas deve ser informado e justificado.",
    ],
    juris: [
      "STJ, Tema 952: o reajuste por idade em plano individual é válido se estiver no contrato, seguir as normas da ANS e não usar percentuais sem base ou que discriminem a pessoa idosa.",
      "STJ, Tema 1016: o mesmo entendimento vale para os planos coletivos, com ressalvas.",
    ],
    prazos: ["Valores pagos a mais podem ser pedidos de volta, observados os prazos de prescrição — guarde os boletos."],
    docs: ["Contrato com a tabela de faixas de idade", "Boletos antes e depois do reajuste", "Comunicado do reajuste"],
    passos: ["Peça à operadora a memória de cálculo do reajuste.", "Compare com o contrato e com o limite da ANS (planos individuais).", "Reclame na ANS (NIP) e procure a advogada se o aumento for desproporcional."],
    urgente: ["Risco de cancelamento por falta de pagamento", "Aumento que inviabiliza manter o plano"],
    fontes: [["Estatuto da Pessoa Idosa", "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm"], ["ANS — reajustes", "https://www.gov.br/ans/pt-br/assuntos/consumidor/reajustes-de-precos-de-planos-de-saude"], ["STJ — Temas 952 e 1016", "https://processo.stj.jus.br/repetitivos/temas_repetitivos/"]],
  },

  "tea-terapia": {
    acolhe: "As regras sobre terapias para autismo mudaram bastante nos últimos anos — a favor dos pacientes.",
    perguntas: [
      { q: "O plano limitou o número de sessões?", a: ["Sim", "Não", "Não sei"] },
      { q: "O plano negou o método indicado (ex.: ABA)?", a: ["Sim", "Não"] },
      { q: "Há prescrição do médico com o diagnóstico?", a: ["Sim", "Não"] },
    ],
    lei: [
      "A pessoa com transtorno do espectro autista é considerada pessoa com deficiência para todos os efeitos legais (Lei 12.764/2012).",
      "A ANS garante número ilimitado de sessões com psicólogo, fonoaudiólogo, terapeuta ocupacional e fisioterapeuta para pacientes com TEA (RN 469/2021) e retirou os limites de sessões dessas terapias (RN 541/2022).",
      "O plano deve cobrir o método ou técnica indicado pelo médico assistente para pacientes com transtornos globais do desenvolvimento (RN 539/2022).",
    ],
    juris: ["Os tribunais, seguindo o STJ, têm reconhecido o dever de cobertura das terapias multidisciplinares para TEA sem limite de sessões, quando prescritas."],
    prazos: ["Prazos de atendimento: até 10 dias úteis para sessões com fono, psicólogo, terapeuta ocupacional e fisioterapeuta (RN 566/2022)."],
    docs: ["Laudo com o diagnóstico (CID F84)", "Prescrição detalhada: terapias, método e carga horária", "Negativa ou limitação por escrito"],
    passos: ["Peça a negativa por escrito.", "Peça reanálise à Ouvidoria e registre reclamação na ANS (NIP).", "Se o tratamento for interrompido, procure a advogada com urgência."],
    urgente: ["Tratamento interrompido", "Criança sem terapia na fase de desenvolvimento"],
    fontes: [["Lei 12.764/2012", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm"], ["ANS — TEA", "https://www.gov.br/ans/pt-br"]],
  },

  "manter-plano": {
    acolhe: "Quem sai da empresa pode ter direito de continuar no plano — depende principalmente de ter contribuído com a mensalidade.",
    perguntas: [
      { q: "Você foi demitido(a) ou se aposentou?", a: ["Demitido(a) sem justa causa", "Aposentado(a)", "Pedi demissão", "Demitido(a) por justa causa"] },
      { q: "Você pagava parte da mensalidade (descontada no salário)?", a: ["Sim", "Não, só coparticipação", "Não pagava nada", "Não sei"], ajuda: ["coparticipação"] },
      { q: "Por quanto tempo contribuiu para o plano?", a: ["Menos de 10 anos", "10 anos ou mais"] },
    ],
    lei: [
      "Demitido(a) sem justa causa que contribuía: pode continuar no plano por 1/3 do tempo em que contribuiu, com mínimo de 6 e máximo de 24 meses, assumindo o pagamento integral (Lei 9.656/1998, art. 30).",
      "Aposentado(a) que contribuiu por 10 anos ou mais: pode continuar sem prazo; com menos de 10 anos, 1 ano para cada ano de contribuição, assumindo o pagamento integral (Lei 9.656/1998, art. 31).",
      "Quem pede demissão ou é demitido por justa causa não tem esse direito pela lei.",
    ],
    juris: [
      "STJ, Tema 989: se o plano era pago só pela empresa, não há direito de permanência (salvo previsão em contrato ou acordo coletivo), e pagar só coparticipação não conta como contribuição.",
      "STJ, Tema 1034: o aposentado não tem direito de ficar no mesmo plano para sempre — pode haver troca de operadora e de custeio, desde que mantidas as mesmas condições dos empregados ativos.",
    ],
    prazos: ["[CONFERIR] Prazo para manifestar o interesse em continuar no plano após o desligamento (RN ANS 488/2021).", "Fique atento(a): a empresa deve informar você sobre o direito de continuar no plano."],
    docs: ["Termo de rescisão ou carta de concessão da aposentadoria", "Contracheques com o desconto do plano", "Comunicado da empresa sobre o plano"],
    passos: ["Peça à empresa, por escrito, a opção de continuar no plano.", "Confira nos contracheques se havia desconto de mensalidade.", "Se negarem, reclame na ANS e procure a advogada."],
    urgente: ["Tratamento em andamento", "Plano cancelado sem aviso"],
    fontes: [["Lei 9.656/1998, arts. 30 e 31", "https://www.planalto.gov.br/ccivil_03/leis/l9656.htm"], ["STJ — Temas 989 e 1034", "https://processo.stj.jus.br/repetitivos/temas_repetitivos/"]],
  },
};
