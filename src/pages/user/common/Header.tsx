import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import fallbackLogo from "../../../assets/logo-dark-bg.png";
import wishlistIcon from "../../../assets/megatron-wishlist.png"; // ✅
import cartIcon from "../../../assets/megatron-cart.png"; // ✅

type CartItem = {
  productId: string;
  quantity?: number;
  priceSnapshot?: number;
};
type HeaderProps = {
  city: string;
  onOpenLocation: () => void;
  logoSrc?: string;
  onSearch?: (q: string) => void;
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

const Header: React.FC<HeaderProps> = ({
  city,
  onOpenLocation,
  logoSrc,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [query, setQuery] = useState("");
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

  const toggleMobileActions = () => setShowMobileActions((s) => !s);
  const goToCart = () => {
    setShowMobileActions(false);
    navigate("/cart");
  };
  const submitSearch = () => onSearch?.(query);

  return (
    <div className="header">
      <div className="left">
        <div className="logo">
          <img src={logoSrc || fallbackLogo} alt="Megatron Store" />
        </div>
        <button className="location-btn" onClick={onOpenLocation}>
          📍 {city} ▾
        </button>
      </div>

      <div className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder={`Search in ${city}: mobiles, shoes...`}
        />
        <button onClick={submitSearch}>🔎</button>
      </div>

      <div className="actions">
        {/* Desktop: icons */}
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

        {/* Mobile: single menu */}
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
  );
};
export default Header;
