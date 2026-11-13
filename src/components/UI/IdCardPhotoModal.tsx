import { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Camera, Upload, Eye, X, Shield, Cpu } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import { DEVELOPER_PROFILE } from '../../data/portfolio';

interface IdCardPhotoModalProps {
  visible: boolean;
}

export function IdCardPhotoModal({ visible }: IdCardPhotoModalProps) {
  const { setProfilePhoto, profilePhoto, badgeModalOpen, setBadgeModalOpen } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFX.playClick();
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* Floating Bottom HUD Pill */}
      {visible && (
        <div className="fixed bottom-14 left-4 md:left-8 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="cyber-glass p-2.5 rounded-xl border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] font-mono text-xs flex items-center gap-3">
            {/* Live Portrait Thumbnail */}
            <div
              onClick={() => {
                soundFX.playClick();
                setBadgeModalOpen(true);
              }}
              className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer group"
              title="Click to inspect 3D ID Badge"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Rambabu"
                  className="w-full h-full object-cover object-[46%_25%] group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-cyan-950 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col">
              <span className="text-cyan-300 font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                3D ID BADGE
              </span>
              <span className="text-[10px] text-slate-400">Drag in 3D or Click to Inspect</span>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setBadgeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-white font-bold text-[10px] tracking-wide transition-all cursor-pointer"
            >
              <Eye className="w-3 h-3 text-cyan-300" />
              <span>VIEW BADGE</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-slate-300 font-bold text-[10px] tracking-wide transition-all cursor-pointer"
            >
              <Upload className="w-3 h-3 text-slate-400" />
              <span>CHANGE PHOTO</span>
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Holographic ID Badge Inspection Modal */}
      {badgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden cyber-glass border border-cyan-400 shadow-[0_0_40px_rgba(0,240,255,0.4)] font-mono">
            {/* Top Lanyard Clip Representation */}
            <div className="w-full bg-slate-900/90 py-2 px-4 flex items-center justify-between border-b border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>SECURITY CLEARANCE // LEVEL 4</span>
              </div>
              <button
                onClick={() => setBadgeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge Body */}
            <div className="p-5 space-y-4">
              {/* Photo Frame */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-cyan-400 bg-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Rambabu"
                    className="w-full h-full object-cover object-[46%_25%]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-cyan-400">
                    <Camera className="w-12 h-12 stroke-[1.5] mb-2 animate-pulse" />
                    <span className="text-xs">AVATAR ACTIVE</span>
                  </div>
                )}
                {/* Cyber Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none" />
                {/* Corner Markers */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
              </div>

              {/* Developer Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white tracking-wider">
                    {DEVELOPER_PROFILE.name.toUpperCase()}
                  </h3>
                  <div className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold">
                    VERIFIED
                  </div>
                </div>
                <div className="text-cyan-300 text-sm font-bold tracking-wide">
                  {DEVELOPER_PROFILE.role.toUpperCase()}
                </div>
                <div className="text-xs text-slate-300">
                  {DEVELOPER_PROFILE.experienceYears} Years Enterprise Experience
                </div>
              </div>

              {/* Tech Badges */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>EMP ID:</span>
                  <span className="text-white font-bold">RB-JAVA-8080</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>SPECIALIZATION:</span>
                  <span className="text-cyan-300 font-bold">Spring Boot &amp; Microservices</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>DATABASE:</span>
                  <span className="text-emerald-300 font-bold">MySQL &amp; JPA/Hibernate</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>MAIN PROJECT:</span>
                  <span className="text-purple-300 font-bold">eAshaOP Healthcare</span>
                </div>
              </div>

              {/* Bottom Microchip & Barcode */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-7 rounded border border-amber-500 bg-amber-500/30 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-[10px] text-slate-400">CHIP // RFID NFC</span>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-bold text-xs cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>CHANGE PHOTO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
