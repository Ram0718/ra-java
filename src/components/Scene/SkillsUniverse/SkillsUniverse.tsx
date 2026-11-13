import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { CentralCoreSphere } from './CentralCoreSphere';
import { TechNode3D, type TechNodeProps } from './TechNode3D';
import { ArchitectureConduits } from './ArchitectureConduits';
import { CategoryLabels3D } from './CategoryLabels3D';

const TECH_NODES_DATA: Omit<TechNodeProps, 'isInspected' | 'onSelect'>[] = [
  // 1. BACKEND CLUSTER
  {
    name: 'Java',
    category: 'BACKEND',
    position: [5.2, 2.3, 0.4],
    level: 92,
    description: 'Java 17/21 OOP, Streams API, Multithreading, Concurrency & JVM Memory Optimization.',
  },
  {
    name: 'Spring Boot',
    category: 'BACKEND',
    position: [6.0, 2.5, 0.6],
    level: 90,
    description: 'Spring Boot 3 auto-configuration, microservice starters, dependency injection & Actuator telemetry.',
  },
  {
    name: 'Spring MVC',
    category: 'BACKEND',
    position: [6.8, 2.6, 0.7],
    level: 88,
    description: 'Layered Controller-Service-Repository pattern, request interceptors & standardized DTO contracts.',
  },
  {
    name: 'REST APIs',
    category: 'BACKEND',
    position: [7.6, 2.3, 0.5],
    level: 94,
    description: 'Enterprise RESTful endpoints with pagination, versioning, status codes & global exception handlers.',
  },
  {
    name: 'Spring Security',
    category: 'BACKEND',
    position: [5.3, 1.4, 0.7],
    level: 86,
    description: 'Stateless filter chains, OAuth2 authorization, CORS/CSRF protections & Role-Based Access Control.',
  },
  {
    name: 'JWT',
    category: 'BACKEND',
    position: [5.2, 0.6, 0.5],
    level: 88,
    description: 'Cryptographic JSON Web Token generation, signature validation, claims extraction & refresh mechanisms.',
  },

  // 2. DATABASE CLUSTER
  {
    name: 'JPA',
    category: 'DATABASE',
    position: [8.3, 1.8, 0.3],
    level: 88,
    description: 'Spring Data JPA repositories, entity lifecycle management, criteria queries & JPQL optimization.',
  },
  {
    name: 'Hibernate',
    category: 'DATABASE',
    position: [8.6, 1.1, 0.1],
    level: 86,
    description: 'Object-relational mapping, lazy loading, second-level caching & N+1 query problem resolution.',
  },
  {
    name: 'MySQL',
    category: 'DATABASE',
    position: [8.6, 0.3, -0.1],
    level: 90,
    description: 'Relational schema modeling (3NF), indexed queries, foreign keys & ACID transaction isolation.',
  },

  // 3. FRONTEND CLUSTER
  {
    name: 'React',
    category: 'FRONTEND',
    position: [7.8, -0.4, 0.3],
    level: 82,
    description: 'Component architecture, custom hooks, reactive state, and seamless REST API integration with Axios.',
  },
  {
    name: 'JavaScript',
    category: 'FRONTEND',
    position: [7.0, -0.6, 0.5],
    level: 80,
    description: 'Modern ES6+ syntax, asynchronous async/await, DOM events, and modular code structuring.',
  },
  {
    name: 'HTML',
    category: 'FRONTEND',
    position: [6.2, -0.7, 0.6],
    level: 88,
    description: 'Semantic HTML5 layouts, accessible UI landmarks, and high-performance DOM structuring.',
  },
  {
    name: 'CSS',
    category: 'FRONTEND',
    position: [5.4, -0.6, 0.4],
    level: 85,
    description: 'Modern CSS3, responsive Flexbox/Grid systems, Tailwind utility workflow & cyber styling.',
  },

  // 4. TOOLS CLUSTER
  {
    name: 'Git',
    category: 'TOOLS',
    position: [4.8, 0.0, -0.2],
    level: 90,
    description: 'Distributed version control, GitFlow branching strategies, merge conflict resolution & rebase.',
  },
  {
    name: 'GitHub',
    category: 'TOOLS',
    position: [4.5, 0.8, -0.3],
    level: 88,
    description: 'Repository governance, pull request reviews, automated CI/CD action workflows & releases.',
  },
  {
    name: 'Postman',
    category: 'TOOLS',
    position: [4.7, 1.6, -0.1],
    level: 92,
    description: 'Automated API endpoint contract testing, mock servers, environment variables & Swagger documentation.',
  },
];

export function SkillsUniverse() {
  const [inspectedTech, setInspectedTech] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle parallax tilt across the universe
      groupRef.current.position.x = state.pointer.x * 0.1;
      groupRef.current.position.y = state.pointer.y * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. SECTOR OVERHEAD LIGHTING */}
      <spotLight
        position={[6.8, 4.8, 2.0]}
        target-position={[6.8, 1.0, -0.5]}
        angle={0.75}
        penumbra={0.7}
        intensity={3.5}
        color="#00f0ff"
        distance={10}
      />
      <pointLight position={[6.8, 1.0, 1.5]} color="#10b981" intensity={1.8} distance={6} />
      <pointLight position={[8.5, 1.2, 0.5]} color="#a855f7" intensity={1.5} distance={5} />

      {/* 2. UNIVERSE TITLE BANNER IN 3D SPACE */}
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.2} position={[6.8, 3.6, -0.2]}>
        <group>
          <Text
            fontSize={0.38}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.018}
            outlineColor="#00f0ff"
          >
            TECHNOLOGY UNIVERSE
          </Text>
          <Text
            position={[0, -0.28, 0]}
            fontSize={0.13}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
          >
            ENTERPRISE FULL-STACK &amp; BACKEND ARCHITECTURE // 16 NODES
          </Text>
        </group>
      </Float>

      {/* 3. CENTRAL CORE DATA SPHERE */}
      <CentralCoreSphere />

      {/* 4. ANIMATED ARCHITECTURE CONDUITS (Java -> Spring Boot -> MVC -> REST -> JPA -> Hibernate -> MySQL) */}
      <ArchitectureConduits />

      {/* 5. 16 INTERACTIVE 3D TECHNOLOGY NODES */}
      {TECH_NODES_DATA.map((node) => (
        <TechNode3D
          key={node.name}
          {...node}
          isInspected={inspectedTech === node.name}
          onSelect={() => {
            setInspectedTech((prev) => (prev === node.name ? null : node.name));
          }}
        />
      ))}

      {/* 6. 3D CATEGORY CLUSTER LABELS */}
      <CategoryLabels3D />

      {/* 7. LOCALIZED SPARKLES & COSMIC CYBER DUST */}
      <Sparkles
        count={90}
        scale={[6, 4, 6]}
        position={[6.8, 1.0, -0.5]}
        size={2.8}
        speed={0.35}
        color="#00f0ff"
      />
      <Sparkles
        count={60}
        scale={[5, 3, 5]}
        position={[8.0, 1.2, 0.2]}
        size={2.2}
        speed={0.3}
        color="#10b981"
      />
      <Sparkles
        count={50}
        scale={[6, 4, 5]}
        position={[5.5, 0.8, 0.2]}
        size={2.5}
        speed={0.25}
        color="#a855f7"
      />
    </group>
  );
}
