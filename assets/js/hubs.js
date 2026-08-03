import { CATALOG } from './catalog.js';
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

const nav = `<a class="logo" href="/">LO VAS A SUDAR</a><div class="nav-links" aria-label="Temas"><a href="/calorias-alcohol/">Alcohol</a><a href="/calorias-pizzas/">Pizzas</a><a href="/calorias-hamburguesas-comida-rapida/">Hamburguesas</a><a href="/calorias-dulces-snacks/">Dulces</a><a href="/calorias-tapas-comida-espanola/">Tapas</a><a href="/ejercicios-equivalencias/">Ejercicio</a><a href="/metodologia-fuentes/">Fuentes</a></div>`;
const footer = `<nav aria-label="Pie"><a href="/">Calculadora y memes</a><a href="/ejercicios-equivalencias/">Equivalencias</a><a href="/metodologia-fuentes/">Metodología y fuentes</a></nav><p>Estimaciones recreativas. No son consejo médico, nutricional ni deportivo. Comer no crea una deuda que haya que “pagar” entrenando.</p><p>© 2026 LoVasASudar.com · Sudamos los números, no tu paciencia.</p>`;
document.querySelector('.site-head .nav')?.insertAdjacentHTML('afterbegin', nav);
document.querySelector('.site-foot')?.insertAdjacentHTML('afterbegin', footer);

const category = document.body.dataset.category;
const items = CATALOG.filter(x => !category || category === 'all' || x.category === category || (category === 'exercise' && x.group));
document.querySelectorAll('[data-food-select]').forEach(select => {
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.es} · ${item.kcalMin ? `${item.kcalMin}–${item.kcalMax}` : item.kcal} kcal`;
    select.append(option);
  });
});

document.querySelectorAll('[data-calc]').forEach(calc => {
  calc.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(calc);
    const item = CATALOG.find(x => x.id === data.get('food')) || items[0];
    const units = Math.max(1, Number(data.get('units')) || 1);
    const weight = Math.min(200, Math.max(35, Number(data.get('weight')) || 75));
    const sport = SPORTS.find(x => x.key === data.get('sport')) || SPORTS[0];
    const kcal = Math.round(item.kcal * units);
    const minutes = Math.round(kcal / (sport.met * 3.5 * weight / 200));
    const range = item.kcalMin ? ` (rango de origen: ${item.kcalMin * units}–${item.kcalMax * units} kcal)` : '';
    calc.querySelector('[data-result]').textContent = `${kcal} kcal aprox.${range} ≈ ${minutes} min de ${sport.es.toLowerCase()} para ${weight} kg.`;
    window.gtag?.('event','hub_calculate',{category,item_id:item.id,kcal});
  });
});

document.querySelectorAll('[data-catalog-table]').forEach(table => {
  table.innerHTML = items.map(item => `<tr><td><strong>${item.es}</strong><br><span class="source">${item.serving}</span></td><td>${item.kcalMin ? `${item.kcalMin}–${item.kcalMax}` : item.kcal} kcal</td><td class="status-${item.status}">${item.status === 'official' ? 'Oficial' : 'Estimación'}</td><td><a href="${item.sourceUrl}">${item.source}</a><br><span class="source">${item.market} · consulta ${item.checked}</span></td></tr>`).join('');
});
