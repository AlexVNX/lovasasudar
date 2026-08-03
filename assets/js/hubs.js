import { CATALOG } from './catalog.js';
import { US_CATALOG } from './catalog-us.js';
import { SPORTS } from './sports.js';

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
if (!document.querySelector('script[data-ga4]')) {
  const ga = document.createElement('script');
  ga.async = true;
  ga.dataset.ga4 = 'true';
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-RLQ6Y55SNC';
  document.head.append(ga);
  window.gtag('js', new Date());
  window.gtag('config', 'G-RLQ6Y55SNC', { anonymize_ip:true, allow_ad_personalization_signals:false });
}

const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
const pageCatalog = isEnglish ? US_CATALOG : CATALOG;
const alternatePaths = {
  '/calorias-alcohol/':'/en/alcohol-calories/', '/en/alcohol-calories/':'/calorias-alcohol/',
  '/calorias-pizzas/':'/en/pizza-calories/', '/en/pizza-calories/':'/calorias-pizzas/',
  '/calorias-hamburguesas-comida-rapida/':'/en/burgers-fast-food-calories/', '/en/burgers-fast-food-calories/':'/calorias-hamburguesas-comida-rapida/',
  '/calorias-dulces-snacks/':'/en/candy-snacks-calories/', '/en/candy-snacks-calories/':'/calorias-dulces-snacks/',
  '/calorias-tapas-comida-espanola/':'/en/bar-food-calories/', '/en/bar-food-calories/':'/calorias-tapas-comida-espanola/',
  '/ejercicios-equivalencias/':'/en/exercise-calorie-equivalents/', '/en/exercise-calorie-equivalents/':'/ejercicios-equivalencias/',
  '/metodologia-fuentes/':'/en/methodology-sources/', '/en/methodology-sources/':'/metodologia-fuentes/'
};
const alternate = alternatePaths[window.location.pathname] || (isEnglish ? '/' : '/?lang=en');
const nav = isEnglish
  ? `<a class="logo" href="/?lang=en">LO VAS A SUDAR</a><div class="nav-links" aria-label="Topics"><a href="/en/alcohol-calories/">Alcohol</a><a href="/en/pizza-calories/">Pizza</a><a href="/en/burgers-fast-food-calories/">Burgers</a><a href="/en/candy-snacks-calories/">Candy</a><a href="/en/bar-food-calories/">Bar food</a><a href="/en/exercise-calorie-equivalents/">Exercise</a><a href="/en/methodology-sources/">Sources</a><a class="lang-link" href="${alternate}" lang="es">ES</a></div>`
  : `<a class="logo" href="/">LO VAS A SUDAR</a><div class="nav-links" aria-label="Temas"><a href="/calorias-alcohol/">Alcohol</a><a href="/calorias-pizzas/">Pizzas</a><a href="/calorias-hamburguesas-comida-rapida/">Hamburguesas</a><a href="/calorias-dulces-snacks/">Dulces</a><a href="/calorias-tapas-comida-espanola/">Tapas</a><a href="/ejercicios-equivalencias/">Ejercicio</a><a href="/metodologia-fuentes/">Fuentes</a><a class="lang-link" href="${alternate}" lang="en">EN</a></div>`;
const footer = isEnglish
  ? `<nav aria-label="Footer"><a href="/?lang=en">Calculator and memes</a><a href="/en/exercise-calorie-equivalents/">Exercise equivalents</a><a href="/en/methodology-sources/">Methodology and sources</a></nav><p><strong>Entertainment only.</strong> Approximate, recreational estimates—not medical, nutrition, fitness, or weight-loss advice. Food does not create an exercise debt.</p><p>© 2026 LoVasASudar.com · We sweat the numbers, not your patience.</p>`
  : `<nav aria-label="Pie"><a href="/">Calculadora y memes</a><a href="/ejercicios-equivalencias/">Equivalencias</a><a href="/metodologia-fuentes/">Metodología y fuentes</a></nav><p><strong>Solo entretenimiento.</strong> Estimaciones aproximadas y recreativas; no son consejo médico, nutricional, deportivo ni para perder peso. Comer no crea una deuda de ejercicio.</p><p>© 2026 LoVasASudar.com · Sudamos los números, no tu paciencia.</p>`;
document.querySelector('.site-head .nav')?.insertAdjacentHTML('afterbegin', nav);
document.querySelector('.site-foot')?.insertAdjacentHTML('afterbegin', footer);
document.querySelector('main')?.insertAdjacentHTML('afterbegin', isEnglish
  ? '<aside class="leisure-strip"><strong>ENTERTAINMENT ONLY:</strong> approximate recreational estimates—not medical, nutrition, fitness, eating-disorder or weight-loss advice. Food does not create an exercise debt.</aside>'
  : '<aside class="leisure-strip"><strong>SOLO OCIO Y HUMOR:</strong> estimaciones aproximadas; no son consejo médico, nutricional, deportivo, sobre trastornos alimentarios ni para perder peso. Comer no crea una deuda de ejercicio.</aside>');

const category = document.body.dataset.category;
const items = pageCatalog.filter(x => !category || category === 'all' || x.category === category || (category === 'exercise' && x.group));
document.querySelectorAll('[data-food-select]').forEach(select => {
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${isEnglish ? item.en : item.es} · ${item.kcalMin ? `${item.kcalMin}–${item.kcalMax}` : item.kcal} kcal`;
    select.append(option);
  });
});

// Every contextual calculator exposes the complete activity list used by main.
document.querySelectorAll('select[name="sport"]').forEach(select => {
  select.innerHTML = '';
  SPORTS.forEach(sport => {
    const option = document.createElement('option');
    option.value = sport.key;
    option.textContent = `${isEnglish ? sport.en : sport.es} · MET ${sport.met}`;
    select.append(option);
  });
});

document.querySelectorAll('[data-calc]').forEach(calc => {
  calc.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(calc);
    const item = pageCatalog.find(x => x.id === data.get('food')) || items[0];
    if (!item) return;
    const units = Math.max(1, Number(data.get('units')) || 1);
    const weight = Math.min(440, Math.max(isEnglish ? 77 : 35, Number(data.get('weight')) || (isEnglish ? 165 : 75)));
    const weightKg = isEnglish ? weight * 0.45359237 : weight;
    const sport = SPORTS.find(x => x.key === data.get('sport')) || SPORTS[0];
    const kcal = Math.round(item.kcal * units);
    const minutes = Math.round(kcal / (sport.met * 3.5 * weightKg / 200));
    const range = item.kcalMin ? (isEnglish ? ` (source range: ${item.kcalMin * units}–${item.kcalMax * units} kcal)` : ` (rango de origen: ${item.kcalMin * units}–${item.kcalMax * units} kcal)`) : '';
    calc.querySelector('[data-result]').textContent = isEnglish
      ? `${kcal} kcal approx.${range} ≈ ${minutes} min of ${sport.en.toLowerCase()} at ${weight} lb.`
      : `${kcal} kcal aprox.${range} ≈ ${minutes} min de ${sport.es.toLowerCase()} para ${weight} kg.`;
    window.gtag?.('event','hub_calculate',{category,item_id:item.id,kcal,market:isEnglish?'US':'ES'});
  });
});

document.querySelectorAll('[data-catalog-table]').forEach(table => {
  table.innerHTML = items.map(item => `<tr><td><strong>${isEnglish ? item.en : item.es}</strong><br><span class="source">${item.serving}</span></td><td>${item.kcalMin ? `${item.kcalMin}–${item.kcalMax}` : item.kcal} kcal</td><td class="status-${item.status}">${item.status === 'official' ? (isEnglish ? 'Official' : 'Oficial') : (isEnglish ? 'Estimate' : 'Estimación')}</td><td><a href="${item.sourceUrl}">${item.source}</a><br><span class="source">${item.market} · ${isEnglish ? 'checked' : 'consulta'} ${item.checked}</span></td></tr>`).join('');
});
