// src/auth/AuthGate.tsx
import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authContext?.authenticated) {
      // ✅ Redirect only if user is on root "/"
      if (location.pathname === "/") {
        navigate("/products", { replace: true });
      }
    }
  }, [authContext?.authenticated, navigate, location.pathname]);

  return <>{authContext?.authenticated ? children : <div>Loading...</div>}</>;
};

export default AuthGate;
