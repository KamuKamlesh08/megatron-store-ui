import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageZoomWithBox from "../components/ImageZoomWithBox";

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import productsData from "../data/pDetails.json";

interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: string;
  description?: string;
}

interface ProductCategory {
  title: string;
  items: ProductItem[];
}

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug, productId } = useParams();
  const categories: ProductCategory[] = productsData;

  const category = categories.find(
    (cat) => cat.title.toLowerCase() === slug?.toLowerCase()
  );

  const product = category?.items.find(
    (item) => item.id.toString() === productId
  );

  if (!product) return <Typography>Product not found.</Typography>;

  const similarProducts =
    category?.items.filter((item) => item.id.toString() !== productId) || [];

  return (
    <Box p={3}>
      <Grid container spacing={4}>
        {/* Product Image with Zoom on Hover */}
        <Grid>
          <ImageZoomWithBox
            src={product.image}
            width={350}
            height={350}
            zoomFactor={2}
          />
        </Grid>

        {/* Product Info */}
        <Grid>
          <Typography variant="h4" fontWeight={600}>
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary" my={2}>
            ₹ {product.price}
          </Typography>
          <Typography variant="body1" mb={3}>
            {product.description ||
              "This is a great product. Full description coming soon."}
          </Typography>

          <Button variant="contained" sx={{ mr: 2 }}>
            Add to Cart
          </Button>
          <Button variant="outlined">Add to Wishlist</Button>
        </Grid>
      </Grid>

      {/* Similar Products */}
      <Box mt={6}>
        <Typography variant="h5" mb={2} fontWeight={600}>
          Similar Products
        </Typography>
        <Grid container spacing={2}>
          {similarProducts.slice(0, 4).map((item) => (
            <Grid key={item.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                onClick={() => navigate(`/products/${slug}/${item.id}`)}
              >
                <CardMedia
                  component="img"
                  image={item.image}
                  height="160"
                  alt={item.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography fontWeight={500}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹ {item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetail;
