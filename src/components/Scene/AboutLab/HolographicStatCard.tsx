import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../../utils/soundEffects';

interface HolographicStatCardProps {
  position: [number, number, number];
  metric: string;
  label: string;
  themeColor?: 'cyan' | 'emerald' | 'purple';
  subText?: string;
}

export function HolographicStatCard({
  position,
  metric,
  label,
  themeColor = 'cyan',
  subText
}: HolographicStatCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const colors = {
    cyan: { hex: '#00f0ff', border: 'border-cyan-400', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.4)]', text: 'text-cyan-300' },
    emerald: { hex: '#10b981', border: 'border-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]', text: 'text-emerald-300' },
    purple: { hex: '#a855f7', border: 'border-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]', text: 'text-purple-300' },
  }[themeColor];

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Calculate cursor-following 3D tilt
      const targetRotY = state.pointer.x * 0.28;
      const targetRotX = -state.pointer.y * 0.2;

      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);

      // Subtle float bobbing
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + 0.04 * Math.sin(t * 2 + position[0]);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={hovered ? 1.08 : 1.0}
      onPointerOver={() => {
        setHovered(true);
        soundFX.playHover();
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Glass Slab Backing */}
      <mesh>
        <boxGeometry args={[1.2, 0.75, 0.04]} />
        <meshStandardMaterial
          color="#060e22"
          transparent
          opacity={0.82}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Glowing Border Frame */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[1.22, 0.77, 0.005]} />
        <meshBasicMaterial
          color={colors.hex}
          wireframe
          transparent
          opacity={hovered ? 0.9 : 0.45}
        />
      </mesh>

      {/* Holographic Content via Drei Html */}
      <Html
        transform
        distanceFactor={3.2}
        center
        position={[0, 0, 0.04]}
        className="pointer-events-none select-none"
      >
        <div
          className={`w-44 p-3.5 rounded-lg font-mono text-center transition-all duration-300 backdrop-blur-md bg-slate-950/70 border ${colors.border} ${hovered ? colors.glow : ''}`}
        >
          {/* Top Corner Decor */}
          <div className="flex justify-between items-center text-[9px] text-slate-500 mb-1 border-b border-slate-800 pb-1">
            <span>[STAT.SYS]</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Metric Value */}
          <div className={`text-3xl font-black tracking-tight ${colors.text} drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]`}>
            {metric}
          </div>

          {/* Label */}
          <div className="text-xs font-bold text-slate-200 mt-1 uppercase tracking-wider">
            {label}
          </div>

          {subText && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              {subText}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
