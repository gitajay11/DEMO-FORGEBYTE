'use client';

import { useEffect, useState } from 'react';
import { onThemeChange, setTheme, useTheme } from '@/lib/prefs';

/** Nav button: flips between light and dark (an explicit choice). */
export function ThemeButton() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="theme-btn"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6Z" /></svg>
      )}
    </button>
  );
}

/** Footer control: auto (follow the OS) → light → dark → auto. */
export function ThemeCycle() {
  const [mode, setMode] = useState<'auto' | 'light' | 'dark'>('auto');
  useEffect(() => {
    const read = () => {
      const t = document.documentElement.dataset.theme;
      setMode(t === 'light' || t === 'dark' ? t : 'auto');
    };
    read();
    return onThemeChange(read);
  }, []);
  const cycle = () => {
    const next = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
    setMode(next);
    setTheme(next === 'auto' ? 'system' : next);
  };
  return (
    <button className="toggle" onClick={cycle} aria-label={`Theme: ${mode}. Change theme`}>
      Theme: <b>{mode === 'auto' ? 'match device' : mode}</b>
    </button>
  );
}
