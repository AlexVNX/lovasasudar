import { $ } from "./helpers.js";

// ---------------------
// Config
// ---------------------
const PROJECT_REF = "xjszetgxhrrdqtxgmfvo";
const FN_LEADERBOARD = `https://${PROJECT_REF}.functions.supabase.co/get-leaderboard`;
const FN_SUBMIT = `https://${PROJECT_REF}.functions.supabase.co/submit-entry`;

// ✅ Pon aquí tu ANON public key (la misma que ya tienes en tu config frontend)
const SUPABASE_ANON = window.SUPABASE_ANON_KEY || ""; // recomendado: definir window.SUPABASE_ANON_KEY en index.html

// ---------------------
// i18n minimal (ES/EN)
// ---------------------
function getLang() {
  const htmlLang = (document.documentElement.lang || "es").toLowerCase();
  return htmlLang.startsWith("en") ? "en" : "es";
}

const STR = {
  es: {
    title: "🏆 Ranking semanal (lo más bestia)",
    subtitle: "Bandera = país estimado (best-effort). Sin datos personales.",
    empty: "Aún no hay bestias esta semana. Sé el primero 😈",
    filterAll: "Todos los modos",
    filterNormal: "Modo normal",
    filterDrinks: "Noche de copas",
    filterBattle: "Batalla de colegas",
    filterInverse: "Calculadora inversa",
    nickPh: "Tu nick (opcional)",
    submit: "🚀 Subir este resultado",
    needCalc: "Primero calcula algo (arriba) 😅",
    needKey: "Falta ANON key en frontend.",
    ok: "✅ Subido al ranking",
    deduped: "✅ Ya estaba subido (mismo meme).",
    rejected: "⚠️ Marcado como no válido (anti-troll).",
    netErr: "Error de red",
    topCountries: "🌍 Top países (semana)",
    youTop: (p) => `🎯 Estás en el top ${p}% esta semana.`,
    youNo: "🎯 Sube un resultado con tu nick para ver tu %.",
  },
  en: {
    title: "🏆 Weekly leaderboard (the wildest)",
    subtitle: "Flag = estimated country (best-effort). No personal data.",
    empty: "No beasts yet this week. Be the first 😈",
    filterAll: "All modes",
    filterNormal: "Normal mode",
    filterDrinks: "Night out",
    filterBattle: "Friends battle",
    filterInverse: "Inverse calculator",
    nickPh: "Your nick (optional)",
    submit: "🚀 Submit this result",
    needCalc: "Calculate something first (above) 😅",
    needKey: "Missing ANON key in frontend.",
    ok: "✅ Submitted to leaderboard",
    deduped: "✅ Already submitted (same meme).",
    rejected: "⚠️ Marked as invalid (anti-troll).",
    netErr: "Network error",
    topCountries: "🌍 Top countries (week)",
    youTop: (p) => `🎯 You are in the top ${p}% this week.`,
    youNo: "🎯 Submit a result with your nick to see your %. ",
  }
};

function flagEmoji(code) {
  const c = (code || "XX").toUpperCase();
  if (c === "XX" || c.length !== 2) return "🌍";
  const A = 0x1F1E6;
  const cc = c.charCodeAt(0) - 65;
  const dd = c.charCodeAt(1) - 65;
  if (cc < 0 || cc > 25 || dd < 0 || dd > 25) return "🌍";
  return String.fromCodePoint(A + cc, A + dd);
}

// ISO week id (same logic as backend)
function getISOWeekId(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const ww = String(weekNo).padStart(2, "0");
  return `${date.getUTCFullYear()}-W${ww}`;
}

function fnHeaders() {
  // Para llamar a Supabase Functions en producción necesitas Authorization+apikey
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${SUPABASE_ANON}`,
    "apikey": SUPABASE_ANON
  };
}

function getSelectedMode() {
  const r = document.querySelector('input[name="mode"]:checked');
  return r ? r.value : "normal";
}

function safeIntFromText(txt) {
  const m = String(txt || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// Hash rápido (FNV-1a) para dedupe semanal
function hashFNV1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16);
}

function getMemeHash() {
  // usamos el href del download (dataURL), recortado para no freír el móvil
  const dl = document.getElementById("btnDownload");
  const url = dl && dl.getAttribute("href");
  if (!url) return "no_meme";
  const slice = url.slice(0, 8000);
  return hashFNV1a(slice);
}

// ---------------------
// DOM (IDs esperados)
// ---------------------
const DOM = {
  wrap: document.getElementById("rankWrap"),
  title: document.getElementById("rankTitle"),
  subtitle: document.getElementById("rankSub"),
  filter: document.getElementById("rankFilter"),
  list: document.getElementById("rankList"),
  countriesTitle: document.getElementById("rankCountriesTitle"),
  countries: document.getElementById("rankCountries"),
  nick: document.getElementById("rankNick"),
  submit: document.getElementById("rankSubmit"),
  status: document.getElementById("rankStatus"),
  dopamine: document.getElementById("rankDopamine"),
};

function hasRankingDom() {
  return DOM.wrap && DOM.list && DOM.filter && DOM.submit && DOM.nick;
}

function renderEmpty(s) {
  DOM.list.innerHTML = `<div style="opacity:.75; padding:10px 2px;">${s}</div>`;
}

function renderEntries(entries) {
  if (!entries || entries.length === 0) return;

  DOM.list.innerHTML = entries.map((e, idx) => {
    const nick = e.nick || "Anon";
    const kcal = e.kcal ?? e.score ?? 0;
    const cc = (e.country || "XX").toUpperCase();
    const flag = flagEmoji(cc);
    const mode = e.mode || "";
    return `
      <div class="rankRow">
        <div class="rankPos">${idx + 1}</div>
        <div class="rankNick">${flag} ${nick}</div>
        <div class="rankMeta">${mode}</div>
        <div class="rankKcal">${kcal} kcal</div>
      </div>
    `;
  }).join("");
}

function renderCountries(rows, s) {
  if (!DOM.countries) return;
  if (!rows || rows.length === 0) {
    DOM.countries.innerHTML = `<div style="opacity:.75; padding:6px 2px;">—</div>`;
    return;
  }
  DOM.countries.innerHTML = rows.map((r) => {
    const cc = (r.country || "XX").toUpperCase();
    const flag = flagEmoji(cc);
    return `
      <div class="countryRow">
        <div class="countryName">${flag} ${cc}</div>
        <div class="countryCount">${r.entries}</div>
        <div class="countryBest">${r.best} kcal</div>
      </div>
    `;
  }).join("");
  if (DOM.countriesTitle) DOM.countriesTitle.textContent = s.topCountries;
}

async function loadLeaderboard({ week_id, mode, nick }) {
  const res = await fetch(FN_LEADERBOARD, {
    method: "POST",
    headers: fnHeaders(),
    body: JSON.stringify({ week_id, mode, limit: 15, nick: nick || "" })
  });

  const data = await res.json().catch(() => null);
  if (!data || !data.ok) throw new Error(data?.error || "leaderboard_error");
  return data;
}

async function submitCurrentResult(LANG, s) {
  if (!SUPABASE_ANON) {
    DOM.status.textContent = s.needKey;
    return;
  }

  // Recogemos valores de la UI existente (sin tocar app.js)
  const kcal = safeIntFromText(document.getElementById("kcalOut")?.textContent);
  if (!kcal || kcal <= 0) {
    DOM.status.textContent = s.needCalc;
    return;
  }

  const mode = getSelectedMode();
  const foodSel = document.getElementById("food");
  const item_id = foodSel ? foodSel.value : "unknown";
  const item_label = foodSel ? (foodSel.options[foodSel.selectedIndex]?.textContent || "Item") : "Item";

  const meme_hash = getMemeHash();
  const nick = (DOM.nick.value || "").trim();

  DOM.status.textContent = "…";

  const res = await fetch(FN_SUBMIT, {
    method: "POST",
    headers: fnHeaders(),
    body: JSON.stringify({
      mode,
      lang: LANG,
      item_id,
      item_label: item_label.slice(0, 120),
      meme_hash,
      kcal,
      nick
    })
  });

  const out = await res.json().catch(() => null);
  if (!out) throw new Error("no_response");
  if (!out.ok) throw new Error(out.error || "submit_error");

  if (out.deduped) DOM.status.textContent = s.deduped;
  else if (out.is_valid === false) DOM.status.textContent = s.rejected;
  else DOM.status.textContent = s.ok;

  return out;
}

// ---------------------
// Init / bind
// ---------------------
export function initRanking() {
  if (!hasRankingDom()) return;

  const LANG = getLang();
  const s = STR[LANG];

  // Textos
  if (DOM.title) DOM.title.textContent = s.title;
  if (DOM.subtitle) DOM.subtitle.textContent = s.subtitle;

  // Filter options (si ya existían, las sobreescribimos para ES/EN)
  DOM.filter.innerHTML = `
    <option value="all">${s.filterAll}</option>
    <option value="normal">${s.filterNormal}</option>
    <option value="drinks">${s.filterDrinks}</option>
    <option value="battle">${s.filterBattle}</option>
    <option value="inverse">${s.filterInverse}</option>
  `;

  DOM.nick.placeholder = s.nickPh;
  DOM.submit.textContent = s.submit;

  const week_id = getISOWeekId();

  async function refresh() {
    const mode = DOM.filter.value || "all";
    DOM.status.textContent = "";
    DOM.dopamine && (DOM.dopamine.textContent = "");

    try {
      const data = await loadLeaderboard({ week_id, mode, nick: DOM.nick.value.trim() });

      if (!data.entries || data.entries.length === 0) renderEmpty(s.empty);
      else renderEntries(data.entries);

      renderCountries(data.countries, s);

      if (DOM.dopamine) {
        if (data.you && data.you.percentile) DOM.dopamine.textContent = s.youTop(data.you.percentile);
        else DOM.dopamine.textContent = s.youNo;
      }
    } catch (_e) {
      renderEmpty(`${s.netErr}`);
    }
  }

  DOM.filter.addEventListener("change", refresh);

  DOM.submit.addEventListener("click", async () => {
    try {
      const out = await submitCurrentResult(LANG, s);
      // tras subir, refrescamos ranking
      if (out) await refresh();
    } catch (_e) {
      DOM.status.textContent = `${s.netErr}`;
    }
  });

  // refresco inicial
  refresh();
}
