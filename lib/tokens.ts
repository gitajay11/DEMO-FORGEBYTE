// Typed mirror of styles/tokens.css for code that can't read CSS variables
// cheaply (three.js materials, 2D canvas worlds). Change both together.

const dark = {
  bg0: '#0A0C10',
  bg1: '#11141B',
  bg2: '#181C25',
  graphite: '#262B36',
  text1: '#F0F3F8',
  text2: '#B4BCCB',
  text3: '#8792A6',
  blue: '#7CA9FF',
  blueDim: '#3B5C9E',
  lime: '#D5FF70',
  danger: '#FF6B6B',
};

const light: typeof dark = {
  bg0: '#F5F7FA',
  bg1: '#FFFFFF',
  bg2: '#EBEFF5',
  graphite: '#D3DAE5',
  text1: '#0B1220',
  text2: '#3A4556',
  text3: '#56627A',
  blue: '#1F5BD8',
  blueDim: '#8DAEEB',
  lime: '#B9E846',
  danger: '#C42B2B',
};

export const tokens = {
  /** Dark theme colours (the default). Use palette(theme) when it varies. */
  color: dark,
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

export function palette(theme: 'light' | 'dark') {
  return theme === 'light' ? light : dark;
}

export type Palette = typeof dark;
export type Tokens = typeof tokens;
