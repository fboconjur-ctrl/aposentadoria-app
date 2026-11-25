// Gera uma página HTML estática por situação (para o Google e para quem abre sem JavaScript):
// dist/plataforma-direito/s/<id>/index.html e um sitemap com todas elas.
// Uso: node scripts/gerar-paginas.js <pasta-dist>
const fs = require("fs"), path = require("path");
const RAIZ = path.join(__dirname, ".."), PD = path.join(RAIZ, "plataforma-direito"), DIST = process.argv[2] || path.join(RAIZ, "dist");
const SITE = "https://plataformadodireito.com.br";
global.window = {};
const ler = (f) => fs.readFileSync(path.join(PD, f), "utf8").replace(/^const /gm, "var ");
eval(["faq.js", "faq-areas.js", "faq-lote2.js", "faq-lote3.js", "roteiros.js", "duvidas-casos.js", "roteiros-novos.js", "roteiros-adm.js", "roteiros-cartorio.js", "roteiros-tea.js", "revisao-adm-site.js", "roteiros-contas.js"].map(ler).join("\n"));
const app = fs.readFileSync(path.join(PD, "app.js"), "utf8");
const WA = (app.match(/WA_NUMERO = "(\d+)"/) || [])[1];
const titulos = {};
for (const m of app.matchAll(/\["([^"]+)", "([a-z0-9-]+)"\]/g)) if (!titulos[m[2]]) titulos[m[2]] = m[1].replace(/\s*→$/, "");
(typeof FAQ !== "undefined" ? FAQ : []).forEach((f) => { if (!titulos[f.id]) titulos[f.id] = f.q; });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pub = (l) => (l || []).filter((x) => !/\[CONFERIR\]|\[PREENCHER\]/.test(x));
const lista = (t, l, tag = "ul") => pub(l).length ? `<h2>${t}</h2><${tag}>${pub(l).map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>` : "";

// Temas (para o índice de artigos), lidos do objeto SITUACOES do app.
const sitTxt = app.slice(app.indexOf("const SITUACOES = {"), app.indexOf("const OUTRA"));
eval(sitTxt.replace("const SITUACOES", "var SITUACOES"));
const PAI = { dividas: "consumidor", servicos: "consumidor", imovel: "cartorio", registro: "cartorio", servidor: "administrativo", autismo: "saude", concurso: "administrativo", licitacao: "administrativo", multas: "administrativo" };
const NOME_TEMA = { administrativo: "Servidor público, concurso e órgãos públicos", previdenciario: "INSS e aposentadoria", saude: "Saúde: planos e SUS", consumidor: "Consumidor, bancos e serviços", cartorio: "Cartório, família e herança", familia: "Família", trabalhista: "Trabalho", moradia: "Aluguel e condomínio", outros: "Outros temas" };
const temaDe = {};
for (const [k, l] of Object.entries(SITUACOES)) l.forEach(([, id]) => { if (!temaDe[id]) temaDe[id] = PAI[k] || k; });
(typeof FAQ !== "undefined" ? FAQ : []).forEach((f) => { if (!temaDe[f.id] && f.area) temaDe[f.id] = PAI[f.area] || f.area; });

const MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const hoje = new Date(), ISO = hoje.toISOString().slice(0, 10), DATA = `${MES[hoje.getMonth()]} de ${hoje.getFullYear()}`;
const paras = (l) => pub(l).map((x) => `<p>${esc(x)}</p>`).join("");
const sec = (t, intro, corpo) => corpo ? `<h2>${t}</h2>${intro ? `<p>${intro}</p>` : ""}${corpo}` : "";
const ul = (l, tag = "ul") => pub(l).length ? `<${tag}>${pub(l).map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>` : "";
const CSS = `:root{--azul:#5f7d6b;--tinta:#2e2e2e;--suave:#7c766d;--fundo:#faf7f2;--linha:#e8dfd3}
*{box-sizing:border-box}body{margin:0;background:var(--fundo);color:var(--tinta);font:18px/1.75 Georgia,"Iowan Old Style","Times New Roman",serif}
.topo{border-bottom:1px solid var(--linha);background:#fff}.topo div{max-width:720px;margin:0 auto;padding:14px 18px;display:flex;justify-content:space-between;gap:12px;font:600 15px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.topo a{color:var(--tinta);text-decoration:none}
main{max-width:720px;margin:0 auto;padding:28px 18px 110px}
.cat{font:700 13px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--azul)}
h1{font:300 2.3rem/1.18 Fraunces,Georgia,serif;margin:12px 0 14px;letter-spacing:-.01em}
.meta{font:14px/1.5 system-ui,sans-serif;color:var(--suave);border-bottom:1px solid var(--linha);padding-bottom:16px;margin-bottom:22px}
.linha-fina{font-size:1.2rem;color:#36406a;font-style:italic}
h2{font:400 1.45rem/1.3 Fraunces,Georgia,serif;margin:38px 0 10px}
h3{font:700 1.05rem/1.4 system-ui,sans-serif;margin:22px 0 4px}
li{margin:8px 0}a{color:var(--azul)}
.destaque{border-left:3px solid #b9895a;background:#f6ede1;padding:12px 16px;border-radius:0 10px 10px 0;margin:20px 0}
.destaque p{margin:4px 0}
.cta{font-family:system-ui,sans-serif;background:#fff;border:1px solid var(--linha);border-radius:16px;padding:20px;margin:36px 0}
.cta h2{margin-top:0}.btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.btn{display:inline-block;padding:12px 18px;border-radius:12px;background:var(--azul);color:#fff;text-decoration:none;font:700 15px/1.2 system-ui,sans-serif}
.btn.wa{background:#7a9483}
.fontes{font:15px/1.6 system-ui,sans-serif}
.aviso{font:14px/1.5 system-ui,sans-serif;color:var(--suave);border-top:1px solid var(--linha);padding-top:16px;margin-top:36px}
.barra{position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;padding:10px 16px;background:#fff;border-top:1px solid var(--linha)}.barra a{flex:1;text-align:center}
.lista-art a{display:block;padding:10px 0;border-bottom:1px solid var(--linha);text-decoration:none;font-family:system-ui,sans-serif}`;
const topo = `<header class="topo"><div><a href="/plataforma-direito/">§ Plataforma do Direito</a><a href="/plataforma-direito/s/">Artigos</a></div></header>`;
const cabeca = (tit, desc, url, extra = "") => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(tit)} · Plataforma do Direito</title>
<meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(tit)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/compartilhar.png">
<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap"><style>${CSS}</style>${extra}</head>`;

const urls = [`${SITE}/plataforma-direito/`, `${SITE}/plataforma-direito/privacidade/`, `${SITE}/plataforma-direito/s/`, `${SITE}/plataforma-direito/treinamentos/`, `${SITE}/plataforma-direito/cursos/`];
const indice = {};
let n = 0;
for (const [id, R] of Object.entries(ROTEIROS)) {
  const tit = titulos[id]; if (!tit) continue;
  const tema = temaDe[id] || "outros";
  const duv = (DUVIDAS_CASOS[id] || []).filter(([, a]) => !/\[CONFERIR\]/.test(a));
  const desc = (R.acolhe || "").slice(0, 155);
  const url = `${SITE}/plataforma-direito/s/${id}/`;
  const zap = WA ? `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Li o artigo "${tit}" no site e gostaria de falar sobre o meu caso.`)}` : "";
  const corpoTexto = [R.acolhe, ...(R.explica ? pub(R.explica.itens) : []), ...pub(R.lei), ...pub(R.juris), ...pub(R.passos), ...duv.flat()].join(" ");
  const minutos = Math.max(2, Math.round(corpoTexto.split(/\s+/).length / 200));
  const ld = [{ "@context": "https://schema.org", "@type": "Article", headline: tit, description: desc, dateModified: ISO, inLanguage: "pt-BR", mainEntityOfPage: url, publisher: { "@type": "Organization", name: "Plataforma do Direito", url: SITE } }];
  if (duv.length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: duv.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  const ldTag = ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, "\\u003c")}</script>`).join("");
  const prazo1 = pub(R.prazos)[0];
  const html = `${cabeca(tit, desc, url, ldTag)}
<body>${topo}<main><article>
<p class="cat">${esc(NOME_TEMA[tema] || NOME_TEMA.outros)}</p>
<h1>${esc(tit)}</h1>
<p class="meta">Plataforma do Direito · Atualizado em ${DATA} · Leitura de ${minutos} min</p>
<p class="linha-fina">${esc(R.acolhe || "")}</p>
${pub(R.urgente).length ? `<div class="destaque"><p><b>Procure orientação o quanto antes se:</b></p>${ul(R.urgente)}</div>` : ""}
${R.explica ? sec("Entenda a situação", "", paras(R.explica.itens)) : ""}
${sec("O que diz a lei", pub(R.lei).length ? "A legislação traz as regras principais sobre o tema:" : "", paras(R.lei))}
${sec("Como os tribunais têm decidido", pub(R.juris).length ? "Na prática, a interpretação dos tribunais também pesa:" : "", paras(R.juris))}
${prazo1 ? sec("Prazos importantes", "", `<div class="destaque">${paras(R.prazos)}</div>`) : ""}
${sec("O que fazer, passo a passo", pub(R.passos).length ? "Quem está nessa situação pode seguir este caminho:" : "", ul(R.passos, "ol"))}
${sec("Documentos para separar", pub(R.docs).length ? "Reúna o que tiver. Eles ajudam a entender o caso e a agir mais rápido:" : "", ul(R.docs))}
${duv.length ? `<h2>Perguntas frequentes</h2>${duv.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}` : ""}
<section class="cta"><h2>Cada caso tem detalhes que mudam tudo</h2><p>Este artigo explica as regras gerais. Para saber como elas se aplicam ao seu caso, converse com a advogada: ela analisa os seus documentos e explica, com clareza, os caminhos possíveis.</p>
<div class="btns">${zap ? `<a class="btn wa" href="${zap}">Falar com a advogada no WhatsApp</a>` : ""}<a class="btn" href="/plataforma-direito/?s=${id}">Usar as ferramentas desta situação</a></div></section>
${R.fontes?.length ? `<h2>Fontes oficiais</h2><ul class="fontes">${R.fontes.map(([nm, u]) => `<li><a href="${esc(u)}" rel="noopener" target="_blank">${esc(nm)}</a></li>`).join("")}</ul>` : ""}
<p class="aviso">Conteúdo informativo, com base na legislação e na jurisprudência. Não constitui orientação jurídica nem substitui a análise individual do caso. Regras de estados, DF e municípios podem variar.</p>
</article></main>
<div class="barra">${zap ? `<a class="btn wa" href="${zap}">WhatsApp</a>` : ""}<a class="btn" href="/plataforma-direito/?s=${id}">Ferramentas</a></div>
</body></html>`;
  const dir = path.join(DIST, "plataforma-direito", "s", id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  (indice[tema] ||= []).push([id, tit]);
  urls.push(url); n++;
}
// Índice de artigos por tema
const ordem = ["administrativo", "previdenciario", "saude", "consumidor", "cartorio", "familia", "trabalhista", "moradia", "outros"];
const idx = `${cabeca("Artigos", "Artigos em linguagem simples sobre servidor público, concurso, INSS, saúde, consumo, família, cartório e mais.", `${SITE}/plataforma-direito/s/`)}
<body>${topo}<main><p class="cat">Biblioteca</p><h1>Artigos</h1><p class="linha-fina">Seus direitos explicados em linguagem simples, com base na lei e nas decisões dos tribunais.</p>
${ordem.filter((t) => indice[t]).map((t) => `<h2>${esc(NOME_TEMA[t])}</h2><div class="lista-art">${indice[t].sort((a, b) => a[1].localeCompare(b[1], "pt")).map(([id, tt]) => `<a href="/plataforma-direito/s/${id}/">${esc(tt)}</a>`).join("")}</div>`).join("")}
</main></body></html>`;
fs.writeFileSync(path.join(DIST, "plataforma-direito", "s", "index.html"), idx);
fs.writeFileSync(path.join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`${n} artigos gerados`);
