import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { Particles } from './Particles';
import { FloatingCodeSymbols } from './FloatingCodeSymbols';
import { AbstractGeometries } from './AbstractGeometries';
import { Workspace } from './Workspace';
import { HeroContent } from '../Hero/HeroContent';
import { DeveloperLab } from './AboutLab/DeveloperLab';
import { SkillsUniverse } from './SkillsUniverse/SkillsUniverse';
import { ExperienceTimeline } from './ExperienceTimeline/ExperienceTimeline';
import { HealthcareProjectScene } from './ProjectsCenterpiece/HealthcareProjectScene';
import { ContactRoom3D } from './ContactRoom/ContactRoom3D';
import { PanoramicReveal3D } from './ContactRoom/PanoramicReveal3D';
import type { SectionId } from '../../types/portfolio';
import { soundFX } from '../../utils/soundEffects';
import { useTheme } from '../../context/ThemeContext';

interface PortfolioSceneProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const SECTIONS: SectionId[] = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

export function PortfolioScene({ activeSection, onNavigate }: PortfolioSceneProps) {
  const lastScrollTime = useRef(0);
  const [isPanoramic, setIsPanoramic] = useState(false);
  const { theme } = useTheme();

  // Reset panoramic mode if user changes section from navigation
  useEffect(() => {
    if (activeSection !== 'contact') {
      setIsPanoramic(false);
    }
  }, [activeSection]);

  // Wheel and Touch listeners for scroll & swipe driven 3D camera travel
  useEffect(() => {
    let touchStartY: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Ignore wheel events inside scrollable text/modal containers
      const target = e.target as HTMLElement;
      if (target && target.closest('.overflow-y-auto, textarea, input')) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 650) return;

      const currentIndex = SECTIONS.indexOf(activeSection);
      if (e.deltaY > 25) {
        // Scroll Down -> Next Section
        const nextIndex = (currentIndex + 1) % SECTIONS.length;
        lastScrollTime.current = now;
        soundFX.playWarp();
        onNavigate(SECTIONS[nextIndex]);
      } else if (e.deltaY < -25) {
        // Scroll Up -> Previous Section
        const prevIndex = (currentIndex - 1 + SECTIONS.length) % SECTIONS.length;
        lastScrollTime.current = now;
        soundFX.playWarp();
        onNavigate(SECTIONS[prevIndex]);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const target = e.target as HTMLElement;
      if (target && target.closest('.overflow-y-auto, textarea, input, button')) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(deltaY) < 45) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 650) return;

      const currentIndex = SECTIONS.indexOf(activeSection);
      if (deltaY > 0) {
        // Swipe Up -> Next Section
        const nextIndex = (currentIndex + 1) % SECTIONS.length;
        lastScrollTime.current = now;
        soundFX.playWarp();
        onNavigate(SECTIONS[nextIndex]);
      } else {
        // Swipe Down -> Previous Section
        const prevIndex = (currentIndex - 1 + SECTIONS.length) % SECTIONS.length;
        lastScrollTime.current = now;
        soundFX.playWarp();
        onNavigate(SECTIONS[prevIndex]);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, onNavigate]);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: theme.background }}
    >
      <Canvas
        camera={{
          position: [0, 1.4, 4.2],
          fov: 45,
          near: 0.1,
          far: 75,
        }}
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        {/* Dynamic theme non-black space background & fog */}
        <color attach="background" args={[theme.background]} />
        <fog attach="fog" args={[theme.fog, 5, isPanoramic ? 65 : 36]} />

        <Suspense fallback={null}>
          {/* Lighting Rig */}
          <Lighting />

          {/* Smooth 3D Camera Travel & Mouse Parallax */}
          <CameraController activeSection={activeSection} isPanoramic={isPanoramic} />

          {/* Environmental Particles & Atmosphere */}
          <Particles />
          <FloatingCodeSymbols />
          <AbstractGeometries />

          {/* Main 3D Developer Workspace (HOME) */}
          <Workspace />

          {/* 3D Developer Laboratory Sector (ABOUT) */}
          <DeveloperLab />

          {/* 3D Technology Universe Sector (SKILLS) */}
          <SkillsUniverse />

          {/* 3D Career Timeline Tunnel Sector (EXPERIENCE) */}
          <ExperienceTimeline activeSection={activeSection} />

          {/* 3D Healthcare Project Centerpiece: eAshaOP (PROJECTS) */}
          <HealthcareProjectScene activeSection={activeSection} />

          {/* 3D Communication Room Sector (CONTACT) */}
          <ContactRoom3D
            onRevealWorld={() => setIsPanoramic(!isPanoramic)}
            isPanoramic={isPanoramic}
          />

          {/* Panoramic Cosmic World Reveal (THANK YOU FOR VISITING) */}
          <PanoramicReveal3D
            isPanoramic={isPanoramic}
            onNavigate={onNavigate}
            onClosePanorama={() => setIsPanoramic(false)}
          />

          {/* Hero Hologram inside 3D space */}
          <HeroContent
            visible={activeSection === 'home'}
            onNavigate={onNavigate}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
