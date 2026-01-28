import { track } from "./analytics.js";
import { $, clamp } from "./helpers.js";
import { T, getLangFromUrl, setLangInUrl } from "./i18n.js";
import { CATALOG } from "./catalog.js";
import { SPORTS } from "./sports.js";
import { applySeoLanding } from "./seo.js";

import {
  getSelectedMode,
  getSelectedLabel,
  getTotalCaloriesWithMode,
  renderSportsTable,
  renderBattle,
  renderInverse
} from "./calc.js";

import { generateMeme, pickSportForMeme, shareMeme } from "./meme.js";

// -------------------------
// Select builders
// -------------------------
function buildFoodSelect(LANG, preserveId){
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

function fillDrinkSelects(LANG){
  const opts = CATALOG.filter(x=>x.group==="drink");
  ["drink1","drink2","drink3"].forEach(id=>{
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

function fillInverseSports(LANG){
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

// -------------------------
// UI sync
// -------------------------
function syncModePills(LANG){
  document.querySelectorAll(".mode").forEach(l => l.classList.remove("active"));
  const selected = document.querySelector('input[name="mode"]:checked');
  if (selected) selected.closest(".mode").classList.add("active");

  $("panelDrinks").style.display  = (getSelectedMode()==="drinks") ? "block" : "none";
  $("panelBattle").style.display  = (getSelectedMode()==="battle") ? "block" : "none";
  $("panelInverse").style.display = (getSelectedMode()==="inverse") ? "block" : "none";

  $("btnCalc").textContent = T[LANG].btnCalc;

  track("mode_change", { mode: getSelectedMode(), lang: LANG });
}

function setDocumentMeta(LANG){
  document.documentElement.lang = LANG;
  document.title = T[LANG].pageTitle;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", T[LANG].pageDesc);
}

function applyLanguage(LANG){
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

  $("resTitle").textContent = t.results;
  $("kcalSub").textContent = t.kcalSub;
  $("modeSub").textContent = t.modeSub;
  $("sportsTitle").textContent = t.sportsTitle;

  $("btnMeme").textContent = t.meme;

  $("btnDownload").textContent = t.download;
  $("btnShare").textContent = t.share;

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
  buildFoodSelect(LANG, prevFood);
  fillDrinkSelects(LANG);
  fillInverseSports(LANG);

  setDocumentMeta(LANG);
}

// -------------------------
// Meme overlay (A3)
// -------------------------
let overlayKeyHandler = null;
let overlayClickHandler = null;

function openMemeOverlay(url){
  const overlay = $("memeOverlay");
  const img = $("memeOverlayImg");
  if (!overlay || !img) return;

  img.src = url;

  const dl = $("btnDownloadOverlay");
  if (dl){
    dl.href = url;
    dl.style.display = "inline-flex";
  }

  const sh = $("btnShareOverlay");
  if (sh){
    sh.style.display = "inline-flex";
    sh.onclick = ()=>shareMeme(T, LANG, track, url);
  }

  overlay.hidden = false;

  // Click fuera
  overlayClickHandler = (e)=>{
    if (e.target === overlay) closeMemeOverlay();
  };
  overlay.addEventListener("click", overlayClickHandler);

  // ESC
  overlayKeyHandler = (e)=>{
    if (e.key === "Escape") closeMemeOverlay();
  };
  document.addEventListener("keydown", overlayKeyHandler);
}

function closeMemeOverlay(){
  const overlay = $("memeOverlay");
  if (!overlay) return;

  overlay.hidden = true;

  if (overlayClickHandler){
    overlay.removeEventListener("click", overlayClickHandler);
    overlayClickHandler = null;
  }
  if (overlayKeyHandler){
    document.removeEventListener("keydown", overlayKeyHandler);
    overlayKeyHandler = null;
  }
}

// -------------------------
// Main calculate
// -------------------------
let LANG = "es";
let lastMemeUrl = null;

/**
 * calculate({source, auto})
 * auto=true: autocalc (NO abre overlay)
 */
function calculate({ source = "btn", auto = false } = {}){
  $("battleResultsWrap").style.display = "none";
  $("inverseResultsWrap").style.display = "none";
  $("memeWrap").style.display = "none";

  // OJO: aquí ocultamos top duplicados y solo usamos bottom
  ["btnDownload","btnShare","btnDownloadTop","btnShareTop"].forEach(id=>{
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
  let memeLabel = getSelectedLabel(LANG);

  if (mode === "normal" || mode === "drinks"){
    renderSportsTable(LANG, T, kcal, weight, gender);
    summary = T[LANG].summaryNormal(kcal);
    $("sportsTitle").textContent = T[LANG].sportsTitle;
  }

  if (mode === "battle"){
    renderSportsTable(LANG, T, kcal, weight, gender);
    renderBattle(LANG, T, kcal);
    summary = T[LANG].summaryBattle(kcal);
    $("sportsTitle").textContent = T[LANG].sportsTitle;
  }

  if (mode === "inverse"){
    const burned = renderInverse(LANG, T, weight, gender);
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
  $("results").scrollIntoView({ behavior:"smooth", block:"start" });

  // Tracking
  const baseTrack = {
    mode,
    kcal: kcalForMeme,
    weight,
    gender,
    item_id: $("food").value,
    item_label: getSelectedLabel(LANG),
    lang: LANG,
    source
  };
  if (auto) track("auto_calculate", baseTrack);
  else track("calculate", baseTrack);

  const sportPick = (mode === "inverse")
    ? (LANG==="es" ? "A comer con tranquilidad (moderada)" : "Eat with (moderate) peace")
    : pickSportForMeme(LANG, kcalForMeme, weight, gender);

  const url = generateMeme({
    LANG, T,
    kcal: kcalForMeme,
    modeName,
    label: memeLabel,
    weight,
    sportPick
  });

  lastMemeUrl = url;

  // SOLO botones bottom
  const fnShare = ()=>shareMeme(T, LANG, track, url);
  $("btnShare").onclick = fnShare;

  const dlBottom = $("btnDownload");
  if (dlBottom){
    dlBottom.href = url;
    dlBottom.style.display = "inline-flex";
  }
  const shBottom = $("btnShare");
  if (shBottom){
    shBottom.style.display = "inline-flex";
  }

  track("meme_generated", { mode, kcal: kcalForMeme, lang: LANG, source: auto ? "auto" : source });

  // Overlay dominante SOLO en acciones “humanas”, no en autocalc
  if (!auto) openMemeOverlay(url);
}

// -------------------------
// Autocalc (A1)
// -------------------------
function debounce(fn, ms){
  let t = null;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), ms);
  };
}

const autoCalcDebounced = debounce((source)=>{
  calculate({ source, auto: true });
}, 250);

// -------------------------
// Init
// -------------------------
function init(){
  const qLang = getLangFromUrl();
  if (qLang) LANG = qLang;
  else {
    const nav = (navigator.language || "es").toLowerCase();
    LANG = nav.startsWith("en") ? "en" : "es";
  }

  // Lang buttons
  $("btnES").addEventListener("click", ()=>{
    LANG = "es";
    $("btnES").classList.add("active");
    $("btnEN").classList.remove("active");
    setLangInUrl("es");
    applyLanguage(LANG);
    track("lang_change", { lang: "es" });
    applySeoLanding(LANG);
    autoCalcDebounced("lang_change");
  });
  $("btnEN").addEventListener("click", ()=>{
    LANG = "en";
    $("btnEN").classList.add("active");
    $("btnES").classList.remove("active");
    setLangInUrl("en");
    applyLanguage(LANG);
    track("lang_change", { lang: "en" });
    applySeoLanding(LANG);
    autoCalcDebounced("lang_change");
  });

  if (LANG==="en"){ $("btnEN").classList.add("active"); $("btnES").classList.remove("active"); }
  else { $("btnES").classList.add("active"); $("btnEN").classList.remove("active"); }

  buildFoodSelect(LANG, "pizza_medium");
  fillDrinkSelects(LANG);
  fillInverseSports(LANG);
  setDocumentMeta(LANG);
  applySeoLanding(LANG);

  document.querySelectorAll('input[name="mode"]').forEach(r=>{
    r.addEventListener("change", ()=>{
      syncModePills(LANG);
      autoCalcDebounced("mode_change");
    });
  });
  syncModePills(LANG);

  // Conecta TODOS los CTAs de cálculo
  document.querySelectorAll('[data-calc="1"]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      calculate({ source: btn.id || "btn", auto: false });
    });
  });

  // Meme button: regenerar + overlay
  $("btnMeme").addEventListener("click", ()=>{
    track("meme_click", { lang: LANG });
    calculate({ source: "meme_btn", auto: false });
  });

  // Overlay controls
  const closeBtn = $("btnCloseMemeOverlay");
  if (closeBtn) closeBtn.addEventListener("click", closeMemeOverlay);

  const regen = $("btnRegenOverlay");
  if (regen) regen.addEventListener("click", ()=>{
    calculate({ source: "overlay_regen", auto: false });
  });

  // Units sanitize + autocalc
  $("units").addEventListener("blur", ()=>{
    const n = Math.max(1, parseInt($("units").value || "1",10));
    $("units").value = String(n);
    autoCalcDebounced("units_blur");
  });
  $("units").addEventListener("change", ()=>{
    track("input_change", { field:"units", mode:getSelectedMode(), lang: LANG });
    autoCalcDebounced("units_change");
  });

  $("food").addEventListener("change", ()=>{
    track("food_change", { item_id: $("food").value, lang: LANG });
    if ($("food").value === "custom") $("extra").focus();
    autoCalcDebounced("food_change");
  });

  [
    "weight","gender","extra",
    "drink1","drink2","drink3","drink1n","drink2n","drink3n",
    "invSport","invHours",
    "p1w","p2w","p3w","p4w","p1gender","p2gender","p3gender","p4gender"
  ].forEach(id=>{
    const el = $(id);
    if (!el) return;
    el.addEventListener("change", ()=>{
      track("input_change", { field:id, mode:getSelectedMode(), lang: LANG });
      autoCalcDebounced(`change_${id}`);
    });
  });

  applyLanguage(LANG);

  track("page_view_custom", { lang: LANG });

  // Enter = calcular manual
  document.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
      const tag = (e.target && e.target.tagName || "").toLowerCase();
      if (tag === "textarea") return;
      e.preventDefault();
      calculate({ source: "enter", auto: false });
    }
  });

  // Autocalc inicial: resultados sin overlay
  setTimeout(()=>autoCalcDebounced("auto_initial"), 50);
}

init();
