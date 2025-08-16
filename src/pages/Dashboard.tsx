// src/pages/Dashboard.tsx
import React from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <SidebarLayout>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid"
          borderColor="divider"
          pb={2}
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
        </Box>

        <Typography>Welcome to Megatron Store Dashboard!</Typography>
      </Box>
    </SidebarLayout>
  );
};

export default Dashboard;
