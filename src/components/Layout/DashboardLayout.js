import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed);
  }, [collapsed]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <Navbar
        onMenuClick={handleDrawerToggle}
        collapsed={collapsed}
      />
      
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        collapsed={collapsed}
        onToggleCollapse={handleCollapseToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          height: '100vh',
          overflow: 'auto',
          background: theme => 
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #1f1f1f 0%, #1a1a1a 100%)'
              : 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
