// Lightweight wishlist util using localStorage
// key: "wishlist" -> { items: string[] }  // items = productId list

export function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem("wishlist");
    if (!raw) return [];
    const obj = JSON.parse(raw) as { items?: string[] };
    return Array.isArray(obj.items) ? obj.items : [];
  } catch {
    return [];
  }
}

// NEW: simple reader that returns string[]
export function readWishlistIds(): string[] {
  try {
    const raw = localStorage.getItem("wishlist");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export function writeWishlist(ids: string[]) {
  localStorage.setItem("wishlist", JSON.stringify({ items: ids }));
  // let the rest of the app react (header badges etc)
  window.dispatchEvent(new Event("wishlist:updated"));
}

export function isInWishlist(productId: string): boolean {
  const ids = readWishlist();
  console.log("Wishlist IDs:", ids);
  return ids.includes(productId);
}

export function toggleWishlist(productId: string): boolean {
  const ids = readWishlist();
  const idx = ids.indexOf(productId);
  if (idx >= 0) {
    ids.splice(idx, 1);
    writeWishlist(ids);
    return false; // removed
  } else {
    ids.push(productId);
    writeWishlist(ids);
    return true; // added
  }
}

export function getWishlistCount(): number {
  return readWishlist().length;
}
