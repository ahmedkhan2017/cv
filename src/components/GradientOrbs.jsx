import { useEffect, useRef, useState } from 'react';

/**
 * Floating parallax gradient orbs that drift slowly in the background.
 */
export default function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      <div
        className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[120px] animate-float-slow"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }}
      />
      <div
        className="absolute top-[50%] right-[10%] w-[350px] h-[350px] rounded-full opacity-15 blur-[100px] animate-float-slow"
        style={{ background: 'radial-gradient(circle, #22D3EE, transparent 70%)', animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-[20%] left-[30%] w-[300px] h-[300px] rounded-full opacity-10 blur-[100px] animate-float-slow"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)', animationDelay: '4s' }}
      />
    </div>
  );
}
