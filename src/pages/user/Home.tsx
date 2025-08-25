import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CATEGORIES,
  PRODUCTS,
  OFFERS,
  Offer,
  getCurrentCity,
} from "../../data/dummyData";
import "./Home.css";

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

import ScrollableProducts from "./ScrollableProducts";
import Header from "./common/Header";

/* ---------- Local: horizontal “Offers” scroller ---------- */
const ScrollableCategory: React.FC<{ offers: Offer[] }> = ({ offers }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateScrollButtons);
    return () => el?.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <Box mb={4} position="relative">
      <Typography variant="h6" fontWeight={600} mb={2}>
        Special Offers
      </Typography>

      <Box position="relative" className="h-scroll-nav">
        {showLeft && (
          <IconButton
            onClick={() => scroll("left")}
            className="h-nav h-nav-left"
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {showRight && (
          <IconButton
            onClick={() => scroll("right")}
            className="h-nav h-nav-right"
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        <Box ref={scrollRef} className="h-scroll offer-row">
          {offers.map((item) => (
            <Card key={item.id} className="h-item offer-card">
              <CardMedia
                component="img"
                image={item.image}
                alt={item.offerName}
                height="160"
              />
              <CardContent>
                <Typography fontWeight={500} mb={0.5}>
                  {item.offerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={() => console.log(`View offer ${item.id}`)}
                >
                  Shop Now
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ------------------------- Page ------------------------- */
export default function Home() {
  const [city, setCity] = useState<string>(getCurrentCity());

  // keep city in sync with header/location switcher
  useEffect(() => {
    const syncCity = () => {
      const c = getCurrentCity();
      if (c !== city) setCity(c);
    };
    syncCity();
    window.addEventListener("location:updated", syncCity as EventListener);
    window.addEventListener("storage", syncCity);
    return () => {
      window.removeEventListener("location:updated", syncCity as EventListener);
      window.removeEventListener("storage", syncCity);
    };
  }, [city]);

  return (
    <div className="home-page">
      <Header city={city} />

      {/* Hero */}
      <section className="hero-banner">
        <h2>Fastest to {city}: Essentials under ₹499</h2>
        <button>Shop Now</button>
      </section>

      {/* Quick Categories */}
      <section className="quick-categories">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} className="quick-btn">
            {cat.name}
          </button>
        ))}
      </section>

      {/* Offers */}
      <section className="offers">
        <ScrollableCategory offers={OFFERS} />
      </section>

      {/* Deal of the Day */}
      <section className="deal">
        <span>Deal of the Day ▸ 05:12:33</span>
        <span>Up to 60% off</span>
        <Link to="/deals">View all</Link>
      </section>

      {/* Popular Products */}
      <section className="popular">
        <ScrollableProducts products={PRODUCTS.slice(0, 10)} />
      </section>
    </div>
  );
}
