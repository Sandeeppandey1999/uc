import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Zoom,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Add,
  VideoCall,
  People,
  AccessTime,
  Event,
  CalendarToday,
  ViewDay,
  ViewWeek,
  ViewModule,
  DateRange,
  Schedule,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const ConferencePage = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // day, week, month, year
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  // Meeting form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    participants: '',
    isRecurring: false,
  });

  // Mock meetings data
  const meetings = [
    {
      id: 1,
      title: 'Team Standup',
      date: new Date(2026, 1, 4, 10, 0),
      duration: 30,
      participants: ['John', 'Sarah', 'Mike'],
      type: 'video',
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'Client Review',
      date: new Date(2026, 1, 4, 14, 0),
      duration: 60,
      participants: ['Alice', 'Bob'],
      type: 'video',
      color: '#2196F3',
    },
    {
      id: 3,
      title: 'Sprint Planning',
      date: new Date(2026, 1, 5, 11, 0),
      duration: 90,
      participants: ['Team A', 'Team B'],
      type: 'video',
      color: '#FF9800',
    },
    {
      id: 4,
      title: 'Project Kickoff',
      date: new Date(2026, 1, 6, 9, 0),
      duration: 120,
      participants: ['Stakeholders'],
      type: 'video',
      color: '#9C27B0',
    },
  ];

  // Navigation handlers
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Date formatting
  const formatDateHeader = () => {
    const options = { month: 'long', year: 'numeric' };
    
    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'week':
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return currentDate.toLocaleDateString('en-US', options);
      case 'year':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  // Get week start date (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Get meetings for a specific date
  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  // Calendar grid generation
  const generateMonthCalendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push({
        day: null,
        isCurrentMonth: false,
        date: null,
        isEmpty: true,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
        isEmpty: false,
      });
    }

    // Add empty cells to complete the grid (if needed)
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      days.push({
        day: null,
        isCurrentMonth: false,
        date: null,
        isEmpty: true,
      });
    }

    return days;
  }, [currentDate]);

  // Week view generation
  const generateWeekView = useMemo(() => {
    const weekStart = getWeekStart(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    
    return days;
  }, [currentDate]);

  // Year view generation
  const generateYearView = useMemo(() => {
    const year = currentDate.getFullYear();
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      months.push({
        month: i,
        name: new Date(year, i).toLocaleDateString('en-US', { month: 'long' }),
        date: new Date(year, i, 1),
      });
    }
    
    return months;
  }, [currentDate]);

  const handleCreateMeeting = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
    setMeetingForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      participants: '',
      isRecurring: false,
    });
  };

  const handleSubmitMeeting = () => {
    // TODO: API call to create meeting
    handleCloseDialog();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Render different views
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayMeetings = getMeetingsForDate(currentDate);

    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        sx={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}
      >
        <Box sx={{ minHeight: '100%', position: 'relative' }}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: '60px',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                alignItems: 'flex-start',
                px: 2,
                py: 1,
                position: 'relative',
              }}
            >
              <Typography
                variant="caption"
                sx={{ 
                  color: 'text.secondary',
                  minWidth: '60px',
                  fontSize: '0.75rem',
                }}
              >
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </Typography>
              
              {dayMeetings.map((meeting) => {
                const meetingHour = meeting.date.getHours();
                if (meetingHour === hour) {
                  return (
                    <MotionCard
                      key={meeting.id}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        position: 'absolute',
                        left: '100px',
                        right: '20px',
                        backgroundColor: meeting.color,
                        color: 'white',
                        p: 1,
                        cursor: 'pointer',
                        height: `${(meeting.duration / 60) * 60}px`,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {meeting.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {meeting.duration} min • {meeting.participants.length} participants
                      </Typography>
                    </MotionCard>
                  );
                }
                return null;
              })}
            </Box>
          ))}
        </Box>
      </MotionBox>
    );
  };

  const renderWeekView = () => {
    const weekDays = generateWeekView;
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <MotionBox
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        sx={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}
      >
        <Box sx={{ display: 'flex', borderBottom: `2px solid ${theme.palette.divider}` }}>
          <Box sx={{ minWidth: '60px' }} />
          {weekDays.map((day, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 1,
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </Typography>
              <Typography
                variant="h6"
                fontWeight={isToday(day) ? 'bold' : 'normal'}
                sx={{
                  color: isToday(day) ? 'primary.main' : 'text.primary',
                }}
              >
                {day.getDate()}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ minHeight: '100%', position: 'relative' }}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: '60px',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  minWidth: '60px',
                  px: 1,
                  pt: 0.5,
                  fontSize: '0.75rem',
                }}
              >
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </Typography>
              
              {weekDays.map((day, dayIndex) => (
                <Box
                  key={dayIndex}
                  sx={{
                    flex: 1,
                    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    position: 'relative',
                  }}
                >
                  {getMeetingsForDate(day).map((meeting) => {
                    const meetingHour = meeting.date.getHours();
                    if (meetingHour === hour) {
                      return (
                        <MotionCard
                          key={meeting.id}
                          whileHover={{ scale: 1.05 }}
                          sx={{
                            position: 'absolute',
                            inset: '2px',
                            backgroundColor: meeting.color,
                            color: 'white',
                            p: 0.5,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            height: `${(meeting.duration / 60) * 60 - 4}px`,
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
                            {meeting.title}
                          </Typography>
                        </MotionCard>
                      );
                    }
                    return null;
                  })}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </MotionBox>
    );
  };

  const renderMonthView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Week day headers */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            mb: 1,
          }}
        >
          {weekDays.map((day) => (
            <Typography
              key={day}
              variant="subtitle2"
              align="center"
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                py: 1,
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Calendar grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1.5,
          }}
        >
          {generateMonthCalendar.map((dayObj, index) => {
            // Handle empty cells
            if (dayObj.isEmpty) {
              return (
                <Box
                  key={index}
                  sx={{
                    aspectRatio: '1',
                    backgroundColor: 'transparent',
                  }}
                />
              );
            }

            const dayMeetings = getMeetingsForDate(dayObj.date);
            const isCurrentDay = isToday(dayObj.date);
            const isSelectedDay = isSelected(dayObj.date);

            return (
              <MotionPaper
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.08, 
                  zIndex: 10,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
                onClick={() => setSelectedDate(dayObj.date)}
                sx={{
                  aspectRatio: '1',
                  p: 1.5,
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: isSelectedDay
                    ? alpha(theme.palette.primary.main, 0.15)
                    : theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.6)
                    : 'background.paper',
                  border: isCurrentDay
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor: isSelectedDay
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.main,
                  },
                  ...(isCurrentDay && {
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 2,
                      padding: '2px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                  }),
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      variant="body1"
                      fontWeight={isCurrentDay ? '800' : 'bold'}
                      sx={{
                        color: isCurrentDay
                          ? 'primary.main'
                          : dayObj.isCurrentMonth
                          ? 'text.primary'
                          : 'text.secondary',
                        fontSize: isCurrentDay ? '1.1rem' : '1rem',
                      }}
                    >
                      {dayObj.day}
                    </Typography>
                    {dayMeetings.length > 0 && (
                      <Chip
                        label={dayMeetings.length}
                        size="small"
                        sx={{
                          height: '20px',
                          minWidth: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 0.5,
                          },
                        }}
                      />
                    )}
                  </Box>
                  
                  <Stack spacing={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                    {dayMeetings.slice(0, 3).map((meeting, idx) => (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            p: 0.5,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${meeting.color} 0%, ${alpha(meeting.color, 0.8)} 100%)`,
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            boxShadow: `0 2px 8px ${alpha(meeting.color, 0.3)}`,
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateX(2px)',
                              boxShadow: `0 4px 12px ${alpha(meeting.color, 0.4)}`,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                            }}
                          >
                            {meeting.title}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                    {dayMeetings.length > 3 && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.65rem', 
                          color: 'text.secondary',
                          fontWeight: 600,
                          pl: 0.5,
                        }}
                      >
                        +{dayMeetings.length - 3} more
                      </Typography>
                    )}
                  </Stack>
                </Box>
                
                {/* Decorative corner element for days with meetings */}
                {dayMeetings.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: 'solid',
                      borderWidth: '0 24px 24px 0',
                      borderColor: `transparent ${alpha(theme.palette.primary.main, 0.1)} transparent transparent`,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </MotionPaper>
            );
          })}
        </Box>
      </MotionBox>
    );
  };

  const renderYearView = () => {
    return (
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 2,
          }}
        >
          {generateYearView.map((monthObj) => {
            const monthDate = new Date(currentDate.getFullYear(), monthObj.month, 1);
            const monthMeetings = meetings.filter(meeting => {
              const meetingDate = new Date(meeting.date);
              return meetingDate.getMonth() === monthObj.month &&
                     meetingDate.getFullYear() === currentDate.getFullYear();
            });

            return (
              <MotionCard
                key={monthObj.month}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setCurrentDate(monthDate);
                  setViewMode('month');
                }}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {monthObj.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Event fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {monthMeetings.length} {monthMeetings.length === 1 ? 'meeting' : 'meetings'}
                    </Typography>
                  </Box>

                  {monthMeetings.length > 0 && (
                    <Stack spacing={0.5} sx={{ mt: 2 }}>
                      {monthMeetings.slice(0, 3).map((meeting) => (
                        <Box
                          key={meeting.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 0.5,
                            borderRadius: 1,
                            backgroundColor: alpha(meeting.color, 0.1),
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: meeting.color,
                            }}
                          />
                          <Typography variant="caption" sx={{ flex: 1 }}>
                            {meeting.title}
                          </Typography>
                        </Box>
                      ))}
                      {monthMeetings.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{monthMeetings.length - 3} more
                        </Typography>
                      )}
                    </Stack>
                  )}
                </CardContent>
              </MotionCard>
            );
          })}
        </Box>
      </MotionBox>
    );
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
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
        >
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
              onClick={handleCreateMeeting}
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
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.5)}`,
                  transform: 'translateY(-2px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              Create Meeting
            </Button>
          </motion.div>
        </MotionBox>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 1 }}>
          {[
            { 
              icon: <CalendarToday />, 
              value: meetings.length, 
              label: 'Total Meetings',
              color: theme.palette.primary.main,
              gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            },
            { 
              icon: <Today />, 
              value: getMeetingsForDate(new Date()).length, 
              label: "Today's Meetings",
              color: theme.palette.success.main,
              gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            },
            { 
              icon: <AccessTime />, 
              value: '4.5h', 
              label: 'Total Duration',
              color: theme.palette.info.main,
              gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
            },
          ].map((stat, index) => (
            <MotionCard
              key={index}
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
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
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
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: -2,
                        borderRadius: 2.5,
                        background: stat.gradient,
                        opacity: 0.2,
                        filter: 'blur(8px)',
                        zIndex: -1,
                      },
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
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(stat.color, 0.1)} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
            </MotionCard>
          ))}
        </Box>
      </Box>

      {/* Calendar Controls */}
      <MotionCard 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        sx={{ 
          mb: 2.5,
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : 'background.paper',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent sx={{ py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            {/* Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title="Previous" arrow>
                  <IconButton 
                    onClick={() => navigateDate(-1)}
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                      },
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Tooltip title="Jump to Today" arrow>
                  <Button
                    variant="contained"
                    startIcon={<Today />}
                    onClick={goToToday}
                    sx={{
                      textTransform: 'none',
                      minWidth: '120px',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                    }}
                  >
                    Today
                  </Button>
                </Tooltip>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title="Next" arrow>
                  <IconButton 
                    onClick={() => navigateDate(1)}
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                      },
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Tooltip>
              </motion.div>

              <Typography 
                variant="h5" 
                sx={{ 
                  ml: 2, 
                  fontWeight: '800',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatDateHeader()}
              </Typography>
            </Box>

            {/* View Mode Selector */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                p: 0.5,
                borderRadius: 2.5,
                background: alpha(theme.palette.divider, 0.05),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              {[
                { mode: 'day', icon: <ViewDay />, label: 'Day' },
                { mode: 'week', icon: <ViewWeek />, label: 'Week' },
                { mode: 'month', icon: <ViewModule />, label: 'Month' },
                { mode: 'year', icon: <DateRange />, label: 'Year' },
              ].map((view) => (
                <motion.div
                  key={view.mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title={`${view.label} View`} arrow>
                    <Button
                      onClick={() => setViewMode(view.mode)}
                      variant={viewMode === view.mode ? 'contained' : 'text'}
                      sx={{
                        textTransform: 'none',
                        minWidth: '90px',
                        fontWeight: viewMode === view.mode ? 'bold' : 'medium',
                        borderRadius: 2,
                        ...(viewMode === view.mode && {
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          color: 'white',
                        }),
                        ...( viewMode !== view.mode && {
                          color: 'text.secondary',
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.05),
                            color: 'primary.main',
                          },
                        }),
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {React.cloneElement(view.icon, { fontSize: 'small' })}
                        {view.label}
                      </Box>
                    </Button>
                  </Tooltip>
                </motion.div>
              ))}
            </Box>
          </Box>
        </CardContent>
      </MotionCard>

      {/* Calendar Views */}
      <MotionCard 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        sx={{ 
          minHeight: '500px',
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : 'background.paper',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            backgroundSize: '200% 100%',
            animation: 'gradient 3s ease infinite',
          },
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'year' && renderYearView()}
          </AnimatePresence>
        </CardContent>
      </MotionCard>

      {/* Create Meeting Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.95)
              : 'background.paper',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.2)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <VideoCall sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Create New Meeting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule a conference call with your team
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Title"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                placeholder="e.g., Team Standup Meeting"
                InputProps={{
                  startAdornment: <Event sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={meetingForm.description}
                onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                placeholder="Add meeting details, agenda, or notes"
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={meetingForm.date}
                onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                value={meetingForm.startTime}
                onChange={(e) => setMeetingForm({ ...meetingForm, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                value={meetingForm.endTime}
                onChange={(e) => setMeetingForm({ ...meetingForm, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Schedule sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Participants"
                value={meetingForm.participants}
                onChange={(e) => setMeetingForm({ ...meetingForm, participants: e.target.value })}
                placeholder="john@example.com, sarah@example.com"
                helperText="Separate multiple emails with commas"
                InputProps={{
                  startAdornment: <People sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={meetingForm.isRecurring}
                      onChange={(e) => setMeetingForm({ ...meetingForm, isRecurring: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        Recurring Meeting
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        This meeting will repeat on a regular schedule
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: '600',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitMeeting}
            disabled={!meetingForm.title}
            startIcon={<Add />}
            sx={{ 
              textTransform: 'none',
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              '&:disabled': {
                background: alpha(theme.palette.action.disabled, 0.12),
              },
            }}
          >
            Create Meeting
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConferencePage;
