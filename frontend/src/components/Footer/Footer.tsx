// src/components/Footer/Footer.tsx
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: { xs: 2, sm: 6 },
        background:
          'rgba(15, 92, 150, 0.8)', // SAP blue translucent
        backdropFilter: 'blur(12px)', // glass blur effect
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow:
          '0 -8px 32px 0 rgba(15, 92, 150, 0.2)', // subtle upward shadow
        textAlign: 'center',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.85)',
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        &copy; {new Date().getFullYear()} <strong>WebScan Pro</strong> — All rights reserved.
      </Typography>
    </Box>
  );
}
