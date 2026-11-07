/* secciones/20-modelos.js — Selección del modelo, 7 capítulos con demos vivas y ¿qué modelo necesita su proyecto? */
(() => {
"use strict";
const NOMBRE = { clasificacion:"Clasificación", regresion:"Regresión y forecasting", clustering:"Clustering", recomendacion:"Recomendación", nlp:"NLP y texto", vision:"Visión artificial", generativa:"IA generativa" };
const ORDEN = ["menta", "gris", "naranja", "blanco", "negro", "menta", "naranja"];
const CAMPOS = {
  blanco:{ bg:"#ffffff", ink:"#000000" }, menta:{ bg:"#a7ff9c", ink:"#000000" }, gris:{ bg:"#c5c5c5", ink:"#000000" },
  naranja:{ bg:"#ff6831", ink:"#000000" }, negro:{ bg:"#000000", ink:"#ffffff" }
};
const FUENTE = '"Figtree", system-ui, sans-serif';
const PAL = {
  menta:{ fondo:"#a7ff9c", tinta:"#000", sec:"#000", acento:"#ff6831", acentoLinea:"#000", acentoSuave:"rgba(255,104,49,0.30)", reticula:"rgba(0,0,0,0.16)", tela:"#ffffff", textoSobreTinta:"#a7ff9c", tintaSobreAcento:"#000" },
  gris:{ fondo:"#c5c5c5", tinta:"#000", sec:"#000", acento:"#ff6831", acentoLinea:"#000", acentoSuave:"rgba(255,104,49,0.35)", reticula:"rgba(0,0,0,0.16)", tela:"#ffffff", textoSobreTinta:"#c5c5c5", tintaSobreAcento:"#000" },
  naranja:{ fondo:"#ff6831", tinta:"#000", sec:"#000", acento:"#a7ff9c", acentoLinea:"#000", acentoSuave:"rgba(167,255,156,0.45)", reticula:"rgba(0,0,0,0.18)", tela:"#ffffff", textoSobreTinta:"#ff6831", tintaSobreAcento:"#000" },
  blanco:{ fondo:"#ffffff", tinta:"#000", sec:"#000", acento:"#a7ff9c", acentoLinea:"#000", acentoSuave:"rgba(167,255,156,0.6)", reticula:"rgba(0,0,0,0.12)", tela:"#f2f2f2", textoSobreTinta:"#ffffff", tintaSobreAcento:"#000" },
  negro:{ fondo:"#000000", tinta:"#fff", sec:"#fff", acento:"#a7ff9c", acentoLinea:"#a7ff9c", acentoSuave:"rgba(167,255,156,0.22)", reticula:"rgba(255,255,255,0.2)", tela:"#1a1a1a", textoSobreTinta:"#000", tintaSobreAcento:"#000" }
};
Object.values(PAL).forEach(p => { p.fuenteMono = FUENTE; p.fuenteTexto = FUENTE; });
const M = window.DemosIA ? DemosIA.MODELOS : [];

/* ===================================================== SELECCIÓN DEL MODELO */
Clase.seccion({
  id:"modelos", orden:20,
  indice:{ texto:"Cada pregunta, su instrumento", ir:"modelos", nota:"Definición y selección del modelo de IA" },
  creditos:["«Navigation: a gimbal compass and a sextant», grabado, CC BY 4.0, vía Wikimedia Commons (Wellcome Collection)"],
  css:`
  .s-modelos{background:#fff;color:#000}
  .s-modelos .mo-portada{position:relative;height:100svh;min-height:640px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);padding:112px var(--margen) 48px;overflow:hidden}
  .s-modelos .mo-cab{grid-column:1/9;align-self:center;position:relative;z-index:2}
  .s-modelos h2{font-size:clamp(4rem,7.2vw,7.5rem)}
  .s-modelos .mo-cab p{font-size:var(--step-lead);line-height:1.3;margin-top:24px;max-width:34ch}
  .s-modelos .mo-lamina{grid-column:9/13;position:relative;overflow:hidden;margin:-112px 0 -48px;height:calc(100% + 160px)}
  .s-modelos .mo-lamina img{position:absolute;left:0;top:-8%;width:100%;height:116%;object-fit:cover;object-position:50% 30%;will-change:transform}
  .s-modelos .mo-tabla-env{padding:96px var(--margen) 120px}
  .s-modelos .mo-tabla-env h3{font-size:var(--step-head);margin-bottom:32px}
  .s-modelos table{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:var(--step-body);line-height:1.35}
  .s-modelos th{text-align:left;font-weight:600;font-size:var(--step-small);padding:0 16px 8px}
  .s-modelos td{padding:16px;background:#f2f2f2;vertical-align:top;transition:background-color .2s}
  .s-modelos tbody tr{cursor:pointer}
  .s-modelos tbody tr:hover td,.s-modelos tbody tr:focus-within td{background:var(--menta)}
  .s-modelos td:first-child{width:19%}
  .s-modelos td:first-child a{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05;text-decoration:none}
  .s-modelos td:first-child a:focus-visible{outline:3px solid #000;outline-offset:4px}
  .s-modelos td:nth-child(2){width:29%}
  .s-modelos td:nth-child(3){width:24%}
  .s-modelos .mo-nota{margin-top:28px;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15;max-width:52ch}
  @media (max-width:760px){.s-modelos .mo-cab{grid-column:1/-1}.s-modelos .mo-lamina{display:none}.s-modelos table{font-size:var(--step-small)}}
  `,
  html:`
  <span class="ancla" data-parada="modelos"></span>
  <section class="s-modelos" data-campo="blanco" aria-labelledby="mo-titulo">
    <div class="mo-portada">
      <div class="mo-cab">
        <h2 id="mo-titulo"><span class="mask"><span class="in">Cada pregunta,</span></span><span class="mask"><span class="in">su instrumento</span></span></h2>
        <p>No necesitan saber matemáticas para elegir el modelo correcto: necesitan entender el tipo de problema y qué pregunta quieren responder.</p>
      </div>
      <figure class="mo-lamina"><img src="img/modelos/instrumentos.jpg" alt="Lámina antigua de instrumentos de navegación: sextante, brújulas y rosas de los vientos" width="1100" height="1786"></figure>
    </div>
    <span class="ancla" data-parada="modelos-tabla"></span>
    <div class="mo-tabla-env">
      <h3>Definición y selección del modelo de IA</h3>
      <table>
        <thead><tr><th scope="col">Tipo de modelo</th><th scope="col">Pregunta de negocio</th><th scope="col">Algoritmos comunes</th><th scope="col">Cuándo usarlo</th></tr></thead>
        <tbody>${M.map((m, i) => `<tr data-ir-fila="modelo-${i + 1}"><td><a href="#modelo-${i + 1}" data-ir="modelo-${i + 1}">${NOMBRE[m.id]}</a></td><td>${m.pregunta}</td><td>${m.algos.replace(/ · /g, ", ")}</td><td>${m.cuando}</td></tr>`).join("")}</tbody>
      </table>
      <p class="mo-nota">No necesitan construirlo hoy: entiendan qué podrían resolver mañana con cada herramienta. Los siete capítulos que siguen muestran un ejemplo de cada una.</p>
    </div>
  </section>`,
  iniciar({ gsap, reducir, raiz, Clase }){
    const sec = raiz.querySelector(".s-modelos");
    sec.querySelectorAll("tbody tr").forEach(tr => tr.addEventListener("click", e => { if (!e.target.closest("a")) Clase.irA(tr.dataset.irFila); }));
    if (reducir) return;
    gsap.timeline({ scrollTrigger:{ trigger:sec, start:"top 65%" } })
      .from(sec.querySelectorAll("h2 .in"), { yPercent:110, duration:1, ease:"power4.out", stagger:.1 })
      .from(sec.querySelector(".mo-cab p"), { y:24, opacity:0, duration:.7, ease:"power3.out" }, .3)
      .from(sec.querySelector(".mo-lamina"), { clipPath:"inset(100% 0 0 0)", duration:1.3, ease:"power4.inOut" }, 0);
    gsap.fromTo(sec.querySelector(".mo-lamina img"), { yPercent:-6 }, { yPercent:6, ease:"none", scrollTrigger:{ trigger:sec.querySelector(".mo-portada"), start:"top bottom", end:"bottom top", scrub:true } });
    gsap.from(sec.querySelectorAll("tbody tr"), { x:-40, opacity:0, duration:.6, ease:"power3.out", stagger:.06, scrollTrigger:{ trigger:sec.querySelector("table"), start:"top 80%" } });
  }
});

/* ===================================================== LOS 7 CAPÍTULOS */
Clase.seccion({
  id:"capitulos", orden:21,
  indice:{ texto:"Los siete modelos", ir:"modelo-1", nota:"Clasificación, regresión, clustering, recomendación, NLP, visión y generativa" },
  css:`
  .s-capitulos.cap-modelo{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr;column-gap:var(--gap);row-gap:28px}
  .s-capitulos .cap-nombre{grid-column:1/-1;font-size:var(--step-display)}
  .s-capitulos .cap-texto{grid-column:1/6;display:flex;flex-direction:column;gap:16px;align-self:start}
  .s-capitulos .cap-pregunta{font-size:var(--step-lead);line-height:1.3;font-weight:600}
  .s-capitulos .cap-caso strong{font-weight:600}
  .s-capitulos .cap-res{font-family:var(--f-display);font-weight:700;font-size:clamp(2rem,1.3rem + 1.6vw,3rem);line-height:.95;letter-spacing:-.03em}
  .s-capitulos .cap-cuando,.s-capitulos .cap-algos{font-size:var(--step-small);line-height:1.45}
  .s-capitulos .cap-cuando b{font-weight:600}
  .s-capitulos .cap-demo{grid-column:6/13;display:flex;flex-direction:column;gap:10px;min-height:0;align-self:stretch}
  .s-capitulos .demo-marco{position:relative;flex:1;min-height:0;border:2px solid currentColor}
  .s-capitulos .cap-demo figcaption{display:flex;justify-content:space-between;gap:24px;font-size:var(--step-small);line-height:1.4}
  .s-capitulos .demo-lectura{font-weight:600;white-space:nowrap}
  .s-capitulos .demo-marco.dom{padding:28px 32px;display:flex;flex-direction:column;gap:20px;overflow:hidden}
  .s-capitulos .dia-nlp-meta{font-size:var(--step-small);font-weight:600}
  .s-capitulos .dia-nlp-texto{font-size:clamp(1.25rem,1rem + .8vw,1.75rem);line-height:2.35;font-weight:600}
  .s-capitulos .dia-nlp-texto .dia-seg{transition:background-color .25s,color .25s}
  .s-capitulos .dia-nlp-texto .dia-seg.dia-marcado{background:var(--menta);color:#000}
  .s-capitulos .dia-nlp-texto .dia-tag{font-size:13px;line-height:1.3;font-weight:600;background:#fff;color:#000;padding:1px 6px}
  .s-capitulos .dia-nlp-salida{margin-top:auto;border-top:2px solid currentColor;padding-top:14px}
  .s-capitulos .dia-nlp-salida b{font-weight:600;background:var(--menta);color:#000;padding:2px 8px}
  .s-capitulos .dia-gen-prompt{border:2px solid currentColor;padding:12px 16px;font-size:var(--step-small);line-height:1.5}
  .s-capitulos .dia-gen-prompt b{font-weight:600;background:#000;color:var(--naranja);padding:1px 8px;margin-right:10px}
  .s-capitulos .dia-gen-doc{flex:1;font-size:16px;line-height:1.55}
  .s-capitulos .dia-cursor{background:currentColor}
  @media (max-width:900px){.s-capitulos .cap-texto,.s-capitulos .cap-demo{grid-column:1/-1}.s-capitulos.cap-modelo{position:relative;height:auto;min-height:100svh}.s-capitulos .demo-marco{min-height:340px}}
  `,
  html: M.map((m, i) => {
    const c = ORDEN[i], cf = CAMPOS[c], dom = m.id === "nlp" || m.id === "generativa";
    return `
    <span class="ancla" data-parada="modelo-${i + 1}" id="modelo-${i + 1}"></span>
    <section class="s-capitulos cap cap-modelo" data-campo="${c}" data-paleta="${c}" data-modelo="${m.id}" style="--campo:${cf.bg};--tinta:${cf.ink}" aria-label="${NOMBRE[m.id]}">
      <h2 class="cap-nombre"><span class="mask"><span class="in">${NOMBRE[m.id]}</span></span></h2>
      <div class="cap-texto">
        <p class="cap-pregunta">${m.pregunta}</p>
        <p class="cap-caso">${m.sit} <strong>${m.alg}</strong> ${m.mod}</p>
        <p class="cap-res">${m.res}</p>
        <p class="cap-cuando"><b>Cuándo usarlo:</b> ${m.cuando}</p>
        <p class="cap-algos">Algoritmos comunes: ${m.algos.replace(/ · /g, ", ")}.</p>
      </div>
      <figure class="cap-demo" data-ui>
        <div class="demo-marco${dom ? " dom" : ""}"></div>
        <figcaption><span class="demo-pie">${m.fig}</span><span class="demo-lectura"></span></figcaption>
      </figure>
    </section>`;
  }).join(""),
  iniciar({ gsap, ScrollTrigger, reducir, raiz, DemosIA }){
    if (!DemosIA) return;
    const caps = [...raiz.querySelectorAll(".s-capitulos")].map(sec => ({ sec, id:sec.dataset.modelo, paleta:PAL[sec.dataset.paleta] }));
    caps.forEach(c => { c.demo = DemosIA.montar(c.sec.querySelector(".demo-marco"), c.id, { paleta:c.paleta, lectura:c.sec.querySelector(".demo-lectura") }); });
    caps.forEach(c => ScrollTrigger.create({ trigger:c.sec, start:"top bottom", end:() => "+=" + (innerHeight + c.sec.offsetHeight), onToggle(self){ if (c.demo) c.demo.pausado = !self.isActive; } }));
    if (reducir) return;
    caps.forEach(c => {
      gsap.timeline({ scrollTrigger:{ trigger:c.sec, start:"top 72%", toggleActions:"play none none reverse" } })
        .from(c.sec.querySelector(".cap-nombre .in"), { yPercent:105, duration:.9, ease:"power4.out" })
        .from(c.sec.querySelectorAll(".cap-texto > *"), { y:28, opacity:0, duration:.6, ease:"power3.out", stagger:.07 }, .15)
        .from(c.sec.querySelector(".cap-demo"), { y:48, opacity:0, duration:.8, ease:"power3.out" }, .2);
    });
  }
});

/* ===================================================== ¿QUÉ MODELO NECESITA SU PROYECTO? */
const TIPOS = ["clasificacion", "regresion", "clustering", "recomendacion", "nlp", "vision", "generativa"];
const PROYECTOS = [
  { n:"Agente del Reglamento Institucional", p:"El reglamento es extenso y difícil de consultar: las consultas se repiten, tardan y la respuesta cambia según quién la dé.",
    tipos:["nlp", "generativa"],
    porque:"Es un problema de lenguaje: entender la pregunta, encontrar el artículo correcto del reglamento vigente y redactar la respuesta citándolo. La pieza clave es buscar primero en el reglamento (búsqueda semántica) y generar después, para no inventar normas.",
    medir:"Porcentaje de respuestas correctas con el artículo citado, porcentaje de consultas que se derivan a una persona y tiempo de respuesta." },
  { n:"Evidentia: autoevaluación y acreditación", p:"La autoevaluación depende de tareas manuales e información dispersa; los informes se retrasan y sobrecargan a los equipos.",
    tipos:["nlp", "generativa"],
    porque:"Hay que leer y clasificar evidencias de muchas fuentes y luego redactar informes: lenguaje a la entrada y a la salida. El valor está en la trazabilidad: cada afirmación del informe tiene que apuntar a su evidencia.",
    medir:"Horas ahorradas por informe, porcentaje de evidencias bien clasificadas y número de correcciones que el comité le hace al borrador." },
  { n:"Acadixia: seguimiento académico", p:"El bajo rendimiento y la posible deserción se detectan tarde, cuando ya no hay tiempo para acompañar.",
    tipos:["clasificacion", "recomendacion"],
    porque:"Decir si un estudiante está en riesgo es una clasificación con su historia académica como datos; sugerir la acción de acompañamiento se parece a una recomendación. Es una decisión sobre personas: hay que explicar cada alerta y revisar el sesgo.",
    medir:"Recall de los estudiantes en riesgo (no dejar pasar a quien sí iba a desertar), precisión de las alertas y explicación de cada caso." },
  { n:"Nexus UAC: cuadro de mando", p:"La información de las áreas está dispersa: sin indicadores integrados no hay seguimiento de objetivos ni decisiones con evidencia.",
    tipos:["regresion", "clustering"],
    porque:"Un tablero solo visualiza. La IA entra cuando el tablero anticipa: pronosticar los indicadores y disparar alertas cuando un comportamiento se sale de lo normal (detección de anomalías).",
    medir:"Error del pronóstico por indicador (MAE o MAPE) y porcentaje de alertas que resultaron útiles para la dirección." },
  { n:"Pérdidas de energía: inspección predictiva", p:"Pérdidas no técnicas por fraude, manipulación de medidores y conexiones ilegales, con inspecciones de campo poco efectivas.",
    tipos:["clasificacion", "clustering"],
    porque:"Se trata de ordenar a quién inspeccionar primero: un puntaje de riesgo de fraude a partir del consumo y de los datos del medidor (clasificación), apoyado en detección de consumos anómalos (clustering).",
    medir:"Tasa de hallazgo de las inspecciones frente a la línea base del proyecto, y precisión y recall del puntaje de riesgo." }
];
Clase.seccion({
  id:"proyectos", orden:24,
  indice:{ texto:"¿Y su proyecto, qué modelo necesita?", ir:"proyectos", nota:"Una primera lectura de los cinco proyectos" },
  css:`
  .s-proyectos{min-height:100svh;background:#000;color:#fff;padding:112px var(--margen) 72px}
  .s-proyectos .pr-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:end}
  .s-proyectos h2{grid-column:1/9;font-size:var(--step-head)}
  .s-proyectos .pr-cab p{grid-column:9/13;font-size:var(--step-body)}
  .s-proyectos .pr-cuerpo{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);margin-top:40px}
  .s-proyectos .pr-lista{grid-column:1/6;display:flex;flex-direction:column;gap:8px}
  .s-proyectos .pr-lista button{display:block;width:100%;text-align:left;border:0;cursor:pointer;background:#1c1c1c;color:#fff;padding:16px 20px;transition:background-color .25s,color .25s,translate .25s}
  .s-proyectos .pr-lista button:hover{translate:6px 0}
  .s-proyectos .pr-lista button:focus-visible{outline:3px solid var(--menta);outline-offset:3px}
  .s-proyectos .pr-lista button[aria-selected="true"]{background:var(--menta);color:#000}
  .s-proyectos .pr-lista b{display:block;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-proyectos .pr-lista span{display:block;font-size:var(--step-small);line-height:1.4;margin-top:6px}
  .s-proyectos .pr-panel{grid-column:7/13}
  .s-proyectos .pr-tipos{list-style:none;display:flex;flex-wrap:wrap;gap:8px}
  .s-proyectos .pr-tipos li{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1;padding:12px 16px;background:#1c1c1c;color:#8a8a8a;transition:background-color .35s,color .35s}
  .s-proyectos .pr-tipos li.si{background:var(--naranja);color:#000}
  .s-proyectos .pr-tipos li small{display:none;font-family:var(--f-texto);font-weight:600;font-size:var(--step-small);letter-spacing:0;margin-left:10px}
  .s-proyectos .pr-tipos li.si small{display:inline}
  .s-proyectos .pr-lectura{margin-top:32px}
  .s-proyectos .pr-lectura h3{font-size:var(--step-lead);letter-spacing:-.02em;margin:24px 0 8px}
  .s-proyectos .pr-lectura p{font-size:var(--step-body);max-width:56ch}
  @media (max-width:900px){.s-proyectos .pr-lista,.s-proyectos .pr-panel,.s-proyectos h2,.s-proyectos .pr-cab p{grid-column:1/-1}.s-proyectos .pr-panel{margin-top:32px}}
  `,
  html:`
  <span class="ancla" data-parada="proyectos"></span>
  <section class="s-proyectos" data-campo="negro" aria-labelledby="pr-titulo">
    <div class="pr-cab">
      <h2 id="pr-titulo">¿Y su proyecto, qué modelo necesita?</h2>
      <p>Elijan su proyecto. Es una primera lectura para discutir: en el entregable la defienden o la cambian.</p>
    </div>
    <div class="pr-cuerpo">
      <div class="pr-lista" role="tablist" aria-label="Proyectos de la clase" data-teclas-propias>
        ${PROYECTOS.map((p, i) => `<button type="button" role="tab" id="pr-tab-${i}" aria-controls="pr-panel" aria-selected="false" tabindex="-1"><b>${p.n}</b><span>${p.p}</span></button>`).join("")}
      </div>
      <div class="pr-panel" id="pr-panel" role="tabpanel" aria-live="polite">
        <ul class="pr-tipos">${TIPOS.map(t => `<li data-tipo="${t}">${NOMBRE[t]}<small>encaja</small></li>`).join("")}</ul>
        <div class="pr-lectura">
          <h3>Por qué</h3><p class="pr-porque"></p>
          <h3>Cómo medirlo</h3><p class="pr-medir"></p>
        </div>
      </div>
    </div>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    const sec = raiz.querySelector(".s-proyectos"), tabs = [...sec.querySelectorAll('[role="tab"]')];
    const panel = sec.querySelector(".pr-panel"), tipos = [...sec.querySelectorAll(".pr-tipos li")];
    function elegir(i, foco){
      const p = PROYECTOS[i];
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute("aria-labelledby", "pr-tab-" + i);
      tipos.forEach(li => li.classList.toggle("si", p.tipos.includes(li.dataset.tipo)));
      sec.querySelector(".pr-porque").textContent = p.porque;
      sec.querySelector(".pr-medir").textContent = p.medir;
      if (foco) tabs[i].focus();
      if (!reducir){
        gsap.fromTo(tipos.filter(li => li.classList.contains("si")), { scale:.9 }, { scale:1, duration:.5, ease:"back.out(2.4)", stagger:.06 });
        gsap.fromTo(sec.querySelectorAll(".pr-lectura p"), { y:12, opacity:0 }, { y:0, opacity:1, duration:.45, ease:"power3.out", stagger:.06 });
      }
    }
    tabs.forEach((t, i) => t.addEventListener("click", () => elegir(i)));
    sec.querySelector(".pr-lista").addEventListener("keydown", e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      if (["ArrowDown", "ArrowRight"].includes(e.key)){ e.preventDefault(); elegir((i + 1) % tabs.length, true); }
      if (["ArrowUp", "ArrowLeft"].includes(e.key)){ e.preventDefault(); elegir((i - 1 + tabs.length) % tabs.length, true); }
    });
    elegir(0);
    if (reducir) return;
    gsap.from(sec.querySelectorAll(".pr-cab > *"), { y:32, opacity:0, duration:.8, ease:"power3.out", stagger:.08, scrollTrigger:{ trigger:sec, start:"top 70%" } });
    gsap.from(tabs, { x:-40, opacity:0, duration:.6, ease:"power3.out", stagger:.07, scrollTrigger:{ trigger:sec, start:"top 55%" } });
    gsap.from(tipos, { y:20, opacity:0, duration:.5, ease:"power3.out", stagger:.04, scrollTrigger:{ trigger:sec, start:"top 50%" } });
  }
});
})();
