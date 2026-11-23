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
