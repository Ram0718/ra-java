import { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEVELOPER_PROFILE } from '../../../data/portfolio';

interface ContactForm3DProps {
  onRevealWorld?: () => void;
  isPanoramic?: boolean;
}

export function ContactForm3D({ onRevealWorld, isPanoramic }: ContactForm3DProps) {
  const panelRef = useRef<THREE.Group>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Subtle floating motion
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (panelRef.current) {
      panelRef.current.position.y = 1.4 + Math.sin(t * 1.5) * 0.04;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      // Format mailto fallback so user can actually deliver their message
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.open(`mailto:${DEVELOPER_PROFILE.email}?subject=${subject}&body=${body}`);

      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setStatus('idle');
      }, 3500);
    }, 1200);
  };

  return (
    <group ref={panelRef} position={[0, 1.4, -0.2]}>
      {/* 1. 3D Glass Backing Plate */}
      <mesh receiveShadow position={[0, 0, -0.05]}>
        <boxGeometry args={[2.5, 2.2, 0.06]} />
        <meshPhysicalMaterial
          color="#060d1d"
          metalness={0.2}
          roughness={0.15}
          transmission={0.65}
          thickness={0.5}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Holographic Glowing Border Frame */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[2.54, 2.24, 0.02]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Corner Bracket Details */}
      {[-1.25, 1.25].map((x, i) =>
        [-1.1, 1.1].map((y, j) => (
          <mesh key={`${i}-${j}`} position={[x, y, 0]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={1.8}
            />
          </mesh>
        ))
      )}

      {/* 2. Interactive Holographic HTML Screen */}
      <Html
        transform
        distanceFactor={2.4}
        position={[0, 0, 0.02]}
        className="select-none pointer-events-auto"
      >
        <div className="w-[500px] p-6 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] text-white font-sans transition-all duration-300 hover:border-cyan-400">
          {/* Header Badge */}
          <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase">
                QUANTUM UPLINK // PORT 8080
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              SECURE TLS 1.3
            </div>
          </div>

          {/* Section Titles */}
          <div className="mb-4">
            <h2 className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              LET'S BUILD SOMETHING
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-light">
              Have a Java backend project or opportunity? Let's connect.
            </p>
          </div>

          {/* Contact Form */}
          {status === 'success' ? (
            <div className="py-8 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
              <div className="text-emerald-400 text-3xl font-mono">✓</div>
              <h3 className="text-lg font-bold text-emerald-300 uppercase tracking-wide">
                TRANSMISSION DISPATCHED
              </h3>
              <p className="text-xs text-slate-300 px-4">
                Thank you! Your message packet has been routed to Rambabu. Expect a swift response!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-cyan-300/80 uppercase mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white placeholder-slate-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-cyan-300/80 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-cyan-300/80 uppercase mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about your Java, Spring Boot, or full-stack initiative..."
                  className="w-full px-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none text-white placeholder-slate-500 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {status === 'sending' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ENCRYPTING & TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3D Interactive Buttons Row */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2">
            <button
              onClick={() => window.open(`mailto:${DEVELOPER_PROFILE.email}`)}
              className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950/70 border border-cyan-500/30 hover:border-cyan-400 text-[10px] font-mono text-cyan-300 tracking-wider text-center transition-all cursor-pointer"
            >
              ✉ EMAIL ME
            </button>
            <button
              onClick={() => window.open(DEVELOPER_PROFILE.linkedin, '_blank')}
              className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-blue-950/70 border border-blue-500/30 hover:border-blue-400 text-[10px] font-mono text-blue-300 tracking-wider text-center transition-all cursor-pointer"
            >
              in LINKEDIN
            </button>
            <button
              onClick={() => window.open(DEVELOPER_PROFILE.github, '_blank')}
              className="px-2 py-1.5 rounded-lg bg-slate-900/90 hover:bg-purple-950/70 border border-purple-500/30 hover:border-purple-400 text-[10px] font-mono text-purple-300 tracking-wider text-center transition-all cursor-pointer"
            >
              ⌥ GITHUB
            </button>
          </div>

          {/* Panoramic Camera World Reveal Trigger */}
          {onRevealWorld && (
            <div className="mt-3">
              <button
                onClick={onRevealWorld}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 hover:from-purple-800/60 hover:to-cyan-800/60 border border-purple-500/50 hover:border-cyan-400 text-[11px] font-mono font-semibold text-purple-200 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              >
                <span>🌌</span>
                <span>
                  {isPanoramic ? 'RETURN TO CONTACT ROOM' : 'REVEAL ENTIRE 3D WORLD (PANORAMA)'}
                </span>
                <span>➔</span>
              </button>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
