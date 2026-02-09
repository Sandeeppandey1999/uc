import { createTheme } from '@mui/material/styles';

// Google-inspired Light Theme
export const googleLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
      light: '#4285f4',
      dark: '#1557b0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#34a853',
      light: '#5bb974',
      dark: '#0d652d',
      contrastText: '#fff',
    },
    error: {
      main: '#ea4335',
      light: '#ef6c5d',
      dark: '#c52a1a',
    },
    warning: {
      main: '#fbbc04',
      light: '#fcc934',
      dark: '#f29900',
    },
    info: {
      main: '#4285f4',
      light: '#669df6',
      dark: '#185abc',
    },
    success: {
      main: '#34a853',
      light: '#5bb974',
      dark: '#0d652d',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    divider: '#dadce0',
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
    '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
    '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
    '0 2px 3px 0 rgba(60,64,67,0.3), 0 6px 10px 4px rgba(60,64,67,0.15)',
    '0 4px 4px 0 rgba(60,64,67,0.3), 0 8px 12px 6px rgba(60,64,67,0.15)',
    '0 6px 10px 0 rgba(60,64,67,0.3), 0 10px 14px 8px rgba(60,64,67,0.15)',
    '0 8px 12px 0 rgba(60,64,67,0.3), 0 12px 16px 10px rgba(60,64,67,0.15)',
    '0 10px 14px 0 rgba(60,64,67,0.3), 0 14px 18px 12px rgba(60,64,67,0.15)',
    '0 12px 16px 0 rgba(60,64,67,0.3), 0 16px 20px 14px rgba(60,64,67,0.15)',
    '0 14px 18px 0 rgba(60,64,67,0.3), 0 18px 22px 16px rgba(60,64,67,0.15)',
    '0 16px 20px 0 rgba(60,64,67,0.3), 0 20px 24px 18px rgba(60,64,67,0.15)',
    '0 18px 22px 0 rgba(60,64,67,0.3), 0 22px 26px 20px rgba(60,64,67,0.15)',
    '0 20px 24px 0 rgba(60,64,67,0.3), 0 24px 28px 22px rgba(60,64,67,0.15)',
    '0 22px 26px 0 rgba(60,64,67,0.3), 0 26px 30px 24px rgba(60,64,67,0.15)',
    '0 24px 28px 0 rgba(60,64,67,0.3), 0 28px 32px 26px rgba(60,64,67,0.15)',
    '0 26px 30px 0 rgba(60,64,67,0.3), 0 30px 34px 28px rgba(60,64,67,0.15)',
    '0 28px 32px 0 rgba(60,64,67,0.3), 0 32px 36px 30px rgba(60,64,67,0.15)',
    '0 30px 34px 0 rgba(60,64,67,0.3), 0 34px 38px 32px rgba(60,64,67,0.15)',
    '0 32px 36px 0 rgba(60,64,67,0.3), 0 36px 40px 34px rgba(60,64,67,0.15)',
    '0 34px 38px 0 rgba(60,64,67,0.3), 0 38px 42px 36px rgba(60,64,67,0.15)',
    '0 36px 40px 0 rgba(60,64,67,0.3), 0 40px 44px 38px rgba(60,64,67,0.15)',
    '0 38px 42px 0 rgba(60,64,67,0.3), 0 42px 46px 40px rgba(60,64,67,0.15)',
    '0 40px 44px 0 rgba(60,64,67,0.3), 0 44px 48px 42px rgba(60,64,67,0.15)',
    '0 42px 46px 0 rgba(60,64,67,0.3), 0 46px 50px 44px rgba(60,64,67,0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Google-inspired Dark Theme
export const googleDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8ab4f8',
      light: '#adc6ff',
      dark: '#5e8ed6',
      contrastText: '#1f1f1f',
    },
    secondary: {
      main: '#81c995',
      light: '#a8dab5',
      dark: '#5bb974',
      contrastText: '#1f1f1f',
    },
    error: {
      main: '#f28b82',
      light: '#f5a9a0',
      dark: '#ee675c',
    },
    warning: {
      main: '#fdd663',
      light: '#fde293',
      dark: '#fcc934',
    },
    info: {
      main: '#8ab4f8',
      light: '#adc6ff',
      dark: '#5e8ed6',
    },
    success: {
      main: '#81c995',
      light: '#a8dab5',
      dark: '#5bb974',
    },
    background: {
      default: '#1a2035',
      paper: '#1a2035',
      // default: '#1f1f1f',
      // paper: '#292929',
    },
    text: {
      primary: '#e8eaed',
      secondary: '#9aa0a6',
    },
    divider: '#3c4043',
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
    '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
    '0 1px 3px 0 rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15)',
    '0 2px 3px 0 rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15)',
    '0 4px 4px 0 rgba(0,0,0,0.3), 0 8px 12px 6px rgba(0,0,0,0.15)',
    '0 6px 10px 0 rgba(0,0,0,0.3), 0 10px 14px 8px rgba(0,0,0,0.15)',
    '0 8px 12px 0 rgba(0,0,0,0.3), 0 12px 16px 10px rgba(0,0,0,0.15)',
    '0 10px 14px 0 rgba(0,0,0,0.3), 0 14px 18px 12px rgba(0,0,0,0.15)',
    '0 12px 16px 0 rgba(0,0,0,0.3), 0 16px 20px 14px rgba(0,0,0,0.15)',
    '0 14px 18px 0 rgba(0,0,0,0.3), 0 18px 22px 16px rgba(0,0,0,0.15)',
    '0 16px 20px 0 rgba(0,0,0,0.3), 0 20px 24px 18px rgba(0,0,0,0.15)',
    '0 18px 22px 0 rgba(0,0,0,0.3), 0 22px 26px 20px rgba(0,0,0,0.15)',
    '0 20px 24px 0 rgba(0,0,0,0.3), 0 24px 28px 22px rgba(0,0,0,0.15)',
    '0 22px 26px 0 rgba(0,0,0,0.3), 0 26px 30px 24px rgba(0,0,0,0.15)',
    '0 24px 28px 0 rgba(0,0,0,0.3), 0 28px 32px 26px rgba(0,0,0,0.15)',
    '0 26px 30px 0 rgba(0,0,0,0.3), 0 30px 34px 28px rgba(0,0,0,0.15)',
    '0 28px 32px 0 rgba(0,0,0,0.3), 0 32px 36px 30px rgba(0,0,0,0.15)',
    '0 30px 34px 0 rgba(0,0,0,0.3), 0 34px 38px 32px rgba(0,0,0,0.15)',
    '0 32px 36px 0 rgba(0,0,0,0.3), 0 36px 40px 34px rgba(0,0,0,0.15)',
    '0 34px 38px 0 rgba(0,0,0,0.3), 0 38px 42px 36px rgba(0,0,0,0.15)',
    '0 36px 40px 0 rgba(0,0,0,0.3), 0 40px 44px 38px rgba(0,0,0,0.15)',
    '0 38px 42px 0 rgba(0,0,0,0.3), 0 42px 46px 40px rgba(0,0,0,0.15)',
    '0 40px 44px 0 rgba(0,0,0,0.3), 0 44px 48px 42px rgba(0,0,0,0.15)',
    '0 42px 46px 0 rgba(0,0,0,0.3), 0 46px 50px 44px rgba(0,0,0,0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Modern Light Theme (Slack-inspired)
export const modernLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#611f69',
      light: '#8b4a9c',
      dark: '#44154b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#007a5a',
      light: '#2d9b78',
      dark: '#005840',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f8f8',
    },
    text: {
      primary: '#1d1c1d',
      secondary: '#616061',
    },
  },
  typography: {
    fontFamily: '"Lato", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// Modern Dark Theme (Slack-inspired)
export const modernDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1264a3',
      light: '#4a8fc1',
      dark: '#0d4673',
      contrastText: '#fff',
    },
    secondary: {
      main: '#007a5a',
      light: '#2d9b78',
      dark: '#005840',
      contrastText: '#fff',
    },
    background: {
      // main: "#344767",
      // focus: "#2c3c58",
      default: '#1a2035',
      paper: '#1a2035',
    },
    text: {
      primary: '#d1d2d3',
      secondary: '#8d8d8d',
    },
  },
  typography: {
    fontFamily: '"Lato", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// Theme names and their configurations
export const themes = {
  googleLight: googleLightTheme,
  googleDark: googleDarkTheme,
  modernLight: modernLightTheme,
  modernDark: modernDarkTheme,
};

export const themeNames = {
  GOOGLE_LIGHT: 'googleLight',
  GOOGLE_DARK: 'googleDark',
  MODERN_LIGHT: 'modernLight',
  MODERN_DARK: 'modernDark',
};
