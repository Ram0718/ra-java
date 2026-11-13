import type { Project, SkillCategory, ExperienceItem, SectionId, CameraWaypoint } from '../types/portfolio';

export const DEVELOPER_PROFILE = {
  name: "Rambabu",
  role: "Java Developer",
  experienceYears: "1.6+",
  tagline: "Building scalable, high-throughput backend systems with Java & Spring Boot.",
  bio: "Passionate Java Developer with 1.6+ years of professional backend engineering experience. Specialized in designing high-concurrency RESTful APIs, architecting enterprise Spring Boot microservices, optimizing complex MySQL database queries, and integrating modern React frontends. Creator of eAshaOP, a full-scale healthcare OPD and doctor consultation engine.",
  location: "India",
  email: "rambabu.dev.eng@gmail.com",
  github: "https://github.com/rambabu-dev",
  linkedin: "https://linkedin.com/in/rambabu-java-dev",
  uptime: "99.98%",
  apisBuilt: "45+",
  codeCommits: "1.2k+",
  techBadges: [
    { label: "Java 17/21", color: "#f89820" },
    { label: "Spring Boot 3", color: "#6db33f" },
    { label: "Spring Security", color: "#10b981" },
    { label: "Hibernate / JPA", color: "#b91c1c" },
    { label: "MySQL", color: "#00758f" },
    { label: "React", color: "#61dafb" },
    { label: "Microservices", color: "#8b5cf6" },
    { label: "Docker & Maven", color: "#2496ed" },
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "eashaop",
    title: "eAshaOP",
    category: "Full-Stack Healthcare Platform",
    subtitle: "Online Healthcare & Doctor Appointment Management System",
    period: "Production Project",
    role: "Lead Backend Architect & Full-Stack Developer",
    overview: "A mission-critical healthcare application engineered to digitize outpatient departments (OPD), doctor consultations, patient medical records, and appointment scheduling. Built with robust Spring Boot microservices, Spring Security JWT authentication, and transactional MySQL concurrency protection.",
    featured: true,
    keyFeatures: [
      "Dynamic Doctor Slot Scheduling: Real-time availability calculation preventing double-booking race conditions.",
      "Role-Based Access Control (RBAC): Distinct permissions for Doctors, Patients, Receptionists, and Hospital Admins.",
      "Automated Token & Queue Engine: Live OPD patient queue tracking reducing hospital wait times by 40%.",
      "Medical Records Vault: HIPAA-aligned encrypted storage of prescriptions, lab reports, and consultation summaries.",
      "Interactive Patient Portal: Modern responsive React UI for browsing doctors, booking slots, and downloading PDF prescriptions."
    ],
    backendArchitecture: [
      "Spring Boot 3.x RESTful Microservices with layered Controller-Service-Repository architecture.",
      "Spring Data JPA & Hibernate with custom Criteria queries and query performance indexing.",
      "Spring Security filter chain with stateless JWT token authorization and BCrypt password encryption.",
      "MySQL relational schema with ACID transaction management on appointment reservation locks.",
      "Global Exception Handling with custom ErrorResponse payloads and Swagger / OpenAPI 3.0 documentation."
    ],
    techStack: ["Java 17", "Spring Boot", "Spring Data JPA", "Spring Security", "MySQL", "React", "Tailwind CSS", "Maven", "Postman"],
    metrics: [
      { label: "API Response Time", value: "< 85ms" },
      { label: "Slot Concurrency", value: "Zero Overbooking" },
      { label: "Database Normalization", value: "3NF Compliant" },
      { label: "Active Roles", value: "4 Distinct Portals" }
    ],
    githubUrl: "https://github.com/rambabu-dev/eAshaOP-healthcare-platform",
    liveUrl: "https://eashaop.example.com"
  },
  {
    id: "enterprise-api",
    title: "Core Service Gateway",
    category: "Backend Microservices",
    subtitle: "High-Throughput Authentication & Service Dispatcher",
    period: "Enterprise Engineering",
    role: "Backend Engineer",
    overview: "Modular Spring Cloud API Gateway handling rate limiting, request validation, centralized JWT token issuance, and routing across distributed internal services.",
    featured: false,
    keyFeatures: [
      "Centralized Spring Security OAuth2/JWT token verification.",
      "Dynamic routing and rate-limiting using Token Bucket algorithm.",
      "Custom logging filters for telemetry, latency monitoring, and audit trails."
    ],
    backendArchitecture: [
      "Spring Cloud Gateway with reactive Netty HTTP runtime.",
      "Distributed cache synchronization with Redis and MySQL fallback.",
      "Prometheus & Actuator metrics telemetry export."
    ],
    techStack: ["Java 21", "Spring Boot", "Spring Cloud", "MySQL", "Docker"],
    metrics: [
      { label: "Throughput", value: "10k+ req/sec" },
      { label: "Latency P99", value: "22ms" }
    ],
    githubUrl: "https://github.com/rambabu-dev/enterprise-service-gateway"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Core Backend & Frameworks",
    subtitle: "Enterprise architecture and service design",
    color: "#00f0ff",
    skills: [
      { name: "Java (17 / 21)", level: 92, category: "core", iconName: "Coffee", detail: "OOP, Multithreading, Streams API, Concurrency, JVM Internals" },
      { name: "Spring Boot 3", level: 90, category: "framework", iconName: "Leaf", detail: "Auto-configuration, Starters, Actuator, Dependency Injection" },
      { name: "Spring Data JPA & Hibernate", level: 88, category: "framework", iconName: "Database", detail: "ORM mapping, entity lifecycles, query caching, N+1 prevention" },
      { name: "Spring Security & JWT", level: 85, category: "framework", iconName: "Shield", detail: "Stateless authentication, OAuth2, RBAC, CSRF/CORS filters" },
      { name: "RESTful API Architecture", level: 94, category: "core", iconName: "Server", detail: "Clean HTTP semantics, pagination, versioning, DTO pattern" },
      { name: "Microservices & Distributed Systems", level: 82, category: "core", iconName: "Network", detail: "Service discovery, resilience, distributed transaction awareness" }
    ]
  },
  {
    title: "Database & Storage",
    subtitle: "Relational modeling, indexing & optimization",
    color: "#10b981",
    skills: [
      { name: "MySQL", level: 88, category: "database", iconName: "HardDrive", detail: "Schema design, joins, index tuning, execution plan analysis, ACID transactions" },
      { name: "Relational Data Modeling", level: 90, category: "database", iconName: "Table", detail: "Normalization (1NF-3NF), foreign key constraints, ER diagrams" },
      { name: "Query Optimization", level: 84, category: "database", iconName: "Zap", detail: "EXPLAIN query profiling, composite indexes, query refactoring" }
    ]
  },
  {
    title: "Frontend & UI Integration",
    subtitle: "Modern client-side engineering",
    color: "#a855f7",
    skills: [
      { name: "React.js", level: 80, category: "framework", iconName: "Code", detail: "Functional components, hooks, custom state management, Axios API consumption" },
      { name: "TypeScript & JavaScript ES6+", level: 78, category: "core", iconName: "FileCode", detail: "Strong typing, async/await, DOM event lifecycle, clean interfaces" },
      { name: "Tailwind CSS", level: 85, category: "tool", iconName: "Palette", detail: "Responsive layouts, utility classes, dark-mode styling, animations" }
    ]
  },
  {
    title: "DevOps, Tools & Practices",
    subtitle: "Testing, containerization & CI workflows",
    color: "#f59e0b",
    skills: [
      { name: "Docker", level: 78, category: "tool", iconName: "Box", detail: "Multi-stage Dockerfiles, containerized Spring Boot apps, Docker Compose" },
      { name: "Maven & Build Management", level: 86, category: "tool", iconName: "Package", detail: "Dependency management, multi-module builds, profiles, plugins" },
      { name: "Git & Version Control", level: 90, category: "tool", iconName: "GitBranch", detail: "GitFlow branching, PR reviews, merge conflict resolution" },
      { name: "Postman & Swagger/OpenAPI", level: 92, category: "tool", iconName: "Send", detail: "Automated API contract testing, mock servers, interactive docs" }
    ]
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Java Backend Developer",
    organization: "Enterprise Software Solutions",
    duration: "1.6+ Years (2023 - Present)",
    status: "CURRENT",
    description: "Architecting and developing mission-critical Java Spring Boot backend services, optimizing relational databases, and delivering secure RESTful APIs for healthcare and enterprise domains.",
    highlights: [
      "Engineered end-to-end backend microservices for eAshaOP healthcare platform, supporting doctor slot allocation and patient triage.",
      "Optimized complex relational SQL queries in MySQL, slashing database read query latency by 35%.",
      "Configured robust Spring Security filters with JSON Web Tokens (JWT) and role-based endpoints.",
      "Collaborated closely with frontend engineers to integrate React client interfaces with clean REST APIs.",
      "Enforced unit test coverage using JUnit 5 and Mockito, ensuring bulletproof production deployment pipelines."
    ],
    technologies: ["Java 17", "Spring Boot", "Spring Data JPA", "MySQL", "Spring Security", "React", "Docker", "Git"]
  }
];

export const CAMERA_WAYPOINTS: Record<SectionId, CameraWaypoint> = {
  home: {
    position: [0, 1.4, 4.2],
    target: [0, 0.4, 0],
    fov: 45
  },
  about: {
    position: [-6.8, 1.8, 4.4],
    target: [-6.8, 1.3, -0.2],
    fov: 44
  },
  skills: {
    position: [6.8, 1.8, 4.8],
    target: [6.8, 1.0, -0.4],
    fov: 46
  },
  experience: {
    position: [0, 2.0, -7.5],
    target: [0, 1.4, -15.0],
    fov: 48
  },
  projects: {
    position: [0, 2.2, 14.8],
    target: [0, 1.2, 8.2],
    fov: 46
  },
  contact: {
    position: [-7.8, 1.8, 12.8],
    target: [-7.8, 1.2, 7.8],
    fov: 46
  }
};
