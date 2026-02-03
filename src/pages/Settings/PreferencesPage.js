import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Divider,
  Stack,
  Paper,
  useTheme as useMuiTheme,
  alpha,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as AutoModeIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  VolumeUp as VolumeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../theme/ThemeProvider';

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const PreferencesPage = () => {
  const muiTheme = useMuiTheme();
  const { darkMode, toggleDarkMode, currentTheme, changeThemeStyle } = useTheme();
  const [themeMode, setThemeMode] = useState(darkMode ? 'dark' : 'light');
  const [themeStyle, setThemeStyle] = useState(() => {
    if (currentTheme.includes('google')) return 'google';
    if (currentTheme.includes('modern')) return 'modern';
    return 'google';
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    desktop: true,
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setThemeMode(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleThemeChange = (event) => {
    const newMode = event.target.value;
    setThemeMode(newMode);
    if (newMode !== 'auto') {
      const shouldToggle = (newMode === 'dark' && !darkMode) || (newMode === 'light' && darkMode);
      if (shouldToggle) {
        toggleDarkMode();
      }
    }
  };

  const handleThemeStyleChange = (event) => {
    const newStyle = event.target.value;
    setThemeStyle(newStyle);
    changeThemeStyle(newStyle);
  };

  const handleNotificationChange = (type) => (event) => {
    setNotifications({
      ...notifications,
      [type]: event.target.checked,
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your experience
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Theme Style Settings - Google vs Modern */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          sx={{
            background: muiTheme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: muiTheme.shadows[4],
          }}
        >
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${muiTheme.palette.secondary.main}, ${muiTheme.palette.secondary.dark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PaletteIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Theme Style
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Choose your preferred interface style
                </Typography>
              </Box>
            </Stack>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={themeStyle} onChange={handleThemeStyleChange}>
                <Stack spacing={1.5} direction="row">
                  {/* Google Theme */}
                  <MotionPaper
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    elevation={themeStyle === 'google' ? 8 : 2}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      flex: 1,
                      border: themeStyle === 'google' 
                        ? `2px solid ${muiTheme.palette.primary.main}` 
                        : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background: themeStyle === 'google'
                        ? alpha(muiTheme.palette.primary.main, 0.1)
                        : 'transparent',
                    }}
                    onClick={() => handleThemeStyleChange({ target: { value: 'google' } })}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          background: 'linear-gradient(135deg, #4285f4, #1a73e8)',
                          display: 'flex',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white',
                            fontFamily: '"Google Sans", sans-serif',
                          }}
                        >
                          G
                        </Box>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          Google
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Clean and minimal design
                        </Typography>
                      </Box>
                      <Radio
                        checked={themeStyle === 'google'}
                        value="google"
                        sx={{ display: 'none' }}
                      />
                    </Stack>
                  </MotionPaper>

                  {/* Modern Theme */}
                  <MotionPaper
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    elevation={themeStyle === 'modern' ? 8 : 2}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      flex: 1,
                      border: themeStyle === 'modern' 
                        ? `2px solid ${muiTheme.palette.secondary.main}` 
                        : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background: themeStyle === 'modern'
                        ? alpha(muiTheme.palette.secondary.main, 0.1)
                        : 'transparent',
                    }}
                    onClick={() => handleThemeStyleChange({ target: { value: 'modern' } })}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white',
                            fontFamily: '"Inter", sans-serif',
                          }}
                        >
                          M
                        </Box>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          Modern
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Bold contemporary design
                        </Typography>
                      </Box>
                      <Radio
                        checked={themeStyle === 'modern'}
                        value="modern"
                        sx={{ display: 'none' }}
                      />
                    </Stack>
                  </MotionPaper>
                </Stack>
              </RadioGroup>
            </FormControl>
          </CardContent>
        </MotionCard>

        {/* Theme Mode Settings - Light/Dark */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          sx={{
            background: muiTheme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: muiTheme.shadows[4],
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.primary.dark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {darkMode ? <DarkModeIcon sx={{ color: 'white', fontSize: 28 }} /> : <LightModeIcon sx={{ color: 'white', fontSize: 28 }} />}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Theme Mode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Switch between light and dark modes
                </Typography>
              </Box>
            </Stack>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={themeMode} onChange={handleThemeChange}>
                <Stack spacing={2}>
                  {/* Light Theme */}
                  <MotionPaper
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    elevation={themeMode === 'light' ? 8 : 2}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: themeMode === 'light' 
                        ? `2px solid ${muiTheme.palette.primary.main}` 
                        : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background: themeMode === 'light'
                        ? alpha(muiTheme.palette.primary.main, 0.1)
                        : 'transparent',
                    }}
                    onClick={() => handleThemeChange({ target: { value: 'light' } })}
                  >
                    <FormControlLabel
                      value="light"
                      control={<Radio />}
                      label={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #ffd700, #ffa500)',
                              display: 'flex',
                            }}
                          >
                            <LightModeIcon sx={{ color: 'white' }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Light Mode
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Bright and clean interface
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </MotionPaper>

                  {/* Dark Theme */}
                  <MotionPaper
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    elevation={themeMode === 'dark' ? 8 : 2}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: themeMode === 'dark' 
                        ? `2px solid ${muiTheme.palette.primary.main}` 
                        : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background: themeMode === 'dark'
                        ? alpha(muiTheme.palette.primary.main, 0.1)
                        : 'transparent',
                    }}
                    onClick={() => handleThemeChange({ target: { value: 'dark' } })}
                  >
                    <FormControlLabel
                      value="dark"
                      control={<Radio />}
                      label={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #4a5568, #2d3748)',
                              display: 'flex',
                            }}
                          >
                            <DarkModeIcon sx={{ color: 'white' }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Dark Mode
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Easy on the eyes in low light
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </MotionPaper>

                  {/* Auto Theme */}
                  <MotionPaper
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    elevation={themeMode === 'auto' ? 8 : 2}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: themeMode === 'auto' 
                        ? `2px solid ${muiTheme.palette.primary.main}` 
                        : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      background: themeMode === 'auto'
                        ? alpha(muiTheme.palette.primary.main, 0.1)
                        : 'transparent',
                    }}
                    onClick={() => handleThemeChange({ target: { value: 'auto' } })}
                  >
                    <FormControlLabel
                      value="auto"
                      control={<Radio />}
                      label={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              display: 'flex',
                            }}
                          >
                            <AutoModeIcon sx={{ color: 'white' }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Auto Mode
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Follows system preferences
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </MotionPaper>
                </Stack>
              </RadioGroup>
            </FormControl>
          </CardContent>
        </MotionCard>

        {/* Notification Settings */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          sx={{
            background: muiTheme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: muiTheme.shadows[4],
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${muiTheme.palette.info.main}, ${muiTheme.palette.info.dark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <NotificationsIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage notification preferences
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: muiTheme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive updates via email
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.email}
                  onChange={handleNotificationChange('email')}
                  color="primary"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: muiTheme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Push Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get instant push notifications
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.push}
                  onChange={handleNotificationChange('push')}
                  color="primary"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: muiTheme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    SMS Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive text messages for important updates
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.sms}
                  onChange={handleNotificationChange('sms')}
                  color="primary"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: muiTheme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Desktop Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Show notifications on your desktop
                  </Typography>
                </Box>
                <Switch
                  checked={notifications.desktop}
                  onChange={handleNotificationChange('desktop')}
                  color="primary"
                />
              </Box>
            </Stack>
          </CardContent>
        </MotionCard>

        {/* Sound Settings */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          sx={{
            background: muiTheme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: muiTheme.shadows[4],
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${muiTheme.palette.success.main}, ${muiTheme.palette.success.dark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VolumeIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Sound & Audio
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Control sound settings
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                background: muiTheme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.02),
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={500}>
                  Enable Sounds
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Play sounds for notifications and alerts
                </Typography>
              </Box>
              <Switch
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                color="primary"
              />
            </Box>
          </CardContent>
        </MotionCard>

      </Stack>
    </Box>
  );
};

export default PreferencesPage;
