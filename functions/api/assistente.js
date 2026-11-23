// Cloudflare Pages Function: reaproveita a função original da Netlify (mesmo código, mesma rota).
import handler from "../../netlify/edge-functions/assistente.js";
export async function onRequest({ request, env }) {
  globalThis.process = { env };
  globalThis.Netlify = { env: { get: (k) => env[k] } };
  return handler(request);
}
