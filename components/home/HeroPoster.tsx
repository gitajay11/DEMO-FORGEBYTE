// Static stand-in for the 3D sculpture: shown underneath the canvas, and on
// its own for reduced motion, Save-Data, no WebGL or no JavaScript. Same
// composition as the scene: core, three tilted orbits, a scatter of points.

// Deterministic "random" points so server and client markup match.
const POINTS = Array.from({ length: 140 }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180;
  const r = 150 + ((i * 53) % 110);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.42 + Math.sin(i) * 10, s: 0.8 + ((i * 7) % 10) / 8, lime: i % 47 === 0 };
});

export default function HeroPoster() {
  return (
    <div className="hero-poster" aria-hidden="true">
      <svg viewBox="-320 -320 640 640">
        <defs>
          <radialGradient id="core" cx="40%" cy="38%" r="65%">
            <stop offset="0%" style={{ stopColor: 'var(--bg-2)' }} />
            <stop offset="70%" style={{ stopColor: 'var(--bg-1)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--accent-blue)', stopOpacity: 0.8 }} />
          </radialGradient>
        </defs>
        <g fill="none" strokeWidth="1">
          <ellipse rx="190" ry="62" style={{ stroke: 'var(--accent-blue)' }} strokeOpacity="0.55" transform="rotate(-18)" />
          <ellipse rx="232" ry="96" style={{ stroke: 'var(--accent-blue-dim)' }} strokeOpacity="0.5" transform="rotate(24)" />
          <ellipse rx="272" ry="44" style={{ stroke: 'var(--text-2)' }} strokeOpacity="0.22" transform="rotate(-6)" />
        </g>
        <circle r="118" fill="url(#core)" />
        <circle r="118" style={{ fill: 'none', stroke: 'var(--accent-blue)' }} strokeOpacity="0.6" />
        {POINTS.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.s.toFixed(2)} style={{ fill: p.lime ? 'var(--accent-lime)' : 'var(--accent-blue)' }} fillOpacity={p.lime ? 0.9 : 0.55} />
        ))}
      </svg>
    </div>
  );
}
