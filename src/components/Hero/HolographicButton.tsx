import React, { useState } from 'react';
import { soundFX } from '../../utils/soundEffects';

interface HolographicButtonProps {
  label: string;
  variant?: 'cyan' | 'emerald' | 'purple';
  icon?: React.ReactNode;
  onClick: () => void;
}

export function HolographicButton({
  label,
  variant = 'cyan',
  icon,
  onClick
}: HolographicButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    cyan: {
      border: 'border-cyan-400',
      bg: 'bg-cyan-500/10 hover:bg-cyan-500/25',
      glow: 'shadow-[0_0_20px_rgba(0,240,255,0.4)]',
      text: 'text-cyan-300 hover:text-white',
      accent: 'bg-cyan-400',
      corner: 'border-cyan-400',
    },
    emerald: {
      border: 'border-emerald-400',
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/25',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      text: 'text-emerald-300 hover:text-white',
      accent: 'bg-emerald-400',
      corner: 'border-emerald-400',
    },
    purple: {
      border: 'border-purple-400',
      bg: 'bg-purple-500/10 hover:bg-purple-500/25',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      text: 'text-purple-300 hover:text-white',
      accent: 'bg-purple-400',
      corner: 'border-purple-400',
    }
  }[variant];

  return (
    <button
      onClick={() => {
        soundFX.playClick();
        soundFX.playWarp();
        onClick();
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        soundFX.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group px-7 py-3 rounded font-mono font-bold tracking-wider text-sm transition-all duration-300 backdrop-blur-md border ${colors.border} ${colors.bg} ${colors.text} ${isHovered ? colors.glow : ''} transform active:scale-95`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Sci-Fi Decorative Corner Brackets */}
      <span className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${colors.corner} transition-all duration-300 group-hover:w-3 group-hover:h-3`} />
      <span className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${colors.corner} transition-all duration-300 group-hover:w-3 group-hover:h-3`} />
      <span className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${colors.corner} transition-all duration-300 group-hover:w-3 group-hover:h-3`} />
      <span className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${colors.corner} transition-all duration-300 group-hover:w-3 group-hover:h-3`} />

      {/* Button content */}
      <span className="flex items-center gap-2 relative z-10">
        {icon}
        <span>{label}</span>
      </span>

      {/* Subtle sweep highlight on hover */}
      <div className="absolute inset-0 overflow-hidden rounded pointer-events-none">
        <div className={`w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full`} />
      </div>
    </button>
  );
}
