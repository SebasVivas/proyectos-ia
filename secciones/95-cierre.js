/* secciones/95-cierre.js — Gracias: el agua baja y el titular sale a flote (espejo de la portada) */
(() => {
"use strict";
Clase.seccion({
  id:"cierre", orden:95,
  indice:{ texto:"Gracias", ir:"cierre", nota:"Próxima travesía: 13 y 14 de Noviembre" },
  css:`
  .s-cierre{height:100svh;min-height:640px;overflow:hidden;background:#fff}
  .s-cierre .agua{position:absolute;left:0;right:0;top:0;height:120vh;background:var(--naranja);transform:translateY(0);will-change:transform}
  .s-cierre .titular{position:absolute;left:50%;translate:-50% 0;top:calc(50vh - .62em);width:92vw;text-align:center;font-size:clamp(7rem,17vw,17rem);line-height:.86;--corte:0px}
  .s-cierre .cop{display:block}
  .s-cierre .cop-a{color:#000;clip-path:inset(0 0 calc(100% - var(--corte)) 0)}
  .s-cierre .cop-b{position:absolute;inset:0;color:var(--sumergida);clip-path:inset(var(--corte) 0 0 0)}
  .s-cierre .pie-cierre{position:absolute;left:var(--margen);right:var(--margen);bottom:48px;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;color:#000;z-index:2}
  .s-cierre .pie-cierre p{font-size:var(--step-lead);line-height:1.3;max-width:34ch}
  .s-cierre .pie-cierre .boton{background:#fff}
  `,
  html:`
  <span class="ancla" data-parada="cierre"></span>
  <section class="s-cierre" data-campo="naranja" aria-labelledby="ci-titulo">
    <div class="agua" aria-hidden="true"></div>
    <h2 class="titular" id="ci-titulo">
      <span class="cop cop-a">Gracias</span>
      <span class="cop cop-b" aria-hidden="true">Gracias</span>
    </h2>
    <div class="pie-cierre">
      <p>Sebastián Vivas. Formulación y Evaluación de Proyectos de IA. Próxima travesía: 13 y 14 de Noviembre.</p>
      <a class="boton" href="#portada" data-ir="portada">Volver al inicio</a>
    </div>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    const sec = raiz.querySelector(".s-cierre"), titular = sec.querySelector(".titular"), agua = sec.querySelector(".agua");
    const nivel = { v:reducir ? 1.04 : 0 };
    const pintar = () => {
      const seam = nivel.v * innerHeight;
      agua.style.transform = `translateY(${seam}px)`;
      titular.style.setProperty("--corte", (seam - titular.getBoundingClientRect().top) + "px");
    };
    pintar(); addEventListener("resize", pintar);
    if (reducir) return;
    gsap.to(nivel, { v:1.04, ease:"none", onUpdate:pintar, scrollTrigger:{ trigger:sec, start:"top top", end:"+=100%", scrub:true, pin:true } });
    gsap.from(sec.querySelectorAll(".pie-cierre > *"), { y:24, opacity:0, duration:.7, ease:"power3.out", stagger:.08, scrollTrigger:{ trigger:sec, start:"top 30%" } });
  }
});
})();
