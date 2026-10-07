// Consulta pública ao DataJud (CNJ): movimentações de um processo pelo número.
// Só aceita o alias do tribunal e um número CNJ de 20 dígitos (não é proxy aberto).
// A chave abaixo é a chave PÚBLICA divulgada pelo CNJ na wiki do DataJud.
const CHAVE = "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";

export default async (req) => {
  const q = new URL(req.url).searchParams;
  const alias = q.get("tribunal") || "", numero = q.get("numero") || "";
  if (!/^[a-z0-9-]{2,8}$/.test(alias) || !/^\d{20}$/.test(numero)) return Response.json({ erro: "Parâmetros inválidos." }, { status: 400 });
  try {
    const r = await fetch(`https://api-publica.datajud.cnj.jus.br/api_publica_${alias}/_search`, {
      method: "POST", headers: { Authorization: CHAVE, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { match: { numeroProcesso: numero } }, size: 5 }),
    });
    return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ erro: "DataJud indisponível no momento.", detalhe: String(e) }, { status: 502 });
  }
};

export const config = { path: "/api/datajud" };
