import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Chip,
  Button,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  People,
  FiberManualRecord,
  Phone,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);
const MotionListItem = motion.create(ListItem);

const TodaysMeetingList = ({ meetings, onMeetingClick, onJoinMeeting }) => {
  const theme = useTheme();
  const currentDate = new Date();

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
  };

  const getMeetingStatus = (meeting) => {
    const meetingStart = new Date(`${meeting.meetingScheduledDate}T${meeting.fromTime}`);
    const meetingEnd = new Date(`${meeting.scheduledToDate}T${meeting.toTime}`);

    if (currentDate >= meetingStart && currentDate <= meetingEnd) {
      return { label: 'Active', color: 'success' };
    } else if (currentDate > meetingEnd) {
      return { label: 'Completed', color: 'error' };
    } else {
      return { label: 'Upcoming', color: 'info' };
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      elevation={3}
      sx={{
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Today's Meetings
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {meetings.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No meetings today
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your schedule is clear!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {meetings.map((meeting, index) => {
              const status = getMeetingStatus(meeting);
              const isActive = status.label === 'Active';

              return (
                <MotionListItem
                  key={meeting.id || meeting.modId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  disablePadding
                  sx={{ mb: 2 }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      border: isActive
                        ? `2px solid ${theme.palette.success.main}`
                        : '1px solid',
                      borderColor: isActive
                        ? theme.palette.success.main
                        : alpha(theme.palette.divider, 0.5),
                      backgroundColor: isActive
                        ? alpha(theme.palette.success.main, 0.05)
                        : 'background.paper',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => onMeetingClick(meeting)}
                      sx={{ p: 2 }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {/* Meeting Title and Status */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ flex: 1, pr: 1 }}
                          >
                            {meeting.roomName}
                          </Typography>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                            icon={<FiberManualRecord sx={{ fontSize: 10 }} />}
                          />
                        </Box>

                        {/* Meeting Time */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mb: 1,
                          }}
                        >
                          <AccessTime
                            sx={{ fontSize: 16, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(meeting.fromTime)} -{' '}
                            {formatTime(meeting.toTime)}
                          </Typography>
                        </Box>

                        {/* Participants Count */}
                        {meeting.participantList &&
                          meeting.participantList.length > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mb: 1,
                              }}
                            >
                              <People
                                sx={{ fontSize: 16, color: 'text.secondary' }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {meeting.participantList.length} participants
                              </Typography>
                            </Box>
                          )}

                        {/* Join Button for Active/Upcoming Meetings */}
                        {status.label !== 'Completed' && (
                          <Button
                            fullWidth
                            variant={isActive ? 'contained' : 'outlined'}
                            color={isActive ? 'success' : 'primary'}
                            size="small"
                            startIcon={<Phone />}
                            onClick={(e) => {
                              e.stopPropagation();
                              onJoinMeeting(meeting);
                            }}
                            sx={{ mt: 1 }}
                          >
                            {isActive ? 'Join Now' : 'Join Conference'}
                          </Button>
                        )}
                      </Box>
                    </ListItemButton>
                  </Card>
                </MotionListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </MotionCard>
  );
};

export default TodaysMeetingList;
