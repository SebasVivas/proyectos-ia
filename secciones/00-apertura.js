/* secciones/00-apertura.js — Portada, la travesía (agenda), quién dicta y apertura del módulo 4 */
(() => {
"use strict";
Clase.campo("arena", { bg:"#efe3c8", ink:"#000000", btn:["#a7ff9c", "#000000"] });

/* ===================================================== PORTADA */
Clase.seccion({
  id:"portada", orden:0,
  indice:{ texto:"¿Flota o se hunde?", ir:"portada", nota:"Portada" },
  css:`
  .s-portada{height:100svh;overflow:hidden;background:#fff}
  .s-portada .campo-bajo{position:absolute;left:0;right:0;top:0;height:112vh;background:var(--naranja);transform:translateY(50vh);will-change:transform}
  .s-portada .titular{position:absolute;left:50%;translate:-50% 0;top:calc(50vh - 1.153em);width:80vw;text-align:center;font-size:clamp(6rem,9.5vw,9.375rem);line-height:.86;--corte:1.153em}
  .s-portada .cop{display:block}
  .s-portada .cop-a{color:#000;clip-path:inset(0 0 calc(100% - var(--corte)) 0)}
  .s-portada .cop-b{position:absolute;inset:0;color:var(--sumergida);clip-path:inset(var(--corte) 0 0 0)}
  .s-portada .apoyo{position:absolute;left:50%;translate:-50% 0;bottom:56px;width:min(54ch,86vw);text-align:center;font-size:var(--step-lead);line-height:1.35;color:#000}
  `,
  html:`
  <span class="ancla" data-parada="portada"></span>
  <section class="s-portada" id="portada" data-campo="blanco">
    <div class="campo-bajo" aria-hidden="true"></div>
    <h1 class="titular">
      <span class="cop cop-a">¿Flota o<br>se hunde?</span>
      <span class="cop cop-b" aria-hidden="true">¿Flota o<br>se hunde?</span>
    </h1>
    <p class="apoyo">Formulación y Evaluación de Proyectos de IA. Sábado 7 de Noviembre, 2026. Hoy ponemos a prueba su proyecto: modelo, viabilidad, números y riesgos.</p>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    const sec = raiz.querySelector(".s-portada"), titular = sec.querySelector(".titular"), campo = sec.querySelector(".campo-bajo");
    const marea = { nivel:.5 };
    const pintar = () => {
      const seam = marea.nivel * innerHeight;
      campo.style.transform = `translateY(${seam}px)`;
      titular.style.setProperty("--corte", (seam - titular.getBoundingClientRect().top) + "px");
    };
    pintar(); addEventListener("resize", pintar);
    if (reducir) return;
    gsap.to(marea, { nivel:-0.02, ease:"none", onUpdate:pintar, scrollTrigger:{ trigger:sec, start:"top top", end:"+=110%", scrub:true, pin:true } });
    gsap.to(titular, { y:70, ease:"none", scrollTrigger:{ trigger:sec, start:"top top", end:"+=110%", scrub:true } });
    gsap.from(sec.querySelectorAll(".cop"), { yPercent:30, opacity:0, duration:1.15, ease:"power4.out", delay:.15, onUpdate:pintar });
    gsap.from(sec.querySelector(".apoyo"), { y:24, opacity:0, duration:.8, ease:"power3.out", delay:.6 });
    gsap.from(".cabecera > *", { y:-20, opacity:0, duration:.7, ease:"power3.out", stagger:.1, delay:.3 });
  }
});

/* ===================================================== LA TRAVESÍA (agenda del módulo) */
const PUERTOS = [
  { f:"30 y 31 de Octubre", t:"Conceptos de IA, gestión de proyectos e identificación del problema.", x:.12, y:.74, arriba:true },
  { f:"6 y 7 de Noviembre", t:"Formulación del proyecto de IA, canvas y datos.", x:.38, y:.5, hoy:true },
  { f:"13 y 14 de Noviembre", t:"Mercado y viabilidad financiera y legal.", x:.63, y:.76, arriba:true },
  { f:"20 y 21 de Noviembre", t:"Implementación, ética, evaluación final y pitch ejecutivo (presentación corta ante directivos).", x:.87, y:.5 }
];
Clase.seccion({
  id:"agenda", orden:2,
  indice:{ texto:"La travesía", ir:"agenda", nota:"Agenda del módulo: cuatro fines de semana" },
  creditos:["«West Indies / Drawn and Engraved from the best Maps and Charts», carta del siglo XVIII, dominio público, vía Wikimedia Commons (British Museum)"],
  css:`
  .s-agenda{height:100svh;min-height:640px;overflow:hidden;background:#efe3c8;color:#000}
  .s-agenda .ag-carta{position:absolute;inset:-8% -6%;pointer-events:none;will-change:transform}
  .s-agenda .ag-carta img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;opacity:.42}
  .s-agenda .ag-cab{position:absolute;left:var(--margen);top:112px;z-index:3}
  .s-agenda h2{font-size:var(--step-display)}
  .s-agenda .ag-cab p{font-size:var(--step-lead);line-height:1.3;margin-top:16px;max-width:30ch}
  .s-agenda .ag-ruta{position:absolute;inset:0;width:100%;height:100%;z-index:1;overflow:visible;pointer-events:none}
  .s-agenda .ag-ruta .futura{fill:none;stroke:#000;stroke-opacity:.3;stroke-width:3;stroke-dasharray:3 12;stroke-linecap:round}
  .s-agenda .ag-ruta .hecha{fill:none;stroke:#000;stroke-width:5;stroke-linecap:round}
  .s-agenda .ag-ruta .punto{fill:#efe3c8;stroke:#000;stroke-width:4}
  .s-agenda .ag-ruta .punto.hoy{fill:var(--naranja)}
  .s-agenda .ag-puertos{list-style:none}
  .s-agenda .puerto{position:absolute;width:min(22vw,320px);z-index:2;translate:-50% 0;background:#efe3c8;padding:12px 16px 14px}
  .s-agenda .puerto .fecha{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-agenda .puerto .temas{margin-top:6px;line-height:1.35}
  .s-agenda .puerto.hoy .fecha{display:inline-block;background:var(--naranja);padding:8px 12px 6px}
  .s-agenda .puerto .hoy-marca{display:inline-block;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:.9;margin-bottom:8px}
  .s-agenda .ag-barco{position:absolute;left:0;top:0;width:64px;height:52px;z-index:2;translate:-50% -88%;will-change:transform}
  @media (max-width:760px){
    .s-agenda{height:auto;min-height:100svh;padding-bottom:40px}
    .s-agenda .ag-cab{position:relative;top:auto;left:auto;padding:112px 20px 8px}
    .s-agenda .ag-ruta,.s-agenda .ag-barco{display:none}
    .s-agenda .ag-puertos{position:relative;z-index:2;padding:16px 20px 0;display:grid;gap:10px}
    .s-agenda .puerto{position:static!important;translate:none;width:auto}
  }
  `,
  html:`
  <span class="ancla" data-parada="agenda"></span>
  <section class="s-agenda" data-campo="arena" aria-labelledby="ag-titulo">
    <div class="ag-carta" aria-hidden="true"><img src="img/apertura/carta-antillas.jpg" alt="" width="1920" height="991"></div>
    <div class="ag-cab">
      <h2 id="ag-titulo">La travesía</h2>
      <p>Cuatro fines de semana: viernes de 5 a 8 p. m. y sábados de 8 a. m. a 4 p. m.</p>
    </div>
    <svg class="ag-ruta" aria-hidden="true"><path class="futura"/><path class="hecha"/><g class="puntos"></g></svg>
    <svg class="ag-barco" viewBox="0 0 64 52" aria-hidden="true"><path d="M30 2 L30 36 L8 36 Z" fill="#000"/><path d="M34 8 L34 36 L52 36 Z" fill="#ff6831"/><path d="M2 40 L62 40 L54 50 L10 50 Z" fill="#000"/></svg>
    <ol class="ag-puertos">
      ${PUERTOS.map(p => `<li class="puerto${p.hoy ? " hoy" : ""}">${p.hoy ? `<span class="hoy-marca">Hoy</span><br>` : ""}<span class="fecha">${p.f}</span><p class="temas">${p.t}</p></li>`).join("")}
    </ol>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    const sec = raiz.querySelector(".s-agenda"), svg = sec.querySelector(".ag-ruta");
    const futura = svg.querySelector(".futura"), hecha = svg.querySelector(".hecha"), puntos = svg.querySelector(".puntos");
    const barco = sec.querySelector(".ag-barco"), lis = [...sec.querySelectorAll(".puerto")];
    let largo = 0, largoHoy = 0, prog = reducir ? 1 : 0;
    const medidor = document.createElementNS("http://www.w3.org/2000/svg", "path");
    function curva(pts){
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++){
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      return d;
    }
    function trazar(){
      const w = sec.clientWidth, h = sec.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const pts = [[-.04 * w, .9 * h], ...PUERTOS.map(p => [p.x * w, p.y * h]), [1.05 * w, .3 * h]];
      const d = curva(pts);
      futura.setAttribute("d", d); hecha.setAttribute("d", d);
      largo = hecha.getTotalLength();
      medidor.setAttribute("d", curva(pts.slice(0, 3)));
      largoHoy = medidor.getTotalLength();
      hecha.style.strokeDasharray = `${largo} ${largo}`;
      puntos.innerHTML = PUERTOS.map(p => `<circle class="punto${p.hoy ? " hoy" : ""}" cx="${p.x * w}" cy="${p.y * h}" r="12"/>`).join("");
      lis.forEach((li, i) => {
        const p = PUERTOS[i];
        li.style.left = (p.x * w) + "px";
        if (p.arriba){ li.style.top = "auto"; li.style.bottom = (h - p.y * h + 28) + "px"; }
        else { li.style.bottom = "auto"; li.style.top = (p.y * h + 28) + "px"; }
      });
      pintar();
    }
    function pintar(){
      const l = prog * largoHoy;
      hecha.style.strokeDashoffset = largo - l;
      const pt = hecha.getPointAtLength(Math.max(.1, l)), pt2 = hecha.getPointAtLength(Math.min(largo, l + 2));
      const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      barco.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${Math.max(-18, Math.min(18, ang))}deg)`;
    }
    trazar(); addEventListener("resize", trazar);
    if (reducir) return;
    gsap.to({ v:0 }, { v:1, ease:"none", scrollTrigger:{ trigger:sec, start:"top top", end:"+=120%", scrub:.6, pin:true,
      onUpdate:s => { prog = s.progress; pintar(); } } });
    gsap.fromTo(sec.querySelector(".ag-carta"), { scale:1.12, yPercent:-2 }, { scale:1, yPercent:3, ease:"none", scrollTrigger:{ trigger:sec, start:"top bottom", end:"bottom top", scrub:true } });
    gsap.from(sec.querySelectorAll(".ag-cab > *"), { y:40, opacity:0, duration:1, ease:"power4.out", stagger:.1, scrollTrigger:{ trigger:sec, start:"top 70%" } });
    gsap.from(lis, { y:24, opacity:0, duration:.7, ease:"power3.out", stagger:.12, scrollTrigger:{ trigger:sec, start:"top 40%" } });
  }
});

/* ===================================================== QUIÉN DICTA */
Clase.seccion({
  id:"quien", orden:4,
  indice:{ texto:"Quién los acompaña", ir:"quien", nota:"Sebastián Vivas" },
  css:`
  .s-quien{display:flex;align-items:center}
  .s-quien .escalera{position:relative;z-index:2;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:1.02;letter-spacing:-.03em}
  .s-quien .escalera span{display:block;padding-left:calc(var(--s) * 6vw)}
  .s-quien .escalera span:nth-child(odd){color:#fff}
  .s-quien .escalera span:nth-child(even){color:var(--menta)}
  .s-quien .retrato{position:absolute;right:var(--margen);top:max(104px,calc(50% - 18vw));width:min(23vw,46vh);max-width:380px;z-index:1;will-change:transform}
  .s-quien .retrato img{width:100%;height:auto;filter:grayscale(1) contrast(1.12)}
  .s-quien .firma{position:absolute;right:var(--margen);width:min(23vw,46vh);max-width:380px;min-width:260px;bottom:44px;z-index:2;color:#fff}
  .s-quien .firma h2{font-size:var(--step-head);letter-spacing:-.03em;line-height:.95}
  .s-quien .firma p{font-size:var(--step-body);margin-top:8px}  @media (max-width:760px){.s-quien .retrato{display:none}}
  `,
  html:`
  <span class="ancla" data-parada="quien"></span>
  <section class="s-quien cap" data-campo="negro" style="--campo:#000;--tinta:#fff" aria-label="Quién dicta la clase">
    <p class="escalera">
      <span style="--s:0">Hoy no aprendemos</span>
      <span style="--s:1">a usar IA:</span>
      <span style="--s:2">aprendemos a decidir</span>
      <span style="--s:3">si un proyecto de IA</span>
      <span style="--s:4">merece existir.</span>
    </p>
    <figure class="retrato"><img src="img/comun/sebastian-circulo.png" alt="Sebastián Vivas" width="352" height="352"></figure>
    <div class="firma">
      <h2>Sebastián Vivas</h2>
      <p>Analista y consultor en Colombia.</p>    </div>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    if (reducir) return;
    const sec = raiz.querySelector(".s-quien");
    gsap.from(sec.querySelectorAll(".escalera span"), { xPercent:-14, opacity:0, duration:.95, ease:"power3.out", stagger:.09, scrollTrigger:{ trigger:sec, start:"top 70%", toggleActions:"play none none reverse" } });
    gsap.from(sec.querySelector(".retrato"), { scale:.8, rotate:-6, opacity:0, duration:1.1, ease:"power3.out", scrollTrigger:{ trigger:sec, start:"top 60%", toggleActions:"play none none reverse" } });
    gsap.from(sec.querySelectorAll(".firma > *"), { y:24, opacity:0, duration:.7, ease:"power3.out", stagger:.08, scrollTrigger:{ trigger:sec, start:"top 45%", toggleActions:"play none none reverse" } });
  }
});

/* ===================================================== APERTURA DEL MÓDULO 4: EVALUAR */
Clase.seccion({
  id:"evaluar", orden:8,
  indice:{ texto:"Antes de zarpar, se mide", ir:"evaluar", nota:"Módulo 4: evaluación del proyecto" },
  creditos:["«Astronomy: a quadrant and a sextant», grabado, CC BY 4.0, vía Wikimedia Commons (Wellcome Collection)"],
  css:`
  .s-evaluar{overflow:hidden}
  .s-evaluar .ev-sextante{position:absolute;right:-5vw;top:28%;height:41%;width:auto;margin:0;pointer-events:none;will-change:transform}
  .s-evaluar .ev-sextante img{height:100%;width:auto;max-width:none;mix-blend-mode:multiply}
  .s-evaluar .ev-cab{position:relative;z-index:2;max-width:72vw}
  .s-evaluar h2{font-size:clamp(4rem,7.2vw,7.5rem)}
  .s-evaluar .ev-bajada{font-size:var(--step-lead);line-height:1.3;margin-top:20px;max-width:32ch}
  .s-evaluar .ev-frentes{position:absolute;left:var(--margen);right:var(--margen);bottom:48px;z-index:2;list-style:none;display:flex;flex-wrap:wrap;gap:4px 44px}
  .s-evaluar .ev-frentes a{position:relative;display:inline-block;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:1;text-decoration:none;padding-bottom:8px}
  .s-evaluar .ev-frentes a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:#000;transform:scaleX(0);transform-origin:left;transition:transform .3s}
  .s-evaluar .ev-frentes a:hover::after,.s-evaluar .ev-frentes a:focus-visible::after{transform:scaleX(1)}
  .s-evaluar .ev-frentes a:focus-visible{outline:3px solid #000;outline-offset:4px}
  `,
  html:`
  <span class="ancla" data-parada="evaluar"></span>
  <section class="s-evaluar cap" data-campo="menta" style="--campo:#a7ff9c;--tinta:#000" aria-labelledby="ev-titulo">
    <figure class="ev-sextante" aria-hidden="true"><img src="img/apertura/sextante.jpg" alt="" width="1700" height="991"></figure>
    <div class="ev-cab">
      <h2 id="ev-titulo"><span class="mask"><span class="in">Antes de zarpar,</span></span><span class="mask"><span class="in">se mide</span></span></h2>
      <p class="ev-bajada">Módulo 4 de la clase. Hoy evaluamos su proyecto en cinco frentes, como lo haría un comité de inversión.</p>
    </div>
    <ul class="ev-frentes" aria-label="Los cinco frentes de la evaluación">
      <li><a href="#modelos" data-ir="modelos">Modelo</a></li>
      <li><a href="#viabilidad" data-ir="viabilidad">Viabilidad técnica</a></li>
      <li><a href="#evaluacion" data-ir="evaluacion">Financiera</a></li>
      <li><a href="#etica" data-ir="etica">Legal</a></li>
      <li><a href="#riesgos" data-ir="riesgos">Riesgos</a></li>
    </ul>
  </section>`,
  iniciar({ gsap, reducir, raiz }){
    if (reducir) return;
    const sec = raiz.querySelector(".s-evaluar");
    gsap.fromTo(sec.querySelector(".ev-sextante"), { rotate:-9, yPercent:10 }, { rotate:5, yPercent:-8, ease:"none", scrollTrigger:{ trigger:sec, start:"top bottom", end:"bottom top", scrub:true } });
    gsap.timeline({ scrollTrigger:{ trigger:sec, start:"top 65%", toggleActions:"play none none reverse" } })
      .from(sec.querySelectorAll("h2 .in"), { yPercent:110, duration:1, ease:"power4.out", stagger:.1 })
      .from(sec.querySelector(".ev-bajada"), { y:24, opacity:0, duration:.7, ease:"power3.out" }, .3)
      .from(sec.querySelectorAll(".ev-frentes li"), { y:50, opacity:0, duration:.7, ease:"power3.out", stagger:.07 }, .4);
  }
});
})();
