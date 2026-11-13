import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function DatabaseCylinder3D() {
  const disk1 = useRef<THREE.Mesh>(null);
  const disk2 = useRef<THREE.Mesh>(null);
  const disk3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (disk1.current) disk1.current.rotation.y = t * 0.4;
    if (disk2.current) disk2.current.rotation.y = -t * 0.5;
    if (disk3.current) disk3.current.rotation.y = t * 0.6;
  });

  return (
    <group position={[3.2, 0.9, 10.2]} rotation={[0, -0.35, 0]}>
      {/* Base Plinth */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.85, 0.92, 0.12, 32]} />
        <meshStandardMaterial color="#061226" metalness={0.9} />
      </mesh>

      {/* Disk 1 (Bottom Platter) */}
      <mesh ref={disk1} position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.22, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.2}
          emissive="#00758f"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.73, 0.012, 16, 48]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Disk 2 (Middle Platter) */}
      <mesh ref={disk2} position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.22, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.2}
          emissive="#00758f"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.73, 0.012, 16, 48]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Disk 3 (Top Platter) */}
      <mesh ref={disk3} position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.22, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.2}
          emissive="#00758f"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.73, 0.012, 16, 48]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Top Holographic Cap */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.1, 32]} />
        <meshStandardMaterial color="#0b1736" metalness={0.9} />
      </mesh>

      {/* Database Telemetry Badge */}
      <Html
        transform
        distanceFactor={3.2}
        position={[0, 0.68, 0.2]}
        center
        className="pointer-events-none select-none"
      >
        <div className="w-36 p-2 rounded bg-slate-950/90 border border-cyan-500/50 font-mono text-center text-[9px] shadow-lg">
          <div className="text-cyan-300 font-bold">MYSQL 8.0 CLUSTER</div>
          <div className="text-emerald-400 text-[8px]">ACID RESERVATION LOCKS</div>
          <div className="text-slate-400 text-[7.5px] mt-0.5">Pool: HikariCP 20 Conns</div>
        </div>
      </Html>
    </group>
  );
}
