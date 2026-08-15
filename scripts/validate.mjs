import{readFile,readdir}from'node:fs/promises';import{CATALOG}from'../assets/js/catalog.js';let ids=new Set;for(let p of CATALOG){for(let k of['id','es','serving','status','source','sourceUrl','market','checked','kcal'])if(p[k]===undefined)throw Error(`${p.id||'?'}: falta ${k}`);if(ids.has(p.id))throw Error(`id duplicado ${p.id}`);ids.add(p.id);if(p.kcalMin&&!(p.kcalMin<=p.kcal&&p.kcal<=p.kcalMax))throw Error(`rango inválido ${p.id}`)}let html=await readFile('index.html','utf8');for(let path of['/privacidad/','/cookies/','/aviso-legal/','/contacto/','/metodologia-fuentes/'])if(!html.includes(path))throw Error(`enlace legal ausente ${path}`);console.log(`OK: ${CATALOG.length} productos trazables, IDs únicos y enlaces legales presentes.`)

const { US_CATALOG } = await import('../assets/js/catalog-us.js');
const SITE_ORIGIN = 'https://lovasasudar.com';
const REQUIRED_PRODUCT_FIELDS = ['id', 'group', 'category', 'es', 'en', 'serving', 'status', 'source', 'sourceUrl', 'market', 'checked', 'kcal'];
const readUtf8 = path => readFile(path, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function validateSourceUrl(value, id) {
  assert(typeof value === 'string' && value.length > 0, `${id}: sourceUrl vacio`);
  assert(!/["'<>\u0000-\u001f]/.test(value), `${id}: sourceUrl contiene caracteres inseguros`);
  if (value.startsWith('/')) {
    assert(!value.startsWith('//') && !value.includes('\\'), `${id}: ruta de fuente insegura`);
    return;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${id}: sourceUrl no es una URL valida`);
  }
  assert(url.protocol === 'https:', `${id}: la fuente externa debe usar HTTPS`);
  assert(!url.username && !url.password, `${id}: sourceUrl no puede incluir credenciales`);
}

function validateCatalog(catalog, label, allIds) {
  assert(Array.isArray(catalog) && catalog.length > 0, `${label}: catalogo vacio`);
  for (const product of catalog) {
    const productLabel = product?.id || `${label}: producto sin id`;
    for (const field of REQUIRED_PRODUCT_FIELDS) {
      assert(product[field] !== undefined && product[field] !== '', `${productLabel}: falta ${field}`);
    }

    assert(/^[a-z0-9_]+$/.test(product.id), `${product.id}: id inseguro`);
    assert(!allIds.has(product.id), `${product.id}: id duplicado entre catalogos`);
    allIds.add(product.id);
    for (const field of ['es', 'en', 'serving', 'source', 'market']) {
      assert(typeof product[field] === 'string', `${product.id}: ${field} debe ser texto`);
      assert(!/[<>\u0000-\u001f]/.test(product[field]), `${product.id}: ${field} contiene caracteres inseguros`);
    }

    assert(['food', 'drink'].includes(product.group), `${product.id}: group no permitido`);
    assert(/^[a-z0-9_]+$/.test(product.category), `${product.id}: category insegura`);
    assert(['estimate', 'official'].includes(product.status), `${product.id}: status no permitido`);
    assert(Number.isFinite(product.kcal) && product.kcal > 0 && product.kcal <= 10000, `${product.id}: kcal invalidas`);

    const hasMin = product.kcalMin !== undefined;
    const hasMax = product.kcalMax !== undefined;
    assert(hasMin === hasMax, `${product.id}: el rango debe incluir minimo y maximo`);
    if (hasMin) {
      assert(Number.isFinite(product.kcalMin) && Number.isFinite(product.kcalMax)
        && product.kcalMin > 0 && product.kcalMin <= product.kcal && product.kcal <= product.kcalMax,
      `${product.id}: rango calorico invalido`);
    }

    assert(/^\d{4}-\d{2}-\d{2}$/.test(product.checked), `${product.id}: fecha de revision invalida`);
    const checked = new Date(`${product.checked}T00:00:00Z`);
    assert(!Number.isNaN(checked.valueOf()) && checked.toISOString().slice(0, 10) === product.checked, `${product.id}: fecha imposible`);
    assert(checked <= new Date(), `${product.id}: la revision no puede estar en el futuro`);
    validateSourceUrl(product.sourceUrl, product.id);
  }
}

function canonicalFrom(html) {
  return html.match(/<link(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
}

function urlToFile(url) {
  const pathname = decodeURIComponent(url.pathname);
  assert(!pathname.includes('\\') && !pathname.includes('..'), `${url.href}: ruta insegura en sitemap`);
  return pathname === '/' ? 'index.html' : `.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`;
}

async function validateLocalLinks(page, sourceFile) {
  for (const match of page.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (href.startsWith('#')) continue;
    let targetUrl;
    try {
      targetUrl = new URL(href, SITE_ORIGIN);
    } catch {
      throw new Error(`${sourceFile}: href invalido (${href})`);
    }
    if (targetUrl.origin !== SITE_ORIGIN) continue;
    const targetFile = urlToFile(targetUrl);
    try {
      await readFile(targetFile);
    } catch {
      throw new Error(`${sourceFile}: enlace interno roto (${href})`);
    }
  }
}

async function validateSitemap() {
  const sitemap = await readUtf8('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
  assert(urls.length > 0, 'sitemap.xml no contiene URLs');
  const seen = new Set();

  for (const url of urls) {
    assert(url.origin === SITE_ORIGIN, `${url.href}: origen inesperado en sitemap`);
    assert(!url.search && !url.hash, `${url.href}: sitemap no debe contener parametros ni fragmentos`);
    assert(!seen.has(url.href), `${url.href}: URL duplicada en sitemap`);
    seen.add(url.href);

    const file = urlToFile(url);
    let page;
    try {
      page = await readUtf8(file);
    } catch {
      throw new Error(`${file}: URL del sitemap no existe`);
    }
    assert(canonicalFrom(page) === url.href, `${file}: canonical no coincide con sitemap`);
    assert(/<html\b[^>]*\blang=["'][^"']+["']/i.test(page), `${file}: falta lang`);
    assert(/<meta\b[^>]*\bname=["']viewport["']/i.test(page), `${file}: falta viewport`);
    assert(/<meta\b[^>]*\bname=["']description["']/i.test(page), `${file}: falta meta description`);
    assert(/<title>[^<]+<\/title>/i.test(page), `${file}: falta title`);
    assert((page.match(/<h1\b/gi) || []).length === 1, `${file}: debe haber exactamente un h1`);
    assert(!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(page), `${file}: URL indexable marcada noindex`);
    assert(!/assets\/js\/(?:analytics|app|config|ranking)\.js/i.test(page), `${file}: carga un modulo heredado desactivado`);
    for (const script of page.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(script[1]);
      } catch {
        throw new Error(`${file}: JSON-LD invalido`);
      }
    }
    await validateLocalLinks(page, file);
  }
  return urls.length;
}

const allIds = new Set();
validateCatalog(CATALOG, 'ES', allIds);
validateCatalog(US_CATALOG, 'US', allIds);

const robots = await readUtf8('robots.txt');
assert(/User-agent:\s*\*/i.test(robots), 'robots.txt: falta regla general');
assert(/Sitemap:\s*https:\/\/lovasasudar\.com\/sitemap\.xml/i.test(robots), 'robots.txt: sitemap ausente');

const headers = await readUtf8('_headers');
for (const header of ['Content-Security-Policy', 'Permissions-Policy', 'Referrer-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options']) {
  assert(headers.includes(header), `_headers: falta ${header}`);
}

const hubs = await readUtf8('assets/js/hubs.js');
assert(hubs.includes('function readConsent()'), 'hubs.js: Storage no esta protegido');
assert(hubs.includes("window.addEventListener('storage'"), 'hubs.js: no reacciona a cambios de consentimiento');
assert(hubs.includes('page_location:`${location.origin}${location.pathname}`'), 'hubs.js: page_location puede filtrar parametros');
assert(hubs.includes('units > 20') && hubs.includes('maxWeight = isEnglish ? 440 : 200'), 'hubs.js: faltan limites de entrada');
assert(!/hub_calculate[^\n]+\bkcal\b/.test(hubs), 'hubs.js: el evento no debe enviar calorias calculadas');

const productApp = await readUtf8('assets/js/product-app.js');
assert(productApp.includes('function readConsent()'), 'product-app.js: Storage no esta protegido');
assert(productApp.includes('window.addEventListener("storage"'), 'product-app.js: no reacciona a cambios de consentimiento');
assert(productApp.includes('page_location: `${location.origin}${location.pathname}`'), 'product-app.js: page_location puede filtrar parametros');
assert(productApp.includes(': officialCount > 0 ? "DATOS OFICIALES + ESTIMACIONES" : "ESTIMACIONES"'), 'product-app.js: etiqueta de estimaciones incorrecta');

const cookiePreferences = await readUtf8('cookies/index.html');
const cookiePreferenceScript = await readUtf8('assets/js/cookie-preferences.js');
assert(cookiePreferences.includes('/assets/js/cookie-preferences.js'), 'cookies: no carga el controlador de preferencias');
assert(cookiePreferenceScript.includes('function saveConsent') && cookiePreferenceScript.includes("'.lovasasudar.com'"), 'cookies: faltan Storage robusto o borrado de dominio');
assert(cookiePreferenceScript.includes('almacenamiento local está bloqueado'), 'cookies: falta el aviso de Storage bloqueado');

const sitemapCount = await validateSitemap();
console.log(`OK ampliado: ${CATALOG.length + US_CATALOG.length} productos, ${sitemapCount} URLs, privacidad, SEO y cabeceras.`);
