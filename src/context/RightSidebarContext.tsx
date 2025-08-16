import React, { createContext, useContext, useState } from "react";

type RightSidebarContextType = {
  rightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
};

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(
  undefined
);

export const RightSidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rightSidebarOpen, setOpen] = useState(false);

  const toggleRightSidebar = () => setOpen((prev) => !prev);

  return (
    <RightSidebarContext.Provider
      value={{ rightSidebarOpen, toggleRightSidebar }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
};

export const useRightSidebar = (): RightSidebarContextType => {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error("useRightSidebar must be used within RightSidebarProvider");
  }
  return context;
};
