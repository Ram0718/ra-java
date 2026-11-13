import type { SectionId } from '../../types/portfolio';
import { soundFX } from '../../utils/soundEffects';
import { ChevronUp, ChevronDown, Compass, Mouse, Box } from 'lucide-react';

interface CyberOverlayProps {
  activeSection: SectionId;
  onNextSection: () => void;
  onPrevSection: () => void;
  onSelectSection: (section: SectionId) => void;
}

const SECTION_ORDER: SectionId[] = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

export function CyberOverlay({
  activeSection,
  onNextSection,
  onPrevSection,
  onSelectSection,
}: CyberOverlayProps) {
  const currentIndex = SECTION_ORDER.indexOf(activeSection);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-6 select-none">
      {/* Sci-Fi Precision Corner Brackets */}
      <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-cyan-500/40" />
      <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-cyan-500/40" />
      <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-cyan-500/40" />
      <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-cyan-500/40" />

      {/* Top Telemetry Strip (Under Nav) */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono text-cyan-400/70 mt-14 md:mt-16 px-1">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">SPATIAL SECTOR:</span>
          <span className="text-cyan-300 font-bold uppercase">{activeSection}</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">INDEX [{currentIndex + 1}/6]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          <span className="text-slate-300 font-semibold">ENGINE: THREE.JS R3F</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-cyan-400">60 FPS TARGET</span>
        </div>
      </div>

      {/* Right Side 3D Trajectory Navigation Pips */}
      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-3 pointer-events-auto">
        <div className="text-[9px] font-mono text-slate-500 uppercase rotate-90 mb-4 tracking-widest">
          TRAJECTORY
        </div>
        {SECTION_ORDER.map((sec) => (
          <button
            key={sec}
            onClick={() => {
              soundFX.playClick();
              soundFX.playWarp();
              onSelectSection(sec);
            }}
            title={`Navigate to ${sec}`}
            className={`group relative flex items-center justify-center transition-all ${
              activeSection === sec ? 'scale-125' : 'opacity-40 hover:opacity-90'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeSection === sec
                  ? 'bg-cyan-400 shadow-[0_0_12px_#00f0ff]'
                  : 'bg-slate-500 group-hover:bg-slate-300'
              }`}
            />
            {/* Tooltip */}
            <span className="absolute right-7 px-2.5 py-1 rounded-md bg-slate-950/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
              {sec.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom Floating HUD Controller */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs font-mono">
        {/* Left Status: 3D Mode & Parallax */}
        <div className="cyber-glass px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-slate-300 flex items-center gap-2 shadow-lg">
          <Box className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-bold text-cyan-300">3D MODE</span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-slate-400">CAMERA PARALLAX ON</span>
        </div>

        {/* Center: SCROLL TO EXPLORE Indicator & Directional Controls */}
        <div className="pointer-events-auto flex items-center gap-3 cyber-glass px-4 py-2 rounded-2xl border border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
          <button
            onClick={() => {
              soundFX.playClick();
              onPrevSection();
            }}
            title="Previous 3D sector"
            className="p-1 rounded-lg hover:bg-cyan-500/20 text-cyan-300 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Prompt requested: "SCROLL TO EXPLORE" */}
          <div className="flex items-center gap-2">
            <Mouse className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span className="text-[11px] font-bold tracking-widest text-slate-100 uppercase">
              <span className="text-cyan-300">SCROLL</span> TO EXPLORE
            </span>
            <span className="hidden sm:inline text-[10px] text-slate-400 font-normal">
              (OR SWIPE / KEYS)
            </span>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onNextSection();
            }}
            title="Next 3D sector"
            className="p-1 rounded-lg hover:bg-cyan-500/20 text-cyan-300 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Right Telemetry: Enterprise Metrics */}
        <div className="cyber-glass px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-slate-400 hidden md:flex items-center gap-3 shadow-lg">
          <span className="text-slate-300">LATENCY: <span className="text-cyan-400 font-bold">&lt;85ms</span></span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">JAVA 17 // SPRING 3.2</span>
        </div>
      </div>
    </div>
  );
}
