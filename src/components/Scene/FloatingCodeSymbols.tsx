import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface CodeGlyph {
  text: string;
  position: [number, number, number];
  color: string;
  fontSize: number;
  speed: number;
}

const GLYPHS: CodeGlyph[] = [
  { text: '{ }', position: [-2.8, 1.8, -1.2], color: '#00f0ff', fontSize: 0.28, speed: 1.5 },
  { text: '</>', position: [2.8, 2.0, -1.0], color: '#a855f7', fontSize: 0.26, speed: 1.8 },
  { text: ';', position: [-2.2, 0.4, 0.8], color: '#38bdf8', fontSize: 0.35, speed: 1.2 },
  { text: '@Service', position: [2.4, 0.8, 0.4], color: '#10b981', fontSize: 0.16, speed: 1.6 },
  { text: '->', position: [-1.4, 2.3, -0.8], color: '#f59e0b', fontSize: 0.22, speed: 1.4 },
  { text: '@RestController', position: [-2.6, 2.6, -1.8], color: '#00f0ff', fontSize: 0.15, speed: 1.3 },
  { text: 'MySQL', position: [2.6, 2.7, -1.5], color: '#38bdf8', fontSize: 0.16, speed: 1.7 },
  { text: '( )', position: [1.6, 2.4, -0.6], color: '#c084fc', fontSize: 0.25, speed: 1.5 },
];

export function FloatingCodeSymbols() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle parallax reaction to cursor
      groupRef.current.position.x = state.pointer.x * 0.15;
      groupRef.current.position.y = state.pointer.y * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {GLYPHS.map((glyph, i) => (
        <Float
          key={i}
          speed={glyph.speed}
          rotationIntensity={0.25}
          floatIntensity={0.6}
          position={glyph.position}
        >
          <Text
            fontSize={glyph.fontSize}
            color={glyph.color}
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.8}
            outlineWidth={0.015}
            outlineColor="#040711"
          >
            {glyph.text}
          </Text>
        </Float>
      ))}
    </group>
  );
}
