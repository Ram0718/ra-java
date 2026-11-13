import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../../utils/soundEffects';

export type TechCategory = 'BACKEND' | 'DATABASE' | 'FRONTEND' | 'TOOLS';

export interface TechNodeProps {
  name: string;
  category: TechCategory;
  position: [number, number, number];
  level: number;
  description: string;
  isInspected: boolean;
  onSelect: () => void;
}

const CATEGORY_STYLES: Record<TechCategory, { hex: string; border: string; text: string; bg: string }> = {
  BACKEND: { hex: '#00f0ff', border: 'border-cyan-400', text: 'text-cyan-300', bg: 'bg-cyan-500/10' },
  DATABASE: { hex: '#10b981', border: 'border-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-500/10' },
  FRONTEND: { hex: '#a855f7', border: 'border-purple-400', text: 'text-purple-300', bg: 'bg-purple-500/10' },
  TOOLS: { hex: '#f59e0b', border: 'border-amber-400', text: 'text-amber-300', bg: 'bg-amber-500/10' },
};

export function TechNode3D({
  name,
  category,
  position,
  level,
  description,
  isInspected,
  onSelect,
}: TechNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const style = CATEGORY_STYLES[category];

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth scale interpolation on hover or inspection
      const targetScale = hovered ? 1.25 : isInspected ? 1.15 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

      // Subtle cursor parallax tilt
      const targetRotY = state.pointer.x * 0.22;
      const targetRotX = -state.pointer.y * 0.16;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);

      // Subtle float bobbing
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + 0.035 * Math.sin(t * 1.8 + position[0]);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        soundFX.playHover();
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        soundFX.playClick();
        onSelect();
      }}
    >
      {/* 3D Chip Platform */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.44, 0.06]} />
        <meshStandardMaterial
          color="#060c1c"
          metalness={0.9}
          roughness={0.15}
          emissive={style.hex}
          emissiveIntensity={hovered ? 0.8 : isInspected ? 0.5 : 0.15}
        />
      </mesh>

      {/* Glowing Border Wireframe */}
      <mesh position={[0, 0, 0.032]}>
        <boxGeometry args={[0.8, 0.46, 0.005]} />
        <meshBasicMaterial
          color={style.hex}
          wireframe
          transparent
          opacity={hovered ? 1.0 : 0.5}
        />
      </mesh>

      {/* Category Indicator Corner Dot */}
      <mesh position={[0.31, 0.14, 0.035]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshBasicMaterial color={style.hex} />
      </mesh>

      {/* Holographic Content Display */}
      <Html
        transform
        distanceFactor={3.2}
        position={[0, 0, 0.045]}
        center
        className="pointer-events-none select-none"
      >
        <div
          className={`w-28 p-2 rounded text-center font-mono transition-all backdrop-blur-md bg-slate-950/80 border ${style.border} ${
            hovered ? 'shadow-[0_0_15px_rgba(0,240,255,0.45)]' : ''
          }`}
        >
          <div className="text-[7.5px] uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{category}</span>
            <span className="font-bold text-slate-300">{level}%</span>
          </div>

          <div className={`text-xs font-bold ${style.text} tracking-tight mt-0.5 truncate`}>
            {name}
          </div>

          {/* Mini Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${level}%`,
                backgroundColor: style.hex,
                boxShadow: `0 0 6px ${style.hex}`,
              }}
            />
          </div>
        </div>
      </Html>

      {/* Inspection HUD Popup Card (Appears on click) */}
      {isInspected && (
        <group position={[0, 0.7, 0.15]}>
          <Html
            transform
            distanceFactor={3.0}
            center
            className="pointer-events-auto select-none"
          >
            <div className="w-52 p-3 rounded-lg cyber-glass border border-cyan-400/70 font-mono text-left shadow-[0_0_25px_rgba(0,240,255,0.3)] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 mb-1.5">
                <span className="text-xs font-bold text-white uppercase">{name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                  {level}% MASTERY
                </span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                {description}
              </p>
              <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-between text-[8px] text-slate-400">
                <span>TIER: {category}</span>
                <span className="text-cyan-300">CLICK TO CLOSE</span>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
