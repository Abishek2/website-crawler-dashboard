import { AppBar, Box, Toolbar, Typography, Button, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

// Header component for top navigation bar
export default function Header() {
  const location = useLocation(); // Get the current path
  const theme = useTheme(); // Access MUI theme for custom styling if needed

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Settings', path: '/settings' },
    { label: 'About', path: '/about' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        background: 'rgba(15, 92, 150, 0.8)', // SAP-like translucent blue
        backdropFilter: 'blur(12px)', // Smooth glassmorphism effect
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)', // Subtle border
        boxShadow: '0 8px 32px 0 rgba(15, 92, 150, 0.2)', // Modern elevation
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between', // Push logo and nav to sides
          px: { xs: 2, sm: 6 },
          minHeight: 72,
        }}
      >
        {/* Logo and app title */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            component="img"
            src={logo}
            alt="WebScan Pro Logo"
            sx={{
              width: 42,
              height: 42,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
              borderRadius: '8px',
            }}
          />
          <Typography
            variant="h6"
            fontWeight={700}
            color="rgba(255,255,255,0.95)"
            sx={{ letterSpacing: 1.2 }}
          >
            WebScan Pro
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box display="flex" gap={3}>
          {navItems.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                component={Link}
                to={path}
                variant={isActive ? 'contained' : 'text'}
                color={isActive ? 'secondary' : 'inherit'}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2,
                  boxShadow: isActive
                    ? '0 4px 12px rgba(255, 255, 255, 0.4)'
                    : 'none',
                  color: isActive
                    ? '#0F5C96'
                    : 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: isActive
                      ? '#dbe9f9'
                      : 'rgba(255, 255, 255, 0.15)',
                    color: isActive ? '#0F5C96' : '#ffffff',
                    boxShadow: isActive
                      ? '0 6px 18px rgba(255, 255, 255, 0.6)'
                      : '0 0 12px rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
