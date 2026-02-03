import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  LinearProgress,
  useTheme,
  Alert,
  Paper,
  Avatar,
  Chip,
  alpha,
} from '@mui/material';
import {
  Person,
  Save,
  Refresh,
  Email,
  Phone,
  Business,
  Home,
  LocationOn,
  PhoneForwarded,
  Settings as SettingsIcon,
  AccountCircle,
  ContactPhone,
  Work,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/config';
import AuthenticationService from '../../services/AuthenticationService';
import Notification from '../../components/Common/Notification';

const MotionCard = motion.create(Card);

const AccountProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    // Customer Account
    id: 0,
    firstName: '',
    lastName: '',
    emailId: '',
    phoneOffice: '',
    extension: '',
    phoneHome: '',
    mobileNumber: '',
    company: '',
    addressOne: '',
    addressTwo: '',
    faxNumber: '',
    designation: '',
    zipPostalCode: '',
    countryId: '',
    stateId: '',
    cityId: '',
    districtId: '',
    profilePicUrl: '',

    // Extension Range / Service Codes
    intercom: false,
    dialLocal: false,
    dialSTD: false,
    dialISD: false,
    dnd: false,
    cfa: '',
    cfb: '',
    cfna: '',
    fm: '',
    ecfa: '',
    ecfb: '',
    ecfna: '',
  });

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: 'info',
  });

  // Load data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoadingData(true);
    try {
      const response = await axios.post(
        `${config.api.services}customerAccount/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const { customerAccount, serviceCodeModel } = response.data.data;

        // Map customer account data
        const profileData = {
          id: customerAccount.id || 0,
          firstName: customerAccount.firstName || '',
          lastName: customerAccount.lastName || '',
          emailId: customerAccount.emailId || '',
          phoneOffice: customerAccount.phoneOffice || '',
          extension: customerAccount.extension || '',
          phoneHome: customerAccount.phoneHome || '',
          mobileNumber: customerAccount.mobileNumber || '',
          company: customerAccount.company || '',
          addressOne: customerAccount.addressOne || '',
          addressTwo: customerAccount.addressTwo || '',
          faxNumber: customerAccount.faxNumber || '',
          designation: customerAccount.designation || '',
          zipPostalCode: customerAccount.zipPostalCode || '',
          countryId: customerAccount.countryId || '',
          stateId: customerAccount.stateId || '',
          cityId: customerAccount.cityId || '',
          districtId: customerAccount.districtId || '',
          profilePicUrl: customerAccount.profilePicUrl || '',
          // Initialize boolean switches with default false values
          intercom: false,
          dialLocal: false,
          dialSTD: false,
          dialISD: false,
          dnd: false,
          cfa: '',
          cfb: '',
          cfna: '',
          fm: '',
          ecfa: '',
          ecfb: '',
          ecfna: '',
        };

        // Map service codes
        if (serviceCodeModel && Array.isArray(serviceCodeModel)) {
          serviceCodeModel.forEach((service) => {
            switch (service.serviceCode) {
              case 'LOCAL':
                profileData.dialLocal = service.value === true;
                break;
              case 'STD':
                profileData.dialSTD = service.value === true;
                break;
              case 'ISD':
                profileData.dialISD = service.value === true;
                break;
              case 'Intercom':
                profileData.intercom = service.value === true;
                break;
              case 'DND':
                profileData.dnd = service.value === true;
                break;
              case 'CFA':
                profileData.cfa = service.data || '';
                break;
              case 'CFB':
                profileData.cfb = service.data || '';
                break;
              case 'CFNA':
                profileData.cfna = service.data || '';
                break;
              case 'FM':
                profileData.fm = service.data || '';
                break;
              case 'ECFA':
                profileData.ecfa = service.data || '';
                break;
              case 'ECFB':
                profileData.ecfb = service.data || '';
                break;
              case 'ECFNA':
                profileData.ecfna = service.data || '';
                break;
              default:
                break;
            }
          });
        }

        setFormData(profileData);
      }
    } catch (err) {
      console.error('Load profile error:', err);
      setNotify({
        isOpen: true,
        message: err.response?.data?.message || 'Failed to load profile data',
        type: 'error',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle cascading logic for Local, STD, ISD switches
    if (type === 'checkbox' && (name === 'dialLocal' || name === 'dialSTD' || name === 'dialISD')) {
      console.log('Before change:', name, 'checked:', checked, 'current state:', {
        dialLocal: formData.dialLocal,
        dialSTD: formData.dialSTD,
        dialISD: formData.dialISD
      });
      
      let updatedFormData = { ...formData };
      
      if (name === 'dialLocal') {
        if (checked) {
          // Turning ON Local - only enable Local
          updatedFormData.dialLocal = true;
        } else {
          // Turning OFF Local - disable ALL (Local, STD, ISD)
          updatedFormData.dialLocal = false;
          updatedFormData.dialSTD = false;
          updatedFormData.dialISD = false;
        }
      } else if (name === 'dialSTD') {
        if (checked) {
          // Turning ON STD - enable Local and STD
          updatedFormData.dialLocal = true;
          updatedFormData.dialSTD = true;
        } else {
          // Turning OFF STD - disable STD and ISD (keep Local)
          updatedFormData.dialSTD = false;
          updatedFormData.dialISD = false;
        }
      } else if (name === 'dialISD') {
        if (checked) {
          // Turning ON ISD - enable ALL (Local, STD, ISD)
          updatedFormData.dialLocal = true;
          updatedFormData.dialSTD = true;
          updatedFormData.dialISD = true;
        } else {
          // Turning OFF ISD - disable only ISD (keep Local and STD)
          updatedFormData.dialISD = false;
        }
      }
      
      console.log('After change:', {
        dialLocal: updatedFormData.dialLocal,
        dialSTD: updatedFormData.dialSTD,
        dialISD: updatedFormData.dialISD
      });
      
      setFormData(updatedFormData);
    } else {
      // Normal field update
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customerAccount: {
          id: formData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          phoneOffice: formData.phoneOffice,
          extension: formData.extension,
          phoneHome: formData.phoneHome,
          mobileNumber: formData.mobileNumber,
          company: formData.company,
          addressOne: formData.addressOne,
        },
        extensionRange: {
          local: formData.dialLocal,
          std: formData.dialSTD,
          isd: formData.dialISD,
          intercom: formData.intercom,
          dnd: formData.dnd,
          cfa: formData.cfa,
          cfb: formData.cfb,
          cfna: formData.cfna,
          fm: formData.fm,
          ecfa: formData.ecfa,
          ecfb: formData.ecfb,
          ecfna: formData.ecfna,
        },
      };

      const response = await axios.post(
        `${config.api.services}customerAccount/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );

      setNotify({
        isOpen: true,
        message: response.data?.message || 'Profile updated successfully!',
        type: 'success',
      });

      // Reload data after successful update
      setTimeout(() => {
        loadProfileData();
      }, 1000);
    } catch (err) {
      console.error('Update profile error:', err);
      setNotify({
        isOpen: true,
        message: err.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Loading Profile...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Grid container spacing={3}>
        {/* Profile Header Card */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    border: '4px solid rgba(255,255,255,0.3)',
                    fontSize: 40,
                    fontWeight: 600,
                  }}
                >
                  {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {formData.firstName} {formData.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                    {formData.designation && (
                      <Chip
                        label={formData.designation}
                        icon={<Work sx={{ color: 'white !important' }} />}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    )}
                    {formData.extension && (
                      <Chip
                        label={`Ext: ${formData.extension}`}
                        icon={<Phone sx={{ color: 'white !important' }} />}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {formData.emailId}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={loadProfileData}
                  disabled={loading || loadingData}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Main Form */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            elevation={3}
          >
            <CardContent sx={{ p: 4 }}>
              {loading && <LinearProgress sx={{ mb: 3 }} />}

              <Box component="form" onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <AccountCircle />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Personal Information
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="firstName"
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        name="emailId"
                        label="Email Address"
                        type="email"
                        value={formData.emailId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Contact Information Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.success.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <ContactPhone />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Contact Information
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="extension"
                        label="Office Extension"
                        value={formData.extension}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="mobileNumber"
                        label="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="phoneHome"
                        label="Resident Number"
                        value={formData.phoneHome}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="phoneOffice"
                        label="Office Phone"
                        value={formData.phoneOffice}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="faxNumber"
                        label="Fax Number"
                        value={formData.faxNumber}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Company Information Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Company Information
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="company"
                        label="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="designation"
                        label="Designation"
                        value={formData.designation}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Address Information Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.info.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <LocationOn />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Address Information
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="addressOne"
                        label="Home Address"
                        value={formData.addressOne}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Home sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="addressTwo"
                        label="Office Address"
                        value={formData.addressTwo}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                        InputProps={{
                          startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="zipPostalCode"
                        label="ZIP/Postal Code"
                        value={formData.zipPostalCode}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="districtId"
                        label="District"
                        value={formData.districtId}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="cityId"
                        label="City"
                        value={formData.cityId}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="stateId"
                        label="State"
                        value={formData.stateId}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="countryId"
                        label="Country"
                        value={formData.countryId}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Configuration Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <SettingsIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Service Configuration
                    </Typography>
                  </Box>
                  
                  {/* Service Toggles */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Service Features
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                name="dnd"
                                checked={formData.dnd}
                                onChange={handleChange}
                                disabled={loading}
                                color="error"
                              />
                            }
                            label="Do Not Disturb"
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                name="intercom"
                                checked={formData.intercom}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            }
                            label="Dial Intercom"
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                name="dialLocal"
                                checked={formData.dialLocal}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            }
                            label="Dial Local"
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                name="dialSTD"
                                checked={formData.dialSTD}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            }
                            label="Dial STD"
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { borderColor: theme.palette.primary.main },
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                name="dialISD"
                                checked={formData.dialISD}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            }
                            label="Dial ISD"
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                </Paper>

                {/* Call Forwarding Settings - New Section */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.warning.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PhoneForwarded />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Call Forwarding Settings
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="cfa"
                        label="Call Forward Always"
                        value={formData.cfa}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                       
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="cfb"
                        label="Call Forward Busy"
                        value={formData.cfb}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="cfna"
                        label="Call Forward No Answer"
                        value={formData.cfna}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="fm"
                        label="Follow Me"
                        value={formData.fm}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="ecfa"
                        label="External Forward All"
                        value={formData.ecfa}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="ecfb"
                        label="External Forward Busy"
                        value={formData.ecfb}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="ecfna"
                        label="External Forward No Answer"
                        value={formData.ecfna}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ '& .MuiInputBase-root': { height: 56 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    pt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    sx={{ px: 4 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{
                      px: 5,
                      color: 'white',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                      },
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Notification */}
      <Notification notify={notify} setNotify={setNotify} />
    </Box>
  );
};

export default AccountProfilePage;
