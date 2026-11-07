/* secciones/85-tarea.js — Tumba tu propia idea: la tarea, con una torre de bloques que se puede desarmar */
(() => {
"use strict";
/* Blanco, negro y naranja. Negro sobre naranja 7,3:1; blanco sobre negro 21:1; negro sobre blanco 21:1. */
const NARANJA = "#ff6831";

const BLOQUES = [
  { n:"Pregunta 1", a:"Datos y modelo", ej:["¿Qué pasa si los datos no existen o no puedo usarlos?"] },
  { n:"Pregunta 2", a:"Dinero", ej:["Si el ahorro es la mitad, ¿en cuántos meses recupero la inversión?"] },
  { n:"Pregunta 3", a:"Legal, ética, adopción o escala", ej:["¿Quién responde si el modelo se equivoca con una persona?", "¿Qué se rompe si el uso se multiplica por 10?"] }
];
const NIVELES = 10;
const NIVEL_PREGUNTA = { 8:0, 4:1, 2:2 };      /* nivel de la torre (desde abajo) → pregunta */
const CONSIGNA = [
  "Escribe las 3 preguntas más difíciles que le harías a tu proyecto: las que, sin respuesta, lo tumbarían.",
  "Que duelan: nada de relleno como «¿y si no hay presupuesto?».",
  "Cubre al menos dos ángulos: datos y modelo, dinero, legal y ética, adopción o escala.",
  "Sin datos personales ni confidenciales de la organización."
];
const ENTREGA = [
  { t:"La pregunta", d:"Concreta, con hechos o números. La que más te incomoda de tu propio proyecto." },
  { t:"Tu respuesta honesta", d:"Con evidencia, o un «no la tengo todavía». Inventar una cifra es peor que reconocer el vacío." },
  { t:"Qué cambia en el proyecto", d:"Un ajuste en alcance, datos, presupuesto o riesgos. O la decisión de no hacerlo." }
];
const PROXIMA = "3 preguntas difíciles, tu respuesta honesta a cada una y qué cambia en el proyecto.";
const TEXTO_PLANO = [
  "Tarea: Tumba tu propia idea",
  "Las 3 preguntas más difíciles de tu proyecto",
  "",
  "La consigna",
  ...CONSIGNA.map(c => "- " + c),
  "",
  "Por cada pregunta, entrega",
  ...ENTREGA.map(e => `- ${e.t}: ${e.d}`),
  "",
  "Formato: 1 página, por proyecto.",
  "Para la próxima sesión: " + PROXIMA
].join("\n");

function torreHTML(){
  let h = "";
  for (let n = 0; n < NIVELES; n++){
    const q = NIVEL_PREGUNTA[n];
    if (n % 2 === 0){
      h += `<div class="tr-nivel tr-largo" style="--n:${n}" data-n="${n}">${q === undefined
        ? `<span class="tr-b"></span>`
        : `<span class="tr-hueco"></span><span class="tr-b tr-bq" data-q="${q}" data-n="${n}"><b>${BLOQUES[q].n}</b><small>${BLOQUES[q].a}</small></span>`}</div>`;
    } else {
      h += `<div class="tr-nivel tr-puntas" style="--n:${n}" data-n="${n}"><span class="tr-b"></span><span class="tr-b"></span><span class="tr-b"></span></div>`;
    }
  }
  return h;
}

Clase.seccion({
  id:"tarea",
  orden:85,
  indice:{ texto:"Tumba tu propia idea", ir:"tarea", nota:"La tarea: las 3 preguntas más difíciles de tu proyecto" },
  creditos:[
    `<a href="https://commons.wikimedia.org/wiki/File:Allenby_Bridge_under_test_LOC_matpc.03922.jpg">«Allenby Bridge under test»</a>, Matson Collection, Library of Congress, entre 1934 y 1939. Dominio público, vía Wikimedia Commons. Pasada a dos tintas.`
  ],
  css:`
  .s-tarea h2,.s-tarea h3{color:inherit}

  /* ---------- Apertura */
  .s-tarea.tr-apertura{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr;column-gap:var(--gap);row-gap:24px}
  .s-tarea .tr-ap-titulo{grid-column:1/7;grid-row:1;font-size:var(--step-display);position:relative;z-index:2;transform-origin:0% 100%}
  .s-tarea .tr-ap-texto{grid-column:1/6;grid-row:2;align-self:end;display:flex;flex-direction:column;gap:14px;position:relative;z-index:2}
  .s-tarea .tr-ap-lead{font-size:var(--step-lead);line-height:1.25;font-weight:600;max-width:30ch}
  .s-tarea .tr-ap-cuerpo{line-height:1.45;max-width:44ch}
  .s-tarea .tr-ap-pie{font-size:var(--step-small);line-height:1.4;max-width:52ch}
  .s-tarea .tr-ap-foto{grid-column:7/13;grid-row:1/3;margin:-112px calc(-1 * var(--margen)) -48px 0;position:relative;overflow:hidden;background:#ff6831}
  .s-tarea .tr-ap-foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:16% 56%}

  /* ---------- La torre */
  .s-tarea.tr-torre{background:#fff;color:#000;min-height:100svh;padding:112px var(--margen) 48px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);align-items:center}
  .s-tarea .tr-escena{grid-column:1/7;justify-self:start;position:relative;--w:clamp(230px,20vw,330px);--h:clamp(44px,5.8svh,52px);width:calc(var(--w) * 2.12);height:calc((var(--h) - 2px) * ${NIVELES} + 2px + 14px)}
  .s-tarea .tr-torre-bloques{position:absolute;left:0;bottom:14px;width:var(--w);height:calc((var(--h) - 2px) * ${NIVELES} + 2px);transform-origin:50% 100%}
  .s-tarea .tr-nivel{position:absolute;left:0;width:100%;height:var(--h);bottom:calc((var(--h) - 2px) * var(--n));display:flex}
  .s-tarea .tr-b{display:block;position:relative;height:100%;background:#ff6831;border:2px solid #000}
  .s-tarea .tr-largo .tr-b{width:100%}
  .s-tarea .tr-puntas .tr-b{flex:1}
  .s-tarea .tr-puntas .tr-b + .tr-b{margin-left:-2px}
  .s-tarea .tr-hueco{position:absolute;inset:0;background:#b83f14;border:2px solid #000}
  .s-tarea .tr-bq{position:absolute;inset:0;z-index:2;background:#000;color:#fff;display:flex;flex-direction:column;justify-content:center;padding:0 14px;line-height:1.08}
  .s-tarea .tr-bq b{font-family:var(--f-display);font-weight:700;font-size:var(--step-body);letter-spacing:-.01em}
  .s-tarea .tr-bq small{font-weight:600;font-size:var(--step-small);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .s-tarea .tr-suelto{position:absolute;z-index:3;border-color:#fff}
  .s-tarea .tr-piso{position:absolute;left:calc(-1 * var(--margen));right:-24px;bottom:0;height:14px;background:#000}
  .s-tarea .tr-to-texto{grid-column:7/13;display:flex;flex-direction:column;gap:12px}
  .s-tarea .tr-to-texto h2{font-size:var(--step-head)}
  .s-tarea .tr-to-texto > p{line-height:1.45;max-width:46ch}
  .s-tarea .tr-ctrl{display:flex;gap:12px;flex-wrap:wrap}
  .s-tarea .tr-estado{font-weight:600;min-height:1.5em}
  .s-tarea .tr-resultado:empty{display:none}
  .s-tarea .tr-preguntas{list-style:none;display:flex;flex-direction:column;gap:8px}
  .s-tarea .tr-preguntas li{position:relative;padding:6px 14px 6px 18px;background:#fff;transition:background-color .3s,color .3s}
  .s-tarea .tr-preguntas li::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:#ff6831}
  .s-tarea .tr-preguntas li.salio{background:#000;color:#fff}
  .s-tarea .tr-preguntas strong{font-weight:600}
  .s-tarea .tr-preguntas em{font-style:normal;display:none;margin-left:8px;background:#ff6831;color:#000;font-weight:600;font-size:var(--step-small);padding:3px 8px}
  .s-tarea .tr-preguntas li.salio em{display:inline-block}
  .s-tarea .tr-preguntas span{display:block;margin-top:2px;line-height:1.4}
  .s-tarea .tr-regla{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.15;max-width:34ch}
  .s-tarea .tr-final[hidden]{display:none}
  .s-tarea .tr-resultado{font-weight:600;min-height:1.5em}
  .s-tarea .boton:focus-visible{outline-color:#000}
  .s-tarea .tr-entrega{display:flex;align-items:center;gap:8px 16px;flex-wrap:wrap}
  .s-tarea .tr-entrega p{line-height:1.4;max-width:40ch}
  .s-tarea .tr-entrega strong{font-weight:600}
  .s-tarea #tarea-copiada{font-size:var(--step-small);min-height:1.4em;flex-basis:100%}

  @media (min-width:901px) and (max-height:800px){
    .s-tarea .tr-preguntas span{display:none}
  }
  @media (max-width:900px){
    .s-tarea .tr-ap-titulo,.s-tarea .tr-ap-texto,.s-tarea .tr-escena,.s-tarea .tr-to-texto{grid-column:1/-1;grid-row:auto}
    .s-tarea .tr-ap-foto{grid-column:1/-1;grid-row:auto;margin:0 calc(-1 * var(--margen));min-height:280px}
    .s-tarea.tr-apertura{height:auto;min-height:100svh}
    .s-tarea .tr-escena{--w:clamp(150px,40vw,260px);margin-bottom:32px}
  }
  `,
  html:`
  <span class="ancla" id="tarea" data-parada="tarea"></span>
  <section class="s-tarea tr-apertura cap" data-campo="naranja" style="--campo:${NARANJA};--tinta:#000" aria-labelledby="tarea-titulo">
    <h2 class="tr-ap-titulo" id="tarea-titulo"><span class="mask"><span class="in">Tumba tu</span></span><span class="mask"><span class="in">propia idea</span></span></h2>
    <div class="tr-ap-texto">
      <p class="tr-ap-lead">La tarea: las 3 preguntas más difíciles de tu proyecto.</p>
      <p class="tr-ap-cuerpo">Antes de abrir un puente, lo cargan a propósito para ver si aguanta. Con su proyecto, lo mismo: busquen la carga que lo tumbaría antes de que aparezca sola.</p>
      <p class="tr-ap-pie">En la foto: puente Allenby bajo prueba de carga, entre 1934 y 1939. Matson Collection, Library of Congress.</p>
    </div>
    <figure class="tr-ap-foto">
      <img src="img/tarea/assets/puente-allenby.jpg" width="2000" height="1422" fetchpriority="high" decoding="async" alt="Fotografía antigua a dos tintas, negro y naranja: un puente de armadura metálica sobre pilares de piedra, con camiones cargados encima durante una prueba de carga.">
    </figure>
  </section>

  <span class="ancla" data-parada="tarea-torre"></span>
  <section class="s-tarea tr-torre" data-campo="blanco" aria-labelledby="tarea-torre-titulo">
    <div class="tr-escena" aria-hidden="true">
      <div class="tr-torre-bloques">${torreHTML()}</div>
      <div class="tr-piso"></div>
    </div>
    <div class="tr-to-texto">
      <h2 id="tarea-torre-titulo">¿La torre aguanta?</h2>
      <p>Cada bloque es una pregunta que, sin respuesta, tumbaría el proyecto. Sáquenlos uno por uno: si la torre aguanta sin esos bloques, la idea es sólida; si no, eso es lo que hay que reforzar.</p>
      <div class="tr-ctrl">
        <button class="boton" type="button" id="tarea-sacar">Sacar bloque</button>
        <button class="boton" type="button" id="tarea-armar">Volver a armar</button>
      </div>
      <p class="tr-estado" id="tarea-estado" aria-live="polite"></p>
      <ol class="tr-preguntas" aria-label="Los tres bloques y un ejemplo de pregunta que duele">
        ${BLOQUES.map((b, i) => `<li data-q="${i}"><strong>${b.n}: ${b.a.toLowerCase()}</strong><em>Salió</em><span>Ejemplo que duele: ${b.ej.join(" ")}</span></li>`).join("")}
      </ol>
      <div class="tr-final" id="tarea-final" hidden>
        <div class="tr-ctrl">
          <button class="boton" type="button" id="tarea-aguanta">La torre aguanta</button>
          <button class="boton" type="button" id="tarea-cae">La torre se cae</button>
        </div>
      </div>
      <p class="tr-resultado" id="tarea-resultado" aria-live="polite"></p>
      <div class="tr-entrega">
        <p><strong>Entrega:</strong> 1 página por proyecto, para la próxima sesión.</p>
        <button class="boton" type="button" id="tarea-copiar">Copiar la tarea</button>
        <p id="tarea-copiada" aria-live="polite"></p>
      </div>
    </div>
  </section>
  `,
  iniciar(ctx){
    const { gsap, reducir, raiz } = ctx;
    const C = ctx.Clase;
    const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];

    /* ======== La torre: sacar bloques, temblar, aguantar o caer ======== */
    const escena = $(".tr-escena"), torre = $(".tr-torre-bloques");
    const estado = $("#tarea-estado"), resultado = $("#tarea-resultado"), final = $("#tarea-final");
    const btnSacar = $("#tarea-sacar");
    const items = $$(".tr-preguntas li");
    let sacados = 0, cerrada = false;

    const temblor = fuerza => gsap.to(torre, { keyframes:[{ rotation:-1.4 * fuerza }, { rotation:1.1 * fuerza }, { rotation:-.6 * fuerza }, { rotation:.25 * fuerza }, { rotation:0 }], duration:.75, ease:"none", transformOrigin:"50% 100%" });
    function pintarEstado(){
      if (cerrada) return;
      if (sacados === 0) estado.textContent = "Quedan 3 bloques por sacar. Empiecen por la pregunta 1.";
      else if (sacados < 3) estado.textContent = `Salió la ${BLOQUES[sacados - 1].n.toLowerCase()}: ${BLOQUES[sacados - 1].a.toLowerCase()}. ¿Tienen una respuesta honesta? Quedan ${3 - sacados}.`;
      else estado.textContent = "Salieron los tres bloques. ¿La torre aguanta sin ellos?";
      btnSacar.disabled = sacados >= 3;
      final.hidden = sacados < 3;
    }
    function sacar(){
      if (sacados >= 3 || cerrada) return;
      const q = sacados, b = torre.querySelector(`.tr-bq[data-q="${q}"]`), n = +b.dataset.n;
      gsap.killTweensOf(torre); gsap.set(torre, { rotation:0 });
      /* el bloque pasa a la escena (fuera de la torre) en el mismo lugar, para que el temblor no lo arrastre */
      b.classList.add("tr-suelto");
      b.style.cssText = `top:auto;right:auto;left:0;bottom:calc(14px + (var(--h) - 2px) * ${n});width:var(--w);height:var(--h)`;
      escena.appendChild(b);
      const alto = b.offsetHeight, yFin = (n - q) * (alto - 2);
      items[q].classList.add("salio");
      sacados++; pintarEstado();
      if (reducir){ gsap.set(b, { xPercent:112, y:yFin }); return; }
      gsap.timeline()
        .to(b, { xPercent:58, duration:.55, ease:"power2.inOut" })
        .add(() => temblor(1 + q * .35), .3)
        .to(b, { xPercent:112, duration:.35, ease:"power1.out" }, .55)
        .to(b, { y:yFin, duration:.6, ease:"bounce.out" }, .6)
        .to(b, { keyframes:[{ rotation:9 }, { rotation:-3 }, { rotation:0 }], duration:.6, ease:"none" }, .6);
    }
    function aguanta(){
      if (cerrada) return; cerrada = true;
      resultado.textContent = "La torre aguantó sin esos tres bloques: la idea es sólida.";
      estado.textContent = "";
      if (!reducir) gsap.fromTo(torre, { y:-10 }, { y:0, duration:.7, ease:"bounce.out" });
    }
    function cae(){
      if (cerrada) return; cerrada = true;
      resultado.textContent = "La torre se cayó: eso es lo que hay que reforzar antes de seguir.";
      estado.textContent = "";
      const r = C.util.rng(11), alto = torre.querySelector(".tr-nivel").offsetHeight - 2;
      torre.querySelectorAll(".tr-nivel").forEach(nv => {
        const n = +nv.dataset.n;
        nv.querySelectorAll(".tr-b, .tr-hueco").forEach(el => {
          const caida = { y:n * alto - r() * alto * 1.6, xPercent:(r() - .55) * (nv.classList.contains("tr-puntas") ? 260 : 90), rotation:(r() - .5) * 70 };
          if (reducir) gsap.set(el, caida);
          else gsap.to(el, { ...caida, duration:.8 + r() * .5, ease:"bounce.out", delay:(NIVELES - n) * .05 });
        });
      });
    }
    function armar(){
      $$(".tr-suelto").forEach(el => el.remove());
      gsap.killTweensOf(torre); gsap.set(torre, { clearProps:"transform" });
      torre.innerHTML = torreHTML();
      sacados = 0; cerrada = false; resultado.textContent = "";
      items.forEach(li => li.classList.remove("salio"));
      pintarEstado();
      if (!reducir) gsap.from(torre.querySelectorAll(".tr-nivel"), { y:-140, opacity:0, duration:.55, ease:"bounce.out", stagger:.05 });
    }
    btnSacar.addEventListener("click", sacar);
    $("#tarea-armar").addEventListener("click", armar);
    $("#tarea-aguanta").addEventListener("click", aguanta);
    $("#tarea-cae").addEventListener("click", cae);
    pintarEstado();

    /* ======== Copiar la tarea para la plataforma del curso ======== */
    const aviso = $("#tarea-copiada");
    const listo = () => { aviso.textContent = "Copiada, con la consigna completa. Ya pueden pegarla en la plataforma del curso."; };
    const respaldo = () => {
      const t = document.createElement("textarea");
      t.value = TEXTO_PLANO; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.left = "-9999px";
      document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (e){ ok = false; }
      t.remove();
      if (ok) listo(); else aviso.textContent = "No se pudo copiar solo: seleccionen el texto de esta pantalla y cópienlo.";
    };
    $("#tarea-copiar").addEventListener("click", () => {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(TEXTO_PLANO).then(listo, respaldo);
      else respaldo();
    });

    if (reducir) return;

    /* ======== Movimiento firma: los bloques caen, se apilan y tiemblan ======== */
    const ap = $(".tr-apertura"), ancla = $('[data-parada="tarea"]');
    gsap.timeline({ scrollTrigger:{ trigger:ancla, start:"top 78%", toggleActions:"play none none reverse" } })
      .from(ap.querySelectorAll(".tr-ap-titulo .in"), { yPercent:-130, duration:.85, ease:"bounce.out", stagger:.18 })
      .to(ap.querySelector(".tr-ap-titulo"), { keyframes:[{ rotation:-1.6 }, { rotation:1.1 }, { rotation:-.4 }, { rotation:0 }], duration:.6, ease:"none" }, .9)
      .fromTo(ap.querySelector(".tr-ap-foto"), { clipPath:"inset(100% 0% 0% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", duration:1.2, ease:"power3.inOut" }, .1)
      .from(ap.querySelectorAll(".tr-ap-texto > *"), { y:24, opacity:0, duration:.6, ease:"power3.out", stagger:.08 }, .5);
    gsap.fromTo(ap.querySelector(".tr-ap-foto img"), { scale:1.12 }, { scale:1, ease:"none",
      scrollTrigger:{ trigger:ancla, start:"top bottom", end:() => "+=" + Math.round(innerHeight * 1.6), scrub:true, invalidateOnRefresh:true } });

    const to = $(".tr-torre");
    gsap.timeline({ scrollTrigger:{ trigger:to, start:"top 65%", toggleActions:"play none none none" } })
      .from(torre.querySelectorAll(".tr-nivel"), { y:-160, opacity:0, duration:.55, ease:"bounce.out", stagger:.06 })
      .add(() => temblor(.6))
      .from(to.querySelectorAll(".tr-to-texto > *"), { x:30, opacity:0, duration:.6, ease:"power3.out", stagger:.06 }, .2);
  }
});
})();
