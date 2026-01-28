import { $ } from "./helpers.js";
import { minutesNeeded } from "./calc.js";
import { SPORTS } from "./sports.js";

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

function memeCopy(LANG, variant){
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

export function pickSportForMeme(LANG, kcal, weight, gender){
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

export function generateMeme({LANG, T, kcal, modeName, label, weight, sportPick}){
  const wrap = $("memeWrap");
  const canvas = $("memeCanvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;

  const variant = pickMemeVariant(kcal);
  const copy = memeCopy(LANG, variant);

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

  roundRect(ctx, 60, 60, w-120, h-120, 34);
  ctx.fillStyle = "rgba(10,14,40,.74)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.font = "900 56px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("LOVASASUDAR.COM", 100, 140);

  ctx.font = "950 38px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,227,106,.95)";
  const stamp = copy.stamp;
  const sw = ctx.measureText(stamp).width;
  ctx.fillText(stamp, w - 100 - sw, 140);

  ctx.font = "950 48px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.93)";
  ctx.fillText(copy.title, 100, 205);

  ctx.font = "750 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.78)";
  ctx.fillText(copy.sub, 100, 245);

  ctx.font = "950 130px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${kcal}`, 100, 370);

  ctx.font = "900 44px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.fillText("kcal", 450, 370);

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

  const dl = $("btnDownload");
  dl.href = url;
  dl.style.display = "inline-flex";

  const dlTop = $("btnDownloadTop");
  dlTop.href = url;
  dlTop.style.display = "inline-flex";

  const canShare = !!navigator.share;
  $("btnShare").style.display = canShare ? "inline-flex" : "none";
  $("btnShareTop").style.display = canShare ? "inline-flex" : "none";

  // ❌ IMPORTANTE: ya NO hacemos scroll aquí

  return url;
}

export async function shareMeme(T, LANG, track, url){
  try{
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], "lovasasudar-meme.png", { type: "image/png" });
    await navigator.share({
      title: "LoVasASudar.com",
      text: T[LANG].memeShareText,
      files: [file]
    });
    track("share_meme", { lang: LANG });
  }catch(_){
    alert(T[LANG].memeShareFail);
    track("share_meme_fail", { lang: LANG });
  }
}
