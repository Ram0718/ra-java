import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 140 : 320;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#00f0ff'), // cyan
      new THREE.Color('#10b981'), // emerald
      new THREE.Color('#a855f7'), // purple
      new THREE.Color('#38bdf8'), // sky blue
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.025;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.015) * 0.04;
    }
  });

  return (
    <group>
      {/* Dynamic drifting custom particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.045 : 0.035}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Atmospheric Glowing Sparkles calibrated for performance */}
      {isMobile ? (
        <Sparkles
          count={35}
          scale={[8, 5, 8]}
          position={[0, 1.2, 0]}
          size={2.2}
          speed={0.3}
          color="#00f0ff"
        />
      ) : (
        <>
          <Sparkles
            count={45}
            scale={[7, 4, 6]}
            position={[0, 1.2, 0]}
            size={2.5}
            speed={0.35}
            color="#00f0ff"
          />
          <Sparkles
            count={30}
            scale={[6, 3, 5]}
            position={[0, 0.8, -0.5]}
            size={2.0}
            speed={0.25}
            color="#10b981"
          />
          <Sparkles
            count={25}
            scale={[8, 5, 8]}
            position={[0, 2, 1]}
            size={2.8}
            speed={0.2}
            color="#a855f7"
          />
        </>
      )}
    </group>
  );
}
