import { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, Volume2, VolumeX, Upload, Tv, Code2 } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface VideoControlsModalProps {
  visible: boolean;
}

export function VideoControlsModal({ visible }: VideoControlsModalProps) {
  const {
    monitorMode,
    setMonitorMode,
    setVideoSource,
    videoPlaying,
    setVideoPlaying,
    videoMuted,
    setVideoMuted,
  } = useTheme();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!visible) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFX.playClick();
      const url = URL.createObjectURL(file);
      setVideoSource(url);
      setMonitorMode('video');
      setVideoPlaying(true);
    }
  };

  return (
    <div className="fixed top-20 left-4 md:left-8 z-30 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Hidden File Input for video selection */}
      <input
        ref={fileInputRef}
        id="hidden-video-input"
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="cyber-glass p-3 rounded-2xl border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] font-mono text-xs max-w-xs space-y-2.5">
        {/* Header with Mode Toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D MONITOR FEED</span>
          </div>

          {/* Toggle between Video and Terminal */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900/90 border border-slate-700">
            <button
              onClick={() => {
                soundFX.playClick();
                setMonitorMode('video');
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                monitorMode === 'video'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VIDEO
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setMonitorMode('terminal');
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-all flex items-center gap-1 ${
                monitorMode === 'terminal'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3" />
              CODE
            </button>
          </div>
        </div>

        {/* Video Controls (Active when in Video mode) */}
        {monitorMode === 'video' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Play / Pause Toggle */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  setVideoPlaying(!videoPlaying);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 transition-all font-bold text-[10px] cursor-pointer"
              >
                {videoPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-cyan-400" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>PLAY</span>
                  </>
                )}
              </button>

              {/* Mute / Unmute Toggle */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  setVideoMuted(!videoMuted);
                }}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                title={videoMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {videoMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </div>

            {/* Select/Upload Video File Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                fileInputRef.current?.click();
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-gradient-to-r from-sky-900/70 to-indigo-900/70 hover:from-sky-800 hover:to-indigo-800 border border-sky-400/50 text-white font-bold text-[10px] tracking-wide transition-all shadow-[0_0_12px_rgba(56,189,248,0.25)] cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              <span>CHOOSE YOUR VIDEO FILE</span>
            </button>

            <p className="text-[9px] text-slate-400 leading-tight text-center">
              Place permanent video at: <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">public/video.mp4</code>
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Displaying live Spring Boot 3.2 backend microservices runtime simulation on the ultrawide monitor.
          </p>
        )}
      </div>
    </div>
  );
}
