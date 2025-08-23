// pages/user/wishlist/WishlistPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, Stack, Typography, Paper } from "@mui/material";
import { PRODUCTS } from "../../../data/dummyData";
import Header from "../common/Header";
import ScrollableProducts from "../ScrollableProducts";
import "./WishlistPage.css";
import { readWishlistIds } from "../util/wishlist";

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(readWishlistIds());
    sync(); // ✅ initial load
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:updated", sync as EventListener);
    };
  }, []);

  const products = useMemo(
    () => PRODUCTS.filter((p) => ids.includes(p.id)),
    [ids]
  );

  const clear = () => {
    // keep the same shape your writer uses
    localStorage.setItem("wishlist", JSON.stringify({ items: [] })); // ✅
    window.dispatchEvent(new Event("wishlist:updated"));
    setIds([]);
  };

  return (
    <Box
      className="wishlist-page"
      p={{ xs: 2, md: 3 }}
      maxWidth="1100px"
      mx="auto"
    >
      <Header city={localStorage.getItem("city") || "Delhi"} />
      <Typography variant="h5" fontWeight={800}>
        My Wishlist
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {products.length
          ? `${products.length} saved item(s)`
          : "No items saved"}
      </Typography>

      {!products.length ? (
        <Button href="/" variant="contained">
          Browse Products
        </Button>
      ) : (
        <>
          <Paper className="wl-panel" elevation={0}>
            <ScrollableProducts products={products} />
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Button onClick={clear} variant="outlined">
            Clear Wishlist
          </Button>
        </>
      )}
    </Box>
  );
}
