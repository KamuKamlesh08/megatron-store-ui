import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import fallbackLogo from "../../../assets/logo-dark-bg.png";
import wishlistIcon from "../../../assets/megatron-wishlist.png";
import cartIcon from "../../../assets/megatron-cart.png";
import { getCartCount } from "../util/cart";

type CartItem = {
  productId: string;
  quantity?: number;
  priceSnapshot?: number;
};

type HeaderProps = {
  city: string; // initial city (e.g., "Delhi")
  onOpenLocation?: () => void; // kept for backwards-compat (unused internally)
  logoSrc?: string;
  onSearch?: (q: string) => void; // optional search handler
};

/* ------- helpers ------- */
// const getCartCount = () => {
//   try {
//     const raw = localStorage.getItem("cart");
//     if (!raw) return 0;
//     const cart = JSON.parse(raw) as { items?: CartItem[] };
//     return (cart.items || []).reduce((s, it) => s + (it.quantity ?? 0), 0);
//   } catch {
//     return 0;
//   }
// };

const Header: React.FC<HeaderProps> = ({ city, logoSrc, onSearch }) => {
  const navigate = useNavigate();

  // UI state
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");

  // Location (shared across pages via localStorage + custom event)
  const [localCity, setLocalCity] = useState<string>(
    () => localStorage.getItem("city") || city
  );
  const [pincode, setPincode] = useState("");

  // Cart count badge
  const [cartCount, setCartCount] = useState<number>(getCartCount());

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

  // broadcast city changes
  useEffect(() => {
    localStorage.setItem("city", localCity);
    window.dispatchEvent(new Event("location:updated"));
  }, [localCity]);

  // listen for city changes from other tabs/components
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

  const submitSearch = () => {
    if (onSearch) onSearch(query);
    // optional fallback route:
    // else navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  /* ---- Location popup actions ---- */
  const openLocationPopup = () => setShowPopup(true);
  const applyPincode = () => {
    if (pincode.trim()) {
      setLocalCity(pincode.trim());
      setShowPopup(false);
    }
  };

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not available on this device.");
      return;
    }
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
            <span className="wishlist" role="button" aria-label="Wishlist">
              <img src={wishlistIcon} alt="Wishlist" className="icon-24" />
            </span>

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
                <span className="wishlist">
                  <img src={wishlistIcon} alt="Wishlist" className="icon-20" />
                  <span>Wishlist</span>
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

      {/* Location Popup (CSS classes already present in your Header.css) */}
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
