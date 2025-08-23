import { useParams, Link as RouterLink } from "react-router-dom";
import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import Header from "../common/Header";
import { getCurrentCity, PRODUCTS } from "../../../data/dummyData";
import { getOrderById } from "../util/orders";
import "./OrderDetailPage.css";

export default function OrderDetailPage() {
  const { id = "" } = useParams();
  const city = getCurrentCity();
  const order = useMemo(() => (id ? getOrderById(id) : null), [id]);

  if (!order) {
    return (
      <Box p={{ xs: 2, md: 3 }} maxWidth="900px" mx="auto">
        <Header city={city} onOpenLocation={() => {}} />
        <Typography variant="h6" mt={2}>
          Order not found
        </Typography>
        <Button
          sx={{ mt: 1 }}
          component={RouterLink}
          to="/orders"
          variant="contained"
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  const date = new Date(order.date);

  return (
    <Box
      className="order-detail"
      p={{ xs: 2, md: 3 }}
      maxWidth="900px"
      mx="auto"
    >
      <Header city={city} onOpenLocation={() => {}} />
      <Typography variant="h5" fontWeight={800}>
        Order #{order.id}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Placed on {date.toLocaleDateString()} •{" "}
        {order.paymentMethod.toUpperCase()}
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="flex-start"
        mt={2}
      >
        {/* Left: items */}
        <Paper className="panel" elevation={0}>
          <Typography
            className="panel-title"
            variant="subtitle1"
            fontWeight={700}
          >
            Items
          </Typography>
          <Stack className="panel-body" spacing={1.2}>
            {order.items.map((it, idx) => {
              const p = PRODUCTS.find((pp) => pp.id === it.productId);
              return (
                <Stack
                  key={idx}
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
                    {p?.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                    ) : (
                      <div className="item-thumb placeholder" />
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap fontWeight={600}>
                        {p?.name || it.productId}
                      </Typography>
                      {it.sku && (
                        <Typography variant="caption" color="text.secondary">
                          SKU: {it.sku}
                        </Typography>
                      )}
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`Qty: ${it.quantity}`}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Stack>
                  <Typography fontWeight={700}>
                    ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Paper>

        {/* Right: summary + address */}
        <Stack flex={1} spacing={2} minWidth={0}>
          <Paper className="panel" elevation={0}>
            <Typography
              className="panel-title"
              variant="subtitle1"
              fontWeight={700}
            >
              Summary
            </Typography>
            <Stack className="panel-body" spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal</Typography>
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
              {order.amounts.codFee > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">COD charges</Typography>
                  <Typography>₹{order.amounts.codFee}</Typography>
                </Stack>
              )}
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={800}>Total</Typography>
                <Typography fontWeight={900} fontSize="1.1rem">
                  ₹{order.amounts.total.toLocaleString("en-IN")}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Paper className="panel" elevation={0}>
            <Typography
              className="panel-title"
              variant="subtitle1"
              fontWeight={700}
            >
              Shipping Address
            </Typography>
            <Stack className="panel-body" spacing={0.5}>
              <Typography>
                {order.address.name} • {order.address.phone}
              </Typography>
              <Typography color="text.secondary">
                {order.address.line1}
              </Typography>
              <Typography color="text.secondary">
                {order.city} - {order.address.pincode}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1.2} mt={2}>
        <Button component={RouterLink} to="/orders" variant="outlined">
          Back to Orders
        </Button>
        <Button component={RouterLink} to="/" variant="contained">
          Continue Shopping
        </Button>
      </Stack>
    </Box>
  );
}
