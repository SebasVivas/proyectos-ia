/* secciones/45-riesgos.js: La tormenta.
   Dos secciones: "impacto" (impacto de la tecnología y de la IA generativa en la gestión de proyectos)
   y "riesgos" (gestión de riesgos en proyectos de IA: proceso PMI, siete dimensiones, matriz y tabla). */
(() => {
"use strict";

/* ---------- Paleta del acto y campos para la cabecera ----------
   Contrastes WCAG calculados con la luminancia relativa:
   blanco sobre pizarra #1f2a30 14,7:1 · amarillo #ffe14d sobre pizarra 11,3:1 · negro sobre amarillo 16,1:1
   negro sobre naranja #ff6831 7,3:1 · blanco sobre pizarra clara #3b4a52 9,2:1
   negro sobre el cielo del óleo de Aivazovski (franja de la cabecera) 7,2:1 como mínimo. */
const PIZARRA = "#1f2a30", AMARILLO = "#ffe14d", NARANJA = "#ff6831";
Clase.campo("tormenta-cielo",     { bg:"#cdb9b2", ink:"#000000", btn:[AMARILLO, "#000000"] });
Clase.campo("tormenta-pizarra",   { bg:PIZARRA,   ink:"#ffffff", btn:[AMARILLO, "#000000"] });
Clase.campo("tormenta-relampago", { bg:AMARILLO,  ink:"#000000", btn:["#000000", "#ffffff"] });
Clase.campo("tormenta-naranja",   { bg:NARANJA,   ink:"#000000", btn:[AMARILLO, "#000000"] });
Clase.campo("tormenta-blanco",    { bg:"#ffffff", ink:"#000000", btn:[AMARILLO, "#000000"] });

/* ---------- Movimiento firma: el rayo ----------
   Un borde quebrado, como un relámpago, barre de izquierda a derecha: lo que queda a su izquierda aparece.
   rayo(q, p) es la región visible entre dos bordes quebrados (q a la izquierda, p a la derecha), en % del ancho. */
const QUIEBRE = [[0, 0], [-5, 30], [4, 48], [-3, 74], [2, 100]];
const f2 = n => n.toFixed(2);
const rayo = (q, p) => "polygon(" + QUIEBRE.map(([d, y]) => `${f2(q + d)}% ${y}%`)
  .concat(QUIEBRE.slice().reverse().map(([d, y]) => `${f2(p + d)}% ${y}%`)).join(", ") + ")";
const OCULTO = rayo(-12, -12), OCULTO_DER = rayo(112, 112);   /* sin área: nada visible */
/* La franja amarilla que viaja montada sobre el borde */
const franja = p => "polygon(" + QUIEBRE.map(([d, y]) => `${f2(p + d - .7)}% ${y}%`)
  .concat(QUIEBRE.slice().reverse().map(([d, y]) => `${f2(p + d + 1.1)}% ${y}%`)).join(", ") + ")";
/* Los bordes se animan como números y el clip-path se escribe en cada cuadro: con scrub, GSAP no
   interpola de forma fiable una cadena polygon() leída del estilo calculado. */
const ocultar = (els, desde) => [...els].forEach(el => { el.style.clipPath = desde === "der" ? OCULTO_DER : OCULTO; });
function revelar(gsap, els, { desde = "izq", duration = .55, ease = "power2.inOut", stagger = 0 } = {}){
  const tl = gsap.timeline();
  [...els].forEach((el, i) => {
    const b = desde === "der" ? { q:112, p:112 } : { q:-12, p:-12 };
    const pinta = () => { el.style.clipPath = rayo(b.q, b.p); };
    tl.to(b, Object.assign(desde === "der" ? { q:-12 } : { p:112 }, { duration, ease, onUpdate:pinta }), i * stagger);
  });
  return tl;
}

/* Tinta de la cabecera para un campo. El núcleo solo la cambia durante la primera pantalla de cada
   [data-campo]; en un recorrido fijado con pin hay que reafirmarla al entrar a cualquier punto del recorrido. */
function tintaCampo(nombre){
  const c = Clase.campos[nombre]; if (!c) return;
  const r = document.documentElement.style;
  r.setProperty("--h-ink", c.ink); r.setProperty("--h-btn-bg", c.btn[0]); r.setProperty("--h-btn-ink", c.btn[1]);
}

/* Ejecuta fn una sola vez cuando el disparador entra (también si la página ya cargó más abajo). */
function alEntrar(ScrollTrigger, trigger, start, fn){
  let hecho = false;
  const correr = () => { if (!hecho){ hecho = true; fn(); } };
  ScrollTrigger.create({ trigger, start, end:() => ScrollTrigger.maxScroll(window) + 200,
    onEnter:correr, onRefresh(self){ if (self.progress > 0) correr(); } });
}

/* =====================================================================================
   IMPACTO: diapositivas 12 y 13
   ===================================================================================== */
const AFIRMA = [
  { dice:"La tecnología mejora", corto:"La tecnología mejora", items:["Eficiencia", "Transparencia", "Toma de decisiones"] },
  { dice:"Las herramientas permiten", corto:"Las herramientas permiten", items:["Programar tareas", "Asignar recursos", "Automatizar procesos", "Visualizar datos", "Mejorar la comunicación"] },
  { dice:"Tecnologías avanzadas (IA, ML) ayudan en", corto:"La IA y el ML ayudan", items:["Análisis predictivo", "Identificación de riesgos", "Seguimiento del desempeño"] },
  { dice:"El cloud computing facilita", corto:"La nube facilita", items:["Acceso global a la información", "Trabajo colaborativo", "Mayor agilidad"] },
  { dice:"Responsabilidades del equipo", corto:"Al equipo le toca", items:["Elegir herramientas adecuadas", "Garantizar calidad de datos", "Evitar sesgos", "Proteger la información"] }
];
const idTec = k => k ? `impacto-tecnologia-${k + 1}` : "impacto-tecnologia";
const GENAI = ["Analiza grandes volúmenes de datos", "Predice riesgos", "Sugiere decisiones óptimas", "Automatiza tareas repetitivas", "Mejora la planificación y pronósticos"];
const ESCALON = [0, 6, 12, 6, 0];   /* las franjas negras bajan en zigzag, como un rayo */

Clase.seccion({
  id:"impacto",
  orden:45,
  indice:{ texto:"Impacto de la tecnología", ir:"impacto", nota:"PMBOK, IA generativa y lo que exige: datos de calidad y supervisión humana" },
  creditos:[
    `<a href="https://commons.wikimedia.org/wiki/File:Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg">«El noveno oleaje»</a>, Iván Aivazovski, 1850. Dominio público, vía Wikimedia Commons (Google Art Project).`,
    `<a href="https://commons.wikimedia.org/wiki/File:J.M.W._Turner_%E2%80%93_Snow_Storm_-_Steam-Boat_off_a_Harbour%27s_Mouth.jpg">«Tormenta de nieve: vapor a la entrada de un puerto»</a>, J. M. W. Turner, hacia 1842. Dominio público, vía Wikimedia Commons.`
  ],
  css:`
    .s-impacto{position:relative}
    .s-impacto h2{font-size:var(--step-head)}
    .s-impacto .s-impacto-nota{font-size:var(--step-small);line-height:1.45}

    /* Apertura: el óleo a pantalla completa */
    .s-impacto-ap-pintura{position:absolute;left:0;right:0;top:-8%;bottom:-8%;will-change:transform}
    .s-impacto-ap-pintura img{width:100%;height:100%;max-width:none;object-fit:cover;object-position:50% 62%}
    .s-impacto-ap-oscuro{position:absolute;inset:0;background:#1f2a30;opacity:0;pointer-events:none}
    .s-impacto-ap-rayo{position:absolute;top:0;left:57%;height:70%;width:auto;aspect-ratio:120 / 400;fill:#ffe14d;opacity:0;pointer-events:none}
    .s-impacto-ap-destello{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
    .s-impacto-ap .s-impacto-ap-titulo{position:relative;font-size:var(--step-display);color:#000}
    .s-impacto-ap-placa{position:absolute;right:var(--margen);bottom:48px;width:min(560px,44vw);background:#ffe14d;color:#000;padding:24px 28px 20px}
    .s-impacto-ap-placa p{font-size:var(--step-lead);line-height:1.3;font-weight:600}
    .s-impacto-ap-placa .s-impacto-ap-pie{margin-top:14px;font-size:var(--step-small);line-height:1.4;font-weight:400}

    /* Afirmaciones del PMBOK: apiladas (sin movimiento) o en escena fijada (con movimiento) */
    .s-impacto-tec{background:#1f2a30;color:#fff;padding:120px var(--margen) 112px}
    .s-impacto-tec-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:start}
    .s-impacto-tec-cab h2{grid-column:1 / 10}
    .s-impacto-tec-cab .s-impacto-nota{grid-column:1 / 10;margin-top:14px}
    .s-impacto-indice{display:none;list-style:none}
    .s-impacto-af{margin-top:72px}
    .s-impacto-dice{font-family:var(--f-display);font-weight:700;font-size:var(--step-display);line-height:.88;letter-spacing:-.04em;color:#ffe14d}
    .s-impacto-items{list-style:none;margin-top:26px;columns:2;column-gap:var(--gap);max-width:1040px}
    .s-impacto-items li{position:relative;padding-left:30px;margin-bottom:10px;break-inside:avoid;font-size:var(--step-lead);line-height:1.3;font-weight:600}
    .s-impacto-items li::before{content:"";position:absolute;left:0;top:.4em;width:14px;height:14px;background:#ffe14d}
    .s-impacto-franja{display:none}
    .s-impacto-tec.en-escena{height:100svh;min-height:620px;padding:112px var(--margen) 40px;display:flex;flex-direction:column;overflow:hidden}
    .s-impacto-tec.en-escena .s-impacto-indice{display:block;grid-column:10 / 13;grid-row:1 / span 2}
    .s-impacto-indice a{display:block;padding:5px 10px;font-weight:600;text-decoration:none;color:#fff;transition:background-color .25s,color .25s}
    .s-impacto-indice a:hover{color:#ffe14d}
    .s-impacto-indice a[aria-current="step"]{background:#ffe14d;color:#000}
    .s-impacto-indice a:focus-visible{outline:3px solid #fff;outline-offset:2px}
    .s-impacto-tec.en-escena .s-impacto-escena{position:relative;flex:1;margin-top:20px}
    .s-impacto-tec.en-escena .s-impacto-af{position:absolute;inset:0;margin:0;display:flex;flex-direction:column;justify-content:center}
    .s-impacto-tec.en-escena .s-impacto-franja{display:block;position:absolute;inset:0;background:#ffe14d;pointer-events:none}

    /* IA generativa: franjas negras que entran como rayos */
    .s-impacto-genai{background:#ffe14d;color:#000;padding:112px var(--margen) 72px}
    .s-impacto-capas{list-style:none;margin-top:32px;display:flex;flex-direction:column;align-items:flex-start;gap:10px}
    .s-impacto-capas li{margin-left:var(--x,0);background:#000;color:#ffe14d;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:1;letter-spacing:-.03em;padding:.2em .32em .1em}

    /* Pero: datos y supervisión humana */
    .s-impacto-pero{background:#ff6831;color:#000;min-height:100svh;padding:112px var(--margen) 56px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-content:center;overflow:hidden}
    .s-impacto-pero-texto{grid-column:1 / 8;position:relative;z-index:1}
    .s-impacto-dos{list-style:none;margin-top:32px}
    .s-impacto-dos li{font-family:var(--f-display);font-weight:700;font-size:var(--step-display);line-height:.88;letter-spacing:-.04em}
    .s-impacto-dos li + li{margin-top:.22em}
    .s-impacto-pero-pintura{position:absolute;top:0;right:0;bottom:0;width:38%;margin:0;overflow:hidden;background:#b9b4aa}
    .s-impacto-pero-pintura img{width:100%;height:100%;object-fit:cover;object-position:50% 45%;will-change:transform}
    .s-impacto-pero-pintura figcaption{position:absolute;left:0;bottom:0;max-width:100%;background:#fff;color:#000;padding:10px 14px;font-size:var(--step-small);line-height:1.4}

    @media (max-width:760px){
      .s-impacto-ap-placa{left:20px;right:20px;width:auto;bottom:24px}
      .s-impacto-tec-cab h2,.s-impacto-tec-cab .s-impacto-nota{grid-column:1 / -1}
      .s-impacto-items{columns:1}
      .s-impacto-capas li{margin-left:0}
      .s-impacto-pero-texto{grid-column:1 / -1}
      .s-impacto-pero-pintura{position:relative;grid-column:1 / -1;width:auto;height:60svh;margin:32px calc(-1 * var(--margen)) 0}
    }
  `,
  html:`
    <span class="ancla" data-parada="impacto"></span>
    <section class="cap s-impacto s-impacto-ap" data-campo="tormenta-cielo" style="--campo:#cdb9b2;--tinta:#000" aria-labelledby="impacto-titulo">
      <div class="s-impacto-ap-pintura"><img src="img/riesgos/assets/noveno-oleaje.jpg" width="2400" height="1608" decoding="async" alt="Óleo de Iván Aivazovski: náufragos aferrados a los restos de un mástil frente a una ola enorme, bajo un cielo encendido por el sol."></div>
      <div class="s-impacto-ap-oscuro" aria-hidden="true"></div>
      <svg class="s-impacto-ap-rayo" viewBox="0 0 120 400" aria-hidden="true" focusable="false"><polygon points="70,0 28,150 60,150 20,290 46,290 8,400 100,240 68,240 104,128 74,128 112,0"/></svg>
      <div class="s-impacto-ap-destello" aria-hidden="true"></div>
      <h2 class="s-impacto-ap-titulo" id="impacto-titulo"><span class="mask"><span class="in">¿Aguanta su proyecto</span></span><span class="mask"><span class="in">la tormenta?</span></span></h2>
      <div class="s-impacto-ap-placa">
        <p>Lo que la tecnología y la IA generativa le aportan a un proyecto, y los riesgos que traen consigo.</p>
        <p class="s-impacto-ap-pie">Iván Aivazovski, «El noveno oleaje», 1850. Museo Ruso, San Petersburgo.</p>
      </div>
    </section>

    <span class="ancla" data-parada="impacto-tecnologia"></span>
    <section class="s-impacto s-impacto-tec" data-campo="tormenta-pizarra" aria-labelledby="impacto-tec-titulo">
      <div class="s-impacto-tec-cab">
        <h2 id="impacto-tec-titulo">Impacto de la tecnología en la gestión de proyectos</h2>
        <p class="s-impacto-nota">Según el PMBOK (la guía de gestión de proyectos del PMI), numeral 2.5.1.3.</p>
        <ol class="s-impacto-indice" aria-label="Afirmaciones de esta pantalla">
          ${AFIRMA.map((a, k) => `<li><a href="#${idTec(k)}" data-ir="${idTec(k)}">${a.corto}</a></li>`).join("")}
        </ol>
      </div>
      <div class="s-impacto-escena">
        ${AFIRMA.map(a => `<article class="s-impacto-af"><p class="s-impacto-dice">${a.dice}</p><ul class="s-impacto-items">${a.items.map(t => `<li>${t}</li>`).join("")}</ul></article>`).join("")}
        <div class="s-impacto-franja" aria-hidden="true"></div>
      </div>
    </section>

    <span class="ancla" data-parada="impacto-genai"></span>
    <section class="s-impacto s-impacto-genai" data-campo="tormenta-relampago" aria-labelledby="impacto-genai-titulo">
      <h2 id="impacto-genai-titulo"><span class="mask"><span class="in">La IA generativa (GenAI) está transformando la gestión de proyectos</span></span></h2>
      <ul class="s-impacto-capas">${GENAI.map((t, k) => `<li style="--x:${ESCALON[k]}vw">${t}</li>`).join("")}</ul>
    </section>

    <span class="ancla" data-parada="impacto-pero"></span>
    <section class="s-impacto s-impacto-pero" data-campo="tormenta-naranja" aria-labelledby="impacto-pero-titulo">
      <div class="s-impacto-pero-texto">
        <h2 id="impacto-pero-titulo"><span class="mask"><span class="in">Pero su efectividad depende de dos cosas</span></span></h2>
        <ul class="s-impacto-dos"><li>Calidad de los datos</li><li>Supervisión humana</li></ul>
      </div>
      <figure class="s-impacto-pero-pintura">
        <img src="img/riesgos/assets/tormenta-turner.jpg" width="1400" height="1898" loading="lazy" decoding="async" alt="Óleo de Turner: un barco de vapor casi borrado por la nieve y el oleaje, en un remolino de grises.">
        <figcaption>J. M. W. Turner, «Tormenta de nieve: vapor a la entrada de un puerto», hacia 1842.</figcaption>
      </figure>
    </section>
  `,
  iniciar(ctx){
    const { gsap, ScrollTrigger, reducir, raiz } = ctx;
    const ap = raiz.querySelector(".s-impacto-ap"), tec = raiz.querySelector(".s-impacto-tec");
    const genai = raiz.querySelector(".s-impacto-genai"), pero = raiz.querySelector(".s-impacto-pero");
    const anclaAp = raiz.querySelector('[data-parada="impacto"]');
    if (reducir) return;   /* sin movimiento: todo queda apilado y visible */

    /* 1. Apertura: el óleo sube más lento que la página; al entrar, cae un rayo y se ilumina */
    gsap.fromTo(ap.querySelector(".s-impacto-ap-pintura"), { yPercent:-6 }, { yPercent:6, ease:"none",
      scrollTrigger:{ trigger:anclaAp, start:"top bottom", end:() => "+=" + Math.round(innerHeight * 2.2), scrub:true } });
    const oscuro = ap.querySelector(".s-impacto-ap-oscuro"), destello = ap.querySelector(".s-impacto-ap-destello");
    const chispa = ap.querySelector(".s-impacto-ap-rayo"), lineas = ap.querySelectorAll(".s-impacto-ap-titulo .in");
    const placa = ap.querySelector(".s-impacto-ap-placa");
    gsap.set(oscuro, { opacity:1 });
    gsap.set(lineas, { yPercent:105 });
    gsap.set(placa, { y:40, opacity:0 });
    const golpe = gsap.timeline({ paused:true })
      .fromTo(chispa, { opacity:1, scaleY:.25, transformOrigin:"50% 0%" }, { scaleY:1, duration:.09, ease:"power2.out", immediateRender:false }, .1)
      .to(destello, { opacity:.9, duration:.05 }, .18)
      .set(oscuro, { opacity:0 }, .23)
      .to(destello, { opacity:0, duration:.24, ease:"power2.out" }, .23)
      .to(chispa, { opacity:0, duration:.12 }, .28)
      .to(destello, { opacity:.5, duration:.04 }, .56)
      .to(destello, { opacity:0, duration:.4, ease:"power2.out" }, .6)
      .to(lineas, { yPercent:0, duration:1, ease:"power4.out", stagger:.09 }, .5)
      .to(placa, { y:0, opacity:1, duration:.7, ease:"power3.out" }, .85);
    alEntrar(ScrollTrigger, anclaAp, "top 55%", () => golpe.play());

    /* 2. Afirmaciones del PMBOK: escena fijada; cada afirmación entra detrás del rayo y borra la anterior */
    tec.classList.add("en-escena");
    const afs = [...tec.querySelectorAll(".s-impacto-af")], viaje = tec.querySelector(".s-impacto-franja");
    const enlaces = [...tec.querySelectorAll(".s-impacto-indice a")];
    const n = afs.length, TOTAL = n - 1 + .4;
    const bordes = afs.map((_, i) => ({ q:-12, p:i ? -12 : 112 })), fr = { x:-12 };
    const pintarEscena = () => {
      afs.forEach((el, i) => {
        const b = bordes[i];
        el.style.clipPath = rayo(b.q, b.p);
        el.style.visibility = b.p - b.q > .5 && b.p > -10 && b.q < 110 ? "" : "hidden";   /* recortada del todo */
      });
      viaje.style.clipPath = franja(fr.x);
      viaje.style.visibility = fr.x > -11.9 && fr.x < 111.9 ? "" : "hidden";
    };
    /* Los lectores de pantalla leen las cinco afirmaciones completas, no solo la que está a la vista */
    const copia = document.createElement("div");
    copia.className = "solo-lector";
    copia.innerHTML = AFIRMA.map(a => `<p>${a.dice}: ${a.items.join(", ")}.</p>`).join("");
    tec.querySelector(".s-impacto-escena").before(copia);
    afs.forEach(a => a.setAttribute("aria-hidden", "true"));
    pintarEscena();
    const tl = gsap.timeline({ defaults:{ ease:"none", immediateRender:false }, onUpdate:pintarEscena });
    for (let k = 1; k < n; k++){
      const t0 = k - 1 + .2;   /* el rayo pasa dos veces: primero borra la afirmación anterior, luego escribe la nueva */
      tl.fromTo(bordes[k - 1], { q:-12 }, { q:112, duration:.3 }, t0)
        .fromTo(fr, { x:-12 }, { x:112, duration:.3 }, t0)
        .fromTo(bordes[k], { p:-12 }, { p:112, duration:.3 }, t0 + .3)
        .fromTo(fr, { x:-12 }, { x:112, duration:.3 }, t0 + .3);
    }
    tl.to({}, { duration:.6 }, n - 2 + .8);
    let marcado = -1;
    const marcar = k => {
      if (k === marcado) return; marcado = k;
      enlaces.forEach((a, i) => { if (i === k) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
    };
    marcar(0);
    const st = ScrollTrigger.create({ trigger:tec, start:"top top", end:() => "+=" + Math.round(innerHeight * 3.4),
      pin:true, scrub:true, animation:tl, anticipatePin:1,
      onToggle:self => { if (self.isActive) tintaCampo("tormenta-pizarra"); },
      onUpdate:self => marcar(Math.max(0, Math.min(n - 1, Math.floor(self.progress * TOTAL + .5)))) });
    for (let k = 1; k < n; k++) ctx.Clase.parada(idTec(k), () => st.start + (st.end - st.start) * (k / TOTAL));

    /* 3. IA generativa: el titular sube y cada capacidad cae como un rayo, en zigzag */
    const capas = genai.querySelectorAll(".s-impacto-capas li"), gIn = genai.querySelectorAll("h2 .in");
    ocultar(capas);
    gsap.set(gIn, { yPercent:105 });
    alEntrar(ScrollTrigger, genai, "top 62%", () => {
      gsap.timeline()
        .to(gIn, { yPercent:0, duration:.9, ease:"power4.out" })
        .add(revelar(gsap, capas, { duration:.5, stagger:.16 }), .25)
        .from(capas, { x:-24, duration:.6, ease:"power3.out", stagger:.16 }, .25);
    });

    /* 4. Pero: las dos condiciones entran con el rayo y el óleo de Turner se abre desde la derecha */
    const dos = pero.querySelectorAll(".s-impacto-dos li"), pIn = pero.querySelectorAll("h2 .in");
    const fig = pero.querySelector(".s-impacto-pero-pintura"), img = fig.querySelector("img");
    ocultar(dos);
    ocultar([fig], "der");
    gsap.set(pIn, { yPercent:105 });
    alEntrar(ScrollTrigger, pero, "top 62%", () => {
      gsap.timeline()
        .add(revelar(gsap, [fig], { desde:"der", duration:1.1, ease:"power3.inOut" }))
        .to(pIn, { yPercent:0, duration:.9, ease:"power4.out" }, .15)
        .add(revelar(gsap, dos, { duration:.55, stagger:.2 }), .45);
    });
    gsap.fromTo(img, { scale:1.12 }, { scale:1, ease:"none",
      scrollTrigger:{ trigger:pero, start:"top bottom", end:"bottom top", scrub:true } });
  }
});

/* =====================================================================================
   RIESGOS: diapositivas 14 y 15
   ===================================================================================== */
const PASOS = [
  { n:"Identificar riesgos", d:"Listar qué puede salir mal en cada dimensión: datos, modelo, tecnología, negocio, ética, ley y operación." },
  { n:"Analizar riesgos", d:"Estimar qué tan probable es cada riesgo y cuánto golpearía. De ahí sale la matriz de probabilidad e impacto." },
  { n:"Planificar respuestas", d:"Decidir antes de que pase cómo se evita, se reduce, se transfiere o se acepta, y quién responde." },
  { n:"Implementar respuestas", d:"Ejecutar lo planeado, con responsable y fecha." },
  { n:"Monitorear riesgos", d:"Vigilar el modelo en producción y los riesgos nuevos. Lo que aparece vuelve al primer paso." }
];
const RUMBOS = [
  { n:"Datos", e:"Información incompleta o sesgada." },
  { n:"Modelo", e:"Baja precisión o sobreajuste." },
  { n:"Tecnología", e:"Fallas de infraestructura." },
  { n:"Negocio", e:"Baja adopción de usuarios." },
  { n:"Ética", e:"Sesgos discriminatorios." },
  { n:"Legal", e:"Incumplimiento de la Ley 1581 (datos personales en Colombia) o del GDPR (reglamento europeo de datos)." },
  { n:"Operacional", e:"Degradación del modelo en producción." }
];
/* La tabla de la diapositiva 15, completa. p: probabilidad (1 Bajo, 2 Medio, 3 Alto); i: impacto (1 Bajo a 4 Crítico) */
const RIESGOS = [
  { id:"datos", cat:"Datos", riesgo:"Datos insuficientes, sesgados o con errores en el entrenamiento", p:3, i:3, mit:"Estrategia de recolección, auditoría de calidad, diversificación de fuentes." },
  { id:"tecnico", cat:"Técnico", riesgo:"Modelo no converge o presenta sobreajuste (overfitting)", p:3, i:3, mit:"Validación cruzada, regularización, arquitectura alternativa más simple." },
  { id:"legal", cat:"Legal/Ético", riesgo:"Sesgo algorítmico, violación de privacidad o incumplimiento regulatorio", p:3, i:4, mit:"XAI (IA explicable), revisión de sesgo, anonimización, comité de ética, cumplimiento de la Ley 1581." },
  { id:"financiero", cat:"Financiero", riesgo:"Sobrecostos de infraestructura cloud superiores a lo proyectado", p:2, i:2, mit:"Monitoreo de gasto cloud, arquitectura serverless, contratos fijos, alertas." },
  { id:"adopcion", cat:"Adopción", riesgo:"Usuarios o equipo no adoptan la solución de IA en producción", p:2, i:3, mit:"Co-diseño con usuarios, pilotos graduales, formación y gestión del cambio." },
  { id:"regulatorio", cat:"Regulatorio", riesgo:"Cambios en normativas que afectan el uso de datos o decisiones automatizadas", p:1, i:3, mit:"Monitoreo legal continuo, arquitectura adaptable, asesoría jurídica periódica." }
];
const NP = ["", "Bajo", "Medio", "Alto"];
const NI = ["", "Bajo", "Medio", "Alto", "Crítico"];
/* Convención de esta matriz: nivel = probabilidad × impacto; 9 o más crítico, 6 a 8 alto, 3 a 4 medio, 1 a 2 bajo */
const nivel = (p, i) => { const s = p * i; return s >= 9 ? "Crítico" : s >= 6 ? "Alto" : s >= 3 ? "Medio" : "Bajo"; };
const marca = nv => `<span class="s-riesgos-marca" data-nivel="${nv}" aria-hidden="true"></span>${nv}`;

/* Dibujo de la rosa de los vientos (siete rumbos) y del ciclo PMI, en unidades de un lienzo de -100 a 100 */
const rad = g => g * Math.PI / 180;
const pt = (r, g) => `${f2(r * Math.cos(rad(g)))},${f2(r * Math.sin(rad(g)))}`;
const angRumbo = k => -90 + k * 360 / 7;
function svgRosa(){
  let s = `<circle r="94" fill="none" stroke="#000" stroke-width="2.6"/>`;
  for (let k = 0; k < 7; k++){
    const g = angRumbo(k) + 360 / 14;
    s += `<polygon class="s-riesgos-punta-c" points="0,0 ${pt(8, g - 90)} ${pt(50, g)} ${pt(8, g + 90)}"/>`;
  }
  for (let k = 0; k < 7; k++){
    const g = angRumbo(k);
    s += `<g class="s-riesgos-punta" data-k="${k}"><polygon class="s-riesgos-punta-a" points="0,0 ${pt(13, g - 90)} ${pt(86, g)}"/><polygon class="s-riesgos-punta-b" points="0,0 ${pt(86, g)} ${pt(13, g + 90)}"/></g>`;
  }
  s += `<g class="s-riesgos-aguja"><polygon points="0,-99 7,-30 0,-22 -7,-30" fill="#ff6831" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/></g>`;
  s += `<circle r="10" fill="#000"/><circle r="4" fill="#ffe14d"/>`;
  return s;
}
function svgCiclo(){
  let s = `<circle r="74" fill="none" stroke="#000" stroke-width="3.4"/>`;
  for (let k = 0; k < 5; k++){
    const g = -90 + k * 72 + 36, a = rad(g), c = Math.cos(a), sn = Math.sin(a);
    const P = [74 * c, 74 * sn], t = [-sn, c], m = [c, sn];
    const punta = `${f2(P[0] + 8 * t[0])},${f2(P[1] + 8 * t[1])}`;
    const b1 = `${f2(P[0] - 5 * t[0] + 7 * m[0])},${f2(P[1] - 5 * t[1] + 7 * m[1])}`;
    const b2 = `${f2(P[0] - 5 * t[0] - 7 * m[0])},${f2(P[1] - 5 * t[1] - 7 * m[1])}`;
    s += `<polygon points="${punta} ${b1} ${b2}" fill="#000"/>`;
  }
  for (let k = 0; k < 5; k++){
    const g = -90 + k * 72;
    s += `<circle class="s-riesgos-estacion" data-k="${k}" cx="${f2(74 * Math.cos(rad(g)))}" cy="${f2(74 * Math.sin(rad(g)))}" r="10"/>`;
  }
  s += `<g class="s-riesgos-barco"><circle cx="0" cy="-74" r="6.5" fill="#ffe14d" stroke="#000" stroke-width="2.6"/></g>`;
  return s;
}

Clase.seccion({
  id:"riesgos",
  orden:50,
  indice:{ texto:"Gestión de riesgos", ir:"riesgos", nota:"Proceso PMI, siete dimensiones de riesgo, matriz de probabilidad e impacto y la tabla de mitigación" },
  creditos:[
    `<a href="https://commons.wikimedia.org/wiki/File:Vernet,_Claude_Joseph_-_The_Shipwreck_-_1772FXD.jpg">«El naufragio»</a>, Claude-Joseph Vernet, 1772. Dominio público, vía Wikimedia Commons.`
  ],
  css:`
    .s-riesgos{position:relative}
    .s-riesgos .boton[hidden]{display:none}
    .s-riesgos h2{font-size:var(--step-head)}
    .s-riesgos .s-riesgos-nota{font-size:var(--step-small);line-height:1.45}
    .s-riesgos-marca{display:inline-block;width:14px;height:14px;margin-right:8px;vertical-align:-1px;border:2px solid #000;background:var(--color)}
    .s-riesgos-marca[data-nivel="Bajo"],.s-riesgos-celda[data-nivel="Bajo"]{--color:#3b4a52;--tinta:#fff}
    .s-riesgos-marca[data-nivel="Medio"],.s-riesgos-celda[data-nivel="Medio"]{--color:#fff;--tinta:#000}
    .s-riesgos-marca[data-nivel="Alto"],.s-riesgos-celda[data-nivel="Alto"]{--color:#ffe14d;--tinta:#000}
    .s-riesgos-marca[data-nivel="Crítico"],.s-riesgos-celda[data-nivel="Crítico"]{--color:#ff6831;--tinta:#000}

    /* Apertura: Vernet a media pantalla */
    .s-riesgos-ap{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-content:center}
    .s-riesgos-ap-texto{grid-column:1 / 7;position:relative;z-index:1}
    .s-riesgos-ap h2{font-size:var(--step-display)}
    .s-riesgos-ap-lead{margin-top:28px;font-size:var(--step-lead);line-height:1.3;font-weight:600;color:#ffe14d;max-width:32ch}
    .s-riesgos-ap-obj{margin-top:20px;max-width:54ch}
    .s-riesgos-ap-obj strong{font-weight:600}
    .s-riesgos-ap-texto .s-riesgos-nota{margin-top:24px}
    .s-riesgos-ap-pintura{position:absolute;top:0;right:0;bottom:0;width:44%;margin:0;overflow:hidden;background:#2c2a26}
    .s-riesgos-ap-pintura img{width:100%;height:100%;object-fit:cover;object-position:66% 50%;will-change:transform}

    /* Ciclo PMI */
    .s-riesgos-ciclo{background:#fff;color:#000;min-height:100svh;padding:112px var(--margen) 64px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:center}
    .s-riesgos-ciclo-izq{grid-column:1 / 7}
    .s-riesgos-ciclo-izq > p{margin-top:16px;max-width:46ch}
    .s-riesgos-rueda{position:relative;width:min(440px,46vh);aspect-ratio:1;margin-top:24px}
    .s-riesgos-rueda svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .s-riesgos-estacion{fill:#1f2a30;stroke:#1f2a30;stroke-width:2.6;transition:fill .3s}
    .s-riesgos-estacion.es-actual{fill:#ff6831;stroke:#000}
    .s-riesgos-rueda-centro{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56%;text-align:center;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);line-height:1;letter-spacing:-.02em}
    .s-riesgos-pasos{grid-column:7 / 13;list-style:none;display:flex;flex-direction:column;gap:6px}
    .s-riesgos-pasos button{display:block;width:100%;text-align:left;background:transparent;border:0;padding:12px 16px;cursor:pointer;transition:background-color .25s}
    .s-riesgos-pasos button:hover{background:#eef1f2}
    .s-riesgos-pasos button[aria-current="step"]{background:#ffe14d}
    .s-riesgos-pasos button:focus-visible{outline:3px solid #000;outline-offset:2px}
    .s-riesgos-pasos strong{display:block;font-weight:600;font-size:var(--step-lead);line-height:1.15}
    .s-riesgos-pasos span{display:block;margin-top:4px;line-height:1.4}
    .s-riesgos-ciclo .boton{margin-top:24px;background:#ffe14d}

    /* Rosa de los vientos */
    .s-riesgos-rumbos{background:#ffe14d;color:#000;min-height:100svh;padding:112px var(--margen) 64px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:center}
    .s-riesgos-rumbos-texto{grid-column:1 / 6}
    .s-riesgos-rumbos-texto > p{margin-top:16px;max-width:42ch}
    .s-riesgos-ficha-rumbo{margin-top:44px;min-height:8.5em}
    .s-riesgos-ficha-rumbo h3{font-size:var(--step-head)}
    .s-riesgos-ficha-rumbo p{margin-top:14px;font-size:var(--step-lead);line-height:1.3;font-weight:600;max-width:24ch}
    .s-riesgos-rosa{grid-column:6 / 13;position:relative;height:min(600px,74vh);min-height:430px}
    .s-riesgos-rosa svg{position:absolute;left:50%;top:50%;width:340px;height:340px;transform:translate(-50%,-50%);overflow:visible}
    .s-riesgos-punta-a{fill:#000}
    .s-riesgos-punta-b{fill:#fff;transition:fill .3s}
    .s-riesgos-punta-c{fill:#1f2a30}
    .s-riesgos-punta.es-elegida .s-riesgos-punta-b{fill:#ff6831}
    .s-riesgos-rumbo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max-content}
    .s-riesgos-rumbo .boton{background:#fff;color:#000}
    .s-riesgos-rumbo .boton[aria-pressed="true"]{background:#000;color:#ffe14d}

    /* Matriz de probabilidad e impacto */
    .s-riesgos-matriz{background:#1f2a30;color:#fff;padding:112px var(--margen) 80px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:28px;align-items:start}
    .s-riesgos-matriz-cab{grid-column:1 / -1;display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
    .s-riesgos-matriz-cab .boton{background:#ffe14d;flex:none}
    .s-riesgos-cuadro{grid-column:1 / 9;display:grid;grid-template-columns:max-content repeat(4,1fr);gap:6px}
    .s-riesgos-eje{font-weight:600;align-self:center;padding-right:14px}
    .s-riesgos-eje-titulo{font-size:var(--step-small);align-self:end;padding-bottom:4px}
    .s-riesgos-col{font-weight:600;padding-top:6px}
    .s-riesgos-celda{min-height:132px;padding:10px;display:flex;flex-direction:column;gap:6px;background:var(--color);color:var(--tinta)}
    .s-riesgos-nivel{font-size:var(--step-small);font-weight:600;line-height:1.2}
    .s-riesgos-gotas{display:flex;flex-direction:column;gap:6px}
    .s-riesgos-gota{position:relative;z-index:3;display:block;width:100%;min-height:44px;padding:8px 10px;text-align:left;background:#000;color:#fff;border:2px solid #fff;font-weight:600;line-height:1.15;cursor:pointer;transition:background-color .2s,color .2s}
    .s-riesgos-gota.es-propia{background:#fff;color:#000;border-color:#000}
    .s-riesgos-gota[aria-pressed="true"]{background:#ffe14d;color:#000;border-color:#000}
    .s-riesgos-gota:focus-visible{outline:3px solid var(--tinta);outline-offset:2px}
    .s-riesgos-ficha{grid-column:9 / 13;min-height:420px}
    .s-riesgos-ficha > p:first-child{margin-bottom:22px}
    .s-riesgos-ficha h3{font-size:var(--step-head);line-height:.9}
    .s-riesgos-ficha-riesgo{margin-top:14px;font-size:var(--step-lead);line-height:1.3;font-weight:600}
    .s-riesgos-ficha dl{margin-top:18px;display:grid;grid-template-columns:max-content 1fr;column-gap:16px;row-gap:6px}
    .s-riesgos-ficha dt{font-weight:400}
    .s-riesgos-ficha dd{font-weight:600}
    .s-riesgos-ficha .s-riesgos-marca{border-color:#fff}
    .s-riesgos-ficha-mit{margin-top:18px}
    .s-riesgos-ficha-mit strong{display:block;font-weight:600;color:#ffe14d}
    .s-riesgos-propio{grid-column:1 / -1;display:grid;grid-template-columns:minmax(0,2.2fr) minmax(0,1fr) minmax(0,1fr) auto auto;gap:16px;align-items:end;margin-top:8px}
    .s-riesgos-propio h3{grid-column:1 / -1;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.1}
    .s-riesgos-propio label{display:flex;flex-direction:column;gap:6px;font-weight:600}
    .s-riesgos-propio input,.s-riesgos-propio select{height:52px;padding:0 14px;background:#1f2a30;color:#fff;border:2px solid #fff;border-radius:0;font:inherit;font-weight:400}
    .s-riesgos-propio input::placeholder{color:#c8d0d4}
    .s-riesgos-propio input:focus-visible,.s-riesgos-propio select:focus-visible{outline:3px solid #ffe14d;outline-offset:2px}
    .s-riesgos-propio .boton{background:#ffe14d}
    .s-riesgos-propio .s-riesgos-quitar{background:#fff}
    .s-riesgos-matriz > .s-riesgos-nota{grid-column:1 / 9}

    /* Tabla completa */
    .s-riesgos-tabla{background:#fff;color:#000;padding:112px var(--margen) 96px}
    .s-riesgos-tabla table{width:100%;margin-top:22px;border-collapse:collapse;line-height:1.38}
    .s-riesgos-tabla col.c1{width:13%}.s-riesgos-tabla col.c2{width:32%}.s-riesgos-tabla col.c3{width:11%}.s-riesgos-tabla col.c4{width:10%}
    .s-riesgos-tabla th{text-align:left;font-weight:600;padding:0 14px 10px;border-bottom:3px solid #000;vertical-align:bottom}
    .s-riesgos-tabla td{padding:8px 14px 9px;vertical-align:top}
    .s-riesgos-tabla tbody tr:nth-child(odd){background:#eef1f2}
    .s-riesgos-tabla td:first-child{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
    .s-riesgos-tabla td:nth-child(3),.s-riesgos-tabla td:nth-child(4){white-space:nowrap;font-weight:600}

    /* Cierre */
    .s-riesgos-cierre{background:#ffe14d;color:#000;min-height:72svh;padding:112px var(--margen) 96px;display:flex;flex-direction:column;justify-content:center}
    .s-riesgos-cierre h2{font-size:var(--step-display)}
    .s-riesgos-cierre p{margin-top:28px;font-size:var(--step-lead);line-height:1.3;font-weight:600;max-width:40ch}
    .s-riesgos-cierre .boton{margin-top:36px;align-self:flex-start;background:#000;color:#fff}

    @media (max-width:760px){
      .s-riesgos-ap-texto,.s-riesgos-ciclo-izq,.s-riesgos-pasos,.s-riesgos-rumbos-texto,.s-riesgos-rosa,.s-riesgos-cuadro,.s-riesgos-ficha,.s-riesgos-matriz > .s-riesgos-nota{grid-column:1 / -1}
      .s-riesgos-ap-pintura{position:relative;grid-column:1 / -1;width:auto;height:50svh;margin:32px -20px 0}
      .s-riesgos-propio{grid-template-columns:1fr}
      .s-riesgos-tabla table{display:block;overflow-x:auto}
      .s-riesgos-cuadro{overflow-x:auto;grid-template-columns:max-content repeat(4,minmax(104px,1fr))}
      .s-riesgos-rueda{width:min(340px,86vw)}
    }
  `,
  html:`
    <span class="ancla" data-parada="riesgos"></span>
    <section class="cap s-riesgos s-riesgos-ap" data-campo="tormenta-pizarra" style="--campo:#1f2a30;--tinta:#fff" aria-labelledby="riesgos-titulo">
      <div class="s-riesgos-ap-texto">
        <h2 id="riesgos-titulo"><span class="mask"><span class="in">Gestión de</span></span><span class="mask"><span class="in">riesgos</span></span></h2>
        <p class="s-riesgos-ap-lead">En proyectos de IA, con el proceso del PMI (Project Management Institute) y las buenas prácticas de IA responsable.</p>
        <p class="s-riesgos-ap-obj"><strong>Objetivo:</strong> identificar, evaluar, mitigar y monitorear los riesgos asociados al desarrollo, despliegue y operación de soluciones de inteligencia artificial, garantizando el cumplimiento de los objetivos de negocio, regulatorios y tecnológicos.</p>
        <p class="s-riesgos-nota">Claude-Joseph Vernet, «El naufragio», 1772. Galería Nacional de Arte, Washington.</p>
      </div>
      <figure class="s-riesgos-ap-pintura"><img src="img/riesgos/assets/naufragio-vernet.jpg" width="1500" height="1790" loading="lazy" decoding="async" alt="Óleo de Vernet: un barco desarbolado contra las rocas, un rayo sobre el horizonte y gente en la orilla que tira de los cabos."></figure>
    </section>

    <span class="ancla" data-parada="riesgos-ciclo"></span>
    <section class="s-riesgos s-riesgos-ciclo" data-campo="tormenta-blanco" aria-labelledby="riesgos-ciclo-titulo">
      <div class="s-riesgos-ciclo-izq">
        <h2 id="riesgos-ciclo-titulo">El PMI pone el proceso</h2>
        <p>Cinco pasos que no se hacen una sola vez: lo que se monitorea vuelve a alimentar la identificación. Toquen un paso para detener el recorrido.</p>
        <div class="s-riesgos-rueda">
          <svg viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">${svgCiclo()}</svg>
          <p class="s-riesgos-rueda-centro" aria-hidden="true">${PASOS[0].n}</p>
        </div>
      </div>
      <ol class="s-riesgos-pasos" aria-label="Proceso de gestión de riesgos del PMI">
        ${PASOS.map((p, k) => `<li><button type="button" data-k="${k}"><strong>${p.n}</strong><span>${p.d}</span></button></li>`).join("")}
      </ol>
    </section>

    <span class="ancla" data-parada="riesgos-rumbos"></span>
    <section class="s-riesgos s-riesgos-rumbos" data-campo="tormenta-relampago" aria-labelledby="riesgos-rumbos-titulo">
      <div class="s-riesgos-rumbos-texto">
        <h2 id="riesgos-rumbos-titulo">Siete rumbos de riesgo</h2>
        <p>El proceso del PMI se aplica a las dimensiones propias de un proyecto de IA. Elijan un rumbo en la rosa y aparece un ejemplo.</p>
        <div class="s-riesgos-ficha-rumbo" aria-live="polite">
          <h3 id="riesgos-rumbo-nombre">${RUMBOS[0].n}</h3>
          <p id="riesgos-rumbo-ejemplo">${RUMBOS[0].e}</p>
        </div>
      </div>
      <div class="s-riesgos-rosa" role="group" aria-label="Rosa de los vientos con las siete dimensiones de riesgo. Flechas para cambiar de rumbo." data-teclas-propias>
        <svg viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">${svgRosa()}</svg>
        ${RUMBOS.map((r, k) => `<span class="s-riesgos-rumbo" data-k="${k}"><button class="boton" type="button" data-k="${k}" aria-pressed="${k ? "false" : "true"}" aria-label="${r.n}: ${r.e}">${r.n}</button></span>`).join("")}
      </div>
    </section>

    <span class="ancla" data-parada="riesgos-matriz"></span>
    <section class="s-riesgos s-riesgos-matriz" data-campo="tormenta-pizarra" aria-labelledby="riesgos-matriz-titulo">
      <div class="s-riesgos-matriz-cab">
        <h2 id="riesgos-matriz-titulo">Matriz de probabilidad e impacto</h2>
        <button class="boton s-riesgos-llover" type="button">Que llueva otra vez</button>
      </div>
      <div class="s-riesgos-cuadro" role="group" aria-label="Matriz: filas de probabilidad, columnas de impacto">
        <p class="s-riesgos-eje s-riesgos-eje-titulo">Probabilidad</p><span></span><span></span><span></span><span></span>
        ${[3, 2, 1].map(p => `<p class="s-riesgos-eje">${NP[p]}</p>` + [1, 2, 3, 4].map(i => `<div class="s-riesgos-celda" data-nivel="${nivel(p, i)}" data-p="${p}" data-i="${i}"><span class="s-riesgos-nivel">Nivel ${nivel(p, i).toLowerCase()}</span><div class="s-riesgos-gotas"></div></div>`).join("")).join("")}
        <p class="s-riesgos-eje s-riesgos-eje-titulo">Impacto</p>${[1, 2, 3, 4].map(i => `<p class="s-riesgos-col">${NI[i]}</p>`).join("")}
      </div>
      <div class="s-riesgos-ficha" aria-live="polite">
        <p>Los seis riesgos de la tabla caen en su celda. Elijan una tarjeta para ver su mitigación.</p>
        <h3 id="riesgos-ficha-cat"></h3>
        <p class="s-riesgos-ficha-riesgo" id="riesgos-ficha-riesgo"></p>
        <dl>
          <dt>Probabilidad</dt><dd id="riesgos-ficha-p"></dd>
          <dt>Impacto</dt><dd id="riesgos-ficha-i"></dd>
          <dt>Nivel en la matriz</dt><dd id="riesgos-ficha-n"></dd>
        </dl>
        <p class="s-riesgos-ficha-mit"><strong>Mitigación</strong><span id="riesgos-ficha-mit"></span></p>
      </div>
      <form class="s-riesgos-propio" novalidate>
        <h3>¿Y los riesgos de su proyecto? Ubiquen uno en la matriz</h3>
        <label>Riesgo<input name="nombre" maxlength="60" autocomplete="off" placeholder="Ej.: el proveedor cambia el formato de los datos"></label>
        <label>Probabilidad<select name="p"><option value="1">Bajo</option><option value="2" selected>Medio</option><option value="3">Alto</option></select></label>
        <label>Impacto<select name="i"><option value="1">Bajo</option><option value="2">Medio</option><option value="3" selected>Alto</option><option value="4">Crítico</option></select></label>
        <button class="boton" type="submit">Ubicar en la matriz</button>
        <button class="boton s-riesgos-quitar" type="button" hidden>Quitar los suyos</button>
      </form>
      <p class="s-riesgos-nota">Nivel de cada celda: probabilidad × impacto, con Bajo 1, Medio 2, Alto 3 y Crítico 4. De 1 a 2 es bajo, de 3 a 4 medio, de 6 a 8 alto y desde 9 crítico. Es la convención de esta matriz; cada organización fija la suya.</p>
    </section>

    <span class="ancla" data-parada="riesgos-tabla"></span>
    <section class="s-riesgos s-riesgos-tabla" data-campo="tormenta-blanco" aria-labelledby="riesgos-tabla-titulo">
      <h2 id="riesgos-tabla-titulo">Los seis riesgos y cómo se mitigan</h2>
      <table>
        <colgroup><col class="c1"><col class="c2"><col class="c3"><col class="c4"><col></colgroup>
        <thead><tr><th scope="col">Categoría</th><th scope="col">Riesgo</th><th scope="col">Probabilidad</th><th scope="col">Impacto</th><th scope="col">Mitigación</th></tr></thead>
        <tbody>${RIESGOS.map(r => `<tr><td>${r.cat}</td><td>${r.riesgo}</td><td>${marca(NP[r.p])}</td><td>${marca(NI[r.i])}</td><td>${r.mit}</td></tr>`).join("")}</tbody>
      </table>
    </section>

    <span class="ancla" data-parada="riesgos-cierre"></span>
    <section class="s-riesgos s-riesgos-cierre" data-campo="tormenta-relampago" aria-labelledby="riesgos-cierre-titulo">
      <h2 id="riesgos-cierre-titulo"><span class="mask"><span class="in">Gestionar riesgos</span></span><span class="mask"><span class="in">sostiene el proyecto</span></span></h2>
      <p>Identificar, evaluar y mitigar riesgos es esencial para la sostenibilidad del proyecto.</p>
      <a class="boton" href="#riesgos-matriz" data-ir="riesgos-matriz">Volver a la matriz</a>
    </section>
  `,
  iniciar(ctx){
    const { gsap, ScrollTrigger, reducir, raiz } = ctx;
    const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];

    /* ---------- Ciclo PMI: un barco recorre los cinco pasos ---------- */
    const ciclo = $(".s-riesgos-ciclo"), barco = $(".s-riesgos-barco"), centro = $(".s-riesgos-rueda-centro");
    const estaciones = $$(".s-riesgos-estacion"), pasosBtn = $$(".s-riesgos-pasos button");
    let paso = -1, gira = null;
    function elegirPaso(k, mover){
      paso = k;
      pasosBtn.forEach((b, i) => { if (i === k) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
      estaciones.forEach((e, i) => e.classList.toggle("es-actual", i === k));
      centro.textContent = PASOS[k].n;
      if (mover){
        if (reducir) gsap.set(barco, { rotation:k * 72, svgOrigin:"0 0" });
        else gsap.to(barco, { rotation:(k * 72) + "_short", svgOrigin:"0 0", duration:.8, ease:"power3.inOut" });
      }
    }
    function recorrido(){
      if (gira) gira.kill();
      gsap.set(barco, { rotation:0, svgOrigin:"0 0" });
      gira = gsap.timeline({ repeat:-1 });
      for (let k = 0; k < 5; k++){
        gira.call(() => elegirPaso(k, false), null, k * 3.2)
          .to(barco, { rotation:(k + 1) * 72, svgOrigin:"0 0", duration:.9, ease:"power2.inOut" }, k * 3.2 + 2.3);
      }
    }
    pasosBtn.forEach((b, k) => b.addEventListener("click", () => { if (gira){ gira.kill(); gira = null; } elegirPaso(k, true); }));
    elegirPaso(0, true);

    /* ---------- Rosa de los vientos: siete rumbos ---------- */
    const rosa = $(".s-riesgos-rosa"), rosaSvg = rosa.querySelector("svg"), aguja = rosa.querySelector(".s-riesgos-aguja");
    const rumbos = $$(".s-riesgos-rumbo"), rumboBtn = $$(".s-riesgos-rumbo .boton"), puntas = $$(".s-riesgos-punta");
    const nombreR = $("#riesgos-rumbo-nombre"), ejemploR = $("#riesgos-rumbo-ejemplo");
    function colocarRosa(){
      const w = rosa.clientWidth, h = rosa.clientHeight;
      const S = Math.max(220, Math.min(h * .72, w * .52, 440));
      rosaSvg.style.width = rosaSvg.style.height = S + "px";
      const rr = S * .47 + 14;
      rumbos.forEach((el, k) => {
        const a = rad(angRumbo(k)), c = Math.cos(a), s = Math.sin(a);
        const d = rr + Math.abs(c) * el.offsetWidth / 2 + Math.abs(s) * el.offsetHeight / 2;
        el.style.left = (w / 2 + c * d) + "px";
        el.style.top = (h / 2 + s * d) + "px";
      });
    }
    let rumbo = -1;
    function elegirRumbo(k, animar){
      if (k === rumbo) return;
      rumbo = k;
      rumboBtn.forEach((b, i) => b.setAttribute("aria-pressed", i === k ? "true" : "false"));
      puntas.forEach((g, i) => g.classList.toggle("es-elegida", i === k));
      nombreR.textContent = RUMBOS[k].n;
      ejemploR.textContent = RUMBOS[k].e;
      const grados = k * 360 / 7;
      if (animar && !reducir) gsap.to(aguja, { rotation:grados.toFixed(2) + "_short", svgOrigin:"0 0", duration:.9, ease:"power3.out" });
      else gsap.set(aguja, { rotation:grados, svgOrigin:"0 0" });
    }
    rumboBtn.forEach((b, k) => b.addEventListener("click", () => elegirRumbo(k, true)));
    rosa.addEventListener("keydown", e => {
      const mas = e.key === "ArrowRight" || e.key === "ArrowDown", menos = e.key === "ArrowLeft" || e.key === "ArrowUp";
      if (!mas && !menos) return;
      e.preventDefault();
      const k = (Math.max(0, rumbo) + (mas ? 1 : 6)) % 7;
      elegirRumbo(k, true); rumboBtn[k].focus();
    });
    colocarRosa();
    elegirRumbo(0, false);
    let espera;
    addEventListener("resize", () => { clearTimeout(espera); espera = setTimeout(colocarRosa, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(colocarRosa);

    /* ---------- Matriz: las tarjetas caen como lluvia en su celda ---------- */
    const celda = (p, i) => raiz.querySelector(`.s-riesgos-celda[data-p="${p}"][data-i="${i}"] .s-riesgos-gotas`);
    const ficha = { cat:$("#riesgos-ficha-cat"), riesgo:$("#riesgos-ficha-riesgo"), p:$("#riesgos-ficha-p"), i:$("#riesgos-ficha-i"), n:$("#riesgos-ficha-n"), mit:$("#riesgos-ficha-mit") };
    const gotas = [];
    function seleccionar(r){
      gotas.forEach(g => g.el.setAttribute("aria-pressed", g.r === r ? "true" : "false"));
      ficha.cat.textContent = r.cat;
      ficha.riesgo.textContent = r.riesgo;
      ficha.p.innerHTML = marca(NP[r.p]);
      ficha.i.innerHTML = marca(NI[r.i]);
      ficha.n.innerHTML = marca(nivel(r.p, r.i));
      ficha.mit.textContent = r.mit;
    }
    function crearGota(r){
      const el = document.createElement("button");
      el.type = "button";
      el.className = "s-riesgos-gota" + (r.propio ? " es-propia" : "");
      el.textContent = r.propio ? r.riesgo : r.cat;
      el.setAttribute("aria-pressed", "false");
      el.setAttribute("aria-label", `${r.propio ? "Su riesgo: " + r.riesgo : r.cat}. Probabilidad ${NP[r.p].toLowerCase()}, impacto ${NI[r.i].toLowerCase()}, nivel ${nivel(r.p, r.i).toLowerCase()}`);
      el.addEventListener("click", () => seleccionar(r));
      celda(r.p, r.i).appendChild(el);
      const g = { r, el };
      gotas.push(g);
      return g;
    }
    function llover(lista){
      if (reducir) return;
      lista.forEach((g, k) => {
        const caida = g.el.getBoundingClientRect().top + 160 + Math.random() * 220;
        gsap.timeline({ delay:k * .17 })
          .fromTo(g.el, { y:-caida, rotation:(Math.random() - .5) * 16 },
            { y:0, rotation:0, duration:.7 + Math.random() * .25, ease:"power2.in" })
          .to(g.el, { scaleY:.86, transformOrigin:"50% 100%", duration:.06, ease:"power1.out" })
          .to(g.el, { scaleY:1, duration:.22, ease:"power2.out", clearProps:"transform" });
      });
    }
    RIESGOS.forEach(crearGota);
    seleccionar(RIESGOS[2]);
    const llueve = $(".s-riesgos-llover");
    if (reducir) llueve.hidden = true;
    llueve.addEventListener("click", () => llover(gotas));

    const form = $(".s-riesgos-propio"), quitar = $(".s-riesgos-quitar");
    let propias = 0;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      if (!nombre){ form.nombre.focus(); form.nombre.setAttribute("aria-invalid", "true"); return; }
      form.nombre.removeAttribute("aria-invalid");
      const r = { propio:true, cat:"Su riesgo", riesgo:nombre, p:+form.p.value, i:+form.i.value,
        mit:"Defínanla en el paso Planificar respuestas: evitar, reducir, transferir o aceptar el riesgo, con responsable." };
      const g = crearGota(r);
      propias++; quitar.hidden = false;
      seleccionar(r);
      llover([g]);
      form.nombre.value = "";
    });
    quitar.addEventListener("click", () => {
      for (let k = gotas.length - 1; k >= 0; k--) if (gotas[k].r.propio){ gotas[k].el.remove(); gotas.splice(k, 1); }
      propias = 0; quitar.hidden = true;
      seleccionar(RIESGOS[2]);
    });

    if (reducir) return;   /* sin movimiento: todo queda en su estado final */

    /* ---------- Apertura: Vernet se abre con el rayo y se acerca despacio ---------- */
    const ap = $(".s-riesgos-ap"), anclaR = $('[data-parada="riesgos"]');
    const fig = ap.querySelector(".s-riesgos-ap-pintura"), lineas = ap.querySelectorAll("h2 .in");
    const resto = ap.querySelectorAll(".s-riesgos-ap-texto > p");
    ocultar([fig]);
    gsap.set(lineas, { yPercent:105 });
    gsap.set(resto, { y:28, opacity:0 });
    alEntrar(ScrollTrigger, anclaR, "top 55%", () => {
      gsap.timeline()
        .add(revelar(gsap, [fig], { duration:1.1, ease:"power3.inOut" }))
        .to(lineas, { yPercent:0, duration:1, ease:"power4.out", stagger:.09 }, .2)
        .to(resto, { y:0, opacity:1, duration:.7, ease:"power3.out", stagger:.08 }, .5);
    });
    gsap.fromTo(fig.querySelector("img"), { scale:1.14 }, { scale:1, ease:"none",
      scrollTrigger:{ trigger:anclaR, start:"top bottom", end:() => "+=" + Math.round(innerHeight * 2.2), scrub:true } });

    /* ---------- Ciclo: entra y empieza el recorrido; se pausa fuera de pantalla ---------- */
    const rueda = $(".s-riesgos-rueda svg"), filas = $$(".s-riesgos-pasos li");
    gsap.set(rueda, { rotation:-50, opacity:0, transformOrigin:"50% 50%" });
    gsap.set(filas, { y:24, opacity:0 });
    alEntrar(ScrollTrigger, ciclo, "top 60%", () => {
      gsap.timeline()
        .to(rueda, { rotation:0, opacity:1, duration:1.1, ease:"power3.out" })
        .to(filas, { y:0, opacity:1, duration:.6, ease:"power3.out", stagger:.08, clearProps:"transform" }, .15)
        .call(() => { if (paso === 0 && !gira) recorrido(); });
    });
    ScrollTrigger.create({ trigger:ciclo, start:"top bottom", end:"bottom top",
      onToggle:self => { if (gira){ if (self.isActive) gira.play(); else gira.pause(); } } });

    /* ---------- Rosa: la aguja da una vuelta y se asienta en Datos ---------- */
    gsap.set(rumbos, { opacity:0 });
    alEntrar(ScrollTrigger, $(".s-riesgos-rumbos"), "top 60%", () => {
      gsap.timeline()
        .fromTo(aguja, { rotation:-360, svgOrigin:"0 0" }, { rotation:rumbo * 360 / 7, svgOrigin:"0 0", duration:1.6, ease:"power3.out" })
        .to(rumbos, { opacity:1, duration:.5, ease:"power2.out", stagger:.07 }, .2);
    });

    /* ---------- Matriz: lluvia al entrar ---------- */
    gsap.set(gotas.map(g => g.el), { opacity:0 });
    alEntrar(ScrollTrigger, $(".s-riesgos-cuadro"), "top 55%", () => {
      gsap.set(gotas.map(g => g.el), { opacity:1 });
      llover(gotas);
    });

    /* ---------- Tabla: fila por fila ---------- */
    const filasT = $$(".s-riesgos-tabla tbody tr");
    gsap.set(filasT, { y:20, opacity:0 });
    alEntrar(ScrollTrigger, $(".s-riesgos-tabla table"), "top 75%", () => {
      gsap.to(filasT, { y:0, opacity:1, duration:.55, ease:"power3.out", stagger:.07, clearProps:"transform" });
    });

    /* ---------- Cierre ---------- */
    const cIn = $$(".s-riesgos-cierre h2 .in");
    gsap.set(cIn, { yPercent:105 });
    alEntrar(ScrollTrigger, $(".s-riesgos-cierre"), "top 65%", () => {
      gsap.to(cIn, { yPercent:0, duration:1, ease:"power4.out", stagger:.09 });
    });
  }
});
})();
