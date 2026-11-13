import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Shield, Lock } from 'lucide-react';

export function SecurityShield3D() {
  const shieldRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (shieldRef.current) {
      shieldRef.current.rotation.z = Math.sin(t * 1.5) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6;
    }
  });

  return (
    <group position={[-0.8, 2.6, 9.6]}>
      {/* Hexagonal Shield Force-field */}
      <mesh ref={shieldRef} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.55, 0.55, 0.03, 6]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Rotating Concentric Outer Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.68, 0.012, 16, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      {/* Floating JWT Lock HUD Badge */}
      <Html
        transform
        distanceFactor={3.0}
        position={[0, 0, 0.04]}
        center
        className="pointer-events-none select-none"
      >
        <div className="w-32 p-2 rounded-lg bg-slate-950/90 border border-cyan-400 font-mono text-center text-[8.5px] shadow-lg">
          <div className="flex items-center justify-center gap-1 text-cyan-300 font-bold mb-0.5">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>JWT AUTH</span>
          </div>
          <div className="text-emerald-400 flex items-center justify-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>RBAC SECURED</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
