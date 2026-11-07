/* secciones/80-tanque.js — Los tiburones: la actividad El Tanque (pitch, preguntas, veredicto y cartas de giro) */
(() => {
"use strict";
/* Mar profundo en bandas planas. Blanco sobre cada azul: 6,1:1 (#1a65a6) a 17,9:1 (#06182b). Menta para acciones. */
const AZ = { sup:"#1a65a6", claro:"#15568f", medio:"#0f3d66", hondo:"#0a2a47", noche:"#06182b" };
const MENTA = "#a7ff9c", NARANJA = "#ff6831";
Object.entries(AZ).forEach(([n, bg]) => Clase.campo("tanque-" + n, { bg, ink:"#ffffff", btn:[MENTA, "#000000"] }));

const CUADRO = { src:"img/tanque/assets/gulf-stream.jpg", w:2400, h:1443 };
const PASOS = [
  { nombre:"Pitch de 3 minutos", corto:"Pitch", texto:"Presentación corta de venta: el problema con un número, la solución en una frase y cuánto piden para hacerlo.", detalle:"Detalle: el hombre en el bote.", marca:{ x:.609, y:.398 }, c:{ x:.60, y:.47, s:2.4 } },
  { nombre:"Los tiburones preguntan", corto:"Preguntas", texto:"Sus compañeros atacan desde un ángulo: datos y modelo, dinero, legal y ética, usuarios y escala.", detalle:"Detalle: los tiburones.", marca:{ x:.443, y:.814 }, c:{ x:.46, y:.76, s:2.2 } },
  { nombre:"Veredicto", corto:"Veredicto", texto:"Cada tiburón decide: dentro, dentro con condiciones o fuera. Y dice qué tendría que cambiar.", detalle:"Detalle: un barco en el horizonte.", marca:{ x:.241, y:.196 }, c:{ x:.245, y:.21, s:3 } }
];
/* Cartas de giro: cada una con su imagen (todas ya acreditadas en otras secciones del sitio) */
const GIROS = [
  { t:"Su usuario crece 10 veces el próximo año: ¿qué se rompe primero?", img:"img/implementacion/assets/great-eastern-cadenas-1857.jpg", pos:"60% 50%", alt:"Las cadenas gigantes del Great Eastern, el barco más grande de su época." },
  { t:"Un competidor lanza algo parecido, gratis.", img:"img/tanque/assets/gulf-stream.jpg", pos:"44% 82%", alt:"Detalle de The Gulf Stream: tiburones rodean el bote." },
  { t:"La norma cambia y ahora exige explicar cada decisión.", img:"img/etica/assets/faro-lente-1931.jpg", pos:"50% 50%", alt:"Lente de un faro, de 1931." },
  { t:"Descubren que sus datos tienen sesgo por región o por género.", img:"img/casos/assets/nueva-granada-1858.jpg", pos:"50% 45%", alt:"Mapa antiguo de la Nueva Granada, dividido por regiones." },
  { t:"Les recortan el presupuesto un 40%: ¿qué sacan del alcance con MoSCoW (Debe, Debería, Podría y No tendrá)?", img:"img/evaluacion/assets/ev-fardos.jpg", pos:"50% 50%", alt:"Fardos de carga suben a la bodega de un velero." },
  { t:"Seis meses después, la precisión baja sin que nadie lo note.", img:"img/riesgos/assets/tormenta-turner.jpg", pos:"50% 50%", alt:"Tormenta en el mar pintada por Turner." },
  { t:"El sponsor (el directivo que patrocina el proyecto) se va de la organización.", img:"img/riesgos/assets/naufragio-vernet.jpg", pos:"50% 50%", alt:"Naufragio pintado por Vernet." },
  { t:"Otra organización quiere usar su solución: ¿qué cambian?", img:"img/mercado/assets/muelle-puerto-colombia.jpg", pos:"50% 50%", alt:"El muelle de Puerto Colombia." },
  { t:"Un afectado reclama por una decisión del modelo: ¿quién responde?", img:"img/evaluacion/assets/ev-aduana.jpg", pos:"50% 50%", alt:"La antigua Aduana de Barranquilla." },
  { t:"El proveedor de nube o de API (servicio externo que usan) sube el precio o descontinúa el servicio.", img:"img/riesgos/assets/noveno-oleaje.jpg", pos:"50% 60%", alt:"El noveno oleaje, de Aivazovsky." }
];
const INICIAL = { img:CUADRO.src, pos:"44% 82%", alt:"Detalle de The Gulf Stream: tiburones rodean el bote." };
const PIE_CUADRO = "Winslow Homer, The Gulf Stream, 1899. El bote, los tiburones y el barco del horizonte: los tres momentos de cada ronda.";

/* Aleta dorsal dibujada en código (formas planas rellenas) */
const aleta = (color, ancho, girar) => `<svg class="ta-aleta${girar ? " ta-girar" : ""}" viewBox="0 0 100 80" width="${ancho}" height="${Math.round(ancho * .8)}" aria-hidden="true" focusable="false"><path fill="${color}" d="M0 80 C25 58 52 14 80 0 C74 26 78 58 100 80 Z"/></svg>`;
/* Un nado: contenedor que mueve el scroll (x) con la aleta adentro */
const nado = (izq, dx, contenido, arriba) => `<div class="ta-nado" style="left:${izq}%${arriba === undefined ? "" : `;top:${arriba}%;bottom:auto`}" data-dx="${dx}">${contenido}</div>`;

Clase.seccion({
  id:"tanque",
  orden:80,
  indice:{ texto:"Los tiburones", ir:"tanque", nota:"Actividad El Tanque: pitch, preguntas, veredicto y cartas de giro" },
  creditos:[
    `<a href="https://commons.wikimedia.org/wiki/File:Winslow_Homer_-_The_Gulf_Stream_-_Metropolitan_Museum_of_Art.jpg">«The Gulf Stream»</a>, Winslow Homer, 1899, The Metropolitan Museum of Art. Dominio público, vía Wikimedia Commons.`
  ],
  css:`
  .s-tanque{color:#fff}
  .s-tanque h2,.s-tanque h3{color:#fff}
  .s-tanque .boton:focus-visible{outline-color:#fff}

  /* ---------- Apertura: el cuadro bajo el titular */
  .s-tanque.ta-apertura{display:flex;flex-direction:column;padding-bottom:0}
  .s-tanque .ta-ap-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:end}
  .s-tanque .ta-ap-cab h2{grid-column:1/9;font-size:var(--step-display)}
  .s-tanque .ta-ap-lado{grid-column:9/13;display:flex;flex-direction:column;gap:12px;padding-bottom:6px}
  .s-tanque .ta-ap-lead{font-size:var(--step-lead);line-height:1.25;font-weight:600}
  .s-tanque .ta-ap-barra{line-height:1.4}
  .s-tanque .ta-cuadro{position:relative;flex:1;min-height:0;margin:24px calc(-1 * var(--margen)) 0;overflow:hidden;background:#0a2a47}
  .s-tanque .ta-cuadro img{position:absolute;left:0;top:-8%;width:100%;height:116%;object-fit:cover;object-position:50% 64%}
  .s-tanque .ta-ap-pie{font-size:var(--step-small);line-height:1.4}

  /* ---------- Franja: el agua sube en bandas, con aletas */
  .s-tanque.ta-franja{position:relative;z-index:1;display:flex;flex-direction:column}
  .s-tanque .ta-banda{position:relative;height:9svh;min-height:56px;background:var(--b)}
  .s-tanque .ta-aletas{position:absolute;left:0;right:0;bottom:100%;height:0;pointer-events:none}
  .s-tanque .ta-nado{position:absolute;bottom:-2px;will-change:transform}
  .s-tanque .ta-aleta{display:block}
  .s-tanque .ta-girar{scale:-1 1}

  /* ---------- Dinámica: tres recortes de un mismo cuadro */
  .s-tanque.ta-dinamica{background:#0a2a47;height:100svh;min-height:640px;padding:112px var(--margen) 36px;display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr;column-gap:var(--gap);row-gap:24px;overflow:hidden}
  .sin-movimiento .s-tanque.ta-dinamica{height:auto;min-height:100svh}
  .s-tanque .ta-di-cab{grid-column:1/-1;display:flex;align-items:flex-end;justify-content:space-between;gap:var(--gap)}
  .s-tanque .ta-di-cab h2{font-size:var(--step-head)}
  .s-tanque .ta-di-izq{grid-column:1/6;display:flex;flex-direction:column;gap:22px;align-self:start}
  .s-tanque .ta-di-izq > .ta-botones{display:flex;gap:12px;flex-wrap:wrap}
  .s-tanque .ta-pasos{list-style:none;display:flex;flex-direction:column;gap:20px}
  .s-tanque .ta-paso{position:relative;padding-left:24px}
  .s-tanque .ta-paso::before{content:"";position:absolute;left:0;top:2px;bottom:2px;width:8px;background:#a7ff9c;scale:1 0;transform-origin:50% 0;transition:scale .35s}
  .s-tanque .ta-paso.activo::before{scale:1 1}
  .s-tanque .ta-paso h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-tanque .ta-paso p{margin-top:8px;line-height:1.42;max-width:44ch}
  .s-tanque .ta-di-cuadro{grid-column:6/13;align-self:start;display:flex;flex-direction:column;gap:10px}
  .s-tanque .ta-di-marco{position:relative;overflow:hidden;aspect-ratio:2400/1443;background:#06182b}
  .s-tanque .ta-di-lienzo{position:absolute;inset:0;transform-origin:0 0;will-change:transform}
  .s-tanque .ta-di-lienzo img{width:100%;height:100%}
  .s-tanque .ta-marca{position:absolute;display:flex;align-items:center;gap:8px;pointer-events:none;translate:-7px -50%}
  .s-tanque .ta-marca i{display:block;width:14px;height:14px;background:#a7ff9c;border:2px solid #000}
  .s-tanque .ta-marca b{background:#fff;color:#000;font-weight:600;padding:5px 10px;line-height:1.2}
  .s-tanque .ta-di-pie{font-size:var(--step-small);line-height:1.4;min-height:2.8em}

  /* ---------- Cartas de giro */
  .s-tanque.ta-giro{background:#0a2a47;min-height:100svh;padding:112px var(--margen) 56px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:28px;align-content:start}
  .s-tanque .ta-gi-cab{grid-column:1/7;grid-row:1}
  .s-tanque .ta-gi-cab h2{font-size:var(--step-head)}
  .s-tanque .ta-gi-cab p{margin-top:16px;line-height:1.42;max-width:48ch}
  .s-tanque .ta-gi-ctrl{grid-column:7/13;grid-row:1;align-self:end;display:flex;flex-direction:column;align-items:flex-start;gap:14px}
  .s-tanque .ta-gi-ctrl .ta-botones{display:flex;gap:12px;flex-wrap:wrap}
  .s-tanque .ta-quedan{font-weight:600}
  .s-tanque .boton[disabled]{background:#0a2a47;color:#fff;border-color:#fff;cursor:not-allowed}
  .s-tanque .ta-mesa{grid-column:1/9;grid-row:2;display:grid;grid-template-columns:minmax(180px,250px) minmax(0,600px);column-gap:40px;align-items:center;perspective:1400px}
  .s-tanque .ta-mazo{position:relative;aspect-ratio:5/7;width:100%}
  .s-tanque .ta-mazo > span{position:absolute;inset:0;background:#15568f;border:2px solid #fff;translate:calc(var(--i) * 7px) calc(var(--i) * -7px)}
  .s-tanque .ta-mazo .ta-tope{overflow:hidden;background:#06182b}
  .s-tanque .ta-tope img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:44% 82%;scale:2.6;transform-origin:44% 82%}
  .s-tanque .ta-tope b{position:absolute;left:0;right:0;bottom:0;background:#06182b;color:#fff;font-weight:600;font-size:var(--step-small);padding:8px 10px}
  .s-tanque .ta-carta{position:relative;background:#fff;color:#000;border:2px solid #000;display:flex;flex-direction:column;transform-style:preserve-3d}
  .s-tanque .ta-carta-img{position:relative;aspect-ratio:16/8;overflow:hidden;background:#15568f;border-bottom:2px solid #000;margin:0}
  .s-tanque .ta-carta-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.08);mix-blend-mode:multiply}
  .s-tanque .ta-carta-cuerpo{padding:22px 28px 20px;display:flex;flex-direction:column;gap:14px;min-height:clamp(150px,20svh,200px);justify-content:space-between}
  .s-tanque .ta-carta-txt{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15;max-width:28ch}
  .s-tanque .ta-carta-pie{font-size:var(--step-small);font-weight:600}
  .s-tanque .ta-salieron{grid-column:9/13;grid-row:2;align-self:start}
  .s-tanque .ta-salieron h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-tanque .ta-salieron ol{margin-top:12px;padding-left:1.4em}
  .s-tanque .ta-salieron li{break-inside:avoid;margin-bottom:8px;line-height:1.4}
  .s-tanque .ta-salieron .ta-vacio{list-style:none;margin-left:-1.4em}

  @media (max-width:900px){
    .s-tanque .ta-gi-cab,.s-tanque .ta-gi-ctrl,.s-tanque .ta-mesa{grid-column:1/-1;grid-row:auto}
    .s-tanque .ta-mesa{grid-template-columns:1fr;row-gap:28px}
    .s-tanque .ta-mazo{width:min(220px,60%)}
    .s-tanque .ta-ap-cab h2,.s-tanque .ta-ap-lado,.s-tanque .ta-di-izq,.s-tanque .ta-di-cuadro,.s-tanque .ta-gi-cab,.s-tanque .ta-gi-ctrl,.s-tanque .ta-mesa{grid-column:1/-1;grid-row:auto}
    .s-tanque.ta-dinamica{height:auto;min-height:100svh}
    .s-tanque .ta-salieron{grid-column:1/-1;grid-row:auto}
  }
  `,
  html:`
  <span class="ancla" id="tanque" data-parada="tanque"></span>
  <section class="s-tanque ta-apertura cap" data-campo="tanque-noche" style="--campo:${AZ.noche};--tinta:#fff" aria-labelledby="tanque-titulo">
    <div class="ta-ap-cab">
      <h2 id="tanque-titulo"><span class="mask"><span class="in">Frente a</span></span><span class="mask"><span class="in">los tiburones</span></span></h2>
      <div class="ta-ap-lado">
        <p class="ta-ap-lead">¿Qué tan sólida es la idea de su proyecto y hasta dónde escala?</p>
        <p class="ta-ap-barra">Lo que construyamos hoy (modelo, semáforo, números y riesgos) es lo que van a defender.</p>
        <p class="ta-ap-pie">Winslow Homer, The Gulf Stream, 1899. The Metropolitan Museum of Art.</p>
      </div>
    </div>
    <figure class="ta-cuadro" aria-label="The Gulf Stream, Winslow Homer, 1899">
      <img src="${CUADRO.src}" width="${CUADRO.w}" height="${CUADRO.h}" fetchpriority="high" decoding="async" alt="Pintura de Winslow Homer: un hombre recostado en un bote sin mástil, en mar agitado, rodeado de tiburones; al fondo, una tromba y un barco lejano.">
    </figure>
  </section>

  <div class="s-tanque ta-franja" data-campo="tanque-claro" aria-hidden="true">
    <div class="ta-banda" style="--b:${AZ.claro}"><div class="ta-aletas">${nado(10, 22, aleta(AZ.claro, 96))}${nado(62, 30, aleta(AZ.claro, 64))}</div></div>
    <div class="ta-banda" style="--b:${AZ.medio}"><div class="ta-aletas">${nado(36, -34, aleta(AZ.medio, 120, true))}</div></div>
    <div class="ta-banda" style="--b:${AZ.hondo}"><div class="ta-aletas">${nado(80, 16, aleta(AZ.hondo, 58))}</div></div>
  </div>

  <span class="ancla" data-parada="tanque-dinamica"></span>
  <section class="s-tanque ta-dinamica" data-campo="tanque-hondo" aria-labelledby="tanque-dinamica-titulo">
    <div class="ta-di-cab"><h2 id="tanque-dinamica-titulo">Pitch, preguntas y veredicto</h2></div>
    <div class="ta-di-izq">
      <ol class="ta-pasos">
        ${PASOS.map(p => `<li class="ta-paso"><h3>${p.nombre}</h3><p>${p.texto}</p></li>`).join("")}
      </ol>
      <div class="ta-botones"><button class="boton" type="button" data-crono="pitch">Iniciar pitch de 3 minutos</button><button class="boton" type="button" data-crono="preguntas">Iniciar preguntas de 7 minutos</button></div>
    </div>
    <figure class="ta-di-cuadro">
      <div class="ta-di-marco">
        <div class="ta-di-lienzo"><img src="${CUADRO.src}" width="${CUADRO.w}" height="${CUADRO.h}" loading="lazy" decoding="async" alt="The Gulf Stream, de Winslow Homer, con tres puntos marcados: el hombre en el bote, los tiburones y un barco en el horizonte."></div>
        ${PASOS.map(p => `<span class="ta-marca" style="left:${(p.marca.x * 100).toFixed(1)}%;top:${(p.marca.y * 100).toFixed(1)}%" aria-hidden="true"><i></i><b>${p.corto}</b></span>`).join("")}
      </div>
      <figcaption class="ta-di-pie" aria-live="polite">${PIE_CUADRO}</figcaption>
    </figure>
  </section>
  <span class="ancla" data-parada="tanque-giro"></span>
  <section class="s-tanque ta-giro" data-campo="tanque-hondo" aria-labelledby="tanque-giro-titulo">
    <div class="ta-gi-cab">
      <h2 id="tanque-giro-titulo">Cartas de giro</h2>
      <p>Después de las preguntas, saquen una carta y el grupo responde. Las cartas no se repiten hasta que se acaba el mazo.</p>
    </div>
    <div class="ta-gi-ctrl">
      <div class="ta-botones">
        <button class="boton" type="button" id="tanque-sacar">Sacar carta de giro</button>
        <button class="boton" type="button" id="tanque-barajar">Barajar de nuevo</button>
      </div>
      <p class="ta-quedan" id="tanque-quedan"></p>
    </div>
    <div class="ta-mesa">
      <div class="ta-mazo" aria-hidden="true">
        <span style="--i:3"></span><span style="--i:2"></span><span style="--i:1"></span>
        <span class="ta-tope" style="--i:0"><img src="${CUADRO.src}" width="${CUADRO.w}" height="${CUADRO.h}" alt="" loading="lazy" decoding="async"><b>Carta de giro</b></span>
      </div>
      <div class="ta-carta" id="tanque-carta">
        <figure class="ta-carta-img"><img id="tanque-carta-img" src="${INICIAL.img}" style="object-position:${INICIAL.pos}" alt="${INICIAL.alt}" decoding="async"></figure>
        <div class="ta-carta-cuerpo">
          <p class="ta-carta-txt" id="tanque-carta-txt" aria-live="polite">El mazo tiene 10 cartas. Saquen la primera cuando terminen las preguntas.</p>
          <p class="ta-carta-pie" id="tanque-carta-pie">Carta de giro</p>
        </div>
      </div>
    </div>
    <div class="ta-salieron">
      <h3>Ya salieron</h3>
      <ol id="tanque-salieron"></ol>
    </div>
  </section>
  `,
  iniciar(ctx){
    const { gsap, ScrollTrigger, reducir, raiz } = ctx;
    const C = ctx.Clase;
    const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];
    const leer = (k, d) => { try { return JSON.parse(sessionStorage.getItem(k)) || d; } catch (e){ return d; } };
    const escribir = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e){ /* sin almacenamiento */ } };
    const barajar = n => { const a = [...Array(n).keys()]; for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

    /* ---- Cronómetros de la ronda */
    const CRONOS = {
      pitch:[3, "Pitch", "Problema con un número, solución en una frase y el pedido"],
      preguntas:[7, "Preguntas de los tiburones", "Máximo 2 por tiburón, sin consejos, respuestas de 30 segundos"]
    };
    $$("[data-crono]").forEach(b => b.addEventListener("click", () => { const c = CRONOS[b.dataset.crono]; C.cronometro(c[0], c[1], c[2]); }));

    /* ---- Mazo de cartas de giro: sin repetir hasta agotarlo */
    const MAZO = "clase-tanque-mazo";
    let mazo = leer(MAZO, null);
    if (!mazo || !Array.isArray(mazo.resto)) mazo = { resto:barajar(GIROS.length), salidas:[] };
    const carta = $("#tanque-carta"), txt = $("#tanque-carta-txt"), pieCarta = $("#tanque-carta-pie"), imgCarta = $("#tanque-carta-img");
    const ponerImg = g => { imgCarta.src = g.img; imgCarta.style.objectPosition = g.pos; imgCarta.alt = g.alt; };
    GIROS.forEach(g => { const im = new Image(); im.src = g.img; });   /* precarga para que el cambio sea inmediato */
    const btnSacar = $("#tanque-sacar"), capas = $$(".ta-mazo > span");
    function pintarMazo(){
      const q = mazo.resto.length, total = GIROS.length;
      $("#tanque-quedan").textContent = q ? `Quedan ${q} de ${total} cartas.` : "Se acabó el mazo. Barájenlo de nuevo para volver a empezar.";
      btnSacar.disabled = q === 0;
      capas.forEach((c, i) => { c.style.visibility = (capas.length - i) <= q ? "visible" : "hidden"; });
      const ol = $("#tanque-salieron");
      ol.innerHTML = mazo.salidas.length ? mazo.salidas.map(i => `<li>${GIROS[i].t}</li>`).join("") : `<li class="ta-vacio">Todavía no ha salido ninguna carta.</li>`;
      escribir(MAZO, mazo);
    }
    function mostrar(texto, pie, g){
      const poner = () => { txt.textContent = texto; pieCarta.textContent = pie; ponerImg(g); };
      if (reducir){ poner(); return; }
      gsap.timeline()
        .to(carta, { rotationY:-90, x:-30, duration:.2, ease:"power2.in" })
        .add(poner)
        .to(carta, { rotationY:0, x:0, duration:.45, ease:"back.out(1.4)" });
    }
    btnSacar.addEventListener("click", () => {
      if (!mazo.resto.length) return;
      const i = mazo.resto.pop(); mazo.salidas.push(i);
      mostrar(GIROS[i].t, `Carta ${mazo.salidas.length} de ${GIROS.length}`, GIROS[i]);
      pintarMazo();
    });
    $("#tanque-barajar").addEventListener("click", () => {
      mazo = { resto:barajar(GIROS.length), salidas:[] };
      mostrar("Mazo barajado: 10 cartas. Saquen la primera cuando terminen las preguntas.", "Carta de giro", INICIAL);
      pintarMazo();
    });
    if (mazo.salidas.length){ const u = mazo.salidas[mazo.salidas.length - 1]; txt.textContent = GIROS[u].t; ponerImg(GIROS[u]); pieCarta.textContent = `Carta ${mazo.salidas.length} de ${GIROS.length}`; }
    pintarMazo();

    /* ---- Recortes del cuadro: posición de la cámara para cada paso */
    const lienzo = $(".ta-di-lienzo"), pie = $(".ta-di-pie"), pasos = $$(".ta-paso"), marcas = $$(".ta-marca");
    const pose = c => ({ scale:c.s, xPercent:(.5 - c.s * c.x) * 100, yPercent:(.5 - c.s * c.y) * 100 });

    if (reducir) return;

    /* ======== Movimiento firma: el agua sube en bandas, las aletas cruzan y la cámara entra al cuadro ======== */
    const ancla = $('[data-parada="tanque"]'), ap = $(".ta-apertura");
    gsap.timeline({ scrollTrigger:{ trigger:ancla, start:"top 78%", toggleActions:"play none none reverse" } })
      .from(ap.querySelectorAll("h2 .in"), { yPercent:105, duration:1, ease:"power4.out", stagger:.1 })
      .from(ap.querySelectorAll(".ta-ap-lado > *"), { y:22, opacity:0, duration:.7, ease:"power3.out", stagger:.1 }, .3)
      .fromTo(ap.querySelector(".ta-cuadro"), { clipPath:"inset(100% 0% 0% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", duration:1.3, ease:"power3.inOut" }, .05);
    gsap.fromTo(ap.querySelector(".ta-cuadro img"), { yPercent:-3, scale:1 }, { yPercent:5, scale:1.08, ease:"none",
      scrollTrigger:{ trigger:ancla, start:"top top", end:() => "+=" + Math.round(innerHeight * 1.1), scrub:true, invalidateOnRefresh:true } });

    /* Aletas: cada capa de agua cruza a su propia velocidad */
    const nadar = (el, disparo) => {
      const dx = +el.dataset.dx;
      gsap.fromTo(el, { x:() => -dx * innerWidth / 200 }, { x:() => dx * innerWidth / 200, ease:"none",
        scrollTrigger:{ trigger:disparo, start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true } });
    };
    const franja = $(".ta-franja");
    franja.querySelectorAll(".ta-nado").forEach(el => nadar(el, franja));

    /* Dinámica fijada: la cámara viaja del cuadro completo al bote, a los tiburones y al barco */
    const di = $(".ta-dinamica");
    gsap.set(lienzo, { transformOrigin:"0 0", scale:1, xPercent:0, yPercent:0 });
    const tl = gsap.timeline({ defaults:{ ease:"power2.inOut" } })
      .to(marcas, { opacity:0, duration:.07 }, 0)
      .to(lienzo, { ...pose(PASOS[0].c), duration:.15 }, 0)
      .to(lienzo, { ...pose(PASOS[1].c), duration:.2 }, .3)
      .to(lienzo, { ...pose(PASOS[2].c), duration:.2 }, .65)
      .to({}, { duration:.15 }, .85);
    let activo = -2;
    const activar = p => {
      const i = p < .12 ? -1 : p < .45 ? 0 : p < .78 ? 1 : 2;
      if (i === activo) return; activo = i;
      pasos.forEach((li, k) => li.classList.toggle("activo", k === i));
      pie.textContent = i < 0 ? PIE_CUADRO : PASOS[i].detalle;
    };
    const st = ScrollTrigger.create({ trigger:di, start:"top top", end:() => "+=" + Math.round(innerHeight * 3), pin:true, scrub:.6, animation:tl, anticipatePin:1, invalidateOnRefresh:true, onUpdate:self => activar(self.progress) });
    C.parada("tanque-pitch", () => st.start + (st.end - st.start) * .22);
    C.parada("tanque-preguntas", () => st.start + (st.end - st.start) * .57);
    C.parada("tanque-veredicto", () => st.start + (st.end - st.start) * .95);
    gsap.from(di.querySelectorAll(".ta-di-cab h2, .ta-paso, .ta-di-izq > .boton"), { y:30, opacity:0, duration:.7, ease:"power3.out", stagger:.08,
      scrollTrigger:{ trigger:di, start:"top 75%", toggleActions:"play none none reverse" } });

    /* Mazo: entrada de la mesa */
    const gi = $(".ta-giro");
    gsap.from(gi.querySelectorAll(".ta-mazo > span"), { y:-60, rotation:-8, opacity:0, duration:.6, ease:"power3.out", stagger:.06,
      scrollTrigger:{ trigger:gi, start:"top 70%", toggleActions:"play none none reverse" } });
    gsap.from(carta, { rotationY:-70, x:-60, opacity:0, duration:.8, ease:"power3.out",
      scrollTrigger:{ trigger:gi, start:"top 65%", toggleActions:"play none none reverse" } });
  }
});
})();
