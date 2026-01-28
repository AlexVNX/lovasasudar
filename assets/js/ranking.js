// assets/js/ranking.js
// Ranking semanal + Top países + dopamina (ES/EN)
// Diseñado para NO romper nada: si falta DOM o keys, se desactiva silenciosamente.

import { $ } from "./helpers.js";

const PROJECT_REF = window.LVAS_SUPABASE_PROJECT_REF || "xjszetgxhrrdqtxgmfvo";
const FN_SUBMIT = `https://${PROJECT_REF}.functions.supabase.co/submit-entry`;
const FN_LEADERBOARD = `https://${PROJECT_REF}.functions.supabase.co/get-leaderboard`;

// ANON key (ponla en index.html como window.SUPABASE_ANON_KEY = "..." )
const ANON = window.SUPABASE_ANON_KEY || "";

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

function flagEmoji(code) {
  const c = (code || "XX").toUpperCase();
  if (c === "XX" || c.length !== 2) return "🌍";
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
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const ww = String(weekNo).padStart(2, "0");
  return `${date.getUTCFullYear()}-W${ww}`;
}

function headers() {
  // Supabase Edge Functions requieren auth con anon (Bearer + apikey)
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

// FNV-1a hash (simple, rápido)
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16);
}

function getMemeHash() {
  // usamos href de descarga si existe (dataURL). Si no, hash del canvas.
  const dl = document.getElementById("btnDownload");
  const url = dl && dl.getAttribute("href");
  if (url && url.startsWith("data:image")) return fnv1a(url.slice(0, 9000));

  const canvas = document.getElementById("memeCanvas");
  if (canvas && canvas.toDataURL) {
    try {
      const d = canvas.toDataURL("image/png").slice(0, 9000);
      return fnv1a(d);
    } catch (_) {}
  }
  return "no_meme";
}

function streakUpdate() {
  // streak local: cuenta días consecutivos con submits OK (no es server-side; es dopamina barata)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const keyToday = `${yyyy}-${mm}-${dd}`;

  const last = localStorage.getItem("lvas_streak_last") || "";
  let count = parseInt(localStorage.getItem("lvas_streak_count") || "0", 10) || 0;

  if (!last) {
    count = 1;
  } else {
    const lastD = new Date(last + "T00:00:00");
    const diffDays = Math.round((today - lastD) / 86400000);
    if (diffDays === 0) {
      // mismo día: no sube
    } else if (diffDays === 1) {
      count += 1;
    } else {
      count = 1;
    }
  }

  localStorage.setItem("lvas_streak_last", keyToday);
  localStorage.setItem("lvas_streak_count", String(count));
  return count;
}

async function callLeaderboard({ week_id, mode, nick }) {
  const res = await fetch(FN_LEADERBOARD, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      week_id,
      mode,
      limit: 15,
      nick: nick || ""
    })
  });
  const data = await res.json().catch(() => null);
  if (!data || !data.ok) throw new Error(data?.error || "leaderboard_error");
  return data;
}

async function callSubmit({ lang, nick }) {
  const kcal = safeIntFromText(document.getElementById("kcalOut")?.textContent);
  if (!kcal || kcal <= 0) return { ok: false, error: "need_calc" };

  const mode = getSelectedMode();
  const foodSel = document.getElementById("food");
  const item_id = foodSel ? foodSel.value : "unknown";
  const item_label = foodSel
    ? (foodSel.options[foodSel.selectedIndex]?.textContent || "Item").slice(0, 120)
    : "Item";

  const meme_hash = getMemeHash();

  const res = await fetch(FN_SUBMIT, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      mode,
      lang,
      item_id,
      item_label,
      meme_hash,
      kcal,
      nick: nick || ""
    })
  });

  const out = await res.json().catch(() => null);
  if (!out) return { ok: false, error: "no_response" };
  return out;
}

function el(id) {
  return document.getElementById(id);
}

function renderEntries(listEl, entries) {
  listEl.innerHTML = "";
  entries.forEach((e, idx) => {
    const row = document.createElement("div");
    row.className = "rankRow";
    const nick = e.nick || "Anon";
    const kcal = (e.kcal ?? e.score ?? 0);
    const cc = (e.country || "XX").toUpperCase();
    const flag = flagEmoji(cc);
    const mode = (e.mode || "").toLowerCase();

    row.innerHTML = `
      <div class="rankPos">${idx + 1}</div>
      <div class="rankNick">${flag} ${nick}</div>
      <div class="rankMeta">${mode}</div>
      <div class="rankKcal">${kcal} kcal</div>
    `;
    listEl.appendChild(row);
  });
}

function renderCountries(cEl, rows) {
  cEl.innerHTML = "";
  rows.forEach(r => {
    const cc = (r.country || "XX").toUpperCase();
    const flag = flagEmoji(cc);
    const row = document.createElement("div");
    row.className = "countryRow";
    row.innerHTML = `
      <div class="countryName">${flag} ${cc}</div>
      <div class="countryCount">${r.entries}</div>
      <div class="countryBest">${r.best} kcal</div>
    `;
    cEl.appendChild(row);
  });
}

// PUBLIC: init
export function initRanking() {
  try {
    // Si no existe el bloque ranking, salimos sin hacer nada
    const wrap = el("rankWrap");
    if (!wrap) return;

    const LANG = getLang();
    const s = STR[LANG];

    const title = el("rankTitle");
    const sub = el("rankSub");
    const filter = el("rankFilter");
    const list = el("rankList");
    const cTitle = el("rankCountriesTitle");
    const countries = el("rankCountries");
    const nick = el("rankNick");
    const submit = el("rankSubmit");
    const status = el("rankStatus");
    const dopamine = el("rankDopamine");

    if (!filter || !list || !submit || !nick || !status) return;

    if (title) title.textContent = s.title;
    if (sub) sub.textContent = s.subtitle;
    if (cTitle) cTitle.textContent = s.topCountries;

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
      status.textContent = "";
      if (dopamine) dopamine.textContent = "";

      if (!ANON) {
        list.innerHTML = `<div class="rankEmpty">${s.missingKey}</div>`;
        if (countries) countries.innerHTML = "";
        return;
      }

      try {
        const mode = filter.value || "all";
        const data = await callLeaderboard({
          week_id,
          mode,
          nick: nick.value.trim()
        });

        if (!data.entries || data.entries.length === 0) {
          list.innerHTML = `<div class="rankEmpty">${s.empty}</div>`;
        } else {
          renderEntries(list, data.entries);
        }

        if (countries && data.countries) renderCountries(countries, data.countries);

        if (dopamine) {
          if (data.you && data.you.percentile) {
            dopamine.textContent = s.youTop(data.you.percentile);
          } else {
            dopamine.textContent = s.youNo;
          }
        }
      } catch (_e) {
        list.innerHTML = `<div class="rankEmpty">${s.netErr}</div>`;
      }
    }

    filter.addEventListener("change", refresh);

    submit.addEventListener("click", async () => {
      status.textContent = "…";

      if (!ANON) {
        status.textContent = s.missingKey;
        return;
      }

      const out = await callSubmit({ lang: LANG, nick: nick.value.trim() })
        .catch(() => ({ ok: false, error: "network" }));

      if (!out || out.ok !== true) {
        status.textContent = (out?.error === "need_calc") ? s.needCalc : s.netErr;
        return;
      }

      if (out.deduped) status.textContent = s.deduped;
      else if (out.is_valid === false) status.textContent = s.rejected;
      else status.textContent = s.ok;

      // streak local
      if (dopamine) {
        const n = streakUpdate();
        dopamine.textContent = (n <= 1) ? s.streak0 : s.streakN(n);
      }

      // refrescar tabla
      await refresh();
    });

    // carga inicial
    refresh();
  } catch (_e) {
    // silencio total: ranking nunca debe romper la app
  }
}
