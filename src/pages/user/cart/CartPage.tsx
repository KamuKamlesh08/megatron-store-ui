// pages/user/cart/CartPage.tsx (essentials only)

import { useMemo, useState, useEffect } from "react";
import { Box, Button, Divider, Stack, Typography, Chip } from "@mui/material";
import {
  PRODUCTS,
  Product,
  Cart,
  getCurrentCity,
  getProductBySku,
  getInventoryStockBySku,
} from "../../../data/dummyData";
import ScrollableProducts from "../ScrollableProducts";
import Header from "../common/Header";
import "./CartPage.css";

type CartItem = {
  productId: string;
  sku: string;
  quantity: number;
  priceSnapshot: number;
};

function readCart(): Cart | null {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(readCart());
  const city = getCurrentCity();

  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener("cart:updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:updated", sync as EventListener);
    };
  }, []);

  const { lines, itemsCount, subtotal, related } = useMemo(() => {
    const empty = {
      lines: [] as { item: CartItem; product: Product; stock: number }[],
      itemsCount: 0,
      subtotal: 0,
      related: [] as Product[],
    };
    if (!cart?.items?.length) return empty;

    const lines: { item: CartItem; product: Product; stock: number }[] = [];
    let count = 0,
      sum = 0;
    const relSet = new Set<string>();

    for (const it of cart.items as CartItem[]) {
      const p =
        getProductBySku(it.sku) ||
        PRODUCTS.find((pp) => pp.id === it.productId);
      if (!p) continue;
      const lineTotal = (it.quantity ?? 0) * (it.priceSnapshot ?? p.price);
      const stock = getInventoryStockBySku(p.sku, city);
      lines.push({ item: it, product: p, stock });
      count += it.quantity ?? 0;
      sum += lineTotal;
      relSet.add(p.subcategoryId);
    }

    const related = PRODUCTS.filter((pp) => relSet.has(pp.subcategoryId)).slice(
      0,
      10
    );
    return { lines, itemsCount: count, subtotal: sum, related };
  }, [cart, city]);

  const clearCart = () => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart:updated"));
    setCart(readCart());
  };

  const proceed = () => (window.location.href = "/checkout");

  if (!itemsCount) {
    return (
      <Box
        className="cart-page"
        p={{ xs: 2, md: 3 }}
        maxWidth="1100px"
        mx="auto"
      >
        <Header city={city} onOpenLocation={() => {}} />
        <Typography variant="h6" className="empty-title">
          Your cart is empty
        </Typography>
        <Button href="/" variant="contained" className="browse-btn">
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box className="cart-page" p={{ xs: 2, md: 3 }} maxWidth="1100px" mx="auto">
      <Header city={city} onOpenLocation={() => {}} />
      <Typography variant="h5" fontWeight={800}>
        Your Cart
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {itemsCount} item{itemsCount > 1 ? "s" : ""} • Subtotal:{" "}
        <b>₹{subtotal.toLocaleString("en-IN")}</b>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Lines */}
      <Stack spacing={1.5}>
        {lines.map(({ item, product, stock }) => (
          <Stack
            key={`${product.sku}`}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <img
                src={product.image}
                alt={product.name}
                width={56}
                height={56}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <div>
                <Typography fontWeight={600}>{product.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
                <Stack direction="row" spacing={1} mt={0.5}>
                  <Chip size="small" label={`Qty: ${item.quantity}`} />
                  <Chip
                    size="small"
                    color={stock > 0 ? "success" : "default"}
                    variant="outlined"
                    label={stock > 0 ? `In stock (${stock})` : "Out of stock"}
                  />
                </Stack>
              </div>
            </Stack>
            <Typography fontWeight={700}>
              ₹{(item.priceSnapshot * item.quantity).toLocaleString("en-IN")}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={1.5} mt={2}>
        <Button variant="outlined" onClick={clearCart}>
          Clear cart
        </Button>
        <Button variant="contained" onClick={proceed}>
          Proceed to Checkout
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Related */}
      {related.length > 0 && <ScrollableProducts products={related} />}
    </Box>
  );
}
