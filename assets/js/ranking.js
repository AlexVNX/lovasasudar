// assets/js/ranking.js

const FLAG_CACHE = new Map();

function countryToFlagEmoji(cc){
  if (!cc || cc === "XX") return "🌍";
  const code = cc.toUpperCase();
  if (FLAG_CACHE.has(code)) return FLAG_CACHE.get(code);

  const A = 0x1F1E6;
  const chars = [...code].map(c => A + (c.charCodeAt(0) - 65));
  const emoji = String.fromCodePoint(...chars);
  FLAG_CACHE.set(code, emoji);
  return emoji;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function buildMemeHash(url){
  let h = 2166136261;
  for (let i = 0; i < url.length; i++){
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export async function submitEntry({ supaFnUrl, anonKey, payload }){
  const res = await fetch(`${supaFnUrl}/submit-entry`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "apikey": anonKey,
      "authorization": `Bearer ${anonKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok){
    const j = await res.json().catch(()=>({}));
    return { ok:false, error: j.error || `http_${res.status}` };
  }
  const j = await res.json().catch(()=>({ ok:true }));
  return j;
}

export async function fetchLeaderboard({ supaUrl, anonKey, weekId, mode, limit = 15 }){
  const params = new URLSearchParams();
  params.set("select", "id,created_at,mode,kcal,item_label,nick,country,score");
  params.set("week_id", `eq.${weekId}`);
  if (mode && mode !== "all") params.set("mode", `eq.${mode}`);
  params.set("order", "score.desc");
  params.set("limit", String(limit));

  const res = await fetch(`${supaUrl}/rest/v1/entries?${params.toString()}`, {
    headers: {
      "apikey": anonKey,
      "authorization": `Bearer ${anonKey}`,
      "accept": "application/json"
    }
  });

  if (!res.ok) return [];
  return await res.json();
}

export function renderLeaderboard({ el, rows, lang }){
  if (!el) return;

  if (!rows || rows.length === 0){
    el.innerHTML = `<div style="opacity:.75; padding:10px 0;">
      ${lang==="es" ? "Aún no hay bestias esta semana. Sé el primero 😈" : "No beasts yet this week. Be the first 😈"}
    </div>`;
    return;
  }

  const html = rows.map((r, idx) => {
    const flag = countryToFlagEmoji(r.country);
    const nick = r.nick ? escapeHtml(r.nick) : (lang==="es" ? "Anónimo" : "Anonymous");
    const item = r.item_label ? escapeHtml(r.item_label) : "—";
    const kcal = Number(r.kcal) || 0;
    const pos = idx + 1;

    return `
      <div class="box" style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; min-width:0;">
          <div style="font-weight:950;">#${pos}</div>
          <div style="font-size:18px;">${flag}</div>
          <div style="min-width:0;">
            <div style="font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${nick} · <span style="opacity:.85">${item}</span>
            </div>
            <div style="opacity:.75; font-size:13px;">
              ${lang==="es" ? "Puntuación" : "Score"}: ${Number(r.score)||kcal}
            </div>
          </div>
        </div>
        <div style="font-weight:950; white-space:nowrap;">${kcal} kcal</div>
      </div>
    `;
  }).join("");

  el.innerHTML = html;
}
