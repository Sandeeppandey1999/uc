import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Chip,
  IconButton,
  alpha,
  useTheme,
  Button,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  FiberManualRecord as DotIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

const MeetingList = ({ meetings = [], onJoin, maxItems = 5 }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Debug logging
  console.log('MeetingList - All meetings received:', meetings);

  // Filter today's meetings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  console.log('Today date:', today.toISOString());
  
  const todaysMeetings = meetings
    .filter(meeting => {
      console.log('Checking meeting:', meeting);
      
      // Handle different date field names
      const dateField = meeting.meetingScheduledDate || meeting.date || meeting.scheduledDate;
      if (!dateField) {
        console.log('No date field found in meeting');
        return false;
      }
      
      const meetingDate = new Date(dateField);
      meetingDate.setHours(0, 0, 0, 0);
      
      console.log('Meeting date:', meetingDate.toISOString(), 'Today:', today.toISOString(), 'Matches:', meetingDate.getTime() === today.getTime());
      
      return meetingDate.getTime() === today.getTime();
    })
    .sort((a, b) => {
      // Sort by fromTime
      const timeA = a.fromTime || '00:00';
      const timeB = b.fromTime || '00:00';
      return timeA.localeCompare(timeB);
    })
    .slice(0, maxItems);

  console.log('Filtered today\'s meetings:', todaysMeetings);

  const formatTime = (time) => {
    if (!time) return '';
    // Replace 00: with 12: at the start of the time string
    return time.replace(/^00:/, '12:');
  };

  const getTimeStatus = (fromTime, toTime) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (currentTime >= fromTime && currentTime <= toTime) {
      return 'Live Now';
    } else if (currentTime < fromTime) {
      // Calculate time until meeting
      const [fromHour, fromMin] = fromTime.split(':').map(Number);
      const [currentHour, currentMin] = currentTime.split(':').map(Number);
      const minutesUntil = (fromHour * 60 + fromMin) - (currentHour * 60 + currentMin);
      
      if (minutesUntil < 60) {
        return `Starts in ${minutesUntil} min`;
      } else {
        const hoursUntil = Math.floor(minutesUntil / 60);
        return `Starts in ${hoursUntil}h`;
      }
    } else {
      return 'Ended';
    }
  };

  const handleMeetingClick = () => {
    navigate('/conference');
  };

  if (todaysMeetings.length === 0) {
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Today's Meetings
          </Typography>
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              No meetings scheduled for today
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <VideoCallIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight="700">
              Today's Meetings
            </Typography>
          </Box>
          <Chip
            label={todaysMeetings.length}
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          />
        </Box>

        <List sx={{ p: 0 }}>
          {todaysMeetings.map((meeting, index) => {
            const timeStatus = getTimeStatus(meeting.fromTime, meeting.toTime);
            const isLive = timeStatus === 'Live Now';

            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  onClick={handleMeetingClick}
                  sx={{
                    borderRadius: 2,
                    mb: 1.5,
                    p: 2,
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.6)
                      : 'white',
                    border: `1px solid ${alpha(
                      isLive ? theme.palette.success.main : theme.palette.divider,
                      isLive ? 0.3 : 0.1
                    )}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="body1" fontWeight="700" color="primary">
                        {meeting.roomName || meeting.title}
                      </Typography>
                      {isLive && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            background: alpha(theme.palette.success.main, 0.15),
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.7 },
                            },
                          }}
                        >
                          <DotIcon 
                            sx={{ 
                              fontSize: 10, 
                              color: theme.palette.success.main,
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            fontWeight="700" 
                            sx={{ color: theme.palette.success.main }}
                          >
                            LIVE
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {formatTime(meeting.fromTime)} - {formatTime(meeting.toTime)}
                        </Typography>
                      </Box>
                      
                      {!isLive && (
                        <Chip
                          label={timeStatus}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: timeStatus === 'Ended' 
                              ? alpha(theme.palette.grey[500], 0.1)
                              : alpha(theme.palette.info.main, 0.1),
                            color: timeStatus === 'Ended'
                              ? theme.palette.grey[500]
                              : theme.palette.info.main,
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <IconButton 
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                  </IconButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>

        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleMeetingClick}
          sx={{
            mt: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            py: 1,
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          View All Meetings
        </Button>
      </CardContent>
    </MotionCard>
  );
};

export default MeetingList;
