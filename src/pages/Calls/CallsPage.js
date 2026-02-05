import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  Pagination,
  CircularProgress,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Search,
  Call,
  CallMade,
  CallReceived,
  CallMissed,
  Message,
  Info,
  AccessTime,
  Phone,
  PhoneMissed,
  Schedule,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

const CallsPage = () => {
  const theme = useTheme();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('ucDialedTo'); // Default search field
  const [callDirectionFilter, setCallDirectionFilter] = useState('ALL'); // ALL, IN, OUT
  const [missedFilter, setMissedFilter] = useState('ALL'); // ALL, MISSED, NOT_MISSED
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 20;

  // Search field options
  const searchFieldOptions = [
    { value: 'ucDialedTo', label: 'Phone Number' },
    { value: 'ucNumber', label: 'UC Number' },
    { value: 'ucUserId', label: 'User ID' },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Filtered calls based on local filters
  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      // Filter by call direction
      if (callDirectionFilter !== 'ALL' && call.callDirection !== callDirectionFilter) {
        return false;
      }
      
      // Filter by missed calls
      if (missedFilter === 'MISSED' && !call.isMissed) {
        return false;
      }
      if (missedFilter === 'NOT_MISSED' && call.isMissed) {
        return false;
      }
      
      return true;
    });
  }, [calls, callDirectionFilter, missedFilter]);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    try {
      const token = AuthenticationService.getAuthenticationToken();
      const response = await axios.post(
        `${config.api.services}uc/callHistory/list`,
        {
          currentPage: currentPage,
          pageSize: pageSize,
          sortDirection: 'desc',
          sortBy: 'callReceivedOn',
          search: debouncedSearchTerm,
          sortDataType: 'integer',
          advancedFilters: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'OK') {
        const callData = response.data.data.currentPageData;
        setCalls(callData);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalRecords);
      }
    } catch (error) {
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchFieldChange = useCallback((event) => {
    setSearchField(event.target.value);
    setCurrentPage(0);
  }, []);

  const handleCallDirectionChange = useCallback((event, newValue) => {
    if (newValue !== null) {
      setCallDirectionFilter(newValue);
    }
  }, []);

  const handleMissedFilterChange = useCallback((event, newValue) => {
    if (newValue !== null) {
      setMissedFilter(newValue);
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getCallIcon = useCallback((call) => {
    if (call.isMissed) {
      return <CallMissed sx={{ color: theme.palette.error.main }} />;
    }
    if (call.callDirection === 'IN') {
      return <CallReceived sx={{ color: theme.palette.success.main }} />;
    }
    return <CallMade sx={{ color: theme.palette.info.main }} />;
  }, [theme.palette]);

  const getCallColor = useCallback((call) => {
    if (call.isMissed) return theme.palette.error.main;
    if (call.callDirection === 'IN') return theme.palette.success.main;
    return theme.palette.info.main;
  }, [theme.palette]);

  const getCallTypeLabel = useCallback((call) => {
    if (call.isMissed) return 'Missed';
    if (call.callDirection === 'IN') return 'Incoming';
    return 'Outgoing';
  }, []);

  const formatDuration = useCallback((seconds) => {
    if (seconds === 0) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }, []);

  const formatDateTime = useCallback((dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  }), []);

  const statCards = useMemo(() => [
    {
      title: 'Total Calls',
      value: totalRecords,
      icon: <Call />,
      color: theme.palette.primary.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
    {
      title: 'Missed Calls',
      value: filteredCalls.filter(c => c.isMissed).length,
      icon: <PhoneMissed />,
      color: theme.palette.error.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
    },
    {
      title: 'Incoming',
      value: filteredCalls.filter(c => c.callDirection === 'IN').length,
      icon: <CallReceived />,
      color: theme.palette.success.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
    },
    {
      title: 'Outgoing',
      value: filteredCalls.filter(c => c.callDirection === 'OUT').length,
      icon: <CallMade />,
      color: theme.palette.info.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
    },
  ], [filteredCalls, totalRecords, theme.palette]);

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
              mb: 2,
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
                    Call History
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {totalRecords} Total Calls
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                  border: `1px solid ${alpha(card.color, 0.2)}`,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: card.bgGradient,
                    opacity: 0.1,
                    transform: 'translate(30%, -30%)',
                  }}
                />
                <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        background: card.bgGradient,
                        width: 56,
                        height: 56,
                        boxShadow: theme.shadows[4],
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" color="text.secondary" fontWeight={600} gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="h3" fontWeight={700}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Search Bar with Filters */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={3}>
              {/* Search Field Selector and Input */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
                {/* Search Field Selector */}
                <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                  <InputLabel id="search-field-label">Search By</InputLabel>
                  <Select
                    labelId="search-field-label"
                    value={searchField}
                    label="Search By"
                    onChange={handleSearchFieldChange}
                    sx={{
                      borderRadius: 2,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.primary.main, 0.1) 
                        : alpha(theme.palette.primary.main, 0.05),
                    }}
                  >
                    {searchFieldOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Search Input */}
                <TextField
                  fullWidth
                  placeholder={`Search by ${searchFieldOptions.find(opt => opt.value === searchField)?.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>

              {/* Filter Buttons */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                {/* Call Direction Filter */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Call Direction
                  </Typography>
                  <ToggleButtonGroup
                    value={callDirectionFilter}
                    exclusive
                    onChange={handleCallDirectionChange}
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          color: 'white',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="ALL">
                      <Call sx={{ mr: 1, fontSize: 20 }} />
                      All
                    </ToggleButton>
                    <ToggleButton value="IN">
                      <CallReceived sx={{ mr: 1, fontSize: 20 }} />
                      Incoming
                    </ToggleButton>
                    <ToggleButton value="OUT">
                      <CallMade sx={{ mr: 1, fontSize: 20 }} />
                      Outgoing
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Missed Call Filter */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Call Status
                  </Typography>
                  <ToggleButtonGroup
                    value={missedFilter}
                    exclusive
                    onChange={handleMissedFilterChange}
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          color: 'white',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="ALL">
                      <FilterList sx={{ mr: 1, fontSize: 20 }} />
                      All
                    </ToggleButton>
                    <ToggleButton value="MISSED">
                      <CallMissed sx={{ mr: 1, fontSize: 20 }} />
                      Missed
                    </ToggleButton>
                    <ToggleButton value="NOT_MISSED">
                      <Phone sx={{ mr: 1, fontSize: 20 }} />
                      Connected
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>

              {/* Active Filters Summary */}
              {(callDirectionFilter !== 'ALL' || missedFilter !== 'ALL' || searchTerm) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Active Filters:
                  </Typography>
                  {callDirectionFilter !== 'ALL' && (
                    <Chip
                      label={`Direction: ${callDirectionFilter}`}
                      onDelete={() => setCallDirectionFilter('ALL')}
                      size="small"
                      color="primary"
                    />
                  )}
                  {missedFilter !== 'ALL' && (
                    <Chip
                      label={`Status: ${missedFilter === 'MISSED' ? 'Missed' : 'Connected'}`}
                      onDelete={() => setMissedFilter('ALL')}
                      size="small"
                      color="secondary"
                    />
                  )}
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => setSearchTerm('')}
                      size="small"
                    />
                  )}
                  <Chip
                    label="Clear All"
                    onClick={() => {
                      setCallDirectionFilter('ALL');
                      setMissedFilter('ALL');
                      setSearchTerm('');
                    }}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        </MotionBox>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={60} />
              <Typography variant="body1" color="text.secondary">
                Loading call history...
              </Typography>
            </Stack>
          </Box>
        ) : filteredCalls.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Phone sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No calls found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || callDirectionFilter !== 'ALL' || missedFilter !== 'ALL' 
                  ? 'Try adjusting your filters or search term' 
                  : 'No call history available'}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <>
            {/* Filtered Results Summary */}
            {(callDirectionFilter !== 'ALL' || missedFilter !== 'ALL') && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                }}
              >
                <Typography variant="body2" color="info.main" fontWeight={600}>
                  Showing {filteredCalls.length} of {calls.length} calls based on current filters
                </Typography>
              </Paper>
            )}

            {/* Calls List */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                mb: 4,
              }}
            >
              <List
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                sx={{ p: 0 }}
              >
                {filteredCalls.map((call, index) => (
                  <MotionListItem
                    key={call.id}
                    variants={itemVariants}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      borderBottom: index < filteredCalls.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 3,
                      minHeight: 70,
                      '&:hover': {
                        bgcolor: alpha(getCallColor(call), 0.05),
                      },
                    }}
                  >
                    {/* Left: Avatar + Phone Number */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 280, minWidth: 280 }}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${getCallColor(call)}, ${alpha(getCallColor(call), 0.8)})`,
                          width: 42,
                          height: 42,
                          boxShadow: `0 2px 8px ${alpha(getCallColor(call), 0.3)}`,
                        }}
                      >
                        {React.cloneElement(getCallIcon(call), { 
                          sx: { color: '#ffffff', fontSize: 22 } 
                        })}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700}
                          color="text.primary"
                          noWrap
                        >
                          {call.ucDialedTo || 'Unknown'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight={500}
                          color="text.secondary"
                          sx={{ mt: 0.25 }}
                        >
                          UC: {call.ucNumber}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Center: Duration & Date Time */}
                    <Stack 
                      direction="row" 
                      spacing={3} 
                      alignItems="center" 
                      sx={{ 
                        width: 350,
                        minWidth: 350,
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime 
                          sx={{ 
                            fontSize: 16, 
                            color: 'text.secondary',
                          }} 
                        />
                        <Typography 
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {formatDuration(call.callDuration)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule 
                          sx={{ 
                            fontSize: 16, 
                            color: 'text.secondary',
                          }} 
                        />
                        <Typography 
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {formatDateTime(call.callReceivedOn)}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Right: Action Buttons */}
                    <Stack direction="row" spacing={1} sx={{ width: 120, minWidth: 120, justifyContent: 'flex-end' }}>
                      <Tooltip title="Call Back">
                        <IconButton
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.2),
                            },
                          }}
                        >
                          <Call sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Message">
                        <IconButton
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.2),
                            },
                          }}
                        >
                          <Message sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Details">
                        <IconButton
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.text.secondary, 0.05),
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.text.secondary, 0.1),
                            },
                          }}
                        >
                          <Info sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </MotionListItem>
                ))}
              </List>
            </MotionCard>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Paper>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CallsPage;
