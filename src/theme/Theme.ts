// src/theme.ts
import { createTheme, PaletteMode } from "@mui/material";

const typography = {
  fontFamily: ["Inter", "sans-serif"].join(","),
};

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: { main: "#3B82F6" }, // vibrant blue
    secondary: { main: "#8B5CF6" }, // light violet
    background: {
      default: mode === "light" ? "#F9FAFB" : "#0B0B0F", // true black variant
      paper: mode === "light" ? "#FFFFFF" : "#151518", // black shade
    },
    text: {
      primary: mode === "light" ? "#111827" : "#F4F4F5", // off-white
      secondary: mode === "light" ? "#4B5563" : "#A1A1AA", // gray-400
    },
    divider: mode === "light" ? "#E5E7EB" : "#27272A", // black-700
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      300: "#D4D4D4",
      400: "#A3A3A3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717", // great for backgrounds
    },
  },
  typography,
});
