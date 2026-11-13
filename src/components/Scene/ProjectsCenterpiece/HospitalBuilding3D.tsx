import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HospitalBuilding3D() {
  const crossRef = useRef<THREE.Group>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (crossRef.current) {
      crossRef.current.rotation.y = t * 0.5;
    }
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 2.0 + 0.8 * Math.sin(t * 4);
    }
  });

  return (
    <group position={[0, 0, 6.8]}>
      {/* 1. Base Foundation Concourse */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.4, 3.4]} />
        <meshStandardMaterial color="#080f22" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Base Perimeter Neon Strip */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[4.84, 0.02, 3.44]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* 2. Main Medical Tower Body */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.8, 2.4]} />
        <meshStandardMaterial color="#0c1836" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Horizontal Architectural Neon Ribbons */}
      <mesh position={[0, 1.1, 1.22]}>
        <boxGeometry args={[3.24, 0.06, 0.02]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh position={[0, 1.9, 1.22]}>
        <boxGeometry args={[3.24, 0.06, 0.02]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[0, 2.7, 1.22]}>
        <boxGeometry args={[3.24, 0.06, 0.02]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Glass Window Array Facade */}
      <mesh position={[0, 1.8, 1.21]}>
        <planeGeometry args={[2.8, 2.2]} />
        <meshStandardMaterial
          color="#00f0ff"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* 3. Upper Diagnostics Terrace / Helipad */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.35, 24]} />
        <meshStandardMaterial color="#080e1e" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 4. Rotating Glowing Medical Cross Emblem (+) */}
      <group ref={crossRef} position={[0, 4.0, 0]}>
        {/* Vertical Cross Bar */}
        <mesh>
          <boxGeometry args={[0.2, 0.65, 0.12]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
        {/* Horizontal Cross Bar */}
        <mesh>
          <boxGeometry args={[0.65, 0.2, 0.12]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
        {/* Outer Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.015, 16, 32]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Cross Beacon Light */}
      <pointLight
        ref={beaconLightRef}
        position={[0, 4.2, 0]}
        color="#10b981"
        intensity={2.5}
        distance={6}
      />

      {/* 5. Entrance Glass Canopy */}
      <mesh position={[0, 0.65, 1.9]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.8, 0.04, 1.0]} />
        <meshStandardMaterial color="#00f0ff" transparent opacity={0.6} roughness={0.1} />
      </mesh>
    </group>
  );
}
