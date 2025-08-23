import { Product } from "../../data/dummyData"; // Ensure you have Product type
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
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ScrollableProducts: React.FC<{ products: Product[] }> = ({
  products,
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
        Popular Products
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
          className="h-scroll product-row"
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 1,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            scrollSnapType: "x mandatory", // smooth snapping
            "& > *": { scrollSnapAlign: "start" }, // each card aligns left,
          }}
        >
          {products.map((p) => (
            <Card
              className="h-item"
              key={p.id}
              sx={{
                minWidth: 200,
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
                image={p.image || ""}
                alt={p.name}
                height="160"
              />
              <CardContent>
                <Typography fontWeight={500} mb={0.5}>
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{p.price.toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/product/${p.id}`)}
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

export default ScrollableProducts;
