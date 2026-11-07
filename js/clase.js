/* clase.js — registro de secciones y utilidades compartidas.
   Cada archivo de secciones/ llama a Clase.seccion({...}). nucleo.js (que carga al final)
   ordena, construye el DOM, arranca el scroll y llama a iniciar() de cada sección. */
(function (g) {
"use strict";
const secciones = [], campos = {}, paradasDinamicas = [];

/* Números a la colombiana: miles con punto, decimales con coma. */
function num(n, dec = 0){
  if (!isFinite(n)) return "—";
  const neg = n < 0;
  let [e, d] = Math.abs(n).toFixed(dec).split(".");
  e = e.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (neg ? "−" : "") + e + (d ? "," + d : "");
}
const cop = n => (n < 0 ? "−$" : "$") + num(Math.abs(Math.round(n)));
const pct = (n, dec = 1) => num(n, dec) + "%";
function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r, m = 0, s = 1){ const u = 1 - r(), v = r(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Contraste WCAG entre dos colores hex (para verificar paletas en consola). */
function luminancia(hex){ const c = hex.replace("#", ""); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16) / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((s, x, i) => s + x * [.2126, .7152, .0722][i], 0); }
function contraste(a, b){ const la = luminancia(a), lb = luminancia(b); return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05); }

g.Clase = {
  secciones, campos, paradasDinamicas,
  /* def = { id, orden, html, css, iniciar(ctx), indice:{texto, ir}, creditos:[...] } */
  seccion(def){ if (!def || !def.id) { console.error("Clase.seccion sin id", def); return; } secciones.push(def); },
  /* Campo de color para la cabecera: { bg, ink, btn:[fondoBoton, tintaBoton] } */
  campo(nombre, def){ campos[nombre] = def; },
  /* Parada calculada (para recorridos fijados con pin): fnY devuelve el scroll absoluto. */
  parada(id, fnY){ paradasDinamicas.push({ id, fnY }); },
  util: { num, cop, pct, rng, gauss, clamp, esc, contraste }
};

/* Campos base del boceto B (contrastes: negro sobre naranja 7,3; sobre gris 12,2; sobre menta 17,4; blanco sobre negro 21) */
g.Clase.campo("blanco",  { bg:"#ffffff", ink:"#000000", btn:["#a7ff9c", "#000000"] });
g.Clase.campo("menta",   { bg:"#a7ff9c", ink:"#000000", btn:["#000000", "#ffffff"] });
g.Clase.campo("gris",    { bg:"#c5c5c5", ink:"#000000", btn:["#a7ff9c", "#000000"] });
g.Clase.campo("naranja", { bg:"#ff6831", ink:"#000000", btn:["#a7ff9c", "#000000"] });
g.Clase.campo("negro",   { bg:"#000000", ink:"#ffffff", btn:["#a7ff9c", "#000000"] });
})(window);
