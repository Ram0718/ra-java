import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { DEVELOPER_PROFILE } from '../../../data/portfolio';

interface HolographicIconProps {
  position: [number, number, number];
  type: 'email' | 'linkedin' | 'github';
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}

function HolographicIconNode({
  position,
  type,
  title,
  subtitle,
  color,
  onClick,
}: HolographicIconProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating bob
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.08;

      // Smooth hover scale
      const targetScale = hovered ? 1.15 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }

    if (coreRef.current) {
      // Continuous rotation
      coreRef.current.rotation.y += delta * (hovered ? 1.5 : 0.6);
      coreRef.current.rotation.x = Math.sin(t) * 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * (hovered ? 2.0 : 0.8);
      ringRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer Gyroscope Halo Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.38, 0.012, 16, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.5 : 1.0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Center 3D Icon Geometry */}
      {type === 'email' && (
        <group ref={coreRef}>
          {/* Main Envelope Body */}
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.28, 0.04]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#00f0ff"
              emissiveIntensity={hovered ? 1.2 : 0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Envelope Flap Accent */}
          <mesh position={[0, 0.04, 0.025]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.2, 0.12, 3]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={hovered ? 1.5 : 0.6}
            />
          </mesh>
          {/* Wireframe Glow Edge */}
          <mesh>
            <boxGeometry args={[0.44, 0.3, 0.05]} />
            <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.4} />
          </mesh>
        </group>
      )}

      {type === 'linkedin' && (
        <group ref={coreRef}>
          {/* Beveled Square Slab */}
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.34, 0.06]} />
            <meshStandardMaterial
              color="#0a66c2"
              emissive="#0a66c2"
              emissiveIntensity={hovered ? 1.4 : 0.5}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* "in" Emblem Plaque */}
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.26, 0.26, 0.01]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={hovered ? 0.9 : 0.2}
            />
          </mesh>
          <Text
            position={[0, -0.02, 0.045]}
            fontSize={0.2}
            color="#0a66c2"
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
          >
            in
          </Text>
        </group>
      )}

      {type === 'github' && (
        <group ref={coreRef}>
          {/* Octagonal Cyber Plaque */}
          <mesh castShadow rotation={[0, 0, Math.PI / 8]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 8]} />
            <meshStandardMaterial
              color="#1e1b4b"
              emissive="#a855f7"
              emissiveIntensity={hovered ? 1.3 : 0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Cyber Octocat Silhouette / Code Brackets */}
          <mesh position={[0, 0, 0.035]}>
            <torusGeometry args={[0.13, 0.02, 16, 32]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#c084fc"
              emissiveIntensity={hovered ? 2.0 : 0.8}
            />
          </mesh>
          {/* "Cat Ears" Nodes */}
          <mesh position={[-0.08, 0.12, 0.035]}>
            <coneGeometry args={[0.04, 0.06, 3]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1.0} />
          </mesh>
          <mesh position={[0.08, 0.12, 0.035]}>
            <coneGeometry args={[0.04, 0.06, 3]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}

      {/* Floating 3D Text Label */}
      <Text
        position={[0, -0.42, 0]}
        fontSize={0.11}
        color={hovered ? '#ffffff' : color}
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      <Text
        position={[0, -0.56, 0]}
        fontSize={0.075}
        color="#94a3b8"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        anchorX="center"
        anchorY="middle"
      >
        {subtitle}
      </Text>

      {/* Pulsing Base Light Source */}
      <pointLight color={color} intensity={hovered ? 1.6 : 0.6} distance={2.5} decay={2} />
    </group>
  );
}

export function HolographicIcons3D() {
  const handleEmail = () => {
    window.open(`mailto:${DEVELOPER_PROFILE.email}`);
  };

  const handleLinkedIn = () => {
    window.open(DEVELOPER_PROFILE.linkedin, '_blank');
  };

  const handleGitHub = () => {
    window.open(DEVELOPER_PROFILE.github, '_blank');
  };

  return (
    <group position={[-7.8, 0, 8.2]}>
      {/* 1. Left Flank: Floating Email Hologram */}
      <HolographicIconNode
        position={[-1.9, 1.45, 0.2]}
        type="email"
        title="EMAIL ME"
        subtitle="Direct Contact"
        color="#00f0ff"
        onClick={handleEmail}
      />

      {/* 2. Right Top Flank: Floating LinkedIn Hologram */}
      <HolographicIconNode
        position={[1.9, 1.7, 0.2]}
        type="linkedin"
        title="LINKEDIN"
        subtitle="Professional Network"
        color="#0077b5"
        onClick={handleLinkedIn}
      />

      {/* 3. Right Bottom Flank: Floating GitHub Hologram */}
      <HolographicIconNode
        position={[1.9, 0.85, 0.2]}
        type="github"
        title="GITHUB"
        subtitle="Open Source Code"
        color="#a855f7"
        onClick={handleGitHub}
      />
    </group>
  );
}
