import { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (desktop / laptop mice)
    if (typeof window === 'undefined') return;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          window.getComputedStyle(target).cursor === 'pointer')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth RAF loop for ring interpolation
    let animId: number;
    const loop = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Precision Micro Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out ${
          hovered ? 'w-2 h-2 bg-cyan-300 shadow-[0_0_8px_#00f0ff]' : 'w-1.5 h-1.5 bg-cyan-400'
        }`}
      />

      {/* Trailing Precision Reticle Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
          hovered
            ? 'w-10 h-10 border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_18px_rgba(0,240,255,0.3)]'
            : clicked
            ? 'w-5 h-5 border-cyan-300 bg-cyan-400/20'
            : 'w-7 h-7 border-cyan-500/40 bg-transparent'
        }`}
      >
        {/* Subtle Crosshair Reticle Ticks when Hovering */}
        {hovered && (
          <>
            <span className="absolute top-0 w-1 h-0.5 bg-cyan-400 -translate-y-1" />
            <span className="absolute bottom-0 w-1 h-0.5 bg-cyan-400 translate-y-1" />
            <span className="absolute left-0 w-0.5 h-1 bg-cyan-400 -translate-x-1" />
            <span className="absolute right-0 w-0.5 h-1 bg-cyan-400 translate-x-1" />
          </>
        )}
      </div>
    </div>
  );
}
