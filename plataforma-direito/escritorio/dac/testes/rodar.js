// Regressões do motor DAC. Uso: node testes/rodar.js  (requer playwright)
// Roda: bateria interna (runRealityTests), NFV2 3.1 (30 casos) e NFV2 3.2 (multidomínio) + os P0 da auditoria.
const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path");
const motor = "file://" + path.resolve(__dirname, "../motor.html");
const e2e = JSON.parse(fs.readFileSync(path.join(__dirname, "corpus_e2e_v3_1.json")));
const multi = JSON.parse(fs.readFileSync(path.join(__dirname, "corpus_multidominio_v3_2.json")));
const dominios = JSON.parse(fs.readFileSync(path.join(__dirname, "casos_dominios.json")));
const P0 = [
  { text: "Talvez tenha havido dolo do gestor, o que ainda será apurado.", concept: "DOLO", nfv2: "UNKNOWN" },
  { text: "Servidor foi demitido em PAD sem que lhe fosse oferecido prazo para defesa.", concept: "CONTRADITORIO_OBSERVADO", nfv2: "FALSE" },
  { text: "Fui demitido sem que me fosse oferecido prazo para defesa.", concept: "CONTRADITORIO_OBSERVADO", nfv2: "FALSE" },
  { text: "O servidor foi intimado e apresentou defesa no PAD.", concept: "CONTRADITORIO_OBSERVADO", nfv2: "TRUE" },
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const erros = []; p.on("pageerror", (e) => erros.push(e.message));
  await p.goto(motor); await p.waitForTimeout(1200);
  const r = await p.evaluate(({ e2e, multi, P0 }) => {
    const g = (v) => (v === true ? "TRUE" : v === false ? "FALSE" : String(v));
    const um = (cs) => cs.map((c) => { const F = extractCanonicalFacts(c.text); const got = g(F[c.concept] ? F[c.concept].value : "UNKNOWN"); return got === c.nfv2 ? null : `${c.id || ""} ${c.text} → ${got} (esperado ${c.nfv2})`; }).filter(Boolean);
    const mf = []; multi.forEach((c) => { const F = extractCanonicalFacts(c.text); Object.entries(c.facts).forEach(([k, e]) => { const got = g(F[k] ? F[k].value : "UNKNOWN"); if (got !== e) mf.push(`${c.id} ${k} → ${got} (esperado ${e})`); }); });
    const rt = runRealityTests().filter((t) => !t.pass).map((t) => `${t.id} ${t.text}`);
    return { bateria: rt, e2e: um(e2e), p0: um(P0), multidominio: mf };
  }, { e2e, multi, P0 });
  // Cobertura: cada um dos 28 domínios precisa chegar a ao menos uma regra executável num caso típico.
  // Fronteira: a mesma história como alegação ou hipótese não pode gerar fato pela ponte (v13.8).
  const extra = await p.evaluate((dominios) => {
    const run = (t) => { document.getElementById("caseText").value = t; engineAnalyzeCore(); return LAST; };
    const cobertura = [], fronteira = [];
    for (const c of dominios) {
      if (!run(c.t).rules.some((r) => r.finalState === "EXECUTABLE")) cobertura.push(c.d);
      for (const pref of ["A denúncia alega que ", "Talvez "]) {
        const L = run(pref + c.t.charAt(0).toLowerCase() + c.t.slice(1));
        const v = L.rules.filter((r) => r.finalState === "EXECUTABLE").flatMap((r) => r.execution.required.concat(r.execution.any).filter((x) => x.status === "PASS" && x.fact && /PONTE_V138|PONTE_LEXICAL/.test(x.fact.source) && !/NAO_FIRME/.test(x.fact.source)).map((x) => `${c.d} ${pref.trim()} ${x.predicate.raw}`));
        fronteira.push(...v);
      }
    }
    return { cobertura_28_dominios: cobertura, fronteira_alegacao_hipotese: fronteira };
  }, dominios);
  Object.assign(r, extra);
  let falhas = 0; for (const [k, v] of Object.entries(r)) { falhas += v.length; console.log(`${v.length ? "✗" : "✓"} ${k}${v.length ? ": " + v.join(" | ") : ""}`); }
  if (erros.length) { falhas++; console.log("✗ erros no console:", erros); }
  await b.close(); process.exit(falhas ? 1 : 0);
})();
