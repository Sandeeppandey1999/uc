import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const Notification = ({ notify, setNotify }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotify({
      ...notify,
      isOpen: false,
    });
  };

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={notify.duration || 5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={notify.type || 'info'}
        variant="filled"
        elevation={6}
        sx={{
          minWidth: 300,
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
          },
        }}
      >
        {notify.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
