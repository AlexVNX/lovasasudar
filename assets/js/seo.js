import { track } from "./analytics.js";

export const SEO_LP = {
  burn: {
    canonicalPath: "/quemar-calorias-ejercicio/",
    es: { title: "Cuánto ejercicio necesito para quemar calorías | LoVasASudar",
          desc: "Calcula cuánto ejercicio necesitas para quemar calorías de comida y alcohol. Estimación por MET + meme compartible." },
    en: { title: "How much exercise to burn calories | LoVasASudar",
          desc: "Estimate exercise needed to burn calories from food and drinks (MET-based) + shareable meme." }
  },
  alcohol: {
    canonicalPath: "/calorias-alcohol-ejercicio/",
    es: { title: "Calorías del alcohol y ejercicio equivalente | LoVasASudar",
          desc: "Descubre cuántas calorías tienen tus copas y cuánto ejercicio necesitas para sudarlas. Incluye modo noche de copas." },
    en: { title: "Alcohol calories & exercise equivalent | LoVasASudar",
          desc: "See alcohol calories and the exercise needed to burn them. Includes night-out mode." }
  },
  pizza: {
    canonicalPath: "/calorias-pizza-como-quemarlas/",
    es: { title: "Calorías de una pizza y cómo quemarlas | LoVasASudar",
          desc: "Pizza dentro, cardio fuera: calcula el tiempo de ejercicio aproximado para quemar una pizza y genera meme." },
    en: { title: "Pizza calories & how to burn them | LoVasASudar",
          desc: "Pizza in, cardio out: estimate exercise time to burn a pizza and generate a meme." }
  },
  fast: {
    canonicalPath: "/ejercicios-para-quemar-calorias/",
    es: { title: "Ejercicios para quemar calorías rápido | LoVasASudar",
          desc: "Compara deportes (correr, bici, HIIT, pesas, incluso dardos) y mira cuánto tardas en quemar tus calorías." },
    en: { title: "Best exercises to burn calories fast | LoVasASudar",
          desc: "Compare sports (run, bike, HIIT, weights, even darts) and see how long it takes to burn your calories." }
  },
  compare: {
    canonicalPath: "/calorias-comida-vs-ejercicio/",
    es: { title: "Calorías de comida vs ejercicio necesario | LoVasASudar",
          desc: "Traduce calorías a esfuerzo real: comida y bebida vs minutos de ejercicio. Simple, rápido y compartible." },
    en: { title: "Food calories vs exercise needed | LoVasASudar",
          desc: "Translate calories into real effort: food/drinks vs minutes of exercise. Simple, fast and shareable." }
  }
};

export function applySeoLanding(LANG){
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
