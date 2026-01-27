import { $, clamp, kcalPerMinute, escapeHtml } from "./helpers.js";
import { CATALOG } from "./catalog.js";
import { SPORTS, GENDER_FACTOR, genderLabel } from "./sports.js";

export function getSelectedMode(){
  const r = document.querySelector('input[name="mode"]:checked');
  return r ? r.value : "normal";
}

export function minutesNeeded(kcal, sportMet, weightKg, gender){
  const factor = GENDER_FACTOR[gender] ?? 1.0;
  const kpm = kcalPerMinute(sportMet, weightKg) * factor;
  if (kpm <= 0) return Infinity;
  return kcal / kpm;
}

export function getSelectedLabel(LANG){
  const opt = $("food").selectedOptions[0];
  if (!opt) return "";
  return (LANG==="es" ? (opt.dataset.labelEs || "") : (opt.dataset.labelEn || "")) || opt.textContent.trim();
}

export function getSelectedKcal(){
  const opt = $("food").selectedOptions[0];
  if (!opt) return 0;
  const k = parseFloat(opt.dataset.kcal || "0");
  return Number.isFinite(k) ? k : 0;
}

export function drinkKcalById(id){
  const it = CATALOG.find(x=>x.id===id);
  return it ? it.kcal : 0;
}

export function getTotalCaloriesWithMode(){
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

export function renderSportsTable(LANG, T, kcal, weight, gender){
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

export function renderBattle(LANG, T, kcal){
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
        <div><span>${p.w} kg · ${genderLabel(LANG, p.g)}</span></div>
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

export function renderInverse(LANG, T, weight, gender){
  const sportKey = $("invSport").value;
  const hours = Math.max(0, parseFloat($("invHours").value || "0"));
  const sport = SPORTS.find(s=>s.key===sportKey) || SPORTS[0];
  const factor = GENDER_FACTOR[gender] ?? 1.0;

  const minutes = hours * 60;
  const kpm = kcalPerMinute(sport.met, weight) * factor;
  const burned = Math.max(0, Math.round(kpm * minutes));

  const options = CATALOG
    .filter(x=>x.id!=="custom" && Number.isFinite(x.kcal) && x.kcal > 0)
    .map(x=>({ kcal:x.kcal, label:(LANG==="es"?x.es:x.en) }));

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
