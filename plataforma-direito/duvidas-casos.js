// Dúvidas concretas de quem está em cada situação, em linguagem simples.
// Informação geral: a resposta para o caso de cada pessoa depende dos documentos e é dada pela advogada.
// Chave = id do roteiro (roteiros.js). Cada item: [pergunta, resposta].
const DUVIDAS_CASOS = {
  "indeferido": [
    ["O INSS negou. Posso pedir de novo do zero?", "Sim. Você pode fazer um novo pedido a qualquer momento, de preferência juntando o que faltou da primeira vez. Mas atenção: se você recorrer ou for à Justiça com base no pedido antigo, os valores atrasados podem ser contados desde a data desse primeiro pedido. Por isso vale avaliar antes qual caminho é melhor."],
    ["Recorrer no INSS ou ir direto à Justiça: qual é melhor?", "Depende do motivo da negativa. Quando faltou documento ou houve erro simples, o recurso no próprio INSS pode resolver. Quando a discussão é técnica (perícia, tempo especial, qualidade de segurado), muitas vezes a Justiça é o caminho mais eficiente. Você não precisa recorrer no INSS antes de ir à Justiça: basta ter feito o pedido e recebido a negativa."],
    ["Recorrer custa alguma coisa?", "O recurso no INSS é gratuito e feito pelo Meu INSS. Na Justiça Federal, em causas de menor valor, o processo corre no Juizado Especial, sem custas no primeiro grau. Os honorários da advogada são combinados à parte, por escrito."],
    ["Se eu ganhar, recebo os meses que fiquei sem o benefício?", "Em regra, sim: os valores atrasados são calculados desde a data em que o direito deveria ter sido reconhecido, respeitado o limite dos últimos 5 anos. Na Justiça, esses atrasados são pagos por requisição (RPV ou precatório), depois do fim do processo."],
    ["Fui negado na perícia, mas continuo sem conseguir trabalhar. O que faço?", "Reúna relatórios médicos recentes e detalhados (com o CID, o tratamento e, principalmente, as limitações para o seu trabalho). Com isso, é possível recorrer, pedir de novo ou ir à Justiça, onde a perícia é feita por um médico nomeado pelo juiz."],
    ["Quanto tempo demora?", "No recurso do INSS, a análise costuma levar alguns meses. Na Justiça, depende muito da vara e de haver perícia. A advogada consegue dar uma ideia melhor olhando o seu caso e a sua cidade."],
  ],
  "idade-minima": [
    ["Com que idade eu me aposento hoje?", "Pela regra geral criada pela Reforma da Previdência (EC 103/2019), a aposentadoria por idade exige 62 anos para mulheres e 65 para homens, com tempo mínimo de contribuição. Quem já contribuía antes de novembro de 2019 pode ter direito a regras de transição mais vantajosas — vale simular as opções."],
    ["Já trabalhava antes da Reforma. Muda alguma coisa para mim?", "Pode mudar bastante. Existem regras de transição (por pontos, idade progressiva, pedágio) pensadas para quem já contribuía. Uma delas pode permitir se aposentar antes ou com valor maior. A comparação depende do seu histórico no CNIS."],
    ["Trabalhei no campo. A idade é a mesma?", "Não. Para o trabalhador rural, a idade é menor: 55 anos para mulheres e 60 para homens, com comprovação da atividade rural. A prova costuma ser feita com documentos da época (bloco de produtor, contratos, certidões) e testemunhas."],
    ["Tem períodos que trabalhei e não aparecem no INSS. E agora?", "É comum. Períodos sem registro no CNIS podem ser incluídos com documentos: carteira de trabalho, contracheques, recibos, declarações da empresa. Corrigir o CNIS antes de pedir evita negativa e pode aumentar o valor."],
    ["Posso pagar o INSS por conta própria para completar o tempo?", "Sim, como contribuinte facultativo ou individual, conforme o seu caso. Antes de pagar, vale conferir quanto falta e qual plano de contribuição compensa, para não pagar a mais ou de forma que não conte para o que você precisa."],
    ["Vale a pena esperar para me aposentar com um valor maior?", "Às vezes, sim. Em algumas regras, cada ano a mais de contribuição aumenta o percentual do benefício. A simulação das regras com os seus dados mostra se compensa pedir agora ou esperar."],
  ],
  "descontos-beneficio": [
    ["Como sei que desconto é esse?", "Veja o extrato de pagamento no Meu INSS (ou no app) e confira o nome de cada desconto. Os mais comuns são mensalidades de associações e sindicatos, empréstimos consignados e cartões de crédito consignado."],
    ["Como paro o desconto?", "Mensalidades de associação podem ser bloqueadas pelo Meu INSS ou pelo telefone 135. Empréstimo ou cartão que você não contratou deve ser contestado no banco e, se não resolver, na Justiça. Guarde os protocolos de tudo."],
    ["Consigo o dinheiro de volta?", "Se o desconto não foi autorizado por você, a devolução pode ser pedida. Dependendo do caso, pode ser em dobro e com indenização por danos morais. A advogada avalia os valores com base no seu extrato."],
    ["Eu assinei alguma coisa sem entender. Ainda posso reclamar?", "Pode. Contratos feitos sem informação clara, por telefone sem confirmação ou aproveitando a falta de conhecimento da pessoa podem ser questionados. Separe tudo o que você recebeu (contratos, mensagens, comprovantes)."],
    ["O banco me ligou oferecendo solução. Devo aceitar?", "Cuidado com golpes. Não passe senhas nem códigos, não faça Pix e não assine nada por indicação de quem ligou. Bancos e o INSS não pedem dados por telefone. Na dúvida, fale com a advogada antes."],
  ],
  "pcd-quem": [
    ["Preciso ter uma doença específica para ter direito?", "Não. O que conta é a limitação de longo prazo (física, mental, intelectual ou sensorial) que, junto com as barreiras do dia a dia, dificulta a sua participação em igualdade com as outras pessoas. O grau é definido na avaliação do INSS, não pelo nome da doença."],
    ["Como é a avaliação do INSS?", "É feita por um perito médico e por um assistente social, que avaliam como a deficiência afeta a sua vida e o seu trabalho. Leve relatórios que descrevam as limitações concretas (locomoção, comunicação, cuidados pessoais), e não só o diagnóstico."],
    ["Tenho que parar de trabalhar para me aposentar?", "Não. A aposentadoria da pessoa com deficiência considera o tempo de contribuição nessa condição, e você pode continuar trabalhando até se aposentar."],
    ["A deficiência começou depois que eu já trabalhava. Conta?", "Conta. Os períodos com e sem deficiência são convertidos de forma proporcional. Por isso é importante provar desde quando a deficiência existe."],
    ["E se o INSS classificar meu grau como leve, mas eu discordar?", "O grau pode ser contestado por recurso ou na Justiça, com laudos e outras provas. O grau muda o tempo exigido, então vale a pena discutir quando há elementos."],
  ],
  "bpc-renda": [
    ["Quem tem direito ao BPC/LOAS?", "Pessoas com 65 anos ou mais e pessoas com deficiência de qualquer idade, de família de baixa renda, que não tenham como se manter. Não é preciso ter contribuído para o INSS."],
    ["Qual é o limite de renda da família?", "A regra geral é renda por pessoa da família de até 1/4 do salário mínimo. Mas a Justiça e a própria lei admitem analisar a situação real: gastos com remédios, tratamento e cuidados podem ser considerados, e há casos aceitos com renda um pouco maior."],
    ["Preciso estar no CadÚnico?", "Sim. A inscrição no Cadastro Único, atualizada, é obrigatória. Faça ou atualize no CRAS da sua cidade antes de pedir, com os dados de todos que moram na casa."],
    ["O BPC paga 13º e deixa pensão?", "Não. O BPC não tem 13º salário e não gera pensão por morte para a família. Por isso, quando a pessoa tem algum tempo de contribuição, vale verificar se não há direito a uma aposentadoria, que é mais vantajosa."],
    ["Quem recebe BPC pode trabalhar?", "A pessoa com deficiência que começa a trabalhar com carteira assinada pode ter o BPC suspenso e, conforme as regras, receber o auxílio-inclusão. Antes de aceitar um emprego, vale entender o que acontece com o benefício."],
    ["O BPC foi negado por causa da renda. E agora?", "Confira se a renda foi calculada certo (quem mora na casa, o que entra de verdade) e reúna comprovantes de gastos com saúde e cuidados. Com isso, é possível recorrer ou ir à Justiça, onde costuma haver estudo social da família."],
  ],
  "pensao-duracao": [
    ["Quem tem direito à pensão por morte?", "Os dependentes de quem era segurado do INSS (ou já aposentado): cônjuge ou companheiro(a), filhos menores de 21 anos ou com deficiência, e, na falta deles, pais ou irmãos que dependiam financeiramente."],
    ["Vivíamos juntos, mas não éramos casados. Tenho direito?", "Sim, a união estável dá direito, mas precisa ser provada: contas no mesmo endereço, conta conjunta, filhos em comum, plano de saúde como dependente, fotos e testemunhas. Quanto mais documentos, melhor."],
    ["A pensão é para sempre?", "Depende. Para o cônjuge ou companheiro(a), a duração varia conforme a idade de quem recebe e o tempo de casamento ou união e de contribuição. Em muitos casos é vitalícia; em outros, dura alguns anos. A regra exata depende dos seus dados."],
    ["Posso receber pensão e minha aposentadoria juntas?", "Pode, mas desde a Reforma de 2019 há uma redução no valor do benefício menor, calculada por faixas. Ainda assim, costuma compensar receber os dois."],
    ["Qual o prazo para pedir?", "Se o pedido for feito logo (em geral até 90 dias do falecimento, para a maioria dos dependentes), a pensão é paga desde a data da morte. Depois disso, é paga só a partir do pedido. Por isso, não deixe para depois."],
  ],
};

Object.assign(DUVIDAS_CASOS, {
  "plano-negou": [
    ["O plano pode negar se o procedimento não está no rol da ANS?", "Nem sempre. Desde 2022, a lei (Lei 14.454/2022) permite a cobertura de tratamentos fora do rol quando há comprovação de eficácia ou recomendação técnica, entre outros critérios. Cada caso precisa ser analisado com o relatório do médico."],
    ["O plano tem que me dar a negativa por escrito?", "Sim. Você pode pedir a negativa por escrito, com o motivo, e o plano deve fornecer. Anote também o número de protocolo de cada ligação. Esses documentos são essenciais para reclamar na ANS ou na Justiça."],
    ["É urgente. Dá para resolver rápido?", "Quando há risco à saúde, é possível pedir ao juiz uma decisão urgente (liminar), que costuma ser analisada em poucos dias. Para isso, o relatório médico precisa explicar a urgência e o risco de esperar."],
    ["Reclamar na ANS adianta?", "Muitas vezes, sim. A reclamação na ANS (pelo site ou telefone 0800 701 9656) abre uma mediação com o plano, que tem prazo para responder. Pode resolver sem processo — e o protocolo ainda serve de prova."],
    ["E se eu pagar do meu bolso para não esperar?", "Guarde todas as notas e recibos. Se a negativa for considerada indevida, é possível pedir o reembolso, além de indenização em alguns casos."],
    ["O que o relatório do médico precisa dizer?", "O diagnóstico (CID), o tratamento indicado, por que ele é necessário no seu caso, se há alternativa e qual o risco de não fazer ou de atrasar. Quanto mais detalhado, mais forte o pedido."],
  ],
  "prazo-atendimento": [
    ["Existe prazo máximo para o plano marcar consulta?", "Sim. A ANS fixa prazos máximos de atendimento (por exemplo, consultas básicas e exames simples têm prazos de poucos dias úteis). Se o plano não cumprir, ele deve oferecer outro prestador ou reembolsar."],
    ["Não tem médico disponível na rede. O que faço?", "Peça ao plano, por escrito ou com protocolo, a indicação de um profissional dentro do prazo. Se não houver, você pode ser atendido fora da rede e pedir reembolso, conforme as regras da ANS."],
    ["Adianta reclamar na ANS?", "Sim. A reclamação abre uma notificação ao plano, que precisa resolver em prazo curto. Guarde o número do protocolo."],
    ["É urgência ou emergência. Tem carência?", "Em urgência e emergência, a carência máxima é de 24 horas após a contratação. Depois disso, o plano deve atender."],
  ],
  "liminar-medicamento": [
    ["O SUS tem que me dar um remédio que não está na lista?", "Pode ter, mas há requisitos definidos pelos tribunais superiores: comprovação de que o remédio é necessário, de que os da lista não servem para o seu caso, de que você não pode pagar e de que o remédio tem registro na Anvisa, entre outros. O relatório médico é a peça principal."],
    ["E o plano de saúde, tem que fornecer remédio?", "Depende do tipo de remédio e de como ele é usado. Medicamentos de uso em internação ou alguns tratamentos (como certos quimioterápicos orais) costumam ter cobertura. Remédios de uso domiciliar em geral não, salvo exceções."],
    ["Quanto tempo demora uma liminar?", "Quando há urgência bem demonstrada, o juiz costuma decidir em poucos dias. O cumprimento pode demorar um pouco mais, e a advogada acompanha e cobra."],
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
    ["Fui demitido(a). Posso continuar no plano da empresa?", "Se você contribuía com parte da mensalidade e foi demitido sem justa causa, pode manter o plano por um período, assumindo o pagamento integral. O prazo depende de quanto tempo você contribuiu."],
    ["E se eu me aposentei?", "O aposentado que contribuiu para o plano também pode continuar, assumindo o valor integral. Com 10 anos ou mais de contribuição, pode ficar por tempo indeterminado; com menos, por um período proporcional."],
    ["Preciso avisar até quando?", "Há um prazo curto para manifestar o interesse depois do desligamento. Não deixe passar: peça a manutenção por escrito assim que receber a comunicação da empresa."],
    ["A empresa pagava tudo. Tenho esse direito?", "Em regra, não: o direito é de quem contribuía com parte da mensalidade. Mas vale conferir o contracheque, porque às vezes havia desconto."],
  ],
  "superendividamento": [
    ["O que é superendividamento?", "É quando a pessoa, de boa-fé, não consegue pagar as dívidas de consumo sem comprometer o mínimo para viver (moradia, alimentação, saúde). A lei (Lei 14.181/2021) criou um caminho para renegociar tudo junto."],
    ["Como funciona a renegociação?", "É feito um plano de pagamento com todos os credores ao mesmo tempo, em audiência de conciliação, preservando o mínimo existencial. Se algum credor não aceitar, o juiz pode definir um plano obrigatório."],
    ["Todas as dívidas entram?", "As dívidas de consumo, sim (cartão, empréstimo, cheque especial, contas). Algumas ficam de fora, como financiamento imobiliário com garantia, dívidas de crédito rural e as contraídas com má-fé."],
    ["Vou ficar com o nome sujo?", "A renegociação busca justamente organizar a situação. Durante o plano, as condições são definidas para você conseguir pagar. A advogada orienta sobre o efeito nos cadastros em cada caso."],
    ["O banco desconta quase todo o meu salário. Pode?", "Há limites para descontos em folha (margem consignável) e a Justiça pode limitar descontos que comprometam o seu sustento. Separe os contracheques e os extratos."],
  ],
  "consignado-nao-contratado": [
    ["Apareceu um empréstimo que eu não fiz. O que faço primeiro?", "Registre reclamação no banco (anote o protocolo), faça boletim de ocorrência e, se for aposentado, bloqueie o benefício para novos empréstimos no Meu INSS. Não gaste o dinheiro que caiu na conta: ele pode ter que ser devolvido."],
    ["O dinheiro caiu na minha conta. Posso usar?", "Não use. Se o contrato não foi feito por você, o ideal é devolver ou deixar o valor separado, para mostrar boa-fé. A advogada orienta a forma de devolução."],
    ["Recebo de volta as parcelas descontadas?", "Sim, se o contrato for anulado. Em muitos casos, a devolução é em dobro, e pode haver indenização por danos morais."],
    ["Quais provas preciso?", "Extrato do benefício ou contracheque com os descontos, extrato da conta mostrando o depósito, protocolos de reclamação e o boletim de ocorrência."],
  ],
  "pix-golpe": [
    ["Caí em um golpe no Pix. Ainda dá para recuperar?", "Às vezes, sim. Avise o seu banco imediatamente e peça o MED (Mecanismo Especial de Devolução), que pode bloquear o valor na conta do golpista. Quanto mais rápido, maior a chance."],
    ["O banco é responsável?", "Depende. Se houve falha de segurança do banco (por exemplo, transações muito fora do seu padrão sem bloqueio, ou falha no atendimento), ele pode ser responsabilizado. Cada caso precisa ser analisado."],
    ["Preciso fazer boletim de ocorrência?", "Sim. O BO, os prints da conversa com o golpista e os comprovantes do Pix são as principais provas."],
    ["Qual o prazo para pedir o MED?", "O pedido deve ser feito o quanto antes. Há prazo limite contado da transação, e depois disso o mecanismo não pode mais ser usado."],
  ],
  "busca-apreensao": [
    ["Atrasei parcelas do carro. O banco pode tomar o carro?", "Em contratos com alienação fiduciária, sim, após a notificação do atraso o banco pode pedir a busca e apreensão na Justiça. Por isso é importante agir logo ao receber a notificação."],
    ["Dá para evitar perder o carro?", "Às vezes. É possível negociar, discutir cobranças abusivas no contrato ou, depois da apreensão, pagar a dívida em prazo curto definido pela lei para reaver o bem. A análise depende do contrato e do momento."],
    ["O carro foi levado. E agora?", "Há um prazo curto (contado da apreensão) para pagar a dívida e ter o carro de volta, ou para apresentar defesa. Procure a advogada imediatamente."],
    ["E se o banco vender o carro por menos do que devo?", "O valor da venda é abatido da dívida. O banco deve prestar contas. Se sobrar dívida, ela pode ser cobrada; se sobrar dinheiro, ele é seu."],
  ],
  "negativado": [
    ["Fui negativado sem aviso. Pode?", "A inclusão no cadastro de inadimplentes precisa ser precedida de comunicação ao consumidor. Se não houve aviso, ou se a dívida não existe, a negativação pode ser cancelada."],
    ["A dívida não é minha. Tenho direito a indenização?", "Negativação indevida costuma gerar indenização por danos morais, mas há exceções (por exemplo, quando a pessoa já tinha outras negativações legítimas). A advogada analisa com o seu relatório de crédito."],
    ["Paguei, mas meu nome continua sujo. O que fazer?", "Depois do pagamento, o credor tem prazo curto (5 dias úteis) para pedir a retirada. Guarde o comprovante e, se não sair, reclame."],
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
    ["Fui reprovado no teste físico (TAF) por pouco. Adianta recorrer?", "Depende de como o teste foi aplicado. Falhas na aplicação, critérios não previstos no edital ou situações como gravidez e lesão comprovada podem justificar novo teste."],
    ["Me eliminaram no exame médico por uma condição que não me impede de trabalhar. E agora?", "A eliminação precisa ter relação real com as atribuições do cargo. Laudos que mostrem a sua capacidade para a função podem fundamentar o pedido."],
    ["Qual o prazo para reagir?", "Os recursos administrativos do edital costumam ter prazos de poucos dias. Na Justiça, o mandado de segurança tem prazo de 120 dias do ato. Aja rápido."],
  ],
  "pad-prazo": [
    ["Recebi notificação de PAD. Sou obrigado a me defender?", "É um direito, e é muito importante exercê-lo. Você tem direito à ampla defesa: acompanhar as provas, indicar testemunhas, fazer perguntas e apresentar defesa escrita, com ou sem advogado."],
    ["Preciso de advogado no PAD?", "A lei não obriga, mas a defesa técnica faz diferença, principalmente em casos que podem levar a demissão ou suspensão longa."],
    ["Posso ser afastado durante o processo?", "Pode haver afastamento preventivo, em regra sem prejuízo da remuneração, quando o servidor puder influir na apuração."],
    ["Qual o prazo para a defesa escrita?", "Depende do estatuto do seu ente (federal, estadual, municipal). No federal, em geral são 10 dias após a citação. Confira o prazo na notificação e não deixe para a última hora."],
  ],
  "direitos-servidor": [
    ["Quais direitos costumam ser negados ao servidor?", "Progressões e promoções atrasadas, adicionais (insalubridade, noturno), licenças, abono de permanência, reajustes previstos em lei e conversão de licença-prêmio não gozada em dinheiro na aposentadoria, entre outros."],
    ["Até quando posso cobrar valores atrasados?", "Em regra, as parcelas dos últimos 5 anos antes do pedido. Valores mais antigos podem estar prescritos."],
    ["Preciso pedir primeiro na administração?", "Nem sempre, mas o pedido administrativo ajuda a documentar e às vezes resolve sem processo. Guarde o protocolo."],
    ["Que documentos separar?", "Ficha funcional, contracheques, portarias, legislação do plano de carreira e o pedido administrativo com a resposta."],
  ],
  "multa-transito": [
    ["Recebi uma multa. Qual o primeiro passo?", "Confira a notificação de autuação: ela abre prazo para a defesa prévia e para indicar o condutor, se não era você dirigindo. Esse prazo não pode passar."],
    ["Quantas chances tenho de recorrer?", "Em geral três: defesa prévia, recurso à JARI e recurso ao conselho estadual (CETRAN) ou ao CONTRANDIFE no DF. Os prazos constam em cada notificação."],
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
    ["Quando começa a contar o prazo?", "Em regra, da data em que a Administração tomou conhecimento do fato. A abertura do PAD interrompe a contagem."],
    ["Como sei se o meu caso prescreveu?", "É preciso olhar as datas: do fato, do conhecimento pela Administração, da abertura do processo e da duração. A advogada faz essa conta com os documentos."],
  ],
  "licitacao-recurso": [
    ["Qual o prazo para recorrer na licitação?", "Na Lei 14.133/2021, a intenção de recorrer deve ser manifestada logo após o ato, e as razões apresentadas em 3 dias úteis. Prazos e forma também constam no edital."],
    ["Posso impugnar o edital?", "Sim, antes da abertura, nos prazos previstos na lei e no edital. A impugnação é útil quando há exigências que restringem a competição sem justificativa."],
    ["Fui desclassificado por detalhe formal. Pode?", "Falhas formais que não prejudicam o conteúdo da proposta muitas vezes podem ser corrigidas (diligência). A desclassificação por excesso de formalismo pode ser questionada."],
  ],
  "orgao-nao-paga": [
    ["O órgão não paga o que deve à minha empresa. O que faço?", "Primeiro, reúna o contrato, as notas fiscais, os atestes de recebimento e as cobranças feitas. Depois, faça um pedido formal de pagamento com prazo. Se não resolver, cabe cobrança judicial."],
    ["Posso parar de prestar o serviço?", "Pela Lei 14.133/2021, atrasos longos de pagamento (em regra acima de 2 meses) permitem suspender a execução, com aviso. Mas faça isso com orientação, para não descumprir o contrato."],
    ["Tenho direito a juros e correção?", "Sim, os atrasos geram correção monetária e juros, conforme o contrato e a lei."],
  ],
  "heteroidentificacao": [
    ["Fui eliminado pela banca de heteroidentificação. Posso recorrer?", "Pode. A banca deve avaliar as características fenotípicas da pessoa, com critérios claros, decisão fundamentada e direito a recurso. Decisões sem motivação ou contraditórias podem ser anuladas."],
    ["Que provas ajudam?", "Fotos de diferentes fases da vida, decisões anteriores de outras bancas que confirmaram a sua condição e documentos. A gravação da entrevista, quando existe, também é importante."],
    ["Perco a vaga na ampla concorrência também?", "Depende do edital e da decisão. Se não houve má-fé, a jurisprudência tende a admitir que o candidato continue na ampla concorrência, se tiver nota."],
  ],
  "tribunal-contas": [
    ["Fui citado pelo Tribunal de Contas. O que isso significa?", "Significa que o Tribunal identificou possível irregularidade em contas, contratos ou recursos públicos e quer ouvir a sua defesa antes de decidir."],
    ["Qual o prazo para me defender?", "O prazo vem na citação (costuma ser de 15 dias, prorrogável). Não ignore: a falta de defesa pode levar a condenação ao ressarcimento e multa."],
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
    ["Minha empresa recebeu um auto de infração. Preciso pagar já?", "Não necessariamente. Em regra, há prazo para defesa administrativa, e enquanto ela é analisada a cobrança fica suspensa. Leia o auto e anote o prazo."],
    ["O alvará foi negado. Posso recorrer?", "Sim. A negativa deve ser fundamentada, e cabe recurso administrativo. Muitas vezes é possível corrigir pendências e pedir de novo."],
    ["Quando vale a pena ir à Justiça?", "Quando há ilegalidade clara, risco de fechamento ou multa desproporcional. Há também a possibilidade de pedir decisão urgente."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "defeito": [
    ["Qual o prazo para reclamar de um produto com defeito?", "30 dias para produtos não duráveis (alimentos, por exemplo) e 90 dias para duráveis (eletrodomésticos, roupas, celulares). Se o defeito for oculto, o prazo começa quando ele aparece."],
    ["A loja diz que eu tenho que falar com o fabricante. É verdade?", "Não. A loja e o fabricante respondem juntos. Você pode reclamar com qualquer um deles."],
    ["Mandei para o conserto e não resolveram. E agora?", "Se o defeito não for resolvido em até 30 dias, você pode escolher: troca por outro produto, devolução do dinheiro corrigido ou abatimento no preço."],
    ["Preciso guardar a nota fiscal?", "Sim, e também protocolos de atendimento, ordens de serviço e conversas. São as suas provas."],
  ],
  "troca-devolucao": [
    ["A loja é obrigada a trocar se não gostei da cor ou do tamanho?", "Na loja física, não é obrigação legal — mas, se a loja prometeu a troca (etiqueta, cartaz, vendedor), ela tem que cumprir. Compras pela internet seguem outra regra: o direito de arrependimento de 7 dias."],
    ["E se o produto tiver defeito?", "Aí a troca é um direito, nos prazos de 30 (não duráveis) ou 90 dias (duráveis), e a loja tem até 30 dias para resolver."],
    ["Posso trocar presente sem nota?", "Depende da política da loja. Sem defeito, a troca de presente é uma cortesia que, se oferecida, deve ser respeitada."],
  ],
  "arrependimento": [
    ["Comprei pela internet e me arrependi. Posso devolver?", "Sim. Você tem 7 dias, a partir do recebimento, para desistir sem precisar explicar o motivo (Código de Defesa do Consumidor, art. 49)."],
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
    ["Cabe indenização por danos morais?", "Depende das consequências: perder compromissos importantes, longa espera sem assistência, perda de conexão. Atrasos curtos e bem assistidos normalmente não geram indenização."],
    ["Minha bagagem foi extraviada. E agora?", "Registre o RIB no aeroporto antes de sair. A companhia tem 7 dias (voo nacional) ou 21 dias (internacional) para devolver. Guarde notas do que precisou comprar."],
    ["Qual o prazo para entrar com ação?", "Para voos nacionais, em regra 5 anos. Para internacionais, aplica-se o prazo de 2 anos da Convenção de Montreal. Não deixe para depois."],
  ],
  "telefonia": [
    ["A operadora cobra serviço que não pedi. O que faço?", "Reclame na operadora (anote o protocolo). Se não resolver, registre na Anatel (app ou site) ou no consumidor.gov.br. Valores pagos indevidamente podem ser devolvidos em dobro."],
    ["Quero cancelar e não deixam. Pode?", "Não. O cancelamento deve ser feito na hora, por qualquer canal, inclusive pela internet, e com protocolo."],
    ["A internet não entrega a velocidade contratada. Tenho direito?", "As operadoras devem cumprir percentuais mínimos de velocidade. Faça testes registrados e reclame. Pode haver abatimento ou rescisão sem multa."],
  ],
  "cobranca-dobro": [
    ["Paguei uma cobrança indevida. Recebo em dobro?", "Em muitos casos, sim. O Código de Defesa do Consumidor (art. 42) garante a devolução em dobro do que foi pago indevidamente, salvo engano justificável da empresa."],
    ["Preciso provar que a empresa agiu de má-fé?", "Não necessariamente. O STJ entende que basta a cobrança contrariar a boa-fé, sem precisar provar a intenção. A análise é feita caso a caso."],
    ["E se eu só fui cobrado, mas não paguei?", "Aí não há devolução em dobro, mas a cobrança indevida pode ser cancelada e, se houver negativação ou constrangimento, gerar indenização."],
  ],
  "ligacoes-cobranca": [
    ["Recebo dezenas de ligações de cobrança por dia. Isso é permitido?", "Não. A cobrança não pode expor ao ridículo nem constranger. Ligações excessivas, em horários inadequados ou para familiares e trabalho podem gerar indenização."],
    ["Como paro as ligações de telemarketing?", "Cadastre seu número no 'Não Me Perturbe' (naomeperturbe.com.br) e registre reclamação na Anatel."],
    ["O que devo guardar como prova?", "Prints do histórico de chamadas com datas e horários, gravações (você pode gravar as próprias ligações) e mensagens."],
  ],
  "contas-essenciais": [
    ["Estou devendo a conta de luz. Podem cortar?", "Podem, mas só depois de aviso prévio e por conta atual (dos últimos 90 dias). Dívidas antigas não autorizam corte: devem ser cobradas por outros meios."],
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
    ["Podem cortar minha luz por causa disso?", "O corte por dívida de recuperação de consumo antiga é questionável, e a jurisprudência restringe. Procure orientação antes de assinar qualquer acordo."],
    ["Assinei um termo sem entender. Ainda dá para contestar?", "Sim. O termo assinado não impede a discussão, principalmente se não houve perícia ou o cálculo é abusivo."],
  ],
  "cancelamento-curso": [
    ["Quero desistir do curso. Tenho que pagar o curso inteiro?", "Não. Multas que obrigam a pagar todas as parcelas restantes costumam ser abusivas. Em regra, cabe uma multa razoável e o pagamento proporcional ao que foi usado."],
    ["Já paguei adiantado. Recebo de volta?", "Sim, a parte não utilizada, descontada uma multa razoável prevista no contrato."],
    ["Como faço o cancelamento?", "Por escrito (e-mail ou protocolo), guardando o comprovante. A data desse pedido é importante para o cálculo."],
  ],
  "corte-luz-agua": [
    ["A concessionária pode cortar minha luz ou água?", "Pode, por falta de pagamento de conta atual, depois de aviso prévio. Não pode cortar por dívida antiga, por dívida de outro morador (dívida pessoal) nem sem aviso."],
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
    ["Doença preexistente: podem negar?", "Só se a seguradora provar que você sabia da doença e omitiu de má-fé, ou se exigiu exames antes de contratar. Sem isso, a recusa costuma ser indevida."],
    ["Qual o prazo para cobrar?", "Em regra, 1 ano para o segurado, contado da ciência da recusa. Para o beneficiário de seguro de vida, o prazo é maior. Não deixe passar."],
  ],
  "imovel-planta": [
    ["A construtora atrasou a entrega. Tenho direito a quê?", "Existe uma tolerância de até 180 dias, se prevista no contrato. Depois disso, cabe multa ou indenização (por exemplo, valor equivalente a aluguel), ou a rescisão com devolução do que foi pago."],
    ["Quero desistir da compra. Recebo o que paguei?", "Depende de quem deu causa. Se a construtora atrasou, a devolução deve ser integral. Se a desistência é sua, a Lei 13.786/2018 permite reter uma parte (até 25% ou 50% no patrimônio de afetação)."],
    ["Preciso continuar pagando enquanto discuto?", "Não pare de pagar sem orientação: isso pode piorar a sua situação. A estratégia depende do caso."],
  ],
  "juros-abusivos": [
    ["Como sei se os juros do meu contrato são abusivos?", "Uma referência é a taxa média de mercado divulgada pelo Banco Central para o mesmo tipo de operação e época. Taxas muito acima da média podem ser revistas."],
    ["Posso parar de pagar enquanto discuto?", "Não é recomendado. O correto é pedir a revisão e, se for o caso, depositar o valor considerado devido, com orientação."],
    ["O que preciso para analisar?", "O contrato, o extrato com as parcelas pagas e a data da contratação."],
  ],
  "conta-invadida": [
    ["Meu celular foi roubado. O que faço primeiro?", "Bloqueie a linha com a operadora, peça o bloqueio do aparelho pelo IMEI, avise todos os bancos para bloquear apps e cartões e registre boletim de ocorrência."],
    ["Fizeram transferências da minha conta. O banco devolve?", "Depende das circunstâncias. Se houve falha de segurança do banco ou transações muito fora do seu padrão, ele pode ser responsabilizado. Reclame imediatamente e peça o MED, se foi Pix."],
    ["Usaram minha conta de WhatsApp para pedir dinheiro. E agora?", "Avise seus contatos, recupere a conta pelo próprio WhatsApp e ative a verificação em duas etapas. Registre boletim de ocorrência."],
  ],
  "tarifas-venda-casada": [
    ["O banco incluiu seguro no empréstimo sem eu pedir. Pode?", "Não. Condicionar o empréstimo à contratação de seguro ou outro produto é venda casada, proibida pelo Código de Defesa do Consumidor. Você pode pedir o cancelamento e a devolução."],
    ["Quais tarifas o banco não pode cobrar?", "Há serviços essenciais gratuitos (como um número mínimo de saques e transferências por mês na conta básica). Tarifas não contratadas ou não informadas também são indevidas."],
    ["Recebo de volta?", "Sim, os valores cobrados indevidamente, em alguns casos em dobro."],
  ],
  "turismo": [
    ["O pacote de viagem deu errado. Quem responde: agência ou hotel?", "Todos os que participaram da venda podem responder juntos: agência, operadora, hotel e companhia aérea. Você pode reclamar com quem preferir."],
    ["A viagem foi cancelada. Tenho direito ao dinheiro de volta?", "Sim, ou à remarcação, à sua escolha, conforme o caso. Guarde o contrato e as comunicações."],
    ["O hotel não era como anunciado. Posso pedir indenização?", "Sim, se houve diferença relevante em relação ao que foi oferecido. Fotos, prints do anúncio e reclamações no local são as melhores provas."],
  ],
  "vazamento-dados": [
    ["Meus dados vazaram. Tenho direito a indenização?", "Depende. O STJ entende que o vazamento, sozinho, nem sempre gera indenização: é preciso mostrar prejuízo ou risco concreto. Dados sensíveis (saúde, por exemplo) recebem proteção maior."],
    ["O que posso exigir da empresa?", "Informação sobre quais dados vazaram, as medidas tomadas e a correção ou exclusão dos seus dados (LGPD)."],
    ["Como me proteger depois do vazamento?", "Troque senhas, ative verificação em duas etapas e acompanhe seu CPF no Registrato e em serviços de proteção de crédito."],
  ],
});

Object.assign(DUVIDAS_CASOS, {
  "inventario-cartorio": [
    ["Quando posso fazer o inventário em cartório?", "Quando todos os herdeiros estão de acordo e são maiores e capazes. Desde 2024, o CNJ passou a permitir também com herdeiros menores ou incapazes, em certas condições e com participação do Ministério Público. Também é possível mesmo com testamento, em alguns casos."],
    ["Preciso de advogado?", "Sim, a lei exige a presença de advogado no inventário em cartório, que pode ser um só para todos os herdeiros."],
    ["Tem prazo para abrir o inventário?", "O prazo legal é de 2 meses a partir do falecimento. O atraso pode gerar multa no imposto (ITCMD), conforme a lei de cada estado."],
    ["Quanto custa?", "Há o imposto (ITCMD, com alíquota definida pelo estado), os emolumentos do cartório (tabela estadual) e os honorários. A advogada faz uma estimativa com os bens."],
  ],
  "divorcio-cartorio": [
    ["Posso me divorciar em cartório?", "Sim, quando há acordo entre os dois. Desde 2024, o CNJ também permite em cartório quando há filhos menores, desde que as questões de guarda, visitas e pensão já estejam resolvidas na Justiça."],
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
    ["Moro há anos num imóvel sem documento. Posso pedir usucapião?", "Pode, se a posse for contínua, sem oposição e como se fosse dono, pelo tempo exigido (de 5 a 15 anos, conforme o tipo de usucapião e a situação)."],
    ["Dá para fazer em cartório?", "Sim, a usucapião extrajudicial é feita no Cartório de Registro de Imóveis, com advogado, ata notarial e planta assinada por profissional. Se alguém se opuser, vai para a Justiça."],
    ["Que provas preciso?", "Contas no seu nome no endereço, IPTU, recibos, fotos antigas, declarações de vizinhos e qualquer documento que mostre o tempo de posse."],
  ],
  "adjudicacao": [
    ["Paguei tudo e o vendedor não passa a escritura. O que faço?", "Você pode exigir a escritura e, se ele não cumprir, pedir a adjudicação compulsória — na Justiça ou, desde 2022, também em cartório."],
    ["O vendedor faleceu ou sumiu. E agora?", "Ainda é possível, com os documentos da compra e a quitação. A falta do vendedor não impede a regularização."],
    ["Que documentos preciso?", "Contrato de compra e venda ou promessa, comprovantes de pagamento e a matrícula do imóvel."],
  ],
  "alvara-valores": [
    ["Como sacar FGTS e PIS de quem faleceu?", "Os dependentes habilitados no INSS (certidão de dependentes) podem sacar diretamente na Caixa. Sem dependentes, os herdeiros precisam de alvará judicial ou escritura de inventário."],
    ["E o dinheiro no banco?", "Valores pequenos podem ser liberados por alvará judicial simples, sem inventário completo, conforme o caso. Valores maiores entram no inventário."],
    ["Quanto tempo leva o alvará?", "Costuma ser um processo rápido, sem disputa, mas o prazo depende da vara."],
  ],
  "protesto": [
    ["Meu nome foi protestado. Como cancelo?", "Pague a dívida (no cartório ou ao credor) e peça a carta de anuência ao credor. Com ela, você solicita o cancelamento no cartório, pagando os emolumentos."],
    ["O protesto é indevido. E agora?", "Se a dívida não existe ou já foi paga, é possível pedir o cancelamento na Justiça, inclusive com indenização."],
    ["O protesto prescreve?", "O protesto em si não some sozinho, mas a dívida pode prescrever. A análise depende do tipo de título e das datas."],
  ],
  "reurb": [
    ["O que é a Reurb?", "É a regularização fundiária urbana (Lei 13.465/2017), que permite regularizar núcleos informais e entregar o título de propriedade aos moradores."],
    ["Quem pode pedir?", "Os próprios moradores, associações, o município e outros legitimados. Na Reurb de interesse social, para população de baixa renda, os custos são menores ou gratuitos."],
    ["Como começar?", "Procure a prefeitura para saber se a área já tem processo de Reurb. Se não tiver, a organização dos moradores ajuda a pedir."],
  ],
  "certidao-matricula": [
    ["Para que serve a certidão de matrícula?", "Ela mostra quem é o dono do imóvel, as características, e se há dívidas, penhoras, hipotecas ou outras restrições. É indispensável antes de comprar."],
    ["Como tiro a certidão?", "No Cartório de Registro de Imóveis da região ou pela internet, no site do Registro de Imóveis do Brasil (registradores.onr.org.br)."],
    ["A certidão tem validade?", "Para negócios, costuma-se exigir certidão recente (em geral, de até 30 dias)."],
  ],
  "mudar-nome": [
    ["Posso mudar meu nome direto no cartório?", "Sim. Desde 2022 (Lei 14.382), maiores de 18 anos podem mudar o prenome uma vez, no cartório, sem precisar explicar o motivo nem ir à Justiça."],
    ["E o sobrenome?", "A inclusão ou exclusão de sobrenomes de família também pode ser feita em cartório em várias situações, como casamento, divórcio e inclusão de sobrenome de avós."],
    ["Pessoas trans podem alterar nome e gênero em cartório?", "Sim, diretamente no cartório, sem cirurgia e sem laudo, conforme decisão do STF e norma do CNJ."],
  ],
  "testamento": [
    ["Posso deixar meus bens para quem eu quiser?", "Em parte. Se você tem herdeiros necessários (filhos, pais, cônjuge), metade dos bens é reservada a eles. A outra metade pode ser deixada livremente."],
    ["Qual tipo de testamento é mais seguro?", "O testamento público, feito no cartório de notas com duas testemunhas, é o mais seguro, porque fica registrado e é difícil de contestar."],
    ["Posso mudar o testamento depois?", "Sim, a qualquer momento, fazendo um novo."],
  ],
  "planejamento-sucessorio": [
    ["O que é planejamento sucessório?", "É organizar, em vida, como os bens serão transmitidos, para evitar conflitos, reduzir custos e dar segurança à família."],
    ["Doação com usufruto vale a pena?", "Pode valer: os bens passam aos herdeiros, mas você continua usando e recebendo os rendimentos. Há imposto na doação (ITCMD), e a vantagem depende do caso e do estado."],
    ["Holding familiar é para mim?", "Costuma ser útil para patrimônios maiores, com imóveis de aluguel ou empresas. Para patrimônios menores, testamento e doação podem bastar."],
  ],
  "ata-notarial": [
    ["Prints de WhatsApp valem como prova?", "Podem valer, mas são mais fáceis de contestar. A ata notarial, feita em cartório, dá fé pública ao conteúdo e torna a prova muito mais forte."],
    ["Como funciona a ata notarial?", "Você leva o celular ou indica o site ao tabelião, que registra o que vê, com data e hora. O documento sai em cartório de notas."],
    ["Quanto custa?", "Depende da tabela do estado e da quantidade de páginas. Vale para provas importantes."],
  ],
  "itcmd": [
    ["O que é o ITCMD?", "É o imposto estadual cobrado sobre heranças e doações. Cada estado define a alíquota (até 8%)."],
    ["Quem paga?", "Na herança, os herdeiros; na doação, em regra, quem recebe."],
    ["Tem isenção?", "Alguns estados isentam valores pequenos ou certos bens. A advogada verifica a lei do seu estado."],
  ],
  "compra-imovel": [
    ["O que conferir antes de comprar um imóvel?", "Certidão de matrícula atualizada, certidões do vendedor (ações, dívidas, protestos), IPTU e condomínio em dia, e se a construção está regular na prefeitura."],
    ["Contrato de gaveta tem valor?", "Tem valor entre as partes, mas não transfere a propriedade. Para ser dono, é preciso escritura e registro no Cartório de Registro de Imóveis."],
    ["Quais custos além do preço?", "ITBI (imposto municipal), escritura e registro. Em financiamento, a escritura pode ser substituída pelo contrato do banco."],
  ],
  "socioafetiva": [
    ["Posso reconhecer como filho quem eu criei?", "Sim. A filiação socioafetiva pode ser reconhecida em cartório para filhos a partir de 12 anos, com consentimento, ou na Justiça."],
    ["O filho fica com dois pais ou duas mães?", "Pode ficar: a multiparentalidade é admitida, mantendo os pais biológicos e incluindo o socioafetivo."],
    ["Quais os efeitos?", "Os mesmos de qualquer filiação: nome, herança, pensão alimentícia e direitos previdenciários."],
  ],
  "regime-bens": [
    ["Posso mudar o regime de bens do casamento?", "Pode, com pedido conjunto e justificado, e sem prejudicar terceiros (como credores)."],
    ["É feito em cartório?", "Em regra, precisa de autorização judicial. Há normas e discussões recentes sobre fazer em cartório; a advogada confirma o caminho atual."],
    ["O que muda para os bens que já tenho?", "Em regra, a mudança vale para frente, e os bens anteriores seguem o regime antigo, salvo acordo diferente aprovado."],
  ],
  "apostila": [
    ["O que é apostila de Haia?", "É um selo que valida documentos brasileiros para uso em outros países que fazem parte da Convenção da Apostila."],
    ["Onde faço?", "Em cartórios autorizados, apresentando o documento original."],
    ["Preciso de tradução?", "Muitas vezes, sim. A tradução juramentada é feita antes ou depois da apostila, conforme a exigência do país de destino."],
  ],
  "inventario-negativo": [
    ["Preciso fazer inventário se não há bens?", "Não é obrigatório, mas o inventário negativo pode ser útil para provar que não há bens (por exemplo, para o viúvo se casar de novo sem restrição de regime ou para encerrar dívidas)."],
    ["Pode ser em cartório?", "Sim, com acordo dos herdeiros e advogado."],
  ],
  "cessao-hereditaria": [
    ["Posso vender minha parte na herança?", "Pode, por escritura pública de cessão de direitos hereditários. Os outros herdeiros têm preferência na compra."],
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
    ["Quais são os prazos de carência?", "Os máximos são: 24 horas para urgência e emergência, 300 dias para parto e 180 dias para os demais procedimentos. O contrato pode prever prazos menores."],
    ["Estou em carência e tive uma emergência. O plano tem que atender?", "Sim, a partir de 24 horas da contratação. Recusar atendimento de urgência ou emergência por carência longa é ilegal."],
    ["Doença preexistente tem carência diferente?", "Pode haver cobertura parcial temporária de até 24 meses para procedimentos de alta complexidade ligados a doença que você declarou. Urgências continuam cobertas."],
  ],
  "sus-remedio": [
    ["Como conseguir remédio pelo SUS?", "Com a receita, procure a farmácia da unidade básica ou a farmácia de alto custo do estado. Se o remédio não estiver disponível, peça a negativa por escrito."],
    ["O remédio não está na lista do SUS. E agora?", "É possível pedir na Justiça, desde que preenchidos os requisitos dos tribunais: necessidade comprovada por relatório médico, ineficácia das alternativas da lista, falta de condições de pagar e registro na Anvisa."],
    ["Quanto tempo leva?", "Com urgência demonstrada, a liminar pode sair em poucos dias. A entrega depois depende do cumprimento pelo poder público."],
  ],
  "bariatrica": [
    ["O plano tem que cobrir a bariátrica?", "Sim, quando há indicação médica e os critérios da ANS são atendidos (como determinados índices de IMC e doenças associadas)."],
    ["E a cirurgia plástica depois do emagrecimento?", "As cirurgias reparadoras indicadas após a bariátrica (como retirada de excesso de pele) têm sido reconhecidas como parte do tratamento, e não como estéticas. O STJ já decidiu nesse sentido."],
    ["O que o relatório médico precisa ter?", "Histórico de tratamentos, IMC, doenças associadas e, para a reparadora, os problemas causados pelo excesso de pele (infecções, dores, limitações)."],
  ],
  "oncologico": [
    ["O plano tem que cobrir o tratamento do câncer?", "Sim. Quimioterapia, radioterapia, cirurgias e diversos medicamentos, inclusive orais em uso domiciliar previstos pela ANS, têm cobertura obrigatória."],
    ["O plano negou um medicamento novo. Pode?", "Depende do registro na Anvisa e das evidências. Com relatório médico fundamentado, é possível pedir na Justiça, inclusive com urgência."],
    ["Tenho prazo para começar o tratamento?", "A lei garante que o paciente do SUS inicie o tratamento em até 60 dias após o diagnóstico. No plano, valem os prazos da ANS e a urgência indicada pelo médico."],
  ],
  "reembolso": [
    ["Quando o plano tem que reembolsar consulta particular?", "Quando o contrato prevê reembolso (livre escolha) ou quando o plano não oferece profissional ou serviço na rede dentro do prazo da ANS."],
    ["Qual valor recebo de volta?", "Em contratos com livre escolha, o valor da tabela do plano. Quando o plano falhou em oferecer atendimento, o reembolso deve ser integral."],
    ["Quanto tempo o plano tem para pagar?", "Em geral, até 30 dias após a entrega dos documentos. Guarde notas fiscais e recibos detalhados."],
  ],
  "erro-medico": [
    ["Como sei se foi erro médico?", "Nem todo resultado ruim é erro. O erro acontece quando o profissional age com imprudência, negligência ou imperícia. Normalmente é preciso uma análise técnica (perícia)."],
    ["Quem responde: o médico ou o hospital?", "Podem responder o hospital, a clínica, o plano e o próprio médico, conforme o caso. O hospital responde pelos serviços que presta."],
    ["Quais provas reunir?", "Prontuário médico completo (é seu direito pedir cópia), exames, receitas, fotos e relatórios de outros médicos."],
    ["Qual o prazo para entrar com ação?", "Em regra, 5 anos a partir de quando você soube do dano e de quem o causou."],
  ],
  "home-care": [
    ["O plano é obrigado a cobrir home care?", "Quando há indicação médica de internação domiciliar em substituição à hospitalar, os tribunais entendem que o plano não pode negar, mesmo que o contrato exclua."],
    ["O que entra no home care?", "Depende da prescrição: enfermagem, fisioterapia, equipamentos, medicamentos e materiais. O relatório médico deve detalhar."],
    ["O plano quer reduzir as horas de enfermagem. Pode?", "Só com nova avaliação médica que justifique. Reduções unilaterais podem ser questionadas."],
  ],
  "cancelamento-plano": [
    ["O plano pode me cancelar durante um tratamento?", "Plano individual não pode ser cancelado, salvo fraude ou falta de pagamento por mais de 60 dias, com aviso. Em plano coletivo, o STJ entende que o tratamento de doença grave deve ser mantido até a alta."],
    ["Atrasei a mensalidade. Já podem cancelar?", "No plano individual, só após 60 dias de atraso (somados ou não, em 12 meses) e com notificação até o 50º dia."],
    ["O plano coletivo foi cancelado pela empresa. Fico sem nada?", "Podem existir opções: portabilidade sem carência ou contratação de plano individual. E quem está em tratamento pode pedir a manutenção."],
  ],
  "saude-mental": [
    ["O plano cobre internação psiquiátrica?", "Sim. Não pode haver limite de dias de internação psiquiátrica. Cláusulas que limitam são consideradas abusivas."],
    ["E tratamento para dependência química?", "Também tem cobertura, incluindo internação quando indicada pelo médico."],
    ["E psicoterapia?", "As sessões de psicoterapia previstas no rol da ANS têm cobertura, e para vários transtornos não há limite de sessões quando há indicação."],
  ],
  "liminar-descumprida": [
    ["Ganhei a liminar e o plano não cumpre. O que faço?", "Avise a advogada imediatamente. É possível pedir ao juiz multa diária, aumento da multa, bloqueio de valores para custear o tratamento e outras medidas."],
    ["O governo não cumpre a decisão. Pode bloquear dinheiro?", "Sim. Quando o poder público descumpre decisão sobre saúde, o juiz pode determinar o bloqueio de verbas públicas para garantir o tratamento."],
    ["O que levo para mostrar o descumprimento?", "Protocolos de contato, negativas, mensagens e datas. Quanto mais detalhes, mais rápida a medida."],
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
    ["E se eu estiver em tratamento?", "A portabilidade garante a continuidade da cobertura sem nova carência, inclusive para doenças preexistentes já cumpridas."],
  ],
  "uti-sus": [
    ["Não há vaga de UTI pelo SUS. O que fazer?", "É uma situação de urgência. Com o relatório médico indicando a necessidade de UTI, é possível pedir à Justiça (inclusive no plantão) que o poder público providencie a vaga, até em hospital particular, às custas do Estado."],
    ["Quanto tempo demora?", "Pedidos de UTI costumam ser analisados em horas. Por isso, o relatório médico e o número do pedido na central de regulação são essenciais."],
    ["Quem pode pedir?", "O paciente ou a família, com advogado ou pela Defensoria Pública."],
  ],
  "odontologico": [
    ["O plano odontológico pode negar tratamento?", "Deve cobrir os procedimentos do rol da ANS para a segmentação contratada. Negativas devem ser por escrito e fundamentadas."],
    ["O dentista errou no tratamento. Tenho direito a quê?", "Ao refazimento, ao reembolso do que pagou e, conforme o caso, a indenização. Reúna o prontuário, radiografias e orçamentos de correção."],
    ["Quanto tempo tenho para reclamar?", "Para serviços com defeito, o prazo inicial é de 90 dias; para indenização por danos, em regra 5 anos."],
  ],
});
