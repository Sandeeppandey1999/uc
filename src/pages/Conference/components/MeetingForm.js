import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Autocomplete,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItem,
} from '@mui/material';
import { People, Timer, VideoCall } from '@mui/icons-material';
import axios from 'axios';
import config from '../../../config/config';
import AuthenticationService from '../../../services/AuthenticationService';

const MeetingForm = ({
  open,
  onClose,
  onSave,
  selectedStartDate,
  selectedEndDate,
  editData,
  conferenceSettings,
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    roomName: '',
    didMapping: '',
    meetingScheduledDate: '',
    scheduledToDate: '',
    fromTime: '',
    toTime: '',
    detail: '',
    participantList: [],
    conferenceType: '',
    meetingType: '',
    maxParticipants: '',
    beepInterval: '',
    retryCount: '',
    retryDelay: '',
    rptt: false,
    voiceRecognition: false,
    passwordRequired: false,
    nameAnnouncementRequired: false,
    recording: false,
  });

  const [conferenceLocations, setConferenceLocations] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (conferenceSettings) {
      setFormData(prev => ({
        ...prev,
        conferenceType: conferenceSettings.conferenceType || '',
        meetingType: conferenceSettings.meetingType || '',
        maxParticipants: conferenceSettings.maxParticipants || '',
        beepInterval: conferenceSettings.beepInterval || '',
        retryCount: conferenceSettings.retryCount || '',
        retryDelay: conferenceSettings.retryDelay || '',
        rptt: conferenceSettings.rptt || false,
        voiceRecognition: conferenceSettings.voiceRecognition || false,
        passwordRequired: conferenceSettings.passwordRequired || false,
        nameAnnouncementRequired: conferenceSettings.nameAnnouncementRequired || false,
        recording: conferenceSettings.recording || false,
      }));
    }
  }, [conferenceSettings]);

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || 0,
        roomName: editData.roomName || '',
        didMapping: editData.didMapping || '',
        meetingScheduledDate: editData.meetingScheduledDate || '',
        scheduledToDate: editData.scheduledToDate || '',
        fromTime: editData.fromTime || '',
        toTime: editData.toTime || '',
        detail: editData.detail || '',
        participantList: editData.participantList || [],
        conferenceType: editData.conferenceType || '',
        meetingType: editData.meetingType || '',
        maxParticipants: editData.maxParticipants || '',
        beepInterval: editData.beepInterval || '',
        retryCount: editData.retryCount || '',
        retryDelay: editData.retryDelay || '',
        rptt: editData.rptt || false,
        voiceRecognition: editData.voiceRecognition || false,
        passwordRequired: editData.passwordRequired || false,
        nameAnnouncementRequired: editData.nameAnnouncementRequired || false,
        recording: editData.recording || false,
      });
    }
  }, [editData]);

  useEffect(() => {
    if (selectedStartDate) {
      const startDate = new Date(selectedStartDate);
      const endDate = selectedEndDate ? new Date(selectedEndDate) : new Date(startDate.getTime() + 30 * 60000);
      
      const formattedDate = startDate.toLocaleDateString('en-CA');
      const formattedFromTime = startDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      const formattedToTime = endDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

      setFormData(prev => ({
        ...prev,
        meetingScheduledDate: formattedDate,
        scheduledToDate: formattedDate,
        fromTime: formattedFromTime,
        toTime: formattedToTime,
      }));
    }
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    loadConferenceLocations();
    loadParticipants();
  }, []);

  const loadConferenceLocations = async () => {
    try {
      const response = await axios.post(
        `${config.api.services}extensions/conferenceNumber`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );
      setConferenceLocations(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load conference locations:', error);
    }
  };

  const loadParticipants = async () => {
    try {
      const response = await axios.post(
        `${config.api.services}userGroup/listAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AuthenticationService.getAuthenticationToken()}`,
          },
        }
      );
      setParticipants(response.data?.data?.userList || []);
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'participantList') {
      const participantList = value.map((user) => ({
        id: user.id,
        memberType: user.memberType || user.userType || 'U',
        username: user.username,
        extension: user.extension,
      }));
      setFormData(prev => ({
        ...prev,
        participantList: participantList,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {editData ? 'Edit Meeting' : 'Create New Meeting'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Meeting Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meeting Name"
              value={formData.roomName}
              onChange={(e) => handleChange('roomName', e.target.value)}
              required
            />
          </Grid>

          {/* Date and Time */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={formData.meetingScheduledDate}
              onChange={(e) => handleChange('meetingScheduledDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getCurrentDate() }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="From Time"
              type="time"
              value={formData.fromTime}
              onChange={(e) => handleChange('fromTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={formData.scheduledToDate}
              onChange={(e) => handleChange('scheduledToDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: formData.meetingScheduledDate }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="To Time"
              type="time"
              value={formData.toTime}
              onChange={(e) => handleChange('toTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {/* Conference Location */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Add Location"
              value={formData.didMapping}
              onChange={(e) => handleChange('didMapping', e.target.value)}
              required
            >
              <MenuItem value="">Select Location</MenuItem>
              {conferenceLocations.map((item, index) => (
                <MenuItem key={index} value={item.extension}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Participants */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={participants}
              getOptionLabel={(option) => 
                option.username ? `${option.extension} - ${option.username}` : option.extension
              }
              value={formData.participantList}
              onChange={(event, newValue) => handleChange('participantList', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Add Participants" required />
              )}
              renderOption={(props, option, { selected }) => (
                <ListItem {...props}>
                  <ListItemIcon>
                    <Checkbox checked={selected} />
                  </ListItemIcon>
                  <ListItemText
                    primary={option.username || option.extension}
                    secondary={option.extension}
                  />
                </ListItem>
              )}
            />
          </Grid>

          {/* Details */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details"
              multiline
              rows={3}
              value={formData.detail}
              onChange={(e) => handleChange('detail', e.target.value)}
              placeholder="Type details for this meeting"
            />
          </Grid>

          {/* Recording Switch */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.recording}
                  onChange={(e) => handleChange('recording', e.target.checked)}
                  color="primary"
                />
              }
              label="Recording"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Meeting
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeetingForm;
