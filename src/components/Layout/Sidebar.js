import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Collapse,
  Chip,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Message,
  Call,
  People,
  Settings,
  Logout,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  VideoCall,
  Fax,
  Campaign,
  Voicemail,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';
import webSocketService from '../../services/WebSocketService';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const fullName = AuthenticationService.getFullName();
  const username = AuthenticationService.getUserName();
  const roles = AuthenticationService.getRoles();
  const extension = AuthenticationService.getExtension();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: [],
    },
    {
      title: 'Messages',
      icon: <Message />,
      path: '/messages',
      roles: [],
      badge: 5,
    },
    {
      title: 'Calls',
      icon: <Call />,
      path: '/calls',
      roles: [],
    },
    {
      title: 'Contacts',
      icon: <People />,
      path: '/contacts',
      roles: [],
    },
    {
      title: 'Conference',
      icon: <VideoCall />,
      path: '/conference',
      roles: [],
    },
    {
      title: 'Fax',
      icon: <Fax />,
      path: '/fax',
      roles: [],
    },
    {
      title: 'Voicemail',
      icon: <Voicemail />,
      path: '/voicemail',
      roles: [],
      badge: 3,
    },
    {
      title: 'Broadcasts',
      icon: <Campaign />,
      path: '/broadcasts',
      roles: [],
    },
    {
      title: 'Conference Settings',
      icon: <Settings />,
      path: '/conference-settings',
      roles: [],
    },
  ];

  const handleItemClick = (item) => {
    if (item.children) {
      // Toggle expansion
      setExpandedItems({
        ...expandedItems,
        [item.title]: !expandedItems[item.title],
      });
      // Also navigate to the parent path if it exists
      if (item.path) {
        navigate(item.path);
        if (onClose) onClose();
      }
    } else {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  const handleLogout = () => {
    webSocketService.disconnect();
    AuthenticationService.logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #1a2035 0%, #1a2035 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {!collapsed && (
        <Box>
          <img src={theme.palette.mode === 'dark' ? "/logoDark.png" : "/logoLight.png"} alt="Coral Logo" style={{ width: '40%', height: '40%' }} />
        </Box>
        )}
        {/* {!collapsed && (
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Coral Telecom
          </Typography>
        )} */}
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          alignItems: 'center',
          gap: collapsed ? 1 : 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Avatar
          sx={{
            width: collapsed ? 40 : 56,
            height: collapsed ? 40 : 56,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: theme.shadows[4],
          }}
        >
          {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        {/* {!collapsed && ( */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'flex-start' }}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {fullName || 'User'}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary" noWrap>
              @{username}
            </Typography> */}
          {!extension === "" && (
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={extension}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  background: theme.palette.primary.main,
                  color: 'white',
                }}
              />
            </Box>
          )}
        </Box>
        {/* )} */}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <Box key={item.title}>
              <Tooltip
                title={collapsed ? item.title : ''}
                placement="right"
                arrow
              >
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleItemClick(item)}
                    selected={selected}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      background: selected ? (theme.palette.mode === 'dark' ? theme.palette.primary.dark + '22' : theme.palette.primary.light + '33') : undefined,
                      '&:hover': {
                        background: theme.palette.primary.main + '15',
                      },
                      justifyContent: collapsed ? 'center' : 'initial',
                      boxShadow: selected ? theme.shadows[2] : undefined,
                      color: selected ? theme.palette.primary.main : undefined,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 40,
                        color: selected ? theme.palette.primary.main : theme.palette.primary.main,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <>
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{ fontWeight: selected ? 700 : 500 }}
                        />
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            color="error"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                        {item.children &&
                          (expandedItems[item.title] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          ))}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Box>
          );
        })}
      </List>

      <Divider />

      {/* Logout Button */}
      <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
        <ListItem disablePadding sx={{ p: 1 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: theme.palette.error.main,
              '&:hover': {
                background: theme.palette.error.main + '15',
              },
              justifyContent: collapsed ? 'center' : 'initial',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 40,
                color: theme.palette.error.main,
              }}
            >
              <Logout />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </Tooltip>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: theme.shadows[4],
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
