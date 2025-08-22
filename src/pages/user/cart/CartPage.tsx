import { useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { PRODUCTS, Product } from "../../../data/dummyData"; // adjust path
import ScrollableProducts from "../ScrollableProducts"; // adjust path
import "./CartPage.css";
import Header from "../common/Header";

type CartItem = { productId: string; quantity: number; priceSnapshot: number };
type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  status: "active" | "completed";
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

  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener("cart:updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:updated", sync as EventListener);
    };
  }, []);

  const { itemsCount, subtotal, products } = useMemo(() => {
    const empty = { itemsCount: 0, subtotal: 0, products: [] as Product[] };
    if (!cart?.items?.length) return empty;

    const prods: Product[] = [];
    let count = 0;
    let sum = 0;

    for (const it of cart.items) {
      const p = PRODUCTS.find((pp) => pp.id === it.productId);
      if (!p) continue;
      prods.push(p);
      count += it.quantity ?? 0;
      sum += (it.quantity ?? 0) * (it.priceSnapshot ?? p.price);
    }
    return { itemsCount: count, subtotal: sum, products: prods };
  }, [cart]);

  const clearCart = () => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart:updated"));
    setCart(readCart());
  };

  if (!itemsCount) {
    return (
      <Box
        className="cart-page"
        p={{ xs: 2, md: 3 }}
        maxWidth="1100px"
        mx="auto"
      >
        <Typography variant="h6" className="empty-title">
          Your cart is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Add some products to see them here.
        </Typography>
        <Button href="/" variant="contained" className="browse-btn">
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box className="cart-page" p={{ xs: 2, md: 3 }} maxWidth="1100px" mx="auto">
      <Header city={"Delhi"} onOpenLocation={() => console.log("test loc")} />

      <Typography variant="h5" fontWeight={800}>
        Your Cart
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {itemsCount} item{itemsCount > 1 ? "s" : ""} • Subtotal:{" "}
        <b>₹{subtotal.toLocaleString("en-IN")}</b>
      </Typography>

      <Stack direction="row" spacing={1} mb={2}>
        <Button variant="outlined" onClick={clearCart}>
          Clear cart
        </Button>
        <Button
          variant="contained"
          onClick={() => (window.location.href = "/checkout")}
        >
          Proceed to Checkout
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Reuse your horizontal scroller */}
      <ScrollableProducts products={products} />
    </Box>
  );
}
