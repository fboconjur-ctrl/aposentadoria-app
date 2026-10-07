// Prescrição penal (CP, arts. 109, 110, 114, 115, 117 e 10). Funções puras + uso no painel e na plataforma.
const Prescricao = (() => {
  // Art. 109 (redação da Lei 12.234/2010): prazo conforme a pena (em meses).
  function prazoArt109(penaMeses) {
    if (penaMeses > 144) return 20;
    if (penaMeses > 96) return 16;
    if (penaMeses > 48) return 12;
    if (penaMeses > 24) return 8;
    if (penaMeses >= 12) return 4;
    return 3;
  }
  const dia = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d, 12); };
  const chave = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  // CP, art. 10: inclui o dia do começo; anos e meses pelo calendário comum → termina na véspera do aniversário.
  function termo(inicio, anos, meses = 0) {
    const d = dia(inicio);
    const alvo = new Date(d.getFullYear() + anos, d.getMonth() + meses, d.getDate(), 12);
    if (alvo.getDate() !== d.getDate()) alvo.setDate(0); // ex.: 29/02 → último dia do mês
    alvo.setDate(alvo.getDate() - 1);
    return chave(alvo);
  }
  /**
   * calcular({ modalidade: "abstrata"|"concreta"|"executoria", penaAnos, penaMeses, aumentoMax: "1/3", diminuicaoMin: "1/6",
   *            menor21, maior70, reincidente, soMulta, marcos: [{ nome, data }] (em ordem cronológica) })
   */
  function calcular(o) {
    const fr = (t) => { const m = String(t || "").match(/(\d+)\s*\/\s*(\d+)/); return m ? +m[1] / +m[2] : 0; };
    let pena = (+o.penaAnos || 0) * 12 + (+o.penaMeses || 0);
    const notas = [];
    if (o.modalidade === "abstrata") {
      if (fr(o.aumentoMax)) { pena *= 1 + fr(o.aumentoMax); notas.push(`Pena máxima com a causa de aumento na fração máxima (${o.aumentoMax}).`); }
      if (fr(o.diminuicaoMin)) { pena *= 1 - fr(o.diminuicaoMin); notas.push(`Causa de diminuição na fração mínima (${o.diminuicaoMin}).`); }
    }
    let anos = o.soMulta ? 2 : prazoArt109(pena);
    notas.unshift(o.soMulta ? "Pena só de multa: 2 anos (CP, art. 114, I)." : `Pena considerada: ${Math.floor(pena / 12)} ano(s) e ${Math.round(pena % 12)} mês(es) → ${anos} anos (CP, art. 109).`);
    let meses = 0;
    if (o.modalidade === "executoria" && o.reincidente) { meses = anos * 12 / 3; notas.push("Reincidência: prazo da prescrição executória aumentado de 1/3 (CP, art. 110)."); }
    if (o.menor21 || o.maior70) { const total = (anos * 12 + meses) / 2; anos = Math.floor(total / 12); meses = Math.round(total % 12); notas.push("Redução pela metade: menor de 21 anos na data do fato ou maior de 70 na data da sentença (CP, art. 115)."); }
    const totalMeses = anos * 12 + meses; anos = Math.floor(totalMeses / 12); meses = Math.round(totalMeses % 12);
    const rotulo = `${anos} ano(s)${meses ? ` e ${meses} mês(es)` : ""}`;
    const marcos = (o.marcos || []).filter((m) => m.data).sort((a, b) => a.data.localeCompare(b.data));
    const intervalos = [];
    for (let i = 0; i < marcos.length; i++) {
      const fim = termo(marcos[i].data, anos, meses), prox = marcos[i + 1];
      intervalos.push({ de: marcos[i], ate: prox || null, termo: fim, prescreveu: prox ? prox.data > fim : null });
    }
    if (o.modalidade === "concreta" && marcos[0] && /fato/i.test(marcos[0].nome) && marcos[0].data >= "2010-05-06")
      notas.push("Fato posterior à Lei 12.234/2010: a prescrição retroativa não pode ter por termo inicial data anterior à denúncia ou queixa (CP, art. 110, §1º) — o intervalo fato → recebimento só vale para a prescrição em abstrato.");
    const ultimo = intervalos[intervalos.length - 1];
    return { anos, meses, rotulo, notas, intervalos, proximaData: ultimo ? ultimo.termo : null, jaPrescreveu: intervalos.some((x) => x.prescreveu) };
  }
  return { calcular, prazoArt109, termo };
})();
if (typeof module !== "undefined") module.exports = Prescricao;
