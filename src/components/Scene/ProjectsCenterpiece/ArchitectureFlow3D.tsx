import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundFX } from '../../../utils/soundEffects';

interface ArchStep {
  id: string;
  stepNum: string;
  name: string;
  tech: string;
  pos: [number, number, number];
  color: string;
  detail: string;
}

const FLOW_STEPS: ArchStep[] = [
  {
    id: 'patient',
    stepNum: '01',
    name: 'PATIENT CLIENT',
    tech: 'React / Axios',
    pos: [-3.0, 0.4, 11.2],
    color: '#38bdf8',
    detail: 'Responsive patient interface for browsing doctor specialties, viewing real-time slots, and requesting appointment bookings.',
  },
  {
    id: 'rest',
    stepNum: '02',
    name: 'REST API',
    tech: 'Spring MVC',
    pos: [-2.0, 0.7, 11.0],
    color: '#00f0ff',
    detail: 'Layered HTTP endpoints (@RestController, @RequestMapping) handling payload validation (@Valid) and DTO mapping.',
  },
  {
    id: 'boot',
    stepNum: '03',
    name: 'SPRING BOOT',
    tech: 'Spring Boot 3.2',
    pos: [-1.0, 1.0, 10.8],
    color: '#10b981',
    detail: 'Inversion of Control (IoC) container managing bean lifecycles, configuration starters, and embedded Tomcat HTTP dispatch.',
  },
  {
    id: 'security',
    stepNum: '04',
    name: 'SECURITY / JWT',
    tech: 'Spring Security 6',
    pos: [0.0, 1.3, 10.6],
    color: '#3b82f6',
    detail: 'Stateless SecurityFilterChain verifying bearer JWT tokens, extracting claims, and enforcing role-based permissions (DOCTOR, PATIENT).',
  },
  {
    id: 'service',
    stepNum: '05',
    name: 'SERVICE LAYER',
    tech: 'Java 21 Services',
    pos: [1.0, 1.0, 10.8],
    color: '#f59e0b',
    detail: 'Transactional business logic (@Transactional) coordinating slot allocation locks, token queues, and preventing double-booking.',
  },
  {
    id: 'jpa',
    stepNum: '06',
    name: 'JPA / HIBERNATE',
    tech: 'Spring Data JPA',
    pos: [2.0, 0.7, 11.0],
    color: '#a855f7',
    detail: 'Object-Relational Mapping (ORM) executing optimized queries, Criteria API dynamic filters, and second-level cache.',
  },
  {
    id: 'db',
    stepNum: '07',
    name: 'MYSQL CLUSTER',
    tech: 'MySQL 8.0 InnoDB',
    pos: [3.0, 0.4, 11.2],
    color: '#10b981',
    detail: 'ACID-compliant relational storage with 3NF schema, composite indexing, and row-level reservation locks.',
  },
];

export function ArchitectureFlow3D() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Smooth CatmullRom curve connecting the 7 layers
  const flowCurve = useMemo(() => {
    const points = FLOW_STEPS.map((s) => new THREE.Vector3(...s.pos));
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const conduitTube = useMemo(() => {
    return new THREE.TubeGeometry(flowCurve, 64, 0.016, 8, false);
  }, [flowCurve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pulseRef.current) {
      const u = (t * 0.28) % 1;
      const pos = flowCurve.getPoint(u);
      pulseRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* 3D Connecting Conduit Pipeline */}
      <mesh geometry={conduitTube}>
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.65}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Traveling Data Pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 7 Interactive 3D Layer Objects */}
      {FLOW_STEPS.map((step) => {
        const isSelected = selectedStep === step.id;
        return (
          <group
            key={step.id}
            position={step.pos}
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playClick();
              setSelectedStep((prev) => (prev === step.id ? null : step.id));
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              soundFX.playHover();
            }}
          >
            {/* 3D Platform Chip */}
            <mesh>
              <boxGeometry args={[0.74, 0.42, 0.08]} />
              <meshStandardMaterial
                color="#060e22"
                metalness={0.9}
                roughness={0.2}
                emissive={step.color}
                emissiveIntensity={isSelected ? 0.9 : 0.25}
              />
            </mesh>

            {/* Glowing Border */}
            <mesh position={[0, 0, 0.045]}>
              <boxGeometry args={[0.76, 0.44, 0.005]} />
              <meshBasicMaterial color={step.color} wireframe />
            </mesh>

            {/* Step Content via Html */}
            <Html
              transform
              distanceFactor={3.2}
              position={[0, 0, 0.06]}
              center
              className="pointer-events-none select-none"
            >
              <div className="w-28 p-1.5 rounded text-center font-mono bg-slate-950/80 border border-slate-700">
                <div className="text-[7px] text-slate-400">LAYER {step.stepNum}</div>
                <div className="text-[9px] font-bold text-white tracking-tight leading-tight mt-0.5">
                  {step.name}
                </div>
                <div
                  className="mt-1 text-[7.5px] font-bold px-1 py-0.2 rounded inline-block"
                  style={{ color: step.color }}
                >
                  {step.tech}
                </div>
              </div>
            </Html>

            {/* Detailed Inspection Popout HUD (Appears when layer is clicked) */}
            {isSelected && (
              <group position={[0, 0.65, 0.2]}>
                <Html
                  transform
                  distanceFactor={3.0}
                  center
                  className="pointer-events-auto select-none"
                >
                  <div className="w-56 p-3 rounded-lg cyber-glass border border-cyan-400 font-mono text-left shadow-[0_0_25px_rgba(0,240,255,0.4)] animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 mb-1.5">
                      <span className="text-xs font-bold text-white">
                        LAYER {step.stepNum}: {step.name}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold">ACTIVE</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
                      {step.detail}
                    </p>
                    <div className="flex justify-between text-[8px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>STACK: {step.tech}</span>
                      <span className="text-cyan-300">CLICK TO CLOSE</span>
                    </div>
                  </div>
                </Html>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
