// Leitura de documentos do cliente (RG/CIN, CPF, CNH, comprovante de endereço) direto no navegador.
// PDF com texto: pdf.js. Foto ou PDF digitalizado: OCR (Tesseract, português). Nada é enviado a servidor.
const LeituraDocs = (() => {
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
  const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  const TESSERACT = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";

  let tessCarregado = null;
  const carregarTesseract = () => tessCarregado ||= new Promise((ok, erro) => {
    const s = document.createElement("script"); s.src = TESSERACT; s.onload = () => ok(window.Tesseract); s.onerror = () => erro(new Error("não foi possível carregar o leitor de imagens")); document.head.appendChild(s);
  });
  async function ocr(imagem, aoProgredir) {
    const T = await carregarTesseract();
    const { data } = await T.recognize(imagem, "por", { logger: (m) => m.status === "recognizing text" && aoProgredir?.(Math.round(m.progress * 100)) });
    return data.text || "";
  }
  async function textoDoPdf(file, aoProgredir) {
    const pdfjs = await import(PDFJS); pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    let txt = "";
    for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
      const pg = await pdf.getPage(i);
      const c = await pg.getTextContent();
      // Reconstrói linhas pela posição vertical.
      const linhas = new Map();
      c.items.forEach((it) => { const y = Math.round(it.transform[5]); linhas.set(y, (linhas.get(y) || "") + it.str + " "); });
      txt += [...linhas.entries()].sort((a, b) => b[0] - a[0]).map(([, l]) => l.trim()).join("\n") + "\n";
      if (txt.replace(/\s/g, "").length < 40) { // PDF digitalizado: renderiza e faz OCR
        const vp = pg.getViewport({ scale: 2 }); const cv = document.createElement("canvas"); cv.width = vp.width; cv.height = vp.height;
        await pg.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
        txt += await ocr(cv, aoProgredir);
      }
    }
    return txt;
  }
  const lerArquivo = (file, aoProgredir) => /pdf$/i.test(file.type) || /\.pdf$/i.test(file.name) ? textoDoPdf(file, aoProgredir) : ocr(file, aoProgredir);

  // ---------- extração ----------
  const semAc = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "");
  function cpfValido(c) {
    c = c.replace(/\D/g, ""); if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +c[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
    return dv(9) === +c[9] && dv(10) === +c[10];
  }
  const fmtCpf = (c) => (c = c.replace(/\D/g, "")).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const ehNome = (l) => /^[A-ZÀ-Ú][A-ZÀ-Ú' ]{4,}$/.test(l.trim()) && l.trim().split(/\s+/).length >= 2 && !/\b(REPUBLICA|FEDERATIVA|BRASIL|MINISTERIO|SECRETARIA|CARTEIRA|IDENTIDADE|NACIONAL|HABILITACAO|ESTADO|GOVERNO|INSTITUTO|DETRAN|DEPARTAMENTO|ASSINATURA|VALIDA|TERRITORIO|REGISTRO|GERAL|FILIACAO|NATURALIDADE|NASCIMENTO|POLEGAR|DIREITO|TITULAR|DOCUMENTO|ORIGEM|OBSERVA)/.test(semAc(l).toUpperCase());

  function extrair(texto) {
    const t = texto.replace(/\r/g, "");
    const linhas = t.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
    const T = semAc(t).toUpperCase();
    const r = {};
    // CPF: primeiro número com dígitos verificadores válidos.
    for (const m of t.matchAll(/\b\d{3}\.?\s?\d{3}\.?\s?\d{3}\s?[-–]?\s?\d{2}\b/g)) if (cpfValido(m[0])) { r.cpf = fmtCpf(m[0]); break; }
    // Nome: linha após o rótulo NOME; senão, primeira linha em maiúsculas com cara de nome.
    const iNome = linhas.findIndex((l) => /^NOME\b(?!\s*SOCIAL)/.test(semAc(l).toUpperCase()));
    if (iNome >= 0) {
      const resto = linhas[iNome].replace(/^nome\s*(\/\s*name)?\s*:?\s*/i, "");
      r.nome = ehNome(resto) ? resto : linhas.slice(iNome + 1, iNome + 3).find(ehNome);
    }
    // Data de nascimento.
    const nasc = T.match(/NASCIMENTO[^\d]{0,40}(\d{2}\/\d{2}\/\d{4})/);
    if (nasc) r.nascimento = nasc[1];
    // RG e órgão expedidor.
    const org = T.match(/\b(SSP|SESP|SESDS|SDS|PC|PCDF|PCMG|IIRGD|IFP|IGP|SEJUSP|SSPDS|DGPC|DETRAN|SPTC)\s*[\/\- ]\s*([A-Z]{2})\b/);
    if (org) r.orgao = `${org[1]}/${org[2]}`;
    const rg = T.match(/(?:REGISTRO GERAL|\bRG\b|IDENTIDADE)[^\d]{0,25}([\d][\d.\-xX ]{4,14}\d|[\d]{5,})/);
    if (rg) r.rg = rg[1].replace(/\s+/g, "");
    // Naturalidade.
    const iNat = linhas.findIndex((l) => /NATURALIDADE/i.test(semAc(l)));
    if (iNat >= 0) { const v = linhas[iNat].replace(/.*naturalidade\s*:?\s*/i, "") || linhas[iNat + 1] || ""; v = v.split(/\s+(?:DATA|NASC|DOC|CPF)\b/i)[0].trim(); if (/[A-Za-z]/.test(v)) r.naturalidade = v; }
    // Filiação (ajuda a conferir).
    const iFil = linhas.findIndex((l) => /FILIA[CÇ][AÃ]O/i.test(l));
    if (iFil >= 0) r.filiacao = linhas.slice(iFil + 1, iFil + 3).filter(ehNome).join(" e ");
    // Endereço (comprovante): linha com logradouro + CEP.
    const cep = t.match(/\b\d{5}-?\d{3}\b/g)?.find((c) => !r.cpf || !r.cpf.replace(/\D/g, "").includes(c.replace(/\D/g, "")));
    const LOGR = /^(RUA|R\.|AV\.?|AVENIDA|ALAMEDA|TRAVESSA|TV\.?|RODOVIA|ESTRADA|PRA[CÇ]A|QUADRA|QD\.?|SQ[NS]|SHIN|SHIS|SHI[NS]|CLS[WN]?|QN[A-Z]?|QR|QS|QE|QI|CONJ|SETOR|SCS|SCN|SRTV|SMPW|SMDB|CSB|CNB|QNL|QNM|QNN|CH[AÁ]CARA|COND|LOTE|VILA)\b/i;
    const iEnd = linhas.findIndex((l) => LOGR.test(semAc(l)));
    if (iEnd >= 0) {
      const partes = [linhas[iEnd]];
      for (const l of linhas.slice(iEnd + 1, iEnd + 3)) { if (/\b[A-Z]{2}\b|BAIRRO|CEP|\d{5}-?\d{3}|\/[A-Z]{2}/i.test(l) && l.length < 80) partes.push(l); else break; }
      let end = partes.join(", ").replace(/\s*,\s*,/g, ",");
      if (cep && !end.includes(cep)) end += `, CEP ${cep.replace(/(\d{5})-?(\d{3})/, "$1-$2")}`;
      r.endereco = end;
    } else if (cep) r.cep = cep;
    return r;
  }

  return { lerArquivo, extrair, cpfValido };
})();
if (typeof module !== "undefined") module.exports = LeituraDocs;
