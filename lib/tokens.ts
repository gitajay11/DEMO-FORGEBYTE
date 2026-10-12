// Typed mirror of styles/tokens.css for code that can't read CSS variables
// cheaply (three.js materials, 2D canvas worlds). Change both together.

export const tokens = {
  color: {
    bg0: '#0B0B0E',
    bg1: '#121218',
    bg2: '#1A1A22',
    graphite: '#2A2A33',
    text1: '#F2F0F6',
    text2: '#B9B5C4',
    text3: '#8A8698',
    violet: '#A78BFA',
    violetDim: '#6D5BA8',
    lime: '#D5FF70',
    danger: '#FF6B6B',
  },
  motion: {
    micro: 120,
    short: 240,
    base: 480,
    long: 900,
    scene: 2000,
    easeOut: [0.16, 1, 0.3, 1] as const,
    easeInOut: [0.65, 0, 0.35, 1] as const,
  },
  breakpoint: { sm: 480, md: 768, lg: 1024, xl: 1280, xxl: 1600 },
} as const;

export type Tokens = typeof tokens;
