'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/track';

/**
 * Approach section: a list of decisions with a sticky diagram that lights the
 * step currently in view. The list is the content; the diagram is a visual
 * echo of it (aria-hidden).
 */
export function Approach({ items }: { items: { title: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const lis = [...(list.current?.querySelectorAll('li') ?? [])];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(lis.indexOf(e.target as HTMLLIElement));
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    lis.forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  const n = items.length;
  const H = 70 * (n - 1) + 40;

  return (
    <div className="approach">
      <div className="approach-diagram" aria-hidden="true">
        <svg viewBox={`0 0 200 ${H}`}>
          <line x1="20" y1="20" x2="20" y2={H - 20} style={{ stroke: 'var(--border-strong)' }} />
          <line x1="20" y1="20" x2="20" y2={20 + active * 70} style={{ stroke: 'var(--accent-blue)', transition: 'all 480ms var(--ease-out)' }} strokeWidth="2" />
          {items.map((it, i) => (
            <g key={it.title}>
              <circle className="a-node" cx="20" cy={20 + i * 70} r={i === active ? 7 : 5}
                style={{ fill: i <= active ? 'var(--accent-blue)' : 'var(--bg-0)', stroke: i <= active ? 'var(--accent-blue)' : 'var(--border-strong)' }} />
              <text x="38" y={24 + i * 70} style={{ fill: i === active ? 'var(--text-1)' : 'var(--text-3)', fontFamily: 'var(--font-mono-stack)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="approach-items" ref={list}>
        {items.map((it, i) => (
          <li key={it.title} data-active={i === active}>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Reports how far into a case study the visitor read: 25/50/75/100%. */
export function DepthTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const sent = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      const pct = (scrollY / max) * 100;
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark - 1 && !sent.has(mark)) {
          sent.add(mark);
          track('case_study_depth', { slug, depth: mark });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);
  return null;
}
