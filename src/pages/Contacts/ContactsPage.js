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
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Call,
  Message,
  VideoCall,
  MoreVert,
  Person,
  Business,
  Phone,
  Home,
  Smartphone,
  Circle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const ContactsPage = () => {
  const theme = useTheme();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name'); // Default search field
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 30; // Show 30 contacts (5 rows of 6)

  // Search field options
  const searchFieldOptions = [
    { value: 'name', label: 'Name' },
    { value: 'offEXtn', label: 'Office Extension' },
    { value: 'phoneOffice', label: 'Office Phone' },
    { value: 'mobileNumber', label: 'Mobile Number' },
    { value: 'phoneHome', label: 'Home Phone' },
    { value: 'designation', label: 'Designation' },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // Reset to first page on search
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const token = AuthenticationService.getAuthenticationToken();

      const response = await axios.post(
        `${config.api.services}uc/phoneBook/list`,
        {
          currentPage: currentPage,
          pageSize: pageSize,
          sortDirection: 'desc',
          sortBy: searchField,
          search: debouncedSearchTerm, 
          sortDataType: 'string',
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
        setContacts(response.data.data.currentPageData);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, searchField]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchFieldChange = useCallback((event) => {
    setSearchField(event.target.value);
    setCurrentPage(0); // Reset to first page on field change
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getStatusColor = useCallback((userStatus) => {
    if (userStatus === null || userStatus === undefined) return theme.palette.grey[500];
    if (userStatus === 0) return theme.palette.error.main; // Offline
    if (userStatus === 1) return theme.palette.success.main; // Online
    if (userStatus === 2) return theme.palette.warning.main; // Busy
    return theme.palette.grey[500];
  }, [theme.palette]);

  const getStatusLabel = useCallback((userStatus) => {
    if (userStatus === null || userStatus === undefined) return 'Unknown';
    if (userStatus === 0) return 'Offline';
    if (userStatus === 1) return 'Available';
    if (userStatus === 2) return 'Busy';
    return 'Unknown';
  }, []);

  const getContactInitials = useCallback((name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);

  const getContactColor = useCallback((type) => {
    if (type === 'UCUsers') return theme.palette.primary.main;
    if (type === 'SystemExt') return theme.palette.info.main;
    return theme.palette.secondary.main;
  }, [theme.palette]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02, // Reduced from 0.05 for faster animation
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }), []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1800, mx: 'auto' }}>
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
                    Contacts
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {totalRecords} Total Contacts
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </MotionBox>

        {/* Search Bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
          </Paper>
        </MotionBox>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={60} />
              <Typography variant="body1" color="text.secondary">
                Loading contacts...
              </Typography>
            </Stack>
          </Box>
        ) : contacts.length === 0 ? (
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
              <Typography variant="h6" gutterBottom>
                No contacts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try a different search term' : 'No contacts available'}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <>
            {/* Contacts Grid */}
            <Grid
              container
              spacing={3}
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              sx={{ mb: 4 }}
            >
              {contacts.map((contact, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={contact.id}>
                  <MotionCard
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: theme.shadows[8],
                    }}
                    transition={{ duration: 0.2 }}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 3,
                      height: '100%',
                      bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                      border: `1px solid ${alpha(getContactColor(contact.type), 0.2)}`,
                      transition: 'all 0.2s',
                      willChange: 'transform',
                      '&:hover': {
                        borderColor: getContactColor(contact.type),
                      },
                    }}
                  >
                    {/* Top Color Bar */}
                    <Box
                      sx={{
                        height: 4,
                        background: `linear-gradient(90deg, ${getContactColor(contact.type)}, ${alpha(getContactColor(contact.type), 0.5)})`,
                      }}
                    />

                    <CardContent sx={{ p: 3 }}>
                      {/* Avatar and Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Circle
                              sx={{
                                width: 14,
                                height: 14,
                                color: getStatusColor(contact.userStatus),
                                border: `2px solid ${theme.palette.background.paper}`,
                                borderRadius: '50%',
                              }}
                            />
                          }
                        >
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              background: `linear-gradient(135deg, ${getContactColor(contact.type)}, ${alpha(getContactColor(contact.type), 0.7)})`,
                              fontSize: 24,
                              fontWeight: 700,
                            }}
                          >
                            {contact.name ? getContactInitials(contact.name) : <Person />}
                          </Avatar>
                        </Badge>
                        <Chip
                          label={contact.type === 'UCUsers' ? 'User' : 'System'}
                          size="small"
                          sx={{
                            background: alpha(getContactColor(contact.type), 0.1),
                            color: getContactColor(contact.type),
                            fontWeight: 600,
                            fontSize: 10,
                          }}
                        />
                      </Box>

                      {/* Contact Info */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                          {contact.name || contact.designation || 'Unknown'}
                        </Typography>
                        {contact.designation && contact.name && (
                          <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                            {contact.designation}
                          </Typography>
                        )}
                        <Chip
                          label={getStatusLabel(contact.userStatus)}
                          size="small"
                          sx={{
                            mt: 1,
                            background: alpha(getStatusColor(contact.userStatus), 0.1),
                            color: getStatusColor(contact.userStatus),
                            fontWeight: 600,
                            fontSize: 11,
                          }}
                        />
                      </Box>

                      {/* Contact Details */}
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {contact.offEXtn && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              Ext: {contact.offEXtn}
                            </Typography>
                          </Box>
                        )}
                        {contact.phoneOffice && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {contact.phoneOffice}
                            </Typography>
                          </Box>
                        )}
                        {contact.mobileNumber && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Smartphone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {contact.mobileNumber}
                            </Typography>
                          </Box>
                        )}
                        {contact.phoneHome && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {contact.phoneHome}
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            sx={{
                              flex: 1,
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                              },
                            }}
                          >
                            <Call fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Video Call">
                          <IconButton
                            size="small"
                            sx={{
                              flex: 1,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.info.main, 0.2),
                              },
                            }}
                          >
                            <VideoCall fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Message">
                          <IconButton
                            size="small"
                            sx={{
                              flex: 1,
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              color: theme.palette.warning.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                              },
                            }}
                          >
                            <Message fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More">
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.text.secondary, 0.05),
                              color: 'text.secondary',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                              },
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>

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

export default ContactsPage;
