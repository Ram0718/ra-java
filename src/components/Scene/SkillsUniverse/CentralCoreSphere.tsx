import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function CentralCoreSphere() {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Inner core pulse and rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.5;
      coreRef.current.rotation.y = t * 0.7;
      const pulse = 0.95 + 0.08 * Math.sin(t * 3);
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Outer wireframe sphere rotation
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.3;
      wireRef.current.rotation.z = t * 0.15;
    }

    // Gyroscope orbit rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.6;
      ring1Ref.current.rotation.y = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.5;
      ring2Ref.current.rotation.z = t * 0.7;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.4;
      ring3Ref.current.rotation.x = -t * 0.3;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4} position={[6.8, 1.0, -0.6]}>
      <group>
        {/* 1. Inner Pulsating Glowing Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.4}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* 2. Middle Wireframe Lattice Sphere */}
        <mesh ref={wireRef}>
          <sphereGeometry args={[0.88, 24, 18]} />
          <meshBasicMaterial
            color="#10b981"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* 3. Outer Concentric Gyroscope Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.18, 0.015, 16, 64]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.32, 0.012, 16, 64]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
        </mesh>
        <mesh ref={ring3Ref}>
          <torusGeometry args={[1.46, 0.01, 16, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
        </mesh>

        {/* 4. Central Core Radial Lights */}
        <pointLight color="#00f0ff" intensity={2.8} distance={5} />
        <pointLight color="#10b981" intensity={2.2} distance={4} />
      </group>
    </Float>
  );
}
