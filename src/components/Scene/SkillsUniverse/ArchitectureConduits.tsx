import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConduitPath {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

export const PIPELINE_PATHS: ConduitPath[] = [
  // Primary Architecture Backbone: Java -> Spring Boot -> Spring MVC -> REST APIs -> JPA -> Hibernate -> MySQL
  { start: [5.2, 2.3, 0.4], end: [6.0, 2.5, 0.6], color: '#00f0ff' }, // Java -> Spring Boot
  { start: [6.0, 2.5, 0.6], end: [6.8, 2.6, 0.7], color: '#00f0ff' }, // Spring Boot -> Spring MVC
  { start: [6.8, 2.6, 0.7], end: [7.6, 2.3, 0.5], color: '#00f0ff' }, // Spring MVC -> REST APIs
  { start: [7.6, 2.3, 0.5], end: [8.3, 1.8, 0.3], color: '#10b981' }, // REST APIs -> JPA
  { start: [8.3, 1.8, 0.3], end: [8.6, 1.1, 0.1], color: '#10b981' }, // JPA -> Hibernate
  { start: [8.6, 1.1, 0.1], end: [8.6, 0.3, -0.1], color: '#10b981' }, // Hibernate -> MySQL

  // Security Branch: Spring Security -> JWT -> REST APIs
  { start: [5.3, 1.4, 0.7], end: [5.2, 0.6, 0.5], color: '#10b981' }, // Security -> JWT
  { start: [5.2, 0.6, 0.5], end: [7.6, 2.3, 0.5], color: '#38bdf8' }, // JWT -> REST APIs

  // Frontend Integration Branch: React -> REST APIs
  { start: [7.8, -0.4, 0.3], end: [7.6, 2.3, 0.5], color: '#a855f7' }, // React -> REST APIs
];

export function ArchitectureConduits() {
  const pulsePacket1 = useRef<THREE.Mesh>(null);
  const pulsePacket2 = useRef<THREE.Mesh>(null);
  const pulsePacket3 = useRef<THREE.Mesh>(null);

  // Pre-calculate tube geometries for the paths
  const tubes = useMemo(() => {
    return PIPELINE_PATHS.map((path) => {
      const p1 = new THREE.Vector3(...path.start);
      const p2 = new THREE.Vector3(...path.end);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      // Lift midpoint slightly for an elegant cyber curve
      mid.y += 0.08;
      mid.z += 0.05;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      const geometry = new THREE.TubeGeometry(curve, 20, 0.014, 8, false);
      return { geometry, color: path.color, curve };
    });
  }, []);

  // Primary backbone curve composed of the main sequence: Java -> Spring Boot -> Spring MVC -> REST API -> JPA -> Hibernate -> MySQL
  const backboneCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(5.2, 2.3, 0.4),
      new THREE.Vector3(6.0, 2.5, 0.6),
      new THREE.Vector3(6.8, 2.6, 0.7),
      new THREE.Vector3(7.6, 2.3, 0.5),
      new THREE.Vector3(8.3, 1.8, 0.3),
      new THREE.Vector3(8.6, 1.1, 0.1),
      new THREE.Vector3(8.6, 0.3, -0.1),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse Packet 1 traveling down the primary backbone
    if (pulsePacket1.current) {
      const u1 = (t * 0.25) % 1;
      const pos1 = backboneCurve.getPoint(u1);
      pulsePacket1.current.position.copy(pos1);
    }

    // Pulse Packet 2 offset on the primary backbone
    if (pulsePacket2.current) {
      const u2 = (t * 0.25 + 0.5) % 1;
      const pos2 = backboneCurve.getPoint(u2);
      pulsePacket2.current.position.copy(pos2);
    }

    // Pulse Packet 3 on the Security -> JWT -> REST branch
    if (pulsePacket3.current) {
      const u3 = (t * 0.35) % 1;
      const start = new THREE.Vector3(5.3, 1.4, 0.7);
      const mid = new THREE.Vector3(5.2, 0.6, 0.5);
      const end = new THREE.Vector3(7.6, 2.3, 0.5);
      const secCurve = new THREE.CatmullRomCurve3([start, mid, end]);
      pulsePacket3.current.position.copy(secCurve.getPoint(u3));
    }
  });

  return (
    <group>
      {/* 3D Connecting Conduit Tubes */}
      {tubes.map((tube, i) => (
        <mesh key={i} geometry={tube.geometry}>
          <meshStandardMaterial
            color={tube.color}
            emissive={tube.color}
            emissiveIntensity={0.65}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Animated Traveling Data Packets */}
      <mesh ref={pulsePacket1}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={pulsePacket2}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh ref={pulsePacket3}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
    </group>
  );
}
