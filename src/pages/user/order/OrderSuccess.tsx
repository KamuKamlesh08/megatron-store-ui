// pages/user/orders/OrderSuccess.tsx
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Header from "../common/Header";
import "./OrderSuccess.css";
import { getCurrentCity, PRODUCTS } from "../../../data/dummyData";

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

export default function OrderSuccess() {
  const city = getCurrentCity();
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    setOrder(readLatestOrder());
  }, []);

  const trackHref = order
    ? `/orders/track/${encodeURIComponent(order.id)}`
    : "/orders";
  const itemsCount =
    order?.items?.reduce((s, it) => s + (it.quantity || 0), 0) ?? 0;

  return (
    <Box className="os-page" p={{ xs: 2, md: 3 }} maxWidth="900px" mx="auto">
      <Header city={city} />

      <Paper className="os-card" elevation={0}>
        <div className="os-tick" aria-hidden="true">
          ✓
        </div>
        <Typography variant="h5" fontWeight={800} textAlign="center">
          Order placed successfully!
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={0.5}
        >
          {order ? (
            <>
              Order <b>{order.id}</b> •{" "}
              {new Date(order.date).toLocaleString("en-IN")}
            </>
          ) : (
            "We couldn’t find the latest order in this tab."
          )}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
          {order?.paymentMethod && (
            <Chip size="small" label={order.paymentMethod.toUpperCase()} />
          )}
          {order && <Chip size="small" label={`${itemsCount} item(s)`} />}
          {order && (
            <Chip
              size="small"
              color="success"
              label={`Paid ${formatINR(order.amounts.total)}`}
            />
          )}
        </Stack>

        {order && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {order.items.slice(0, 3).map((it, idx) => {
                const p = PRODUCTS.find((pp) => pp.id === it.productId);
                if (!p) return null;
                return (
                  <Stack
                    key={`${p.id}-${idx}`}
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
                        width={44}
                        height={44}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                      <Typography noWrap fontWeight={600}>
                        {p.name}
                      </Typography>
                    </Stack>
                    <Typography fontWeight={700}>
                      {formatINR((it.price ?? p.price) * it.quantity)}
                    </Typography>
                  </Stack>
                );
              })}
              {order.items.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  and {order.items.length - 3} more…
                </Typography>
              )}
            </Stack>
          </>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          justifyContent="center"
          mt={2}
        >
          <Button
            component={RouterLink}
            to={trackHref}
            variant="contained"
            size="large"
            disabled={!order}
          >
            Track order
          </Button>
          <Button
            component={RouterLink}
            to="/orders"
            variant="outlined"
            size="large"
          >
            My Orders
          </Button>
          <Button component={RouterLink} to="/" variant="text" size="large">
            Continue shopping
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
