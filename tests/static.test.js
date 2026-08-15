import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const app = await readFile("assets/js/product-app.js", "utf8");

test("todos los controles usados por la aplicación existen y los IDs no se duplican", () => {
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "hay IDs HTML duplicados");
  const referenced = [...app.matchAll(/\$\(["']([^"']+)["']\)/g)].map((match) => match[1]);
  for (const id of new Set(referenced)) assert.ok(ids.includes(id), `falta #${id} en index.html`);
});

test("GA4 no se precarga desde el HTML", () => {
  assert.doesNotMatch(html, /<script[^>]+googletagmanager/i);
  assert.match(app, /lvas_consent/);
  assert.match(app, /dialog\.returnValue === "accept"/);
});

test("los retos tienen canonical limpio y señal noindex", () => {
  assert.match(html, /rel="canonical" href="https:\/\/lovasasudar\.com\/"/);
  assert.match(html, /noindex,follow/);
});

test("las páginas pendientes quedan fuera del sitemap y con noindex", async () => {
  const sitemap = await readFile("sitemap.xml", "utf8");
  for (const path of ["privacidad", "cookies", "aviso-legal", "contacto"]) {
    assert.doesNotMatch(sitemap, new RegExp(`<loc>[^<]+/${path}/`));
    const page = await readFile(`${path}/index.html`, "utf8");
    assert.match(page, /name="robots" content="noindex,follow"/);
  }
});

test("robots excluye ambas generaciones de retos", async () => {
  const robots = await readFile("robots.txt", "utf8");
  assert.match(robots, /Disallow: \/\*\?items=/);
  assert.match(robots, /Disallow: \/\*\?p=/);
});
