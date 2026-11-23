// Dúvidas concretas de quem está em cada situação, em linguagem simples.
// Informação geral: a resposta para o caso de cada pessoa depende dos documentos e é dada pela advogada.
// Chave = id do roteiro (roteiros.js). Cada item: [pergunta, resposta].
const DUVIDAS_CASOS = {
  "indeferido": [
    ["O INSS negou. Posso pedir de novo do zero?", "Você pode apresentar novo pedido com os documentos que faltaram. Antes, compare com o recurso ou a ação baseada no pedido anterior. A data do requerimento e o momento em que a prova foi apresentada podem alterar o início dos pagamentos."],
    ["Recorrer no INSS ou ir direto à Justiça: qual é melhor?", "O recurso pode corrigir erro de análise ou permitir a apresentação de documentos. Em regra, basta ter feito o pedido administrativo e obtido negativa para discutir a concessão na Justiça, sem esgotar os recursos. Se houver fatos ou provas novos, verifique se o INSS precisa analisá-los primeiro."],
    ["Recorrer custa alguma coisa?", "O recurso no INSS é gratuito e feito pelo Meu INSS. Na Justiça Federal, em causas de menor valor, o processo corre no Juizado Especial, sem custas no primeiro grau. Os honorários da advogada são combinados à parte, por escrito."],
    ["Se eu ganhar, recebo os meses que fiquei sem o benefício?", "Os atrasados dependem do termo inicial reconhecido e da prescrição aplicável, em regra quinquenal. A data do primeiro pedido nem sempre é o marco, especialmente quando a prova só surge na Justiça. Na via judicial, o pagamento de valores devidos pela Fazenda Pública segue o regime de RPV ou precatório."],
    ["Fui negado na perícia, mas continuo sem conseguir trabalhar. O que faço?", "Reúna relatórios médicos recentes e detalhados (com o CID, o tratamento e, principalmente, as limitações para o seu trabalho). Com isso, é possível recorrer, pedir de novo ou ir à Justiça, onde a perícia é feita por um médico nomeado pelo juiz."],
    ["Quanto tempo demora?", "No recurso do INSS, a análise costuma levar alguns meses. Na Justiça, depende muito da vara e de haver perícia. A advogada consegue dar uma ideia melhor olhando o seu caso e a sua cidade."],
  ],
  "idade-minima": [
    ["Com que idade eu me aposento hoje?", "Na regra geral do RGPS, a idade mínima é de 62 anos para mulheres e 65 para homens. Para quem ingressou após a reforma de 2019, o tempo mínimo é de 15 anos para mulheres e 20 para homens. Para homens já filiados na data da reforma, a transição por idade exige, em regra, 15 anos de contribuição."],
    ["Já trabalhava antes da Reforma. Muda alguma coisa para mim?", "Pode mudar bastante. Existem regras de transição (por pontos, idade progressiva, pedágio) pensadas para quem já contribuía. Uma delas pode permitir se aposentar antes ou com valor maior. A comparação depende do seu histórico no CNIS."],
    ["Trabalhei no campo. A idade é a mesma?", "Não. Para o trabalhador rural, a idade é menor: 55 anos para mulheres e 60 para homens, com comprovação da atividade rural. A prova costuma ser feita com documentos da época (bloco de produtor, contratos, certidões) e testemunhas."],
    ["Tem períodos que trabalhei e não aparecem no INSS. E agora?", "É comum. Períodos sem registro no CNIS podem ser incluídos com documentos: carteira de trabalho, contracheques, recibos, declarações da empresa. Corrigir o CNIS antes de pedir evita negativa e pode aumentar o valor."],
    ["Posso pagar o INSS por conta própria para completar o tempo?", "Sim, como contribuinte facultativo ou individual, conforme o seu caso. Antes de pagar, vale conferir quanto falta e qual plano de contribuição compensa, para não pagar a mais ou de forma que não conte para o que você precisa."],
    ["Vale a pena esperar para me aposentar com um valor maior?", "Às vezes, sim. Em algumas regras, cada ano a mais de contribuição aumenta o percentual do benefício. A simulação das regras com os seus dados mostra se compensa pedir agora ou esperar."],
  ],
  "descontos-beneficio": [
    ["Como sei que desconto é esse?", "Veja o extrato de pagamento no Meu INSS (ou no app) e confira o nome de cada desconto. Os mais comuns são mensalidades de associações e sindicatos, empréstimos consignados e cartões de crédito consignado."],
    ["Como paro o desconto?", "Identifique a origem no extrato. Se for mensalidade associativa, verifique no Meu INSS ou no o canal oficial de contestação e as condições do ressarcimento. Para empréstimo ou cartão não reconhecido, conteste no banco e guarde os protocolos. Bloquear o benefício para novos empréstimos não cancela contratos anteriores."],
    ["Consigo o dinheiro de volta?", "Se o desconto não foi autorizado por você, a devolução pode ser pedida. Dependendo do caso, pode ser em dobro e com indenização por danos morais. A advogada avalia os valores com base no seu extrato."],
    ["Eu assinei alguma coisa sem entender. Ainda posso reclamar?", "Pode. Contratos feitos sem informação clara, por telefone sem confirmação ou aproveitando a falta de conhecimento da pessoa podem ser questionados. Separe tudo o que você recebeu (contratos, mensagens, comprovantes)."],
    ["O banco me ligou oferecendo solução. Devo aceitar?", "Encerre a ligação e procure a instituição pelo aplicativo ou pelo telefone oficial. Preserve os protocolos e mantenha senhas e códigos em sigilo. Pedidos de Pix ou de acesso remoto são sinais de golpe."],
  ],
  "pcd-quem": [
    ["Preciso ter uma doença específica para ter direito?", "Não. O que conta é a limitação de longo prazo (física, mental, intelectual ou sensorial) que, junto com as barreiras do dia a dia, dificulta a sua participação em igualdade com as outras pessoas. O grau é definido na avaliação do INSS, não pelo nome da doença."],
    ["Como é a avaliação do INSS?", "É feita por um perito médico e por um assistente social, que avaliam como a deficiência afeta a sua vida e o seu trabalho. Leve relatórios que descrevam as limitações concretas (locomoção, comunicação, cuidados pessoais), e não só o diagnóstico."],
    ["Tenho que parar de trabalhar para me aposentar?", "Não é preciso parar de trabalhar para pedir aposentadoria da pessoa com deficiência. Essa modalidade considera a deficiência e o histórico contributivo. A capacidade para o trabalho é tratada de forma diferente na aposentadoria por incapacidade permanente."],
    ["A deficiência começou depois que eu já trabalhava. Conta?", "Conta. Os períodos com e sem deficiência são convertidos de forma proporcional. Por isso é importante provar desde quando a deficiência existe."],
    ["E se o INSS classificar meu grau como leve, mas eu discordar?", "O grau pode ser contestado por recurso ou na Justiça, com laudos e outras provas. O grau muda o tempo exigido, então vale a pena discutir quando há elementos."],
  ],
  "bpc-renda": [
    ["Quem tem direito ao BPC/LOAS?", "Pessoas com 65 anos ou mais e pessoas com deficiência de qualquer idade, de família de baixa renda, que não tenham como se manter. Não é preciso ter contribuído para o INSS."],
    ["Qual é o limite de renda da família?", "O parâmetro geral é renda familiar mensal por pessoa de até 1/4 do salário mínimo. Confira quem integra a família pela LOAS, as rendas legalmente excluídas e as despesas dedutíveis, quando cabíveis. Outros elementos de vulnerabilidade podem ser relevantes na avaliação."],
    ["Preciso estar no CadÚnico?", "Sim. O CadÚnico deve estar atualizado, em regra a cada 24 meses. Também confira o CPF dos integrantes da família e as exigências de identificação biométrica aplicáveis ao pedido, inclusive as exceções."],
    ["O BPC paga 13º e deixa pensão?", "Não. O BPC não tem 13º salário e não gera pensão por morte para a família. Por isso, quando a pessoa tem algum tempo de contribuição, vale verificar se não há direito a uma aposentadoria, que é mais vantajosa."],
    ["Quem recebe BPC pode trabalhar?", "O exercício de atividade remunerada pela pessoa com deficiência, inclusive como MEI, em regra suspende o BPC. Se preenchidos os requisitos, pode haver auxílio-inclusão. A contratação como aprendiz tem regra específica de acumulação por até dois anos."],
    ["O BPC foi negado por causa da renda. E agora?", "Confira se a renda foi calculada certo (quem mora na casa, o que entra de verdade) e reúna comprovantes de gastos com saúde e cuidados. Com isso, é possível recorrer ou ir à Justiça, onde costuma haver estudo social da família."],
  ],
  "pensao-duracao": [
    ["Quem tem direito à pensão por morte?", "O INSS analisa os dependentes por classes. Na primeira estão cônjuge, companheiro e filhos não emancipados menores de 21 anos, ou filhos inválidos ou com deficiência nas hipóteses legais. Na falta de dependentes da primeira classe, podem ter direito os pais. Depois vêm os irmãos que preencham os requisitos legais. Pais e irmãos precisam comprovar dependência econômica."],
    ["Vivíamos juntos, mas não éramos casados. Tenho direito?", "Sim, desde que a união estável seja comprovada. Reúna documentos datados, como cadastro em plano de saúde, declaração fiscal ou comprovantes de domicílio. A lei exige, em regra, início de prova material contemporânea, com documento produzido nos 24 meses anteriores ao óbito."],
    ["A pensão é para sempre?", "Depende. Para o cônjuge ou companheiro(a), a duração varia conforme a idade de quem recebe e o tempo de casamento ou união e de contribuição. Em muitos casos é vitalícia; em outros, dura alguns anos. A regra exata depende dos seus dados."],
    ["Posso receber pensão e minha aposentadoria juntas?", "Pode, mas desde a Reforma de 2019 há uma redução no valor do benefício menor, calculada por faixas. Ainda assim, costuma compensar receber os dois."],
    ["Qual o prazo para pedir?", "Se o pedido for feito logo (em geral até 90 dias do falecimento, para a maioria dos dependentes), a pensão é paga desde a data da morte. Depois disso, é paga só a partir do pedido. Por isso, não deixe para depois."],
  ],
};

Object.assign(DUVIDAS_CASOS, {
  "plano-negou": [
    ["O plano pode negar se o procedimento não está no rol da ANS?", "A cobertura fora do rol é excepcional. Na ADI 7.265, o STF exigiu cumulativamente prescrição por profissional habilitado, ausência de negativa expressa da ANS ou de avaliação pendente sobre a incorporação, inexistência de alternativa adequada no rol, evidências científicas robustas de eficácia e segurança e registro na Anvisa. Formalize o pedido à operadora e guarde a resposta."],
    ["O plano tem que me dar a negativa por escrito?", "Sim. A operadora deve comunicar a negativa assistencial por escrito, com justificativa, independentemente de pedido do beneficiário, nos termos da RN 623 da ANS. Guarde a resposta e o protocolo."],
    ["É urgente. Dá para resolver rápido?", "Se houver risco clínico relevante, pode ser cabível um pedido judicial urgente. O relatório deve explicar a urgência, o risco da espera e o tratamento indicado. O tempo da decisão depende do caso e da documentação."],
    ["Reclamar na ANS adianta?", "Muitas vezes, sim. A reclamação na ANS (pelo site ou telefone 0800 701 9656) abre uma mediação com o plano, que tem prazo para responder. Pode resolver sem processo — e o protocolo ainda serve de prova."],
    ["E se eu pagar do meu bolso para não esperar?", "Guarde todas as notas e recibos. Se a negativa for considerada indevida, é possível pedir o reembolso, além de indenização em alguns casos."],
    ["O que o relatório do médico precisa dizer?", "O diagnóstico (CID), o tratamento indicado, por que ele é necessário no seu caso, se há alternativa e qual o risco de não fazer ou de atrasar. Quanto mais detalhado, mais forte o pedido."],
  ],
  "prazo-atendimento": [
    ["Existe prazo máximo para o plano marcar consulta?", "Sim. Após a carência, os prazos da ANS incluem sete dias úteis para consulta médica básica, 14 para outras especialidades e 21 para internação eletiva. A garantia é de acesso ao serviço por prestador apto, conforme a área de abrangência e as regras do plano."],
    ["Não tem médico disponível na rede. O que faço?", "Peça formalmente que a operadora indique prestador apto e guarde o protocolo. Se ela descumprir a garantia de atendimento e você tiver de pagar, pode caber reembolso integral conforme a regulação da ANS."],
    ["Adianta reclamar na ANS?", "Sim. A reclamação abre uma notificação ao plano, que precisa resolver em prazo curto. Guarde o número do protocolo."],
    ["É urgência ou emergência. Tem carência?", "Em urgência e emergência, a carência máxima é de 24 horas após a contratação. Depois disso, o plano deve atender."],
  ],
  "liminar-medicamento": [
    ["O SUS tem que me dar um remédio que não está na lista?", "Se o medicamento tem registro na Anvisa, mas não foi incorporado ao SUS, o fornecimento judicial é excepcional. O Tema 6 do STF exige, entre outros requisitos cumulativos, negativa administrativa, questionamento amparado do ato ou da omissão de incorporação, falta de substituto no SUS, evidências científicas robustas, indispensabilidade clínica e incapacidade de pagar. O Tema 1.234 orienta competência e fluxo."],
    ["E o plano de saúde, tem que fornecer remédio?", "Depende do tipo de remédio e de como ele é usado. Medicamentos de uso em internação ou alguns tratamentos (como certos quimioterápicos orais) costumam ter cobertura. Remédios de uso domiciliar em geral não, salvo exceções."],
    ["Quanto tempo demora uma liminar?", "Não há prazo fixo para decisão. O juiz avalia a urgência clínica e os requisitos jurídicos à vista da documentação, e o prazo para cumprir dependerá da ordem concedida."],
    ["Que documentos preciso juntar?", "Receita e relatório médico detalhado, exames, a negativa do plano ou do posto (ou protocolo do pedido), comprovantes de renda e, se possível, orçamentos do remédio."],
  ],
  "reajuste-idade": [
    ["O plano pode aumentar o valor por causa da idade?", "Pode, mas dentro de regras. Os reajustes por faixa etária precisam estar previstos no contrato, seguir os limites da ANS e não podem ser abusivos. Para contratos mais recentes, não há reajuste por idade depois dos 60 anos."],
    ["Meu reajuste anual foi muito alto. É legal?", "Nos planos individuais, o limite é definido pela ANS todo ano. Nos coletivos (por empresa ou associação), o reajuste é negociado, mas precisa ser justificado e não pode ser abusivo. A análise depende do contrato e dos números."],
    ["Consigo de volta o que paguei a mais?", "Se o reajuste for considerado abusivo, é possível pedir a devolução das diferenças, em regra dos últimos anos (respeitado o prazo legal), além da correção das próximas mensalidades."],
    ["O que preciso para analisar?", "O contrato, os boletos (para ver a evolução dos valores) e as cartas de reajuste do plano."],
  ],
  "tea-terapia": [
    ["O plano é obrigado a cobrir terapias para autismo?", "Sim. A ANS determinou a cobertura das terapias indicadas pelo médico para pessoas com TEA (como psicologia, fonoaudiologia e terapia ocupacional, inclusive com métodos como ABA), sem limite de sessões."],
    ["O plano limita o número de sessões. Pode?", "Não. Para TEA e outros transtornos globais do desenvolvimento, não pode haver limite de sessões quando há indicação médica."],
    ["Não há profissional habilitado na rede. E agora?", "O plano deve indicar um profissional apto. Se não indicar, é possível buscar fora da rede e pedir o reembolso, ou pedir na Justiça que o plano custeie."],
    ["O que o relatório deve conter?", "Diagnóstico, terapias indicadas, método, carga horária semanal e justificativa. Relatórios genéricos enfraquecem o pedido."],
  ],
  "manter-plano": [
    ["Fui demitido(a). Posso continuar no plano da empresa?", "Se você contribuía para a mensalidade e foi demitido sem justa causa, pode manter a cobertura nas condições legais, assumindo o pagamento integral. O período é de um terço do tempo de contribuição, com mínimo de seis e máximo de 24 meses."],
    ["E se eu me aposentei?", "O aposentado que contribuiu para o plano também pode continuar, assumindo o valor integral. Com 10 anos ou mais de contribuição, pode ficar por tempo indeterminado; com menos, por um período proporcional."],
    ["Preciso avisar até quando?", "A opção deve ser feita, em regra, em até 30 dias da comunicação inequívoca do empregador sobre o direito de permanecer. Responda por escrito e preserve a prova da data em que recebeu a comunicação."],
    ["A empresa pagava tudo. Tenho esse direito?", "Em regra, só tem direito quem contribuía para a mensalidade do próprio plano. Coparticipação paga apenas ao usar consultas ou procedimentos não é contribuição para esse fim. Confira os contracheques e as condições da contratação coletiva."],
  ],
  "superendividamento": [
    ["O que é superendividamento?", "É quando a pessoa, de boa-fé, não consegue pagar as dívidas de consumo sem comprometer o mínimo para viver (moradia, alimentação, saúde). A lei (Lei 14.181/2021) criou um caminho para renegociar tudo junto."],
    ["Como funciona a renegociação?", "É feito um plano de pagamento com todos os credores ao mesmo tempo, em audiência de conciliação, preservando o mínimo existencial. Se algum credor não aceitar, o juiz pode definir um plano obrigatório."],
    ["Todas as dívidas entram?", "O procedimento abrange dívidas de consumo elegíveis. A lei exclui, entre outras, dívidas contraídas dolosamente sem propósito de pagar, crédito com garantia real, financiamento imobiliário e crédito rural. Confira cada contrato antes de montar o plano."],
    ["Vou ficar com o nome sujo?", "A renegociação busca justamente organizar a situação. Durante o plano, as condições são definidas para você conseguir pagar. A advogada orienta sobre o efeito nos cadastros em cada caso."],
    ["O banco desconta quase todo o meu salário. Pode?", "O consignado em folha obedece à margem prevista no regime de quem recebe. Em empréstimos bancários comuns debitados em conta, mesmo usada para receber salário, o STJ afasta a aplicação automática da margem do consignado enquanto houver autorização válida. Separe extratos, contratos e contracheques."],
  ],
  "consignado-nao-contratado": [
    ["Apareceu um empréstimo que eu não fiz. O que faço primeiro?", "Registre reclamação no banco (anote o protocolo), faça boletim de ocorrência e, se for aposentado, bloqueie o benefício para novos empréstimos no Meu INSS. Não gaste o dinheiro que caiu na conta: ele pode ter que ser devolvido."],
    ["O dinheiro caiu na minha conta. Posso usar?", "Não use. Se o contrato não foi feito por você, o ideal é devolver ou deixar o valor separado, para mostrar boa-fé. A advogada orienta a forma de devolução."],
    ["Recebo de volta as parcelas descontadas?", "Se a cobrança for reconhecida como indevida, pode caber restituição. A devolução em dobro segue o CDC e depende das circunstâncias da cobrança e de eventual engano justificável. Danos morais exigem análise própria."],
    ["Quais provas preciso?", "Extrato do benefício ou contracheque com os descontos, extrato da conta mostrando o depósito, protocolos de reclamação e o boletim de ocorrência."],
  ],
  "pix-golpe": [
    ["Caí em um golpe no Pix. Ainda dá para recuperar?", "Às vezes, sim. Avise o seu banco imediatamente e peça o MED (Mecanismo Especial de Devolução), que pode bloquear o valor na conta do golpista. Quanto mais rápido, maior a chance."],
    ["O banco é responsável?", "Depende. Se houve falha de segurança do banco (por exemplo, transações muito fora do seu padrão sem bloqueio, ou falha no atendimento), ele pode ser responsabilizado. Cada caso precisa ser analisado."],
    ["Preciso fazer boletim de ocorrência?", "O boletim de ocorrência pode documentar o golpe. Acione o banco imediatamente, sem esperar pelo registro policial, e preserve o comprovante do Pix, as mensagens e os protocolos."],
    ["Qual o prazo para pedir o MED?", "Segundo o Banco Central, registre o pedido no seu banco em até 80 dias da transação em caso de fraude, golpe ou crime. Faça isso assim que perceber o ocorrido. A restituição pode ser parcial e depende da análise e da recuperação dos recursos."],
  ],
  "busca-apreensao": [
    ["Atrasei parcelas do carro. O banco pode tomar o carro?", "Em alienação fiduciária, a mora comprovada pode levar à busca e apreensão. Além da via judicial, a legislação prevê procedimento extrajudicial em hipóteses específicas. Leia a notificação e verifique se já há processo judicial ou procedimento em cartório."],
    ["Dá para evitar perder o carro?", "Às vezes. É possível negociar, discutir cobranças abusivas no contrato ou, depois da apreensão, pagar a dívida em prazo curto definido pela lei para reaver o bem. A análise depende do contrato e do momento."],
    ["O carro foi levado. E agora?", "Na busca e apreensão judicial, o prazo para pagar a integralidade da dívida indicada pelo credor é de cinco dias da execução da liminar. O prazo de resposta é de 15 dias, também contado da execução da liminar. Se for procedimento extrajudicial, verifique a notificação e as regras próprias."],
    ["E se o banco vender o carro por menos do que devo?", "O valor da venda é abatido da dívida. O banco deve prestar contas. Se sobrar dívida, ela pode ser cobrada; se sobrar dinheiro, ele é seu."],
  ],
  "negativado": [
    ["Fui negativado sem aviso. Pode?", "A inclusão no cadastro de inadimplentes precisa ser precedida de comunicação ao consumidor. Se não houve aviso, ou se a dívida não existe, a negativação pode ser cancelada."],
    ["A dívida não é minha. Tenho direito a indenização?", "Negativação indevida costuma gerar indenização por danos morais, mas há exceções (por exemplo, quando a pessoa já tinha outras negativações legítimas). A advogada analisa com o seu relatório de crédito."],
    ["Paguei, mas meu nome continua sujo. O que fazer?", "Segundo a Súmula 548 do STJ, cabe ao credor excluir o registro em até cinco dias úteis do pagamento integral e efetivo. Guarde o comprovante e consulte o cadastro após o prazo."],
    ["Quanto tempo uma dívida pode ficar no meu nome?", "No máximo 5 anos. Depois disso, a informação deve ser retirada, mesmo que a dívida não tenha sido paga."],
  ],
  "compra-nao-reconhecida": [
    ["Apareceram compras que eu não fiz. O que faço?", "Bloqueie o cartão, conteste as compras no banco (anote o protocolo) e registre boletim de ocorrência. Não pague as compras contestadas sem orientação."],
    ["O banco disse que a compra foi com chip e senha, então é minha. E agora?", "Mesmo assim, o banco pode ser responsabilizado se houve falha de segurança, compras fora do seu padrão ou se a contestação foi mal analisada. Reúna as faturas e a resposta do banco."],
    ["Tenho direito ao dinheiro de volta?", "Se a compra não foi feita por você e não houve culpa sua, sim. E se a cobrança indevida foi paga, pode haver devolução em dobro em alguns casos."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "concurso-vagas": [
    ["Passei dentro do número de vagas. Tenho direito garantido?", "Em regra, sim. Quem é aprovado dentro do número de vagas previsto no edital tem direito à nomeação durante a validade do concurso (STF, Tema 161). A Administração só pode deixar de nomear em situações excepcionais e justificadas."],
    ["Fiquei no cadastro reserva. Tenho alguma chance?", "Sim, em situações específicas: quando surgem vagas e há contratação de temporários ou terceirizados para a mesma função, ou quando há desistência de candidatos à frente. Cada caso precisa de prova."],
    ["O concurso está para vencer e não me chamaram. O que faço?", "Não deixe passar: o pedido deve ser feito antes ou logo após o fim da validade. Guarde o edital, o resultado final e a publicação da prorrogação (se houver)."],
    ["Como provo que há vagas?", "Pelo Portal da Transparência, Diário Oficial (exonerações, aposentadorias), contratações temporárias e pedidos pela Lei de Acesso à Informação."],
  ],
  "concurso-eliminacao": [
    ["Fui eliminado no psicotécnico. Posso contestar?", "Pode. O exame psicológico precisa estar previsto em lei, ter critérios objetivos publicados e permitir recurso com acesso ao resultado. Se faltar algum desses pontos, a eliminação pode ser anulada."],
    ["Fui reprovado no teste físico (TAF) por pouco. Adianta recorrer?", "Depende de como o teste foi aplicado e das regras do edital. Falhas objetivas podem ser contestadas. O STF garante remarcação para candidata grávida na data do teste, mesmo sem previsão editalícia. Para outras circunstâncias pessoais, em regra não há segunda chamada sem previsão no edital."],
    ["Me eliminaram no exame médico por uma condição que não me impede de trabalhar. E agora?", "A eliminação precisa ter relação real com as atribuições do cargo. Laudos que mostrem a sua capacidade para a função podem fundamentar o pedido."],
    ["Qual o prazo para reagir?", "Recorra no prazo do edital. Quando couber mandado de segurança, o prazo é de 120 dias da ciência do ato impugnado. Confira a data da publicação ou da notificação e guarde o comprovante."],
  ],
  "pad-prazo": [
    ["Recebi notificação de PAD. Sou obrigado a me defender?", "Depende da fase do processo e do estatuto aplicável. Guarde a notificação, confira o termo de indiciação e a data da citação."],
    ["Preciso de advogado no PAD?", "A lei não obriga, mas a defesa técnica faz diferença, principalmente em casos que podem levar a demissão ou suspensão longa."],
    ["Posso ser afastado durante o processo?", "Pode haver afastamento preventivo, em regra sem prejuízo da remuneração, quando o servidor puder influir na apuração."],
    ["Qual o prazo para a defesa escrita?", "No PAD federal, a defesa escrita é apresentada, em regra, em dez dias da citação após a indiciação. Com dois ou mais indiciados, o prazo comum é de 20 dias. Há hipóteses com contagem ou prazo específicos. Em outros entes, confira o estatuto e a notificação."],
  ],
  "direitos-servidor": [
    ["Quais direitos costumam ser negados ao servidor?", "Progressões e promoções atrasadas, adicionais (insalubridade, noturno), licenças, abono de permanência, reajustes previstos em lei e conversão de licença-prêmio não gozada em dinheiro na aposentadoria, entre outros."],
    ["Até quando posso cobrar valores atrasados?", "Nas prestações sucessivas, sem negativa do próprio direito, a prescrição alcança, em regra, as parcelas anteriores aos cinco anos do ajuizamento. Se houve negativa expressa ou ato único, pode estar prescrito o próprio direito. Confira as datas e o ato contestado."],
    ["Preciso pedir primeiro na administração?", "Nem sempre, mas o pedido administrativo ajuda a documentar e às vezes resolve sem processo. Guarde o protocolo."],
    ["Que documentos separar?", "Ficha funcional, contracheques, portarias, legislação do plano de carreira e o pedido administrativo com a resposta."],
  ],
  "multa-transito": [
    ["Recebi uma multa. Qual o primeiro passo?", "Confira a notificação de autuação: ela abre prazo para a defesa prévia e para indicar o condutor, se não era você dirigindo. Esse prazo não pode passar."],
    ["Quantas chances tenho de recorrer?", "Em regra, é possível apresentar defesa prévia e, após a imposição da penalidade, recorrer à JARI e à segunda instância competente. A segunda instância varia conforme o órgão autuador. Confira o destinatário e o prazo de cada notificação."],
    ["Vou ter a CNH suspensa. Ainda posso dirigir?", "Enquanto o processo de suspensão não terminar e a penalidade não for aplicada, a CNH continua válida. Depois de aplicada, é preciso cumprir a suspensão e fazer o curso de reciclagem."],
    ["Recorrer adianta mesmo?", "Muitas multas são anuladas por falhas formais (prazo de notificação, dados errados, equipamento sem aferição). Vale analisar antes de pagar."],
  ],
  "responsabilidade-estado": [
    ["O poder público me causou um prejuízo. Preciso provar culpa?", "Em regra, não. O Estado responde pelos danos causados por seus agentes independentemente de culpa (responsabilidade objetiva). Basta provar o dano e a ligação com a atuação do poder público."],
    ["Que tipos de casos dão indenização?", "Buracos e falta de sinalização em vias, queda de árvore, erro em hospital público, prisão indevida, danos causados por viaturas, entre outros."],
    ["Qual o prazo para pedir?", "Em regra, 5 anos a partir do dano. Mas reúna as provas logo: fotos, boletim de ocorrência, orçamentos, laudos e testemunhas."],
    ["Como o Estado paga?", "Depois da condenação final, por requisição de pequeno valor (RPV) ou precatório, conforme o valor."],
  ],
  "pad-prescricao": [
    ["A infração disciplinar pode prescrever?", "Sim. Os estatutos fixam prazos para a Administração punir, que variam conforme a penalidade. No âmbito federal, por exemplo, são 5 anos para demissão, 2 para suspensão e 180 dias para advertência."],
    ["Quando começa a contar o prazo?", "No regime federal, o prazo começa quando a autoridade competente toma conhecimento do fato. O primeiro ato válido de instauração de sindicância punitiva ou PAD interrompe a contagem, que volta a correr integralmente após 140 dias, conforme a Súmula 635 do STJ."],
    ["Como sei se o meu caso prescreveu?", "É preciso olhar as datas: do fato, do conhecimento pela Administração, da abertura do processo e da duração. A advogada faz essa conta com os documentos."],
  ],
  "licitacao-recurso": [
    ["Qual o prazo para recorrer na licitação?", "Na Lei 14.133/2021, o prazo recursal é de três dias úteis da intimação ou da lavratura da ata. No julgamento de propostas e na habilitação ou inabilitação, a intenção de recorrer deve ser manifestada imediatamente. Confira a fase recursal indicada no edital."],
    ["Posso impugnar o edital?", "Qualquer pessoa pode impugnar o edital ou pedir esclarecimentos até três dias úteis antes da abertura do certame, nos termos do art. 164 da Lei 14.133/2021."],
    ["Fui desclassificado por detalhe formal. Pode?", "A falha meramente formal que não comprometa a compreensão da proposta ou a aferição da qualificação pode ser saneada. Na habilitação, a diligência segue os limites legais e pode esclarecer condição preexistente. Confira a decisão, o edital e os arts. 12, III, e 64 da Lei 14.133/2021."],
  ],
  "orgao-nao-paga": [
    ["O órgão não paga o que deve à minha empresa. O que faço?", "Primeiro, reúna o contrato, as notas fiscais, os atestes de recebimento e as cobranças feitas. Depois, faça um pedido formal de pagamento com prazo. Se não resolver, cabe cobrança judicial."],
    ["Posso parar de prestar o serviço?", "Na Lei 14.133/2021, atraso superior a dois meses, contado da emissão da nota fiscal, pode dar direito à extinção ou à opção pela suspensão até a normalização, observadas as exceções legais. Confira o regime do contrato e formalize a opção antes de interromper a execução."],
    ["Tenho direito a juros e correção?", "Sim, os atrasos geram correção monetária e juros, conforme o contrato e a lei."],
  ],
  "heteroidentificacao": [
    ["Fui eliminado pela banca de heteroidentificação. Posso recorrer?", "Pode. A banca deve avaliar as características fenotípicas da pessoa, com critérios claros, decisão fundamentada e direito a recurso. Decisões sem motivação ou contraditórias podem ser anuladas."],
    ["Que provas ajudam?", "Reúna a decisão e sua motivação, a gravação quando disponível, o edital e os registros da etapa. Para cotas de pessoas pretas e pardas em concursos federais, a confirmação se baseia no fenótipo no momento do procedimento. Decisões anteriores não vinculam automaticamente a banca atual."],
    ["Perco a vaga na ampla concorrência também?", "Nos concursos federais sujeitos à Lei 15.142/2025, o indeferimento da confirmação pode permitir que a pessoa siga na ampla concorrência, se tiver pontuação suficiente para as fases anteriores. Fraude ou má-fé apuradas em procedimento próprio podem levar à eliminação. Confira o edital e a lei aplicável."],
  ],
  "tribunal-contas": [
    ["Fui citado pelo Tribunal de Contas. O que isso significa?", "Significa que o Tribunal identificou possível irregularidade em contas, contratos ou recursos públicos e quer ouvir a sua defesa antes de decidir."],
    ["Qual o prazo para me defender?", "Use o prazo da citação e confira o regimento do Tribunal de Contas. A contagem e a possibilidade de prorrogação variam conforme o órgão e a fase. A falta de defesa pode levar ao prosseguimento do processo sem sua manifestação."],
    ["Posso ser condenado mesmo sem ter recebido dinheiro?", "Pode haver responsabilização por atos de gestão, mesmo sem enriquecimento. A defesa deve mostrar a regularidade dos atos, a boa-fé e os documentos de cada decisão."],
  ],
  "improbidade": [
    ["O que mudou na lei de improbidade?", "Desde 2021 (Lei 14.230), é preciso provar dolo, ou seja, a intenção de cometer a irregularidade. Erros sem intenção não configuram improbidade."],
    ["O processo antigo é afetado pela mudança?", "Em parte. O STF decidiu (Tema 1.199) que a exigência de dolo vale para processos ainda não encerrados, mas há regras específicas sobre prescrição. Cada caso deve ser analisado."],
    ["Posso ter bens bloqueados?", "Pode, mas a lei atual exige demonstração de risco concreto e limita o bloqueio. Há meios de contestar."],
  ],
  "desapropriacao": [
    ["O poder público pode tomar meu imóvel?", "Pode desapropriar por utilidade pública ou interesse social, mas tem que pagar indenização justa, prévia e em dinheiro (salvo exceções previstas na Constituição)."],
    ["Não concordo com o valor oferecido. E agora?", "Você pode discutir o valor na Justiça, com perícia. O juiz define a indenização, que pode ser maior do que a oferta."],
    ["E se ocuparam meu imóvel sem processo?", "É a chamada desapropriação indireta. Cabe ação para exigir a indenização. Reúna escritura, matrícula, fotos e documentos da ocupação."],
  ],
  "lai": [
    ["Qualquer pessoa pode pedir informação ao órgão público?", "Sim. Pela Lei de Acesso à Informação (Lei 12.527/2011), qualquer pessoa pode pedir, sem precisar explicar o motivo."],
    ["Qual o prazo para responder?", "Até 20 dias, prorrogáveis por mais 10, com justificativa."],
    ["E se negarem?", "Cabe recurso à autoridade superior em 10 dias, e depois a outras instâncias (como a CGU, no âmbito federal). A negativa precisa ser fundamentada."],
  ],
  "auto-infracao": [
    ["Minha empresa recebeu um auto de infração. Preciso pagar já?", "Confira o auto, a norma do órgão e a fase do procedimento. A defesa administrativa pode ter efeito suspensivo se previsto no regime aplicável. Registre a data da ciência, peça acesso aos autos e confirme o vencimento antes de tomar uma decisão sobre o pagamento."],
    ["O alvará foi negado. Posso recorrer?", "Sim. A negativa deve ser fundamentada, e cabe recurso administrativo. Muitas vezes é possível corrigir pendências e pedir de novo."],
    ["Quando vale a pena ir à Justiça?", "Quando há ilegalidade clara, risco de fechamento ou multa desproporcional. Há também a possibilidade de pedir decisão urgente."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "defeito": [
    ["Qual o prazo para reclamar de um produto com defeito?", "30 dias para produtos não duráveis (alimentos, por exemplo) e 90 dias para duráveis (eletrodomésticos, roupas, celulares). Se o defeito for oculto, o prazo começa quando ele aparece."],
    ["A loja diz que eu tenho que falar com o fabricante. É verdade?", "Não. A loja e o fabricante respondem juntos. Você pode reclamar com qualquer um deles."],
    ["Mandei para o conserto e não resolveram. E agora?", "Em regra, se o fornecedor não sanar o vício em até 30 dias, você pode escolher troca, devolução corrigida do preço ou abatimento proporcional. Em hipóteses legais, como produto essencial, essas opções podem ser exigidas de imediato."],
    ["Preciso guardar a nota fiscal?", "Sim, e também protocolos de atendimento, ordens de serviço e conversas. São as suas provas."],
  ],
  "troca-devolucao": [
    ["A loja é obrigada a trocar se não gostei da cor ou do tamanho?", "Na loja física, não é obrigação legal — mas, se a loja prometeu a troca (etiqueta, cartaz, vendedor), ela tem que cumprir. Compras pela internet seguem outra regra: o direito de arrependimento de 7 dias."],
    ["E se o produto tiver defeito?", "Reclame em até 30 dias para produto não durável ou 90 dias para durável. Em regra, o fornecedor tem 30 dias para sanar o vício. Se não resolver, você escolhe troca, devolução corrigida ou abatimento. Em situações legais, como produto essencial, pode exigir uma dessas alternativas de imediato."],
    ["Posso trocar presente sem nota?", "Depende da política da loja. Sem defeito, a troca de presente é uma cortesia que, se oferecida, deve ser respeitada."],
  ],
  "arrependimento": [
    ["Comprei pela internet e me arrependi. Posso devolver?", "Sim. Nas contratações fora do estabelecimento, o CDC prevê sete dias da assinatura ou do recebimento do produto ou serviço, conforme o caso. Formalize a desistência e guarde o protocolo."],
    ["Tenho que pagar o frete de volta?", "Não. A devolução deve ser sem custo para você, e o valor pago (inclusive o frete) precisa ser devolvido."],
    ["E se eu já abri o produto?", "O direito continua. Basta que o produto seja devolvido em condições normais de quem só experimentou."],
  ],
  "compra-nao-entregue": [
    ["Comprei pela internet e não chegou. O que posso exigir?", "Você pode escolher: exigir a entrega, aceitar outro produto equivalente ou cancelar a compra com devolução integral do valor, corrigido."],
    ["A loja sumiu. Perdi meu dinheiro?", "Se pagou com cartão, peça o estorno (chargeback) ao banco. Se foi Pix ou boleto, registre reclamação e boletim de ocorrência. Marketplaces também podem responder pela venda."],
    ["Onde reclamar antes de ir à Justiça?", "No consumidor.gov.br ou no Procon. Guarde prints do anúncio, do pedido e das conversas."],
  ],
  "voo": [
    ["Meu voo atrasou. A companhia tem que me dar o quê?", "A partir de 1 hora de atraso: comunicação (internet, telefone). A partir de 2 horas: alimentação. A partir de 4 horas: hospedagem, se precisar pernoitar, e opções de reacomodação ou reembolso (Resolução ANAC 400)."],
    ["Cabe indenização por danos morais?", "Depende das circunstâncias e das consequências demonstradas. Guarde os comprovantes da assistência oferecida, das despesas e dos compromissos afetados. A tramitação de ações sobre caso fortuito ou força maior pode ser afetada pela suspensão vinculada ao Tema 1.417 do STF."],
    ["Minha bagagem foi extraviada. E agora?", "Registre o RIB no aeroporto antes de sair. A companhia tem 7 dias (voo nacional) ou 21 dias (internacional) para devolver. Guarde notas do que precisou comprar."],
    ["Qual o prazo para entrar com ação?", "Para voos nacionais, em regra 5 anos. Para internacionais, aplica-se o prazo de 2 anos da Convenção de Montreal. Não deixe para depois."],
  ],
  "telefonia": [
    ["A operadora cobra serviço que não pedi. O que faço?", "Reclame na operadora (anote o protocolo). Se não resolver, registre na Anatel (app ou site) ou no consumidor.gov.br. Valores pagos indevidamente podem ser devolvidos em dobro."],
    ["Quero cancelar e não deixam. Pode?", "Você pode cancelar pelos canais da operadora e deve receber comprovante do pedido. Com atendente, os efeitos são imediatos. No autoatendimento, confira o prazo de processamento previsto no regulamento e guarde o protocolo."],
    ["A internet não entrega a velocidade contratada. Tenho direito?", "Compare o serviço prestado com a oferta contratada e guarde medições feitas em condições adequadas, com datas e horários. Reclame na operadora e peça correção. O abatimento ou a rescisão sem multa depende da falha demonstrada e das condições aplicáveis."],
  ],
  "cobranca-dobro": [
    ["Paguei uma cobrança indevida. Recebo em dobro?", "Em muitos casos, sim. O Código de Defesa do Consumidor (art. 42) garante a devolução em dobro do que foi pago indevidamente, salvo engano justificável da empresa."],
    ["Preciso provar que a empresa agiu de má-fé?", "Não necessariamente. O STJ entende que basta a cobrança contrariar a boa-fé, sem precisar provar a intenção. A análise é feita caso a caso."],
    ["E se eu só fui cobrado, mas não paguei?", "Aí não há devolução em dobro, mas a cobrança indevida pode ser cancelada e, se houver negativação ou constrangimento, gerar indenização."],
  ],
  "ligacoes-cobranca": [
    ["Recebo dezenas de ligações de cobrança por dia. Isso é permitido?", "Não. A cobrança não pode expor ao ridículo nem constranger. Ligações excessivas, em horários inadequados ou para familiares e trabalho podem gerar indenização."],
    ["Como paro as ligações de telemarketing?", "O Não Me Perturbe permite bloquear ofertas abrangidas pelo cadastro, como telemarketing de telecomunicações e de crédito consignado das instituições participantes. Para outras ofertas, verifique canais próprios da empresa e do Procon. Cobrança de dívida segue regras distintas."],
    ["O que devo guardar como prova?", "Prints do histórico de chamadas com datas e horários, gravações (você pode gravar as próprias ligações) e mensagens."],
  ],
  "contas-essenciais": [
    ["Estou devendo a conta de luz. Podem cortar?", "A distribuidora deve avisar com antecedência e, em regra, não pode cortar após 90 dias do vencimento da fatura. A regulação prevê exceção quando impedimento justificável suspende a contagem. Dívidas de recuperação de consumo por fraude têm condições próprias."],
    ["Posso parcelar a dívida?", "Sim, as distribuidoras oferecem parcelamento. Peça as condições por escrito e confira se não há cobranças indevidas embutidas."],
    ["Tem alguém doente em casa que depende de aparelho. Muda algo?", "Sim. Há regras especiais de proteção quando há pessoa que depende de equipamento elétrico para sobreviver. Avise a distribuidora com laudo médico."],
  ],
  "falta-energia": [
    ["Faltou luz e queimou um aparelho. Tenho direito a ressarcimento?", "Sim, se o dano foi causado por oscilação ou falha na rede. Peça o ressarcimento à distribuidora em até 5 anos, informando os aparelhos danificados."],
    ["Como faço o pedido?", "Pelo site, app ou telefone da distribuidora. Ela tem prazo para fazer a vistoria e responder. Não conserte nem descarte o aparelho antes da vistoria."],
    ["A falta de energia durou muito tempo. Recebo alguma compensação?", "As distribuidoras pagam compensações automáticas na conta quando ultrapassam os limites de duração e frequência de interrupções definidos pela ANEEL. Confira na fatura."],
  ],
  "conta-alta": [
    ["Minha conta veio muito acima do normal. O que faço?", "Peça a revisão da fatura e a verificação do medidor à distribuidora, com protocolo. Compare com o histórico de consumo dos meses anteriores."],
    ["Tenho que pagar enquanto contestam?", "O ideal é pedir que a cobrança seja suspensa até a análise. Se pagar e a cobrança for indevida, pode pedir devolução em dobro."],
    ["Não resolveram. E agora?", "Reclame na ouvidoria da distribuidora e depois na ANEEL (ou na agência reguladora de água do seu estado). Se continuar, cabe ação."],
  ],
  "fraude-medidor": [
    ["Me acusaram de fraude no medidor. Tenho que pagar?", "Não automaticamente. A distribuidora precisa seguir um procedimento: termo de ocorrência, perícia técnica com possibilidade de acompanhamento e cálculo correto. Sem isso, a cobrança pode ser anulada."],
    ["Podem cortar minha luz por causa disso?", "No Tema 699, o STJ admite corte por recuperação de consumo decorrente de fraude atribuída ao consumidor, apurada com contraditório e ampla defesa, mediante aviso. Para o corte, a cobrança deve se limitar ao consumo recuperado dos 90 dias anteriores à constatação e a suspensão deve ocorrer em até 90 dias do vencimento."],
    ["Assinei um termo sem entender. Ainda dá para contestar?", "Sim. O termo assinado não impede a discussão, principalmente se não houve perícia ou o cálculo é abusivo."],
  ],
  "cancelamento-curso": [
    ["Quero desistir do curso. Tenho que pagar o curso inteiro?", "Não. Multas que obrigam a pagar todas as parcelas restantes costumam ser abusivas. Em regra, cabe uma multa razoável e o pagamento proporcional ao que foi usado."],
    ["Já paguei adiantado. Recebo de volta?", "Sim, a parte não utilizada, descontada uma multa razoável prevista no contrato."],
    ["Como faço o cancelamento?", "Por escrito (e-mail ou protocolo), guardando o comprovante. A data desse pedido é importante para o cálculo."],
  ],
  "corte-luz-agua": [
    ["A concessionária pode cortar minha luz ou água?", "Na energia, o corte por inadimplemento exige aviso e deve seguir os limites da ANEEL. No abastecimento de água, confira a lei, a regulação local e as proteções aplicáveis. Se a dívida pertencer a outra pessoa, peça a revisão da cobrança e documente a titularidade."],
    ["Cortaram sem aviso. O que faço?", "Peça a religação imediata, com protocolo. O corte irregular pode gerar indenização. Em casos graves, é possível pedir decisão urgente."],
    ["Em quanto tempo têm que religar depois que eu pagar?", "Na energia, o prazo é de 24 horas na área urbana (ou menos, em religação de urgência paga). Para água, o prazo depende da agência reguladora do estado."],
  ],
  "academia-curso": [
    ["Posso cancelar a academia antes do fim do plano?", "Pode. A multa deve ser proporcional e razoável. Cobrar todas as mensalidades restantes costuma ser abusivo."],
    ["E a faculdade?", "O cancelamento deve ser aceito, e a cobrança se limita ao período cursado e a uma multa razoável, se prevista. Não podem reter documentos por causa de dívida."],
    ["O que fazer se insistirem na cobrança?", "Reclame no consumidor.gov.br ou no Procon. Se houver negativação indevida, pode caber indenização."],
  ],
  "seguro-negado": [
    ["A seguradora negou o pagamento. Ela tem que explicar?", "Sim. A recusa deve ser por escrito e fundamentada em cláusula clara do contrato. Peça a negativa formal e a cópia da apólice."],
    ["Doença preexistente: podem negar?", "A análise depende da lei aplicável e da proposta, inclusive das perguntas feitas pela seguradora, dos exames solicitados e da prova de eventual omissão de má-fé. Peça a justificativa específica e a documentação usada na recusa."],
    ["Qual o prazo para cobrar?", "Quando se aplica a Lei 15.040/2024, o segurado tem um ano da ciência da recusa expressa e motivada para exigir a prestação. Para beneficiários e terceiros prejudicados, a lei prevê três anos a partir da ciência do fato gerador. A data do contrato, o sinistro e eventual pedido de reconsideração podem afetar a análise."],
  ],
  "imovel-planta": [
    ["A construtora atrasou a entrega. Tenho direito a quê?", "Nos contratos sujeitos ao art. 43-A da Lei 4.591/1964, pode haver tolerância de até 180 dias corridos se expressamente pactuada de forma clara e destacada. Superado o prazo, conforme a hipótese legal e sem culpa do comprador, ele pode resolver o contrato e pedir devolução integral, ou manter o contrato e cobrar a indenização por atraso aplicável."],
    ["Quero desistir da compra. Recebo o que paguei?", "Se o comprador der causa ao desfazimento, a Lei 4.591/1964 prevê dedução da corretagem e cláusula penal de até 25% do valor pago ou, no patrimônio de afetação, de até 50%, além de outras deduções cabíveis. Se o desfazimento decorrer de atraso imputável à incorporadora, confira as regras de restituição integral. Data e tipo de contrato importam."],
    ["Preciso continuar pagando enquanto discuto?", "Não pare de pagar sem orientação: isso pode piorar a sua situação. A estratégia depende do caso."],
  ],
  "juros-abusivos": [
    ["Como sei se os juros do meu contrato são abusivos?", "Compare a taxa com a média do Banco Central para o mesmo tipo de operação e a época da contratação. A média é referência, e a diferença, isoladamente, não prova abusividade. Confira também o custo efetivo, as tarifas e as circunstâncias do contrato."],
    ["Posso parar de pagar enquanto discuto?", "Não é recomendado. O correto é pedir a revisão e, se for o caso, depositar o valor considerado devido, com orientação."],
    ["O que preciso para analisar?", "O contrato, o extrato com as parcelas pagas e a data da contratação."],
  ],
  "conta-invadida": [
    ["Meu celular foi roubado. O que faço primeiro?", "Bloqueie a linha com a operadora, peça o bloqueio do aparelho pelo IMEI, avise todos os bancos para bloquear apps e cartões e registre boletim de ocorrência."],
    ["Fizeram transferências da minha conta. O banco devolve?", "Depende das circunstâncias. Se houve falha de segurança do banco ou transações muito fora do seu padrão, ele pode ser responsabilizado. Reclame imediatamente e peça o MED, se foi Pix."],
    ["Usaram minha conta de WhatsApp para pedir dinheiro. E agora?", "Avise seus contatos por outro canal e siga o processo oficial de recuperação do WhatsApp. Ao recuperar o acesso, revise os aparelhos conectados e ative a confirmação em duas etapas. Se alguém transferiu dinheiro a golpistas, oriente essa pessoa a avisar o banco imediatamente."],
  ],
  "tarifas-venda-casada": [
    ["O banco incluiu seguro no empréstimo sem eu pedir. Pode?", "Não. Condicionar o empréstimo à contratação de seguro ou outro produto é venda casada, proibida pelo Código de Defesa do Consumidor. Você pode pedir o cancelamento e a devolução."],
    ["Quais tarifas o banco não pode cobrar?", "Há serviços essenciais gratuitos (como um número mínimo de saques e transferências por mês na conta básica). Tarifas não contratadas ou não informadas também são indevidas."],
    ["Recebo de volta?", "Sim, os valores cobrados indevidamente, em alguns casos em dobro."],
  ],
  "turismo": [
    ["O pacote de viagem deu errado. Quem responde: agência ou hotel?", "Depende do serviço contratado e da participação de cada fornecedor. Em um pacote, a agência ou operadora pode responder por falhas na prestação incluída na oferta. Se a empresa só intermediou uma reserva, a responsabilidade depende da falha e do seu papel na contratação."],
    ["A viagem foi cancelada. Tenho direito ao dinheiro de volta?", "Sim, ou à remarcação, à sua escolha, conforme o caso. Guarde o contrato e as comunicações."],
    ["O hotel não era como anunciado. Posso pedir indenização?", "Sim, se houve diferença relevante em relação ao que foi oferecido. Fotos, prints do anúncio e reclamações no local são as melhores provas."],
  ],
  "vazamento-dados": [
    ["Meus dados vazaram. Tenho direito a indenização?", "Depende. O STJ entende que o vazamento, sozinho, nem sempre gera indenização: é preciso mostrar prejuízo ou risco concreto. Dados sensíveis (saúde, por exemplo) recebem proteção maior."],
    ["O que posso exigir da empresa?", "Peça informações sobre os dados afetados, a natureza do incidente e as medidas adotadas. Você também pode exercer os direitos previstos na LGPD. Correção ou eliminação dependem dos requisitos legais, inclusive das hipóteses em que os dados precisam ser conservados."],
    ["Como me proteger depois do vazamento?", "Troque senhas, ative verificação em duas etapas e acompanhe seu CPF no Registrato e em serviços de proteção de crédito."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "inventario-cartorio": [
    ["Quando posso fazer o inventário em cartório?", "O inventário extrajudicial pressupõe consenso e assistência de advogado. Com menor ou incapaz, exige que seu quinhão ou meação recaia em parte ideal de cada bem e haja manifestação favorável do Ministério Público. Havendo testamento, é preciso cumprir os requisitos específicos do CNJ, inclusive autorização expressa do juízo sucessório quando exigida pela norma."],
    ["Preciso de advogado?", "Sim, a lei exige a presença de advogado no inventário em cartório, que pode ser um só para todos os herdeiros."],
    ["Tem prazo para abrir o inventário?", "O prazo legal é de 2 meses a partir do falecimento. O atraso pode gerar multa no imposto (ITCMD), conforme a lei de cada estado."],
    ["Quanto custa?", "Há o imposto (ITCMD, com alíquota definida pelo estado), os emolumentos do cartório (tabela estadual) e os honorários. A advogada faz uma estimativa com os bens."],
  ],
  "divorcio-cartorio": [
    ["Posso me divorciar em cartório?", "Sim, se o divórcio for consensual e houver assistência de advogado. Quando houver filhos comuns menores ou incapazes, é preciso demonstrar que guarda, convivência e alimentos já foram resolvidos judicialmente, conforme a Resolução 35 do CNJ."],
    ["Precisa de advogado?", "Sim, a escritura exige advogado, que pode ser comum ao casal ou um para cada."],
    ["Quanto tempo leva?", "Com documentos em ordem e acordo sobre a partilha, costuma ser rápido: às vezes, poucos dias."],
    ["E se não houver acordo?", "Aí o divórcio precisa ser feito na Justiça. Ainda assim, ninguém pode ser obrigado a continuar casado: o divórcio é um direito."],
  ],
  "uniao-estavel": [
    ["Preciso registrar a união estável?", "Não é obrigatório, mas formalizar em cartório facilita provar a união para pensão, plano de saúde, herança e financiamentos."],
    ["Qual o regime de bens?", "Se não houver contrato escrito, vale a comunhão parcial: o que for adquirido durante a união, em regra, é dos dois."],
    ["Como desfazer a união estável?", "Com acordo, pode ser por escritura em cartório, com advogado. Sem acordo, na Justiça."],
  ],
  "usucapiao": [
    ["Moro há anos num imóvel sem documento. Posso pedir usucapião?", "Pode, se a posse preencher os requisitos da modalidade aplicável. Os prazos variam e há hipótese de dois anos na usucapião familiar, com condições próprias. Bens públicos não podem ser adquiridos por usucapião."],
    ["Dá para fazer em cartório?", "Sim. O pedido é apresentado ao Registro de Imóveis com advogado, ata notarial e demais documentos exigidos pelo art. 216-A da Lei 6.015/1973. Impugnação justificada pode levar o caso à Justiça. O registrador pode rejeitar oposição injustificada, sujeita ao procedimento cabível."],
    ["Que provas preciso?", "Contas no seu nome no endereço, IPTU, recibos, fotos antigas, declarações de vizinhos e qualquer documento que mostre o tempo de posse."],
  ],
  "adjudicacao": [
    ["Paguei tudo e o vendedor não passa a escritura. O que faço?", "Você pode exigir a escritura e, se ele não cumprir, pedir a adjudicação compulsória — na Justiça ou, desde 2022, também em cartório."],
    ["O vendedor faleceu ou sumiu. E agora?", "Ainda é possível, com os documentos da compra e a quitação. A falta do vendedor não impede a regularização."],
    ["Que documentos preciso?", "Na via extrajudicial, confira o art. 216-B da Lei de Registros Públicos e as normas do CNJ. A documentação inclui o contrato, prova do inadimplemento da obrigação de outorgar o título após notificação, ata notarial, certidões pertinentes, comprovante do ITBI e procuração específica, conforme a etapa do procedimento."],
  ],
  "alvara-valores": [
    ["Como sacar FGTS e PIS de quem faleceu?", "Os dependentes habilitados no INSS (certidão de dependentes) podem sacar diretamente na Caixa. Sem dependentes, os herdeiros precisam de alvará judicial ou escritura de inventário."],
    ["E o dinheiro no banco?", "A Lei 6.858/1980 prevê hipóteses de liberação sem inventário. Para saldos bancários, poupança e fundos, há condições próprias, inclusive ausência de outros bens sujeitos a inventário e limite legal. Verifique se o caso comporta alvará ou deve integrar o inventário."],
    ["Quanto tempo leva o alvará?", "O prazo depende do juízo, da documentação e da eventual necessidade de ouvir interessados. A certidão de dependentes e a prova da titularidade dos valores ajudam a instruir o pedido."],
  ],
  "protesto": [
    ["Meu nome foi protestado. Como cancelo?", "Se o título já foi protestado, o pagamento ao credor deve ser acompanhado do documento hábil para o cancelamento, como a anuência quando o original não puder ser apresentado. Solicite o cancelamento ao tabelionato e confira os emolumentos aplicáveis."],
    ["O protesto é indevido. E agora?", "Se o título não corresponde a dívida exigível, reúna a certidão do protesto, comprovantes e comunicações. Peça a baixa ao credor e, se necessário, avalie sustação ou cancelamento judicial. O pagamento posterior de uma dívida legítima, por si só, não torna indevido o protesto original."],
    ["O protesto prescreve?", "O protesto em si não some sozinho, mas a dívida pode prescrever. A análise depende do tipo de título e das datas."],
  ],
  "reurb": [
    ["O que é a Reurb?", "É a regularização fundiária urbana (Lei 13.465/2017), que permite regularizar núcleos informais e entregar o título de propriedade aos moradores."],
    ["Quem pode pedir?", "Os próprios moradores, associações, o município e outros legitimados. Na Reurb de interesse social, para população de baixa renda, os custos são menores ou gratuitos."],
    ["Como começar?", "Procure a prefeitura para saber se a área já tem processo de Reurb. Se não tiver, a organização dos moradores ajuda a pedir."],
  ],
  "certidao-matricula": [
    ["Para que serve a certidão de matrícula?", "A certidão identifica o titular registral, descreve o imóvel e informa ônus, constrições e outras ocorrências lançadas na matrícula. Para comprar, complemente com as verificações fiscais, condominiais e urbanísticas pertinentes ao negócio."],
    ["Como tiro a certidão?", "No Cartório de Registro de Imóveis da região ou pela internet, no site do Registro de Imóveis do Brasil (registradores.onr.org.br)."],
    ["A certidão tem validade?", "Para negócios, costuma-se exigir certidão recente (em geral, de até 30 dias)."],
  ],
  "mudar-nome": [
    ["Posso mudar meu nome direto no cartório?", "Sim. Desde 2022 (Lei 14.382), maiores de 18 anos podem mudar o prenome uma vez, no cartório, sem precisar explicar o motivo nem ir à Justiça."],
    ["E o sobrenome?", "A lei admite inclusão de sobrenome familiar, inclusão ou exclusão de sobrenome do cônjuge durante o casamento e exclusão do sobrenome do ex-cônjuge após a dissolução, entre outras hipóteses legais. Apresente certidões que comprovem a situação."],
    ["Pessoas trans podem alterar nome e gênero em cartório?", "Sim, diretamente no cartório, sem cirurgia e sem laudo, conforme decisão do STF e norma do CNJ."],
  ],
  "testamento": [
    ["Posso deixar meus bens para quem eu quiser?", "Em parte. Se você tem herdeiros necessários (filhos, pais, cônjuge), metade dos bens é reservada a eles. A outra metade pode ser deixada livremente."],
    ["Qual tipo de testamento é mais seguro?", "O testamento público é lavrado em cartório de notas e lido perante duas testemunhas. A escolha entre as modalidades depende do conteúdo, das formalidades e dos objetivos de quem testa. Qualquer modalidade pode ser impugnada se houver vício."],
    ["Posso mudar o testamento depois?", "Sim. O testamento pode ser revogado total ou parcialmente por outro testamento válido. A compatibilidade entre disposições antigas e novas deve ser conferida."],
  ],
  "planejamento-sucessorio": [
    ["O que é planejamento sucessório?", "É organizar, em vida, como os bens serão transmitidos, para evitar conflitos, reduzir custos e dar segurança à família."],
    ["Doação com usufruto vale a pena?", "Pode valer: os bens passam aos herdeiros, mas você continua usando e recebendo os rendimentos. Há imposto na doação (ITCMD), e a vantagem depende do caso e do estado."],
    ["Holding familiar é para mim?", "Costuma ser útil para patrimônios maiores, com imóveis de aluguel ou empresas. Para patrimônios menores, testamento e doação podem bastar."],
  ],
  "ata-notarial": [
    ["Prints de WhatsApp valem como prova?", "Podem ser apresentados como prova. A ata notarial documenta com fé pública o que o tabelião observou, sem comprovar, por si só, a autoria ou a veracidade de todas as mensagens. Preserve a conversa completa e o arquivo original."],
    ["Como funciona a ata notarial?", "Você leva o celular ou indica o site ao tabelião, que registra o que vê, com data e hora. O documento sai em cartório de notas."],
    ["Quanto custa?", "Depende da tabela do estado e da quantidade de páginas. Vale para provas importantes."],
  ],
  "itcmd": [
    ["O que é o ITCMD?", "É o imposto estadual cobrado sobre heranças e doações. Cada estado define a alíquota (até 8%)."],
    ["Quem paga?", "Na herança, o contribuinte costuma ser o herdeiro ou legatário. Na doação, verifique a legislação do estado competente e as hipóteses de responsabilidade. A localização dos bens e o domicílio das partes podem afetar a análise."],
    ["Tem isenção?", "Alguns estados isentam valores pequenos ou certos bens. A advogada verifica a lei do seu estado."],
  ],
  "compra-imovel": [
    ["O que conferir antes de comprar um imóvel?", "Certidão de matrícula atualizada, certidões do vendedor (ações, dívidas, protestos), IPTU e condomínio em dia, e se a construção está regular na prefeitura."],
    ["Contrato de gaveta tem valor?", "Um instrumento particular pode produzir obrigações entre as partes. A propriedade se transfere com o registro do título hábil. A escritura pública é exigida nas hipóteses legais, com exceções como determinados contratos de financiamento imobiliário."],
    ["Quais custos além do preço?", "ITBI (imposto municipal), escritura e registro. Em financiamento, a escritura pode ser substituída pelo contrato do banco."],
  ],
  "socioafetiva": [
    ["Posso reconhecer como filho quem eu criei?", "O CNJ prevê reconhecimento extrajudicial para pessoa acima de 12 anos, a pedido de maior de 18 anos que seja pelo menos 16 anos mais velho. É preciso comprovar vínculo estável e socialmente demonstrável. Para menor de 18 anos, colhem-se seu consentimento e a anuência dos pais registrais. O registro exige parecer favorável do Ministério Público."],
    ["O filho fica com dois pais ou duas mães?", "Sim, é possível a coexistência da filiação biológica e socioafetiva. O cartório pode incluir apenas um ascendente socioafetivo. Para incluir mais de um, a via é judicial."],
    ["Quais os efeitos?", "Os mesmos de qualquer filiação: nome, herança, pensão alimentícia e direitos previdenciários."],
  ],
  "regime-bens": [
    ["Posso mudar o regime de bens do casamento?", "Pode, com pedido conjunto e justificado, e sem prejudicar terceiros (como credores)."],
    ["É feito em cartório?", "Para casamento, o Código Civil exige autorização judicial em pedido motivado de ambos os cônjuges, resguardados os direitos de terceiros. A alteração do regime da união estável tem disciplina própria."],
    ["O que muda para os bens que já tenho?", "Em regra, a mudança vale para frente, e os bens anteriores seguem o regime antigo, salvo acordo diferente aprovado."],
  ],
  "apostila": [
    ["O que é apostila de Haia?", "É um selo que valida documentos brasileiros para uso em outros países que fazem parte da Convenção da Apostila."],
    ["Onde faço?", "Em cartórios autorizados, apresentando o documento original."],
    ["Preciso de tradução?", "Muitas vezes, sim. A tradução juramentada é feita antes ou depois da apostila, conforme a exigência do país de destino."],
  ],
  "inventario-negativo": [
    ["Preciso fazer inventário se não há bens?", "O inventário negativo é facultativo e pode documentar a inexistência de bens, por exemplo, para afastar dúvidas sobre a sucessão ou comprovar situação relevante a um novo casamento. Ele não extingue dívidas por si só."],
    ["Pode ser em cartório?", "Sim, com acordo dos herdeiros e advogado."],
  ],
  "cessao-hereditaria": [
    ["Posso vender minha parte na herança?", "Sim. A cessão de direitos hereditários exige escritura pública. Na cessão onerosa a terceiro, os demais coerdeiros têm direito de preferência nas mesmas condições. A cessão de bem específico ainda indiviso exige análise própria."],
    ["Posso renunciar à herança?", "Pode, por escritura pública ou termo no processo. A renúncia é total e não pode ser desfeita, e a sua parte vai para os outros herdeiros."],
    ["Renunciar me livra das dívidas do falecido?", "As dívidas do falecido são pagas com os bens da herança, nunca além do valor herdado. Renunciar não é necessário só por causa disso."],
  ],
  "heranca-digital": [
    ["O que acontece com as redes sociais de quem morreu?", "Depende das regras de cada plataforma: muitas permitem transformar a conta em memorial ou excluí-la a pedido da família."],
    ["E criptomoedas e saldos em apps?", "Entram no inventário, como qualquer bem. O problema prático é o acesso às senhas: por isso, planejar em vida é importante."],
    ["Como evitar que se percam?", "Deixe orientações em testamento ou em documento guardado com segurança, sem expor senhas diretamente."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "carencia-urgencia": [
    ["Quais são os prazos de carência?", "Os limites legais são 24 horas para urgência e emergência, 300 dias para parto a termo e 180 dias para os demais casos. O contrato pode prever prazos menores. Cobertura parcial temporária por doença ou lesão preexistente segue regras próprias."],
    ["Estou em carência e tive uma emergência. O plano tem que atender?", "A carência máxima para urgência e emergência é de 24 horas. O atendimento também deve ser analisado conforme a segmentação contratada e a situação clínica. Guarde a indicação médica e a justificativa formal de eventual recusa."],
    ["Doença preexistente tem carência diferente?", "A cobertura parcial temporária pode, por até 24 meses, suspender a cobertura de procedimentos de alta complexidade, leitos de alta tecnologia e cirurgias relacionados exclusivamente à doença ou lesão preexistente declarada. A análise de urgência ou emergência depende também da segmentação e da regulação aplicável."],
  ],
  "sus-remedio": [
    ["Como conseguir remédio pelo SUS?", "Com a receita, procure a farmácia da unidade básica ou a farmácia de alto custo do estado. Se o remédio não estiver disponível, peça a negativa por escrito."],
    ["O remédio não está na lista do SUS. E agora?", "Comece pelo pedido administrativo e guarde a negativa. Para medicamento registrado na Anvisa e não incorporado, o fornecimento judicial é excepcional e depende do conjunto de requisitos dos Temas 6 e 1.234 do STF. Veja também a situação sobre medicamentos de alto custo."],
    ["Quanto tempo leva?", "Com urgência demonstrada, a liminar pode sair em poucos dias. A entrega depois depende do cumprimento pelo poder público."],
  ],
  "bariatrica": [
    ["O plano tem que cobrir a bariátrica?", "Sim, quando há indicação médica e os critérios da ANS são atendidos (como determinados índices de IMC e doenças associadas)."],
    ["E a cirurgia plástica depois do emagrecimento?", "As cirurgias reparadoras indicadas após a bariátrica (como retirada de excesso de pele) têm sido reconhecidas como parte do tratamento, e não como estéticas. O STJ já decidiu nesse sentido."],
    ["O que o relatório médico precisa ter?", "Histórico de tratamentos, IMC, doenças associadas e, para a reparadora, os problemas causados pelo excesso de pele (infecções, dores, limitações)."],
  ],
  "oncologico": [
    ["O plano tem que cobrir o tratamento do câncer?", "Sim. Quimioterapia, radioterapia, cirurgias e diversos medicamentos, inclusive orais em uso domiciliar previstos pela ANS, têm cobertura obrigatória."],
    ["O plano negou um medicamento novo. Pode?", "No SUS, o primeiro tratamento deve iniciar em até 60 dias a partir do diagnóstico firmado em laudo patológico, ou antes se houver necessidade terapêutica registrada. No plano privado, verifique os prazos da ANS e a urgência clínica indicada."],
    ["Tenho prazo para começar o tratamento?", "A lei garante que o paciente do SUS inicie o tratamento em até 60 dias após o diagnóstico. No plano, valem os prazos da ANS e a urgência indicada pelo médico."],
  ],
  "reembolso": [
    ["Quando o plano tem que reembolsar consulta particular?", "Pode haver reembolso por livre escolha, segundo o contrato. A lei também prevê reembolso em urgência ou emergência quando não for possível usar a rede, nos limites legais e contratuais. Se a operadora descumprir a garantia de atendimento, pode ser devido reembolso integral conforme a ANS."],
    ["Qual valor recebo de volta?", "Em contratos com livre escolha, o valor da tabela do plano. Quando o plano falhou em oferecer atendimento, o reembolso deve ser integral."],
    ["Quanto tempo o plano tem para pagar?", "Em geral, até 30 dias após a entrega dos documentos. Guarde notas fiscais e recibos detalhados."],
  ],
  "erro-medico": [
    ["Como sei se foi erro médico?", "Nem todo resultado ruim é erro. O erro acontece quando o profissional age com imprudência, negligência ou imperícia. Normalmente é preciso uma análise técnica (perícia)."],
    ["Quem responde: o médico ou o hospital?", "Podem responder o hospital, a clínica, o plano e o próprio médico, conforme o caso. O hospital responde pelos serviços que presta."],
    ["Quais provas reunir?", "Prontuário médico completo (é seu direito pedir cópia), exames, receitas, fotos e relatórios de outros médicos."],
    ["Qual o prazo para entrar com ação?", "O prazo depende da rota e do pedido. No transporte aéreo internacional, a Convenção de Montreal prevê dois anos para as pretensões abrangidas por ela, como danos materiais. O STF afastou sua aplicação aos danos extrapatrimoniais. Confira separadamente cada pedido e a data do voo."],
  ],
  "home-care": [
    ["O plano é obrigado a cobrir home care?", "Quando há indicação médica de internação domiciliar em substituição à hospitalar, os tribunais entendem que o plano não pode negar, mesmo que o contrato exclua."],
    ["O que entra no home care?", "Depende da prescrição: enfermagem, fisioterapia, equipamentos, medicamentos e materiais. O relatório médico deve detalhar."],
    ["O plano quer reduzir as horas de enfermagem. Pode?", "Peça a fundamentação clínica, o plano de cuidados atualizado e a indicação de como o atendimento seguirá. Uma redução que contrarie a necessidade clínica demonstrada pode ser contestada."],
  ],
  "cancelamento-plano": [
    ["O plano pode me cancelar durante um tratamento?", "Nos planos individuais ou familiares, a rescisão unilateral obedece às hipóteses legais e é vedada durante internação do titular. No coletivo, o Tema 1.082 do STJ exige continuidade dos cuidados de quem está internado ou em tratamento indispensável à sobrevivência ou incolumidade física até a alta, se o titular pagar integralmente a contraprestação."],
    ["Atrasei a mensalidade. Já podem cancelar?", "Confira o tipo de plano, quem paga diretamente à operadora e quais mensalidades seguem em aberto. Quando se aplica a RN 593 da ANS, exigem-se pelo menos duas mensalidades não pagas em 12 meses e notificação com oportunidade de regularização. Nos individuais ou familiares, confira também os requisitos do art. 13 da Lei 9.656/1998."],
    ["O plano coletivo foi cancelado pela empresa. Fico sem nada?", "Podem existir opções: portabilidade sem carência ou contratação de plano individual. E quem está em tratamento pode pedir a manutenção."],
  ],
  "saude-mental": [
    ["O plano cobre internação psiquiátrica?", "Nos planos com cobertura hospitalar, a internação psiquiátrica indicada tem cobertura sem limite de tempo. O STJ admite coparticipação contratual informada de até 50% das despesas para internação superior a 30 dias por ano, observadas as condições do Tema 1.032."],
    ["E tratamento para dependência química?", "Também tem cobertura, incluindo internação quando indicada pelo médico."],
    ["E psicoterapia?", "As sessões de psicoterapia previstas no rol da ANS têm cobertura, e para vários transtornos não há limite de sessões quando há indicação."],
  ],
  "liminar-descumprida": [
    ["Ganhei a liminar e o plano não cumpre. O que faço?", "Avise a advogada imediatamente. É possível pedir ao juiz multa diária, aumento da multa, bloqueio de valores para custear o tratamento e outras medidas."],
    ["O governo não cumpre a decisão. Pode bloquear dinheiro?", "Sim. Quando o poder público descumpre decisão sobre saúde, o juiz pode determinar o bloqueio de verbas públicas para garantir o tratamento."],
    ["O que levo para mostrar o descumprimento?", "Reúna a decisão, a prova de intimação e de que o prazo venceu, além de protocolos, negativas, mensagens e datas. Se a condição clínica mudou, junte relatório atualizado."],
  ],
  "opme-protese": [
    ["O plano pode negar a prótese da cirurgia?", "Se a cirurgia tem cobertura, as próteses, órteses e materiais ligados ao ato cirúrgico também têm."],
    ["O plano quer trocar a marca que o médico pediu. Pode?", "Pode haver divergência, que deve ser resolvida por junta médica, nos termos da ANS. O plano não pode simplesmente impor um material inferior."],
    ["Quem escolhe o material?", "O médico indica as características técnicas, e o plano deve oferecer opções que atendam."],
  ],
  "fertilizacao": [
    ["O plano é obrigado a cobrir fertilização in vitro?", "Em regra, não. O STJ decidiu que a fertilização in vitro não tem cobertura obrigatória, salvo previsão no contrato."],
    ["Há exceções?", "A Justiça tem admitido em casos específicos, como preservação de fertilidade antes de tratamento de câncer. Cada caso deve ser avaliado."],
    ["E o tratamento da infertilidade?", "Procedimentos de diagnóstico e tratamento de causas da infertilidade previstos no rol (como algumas cirurgias) têm cobertura."],
  ],
  "portabilidade": [
    ["Posso trocar de plano sem cumprir carência de novo?", "Sim, pela portabilidade de carências, desde que cumpridos os requisitos da ANS: estar em dia, ter permanência mínima no plano atual e escolher plano compatível."],
    ["Como saber os planos compatíveis?", "Pelo Guia ANS de Planos de Saúde, no site da ANS."],
    ["E se eu estiver em tratamento?", "Estar em tratamento, por si só, não impede a portabilidade. Confira a cobertura, a rede disponível e se haverá carência para coberturas novas. Planeje a troca para evitar interrupção do atendimento."],
  ],
  "uti-sus": [
    ["Não há vaga de UTI pelo SUS. O que fazer?", "É uma situação de urgência. Com o relatório médico indicando a necessidade de UTI, é possível pedir à Justiça (inclusive no plantão) que o poder público providencie a vaga, até em hospital particular, às custas do Estado."],
    ["Quanto tempo demora?", "O tempo depende da situação clínica, da regulação e da análise judicial, se houver pedido urgente. Peça à unidade o número do protocolo na regulação e relatório que indique a necessidade de UTI e o risco da espera."],
    ["Quem pode pedir?", "Os próprios moradores, associações, o município e outros legitimados. Na Reurb de interesse social, para população de baixa renda, os custos são menores ou gratuitos."],
  ],
  "odontologico": [
    ["O plano odontológico pode negar tratamento?", "Deve cobrir os procedimentos do rol da ANS para a segmentação contratada. Negativas devem ser por escrito e fundamentadas."],
    ["O dentista errou no tratamento. Tenho direito a quê?", "Ao refazimento, ao reembolso do que pagou e, conforme o caso, a indenização. Reúna o prontuário, radiografias e orçamentos de correção."],
    ["Quanto tempo tenho para reclamar?", "Para vício do serviço, o CDC prevê, em regra, prazo de 30 dias para serviços não duráveis e 90 dias para duráveis. Em vício oculto, a contagem começa quando o defeito se evidencia. Para indenização por dano decorrente de fato do serviço, o prazo do CDC é de cinco anos da ciência do dano e da autoria."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "pcd-grau": [
    ["Quem decide se minha deficiência é leve, moderada ou grave?", "O INSS, numa avaliação feita por perito médico e assistente social, que medem como a deficiência limita o seu dia a dia e o trabalho."],
    ["Posso contestar o grau?", "Sim, por recurso administrativo ou na Justiça, com laudos e relatórios que mostrem as limitações reais."],
    ["O grau muda o tempo de contribuição exigido?", "Na aposentadoria por tempo de contribuição da pessoa com deficiência, a gradação muda o mínimo exigido. Na aposentadoria por idade, a idade é de 55 anos para mulheres e 60 para homens, com pelo menos 15 anos de contribuição e deficiência durante igual período, independentemente do grau."],
  ],
  "pontos-2026": [
    ["Quantos pontos preciso em 2026?", "Em 2026, a transição por pontos exige 93 pontos e 30 anos de contribuição para mulheres, ou pontos e 35 anos para homens. Somam-se idade e tempo de contribuição. A exigência sobe um ponto por ano até os limites de 100 e 105, respectivamente."],
    ["Essa regra serve para mim?", "Só para quem já contribuía antes de 13/11/2019. A advogada compara com as outras regras de transição para ver a mais vantajosa."],
    ["Frações de ano contam?", "Sim, meses de idade e de contribuição entram na conta."],
  ],
  "calculo-valor": [
    ["Como é calculado o valor da aposentadoria hoje?", "Em regra, faz-se a média de todos os salários de contribuição desde julho de 1994. Sobre essa média, aplica-se 60% mais 2% por ano de contribuição que passar de 15 anos (mulheres) ou 20 anos (homens), com exceções."],
    ["Por que meu valor ficou tão baixo?", "Salários baixos no início da carreira, períodos faltando no CNIS ou aplicação da regra errada costumam reduzir o valor. Vale conferir o cálculo e o CNIS."],
    ["Posso pedir revisão?", "Em regra, a revisão do ato de concessão está sujeita a dez anos, a contar do primeiro dia do mês seguinte ao recebimento da primeira prestação. Confira a natureza do pedido, eventual decisão administrativa revisional e a prescrição das parcelas."],
  ],
  "recurso-prazo": [
    ["Qual o prazo para recorrer de decisão do INSS?", "30 dias contados da ciência da decisão, pelo Meu INSS."],
    ["Perdi o prazo. E agora?", "Você ainda pode fazer um novo pedido ou ir à Justiça. A advogada avalia o melhor caminho para não perder valores atrasados."],
    ["Preciso de advogado para recorrer?", "O recurso administrativo pode ser apresentado pelo próprio interessado ou por representante. Identifique o motivo do indeferimento e relacione os documentos a cada ponto contestado."],
  ],
  "especial-ppp": [
    ["O que é aposentadoria especial?", "É a aposentadoria de quem trabalhou exposto a agentes nocivos à saúde (ruído, produtos químicos, agentes biológicos, entre outros), com tempo de contribuição menor."],
    ["O que é o PPP e como consigo?", "O PPP registra as condições de trabalho e a exposição a agentes nocivos. Para os períodos abrangidos pelo PPP eletrônico, consulte o Meu INSS. Para períodos anteriores, peça o documento à empresa. Se a empresa fechou, verifique documentos substitutivos e formas de provar a exposição."],
    ["Usar EPI tira o direito?", "Nem sempre. Para ruído, o STF decidiu que o EPI não afasta o direito. Para outros agentes, depende da eficácia comprovada."],
  ],
  "salario-maternidade": [
    ["Quem tem direito ao salário-maternidade?", "Seguradas do INSS que têm filho, adotam ou obtêm guarda para adoção: empregadas, domésticas, contribuintes individuais, MEI, facultativas e seguradas especiais (rurais). Em alguns casos, também homens (adoção ou falecimento da mãe)."],
    ["Por quanto tempo?", "Em regra, são 120 dias. Se a internação da mãe ou do recém-nascido superar duas semanas por complicações ligadas ao parto, a Lei 15.222/2025 prevê o pagamento durante a internação e a extensão por até 120 dias após a alta, descontado o período recebido antes do parto."],
    ["Preciso ter contribuído quanto tempo?", "O salário-maternidade do RGPS está dispensado de carência após o julgamento do STF e a regulamentação do INSS. É preciso comprovar a qualidade de segurada ou de segurado no fato gerador, conforme a categoria."],
    ["Estou desempregada. Tenho direito?", "Pode ter, se ainda estiver no período de graça (mantendo a qualidade de segurada)."],
  ],
  "ir-doenca-grave": [
    ["Aposentado com doença grave paga Imposto de Renda?", "Não sobre os proventos de aposentadoria, pensão ou reforma, se a doença estiver na lista da lei (câncer, cardiopatia grave, Parkinson, entre outras)."],
    ["Preciso de laudo oficial?", "Para pedir na fonte pagadora, em regra sim (laudo de serviço médico oficial). Na Justiça, outros laudos médicos são aceitos."],
    ["Recebo o que já paguei?", "Sim, em regra os valores dos últimos 5 anos, desde que a doença já existisse no período."],
    ["E se a doença estiver controlada?", "O STJ entende que a isenção continua mesmo sem sintomas atuais, por exemplo, após o tratamento do câncer."],
  ],
  "pericia-inss": [
    ["Como me preparar para a perícia?", "Leve documento com foto, relatórios médicos recentes e detalhados (com CID, tratamento e limitações), exames e receitas. Organize tudo por data."],
    ["O que dizer ao perito?", "Explique com sinceridade como a doença afeta o seu trabalho e o dia a dia, sem exagerar nem minimizar."],
    ["O perito me deu poucos minutos. Isso é normal?", "A duração, por si só, não define se a avaliação foi adequada. Consulte o resultado e identifique qual requisito não foi reconhecido. Se houver inconsistência, junte documentação pertinente e avalie recurso ou revisão judicial."],
  ],
  "servidor-aposentadoria": [
    ["As regras do servidor são iguais às do INSS?", "O servidor efetivo pode estar vinculado ao RPPS do seu ente, se houver. Caso o ente não tenha RPPS, a vinculação é ao RGPS. Mesmo entre regimes próprios, os requisitos e as transições podem variar."],
    ["Tenho direito a integralidade e paridade?", "Depende da data de ingresso no serviço público e da regra de transição. Quem entrou antes de 2004 pode ter direito, conforme as condições."],
    ["Posso contar o tempo de INSS no serviço público?", "Sim, por meio da Certidão de Tempo de Contribuição (CTC), emitida pelo INSS."],
  ],
  "periodo-graca": [
    ["Parei de contribuir. Ainda sou segurado?", "Em regra, a qualidade permanece por até 12 meses após cessar a atividade remunerada, com possíveis extensões de 12 meses por mais de 120 contribuições sem perda da qualidade e de outros 12 por desemprego comprovado. Para contribuinte facultativo, a regra geral é de seis meses. Confira também o mês exato em que ocorre a perda da qualidade."],
    ["Para que serve isso?", "Durante o período de graça, você e seus dependentes mantêm a proteção do INSS, como auxílio por incapacidade e pensão por morte."],
    ["Perdi a qualidade de segurado. Perdi tudo?", "Não. O tempo já contribuído continua contando para a aposentadoria. Para outros benefícios, é preciso voltar a contribuir."],
  ],
  "auxilio-acidente": [
    ["Quem tem direito ao auxílio-acidente?", "O segurado empregado, doméstico, trabalhador avulso ou segurado especial que ficou com sequela permanente que reduz a capacidade para o trabalho, depois de um acidente de qualquer natureza."],
    ["Posso trabalhar e receber ao mesmo tempo?", "Sim. É uma indenização mensal de 50% do salário de benefício, paga junto com o salário, até a aposentadoria."],
    ["Precisa de carência?", "Não. Mas é preciso comprovar a sequela e a redução da capacidade, geralmente por perícia."],
  ],
  "rural": [
    ["Como funciona a aposentadoria rural?", "O trabalhador rural (segurado especial) se aposenta por idade aos 55 anos (mulheres) ou 60 (homens), comprovando atividade rural pelo tempo exigido, mesmo sem ter contribuído mensalmente."],
    ["O que é a aposentadoria híbrida?", "Para quem trabalhou parte no campo e parte na cidade: soma-se o tempo rural ao urbano, com as idades da regra urbana."],
    ["Como provar o trabalho rural?", "Junte os documentos sobre a atividade, como contratos rurais, notas de produtor, cadastros e certidões. Para segurado especial, confira a autodeclaração e as bases oficiais utilizadas pelo INSS. Na Justiça, testemunhas podem complementar a prova documental."],
  ],
  "conversao-especial": [
    ["Posso converter tempo especial em comum?", "Sim, mas só para o tempo trabalhado até 13/11/2019. Depois da Reforma, a conversão não é mais permitida."],
    ["Quanto o tempo aumenta?", "Para atividades de 25 anos, o tempo especial é multiplicado por 1,4 (homens) ou 1,2 (mulheres)."],
    ["Preciso do PPP?", "Sim, ou outros documentos que provem a exposição aos agentes nocivos."],
  ],
  "auxilio-reclusao": [
    ["Quem tem direito ao auxílio-reclusão?", "Podem ter direito os dependentes de segurado de baixa renda recolhido em regime fechado, atendidos os requisitos legais. Para o enquadramento após a reforma de 2019, confira a média dos salários de contribuição dos 12 meses anteriores ao recolhimento e o limite vigente naquela data."],
    ["Precisa de tempo de contribuição?", "Desde 2019, exige-se carência de 24 contribuições do segurado."],
    ["O benefício continua se o preso mudar de regime?", "Não. Ele é pago só enquanto durar o regime fechado."],
  ],
  "vida-toda": [
    ["Ainda dá para pedir a revisão da vida toda?", "O entendimento atual do STF veda a opção pela regra definitiva para substituir a regra de transição do art. 3º da Lei 9.876/1999. A chamada revisão da vida toda não pode ser concedida com esse fundamento."],
    ["Entrei com a ação antes. O que acontece?", "O STF modulou os efeitos no Tema 1.102, com regras sobre preservação de valores pagos por decisões proferidas até 5 de abril de 2024 e sobre custas, honorários e perícias contábeis em ações pendentes naquela data. Confira o que foi decidido no seu processo e os marcos aplicáveis."],
    ["Existe outra revisão que eu possa pedir?", "Pode haver, dependendo do seu benefício: erros de cálculo, períodos não considerados, tempo especial. Vale uma análise do processo de concessão."],
  ],
  "adicional-25": [
    ["Quem tem direito ao acréscimo de 25%?", "O aposentado por incapacidade permanente (invalidez) que precisa da ajuda permanente de outra pessoa para atividades do dia a dia."],
    ["Aposentados por idade ou tempo também têm direito?", "Não. O STF decidiu que o acréscimo vale só para a aposentadoria por incapacidade permanente."],
    ["Como pedir?", "Pelo Meu INSS, com relatório médico que mostre a necessidade de assistência permanente. Haverá perícia."],
  ],
  "complementacao": [
    ["Contribuo como MEI. Isso conta para aposentadoria?", "A contribuição reduzida pode contar para aposentadoria por idade e outros benefícios, conforme os requisitos. Para usar esse período em aposentadoria por tempo de contribuição, nas transições que a exigem, ou em contagem recíproca, em regra é necessário complementar a contribuição. O valor do benefício depende de todo o histórico contributivo."],
    ["Como complementar?", "Pagando a diferença de alíquota (para chegar a 20%) por guia específica, inclusive de períodos anteriores, com juros."],
    ["Vale a pena complementar?", "Depende do seu objetivo e do tempo que falta. A simulação mostra se compensa."],
  ],
  "tempo-militar": [
    ["Tempo de serviço militar conta para aposentadoria?", "Sim. O tempo de serviço militar obrigatório conta como tempo de contribuição, com certidão das Forças Armadas."],
    ["E aluno-aprendiz?", "Pode contar, se houve remuneração (inclusive indireta, como alimentação e alojamento) à conta do orçamento público. A certidão da escola é a prova principal."],
    ["Como incluir esses períodos?", "Com as certidões, você pede a averbação no INSS, de preferência antes de pedir a aposentadoria."],
  ],
});
