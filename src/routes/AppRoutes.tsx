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

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // <SidebarLayout>
          <Home />
          // </SidebarLayout>
        }
      />
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
  );
};

export default AppRoutes;
