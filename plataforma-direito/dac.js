// Ponte com o motor "Direito Administrativo Computável" (DAC): cada resposta de Administrativo
// aponta os domínios DAC relacionados. Os domínios vão no pedido de consulta para orientar o dossiê.
// O motor em si não roda na plataforma pública (ver conteudo/auditoria-dac.md).
const DAC_DOMINIOS = {
  "DA-02": "Organização Administrativa", "DA-03": "Processo Administrativo", "DA-04": "Agentes Públicos", "DA-05": "Licitações e Contratos",
  "DA-07": "Concessões", "DA-12": "Intervenção na Propriedade", "DA-13": "Serviços Públicos", "DA-16": "Transparência e Acesso à Informação",
  "DA-17": "Proteção de Dados", "DA-19": "Integridade e Anticorrupção", "DA-20": "Improbidade Administrativa", "DA-21": "Responsabilização Administrativa",
  "DA-23": "Controle Externo", "DA-24": "Controle Judicial", "DA-27": "Crimes contra Administração", "DA-01": "Constituição Administrativa",
};
const DAC = {
  "pad-prazo": ["DA-21", "DA-03", "DA-04"], "pad-prescricao": ["DA-21", "DA-04"], "concurso-vagas": ["DA-04", "DA-01"], "concurso-eliminacao": ["DA-04", "DA-24"],
  "heteroidentificacao": ["DA-04", "DA-01"], "licitacao-recurso": ["DA-05", "DA-03"], "orgao-nao-paga": ["DA-05"], "multa-transito": ["DA-03", "DA-24"],
  "tribunal-contas": ["DA-23", "DA-21"], "direitos-servidor": ["DA-04"], "improbidade": ["DA-20", "DA-21", "DA-27"], "responsabilidade-estado": ["DA-01", "DA-24"],
  "desapropriacao": ["DA-12"], "lai": ["DA-16", "DA-17"], "auto-infracao": ["DA-03", "DA-24"], "servidor-aposentadoria": ["DA-04"],
  "corte-luz-agua": ["DA-13", "DA-07"], "vazamento-dados": ["DA-17"],
};
function dacResumo(faqId) {
  const ids = DAC[faqId];
  return ids ? "Domínios DAC: " + ids.map((d) => `${d} ${DAC_DOMINIOS[d]}`).join("; ") : "";
}
