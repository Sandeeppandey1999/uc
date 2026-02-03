import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Avatar,
  Stack,
  Fade,
  Zoom,
  Collapse,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  DarkMode,
  LightMode,
  Palette,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeProvider';
import AuthenticationService from '../../services/AuthenticationService';
import webSocketService from '../../services/WebSocketService';
import Notification from '../Common/Notification';
import config from '../../config/config';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const Login = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, changeThemeStyle } = useTheme();
  const muiTheme = useMuiTheme();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthenticationService.login(
        formData.username,
        formData.password
      );

      if (response.data && response.data.data) {
        // Check if password change is required
        if (response.data.data.passwordChangeRequired || 
            response.data.data.forcePasswordChange ||
            response.data.data.mustChangePassword ||
            response.data.data.requiredChangePassword) {
          
          setNotify({
            isOpen: true,
            message: response.data.messageDetail || 'Password change required. Redirecting...',
            type: 'warning',
          });

          setTimeout(() => {
            navigate('/change-password', { 
              replace: true,
              state: { 
                username: formData.username,
                oldPassword: formData.password // Pass old password for API
              }
            });
          }, 1000);
          return;
        }

        // Normal login flow
        AuthenticationService.storeAuthenticationDetails(response.data.data);
        
        // Connect WebSocket after successful login
        webSocketService.connect();

        setNotify({
          isOpen: true,
          message: 'Login successful! Redirecting...',
          type: 'success',
        });

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      }
    } catch (err) {
      // Check for password change required in error response (HTTP 400)
      if (err.response?.status === 400 && 
          err.response?.data?.data?.requiredChangePassword) {
        
        setNotify({
          isOpen: true,
          message: err.response.data.messageDetail || 'Password change required. Redirecting...',
          type: 'warning',
        });

        setTimeout(() => {
          navigate('/change-password', { 
            replace: true,
            state: { 
              username: formData.username,
              oldPassword: formData.password // Pass old password for API
            }
          });
        }, 1000);
        setLoading(false);
        return;
      }
      
      setNotify({
        isOpen: true,
        message: err.response?.data?.message || err.response?.data?.messageDetail || err.message || 'Login failed. Please check your credentials.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const themeOptions = [
    { value: 'google', label: 'Google', color: '#4285f4' },
    { value: 'modern', label: 'Modern', color: '#611f69' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: darkMode
          ? 'linear-gradient(135deg, #1f1f1f 0%, #292929 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <MotionBox
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: darkMode
            ? 'rgba(66, 133, 244, 0.1)'
            : 'rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <MotionPaper
            elevation={darkMode ? 8 : 24}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            sx={{
              p: 4,
              borderRadius: 4,
              position: 'relative',
              backdropFilter: 'blur(10px)',
              background: darkMode
                ? 'rgba(41, 41, 41, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Theme Controls */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 1,
              }}
            >
              <Zoom in>
                <IconButton
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  size="small"
                  sx={{
                    background: muiTheme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      background: muiTheme.palette.primary.dark,
                    },
                  }}
                >
                  <Palette fontSize="small" />
                </IconButton>
              </Zoom>
              <Zoom in style={{ transitionDelay: '100ms' }}>
                <IconButton
                  onClick={toggleDarkMode}
                  size="small"
                  sx={{
                    background: muiTheme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      background: muiTheme.palette.primary.dark,
                    },
                  }}
                >
                  {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
              </Zoom>
            </Box>

            {/* Theme Selector */}
            <Collapse in={showThemeSelector}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                  Select Theme Style
                </Typography>
                <Stack direction="row" spacing={1}>
                  {themeOptions.map((theme) => (
                    <Button
                      key={theme.value}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        changeThemeStyle(theme.value);
                        setShowThemeSelector(false);
                      }}
                      sx={{
                        borderColor: theme.color,
                        color: theme.color,
                        '&:hover': {
                          borderColor: theme.color,
                          background: `${theme.color}15`,
                        },
                      }}
                    >
                      {theme.label}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Collapse>

            {/* Logo and Title */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Zoom in style={{ transitionDelay: '200ms' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                    boxShadow: muiTheme.shadows[8],
                  }}
                >
                  <LockOutlined sx={{ fontSize: 40 }} />
                </Avatar>
              </Zoom>
              <Zoom in style={{ transitionDelay: '300ms' }}>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight={600}
                  gutterBottom
                  sx={{
                    background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {config.application.name}
                </Typography>
              </Zoom>
              <Zoom in style={{ transitionDelay: '400ms' }}>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue
                </Typography>
              </Zoom>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <MotionBox
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  autoComplete="username"
                  autoFocus
                  required
                  sx={{ mb: 3 }}
                  disabled={loading}
                />
              </MotionBox>

              <MotionBox
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  autoComplete="current-password"
                  required
                  sx={{ mb: 3 }}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </MotionBox>

              <MotionBox
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                    boxShadow: muiTheme.shadows[8],
                    '&:hover': {
                      boxShadow: muiTheme.shadows[12],
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', textAlign: 'center' }}
                >
                  {config.application.name} v{config.application.version}
                </Typography>
              </MotionBox>
            </Box>
          </MotionPaper>
        </Fade>
      </Container>
      <Notification notify={notify} setNotify={setNotify} />
    </Box>
  );
};

export default Login;
