import { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  Link as MUILink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Header from "../common/Header";
import "./OrderTrackingPage.css";

import {
  PRODUCTS,
  Product,
  ORDERS,
  getCurrentCity,
} from "../../../data/dummyData";

/** ---- helpers ---- */
type SavedOrder = {
  id: string;
  date: string;
  city: string;
  paymentMethod?: "upi" | "card" | "cod";
  address?: { name: string; phone: string; line1: string; pincode: string };
  items: { productId: string; sku?: string; quantity: number; price: number }[];
  amounts: {
    subtotal: number;
    shipping: number;
    codFee?: number;
    total: number;
  };
};

// read latest order (from checkout success)
function readLatestOrder(): SavedOrder | null {
  try {
    const raw =
      sessionStorage.getItem("order:latest") ||
      localStorage.getItem("order:latest");
    return raw ? (JSON.parse(raw) as SavedOrder) : null;
  } catch {
    return null;
  }
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/** compute “live-ish” stage based on time since orderDate */
function computeStage(orderDateISO: string): number {
  const placed = new Date(orderDateISO).getTime();
  const now = Date.now();
  const mins = (now - placed) / 60000;

  // tweak thresholds to your liking
  if (mins < 1) return 0; // Placed
  if (mins < 30) return 1; // Confirmed
  if (mins < 24 * 60) return 2; // Shipped
  if (mins < 48 * 60) return 3; // Out for delivery
  return 4; // Delivered
}

const STAGES = [
  { key: "placed", label: "Order placed" },
  { key: "confirmed", label: "Order confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "out", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const city = getCurrentCity();

  // order source: URL id -> try latest saved -> fallback to ORDERS dummy
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const latest = readLatestOrder();
    if (latest && (!id || latest.id === id)) {
      setOrder(latest);
      return;
    }
    // fallback to static ORDERS for demo if id matches
    const fallback = ORDERS.find((o) => o.id === id);
    if (fallback) {
      setOrder({
        id: fallback.id,
        date: fallback.orderDate,
        city: city,
        items: fallback.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          price: it.price,
        })),
        amounts: {
          subtotal: fallback.totalAmount,
          shipping: 0,
          total: fallback.totalAmount,
        },
      });
    }
  }, [id, city]);

  const progressIndex = useMemo(
    () => (order ? computeStage(order.date) : 0),
    [order]
  );

  const products: (Product & { qty: number; lineTotal: number })[] =
    useMemo(() => {
      if (!order) return [];
      return order.items
        .map((it) => {
          const p = PRODUCTS.find((pp) => pp.id === it.productId);
          if (!p) return null;
          const lineTotal = it.quantity * (it.price ?? p.price);
          return { ...p, qty: it.quantity, lineTotal };
        })
        .filter(Boolean) as any[];
    }, [order]);

  if (!order) {
    return (
      <Box p={{ xs: 2, md: 3 }} maxWidth="900px" mx="auto">
        <Header city={city} />
        <Typography variant="h6" mt={2}>
          No order found
        </Typography>
        <Stack direction="row" spacing={1} mt={1}>
          <Button component={RouterLink} to="/orders" variant="outlined">
            Go to My Orders
          </Button>
          <Button component={RouterLink} to="/" variant="contained">
            Continue Shopping
          </Button>
        </Stack>
      </Box>
    );
  }

  const eta = (() => {
    const dt = new Date(order.date);
    dt.setDate(dt.getDate() + 3);
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  })();

  const canCancel = progressIndex <= 1; // till confirmed
  const canReturn = progressIndex >= 4; // when delivered

  const handleCancel = () => {
    alert("Cancel request submitted. We’ll update you shortly.");
  };
  const handleReturn = () => {
    alert("Return/Replace request raised. Pickup will be scheduled.");
  };

  const copyTrackLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("Tracking link copied!");
    } catch {
      alert(url);
    }
  };

  return (
    <Box className="ot-page" p={{ xs: 2, md: 3 }} maxWidth="1000px" mx="auto">
      <Header city={city} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h5" fontWeight={800}>
          Track your order
        </Typography>
        <MUILink component={RouterLink} to="/orders" underline="hover">
          ← Back to My Orders
        </MUILink>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Order <b>{order.id}</b> • placed on{" "}
        {new Date(order.date).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>

      {/* Timeline */}
      <Paper className="ot-panel" elevation={0}>
        <div className="ot-tracker">
          {STAGES.map((s, idx) => {
            const state =
              idx < progressIndex
                ? "done"
                : idx === progressIndex
                ? "current"
                : "todo";
            return (
              <div className={`ot-step ${state}`} key={s.key}>
                <div className="ot-dot" />
                <div className="ot-line" />
                <span className="ot-label">{s.label}</span>
              </div>
            );
          })}
        </div>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={1}>
          <Chip
            label={progressIndex < 4 ? `Est. delivery ${eta}` : "Delivered"}
            color={progressIndex < 4 ? "info" : "success"}
            variant="filled"
          />
          <Chip
            label={
              order.paymentMethod
                ? order.paymentMethod.toUpperCase()
                : "PREPAID"
            }
          />
          <Chip label={`Total ${formatINR(order.amounts.total)}`} />
          <Button onClick={copyTrackLink} size="small" variant="text">
            Share tracking link
          </Button>
        </Stack>
      </Paper>

      {/* Address + Actions */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mt={2}
        alignItems="stretch"
      >
        <Paper className="ot-panel" elevation={0} sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Delivery address
          </Typography>
          {order.address ? (
            <>
              <Typography>
                {order.address.name} • {order.address.phone}
              </Typography>
              <Typography color="text.secondary">
                {order.address.line1}
              </Typography>
              <Typography color="text.secondary">
                {order.city} — {order.address.pincode}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">
              Address not available.
            </Typography>
          )}
        </Paper>

        <Paper className="ot-panel" elevation={0} sx={{ flexBasis: 320 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Actions
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              color="error"
              disabled={!canCancel}
              onClick={handleCancel}
            >
              Cancel order
            </Button>
            <Button
              variant="outlined"
              disabled={!canReturn}
              onClick={handleReturn}
            >
              Return / Replace
            </Button>
            <Button variant="contained" component={RouterLink} to="/">
              Continue shopping
            </Button>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            Cancellation allowed till your order is confirmed. Returns enabled
            once delivered.
          </Typography>
        </Paper>
      </Stack>

      {/* Items */}
      <Paper className="ot-panel" elevation={0} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Items
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1.2}>
          {products.map((p) => (
            <Stack
              key={p.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
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
                  width={56}
                  height={56}
                  style={{ borderRadius: 8, objectFit: "cover" }}
                />
                <div style={{ minWidth: 0 }}>
                  <Typography noWrap fontWeight={600}>
                    {p.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qty: {p.qty}
                  </Typography>
                </div>
              </Stack>
              <Typography fontWeight={700}>{formatINR(p.lineTotal)}</Typography>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 1 }} />
        <Stack spacing={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Items subtotal</Typography>
            <Typography>{formatINR(order.amounts.subtotal)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Shipping</Typography>
            <Typography>
              {order.amounts.shipping === 0
                ? "FREE"
                : formatINR(order.amounts.shipping)}
            </Typography>
          </Stack>
          {order.amounts.codFee ? (
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">COD charges</Typography>
              <Typography>{formatINR(order.amounts.codFee)}</Typography>
            </Stack>
          ) : null}
          <Divider sx={{ my: 1 }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={800}>Total paid</Typography>
            <Typography fontWeight={900} fontSize="1.1rem">
              {formatINR(order.amounts.total)}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
