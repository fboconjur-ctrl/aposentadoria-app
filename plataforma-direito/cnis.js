// Leitura do extrato CNIS no próprio navegador: o arquivo não é enviado a nenhum servidor.
// Resultado preliminar, para orientar a pessoa e preparar o dossiê. Não substitui a conferência profissional.

const CNIS_INDICATORS = {
  "PEXT": { label: "Vínculo informado fora do prazo (extemporâneo)", fix: "O INSS pode não contar esse período até você comprovar o vínculo. Separe carteira de trabalho, contracheques, termo de rescisão ou extrato do FGTS desse emprego." },
  "AEXT-VI": { label: "Vínculo extemporâneo já acertado", fix: "O período foi regularizado. Confira se as datas estão corretas." },
  "PREC-MENOR-MIN": { label: "Contribuição abaixo do salário mínimo", fix: "Esses meses podem não contar para tempo e carência. Em geral é possível complementar a contribuição." },
  "PSC-MEN-SM-EC103": { label: "Contribuição abaixo do mínimo após a Reforma", fix: "Depois de 13/11/2019, meses abaixo do mínimo só contam se forem complementados ou agrupados." },
  "IREM-INDPEND": { label: "Remunerações com pendência", fix: "Alguns salários do período estão com pendência. Confira holerites e, se necessário, peça acerto." },
  "PADM-EMPR": { label: "Data de admissão anterior à abertura da empresa", fix: "Pode ser erro de cadastro. Separe documentos com a data correta de admissão." },
  "PVIN-IRREG": { label: "Vínculo com irregularidade", fix: "O INSS marcou o vínculo como irregular. Será preciso comprovar o vínculo com documentos." },
  "PDT-NASC-FIL-INV": { label: "Problema na data de nascimento cadastrada", fix: "Atualize seus dados cadastrais no INSS." },
  "IEAN": { label: "Exposição a agente nocivo informada pela empresa", fix: "Indício de atividade especial. Peça o PPP dessa empresa: ele pode aumentar seu tempo ou permitir aposentadoria especial." },
  "PRPPS": { label: "Vínculo com regime próprio (serviço público)", fix: "Esse tempo pertence a um regime de servidor. Para somar ao INSS é preciso a Certidão de Tempo de Contribuição (CTC) do órgão." },
  "PREC-FACULTCONC": { label: "Recolhimento facultativo junto com outro vínculo", fix: "Contribuição facultativa no mesmo período de outro vínculo pode ser indevida. Vale análise." },
  "DECLARADO": { label: "Período incluído ou alterado por você no pedido", fix: "Esse período não estava igual no CNIS. O INSS vai exigir prova: carteira de trabalho, contrato, holerites ou guias pagas." },
  "PREM-EXT": { label: "Remuneração informada fora do prazo", fix: "Os salários desse período podem precisar de comprovação." },
};

const DATE_RE = /\b(\d{2})\/(\d{2})\/(\d{4})\b/g;
const MONTH_RE = /\b(\d{2})\/(\d{4})\b/g;

async function extractPdfText(file) {
  const pdfjs = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent();
    // Reconstrói as linhas pela posição vertical para preservar a tabela de vínculos.
    const lines = new Map();
    content.items.forEach((it) => {
      const y = Math.round(it.transform[5]);
      lines.set(y, (lines.get(y) || "") + " " + it.str);
    });
    pages.push([...lines.entries()].sort((a, b) => b[0] - a[0]).map(([, s]) => s.trim()).join("\n"));
  }
  return pages.join("\n");
}

function toDate(d, m, y) { return new Date(+y, +m - 1, +d); }
function monthsBetween(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + (b.getDate() >= a.getDate() ? 0 : -1) + 1; }
function fmtMonths(n) { const y = Math.floor(n / 12), m = n % 12; return [y && `${y} ano${y > 1 ? "s" : ""}`, m && `${m} ${m > 1 ? "meses" : "mês"}`].filter(Boolean).join(" e ") || "0 mês"; }
function fmtDate(d) { return d.toLocaleDateString("pt-BR"); }

// Formato "Relações Previdenciárias Declaradas pelo Requerente" (gerado no pedido de benefício do Meu INSS).
function parseDeclared(raw) {
  const HEADER = /^(Tipo de Regime|Relação Previdenciária\s+Período\s+Tipo de Operação|Vínculo Especial)$/;
  return raw.split(/\n\s*Tipo de Regime\s*\n/).map((block) => {
    const text = block.split("\n").map((l) => l.trim()).filter((l) => l && !HEADER.test(l)).join(" ");
    const m = text.match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})?\/?(\d{2})?\/?(\d{4})?\s+(Sem Altera\S+|Inclu\S+|Alterad\S+|Exclu\S+)?/);
    if (!m) return null;
    const rest = (text.slice(0, m.index) + " " + text.slice(m.index + m[0].length)).replace(/\s+/g, " ").trim();
    const tipo = /Contribuinte|Individual|Autônomo/i.test(rest) ? "Contribuinte individual/facultativo"
      : /^Benef[ií]cio|Outros$/i.test(rest) ? "Benefício" : /rural|segurado especial/i.test(rest) ? "Rural" : "Empregado";
    let origem = rest.replace(/Contribuinte|Individual \/|Autônomo|Empregado|Outros|Dom[eé]stico|Avulso/gi, "").replace(/\s+/g, " ").trim();
    if (/^RECOLHIMENTO$/i.test(origem)) origem = "Recolhimento como contribuinte individual";
    if (/^EMPRESARIO/i.test(origem)) origem = "Empresário / contribuinte individual";
    const op = m[7] || "";
    const indicators = /Inclu|Alterad/i.test(op) ? ["DECLARADO"] : [];
    return { origem: origem || tipo, tipo, start: toDate(m[1], m[2], m[3]), end: m[6] ? toDate(m[4], m[5], m[6]) : null, openEnded: !m[6], indicators, op };
  }).filter(Boolean);
}

function analyzeCnis(text, today = new Date()) {
  const raw = text.replace(/\r/g, "");
  const nit = raw.match(/\b\d{3}\.\d{5}\.\d{2}-\d\b/)?.[0] || "";
  const name = raw.match(/Nome:\s*([A-ZÀ-Ü ]{5,})/)?.[1]?.trim() || "";
  const birth = raw.match(/Nascimento:?\s*(\d{2})\/(\d{2})\/(\d{4})/);
  const birthDate = birth ? toDate(birth[1], birth[2], birth[3]) : null;
  const declared = /Relações Previdenciárias Declaradas/i.test(raw);
  // Extrato CNIS: cada vínculo começa com "Seq." (número) seguido do NIT.
  const parts = declared ? [] : raw.split(/\n\s*(?=\d{1,3}\s+\d{3}\.\d{5}\.\d{2}-\d\b)/).slice(1);
  const vinculos = declared ? parseDeclared(raw) : parts.map((block) => {
    const head = block.split(/\n/).slice(0, 4).join(" ");
    const dates = [...head.matchAll(DATE_RE)].map((m) => toDate(m[1], m[2], m[3]));
    const months = [...head.matchAll(MONTH_RE)].filter((m) => !/\d{2}\/\d{2}\/\d{4}/.test(m.input.slice(m.index - 3, m.index + 7)));
    const indicators = Object.keys(CNIS_INDICATORS).filter((k) => new RegExp(`\\b${k.replace(/-/g, "\\-")}\\b`).test(block));
    const tipo = /contribuinte individual|facultativo|empres[aá]rio|MEI|aut[oô]nomo/i.test(head) ? "Contribuinte individual/facultativo"
      : /benef[ií]cio|aux[ií]lio|aposentadoria/i.test(head) ? "Benefício" : /rural|segurado especial/i.test(head) ? "Rural" : "Empregado";
    const origem = head.replace(/^\s*\d{1,3}\s+\d{3}\.\d{5}\.\d{2}-\d\s*/, "").replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{4}/g, "").split(/Empregado|Contribuinte|Benef|Facultativo/i)[0].trim().slice(0, 60);
    let start = dates[0], end = dates[1];
    if (!start && months.length) { const [, mm, yy] = months[0]; start = toDate(1, mm, yy); }
    if (!end && months.length > 1) { const [, mm, yy] = months[months.length - 1]; end = new Date(+yy, +mm, 0); }
    return { origem: origem || (tipo === "Empregado" ? "Vínculo sem nome identificado" : tipo), tipo, start, end, openEnded: !!start && !end, indicators };
  }).filter((v) => v.start);

  // Soma o tempo sem contar duas vezes os períodos simultâneos.
  const ranges = vinculos.filter((v) => v.tipo !== "Benefício" || true).map((v) => [v.start, v.end || (v.openEnded ? today : v.start)]).sort((a, b) => a[0] - b[0]);
  const merged = [];
  ranges.forEach(([s, e]) => {
    const last = merged[merged.length - 1];
    if (last && s <= new Date(last[1].getTime() + 86400000)) { if (e > last[1]) last[1] = e; } else merged.push([s, e]);
  });
  const totalMonths = merged.reduce((acc, [s, e]) => acc + Math.max(0, monthsBetween(s, e)), 0);
  const gaps = [];
  for (let i = 1; i < merged.length; i++) {
    const gap = monthsBetween(merged[i - 1][1], merged[i][0]) - 2;
    if (gap >= 12) gaps.push({ from: merged[i - 1][1], to: merged[i][0], months: gap });
  }
  const last = merged[merged.length - 1];
  const monthsSinceLast = last ? Math.max(0, monthsBetween(last[1], today) - 1) : null;
  const before2019 = merged.some(([s]) => s < new Date(2019, 10, 13));

  const findings = [];
  vinculos.forEach((v) => v.indicators.forEach((k) => findings.push({ vinculo: v.origem, code: k, ...CNIS_INDICATORS[k] })));
  vinculos.filter((v) => v.openEnded && v.tipo === "Empregado").forEach((v) => findings.push({ vinculo: v.origem, code: "SEM DATA FIM", label: "Vínculo sem data de saída", fix: "Se você já saiu dessa empresa, o INSS pode estar sem a data correta. Separe o termo de rescisão ou a carteira com a baixa." }));
  gaps.forEach((g) => findings.push({ vinculo: `${fmtDate(g.from)} a ${fmtDate(g.to)}`, code: "LACUNA", label: `Período de ${fmtMonths(g.months)} sem contribuição`, fix: "Você trabalhou nesse período? Emprego sem registro, trabalho rural ou autônomo podem ser reconhecidos com provas." }));

  const ageYears = birthDate ? Math.floor(monthsBetween(birthDate, today) / 12) : null;
  const pcdHint = vinculos.some((v) => /defici|apae|pcd|cego|surdo/i.test(v.origem));
  const benefits = vinculos.filter((v) => v.tipo === "Benefício");
  if (pcdHint) findings.unshift({ vinculo: vinculos.find((v) => /defici|apae|pcd|cego|surdo/i.test(v.origem)).origem, code: "PcD?", label: "Vínculo com entidade de pessoas com deficiência", fix: "Se você tem deficiência, pode ter direito à aposentadoria da pessoa com deficiência (LC 142/2013), com tempo menor e sem idade mínima. Vale avaliar." });
  benefits.forEach((v) => findings.push({ vinculo: `${fmtDate(v.start)} a ${v.end ? fmtDate(v.end) : "atual"}`, code: "BENEFÍCIO", label: "Período recebendo benefício", fix: "Benefício por incapacidade conta como tempo e carência quando fica entre períodos de contribuição. Confira de qual benefício se trata." }));
  return { declared, ageYears, pcdHint, nit, name, vinculos, totalMonths, totalText: fmtMonths(totalMonths), gaps, monthsSinceLast, before2019, findings, readable: vinculos.length > 0 };
}
