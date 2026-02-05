import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  alpha,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add,
  VideoCall,
  People,
  AccessTime,
  Event,
  Close as CloseIcon,
  Warning as WarningIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';
import MeetingCalendar from './components/MeetingCalendar';
import MeetingForm from './components/MeetingForm';
import MeetingDetailsDialog from './components/MeetingDetailsDialog';

const MotionCard = motion(Card);

const ConferencePage = () => {
  const theme = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, meeting: null });

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      const response = await axios.post(
        `${config.api.services}conferenceRoom/listAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Conference API Response:', response);
      // API response structure: { status: "OK", data: { meetingList: [...] } }
      if (response.data && response.data.data && response.data.data.meetingList) {
        setMeetings(response.data.data.meetingList);
      } else if (response.data && response.data.meetingList) {
        setMeetings(response.data.meetingList);
      } else {
        setMeetings([]);
      }
    } catch (error) {
      console.error('Failed to load meetings:', error);
      setMeetings([]);
      showNotification('Failed to load meetings', 'error');
    }
  };

  // Calculate stats
  const stats = {
    total: meetings.length,
    today: meetings.filter(m => {
      const today = new Date();
      const meetingDate = new Date(m.meetingScheduledDate);
      return meetingDate.toDateString() === today.toDateString();
    }).length,
    upcoming: meetings.filter(m => new Date(m.meetingScheduledDate) > new Date()).length,
    active: meetings.filter(m => {
      const now = new Date();
      const meetingDate = new Date(m.meetingScheduledDate);
      
      // Check if meeting is today
      if (meetingDate.toDateString() !== now.toDateString()) {
        return false;
      }
      
      // Parse meeting times
      const [fromHour, fromMinute] = m.fromTime.split(':').map(Number);
      const [toHour, toMinute] = m.toTime.split(':').map(Number);
      
      const meetingStart = new Date(meetingDate);
      meetingStart.setHours(fromHour, fromMinute, 0, 0);
      
      const meetingEnd = new Date(meetingDate);
      meetingEnd.setHours(toHour, toMinute, 0, 0);
      
      // Check if current time is between start and end
      return now >= meetingStart && now <= meetingEnd;
    }).length,
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditingMeeting(null);
    setOpenCreateDialog(true);
  };

  const handleEventClick = (meeting) => {
    setSelectedMeeting(meeting);
    setOpenDetailsDialog(true);
  };

  const handleEventDrop = async (updatedMeeting) => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      await axios.post(
        `${config.api.services}conferenceRoom/update`,
        updatedMeeting,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      loadMeetings();
      showNotification('Meeting rescheduled successfully');
    } catch (error) {
      showNotification('Failed to reschedule meeting', 'error');
    }
  };

  const handleEventResize = async (updatedMeeting) => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      await axios.post(
        `${config.api.services}conferenceRoom/update`,
        updatedMeeting,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      loadMeetings();
      showNotification('Meeting duration updated');
    } catch (error) {
      showNotification('Failed to update meeting duration', 'error');
    }
  };

  const handleCreateMeeting = async (meetingData) => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      await axios.post(
        `${config.api.services}conferenceRoom/create`,
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      loadMeetings();
      showNotification('Meeting created successfully');
    } catch (error) {
      showNotification('Failed to create meeting', 'error');
    }
  };

  const handleUpdateMeeting = async (meetingData) => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      await axios.post(
        `${config.api.services}conferenceRoom/update`,
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      loadMeetings();
      showNotification('Meeting updated successfully');
    } catch (error) {
      showNotification('Failed to update meeting', 'error');
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setOpenDetailsDialog(false);
    setOpenCreateDialog(true);
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      const response = await axios.post(
        `${config.api.services}conferenceRoom/delete`,
        { intId: [meetingId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data && response.data.status === 'OK') {
        setDeleteConfirmDialog({ open: false, meeting: null });
        setOpenDetailsDialog(false);
        loadMeetings();
        showNotification('Meeting deleted successfully');
      } else {
        showNotification('Failed to delete meeting', 'error');
      }
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      showNotification('Failed to delete meeting', 'error');
    }
  };

  const handleDeleteClick = (meeting) => {
    setDeleteConfirmDialog({ open: true, meeting });
  };

  const handleJoinMeeting = (meeting) => {
    showNotification('Joining meeting...', 'info');
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        height: '100vh', 
        overflow: 'auto',
        background: theme.palette.mode === 'dark'
          ? `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 50%)`
          : `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 50%)`,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <MotionCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    <VideoCall sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </motion.div>
                <Box>
                  <Typography 
                    variant="h3" 
                    fontWeight="800"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Conference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Schedule and manage your meetings seamlessly
                  </Typography>
                </Box>
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setSelectedDate(null);
                    setEditingMeeting(null);
                    setOpenCreateDialog(true);
                  }}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    '&:hover': {
                      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.5)}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Create Meeting
                </Button>
              </motion.div>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2}>
              {[
                { 
                  icon: <Event />, 
                  value: stats.total, 
                  label: 'Total Meetings',
                  color: theme.palette.primary.main,
                  gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                },
                { 
                  icon: <AccessTime />, 
                  value: stats.today, 
                  label: "Today's Meetings",
                  color: theme.palette.success.main,
                  gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                },
                { 
                  icon: <VideoCall />, 
                  value: stats.active, 
                  label: 'Active Now',
                  color: theme.palette.error.main,
                  gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                },
                { 
                  icon: <People />, 
                  value: stats.upcoming, 
                  label: 'Upcoming',
                  color: theme.palette.info.main,
                  gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ 
                      y: -8, 
                      boxShadow: `0 12px 32px ${alpha(stat.color, 0.3)}`,
                    }}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.6)
                        : 'background.paper',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(stat.color, 0.2)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: stat.gradient,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: stat.gradient,
                            boxShadow: `0 4px 16px ${alpha(stat.color, 0.3)}`,
                          }}
                        >
                          {React.cloneElement(stat.icon, { sx: { color: 'white', fontSize: 28 } })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h4" 
                            fontWeight="800"
                            sx={{
                              background: stat.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              mb: 0.5,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </MotionCard>
      </Box>

      {/* Calendar */}
      <MotionCard 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        sx={{ 
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : 'background.paper',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <MeetingCalendar
            meetings={meetings}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />
        </CardContent>
      </MotionCard>

      {/* Meeting Form Dialog */}
      <MeetingForm
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          setSelectedDate(null);
          setEditingMeeting(null);
        }}
        onSubmit={editingMeeting ? handleUpdateMeeting : handleCreateMeeting}
        meeting={editingMeeting}
        initialDate={selectedDate}
      />

      {/* Meeting Details Dialog */}
      <MeetingDetailsDialog
        open={openDetailsDialog}
        onClose={() => {
          setOpenDetailsDialog(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting}
        onEdit={handleEditMeeting}
        onDelete={handleDeleteClick}
        onJoin={handleJoinMeeting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmDialog.open} 
        onClose={() => setDeleteConfirmDialog({ open: false, meeting: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`
              : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.95)} 100%)`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.error.main, 0.2)}`,
          }
        }}
      >
        {/* Animated Header Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 50%, ${theme.palette.error.main} 100%)`,
            backgroundSize: '200% 100%',
            animation: 'gradient 3s linear infinite',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        />

        <DialogTitle sx={{ pb: 2, pt: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.error.main, 0.4)}`,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <WarningIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight="700" color="error.main">
                Delete Meeting
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setDeleteConfirmDialog({ open: false, meeting: null })}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 3 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Are you sure you want to delete this meeting?
            </Typography>
            {deleteConfirmDialog.meeting && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 1.5, background: alpha(theme.palette.background.paper, 0.8) }}>
                <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
                  {deleteConfirmDialog.meeting.roomName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 {new Date(deleteConfirmDialog.meeting.meetingScheduledDate).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🕒 {deleteConfirmDialog.meeting.fromTime} - {deleteConfirmDialog.meeting.toTime}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              ⚠️ This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirmDialog({ open: false, meeting: null })}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteMeeting(deleteConfirmDialog.meeting?.id)}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              boxShadow: `0 4px 16px ${alpha(theme.palette.error.main, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.5)}`,
                transform: 'translateY(-2px)',
              },
            }}
          >
            Delete Meeting
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConferencePage;
