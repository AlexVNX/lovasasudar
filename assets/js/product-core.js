export const REFERENCE_WEIGHT = 75;
export const MAX_CART_ITEMS = 8;
export const ACTIVITIES = [
  { id: "walk", name: "Caminando rápido", met: 4.3 },
  { id: "dance", name: "Bailando", met: 5 },
  { id: "bike", name: "En bici tranquila", met: 6.8 },
  { id: "run", name: "Corriendo suave", met: 8.3 },
];

export function calories(product, quantity = 1) {
  if (!product || !Number.isFinite(quantity) || quantity <= 0 || quantity > 20) throw new Error("invalid product quantity");
  return { mid: product.kcal * quantity, min: (product.kcalMin ?? product.kcal) * quantity, max: (product.kcalMax ?? product.kcal) * quantity };
}

export function basketCalories(items, catalog) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_CART_ITEMS) throw new Error("invalid basket");
  return items.reduce((total, item) => {
    const value = calories(catalog.find((entry) => entry.id === item.id), item.quantity);
    return { mid: total.mid + value.mid, min: total.min + value.min, max: total.max + value.max };
  }, { mid: 0, min: 0, max: 0 });
}

export function minutes(kcal, met, weight = REFERENCE_WEIGHT) {
  if (![kcal, met, weight].every(Number.isFinite) || kcal < 0 || met <= 0 || weight < 35 || weight > 200) throw new Error("invalid MET input");
  return Math.round(kcal / ((met * 3.5 * weight) / 200));
}

export function range(calorieRange, activity, weight) {
  return { min: minutes(calorieRange.min, activity.met, weight), mid: minutes(calorieRange.mid, activity.met, weight), max: minutes(calorieRange.max, activity.met, weight) };
}

function validSharedItem(item) {
  return item && /^[a-z0-9_]+$/.test(item.id) && Number.isFinite(item.quantity) && item.quantity > 0 && item.quantity <= 20;
}

export function shareParams(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_CART_ITEMS || !items.every(validSharedItem)) throw new Error("invalid shared basket");
  const compact = items.map(({ id, quantity }) => `${encodeURIComponent(id)}:${quantity}`).join(",");
  return `?${new URLSearchParams({ items: compact, from: "challenge" })}`;
}

export function parseShare(search, catalog) {
  const params = new URLSearchParams(search);
  const compact = params.get("items");
  let items = [];
  if (compact) {
    const tokens = compact.split(",");
    if (tokens.length > MAX_CART_ITEMS) return null;
    for (const token of tokens) {
      const separator = token.lastIndexOf(":");
      if (separator <= 0) return null;
      let id;
      try { id = decodeURIComponent(token.slice(0, separator)); } catch { return null; }
      const quantity = Number(token.slice(separator + 1));
      const item = { id, quantity };
      if (!validSharedItem(item) || !catalog.some((entry) => entry.id === id)) return null;
      items.push(item);
    }
  } else {
    const item = { id: params.get("p"), quantity: Number(params.get("q")) };
    if (validSharedItem(item) && catalog.some((entry) => entry.id === item.id)) items = [item];
  }
  return items.length ? { items, challenge: params.get("from") === "challenge" } : null;
}
