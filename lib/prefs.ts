'use client';

import { useEffect, useState } from 'react';

// User-facing toggles (footer) layered over OS settings. The inline script in
// app/layout.tsx applies the stored values to <html> before first paint, so
// these hooks only read what is already there and listen for changes.

export const MOTION_KEY = 'fb-motion'; // 'reduced' | 'full' | absent = follow OS
export const CURSOR_KEY = 'fb-cursor'; // 'system' | absent = custom
export const THEME_KEY = 'fb-theme'; // 'light' | 'dark' | absent = follow OS
const EVENT = 'fb-prefs';

function osReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function motionReduced(): boolean {
  const attr = document.documentElement.dataset.motion;
  if (attr === 'reduced') return true;
  if (attr === 'full') return false;
  return osReducedMotion();
}

export function setMotion(reduced: boolean) {
  const value = reduced ? 'reduced' : 'full';
  document.documentElement.dataset.motion = value;
  try { localStorage.setItem(MOTION_KEY, value); } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function cursorCustom(): boolean {
  return document.documentElement.dataset.cursor !== 'system';
}

export function setCursor(custom: boolean) {
  const value = custom ? 'custom' : 'system';
  document.documentElement.dataset.cursor = value;
  try { localStorage.setItem(CURSOR_KEY, value); } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export type Theme = 'light' | 'dark';

/** The theme actually showing: explicit choice, else the OS preference. */
export function resolvedTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function setTheme(theme: Theme | 'system') {
  const root = document.documentElement;
  if (theme === 'system') {
    delete root.dataset.theme;
    try { localStorage.removeItem(THEME_KEY); } catch {}
  } else {
    root.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Subscribe to theme changes from the toggle or the OS. Returns cleanup. */
export function onThemeChange(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  window.addEventListener(EVENT, cb);
  mq.addEventListener('change', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq.removeEventListener('change', cb);
  };
}

function usePref<T>(read: () => T, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const update = () => setValue(read());
    update();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cs = window.matchMedia('(prefers-color-scheme: light)');
    window.addEventListener(EVENT, update);
    mq.addEventListener('change', update);
    cs.addEventListener('change', update);
    return () => {
      window.removeEventListener(EVENT, update);
      mq.removeEventListener('change', update);
      cs.removeEventListener('change', update);
    };
  }, [read]);
  return value;
}

export const useReducedMotion = () => usePref(motionReduced, false);
export const useTheme = () => usePref(resolvedTheme, 'dark' as Theme);
export const useCustomCursor = () => usePref(cursorCustom, true);

export type DeviceTier = 'high' | 'low' | 'static';

/**
 * Decides scene quality: 'static' shows the poster (reduced motion, Save-Data,
 * no WebGL), 'low' halves particles and caps pixel ratio (touch, low memory or
 * few cores), 'high' gets everything.
 */
export function detectTier(): DeviceTier {
  if (motionReduced()) return 'static';
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return 'static';
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return 'static';
  } catch {
    return 'static';
  }
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowMem = (nav.deviceMemory ?? 8) <= 4;
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  return coarse || lowMem || fewCores ? 'low' : 'high';
}

export function useDeviceTier(): DeviceTier | null {
  const [tier, setTier] = useState<DeviceTier | null>(null);
  useEffect(() => {
    const update = () => setTier(detectTier());
    update();
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return tier;
}
