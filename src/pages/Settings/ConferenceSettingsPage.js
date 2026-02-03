import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  LinearProgress,
  useTheme,
  MenuItem,
  Paper,
  Avatar,
  alpha,
} from '@mui/material';
import {
  VideoCall,
  Save,
  Refresh,
  Settings as SettingsIcon,
  People,
  Timer,
  Security,
  VoiceChat,
  MicNone,
  RecordVoiceOver,
  VideoSettings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';
import Notification from '../../components/Common/Notification';

const MotionCard = motion.create(Card);

const ConferenceSettingsPage = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    id: 0,
    conferenceType: '',
    meetingType: '',
    maxParticipants: '',
    beepInterval: '',
    retryCount: '',
    retryDelay: '',
    authenticationRetry: '',
    rptt: false,
    voiceRecognition: false,
    passwordRequired: false,
    nameAnnouncementRequired: false,
    recording: false,
    coralConfGreetingsContent: null,
  });

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  // Load data on component mount
  useEffect(() => {
    loadConferenceSettings();
  }, []);

  const loadConferenceSettings = async () => {
    setLoadingData(true);
    try {
      const response = await axios.post(
        `${config.api.services}conferenceSettings/listAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      if (response.data && response.data.data && response.data.data.length > 0) {
        const settingsData = response.data.data[0];
        setFormData({
          id: settingsData.id || 0,
          conferenceType: settingsData.conferenceType || '',
          meetingType: settingsData.meetingType || '',
          maxParticipants: settingsData.maxParticipants || '',
          beepInterval: settingsData.beepInterval || '',
          retryCount: settingsData.retryCount || '',
          retryDelay: settingsData.retryDelay || '',
          authenticationRetry: settingsData.authenticationRetry || '',
          rptt: settingsData.rptt || false,
          voiceRecognition: settingsData.voiceRecognition || false,
          passwordRequired: settingsData.passwordRequired || false,
          nameAnnouncementRequired: settingsData.nameAnnouncementRequired || false,
          recording: settingsData.recording || false,
          coralConfGreetingsContent: settingsData.coralConfGreetingsContent || null,
        });
      }
    } catch (err) {
      setNotify({
        isOpen: true,
        message: err.response?.data?.message || 'Failed to load conference settings',
        type: 'error',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        retryDelay: formData.retryDelay === '' ? null : formData.retryDelay,
        retryCount: formData.retryCount === '' ? null : formData.retryCount,
        beepInterval: formData.beepInterval === '' ? null : formData.beepInterval,
        maxParticipants: formData.maxParticipants === '' ? null : formData.maxParticipants,
        authenticationRetry: formData.authenticationRetry === '' ? null : formData.authenticationRetry,
      };

      const response = await axios.post(
        `${config.api.services}conferenceSettings/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      setNotify({
        isOpen: true,
        message: response.data?.messageDetail || 'Conference settings updated successfully!',
        type: 'success',
      });

      // Reload data after successful update
      setTimeout(() => {
        loadConferenceSettings();
      }, 1000);
    } catch (err) {
      setNotify({
        isOpen: true,
        message: err.response?.data?.message + ' ' + err.response?.data?.messageDetail || 'Failed to update conference settings',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Loading Conference Settings...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' , p: 3}}>
      <Grid container spacing={3}>
        {/* Header Card */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            elevation={3}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <VideoCall sx={{ fontSize: 50 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Conference Settings
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Configure conference and meeting settings for your organization
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={loadConferenceSettings}
                  disabled={loading || loadingData}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Main Form */}
        <Grid item xs={12} >
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            elevation={3}
          >
            <CardContent sx={{ p: 4 }}>
              {loading && <LinearProgress sx={{ mb: 3 }} />}

              <Box component="form" onSubmit={handleSubmit}>
                {/* Conference Type Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <VideoSettings />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Conference Configuration
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextField
                        fullWidth
                        select
                        label="Conference Mode"
                        name="conferenceType"
                        value={formData.conferenceType}
                        onChange={handleChange}
                        required
                        sx={{ 
                          minWidth: 200,
                          '& .MuiInputBase-root': { height: 56 }
                        }}
                      >
                        <MenuItem value="a">Audio</MenuItem>
                        <MenuItem value="v">Video</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextField
                        fullWidth
                        select
                        label="Conference Type"
                        name="meetingType"
                        value={formData.meetingType}
                        onChange={handleChange}
                        required
                        sx={{ 
                          minWidth: 200,
                          '& .MuiInputBase-root': { height: 56 }
                        }}
                      >
                        <MenuItem value="Dial Assisted">Dial Assisted</MenuItem>
                        <MenuItem value="Meet Me Conference">Meet Me Conference</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Max Participants"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        sx={{ 
                          minWidth: 200,
                          '& .MuiInputBase-root': { height: 56 }
                        }}
                        InputProps={{
                          startAdornment: <People sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Beep Interval (sec)"
                        name="beepInterval"
                        value={formData.beepInterval}
                        onChange={handleChange}
                        sx={{ 
                          minWidth: 200,
                          '& .MuiInputBase-root': { height: 56 }
                        }}
                        InputProps={{
                          startAdornment: <Timer sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Retry Settings Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Refresh />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Retry Configuration
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Retry Count"
                        name="retryCount"
                        value={formData.retryCount}
                        onChange={handleChange}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Retry After (MS)"
                        name="retryDelay"
                        value={formData.retryDelay}
                        onChange={handleChange}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Authentication Retry"
                        name="authenticationRetry"
                        value={formData.authenticationRetry}
                        onChange={handleChange}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Feature Settings Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.info.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <SettingsIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Feature Settings
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.rptt}
                            onChange={handleChange}
                            name="rptt"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MicNone fontSize="small" />
                            <Typography>Required Permission To Talk</Typography>
                          </Box>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.voiceRecognition}
                            onChange={handleChange}
                            name="voiceRecognition"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VoiceChat fontSize="small" />
                            <Typography>Voice Recognition</Typography>
                          </Box>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.passwordRequired}
                            onChange={handleChange}
                            name="passwordRequired"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Security fontSize="small" />
                            <Typography>Password Required</Typography>
                          </Box>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.nameAnnouncementRequired}
                            onChange={handleChange}
                            name="nameAnnouncementRequired"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RecordVoiceOver fontSize="small" />
                            <Typography>Name Announcement Required</Typography>
                          </Box>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.recording}
                            onChange={handleChange}
                            name="recording"
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VideoCall fontSize="small" />
                            <Typography>Recording</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Divider sx={{ my: 3 }} />

                {/* Form Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      <Notification notify={notify} setNotify={setNotify} />
    </Box>
  );
};

export default ConferenceSettingsPage;
