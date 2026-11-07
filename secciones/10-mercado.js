/* secciones/10-mercado.js — El puerto (análisis de mercado + DOFA) */
(() => {
"use strict";

/* Paleta del puerto. Contrastes (luminancia relativa WCAG):
   blanco sobre cobalto 6,7:1 · negro sobre amarillo 14,5:1 · negro sobre crema 18,3:1 · blanco sobre negro 21:1
   cobalto sobre crema 5,8:1 · amarillo contra cobalto 4,6:1 · negro contra cobalto 3,1:1 (solo formas y palabras decorativas).
   Las fotos van en blanco y negro con multiply sobre el campo: solo pueden oscurecerlo, así que el blanco encima nunca baja de 6,7:1. */
const COB = "#1d3cf0", AMA = "#ffd23f", CRE = "#f4efe4", NEG = "#000000", BLA = "#ffffff";
Clase.campo("puerto-cobalto",  { bg:COB, ink:BLA, btn:[AMA, NEG] });
Clase.campo("puerto-amarillo", { bg:AMA, ink:NEG, btn:[NEG, BLA] });
Clase.campo("puerto-crema",    { bg:CRE, ink:NEG, btn:[COB, BLA] });
Clase.campo("puerto-negro",    { bg:NEG, ink:BLA, btn:[AMA, NEG] });

const IMG = "img/mercado/assets/";

/* DOFA: cuadrante, colores y eje */
const CAT = {
  F:{ n:"Fortaleza",   pl:"Fortalezas",    eje:"Interno · ayuda al proyecto", q:COB, qt:BLA, ql:NEG },
  D:{ n:"Debilidad",   pl:"Debilidades",   eje:"Interno · daña al proyecto",  q:CRE, qt:NEG, ql:AMA },
  O:{ n:"Oportunidad", pl:"Oportunidades", eje:"Externo · ayuda al proyecto", q:AMA, qt:NEG, ql:BLA },
  A:{ n:"Amenaza",     pl:"Amenazas",      eje:"Externo · daña al proyecto",  q:NEG, qt:BLA, ql:COB }
};
/* Proyecto de ejemplo del curso: un modelo que predice qué clientes van a abandonar una empresa */
const TARJETAS = [
  { t:"Los datos de los clientes están repartidos en tres sistemas que no se hablan entre sí.", c:"D", corto:"Datos de clientes repartidos en tres sistemas.",
    por:"Es interno: esos sistemas son de la empresa y ella puede unificarlos. Y daña: sin datos unificados, el modelo no tiene con qué aprender." },
  { t:"El mercado está saturado: crecer ya no es conseguir clientes nuevos sino conservar los que hay.", c:"O", corto:"Mercado saturado: conservar clientes vale más que conseguir nuevos.",
    por:"Es externo: la empresa no decide cómo está el mercado. Y ayuda: hace más valioso un modelo que anticipe quién se va." },
  { t:"La empresa guarda años de historial de compras, pagos y reclamos de cada cliente.", c:"F", corto:"Años de historial de compras, pagos y reclamos.",
    por:"Es interno: ese historial ya está en casa. Y ayuda: es justo lo que el modelo necesita para aprender quién se va." },
  { t:"Un proveedor de software ya vende un módulo de predicción de abandono listo para usar.", c:"A", corto:"Un proveedor ya vende un módulo de abandono listo.",
    por:"Es externo: la empresa no controla a ese proveedor. Y daña: es una alternativa contra la que el proyecto tiene que compararse y ganar." },
  { t:"Hay servicios en la nube para entrenar y desplegar modelos sin comprar servidores.", c:"O", corto:"Servicios en la nube para entrenar y desplegar sin servidores.",
    por:"Es externo: esos servicios existen afuera; la empresa solo decide usarlos. Y ayuda: bajan el costo y el tiempo de arrancar." },
  { t:"Ya existe un equipo de retención que puede llamar a cada cliente que el modelo señale.", c:"F", corto:"Un equipo de retención que actúa sobre cada alerta.",
    por:"Es interno: el equipo es de la empresa. Y ayuda: una alerta sin alguien que actúe no sirve; aquí sí hay quien actúe." },
  { t:"La Ley 1581 de 2012 regula cómo se pueden usar los datos personales de los clientes.", c:"A", corto:"La Ley 1581 de 2012 limita el uso de datos personales.",
    por:"Es externo: la ley no la decide la empresa. Y daña: limita qué datos puede usar el modelo y exige autorización de cada titular." },
  { t:"Nadie en la empresa ha llevado un modelo de IA a producción.", c:"D", corto:"Nadie ha llevado un modelo de IA a producción.",
    por:"Es interno: es una capacidad que la empresa puede formar o contratar. Y daña: sube el riesgo de que el modelo se quede en piloto." }
];

const CUADROS = ["F", "D", "O", "A"].map(k => `
      <div class="s-mercado-cuadro" data-c="${k}" style="--q:${CAT[k].q};--qt:${CAT[k].qt};--ql:${CAT[k].ql}">
        <h3 id="mercado-cuadro-${k.toLowerCase()}">${CAT[k].pl}</h3>
        <p class="s-mercado-eje">${CAT[k].eje}</p>
        <ul class="s-mercado-lista" aria-labelledby="mercado-cuadro-${k.toLowerCase()}"></ul>
        <span class="s-mercado-letra" aria-hidden="true">${k}</span>
      </div>`).join("");

const BOTONES = ["F", "D", "O", "A"].map(k => `<button class="boton" type="button" data-c="${k}">${CAT[k].n}</button>`).join("");

Clase.seccion({
  id:"mercado",
  orden:10,
  indice:{ texto:"Mercado", ir:"mercado", nota:"Segmento, competencia, propuesta de valor, modelo de negocio y DOFA" },
  creditos:[
    '«<a href="https://commons.wikimedia.org/w/index.php?curid=21762669">Muelle de Puerto Colombia Atlántico</a>», Javiercelia1, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>, vía Wikimedia Commons. Pasada a blanco y negro; esta versión se comparte con la misma licencia.',
    '«<a href="https://commons.wikimedia.org/wiki/File:Una_calle_de_Barranquilla_siglo_XIX.png">Una calle de Barranquilla</a>», grabado de Édouard Riou, siglo XIX, dominio público, vía Wikimedia Commons.',
    '«<a href="https://commons.wikimedia.org/wiki/File:Drawing,_Calle_de_Commerce,_Barranquilla,_Colombia,_May_1853_(CH_18199525).jpg">Calle de Commerce, Barranquilla, mayo de 1853</a>», dibujo de Frederic Edwin Church, Cooper Hewitt, dominio público, vía Wikimedia Commons.',
    '«<a href="https://commons.wikimedia.org/w/index.php?curid=11333011">Sección caída del muelle de Puerto Colombia</a>», Quillamwa, <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>, vía Wikimedia Commons. Pasada a blanco y negro.'
  ],
  css:`
  /* ---------- Fotos en dos tintas: blanco y negro con multiply sobre el campo ---------- */
  .s-mercado-foto{position:absolute;inset:0;overflow:hidden;background:var(--campo)}
  .s-mercado-foto img{position:absolute;left:0;top:-10%;width:100%;height:120%;object-fit:cover;mix-blend-mode:multiply}

  /* ---------- Apertura: el muelle ---------- */
  .s-mercado-apertura{display:flex;flex-direction:column;justify-content:space-between}
  .s-mercado-apertura .s-mercado-foto img{object-position:64% 50%}
  .s-mercado-apoyo{position:relative;z-index:1;max-width:40ch;font-size:var(--step-lead);line-height:1.3;font-weight:600}
  .s-mercado-credito{position:absolute;z-index:1;right:var(--margen);top:112px;max-width:30ch;text-align:right;font-size:var(--step-small);line-height:1.45}
  .s-mercado-titular,.s-mercado-sentencia{position:relative;z-index:1;font-size:var(--step-display)}

  /* ---------- Recorrido de los puestos ---------- */
  .s-mercado-puestos{background:${AMA}}
  .s-mercado-pista{position:relative}
  .s-mercado-puesto{position:relative;overflow:hidden;min-height:100svh;background:var(--campo);color:var(--tinta);padding:112px var(--margen) 56px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:32px;align-content:center;align-items:center}
  .s-mercado-horizontal{height:100svh;overflow:hidden}
  .s-mercado-horizontal .s-mercado-pista{display:flex;width:500%;height:100%}
  .s-mercado-horizontal .s-mercado-puesto{flex:0 0 20%;height:100%;min-height:0}
  .s-mercado-gigante{position:absolute;left:2vw;bottom:-.2em;z-index:0;font-family:var(--f-display);font-weight:700;font-size:26vw;line-height:.8;letter-spacing:-.05em;white-space:nowrap;color:var(--gigante);pointer-events:none;user-select:none}
  .s-mercado-gigante::before{content:attr(data-palabra)}
  .s-mercado-texto{grid-column:1 / 8;position:relative;z-index:1;display:flex;flex-direction:column;gap:22px;min-width:0}
  .s-mercado-texto h3{font-size:var(--step-head)}
  .s-mercado-guia{font-size:var(--step-lead);line-height:1.3;max-width:38ch}
  .s-mercado-guia strong{font-weight:600}
  .s-mercado-dato{max-width:44ch}
  .s-mercado-figura{grid-column:9 / 13;position:relative;z-index:1;margin:0;min-width:0}
  .s-mercado-marco{position:relative;overflow:hidden;background:var(--campo);height:min(56vh,560px)}
  .s-mercado-marco img{position:absolute;left:-8%;top:-6%;width:116%;height:112%;object-fit:cover;mix-blend-mode:multiply}
  .s-mercado-figura figcaption{margin-top:10px;font-size:var(--step-small);line-height:1.4;max-width:46ch}
  .s-mercado-p-competencia .s-mercado-figura{grid-column:8 / 13;margin-right:calc(-1 * var(--margen))}
  .s-mercado-p-competencia .s-mercado-marco{height:min(60vh,600px)}
  .s-mercado-p-competencia figcaption{padding-right:var(--margen)}
  .s-mercado-p-propuesta .s-mercado-texto{grid-column:1 / 11}
  .s-mercado-plantilla{font-size:var(--step-lead);line-height:1.55;font-weight:600;max-width:46ch}
  .s-mercado-hueco{background:${AMA};color:#000;padding:2px 10px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
  .s-mercado-p-negocio .s-mercado-texto{grid-column:1 / 5}
  .s-mercado-contenedores{grid-column:5 / 13;position:relative;z-index:1;list-style:none;display:grid;grid-template-columns:repeat(12,1fr);gap:10px}
  .s-mercado-contenedor{background:var(--c);color:var(--t);padding:16px 20px 18px;display:flex;flex-direction:column;gap:8px;min-width:0}
  .s-mercado-contenedor strong{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:.9}
  .s-mercado-contenedor span{font-size:var(--step-body);line-height:1.35;max-width:34ch}
  .s-mercado-c-saas{grid-column:2 / 7;grid-row:1}
  .s-mercado-c-freemium{grid-column:7 / 12;grid-row:1}
  .s-mercado-c-licencias{grid-column:1 / 7;grid-row:2}
  .s-mercado-c-consultoria{grid-column:7 / 13;grid-row:2}
  .s-mercado-c-integracion{grid-column:1 / 13;grid-row:3;flex-direction:row;align-items:center;gap:24px}
  .s-mercado-p-dofa .s-mercado-texto{grid-column:1 / 8}
  .s-mercado-p-dofa .s-mercado-gigante{bottom:-.3em}
  .s-mercado-claves{grid-column:9 / 13;position:relative;z-index:1;display:flex;flex-direction:column;gap:18px;align-items:flex-start}
  .s-mercado-claves dl{display:flex;flex-direction:column;gap:16px}
  .s-mercado-claves dt{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-mercado-claves dd{margin-top:4px}
  .s-mercado-claves .boton{background:${AMA};color:#000;border-color:#fff}

  /* ---------- Clasifiquen la DOFA ---------- */
  .s-mercado-dofa{position:relative;min-height:100svh;background:#000;color:#fff;padding:112px var(--margen) 0;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap)}
  .s-mercado-juego{grid-column:1 / 7;display:flex;flex-direction:column;gap:16px;padding-bottom:36px;min-width:0}
  .s-mercado-juego h2{font-size:var(--step-head)}
  .s-mercado-intro{max-width:50ch}
  .s-mercado-intro strong{font-weight:600}
  .s-mercado-pregunta,.s-mercado-respuesta,.s-mercado-final{display:flex;flex-direction:column;gap:14px;align-items:stretch}
  .s-mercado-respuesta,.s-mercado-final{align-items:flex-start}
  .s-mercado-carta{background:${CRE};color:#000;padding:20px 24px 16px;display:flex;flex-direction:column;gap:12px}
  .s-mercado-carta-texto{font-size:var(--step-lead);line-height:1.25;font-weight:600}
  .s-mercado-carta-num{font-size:var(--step-small);font-weight:600}
  .s-mercado-vuelo{pointer-events:none;z-index:150}
  .s-mercado-opciones{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .s-mercado-opciones .boton{width:100%;border-color:#fff}
  .s-mercado-opciones .boton[data-c="F"]{background:${COB};color:#fff}
  .s-mercado-opciones .boton[data-c="D"]{background:${CRE};color:#000}
  .s-mercado-opciones .boton[data-c="O"]{background:${AMA};color:#000}
  .s-mercado-opciones .boton[data-c="A"]{background:#000;color:#fff}
  .s-mercado-dofa .boton:focus-visible{outline-color:#fff}
  .s-mercado-veredicto{font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);line-height:1.05;letter-spacing:-.02em}
  .s-mercado-porque{max-width:48ch}
  .s-mercado-siguiente,.s-mercado-final .boton{background:${AMA};color:#000;border-color:#fff}
  .s-mercado-marcador{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:auto}
  .s-mercado-puntos{font-weight:600}
  .s-mercado-reiniciar{background:transparent;color:#fff;border-color:#fff}
  .s-mercado-nota{font-size:var(--step-small)}
  .s-mercado-juego[data-estado="preguntando"] .s-mercado-respuesta,.s-mercado-juego[data-estado="preguntando"] .s-mercado-final{display:none}
  .s-mercado-juego[data-estado="respondida"] .s-mercado-pregunta,.s-mercado-juego[data-estado="respondida"] .s-mercado-final{display:none}
  .s-mercado-juego[data-estado="fin"] .s-mercado-pregunta,.s-mercado-juego[data-estado="fin"] .s-mercado-respuesta{display:none}
  .s-mercado-matriz{grid-column:7 / 13;margin-right:calc(-1 * var(--margen));display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;min-height:max(528px,calc(100svh - 112px))}
  .s-mercado-cuadro{position:relative;overflow:hidden;background:var(--q);color:var(--qt);padding:22px 26px 26px;display:flex;flex-direction:column;min-width:0}
  .s-mercado-cuadro h3{position:relative;z-index:1;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-mercado-eje{position:relative;z-index:1;margin-top:8px;font-weight:600}
  .s-mercado-lista{position:relative;z-index:1;list-style:none;margin-top:14px;display:flex;flex-direction:column;gap:12px}
  .s-mercado-lista li{font-size:var(--step-body);line-height:1.35;max-width:30ch}
  .s-mercado-letra{position:absolute;right:-.02em;bottom:-.18em;z-index:0;font-family:var(--f-display);font-weight:700;font-size:min(19vw,34vh);line-height:.8;color:var(--ql);pointer-events:none;user-select:none}

  /* ---------- El muelle solo ---------- */
  .s-mercado-muelle{display:flex;flex-direction:column;justify-content:space-between}
  .s-mercado-muelle .s-mercado-foto img{top:-4%;height:126%;object-position:50% 0%}
  .s-mercado-muelle .s-mercado-credito{top:auto;bottom:48px}

  /* ---------- El entregable: media página ---------- */
  .s-mercado-entregable{position:relative;min-height:100svh;background:${CRE};color:#000;padding:112px var(--margen) 72px;display:grid;grid-template-columns:repeat(12,1fr);column-gap:var(--gap);row-gap:40px;align-items:center}
  .s-mercado-ent-texto{grid-column:1 / 6;display:flex;flex-direction:column;gap:22px}
  .s-mercado-ent-texto h2{font-size:var(--step-head)}
  .s-mercado-ent-lead{font-size:var(--step-lead);line-height:1.3}
  .s-mercado-pasos{padding-left:1.3em;display:flex;flex-direction:column;gap:12px}
  .s-mercado-pasos li{padding-left:.3em}
  .s-mercado-pasos li::marker{font-family:var(--f-display);font-weight:700}
  .s-mercado-pasos strong{font-weight:600}
  .s-mercado-hoja-fig{grid-column:7 / 13;margin:0;min-width:0}
  .s-mercado-hoja-fig figcaption{margin-top:12px;font-size:var(--step-small)}
  [data-ui].s-mercado-hoja{background:#fff;color:#000;border:2px solid #000;padding:26px 28px 28px;display:flex;flex-direction:column;gap:16px;font-size:14px;line-height:1.4}
  [data-ui] .s-mercado-h-tit{font-family:var(--f-display);font-weight:700;font-size:24px;letter-spacing:-.02em;line-height:1}
  [data-ui] .s-mercado-h-sub{font-weight:600;margin-top:-8px}
  [data-ui] .s-mercado-h-filas{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  [data-ui] .s-mercado-h-filas b,[data-ui] .s-mercado-h-dofa b{display:block;font-weight:600}
  [data-ui] .s-mercado-h-dofa{display:grid;grid-template-columns:1fr 1fr}
  [data-ui] .s-mercado-h-dofa p{padding:10px 12px 12px}

  @media (max-width:760px){
    .s-mercado-puesto,.s-mercado-dofa,.s-mercado-entregable{padding-left:20px;padding-right:20px}
    .s-mercado-texto,.s-mercado-figura,.s-mercado-contenedores,.s-mercado-claves,.s-mercado-juego,.s-mercado-ent-texto,.s-mercado-hoja-fig,
    .s-mercado-p-competencia .s-mercado-figura,.s-mercado-p-negocio .s-mercado-texto,.s-mercado-p-propuesta .s-mercado-texto,.s-mercado-p-dofa .s-mercado-texto{grid-column:1 / -1}
    .s-mercado-p-competencia .s-mercado-figura{margin-right:0}
    .s-mercado-matriz{grid-column:1 / -1;margin:0 -20px;min-height:0}
    .s-mercado-cuadro{min-height:240px}
    .s-mercado-credito{position:relative;top:auto;right:auto;text-align:left}
    [data-ui] .s-mercado-h-filas{grid-template-columns:1fr}
  }
  `,
  html:`
  <span class="ancla" data-parada="mercado"></span>
  <section class="s-mercado-apertura cap" id="mercado" data-campo="puerto-cobalto" style="--campo:${COB};--tinta:#fff" aria-labelledby="mercado-titulo">
    <div class="s-mercado-foto">
      <img src="${IMG}muelle-puerto-colombia.jpg" width="2400" height="1555" fetchpriority="high" decoding="async"
           alt="El muelle de Puerto Colombia entra al mar desde la playa; un hombre de pie sobre él mira hacia el horizonte.">
    </div>
    <p class="s-mercado-apoyo">El análisis de mercado valida si existe una demanda real y un entorno favorable para la solución de IA propuesta.</p>
    <p class="s-mercado-credito">Muelle de Puerto Colombia (1893), Atlántico. Foto: Javiercelia1, CC BY-SA 3.0.</p>
    <h2 class="s-mercado-titular" id="mercado-titulo"><span class="mask"><span class="in">Antes de zarpar:</span></span><span class="mask"><span class="in">¿alguien lo necesita?</span></span></h2>
  </section>

  <section class="s-mercado-puestos" id="mercado-puestos" data-campo="puerto-amarillo" aria-label="Los cinco puestos del análisis de mercado">
    <div class="s-mercado-pista">
      <span class="ancla" data-parada="mercado-segmento"></span>
      <div class="s-mercado-puesto s-mercado-p-segmento" data-campo="puerto-amarillo" style="--campo:${AMA};--tinta:#000;--gigante:#fff" role="group" aria-labelledby="mercado-segmento-t">
        <span class="s-mercado-gigante" aria-hidden="true" data-palabra="quiénes"></span>
        <div class="s-mercado-texto">
          <h3 id="mercado-segmento-t">¿Quiénes son los usuarios o clientes?</h3>
          <p class="s-mercado-guia"><strong>Segmento de mercado.</strong> Tamaño del mercado, características y necesidades específicas de quienes van a usar o pagar la solución.</p>
          <p class="s-mercado-dato">Primero, validen que existe demanda real para la solución: alguien que hoy tiene el problema.</p>
        </div>
        <figure class="s-mercado-figura">
          <div class="s-mercado-marco"><img src="${IMG}calle-de-barranquilla-riou.jpg" width="620" height="921" loading="lazy" decoding="async"
            alt="Grabado de una calle de Barranquilla en el siglo XIX: un vendedor con una bandeja, una mujer con un canasto de frutas en la cabeza y compradores con sombrero."></div>
          <figcaption>Una calle de Barranquilla. Grabado de Édouard Riou, siglo XIX.</figcaption>
        </figure>
      </div>

      <span class="ancla" data-parada="mercado-competencia"></span>
      <div class="s-mercado-puesto s-mercado-p-competencia" data-campo="puerto-cobalto" style="--campo:${COB};--tinta:#fff;--gigante:#000" role="group" aria-labelledby="mercado-competencia-t">
        <span class="s-mercado-gigante" aria-hidden="true" data-palabra="otros"></span>
        <div class="s-mercado-texto">
          <h3 id="mercado-competencia-t">¿Existen soluciones similares?</h3>
          <p class="s-mercado-guia"><strong>Análisis de competencia.</strong> ¿Cómo se diferencia su proyecto? Hagan benchmarking (comparación punto por punto) de herramientas de IA.</p>
          <p class="s-mercado-dato">Comparen al menos 2 alternativas en la misma tabla: qué hace cada una, para quién y a qué costo.</p>
        </div>
        <figure class="s-mercado-figura">
          <div class="s-mercado-marco"><img src="${IMG}calle-de-commerce-1853.jpg" width="1780" height="1040" loading="lazy" decoding="async"
            alt="Dibujo a lápiz de la Calle de Commerce de Barranquilla en 1853: casas de techo de paja, una junto a otra, a lo largo de una calle de tierra."></div>
          <figcaption>Calle de Commerce, Barranquilla, mayo de 1853. Dibujo de Frederic Edwin Church.</figcaption>
        </figure>
      </div>

      <span class="ancla" data-parada="mercado-propuesta"></span>
      <div class="s-mercado-puesto s-mercado-p-propuesta" data-campo="puerto-negro" style="--campo:#000;--tinta:#fff;--gigante:${COB}" role="group" aria-labelledby="mercado-propuesta-t">
        <span class="s-mercado-gigante" aria-hidden="true" data-palabra="valor"></span>
        <div class="s-mercado-texto">
          <h3 id="mercado-propuesta-t">¿Qué resuelve mejor que las alternativas actuales?</h3>
          <p class="s-mercado-guia"><strong>Propuesta de valor.</strong> El problema que su solución resuelve mejor que lo que hoy existe: esa es la ventaja competitiva de la IA.</p>
          <p class="s-mercado-dato">Escríbanla en una frase:</p>
          <p class="s-mercado-plantilla">Para <span class="s-mercado-hueco">quién</span> que <span class="s-mercado-hueco">necesita qué</span>, nuestra solución de IA <span class="s-mercado-hueco">hace qué</span>, a diferencia de <span class="s-mercado-hueco">la alternativa actual</span>.</p>
        </div>
      </div>

      <span class="ancla" data-parada="mercado-negocio"></span>
      <div class="s-mercado-puesto s-mercado-p-negocio" data-campo="puerto-crema" style="--campo:${CRE};--tinta:#000;--gigante:#fff" role="group" aria-labelledby="mercado-negocio-t">
        <span class="s-mercado-gigante" aria-hidden="true" data-palabra="cobro"></span>
        <div class="s-mercado-texto">
          <h3 id="mercado-negocio-t">¿Cómo se monetiza?</h3>
          <p class="s-mercado-guia"><strong>Modelo de negocio.</strong> Cinco vías frecuentes. Elijan la que su cliente sí pagaría.</p>
        </div>
        <ul class="s-mercado-contenedores" aria-label="Vías de monetización">
          <li class="s-mercado-contenedor s-mercado-c-saas" style="--c:${COB};--t:#fff"><strong>SaaS</strong><span>Software como servicio: suscripción para usarlo en la nube.</span></li>
          <li class="s-mercado-contenedor s-mercado-c-licencias" style="--c:${AMA};--t:#000"><strong>Licencias</strong><span>Pago por el derecho de instalar y usar el software o el modelo.</span></li>
          <li class="s-mercado-contenedor s-mercado-c-freemium" style="--c:${AMA};--t:#000"><strong>Freemium</strong><span>Lo básico es gratis; se cobra la versión completa.</span></li>
          <li class="s-mercado-contenedor s-mercado-c-consultoria" style="--c:#000;--t:#fff"><strong>Consultoría</strong><span>Proyectos a la medida de cada cliente.</span></li>
          <li class="s-mercado-contenedor s-mercado-c-integracion" style="--c:${COB};--t:#fff"><strong>Integración</strong><span>En un producto existente: la IA se vuelve una función de algo que ya se vende.</span></li>
        </ul>
      </div>

      <span class="ancla" data-parada="mercado-concepto"></span>
      <div class="s-mercado-puesto s-mercado-p-dofa" data-campo="puerto-cobalto" style="--campo:${COB};--tinta:#fff;--gigante:#000" role="group" aria-labelledby="mercado-concepto-t">
        <span class="s-mercado-gigante" aria-hidden="true" data-palabra="DOFA"></span>
        <div class="s-mercado-texto">
          <h3 id="mercado-concepto-t">¿Qué juega a favor y qué en contra?</h3>
          <p class="s-mercado-guia"><strong>Análisis DOFA.</strong> Debilidades, oportunidades, fortalezas y amenazas del proyecto en su contexto de mercado.</p>
          <p class="s-mercado-dato">La matriz DOFA sintetiza el entorno competitivo en una sola vista.</p>
        </div>
        <div class="s-mercado-claves">
          <dl>
            <div><dt>Interno</dt><dd>Fortalezas y debilidades: dependen de ustedes.</dd></div>
            <div><dt>Externo</dt><dd>Oportunidades y amenazas: vienen del mercado, de la ley o de la competencia.</dd></div>
            <div><dt>Ayuda o daña</dt><dd>Lo que empuja el proyecto frente a lo que lo frena.</dd></div>
          </dl>
          <a class="boton" href="#mercado-dofa" data-ir="mercado-dofa">Clasifiquen la DOFA</a>
        </div>
      </div>
    </div>
  </section>

  <span class="ancla" data-parada="mercado-dofa"></span>
  <section class="s-mercado-dofa" id="mercado-dofa" data-campo="puerto-negro" aria-labelledby="mercado-dofa-t">
    <div class="s-mercado-juego" data-estado="preguntando">
      <h2 id="mercado-dofa-t"><span class="mask"><span class="in">Clasifiquen la DOFA</span></span></h2>
      <p class="s-mercado-intro"><strong>Proyecto de ejemplo:</strong> un modelo que predice qué clientes van a abandonar una empresa. La clase vota a mano alzada y aquí se marca lo que eligió la mayoría.</p>
      <div class="s-mercado-pregunta">
        <div class="s-mercado-carta">
          <p class="s-mercado-carta-texto"></p>
          <p class="s-mercado-carta-num"></p>
        </div>
        <div class="s-mercado-opciones" role="group" aria-label="¿En qué cuadrante va esta tarjeta?">${BOTONES}</div>
      </div>
      <div class="s-mercado-respuesta">
        <p class="s-mercado-veredicto"></p>
        <p class="s-mercado-porque"></p>
        <button class="boton s-mercado-siguiente" type="button">Siguiente tarjeta</button>
      </div>
      <div class="s-mercado-final">
        <p class="s-mercado-veredicto">La matriz quedó completa.</p>
        <p class="s-mercado-final-texto"></p>
        <a class="boton" href="#mercado-entregable" data-ir="mercado-entregable">Cómo se entrega</a>
      </div>
      <div class="s-mercado-marcador">
        <p class="s-mercado-puntos">Aciertos de la clase: 0 de 0</p>
        <button class="boton s-mercado-reiniciar" type="button">Reiniciar</button>
      </div>
      <p class="s-mercado-nota">Con el teclado: F, O, D o A eligen el cuadrante.</p>
      <p class="solo-lector s-mercado-vivo" aria-live="polite"></p>
    </div>
    <div class="s-mercado-matriz" role="group" aria-label="Matriz DOFA del proyecto de ejemplo">${CUADROS}
    </div>
  </section>

  <span class="ancla" data-parada="mercado-muelle"></span>
  <section class="s-mercado-muelle cap" data-campo="puerto-cobalto" style="--campo:${COB};--tinta:#fff" aria-labelledby="mercado-muelle-t">
    <div class="s-mercado-foto">
      <img src="${IMG}cabeza-del-muelle.jpg" width="1920" height="1440" loading="lazy" decoding="async"
           alt="La punta del muelle de Puerto Colombia queda sola en medio del mar, separada de la playa.">
    </div>
    <h2 class="s-mercado-sentencia" id="mercado-muelle-t"><span class="mask"><span class="in">Sin demanda,</span></span><span class="mask"><span class="in">el muelle queda solo.</span></span></h2>
    <p class="s-mercado-apoyo">Validar el mercado es comprobar, antes de construir el modelo, que alguien va a usar y a pagar lo que ustedes hagan.</p>
    <p class="s-mercado-credito">Sección caída del muelle de Puerto Colombia. Foto: Quillamwa, CC BY 3.0.</p>
  </section>

  <span class="ancla" data-parada="mercado-entregable"></span>
  <section class="s-mercado-entregable" id="mercado-entregable" data-campo="puerto-crema" aria-labelledby="mercado-entregable-t">
    <div class="s-mercado-ent-texto">
      <h2 id="mercado-entregable-t"><span class="mask"><span class="in">Media página</span></span><span class="mask"><span class="in">antes de zarpar</span></span></h2>
      <p class="s-mercado-ent-lead">El entregable del curso: un análisis de mercado resumido en media página.</p>
      <ol class="s-mercado-pasos">
        <li><strong>¿Quién necesita esta solución?</strong> Segmento, tamaño y necesidad específica.</li>
        <li><strong>¿Existen alternativas?</strong> Comparen al menos 2.</li>
        <li><strong>¿Cuál es la propuesta de valor única?</strong> Lo que resuelve mejor que las alternativas.</li>
        <li><strong>Matriz DOFA del proyecto.</strong> Lo interno y lo externo, lo que ayuda y lo que daña.</li>
      </ol>
    </div>
    <figure class="s-mercado-hoja-fig">
      <div class="s-mercado-hoja" data-ui>
        <p class="s-mercado-h-tit">Análisis de mercado resumido</p>
        <p class="s-mercado-h-sub">Proyecto de ejemplo: modelo que predice qué clientes van a abandonar la empresa</p>
        <div class="s-mercado-h-filas">
          <p><b>Quién lo necesita</b>El área de retención de una empresa que pierde clientes sin saber cuáles se van a ir.</p>
          <p><b>Alternativas</b>Descuentos masivos a todos los clientes, o el módulo de predicción de un proveedor.</p>
          <p><b>Propuesta de valor</b>Avisa a tiempo quién se va a ir y por qué, con los datos que la empresa ya tiene.</p>
        </div>
        <div class="s-mercado-h-dofa">
          <p style="background:${COB};color:#fff"><b>Fortalezas</b>Historial de compras, pagos y reclamos.</p>
          <p style="background:${CRE};color:#000"><b>Debilidades</b>Datos en tres sistemas sueltos.</p>
          <p style="background:${AMA};color:#000"><b>Oportunidades</b>Servicios en la nube para empezar sin servidores.</p>
          <p style="background:#000;color:#fff"><b>Amenazas</b>Un proveedor con un módulo listo; la Ley 1581 de 2012.</p>
        </div>
      </div>
      <figcaption>Así se vería con el proyecto de ejemplo. Las frases son de ejemplo; la de su proyecto sale de su propio análisis.</figcaption>
    </figure>
  </section>
  `,
  iniciar(ctx){
    const { gsap, ScrollTrigger, reducir, raiz, Clase:C } = ctx;
    const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];

    /* ================= Clasifiquen la DOFA (funciona siempre, con o sin movimiento) ================= */
    const dofa = $(".s-mercado-dofa"), juego = dofa.querySelector(".s-mercado-juego");
    const carta = juego.querySelector(".s-mercado-carta"), cTexto = carta.querySelector(".s-mercado-carta-texto"), cNum = carta.querySelector(".s-mercado-carta-num");
    const opciones = [...juego.querySelectorAll(".s-mercado-opciones .boton")];
    const resp = juego.querySelector(".s-mercado-respuesta"), veredicto = resp.querySelector(".s-mercado-veredicto"), porque = resp.querySelector(".s-mercado-porque");
    const sig = juego.querySelector(".s-mercado-siguiente"), rein = juego.querySelector(".s-mercado-reiniciar");
    const puntos = juego.querySelector(".s-mercado-puntos"), vivo = juego.querySelector(".s-mercado-vivo"), finTexto = juego.querySelector(".s-mercado-final-texto");
    const cuadros = {}, listas = {};
    dofa.querySelectorAll(".s-mercado-cuadro").forEach(q => { cuadros[q.dataset.c] = q; listas[q.dataset.c] = q.querySelector(".s-mercado-lista"); });
    let i = 0, aciertos = 0, hechas = 0, ocupado = false;

    const marcador = () => { puntos.textContent = `Aciertos de la clase: ${aciertos} de ${hechas}`; };
    function mostrar(animar){
      const t = TARJETAS[i];
      cTexto.textContent = t.t;
      cNum.textContent = `Tarjeta ${i + 1} de ${TARJETAS.length}`;
      juego.dataset.estado = "preguntando";
      if (animar && !reducir) gsap.fromTo(carta, { y:28, opacity:0 }, { y:0, opacity:1, duration:.45, ease:"power3.out", overwrite:true });
    }
    function trasResponder(){
      ocupado = false;
      juego.dataset.estado = "respondida";
      sig.textContent = i === TARJETAS.length - 1 ? "Ver la matriz completa" : "Siguiente tarjeta";
      sig.focus({ preventScroll:true });
    }
    function volar(li, listo){
      const a = carta.getBoundingClientRect(), b = li.getBoundingClientRect();
      const fantasma = carta.cloneNode(true);
      fantasma.classList.add("s-mercado-vuelo");
      fantasma.setAttribute("aria-hidden", "true");
      Object.assign(fantasma.style, { position:"fixed", left:a.left + "px", top:a.top + "px", width:a.width + "px", height:a.height + "px", margin:"0" });
      document.body.appendChild(fantasma);
      carta.style.visibility = "hidden";
      const escala = Math.min(1, b.width / a.width);
      gsap.timeline({ onComplete(){ fantasma.remove(); carta.style.visibility = ""; listo(); } })
        .to(fantasma, { x:b.left - a.left, y:b.top - a.top, scale:escala, rotation:gsap.utils.random(-5, 5), transformOrigin:"0 0", duration:.8, ease:"power3.inOut" })
        .to(fantasma, { opacity:0, duration:.25, ease:"power1.out" }, "-=.2")
        .fromTo(li, { opacity:0 }, { opacity:1, duration:.3, ease:"power1.out" }, "<")
        .fromTo(li.closest(".s-mercado-cuadro").querySelector("h3"), { scale:1.15 }, { scale:1, duration:.5, ease:"back.out(2)", transformOrigin:"0 50%" }, "<");
    }
    function responder(c){
      if (ocupado || juego.dataset.estado !== "preguntando") return;
      ocupado = true;
      const t = TARJETAS[i], acierto = c === t.c;
      hechas++; if (acierto) aciertos++;
      marcador();
      veredicto.textContent = acierto ? `Acertaron: es una ${CAT[t.c].n}.` : `Era una ${CAT[t.c].n}, no una ${CAT[c].n}.`;
      porque.textContent = t.por;
      vivo.textContent = `${veredicto.textContent} ${t.por}`;
      const li = document.createElement("li");
      li.textContent = t.corto;
      listas[t.c].appendChild(li);
      if (reducir) { trasResponder(); return; }
      li.style.opacity = "0";
      volar(li, trasResponder);
    }
    function terminar(){
      juego.dataset.estado = "fin";
      finTexto.textContent = `La clase acertó ${aciertos} de ${TARJETAS.length}. Así queda la DOFA del proyecto de ejemplo; la de su proyecto debe caber en media página.`;
      vivo.textContent = `La matriz quedó completa. ${finTexto.textContent}`;
      const ir = juego.querySelector(".s-mercado-final .boton");
      if (ir) ir.focus({ preventScroll:true });
    }
    function siguiente(){
      if (juego.dataset.estado !== "respondida") return;
      i++;
      if (i >= TARJETAS.length) { terminar(); return; }
      mostrar(true);
      opciones[0].focus({ preventScroll:true });
    }
    function reiniciar(){
      gsap.killTweensOf(carta);
      document.querySelectorAll(".s-mercado-vuelo").forEach(n => n.remove());
      carta.style.visibility = "";
      Object.values(listas).forEach(ul => { ul.textContent = ""; });
      i = 0; aciertos = 0; hechas = 0; ocupado = false;
      marcador(); vivo.textContent = "La actividad empezó de nuevo.";
      mostrar(true);
    }
    opciones.forEach(b => b.addEventListener("click", () => responder(b.dataset.c)));
    sig.addEventListener("click", siguiente);
    rein.addEventListener("click", reiniciar);
    /* Atajos F, O, D, A mientras la actividad está en pantalla */
    let enVista = false;
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { es.forEach(e => { enVista = e.isIntersecting && e.intersectionRatio >= .4; }); }, { threshold:[0, .4, .7, 1] }).observe(dofa);
    addEventListener("keydown", e => {
      if (!enVista || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      const k = e.key.toUpperCase();
      if (CAT[k] && juego.dataset.estado === "preguntando") { e.preventDefault(); responder(k); }
    });
    mostrar(false);

    /* ================= Recorrido de los puestos ================= */
    const sec = $(".s-mercado-puestos"), pista = sec.querySelector(".s-mercado-pista"), puestos = $$(".s-mercado-puesto");
    const PARADAS = ["mercado-segmento", "mercado-competencia", "mercado-propuesta", "mercado-negocio", "mercado-concepto"];
    if (reducir) return;   /* sin movimiento: los puestos quedan apilados, cada uno con su ancla y su campo */

    const horizontal = matchMedia("(min-width: 900px) and (min-height: 560px)").matches;
    if (horizontal){
      sec.classList.add("s-mercado-horizontal");
      /* en el recorrido fijado las anclas mentirían: se cambian por paradas calculadas */
      pista.querySelectorAll(".ancla[data-parada]").forEach(a => a.removeAttribute("data-parada"));
      /* la cabecera toma la tinta del puesto que está debajo; el núcleo solo mira campos verticales */
      puestos.forEach(p => { p.dataset.campoPuesto = p.dataset.campo; p.removeAttribute("data-campo"); });
      const docRaiz = document.documentElement;
      const tintar = prog => {
        const k = Math.max(0, Math.min(puestos.length - 1, Math.round(prog * (puestos.length - 1))));
        const c = C.campos[puestos[k].dataset.campoPuesto]; if (!c) return;
        docRaiz.style.setProperty("--h-ink", c.ink); docRaiz.style.setProperty("--h-btn-bg", c.btn[0]); docRaiz.style.setProperty("--h-btn-ink", c.btn[1]);
      };
      /* solo mientras el recorrido está activo: si un salto lo cruza entero, manda el campo donde se aterriza */
      const tintarSi = s => { if (s.isActive) tintar(s.progress); };
      const distancia = () => Math.max(0, pista.scrollWidth - sec.clientWidth);
      const viaje = gsap.to(pista, { x:() => -distancia(), ease:"none",
        scrollTrigger:{ trigger:sec, start:"top top", end:() => "+=" + distancia(), pin:true, scrub:.6, anticipatePin:1, invalidateOnRefresh:true,
          onUpdate:tintarSi, onToggle:tintarSi } });
      const st = viaje.scrollTrigger;
      PARADAS.forEach((id, k) => C.parada(id, () => st.start + (st.end - st.start) * (k / (PARADAS.length - 1))));

      /* Movimiento firma: la palabra gigante de cada puesto viaja a otra velocidad que el muelle */
      puestos.forEach((p, k) => {
        const inicio = k ? "left right" : "left left";
        gsap.fromTo(p.querySelector(".s-mercado-gigante"), { xPercent:k ? 24 : 0 }, { xPercent:-34, ease:"none",
          scrollTrigger:{ trigger:p, containerAnimation:viaje, start:inicio, end:"right left", scrub:true } });
        const foto = p.querySelector(".s-mercado-marco img");
        if (foto) gsap.fromTo(foto, { xPercent:5 }, { xPercent:-5, ease:"none", scrollTrigger:{ trigger:p, containerAnimation:viaje, start:inicio, end:"right left", scrub:true } });
        if (k) gsap.from(p.querySelectorAll(".s-mercado-texto > *, .s-mercado-claves"), { x:160, opacity:0, ease:"power2.out", stagger:.1,
          scrollTrigger:{ trigger:p, containerAnimation:viaje, start:"left 85%", end:"left 30%", scrub:true } });
      });
      /* Los contenedores bajan como de una grúa: primero la fila de abajo */
      const cont = cl => $(".s-mercado-c-" + cl);
      gsap.from(["licencias", "consultoria", "integracion", "saas", "freemium"].map(cont), { yPercent:-170, opacity:0, duration:.7, ease:"power3.out", stagger:.12,
        scrollTrigger:{ trigger:$(".s-mercado-p-negocio"), containerAnimation:viaje, start:"left 55%", toggleActions:"play none none reverse" } });
    } else {
      /* pantallas angostas: cada puesto entra por su cuenta */
      puestos.forEach(p => gsap.from(p.querySelectorAll(".s-mercado-texto > *"), { y:30, opacity:0, duration:.7, ease:"power3.out", stagger:.08,
        scrollTrigger:{ trigger:p, start:"top 70%", toggleActions:"play none none reverse" } }));
    }

    /* ================= Apertura: el muelle se mueve más lento que la página ================= */
    const hero = $(".s-mercado-apertura"), anclaHero = $('.ancla[data-parada="mercado"]');
    gsap.fromTo(hero.querySelector(".s-mercado-foto img"), { yPercent:7, scale:1.12 }, { yPercent:-5, scale:1.02, ease:"none",
      scrollTrigger:{ trigger:anclaHero, start:"top bottom", end:() => "+=" + innerHeight * 2, scrub:true, invalidateOnRefresh:true } });
    gsap.to(hero.querySelector(".s-mercado-titular"), { y:-70, ease:"none",
      scrollTrigger:{ trigger:anclaHero, start:"top top", end:() => "+=" + innerHeight, scrub:true, invalidateOnRefresh:true } });
    gsap.timeline({ scrollTrigger:{ trigger:anclaHero, start:"top 30%", toggleActions:"play none none reverse" } })
      .from(hero.querySelectorAll(".s-mercado-titular .in"), { yPercent:110, duration:1.1, ease:"power4.out", stagger:.12 })
      .from(hero.querySelectorAll(".s-mercado-apoyo, .s-mercado-credito"), { y:26, opacity:0, duration:.7, ease:"power3.out", stagger:.1 }, .3);

    /* ================= DOFA: los cuadrantes se destapan ================= */
    gsap.timeline({ scrollTrigger:{ trigger:dofa, start:"top 55%", toggleActions:"play none none reverse" } })
      .from(dofa.querySelectorAll("h2 .in"), { yPercent:110, duration:.9, ease:"power4.out" })
      .from(dofa.querySelectorAll(".s-mercado-cuadro"), { clipPath:"inset(0% 0% 100% 0%)", duration:.8, ease:"power3.inOut", stagger:.09 }, .1)
      .from(dofa.querySelectorAll(".s-mercado-intro, .s-mercado-pregunta, .s-mercado-marcador, .s-mercado-nota"), { y:26, opacity:0, duration:.6, ease:"power3.out", stagger:.07 }, .25);

    /* ================= El muelle solo ================= */
    const muelle = $(".s-mercado-muelle"), anclaMuelle = $('.ancla[data-parada="mercado-muelle"]');
    gsap.fromTo(muelle.querySelector(".s-mercado-foto img"), { yPercent:3, scale:1.08 }, { yPercent:-6, scale:1, ease:"none",
      scrollTrigger:{ trigger:anclaMuelle, start:"top bottom", end:() => "+=" + innerHeight * 2, scrub:true, invalidateOnRefresh:true } });
    gsap.timeline({ scrollTrigger:{ trigger:anclaMuelle, start:"top 40%", toggleActions:"play none none reverse" } })
      .from(muelle.querySelectorAll(".s-mercado-sentencia .in"), { yPercent:110, duration:1.1, ease:"power4.out", stagger:.12 })
      .from(muelle.querySelectorAll(".s-mercado-apoyo, .s-mercado-credito"), { y:24, opacity:0, duration:.7, ease:"power3.out", stagger:.1 }, .4);

    /* ================= El entregable: la hoja cae sobre la mesa ================= */
    const ent = $(".s-mercado-entregable");
    gsap.timeline({ scrollTrigger:{ trigger:ent, start:"top 60%", toggleActions:"play none none reverse" } })
      .from(ent.querySelectorAll("h2 .in"), { yPercent:110, duration:1, ease:"power4.out", stagger:.1 })
      .from(ent.querySelectorAll(".s-mercado-ent-lead, .s-mercado-pasos li"), { y:24, opacity:0, duration:.6, ease:"power3.out", stagger:.08 }, .25)
      .from(ent.querySelector(".s-mercado-hoja"), { yPercent:14, rotation:-4, opacity:0, duration:1, ease:"power3.out" }, .2)
      .from(ent.querySelectorAll(".s-mercado-h-dofa p"), { scale:.9, opacity:0, duration:.45, ease:"back.out(1.7)", stagger:.08 }, .8);
  }
});
})();
