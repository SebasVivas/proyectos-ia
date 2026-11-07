/* secciones/30-viabilidad.js — ¿El casco aguanta?: rúbrica de viabilidad técnica y semáforo */
(() => {
"use strict";
const R = window.DemosIA ? DemosIA.RUBRICA : { dimensiones:[], niveles:{} };
const EJEMPLO = {
  datos:"Tenemos 3 años de datos transaccionales con variables relevantes al problema.",
  infra:"Contamos con acceso a la nube (AWS, de Amazon) y capacidad de GPU (procesadores que aceleran el entrenamiento).",
  talento:"Equipo de data scientists disponible y un consultor externo de ML.",
  gobernanza:"No existe política de uso de datos ni comité de ética. Se debe crear antes del piloto.",
  integracion:"Los sistemas legados no tienen API (puerta para que otros sistemas les pidan datos). Se requiere desarrollo de middleware (software puente entre sistemas)."
};
const COLOR_NIVEL = { 5:"#a7ff9c", 4:"#a7ff9c", 3:"#c5c5c5", 2:"#ff6831", 1:"#ff6831" };

/* ===================================================== APERTURA + RÚBRICA */
Clase.seccion({
  id:"viabilidad", orden:30,
  indice:{ texto:"¿El casco aguanta?", ir:"viabilidad", nota:"Viabilidad técnica: rúbrica de 5 dimensiones" },
  creditos:["«Port Adelaide Dock, with the barque Primera and Elder Smith and Co Wool and Grain Store», Samuel White Sweet, CC0, vía Wikimedia Commons"],
  css:`
  .s-viabilidad.vi-portada{overflow:hidden}
  .s-viabilidad .vi-foto{position:absolute;inset:0;pointer-events:none;overflow:hidden}
  .s-viabilidad .vi-foto img{position:absolute;left:-4%;top:-6%;width:108%;height:112%;object-fit:cover;object-position:50% 40%;mix-blend-mode:multiply;will-change:transform}
  .s-viabilidad .vi-cab{position:relative;z-index:2;max-width:46vw;background:#c5c5c5;padding:28px 32px 32px;margin-left:-32px}
  .s-viabilidad .vi-cab h2{font-size:var(--step-display)}
  .s-viabilidad .vi-cab p{font-size:var(--step-lead);line-height:1.3;margin-top:20px;max-width:30ch}
  .s-viabilidad .vi-cinco{position:absolute;left:var(--margen);bottom:48px;z-index:2;list-style:none;display:flex;flex-wrap:wrap;gap:8px}
  .s-viabilidad .vi-cinco li{background:#000;color:#fff;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;padding:12px 18px 10px}
  .s-viabilidad.vi-rubrica{min-height:100svh;background:#fff;color:#000;padding:112px var(--margen) 64px}
  .s-viabilidad .ru-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:end}
  .s-viabilidad .ru-cab h2{grid-column:1/8;font-size:var(--step-head)}
  .s-viabilidad .ru-cab p{grid-column:8/13;font-size:var(--step-body)}
  .s-viabilidad .ru-cuerpo{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);margin-top:40px}
  .s-viabilidad .ru-dims{grid-column:1/4;display:flex;flex-direction:column;gap:8px}
  .s-viabilidad .ru-dims button{text-align:left;border:2px solid #000;background:#fff;cursor:pointer;padding:14px 18px;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;transition:background-color .2s,color .2s,translate .2s}
  .s-viabilidad .ru-dims button:hover{translate:6px 0}
  .s-viabilidad .ru-dims button[aria-selected="true"]{background:#000;color:#fff}
  .s-viabilidad .ru-dims button:focus-visible{outline:3px solid #000;outline-offset:3px}
  .s-viabilidad .ru-niveles{grid-column:4/13;list-style:none;display:flex;flex-direction:column;gap:6px}
  .s-viabilidad .ru-nivel{display:grid;grid-template-columns:150px 1fr;align-items:center;gap:24px;padding:14px 22px;min-height:68px}
  .s-viabilidad .ru-nivel b{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-viabilidad .ru-nivel b small{display:block;font-family:var(--f-texto);font-weight:600;font-size:var(--step-small);letter-spacing:0;margin-top:4px}
  .s-viabilidad .ru-nivel span{font-size:var(--step-body);line-height:1.35}
  .s-viabilidad .ru-regla{margin-top:28px;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15;max-width:60ch}
  @media (max-width:900px){.s-viabilidad .vi-cab{max-width:none}.s-viabilidad .ru-dims,.s-viabilidad .ru-niveles,.s-viabilidad .ru-cab h2,.s-viabilidad .ru-cab p{grid-column:1/-1}.s-viabilidad .ru-niveles{margin-top:24px}}
  `,
  html:`
  <span class="ancla" data-parada="viabilidad"></span>
  <section class="s-viabilidad vi-portada cap" data-campo="gris" style="--campo:#c5c5c5;--tinta:#000" aria-labelledby="vi-titulo">
    <div class="vi-foto" aria-hidden="true"><img src="img/viabilidad/casco.jpg" alt="" width="1660" height="1125"></div>
    <div class="vi-cab">
      <h2 id="vi-titulo"><span class="mask"><span class="in">¿El casco</span></span><span class="mask"><span class="in">aguanta?</span></span></h2>
      <p>Antes de invertir, validen estas cinco dimensiones. Un rojo no significa cancelar: significa planificar cómo resolverlo.</p>
    </div>
    <ul class="vi-cinco" aria-label="Las cinco dimensiones">${R.dimensiones.map(d => `<li>${d.n}</li>`).join("")}</ul>
  </section>
  <span class="ancla" data-parada="rubrica"></span>
  <section class="s-viabilidad vi-rubrica" data-campo="blanco" aria-labelledby="ru-titulo">
    <div class="ru-cab">
      <h2 id="ru-titulo">La rúbrica, de 5 a 1</h2>
      <p>Usen esta escala para calificar cada dimensión antes de aprobar la inversión en el proyecto de IA. Elijan una dimensión.</p>
    </div>
    <div class="ru-cuerpo">
      <div class="ru-dims" role="tablist" aria-label="Dimensiones de viabilidad técnica" data-teclas-propias>
        ${R.dimensiones.map((d, i) => `<button type="button" role="tab" id="ru-tab-${d.id}" aria-controls="ru-panel" aria-selected="false" tabindex="-1">${d.n}</button>`).join("")}
      </div>
      <ol class="ru-niveles" id="ru-panel" role="tabpanel" aria-live="polite">
        ${[5, 4, 3, 2, 1].map(v => `<li class="ru-nivel" data-v="${v}" style="background:${COLOR_NIVEL[v]}"><b>${v} · ${R.niveles[v]}<small>${v >= 4 ? "Listo" : v === 3 ? "En proceso" : "Requiere acción"}</small></b><span></span></li>`).join("")}
      </ol>
    </div>
    <p class="ru-regla">${R.regla}</p>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    const port = raiz.querySelector(".vi-portada"), rub = raiz.querySelector(".vi-rubrica");
    const tabs = [...rub.querySelectorAll('[role="tab"]')], niveles = [...rub.querySelectorAll(".ru-nivel")];
    function elegir(i, foco){
      const d = R.dimensiones[i];
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
      rub.querySelector(".ru-niveles").setAttribute("aria-labelledby", "ru-tab-" + d.id);
      niveles.forEach(li => { li.querySelector("span").textContent = d.d[li.dataset.v] + "."; });
      if (foco) tabs[i].focus();
      if (!reducir) gsap.fromTo(niveles.map(li => li.querySelector("span")), { y:14, opacity:0 }, { y:0, opacity:1, duration:.4, ease:"power3.out", stagger:.05 });
    }
    tabs.forEach((t, i) => t.addEventListener("click", () => elegir(i)));
    rub.querySelector(".ru-dims").addEventListener("keydown", e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      if (["ArrowDown", "ArrowRight"].includes(e.key)){ e.preventDefault(); elegir((i + 1) % tabs.length, true); }
      if (["ArrowUp", "ArrowLeft"].includes(e.key)){ e.preventDefault(); elegir((i - 1 + tabs.length) % tabs.length, true); }
    });
    elegir(0);
    if (reducir) return;
    gsap.fromTo(port.querySelector(".vi-foto img"), { scale:1.12, yPercent:-3 }, { scale:1, yPercent:3, ease:"none", scrollTrigger:{ trigger:port, start:"top bottom", end:"bottom top", scrub:true } });
    gsap.timeline({ scrollTrigger:{ trigger:port, start:"top 65%", toggleActions:"play none none reverse" } })
      .from(port.querySelectorAll("h2 .in"), { yPercent:110, duration:1, ease:"power4.out", stagger:.1 })
      .from(port.querySelector(".vi-cab p"), { y:20, opacity:0, duration:.6, ease:"power3.out" }, .3)
      .from(port.querySelectorAll(".vi-cinco li"), { y:40, opacity:0, duration:.5, ease:"back.out(1.8)", stagger:.07 }, .45);
    gsap.from(niveles, { scaleX:0, transformOrigin:"0 50%", duration:.7, ease:"power4.out", stagger:.07, scrollTrigger:{ trigger:rub, start:"top 60%" } });
    gsap.from(tabs, { x:-30, opacity:0, duration:.5, ease:"power3.out", stagger:.06, scrollTrigger:{ trigger:rub, start:"top 60%" } });
  }
});

/* ===================================================== SEMÁFORO: BALDOSAS QUE CRECEN */
Clase.seccion({
  id:"semaforo", orden:33,
  indice:{ texto:"El semáforo del proyecto", ir:"semaforo", nota:"Califiquen su proyecto: la altura es el puntaje" },
  css:`
  .s-semaforo{min-height:100svh;background:#fff;color:#000;padding:112px var(--margen) 72px}
  .s-semaforo .sem-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:16px;align-items:end;margin-bottom:28px}
  .s-semaforo .sem-cab h2{grid-column:1/7;font-size:var(--step-head)}
  .s-semaforo .sem-cab .sem-texto{grid-column:1/7}
  .s-semaforo .sem-modo{grid-column:1/7;display:flex;gap:12px;flex-wrap:wrap}
  .s-semaforo .sem-modo .boton{height:44px;background:#fff}
  .s-semaforo .sem-modo .boton[aria-pressed="true"]{background:#000;color:#fff}
  .s-semaforo .veredicto{grid-column:8/13;grid-row:1/4;align-self:end}
  .s-semaforo .veredicto strong{display:block;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:.95;letter-spacing:-.03em}
  .s-semaforo .veredicto span{display:block;margin-top:10px}
  .s-semaforo .baldosas{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));column-gap:10px}
  .s-semaforo .zona{height:38vh;min-height:220px;display:flex;align-items:flex-end}
  .s-semaforo .baldosa{width:100%;height:20%;background:var(--menta);padding:16px 18px;display:flex;flex-direction:column;justify-content:flex-start;transition:background-color .3s;overflow:hidden}
  .s-semaforo .baldosa[data-estado="ambar"]{background:var(--gris)}
  .s-semaforo .baldosa[data-estado="rojo"]{background:var(--naranja)}
  .s-semaforo .b-num{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:.9}
  .s-semaforo .b-nivel{font-weight:600}
  .s-semaforo .dim{display:flex;flex-direction:column}
  .s-semaforo .dim h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1;margin:14px 0 10px}
  .s-semaforo .ctrl{display:flex;flex-wrap:wrap;gap:5px}
  .s-semaforo .ctrl label{position:relative;display:block}
  .s-semaforo .ctrl input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
  .s-semaforo .ctrl span{display:grid;place-items:center;width:clamp(34px,2.9vw,44px);height:clamp(34px,2.9vw,44px);border:2px solid #000;font-weight:600;transition:background-color .15s,color .15s,translate .15s}
  .s-semaforo .ctrl input:hover + span{translate:0 -2px}
  .s-semaforo .ctrl input:checked + span{background:#000;color:#fff}
  .s-semaforo .ctrl input:focus-visible + span{outline:3px solid #000;outline-offset:3px}
  .s-semaforo .dim-ej{margin-top:10px;font-size:var(--step-small);line-height:1.45;font-weight:600}
  .s-semaforo .dim-desc{margin-top:6px;font-size:var(--step-small);line-height:1.45}
  .s-semaforo .sem-pie{margin-top:28px;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15}
  @media (max-width:900px){.s-semaforo .baldosas{grid-template-columns:1fr 1fr;row-gap:28px}.s-semaforo .sem-cab h2,.s-semaforo .sem-texto,.s-semaforo .sem-modo,.s-semaforo .veredicto{grid-column:1/-1;grid-row:auto}}
  `,
  html:`
  <span class="ancla" data-parada="semaforo"></span>
  <section class="s-semaforo" data-campo="blanco" aria-labelledby="sem-titulo">
    <div class="sem-cab">
      <h2 id="sem-titulo">¿Es viable su proyecto?</h2>
      <p class="sem-texto">Califiquen cada dimensión de 1 a 5. La altura de la baldosa es el puntaje; con un 2 o menos en cualquiera, se enciende la alerta.</p>
      <div class="sem-modo" role="group" aria-label="Qué evaluar">
        <button class="boton" type="button" data-modo="ejemplo" aria-pressed="true">Ejemplo de la clase</button>
        <button class="boton" type="button" data-modo="propio" aria-pressed="false">Su proyecto</button>
      </div>
      <div class="veredicto" aria-live="polite"><strong id="sem-ver-titulo"></strong><span id="sem-ver-texto"></span></div>
    </div>
    <div class="baldosas">
      ${R.dimensiones.map(d => `
      <div class="dim" data-dim="${d.id}">
        <div class="zona"><div class="baldosa"><span class="b-num"></span><span class="b-nivel"></span></div></div>
        <h3 id="sem-dn-${d.id}">${d.n}</h3>
        <div class="ctrl" role="radiogroup" aria-labelledby="sem-dn-${d.id}">${[1, 2, 3, 4, 5].map(v => `<label><input type="radio" name="sem-${d.id}" value="${v}" aria-label="${d.n}: ${v}, ${R.niveles[v]}"><span>${v}</span></label>`).join("")}</div>
        <p class="dim-ej"></p>
        <p class="dim-desc"></p>
      </div>`).join("")}
    </div>
    <p class="sem-pie">Para su proyecto: evalúen cada dimensión y propongan un plan para las que estén en rojo.</p>
  </section>`,
  iniciar({ gsap, reducir, raiz, DemosIA }){
    if (!DemosIA) return;
    const sec = raiz.querySelector(".s-semaforo"), valores = {};
    let modo = "ejemplo";
    const cargar = m => { modo = m; R.dimensiones.forEach(d => { valores[d.id] = m === "ejemplo" ? d.ejemplo : 3; }); };
    function pintar(animar){
      const r = DemosIA.evaluarSemaforo(valores);
      r.dims.forEach(d => {
        const el = sec.querySelector(`[data-dim="${d.id}"]`), b = el.querySelector(".baldosa");
        b.dataset.estado = d.estado;
        b.querySelector(".b-num").textContent = d.v;
        b.querySelector(".b-nivel").textContent = d.nivel;
        el.querySelectorAll("input").forEach(inp => { inp.checked = +inp.value === d.v; });
        el.querySelector(".dim-ej").textContent = modo === "ejemplo" ? "Ejemplo: " + EJEMPLO[d.id] : "";
        el.querySelector(".dim-desc").textContent = d.descriptor + ".";
        const alto = (d.v / 5 * 100) + "%";
        if (animar && !reducir) gsap.to(b, { height:alto, duration:.6, ease:"power3.out" }); else b.style.height = alto;
      });
      sec.querySelector("#sem-ver-titulo").textContent = r.alerta ? "Hay alerta" : "Puede avanzar";
      const nombres = r.enAlerta.map(d => `${d.n} (${d.v})`);
      sec.querySelector("#sem-ver-texto").textContent = r.alerta
        ? `${nombres.join(nombres.length > 2 ? ", " : " y ")} en 2 o menos. ${R.regla}`
        : `Ninguna dimensión está en 2 o menos. Promedio ${r.promedioTexto} de 5.`;
    }
    sec.querySelector(".baldosas").addEventListener("change", e => {
      const d = e.target.closest("[data-dim]"); if (!d) return;
      valores[d.dataset.dim] = +e.target.value; pintar(true);
    });
    sec.querySelectorAll(".sem-modo .boton").forEach(b => b.addEventListener("click", () => {
      sec.querySelectorAll(".sem-modo .boton").forEach(x => x.setAttribute("aria-pressed", x === b));
      cargar(b.dataset.modo); pintar(true);
    }));
    cargar("ejemplo"); pintar(false);
    if (reducir) return;
    gsap.from(sec.querySelectorAll(".baldosa"), { height:0, duration:.9, ease:"power3.out", stagger:.08, scrollTrigger:{ trigger:sec, start:"top 55%", toggleActions:"play none none reverse" } });
    gsap.from(sec.querySelectorAll(".sem-cab > *"), { y:28, opacity:0, duration:.7, ease:"power3.out", stagger:.07, scrollTrigger:{ trigger:sec, start:"top 70%" } });
  }
});
})();
