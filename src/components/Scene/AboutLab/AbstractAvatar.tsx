import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AbstractAvatar() {
  const avatarGroup = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle breathing / floating motion
    if (avatarGroup.current) {
      avatarGroup.current.position.y = 0.05 * Math.sin(t * 1.6);
      // Subtle gaze toward mouse cursor
      avatarGroup.current.rotation.y = state.pointer.x * 0.15;
      avatarGroup.current.rotation.x = -state.pointer.y * 0.08;
    }

    // Concentric base energy rings rotation
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.6;

    // Glowing energy core pulse & rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.8;
      coreRef.current.rotation.y = t * 1.1;
      const scale = 0.95 + 0.12 * Math.sin(t * 3.5);
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 2.2 + 0.8 * Math.sin(t * 3.5);
    }

    // Neural halo float
    if (haloRef.current) {
      haloRef.current.rotation.x = Math.sin(t * 0.7) * 0.2 + 0.2;
      haloRef.current.rotation.y = t * 0.5;
    }

    // Holographic typing animation on hands
    if (leftHandRef.current) {
      leftHandRef.current.position.y = 0.92 + 0.02 * Math.sin(t * 8);
      leftHandRef.current.position.z = 0.38 + 0.015 * Math.cos(t * 6);
    }
    if (rightHandRef.current) {
      rightHandRef.current.position.y = 0.92 + 0.02 * Math.cos(t * 7.5);
      rightHandRef.current.position.z = 0.38 + 0.015 * Math.sin(t * 6.5);
    }
  });

  return (
    <group position={[-6.8, 0, -0.3]}>
      {/* 1. HOLOGRAPHIC PROJECTION DAIS / PEDESTAL */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.12, 32]} />
        <meshStandardMaterial color="#0b1120" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Dais Glowing Perimeter Ring */}
      <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.96, 1.02, 48]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
      </mesh>

      {/* Rotating Concentric Holographic Rings */}
      <mesh ref={ring1Ref} position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.015, 16, 48]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.65} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.012, 16, 36]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
      </mesh>

      {/* Vertical Cylindrical Holo Beam */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 1.9, 24, 1, true]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. CENTRAL ABSTRACT DEVELOPER AVATAR */}
      <group ref={avatarGroup}>
        {/* Torso Base / Lower Body Conduit */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.22, 0.12, 0.45, 8]} />
          <meshStandardMaterial color="#080e1e" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Chest / Polyhedral Torso Armor */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[0.55, 0.52, 0.32]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.9}
            roughness={0.2}
            wireframe={false}
          />
        </mesh>

        {/* Torso Cyan Edge Inlays */}
        <mesh position={[0, 1.0, 0.165]}>
          <boxGeometry args={[0.42, 0.02, 0.01]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[0, 0.85, 0.165]}>
          <boxGeometry args={[0.28, 0.015, 0.01]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {/* Glowing Java / Spring Power Core (Inside chest chamber) */}
        <mesh ref={coreRef} position={[0, 1.04, 0.12]}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.8}
            wireframe={false}
          />
        </mesh>
        <pointLight
          ref={coreLightRef}
          position={[0, 1.04, 0.22]}
          color="#00f0ff"
          intensity={2.5}
          distance={2.5}
        />

        {/* Shoulders */}
        <mesh position={[-0.36, 1.18, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.22, 0.14, 0.24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.36, 1.18, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.22, 0.14, 0.24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.14, 16]} />
          <meshStandardMaterial color="#0a0f1d" metalness={0.9} />
        </mesh>

        {/* Cybernetic Helmet / Head */}
        <mesh position={[0, 1.48, 0]}>
          <boxGeometry args={[0.28, 0.3, 0.28]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Sleek Panoramic Neon Visor */}
        <mesh ref={visorRef} position={[0, 1.49, 0.142]}>
          <boxGeometry args={[0.26, 0.08, 0.02]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>

        {/* Floating Neural Halo Ring */}
        <mesh ref={haloRef} position={[0, 1.72, 0]}>
          <torusGeometry args={[0.24, 0.008, 16, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>

        {/* Floating Cybernetic Hands */}
        <group ref={leftHandRef} position={[-0.22, 0.92, 0.38]}>
          <mesh>
            <boxGeometry args={[0.1, 0.03, 0.12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.01, 0.05]}>
            <boxGeometry args={[0.08, 0.015, 0.06]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>

        <group ref={rightHandRef} position={[0.22, 0.92, 0.38]}>
          <mesh>
            <boxGeometry args={[0.1, 0.03, 0.12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.01, 0.05]}>
            <boxGeometry args={[0.08, 0.015, 0.06]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Floating Virtual Holographic Keyboard Lattice */}
        <group position={[0, 0.86, 0.42]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <planeGeometry args={[0.7, 0.28]} />
            <meshBasicMaterial
              color="#00f0ff"
              wireframe
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Keyboard glowing border */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.34, 0.35, 4]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
