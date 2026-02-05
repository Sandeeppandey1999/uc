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
  Button
} from '@mui/material';
import {
  Search,
  Fax as FaxIcon,
  Send,
  Inbox,
  Drafts,
  Description,
  Download,
  Delete,
  Visibility,
  Add,
  CheckCircle,
  Error,
  Schedule
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

// Dummy fax data
const dummyFaxes = [
  {
    id: 1,
    type: 'received',
    from: '+1 (555) 123-4567',
    to: '+1 (555) 987-6543',
    subject: 'Contract Agreement',
    pages: 5,
    status: 'completed',
    date: '2026-02-05 14:30:00',
    size: '245 KB',
  },
  {
    id: 2,
    type: 'sent',
    from: '+1 (555) 987-6543',
    to: '+1 (555) 456-7890',
    subject: 'Invoice #2024',
    pages: 3,
    status: 'completed',
    date: '2026-02-05 12:15:00',
    size: '189 KB',
  },
  {
    id: 3,
    type: 'received',
    from: '+1 (555) 789-0123',
    to: '+1 (555) 987-6543',
    subject: 'Medical Report',
    pages: 8,
    status: 'completed',
    date: '2026-02-04 16:45:00',
    size: '512 KB',
  },
  {
    id: 4,
    type: 'sent',
    from: '+1 (555) 987-6543',
    to: '+1 (555) 234-5678',
    subject: 'Purchase Order',
    pages: 2,
    status: 'failed',
    date: '2026-02-04 10:20:00',
    size: '98 KB',
  },
  {
    id: 5,
    type: 'draft',
    from: '+1 (555) 987-6543',
    to: '+1 (555) 345-6789',
    subject: 'Legal Document',
    pages: 4,
    status: 'draft',
    date: '2026-02-03 09:00:00',
    size: '320 KB',
  },
];

const FaxPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, received, sent, draft

  const filteredFaxes = useMemo(() => {
    return dummyFaxes.filter(fax => {
      const matchesSearch = fax.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fax.from.includes(searchTerm) ||
                           fax.to.includes(searchTerm);
      const matchesType = filterType === 'all' || fax.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const stats = {
    total: dummyFaxes.length,
    received: dummyFaxes.filter(f => f.type === 'received').length,
    sent: dummyFaxes.filter(f => f.type === 'sent').length,
    draft: dummyFaxes.filter(f => f.type === 'draft').length,
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 20 }} />;
    if (status === 'failed') return <Error sx={{ color: theme.palette.error.main, fontSize: 20 }} />;
    return <Schedule sx={{ color: theme.palette.warning.main, fontSize: 20 }} />;
  };

  const getTypeColor = (type) => {
    if (type === 'received') return theme.palette.info.main;
    if (type === 'sent') return theme.palette.success.main;
    return theme.palette.warning.main;
  };

  const formatDateTime = (dateStr) => {
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
                    Fax Management
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {stats.total} Total Faxes
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
                  Send New Fax
                </Button>
              </Box>
            </Box>
          </Paper>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Faxes', value: stats.total, icon: <FaxIcon />, color: theme.palette.primary.main },
            { title: 'Received', value: stats.received, icon: <Inbox />, color: theme.palette.info.main },
            { title: 'Sent', value: stats.sent, icon: <Send />, color: theme.palette.success.main },
            { title: 'Drafts', value: stats.draft, icon: <Drafts />, color: theme.palette.warning.main },
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
                placeholder="Search by subject, from, or to..."
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
              <Stack direction="row" spacing={1}>
                {['all', 'received', 'sent', 'draft'].map((type) => (
                  <Chip
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    onClick={() => setFilterType(type)}
                    color={filterType === type ? 'primary' : 'default'}
                    sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        </MotionBox>

        {/* Fax List */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          sx={{ borderRadius: 3, overflow: 'hidden' }}
        >
          <List sx={{ p: 0 }}>
            {filteredFaxes.map((fax, index) => (
              <MotionListItem
                key={fax.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  minHeight: 70,
                  borderBottom: index < filteredFaxes.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    bgcolor: alpha(getTypeColor(fax.type), 0.05),
                  },
                }}
              >
                {/* Left: Icon + Details - Fixed Width */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 350, minWidth: 350 }}>
                  <Avatar
                    sx={{
                      background: `linear-gradient(135deg, ${getTypeColor(fax.type)}, ${alpha(getTypeColor(fax.type), 0.8)})`,
                      width: 42,
                      height: 42,
                    }}
                  >
                    <Description sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
                      {fax.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                      {fax.type === 'received' ? `From: ${fax.from}` : `To: ${fax.to}`}
                    </Typography>
                  </Box>
                </Box>

                {/* Center: Info - Fixed Width */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 450, minWidth: 450, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 100, minWidth: 100 }}>
                    <Chip
                      label={fax.type.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: alpha(getTypeColor(fax.type), 0.15),
                        color: getTypeColor(fax.type),
                        fontWeight: 700,
                        fontSize: 9,
                        height: 20,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 80, minWidth: 80 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {fax.pages} pages
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 70, minWidth: 70 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {fax.size}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 80, minWidth: 80 }}>
                    {getStatusIcon(fax.status)}
                    <Typography variant="body2" fontWeight={600} color={fax.status === 'completed' ? theme.palette.success.main : theme.palette.error.main} noWrap>
                      {fax.status === 'completed' ? 'Done' : 'Failed'}
                    </Typography>
                  </Box>
                </Stack>

                {/* Right: Time + Actions - Fixed Width */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                  <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ width: 100, minWidth: 100 }}>
                    {formatDateTime(fax.date)}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View">
                      <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                        <Visibility sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                        <Download sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </MotionListItem>
            ))}
          </List>
        </MotionCard>
      </Box>
    </Box>
  );
};

export default FaxPage;
