import { Html } from '@react-three/drei';
import { HolographicButton } from './HolographicButton';
import type { SectionId } from '../../types/portfolio';
import { DEVELOPER_PROFILE } from '../../data/portfolio';
import { ArrowRight, Mail, Terminal, User, Cpu, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeroContentProps {
  onNavigate: (section: SectionId) => void;
  visible: boolean;
}

export function HeroContent({ onNavigate, visible }: HeroContentProps) {
  const { setHeroVideoOpen } = useTheme();
  if (!visible) return null;

  return (
    <group position={[0, 2.35, 0.6]}>
      <Html
        transform
        distanceFactor={3.6}
        center
        className="pointer-events-auto select-none"
      >
        <div className="w-[640px] max-w-[92vw] text-center flex flex-col items-center">
          {/* Top Cyber Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full cyber-glass border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-widest uppercase text-[11px]">System Online // Java 21 LTS</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-bold">{DEVELOPER_PROFILE.experienceYears} Years Exp</span>
          </div>

          {/* Large Floating Holographic Title */}
          <div className="relative my-1">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-300 font-mono drop-shadow-[0_0_25px_rgba(0,240,255,0.6)]">
              {DEVELOPER_PROFILE.name.toUpperCase()}
            </h1>
            <div className="absolute -inset-1 blur-xl bg-cyan-500/20 -z-10 rounded-full pointer-events-none" />
          </div>

          {/* Subtitle Badge */}
          <div className="my-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg md:text-xl font-bold tracking-[0.25em] text-cyan-300 font-mono uppercase">
              {DEVELOPER_PROFILE.role}
            </h2>
          </div>

          {/* Additional Text Description */}
          <p className="mt-3 text-slate-300 text-sm md:text-base font-mono max-w-lg leading-relaxed bg-black/40 backdrop-blur-md p-2.5 rounded-lg border border-slate-700/50">
            {DEVELOPER_PROFILE.tagline}
          </p>

          {/* Key Tech Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-md">
            {DEVELOPER_PROFILE.techBadges.slice(0, 8).map((badge) => (
              <span
                key={badge.label}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400/50 transition-colors"
              >
                {badge.label}
              </span>
            ))}
          </div>

          {/* Featured Hero Video Launcher Button */}
          <div className="mt-5">
            <button
              onClick={() => setHeroVideoOpen(true)}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-sky-500/30 to-indigo-500/25 hover:from-cyan-500/40 hover:to-indigo-500/40 border border-cyan-400 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2.5 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 transition-all cursor-pointer group"
            >
              <span className="p-1 rounded-full bg-cyan-400 text-black group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              <span>WATCH HERO VIDEO</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>
          </div>

          {/* Interactive 3D Holographic Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <HolographicButton
              label="PROJECTS (eAshaOP)"
              variant="cyan"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('projects')}
            />
            <HolographicButton
              label="ABOUT & EXPERIENCE"
              variant="purple"
              icon={<User className="w-4 h-4" />}
              onClick={() => onNavigate('about')}
            />
            <HolographicButton
              label="SKILLS UNIVERSE"
              variant="cyan"
              icon={<Cpu className="w-4 h-4" />}
              onClick={() => onNavigate('skills')}
            />
            <HolographicButton
              label="CONTACT ME"
              variant="emerald"
              icon={<Mail className="w-4 h-4" />}
              onClick={() => onNavigate('contact')}
            />
          </div>

          {/* Quick HUD Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-5 pt-3 border-t border-cyan-500/20 text-xs font-mono">
            <div className="cyber-glass p-2 rounded text-center">
              <div className="text-[10px] text-slate-400">CORE FOCUS</div>
              <div className="text-cyan-300 font-bold text-xs mt-0.5">Spring Boot & APIs</div>
            </div>
            <div className="cyber-glass p-2 rounded text-center">
              <div className="text-[10px] text-slate-400">DATABASE</div>
              <div className="text-emerald-300 font-bold text-xs mt-0.5">MySQL & JPA</div>
            </div>
            <div className="cyber-glass p-2 rounded text-center">
              <div className="text-[10px] text-slate-400">CLIENT</div>
              <div className="text-purple-300 font-bold text-xs mt-0.5">React.js</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
