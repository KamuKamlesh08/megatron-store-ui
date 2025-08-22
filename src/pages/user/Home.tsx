import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CATEGORIES,
  PRODUCTS,
  USER,
  OFFERS,
  Category,
  Offer,
} from "../../data/dummyData";
import { useGeolocated } from "react-geolocated";
import "./Home.css";
import logoLight from "../../assets/logo-dark-bg.png";
import wishlistIcon from "../../assets/megatron-wishlist.png";
import cartIcon from "../../assets/megatron-cart.png";

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
import { useNavigate } from "react-router-dom"; // ✅ Add Link
import ScrollableProducts from "./ScrollableProducts";

type CartItem = {
  productId: string;
  quantity?: number;
  priceSnapshot?: number;
};

const getCartCount = () => {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const cart = JSON.parse(raw) as { items?: CartItem[] };
    return (cart.items || []).reduce((s, it) => s + (it.quantity ?? 0), 0);
  } catch {
    return 0;
  }
};

const ScrollableCategory: React.FC<{ offers: Offer[] }> = ({ offers }) => {
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
        {`Special Offers`}
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
            scrollSnapType: "x mandatory", // smooth snapping
            "& > *": { scrollSnapAlign: "start" }, // each card aligns left
          }}
        >
          {offers.map((item) => (
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
                  className="offer-button"
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

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("Delhi"); // default
  const [showPopup, setShowPopup] = useState(false);
  const [pincode, setPincode] = useState("");

  const [showMobileActions, setShowMobileActions] = useState(false);
  const [cartCount, setCartCount] = useState<number>(getCartCount());
  useEffect(() => {
    const sync = () => setCartCount(getCartCount());
    window.addEventListener("storage", sync);
    window.addEventListener("cart:updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:updated", sync as EventListener);
    };
  }, []);

  const goToCart = () => {
    //setShowMobileActions(false);
    navigate("/cart");
  };
  // Toggle function
  const toggleMobileActions = () => {
    setShowMobileActions(!showMobileActions);
  };

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  // Detect current location
  const detectLocation = async () => {
    if (coords) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
        );
        const data = await res.json();
        if (data?.address?.city) setCity(data.address.city);
        else if (data?.address?.state) setCity(data.address.state);
        setShowPopup(false);
      } catch {
        alert("Error fetching location");
      }
    } else {
      alert("Location not available. Please allow location access.");
    }
  };

  // Apply location via pincode
  const applyPincode = () => {
    if (pincode) {
      setCity(pincode);
      setShowPopup(false);
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <div className="header">
        <div className="left">
          <div className="logo">
            <img src={logoLight} alt="Megatron Store" />
          </div>
          <button className="location-btn" onClick={() => setShowPopup(true)}>
            📍 {city} ▾
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder={`Search in ${city}: mobiles, shoes...`}
          />
          <button>🔎</button>
        </div>

        <div className="actions">
          {/* Desktop: normal icons */}
          <div className="desktop-actions">
            {/* ✅ wishlist image (className same, so CSS stays) */}
            <span className="wishlist" role="button" aria-label="Wishlist">
              <img src={wishlistIcon} alt="Wishlist" className="icon-24" />
            </span>
            {/* ✅ cart image with badge */}
            <button
              className="cart-icon-wrap"
              onClick={goToCart}
              aria-label="Cart"
            >
              <img src={cartIcon} alt="Cart" className="icon-24" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>

          {/* Mobile: single menu icon */}
          <div className="mobile-actions-wrapper">
            <span className="mobile-menu-icon" onClick={toggleMobileActions}>
              ☰
            </span>
            {showMobileActions && (
              <div className="mobile-actions-popup">
                <span className="wishlist">♥ Wishlist</span>
                <span className="cart">🛒 Cart</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Popup */}
      {showPopup && (
        <div className="location-popup">
          <div className="popup-content">
            <h3>Select Location</h3>
            <button onClick={detectLocation}>📍 Detect Current Location</button>
            <div className="pincode-box">
              <input
                type="text"
                placeholder="Enter City"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button onClick={applyPincode}>Apply</button>
            </div>
            <button className="close" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section className="hero-banner">
        <h2>Fastest to {city}: Essentials under ₹499</h2>
        <button>Shop Now</button>
      </section>

      {/* Quick Categories */}
      <section className="quick-categories">
        {CATEGORIES.map((cat, idx) => (
          <button key={idx} className="quick-btn">
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
