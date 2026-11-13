import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CommRoomPlatform() {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef1.current) ringRef1.current.rotation.z = t * 0.4;
    if (ringRef2.current) ringRef2.current.rotation.z = -t * 0.5;
  });

  return (
    <group position={[-7.8, 0, 8.2]}>
      {/* 1. Hexagonal Main Platform Floor */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.0, 0.16, 6]} />
        <meshStandardMaterial color="#080e1e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hexagonal Perimeter Inlay */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.68, 6]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Rotating Concentric Ground Rings */}
      <mesh ref={ringRef1} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.012, 16, 48]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringRef2} position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.01, 16, 36]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.5} />
      </mesh>

      {/* 2. Rear Uplink Antenna Spire */}
      <mesh position={[0, 2.0, -2.4]}>
        <cylinderGeometry args={[0.03, 0.08, 4.0, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Antenna Glowing Transmitter Emitter */}
      <mesh position={[0, 4.0, -2.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Vertical Laser Column */}
      <mesh position={[0, 4.8, -2.4]}>
        <cylinderGeometry args={[0.02, 0.02, 8.0, 16, 1, true]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Localized Uplink Point Light */}
      <pointLight position={[0, 4.2, -2.4]} color="#00f0ff" intensity={2.8} distance={7} />
      <pointLight position={[0, 1.8, 0]} color="#a855f7" intensity={2.0} distance={6} />
    </group>
  );
}
