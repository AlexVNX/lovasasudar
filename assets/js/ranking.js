// assets/js/ranking.js
// Ranking semanal + Top países + dopamina (ES/EN)
// Ultra-defensivo: si algo falla, NO rompe la app principal

import { $ } from "./helpers.js";

/* =========================
   Config
========================= */
const PROJECT_REF = window.LVAS_SUPABASE_PROJECT_REF || "xjszetgxhrrdqtxgmfvo";
const FN_SUBMIT = `https://${PROJECT_REF}.functions.supabase.co/submit-entry`;
const FN_LEADERBOARD = `https://${PROJECT_REF}.functions.supabase.co/get-leaderboard`;
const ANON = window.SUPABASE_ANON_KEY || "";

/* =========================
   Idioma
========================= */
function getLang() {
  const l = (document.documentElement.lang || "es").toLowerCase();
  return l.startsWith("en") ? "en" : "es";
}

const STR = {
  es: {
    title: "🏆 Ranking semanal (lo más bestia)",
    subtitle: "Bandera = país estimado (best-effort). Sin datos personales.",
    filterAll: "Todos los modos",
    filterNormal: "Modo normal",
    filterDrinks: "Noche de copas",
    filterBattle: "Batalla de colegas",
    filterInverse: "Calculadora inversa",
    topCountries: "🌍 Top países (semana)",
    nickPh: "Tu nick (opcional)",
    submit: "🚀 Subir este resultado",
    needCalc: "Primero calcula algo arriba 😅",
    missingKey: "Falta la ANON key en frontend.",
    ok: "✅ Subido al ranking",
    deduped: "✅ Ya estaba subido (mismo meme).",
    rejected: "⚠️ Marcado como no válido (anti-troll).",
    netErr: "Error de red",
    empty: "Aún no hay bestias esta semana. Sé el primero 😈",
    youTop: (p) => `🎯 Estás en el top ${p}% esta semana.`,
    youNo: "🎯 Sube un resultado con tu nick para ver tu %.",
    streak0: "🔥 Racha: 1 día",
    streakN: (n) => `🔥 Racha: ${n} días`,
  },
  en: {
    title: "🏆 Weekly leaderboard (the wildest)",
    subtitle: "Flag = estimated country (best-effort). No personal data.",
    filterAll: "All modes",
    filterNormal: "Normal mode",
    filterDrinks: "Night out",
    filterBattle: "Friends battle",
    filterInverse: "Inverse calculator",
    topCountries: "🌍 Top countries (week)",
    nickPh: "Your nick (optional)",
    submit: "🚀 Submit this result",
    needCalc: "Calculate something first 😅",
    missingKey: "Missing ANON key in frontend.",
    ok: "✅ Submitted",
    deduped: "✅ Already submitted (same meme).",
    rejected: "⚠️ Marked invalid (anti-troll).",
    netErr: "Network error",
    empty: "No beasts yet this week. Be the first 😈",
    youTop: (p) => `🎯 You are in the top ${p}% this week.`,
    youNo: "🎯 Submit with your nick to see your %.",
    streak0: "🔥 Streak: 1 day",
    streakN: (n) => `🔥 Streak: ${n} days`,
  }
};

/* =========================
   Utils
========================= */
function flagEmoji(code) {
  const c = (code || "XX").toUpperCase();
  if (c.length !== 2) return "🌍";
  const A = 0x1F1E6;
  const a = c.charCodeAt(0) - 65;
  const b = c.charCodeAt(1) - 65;
  if (a < 0 || a > 25 || b < 0 || b > 25) return "🌍";
  return String.fromCodePoint(A + a, A + b);
}

function getISOWeekId(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function headers() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ANON}`,
    "apikey": ANON
  };
}

function safeIntFromText(txt) {
  const m = String(txt || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function getSelectedMode() {
  const r = document.querySelector('input[name="mode"]:checked');
  return r ? r.value : "normal";
}

/* =========================
   Meme hash (dedupe)
========================= */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(16);
}

function getMemeHash() {
  const dl = document.getElementById("btnDownload");
  const url = dl?.getAttribute("href");
  if (url && url.startsWith("data:image")) return fnv1a(url.slice(0, 9000));

  const canvas = document.getElementById("memeCanvas");
  if (canvas?.toDataURL) {
    try {
      return fnv1a(canvas.toDataURL("image/png").slice(0, 9000));
    } catch {}
  }
  return "no_meme";
}

/* =========================
   Local streak (dopamina)
========================= */
function streakUpdate() {
  const today = new Date().toISOString().slice(0, 10);
  const last = localStorage.getItem("lvas_streak_last");
  let count = parseInt(localStorage.getItem("lvas_streak_count") || "0", 10);

  if (!last) count = 1;
  else {
    const diff = (new Date(today) - new Date(last)) / 86400000;
    if (diff === 1) count++;
    else if (diff > 1) count = 1;
  }

  localStorage.setItem("lvas_streak_last", today);
  localStorage.setItem("lvas_streak_count", count);
  return count;
}

/* =========================
   API calls
========================= */
async function callLeaderboard({ week_id, mode, nick }) {
  const res = await fetch(FN_LEADERBOARD, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ week_id, mode, limit: 15, nick })
  });
  const data = await res.json().catch(() => null);
  if (!data || !data.ok) throw new Error("leaderboard_error");
  return data;
}

async function callSubmit({ lang, nick }) {
  const kcal = safeIntFromText($("kcalOut")?.textContent);
  if (!kcal) return { ok: false, error: "need_calc" };

  const food = $("food");
  const item_id = food?.value || "unknown";
  const item_label = food?.options[food.selectedIndex]?.textContent || "Item";

  const res = await fetch(FN_SUBMIT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      mode: getSelectedMode(),
      lang,
      item_id,
      item_label: item_label.slice(0, 120),
      meme_hash: getMemeHash(),
      kcal,
      nick
    })
  });

  return await res.json().catch(() => ({ ok: false }));
}

/* =========================
   Render
========================= */
function renderEntries(list, entries) {
  list.innerHTML = "";
  entries.forEach((e, i) => {
    list.insertAdjacentHTML("beforeend", `
      <div class="rankRow">
        <div class="rankPos">${i + 1}</div>
        <div class="rankNick">${flagEmoji(e.country)} ${e.nick || "Anon"}</div>
        <div class="rankMeta">${e.mode}</div>
        <div class="rankKcal">${e.kcal} kcal</div>
      </div>
    `);
  });
}

function renderCountries(box, rows) {
  box.innerHTML = "";
  rows.forEach(r => {
    box.insertAdjacentHTML("beforeend", `
      <div class="countryRow">
        <div class="countryName">${flagEmoji(r.country)} ${r.country}</div>
        <div class="countryCount">${r.entries}</div>
        <div class="countryBest">${r.best} kcal</div>
      </div>
    `);
  });
}

/* =========================
   INIT
========================= */
export function initRanking() {
  try {
    const wrap = $("rankWrap");
    if (!wrap) return;

    const LANG = getLang();
    const s = STR[LANG];

    $("rankTitle").textContent = s.title;
    $("rankSub").textContent = s.subtitle;
    $("rankCountriesTitle").textContent = s.topCountries;

    const filter = $("rankFilter");
    const list = $("rankList");
    const countries = $("rankCountries");
    const nick = $("rankNick");
    const submit = $("rankSubmit");
    const status = $("rankStatus");
    const dopamine = $("rankDopamine");

    filter.innerHTML = `
      <option value="all">${s.filterAll}</option>
      <option value="normal">${s.filterNormal}</option>
      <option value="drinks">${s.filterDrinks}</option>
      <option value="battle">${s.filterBattle}</option>
      <option value="inverse">${s.filterInverse}</option>
    `;

    nick.placeholder = s.nickPh;
    submit.textContent = s.submit;

    const week_id = getISOWeekId();

    async function refresh() {
      try {
        const data = await callLeaderboard({
          week_id,
          mode: filter.value,
          nick: nick.value.trim()
        });

        data.entries?.length
          ? renderEntries(list, data.entries)
          : list.innerHTML = `<div class="rankEmpty">${s.empty}</div>`;

        renderCountries(countries, data.countries || []);

        dopamine.textContent = data.you?.percentile
          ? s.youTop(data.you.percentile)
          : s.youNo;
      } catch {
        list.innerHTML = `<div class="rankEmpty">${s.netErr}</div>`;
      }
    }

    filter.onchange = refresh;

    submit.onclick = async () => {
      status.textContent = "…";
      const out = await callSubmit({ lang: LANG, nick: nick.value.trim() });

      if (!out.ok) {
        status.textContent = out.error === "need_calc" ? s.needCalc : s.netErr;
        return;
      }

      status.textContent = out.deduped ? s.deduped : (out.is_valid === false ? s.rejected : s.ok);
      dopamine.textContent = (streakUpdate() <= 1) ? s.streak0 : s.streakN(streakUpdate());
      refresh();
    };

    refresh();
  } catch {
    // silencio total: nunca rompe la app
  }
}

/* =========================
   RE-INIT on language change
========================= */
document.addEventListener("lang_change", () => {
  initRanking();
});
