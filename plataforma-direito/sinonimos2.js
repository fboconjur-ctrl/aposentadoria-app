// Lista ampliada de palavras do dia a dia → situação. Complementa sinonimos.js.
// Sem acento e em minúsculas. Siglas curtas (até 3 letras) só valem como palavra inteira.
(() => {
  const S = {
    // ================= SAÚDE =================
    // Medicamentos de alto custo (marca e princípio ativo)
    "liminar-medicamento": [
      // diabetes e obesidade
      "mounjaro", "zepbound", "trulicity", "dulaglutida", "victoza", "xultophy", "soliqua", "jardiance", "empagliflozina", "forxiga", "dapagliflozina", "tresiba", "degludeca", "toujeo", "glargina", "lantus", "fiasp", "novorapid", "humalog", "omnipod", "freestyle", "dexcom",
      // oncologia
      "imunoterapia", "terapia alvo", "atezolizumabe", "tecentriq", "durvalumabe", "imfinzi", "ipilimumabe", "yervoy", "bevacizumabe", "avastin", "pertuzumabe", "perjeta", "kadcyla", "enhertu", "trastuzumabe deruxtecana", "palbociclibe", "ibrance", "ribociclibe", "kisqali", "abemaciclibe", "verzenios", "olaparibe", "lynparza", "osimertinibe", "tagrisso", "alectinibe", "alecensa", "lorlatinibe", "imatinibe", "glivec", "dasatinibe", "nilotinibe", "ibrutinibe", "imbruvica", "venetoclax", "venclexta", "lenalidomida", "revlimid", "pomalidomida", "daratumumabe", "darzalex", "enzalutamida", "xtandi", "abiraterona", "zytiga", "apalutamida", "erleada", "regorafenibe", "sorafenibe", "lenvatinibe", "cabozantinibe", "temozolomida", "capecitabina", "car-t", "car t", "kymriah", "yescarta",
      // doenças raras e neurologia
      "atrofia muscular espinhal", "duchenne", "elevidys", "fibrose cistica", "ivacaftor", "kalydeco", "symdeko", "elexacaftor", "eculizumabe", "soliris", "ravulizumabe", "ultomiris", "enzima", "terapia de reposicao enzimatica", "fabry", "gaucher", "pompe", "mucopolissacaridose", "fenilcetonuria", "hemofilia", "emicizumabe", "hemlibra", "fator viii", "esclerose multipla", "fingolimode", "gilenya", "teriflunomida", "aubagio", "cladribina", "mavenclad", "alemtuzumabe", "ofatumumabe", "esclerose lateral", "edaravona", "migranea cronica", "enxaqueca cronica", "erenumabe", "aimovig", "galcanezumabe", "emgality", "fremanezumabe", "ajovy", "toxina botulinica", "botox", "alzheimer", "lecanemabe", "donanemabe", "parkinson", "duodopa", "epilepsia refrataria", "cenobamato", "canabidiol",
      // reumatologia, dermatologia, gastro
      "artrite reumatoide", "espondilite", "psoriase", "lupus", "crohn", "retocolite", "colite ulcerativa", "infliximabe", "remicade", "etanercepte", "enbrel", "certolizumabe", "cimzia", "golimumabe", "simponi", "tocilizumabe", "actemra", "abatacepte", "orencia", "secuquinumabe", "cosentyx", "ixequizumabe", "taltz", "guselcumabe", "tremfya", "risanquizumabe", "skyrizi", "ustequinumabe", "vedolizumabe", "entyvio", "tofacitinibe", "xeljanz", "baricitinibe", "olumiant", "upadacitinibe", "rinvoq", "belimumabe", "benlysta", "dermatite atopica", "omalizumabe", "mepolizumabe", "nucala", "benralizumabe", "fasenra", "asma grave", "urticaria cronica",
      // olhos, coração, outros
      "ranibizumabe", "lucentis", "aflibercepte", "eylea", "faricimabe", "vabysmo", "injecao intravitrea", "injecao no olho", "degeneracao macular", "edema macular", "retinopatia", "evolocumabe", "repatha", "alirocumabe", "praluent", "inclisirana", "sacubitril", "entresto", "hipertensao pulmonar", "bosentana", "ambrisentana", "macitentana", "selexipague", "riociguate", "hepatite c", "sofosbuvir", "hiv", "prep", "somatropina", "hormonio do crescimento", "puberdade precoce", "leuprorrelina", "teriparatida", "forteo", "denosumabe", "prolia", "romosozumabe", "osteoporose grave", "imunoglobulina", "ivig", "nutricao enteral", "dieta enteral", "formula infantil especial", "leite especial", "aptamil pepti", "neocate", "alergia a proteina do leite", "aplv", "oxigenio domiciliar", "concentrador de oxigenio", "cpap", "bipap", "apneia do sono", "cadeira de rodas", "protese auditiva", "aparelho auditivo", "implante coclear",
    ],
    // Exames e procedimentos negados ou demorados
    "plano-negou": [
      "exame negado", "negaram o exame", "negou o exame", "ressonancia", "ressonancia magnetica", "tomografia", "pet ct", "pet-ct", "pet scan", "cintilografia", "angiotomografia", "angiorressonancia", "cateterismo", "angioplastia", "ecocardiograma", "holter", "teste ergometrico", "endoscopia", "colonoscopia", "biopsia", "mamografia", "ultrassom", "ultrassonografia", "densitometria", "eletroneuromiografia", "polissonografia", "exame genetico", "sequenciamento", "exoma", "painel genetico", "oncotype", "mammaprint", "teste molecular", "pcr", "cariotipo", "video eeg", "eletroencefalograma", "neuronavegacao", "radiocirurgia", "gamma knife", "cirurgia robotica", "robotica", "cirurgia negada", "procedimento negado", "nao autorizou", "autorizacao", "guia negada", "negativa de cobertura", "fora do rol", "rol da ans", "rol taxativo", "nao tem cobertura", "nao esta no rol", "hemodialise", "dialise", "transplante", "medula ossea", "hemodinamica", "artroscopia", "hernia de disco", "coluna", "joelho", "quadril", "catarata", "cirurgia refrativa", "estrabismo", "cirurgia cardiaca", "marcapasso", "ablacao", "embolizacao", "vasectomia", "laqueadura", "histerectomia", "miomectomia", "endometriose", "mastectomia", "reconstrucao mamaria", "reducao de mama", "ginecomastia", "septoplastia", "amigdala", "adenoide", "fisioterapia", "hidroterapia", "pilates", "rpg", "sessoes", "limite de sessoes", "pediasuit", "therasuit",
    ],
    "prazo-atendimento": ["demora para marcar", "nao tem vaga", "sem agenda", "agenda fechada", "nao tem medico", "nao tem especialista", "prazo maximo", "rn 566", "rn 259", "marcacao", "fila do plano", "consulta demorada", "nao consigo marcar", "credenciado", "rede credenciada", "descredenciado", "medico saiu do plano", "hospital saiu do plano"],
    "fila-sus": ["fila do sus", "sisreg", "regulacao", "ubs", "upa", "posto de saude", "hospital publico", "cirurgia eletiva", "espera cirurgia", "espera consulta", "espera exame", "transporte sanitario", "tfd", "tratamento fora de domicilio", "ses df", "hospital de base"],
    "reembolso": ["reembolso", "livre escolha", "medico particular", "pagou particular", "nota fiscal do medico", "recibo medico", "tabela de reembolso"],
    "cancelamento-plano": ["plano cancelado", "cancelaram meu plano", "rescisao do plano", "inadimplencia do plano", "plano suspenso", "atraso no plano", "60 dias de atraso"],
    "manter-plano": ["manter o plano", "plano da empresa", "aposentado plano", "artigo 30", "artigo 31", "demitido plano de saude", "continuar no plano"],
    "carencia-urgencia": ["carencia", "24 horas", "urgencia", "emergencia", "pronto socorro", "plano novo"],
    "portabilidade": ["portabilidade de carencia", "trocar de plano", "mudar de plano"],
    "odontologico": ["dentista", "odontologico", "plano odontologico", "implante dentario", "aparelho ortodontico"],
    "home-care": ["home care", "internacao domiciliar", "tecnico de enfermagem", "enfermeiro em casa", "traqueostomia", "gastrostomia", "sonda", "ventilacao mecanica", "respirador", "acamado", "cuidados paliativos"],
    "liminar-descumprida": ["liminar descumprida", "plano nao cumpriu", "nao cumpre a liminar", "multa diaria", "astreintes", "decisao descumprida"],
    // ================= INSS =================
    indeferido: ["indeferido", "indeferimento", "negado pelo inss", "beneficio negado", "pedido negado", "recurso inss", "crps", "junta de recursos", "carta de indeferimento", "exigencia"],
    "descontos-beneficio": ["desconto indevido", "contribuicao associativa", "sindicato desconta", "associacao desconta", "conafer", "ambec", "desconto associacao", "mensalidade associacao", "farra do inss"],
    "revisao-beneficio": ["revisao", "recalculo", "valor errado", "aposentadoria baixa", "calculo errado", "salarios de contribuicao", "teto"],
    "vida-toda": ["revisao da vida toda", "vida toda", "tema 1102"],
    "invalidez": ["aposentadoria por invalidez", "incapacidade permanente", "invalidez", "aposentado por doenca"],
    "adicional-25": ["acrescimo de 25", "25 por cento", "grande invalidez", "precisa de cuidador"],
    "auxilio-acidente": ["auxilio acidente", "sequela de acidente", "b94", "reducao da capacidade"],
    "pcd-quem": ["aposentadoria pessoa com deficiencia", "deficiente", "lc 142", "avaliacao biopsicossocial"],
    rural: ["rural", "lavrador", "agricultor", "roca", "segurado especial", "trabalhador rural", "pescador"],
    "tempo-militar": ["servico militar", "exercito", "tiro de guerra", "reservista"],
    "periodo-graca": ["qualidade de segurado", "periodo de graca", "parei de contribuir", "desempregado inss"],
    "calculo-valor": ["quanto vou receber", "valor da aposentadoria", "media salarial", "fator previdenciario"],
    "pontos-2026": ["regra dos pontos", "pontuacao", "transicao"],
    "professor": ["professor", "professora", "magisterio", "docente"],
    "servidor-aposentadoria": ["aposentadoria do servidor", "rpps", "iprev", "integralidade", "paridade", "abono permanencia"],
    "complementacao": ["previdencia complementar", "funpresp", "previ", "petros", "funcef", "fundo de pensao"],
    // ================= SERVIDOR E CONCURSO =================
    "estagio-probatorio": ["estagio probatorio", "avaliacao de desempenho", "estabilidade", "exonerado no estagio", "3 anos"],
    "demissao-servidor": ["demitido do servico publico", "cassacao", "reintegracao", "exonerado", "perdi o cargo"],
    "acumulacao-cargos": ["acumular cargos", "dois cargos", "acumulacao", "duas matriculas", "dois vinculos"],
    remocao: ["remocao", "transferencia", "mudar de lotacao", "lotacao", "acompanhar conjuge", "redistribuicao"],
    "progressao-servidor": ["progressao", "promocao", "interstício", "intersticio", "reenquadramento", "plano de carreira"],
    "insalubridade-servidor": ["adicional de insalubridade", "periculosidade", "laudo ambiental", "raio x", "adicional noturno"],
    "desvio-funcao": ["desvio de funcao", "trabalho de outro cargo", "funcao diferente"],
    "orgao-nao-paga": ["orgao nao paga", "atrasados do governo", "rpv", "precatorio", "exercicios anteriores", "passivo"],
    "questao-concurso": ["questao anulada", "gabarito", "recurso de questao", "banca", "cespe", "cebraspe", "fgv", "vunesp", "idecan", "quadrix", "iades", "redacao", "discursiva"],
    "requisitos-concurso": ["limite de idade", "altura minima", "tatuagem", "diploma na posse", "escolaridade"],
    "investigacao-social": ["investigacao social", "vida pregressa", "antecedentes", "eliminado na investigacao"],
    "posse-nomeacao": ["posse", "tomar posse", "prazo de posse", "exame admissional"],
    "pcd-concurso": ["vaga pcd", "pcd concurso", "deficiencia concurso", "laudo pcd", "equipe multiprofissional"],
    "processo-administrativo": ["processo administrativo", "recurso administrativo", "orgao nao responde", "pedido sem resposta", "lei 9784"],
    "multa-transito": ["multa", "detran", "cnh", "pontos na carteira", "suspensao do direito de dirigir", "lei seca", "bafometro", "radar", "jari", "recurso de multa", "cassacao da cnh"],
    "responsabilidade-estado": ["buraco na rua", "queda em via publica", "arvore caiu", "viatura bateu", "erro em hospital publico", "indenizacao do estado"],
    "sancao-licitante": ["empresa punida", "impedimento de licitar", "inidoneidade", "multa contratual", "ceis", "sicaf"],
    "licitacao-recurso": ["licitacao", "pregao", "pregao eletronico", "desclassificada", "inabilitada", "edital de licitacao", "comprasnet"],
    "reequilibrio-contrato": ["reequilibrio", "reajuste do contrato", "repactuacao", "contrato com o governo", "aditivo"],
    "tribunal-contas": ["tcu", "tcdf", "tribunal de contas", "tomada de contas"],
    improbidade: ["improbidade", "acao de improbidade", "ministerio publico acao"],
    desapropriacao: ["desapropriacao", "desapropriado", "terreno desapropriado"],
    "sancao-administrativa": ["procon multou", "vigilancia sanitaria", "visa", "conselho profissional", "crm", "coren", "crea", "oab multa", "anvisa multou", "agencia reguladora"],
    "auto-infracao": ["auto de infracao", "fiscalizacao", "autuado", "ibama", "agefis", "dfl"],
    // ================= BANCOS E CONSUMO =================
    "juros-abusivos": ["juros abusivos", "juros altos", "revisional", "taxa de juros", "cheque especial", "rotativo"],
    "conta-invadida": ["conta invadida", "conta hackeada", "transferencia que nao fiz", "app do banco invadido"],
    "tarifas-venda-casada": ["tarifa", "venda casada", "seguro embutido", "cesta de servicos", "titulo de capitalizacao"],
    "seguro-negado": ["seguro negado", "seguradora negou", "sinistro", "seguro de vida", "seguro do carro", "seguro prestamista"],
    "imovel-planta": ["imovel na planta", "atraso na obra", "construtora", "distrato", "entrega das chaves"],
    "compra-nao-reconhecida": ["compra nao reconhecida", "cartao clonado", "chargeback", "contestar compra"],
    defeito: ["defeito", "quebrou", "nao funciona", "assistencia tecnica", "garantia", "celular com defeito", "geladeira", "maquina de lavar", "carro zero com defeito"],
    arrependimento: ["arrependimento", "desistir da compra", "7 dias", "devolver compra online"],
    "compra-nao-entregue": ["nao entregou", "nao chegou", "pedido atrasado", "mercado livre", "shopee", "amazon", "magalu", "loja online"],
    turismo: ["pacote de viagem", "agencia de viagem", "hotel", "cruzeiro", "123 milhas", "hurb"],
    "cancelamento-curso": ["faculdade", "mensalidade escolar", "trancar curso", "multa de cancelamento", "fies", "escola particular"],
    "academia-curso": ["academia", "smart fit", "cancelar academia", "fidelidade"],
    "corte-luz-agua": ["corte de luz", "cortaram a luz", "cortaram a agua", "religacao"],
    "fraude-medidor": ["fraude no medidor", "gato", "toi", "termo de ocorrencia", "recuperacao de consumo"],
    "ligacoes-cobranca": ["ligacoes", "telemarketing", "nao me perturbe", "spam", "cobranca insistente"],
    "cobranca-dobro": ["cobranca indevida", "cobraram duas vezes", "repeticao em dobro", "devolucao em dobro"],
    // ================= FAMÍLIA, HERANÇA, CARTÓRIO =================
    "uniao-estavel": ["uniao estavel", "morar junto", "companheiro", "companheira", "convivente", "contrato de convivencia"],
    "regime-bens": ["regime de bens", "comunhao parcial", "separacao total", "pacto antenupcial", "mudar regime"],
    socioafetiva: ["socioafetiva", "filho de criacao", "pai de criacao", "mae de criacao", "multiparentalidade"],
    "planejamento-sucessorio": ["planejamento sucessorio", "holding familiar", "doacao com usufruto", "evitar inventario"],
    itcmd: ["itcmd", "itcd", "imposto de heranca", "imposto de doacao"],
    "inventario-negativo": ["inventario negativo", "sem bens", "nao deixou bens"],
    "cessao-hereditaria": ["cessao de direitos hereditarios", "vender parte da heranca", "renunciar heranca", "renuncia"],
    "heranca-digital": ["heranca digital", "redes sociais do falecido", "conta do falecido", "senha do falecido"],
    "alvara-valores": ["fgts do falecido", "pis do falecido", "saldo bancario do falecido", "alvara judicial", "restituicao do falecido"],
    "emancipacao": ["emancipacao", "emancipar", "menor de idade emancipado", "16 anos"],
    apostila: ["apostila", "apostilamento", "haia", "documento para o exterior", "cidadania"],
    "ata-notarial": ["ata notarial", "provar conversa", "print de whatsapp", "registrar prova"],
    protesto: ["protesto", "titulo protestado", "cartorio de protesto", "carta de anuencia", "cancelar protesto"],
    reurb: ["regularizacao fundiaria", "reurb", "lote irregular", "condominio irregular", "terracap"],
    adjudicacao: ["adjudicacao", "comprei e nao recebi escritura", "contrato de gaveta", "vendedor sumiu"],
    "certidao-matricula": ["matricula do imovel", "certidao de onus", "registro de imoveis", "onr"],
    "compra-imovel": ["comprar imovel", "escritura de compra", "itbi", "financiamento imobiliario", "cuidado ao comprar"],
    // ================= TRABALHO E MORADIA =================
    "horas-extras": ["hora extra", "horas extras", "banco de horas", "jornada", "intervalo", "plantao", "sobreaviso"],
    "acidente-trabalho": ["acidente de trabalho", "cat", "doenca ocupacional", "dort", "burnout", "estabilidade acidentaria"],
    "fgts-nao-depositado": ["fgts", "fgts nao depositado", "extrato fgts", "saque fgts"],
    "aluguel-caucao": ["caucao", "deposito do aluguel", "vistoria", "reajuste do aluguel", "igpm", "fiador", "entrega das chaves"],
  };
  for (const [id, lista] of Object.entries(S)) {
    if (typeof ROTEIROS === "undefined" || !ROTEIROS[id]) continue;
    PISTAS[id] = [...new Set([...(PISTAS[id] || []), ...lista])];
  }
})();
