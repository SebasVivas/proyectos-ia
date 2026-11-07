/* secciones/60-entregables.js — El taller: los dos entregables del módulo 03, con lista de avance y cronómetro */
(() => {
"use strict";
const PIZARRA = "#1d3a2f", TIZA = "#f1efe6", MENTA = "#a7ff9c";
/* Contrastes: tiza sobre pizarra 10,7:1; menta sobre pizarra 10,3:1; negro sobre menta 17,4:1 */
Clase.campo("taller-pizarra", { bg:PIZARRA, ink:TIZA, btn:[MENTA, "#000000"] });

const ENTREGAS = [
  {
    id:"entregables-tecnica", min:60,
    lineas:["Evaluación técnica", "y de mercado"],
    titulo:"Evaluación técnica y de mercado",
    sub:"Modelo de IA, viabilidad técnica y análisis de mercado.",
    aprendido:[
      "7 tipos de modelos de IA y cuándo usar cada uno.",
      "Cómo seleccionar el modelo correcto según el tipo de problema.",
      "El semáforo de viabilidad técnica: datos, infraestructura, talento y gobernanza.",
      "Análisis de mercado: segmento, competencia y propuesta de valor.",
      "Modelo de negocio para proyectos de IA.",
      "Análisis DOFA (debilidades, oportunidades, fortalezas y amenazas) aplicado al proyecto de IA."
    ],
    tareas:[
      { t:"Tipo de modelo de IA seleccionado y justificado", d:"¿Cuál es el tipo de modelo? ¿Por qué? ¿Qué algoritmos considerarían? Justifíquenlo en función del problema y de los datos disponibles." },
      { t:"Semáforo de viabilidad técnica del proyecto", d:"Evalúen las 5 dimensiones: datos, infraestructura, talento, gobernanza e integración. Para cada rojo, propongan cómo resolverlo." },
      { t:"Análisis de mercado resumido (DOFA)", d:"¿Quién necesita esta solución? ¿Existen alternativas? ¿Cuál es la propuesta de valor única? La matriz DOFA del proyecto, en media página." }
    ],
    proxima:"selección de modelo justificada + semáforo completo.",
    nota:"Grupal. Para la próxima sesión: selección de modelo justificada + semáforo completo",
    dibujo:{ src:"img/entregables/assets/taller-camara.jpg", w:900, h:1968, pos:"50% 22%",
      alt:"Grabado de una cámara oscura en trazo claro sobre verde: una caja con espejo y lente proyecta la imagen sobre una mesa de dibujo.",
      pie:"Cámara oscura para dibujar. Encyclopédie, lámina «Dessein», 1763." }
  },
  {
    id:"entregables-financiera", min:75,
    lineas:["Viabilidad financiera,", "legal y riesgos"],
    titulo:"Viabilidad financiera, legal y riesgos",
    sub:"ROI (retorno de la inversión), VPN (valor presente neto), payback (tiempo para recuperar la inversión), Ley 1581 (datos personales) y mapa de riesgos.",
    aprendido:[
      "Cómo estimar el CAPEX (inversión inicial) y el OPEX (costo anual de operación) de un proyecto de IA.",
      "Calcular ROI, payback y VPN con un caso práctico.",
      "Marco legal: Ley 1581 (datos personales en Colombia) y GDPR (reglamento europeo de datos).",
      "Sesgo algorítmico: qué es y cómo mitigarlo.",
      "Transparencia y explicabilidad (XAI): LIME y SHAP, que muestran cuánto pesa cada variable en una decisión.",
      "Construcción de un mapa de riesgos con probabilidad e impacto."
    ],
    tareas:[
      { t:"Evaluación financiera del proyecto", d:"Estimen el CAPEX total y el OPEX anual, y calculen el beneficio anual esperado. Con esos datos: ROI, payback y VPN a 3 años, con tasa del 12%. Pueden usar supuestos razonables." },
      { t:"Checklist legal y ético del proyecto", d:"¿Usan datos personales? ¿Aplica la Ley 1581? ¿Hay riesgo de sesgo? ¿El modelo es explicable ante los usuarios afectados? Una respuesta por ítem." },
      { t:"Mapa de riesgos del proyecto (top 5)", d:"Identifiquen los 5 riesgos más relevantes. Para cada uno: categoría, descripción, probabilidad, impacto y estrategia de mitigación." }
    ],
    proxima:"evaluación financiera + mapa de riesgos completos, para incluir en el caso de negocio.",
    nota:"Grupal. Para la próxima sesión: evaluación financiera + mapa de riesgos completos para incluir en el caso de negocio",
    dibujo:{ src:"img/entregables/assets/taller-balancier.jpg", w:1500, h:1015, pos:"46% 40%",
      alt:"Grabado de una prensa de acuñar monedas en trazo claro sobre verde: varios operarios hacen girar la barra, otro coloca las piezas desde un foso y hay canastas llenas de monedas.",
      pie:"Prensa para acuñar moneda. Encyclopédie, lámina «Monnoyage, balancier»." }
  }
];

const CHECK = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="3.5,12.5 6.6,9.4 10,12.8 17.4,5.4 20.5,8.5 10,19"/></svg>`;

function pantallaEntrega(e, i){
  return `
  <span class="ancla" id="${e.id}" data-parada="${e.id}"></span>
  <section class="s-entregables en-entrega" data-campo="taller-pizarra" aria-labelledby="${e.id}-titulo">
    <div class="en-e-cab">
      <h2 id="${e.id}-titulo">${e.lineas.map(l => `<span class="mask"><span class="in">${l}</span></span>`).join("")}</h2>
      <p class="en-e-sub">${e.sub}</p>
    </div>
    <div class="en-reloj">
      <div class="en-reloj-min"><p class="en-num" data-min="${e.min}">${e.min}</p><p class="en-num-txt">minutos,<br>en grupo</p></div>
      <button class="boton en-iniciar" type="button" data-i="${i}">Iniciar ${e.min} minutos</button>
      <p class="en-hora" data-min="${e.min}"></p>
    </div>
    <div class="en-aprendido">
      <h3>Lo que aprendieron en este módulo</h3>
      <ul>${e.aprendido.map(a => `<li>${a}</li>`).join("")}</ul>
      <figure class="en-dibujo">
        <div class="en-dibujo-marco"><img src="${e.dibujo.src}" width="${e.dibujo.w}" height="${e.dibujo.h}" alt="${e.dibujo.alt}" loading="lazy" decoding="async" style="object-position:${e.dibujo.pos}"></div>
        <figcaption>${e.dibujo.pie}</figcaption>
      </figure>
    </div>
    <div class="en-hoja" data-entrega="${e.id}">
      <h3>Su entregable: constrúyanlo ahora</h3>
      <ol class="en-lista">
        ${e.tareas.map((t, k) => `
        <li class="en-tarea">
          <input class="en-check" type="checkbox" id="${e.id}-t${k + 1}">
          <label for="${e.id}-t${k + 1}">
            <span class="en-caja">${CHECK}</span>
            <span class="en-tarea-txt"><strong>${t.t}</strong><span>${t.d}</span></span>
          </label>
          <span class="en-listo" aria-hidden="true">Listo</span>
        </li>`).join("")}
      </ol>
      <div class="en-hoja-pie">
        <p class="en-proxima"><strong>Para la próxima sesión:</strong> ${e.proxima}</p>
        <div class="en-avance">
          <p class="en-cuenta" aria-live="polite"></p>
          <button class="boton en-desmarcar" type="button">Desmarcar todo</button>
        </div>
      </div>
    </div>
  </section>`;
}

Clase.seccion({
  id:"entregables",
  orden:60,
  indice:{ texto:"El taller", ir:"entregables", nota:"Entregables del módulo 03, con lista de avance y cronómetro de 60 y 75 minutos" },
  creditos:[
    `<a href="https://commons.wikimedia.org/wiki/File:Planche_de_l%E2%80%99Encyclop%C3%A9die_de_Diderot_et_d%E2%80%99Alembert._Pl._1._Imprimerie_en_Lettres,_L%E2%80%99Op%C3%A9ration_de_la_casse,_G.33153.jpg">«Imprimerie en lettres, l’opération de la casse»</a>, Encyclopédie de Diderot y d’Alembert, dibujo de Louis-Jacques Goussier y grabado de Robert Bénard, CC0, vía Paris Musées y Wikimedia Commons. Invertido en tonos de tiza.`,
    `<a href="https://commons.wikimedia.org/wiki/File:Camera_obscura.png">«Dessein, chambre obscure»</a>, Encyclopédie de Diderot y d’Alembert, 1763, dominio público, vía Wikimedia Commons. Invertido en tonos de tiza.`,
    `<a href="https://commons.wikimedia.org/wiki/File:Monnoyage,_Balancier,_G.37125.jpg">«Monnoyage, balancier»</a>, Encyclopédie de Diderot y d’Alembert, Robert Bénard, CC0, vía Paris Musées y Wikimedia Commons. Invertido en tonos de tiza.`
  ],
  css:`
  .s-entregables{background:#1d3a2f;color:#f1efe6}
  .s-entregables h2,.s-entregables h3{color:#f1efe6}

  /* ---------- Apertura */
  .s-entregables.en-apertura{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr;column-gap:var(--gap);row-gap:24px}
  .s-entregables .en-ap-titulo{grid-column:1/13;grid-row:1;font-size:var(--step-display)}
  .s-entregables .en-ap-izq{grid-column:1/7;grid-row:2;display:flex;flex-direction:column;gap:24px;min-height:0}
  .s-entregables .en-lead{font-size:var(--step-lead);line-height:1.32;max-width:50ch}
  .s-entregables .en-ordenes{list-style:none;display:flex;flex-direction:column;gap:12px;margin-top:auto}
  .s-entregables .en-orden{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:18px;background:#a7ff9c;color:#000;text-decoration:none;padding:8px 20px 8px 8px;transition:translate .2s}
  .s-entregables .en-orden:hover{translate:6px 0}
  .s-entregables .en-orden:focus-visible{outline:3px solid #f1efe6;outline-offset:4px}
  .s-entregables .en-orden-img{width:clamp(56px,9svh,104px);aspect-ratio:4/5;overflow:hidden;background:#1d3a2f}
  .s-entregables .en-orden-img img{width:100%;height:100%;object-fit:cover}
  .s-entregables .en-orden-txt{display:flex;flex-direction:column;gap:6px}
  .s-entregables .en-orden-tit{color:#000;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.02}
  .s-entregables .en-orden-min{font-weight:600}
  .s-entregables .en-ap-grabado{grid-column:7/13;grid-row:2;margin-right:calc(-1 * var(--margen));display:flex;flex-direction:column;gap:10px;min-height:0}
  .s-entregables .en-marco{position:relative;flex:1;min-height:220px;overflow:hidden;background:#1d3a2f}
  .s-entregables .en-marco img{position:absolute;left:0;top:-6%;width:100%;height:112%;object-fit:cover;object-position:50% 40%}
  .s-entregables .en-ap-grabado figcaption{font-size:var(--step-small);line-height:1.45;padding-right:var(--margen);max-width:70ch}

  /* ---------- Pantallas de entregable */
  .s-entregables.en-entrega{min-height:100svh;padding:112px var(--margen) 48px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:28px;align-content:start;overflow:hidden}
  .s-entregables .en-e-cab{grid-column:1/9;grid-row:1}
  .s-entregables .en-e-cab h2{font-size:var(--step-head)}
  .s-entregables .en-e-sub{font-size:var(--step-lead);line-height:1.3;margin-top:14px}
  .s-entregables .en-reloj{grid-column:9/13;grid-row:1;align-self:end;display:flex;flex-direction:column;align-items:flex-start;gap:12px}
  .s-entregables .en-reloj-min{display:flex;align-items:flex-end;gap:12px;line-height:1.1}
  .s-entregables .en-num{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:.8;color:#a7ff9c;font-variant-numeric:tabular-nums}
  .s-entregables .en-num-txt{font-weight:600}
  .s-entregables .en-hora{font-size:var(--step-small);line-height:1.4;min-height:1.4em}
  .s-entregables .en-aprendido{grid-column:1/6;grid-row:2;display:flex;flex-direction:column}
  .s-entregables .en-aprendido h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-entregables .en-aprendido ul{list-style:none;margin-top:16px;display:flex;flex-direction:column;gap:10px}
  .s-entregables .en-aprendido li{position:relative;padding-left:24px;line-height:1.4}
  .s-entregables .en-aprendido li::before{content:"";position:absolute;left:0;top:.5em;width:10px;height:10px;background:#a7ff9c}
  .s-entregables .en-dibujo{flex:1;display:flex;flex-direction:column;gap:8px;margin:24px 0 0 calc(-1 * var(--margen));min-height:200px}
  .s-entregables .en-dibujo-marco{position:relative;flex:1;min-height:170px;overflow:hidden;background:#1d3a2f}
  .s-entregables .en-dibujo-marco img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .s-entregables .en-dibujo figcaption{font-size:var(--step-small);line-height:1.4;padding-left:var(--margen)}
  .s-entregables .en-hoja{grid-column:6/13;grid-row:2;align-self:start;background:#a7ff9c;color:#000;padding:28px 32px 26px}
  .s-entregables .en-hoja h3{color:#000;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-entregables .en-lista{list-style:none;margin-top:18px;display:flex;flex-direction:column;gap:16px}
  .s-entregables .en-tarea{position:relative}
  .s-entregables .en-check{position:absolute;left:0;top:0;width:40px;height:40px;margin:0;opacity:0;cursor:pointer;z-index:2}
  .s-entregables .en-tarea label{display:grid;grid-template-columns:40px 1fr;column-gap:18px;align-items:start;cursor:pointer}
  .s-entregables .en-caja{display:grid;place-items:center;width:40px;height:40px;border:2px solid #000;background:#a7ff9c;transition:background-color .2s}
  .s-entregables .en-caja svg{width:26px;height:26px;fill:#a7ff9c;visibility:hidden}
  .s-entregables .en-check:checked + label .en-caja{background:#000}
  .s-entregables .en-check:checked + label .en-caja svg{visibility:visible}
  .s-entregables .en-check:focus-visible + label .en-caja{outline:3px solid #000;outline-offset:3px}
  .s-entregables .en-tarea-txt strong{display:block;font-weight:600;font-size:var(--step-body);line-height:1.3}
  .s-entregables .en-tarea-txt span{display:block;margin-top:4px;line-height:1.42;max-width:62ch}
  .s-entregables .en-listo{display:none;position:absolute;right:0;top:0;background:#000;color:#a7ff9c;font-weight:600;font-size:var(--step-small);line-height:1;padding:7px 10px}
  .s-entregables .en-check:checked ~ .en-listo{display:block}
  .s-entregables .en-check:checked + label .en-tarea-txt strong{padding-right:64px}
  .s-entregables .en-hoja-pie{margin-top:20px;display:flex;flex-direction:column;gap:14px}
  .s-entregables .en-proxima{line-height:1.4;max-width:62ch}
  .s-entregables .en-proxima strong{font-weight:600}
  .s-entregables .en-avance{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .s-entregables .en-cuenta{font-weight:600}
  .s-entregables .en-hoja .boton:focus-visible{outline-color:#000}

  @media (max-width:900px){
    .s-entregables .en-ap-titulo,.s-entregables .en-ap-izq,.s-entregables .en-ap-grabado,.s-entregables .en-e-cab,.s-entregables .en-reloj,.s-entregables .en-aprendido,.s-entregables .en-hoja{grid-column:1/-1;grid-row:auto}
    .s-entregables.en-apertura{height:auto;min-height:100svh}
    .s-entregables .en-ap-grabado{margin-right:calc(-1 * var(--margen))}
    .s-entregables .en-marco{min-height:260px}
  }
  `,
  html:`
  <span class="ancla" id="entregables" data-parada="entregables"></span>
  <section class="s-entregables en-apertura cap" data-campo="taller-pizarra" style="--campo:${PIZARRA};--tinta:${TIZA}" aria-labelledby="entregables-titulo">
    <h2 class="en-ap-titulo" id="entregables-titulo"><span class="mask"><span class="in">Aquí se arma</span></span><span class="mask"><span class="in">el barco</span></span></h2>
    <div class="en-ap-izq">
      <p class="en-lead">Dos entregables del módulo 03. Lo que construyan hoy es lo que van a defender frente a los tiburones.</p>
      <ol class="en-ordenes">
        ${ENTREGAS.map(e => `
        <li><a class="en-orden" href="#${e.id}" data-ir="${e.id}">
          <span class="en-orden-img"><img src="${e.dibujo.src}" width="${e.dibujo.w}" height="${e.dibujo.h}" alt="" loading="lazy" decoding="async" style="object-position:${e.dibujo.pos}"></span>
          <div class="en-orden-txt"><h3 class="en-orden-tit">${e.titulo}</h3><p class="en-orden-min">${e.min} minutos, en grupo</p></div>
        </a></li>`).join("")}
      </ol>
    </div>
    <figure class="en-ap-grabado">
      <div class="en-marco"><img src="img/entregables/assets/taller-imprenta.jpg" width="1500" height="935" fetchpriority="high" decoding="async" alt="Grabado de un taller de imprenta del siglo XVIII en trazo claro sobre verde: tres cajistas de pie arman páginas, letra por letra, en sus cajas de tipos."></div>
      <figcaption>Un taller de imprenta: cada quien en su caja, armando la página letra por letra. Encyclopédie de Diderot y d’Alembert, lámina «Imprimerie en lettres».</figcaption>
    </figure>
  </section>
  ${ENTREGAS.map(pantallaEntrega).join("")}
  `,
  iniciar(ctx){
    const { gsap, reducir, raiz } = ctx;
    const C = ctx.Clase;

    /* ---- Lista de avance: estado local de la sesión del navegador */
    const GUARDADO = "clase-taller-entregables";
    let estado = {};
    try { estado = JSON.parse(sessionStorage.getItem(GUARDADO) || "{}") || {}; } catch (e){ estado = {}; }
    const guardar = () => { try { sessionStorage.setItem(GUARDADO, JSON.stringify(estado)); } catch (e){ /* sin almacenamiento */ } };
    raiz.querySelectorAll(".en-hoja").forEach(hoja => {
      const id = hoja.dataset.entrega;
      const checks = [...hoja.querySelectorAll(".en-check")];
      const cuenta = hoja.querySelector(".en-cuenta");
      const pintar = () => {
        const n = checks.filter(c => c.checked).length, t = checks.length;
        cuenta.textContent = n === 0 ? "Ninguno marcado todavía." : n === t ? `${t} de ${t} listos: entregable completo.` : `${n} de ${t} listos.`;
      };
      checks.forEach((c, k) => {
        c.checked = !!(estado[id] && estado[id][k]);
        c.addEventListener("change", () => {
          estado[id] = checks.map(x => x.checked); guardar(); pintar();
          if (!reducir && c.checked) gsap.fromTo(c.nextElementSibling.querySelector(".en-caja"), { scale:.72 }, { scale:1, duration:.5, ease:"back.out(2.6)" });
        });
      });
      hoja.querySelector(".en-desmarcar").addEventListener("click", () => {
        checks.forEach(c => { c.checked = false; }); estado[id] = checks.map(() => false); guardar(); pintar();
      });
      pintar();
    });

    /* ---- Cronómetro de taller a pantalla completa */
    raiz.querySelectorAll(".en-iniciar").forEach(b => b.addEventListener("click", () => {
      const e = ENTREGAS[+b.dataset.i];
      C.cronometro(e.min, e.titulo, e.nota);
    }));

    /* ---- A qué hora terminarían si arrancan ahora (reloj real del computador) */
    const horas = [...raiz.querySelectorAll(".en-hora")];
    const fmt = d => d.toLocaleTimeString("es-CO", { hour:"numeric", minute:"2-digit" });
    const pintarHoras = () => horas.forEach(h => { const t = fmt(new Date(Date.now() + (+h.dataset.min) * 60000)); h.textContent = `Si arrancan ahora, terminan a las ${t}${t.endsWith(".") ? "" : "."}`; });
    pintarHoras();
    setInterval(pintarHoras, 20000);

    if (reducir) return;

    /* ---- Movimiento firma: trazo de tiza (barridos de clip-path) y hojas que se clavan en la pizarra */
    const ap = raiz.querySelector(".en-apertura");
    const ancla = raiz.querySelector('[data-parada="entregables"]');
    gsap.timeline({ scrollTrigger:{ trigger:ancla, start:"top 78%", toggleActions:"play none none reverse" } })
      .from(ap.querySelectorAll(".en-ap-titulo .in"), { yPercent:105, duration:1, ease:"power4.out", stagger:.1 })
      .fromTo(ap.querySelector(".en-marco"), { clipPath:"inset(0% 100% 0% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", duration:1.5, ease:"power2.inOut" }, .1)
      .from(ap.querySelector(".en-lead"), { y:24, opacity:0, duration:.7, ease:"power3.out" }, .3)
      .from(ap.querySelectorAll(".en-orden"), { y:44, rotation:-3, opacity:0, duration:.8, ease:"power3.out", stagger:.12 }, .45);
    gsap.fromTo(ap.querySelector(".en-marco img"), { yPercent:-5 }, { yPercent:5, ease:"none",
      scrollTrigger:{ trigger:ancla, start:"top bottom", end:() => "+=" + Math.round(innerHeight * 2), scrub:true, invalidateOnRefresh:true } });

    raiz.querySelectorAll(".en-entrega").forEach(sec => {
      const num = sec.querySelector(".en-num"), fin = +num.dataset.min, cuenta = { v:fin };
      const tl = gsap.timeline({ scrollTrigger:{ trigger:sec, start:"top 72%", toggleActions:"play none none reverse" } });
      tl.from(sec.querySelectorAll(".en-e-cab .in"), { yPercent:105, duration:.9, ease:"power4.out", stagger:.08 })
        .from(sec.querySelector(".en-e-sub"), { y:20, opacity:0, duration:.6, ease:"power3.out" }, .2)
        .fromTo(sec.querySelectorAll(".en-aprendido li"), { clipPath:"inset(0% 100% 0% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", duration:.55, ease:"power2.out", stagger:.09 }, .25)
        .from(sec.querySelector(".en-hoja"), { y:80, rotation:-4, opacity:0, duration:.95, ease:"power3.out", transformOrigin:"15% 0%" }, .15)
        .from(sec.querySelectorAll(".en-tarea"), { x:28, opacity:0, duration:.5, ease:"power3.out", stagger:.09 }, .55)
        .fromTo(cuenta, { v:0 }, { v:fin, duration:1.1, ease:"power2.out", onUpdate(){ num.textContent = Math.round(cuenta.v); } }, .2);
      gsap.fromTo(sec.querySelector(".en-dibujo-marco"), { clipPath:"inset(0% 100% 0% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", ease:"none",
        scrollTrigger:{ trigger:sec, start:"top 55%", end:"top -5%", scrub:.5 } });
    });
  }
});
})();
