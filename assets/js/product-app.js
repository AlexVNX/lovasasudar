import { CATALOG } from "./catalog.js";
import { ACTIVITIES, MAX_CART_ITEMS, basketCalories, range, shareParams, parseShare } from "./product-core.js";
import { createSocialCard, downloadSocialCard } from "./social-card.js";

const $ = (id) => document.getElementById(id);
const categoryNames = { pizza: "Pizza", fastfood: "Comida rápida", tapas: "Tapas", snacks: "Dulces y snacks", alcohol: "Alcohol", softdrink: "Refrescos" };
let selected = null;
let basket = [];
let resultData = null;
let challengeOpened = false;
let calculatorStarted = false;
let notFoundTimer = null;
let consentState = null;
const CONSENT_KEY = "lvas_consent";

function readConsent() {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'accept' || value === 'reject' ? value : null;
  } catch { return null; }
}

function saveConsent(value) {
  consentState = value;
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* La sesion sigue funcionando sin persistencia. */ }
}

function expireAnalyticsCookies() {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const domains = new Set(["", location.hostname, "lovasasudar.com"]);
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      const domainAttribute = domain ? `; Domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/${domainAttribute}; SameSite=Lax${secure}`;
    }
  }
}


function eventParams(product, extras = {}) {
  return { product_id: product?.id, category: product?.category, market: "ES", language: "es", ...extras };
}

function track(name, product, extras = {}) {
  if (consentState !== "accept" || typeof window.gtag !== "function") return;
  window.gtag("event", name, eventParams(product, extras));
}

function loadAnalytics() {
  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", "G-RLQ6Y55SNC", { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: `${location.origin}${location.pathname}` });
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-RLQ6Y55SNC";
  document.head.append(script);
}

function rejectAnalytics() {
  if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  expireAnalyticsCookies();
}

function initConsent() {
  const dialog = $("consent");
  const saved = readConsent();
  consentState = saved;
  if (saved === "accept") loadAnalytics();
  if (saved === "reject") rejectAnalytics();
  if (!saved) dialog.showModal();
  dialog.addEventListener("close", () => {
    if (!['accept', 'reject'].includes(dialog.returnValue)) return;
    saveConsent(dialog.returnValue);
    if (dialog.returnValue === "accept") {
      loadAnalytics();
      if (challengeOpened && resultData) track("challenge_opened", resultData.products[0]);
    } else rejectAnalytics();
    $("status").textContent = dialog.returnValue === "accept" ? "Analítica opcional activada." : "Analítica rechazada. La calculadora sigue funcionando.";
  });
  $("cookie-settings").addEventListener("click", () => dialog.showModal());
  window.addEventListener("storage", (event) => {
    if (event.key !== CONSENT_KEY) return;
    consentState = ['accept', 'reject'].includes(event.newValue) ? event.newValue : null;
    if (consentState === "accept") loadAnalytics();
    else rejectAnalytics();
  });
}

function markStarted() {
  if (calculatorStarted) return;
  calculatorStarted = true;
  track("calculator_start");
}

function renderProducts() {
  const term = $("search").value.trim().toLocaleLowerCase("es");
  const category = $("category").value;
  const matches = CATALOG.filter((product) => (!category || product.category === category) && `${product.es} ${categoryNames[product.category] || ""}`.toLocaleLowerCase("es").includes(term));
  $("products").replaceChildren(...matches.map((product) => {
    const button = document.createElement("button");
    button.className = "product";
    button.type = "button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(selected?.id === product.id));
    const name = document.createElement("b");
    const serving = document.createElement("small");
    name.textContent = product.es;
    serving.textContent = product.serving;
    button.append(name, serving);
    button.addEventListener("click", () => selectProduct(product));
    return button;
  }));
  $("empty").hidden = matches.length > 0;
  clearTimeout(notFoundTimer);
  if (!matches.length && term.length >= 3) notFoundTimer = setTimeout(() => track("product_not_found"), 700);
}

function selectProduct(product) {
  markStarted();
  selected = product;
  $("name").textContent = product.es;
  $("serving").textContent = product.serving;
  $("badge").textContent = product.status === "official" ? "Dato oficial" : "Estimación con rango";
  renderProducts();
  track("product_selected", product);
}

function validQuantity() {
  const quantity = Number($("quantity").value);
  return quantity > 0 && quantity <= 20 ? quantity : null;
}

function addToBasket() {
  const quantity = validQuantity();
  if (!selected || !quantity) {
    $("error").textContent = "Elige un producto y una cantidad entre 0,25 y 20.";
    return;
  }
  const existing = basket.find((item) => item.id === selected.id);
  if (existing) {
    if (existing.quantity + quantity > 20) { $("error").textContent = "La cantidad máxima por producto es 20."; return; }
    existing.quantity += quantity;
  } else {
    if (basket.length >= MAX_CART_ITEMS) { $("error").textContent = `La cesta admite hasta ${MAX_CART_ITEMS} productos distintos.`; return; }
    basket.push({ id: selected.id, quantity });
  }
  $("error").textContent = "";
  renderBasket();
  track("basket_item_added", selected, { item_count_bucket: basket.length >= 5 ? "5-8" : String(basket.length) });
}

function renderBasket() {
  $("cart").hidden = basket.length === 0;
  $("cart-count").textContent = `${basket.length} ${basket.length === 1 ? "producto" : "productos"}`;
  $("cart-items").replaceChildren(...basket.map((item, index) => {
    const product = CATALOG.find((entry) => entry.id === item.id);
    const row = document.createElement("li");
    const text = document.createElement("span");
    const remove = document.createElement("button");
    text.textContent = `${item.quantity} × ${product.es} · ${product.serving}`;
    remove.type = "button";
    remove.className = "remove-item";
    remove.setAttribute("aria-label", `Quitar ${product.es}`);
    remove.textContent = "Quitar";
    remove.addEventListener("click", () => { basket.splice(index, 1); renderBasket(); });
    row.append(text, remove);
    return row;
  }));
}

function effectiveItems() {
  if (basket.length) return basket.map((item) => ({ ...item }));
  const quantity = validQuantity();
  return selected && quantity ? [{ id: selected.id, quantity }] : [];
}

function formatRange(value) { return value.min === value.max ? `≈ ${value.mid}` : `≈ ${value.min}–${value.max}`; }

function calculateResult({ focus = true, fromChallenge = false } = {}) {
  const items = effectiveItems();
  const weight = Number($("weight").value);
  if (!Number.isFinite(weight)) { $("error").textContent = "Revisa el peso opcional (35-200 kg)."; return; }
  if (!items.length || weight < 35 || weight > 200) { $("error").textContent = "Añade un producto y revisa el peso opcional (35–200 kg)."; return; }
  const kcal = basketCalories(items, CATALOG);
  const products = items.map((item) => CATALOG.find((product) => product.id === item.id));
  const primary = range(kcal, ACTIVITIES[0], weight);
  const title = products.length === 1 ? products[0].es : `${products.length} antojos en la cesta`;
  const servings = items.map((item, index) => `${item.quantity} × ${products[index].serving}`).join(" · ");
  const officialCount = products.filter((product) => product.status === "official").length;
  $("result-badge").textContent = officialCount === products.length
    ? "DATOS OFICIALES"
    : officialCount > 0 ? "DATOS OFICIALES + ESTIMACIONES" : "ESTIMACIONES";
  $("result-title").textContent = title;
  $("meta").textContent = `${servings} · mercado España`;
  $("kcal").textContent = kcal.min === kcal.max ? `${Math.round(kcal.mid)} kcal por las raciones indicadas` : `${Math.round(kcal.min)}–${Math.round(kcal.max)} kcal estimadas`;
  $("minutes").textContent = `${formatRange(primary)} min`;
  $("secondary").replaceChildren(...ACTIVITIES.slice(1).map((activity) => {
    const article = document.createElement("article");
    const value = document.createElement("b");
    const label = document.createElement("span");
    value.textContent = `${formatRange(range(kcal, activity, weight))} min`;
    label.textContent = activity.name;
    article.append(value, label);
    return article;
  }));
  $("source").textContent = products.map((product) => `${product.es}: ${product.source} (${product.checked})`).join(" · ");
  $("source-link").href = products[0].sourceUrl;
  $("source-link").textContent = products.length > 1 ? "Abrir primera fuente" : "Ver fuente";
  $("result").hidden = false;
  resultData = { items, products, title, servings, minutes: `${formatRange(primary)} min` };
  history.replaceState(null, "", shareParams(items));
  if (focus) $("result").focus();
  track(fromChallenge ? "challenge_calculation_completed" : "calculation_completed", products[0], { mode: products.length > 1 ? "basket" : "single", item_count_bucket: products.length >= 5 ? "5-8" : String(products.length) });
}

function challengeUrl() { return new URL(shareParams(resultData.items), `${location.origin}${location.pathname}`).href; }

async function copyChallenge() {
  await navigator.clipboard.writeText(challengeUrl());
  $("status").textContent = "Enlace copiado.";
  track("link_copied", resultData.products[0]);
}

async function shareChallenge() {
  if (!resultData) return;
  const data = { title: `${resultData.title} traducido a sudor`, text: "Yo ya he traducido este antojo a sudor. Ahora te toca a ti.", url: challengeUrl() };
  track("share_intent", resultData.products[0]);
  try {
    const blob = await createSocialCard({ title: resultData.title, serving: resultData.servings, result: resultData.minutes });
    const file = new File([blob], "lovasasudar-reto.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) data.files = [file];
  } catch { /* El enlace sigue siendo compartible aunque falle el canvas. */ }
  if (navigator.share) {
    try {
      await navigator.share(data);
      $("status").textContent = "Reto listo para circular.";
      track("share_completed", resultData.products[0]);
      if (challengeOpened) track("challenge_reshared", resultData.products[0]);
      return;
    } catch (error) { if (error.name === "AbortError") return; }
  }
  await copyChallenge();
}

function runDuel() {
  const first = CATALOG.find((product) => product.id === $("duel-a").value);
  const second = CATALOG.find((product) => product.id === $("duel-b").value);
  const difference = first.kcal - second.kcal;
  $("duel-result").textContent = `Por las raciones indicadas, ${first.es} tiene aproximadamente ${Math.abs(difference)} kcal ${difference >= 0 ? "más" : "menos"} que ${second.es}. ${first.serving} frente a ${second.serving}. Datos ${first.status === "official" ? "oficiales" : "estimados"} / ${second.status === "official" ? "oficiales" : "estimados"}; mercado España.`;
  track("duel_completed", first);
}

function init() {
  for (const category of new Set(CATALOG.map((product) => product.category))) $("category").add(new Option(categoryNames[category] || category, category));
  for (const product of CATALOG) { $("duel-a").add(new Option(`${product.es} · ${product.serving}`, product.id)); $("duel-b").add(new Option(`${product.es} · ${product.serving}`, product.id)); }
  $("duel-b").selectedIndex = 1;
  $("search").addEventListener("input", () => { markStarted(); renderProducts(); });
  $("category").addEventListener("change", renderProducts);
  $("add-cart").addEventListener("click", addToBasket);
  $("calculate").addEventListener("click", () => calculateResult());
  $("share").addEventListener("click", shareChallenge);
  $("copy").addEventListener("click", copyChallenge);
  $("download-feed").addEventListener("click", () => downloadSocialCard({ title: resultData.title, serving: resultData.servings, result: resultData.minutes }, "feed"));
  $("download-story").addEventListener("click", () => downloadSocialCard({ title: resultData.title, serving: resultData.servings, result: resultData.minutes }, "story"));
  $("again").addEventListener("click", () => { $("search").focus(); scrollTo({ top: 0, behavior: "smooth" }); });
  $("run-duel").addEventListener("click", runDuel);
  $("source-link").addEventListener("click", () => track("source_opened", resultData?.products[0]));
  $("correction-link").addEventListener("click", () => track("correction_requested", resultData?.products[0]));
  initConsent();
  renderProducts();
  const shared = parseShare(location.search, CATALOG);
  if (shared) {
    challengeOpened = shared.challenge;
    basket = shared.items;
    renderBasket();
    selected = CATALOG.find((product) => product.id === basket[0].id);
    selectProduct(selected);
    calculateResult({ focus: false, fromChallenge: shared.challenge });
    if (shared.challenge) track("challenge_opened", selected);
  }
}

init();
