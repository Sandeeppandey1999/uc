import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
  useTheme,
  alpha,
  Paper,
  Divider,
  Button,
  Badge,
} from '@mui/material';
import {
  TrendingUp,
  Call,
  Message,
  People,
  PhoneInTalk,
  PhoneMissed,
  PhoneForwarded,
  PhoneCallback,
  Notifications,
  Speed,
  Assessment,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';
import webSocketService from '../../services/WebSocketService';
import MeetingList from '../Conference/components/MeetingList';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const fullName = AuthenticationService.getFullName();
  const [meetings, setMeetings] = useState([]);
  
  const stats = {
    totalCalls: 145,
    missedCalls: 12,
    dialedCalls: 89,
    receivedCalls: 56,
    messages: 34,
    contacts: 89,
  };

  const selectedDate = new Date();

  useEffect(() => {
    // Load meetings
    loadMeetings();
    
    // Subscribe to real-time updates
    webSocketService.subscribeService(
      'dashboard-stats',
      'all',
      (data) => {
        // Update stats based on WebSocket data
      }
    );

    return () => {
      webSocketService.unsubscribeService('dashboard-stats');
    };
  }, []);

  const loadMeetings = async () => {
    try {
      const token = AuthenticationService.getAuthenticationToken();
      console.log('Dashboard - Loading meetings with token:', token ? 'exists' : 'missing');
      
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
      
      console.log('Dashboard - API Response:', response);
      
      // Handle response structure: { status: "OK", data: { meetingList: [...] } }
      if (response.data && response.data.data && response.data.data.meetingList) {
        console.log('Dashboard - Setting meetings from response.data.data.meetingList:', response.data.data.meetingList);
        setMeetings(response.data.data.meetingList);
      } else if (response.data && response.data.meetingList) {
        console.log('Dashboard - Setting meetings from response.data.meetingList:', response.data.meetingList);
        setMeetings(response.data.meetingList);
      } else {
        console.log('Dashboard - No meetings found in response');
        setMeetings([]);
      }
    } catch (error) {
      console.error('Dashboard - Failed to load meetings:', error);
      setMeetings([]);
    }
  };

  const handleJoinMeeting = (meeting) => {
    navigate('/conference');
  };

  const statCards = [
    {
      title: 'Total Calls',
      value: stats.totalCalls,
      change: '+12%',
      icon: <Call />,
      color: theme.palette.primary.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
    {
      title: 'Missed Calls',
      value: stats.missedCalls,
      change: '-5%',
      icon: <PhoneMissed />,
      color: theme.palette.error.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
    },
    {
      title: 'Dialed Calls',
      value: stats.dialedCalls,
      change: '+8%',
      icon: <PhoneForwarded />,
      color: theme.palette.success.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
    },
    {
      title: 'Received Calls',
      value: stats.receivedCalls,
      change: '+6%',
      icon: <PhoneCallback />,
      color: theme.palette.info.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
    },
    {
      title: 'Messages',
      value: stats.messages,
      change: '+8%',
      icon: <Message />,
      color: theme.palette.warning.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
    },
    {
      title: 'Contacts',
      value: stats.contacts,
      change: '+3%',
      icon: <People />,
      color: theme.palette.secondary.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'call',
      title: 'Incoming Call',
      subtitle: 'John Doe - 5 min ago',
      icon: <PhoneInTalk />,
      status: 'answered',
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      subtitle: 'Jane Smith - 10 min ago',
      icon: <Message />,
      status: 'unread',
    },
    {
      id: 3,
      type: 'call',
      title: 'Missed Call',
      subtitle: 'Bob Wilson - 1 hour ago',
      icon: <PhoneMissed />,
      status: 'missed',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
        {/* Welcome Header with Background */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    Welcome back, {fullName || 'User'}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Here's what's happening with your communications today.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <Notifications />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <Assessment />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Paper>
        </MotionBox>

        {/* Stats Grid */}
        <Grid
          container
          spacing={3}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          sx={{ mb: 4 }}
        >
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <MotionCard
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: theme.shadows[12],
                }}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  height: '100%',
                  bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                  border: theme.palette.mode === 'dark' ? `1px solid ${alpha(card.color, 0.3)}` : 'none',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: card.bgGradient,
                    opacity: 0.1,
                    transform: 'translate(30%, -30%)',
                  }}
                />
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                      sx={{
                        background: card.bgGradient,
                        width: 56,
                        height: 56,
                        boxShadow: theme.shadows[8],
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Chip
                      label={card.change}
                      size="small"
                      icon={<TrendingUp />}
                      sx={{
                        background: alpha(card.color, 0.1),
                        color: card.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {card.title}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} lg={6}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              sx={{ borderRadius: 3, height: '100%', minHeight: 600 }}
            >
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latest updates from your system
                    </Typography>
                  </Box>
                  <Button endIcon={<ArrowForward />} sx={{ textTransform: 'none' }}>
                    View All
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2} sx={{ flex: 1 }}>
                  {recentActivity.map((activity, index) => (
                    <MotionBox
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{
                        x: 8,
                        transition: { duration: 0.2 },
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2.5,
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.5),
                        border: `1px solid ${theme.palette.divider}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.05),
                          borderColor: theme.palette.primary.main,
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          background:
                            activity.status === 'missed'
                              ? `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
                              : activity.status === 'unread'
                              ? `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`
                              : `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.subtitle}
                        </Typography>
                      </Box>
                      <Chip
                        label={activity.status}
                        size="medium"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 600,
                          minWidth: 90,
                        }}
                        color={
                          activity.status === 'missed'
                            ? 'error'
                            : activity.status === 'unread'
                            ? 'info'
                            : 'success'
                        }
                      />
                    </MotionBox>
                  ))}
                </Stack>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* System Status & Today's Summary - Middle Column */}
          <Grid item xs={12} lg={3}>
            <Stack spacing={3}>
              {/* System Status Card */}
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        mr: 2,
                        width: 44,
                        height: 44,
                      }}
                    >
                      <Speed />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        System Status
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Real-time monitoring
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Call Quality
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main">
                          98%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={98}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: alpha(theme.palette.success.main, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Server Uptime
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          99.9%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={99.9}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: alpha(theme.palette.primary.main, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Storage Used
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="warning.main">
                          67%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={67}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: alpha(theme.palette.warning.main, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>

              {/* Today's Summary Card */}
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.light, 0.05)})`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                        mr: 2,
                        width: 44,
                        height: 44,
                      }}
                    >
                      <Assessment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Today's Summary
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Performance metrics
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Active Calls
                      </Typography>
                      <Chip 
                        label="24" 
                        color="primary" 
                        size="small" 
                        sx={{ fontWeight: 700, minWidth: 50 }} 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Avg Duration
                      </Typography>
                      <Chip 
                        label="5:32 min" 
                        color="info" 
                        size="small" 
                        sx={{ fontWeight: 700, minWidth: 50 }} 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Success Rate
                      </Typography>
                      <Chip 
                        label="94%" 
                        color="success" 
                        size="small" 
                        sx={{ fontWeight: 700, minWidth: 50 }} 
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Stack>
          </Grid>

          {/* Calendar and Meetings - Right Column */}
          <Grid item xs={12} lg={3}>
            <Stack spacing={3}>
              {/* Today's Meetings using MeetingList Component */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <MeetingList 
                  meetings={meetings} 
                  onJoin={handleJoinMeeting}
                  maxItems={5}
                />
              </MotionBox>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
