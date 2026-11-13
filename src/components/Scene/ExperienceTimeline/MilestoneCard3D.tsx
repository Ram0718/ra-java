import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../../utils/soundEffects';
import { CheckCircle2, Star } from 'lucide-react';

export interface MilestoneCategoryItem {
  label: string;
  detail: string;
}

interface MilestoneCard3DProps {
  milestoneNumber: string;
  period: string;
  role: string;
  subtitle: string;
  isMainMilestone?: boolean;
  position: [number, number, number];
  rotationY?: number;
  themeColor?: 'cyan' | 'emerald' | 'purple' | 'amber';
  responsibilities: MilestoneCategoryItem[];
  technologies: string[];
}

export function MilestoneCard3D({
  milestoneNumber,
  period,
  role,
  subtitle,
  isMainMilestone = false,
  position,
  rotationY = 0,
  themeColor = 'cyan',
  responsibilities,
  technologies,
}: MilestoneCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const colors = {
    cyan: { hex: '#00f0ff', border: 'border-cyan-400', glow: 'shadow-[0_0_25px_rgba(0,240,255,0.45)]', text: 'text-cyan-300' },
    emerald: { hex: '#10b981', border: 'border-emerald-400', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.45)]', text: 'text-emerald-300' },
    purple: { hex: '#a855f7', border: 'border-purple-400', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.45)]', text: 'text-purple-300' },
    amber: { hex: '#f59e0b', border: 'border-amber-400', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.45)]', text: 'text-amber-300' },
  }[themeColor];

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth scale on hover
      const targetScale = hovered ? 1.05 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);

      // Subtle mouse tilt
      const targetRotY = rotationY + state.pointer.x * 0.15;
      const targetRotX = -state.pointer.y * 0.1;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);

      // Subtle float bobbing
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + 0.04 * Math.sin(t * 1.5 + position[2]);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={() => {
        setHovered(true);
        soundFX.playHover();
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Glass Slab Backing */}
      <mesh>
        <boxGeometry args={[2.5, 3.2, 0.04]} />
        <meshStandardMaterial
          color="#060c1c"
          transparent
          opacity={0.88}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Holographic Border Frame */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[2.52, 3.22, 0.005]} />
        <meshBasicMaterial
          color={colors.hex}
          wireframe
          transparent
          opacity={hovered ? 1.0 : isMainMilestone ? 0.9 : 0.55}
        />
      </mesh>

      {/* Main Milestone Glowing Ribbon */}
      {isMainMilestone && (
        <mesh position={[0, 1.63, 0.025]}>
          <boxGeometry args={[2.54, 0.08, 0.01]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      )}

      {/* 3D Holographic Card Content via Html */}
      <Html
        transform
        distanceFactor={3.4}
        position={[0, 0, 0.045]}
        center
        className="pointer-events-auto select-none"
      >
        <div
          className={`w-[360px] p-5 rounded-xl font-mono text-slate-100 transition-all duration-300 backdrop-blur-md bg-slate-950/85 border ${
            colors.border
          } ${hovered || isMainMilestone ? colors.glow : ''}`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')} animate-ping`} />
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                MILESTONE // {milestoneNumber}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
              {period}
            </span>
          </div>

          {/* Main Milestone Star Badge */}
          {isMainMilestone && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-xs font-black mb-2.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>CORE CAREER PINNACLE</span>
            </div>
          )}

          {/* Role & Subtitle */}
          <div className="mb-3">
            <h3 className={`text-lg md:text-xl font-black ${colors.text} tracking-tight uppercase leading-tight`}>
              {role}
            </h3>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              {subtitle}
            </p>
          </div>

          {/* Responsibilities Grid */}
          <div className="space-y-1.5 mb-3.5">
            <div className="text-[9.5px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/80 pb-1">
              Core Responsibilities &amp; Focus:
            </div>
            {responsibilities.map((resp, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] leading-snug text-slate-300">
                <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text} flex-shrink-0 mt-0.5`} />
                <div>
                  <strong className="text-white">{resp.label}: </strong>
                  <span className="text-slate-300">{resp.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technologies Deployed */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-1.5">
              Technologies &amp; Tools Deployed:
            </div>
            <div className="flex flex-wrap gap-1">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[9.5px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
