import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import Header from "../common/Header";
import {
  PRODUCTS,
  getProductBySku,
  getCurrentCity,
} from "../../../data/dummyData";
import "./OrderSuccess.css";

type SavedOrderItem = {
  productId: string;
  sku: string;
  quantity: number;
  price: number; // per-unit at time of order (snapshot)
};

type SavedOrder = {
  id: string; // e.g., "ORD-2025-0823-8381"
  date: string; // ISO
  city: string; // shipping city
  paymentMethod: "upi" | "card" | "cod";
  address: {
    name: string;
    phone: string;
    line1: string;
    pincode: string;
  };
  items: SavedOrderItem[];
  amounts: {
    subtotal: number;
    shipping: number;
    codFee: number;
    total: number;
  };
};

function loadOrder(): SavedOrder | null {
  try {
    // Prefer sessionStorage; fallback to localStorage
    const raw =
      sessionStorage.getItem("order:latest") ||
      localStorage.getItem("order:latest");
    return raw ? (JSON.parse(raw) as SavedOrder) : null;
  } catch {
    return null;
  }
}

// Fallback demo order (in case user lands directly)
function makeFallbackOrder(): SavedOrder {
  const city = getCurrentCity();
  const now = new Date();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const id = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}-${rand}`;

  // Pick 2 popular items
  const a = PRODUCTS[0];
  const b = PRODUCTS[2];

  const items: SavedOrderItem[] = [
    { productId: a.id, sku: a.sku, quantity: 1, price: a.price },
    { productId: b.id, sku: b.sku, quantity: 1, price: b.price },
  ];
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const codFee = 0;
  const total = subtotal + shipping + codFee;

  return {
    id,
    date: now.toISOString(),
    city,
    paymentMethod: "upi",
    address: {
      name: "Ravi",
      phone: "9999999999",
      line1: "Demo Street 123",
      pincode: "110001",
    },
    items,
    amounts: { subtotal, shipping, codFee, total },
  };
}

export default function OrderSuccess() {
  const [order, setOrder] = useState<SavedOrder | null>(loadOrder());

  useEffect(() => {
    if (!order) {
      const fallback = makeFallbackOrder();
      setOrder(fallback);
    }
  }, [order]);

  const dateStr = useMemo(() => {
    if (!order) return "";
    const d = new Date(order.date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [order]);

  const downloadInvoice = () => {
    if (!order) return;
    // Basic HTML invoice (printable)
    const lines = order.items
      .map((it) => {
        const p =
          getProductBySku(it.sku) ||
          PRODUCTS.find((pp) => pp.id === it.productId);
        const name = p?.name ?? it.sku;
        return `<tr>
          <td style="padding:6px 8px;border:1px solid #e5e7eb;">${name}<div style="font-size:12px;color:#6b7280;">SKU: ${
          it.sku
        }</div></td>
          <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:center;">${
            it.quantity
          }</td>
          <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">₹${it.price.toLocaleString(
            "en-IN"
          )}</td>
          <td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">₹${(
            it.price * it.quantity
          ).toLocaleString("en-IN")}</td>
        </tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Invoice ${order.id}</title>
<style>
  @media print { .no-print { display: none; } }
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;}
</style>
</head>
<body>
  <h2>Invoice</h2>
  <div><strong>Order ID:</strong> ${order.id}</div>
  <div><strong>Date:</strong> ${dateStr}</div>
  <div><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</div>
  <hr/>
  <h3>Ship To</h3>
  <div>${order.address.name}</div>
  <div>${order.address.line1}</div>
  <div>${order.city} - ${order.address.pincode}</div>
  <div>Ph: ${order.address.phone}</div>
  <hr/>
  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;margin-top:6px;">
    <thead>
      <tr>
        <th style="padding:6px 8px;border:1px solid #e5e7eb;text-align:left;">Item</th>
        <th style="padding:6px 8px;border:1px solid #e5e7eb;text-align:center;">Qty</th>
        <th style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">Price</th>
        <th style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>${lines}</tbody>
  </table>
  <hr/>
  <div style="text-align:right;margin-top:8px;">
    <div>Subtotal: <strong>₹${order.amounts.subtotal.toLocaleString(
      "en-IN"
    )}</strong></div>
    <div>Shipping: <strong>${
      order.amounts.shipping === 0 ? "FREE" : "₹" + order.amounts.shipping
    }</strong></div>
    ${
      order.paymentMethod === "cod"
        ? `<div>COD Fee: <strong>₹${order.amounts.codFee}</strong></div>`
        : ""
    }
    <div style="font-size:18px;">Total: <strong>₹${order.amounts.total.toLocaleString(
      "en-IN"
    )}</strong></div>
  </div>

  <button class="no-print" onclick="window.print()" style="margin-top:12px;padding:8px 12px;background:#111827;color:#fff;border:0;border-radius:6px;cursor:pointer;">Print</button>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  if (!order) return null;

  return (
    <Box
      className="order-success"
      p={{ xs: 2, md: 3 }}
      maxWidth="1000px"
      mx="auto"
    >
      <Header city={order.city} onOpenLocation={() => {}} />

      {/* Hero */}
      <Paper className="success-hero" elevation={0}>
        <div className="tick">✓</div>
        <div>
          <Typography variant="h5" fontWeight={800}>
            Order placed successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thank you for shopping with us. We’ve sent a confirmation to your
            email.
          </Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            <Chip label={`Order ID: ${order.id}`} />
            <Chip label={`Placed on: ${dateStr}`} />
            <Chip label={`Payment: ${order.paymentMethod.toUpperCase()}`} />
          </Stack>
        </div>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="flex-start"
      >
        {/* Left: Address & Items */}
        <Stack flex={1} spacing={2} minWidth={0}>
          <Paper className="panel" elevation={0}>
            <Typography
              className="panel-title"
              variant="subtitle1"
              fontWeight={700}
            >
              Shipping Details
            </Typography>
            <Stack className="panel-body" spacing={0.5}>
              <Typography fontWeight={600}>{order.address.name}</Typography>
              <Typography variant="body2">{order.address.line1}</Typography>
              <Typography variant="body2">
                {order.city} — {order.address.pincode}
              </Typography>
              <Typography variant="body2">📞 {order.address.phone}</Typography>
            </Stack>
          </Paper>

          <Paper className="panel" elevation={0}>
            <Typography
              className="panel-title"
              variant="subtitle1"
              fontWeight={700}
            >
              Items ({order.items.length})
            </Typography>
            <Stack className="panel-body" spacing={1.2}>
              {order.items.map((it) => {
                const p =
                  getProductBySku(it.sku) ||
                  PRODUCTS.find((pp) => pp.id === it.productId);
                const img = p?.image;
                const name = p?.name ?? it.sku;
                const line = it.quantity * it.price;

                return (
                  <Stack
                    key={`${it.sku}-${it.productId}`}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    className="item-row"
                  >
                    <Stack
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                      minWidth={0}
                    >
                      <img
                        src={img}
                        alt={name}
                        width={56}
                        height={56}
                        style={{ borderRadius: 10, objectFit: "cover" }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap fontWeight={600}>
                          {name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {it.sku}
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
                      ₹{line.toLocaleString("en-IN")}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        </Stack>

        {/* Right: Summary + CTAs */}
        <Paper className="panel summary" elevation={0}>
          <Typography
            className="panel-title"
            variant="subtitle1"
            fontWeight={700}
          >
            Order Summary
          </Typography>
          <Stack className="panel-body" spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Items Subtotal</Typography>
              <Typography>
                ₹{order.amounts.subtotal.toLocaleString("en-IN")}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Shipping</Typography>
              <Typography>
                {order.amounts.shipping === 0
                  ? "FREE"
                  : `₹${order.amounts.shipping}`}
              </Typography>
            </Stack>
            {order.paymentMethod === "cod" && (
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">COD charges</Typography>
                <Typography>₹{order.amounts.codFee}</Typography>
              </Stack>
            )}
            <Divider sx={{ my: 1 }} />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={800}>Total Paid</Typography>
              <Typography fontWeight={900} fontSize="1.15rem">
                ₹{order.amounts.total.toLocaleString("en-IN")}
              </Typography>
            </Stack>

            <Stack spacing={1.2} mt={1.5}>
              <Button
                variant="contained"
                size="large"
                onClick={() => (window.location.href = "/orders")}
              >
                Track Order
              </Button>
              <Button variant="outlined" onClick={downloadInvoice}>
                Download Invoice
              </Button>
              <Button
                variant="text"
                onClick={() => (window.location.href = "/")}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
