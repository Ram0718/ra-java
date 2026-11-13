import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { COLOR_THEMES, type ThemeId, type ColorTheme } from '../types/theme';
import defaultProfilePhoto from '../assets/profile.jpg';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ColorTheme;
  setThemeId: (id: ThemeId) => void;
  // Video on Home Page state
  monitorMode: 'video' | 'terminal';
  setMonitorMode: (mode: 'video' | 'terminal') => void;
  videoSource: string | null;
  setVideoSource: (src: string | null) => void;
  videoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
  videoMuted: boolean;
  setVideoMuted: (muted: boolean) => void;
  heroVideoOpen: boolean;
  setHeroVideoOpen: (open: boolean) => void;
  // Hanging ID Card Photo
  profilePhoto: string | null;
  setProfilePhoto: (url: string | null) => void;
  badgeModalOpen: boolean;
  setBadgeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('navy');
  const [monitorMode, setMonitorMode] = useState<'video' | 'terminal'>('video');
  const [videoSource, setVideoSource] = useState<string | null>('/video.mp4');
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [heroVideoOpen, setHeroVideoOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(defaultProfilePhoto);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);

  const theme = COLOR_THEMES[themeId] || COLOR_THEMES.navy;

  // Sync theme background and colors with body & document
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.documentElement.style.setProperty('--cyber-bg', theme.background);
    document.documentElement.style.setProperty('--cyber-ambient', theme.ambientLight);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme.background);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme,
        setThemeId,
        monitorMode,
        setMonitorMode,
        videoSource,
        setVideoSource,
        videoPlaying,
        setVideoPlaying,
        videoMuted,
        setVideoMuted,
        heroVideoOpen,
        setHeroVideoOpen,
        profilePhoto,
        setProfilePhoto,
        badgeModalOpen,
        setBadgeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
