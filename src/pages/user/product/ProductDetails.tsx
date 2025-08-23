import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Rating,
  Divider,
  Breadcrumbs,
  Link as MUILink,
  Stack,
  Snackbar,
  Alert,
  Card,
  CardMedia,
} from "@mui/material";
import "./ProductDetails.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BoltIcon from "@mui/icons-material/Bolt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import useCity from "../../../hooks/useCity";

import {
  PRODUCTS,
  SUBCATEGORIES,
  CATEGORIES,
  OFFERS,
  USER,
  Product,
  Cart,
  CartItem,
  getInventoryStock,
} from "../../../data/dummyData";
import ScrollableProducts from "../ScrollableProducts";
import Header from "../common/Header";
import { writeCart } from "../util/cart";
import { toggleWishlist, isInWishlist } from "../util/wishlist";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function isOfferActive(validFrom: string, validTo: string) {
  const now = new Date();
  const from = new Date(validFrom);
  const to = new Date(validTo);
  return now >= from && now <= to;
}

export default function ProductDetails() {
  const city = useCity();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "info";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  const product = useMemo(() => PRODUCTS.find((p) => p.id === id), [id]);

  const subcategory = useMemo(
    () => SUBCATEGORIES.find((s) => s.id === product?.subcategoryId),
    [product]
  );

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === subcategory?.categoryId),
    [subcategory]
  );

  // Offers
  const { bestDiscountOffer, nonPriceOffers } = useMemo(() => {
    if (!product)
      return {
        bestDiscountOffer: null as any,
        nonPriceOffers: [] as typeof OFFERS,
      };

    const applicable = OFFERS.filter((o) => {
      if (!isOfferActive(o.validFrom, o.validTo)) return false;
      const byProduct = o.productId === product.id;
      const byCategory =
        o.categoryId && category?.id && o.categoryId === category.id;
      const bySubcatHack =
        o.categoryId && subcategory?.id && o.categoryId === subcategory.id;
      const global = !o.categoryId && !o.productId;
      return byProduct || byCategory || bySubcatHack || global;
    });

    const priceOffers = applicable.filter((o) => o.discountPercent > 0);
    const nonPrice = applicable.filter((o) => o.discountPercent === 0);

    const best =
      priceOffers.length > 0
        ? priceOffers.reduce((acc, cur) =>
            cur.discountPercent > acc.discountPercent ? cur : acc
          )
        : null;

    return { bestDiscountOffer: best, nonPriceOffers: nonPrice };
  }, [product, category, subcategory]);

  const pricing = useMemo(() => {
    if (!product) return null;
    const base = product.price;
    const discount = bestDiscountOffer?.discountPercent ?? 0;
    const effective = Math.round(base * (1 - discount / 100));
    return {
      base,
      discount,
      effective,
      label: bestDiscountOffer?.offerName as string | undefined,
    };
  }, [product, bestDiscountOffer]);

  // Stock (city-aware)
  const stock = useMemo(() => {
    if (!product) return 0;
    return getInventoryStock(product.id, city);
  }, [product, city]);

  const deliveryEta = useMemo(() => {
    const days = 3 + Math.floor(Math.random() * 3); // 3–5 days
    const dt = new Date();
    dt.setDate(dt.getDate() + days);
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }, []);

  const related = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(
      (p) => p.subcategoryId === product.subcategoryId && p.id !== product.id
    );
  }, [product]);

  // ===== Wishlist state =====
  const [wish, setWish] = useState(false);
  useEffect(() => {
    if (product?.id) setWish(isInWishlist(product.id));
  }, [product?.id]);

  const handleWishlist = () => {
    if (!product) return;
    const nowInWishlist = toggleWishlist(product.id);
    setWish(nowInWishlist);
    setSnack({
      open: true,
      msg: nowInWishlist ? "Added to wishlist" : "Removed from wishlist",
      type: "success",
    });
  };

  // ===== Cart actions =====
  const addToCart = (qty = 1) => {
    if (!product || !pricing) return;
    const raw = localStorage.getItem("cart");
    const cart: Cart = raw
      ? JSON.parse(raw)
      : { id: "cart1", userId: USER.id, items: [], status: "active" };

    const existing = cart.items.find(
      (i: CartItem) => i.productId === product.id
    );
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({
        productId: product.id,
        // if you later use SKU-wise variants, push `sku` from product here
        sku: (product as any).sku,
        quantity: qty,
        priceSnapshot: pricing.effective,
      });
    }
    writeCart(cart);
    setSnack({ open: true, msg: "Added to cart!", type: "success" });
  };

  const buyNow = () => {
    addToCart(1);
    navigate("/checkout");
  };

  if (!product) {
    return (
      <Box p={3}>
        <Typography variant="h6">Product not found</Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }} variant="outlined">
          Go Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="product-page"
      p={{ xs: 2, md: 3 }}
      maxWidth="1200px"
      mx="auto"
    >
      <Header city={"Delhi"} onOpenLocation={() => console.log("test loc")} />

      {/* Breadcrumbs */}
      <Breadcrumbs className="pd-breadcrumbs" sx={{ mb: 2 }}>
        <MUILink
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
        >
          Home
        </MUILink>
        {category && (
          <MUILink underline="hover" color="inherit">
            {category.name}
          </MUILink>
        )}
        {subcategory && (
          <MUILink underline="hover" color="inherit">
            {subcategory.name}
          </MUILink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Left: Gallery */}
        <Grid>
          <Card
            className="gallery-card"
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardMedia
              component="img"
              image={product.image || ""}
              alt={product.name}
              sx={{
                width: "100%",
                maxHeight: 520,
                objectFit: "contain",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            />
          </Card>
        </Grid>

        {/* Right: Info */}
        <Grid>
          <Stack className="info-panel" spacing={1.2}>
            <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {category?.name} • {subcategory?.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {product.rating.toFixed(1)} / 5
              </Typography>
              {pricing?.discount ? (
                <Chip
                  size="small"
                  color="primary"
                  label={`${pricing.discount}% OFF`}
                />
              ) : null}
            </Stack>

            <Box className="price-row">
              {pricing?.discount ? (
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    className="price-current"
                    variant="h5"
                    fontWeight={800}
                  >
                    {formatINR(pricing.effective)}
                  </Typography>
                  <Typography
                    className="price-mrp"
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    {formatINR(pricing.base)}
                  </Typography>
                  {pricing.label && (
                    <Typography
                      className="price-offer"
                      variant="body2"
                      color="success.main"
                    >
                      • {pricing.label}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography
                  className="price-current"
                  variant="h5"
                  fontWeight={800}
                >
                  {formatINR(pricing!.effective)}
                </Typography>
              )}
              <Typography
                className="price-tax"
                variant="caption"
                color="text.secondary"
              >
                Inclusive of all taxes
              </Typography>
            </Box>

            <Divider />

            {/* Stock & Delivery */}
            <Stack
              className="delivery-row"
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Chip
                className={`stock-chip ${stock > 0 ? "in" : "out"}`}
                label={
                  stock > 0 ? `In stock (${stock} in ${city})` : "Out of stock"
                }
                color={stock > 0 ? "success" : "default"}
                variant="outlined"
              />
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                color="text.secondary"
              >
                <LocalShippingIcon fontSize="small" />
                <Typography variant="body2">
                  Deliver to <b>{city}</b> by <b>{deliveryEta}</b>
                </Typography>
              </Stack>
            </Stack>

            {/* Buttons */}
            <Stack
              className="cta-row"
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              mt={1}
            >
              <Button
                className="btn-add"
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                size="large"
                onClick={() => addToCart(1)}
                disabled={stock === 0}
                sx={{ borderRadius: 2 }}
              >
                Add to Cart
              </Button>

              <Button
                className="btn-buy"
                startIcon={<BoltIcon />}
                variant="outlined"
                size="large"
                onClick={buyNow}
                disabled={stock === 0}
                sx={{ borderRadius: 2 }}
              >
                Buy Now
              </Button>

              <Button
                className={`btn-wish ${wish ? "active" : ""}`}
                startIcon={wish ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                variant={wish ? "contained" : "outlined"}
                size="large"
                onClick={handleWishlist}
                sx={{ borderRadius: 2 }}
              >
                {wish ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </Stack>

            {/* Offers */}
            {(nonPriceOffers.length > 0 || pricing?.discount) && (
              <Box className="offers-box">
                <Typography variant="subtitle1" fontWeight={700} mt={1}>
                  Offers & benefits
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                  {pricing?.discount ? (
                    <Chip
                      label={`${pricing.discount}% instant discount`}
                      variant="outlined"
                    />
                  ) : null}
                  {nonPriceOffers.map((o) => (
                    <Chip key={o.id} label={o.offerName} variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Description */}
            <Box className="desc-box">
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                About this item
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Related */}
      {related.length > 0 && (
        <Box className="related-section" mt={4}>
          <ScrollableProducts products={related} />
        </Box>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={1800}
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
