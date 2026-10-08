(function () {
  const DAY = 24 * 60 * 60 * 1000;
  const REFERENCE_DATE = new Date("2026-06-10T00:00:00");

  function months(years, extraMonths = 0) {
    return Number(years || 0) * 12 + Number(extraMonths || 0);
  }

  function addMonths(date, amount) {
    const next = new Date(date.getTime());
    const day = next.getDate();
    next.setMonth(next.getMonth() + amount);
    if (next.getDate() < day) next.setDate(0);
    return next;
  }

  function ageInMonths(birthDate, atDate = REFERENCE_DATE) {
    let result = (atDate.getFullYear() - birthDate.getFullYear()) * 12;
    result += atDate.getMonth() - birthDate.getMonth();
    if (atDate.getDate() < birthDate.getDate()) result -= 1;
    return Math.max(0, result);
  }

  function formatMonths(totalMonths) {
    const total = Math.max(0, Math.round(totalMonths));
    const years = Math.floor(total / 12);
    const rest = total % 12;
    if (years === 0) return `${rest} mes${rest === 1 ? "" : "es"}`;
    if (rest === 0) return `${years} ano${years === 1 ? "" : "s"}`;
    return `${years} ano${years === 1 ? "" : "s"} e ${rest} mes${rest === 1 ? "" : "es"}`;
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
  }

  function requiredPoints(sex, year = REFERENCE_DATE.getFullYear(), teacher = false) {
    const baseYear = 2024;
    const base = teacher
      ? sex === "female"
        ? 86
        : 96
      : sex === "female"
        ? 91
        : 101;
    const cap = sex === "female" ? 100 : 105;
    return Math.min(cap, base + Math.max(0, year - baseYear));
  }

  function progressiveAgeMonths(sex, year = REFERENCE_DATE.getFullYear(), teacher = false) {
    const baseYear = 2024;
    const base = teacher
      ? sex === "female"
        ? months(53, 6)
        : months(58, 6)
      : sex === "female"
        ? months(58, 6)
        : months(63, 6);
    const cap = teacher ? (sex === "female" ? months(57) : months(60)) : sex === "female" ? months(62) : months(65);
    const increment = Math.max(0, year - baseYear) * 6;
    return Math.min(cap, base + increment);
  }

  function dateWhenAgeReached(birthDate, requiredAgeMonths) {
    return addMonths(birthDate, requiredAgeMonths);
  }

  function estimateDateFromMissingMonths(input, missingMonths) {
    if (missingMonths <= 0) return REFERENCE_DATE;
    return addMonths(REFERENCE_DATE, missingMonths);
  }

  function contributionDate(input, requiredMonths) {
    const missing = requiredMonths - input.contribMonths;
    return estimateDateFromMissingMonths(input, missing);
  }

  function balanceDate(currentMonths, requiredMonths) {
    return estimateDateFromMissingMonths({}, requiredMonths - currentMonths);
  }

  function laterDate(...dates) {
    return dates.reduce((latest, date) => (date > latest ? date : latest), dates[0]);
  }

  function monthsUntil(date) {
    if (date <= REFERENCE_DATE) return 0;
    return Math.ceil((date.getTime() - REFERENCE_DATE.getTime()) / (DAY * 30.4375));
  }

  function isSatisfied(date) {
    return date <= REFERENCE_DATE;
  }

  function benefitEstimate(input, ruleType) {
    const avg = Number(input.averageSalary || 0);
    if (!avg) return 0;
    if (ruleType === "pedagio50") return avg * 0.9;
    if (ruleType === "incapacity") return avg * (input.needsThirdPartyCare ? 1.25 : 1);
    const excessYears = Math.max(0, Math.floor(input.contribMonths / 12) - 20);
    return avg * Math.min(1, 0.6 + excessYears * 0.02);
  }

  function result(rule) {
    return {
      ...rule,
      eligible: isSatisfied(rule.eligibleDate),
      monthsUntil: monthsUntil(rule.eligibleDate),
    };
  }

  function ruleAge(input) {
    const ageReq = input.sex === "female" ? months(62) : months(65);
    const contribReq = input.sex === "male" && !input.startedBeforeReform ? months(20) : months(15);
    const date = laterDate(dateWhenAgeReached(input.birthDate, ageReq), contributionDate(input, contribReq));
    return result({
      id: "idade",
      title: "Aposentadoria por idade",
      type: "idade",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Idade mínima: ${formatMonths(ageReq)}`,
        `Tempo mínimo de contribuição: ${formatMonths(contribReq)}`,
        "Carência mínima considerada: 180 meses",
      ],
      notes: input.carencia >= 180 ? ["Carência informada atende ao mínimo."] : ["Carência informada abaixo de 180 meses."],
      disqualifier: input.carencia < 180 ? "Carência insuficiente." : null,
    });
  }

  function rulePoints(input, teacher = false) {
    const contribReq = teacher ? (input.sex === "female" ? months(25) : months(30)) : input.sex === "female" ? months(30) : months(35);
    const pointsReq = requiredPoints(input.sex, REFERENCE_DATE.getFullYear(), teacher);
    const currentPoints = ageInMonths(input.birthDate) / 12 + input.contribMonths / 12;
    const missingContribution = Math.max(0, contribReq - input.contribMonths);
    const missingPointsMonths = Math.max(0, Math.ceil((pointsReq - currentPoints) * 6));
    const date = estimateDateFromMissingMonths(input, Math.max(missingContribution, missingPointsMonths));
    return result({
      id: teacher ? "professor-pontos" : "pontos",
      title: teacher ? "Professor - regra dos pontos" : "Regra dos pontos",
      type: "points",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Pontuação exigida em 2026: ${pointsReq} pontos`,
        `Tempo mínimo: ${formatMonths(contribReq)}`,
        `Pontuação aproximada atual: ${currentPoints.toFixed(1)}`,
      ],
      notes: teacher ? ["Aplicável quando todo o tempo informado for de magistério na educação básica."] : ["Soma idade e tempo de contribuição."],
      disqualifier: !input.startedBeforeReform ? "Regra de transição: só vale para quem já contribuía até 13/11/2019." : teacher && !input.isTeacher ? "Marque professor(a) para avaliar esta regra." : null,
    });
  }

  function ruleProgressiveAge(input, teacher = false) {
    const contribReq = teacher ? (input.sex === "female" ? months(25) : months(30)) : input.sex === "female" ? months(30) : months(35);
    const ageReq = progressiveAgeMonths(input.sex, REFERENCE_DATE.getFullYear(), teacher);
    const date = laterDate(dateWhenAgeReached(input.birthDate, ageReq), contributionDate(input, contribReq));
    return result({
      id: teacher ? "professor-idade-progressiva" : "idade-progressiva",
      title: teacher ? "Professor - idade mínima progressiva" : "Idade mínima progressiva",
      type: "progressive",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Idade mínima em 2026: ${formatMonths(ageReq)}`,
        `Tempo mínimo: ${formatMonths(contribReq)}`,
      ],
      notes: teacher ? ["A idade progressiva do professor atinge limite menor que a regra comum."] : ["A idade sobe seis meses por ano ate o limite legal."],
      disqualifier: !input.startedBeforeReform ? "Regra de transição: só vale para quem já contribuía até 13/11/2019." : teacher && !input.isTeacher ? "Marque professor(a) para avaliar esta regra." : null,
    });
  }

  function ruleToll50(input) {
    const target = input.sex === "female" ? months(30) : months(35);
    const missingAtReform = target - input.contrib2019Months;
    const isAllowed = missingAtReform > 0 && missingAtReform <= 24;
    const required = target + Math.ceil(missingAtReform * 0.5);
    return result({
      id: "pedagio50",
      title: "Pedágio de 50%",
      type: "pedagio50",
      eligibleDate: contributionDate(input, required),
      estimatedBenefit: benefitEstimate(input, "pedagio50"),
      requirements: [
        `Faltava em 13/11/2019: ${formatMonths(Math.max(0, missingAtReform))}`,
        `Tempo final estimado: ${formatMonths(required)}`,
      ],
      notes: ["Regra restrita a quem estava a até dois anos do tempo mínimo na Reforma."],
      disqualifier: !input.startedBeforeReform ? "Regra de transição: só vale para quem já contribuía até 13/11/2019." : isAllowed ? null : "Não se enquadra porque faltavam mais de 2 anos ou já havia tempo completo em 13/11/2019.",
    });
  }

  function ruleToll100(input) {
    const target = input.sex === "female" ? months(30) : months(35);
    const ageReq = input.sex === "female" ? months(57) : months(60);
    const missingAtReform = Math.max(0, target - input.contrib2019Months);
    const required = target + missingAtReform;
    const date = laterDate(dateWhenAgeReached(input.birthDate, ageReq), contributionDate(input, required));
    return result({
      id: "pedagio100",
      title: "Pedágio de 100%",
      type: "pedagio100",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Idade mínima: ${formatMonths(ageReq)}`,
        `Tempo mínimo com pedágio: ${formatMonths(required)}`,
        `Pedágio calculado: ${formatMonths(missingAtReform)}`,
      ],
      notes: ["Pode ser interessante por cálculo de renda, mas exige idade e pedágio integral."],
      disqualifier: !input.startedBeforeReform ? "Regra de transição: só vale para quem já contribuía até 13/11/2019." : null,
    });
  }

  function ruleSpecial(input) {
    const exposure = Number(input.specialExposureYears || 25);
    const pointsReq = exposure === 15 ? 66 : exposure === 20 ? 76 : 86;
    const currentPoints = ageInMonths(input.birthDate) / 12 + input.specialContributionMonths / 12;
    const missingExposure = Math.max(0, months(exposure) - input.specialContributionMonths);
    const missingPointsMonths = Math.max(0, Math.ceil((pointsReq - currentPoints) * 6));
    const date = estimateDateFromMissingMonths(input, Math.max(missingExposure, missingPointsMonths));
    return result({
      id: "especial",
      title: "Transição da aposentadoria especial",
      type: "special",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Exposição mínima: ${exposure} anos`,
        `Pontuação exigida: ${pointsReq} pontos`,
        `Pontuação aproximada atual: ${currentPoints.toFixed(1)}`,
      ],
      notes: ["Depende de PPP/LTCAT e enquadramento técnico da exposição.", "Regra de transição para filiados ao RGPS até 13/11/2019."],
      disqualifier: !input.isSpecial
        ? "Marque atividade especial para avaliar esta regra."
        : !input.startedBeforeReform
          ? "Use a regra especial permanente para filiação após a Reforma."
          : input.carencia < 180
            ? "Carência insuficiente para aposentadoria especial."
            : null,
    });
  }

  function ruleSpecialPermanent(input) {
    const exposure = Number(input.specialExposureYears || 25);
    const ageReq = exposure === 15 ? months(55) : exposure === 20 ? months(58) : months(60);
    const exposureReq = months(exposure);
    const date = laterDate(dateWhenAgeReached(input.birthDate, ageReq), balanceDate(input.specialContributionMonths, exposureReq));
    return result({
      id: "especial-permanente",
      title: "Aposentadoria especial - regra permanente",
      type: "special",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Idade mínima: ${formatMonths(ageReq)}`,
        `Exposição mínima: ${formatMonths(exposureReq)}`,
        "Carência mínima considerada: 180 meses",
      ],
      notes: ["Aplica idade mínima para segurados filiados a partir de 14/11/2019.", "Depende de prova técnica da exposição nociva."],
      disqualifier: !input.isSpecial
        ? "Marque atividade especial para avaliar esta regra."
        : input.startedBeforeReform
          ? "Regra permanente mostrada como referência; para filiados antes da Reforma, avalie também a transição."
          : input.carencia < 180
            ? "Carência insuficiente para aposentadoria especial."
            : null,
    });
  }

  function ruleDisabilityAge(input) {
    const ageReq = input.sex === "female" ? months(55) : months(60);
    const disabilityReq = months(15);
    const date = laterDate(dateWhenAgeReached(input.birthDate, ageReq), balanceDate(input.disabilityContributionMonths, disabilityReq));
    return result({
      id: "pcd-idade",
      title: "Pessoa com deficiência - aposentadoria por idade",
      type: "disability",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Idade mínima: ${formatMonths(ageReq)}`,
        "Tempo mínimo na condição de pessoa com deficiência: 15 anos",
        "Carência mínima considerada: 180 meses",
      ],
      notes: ["Exige avaliação biopsicossocial no INSS.", "O tempo deve ter sido cumprido na condição de pessoa com deficiência."],
      disqualifier: !input.hasDisability
        ? "Marque pessoa com deficiência para avaliar esta regra."
        : input.carencia < 180
          ? "Carência insuficiente."
          : null,
    });
  }

  function disabilityContributionRequirement(input) {
    const table = {
      severe: { female: 20, male: 25, label: "grave" },
      moderate: { female: 24, male: 29, label: "moderada" },
      mild: { female: 28, male: 33, label: "leve" },
    };
    const row = table[input.disabilityDegree] || table.mild;
    return { months: months(row[input.sex]), label: row.label };
  }

  function ruleDisabilityContribution(input) {
    const requirement = disabilityContributionRequirement(input);
    const date = balanceDate(input.disabilityContributionMonths, requirement.months);
    return result({
      id: "pcd-tempo",
      title: "Pessoa com deficiência - tempo de contribuição",
      type: "disability",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Grau informado: deficiência ${requirement.label}`,
        `Tempo mínimo: ${formatMonths(requirement.months)}`,
        "Não há idade mínima nessa modalidade.",
      ],
      notes: ["O grau é definido por avaliação médica e funcional; o app usa o grau informado apenas para triagem."],
      disqualifier: !input.hasDisability
        ? "Marque pessoa com deficiência para avaliar esta regra."
        : input.carencia < 180
          ? "Carência insuficiente."
          : null,
    });
  }

  function rulePermanentIncapacity(input) {
    const carencyOk = input.carencia >= 12 || input.incapacityCarencyWaived;
    return result({
      id: "incapacidade-permanente",
      title: "Aposentadoria por incapacidade permanente",
      type: "incapacity",
      eligibleDate: REFERENCE_DATE,
      estimatedBenefit: benefitEstimate(input, "incapacity"),
      requirements: [
        "Incapacidade permanente para qualquer atividade laboral",
        "Impossibilidade de reabilitação em outra profissão",
        input.incapacityCarencyWaived ? "Carência indicada como dispensada" : "Carência mínima operacional: 12 contribuições",
      ],
      notes: [
        "Depende de parecer da Perícia Médica Federal.",
        input.needsThirdPartyCare ? "Marcado possível acréscimo de 25% por assistência permanente de terceiros." : "Pode haver acréscimo de 25% se houver necessidade de assistência permanente de terceiros.",
      ],
      disqualifier: !input.isPermanentlyIncapable
        ? "Marque incapacidade permanente para avaliar esta regra."
        : !carencyOk
          ? "Carência insuficiente, salvo hipótese legal de dispensa."
          : null,
    });
  }

  function ruleRuralAge(input) {
    const ageReq = input.sex === "female" ? months(55) : months(60);
    const ruralReq = months(15);
    const date = laterDate(dateWhenAgeReached(input.birthDate, ageReq), balanceDate(input.ruralContributionMonths, ruralReq));
    return result({
      id: "rural-idade",
      title: "Aposentadoria por idade rural",
      type: "rural",
      eligibleDate: date,
      estimatedBenefit: benefitEstimate(input, "standard"),
      requirements: [
        `Idade mínima: ${formatMonths(ageReq)}`,
        "Tempo rural comprovável: 180 meses",
      ],
      notes: ["Exige comprovação documental do exercício de atividade rural.", "Pode haver análise específica para segurado especial e aposentadoria híbrida."],
      disqualifier: input.isRuralWorker ? null : "Marque trabalhador(a) rural para avaliar esta regra.",
    });
  }

  function rulePortuaryAssistance(input) {
    const date = dateWhenAgeReached(input.birthDate, months(60));
    const missing = [];
    if (!input.portuaryRegistry15Years) missing.push("registro ativo há 15 anos");
    if (!input.portuaryAttendance80) missing.push("comparecimento mínimo de 80%");
    return result({
      id: "portuario-assistencial",
      title: "Benefício assistencial do trabalhador portuário avulso",
      type: "assistance",
      eligibleDate: date,
      estimatedBenefit: 0,
      requirements: [
        "Idade mínima: 60 anos",
        "Cadastro ou registro ativo como portuário avulso há pelo menos 15 anos",
        "Comparecimento a pelo menos 80% das convocações e turnos escalados",
      ],
      notes: ["Não é aposentadoria contributiva; é benefício assistencial específico.", "A renda deve ser conferida pela norma aplicável e pela análise administrativa."],
      disqualifier: !input.isPortuaryWorker
        ? "Marque trabalhador portuário avulso para avaliar este benefício."
        : missing.length
          ? `Pendências informadas: ${missing.join(", ")}.`
          : null,
    });
  }

  function parseForm(raw) {
    const birthDate = new Date(`${raw.birthDate}T00:00:00`);
    const input = {
      ...raw,
      birthDate,
      contribMonths: months(raw.contribYears, raw.contribMonths),
      contrib2019Months: months(raw.contrib2019Years, raw.contrib2019Months),
      specialContributionMonths: months(raw.specialYears, raw.specialMonths),
      disabilityContributionMonths: months(raw.disabilityYears, raw.disabilityMonths),
      ruralContributionMonths: months(raw.ruralYears, raw.ruralMonths),
      carencia: Number(raw.carencia || 0),
      averageSalary: Number(raw.averageSalary || 0),
      startedBeforeReform: Boolean(raw.startedBeforeReform),
      isTeacher: Boolean(raw.isTeacher),
      isSpecial: Boolean(raw.isSpecial),
      hasDisability: Boolean(raw.hasDisability),
      disabilityDegree: raw.disabilityDegree || "mild",
      isPermanentlyIncapable: Boolean(raw.isPermanentlyIncapable),
      incapacityCarencyWaived: Boolean(raw.incapacityCarencyWaived),
      needsThirdPartyCare: Boolean(raw.needsThirdPartyCare),
      isRuralWorker: Boolean(raw.isRuralWorker),
      isPortuaryWorker: Boolean(raw.isPortuaryWorker),
      portuaryRegistry15Years: Boolean(raw.portuaryRegistry15Years),
      portuaryAttendance80: Boolean(raw.portuaryAttendance80),
    };
    return input;
  }

  function compareRetirementRules(raw) {
    const input = parseForm(raw);
    const candidates = [
      ruleAge(input),
      rulePoints(input),
      ruleProgressiveAge(input),
      ruleToll50(input),
      ruleToll100(input),
      rulePoints(input, true),
      ruleProgressiveAge(input, true),
      ruleSpecial(input),
      ruleSpecialPermanent(input),
      ruleDisabilityAge(input),
      ruleDisabilityContribution(input),
      rulePermanentIncapacity(input),
      ruleRuralAge(input),
      rulePortuaryAssistance(input),
    ].map((item) => ({
      ...item,
      available: !item.disqualifier,
    }));

    const valid = candidates.filter((item) => item.available);
    const best = valid.sort((a, b) => {
      if (a.monthsUntil !== b.monthsUntil) return a.monthsUntil - b.monthsUntil;
      return b.estimatedBenefit - a.estimatedBenefit;
    })[0];

    return {
      input,
      best,
      candidates,
      referenceDate: REFERENCE_DATE,
    };
  }

  window.RetirementRules = {
    compareRetirementRules,
    formatDate,
    formatMonths,
    ageInMonths,
    referenceDate: REFERENCE_DATE,
  };
})();
