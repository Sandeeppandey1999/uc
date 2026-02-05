import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Grid,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  FiberManualRecord as DotIcon,
  Videocam as VideocamIcon,
  Lock as LockIcon,
  FiberManualRecord as RecordIcon,
  Person as PersonIcon,
  Dialpad as DialpadIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const MeetingDetailsDialog = ({ 
  open, 
  onClose, 
  meeting, 
  onEdit, 
  onDelete,
}) => {
  const theme = useTheme();

  if (!meeting) return null;

  const getStatusColor = (status) => {
    if (status === 'Live') return 'success';
    if (status === 'Ended' || status === 'Inactive') return 'error';
    if (status === 'Upcoming') return 'info';
    return 'primary';
  };

  const getStatusLabel = (meeting) => {
    if (!meeting) return 'Scheduled';
    
    const now = new Date();
    const meetingDate = new Date(meeting.meetingScheduledDate);
    const endDate = meeting.scheduledToDate ? new Date(meeting.scheduledToDate) : meetingDate;
    
    // Parse times
    const [fromHour, fromMin] = (meeting.fromTime || '00:00').split(':').map(Number);
    const [toHour, toMin] = (meeting.toTime || '23:59').split(':').map(Number);
    
    // Create start and end datetime
    const startDateTime = new Date(meetingDate);
    startDateTime.setHours(fromHour, fromMin, 0, 0);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(toHour, toMin, 59, 999);
    
    // Check status
    if (now >= startDateTime && now <= endDateTime) {
      return 'Live Now';
    } else if (now < startDateTime) {
      return 'Upcoming';
    } else {
      return 'Ended';
    }
  };

  const formatTime = (time) => {
    if (!time) return time;
    // Replace 00: with 12: at the start of the time string
    return time.replace(/^00:/, '12:');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.95)} 100%)`,
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
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`,
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
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h5" fontWeight="700" gutterBottom sx={{ wordBreak: 'break-word' }}>
              {meeting.roomName || meeting.title}
            </Typography>
            <Chip 
              label={getStatusLabel(meeting)} 
              color={getStatusColor(getStatusLabel(meeting))}
              size="small"
              icon={<DotIcon sx={{ fontSize: 12 }} />}
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 2 }}>
        <Stack spacing={2.5}>
          {/* Meeting Name */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Grid container spacing={2}>
                <Grid item size={8}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <EventIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={0.5}>
                      MEETING NAME
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={700} color="primary">
                    {meeting.roomName || meeting.title}
                  </Typography>
                </Grid>
                <Grid item size={4}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={0.5} 
                    mb={0.5}
                    sx={{ 
                      pl: { xs: 0, md: 2 },
                      borderLeft: { xs: 'none', md: `2px solid ${alpha(theme.palette.divider, 0.2)}` }
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 14, color: theme.palette.secondary.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                      CREATED BY
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={600} 
                    fontSize="0.8rem"
                    sx={{ pl: { xs: 0, md: 2 } }}
                  >
                    {meeting.createdBy === 'uc1' ? 'You' : meeting.createdBy || 'You'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </MotionBox>

          {/* Date & Time Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
              }}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <EventIcon sx={{ fontSize: 20, color: theme.palette.info.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={0.5}>
                      MEETING DATE
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(meeting.meetingScheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </Typography>
                  {meeting.scheduledToDate && meeting.scheduledToDate !== meeting.meetingScheduledDate && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      to {new Date(meeting.scheduledToDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <ScheduleIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={0.5}>
                      MEETING TIME
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {formatTime(meeting.fromTime)} - {formatTime(meeting.toTime)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </MotionBox>

          {/* Conference Details Grid */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Grid container spacing={1.5}>
              {/* Recording Status */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: meeting.recording 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.grey[500], 0.1),
                    border: `1px solid ${alpha(meeting.recording ? theme.palette.success.main : theme.palette.grey[500], 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <RecordIcon sx={{ fontSize: 14, color: meeting.recording ? theme.palette.success.main : theme.palette.grey[500] }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                      RECORDING
                    </Typography>
                  </Box>
                  <Chip 
                    label={meeting.recording ? 'On' : 'Off'}
                    size="small"
                    color={meeting.recording ? 'success' : 'default'}
                    sx={{ fontWeight: 600, fontSize: '0.7rem', height: 20 }}
                  />
                </Paper>
              </Grid>

              {/* Meeting Type */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha(theme.palette.warning.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <DialpadIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                      MEETING TYPE
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
                    {meeting.meetingType || 'Dialer Assisted'}
                  </Typography>
                </Paper>
              </Grid>

              {/* Conference Number */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha(theme.palette.primary.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <LocationIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                      CONFERENCE NO
                    </Typography>
                  </Box>
                  <Chip 
                    label={meeting.didMapping || '100'}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, fontSize: '0.75rem', height: 20 }}
                  />
                </Paper>
              </Grid>

              {/* Access Code */}
              {meeting.accessCode && (
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: alpha(theme.palette.info.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      height: '100%',
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                      <KeyIcon sx={{ fontSize: 14, color: theme.palette.info.main }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                        ACCESS CODE
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={700} color="info.main" fontSize="0.95rem">
                      {meeting.accessCode}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {/* Conference Mode */}
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha(theme.palette.success.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    height: '100%',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <VideocamIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                      CONFERENCE MODE
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
                    { meeting.conferenceType === 'v' ? 'Video' : 'Audio'}
                  </Typography>
                </Paper>
              </Grid>

              {/* Password */}
              {meeting.passwordRequired && (
                <Grid item xs={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: alpha(theme.palette.error.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      height: '100%',
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                      <LockIcon sx={{ fontSize: 14, color: theme.palette.error.main }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={700} fontSize="0.65rem">
                        PASSWORD
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={700} color="error.main" fontSize="0.95rem">
                      {meeting.conferencePassword || '••••••'}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </MotionBox>

          {/* Details */}
          {meeting.detail && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <DescriptionIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={0.5}>
                    MEETING DETAILS
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" lineHeight={1.7}>
                  {meeting.detail}
                </Typography>
              </Paper>
            </MotionBox>
          )}

          {/* Participants */}
          {meeting.participantList && meeting.participantList.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <PeopleIcon sx={{ fontSize: 18, color: theme.palette.success.main }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    PARTICIPANTS ({meeting.participantList.length})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    pr: 0.5,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: alpha(theme.palette.divider, 0.1),
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: alpha(theme.palette.success.main, 0.3),
                      borderRadius: '10px',
                      '&:hover': {
                        background: alpha(theme.palette.success.main, 0.5),
                      },
                    },
                  }}
                >
                  <Stack spacing={1}>
                    {meeting.participantList.map((participant, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1,
                          borderRadius: 1.5,
                          background: alpha(theme.palette.background.paper, 0.8),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: alpha(theme.palette.background.paper, 1),
                            borderColor: alpha(theme.palette.success.main, 0.3),
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: theme.palette.success.main,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {participant.username?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {participant.username}
                          </Typography>
                          {participant.extension && (
                            <Typography variant="caption" color="text.secondary">
                              Ext: {participant.extension}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={participant.memberType === 'U' ? 'User' : 'Guest'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </MotionBox>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Close
        </Button>
        {onEdit && (
          <Button
            onClick={() => {
              onEdit(meeting);
              onClose();
            }}
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                background: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => {
              onDelete(meeting);
              onClose();
            }}
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MeetingDetailsDialog;
