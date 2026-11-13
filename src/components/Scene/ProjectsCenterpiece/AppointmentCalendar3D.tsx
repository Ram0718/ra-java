import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Calendar, Clock, Lock } from 'lucide-react';
import { soundFX } from '../../../utils/soundEffects';

interface SlotData {
  time: string;
  doctor: string;
  dept: string;
  status: 'BOOKED' | 'AVAILABLE' | 'RESERVED';
}

export function AppointmentCalendar3D() {
  const [slots, setSlots] = useState<SlotData[]>([
    { time: '09:00 AM', doctor: 'Dr. Sharma', dept: 'Cardiology', status: 'BOOKED' },
    { time: '10:30 AM', doctor: 'Dr. Patel', dept: 'Orthopedic', status: 'AVAILABLE' },
    { time: '02:00 PM', doctor: 'Dr. Gupta', dept: 'General Medicine', status: 'AVAILABLE' },
  ]);

  const toggleSlot = (index: number) => {
    soundFX.playClick();
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== index) return slot;
        if (slot.status === 'AVAILABLE') {
          soundFX.playWarp();
          return { ...slot, status: 'RESERVED' };
        }
        if (slot.status === 'RESERVED') {
          return { ...slot, status: 'AVAILABLE' };
        }
        return slot;
      })
    );
  };

  return (
    <group position={[-2.4, 2.0, 9.4]} rotation={[0, 0.28, 0]}>
      {/* 3D Glass Platter Backing */}
      <mesh>
        <boxGeometry args={[2.4, 2.5, 0.04]} />
        <meshStandardMaterial color="#050e24" transparent opacity={0.85} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[2.42, 2.52, 0.005]} />
        <meshBasicMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* Holographic Content */}
      <Html
        transform
        distanceFactor={3.2}
        position={[0, 0, 0.04]}
        center
        className="pointer-events-auto select-none"
      >
        <div className="w-[310px] p-4 rounded-xl cyber-glass border border-cyan-400/50 font-mono text-slate-200 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                eAshaOP APPOINTMENT MATRIX
              </span>
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold">LIVE SLOTS</span>
          </div>

          <div className="text-[10px] text-slate-400 mb-2">
            Real-Time Slot Engine (ACID Row-Locking)
          </div>

          {/* Slot List */}
          <div className="space-y-2">
            {slots.map((slot, i) => {
              const isBooked = slot.status === 'BOOKED';
              const isReserved = slot.status === 'RESERVED';
              return (
                <div
                  key={slot.time}
                  onClick={() => !isBooked && toggleSlot(i)}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs ${
                    isBooked
                      ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                      : isReserved
                      ? 'bg-emerald-500/20 border-emerald-400 text-white cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-900/80 border-cyan-500/30 hover:border-cyan-400 text-slate-200 cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{slot.time}</span>
                      <span className="text-[10px] font-normal text-slate-400">({slot.doctor})</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{slot.dept}</div>
                  </div>

                  <div>
                    {isBooked ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[9px] font-bold">
                        BOOKED
                      </span>
                    ) : isReserved ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400 text-[9px] font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        RESERVED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold hover:bg-cyan-500/30">
                        AVAILABLE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[8.5px] text-slate-400 flex justify-between">
            <span>CONCURRENCY: ISOLATION_SERIALIZABLE</span>
            <span className="text-cyan-400 font-bold">CLICK TO TEST LOCK</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
