// =========================
// Minimal analytics helper
// =========================
function track(eventName, params){
  try{
    if (typeof gtag === "function"){
      gtag("event", eventName, params || {});
    }
  }catch(_){}
}

// =========================
// i18n
// =========================
let LANG = "es";

const T = {
  es:{
    brand:"LoVasASudar.com · Calculadora de castigo calórico",
    pageTitle:"LoVasASudar.com · Calculadora de castigo calórico",
    pageDesc:"Calcula el castigo calórico de tu cena/noche de copas y descubre cuánto ejercicio tendrías que hacer para sudarlo.",
    title:"LoVasASudar.com",
    subtitle:"Mete lo que vas a comer y beber y descubre cuánto ejercicio tendrías que hacer para sudarlo. Perfecta para cenas con amigos y noches de copas.",
    lblFood:"Alimento o bebida",
    lblUnits:"Nº de unidades",
    hintUnits:"Ej: 3 cervezas → pon 3 unidades.",
    lblExtra:"Calorías extra",
    hintExtra:"Se suman a lo anterior (comida + copas).",
    lblWeight:"Peso (kg)",
    hintWeight:"El cálculo se hace por kg de peso (ecuación basada en MET).",
    lblGender:"Género (opcional)",
    hintGender:"Ajuste aproximado (~5%). No es magia, es estadística con resaca.",
    modes:{ normal:"Modo normal", drinks:"Modo noche de copas", battle:"Batalla de colegas", inverse:"Calculadora inversa" },
    btnCalc:"CALCULAR EJERCICIO NECESARIO 💪",
    results:"🎯 Resultados",
    kcalSub:"Calorías totales estimadas",
    modeSub:"Modo activo",
    sportsTitle:"⏱️ Tiempo para quemarlo (aprox.)",
    meme:"📸 Generar MEME",
    download:"⬇️ Descargar MEME",
    share:"📲 Compartir",
    shareTop:"📲 Compartir MEME",
    downloadTop:"⬇️ Descargar MEME",
    fine:"Estimaciones aproximadas basadas en MET (la física no negocia, pero sí te deja elegir dardos).",
    drinksTitle:"🍻 Añade tus bebidas (se suman al total)",
    drinksHint:"Tip: si mezclas “cubo cerveza” + “gin-tonic”, el universo no juzga… pero las matemáticas sí.",
    battleTitle:"⚔️ Batalla de colegas (tú + 3)",
    youTitle:"Tú",
    friend1:"Colega 1",
    friend2:"Colega 2",
    friend3:"Colega 3",
    weightKg:"Peso (kg)",
    battleHint2:"Aquí no gana el más fuerte. Gana el que tiene menos calorías… o más dignidad.",
    inverseTitle:"🔁 Calculadora inversa",
    invSport:"Deporte",
    invHours:"Duración (horas)",
    invHint:"Ej: 1.5 = 1 hora y 30 min",
    battleResultsTitle:"⚔️ Resultado por persona",
    inverseResultsTitle:"🔁 Has “ganado” esto",
    modeNames:{ normal:"Normal", drinks:"Noche de copas", battle:"Batalla", inverse:"Inversa" },
    summaryNormal:(k)=>`Castigo: ${k} kcal. El universo te mira.`,
    summaryBattle:(k)=>`Todos al barro: ${k} kcal por cabeza.`,
    summaryInverse:(k)=>`Has generado ${k} kcal de “presupuesto comestible”.`,
    groups:{ food:"🍕 Comida", drink:"🍺 Bebida" },
    custom:"Otro / personalizado",
    customHint:"Si eliges personalizado, mete las kcal en “Calorías extra”.",
    calcBurnSuffix:(k)=>`para ~${k} kcal`,
    burned:"Kcal quemadas",
    edible:"presupuesto comestible",
    earnedTitle:"🍽️ ¿Qué te has ganado?",
    burnedWith:(sport,h)=>`Con ${sport} · ${h} h`,
    perUnit:"por unidad",
    approxUnits:"unidades aprox.",
    memeSub:"Castigo calórico (oficial y sin abogados)",
    memeFoodFallback:"misterio comestible",
    memeShareText:"Mira mi castigo calórico 😭",
    memeShareFail:"No se pudo compartir. Descárgalo y súbelo manualmente."
  },
  en:{
    brand:"LoVasASudar.com · Calorie payback calculator",
    pageTitle:"LoVasASudar.com · Calorie payback calculator",
    pageDesc:"Estimate your calorie payback and how much exercise you’d need to sweat it off.",
    title:"LoVasASudar.com",
    subtitle:"Add what you’ll eat and drink and see how much exercise you’d need to sweat it off. Perfect for dinners with friends and nights out.",
    lblFood:"Food or drink",
    lblUnits:"Units",
    hintUnits:"Ex: 3 beers → enter 3 units.",
    lblExtra:"Extra calories",
    hintExtra:"Added to the above (food + drinks).",
    lblWeight:"Weight (kg)",
    hintWeight:"Calculated per kg (MET-based equation).",
    lblGender:"Gender (optional)",
    hintGender:"Rough ~5% adjustment. Not magic. Just biology being annoying.",
    modes:{ normal:"Normal mode", drinks:"Night-out mode", battle:"Friends battle", inverse:"Inverse calculator" },
    btnCalc:"CALCULATE REQUIRED EXERCISE 💪",
    results:"🎯 Results",
    kcalSub:"Estimated total calories",
    modeSub:"Active mode",
    sportsTitle:"⏱️ Time to burn it (roughly)",
    meme:"📸 Generate MEME",
    download:"⬇️ Download MEME",
    share:"📲 Share",
    shareTop:"📲 Share MEME",
    downloadTop:"⬇️ Download MEME",
    fine:"Rough estimates based on MET (physics keeps receipts, but it lets you pick darts).",
    drinksTitle:"🍻 Add your drinks (they’re added to the total)",
    drinksHint:"Tip: mixing ‘beer bucket’ + ‘gin & tonic’ is allowed. Math will still snitch.",
    battleTitle:"⚔️ Friends battle (you + 3)",
    youTitle:"You",
    friend1:"Friend 1",
    friend2:"Friend 2",
    friend3:"Friend 3",
    weightKg:"Weight (kg)",
    battleHint2:"This isn’t won by the strongest. It’s won by the least calories… or the most dignity.",
    inverseTitle:"🔁 Inverse calculator",
    invSport:"Sport",
    invHours:"Duration (hours)",
    invHint:"Ex: 1.5 = 1 hour 30 min",
    battleResultsTitle:"⚔️ Result per person",
    inverseResultsTitle:"🔁 You’ve ‘earned’ this",
    modeNames:{ normal:"Normal", drinks:"Night-out", battle:"Battle", inverse:"Inverse" },
    summaryNormal:(k)=>`Payback: ${k} kcal. The universe is watching.`,
    summaryBattle:(k)=>`Everyone pays: ${k} kcal each.`,
    summaryInverse:(k)=>`You created a ${k} kcal “edible budget”.`,
    groups:{ food:"🍕 Food", drink:"🍺 Drinks" },
    custom:"Other / custom",
    customHint:"If you choose custom, add calories in “Extra calories”.",
    calcBurnSuffix:(k)=>`to burn ~${k} kcal`,
    burned:"Calories burned",
    edible:"edible budget",
    earnedTitle:"🍽️ What did you earn?",
    burnedWith:(sport,h)=>`With ${sport} · ${h} h`,
    perUnit:"per unit",
    approxUnits:"units approx.",
    memeSub:"Calorie payback (official-ish, lawyers asleep)",
    memeFoodFallback:"mysterious edible object",
    memeShareText:"Look at my calorie payback 😭",
    memeShareFail:"Couldn’t share. Download it and upload manually."
  }
};

// =========================
// Food + Drink catalog (bilingual)
// =========================
const CATALOG = [
  // Food
  { id:"pizza_medium", group:"food", kcal:850,  es:"Pizza mediana", en:"Medium pizza" },
  { id:"burger",      group:"food", kcal:650,  es:"Hamburguesa", en:"Burger" },
  { id:"kebab_full",  group:"food", kcal:1050, es:"Kebab completo", en:"Full kebab" },
  { id:"bravas",      group:"food", kcal:520,  es:"Ración bravas", en:"Patatas bravas (portion)" },
  { id:"bocata_calam",group:"food", kcal:460,  es:"Bocata calamares", en:"Calamari sandwich" },
  { id:"happy_meal",  group:"food", kcal:500,  es:"Happy Meal McDonald's", en:"McDonald's Happy Meal" },
  { id:"big_mac",     group:"food", kcal:550,  es:"Big Mac", en:"Big Mac" },
  { id:"mc_menu_med", group:"food", kcal:510,  es:"Menú mediano McDonald's", en:"McDonald's medium meal" },
  { id:"mc_nug_6",    group:"food", kcal:250,  es:"6 Nuggets McDonald's", en:"McDonald's 6 nuggets" },
  { id:"mc_fries_med",group:"food", kcal:340,  es:"Patatas fritas medianas McDonald's", en:"McDonald's medium fries" },
  { id:"bk_wedges",   group:"food", kcal:420,  es:"Patatas gajo Burger King", en:"Burger King wedges" },
  { id:"pizza_slice_cheese", group:"food", kcal:450, es:"Porción pizza queso (1/8 mediana)", en:"Cheese pizza slice (1/8 medium)" },
  { id:"pizza_slice_pep",    group:"food", kcal:500, es:"Porción pizza pepperoni (1/8 mediana)", en:"Pepperoni pizza slice (1/8 medium)" },
  { id:"pizza_family_cheese",group:"food", kcal:3600,es:"Pizza familiar queso entera", en:"Family cheese pizza (whole)" },
  { id:"pizza_family_pep",   group:"food", kcal:4000,es:"Pizza familiar pepperoni entera", en:"Family pepperoni pizza (whole)" },
  { id:"lasagna",     group:"food", kcal:600,  es:"Lasaña boloñesa", en:"Bolognese lasagna" },
  { id:"pasta_carbon",group:"food", kcal:700,  es:"Ración pasta carbonara", en:"Carbonara pasta (portion)" },

  { id:"tortilla_pincho",group:"food", kcal:250, es:"Pincho de tortilla", en:"Spanish omelette slice" },
  { id:"bravas_2",       group:"food", kcal:500, es:"Ración patatas bravas", en:"Patatas bravas (portion)" },
  { id:"croquetas_3",    group:"food", kcal:350, es:"3 croquetas de jamón", en:"3 ham croquettes" },
  { id:"bocata_jamon",   group:"food", kcal:450, es:"Bocadillo de jamón serrano", en:"Serrano ham sandwich" },
  { id:"bocata_calam_2", group:"food", kcal:550, es:"Bocadillo de calamares", en:"Calamari sandwich" },

  { id:"donut",      group:"food", kcal:280, es:"Donut clásico", en:"Classic donut" },
  { id:"croissant",  group:"food", kcal:220, es:"Croissant de mantequilla", en:"Butter croissant" },
  { id:"palmera_choc",group:"food",kcal:400, es:"Palmera de chocolate", en:"Chocolate palmier" },
  { id:"brownie",    group:"food", kcal:450, es:"Brownie de chocolate", en:"Chocolate brownie" },
  { id:"muffin",     group:"food", kcal:450, es:"Muffin de chocolate", en:"Chocolate muffin" },
  { id:"cheesecake", group:"food", kcal:550, es:"Tarta de queso porción", en:"Cheesecake slice" },
  { id:"choc_cake",  group:"food", kcal:500, es:"Tarta de chocolate porción", en:"Chocolate cake slice" },

  { id:"kitkat",     group:"food", kcal:150, es:"Barrita chocolate tipo KitKat", en:"KitKat-style bar" },
  { id:"snickers",   group:"food", kcal:240, es:"Barrita Snickers", en:"Snickers bar" },
  { id:"chips_small",group:"food", kcal:250, es:"Bolsa patatas fritas pequeña", en:"Small bag of chips" },
  { id:"chips_big",  group:"food", kcal:500, es:"Bolsa patatas fritas grande", en:"Large bag of chips" },
  { id:"kinder_bueno",group:"food",kcal:200, es:"Kinder Bueno (2 barritas)", en:"Kinder Bueno (2 bars)" },
  { id:"ice_cream_pop",group:"food",kcal:200, es:"Helado de palo cremoso", en:"Creamy ice cream pop" },
  { id:"magnum",     group:"food", kcal:280, es:"Helado tipo Magnum", en:"Magnum-style ice cream" },

  { id:"homemade_burger", group:"food", kcal:650, es:"Hamburguesa casera completa", en:"Homemade burger (full)" },
  { id:"sushi_8",         group:"food", kcal:350, es:"Ración de sushi (8 piezas)", en:"Sushi (8 pieces)" },
  { id:"caesar_salad",    group:"food", kcal:300, es:"Ensalada César completa", en:"Caesar salad (full)" },

  { id:"shawarma_big", group:"food", kcal:950, es:"Shawarma grande extra salsas", en:"Large shawarma (extra sauces)" },
  { id:"nachos_loaded",group:"food", kcal:700, es:"Nachos con queso y guacamole", en:"Loaded nachos" },
  { id:"wings_10",     group:"food", kcal:600, es:"10 alitas barbacoa", en:"10 BBQ wings" },
  { id:"ramen_big",    group:"food", kcal:650, es:"Ramen grande", en:"Large ramen" },
  { id:"sushi_for_2",  group:"food", kcal:1200,es:"Sushi para 2 (20-24 piezas)", en:"Sushi for 2 (20–24 pieces)" },
  { id:"double_bacon", group:"food", kcal:900, es:"Hamburguesa doble bacon cheese", en:"Double bacon cheeseburger" },

  // Drinks
  { id:"beer_330",    group:"drink", kcal:150, es:"Cerveza 330 ml", en:"Beer (330 ml)" },
  { id:"craft_beer",  group:"drink", kcal:180, es:"Cerveza artesana 330 ml", en:"Craft beer (330 ml)" },
  { id:"red_wine",    group:"drink", kcal:90,  es:"Copa vino tinto", en:"Glass of red wine" },
  { id:"white_wine",  group:"drink", kcal:110, es:"Copa vino blanco", en:"Glass of white wine" },
  { id:"gin_tonic",   group:"drink", kcal:210, es:"Gin-tonic", en:"Gin & tonic" },
  { id:"rum_cola",    group:"drink", kcal:200, es:"Ron-cola", en:"Rum & cola" },
  { id:"mojito",      group:"drink", kcal:240, es:"Mojito", en:"Mojito" },
  { id:"sex_beach",   group:"drink", kcal:230, es:"Sex on the Beach", en:"Sex on the Beach" },
  { id:"caipirinha",  group:"drink", kcal:250, es:"Caipiriña", en:"Caipirinha" },
  { id:"pina_colada", group:"drink", kcal:300, es:"Piña colada", en:"Piña colada" },
  { id:"whisky_cola", group:"drink", kcal:200, es:"Whisky-cola", en:"Whisky & cola" },
  { id:"aperol",      group:"drink", kcal:200, es:"Aperol Spritz", en:"Aperol Spritz" },
  { id:"shot_tequila",group:"drink", kcal:65,  es:"Chupito tequila", en:"Tequila shot" },
  { id:"soda",        group:"drink", kcal:120, es:"Refresco azucarado 330 ml", en:"Sugary soda (330 ml)" },
  { id:"vermouth",    group:"drink", kcal:100, es:"Vermú", en:"Vermouth" },

  // graciosas
  { id:"sangria_glass", group:"drink", kcal:200, es:"Sangría (vaso)", en:"Sangria (glass)" },
  { id:"beer_bucket",   group:"drink", kcal:320, es:"Cubo cerveza (vaso)", en:"Beer bucket (per glass)" }
];

// =========================
// Helpers
// =========================
const $ = (id)=>document.getElementById(id);
function clamp(n,a,b){ return Math.min(b, Math.max(a,n)); }
function round(n){ return Math.round(n); }

// kcal/min = (MET * 3.5 * weightKg) / 200
function kcalPerMinute(met, weightKg){
  return (met * 3.5 * weightKg) / 200;
}

const GENDER_FACTOR = { na:1.00, male:1.00, female:0.95 };

// Debounce para autocalcular (Acción 1)
function debounce(fn, wait){
  let t = null;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), wait);
  };
}

// =========================
// Sports list (MET approximate)
// =========================
const SPORTS = [
  { key:"run",     es:"Correr suave",     en:"Easy run",            met:8.0 },
  { key:"walk",    es:"Caminar rápido",   en:"Brisk walk",          met:4.3 },
  { key:"bike",    es:"Bici moderada",    en:"Cycling (moderate)",  met:6.8 },
  { key:"swim",    es:"Natación",         en:"Swimming",            met:6.0 },
  { key:"hiit",    es:"HIIT",             en:"HIIT",                met:9.0 },
  { key:"weights", es:"Pesas",            en:"Weight training",     met:5.0 },
  { key:"football",es:"Fútbol",           en:"Soccer",              met:7.0 },
  { key:"dance",   es:"Bailar",           en:"Dancing",             met:5.5 },
  { key:"stairs",  es:"Subir escaleras",  en:"Stairs",              met:8.8 },
  { key:"yoga",    es:"Yoga",             en:"Yoga",                met:2.5 },
  { key:"bowling", es:"Bolos",            en:"Bowling",             met:3.0 },
  { key:"darts",   es:"Dardos",           en:"Darts",               met:2.5 },
  { key:"petanque",es:"Petanca",          en:"Bocce / Petanque",    met:3.0 }
];

function genderLabel(g){
  if (LANG==="en"){
    return g==="male" ? "Male" : g==="female" ? "Female" : "NA";
  }
  return g==="male" ? "Hombre" : g==="female" ? "Mujer" : "N/D";
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

// =========================
// Build selects from CATALOG (bilingual)
// =========================
function buildFoodSelect(preserveId){
  const sel = $("food");
  const prev = preserveId || sel.value;
  sel.innerHTML = "";

  const groups = [
    { key:"food",  label: T[LANG].groups.food },
    { key:"drink", label: T[LANG].groups.drink }
  ];

  groups.forEach(g=>{
    const og = document.createElement("optgroup");
    og.label = g.label;

    const items = CATALOG.filter(x=>x.group===g.key);
    items.forEach(it=>{
      const opt = document.createElement("option");
      opt.value = it.id;
      opt.dataset.kcal = String(it.kcal);
      opt.dataset.labelEs = it.es;
      opt.dataset.labelEn = it.en;
      opt.textContent = `${(LANG==="es"?it.es:it.en)} (~${it.kcal} kcal)`;
      og.appendChild(opt);
    });

    sel.appendChild(og);
  });

  const ogCustom = document.createElement("optgroup");
  ogCustom.label = "—";
  const optC = document.createElement("option");
  optC.value = "custom";
  optC.dataset.kcal = "0";
  optC.dataset.labelEs = T.es.custom;
  optC.dataset.labelEn = T.en.custom;
  optC.textContent = (LANG==="es" ? T.es.custom : T.en.custom);
  ogCustom.appendChild(optC);
  sel.appendChild(ogCustom);

  sel.value = prev && [...sel.querySelectorAll("option")].some(o=>o.value===prev) ? prev : "pizza_medium";
}

function getSelectedLabel(){
  const opt = $("food").selectedOptions[0];
  if (!opt) return "";
  return (LANG==="es" ? (opt.dataset.labelEs || "") : (opt.dataset.labelEn || "")) || opt.textContent.trim();
}

function getSelectedKcal(){
  const opt = $("food").selectedOptions[0];
  if (!opt) return 0;
  const k = parseFloat(opt.dataset.kcal || "0");
  return Number.isFinite(k) ? k : 0;
}

function getDrinkItems(){
  return CATALOG.filter(x=>x.group==="drink");
}

function fillDrinkSelects(){
  const opts = getDrinkItems();
  const ids = ["drink1","drink2","drink3"];
  ids.forEach(id=>{
    const sel = $(id);
    const preserve = sel.value;
    sel.innerHTML = "";
    opts.forEach(it=>{
      const opt = document.createElement("option");
      opt.value = it.id;
      opt.dataset.kcal = String(it.kcal);
      opt.dataset.labelEs = it.es;
      opt.dataset.labelEn = it.en;
      opt.textContent = `${(LANG==="es"?it.es:it.en)} (~${it.kcal} kcal)`;
      sel.appendChild(opt);
    });
    sel.value = preserve && [...sel.querySelectorAll("option")].some(o=>o.value===preserve) ? preserve : "beer_330";
  });
}

function drinkKcalById(id){
  const it = CATALOG.find(x=>x.id===id);
  return it ? it.kcal : 0;
}

function fillInverseSports(){
  const sel = $("invSport");
  const preserve = sel.value;
  sel.innerHTML = "";
  SPORTS.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.key;
    opt.textContent = (LANG==="es" ? s.es : s.en);
    sel.appendChild(opt);
  });
  sel.value = preserve && [...sel.querySelectorAll("option")].some(o=>o.value===preserve) ? preserve : "run";
}

// =========================
// Mode + panels
// =========================
function getSelectedMode(){
  const r = document.querySelector('input[name="mode"]:checked');
  return r ? r.value : "normal";
}

function syncModePills(){
  document.querySelectorAll(".mode").forEach(l => l.classList.remove("active"));
  const selected = document.querySelector('input[name="mode"]:checked');
  if (selected) selected.closest(".mode").classList.add("active");

  $("panelDrinks").style.display  = (getSelectedMode()==="drinks") ? "block" : "none";
  $("panelBattle").style.display  = (getSelectedMode()==="battle") ? "block" : "none";
  $("panelInverse").style.display = (getSelectedMode()==="inverse") ? "block" : "none";

  $("btnCalc").textContent = T[LANG].btnCalc;
  if ($("btnCalcTop")) $("btnCalcTop").textContent = T[LANG].btnCalc;
  if ($("btnCalcSticky")) $("btnCalcSticky").textContent = (LANG==="es") ? "CALCULAR 💪" : "CALCULATE 💪";

  track("mode_change", { mode: getSelectedMode(), lang: LANG });

  // Acción 1: autocalcular sin scroll agresivo
  requestAutoCalc();
}

// =========================
// Calories math
// =========================
function getTotalCaloriesWithMode(){
  const units = Math.max(1, parseInt($("units").value || "1", 10));
  const extra = Math.max(0, parseInt($("extra").value || "0", 10));

  let kcal = 0;
  if ($("food").value !== "custom"){
    kcal = getSelectedKcal() * units;
  }
  kcal += extra;

  const mode = getSelectedMode();
  if (mode === "drinks"){
    const d1 = drinkKcalById($("drink1").value) * Math.max(0, parseInt($("drink1n").value || "0",10));
    const d2 = drinkKcalById($("drink2").value) * Math.max(0, parseInt($("drink2n").value || "0",10));
    const d3 = drinkKcalById($("drink3").value) * Math.max(0, parseInt($("drink3n").value || "0",10));
    kcal += (Number.isFinite(d1)?d1:0) + (Number.isFinite(d2)?d2:0) + (Number.isFinite(d3)?d3:0);
  }

  return Math.max(0, Math.round(kcal));
}

function minutesNeeded(kcal, sportMet, weightKg, gender){
  const factor = GENDER_FACTOR[gender] ?? 1.0;
  const kpm = kcalPerMinute(sportMet, weightKg) * factor;
  if (kpm <= 0) return Infinity;
  return kcal / kpm;
}

function renderSportsTable(kcal, weight, gender){
  const list = $("sportsList");
  list.innerHTML = "";
  SPORTS.forEach(s=>{
    const min = minutesNeeded(kcal, s.met, weight, gender);
    const txtMin = (min===Infinity) ? "—" : `${Math.round(min)} min`;
    const row = document.createElement("div");
    row.className = "sportRow";
    row.innerHTML = `
      <div>
        <b>${LANG==="es" ? s.es : s.en}</b>
        <div><span>MET ≈ ${s.met}</span></div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:950; font-size:18px;">${txtMin}</div>
        <div><span>${T[LANG].calcBurnSuffix(kcal)}</span></div>
      </div>
    `;
    list.appendChild(row);
  });
}

function renderBattle(kcal){
  const people = [
    { name: $("p1name").value.trim() || T[LANG].youTitle, w: parseInt($("p1w").value||"80",10), g: $("p1gender").value },
    { name: $("p2name").value.trim() || T[LANG].friend1, w: parseInt($("p2w").value||"75",10), g: $("p2gender").value },
    { name: $("p3name").value.trim() || T[LANG].friend2, w: parseInt($("p3w").value||"68",10), g: $("p3gender").value },
    { name: $("p4name").value.trim() || T[LANG].friend3, w: parseInt($("p4w").value||"90",10), g: $("p4gender").value }
  ].map(p => ({...p, w: clamp(p.w,35,200)}));

  const mainSport = SPORTS.find(s=>s.key==="run") || SPORTS[0];
  const list = $("battleList");
  list.innerHTML = "";

  people.forEach(p=>{
    const minRun = minutesNeeded(kcal, mainSport.met, p.w, p.g);
    const row = document.createElement("div");
    row.className = "sportRow";
    row.innerHTML = `
      <div>
        <b>${escapeHtml(p.name)}</b>
        <div><span>${p.w} kg · ${genderLabel(p.g)}</span></div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:950; font-size:18px;">${Math.round(minRun)} min</div>
        <div><span>${LANG==="es" ? "corriendo suave" : "easy run"}</span></div>
      </div>
    `;
    list.appendChild(row);
  });

  $("battleResultsWrap").style.display = "block";
}

function renderInverse(weight, gender){
  const sportKey = $("invSport").value;
  const hours = Math.max(0, parseFloat($("invHours").value || "0"));
  const sport = SPORTS.find(s=>s.key===sportKey) || SPORTS[0];
  const factor = GENDER_FACTOR[gender] ?? 1.0;

  const minutes = hours * 60;
  const kpm = kcalPerMinute(sport.met, weight) * factor;
  const burned = Math.max(0, Math.round(kpm * minutes));

  const options = CATALOG
    .filter(x=>x.id!=="custom" && Number.isFinite(x.kcal) && x.kcal > 0)
    .map(x=>({
      kcal:x.kcal,
      label: (LANG==="es" ? x.es : x.en)
    }));

  const scored = options.map(it=>{
    const units = burned / it.kcal;
    const score = Math.abs(1 - units);
    return { ...it, units, score };
  }).sort((a,b)=>a.score-b.score).slice(0, 10);

  const list = $("inverseList");
  list.innerHTML = "";

  const head = document.createElement("div");
  head.className = "sportRow";
  head.innerHTML = `
    <div>
      <b>${T[LANG].burned}</b>
      <div><span>${T[LANG].burnedWith(LANG==="es"?sport.es:sport.en, hours.toFixed(2))}</span></div>
    </div>
    <div style="text-align:right;">
      <div style="font-weight:950; font-size:18px; color:var(--good);">${burned} kcal</div>
      <div><span>${T[LANG].edible}</span></div>
    </div>
  `;
  list.appendChild(head);

  scored.forEach(it=>{
    const u = it.units;
    const uTxt = (u >= 2) ? `${u.toFixed(1)}x` : `${u.toFixed(2)}x`;
    const row = document.createElement("div");
    row.className = "sportRow";
    row.innerHTML = `
      <div>
        <b>${escapeHtml(it.label)}</b>
        <div><span>~${Math.round(it.kcal)} kcal ${T[LANG].perUnit}</span></div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:950; font-size:18px;">${uTxt}</div>
        <div><span>${T[LANG].approxUnits}</span></div>
      </div>
    `;
    list.appendChild(row);
  });

  $("inverseResultsWrap").style.display = "block";
  return burned;
}

// =========================
// Meme generation (Canvas)
// =========================
function blob(ctx, x, y, r, color){
  const g = ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}

function trimTo(ctx, text, maxWidth){
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + "…").width > maxWidth){
    t = t.slice(0, -1);
  }
  return t + "…";
}

function pickMemeVariant(kcal){
  if (kcal < 400) return "light";
  if (kcal < 900) return "mid";
  if (kcal < 1600) return "hard";
  return "apocalypse";
}

function memeCopy(variant){
  const ES = {
    light:      { title:"PECADO VENIAL", sub:"Esto se arregla andando y sin llorar.", stamp:"✅ SALVABLE" },
    mid:        { title:"PECADO SERIO",  sub:"El cardio te está escribiendo un WhatsApp.", stamp:"⚠️ DOLORCITO" },
    hard:       { title:"CRIMEN GASTRONÓMICO", sub:"Tu reloj ya ha llamado a su abogado.", stamp:"🔥 ALERTA" },
    apocalypse: { title:"APOCALIPSIS CALÓRICO", sub:"Has invocado al gimnasio. Enfadado.", stamp:"☠️ RIP" }
  };
  const EN = {
    light:      { title:"MINOR SIN", sub:"A brisk walk will do. No tears.", stamp:"✅ FIXABLE" },
    mid:        { title:"SERIOUS SIN", sub:"Cardio just texted you.", stamp:"⚠️ OOF" },
    hard:       { title:"GASTRO CRIME", sub:"Your watch hired a lawyer.", stamp:"🔥 ALERT" },
    apocalypse: { title:"CALORIE APOCALYPSE", sub:"Gym has been summoned. Angry.", stamp:"☠️ RIP" }
  };
  return (LANG==="es" ? ES[variant] : EN[variant]);
}

function pickSportForMeme(kcal, weight, gender){
  const rows = SPORTS.map(s=>{
    const m = minutesNeeded(kcal, s.met, weight, gender);
    return {s, m};
  }).filter(x => isFinite(x.m)).sort((a,b)=>a.m-b.m);

  const mid = rows[Math.floor(rows.length/2)] || rows[0];
  const name = (LANG==="es" ? mid.s.es : mid.s.en);
  const mins = Math.round(mid.m);
  const mins5 = Math.max(5, Math.round(mins/5)*5);

  return (LANG==="es") ? `${mins5} min de ${name}` : `${mins5} min of ${name}`;
}

/**
 * Genera meme en canvas (inline) y devuelve dataURL.
 * opts.scrollToMeme: si true, hace scroll al memeWrap (manual calc).
 */
function generateMeme({kcal, modeName, label, weight, sportPick, scrollToMeme}){
  const wrap = $("memeWrap");
  const canvas = $("memeCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;

  const variant = pickMemeVariant(kcal);
  const copy = memeCopy(variant);

  // Fondo
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0, "rgba(91,124,250,1)");
  g.addColorStop(1, "rgba(255,79,216,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  ctx.globalAlpha = 0.25;
  blob(ctx, 230, 180, 220, "rgba(56,232,255,1)");
  blob(ctx, 980, 160, 260, "rgba(255,180,72,1)");
  blob(ctx, 820, 540, 300, "rgba(56,232,255,1)");
  ctx.globalAlpha = 1;

  // Tarjeta
  roundRect(ctx, 60, 60, w-120, h-120, 34);
  ctx.fillStyle = "rgba(10,14,40,.74)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.stroke();

  // Header brand
  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.font = "900 56px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("LOVASASUDAR.COM", 100, 140);

  // Big stamp
  ctx.font = "950 38px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,227,106,.95)";
  const stamp = copy.stamp;
  const sw = ctx.measureText(stamp).width;
  ctx.fillText(stamp, w - 100 - sw, 140);

  // Variant title
  ctx.font = "950 48px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.93)";
  ctx.fillText(copy.title, 100, 205);

  ctx.font = "750 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.78)";
  ctx.fillText(copy.sub, 100, 245);

  // Kcal huge
  ctx.font = "950 130px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${kcal}`, 100, 370);

  ctx.font = "900 44px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.fillText("kcal", 450, 370);

  // Details
  ctx.font = "800 30px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.85)";
  const d1 = (LANG==="es")
    ? `Modo: ${modeName} · Peso: ${weight}kg`
    : `Mode: ${modeName} · Weight: ${weight}kg`;
  ctx.fillText(d1, 100, 435);

  const d2 = (LANG==="es")
    ? `Comida/bebida: ${label || T.es.memeFoodFallback}`
    : `Item: ${label || T.en.memeFoodFallback}`;
  ctx.fillText(trimTo(ctx, d2, w-200), 100, 480);

  ctx.font = "900 38px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,227,106,.95)";
  const d3 = (LANG==="es") ? `Solución: ${sportPick}` : `Solution: ${sportPick}`;
  ctx.fillText(trimTo(ctx, d3, w-200), 100, 540);

  ctx.font = "800 24px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.70)";
  const foot = (LANG==="es")
    ? "Comparte y que el grupo cargue con la culpa."
    : "Share it and let the group carry the guilt.";
  ctx.fillText(foot, 100, 590);

  wrap.style.display = "block";

  const url = canvas.toDataURL("image/png");

  // Links/botones arriba + abajo
  const dl = $("btnDownload");
  dl.href = url;
  dl.style.display = "inline-flex";

  const dlTop = $("btnDownloadTop");
  dlTop.href = url;
  dlTop.style.display = "inline-flex";

  const shareBtn = $("btnShare");
  const shareTop = $("btnShareTop");

  const canShare = !!navigator.share;
  shareBtn.style.display = canShare ? "inline-flex" : "none";
  shareTop.style.display = canShare ? "inline-flex" : "none";

  // Botón “ver full-screen”
  if ($("btnOpenMeme")) $("btnOpenMeme").style.display = "inline-flex";

  if (scrollToMeme){
    requestAnimationFrame(()=>{
      wrap.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  }

  return url;
}

async function shareMeme(url){
  try{
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], "lovasasudar-meme.png", { type: "image/png" });
    await navigator.share({
      title: "LoVasASudar.com",
      text: T[LANG].memeShareText,
      files: [file]
    });
    track("share_meme", { lang: LANG });
  }catch(e){
    alert(T[LANG].memeShareFail);
    track("share_meme_fail", { lang: LANG });
  }
}

// =========================
// Meme Modal (Acción 3)
// =========================
function openMemeModal(){
  const modal = $("memeModal");
  modal.classList.add("isOpen");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeMemeModal(){
  const modal = $("memeModal");
  modal.classList.remove("isOpen");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function copyInlineMemeToModal(){
  const src = $("memeCanvas");
  const dst = $("memeCanvasModal");
  const ctx = dst.getContext("2d");
  ctx.clearRect(0,0,dst.width,dst.height);
  ctx.drawImage(src, 0, 0, dst.width, dst.height);
}

// =========================
// Calculation + AUTO calculate (Acción 1)
// =========================
let LAST_MEME_URL = null;

function calculate(opts){
  const o = Object.assign({ auto:false, scrollToResults:false, openMeme:false }, opts || {});

  $("battleResultsWrap").style.display = "none";
  $("inverseResultsWrap").style.display = "none";

  // Ocultar CTAs share/download hasta regenerar
  ["btnDownload","btnShare","btnDownloadTop","btnShareTop","btnShareModal","btnDownloadModal"].forEach(id=>{
    const el = $(id);
    if (el) el.style.display = "none";
  });

  const mode = getSelectedMode();
  const modeName = T[LANG].modeNames[mode] || mode;

  const weight = clamp(parseInt($("weight").value||"80",10),35,200);
  const gender = $("gender").value;

  const kcal = getTotalCaloriesWithMode();

  $("kcalOut").textContent = `${kcal} kcal`;
  $("kcalSub").textContent = T[LANG].kcalSub;
  $("modeOut").textContent = modeName;
  $("modeSub").textContent = T[LANG].modeSub;

  let summary = "—";
  let kcalForMeme = kcal;
  let memeLabel = getSelectedLabel();

  if (mode === "normal" || mode === "drinks"){
    renderSportsTable(kcal, weight, gender);
    summary = T[LANG].summaryNormal(kcal);
    $("sportsTitle").textContent = T[LANG].sportsTitle;
  }

  if (mode === "battle"){
    renderSportsTable(kcal, weight, gender);
    renderBattle(kcal);
    summary = T[LANG].summaryBattle(kcal);
    $("sportsTitle").textContent = T[LANG].sportsTitle;
  }

  if (mode === "inverse"){
    const burned = renderInverse(weight, gender);
    $("kcalOut").textContent = `${burned} kcal`;
    $("kcalSub").textContent = T[LANG].burned;
    $("sportsList").innerHTML = "";
    $("sportsTitle").textContent = T[LANG].earnedTitle;
    summary = T[LANG].summaryInverse(burned);

    kcalForMeme = burned;
    const sportKey = $("invSport").value;
    const sport = SPORTS.find(s=>s.key===sportKey) || SPORTS[0];
    const hours = Math.max(0, parseFloat($("invHours").value || "0"));
    memeLabel = (LANG==="es")
      ? `Ejercicio: ${sport.es} (${hours.toFixed(2)}h)`
      : `Exercise: ${sport.en} (${hours.toFixed(2)}h)`;
  }

  $("mainOut").textContent = "OK";
  $("mainSub").textContent = summary;

  $("results").style.display = "block";

  if (o.scrollToResults){
    $("results").scrollIntoView({ behavior:"smooth", block:"start" });
  }

  // Analytics
  track("calculate", {
    mode,
    kcal: kcalForMeme,
    weight,
    gender,
    item_id: $("food").value,
    item_label: getSelectedLabel(),
    lang: LANG,
    auto: o.auto ? 1 : 0
  });

  const sportPick = (mode === "inverse")
    ? (LANG==="es" ? "A comer con tranquilidad (moderada)" : "Eat with (moderate) peace")
    : pickSportForMeme(kcalForMeme, weight, gender);

  const url = generateMeme({
    kcal: kcalForMeme,
    modeName,
    label: memeLabel,
    weight,
    sportPick,
    scrollToMeme: !!o.openMeme // solo si es manual/forzado
  });

  LAST_MEME_URL = url;

  // Wire share botones (arriba + abajo)
  const fnShare = ()=>shareMeme(url);
  if ($("btnShare")) $("btnShare").onclick = fnShare;
  if ($("btnShareTop")) $("btnShareTop").onclick = fnShare;

  // Wire modal actions
  const canShare = !!navigator.share;
  if ($("btnShareModal")) $("btnShareModal").style.display = canShare ? "inline-flex" : "none";
  if ($("btnShareModal")) $("btnShareModal").onclick = fnShare;

  if ($("btnDownloadModal")){
    $("btnDownloadModal").href = url;
    $("btnDownloadModal").style.display = "inline-flex";
  }

  // abrir modal si procede (Acción 3)
  if (o.openMeme){
    copyInlineMemeToModal();
    openMemeModal();
    track("meme_modal_open", { lang: LANG, mode });
  }

  track("meme_generated", { mode, kcal: kcalForMeme, lang: LANG, auto: o.auto ? 1 : 0 });
}

// Manual meme regenerate
function onMeme(){
  calculate({ auto:false, scrollToResults:true, openMeme:true });
}

// Autocalc: debounce para no recalcular por cada tecla
const requestAutoCalc = debounce(()=>{
  // No abras el modal en auto. Solo actualiza resultados + meme inline.
  calculate({ auto:true, scrollToResults:false, openMeme:false });
}, 220);

// =========================
// Language apply
// =========================
function setDocumentMeta(){
  document.documentElement.lang = LANG;
  document.title = T[LANG].pageTitle;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", T[LANG].pageDesc);
}

function applyLanguage(){
  const t = T[LANG];

  $("brand").textContent = t.brand;
  $("title").textContent = t.title;
  $("subtitle").textContent = t.subtitle;

  $("lblFood").textContent = t.lblFood;
  $("lblUnits").textContent = t.lblUnits;
  $("hintUnits").textContent = t.hintUnits;
  $("lblExtra").textContent = t.lblExtra;
  $("hintExtra").textContent = t.hintExtra;
  $("lblWeight").textContent = t.lblWeight;
  $("hintWeight").textContent = t.hintWeight;
  $("lblGender").textContent = t.lblGender;
  $("hintGender").textContent = t.hintGender;

  $("tNormal").textContent = t.modes.normal;
  $("tDrinks").textContent = t.modes.drinks;
  $("tBattle").textContent = t.modes.battle;
  $("tInverse").textContent = t.modes.inverse;

  $("btnCalc").textContent = t.btnCalc;
  if ($("btnCalcTop")) $("btnCalcTop").textContent = t.btnCalc;
  if ($("btnCalcSticky")) $("btnCalcSticky").textContent = (LANG==="es") ? "CALCULAR 💪" : "CALCULATE 💪";

  $("resTitle").textContent = t.results;
  $("kcalSub").textContent = t.kcalSub;
  $("modeSub").textContent = t.modeSub;
  $("sportsTitle").textContent = t.sportsTitle;

  $("btnMeme").textContent = t.meme;

  if ($("btnDownload")) $("btnDownload").textContent = t.download;
  if ($("btnShare")) $("btnShare").textContent = t.share;
  if ($("btnDownloadTop")) $("btnDownloadTop").textContent = t.downloadTop;
  if ($("btnShareTop")) $("btnShareTop").textContent = t.shareTop;

  $("fineprint").textContent = t.fine;

  $("drinksTitle").textContent = t.drinksTitle;
  $("drinksHint").textContent = t.drinksHint;

  $("battleTitle").textContent = t.battleTitle;
  $("youTitle").textContent = t.youTitle;
  $("f1Title").textContent = t.friend1;
  $("f2Title").textContent = t.friend2;
  $("f3Title").textContent = t.friend3;

  $("battleHint1").textContent = t.weightKg;
  $("f1Hint").textContent = t.weightKg;
  $("f2Hint").textContent = t.weightKg;
  $("f3Hint").textContent = t.weightKg;

  $("battleHint2").textContent = t.battleHint2;

  $("inverseTitle").textContent = t.inverseTitle;
  $("lblInvSport").textContent = t.invSport;
  $("lblInvHours").textContent = t.invHours;
  $("invHint").textContent = t.invHint;

  $("battleResultsTitle").textContent = t.battleResultsTitle;
  $("inverseResultsTitle").textContent = t.inverseResultsTitle;

  // modal labels
  if ($("memeModalTitle")) $("memeModalTitle").textContent = (LANG==="es") ? "MEME OFICIAL" : "OFFICIAL MEME";
  if ($("memeModalSub")) $("memeModalSub").textContent = (LANG==="es") ? "Comparte el crimen" : "Share the crime";

  // placeholders
  if (LANG==="en"){
    $("p1name").placeholder = "Name (optional)";
    $("p2name").placeholder = "Name";
    $("p3name").placeholder = "Name";
    $("p4name").placeholder = "Name";
  } else {
    $("p1name").placeholder = "Nombre (opcional)";
    $("p2name").placeholder = "Nombre";
    $("p3name").placeholder = "Nombre";
    $("p4name").placeholder = "Nombre";
  }

  const prevFood = $("food").value || "pizza_medium";
  buildFoodSelect(prevFood);
  fillDrinkSelects();
  fillInverseSports();

  setDocumentMeta();

  // tras cambiar idioma, recalcula suavemente
  requestAutoCalc();
}

// =========================
// URL lang (?lang=en)
// =========================
function getLangFromUrl(){
  try{
    const u = new URL(window.location.href);
    const q = (u.searchParams.get("lang") || "").toLowerCase();
    if (q === "en" || q === "es") return q;
  }catch(_){}
  return null;
}

function setLangInUrl(lang){
  try{
    const u = new URL(window.location.href);
    u.searchParams.set("lang", lang);
    history.replaceState({}, "", u.toString());
  }catch(_){}
}

// =========================
// SEO landings (NO UI changes)
// =========================
const SEO_LP = {
  burn: {
    canonicalPath: "/quemar-calorias-ejercicio/",
    es: { title: "Cuánto ejercicio necesito para quemar calorías | LoVasASudar",
      desc: "Calcula cuánto ejercicio necesitas para quemar calorías de comida y alcohol. Estimación por MET + meme compartible."},
    en: { title: "How much exercise to burn calories | LoVasASudar",
      desc: "Estimate exercise needed to burn calories from food and drinks (MET-based) + shareable meme."}
  },
  alcohol: {
    canonicalPath: "/calorias-alcohol-ejercicio/",
    es: { title: "Calorías del alcohol y ejercicio equivalente | LoVasASudar",
      desc: "Descubre cuántas calorías tienen tus copas y cuánto ejercicio necesitas para sudarlas. Incluye modo noche de copas."},
    en: { title: "Alcohol calories & exercise equivalent | LoVasASudar",
      desc: "See alcohol calories and the exercise needed to burn them. Includes night-out mode."}
  },
  pizza: {
    canonicalPath: "/calorias-pizza-como-quemarlas/",
    es: { title: "Calorías de una pizza y cómo quemarlas | LoVasASudar",
      desc: "Pizza dentro, cardio fuera: calcula el tiempo de ejercicio aproximado para quemar una pizza y genera meme."},
    en: { title: "Pizza calories & how to burn them | LoVasASudar",
      desc: "Pizza in, cardio out: estimate exercise time to burn a pizza and generate a meme."}
  },
  fast: {
    canonicalPath: "/ejercicios-para-quemar-calorias/",
    es: { title: "Ejercicios para quemar calorías rápido | LoVasASudar",
      desc: "Compara deportes (correr, bici, HIIT, pesas, incluso dardos) y mira cuánto tardas en quemar tus calorías."},
    en: { title: "Best exercises to burn calories fast | LoVasASudar",
      desc: "Compare sports (run, bike, HIIT, weights, even darts) and see how long it takes to burn your calories."}
  },
  compare: {
    canonicalPath: "/calorias-comida-vs-ejercicio/",
    es: { title: "Calorías de comida vs ejercicio necesario | LoVasASudar",
      desc: "Traduce calorías a esfuerzo real: comida y bebida vs minutos de ejercicio. Simple, rápido y compartible."},
    en: { title: "Food calories vs exercise needed | LoVasASudar",
      desc: "Translate calories into real effort: food/drinks vs minutes of exercise. Simple, fast and shareable."}
  }
};

function applySeoLanding(){
  let lp = null;
  try{
    const u = new URL(window.location.href);
    lp = (u.searchParams.get("lp") || "").toLowerCase();
  }catch(_){}

  if (!lp || !SEO_LP[lp]) return;

  const cfg = SEO_LP[lp][LANG] || SEO_LP[lp].es;

  const tEl = document.getElementById("metaTitle");
  if (tEl) tEl.textContent = cfg.title;

  const dEl = document.getElementById("metaDesc");
  if (dEl) dEl.setAttribute("content", cfg.desc);

  const cEl = document.getElementById("linkCanonical");
  if (cEl) cEl.setAttribute("href", "https://lovasasudar.com" + SEO_LP[lp].canonicalPath);

  track("seo_landing_view", { lp, lang: LANG });
}

// =========================
// Init
// =========================
function init(){
  const qLang = getLangFromUrl();
  if (qLang) LANG = qLang;
  else {
    const nav = (navigator.language || "es").toLowerCase();
    LANG = nav.startsWith("en") ? "en" : "es";
  }

  // Language buttons
  $("btnES").addEventListener("click", ()=>{
    LANG = "es";
    $("btnES").classList.add("active");
    $("btnEN").classList.remove("active");
    setLangInUrl("es");
    applyLanguage();
    track("lang_change", { lang: "es" });
  });
  $("btnEN").addEventListener("click", ()=>{
    LANG = "en";
    $("btnEN").classList.add("active");
    $("btnES").classList.remove("active");
    setLangInUrl("en");
    applyLanguage();
    track("lang_change", { lang: "en" });
  });

  if (LANG==="en"){ $("btnEN").classList.add("active"); $("btnES").classList.remove("active"); }
  else { $("btnES").classList.add("active"); $("btnEN").classList.remove("active"); }

  buildFoodSelect("pizza_medium");
  fillDrinkSelects();
  fillInverseSports();
  setDocumentMeta();
  applySeoLanding();

  // Mode pills
  document.querySelectorAll('input[name="mode"]').forEach(r=>{
    r.addEventListener("change", syncModePills);
  });
  syncModePills();

  // CTA manual (los 3 botones)
  const manualCalc = ()=>calculate({ auto:false, scrollToResults:true, openMeme:true });
  $("btnCalc").addEventListener("click", manualCalc);
  if ($("btnCalcTop")) $("btnCalcTop").addEventListener("click", manualCalc);
  if ($("btnCalcSticky")) $("btnCalcSticky").addEventListener("click", manualCalc);

  // Meme manual
  $("btnMeme").addEventListener("click", ()=>{
    track("meme_click", { lang: LANG });
    onMeme();
  });

  // Open meme fullscreen (Acción 3)
  if ($("btnOpenMeme")){
    $("btnOpenMeme").addEventListener("click", ()=>{
      if (!LAST_MEME_URL){
        // si todavía no hay meme, calcula manual y abre
        manualCalc();
        return;
      }
      copyInlineMemeToModal();
      // set download/share links
      if ($("btnDownloadModal")){
        $("btnDownloadModal").href = LAST_MEME_URL;
        $("btnDownloadModal").style.display = "inline-flex";
      }
      const canShare = !!navigator.share;
      if ($("btnShareModal")) $("btnShareModal").style.display = canShare ? "inline-flex" : "none";
      openMemeModal();
    });
  }

  // Close modal
  if ($("btnCloseMeme")) $("btnCloseMeme").addEventListener("click", closeMemeModal);
  if ($("memeModal")){
    $("memeModal").addEventListener("click", (e)=>{
      if (e.target === $("memeModal")) closeMemeModal();
    });
  }
  document.addEventListener("keydown", (e)=>{
    if (e.key === "Escape") closeMemeModal();
  });

  // Normalize units
  $("units").addEventListener("blur", ()=>{
    const n = Math.max(1, parseInt($("units").value || "1",10));
    $("units").value = String(n);
    requestAutoCalc();
  });

  // Autocalc triggers (Acción 1)
  const autoFields = [
    "food","units","extra","weight","gender",
    "drink1","drink2","drink3","drink1n","drink2n","drink3n",
    "invSport","invHours",
    "p1w","p2w","p3w","p4w","p1gender","p2gender","p3gender","p4gender"
  ];
  autoFields.forEach(id=>{
    const el = $(id);
    if (!el) return;
    const ev = (el.tagName.toLowerCase()==="input") ? "input" : "change";
    el.addEventListener(ev, ()=>{
      if (id === "food") track("food_change", { item_id: $("food").value, lang: LANG });
      else track("input_change", { field:id, mode:getSelectedMode(), lang: LANG });
      requestAutoCalc();
    });
  });

  // If custom -> focus extra
  $("food").addEventListener("change", ()=>{
    if ($("food").value === "custom") $("extra").focus();
  });

  applyLanguage();

  // Page view
  track("page_view_custom", { lang: LANG });

  // Primera “pintada” automática con defaults (Acción 1)
  calculate({ auto:true, scrollToResults:false, openMeme:false });
}

init();
