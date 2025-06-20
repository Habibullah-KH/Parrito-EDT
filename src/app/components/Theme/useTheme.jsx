"use client"
// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState('disabled');

  useEffect(() => {
    const mode = localStorage.getItem('darkMode');
    if (mode === 'enabled') {
      setDarkMode('enabled');
      document.body.classList.add('dark');
    }
  }, []);

  const swapTheme = () => {
    if (darkMode === 'enabled') {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
      setDarkMode('disabled');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
      setDarkMode('enabled');
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, swapTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
