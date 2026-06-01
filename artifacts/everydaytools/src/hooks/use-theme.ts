import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const KEY = 'et:theme';

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  try {
    const stored = localStorage.getItem(KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(KEY, t); } catch {}
  window.dispatchEvent(new Event('et:theme'));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    window.addEventListener('et:theme', sync);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onMq = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(KEY)) applyTheme(e.matches ? 'dark' : 'light');
      } catch {}
    };
    mq.addEventListener('change', onMq);

    return () => {
      window.removeEventListener('et:theme', sync);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const toggle = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, setTheme: applyTheme, toggle };
}
