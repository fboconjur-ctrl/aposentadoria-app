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
  "mandado de segurança": "Ação rápida na Justiça contra ato ilegal de autoridade, quando o direito pode ser provado só com documentos. Deve ser proposta em até 120 dias do ato.",
  "cadastro reserva": "Lista de aprovados além das vagas do edital, chamados se surgirem novas vagas durante a validade do concurso.",
  "preterição": "Quando alguém aprovado é passado para trás — por exemplo, a administração nomeia candidato pior classificado ou contrata temporários para a mesma função.",
  "edital": "Documento com as regras do concurso: vagas, etapas, critérios e prazos de recurso.",
  "pad": "Processo Administrativo Disciplinar: o processo que apura falta de servidor público e pode levar a advertência, suspensão ou demissão.",
  "sindicância": "Apuração mais simples que o PAD. Pode arquivar o caso, aplicar advertência ou suspensão de até 30 dias, ou levar à abertura de PAD.",
  "jari": "Junta Administrativa de Recursos de Infrações: julga o recurso contra multa de trânsito em 1ª instância.",
  "cetran": "Conselho Estadual de Trânsito: julga o recurso em 2ª instância, depois da JARI (no DF, Contrandife).",
  "mínimo existencial": "Parte da renda que precisa ficar livre de dívidas para a pessoa viver (alimentação, moradia, saúde). Hoje o valor de referência é R$ 600, segundo decreto mantido pelo STF em 2026.",
  "repactuação": "Renegociação de todas as dívidas de consumo juntas, num plano de pagamento de até 5 anos, feita em audiência com todos os credores.",
  "med": "Mecanismo Especial de Devolução do Pix: procedimento do Banco Central para bloquear e tentar devolver valores de Pix em caso de golpe. Pedido feito ao seu banco, de preferência na hora.",
  "alienação fiduciária": "Quando o carro (ou outro bem) fica em nome do banco como garantia até o fim do financiamento. Se as parcelas atrasam, o banco pode pedir a busca e apreensão.",
  "notificação extrajudicial": "Carta enviada pelo banco, antes da ação, para avisar formalmente do atraso. É obrigatória para a busca e apreensão.",
  "dano moral": "Indenização por ofensa à honra, à imagem ou à tranquilidade da pessoa — além do prejuízo em dinheiro.",
  "chargeback": "Contestação de uma compra no cartão: o banco estorna o valor enquanto apura se a compra foi legítima.",
  "responsabilidade objetiva": "O Estado responde pelo dano causado por seus agentes sem que a vítima precise provar culpa: basta provar o dano e a relação com a ação do Estado.",
};

// Data em que as fontes foram conferidas; "revisado" só é preenchido quando a advogada revisar.
const ROTEIROS_CONFERIDO = "outubro de 2026";
const ROTEIROS_REVISADOS = {}; // ex.: { "plano-negou": "2026-11-10" }

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

  // ---------------- Servidor, concurso e órgão público ----------------
  "concurso-vagas": {
    acolhe: "Ser aprovado e não ser chamado é angustiante — mas, em várias situações, a nomeação é um direito.",
    perguntas: [
      { q: "Em que posição você foi aprovado(a)?", a: ["Dentro do número de vagas do edital", "Fora das vagas (cadastro reserva)", "Não sei"], ajuda: ["edital", "cadastro reserva"] },
      { q: "O concurso ainda está no prazo de validade?", a: ["Sim", "Não, já venceu", "Não sei"] },
      { q: "Chamaram alguém pior colocado, terceirizados ou temporários para a mesma função?", a: ["Sim", "Não", "Não sei"], ajuda: ["preterição"] },
    ],
    lei: [
      "O concurso vale por até 2 anos, prorrogável uma vez por igual período; durante a validade, quem foi aprovado tem prioridade sobre novos concursados (Constituição, art. 37, III e IV).",
    ],
    juris: [
      "STF, Tema 161 (RE 598.099): quem é aprovado dentro do número de vagas do edital tem direito à nomeação durante a validade do concurso, salvo situações excepcionais e justificadas.",
      "STF, Tema 784 (RE 837.311): o surgimento de novas vagas ou a abertura de novo concurso não geram, por si só, direito à nomeação de quem está fora das vagas — mas há direito se houver preterição arbitrária e imotivada, comprovada.",
    ],
    prazos: ["Fique atento(a) ao fim da validade do concurso.", "Mandado de segurança: até 120 dias contados do ato que viola o direito (Lei 12.016/2009, art. 23)."],
    docs: ["Edital e eventuais retificações", "Resultado final e homologação, com a sua classificação", "Publicações de prorrogação da validade", "Provas de contratações de temporários ou terceirizados, se houver"],
    passos: ["Confira no Diário Oficial a homologação e a validade.", "Faça pedido administrativo de nomeação e guarde o protocolo.", "Reúna provas de preterição, se houver.", "Procure a advogada antes do fim da validade."],
    urgente: ["Validade do concurso perto do fim", "Novo concurso aberto para o mesmo cargo", "Contratação de temporários na sua função"],
    fontes: [["Constituição, art. 37", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"], ["Lei 12.016/2009 (mandado de segurança)", "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/lei/l12016.htm"], ["STF — repercussão geral", "https://portal.stf.jus.br/jurisprudenciaRepercussao/"]],
  },

  "concurso-eliminacao": {
    acolhe: "Eliminação em psicotécnico, teste físico ou exame médico pode ser contestada — os tribunais exigem critérios objetivos e previstos em lei.",
    perguntas: [
      { q: "Em qual etapa você foi eliminado(a)?", a: ["Psicotécnico", "Teste físico (TAF)", "Exame médico", "Investigação social", "Outra"] },
      { q: "Você recebeu o motivo da eliminação por escrito?", a: ["Sim", "Não"] },
      { q: "Já passou o prazo de recurso do edital?", a: ["Não", "Sim", "Não sei"], ajuda: ["edital"] },
    ],
    lei: [
      "As etapas e critérios do concurso devem estar previstos no edital, e as exigências precisam ser compatíveis com o cargo (Constituição, art. 37, I e II).",
    ],
    juris: [
      "STF, Súmula Vinculante 44: o exame psicotécnico só pode ser exigido se previsto em lei — e, segundo os tribunais, com critérios objetivos e direito a recurso.",
      "STF, Tema 973 (RE 1.058.333): candidata gestante tem direito de remarcar o teste de aptidão física, mesmo sem previsão no edital.",
      "Os tribunais costumam anular eliminações sem motivação, com critérios subjetivos ou que não foram previstos no edital.",
    ],
    prazos: ["O prazo de recurso administrativo é o do edital — normalmente curto, de poucos dias.", "Mandado de segurança: até 120 dias do ato de eliminação (Lei 12.016/2009, art. 23)."],
    docs: ["Edital", "Resultado da etapa e motivação da eliminação", "Laudos e exames particulares que contestem o resultado", "Recurso administrativo e a resposta"],
    passos: ["Peça por escrito os motivos e o resultado detalhado da avaliação.", "Recorra no prazo do edital.", "Faça exames ou avaliação particular para contrapor, se for o caso.", "Procure a advogada logo: as etapas seguintes do concurso continuam correndo."],
    urgente: ["Próxima etapa do concurso marcada", "Prazo de recurso acabando", "Curso de formação para começar"],
    fontes: [["Constituição, art. 37", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"], ["STF — Súmulas Vinculantes", "https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=26"]],
  },

  "pad-prazo": {
    acolhe: "Responder a um PAD assusta, mas há regras de prazo e de defesa que protegem o servidor.",
    perguntas: [
      { q: "Em que fase está?", a: ["Recebi a portaria de abertura", "Fui citado(a) para defesa", "Já há relatório final", "Fui punido(a)"], ajuda: ["pad", "sindicância"] },
      { q: "Você é servidor(a):", a: ["Federal", "Estadual / Distrital", "Municipal"] },
      { q: "Há quanto tempo a administração soube do fato?", a: ["Menos de 2 anos", "De 2 a 5 anos", "Mais de 5 anos", "Não sei"] },
    ],
    lei: [
      "Na esfera federal, o servidor indiciado é citado para apresentar defesa escrita em 10 dias; com 2 ou mais indiciados, o prazo é comum de 20 dias (Lei 8.112/1990, art. 161, §§1º e 2º).",
      "O PAD deve terminar em 60 dias, prorrogáveis por igual prazo (Lei 8.112/1990, art. 152).",
      "Prescrição: 5 anos para demissão e cassação; 2 anos para suspensão; 180 dias para advertência, contados de quando o fato se tornou conhecido (Lei 8.112/1990, art. 142).",
      "Servidores estaduais, distritais e municipais seguem o estatuto do próprio ente, com prazos que podem ser diferentes.",
    ],
    juris: [
      "STJ, Súmula 635: a prescrição começa quando a autoridade competente toma conhecimento do fato, é interrompida pela abertura do processo e volta a correr por inteiro depois de 140 dias.",
      "STF, Súmula Vinculante 5: a falta de advogado no PAD, por si só, não anula o processo — mas a defesa técnica costuma fazer diferença.",
      "STJ, Súmula 641: a portaria de abertura não precisa descrever minuciosamente os fatos; a descrição detalhada é exigida no indiciamento.",
    ],
    prazos: ["Defesa escrita: 10 dias da citação (federal), ou o prazo do estatuto local.", "Verifique a prescrição: pode encerrar o caso."],
    docs: ["Portaria de instauração", "Mandado de citação e termo de indiciamento", "Cópia integral dos autos", "Documentos e testemunhas a seu favor"],
    passos: ["Peça cópia integral do processo.", "Anote a data da citação e conte o prazo de defesa.", "Liste testemunhas e documentos.", "Procure a advogada antes de prestar depoimento ou de apresentar a defesa."],
    urgente: ["Prazo de defesa correndo", "Interrogatório marcado", "Risco de demissão"],
    fontes: [["Lei 8.112/1990", "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm"], ["STJ — Súmulas", "https://scon.stj.jus.br/SCON/sumstj/"]],
  },

  "direitos-servidor": {
    acolhe: "Muitos direitos de servidores são negados no dia a dia — e boa parte pode ser cobrada, inclusive com valores atrasados.",
    perguntas: [
      { q: "Qual direito foi negado?", a: ["Progressão ou promoção", "Adicional ou gratificação", "Licença ou afastamento", "Horário especial (deficiência ou dependente com deficiência)", "Abono de permanência", "Outro"] },
      { q: "Você é servidor(a):", a: ["Federal", "Estadual / Distrital", "Municipal"] },
      { q: "Você já pediu por escrito ao órgão?", a: ["Sim, e negaram", "Sim, sem resposta", "Não"] },
    ],
    lei: [
      "O servidor federal com deficiência, ou que tenha cônjuge, filho ou dependente com deficiência, tem direito a horário especial, sem compensação no caso do dependente (Lei 8.112/1990, art. 98, §§2º e 3º).",
      "Quem já pode se aposentar voluntariamente e continua trabalhando pode ter direito ao abono de permanência (Constituição, art. 40, §19).",
      "As dívidas da Fazenda Pública prescrevem em 5 anos (Decreto 20.910/1932, art. 1º).",
    ],
    juris: [
      "STJ, Súmula 85: em direitos de pagamento mensal, a prescrição atinge só as parcelas anteriores aos 5 anos antes da ação — o direito em si continua.",
      "STF, Tema 1097: o horário especial para servidor com filho ou dependente com deficiência vale também para servidores estaduais e municipais.",
    ],
    prazos: ["Cobre o quanto antes: a cada mês que passa, uma parcela de 5 anos atrás prescreve."],
    docs: ["Contracheques", "Pedido administrativo e resposta", "Ato de nomeação e de enquadramento", "Laudos (no caso de horário especial)"],
    passos: ["Faça o pedido por escrito ao órgão e guarde o protocolo.", "Junte os contracheques dos últimos 5 anos.", "Procure a advogada para avaliar o pedido judicial e os atrasados."],
    urgente: ["Negativa de horário especial para cuidar de dependente com deficiência", "Parcelas prestes a prescrever"],
    fontes: [["Lei 8.112/1990", "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm"], ["Constituição, art. 40", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"], ["Decreto 20.910/1932", "https://www.planalto.gov.br/ccivil_03/decreto/antigos/d20910.htm"]],
  },

  "multa-transito": {
    acolhe: "Multa e suspensão da CNH têm várias etapas de defesa — e erros de prazo e de notificação anulam muitas autuações.",
    perguntas: [
      { q: "O que você recebeu?", a: ["Notificação de autuação", "Notificação de penalidade (multa)", "Processo de suspensão ou cassação da CNH", "Não sei"] },
      { q: "Quando recebeu?", a: ["Há menos de 30 dias", "Há mais de 30 dias"] },
      { q: "Foi recusa ao bafômetro?", a: ["Sim", "Não"] },
    ],
    lei: [
      "A notificação da autuação deve ser enviada em até 30 dias da infração; se não for, o auto é arquivado (Código de Trânsito, art. 281, parágrafo único, II).",
      "Há três chances de defesa: defesa prévia, recurso à JARI e recurso ao CETRAN — nos prazos indicados em cada notificação (Código de Trânsito, arts. 281 a 288).",
      "A CNH é suspensa ao atingir 20 pontos em 12 meses com 2 ou mais infrações gravíssimas; 30 pontos com 1 gravíssima; ou 40 pontos sem gravíssimas (Código de Trânsito, art. 261, com a Lei 14.071/2020).",
      "Recusar o bafômetro é infração gravíssima, com multa multiplicada por 10 e suspensão por 12 meses (Código de Trânsito, art. 165-A).",
    ],
    juris: [
      "STJ, Súmula 312: no processo de multa, são necessárias duas notificações — da autuação e da penalidade.",
      "STJ, Súmula 127: é ilegal condicionar o licenciamento do veículo ao pagamento de multa da qual o infrator não foi notificado.",
    ],
    prazos: ["Use o prazo indicado na notificação: perder a defesa prévia não impede o recurso à JARI, mas cada etapa tem a sua data."],
    docs: ["Notificações recebidas (frente e verso)", "CRLV e CNH", "Fotos, testemunhas ou documentos que mostrem que você não cometeu a infração", "Comprovante de quem dirigia, se não era você"],
    passos: ["Confira se a notificação chegou em até 30 dias da infração.", "Se não era você dirigindo, indique o condutor no prazo.", "Apresente defesa prévia; depois, se preciso, recurso à JARI e ao CETRAN.", "Em suspensão ou cassação, procure a advogada: a defesa é mais técnica."],
    urgente: ["Processo de suspensão ou cassação aberto", "CNH necessária para trabalhar", "Prazo de defesa acabando"],
    fontes: [["Código de Trânsito Brasileiro", "https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm"], ["STJ — Súmulas", "https://scon.stj.jus.br/SCON/sumstj/"]],
  },

  "responsabilidade-estado": {
    acolhe: "Quando o poder público causa um prejuízo, a lei garante indenização — e a vítima não precisa provar culpa do servidor.",
    perguntas: [
      { q: "O que aconteceu?", a: ["Acidente com veículo ou obra pública", "Buraco ou falta de manutenção", "Erro em hospital público", "Ato de agente público (ex.: abordagem policial)", "Outro"] },
      { q: "Quando aconteceu?", a: ["Há menos de 5 anos", "Há mais de 5 anos"] },
      { q: "Você tem fotos, boletim de ocorrência ou laudos?", a: ["Sim", "Não", "Alguns"] },
    ],
    lei: [
      "O Estado e as empresas que prestam serviço público respondem pelos danos que seus agentes causarem, independentemente de culpa (Constituição, art. 37, §6º).",
      "O prazo para pedir indenização contra a Fazenda Pública é de 5 anos (Decreto 20.910/1932, art. 1º).",
    ],
    juris: [
      "STF, Tema 940 (RE 1.027.633): a ação deve ser proposta contra o Estado ou a empresa prestadora — não contra o servidor, que responde depois ao próprio Estado se agiu com dolo ou culpa.",
      "Quando o dano vem de omissão (ex.: falta de manutenção), os tribunais costumam exigir a demonstração de falha do serviço público.",
    ],
    prazos: ["5 anos a contar do dano. Não deixe para depois: provas se perdem."],
    docs: ["Fotos e vídeos do local e do dano", "Boletim de ocorrência", "Laudos médicos, notas e orçamentos", "Testemunhas"],
    passos: ["Registre tudo: fotos, BO, laudos.", "Guarde comprovantes de todos os gastos.", "Se quiser, faça pedido administrativo de indenização ao órgão.", "Procure a advogada para avaliar a ação."],
    urgente: ["Lesão grave ou morte", "Prazo de 5 anos perto do fim", "Risco de a prova desaparecer (ex.: buraco que será tapado)"],
    fontes: [["Constituição, art. 37, §6º", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"], ["Decreto 20.910/1932", "https://www.planalto.gov.br/ccivil_03/decreto/antigos/d20910.htm"]],
  },

  // ---------------- Dívidas e bancos ----------------
  // Área em que a jurisprudência do STJ muitas vezes define a regra na prática: cada roteiro separa lei, tribunais e divergências.
  "superendividamento": {
    acolhe: "Dever não é crime — e, desde 2021, a lei protege quem não consegue mais pagar as dívidas sem comprometer o básico para viver.",
    perguntas: [
      { q: "Suas dívidas são principalmente de:", a: ["Cartão, cheque especial e empréstimos", "Consignado", "Contas de consumo (luz, água, lojas)", "Financiamento de casa ou carro", "Várias delas"] },
      { q: "Depois de pagar as parcelas, sobra o suficiente para comida, moradia e saúde?", a: ["Não", "Muito pouco", "Sim"], ajuda: ["mínimo existencial"] },
      { q: "Você já tentou renegociar?", a: ["Sim, sem sucesso", "Não", "Estou negociando"] },
    ],
    lei: [
      "A Lei do Superendividamento (Lei 14.181/2021) incluiu no Código de Defesa do Consumidor a possibilidade de reunir as dívidas de consumo num plano de pagamento de até 5 anos, preservando o mínimo existencial (CDC, arts. 104-A a 104-C).",
      "O processo começa com uma audiência de conciliação com todos os credores; se não houver acordo, o juiz pode impor um plano (CDC, arts. 104-A e 104-B).",
      "Ficam de fora: dívidas com garantia real (como financiamento imobiliário), crédito rural, impostos, pensão alimentícia e dívidas contraídas de má-fé (CDC, art. 104-A, §1º).",
      "Se o credor faltar à audiência sem justificativa, a cobrança daquela dívida fica suspensa e param de correr os encargos do atraso (CDC, art. 104-A, §2º).",
    ],
    juris: [
      "STF, ADPFs 1005, 1006 e 1097 (2026): manteve o valor de referência de R$ 600 para o mínimo existencial e determinou que o Conselho Monetário Nacional o revise periodicamente.",
    ],
    divergencia: ["Se o valor de R$ 600 é critério absoluto: há quem entenda que o juiz pode considerar a realidade concreta da família ao analisar o caso."],
    prazos: ["Não há prazo para pedir. Mas, quanto antes, menos juros se acumulam."],
    docs: ["Lista de todas as dívidas (credor, valor, parcela)", "Contracheque ou comprovante de renda", "Comprovantes dos gastos básicos (aluguel, remédios, escola)", "Contratos e extratos"],
    passos: ["Liste todas as dívidas e todos os gastos essenciais.", "Procure o Procon ou o centro de conciliação (Cejusc) do tribunal para a repactuação.", "Não faça novos empréstimos para pagar os antigos.", "Procure a advogada se os credores não aceitarem o plano."],
    urgente: ["Salário ou benefício quase todo comprometido", "Ameaça de corte de serviços essenciais", "Novos empréstimos para pagar os antigos"],
    fontes: [["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"], ["Lei 14.181/2021", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14181.htm"], ["STF — mínimo existencial", "https://noticias.stf.jus.br/"]],
  },

  "consignado-nao-contratado": {
    acolhe: "Empréstimo que você não pediu é um dos golpes mais comuns contra aposentados — e a lei e o STJ protegem bastante o consumidor nesse caso.",
    perguntas: [
      { q: "O dinheiro do empréstimo caiu na sua conta?", a: ["Sim", "Não", "Não sei"] },
      { q: "Você assinou algum contrato ou passou dados por telefone?", a: ["Não", "Passei dados por telefone", "Assinei sem entender", "Não lembro"] },
      { q: "Você recebe:", a: ["Aposentadoria ou pensão do INSS", "Salário (servidor ou empregado)"], ajuda: ["consignado"] },
    ],
    lei: [
      "O banco responde pelos danos causados por falha no serviço, independentemente de culpa (CDC, art. 14).",
      "Quem cobra o que não é devido deve devolver em dobro, salvo engano justificável (CDC, art. 42, parágrafo único).",
      "Cabe ao banco provar que o cliente realmente contratou (CDC, art. 6º, VIII, inversão do ônus da prova).",
    ],
    juris: [
      "STJ, Súmula 297: o Código de Defesa do Consumidor se aplica às instituições financeiras.",
      "STJ, Súmula 479: os bancos respondem objetivamente por fraudes de terceiros em operações bancárias — aqui a jurisprudência foi além do texto da lei, tratando a fraude como risco do próprio negócio do banco.",
      "STJ (EAREsp 676.608, 2021): a devolução em dobro não exige prova de má-fé — vale para cobranças a partir de março de 2021.",
    ],
    divergencia: ["Se o desconto indevido, sozinho, gera dano moral: muitos tribunais reconhecem, sobretudo quando atinge benefício de aposentado; outros exigem prova de um prejuízo maior."],
    prazos: ["Não use o dinheiro que caiu na conta: guarde para devolver ou depositar em juízo.", "Aja logo: os descontos continuam todo mês."],
    docs: ["Extrato de empréstimos do Meu INSS (ou contracheque)", "Extrato bancário mostrando o depósito, se houve", "Protocolos de reclamação"],
    passos: ["Baixe o extrato de empréstimos no Meu INSS.", "Peça ao banco cópia do contrato e da gravação/assinatura.", "Registre reclamação no consumidor.gov.br e bloqueie novos empréstimos no Meu INSS.", "Procure a advogada para pedir cancelamento, devolução em dobro e indenização."],
    urgente: ["Descontos comprometendo a renda", "Vários empréstimos seguidos", "Pessoa idosa ou com dificuldade de leitura"],
    fontes: [["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"], ["STJ — Súmulas", "https://scon.stj.jus.br/SCON/sumstj/"], ["consumidor.gov.br", "https://www.consumidor.gov.br"]],
  },

  "pix-golpe": {
    acolhe: "Cair em golpe não é motivo de vergonha — e a velocidade agora conta muito para tentar recuperar o dinheiro.",
    perguntas: [
      { q: "Como foi o golpe?", a: ["Eu mesmo(a) fiz o Pix, enganado(a) pelo golpista", "Fizeram Pix da minha conta sem eu saber", "Celular roubado ou conta invadida"] },
      { q: "Quando foi?", a: ["Hoje ou ontem", "Nesta semana", "Há mais tempo"] },
      { q: "As transferências fugiam do seu costume (valor alto, várias seguidas, de madrugada)?", a: ["Sim", "Não", "Não sei"] },
    ],
    lei: [
      "O banco responde por falhas na segurança do serviço, independentemente de culpa — mas não responde se provar culpa exclusiva do cliente ou de terceiro (CDC, art. 14, caput e §3º, II).",
      "O Banco Central criou o Mecanismo Especial de Devolução (MED), pedido ao seu banco, que pode bloquear o valor na conta do golpista e devolvê-lo.",
    ],
    juris: [
      "STJ, Súmula 479: os bancos respondem por fraudes de terceiros ligadas às operações bancárias.",
    ],
    divergencia: [
      "Quando a própria vítima faz o Pix, enganada pelo golpista, o STJ tem afastado a responsabilidade do banco (fortuito externo e culpa de terceiro) — por exemplo, no REsp 2.215.907/SP.",
      "Quando o banco deixa passar transações claramente fora do perfil do cliente, sem bloqueio nem alerta, o STJ tem reconhecido a responsabilidade do banco.",
      "Por isso, o resultado depende muito da prova: o padrão de uso da conta e a rapidez com que o banco foi avisado.",
    ],
    prazos: ["Avise o banco imediatamente e peça o MED: quanto antes, maior a chance de o dinheiro ainda estar na conta do golpista.", "[CONFERIR] Prazo máximo para pedir o MED no regulamento atual do Pix."],
    docs: ["Comprovantes dos Pix", "Prints das conversas com o golpista", "Boletim de ocorrência", "Protocolo do pedido de MED no banco", "Extratos dos últimos meses (para mostrar o seu padrão)"],
    passos: ["Ligue para o banco agora, peça o MED e anote o protocolo.", "Registre boletim de ocorrência (pode ser pela internet).", "Guarde todos os prints e comprovantes.", "Procure a advogada para avaliar a responsabilidade do banco."],
    urgente: ["Golpe aconteceu hoje", "Valor alto ou economia de vida", "Vários Pix seguidos fora do seu padrão"],
    fontes: [["Banco Central — Pix e MED", "https://www.bcb.gov.br/estabilidadefinanceira/pix"], ["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"]],
  },

  "busca-apreensao": {
    acolhe: "A busca e apreensão do carro tem regras rígidas e prazos curtos — e o banco também precisa cumprir as dele.",
    perguntas: [
      { q: "Em que fase está?", a: ["Recebi carta do banco cobrando", "Recebi citação da ação", "O carro já foi apreendido"], ajuda: ["notificação extrajudicial"] },
      { q: "Quantas parcelas você já pagou?", a: ["Menos da metade", "Mais da metade", "Quase todas"], ajuda: ["alienação fiduciária"] },
      { q: "A carta de cobrança foi enviada para o endereço do contrato?", a: ["Sim", "Não, para outro endereço", "Não recebi nenhuma carta", "Não sei"] },
    ],
    lei: [
      "Para pedir a busca e apreensão, o banco precisa comprovar o atraso (a mora) com carta enviada ao devedor (Decreto-Lei 911/1969, art. 2º, §2º).",
      "Depois da apreensão, o devedor tem 5 dias para pagar a integralidade da dívida e recuperar o carro (art. 3º, §§1º e 2º).",
      "O prazo para apresentar defesa é de 15 dias após a execução da liminar (art. 3º, §3º).",
    ],
    juris: [
      "STJ, Súmula 72: a comprovação do atraso é indispensável para a busca e apreensão.",
      "STJ, Tema 1132: basta o banco enviar a carta ao endereço do contrato — não precisa provar que o devedor recebeu.",
      "STJ, Tema 722: para recuperar o carro, é preciso pagar a dívida inteira, incluindo parcelas que ainda iam vencer — aqui a jurisprudência fixou uma leitura dura da lei.",
      "STJ (REsp 1.622.555, 2017): ter pago a maior parte do contrato (adimplemento substancial) não impede a busca e apreensão.",
    ],
    divergencia: ["Carta devolvida como “não procurado”: alguns tribunais aceitam como válida (Tema 1132); outros exigem que tenha havido tentativa real de entrega."],
    prazos: ["5 dias depois da apreensão para pagar a dívida inteira.", "15 dias depois da liminar para a defesa."],
    docs: ["Contrato de financiamento", "Comprovantes de pagamento das parcelas", "Carta de cobrança e envelope (com a data e a anotação dos Correios)", "Citação ou mandado de busca e apreensão"],
    passos: ["Guarde a carta e o envelope de cobrança.", "Tente renegociar antes da ação.", "Se receber citação ou o carro for apreendido, procure a advogada no mesmo dia: os prazos são de 5 e 15 dias."],
    urgente: ["Carro já apreendido", "Citação recebida", "Carro usado para trabalhar"],
    fontes: [["Decreto-Lei 911/1969", "https://www.planalto.gov.br/ccivil_03/decreto-lei/del0911.htm"], ["STJ — repetitivos", "https://processo.stj.jus.br/repetitivos/temas_repetitivos/"]],
  },

  "negativado": {
    acolhe: "Nome sujo de forma indevida dá direito a limpar o cadastro — e, muitas vezes, a indenização.",
    perguntas: [
      { q: "A dívida é:", a: ["Desconhecida (não fiz)", "Já paga", "Real, mas o valor está errado", "Real e não paga"] },
      { q: "Você recebeu aviso antes da negativação?", a: ["Não", "Sim", "Não sei"] },
      { q: "Já tinha outras negativações na época?", a: ["Não", "Sim", "Não sei"] },
    ],
    lei: [
      "O consumidor deve ser comunicado por escrito antes da inclusão do nome no cadastro (CDC, art. 43, §2º).",
      "O registro não pode ficar mais de 5 anos (CDC, art. 43, §1º).",
    ],
    juris: [
      "STJ, Súmula 359: quem deve avisar antes da negativação é o órgão do cadastro (SPC, Serasa); Súmula 404: o aviso não precisa ter aviso de recebimento.",
      "STJ, Súmula 548: depois do pagamento, o credor tem 5 dias úteis para retirar o nome do cadastro.",
      "STJ: a negativação indevida gera dano moral presumido, sem precisar provar o prejuízo.",
      "STJ, Súmula 385: se a pessoa já tinha outra negativação legítima, não cabe dano moral pela nova — só a retirada (exceção criada pela jurisprudência).",
    ],
    divergencia: ["Se a cobrança de dívida prescrita em plataformas de negociação (ex.: Serasa Limpa Nome) é permitida: os tribunais ainda decidem de formas diferentes."],
    prazos: ["Dívida paga: o credor tem 5 dias úteis para tirar seu nome.", "O registro sai automaticamente depois de 5 anos."],
    docs: ["Consulta atualizada do Serasa/SPC/Boa Vista", "Comprovante de pagamento (se a dívida foi paga)", "Prova de que não contratou (boletim de ocorrência, se houve fraude)", "Protocolos de reclamação"],
    passos: ["Consulte seu CPF nos cadastros e baixe o comprovante.", "Peça ao credor a retirada e a prova da dívida.", "Reclame no consumidor.gov.br.", "Procure a advogada para a retirada urgente e a indenização."],
    urgente: ["Crédito negado por causa da negativação", "Dívida que você nunca fez (possível fraude)"],
    fontes: [["Código de Defesa do Consumidor, art. 43", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"], ["STJ — Súmulas", "https://scon.stj.jus.br/SCON/sumstj/"]],
  },

  "compra-nao-reconhecida": {
    acolhe: "Compras que você não fez no cartão devem ser contestadas logo — e, em regra, o risco da fraude é do banco.",
    perguntas: [
      { q: "O cartão estava com você?", a: ["Sim (provável clonagem ou compra online)", "Não, foi perdido ou roubado"] },
      { q: "As compras foram feitas com chip e senha?", a: ["Não, foram online ou por aproximação", "Sim, com senha", "Não sei"] },
      { q: "Você já avisou o banco?", a: ["Sim", "Ainda não"], ajuda: ["chargeback"] },
    ],
    lei: [
      "O banco responde por falha de segurança do serviço, independentemente de culpa, salvo culpa exclusiva do cliente ou de terceiro (CDC, art. 14).",
    ],
    juris: [
      "STJ, Súmula 479: o banco responde por fraudes de terceiros em operações bancárias, como a clonagem de cartão.",
    ],
    divergencia: ["Compras com chip e senha: alguns tribunais entendem que houve descuido do titular com a senha; outros responsabilizam o banco quando as compras fogem do perfil e não foram bloqueadas."],
    prazos: ["Avise o banco assim que perceber: as compras feitas depois do aviso são de responsabilidade do banco.", "Conteste antes do vencimento da fatura, se possível."],
    docs: ["Fatura com as compras marcadas", "Protocolo da contestação", "Boletim de ocorrência (roubo, perda ou fraude)"],
    passos: ["Bloqueie o cartão no app e conteste as compras (chargeback), anotando o protocolo.", "Registre boletim de ocorrência.", "Se o banco negar o estorno, reclame no consumidor.gov.br e no Banco Central.", "Procure a advogada para cobrar a devolução e, se for o caso, indenização."],
    urgente: ["Valor alto", "Banco cobrando as compras contestadas", "Nome ameaçado de negativação"],
    fontes: [["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"], ["Banco Central — reclamações", "https://www.bcb.gov.br/meubc/registrar_reclamacao"]],
  },
};
