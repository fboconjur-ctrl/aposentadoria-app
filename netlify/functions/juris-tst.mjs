// Pesquisa de jurisprudência do TST trazida para dentro do painel.
// Usa a mesma pesquisa pública do site jurisprudencia.tst.jus.br (dados públicos) e devolve
// só o necessário: número, turma, relator, datas, ementa e dispositivo. Nada é guardado aqui.
const API = "https://jurisprudencia-backend.tst.jus.br/rest/pesquisa-textual";
const ORIGENS = [/^https:\/\/(www\.)?plataformadodireito\.com\.br$/, /^https:\/\/[\w-]+(--[\w-]+)?\.netlify\.app$/, /^http:\/\/localhost(:\d+)?$/];
const limpa = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const titulo = (s) => String(s || "").replace(/\b\w/g, (c) => c.toUpperCase());

export default async (req) => {
  if (req.method !== "POST") return Response.json({ erro: "Use POST." }, { status: 405 });
  const origem = req.headers.get("origin") || "";
  if (origem && !ORIGENS.some((re) => re.test(origem))) return Response.json({ erro: "Origem não permitida." }, { status: 403 });
  let e; try { e = await req.json(); } catch { return Response.json({ erro: "Pedido inválido." }, { status: 400 }); }
  const termos = String(e.termos || "").trim().slice(0, 300);
  if (termos.length < 4) return Response.json({ erro: "Digite as palavras da busca." }, { status: 400 });
  const pagina = Math.max(1, Math.min(20, +e.pagina || 1)), qtd = 10;
  const corpo = { ementa: termos, tipos: ["ACORDAO"], orgao: "TST", ordenacao: "relevancia" };
  if (e.excluir) corpo.naoContem = String(e.excluir).slice(0, 200);
  try {
    const r = await fetch(`${API}/${(pagina - 1) * qtd + 1}/${qtd}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(corpo) });
    if (!r.ok) return Response.json({ erro: `O TST respondeu ${r.status}. Tente de novo em instantes.` }, { status: 502 });
    const d = await r.json();
    const itens = (d.registros || []).map(({ registro: x }) => {
      const disp = limpa(x.dispositivo);
      const resultado = /dar(-lhe)? provimento|dou provimento|conhecer do recurso.{0,80}e,? no m[ée]rito, dar|provido/i.test(disp) && !/negar(-lhe)? provimento/i.test(disp) ? "provido"
        : /negar(-lhe)? provimento|n[ãa]o conhecer|desprovido|rejeitar/i.test(disp) ? "não provido" : "";
      return {
        id: x.id, trib: "TST", num: x.numFormatado || "", turma: x.orgaoJudicante?.descricao || "", rel: titulo(x.nomRelator),
        data: x.dtaJulgamento || "", pub: x.dtaPublicacao || "", ementa: limpa(x.ementa), dispositivo: disp.slice(0, 900), resultado,
      };
    });
    return Response.json({ total: d.totalRegistros || 0, pagina, itens }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ erro: "Não foi possível consultar o TST agora." }, { status: 502 });
  }
};

export const config = { path: "/api/juris-tst" };
