import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('et-theme') as Theme) ?? 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('et-theme', t); } catch { /* noop */ }
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggle };
}
