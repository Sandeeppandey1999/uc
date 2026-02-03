import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  ButtonGroup,
  Grid,
  Chip,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  AccessTime,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const CustomCalendar = ({ meetings = [], onDateClick, onMeetingClick }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // day, week, month, year

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get meetings for a specific date
  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meetingScheduledDate);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get meeting status color
  const getMeetingStatus = (meeting) => {
    const now = new Date();
    const meetingStart = new Date(`${meeting.meetingScheduledDate}T${meeting.fromTime}`);
    const meetingEnd = new Date(`${meeting.scheduledToDate}T${meeting.toTime}`);

    if (now >= meetingStart && now <= meetingEnd) {
      return theme.palette.success.main; // Active
    } else if (now > meetingEnd) {
      return theme.palette.error.main; // Completed
    } else {
      return theme.palette.warning.main; // Scheduled
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'year') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'year') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Render Month View
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (day > daysInMonth) {
          week.push(null);
        } else {
          week.push(day);
          day++;
        }
      }
      days.push(week);
      if (day > daysInMonth) break;
    }

    return (
      <Box>
        {/* Day headers */}
        <Grid container sx={{ mb: 1 }}>
          {dayNames.map((dayName) => (
            <Grid item xs key={dayName} sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                {dayName}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        {days.map((week, weekIndex) => (
          <Grid container key={weekIndex} sx={{ minHeight: 100 }}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return <Grid item xs key={dayIndex} sx={{ border: `1px solid ${theme.palette.divider}` }} />;
              }

              const date = new Date(year, month, day);
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
              const dayMeetings = getMeetingsForDate(date);

              return (
                <Grid
                  item
                  xs
                  key={dayIndex}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1,
                    cursor: 'pointer',
                    backgroundColor: isToday
                      ? alpha(theme.palette.primary.main, 0.05)
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                  onClick={() => onDateClick && onDateClick(date)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight={isToday ? 700 : 500}
                      sx={{
                        color: isToday ? theme.palette.primary.main : 'text.primary',
                      }}
                    >
                      {day}
                    </Typography>
                    {dayMeetings.length > 0 && (
                      <Chip
                        label={dayMeetings.length}
                        size="small"
                        sx={{
                          height: 20,
                          minWidth: 20,
                          fontSize: '0.7rem',
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                        }}
                      />
                    )}
                  </Box>

                  {/* Show meetings */}
                  <Stack spacing={0.5}>
                    {dayMeetings.slice(0, 2).map((meeting, idx) => (
                      <MotionBox
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMeetingClick && onMeetingClick(meeting);
                        }}
                        sx={{
                          p: 0.5,
                          borderRadius: 0.5,
                          backgroundColor: alpha(getMeetingStatus(meeting), 0.2),
                          borderLeft: `3px solid ${getMeetingStatus(meeting)}`,
                          cursor: 'pointer',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                          }}
                        >
                          {meeting.roomName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                          }}
                        >
                          {meeting.fromTime}
                        </Typography>
                      </MotionBox>
                    ))}
                    {dayMeetings.length > 2 && (
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                        +{dayMeetings.length - 2} more
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Box>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Grid container>
          {/* Time column */}
          <Grid item xs={1} sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ height: 60, borderBottom: `1px solid ${theme.palette.divider}` }} />
            {hours.map(hour => (
              <Box
                key={hour}
                sx={{
                  height: 60,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {hour.toString().padStart(2, '0')}:00
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* Days columns */}
          {weekDays.map((day, index) => {
            const isToday =
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear();
            const dayMeetings = getMeetingsForDate(day);

            return (
              <Grid
                item
                xs
                key={index}
                sx={{ borderRight: `1px solid ${theme.palette.divider}` }}
              >
                {/* Day header */}
                <Box
                  sx={{
                    height: 60,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {dayNames[day.getDay()]}
                  </Typography>
                  <Typography variant="h6" fontWeight={isToday ? 700 : 500} color={isToday ? 'primary' : 'text.primary'}>
                    {day.getDate()}
                  </Typography>
                </Box>

                {/* Hours grid */}
                {hours.map(hour => (
                  <Box
                    key={hour}
                    sx={{
                      height: 60,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                    onClick={() => {
                      const clickedDate = new Date(day);
                      clickedDate.setHours(hour, 0, 0, 0);
                      onDateClick && onDateClick(clickedDate);
                    }}
                  />
                ))}

                {/* Meetings overlay */}
                {dayMeetings.map((meeting, idx) => {
                  const [startHour, startMin] = meeting.fromTime.split(':').map(Number);
                  const [endHour, endMin] = meeting.toTime.split(':').map(Number);
                  const top = (startHour * 60 + startMin) / 60 * 60 + 60;
                  const height = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60 * 60;

                  return (
                    <MotionBox
                      key={idx}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick && onMeetingClick(meeting);
                      }}
                      sx={{
                        position: 'absolute',
                        top: `${top}px`,
                        left: 4,
                        right: 4,
                        height: `${Math.max(height, 30)}px`,
                        backgroundColor: alpha(getMeetingStatus(meeting), 0.8),
                        borderLeft: `4px solid ${getMeetingStatus(meeting)}`,
                        borderRadius: 1,
                        p: 0.5,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        color: 'white',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                        {meeting.roomName}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem' }}>
                        {meeting.fromTime} - {meeting.toTime}
                      </Typography>
                    </MotionBox>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayMeetings = getMeetingsForDate(currentDate);

    return (
      <Box>
        <Box sx={{ textAlign: 'center', py: 2, borderBottom: `2px solid ${theme.palette.primary.main}` }}>
          <Typography variant="h5" fontWeight={700}>
            {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {hours.map(hour => (
            <Box
              key={hour}
              sx={{
                display: 'flex',
                borderBottom: `1px solid ${theme.palette.divider}`,
                minHeight: 80,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
              onClick={() => {
                const clickedDate = new Date(currentDate);
                clickedDate.setHours(hour, 0, 0, 0);
                onDateClick && onDateClick(clickedDate);
              }}
            >
              <Box
                sx={{
                  width: 80,
                  p: 1,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {hour.toString().padStart(2, '0')}:00
                </Typography>
              </Box>
              <Box sx={{ flex: 1, position: 'relative' }} />
            </Box>
          ))}

          {/* Meetings overlay */}
          {dayMeetings.map((meeting, idx) => {
            const [startHour, startMin] = meeting.fromTime.split(':').map(Number);
            const [endHour, endMin] = meeting.toTime.split(':').map(Number);
            const top = (startHour * 80) + (startMin / 60 * 80);
            const height = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60 * 80;

            return (
              <MotionBox
                key={idx}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMeetingClick && onMeetingClick(meeting);
                }}
                sx={{
                  position: 'absolute',
                  top: `${top}px`,
                  left: 90,
                  right: 10,
                  height: `${Math.max(height, 40)}px`,
                  backgroundColor: alpha(getMeetingStatus(meeting), 0.9),
                  borderLeft: `5px solid ${getMeetingStatus(meeting)}`,
                  borderRadius: 1,
                  p: 1.5,
                  cursor: 'pointer',
                  color: 'white',
                  boxShadow: theme.shadows[3],
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {meeting.roomName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  <Typography variant="body2">
                    {meeting.fromTime} - {meeting.toTime}
                  </Typography>
                </Box>
                {meeting.detail && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.9 }}>
                    {meeting.detail}
                  </Typography>
                )}
              </MotionBox>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Render Year View
  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <Grid container spacing={2}>
        {months.map(month => {
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const monthMeetings = meetings.filter(meeting => {
            const meetingDate = new Date(meeting.meetingScheduledDate);
            return meetingDate.getMonth() === month && meetingDate.getFullYear() === year;
          });

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={month}>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
                onClick={() => {
                  const newDate = new Date(year, month, 1);
                  setCurrentDate(newDate);
                  setView('month');
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {monthNames[month]}
                    </Typography>
                    {monthMeetings.length > 0 && (
                      <Chip
                        label={monthMeetings.length}
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>

                  {/* Mini calendar */}
                  <Box>
                    <Grid container>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <Grid item xs key={i} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                            {d}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>

                    <Grid container>
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <Grid item xs key={`empty-${i}`} sx={{ aspectRatio: '1', p: 0.2 }} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, day) => {
                        const date = new Date(year, month, day + 1);
                        const hasMeeting = monthMeetings.some(meeting => {
                          const meetingDate = new Date(meeting.meetingScheduledDate);
                          return meetingDate.getDate() === day + 1;
                        });

                        return (
                          <Grid item xs key={day} sx={{ aspectRatio: '1', p: 0.2 }}>
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                backgroundColor: hasMeeting
                                  ? alpha(theme.palette.primary.main, 0.2)
                                  : 'transparent',
                                fontSize: '0.65rem',
                              }}
                            >
                              {day + 1}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const getTitle = () => {
    if (view === 'year') {
      return currentDate.getFullYear();
    } else if (view === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${currentDate.getFullYear()}`;
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={goToPrevious} size="small">
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" fontWeight={600} sx={{ minWidth: 200, textAlign: 'center' }}>
              {getTitle()}
            </Typography>
            <IconButton onClick={goToNext} size="small">
              <ChevronRight />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Today />}
              onClick={goToToday}
            >
              Today
            </Button>
          </Box>

          <ButtonGroup size="small" variant="outlined">
            <Button
              variant={view === 'day' ? 'contained' : 'outlined'}
              onClick={() => setView('day')}
            >
              Day
            </Button>
            <Button
              variant={view === 'week' ? 'contained' : 'outlined'}
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'month' ? 'contained' : 'outlined'}
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'year' ? 'contained' : 'outlined'}
              onClick={() => setView('year')}
            >
              Year
            </Button>
          </ButtonGroup>
        </Box>

        {/* Calendar Content */}
        <Box sx={{ minHeight: 400 }}>
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
          {view === 'year' && renderYearView()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomCalendar;
