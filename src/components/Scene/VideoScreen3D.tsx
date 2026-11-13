import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { MonitorDisplay } from './MonitorDisplay';

export function VideoScreen3D() {
  const {
    monitorMode,
    videoSource,
    videoPlaying,
    videoMuted,
    setVideoMuted,
  } = useTheme();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Setup HTML5 Video Element & VideoTexture
  useEffect(() => {
    if (!videoSource) return;

    setVideoError(false);
    setIsLoaded(false);

    const video = document.createElement('video');
    if (videoSource.startsWith('http://') || videoSource.startsWith('https://')) {
      if (!videoSource.includes(window.location.host)) {
        video.crossOrigin = 'anonymous';
      }
    }
    video.src = videoSource;
    video.loop = true;
    video.muted = videoMuted;
    video.defaultMuted = videoMuted;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.autoplay = true;

    const startPlayback = () => {
      setIsLoaded(true);
      setVideoError(false);
      if (videoPlaying) {
        video.play().catch(() => {
          // Autoplay policy fallback: mute and retry
          video.muted = true;
          setVideoMuted(true);
          video.play().catch((err) => {
            console.warn('Video autoplay prevented:', err);
          });
        });
      }
    };

    video.addEventListener('canplay', startPlayback);
    video.addEventListener('loadeddata', startPlayback);

    video.addEventListener('error', (e) => {
      console.warn('3D Video Screen error for source:', videoSource, e);
      setVideoError(true);
      setIsLoaded(false);
    });

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    videoRef.current = video;
    setVideoTexture(texture);

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      texture.dispose();
    };
  }, [videoSource]);

  // Sync play/pause
  useEffect(() => {
    if (videoRef.current && isLoaded) {
      if (videoPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoPlaying, isLoaded]);

  // Sync mute/unmute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = videoMuted;
    }
  }, [videoMuted]);

  // If user selected terminal mode, show code terminal
  if (monitorMode === 'terminal') {
    return <MonitorDisplay />;
  }

  return (
    <group position={[0, 0.96, -0.48]} rotation={[-0.05, 0, 0]}>
      {/* Curved Screen Glass Backing */}
      <mesh>
        <planeGeometry args={[1.9, 1.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Video Texture Surface */}
      {videoTexture && isLoaded && !videoError ? (
        <mesh>
          <planeGeometry args={[1.88, 1.03]} />
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      ) : (
        /* Video Feed Standby / Instructions Canvas when video is pending */
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('hidden-video-input')?.click();
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <planeGeometry args={[1.88, 1.03]} />
          <meshStandardMaterial
            color="#071933"
            emissive="#00f0ff"
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
      )}

      {/* Screen Frame Border Neon Accent */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.92, 1.07]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
