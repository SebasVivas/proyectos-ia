/* nucleo.js — construye la página con las secciones registradas y arranca todo.
   Carga al final, después de los archivos de secciones/.
   Parámetros de URL:
     ?seccion=<parada>   arranca en esa parada
     ?solo=<id>          muestra solo esa sección, sin movimiento (revisión con capturas)
     ?solo=<id>&vivo=1   solo esa sección, con animaciones pero sin scroll suave */
(() => {
"use strict";
const C = window.Clase;
gsap.registerPlugin(ScrollTrigger);
const params = new URLSearchParams(location.search);
const solo = params.get("solo");
const vivo = params.get("vivo") === "1";
const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches || (!!solo && !vivo);
C.reducir = reducir; C.solo = solo;
const raiz = document.documentElement;
if (reducir) raiz.classList.add("sin-movimiento");
if (solo) raiz.classList.add("modo-solo");
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (window.DemosIA) DemosIA.estilosBase();

/* ---------- 1. Construir ---------- */
const lista = C.secciones.slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
const estilos = document.createElement("style");
estilos.id = "css-secciones";
estilos.textContent = lista.map(s => `/* ===== ${s.id} ===== */\n${s.css || ""}`).join("\n");
document.head.appendChild(estilos);
const lienzo = document.getElementById("lienzo");
lista.forEach(s => {
  const b = document.createElement("div");
  b.className = "bloque"; b.dataset.bloque = s.id;
  b.innerHTML = s.html || "";
  if (solo && solo !== s.id) b.hidden = true;
  lienzo.appendChild(b);
  s.raiz = b;
});

/* ---------- 2. Scroll suave ---------- */
let lenis = null;
if (!reducir && !solo){
  lenis = new Lenis({ lerp:0.1, smoothWheel:true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
C.lenis = lenis;

/* ---------- 3. Cronómetro de taller ---------- */
const crono = document.getElementById("crono");
let cr = { fin:0, restante:0, pausado:false, total:0, timer:null };
const mmss = s => { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
const mini = document.getElementById("crono-mini");
function pintarCrono(){
  const rest = cr.pausado ? cr.restante : (cr.fin - Date.now()) / 1000;
  const urgente = rest > 0 && rest <= Math.min(300, cr.total * .2), fin = rest <= 0;
  const texto = fin ? "00:00" : mmss(rest);
  document.getElementById("crono-reloj").textContent = texto;
  document.getElementById("crono-mini-reloj").textContent = fin ? "Tiempo" : texto + (cr.pausado ? " en pausa" : "");
  [crono, mini].forEach(el => { el.classList.toggle("urgente", urgente); el.classList.toggle("fin", fin); });
  if (fin){ document.getElementById("crono-nota").textContent = "Tiempo."; clearInterval(cr.timer); }
}
C.cronometro = (minutos, titulo, nota) => {
  clearInterval(cr.timer);
  cr = { total:minutos * 60, fin:Date.now() + minutos * 60000, restante:minutos * 60, pausado:false, timer:null };
  document.getElementById("crono-titulo").textContent = titulo || "";
  document.getElementById("crono-mini-titulo").textContent = titulo || "";
  document.getElementById("crono-nota").textContent = nota || "";
  document.getElementById("crono-pausa").textContent = "Pausar";
  mini.hidden = true; crono.hidden = false; if (lenis) lenis.stop();
  pintarCrono(); cr.timer = setInterval(pintarCrono, 250);
  document.getElementById("crono-pausa").focus();
};
/* Minimizar: el reloj sigue corriendo en la esquina y la clase puede avanzar */
function minimizarCrono(){ crono.hidden = true; mini.hidden = false; if (lenis) lenis.start(); }
function restaurarCrono(){ mini.hidden = true; crono.hidden = false; if (lenis) lenis.stop(); document.getElementById("crono-pausa").focus(); }
function cerrarCrono(){ clearInterval(cr.timer); crono.hidden = true; mini.hidden = true; if (lenis) lenis.start(); }
document.getElementById("crono-minimizar").addEventListener("click", minimizarCrono);
mini.addEventListener("click", restaurarCrono);
document.getElementById("crono-pausa").addEventListener("click", e => {
  if (cr.pausado){ cr.fin = Date.now() + cr.restante * 1000; cr.pausado = false; e.currentTarget.textContent = "Pausar"; clearInterval(cr.timer); cr.timer = setInterval(pintarCrono, 250); }
  else { cr.restante = (cr.fin - Date.now()) / 1000; cr.pausado = true; e.currentTarget.textContent = "Seguir"; }
  pintarCrono();
});
document.getElementById("crono-mas").addEventListener("click", () => {
  if (cr.pausado) cr.restante += 300; else { cr.fin = Math.max(cr.fin, Date.now()) + 300000; clearInterval(cr.timer); cr.timer = setInterval(pintarCrono, 250); }
  cr.total += 300; document.getElementById("crono-nota").textContent = ""; pintarCrono();
});
document.getElementById("crono-cerrar").addEventListener("click", cerrarCrono);

/* ---------- 4. Iniciar cada sección ---------- */
const base = { gsap, ScrollTrigger, lenis, reducir, util:C.util, DemosIA:window.DemosIA, Clase:C };
lista.forEach(s => {
  if (solo && solo !== s.id) return;
  if (typeof s.iniciar !== "function") return;
  try { s.iniciar(Object.assign({}, base, { raiz:s.raiz, solo:solo === s.id })); }
  catch (e){ console.error(`[sección ${s.id}]`, e); }
});

/* ---------- 5. Cabecera y barra de progreso toman la tinta del campo de abajo ---------- */
function tinta(nombre){
  const c = C.campos[nombre]; if (!c) return;
  raiz.style.setProperty("--h-ink", c.ink); raiz.style.setProperty("--h-btn-bg", c.btn[0]); raiz.style.setProperty("--h-btn-ink", c.btn[1]);
}
/* Si la sección está fijada con pin, su tramo de scroll es el alto del pin-spacer, no el de la sección */
const tramo = el => { const p = el.parentElement; return Math.max(1, p && p.classList.contains("pin-spacer") ? p.offsetHeight : el.offsetHeight); };
document.querySelectorAll("[data-campo]").forEach(el => {
  if (el.closest(".bloque[hidden]")) return;
  ScrollTrigger.create({ trigger:el, start:"top 40px", end:() => "+=" + tramo(el),
    onToggle(self){ if (self.isActive) tinta(el.dataset.campo); } });
});
C.tinta = tinta;   /* para recorridos horizontales que cambian de campo sin scroll vertical */
const primera = document.querySelector(".bloque:not([hidden]) [data-campo]");
if (primera) tinta(primera.dataset.campo);
const barra = document.getElementById("progreso");
function progreso(){ const lim = document.documentElement.scrollHeight - innerHeight; barra.style.transform = `scaleX(${lim > 0 ? scrollY / lim : 0})`; }
if (lenis) lenis.on("scroll", progreso); else addEventListener("scroll", progreso, { passive:true });

/* ---------- 6. Paradas, teclado e índice ---------- */
function paradas(){
  const ps = [];
  document.querySelectorAll("[data-parada]").forEach(el => {
    if (el.closest(".bloque[hidden]")) return;
    ps.push({ id:el.dataset.parada || el.id, y:Math.round(el.getBoundingClientRect().top + scrollY) });
  });
  C.paradasDinamicas.forEach(p => { try { const y = p.fnY(); if (isFinite(y)) ps.push({ id:p.id, y:Math.round(y) }); } catch (e){ /* sección ausente */ } });
  return ps.sort((a, b) => a.y - b.y);
}
C.paradas = paradas;
function ir(y, inmediato){
  if (lenis) lenis.scrollTo(y, inmediato ? { immediate:true, force:true } : { duration:1.25, easing:t => 1 - Math.pow(1 - t, 4), force:true });
  else scrollTo({ top:y, behavior:(inmediato || reducir) ? "auto" : "smooth" });
}
C.irA = (id, inmediato) => { const p = paradas().find(x => x.id === id); if (p) ir(p.y, inmediato); return !!p; };
const indice = document.getElementById("indice");
function abrirIndice(){ indice.hidden = false; if (lenis) lenis.stop(); const a = indice.querySelector("a"); if (a) a.focus(); }
function cerrarIndice(){ if (indice.hidden) return; indice.hidden = true; if (lenis) lenis.start(); }
document.getElementById("abrir-indice").addEventListener("click", abrirIndice);
indice.querySelector(".cerrar").addEventListener("click", cerrarIndice);
indice.querySelector("ol").innerHTML = lista.filter(s => s.indice && !(solo && solo !== s.id))
  .map(s => `<li><a href="#${s.indice.ir}" data-ir="${s.indice.ir}">${s.indice.texto}${s.indice.nota ? `<small>${s.indice.nota}</small>` : ""}</a></li>`).join("");
document.addEventListener("click", e => {
  const a = e.target.closest("[data-ir]"); if (!a) return;
  e.preventDefault(); cerrarIndice(); setTimeout(() => C.irA(a.dataset.ir), indice.hidden ? 0 : 60);
});
const IGNORAR = "input, textarea, select, [role=radiogroup], [role=slider], [data-teclas-propias]";
addEventListener("keydown", e => {
  if (!crono.hidden){ if (e.key === "Escape") minimizarCrono(); return; }
  if (!indice.hidden){ if (e.key === "Escape") cerrarIndice(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest && e.target.closest(IGNORAR)) return;
  if (e.key === "i" || e.key === "I"){ abrirIndice(); return; }
  const adelante = ["ArrowDown", "PageDown", " ", "ArrowRight"].includes(e.key), atras = ["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key);
  if (!adelante && !atras) return;
  if (e.key === " " && /^(BUTTON|A|SUMMARY)$/.test(e.target.tagName)) return;
  e.preventDefault();
  const ps = paradas(), y = scrollY;
  const dest = adelante ? ps.find(p => p.y > y + 8) : [...ps].reverse().find(p => p.y < y - 8);
  if (dest) ir(dest.y);
});

/* ---------- 7. Créditos de imágenes ---------- */
const creditos = lista.flatMap(s => s.creditos || []);
document.getElementById("creditos").innerHTML = creditos.map(c => `<li>${c}</li>`).join("");
if (!creditos.length) document.getElementById("creditos-titulo").hidden = true;

/* ---------- 8. Arranque ---------- */
function arrancar(){
  ScrollTrigger.refresh();
  progreso();
  const pedido = params.get("seccion");
  /* Tras un salto inmediato, un empujón de 1 px hace que los recorridos fijados (pin + scrub) pinten su estado */
  const empujar = () => { scrollBy(0, 1); requestAnimationFrame(() => { scrollBy(0, -1); ScrollTrigger.update(); }); };
  if (pedido && !solo){ const ve = () => { if (C.irA(pedido, true)){ ScrollTrigger.update(); empujar(); } }; ve(); setTimeout(ve, 500); }
}
const fuentes = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]) : Promise.resolve();
fuentes.then(() => requestAnimationFrame(arrancar));
addEventListener("load", () => { ScrollTrigger.refresh(); progreso(); });
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => ScrollTrigger.refresh(), 200); });
})();
