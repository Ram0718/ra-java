import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function AbstractGeometries() {
  const icoRef1 = useRef<THREE.Mesh>(null);
  const icoRef2 = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (icoRef1.current) {
      icoRef1.current.rotation.x = t * 0.2;
      icoRef1.current.rotation.y = t * 0.3;
    }
    if (icoRef2.current) {
      icoRef2.current.rotation.x = -t * 0.25;
      icoRef2.current.rotation.z = t * 0.15;
    }
    if (torusRef.current) {
      torusRef.current.rotation.z = t * 0.1;
      torusRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group>
      {/* Wireframe Glowing Icosahedron (Left) */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={[-3.6, 1.2, -1.5]}>
        <mesh ref={icoRef1}>
          <icosahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial
            color="#00f0ff"
            wireframe
            emissive="#00f0ff"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Wireframe Glowing Icosahedron (Right) */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.6} position={[3.5, 1.4, -1.2]}>
        <mesh ref={icoRef2}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#a855f7"
            wireframe
            emissive="#a855f7"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Cyber Grid Data Ring around the scene */}
      <mesh ref={torusRef} position={[0, -0.6, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
