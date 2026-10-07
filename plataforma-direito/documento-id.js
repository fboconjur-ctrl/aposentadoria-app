// Validação de CPF e CNPJ (dígitos verificadores). Usada na plataforma e no escritório.
const DocId = (() => {
  const dig = (t) => String(t || "").replace(/\D/g, "");
  function cpf(t) {
    const c = dig(t); if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +c[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
    return dv(9) === +c[9] && dv(10) === +c[10];
  }
  function cnpj(t) {
    const c = dig(t); if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
    const dv = (n) => { const p = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; const s = p.reduce((a, w, i) => a + w * +c[i], 0) % 11; return s < 2 ? 0 : 11 - s; };
    return dv(12) === +c[12] && dv(13) === +c[13];
  }
  const valido = (t) => cpf(t) || cnpj(t);
  const formatar = (t) => { const c = dig(t); return c.length === 11 ? c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : c.length === 14 ? c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : String(t || "").trim(); };
  return { cpf, cnpj, valido, formatar };
})();
if (typeof module !== "undefined") module.exports = DocId;
