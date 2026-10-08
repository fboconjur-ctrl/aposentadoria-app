// Leitura do relato do visitante com IA (Claude). Só ORGANIZA o que a pessoa contou e aponta,
// entre os conteúdos já revisados do portal, quais se relacionam com o relato.
// Não conclui nada sobre o caso, não diz se a pessoa tem direito e não recomenda conduta:
// isso é análise jurídica, que é da advogada (Código de Ética da OAB / Provimento 205/2021).
// Nada é guardado: o relato só passa por aqui e segue para a API, sem registro.
const MODELO = "claude-sonnet-5-5";

const REGRAS = `Você ajuda um portal jurídico informativo brasileiro a ORGANIZAR o relato de um visitante.
Regras obrigatórias (ética da OAB):
- Nunca diga se a pessoa tem ou não direito, se vai ganhar, se deve processar, quanto vai receber, nem recomende conduta.
- Nunca invente fatos: use só o que está escrito no relato. Se algo não foi dito, não presuma.
- Escreva em português simples, frases curtas, tratando a pessoa por "você".
- Os fatos devem ser reformulados de modo neutro ("Você contou que...").
- Ao relacionar trechos da lei, explique só a ligação entre o fato contado e o tema do trecho, sem concluir o resultado ("Isso se relaciona com o que você contou sobre X").`;

const FERRAMENTAS = {
  triagem: {
    name: "organizar_relato",
    description: "Organiza o relato e escolhe os assuntos do catálogo que se relacionam com ele.",
    input_schema: {
      type: "object",
      properties: {
        fatos: { type: "array", items: { type: "string" }, description: "Fatos relevantes que a pessoa contou, em ordem cronológica, reformulados de modo neutro. Até 8." },
        ja_tentou: { type: "array", items: { type: "string" }, description: "Providências que a pessoa disse que já tomou (ex.: 'Reclamou no consumidor.gov.br'). Vazio se nenhuma." },
        assuntos: {
          type: "array", description: "Até 3 ids do catálogo que se relacionam com o relato, do mais central ao menos. Só ids existentes.",
          items: { type: "object", properties: { id: { type: "string" }, motivo: { type: "string", description: "Uma frase: qual parte do relato liga a este assunto." } }, required: ["id", "motivo"] },
        },
        faltando: { type: "array", items: { type: "string" }, description: "Até 3 informações que NÃO aparecem no relato e que a advogada provavelmente vai precisar (perguntas curtas)." },
      },
      required: ["fatos", "ja_tentou", "assuntos", "faltando"],
    },
  },
  relacionar: {
    name: "relacionar_trechos",
    description: "Aponta quais trechos do conteúdo revisado se relacionam com o relato.",
    input_schema: {
      type: "object",
      properties: {
        trechos: {
          type: "array", description: "Até 6 trechos mais ligados ao relato, do mais ao menos relevante.",
          items: { type: "object", properties: { ref: { type: "string", description: "A referência exata do trecho, ex.: 'lei.2'." }, ligacao: { type: "string", description: "Uma frase ligando o fato contado ao tema do trecho, sem concluir o resultado." } }, required: ["ref", "ligacao"] },
        },
        ja_feitos: { type: "array", items: { type: "string" }, description: "Referências 'passos.N' que a pessoa já disse ter feito." },
      },
      required: ["trechos", "ja_feitos"],
    },
  },
};

const curto = (s, n) => String(s || "").slice(0, n);

export default async (req) => {
  if (req.method !== "POST") return Response.json({ erro: "Use POST." }, { status: 405 });
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) return Response.json({ erro: "Análise indisponível." }, { status: 503 });
  let e; try { e = await req.json(); } catch { return Response.json({ erro: "JSON inválido." }, { status: 400 }); }
  const relato = curto(e.relato, 4000).trim();
  if (relato.length < 20) return Response.json({ erro: "Relato curto demais." }, { status: 400 });
  const ferramenta = FERRAMENTAS[e.modo];
  if (!ferramenta) return Response.json({ erro: "Modo inválido." }, { status: 400 });

  let conteudo;
  if (e.modo === "triagem") {
    const cat = (Array.isArray(e.catalogo) ? e.catalogo : []).slice(0, 250).map((c) => `${curto(c.id, 60)} — ${curto(c.titulo, 160)}`).join("\n");
    conteudo = `Catálogo de assuntos do portal (id — título):\n${cat}\n\nRelato do visitante:\n"""${relato}"""`;
  } else {
    const t = (Array.isArray(e.trechos) ? e.trechos : []).slice(0, 80).map((x) => `[${curto(x.ref, 20)}] ${curto(x.texto, 600)}`).join("\n");
    conteudo = `Assunto: ${curto(e.titulo, 160)}\nConteúdo revisado do portal, em trechos:\n${t}\n\nRelato do visitante:\n"""${relato}"""`;
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": chave, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODELO, max_tokens: 1500, system: REGRAS, tools: [ferramenta], tool_choice: { type: "tool", name: ferramenta.name }, messages: [{ role: "user", content: conteudo }] }),
    });
    if (!r.ok) return Response.json({ erro: "Análise indisponível no momento." }, { status: 502 });
    const d = await r.json();
    const uso = (d.content || []).find((c) => c.type === "tool_use");
    if (!uso) return Response.json({ erro: "Sem resultado." }, { status: 502 });
    return Response.json(uso.input, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ erro: "Análise indisponível no momento." }, { status: 502 });
  }
};

export const config = { path: "/api/analisar" };
