// Cartório sem processo judicial (extrajudicial): registro civil e atos que se resolvem direto no cartório.
const LRP = ["Lei 6.015/1973 (Registros Públicos)", "https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm"];
const CC = ["Código Civil", "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm"];
Object.assign(ROTEIROS, {
  "alteracao-nome": {
    acolhe: "Desde 2022, mudar o primeiro nome ou incluir sobrenome pode ser feito direto no cartório, sem processo.",
    perguntas: [{ q: "O que você quer mudar?", a: ["Meu primeiro nome (prenome)", "Incluir ou tirar sobrenome", "Nome do meu filho recém-nascido", "Nome e gênero (pessoa trans)"] }],
    lei: ["Maiores de 18 anos podem pedir a alteração do prenome diretamente no cartório de registro civil, sem precisar justificar; a reversão depois só por via judicial (Lei 6.015/1973, art. 56, com a Lei 14.382/2022).", "A inclusão de sobrenomes de família, do cônjuge ou a retirada em caso de divórcio também podem ser feitas no cartório (Lei 6.015/1973, art. 57).", "Pessoas trans podem alterar prenome e gênero diretamente no cartório, sem cirurgia ou laudo (STF, ADI 4.275; Provimento CNJ 73/2018, hoje no Código Nacional de Normas)."],
    juris: [],
    prazos: ["Nome do recém-nascido: os pais podem se opor ao nome registrado em até 15 dias após o registro, direto no cartório (Lei 6.015/1973, art. 55, §4º)."],
    docs: ["Certidão de nascimento ou casamento atualizada", "RG e CPF", "Certidões negativas exigidas pelo cartório"],
    passos: ["Procure o cartório de registro civil (pode ser outro que não o do seu registro).", "Apresente os documentos e as certidões pedidas.", "Depois, atualize RG, CPF, título, bancos e demais cadastros."],
    urgente: [],
    fontes: [LRP],
  },
  "retificacao-registro": {
    acolhe: "Erro de digitação, data ou nome errado na certidão muitas vezes se corrige no próprio cartório.",
    perguntas: [{ q: "Qual o erro?", a: ["Nome escrito errado", "Data ou local errados", "Nome de pai, mãe ou avós errado", "Outro"] }],
    lei: ["Erros que não exigem investigação podem ser corrigidos pelo próprio cartório, a pedido do interessado, independentemente de autorização judicial (Lei 6.015/1973, art. 110)."],
    juris: [],
    prazos: [],
    docs: ["Certidão com o erro", "Documentos que comprovam o dado correto (RG, certidões de pais e avós, documentos antigos)"],
    passos: ["Leve ao cartório onde está o registro a certidão e os documentos que comprovam o dado correto.", "Se o cartório entender que o caso exige prova mais complexa, cabe a retificação judicial."],
    urgente: ["Erro impedindo cidadania estrangeira, benefício ou casamento"],
    fontes: [LRP],
  },
  "reconhecer-filho": {
    acolhe: "Reconhecer a paternidade ou maternidade, inclusive socioafetiva, pode ser feito no cartório, sem processo.",
    perguntas: [{ q: "Qual a situação?", a: ["Sou o pai biológico e quero registrar", "Filho(a) de criação (socioafetivo)", "O pai não quer reconhecer"] }],
    lei: ["O reconhecimento de filho pode ser feito diretamente no registro de nascimento, por escritura ou documento particular arquivado em cartório (Código Civil, art. 1.609).", "O reconhecimento socioafetivo pode ser feito no cartório para pessoas acima de 12 anos, com o consentimento do filho e dos pais registrais (Provimento CNJ 63/2017, alterado pelo Provimento 83/2019; hoje no Código Nacional de Normas)."],
    juris: ["STF, Tema 622: a paternidade socioafetiva não impede o reconhecimento da biológica, com efeitos jurídicos próprios (multiparentalidade)."],
    prazos: [],
    docs: ["Certidão de nascimento do filho", "Documentos de quem reconhece", "Para socioafetividade: provas do vínculo (fotos, escola, plano de saúde, declarações)"],
    passos: ["Procure o cartório de registro civil.", "Se faltar consentimento ou a outra parte se recusar, o caminho é a ação judicial (investigação de paternidade)."],
    urgente: [],
    fontes: [CC, LRP],
  },
  "emancipacao": {
    acolhe: "A emancipação de filho com 16 anos ou mais é feita pelos pais em cartório, por escritura, sem juiz.",
    perguntas: [{ q: "Os dois pais concordam?", a: ["Sim", "Não", "Um dos pais é falecido ou desconhecido"] }],
    lei: ["Os pais, ou um deles na falta do outro, podem emancipar o filho com 16 anos completos por escritura pública, sem homologação judicial (Código Civil, art. 5º, parágrafo único, I).", "A escritura deve ser registrada no cartório de registro civil (Lei 6.015/1973, art. 89)."],
    juris: [],
    prazos: [],
    docs: ["Certidão de nascimento do filho", "Documentos dos pais", "Certidão de óbito, se for o caso"],
    passos: ["Lavre a escritura no tabelionato de notas.", "Registre no cartório de registro civil.", "Se um dos pais discorda, a questão vai para a Justiça."],
    urgente: [],
    fontes: [CC, LRP],
  },
});
Object.assign(DUVIDAS_CASOS, {
  "alteracao-nome": [
    ["Preciso explicar por que quero mudar de nome?", "Não. Desde a Lei 14.382/2022, maiores de 18 anos podem mudar o prenome uma vez no cartório sem justificar."],
    ["Posso voltar ao nome antigo depois?", "Só pela via judicial."],
    ["Mudar o nome apaga minhas dívidas ou processos?", "Não. O cartório comunica a alteração aos órgãos, e o CPF continua o mesmo."],
  ],
  "retificacao-registro": [
    ["Preciso de advogado para corrigir a certidão?", "No cartório, nem sempre é obrigatório. Mas se o cartório recusar ou o caso for complexo, a correção judicial exige advogado."],
    ["Quanto tempo demora?", "Varia por cartório; costuma ser bem mais rápido que um processo judicial."],
  ],
  "reconhecer-filho": [
    ["Posso ter dois pais ou duas mães na certidão?", "Sim, a multiparentalidade é reconhecida pelo STF. No cartório, há limites; casos mais complexos vão à Justiça."],
    ["Filho menor de 12 anos pode ter reconhecimento socioafetivo no cartório?", "Pelas regras atuais, não: o cartório exige mais de 12 anos. Abaixo disso, o caminho é judicial."],
  ],
  "emancipacao": [
    ["Emancipado pode dirigir ou comprar bebida?", "Não. A emancipação dá capacidade para atos da vida civil (contratos, por exemplo), mas não muda regras como CNH e venda de bebidas."],
    ["Os pais deixam de pagar pensão?", "A emancipação voluntária não afasta, por si só, a responsabilidade dos pais. Cada caso precisa de análise."],
  ],
});
