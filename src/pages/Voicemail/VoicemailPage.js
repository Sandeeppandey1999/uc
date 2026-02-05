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
  Stack,
  useTheme,
  alpha,
  Paper,
  List,
  ListItem,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Search,
  Voicemail as VoicemailIcon,
  PlayArrow,
  Delete,
  Pause,
  CheckCircle,
  Error,
  Schedule,
  Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

// Dummy voicemail data
const dummyVoicemails = [
  {
    id: 1,
    from: 'Sarah Williams',
    number: '+1 (555) 123-4567',
    date: '2026-02-05 09:15:00',
    duration: '01:23',
    status: 'unread',
  },
  {
    id: 2,
    from: 'David Brown',
    number: '+1 (555) 987-6543',
    date: '2026-02-04 17:42:00',
    duration: '00:45',
    status: 'read',
  },
  {
    id: 3,
    from: 'Emily Davis',
    number: '+1 (555) 555-7890',
    date: '2026-02-03 13:27:00',
    duration: '02:10',
    status: 'unread',
  },
  {
    id: 4,
    from: 'John Doe',
    number: '+1 (555) 222-3333',
    date: '2026-02-02 08:05:00',
    duration: '00:59',
    status: 'read',
  },
  {
    id: 5,
    from: 'Priya Sharma',
    number: '+91 98765 43210',
    date: '2026-02-01 19:22:00',
    duration: '01:05',
    status: 'unread',
  },
  {
    id: 6,
    from: 'Carlos Mendez',
    number: '+34 600 123 456',
    date: '2026-01-31 11:10:00',
    duration: '03:12',
    status: 'read',
  },
  {
    id: 7,
    from: 'Anna Müller',
    number: '+49 1512 345678',
    date: '2026-01-30 15:45:00',
    duration: '00:38',
    status: 'unread',
  },
  {
    id: 8,
    from: 'Liam O’Connor',
    number: '+353 85 123 4567',
    date: '2026-01-29 08:55:00',
    duration: '02:27',
    status: 'read',
  },
];

const VoicemailPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread

  const filteredVoicemails = useMemo(() => {
    return dummyVoicemails.filter(vm => {
      const matchesSearch =
        vm.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vm.number.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || vm.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'read':
        return theme.palette.success.main;
      case 'unread':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`, p: 3 }}>
      <Box sx={{  mx: 'auto' }}>
        {/* Header */}
        <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <VoicemailIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Voicemail
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {dummyVoicemails.length} Total Messages
              </Typography>
            </Box>
          </Paper>
        </MotionBox>

        {/* Search and Filters */}
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                placeholder="Search by name or number..."
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Status:
                </Typography>
                <Button
                  variant={filterStatus === 'all' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setFilterStatus('all')}
                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'unread' ? 'contained' : 'outlined'}
                  size="small"
                  color="warning"
                  onClick={() => setFilterStatus('unread')}
                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                >
                  Unread
                </Button>
                <Button
                  variant={filterStatus === 'read' ? 'contained' : 'outlined'}
                  size="small"
                  color="success"
                  onClick={() => setFilterStatus('read')}
                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                >
                  Read
                </Button>
              </Box>
            </Stack>
          </Paper>
        </MotionBox>

        {/* Voicemail List */}
        <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {filteredVoicemails.map((vm, index) => (
              <MotionListItem
                key={vm.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  minHeight: 70,
                  borderBottom: index < filteredVoicemails.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: vm.status === 'unread' ? alpha(theme.palette.warning.main, 0.05) : 'background.paper',
                  '&:hover': {
                    bgcolor: alpha(getStatusColor(vm.status), 0.08),
                  },
                }}
              >
                {/* Left: Avatar + Name + Number (fixed width) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 350, minWidth: 350, maxWidth: 350 }}>
                  <Avatar sx={{ bgcolor: vm.status === 'unread' ? theme.palette.warning.main : theme.palette.grey[400], width: 38, height: 38 }}>
                    <Person />
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary" noWrap>
                      {vm.from}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {vm.number}
                    </Typography>
                  </Box>
                </Box>

                {/* Center: Date + Duration (fixed width) */}
                <Box sx={{ width: 450, minWidth: 450, maxWidth: 450, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ width: 200 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap>
                      {formatDateTime(vm.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 120 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Duration: {vm.duration}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 100 }}>
                    <Typography variant="body2" color={getStatusColor(vm.status)} fontWeight={700} noWrap>
                      {vm.status.charAt(0).toUpperCase() + vm.status.slice(1)}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: Actions (fixed width) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 120, minWidth: 120, maxWidth: 120, justifyContent: 'flex-end' }}>
                  <Tooltip title="Play">
                    <IconButton size="small" color="primary">
                      <PlayArrow />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Pause">
                    <IconButton size="small" color="info">
                      <Pause />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </MotionListItem>
            ))}
          </List>
        </MotionCard>
      </Box>
    </Box>
  );
};

export default VoicemailPage;
