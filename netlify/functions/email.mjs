// Envio de e-mail pelo painel (Resend). Só quem entrou no painel (titular ou associado) consegue usar.
// Variáveis no Netlify: RESEND_API_KEY (obrigatória), EMAIL_REMETENTE (ex.: "Fernanda Oliveira <contato@plataformadodireito.com.br>"),
// EMAIL_RESPOSTA (e-mail que recebe as respostas dos clientes). Nada é guardado aqui.
const SB_URL = "https://apgrgbotrrhtxfhcjsgq.supabase.co";
const SB_KEY = "sb_publishable_DmfEqquL-n4VPBaTpbPumw_sSC6gmnW"; // chave pública; as regras ficam no banco
const ORIGENS = [/^https:\/\/(www\.)?plataformadodireito\.com\.br$/, /^https:\/\/[\w-]+(--[\w-]+)?\.netlify\.app$/, /^http:\/\/localhost(:\d+)?$/];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const emailOk = (e) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(e);

export default async (req) => {
  if (req.method !== "POST") return Response.json({ erro: "Use POST." }, { status: 405 });
  const origem = req.headers.get("origin") || "";
  if (origem && !ORIGENS.some((re) => re.test(origem))) return Response.json({ erro: "Origem não permitida." }, { status: 403 });
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ erro: "Entre no painel primeiro." }, { status: 401 });
  const p = await fetch(`${SB_URL}/rest/v1/rpc/meu_papel`, { method: "POST", headers: { apikey: SB_KEY, authorization: `Bearer ${token}`, "content-type": "application/json" }, body: "{}" });
  const papel = p.ok ? await p.json() : null;
  if (papel !== "titular" && papel !== "associado") return Response.json({ erro: "Sem permissão." }, { status: 401 });

  const chave = process.env.RESEND_API_KEY;
  if (!chave) return Response.json({ erro: "O envio de e-mail ainda não foi ligado: falta a chave do Resend no Netlify (RESEND_API_KEY)." }, { status: 503 });
  let e; try { e = await req.json(); } catch { return Response.json({ erro: "Pedido inválido." }, { status: 400 }); }
  const para = String(e.para || "").trim(), assunto = String(e.assunto || "").trim().slice(0, 200), texto = String(e.texto || "").trim().slice(0, 20000);
  if (!emailOk(para)) return Response.json({ erro: "E-mail do destinatário inválido." }, { status: 400 });
  if (!assunto || !texto) return Response.json({ erro: "Preencha o assunto e a mensagem." }, { status: 400 });

  const remetente = process.env.EMAIL_REMETENTE || "Plataforma do Direito <contato@plataformadodireito.com.br>";
  const resposta = process.env.EMAIL_RESPOSTA || undefined;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#16224a;max-width:620px">${esc(texto).replace(/\n/g, "<br>")}</div>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: remetente, to: [para], subject: assunto, text: texto, html, ...(resposta ? { reply_to: resposta } : {}) }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return Response.json({ erro: d.message || `O Resend recusou (${r.status}).` }, { status: 502 });
    return Response.json({ ok: true, id: d.id });
  } catch {
    return Response.json({ erro: "Não foi possível enviar agora." }, { status: 502 });
  }
};

export const config = { path: "/api/email" };
