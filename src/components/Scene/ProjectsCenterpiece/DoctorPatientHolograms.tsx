import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Stethoscope, User, HeartPulse } from 'lucide-react';

export function DoctorPatientHolograms() {
  const docGroup = useRef<THREE.Group>(null);
  const patGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (docGroup.current) {
      docGroup.current.position.y = 0.04 * Math.sin(t * 1.8);
    }
    if (patGroup.current) {
      patGroup.current.position.y = 0.04 * Math.sin(t * 1.8 + 1.2);
    }
  });

  return (
    <group>
      {/* 1. DOCTOR HOLOGRAM (LEFT FLANK) */}
      <group position={[-2.6, 0, 8.8]}>
        {/* Dais Base */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.65, 0.75, 0.14, 24]} />
          <meshStandardMaterial color="#061226" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.64, 32]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Doctor Avatar Figure */}
        <group ref={docGroup}>
          {/* Torso / Lab Coat */}
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[0.38, 0.65, 0.22]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#00f0ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
              wireframe={false}
            />
          </mesh>

          {/* Stethoscope Loop */}
          <mesh position={[0, 1.05, 0.12]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.12, 0.015, 12, 24, Math.PI * 1.1]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Doctor Head / Visor */}
          <mesh position={[0, 1.34, 0]}>
            <boxGeometry args={[0.22, 0.24, 0.22]} />
            <meshStandardMaterial color="#0f172a" emissive="#00f0ff" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 1.35, 0.115]}>
            <boxGeometry args={[0.18, 0.06, 0.01]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>

          {/* Floating Medical Tablet / Telemetry HUD */}
          <group position={[0.26, 0.95, 0.25]} rotation={[0.2, -0.3, 0]}>
            <mesh>
              <boxGeometry args={[0.28, 0.38, 0.01]} />
              <meshBasicMaterial color="#0369a1" transparent opacity={0.85} />
            </mesh>
            <Html
              transform
              distanceFactor={3.2}
              position={[0, 0, 0.02]}
              center
              className="pointer-events-none select-none"
            >
              <div className="w-32 p-2 rounded bg-slate-950/90 border border-cyan-400/80 font-mono text-[8px] text-cyan-300">
                <div className="flex items-center gap-1 font-bold text-white mb-1">
                  <Stethoscope className="w-3 h-3 text-cyan-400" />
                  <span>DR. PORTAL</span>
                </div>
                <div>SLOTS: 14/16 BOOKED</div>
                <div className="text-emerald-400">STATUS: CONSULTING</div>
              </div>
            </Html>
          </group>
        </group>
      </group>

      {/* 2. PATIENT HOLOGRAM (RIGHT FLANK) */}
      <group position={[2.6, 0, 8.8]}>
        {/* Dais Base */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.65, 0.75, 0.14, 24]} />
          <meshStandardMaterial color="#061a15" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.64, 32]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {/* Patient Avatar Figure */}
        <group ref={patGroup}>
          {/* Torso */}
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[0.36, 0.65, 0.22]} />
            <meshStandardMaterial
              color="#047857"
              emissive="#10b981"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Patient Head */}
          <mesh position={[0, 1.34, 0]}>
            <boxGeometry args={[0.22, 0.24, 0.22]} />
            <meshStandardMaterial color="#0f172a" emissive="#10b981" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 1.35, 0.115]}>
            <boxGeometry args={[0.18, 0.06, 0.01]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          {/* Floating OPD Ticket / Token Badge */}
          <group position={[-0.26, 0.95, 0.25]} rotation={[0.2, 0.3, 0]}>
            <mesh>
              <boxGeometry args={[0.28, 0.38, 0.01]} />
              <meshBasicMaterial color="#064e3b" transparent opacity={0.85} />
            </mesh>
            <Html
              transform
              distanceFactor={3.2}
              position={[0, 0, 0.02]}
              center
              className="pointer-events-none select-none"
            >
              <div className="w-32 p-2 rounded bg-slate-950/90 border border-emerald-400/80 font-mono text-[8px] text-emerald-300">
                <div className="flex items-center gap-1 font-bold text-white mb-1">
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>OPD TOKEN #14</span>
                </div>
                <div>CONFIRMED: 10:30 AM</div>
                <div className="text-cyan-300 flex items-center gap-1">
                  <HeartPulse className="w-2.5 h-2.5 text-cyan-400" />
                  <span>VITALS: NORMAL</span>
                </div>
              </div>
            </Html>
          </group>
        </group>
      </group>
    </group>
  );
}
