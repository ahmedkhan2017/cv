import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { pipeline } from '@/data.js';
import { useInView } from '@/hooks/useScroll.js';

function PipelineNode({ stage, index, isActive, onClick }) {
  const Icon = LucideIcons[stage.icon] || LucideIcons.Circle;
  const [ref, inView] = useInView({ threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col items-center"
    >
      {/* Node circle */}
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 cursor-pointer interactive ${
          isActive || inView
            ? 'bg-gradient-to-br from-accent-blue to-accent-cyan scale-110'
            : 'glass scale-100'
        }`}
        style={isActive || inView ? { boxShadow: '0 0 30px rgba(59,130,246,0.5)' } : {}}
        data-cursor={stage.stage}
        onClick={onClick}
      >
        <Icon
          size={28}
          className={isActive || inView ? 'text-ink-950' : 'text-slate-400'}
        />

        {/* Pulsing ring when active */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl border-2 border-accent-cyan animate-ping opacity-30" />
        )}
      </div>

      {/* Stage name */}
      <p className={`mt-3 text-sm font-display font-bold transition-colors ${
        isActive || inView ? 'text-slate-100' : 'text-slate-500'
      }`}>
        {stage.stage}
      </p>

      {/* Description */}
      <p className="mt-1 text-xs text-slate-500 text-center max-w-[180px] leading-relaxed hidden sm:block">
        {stage.description}
      </p>

      {/* Tech chips */}
      <div className="flex flex-wrap gap-1 mt-2 justify-center max-w-[180px] hidden sm:flex">
        {stage.tech.map((t, i) => (
          <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent-blue/10 text-accent-cyan/80">
            {t}
          </span>
        ))}
      </div>

      {/* Link to project */}
      {inView && stage.projectLink && (
        <button
          onClick={() => document.getElementById(stage.projectLink.stopId)?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-2 text-[10px] text-slate-500 hover:text-accent-cyan transition-colors interactive underline"
          data-cursor="View"
        >
          → {stage.projectLink.label}
        </button>
      )}
    </motion.div>
  );
}

export default function Pipeline() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress through the section
      const start = windowHeight;
      const end = -rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setLineProgress(progress);

      // Active node based on progress
      const active = Math.min(pipeline.length - 1, Math.floor(progress * pipeline.length));
      setActiveIndex(active);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section id="pipeline" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900/50 to-ink-950 -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4"
          >
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Interlude</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold"
          >
            How I Build <span className="text-gradient">AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 mt-4 max-w-lg mx-auto text-sm"
          >
            From raw data to real-world applications — each stage builds on the last. Scroll to see the pipeline light up.
          </motion.p>
        </div>

        {/* Pipeline (horizontal on desktop, vertical on mobile) */}
        <div className="relative">
          {/* Horizontal connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 -z-10">
            <div className="absolute inset-0 bg-slate-800/40" />
            <div
              className="absolute left-0 top-0 h-full transition-all duration-100"
              style={{
                width: `${lineProgress * 100}%`,
                background: 'linear-gradient(90deg, #3B82F6, #22D3EE, #8B5CF6)',
                boxShadow: '0 0 12px rgba(34,211,238,0.5)',
              }}
            />
            {/* Data packets */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-cyan"
              style={{
                left: `${lineProgress * 100}%`,
                boxShadow: '0 0 8px rgba(34,211,238,0.8)',
                transition: 'left 0.1s ease-out',
              }}
            />
          </div>

          {/* Vertical connecting line (mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-0.5 -z-10">
            <div className="absolute inset-0 bg-slate-800/40" />
            <div
              className="absolute left-0 top-0 w-full transition-all duration-100"
              style={{
                height: `${lineProgress * 100}%`,
                background: 'linear-gradient(180deg, #3B82F6, #22D3EE, #8B5CF6)',
                boxShadow: '0 0 12px rgba(34,211,238,0.5)',
              }}
            />
          </div>

          {/* Nodes */}
          <div className="flex md:flex-row flex-col items-start md:items-start gap-8 md:gap-0 md:justify-between pl-16 md:pl-0">
            {pipeline.map((stage, i) => (
              <div key={i} className="md:flex-1">
                <PipelineNode
                  stage={stage}
                  index={i}
                  isActive={i <= activeIndex}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
