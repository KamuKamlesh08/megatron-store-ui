import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import productsData from "../data/products.json";

const Products = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const scrollRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
    productsData.forEach((category) => {
      refs[category.category] = React.createRef<HTMLDivElement>();
    });
    return refs;
  }, []);

  const scroll = (category: string, direction: "left" | "right") => {
    const ref = scrollRefs[category];
    if (ref?.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box p={3}>
      {/* <Typography variant="h4" mb={3} fontWeight="bold">
        Products
      </Typography> */}

      {productsData.map((category) => (
        <Box
          key={category.category}
          mb={6}
          borderBottom={`1px solid ${theme.palette.divider}`}
          pb={2}
        >
          <Typography variant="h6" mb={2} fontWeight={600}>
            {category.category}
          </Typography>

          <Box display="flex" alignItems="center">
            <IconButton onClick={() => scroll(category.category, "left")}>
              <ChevronLeftIcon />
            </IconButton>

            <Box
              ref={scrollRefs[category.category]}
              display="flex"
              gap={2}
              sx={{
                flex: 1,
                overflow: "hidden",
                scrollBehavior: "smooth",
                "::-webkit-scrollbar": { display: "none" },
              }}
            >
              {category.items.map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    minWidth: 240,
                    bgcolor: isDark ? "#1E1E2A" : "#FFFFFF",
                    color: theme.palette.text.primary,
                    boxShadow: 3,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      ₹{product.price}
                    </Typography>
                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          fontSize: "0.75rem",
                          paddingX: 1.5,
                          paddingY: 0.5,
                          textTransform: "capitalize",
                        }}
                      >
                        Buy Now
                      </Button>
                      <IconButton size="small">
                        <ShoppingCartIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <FavoriteBorderIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <IconButton onClick={() => scroll(category.category, "right")}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Products;
