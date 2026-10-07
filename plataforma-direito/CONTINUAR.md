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
**Painel do escritório** (`escritorio/`), reorganizado em volta do CLIENTE: só 3 menus (Hoje · Clientes · Mais) + barra "＋ Anotar" sempre visível (entende "Maria audiência 15/10 14h", "João pagou 500", "réplica vence 20/10"; 1º Enter mostra, 2º salva). Ficha única do cliente (com "Indicar a colega": WhatsApp do colega com o resumo, exige marcar autorização do cliente, lista de colegas em `pd-colegas`): a fazer (prazos, compromissos, tarefas), processos (DataJud + publicações), pagamentos, história/anotações, WhatsApp, kit de documentos. Hoje = atrasado/hoje, 7 dias, novidades (pedidos do site, publicações, movimentações). "Mais" = financeiro do mês, publicações (DJEN/Recorte), calculadora de prazos, documentos, importar. Dados: `pd-crm` (clientes), `pd-itens` (prazo/compromisso/tarefa, campo `cli`), `pd-financeiro` (campo `cli`); migração automática do formato antigo (`pd-migrado-v2`). Sem dados fictícios.
**Skills** (`skills/`): `peticao` (kit + petição com jurisprudência verificada do foro) e `protocolo-pje` (preenche o PJe e PARA antes da assinatura).
**Rotina**: "Publicações diárias — OAB/DF 35332" (9h44, dias úteis) — falta marcar o conector Gmail nela em claude.ai → Routines.

## Pendências (em ordem)
0. **PRÓXIMO PASSO — Login com Google (fazer pelo Claude in Chrome, ela pediu que o Claude faça):**
   a) console.cloud.google.com/auth/clients → criar projeto "escritorio" se pedir; tela de consentimento (nome do app + e-mail dela);
   b) Criar cliente → Aplicativo da Web → URI de redirecionamento: `https://apgrgbotrrhtxfhcjsgq.supabase.co/auth/v1/callback`;
   c) Supabase (projeto apgrgbotrrhtxfhcjsgq) → Authentication → Sign In / Providers → Google: ativar, colar ID e chave secreta (a chave NÃO vai para o repositório nem para o chat);
   d) Authentication → URL Configuration: Site URL e Redirect URLs = `https://deploy-preview-1--prevcalculadora.netlify.app/plataforma-direito/escritorio/`;
   e) em `supabase-config.js` trocar `google: false` → `true`, publicar; ela entra com Google (mesmo e-mail fboconjur@gmail.com → o Supabase liga à conta existente, já admin). Conferir em auth.users/public.admins via conector Supabase.
1. **Supabase (login por e-mail e senha)** — projeto criado (apgrgbotrrhtxfhcjsgq) e código ligado (`supabase-config.js`, `escritorio/nuvem.js`, `supabase.sql`). Tabelas e regras JÁ CRIADAS no Supabase (via conector). ela cria a senha no painel ("Primeiro acesso"); o Claude roda as 2 linhas finais do `supabase.sql` para liberar o acesso.
2. Repositório privado (GitHub → Settings → Change visibility).
3. Asaas (boleto/Pix/cartão) ligado ao Financeiro — depende do Supabase/servidor.
4. Área do cliente com login — depende do Supabase.
5. WhatsApp Cloud API (respostas automáticas, mídia) — decidir número.
6. Testar skills `peticao` e `protocolo-pje` num caso real (Claude Desktop + Claude in Chrome). Certificado: token A3 (+ "e-token" a confirmar se é em nuvem).
7. DataJud/DJEN bloqueiam consultas de fora do Brasil: rodar consultas pelo navegador dela ou via Claude in Chrome.
8. Calibrar os critérios de precificação (multiplicadores) com ela; URH do mês.
9. Revisão jurídica final de `conteudo/REVISAO.md`; salário mínimo 2026 [VALIDAR].
