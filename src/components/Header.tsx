import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  Box,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  ChevronLeft,
  ChevronRight,
  MoreVert,
  MenuOpen,
} from "@mui/icons-material";
import { useColorMode } from "../context/ColorModeContext";
import { useSidebar } from "../context/SidebarContext";
import { useRightSidebar } from "../context/RightSidebarContext";
import logoLight from "../assets/logo-dark-bg.png";
import logoDark from "../assets/logo-dark-bg.png";

const Header = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { toggleTheme } = useColorMode();
  const { sidebarMode, toggleSidebar } = useSidebar();
  const { toggleRightSidebar } = useRightSidebar();

  const renderSidebarIcon = () => {
    if (sidebarMode === "full") return <ChevronLeft />;
    if (sidebarMode === "mini") return <MoreVert />;
    return <ChevronRight />;
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between", position: "relative" }}>
        {/* Left Sidebar Toggle Button */}
        <Box
          sx={{
            position: "absolute",
            left: -15,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderRadius: "50%",
            boxShadow: 2,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title="Toggle Sidebar">
            <IconButton
              onClick={toggleSidebar}
              size="small"
              sx={{ p: 0.1, color: isDark ? "#e0e0e0" : "#333" }}
            >
              {renderSidebarIcon()}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Logo + Title */}
        <Box display="flex" alignItems="center" gap={1} sx={{ pl: 1 }}>
          {sidebarMode !== "full" && (
            <img
              src={isDark ? logoDark : logoLight}
              alt="Megatron Store"
              style={{ height: 120, objectFit: "contain" }}
            />
          )}
          <Typography variant="h6" fontWeight={600}>
            Megatron Store
          </Typography>
        </Box>

        {/* Right Controls: Theme + Profile + Right Sidebar */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit">
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <Avatar
              sx={{
                bgcolor: isDark ? "primary.dark" : "primary.light",
                width: 32,
                height: 32,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              U
            </Avatar>
          </Tooltip>

          <Tooltip title="Toggle Right Panel">
            <IconButton onClick={toggleRightSidebar} size="small">
              <MenuOpen />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
