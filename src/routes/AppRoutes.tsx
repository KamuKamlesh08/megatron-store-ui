import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SidebarLayout from "../layouts/SidebarLayout";
import Products from "../pages/Products";
import CategoryPage from "../pages/CategoryPage"; // 🔥 import here
import ProductDetail from "../pages/ProductDetail";
import { AuthProvider } from "../auth/AuthProvider"; // 🔥 import AuthProvider
import Home from "../pages/user/Home";
import ProductDetails from "pages/user/product/ProductDetails";
import CartPage from "pages/user/cart/CartPage";
import CheckoutPage from "pages/user/checkout/CheckoutPage";
import OrderSuccess from "pages/user/order/OrderSuccess";
import ScrollToTop from "components/ScrollToTop";
import OrdersPage from "pages/user/order/OrdersPage";
import OrderDetailPage from "pages/user/order/OrderDetailPage";
import WishlistPage from "pages/user/wishlist/WishlistPage";
import OrderTrackingPage from "pages/user/order/OrderTrackingPage";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            // <SidebarLayout>
            <Home />
            // </SidebarLayout>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        // routes
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders/track/:id" element={<OrderTrackingPage />} />
        <Route
          path="/cart"
          element={
            // Use your layout if you prefer:
            // <SidebarLayout><CartPage/></SidebarLayout>
            <CartPage />
          }
        />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/products"
          element={
            <SidebarLayout>
              <Products />
            </SidebarLayout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <SidebarLayout>
              <CategoryPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/products/:slug/:productId"
          element={
            <SidebarLayout>
              <ProductDetail />
            </SidebarLayout>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
