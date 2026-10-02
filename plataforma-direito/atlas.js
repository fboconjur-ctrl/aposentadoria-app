// Códigos do Atlas de Mercados Jurídicos (Escritório Digital) ligados a cada resposta.
// O código vai no pedido de consulta: o caso chega classificado e a procura por tema pode ser medida.
const ATLAS = {
  "pcd-grau": "OPP-PREV-001", "pcd-quem": "OPP-PREV-001", "pontos-2026": "OPP-PREV-001", "idade-minima": "OPP-PREV-001",
  "calculo-valor": "OPP-PREV-010", "recurso-prazo": "OPP-PREV-002", "indeferido": "OPP-PREV-002", "especial-ppp": "OPP-PREV-008",
  "bpc-renda": "OPP-PREV-004", "pensao-duracao": "OPP-PREV-003", "salario-maternidade": "OPP-PREV-006", "ir-doenca-grave": "OPP-PREV-005",
  "descontos-beneficio": "OPP-BAN-002", "pericia-inss": "OPP-PREV-002", "servidor-aposentadoria": "OPP-ADM-005",
  "plano-negou": "OPP-SAU-002", "carencia-urgencia": "OPP-SAU-002", "prazo-atendimento": "OPP-SAU-002", "reajuste-idade": "OPP-SAU-006",
  "sus-remedio": "OPP-SAU-001", "tea-terapia": "OPP-SAU-004", "liminar-medicamento": "OPP-SAU-001", "manter-plano": "OPP-SAU-007",
  "bariatrica": "OPP-SAU-002", "oncologico": "OPP-SAU-001", "reembolso": "OPP-SAU-008", "erro-medico": "OPP-SAU-005",
  "home-care": "OPP-SAU-003", "cancelamento-plano": "OPP-SAU-007", "saude-mental": "OPP-SAU-009", "liminar-descumprida": "OPP-SAU-001",
  "arrependimento": "OPP-CON-001", "defeito": "OPP-CON-003", "voo": "OPP-CON-004", "negativado": "OPP-CON-002", "cobranca-dobro": "OPP-CON-005",
  "pix-golpe": "OPP-BAN-001", "consignado-nao-contratado": "OPP-BAN-002", "superendividamento": "OPP-BAN-003", "busca-apreensao": "OPP-BAN-004",
  "telefonia": "OPP-CON-007", "seguro-negado": "OPP-CON-001", "compra-nao-entregue": "OPP-CON-006", "corte-luz-agua": "OPP-CON-008", "imovel-planta": "OPP-IMO-007",
  "pad-prazo": "OPP-ADM-001", "pad-prescricao": "OPP-ADM-001", "concurso-vagas": "OPP-ADM-004", "concurso-eliminacao": "OPP-ADM-004", "heteroidentificacao": "OPP-ADM-004",
  "licitacao-recurso": "OPP-ADM-002", "orgao-nao-paga": "OPP-ADM-003", "multa-transito": "OPP-ADM-010", "tribunal-contas": "OPP-ADM-006",
  "inventario-cartorio": "OPP-SUC-001", "divorcio-cartorio": "OPP-FAM-001", "mudar-nome": "OPP-IMO-002", "usucapiao": "OPP-IMO-001", "uniao-estavel": "OPP-FAM-004",
  "testamento": "OPP-SUC-003", "planejamento-sucessorio": "OPP-SUC-002", "adjudicacao": "OPP-IMO-004", "protesto": "OPP-CON-002", "ata-notarial": "OPP-IMO-002", "itcmd": "OPP-SUC-001",
};
// Código padrão por área, quando a pessoa chega pela triagem e não por uma resposta.
const ATLAS_AREA = { previdenciario: "OPP-PREV-001", saude: "OPP-SAU-001", consumidor: "OPP-CON-001", administrativo: "OPP-ADM-001", cartorio: "OPP-SUC-001" };

if (typeof ATLAS_EXTRA !== "undefined") Object.assign(ATLAS, ATLAS_EXTRA);
