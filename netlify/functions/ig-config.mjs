// Entrega ao navegador o ID público do app Meta (nunca o segredo).
export default async () =>
  Response.json({ clientId: process.env.IG_CLIENT_ID || null });
