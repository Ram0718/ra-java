import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { HospitalBuilding3D } from './HospitalBuilding3D';
import { DoctorPatientHolograms } from './DoctorPatientHolograms';
import { AppointmentCalendar3D } from './AppointmentCalendar3D';
import { DatabaseCylinder3D } from './DatabaseCylinder3D';
import { SecurityShield3D } from './SecurityShield3D';
import { ArchitectureFlow3D } from './ArchitectureFlow3D';
import { soundFX } from '../../../utils/soundEffects';
import { ExternalLink, Eye, Activity, ShieldCheck } from 'lucide-react';

interface HealthcareProjectSceneProps {
  activeSection: string;
}

const TECH_BADGES = [
  'Java 17',
  'Spring Boot',
  'Spring Security',
  'Spring MVC',
  'REST APIs',
  'JPA / Hibernate',
  'MySQL',
  'JWT',
];

export function HealthcareProjectScene({ activeSection }: HealthcareProjectSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [focusArchitecture, setFocusArchitecture] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle parallax tilt across the healthcare sector
      groupRef.current.position.x = state.pointer.x * 0.08;
      groupRef.current.position.y = state.pointer.y * 0.06;
    }

    // Camera animation when focusing on the architecture pipeline
    if (focusArchitecture && activeSection === 'projects') {
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 12.8, 3, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.4, 3, delta);
    }
  });

  const handleViewArchitecture = () => {
    soundFX.playClick();
    soundFX.playWarp();
    setFocusArchitecture((prev) => !prev);
  };

  return (
    <group ref={groupRef}>
      {/* 1. SECTOR OVERHEAD SPOTLIGHT */}
      <spotLight
        position={[0, 6.0, 10.0]}
        target-position={[0, 1.0, 8.0]}
        angle={0.8}
        penumbra={0.7}
        intensity={3.6}
        color="#00f0ff"
        distance={14}
      />
      <pointLight position={[-3, 2.5, 9]} color="#10b981" intensity={2.0} distance={7} />
      <pointLight position={[3, 2.5, 9]} color="#38bdf8" intensity={2.0} distance={7} />

      {/* 2. CENTERPIECE FLOATING PROJECT BILLBOARD HUD */}
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.2} position={[0, 3.8, 8.2]}>
        <Html
          transform
          distanceFactor={3.6}
          center
          className="pointer-events-auto select-none"
        >
          <div className="w-[520px] max-w-[90vw] p-5 rounded-2xl cyber-glass border border-cyan-400/60 font-mono text-center shadow-[0_0_40px_rgba(0,240,255,0.3)]">
            {/* Top Emblem Strip */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                  PRIMARY FLAGSHIP PROJECT // CENTERPIECE
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Activity className="w-3 h-3" />
                HEALTHCARE METROPLEX
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-emerald-300 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] tracking-wide">
              eAshaOP
            </h2>
            <div className="text-xs font-bold text-slate-200 mt-0.5 uppercase tracking-wider">
              Online Healthcare &amp; Doctor Appointment Platform
            </div>

            {/* Role & Core Philosophy */}
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold my-2">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>ROLE: JAVA DEVELOPER</span>
            </div>

            {/* Project Description */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 my-2.5">
              "eAshaOP is an online healthcare and doctor appointment platform that enables patients to register,
              manage profiles, search for doctors, view availability and book appointments."
            </p>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 my-3">
              {TECH_BADGES.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-cyan-300 font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Interactive Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-800">
              {/* LIVE DEMO: Clean disabled placeholder per user instructions */}
              <button
                disabled
                title="Live staging preview active on hospital private network"
                className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-500 text-xs font-bold tracking-wider uppercase cursor-not-allowed flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                <span>LIVE DEMO [INTRANET]</span>
              </button>

              {/* GITHUB: Repository link */}
              <a
                href="https://github.com/rambabu-dev/eAshaOP-healthcare-platform"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-cyan-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GITHUB</span>
              </a>

              {/* VIEW ARCHITECTURE: Camera focus toggle */}
              <button
                onClick={handleViewArchitecture}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{focusArchitecture ? 'RESET VIEW' : 'VIEW ARCHITECTURE'}</span>
              </button>
            </div>
          </div>
        </Html>
      </Float>

      {/* 3. 3D HOSPITAL BUILDING COMPLEX */}
      <HospitalBuilding3D />

      {/* 4. DOCTOR & PATIENT HOLOGRAMS */}
      <DoctorPatientHolograms />

      {/* 5. INTERACTIVE APPOINTMENT CALENDAR */}
      <AppointmentCalendar3D />

      {/* 6. 3D DATABASE SILO CYLINDER (MYSQL 8.0) */}
      <DatabaseCylinder3D />

      {/* 7. AUTHENTICATION & SECURITY SHIELD (JWT) */}
      <SecurityShield3D />

      {/* 8. 7-LAYER VISUAL 3D ARCHITECTURE PIPELINE */}
      <ArchitectureFlow3D />

      {/* 9. FLOATING JAVA & SPRING BOOT SYMBOLS */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[-2.8, 3.2, 8.6]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.14, 0.28, 24]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#00f0ff"
            emissiveIntensity={0.4}
            metalness={0.9}
          />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.6} position={[2.8, 3.2, 8.6]}>
        <mesh>
          <octahedronGeometry args={[0.22, 1]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.6}
            wireframe
          />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4} position={[0, 0.4, 9.6]}>
        <Text
          fontSize={0.16}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {'@Transactional(readOnly = false)'}
        </Text>
      </Float>

      {/* 10. LOCALIZED HEALTHCARE CYBER PARTICLES */}
      <Sparkles
        count={80}
        scale={[8, 4, 6]}
        position={[0, 2.0, 9.5]}
        size={2.8}
        speed={0.35}
        color="#00f0ff"
      />
      <Sparkles
        count={55}
        scale={[7, 4, 5]}
        position={[0, 2.5, 7.5]}
        size={2.5}
        speed={0.3}
        color="#10b981"
      />
    </group>
  );
}
