import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  LinearProgress,
  Zoom,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  VpnKey,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AuthenticationService from '../../services/AuthenticationService';
import Notification from '../Common/Notification';
import config from '../../config/config';

const MotionPaper = motion.create(Paper);
const MotionBox = motion.create(Box);

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const username = location.state?.username;
  const oldPassword = location.state?.oldPassword || ""; // Get old password from login

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  // Redirect if no username
  useEffect(() => {
    if (!username) {
      navigate('/login', { replace: true });
    }
  }, [username, navigate]);

  // Password strength checker
  useEffect(() => {
    const password = formData.newPassword;
    const newValidations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setValidations(newValidations);

    const strength = Object.values(newValidations).filter(Boolean).length;
    setPasswordStrength((strength / 5) * 100);
  }, [formData.newPassword]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setNotify({
        isOpen: true,
        message: 'Passwords do not match!',
        type: 'error',
      });
      return;
    }

    if (passwordStrength < 80) {
      setNotify({
        isOpen: true,
        message: 'Password is too weak. Please meet all requirements.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await AuthenticationService.changePassword({
        username: username,
        oldPassword: oldPassword, // Use old password from login
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setNotify({
        isOpen: true,
        message: 'Password changed successfully! Redirecting to login...',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Change password error:', err);
      setNotify({
        isOpen: true,
        message: err.response?.data?.message || 'Failed to change password. Please try again.',
        type: 'error',
      });
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'error';
    if (passwordStrength < 80) return 'warning';
    return 'success';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 80) return 'Medium';
    return 'Strong';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <MotionPaper
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: 4,
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(18, 18, 18, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Zoom in style={{ transitionDelay: '200ms' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              }}
            >
              <VpnKey sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          </Zoom>

          <Zoom in style={{ transitionDelay: '300ms' }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Change Password
            </Typography>
          </Zoom>

          <Zoom in style={{ transitionDelay: '400ms' }}>
            <Typography variant="body2" color="text.secondary">
              Please set a new password for <strong>{username}</strong>
            </Typography>
          </Zoom>
        </Box>

        <MotionBox
          component="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* New Password Field */}
          <TextField
            fullWidth
            name="newPassword"
            label="New Password"
            type={showPassword.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            required
            disabled={loading}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword({ ...showPassword, new: !showPassword.new })
                    }
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Strength Indicator */}
          <Collapse in={formData.newPassword.length > 0}>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Password Strength
                </Typography>
                <Typography variant="caption" color={`${getStrengthColor()}.main`}>
                  {getStrengthText()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                color={getStrengthColor()}
                sx={{ height: 6, borderRadius: 3 }}
              />

              {/* Password Requirements */}
              <Box sx={{ mt: 2, pl: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Password must contain:
                </Typography>
                {[
                  { key: 'length', text: 'At least 8 characters' },
                  { key: 'uppercase', text: 'One uppercase letter' },
                  { key: 'lowercase', text: 'One lowercase letter' },
                  { key: 'number', text: 'One number' },
                  { key: 'special', text: 'One special character' },
                ].map((req) => (
                  <Box
                    key={req.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: validations[req.key] ? 'success.main' : 'text.secondary',
                      transition: 'color 0.3s',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{req.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Collapse>

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            margin="normal"
            error={
              formData.confirmPassword.length > 0 &&
              formData.newPassword !== formData.confirmPassword
            }
            helperText={
              formData.confirmPassword.length > 0 &&
              formData.newPassword !== formData.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || passwordStrength < 80}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              color: 'white',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              },
              '&.Mui-disabled': {
                background: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center' }}
            >
              {config.application.name} v{config.application.version}
            </Typography>
          </Box>
        </MotionBox>
      </MotionPaper>

      {/* Notification */}
      <Notification notify={notify} setNotify={setNotify} />
    </Box>
  );
};

export default ChangePassword;
