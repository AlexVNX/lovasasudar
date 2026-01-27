export const $ = (id)=>document.getElementById(id);

export function clamp(n,a,b){ return Math.min(b, Math.max(a,n)); }
export function round(n){ return Math.round(n); }

// kcal/min = (MET * 3.5 * weightKg) / 200
export function kcalPerMinute(met, weightKg){
  return (met * 3.5 * weightKg) / 200;
}

export function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
