import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { themes, themeNames } from './themeConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    return saved || themeNames.GOOGLE_LIGHT;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return currentTheme.includes('Dark');
  });

  useEffect(() => {
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme]);

  const theme = useMemo(() => themes[currentTheme], [currentTheme]);

  const toggleDarkMode = () => {
    const newTheme = darkMode
      ? currentTheme.replace('Dark', 'Light')
      : currentTheme.replace('Light', 'Dark');
    setCurrentTheme(newTheme);
    setDarkMode(!darkMode);
  };

  const changeThemeStyle = (styleName) => {
    const suffix = darkMode ? 'Dark' : 'Light';
    const newTheme = `${styleName}${suffix}`;
    setCurrentTheme(newTheme);
  };

  const value = {
    currentTheme,
    darkMode,
    toggleDarkMode,
    changeThemeStyle,
    themeNames,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
