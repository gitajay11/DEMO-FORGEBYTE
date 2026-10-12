import type { Service } from '@/lib/content';

// Wireframe primitives, one per service. Plain SVG so they render on the
// server (mobile list) and inside the constellation alike.
const PATHS: Record<Service['glyph'], string> = {
  cube: 'M-10 -6 L0 -12 L10 -6 L10 6 L0 12 L-10 6 Z M-10 -6 L0 0 L10 -6 M0 0 L0 12',
  torus: 'M-12 0 A12 5 0 1 0 12 0 A12 5 0 1 0 -12 0 M-6 0 A6 2.4 0 1 0 6 0 A6 2.4 0 1 0 -6 0',
  octa: 'M0 -13 L11 0 L0 13 L-11 0 Z M0 -13 L3 0 L0 13 M-11 0 L3 0 L11 0',
  icosa: 'M0 -12 L10.4 -6 L10.4 6 L0 12 L-10.4 6 L-10.4 -6 Z M0 -12 L-5 2 L5 2 Z M-10.4 -6 L-5 2 M10.4 -6 L5 2 M-5 2 L0 12 L5 2 M-10.4 6 L-5 2 M10.4 6 L5 2',
  ring: 'M-12 0 A12 12 0 1 0 12 0 A12 12 0 1 0 -12 0 M-12 0 A12 4 0 1 0 12 0',
};

export function glyphPath(g: Service['glyph']) {
  return PATHS[g];
}

export default function Glyph({ kind, className }: { kind: Service['glyph']; className?: string }) {
  return (
    <svg className={className} viewBox="-15 -15 30 30" aria-hidden="true">
      <path d={PATHS[kind]} fill="none" stroke="var(--accent-violet)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
