import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import fallbackLogo from "../../../assets/logo-dark-bg.png";
import wishlistIcon from "../../../assets/megatron-wishlist.png";
import cartIcon from "../../../assets/megatron-cart.png";
import ordersIcon from "../../../assets/megatron-orders.png";
import { getCartCount } from "../util/cart";
import { readWishlistIds } from "../util/wishlist"; // ✅ NEW

type HeaderProps = {
  city: string;
  onOpenLocation?: () => void;
  logoSrc?: string;
  onSearch?: (q: string) => void;
};

const Header: React.FC<HeaderProps> = ({ city, logoSrc, onSearch }) => {
  const navigate = useNavigate();

  const [showMobileActions, setShowMobileActions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");

  const [localCity, setLocalCity] = useState<string>(
    () => localStorage.getItem("city") || city
  );
  const [pincode, setPincode] = useState("");

  // ✅ Counts
  const [cartCount, setCartCount] = useState<number>(getCartCount());
  const [wishlistCount, setWishlistCount] = useState<number>(
    readWishlistIds().length // ✅ initial
  );

  // cart count sync
  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());
    window.addEventListener("storage", syncCart);
    window.addEventListener(
      "cart:updated",
      syncCart as unknown as EventListener
    );
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(
        "cart:updated",
        syncCart as unknown as EventListener
      );
    };
  }, []);

  // ✅ wishlist count sync
  useEffect(() => {
    const syncWishlist = () => setWishlistCount(readWishlistIds().length);
    // initial pull
    syncWishlist();
    window.addEventListener("storage", syncWishlist);
    window.addEventListener(
      "wishlist:updated",
      syncWishlist as unknown as EventListener
    );
    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener(
        "wishlist:updated",
        syncWishlist as unknown as EventListener
      );
    };
  }, []);

  // city broadcast
  useEffect(() => {
    localStorage.setItem("city", localCity);
    window.dispatchEvent(new Event("location:updated"));
  }, [localCity]);

  // city listen
  useEffect(() => {
    const syncCity = () => {
      const c = localStorage.getItem("city");
      if (c && c !== localCity) setLocalCity(c);
    };
    window.addEventListener(
      "location:updated",
      syncCity as unknown as EventListener
    );
    window.addEventListener("storage", syncCity);
    return () => {
      window.removeEventListener(
        "location:updated",
        syncCity as unknown as EventListener
      );
      window.removeEventListener("storage", syncCity);
    };
  }, [localCity]);

  const toggleMobileActions = () => setShowMobileActions((s) => !s);
  const goToCart = () => {
    setShowMobileActions(false);
    navigate("/cart");
  };
  const goToWishlist = () => {
    setShowMobileActions(false);
    navigate("/wishlist");
  };
  const goToOrders = () => {
    setShowMobileActions(false);
    navigate("/orders");
  };

  const submitSearch = () => onSearch?.(query);

  const openLocationPopup = () => setShowPopup(true);
  const applyPincode = () => {
    if (pincode.trim()) {
      setLocalCity(pincode.trim());
      setShowPopup(false);
    }
  };
  const detectLocation = () => {
    if (!("geolocation" in navigator))
      return alert("Geolocation not available on this device.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          const cityName =
            data?.address?.city || data?.address?.state || "India";
          setLocalCity(cityName);
          setShowPopup(false);
          setShowMobileActions(false);
        } catch {
          alert("Couldn't detect city. Try again.");
        }
      },
      () => alert("Location permission denied.")
    );
  };

  return (
    <>
      <div className="header">
        <div className="left">
          <div className="logo">
            <img src={logoSrc || fallbackLogo} alt="Megatron Store" />
          </div>
          <button className="location-btn" onClick={openLocationPopup}>
            📍 {localCity} ▾
          </button>
        </div>

        <div className="search-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder={`Search in ${localCity}: mobiles, shoes...`}
          />
          <button onClick={submitSearch}>🔎</button>
        </div>

        <div className="actions">
          {/* Desktop */}
          <div className="desktop-actions">
            {/* ✅ Wishlist with badge */}
            <span
              className="cart-icon-wrap wishlist" // reuse wrap for positioning
              role="button"
              aria-label="Wishlist"
              onClick={goToWishlist}
            >
              <img src={wishlistIcon} alt="Wishlist" className="icon-24" />
              {wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount}</span>
              )}
            </span>

            {/* Orders */}
            <span
              className="orders"
              role="button"
              aria-label="My Orders"
              onClick={goToOrders}
            >
              <img src={ordersIcon} alt="My Orders" className="icon-24" />
            </span>

            {/* Cart */}
            <button
              className="cart-icon-wrap"
              onClick={goToCart}
              aria-label="Cart"
            >
              <img src={cartIcon} alt="Cart" className="icon-24" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>

          {/* Mobile */}
          <div className="mobile-actions-wrapper">
            <span className="mobile-menu-icon" onClick={toggleMobileActions}>
              ☰
            </span>
            {showMobileActions && (
              <div className="mobile-actions-popup">
                <span className="wishlist" onClick={goToWishlist}>
                  <img src={wishlistIcon} alt="Wishlist" className="icon-20" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <em className="cart-badge-inline">{wishlistCount}</em>
                  )}
                </span>
                <span className="orders" onClick={goToOrders}>
                  <img src={ordersIcon} alt="My Orders" className="icon-20" />
                  <span>My Orders</span>
                </span>
                <span className="cart" onClick={goToCart}>
                  <img src={cartIcon} alt="Cart" className="icon-20" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <em className="cart-badge-inline">{cartCount}</em>
                  )}
                </span>
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
                placeholder="Enter City / Pincode"
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
    </>
  );
};

export default Header;
