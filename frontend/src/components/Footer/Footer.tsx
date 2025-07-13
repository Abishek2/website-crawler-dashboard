import { Box, Typography } from '@mui/material';

// Footer component displayed at the bottom of the application
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto', // Push footer to bottom
        py: 3, // Vertical padding
        px: { xs: 2, sm: 6 }, // Horizontal padding responsive to screen size
        background: 'rgba(15, 92, 150, 0.8)', 
        backdropFilter: 'blur(12px)', // Frosted glass effect
        borderTop: '1px solid rgba(255, 255, 255, 0.15)', // Soft top border
        boxShadow: '0 -8px 32px 0 rgba(15, 92, 150, 0.2)', // Shadow at the top of footer
        textAlign: 'center', // Center-align text
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.85)', // Light font color
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        &copy; {new Date().getFullYear()} <strong>WebScan Pro</strong> — All rights reserved.
      </Typography>
    </Box>
  );
}
