import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  useTheme,
  alpha,
  Paper,
  List,
  ListItem,
  Tooltip,
  Button,
  LinearProgress,
  AvatarGroup,
} from '@mui/material';
import {
  Search,
  Campaign,
  Send,
  Schedule,
  CheckCircle,
  Error,
  Group,
  Message,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  Add,
  Sms,
  Email,
  WhatsApp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

// Dummy broadcast data
const dummyBroadcasts = [
  {
    id: 1,
    title: 'Spring Sale Announcement',
    message: 'Get 50% off on all products! Limited time offer.',
    type: 'sms',
    status: 'completed',
    recipients: 1250,
    delivered: 1235,
    failed: 15,
    scheduledDate: '2026-02-05 10:00:00',
    createdBy: 'John Doe',
    progress: 100,
  },
  {
    id: 2,
    title: 'Product Launch Update',
    message: 'Exciting news! Our new product is launching next week.',
    type: 'email',
    status: 'in-progress',
    recipients: 5000,
    delivered: 3200,
    failed: 50,
    scheduledDate: '2026-02-05 14:30:00',
    createdBy: 'Jane Smith',
    progress: 64,
  },
  {
    id: 3,
    title: 'Holiday Greetings',
    message: 'Wishing you and your family a happy holiday season!',
    type: 'whatsapp',
    status: 'scheduled',
    recipients: 3500,
    delivered: 0,
    failed: 0,
    scheduledDate: '2026-02-10 09:00:00',
    createdBy: 'Mike Johnson',
    progress: 0,
  },
  {
    id: 4,
    title: 'Payment Reminder',
    message: 'Your payment is due. Please complete it to avoid service interruption.',
    type: 'sms',
    status: 'completed',
    recipients: 850,
    delivered: 845,
    failed: 5,
    scheduledDate: '2026-02-03 16:00:00',
    createdBy: 'Sarah Wilson',
    progress: 100,
  },
  {
    id: 5,
    title: 'Weekly Newsletter',
    message: 'Check out our latest blog posts and industry insights.',
    type: 'email',
    status: 'failed',
    recipients: 2000,
    delivered: 500,
    failed: 1500,
    scheduledDate: '2026-02-02 08:00:00',
    createdBy: 'David Brown',
    progress: 25,
  },
  {
    id: 6,
    title: 'Event Invitation',
    message: 'You are invited to our exclusive networking event.',
    type: 'whatsapp',
    status: 'draft',
    recipients: 500,
    delivered: 0,
    failed: 0,
    scheduledDate: null,
    createdBy: 'Emily Davis',
    progress: 0,
  },
];

const BroadcastsPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, in-progress, scheduled, failed, draft
  const [filterType, setFilterType] = useState('all'); // all, sms, email, whatsapp

  const filteredBroadcasts = useMemo(() => {
    return dummyBroadcasts.filter(broadcast => {
      const matchesSearch = broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           broadcast.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           broadcast.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || broadcast.status === filterStatus;
      const matchesType = filterType === 'all' || broadcast.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, filterStatus, filterType]);

  const stats = {
    total: dummyBroadcasts.length,
    completed: dummyBroadcasts.filter(b => b.status === 'completed').length,
    inProgress: dummyBroadcasts.filter(b => b.status === 'in-progress').length,
    scheduled: dummyBroadcasts.filter(b => b.status === 'scheduled').length,
    totalRecipients: dummyBroadcasts.reduce((sum, b) => sum + b.recipients, 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'scheduled':
        return theme.palette.warning.main;
      case 'failed':
        return theme.palette.error.main;
      case 'draft':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 20 }} />;
      case 'in-progress':
        return <PlayArrow sx={{ color: theme.palette.info.main, fontSize: 20 }} />;
      case 'scheduled':
        return <Schedule sx={{ color: theme.palette.warning.main, fontSize: 20 }} />;
      case 'failed':
        return <Error sx={{ color: theme.palette.error.main, fontSize: 20 }} />;
      default:
        return <Edit sx={{ color: theme.palette.grey[500], fontSize: 20 }} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sms':
        return <Sms sx={{ fontSize: 20 }} />;
      case 'email':
        return <Email sx={{ fontSize: 20 }} />;
      case 'whatsapp':
        return <WhatsApp sx={{ fontSize: 20 }} />;
      default:
        return <Message sx={{ fontSize: 20 }} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sms':
        return theme.palette.info.main;
      case 'email':
        return theme.palette.error.main;
      case 'whatsapp':
        return '#25D366'; // WhatsApp green
      default:
        return theme.palette.grey[500];
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
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
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    Broadcast Messages
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {stats.totalRecipients.toLocaleString()} Total Recipients
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.9),
                    },
                  }}
                >
                  Create Broadcast
                </Button>
              </Box>
            </Box>
          </Paper>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Broadcasts', value: stats.total, icon: <Campaign />, color: theme.palette.primary.main },
            { title: 'Completed', value: stats.completed, icon: <CheckCircle />, color: theme.palette.success.main },
            { title: 'In Progress', value: stats.inProgress, icon: <PlayArrow />, color: theme.palette.info.main },
            { title: 'Scheduled', value: stats.scheduled, icon: <Schedule />, color: theme.palette.warning.main },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${stat.color}, ${alpha(stat.color, 0.7)})`,
                    opacity: 0.1,
                    transform: 'translate(30%, -30%)',
                  }}
                />
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${stat.color}, ${alpha(stat.color, 0.8)})`,
                        width: 50,
                        height: 50,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filters */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                placeholder="Search by title, message, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Status:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['all', 'completed', 'in-progress', 'scheduled', 'failed', 'draft'].map((status) => (
                      <Chip
                        key={status}
                        label={status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        onClick={() => setFilterStatus(status)}
                        color={filterStatus === status ? 'primary' : 'default'}
                        sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Type:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {['all', 'sms', 'email', 'whatsapp'].map((type) => (
                      <Chip
                        key={type}
                        label={type.toUpperCase()}
                        onClick={() => setFilterType(type)}
                        color={filterType === type ? 'primary' : 'default'}
                        sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </MotionBox>

        {/* Broadcast List */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          sx={{ borderRadius: 3, overflow: 'hidden' }}
        >
          <List sx={{ p: 0 }}>
            {filteredBroadcasts.map((broadcast, index) => (
              <MotionListItem
                key={broadcast.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  minHeight: 70,
                  borderBottom: index < filteredBroadcasts.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    bgcolor: alpha(getStatusColor(broadcast.status), 0.05),
                  },
                }}
              >
                {/* Left: Icon + Title + Type - Fixed Width */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 400, minWidth: 400 }}>
                  <Avatar
                    sx={{
                      background: `linear-gradient(135deg, ${getTypeColor(broadcast.type)}, ${alpha(getTypeColor(broadcast.type), 0.8)})`,
                      width: 42,
                      height: 42,
                    }}
                  >
                    {React.cloneElement(getTypeIcon(broadcast.type), { sx: { color: '#fff', fontSize: 20 } })}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
                      {broadcast.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                      {broadcast.type.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>

                {/* Center: Stats - Fixed Width */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 550, minWidth: 550, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 120, minWidth: 120 }}>
                    {getStatusIcon(broadcast.status)}
                    <Typography variant="body2" fontWeight={600} color={getStatusColor(broadcast.status)} noWrap>
                      {broadcast.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 80, minWidth: 80 }}>
                    <Group sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {broadcast.recipients.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 80, minWidth: 80 }}>
                    <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
                    <Typography variant="body2" fontWeight={600} color={theme.palette.success.main}>
                      {broadcast.delivered.toLocaleString()}
                    </Typography>
                  </Box>
                  {broadcast.failed > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 70, minWidth: 70 }}>
                      <Error sx={{ fontSize: 16, color: theme.palette.error.main }} />
                      <Typography variant="body2" fontWeight={600} color={theme.palette.error.main}>
                        {broadcast.failed.toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Right: Actions - Fixed Width */}
                <Stack direction="row" spacing={1} sx={{ width: 150, minWidth: 150, justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                        <Edit sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    {broadcast.status === 'in-progress' && (
                      <Tooltip title="Pause">
                        <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                          <Pause sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
              </MotionListItem>
            ))}
          </List>
        </MotionCard>
      </Box>
    </Box>
  );
};

export default BroadcastsPage;
