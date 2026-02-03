import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Divider,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  VideoCall,
  Event as EventIcon,
  AccessTime,
  People,
  Edit,
  Delete,
  Search,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';
import Notification from '../../components/Common/Notification';
import MeetingForm from './components/MeetingForm';
import MeetingDetailsDialog from './components/MeetingDetailsDialog';

const MotionCard = motion.create(Card);

const ConferencePage = () => {
  const theme = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [conferenceSettings, setConferenceSettings] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const currentUser = AuthenticationService.getUserName();

  // Load conference settings
  useEffect(() => {
    loadConferenceSettings();
  }, []);

  // Load meetings
  useEffect(() => {
    loadMeetings();
    const interval = setInterval(loadMeetings, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const loadConferenceSettings = async () => {
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
      if (response.data?.data?.length > 0) {
        setConferenceSettings(response.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to load conference settings:', error);
    }
  };

  const loadMeetings = async () => {
    try {
      const response = await axios.post(
        `${config.api.services}conferenceRoom/listAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      const activeMeetings = response.data?.data?.activeMeeting || [];
      const meetingList = response.data?.data?.meetingList || [];
      const allMeetings = [...activeMeetings, ...meetingList];
      
      setMeetings(allMeetings);
    } catch (error) {
      console.error('Failed to load meetings:', error);
      setMeetings([]);
    }
  };

  const getMeetingStatus = (meeting) => {
    const currentDate = new Date();
    const meetingStart = new Date(`${meeting.meetingScheduledDate}T${meeting.fromTime}`);
    const meetingEnd = new Date(`${meeting.scheduledToDate}T${meeting.toTime}`);

    if (currentDate >= meetingStart && currentDate <= meetingEnd) {
      return { label: 'Active', color: 'success' };
    } else if (currentDate > meetingEnd) {
      return { label: 'Completed', color: 'error' };
    } else {
      return { label: 'Scheduled', color: 'warning' };
    }
  };

  const handleSaveMeeting = async (formData) => {
    try {
      const url = formData.id
        ? `${config.api.services}conferenceRoom/update`
        : `${config.api.services}conferenceRoom/create`;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
        },
      });

      setNotify({
        isOpen: true,
        message: response.data?.messageDetail || 'Meeting saved successfully',
        type: 'success',
      });

      setOpenForm(false);
      setEditData(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to save meeting',
        type: 'error',
      });
    }
  };

  const handleDeleteMeeting = async () => {
    if (!selectedMeeting) return;

    try {
      await axios.post(
        `${config.api.services}conferenceRoom/delete`,
        { id: selectedMeeting.id || selectedMeeting.modId },
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      setNotify({
        isOpen: true,
        message: 'Meeting deleted successfully',
        type: 'success',
      });

      setOpenDetails(false);
      setSelectedMeeting(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to delete meeting',
        type: 'error',
      });
    }
  };

  const handleCancelMeeting = async () => {
    if (!selectedMeeting) return;

    try {
      await axios.post(
        `${config.api.services}conference/update/cancel`,
        { conferenceId: selectedMeeting.id || selectedMeeting.modId },
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      setNotify({
        isOpen: true,
        message: 'Meeting cancelled successfully',
        type: 'success',
      });

      setOpenDetails(false);
      setSelectedMeeting(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      setNotify({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to cancel meeting',
        type: 'error',
      });
    }
  };

  const handleEditMeeting = () => {
    setEditData(selectedMeeting);
    setOpenDetails(false);
    setOpenForm(true);
  };

  const handleRescheduleMeeting = () => {
    setEditData({ ...selectedMeeting, isReschedule: true });
    setOpenDetails(false);
    setOpenForm(true);
  };

  const handleJoinMeeting = (meeting) => {
    console.log('Joining meeting:', meeting);
    setNotify({
      isOpen: true,
      message: 'Joining conference...',
      type: 'info',
    });
  };

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <VideoCall sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Conference Meetings
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Manage and schedule your conference meetings
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditData(null);
                      setOpenForm(true);
                    }}
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                    }}
                  >
                    New Meeting
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Search and Filter */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Meetings List */}
        {filteredMeetings.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No meetings found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? 'Try adjusting your search'
                    : 'Click "New Meeting" to create your first meeting'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredMeetings.map((meeting, index) => {
            const status = getMeetingStatus(meeting);
            return (
              <Grid item xs={12} sm={6} lg={4} key={meeting.id || meeting.modId || index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  elevation={2}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    border: `2px solid ${
                      status.color === 'success'
                        ? theme.palette.success.main
                        : status.color === 'error'
                        ? theme.palette.error.main
                        : theme.palette.warning.main
                    }`,
                    backgroundColor:
                      status.color === 'success'
                        ? alpha(theme.palette.success.main, 0.05)
                        : status.color === 'error'
                        ? alpha(theme.palette.error.main, 0.05)
                        : alpha(theme.palette.warning.main, 0.05),
                  }}
                  onClick={() => {
                    setSelectedMeeting(meeting);
                    setOpenDetails(true);
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ flex: 1, pr: 1 }}>
                        {meeting.roomName}
                      </Typography>
                      <Chip label={status.label} color={status.color} size="small" />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(meeting.meetingScheduledDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {meeting.fromTime} - {meeting.toTime}
                        </Typography>
                      </Box>

                      {meeting.participantList && meeting.participantList.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {meeting.participantList.length} Participants
                          </Typography>
                        </Box>
                      )}

                      {meeting.detail && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {meeting.detail}
                        </Typography>
                      )}
                    </Stack>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {status.label === 'Active' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          fullWidth
                          startIcon={<VideoCall />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinMeeting(meeting);
                          }}
                        >
                          Join Now
                        </Button>
                      )}
                      {status.label === 'Scheduled' && meeting.createdBy === currentUser && (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditData(meeting);
                              setOpenForm(true);
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeeting(meeting);
                              handleDeleteMeeting();
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            );
          })
        )}
      </Grid>

      <MeetingForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        onSave={handleSaveMeeting}
        editData={editData}
        conferenceSettings={conferenceSettings}
      />

      <MeetingDetailsDialog
        open={openDetails}
        onClose={() => {
          setOpenDetails(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting}
        onEdit={handleEditMeeting}
        onDelete={handleDeleteMeeting}
        onReschedule={handleRescheduleMeeting}
        onCancel={handleCancelMeeting}
        onJoin={() => handleJoinMeeting(selectedMeeting)}
        currentUser={currentUser}
      />

      <Notification notify={notify} setNotify={setNotify} />
    </Box>
  );
};

export default ConferencePage;
