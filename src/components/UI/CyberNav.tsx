import { useState } from 'react';
import type { SectionId } from '../../types/portfolio';
import { soundFX } from '../../utils/soundEffects';
import { Volume2, VolumeX, Menu, X, Box, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeId } from '../../types/theme';

interface CyberNavProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

const SECTIONS: { id: SectionId; label: string; code: string }[] = [
  { id: 'home', label: 'HOME', code: '01' },
  { id: 'about', label: 'ABOUT', code: '02' },
  { id: 'skills', label: 'SKILLS', code: '03' },
  { id: 'experience', label: 'EXPERIENCE', code: '04' },
  { id: 'projects', label: 'PROJECTS', code: '05' },
  { id: 'contact', label: 'CONTACT', code: '06' },
];

export function CyberNav({
  activeSection,
  onSelectSection,
  audioEnabled,
  onToggleAudio,
}: CyberNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { themeId, setThemeId, theme } = useTheme();
  const themeList: ThemeId[] = ['navy', 'violet', 'teal', 'slate'];

  const handleNextTheme = () => {
    const currentIndex = themeList.indexOf(themeId);
    const next = themeList[(currentIndex + 1) % themeList.length];
    soundFX.playClick();
    setThemeId(next);
  };

  const handleNavClick = (id: SectionId) => {
    soundFX.playClick();
    soundFX.playWarp();
    onSelectSection(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 md:px-8 py-3 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cyber-glass hover:border-cyan-400 transition-all group shadow-lg"
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            RB
          </div>
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
              <span>RAMBABU</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[9px] text-cyan-400/80 tracking-widest uppercase">
              JAVA DEVELOPER // 1.6+ YRS
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links HUD */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl cyber-glass border border-cyan-500/30 font-mono text-xs shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleNavClick(sec.id)}
                onMouseEnter={() => soundFX.playHover()}
                className={`relative px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/25 text-white border border-cyan-400/70 shadow-[0_0_14px_rgba(0,240,255,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span className="text-[9px] text-cyan-400/70">{sec.code}.</span>
                <span className="font-semibold tracking-wider text-[11px]">{sec.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status & Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Non-Black Theme Palette Switcher */}
          <button
            onClick={handleNextTheme}
            title={`Switch Theme Palette (Current: ${theme.name})`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cyber-glass hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-[11px] font-mono shadow-md cursor-pointer group"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="font-bold text-[10px] tracking-wider text-cyan-300">
              {theme.badge}
            </span>
          </button>

          {/* Prominent 3D MODE Indicator Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl cyber-glass border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-md">
            <Box className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">3D MODE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          </div>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={onToggleAudio}
            title={audioEnabled ? 'Mute audio cues' : 'Enable audio cues'}
            className="p-2 rounded-xl cyber-glass hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors shadow-md"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl cyber-glass hover:border-cyan-400 text-slate-300 shadow-md"
          >
            {mobileOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 p-3 rounded-2xl cyber-glass border border-cyan-500/40 pointer-events-auto font-mono text-sm space-y-1 shadow-2xl backdrop-blur-2xl">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleNavClick(sec.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between ${
                activeSection === sec.id
                  ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <span className="tracking-wider">{sec.label}</span>
              <span className="text-xs text-cyan-400/60">{sec.code}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
