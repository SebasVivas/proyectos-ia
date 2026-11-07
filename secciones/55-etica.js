/* secciones/55-etica.js: El faro. Aspectos legales y éticos de la IA (diapositiva 16).
   Pantallas: apertura con el faro de Santa Marta, la cita revelada por el haz, cinco estaciones
   (privacidad, sesgo con la demo de paridad, explicabilidad con barras tipo SHAP, responsabilidad,
   empleo) y el debate con conteo local de votos. */
(() => {
"use strict";
const { num, pct, clamp } = Clase.util;

/* Campos del acto. Contraste WCAG calculado:
   blanco sobre negro 21:1 · negro sobre blanco 21:1 · negro sobre rojo #ff3b30 5,92:1.
   Blanco sobre ese rojo da 3,55:1: nunca se usa para texto. */
Clase.campo("faro-negro",  { bg:"#000000", ink:"#ffffff", btn:["#ff3b30", "#000000"] });
Clase.campo("faro-blanco", { bg:"#ffffff", ink:"#000000", btn:["#ff3b30", "#000000"] });
Clase.campo("faro-rojo",   { bg:"#ff3b30", ink:"#000000", btn:["#000000", "#ffffff"] });

const IMG = "img/etica/assets/";

/* ---------- La cita: cada palabra en un span para que el haz la encienda al pasar ---------- */
const CITA = [
  ["s-etica-c1", "Un proyecto de IA que ignora la ética y la ley"],
  ["s-etica-c2", "no es un proyecto completo."],
  ["s-etica-c3", "Es una bomba de tiempo."],
  ["s-etica-c4", "La IA puede transformar el mundo, pero también puede amplificar injusticias si no se diseña con responsabilidad."]
];
const envolver = t => t.split(" ").map(p => `<span class="s-etica-w">${p}</span>`).join(" ");
const citaHTML = () => CITA.map(([c, t]) => c === "s-etica-c3"
  ? `<p class="s-etica-c ${c}"><span class="s-etica-banda">${envolver(t)}</span></p>`
  : `<p class="s-etica-c ${c}">${envolver(t)}</p>`).join("");

/* ---------- Demo 1: puntajes sintéticos (0 a 100) de 120 solicitudes inventadas, 60 por grupo.
   Generados una vez con semilla fija (Clase.util.rng(1581), normal 64±13 para A y 51±13 para B, acotados a 8–97). ---------- */
const GRUPOS = [
  { id:"a", n:"Grupo A", p:[44,46,46,48,51,51,51,53,54,55,55,56,57,57,58,58,58,60,61,61,62,62,63,63,63,64,64,65,66,66,67,68,68,68,69,69,69,71,72,72,73,73,74,74,75,77,78,78,78,79,79,80,80,80,81,83,84,87,90,93] },
  { id:"b", n:"Grupo B", p:[16,20,26,28,29,31,32,35,36,36,39,39,41,41,41,42,44,45,45,47,48,50,50,50,52,53,54,54,55,56,57,57,57,57,57,58,58,59,59,59,60,60,60,61,62,62,63,63,63,63,63,66,67,69,69,70,71,74,81,89] }
];
const UMBRAL0 = 60;
const PX = v => 10 + v * 8;
function svgParidad(){
  let s = `<svg class="s-etica-svg" viewBox="0 0 820 276" role="img" aria-labelledby="etica-svg-t"><title id="etica-svg-t">Puntaje de cada solicitud, de 0 a 100, por grupo, con la línea del umbral de aprobación</title>`;
  GRUPOS.forEach((g, gi) => {
    const base = gi === 0 ? 112 : 238, pila = {};
    s += `<text x="10" y="${base - 90}" class="s-etica-svg-g">${g.n}</text>`;
    g.p.forEach(v => { const k = pila[v] = (pila[v] || 0) + 1; s += `<rect data-v="${v}" x="${PX(v) - 3.5}" y="${base - k * 14 + 1}" width="7" height="12"/>`; });
  });
  for (let v = 0; v <= 100; v += 20) s += `<text x="${PX(v)}" y="270" text-anchor="${v === 0 ? "start" : v === 100 ? "end" : "middle"}" class="s-etica-svg-e">${v}</text>`;
  s += `<line class="s-etica-svg-l" x1="${PX(UMBRAL0)}" x2="${PX(UMBRAL0)}" y1="26" y2="244"/>`;
  s += `<text class="s-etica-svg-u" x="${PX(UMBRAL0) + 8}" y="16">Umbral ${UMBRAL0}</text></svg>`;
  return s;
}

/* ---------- Demo 2: una solicitud de crédito sintética y el aporte de cada variable (tipo SHAP) ---------- */
const SH = { base:.58, umbral:.5, min:.2, max:.7 };
const VARS = [
  { id:"pagos",   n:"Pagos atrasados",      v:"2 en los últimos 12 meses",     d:-.14, x:"Fue lo que más pesó: bajó la probabilidad de aprobación 14 puntos." },
  { id:"deuda",   n:"Deuda sobre ingresos", v:"48% del ingreso",               d:-.09, x:"Casi la mitad del ingreso ya se va en deudas: bajó la probabilidad 9 puntos." },
  { id:"barrio",  n:"Barrio de residencia", v:"Código 17 (sintético)",         d:-.06, x:"Alerta de sesgo: el barrio puede funcionar como sustituto del estrato o del origen étnico. El modelo puede discriminar a través de esta variable aunque no use esas otras. Revisen si debe estar en el modelo." },
  { id:"antig",   n:"Antigüedad laboral",   v:"8 meses",                       d:-.05, x:"Menos de un año en el empleo actual: bajó la probabilidad 5 puntos." },
  { id:"ingreso", n:"Ingresos mensuales",   v:Clase.util.cop(2400000),         d:.04,  x:"El ingreso subió la probabilidad 4 puntos." },
  { id:"monto",   n:"Monto solicitado",     v:Clase.util.cop(3000000),         d:.02,  x:"Un monto bajo frente al ingreso subió la probabilidad 2 puntos." }
];
const FINAL = VARS.reduce((s, f) => s + f.d, SH.base);
const escala = val => (val - SH.min) / (SH.max - SH.min);
const signo = d => (d < 0 ? "−" : "+") + num(Math.abs(d), 2);
const DETALLE = {
  base:"Punto de partida: la probabilidad promedio de aprobación en los datos del modelo, 0,58. Cada barra suma o resta desde ahí.",
  final:`Suma de todo: ${num(SH.base, 2)} ${VARS.map(f => signo(f.d)).join(" ")} = ${num(FINAL, 2)}. Queda por debajo del umbral de ${num(SH.umbral, 2)}: la solicitud se rechaza.`
};
VARS.forEach(f => { DETALLE[f.id] = f.x; });
function fila(id, nombre, sub, l, w, clase, dato){
  return `<button type="button" class="s-etica-fila" data-id="${id}" aria-pressed="false">
    <span class="s-etica-fn">${nombre}<small>${sub}</small></span>
    <span class="s-etica-pista2"><i class="${clase}" style="--l:${l.toFixed(4)};--w:${w.toFixed(4)}"></i></span>
    <span class="s-etica-fd">${dato}</span></button>`;
}
function filasSHAP(){
  let acc = SH.base, h = fila("base", "Promedio del modelo", "Punto de partida", escala(SH.base) - .008, .016, "marca", num(SH.base, 2));
  VARS.forEach(f => {
    const a = acc, b = acc + f.d; acc = b;
    h += fila(f.id, f.n, f.v, escala(Math.min(a, b)), Math.abs(f.d) / (SH.max - SH.min), f.d < 0 ? "neg" : "pos", signo(f.d));
  });
  return h + fila("final", "Esta solicitud", "Rechazada", escala(acc) - .008, .016, "marca", num(acc, 2));
}
const TICKS = [.2, .3, .4, .5, .6, .7].map(t => `<b style="--x:${escala(t).toFixed(3)}">${num(t, 1)}</b>`).join("");

/* ---------- Debate ---------- */
const OPS = [ { id:"si", t:"Sí, la tiene" }, { id:"no", t:"No la tiene" }, { id:"nose", t:"No sé" } ];

const haz = (id, titulo) => `<div class="s-etica-haz"><h2 class="s-etica-haz-t" id="${id}">${titulo}</h2></div>`;

Clase.seccion({
  id: "etica",
  orden: 55,
  indice: { texto:"Ética y ley", ir:"etica", nota:"Privacidad, sesgo, explicabilidad, responsabilidad, empleo y el debate" },
  creditos: [
    "«Faro de la bahía de Santa Marta 2014-09-05 (2)», Jorge Mahecha, <a href=\"https://creativecommons.org/licenses/by-sa/3.0/deed.es\">CC BY-SA 3.0</a>, vía <a href=\"https://commons.wikimedia.org/wiki/File:Faro_de_la_bah%C3%ADa_de_Santa_Marta_2014-09-05_(2).jpg\">Wikimedia Commons</a>. En el acto El faro, convertida a blanco y negro y recortada, bajo la misma licencia.",
    "«Bahia de Santa Marta (el morro)», Patriarboleda, <a href=\"https://creativecommons.org/licenses/by-sa/4.0/deed.es\">CC BY-SA 4.0</a>, vía <a href=\"https://commons.wikimedia.org/w/index.php?curid=46316850\">Wikimedia Commons</a>. En el acto El faro, convertida a blanco y negro y recortada, bajo la misma licencia.",
    "«Lighthouse lantern (Wonder Book of Engineering Wonders, 1931)», escaneo de Andy Dingley, dominio público, vía <a href=\"https://commons.wikimedia.org/wiki/File:Lighthouse_lantern_(Wonder_Book_of_Engineering_Wonders,_1931).jpg\">Wikimedia Commons</a>."
  ],
  css: `
    .s-etica{position:relative;overflow:hidden}
    .s-etica h2,.s-etica h3,.s-etica h4{font-family:var(--f-display);font-weight:700;letter-spacing:-.04em;line-height:.88}
    .s-etica button:focus-visible,.s-etica input:focus-visible{outline:3px solid currentColor;outline-offset:3px}

    /* Apertura: el faro de Santa Marta en blanco y negro, con el cielo como campo negro */
    .s-etica-apertura{min-height:100svh;background:#000;color:#fff}
    .s-etica-foto{position:absolute;inset:0;margin:0;background:#000;will-change:transform}
    .s-etica-foto img{width:100%;height:100%;object-fit:cover;object-position:0% 0%;transform-origin:16% 22%}
    .s-etica-ap-texto{position:relative;z-index:1;padding:clamp(128px,17svh,170px) var(--margen) 0 33vw}
    .s-etica-titular{font-size:var(--step-display);color:#fff}
    .s-etica-ap-apoyo{margin-top:28px;max-width:40ch;font-size:var(--step-lead);line-height:1.3;color:#fff}
    .s-etica-pie{position:absolute;right:var(--margen);bottom:28px;z-index:1;max-width:46ch;background:#000;color:#fff;padding:10px 14px;font-size:var(--step-small);line-height:1.45}

    /* La cita: el haz rojo sale de la linterna y enciende las palabras */
    /* La zona lleva el campo: con el pin, su alto incluye todo el recorrido y la cabecera no pierde la tinta */
    .s-etica-zona{position:relative;background:#000}
    .s-etica-cita{height:100svh;min-height:640px;background:#000;color:#fff}
    .s-etica-torre{position:absolute;left:calc(var(--margen) + 1vw);bottom:0;height:min(58svh,540px);width:auto;max-width:none}
    .s-etica-cita-texto{position:absolute;z-index:1;top:0;bottom:0;left:26vw;right:var(--margen);display:flex;flex-direction:column;justify-content:center;gap:12px;padding:112px 0 64px}
    .s-etica-c{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:.95;letter-spacing:-.035em;text-wrap:balance}
    .s-etica-c4{font-family:var(--f-texto);font-weight:400;font-size:var(--step-lead);line-height:1.35;letter-spacing:0;max-width:48ch;margin-top:20px}
    .s-etica-banda{position:relative;z-index:0;display:inline-block;padding:.1em .22em 0;margin-left:-.22em}
    .s-etica-banda::before{content:"";position:absolute;inset:0;z-index:-1;background:#ff3b30;transform-origin:0 50%;transform:scaleX(0);transition:transform .6s cubic-bezier(.22,1,.36,1)}
    .s-etica-c3.encendida .s-etica-banda::before{transform:scaleX(1)}
    .s-etica-c3.encendida .s-etica-w{color:#000}
    .s-etica-cita.animada blockquote .s-etica-w{opacity:0}
    .s-etica-cita.animada blockquote .s-etica-w.on{opacity:1}
    .s-etica-luz{display:none;position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .s-etica-cita.animada .s-etica-luz{display:block}

    /* Estaciones: cada principio entra en un haz plano de borde duro */
    .s-etica-est{background:var(--fondo);color:var(--tinta);padding:112px 0 clamp(80px,12svh,140px)}
    .s-etica-haz{position:relative;height:clamp(176px,24svh,240px);display:flex;align-items:center;padding:0 var(--margen);background:var(--haz);clip-path:polygon(0% 20%,100% 0%,100% 100%,0% 80%)}
    .s-etica-haz-t{position:relative;font-size:var(--step-head);color:#000;padding-top:.08em}
    .s-etica-cuerpo{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);row-gap:28px;padding:clamp(36px,5svh,56px) var(--margen) 0}
    .s-etica-afirma{font-weight:600;font-size:var(--step-lead);line-height:1.3;max-width:36ch}
    .s-etica-texto{font-size:var(--step-body);line-height:1.55;max-width:58ch}

    .s-etica-privacidad .s-etica-afirma{grid-column:1 / 7}
    .s-etica-lista{grid-column:1 / -1;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));column-gap:var(--gap);margin-top:8px}
    .s-etica-lista dt{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
    .s-etica-lista dd{margin-top:10px;font-size:var(--step-body);line-height:1.5}

    .s-etica-sesgo .s-etica-afirma,.s-etica-xai .s-etica-afirma{grid-column:1 / 7}
    .s-etica-sesgo .s-etica-texto,.s-etica-xai .s-etica-texto{grid-column:8 / 13;align-self:end}

    /* Demos */
    .s-etica-demo{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);row-gap:24px;padding:112px var(--margen) 0;align-items:start}
    .s-etica-demo-izq{grid-column:1 / 6;display:flex;flex-direction:column;gap:14px}
    .s-etica-demo-izq h3{font-size:var(--step-head)}
    .s-etica-demo-der{grid-column:6 / 13;margin:0;border:2px solid currentColor;padding:20px 24px;display:flex;flex-direction:column;gap:16px}
    .s-etica-demo figcaption{font-size:var(--step-small);line-height:1.45;max-width:72ch}
    .s-etica-umbral{display:flex;justify-content:space-between;align-items:baseline;gap:16px;font-weight:600}
    .s-etica-umbral b{font-family:var(--f-display);font-size:var(--step-head);letter-spacing:-.03em;line-height:.9;font-variant-numeric:tabular-nums}
    .s-etica-rango{-webkit-appearance:none;appearance:none;width:100%;height:44px;background:transparent;cursor:pointer;color:inherit}
    .s-etica-rango::-webkit-slider-runnable-track{height:8px;background:currentColor}
    .s-etica-rango::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:28px;height:44px;margin-top:-18px;background:#ff3b30;border:2px solid currentColor;border-radius:0}
    .s-etica-rango::-moz-range-track{height:8px;background:currentColor}
    .s-etica-rango::-moz-range-thumb{width:24px;height:40px;border-radius:0;background:#ff3b30;border:2px solid currentColor}
    .s-etica-res{display:grid;gap:10px}
    .s-etica-res div{display:grid;grid-template-columns:8.5em minmax(0,1fr);gap:12px;align-items:baseline}
    .s-etica-res dt{font-weight:600}
    .s-etica-lectura{margin-top:10px}
    .s-etica-res dd b{font-weight:600;font-size:var(--step-lead);font-variant-numeric:tabular-nums}
    .s-etica-svg{width:100%;height:auto;overflow:visible;color:inherit}
    .s-etica-svg rect{fill:currentColor;stroke:currentColor;stroke-width:0}
    .s-etica-svg rect.no{fill:none;stroke-width:1.6}
    .s-etica-svg text{fill:currentColor;font-family:var(--f-texto);font-size:18px}
    .s-etica-svg .s-etica-svg-g{font-weight:600}
    .s-etica-svg .s-etica-svg-l{stroke:#ff3b30;stroke-width:4}
    .s-etica-svg .s-etica-svg-u{fill:#ff3b30;font-weight:600}
    .s-etica-leyenda{font-size:var(--step-small);line-height:1.45}
    .s-etica-tasas{display:grid;gap:10px}
    .s-etica-tasa{display:grid;grid-template-columns:5.5em minmax(0,1fr) 4.2em;gap:12px;align-items:center;font-weight:600}
    .s-etica-tasa b{text-align:right;font-variant-numeric:tabular-nums}
    .s-etica-pista{position:relative;height:26px}
    .s-etica-pista i{position:absolute;inset:0;background:currentColor;transform-origin:0 50%;transform:scaleX(var(--v,0));transition:transform .45s cubic-bezier(.22,1,.36,1)}
    .s-etica-pista i.s-etica-hueco{background:#ff3b30;transform:translateX(calc(var(--l,0) * 100%)) scaleX(var(--w,0))}
    .s-etica-brecha-t{display:inline-block;background:#ff3b30;color:#000;padding:2px 8px;font-weight:600}

    .s-etica-cascada{display:grid}
    .s-etica-fila{display:grid;grid-template-columns:minmax(0,38%) minmax(0,1fr) 3.6em;gap:14px;align-items:center;min-height:46px;width:100%;padding:4px 10px;background:transparent;border:0;text-align:left;cursor:pointer;color:inherit;font:inherit;transition:translate .18s cubic-bezier(.22,1,.36,1)}
    .s-etica-fila:hover{translate:6px 0}
    .s-etica-fila[aria-pressed="true"]{background:#000;color:#fff}
    .s-etica-fn{font-weight:600;line-height:1.2}
    .s-etica-fn small{display:block;font-weight:400;font-size:var(--step-small);line-height:1.35}
    .s-etica-pista2{position:relative;height:26px}
    .s-etica-pista2::after{content:"";position:absolute;top:-14px;bottom:-14px;left:60%;width:3px;margin-left:-1px;background:currentColor}
    .s-etica-pista2 i{position:absolute;inset:0;transform-origin:0 50%;transform:translateX(calc(var(--l) * 100%)) scaleX(var(--w));background:currentColor}
    .s-etica-pista2 i.neg{background:#ff3b30}
    .s-etica-fd{font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
    .s-etica-eje{display:grid;grid-template-columns:minmax(0,38%) minmax(0,1fr) 3.6em;gap:14px;padding:6px 10px 0;font-size:var(--step-small)}
    .s-etica-ticks{position:relative;height:1.5em}
    .s-etica-ticks b{position:absolute;left:calc(var(--x) * 100%);transform:translateX(-50%);font-weight:400}
    .s-etica-cab{display:grid;grid-template-columns:minmax(0,38%) minmax(0,1fr) 3.6em;gap:14px;padding:0 10px 6px;font-size:var(--step-small);font-weight:600;line-height:1.35}
    .s-etica-cab span:last-child{text-align:right}
    .s-etica-carta{background:#000;color:#fff;padding:16px 18px;font-size:var(--step-body);line-height:1.5}
    .s-etica-carta strong{display:block;font-weight:600;margin-bottom:4px}
    .s-etica-detalle{font-size:var(--step-body);line-height:1.5;min-height:6.2em}
    .s-etica-detalle b{font-weight:600}
    .s-etica-alerta{display:inline-block;background:#ff3b30;color:#000;padding:2px 8px;margin-right:6px;font-weight:600}

    .s-etica-resp .s-etica-pregunta{grid-column:1 / 10;font-size:var(--step-head)}
    .s-etica-resp .s-etica-cuerpo{row-gap:20px}
    .s-etica-resp .s-etica-texto{grid-column:1 / 8;margin-top:-6px}
    .s-etica-partes{grid-column:1 / -1;list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:var(--gap);margin-top:6px}
    .s-etica-partes h4{font-size:var(--step-head);margin-bottom:14px}
    .s-etica-partes p{font-size:var(--step-body);line-height:1.5;max-width:34ch}

    .s-etica-empleo{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);min-height:100svh;background:#000;color:#fff}
    .s-etica-lente{position:relative;margin:0;background:#000;min-height:100%}
    .s-etica-lente img{position:absolute;left:0;right:0;bottom:0;top:80px;width:100%;height:calc(100% - 80px);object-fit:cover;object-position:50% 30%}
    .s-etica-lente figcaption{position:absolute;left:16px;right:16px;bottom:16px;background:#000;color:#fff;padding:10px 14px;font-size:var(--step-small);line-height:1.45}
    .s-etica-empleo-der{padding:112px 0 clamp(40px,6svh,80px)}
    .s-etica-empleo .s-etica-haz{height:clamp(190px,27svh,260px);padding-left:40px}
    .s-etica-empleo .s-etica-cuerpo{padding-left:40px}
    .s-etica-empleo .s-etica-afirma,.s-etica-empleo .s-etica-texto{grid-column:1 / -1}
    .s-etica-contraste{grid-column:1 / -1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:var(--gap)}
    .s-etica-contraste dt{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.05}
    .s-etica-contraste div:first-child dt{display:inline-block;background:#ff3b30;color:#000;padding:4px 8px 0}
    .s-etica-contraste dd{margin-top:10px;line-height:1.5}

    /* Debate */
    .s-etica-debate{background:#ff3b30;color:#000;padding:112px var(--margen) 0}
    .s-etica-debate-t{font-size:var(--step-head);max-width:17em}
    .s-etica-debate .s-etica-texto{margin-top:20px}
    .s-etica-votos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:var(--gap);margin-top:36px}
    .s-etica-voto{display:flex;flex-direction:column;gap:12px}
    .s-etica-cuenta{font-family:var(--f-display);font-weight:700;font-size:var(--step-display);line-height:.85;letter-spacing:-.04em;font-variant-numeric:tabular-nums;transform-origin:0 100%}
    .s-etica-voto .s-etica-pista{height:20px;background:#c92c23}
    .s-etica-voto .s-etica-pista i{background:#000}
    .s-etica-pct{font-weight:600;font-variant-numeric:tabular-nums}
    .s-etica-voto .boton{background:#000;color:#fff;border-color:#000;width:100%}
    .s-etica-pie-votos{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;margin-top:28px}
    .s-etica-total{font-weight:600}
    .s-etica-acciones{display:flex;flex-wrap:wrap;gap:12px}
    .s-etica-acciones .boton{background:#fff;color:#000;border-color:#000}
    .s-etica-deberia{padding-top:clamp(180px,30svh,300px)}
    .s-etica-deberia h2{font-size:var(--step-display)}
    .s-etica-silueta{position:relative;margin:48px calc(-1 * var(--margen)) 0;aspect-ratio:2200 / 775;overflow:hidden;background:#ff3b30}
    .s-etica-silueta img{position:absolute;left:0;top:-8%;width:100%;height:116%;object-fit:cover;mix-blend-mode:multiply}
    .s-etica-debate .s-etica-pie2{padding:14px 0 40px;font-size:var(--step-small);line-height:1.45}

    @media (max-width:760px){
      .s-etica-ap-texto{padding:110px 20px 0}
      .s-etica-cita-texto{left:20px;right:20px}
      .s-etica-torre{height:30svh}
      .s-etica-cuerpo > *,.s-etica-demo-izq,.s-etica-demo-der,.s-etica-sesgo .s-etica-texto,.s-etica-xai .s-etica-texto{grid-column:1 / -1}
      .s-etica-lista,.s-etica-partes,.s-etica-votos,.s-etica-contraste{grid-template-columns:1fr;row-gap:24px}
      .s-etica-empleo{grid-template-columns:1fr}
      .s-etica-lente{min-height:60svh}
      .s-etica-empleo .s-etica-haz,.s-etica-empleo .s-etica-cuerpo{padding-left:20px}
    }
  `,
  html: `
    <span class="ancla" data-parada="etica"></span>
    <section class="s-etica s-etica-apertura" data-campo="faro-negro" aria-labelledby="etica-titulo">
      <figure class="s-etica-foto"><img src="${IMG}faro-morro-bn.jpg" width="2200" height="1432" decoding="async" alt="El faro de la bahía de Santa Marta en lo alto de El Morro, en blanco y negro: la torre blanca sobre la roca, bajo un cielo negro."></figure>
      <div class="s-etica-ap-texto">
        <h2 class="s-etica-titular" id="etica-titulo"><span class="mask"><span class="in">La ley y la ética</span></span><span class="mask"><span class="in">no son opcionales</span></span></h2>
        <p class="s-etica-ap-apoyo">Aspectos legales y éticos de la IA. Un faro no lleva el timón: les muestra dónde están las rocas.</p>
      </div>
      <p class="s-etica-pie">Faro de la bahía de Santa Marta, sobre El Morro. Foto de Jorge Mahecha (2014), CC BY-SA 3.0, en blanco y negro.</p>
    </section>

    <span class="ancla" data-parada="etica-cita"></span>
    <div class="s-etica-zona" data-campo="faro-negro">
    <section class="s-etica s-etica-cita" aria-label="Por qué la ética y la ley no son opcionales">
      <img class="s-etica-torre" src="${IMG}faro-linterna-bn.jpg" width="320" height="690" decoding="async" alt="">
      <canvas class="s-etica-luz" aria-hidden="true"></canvas>
      <blockquote class="s-etica-cita-texto">${citaHTML()}</blockquote>
    </section>
    </div>

    <span class="ancla" data-parada="etica-privacidad"></span>
    <section class="s-etica s-etica-est s-etica-privacidad" data-campo="faro-blanco" style="--fondo:#fff;--tinta:#000;--haz:#ff3b30" aria-labelledby="etica-priv-t">
      ${haz("etica-priv-t", "Privacidad y protección de datos")}
      <div class="s-etica-cuerpo">
        <p class="s-etica-afirma">Si su proyecto usa datos de personas, esto se resuelve antes de entrenar el modelo, no después.</p>
        <dl class="s-etica-lista">
          <div><dt>Ley 1581 de 2012</dt><dd>Protección de datos personales en Colombia. El tratamiento requiere autorización previa, expresa e informada del titular.</dd></div>
          <div><dt>GDPR</dt><dd>Reglamento europeo de protección de datos. Aplica si el proyecto opera en Europa o trata datos de personas que están allá.</dd></div>
          <div><dt>Consentimiento informado</dt><dd>La persona sabe qué datos se recogen y para qué se usan, y lo autoriza.</dd></div>
          <div><dt>Minimización de datos</dt><dd>Se recogen y se guardan solo los datos que el propósito del proyecto necesita.</dd></div>
          <div><dt>Derecho al olvido</dt><dd>La persona puede pedir que sus datos se supriman.</dd></div>
        </dl>
      </div>
    </section>

    <span class="ancla" data-parada="etica-sesgo"></span>
    <section class="s-etica s-etica-est s-etica-sesgo" data-campo="faro-negro" style="--fondo:#000;--tinta:#fff;--haz:#ff3b30" aria-labelledby="etica-sesgo-t">
      ${haz("etica-sesgo-t", "Sesgo algorítmico y equidad")}
      <div class="s-etica-cuerpo">
        <p class="s-etica-afirma">Los modelos aprenden de datos históricos, y esos datos traen la discriminación incorporada.</p>
        <p class="s-etica-texto">Antes de desplegar, auditen los resultados por género, etnia y región. La primera pregunta de esa auditoría está en la demostración de abajo.</p>
      </div>
      <span class="ancla" data-parada="etica-paridad"></span>
      <div class="s-etica-demo s-etica-paridad">
        <div class="s-etica-demo-izq">
          <h3>¿El modelo trata igual a todos?</h3>
          <p class="s-etica-texto">Paridad demográfica: el modelo aprueba a cada grupo en la misma proporción. La brecha es la diferencia entre las dos tasas de aprobación.</p>
          <div>
            <label class="s-etica-umbral" for="etica-umbral"><span>Umbral de aprobación del puntaje</span><b id="etica-umbral-v">${UMBRAL0}</b></label>
            <input class="s-etica-rango" type="range" id="etica-umbral" min="20" max="90" step="1" value="${UMBRAL0}" aria-describedby="etica-paridad-res">
          </div>
          <div aria-live="polite"><dl class="s-etica-res" id="etica-paridad-res"></dl><p class="s-etica-texto s-etica-lectura" id="etica-paridad-lectura"></p></div>
        </div>
        <figure class="s-etica-demo-der">
          ${svgParidad()}
          <p class="s-etica-leyenda">Cada barra es una solicitud. Barra llena: aprobada. Barra vacía: rechazada.</p>
          <div class="s-etica-tasas" aria-hidden="true">
            <div class="s-etica-tasa"><span>Grupo A</span><span class="s-etica-pista"><i class="s-etica-ba"></i></span><b class="s-etica-ta"></b></div>
            <div class="s-etica-tasa"><span>Grupo B</span><span class="s-etica-pista"><i class="s-etica-bb"></i><i class="s-etica-hueco"></i></span><b class="s-etica-tb"></b></div>
          </div>
          <figcaption>Datos sintéticos: 120 solicitudes de crédito inventadas, 60 por grupo (pueden ser géneros, etnias o regiones). Los puntajes del grupo B salen de un historial con discriminación.</figcaption>
        </figure>
      </div>
    </section>

    <span class="ancla" data-parada="etica-xai"></span>
    <section class="s-etica s-etica-est s-etica-xai" data-campo="faro-blanco" style="--fondo:#fff;--tinta:#000;--haz:#ff3b30" aria-labelledby="etica-xai-t">
      ${haz("etica-xai-t", "Transparencia y explicabilidad (XAI)")}
      <div class="s-etica-cuerpo">
        <p class="s-etica-afirma">¿Puede el afectado entender por qué el sistema tomó esa decisión?</p>
        <p class="s-etica-texto">Las técnicas de XAI, como LIME y SHAP, muestran cuánto pesó cada variable en una decisión. Son críticas en crédito, salud y justicia.</p>
      </div>
      <span class="ancla" data-parada="etica-shap"></span>
      <div class="s-etica-demo s-etica-shap">
        <div class="s-etica-demo-izq">
          <h3>¿Por qué lo rechazó?</h3>
          <p class="s-etica-texto">Barras tipo SHAP de una solicitud de crédito: cada variable sube o baja la probabilidad de aprobación desde el promedio del modelo. Toquen una barra para leerla.</p>
          <p class="s-etica-carta"><strong>Lo que debería leer el solicitante</strong>Su solicitud no fue aprobada sobre todo por dos pagos atrasados en los últimos 12 meses y porque sus deudas equivalen al 48% de sus ingresos.</p>
          <p class="s-etica-detalle" id="etica-shap-detalle" aria-live="polite"></p>
        </div>
        <figure class="s-etica-demo-der">
          <div class="s-etica-cab" aria-hidden="true"><span>Variable</span><span>Probabilidad de aprobación; la línea es el umbral, ${num(SH.umbral, 2)}</span><span>Aporte</span></div>
          <div class="s-etica-cascada" role="group" aria-label="Aporte de cada variable a la decisión">${filasSHAP()}</div>
          <div class="s-etica-eje" aria-hidden="true"><span></span><span class="s-etica-ticks">${TICKS}</span><span></span></div>
          <figcaption>Solicitud y valores sintéticos, para ilustrar. Barra roja: baja la probabilidad. Barra negra: la sube. La línea vertical es el umbral de aprobación.</figcaption>
        </figure>
      </div>
    </section>

    <span class="ancla" data-parada="etica-responsabilidad"></span>
    <section class="s-etica s-etica-est s-etica-resp" data-campo="faro-rojo" style="--fondo:#ff3b30;--tinta:#000;--haz:#fff" aria-labelledby="etica-resp-t">
      ${haz("etica-resp-t", "Responsabilidad (Accountability)")}
      <div class="s-etica-cuerpo">
        <h3 class="s-etica-pregunta">¿Quién responde cuando el modelo se equivoca?</h3>
        <p class="s-etica-texto">Definan, antes de desplegar, qué le toca a cada parte: proveedor, operador y organización.</p>
        <ul class="s-etica-partes">
          <li><h4>Proveedor</h4><p>Desarrolla o vende el modelo. Responde por los datos de entrenamiento, el desempeño y la documentación.</p></li>
          <li><h4>Operador</h4><p>Lo pone a funcionar y lo vigila en el día a día. Responde por el uso correcto, el monitoreo y la reacción ante fallas.</p></li>
          <li><h4>Organización</h4><p>Decide usarlo con sus clientes o empleados. Da la cara ante el afectado y ante la ley.</p></li>
        </ul>
      </div>
    </section>

    <span class="ancla" data-parada="etica-empleo"></span>
    <section class="s-etica s-etica-empleo" data-campo="faro-negro" style="--haz:#ff3b30" aria-labelledby="etica-empleo-t">
      <figure class="s-etica-lente">
        <img src="${IMG}faro-lente-1931.jpg" width="1032" height="1372" loading="lazy" decoding="async" alt="Fotografía antigua en blanco y negro: en un taller, un operario estira el brazo para ajustar la enorme lente de vidrio de un faro, varias veces más alta que él.">
        <figcaption>La lente multiplica la luz; una persona la ajusta. «Wonder Book of Engineering Wonders», 1931.</figcaption>
      </figure>
      <div class="s-etica-empleo-der">
        ${haz("etica-empleo-t", "Impacto en el empleo y la sociedad")}
        <div class="s-etica-cuerpo">
          <p class="s-etica-afirma">Identifiquen los impactos negativos potenciales sobre el trabajo y la equidad.</p>
          <p class="s-etica-texto">Diseñen con IA augmentativa: asiste al humano y potencia sus capacidades. No lo reemplaza sin consideración ética.</p>
          <dl class="s-etica-contraste">
            <div><dt>IA augmentativa</dt><dd>La persona decide; el modelo le da alcance y velocidad.</dd></div>
            <div><dt>Reemplazo sin consideración ética</dt><dd>El modelo decide; la persona sale del proceso sin que nadie evalúe el impacto.</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <span class="ancla" data-parada="etica-debate"></span>
    <section class="s-etica s-etica-debate" data-campo="faro-rojo" aria-labelledby="etica-debate-t">
      <h2 class="s-etica-debate-t" id="etica-debate-t">¿Su organización tiene una política de uso ético de IA?</h2>
      <p class="s-etica-texto">Levanten la mano. Marquen un voto por cada mano: el conteo se guarda solo en este computador.</p>
      <div class="s-etica-votos">
        ${OPS.map(o => `<div class="s-etica-voto" data-op="${o.id}"><b class="s-etica-cuenta" aria-hidden="true">0</b><span class="s-etica-pista" aria-hidden="true"><i></i></span><span class="s-etica-pct" aria-hidden="true">0%</span><button class="boton" type="button" data-votar="${o.id}">${o.t}</button></div>`).join("")}
      </div>
      <div class="s-etica-pie-votos">
        <p class="s-etica-total" id="etica-votos-res" aria-live="polite">Aún no hay votos.</p>
        <div class="s-etica-acciones"><button class="boton" type="button" id="etica-deshacer">Deshacer último voto</button><button class="boton" type="button" id="etica-reiniciar">Reiniciar conteo</button></div>
      </div>
      <span class="ancla" data-parada="etica-deberia"></span>
      <div class="s-etica-deberia">
        <h2 id="etica-deberia-t"><span class="mask"><span class="in">¿Debería tenerla?</span></span></h2>
        <figure class="s-etica-silueta"><img src="${IMG}morro-silueta-bn.jpg" width="2200" height="775" loading="lazy" decoding="async" alt="El Morro de Santa Marta a contraluz desde el mar: la roca y la torre del faro recortadas contra el cielo, con reflejos en el agua."></figure>
        <p class="s-etica-pie2">El Morro desde el mar, bahía de Santa Marta. Foto de Patriarboleda, CC BY-SA 4.0, en blanco y negro.</p>
      </div>
    </section>
  `,
  iniciar(ctx){
    const { gsap, ScrollTrigger, reducir, raiz } = ctx;
    const q = s => raiz.querySelector(s), qa = s => [...raiz.querySelectorAll(s)];

    /* ---------- Demo 1: paridad demográfica ---------- */
    const rango = q("#etica-umbral"), rects = qa(".s-etica-svg rect");
    const linea = q(".s-etica-svg-l"), etq = q(".s-etica-svg-u");
    const res = q("#etica-paridad-res"), uv = q("#etica-umbral-v"), lecturaEl = q("#etica-paridad-lectura");
    const ba = q(".s-etica-ba"), bb = q(".s-etica-bb"), hueco = q(".s-etica-hueco");
    function pintarParidad(){
      const t = +rango.value;
      const r = GRUPOS.map(g => { const k = g.p.filter(v => v >= t).length; return { n:g.n, k, total:g.p.length, tasa:k / g.p.length * 100 }; });
      const [a, b] = r, brecha = a.tasa - b.tasa, razon = a.tasa > 0 ? b.tasa / a.tasa : NaN;
      rects.forEach(el => { const si = +el.dataset.v >= t; el.classList.toggle("no", !si); });
      linea.setAttribute("x1", PX(t)); linea.setAttribute("x2", PX(t));
      etq.setAttribute("x", t > 78 ? PX(t) - 8 : PX(t) + 8); etq.setAttribute("text-anchor", t > 78 ? "end" : "start");
      etq.textContent = "Umbral " + t; uv.textContent = t;
      ba.style.setProperty("--v", a.tasa / 100); bb.style.setProperty("--v", b.tasa / 100);
      hueco.style.setProperty("--l", Math.min(a.tasa, b.tasa) / 100); hueco.style.setProperty("--w", Math.abs(brecha) / 100);
      q(".s-etica-ta").textContent = pct(a.tasa); q(".s-etica-tb").textContent = pct(b.tasa);
      const lectura = isFinite(razon)
        ? `B recibe ${num(razon, 2)} veces la tasa de A. ${razon < .8 ? "Bajo 0,80 se revisa" : "Pasa el mínimo de 0,80"} (regla de los cuatro quintos, EE. UU.).`
        : "El grupo A no tiene aprobaciones con este umbral.";
      res.innerHTML = r.map(x => `<div><dt>${x.n}</dt><dd><b>${pct(x.tasa)}</b> aprobado, ${x.k} de ${x.total}</dd></div>`).join("")
        + `<div><dt><span class="s-etica-brecha-t">Brecha</span></dt><dd><b>${num(Math.abs(brecha), 1)} puntos</b> porcentuales</dd></div>`;
      lecturaEl.textContent = lectura;
    }
    rango.addEventListener("input", pintarParidad);
    pintarParidad();

    /* ---------- Demo 2: barras tipo SHAP ---------- */
    const filas = qa(".s-etica-fila"), detalle = q("#etica-shap-detalle");
    function elegir(id){
      filas.forEach(f => f.setAttribute("aria-pressed", f.dataset.id === id ? "true" : "false"));
      const f = filas.find(x => x.dataset.id === id), nombre = f.querySelector(".s-etica-fn").firstChild.textContent;
      const dato = f.querySelector(".s-etica-fd").textContent;
      detalle.innerHTML = (id === "barrio" ? `<span class="s-etica-alerta">Alerta</span>` : "") + `<b>${nombre}: ${dato}.</b> ${DETALLE[id]}`;
    }
    filas.forEach(f => f.addEventListener("click", () => elegir(f.dataset.id)));
    elegir("barrio");

    /* ---------- Debate: votos contados en este equipo ---------- */
    const GUARDADO = "etica-votos";
    let votos = { si:0, no:0, nose:0 }, hist = [];
    try {
      const g = JSON.parse(localStorage.getItem(GUARDADO) || "null");
      if (g && g.votos){ OPS.forEach(o => { votos[o.id] = Math.max(0, +g.votos[o.id] || 0); }); hist = Array.isArray(g.hist) ? g.hist.filter(h => h in votos) : []; }
    } catch (e){ /* sin almacenamiento: el conteo vive mientras la página esté abierta */ }
    const guardar = () => { try { localStorage.setItem(GUARDADO, JSON.stringify({ votos, hist })); } catch (e){ /* sin almacenamiento */ } };
    const resV = q("#etica-votos-res");
    function pintarVotos(cambio){
      const total = OPS.reduce((s, o) => s + votos[o.id], 0);
      OPS.forEach(o => {
        const caja = q(`.s-etica-voto[data-op="${o.id}"]`), share = total ? votos[o.id] / total : 0;
        caja.querySelector(".s-etica-cuenta").textContent = votos[o.id];
        caja.querySelector(".s-etica-pct").textContent = pct(share * 100, 0);
        caja.querySelector(".s-etica-pista i").style.setProperty("--v", share);
        if (cambio === o.id && !reducir) gsap.fromTo(caja.querySelector(".s-etica-cuenta"), { scale:1.18 }, { scale:1, duration:.45, ease:"power3.out" });
      });
      resV.textContent = total
        ? `${total} ${total === 1 ? "voto" : "votos"}: ` + OPS.map(o => `${o.t}, ${votos[o.id]} (${pct(votos[o.id] / total * 100, 0)})`).join("; ") + "."
        : "Aún no hay votos.";
    }
    qa("[data-votar]").forEach(b => b.addEventListener("click", () => { const id = b.dataset.votar; votos[id]++; hist.push(id); guardar(); pintarVotos(id); }));
    q("#etica-deshacer").addEventListener("click", () => { const id = hist.pop(); if (id && votos[id] > 0) votos[id]--; guardar(); pintarVotos(); });
    const reiniciar = q("#etica-reiniciar"); let armado = null;
    reiniciar.addEventListener("click", () => {
      if (!armado){ reiniciar.textContent = "Confirmar: borrar votos"; armado = setTimeout(() => { reiniciar.textContent = "Reiniciar conteo"; armado = null; }, 3500); return; }
      clearTimeout(armado); armado = null; reiniciar.textContent = "Reiniciar conteo";
      votos = { si:0, no:0, nose:0 }; hist = []; guardar(); pintarVotos();
    });
    pintarVotos();

    /* ---------- La cita: en reposo, todo encendido ---------- */
    const escena = q(".s-etica-cita");
    const c3 = escena.querySelector("blockquote .s-etica-c3");
    if (reducir){ c3.classList.add("encendida"); return; }

    /* ---------- Movimiento firma: el haz del faro barre la cita ----------
       El haz se pinta en un lienzo debajo del texto: dentro de la cuña roja las palabras se dibujan en
       negro; la palabra real se oculta mientras el haz la toca y queda encendida en blanco cuando pasa. */
    const torre = escena.querySelector(".s-etica-torre"), lienzo = escena.querySelector(".s-etica-luz"), g2 = lienzo.getContext("2d");
    const ws = [...escena.querySelectorAll("blockquote .s-etica-w")], ws3 = [...c3.querySelectorAll(".s-etica-w")];
    const A = 7.5 * Math.PI / 180;               /* media apertura del haz */
    let O = { x:0, y:0 }, pal = [], a0 = -1.3, a1 = 0, R = 5000, W = 0, H = 0, dpr = 1, prendida = [];
    escena.classList.add("animada");
    function medir(){
      const r = escena.getBoundingClientRect(), t = torre.getBoundingClientRect();
      W = r.width; H = r.height; dpr = Math.min(2, window.devicePixelRatio || 1);
      lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
      O = { x:t.left - r.left + t.width * .5, y:t.top - r.top + t.height * .34 };   /* la linterna en la foto */
      const ang = (x, y) => Math.atan2(y - r.top - O.y, x - r.left - O.x);
      pal = ws.map(w => {
        const b = w.getBoundingClientRect(), cs = getComputedStyle(w);
        const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, ls = parseFloat(cs.letterSpacing) || 0;
        g2.font = font; g2.letterSpacing = ls + "px";
        const m = g2.measureText(w.textContent), esq = [ang(b.left, b.top), ang(b.right, b.top), ang(b.left, b.bottom), ang(b.right, b.bottom)];
        return { t:w.textContent, x:b.left - r.left, y:b.top - r.top + m.fontBoundingBoxAscent, font, ls, lo:Math.min(...esq), hi:Math.max(...esq) };
      });
      a0 = Math.min(...pal.map(w => w.lo)) - A - .04; a1 = Math.max(...pal.map(w => w.hi)) + A + .04;
      R = 3 * (W + H); prendida = [];
    }
    const estado = { p:0 };
    function pintar(){
      const p = estado.p, k = clamp((p - .05) / .8, 0, 1);
      const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const th = a0 + (a1 - a0) * e, prendido = p > .03 && p < .9;
      const toca = w => prendido && w.hi >= th - A && w.lo <= th + A;
      g2.setTransform(dpr, 0, 0, dpr, 0, 0); g2.clearRect(0, 0, W, H);
      if (prendido){
        /* lo que el haz ya barrió: las palabras que aún toca se ven encendidas en blanco */
        const pt = a => [O.x + R * Math.cos(a), O.y + R * Math.sin(a)];
        g2.save(); g2.beginPath(); g2.moveTo(O.x, O.y);
        [a0 - .3, (a0 - .3 + th - A) / 2, th - A].forEach(a => g2.lineTo(...pt(a)));
        g2.closePath(); g2.clip(); g2.fillStyle = "#fff";
        pal.forEach(w => { if (toca(w)){ g2.font = w.font; g2.letterSpacing = w.ls + "px"; g2.fillText(w.t, w.x, w.y); } });
        g2.restore();
        /* el haz: cuña roja de borde duro con las palabras en negro */
        const nx = -Math.sin(th) * 9, ny = Math.cos(th) * 9;
        g2.beginPath(); g2.moveTo(O.x - nx, O.y - ny);
        g2.lineTo(O.x + R * Math.cos(th - A), O.y + R * Math.sin(th - A)); g2.lineTo(O.x + R * Math.cos(th + A), O.y + R * Math.sin(th + A));
        g2.lineTo(O.x + nx, O.y + ny); g2.closePath();
        g2.fillStyle = "#ff3b30"; g2.fill();
        g2.save(); g2.clip(); g2.fillStyle = "#000";
        pal.forEach(w => { if (toca(w)){ g2.font = w.font; g2.letterSpacing = w.ls + "px"; g2.fillText(w.t, w.x, w.y); } });
        g2.restore();
      }
      pal.forEach((w, i) => {
        const on = (p >= .9 || (p > .03 && w.lo <= th + A)) && !toca(w);
        if (on !== prendida[i]){ prendida[i] = on; ws[i].classList.toggle("on", on); }
      });
      c3.classList.toggle("encendida", p > .3 && ws3.every(w => w.classList.contains("on")));
    }
    const barrido = gsap.to(estado, { p:1, ease:"none", onUpdate:pintar,
      scrollTrigger:{ trigger:escena, start:"top top", end:"+=130%", pin:true, scrub:.6, anticipatePin:1, onRefresh:() => { medir(); pintar(); } } });
    const st = barrido.scrollTrigger;
    Clase.parada("etica-cita-fin", () => st.start + (st.end - st.start) * .93);
    medir(); pintar();

    /* ---------- Apertura: titular que sube, foto que se asienta y deriva ---------- */
    const ap = q(".s-etica-apertura");
    gsap.timeline({ scrollTrigger:{ trigger:ap, start:"top 70%", toggleActions:"play none none reverse" } })
      .from(ap.querySelectorAll(".s-etica-titular .in"), { yPercent:108, duration:1, ease:"power4.out", stagger:.1 })
      .from(ap.querySelector(".s-etica-ap-apoyo"), { y:24, opacity:0, duration:.7, ease:"power3.out" }, .35)
      .from(ap.querySelector(".s-etica-pie"), { opacity:0, duration:.6, ease:"power2.out" }, .6);
    gsap.fromTo(ap.querySelector(".s-etica-foto img"), { scale:1.1 }, { scale:1, duration:1.8, ease:"power2.out",
      scrollTrigger:{ trigger:ap, start:"top 85%", toggleActions:"play none none reverse" } });
    gsap.to(ap.querySelector(".s-etica-foto"), { yPercent:22, ease:"none", scrollTrigger:{ trigger:ap, start:"top top", end:"bottom top", scrub:true } });

    /* ---------- Estaciones: el haz se enciende desde el borde y trae el título ---------- */
    qa(".s-etica-haz").forEach(h => {
      gsap.timeline({ scrollTrigger:{ trigger:h, start:"top 80%", toggleActions:"play none none reverse" } })
        .fromTo(h, { clipPath:"polygon(0% 20%, 0% 20%, 0% 80%, 0% 80%)" }, { clipPath:"polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)", duration:1, ease:"power3.out" })
        .from(h.querySelector(".s-etica-haz-t"), { xPercent:-3, duration:.9, ease:"power3.out" }, 0);
    });
    qa(".s-etica-cuerpo").forEach(c => gsap.from(c.children, { y:26, opacity:0, duration:.7, ease:"power3.out", stagger:.08,
      scrollTrigger:{ trigger:c, start:"top 85%", toggleActions:"play none none reverse" } }));
    qa(".s-etica-demo").forEach(d => gsap.from(d.querySelectorAll(".s-etica-demo-izq > *, .s-etica-demo-der"), { y:26, opacity:0, duration:.7, ease:"power3.out", stagger:.07,
      scrollTrigger:{ trigger:d, start:"top 75%", toggleActions:"play none none reverse" } }));
    gsap.from(rects, { y:-26, opacity:0, duration:.5, ease:"power3.out", stagger:{ each:.005, from:"random" },
      scrollTrigger:{ trigger:".s-etica-paridad", start:"top 60%", toggleActions:"play none none reverse" } });
    const tlBarras = gsap.timeline({ scrollTrigger:{ trigger:".s-etica-shap", start:"top 60%", toggleActions:"play none none reverse" } });
    qa(".s-etica-pista2 i").forEach((i, n) => { const w = parseFloat(i.style.getPropertyValue("--w")); tlBarras.fromTo(i, { "--w":0 }, { "--w":w, duration:.5, ease:"power3.out", immediateRender:true }, n * .12); });
    gsap.from(qa(".s-etica-lente img"), { scale:1.08, duration:1.6, ease:"power2.out", scrollTrigger:{ trigger:".s-etica-empleo", start:"top 70%", toggleActions:"play none none reverse" } });

    /* ---------- Debate y cierre ---------- */
    gsap.from(qa(".s-etica-debate-t, .s-etica-debate > .s-etica-texto, .s-etica-voto"), { y:26, opacity:0, duration:.7, ease:"power3.out", stagger:.08,
      scrollTrigger:{ trigger:".s-etica-debate", start:"top 70%", toggleActions:"play none none reverse" } });
    /* la pregunta final se enciende de golpe, como un destello del faro */
    gsap.timeline({ scrollTrigger:{ trigger:".s-etica-deberia", start:"top 70%", toggleActions:"play none none reverse" } })
      .fromTo(q(".s-etica-deberia .in"), { opacity:0, scale:.94 }, { opacity:1, scale:1, duration:.18, ease:"power2.out", transformOrigin:"0% 100%" })
      .to(q(".s-etica-deberia .in"), { opacity:.25, duration:.12, ease:"none" }, .5)
      .to(q(".s-etica-deberia .in"), { opacity:1, duration:.12, ease:"none" }, .7);
    gsap.fromTo(q(".s-etica-silueta img"), { yPercent:-6 }, { yPercent:6, ease:"none", scrollTrigger:{ trigger:".s-etica-silueta", start:"top bottom", end:"bottom top", scrub:true } });
  }
});
})();
