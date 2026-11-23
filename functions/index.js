// Raiz do site na Cloudflare Pages.
// GET  / → leva para a Plataforma do Direito (como o redirecionamento 301 da Netlify).
// POST / → recebe os formulários do site ("contato-advogado" e "interesse-empresas"), que na Netlify
//          eram recebidos pelo Netlify Forms. O pedido completo já chega ao painel pelo Supabase;
//          aqui só confirmamos o recebimento e, se configurado, avisamos a advogada por e-mail (Resend).
// Variáveis opcionais: RESEND_API_KEY, EMAIL_AVISO (quem recebe o aviso), EMAIL_REMETENTE.
export const onRequestGet = ({ request }) => Response.redirect(new URL("/plataforma-direito/", request.url).toString(), 301);

const NOMES = { "contato-advogado": "Novo contato pelo site", "interesse-empresas": "Novo interesse de empresa ou gestor" };
const OCULTOS = new Set(["form-name", "pacote", "empresa-site", "bot-field"]);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export async function onRequestPost({ request, env }) {
  let dados;
  try { dados = await request.formData(); } catch { return new Response("Pedido inválido.", { status: 400 }); }
  const formulario = String(dados.get("form-name") || "");
  if (!NOMES[formulario]) return new Response("Formulário desconhecido.", { status: 400 });
  if (String(dados.get("empresa-site") || "").trim()) return new Response("OK"); // armadilha anti-robô preenchida

  if (env.RESEND_API_KEY && env.EMAIL_AVISO) {
    const linhas = [];
    for (const [campo, valor] of dados.entries()) {
      if (OCULTOS.has(campo) || typeof valor !== "string" || !valor.trim()) continue;
      linhas.push(`${campo}: ${valor.trim().slice(0, 2000)}`);
    }
    const protocolo = String(dados.get("protocolo") || "");
    const texto = `${NOMES[formulario]}\n\n${linhas.join("\n")}\n\nO pedido completo está no painel do escritório.`;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.EMAIL_REMETENTE || "Plataforma do Direito <contato@plataformadodireito.com.br>",
        to: [env.EMAIL_AVISO], subject: `${NOMES[formulario]}${protocolo ? ` (${protocolo})` : ""}`, text: texto,
        html: `<pre style="font-family:Arial,Helvetica,sans-serif;font-size:15px;white-space:pre-wrap">${esc(texto)}</pre>`,
      }),
    }).catch(() => null);
  }
  return new Response("OK");
}
