import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";

const Login = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 320,
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
        />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
