# Plataforma do Direito — onde paramos (passagem de sessão)

Advogada: Fernanda Borges Oliveira (OAB/DF 35.332). Branch: `claude/plataforma-direito-blueprint-x906s0`.
Prévia: https://deploy-preview-1--prevcalculadora.netlify.app/plataforma-direito/ · Painel: `/plataforma-direito/escritorio/`.

## Princípios combinados
- Correção acima de tudo: nunca inventar jurisprudência, número, valor ou regra; marcar [COMPLETAR]/[PESQUISAR].
- Dados de clientes NUNCA no repositório (é público). No painel ficam no navegador até concluir o Supabase.
- Revisão jurídica final fica para o fim (conteudo/REVISAO.md).
- Sem custo inicial; método mais direto possível.

## O que existe
**Plataforma pública** (`index.html`, `app.js`…): triagem por área, 101 respostas (FAQ), continuações, leitura de CNIS/carta INSS/negativa de plano/PAD, Atlas e DAC, calculadoras (prazo cível, prazo penal, prescrição penal), pedido com CPF validado + pacote do caso (PD1:…) + protocolo.
**Painel do escritório** (`escritorio/`): Hoje · Novo caso (kit: leitura de RG/CPF/comprovante, honorários pela tabela OAB/DF em URH, proposta, procuração, contrato, declaração, pedido de petição, checklist, ficha de protocolo PJe) · Casos (funil, acompanhamento DataJud, importar) · Clientes (CRM + WhatsApp wa.me, CPF obrigatório) · Agenda e prazos (agenda + Google Agenda/.ics, tarefas, calculadora de prazos CPC/CPP, prescrição) · Publicações (DJEN por OAB/nome/processo, leitura do Recorte Digital OAB/DF) · Financeiro (parcelas, recibo, cobrança WhatsApp, CSV).
**Skills** (`skills/`): `peticao` (kit + petição com jurisprudência verificada do foro) e `protocolo-pje` (preenche o PJe e PARA antes da assinatura).
**Rotina**: "Publicações diárias — OAB/DF 35332" (9h44, dias úteis) — falta marcar o conector Gmail nela em claude.ai → Routines.

## Pendências (em ordem)
1. **Supabase (login por e-mail com link mágico)** — projeto criado (apgrgbotrrhtxfhcjsgq) e código ligado (`supabase-config.js`, `escritorio/nuvem.js`, `supabase.sql`). Falta:
   a) SQL Editor → colar `supabase.sql` → Run; b) Authentication → URL Configuration: Site URL e Redirect URLs com o endereço do painel no Netlify;
   c) 1º login no painel → rodar a linha final do `supabase.sql` com o e-mail dela; d) depois, Authentication → desativar novos cadastros.
2. Repositório privado (GitHub → Settings → Change visibility).
3. Asaas (boleto/Pix/cartão) ligado ao Financeiro — depende do Supabase/servidor.
4. Área do cliente com login — depende do Supabase.
5. WhatsApp Cloud API (respostas automáticas, mídia) — decidir número.
6. Testar skills `peticao` e `protocolo-pje` num caso real (Claude Desktop + Claude in Chrome). Certificado: token A3 (+ "e-token" a confirmar se é em nuvem).
7. DataJud/DJEN bloqueiam consultas de fora do Brasil: rodar consultas pelo navegador dela ou via Claude in Chrome.
8. Calibrar os critérios de precificação (multiplicadores) com ela; URH do mês.
9. Revisão jurídica final de `conteudo/REVISAO.md`; salário mínimo 2026 [VALIDAR].
