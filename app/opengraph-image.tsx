import { ImageResponse } from 'next/og';

// Generated at build time: dark ground, oversized type, blue accent.
export const alt = 'Forgebyte — We build things. We question things.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'radial-gradient(circle at 78% 46%, rgba(124,169,255,0.28), rgba(10,12,16,0) 38%), #0A0C10',
          color: '#F0F3F8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 3, color: '#8792A6' }}>
          <span>FORGEBYTE — EST. 2026</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 10, background: '#D5FF70' }} />
            ACCEPTING PROJECTS
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 104, lineHeight: 0.95, letterSpacing: -4, fontWeight: 700 }}>
          <span>We build things.</span>
          <span style={{ color: '#7CA9FF' }}>We question things.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#B4BCCB' }}>
          Websites · Online stores · Apps — built in Chennai, for clients anywhere
        </div>
      </div>
    ),
    size
  );
}
