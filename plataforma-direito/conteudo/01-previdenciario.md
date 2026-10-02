# Área 1 — Previdenciário (rascunho para validação)

**Status:** aguardando validação da advogada responsável.
**Como validar:** marque cada item com ✅ (ok), ✏️ (corrigir: escreva a correção ao lado) ou ❌ (remover).
Itens marcados com **[VALIDAR]** são pontos em que a regra tem exceções ou depende de interpretação.

Regra geral de todos os fluxos: a orientação é informativa, sempre mostra a fonte oficial e sempre oferece as duas saídas (“continuar sozinho” e “conversar com advogado”).

---

## Fluxo 1.1 — “Quero saber se já posso me aposentar”

**Gatilhos (palavras que levam a este fluxo):** aposentar, aposentadoria, tempo de contribuição, quanto falta, idade para aposentar.

**Perguntas**
1. Qual sua idade? *(número)*
2. Sexo cadastrado no INSS? Feminino / Masculino
3. Começou a contribuir antes de 13/11/2019? Sim / Não / Não sei
4. Mais ou menos quantos anos de contribuição você tem? *(número ou “não sei”)*
5. Trabalhou em atividade insalubre, perigosa, como professor(a) ou no campo? Sim / Não / Não sei
6. Você tem acesso ao Meu INSS? Sim / Não

**Entrada pelo simulador:** quem escolhe “Quero me aposentar” recebe como primeiro passo o nosso simulador (já existente), que compara regra geral e regras de transição. O simulador também aparece direto na home, no cartão de Previdenciário.

**Orientação — o que você pode fazer agora**
0. **Simule sua aposentadoria agora** no nosso simulador.
1. **Baixe seu extrato do CNIS** no Meu INSS (meu.inss.gov.br). Ele mostra o que o INSS considera do seu tempo.
2. **Confira se faltam períodos** no extrato: empregos sem registro, contribuições como autônomo, períodos rurais.
3. **Simule no próprio Meu INSS** (“Simular aposentadoria”) ou no nosso simulador.

**Documentos:** documento com foto · CPF · carteiras de trabalho · carnês/guias de contribuição · PPP (se trabalhou em atividade especial).

**O que a lei prevê (texto curto)**
Depois da Reforma da Previdência (EC 103/2019), a regra geral exige idade mínima de 62 anos (mulher) e 65 anos (homem), com tempo mínimo de contribuição. Quem já contribuía antes da Reforma pode ter direito a regras de transição, que às vezes permitem se aposentar antes. **[VALIDAR: manter o texto sem números de pontos/idade progressiva para não desatualizar a cada ano, e deixar os números para o simulador?]**

**Fontes:** EC 103/2019 · Lei 8.213/1991 · Meu INSS.

**Quando recomendar advogado** (qualquer um):
- respondeu “Sim” na pergunta 5 (atividade especial, professor, rural);
- extrato com períodos faltando ou que ele não reconhece;
- está a menos de 2 anos de cumprir alguma regra (escolher a melhor regra muda o valor). **[VALIDAR]**

---

## Fluxo 1.2 — “Meu benefício foi negado”

**Gatilhos:** negado, indeferido, indeferimento, INSS negou, carta de indeferimento.

**Perguntas**
1. Qual benefício foi negado? Aposentadoria / Auxílio por incapacidade (auxílio-doença) / BPC-LOAS / Pensão por morte / Salário-maternidade / Outro
2. Quando você recebeu a decisão? Há menos de 30 dias / Há mais de 30 dias / Não sei
3. Você tem a carta ou a decisão do indeferimento? Sim / Não
4. Qual o motivo informado? Falta de tempo/carência / Perícia não reconheceu incapacidade / Renda acima do limite / Falta de documentos / Não sei

**Orientação — o que você pode fazer agora**
1. **Baixe a decisão completa** no Meu INSS (“Consultar pedidos” → detalhes do pedido). O motivo do indeferimento define o caminho.
2. **Se faltaram documentos:** em geral é possível fazer novo pedido já com os documentos que faltaram.
3. **Se discorda da decisão:** você pode apresentar **recurso ao Conselho de Recursos da Previdência Social (CRPS)**, pelo próprio Meu INSS, no prazo de **30 dias** a contar da ciência da decisão.
4. **Outra via:** é possível discutir a negativa na Justiça Federal. Nos Juizados Especiais Federais (causas até 60 salários mínimos) não é obrigatório advogado no primeiro grau, mas a análise profissional costuma fazer diferença. **[VALIDAR: manter essa informação na camada gratuita?]**

**Documentos:** carta de indeferimento · extrato do CNIS · documentos usados no pedido · laudos e exames (se for incapacidade) · comprovantes de renda do grupo familiar (se BPC).

**Fontes:** Lei 8.213/1991, art. 126 · Decreto 3.048/1999 (prazo de recurso) · Lei 10.259/2001 (Juizados Especiais Federais) · Meu INSS.

**Quando recomendar advogado** (qualquer um):
- motivo “perícia não reconheceu incapacidade”;
- motivo “renda acima do limite” no BPC;
- benefício negado é aposentadoria ou pensão por morte;
- prazo de 30 dias já passou ou não sabe. **[VALIDAR]**

---

## Fluxo 1.3 — “Meu auxílio-doença foi cortado / vai acabar”

**Gatilhos:** auxílio-doença, auxílio por incapacidade, cortaram, alta do INSS, perícia, data de cessação, DCB.

**Perguntas**
1. O benefício já foi cortado ou ainda está ativo com data para acabar? Já cortado / Vai acabar / Não sei
2. Você ainda não tem condições de trabalhar, segundo seu médico? Sim / Não / Não sei
3. Tem laudo ou atestado médico recente? Sim / Não
4. Quando foi o corte (ou quando vai acabar)? *(data)*

**Orientação — o que você pode fazer agora**
1. **Se ainda está ativo:** peça a **prorrogação** pelo Meu INSS nos **15 dias anteriores à data de cessação**. **[VALIDAR prazo atual]**
2. **Se já foi cortado:** é possível pedir novo benefício (nova perícia) ou recorrer da decisão em até 30 dias.
3. **Leve laudo atualizado:** com CID, descrição das limitações e tempo estimado de afastamento.

**Documentos:** laudos e atestados recentes · exames · receitas · carta de cessação · documento com foto.

**Fontes:** Lei 8.213/1991, arts. 59 a 63 · Meu INSS.

**Quando recomendar advogado:** médico diz que ainda não pode trabalhar **e** o benefício já foi cortado; ou já teve mais de uma perícia negada. **[VALIDAR]**

---

## Pergunta comum a todos os fluxos

“E o que você gostaria que acontecesse?” — Receber o benefício o quanto antes / Entender meus direitos / Saber se vale a pena entrar na Justiça / Outro.

## Próximos fluxos sugeridos para Previdenciário (depois de validar estes 3)
- BPC/LOAS para idoso ou pessoa com deficiência
- Pensão por morte
- Revisão de aposentadoria já concedida
