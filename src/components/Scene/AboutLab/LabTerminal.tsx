import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Terminal, Server } from 'lucide-react';
import { soundFX } from '../../../utils/soundEffects';

const PRIMARY_TECHS = [
  { name: 'Java', color: 'border-amber-500/50 text-amber-300 bg-amber-500/10' },
  { name: 'Spring Boot', color: 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10' },
  { name: 'Spring Security', color: 'border-cyan-500/50 text-cyan-300 bg-cyan-500/10' },
  { name: 'REST APIs', color: 'border-blue-500/50 text-blue-300 bg-blue-500/10' },
  { name: 'JPA / Hibernate', color: 'border-red-500/50 text-red-300 bg-red-500/10' },
  { name: 'MySQL', color: 'border-teal-500/50 text-teal-300 bg-teal-500/10' },
  { name: 'JWT', color: 'border-purple-500/50 text-purple-300 bg-purple-500/10' },
  { name: 'React', color: 'border-sky-500/50 text-sky-300 bg-sky-500/10' },
];

export function LabTerminal() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <group position={[-4.7, 1.4, -0.4]} rotation={[0, -0.32, 0]}>
      {/* 3D Monitor Frame */}
      <mesh>
        <boxGeometry args={[2.3, 2.5, 0.04]} />
        <meshStandardMaterial
          color="#060d1e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Monitor Glowing Bezel Accent */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[2.32, 2.52, 0.005]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* Stand / Wall Mount Arm */}
      <mesh position={[0, -1.25, -0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
        <meshStandardMaterial color="#0a0f1d" metalness={0.9} />
      </mesh>

      {/* Holographic Display via Html */}
      <Html
        transform
        distanceFactor={3.2}
        position={[0, 0, 0.04]}
        center
        className="pointer-events-auto select-none"
      >
        <div className="w-[330px] p-5 rounded-xl cyber-glass border border-cyan-500/40 text-slate-100 font-mono shadow-[0_0_35px_rgba(0,240,255,0.2)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black tracking-widest text-cyan-300 uppercase">
                ABOUT ME // DOSSIER
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LAB.ACTIVE
            </span>
          </div>

          {/* 1.6+ Years Experience Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>1.6+ YEARS EXPERIENCE</span>
          </div>

          {/* Bio Statement */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed mb-3.5">
            <p className="border-l-2 border-cyan-400 pl-2">
              "I am <strong className="text-white font-bold">Rambabu</strong>, a{' '}
              <strong className="text-cyan-300">Java Developer</strong> focused on building{' '}
              <strong className="text-emerald-400">reliable and scalable</strong> backend applications."
            </p>
          </div>

          {/* Primary Technologies Grid */}
          <div className="mb-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              <span>Primary Technologies:</span>
              <span className="text-cyan-400 font-semibold">{PRIMARY_TECHS.length} Stack Components</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {PRIMARY_TECHS.map((tech) => {
                const isHovered = selectedTech === tech.name;
                return (
                  <div
                    key={tech.name}
                    onMouseEnter={() => {
                      setSelectedTech(tech.name);
                      soundFX.playHover();
                    }}
                    onMouseLeave={() => setSelectedTech(null)}
                    className={`px-2.5 py-1.5 rounded-md border text-[11px] font-semibold transition-all flex items-center justify-between cursor-default ${tech.color} ${
                      isHovered ? 'scale-105 shadow-[0_0_10px_rgba(0,240,255,0.4)]' : ''
                    }`}
                  >
                    <span>{tech.name}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-70" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="mt-3.5 pt-2 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-400">
            <span>CORE ARCH: MICROSERVICES</span>
            <span className="text-cyan-300">DB: MYSQL 8.0</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
