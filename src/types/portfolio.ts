export type SectionId = 'home' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';

export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  period: string;
  role: string;
  overview: string;
  keyFeatures: string[];
  backendArchitecture: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  category: 'core' | 'framework' | 'database' | 'tool';
  iconName: string;
  detail: string;
}

export interface SkillCategory {
  title: string;
  subtitle: string;
  color: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  duration: string;
  status: 'CURRENT' | 'PREVIOUS';
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface CameraWaypoint {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
