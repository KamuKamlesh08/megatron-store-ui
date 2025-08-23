import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Header from "../common/Header";

import { getCurrentCity, PRODUCTS } from "../../../data/dummyData";
import { readAllOrders } from "../util/orders";
import "./OrdersPage.css";

export default function OrdersPage() {
  const navigate = useNavigate();
  const city = getCurrentCity();
  const [orders, setOrders] = useState(readAllOrders());

  useEffect(() => {
    const sync = () => setOrders(readAllOrders());
    window.addEventListener("orders:updated", sync as EventListener);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("orders:updated", sync as EventListener);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const totalOrders = orders.length;

  return (
    <Box
      className="orders-page"
      p={{ xs: 2, md: 3 }}
      maxWidth="1000px"
      mx="auto"
    >
      <Header city={city} onOpenLocation={() => {}} />
      <Typography variant="h5" fontWeight={800} mt={1}>
        My Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {totalOrders
          ? `${totalOrders} order${totalOrders > 1 ? "s" : ""} found`
          : "No orders yet"}
      </Typography>

      {!totalOrders ? (
        <Stack spacing={1.2}>
          <Typography>Your order history is empty.</Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Start Shopping
          </Button>
        </Stack>
      ) : (
        <Stack spacing={1.2}>
          {orders.map((o) => {
            const date = new Date(o.date);
            const firstItem = o.items[0];
            const firstProd = PRODUCTS.find(
              (p) => p.id === firstItem.productId
            );
            const thumb = firstProd?.image;
            const title = firstProd?.name || `${o.items.length} items`;

            return (
              <Paper key={o.id} className="order-card" elevation={0}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={2}
                >
                  <Stack
                    direction="row"
                    gap={1.2}
                    alignItems="center"
                    minWidth={0}
                  >
                    {thumb ? (
                      <img src={thumb} alt={title} className="order-thumb" />
                    ) : (
                      <div className="order-thumb placeholder" />
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap fontWeight={700}>
                        {title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {date.toLocaleDateString()} •{" "}
                        {o.paymentMethod.toUpperCase()} • {o.city}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {o.items.length} item{o.items.length > 1 ? "s" : ""} •
                        Total ₹{o.amounts.total.toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" gap={1}>
                    <Chip
                      size="small"
                      label={o.status || "confirmed"}
                      color={
                        o.status === "delivered"
                          ? "success"
                          : o.status === "shipped"
                          ? "info"
                          : "default"
                      }
                      variant="outlined"
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/orders/${o.id}`)}
                    >
                      View details
                    </Button>

                    {/* NEW: Track button via navigate */}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/orders/track/${o.id}`)}
                    >
                      Track
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
      <Divider sx={{ my: 2 }} />
      <Button component={RouterLink} to="/" variant="text">
        Continue Shopping
      </Button>
    </Box>
  );
}
