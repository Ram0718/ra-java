import { Text, Float } from '@react-three/drei';

const LABELS = [
  {
    title: 'BACKEND CORE',
    sub: 'Spring Boot, Java, Security & APIs',
    pos: [6.4, 3.2, 0.4] as [number, number, number],
    color: '#00f0ff',
  },
  {
    title: 'DATABASE & PERSISTENCE',
    sub: 'MySQL, JPA, Hibernate ORM',
    pos: [9.1, 1.9, 0.1] as [number, number, number],
    color: '#10b981',
  },
  {
    title: 'FRONTEND INTEGRATION',
    sub: 'React, Modern JS, Web APIs',
    pos: [6.6, -1.2, 0.4] as [number, number, number],
    color: '#a855f7',
  },
  {
    title: 'DEV TOOLS & VCS',
    sub: 'Git, GitHub, Postman Testing',
    pos: [4.4, 0.9, -0.4] as [number, number, number],
    color: '#f59e0b',
  },
];

export function CategoryLabels3D() {
  return (
    <group>
      {LABELS.map((lbl, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.08} floatIntensity={0.25} position={lbl.pos}>
          <group>
            {/* Background pill panel */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.0, 0.38]} />
              <meshBasicMaterial color="#050a17" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 0, -0.015]}>
              <ringGeometry args={[0.98, 1.0, 4]} />
              <meshBasicMaterial color={lbl.color} transparent opacity={0.6} />
            </mesh>

            {/* Category Main Title */}
            <Text
              fontSize={0.13}
              color={lbl.color}
              anchorX="center"
              anchorY="middle"
              font="monospace"
              position={[0, 0.06, 0]}
            >
              {lbl.title}
            </Text>

            {/* Subtitle */}
            <Text
              fontSize={0.075}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              font="monospace"
              position={[0, -0.07, 0]}
            >
              {lbl.sub}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
}
