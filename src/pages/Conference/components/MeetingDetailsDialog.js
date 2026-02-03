import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  VideoCall,
  Person,
  Edit,
  Delete,
  Schedule,
  Cancel,
  Phone,
  LocationOn,
  Lock,
  FiberManualRecord,
} from '@mui/icons-material';

const MeetingDetailsDialog = ({
  open,
  onClose,
  meeting,
  onEdit,
  onDelete,
  onReschedule,
  onCancel,
  onJoin,
  currentUser,
}) => {
  if (!meeting) return null;

  const isCreator = meeting.createdBy === currentUser;
  const currentDate = new Date();
  const meetingStart = new Date(`${meeting.meetingScheduledDate}T${meeting.fromTime}`);
  const meetingEnd = new Date(`${meeting.scheduledToDate}T${meeting.toTime}`);
  const isActive = currentDate >= meetingStart && currentDate <= meetingEnd;
  const isPast = currentDate > meetingEnd;
  const isFuture = currentDate < meetingStart;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{meeting.roomName}</Typography>
          {isCreator && (
            <Box>
              <IconButton onClick={onEdit} color="primary" size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={onReschedule} color="info" size="small">
                <Schedule />
              </IconButton>
              <IconButton onClick={onCancel} color="warning" size="small">
                <Cancel />
              </IconButton>
              <IconButton onClick={onDelete} color="error" size="small">
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Chip
            label={isActive ? 'Active' : isPast ? 'Completed' : 'Upcoming'}
            color={isActive ? 'success' : isPast ? 'error' : 'info'}
            size="small"
            icon={<FiberManualRecord />}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Date and Time */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday color="primary" />
              <Typography>
                <strong>Date:</strong> {formatDate(meeting.meetingScheduledDate)}
                {meeting.scheduledToDate !== meeting.meetingScheduledDate && 
                  ` - ${formatDate(meeting.scheduledToDate)}`}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="primary" />
              <Typography>
                <strong>Time:</strong> {formatTime(meeting.fromTime)} - {formatTime(meeting.toTime)}
              </Typography>
            </Box>
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" />
              <Typography>
                <strong>Location:</strong> {meeting.didMapping}
              </Typography>
            </Box>
          </Grid>

          {/* Access Code */}
          {meeting.accessCode && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" />
                <Typography>
                  <strong>Access Code:</strong> {meeting.accessCode}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Password */}
          {meeting.passwordRequired && meeting.conferencePassword && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock color="primary" />
                <Typography>
                  <strong>Password:</strong> {meeting.conferencePassword}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Created By */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              <Typography>
                <strong>Created By:</strong> {isCreator ? 'You' : meeting.createdBy}
              </Typography>
            </Box>
          </Grid>

          {/* Recording Status */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideoCall color={meeting.recording ? 'success' : 'error'} />
              <Typography>
                <strong>Recording:</strong> {meeting.recording ? 'Enabled' : 'Disabled'}
              </Typography>
            </Box>
          </Grid>

          {/* Details */}
          {meeting.detail && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Details:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {meeting.detail}
              </Typography>
            </Grid>
          )}

          {/* Participants */}
          {meeting.participantList && meeting.participantList.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Participants ({meeting.participantList.length}):</strong>
              </Typography>
              <List dense>
                {meeting.participantList.slice(0, 5).map((participant, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={participant.username || participant.extension}
                      secondary={participant.extension}
                    />
                  </ListItem>
                ))}
                {meeting.participantList.length > 5 && (
                  <ListItem>
                    <ListItemText
                      primary={`+${meeting.participantList.length - 5} more participants`}
                      sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        {!isPast && (
          <Button
            onClick={onJoin}
            variant="contained"
            startIcon={<Phone />}
            color="primary"
          >
            Join Conference
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MeetingDetailsDialog;
