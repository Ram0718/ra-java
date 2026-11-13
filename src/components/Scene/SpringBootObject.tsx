import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../utils/soundEffects';

export function SpringBootObject() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const leafRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * (hovered ? 0.8 : 0.4);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.7) * 0.4;
      ringRef.current.rotation.z = Math.cos(t * 0.6) * 0.4;
    }
    if (leafRef.current) {
      leafRef.current.rotation.z = Math.sin(t * 1.5) * 0.08;
    }
  });

  return (
    <Float
      speed={2.2}
      rotationIntensity={0.4}
      floatIntensity={0.7}
      position={[1.7, 0.95, -0.2]}
    >
      <group
        ref={groupRef}
        scale={hovered ? 1.2 : 1.0}
        onPointerOver={() => {
          setHovered(true);
          soundFX.playHover();
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Core Emerald Leaf / Gem Shape */}
        <mesh ref={leafRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[0.26, 2]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={hovered ? 1.0 : 0.45}
            roughness={0.15}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Spring Boot Power Button Arc */}
        <mesh position={[0, 0, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
          <torusGeometry args={[0.13, 0.02, 16, 32, Math.PI * 1.5]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>

        {/* Spring Boot Power Button Central Stem */}
        <mesh position={[0, 0.08, 0.08]}>
          <boxGeometry args={[0.025, 0.09, 0.02]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>

        {/* Orbital Gyroscope Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[0.38, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#6ee7b7"
            emissive="#10b981"
            emissiveIntensity={hovered ? 0.9 : 0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Outer Glow Halo */}
        <pointLight
          color="#10b981"
          intensity={hovered ? 2.5 : 1.2}
          distance={2.5}
        />
      </group>
    </Float>
  );
}
