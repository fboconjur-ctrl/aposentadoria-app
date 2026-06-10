const form = document.querySelector("#retirementForm");
const bestResult = document.querySelector("#bestResult");
const rulesList = document.querySelector("#rulesList");
const fillExample = document.querySelector("#fillExample");
const reportForm = document.querySelector("#reportForm");
const benefitsForm = document.querySelector("#benefitsForm");
const reportSummary = document.querySelector("#reportSummary");
const reportOutput = document.querySelector("#reportOutput");
const copyReport = document.querySelector("#copyReport");
const downloadReport = document.querySelector("#downloadReport");
const benefitsSummary = document.querySelector("#benefitsSummary");
const benefitsList = document.querySelector("#benefitsList");
const generateDocuments = document.querySelector("#generateDocuments");
const contractDocument = document.querySelector("#contractDocument");
const powerDocument = document.querySelector("#powerDocument");
const generateContractPdf = document.querySelector("#generateContractPdf");
const generatePowerPdf = document.querySelector("#generatePowerPdf");
const generateBothPdfs = document.querySelector("#generateBothPdfs");
const generateOpinionPdf = document.querySelector("#generateOpinionPdf");
const clientSearch = document.querySelector("#clientSearch");
const clientsList = document.querySelector("#clientsList");
const exportClientsCsv = document.querySelector("#exportClientsCsv");
const currentStatus = document.querySelector("#currentStatus");
const specialToggle = form.elements.isSpecial;
const specialExposureField = document.querySelector("#specialExposureField");
const specialExposureTimeField = document.querySelector("#specialExposureTimeField");
const conditionalGroups = [
  { toggle: form.elements.isSpecial, fields: [specialExposureField, specialExposureTimeField] },
  { toggle: form.elements.hasDisability, fields: [document.querySelector("#disabilityFields")] },
  { toggle: form.elements.isPermanentlyIncapable, fields: [document.querySelector("#incapacityFields")] },
  { toggle: form.elements.isRuralWorker, fields: [document.querySelector("#ruralFields")] },
  { toggle: form.elements.isPortuaryWorker, fields: [document.querySelector("#portuaryFields")] },
];
const referenceDate = document.querySelector("#referenceDate");

referenceDate.textContent = `Parâmetros: ${RetirementRules.formatDate(RetirementRules.referenceDate)}`;

let lastReportText = "";

const routeToTab = {
  aposentadorias: "retirementTab",
  relatorio: "reportTab",
  beneficios: "benefitsTab",
  clientes: "clientsTab",
};

const storage = {
  key: "previdenciario_atendimentos_v1",
  all() {
    return JSON.parse(localStorage.getItem(this.key) || "[]");
  },
  save(records) {
    localStorage.setItem(this.key, JSON.stringify(records));
  },
  upsert(record) {
    const records = this.all();
    const index = records.findIndex((item) => item.id === record.id);
    if (index >= 0) records[index] = record;
    else records.unshift(record);
    this.save(records);
    return record;
  },
};

const durationPairs = [
  { years: "contribYears", months: "contribMonths", label: "Tempo total informado" },
  { years: "contrib2019Years", months: "contrib2019Months", label: "Tempo na Reforma" },
  { years: "specialYears", months: "specialMonths", label: "Tempo especial" },
  { years: "disabilityYears", months: "disabilityMonths", label: "Tempo como PcD" },
  { years: "ruralYears", months: "ruralMonths", label: "Tempo rural" },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

function getReportOwner() {
  return reportForm?.elements.reportOwner?.value.trim() || "Fernanda Borges Oliveira";
}

function syncReportOwner() {
  document.body.dataset.reportOwner = getReportOwner();
}

function readableDuration(years, months) {
  const total = Number(years || 0) * 12 + Number(months || 0);
  const y = Math.floor(total / 12);
  const m = total % 12;
  if (!total) return "nenhum tempo informado";
  if (!m) return `${y} ano${y === 1 ? "" : "s"}`;
  return `${y} ano${y === 1 ? "" : "s"} e ${m} mes${m === 1 ? "" : "es"}`;
}

function enhanceSelect(name) {
  const select = document.querySelector(`select[name="${name}"]`);
  if (!select || select.dataset.enhanced === "true" || select.options.length > 6) return;
  select.dataset.enhanced = "true";
  select.classList.add("enhanced-select-source");
  const wrapper = document.createElement("div");
  wrapper.className = "segmented";
  wrapper.setAttribute("role", "group");
  wrapper.setAttribute("aria-label", select.closest("label")?.childNodes[0]?.textContent?.trim() || name);

  const sync = () => {
    wrapper.querySelectorAll(".segment-option").forEach((button) => {
      const active = button.dataset.value === select.value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  [...select.options].forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "segment-option";
    button.dataset.value = option.value;
    button.textContent = option.textContent;
    button.addEventListener("click", () => {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    });
    wrapper.appendChild(button);
  });

  select.insertAdjacentElement("afterend", wrapper);
  select.addEventListener("change", sync);
  sync();
}

function formatNis(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{5})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{5})\.(\d{2})(\d)/, "$1.$2.$3-$4");
}

function updateBirthHint() {
  const field = form.elements.birthDate;
  const hint = document.querySelector("#birthDateHint");
  if (!field.value || !hint) {
    if (hint) hint.textContent = "Informe a data para calcular idade na data de referência.";
    return;
  }
  const birth = new Date(`${field.value}T00:00:00`);
  const months = RetirementRules.ageInMonths(birth, RetirementRules.referenceDate);
  hint.textContent = `Idade em ${RetirementRules.formatDate(RetirementRules.referenceDate)}: ${readableDuration(Math.floor(months / 12), months % 12)}.`;
}

function updateDurationHints() {
  durationPairs.forEach((pair) => {
    const years = form.elements[pair.years];
    const months = form.elements[pair.months];
    const hint = document.querySelector(`[data-duration-hint="${pair.years}-${pair.months}"]`);
    if (years && months && hint) {
      hint.textContent = `${pair.label}: ${readableDuration(years.value, months.value)}.`;
    }
  });
}

function setupFieldAssists() {
  ["sex", "specialExposureYears", "disabilityDegree", "reportGoal", "insuredCategory"].forEach(enhanceSelect);

  const nisField = form.elements.nis;
  nisField.inputMode = "numeric";
  nisField.addEventListener("input", () => {
    nisField.value = formatNis(nisField.value);
  });

  const birthLabel = form.elements.birthDate.closest("label");
  if (birthLabel && !document.querySelector("#birthDateHint")) {
    const hint = document.createElement("div");
    hint.id = "birthDateHint";
    hint.className = "field-hint";
    birthLabel.appendChild(hint);
  }
  form.elements.birthDate.addEventListener("change", updateBirthHint);

  durationPairs.forEach((pair) => {
    const months = form.elements[pair.months];
    const years = form.elements[pair.years];
    if (!years || !months) return;
    const container = months.closest(".inline-fields");
    if (container && !document.querySelector(`[data-duration-hint="${pair.years}-${pair.months}"]`)) {
      const hint = document.createElement("div");
      hint.className = "field-hint";
      hint.dataset.durationHint = `${pair.years}-${pair.months}`;
      container.insertAdjacentElement("afterend", hint);
    }
    [years, months].forEach((field) => field.addEventListener("input", updateDurationHints));
  });

  updateBirthHint();
  updateDurationHints();
}

function normalizeFormData() {
  const data = Object.fromEntries(new FormData(form).entries());
  data.isTeacher = form.elements.isTeacher.checked;
  data.isSpecial = form.elements.isSpecial.checked;
  data.startedBeforeReform = form.elements.startedBeforeReform.checked;
  data.hasDisability = form.elements.hasDisability.checked;
  data.isPermanentlyIncapable = form.elements.isPermanentlyIncapable.checked;
  data.incapacityCarencyWaived = form.elements.incapacityCarencyWaived.checked;
  data.needsThirdPartyCare = form.elements.needsThirdPartyCare.checked;
  data.isRuralWorker = form.elements.isRuralWorker.checked;
  data.isPortuaryWorker = form.elements.isPortuaryWorker.checked;
  data.portuaryRegistry15Years = form.elements.portuaryRegistry15Years.checked;
  data.portuaryAttendance80 = form.elements.portuaryAttendance80.checked;
  return data;
}

function statusTag(rule) {
  if (!rule.available) return `<span class="tag bad">Fora do perfil</span>`;
  if (rule.eligible) return `<span class="tag ok">Elegível agora</span>`;
  return `<span class="tag wait">Faltam ${RetirementRules.formatMonths(rule.monthsUntil)}</span>`;
}

function renderBest(result) {
  if (!result.best) {
    bestResult.innerHTML = `
      <p class="eyebrow">Resultado</p>
      <h2>Nenhuma regra aplicável com os dados atuais.</h2>
      <p>Revise carência, tempo de contribuição e condições especiais.</p>
    `;
    return;
  }

  const best = result.best;
  bestResult.innerHTML = `
    <p class="eyebrow">Regra mais favorável</p>
    <h2>${best.title}</h2>
    <p>${best.eligible ? "A pessoa já aparece como elegível nessa regra." : `Data estimada de elegibilidade: ${RetirementRules.formatDate(best.eligibleDate)}.`}</p>
    <div class="metric-grid">
      <div class="metric">
        <span>Prazo</span>
        <strong>${best.eligible ? "Agora" : RetirementRules.formatMonths(best.monthsUntil)}</strong>
      </div>
      <div class="metric">
        <span>Renda estimada</span>
        <strong>${money(best.estimatedBenefit)}</strong>
      </div>
      <div class="metric">
        <span>Critério</span>
        <strong>${best.eligible ? "Cumprido" : "A cumprir"}</strong>
      </div>
    </div>
  `;
}

function renderRules(result) {
  const sorted = [...result.candidates].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    if (a.monthsUntil !== b.monthsUntil) return a.monthsUntil - b.monthsUntil;
    return b.estimatedBenefit - a.estimatedBenefit;
  });

  rulesList.innerHTML = sorted
    .map((rule) => {
      const isBest = result.best && rule.id === result.best.id;
      const details = rule.disqualifier ? [rule.disqualifier, ...rule.requirements] : rule.requirements;
      return `
        <article class="rule-card ${isBest ? "best" : ""}">
          <div class="rule-head">
            <h3>${rule.title}</h3>
            ${statusTag(rule)}
          </div>
          <p>${rule.available ? `Elegibilidade estimada: ${RetirementRules.formatDate(rule.eligibleDate)}.` : rule.disqualifier}</p>
          <ul>
            ${details.map((item) => `<li>${item}</li>`).join("")}
            ${rule.notes.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `;
    })
    .join("");
}

function switchTab(tabId, updateRoute = true) {
  const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
    button.setAttribute("aria-current", button.dataset.tab === tabId ? "page" : "false");
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
  document.querySelectorAll(".workflow-step").forEach((step) => {
    step.classList.toggle("active", step.dataset.tabTarget === tabId);
  });
  if (activeButton && updateRoute) {
    history.replaceState(null, "", `#${activeButton.dataset.route}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function calculate() {
  if (!form.reportValidity()) return;
  const result = RetirementRules.compareRetirementRules(normalizeFormData());
  renderBest(result);
  renderRules(result);
}

function updateSpecialVisibility() {
  conditionalGroups.forEach((group) => {
    group.fields.forEach((field) => field.classList.toggle("visible", group.toggle.checked));
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});

specialToggle.addEventListener("change", updateSpecialVisibility);
conditionalGroups.forEach((group) => group.toggle.addEventListener("change", updateSpecialVisibility));

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

document.querySelectorAll(".workflow-step").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
});

document.querySelectorAll(".next-step").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.nextTab));
});

window.addEventListener("hashchange", () => {
  const route = window.location.hash.replace("#", "");
  switchTab(routeToTab[route] || "retirementTab", false);
});

const initialRoute = window.location.hash.replace("#", "");
switchTab(routeToTab[initialRoute] || "retirementTab", false);

fillExample.addEventListener("click", () => {
  form.elements.nis.value = "123.45678.90-1";
  form.elements.name.value = "Maria da Silva";
  form.elements.sex.value = "female";
  form.elements.birthDate.value = "1967-04-18";
  form.elements.contribYears.value = "31";
  form.elements.contribMonths.value = "4";
  form.elements.contrib2019Years.value = "27";
  form.elements.contrib2019Months.value = "0";
  form.elements.carencia.value = "240";
  form.elements.averageSalary.value = "3200";
  form.elements.startedBeforeReform.checked = true;
  form.elements.isTeacher.checked = false;
  form.elements.isSpecial.checked = false;
  form.elements.specialExposureYears.value = "25";
  form.elements.specialYears.value = "25";
  form.elements.specialMonths.value = "0";
  form.elements.hasDisability.checked = false;
  form.elements.disabilityDegree.value = "mild";
  form.elements.disabilityYears.value = "15";
  form.elements.disabilityMonths.value = "0";
  form.elements.isPermanentlyIncapable.checked = false;
  form.elements.incapacityCarencyWaived.checked = false;
  form.elements.needsThirdPartyCare.checked = false;
  form.elements.isRuralWorker.checked = false;
  form.elements.ruralYears.value = "15";
  form.elements.ruralMonths.value = "0";
  form.elements.isPortuaryWorker.checked = false;
  form.elements.portuaryRegistry15Years.checked = false;
  form.elements.portuaryAttendance80.checked = false;
  updateSpecialVisibility();
  updateBirthHint();
  updateDurationHints();
  calculate();
});

updateSpecialVisibility();
setupFieldAssists();

async function extractPdfText(file) {
  if (!file) return "";
  const pdfjs = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n\n");
}

function analyzeCnisText(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();
  const nis = normalized.match(/\b\d{3}\.?\d{5}\.?\d{2}-?\d\b/)?.[0] || normalized.match(/\b\d{11}\b/)?.[0] || "";
  const benefitMatches = normalized.match(/\b\d{2}\/\d{3}\.\d{3}\.\d{3}-\d\b/g) || [];
  const signals = [
    { label: "Possível atividade especial", hit: /(ppp|ltcat|insalubr|periculos|agente nocivo|ru[ií]do|calor|frio|qu[ií]mico|biol[oó]gico|minera)/i.test(normalized) },
    { label: "Possível período rural", hit: /(rural|segurado especial|agricult|pescador|extrativista)/i.test(normalized) },
    { label: "Possível deficiência ou reabilitação", hit: /(defici[eê]ncia|reabilita[cç][aã]o|pcd|bpc)/i.test(normalized) },
    { label: "Possível incapacidade/benefício por doença", hit: /(aux[ií]lio[- ]doen[cç]a|incapacidade|aposentadoria por invalidez|benef[ií]cio por incapacidade)/i.test(normalized) },
    { label: "Possível pensão ou dependência", hit: /(pens[aã]o por morte|dependente|instituidor)/i.test(normalized) },
    { label: "Contribuições em atraso ou pendências", hit: /(pend[eê]ncia|extempor[aâ]neo|indicador|acerto|recolhimento em atraso|remunera[cç][aã]o abaixo)/i.test(normalized) },
  ].filter((item) => item.hit);

  const yearsMatch = lower.match(/(\d{1,2})\s*anos?\s*(?:,|e)?\s*(\d{1,2})?\s*mes/);
  return {
    nis,
    benefitMatches: [...new Set(benefitMatches)],
    signals,
    possibleContributionText: yearsMatch ? yearsMatch[0] : "",
    hasText: normalized.length > 40,
    length: normalized.length,
  };
}

function renderReportBlocks(blocks) {
  reportOutput.innerHTML = blocks
    .map(
      (block) => `
        <article class="report-block">
          <h3>${escapeHtml(block.title)}</h3>
          ${block.body ? `<p>${escapeHtml(block.body)}</p>` : ""}
          ${block.items?.length ? `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        </article>
      `,
    )
    .join("");
}

async function generateReport(event) {
  event.preventDefault();
  syncReportOwner();
  const file = reportForm.elements.cnisPdf.files[0];
  let text = reportForm.elements.cnisText.value;
  if (file) {
    reportSummary.innerHTML = `
      <p class="eyebrow">Relatório</p>
      <h2>Lendo o PDF do CNIS...</h2>
      <p>Se o arquivo for imagem digitalizada, talvez seja necessário usar OCR externo e colar o texto aqui.</p>
    `;
    try {
      text = await extractPdfText(file);
      reportForm.elements.cnisText.value = text;
    } catch (error) {
      reportSummary.innerHTML = `
        <p class="eyebrow">Relatório</p>
        <h2>Não consegui extrair o texto do PDF.</h2>
        <p>Cole o texto do CNIS no campo ao lado. Alguns PDFs vêm como imagem ou bloqueiam leitura direta.</p>
      `;
      return;
    }
  }

  const cnis = analyzeCnisText(text);
  const retirement = form.checkValidity() ? RetirementRules.compareRetirementRules(normalizeFormData()) : null;
  const benefitResults = evaluateBenefits(normalizeBenefitsData());
  const bestBenefit = benefitResults.find((item) => item.status === "ok") || benefitResults[0];
  const notes = reportForm.elements.caseNotes.value.trim();
  const owner = getReportOwner();

  const blocks = [
    {
      title: "Identificação e leitura do CNIS",
      body: cnis.hasText
        ? `Texto analisado com ${cnis.length} caracteres${cnis.nis ? `; NIS provável: ${cnis.nis}` : ""}.`
        : "Ainda não há texto suficiente do CNIS para uma leitura automatizada.",
      items: [
        cnis.possibleContributionText ? `Tempo textual localizado: ${cnis.possibleContributionText}` : "Tempo total deve ser conferido nos indicadores oficiais do CNIS.",
        cnis.benefitMatches.length ? `NBs encontrados: ${cnis.benefitMatches.join(", ")}` : "Nenhum número de benefício foi identificado automaticamente.",
      ],
    },
    {
      title: "Sinais previdenciários detectados",
      items: cnis.signals.length
        ? cnis.signals.map((signal) => signal.label)
        : ["Nenhum sinal textual específico foi detectado; revise vínculos, remunerações, indicadores e documentos complementares."],
    },
    {
      title: "Melhor caminho de aposentadoria pela simulação",
      body: retirement?.best
        ? `${retirement.best.title}: ${retirement.best.eligible ? "aparenta elegibilidade imediata" : `estimativa para ${RetirementRules.formatDate(retirement.best.eligibleDate)}`}.`
        : "Preencha a aba de aposentadorias para comparar regras.",
      items: retirement?.best ? retirement.best.requirements.concat(retirement.best.notes) : [],
    },
    {
      title: "Benefícios e medidas correlatas",
      body: bestBenefit ? `Principal hipótese atual: ${bestBenefit.title}.` : "Preencha a aba de benefícios para mapear auxílios, pensão e isenções.",
      items: benefitResults.slice(0, 5).map((item) => `${item.title}: ${item.summary}`),
    },
    {
      title: "Providências documentais",
      items: [
        "Conferir qualidade de segurado, carência e indicadores do CNIS.",
        "Separar PPP/LTCAT para períodos especiais, se houver.",
        "Separar laudos médicos para incapacidade, PcD, acréscimo de 25% ou isenção de IR.",
        "Para pensão por morte, comprovar óbito, dependência, união/casamento e qualidade de segurado do instituidor.",
        notes ? `Observação do atendimento: ${notes}` : "Registrar fatos relevantes do atendimento antes do protocolo.",
      ],
    },
    {
      title: "Rodapé de emissão",
      body: `Relatório gerado por: ${owner}.`,
      items: [`Data de emissão: ${new Date().toLocaleDateString("pt-BR")}`],
    },
  ];

  lastReportText = blocks
    .map((block) => `${block.title}\n${block.body || ""}\n${(block.items || []).map((item) => `- ${item}`).join("\n")}`.trim())
    .join("\n\n");

  reportSummary.innerHTML = `
    <p class="eyebrow">Relatório</p>
    <h2>Relatório preliminar gerado.</h2>
    <p>Use como roteiro de análise: ele aponta hipóteses, pendências e documentos, mas não substitui revisão do CNIS original.</p>
  `;
  renderReportBlocks(blocks);
  const record = collectClientData();
  record.status = currentStatus?.value || "Relatório gerado";
  storage.upsert(record);
  renderClients();
}

function normalizeBenefitsData() {
  const data = Object.fromEntries(new FormData(benefitsForm).entries());
  [
    "hasInsuredStatus",
    "medicalDocuments",
    "temporaryIncapacityOver15",
    "workAccidentOrSevereDisease",
    "permanentSequela",
    "maternityEvent",
    "deathOccurred",
    "deceasedHad18Contribs",
    "unionOver2Years",
    "dependentInvalidOrDisabled",
    "isRetiredOrPensioner",
    "hasSeriousDisease",
    "receivesPermanentIncapacityRetirement",
    "needsCareForDailyActivities",
  ].forEach((name) => {
    data[name] = benefitsForm.elements[name].checked;
  });
  data.benefitContribMonths = Number(data.benefitContribMonths || 0);
  data.spouseAgeAtDeath = Number(data.spouseAgeAtDeath || 0);
  data.dependentCount = Number(data.dependentCount || 0);
  data.seriousDiseaseType = data.seriousDiseaseType || "";
  return data;
}

function collectClientData() {
  const retirement = normalizeFormData();
  const benefits = normalizeBenefitsData();
  const calculated = form.checkValidity() ? RetirementRules.compareRetirementRules(retirement) : null;
  const now = new Date();
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: retirement.name || "",
    cpf: retirement.cpf || "",
    rg: retirement.rg || "",
    civilStatus: retirement.civilStatus || "",
    profession: retirement.profession || "",
    address: retirement.address || "",
    phone: retirement.phone || "",
    email: retirement.email || "",
    nis: retirement.nis || "",
    benefitType: benefits.benefitType || calculated?.best?.title || "",
    serviceSummary: benefits.serviceSummary || "",
    estimatedBenefit: calculated?.best?.estimatedBenefit || "",
    feeTerms: benefits.feeTerms || "",
    lawyerName: getReportOwner(),
    lawyerOab: benefits.lawyerOab || "",
    lawyerAddress: benefits.lawyerAddress || "",
    signaturePlace: benefits.signaturePlace || "Brasília/DF",
    signatureDate: benefits.signatureDate || now.toISOString().slice(0, 10),
    calculationData: retirement,
    calculationResult: calculated?.best
      ? {
          title: calculated.best.title,
          eligible: calculated.best.eligible,
          eligibleDate: calculated.best.eligibleDate,
          estimatedBenefit: calculated.best.estimatedBenefit,
        }
      : null,
    createdAt: now.toISOString(),
    status: "Documentos em elaboração",
    contractGenerated: false,
    powerGenerated: false,
    contractHtml: "",
    powerHtml: "",
  };
}

function updateLatestStatus(status) {
  const records = storage.all();
  if (!records.length) return;
  records[0].status = status;
  storage.save(records);
  renderClients();
}

function formatDateLong(value) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function fullClientQualification(data) {
  return `${data.name || "[NOME DO(A) CLIENTE]"}, ${data.cpf ? `inscrito(a) no CPF sob nº ${data.cpf}` : "CPF nº [CPF]"}${data.rg ? `, RG nº ${data.rg}` : ""}, ${data.civilStatus || "[estado civil]"}, ${data.profession || "[profissão]"}, residente e domiciliado(a) em ${data.address || "[endereço completo]"}, telefone ${data.phone || "[telefone]"}, e-mail ${data.email || "[e-mail]"}`;
}

function renderContract(data) {
  const qualification = fullClientQualification(data);
  const benefit = data.benefitType || "[benefício previdenciário]";
  const service = data.serviceSummary || `prestação de serviços advocatícios para análise previdenciária, orientação técnica, elaboração de requerimentos, acompanhamento administrativo e/ou judicial relacionado a ${benefit}`;
  const estimated = data.estimatedBenefit ? money(data.estimatedBenefit) : "valor ainda não estimado";
  return `
    <h1>Contrato de Honorários Advocatícios</h1>
    <p><strong>CONTRATANTE:</strong> ${escapeHtml(qualification)}.</p>
    <p><strong>CONTRATADA:</strong> ${escapeHtml(data.lawyerName || "Fernanda Borges Oliveira")}, advogada, ${escapeHtml(data.lawyerOab || "OAB nº [informar]")}, com endereço profissional em ${escapeHtml(data.lawyerAddress || "[endereço profissional]")}.</p>
    <h2>Cláusula 1ª - Objeto</h2>
    <p>A CONTRATADA prestará serviços advocatícios consistentes em ${escapeHtml(service)}, inclusive análise documental, cálculo previdenciário, elaboração de peças, protocolo, acompanhamento e orientação estratégica.</p>
    <h2>Cláusula 2ª - Benefício e estimativa econômica</h2>
    <p>O serviço refere-se ao benefício/pedido de <strong>${escapeHtml(benefit)}</strong>. Quando indicado pelo simulador, o valor estimado do benefício é de <strong>${escapeHtml(estimated)}</strong>, sujeito à conferência documental, aos critérios legais e à decisão administrativa ou judicial.</p>
    <h2>Cláusula 3ª - Honorários contratuais</h2>
    <p>Pelos serviços contratados, a CONTRATANTE pagará honorários advocatícios conforme os seguintes termos: <strong>${escapeHtml(data.feeTerms || "[informar percentual, valor fixo ou forma de pagamento]")}</strong>.</p>
    <h2>Cláusula 4ª - Obrigações da contratante</h2>
    <p>A CONTRATANTE obriga-se a fornecer informações verdadeiras, documentos completos, dados de acesso estritamente necessários, manter seus contatos atualizados e comunicar fatos que possam interferir no requerimento ou processo.</p>
    <h2>Cláusula 5ª - Obrigações da advogada</h2>
    <p>A CONTRATADA obriga-se a atuar com zelo técnico, independência profissional, sigilo, boa-fé, informação adequada sobre o andamento do caso e observância às normas éticas da advocacia.</p>
    <h2>Cláusula 6ª - Tratamento de dados pessoais</h2>
    <p>A CONTRATANTE autoriza o tratamento de dados pessoais e sensíveis para análise previdenciária, elaboração de documentos, contato profissional, atuação administrativa e judicial, cumprimento legal e exercício regular de direitos, nos termos da Lei Geral de Proteção de Dados.</p>
    <h2>Cláusula 7ª - Foro</h2>
    <p>Fica eleito o foro competente do domicílio da CONTRATANTE, salvo hipótese legal ou estratégica que recomende foro diverso para a demanda previdenciária.</p>
    <p>${escapeHtml(data.signaturePlace || "Brasília/DF")}, ${escapeHtml(formatDateLong(data.signatureDate))}.</p>
    <div class="signature-lines">
      <div class="signature-line">${escapeHtml(data.name || "CONTRATANTE")}</div>
      <div class="signature-line">${escapeHtml(data.lawyerName || "Fernanda Borges Oliveira")}<br>${escapeHtml(data.lawyerOab || "OAB nº [informar]")}</div>
    </div>
  `;
}

function renderPowerOfAttorney(data) {
  const qualification = fullClientQualification(data);
  return `
    <h1>Procuração Ad Judicia et Extra</h1>
    <p><strong>OUTORGANTE:</strong> ${escapeHtml(qualification)}.</p>
    <p><strong>OUTORGADA:</strong> ${escapeHtml(data.lawyerName || "Fernanda Borges Oliveira")}, advogada, ${escapeHtml(data.lawyerOab || "OAB nº [informar]")}, com endereço profissional em ${escapeHtml(data.lawyerAddress || "[endereço profissional]")}.</p>
    <p>Por este instrumento particular, o(a) OUTORGANTE nomeia e constitui sua bastante procuradora a OUTORGADA acima qualificada, conferindo-lhe poderes para o foro em geral, com a cláusula <em>ad judicia et extra</em>, para representá-lo(a) em matéria previdenciária, administrativa e judicial.</p>
    <p>Os poderes abrangem atuação perante o INSS, Justiça Federal, Juizados Especiais Federais, Tribunais, bancos, órgãos públicos, entidades privadas, plataformas digitais, sistemas eletrônicos, Meu INSS, Gov.br, PrevJud, PJe, eproc, e demais sistemas necessários à defesa dos interesses do(a) OUTORGANTE.</p>
    <p>A OUTORGADA poderá requerer benefícios, revisar atos, apresentar recursos, cumprir exigências, juntar documentos, retirar cópias, solicitar informações, assinar declarações, receber intimações, substabelecer com ou sem reserva de poderes, transigir, desistir, firmar acordos, receber e dar quitação, quando juridicamente adequado e mediante observância dos interesses do(a) OUTORGANTE.</p>
    <p>Objeto previdenciário principal: <strong>${escapeHtml(data.benefitType || "[benefício/pedido previdenciário]")}</strong>.</p>
    <p>${escapeHtml(data.signaturePlace || "Brasília/DF")}, ${escapeHtml(formatDateLong(data.signatureDate))}.</p>
    <div class="signature-lines">
      <div class="signature-line">${escapeHtml(data.name || "OUTORGANTE")}</div>
    </div>
  `;
}

function renderDocumentsFromForm() {
  const consent = benefitsForm.elements.lgpdConsent.checked;
  if (!consent) {
    alert("Para gerar documentos e salvar o atendimento, marque o consentimento LGPD.");
    return null;
  }
  const data = collectClientData();
  data.contractHtml = renderContract(data);
  data.powerHtml = renderPowerOfAttorney(data);
  contractDocument.innerHTML = data.contractHtml;
  powerDocument.innerHTML = data.powerHtml;
  data.contractGenerated = true;
  data.powerGenerated = true;
  data.status = currentStatus?.value || "Documentos gerados";
  storage.upsert(data);
  renderClients();
  document.querySelector("#documentPreviewPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return data;
}

function pdfOptions(filename) {
  return {
    margin: [12, 12, 14, 12],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
}

async function generatePdf(element, filename) {
  if (!element.innerHTML.trim()) {
    const generated = renderDocumentsFromForm();
    if (!generated || !element.innerHTML.trim()) return false;
  }
  const printable = element.cloneNode(true);
  printable.classList.add("active");
  printable.style.display = "block";
  printable.style.position = "fixed";
  printable.style.left = "-10000px";
  printable.style.top = "0";
  printable.style.width = "190mm";
  printable.style.minHeight = "auto";
  printable.style.background = "#fff";
  printable.style.color = "#111";
  document.body.appendChild(printable);

  if (window.html2pdf) {
    await html2pdf().set(pdfOptions(filename)).from(printable).save();
    printable.remove();
    return true;
  }
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    printable.remove();
    alert("Não foi possível abrir a janela de impressão. Verifique o bloqueador de pop-ups.");
    return false;
  }
  printWindow.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(filename.replace(".pdf", ""))}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #111; line-height: 1.55; }
          h1 { text-align: center; text-transform: uppercase; font-size: 20px; }
          h2 { font-size: 14px; margin-top: 18px; text-transform: uppercase; }
          p { text-align: justify; }
          .signature-lines { display: grid; gap: 42px; margin-top: 54px; }
          .signature-line { border-top: 1px solid #222; padding-top: 8px; text-align: center; }
          @media print { body { margin: 18mm; } }
        </style>
      </head>
      <body>${printable.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printable.remove();
  return true;
}

function currentDocFilename(prefix) {
  const data = collectClientData();
  const safeName = (data.name || "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${prefix}-${safeName || "cliente"}.pdf`;
}

function saveCurrentDocumentsFlags(contractFlag, powerFlag) {
  const data = collectClientData();
  data.contractGenerated = contractFlag || Boolean(contractDocument.innerHTML.trim());
  data.powerGenerated = powerFlag || Boolean(powerDocument.innerHTML.trim());
  data.contractHtml = contractDocument.innerHTML;
  data.powerHtml = powerDocument.innerHTML;
  data.status = currentStatus?.value || "PDF gerado";
  storage.upsert(data);
  renderClients();
}

function buildOpinionHtml() {
  if (!reportOutput.innerText.trim()) {
    generateReport(new Event("submit", { cancelable: true }));
  }
  return `
    <article class="legal-document active">
      <h1>Parecer Previdenciário Preliminar</h1>
      <p><strong>Responsável técnico:</strong> ${escapeHtml(getReportOwner())}.</p>
      <p><strong>Cliente:</strong> ${escapeHtml(form.elements.name.value || "[nome do cliente]")}.</p>
      <p><strong>CPF:</strong> ${escapeHtml(form.elements.cpf.value || "[CPF]")}.</p>
      ${reportOutput.innerHTML || "<p>Relatório ainda não gerado.</p>"}
      <p><strong>Observação:</strong> este parecer é preliminar e depende de conferência do CNIS, documentos pessoais, documentos médicos, PPP/LTCAT e demais provas aplicáveis ao caso.</p>
    </article>
  `;
}

async function generateOpinionPdfFile() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = buildOpinionHtml();
  const doc = wrapper.firstElementChild;
  document.body.appendChild(doc);
  await generatePdf(doc, currentDocFilename("parecer-previdenciario"));
  doc.remove();
}

function renderClients() {
  const query = (clientSearch?.value || "").toLowerCase().trim();
  const records = storage.all().filter((record) => {
    const haystack = `${record.name} ${record.cpf} ${record.benefitType}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  if (!records.length) {
    clientsList.innerHTML = `<article class="client-card"><p>Nenhum atendimento salvo ainda.</p></article>`;
    return;
  }
  clientsList.innerHTML = records
    .map(
      (record) => `
        <article class="client-card">
          <header>
            <h3>${escapeHtml(record.name || "Cliente sem nome")}</h3>
            <span class="tag ${record.contractGenerated || record.powerGenerated ? "ok" : "wait"}">${escapeHtml(record.status || "Em atendimento")}</span>
          </header>
          <p>CPF: ${escapeHtml(record.cpf || "-")} | Benefício: ${escapeHtml(record.benefitType || "-")} | Criado em: ${new Date(record.createdAt).toLocaleString("pt-BR")}</p>
          <label>
            Atualizar status
            <select class="status-select" data-status-record="${record.id}">
              ${["Novo", "Em análise", "Documentos gerados", "Protocolado", "Exigência", "Concluído"].map((status) => `<option value="${status}" ${record.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <div class="client-actions">
            <button type="button" class="secondary" data-open-contract="${record.id}">Abrir contrato</button>
            <button type="button" class="secondary" data-open-power="${record.id}">Abrir procuração</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function exportClients() {
  const headers = ["nome", "cpf", "telefone", "email", "endereco", "beneficio", "status", "contrato_gerado", "procuracao_gerada", "criado_em"];
  const rows = storage.all().map((record) => [
    record.name,
    record.cpf,
    record.phone,
    record.email,
    record.address,
    record.benefitType,
    record.status,
    record.contractGenerated ? "sim" : "nao",
    record.powerGenerated ? "sim" : "nao",
    record.createdAt,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `atendimentos-previdenciarios-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function pensionDuration(age, shortRule, invalidOrDisabled) {
  if (invalidOrDisabled) return "enquanto durar invalidez/deficiência, respeitados mínimos legais";
  if (shortRule) return "4 meses";
  if (age < 22) return "3 anos";
  if (age <= 27) return "6 anos";
  if (age <= 30) return "10 anos";
  if (age <= 41) return "15 anos";
  if (age <= 44) return "20 anos";
  return "vitalícia";
}

function makeBenefit(id, title, status, summary, requirements, notes = []) {
  return { id, title, status, summary, requirements, notes };
}

function evaluateBenefits(data) {
  const carency12 = data.benefitContribMonths >= 12 || data.workAccidentOrSevereDisease;
  const maternityNoCarencyCategories = ["employee", "domestic"].includes(data.insuredCategory);
  const maternityCarency = maternityNoCarencyCategories || data.benefitContribMonths >= 10;
  const accidentCategories = ["employee", "domestic", "special"].includes(data.insuredCategory);
  const pensionShort = !data.deceasedHad18Contribs || !data.unionOver2Years;
  const pensionTime = pensionDuration(data.spouseAgeAtDeath, pensionShort, data.dependentInvalidOrDisabled);

  return [
    makeBenefit(
      "temporary-incapacity",
      "Auxílio por incapacidade temporária",
      data.hasInsuredStatus && data.medicalDocuments && data.temporaryIncapacityOver15 && carency12 ? "ok" : "attention",
      data.hasInsuredStatus && data.temporaryIncapacityOver15 ? "possível, sujeito a perícia ou análise documental" : "depende de qualidade de segurado e afastamento superior a 15 dias",
      [
        "Qualidade de segurado",
        "Incapacidade para o trabalho habitual por mais de 15 dias",
        data.workAccidentOrSevereDisease ? "Carência indicada como dispensável" : "Carência em regra: 12 contribuições",
      ],
      ["Exige documentação médica e pode passar por perícia/Atestmed."],
    ),
    makeBenefit(
      "accident-aid",
      "Auxílio-acidente",
      data.hasInsuredStatus && data.permanentSequela && accidentCategories ? "ok" : "attention",
      data.permanentSequela ? "avaliar sequela consolidada e redução de capacidade" : "depende de sequela permanente após acidente",
      [
        "Qualidade de segurado na época do acidente",
        "Sequela definitiva que reduza a capacidade para o trabalho habitual",
        "Categoria coberta pela regra",
        "Sem carência mínima",
      ],
      ["Não é o mesmo que auxílio por incapacidade temporária."],
    ),
    makeBenefit(
      "maternity",
      "Salário-maternidade",
      data.hasInsuredStatus && data.maternityEvent && maternityCarency ? "ok" : "attention",
      data.maternityEvent ? "possível conforme categoria e documentação do fato gerador" : "marque parto, adoção, guarda judicial ou aborto legal para avaliar",
      [
        "Qualidade de segurada/segurado conforme o caso",
        "Parto, adoção, guarda judicial ou aborto legal",
        maternityNoCarencyCategories ? "Categoria marcada normalmente dispensa carência" : "Triagem considera 10 contribuições para esta categoria",
      ],
      ["Conferir regra vigente e fato gerador; salário-maternidade não acumula com benefício por incapacidade."],
    ),
    makeBenefit(
      "death-pension",
      "Pensão por morte",
      data.deathOccurred && data.dependentCount > 0 ? "ok" : "attention",
      data.deathOccurred ? `duração estimada para cônjuge/companheiro(a): ${pensionTime}` : "depende de óbito e dependente habilitável",
      [
        "Óbito de segurado(a) ou aposentado(a)",
        "Dependente habilitável",
        "Qualidade de segurado do instituidor ou condição de aposentado",
        `Dependentes informados: ${data.dependentCount}`,
      ],
      [`Regra de duração usada na triagem: ${pensionTime}.`, "Valor após 14/11/2019 usa cota familiar de 50% + 10% por dependente, limitado a 100%, com exceções."],
    ),
    makeBenefit(
      "ir-exemption",
      "Isenção de IR por doença grave",
      data.isRetiredOrPensioner && data.hasSeriousDisease ? "ok" : "attention",
      data.hasSeriousDisease ? "avaliar pedido de isenção sobre aposentadoria, pensão, reforma ou reserva" : "depende de moléstia grave documentada",
      [
        "Rendimento de aposentadoria, pensão, reforma ou reserva remunerada",
        data.seriousDiseaseType ? `Doença/moléstia informada: ${data.seriousDiseaseType}` : "Doença grave/moléstia profissional especificada em lei",
        "Laudo médico pericial oficial ou documentação médica aceita no procedimento",
      ],
      ["A isenção não alcança, em regra, salário de atividade ou outras rendas não previdenciárias."],
    ),
    makeBenefit(
      "additional-25",
      "Acréscimo de 25% na aposentadoria por incapacidade permanente",
      data.receivesPermanentIncapacityRetirement && data.needsCareForDailyActivities ? "ok" : "attention",
      data.needsCareForDailyActivities ? "possível se comprovada necessidade de assistência permanente" : "depende de aposentadoria por incapacidade permanente e auxílio de terceiros",
      [
        "Aposentadoria por incapacidade permanente concedida ou em avaliação",
        "Dependência de terceiros para atividades da vida diária",
        "Perícia médica e/ou avaliação social",
      ],
      ["O acréscimo cessa com a morte do aposentado e não integra pensão por morte."],
    ),
  ];
}

function renderBenefits(results) {
  const okCount = results.filter((item) => item.status === "ok").length;
  benefitsSummary.innerHTML = `
    <p class="eyebrow">Benefícios</p>
    <h2>${okCount ? `${okCount} hipótese${okCount === 1 ? "" : "s"} forte${okCount === 1 ? "" : "s"} encontrada${okCount === 1 ? "" : "s"}.` : "Há hipóteses que precisam de mais dados."}</h2>
    <p>Os cards indicam triagem inicial, requisitos e documentos que devem ser conferidos antes do requerimento.</p>
  `;
  benefitsList.innerHTML = results
    .map(
      (item) => `
        <article class="rule-card ${item.status === "ok" ? "best" : ""}">
          <div class="rule-head">
            <h3>${escapeHtml(item.title)}</h3>
            <span class="tag ${item.status === "ok" ? "ok" : "wait"}">${item.status === "ok" ? "Hipótese forte" : "Conferir"}</span>
          </div>
          <p>${escapeHtml(item.summary)}</p>
          <ul>
            ${item.requirements.map((req) => `<li>${escapeHtml(req)}</li>`).join("")}
            ${item.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

reportForm.addEventListener("submit", generateReport);

copyReport.addEventListener("click", async () => {
  if (!lastReportText) return;
  syncReportOwner();
  await navigator.clipboard.writeText(lastReportText);
  copyReport.textContent = "Relatório copiado";
  setTimeout(() => {
    copyReport.textContent = "Copiar relatório";
  }, 1400);
});

downloadReport.addEventListener("click", () => {
  if (!lastReportText) return;
  syncReportOwner();
  const personName = form.elements.name.value.trim() || "segurado";
  const safeName = personName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const dateStamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([lastReportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-previdenciario-${safeName || "segurado"}-${dateStamp}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  downloadReport.textContent = "Relatório baixado";
  setTimeout(() => {
    downloadReport.textContent = "Baixar relatório";
  }, 1400);
});

reportForm.elements.reportOwner.addEventListener("input", syncReportOwner);
syncReportOwner();

benefitsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderBenefits(evaluateBenefits(normalizeBenefitsData()));
});

document.querySelectorAll(".document-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".document-tab").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".legal-document").forEach((item) => item.classList.toggle("active", item.id === button.dataset.document));
  });
});

generateDocuments.addEventListener("click", renderDocumentsFromForm);

generateContractPdf.addEventListener("click", async () => {
  const ok = await generatePdf(contractDocument, currentDocFilename("contrato-honorarios"));
  if (ok) saveCurrentDocumentsFlags(true, false);
});

generatePowerPdf.addEventListener("click", async () => {
  const ok = await generatePdf(powerDocument, currentDocFilename("procuracao"));
  if (ok) saveCurrentDocumentsFlags(false, true);
});

generateBothPdfs.addEventListener("click", async () => {
  const contractOk = await generatePdf(contractDocument, currentDocFilename("contrato-honorarios"));
  const powerOk = await generatePdf(powerDocument, currentDocFilename("procuracao"));
  if (contractOk || powerOk) saveCurrentDocumentsFlags(contractOk, powerOk);
});

clientsList.addEventListener("click", (event) => {
  const contractId = event.target.dataset.openContract;
  const powerId = event.target.dataset.openPower;
  if (!contractId && !powerId) return;
  const record = storage.all().find((item) => item.id === (contractId || powerId));
  if (!record) return;
  contractDocument.innerHTML = record.contractHtml || "";
  powerDocument.innerHTML = record.powerHtml || "";
  switchTab("benefitsTab");
  const target = contractId ? "contractDocument" : "powerDocument";
  document.querySelectorAll(".document-tab").forEach((item) => item.classList.toggle("active", item.dataset.document === target));
  document.querySelectorAll(".legal-document").forEach((item) => item.classList.toggle("active", item.id === target));
  document.querySelector("#documentPreviewPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

clientSearch.addEventListener("input", renderClients);
exportClientsCsv.addEventListener("click", exportClients);
currentStatus.addEventListener("change", () => updateLatestStatus(currentStatus.value));
generateOpinionPdf.addEventListener("click", generateOpinionPdfFile);

clientsList.addEventListener("change", (event) => {
  const recordId = event.target.dataset.statusRecord;
  if (!recordId) return;
  const records = storage.all();
  const record = records.find((item) => item.id === recordId);
  if (!record) return;
  record.status = event.target.value;
  storage.save(records);
  renderClients();
});
renderClients();
