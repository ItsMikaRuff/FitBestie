import React, { createContext, useState, useContext } from 'react';
import { darkTheme } from '../themes/darkTheme';  // עדכון לנתיב הנכון
import { lightTheme } from '../themes/lightTheme'; // עדכון לנתיב הנכון
import { theme } from '../themes/theme';          // עדכון לנתיב הנכון

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mainTheme, setMainTheme] = useState(theme); // התחל עם נושא אור

  const toggleTheme = () => {
      setMainTheme(prevTheme =>
        prevTheme.mode === 'light' ? darkTheme : lightTheme
      );
    };

  return (
    <ThemeContext.Provider value={{ mainTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); // גישה נוחה לשימוש בcontext
