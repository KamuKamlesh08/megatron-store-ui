// theme.ts
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3B82F6" }, // Tailwind Blue-500
    secondary: { main: "#6366F1" }, // Tailwind Indigo-500
    background: {
      default: "#F9FAFB", // very soft grey
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827", // almost black
      secondary: "#4B5563", // muted gray
    },
    divider: "#E5E7EB",
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3B82F6" },
    secondary: { main: "#6366F1" },
    background: {
      default: "#111827", // slate-900
      paper: "#1F2937", // slate-800
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#9CA3AF", // cool gray
    },
    divider: "#374151",
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});
