# Auditoria — Direito Administrativo Computável (DAC)

Release auditada: `direito_administrativo_computavel_FINAL.html` (pacote `PACOTE_CLAUDE_DAC`).
Método: execução em navegador real (Chromium), sem rede, reproduzindo caso → clique → resultado e inspecionando o estado interno (`LAST`). Comportamento executável prevalece sobre manifestos.

## Classificação

**INTEGRÁVEL APÓS REFATORAÇÃO** — como motor de análise para o cidadão.
**APROVEITÁVEL JÁ** — o corpus de regras, a taxonomia de 28 domínios e as conexões entre domínios, como base de conhecimento para o dossiê do advogado.

## O que funciona

- **Clique → resultado:** o botão Analisar executa `engineAnalyzeCore()` e publica o resultado. O defeito crítico citado no README (clique sem resposta) **não se reproduziu**.
- **Negação:** “Não houve dano ao erário nem vantagem indevida” → `DANO_ERARIO = false`, `VANTAGEM_INDEVIDA = false`. Correto.
- **Alegação:** “O denunciante alega que houve dano…” → nada promovido a fato. Correto.
- **Contestação:** “O MP afirma dolo; a defesa nega” → dolo não promovido. Correto.
- **Negação de garantias:** “punido sem direito de defesa e sem contraditório” → `CONTRADITORIO_OBSERVADO = false`. Correto.
- **Corpus:** 3.292 regras em 28 domínios, 479 pontes entre domínios, com fonte, condições (`if`, `if_any`), exceções (`except_if`) e conclusões (`then`). Estrutura limpa e reaproveitável.

## Bloqueadores

### P0 — impedem uso com o público
1. **Hipótese promovida a fato.** “Talvez tenha havido dolo do gestor, o que ainda será apurado” → `DOLO = true / ASSERTED / ESTABLISHED`. É o falso positivo que o NFV2 deveria eliminar, no fato mais sensível (dolo define improbidade).
2. **Negação perdida em construção comum.** “demitido em PAD **sem que lhe fosse oferecido prazo para defesa**” → `CONTRADITORIO_OBSERVADO = UNKNOWN`. O extrator reconhece “sem contraditório”, mas não a paráfrase.

### P1 — impedem resultado útil
3. **Conclusões raramente atravessam os gates.** Casos claros (“remoção sem processo prévio e sem motivação”, “contratação sem licitação por dispensa emergencial”) terminam em “nenhuma regra executável → UNKNOWN”. Conservador demais para orientar alguém.
4. **Conclusões em rótulo técnico** (“avaliar dolo culpa”, “enforce dolo nao presumido”), sem texto explicativo nem fonte legível.
5. **Erros residuais no carregamento:** 4× `ReferenceError: analyze is not defined` (wrappers antigos de `window.analyze`, linhas ~1765, 1881–2111). Não bloqueiam o clique, mas indicam código morto a remover.
6. **Status de regras inconsistente:** mais de 20 valores (`ACTIVE`, `ATIVA`, `DRAFT_EXECUTABLE`, `FOUNDATION`, `V03`, `EXPANDED_V02`…) e 226 regras sem status. Não há como saber, por dado, quais regras estão validadas.

### P2 — governança
7. **Fonte em formatos diferentes** (`CF37-II` × `Planalto — Lei 9.784/1999; Art. 1º`). Necessário um identificador normativo único (lei, artigo, versão, vigência) para ligar a um Vade Mecum/Codex.
8. **Arquivo único de 1,2 MB** com 7 blocos de script sobrepostos (v13.1 a v13.6). Dificulta testar partes isoladas.

## Testes para mudar de categoria
- Suíte com, no mínimo, os 7 casos acima como regressão permanente: negação, alegação, hipótese, contestação, paráfrase de negação, ausência de processo, dispensa.
- Hipótese (“talvez”, “suspeita”, “possível”, “será apurado”) nunca gera `ESTABLISHED`.
- Pelo menos uma conclusão executável e explicada em cada caso claro.
- Zero erros no console no carregamento.
- Status normalizado em um vocabulário fechado (ex.: `VALIDADA`, `RASCUNHO`, `HISTORICA`, `SUPERADA`).

## Arquitetura recomendada (contrato entre módulos)
1. **Fonte normativa versionada** (Codex/Vade Mecum): id do dispositivo, texto, vigência inicial e final.
2. **Registro de regras**: o corpus atual, em JSON separado, com status normalizado e referência ao id normativo.
3. **Extração de fatos (NFV2)**: texto → fatos com estado epistêmico (afirmado, alegado, hipotético, contestado, negado).
4. **Escopo e tempo**: ente, jurisdição e data dos fatos.
5. **Motor de decisão**: aplica só regras `VALIDADA`, respeitando exceções e guards.
6. **Explicação**: cada conclusão com texto em português simples e a fonte legível.
7. **Interface**: a Plataforma do Direito consome os módulos 5 e 6 por uma função, sem a UI do DAC.

## Plano incremental (preservando as 3.292 regras e as regressões)
1. Extrair o corpus para `regras.json` sem alterar conteúdo; normalizar status em campo novo.
2. Separar o extrator NFV2 em módulo testável e corrigir os dois P0, com os casos acima como testes.
3. Remover os wrappers de `window.analyze`.
4. Escrever textos explicativos para as conclusões dos domínios mais procurados (DA-03, DA-04, DA-05, DA-21).
5. Só então ligar o motor à triagem de Administrativo da plataforma, primeiro para uso interno (dossiê) e depois para o público.

## O que já foi integrado à Plataforma do Direito
- Cada resposta de Administrativo indica os domínios DAC relacionados (`dac.js`).
- Os domínios vão no pedido de consulta, junto com o código do Atlas, para orientar o dossiê.
- O motor e o corpus **não** foram copiados para o repositório: o material é seu e o repositório pode ser público. Quando decidir, o corpus extraído (`regras.json`, ~1 MB) pode entrar como base do dossiê.
