# Auditoria — Direito Administrativo Computável (DAC)

Release auditada: `direito_administrativo_computavel_FINAL.html` (pacote `PACOTE_CLAUDE_DAC`).
Método: execução em navegador real (Chromium), sem rede, reproduzindo caso → clique → resultado e inspecionando o estado interno (`LAST`). Comportamento executável prevalece sobre manifestos.

## Classificação

**INTEGRÁVEL APÓS REFATORAÇÃO** — como motor de análise para o cidadão. Com a v13.7, os dois bloqueadores P0 foram corrigidos; seguem os P1 (conclusões raras e em rótulo técnico).
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

## Correções aplicadas — versão v13.7

Arquivo corrigido entregue à parte (`direito_administrativo_computavel_v13_7.html`), com dois testes reprodutíveis (`testar_dac.js` e `regressoes_nfv2.js`). **Nenhuma regra foi alterada:** o hash do corpus (3.292 regras) é idêntico antes e depois.

| Verificação | Original | v13.7 |
|---|---|---|
| Erros no carregamento | 4 | **0** |
| Testes internos do motor (`runRealityTests`) | não rodavam (21/22 quando forçados) | **22/22** |
| Casos epistemológicos da auditoria | 10/21 | **21/21** |
| Regressões oficiais NFV2 (2.8, 3.1, 3.2) | 54/74 | **59/74**, sem nenhuma regressão |

O que foi corrigido:
1. **Hipótese não vira mais fato** (“talvez”, “indícios”, “suposto”, “possivelmente”, “será apurado”, “sob investigação”).
2. **“Não foi ouvido” invertido:** o extrator antigo marcava contraditório **observado**, porque os padrões com acento nunca casavam com o texto normalizado. Corrigido em todo o extrator legado.
3. **Paráfrases de negação da defesa:** “sem que lhe fosse oferecido prazo para defesa”, “cerceamento de defesa”, “sem ser intimado”.
4. **“X, mas Y”:** a negação ou falta de prova de uma parte não contamina mais a outra (“Não houve dano, mas houve vantagem indevida comprovada”). Alegação e contestação continuam valendo para a frase inteira.
5. **Absolvição “por insuficiência de provas”** é reconhecida como absolvição (antes ficava desconhecida).
6. **Confissão** tratada como alegação até valoração, conforme a especificação NFV2 (caso E2E27).
7. **`analyze()` inexistente:** substituído por chamada ao caminho único `engineAnalyzeCore()`, o que destravou a inicialização.

As 15 divergências restantes nas regressões oficiais: 11 são de **nomenclatura** (a especificação usa `IMPROBIDADE`, `FRAUDE`, `INEXISTENCIA_FATO`, `DESEQUILIBRIO`, `LIMITE_ULTRAPASSADO`, conceitos que o motor não implementa com esse nome) e 4 são casos específicos de absolvição penal, LAI e risco contratual, já existentes na versão original.

## Versão v13.8 — conclusões em linguagem simples

Sem alterar regras nem a leitura de fatos (regressões idênticas à v13.7: 21/21 e 59/74; hash do corpus inalterado):
- Cada conclusão vira uma frase em português simples, com **Fundamento** legível (ex.: “Constituição Federal, art. 37, III”) e o **porquê** (condições atendidas e exceções). O rastro técnico continua visível, em letra menor.
- Frases revisadas para os efeitos mais frequentes dos domínios mais procurados (prazos de defesa e prescrição, contraditório, ampla defesa, devido processo, dolo/erro grosseiro, concurso, improbidade).
- Demais efeitos traduzidos automaticamente a partir do nome da regra, com acentuação; regras de segurança aparecem como garantias (“Dolo não pode ser presumido: precisa ser provado.”).
- Quando não há conclusão segura, o motor diz o que falta esclarecer, em vez de “UNKNOWN”.
- Correção de legibilidade: o texto das conclusões estava em cor quase invisível sobre o fundo escuro.

**Limite que permanece (P1):** a explicação melhorou, mas a **cobertura de conclusões** ainda é baixa. Ex.: “PAD sem prazo de defesa” leva a “é preciso verificar o contraditório”, e não à conclusão de nulidade; “sem dolo e sem dano” não leva automaticamente a “improbidade afastada”. Isso depende de ligar os fatos extraídos às condições das regras (vocabulário de predicados), próxima etapa.

## Versão v13.9 — fatos ligados às regras (o motor passa a concluir)

Nova bateria de **15 casos-modelo de conclusão** (`testar_conclusoes.js`): cada caso define o que o motor **deve** concluir e o que **não pode** concluir (armadilhas de hipótese, alegação, negação e falta de informação).

| Bateria | v13.8 | v13.9 |
|---|---|---|
| Casos-modelo de conclusão | 11/15 | **15/15** |
| Leitura de fatos | 21/21 | 21/21 |
| Regressões oficiais NFV2 | 59/74 | 59/74 |
| Testes internos | 22/22 | 22/22 |
| Corpus (hash) | inalterado | inalterado |

Defeitos encontrados e corrigidos:
1. **Condições negativas inavaliáveis:** `label()` transformava “= False” em “(não)” antes da compilação; as 20 regras com condição negativa (ex.: “ilegalidade + dolo qualificador = não → não configura improbidade”) nunca podiam ser aplicadas.
2. **Polaridade na busca genérica:** a simples menção de um termo satisfazia tanto “= sim” quanto “= não”, e negação/hipótese/alegação eram ignoradas.
3. **Predicados específicos sem ligação com os fatos:** ponte explícita (ex.: `dolo_qualificador`, `ato_doloso_fim_ilicito` → DOLO; `decisao_administrativa`, `ato_administrativo_existente` → ato informado no relato).
4. **Seleção só por palavras:** regras integralmente atendidas pelos fatos não entravam na análise; agora entram.

Derivações jurídicas introduzidas (explícitas e conservadoras — só com fato **afirmado**, nunca com alegação ou hipótese):
- Punição aplicada **com** negação de defesa/contraditório → ato ilegal (CF, art. 5º, LV).
- Ato restritivo (remoção, exoneração, demissão…) **sem** processo prévio ou **sem** motivação → ato ilegal (CF, art. 5º, LIV; Lei 9.784/1999, art. 50).

Exemplos de resultado:
- “Demitido em PAD sem prazo para defesa” → **O ato é ilegal e deve ser anulado** (Lei 9.784/1999, art. 53).
- “Houve ilegalidade, mas não houve dolo” → **Sem dolo, a ilegalidade não configura improbidade** (Lei 8.429/1992, art. 17-C).
- “Talvez tenha havido dolo” / “segundo a denúncia” / “não há prova de dolo” → **nenhuma conclusão** sobre improbidade (correto).

**Para validação jurídica:** as duas derivações acima e a frase “sem dolo, não configura improbidade”.

## O que já foi integrado à Plataforma do Direito
- Cada resposta de Administrativo indica os domínios DAC relacionados (`dac.js`).
- Os domínios vão no pedido de consulta, junto com o código do Atlas, para orientar o dossiê.
- O motor e o corpus **não** foram copiados para o repositório: o material é seu e o repositório pode ser público. Quando decidir, o corpus extraído (`regras.json`, ~1 MB) pode entrar como base do dossiê.

## v13.8 — correções aplicadas (motor em `escritorio/dac/motor.html`)
- **P0-1 resolvido:** hipótese/apuração em curso ("talvez", "supostamente", "será apurado", "em tese", "indícios"…) nunca gera `ESTABLISHED`.
- **P0-2 resolvido:** paráfrases de ausência de defesa ("sem que lhe/me fosse oferecido prazo para defesa", "não pôde se defender", "cerceamento de defesa", "não foi intimado") → `CONTRADITORIO_OBSERVADO = false`; "foi intimado e apresentou defesa" → `true`.
- Cláusulas separadas por "mas/porém/contudo" e por "e a/o…" (sem cortar alegação × contestação); "não reconheceu" e "nem" como negação; "negativa" não é mais lido como "nega"; confissão = alegação; na absolvição, "insuficiência de provas" é o fundamento.
- **P1-5 resolvido:** sem erros no console (ponto de entrada `analyze` único).
- Regressões: bateria interna 22/22 (era 21/22), NFV2 3.1 30/30 (era 26/30), NFV2 3.2 multidomínio 22/22 (era 17/22). Rodar: `node escritorio/dac/testes/rodar.js`.
- **Em uso:** no painel do escritório (Mais → Motor de Direito Administrativo, e botão "⚖️ Motor DAC" na ficha do cliente), como apoio à análise da advogada.
- Pendentes: P1-3 (conclusões raramente atravessam os gates), P1-4 (rótulos — o painel já traduz "avaliar/enforce"), P1-6 e P2.
