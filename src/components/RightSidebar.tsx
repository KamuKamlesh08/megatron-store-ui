import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";

const RightSidebar = () => {
  const theme = useTheme();

  const items = [
    {
      icon: <PersonPinCircleIcon fontSize="small" />,
      label: "Address",
      value: "Delhi, India",
    },
    {
      icon: <ShoppingCartIcon fontSize="small" />,
      label: "Cart Items",
      value: "3 items",
    },
    {
      icon: <FavoriteIcon fontSize="small" />,
      label: "Wishlist",
      value: "5 items",
    },
    {
      icon: <HomeIcon fontSize="small" />,
      label: "Last Visited",
      value: "Sneakers",
    },
  ];

  return (
    <Box
      width={240}
      sx={{
        height: "70vh",
        position: "sticky", // 🧠 Important to stick it within layout
        top: 0,
        bgcolor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // ✅ Prevent scroll
      }}
    >
      <List disablePadding>
        {items.map((item, idx) => (
          <ListItemButton
            key={idx}
            sx={{
              px: 2.5,
              py: 1.5,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 36, color: theme.palette.text.secondary }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  fontWeight={600}
                  fontSize={14}
                  color={theme.palette.text.primary}
                >
                  {item.label}
                </Typography>
              }
              secondary={
                <Typography fontSize={12} color={theme.palette.text.secondary}>
                  {item.value}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />
      {/* You can add more sections here as needed */}
    </Box>
  );
};

export default RightSidebar;
