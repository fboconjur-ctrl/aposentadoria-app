// Palavras do dia a dia (marcas de remédio, siglas, nomes populares) que levam à situação certa.
// Vale para a busca da página inicial e para o relato livre. Sem acento e em minúsculas; basta o começo da palavra.
(() => {
  const S = {
    // Remédios e tratamentos de alto custo
    "liminar-medicamento": ["monjaro", "mounjaro", "tirzepatida", "ozempic", "wegovy", "saxenda", "semaglutida", "liraglutida", "rybelsus", "canabidiol", "cbd", "cannabis", "spinraza", "nusinersena", "zolgensma", "evrysdi", "risdiplam", "trikafta", "kaftrio", "keytruda", "pembrolizumabe", "opdivo", "nivolumabe", "herceptin", "trastuzumabe", "ocrevus", "ocrelizumabe", "kesimpta", "tysabri", "natalizumabe", "humira", "adalimumabe", "stelara", "dupixent", "dupilumabe", "xolair", "rituximabe", "imunobiologico", "biologico", "insulina", "bomba de insulina", "sensor de glicose", "libre", "remedio caro", "remedio de alto custo", "medicamento de alto custo", "medicamento caro", "anvisa", "off label", "remedio importado", "medicamento importado", "quimio oral"],
    "sus-remedio": ["farmacia popular", "farmacia de alto custo", "componente especializado", "remedio do sus", "remedio pelo sus", "posto nao tem", "falta remedio", "secretaria de saude"],
    oncologico: ["cancer", "tumor", "quimioterapia", "quimio", "radioterapia", "oncolog", "metastase", "leucemia", "linfoma", "mama", "prostata"],
    bariatrica: ["bariatric", "reducao de estomago", "obesidade", "cirurgia plastica reparadora", "abdominoplastia", "retirada de pele", "dermolipectomia"],
    "tea-terapia": ["autismo", "autista", "tea", "aba", "fonoaudiolog", "terapia ocupacional", "psicopedagog", "denver", "equoterapia", "musicoterapia", "tdah"],
    "home-care": ["home care", "internacao domiciliar", "cuidador", "enfermagem em casa", "acamado"],
    "saude-mental": ["psiquiatr", "psicolog", "depressao", "ansiedade", "internacao psiquiatrica", "dependencia quimica", "clinica de recuperacao"],
    "fertilizacao": ["fertilizacao", "fiv", "in vitro", "reproducao assistida", "inseminacao", "congelamento de ovulos"],
    "opme-protese": ["protese", "ortese", "stent", "marcapasso", "implante", "material cirurgico", "parafuso", "opme"],
    "erro-medico": ["erro medico", "negligencia medica", "cirurgia errada", "sequela", "infeccao hospitalar"],
    "uti-sus": ["uti", "leito", "vaga de uti", "regulacao", "transferencia hospitalar"],
    "reajuste-idade": ["mensalidade do plano", "plano aumentou", "reajuste do plano", "59 anos", "faixa etaria"],
    // INSS
    "auxilio-incapacidade": ["auxilio doenca", "afastado", "afastamento", "atestado", "nao consigo trabalhar", "b31", "beneficio por incapacidade"],
    "pericia-inss": ["pericia", "perito", "alta programada", "cessado", "cessaram"],
    "bpc-renda": ["bpc", "loas", "amparo assistencial", "beneficio de prestacao continuada", "cadunico", "cad unico", "baixa renda"],
    "salario-maternidade": ["maternidade", "gravida", "gestante", "parto", "licenca maternidade", "bebe nasceu"],
    "pensao-duracao": ["pensao por morte", "viuva", "viuvo", "marido faleceu", "esposa faleceu"],
    "auxilio-reclusao": ["auxilio reclusao", "esta preso", "presidio", "detento"],
    "ir-doenca-grave": ["isencao de imposto de renda", "isencao de ir", "imposto de renda doenca", "molestia grave"],
    "idade-minima": ["aposentar", "aposentadoria", "quando posso me aposentar", "tempo de contribuicao"],
    "especial-ppp": ["insalubre", "ppp", "ltcat", "aposentadoria especial", "ruido", "vigilante", "frentista", "enfermeira", "eletricista"],
    // Servidor e concurso
    "direitos-servidor": ["abono de permanencia", "licenca premio", "licenca capacitacao", "terco de ferias", "gratificacao", "vpni", "quinquenio", "anuenio", "gdf", "secretaria de educacao", "seedf", "pmdf", "cbmdf", "pcdf"],
    "reposicao-erario": ["devolver dinheiro", "devolucao de valores", "pagamento a maior", "pago a mais", "desconto no contracheque", "erario"],
    "tempo-servidor-inss": ["ctc", "certidao de tempo", "contagem reciproca", "pedi exoneracao", "sai do servico publico", "averbar"],
    "pad-prazo": ["pad", "processo disciplinar", "sindicancia", "comissao processante", "advertencia", "suspensao", "corregedoria"],
    "concurso-vagas": ["nomeacao", "fui aprovado", "cadastro de reserva", "cadastro reserva", "convocacao", "aprovado e nao chamado", "terceirizado no lugar"],
    "concurso-eliminacao": ["taf", "teste fisico", "psicotecnico", "avaliacao psicologica", "exame medico", "inapto"],
    "heteroidentificacao": ["cotas", "cotista", "pardo", "banca de heteroidentificacao", "autodeclaracao"],
    lai: ["lei de acesso", "acesso a informacao", "sic", "e-sic", "fala br", "transparencia"],
    // Bancos e consumo
    "pix-golpe": ["golpe", "fraude", "estelionato", "whatsapp clonado", "falso parente", "boleto falso", "med", "mecanismo especial de devolucao"],
    "consignado-nao-contratado": ["rmc", "rcc", "cartao consignado", "cartao beneficio", "emprestimo que nao fiz", "margem consignavel"],
    negativado: ["serasa", "spc", "nome sujo", "score", "boa vista"],
    superendividamento: ["superendividamento", "dividas demais", "nao consigo pagar", "renegociar", "desenrola"],
    "busca-apreensao": ["busca e apreensao", "carro financiado", "financiamento atrasado", "tomaram meu carro", "guincho"],
    voo: ["voo", "aviao", "atraso de voo", "cancelamento de voo", "overbooking", "bagagem", "mala extraviada", "latam", "gol", "azul"],
    telefonia: ["vivo", "claro", "tim", "oi fibra", "operadora", "internet caiu", "portabilidade numerica"],
    "falta-energia": ["neoenergia", "enel", "cemig", "light", "apagao", "queda de energia", "aparelho queimou"],
    "conta-alta": ["caesb", "sabesp", "conta de agua", "conta de luz", "conta veio alta"],
    "vazamento-dados": ["vazamento de dados", "lgpd", "dados vazados"],
    // Família, herança e cartório
    "pensao-alimenticia": ["pensao", "alimentos", "pensao do filho", "pai nao paga", "revisional de alimentos", "exoneracao de alimentos"],
    "guarda-convivencia": ["guarda", "guarda compartilhada", "visita", "visitas", "convivencia", "alienacao parental"],
    "divorcio-cartorio": ["divorcio consensual", "divorcio amigavel", "separacao amigavel", "divorcio no cartorio"],
    "divorcio-litigioso": ["divorcio litigioso", "nao quer dar o divorcio", "separacao litigiosa"],
    "inventario-cartorio": ["inventario", "heranca", "partilha", "espolio", "faleceu e deixou", "itcmd", "itcd"],
    testamento: ["testamento", "deixar bens", "doacao em vida"],
    "alteracao-nome": ["mudar nome", "trocar nome", "mudar sobrenome", "nome social", "retificacao de genero"],
    "retificacao-registro": ["certidao errada", "erro na certidao", "nome errado na certidao", "corrigir certidao"],
    "reconhecer-filho": ["paternidade", "reconhecer filho", "dna", "pai socioafetivo", "padrasto", "madrasta"],
    usucapiao: ["usucapiao", "sem escritura", "posse", "terreno sem documento"],
    // Trabalho e moradia
    "verbas-rescisorias": ["rescisao", "demitido", "demissao", "acerto", "aviso previo", "multa de 40", "justa causa"],
    "assedio-trabalho": ["assedio moral", "assedio sexual", "humilhacao no trabalho", "chefe abusivo"],
    "despejo-aluguel": ["despejo", "inquilino", "locador", "aluguel atrasado", "dono do imovel"],
    condominio: ["condominio", "sindico", "vizinho", "barulho", "taxa condominial", "multa do condominio"],
  };
  for (const [id, lista] of Object.entries(S)) {
    if (typeof ROTEIROS === "undefined" || !ROTEIROS[id]) continue;
    PISTAS[id] = [...new Set([...(PISTAS[id] || []), ...lista])];
  }
})();
