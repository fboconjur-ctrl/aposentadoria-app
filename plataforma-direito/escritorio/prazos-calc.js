// Calculadora de prazos processuais. Funções puras (testáveis em Node) + interface no painel.
// Regras: CPC arts. 219 (dias úteis), 220 (recesso 20/12–20/01), 224 (exclui o dia do começo, inclui o do
// vencimento, prorroga para o 1º dia útil); Lei 11.419/2006, art. 4º, §§3º–4º (publicação = 1º dia útil após a
// disponibilização; prazo começa no 1º dia útil seguinte à publicação) e art. 5º, §3º (ciência tácita em 10 dias corridos).
const Prazos = (() => {
  const pad = (n) => String(n).padStart(2, "0");
  const chave = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dia = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d, 12); };
  const soma = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);

  function pascoa(ano) { // algoritmo de Meeus/Jones/Butcher
    const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31), d2 = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, d2, 12);
  }
  // Feriados nacionais (Leis 662/1949, 6.802/1980, 10.607/2002, 14.759/2023) + Sexta-feira Santa.
  function feriadosNacionais(ano) {
    const p = pascoa(ano), f = new Map();
    [["01-01", "Confraternização Universal"], ["04-21", "Tiradentes"], ["05-01", "Dia do Trabalho"], ["09-07", "Independência"], ["10-12", "Nossa Senhora Aparecida"],
      ["11-02", "Finados"], ["11-15", "Proclamação da República"], ["11-20", "Dia Nacional de Zumbi e da Consciência Negra"], ["12-25", "Natal"]]
      .forEach(([md, n]) => f.set(`${ano}-${md}`, n));
    f.set(chave(soma(p, -2)), "Sexta-feira Santa");
    return f;
  }
  // Datas sem expediente forense usuais na maioria dos tribunais (conferir no calendário do tribunal).
  function feriadosForenses(ano) {
    const p = pascoa(ano), f = new Map();
    f.set(chave(soma(p, -48)), "Carnaval (segunda)"); f.set(chave(soma(p, -47)), "Carnaval (terça)"); f.set(chave(soma(p, -46)), "Quarta-feira de Cinzas (verificar expediente)");
    f.set(chave(soma(p, -3)), "Quinta-feira Santa"); f.set(chave(soma(p, 60)), "Corpus Christi");
    f.set(`${ano}-08-11`, "Dia da Justiça (verificar)"); f.set(`${ano}-12-08`, "Dia da Justiça / Imaculada Conceição (verificar)");
    return f;
  }
  const noRecesso = (d) => (d.getMonth() === 11 && d.getDate() >= 20) || (d.getMonth() === 0 && d.getDate() <= 20);

  function motivoNaoUtil(d, op) {
    const k = chave(d);
    if (d.getDay() === 0) return "domingo";
    if (d.getDay() === 6) return "sábado";
    if (op.recesso && noRecesso(d)) return "recesso forense (CPC, art. 220)";
    if (op.extras?.has(k)) return op.extras.get(k);
    const nac = feriadosNacionais(d.getFullYear()).get(k); if (nac) return nac;
    if (op.forenses) { const fo = feriadosForenses(d.getFullYear()).get(k); if (fo) return fo; }
    return null;
  }
  const proximoUtil = (d, op, pulos) => { let x = d; for (let m; (m = motivoNaoUtil(x, op)); x = soma(x, 1)) pulos.push([chave(x), m]); return x; };

  /**
   * calcular({ marco: "AAAA-MM-DD", tipoMarco: "disponibilizacao"|"publicacao"|"intimacao"|"portal", dias, contagem: "uteis"|"corridos",
   *            dobro, recesso, forenses, extras: Map(data → motivo) })
   */
  function calcular(o) {
    const op = { recesso: o.recesso !== false, forenses: o.forenses !== false, extras: o.extras || new Map() };
    const pulos = [], passos = [];
    let marco = dia(o.marco);
    if (o.tipoMarco === "disponibilizacao") {
      const pub = proximoUtil(soma(marco, 1), op, pulos);
      passos.push(["Disponibilização", chave(marco)], ["Publicação (1º dia útil seguinte — Lei 11.419/2006, art. 4º, §3º)", chave(pub)]);
      marco = pub;
    } else if (o.tipoMarco === "portal") {
      const ciencia = soma(marco, 10); // ciência tácita: 10 dias corridos do envio
      passos.push(["Envio da intimação no portal", chave(marco)], ["Ciência presumida (10 dias corridos — Lei 11.419/2006, art. 5º, §3º)", chave(ciencia)]);
      marco = proximoUtil(ciencia, op, pulos); if (chave(marco) !== chave(ciencia)) passos.push(["Ciência prorrogada para dia útil", chave(marco)]);
    } else passos.push([o.tipoMarco === "publicacao" ? "Publicação" : "Intimação / ciência", chave(marco)]);

    const total = (+o.dias || 0) * (o.dobro ? 2 : 1);
    const inicio = proximoUtil(soma(marco, 1), op, pulos); // exclui o dia do começo (art. 224)
    passos.push(["Início da contagem (1º dia útil seguinte — CPC, art. 224, §3º)", chave(inicio)]);
    let fim = inicio, contados = 1;
    if (o.contagem === "corridos") { fim = soma(inicio, total - 1); }
    else while (contados < total) { fim = soma(fim, 1); const m = motivoNaoUtil(fim, op); if (m) pulos.push([chave(fim), m]); else contados++; }
    const fimUtil = proximoUtil(fim, op, pulos); // vencimento em dia sem expediente prorroga (art. 224, §1º)
    if (chave(fimUtil) !== chave(fim)) passos.push(["Vencimento original caiu em dia sem expediente", chave(fim)]);
    passos.push([`Vencimento (${total} dia${total > 1 ? "s" : ""} ${o.contagem === "corridos" ? "corridos" : "úteis"}${o.dobro ? ", em dobro" : ""})`, chave(fimUtil)]);
    const vistos = new Set();
    return { vencimento: chave(fimUtil), inicio: chave(inicio), passos, pulos: pulos.filter(([k]) => !vistos.has(k) && vistos.add(k)) };
  }
  return { calcular, pascoa, feriadosNacionais, feriadosForenses, chave };
})();
if (typeof module !== "undefined") module.exports = Prazos;
