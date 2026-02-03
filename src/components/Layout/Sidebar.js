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
  Stack,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';
import webSocketService from '../../services/WebSocketService';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});

  const fullName = AuthenticationService.getFullName();
  const username = AuthenticationService.getUserName();
  const roles = AuthenticationService.getRoles();

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
      title: 'Settings',
      icon: <Settings />,
      path: '/settings',
      roles: [],
      children: [
        { title: 'Profile', path: '/settings/profile' },
        { title: 'Preferences', path: '/settings/preferences' },
        { title: 'Conference Settings', path: '/settings/conference' },
        { title: 'Security', path: '/settings/security' },
      ],
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
          ? 'linear-gradient(180deg, #1f1f1f 0%, #292929 100%)'
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
        )}
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
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {fullName || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              @{username}
            </Typography>
            {roles.length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={roles[0]}
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
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {menuItems.map((item) => (
          <Box key={item.title}>
            <Tooltip
              title={collapsed ? item.title : ''}
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    '&:hover': {
                      background: theme.palette.primary.main + '15',
                    },
                    justifyContent: collapsed ? 'center' : 'initial',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{ fontWeight: 500 }}
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

            {/* Submenu */}
            {item.children && !collapsed && (
              <Collapse
                in={expandedItems[item.title]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.title} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(child.path);
                          if (onClose) onClose();
                        }}
                        sx={{
                          pl: 4,
                          mx: 1,
                          borderRadius: 2,
                          '&:hover': {
                            background: theme.palette.primary.main + '10',
                          },
                        }}
                      >
                        <ListItemText
                          primary={child.title}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
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
