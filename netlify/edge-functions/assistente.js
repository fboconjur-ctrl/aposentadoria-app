// Assistente jurídico do painel do escritório (só para quem entrou no painel: titular ou associado).
// Recebe a tarefa escolhida e o texto, confere o login no Supabase e repassa ao Claude em streaming.
// Edge function: o streaming pode durar o tempo que a resposta levar, sem o limite de 10 s das funções comuns.
// Nada é guardado aqui: o texto passa direto para a API e a resposta volta para o navegador.
const SB_URL = "https://apgrgbotrrhtxfhcjsgq.supabase.co";
const SB_KEY = "sb_publishable_DmfEqquL-n4VPBaTpbPumw_sSC6gmnW"; // chave pública (as regras de acesso estão no banco)
const MODELO = "claude-opus-5-5";
const LIMITE = 150000; // caracteres de entrada

const BASE = `Você é assistente de um escritório de advocacia brasileiro e trabalha para a advogada (não para o cliente).
Regras sempre válidas:
- Escreva em português do Brasil, com títulos curtos e listas quando ajudar a leitura.
- Use só o que está no texto recebido. O que não estiver lá, marque como [CONFERIR] ou [FALTA INFORMAÇÃO]; nunca invente fatos, datas, valores, números de processo, artigos ou julgados.
- Nunca cite jurisprudência que não esteja no texto recebido. Para pesquisa, entregue estratégia de busca e critérios, não ementas.
- Você prepara rascunhos e análises de apoio. A decisão e a revisão final são da advogada; diga isso em uma linha no final.
- Se o texto tiver dados pessoais desnecessários para a tarefa, não os repita na resposta.`;

const TAREFAS = {
  triagem: `Tarefa: triagem de um novo contato (lead) que chegou por WhatsApp ou pelo site.
Entregue: 1) área do direito provável; 2) urgência (alta / média / baixa) com o motivo concreto (prazo correndo, risco de perder direito, saúde); 3) as perguntas que faltam fazer, em linguagem simples, no máximo 6; 4) a mensagem pronta para responder a pessoa (cordial, sem prometer resultado, sem falar de valores, sem dar opinião jurídica sobre o caso); 5) nota interna curta para a equipe.`,
  sentenca: `Tarefa: análise de sentença ou decisão judicial.
Entregue: 1) resumo do dispositivo; 2) tabela pedido por pedido: pedido, resultado (procedente / improcedente / parcial), fundamento usado pelo juiz; 3) sucumbência e honorários fixados; 4) omissões, contradições ou obscuridades que poderiam justificar embargos de declaração; 5) pontos que podem ser atacados em recurso, com o fundamento que sustenta cada um e a força (forte / médio / fraco); 6) prazo do recurso cabível (indique o dispositivo legal e marque [CONFERIR] a data de intimação); 7) resumo em linguagem simples para mandar ao cliente, sem prometer resultado.`,
  resumo: `Tarefa: resumo de peça ou processo.
Entregue: 1) partes e advogados; 2) tipo de ação, número, juízo e valor da causa, se constarem; 3) linha do tempo com datas; 4) pedidos; 5) principais argumentos de cada lado; 6) provas mencionadas; 7) pontos controvertidos; 8) fase atual e próximo passo provável; 9) o que precisa ser conferido nos autos.`,
  jurisprudencia: `Tarefa: planejar pesquisa de jurisprudência (sem citar julgados de memória).
Entregue: 1) a questão jurídica em uma frase; 2) termos de busca e sinônimos, com strings prontas usando operadores (E, OU, aspas) para os sites do STJ, STF, TJ e TRF; 3) quais tribunais e em que ordem procurar, priorizando súmulas, temas repetitivos e repercussão geral; 4) recorte temporal sugerido; 5) checklist para saber se um julgado encontrado serve ao caso (identidade de fatos, razão de decidir, se ainda vale); 6) qual tese contrária esperar.`,
  prazos: `Tarefa: identificar prazos a partir de uma intimação, publicação ou despacho.
Entregue: 1) qual ato precisa ser praticado; 2) a forma de intimação e a data que inicia a contagem (se o texto não deixar claro, marque [CONFERIR]); 3) o prazo legal com o dispositivo, e se conta em dias úteis ou corridos; 4) hipóteses de prazo em dobro a verificar; 5) data provável de vencimento como rascunho, avisando que a conferência deve ser feita na calculadora de prazos do painel e no calendário do tribunal.`,
  notificacao: `Tarefa: redigir notificação extrajudicial.
Entregue a notificação pronta com: qualificação das partes (use [NOME], [CPF], [ENDEREÇO] onde faltar), fatos em ordem, fundamento jurídico, pedido claro e mensurável, prazo razoável para cumprimento e consequência do silêncio, local e data. Depois, sugira o meio de envio com melhor prova (cartório de títulos e documentos, AR, e-mail com confirmação) e liste o que a advogada precisa preencher.`,
  comunicado: `Tarefa: comunicado ao cliente sobre o andamento do caso.
Traduza o despacho, decisão ou andamento recebido em mensagem de WhatsApp curta, em linguagem simples, sem juridiquês: o que aconteceu, o que significa na prática, o próximo passo e se o cliente precisa fazer algo (com data). Tom acolhedor e profissional. Não prometa resultado. Se for notícia ruim, seja honesta e mostre o caminho.`,
  conteudo: `Tarefa: conteúdo educativo para redes sociais (Instagram e LinkedIn) sobre o tema informado.
Entregue: 1) post para LinkedIn; 2) roteiro de carrossel para Instagram (6 a 8 telas, texto curto por tela); 3) legenda. Respeite o Provimento 205/2021 da OAB: caráter informativo, sem promessa de resultado, sem mencionar valores, sem chamada para contratação ("contrate", "ligue já"), sem casos de clientes identificáveis. No final, um checklist de conformidade com a OAB.`,
  etica: `Tarefa: checagem de ética na publicidade (Código de Ética da OAB e Provimento 205/2021) do texto, post ou anúncio recebido.
Entregue: 1) veredito: aprovado / aprovado com ajustes / reprovado; 2) cada trecho problemático com o motivo (captação de clientela, promessa de resultado, preço, mercantilização, autopromoção, sensacionalismo, depoimento de cliente etc.); 3) a versão reescrita pronta para publicar.`,
  anonimizar: `Tarefa: anonimizar o texto recebido.
Devolva o mesmo texto com os dados pessoais substituídos por marcadores consistentes: [PESSOA 1], [PESSOA 2], [CPF], [RG], [ENDEREÇO], [TELEFONE], [E-MAIL], [Nº PROCESSO], [EMPRESA 1], [DATA DE NASCIMENTO], [CONTA BANCÁRIA], [DADO DE SAÚDE] etc. Mantenha datas de atos processuais e o restante do conteúdo. Depois, liste o que foi substituído (sem repetir o dado original) e aponte detalhes que ainda poderiam identificar a pessoa pelo contexto.`,
};

const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default async (req) => {
  if (req.method !== "POST") return json({ erro: "Use POST." }, 405);
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ erro: "Entre no painel primeiro." }, 401);
  // Só quem tem acesso ao painel (titular ou associado ativo).
  const p = await fetch(`${SB_URL}/rest/v1/rpc/meu_papel`, { method: "POST", headers: { apikey: SB_KEY, authorization: `Bearer ${token}`, "content-type": "application/json" }, body: "{}" });
  const papel = p.ok ? await p.json() : null;
  if (papel !== "titular" && papel !== "associado") return json({ erro: "Sem permissão. Entre no painel de novo." }, 401);

  const chave = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!chave) return json({ erro: "O assistente ainda não foi ligado: falta a chave da Anthropic no Netlify (ANTHROPIC_API_KEY)." }, 503);

  let e; try { e = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
  const tarefa = TAREFAS[e.tarefa];
  if (!tarefa) return json({ erro: "Tarefa inválida." }, 400);
  const texto = String(e.texto || "").trim();
  if (texto.length < 20) return json({ erro: "Escreva ou cole um texto maior." }, 400);
  if (texto.length > LIMITE) return json({ erro: `Texto muito grande (${texto.length.toLocaleString("pt-BR")} caracteres). Envie em partes de até ${LIMITE.toLocaleString("pt-BR")}.` }, 400);

  // Repasse direto do streaming (SSE) da API: o navegador lê os pedaços de texto conforme chegam.
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": chave, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODELO, max_tokens: 32000, stream: true,
      output_config: { effort: "medium" },
      system: `${BASE}\n\n${tarefa}`,
      messages: [{ role: "user", content: texto }],
    }),
  });
  if (!r.ok) {
    const det = await r.text().catch(() => "");
    return json({ erro: r.status === 401 ? "A chave da Anthropic é inválida." : r.status === 429 ? "Muitos pedidos agora. Tente em um minuto." : `O assistente não respondeu (${r.status}).`, det: det.slice(0, 300) }, 502);
  }
  return new Response(r.body, { headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-store" } });
};

export const config = { path: "/api/assistente" };
