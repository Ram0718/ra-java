import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { SectionId } from '../../../types/portfolio';

interface PanoramicReveal3DProps {
  isPanoramic: boolean;
  onNavigate: (section: SectionId) => void;
  onClosePanorama: () => void;
}

export function PanoramicReveal3D({ isPanoramic, onNavigate, onClosePanorama }: PanoramicReveal3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle levitation in celestial orbit
    groupRef.current.position.y = 13.5 + Math.sin(t * 1.2) * 0.2;

    // Smooth visibility fade
    const targetScale = isPanoramic ? 1.0 : 0.001;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);

    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.4;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.6;
  });

  return (
    <group ref={groupRef} position={[0, 13.5, 12.5]} rotation={[-0.35, 0, 0]}>
      {/* 1. Monumental Cosmic Frame Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[5.2, 0.03, 16, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[4.8, 0.02, 16, 48]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.5} />
      </mesh>

      {/* 2. Glass Backdrop Plaque */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[9.5, 4.2]} />
        <meshPhysicalMaterial
          color="#030712"
          metalness={0.9}
          roughness={0.1}
          transmission={0.7}
          thickness={0.4}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Cyber Corner Highlights */}
      {[-4.75, 4.75].map((x, i) =>
        [-2.1, 2.1].map((y, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, 0]}>
            <boxGeometry args={[0.25, 0.25, 0.05]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
          </mesh>
        ))
      )}

      {/* 3. Primary Grand Texts */}
      {/* "THANK YOU FOR VISITING" */}
      <Text
        position={[0, 1.2, 0.05]}
        fontSize={0.44}
        color="#ffffff"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        THANK YOU FOR VISITING
      </Text>

      {/* "RAMBABU — JAVA DEVELOPER" */}
      <Text
        position={[0, 0.5, 0.05]}
        fontSize={0.55}
        color="#38bdf8"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        RAMBABU — JAVA DEVELOPER
      </Text>

      {/* Subtitle / Tech Stack Summary */}
      <Text
        position={[0, -0.15, 0.05]}
        fontSize={0.22}
        color="#94a3b8"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        anchorX="center"
        anchorY="middle"
      >
        Java 17 • Spring Boot • Spring Security • MySQL • React • eAshaOP
      </Text>

      {/* Experience Credential Badge */}
      <Text
        position={[0, -0.65, 0.05]}
        fontSize={0.18}
        color="#a855f7"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        1.6+ YEARS OF HIGH-CONCURRENCY BACKEND ENGINEERING
      </Text>

      {/* 4. Interactive 3D Orbit Navigation Buttons */}
      {/* Button: Return to Contact Room */}
      <group
        position={[-1.8, -1.35, 0.1]}
        onClick={(e) => {
          e.stopPropagation();
          onClosePanorama();
          onNavigate('contact');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh>
          <boxGeometry args={[3.2, 0.45, 0.06]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#00f0ff"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.16}
          color="#00f0ff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          ↵ RETURN TO CONTACT
        </Text>
      </group>

      {/* Button: Replay Tour from Beginning */}
      <group
        position={[1.8, -1.35, 0.1]}
        onClick={(e) => {
          e.stopPropagation();
          onClosePanorama();
          onNavigate('home');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh>
          <boxGeometry args={[3.2, 0.45, 0.06]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#a855f7"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.16}
          color="#c084fc"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          ⟲ REPLAY 3D TOUR (HOME)
        </Text>
      </group>

      {/* Dedicated Ambient Halo Light */}
      <pointLight color="#00f0ff" intensity={2.5} distance={10} decay={2} />
    </group>
  );
}
