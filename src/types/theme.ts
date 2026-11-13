export type ThemeId = 'navy' | 'violet' | 'teal' | 'slate';

export interface ColorTheme {
  id: ThemeId;
  name: string;
  badge: string;
  background: string;
  fog: string;
  ambientLight: string;
  primaryLight: string;
  secondaryLight: string;
  rimLight: string;
  deskSurface: string;
  deskLegs: string;
  accentCyan: string;
  accentSecondary: string;
  glassBg: string;
}

export const COLOR_THEMES: Record<ThemeId, ColorTheme> = {
  navy: {
    id: 'navy',
    name: 'Deep Sapphire Navy',
    badge: 'SAPPHIRE',
    background: '#0a192f',
    fog: '#0d2342',
    ambientLight: '#162e56',
    primaryLight: '#38bdf8',
    secondaryLight: '#00f0ff',
    rimLight: '#f59e0b',
    deskSurface: '#13284c',
    deskLegs: '#0e1c36',
    accentCyan: '#00f0ff',
    accentSecondary: '#38bdf8',
    glassBg: 'rgba(13, 33, 62, 0.75)',
  },
  violet: {
    id: 'violet',
    name: 'Cosmic Royal Violet',
    badge: 'VIOLET',
    background: '#150d2a',
    fog: '#20133d',
    ambientLight: '#2c1852',
    primaryLight: '#c084fc',
    secondaryLight: '#a855f7',
    rimLight: '#00f0ff',
    deskSurface: '#241444',
    deskLegs: '#180d2e',
    accentCyan: '#c084fc',
    accentSecondary: '#f43f5e',
    glassBg: 'rgba(32, 18, 60, 0.75)',
  },
  teal: {
    id: 'teal',
    name: 'Bioluminescent Ocean Teal',
    badge: 'TEAL',
    background: '#041d24',
    fog: '#072b36',
    ambientLight: '#0e3d4c',
    primaryLight: '#2dd4bf',
    secondaryLight: '#06b6d4',
    rimLight: '#f59e0b',
    deskSurface: '#0b323e',
    deskLegs: '#06222b',
    accentCyan: '#2dd4bf',
    accentSecondary: '#10b981',
    glassBg: 'rgba(7, 43, 54, 0.75)',
  },
  slate: {
    id: 'slate',
    name: 'Titanium Space Slate',
    badge: 'SLATE',
    background: '#111827',
    fog: '#1a2638',
    ambientLight: '#23344d',
    primaryLight: '#60a5fa',
    secondaryLight: '#38bdf8',
    rimLight: '#f59e0b',
    deskSurface: '#1f2d42',
    deskLegs: '#151f2e',
    accentCyan: '#38bdf8',
    accentSecondary: '#818cf8',
    glassBg: 'rgba(26, 38, 56, 0.75)',
  },
};
