import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add,
  Apartment,
  Badge,
  Business,
  Call,
  ContactMail,
  DeleteOutline,
  Edit,
  Email,
  Favorite,
  FavoriteBorder,
  Home,
  Person,
  Phone,
  Refresh,
  Search,
} from '@mui/icons-material';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const initialFormValue = {
  id: 0,
  firstName: '',
  designation: '',
  phoneHome: '',
  addressOne: '',
  phoneOffice: '',
  addressTwo: '',
  company: '',
  faxNumber: '',
  emailId: '',
};

const PersonalContactsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('firstName');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [favoriteFilter, setFavoriteFilter] = useState('all');
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [formValue, setFormValue] = useState(initialFormValue);
  const [selectedContact, setSelectedContact] = useState(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notify, setNotify] = useState({ type: 'success', message: '' });

  const showNotification = useCallback((type, message) => {
    setNotify({ type, message });
    setNotifyOpen(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchColumn]);

  const searchOptions = [
    { value: 'firstName', label: 'Name', type: 'string' },
    { value: 'designation', label: 'Designation', type: 'string' },
    { value: 'company', label: 'Company', type: 'string' },
    { value: 'phoneOffice', label: 'Office Phone', type: 'string' },
    { value: 'phoneHome', label: 'Home Phone', type: 'string' },
    { value: 'emailId', label: 'Email', type: 'string' },
  ];

  const selectedSearchOption =
    searchOptions.find((option) => option.value === searchColumn) || searchOptions[0];

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const token = AuthenticationService.getAuthenticationToken();
      const response = await axios.post(
        `${config.api.services}ownPhoneBook/list`,
        {
          currentPage,
          pageSize,
          sortDirection: 'asc',
          sortBy: searchColumn,
          search: debouncedSearchTerm,
          sortDataType: selectedSearchOption.type,
          advancedFilters: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response?.data?.data;
      const list = Array.isArray(responseData?.currentPageData)
        ? responseData.currentPageData
        : Array.isArray(responseData)
          ? responseData
          : Array.isArray(response?.data)
            ? response.data
            : [];

      const calculatedTotalRecords =
        typeof responseData?.totalRecords === 'number'
          ? responseData.totalRecords
          : list.length;
      const calculatedTotalPages =
        typeof responseData?.totalPages === 'number'
          ? responseData.totalPages
          : Math.ceil(calculatedTotalRecords / pageSize);

      setRows(
        list.map((item, index) => ({
          id: item.id ?? index + 1,
          favorite: Boolean(item.favorite),
          ...item,
        }))
      );
      setTotalRecords(calculatedTotalRecords);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      setRows([]);
      setTotalRecords(0);
      setTotalPages(0);
      showNotification('error', 'Failed to load personal contacts.');
    } finally {
      setLoading(false);
    }
  }, [showNotification, currentPage, pageSize, debouncedSearchTerm, searchColumn, selectedSearchOption.type]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleFieldChange = (field) => (event) => {
    setFormValue((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleOpenCreate = () => {
    setFormValue(initialFormValue);
    setSelectedContact(null);
    setOpenCreate(true);
  };

  const handleOpenEdit = (contact) => {
    setSelectedContact(contact);
    setFormValue({
      id: contact.id ?? 0,
      firstName: contact.firstName ?? '',
      designation: contact.designation ?? '',
      phoneHome: contact.phoneHome ?? '',
      addressOne: contact.addressOne ?? '',
      phoneOffice: contact.phoneOffice ?? '',
      addressTwo: contact.addressTwo ?? '',
      company: contact.company ?? '',
      faxNumber: contact.faxNumber ?? '',
      emailId: contact.emailId ?? '',
    });
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    if (!saving) {
      setOpenCreate(false);
      setFormValue(initialFormValue);
      setSelectedContact(null);
    }
  };

  const handleOpenDelete = (contact) => {
    setSelectedContact(contact);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDelete = () => {
    if (!saving) {
      setOpenDeleteConfirm(false);
      setSelectedContact(null);
    }
  };

  const isCreateDisabled =
    !formValue.firstName.trim() ||
    !formValue.phoneOffice.trim();

  const handleSaveContact = async () => {
    if (isCreateDisabled) {
      showNotification('error', 'Name, company, office phone and email are required.');
      return;
    }

    setSaving(true);
    try {
      const token = AuthenticationService.getAuthenticationToken();
      const isEditMode = Boolean(formValue.id && formValue.id !== 0);
      await axios.post(
        `${config.api.services}ownPhoneBook/${isEditMode ? 'update' : 'create'}`,
        {
          id: isEditMode ? formValue.id : 0,
          ...formValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showNotification('success', `Contact ${isEditMode ? 'updated' : 'created'} successfully.`);
      setOpenCreate(false);
      setFormValue(initialFormValue);
      setSelectedContact(null);
      await loadContacts();
    } catch (error) {
      showNotification('error', 'Failed to save contact.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact?.id) {
      showNotification('error', 'Invalid contact selected.');
      return;
    }

    setSaving(true);
    try {
      const token = AuthenticationService.getAuthenticationToken();
      await axios.post(
        `${config.api.services}ownPhoneBook/delete`,
        { id: [selectedContact.id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showNotification('success', 'Contact deleted successfully.');
      setOpenDeleteConfirm(false);
      setSelectedContact(null);
      await loadContacts();
    } catch (error) {
      showNotification('error', 'Failed to delete contact.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFavorite = async (contact) => {
    if (!contact?.id) {
      showNotification('error', 'Invalid contact selected.');
      return;
    }

    setFavoriteLoadingId(contact.id);
    try {
      const token = AuthenticationService.getAuthenticationToken();
      const newFavoriteValue = !Boolean(contact.favorite);

      await axios.post(
        `${config.api.services}ownPhoneBook/updateFavorite`,
        {
          id: contact.id,
          favorite: newFavoriteValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showNotification('success', `Contact ${newFavoriteValue ? 'added to' : 'removed from'} favorites.`);
      await loadContacts();
    } catch (error) {
      showNotification('error', 'Failed to update favorite status.');
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  const filteredRows = favoriteFilter === 'favorite'
    ? rows.filter((contact) => Boolean(contact.favorite))
    : rows;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1800, mx: 'auto' }}>
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
                  Personal Contacts
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {totalRecords} Total Contacts
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={loadContacts}
                  disabled={loading}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    py: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    letterSpacing: 0.2,
                    border: `1px solid ${alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.24 : 0.38)}`,
                    backdropFilter: 'blur(6px)',
                    boxShadow: theme.shadows[4],
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.28)
                      : alpha(theme.palette.background.paper, 0.94),
                    color: theme.palette.mode === 'dark'
                      ? theme.palette.common.white
                      : theme.palette.primary.dark,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.99),
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    '&.Mui-disabled': {
                      bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.16)
                        : alpha(theme.palette.background.paper, 0.7),
                      color: alpha(
                        theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.dark,
                        0.6
                      ),
                    },
                  }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenCreate}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    py: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    letterSpacing: 0.2,
                    border: `1px solid ${alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.24 : 0.38)}`,
                    backdropFilter: 'blur(6px)',
                    boxShadow: theme.shadows[4],
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.28)
                      : alpha(theme.palette.background.paper, 0.94),
                    color: theme.palette.mode === 'dark'
                      ? theme.palette.common.white
                      : theme.palette.primary.dark,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.99),
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  Create Contact
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
        </MotionBox>

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
              <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                <InputLabel id="search-field-label">Search By</InputLabel>
                <Select
                  labelId="search-field-label"
                  value={searchColumn}
                  label="Search By"
                  onChange={(event) => setSearchColumn(event.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  {searchOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                placeholder={`Search by ${selectedSearchOption.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                size="small"
                variant={favoriteFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFavoriteFilter('all')}
                sx={{ borderRadius: 999, textTransform: 'none' }}
              >
                All
              </Button>
              <Button
                size="small"
                variant={favoriteFilter === 'favorite' ? 'contained' : 'outlined'}
                onClick={() => setFavoriteFilter('favorite')}
                startIcon={<Favorite fontSize="small" />}
                sx={{ borderRadius: 999, textTransform: 'none' }}
              >
                Favorite
              </Button>
            </Stack>
          </Paper>
        </MotionBox>

        <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                {filteredRows.length === 0 ? (
                  <Stack sx={{ py: 8 }} alignItems="center" justifyContent="center" spacing={1}>
                    <Person color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      {favoriteFilter === 'favorite' ? 'No favorite contacts found' : 'No personal contacts found'}
                    </Typography>
                  </Stack>
                ) : (
                  <TableContainer
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      overflowX: 'auto',
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            background:
                              theme.palette.mode === 'dark'
                                ? alpha(theme.palette.primary.main, 0.12)
                                : alpha(theme.palette.primary.main, 0.06),
                          }}
                        >
                          <TableCell><strong>Name</strong></TableCell>
                          <TableCell><strong>Designation</strong></TableCell>
                          <TableCell><strong>Company</strong></TableCell>
                          <TableCell><strong>Office Phone</strong></TableCell>
                          <TableCell><strong>Home Phone</strong></TableCell>
                          <TableCell><strong>Email</strong></TableCell>
                          <TableCell><strong>Address</strong></TableCell>
                          <TableCell align="center"><strong>Favorite</strong></TableCell>
                          <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRows.map((contact) => (
                          <TableRow
                            key={contact.id}
                            hover
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell>{contact.firstName || '-'}</TableCell>
                            <TableCell>{contact.designation || '-'}</TableCell>
                            <TableCell>{contact.company || '-'}</TableCell>
                            <TableCell>{contact.phoneOffice || '-'}</TableCell>
                            <TableCell>{contact.phoneHome || '-'}</TableCell>
                            <TableCell>{contact.emailId || '-'}</TableCell>
                            <TableCell>{contact.addressTwo || contact.addressOne || '-'}</TableCell>
                            <TableCell align="center">
                              <Tooltip title={contact.favorite ? 'Remove from favorite' : 'Mark as favorite'}>
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleToggleFavorite(contact)}
                                    disabled={favoriteLoadingId === contact.id}
                                    sx={{
                                      color: contact.favorite ? theme.palette.error.main : theme.palette.text.secondary,
                                      bgcolor: contact.favorite
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : alpha(theme.palette.text.secondary, 0.08),
                                      '&:hover': {
                                        bgcolor: contact.favorite
                                          ? alpha(theme.palette.error.main, 0.18)
                                          : alpha(theme.palette.text.secondary, 0.16),
                                      },
                                    }}
                                  >
                                    {contact.favorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEdit(contact)}
                                    sx={{
                                      borderRadius: 2,
                                      border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                                      color: theme.palette.primary.main,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.18),
                                        transform: 'translateY(-1px)',
                                        boxShadow: theme.shadows[2],
                                      },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDelete(contact)}
                                    sx={{
                                      borderRadius: 2,
                                      border: `1px solid ${alpha(theme.palette.error.main, 0.45)}`,
                                      bgcolor: alpha(theme.palette.error.main, 0.08),
                                      color: theme.palette.error.main,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        bgcolor: alpha(theme.palette.error.main, 0.16),
                                        transform: 'translateY(-1px)',
                                        boxShadow: theme.shadows[2],
                                      },
                                    }}
                                  >
                                    <DeleteOutline fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', md: 'center' }}
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {filteredRows.length} of {totalRecords} contacts
                    </Typography>
                    <TextField
                      select
                      label="Page Size"
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setCurrentPage(0);
                      }}
                      size="small"
                      sx={{ minWidth: 140 }}
                    >
                      {[10, 20, 50].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>

                  <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                    <Pagination
                      count={Math.max(totalPages, 1)}
                      page={currentPage + 1}
                      onChange={(event, value) => {
                        setCurrentPage(value - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      color="primary"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <ContactMail color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {formValue.id ? 'Edit Personal Contact' : 'Create Personal Contact'}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Name"
                value={formValue.firstName}
                onChange={handleFieldChange('firstName')}
                size="small"
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Designation"
                value={formValue.designation}
                onChange={handleFieldChange('designation')}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Company"
                value={formValue.company}
                onChange={handleFieldChange('company')}
                size="small"
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Email"
                type="email"
                value={formValue.emailId}
                onChange={handleFieldChange('emailId')}
                size="small"
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Office Phone"
                value={formValue.phoneOffice}
                onChange={handleFieldChange('phoneOffice')}
                size="small"
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Home Phone"
                value={formValue.phoneHome}
                onChange={handleFieldChange('phoneHome')}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Fax Number"
                value={formValue.faxNumber}
                onChange={handleFieldChange('faxNumber')}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Call fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Address 1"
                value={formValue.addressOne}
                onChange={handleFieldChange('addressOne')}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Apartment fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Address 2"
                value={formValue.addressTwo}
                onChange={handleFieldChange('addressTwo')}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Apartment fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={handleCloseCreate}
            disabled={saving}
            sx={{
              borderRadius: 999,
              px: 2.5,
              fontWeight: 600,
              textTransform: 'none',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveContact}
            disabled={saving || isCreateDisabled}
            sx={{
              borderRadius: 999,
              px: 3,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                backgroundImage: 'none',
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.14)
                  : alpha(theme.palette.common.black, 0.12),
                color: `${alpha(theme.palette.text.primary, 0.72)} !important`,
                WebkitTextFillColor: `${alpha(theme.palette.text.primary, 0.72)} !important`,
                boxShadow: 'none',
              },
            }}
          >
            {saving ? 'Saving...' : formValue.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirm} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete
            {' '}
            <strong>{selectedContact?.firstName || 'this contact'}</strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} disabled={saving}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteContact} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notifyOpen}
        autoHideDuration={4000}
        onClose={() => setNotifyOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={notify.type} onClose={() => setNotifyOpen(false)} variant="filled">
          {notify.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalContactsPage;