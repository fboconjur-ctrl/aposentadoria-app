// Consulta pública ao DJEN (Comunica PJe / CNJ). Repassa só parâmetros permitidos,
// para não virar um proxy aberto. Os dados do DJEN são públicos.
const API = "https://comunicaapi.pje.jus.br/api/v1/comunicacao";
const PERMITIDOS = ["numeroOab", "ufOab", "numeroProcesso", "dataDisponibilizacaoInicio", "dataDisponibilizacaoFim", "pagina", "itensPorPagina"];
const OK = { numeroOab: /^\d{1,7}$/, ufOab: /^[A-Za-z]{2}$/, numeroProcesso: /^\d{20}$/, dataDisponibilizacaoInicio: /^\d{4}-\d{2}-\d{2}$/, dataDisponibilizacaoFim: /^\d{4}-\d{2}-\d{2}$/, pagina: /^\d{1,3}$/, itensPorPagina: /^\d{1,3}$/ };

export default async (req) => {
  const entrada = new URL(req.url).searchParams;
  const saida = new URLSearchParams();
  for (const k of PERMITIDOS) {
    const v = entrada.get(k);
    if (v == null || v === "") continue;
    if (!OK[k].test(v)) return Response.json({ erro: `Parâmetro inválido: ${k}` }, { status: 400 });
    saida.set(k, v);
  }
  if (!saida.get("numeroOab") && !saida.get("numeroProcesso")) return Response.json({ erro: "Informe a OAB ou o número do processo." }, { status: 400 });
  try {
    const r = await fetch(`${API}?${saida}`, { headers: { Accept: "application/json", "User-Agent": "PlataformaDoDireito/1.0" } });
    const corpo = await r.text();
    return new Response(corpo, { status: r.status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json({ erro: "DJEN indisponível no momento.", detalhe: String(e) }, { status: 502 });
  }
};

export const config = { path: "/api/djen" };
