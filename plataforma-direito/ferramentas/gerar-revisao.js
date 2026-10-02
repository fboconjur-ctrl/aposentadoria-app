// Gera conteudo/REVISAO.md a partir das respostas da plataforma (fonte única).
// Uso: node plataforma-direito/ferramentas/gerar-revisao.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "..");
const ctx = { console, Date, Math, URLSearchParams };
vm.createContext(ctx);
for (const f of ["flows.js", "faq.js", "faq-areas.js", "faq-lote2.js", "faq-lote3.js", "continuacoes.js", "atlas.js"]) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
const { FAQ, ATLAS } = vm.runInContext("({ FAQ, ATLAS })", ctx);
const AREAS = { previdenciario: "Previdenciário", saude: "Saúde", consumidor: "Consumidor", administrativo: "Administrativo", cartorio: "Cartório e Extrajudicial" };
let out = `# Revisão das respostas da Plataforma do Direito\n\nGerado automaticamente em ${new Date().toLocaleDateString("pt-BR")} a partir do código (${FAQ.length} respostas). Não edite este arquivo: anote as correções e elas serão aplicadas no código.\n\n**Como revisar:** em cada resposta, marque **✅ ok**, **✏️ corrigir** (escreva a correção logo abaixo) ou **❌ remover**. Trechos com [VALIDAR] são os de menor segurança.\n\n`;
const missing = FAQ.filter((f) => !ATLAS[f.id]).map((f) => f.id);
if (missing.length) out += `> Atenção: respostas sem código do Atlas: ${missing.join(", ")}\n\n`;
for (const [key, name] of Object.entries(AREAS)) {
  const list = FAQ.filter((f) => f.area === key);
  out += `---\n\n## ${name} (${list.length})\n\n`;
  list.forEach((f, i) => {
    out += `### ${i + 1}. ${f.q}\n\n\`${f.id}\` · Atlas \`${ATLAS[f.id] || "—"}\`${f.followUp ? ` · continuação: _${f.followUp.title}_` : ""}\n\n`;
    f.a.forEach((p) => (out += `${p}\n\n`));
    if (f.table) out += f.table.rows.map((r) => `- ${r.join(" · ")}`).join("\n") + `\n\n_${f.table.note}_\n\n`;
    if (f.tips) out += `**Dicas:**\n${f.tips.map((t) => `- ${t}`).join("\n")}\n\n`;
    out += `**Fontes:** ${f.sources.map((s) => s[0]).join(" · ")}\n\n**Revisão:** ☐ ✅ ok ☐ ✏️ corrigir ☐ ❌ remover\n\n`;
  });
}
fs.writeFileSync(path.join(dir, "conteudo", "REVISAO.md"), out);
console.log(`REVISAO.md: ${FAQ.length} respostas; sem código Atlas: ${missing.length}`);
