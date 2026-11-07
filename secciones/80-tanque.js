/* secciones/80-tanque.js — Los tiburones: la actividad El Tanque (pitch, preguntas, cartas de giro y veredicto) */
(() => {
"use strict";
/* Mar profundo en bandas planas. Blanco sobre cada azul: 6,1:1 (#1a65a6) a 17,9:1 (#06182b). Menta para acciones. */
const AZ = { sup:"#1a65a6", claro:"#15568f", medio:"#0f3d66", hondo:"#0a2a47", noche:"#06182b" };
const MENTA = "#a7ff9c", NARANJA = "#ff6831";
Object.entries(AZ).forEach(([n, bg]) => Clase.campo("tanque-" + n, { bg, ink:"#ffffff", btn:[MENTA, "#000000"] }));

const CUADRO = { src:"img/tanque/assets/gulf-stream.jpg", w:2400, h:1443 };
const PASOS = [
  { nombre:"Pitch de 3 minutos", corto:"Pitch", texto:"El problema con un número, la solución en una frase y cuánto piden para hacerlo.", detalle:"Detalle: el hombre en el bote.", marca:{ x:.609, y:.398 }, c:{ x:.60, y:.47, s:2.4 } },
  { nombre:"Los tiburones preguntan", corto:"Preguntas", texto:"Sus compañeros atacan desde un ángulo: datos y modelo, dinero, legal y ética, usuarios y escala.", detalle:"Detalle: los tiburones.", marca:{ x:.443, y:.814 }, c:{ x:.46, y:.76, s:2.2 } },
  { nombre:"Veredicto", corto:"Veredicto", texto:"Cada tiburón decide: dentro, dentro con condiciones o fuera. Y dice qué tendría que cambiar.", detalle:"Detalle: un barco en el horizonte.", marca:{ x:.241, y:.196 }, c:{ x:.245, y:.21, s:3 } }
];
const PIE_CUADRO = "Winslow Homer, The Gulf Stream, 1899. El bote, los tiburones y el barco del horizonte: los tres momentos de cada ronda.";
const RONDA = [
  { n:"Pitch", t:3, r:"El problema con un número y su línea base, la solución en una frase y el pedido, que es el CAPEX.", a:`<button class="boton" type="button" data-crono="pitch">Iniciar pitch de 3 minutos</button>` },
  { n:"Preguntas", t:7, r:"Máximo 2 por tiburón, sin consejos y con respuestas de 30 segundos. «No lo sé y así lo averiguo» vale; inventar una cifra, no.", a:`<button class="boton" type="button" data-crono="preguntas">Iniciar preguntas de 7 minutos</button>` },
  { n:"Carta de giro", r:"Se saca una carta del mazo y el grupo responde.", a:`<a class="boton" href="#tanque-giro" data-ir="tanque-giro">Ir al mazo</a>` },
  { n:"Voto", r:"Cada tiburón vota dentro, dentro con condición o fuera, y suma una condición.", a:`<a class="boton" href="#tanque-marcador" data-ir="tanque-marcador">Ir al marcador</a>` },
  { n:"Devolución", r:"Cada tiburón dice qué tendría que cambiar en el proyecto.", a:"" }
];
const TIBURONES = [
  { n:"Datos y modelo", q:["¿Cuántos registros tienen y quién es el dueño?", "¿Qué baseline mínimo necesitan y por qué ese?"] },
  { n:"Financiero", q:["¿De dónde sale el beneficio anual? ¿Cuál es la línea base?", "Si el ahorro es la mitad, ¿en cuántos meses recuperan la inversión?"] },
  { n:"Legal y ético", q:["¿Qué datos personales toca y bajo qué autorización?", "Si el modelo se equivoca con una persona, ¿cómo se le explica?"] },
  { n:"Usuario y adopción", q:["¿Quién deja de hacer qué hoy?", "¿Por qué lo usaría un martes a las 4 p. m.?"] },
  { n:"Escala", q:["¿Qué se rompe primero si multiplican el uso por 10?", "¿Qué cambiarían para venderlo a otra organización?"] }
];
const BANDAS = ["sup", "claro", "medio", "hondo", "noche"];
const GIROS = [
  "Su usuario crece 10 veces el próximo año: ¿qué se rompe primero?",
  "Un competidor lanza algo parecido, gratis.",
  "La norma cambia y ahora exige explicar cada decisión.",
  "Descubren que sus datos tienen sesgo por región o por género.",
  "Les recortan el presupuesto un 40%: ¿qué sacan del alcance con MoSCoW?",
  "Seis meses después, la precisión baja sin que nadie lo note.",
  "El sponsor se va de la organización.",
  "Otra organización quiere usar su solución: ¿qué cambian?",
  "Un afectado reclama por una decisión del modelo: ¿quién responde?",
  "El proveedor de nube o de API sube el precio o descontinúa el servicio."
];
const ESCALERA = ["Piloto", "10 veces el uso", "Otra organización"];
const VOTOS = [
  { id:"dentro", n:"Dentro", etq:"dentro", color:MENTA },
  { id:"condicion", n:"Dentro con condiciones", etq:"con condiciones", color:"#ffffff" },
  { id:"fuera", n:"Fuera", etq:"fuera", color:NARANJA }
];
const LECTURA = { dentro:"Por ahora: flota.", condicion:"Por ahora: flota, con condiciones.", fuera:"Por ahora: se hunde." };

/* Aleta dorsal y silueta de tiburón dibujadas en código (formas planas rellenas) */
const aleta = (color, ancho, girar) => `<svg class="ta-aleta${girar ? " ta-girar" : ""}" viewBox="0 0 100 80" width="${ancho}" height="${Math.round(ancho * .8)}" aria-hidden="true" focusable="false"><path fill="${color}" d="M0 80 C25 58 52 14 80 0 C74 26 78 58 100 80 Z"/></svg>`;
const silueta = (color, ancho) => `<svg class="ta-silueta" viewBox="0 0 300 100" width="${ancho}" height="${Math.round(ancho / 3)}" aria-hidden="true" focusable="false"><path fill="${color}" fill-rule="evenodd" d="M2 55 C20 40 70 28 112 28 C122 16 128 6 136 0 C136 12 140 22 152 30 C190 34 222 40 244 46 C258 34 274 16 296 4 C286 22 276 40 268 52 C276 62 284 72 290 86 C270 76 256 66 244 60 C214 66 184 70 150 72 C140 82 134 90 126 98 C124 88 118 78 112 70 C80 70 40 70 22 64 C12 62 4 60 2 55 Z M31 47 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 Z"/></svg>`;
/* Un nado: contenedor que mueve el scroll (x) con la aleta adentro */
const nado = (izq, dx, contenido, arriba) => `<div class="ta-nado" style="left:${izq}%${arriba === undefined ? "" : `;top:${arriba}%;bottom:auto`}" data-dx="${dx}">${contenido}</div>`;

Clase.seccion({
  id:"tanque",
  orden:80,
  indice:{ texto:"Los tiburones", ir:"tanque", nota:"Actividad El Tanque: pitch, preguntas, cartas de giro y veredicto" },
  creditos:[
    `<a href="https://commons.wikimedia.org/wiki/File:Winslow_Homer_-_The_Gulf_Stream_-_Metropolitan_Museum_of_Art.jpg">«The Gulf Stream»</a>, Winslow Homer, 1899, The Metropolitan Museum of Art. Dominio público, vía Wikimedia Commons.`,
    `Video <a href="https://commons.wikimedia.org/wiki/File:Blacktip_reef_shark_in_Shark_Bay_Koh_Tao.webm">«Blacktip reef shark in Shark Bay Koh Tao»</a>, MichaelWhi, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>, vía Wikimedia Commons. Recortado y pasado a tonos azules; la versión adaptada se comparte con la misma licencia.`
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
  .s-tanque .ta-aleta,.s-tanque .ta-silueta{display:block}
  .s-tanque .ta-girar{scale:-1 1}

  /* ---------- Dinámica: tres recortes de un mismo cuadro */
  .s-tanque.ta-dinamica{background:#0a2a47;height:100svh;min-height:640px;padding:112px var(--margen) 36px;display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr;column-gap:var(--gap);row-gap:24px;overflow:hidden}
  .sin-movimiento .s-tanque.ta-dinamica{height:auto;min-height:100svh}
  .s-tanque .ta-di-cab{grid-column:1/-1;display:flex;align-items:flex-end;justify-content:space-between;gap:var(--gap)}
  .s-tanque .ta-di-cab h2{font-size:var(--step-head)}
  .s-tanque .ta-di-izq{grid-column:1/6;display:flex;flex-direction:column;gap:22px;align-self:start}
  .s-tanque .ta-di-izq > .boton{align-self:flex-start}
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

  /* ---------- La ronda */
  .s-tanque.ta-ronda{background:#0f3d66;min-height:100svh;padding:112px var(--margen) 56px}
  .s-tanque .ta-ro-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:end;margin-bottom:28px}
  .s-tanque .ta-ro-cab h2{grid-column:1/8;font-size:var(--step-head)}
  .s-tanque .ta-ro-cab p{grid-column:8/13;line-height:1.42}
  .s-tanque .ta-ro-lista{list-style:none;margin:0 calc(-1 * var(--margen))}
  .s-tanque .ta-ro-lista > li{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:center;padding:16px var(--margen);min-height:84px}
  .s-tanque .ta-ro-lista > li:nth-child(odd){background:#15568f}
  .s-tanque .ta-ro-lista h3{grid-column:1/4;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-tanque .ta-ro-t{grid-column:4/6;display:flex;align-items:baseline;gap:8px;font-weight:600}
  .s-tanque .ta-ro-t b{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:.85}
  .s-tanque .ta-ro-r{grid-column:6/10;line-height:1.42}
  .s-tanque .ta-ro-a{grid-column:10/13;justify-self:end}

  /* ---------- Los tiburones */
  .s-tanque.ta-tiburones{background:#06182b}
  .s-tanque .ta-video{position:relative;height:40svh;min-height:240px;overflow:hidden;background:#0a2a47}
  .s-tanque .ta-video video{width:100%;height:100%;object-fit:cover;object-position:50% 45%}
  .s-tanque .ta-ti-cab{display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:16px;align-items:end;padding:40px var(--margen) 96px}
  .s-tanque .ta-ti-cab h2{grid-column:1/8;font-size:var(--step-head)}
  .s-tanque .ta-ti-cab > p{grid-column:8/13;line-height:1.42}
  .s-tanque .ta-sorteo{grid-column:1/-1;display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:12px}
  .s-tanque .ta-sorteo p{font-weight:600;min-height:1.5em}
  .s-tanque .ta-roles{list-style:none}
  .s-tanque .ta-rol{position:relative;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:start;padding:36px var(--margen) 88px;background:var(--b)}
  .s-tanque .ta-rol-nombre{grid-column:1/6}
  .s-tanque .ta-rol h3{font-size:var(--step-head)}
  .s-tanque .ta-turno{display:inline-block;margin-top:14px;background:#a7ff9c;color:#000;font-weight:600;font-size:var(--step-small);padding:6px 10px;line-height:1}
  .s-tanque .ta-turno:empty{display:none}
  .s-tanque .ta-rol ul{grid-column:6/13;list-style:none;display:flex;flex-direction:column;gap:14px}
  .s-tanque .ta-rol li{font-size:var(--step-lead);line-height:1.28;font-weight:600;max-width:40ch}
  .s-tanque .ta-fondo{position:relative;height:28svh;min-height:180px;background:#06182b;overflow:hidden}

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
  .s-tanque .ta-carta{position:relative;background:#fff;color:#000;border:2px solid #000;min-height:clamp(260px,42svh,380px);padding:34px 34px 64px;display:flex;flex-direction:column;justify-content:center;transform-origin:50% 50%}
  .s-tanque .ta-carta-txt{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15;max-width:24ch}
  .s-tanque .ta-carta-pie{position:absolute;left:34px;bottom:24px;font-size:var(--step-small);font-weight:600}
  .s-tanque .ta-salieron{grid-column:9/13;grid-row:2;align-self:start}
  .s-tanque .ta-salieron h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-tanque .ta-salieron ol{margin-top:12px;padding-left:1.4em}
  .s-tanque .ta-salieron li{break-inside:avoid;margin-bottom:8px;line-height:1.4}
  .s-tanque .ta-salieron .ta-vacio{list-style:none;margin-left:-1.4em}

  /* ---------- Marcador del veredicto */
  .s-tanque.ta-marcador{background:#0f3d66;min-height:100svh;padding:112px var(--margen) 56px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:28px;align-content:start}
  .s-tanque .ta-ma-cab{grid-column:1/8}
  .s-tanque .ta-ma-cab h2{font-size:var(--step-head)}
  .s-tanque .ta-ma-cab p{margin-top:16px;line-height:1.42;max-width:58ch}
  .s-tanque .ta-ma-izq{grid-column:1/8;display:flex;flex-direction:column;gap:22px}
  .s-tanque .ta-ma-proyecto label{display:block;font-weight:600;margin-bottom:8px}
  .s-tanque .ta-ma-proyecto input{width:100%;max-width:520px;height:52px;padding:0 16px;border:2px solid #fff;background:#0a2a47;color:#fff;font:inherit}
  .s-tanque .ta-ma-proyecto input::placeholder{color:#fff;opacity:.85}
  .s-tanque .ta-ma-proyecto input:focus-visible{outline:3px solid #a7ff9c;outline-offset:3px}
  .s-tanque .ta-ma-filas{display:flex;flex-direction:column;gap:14px}
  .s-tanque .ta-ma-fila{display:grid;grid-template-columns:290px 72px 1fr;align-items:center;column-gap:20px}
  .s-tanque .ta-ma-fila .boton{width:100%;justify-content:flex-start}
  .s-tanque .ta-ma-n{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:.85;text-align:right;font-variant-numeric:tabular-nums}
  .s-tanque .ta-ma-barra{height:30px}
  .s-tanque .ta-ma-barra span{display:block;height:100%;width:100%;background:var(--c);transform-origin:0 50%;transform:scaleX(0)}
  .s-tanque .ta-ma-lectura{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15;max-width:40ch}
  .s-tanque .ta-ma-acciones{display:flex;gap:12px;flex-wrap:wrap}
  .s-tanque .ta-ma-der{grid-column:8/13;display:flex;flex-direction:column;gap:28px}
  .s-tanque .ta-escalera{border:0;margin:0;padding:0;min-width:0}
  .s-tanque .ta-escalera legend{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05;padding:0}
  .s-tanque .ta-esc-ayuda{margin-top:8px;line-height:1.4}
  .s-tanque .ta-esc-pasos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:8px;margin-top:16px;height:204px}
  .s-tanque .ta-esc-paso{position:relative;display:flex;align-items:flex-end;height:calc(var(--h) * 33.33%);min-height:64px;border:2px solid #fff;padding:10px;cursor:pointer;transition:background-color .25s,color .25s}
  .s-tanque .ta-esc-paso input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
  .s-tanque .ta-esc-paso span{font-weight:600;line-height:1.2}
  .s-tanque .ta-esc-paso:has(input:focus-visible){outline:3px solid #a7ff9c;outline-offset:3px}
  .s-tanque .ta-esc-paso.lleno{background:#a7ff9c;color:#000;border-color:#a7ff9c}
  .s-tanque .ta-historial h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
  .s-tanque .ta-historial ol{margin-top:12px;padding-left:1.3em;display:flex;flex-direction:column;gap:10px}
  .s-tanque .ta-historial li{line-height:1.4}
  .s-tanque .ta-historial .ta-vacio{list-style:none;margin-left:-1.3em}
  .s-tanque .ta-historial .boton{margin-top:16px}

  @media (max-width:900px){
    .s-tanque .ta-gi-cab,.s-tanque .ta-gi-ctrl,.s-tanque .ta-mesa{grid-column:1/-1;grid-row:auto}
    .s-tanque .ta-mesa{grid-template-columns:1fr;row-gap:28px}
    .s-tanque .ta-mazo{width:min(220px,60%)}
    .s-tanque .ta-ap-cab h2,.s-tanque .ta-ap-lado,.s-tanque .ta-di-izq,.s-tanque .ta-di-cuadro,.s-tanque .ta-ro-cab h2,.s-tanque .ta-ro-cab p,.s-tanque .ta-ti-cab h2,.s-tanque .ta-ti-cab > p,.s-tanque .ta-rol-nombre,.s-tanque .ta-rol ul,.s-tanque .ta-gi-cab,.s-tanque .ta-gi-ctrl,.s-tanque .ta-mesa,.s-tanque .ta-ma-cab,.s-tanque .ta-ma-izq,.s-tanque .ta-ma-der{grid-column:1/-1;grid-row:auto}
    .s-tanque .ta-ro-lista > li > *{grid-column:1/-1;justify-self:start;margin-top:8px}
    .s-tanque.ta-dinamica{height:auto;min-height:100svh}
    .s-tanque .ta-salieron{grid-column:1/-1;grid-row:auto}
    .s-tanque .ta-ma-fila{grid-template-columns:1fr 56px}
    .s-tanque .ta-ma-barra{grid-column:1/-1}
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
      <button class="boton" type="button" data-crono="pitch">Iniciar pitch de 3 minutos</button>
    </div>
    <figure class="ta-di-cuadro">
      <div class="ta-di-marco">
        <div class="ta-di-lienzo"><img src="${CUADRO.src}" width="${CUADRO.w}" height="${CUADRO.h}" loading="lazy" decoding="async" alt="The Gulf Stream, de Winslow Homer, con tres puntos marcados: el hombre en el bote, los tiburones y un barco en el horizonte."></div>
        ${PASOS.map(p => `<span class="ta-marca" style="left:${(p.marca.x * 100).toFixed(1)}%;top:${(p.marca.y * 100).toFixed(1)}%" aria-hidden="true"><i></i><b>${p.corto}</b></span>`).join("")}
      </div>
      <figcaption class="ta-di-pie" aria-live="polite">${PIE_CUADRO}</figcaption>
    </figure>
  </section>

  <span class="ancla" data-parada="tanque-ronda"></span>
  <section class="s-tanque ta-ronda" data-campo="tanque-medio" aria-labelledby="tanque-ronda-titulo">
    <div class="ta-ro-cab">
      <h2 id="tanque-ronda-titulo">La ronda, paso a paso</h2>
      <p>Cada proyecto pasa por estos cinco momentos. Los botones de tiempo abren el reloj a pantalla completa.</p>
    </div>
    <ol class="ta-ro-lista">
      ${RONDA.map(r => `<li>
        <h3>${r.n}</h3>
        <p class="ta-ro-t">${r.t ? `<b>${r.t}</b> minutos` : ""}</p>
        <p class="ta-ro-r">${r.r}</p>
        <div class="ta-ro-a">${r.a}</div>
      </li>`).join("")}
    </ol>
  </section>

  <span class="ancla" data-parada="tanque-tiburones"></span>
  <section class="s-tanque ta-tiburones" data-campo="tanque-noche" aria-labelledby="tanque-tiburones-titulo">
    <div class="ta-video" aria-hidden="true">
      <video muted loop playsinline preload="metadata" poster="img/tanque/assets/tiburon-poster.jpg" width="1600" height="500">
        <source src="img/tanque/assets/tiburon.webm" type="video/webm">
        <source src="img/tanque/assets/tiburon.mp4" type="video/mp4">
      </video>
    </div>
    <div class="ta-ti-cab">
      <h2 id="tanque-tiburones-titulo">Cinco tiburones, cinco ángulos</h2>
      <p>Sus compañeros atacan desde un ángulo. Estas son las preguntas semilla de cada tiburón: máximo 2 por tiburón y sin consejos.</p>
      <div class="ta-sorteo">
        <button class="boton" type="button" id="tanque-sortear">Sortear el orden de ataque</button>
        <p id="tanque-orden" aria-live="polite"></p>
      </div>
    </div>
    <ul class="ta-roles">
      ${TIBURONES.map((t, i) => `<li class="ta-rol" data-campo="tanque-${BANDAS[i]}" style="--b:${AZ[BANDAS[i]]}">
        <div class="ta-aletas" aria-hidden="true">${i === 0 ? nado(70, 20, aleta(AZ[BANDAS[i]], 84)) : i % 2 ? nado(14 + i * 9, -26, aleta(AZ[BANDAS[i]], 76 + i * 8, true)) : nado(58 + i * 4, 24, aleta(AZ[BANDAS[i]], 70 + i * 6))}</div>
        <div class="ta-rol-nombre"><h3>${t.n}</h3><span class="ta-turno"></span></div>
        <ul>${t.q.map(q => `<li>${q}</li>`).join("")}</ul>
      </li>`).join("")}
    </ul>
    <div class="ta-fondo" aria-hidden="true">
      ${nado(8, 60, silueta(AZ.medio, 300), 22)}
      ${nado(55, -40, `<div class="ta-girar">${silueta(AZ.hondo, 170)}</div>`, 58)}
    </div>
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
        <p class="ta-carta-txt" id="tanque-carta-txt" aria-live="polite">El mazo tiene 10 cartas. Saquen la primera cuando terminen las preguntas.</p>
        <p class="ta-carta-pie" id="tanque-carta-pie">Carta de giro</p>
      </div>
    </div>
    <div class="ta-salieron">
      <h3>Ya salieron</h3>
      <ol id="tanque-salieron"></ol>
    </div>
  </section>

  <span class="ancla" data-parada="tanque-marcador"></span>
  <section class="s-tanque ta-marcador" data-campo="tanque-medio" aria-labelledby="tanque-marcador-titulo">
    <div class="ta-ma-cab">
      <h2 id="tanque-marcador-titulo">Veredicto de la ronda</h2>
      <p>Cada tiburón decide: dentro, dentro con condiciones o fuera, y dice qué tendría que cambiar. Cuenten aquí los votos; el marcador vive solo en este navegador.</p>
    </div>
    <div class="ta-ma-izq">
      <div class="ta-ma-proyecto">
        <label for="tanque-proyecto">Proyecto en el tanque</label>
        <input id="tanque-proyecto" type="text" autocomplete="off" placeholder="Nombre del proyecto o del grupo">
      </div>
      <div class="ta-ma-filas">
        ${VOTOS.map(v => `<div class="ta-ma-fila">
          <button class="boton" type="button" data-voto="${v.id}" aria-label="Sumar un voto: ${v.n.toLowerCase()}">${v.n}</button>
          <p class="ta-ma-n" id="tanque-n-${v.id}">0</p>
          <div class="ta-ma-barra" aria-hidden="true"><span style="--c:${v.color}"></span></div>
        </div>`).join("")}
      </div>
      <p class="ta-ma-lectura" id="tanque-lectura" aria-live="polite"></p>
      <div class="ta-ma-acciones">
        <button class="boton" type="button" id="tanque-deshacer">Deshacer el último voto</button>
        <button class="boton" type="button" id="tanque-cerrar">Cerrar la ronda</button>
      </div>
    </div>
    <div class="ta-ma-der">
      <fieldset class="ta-escalera" id="tanque-escalera">
        <legend>¿Hasta dónde escala?</legend>
        <p class="ta-esc-ayuda">La escalera de escala: piloto, 10 veces el uso, otra organización. Marquen hasta qué peldaño llega, según los tiburones.</p>
        <div class="ta-esc-pasos">
          ${ESCALERA.map((e, i) => `<label class="ta-esc-paso" style="--h:${i + 1}"><input type="radio" name="tanque-escala" value="${i}"><span>${e}</span></label>`).join("")}
        </div>
      </fieldset>
      <div class="ta-historial">
        <h3>Rondas cerradas</h3>
        <ol id="tanque-rondas"></ol>
        <button class="boton" type="button" id="tanque-borrar">Borrar el historial</button>
      </div>
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

    /* ---- Sorteo del orden de ataque */
    const roles = $$(".ta-rol");
    $("#tanque-sortear").addEventListener("click", () => {
      const orden = barajar(TIBURONES.length);
      $("#tanque-orden").textContent = "Orden de ataque: " + orden.map(i => TIBURONES[i].n).join(", ") + ".";
      roles.forEach((li, i) => { li.querySelector(".ta-turno").textContent = "Turno " + (orden.indexOf(i) + 1); });
      if (!reducir) gsap.from($$(".ta-turno"), { scale:.6, opacity:0, duration:.4, ease:"back.out(2)", stagger:.05 });
    });

    /* ---- Mazo de cartas de giro: sin repetir hasta agotarlo */
    const MAZO = "clase-tanque-mazo";
    let mazo = leer(MAZO, null);
    if (!mazo || !Array.isArray(mazo.resto)) mazo = { resto:barajar(GIROS.length), salidas:[] };
    const carta = $("#tanque-carta"), txt = $("#tanque-carta-txt"), pieCarta = $("#tanque-carta-pie");
    const btnSacar = $("#tanque-sacar"), capas = $$(".ta-mazo > span");
    function pintarMazo(){
      const q = mazo.resto.length, total = GIROS.length;
      $("#tanque-quedan").textContent = q ? `Quedan ${q} de ${total} cartas.` : "Se acabó el mazo. Barájenlo de nuevo para volver a empezar.";
      btnSacar.disabled = q === 0;
      capas.forEach((c, i) => { c.style.visibility = (capas.length - i) <= q ? "visible" : "hidden"; });
      const ol = $("#tanque-salieron");
      ol.innerHTML = mazo.salidas.length ? mazo.salidas.map(i => `<li>${GIROS[i]}</li>`).join("") : `<li class="ta-vacio">Todavía no ha salido ninguna carta.</li>`;
      escribir(MAZO, mazo);
    }
    function mostrar(texto, pie){
      if (reducir){ txt.textContent = texto; pieCarta.textContent = pie; return; }
      gsap.timeline()
        .to(carta, { rotationY:-90, x:-30, duration:.2, ease:"power2.in" })
        .add(() => { txt.textContent = texto; pieCarta.textContent = pie; })
        .to(carta, { rotationY:0, x:0, duration:.45, ease:"back.out(1.4)" });
    }
    btnSacar.addEventListener("click", () => {
      if (!mazo.resto.length) return;
      const i = mazo.resto.pop(); mazo.salidas.push(i);
      mostrar(GIROS[i], `Carta ${mazo.salidas.length} de ${GIROS.length}`);
      pintarMazo();
    });
    $("#tanque-barajar").addEventListener("click", () => {
      mazo = { resto:barajar(GIROS.length), salidas:[] };
      mostrar("Mazo barajado: 10 cartas. Saquen la primera cuando terminen las preguntas.", "Carta de giro");
      pintarMazo();
    });
    if (mazo.salidas.length){ const u = mazo.salidas[mazo.salidas.length - 1]; txt.textContent = GIROS[u]; pieCarta.textContent = `Carta ${mazo.salidas.length} de ${GIROS.length}`; }
    pintarMazo();

    /* ---- Marcador del veredicto */
    const MARC = "clase-tanque-marcador";
    let M = leer(MARC, null);
    if (!M || !Array.isArray(M.votos)) M = { ronda:1, proyecto:"", votos:[], escala:null, historial:[] };
    const inp = $("#tanque-proyecto"), lect = $("#tanque-lectura");
    const pasosEsc = $$(".ta-esc-paso"), radios = $$('input[name="tanque-escala"]');
    const conteo = () => { const n = { dentro:0, condicion:0, fuera:0 }; M.votos.forEach(v => { n[v]++; }); return n; };
    function lectura(n){
      const total = n.dentro + n.condicion + n.fuera;
      if (!total) return "";
      const max = Math.max(n.dentro, n.condicion, n.fuera);
      const lideres = VOTOS.filter(v => n[v.id] === max);
      return lideres.length > 1 ? `Empate entre ${lideres.map(v => v.etq).join(" y ")}.` : LECTURA[lideres[0].id];
    }
    function pintarMarcador(animar){
      const n = conteo(), total = M.votos.length, max = Math.max(1, n.dentro, n.condicion, n.fuera);
      VOTOS.forEach(v => {
        $("#tanque-n-" + v.id).textContent = n[v.id];
        const barra = raiz.querySelector(`[data-voto="${v.id}"]`).parentElement.querySelector(".ta-ma-barra span");
        const s = n[v.id] / max;
        if (animar && !reducir) gsap.to(barra, { scaleX:s, duration:.5, ease:"power3.out" }); else gsap.set(barra, { scaleX:s });
      });
      const esc = M.escala === null ? "" : ` Escala hasta: ${ESCALERA[M.escala].toLowerCase()}.`;
      lect.textContent = total
        ? `Ronda ${M.ronda}: ${total} ${total === 1 ? "voto" : "votos"} (${n.dentro} dentro, ${n.condicion} con condiciones, ${n.fuera} fuera). ${lectura(n)}${esc}`
        : `Ronda ${M.ronda}: todavía no hay votos.${esc}`;
      pasosEsc.forEach((p, i) => p.classList.toggle("lleno", M.escala !== null && i <= M.escala));
      radios.forEach((r, i) => { r.checked = M.escala === i; });
      const ol = $("#tanque-rondas");
      ol.innerHTML = M.historial.length ? M.historial.map(h => `<li>${h}</li>`).join("") : `<li class="ta-vacio">Todavía no hay rondas cerradas.</li>`;
      escribir(MARC, M);
    }
    inp.value = M.proyecto || "";
    inp.addEventListener("input", () => { M.proyecto = inp.value; escribir(MARC, M); });
    $$("[data-voto]").forEach(b => b.addEventListener("click", () => {
      M.votos.push(b.dataset.voto); pintarMarcador(true);
      if (!reducir) gsap.fromTo("#tanque-n-" + b.dataset.voto, { scale:1.35 }, { scale:1, duration:.45, ease:"back.out(2.4)" });
    }));
    $("#tanque-deshacer").addEventListener("click", () => { M.votos.pop(); pintarMarcador(true); });
    radios.forEach(r => r.addEventListener("change", () => { M.escala = +r.value; pintarMarcador(false); }));
    $("#tanque-cerrar").addEventListener("click", () => {
      const n = conteo(), total = M.votos.length;
      if (!total){ lect.textContent = `Ronda ${M.ronda}: no hay votos para cerrar todavía.`; return; }
      const nombre = (M.proyecto || "").trim();
      M.historial.push(`Ronda ${M.ronda}${nombre ? ", " + C.util.esc(nombre) : ""}: ${n.dentro} dentro, ${n.condicion} con condiciones, ${n.fuera} fuera. ${lectura(n)}${M.escala === null ? "" : " Escala hasta: " + ESCALERA[M.escala].toLowerCase() + "."}`);
      M = { ronda:M.ronda + 1, proyecto:"", votos:[], escala:null, historial:M.historial };
      inp.value = "";
      pintarMarcador(true);
    });
    $("#tanque-borrar").addEventListener("click", () => { M = { ronda:1, proyecto:"", votos:[], escala:null, historial:[] }; inp.value = ""; pintarMarcador(true); });
    pintarMarcador(false);

    /* ---- Video del tiburón: mudo, en bucle, solo mientras se ve; con movimiento reducido queda el póster */
    const video = $(".ta-video video");
    if (video && !reducir && "IntersectionObserver" in window){
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting){ const p = video.play(); if (p && p.catch) p.catch(() => {}); } else video.pause();
      }), { threshold:.15 }).observe(video);
    }

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

    /* La ronda: las filas entran como olas, una tras otra */
    const ro = $(".ta-ronda");
    gsap.from(ro.querySelectorAll(".ta-ro-lista > li"), { xPercent:-6, opacity:0, duration:.7, ease:"power3.out", stagger:.08,
      scrollTrigger:{ trigger:ro, start:"top 70%", toggleActions:"play none none reverse" } });

    /* Los tiburones: aletas por banda y siluetas en el fondo */
    roles.forEach(li => {
      li.querySelectorAll(".ta-nado").forEach(el => nadar(el, li));
      gsap.from(li.querySelectorAll("h3, li"), { x:-40, opacity:0, duration:.7, ease:"power3.out", stagger:.06,
        scrollTrigger:{ trigger:li, start:"top 82%", toggleActions:"play none none reverse" } });
    });
    const fondo = $(".ta-fondo");
    fondo.querySelectorAll(".ta-nado").forEach(el => nadar(el, fondo));

    /* Mazo y marcador: entrada de la mesa */
    const gi = $(".ta-giro");
    gsap.from(gi.querySelectorAll(".ta-mazo > span"), { y:-60, rotation:-8, opacity:0, duration:.6, ease:"power3.out", stagger:.06,
      scrollTrigger:{ trigger:gi, start:"top 70%", toggleActions:"play none none reverse" } });
    gsap.from(carta, { rotationY:-70, x:-60, opacity:0, duration:.8, ease:"power3.out",
      scrollTrigger:{ trigger:gi, start:"top 65%", toggleActions:"play none none reverse" } });
    const ma = $(".ta-marcador");
    gsap.from(ma.querySelectorAll(".ta-ma-fila, .ta-esc-paso"), { y:30, opacity:0, duration:.6, ease:"power3.out", stagger:.06,
      scrollTrigger:{ trigger:ma, start:"top 70%", toggleActions:"play none none reverse" } });
  }
});
})();
