# Área 1 — Previdenciário (rascunho v2 para validação)

**Status:** aguardando validação da advogada responsável.
**Como validar:** ✅ ok · ✏️ corrigir (escreva ao lado) · ❌ remover. **[VALIDAR]** = exceção, interpretação ou número que muda com o tempo.

**Base:** os números das regras de aposentadoria seguem o simulador já existente (`aposentadoria-app/rules.js`, referência 2026). Quando a regra muda, atualizamos um lugar só e o texto e o simulador acompanham.

Regra geral: orientação informativa, fonte oficial, duas saídas sempre visíveis.

---

## Mapa da área (como a triagem decide o caminho)

| A pessoa diz… | Fluxo |
|---|---|
| quero me aposentar, quanto falta, posso me aposentar | 1.1 Aposentadoria (entrada pelo simulador) |
| negaram, indeferido | 1.2 Benefício negado (ramifica por benefício) |
| auxílio-doença, perícia, cortaram, alta | 1.3 Incapacidade |
| BPC, LOAS, idoso sem renda, deficiência | 1.4 BPC/LOAS |
| pensão, faleceu, viúva(o) | 1.5 Pensão por morte |
| revisão, valor baixo, aposentadoria errada | 1.6 Revisão |
| CNIS errado, vínculo faltando, tempo não aparece | 1.7 Acertar o CNIS |

---

## Fluxo 1.1 — “Quero me aposentar” (entrada pelo simulador)

**Primeiro passo:** abrir o simulador. As perguntas abaixo só aparecem para quem prefere não simular agora.

**Perguntas de triagem**
1. Data de nascimento e sexo cadastrado no INSS.
2. Começou a contribuir antes de 13/11/2019? Sim / Não / Não sei
3. Tempo total de contribuição (aprox.) e tempo que tinha em 13/11/2019.
4. Trabalhou exposto(a) a agente nocivo (ruído, químicos, eletricidade, hospital)? Sim / Não / Não sei
5. Foi professor(a) na educação básica? Sim / Não
6. Tem deficiência (física, visual, auditiva, intelectual)? Sim / Não
7. Trabalhou no campo (rural, pescador artesanal)? Sim / Não

**As regras que a plataforma explica (valores de 2026)**

*Regra permanente (para quem entrou depois da Reforma ou como alternativa):*
- **Por idade:** 62 anos (mulher) / 65 anos (homem) + 15 anos de contribuição (mulher) / 20 anos (homem que entrou após a Reforma; 15 se entrou antes). Carência de 180 meses.

*Regras de transição (só para quem já contribuía em 13/11/2019):*
- **Pontos (idade + tempo):** 93 pontos (mulher) / 103 (homem) em 2026, com 30/35 anos de contribuição. Sobe 1 ponto por ano até 100/105.
- **Idade mínima progressiva:** 59 anos e 6 meses (mulher) / 64 anos e 6 meses (homem) em 2026, com 30/35 anos de contribuição. Sobe 6 meses por ano até 62/65.
- **Pedágio de 50%:** para quem estava a até 2 anos de completar 30/35 anos em 13/11/2019. Cumpre o tempo que faltava + 50%. Sem idade mínima; aplica fator previdenciário.
- **Pedágio de 100%:** 57 anos (mulher) / 60 (homem) + 30/35 anos + o dobro do que faltava em 13/11/2019. **Valor de 100% da média**, por isso pode compensar mesmo demorando mais.
- **Transição por idade (mulher):** já está em 62 anos desde 2023; não há mais diferença prática. **[VALIDAR: manter citação?]**

*Regras especiais:*
- **Professor(a):** pontos 88 (mulher) / 98 (homem) em 2026, com 25/30 anos de magistério; ou idade progressiva 54,5/59,5 em 2026; regra permanente 57/60 anos + 25 anos. **[VALIDAR números da idade progressiva do professor]**
- **Atividade especial:** permanente com idade mínima de 55/58/60 anos conforme 15/20/25 anos de exposição; transição por pontos (66/76/86). Precisa de **PPP** e, em geral, LTCAT.
- **Pessoa com deficiência (LC 142/2013):** por tempo, sem idade mínima: deficiência grave 25 (homem) / 20 (mulher) anos; moderada 29/24; leve 33/28. Por idade: 60 (homem) / 55 (mulher) + 15 anos contribuindo com deficiência. Não foi alterada pela Reforma.
- **Rural:** 60 (homem) / 55 (mulher) + 15 anos de atividade rural comprovada. Existe também a aposentadoria **híbrida** (rural + urbano), com a idade da regra urbana.
- **Direito adquirido:** quem já cumpria os requisitos antes de 13/11/2019 pode se aposentar pelas regras antigas, a qualquer tempo.

**Como é calculado o valor (regra geral pós-Reforma)**
- Média de **todos** os salários desde 07/1994.
- 60% da média + 2% por ano que passar de **15 anos (mulher)** ou **20 anos (homem)**.
- Exceções: pedágio de 100% (100% da média); pedágio de 50% (média × fator previdenciário).
- **⚠️ Ponto técnico:** o simulador hoje soma os 2% acima de 20 anos para todos. Para mulheres, a EC 103 (art. 26, §5º) conta a partir de 15 anos. **[VALIDAR e, se confirmado, corrijo o simulador]**

**O que você pode fazer agora**
1. **Simule** no nosso simulador.
2. **Baixe o CNIS** no Meu INSS e confira vínculo por vínculo (ver fluxo 1.7).
3. **Separe o PPP** de cada empresa onde houve exposição a agente nocivo.
4. **Não peça a aposentadoria antes de comparar as regras:** depois de concedida, trocar de regra é difícil.

**Documentos:** documento com foto · CPF · CTPS (todas) · CNIS · carnês/guias · PPP e LTCAT · certidão de tempo de serviço público (CTC) · documentos rurais (bloco de produtor, ITR, declaração do sindicato) · laudos da deficiência.

**Fontes:** EC 103/2019, arts. 15 a 21 e 26 · Lei 8.213/1991 · LC 142/2013 · Decreto 3.048/1999 · Meu INSS.

**Quando recomendar advogado:** atividade especial, professor, deficiência ou rural; tempo faltando no CNIS; mais de uma regra possível com valores diferentes; tempo em regime próprio (servidor) a somar.

---

## Fluxo 1.2 — “Meu benefício foi negado”

**Perguntas**
1. Qual benefício? Aposentadoria / Auxílio por incapacidade / BPC-LOAS / Pensão por morte / Salário-maternidade / Auxílio-acidente / Outro
2. Data da ciência da decisão.
3. Motivo informado (lido da carta, se enviada).

**Caminho comum**
1. **Baixe a decisão completa** no Meu INSS (Consultar pedidos → detalhes). O motivo define o caminho.
2. **Três saídas possíveis:**
   - **Novo pedido**, se o problema foi falta de documento (mais rápido quando o documento existe).
   - **Recurso ao CRPS**, em **30 dias** da ciência, pelo Meu INSS. Vai à Junta de Recursos e, depois, às Câmaras de Julgamento.
   - **Ação na Justiça Federal**: Juizado Especial Federal até 60 salários mínimos.
3. **Recurso e ação ao mesmo tempo não:** o recurso administrativo e a ação judicial sobre o mesmo pedido não podem andar juntos. Escolher um caminho é decisão técnica. **[VALIDAR redação]**

**Ramificações por motivo**
- **Falta de tempo/carência:** quase sempre é CNIS incompleto → fluxo 1.7.
- **Perícia negou incapacidade:** → fluxo 1.3.
- **Renda acima do limite (BPC):** → fluxo 1.4.
- **Falta de qualidade de segurado (pensão, incapacidade):** verificar período de graça (12 meses, podendo chegar a 24 ou 36). **[VALIDAR]**
- **Não reconheceu atividade especial ou rural:** falta de PPP/prova material → recomendar advogado.

**Fontes:** Lei 8.213/1991, arts. 15 e 126 · Decreto 3.048/1999, art. 305 · Lei 10.259/2001.

**Quando recomendar advogado:** aposentadoria, pensão, especial ou rural negadas; perícia negada; prazo de 30 dias perto do fim ou já vencido.

---

## Fluxo 1.3 — Incapacidade (auxílio-doença, aposentadoria por incapacidade, auxílio-acidente)

**Perguntas**
1. Situação: Quero pedir / Negado na perícia / Vai acabar (DCB) / Já foi cortado
2. Tem pelo menos 12 contribuições? Sim / Não / Não sei (não exigido em acidente e em doenças da lista legal)
3. A doença ou acidente tem relação com o trabalho? Sim / Não / Não sei
4. Ficou com sequela que reduz a capacidade de trabalho? Sim / Não

**Orientação**
1. **Pedido:** pelo Meu INSS. Em alguns casos é possível a análise documental pelo **Atestmed**, sem perícia presencial. **[VALIDAR limites atuais]**
2. **Prorrogação:** peça nos **15 dias finais** antes da data de cessação.
3. **Cortado:** novo pedido com laudo atualizado ou recurso em 30 dias.
4. **Acidente de trabalho:** a empresa deve emitir a **CAT**; se não emitir, você, o sindicato ou o médico podem emitir. Garante estabilidade de 12 meses após o retorno.
5. **Sequela permanente:** pode dar direito ao **auxílio-acidente** (50% do salário de benefício, acumulável com o salário).
6. **Incapacidade permanente e precisa de ajuda de outra pessoa:** acréscimo de 25% na aposentadoria por incapacidade.

**Fontes:** Lei 8.213/1991, arts. 25, 26, 42 a 45, 59 a 63, 86 e 118.

**Quando recomendar advogado:** negado na perícia com laudo médico contrário; acidente de trabalho; sequela; cortado sem condições de voltar ao trabalho.

---

## Fluxo 1.4 — BPC/LOAS (idoso 65+ ou pessoa com deficiência de baixa renda)

**Perguntas**
1. Idoso(a) com 65+ ou pessoa com deficiência? 
2. Quantas pessoas moram na casa e qual a renda total?
3. Está no CadÚnico atualizado (últimos 2 anos)? Sim / Não / Não sei

**Orientação**
1. **Requisitos:** renda por pessoa da família de até 1/4 do salário mínimo (a lei admite avaliar outros elementos de miserabilidade, até 1/2 em certas situações). **[VALIDAR critérios atuais]**
2. **CadÚnico atualizado é obrigatório:** faça ou atualize no CRAS antes do pedido.
3. **Não é aposentadoria:** não gera 13º nem pensão por morte.
4. **Pessoa com deficiência:** passa por perícia médica e avaliação social.

**Fontes:** Constituição Federal, art. 203, V · Lei 8.742/1993 (LOAS), art. 20.

**Quando recomendar advogado:** negado por renda; negado na avaliação da deficiência.

---

## Fluxo 1.5 — Pensão por morte

**Perguntas**
1. Sua relação com quem faleceu? Cônjuge / Companheiro(a) em união estável / Filho(a) / Pais / Outro
2. Quem faleceu estava contribuindo ou aposentado(a)? Sim / Não / Não sei
3. Há quanto tempo foi o falecimento?
4. (União estável) Tem documentos que provam a união?

**Orientação**
1. **Prazo:** pedindo em até **90 dias** do óbito, o benefício conta desde a data do óbito (180 dias para filhos menores de 16). Depois, conta da data do pedido.
2. **Valor:** 50% + 10% por dependente, até 100%.
3. **Duração para cônjuge/companheiro(a):** depende da idade de quem fica e do tempo de união e de contribuição. Pode ser de 4 meses até vitalícia.
4. **União estável:** exige início de prova documental de pelo menos 24 meses antes do óbito. **[VALIDAR]**

**Fontes:** Lei 8.213/1991, arts. 16, 74 a 77 · EC 103/2019, art. 23.

**Quando recomendar advogado:** união estável sem documentos; quem faleceu não estava contribuindo; mais de um(a) companheiro(a) ou ex-cônjuge pedindo.

---

## Fluxo 1.6 — Revisão de benefício

**Perguntas**
1. Há quanto tempo recebe o benefício? Menos de 10 anos / Mais de 10 anos
2. O que acha que está errado? Tempo não contado / Atividade especial não reconhecida / Salários errados / Não sei

**Orientação**
1. **Prazo:** em regra, **10 anos** do primeiro pagamento para pedir revisão (decadência).
2. **Peça a carta de concessão e a memória de cálculo** no Meu INSS e compare com o CNIS.
3. **Revisões de tese** (decididas em tribunais superiores) mudam com frequência. A plataforma não promete revisão automática.

**Fontes:** Lei 8.213/1991, art. 103.

**Quando recomendar advogado:** sempre que houver indício de erro de cálculo ou tempo não computado (revisão exige cálculo técnico).

---

## Fluxo 1.7 — Acertar o CNIS

**Orientação**
1. **Baixe o CNIS** e veja cada vínculo: datas, salários e indicadores (pendências aparecem com siglas como PEXT, PREC-MENOR-MIN).
2. **Vínculo faltando ou errado:** peça acerto pelo Meu INSS (“Atualizar vínculos e remunerações”) com CTPS, holerites, termo de rescisão, FGTS.
3. **Contribuição abaixo do mínimo** (comum para MEI ou trabalho intermitente): pode ser complementada.
4. **Tempo de serviço público:** precisa de CTC emitida pelo órgão.

**Fontes:** Decreto 3.048/1999, art. 19 · Meu INSS.

**Quando recomendar advogado:** vínculos antigos sem documento; empresa que fechou; necessidade de ação para reconhecer vínculo.

---

## Pergunta comum
“E o que você gostaria que acontecesse?” Saber quando posso me aposentar / Receber o benefício o quanto antes / Aumentar o valor / Entender meus direitos / Outro.
