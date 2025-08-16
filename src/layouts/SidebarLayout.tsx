// 1. SidebarLayout.tsx
import React, { useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RightSidebar from "../components/RightSidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import {
  RightSidebarProvider,
  useRightSidebar,
} from "../context/RightSidebarContext";

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const { sidebarMode } = useSidebar();
  const { rightSidebarOpen } = useRightSidebar();
  const isResizing = useRef(false);
  const theme = useTheme();

  const startResize = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing.current && sidebarMode === "full") {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 400) setSidebarWidth(newWidth);
    }
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  const getSidebarWidth = () => {
    if (sidebarMode === "hidden") return 0;
    if (sidebarMode === "mini") return 60;
    return sidebarWidth;
  };

  const rightSidebarWidth = rightSidebarOpen ? 300 : 0;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Header />

      <Box display="flex" flex={1} overflow="hidden">
        {/* Left Sidebar */}
        <Box
          width={getSidebarWidth()}
          sx={{
            transition: "width 0.2s ease",
            borderRight: sidebarMode !== "hidden" ? "1px solid #ccc" : "none",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Sidebar mode={sidebarMode} />
        </Box>

        {/* Resizer */}
        {sidebarMode === "full" && (
          <Box
            onMouseDown={startResize}
            sx={{
              width: "5px",
              cursor: "col-resize",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "#ddd" },
            }}
          />
        )}

        {/* Main Content */}
        <Box flex={1} overflow="auto" p={2}>
          {children}
        </Box>

        {/* Right Sidebar */}
        <Box
          width={rightSidebarWidth}
          sx={{
            transition: "width 0.3s ease",
            borderLeft: rightSidebarOpen ? "1px solid #ccc" : "none",
            bgcolor: "background.paper",
            overflow: "auto",
          }}
        >
          {rightSidebarOpen && <RightSidebar />}
        </Box>
      </Box>
    </Box>
  );
};

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </RightSidebarProvider>
    </SidebarProvider>
  );
};

export default SidebarLayout;
