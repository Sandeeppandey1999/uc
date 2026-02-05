import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    IconButton,
    Typography,
    Autocomplete,
    useTheme,
    alpha,
    Avatar,
    Chip,
    Switch,
    FormControlLabel,
    InputAdornment,
    Paper
} from '@mui/material';
import {
    Event as EventIcon,
    Close as CloseIcon,
    LocationOn as LocationIcon,
    Description as DescriptionIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../../config/config';
import AuthenticationService from '../../../services/AuthenticationService';

const MotionBox = motion(Box);

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        height: 40,
        borderRadius: 2,
    },
    '& .MuiInputLabel-root': {
        transform: 'translate(14px, 9px) scale(1)',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
        },
    },
};

const selectSx = {
    height: 40,
    borderRadius: 2,
    '& .MuiSelect-select': {
        paddingTop: '8px',
        paddingBottom: '8px',
    },
};

const autocompleteSx = {
    '& .MuiOutlinedInput-root': {
        minHeight: 40,
        borderRadius: 2,
        paddingTop: '4px',
        paddingBottom: '4px',
    },
    '& .MuiInputLabel-root': {
        transform: 'translate(14px, 9px) scale(1)',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
        },
    },
};

const MeetingForm = ({ open, onClose, onSubmit, meeting = null, initialDate = null }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        roomName: '',
        detail: '',
        meetingScheduledDate: '',
        scheduledToDate: '',
        fromTime: '',
        toTime: '',
        didMapping: '',
        participantList: [],
        recording: true,
    });

    const [conferenceNumbers, setConferenceNumbers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [conferenceSettings, setConferenceSettings] = useState(null);

    useEffect(() => {
        if (open) {
            loadConferenceNumbers();
            loadParticipants();
            loadConferenceSettings();

            if (meeting) {
                // Edit mode
                setFormData({
                    roomName: meeting.roomName || '',
                    detail: meeting.detail || '',
                    meetingScheduledDate: meeting.meetingScheduledDate || '',
                    scheduledToDate: meeting.scheduledToDate || meeting.meetingScheduledDate || '',
                    fromTime: meeting.fromTime || '',
                    toTime: meeting.toTime || '',
                    didMapping: meeting.didMapping || '',
                    participantList: meeting.participantList || [],
                    recording: meeting.recording !== undefined ? meeting.recording : true,
                });
            } else if (initialDate) {
                // Create mode with initial date from calendar click
                const date = initialDate.toISOString().split('T')[0];
                
                // Use current time instead of clicked date time
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                
                // Round up to next 15-minute interval
                const roundedMinute = Math.ceil(currentMinute / 15) * 15;
                const fromTime = `${String(currentHour).padStart(2, '0')}:${String(roundedMinute % 60).padStart(2, '0')}`;
                
                // Set end time to 30 minutes later
                const endDateTime = new Date(now.getTime() + 30 * 60000);
                const toTime = `${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

                setFormData(prev => ({
                    ...prev,
                    meetingScheduledDate: date,
                    scheduledToDate: date,
                    fromTime: fromTime,
                    toTime: toTime,
                }));
            }
        }
        // eslint-disable-next-line
    }, [open, meeting, initialDate]);

    const loadConferenceNumbers = async () => {
        try {
            console.log('Loading conference numbers...');
            const token = AuthenticationService.getAuthenticationToken();
            const response = await axios.post(
                `${config.api.services}extensions/conferenceNumber`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Conference Numbers Response:', response);
            // API response structure: { status: "OK", data: [...] }
            setConferenceNumbers(response.data.data || response.data || []);
        } catch (error) {
            console.error('Failed to load conference numbers:', error);
            setConferenceNumbers([]);
        }
    };

    const loadParticipants = async () => {
        try {
            console.log('Loading participants...');
            const token = AuthenticationService.getAuthenticationToken();
            const response = await axios.post(
                `${config.api.services}userGroup/listAll`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Participants Response:', response);
            // API response structure: { status: "OK", data: { userList: [...] } }
            if (response.data && response.data.data && response.data.data.userList) {
                setParticipants(response.data.data.userList);
            } else if (response.data && response.data.userList) {
                setParticipants(response.data.userList);
            }
        } catch (error) {
            console.error('Failed to load participants:', error);
            setParticipants([]);
        }
    };

    const loadConferenceSettings = async () => {
        try {
            console.log('Loading conference settings...');
            const token = AuthenticationService.getAuthenticationToken();
            const response = await axios.post(
                `${config.api.services}conferenceSettings/listAll`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Conference Settings Response:', response);
            // API response structure: { status: "OK", data: [...] }
            const settings = response.data.data || response.data;
            if (settings && settings.length > 0) {
                setConferenceSettings(settings[0]);
            }
        } catch (error) {
            console.error('Failed to load conference settings:', error);
            setConferenceSettings(null);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        // Build API payload
        const payload = {
            id: meeting?.id || 0,
            roomName: formData.roomName,
            didMapping: formData.didMapping,
            meetingScheduledDate: formData.meetingScheduledDate,
            scheduledToDate: formData.scheduledToDate,
            fromTime: formData.fromTime,
            toTime: formData.toTime,
            detail: formData.detail,
            participantList: formData.participantList.map(p => ({
                id: p.id,
                memberType: 'U',
                username: p.username,
                extension: p.extension,
            })),
            externalParticipant: [],
            // Set conference settings from loaded settings
            conferenceType: conferenceSettings?.conferenceType || 'v',
            maxParticipants: conferenceSettings?.maxParticipants || 4,
            beepInterval: conferenceSettings?.beepInterval || 3,
            retryCount: conferenceSettings?.retryCount || 5,
            retryDelay: conferenceSettings?.retryDelay || 6,
            rptt: conferenceSettings?.rptt || true,
            voiceRecognition: conferenceSettings?.voiceRecognition || true,
            passwordRequired: conferenceSettings?.passwordRequired || true,
            nameAnnouncementRequired: conferenceSettings?.nameAnnouncementRequired || true,
            recording: formData.recording,
            createdBy: 'uc1',
            createdOn: new Date().toISOString().replace('T', ' ').slice(0, 19),
            meetingType: conferenceSettings?.meetingType || 'Dial Assisted',
            conferenceMode: 'I',
        };

        onSubmit(payload);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            roomName: '',
            detail: '',
            meetingScheduledDate: '',
            scheduledToDate: '',
            fromTime: '',
            toTime: '',
            didMapping: '',
            participantList: [],
            recording: true,
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backdropFilter: 'blur(20px)',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
                },
            }}
        >
            {/* ================= HEADER ================= */}
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                >
                    <EventIcon />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Create New Meeting
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Schedule a conference meeting
                    </Typography>
                </Box>

                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* ================= CONTENT ================= */}
            <DialogContent sx={{ px: 3, pb: 3 }}>
                <Box mt={2}>
                    <Grid container spacing={2.5}>

                        {/* -------- ROW 1 -------- */}
                        <Grid item size={6} md={5}>
                            <TextField
                                fullWidth
                                label="Meeting Name"
                                value={formData.roomName}
                                onChange={(e) => handleChange('roomName', e.target.value)}
                                size="small"
                                required
                                sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EventIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item size={6} md={5}>
                            {/* <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        > */}
                            <FormControl fullWidth required size="small">
                                <InputLabel>Conference Number</InputLabel>
                                <Select
                                    value={formData.didMapping}
                                    fullWidth
                                    label="Conference Number"
                                    onChange={(e) => handleChange('didMapping', e.target.value)}
                                    sx={selectSx}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocationIcon color="secondary" />
                                        </InputAdornment>
                                    }
                                >
                                    {conferenceNumbers.map((conf) => (
                                        <MenuItem key={conf.id} value={conf.extension}>
                                            <Chip
                                                label={conf.extension}
                                                size="small"
                                                color="secondary"
                                                sx={{ mr: 1 }}
                                            />
                                            {conf.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* </MotionBox> */}
                        </Grid>

                        {/* -------- ROW 2 (DATE / TIME) -------- */}
                        {/* <Grid item xs={12}>
                            <Grid container spacing={2}> */}
                        <Grid item size={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="From Date"
                                size="small"
                                required
                                sx={fieldSx}
                                InputLabelProps={{ shrink: true }}
                                value={formData.meetingScheduledDate}
                                onChange={(e) => handleChange('meetingScheduledDate', e.target.value)}
                            />
                        </Grid>

                        <Grid item size={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="To Date"
                                size="small"
                                required
                                sx={fieldSx}
                                InputLabelProps={{ shrink: true }}
                                value={formData.scheduledToDate}
                                onChange={(e) => handleChange('scheduledToDate', e.target.value)}
                            />
                        </Grid>

                        <Grid item size={3}>
                            <TextField
                                fullWidth
                                type="time"
                                label="From Time"
                                size="small"
                                required
                                sx={fieldSx}
                                InputLabelProps={{ shrink: true }}
                                value={formData.fromTime}
                                onChange={(e) => handleChange('fromTime', e.target.value)}
                            />
                        </Grid>

                        <Grid item size={3}>
                            <TextField
                                fullWidth
                                type="time"
                                label="To Time"
                                size="small"
                                required
                                sx={fieldSx}
                                InputLabelProps={{ shrink: true }}
                                value={formData.toTime}
                                onChange={(e) => handleChange('toTime', e.target.value)}
                            />
                        </Grid>
                        {/* </Grid>
                        </Grid> */}




                        {/* -------- ROW 4 -------- */}
                        <Grid item size={12}>
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <Autocomplete
                                    multiple
                                    options={participants}
                                    value={formData.participantList}
                                    onChange={(e, val) => handleChange('participantList', val)}
                                    getOptionLabel={(o) => `${o.username} (${o.extension})`}
                                    size="small"
                                    sx={autocompleteSx}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Participants"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <PeopleIcon color="success" />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                {...getTagProps({ index })}
                                                label={`${option.username} (${option.extension})`}
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 1.5,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))
                                    }
                                    PaperComponent={(props) => (
                                        <Paper
                                            {...props}
                                            sx={{
                                                mt: 1,
                                                borderRadius: 2,
                                                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                                            }}
                                        />
                                    )}
                                />
                            </MotionBox>
                        </Grid>

                        {/* -------- ROW 3 -------- */}
                        <Grid item size={12}>
                            <TextField
                                fullWidth
                                label="Meeting Details"
                                size="small"
                                multiline
                                rows={3}
                                value={formData.detail}
                                onChange={(e) => handleChange('detail', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon color="warning" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item size={4} display="flex" alignItems="center">
                            <Paper
                                variant="outlined"
                                sx={{
                                    width: '100%',
                                    height: 40,
                                    px: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: 2,
                                    background: formData.recording
                                        ? alpha(theme.palette.success.main, 0.1)
                                        : 'transparent',
                                }}
                            >
                                <FormControlLabel
                                    sx={{ m: 0 }}
                                    control={
                                        <Switch
                                            checked={formData.recording}
                                            onChange={(e) => handleChange('recording', e.target.checked)}
                                            size="small"
                                            color="success"
                                            sx={{ mr: 2 }}
                                        />
                                    }
                                    label="Recording"
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            {/* ================= ACTIONS ================= */}
            <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                <Button 
                    variant="outlined" 
                    onClick={handleClose} 
                    sx={{ 
                        flex: 1,
                        height: 44,
                        borderRadius: 2,
                        borderWidth: 2,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!formData.roomName || !formData.didMapping}
                    sx={{ 
                        flex: 1,
                        height: 44,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                        '&:disabled': {
                            background: alpha(theme.palette.action.disabledBackground, 0.12),
                            color: theme.palette.action.disabled,
                        }
                    }}
                >
                    Create Meeting
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MeetingForm;
