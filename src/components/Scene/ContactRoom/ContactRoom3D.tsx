import { CommRoomPlatform } from './CommRoomPlatform';
import { HolographicIcons3D } from './HolographicIcons3D';
import { ContactForm3D } from './ContactForm3D';
import { ContactKeyboard3D } from './ContactKeyboard3D';
import { CommParticles3D } from './CommParticles3D';

interface ContactRoom3DProps {
  onRevealWorld?: () => void;
  isPanoramic?: boolean;
}

export function ContactRoom3D({ onRevealWorld, isPanoramic }: ContactRoom3DProps) {
  return (
    <group>
      {/* 1. Base Dais, Rings, and Uplink Spire */}
      <CommRoomPlatform />

      {/* 2. Floating Holographic Email, LinkedIn, and GitHub Icons */}
      <HolographicIcons3D />

      {/* 3. Floating Holographic Message Window & Interactive Form */}
      <group position={[-7.8, 0, 8.2]}>
        <ContactForm3D onRevealWorld={onRevealWorld} isPanoramic={isPanoramic} />
        {/* 4. 3D Mechanical Cyber Keyboard */}
        <ContactKeyboard3D />
        {/* 5. Glowing Data Stream Particles */}
        <CommParticles3D />
      </group>
    </group>
  );
}
