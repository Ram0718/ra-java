import { useState, useEffect } from 'react';
import { soundFX } from '../../utils/soundEffects';
import { Terminal, ChevronRight } from 'lucide-react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const BOOT_LOGS = [
  "Initializing WebGL 2.0 graphics pipeline...",
  "Allocating 3D developer workspace buffer geometries...",
  "Rendering Java 21 & Spring Boot 3.2 procedural models...",
  "Injecting eAshaOP healthcare platform REST endpoints...",
  "Compiling dynamic screen syntax highlighting canvas...",
  "Calibrating mouse parallax damping & 6-axis camera...",
  "System fully synchronized. Launching developer matrix..."
];

export function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsDone(true);
          return 100;
        }
        // Random incremental progress
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + increment, 100);

        // Update log index based on progress
        const logIdx = Math.min(
          Math.floor((next / 100) * BOOT_LOGS.length),
          BOOT_LOGS.length - 1
        );
        setLogIndex(logIdx);

        return next;
      });
    }, 85);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    soundFX.playClick();
    soundFX.playWarp();
    onLoaded();
  };

  // Auto transition 600ms after reaching 100% if user hasn't clicked
  useEffect(() => {
    if (isDone) {
      const autoTimeout = setTimeout(() => {
        handleEnter();
      }, 700);
      return () => clearTimeout(autoTimeout);
    }
  }, [isDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040711] transition-opacity duration-700 ${
        isDone ? 'opacity-95' : 'opacity-100'
      }`}
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Futuristic Central HUD Box */}
      <div className="relative w-full max-w-lg p-8 mx-4 rounded-2xl cyber-glass border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-center font-mono select-none">
        {/* Animated Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Top Emblem */}
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-cyan-500/10 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          <Terminal className="w-7 h-7 animate-pulse" />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          INITIALIZING PORTFOLIO...
        </h2>
        <div className="text-[11px] text-cyan-400/80 tracking-widest mt-1">
          RAMBABU // JAVA DEVELOPER
        </div>

        {/* Percentage Counter */}
        <div className="my-6">
          <span className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
            {progress}%
          </span>
        </div>

        {/* Futuristic Progress Bar */}
        <div className="relative w-full bg-slate-900 border border-cyan-500/30 rounded-full h-3 p-[2px] overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,240,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Console Log */}
        <div className="h-10 flex items-center justify-center text-xs text-slate-400 font-mono px-2">
          <div className="flex items-center gap-1.5 truncate">
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="truncate text-cyan-300/90">{BOOT_LOGS[logIndex]}</span>
          </div>
        </div>

        {/* Enter Button (visible when ready) */}
        {isDone && (
          <button
            onClick={handleEnter}
            className="mt-4 px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse"
          >
            ENTER 3D WORLD
          </button>
        )}
      </div>
    </div>
  );
}
