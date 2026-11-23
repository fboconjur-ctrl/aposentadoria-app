// Gera uma página HTML estática por situação (para o Google e para quem abre sem JavaScript):
// dist/plataforma-direito/s/<id>/index.html e um sitemap com todas elas.
// Uso: node scripts/gerar-paginas.js <pasta-dist>
const fs = require("fs"), path = require("path");
const RAIZ = path.join(__dirname, ".."), PD = path.join(RAIZ, "plataforma-direito"), DIST = process.argv[2] || path.join(RAIZ, "dist");
const SITE = "https://plataformadodireito.com.br";
global.window = {};
const ler = (f) => fs.readFileSync(path.join(PD, f), "utf8").replace(/^const /gm, "var ");
eval(["faq.js", "faq-areas.js", "faq-lote2.js", "faq-lote3.js", "roteiros.js", "duvidas-casos.js", "roteiros-novos.js", "roteiros-adm.js", "roteiros-cartorio.js"].map(ler).join("\n"));
const app = fs.readFileSync(path.join(PD, "app.js"), "utf8");
const WA = (app.match(/WA_NUMERO = "(\d+)"/) || [])[1];
const titulos = {};
for (const m of app.matchAll(/\["([^"]+)", "([a-z0-9-]+)"\]/g)) if (!titulos[m[2]]) titulos[m[2]] = m[1].replace(/\s*→$/, "");
(typeof FAQ !== "undefined" ? FAQ : []).forEach((f) => { if (!titulos[f.id]) titulos[f.id] = f.q; });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pub = (l) => (l || []).filter((x) => !/\[CONFERIR\]|\[PREENCHER\]/.test(x));
const lista = (t, l, tag = "ul") => pub(l).length ? `<h2>${t}</h2><${tag}>${pub(l).map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>` : "";

const urls = [`${SITE}/plataforma-direito/`, `${SITE}/plataforma-direito/privacidade/`];
let n = 0;
for (const [id, R] of Object.entries(ROTEIROS)) {
  const tit = titulos[id]; if (!tit) continue;
  const duv = (DUVIDAS_CASOS[id] || []).filter(([q, a]) => !/\[CONFERIR\]/.test(a));
  const desc = (R.acolhe || "").slice(0, 155);
  const ld = duv.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: duv.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }).replace(/</g, "\\u003c")}</script>` : "";
  const url = `${SITE}/plataforma-direito/s/${id}/`;
  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(tit)} · Plataforma do Direito</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(tit)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/compartilhar.png">
<link rel="icon" href="/favicon.svg">
<style>
:root{--azul:#2340b8;--tinta:#16224a;--fundo:#f6f7fb}
body{margin:0;background:var(--fundo);color:var(--tinta);font:17px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
main{max-width:760px;margin:0 auto;padding:20px 16px 90px}
a{color:var(--azul)} header a{font-weight:700;text-decoration:none}
h1{font-size:1.9rem;line-height:1.2;margin:18px 0 8px} h2{font-size:1.2rem;margin:28px 0 8px}
.lead{font-size:1.1rem;color:#3b4670} li{margin:6px 0}
.cta{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}
.btn{display:inline-block;padding:12px 18px;border-radius:12px;background:var(--azul);color:#fff;text-decoration:none;font-weight:700}
.btn.wa{background:#1fa855}
details{background:#fff;border:1px solid #e3e7f5;border-radius:12px;padding:10px 14px;margin:8px 0} summary{cursor:pointer;font-weight:600}
.aviso{font-size:.9rem;color:#667;margin-top:30px}
.barra{position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;padding:10px 16px;background:#fff;border-top:1px solid #e3e7f5}
.barra a{flex:1;text-align:center}
</style>${ld}</head>
<body><main>
<header><a href="/plataforma-direito/">§ Plataforma do Direito</a></header>
<h1>${esc(tit)}</h1>
<p class="lead">${esc(R.acolhe || "")}</p>
<div class="cta"><a class="btn" href="/plataforma-direito/?s=${id}">Ver a versão completa, com ferramentas</a>${WA ? `<a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Vim pelo site. Assunto: ${tit}.`)}">Falar com a advogada</a>` : ""}</div>
${lista("Procure a advogada logo se", R.urgente)}
${lista("O que fazer agora", R.passos, "ol")}
${R.explica ? lista("Entenda melhor", R.explica.itens, "ol") : ""}
${lista("Prazos", R.prazos)}
${lista("Documentos para separar", R.docs)}
${lista("O que diz a lei", R.lei)}
${lista("Como os tribunais têm decidido", R.juris)}
${duv.length ? `<h2>Dúvidas comuns</h2>${duv.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}` : ""}
${R.fontes?.length ? `<h2>Fontes oficiais</h2><ul>${R.fontes.map(([nm, u]) => `<li><a href="${esc(u)}" rel="noopener" target="_blank">${esc(nm)}</a></li>`).join("")}</ul>` : ""}
<p class="aviso">Informação geral com base na lei e na jurisprudência. Não constitui orientação jurídica nem substitui a análise do seu caso pela advogada.</p>
</main>
<div class="barra"><a class="btn" href="/plataforma-direito/?s=${id}">Versão completa</a>${WA ? `<a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Vim pelo site. Assunto: ${tit}.`)}">WhatsApp</a>` : ""}</div>
</body></html>`;
  const dir = path.join(DIST, "plataforma-direito", "s", id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  urls.push(url); n++;
}
fs.writeFileSync(path.join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`${n} páginas de situação geradas`);
