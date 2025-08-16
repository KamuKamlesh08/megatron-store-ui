import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";

// Icons
import LaptopIcon from "@mui/icons-material/Laptop";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import WatchIcon from "@mui/icons-material/Watch";
import TvIcon from "@mui/icons-material/Tv";
import DevicesIcon from "@mui/icons-material/Devices";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "laptops":
      return <LaptopIcon sx={{ fontSize: 60 }} />;
    case "phones":
      return <PhoneIphoneIcon sx={{ fontSize: 60 }} />;
    case "tablets":
      return <TabletMacIcon sx={{ fontSize: 60 }} />;
    case "watches":
      return <WatchIcon sx={{ fontSize: 60 }} />;
    case "tv":
      return <TvIcon sx={{ fontSize: 60 }} />;
    default:
      return <DevicesIcon sx={{ fontSize: 60 }} />;
  }
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const handleWishlistToggle = () => {
    setWishlisted((prev) => !prev);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      {/* Icon Display */}
      <Box mb={2}>{getCategoryIcon(product.category)}</Box>

      {/* Title and Price */}
      <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {product.title}
        </Typography>
        <Typography variant="body1" color="primary" fontWeight="medium">
          ₹ {product.price.toLocaleString("en-IN")}
        </Typography>
      </CardContent>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} mb={1}>
        <Tooltip title="View Details">
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/products/phones/1`)}
          >
            View
          </Button>
        </Tooltip>

        <Tooltip title="Buy Now">
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingBagIcon />}
          >
            Buy
          </Button>
        </Tooltip>

        <Tooltip title="Add to Cart">
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddShoppingCartIcon />}
          >
            Cart
          </Button>
        </Tooltip>

        <Tooltip
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <IconButton onClick={handleWishlistToggle} color="error">
            {wishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
};

export default ProductCard;
