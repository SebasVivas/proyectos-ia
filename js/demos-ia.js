/* demos-ia.js
   Demos vivas de los 7 tipos de modelo de IA, figura de dispersion y logica del
   semaforo de viabilidad tecnica. No trae piel propia: cada pagina pasa su paleta
   y fuentes, y estiliza las clases "dia-*" de las demos DOM y del semaforo.

   Uso minimo:
     DemosIA.estilosBase();                                  // CSS estructural opcional
     const d = DemosIA.montar(el, "clustering", { paleta:{...}, lectura:spanEl });
     DemosIA.montarSemaforo(el, { onCambio: r => ... });     // r = evaluarSemaforo(valores)
   Tipos: dispersion, clasificacion, regresion, clustering, recomendacion, nlp, vision, generativa.
   Si GSAP esta cargado usa gsap.ticker; si no, requestAnimationFrame. Pausa lo que no esta en pantalla.
*/
(function (global) {
"use strict";

const PALETA_BASE = {
  tinta: "#111111", sec: "#57534B",
  acento: "#FF4F1A",            // rellenos (texto tinta encima)
  acentoLinea: "#C2380B",       // trazos y texto de acento
  acentoSuave: "rgba(255,79,26,0.13)",
  reticula: "#D0CDC7", fondo: "#F8F6F1", fondoAlt: "#F2EFE8", tela: "#E7E1D5",
  textoSobreTinta: "#F2EFE8",
  tintaSobreAcento: "#111111",  // texto encima de un relleno de acento
  fuenteMono: '"JetBrains Mono", ui-monospace, monospace',
  fuenteTexto: "system-ui, sans-serif"
};

/* ------------------------------------------------------------ Contenido */
const MODELOS = [
  { id:"clasificacion", n:"Clasificación",
    pregunta:"¿Aprobará este crédito? ¿Es spam? ¿Abandonará el cliente?",
    algos:"Random Forest · XGBoost · Redes Neuronales · SVM",
    cuando:"Predecir una categoría o clase entre opciones definidas.",
    sit:"Un banco recibe una solicitud con historial, ingresos y deudas del cliente.",
    alg:"XGBoost", mod:"decide APROBADO o RECHAZADO en milisegundos.",
    res:"10.000 solicitudes automatizadas al día",
    fig:"La frontera aprende a separar aprobados (●) de rechazados (○). Datos sintéticos." },
  { id:"regresion", n:"Regresión / Forecasting",
    pregunta:"¿Cuánto venderemos el próximo mes? ¿Cuál será la demanda?",
    algos:"Linear Regression · LSTM · Prophet · Gradient Boosting",
    cuando:"Predecir un valor numérico continuo o una serie de tiempo.",
    sit:"Un supermercado necesita saber cuánto pedir antes de que el producto se venza.",
    alg:"Prophet", mod:"predice la demanda con 3 semanas de anticipo por ítem.",
    res:"−30% desperdicio en perecederos",
    fig:"La recta se ajusta a la demanda semanal y proyecta 3 semanas. Datos sintéticos." },
  { id:"clustering", n:"Clustering",
    pregunta:"¿Qué segmentos de clientes tengo? ¿Qué transacciones son anómalas?",
    algos:"K-Means · DBSCAN · Hierarchical Clustering",
    cuando:"Agrupar datos sin etiquetas previas: exploración y segmentación.",
    sit:"Una EPS tiene 2 millones de afiliados pero no sabe quiénes necesitan atención preventiva.",
    alg:"K-Means", mod:"descubre 8 grupos naturales: crónicos, jóvenes, adultos mayores…",
    res:"Programas diferenciados por perfil de riesgo",
    fig:"K-means en vivo: los centroides (■) se mueven hasta que nadie cambia de grupo. Datos sintéticos." },
  { id:"recomendacion", n:"Recomendación",
    pregunta:"¿Qué producto mostrarle al cliente? ¿Qué contenido sugerir?",
    algos:"Collaborative Filtering · Matrix Factorization · Deep Learning",
    cuando:"Personalizar experiencias según comportamiento e historial.",
    sit:"Un estudiante termina un curso y no sabe qué seguir estudiando en la plataforma.",
    alg:"Collaborative Filtering", mod:"sugiere el próximo curso según perfiles similares.",
    res:"+45% tasa de completación de programas",
    fig:"Filtrado colaborativo: busca el perfil más parecido y sugiere lo que a ti te falta. Ilustrativo." },
  { id:"nlp", n:"NLP / Texto",
    pregunta:"¿Qué dice el cliente en sus quejas? ¿Cuál es el sentimiento?",
    algos:"BERT · GPT · spaCy · Word2Vec · Transformers",
    cuando:"Analizar, clasificar o generar lenguaje natural y texto.",
    sit:"Una aerolínea recibe miles de quejas en redes: ¿cómo priorizarlas todas?",
    alg:"BERT", mod:"detecta tema y urgencia, clasifica y escala al equipo correcto.",
    res:"50.000 comentarios procesados en tiempo real",
    fig:"Cada queja se etiqueta por tema y urgencia y se enruta. Demostración ilustrativa." },
  { id:"vision", n:"Visión Artificial",
    pregunta:"¿Hay defectos en producción? ¿Quién aparece en la imagen?",
    algos:"CNN · YOLO · ResNet · Vision Transformers (ViT)",
    cuando:"Procesar imágenes, video, detección de objetos y OCR.",
    sit:"Una fábrica textil inspecciona manualmente 200 metros de tela por minuto.",
    alg:"YOLO", mod:"detecta huecos, manchas y costuras irregulares en cada fotograma.",
    res:"99% precisión vs. 15% de error humano",
    fig:"La tela pasa bajo la cámara y cada defecto queda enmarcado. Demostración ilustrativa." },
  { id:"generativa", n:"IA Generativa",
    pregunta:"¿Podemos crear contenido automáticamente? ¿Resumir documentos?",
    algos:"GPT · LLaMA · Claude · Stable Diffusion · Gemini",
    cuando:"Generar texto, código, imágenes o audio desde una instrucción.",
    sit:"Un abogado tarda 4 horas redactando contratos comerciales desde cero.",
    alg:"Claude / GPT", mod:"genera un borrador completo a partir de una descripción breve.",
    res:"De 4 horas a 30 minutos de trabajo",
    fig:"Un borrador que se escribe a partir de una instrucción breve. Demostración ilustrativa." }
];

/* Rubrica de viabilidad tecnica (diapositiva 9) */
const RUBRICA = {
  niveles: { 5:"Excelente", 4:"Bueno", 3:"Aceptable", 2:"Deficiente", 1:"Crítico" },
  regla: "Un puntaje ≤2 en cualquier dimensión es señal de alerta — planifica cómo subirlo antes de iniciar el proyecto.",
  nota: "Un rojo no significa cancelar: significa planificar cómo resolverlo.",
  dimensiones: [
    { id:"datos", n:"Datos", ejemplo:4, d:{5:"Datos históricos abundantes, limpios, etiquetados y relevantes al problema",4:"Datos disponibles con limpieza menor o etiquetado parcial pendiente",3:"Datos incompletos o con ruido; requieren transformación significativa",2:"Datos escasos, mal estructurados o de baja calidad representativa",1:"Sin datos disponibles o inaccesibles por restricciones legales/técnicas"} },
    { id:"infra", n:"Infraestructura", ejemplo:4, d:{5:"Cloud/GPU disponible y configurado; equipo capacitado para operarlo",4:"Infraestructura disponible pero requiere configuración o ajuste inicial",3:"Infraestructura limitada; se necesita inversión adicional para escalar",2:"Solo on-premise obsoleto; sin capacidad de procesamiento adecuada",1:"Sin infraestructura técnica; modelo inviable en condiciones actuales"} },
    { id:"talento", n:"Talento", ejemplo:4, d:{5:"Equipo ML propio multidisciplinar + apoyo externo especializado",4:"Equipo con brechas puntuales cubiertas por consultoría externa",3:"Solo consultores externos; sin transferencia de conocimiento interna",2:"Personal de TI con conocimiento básico de IA, sin experiencia en ML",1:"Sin talento disponible; dependencia total de terceros sin garantías"} },
    { id:"gobernanza", n:"Gobernanza", ejemplo:2, d:{5:"Política aprobada, comité de ética activo y compliance vigente",4:"Política en proceso de aprobación; lineamientos provisionales activos",3:"Lineamientos informales; necesidad reconocida sin formalización",2:"Necesidad identificada pero sin ninguna acción concreta",1:"Sin estructura de gobernanza; riesgos legales y éticos no gestionados"} },
    { id:"integracion", n:"Integración", ejemplo:2, d:{5:"APIs disponibles, sistemas documentados e integración probada",4:"APIs parciales; integración viable con esfuerzo técnico moderado",3:"Requiere desarrollo de middleware; plazo estimable pero no trivial",2:"Sistemas legacy sin APIs; integración costosa y de alto riesgo técnico",1:"Integración inviable sin reemplazar sistemas existentes"} }
  ]
};

const ALGORITMOS = ["Random Forest","XGBoost","SVM","LSTM","Prophet","Gradient Boosting","K-Means","DBSCAN","Collaborative Filtering","BERT","spaCy","Transformers","YOLO","ResNet","ViT","GPT","LLaMA","Claude","Gemini","Stable Diffusion"];

/* ------------------------------------------------------------ Utilidades */
const fmt = (v, d = 2) => v.toFixed(d).replace(".", ",");
const pad = (n, w = 3) => String(n).padStart(w, "0");
function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r, m, s){ const u = 1 - r(), v = r(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const clamp01 = v => Math.max(0.03, Math.min(0.97, v));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function estadoDe(v){ return v >= 4 ? "verde" : v === 3 ? "ambar" : "rojo"; }
function evaluarSemaforo(valores){
  const dims = RUBRICA.dimensiones.map(d => ({ id:d.id, n:d.n, v:+valores[d.id], estado:estadoDe(+valores[d.id]), nivel:RUBRICA.niveles[+valores[d.id]], descriptor:d.d[+valores[d.id]] }));
  const enAlerta = dims.filter(d => d.v <= 2);
  const promedio = dims.reduce((s, d) => s + d.v, 0) / dims.length;
  return { dims, enAlerta, alerta: enAlerta.length > 0, promedio, promedioTexto: fmt(promedio, 1) };
}

/* ------------------------------------------------------------ Base */
class Lienzo {
  constructor(el, op = {}){
    this.el = el; this.op = op; this.C = Object.assign({}, PALETA_BASE, op.paleta || {});
    this.lecturaEl = op.lectura || null; this.onLectura = op.onLectura || null;
    this.visible = false; this.pausado = false; this.t = 0; this.semilla = op.semilla || 11;
    this.preparar();
    this.redimensionar(); this.init();
  }
  preparar(){
    this.cv = this.el.querySelector("canvas");
    if (!this.cv){ this.cv = document.createElement("canvas"); this.el.appendChild(this.cv); }
    Object.assign(this.cv.style, { position:"absolute", inset:"0", width:"100%", height:"100%", display:"block" });
    if (getComputedStyle(this.el).position === "static") this.el.style.position = "relative";
    this.ctx = this.cv.getContext("2d");
  }
  redimensionar(){
    if (!this.cv) return;
    const dpr = Math.min(2, global.devicePixelRatio || 1);
    this.w = this.el.clientWidth; this.h = this.el.clientHeight;
    this.cv.width = Math.max(1, Math.round(this.w * dpr)); this.cv.height = Math.max(1, Math.round(this.h * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.p) this.area(this.p);
  }
  init(){} update(){} draw(){}
  iniciar(){ this.activo = true; }
  leer(t){
    if (t === this._ult) return; this._ult = t;
    if (this.lecturaEl) this.lecturaEl.textContent = t;
    if (this.onLectura) this.onLectura(t);
  }
  mono(px = 15){ return `${px}px ${this.C.fuenteMono}`; }
  area(p = { l:64, r:24, t:24, b:52 }){ this.p = p; this.pw = this.w - p.l - p.r; this.ph = this.h - p.t - p.b; }
  X(u, max = 1){ return this.p.l + u / max * this.pw; }
  Y(v){ return this.h - this.p.b - v * this.ph; }
  ejes(xl, yl){
    const c = this.ctx, p = this.p, C = this.C;
    c.strokeStyle = C.reticula; c.lineWidth = 1;
    for (let k = 1; k <= 4; k++){
      const y = this.Y(k / 4); c.beginPath(); c.moveTo(p.l, y); c.lineTo(this.w - p.r, y); c.stroke();
      const x = p.l + k / 4 * this.pw; c.beginPath(); c.moveTo(x, p.t); c.lineTo(x, this.h - p.b); c.stroke();
    }
    c.strokeStyle = C.tinta; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(p.l, p.t - 8); c.lineTo(p.l, this.h - p.b); c.lineTo(this.w - p.r + 8, this.h - p.b); c.stroke();
    c.fillStyle = C.tinta;
    for (let k = 0; k <= 4; k++){
      const x = p.l + k / 4 * this.pw; c.fillRect(x - .75, this.h - p.b, 1.5, 7);
      const y = this.Y(k / 4); c.fillRect(p.l - 7, y - .75, 7, 1.5);
    }
    c.font = this.mono(); c.fillStyle = C.sec;
    c.textAlign = "right"; c.textBaseline = "top"; c.fillText(xl, this.w - p.r, this.h - p.b + 14);
    c.save(); c.translate(p.l - 22, p.t); c.rotate(-Math.PI / 2); c.textAlign = "right"; c.textBaseline = "bottom"; c.fillText(yl, 0, 0); c.restore();
  }
  limpiar(){ this.ctx.clearRect(0, 0, this.w, this.h); }
}

/* Demos DOM: sin canvas */
class LienzoDOM extends Lienzo {
  preparar(){ this.cv = null; }
  redimensionar(){}
}

/* ------------------------------------------------------------ Dispersion (portada) */
class Dispersion extends Lienzo {
  init(){
    this.area(this.op.area || { l:48, r:20, t:20, b:40 });
    const r = rng(5);
    this.pts = Array.from({ length:34 }, (_, i) => { const x = .04 + i / 33 * .92; return { x, y:clamp01(.18 + .62 * x + gauss(r, 0, .07)), d:r() * .35 + i * .035 }; });
    const n = this.pts.length, mx = this.pts.reduce((s, p) => s + p.x, 0) / n, my = this.pts.reduce((s, p) => s + p.y, 0) / n;
    let sxy = 0, sxx = 0; this.pts.forEach(p => { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; });
    this.m = sxy / sxx; this.b = my - this.m * mx; this.t = 0;
    this.activo = this.op.autoinicio !== false;
  }
  update(dt){ if (this.activo) this.t += dt; }
  draw(){
    if (!this.w) return;
    const c = this.ctx, C = this.C; this.limpiar(); this.ejes(this.op.ejeX || "x · variable", this.op.ejeY || "y · resultado");
    const t = this.t;
    this.pts.forEach(p => {
      const k = Math.max(0, Math.min(1, (t - p.d) / .35)); if (!k) return;
      const wob = Math.sin(t * 1.4 + p.x * 9) * 1.2;
      c.fillStyle = C.tinta; c.beginPath(); c.arc(this.X(p.x), this.Y(p.y) + wob, 4.2 * k, 0, 7); c.fill();
    });
    const kl = Math.max(0, Math.min(1, (t - 1.7) / 1.1));
    if (kl > 0){
      const e = 1 - Math.pow(1 - kl, 3);
      c.strokeStyle = C.acentoLinea; c.lineWidth = 3; c.beginPath();
      c.moveTo(this.X(0), this.Y(this.b)); c.lineTo(this.X(e), this.Y(this.b + this.m * e)); c.stroke();
    }
    const kr = Math.max(0, Math.min(1, (t - 2.8) / .8));
    if (kr > 0){
      c.strokeStyle = C.acentoLinea; c.globalAlpha = .5 * kr; c.lineWidth = 1;
      this.pts.forEach(p => { c.beginPath(); c.moveTo(this.X(p.x), this.Y(p.y)); c.lineTo(this.X(p.x), this.Y(this.b + this.m * p.x)); c.stroke(); });
      c.globalAlpha = 1;
    }
  }
}

/* ------------------------------------------------------------ Clasificacion: regresion logistica en vivo */
class Clasificacion extends Lienzo {
  init(){
    this.area(); const r = rng(this.semilla++);
    this.pts = [];
    for (let i = 0; i < 42; i++) this.pts.push({ x:clamp01(gauss(r, .66, .13)), y:clamp01(gauss(r, .64, .13)), c:1 });
    for (let i = 0; i < 42; i++) this.pts.push({ x:clamp01(gauss(r, .35, .13)), y:clamp01(gauss(r, .34, .14)), c:0 });
    this.w1 = (r() - .5) * 3; this.w2 = (r() - .5) * 3; this.b = (r() - .5) * 1.5;
    this.ep = 0; this.acc = 0; this.ac = 0; this.esp = 0; this.medir();
  }
  z(x, y){ return this.w1 * (x - .5) + this.w2 * (y - .5) + this.b; }
  medir(){ let ok = 0; this.pts.forEach(p => { p.ok = (this.z(p.x, p.y) > 0 ? 1 : 0) === p.c; ok += p.ok; }); this.acc = ok / this.pts.length; }
  paso(){
    let g1 = 0, g2 = 0, gb = 0; const n = this.pts.length;
    this.pts.forEach(p => { const s = 1 / (1 + Math.exp(-this.z(p.x, p.y))), e = s - p.c; g1 += e * (p.x - .5); g2 += e * (p.y - .5); gb += e; });
    const lr = 7; this.w1 -= lr * g1 / n; this.w2 -= lr * g2 / n; this.b -= lr * gb / n; this.ep++; this.medir();
  }
  update(dt){
    if (this.ep >= 110){ this.esp += dt; if (this.esp > 2.6) this.init(); return; }
    this.ac += dt; while (this.ac > .055){ this.ac -= .055; this.paso(); }
  }
  draw(){
    if (!this.w) return;
    const c = this.ctx, C = this.C; this.limpiar();
    const poli = [[0,0],[1,0],[1,1],[0,1]], sal = [];
    for (let i = 0; i < 4; i++){
      const a = poli[i], b = poli[(i + 1) % 4], za = this.z(a[0], a[1]), zb = this.z(b[0], b[1]);
      if (za > 0) sal.push(a);
      if ((za > 0) !== (zb > 0)){ const t = za / (za - zb); sal.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); }
    }
    if (sal.length > 2){ c.fillStyle = C.acentoSuave; c.beginPath(); sal.forEach((q, i) => i ? c.lineTo(this.X(q[0]), this.Y(q[1])) : c.moveTo(this.X(q[0]), this.Y(q[1]))); c.closePath(); c.fill(); }
    this.ejes(this.op.ejeX || "ingresos", this.op.ejeY || "historial de pago");
    const cruces = [];
    for (let i = 0; i < 4; i++){
      const a = poli[i], b = poli[(i + 1) % 4], za = this.z(a[0], a[1]), zb = this.z(b[0], b[1]);
      if ((za > 0) !== (zb > 0)){ const t = za / (za - zb); cruces.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); }
    }
    if (cruces.length >= 2){ c.strokeStyle = C.acentoLinea; c.lineWidth = 3; c.beginPath(); c.moveTo(this.X(cruces[0][0]), this.Y(cruces[0][1])); c.lineTo(this.X(cruces[1][0]), this.Y(cruces[1][1])); c.stroke(); }
    this.pts.forEach(p => {
      const x = this.X(p.x), y = this.Y(p.y);
      if (!p.ok){ c.strokeStyle = C.acentoLinea; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 10, 0, 7); c.stroke(); }
      c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, 5.5, 0, 7);
      if (p.c){ c.fillStyle = C.tinta; c.fill(); } else { c.fillStyle = C.fondo; c.fill(); c.strokeStyle = C.tinta; c.stroke(); }
    });
    c.font = this.mono(); c.textAlign = "left"; c.textBaseline = "middle"; c.fillStyle = C.tinta;
    c.fillText("● aprobado   ○ rechazado   ◯ error", this.p.l + 12, this.p.t + 10);
    this.leer(`época ${pad(this.ep)} · exactitud ${fmt(this.acc)}`);
  }
}

/* ------------------------------------------------------------ Regresion: descenso de gradiente */
class Regresion extends Lienzo {
  init(){
    this.area(); const r = rng(this.semilla++);
    this.max = 120; this.sem = 26; this.dom = 29;
    this.pts = Array.from({ length:this.sem }, (_, i) => ({ s:i + 1, u:40 + 1.7 * (i + 1) + gauss(r, 0, 6) }));
    this.a = 20; this.b = 0; this.it = 0; this.ac = 0; this.esp = 0; this.err = 0;
  }
  paso(){
    const n = this.pts.length; let ga = 0, gb = 0, se = 0;
    this.pts.forEach(p => { const x = (p.s - 13.5) / 13, e = this.a + this.b * x - p.u; ga += e; gb += e * x; se += e * e; });
    this.a -= .14 * ga / n; this.b -= .3 * gb / n; this.err = Math.sqrt(se / n); this.it++;
  }
  f(s){ return this.a + this.b * (s - 13.5) / 13; }
  update(dt){
    if (this.it >= 90){ this.esp += dt; if (this.esp > 3.2) this.init(); return; }
    this.ac += dt; while (this.ac > .05){ this.ac -= .05; this.paso(); }
  }
  draw(){
    if (!this.w) return;
    const c = this.ctx, C = this.C; this.limpiar(); this.ejes("semana", "unidades");
    const X = s => this.X(s, this.dom), Y = u => this.Y(u / this.max);
    c.strokeStyle = C.acentoLinea; c.globalAlpha = .55; c.lineWidth = 1;
    this.pts.forEach(p => { c.beginPath(); c.moveTo(X(p.s), Y(p.u)); c.lineTo(X(p.s), Y(this.f(p.s))); c.stroke(); });
    c.globalAlpha = 1;
    c.strokeStyle = C.acentoLinea; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), Y(this.f(0))); c.lineTo(X(this.sem), Y(this.f(this.sem))); c.stroke();
    if (this.it >= 90){
      const k = Math.min(1, this.esp / .8);
      c.setLineDash([8, 6]); c.beginPath(); c.moveTo(X(this.sem), Y(this.f(this.sem))); c.lineTo(X(this.sem + 3 * k), Y(this.f(this.sem + 3 * k))); c.stroke(); c.setLineDash([]);
      c.fillStyle = C.acentoSuave; c.fillRect(X(this.sem), this.p.t, X(this.sem + 3) - X(this.sem), this.ph);
      c.font = this.mono(); c.fillStyle = C.tinta; c.textAlign = "right"; c.textBaseline = "top";
      c.fillText("pronóstico · 3 semanas", X(this.dom) - 4, this.p.t + 6);
    }
    c.fillStyle = C.tinta; this.pts.forEach(p => { c.beginPath(); c.arc(X(p.s), Y(p.u), 4.5, 0, 7); c.fill(); });
    this.leer(`iteración ${pad(this.it)} · error medio ±${fmt(this.err, 1)} unidades`);
  }
}

/* ------------------------------------------------------------ Clustering: k-means */
class Clustering extends Lienzo {
  init(){
    this.area(); const r = rng(this.semilla++ * 7);
    const centros = [[.24,.72],[.72,.76],[.3,.26],[.76,.3]];
    this.pts = [];
    centros.forEach(([cx, cy]) => { for (let i = 0; i < 24; i++) this.pts.push({ x:clamp01(gauss(r, cx, .075)), y:clamp01(gauss(r, cy, .075)), k:-1 }); });
    const elegidos = new Set(); while (elegidos.size < 4) elegidos.add(Math.floor(r() * this.pts.length));
    this.cen = [...elegidos].map(i => ({ x:this.pts[i].x, y:this.pts[i].y, tx:this.pts[i].x, ty:this.pts[i].y, h:[[this.pts[i].x, this.pts[i].y]] }));
    this.it = 0; this.fase = 0; this.reloj = 0; this.cambios = 0; this.listo = false; this.esp = 0;
  }
  asignar(){
    let ch = 0;
    this.pts.forEach(p => { let mejor = 0, dm = 9; this.cen.forEach((q, j) => { const d = (p.x - q.tx) ** 2 + (p.y - q.ty) ** 2; if (d < dm){ dm = d; mejor = j; } }); if (p.k !== mejor){ ch++; p.k = mejor; } });
    this.cambios = ch; this.it++; if (ch === 0 && this.it > 1) this.listo = true;
  }
  mover(){
    this.cen.forEach((q, j) => { const g = this.pts.filter(p => p.k === j); if (!g.length) return; q.tx = g.reduce((s, p) => s + p.x, 0) / g.length; q.ty = g.reduce((s, p) => s + p.y, 0) / g.length; q.h.push([q.tx, q.ty]); });
  }
  update(dt){
    this.cen.forEach(q => { q.x += (q.tx - q.x) * Math.min(1, dt * 7); q.y += (q.ty - q.y) * Math.min(1, dt * 7); });
    if (this.listo){ this.esp += dt; if (this.esp > 2.8) this.init(); return; }
    this.reloj += dt;
    if (this.reloj > .75){ this.reloj = 0; if (this.fase === 0) this.asignar(); else this.mover(); this.fase = 1 - this.fase; }
  }
  forma(c, x, y, k){
    const C = this.C; c.lineWidth = 1.6; c.strokeStyle = C.tinta; c.fillStyle = C.tinta;
    if (k === 0){ c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); }
    else if (k === 1){ c.fillStyle = C.fondo; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); c.stroke(); }
    else if (k === 2){ c.fillRect(x - 4.5, y - 4.5, 9, 9); }
    else { c.fillStyle = C.fondo; c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x + 6, y + 4.5); c.lineTo(x - 6, y + 4.5); c.closePath(); c.fill(); c.stroke(); }
  }
  draw(){
    if (!this.w) return;
    const c = this.ctx, C = this.C; this.limpiar(); this.ejes("frecuencia de uso", "edad");
    c.lineWidth = 1; c.strokeStyle = C.tinta; c.globalAlpha = .13;
    this.pts.forEach(p => { if (p.k < 0) return; const q = this.cen[p.k]; c.beginPath(); c.moveTo(this.X(p.x), this.Y(p.y)); c.lineTo(this.X(q.x), this.Y(q.y)); c.stroke(); });
    c.globalAlpha = 1;
    this.pts.forEach(p => { const x = this.X(p.x), y = this.Y(p.y); if (p.k < 0){ c.fillStyle = C.sec; c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); } else this.forma(c, x, y, p.k); });
    this.cen.forEach((q, j) => {
      c.setLineDash([4, 4]); c.strokeStyle = C.tinta; c.lineWidth = 1; c.beginPath();
      q.h.forEach((h, i) => i ? c.lineTo(this.X(h[0]), this.Y(h[1])) : c.moveTo(this.X(h[0]), this.Y(h[1]))); c.stroke(); c.setLineDash([]);
      const x = this.X(q.x), y = this.Y(q.y);
      c.fillStyle = C.acento; c.fillRect(x - 9, y - 9, 18, 18); c.strokeStyle = C.tinta; c.lineWidth = 2; c.strokeRect(x - 9, y - 9, 18, 18);
      c.font = this.mono(); c.fillStyle = C.tinta; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText("C" + (j + 1), x + 14, y - 12);
    });
    this.leer(`iteración ${pad(this.it, 2)} · grupos 4 · reasignados ${this.cambios}${this.listo ? " · convergió" : ""}`);
  }
}

/* ------------------------------------------------------------ Recomendacion: filtrado colaborativo */
class Recomendacion extends Lienzo {
  init(){
    this.us = ["Tú","Perfil A","Perfil B","Perfil C","Perfil D"];
    this.cu = ["Python","Estadística","SQL","Visualización","Machine Learning","MLOps"];
    this.cfgs = [
      [[1,1,1,0,0,0],[1,0,0,1,0,0],[1,1,1,0,1,0],[0,0,1,1,0,1],[0,1,0,1,0,0]],
      [[0,0,1,1,0,0],[0,1,1,1,0,0],[1,0,0,0,0,1],[1,0,0,0,1,1],[0,0,0,1,0,0]],
      [[1,0,0,0,1,0],[0,1,0,0,0,0],[0,0,1,1,0,0],[1,0,0,0,1,1],[1,0,1,0,0,0]]
    ];
    this.ci = this.ci === undefined ? 0 : (this.ci + 1) % 3; this.t = 0; this.calcular();
  }
  calcular(){
    const M = this.cfgs[this.ci], tu = M[0]; let mejor = 1, sm = -1;
    for (let u = 1; u < M.length; u++){ let inter = 0, uni = 0; for (let k = 0; k < 6; k++){ inter += tu[k] && M[u][k]; uni += tu[k] || M[u][k]; } const s = uni ? inter / uni : 0; if (s > sm){ sm = s; mejor = u; } }
    this.sim = mejor; this.simv = sm; this.rec = M[mejor].findIndex((v, k) => v && !tu[k]);
  }
  update(dt){ this.t += dt; if (this.t > 8.4) this.init(); }
  draw(){
    if (!this.w) return;
    const c = this.ctx, C = this.C; this.limpiar(); const M = this.cfgs[this.ci], t = this.t;
    const xu = this.w * .3, xc = this.w * .68, top = 56, alto = this.h - 112;
    const yu = i => top + i / 4 * alto, yc = k => top + k / 5 * alto;
    const texto = (peso, px) => `${peso} ${px}px ${C.fuenteTexto}`;
    c.font = this.mono(); c.fillStyle = C.sec; c.textBaseline = "middle";
    c.textAlign = "right"; c.fillText("estudiantes", xu + 12, 24); c.textAlign = "left"; c.fillText("cursos", xc - 12, 24);
    for (let u = 0; u < 5; u++) for (let k = 0; k < 6; k++){
      if (!M[u][k]) continue;
      const fuerte = (t > 1.2 && u === 0) || (t > 2 && u === this.sim);
      c.strokeStyle = C.tinta; c.globalAlpha = fuerte ? 1 : .16; c.lineWidth = fuerte ? 2 : 1;
      c.beginPath(); c.moveTo(xu, yu(u)); c.bezierCurveTo((xu + xc) / 2, yu(u), (xu + xc) / 2, yc(k), xc, yc(k)); c.stroke();
    }
    c.globalAlpha = 1;
    if (t > 3.3 && this.rec >= 0){
      const k = Math.min(1, (t - 3.3) / 1.2);
      c.save(); c.strokeStyle = C.acentoLinea; c.lineWidth = 3.5; c.setLineDash([10, 7]); c.lineDashOffset = -t * 30;
      c.beginPath();
      const steps = 30; for (let s = 0; s <= steps * k; s++){
        const q = s / steps, mx = (xu + xc) / 2, a = 1 - q;
        const x = a*a*a*xu + 3*a*a*q*mx + 3*a*q*q*mx + q*q*q*xc, y = a*a*a*yu(0) + 3*a*a*q*yu(0) + 3*a*q*q*yc(this.rec) + q*q*q*yc(this.rec);
        s ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.stroke(); c.restore();
    }
    for (let u = 0; u < 5; u++){
      const y = yu(u), es = u === 0, sim = t > 2 && u === this.sim;
      c.beginPath(); c.arc(xu, y, 11, 0, 7); c.fillStyle = es ? C.tinta : C.fondo; c.fill(); c.lineWidth = 2; c.strokeStyle = C.tinta; c.stroke();
      if (sim){ c.strokeStyle = C.acentoLinea; c.lineWidth = 2.5; c.beginPath(); c.arc(xu, y, 17, 0, 7); c.stroke(); }
      c.font = texto(es ? 600 : 400, 18); c.fillStyle = C.tinta; c.textAlign = "right"; c.textBaseline = "middle";
      c.fillText(this.us[u], xu - 26, y);
      if (sim){ c.font = this.mono(); c.fillStyle = C.acentoLinea; c.fillText("el más parecido", xu - 26, y + 20); }
    }
    for (let k = 0; k < 6; k++){
      const y = yc(k), rec = t > 4.3 && k === this.rec;
      c.fillStyle = rec ? C.acento : C.fondo; c.fillRect(xc - 10, y - 10, 20, 20); c.lineWidth = 2; c.strokeStyle = C.tinta; c.strokeRect(xc - 10, y - 10, 20, 20);
      c.font = texto(400, 18); c.fillStyle = C.tinta; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText(this.cu[k], xc + 22, y);
      if (rec){ const tw = c.measureText(this.cu[k]).width; c.font = this.mono(); const lw = c.measureText("sugerido").width; c.fillStyle = C.acento; c.fillRect(xc + 30 + tw, y - 11, lw + 12, 22); c.fillStyle = C.tintaSobreAcento; c.fillText("sugerido", xc + 36 + tw, y + 1); }
    }
    this.leer(t > 2 ? `similitud (Jaccard) con ${this.us[this.sim]}: ${fmt(this.simv)}` : "buscando perfiles parecidos…");
  }
}

/* ------------------------------------------------------------ Vision: tela bajo la camara */
class Vision extends Lienzo {
  init(){ this.r = rng(99); this.off = 0; this.def = []; this.sig = 120; this.cuenta = 0; }
  nuevo(y){ const tipos = ["hueco", "mancha", "costura irregular"]; this.def.push({ y, x:.14 + this.r() * .62, tipo:tipos[Math.floor(this.r() * 3)], s:this.r(), det:false }); }
  update(dt){
    this.off += dt * 72;
    while (this.sig < this.off + this.h + 80){ this.nuevo(this.sig); this.sig += 130 + this.r() * 110; }
    this.def = this.def.filter(d => d.y - this.off > -90);
    const lin = this.h * .42;
    this.def.forEach(d => { if (!d.det && d.y - this.off <= lin){ d.det = true; this.cuenta++; } });
  }
  draw(){
    if (!this.w) return;
    const c = this.ctx, C = this.C, w = this.w, h = this.h, o = this.off % 8;
    c.fillStyle = C.tela; c.fillRect(0, 0, w, h);
    c.fillStyle = C.tinta; c.globalAlpha = .07; for (let y = -o; y < h; y += 8) c.fillRect(0, y, w, 3);
    c.fillStyle = C.fondo; c.globalAlpha = .55; for (let x = 0; x < w; x += 8) c.fillRect(x, 0, 3, h);
    const lin = h * .42;
    c.fillStyle = C.acento; c.globalAlpha = .06; c.fillRect(0, 0, w, lin); c.globalAlpha = 1;
    this.def.forEach(d => {
      const x = d.x * w, y = d.y - this.off;
      c.save();
      if (d.tipo === "hueco"){ c.fillStyle = C.tinta; c.globalAlpha = .85; c.beginPath(); c.ellipse(x, y, 13 + d.s * 6, 9 + d.s * 4, d.s, 0, 7); c.fill(); }
      else if (d.tipo === "mancha"){ const g = c.createRadialGradient(x, y, 2, x, y, 26); g.addColorStop(0, "rgba(87,64,30,0.55)"); g.addColorStop(1, "rgba(87,64,30,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, 26, 0, 7); c.fill(); }
      else { c.strokeStyle = C.tinta; c.globalAlpha = .8; c.lineWidth = 2.5; c.beginPath(); for (let k = 0; k <= 8; k++){ const px = x - 32 + k * 8, py = y + (k % 2 ? -6 : 6); k ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
      c.restore();
      if (d.det){
        const bw = d.tipo === "costura irregular" ? 84 : 64, bh = 48;
        c.strokeStyle = C.acentoLinea; c.lineWidth = 2.5; c.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
        c.font = this.mono(); const tw = c.measureText(d.tipo).width;
        c.fillStyle = C.acento; c.fillRect(x - bw / 2, y - bh / 2 - 24, tw + 12, 24);
        c.fillStyle = C.tintaSobreAcento; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText(d.tipo, x - bw / 2 + 6, y - bh / 2 - 11);
      }
    });
    c.strokeStyle = C.tinta; c.lineWidth = 2; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(0, lin); c.lineTo(w, lin); c.stroke(); c.setLineDash([]);
    c.font = this.mono(); const et = "línea de inspección · cámara"; const tw = c.measureText(et).width;
    c.fillStyle = C.tinta; c.fillRect(12, lin - 12, tw + 16, 24); c.fillStyle = C.textoSobreTinta; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText(et, 20, lin);
    this.leer(`defectos detectados: ${this.cuenta} · inspección continua`);
  }
}

/* ------------------------------------------------------------ NLP: etiquetado de quejas (DOM) */
class NLP extends LienzoDOM {
  init(){
    if (!this.el.querySelector(".dia-nlp-texto")){
      this.el.insertAdjacentHTML("beforeend", `<p class="dia-nlp-meta">Comentario en redes · aerolínea</p><p class="dia-nlp-texto"></p><p class="dia-nlp-salida"></p>`);
    }
    this.txt = this.el.querySelector(".dia-nlp-texto"); this.sal = this.el.querySelector(".dia-nlp-salida");
    this.quejas = [
      { s:[["Me "],["cancelaron el vuelo","tema · cancelación"],[" a Bogotá y "],["nadie responde","tema · atención"],[". Necesito llegar "],["hoy","urgencia · alta"],[" para una "],["cirugía","urgencia · alta"],["."]],
        r:"Tema: cancelación · Urgencia: alta → <b>Operaciones · prioridad 1</b>" },
      { s:[["Llevo "],["tres semanas","urgencia · media"],[" esperando el "],["reembolso","tema · pagos"],[" de un tiquete que nunca usé."]],
        r:"Tema: reembolso · Urgencia: media → <b>Equipo de pagos</b>" },
      { s:[["La "],["silla estaba rota","tema · cabina"],[", pero la tripulación fue "],["muy amable","sentimiento · positivo"],["."]],
        r:"Tema: cabina · Urgencia: baja → <b>Mantenimiento</b>" }
    ];
    this.qi = -1; this.siguiente();
  }
  siguiente(){
    this.qi = (this.qi + 1) % this.quejas.length; this.t = 0; const q = this.quejas[this.qi];
    this.txt.innerHTML = q.s.map(([t, tag]) => tag ? `<span class="dia-seg"><span class="dia-tag">${tag}</span>${t}</span>` : t).join("");
    this.segs = [...this.txt.querySelectorAll(".dia-seg")]; this.sal.innerHTML = q.r; this.sal.classList.remove("dia-ver"); this.marcados = 0;
  }
  update(dt){
    this.t += dt;
    const deb = Math.floor((this.t - .7) / .85) + 1;
    while (this.marcados < Math.min(deb, this.segs.length)){ this.segs[this.marcados].classList.add("dia-marcado"); this.marcados++; }
    if (this.t > .7 + this.segs.length * .85 + .4) this.sal.classList.add("dia-ver");
    if (this.t > .7 + this.segs.length * .85 + 3.6) this.siguiente();
  }
  draw(){ this.leer(`comentario ${this.qi + 1} / ${this.quejas.length} · ${this.marcados} etiquetas`); }
}

/* ------------------------------------------------------------ Generativa: borrador que se escribe solo (DOM) */
class Generativa extends LienzoDOM {
  init(){
    if (!this.el.querySelector(".dia-gen-doc")){
      this.el.insertAdjacentHTML("beforeend", `<p class="dia-gen-prompt"><b>Instrucción</b>Borrador de contrato de prestación de servicios de consultoría, seis meses, pago mensual.</p><div class="dia-gen-doc"></div>`);
    }
    this.doc = this.el.querySelector(".dia-gen-doc");
    this.texto = "CONTRATO DE PRESTACIÓN DE SERVICIOS\n\nEntre [CONTRATANTE], en adelante EL CONTRATANTE, y [CONTRATISTA], en adelante EL CONTRATISTA, se celebra el presente contrato, que se regirá por las siguientes cláusulas:\n\nPRIMERA. Objeto. EL CONTRATISTA prestará servicios de consultoría en [alcance del servicio].\n\nSEGUNDA. Plazo. Seis (6) meses contados a partir de la firma.\n\nTERCERA. Valor y forma de pago. [valor total], pagaderos en cuotas mensuales iguales.\n\nCUARTA. Confidencialidad. Las partes guardarán reserva sobre la información conocida en ejecución de este contrato.";
    this.n = 0; this.t = 0; this.esp = 0; this.pintar();
  }
  pintar(){ const s = this.texto.slice(0, Math.floor(this.n)); this.doc.innerHTML = esc(s) + '<span class="dia-cursor"></span>'; this.palabras = s.split(/\s+/).filter(Boolean).length; }
  update(dt){
    if (this.n >= this.texto.length){ this.esp += dt; if (this.esp > 3.5) this.init(); return; }
    const antes = Math.floor(this.n); this.n = Math.min(this.texto.length, this.n + dt * 62); if (Math.floor(this.n) !== antes) this.pintar();
  }
  draw(){ this.leer(`palabras generadas: ${this.palabras}`); }
}

/* ------------------------------------------------------------ Motor: bucle, visibilidad, tamano */
const TIPOS = { dispersion:Dispersion, clasificacion:Clasificacion, regresion:Regresion, clustering:Clustering, recomendacion:Recomendacion, nlp:NLP, vision:Vision, generativa:Generativa };
const activos = [];
let io = null, enMarcha = false;

function paso(deltaMs){
  const dt = Math.min(deltaMs, 60) / 1000;
  for (const d of activos) if (d.visible && !d.pausado){ d.update(dt); d.draw(); }
}
function arrancarBucle(){
  if (enMarcha) return; enMarcha = true;
  if (global.gsap && global.gsap.ticker) global.gsap.ticker.add((t, delta) => paso(delta));
  else { let ult = performance.now(); const f = ahora => { paso(ahora - ult); ult = ahora; requestAnimationFrame(f); }; requestAnimationFrame(f); }
  let rz; global.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => activos.forEach(d => d.redimensionar()), 120); });
}
function observar(d){
  if (!io) io = new IntersectionObserver(ents => ents.forEach(e => { if (e.target._diaDemo) e.target._diaDemo.visible = e.isIntersecting; }), { threshold:0.02 });
  d.el._diaDemo = d; io.observe(d.el);
}
function montar(el, tipo, opciones = {}){
  const Clase = TIPOS[tipo]; if (!Clase) throw new Error("Tipo de demo desconocido: " + tipo);
  const d = new Clase(el, opciones); activos.push(d); observar(d); arrancarBucle(); return d;
}
function montarTodas(raiz = document, opciones = {}){
  return [...raiz.querySelectorAll("[data-demo]")].map(el => {
    const lect = el.dataset.lectura ? document.querySelector(el.dataset.lectura) : (el.closest("figure") ? el.closest("figure").querySelector("[data-lectura]") : null);
    return montar(el, el.dataset.demo, Object.assign({ lectura:lect }, opciones));
  });
}

/* ------------------------------------------------------------ Semaforo (markup + logica, sin piel) */
function montarSemaforo(el, opciones = {}){
  const valores = Object.assign({}, ...RUBRICA.dimensiones.map(d => ({ [d.id]:d.ejemplo })), opciones.valores || {});
  el.innerHTML = RUBRICA.dimensiones.map(d => `
    <div class="dia-sem-fila" role="radiogroup" aria-labelledby="dia-dim-${d.id}" data-dim="${d.id}">
      <p class="dia-sem-dim" id="dia-dim-${d.id}">${d.n}</p>
      <div class="dia-sem-opciones">${[1,2,3,4,5].map(v => `<label><input type="radio" name="dia-${d.id}" value="${v}" ${v === valores[d.id] ? "checked" : ""} aria-label="${d.n}: ${v}, ${RUBRICA.niveles[v]}"><span>${v}</span></label>`).join("")}</div>
      <p class="dia-sem-nivel"><i class="dia-luz" aria-hidden="true"></i><b></b></p>
      <p class="dia-sem-desc"></p>
    </div>`).join("");
  const pintar = () => {
    const r = evaluarSemaforo(valores);
    r.dims.forEach(d => {
      const f = el.querySelector(`[data-dim="${d.id}"]`);
      f.dataset.estado = d.estado;
      f.querySelector(".dia-sem-nivel b").textContent = `${d.v} · ${d.nivel}`;
      f.querySelector(".dia-sem-desc").textContent = d.descriptor;
    });
    return r;
  };
  el.addEventListener("change", e => {
    const f = e.target.closest("[data-dim]"); if (!f) return;
    valores[f.dataset.dim] = +e.target.value;
    const r = pintar(); if (opciones.onCambio) opciones.onCambio(r, true);
  });
  const r0 = pintar(); if (opciones.onCambio) opciones.onCambio(r0, false);
  return { valores, evaluar:() => evaluarSemaforo(valores) };
}

/* ------------------------------------------------------------ CSS estructural opcional (sin marca) */
function estilosBase(){
  if (document.getElementById("dia-estilos")) return;
  const s = document.createElement("style"); s.id = "dia-estilos";
  s.textContent = `
  .dia-nlp-texto .dia-seg{position:relative;transition:background-color .25s,color .25s;padding:2px 2px}
  .dia-nlp-texto .dia-tag{position:absolute;left:0;bottom:calc(100% + 2px);white-space:nowrap;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s}
  .dia-nlp-texto .dia-seg.dia-marcado .dia-tag{opacity:1;transform:none}
  .dia-nlp-salida{opacity:0;transition:opacity .4s}
  .dia-nlp-salida.dia-ver{opacity:1}
  .dia-gen-doc{white-space:pre-wrap;overflow:hidden}
  .dia-cursor{display:inline-block;width:.6em;height:1.1em;vertical-align:text-bottom;animation:dia-parpadeo 1s steps(1) infinite}
  @keyframes dia-parpadeo{50%{opacity:0}}
  .dia-sem-opciones{display:flex;gap:8px}
  .dia-sem-opciones label{position:relative;display:block}
  .dia-sem-opciones input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
  .dia-sem-opciones span{display:grid;place-items:center;width:44px;height:44px}
  .dia-luz{display:inline-block;width:24px;height:24px;border-radius:50%}
  @media (prefers-reduced-motion: reduce){.dia-cursor{animation:none}}`;
  document.head.appendChild(s);
}

global.DemosIA = { MODELOS, RUBRICA, ALGORITMOS, PALETA_BASE, montar, montarTodas, montarSemaforo, evaluarSemaforo, estadoDe, estilosBase, util:{ fmt, pad } };
})(window);
