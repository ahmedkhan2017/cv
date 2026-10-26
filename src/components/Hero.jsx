import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Github, Linkedin, ChevronDown, Circle } from 'lucide-react';
import { profile, links } from '@/data.js';
import { useScramble, useTypewriter, useMagnetic } from '@/hooks/useAnimations.js';

const NeuralNetworkCanvas = lazy(() => import('@/components/NeuralNetworkCanvas.jsx'));

function MagneticButton({ children, onClick, href, icon: Icon, label, primary }) {
  const magRef = useMagnetic(0.25);

  const base = `relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 group`;
  const styles = primary
    ? `bg-gradient-to-r from-accent-blue to-accent-cyan text-ink-950 shadow-lg shadow-accent-blue/30 hover:shadow-accent-cyan/50`
    : `glass text-slate-200 hover:border-accent-cyan/50 hover:text-accent-cyan`;

  const content = (
    <>
      {Icon && <Icon size={18} className="transition-transform group-hover:scale-110" />}
      <span>{label}</span>
      {children}
    </>
  );

  if (href) {
    return (
      <a
        ref={magRef}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`${base} ${styles} interactive`}
        data-cursor="Open"
      >
        {content}
      </a>
    );
  }

  return (
    <button ref={magRef} onClick={onClick} className={`${base} ${styles} interactive`} data-cursor="Go">
      {content}
    </button>
  );
}

function ScrambleName({ name }) {
  const [display, scramble] = useScramble(name, { speed: 35, duration: 1200 });

  return (
    <h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight cursor-pointer"
      onMouseEnter={() => scramble(name)}
      data-cursor="Decode"
    >
      {display.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            color: char === ' ' ? 'inherit' : undefined,
            animation: `floatSlow 4s ease-in-out infinite`,
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}

export default function Hero({ onContactClick, reducedMotion }) {
  const typewriterText = useTypewriter(profile.roles, {
    typeSpeed: 80,
    deleteSpeed: 35,
    pause: 1800,
  });

  const scrollToJourney = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-mt-24">
      {/* 3D Neural Network background */}
      <Suspense fallback={null}>
        {!reducedMotion && <NeuralNetworkCanvas reducedMotion={reducedMotion} />}
      </Suspense>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/40 to-ink-950 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20">
        {/* Open to work badge */}
        {profile.openToWork && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-xs font-body text-emerald-300 font-medium">{profile.openToWorkText}</span>
          </motion.div>
        )}

        {/* Name with scramble effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ScrambleName name={profile.name} />
        </motion.div>

        {/* Typewriter roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="h-8 mt-4 flex items-center justify-center"
        >
          <span className="font-mono text-sm sm:text-base text-accent-cyan">
            {typewriterText}
            <span className="animate-pulse">_</span>
          </span>
        </motion.div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm sm:text-base text-slate-400 mt-3 font-body"
        >
          {profile.title}
        </motion.p>

        {/* Opening line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-base sm:text-lg text-slate-300 mt-8 max-w-2xl mx-auto leading-relaxed font-body"
        >
          {profile.tagline}
        </motion.p>

        {/* Magnetic buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          <MagneticButton
            href={profile.cv}
            icon={Download}
            label="Download CV"
            primary
          />
          <MagneticButton onClick={onContactClick} icon={Mail} label="Contact" />
          <MagneticButton href={links.github} target="_blank" icon={Github} label="GitHub" />
          <MagneticButton href={links.linkedin} target="_blank" icon={Linkedin} label="LinkedIn" />
        </motion.div>
      </div>

      {/* Scroll-down indicator */}
      <motion.button
        onClick={scrollToJourney}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2.5, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-400 hover:text-accent-cyan transition-colors interactive"
        data-cursor="Scroll"
        aria-label="Scroll to journey"
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown size={20} className="animate-bounce-slow" />
      </motion.button>
    </section>
  );
}
