import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
  VpnKey,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AuthenticationService from '../../services/AuthenticationService';
import Notification from '../../components/Common/Notification';

const MotionCard = motion.create(Card);

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const currentUsername = AuthenticationService.getUserName();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
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
        message: 'New passwords do not match!',
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
      await AuthenticationService.changePassword({
        username: currentUsername,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setNotify({
        isOpen: true,
        message: 'Password changed successfully! Please login again.',
        type: 'success',
      });
      setTimeout(() => {
        AuthenticationService.logout();
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setNotify({
        isOpen: true,
        message: err.response?.data?.message || err.response?.data?.messageDetail || 'Failed to change password. Please try again.',
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
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={3}
      >
        <CardContent sx={{ p: 4 }}>
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VpnKey sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your password for <strong>{currentUsername}</strong>
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Old Password Field */}
            <TextField
              fullWidth
              name="oldPassword"
              label="Current Password"
              type={showPassword.old ? 'text' : 'password'}
              value={formData.oldPassword}
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
                        setShowPassword({ ...showPassword, old: !showPassword.old })
                      }
                      edge="end"
                    >
                      {showPassword.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

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
              <Box sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {[
                    { key: 'length', text: '8+ characters' },
                    { key: 'uppercase', text: 'Uppercase' },
                    { key: 'lowercase', text: 'Lowercase' },
                    { key: 'number', text: 'Number' },
                    { key: 'special', text: 'Special char' },
                  ].map((req) => (
                    <Box
                      key={req.key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: validations[req.key] ? 'success.light' : 'action.hover',
                        color: validations[req.key] ? 'success.dark' : 'text.secondary',
                        transition: 'all 0.3s',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 14 }} />
                      <Typography variant="caption" fontWeight={500}>
                        {req.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Collapse>

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
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

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </MotionCard>

      {/* Notification */}
      <Notification notify={notify} setNotify={setNotify} />
    </Box>
  );
};

export default ChangePasswordPage;
