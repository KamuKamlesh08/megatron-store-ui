import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Paper,
  Chip,
} from "@mui/material";

import {
  Cart,
  PRODUCTS,
  Product,
  getCurrentCity,
  getProductBySku,
  getInventoryStockBySku,
} from "../../../data/dummyData";

import Header from "../common/Header";
import "./CheckoutPage.css";

type CartItem = {
  productId: string;
  sku: string;
  quantity: number;
  priceSnapshot: number;
};

type PaymentMethod = "upi" | "card" | "cod";

function readCart(): Cart | null {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(readCart());
  const city = getCurrentCity();

  // Address state
  const [addr, setAddr] = useState({
    name: "",
    phone: "",
    line1: "",
    pincode: "",
  });

  // Payment state
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const overlayCopy = useMemo(() => {
    switch (method) {
      case "cod":
        return {
          title: "Confirming your order…",
          sub: "Reserving stock and preparing COD confirmation. Please don’t refresh.",
        };
      case "upi":
        return {
          title: "Finalizing your order…",
          sub: "Awaiting UPI authorization and reserving stock. Please don’t refresh.",
        };
      case "card":
        return {
          title: "Finalizing your order…",
          sub: "Processing card securely and reserving stock. Please don’t refresh.",
        };
      default:
        return {
          title: "Finalizing your order…",
          sub: "Reserving stock and preparing confirmation. Please don’t refresh.",
        };
    }
  }, [method]);

  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener("storage", sync);
    window.addEventListener("cart:updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:updated", sync as EventListener);
    };
  }, []);

  // Build lines, check stock, compute totals
  const { lines, ok, msg, subtotal, shippingFee, codFee, total } =
    useMemo(() => {
      const empty = {
        lines: [] as { item: CartItem; product: Product; stock: number }[],
        ok: false,
        msg: "Cart is empty",
        subtotal: 0,
        shippingFee: 0,
        codFee: 0,
        total: 0,
      };
      if (!cart?.items?.length) return empty;

      const lines: { item: CartItem; product: Product; stock: number }[] = [];
      let sum = 0;

      for (const it of cart.items as CartItem[]) {
        const p =
          getProductBySku(it.sku) ||
          PRODUCTS.find((pp) => pp.id === it.productId);
        if (!p)
          return { ...empty, msg: "Some products are no longer available" };

        const stock = getInventoryStockBySku(p.sku, city);
        if (stock < it.quantity) {
          return {
            ...empty,
            msg: `Insufficient stock for ${p.name} in ${city}`,
          };
        }

        const lineTotal = (it.quantity ?? 0) * (it.priceSnapshot ?? p.price);
        lines.push({ item: it, product: p, stock });
        sum += lineTotal;
      }

      // Simple shipping logic (demo):
      // Free shipping >= ₹999, otherwise ₹49. COD adds ₹30.
      const shippingFee = sum >= 999 ? 0 : 49;
      const codFee = 0; // will be applied dynamically below in total computation

      return {
        lines,
        ok: true,
        msg: "",
        subtotal: sum,
        shippingFee,
        codFee,
        total: sum + shippingFee, // + codFee if COD selected (added at render time)
      };
    }, [cart, city]);

  // Field validations (lightweight)
  const validPhone = (p: string) => /^[0-9]{10}$/.test(p.trim());
  const validPincode = (p: string) => /^[1-9][0-9]{5}$/.test(p.trim());
  const validUpi = (u: string) => /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(u.trim());
  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  const validateCard = () => {
    const num = onlyDigits(cardNumber);
    const exp = cardExpiry.trim();
    const cvv = cardCvv.trim();
    const name = cardName.trim().length >= 2;

    const numOk = num.length >= 13 && num.length <= 19; // lenient
    const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
    const cvvOk = /^[0-9]{3,4}$/.test(cvv);

    return name && numOk && expOk && cvvOk;
  };

  const computedTotal = method === "cod" ? total + 30 : total;

  const placeOrder = async () => {
    setError(null);

    // ✅ validations (unchanged)
    if (!ok) {
      setError(msg || "Please resolve cart issues before placing order.");
      return;
    }
    if (
      !addr.name ||
      !validPhone(addr.phone) ||
      !addr.line1 ||
      !validPincode(addr.pincode)
    ) {
      setError(
        "Please fill a valid shipping address (name, 10-digit phone, address, 6-digit pincode)."
      );
      return;
    }
    if (method === "upi" && !validUpi(upiId)) {
      setError("Enter a valid UPI ID (e.g., ravi@okicici).");
      return;
    }
    if (method === "card" && !validateCard()) {
      setError("Please enter valid card details.");
      return;
    }
    if (method === "cod" && computedTotal > 10000) {
      setError("Cash on Delivery is not available for orders above ₹10,000.");
      return;
    }

    // 🔵 show overlay
    setPlacing(true);

    // 🧾 save snapshot for success page
    const savedOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      city,
      paymentMethod: method,
      address: addr,
      items: cart!.items.map((it) => ({
        productId: it.productId,
        sku: it.sku,
        quantity: it.quantity,
        price: it.priceSnapshot,
      })),
      amounts: {
        subtotal,
        shipping: shippingFee,
        codFee: method === "cod" ? 30 : 0,
        total: computedTotal,
      },
    };
    sessionStorage.setItem("order:latest", JSON.stringify(savedOrder));
    localStorage.setItem("order:latest", JSON.stringify(savedOrder));

    // ⏳ wait 5s, THEN clear cart + redirect
    setTimeout(() => {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart:updated"));
      // don't setPlacing(false); we are navigating away
      window.location.href = "/order/success";
    }, 5000);
  };

  if (!cart?.items?.length) {
    return (
      <Box
        className="checkout-page"
        p={{ xs: 2, md: 3 }}
        maxWidth="900px"
        mx="auto"
      >
        <Header city={city} onOpenLocation={() => {}} />
        <Typography variant="h6" mt={2}>
          Your cart is empty
        </Typography>
        <Button sx={{ mt: 1 }} href="/" variant="contained">
          Go shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="checkout-page"
      p={{ xs: 2, md: 3 }}
      maxWidth="1000px"
      mx="auto"
    >
      <Header city={city} onOpenLocation={() => {}} />

      <Typography variant="h5" fontWeight={800}>
        Checkout
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Delivering to {city}
      </Typography>

      {error && (
        <Alert sx={{ mt: 1 }} severity="error">
          {error}
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="flex-start"
      >
        {/* Left: Address + Payment */}
        <Stack flex={1} spacing={2} minWidth={0}>
          {/* Address */}
          <Paper className="panel" elevation={0}>
            <Typography
              className="panel-title"
              variant="subtitle1"
              fontWeight={700}
            >
              Shipping Address
            </Typography>
            <Stack className="panel-body" spacing={1.2}>
              <TextField
                size="small"
                label="Full Name"
                value={addr.name}
                onChange={(e) =>
                  setAddr((a) => ({ ...a, name: e.target.value }))
                }
              />
              <TextField
                size="small"
                label="Phone (10 digits)"
                inputMode="numeric"
                value={addr.phone}
                onChange={(e) =>
                  setAddr((a) => ({ ...a, phone: e.target.value }))
                }
                error={!!addr.phone && !validPhone(addr.phone)}
                helperText={
                  !!addr.phone && !validPhone(addr.phone)
                    ? "Invalid phone"
                    : " "
                }
              />
              <TextField
                size="small"
                label="Address Line"
                value={addr.line1}
                onChange={(e) =>
                  setAddr((a) => ({ ...a, line1: e.target.value }))
                }
              />
              <TextField
                size="small"
                label="Pincode"
                inputMode="numeric"
                value={addr.pincode}
                onChange={(e) =>
                  setAddr((a) => ({ ...a, pincode: e.target.value }))
                }
                error={!!addr.pincode && !validPincode(addr.pincode)}
                helperText={
                  !!addr.pincode && !validPincode(addr.pincode)
                    ? "Invalid pincode"
                    : " "
                }
              />
            </Stack>
          </Paper>

          {/* Payment */}
          <Paper className="panel" elevation={0}>
            <Typography
              className="panel-title"
              variant="subtitle1"
              fontWeight={700}
            >
              Payment Method
            </Typography>

            <RadioGroup
              row
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="pm-group"
            >
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Credit/Debit Card"
              />
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>

            {/* Method-specific fields */}
            {method === "upi" && (
              <Stack className="panel-body" spacing={1.2}>
                <TextField
                  size="small"
                  label="UPI ID"
                  placeholder="yourname@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  error={!!upiId && !validUpi(upiId)}
                  helperText={
                    !!upiId && !validUpi(upiId) ? "Invalid UPI ID" : " "
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  You’ll be prompted in your UPI app to approve the payment.
                </Typography>
              </Stack>
            )}

            {method === "card" && (
              <Stack className="panel-body" spacing={1.2}>
                <TextField
                  size="small"
                  label="Name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                <TextField
                  size="small"
                  label="Card number"
                  inputMode="numeric"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    label="MM/YY"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="CVV"
                    inputMode="numeric"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Your card will be securely processed.
                </Typography>
              </Stack>
            )}

            {method === "cod" && (
              <Stack className="panel-body" spacing={1}>
                <Alert severity="info" variant="outlined">
                  COD charge ₹30 applies. Not available above ₹10,000.
                </Alert>
              </Stack>
            )}
          </Paper>
        </Stack>

        {/* Right: Summary */}
        <Paper className="panel summary" elevation={0}>
          <Typography
            className="panel-title"
            variant="subtitle1"
            fontWeight={700}
          >
            Order Summary
          </Typography>

          <Stack className="panel-body" spacing={1}>
            {cart.items.map((it: CartItem) => {
              const p =
                getProductBySku(it.sku) ||
                PRODUCTS.find((pp) => pp.id === it.productId)!;
              return (
                <Stack
                  key={p.sku}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                    minWidth={0}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap fontWeight={600}>
                        {p.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {p.sku}
                      </Typography>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`Qty: ${it.quantity}`}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Stack>
                  <Typography fontWeight={700}>
                    ₹
                    {(
                      it.quantity * (it.priceSnapshot ?? p.price)
                    ).toLocaleString("en-IN")}
                  </Typography>
                </Stack>
              );
            })}

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Items Subtotal</Typography>
              <Typography>₹{subtotal.toLocaleString("en-IN")}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Shipping</Typography>
              <Typography>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </Typography>
            </Stack>
            {method === "cod" && (
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">COD charges</Typography>
                <Typography>₹30</Typography>
              </Stack>
            )}

            <Divider sx={{ my: 1 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={800}>Payable Total</Typography>
              <Typography fontWeight={900} fontSize="1.15rem">
                ₹{computedTotal.toLocaleString("en-IN")}
              </Typography>
            </Stack>

            <Button
              className="place-order-btn"
              variant="contained"
              size="large"
              onClick={placeOrder}
              disabled={!ok || placing}
              sx={{ mt: 1 }}
            >
              {placing
                ? "Placing..."
                : method === "cod"
                ? "Place Order (COD)"
                : "Pay & Place Order"}
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {placing && (
        <div className="loading-overlay" role="alert" aria-live="polite">
          <div className="loading-box">
            <div className="loading-spinner" />
            <p className="loading-title">{overlayCopy.title}</p>
            <p className="loading-sub">{overlayCopy.sub}</p>
          </div>
        </div>
      )}
    </Box>
  );
}
