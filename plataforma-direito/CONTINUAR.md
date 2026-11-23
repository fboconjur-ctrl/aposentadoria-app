# Plataforma do Direito — onde paramos (passagem de sessão)

Advogada: dados (nome/OAB) ficam só em "Meus dados" no painel — NUNCA no código ou no site (pedido dela: golpes contra advogados). Branch: `claude/plataforma-direito-blueprint-x906s0`.
Prévia: https://deploy-preview-1--prevcalculadora.netlify.app/plataforma-direito/ · Painel: `/plataforma-direito/escritorio/`.

## Princípios combinados
- PRIVACIDADE: o site não salva nem envia dados ou documentos de ninguém. PDFs são lidos no aparelho da pessoa e nunca enviados. Só quando a pessoa pede para falar com a advogada (e marca a autorização) o relato, as respostas e os dados lidos vão para a advogada. Nada de analytics/rastreadores. Indicação a colega exige autorização.
- O SITE NÃO DÁ ORIENTAÇÃO JURÍDICA AUTOMÁTICA (OAB-SP x Enter, out/2026): só informação geral de fontes oficiais. Perguntas de continuação e leitura de documentos mostram "o que a lei e a jurisprudência dizem" sobre a situação descrita e terminam com "para ter certeza da avaliação no seu caso, consulte a advogada" — sem veredito. Leitura do CNIS só mostra os vínculos lidos. Sem menção a gratuidade (Prov. 205/2021, art. 3º).
- Correção acima de tudo: nunca inventar jurisprudência, número, valor ou regra; marcar [COMPLETAR]/[PESQUISAR].
- Dados de clientes NUNCA no repositório (é público). No painel ficam no navegador até concluir o Supabase.
- Revisão jurídica final fica para o fim (conteudo/REVISAO.md).
- Sem custo inicial; método mais direto possível.

## O que existe
**Plataforma pública** (`index.html`, `app.js`…): triagem por área, 101 respostas (FAQ), continuações, leitura de CNIS/carta INSS/negativa de plano/PAD, Atlas e DAC, calculadoras (prazo cível, prazo penal, prescrição penal), pedido com CPF validado + pacote do caso (PD1:…) + protocolo.
**Painel do escritório** (`escritorio/`), reorganizado em volta do CLIENTE: só 3 menus (Hoje · Clientes · Mais) + barra "＋ Anotar" sempre visível (entende "Maria audiência 15/10 14h", "João pagou 500", "réplica vence 20/10"; 1º Enter mostra, 2º salva). Ficha única do cliente (com "Indicar a colega": WhatsApp do colega com o resumo, exige marcar autorização do cliente, lista de colegas em `pd-colegas`): a fazer (prazos, compromissos, tarefas), processos (DataJud + publicações), pagamentos, história/anotações, WhatsApp, kit de documentos. Hoje = atrasado/hoje, 7 dias, novidades (pedidos do site, publicações, movimentações). "Mais" = financeiro do mês, publicações (DJEN/Recorte), calculadora de prazos, documentos, importar. Dados: `pd-crm` (clientes), `pd-itens` (prazo/compromisso/tarefa, campo `cli`), `pd-financeiro` (campo `cli`); migração automática do formato antigo (`pd-migrado-v2`). Sem dados fictícios.
**Skills** (`skills/`): `peticao` (kit + petição com jurisprudência verificada do foro) e `protocolo-pje` (preenche o PJe e PARA antes da assinatura).
**Rotina**: "Publicações diárias" (9h44, dias úteis) — falta marcar o conector Gmail nela em claude.ai → Routines.

## Melhorias de nov/2026 (referência: pack de skills jurídicas do Chat Jurídico, reescrito do zero)
- Prazos: lista de peças com dias e base legal; feriado estadual por UF (padrão DF, fica salvo); avisos D-5/D-3/D-1 em dias úteis; ao lançar, cria tarefa "Revisar e protocolar" 3 dias úteis antes. Testes: `node plataforma-direito/ferramentas/testar-prazos.js`.
- Cadastro: campo "Parte contrária" + verificação de conflito de interesses na carteira (direto / possível / sem indício), registrada no histórico (`escritorio/entrada.js`).
- Ficha: "Primeiros passos do cliente" (contratado/caso ativo) com checklist por área e pedido dos documentos que faltam pelo WhatsApp.
- WhatsApp: modelos novos (boas-vindas, lembrete de documento, aviso de prazo/assinatura, retomar proposta, encerramento e avaliação).

## Equipe (associados) — nov/2026
- Titular: Mais → Equipe → cadastra o associado pelo e-mail (ele antes cria a senha em "Primeiro acesso"); na ficha, "Responsável" atribui o caso.
- Associado vê só os casos atribuídos (ficha, prazos, tarefas); sem financeiro, sem outros clientes, sem pedidos/publicações/equipe. Desativar acesso corta na hora.
- Banco: tabelas `associados` e `casos`, funções `meu_papel`, `adicionar_associado` (fim de `supabase.sql`). Edição simultânea do mesmo caso: vale a última gravação.

## Assistente jurídico — nov/2026
- Painel → Mais → ✨ Assistente jurídico: 10 tarefas (triagem, sentença, resumo, prazos, comunicado, notificação, pesquisa de jurisprudência, posts, ética OAB, anonimizar). Prompts próprios em `netlify/edge-functions/assistente.js` (escritos do zero, inspirados no pack do Chat Jurídico).
- Edge function `/api/assistente`: exige login (rpc meu_papel), repassa o streaming do Claude (claude-opus-5-5). Precisa de `ANTHROPIC_API_KEY` nas variáveis do Netlify.

## Documentos enviados pelo cliente — nov/2026
- Decisão da advogada: o cliente pode anexar documentos no pedido do site. Ficam no bucket privado `pedidos-docs` (Supabase) até ela tratar/recusar, no máximo 60 dias.
- Regras: qualquer visitante só ENVIA (pasta PD-AAMMDD-XXXX, PDF/imagem até 10 MB); só a titular lê/apaga. Limpeza dos >60 dias roda ao abrir o painel. Aviso de privacidade e termo de consentimento do site atualizados.
- Há um arquivo de teste de 14 bytes em `PD-000000-TEST/` (sem dados): sai sozinho na limpeza dos 60 dias.

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

## Leitura do relato com IA (/api/analisar)
- Função `netlify/functions/analisar.mjs`. Precisa da variável `ANTHROPIC_API_KEY` no Netlify (Site settings → Environment variables). Sem a chave, o portal usa a leitura por palavras-chave.
- A IA só organiza os fatos, aponta o que a pessoa já fez e escolhe, entre os trechos JÁ REVISADOS dos roteiros, os que se relacionam com o relato. Não conclui nada sobre o caso. O texto não é guardado.

## Ideias guardadas para depois (23/11/2026)
- Página de agendamento: titular define dias/horários livres; cliente escolhe pelo site ou área do cliente; cai na agenda e no Google Agenda; lembrete na véspera.
- Follow-up automático por e-mail (documento pendente, atualização mensal, contato que sumiu) — depende da chave do Resend na Netlify.
- WhatsApp 24h só pela API oficial da Meta (custo por conversa, número dedicado); robô só acolhe e agenda, sem orientação jurídica (OAB). Nada de ferramenta não oficial.
- NÃO fazer: prospecção de empresas (Google Maps / "empresas da cidade") — captação vedada pela OAB.
- Pendências da titular: publicar o app no Google (Branding + Publicar app), testar Entrar com Google e Salvar no Drive; revisar e publicar o termo de adesão dos associados; ligar Resend; desligar prévias de deploy na Netlify; proteção de senha vazada no Supabase.
- Ideia futura: simulador da Reforma Tributária (CBS/IBS/IS) no Raio-x, usando as tabelas oficiais dos repositórios da Receita (calculadora-rtc-regime-regular, calculadora-rtc-simples-nacional; Portaria Cotec 342/2026). Não afeta o simulador previdenciário nem o motor administrativo.
