// Revisão da advogada (25/11/2026): correções nas 16 situações de Direito Administrativo do site.
// Substitui só os campos indicados na revisão; o restante de cada situação continua como estava.
(() => {
  const S = (id, campos) => { if (ROTEIROS[id]) Object.assign(ROTEIROS[id], campos); };
  const MS = "Mandado de segurança, quando cabível: 120 dias da ciência do ato impugnado (Lei 12.016/2009, art. 23).";

  S("concurso-vagas", {
    prazos: ["Fique atento(a) ao fim da validade do concurso.", MS, "Em omissão de nomeação ou preterição, identifique o ato ou o marco concreto antes de contar o prazo. Pedido de reconsideração administrativo não interrompe esse prazo."],
    passos: ["Confira no Diário Oficial a homologação, a classificação e a prorrogação da validade.", "Faça pedido administrativo de nomeação e guarde o protocolo (lembrando que ele não interrompe o prazo do mandado de segurança).", "Reúna provas de preterição. A contratação de temporários, sozinha, não comprova preterição.", "Procure a advogada antes do fim da validade."],
  });
  S("concurso-eliminacao", {
    acolhe: "O edital deve informar as etapas e os critérios de avaliação — e eliminações fora dessas regras podem ser contestadas.",
    lei: ["As etapas e critérios do concurso devem estar previstos no edital, e as exigências precisam ser compatíveis com o cargo (Constituição, art. 37, I e II).", "O exame psicotécnico exige previsão em lei e critérios objetivos (STF, Súmula Vinculante 44)."],
    prazos: ["Recurso administrativo: no prazo do edital, normalmente de poucos dias.", MS],
    docs: ["Edital", "Resultado da etapa, motivação da eliminação e comprovante de ciência", "Recurso administrativo e a resposta", "Laudos e exames particulares que contestem o resultado"],
  });
  S("pad-prazo", {
    lei: ["No PAD federal ordinário, a comissão tem 60 dias, contados da publicação do ato que a constituiu, prorrogáveis por igual período quando necessário (Lei 8.112/1990, art. 152).", "Depois da indiciação, a defesa escrita é de 10 dias da citação, ou de 20 dias em prazo comum se houver dois ou mais indiciados (Lei 8.112/1990, art. 161, §§1º e 2º).", "Prescrição: 5 anos para demissão e cassação; 2 anos para suspensão; 180 dias para advertência, contados da ciência do fato pela autoridade (Lei 8.112/1990, art. 142).", "Servidores estaduais, distritais e municipais seguem o estatuto e o rito do próprio ente."],
    prazos: ["Defesa escrita: 10 dias da citação (federal), ou o prazo do estatuto local.", "O excesso de prazo do PAD, sozinho, não anula o processo: é preciso demonstrar prejuízo à defesa.", "Verifique a prescrição: pode encerrar o caso."],
    docs: ["Portaria de instauração e portaria de prorrogação, se houver", "Mandado de citação, termo de indiciamento e comprovante de ciência", "Cópia integral dos autos", "Documentos e testemunhas a seu favor"],
  });
  S("direitos-servidor", {
    lei: ["No regime federal, o horário especial dispensa compensação para o servidor com deficiência e para quem tenha cônjuge, filho ou dependente com deficiência, comprovada a necessidade por junta médica oficial (Lei 8.112/1990, art. 98, §§2º e 3º).", "No DF, a LC 840/2011 (art. 61) prevê redução de até 50% da jornada, sem compensação, nas hipóteses que descreve.", "O abono de permanência depende da regra do ente (Constituição, art. 40, §19, e normas locais).", "As dívidas da Fazenda Pública prescrevem em 5 anos (Decreto 20.910/1932, art. 1º)."],
    juris: ["STF, Tema 1.097: o horário especial do art. 98 da Lei 8.112/1990 se aplica a servidores estaduais e municipais quando falta previsão local.", "STJ, Súmula 85: nas relações de trato sucessivo, sem negativa do próprio direito, prescrevem em regra apenas as parcelas vencidas antes dos 5 anos anteriores à ação."],
    prazos: ["Cobre o quanto antes: as parcelas mais antigas que 5 anos antes da ação podem ficar de fora."],
  });
  S("multa-transito", {
    lei: ["A notificação da autuação deve ser expedida em até 30 dias da infração; se não for, o auto é arquivado (Código de Trânsito, art. 281, parágrafo único, II). A data de recebimento importa para os demais prazos.", "Há etapas de defesa: defesa prévia, recurso à JARI e recurso em segunda instância, que depende do órgão autuador (Código de Trânsito, arts. 281 a 288).", "A CNH é suspensa ao atingir 20 pontos em 12 meses com 2 ou mais infrações gravíssimas; 30 pontos com 1 gravíssima; ou 40 pontos sem gravíssimas. Para quem exerce atividade remunerada ao volante, o limite é de 40 pontos em 12 meses, independentemente da gravidade, sem afastar as infrações que já preveem suspensão própria (Código de Trânsito, art. 261).", "Recusar o bafômetro é infração gravíssima, com multa multiplicada por 10 e suspensão por 12 meses (Código de Trânsito, art. 165-A)."],
    passos: ["Confira se a notificação foi expedida em até 30 dias da infração.", "Se não era você dirigindo, indique o condutor no prazo.", "Apresente defesa prévia; depois, se preciso, recurso à JARI e à segunda instância.", "Em suspensão ou cassação, procure a advogada: a defesa é mais técnica."],
    docs: ["As duas notificações recebidas (autuação e penalidade), frente e verso", "Comprovante de indicação do condutor, se houver", "CRLV e CNH", "Fotos, testemunhas ou documentos que mostrem que você não cometeu a infração"],
  });
  S("responsabilidade-estado", {
    acolhe: "Quando a atuação do poder público causa um prejuízo, pode haver indenização — desde que comprovados o dano e a ligação com essa atuação.",
    juris: ["STF, Tema 940: a ação deve ser proposta contra o Estado ou a prestadora de serviço público, não contra o servidor; o Estado pode depois cobrar do agente se houve dolo ou culpa.", "Nas omissões (por exemplo, falta de manutenção), a análise depende do dever de agir, do tipo de omissão e da prova do caso."],
    prazos: ["Contra a Fazenda Pública, a regra geral é de 5 anos. Identifique a data da ciência e da configuração do dano, e não deixe para depois: provas se perdem."],
  });
  S("pad-prescricao", {
    lei: ["Prescrição (federal): 5 anos para demissão, cassação e destituição; 2 anos para suspensão; 180 dias para advertência, contados da ciência do fato pela autoridade competente (Lei 8.112/1990, art. 142).", "A prescrição é interrompida pelo primeiro ato válido de instauração de PAD ou de sindicância punitiva e volta a correr por inteiro após 140 dias. Sindicância meramente investigativa não interrompe.", "Se a infração também é tipificada como crime, aplica-se o prazo da lei penal, mesmo sem apuração criminal em curso (art. 142, §2º)."],
    docs: ["Prova da data em que a autoridade soube do fato", "Portaria de instauração", "Decisão e cópia integral do processo"],
  });
  S("licitacao-recurso", {
    lei: ["Impugnação do edital ou pedido de esclarecimento: até 3 dias úteis antes da abertura (Lei 14.133/2021, art. 164).", "Contra julgamento das propostas e habilitação ou inabilitação, a intenção de recorrer deve ser manifestada imediatamente, sob pena de preclusão; as razões vêm em 3 dias úteis, contados do marco do art. 165, §1º, I (Lei 14.133/2021, art. 165).", "Em anulação e revogação, confira a intimação ou a ata para contar o prazo.", "A diligência pode sanar falhas formais, nos limites dos arts. 12, III, e 64 da Lei 14.133/2021."],
    passos: ["Manifeste a intenção de recorrer imediatamente na sessão e guarde o registro.", "Apresente as razões em 3 dias úteis e guarde o comprovante de protocolo.", "Procure a advogada no mesmo dia da decisão."],
    docs: ["Edital e anexos", "Ata da sessão com o registro da intenção de recorrer", "Proposta e documentos de habilitação", "Decisão recorrida e comprovante de protocolo"],
  });
  S("orgao-nao-paga", {
    lei: ["A administração paga na ordem cronológica, observadas a fonte de recursos e a categoria do contrato, com exceções motivadas (Lei 14.133/2021, art. 141).", "Atraso superior a 2 meses, contado da emissão da nota fiscal, pode dar direito à extinção do contrato ou à suspensão da execução até a normalização, observadas as exceções do art. 137, §3º (Lei 14.133/2021, art. 137).", "Os valores atrasados devem ser corrigidos e acrescidos de juros, conforme o contrato e a lei."],
    passos: ["Notifique o órgão formalmente, cobrando o pagamento e pedindo a posição na ordem cronológica.", "Antes de interromper o serviço, verifique se a Lei 14.133/2021 se aplica ao contrato e formalize a opção pela suspensão ou extinção.", "Procure a advogada para a cobrança judicial, se necessário."],
    docs: ["Contrato e aditivos", "Notas fiscais e atestes", "Ordens de serviço e medições", "Notificações enviadas e prova da cobrança"],
  });
  S("heteroidentificacao", {
    juris: ["STF, ADC 41: a heteroidentificação é legítima, desde que respeite a dignidade da pessoa e garanta contraditório e ampla defesa.", "A validade da eliminação depende da motivação, do procedimento aplicável e do acesso ao recurso."],
    prazos: ["Recurso administrativo no prazo do edital.", MS],
    docs: ["Edital", "Decisão da banca, motivação e gravação, se disponível", "Fotos e documentos", "Recurso e resposta"],
  });
  S("tribunal-contas", {
    lei: ["Os tribunais de contas julgam as contas de administradores e responsáveis, nos limites do art. 71 da Constituição, e emitem parecer prévio sobre as contas de governo do chefe do Executivo, conforme o regime aplicável.", "No TCU, quando há débito, o responsável é citado para apresentar alegações de defesa ou recolher o valor, no prazo regimental de 15 dias (Lei 8.443/1992, art. 12, II). Nos demais tribunais de contas, confira a lei orgânica, o regimento e a própria citação."],
    juris: ["STF, Tema 899: trata da prescritibilidade da pretensão de ressarcimento fundada em decisão de tribunal de contas."],
    prazos: ["Confira o prazo e o rito na citação. Quando cabível, peça prorrogação antes do vencimento e acompanhe o deferimento."],
  });
  S("improbidade", {
    acolhe: "A Lei de Improbidade mudou muito em 2021: hoje, só há improbidade com dolo.",
    lei: ["Desde a Lei 14.230/2021, só há improbidade com dolo; a culpa não basta (Lei 8.429/1992, art. 1º, §§1º a 3º).", "As condutas de violação de princípios passaram a ser uma lista fechada (art. 11).", "O prazo geral de prescrição é de 8 anos (art. 23).", "A contestação segue o prazo de 30 dias do art. 17, §7º, observado o marco legal."],
    juris: ["STF, Tema 1.199: a revogação da modalidade culposa se aplica aos casos sem trânsito em julgado, com exame de eventual dolo; o novo regime de prescrição é irretroativo, com novos marcos a partir da publicação da reforma.", "STF, ADIs 7.156 e 7.236 (julho de 2026): afastou o reinício da contagem pela metade após a interrupção, manteve as hipóteses de interrupção e fixou limite máximo de 20 anos."],
    prazos: ["Contestação: 30 dias (art. 17, §7º). Procure ajuda ao receber a citação."],
  });
  S("desapropriacao", {
    acolhe: "A Constituição exige indenização justa, prévia e em dinheiro na desapropriação, ressalvadas as exceções constitucionais.",
    lei: ["A desapropriação exige indenização justa, prévia e em dinheiro, ressalvadas as exceções da Constituição (art. 5º, XXIV).", "Na ação judicial, a defesa só pode discutir o valor e vícios do processo; outras questões vão em ação própria (Decreto-Lei 3.365/1941, art. 20).", "A imissão provisória na posse exige alegação de urgência e depósito, conforme o art. 15 do Decreto-Lei 3.365/1941."],
    juris: ["A incidência de juros e correção depende da hipótese.", "STF, Tema 865: a complementação final da indenização será paga por depósito judicial direto se o Poder Público estiver em atraso com os precatórios."],
  });
  S("lai", {
    acolhe: "Qualquer pessoa pode pedir informações a órgãos públicos, sem precisar explicar o motivo.",
    lei: ["Qualquer pessoa pode pedir informação, sem precisar dizer o motivo (Lei 12.527/2011, art. 10, §3º).", "Se a informação estiver disponível, o acesso deve ser imediato. Se não for possível, o órgão tem até 20 dias para responder, prorrogáveis por mais 10 com justificativa expressa e ciência do requerente (art. 11).", "Contra o indeferimento, cabe recurso em 10 dias da ciência (art. 15).", "A busca e o fornecimento são gratuitos, ressalvado o custo de reprodução, com isenção para quem não puder pagar sem prejuízo do sustento (art. 12)."],
    prazos: ["Resposta: imediata ou em até 20 dias (+10).", "Recurso: 10 dias da ciência da negativa."],
    docs: ["Protocolo do pedido", "Resposta ou negativa", "Data da ciência"],
  });
  S("auto-infracao", {
    lei: ["Toda autuação deve permitir defesa e recurso (Constituição, art. 5º, LV). Diferencie o prazo de defesa contra o auto do prazo de recurso contra a decisão.", "No âmbito federal, o recurso administrativo é, em regra, de 10 dias, salvo disciplina específica (Lei 9.784/1999, art. 59).", "Na ação punitiva federal no exercício do poder de polícia, a prescrição é de 5 anos e a intercorrente, de 3 anos, com exclusões e causas de interrupção próprias (Lei 9.873/1999). Essa regra não se aplica a tributos, infrações funcionais ou entes locais."],
    docs: ["Auto de infração ou decisão e comprovante de ciência", "Licenças, alvarás e projetos", "Fotos e laudos", "Cópia do procedimento"],
  });
  S("tempo-servidor-inss", {
    lei: ["O tempo de regime próprio (RPPS) pode ser aproveitado no INSS mediante Certidão de Tempo de Contribuição emitida pelo regime de origem, observadas as restrições da contagem recíproca e a vedação de reutilizar período já aproveitado (Constituição, art. 201, §9º; Lei 8.213/1991, art. 96).", "Quem já contribuía para o INSS (cargo em comissão, temporário ou emprego público) deve conferir o CNIS e pedir acerto se houver divergência."],
    prazos: ["Peça a certidão logo após sair, enquanto os registros estão fáceis de localizar. A emissão não é automática, e cada órgão tem seus procedimentos."],
    docs: ["Atos de vínculo e de desligamento (nomeação, posse, exoneração)", "Registros contributivos", "Certidão de Tempo de Contribuição e relação das remunerações", "Certidão anterior, se houver", "CNIS atualizado"],
  });

  ["concurso-vagas", "concurso-eliminacao", "pad-prazo", "direitos-servidor", "multa-transito", "responsabilidade-estado", "pad-prescricao", "licitacao-recurso", "orgao-nao-paga", "heteroidentificacao", "tribunal-contas", "improbidade", "desapropriacao", "lai", "auto-infracao", "tempo-servidor-inss"]
    .forEach((id) => (ROTEIROS_REVISADOS[id] = "2026-11-25"));
})();
