import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { VideoScreen3D } from './VideoScreen3D';
import { HangingIdCard3D } from './HangingIdCard3D';
import { JavaObject } from './JavaObject';
import { SpringBootObject } from './SpringBootObject';
import { soundFX } from '../../utils/soundEffects';

export function Workspace() {
  const groupRef = useRef<THREE.Group>(null);
  const [lampOn, setLampOn] = useState(true);

  // Subtle mouse tilt on the workspace
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.pointer.x * 0.04;
      groupRef.current.rotation.x = -state.pointer.y * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. DESK SURFACE (Deep Oceanic Sapphire) */}
      <mesh position={[0, 0.38, -0.3]} receiveShadow>
        <boxGeometry args={[3.6, 0.08, 1.5]} />
        <meshStandardMaterial
          color="#13284c"
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Desk Front Neon Accent Strip */}
      <mesh position={[0, 0.38, 0.455]}>
        <boxGeometry args={[3.62, 0.015, 0.015]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Desk Left/Right Neon Strips */}
      <mesh position={[-1.805, 0.38, -0.3]}>
        <boxGeometry args={[0.015, 0.015, 1.5]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[1.805, 0.38, -0.3]}>
        <boxGeometry args={[0.015, 0.015, 1.5]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Desk Legs */}
      <mesh position={[-1.55, -0.22, -0.3]}>
        <boxGeometry args={[0.08, 1.15, 1.2]} />
        <meshStandardMaterial color="#0e1c36" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.55, -0.22, -0.3]}>
        <boxGeometry args={[0.08, 1.15, 1.2]} />
        <meshStandardMaterial color="#0e1c36" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Desk Cable Grommets / Accents */}
      <mesh position={[1.2, 0.422, -0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>

      {/* 2. DESK MAT */}
      <mesh position={[0, 0.422, -0.05]} receiveShadow>
        <boxGeometry args={[2.0, 0.006, 0.75]} />
        <meshStandardMaterial
          color="#0a172c"
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>
      {/* Desk Mat Glowing Edge */}
      <mesh position={[0, 0.423, -0.05]}>
        <ringGeometry args={[0.98, 1.0, 4]} />
      </mesh>

      {/* 3. ULTRAWIDE MONITOR FRAME */}
      {/* Monitor Stand Base */}
      <mesh position={[0, 0.43, -0.55]}>
        <boxGeometry args={[0.55, 0.015, 0.3]} />
        <meshStandardMaterial color="#0f1e38" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Monitor Stand Vertical Stem */}
      <mesh position={[0, 0.75, -0.6]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.65, 0.06]} />
        <meshStandardMaterial color="#0f1e38" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Monitor Back Housing */}
      <mesh position={[0, 0.96, -0.52]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[2.0, 1.14, 0.06]} />
        <meshStandardMaterial color="#0d1b32" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Monitor Back RGB Ambient Light Strip */}
      <mesh position={[0, 0.96, -0.555]}>
        <boxGeometry args={[1.7, 0.85, 0.01]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <pointLight position={[0, 0.96, -0.8]} color="#00f0ff" intensity={1.8} distance={3} />

      {/* 3D Ultrawide Monitor Screen (Video Screen or Code Terminal) */}
      <VideoScreen3D />

      {/* 4. MECHANICAL KEYBOARD */}
      <group position={[-0.1, 0.435, 0.08]} rotation={[-0.08, 0, 0]}>
        {/* Keyboard Base Plate */}
        <mesh>
          <boxGeometry args={[0.78, 0.024, 0.28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Keyboard Underglow */}
        <mesh position={[0, -0.005, 0]}>
          <boxGeometry args={[0.79, 0.008, 0.29]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        {/* Keycaps Grid */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.72, 0.015, 0.24]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.5}
            metalness={0.3}
            emissive="#00f0ff"
            emissiveIntensity={0.12}
          />
        </mesh>
      </group>

      {/* 5. ERGONOMIC MOUSE */}
      <group position={[0.55, 0.435, 0.1]}>
        {/* Mouse Body */}
        <mesh position={[0, 0.015, 0]} scale={[0.11, 0.04, 0.17]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Mouse Scroll Wheel */}
        <mesh position={[0, 0.038, -0.03]}>
          <cylinderGeometry args={[0.008, 0.008, 0.02, 16]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* 6. DESK LAMP BAR */}
      <group position={[-1.35, 0.42, -0.5]}>
        {/* Lamp Base */}
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.03, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Lamp Stem */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Lamp Arm */}
        <mesh position={[0.22, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Lamp Head Bar */}
        <mesh
          position={[0.42, 0.9, 0]}
          onClick={() => {
            setLampOn(!lampOn);
            soundFX.playClick();
          }}
        >
          <boxGeometry args={[0.26, 0.025, 0.04]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={lampOn ? "#38bdf8" : "#0f172a"}
            emissiveIntensity={lampOn ? 0.8 : 0}
          />
        </mesh>
        {lampOn && (
          <spotLight
            position={[0.42, 0.88, 0]}
            target-position={[0.3, 0.4, 0]}
            angle={0.55}
            penumbra={0.7}
            intensity={3.2}
            color="#38bdf8"
            distance={2}
          />
        )}
      </group>

      {/* 7. 3D OBJECTS ON DESK */}
      <JavaObject />
      <SpringBootObject />

      {/* 8. FLOATING 3D HOLOGRAPHIC PANELS (Using Drei Html in 3D space) */}
      {/* Left Telemetry Panel */}
      <group position={[-1.75, 1.7, -0.6]} rotation={[0, 0.25, 0]}>
        <Html transform distanceFactor={3.2} className="pointer-events-none select-none">
          <div className="w-56 p-3 rounded-lg cyber-glass border border-cyan-500/30 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                BACKEND STATS
              </span>
              <span className="text-[10px] text-slate-400">SYS.OK</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>JVM HEAP</span>
                <span className="text-cyan-300 font-semibold">248MB / 1024MB</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[24%]" />
              </div>
              <div className="flex justify-between text-slate-300 pt-1">
                <span>API LATENCY</span>
                <span className="text-emerald-400 font-semibold">&lt; 85ms</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>ACTIVE POOL</span>
                <span className="text-amber-400 font-semibold">HikariCP 10/20</span>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* Right Service Health Panel */}
      <group position={[1.75, 1.7, -0.6]} rotation={[0, -0.25, 0]}>
        <Html transform distanceFactor={3.2} className="pointer-events-none select-none">
          <div className="w-56 p-3 rounded-lg cyber-glass-emerald border border-emerald-500/30 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5 mb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                eAshaOP STATUS
              </span>
              <span className="text-[10px] text-emerald-300">ONLINE</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>SECURITY</span>
                <span className="text-emerald-300">JWT + RBAC</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>SLOT LOCK</span>
                <span className="text-cyan-400">ACID Trans.</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>DB SCHEME</span>
                <span className="text-purple-300">MySQL 3NF</span>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* Interactive Hanging 3D ID Card with drag & swing physics */}
      <HangingIdCard3D />
    </group>
  );
}
