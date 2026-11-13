import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TimelineBeaconProps {
  position: [number, number, number];
  color?: string;
  phase: string;
}

export function TimelineBeacon({ position, color = '#00f0ff' }: TimelineBeaconProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) ringRef.current.rotation.y = t * 0.8;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = -t * 0.5;
      const pulse = 0.9 + 0.1 * Math.sin(t * 3);
      crystalRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={position}>
      {/* Base Pedestal */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.16, 24]} />
        <meshStandardMaterial color="#080e1e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glowing Crystal Pillar Core */}
      <mesh ref={crystalRef} position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Rotating Holographic Orbital Ring */}
      <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.26, 0.012, 12, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Upward Energy Beam */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 1.8, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Local Point Light */}
      <pointLight color={color} intensity={1.8} distance={2.5} position={[0, 0.4, 0]} />
    </group>
  );
}
