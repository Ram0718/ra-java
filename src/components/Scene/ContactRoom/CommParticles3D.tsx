import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CommParticles3D() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around communication platform
      const radius = 0.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.2 + Math.random() * 3.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      spd[i] = 0.3 + Math.random() * 0.7;
    }

    return [pos, spd];
  }, [count]);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Float upwards
      array[i * 3 + 1] += speeds[i] * delta;

      // Wrap around once reaching upper boundary
      if (array[i * 3 + 1] > 4.2) {
        array[i * 3 + 1] = 0.2;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#00f0ff"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
