import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "./auth/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import { useColorMode } from "./context/ColorModeContext";
import AuthGate from "./auth/AuthGate";

const App = () => {
  const { theme } = useColorMode();
  return (
    // <AuthProvider>
    //   <AuthGate>
    <AppRoutes />
    //   </AuthGate>
    // </AuthProvider>
  );
};

export default App;
