import React, { createContext, useContext, useState } from "react";

type SidebarMode = "full" | "mini" | "hidden";

interface SidebarContextType {
  sidebarMode: SidebarMode;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("full");

  const toggleSidebar = () => {
    setSidebarMode((prev) =>
      prev === "full" ? "mini" : prev === "mini" ? "hidden" : "full"
    );
  };

  return (
    <SidebarContext.Provider value={{ sidebarMode, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};
