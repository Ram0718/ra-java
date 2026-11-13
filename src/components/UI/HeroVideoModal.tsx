import { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Upload, Film } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export function HeroVideoModal() {
  const { heroVideoOpen, setHeroVideoOpen, videoSource, setVideoSource } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!heroVideoOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    soundFX.playClick();
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    soundFX.playClick();
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    soundFX.playClick();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFX.playClick();
      setHasError(false);
      const url = URL.createObjectURL(file);
      setVideoSource(url);
      setIsPlaying(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      soundFX.playClick();
      setHasError(false);
      const url = URL.createObjectURL(file);
      setVideoSource(url);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Semi-transparent backdrop blur */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md -z-10"
        onClick={() => {
          soundFX.playClick();
          setHeroVideoOpen(false);
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
        onChange={handleVideoFile}
      />

      <div className="relative w-full max-w-4xl cyber-glass p-4 md:p-6 rounded-3xl border border-cyan-500/50 shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-4 font-mono">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/25 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider text-sm flex items-center gap-2">
                <span>HERO SHOWCASE VIDEO</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-[10px] text-slate-400">RAMBABU // JAVA DEVELOPER PORTFOLIO SHOWCASE</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>CHOOSE VIDEO FILE</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setHeroVideoOpen(false);
              }}
              className="p-1.5 rounded-xl cyber-glass hover:border-red-400 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Close video theater"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container with Drag & Drop */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative aspect-video rounded-2xl overflow-hidden bg-black/90 border border-cyan-500/30 shadow-2xl flex items-center justify-center group"
        >
          {hasError ? (
            <div className="text-center p-6 space-y-3">
              <Film className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
              <div className="text-white font-bold text-sm">VIDEO STANDBY</div>
              <p className="text-slate-400 text-xs max-w-sm">
                Drop your developer showcase video file here or click below to select from your computer.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>SELECT VIDEO FILE</span>
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoSource || '/hero-video.mp4'}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              onLoadedData={() => {
                setHasError(false);
                if (videoRef.current) {
                  videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
                    // Browser policy: retry muted
                    if (videoRef.current) {
                      videoRef.current.muted = true;
                      setIsMuted(true);
                      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  });
                }
              }}
            />
          )}

          {/* Center Play Overlay when Paused */}
          {!isPlaying && !hasError && (
            <button
              onClick={togglePlay}
              className="absolute p-4 rounded-full bg-cyan-500/30 border border-cyan-400 text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 fill-white ml-0.5" />
            </button>
          )}

          {/* Bottom Floating Control Bar */}
          {!hasError && (
            <div className="absolute bottom-3 left-4 right-4 p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="p-1 hover:text-cyan-400 cursor-pointer">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button onClick={toggleMute} className="p-1 hover:text-cyan-400 cursor-pointer">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] text-cyan-300">
                  {videoSource && videoSource.startsWith('blob:') ? 'CUSTOM_UPLOAD.MP4' : 'RAMBABU_SHOWCASE.MP4'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={toggleFullscreen} className="p-1 hover:text-cyan-400 cursor-pointer">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Placement Guide Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
          <span>Permanent File Location: <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">public/hero-video.mp4</code> or <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">public/video.mp4</code></span>
          <span className="text-emerald-400 font-bold">1080P HD / 60 FPS READY</span>
        </div>
      </div>
    </div>
  );
}
