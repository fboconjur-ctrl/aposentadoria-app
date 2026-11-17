// Troca o "code" do login do Instagram por um token e devolve as postagens do usuário.
// Variáveis na Netlify: IG_CLIENT_ID, IG_CLIENT_SECRET.
export default async (req) => {
  const { code, redirect } = await req.json().catch(() => ({}));
  if (!code || !redirect) return Response.json({ error: 'Faltou o código de login.' }, { status: 400 });

  const form = new URLSearchParams({
    client_id: process.env.IG_CLIENT_ID,
    client_secret: process.env.IG_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: redirect,
    code,
  });
  const tok = await fetch('https://api.instagram.com/oauth/access_token', { method: 'POST', body: form }).then(r => r.json());
  if (!tok.access_token) return Response.json({ error: tok.error_message || 'Login recusado pelo Instagram.' }, { status: 401 });

  const fields = 'id,caption,media_type,media_url,timestamp,children{media_type,media_url}';
  let url = `https://graph.instagram.com/me/media?fields=${fields}&limit=100&access_token=${tok.access_token}`;
  const user = await fetch(`https://graph.instagram.com/me?fields=username&access_token=${tok.access_token}`).then(r => r.json());
  const posts = [];
  while (url) {
    const page = await fetch(url).then(r => r.json());
    for (const m of page.data || []) {
      const photo = m.media_type === 'IMAGE' ? m.media_url
        : m.media_type === 'CAROUSEL_ALBUM' ? (m.children?.data || []).find(c => c.media_type === 'IMAGE')?.media_url
        : null;
      if (photo) posts.push({ url: photo, caption: m.caption || '', timestamp: m.timestamp });
    }
    url = page.paging?.next;
  }
  return Response.json({ username: user.username, posts });
};
