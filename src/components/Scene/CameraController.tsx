import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SectionId } from '../../types/portfolio';
import { CAMERA_WAYPOINTS } from '../../data/portfolio';

interface CameraControllerProps {
  activeSection: SectionId;
  isPanoramic?: boolean;
}

export function CameraController({ activeSection, isPanoramic = false }: CameraControllerProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.4, 0));
  const targetPos = useRef(new THREE.Vector3(...CAMERA_WAYPOINTS.home.position));

  useFrame((state, delta) => {
    const waypoint = CAMERA_WAYPOINTS[activeSection] || CAMERA_WAYPOINTS.home;
    const aspect = state.viewport.aspect;

    // Responsive device classification
    const isMobilePortrait = aspect < 0.9;
    const isTablet = aspect >= 0.9 && aspect < 1.35;

    // Responsive camera pull-back offset to preserve full 3D visibility on narrow viewports
    let mobileZOffset = 0;
    let mobileYOffset = 0;

    if (isMobilePortrait) {
      if (activeSection === 'home') {
        mobileZOffset = 1.1;
        mobileYOffset = 0.2;
      } else if (activeSection === 'about') {
        mobileZOffset = 1.6;
        mobileYOffset = 0.3;
      } else if (activeSection === 'skills') {
        mobileZOffset = 2.0;
        mobileYOffset = 0.2;
      } else if (activeSection === 'experience') {
        mobileZOffset = 1.2;
        mobileYOffset = 0.3;
      } else if (activeSection === 'projects') {
        mobileZOffset = 2.2;
        mobileYOffset = 0.4;
      } else if (activeSection === 'contact') {
        mobileZOffset = 1.8;
        mobileYOffset = 0.2;
      }
    } else if (isTablet) {
      mobileZOffset = 0.7;
      mobileYOffset = 0.1;
    }

    // In panoramic reveal mode, pull camera high and backward to reveal entire universe
    if (isPanoramic) {
      targetPos.current.set(0, isMobilePortrait ? 19.0 : 16.5, isMobilePortrait ? 27.0 : 23.5);
      targetLookAt.current.set(0, 2.0, 1.5);
    } else {
      // Base position from section waypoint + responsive offsets
      targetPos.current.set(
        waypoint.position[0],
        waypoint.position[1] + mobileYOffset,
        waypoint.position[2] + mobileZOffset
      );
      targetLookAt.current.set(...waypoint.target);
    }

    // Responsive parallax intensity (subtle on mobile touch, rich on desktop mouse)
    const parallaxFactorX = isMobilePortrait ? 0.08 : activeSection === 'home' ? 0.45 : 0.25;
    const parallaxFactorY = isMobilePortrait ? 0.05 : activeSection === 'home' ? 0.3 : 0.18;

    targetPos.current.x += state.pointer.x * parallaxFactorX;
    targetPos.current.y += state.pointer.y * parallaxFactorY;

    // Smooth lerp with delta-clamped speed for steady 60 FPS transition
    const lerpSpeed = Math.min(delta * 2.8, 0.12);
    camera.position.lerp(targetPos.current, lerpSpeed);

    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
