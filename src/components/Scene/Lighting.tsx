import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export function Lighting() {
  const pointerLightRef = useRef<THREE.PointLight>(null);
  const { theme } = useTheme();

  useFrame((state, delta) => {
    if (pointerLightRef.current) {
      // Smoothly interpolate pointer light position based on mouse coordinates
      const targetX = state.pointer.x * 2.5;
      const targetY = state.pointer.y * 1.5 + 1.2;
      pointerLightRef.current.position.x = THREE.MathUtils.damp(pointerLightRef.current.position.x, targetX, 8, delta);
      pointerLightRef.current.position.y = THREE.MathUtils.damp(pointerLightRef.current.position.y, targetY, 8, delta);
    }
  });

  return (
    <>
      {/* Rich Non-Black Theme Ambient Base */}
      <ambientLight intensity={1.15} color={theme.ambientLight} />

      {/* Dynamic interactive cursor point light */}
      <pointLight
        ref={pointerLightRef}
        position={[0, 1.2, 2.8]}
        color={theme.accentCyan}
        intensity={2.8}
        distance={7.0}
        decay={2}
      />

      {/* Primary Key Light - Theme Key Rim with optimized soft shadows */}
      <directionalLight
        position={[-4, 5, 3]}
        color={theme.primaryLight}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
      />

      {/* Secondary Rim Light - Theme Secondary glow */}
      <directionalLight
        position={[5, 4, -2]}
        color={theme.secondaryLight}
        intensity={2.2}
      />

      {/* Warm Horizon Rim Light - Cinematic contrast */}
      <directionalLight
        position={[0, 4, -5]}
        color={theme.rimLight}
        intensity={1.3}
      />

      {/* Spring Boot Emerald under-glow */}
      <pointLight
        position={[0, -0.3, 0.2]}
        color="#10b981"
        intensity={2.6}
        distance={4.5}
        decay={2}
      />

      {/* Overhead desk & monitor spotlight */}
      <spotLight
        position={[0, 2.6, 0.3]}
        target-position={[0, 0.5, -0.2]}
        angle={0.65}
        penumbra={0.8}
        intensity={3.2}
        color="#e0f2fe"
      />
    </>
  );
}
