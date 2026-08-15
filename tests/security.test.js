import test from "node:test";
import assert from "node:assert/strict";
import { parseShare, shareParams } from "../assets/js/product-core.js";

const catalog = [{ id: "safe_id", kcal: 100 }];

test("una secuencia URI rota no bloquea la aplicación", () => {
  assert.doesNotThrow(() => parseShare("?items=%25:1", catalog));
  assert.equal(parseShare("?items=%25:1", catalog), null);
});

test("el serializador rechaza IDs y cantidades no permitidos", () => {
  assert.throws(() => shareParams([{ id: "<script>", quantity: 1 }]));
  assert.throws(() => shareParams([{ id: "safe_id", quantity: Infinity }]));
});
