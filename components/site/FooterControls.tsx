'use client';

import { useEffect, useState } from 'react';
import { setCursor, setMotion, useCustomCursor, useReducedMotion } from '@/lib/prefs';
import { studio } from '@/lib/content';
import { ThemeCycle } from './ThemeToggle';

/** Live local clock for the studio's city. */
export function StudioClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: studio.timeZone,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="mono">
      {studio.city} <span className="mono-plain" style={{ color: 'var(--text-1)', fontSize: 'inherit' }}>{now ?? '--:--:--'}</span> IST
    </span>
  );
}

export function PrefToggles() {
  const reduced = useReducedMotion();
  const custom = useCustomCursor();
  return (
    <>
      <ThemeCycle />
      <button className="toggle" onClick={() => setMotion(!reduced)} aria-pressed={reduced}>
        Motion: <b>{reduced ? 'reduced' : 'full'}</b>
      </button>
      <button className="toggle toggle-cursor" onClick={() => setCursor(!custom)} aria-pressed={!custom}>
        Cursor: <b>{custom ? 'custom' : 'system'}</b>
      </button>
    </>
  );
}
