import { useEffect, useState, useRef } from 'react';

/**
 * Terminal-style preloader with 0-100% counter and Skip button.
 * Calls onComplete when finished.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('initializing'); // initializing → loading → ready
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setProgress(100);
      setStage('ready');
      setTimeout(() => finish(), 500);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setStage('ready');
        setTimeout(() => finish(), 600);
      }
      setProgress(Math.floor(current));

      if (current < 30) setStage('initializing');
      else if (current < 90) setStage('loading');
      else setStage('ready');
    }, 80);

    timerRef.current = interval;

    return () => clearInterval(interval);
  }, []);

  const finish = () => {
    setDone(true);
    setTimeout(() => onComplete(), 800);
  };

  const skip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    setStage('ready');
    setTimeout(() => finish(), 200);
  };

  const stageText = {
    initializing: 'Initializing...',
    loading: 'Loading journey...',
    ready: 'Ready.',
  };

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink-950 transition-opacity duration-700 ${
        done ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ cursor: 'none' }}
    >
      {/* Terminal window */}
      <div className="w-[90%] max-w-lg glass-strong rounded-xl overflow-hidden font-mono">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-accent-blue/20">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
          <span className="ml-2 text-xs text-slate-400">ahmed@journey: ~</span>
        </div>

        {/* Terminal body */}
        <div className="p-6 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-accent-cyan">$</span>
            <span className="text-slate-300">boot --portfolio</span>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400">
              <span className="text-accent-blue">{stageText[stage]}</span>
            </p>
            {/* Progress bar */}
            <div className="h-2 bg-ink-800 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-2xl font-bold text-gradient font-display">{progress}%</span>
              {progress < 100 && (
                <button
                  onClick={skip}
                  className="text-xs text-slate-500 hover:text-accent-cyan transition-colors px-3 py-1 rounded border border-slate-700 hover:border-accent-cyan/50"
                  data-cursor="Skip"
                >
                  Skip ⏭
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curtain panels for split-screen reveal */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-ink-950 z-[-1] transition-transform duration-700 ease-in-out ${
          done ? '-translate-x-full' : 'translate-x-0'
        }`}
      />
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-ink-950 z-[-1] transition-transform duration-700 ease-in-out ${
          done ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
    </div>
  );
}
