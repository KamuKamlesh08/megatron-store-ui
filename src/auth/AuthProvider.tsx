import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import keycloak from "./keycloak";
import Keycloak from "keycloak-js";

interface AuthContextType {
  keycloak: Keycloak;
  authenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const hasInitialized = useRef(false); // ✅ this will prevent repeated init

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true; // ✅ set flag so it doesn't run again

    console.log("🔄 Keycloak Init Starting...");
    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        flow: "standard",
        // Optional: redirectUri: window.location.origin + "/products"
      })
      .then((auth: boolean | ((prevState: boolean) => boolean)) => {
        console.log("✅ Auth success:", auth);
        setAuthenticated(auth);
        if (auth && keycloak.token) {
          localStorage.setItem("token", keycloak.token);
        }
      })
      .catch((err: any) => {
        console.error("❌ Keycloak init failed:", err);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
