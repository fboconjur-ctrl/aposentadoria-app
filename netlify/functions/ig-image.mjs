// Repassa a imagem do CDN do Instagram com o mesmo domínio do site,
// para o navegador poder desenhá-la no canvas e gerar o PDF.
const ALLOWED = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/;
export default async (req) => {
  const target = new URL(req.url).searchParams.get('u');
  let host;
  try { host = new URL(target).hostname; } catch { return new Response('URL inválida', { status: 400 }); }
  if (!ALLOWED.test(host)) return new Response('Domínio não permitido', { status: 403 });
  const r = await fetch(target);
  return new Response(r.body, {
    status: r.status,
    headers: { 'content-type': r.headers.get('content-type') || 'image/jpeg', 'cache-control': 'public, max-age=86400' },
  });
};

export const config = { path: "/api/ig-image" };
