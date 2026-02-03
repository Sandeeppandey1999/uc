import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Avatar,
  Stack,
  Paper,
  useTheme,
  alpha,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  VideoCall,
  ChevronLeft,
  ChevronRight,
  Today,
  AccessTime,
  People,
  Event as EventIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

// Dummy meetings data
const dummyMeetings = [
  {
    id: 1,
    title: 'Team Standup',
    date: new Date(2026, 1, 4),
    startTime: '09:00',
    endTime: '09:30',
    participants: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
    status: 'active',
    description: 'Daily team sync-up meeting',
  },
  {
    id: 2,
    title: 'Product Review',
    date: new Date(2026, 1, 4),
    startTime: '14:00',
    endTime: '15:00',
    participants: ['Alice Brown', 'Bob Wilson'],
    status: 'scheduled',
    description: 'Review new product features',
  },
  {
    id: 3,
    title: 'Client Presentation',
    date: new Date(2026, 1, 5),
    startTime: '11:00',
    endTime: '12:00',
    participants: ['Carol Davis', 'David Lee', 'Eva Martinez'],
    status: 'scheduled',
    description: 'Q1 results presentation',
  },
  {
    id: 4,
    title: 'Design Workshop',
    date: new Date(2026, 1, 6),
    startTime: '10:00',
    endTime: '12:00',
    participants: ['Frank White', 'Grace Taylor'],
    status: 'scheduled',
    description: 'UI/UX design brainstorming',
  },
  {
    id: 5,
    title: 'Sprint Planning',
    date: new Date(2026, 1, 7),
    startTime: '09:30',
    endTime: '11:00',
    participants: ['Henry Anderson', 'Iris Chen', 'Jack Brown'],
    status: 'scheduled',
    description: 'Plan next sprint tasks',
  },
  {
    id: 6,
    title: 'Budget Meeting',
    date: new Date(2026, 1, 10),
    startTime: '15:00',
    endTime: '16:30',
    participants: ['Karen Wilson', 'Leo Martinez'],
    status: 'scheduled',
    description: 'Q1 budget review',
  },
];

const ConferenceCalendarPage = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // day, week, month, year
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get meetings for selected date
  const getMeetingsForDate = (date) => {
    return dummyMeetings.filter(
      (meeting) =>
        meeting.date.getDate() === date.getDate() &&
        meeting.date.getMonth() === date.getMonth() &&
        meeting.date.getFullYear() === date.getFullYear()
    );
  };

  // Get meetings for current week
  const getWeekMeetings = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return dummyMeetings.filter(
      (meeting) => meeting.date >= startOfWeek && meeting.date <= endOfWeek
    );
  };

  // Get meetings for current month
  const getMonthMeetings = () => {
    return dummyMeetings.filter(
      (meeting) =>
        meeting.date.getMonth() === selectedDate.getMonth() &&
        meeting.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get meetings for current year
  const getYearMeetings = () => {
    return dummyMeetings.filter(
      (meeting) => meeting.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'scheduled':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  // Custom day component for calendar
  const ServerDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dayMeetings = getMeetingsForDate(day);
    const hasMeetings = dayMeetings.length > 0;

    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Box {...other} />
        {hasMeetings && !outsideCurrentMonth && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.3,
            }}
          >
            {dayMeetings.slice(0, 3).map((meeting, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(meeting.status),
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Box sx={{ height: 600, overflowY: 'auto' }}>
        {hours.map((hour) => {
          const hourMeetings = selectedDateMeetings.filter((meeting) => {
            const meetingHour = parseInt(meeting.startTime.split(':')[0]);
            return meetingHour === hour;
          });

          return (
            <Box
              key={hour}
              sx={{
                display: 'flex',
                minHeight: 60,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  p: 1,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {hour.toString().padStart(2, '0')}:00
                </Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1, position: 'relative' }}>
                {hourMeetings.map((meeting) => (
                  <MotionBox
                    key={meeting.id}
                    whileHover={{ scale: 1.02 }}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: alpha(getStatusColor(meeting.status), 0.9),
                      borderLeft: `4px solid ${getStatusColor(meeting.status)}`,
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {meeting.title}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      {meeting.startTime} - {meeting.endTime}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      {meeting.participants.length} participants
                    </Typography>
                  </MotionBox>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <Grid container spacing={1}>
        {weekDays.map((day, index) => {
          const dayMeetings = getMeetingsForDate(day);
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth();

          return (
            <Grid item xs key={index}>
              <Paper
                sx={{
                  p: 1,
                  minHeight: 200,
                  backgroundColor: isToday
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'background.paper',
                }}
              >
                <Typography
                  variant="subtitle2"
                  align="center"
                  color={isToday ? 'primary' : 'text.secondary'}
                  gutterBottom
                >
                  {dayNames[day.getDay()]}
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  fontWeight={isToday ? 700 : 500}
                  gutterBottom
                >
                  {day.getDate()}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack spacing={0.5}>
                  {dayMeetings.map((meeting) => (
                    <MotionBox
                      key={meeting.id}
                      whileHover={{ scale: 1.05 }}
                      sx={{
                        p: 0.5,
                        borderRadius: 0.5,
                        backgroundColor: alpha(getStatusColor(meeting.status), 0.2),
                        borderLeft: `3px solid ${getStatusColor(meeting.status)}`,
                        cursor: 'pointer',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                        {meeting.title}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem' }}>
                        {meeting.startTime}
                      </Typography>
                    </MotionBox>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Render Year View
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    return (
      <Grid container spacing={2}>
        {months.map((month) => {
          const monthMeetings = dummyMeetings.filter(
            (meeting) =>
              meeting.date.getMonth() === month &&
              meeting.date.getFullYear() === selectedDate.getFullYear()
          );

          return (
            <Grid item xs={6} sm={4} md={3} key={month}>
              <MotionCard
                whileHover={{ scale: 1.05 }}
                sx={{
                  cursor: 'pointer',
                  border: `1px solid ${theme.palette.divider}`,
                }}
                onClick={() => {
                  const newDate = new Date(selectedDate.getFullYear(), month, 1);
                  setSelectedDate(newDate);
                  setViewMode('month');
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {monthNames[month]}
                  </Typography>
                  {monthMeetings.length > 0 && (
                    <Chip
                      label={`${monthMeetings.length} meetings`}
                      size="small"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </MotionCard>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
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
                        Conference Calendar
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Schedule and manage your conference meetings
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                    }}
                  >
                    New Meeting
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Calendar and Controls */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                {/* View Mode Selector */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
                        else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
                        else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
                        else if (viewMode === 'year') newDate.setFullYear(newDate.getFullYear() - 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                      {viewMode === 'year'
                        ? selectedDate.getFullYear()
                        : selectedDate.toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                            ...(viewMode === 'day' && { day: 'numeric' }),
                          })}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
                        else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
                        else if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
                        else if (viewMode === 'year') newDate.setFullYear(newDate.getFullYear() + 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Today />}
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                  </Box>

                  <ButtonGroup size="small" variant="outlined">
                    <Button
                      variant={viewMode === 'day' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('day')}
                    >
                      Day
                    </Button>
                    <Button
                      variant={viewMode === 'week' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={viewMode === 'month' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('month')}
                    >
                      Month
                    </Button>
                    <Button
                      variant={viewMode === 'year' ? 'contained' : 'outlined'}
                      onClick={() => setViewMode('year')}
                    >
                      Year
                    </Button>
                  </ButtonGroup>
                </Box>

                {/* Calendar Views */}
                {viewMode === 'month' && (
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    slots={{
                      day: ServerDay,
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiPickersDay-root': {
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                )}

                {viewMode === 'day' && renderDayView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'year' && renderYearView()}
              </CardContent>
            </Card>
          </Grid>

          {/* Meetings Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EventIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    {viewMode === 'day'
                      ? "Today's Meetings"
                      : viewMode === 'week'
                      ? 'This Week'
                      : viewMode === 'month'
                      ? 'This Month'
                      : 'This Year'}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List sx={{ p: 0 }}>
                  {(viewMode === 'day'
                    ? selectedDateMeetings
                    : viewMode === 'week'
                    ? getWeekMeetings()
                    : viewMode === 'month'
                    ? getMonthMeetings()
                    : getYearMeetings()
                  ).map((meeting) => (
                    <ListItem key={meeting.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        sx={{
                          borderRadius: 1,
                          border: `2px solid ${getStatusColor(meeting.status)}`,
                          backgroundColor: alpha(getStatusColor(meeting.status), 0.1),
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              {meeting.title}
                            </Typography>
                          }
                          secondary={
                            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EventIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption">
                                  {meeting.date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 14 }} />
                                <Typography variant="caption">
                                  {meeting.startTime} - {meeting.endTime}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <People sx={{ fontSize: 14 }} />
                                <Typography variant="caption">
                                  {meeting.participants.length} participants
                                </Typography>
                              </Box>
                            </Stack>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                {(viewMode === 'day' ? selectedDateMeetings : 
                  viewMode === 'week' ? getWeekMeetings() :
                  viewMode === 'month' ? getMonthMeetings() :
                  getYearMeetings()).length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No meetings scheduled
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ConferenceCalendarPage;
