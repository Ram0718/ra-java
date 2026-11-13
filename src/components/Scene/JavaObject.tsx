import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../utils/soundEffects';

export function JavaObject() {
  const groupRef = useRef<THREE.Group>(null);
  const steamRef1 = useRef<THREE.Mesh>(null);
  const steamRef2 = useRef<THREE.Mesh>(null);
  const steamRef3 = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += hovered ? 0.04 : 0.015;
    }

    // Animate rising steam rings
    if (steamRef1.current) {
      steamRef1.current.position.y = 0.28 + ((t * 0.4) % 0.35);
      const scale1 = 0.8 + (((t * 0.4) % 0.35) * 1.5);
      steamRef1.current.scale.set(scale1, scale1, scale1);
    }
    if (steamRef2.current) {
      steamRef2.current.position.y = 0.28 + (((t * 0.4 + 0.12) % 0.35));
      const scale2 = 0.8 + (((t * 0.4 + 0.12) % 0.35) * 1.5);
      steamRef2.current.scale.set(scale2, scale2, scale2);
    }
    if (steamRef3.current) {
      steamRef3.current.position.y = 0.28 + (((t * 0.4 + 0.24) % 0.35));
      const scale3 = 0.8 + (((t * 0.4 + 0.24) % 0.35) * 1.5);
      steamRef3.current.scale.set(scale3, scale3, scale3);
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.6}
      position={[-1.7, 0.9, -0.2]}
    >
      <group
        ref={groupRef}
        scale={hovered ? 1.15 : 1}
        onPointerOver={() => {
          setHovered(true);
          soundFX.playHover();
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Cup Saucer */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.36, 0.32, 0.04, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? "#00f0ff" : "#0284c7"}
            emissiveIntensity={hovered ? 0.6 : 0.2}
          />
        </mesh>

        {/* Cup Body */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.22, 0.17, 0.36, 32]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.25}
            emissive={hovered ? "#38bdf8" : "#0ea5e9"}
            emissiveIntensity={hovered ? 0.7 : 0.25}
          />
        </mesh>

        {/* Cup Rim Glow Ring */}
        <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.015, 16, 32]} />
          <meshBasicMaterial color={hovered ? "#00f0ff" : "#38bdf8"} />
        </mesh>

        {/* Coffee Liquid */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
          <meshStandardMaterial
            color="#451a03"
            roughness={0.1}
            metalness={0.6}
            emissive="#78350f"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Cup Handle */}
        <mesh position={[0.23, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.11, 0.03, 16, 32, Math.PI * 1.2]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.8}
            roughness={0.3}
            emissive="#0284c7"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Rising Neon Steam Rings */}
        <mesh ref={steamRef1} position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.012, 12, 24]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        <mesh ref={steamRef2} position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.01, 12, 24]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
        </mesh>
        <mesh ref={steamRef3} position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.008, 12, 24]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
        </mesh>

        {/* Java Badge Emblem Text / Ring */}
        <mesh position={[0, 0.05, 0.225]}>
          <boxGeometry args={[0.12, 0.08, 0.01]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>
    </Float>
  );
}
