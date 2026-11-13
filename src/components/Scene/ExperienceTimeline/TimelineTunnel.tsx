import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ARCH_Z_POSITIONS = [-8, -11, -14, -17, -20, -23, -26];

export function TimelineTunnel() {
  const pulseRef1 = useRef<THREE.Mesh>(null);
  const pulseRef2 = useRef<THREE.Mesh>(null);

  // Hexagonal arch rings along the tunnel
  const arches = useMemo(() => {
    return ARCH_Z_POSITIONS.map((z, idx) => ({
      z,
      color: idx % 2 === 0 ? '#00f0ff' : '#10b981',
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Floor laser pulses traversing the tunnel
    if (pulseRef1.current) {
      const zProgress = -8 - ((t * 4.5) % 18);
      pulseRef1.current.position.z = zProgress;
    }
    if (pulseRef2.current) {
      const zProgress = -8 - (((t * 4.5) + 9) % 18);
      pulseRef2.current.position.z = zProgress;
    }
  });

  return (
    <group>
      {/* 1. TUNNEL FLOOR RUNWAY */}
      <mesh position={[0, 0.12, -17]}>
        <boxGeometry args={[3.6, 0.04, 20]} />
        <meshStandardMaterial
          color="#060b17"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Runway Floor Subtle Grid */}
      <mesh position={[0, 0.145, -17]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 19.6]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Runway Left & Right Neon Guide Rails */}
      <mesh position={[-1.75, 0.15, -17]}>
        <boxGeometry args={[0.04, 0.03, 19.8]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[1.75, 0.15, -17]}>
        <boxGeometry args={[0.04, 0.03, 19.8]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Floor Traveling Laser Pulses */}
      <mesh ref={pulseRef1} position={[-1.75, 0.18, -8]}>
        <boxGeometry args={[0.08, 0.08, 0.8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={pulseRef2} position={[1.75, 0.18, -8]}>
        <boxGeometry args={[0.08, 0.08, 0.8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* 2. HEXAGONAL CYBER ARCHES */}
      {arches.map((arch, i) => (
        <group key={i} position={[0, 1.8, arch.z]}>
          {/* Hexagonal Arch Frame */}
          <mesh>
            <torusGeometry args={[2.4, 0.045, 8, 6]} />
            <meshStandardMaterial
              color="#0b1329"
              metalness={0.9}
              roughness={0.2}
              emissive={arch.color}
              emissiveIntensity={0.55}
            />
          </mesh>

          {/* Arch Glowing Inner Rim */}
          <mesh>
            <torusGeometry args={[2.35, 0.015, 8, 6]} />
            <meshBasicMaterial color={arch.color} transparent opacity={0.8} />
          </mesh>

          {/* Vertical Anchor Struts to Floor */}
          <mesh position={[-2.1, -1.0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.6, 12]} />
            <meshStandardMaterial color="#0a0f1d" metalness={0.9} />
          </mesh>
          <mesh position={[2.1, -1.0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.6, 12]} />
            <meshStandardMaterial color="#0a0f1d" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 3. TUNNEL DOWNWARD KEY LIGHTS */}
      <spotLight
        position={[0, 4.5, -12]}
        target-position={[0, 1.0, -14]}
        angle={0.7}
        penumbra={0.8}
        intensity={2.8}
        color="#38bdf8"
        distance={10}
      />
      <spotLight
        position={[0, 4.5, -20]}
        target-position={[0, 1.0, -22]}
        angle={0.7}
        penumbra={0.8}
        intensity={2.8}
        color="#10b981"
        distance={10}
      />
    </group>
  );
}
