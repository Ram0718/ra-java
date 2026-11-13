import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TimelineTunnel } from './TimelineTunnel';
import { TimelineBeacon } from './TimelineBeacon';
import { MilestoneCard3D } from './MilestoneCard3D';
import { soundFX } from '../../../utils/soundEffects';
import { Navigation } from 'lucide-react';

interface ExperienceTimelineProps {
  activeSection: string;
}

const MILESTONE_STATIONS = [
  { name: 'STATION 01 // CORE BACKEND', z: -10.5, camY: 2.0 },
  { name: 'STATION 02 // JAVA DEV (1.6+ YRS)', z: -15.5, camY: 2.1 },
  { name: 'STATION 03 // DATABASE & JPA', z: -20.5, camY: 2.0 },
  { name: 'STATION 04 // SECURITY & TESTING', z: -25.5, camY: 2.0 },
];

export function ExperienceTimeline({ activeSection }: ExperienceTimelineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const targetCamZ = useRef<number | null>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle parallax tilt
      groupRef.current.position.x = state.pointer.x * 0.08;
      groupRef.current.position.y = state.pointer.y * 0.06;
    }

    // Sub-milestone camera flight if targetCamZ is set
    if (targetCamZ.current !== null && activeSection === 'experience') {
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ.current + 3.2, 3, delta);
      if (Math.abs(camera.position.z - (targetCamZ.current + 3.2)) < 0.08) {
        targetCamZ.current = null;
      }
    }
  });

  const travelToStation = (z: number) => {
    soundFX.playClick();
    soundFX.playWarp();
    targetCamZ.current = z;
  };

  return (
    <group ref={groupRef}>
      {/* 1. FUTURISTIC TIMELINE TUNNEL RUNWAY & ARCHES */}
      <TimelineTunnel />

      {/* 2. ENTRANCE 3D TITLE BANNER */}
      <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2} position={[0, 3.4, -8.2]}>
        <group>
          <Text
            fontSize={0.38}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#00f0ff"
          >
            CAREER TIMELINE TUNNEL
          </Text>
          <Text
            position={[0, -0.28, 0]}
            fontSize={0.13}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
          >
            1.6+ YEARS ENTERPRISE JAVA &amp; SPRING BOOT EVOLUTION
          </Text>
        </group>
      </Float>

      {/* 3. INTERACTIVE 3D SUB-MILESTONE TRAVEL CONTROLS */}
      <group position={[0, 3.1, -9.2]}>
        <Html
          transform
          distanceFactor={3.6}
          center
          className="pointer-events-auto select-none"
        >
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl cyber-glass border border-cyan-500/40 text-[10px] font-mono shadow-xl">
            <span className="text-cyan-400 font-bold px-2 flex items-center gap-1">
              <Navigation className="w-3 h-3 animate-pulse" />
              TRAVEL TO:
            </span>
            {MILESTONE_STATIONS.map((st, i) => (
              <button
                key={st.name}
                onClick={() => travelToStation(st.z)}
                className="px-2.5 py-1 rounded bg-slate-900/80 hover:bg-cyan-500/25 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all"
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </Html>
      </group>

      {/* 4. STATION 1 (Z: -10.5) - CORE BACKEND & REST APIS */}
      <MilestoneCard3D
        milestoneNumber="01"
        period="Phase 1: Architecture"
        role="BACKEND REST ARCHITECT"
        subtitle="Foundations of Enterprise Scalability"
        position={[-2.3, 1.8, -10.5]}
        rotationY={0.35}
        themeColor="cyan"
        responsibilities={[
          { label: 'Backend Development', detail: 'Designing modular Spring Boot layered architectures (Controller, Service, Repository).' },
          { label: 'REST API Development', detail: 'Engineering stateless RESTful APIs with clean HTTP semantics, pagination, and DTOs.' },
          { label: 'API Testing', detail: 'Automated contract and regression testing using Postman collections and JUnit 5.' },
          { label: 'Application Maintenance', detail: 'Refactoring legacy routines and establishing clean GitFlow version control.' }
        ]}
        technologies={['Java 17', 'Spring Boot 3', 'REST APIs', 'Maven', 'Postman', 'Git']}
      />
      <TimelineBeacon position={[-1.4, 0.15, -10.5]} color="#00f0ff" phase="01" />

      {/* 5. STATION 2 (Z: -15.5) - THE MAIN PINNACLE MILESTONE */}
      <MilestoneCard3D
        milestoneNumber="02"
        period="2023 - Present"
        role="JAVA DEVELOPER"
        subtitle="1.6+ YEARS PROFESSIONAL EXPERIENCE"
        isMainMilestone={true}
        position={[2.3, 1.9, -15.5]}
        rotationY={-0.35}
        themeColor="cyan"
        responsibilities={[
          { label: 'Backend Development', detail: 'Spearheading core backend microservices for eAshaOP healthcare platform.' },
          { label: 'REST API Development', detail: 'Sub-85ms latency appointment booking APIs handling concurrent slot reservation.' },
          { label: 'Database Integration', detail: 'Designing high-throughput MySQL relational schema with 3NF compliance and indexing.' },
          { label: 'Authentication', detail: 'Hardening endpoints with Spring Security, stateless JWT tokens, and RBAC authorization.' },
          { label: 'Bug Fixing & Testing', detail: 'Proactive race condition elimination, transaction rollbacks, and unit test suites.' },
          { label: 'Application Maintenance', detail: 'Monitoring production reliability, HikariCP connection pooling, and 99.98% uptime.' }
        ]}
        technologies={['Java 21', 'Spring Boot', 'Spring Security', 'JWT', 'MySQL', 'Hibernate', 'React', 'Docker']}
      />
      <TimelineBeacon position={[1.4, 0.15, -15.5]} color="#10b981" phase="02" />

      {/* 6. STATION 3 (Z: -20.5) - DATABASE & DATA INTEGRITY */}
      <MilestoneCard3D
        milestoneNumber="03"
        period="Phase 3: Persistence"
        role="DATABASE INTEGRATION & ORM"
        subtitle="High-Throughput Relational Storage & Locking"
        position={[-2.3, 1.8, -20.5]}
        rotationY={0.35}
        themeColor="emerald"
        responsibilities={[
          { label: 'Database Integration', detail: 'Configuring Spring Data JPA entities, cascading lifecycles, and custom JPQL queries.' },
          { label: 'Concurrency & Locking', detail: 'Enforcing ACID transaction boundaries and reservation locks to eliminate overbooking.' },
          { label: 'Bug Fixing', detail: 'Profiling slow SQL queries using EXPLAIN plans and eliminating N+1 Hibernate fetches.' },
          { label: 'Application Maintenance', detail: 'Automated database schema migrations, connection pooling tuning, and indexing.' }
        ]}
        technologies={['MySQL', 'Spring Data JPA', 'Hibernate', 'SQL Indexing', 'ACID', 'HikariCP']}
      />
      <TimelineBeacon position={[-1.4, 0.15, -20.5]} color="#f59e0b" phase="03" />

      {/* 7. STATION 4 (Z: -25.5) - SECURITY, QUALITY & TESTING */}
      <MilestoneCard3D
        milestoneNumber="04"
        period="Phase 4: Security & Quality"
        role="SECURITY & API ECOSYSTEM"
        subtitle="Hardened Auth, Bug Remediation & Continuous Health"
        position={[2.3, 1.8, -25.5]}
        rotationY={-0.35}
        themeColor="purple"
        responsibilities={[
          { label: 'Authentication', detail: 'Multi-role RBAC authorization for Patients, Doctors, and Hospital Administrators.' },
          { label: 'API Testing', detail: 'End-to-end integration tests, Postman mock servers, and interactive Swagger/OpenAPI docs.' },
          { label: 'Bug Fixing', detail: 'Systematic root cause analysis, resolving null safety risks, and edge-case exceptions.' },
          { label: 'Application Maintenance', detail: 'Configuring Spring Boot Actuator health checks, telemetry, and containerized Docker runs.' }
        ]}
        technologies={['Spring Security', 'JWT', 'Postman', 'JUnit 5', 'Swagger', 'Docker', 'Linux']}
      />
      <TimelineBeacon position={[1.4, 0.15, -25.5]} color="#a855f7" phase="04" />

      {/* 8. TUNNEL LOCALIZED CYBER PARTICLES */}
      <Sparkles
        count={80}
        scale={[4, 3, 18]}
        position={[0, 1.8, -17]}
        size={2.5}
        speed={0.4}
        color="#00f0ff"
      />
      <Sparkles
        count={60}
        scale={[4, 3, 14]}
        position={[0, 1.5, -21]}
        size={2.2}
        speed={0.3}
        color="#10b981"
      />
      <Sparkles
        count={45}
        scale={[4, 3, 12]}
        position={[0, 1.5, -12]}
        size={2.6}
        speed={0.35}
        color="#a855f7"
      />
    </group>
  );
}
