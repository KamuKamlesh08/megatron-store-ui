import React, { createContext, useMemo, useState, useContext } from "react";
import { ThemeProvider, createTheme, PaletteMode } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { getDesignTokens } from "../theme/Theme";

interface ColorModeContextType {
  toggleTheme: () => void;
  theme: ReturnType<typeof createTheme>;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context)
    throw new Error("useColorMode must be used within ColorModeProvider");
  return context;
};

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const colorMode = useMemo(
    () => ({
      toggleTheme: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const value = { toggleTheme: colorMode.toggleTheme, theme };

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
