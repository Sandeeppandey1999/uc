import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Breadcrumbs,
  Link,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  ClickAwayListener,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications,
  DarkMode,
  LightMode,
  Person,
  Description,
  NavigateNext,
  Call,
  Message,
  Close,
  VpnKey,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../theme/ThemeProvider';
import AuthenticationService from '../../services/AuthenticationService';

const MotionPaper = motion(Paper);

const Navbar = ({ onMenuClick, collapsed }) => {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const searchTimeoutRef = useRef(null);
  const displayName = AuthenticationService.getDisplayName();
  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = value.charAt(0).toUpperCase() + value.slice(1);
      return { label, to };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  // Mock search function - Replace with actual API call
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockResults = [
        {
          id: 1,
          type: 'contact',
          icon: <Person />,
          title: 'John Doe',
          subtitle: 'john.doe@example.com',
          path: '/contacts/1',
        },
        {
          id: 2,
          type: 'document',
          icon: <Description />,
          title: 'Meeting Notes.pdf',
          subtitle: 'Documents / 2024',
          path: '/documents/2',
        },
        {
          id: 3,
          type: 'call',
          icon: <Call />,
          title: 'Missed Call',
          subtitle: '+1 234 567 8900 - 2 hours ago',
          path: '/calls/3',
        },
        {
          id: 4,
          type: 'message',
          icon: <Message />,
          title: 'Team Chat',
          subtitle: 'Latest: Project update',
          path: '/messages/4',
        },
      ].filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchClose = () => {
    setShowSearchResults(false);
  };

  const handleSearchResultClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'contact': return theme.palette.primary.main;
      case 'document': return theme.palette.warning.main;
      case 'call': return theme.palette.success.main;
      case 'message': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          left: { md: collapsed ? 72 : 280 },
          width: { md: `calc(100% - ${collapsed ? 72 : 280}px)` },
          transition: theme.transitions.create(['width', 'left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backdropFilter: 'blur(8px)',
          background: alpha(
            theme.palette.background.paper,
            theme.palette.mode === 'dark' ? 0.9 : 0.8
          ),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { md: 'none' },
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Breadcrumbs */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, flex: 1 }}>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ color: theme.palette.text.primary }}
            >
              <Link
                underline="hover"
                color="inherit"
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={crumb.to} color="text.primary" fontWeight={600}>
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.to}
                    underline="hover"
                    color="inherit"
                    href={crumb.to}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(crumb.to);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {crumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>

          <Box sx={{ flex: 1, display: { xs: 'block', sm: 'none' } }} />

          {/* Search Bar */}
          <ClickAwayListener onClickAway={handleSearchClose}>
            <Box sx={{ position: 'relative', mx: 2, maxWidth: 600, flex: { sm: 1, md: 0.5 } }}>
              <Paper
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{
                  p: '4px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.8),
                  border: `1px solid ${theme.palette.divider}`,
                  '&:focus-within': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  transition: 'all 0.2s',
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  sx={{
                    flex: 1,
                    fontSize: '0.9rem',
                    color: theme.palette.text.primary,
                  }}
                />
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.text.primary,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </Paper>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (searchQuery || searchResults.length > 0) && (
                  <MotionPaper
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1,
                      maxHeight: 400,
                      overflowY: 'auto',
                      zIndex: 1000,
                      borderRadius: 2,
                      boxShadow: theme.shadows[8],
                    }}
                  >
                    {searching ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Searching...
                        </Typography>
                      </Box>
                    ) : searchResults.length > 0 ? (
                      <List>
                        {searchResults.map((result) => (
                          <ListItem
                            key={result.id}
                            button
                            onClick={() => handleSearchResultClick(result.path)}
                            sx={{
                              '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: getTypeColor(result.type) }}>
                              {result.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={result.title}
                              secondary={result.subtitle}
                              primaryTypographyProps={{ fontWeight: 500 }}
                            />
                            <Chip
                              label={result.type}
                              size="small"
                              sx={{
                                background: alpha(getTypeColor(result.type), 0.1),
                                color: getTypeColor(result.type),
                                fontWeight: 600,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : searchQuery ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No results found for "{searchQuery}"
                        </Typography>
                      </Box>
                    ) : null}
                  </MotionPaper>
                )}
              </AnimatePresence>
            </Box>
          </ClickAwayListener>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Theme Toggle */}
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            <Tooltip title="Profile">
              <IconButton
                onClick={(e) => setProfileAnchor(e.currentTarget)}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemText
            primary="New message from John"
            secondary="5 minutes ago"
          />
        </MenuItem>
        <MenuItem>
          <ListItemText
            primary="Meeting reminder"
            secondary="10 minutes ago"
          />
        </MenuItem>
        <MenuItem>
          <ListItemText
            primary="Missed call"
            secondary="1 hour ago"
          />
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
      >
        <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings/profile'); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings/change-password'); }}>
          <ListItemIcon>
            <VpnKey fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings/preferences'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Preferences</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
