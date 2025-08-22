import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";

import Header from "../common/Header";
import ScrollableProducts from "../ScrollableProducts"; // 👉 adjust path if needed
import { PRODUCTS, USER, Product } from "../../../data/dummyData"; // 👉 adjust path if needed

import "./CheckoutPage.css";

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

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(readCart());
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  // Address form
  const [name, setName] = useState(USER.name || "");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState(USER.city || "Delhi");
  const [pincode, setPincode] = useState("");
  const [payment, setPayment] = useState<"cod" | "upi" | "card">("cod");

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

  const shipping = subtotal >= 999 ? 0 : 49;
  const savings = 0;
  const total = subtotal + shipping;

  const eta = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (3 + Math.floor(Math.random() * 3)));
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }, []);

  const validate = () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !line1.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      setSnack({
        open: true,
        msg: "Please complete the address details.",
        type: "error",
      });
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setSnack({
        open: true,
        msg: "Enter a valid 6-digit pincode.",
        type: "error",
      });
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setSnack({
        open: true,
        msg: "Enter a valid 10-digit phone number.",
        type: "error",
      });
      return false;
    }
    if (!itemsCount) {
      setSnack({ open: true, msg: "Your cart is empty.", type: "error" });
      return false;
    }
    return true;
  };

  const placeOrder = () => {
    if (!validate()) return;
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart:updated"));
    setSnack({
      open: true,
      msg: "Order placed successfully! 🎉",
      type: "success",
    });
    setTimeout(() => navigate("/"), 900);
  };

  if (!itemsCount) {
    return (
      <Box
        className="checkout-page"
        p={{ xs: 2, md: 3 }}
        maxWidth="1120px"
        mx="auto"
      >
        <Header city={city} onOpenLocation={() => {}} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          No items to checkout.
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="checkout-page"
      p={{ xs: 2, md: 3 }}
      maxWidth="1120px"
      mx="auto"
    >
      <Header city={city} onOpenLocation={() => {}} />

      <Typography variant="h5" fontWeight={800} className="page-title">
        Checkout
      </Typography>

      <Grid container spacing={2.5} alignItems="flex-start">
        {/* Left Column - Forms */}
        <Grid>
          {/* Address Panel */}
          <Box className="panel">
            <Typography className="panel-title">Delivery Address</Typography>
            <Grid container spacing={1.5} className="field-grid">
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputProps={{ inputMode: "numeric", pattern: "\\d{10}" }}
                />
              </Grid>
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  label="Address Line 1"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                />
              </Grid>
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  label="Address Line 2 (optional)"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                />
              </Grid>
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid>
                <TextField
                  size="small"
                  fullWidth
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  inputProps={{ inputMode: "numeric", pattern: "\\d{6}" }}
                />
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Estimated delivery to <b>{city}</b> by <b>{eta}</b>.
            </Typography>
          </Box>

          {/* Payment Panel */}
          <Box className="panel">
            <Typography className="panel-title">Payment Method</Typography>
            <RadioGroup
              row
              value={payment}
              onChange={(e) => setPayment(e.target.value as any)}
              className="radio-group"
            >
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
              <FormControlLabel
                value="upi"
                control={<Radio />}
                label="UPI / Wallet"
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Credit / Debit Card"
              />
            </RadioGroup>

            {payment === "upi" && (
              <TextField
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                label="UPI ID (e.g. name@upi)"
              />
            )}
            {payment === "card" && (
              <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                <Grid>
                  <TextField
                    size="small"
                    fullWidth
                    label="Card Number"
                    placeholder="4111 1111 1111 1111"
                  />
                </Grid>
                <Grid>
                  <TextField size="small" fullWidth label="Expiry (MM/YY)" />
                </Grid>
                <Grid>
                  <TextField size="small" fullWidth label="CVV" />
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Right Column - Summary */}
        <Grid>
          <Box className="summary-card">
            <Typography className="summary-title">Order Summary</Typography>

            <Stack spacing={0.75} className="summary-rows">
              <div className="price-row">
                <span>Items ({itemsCount})</span>
                <b>{inr(subtotal)}</b>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <b>{shipping === 0 ? "FREE" : inr(shipping)}</b>
              </div>
              {savings > 0 && (
                <div className="price-row savings">
                  <span>Savings</span>
                  <b>-{inr(savings)}</b>
                </div>
              )}
              <Divider sx={{ my: 1 }} />
              <div className="total-row">
                <span>Total</span>
                <b>{inr(total)}</b>
              </div>
              <Typography variant="caption" color="text.secondary">
                Includes all taxes.
              </Typography>
            </Stack>

            <Button
              className="place-order-btn"
              variant="contained"
              size="large"
              onClick={placeOrder}
            >
              Place Order
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Recommendations */}
      <Box className="recommend-wrap">
        <Typography variant="subtitle1" fontWeight={700} mb={1}>
          You might also like
        </Typography>
        <ScrollableProducts products={products} />
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={1600}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
