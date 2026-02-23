import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { preferencesService, UserPreferences, ThemeMode } from '../services/preferencesService';

interface ThemeContextType {
  // Current preferences
  preferences: UserPreferences;

  // Effective theme (resolved from 'system' if needed)
  effectiveTheme: 'light' | 'dark';

  // Theme actions
  setTheme: (theme: ThemeMode) => void;

  // Other preference actions
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setReducedMotion: (enabled: boolean) => void;
  resetPreferences: () => void;

  // Convenience booleans
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    preferencesService.getPreferences()
  );

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Calculate effective theme
  const effectiveTheme = useMemo(() => {
    if (preferences.theme === 'system') {
      return systemTheme;
    }
    return preferences.theme;
  }, [preferences.theme, systemTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Also set color-scheme for native elements
    root.style.colorScheme = effectiveTheme;
  }, [effectiveTheme]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');

    switch (preferences.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }
  }, [preferences.fontSize]);

  // Apply reduced motion
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [preferences.reducedMotion]);

  const setTheme = useCallback((theme: ThemeMode) => {
    const updated = preferencesService.updatePreference('theme', theme);
    setPreferences(updated);
  }, []);

  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    const updated = preferencesService.updatePreference('fontSize', size);
    setPreferences(updated);
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    const updated = preferencesService.updatePreference('reducedMotion', enabled);
    setPreferences(updated);
  }, []);

  const resetPreferences = useCallback(() => {
    const defaults = preferencesService.resetPreferences();
    setPreferences(defaults);
  }, []);

  const value = useMemo(() => ({
    preferences,
    effectiveTheme,
    setTheme,
    setFontSize,
    setReducedMotion,
    resetPreferences,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
  }), [preferences, effectiveTheme, setTheme, setFontSize, setReducedMotion, resetPreferences]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
