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
  "cnis": "Cadastro Nacional de Informações Sociais: o extrato com todos os seus empregos e contribuições registrados no INSS. Baixe no Meu INSS.",
  "crps": "Conselho de Recursos da Previdência Social: o órgão que julga os recursos contra decisões do INSS. O recurso é feito pelo Meu INSS.",
  "carência inss": "Número mínimo de contribuições mensais exigido para alguns benefícios (ex.: 180 para aposentadoria por idade, 12 para auxílio por incapacidade, em regra).",
  "qualidade de segurado": "Estar protegido(a) pelo INSS: quem contribui, ou parou há pouco tempo (o chamado “período de graça”), mantém o direito aos benefícios.",
  "cadúnico": "Cadastro Único do governo federal para programas sociais. É obrigatório para pedir o BPC e deve estar atualizado. Feito no CRAS da sua cidade.",
  "avaliação biopsicossocial": "Avaliação feita pelo INSS com perícia médica e avaliação social, que considera a deficiência e as barreiras do dia a dia, e não só a doença.",
  "pedágio": "Tempo extra de contribuição exigido em algumas regras de transição da Reforma de 2019, calculado sobre o que faltava em 13/11/2019.",
  "união estável": "Convivência pública, contínua e duradoura com intenção de formar família, mesmo sem casamento no papel.",
  "consignado": "Empréstimo descontado direto do benefício ou do salário.",
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

  // ---------------- INSS e aposentadoria ----------------
  "indeferido": {
    acolhe: "Benefício negado não é o fim: dá para recorrer no próprio INSS ou ir à Justiça.",
    perguntas: [
      { q: "Qual benefício foi negado?", a: ["Aposentadoria", "Auxílio por incapacidade (auxílio-doença)", "BPC/LOAS", "Pensão por morte", "Outro"] },
      { q: "Qual foi o motivo da negativa?", a: ["Perícia (não reconheceu a incapacidade)", "Falta de tempo ou de carência", "Perda da qualidade de segurado", "Renda acima do limite (BPC)", "Não sei"], ajuda: ["carência inss", "qualidade de segurado"] },
      { q: "Quando você recebeu a decisão?", a: ["Há menos de 30 dias", "Há mais de 30 dias", "Não sei"] },
    ],
    lei: [
      "Da decisão do INSS cabe recurso ao Conselho de Recursos da Previdência Social (CRPS), feito pelo Meu INSS (Lei 8.213/1991, art. 126).",
      "O prazo do recurso é de 30 dias contados da ciência da decisão (Decreto 3.048/1999, art. 305).",
      "Também é possível pedir na Justiça — nos Juizados Especiais Federais, causas de até 60 salários mínimos (Lei 10.259/2001, art. 3º).",
    ],
    juris: [
      "STF, Tema 350 (RE 631.240): para ir à Justiça é preciso ter feito o pedido ao INSS antes — e a negativa (ou a demora excessiva) permite a ação.",
      "As parcelas atrasadas podem ser cobradas dos últimos 5 anos (Lei 8.213/1991, art. 103, parágrafo único).",
    ],
    prazos: ["30 dias para o recurso administrativo, a partir da ciência da decisão.", "Perdeu o prazo do recurso? Ainda pode fazer novo pedido ou ir à Justiça."],
    docs: ["Carta de indeferimento (Meu INSS → Consultar pedidos)", "Extrato do CNIS", "Laudos, exames e receitas recentes (se for incapacidade)", "Carteiras de trabalho e carnês"],
    passos: ["Baixe a carta de indeferimento e o CNIS no Meu INSS.", "Veja o motivo exato da negativa.", "Reúna os documentos que faltaram ou que provam o contrário.", "Recorra em 30 dias pelo Meu INSS — ou procure a advogada para avaliar recurso ou ação."],
    urgente: ["Prazo de 30 dias acabando", "Doença que impede trabalhar e você está sem renda", "Benefício cortado de repente"],
    fontes: [["Lei 8.213/1991", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["Decreto 3.048/1999", "https://www.planalto.gov.br/ccivil_03/decreto/d3048.htm"], ["Meu INSS", "https://meu.inss.gov.br"]],
  },

  "idade-minima": {
    acolhe: "Desde a Reforma de 2019, a resposta depende de quando você começou a contribuir e de quanto tempo já tem.",
    perguntas: [
      { q: "Você contribuía para o INSS antes de 13/11/2019?", a: ["Sim", "Não", "Não sei"] },
      { q: "Você é:", a: ["Mulher", "Homem"] },
      { q: "Quanto tempo de contribuição tem, mais ou menos?", a: ["Menos de 15 anos", "15 a 29 anos", "30 anos ou mais", "Não sei"], ajuda: ["cnis"] },
    ],
    lei: [
      "Regra geral (para quem começou depois da Reforma): 62 anos de idade para mulheres e 65 para homens, com 15 anos de contribuição para mulheres e 20 para homens (Emenda Constitucional 103/2019, art. 19).",
      "Para quem já contribuía antes de 13/11/2019 há regras de transição: por pontos (idade + tempo de contribuição), por idade mínima progressiva e pelos pedágios de 50% e de 100% (EC 103/2019, arts. 15 a 20).",
      "Na regra dos pontos, em 2026 são 93 pontos para mulheres e 103 para homens, com 30 e 35 anos de contribuição, respectivamente; a pontuação sobe 1 ponto por ano (EC 103/2019, art. 15).",
      "Na idade mínima progressiva, em 2026 são 59 anos e 6 meses para mulheres e 64 anos e 6 meses para homens, com 30 e 35 anos de contribuição (EC 103/2019, art. 16).",
    ],
    juris: ["Vale sempre comparar as regras: a pessoa tem direito à que for mais vantajosa entre as que já cumpriu."],
    prazos: ["Não há prazo para pedir a aposentadoria. Mas, se você já cumpre os requisitos, pedir logo evita perder meses de benefício."],
    docs: ["Extrato do CNIS", "Carteiras de trabalho", "Carnês e guias de contribuição", "Documentos de períodos especiais ou rurais, se houver"],
    passos: ["Baixe o CNIS no Meu INSS e confira se todos os empregos estão lá.", "Use o simulador do site para comparar as regras.", "Corrija vínculos que faltam antes de pedir.", "Peça a aposentadoria pelo Meu INSS ou com a advogada."],
    urgente: ["Vínculos faltando no CNIS", "Períodos insalubres, rurais ou de serviço público", "Você já pode estar perdendo meses de benefício"],
    fontes: [["Emenda Constitucional 103/2019", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"], ["Meu INSS", "https://meu.inss.gov.br"]],
  },

  "descontos-beneficio": {
    acolhe: "Desconto sem autorização no benefício é ilegal — e houve um grande esquema de fraudes de associações descoberto em 2025.",
    perguntas: [
      { q: "Que tipo de desconto aparece no extrato?", a: ["Mensalidade de associação ou sindicato", "Empréstimo consignado", "Cartão de crédito consignado (RMC/RCC)", "Não sei"], ajuda: ["consignado"] },
      { q: "Você autorizou esse desconto?", a: ["Não", "Sim, mas quero cancelar", "Não lembro"] },
      { q: "Há quanto tempo descontam?", a: ["Menos de 1 ano", "1 a 5 anos", "Mais de 5 anos"] },
    ],
    lei: [
      "O INSS só pode descontar do benefício o que a lei permite, como contribuições, imposto, pensão alimentícia, empréstimo consignado e mensalidades de associações — estas, só com autorização expressa do segurado (Lei 8.213/1991, art. 115).",
      "Valor cobrado indevidamente deve ser devolvido em dobro, salvo engano justificável (Código de Defesa do Consumidor, art. 42, parágrafo único).",
      "O desconto não autorizado também pode gerar indenização por dano moral, conforme o caso.",
    ],
    juris: ["STJ (EAREsp 676.608, 2021): a devolução em dobro não depende de provar má-fé — basta a cobrança contrária à boa-fé."],
    prazos: ["Para descontos de associações entre 2020 e 2025, o governo abriu um acordo administrativo de devolução pelo Meu INSS, com prazos que foram prorrogados várias vezes. [CONFERIR] Se o prazo do acordo ainda está aberto.", "Na Justiça, é possível cobrar os valores dos últimos anos, observada a prescrição."],
    docs: ["Extrato de pagamento do benefício (Meu INSS → Extrato de pagamento)", "Extrato de empréstimos consignados (Meu INSS)", "Qualquer contrato ou ligação que você tenha recebido"],
    passos: ["Baixe o extrato de pagamento e o de empréstimos no Meu INSS.", "Bloqueie novos descontos e conteste os atuais pelo Meu INSS ou pelo 135.", "Registre reclamação no consumidor.gov.br se for banco ou financeira.", "Procure a advogada para pedir a devolução em dobro e a indenização."],
    urgente: ["Descontos altos comprometendo a renda", "Empréstimo que você nunca pediu", "Dinheiro depositado na sua conta sem pedir (não gaste — guarde)"],
    fontes: [["Lei 8.213/1991, art. 115", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"], ["Meu INSS", "https://meu.inss.gov.br"]],
  },

  "pcd-quem": {
    acolhe: "A pessoa com deficiência tem regras próprias, com tempo e idade menores — e a Reforma de 2019 manteve essas regras.",
    perguntas: [
      { q: "Você trabalhou ou contribuiu tendo a deficiência?", a: ["Sim, o tempo todo", "Sim, parte do tempo", "Não sei"] },
      { q: "Como a deficiência afeta o seu dia a dia?", a: ["Muito (grave)", "Bastante (moderada)", "Um pouco (leve)", "Não sei"], ajuda: ["avaliação biopsicossocial"] },
      { q: "Quanto tempo de contribuição tem?", a: ["Menos de 15 anos", "15 a 24 anos", "25 anos ou mais", "Não sei"] },
    ],
    lei: [
      "Aposentadoria por tempo de contribuição da pessoa com deficiência: 25 anos (homem) e 20 (mulher) se a deficiência for grave; 29 e 24 se moderada; 33 e 28 se leve — sem idade mínima (Lei Complementar 142/2013, art. 3º).",
      "Aposentadoria por idade: 60 anos (homem) e 55 (mulher), com 15 anos de contribuição na condição de pessoa com deficiência (LC 142/2013, art. 3º, IV).",
      "O grau da deficiência é definido em avaliação médica e social feita pelo INSS (LC 142/2013, art. 4º).",
      "A Reforma de 2019 manteve essas regras até que nova lei seja editada (EC 103/2019, art. 22).",
    ],
    juris: ["Quando a deficiência existiu só em parte do tempo, os períodos são convertidos proporcionalmente, conforme o grau (LC 142/2013, art. 7º)."],
    prazos: ["Não há prazo para pedir. A data de início da deficiência é decisiva: guarde documentos antigos que a comprovem."],
    docs: ["Laudos e exames que mostrem a deficiência e desde quando", "Extrato do CNIS", "Documentos de tratamento, órteses, próteses, adaptações", "Relatos de limitações no trabalho"],
    passos: ["Reúna laudos antigos e recentes.", "Baixe o CNIS.", "Peça a aposentadoria pelo Meu INSS — o INSS agenda a avaliação médica e social.", "Procure a advogada para preparar a avaliação, que é decisiva."],
    urgente: ["Avaliação do INSS já marcada", "Benefício negado por grau de deficiência"],
    fontes: [["Lei Complementar 142/2013", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp142.htm"], ["EC 103/2019", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
  },

  "bpc-renda": {
    acolhe: "O BPC garante um salário mínimo por mês a idosos e pessoas com deficiência de baixa renda — mesmo sem nunca ter contribuído.",
    perguntas: [
      { q: "O pedido é para:", a: ["Idoso(a) com 65 anos ou mais", "Pessoa com deficiência", "Criança com deficiência"] },
      { q: "A família está no CadÚnico, atualizado?", a: ["Sim", "Não", "Não sei"], ajuda: ["cadúnico"] },
      { q: "Somando a renda de todos e dividindo pelas pessoas da casa, dá:", a: ["Até 1/4 do salário mínimo", "Entre 1/4 e 1/2 salário mínimo", "Mais de 1/2 salário mínimo", "Não sei"] },
    ],
    lei: [
      "Têm direito a pessoa idosa com 65 anos ou mais e a pessoa com deficiência (impedimento de longo prazo, de no mínimo 2 anos) que não tenham meios de se sustentar (Lei 8.742/1993, art. 20).",
      "O critério de renda é de até 1/4 do salário mínimo por pessoa da família (art. 20, §3º). A lei admite outros elementos que comprovem a vulnerabilidade (art. 20, §11).",
      "É obrigatória a inscrição no CadÚnico (art. 20, §12).",
      "O BPC não paga 13º e não deixa pensão por morte.",
    ],
    juris: ["STF (RE 567.985, 2013): o limite de 1/4 do salário mínimo não é absoluto — a miserabilidade pode ser provada por outros meios, como gastos com remédios e tratamento."],
    prazos: ["Não há prazo para pedir. O benefício é pago a partir do pedido — por isso, peça o quanto antes.", "Mantenha o CadÚnico atualizado a cada 2 anos, no máximo, para não ter o benefício suspenso."],
    docs: ["Documentos de todos da casa", "Comprovante de inscrição no CadÚnico", "Comprovantes de renda e de gastos com saúde", "Laudos médicos (se for pessoa com deficiência)"],
    passos: ["Inscreva ou atualize a família no CadÚnico (CRAS).", "Peça o BPC pelo Meu INSS ou pelo 135.", "Se for por deficiência, o INSS marca perícia e avaliação social.", "Se negar, recorra em 30 dias ou procure a advogada."],
    urgente: ["Família sem renda", "Benefício suspenso", "Negativa por renda pouco acima do limite"],
    fontes: [["Lei 8.742/1993 (LOAS)", "https://www.planalto.gov.br/ccivil_03/leis/l8742.htm"], ["Meu INSS", "https://meu.inss.gov.br"]],
  },

  "pensao-duracao": {
    acolhe: "A pensão por morte tem regras de duração e de valor que mudaram com a Reforma — e prazos que fazem diferença no valor recebido.",
    perguntas: [
      { q: "Você era:", a: ["Cônjuge", "Companheiro(a) em união estável", "Filho(a)", "Outro dependente"], ajuda: ["união estável"] },
      { q: "A união durou 2 anos ou mais?", a: ["Sim", "Não", "Não se aplica"] },
      { q: "Quando foi o falecimento?", a: ["Há menos de 90 dias", "Há mais de 90 dias"] },
    ],
    lei: [
      "Se o pedido for feito em até 90 dias do óbito, a pensão é paga desde a data do falecimento; depois disso, a partir do pedido (Lei 8.213/1991, art. 74).",
      "Para cônjuge ou companheiro(a), com menos de 2 anos de união ou menos de 18 contribuições do falecido, a pensão dura 4 meses (salvo morte por acidente ou doença do trabalho) (art. 77, §2º, V).",
      "Com 2 anos ou mais de união e 18 contribuições, a duração depende da idade de quem recebe: menos de 22 anos, 3 anos; 22 a 27, 6 anos; 28 a 30, 10 anos; 31 a 41, 15 anos; 42 a 44, 20 anos; 45 anos ou mais, vitalícia. [CONFERIR] faixas vigentes por portaria.",
      "O valor é de 50% mais 10% por dependente, até 100%, sobre a aposentadoria que a pessoa recebia ou teria direito (EC 103/2019, art. 23).",
      "A união estável precisa de início de prova documental recente, não só testemunhas (Lei 8.213/1991, art. 16, §5º).",
    ],
    juris: ["Filho(a) recebe até os 21 anos, ou sem limite se inválido(a) ou com deficiência intelectual, mental ou grave (Lei 8.213/1991, art. 77, §2º, II)."],
    prazos: ["90 dias do óbito para receber desde a data do falecimento.", "Fora disso, peça o quanto antes: só se recebe a partir do pedido."],
    docs: ["Certidão de óbito", "Certidão de casamento ou provas da união estável (conta conjunta, mesmo endereço, plano de saúde, filhos em comum, IR)", "Documentos pessoais do dependente", "CNIS do falecido, se tiver acesso"],
    passos: ["Peça a pensão pelo Meu INSS ou 135 o quanto antes.", "Junte as provas da união estável, se for o caso.", "Se negar, recorra em 30 dias ou procure a advogada."],
    urgente: ["Prazo de 90 dias acabando", "União estável sem documentos", "Disputa com outro dependente"],
    fontes: [["Lei 8.213/1991", "https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"], ["EC 103/2019", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm"]],
  },
};
