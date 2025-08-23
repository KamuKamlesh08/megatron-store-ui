// utils to persist orders in localStorage
export type SavedOrder = {
  id: string;
  date: string; // ISO
  city: string;
  paymentMethod: "upi" | "card" | "cod";
  address: { name: string; phone: string; line1: string; pincode: string };
  items: { productId: string; sku?: string; quantity: number; price: number }[];
  amounts: {
    subtotal: number;
    shipping: number;
    codFee: number;
    total: number;
  };
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
};

const KEY_ALL = "orders:all";

export function readAllOrders(): SavedOrder[] {
  try {
    const raw = localStorage.getItem(KEY_ALL);
    return raw ? (JSON.parse(raw) as SavedOrder[]) : [];
  } catch {
    return [];
  }
}

export function appendOrder(order: SavedOrder) {
  const all = readAllOrders();
  // newest first:
  all.unshift({ status: "confirmed", ...order });
  localStorage.setItem(KEY_ALL, JSON.stringify(all));
  window.dispatchEvent(new Event("orders:updated"));
}

export function getOrderById(id: string): SavedOrder | null {
  const all = readAllOrders();
  return all.find((o) => o.id === id) || null;
}
