// Testes do motor de prazos. Uso: node plataforma-direito/ferramentas/testar-prazos.js
const P = require("../prazos-calc.js");
const casos = [
  // [descrição, opções, vencimento esperado]
  ["Embargos 5 dias úteis, publicação 25/11/2026, DF (pula 30/11 Dia do Evangélico)", { marco: "2026-11-25", tipoMarco: "publicacao", dias: 5, uf: "DF" }, "2026-12-03"],
  ["Mesmo prazo sem feriado estadual", { marco: "2026-11-25", tipoMarco: "publicacao", dias: 5 }, "2026-12-02"],
  ["SP: 09/07 não conta", { marco: "2026-07-07", tipoMarco: "publicacao", dias: 2, uf: "SP" }, "2026-07-10"],
  ["Contestação 15 dias em dobro atravessa o recesso e o Carnaval de 2027", { marco: "2026-12-10", tipoMarco: "intimacao", dias: 15, dobro: true }, "2027-02-26"],
];
let falhas = 0;
for (const [d, o, esp] of casos) {
  const r = P.calcular({ contagem: "uteis", ...o });
  const ok = r.vencimento === esp; if (!ok) falhas++;
  console.log(`${ok ? "ok  " : "FALHOU"} ${d}: ${r.vencimento}${ok ? "" : ` (esperado ${esp})`}`);
}
const a = P.alertas("2026-12-03", { uf: "DF" });
const okA = JSON.stringify(a) === JSON.stringify([[5, "2026-11-25"], [3, "2026-11-27"], [1, "2026-12-02"]]); if (!okA) falhas++;
console.log(`${okA ? "ok  " : "FALHOU"} Avisos D-5/D-3/D-1 pulam fim de semana e feriado: ${JSON.stringify(a)}`);
process.exit(falhas ? 1 : 0);
