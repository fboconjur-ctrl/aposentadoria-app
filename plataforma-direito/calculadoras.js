// Interface das calculadoras (prazo processual e prescrição penal), usada na plataforma pública e no escritório.
const Calculadoras = (() => {
  const h = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const br = (k) => k ? k.split("-").reverse().join("/") : "—";
  const hojeIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const AVISO = "Cálculo de conferência. Feriados locais, suspensões de expediente e particularidades do caso podem alterar o resultado — confirme com um(a) advogado(a).";

  function prazo(el) {
    el.innerHTML = `<form class="calc">
      <div class="calc-grid">
        <label>Tipo de processo<select name="contagem"><option value="uteis">Cível, trabalhista, Juizado, previdenciário (dias úteis)</option><option value="penal">Penal (dias corridos — CPP, art. 798)</option><option value="corridos">Outro prazo em dias corridos</option></select></label>
        <label>A partir de<select name="tipoMarco"><option value="disponibilizacao">Disponibilização no Diário (DJEN/DJe)</option><option value="publicacao">Publicação</option><option value="intimacao">Intimação / ciência</option><option value="portal">Intimação no portal eletrônico</option></select></label>
        <label>Data<input type="date" name="marco" required value="${hojeIso()}"></label>
        <label>Prazo (dias)<input type="number" name="dias" min="1" value="15" required></label>
      </div>
      <label class="calc-check"><input type="checkbox" name="recesso" checked> <span class="rec-txt">Considerar recesso de 20/12 a 20/01</span></label>
      <label class="calc-check"><input type="checkbox" name="dobro"> Prazo em dobro (Fazenda Pública, MP, Defensoria)</label>
      <button class="btn" type="submit">Calcular</button>
      <div class="calc-res" hidden></div></form>`;
    const f = el.querySelector("form");
    const ajusta = () => { const pen = f.contagem.value === "penal"; f.querySelector(".rec-txt").textContent = pen ? "Suspensão de 20/12 a 20/01 (CPP, art. 798-A) — desmarque se houver réu preso, Lei Maria da Penha ou medida urgente" : "Considerar recesso de 20/12 a 20/01 (CPC, art. 220)"; };
    f.contagem.onchange = ajusta; ajusta();
    f.onsubmit = (e) => {
      e.preventDefault();
      const r = Prazos.calcular({ marco: f.marco.value, tipoMarco: f.tipoMarco.value, dias: f.dias.value, contagem: f.contagem.value, dobro: f.dobro.checked, recesso: f.recesso.checked, forenses: true });
      const v = new Date(r.vencimento + "T12:00");
      const res = f.querySelector(".calc-res"); res.hidden = false;
      res.innerHTML = `<p class="calc-venc">Vence em <b>${v.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</b></p>
        <ol>${r.passos.map(([t, d]) => `<li><b>${br(d)}</b> — ${h(t)}</li>`).join("")}</ol>
        ${r.pulos.length ? `<details><summary>${r.pulos.length} dia(s) pulado(s) (sem expediente ou suspensão)</summary><ul>${r.pulos.map(([d, m]) => `<li>${br(d)} — ${h(m)}</li>`).join("")}</ul></details>` : ""}
        <p class="calc-aviso">${AVISO}</p>`;
      el.dispatchEvent(new CustomEvent("calculado", { detail: { tipo: "prazo", r } }));
    };
  }

  function prescricao(el) {
    el.innerHTML = `<form class="calc">
      <div class="calc-grid">
        <label>Modalidade<select name="modalidade"><option value="abstrata">Pela pena máxima do crime (antes da sentença)</option><option value="concreta">Pela pena aplicada (retroativa / intercorrente)</option><option value="executoria">Executória (após o trânsito em julgado)</option></select></label>
        <label>Pena — anos<input type="number" name="penaAnos" min="0" value="4"></label>
        <label>Pena — meses<input type="number" name="penaMeses" min="0" max="11" value="0"></label>
        <label class="so-abstrata">Causa de aumento (fração máxima)<input name="aumentoMax" placeholder="ex.: 1/3"></label>
        <label class="so-abstrata">Causa de diminuição (fração mínima)<input name="diminuicaoMin" placeholder="ex.: 1/6"></label>
      </div>
      <label class="calc-check"><input type="checkbox" name="menor21"> Menor de 21 anos na data do fato</label>
      <label class="calc-check"><input type="checkbox" name="maior70"> Maior de 70 anos na data da sentença</label>
      <label class="calc-check so-exec"><input type="checkbox" name="reincidente"> Reincidente (aumenta 1/3 na executória)</label>
      <label class="calc-check"><input type="checkbox" name="soMulta"> Pena apenas de multa</label>
      <p class="calc-sub">Datas que interrompem a prescrição (CP, art. 117) — preencha as que já ocorreram</p>
      <div class="calc-grid">
        <label>Data do fato<input type="date" name="m_fato"></label>
        <label>Recebimento da denúncia/queixa<input type="date" name="m_denuncia"></label>
        <label>Pronúncia (júri)<input type="date" name="m_pronuncia"></label>
        <label>Sentença/acórdão condenatório publicado<input type="date" name="m_sentenca"></label>
        <label class="so-exec">Trânsito em julgado para a acusação<input type="date" name="m_transito"></label>
      </div>
      <button class="btn" type="submit">Calcular prescrição</button>
      <div class="calc-res" hidden></div></form>`;
    const f = el.querySelector("form");
    const ajusta = () => { el.querySelectorAll(".so-abstrata").forEach((x) => (x.hidden = f.modalidade.value !== "abstrata")); el.querySelectorAll(".so-exec").forEach((x) => (x.hidden = f.modalidade.value !== "executoria")); };
    f.modalidade.onchange = ajusta; ajusta();
    f.onsubmit = (e) => {
      e.preventDefault();
      const mod = f.modalidade.value;
      const marcos = mod === "executoria" ? [{ nome: "Trânsito em julgado para a acusação", data: f.m_transito.value }]
        : [["Data do fato", f.m_fato.value], ["Recebimento da denúncia/queixa", f.m_denuncia.value], ["Pronúncia", f.m_pronuncia.value], ["Sentença/acórdão condenatório", f.m_sentenca.value]]
            .filter(([n]) => !(mod === "concreta" && n === "Data do fato" && f.m_fato.value >= "2010-05-06")).map(([nome, data]) => ({ nome, data }));
      const r = Prescricao.calcular({ modalidade: mod, penaAnos: f.penaAnos.value, penaMeses: f.penaMeses.value, aumentoMax: f.aumentoMax.value, diminuicaoMin: f.diminuicaoMin.value,
        menor21: f.menor21.checked, maior70: f.maior70.checked, reincidente: f.reincidente.checked, soMulta: f.soMulta.checked, marcos });
      const res = f.querySelector(".calc-res"); res.hidden = false;
      const hoje = hojeIso();
      res.innerHTML = `<p class="calc-venc">Prazo prescricional: <b>${h(r.rotulo)}</b></p>
        <ul>${r.notas.map((n) => `<li>${h(n)}</li>`).join("")}</ul>
        ${r.intervalos.length ? `<table class="calc-tab"><thead><tr><th>Período</th><th>Prescreveria em</th><th>Situação</th></tr></thead><tbody>${r.intervalos.map((i) => {
          const sit = i.ate ? (i.prescreveu ? "⚠️ prazo esgotado antes do marco seguinte" : "interrompida a tempo") : (i.termo < hoje ? "⚠️ prazo já esgotado" : "em curso");
          return `<tr><td>${h(i.de.nome)} (${br(i.de.data)}) → ${i.ate ? `${h(i.ate.nome)} (${br(i.ate.data)})` : "hoje"}</td><td>${br(i.termo)}</td><td>${sit}</td></tr>`; }).join("")}</tbody></table>` : `<p>Informe as datas para ver se o prazo já se esgotou.</p>`}
        <p class="calc-aviso">Contagem pelo CP, art. 10 (inclui o dia do começo). Não considera suspensões (art. 116, ex.: ANPP, parcelamento, réu citado por edital), concurso de crimes (art. 119: cada crime isoladamente) nem detração. ${AVISO}</p>`;
      el.dispatchEvent(new CustomEvent("calculado", { detail: { tipo: "prescricao", r } }));
    };
  }
  return { prazo, prescricao };
})();
