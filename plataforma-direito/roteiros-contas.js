// Perda de contas em redes sociais e aplicativos (WhatsApp, Instagram, Facebook, TikTok, Gmail...):
// bloqueio, banimento, invasão ou exclusão. Itens [CONFERIR] ficam escondidos até a revisão da advogada.
Object.assign(ROTEIROS, {
  "perda-conta": {
    acolhe: "Perder o WhatsApp, o Instagram ou outra conta pode parar o seu trabalho e expor seus contatos a golpes. Há caminhos para recuperar o acesso e preservar os seus dados.",
    perguntas: [
      { q: "O que aconteceu com a conta?", a: ["Foi invadida (hackeada)", "Foi bloqueada ou banida pela plataforma", "Foi excluída", "Perdi o número ou o e-mail de acesso"] },
      { q: "Você usa a conta para trabalhar ou vender?", a: ["Sim", "Não"] },
      { q: "Golpistas pediram dinheiro aos seus contatos?", a: ["Sim", "Não", "Não sei"] },
    ],
    lei: [
      "A relação com a plataforma é de consumo, ainda que o serviço seja gratuito: a empresa responde por falhas de segurança e deve informar com clareza os motivos de bloqueio ou exclusão (Código de Defesa do Consumidor, arts. 6º, III, e 14).",
      "Você tem direito de pedir à plataforma a confirmação e o acesso aos seus dados pessoais (Lei Geral de Proteção de Dados, art. 18).",
      "As plataformas devem guardar os registros de acesso às aplicações por 6 meses, e o juiz pode mandar fornecê-los para identificar quem invadiu a conta (Marco Civil da Internet, arts. 15 e 22).",
    ],
    juris: ["Os tribunais têm determinado, inclusive com liminar, o restabelecimento de contas bloqueadas sem motivo claro ou invadidas por terceiros, com preservação dos dados, e reconhecido indenização quando a falha da plataforma causa prejuízo comprovado."],
    prazos: [
      "Aja rápido: os registros de acesso que ajudam a provar a invasão são guardados por 6 meses (Marco Civil, art. 15).",
      "A indenização por falha do serviço prescreve em 5 anos (Código de Defesa do Consumidor, art. 27).",
    ],
    docs: ["Prints da tela de bloqueio, das mensagens e dos e-mails da plataforma", "Nome de usuário, número ou e-mail ligado à conta", "Protocolos e respostas do suporte", "Boletim de ocorrência, se houve invasão ou golpe", "Provas do uso profissional (vendas, clientes, faturamento), se teve prejuízo"],
    passos: [
      "Use primeiro a recuperação oficial do aplicativo e anote cada protocolo.",
      "Se houve invasão, avise seus contatos por outro canal para não caírem em golpe e registre boletim de ocorrência (pode ser pela delegacia on-line).",
      "Guarde prints de tudo: tela de bloqueio, e-mails, mensagens enviadas pelos golpistas.",
      "Peça à plataforma, por escrito, o motivo do bloqueio e a cópia dos seus dados (LGPD).",
      "Se não resolver, procure a advogada: é possível pedir na Justiça, com urgência, a devolução da conta e a preservação dos dados. Nos Juizados Especiais, causas de até 20 salários mínimos dispensam advogado (Lei 9.099/1995, art. 9º).",
    ],
    urgente: ["A conta é usada para trabalhar ou vender", "Golpistas estão pedindo dinheiro aos seus contatos", "A plataforma avisou que vai excluir a conta"],
    fontes: [["Código de Defesa do Consumidor", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"], ["Marco Civil da Internet (Lei 12.965/2014)", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm"], ["Lei Geral de Proteção de Dados (Lei 13.709/2018)", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm"]],
  },
});
Object.assign(DUVIDAS_CASOS, {
  "perda-conta": [
    ["Posso exigir que a plataforma devolva a minha conta?", "Se o bloqueio não tem motivo claro ou a conta foi invadida por falha de segurança, é possível pedir o restabelecimento, inclusive na Justiça e com urgência. Se a conta violou de fato as regras da plataforma, a análise é diferente."],
    ["A plataforma pode apagar minhas conversas e fotos?", "Durante a discussão, é possível pedir à Justiça que mande preservar a conta e os dados. Pela LGPD, você também pode pedir cópia dos seus dados."],
    ["Tenho direito a indenização?", "Pode haver, quando a falha da plataforma causa prejuízo comprovado, como perda de vendas ou exposição a golpes. Cada caso depende das provas."],
    ["Golpistas usaram meu WhatsApp para pedir dinheiro. E agora?", "Avise seus contatos por outro meio, registre boletim de ocorrência e guarde os prints. Quem fez Pix para os golpistas deve pedir o MED ao próprio banco o quanto antes."],
    ["Perdi o chip ou troquei de número. Consigo recuperar o WhatsApp?", "Primeiro, recupere o número com a operadora (segunda via do chip). Depois, use a recuperação do aplicativo. Se a operadora ou a plataforma falharem, cabe reclamação e, se preciso, ação."],
    ["E a conta de quem já faleceu?", "Herança digital tem regras próprias: veja a situação sobre bens e contas digitais na herança."],
  ],
});
