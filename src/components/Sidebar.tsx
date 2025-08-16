// 📁 src/components/Sidebar.tsx

import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logoDark from "../assets/logo-dark-bg.png";
import logoLight from "../assets/logo-dark-bg.png";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";

// Sidebar items
const sidebarItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: <ShoppingCartIcon fontSize="small" />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <InventoryIcon fontSize="small" />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <GroupIcon fontSize="small" />,
  },
];

const Sidebar: React.FC<{ mode: "full" | "mini" | "hidden" }> = ({ mode }) => {
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const sidebarBg = isDark ? "#0D1117" : "#F9FAFB";
  const selectedBg = isDark ? "#21262D" : "#E5E7EB";
  const hoverBg = isDark ? "#1A1F24" : "#EDF2F7";
  const textColor = isDark ? "#EDEDED" : "#1F2937";

  if (mode === "hidden") return null;

  return (
    <Box
      p={2}
      sx={{
        height: "100%",
        bgcolor: sidebarBg,
        borderRight: isDark ? "1px solid #30363D" : "1px solid #E5E7EB",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      {mode === "full" && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start" // 👈 fix it to the left
          height="100px"
          flexShrink={0}
          pl={2} // 👈 padding-left for spacing
        >
          <img
            src={isDark ? logoDark : logoLight}
            alt="Logo"
            style={{ height: 120, objectFit: "contain" }}
          />
        </Box>
      )}

      {/* Sidebar items */}
      <List>
        {sidebarItems.map((item) => {
          const selected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={selected}
              sx={{
                borderRadius: 2,
                color: textColor,
                gap: mode === "full" ? 1.5 : 0,
                justifyContent: mode === "mini" ? "center" : "flex-start",
                px: mode === "full" ? 2 : 1,
                py: 1,
                mb: 0.5,
                backgroundColor: selected ? selectedBg : "transparent",
                "&:hover": {
                  backgroundColor: hoverBg,
                },
                "& .MuiSvgIcon-root": {
                  color: selected ? theme.palette.primary.main : textColor,
                },
              }}
            >
              {item.icon}
              {mode === "full" && <ListItemText primary={item.label} />}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
