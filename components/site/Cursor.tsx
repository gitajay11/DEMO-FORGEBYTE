'use client';

import { useEffect, useRef, useState } from 'react';
import { motionReduced, useCustomCursor } from '@/lib/prefs';

type State = 'default' | 'link' | 'view' | 'drag' | 'external' | 'text' | 'hidden';

const LABEL: Partial<Record<State, string>> = { view: 'View', drag: 'Drag', external: '↗' };

function stateFor(el: Element | null): State {
  if (!el) return 'default';
  if (el.closest('input, textarea, select, [contenteditable="true"]')) return 'text';
  const tagged = el.closest<HTMLElement>('[data-cursor]');
  if (tagged) return (tagged.dataset.cursor as State) ?? 'link';
  const link = el.closest('a, button, summary, label');
  if (!link) return 'default';
  if (link instanceof HTMLAnchorElement && link.target === '_blank') return 'external';
  return 'link';
}

/**
 * Dot + ring cursor for fine pointers. Never on touch, never delays clicks,
 * hides itself over text inputs so the native caret shows. Footer toggle
 * switches back to the system cursor (persisted).
 */
export default function Cursor() {
  const enabled = useCustomCursor();
  const [fine, setFine] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('hidden');

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const on = enabled && fine;

  useEffect(() => {
    document.body.classList.toggle('cursor-on', on);
    if (!on) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const loop = () => {
      const k = motionReduced() ? 1 : 0.22; // spring-ish follow for the ring
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      x = e.clientX;
      y = e.clientY;
      setState(stateFor(e.target as Element));
    };
    const leave = () => setState('hidden');
    raf = requestAnimationFrame(loop);
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.body.classList.remove('cursor-on');
    };
  }, [on]);

  if (!on) return null;
  return (
    <div className="cursor" data-state={state} ref={root} aria-hidden="true">
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring}>{LABEL[state] ?? ''}</div>
    </div>
  );
}
