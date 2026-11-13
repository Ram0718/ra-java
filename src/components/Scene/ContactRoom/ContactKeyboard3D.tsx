import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KeyProps {
  position: [number, number, number];
  width?: number;
  label?: string;
  isSpace?: boolean;
}

function KeyCap({ position, width = 0.055, isSpace = false }: KeyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      const targetY = pressed ? position[1] - 0.015 : position[1];
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 20, delta);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        setPressed(true);
        setTimeout(() => setPressed(false), 120);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[width, 0.018, isSpace ? 0.055 : 0.055]} />
      <meshStandardMaterial
        color={hovered ? '#38bdf8' : '#0f172a'}
        emissive={hovered ? '#00f0ff' : isSpace ? '#0284c7' : '#082f49'}
        emissiveIntensity={hovered ? 1.5 : isSpace ? 0.6 : 0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export function ContactKeyboard3D() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 4 rows of keys
  const rows = [
    { count: 12, yOffset: 0.12, keyWidth: 0.058 },
    { count: 11, yOffset: 0.055, keyWidth: 0.062 },
    { count: 10, yOffset: -0.01, keyWidth: 0.068 },
    { count: 9, yOffset: -0.075, keyWidth: 0.072 },
  ];

  return (
    <group ref={groupRef} position={[0, 0.68, 0.52]} rotation={[-0.22, 0, 0]}>
      {/* 1. Keyboard Chassis Base */}
      <mesh position={[0, -0.012, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.98, 0.024, 0.38]} />
        <meshStandardMaterial color="#050814" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Cyber Underglow Border */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[1.01, 0.008, 0.41]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.5} />
      </mesh>

      {/* Wrist Rest Slab */}
      <mesh position={[0, -0.018, 0.22]} receiveShadow>
        <boxGeometry args={[0.96, 0.014, 0.08]} />
        <meshStandardMaterial color="#0c1322" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* 2. Key Matrix Rows */}
      {rows.map((row, rIdx) => {
        const spacing = 0.072;
        const startX = -((row.count - 1) * spacing) / 2;

        return (
          <group key={rIdx}>
            {Array.from({ length: row.count }).map((_, cIdx) => (
              <KeyCap
                key={cIdx}
                position={[startX + cIdx * spacing, 0.008, -row.yOffset]}
                width={row.keyWidth}
              />
            ))}
          </group>
        );
      })}

      {/* 3. Bottom Spacebar Row */}
      <group position={[0, 0.008, 0.14]}>
        <KeyCap position={[-0.32, 0, 0]} width={0.075} />
        <KeyCap position={[-0.22, 0, 0]} width={0.075} />
        <KeyCap position={[0, 0, 0]} width={0.34} isSpace={true} />
        <KeyCap position={[0.22, 0, 0]} width={0.075} />
        <KeyCap position={[0.32, 0, 0]} width={0.075} />
      </group>

      {/* Futuristic status LED strip on top edge */}
      <mesh position={[0, 0.008, -0.165]}>
        <boxGeometry args={[0.7, 0.004, 0.01]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
    </group>
  );
}
