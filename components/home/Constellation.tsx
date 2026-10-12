'use client';

import { useEffect, useRef, useState } from 'react';
import type { Service } from '@/lib/content';
import { motionReduced } from '@/lib/prefs';
import { glyphPath } from './Glyph';

type Item = Pick<Service, 'slug' | 'name' | 'glyph' | 'index'>;

/**
 * Services as nodes on a tilted orbit. Whichever service article is in view
 * rotates to the front. Decorative: the service list beside it carries all
 * the content, so the SVG is aria-hidden.
 */
export default function Constellation({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const angle = useRef(0);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const articles = items.map((s) => document.getElementById(s.slug)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(articles.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    articles.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const n = items.length;
    const nodes = [...el.querySelectorAll<SVGGElement>('.c-node')];
    const links = [...el.querySelectorAll<SVGLineElement>('.c-link')];
    let raf = 0;
    const target = -(active / n) * Math.PI * 2;
    const draw = () => {
      // shortest way round
      let d = target - angle.current;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      angle.current += motionReduced() ? d : d * 0.08;
      const pts = nodes.map((node, i) => {
        const a = angle.current + (i / n) * Math.PI * 2 + Math.PI / 2;
        const x = Math.cos(a) * 150, z = Math.sin(a); // z: 1 = front
        const y = Math.sin(a) * 70 + 10;
        const s = 0.6 + (z + 1) * 0.55;
        node.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`);
        node.style.opacity = String(0.25 + (z + 1) * 0.375);
        return [x, y];
      });
      links.forEach((l, i) => {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
        l.setAttribute('x1', String(x1)); l.setAttribute('y1', String(y1));
        l.setAttribute('x2', String(x2)); l.setAttribute('y2', String(y2));
      });
      if (Math.abs(d) > 0.001) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, items.length]);

  const current = items[active] ?? items[0];

  return (
    <div className="constellation" aria-hidden="true">
      <svg ref={svg} viewBox="-220 -200 440 400">
        <ellipse cx="0" cy="10" rx="150" ry="70" style={{ fill: 'none', stroke: 'var(--graphite)' }} strokeDasharray="2 6" />
        <circle cx="0" cy="10" r="3" style={{ fill: 'var(--accent-blue)' }} />
        {items.map((_, i) => (
          <line key={i} className="c-link" style={{ stroke: 'var(--graphite)' }} strokeWidth="1" />
        ))}
        {items.map((s, i) => (
          <g key={s.slug} className="c-node">
            <path d={glyphPath(s.glyph)} transform="scale(1.6)" style={{ fill: 'var(--bg-0)', stroke: i === active ? 'var(--accent-blue)' : 'var(--text-3)' }} strokeWidth="0.8" />
          </g>
        ))}
        <text x="0" y="-150" textAnchor="middle" className="c-label">[{current.index}] {current.name}</text>
      </svg>
    </div>
  );
}
