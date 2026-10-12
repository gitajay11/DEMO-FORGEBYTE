'use client';

import { useEffect, useRef, useState } from 'react';
import { motionReduced } from '@/lib/prefs';

// Scattered words organise into a structure as the section scrolls through.
// Positions are percentages of the field: [scattered] → [structured].
const NODES = [
  { id: 'idea', from: [8, 66], to: [4, 34], note: 'Every project starts as one. We write it down in plain words before anything else.' },
  { id: 'user', from: [58, 12], to: [29, 18], note: 'Who uses it, how often, on what device. That decides more than the stack does.' },
  { id: 'constraint', from: [33, 58], to: [29, 56], note: 'Budget, deadline, team, legacy systems. We find them early, because they shape the design.' },
  { id: 'data', from: [80, 70], to: [55, 37], note: 'What exists, who owns it, and what must never be wrong.' },
  { id: 'deadline', from: [72, 24], to: [80, 37], note: 'We plan backwards from the date that matters, and say early if it cannot hold.' },
] as const;
const LINKS: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
const STAGES = ['question', 'reason', 'design', 'build'];

export default function IdeaField() {
  const field = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const lines = useRef<(SVGLineElement | null)[]>([]);
  const [note, setNote] = useState('Hover or focus a word to see what we ask about it.');

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    let raf = 0;
    const place = (p: number) => {
      const e = p * p * (3 - 2 * p);
      const pts = NODES.map((n) => [n.from[0] + (n.to[0] - n.from[0]) * e, n.from[1] + (n.to[1] - n.from[1]) * e]);
      const w = el.clientWidth, h = el.clientHeight;
      // keep every node fully inside the field on narrow screens
      pts.forEach((pt, i) => {
        const node = nodes.current[i];
        if (!node) return;
        const maxX = ((w - node.offsetWidth - 2) / w) * 100;
        pt[0] = Math.min(pt[0], Math.max(0, maxX));
        node.style.left = `${pt[0]}%`;
        node.style.top = `${pt[1]}%`;
      });
      LINKS.forEach(([a, b], i) => {
        const l = lines.current[i];
        const na = nodes.current[a], nb = nodes.current[b];
        if (!l || !na || !nb) return;
        l.setAttribute('x1', String((pts[a][0] / 100) * w + na.offsetWidth));
        l.setAttribute('y1', String((pts[a][1] / 100) * h + na.offsetHeight / 2));
        l.setAttribute('x2', String((pts[b][0] / 100) * w));
        l.setAttribute('y2', String((pts[b][1] / 100) * h + nb.offsetHeight / 2));
        l.style.opacity = String(Math.max(0, (e - 0.55) / 0.45));
      });
    };
    const update = () => {
      raf = 0;
      if (motionReduced()) return place(1);
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the field enters at the bottom, 1 when it sits a third up
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
      place(p);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="idea-field" ref={field}>
      <svg aria-hidden="true">
        {LINKS.map((_, i) => (
          <line key={i} ref={(l) => { lines.current[i] = l; }} strokeWidth="1" strokeDasharray="3 4" style={{ opacity: 0, stroke: 'var(--accent-blue-dim)' }} />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <button
          key={n.id}
          type="button"
          className="node"
          ref={(b) => { nodes.current[i] = b; }}
          style={{ left: `${n.from[0]}%`, top: `${n.from[1]}%`, transform: 'none' }}
          onMouseEnter={() => setNote(n.note)}
          onFocus={() => setNote(n.note)}
          onClick={() => setNote(n.note)}
          aria-describedby="idea-note"
        >
          {n.id}
        </button>
      ))}
      <p className="idea-note" id="idea-note" aria-live="polite">{note}</p>
      <div className="stages" aria-hidden="true">
        {STAGES.map((s, i) => (
          <span key={s} className="mono">{s}{i < STAGES.length - 1 ? ' →' : ''}</span>
        ))}
      </div>
    </div>
  );
}
