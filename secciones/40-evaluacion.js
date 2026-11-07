/* secciones/40-evaluacion.js — La carga: evaluación técnica, legal y financiera de proyectos de IA,
   con la calculadora "manifiesto de carga" (CAPEX, OPEX, beneficio, ROI, payback, VPN y TIR).
   Paleta del acto. Contrastes calculados con la fórmula WCAG (Clase.util.contraste):
   negro sobre kraft #d9c4a0 12,35 · blanco sobre verde billete #1e4a2a 10,15 · kraft sobre verde 5,97 ·
   negro sobre naranja #ff6831 7,28 · naranja sobre negro 7,28 · naranja sobre verde 3,52 (solo texto grande) ·
   naranja sobre kraft 1,70 (por eso el agua del gráfico nunca lleva texto naranja y sus barras van en negro). */
(() => {
"use strict";
const { num, cop, pct } = Clase.util;

const KRAFT = "#d9c4a0", BILLETE = "#1e4a2a";
Clase.campo("carga-kraft",   { bg:KRAFT,     ink:"#000000", btn:["#000000", KRAFT] });
Clase.campo("carga-negro",   { bg:"#000000", ink:"#ffffff", btn:["#ff6831", "#000000"] });
Clase.campo("carga-billete", { bg:BILLETE,   ink:"#ffffff", btn:[KRAFT, "#000000"] });

const IMG = "img/evaluacion/assets/";
const TASA = 0.12, ANIOS = 3, MESES = 36;

/* ------------------------------------------------------------ contenido de las diapositivas */
const TECNICA = [
  { n:"Viabilidad del modelo", d:"¿Los datos permiten entrenar? Volumen, calidad y etiquetas suficientes." },
  { n:"Infraestructura", d:"Dónde corre: en la nube (cloud), en servidores propios (on-premise) o en el dispositivo (edge)." },
  { n:"Métricas de desempeño", d:"Accuracy, F1, AUC-ROC, MAE: la métrica depende del tipo de modelo." },
  { n:"Latencia y escalabilidad", d:"Cuánto tarda el sistema en responder y cuánta demanda aguanta." },
  { n:"Integración", d:"Requerimientos para conectarse con los sistemas que ya existen." },
  { n:"Mantenimiento", d:"Plan de mantenimiento y de reentrenamiento del modelo." }
];
const METRICAS = [
  ["Accuracy", "proporción de predicciones correctas."],
  ["F1", "equilibrio entre precisión y exhaustividad (recall)."],
  ["AUC-ROC", "qué tan bien separa las clases en todos los umbrales."],
  ["MAE", "error absoluto medio, en modelos de regresión."]
];
const CLAUSULAS = [
  { n:"Propiedad intelectual", d:"Derechos sobre el modelo y sobre los datos con que se entrena." },
  { n:"Decisiones automatizadas", d:"Quién responde por lo que decide el sistema." },
  { n:"Regulación sectorial", d:"Salud, finanzas y educación tienen reglas propias." },
  { n:"Auditoría y explicabilidad", d:"XAI (IA explicable) requerida: poder auditar y explicar cada decisión." }
];
const FINANZAS = [
  { t:"CAPEX", d:"Inversión inicial: hardware, licencias y desarrollo inicial." },
  { t:"OPEX", d:"Costo de operar cada año: nube, mantenimiento y equipo continuo." },
  { t:"VPN", d:"Valor Presente Neto: lo que devuelve, traído a pesos de hoy, menos la inversión." },
  { t:"TIR", d:"Tasa Interna de Retorno: la tasa a la que el VPN da cero." },
  { t:"Payback", d:"Período de recuperación: en cuántos meses vuelve la inversión." },
  { t:"ROI", d:"Retorno sobre la inversión del proyecto de IA, en porcentaje." }
];
/* Rubros del documento del curso (3.3). Valores de ejemplo, rotulados así en la página. */
const RUBROS = [
  { id:"desarrollo",   n:"Desarrollo e implementación" },
  { id:"infra",        n:"Infraestructura cloud / servidores" },
  { id:"licencias",    n:"Licencias y herramientas" },
  { id:"capacitacion", n:"Capacitación y gestión del cambio" },
  { id:"otros",        n:"Otros" }
];
const EJEMPLOS = {
  flota: { desarrollo:180000000, infra:45000000, licencias:25000000, capacitacion:20000000, otros:10000000, opex:60000000, beneficio:210000000 },
  hunde: { desarrollo:180000000, infra:45000000, licencias:25000000, capacitacion:20000000, otros:10000000, opex:160000000, beneficio:210000000 }
};

/* ------------------------------------------------------------ cálculo */
function tirBiseccion(flujos){
  const f = r => flujos.reduce((s, x, t) => s + x / Math.pow(1 + r, t), 0);
  let lo = -0.99, hi = 10, flo = f(lo);
  const fhi = f(hi);
  if (!isFinite(flo) || !isFinite(fhi) || flo * fhi > 0 || (flo === 0 && fhi === 0)) return null;
  for (let i = 0; i < 200; i++){
    const m = (lo + hi) / 2, fm = f(m);
    if (fm === 0) return m;
    if ((flo < 0) === (fm < 0)){ lo = m; flo = fm; } else hi = m;
  }
  return (lo + hi) / 2;
}
function calcular(v){
  const capex = RUBROS.reduce((s, r) => s + v[r.id], 0);
  const bn = v.beneficio - v.opex;
  const flujos = [-capex];
  for (let t = 1; t <= ANIOS; t++) flujos.push(bn);
  const factores = flujos.map((_, t) => 1 / Math.pow(1 + TASA, t));
  const vp = flujos.map((f, t) => f * factores[t]);
  const vpn = vp.reduce((s, x) => s + x, 0);
  const roi = capex > 0 ? (bn * ANIOS - capex) / capex * 100 : NaN;
  const payback = capex <= 0 ? 0 : bn > 0 ? capex / bn * 12 : Infinity;
  const tir = capex > 0 ? tirBiseccion(flujos) : null;
  const saldo = Array.from({ length:MESES + 1 }, (_, m) => -capex + bn * m / 12);
  return { v, capex, bn, flujos, factores, vp, vpn, roi, payback, tir, saldo };
}

/* ------------------------------------------------------------ piezas de html */
const UNID = 41.5;                                                   /* 37 barras + 3 huecos de año */
const izqMes = m => m + 1.5 * ((m >= 1) + (m >= 13) + (m >= 25));
const centroMes = m => (izqMes(m) + .35) / UNID * 100;
const barrasMes = Array.from({ length:MESES + 1 }, (_, m) =>
  `<i class="ev-barra" style="left:${(izqMes(m) / UNID * 100).toFixed(3)}%;width:${(.7 / UNID * 100).toFixed(3)}%"></i>`).join("");
const ejesMes = [["Hoy", centroMes(0)], ["Año 1", (centroMes(1) + centroMes(12)) / 2], ["Año 2", (centroMes(13) + centroMes(24)) / 2], ["Año 3", (centroMes(25) + centroMes(36)) / 2]]
  .map(([t, x]) => `<li style="left:${x.toFixed(3)}%">${t}</li>`).join("");
const filaInput = (id, n, extra = "") => `
  <div class="ev-fila">
    <label for="evaluacion-${id}">${n}</label>
    <input id="evaluacion-${id}" data-campo-ev="${id}" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" ${extra}>
  </div>`;

Clase.seccion({
  id:"evaluacion",
  orden:40,
  indice:{ texto:"¿Cuánto pesa la carga?", ir:"evaluacion", nota:"Evaluación técnica, legal y financiera, y la calculadora de CAPEX, OPEX, ROI, payback, VPN y TIR" },
  creditos:[
    "«Wool bales being loaded into the hold of MAGDALENE VINNEN, March 1933», Australian National Maritime Museum, sin restricciones de derechos conocidas, vía <a href=\"https://commons.wikimedia.org/wiki/File:Wool_bales_being_loaded_into_the_hold_of_MAGDALENE_VINNEN,_March_1933_(6958063402).jpg\">Wikimedia Commons</a>. En el acto La carga, recortada y en duotono.",
    "«Antigua Aduana de Barranquilla», Jdvillalobos, <a href=\"https://creativecommons.org/licenses/by/3.0/deed.es\">CC BY 3.0</a>, vía <a href=\"https://commons.wikimedia.org/w/index.php?curid=4233727\">Wikimedia Commons</a>. En el acto La carga, recortada y en duotono.",
  ],
  css:`
  .s-evaluacion{--k:#d9c4a0;--k2:#cdb68e;--v:#1e4a2a;--n:#ff6831;--n2:#b3400f;--n3:#8f3510;--cab:104px;--col:calc((100% - 2 * var(--margen) - 11 * var(--gap)) / 12 + var(--gap))}
  .s-evaluacion.cap{padding:var(--cab) var(--margen) 28px}
  .s-evaluacion h2{font-size:var(--step-head)}
  .s-evaluacion h3{font-size:var(--step-lead);letter-spacing:-.02em;line-height:1.02}
  .s-evaluacion .ev-texto{font-size:var(--step-body);line-height:1.5;max-width:58ch}
  .s-evaluacion .ev-pie{font-size:var(--step-small);line-height:1.45;max-width:46ch}
  .s-evaluacion .boton{background:#000;color:var(--k);border-color:#000}
  .s-evaluacion .boton:focus-visible{outline-color:#000}
  .s-evaluacion .ev-impreso{display:block}

  /* ---------- Apertura: el titular se imprime, la carga cuelga de la grúa */
  .s-evaluacion.ev-apertura{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:auto 1fr;column-gap:var(--gap);color:#000}
  .s-evaluacion .ev-titular{grid-column:1 / -1;grid-row:1;position:relative;z-index:2;font-size:var(--step-display);line-height:.88}
  .s-evaluacion .ev-linea{display:block;position:relative;width:max-content;max-width:100%}
  .s-evaluacion .ev-tinta{display:inline-block;padding-bottom:.06em}
  .s-evaluacion .ev-cabezal{position:absolute;left:0;top:.02em;height:.86em;width:.12em;background:#000;opacity:0;pointer-events:none}
  .s-evaluacion .ev-foto{position:absolute;margin:0;right:0;bottom:0;top:calc(var(--cab) + var(--step-display) * 1.04);left:calc(var(--margen) + 5 * var(--col));overflow:hidden;background:var(--k)}
  .s-evaluacion .ev-foto img{position:absolute;left:0;top:-7%;width:100%;height:114%;object-fit:cover;object-position:52% 38%}
  .s-evaluacion .ev-entrada{grid-column:1 / 6;grid-row:2;align-self:end;display:flex;flex-direction:column;align-items:flex-start;gap:22px}
  .s-evaluacion .ev-entrada .ev-lead{font-size:var(--step-lead);line-height:1.3;font-weight:600;max-width:34ch}

  /* ---------- Inspección técnica: la puerta del contenedor */
  .s-evaluacion.ev-tecnica{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);color:#fff}
  .s-evaluacion .ev-tec-col{grid-column:1 / 5;display:flex;flex-direction:column;gap:18px;min-height:0}
  .s-evaluacion .ev-glosario{margin-top:auto}
  .s-evaluacion .ev-glosario h3{color:var(--n)}
  .s-evaluacion .ev-glosario dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin-top:14px;font-size:var(--step-body);line-height:1.35}
  .s-evaluacion .ev-glosario dt{font-weight:600}
  .s-evaluacion .ev-contenedor{grid-column:5 / 13;position:relative;background:var(--n3);padding:30px 26px 34px;min-height:0}
  .s-evaluacion .ev-puerta{position:relative;height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,minmax(0,1fr));grid-auto-flow:column;gap:14px 10px;background:var(--n2);list-style:none;margin:0;padding:0}
  .s-evaluacion .ev-puerta li{background:var(--n);color:#000;padding:16px 44px;display:flex;flex-direction:column;justify-content:center;gap:8px;min-height:0}
  .s-evaluacion .ev-puerta h3{color:#000}
  .s-evaluacion .ev-puerta p{font-size:var(--step-body);line-height:1.35;font-weight:600;max-width:34ch}
  .s-evaluacion .ev-herraje{position:absolute;inset:30px 26px 34px;pointer-events:none}
  .s-evaluacion .ev-herraje i{position:absolute;display:block;background:#000}
  .s-evaluacion .ev-junta{left:50%;top:-12px;bottom:-14px;width:10px;margin-left:-5px}
  .s-evaluacion .ev-varilla{left:var(--x);top:-20px;bottom:-22px;width:10px;margin-left:-5px}
  .s-evaluacion .ev-leva{left:var(--x);width:24px;height:12px;margin-left:-12px}
  .s-evaluacion .ev-leva.arriba{top:-24px}
  .s-evaluacion .ev-leva.abajo{bottom:-26px}
  .s-evaluacion .ev-manija{left:var(--x);top:calc((100% - 28px) * 2 / 3 + 16px);width:66px;height:10px;margin-left:var(--m)}
  .s-evaluacion .ev-cubo{left:var(--x);top:calc((100% - 28px) * 2 / 3 + 12px);width:18px;height:18px;margin-left:-9px}
  .s-evaluacion .ev-herraje i.ev-precinto{left:calc(50% + 56px);top:calc((100% - 28px) * 2 / 3 + 24px);width:16px;height:30px;background:var(--k);border:2px solid #000;rotate:8deg}
  .s-evaluacion .ev-marco{position:absolute;inset:0;pointer-events:none}
  .s-evaluacion .ev-marco i{position:absolute;display:block;background:#000}
  .s-evaluacion .ev-esquina{width:26px;height:22px}
  .s-evaluacion .ev-bisagra{width:12px;height:30px}

  /* ---------- Inspección legal: la aduana y sus sellos */
  .s-evaluacion.ev-legal{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);color:#000}
  .s-evaluacion .ev-aduana{position:absolute;left:0;top:var(--cab);bottom:0;width:calc(var(--margen) + 5 * var(--col) - var(--gap));margin:0;overflow:hidden;background:var(--k)}
  .s-evaluacion .ev-aduana img{width:100%;height:100%;object-fit:cover;object-position:50% 22%}
  .s-evaluacion .ev-aduana figcaption{position:absolute;left:0;bottom:0;background:var(--k);padding:12px 18px 12px var(--margen);font-size:var(--step-small);line-height:1.45;max-width:min(100%, 40ch)}
  .s-evaluacion .ev-legal-cuerpo{grid-column:6 / 13;display:flex;flex-direction:column;gap:20px;min-height:0}
  .s-evaluacion .ev-sellos{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:6px 0 4px;padding:0 6px}
  .s-evaluacion .ev-sello{border:4px solid currentColor;outline:2px solid currentColor;outline-offset:-12px;padding:22px 24px 20px;display:flex;flex-direction:column;gap:6px;rotate:-2.5deg}
  .s-evaluacion .ev-sello.verde{color:var(--v);rotate:2deg}
  .s-evaluacion .ev-sello b{font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.04em;line-height:.9}
  .s-evaluacion .ev-sello span{font-weight:600;font-size:var(--step-body);line-height:1.3}
  .s-evaluacion .ev-clausulas{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:22px 30px;margin:0;padding:0}
  .s-evaluacion .ev-clausulas p{font-size:var(--step-body);line-height:1.4;margin-top:8px}

  /* ---------- Inspección financiera: el libro en verde billete */
  .s-evaluacion.ev-financiera{display:flex;flex-direction:column;gap:30px;color:#fff}
  .s-evaluacion .ev-fin-cab{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);align-items:end}
  .s-evaluacion .ev-fin-cab h2{grid-column:1 / 7}
  .s-evaluacion .ev-fin-cab p{grid-column:7 / 13;font-size:var(--step-lead);line-height:1.3;font-weight:600}
  .s-evaluacion .ev-libro{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr);column-gap:var(--gap);row-gap:30px;margin:auto 0}
  .s-evaluacion .ev-libro dt{font-family:var(--f-display);font-weight:700;font-size:var(--step-display);letter-spacing:-.04em;line-height:.88;white-space:nowrap}
  .s-evaluacion .ev-libro dd{font-size:var(--step-body);line-height:1.4;margin-top:12px;max-width:32ch}
  .s-evaluacion.ev-financiera .boton{align-self:flex-start;background:var(--k);color:#000;border-color:var(--k)}
  .s-evaluacion.ev-financiera .boton:focus-visible{outline-color:#fff}

  /* ---------- La calculadora: el manifiesto de carga */
  .s-evaluacion.ev-calc{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:auto 1fr;column-gap:var(--gap);row-gap:16px;color:#000}
  .s-evaluacion .ev-calc-cab{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:8px 24px}
  .s-evaluacion .ev-calc-cab h2{flex:0 1 auto}
  .s-evaluacion .ev-calc-botones{display:flex;flex-wrap:wrap;gap:10px}
  .s-evaluacion .ev-calc-botones .boton{background:var(--k);color:#000}
  .s-evaluacion .ev-calc-botones .boton[aria-pressed="true"]{background:#000;color:var(--k)}
  .s-evaluacion .ev-calc-nota{flex-basis:100%;font-weight:600;font-size:var(--step-body)}
  .s-evaluacion .ev-manifiesto{grid-column:1 / 6;display:flex;flex-direction:column;gap:12px;min-height:0;margin:0}
  .s-evaluacion .ev-grupo{display:flex;flex-direction:column}
  .s-evaluacion .ev-total{display:flex;justify-content:space-between;align-items:baseline;gap:16px;background:#000;color:var(--k);padding:11px 12px 9px;font-family:var(--f-display);font-weight:700;font-size:var(--step-lead);letter-spacing:-.02em;line-height:1}
  .s-evaluacion .ev-total b{position:relative;font-variant-numeric:tabular-nums;white-space:nowrap}
  .s-evaluacion .ev-total b.ev-reimpreso::after{content:"";position:absolute;inset:-3px -5px;background:var(--k);transform-origin:100% 50%;animation:ev-imprime .42s steps(7) forwards}
  @keyframes ev-imprime{from{transform:scaleX(1)}to{transform:scaleX(0)}}
  .s-evaluacion .ev-fila{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:44px;padding:0 12px;transition:background-color .2s}
  .s-evaluacion .ev-fila:hover,.s-evaluacion .ev-fila:focus-within{background:var(--k2)}
  .s-evaluacion .ev-fila label{font-size:var(--step-body);line-height:1.2;cursor:text}
  .s-evaluacion .ev-fila input{flex:none;width:7.4em;height:38px;font:600 var(--step-body)/1 var(--f-texto);font-variant-numeric:tabular-nums;text-align:right;color:#000;background:transparent;border:0;border-bottom:2px solid #000;border-radius:0;padding:0 2px}
  .s-evaluacion .ev-fila input:focus-visible{outline:3px solid #000;outline-offset:3px}
  .s-evaluacion .ev-nota-opex{font-size:var(--step-small);line-height:1.4;padding:0 12px 2px}
  .s-evaluacion .ev-resultados{grid-column:6 / 13;align-self:start;background:var(--v);color:#fff;padding:22px 28px 24px;display:flex;flex-direction:column;gap:16px}
  .s-evaluacion .ev-veredicto{display:flex;align-items:center;gap:24px}
  .s-evaluacion .ev-sello-v{flex:none;margin:0;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);line-height:.9;letter-spacing:-.03em;color:var(--k);border:4px solid currentColor;outline:2px solid currentColor;outline-offset:-11px;padding:18px 22px 12px;rotate:-4deg}
  .s-evaluacion .ev-sello-v[data-estado="hunde"]{color:var(--n)}
  .s-evaluacion .ev-sello-v[data-estado="ras"]{color:#fff}
  .s-evaluacion .ev-lectura{font-size:var(--step-body);line-height:1.4;margin:0}
  .s-evaluacion .ev-cifras{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 22px;margin:0}
  .s-evaluacion .ev-cifras > div{display:flex;flex-direction:column;gap:4px;min-width:0}
  .s-evaluacion .ev-cifras .ev-c-vpn{grid-column:1 / -1}
  .s-evaluacion .ev-cifras dt{font-weight:600;font-size:var(--step-body);line-height:1.25}
  .s-evaluacion .ev-cifras dd{margin:0}
  .s-evaluacion .ev-cifras dd b{display:block;font-family:var(--f-display);font-weight:700;font-size:var(--step-head);letter-spacing:-.03em;line-height:.95;font-variant-numeric:tabular-nums;white-space:nowrap}
  .s-evaluacion .ev-cifras dd b.ev-frase,.s-evaluacion .ev-cifras .ev-c-menor dd b{font-size:var(--step-lead);line-height:1.1;white-space:normal}
  .s-evaluacion .ev-cifras dd span{font-size:var(--step-body)}

  /* ---------- ¿Cuándo sale a flote?: flujo de caja, saldo, fórmulas */
  .s-evaluacion.ev-flujo{background:var(--k);color:#000;padding:120px var(--margen) 128px;display:flex;flex-direction:column;gap:56px}
  .s-evaluacion .ev-flujo-cab{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap);align-items:end}
  .s-evaluacion .ev-flujo-cab h2{grid-column:1 / 7}
  .s-evaluacion .ev-flujo-cab p{grid-column:7 / 13;font-size:var(--step-body);line-height:1.5}
  .s-evaluacion .ev-graficas{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--gap)}
  .s-evaluacion .ev-grafica{margin:0;min-width:0}
  .s-evaluacion .ev-grafica.anual{grid-column:1 / 6}
  .s-evaluacion .ev-grafica.mensual{grid-column:6 / 13}
  .s-evaluacion .ev-grafica figcaption{display:flex;flex-direction:column;gap:8px;margin-bottom:18px;min-height:5.4em}
  .s-evaluacion .ev-grafica figcaption p{font-size:var(--step-body);line-height:1.4;max-width:52ch}
  .s-evaluacion .ev-lienzo{position:relative;height:clamp(260px, 34vh, 340px);overflow:hidden;background:var(--k)}
  .s-evaluacion .ev-lienzo > i,.s-evaluacion .ev-lienzo > b,.s-evaluacion .ev-lienzo > span{position:absolute;top:0;display:block}
  .s-evaluacion .ev-lienzo > [hidden]{display:none}
  .s-evaluacion .ev-agua{left:0;right:0;height:100%;background:var(--n)}
  .s-evaluacion .ev-cero{left:0;right:0;height:3px;background:#000}
  .s-evaluacion .ev-barra{background:#000;transform-origin:50% 0}
  .s-evaluacion .ev-barra.arriba{background:var(--v)}
  .s-evaluacion .anual .ev-barra{left:calc(var(--i) * 25% + 5.5%);width:14%}
  .s-evaluacion .ev-valor{left:calc(var(--i) * 25%);width:25%;text-align:center;font-weight:600;font-size:var(--step-small);line-height:20px;font-variant-numeric:tabular-nums;white-space:nowrap}
  .s-evaluacion .ev-rotulo{font-weight:600;font-size:var(--step-small);line-height:20px;white-space:nowrap;font-variant-numeric:tabular-nums}
  .s-evaluacion .ev-inicio{padding:0 6px;background:var(--n)}
  .s-evaluacion .ev-flotacion{left:8px}
  .s-evaluacion .ev-fin{right:0;text-align:right}
  .s-evaluacion .ev-marca{left:0;height:100%;width:0}
  .s-evaluacion .ev-marca i{position:absolute;left:-1.5px;top:30px;bottom:0;width:3px;background:#000}
  .s-evaluacion .ev-marca b{position:absolute;top:4px;left:10px;font-weight:600;font-size:var(--step-small);line-height:20px;white-space:nowrap;background:var(--k);padding:0 6px}
  .s-evaluacion .ev-marca.izq b{left:auto;right:10px}
  .s-evaluacion .ev-ejes{position:relative;list-style:none;margin:10px 0 0;padding:0;height:26px;font-weight:600;font-size:var(--step-small)}
  .s-evaluacion .ev-ejes li{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
  .s-evaluacion .anual .ev-ejes li{left:calc(var(--i) * 25% + 12.5%)}
  .s-evaluacion .ev-ancla-interna{position:relative;top:-112px}

  /* ---------- Pantallas bajas, tabletas y teléfonos: los capítulos dejan de ser fijos */
  @media (max-height:700px) and (min-width:761px), (max-width:1100px){
    .s-evaluacion.cap{position:relative;height:auto;min-height:100svh;overflow:visible}
    .s-evaluacion .ev-contenedor{min-height:560px}
  }
  @media (max-width:1100px){
    .s-evaluacion.ev-apertura,.s-evaluacion.ev-tecnica,.s-evaluacion.ev-legal,.s-evaluacion.ev-calc{display:flex;flex-direction:column;gap:28px}
    .s-evaluacion .ev-foto,.s-evaluacion .ev-aduana{position:relative;inset:auto;left:auto;width:calc(100% + 2 * var(--margen));margin:0 calc(-1 * var(--margen));height:52svh}
    .s-evaluacion .ev-aduana figcaption{position:relative}
    .s-evaluacion .ev-libro{grid-template-columns:repeat(2,minmax(0,1fr))}
    .s-evaluacion .ev-grafica.anual,.s-evaluacion .ev-grafica.mensual{grid-column:1 / -1}
    .s-evaluacion .ev-graficas{row-gap:40px}
  }
  @media (max-width:760px){
    .s-evaluacion.cap{padding:96px 20px 40px}
    .s-evaluacion .ev-puerta{grid-template-columns:1fr;grid-auto-flow:row;grid-template-rows:none}
    .s-evaluacion .ev-herraje{display:none}
    .s-evaluacion .ev-sellos,.s-evaluacion .ev-clausulas,.s-evaluacion .ev-libro,.s-evaluacion .ev-cifras{grid-template-columns:1fr}
    .s-evaluacion .ev-fin-cab h2,.s-evaluacion .ev-fin-cab p,.s-evaluacion .ev-flujo-cab h2,.s-evaluacion .ev-flujo-cab p{grid-column:1 / -1}
    .s-evaluacion .ev-fila{flex-wrap:wrap;padding:6px 8px}
  }
  @media (prefers-reduced-motion:reduce){ .s-evaluacion .ev-total b.ev-reimpreso::after{display:none} }
  html.sin-movimiento .s-evaluacion .ev-total b.ev-reimpreso::after{display:none}
  `,
  html:`
  <span class="ancla" data-parada="evaluacion"></span>
  <section class="cap s-evaluacion ev-apertura" data-campo="carga-kraft" style="--campo:#d9c4a0;--tinta:#000" aria-labelledby="evaluacion-titulo">
    <h2 class="ev-titular" id="evaluacion-titulo">
      <span class="ev-linea"><span class="ev-tinta">¿Cuánto pesa</span><span class="ev-cabezal" aria-hidden="true"></span></span>
      <span class="ev-linea"><span class="ev-tinta">la carga?</span><span class="ev-cabezal" aria-hidden="true"></span></span>
    </h2>
    <figure class="ev-foto">
      <img src="${IMG}ev-fardos.jpg" width="1700" height="1355" fetchpriority="high" decoding="async" alt="Una grúa de muelle iza fardos de lana hacia la bodega de un velero de cuatro palos; abajo, en el muelle, estibadores y un camión con más fardos." aria-describedby="evaluacion-foto-pie">
    </figure>
    <div class="ev-entrada">
      <p class="ev-lead">Evaluación técnica, legal y financiera de su proyecto de IA: tres inspecciones y una cuenta antes de zarpar.</p>
      <a class="boton" href="#evaluacion-manifiesto" data-ir="evaluacion-manifiesto">Ir a la calculadora</a>
      <p class="ev-pie" id="evaluacion-foto-pie">Fardos de lana suben a la bodega del velero Magdalene Vinnen. Sídney, marzo de 1933. Australian National Maritime Museum.</p>
    </div>
  </section>

  <span class="ancla" data-parada="evaluacion-tecnica"></span>
  <section class="cap s-evaluacion ev-tecnica" data-campo="carga-negro" style="--campo:#000;--tinta:#fff" aria-labelledby="evaluacion-tecnica-t">
    <div class="ev-tec-col">
      <h2 id="evaluacion-tecnica-t"><span class="mask"><span class="in">Evaluación técnica</span></span></h2>
      <p class="ev-texto">¿Se puede construir, correr y mantener? Seis revisiones antes de subir el modelo al barco.</p>
      <div class="ev-glosario">
        <h3>Las métricas, en una línea</h3>
        <dl>${METRICAS.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl>
      </div>
    </div>
    <div class="ev-contenedor">
      <div class="ev-marco" aria-hidden="true">
        <i class="ev-esquina" style="left:0;top:0"></i><i class="ev-esquina" style="right:0;top:0"></i>
        <i class="ev-esquina" style="left:0;bottom:0"></i><i class="ev-esquina" style="right:0;bottom:0"></i>
        ${[18, 38, 62, 82].map(y => `<i class="ev-bisagra" style="left:7px;top:${y}%"></i><i class="ev-bisagra" style="right:7px;top:${y}%"></i>`).join("")}
      </div>
      <ul class="ev-puerta" aria-label="Las seis revisiones de la evaluación técnica">
        ${TECNICA.map(t => `<li><h3>${t.n}</h3><p>${t.d}</p></li>`).join("")}
      </ul>
      <div class="ev-herraje" aria-hidden="true">
        <i class="ev-junta"></i>
        ${[["18px", "0px"], ["calc(50% - 23px)", "-66px"], ["calc(50% + 23px)", "0px"], ["calc(100% - 18px)", "-66px"]].map(([x, m]) =>
          `<i class="ev-varilla" style="--x:${x}"></i><i class="ev-leva arriba" style="--x:${x}"></i><i class="ev-leva abajo" style="--x:${x}"></i><i class="ev-manija" style="--x:${x};--m:${m}"></i><i class="ev-cubo" style="--x:${x}"></i>`).join("")}
        <i class="ev-precinto"></i>
      </div>
    </div>
  </section>

  <span class="ancla" data-parada="evaluacion-legal"></span>
  <section class="cap s-evaluacion ev-legal" data-campo="carga-kraft" style="--campo:#d9c4a0;--tinta:#000" aria-labelledby="evaluacion-legal-t">
    <figure class="ev-aduana">
      <img src="${IMG}ev-aduana.jpg" width="1000" height="1200" loading="lazy" decoding="async" alt="Fachada de la Antigua Aduana de Barranquilla: frontón con la palabra Aduana, balcones y una galería de arcos.">
      <figcaption>Antigua Aduana de Barranquilla. Foto de Jdvillalobos, 2008, CC BY 3.0.</figcaption>
    </figure>
    <div class="ev-legal-cuerpo">
      <h2 id="evaluacion-legal-t"><span class="mask"><span class="in">Evaluación legal</span></span></h2>
      <p class="ev-texto">Lo que revisa la aduana antes de dejar pasar la carga: los datos de las personas, los derechos sobre el modelo y quién responde por lo que decide.</p>
      <div class="ev-sellos">
        <p class="ev-sello"><b>Ley 1581</b><span>de 2012: protección de datos personales en Colombia.</span></p>
        <p class="ev-sello verde"><b>GDPR</b><span>Reglamento europeo de datos, si el proyecto aplica en Europa.</span></p>
      </div>
      <ul class="ev-clausulas">
        ${CLAUSULAS.map(c => `<li><h3>${c.n}</h3><p>${c.d}</p></li>`).join("")}
      </ul>
    </div>
  </section>

  <span class="ancla" data-parada="evaluacion-financiera"></span>
  <section class="cap s-evaluacion ev-financiera" data-campo="carga-billete" style="--campo:#1e4a2a;--tinta:#fff" aria-labelledby="evaluacion-financiera-t">
    <div class="ev-fin-cab">
      <h2 id="evaluacion-financiera-t"><span class="mask"><span class="in">Evaluación financiera</span></span></h2>
      <p>Cuánto cuesta subir la carga, cuánto cuesta llevarla cada año y cuánto devuelve.</p>
    </div>
    <dl class="ev-libro">
      ${FINANZAS.map(f => `<div><dt><span class="ev-impreso">${f.t}</span></dt><dd>${f.d}</dd></div>`).join("")}
    </dl>
    <a class="boton" href="#evaluacion-manifiesto" data-ir="evaluacion-manifiesto">Hacer la cuenta de su proyecto</a>
  </section>

  <span class="ancla" data-parada="evaluacion-manifiesto"></span>
  <section class="cap s-evaluacion ev-calc" data-campo="carga-kraft" style="--campo:#d9c4a0;--tinta:#000" aria-labelledby="evaluacion-manifiesto-t">
    <div class="ev-calc-cab">
      <h2 id="evaluacion-manifiesto-t"><span class="mask"><span class="in">Manifiesto de carga</span></span></h2>
      <div class="ev-calc-botones">
        <button class="boton" type="button" data-ev-ejemplo="flota" aria-pressed="true">Valores de ejemplo</button>
        <button class="boton" type="button" data-ev-ejemplo="hunde" aria-pressed="false">Un proyecto que se hunde</button>
      </div>
      <p class="ev-calc-nota">Valores de ejemplo: cámbienlos por los de su proyecto. Todo se recalcula al escribir.</p>
    </div>
    <form class="ev-manifiesto" id="evaluacion-form" autocomplete="off" novalidate aria-label="Datos del proyecto en pesos colombianos">
      <div class="ev-grupo" role="group" aria-labelledby="evaluacion-g-capex">
        <p class="ev-total" id="evaluacion-g-capex"><span>Inversión inicial (CAPEX)</span><b id="evaluacion-capex-total"></b></p>
        ${RUBROS.map(r => filaInput(r.id, r.n)).join("")}
      </div>
      <div class="ev-grupo" role="group" aria-labelledby="evaluacion-g-anual">
        <p class="ev-total" id="evaluacion-g-anual"><span>Cada año</span><b id="evaluacion-bn-total"></b></p>
        ${filaInput("opex", "OPEX anual", 'aria-describedby="evaluacion-opex-nota"')}
        <p class="ev-nota-opex" id="evaluacion-opex-nota">Infraestructura cloud, mantenimiento del modelo, personal dedicado, licencias recurrentes.</p>
        ${filaInput("beneficio", "Beneficio anual esperado")}
      </div>
    </form>
    <div class="ev-resultados" role="region" aria-label="Resultados del manifiesto">
      <div class="ev-veredicto">
        <p class="ev-sello-v" id="evaluacion-sello" data-estado="flota">Flota</p>
        <p class="ev-lectura" id="evaluacion-lectura"></p>
      </div>
      <dl class="ev-cifras">
        <div class="ev-c-vpn"><dt>VPN a 3 años, tasa del 12%</dt><dd><b id="evaluacion-vpn"></b></dd></div>
        <div><dt>TIR</dt><dd><b id="evaluacion-tir"></b></dd></div>
        <div><dt>ROI a 3 años</dt><dd><b id="evaluacion-roi"></b></dd></div>
        <div><dt>Payback</dt><dd><b id="evaluacion-payback"></b><span id="evaluacion-payback-u">meses</span></dd></div>
        <div class="ev-c-menor"><dt>CAPEX total</dt><dd><b id="evaluacion-capex"></b></dd></div>
        <div class="ev-c-menor"><dt>Beneficio neto anual</dt><dd><b id="evaluacion-bn"></b></dd></div>
        <div class="ev-c-menor"><dt>Supuestos</dt><dd><b>3 años, 12%</b></dd></div>
      </dl>
      <p class="solo-lector" id="evaluacion-anuncio" aria-live="polite"></p>
    </div>
  </section>

  <span class="ancla" data-parada="evaluacion-flujo"></span>
  <section class="s-evaluacion ev-flujo" data-campo="carga-kraft" aria-labelledby="evaluacion-flujo-t">
    <div class="ev-flujo-cab">
      <h2 id="evaluacion-flujo-t"><span class="mask"><span class="in">¿Cuándo sale a flote?</span></span></h2>
      <p>Con los números del manifiesto: el proyecto arranca bajo el agua por la inversión y sale a flote el mes en que recupera lo que costó. Cambien un valor arriba y estas barras se mueven.</p>
    </div>
    <div class="ev-graficas">
      <figure class="ev-grafica anual">
        <figcaption><h3>Flujo de caja por año</h3><p>Año 0: la inversión. Años 1 a 3: el beneficio neto de cada año.</p></figcaption>
        <div class="ev-lienzo" id="evaluacion-anual" role="img">
          <i class="ev-agua"></i><i class="ev-cero"></i>
          ${[0, 1, 2, 3].map(i => `<i class="ev-barra" style="--i:${i}"></i><b class="ev-valor" style="--i:${i}"></b>`).join("")}
        </div>
        <ol class="ev-ejes">${[0, 1, 2, 3].map(i => `<li style="--i:${i}">Año ${i}</li>`).join("")}</ol>
      </figure>
      <figure class="ev-grafica mensual">
        <figcaption><h3>Saldo acumulado, mes a mes</h3><p>Bajo la línea de flotación falta recuperar la inversión; sobre ella, el proyecto ya devolvió lo que costó.</p></figcaption>
        <div class="ev-lienzo" id="evaluacion-mensual" role="img">
          <i class="ev-agua"></i><i class="ev-cero"></i>
          ${barrasMes}
          <span class="ev-rotulo ev-flotacion">Línea de flotación: saldo $0</span>
          <b class="ev-rotulo ev-inicio"></b><b class="ev-rotulo ev-fin"></b>
          <span class="ev-marca"><i></i><b></b></span>
        </div>
        <ol class="ev-ejes">${ejesMes}</ol>
      </figure>
    </div>
  </section>
  `,
  iniciar(ctx){
    const { gsap, ScrollTrigger, reducir, raiz } = ctx;
    const q = s => raiz.querySelector(s), qa = s => [...raiz.querySelectorAll(s)];

    /* ================================================= calculadora */
    const form = q("#evaluacion-form");
    const campos = qa("[data-campo-ev]");
    const porId = Object.fromEntries(campos.map(i => [i.dataset.campoEv, i]));
    const el = id => q("#evaluacion-" + id);
    const salida = { vpn:el("vpn"), tir:el("tir"), roi:el("roi"), payback:el("payback"), paybackU:el("payback-u"), capex:el("capex"), bn:el("bn") };
    const sello = el("sello"), lectura = el("lectura"), anuncio = el("anuncio");
    const totCapex = el("capex-total"), totBn = el("bn-total");
    const MAX = 9999999999999;

    const leer = s => { const d = String(s).replace(/\D/g, "").slice(0, 13); return d ? Math.min(Number(d), MAX) : 0; };
    const valores = () => Object.fromEntries(campos.map(i => [i.dataset.campoEv, leer(i.value)]));
    function formatear(inp){
      const enfoque = document.activeElement === inp;
      const pos = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
      const antes = inp.value.slice(0, pos).replace(/\D/g, "").length;
      const crudo = inp.value.replace(/\D/g, "");
      const txt = crudo === "" ? (enfoque ? "" : "$0") : cop(leer(crudo));
      inp.value = txt;
      if (enfoque){ let k = 0, i = 0; while (i < txt.length && k < antes){ if (/\d/.test(txt[i])) k++; i++; } if (!antes) i = txt.indexOf("$") + 1; inp.setSelectionRange(i, i); }
    }
    function cargar(ej){ const v = EJEMPLOS[ej]; campos.forEach(i => { i.value = cop(v[i.dataset.campoEv]); }); }

    /* textos de resultado */
    const textoTir = r => r.tir == null ? (r.capex <= 0 ? "No aplica: no hay inversión" : "No existe: ningún flujo compensa la inversión") : null;
    const textoPayback = r => r.capex <= 0 ? "No hay inversión que recuperar" : !isFinite(r.payback) ? "No se recupera" : null;
    const fmtRoi = x => pct(x, Math.abs(x) >= 100 ? 0 : 1);
    function veredicto(r){
      const mes = isFinite(r.payback) && r.capex > 0 ? num(r.payback, 1) : null;
      if (r.vpn > .5) return { estado:"flota", sello:"Flota",
        lectura:`El VPN es mayor que cero: a una tasa del 12%, el proyecto crea valor.${mes ? ` Recupera la inversión en el mes ${mes}.` : ""}` };
      if (r.vpn < -.5) return { estado:"hunde", sello:"Se hunde",
        lectura:`El VPN es menor que cero: a una tasa del 12%, el proyecto destruye valor.${mes ? (r.payback <= MESES ? ` Recupera la inversión en el mes ${mes}, pero no alcanza a rendir el 12%.` : ` Recuperaría la inversión en el mes ${mes}, después de los 3 años.`) : " Nunca recupera la inversión."}` };
      return { estado:"ras", sello:"A ras", lectura:"El VPN es cero: el proyecto rinde justo el 12% y no crea ni destruye valor." };
    }

    /* cifras grandes que cuentan */
    const pantalla = { vpn:0, tir:0, roi:0, payback:0 };
    let ultimo = null, estadoSello = "flota";
    function escribirCifras(r){
      salida.vpn.textContent = cop(pantalla.vpn);
      const tt = textoTir(r);
      salida.tir.textContent = tt || pct(pantalla.tir * 100, 1);
      salida.tir.classList.toggle("ev-frase", !!tt);
      salida.roi.textContent = isNaN(r.roi) ? "No aplica: no hay inversión" : fmtRoi(pantalla.roi);
      salida.roi.classList.toggle("ev-frase", isNaN(r.roi) || salida.roi.textContent.length > 7);
      const tp = textoPayback(r);
      salida.payback.textContent = tp || num(pantalla.payback, 1);
      salida.payback.classList.toggle("ev-frase", !!tp);
      salida.paybackU.hidden = !!tp;
    }
    function pintarCifras(r, animar, desdeCero){
      const meta = { vpn:r.vpn, tir:r.tir == null ? 0 : r.tir, roi:isNaN(r.roi) ? 0 : r.roi, payback:isFinite(r.payback) ? r.payback : 0 };
      if (desdeCero) Object.keys(pantalla).forEach(k => { pantalla[k] = 0; });
      if (animar) gsap.to(pantalla, Object.assign({ duration:desdeCero ? 1.3 : .6, ease:"power3.out", overwrite:true, onUpdate:() => escribirCifras(r), onComplete:() => escribirCifras(r) }, meta));
      else { gsap.killTweensOf(pantalla); Object.assign(pantalla, meta); escribirCifras(r); }
    }
    function pintarSello(r, animar){
      const v = veredicto(r);
      lectura.textContent = v.lectura;
      if (v.estado === estadoSello && sello.textContent === v.sello) return;
      estadoSello = v.estado; sello.dataset.estado = v.estado; sello.textContent = v.sello;
      if (animar) gsap.fromTo(sello, { scale:1.45, opacity:0 }, { scale:1, opacity:1, duration:.3, ease:"power3.in", overwrite:true });
    }
    function reimprimir(b, txt){
      if (b.textContent === txt) return;
      b.textContent = txt;
      if (reducir) return;
      b.classList.remove("ev-reimpreso"); void b.offsetWidth; b.classList.add("ev-reimpreso");
    }

    /* ---------- gráficas: barras que crecen desde la línea de flotación */
    const anual = q("#evaluacion-anual"), mensual = q("#evaluacion-mensual");
    const barrasA = [...anual.querySelectorAll(".ev-barra")], valoresA = [...anual.querySelectorAll(".ev-valor")];
    const barrasM = [...mensual.querySelectorAll(".ev-barra")];
    const inicioM = mensual.querySelector(".ev-inicio"), finM = mensual.querySelector(".ev-fin"), flotM = mensual.querySelector(".ev-flotacion");
    const marca = mensual.querySelector(".ev-marca"), marcaT = marca.querySelector("b");
    let graficasVivas = reducir;              /* sin movimiento, las barras se dibujan completas desde el inicio */
    function geometria(lienzo, vals){
      const H = lienzo.clientHeight || 300, P1 = 36, P2 = 30, hp = Math.max(60, H - P1 - P2);
      let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
      if (hi - lo < 1) hi = lo + 1;
      return { H, hp, lo, hi, u:hp / (hi - lo), cero:P1 + hi * hp / (hi - lo) };
    }
    function mover(objs, props, animar, extra){
      if (animar) gsap.to(objs, Object.assign({ duration:.55, ease:"power3.out", overwrite:"auto" }, props, extra || {}));
      else gsap.set(objs, props);
    }
    function pintarGraficas(r, animar, crecer){
      /* flujo por año */
      const ga = geometria(anual, r.flujos);
      gsap.set(barrasA, { height:ga.hp });
      mover(anual.querySelector(".ev-agua"), { y:ga.cero }, animar);
      mover(anual.querySelector(".ev-cero"), { y:ga.cero - 1.5 }, animar);
      r.flujos.forEach((f, i) => {
        const b = barrasA[i];
        b.classList.toggle("arriba", f > 0);
        const k = graficasVivas ? -f / (ga.hi - ga.lo) : 0;
        if (crecer){ gsap.set(b, { y:ga.cero, scaleY:0 }); gsap.to(b, { scaleY:-f / (ga.hi - ga.lo), duration:.8, ease:"power3.out", delay:.15 + i * .12, overwrite:"auto" }); }
        else mover(b, { y:ga.cero, scaleY:k }, animar);
        valoresA[i].textContent = cop(f);
        const yv = Math.max(2, Math.min(ga.H - 22, f >= 0 ? ga.cero - f * ga.u - 24 : ga.cero - f * ga.u + 6));
        if (crecer){ gsap.set(valoresA[i], { y:yv }); gsap.fromTo(valoresA[i], { opacity:0 }, { opacity:1, duration:.4, delay:.55 + i * .12, overwrite:"auto" }); }
        else mover(valoresA[i], { y:yv, opacity:graficasVivas ? 1 : 0 }, animar);
      });
      anual.setAttribute("aria-label", `Flujo de caja por año. Año 0: ${cop(r.flujos[0])}. Años 1, 2 y 3: ${cop(r.bn)} cada uno.`);
      /* saldo acumulado mes a mes */
      const gm = geometria(mensual, r.saldo);
      gsap.set(barrasM, { height:gm.hp });
      mover(mensual.querySelector(".ev-agua"), { y:gm.cero }, animar);
      mover(mensual.querySelector(".ev-cero"), { y:gm.cero - 1.5 }, animar);
      r.saldo.forEach((s, m) => {
        const b = barrasM[m];
        b.classList.toggle("arriba", s > 0);
        if (crecer){ gsap.set(b, { y:gm.cero, scaleY:0 }); gsap.to(b, { scaleY:-s / (gm.hi - gm.lo), duration:.5, ease:"power3.out", delay:.2 + m * .022, overwrite:"auto" }); }
        else mover(b, { y:gm.cero, scaleY:graficasVivas ? -s / (gm.hi - gm.lo) : 0 }, animar);
      });
      const W = mensual.clientWidth || 600, x0 = centroMes(0) / 100 * W;
      inicioM.textContent = `Inversión: ${cop(-r.capex)}`;
      inicioM.hidden = r.capex <= 0;
      mover(inicioM, { x:x0 + 12, y:gm.H - 25 }, animar);
      const s36 = r.saldo[MESES];
      finM.textContent = `Mes 36: ${cop(s36)}`;
      mover(finM, { y:s36 >= 0 ? Math.max(2, gm.cero - s36 * gm.u - 24) : Math.min(gm.H - 22, gm.cero - s36 * gm.u + 6) }, animar);
      mover(flotM, { y:Math.max(2, gm.cero - 26) }, animar);
      const pb = r.payback, haySalida = r.capex > 0 && isFinite(pb) && pb <= MESES;
      if (haySalida){
        const f = Math.floor(pb), c = Math.min(MESES, Math.ceil(pb));
        const x = (centroMes(f) + (centroMes(c) - centroMes(f)) * (pb - f)) / 100 * W;
        marca.hidden = false;
        marca.classList.toggle("izq", x > W * .62);
        marcaT.textContent = `Mes ${num(pb, 1)}: sale a flote`;
        mover(marca, { x }, animar);
      } else marca.hidden = true;
      if (crecer) gsap.fromTo([inicioM, finM, flotM, marca], { opacity:0 }, { opacity:1, duration:.45, delay:1, stagger:.12, overwrite:"auto" });
      else if (!graficasVivas) gsap.set([inicioM, finM, flotM, marca], { opacity:0 });
      const resumen = r.capex <= 0 ? "No hay inversión: el saldo arranca en cero." : haySalida ? `sale a flote en el mes ${num(pb, 1)}` : isFinite(pb) ? `sale a flote en el mes ${num(pb, 1)}, después de los 36 meses de la gráfica` : "nunca sale a flote";
      mensual.setAttribute("aria-label", `Saldo acumulado mes a mes: empieza en ${cop(-r.capex)}, ${resumen} y termina el mes 36 en ${cop(s36)}.`);
    }


    /* ---------- recalcular todo */
    let tAnuncio = 0;
    function recalcular(animar){
      const r = calcular(valores());
      ultimo = r;
      reimprimir(totCapex, cop(r.capex));
      reimprimir(totBn, `Neto: ${cop(r.bn)}`);
      salida.capex.textContent = cop(r.capex);
      salida.bn.textContent = cop(r.bn);
      pintarCifras(r, animar && !reducir);
      pintarSello(r, animar && !reducir);
      pintarGraficas(r, animar && !reducir && graficasVivas, false);
      clearTimeout(tAnuncio);
      tAnuncio = setTimeout(() => {
        const tt = textoTir(r), tp = textoPayback(r);
        anuncio.textContent = `${sello.textContent}. VPN ${cop(r.vpn)}. TIR ${tt || pct(r.tir * 100, 1)}. ROI a 3 años ${isNaN(r.roi) ? "no aplica" : fmtRoi(r.roi)}. Payback ${tp || num(r.payback, 1) + " meses"}.`;
      }, 700);
    }
    function marcarEjemplo(ej){ qa("[data-ev-ejemplo]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.evEjemplo === ej))); }

    form.addEventListener("submit", e => e.preventDefault());
    form.addEventListener("input", e => {
      const inp = e.target.closest("[data-campo-ev]"); if (!inp) return;
      formatear(inp); marcarEjemplo(null); recalcular(true);
    });
    form.addEventListener("focusout", e => { const inp = e.target.closest("[data-campo-ev]"); if (inp) formatear(inp); });
    form.addEventListener("keydown", e => {
      const inp = e.target.closest("[data-campo-ev]");
      if (!inp || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
      e.preventDefault();
      const paso = e.shiftKey ? 10000000 : 1000000;
      inp.value = cop(Math.max(0, Math.min(MAX, leer(inp.value) + (e.key === "ArrowUp" ? paso : -paso))));
      inp.setSelectionRange(inp.value.length, inp.value.length);
      marcarEjemplo(null); recalcular(true);
    });
    qa("[data-ev-ejemplo]").forEach(b => b.addEventListener("click", () => { cargar(b.dataset.evEjemplo); marcarEjemplo(b.dataset.evEjemplo); recalcular(true); }));

    cargar("flota");
    recalcular(false);
    let ancho = innerWidth, alto = innerHeight, tRz = 0;
    addEventListener("resize", () => {
      if (innerWidth === ancho && innerHeight === alto) return;
      ancho = innerWidth; alto = innerHeight;
      clearTimeout(tRz); tRz = setTimeout(() => { if (ultimo) pintarGraficas(ultimo, false, false); }, 150);
    });

    if (reducir) return;

    /* ================================================= movimiento (solo con movimiento) */
    const ancla = id => q(`[data-parada="${id}"]`);
    const imprimir = (tl, nodos, pos, cada = .07, dur = .42, pasos = 8) => nodos.forEach((n, i) =>
      tl.fromTo(n, { clipPath:"inset(-12% 100% -24% 0%)" }, { clipPath:"inset(-12% 0% -24% 0%)", duration:dur, ease:`steps(${pasos})`, clearProps:"clipPath" }, pos + i * cada));
    const subir = (tl, nodos, pos, cada = .08) => tl.from(nodos, { y:26, opacity:0, duration:.7, ease:"power3.out", stagger:cada }, pos);
    const mascara = (tl, sel, pos = 0) => tl.from(q(sel), { yPercent:108, duration:.9, ease:"power4.out" }, pos);

    /* Apertura: el titular se imprime renglón por renglón con su cabezal; la carga baja a su sitio */
    const tlA = gsap.timeline({ scrollTrigger:{ trigger:ancla("evaluacion"), start:"top 80%", toggleActions:"play none none none" } });
    qa(".ev-titular .ev-linea").forEach((l, i) => {
      const t = l.querySelector(".ev-tinta"), c = l.querySelector(".ev-cabezal"), w = t.offsetWidth, pos = .1 + i * .55;
      tlA.fromTo(t, { clipPath:"inset(-15% 100% -30% 0%)" }, { clipPath:"inset(-15% 0% -30% 0%)", duration:.6, ease:"steps(11)", clearProps:"clipPath" }, pos)
         .fromTo(c, { x:0, opacity:1 }, { x:w, duration:.6, ease:"steps(11)", immediateRender:false }, pos)
         .to(c, { opacity:0, duration:.12 }, pos + .62);
    });
    tlA.fromTo(q(".ev-foto"), { clipPath:"inset(0% 0% 100% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", duration:1.2, ease:"power3.out", clearProps:"clipPath" }, .2)
       .from(q(".ev-foto img"), { yPercent:-9, duration:1.4, ease:"power3.out" }, .2);
    subir(tlA, qa(".ev-entrada > *"), .9);
    /* Parallax: mientras la inspección técnica sube y tapa la apertura, la foto y el titular derivan */
    gsap.to(q(".ev-foto img"), { yPercent:6, ease:"none", scrollTrigger:{ trigger:ancla("evaluacion-tecnica"), start:"top bottom", end:"top top", scrub:true } });
    gsap.to(q(".ev-titular"), { y:-60, ease:"none", scrollTrigger:{ trigger:ancla("evaluacion-tecnica"), start:"top bottom", end:"top top", scrub:true } });

    /* Técnica: llega el contenedor y se imprimen sus seis revisiones */
    const tlT = gsap.timeline({ scrollTrigger:{ trigger:ancla("evaluacion-tecnica"), start:"top 70%", toggleActions:"play none none reverse" } });
    mascara(tlT, ".ev-tecnica h2 .in");
    subir(tlT, qa(".ev-tec-col > p, .ev-glosario"), .2);
    tlT.from(q(".ev-contenedor"), { xPercent:7, opacity:0, duration:.9, ease:"power3.out" }, .1);
    imprimir(tlT, qa(".ev-puerta h3, .ev-puerta p"), .6, .06, .36, 7);
    tlT.from(qa(".ev-varilla, .ev-manija, .ev-cubo, .ev-leva"), { scaleY:0, transformOrigin:"50% 0%", duration:.5, ease:"power3.out", stagger:.02 }, .5);

    /* Legal: la aduana se abre como persiana y caen los sellos */
    const tlL = gsap.timeline({ scrollTrigger:{ trigger:ancla("evaluacion-legal"), start:"top 70%", toggleActions:"play none none reverse" } });
    tlL.fromTo(q(".ev-aduana"), { clipPath:"inset(0% 100% 0% 0%)" }, { clipPath:"inset(0% 0% 0% 0%)", duration:1.1, ease:"power3.out", clearProps:"clipPath" }, 0);
    mascara(tlL, ".ev-legal h2 .in", .1);
    subir(tlL, qa(".ev-legal-cuerpo > .ev-texto"), .3);
    tlL.from(qa(".ev-sello"), { scale:1.5, opacity:0, duration:.3, ease:"power3.in", stagger:.28 }, .55);
    subir(tlL, qa(".ev-clausulas li"), 1.1, .07);

    /* Financiera: el libro se imprime cifra por cifra */
    const tlF = gsap.timeline({ scrollTrigger:{ trigger:ancla("evaluacion-financiera"), start:"top 70%", toggleActions:"play none none reverse" } });
    mascara(tlF, ".ev-financiera h2 .in");
    subir(tlF, qa(".ev-fin-cab p"), .2);
    imprimir(tlF, qa(".ev-libro .ev-impreso"), .35, .1, .4, 6);
    subir(tlF, qa(".ev-libro dd"), .55, .08);
    subir(tlF, qa(".ev-financiera > .boton"), 1.1);

    /* Calculadora: el manifiesto se imprime línea a línea, las cifras cuentan y cae el sello */
    const tlC = gsap.timeline({ scrollTrigger:{ trigger:ancla("evaluacion-manifiesto"), start:"top 70%", toggleActions:"play none none none",
      onEnter:() => { if (ultimo){ pintarCifras(ultimo, true, true); gsap.fromTo(sello, { scale:1.45, opacity:0 }, { scale:1, opacity:1, duration:.3, ease:"power3.in", delay:1.25, overwrite:true }); } } } });
    mascara(tlC, ".ev-calc h2 .in");
    subir(tlC, qa(".ev-calc-botones, .ev-calc-nota"), .15);
    imprimir(tlC, qa(".ev-manifiesto .ev-total, .ev-manifiesto .ev-fila, .ev-nota-opex"), .3, .07, .32, 9);
    tlC.from(q(".ev-resultados"), { clipPath:"inset(0% 0% 100% 0%)", duration:.8, ease:"power3.out", clearProps:"clipPath" }, .2);

    /* Flujo: las barras crecen desde la línea de flotación; las cuentas se imprimen */
    gsap.set(qa(".ev-valor"), { opacity:0 });
    ScrollTrigger.create({ trigger:ancla("evaluacion-flujo"), start:"top 55%", once:true,
      onEnter:() => { graficasVivas = true; if (ultimo) pintarGraficas(ultimo, false, true); } });
    const tlG = gsap.timeline({ scrollTrigger:{ trigger:ancla("evaluacion-flujo"), start:"top 70%", toggleActions:"play none none reverse" } });
    mascara(tlG, ".ev-flujo h2 .in");
    subir(tlG, qa(".ev-flujo-cab p, .ev-grafica figcaption"), .2);
  }
});
})();
