import { useState, useEffect } from 'react';
import type { SectionId } from '../../types/portfolio';
import { About } from '../sections/About';
import { Skills } from '../sections/Skills';
import { Experience } from '../sections/Experience';
import { Projects } from '../sections/Projects';
import { Contact } from '../sections/Contact';
import { soundFX } from '../../utils/soundEffects';
import { X, ArrowLeft, Eye, FileText, Minimize2 } from 'lucide-react';

interface SectionModalProps {
  activeSection: SectionId;
  onClose: () => void;
}

export function SectionModal({ activeSection, onClose }: SectionModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-expand data dossier whenever the user changes sections
  useEffect(() => {
    setIsMinimized(false);
  }, [activeSection]);

  // Home section renders in-scene 3D hero content
  if (activeSection === 'home') {
    return null;
  }

  // Floating Minimized HUD Pill for 3D Viewers
  if (isMinimized) {
    return (
      <div className="fixed bottom-16 right-4 md:right-8 z-40 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={() => {
            soundFX.playClick();
            setIsMinimized(false);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/90 border border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-950/80 shadow-[0_0_25px_rgba(0,240,255,0.4)] font-mono text-xs font-bold tracking-wider transition-all group cursor-pointer"
        >
          <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
          <span>OPEN {activeSection.toUpperCase()} DATA DOSSIER</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 pointer-events-auto flex items-center justify-center p-3 md:p-8 pt-20 pb-16 overflow-y-auto">
      {/* Semi-transparent Backdrop: 3D scene remains clearly visible and ambient */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[3px] -z-10 transition-opacity"
        onClick={() => {
          soundFX.playClick();
          setIsMinimized(true);
        }}
      />

      {/* Main Dossier Container */}
      <div className="relative w-full max-w-4xl my-auto animate-in fade-in zoom-in-95 duration-300">
        {/* Top Cyber Control Bar */}
        <div className="flex items-center justify-between mb-3 px-1 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                soundFX.playWarp();
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl cyber-glass hover:border-cyan-400 text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN HOME</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setIsMinimized(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cyber-glass hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Minimize data panel to inspect the 3D environment"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">INSPECT 3D SCENE</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-cyan-400/70 uppercase">
              SECTOR: {activeSection} // DOSSIER ACTIVE
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                setIsMinimized(true);
              }}
              title="Minimize data view"
              className="p-1.5 rounded-xl cyber-glass hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              title="Close dossier"
              className="p-1.5 rounded-xl cyber-glass hover:border-red-400 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Section Data Content */}
        <div className="max-h-[76vh] overflow-y-auto pr-1 rounded-2xl shadow-2xl">
          {activeSection === 'about' && <About />}
          {activeSection === 'skills' && <Skills />}
          {activeSection === 'experience' && <Experience />}
          {activeSection === 'projects' && <Projects />}
          {activeSection === 'contact' && <Contact />}
        </div>
      </div>
    </div>
  );
}
