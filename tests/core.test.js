import test from "node:test";
import assert from "node:assert/strict";
import { MAX_CART_ITEMS, calories, basketCalories, minutes, range, shareParams, parseShare } from "../assets/js/product-core.js";

const catalog = [
  { id: "x", kcal: 100, kcalMin: 80, kcalMax: 120 },
  { id: "official", kcal: 213 },
];

test("calcula cantidades y propaga rangos", () => {
  assert.deepEqual(calories(catalog[0], 2), { mid: 200, min: 160, max: 240 });
  assert.deepEqual(calories(catalog[1], 1.5), { mid: 319.5, min: 319.5, max: 319.5 });
});

test("suma una cesta sin perder los extremos", () => {
  assert.deepEqual(basketCalories([{ id: "x", quantity: 2 }, { id: "official", quantity: 1 }], catalog), { mid: 413, min: 373, max: 453 });
});

test("rechaza cantidades, cestas y productos inválidos", () => {
  for (const quantity of [0, -1, 20.01, NaN, Infinity]) assert.throws(() => calories(catalog[0], quantity));
  assert.throws(() => basketCalories([], catalog));
  assert.throws(() => basketCalories([{ id: "missing", quantity: 1 }], catalog));
  assert.throws(() => basketCalories(Array.from({ length: MAX_CART_ITEMS + 1 }, () => ({ id: "x", quantity: 1 })), catalog));
});

test("aplica la fórmula MET y límites de peso", () => {
  assert.equal(minutes(322.875, 4.1, 75), 60);
  assert.equal(minutes(100, 4, 35), 41);
  assert.equal(minutes(100, 4, 200), 7);
  for (const args of [[-1, 4, 75], [100, 0, 75], [100, 4, 34], [100, 4, 201], [NaN, 4, 75]]) assert.throws(() => minutes(...args));
});

test("mantiene orden en los rangos de actividad", () => {
  const result = range(calories(catalog[0]), { met: 4 }, 75);
  assert.ok(result.min <= result.mid && result.mid <= result.max);
});

test("serializa una cesta sin peso ni datos personales", () => {
  const params = new URLSearchParams(shareParams([{ id: "x", quantity: 1.25 }, { id: "official", quantity: 2 }]));
  assert.deepEqual([...params.keys()].sort(), ["from", "items"]);
  assert.equal(params.get("items"), "x:1.25,official:2");
});

test("reconstruye retos nuevos y enlaces antiguos", () => {
  assert.deepEqual(parseShare("?items=x%3A.25%2Cofficial%3A2&from=challenge", catalog), { items: [{ id: "x", quantity: 0.25 }, { id: "official", quantity: 2 }], challenge: true });
  assert.deepEqual(parseShare("?p=x&q=.25", catalog), { items: [{ id: "x", quantity: 0.25 }], challenge: false });
});

test("rechaza manipulación y límites excesivos en URL", () => {
  for (const query of ["?items=missing:1", "?items=x:20.01", "?items=%3Cscript%3E:1", "?items=%25:1", "?p=x&q=Infinity", "?p=x&q="]) assert.equal(parseShare(query, catalog), null);
  for (const items of [[{ id: "../secret", quantity: 1 }], [{ id: "x", quantity: Infinity }], [{ id: "x", quantity: 21 }]]) {
    assert.throws(() => shareParams(items));
  }
  const tooMany = Array.from({ length: MAX_CART_ITEMS + 1 }, () => "x:1").join(",");
  assert.equal(parseShare(`?items=${encodeURIComponent(tooMany)}`, catalog), null);
});
