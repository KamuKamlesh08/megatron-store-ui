// src/pages/CategoryPage.tsx
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import productsData from "../data/pd.json";
import ProductCard from "../components/ProductCard";

// Capitalize the first letter utility
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const CategoryPage = () => {
  const { slug } = useParams();

  // Filter products based on category slug
  const filteredProducts = productsData.filter(
    (product) => product.category.toLowerCase() === slug?.toLowerCase()
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        {slug ? `${capitalize(slug)} Products` : "Products"}
      </Typography>

      {filteredProducts.length > 0 ? (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid
              key={product?.id}
              component="div" // 👈 Optional fix for TS error
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No products found in this category.</Typography>
      )}
    </Box>
  );
};

export default CategoryPage;
