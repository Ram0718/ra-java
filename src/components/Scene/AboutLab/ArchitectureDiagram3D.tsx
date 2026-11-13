import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../../utils/soundEffects';

interface ArchNode {
  id: string;
  name: string;
  sub: string;
  tech: string;
  pos: [number, number, number];
  color: string;
}

const NODES: ArchNode[] = [
  { id: 'client', name: 'CLIENT TIER', sub: 'React Client & UI', tech: 'React / HTTP', pos: [-1.8, 0.4, 0], color: '#38bdf8' },
  { id: 'security', name: 'SECURITY GATEWAY', sub: 'Token Filter & RBAC', tech: 'Spring Security + JWT', pos: [-0.9, 0.7, 0.1], color: '#10b981' },
  { id: 'service', name: 'SPRING BOOT ENGINE', sub: 'REST Controllers & Services', tech: 'Java 21 / Spring 3', pos: [0, 0.4, 0], color: '#00f0ff' },
  { id: 'jpa', name: 'PERSISTENCE LAYER', sub: 'Hibernate ORM & Repos', tech: 'Spring Data JPA', pos: [0.9, 0.7, 0.1], color: '#f59e0b' },
  { id: 'db', name: 'DATABASE CLUSTER', sub: 'ACID Transactions & Schema', tech: 'MySQL 8.0', pos: [1.8, 0.4, 0], color: '#a855f7' },
];

export function ArchitectureDiagram3D() {
  const groupRef = useRef<THREE.Group>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const packetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Data packet traveling across the architecture pipeline
    if (packetRef.current) {
      // Moves from -1.8 to 1.8 periodically
      const cycle = (t * 0.7) % 1;
      const startX = -1.8;
      const endX = 1.8;
      packetRef.current.position.x = startX + cycle * (endX - startX);
      packetRef.current.position.y = 0.5 + 0.15 * Math.sin(cycle * Math.PI * 4);
      packetRef.current.position.z = 0.05 * Math.cos(cycle * Math.PI * 2);
    }

    if (groupRef.current) {
      // Subtle float
      groupRef.current.position.y = 0.03 * Math.sin(t * 1.5);
    }
  });

  return (
    <group ref={groupRef} position={[-6.8, 0.7, -1.6]}>
      {/* Title Header above the diagram */}
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[3.2, 0.35]} />
        <meshBasicMaterial color="#0b1329" transparent opacity={0.7} />
      </mesh>
      <Html
        transform
        distanceFactor={3.6}
        position={[0, 1.3, 0.02]}
        center
        className="pointer-events-none select-none"
      >
        <div className="font-mono text-center">
          <div className="text-[10px] text-cyan-400 tracking-widest uppercase font-bold flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            BACKEND ARCHITECTURE PIPELINE // SCHEMATIC
          </div>
          <div className="text-[9px] text-slate-400">High-Concurrency Spring Boot &amp; MySQL Data Flow</div>
        </div>
      </Html>

      {/* Connecting Conduit Line (Backbone) */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 3.8, 16]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Traveling Data Packet */}
      <mesh ref={packetRef} position={[-1.8, 0.55, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Architecture Nodes */}
      {NODES.map((node) => {
        const isSelected = activeNode === node.id;
        return (
          <group
            key={node.id}
            position={node.pos}
            onPointerOver={() => {
              setActiveNode(node.id);
              soundFX.playHover();
            }}
            onPointerOut={() => setActiveNode(null)}
          >
            {/* 3D Chip Platform */}
            <mesh>
              <boxGeometry args={[0.7, 0.42, 0.08]} />
              <meshStandardMaterial
                color="#071026"
                metalness={0.9}
                roughness={0.2}
                emissive={node.color}
                emissiveIntensity={isSelected ? 0.8 : 0.2}
              />
            </mesh>

            {/* Glowing Accent Border */}
            <mesh position={[0, 0, 0.045]}>
              <boxGeometry args={[0.72, 0.44, 0.005]} />
              <meshBasicMaterial color={node.color} wireframe />
            </mesh>

            {/* Node Status LED */}
            <mesh position={[0.26, 0.14, 0.05]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial color={node.color} />
            </mesh>

            {/* Node Content via Html */}
            <Html
              transform
              distanceFactor={3.2}
              position={[0, 0, 0.06]}
              center
              className="pointer-events-none select-none"
            >
              <div className="w-28 text-center font-mono">
                <div className="text-[9px] font-bold text-white tracking-tight">
                  {node.name}
                </div>
                <div className="text-[7.5px] text-slate-400 truncate mt-0.5">
                  {node.sub}
                </div>
                <div
                  className="mt-1 text-[8px] font-semibold px-1 py-0.5 rounded border inline-block"
                  style={{
                    color: node.color,
                    borderColor: `${node.color}55`,
                    backgroundColor: `${node.color}15`,
                  }}
                >
                  {node.tech}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
