/* secciones/70-implementacion.js — «El astillero»: módulo 5, implementación y mejora de la solución.
   Pantallas (ids de sección): implementacion (apertura), implementacion-mlops (timón fijado con pin),
   implementacion-entrenamiento (complejidad en vivo), implementacion-ruta (despliegue: una predicción en la nube
   o en el borde) e implementacion-mejora (drift en vivo).
   Paleta del acto: concreto #d7d5cf (tinta negra 14,3:1), naranja de seguridad #ff5b14 (tinta negra 6,8:1),
   azul de plano #1446a0 (tinta blanca 8,7:1) y negro (tinta blanca 21:1; naranja sobre negro 6,8:1). */
(() => {
"use strict";
const { num, cop, rng, gauss, clamp } = Clase.util;
const AZUL = "#1446a0", NARANJA = "#ff5b14", CONCRETO = "#d7d5cf";
const IMG = "img/implementacion/assets/";
const LETRA = '"Figtree", system-ui, sans-serif';
const suave = t => t * t * (3 - 2 * t);

Clase.campo("astillero-naranja",  { bg:"#ff5b14", ink:"#000000", btn:["#000000", "#ffffff"] });
Clase.campo("astillero-azul",     { bg:"#1446a0", ink:"#ffffff", btn:["#ff5b14", "#000000"] });
Clase.campo("astillero-concreto", { bg:"#d7d5cf", ink:"#000000", btn:["#ff5b14", "#000000"] });
Clase.campo("astillero-negro",    { bg:"#000000", ink:"#ffffff", btn:["#ff5b14", "#000000"] });

/* ------------------------------------------------------------------ utilidades */
/* Lienzo HiDPI (dpr acotado a 2) que se vuelve a pintar cuando cambia el tamaño de su caja. */
function lienzo(cv, dibujar){
  const c = cv.getContext("2d");
  const L = { cv, c, w:0, h:0 };
  L.pintar = () => {
    const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (w !== L.w || h !== L.h || cv.width !== Math.round(w * dpr)){ L.w = w; L.h = h; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    if (w > 2 && h > 2) dibujar(c, w, h);
  };
  if ("ResizeObserver" in window){ let p = 0; new ResizeObserver(() => { cancelAnimationFrame(p); p = requestAnimationFrame(L.pintar); }).observe(cv); }
  return L;
}
function rotulo(c, t, x, y, o = {}){
  c.font = `${o.peso || 600} ${o.tam || 15}px ${LETRA}`; c.fillStyle = o.color || "#000";
  c.textAlign = o.alinear || "left"; c.textBaseline = o.base || "alphabetic"; c.fillText(String(t), x, y);
}
function alVer(el, fn){
  if (!("IntersectionObserver" in window)){ fn(true); return; }
  new IntersectionObserver(es => es.forEach(e => fn(e.isIntersecting)), { threshold:0.01 }).observe(el);
}
function trasFuentes(fn){ if (document.fonts && document.fonts.ready) document.fonts.ready.then(fn); }

/* ================================================================== CSS común del acto */
const CSS_COMUN = `
  .s-implementacion{--concreto:#d7d5cf;--naranja:#ff5b14;--azul:#1446a0}
  .s-implementacion.s-implementacion-pantalla{min-height:100svh;padding:112px var(--margen) 88px}
  .s-implementacion.s-implementacion-concreto{background:#d7d5cf;color:#000}
  .s-implementacion.s-implementacion-azul{background:#1446a0;color:#fff}
  .s-implementacion.s-implementacion-negro{background:#000;color:#fff}
  .s-implementacion.s-implementacion-naranja{background:#ff5b14;color:#000}
  .s-implementacion h2{font-size:var(--step-head)}
  .s-implementacion h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-implementacion .s-implementacion-cab{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);row-gap:16px;align-items:end}
  .s-implementacion .s-implementacion-cab h2{grid-column:1/7}
  .s-implementacion .s-implementacion-cab > p{grid-column:7/13;font-size:var(--step-lead);line-height:1.3;max-width:46ch}
  .s-implementacion .s-implementacion-nota{font-size:var(--step-small);line-height:1.45}
  .s-implementacion .boton{background:#ff5b14;color:#000;border-color:#000}
  .s-implementacion .boton.s-implementacion-sec{background:transparent;color:inherit;border-color:currentColor}
  .s-implementacion.s-implementacion-azul .boton,.s-implementacion.s-implementacion-negro .boton{border-color:#fff}
  .s-implementacion.s-implementacion-azul .boton:focus-visible,.s-implementacion.s-implementacion-negro .boton:focus-visible{outline-color:#fff}
  .s-implementacion .boton[disabled]{opacity:.5;cursor:not-allowed;translate:none}
  .s-implementacion .s-implementacion-acciones{display:flex;flex-wrap:wrap;gap:10px}
  .s-implementacion .s-implementacion-grupo{display:flex;flex-direction:column;gap:10px}
  .s-implementacion .s-implementacion-etiqueta{font-weight:600}
  .s-implementacion .s-implementacion-opciones{display:flex;flex-wrap:wrap;gap:10px}
  .s-implementacion .s-implementacion-opciones label{position:relative;display:block}
  .s-implementacion .s-implementacion-opciones input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:1}
  .s-implementacion .s-implementacion-opciones .boton{background:transparent;color:inherit;border-color:currentColor}
  .s-implementacion .s-implementacion-opciones label:hover .boton{translate:0 -2px}
  .s-implementacion .s-implementacion-opciones input:checked + .boton{background:#ff5b14;color:#000}
  .s-implementacion .s-implementacion-opciones input:focus-visible + .boton{outline:3px solid currentColor;outline-offset:4px}
  .s-implementacion.s-implementacion-azul .s-implementacion-opciones input:checked + .boton,.s-implementacion.s-implementacion-negro .s-implementacion-opciones input:checked + .boton{border-color:#fff}
  .s-implementacion input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:44px;background:transparent;cursor:pointer;color:inherit}
  .s-implementacion input[type=range]::-webkit-slider-runnable-track{height:8px;background:currentColor}
  .s-implementacion input[type=range]::-moz-range-track{height:8px;background:currentColor}
  .s-implementacion input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:30px;height:30px;margin-top:-11px;background:#ff5b14;border:3px solid currentColor;border-radius:0}
  .s-implementacion input[type=range]::-moz-range-thumb{width:24px;height:24px;background:#ff5b14;border:3px solid currentColor;border-radius:0}
  .s-implementacion input[type=range]:focus-visible{outline:3px solid currentColor;outline-offset:6px}
  .s-implementacion .s-implementacion-veredicto{padding:16px 20px 18px;background:#000;color:#fff;transition:background-color .3s,color .3s}
  .s-implementacion .s-implementacion-vt{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1;margin-bottom:6px}
  .s-implementacion .s-implementacion-veredicto[data-estado="bien"],.s-implementacion .s-implementacion-veredicto[data-estado="converge"]{background:#1446a0;color:#fff}
  .s-implementacion .s-implementacion-veredicto[data-estado="sobre"],.s-implementacion .s-implementacion-veredicto[data-estado="oscila"]{background:#ff5b14;color:#000}
  .s-implementacion .s-implementacion-veredicto[data-estado="lento"]{background:transparent;color:#000;outline:3px solid #000;outline-offset:-3px}
  .s-implementacion .s-implementacion-lienzo{display:block;width:100%;border:3px solid currentColor}
  .s-implementacion .s-implementacion-leyenda{display:flex;flex-wrap:wrap;gap:6px 22px;font-weight:600;list-style:none}
  .s-implementacion .s-implementacion-leyenda i{display:inline-block;vertical-align:-1px;margin-right:8px}
  .s-implementacion .s-implementacion-fig figcaption{font-size:var(--step-small);line-height:1.45;margin-top:8px;max-width:80ch}
  .s-implementacion .s-implementacion-dato{display:flex;flex-direction:column;gap:2px}
  .s-implementacion .s-implementacion-dato > p:first-child{font-weight:600}
  .s-implementacion .s-implementacion-cifra{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:.9;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
  @media (max-width:900px){
    .s-implementacion .s-implementacion-cab h2,.s-implementacion .s-implementacion-cab > p{grid-column:1/-1}
  }
`;

/* ================================================================== 1. APERTURA: del plano al agua */
Clase.seccion({
  id:"implementacion", orden:70,
  indice:{ texto:"Implementación", ir:"implementacion", nota:"Módulo 5: ciclo MLOps, entrenamiento, despliegue y mejora continua" },
  creditos:[
    '«Men at Work Beside the Launching Chains of the "Great Eastern"», Robert Howlett, 18 de Noviembre, 1857, dominio público (CC0), vía <a href="https://www.metmuseum.org/art/collection/search/285910">The Metropolitan Museum of Art</a>'
  ],
  css: CSS_COMUN + `
  .s-implementacion.s-implementacion-apertura{display:flex;align-items:flex-end;padding:112px var(--margen) 48px}
  .s-implementacion-apertura .s-implementacion-grada{position:absolute;top:80px;right:0;bottom:0;width:57vw;mix-blend-mode:multiply;will-change:transform}
  .s-implementacion-apertura .s-implementacion-marco{position:absolute;inset:0;overflow:hidden;background:#fff;clip-path:polygon(0 0,100% 0,100% 100%,24% 100%)}
  .s-implementacion-apertura .s-implementacion-marco img{width:100%;height:100%;object-fit:cover;object-position:64% 50%;transform:scale(1.1);transform-origin:68% 62%}
  .s-implementacion-apertura .s-implementacion-riel{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .s-implementacion-apertura .s-implementacion-riel line{stroke:#000;stroke-width:14}
  .s-implementacion-apertura .s-implementacion-texto{position:relative;z-index:1;width:min(42vw,680px)}
  .s-implementacion-apertura h2{font-size:var(--step-display)}
  .s-implementacion-apertura .s-implementacion-lead{font-size:var(--step-lead);line-height:1.28;font-weight:600;margin-top:28px}
  .s-implementacion-apertura .s-implementacion-historia{margin-top:16px;max-width:40ch}
  .s-implementacion-apertura .s-implementacion-pie{margin-top:18px;font-size:var(--step-small);line-height:1.45;max-width:46ch}
  @media (max-width:900px){
    .s-implementacion-apertura .s-implementacion-grada{width:100vw;opacity:.35}
    .s-implementacion-apertura .s-implementacion-texto{width:auto}
  }
  `,
  html:`
  <span class="ancla" data-parada="implementacion"></span>
  <section class="s-implementacion s-implementacion-apertura cap" data-campo="astillero-naranja" style="--campo:#ff5b14;--tinta:#000" aria-labelledby="implementacion-titulo">
    <div class="s-implementacion-grada">
      <div class="s-implementacion-marco"><img src="${IMG}great-eastern-cadenas-1857.jpg" width="2000" height="1423" loading="lazy" decoding="async" alt="Astillero de Londres en 1857: el casco del Great Eastern sobre la rampa, andamios de madera y obreros junto al gran tambor de las cadenas de botadura"></div>
      <svg class="s-implementacion-riel" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="0" x2="24" y2="100" vector-effect="non-scaling-stroke"/></svg>
    </div>
    <div class="s-implementacion-texto">
      <h2 id="implementacion-titulo"><span class="mask"><span class="in">Del plano</span></span><span class="mask"><span class="in">al agua</span></span></h2>
      <p class="s-implementacion-lead">Abrimos el módulo 5: implementación y mejora de la solución. Diseño, entrenamiento, despliegue, mejora continua y ética en IA.</p>
      <p class="s-implementacion-historia">En 1857 el Great Eastern, el barco más grande de su época, se atascó en la rampa de botadura y tardó casi tres meses en tocar el agua. A un modelo de IA le pasa lo mismo cuando nadie planea cómo llevarlo a producción.</p>
      <p class="s-implementacion-pie">Obreros junto a las cadenas de botadura del Great Eastern, Londres, 18 de Noviembre, 1857. Fotografía de Robert Howlett.</p>
    </div>
  </section>`,
  iniciar(ctx){
    const { gsap, reducir, raiz } = ctx;
    const sec = raiz.querySelector(".s-implementacion-apertura");
    if (!sec || reducir) return;
    const grada = sec.querySelector(".s-implementacion-grada"), marco = sec.querySelector(".s-implementacion-marco");
    const foto = marco.querySelector("img"), riel = sec.querySelector(".s-implementacion-riel");
    /* Entrada: la foto entra desde la derecha cortada por la rampa y el titular sube */
    gsap.timeline({ scrollTrigger:{ trigger:sec, start:"top 78%", toggleActions:"play none none reverse" } })
      .from(marco, { clipPath:"polygon(100% 0,100% 0,100% 100%,100% 100%)", duration:1.25, ease:"power3.inOut" }, 0)
      .from(riel, { opacity:0, duration:.4, ease:"power2.out" }, .9)
      .from(sec.querySelectorAll("h2 .in"), { yPercent:105, duration:1, ease:"power4.out", stagger:.09 }, .15)
      .from(sec.querySelectorAll(".s-implementacion-texto p"), { y:26, opacity:0, duration:.7, ease:"power3.out", stagger:.08 }, .45);
    /* Firma: mientras la pantalla siguiente sube, el barco baja por la rampa */
    gsap.timeline({ scrollTrigger:{ trigger:sec, start:"top top", end:"+=100%", scrub:true } })
      .to(grada, { xPercent:3.8, yPercent:16, ease:"none" }, 0)
      .to(foto, { scale:1, ease:"none" }, 0)
      .to(sec.querySelector(".s-implementacion-texto"), { yPercent:-8, ease:"none" }, 0);
  }
});

/* ================================================================== 2. CICLO MLOPS: el timón */
const ETAPAS = [
  { slug:"diseno", corto:"Diseño", n:"Diseño del modelo", f:"Qué modelo, qué variables y contra qué baseline se compara." },
  { slug:"datos", corto:"Datos", n:"Preparación de datos", f:"Limpiar, transformar y separar en entrenamiento, validación y prueba." },
  { slug:"entrenamiento", corto:"Entrenamiento", n:"Entrenamiento", f:"El modelo aprende de los datos sin memorizarlos." },
  { slug:"evaluacion", corto:"Evaluación", n:"Evaluación y ajuste", f:"Medir dónde falla y quedarse con la mejor versión." },
  { slug:"implementacion", corto:"Implementación", n:"Implementación", f:"Empacarlo como API y ponerlo en la nube o en casa." },
  { slug:"monitoreo", corto:"Monitoreo", n:"Monitoreo y mejora", f:"Vigilar el drift y reentrenar cuando el mundo cambia." }
];
function svgTimon(){
  let rayos = "", mangos = "", juntas = "", pernos = "";
  for (let i = 0; i < 6; i++){
    const a = i * 60;
    rayos += `<line x1="0" y1="-58" x2="0" y2="-208" transform="rotate(${a})"/>`;
    mangos += `<g class="s-implementacion-mlops-mango" data-i="${i}" transform="rotate(${a})"><rect x="-11" y="-254" width="22" height="18"/><line x1="0" y1="-262" x2="0" y2="-296"/><circle cx="0" cy="-312" r="13"/></g>`;
    juntas += `<rect x="-4" y="-240" width="8" height="36" transform="rotate(${a + 30})"/>`;
    pernos += `<circle cx="0" cy="-49" r="6" transform="rotate(${a + 30})"/>`;
  }
  return `<svg viewBox="-360 -360 720 720" aria-hidden="true" focusable="false">
    <g class="s-implementacion-mlops-giro">
      <g class="s-implementacion-mlops-rayos">${rayos}</g>
      <circle class="s-implementacion-mlops-anillo" r="150"/>
      <circle class="s-implementacion-mlops-aro" r="222"/>
      <g class="s-implementacion-mlops-juntas">${juntas}</g>
      ${mangos}
      <circle class="s-implementacion-mlops-cubo" r="62"/>
      <circle class="s-implementacion-mlops-hueco" r="38"/>
      <g class="s-implementacion-mlops-pernos">${pernos}</g>
      <circle class="s-implementacion-mlops-tapa" r="18"/>
    </g>
  </svg>`;
}
Clase.seccion({
  id:"implementacion-mlops", orden:71,
  css:`
  .s-implementacion.s-implementacion-mlops{background:#1446a0;color:#fff}
  .s-implementacion-mlops .s-implementacion-mlops-escena{position:relative;height:100svh;min-height:620px;overflow:hidden}
  .s-implementacion-mlops .s-implementacion-mlops-cab{position:absolute;top:112px;left:var(--margen);right:var(--margen)}
  .s-implementacion-mlops .s-implementacion-mlops-intro{position:absolute;left:var(--margen);bottom:36px;max-width:23ch;line-height:1.4}
  .s-implementacion-mlops .s-implementacion-mlops-rueda{--S:min(85svh,64vw,calc(100svh - 250px));position:absolute;left:50%;top:calc(100% - 12px);width:var(--S);height:var(--S);margin:calc(var(--S) / -2) 0 0 calc(var(--S) / -2)}
  .s-implementacion-mlops .s-implementacion-mlops-rueda svg{width:100%;height:100%;overflow:visible}
  .s-implementacion-mlops .s-implementacion-mlops-rayos line{stroke:#fff;stroke-width:16}
  .s-implementacion-mlops .s-implementacion-mlops-anillo{fill:none;stroke:#fff;stroke-width:8}
  .s-implementacion-mlops .s-implementacion-mlops-aro{fill:none;stroke:#fff;stroke-width:30}
  .s-implementacion-mlops .s-implementacion-mlops-juntas rect{fill:#1446a0}
  .s-implementacion-mlops .s-implementacion-mlops-mango rect,.s-implementacion-mlops .s-implementacion-mlops-mango circle{fill:#fff}
  .s-implementacion-mlops .s-implementacion-mlops-mango line{stroke:#fff;stroke-width:22;stroke-linecap:round}
  .s-implementacion-mlops .s-implementacion-mlops-mango.es-activo line{stroke:#ff5b14}
  .s-implementacion-mlops .s-implementacion-mlops-mango.es-activo circle{fill:#ff5b14}
  .s-implementacion-mlops .s-implementacion-mlops-cubo{fill:#fff}
  .s-implementacion-mlops .s-implementacion-mlops-hueco{fill:#1446a0}
  .s-implementacion-mlops .s-implementacion-mlops-pernos circle{fill:#1446a0}
  .s-implementacion-mlops .s-implementacion-mlops-tapa{fill:#fff}
  .s-implementacion-mlops .s-implementacion-mlops-marca{position:absolute;left:50%;top:50%;white-space:nowrap;font-weight:600;line-height:1.2;color:#fff;will-change:transform}
  .s-implementacion-mlops .s-implementacion-mlops-tarjeta{position:absolute;left:50%;bottom:50%;width:min(780px,88vw);margin-left:calc(min(780px,88vw) / -2);background:#ff5b14;color:#000;padding:22px 30px 24px;display:grid;transform-origin:50% 100%}
  .s-implementacion-mlops .s-implementacion-mlops-ficha{grid-area:1/1}
  .s-implementacion-mlops .s-implementacion-mlops-ficha h3{font-size:var(--step-head);letter-spacing:-.04em;line-height:.9}
  .s-implementacion-mlops .s-implementacion-mlops-ficha p{margin-top:14px;font-size:var(--step-lead);line-height:1.25;font-weight:600;max-width:34ch}
  .s-implementacion-mlops .s-implementacion-mlops-mastil{position:absolute;left:50%;top:50%;width:8px;height:26px;margin-left:-4px;background:#ff5b14}
  .s-implementacion-mlops .s-implementacion-mlops-lista{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:36px var(--gap);padding:24px var(--margen) 96px}
  .s-implementacion-mlops .s-implementacion-mlops-lista h3{margin-bottom:12px}
  @media (max-width:900px){.s-implementacion-mlops .s-implementacion-mlops-lista{grid-template-columns:1fr}.s-implementacion-mlops .s-implementacion-mlops-intro{display:none}}
  `,
  html:`
  <span class="ancla" data-parada="implementacion-mlops"></span>
  <section class="s-implementacion s-implementacion-mlops s-implementacion-azul" data-campo="astillero-azul" aria-labelledby="implementacion-mlops-titulo">
    <div class="s-implementacion-mlops-escena">
      <div class="s-implementacion-mlops-cab"><h2 id="implementacion-mlops-titulo">Ciclo de vida del modelo: MLOps</h2></div>
      <p class="s-implementacion-mlops-intro">Seis etapas en ciclo: lo que enseña el monitoreo vuelve al diseño.<span data-solo-vivo hidden> El timón gira con el scroll.</span></p>
      <div class="s-implementacion-mlops-tarjeta" aria-hidden="true">
        ${ETAPAS.map((e, i) => `<div class="s-implementacion-mlops-ficha" data-i="${i}"${i ? ' style="opacity:0;visibility:hidden"' : ""}><h3>${e.n}</h3><p>${e.f}</p></div>`).join("")}
      </div>
      <div class="s-implementacion-mlops-mastil" aria-hidden="true"></div>
      <div class="s-implementacion-mlops-rueda" aria-hidden="true">
        ${svgTimon()}
        ${ETAPAS.map((e, i) => `<span class="s-implementacion-mlops-marca" data-i="${i}">${e.corto}</span>`).join("")}
      </div>
    </div>
    <ol class="s-implementacion-mlops-lista" aria-label="Las seis etapas del ciclo de vida del modelo">
      ${ETAPAS.map(e => `<li><h3>${e.n}</h3><p>${e.f}</p></li>`).join("")}
    </ol>
  </section>`,
  iniciar(ctx){
    const { gsap, reducir, raiz, Clase:CL } = ctx;
    const sec = raiz.querySelector(".s-implementacion-mlops");
    if (!sec) return;
    const escena = sec.querySelector(".s-implementacion-mlops-escena"), rueda = sec.querySelector(".s-implementacion-mlops-rueda");
    const giro = sec.querySelector(".s-implementacion-mlops-giro");
    const mangos = [...sec.querySelectorAll(".s-implementacion-mlops-mango")];
    const marcas = [...sec.querySelectorAll(".s-implementacion-mlops-marca")];
    const fichas = [...sec.querySelectorAll(".s-implementacion-mlops-ficha")];
    const tarjeta = sec.querySelector(".s-implementacion-mlops-tarjeta"), mastil = sec.querySelector(".s-implementacion-mlops-mastil");
    const lista = sec.querySelector(".s-implementacion-mlops-lista");
    let k = 1, tamanos = [], activa = 0, ultimo = 0;
    function medir(){
      const S = rueda.offsetWidth || 600; k = S / 720;
      const cy = rueda.offsetTop + S / 2, tope = cy - 326 * k;
      mastil.style.top = (tope - 26) + "px";
      tarjeta.style.bottom = (escena.clientHeight - (tope - 26)) + "px";
      tamanos = marcas.map(m => [m.offsetWidth, m.offsetHeight]);
      pintar(ultimo);
    }
    function pintar(e){
      ultimo = e;
      const g = -e * 60, a = Math.round(e) % 6, cerca = 1 - Math.min(1, 2 * Math.abs(e - Math.round(e)));
      giro.setAttribute("transform", `rotate(${g.toFixed(2)})`);
      marcas.forEach((m, i) => {
        const th = (i * 60 + g) * Math.PI / 180, s = Math.sin(th), co = Math.cos(th);
        const [w, h] = tamanos[i] || [0, 0];
        const d = 334 * k + 0.5 * (Math.abs(s) * w + Math.abs(co) * h) + 6;
        m.style.transform = `translate(${(s * d - w / 2).toFixed(1)}px,${(-co * d - h / 2).toFixed(1)}px)`;
        m.style.opacity = (co > 0.9 || co < -0.25) ? 0 : 1;
      });
      mangos.forEach((mg, i) => mg.classList.toggle("es-activo", i === a));
      tarjeta.style.transform = `scale(${(0.88 + 0.12 * suave(cerca)).toFixed(3)})`;
      if (a !== activa){
        const antes = fichas[activa], ahora = fichas[a]; activa = a;
        if (reducir){ fichas.forEach((f, i) => { f.style.opacity = i === a ? 1 : 0; f.style.visibility = i === a ? "visible" : "hidden"; }); }
        else {
          gsap.to(antes, { autoAlpha:0, y:-14, duration:.22, ease:"power2.out", overwrite:true });
          gsap.fromTo(ahora, { autoAlpha:0, y:18 }, { autoAlpha:1, y:0, duration:.38, delay:.06, ease:"power3.out", overwrite:true });
        }
      }
    }
    trasFuentes(medir);
    if (reducir){ medir(); addEventListener("resize", medir); return; }
    sec.classList.add("es-viva");
    lista.classList.add("solo-lector");
    sec.querySelector("[data-solo-vivo]").hidden = false;
    const etapa = p => { const x = p * 5, i = Math.min(4, Math.floor(x)), t = x - i; return i + suave(clamp((t - 0.18) / 0.64, 0, 1)); };
    const proxy = { p:0 };
    const tw = gsap.to(proxy, { p:1, ease:"none", onUpdate:() => pintar(etapa(proxy.p)),
      scrollTrigger:{ trigger:sec, start:"top top", end:() => "+=" + Math.round(innerHeight * 4), pin:true, scrub:0.5, invalidateOnRefresh:true, onRefresh:medir } });
    const st = tw.scrollTrigger;
    ETAPAS.forEach((e, i) => { if (i) CL.parada("implementacion-mlops-" + e.slug, () => st.start + (st.end - st.start) * (i / 5)); });
    /* El disparador de data-campo del núcleo dura offsetHeight y no cubre el pin: al saltar directo a una etapa
       (?seccion= o irA inmediato) la cabecera conservaría la tinta anterior. Este cubre todo el recorrido fijado. */
    ctx.ScrollTrigger.create({ trigger:sec, start:"top 40px", end:() => "+=" + Math.round(st.end - st.start + sec.offsetHeight),
      onToggle(self){
        if (!self.isActive) return;
        const c = CL.campos["astillero-azul"], r = document.documentElement;
        r.style.setProperty("--h-ink", c.ink); r.style.setProperty("--h-btn-bg", c.btn[0]); r.style.setProperty("--h-btn-ink", c.btn[1]);
      } });
    medir();
  }
});

/* ================================================================== 3. ENTRENAMIENTO: complejidad en vivo */
/* Ajuste polinomial por mínimos cuadrados: base de Chebyshev en [-1, 1] y QR de Householder (estable hasta grado 15). */
function cheb(t, g){ const T = new Array(g + 1); T[0] = 1; if (g > 0) T[1] = t; for (let k = 2; k <= g; k++) T[k] = 2 * t * T[k - 1] - T[k - 2]; return T; }
function minimosCuadrados(A, b){
  const m = A.length, n = A[0].length, R = A.map(f => f.slice()), y = b.slice();
  for (let k = 0; k < n; k++){
    let nr = 0; for (let i = k; i < m; i++) nr += R[i][k] * R[i][k]; nr = Math.sqrt(nr);
    if (!nr) continue;
    const alfa = R[k][k] > 0 ? -nr : nr, v = new Array(m).fill(0);
    for (let i = k; i < m; i++) v[i] = R[i][k]; v[k] -= alfa;
    let vv = 0; for (let i = k; i < m; i++) vv += v[i] * v[i]; if (!vv) continue;
    for (let j = k; j < n; j++){ let s = 0; for (let i = k; i < m; i++) s += v[i] * R[i][j]; s = 2 * s / vv; for (let i = k; i < m; i++) R[i][j] -= s * v[i]; }
    let s = 0; for (let i = k; i < m; i++) s += v[i] * y[i]; s = 2 * s / vv; for (let i = k; i < m; i++) y[i] -= s * v[i];
  }
  const c = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--){ let s = y[i]; for (let j = i + 1; j < n; j++) s -= R[i][j] * c[j]; c[i] = s / R[i][i]; }
  return c;
}
const evalPoli = (cf, x) => { const T = cheb(2 * x - 1, cf.length - 1); let s = 0; for (let k = 0; k < cf.length; k++) s += cf[k] * T[k]; return s; };
const ecm = (cf, pts) => pts.reduce((s, p) => s + (evalPoli(cf, p.x) - p.y) ** 2, 0) / pts.length;
/* Ventas semanales sintéticas (miles de unidades): temporada anual + ruido gaussiano (sigma = 3). */
const VENTAS = (() => {
  const ENT = [2,5,8,12,15,18,22,25,28,31,35,38,41,45,48,51], VAL = [1,4,7,10,13,17,20,24,27,30,33,37,40,43,47,50,52];
  const temporada = x => 46 + 13 * Math.sin(2 * Math.PI * (x - 0.08)) + 6 * Math.sin(4 * Math.PI * x + 0.9);
  const r = rng(6), sigma = 3;
  const todas = [...ENT.map(s => ({ s, ent:true })), ...VAL.map(s => ({ s, ent:false }))].sort((a, b) => a.s - b.s);
  todas.forEach(p => { p.x = (p.s - 1) / 51; p.y = temporada(p.x) + gauss(r, 0, sigma); });
  const ent = todas.filter(p => p.ent), val = todas.filter(p => !p.ent), ajustes = [null];
  for (let g = 1; g <= 15; g++){
    const cf = minimosCuadrados(ent.map(p => cheb(2 * p.x - 1, g)), ent.map(p => p.y));
    ajustes.push({ g, cf, ent:ecm(cf, ent), val:ecm(cf, val) });
  }
  let mejor = 1; for (let g = 2; g <= 15; g++) if (ajustes[g].val < ajustes[mejor].val) mejor = g;
  ajustes.forEach(a => { if (a) a.estado = (a.g < mejor && a.ent > 2 * sigma * sigma) ? "sub" : (a.g > mejor && a.val > 1.5 * ajustes[mejor].val) ? "sobre" : "bien"; });
  const zonas = [];
  for (let g = 1; g <= 15; g++){ const z = zonas[zonas.length - 1]; if (z && z.estado === ajustes[g].estado) z.b = g; else zonas.push({ estado:ajustes[g].estado, a:g, b:g }); }
  return { ent, val, ajustes, mejor, zonas, sigma };
})();
const NOMBRE_AJUSTE = { sub:"Subajuste", bien:"Buen ajuste", sobre:"Sobreajuste" };
function explicarAjuste(a){
  if (a.estado === "sub") return "El modelo es demasiado simple para la forma de los datos: falla en entrenamiento y también en validación.";
  if (a.estado === "bien") return a.g === VENTAS.mejor ? "Es el grado con menor error de validación: captura la temporada sin perseguir el ruido." : "Captura la temporada sin perseguir el ruido: el error de validación se mantiene bajo.";
  if (a.g === 15) return "Con 16 semanas y 16 coeficientes la curva pasa por todos los puntos: error de entrenamiento cero y error de validación enorme. Memorizó.";
  return "Persigue el ruido de las semanas de entrenamiento: ese error sigue bajando, pero con semanas nuevas el error se dispara.";
}
Clase.seccion({
  id:"implementacion-entrenamiento", orden:72,
  indice:{ texto:"Entrenamiento en vivo", ir:"implementacion-entrenamiento", nota:"Subajuste y sobreajuste en vivo" },
  css:`
  .s-implementacion-entrenamiento .s-implementacion-demo{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);row-gap:20px;margin-top:28px;align-items:start}
  .s-implementacion-entrenamiento .s-implementacion-fig{grid-column:1/9;display:flex;flex-direction:column;gap:10px}
  .s-implementacion-entrenamiento .s-implementacion-ajuste{height:clamp(280px,calc(100svh - 360px),540px)}
  .s-implementacion-entrenamiento .s-implementacion-leyenda .s-implementacion-pt-ent{width:14px;height:14px;border-radius:50%;background:#000}
  .s-implementacion-entrenamiento .s-implementacion-leyenda .s-implementacion-pt-val{width:15px;height:15px;background:#ff5b14;border:2px solid #000}
  .s-implementacion-entrenamiento .s-implementacion-leyenda .s-implementacion-ln-curva{width:30px;height:5px;background:#1446a0;vertical-align:4px}
  .s-implementacion-entrenamiento .s-implementacion-panel{grid-column:9/13;display:flex;flex-direction:column;gap:16px}
  .s-implementacion-entrenamiento .s-implementacion-grado{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;column-gap:18px}
  .s-implementacion-entrenamiento .s-implementacion-grado label{grid-column:1/-1;font-weight:600;margin-bottom:4px}
  .s-implementacion-entrenamiento .s-implementacion-grado output{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:.9;letter-spacing:-.04em;min-width:1.3ch;font-variant-numeric:tabular-nums}
  .s-implementacion-entrenamiento .s-implementacion-errores{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px}
  .s-implementacion-entrenamiento .s-implementacion-errores .s-implementacion-etiqueta{grid-column:1/-1}
  .s-implementacion-entrenamiento .s-implementacion-errores .s-implementacion-cifra{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-implementacion-entrenamiento .s-implementacion-curvaerror{height:170px;border:0}
  @media (max-width:900px){.s-implementacion-entrenamiento .s-implementacion-fig,.s-implementacion-entrenamiento .s-implementacion-panel{grid-column:1/-1}}
  `,
  html:`
  <span class="ancla" data-parada="implementacion-entrenamiento"></span>
  <section class="s-implementacion s-implementacion-entrenamiento s-implementacion-concreto s-implementacion-pantalla" data-campo="astillero-concreto" aria-labelledby="implementacion-entrenamiento-titulo">
    <div class="s-implementacion-cab">
      <h2 id="implementacion-entrenamiento-titulo">Entrenamiento y ajuste del modelo</h2>
      <p>Entrenar es buscar la complejidad justa: manda el error con datos que el modelo nunca vio.</p>
    </div>
    <div class="s-implementacion-demo">
      <figure class="s-implementacion-fig">
        <ul class="s-implementacion-leyenda" aria-hidden="true">
          <li><i class="s-implementacion-pt-ent"></i>16 semanas para entrenar</li>
          <li><i class="s-implementacion-pt-val"></i>17 semanas para validar</li>
          <li><i class="s-implementacion-ln-curva"></i>Curva del modelo</li>
        </ul>
        <canvas class="s-implementacion-lienzo s-implementacion-ajuste" role="img" aria-label="Ventas semanales y la curva del polinomio ajustado por mínimos cuadrados. La descripción del ajuste actual está en el panel de resultados."></canvas>
        <figcaption>Ventas semanales de un producto durante un año, en miles de unidades. Datos sintéticos: temporada más ruido. El polinomio se ajusta por mínimos cuadrados solo con las semanas de entrenamiento.</figcaption>
      </figure>
      <div class="s-implementacion-panel">
        <div class="s-implementacion-grado">
          <label for="implementacion-grado">Grado del polinomio (complejidad)</label>
          <output id="implementacion-grado-valor" for="implementacion-grado">1</output>
          <input type="range" id="implementacion-grado" min="1" max="15" step="1" value="1">
        </div>
        <div class="s-implementacion-acciones"><button class="boton" type="button" data-recorrer>Recorrer de 1 a 15</button></div>
        <div class="s-implementacion-errores" aria-live="polite">
          <p class="s-implementacion-etiqueta">Error cuadrático medio (MSE)</p>
          <div class="s-implementacion-dato"><p>Entrenamiento</p><p class="s-implementacion-cifra" data-error="ent">0</p></div>
          <div class="s-implementacion-dato"><p>Validación</p><p class="s-implementacion-cifra" data-error="val">0</p></div>
        </div>
        <div class="s-implementacion-veredicto" data-estado="sub" aria-live="polite"><p class="s-implementacion-vt">Subajuste</p><p class="s-implementacion-vx"></p></div>
        <canvas class="s-implementacion-lienzo s-implementacion-curvaerror" role="img" aria-label="Error de entrenamiento y de validación según el grado, en escala logarítmica: el de entrenamiento baja siempre; el de validación baja hasta el grado ${VENTAS.mejor} y luego se dispara."></canvas>
      </div>
    </div>
  </section>`,
  iniciar(ctx){
    const { reducir, raiz } = ctx;
    const sec = raiz.querySelector(".s-implementacion-entrenamiento");
    if (!sec) return;
    const rango = sec.querySelector("#implementacion-grado"), salida = sec.querySelector("#implementacion-grado-valor");
    const vEnt = sec.querySelector('[data-error="ent"]'), vVal = sec.querySelector('[data-error="val"]');
    const ver = sec.querySelector(".s-implementacion-veredicto"), btn = sec.querySelector("[data-recorrer]");
    const N = 241, muestra = g => Array.from({ length:N }, (_, i) => evalPoli(VENTAS.ajustes[g].cf, i / (N - 1)));
    let grado = 1, curva = muestra(1), desde = curva, hasta = curva, t0 = 0, anim = 0, recorrido = 0;

    const L = lienzo(sec.querySelector(".s-implementacion-ajuste"), (c, w, h) => {
      const m = { l:60, r:18, t:38, b:44 }, pw = w - m.l - m.r, ph = h - m.t - m.b, Y0 = 15, Y1 = 80;
      const X = x => m.l + x * pw, Y = v => m.t + (1 - (v - Y0) / (Y1 - Y0)) * ph;
      c.fillStyle = "#000"; c.strokeStyle = "#000"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(m.l, m.t); c.lineTo(m.l, m.t + ph); c.lineTo(m.l + pw, m.t + ph); c.stroke();
      [20, 40, 60, 80].forEach(v => { c.fillRect(m.l - 8, Y(v) - 1, 8, 2); rotulo(c, v, m.l - 13, Y(v), { alinear:"right", base:"middle" }); });
      [1, 13, 26, 39, 52].forEach(s => { const x = X((s - 1) / 51); c.fillRect(x - 1, m.t + ph, 2, 8); rotulo(c, s === 1 ? "semana 1" : s, x, m.t + ph + 26, { alinear:s === 1 ? "left" : s === 52 ? "right" : "center" }); });
      c.save(); c.beginPath(); c.rect(m.l + 2, m.t - 6, pw, ph + 4); c.clip();
      c.strokeStyle = AZUL; c.lineWidth = 4; c.lineJoin = "round"; c.lineCap = "round"; c.beginPath();
      curva.forEach((v, i) => { const x = X(i / (N - 1)), y = Y(clamp(v, -400, 500)); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
      c.stroke(); c.restore();
      VENTAS.val.forEach(p => { const x = X(p.x), y = Y(p.y); c.fillStyle = NARANJA; c.fillRect(x - 7, y - 7, 14, 14); c.lineWidth = 2.5; c.strokeStyle = "#000"; c.strokeRect(x - 7, y - 7, 14, 14); });
      c.fillStyle = "#000"; VENTAS.ent.forEach(p => { c.beginPath(); c.arc(X(p.x), Y(p.y), 6.5, 0, 7); c.fill(); });
      rotulo(c, "miles de unidades", 12, 20, { tam:15 });
    });
    const LE = lienzo(sec.querySelector(".s-implementacion-curvaerror"), (c, w, h) => {
      const m = { l:72, r:12, t:40, b:30 }, pw = w - m.l - m.r, ph = h - m.t - m.b;
      const X = g => m.l + (g - 1) / 14 * pw, Y = v => m.t + (1 - (Math.log10(clamp(v, 0.1, 1e6)) + 1) / 7) * ph;
      const paso = pw / 28;
      VENTAS.zonas.forEach(z => {
        const x0 = X(z.a) - (z.a > 1 ? paso : 0) + 3, x1 = X(z.b) + (z.b < 15 ? paso : 0) - 3, y = 22;
        c.fillStyle = "#000"; c.fillRect(x0, y - 1.5, x1 - x0, 3); c.fillRect(x0, y - 7, 3, 14); c.fillRect(x1 - 3, y - 7, 3, 14);
        rotulo(c, z.estado === "sub" ? "subajuste" : z.estado === "bien" ? "bien" : "sobreajuste", (x0 + x1) / 2, y - 9, { tam:13, alinear:"center" });
      });
      c.fillStyle = "#000"; c.fillRect(m.l - 2, m.t, 2, ph); c.fillRect(m.l - 2, m.t + ph, pw + 2, 2);
      [[1, "1"], [100, "100"], [1e4, "10.000"], [1e6, "1.000.000"]].forEach(([v, t]) => { c.fillRect(m.l - 8, Y(v) - 1, 6, 2); rotulo(c, t, m.l - 11, Y(v), { tam:13, alinear:"right", base:"middle" }); });
      [1, 5, 10, 15].forEach(g => rotulo(c, g === 1 ? "grado 1" : g, X(g), h - 8, { tam:13, alinear:g === 1 ? "left" : g === 15 ? "right" : "center" }));
      c.fillStyle = AZUL; c.fillRect(X(grado) - 2, m.t - 4, 4, ph + 4);
      const serie = (clave, punteada) => {
        c.save(); c.strokeStyle = "#000"; c.lineWidth = 3; if (punteada) c.setLineDash([7, 5]);
        c.beginPath(); for (let g = 1; g <= 15; g++){ const x = X(g), y = Y(VENTAS.ajustes[g][clave]); if (g > 1) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); c.restore();
        for (let g = 1; g <= 15; g++){
          const x = X(g), y = Y(VENTAS.ajustes[g][clave]);
          if (punteada){ c.fillStyle = NARANJA; c.fillRect(x - 5, y - 5, 10, 10); c.lineWidth = 2; c.strokeStyle = "#000"; c.strokeRect(x - 5, y - 5, 10, 10); }
          else { c.fillStyle = "#000"; c.beginPath(); c.arc(x, y, 4.5, 0, 7); c.fill(); }
        }
      };
      serie("ent", false); serie("val", true);
    });
    function poner(g, animar){
      grado = g; rango.value = g; salida.textContent = g; rango.setAttribute("aria-valuetext", "grado " + g);
      const a = VENTAS.ajustes[g];
      vEnt.textContent = num(a.ent < 0.05 ? 0 : a.ent, 1); vVal.textContent = num(a.val, 1);
      ver.dataset.estado = a.estado; ver.querySelector(".s-implementacion-vt").textContent = NOMBRE_AJUSTE[a.estado]; ver.querySelector(".s-implementacion-vx").textContent = explicarAjuste(a);
      const nueva = muestra(g);
      if (animar && !reducir){ desde = curva.slice(); hasta = nueva; t0 = performance.now(); if (!anim) anim = requestAnimationFrame(cuadro); }
      else { curva = nueva; L.pintar(); }
      LE.pintar();
    }
    function cuadro(t){
      const k = Math.min(1, (t - t0) / 420), e = 1 - Math.pow(1 - k, 3);
      curva = desde.map((v, i) => v + (hasta[i] - v) * e); L.pintar();
      anim = k < 1 ? requestAnimationFrame(cuadro) : 0;
    }
    function detener(){ clearInterval(recorrido); recorrido = 0; btn.textContent = "Recorrer de 1 a 15"; }
    rango.addEventListener("input", () => { detener(); poner(+rango.value, true); });
    btn.addEventListener("click", () => {
      if (recorrido){ detener(); return; }
      let g = 1; poner(1, true); btn.textContent = "Detener";
      recorrido = setInterval(() => { g++; if (g > 15){ detener(); return; } poner(g, true); }, 560);
    });
    poner(1, false);
    trasFuentes(() => { L.pintar(); LE.pintar(); });
    if (reducir) return;
    const { gsap } = ctx;
    gsap.from(sec.querySelectorAll(".s-implementacion-panel > *"), { y:28, opacity:0, duration:.6, ease:"power3.out", stagger:.07,
      scrollTrigger:{ trigger:sec, start:"top 62%", toggleActions:"play none none reverse" } });
  }
});

/* ================================================================== 7. RUTA DE UNA PREDICCIÓN: nube o edge */
const CLIENTES = ["ERP", "App móvil", "Dashboard", "Proceso automatizado"];
const RUTAS = {
  nube:[ { n:"Red de ida", ms:40 }, { n:"API REST", ms:5 }, { n:"Orquestación", ms:3 }, { n:"Inferencia", ms:30 }, { n:"Red de vuelta", ms:40 } ],
  edge:[ { n:"Captura en el dispositivo", ms:1 }, { n:"Inferencia local", ms:15 }, { n:"Respuesta en el dispositivo", ms:1 } ]
};
const total = r => RUTAS[r].reduce((s, h) => s + h.ms, 0);
const DESPLIEGUE = [
  ["API REST", "El modelo se expone como un endpoint HTTP: los clientes envían datos y reciben predicciones. Frameworks: FastAPI, Flask, Django REST.", "api"],
  ["Contenedores", "Docker empaqueta el modelo con sus dependencias. Kubernetes orquesta múltiples instancias para escalar.", "contenedores"],
  ["Plataformas cloud", "AWS SageMaker, GCP Vertex AI y Azure ML ofrecen entrenamiento, despliegue y monitoreo integrados.", "nube"],
  ["Edge deployment", "Modelos ligeros en dispositivos IoT, móviles o cámaras: TensorFlow Lite, ONNX, CoreML.", "edge"],
  ["Integración al sistema", "El modelo se integra al flujo de trabajo que ya existe: ERP, app móvil, dashboard o proceso automatizado.", "clientes"]
];
function svgRuta(){
  const yC = i => 22 + i * 92, yK = j => 70 + j * 98, YA = 200;
  const clientes = CLIENTES.map((n, i) => `<g class="s-implementacion-ruta-cliente" data-i="${i}"><rect x="10" y="${yC(i)}" width="232" height="64"/><text x="28" y="${yC(i) + 39}">${n}</text></g>`).join("");
  const cables = CLIENTES.map((_, i) => `<path class="s-implementacion-ruta-cable" id="implementacion-ruta-c${i}" d="M242 ${yC(i) + 32} C 362 ${yC(i) + 32}, 362 ${YA}, 482 ${YA}"/>`).join("");
  const ramas = [0, 1, 2].map(j => `<path class="s-implementacion-ruta-cable" id="implementacion-ruta-k${j}" d="M692 ${YA} C 742 ${YA}, 742 ${yK(j) + 44}, 800 ${yK(j) + 44} L 1036 ${yK(j) + 44}"/>`).join("");
  const contenedores = [0, 1, 2].map(j => {
    const y = yK(j); let ondas = "";
    for (let x = 818; x <= 1010; x += 16) ondas += `<line x1="${x}" y1="${y + 10}" x2="${x}" y2="${y + 78}"/>`;
    return `<g class="s-implementacion-ruta-contenedor" data-j="${j}">
      <rect class="s-implementacion-ruta-caja" x="800" y="${y}" width="346" height="88"/>
      <g class="s-implementacion-ruta-ondas">${ondas}</g>
      <rect class="s-implementacion-ruta-esquina" x="800" y="${y}" width="12" height="12"/><rect class="s-implementacion-ruta-esquina" x="1134" y="${y}" width="12" height="12"/>
      <rect class="s-implementacion-ruta-esquina" x="800" y="${y + 76}" width="12" height="12"/><rect class="s-implementacion-ruta-esquina" x="1134" y="${y + 76}" width="12" height="12"/>
      <rect class="s-implementacion-ruta-modelo" x="1036" y="${y + 18}" width="88" height="52"/>
      <text class="s-implementacion-ruta-tm" x="1080" y="${y + 50}">modelo</text>
    </g>`;
  }).join("");
  return `<svg class="s-implementacion-ruta-svg" viewBox="0 0 1200 400" role="img" aria-labelledby="implementacion-ruta-svg-t">
    <title id="implementacion-ruta-svg-t">Diagrama de la ruta de una predicción: sistemas cliente, red, API REST, contenedores con el modelo en Kubernetes y, en modo edge, el modelo dentro del dispositivo</title>
    <g class="s-implementacion-ruta-grupo" data-grupo="clientes">${cables}${clientes}<text class="s-implementacion-ruta-red" x="362" y="30">Internet</text></g>
    <g class="s-implementacion-ruta-grupo" data-grupo="nube">
      ${ramas}
      <g class="s-implementacion-ruta-api"><rect x="482" y="${YA - 72}" width="210" height="144"/><text class="s-implementacion-ruta-tt" x="502" y="${YA - 26}">API REST</text><text x="502" y="${YA + 8}">FastAPI</text><text x="502" y="${YA + 40}">POST /predecir</text></g>
      <rect class="s-implementacion-ruta-cluster" x="768" y="10" width="414" height="382"/>
      <text class="s-implementacion-ruta-tt" x="790" y="52">Kubernetes: 3 réplicas</text>
      ${contenedores}
      <text x="790" y="380">AWS SageMaker · GCP Vertex AI · Azure ML</text>
    </g>
    <g class="s-implementacion-ruta-grupo" data-grupo="edge" opacity="0">
      <rect class="s-implementacion-ruta-dispositivo" x="10" y="60" width="470" height="270"/>
      <text class="s-implementacion-ruta-tt" x="32" y="104">Dispositivo en el borde</text>
      <text x="32" y="136">Cámara, celular o sensor IoT</text>
      <g class="s-implementacion-ruta-camara"><rect x="32" y="170" width="132" height="100"/><circle cx="98" cy="220" r="30"/><circle cx="98" cy="220" r="12"/></g>
      <path class="s-implementacion-ruta-cable" id="implementacion-ruta-e0" d="M164 220 L 262 220"/>
      <rect class="s-implementacion-ruta-modelo s-implementacion-ruta-modelo-e" x="262" y="170" width="196" height="100"/>
      <text class="s-implementacion-ruta-tm" x="360" y="216">modelo ligero</text>
      <text class="s-implementacion-ruta-tm s-implementacion-ruta-tm2" x="360" y="246">TF Lite · ONNX · CoreML</text>
      <rect class="s-implementacion-ruta-fondo" x="812" y="168" width="326" height="64"/>
      <text class="s-implementacion-ruta-sin" x="975" y="212">Sin viaje a la nube</text>
    </g>
    <rect class="s-implementacion-ruta-paquete" width="20" height="20" x="0" y="0" visibility="hidden"/>
  </svg>`;
}
Clase.seccion({
  id:"implementacion-ruta", orden:76,
  indice:{ texto:"Despliegue y mejora continua", ir:"implementacion-ruta", nota:"Nube o edge, drift y reentrenamiento" },
  css:`
  .s-implementacion-ruta .s-implementacion-cab h2{grid-column:1/8}
  .s-implementacion-ruta .s-implementacion-cab > p{grid-column:8/13;font-size:var(--step-body);line-height:1.4}
  .s-implementacion-ruta .s-implementacion-mando{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 28px;margin-top:22px}
  .s-implementacion-ruta .s-implementacion-reloj{display:flex;align-items:baseline;gap:12px}
  .s-implementacion-ruta .s-implementacion-reloj .s-implementacion-cifra{min-width:4.2ch;text-align:right}
  .s-implementacion-ruta .s-implementacion-reloj p + p{font-weight:600;line-height:1.25}
  .s-implementacion-ruta .s-implementacion-ruta-svg{width:100%;height:auto;margin-top:20px;overflow:visible}
  .s-implementacion-ruta .s-implementacion-ruta-fondo{fill:#1446a0}
  .s-implementacion-ruta svg text{font-family:var(--f-texto);font-size:19px;font-weight:600;fill:#fff}
  .s-implementacion-ruta svg .s-implementacion-ruta-tt{font-family:var(--f-display);font-size:26px;font-weight:700;letter-spacing:-.02em}
  .s-implementacion-ruta svg .s-implementacion-ruta-red{text-anchor:middle}
  .s-implementacion-ruta .s-implementacion-ruta-cliente rect,.s-implementacion-ruta .s-implementacion-ruta-api rect,.s-implementacion-ruta .s-implementacion-ruta-dispositivo,.s-implementacion-ruta .s-implementacion-ruta-camara rect{fill:#1446a0;stroke:#fff;stroke-width:4}
  .s-implementacion-ruta .s-implementacion-ruta-camara circle{fill:none;stroke:#fff;stroke-width:4}
  .s-implementacion-ruta .s-implementacion-ruta-cable{fill:none;stroke:#fff;stroke-width:4}
  .s-implementacion-ruta .s-implementacion-ruta-cluster{fill:none;stroke:#fff;stroke-width:4;stroke-dasharray:14 10}
  .s-implementacion-ruta .s-implementacion-ruta-caja{fill:#1446a0;stroke:#fff;stroke-width:4}
  .s-implementacion-ruta .s-implementacion-ruta-ondas line{stroke:#fff;stroke-width:3}
  .s-implementacion-ruta .s-implementacion-ruta-esquina{fill:#fff}
  .s-implementacion-ruta .s-implementacion-ruta-modelo{fill:#ff5b14;stroke:#000;stroke-width:3}
  .s-implementacion-ruta svg .s-implementacion-ruta-tm{fill:#000;text-anchor:middle;font-size:17px}
  .s-implementacion-ruta svg .s-implementacion-ruta-tm2{font-weight:400;font-size:15px}
  .s-implementacion-ruta svg .s-implementacion-ruta-sin{text-anchor:middle;font-family:var(--f-display);font-size:34px;font-weight:700}
  .s-implementacion-ruta .s-implementacion-ruta-paquete{fill:#ff5b14;stroke:#000;stroke-width:3}
  .s-implementacion-ruta .s-implementacion-ruta-paquete.es-respuesta{fill:#fff}
  .s-implementacion-ruta .es-luz rect.s-implementacion-ruta-caja,.s-implementacion-ruta .es-luz > rect,.s-implementacion-ruta rect.es-luz{fill:#fff}
  .s-implementacion-ruta .s-implementacion-ruta-cliente.es-luz text{fill:#1446a0}
  .s-implementacion-ruta .s-implementacion-ruta-camara.es-luz circle{stroke:#1446a0}
  .s-implementacion-ruta .s-implementacion-ruta-api.es-luz text{fill:#1446a0}
  .s-implementacion-ruta rect.s-implementacion-ruta-modelo.es-luz{fill:#fff}
  .s-implementacion-ruta [data-resalta].es-resaltado rect,.s-implementacion-ruta [data-resalta].es-resaltado path{stroke:#ff5b14}
  .s-implementacion-ruta .s-implementacion-saltos{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
  .s-implementacion-ruta .s-implementacion-saltos li{padding:10px 14px 9px;border:3px solid #fff;font-weight:600;line-height:1.2;transition:background-color .2s,color .2s}
  .s-implementacion-ruta .s-implementacion-saltos li b{font-family:var(--f-display);font-weight:700;margin-left:8px;letter-spacing:-.02em}
  .s-implementacion-ruta .s-implementacion-saltos li.es-actual{background:#ff5b14;color:#000;border-color:#ff5b14}
  .s-implementacion-ruta .s-implementacion-saltos li.s-implementacion-total{background:#fff;color:#1446a0;border-color:#fff}
  .s-implementacion-ruta .s-implementacion-cinco{list-style:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:28px var(--gap);margin-top:48px}
  .s-implementacion-ruta .s-implementacion-cinco h3{margin-bottom:10px;padding-top:14px;position:relative}
  .s-implementacion-ruta .s-implementacion-cinco h3::before{content:"";position:absolute;left:0;top:0;width:48px;height:6px;background:#ff5b14}
  .s-implementacion-ruta .s-implementacion-cinco p{line-height:1.45}
  @media (max-width:1100px){.s-implementacion-ruta .s-implementacion-cinco{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `,
  html:`
  <span class="ancla" data-parada="implementacion-ruta"></span>
  <section class="s-implementacion s-implementacion-ruta s-implementacion-azul s-implementacion-pantalla" data-campo="astillero-azul" aria-labelledby="implementacion-ruta-titulo">
    <div class="s-implementacion-cab">
      <h2 id="implementacion-ruta-titulo">La ruta de una predicción</h2>
      <p>Desplegar es llevar el modelo del portátil a producción: así viaja una predicción.</p>
    </div>
    <div class="s-implementacion-mando">
      <div class="s-implementacion-grupo">
        <p class="s-implementacion-etiqueta" id="implementacion-ruta-modo-t">Dónde corre el modelo</p>
        <div class="s-implementacion-opciones" role="radiogroup" aria-labelledby="implementacion-ruta-modo-t">
          <label><input type="radio" name="implementacion-ruta-modo" value="nube" checked><span class="boton">En la nube</span></label>
          <label><input type="radio" name="implementacion-ruta-modo" value="edge"><span class="boton">En el borde (edge)</span></label>
        </div>
      </div>
      <div class="s-implementacion-reloj"><p class="s-implementacion-cifra" data-reloj>0 ms</p><p>ida y vuelta</p></div>
      <div class="s-implementacion-acciones">
        <button class="boton" type="button" data-enviar>Enviar una petición</button>
        <button class="boton s-implementacion-sec" type="button" data-pausa aria-pressed="false">Pausar el flujo</button>
      </div>
    </div>
    ${svgRuta()}
    <ol class="s-implementacion-saltos" aria-label="Saltos de la ruta y su latencia ilustrativa"></ol>
    <p class="s-implementacion-nota" style="margin-top:12px;max-width:80ch">Animación en cámara lenta. Latencias ilustrativas: el tiempo real depende de la red, del tamaño del modelo y del hardware.</p>
    <p class="solo-lector" aria-live="polite" data-anuncio></p>
    <ul class="s-implementacion-cinco">
      ${DESPLIEGUE.map(([t, d, r]) => `<li data-para="${r}"><h3>${t}</h3><p>${d}</p></li>`).join("")}
    </ul>
  </section>`,
  iniciar(ctx){
    const { gsap, reducir, raiz } = ctx;
    const sec = raiz.querySelector(".s-implementacion-ruta");
    if (!sec) return;
    const svg = sec.querySelector("svg"), paquete = svg.querySelector(".s-implementacion-ruta-paquete");
    const grupos = {}; svg.querySelectorAll("[data-grupo]").forEach(g => { grupos[g.dataset.grupo] = g; });
    const reloj = sec.querySelector("[data-reloj]"), saltosEl = sec.querySelector(".s-implementacion-saltos"), anuncio = sec.querySelector("[data-anuncio]");
    const btnPausa = sec.querySelector("[data-pausa]");
    const camino = id => svg.querySelector("#" + id);
    let modo = "nube", cliente = 0, replica = 0, enCurso = null, pausado = false, enPantalla = false, espera = 0, ultimo = 0, raf = 0;
    const CAMARA = 24; /* 1 ms real = 24 ms de animación */
    function pintarSaltos(actual){
      saltosEl.innerHTML = RUTAS[modo].map((h, i) => `<li class="${i === actual ? "es-actual" : ""}">${h.n}<b>${h.ms} ms</b></li>`).join("") +
        `<li class="s-implementacion-total">Total<b>${total(modo)} ms</b></li>`;
    }
    function luz(el, on){ if (el) el.classList.toggle("es-luz", on); }
    /* Una petición = lista de tramos { camino, inverso, ms, salto, luz } */
    function plan(){
      if (modo === "edge") return [
        { ms:1, salto:0, luz:svg.querySelector(".s-implementacion-ruta-camara") },
        { c:"implementacion-ruta-e0", ms:1, salto:0 },
        { ms:15, salto:1, luz:svg.querySelector(".s-implementacion-ruta-modelo-e"), quieto:true },
        { c:"implementacion-ruta-e0", inv:true, ms:1, salto:2, respuesta:true }
      ];
      const k = cliente, j = replica, modeloJ = svg.querySelectorAll(".s-implementacion-ruta-contenedor .s-implementacion-ruta-modelo")[j];
      return [
        { ms:0.6, salto:0, luz:svg.querySelector(`.s-implementacion-ruta-cliente[data-i="${k}"]`), quieto:true },
        { c:"implementacion-ruta-c" + k, ms:40, salto:0 },
        { ms:5, salto:1, luz:svg.querySelector(".s-implementacion-ruta-api"), quieto:true },
        { c:"implementacion-ruta-k" + j, ms:3, salto:2 },
        { ms:30, salto:3, luz:modeloJ, quieto:true },
        { c:"implementacion-ruta-k" + j, inv:true, ms:3, salto:4, respuesta:true },
        { c:"implementacion-ruta-c" + k, inv:true, ms:37, salto:4, respuesta:true, fin:svg.querySelector(`.s-implementacion-ruta-cliente[data-i="${k}"]`) }
      ];
    }
    function enviar(){
      if (enCurso) return;
      const tramos = plan();
      enCurso = { tramos, i:0, t:0, ms:0, total:tramos.reduce((s, x) => s + x.ms, 0) };
      paquete.classList.remove("es-respuesta"); paquete.setAttribute("visibility", "hidden");
      if (!raf){ ultimo = performance.now(); raf = requestAnimationFrame(bucle); }
    }
    function terminar(){
      const tr = enCurso.tramos; tr.forEach(x => { luz(x.luz, false); luz(x.fin, false); });
      paquete.setAttribute("visibility", "hidden");
      reloj.textContent = num(total(modo)) + " ms"; pintarSaltos(-1);
      anuncio.textContent = (modo === "nube" ? `Respuesta entregada a ${CLIENTES[cliente]}` : "Respuesta entregada en el dispositivo") + `: ${total(modo)} ms de ida y vuelta (valor ilustrativo).`;
      if (modo === "nube"){ cliente = (cliente + 1) % CLIENTES.length; replica = (replica + 1) % 3; }
      enCurso = null; espera = modo === "nube" ? 1.4 : 1.1;
    }
    function bucle(ahora){
      const dt = Math.min(0.06, (ahora - ultimo) / 1000); ultimo = ahora;
      if (enCurso){
        const e = enCurso, x = e.tramos[e.i], dur = Math.max(0.28, x.ms * CAMARA / 1000);
        e.t += dt; const k = Math.min(1, e.t / dur);
        pintarSaltos(x.salto); luz(x.luz, true);
        if (x.c){
          const p = camino(x.c), L = p.getTotalLength(), pt = p.getPointAtLength((x.inv ? 1 - k : k) * L);
          paquete.setAttribute("x", (pt.x - 10).toFixed(1)); paquete.setAttribute("y", (pt.y - 10).toFixed(1));
          paquete.classList.toggle("es-respuesta", !!x.respuesta); paquete.setAttribute("visibility", "visible");
        }
        reloj.textContent = num(e.ms + x.ms * k) + " ms";
        if (k >= 1){ luz(x.luz, false); e.ms += x.ms; e.i++; e.t = 0; if (x.fin) luz(x.fin, true); if (e.i >= e.tramos.length) terminar(); }
      } else if (!pausado && enPantalla){
        espera -= dt; if (espera <= 0) enviar();
      }
      raf = (enCurso || (!pausado && enPantalla)) ? requestAnimationFrame(bucle) : 0;
    }
    function despertar(){ if (!raf && !reducir){ ultimo = performance.now(); raf = requestAnimationFrame(bucle); } }
    function cambiarModo(m){
      if (enCurso){ enCurso.tramos.forEach(x => { luz(x.luz, false); luz(x.fin, false); }); enCurso = null; paquete.setAttribute("visibility", "hidden"); }
      modo = m; espera = 0.4; pintarSaltos(-1); reloj.textContent = reducir ? num(total(m)) + " ms" : "0 ms";
      const op = m === "edge" ? { clientes:0, nube:0.18, edge:1 } : { clientes:1, nube:1, edge:0 };
      Object.entries(op).forEach(([g, v]) => { if (reducir) grupos[g].setAttribute("opacity", v); else gsap.to(grupos[g], { attr:{ opacity:v }, duration:.5, ease:"power2.out" }); });
      anuncio.textContent = m === "edge" ? `Modelo en el borde: la predicción se hace en el dispositivo, unos ${total("edge")} ms.` : `Modelo en la nube: la petición viaja por la red hasta la API, unos ${total("nube")} ms de ida y vuelta.`;
      despertar();
    }
    sec.querySelectorAll('input[name="implementacion-ruta-modo"]').forEach(r => r.addEventListener("change", () => { if (r.checked) cambiarModo(r.value); }));
    sec.querySelector("[data-enviar]").addEventListener("click", () => { if (reducir){ reloj.textContent = num(total(modo)) + " ms"; anuncio.textContent = `Ida y vuelta: ${total(modo)} ms (valor ilustrativo).`; return; } enviar(); despertar(); });
    btnPausa.addEventListener("click", () => {
      pausado = !pausado; btnPausa.setAttribute("aria-pressed", pausado ? "true" : "false");
      btnPausa.textContent = pausado ? "Reanudar el flujo" : "Pausar el flujo"; despertar();
    });
    /* Resaltar en el diagrama la pieza de la que habla cada texto */
    const RESALTA = { api:".s-implementacion-ruta-api", contenedores:".s-implementacion-ruta-contenedor", nube:".s-implementacion-ruta-cluster", edge:".s-implementacion-ruta-dispositivo", clientes:".s-implementacion-ruta-cliente" };
    sec.querySelectorAll(".s-implementacion-cinco li").forEach(li => {
      const sel = RESALTA[li.dataset.para];
      const marcar = on => svg.querySelectorAll(sel).forEach(el => { el.setAttribute("data-resalta", ""); el.classList.toggle("es-resaltado", on); });
      li.addEventListener("mouseenter", () => marcar(true)); li.addEventListener("mouseleave", () => marcar(false));
    });
    pintarSaltos(-1);
    if (reducir){ reloj.textContent = num(total(modo)) + " ms"; return; }
    reloj.textContent = "0 ms";
    alVer(svg, v => { enPantalla = v; if (v){ espera = Math.min(espera, 0.6); despertar(); } });
    /* Firma: los contenedores se apilan como en un puerto y el modelo entra en cada uno */
    gsap.timeline({ scrollTrigger:{ trigger:svg, start:"top 80%", toggleActions:"play none none reverse" } })
      .from(svg.querySelectorAll(".s-implementacion-ruta-contenedor"), { y:-150, opacity:0, duration:.75, ease:"power4.out", stagger:{ each:.16, from:"end" } }, 0)
      .from(svg.querySelectorAll(".s-implementacion-ruta-contenedor .s-implementacion-ruta-modelo, .s-implementacion-ruta-contenedor .s-implementacion-ruta-tm"), { x:90, opacity:0, duration:.5, ease:"power3.out", stagger:.12 }, .55)
      .from(svg.querySelectorAll(".s-implementacion-ruta-cliente, .s-implementacion-ruta-api"), { x:-30, opacity:0, duration:.5, ease:"power3.out", stagger:.06 }, .1);
    gsap.from(sec.querySelectorAll(".s-implementacion-cinco li"), { y:30, opacity:0, duration:.6, ease:"power3.out", stagger:.08,
      scrollTrigger:{ trigger:sec.querySelector(".s-implementacion-cinco"), start:"top 88%", toggleActions:"play none none reverse" } });
  }
});

/* ================================================================== 8. MEJORA CONTINUA: drift en vivo */
/* Simulación sintética: un modelo de detección de fraude aprendió una frontera de valor de compra.
   El valor típico sube 4 % al mes (inflación, clientes nuevos). Compras legítimas ~ N(mu, 40);
   fraude (10 %) ~ N(mu + 95, 40). Exactitud (accuracy) = acierto esperado con la frontera aprendida.
   PSI (índice de estabilidad poblacional) entre la distribución de entrenamiento y la del mes. */
const DRIFT = (() => {
  const S = 40, DELTA = 95, PF = 0.1, UMBRAL = 90, BINS = 14, LO = 0, HI = 420;
  const Phi = z => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
  const mu = m => 120 * Math.pow(1.04, m);
  const frontera = u => u + DELTA / 2 + (S * S / DELTA) * Math.log((1 - PF) / PF);
  const precision = (T, u) => 100 * ((1 - PF) * Phi((T - u) / S) + PF * (1 - Phi((T - (u + DELTA)) / S)));
  function histograma(u){
    const h = [];
    for (let i = 0; i < BINS; i++){ const a = LO + i * (HI - LO) / BINS, b = a + (HI - LO) / BINS; h.push((1 - PF) * (Phi((b - u) / S) - Phi((a - u) / S)) + PF * (Phi((b - u - DELTA) / S) - Phi((a - u - DELTA) / S))); }
    h[0] += (1 - PF) * Phi((LO - u) / S) + PF * Phi((LO - u - DELTA) / S);
    h[BINS - 1] += (1 - PF) * (1 - Phi((HI - u) / S)) + PF * (1 - Phi((HI - u - DELTA) / S));
    return h;
  }
  const psi = (ref, act) => ref.reduce((s, e, i) => { const a = Math.max(act[i], 1e-4), r = Math.max(e, 1e-4); return s + (a - r) * Math.log(a / r); }, 0);
  const r = rng(23), ruido = Array.from({ length:13 }, () => gauss(r, 0, 0.3));
  const hashes = (() => { const rh = rng(41); return Array.from({ length:13 }, () => Math.floor(rh() * 0xfffffff).toString(16).slice(0, 7).padEnd(7, "a")); })();
  const MESES = ["inicio", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return { S, DELTA, PF, UMBRAL, BINS, LO, HI, mu, frontera, precision, histograma, psi, ruido, hashes, MESES };
})();
Clase.seccion({
  id:"implementacion-mejora", orden:77,
  css:`
  .s-implementacion-mejora .s-implementacion-cab h2{grid-column:1/6}
  .s-implementacion-mejora .s-implementacion-cab blockquote{grid-column:6/13;font-family:var(--f-display);font-weight:700;font-size:clamp(1.375rem,1rem + 1vw,2.125rem);line-height:1.08;letter-spacing:-.025em}
  .s-implementacion-mejora .s-implementacion-fila{display:flex;justify-content:space-between;align-items:flex-end;gap:16px 40px;margin-top:22px}
  .s-implementacion-mejora .s-implementacion-contexto{max-width:72ch}
  .s-implementacion-mejora .s-implementacion-mando{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 28px;margin-top:18px}
  .s-implementacion-mejora .s-implementacion-tablero{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);row-gap:16px;margin-top:20px}
  .s-implementacion-mejora .s-implementacion-tablero figure{grid-column:span 6;display:flex;flex-direction:column;gap:8px}
  .s-implementacion-mejora .s-implementacion-tablero figcaption{font-weight:600}
  .s-implementacion-mejora .s-implementacion-tablero figcaption i{display:inline-block;width:16px;height:16px;vertical-align:-2px;margin:0 8px 0 12px}
  .s-implementacion-mejora .s-implementacion-barra{background:#ff5b14}
  .s-implementacion-mejora .s-implementacion-contorno{border:3px solid #fff}
  .s-implementacion-mejora .s-implementacion-punto{background:#fff;border-radius:50%}
  .s-implementacion-mejora .s-implementacion-alerta{background:#ff5b14;border:3px solid #fff}
  .s-implementacion-mejora .s-implementacion-lienzo{height:clamp(210px,calc(100svh - 500px),360px)}
  .s-implementacion-mejora .s-implementacion-veredicto{background:#fff;color:#000;margin-top:16px}
  .s-implementacion-mejora .s-implementacion-veredicto[data-estado="alerta"]{background:#ff5b14;color:#000}
  .s-implementacion-mejora .s-implementacion-veredicto[data-estado="aviso"]{background:#d7d5cf;color:#000}
  .s-implementacion-mejora .s-implementacion-cuentas{display:flex;gap:32px;flex:none}
  .s-implementacion-mejora .s-implementacion-cuentas .s-implementacion-cifra{font-size:var(--step-head)}
  .s-implementacion-mejora .s-implementacion-psi{margin-top:10px;max-width:86ch}
  .s-implementacion-mejora .s-implementacion-registro{margin-top:36px}
  .s-implementacion-mejora .s-implementacion-registro h3{margin-bottom:6px}
  .s-implementacion-mejora .s-implementacion-registro > p{max-width:80ch;margin-bottom:14px}
  .s-implementacion-mejora table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
  .s-implementacion-mejora th{text-align:left;font-weight:600;padding:10px 12px;background:#d7d5cf;color:#000}
  .s-implementacion-mejora td{padding:10px 12px;border-bottom:2px solid #d7d5cf}
  .s-implementacion-mejora td code{font-family:inherit;font-weight:600;color:#ff5b14}
  .s-implementacion-mejora tr.es-nueva td{background:#1446a0}
  @media (max-width:900px){.s-implementacion-mejora .s-implementacion-tablero figure{grid-column:1/-1}.s-implementacion-mejora .s-implementacion-cab blockquote{grid-column:1/-1}.s-implementacion-mejora .s-implementacion-fila{flex-direction:column;align-items:flex-start}}
  `,
  html:`
  <span class="ancla" data-parada="implementacion-mejora"></span>
  <section class="s-implementacion s-implementacion-mejora s-implementacion-negro s-implementacion-pantalla" data-campo="astillero-negro" aria-labelledby="implementacion-mejora-titulo">
    <div class="s-implementacion-cab">
      <h2 id="implementacion-mejora-titulo">Mejora continua del sistema de IA</h2>
      <blockquote><p>El mundo cambia, los datos cambian y el modelo debe adaptarse.</p></blockquote>
    </div>
    <div class="s-implementacion-fila">
      <p class="s-implementacion-contexto">Un detector de fraude, mientras las compras suben de valor mes a mes. Datos sintéticos.</p>
      <div class="s-implementacion-cuentas">
        <div class="s-implementacion-dato"><p>Meses bajo el umbral</p><p class="s-implementacion-cifra" data-bajo>0</p></div>
        <div class="s-implementacion-dato"><p>Reentrenamientos</p><p class="s-implementacion-cifra" data-reent>0</p></div>
      </div>
    </div>
    <div class="s-implementacion-mando">
      <div class="s-implementacion-acciones">
        <button class="boton" type="button" data-avanzar>Avanzar un mes</button>
        <button class="boton" type="button" data-reproducir>Reproducir</button>
        <button class="boton s-implementacion-sec" type="button" data-reentrenar>Reentrenar</button>
        <button class="boton s-implementacion-sec" type="button" data-reiniciar>Reiniciar</button>
      </div>
      <div class="s-implementacion-grupo">
        <p class="s-implementacion-etiqueta" id="implementacion-mejora-modo-t">Re-entrenamiento</p>
        <div class="s-implementacion-opciones" role="radiogroup" aria-labelledby="implementacion-mejora-modo-t">
          <label><input type="radio" name="implementacion-mejora-modo" value="manual" checked><span class="boton">Manual</span></label>
          <label><input type="radio" name="implementacion-mejora-modo" value="programado"><span class="boton">Cada 3 meses</span></label>
          <label><input type="radio" name="implementacion-mejora-modo" value="umbral"><span class="boton">Por umbral</span></label>
        </div>
      </div>
    </div>
    <div class="s-implementacion-tablero">
      <figure>
        <figcaption>Valor de compra: <i class="s-implementacion-barra"></i><span data-mes-actual>inicio</span> <i class="s-implementacion-contorno"></i><span data-mes-ent>entrenamiento</span></figcaption>
        <canvas class="s-implementacion-lienzo s-implementacion-histo" role="img" aria-label="Histograma del valor de las compras del mes actual comparado con el de los datos de entrenamiento, con la frontera de decisión del modelo."></canvas>
      </figure>
      <figure>
        <figcaption>Exactitud mes a mes: <i class="s-implementacion-punto"></i>sobre el umbral <i class="s-implementacion-alerta"></i>bajo el umbral</figcaption>
        <canvas class="s-implementacion-lienzo s-implementacion-precision" role="img" aria-label="Exactitud del modelo por mes, con la línea del umbral de alerta en 90 por ciento y las marcas de reentrenamiento."></canvas>
      </figure>
    </div>
    <div class="s-implementacion-veredicto" data-estado="ok" aria-live="polite"><p class="s-implementacion-vt"></p><p class="s-implementacion-vx"></p></div>
    <p class="s-implementacion-nota s-implementacion-psi">PSI: menos de 0,10 estable; más de 0,25, drift fuerte.</p>
    <div class="s-implementacion-registro">
      <h3>Registro de versiones</h3>
      <p>Lo que MLflow y DVC guardan en cada reentrenamiento.</p>
      <table>
        <thead><tr><th scope="col">Versión</th><th scope="col">Entrenada con datos de</th><th scope="col">Datos (DVC)</th><th scope="col">Exactitud en validación</th><th scope="col">Motivo</th></tr></thead>
        <tbody data-registro></tbody>
      </table>
    </div>
  </section>`,
  iniciar(ctx){
    const { reducir, raiz } = ctx;
    const sec = raiz.querySelector(".s-implementacion-mejora");
    if (!sec) return;
    const D = DRIFT;
    const ver = sec.querySelector(".s-implementacion-veredicto"), tbody = sec.querySelector("[data-registro]");
    const bBajo = sec.querySelector("[data-bajo]"), bReent = sec.querySelector("[data-reent]");
    const btnRep = sec.querySelector("[data-reproducir]"), btnReent = sec.querySelector("[data-reentrenar]"), btnAv = sec.querySelector("[data-avanzar]");
    const mesActual = sec.querySelector("[data-mes-actual]"), mesEnt = sec.querySelector("[data-mes-ent]");
    let E, reloj = 0;
    function nuevo(modo){
      const T = D.frontera(D.mu(0)), acc = D.precision(T, D.mu(0)) + D.ruido[0];
      E = { modo, mes:0, mEnt:0, T, bajo:0, reent:0, historia:[{ mes:0, acc, psi:0, reent:false }],
        versiones:[{ v:1, mes:0, hash:D.hashes[0], acc, motivo:"Entrenamiento inicial" }] };
    }
    function reentrenar(motivo){
      const u = D.mu(E.mes);
      E.mEnt = E.mes; E.T = D.frontera(u); E.reent++;
      E.historia[E.mes].reent = true;
      E.versiones.push({ v:E.versiones.length + 1, mes:E.mes, hash:D.hashes[E.mes], acc:D.precision(E.T, u) + D.ruido[(E.mes + 5) % 13] * 0.5, motivo });
    }
    function avanzar(){
      if (E.mes >= 12) return false;
      E.mes++;
      const u = D.mu(E.mes), acc = D.precision(E.T, u) + D.ruido[E.mes], psi = D.psi(D.histograma(D.mu(E.mEnt)), D.histograma(u));
      E.historia.push({ mes:E.mes, acc, psi, reent:false });
      if (acc < D.UMBRAL) E.bajo++;
      if (E.mes < 12){
        if (E.modo === "programado" && E.mes % 3 === 0) reentrenar("Programado: cada 3 meses");
        else if (E.modo === "umbral" && acc < D.UMBRAL) reentrenar("Por umbral: la exactitud bajó de " + D.UMBRAL + " %");
      }
      return true;
    }
    const LH = lienzo(sec.querySelector(".s-implementacion-histo"), (c, w, h) => {
      const m = { l:20, r:16, t:40, b:44 }, pw = w - m.l - m.r, ph = h - m.t - m.b, MAX = 0.36;
      const X = v => m.l + (v - D.LO) / (D.HI - D.LO) * pw, Y = p => m.t + ph - p / MAX * ph, bw = pw / D.BINS;
      const actual = D.histograma(D.mu(E.mes)), ref = D.histograma(D.mu(E.mEnt));
      c.fillStyle = NARANJA; actual.forEach((p, i) => { c.fillRect(m.l + i * bw + 3, Y(p), bw - 6, m.t + ph - Y(p)); });
      c.strokeStyle = "#fff"; c.lineWidth = 3; c.lineJoin = "miter"; c.beginPath();
      ref.forEach((p, i) => { const x0 = m.l + i * bw, x1 = x0 + bw, y = Y(p); if (i) c.lineTo(x0, y); else c.moveTo(x0, m.t + ph); c.lineTo(x0, y); c.lineTo(x1, y); }); c.lineTo(m.l + pw, m.t + ph); c.stroke();
      c.fillStyle = "#fff"; c.fillRect(m.l, m.t + ph, pw, 2);
      [0, 100, 200, 300, 400].forEach(v => { c.fillRect(X(v) - 1, m.t + ph, 2, 8); rotulo(c, v === 0 ? "$0" : cop(v * 1000), X(v), m.t + ph + 26, { color:"#fff", tam:14, alinear:v === 0 ? "left" : v === 400 ? "right" : "center" }); });
      const xT = X(E.T); c.fillStyle = CONCRETO; c.fillRect(xT - 2, m.t - 8, 4, ph + 8);
      rotulo(c, "frontera del modelo: " + cop(E.T * 1000), xT + (xT > w * 0.6 ? -8 : 8), m.t - 14, { color:CONCRETO, tam:14, alinear:xT > w * 0.6 ? "right" : "left" });
      rotulo(c, "sospechosas", xT + 8, m.t + 18, { color:CONCRETO, tam:14 });
    });
    const LP = lienzo(sec.querySelector(".s-implementacion-precision"), (c, w, h) => {
      const m = { l:56, r:18, t:40, b:44 }, pw = w - m.l - m.r, ph = h - m.t - m.b, Y0 = 60, Y1 = 100;
      const X = mes => m.l + mes / 12 * pw, Y = v => m.t + (1 - (clamp(v, Y0, Y1) - Y0) / (Y1 - Y0)) * ph;
      c.fillStyle = "#fff"; c.fillRect(m.l - 2, m.t, 2, ph + 2); c.fillRect(m.l - 2, m.t + ph, pw + 2, 2);
      [60, 70, 80, 90, 100].forEach(v => { c.fillRect(m.l - 8, Y(v) - 1, 6, 2); rotulo(c, v + " %", m.l - 12, Y(v), { color:"#fff", tam:14, alinear:"right", base:"middle" }); });
      ["inicio", "mar", "jun", "sep", "dic"].forEach((t, i) => { const x = X(i * 3); c.fillRect(x - 1, m.t + ph, 2, 8); rotulo(c, t, x, m.t + ph + 26, { color:"#fff", tam:14, alinear:i === 0 ? "left" : i === 4 ? "right" : "center" }); });
      c.fillStyle = NARANJA; c.fillRect(m.l, Y(D.UMBRAL) - 1.5, pw, 3);
      rotulo(c, "umbral de alerta: " + D.UMBRAL + " %", m.l + pw, Y(D.UMBRAL) + 22, { color:NARANJA, tam:14, alinear:"right" });
      E.historia.forEach(hh => { if (hh.reent && hh.mes){ const x = X(hh.mes); c.fillStyle = CONCRETO; c.fillRect(x - 2, m.t - 10, 4, ph + 10); } });
      E.versiones.forEach(v => { if (v.mes) rotulo(c, "v" + v.v, X(v.mes), m.t - 16, { color:CONCRETO, tam:14, alinear:"center" }); });
      c.strokeStyle = "#fff"; c.lineWidth = 3; c.lineJoin = "round"; c.beginPath();
      E.historia.forEach((hh, i) => { const x = X(hh.mes), y = Y(hh.acc); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
      E.historia.forEach(hh => {
        const x = X(hh.mes), y = Y(hh.acc);
        if (hh.acc < D.UMBRAL){ c.fillStyle = NARANJA; c.fillRect(x - 7, y - 7, 14, 14); c.lineWidth = 2.5; c.strokeStyle = "#fff"; c.strokeRect(x - 7, y - 7, 14, 14); }
        else { c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, 5.5, 0, 7); c.fill(); }
      });
      if (E.historia.some(hh => hh.acc < Y0)) rotulo(c, "por debajo de 60 %", m.l + pw, m.t + ph - 10, { color:"#fff", tam:14, alinear:"right" });
    });
    function pintar(){
      const hh = E.historia[E.mes], mes = D.MESES[E.mes], nivel = hh.psi > 0.25 ? "drift fuerte" : hh.psi > 0.1 ? "cambio moderado" : "estable";
      const titulo = E.mes === 0 ? "Modelo recién desplegado" : hh.acc < D.UMBRAL ? "Alerta: la exactitud cayó bajo el umbral" : hh.psi > 0.25 ? "Aviso: los datos ya se movieron" : "Todo en orden";
      ver.dataset.estado = hh.acc < D.UMBRAL ? "alerta" : hh.psi > 0.25 ? "aviso" : "ok";
      ver.querySelector(".s-implementacion-vt").textContent = titulo;
      ver.querySelector(".s-implementacion-vx").textContent = E.mes === 0
        ? `Exactitud en validación: ${num(hh.acc, 1)} %. Frontera aprendida: compras desde ${cop(E.T * 1000)} se marcan como sospechosas.`
        : `${mes[0].toUpperCase() + mes.slice(1)}: exactitud ${num(hh.acc, 1)} %. PSI ${num(hh.psi, 2)}, ${nivel} frente a los datos de entrenamiento.` + (hh.reent ? ` Se reentrenó: la nueva frontera es ${cop(E.T * 1000)}.` : hh.acc < D.UMBRAL ? " El valor típico de compra cruzó la frontera: el modelo marca como fraude compras legítimas." : "");
      bBajo.textContent = E.bajo; bReent.textContent = E.reent;
      mesActual.textContent = mes;
      mesEnt.textContent = "entrenamiento (" + D.MESES[E.mEnt] + ")";
      tbody.innerHTML = E.versiones.map((v, i) => `<tr class="${i === E.versiones.length - 1 && i ? "es-nueva" : ""}"><td>v${v.v}</td><td>${v.mes ? D.MESES[v.mes] : "antes del despliegue"}</td><td><code>${v.hash}</code></td><td>${num(v.acc, 1)} %</td><td>${v.motivo}</td></tr>`).join("");
      btnReent.disabled = E.mEnt === E.mes; btnAv.disabled = E.mes >= 12;
      LH.pintar(); LP.pintar();
    }
    function parar(){ clearInterval(reloj); reloj = 0; btnRep.textContent = "Reproducir"; }
    btnAv.addEventListener("click", () => { parar(); avanzar(); pintar(); });
    btnRep.addEventListener("click", () => {
      if (reloj){ parar(); return; }
      if (E.mes >= 12) nuevo(E.modo);
      btnRep.textContent = "Pausar"; pintar();
      reloj = setInterval(() => { if (!avanzar()){ parar(); } pintar(); }, reducir ? 120 : 950);
    });
    btnReent.addEventListener("click", () => { if (E.mEnt !== E.mes){ reentrenar("Manual: decisión del equipo"); pintar(); } });
    sec.querySelector("[data-reiniciar]").addEventListener("click", () => { parar(); nuevo(E.modo); pintar(); });
    sec.querySelectorAll('input[name="implementacion-mejora-modo"]').forEach(r => r.addEventListener("change", () => { if (r.checked){ parar(); nuevo(r.value); pintar(); } }));
    nuevo("manual");
    if (reducir){ for (let i = 0; i < 7; i++) avanzar(); }
    pintar();
    trasFuentes(() => { LH.pintar(); LP.pintar(); });
    if (reducir) return;
    const { gsap } = ctx;
    gsap.from(sec.querySelectorAll(".s-implementacion-tablero figure"), { y:36, opacity:0, duration:.7, ease:"power3.out", stagger:.12,
      scrollTrigger:{ trigger:sec.querySelector(".s-implementacion-tablero"), start:"top 82%", toggleActions:"play none none reverse" } });
  }
});

})();
