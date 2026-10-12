'use client';

import { useEffect, useRef } from 'react';
import type { WorldKind } from '@/lib/content';
import { detectTier, onThemeChange, resolvedTheme } from '@/lib/prefs';
import { palette, type Palette } from '@/lib/tokens';

// Per-project visual worlds on a 2D canvas: cheaper than a WebGL context per
// project, and enough for a metaphor. Each world reacts to the pointer (or a
// tap), pauses off-screen and when the tab is hidden, and draws a single
// still frame for reduced motion / low-data.
//
//   bubbles  Loopa — carbonation rising; the pointer stirs it
//   grain    Nutriyah — a field of stalks; the pointer is wind
//   circuit  Sri Cauvery — traces with travelling pulses; pointer lights nodes
//   shade    Élaré — drifting shade swatches; the pointer pulls them
//   steam    Ember & Oak — wisps rising from a cup
//   pulse    Care Dental / lab — a rhythm line; the pointer raises amplitude

type P = { x: number; y: number; active: boolean };
type Ctx = { c: CanvasRenderingContext2D; w: number; h: number; t: number; p: P; tint: string; low: boolean; pal: Palette; light: boolean };
type World = { step: (k: Ctx) => void };

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function bubbles(w: number, h: number, low: boolean): World {
  const n = low ? 40 : 80;
  const bs = Array.from({ length: n }, () => ({ x: rand(0, w), y: rand(0, h), r: rand(1.5, 9), v: rand(0.25, 1.1), ph: rand(0, 6.28) }));
  return {
    step({ c, w, h, t, p, tint, pal }) {
      for (const b of bs) {
        b.y -= b.v;
        b.x += Math.sin(t * 0.0015 + b.ph) * 0.35;
        if (p.active) {
          const dx = b.x - p.x, dy = b.y - p.y, d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) { const f = (1 - Math.sqrt(d2) / 120) * 2.2; b.x += (dx / (Math.sqrt(d2) + 1)) * f; b.y += (dy / (Math.sqrt(d2) + 1)) * f; }
        }
        if (b.y < -12) { b.y = h + 12; b.x = rand(0, w); }
        c.beginPath();
        c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        c.strokeStyle = rgba(tint, 0.25 + b.r / 30);
        c.lineWidth = 1;
        c.stroke();
        c.beginPath();
        c.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, Math.PI * 2);
        c.fillStyle = rgba(pal.text1, 0.18);
        c.fill();
      }
    },
  };
}

function grain(w: number, h: number, low: boolean): World {
  const rows = low ? 9 : 14;
  const per = low ? 26 : 44;
  const stalks: { x: number; y: number; len: number; ph: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const y = h * 0.28 + (r / (rows - 1)) * h * 0.66;
    for (let i = 0; i < per; i++) stalks.push({ x: (i / per) * w + rand(-6, 6) + (r % 2) * (w / per / 2), y, len: 10 + (r / rows) * 26, ph: rand(0, 6.28) });
  }
  return {
    step({ c, t, p, tint }) {
      c.lineWidth = 1.2;
      for (const s of stalks) {
        let sway = Math.sin(t * 0.0012 + s.x * 0.012 + s.ph * 0.3) * 0.25;
        if (p.active) { const d = Math.abs(s.x - p.x) + Math.abs(s.y - p.y) * 0.5; if (d < 160) sway += ((p.x < s.x ? 1 : -1) * (1 - d / 160)) * 0.9; }
        const tx = s.x + Math.sin(sway) * s.len, ty = s.y - Math.cos(sway) * s.len;
        c.beginPath();
        c.moveTo(s.x, s.y);
        c.quadraticCurveTo(s.x, s.y - s.len * 0.5, tx, ty);
        c.strokeStyle = rgba(tint, 0.18 + (s.y / c.canvas.height) * 0.5);
        c.stroke();
        c.beginPath();
        c.ellipse(tx, ty, 1.6, 3.2, sway, 0, Math.PI * 2);
        c.fillStyle = rgba(tint, 0.55);
        c.fill();
      }
    },
  };
}

function circuit(w: number, h: number, low: boolean): World {
  const g = 28;
  const traces: { pts: [number, number][]; len: number }[] = [];
  const count = low ? 14 : 26;
  for (let i = 0; i < count; i++) {
    let x = Math.round(rand(0, w) / g) * g, y = Math.round(rand(0, h) / g) * g;
    const pts: [number, number][] = [[x, y]];
    for (let s = 0; s < 6; s++) {
      if (Math.random() < 0.5) x += g * Math.round(rand(-4, 4)); else y += g * Math.round(rand(-3, 3));
      pts.push([x, y]);
    }
    let len = 0;
    for (let k = 1; k < pts.length; k++) len += Math.abs(pts[k][0] - pts[k - 1][0]) + Math.abs(pts[k][1] - pts[k - 1][1]);
    traces.push({ pts, len: Math.max(len, 1) });
  }
  const pulses = traces.map((tr) => ({ tr, at: rand(0, tr.len), v: rand(0.8, 2.2) }));
  const pointAt = (tr: { pts: [number, number][] }, d: number): [number, number] => {
    for (let k = 1; k < tr.pts.length; k++) {
      const [ax, ay] = tr.pts[k - 1], [bx, by] = tr.pts[k];
      const seg = Math.abs(bx - ax) + Math.abs(by - ay);
      if (d <= seg) { const f = seg ? d / seg : 0; return [ax + (bx - ax) * f, ay + (by - ay) * f]; }
      d -= seg;
    }
    return tr.pts[tr.pts.length - 1];
  };
  return {
    step({ c, p, tint, pal }) {
      c.lineWidth = 1;
      for (const tr of traces) {
        c.beginPath();
        tr.pts.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.strokeStyle = rgba(tint, 0.16);
        c.stroke();
        for (const [x, y] of [tr.pts[0], tr.pts[tr.pts.length - 1]]) {
          const lit = p.active && Math.hypot(x - p.x, y - p.y) < 90;
          c.beginPath();
          c.arc(x, y, lit ? 4 : 2.5, 0, Math.PI * 2);
          c.fillStyle = lit ? rgba(pal.lime, 0.95) : rgba(tint, 0.5);
          c.fill();
        }
      }
      for (const pu of pulses) {
        pu.at = (pu.at + pu.v) % pu.tr.len;
        const [x, y] = pointAt(pu.tr, pu.at);
        c.beginPath();
        c.arc(x, y, 2.2, 0, Math.PI * 2);
        c.fillStyle = rgba(tint, 0.95);
        c.shadowColor = rgba(tint, 0.9);
        c.shadowBlur = 8;
        c.fill();
        c.shadowBlur = 0;
      }
    },
  };
}

function shade(w: number, h: number, low: boolean): World {
  const shades = ['#C9A3A8', '#B88A84', '#9E6F6A', '#D8B9AE', '#7E5A63', '#8FA9D8'];
  const blobs = Array.from({ length: low ? 6 : 10 }, (_, i) => ({ x: rand(0.1, 0.9) * w, y: rand(0.15, 0.85) * h, r: rand(0.12, 0.26) * Math.min(w, h) + 40, col: shades[i % shades.length], ph: rand(0, 6.28), sp: rand(0.0002, 0.0005) }));
  return {
    step({ c, w, h, t, p, light }) {
      // 'lighter' glows on dark; on a light ground it would wash out to white
      c.globalCompositeOperation = light ? 'multiply' : 'lighter';
      for (const b of blobs) {
        let x = b.x + Math.sin(t * b.sp + b.ph) * w * 0.06, y = b.y + Math.cos(t * b.sp * 1.3 + b.ph) * h * 0.06;
        if (p.active) { x += (p.x - x) * 0.12; y += (p.y - y) * 0.12; }
        const g = c.createRadialGradient(x, y, 0, x, y, b.r);
        g.addColorStop(0, rgba(b.col, 0.32));
        g.addColorStop(1, rgba(b.col, 0));
        c.fillStyle = g;
        c.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);
      }
      c.globalCompositeOperation = 'source-over';
      // swatch strip — the "shade" the visitor is choosing between
      const sw = Math.min(28, w / 16);
      shades.slice(0, 5).forEach((col, i) => {
        c.fillStyle = rgba(col, 0.85);
        c.fillRect(w - (5 - i) * (sw + 6) - 18, h - sw - 18, sw, sw);
      });
    },
  };
}

function steam(w: number, h: number, low: boolean): World {
  const wisps = Array.from({ length: low ? 6 : 11 }, (_, i) => ({ x: w * 0.5 + (i - 5) * 9, ph: rand(0, 6.28), sp: rand(0.0006, 0.0012), amp: rand(14, 34) }));
  return {
    step({ c, w, h, t, p, tint, pal }) {
      const base = h * 0.82;
      c.lineWidth = 1.2;
      for (const s of wisps) {
        c.beginPath();
        for (let y = base; y > h * 0.08; y -= 6) {
          const k = (base - y) / base;
          let x = s.x + Math.sin(y * 0.02 + t * s.sp * 2 + s.ph) * s.amp * k;
          if (p.active) x += (p.x - x) * 0.25 * k;
          y === base ? c.moveTo(x, y) : c.lineTo(x, y);
        }
        c.strokeStyle = rgba(tint, 0.28);
        c.stroke();
      }
      // cup
      c.strokeStyle = rgba(pal.text2, 0.5);
      c.beginPath();
      c.moveTo(w * 0.5 - 46, base + 6);
      c.quadraticCurveTo(w * 0.5, base + 74, w * 0.5 + 46, base + 6);
      c.stroke();
    },
  };
}

function pulse(w: number, h: number): World {
  return {
    step({ c, w, h, t, p, tint }) {
      for (let line = 0; line < 3; line++) {
        const y0 = h * (0.35 + line * 0.15);
        const amp = (p.active ? 1 - Math.min(Math.abs(p.y - y0) / h, 1) : 0.3) * 38 + 4;
        c.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const ph = ((x + t * 0.12 + line * 140) % 260) / 260;
          const beat = ph > 0.42 && ph < 0.52 ? Math.sin((ph - 0.42) * Math.PI * 20) * amp : Math.sin(x * 0.03 + t * 0.002) * 2;
          x ? c.lineTo(x, y0 - beat) : c.moveTo(x, y0 - beat);
        }
        c.strokeStyle = rgba(tint, 0.25 + line * 0.2);
        c.lineWidth = 1.2;
        c.stroke();
      }
    },
  };
}

const BUILD: Record<WorldKind, (w: number, h: number, low: boolean) => World> = { bubbles, grain, circuit, shade, steam, pulse };

export default function WorldCanvas({ kind, tint }: { kind: WorldKind; tint: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;
    const tier = detectTier();
    const low = tier !== 'high';
    const still = tier === 'static';
    const dpr = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.5);
    const p: P = { x: 0, y: 0, active: false };
    let light = resolvedTheme() === 'light';
    let pal = palette(light ? 'light' : 'dark');
    let world!: World;
    let w = 0, h = 0, raf = 0, visible = false, t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      world = BUILD[kind](w, h, low);
    };
    const frame = (now: number) => {
      c.clearRect(0, 0, w, h);
      world.step({ c, w, h, t: now - t0, p, tint, low, pal, light });
    };
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (still) {
      // advance a little so the still frame isn't the empty initial state
      for (let i = 0; i < 90; i++) world.step({ c, w, h, t: i * 16, p, tint, low, pal, light });
      c.clearRect(0, 0, w, h);
      frame(1600);
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); if (still) frame(1600); });
    ro.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    const offTheme = onThemeChange(() => {
      light = resolvedTheme() === 'light';
      pal = palette(light ? 'light' : 'dark');
      if (still) frame(1600);
    });
    document.addEventListener('visibilitychange', onVis);

    const host = canvas.parentElement ?? canvas;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
      p.active = true;
    };
    const leave = () => { p.active = false; };
    let tapTimer: ReturnType<typeof setTimeout> | undefined;
    const tap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      move(e);
      clearTimeout(tapTimer);
      tapTimer = setTimeout(leave, 900); // touch: a tap is a short pulse
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointerdown', tap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(tapTimer);
      offTheme();
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerdown', tap);
    };
  }, [kind, tint]);

  return <canvas ref={ref} aria-hidden="true" data-world={kind} />;
}
