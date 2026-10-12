'use client';

import { useEffect, useRef } from 'react';
import { motionReduced, onThemeChange, resolvedTheme } from '@/lib/prefs';
import { palette } from '@/lib/tokens';

// No photo was supplied, so the founder "portrait" is typographic: the
// initials rendered as an ordered-dither dot field in the accent blue. The pointer
// ripples the dots; reduced motion gets one still frame.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export default function Portrait({ initials }: { initials: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const c = canvas?.getContext('2d');
    if (!canvas || !c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, cells: { x: number; y: number; v: number }[] = [];
    const pointer = { x: -999, y: -999 };
    let pal = palette(resolvedTheme());
    const offTheme = onThemeChange(() => { pal = palette(resolvedTheme()); draw(performance.now()); });
    const step = 7;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      // detached (route change before fonts load) or not laid out yet:
      // getImageData throws on a 0-size canvas
      if (w < step || h < step) { cells = []; return; }
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement('canvas');
      off.width = Math.ceil(w / step); off.height = Math.ceil(h / step);
      const o = off.getContext('2d')!;
      const g = o.createRadialGradient(off.width * 0.5, off.height * 0.42, 0, off.width * 0.5, off.height * 0.42, off.width * 0.7);
      g.addColorStop(0, '#555'); g.addColorStop(1, '#000');
      o.fillStyle = g; o.fillRect(0, 0, off.width, off.height);
      o.fillStyle = '#fff';
      o.font = `600 ${Math.round(off.width * 0.62)}px ${getComputedStyle(document.body).fontFamily}`;
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillText(initials, off.width / 2, off.height * 0.46);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      cells = [];
      for (let y = 0; y < off.height; y++) {
        for (let x = 0; x < off.width; x++) {
          const v = data[(y * off.width + x) * 4] / 255;
          if (v > BAYER[(y % 4) * 4 + (x % 4)]) cells.push({ x: x * step + step / 2, y: y * step + step / 2, v });
        }
      }
    };
    const draw = (t: number) => {
      c.clearRect(0, 0, w, h);
      for (const p of cells) {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        const ripple = d < 140 ? Math.sin(d * 0.08 - t * 0.006) * (1 - d / 140) : 0;
        const r = 1.1 + p.v * 1.5 + ripple * 1.2;
        c.fillStyle = p.v > 0.85 ? pal.blue : pal.blueDim;
        c.globalAlpha = 0.45 + p.v * 0.55;
        c.beginPath();
        c.arc(p.x, p.y, Math.max(0.4, r), 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    };
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };

    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      build();
      if (motionReduced()) draw(0);
      else raf = requestAnimationFrame(loop);
    });
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting && !motionReduced()) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
    const leave = () => { pointer.x = -999; pointer.y = -999; };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    const ro = new ResizeObserver(() => { build(); draw(0); });
    ro.observe(canvas);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      offTheme();
      io.disconnect(); ro.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
    };
  }, [initials]);

  return <canvas ref={ref} aria-hidden="true" />;
}
