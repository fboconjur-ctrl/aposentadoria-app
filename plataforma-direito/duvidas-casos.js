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
