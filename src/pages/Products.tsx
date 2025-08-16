import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add Link

import productsData from "../data/p.json";

interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: string;
}

interface ProductCategory {
  title: string;
  items: ProductItem[];
}

// ✅ Utility to create slug from category title
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const Products: React.FC = () => {
  const categories: ProductCategory[] = productsData;

  return (
    <Box p={2}>
      {categories.map((category) => (
        <ScrollableCategory key={category.title} category={category} />
      ))}
    </Box>
  );
};

const ScrollableCategory: React.FC<{ category: ProductCategory }> = ({
  category,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 10);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", updateScrollButtons);
    return () => el?.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box mb={4} position="relative">
      <Typography variant="h6" fontWeight={600} mb={2}>
        {category.title}
      </Typography>

      <Box position="relative">
        {showLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "40%",
              left: 0,
              zIndex: 1,
              backgroundColor: "background.paper",
              boxShadow: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {showRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "40%",
              right: 0,
              zIndex: 1,
              backgroundColor: "background.paper",
              boxShadow: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 1,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {category.items.map((item) => (
            <Card
              key={item.id}
              sx={{
                minWidth: 240,
                borderRadius: 2,
                flex: "0 0 auto",
                bgcolor: "background.paper",
                boxShadow: 2,
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                height="160"
              />
              <CardContent>
                <Typography fontWeight={500} mb={0.5}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/products/${slugify("phones")}`)}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
