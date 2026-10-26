import { useEffect, useRef, useState } from 'react';
import { journey } from '@/data.js';

/**
 * The glowing vertical path that runs down the page.
 * Draws itself as the user scrolls, with a small orb travelling along it.
 * Also reports scroll progress so the orb can be positioned.
 */
export default function JourneyPath() {
  const pathRef = useRef(null);
  const orbRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [drawProgress, setDrawProgress] = useState(0);
  const [orbPosition, setOrbPosition] = useState({ top: 0 });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const path = pathRef.current;
      if (!path) return;

      const rect = path.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Total scrollable distance for the path
      const totalScroll = rect.height + windowHeight;
      // How much has been scrolled past the top of the path
      const scrolled = windowHeight - rect.top;

      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      setDrawProgress(progress);

      // Position orb along the visible path
      const visibleHeight = Math.max(0, Math.min(rect.height, windowHeight - rect.top));
      const orbTop = Math.min(visibleHeight, rect.height * progress);
      setOrbPosition({ top: orbTop });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // Set path length after mount
    if (pathRef.current) {
      setPathLength(pathRef.current.offsetHeight);
    }

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      {/* Fixed path container — positioned relative to the journey section */}
      <div
        ref={pathRef}
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 pointer-events-none z-0"
        aria-hidden="true"
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-slate-800/30 rounded-full" />

        {/* Drawn path (gradient) */}
        <div
          className="absolute left-0 right-0 rounded-full transition-[height] duration-75 ease-out"
          style={{
            top: 0,
            height: `${drawProgress * 100}%`,
            background: 'linear-gradient(180deg, #3B82F6 0%, #22D3EE 50%, #8B5CF6 100%)',
            boxShadow: '0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(34,211,238,0.3)',
          }}
        />

        {/* Travelling orb */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full orb-pulse transition-[top] duration-100 ease-out"
          style={{
            top: orbPosition.top,
            background: 'radial-gradient(circle, #22D3EE 0%, #3B82F6 100%)',
          }}
        >
          {/* Orb glow */}
          <div
            className="absolute inset-0 rounded-full blur-md"
            style={{ background: 'rgba(34,211,238,0.5)', transform: 'scale(3)' }}
          />
        </div>

        {/* Stop markers (small dots at each stop position) */}
        {journey.map((stop, i) => {
          const stopEl = document.getElementById(stop.id);
          let offsetTop = 0;
          if (stopEl && pathRef.current) {
            const stopRect = stopEl.getBoundingClientRect();
            const pathRect = pathRef.current.getBoundingClientRect();
            offsetTop = stopRect.top - pathRect.top + stopRect.height / 2;
          }
          if (offsetTop === 0 && pathRef.current) {
            // Fallback: distribute evenly
            offsetTop = (pathRef.current.offsetHeight * (i + 0.5)) / journey.length;
          }
          const isReached = drawProgress > (i + 0.5) / journey.length;
          return (
            <div
              key={stop.id}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full transition-all duration-500"
              style={{
                top: offsetTop,
                background: isReached ? '#22D3EE' : '#1e293b',
                boxShadow: isReached ? '0 0 12px rgba(34,211,238,0.8)' : 'none',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
            />
          );
        })}
      </div>
    </>
  );
}
