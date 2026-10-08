'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('distromesh_theme');
        if (stored === 'light' || stored === 'dark') return stored;
      } catch {}
    }
    return 'dark';
  });

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'distromesh_theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('distromesh_theme', t);
    applyTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
