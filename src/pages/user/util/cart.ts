import { Cart } from "../../../data/dummyData";

export const CART_KEY = "cart";

export function emitCartUpdated() {
  window.dispatchEvent(new Event("cart:updated"));
}

export function readCart(): Cart | null {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCart(cart: Cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  emitCartUpdated(); // ✅ always notify header
}

export function getCartCount(): number {
  const c = readCart();
  return c?.items?.reduce((s, i) => s + (i.quantity ?? 0), 0) ?? 0;
}
