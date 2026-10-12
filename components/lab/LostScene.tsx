'use client';

import { useEffect, useRef } from 'react';
import { motionReduced, onThemeChange, resolvedTheme } from '@/lib/prefs';
import { palette } from '@/lib/tokens';

/**
 * 404: particles you can scatter. They drift back toward a loose ring; the
 * pointer (or a tap) pushes them away. One still frame for reduced motion.
 */
export default function LostScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const c = canvas?.getContext('2d');
    if (!canvas || !c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const N = coarse ? 260 : 520;
    let w = 0, h = 0, raf = 0;
    let pal = palette(resolvedTheme());
    const ptr = { x: -9999, y: -9999, down: 0 };
    const ps = Array.from({ length: N }, (_, i) => ({ a: (i / N) * Math.PI * 2, r: 0.55 + Math.random() * 0.45, x: 0, y: 0, vx: 0, vy: 0, s: 0.6 + Math.random() * 1.8 }));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const R = Math.min(w, h) * 0.32;
      ps.forEach((p) => { p.x = w * 0.68 + Math.cos(p.a) * R * p.r; p.y = h * 0.5 + Math.sin(p.a) * R * p.r; });
    };
    const step = (t: number) => {
      const R = Math.min(w, h) * 0.32;
      c.clearRect(0, 0, w, h);
      for (const p of ps) {
        const hx = w * 0.68 + Math.cos(p.a + t * 0.00008) * R * p.r;
        const hy = h * 0.5 + Math.sin(p.a + t * 0.00008) * R * p.r;
        p.vx += (hx - p.x) * 0.0025; p.vy += (hy - p.y) * 0.0025;
        const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy);
        const reach = ptr.down ? 260 : 130;
        if (d < reach) { const f = (1 - d / reach) * (ptr.down ? 6 : 1.6); p.vx += (dx / (d || 1)) * f; p.vy += (dy / (d || 1)) * f; }
        p.vx *= 0.92; p.vy *= 0.92;
        p.x += p.vx; p.y += p.vy;
        c.fillStyle = p.s > 2.2 ? pal.lime : pal.blue;
        c.globalAlpha = 0.35 + p.s * 0.25;
        c.beginPath(); c.arc(p.x, p.y, p.s, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;
      ptr.down = Math.max(0, ptr.down - 0.05);
    };
    const loop = (t: number) => { step(t); raf = requestAnimationFrame(loop); };

    resize();
    if (motionReduced()) step(0);
    else raf = requestAnimationFrame(loop);

    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
    const down = (e: PointerEvent) => { move(e); ptr.down = 1; };
    const leave = () => { ptr.x = ptr.y = -9999; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    document.addEventListener('pointerleave', leave);
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const offTheme = onThemeChange(() => { pal = palette(resolvedTheme()); if (motionReduced()) step(0); });
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); offTheme();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
