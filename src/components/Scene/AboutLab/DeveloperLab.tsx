import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { AbstractAvatar } from './AbstractAvatar';
import { HolographicStatCard } from './HolographicStatCard';
import { ArchitectureDiagram3D } from './ArchitectureDiagram3D';
import { LabTerminal } from './LabTerminal';

const CODE_FRAGMENTS = [
  { text: '@Service\n@Transactional', pos: [-8.8, 2.5, -0.6] as [number, number, number], color: '#10b981' },
  { text: 'public class HealthcareEngine {', pos: [-8.4, 0.6, 0.4] as [number, number, number], color: '#38bdf8' },
  { text: 'Optional<DoctorSlot> slot;', pos: [-5.0, 2.7, -0.8] as [number, number, number], color: '#f59e0b' },
  { text: '@PreAuthorize("hasRole(\'DOCTOR\')")', pos: [-8.6, 1.6, -1.2] as [number, number, number], color: '#00f0ff' },
  { text: 'SecurityContextHolder.getContext()', pos: [-5.2, 0.4, 0.6] as [number, number, number], color: '#c084fc' },
];

export function DeveloperLab() {
  const labRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (labRef.current) {
      // Subtle parallax tilt across the laboratory
      labRef.current.position.x = state.pointer.x * 0.12;
      labRef.current.position.y = state.pointer.y * 0.08;
    }
  });

  return (
    <group ref={labRef}>
      {/* 1. SECTOR OVERHEAD SPOTLIGHT & ATMOSPHERIC LIGHTING */}
      <spotLight
        position={[-6.8, 4.5, 1.2]}
        target-position={[-6.8, 1.2, -0.3]}
        angle={0.7}
        penumbra={0.8}
        intensity={3.8}
        color="#38bdf8"
        distance={9}
      />
      <pointLight
        position={[-6.8, 2.8, -0.2]}
        color="#00f0ff"
        intensity={2.0}
        distance={6}
      />
      <pointLight
        position={[-4.5, 1.5, 0.5]}
        color="#10b981"
        intensity={1.8}
        distance={5}
      />

      {/* 2. LAB LARGE FLOATING TITLE IN 3D SPACE */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2} position={[-6.8, 3.2, -0.8]}>
        <group>
          <Text
            fontSize={0.42}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#00f0ff"
          >
            ABOUT ME
          </Text>
          <Text
            position={[0, -0.32, 0]}
            fontSize={0.15}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
          >
            FUTURISTIC DEVELOPER LABORATORY // RAMBABU
          </Text>
        </group>
      </Float>

      {/* 3. CENTRAL 3D DEVELOPER REPRESENTATION (ABSTRACT AVATAR) */}
      <AbstractAvatar />

      {/* 4. THREE FLOATING 3D HOLOGRAPHIC STAT CARDS (Rotate toward cursor) */}
      {/* Card 1: 1.6+ Years Experience (Left flank) */}
      <HolographicStatCard
        position={[-8.8, 1.8, 0.3]}
        metric="1.6+"
        label="Years Experience"
        subText="Backend Architecture"
        themeColor="emerald"
      />

      {/* Card 2: JAVA Backend Development (Above right flank) */}
      <HolographicStatCard
        position={[-8.8, 0.8, 0.5]}
        metric="JAVA"
        label="Backend Development"
        subText="Spring Boot 3 / Microservices"
        themeColor="cyan"
      />

      {/* Card 3: REST API Development (Center upper flank) */}
      <HolographicStatCard
        position={[-6.8, 2.4, 0.6]}
        metric="REST"
        label="API Development"
        subText="High-Concurrency & Security"
        themeColor="purple"
      />

      {/* 5. 3D LABORATORY TERMINAL (About Dossier & Tech Stack) */}
      <LabTerminal />

      {/* 6. 3D BACKEND ARCHITECTURE DIAGRAM */}
      <ArchitectureDiagram3D />

      {/* 7. FLOATING GLASS PANELS & CODE FRAGMENTS */}
      {CODE_FRAGMENTS.map((frag, idx) => (
        <Float
          key={idx}
          speed={1.4 + (idx % 3) * 0.3}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          position={frag.pos}
        >
          <group>
            {/* Glass panel backing */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.5, 0.45]} />
              <meshStandardMaterial
                color="#060e22"
                transparent
                opacity={0.65}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
            {/* Glowing edge */}
            <mesh position={[0, 0, -0.015]}>
              <ringGeometry args={[0.74, 0.75, 4]} />
              <meshBasicMaterial color={frag.color} transparent opacity={0.5} />
            </mesh>
            {/* Code text */}
            <Text
              fontSize={0.09}
              color={frag.color}
              anchorX="center"
              anchorY="middle"
              font="monospace"
            >
              {frag.text}
            </Text>
          </group>
        </Float>
      ))}

      {/* 8. FLOATING JAVA SYMBOLS (Stylized coffee beans and brackets) */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6} position={[-8.0, 2.7, 0.2]}>
        <mesh>
          <torusGeometry args={[0.16, 0.04, 16, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.5}
            metalness={0.8}
          />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.5} position={[-5.6, 2.7, 0.5]}>
        <Text
          fontSize={0.25}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
        >
          {'{ }'}
        </Text>
      </Float>

      {/* 9. LOCALIZED LAB CYBER PARTICLES */}
      <Sparkles
        count={85}
        scale={[6, 4, 5]}
        position={[-6.8, 1.6, 0]}
        size={2.8}
        speed={0.4}
        color="#00f0ff"
      />
      <Sparkles
        count={55}
        scale={[5, 3, 4]}
        position={[-6.8, 1.2, -0.8]}
        size={2.2}
        speed={0.3}
        color="#10b981"
      />
      <Sparkles
        count={45}
        scale={[6, 3, 5]}
        position={[-5.0, 1.5, 0]}
        size={2.5}
        speed={0.35}
        color="#a855f7"
      />
    </group>
  );
}
