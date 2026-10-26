import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a small glow dot with a trailing blob.
 * The blob expands over interactive elements and can show a label.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const blobRef = useRef(null);
  const [label, setLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    setIsVisible(true);

    let mouseX = 0, mouseY = 0;
    let blobX = 0, blobY = 0;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }

      const interactive = e.target.closest('a, button, [role="button"], .interactive, [data-cursor]');
      if (interactive) {
        const text = interactive.dataset.cursor || '';
        setLabel(text);
        if (blobRef.current) {
          blobRef.current.classList.add('cursor-expanded');
        }
      } else {
        setLabel('');
        if (blobRef.current) {
          blobRef.current.classList.remove('cursor-expanded');
        }
      }
    };

    const animateBlob = () => {
      blobX += (mouseX - blobX) * 0.15;
      blobY += (mouseY - blobY) * 0.15;
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${blobX}px, ${blobY}px)`;
      }
      raf = requestAnimationFrame(animateBlob);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animateBlob);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 8px; height: 8px;
          background: #22D3EE;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          margin: -4px 0 0 -4px;
          box-shadow: 0 0 12px rgba(34,211,238,0.8);
          transition: width 0.2s, height 0.2s;
        }
        .cursor-blob {
          position: fixed;
          top: 0; left: 0;
          width: 36px; height: 36px;
          border: 1px solid rgba(59,130,246,0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          margin: -18px 0 0 -18px;
          transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cursor-blob.cursor-expanded {
          width: 64px; height: 64px;
          margin: -32px 0 0 -32px;
          border-color: rgba(34,211,238,0.8);
          background: rgba(34,211,238,0.08);
        }
        .cursor-blob .cursor-label {
          font-size: 10px;
          font-weight: 600;
          color: #22D3EE;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={blobRef} className="cursor-blob">
        {label && <span className="cursor-label">{label}</span>}
      </div>
    </>
  );
}
