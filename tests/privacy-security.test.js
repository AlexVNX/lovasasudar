import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');
const [productApp, hubs, validator, server, productionHeaders, cookiePage, cookieScript] = await Promise.all([
  read('assets/js/product-app.js'),
  read('assets/js/hubs.js'),
  read('scripts/validate.mjs'),
  read('scripts/serve.mjs'),
  read('_headers'),
  read('cookies/index.html'),
  read('assets/js/cookie-preferences.js')
]);

test('GA4 page locations omit challenge and campaign query parameters', () => {
  assert.match(productApp, /page_location:\s*`\$\{location\.origin\}\$\{location\.pathname\}`/);
  assert.match(hubs, /page_location:\s*`\$\{location\.origin\}\$\{location\.pathname\}`/);
});

test('consent reads survive blocked Storage and ignore legacy values', () => {
  for (const source of [productApp, hubs]) {
    assert.match(source, /function readConsent\(\)/);
    assert.match(source, /value === ['"]accept['"] \|\| value === ['"]reject['"] \? value : null/);
    assert.match(source, /catch \{ return null; \}/);
  }
  assert.match(productApp, /function saveConsent\(value\)/);
  assert.match(productApp, /catch \{ \/\* La sesion sigue funcionando sin persistencia\. \*\/ \}/);
});

test('consent revocation propagates and removes GA cookies across domains', () => {
  assert.match(productApp, /window\.addEventListener\("storage"/);
  assert.match(hubs, /window\.addEventListener\('storage'/);
  for (const source of [productApp, hubs, cookieScript]) {
    assert.match(source, /lovasasudar\.com/);
    assert.match(source, /Max-Age=0/);
    assert.match(source, /analytics_storage:\s*['"]denied['"]/);
  }
  assert.match(cookieScript, /'\.lovasasudar\.com'/);
});

test('cookie preferences report blocked Storage and use the hardened module', () => {
  assert.match(cookiePage, /src="\/assets\/js\/cookie-preferences\.js"/);
  assert.doesNotMatch(cookiePage, /localStorage\.setItem/);
  assert.match(cookieScript, /function saveConsent/);
  assert.match(cookieScript, /almacenamiento local está bloqueado/);
});

test('hub calculators reject out-of-range servings and localized weights', () => {
  assert.match(hubs, /units > 20/);
  assert.match(hubs, /const maxWeight = isEnglish \? 440 : 200/);
  assert.match(hubs, /weight < minWeight \|\| weight > maxWeight/);
  assert.match(hubs, /trackHub\('hub_calculate'/);
});

test('all-estimate baskets are not labeled as mixed-source data', () => {
  assert.match(productApp, /officialCount > 0 \? "DATOS OFICIALES \+ ESTIMACIONES" : "ESTIMACIONES"/);
});

test('external source URLs receive unsafe-character validation', () => {
  const start = validator.indexOf('function validateSourceUrl');
  const end = validator.indexOf('function validateCatalog', start);
  const body = validator.slice(start, end);
  assert.ok(body.indexOf('sourceUrl contiene caracteres inseguros') < body.indexOf("if (value.startsWith('/'))"));
});

test('local HTTP QA does not upgrade requests to HTTPS', () => {
  const cspLine = server.split('\n').find(line => line.includes("'Content-Security-Policy'"));
  assert.doesNotMatch(cspLine, /upgrade-insecure-requests/);
  assert.match(productionHeaders, /upgrade-insecure-requests/);
});
