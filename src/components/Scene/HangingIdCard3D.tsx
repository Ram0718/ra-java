import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { soundFX } from '../../utils/soundEffects';

export function HangingIdCard3D() {
  const { profilePhoto, setBadgeModalOpen } = useTheme();

  const cardGroupRef = useRef<THREE.Group>(null);
  const strapMeshRef = useRef<THREE.Mesh>(null);

  // Equilibrium anchor coordinates - placed prominently beside monitor in view
  const anchorY = 2.95;
  const restX = 1.08;
  const restY = 0.95;
  const restZ = 1.65;

  // Physics state
  const pos = useRef(new THREE.Vector3(restX, restY, restZ));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const rot = useRef(new THREE.Vector3(0, 0, 0));
  const rotVel = useRef(new THREE.Vector3(0, 0, 0));
  const isDragging = useRef(false);
  const dragOffset = useRef(new THREE.Vector3(0, 0, 0));
  const dragDistance = useRef(0);

  // Dynamic photo texture
  const [photoTexture, setPhotoTexture] = useState<THREE.Texture | null>(null);

  // Procedural badge canvas texture
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw high-tech Cyber ID Badge
    const drawBadge = (img?: HTMLImageElement) => {
      // 1. Dark Sapphire Card Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0c2242');
      gradient.addColorStop(0.5, '#07162c');
      gradient.addColorStop(1, '#050f1e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid overlay
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Top Header Bar
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(0, 0, canvas.width, 42);
      ctx.fillStyle = '#050f1e';
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText('SECURITY CLEARANCE // LEVEL 4', 24, 28);

      // 3. Organization / Pass Type
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('ENTERPRISE BACKEND ARCHITECT', 24, 75);

      // 4. Portrait Photo Frame
      const photoX = 44;
      const photoY = 88;
      const photoW = 424;
      const photoH = 396;

      ctx.fillStyle = '#030812';
      ctx.fillRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8);

      // Cyber Corner Brackets on photo
      const cornerLen = 16;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(photoX - 4, photoY - 4 + cornerLen);
      ctx.lineTo(photoX - 4, photoY - 4);
      ctx.lineTo(photoX - 4 + cornerLen, photoY - 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(photoX + photoW + 4 - cornerLen, photoY - 4);
      ctx.lineTo(photoX + photoW + 4, photoY - 4);
      ctx.lineTo(photoX + photoW + 4, photoY - 4 + cornerLen);
      ctx.stroke();

      if (img && img.naturalWidth > 0) {
        // Smart cover cropping centered on developer portrait
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = photoW / photoH;
        let sW = img.naturalWidth;
        let sH = img.naturalHeight;
        let sX = 0;
        let sY = 0;

        // Focal coordinates (centered on face and posture)
        const focalX = 0.46;
        const focalY = 0.28;

        if (imgRatio > targetRatio) {
          sW = img.naturalHeight * targetRatio;
          sX = Math.max(0, Math.min(img.naturalWidth - sW, (img.naturalWidth * focalX) - (sW / 2)));
        } else {
          sH = img.naturalWidth / targetRatio;
          sY = Math.max(0, Math.min(img.naturalHeight - sH, (img.naturalHeight * focalY) - (sH / 2)));
        }

        ctx.drawImage(img, sX, sY, sW, sH, photoX, photoY, photoW, photoH);

        // Subtle holographic scanlines
        ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
        for (let y = photoY; y < photoY + photoH; y += 4) {
          ctx.fillRect(photoX, y, photoW, 2);
        }
      } else {
        // High-tech stylized developer avatar silhouette fallback
        ctx.fillStyle = '#0f274a';
        ctx.fillRect(photoX, photoY, photoW, photoH);

        // Cyber Head & Shoulders
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(photoX + photoW / 2, photoY + 140, 75, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(photoX + photoW / 2, photoY + 390, 160, Math.PI, 0, false);
        ctx.fill();

        // Neon visor glow
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(photoX + photoW / 2 - 50, photoY + 125, 100, 18);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText('RAMBABU', photoX + 150, photoY + 340);
      }

      // 5. Developer Credentials
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "JetBrains Mono", monospace';
      ctx.fillText('RAMBABU', 48, 535);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText('JAVA DEVELOPER // BACKEND', 48, 570);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillText('SPRING BOOT • REST APIs • MYSQL', 48, 600);

      // 6. Badge ID & Chips
      ctx.fillStyle = '#64748b';
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillText('EMP ID: RB-JAVA-8080', 48, 635);
      ctx.fillText('CLEARANCE: ACTIVE // 2024-2027', 48, 658);

      // Gold Holographic Microchip
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(388, 530, 70, 50);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(388, 530, 70, 50);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(408, 542, 30, 26);

      // 7. Bottom Barcode
      ctx.fillStyle = '#ffffff';
      const barcodeY = 685;
      const barcodeH = 46;
      for (let i = 48; i < 464; i += 7) {
        const barWidth = ((i % 5) === 0 || (i % 3) === 0) ? 3 : 1.5;
        ctx.fillRect(i, barcodeY, barWidth, barcodeH);
      }
    };

    const updateTexture = (imageEl?: HTMLImageElement) => {
      drawBadge(imageEl);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      setPhotoTexture(texture);
    };

    if (profilePhoto) {
      const img = new Image();
      if (profilePhoto.startsWith('http://') || profilePhoto.startsWith('https://')) {
        if (!profilePhoto.includes(window.location.host)) {
          img.crossOrigin = 'anonymous';
        }
      }
      img.src = profilePhoto;

      if (img.complete && img.naturalWidth > 0) {
        updateTexture(img);
      } else {
        img.onload = () => updateTexture(img);
        img.onerror = () => updateTexture();
      }
    } else {
      updateTexture();
    }
  }, [profilePhoto]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    dragDistance.current = 0;
    soundFX.playClick();

    // Calculate plane intersection for mouse drag
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -pos.current.z);
    const intersect = new THREE.Vector3();
    e.ray.intersectPlane(plane, intersect);
    dragOffset.current.copy(pos.current).sub(intersect);
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = 'auto';
      // Trigger swinging inertia upon release
      rotVel.current.z += (pos.current.x - restX) * 4.0;
      rotVel.current.x += (pos.current.y - restY) * 3.5;

      // Click detection: if user clicked without dragging, open badge modal
      if (dragDistance.current < 0.05) {
        setBadgeModalOpen(true);
      }
    }
  };

  // Pointer Move
  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -pos.current.z);
    const intersect = new THREE.Vector3();
    e.ray.intersectPlane(plane, intersect);

    const targetX = intersect.x + dragOffset.current.x;
    const targetY = intersect.y + dragOffset.current.y;

    // Accumulate drag movement distance
    dragDistance.current += Math.hypot(targetX - pos.current.x, targetY - pos.current.y);

    // Limit drag radius so it feels realistically tethered to the lanyard
    const dx = targetX - restX;
    const dy = targetY - restY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 1.35;

    if (dist > maxDist) {
      pos.current.x = restX + (dx / dist) * maxDist;
      pos.current.y = restY + (dy / dist) * maxDist;
    } else {
      pos.current.x = targetX;
      pos.current.y = targetY;
    }

    // Dynamic tilt while dragging
    rot.current.z = -dx * 0.8;
    rot.current.x = dy * 0.6;
  };

  // Frame Loop: Physics Pendulum & Spring Oscillation
  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    if (!isDragging.current) {
      // 1. Spring restoring force towards equilibrium
      const kX = 22.0; // horizontal spring constant
      const kY = 32.0; // vertical spring constant (swings/bounces up and down)
      const damp = 3.2; // air resistance damping

      const forceX = -kX * (pos.current.x - restX) - damp * vel.current.x;
      const forceY = -kY * (pos.current.y - restY) - damp * vel.current.y;

      vel.current.x += forceX * clampedDelta;
      vel.current.y += forceY * clampedDelta;

      pos.current.x += vel.current.x * clampedDelta;
      pos.current.y += vel.current.y * clampedDelta;

      // 2. Rotational pendulum swing physics
      const kRot = 24.0;
      const dampRot = 3.0;

      // Swing angle aligns with cord angle plus rotational momentum
      const targetRotZ = -(pos.current.x - restX) * 0.95;
      const targetRotX = (pos.current.y - restY) * 0.8;

      const torqueZ = -kRot * (rot.current.z - targetRotZ) - dampRot * rotVel.current.z;
      const torqueX = -kRot * (rot.current.x - targetRotX) - dampRot * rotVel.current.x;

      rotVel.current.z += torqueZ * clampedDelta;
      rotVel.current.x += torqueX * clampedDelta;

      rot.current.z += rotVel.current.z * clampedDelta;
      rot.current.x += rotVel.current.x * clampedDelta;

      // 3. Gentle ambient floating sway when stationary
      const t = state.clock.getElapsedTime();
      const ambientSwayX = Math.sin(t * 1.8) * 0.008;
      const ambientSwayY = Math.cos(t * 2.2) * 0.005;
      const ambientRotZ = Math.sin(t * 1.8) * 0.035;

      pos.current.x += ambientSwayX * clampedDelta * 10;
      pos.current.y += ambientSwayY * clampedDelta * 10;
      rot.current.z += ambientRotZ * clampedDelta * 6;
      rot.current.y = Math.sin(t * 1.2) * 0.05; // slight 3D axial twist
    }

    // Apply to Group Mesh
    if (cardGroupRef.current) {
      cardGroupRef.current.position.copy(pos.current);
      cardGroupRef.current.rotation.set(rot.current.x, rot.current.y, rot.current.z);
    }

    // Update dynamic 3D lanyard strap mesh geometry
    if (strapMeshRef.current) {
      const topAnchor = new THREE.Vector3(restX, anchorY, restZ);
      const clipPos = new THREE.Vector3(0, 0.46, 0);
      clipPos.applyEuler(new THREE.Euler(rot.current.x, rot.current.y, rot.current.z));
      clipPos.add(pos.current);

      const midpoint = topAnchor.clone().add(clipPos).multiplyScalar(0.5);
      const dist = topAnchor.distanceTo(clipPos);

      strapMeshRef.current.position.copy(midpoint);
      strapMeshRef.current.scale.set(1, dist, 1);
      strapMeshRef.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        topAnchor.clone().sub(clipPos).normalize()
      );
    }
  });

  // Global window pointer up listener to prevent stuck drag
  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  return (
    <group>
      {/* 1. Realistic 3D Lanyard Ribbon Strap Hanging from Ceiling */}
      <mesh ref={strapMeshRef}>
        <boxGeometry args={[0.024, 1.0, 0.004]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Ceiling Mounting Anchor Spigot */}
      <mesh position={[restX, anchorY, restZ]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 16]} />
        <meshStandardMaterial color="#0f274a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. Interactive Hanging Card Assembly */}
      <group
        ref={cardGroupRef}
        position={[restX, restY, restZ]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOver={() => {
          if (!isDragging.current) document.body.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          if (!isDragging.current) document.body.style.cursor = 'auto';
        }}
      >
        {/* Metallic Lanyard Swivel Clip & Ring */}
        <group position={[0, 0.46, 0]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.025, 0.005, 12, 24]} />
            <meshStandardMaterial color="#00f0ff" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Solid Card Backing Plate (Opaque PVC Badge) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 0.92, 0.012]} />
          <meshStandardMaterial color="#081528" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Glowing Badge Edge Wireframe */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.624, 0.924, 0.014]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.4} />
        </mesh>

        {/* ID Card Printed Front Face (with photo, name, credentials) */}
        {photoTexture && (
          <mesh position={[0, 0, 0.007]}>
            <planeGeometry args={[0.60, 0.90]} />
            <meshBasicMaterial map={photoTexture} toneMapped={false} />
          </mesh>
        )}

        {/* ID Card Back Face */}
        <mesh position={[0, 0, -0.007]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.60, 0.90]} />
          <meshStandardMaterial
            color="#061224"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}
