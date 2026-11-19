# Plataforma do Direito — protótipo de front

> A pessoa traz o problema. A Plataforma do Direito ajuda a descobrir como resolvê-lo e conduz o caminho até a solução.

Protótipo navegável da interface pública. Estático: abra `index.html` no navegador.

## Visão geral

Escritório jurídico digital. O usuário não precisa saber a área do Direito: começa contando o problema, recebe orientação inicial gratuita (caminhos, documentos, órgãos, fontes oficiais) e, quando necessário, agenda um advogado — com o caso já organizado em dossiê, sem repetir a história.

Áreas iniciais: Administrativo, Previdenciário, Saúde, Consumidor e Cartórios/Extrajudicial.

Fluxo: problema → orientação gratuita → caminho → autoatendimento quando possível → advogado quando necessário → execução → acompanhamento.

## Telas do protótipo

1. **Home** — uma única missão: “O que você precisa resolver?”. Sem cadastro. Atalhos opcionais e áreas mais abaixo (SEO / navegação tradicional).
2. **Triagem** — conversa com perguntas de resposta rápida; painel “Seu atendimento” (barra de progresso no celular). A classificação por área é interna.
3. **Resultado** — resumo, passos práticos, documentos, fundamento e fontes recolhíveis, e a recomendação “advogado” ou “continuar sozinho” (a opção gratuita nunca é escondida).
4. **Transição** — “Já organizamos seu caso”, escolha de horário de consulta online.
5. **Minha Área** — status do caso, próximo passo, documentos, próxima reunião.

## Arquivos

- `flows.js` — fluxos de triagem por área (palavras-chave, perguntas, resultado, regra de “precisa de advogado”). Em produção, este conteúdo virá do motor jurídico (normas versionadas + regras), não do código do front.
- `app.js` — navegação entre telas e a conversa.
- `styles.css` — identidade limpa, com modo escuro e layout mobile.

## Limites

Classificação por palavras-chave e respostas simuladas; sem IA, backend, contas, upload real ou agendamento real.

## Ferramentas

- `node plataforma-direito/ferramentas/testar.js` — confere se cada pergunta de teste cai na resposta certa. Rodar antes de cada publicação.
- `node plataforma-direito/ferramentas/gerar-revisao.js` — gera `conteudo/REVISAO.md` com todas as respostas para revisão jurídica.
- Parâmetros que mudam no tempo (ex.: salário mínimo usado nos cálculos) ficam em `continuacoes.js`, no objeto `PARAMS`.
