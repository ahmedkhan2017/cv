import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Wrench, Award, Globe, Languages } from 'lucide-react';
import { skillGroups, marqueeSkills, certifications, languages } from '@/data.js';
import { useInView } from '@/hooks/useScroll.js';

// ─── Infinite Marquee ───────────────────────────────────────────────────────
function SkillMarquee() {
  const [speed, setSpeed] = useState(30);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let lastTime = 0;
    const handler = (e) => {
      const now = performance.now();
      if (now - lastTime < 50) return;
      lastTime = now;

      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      const newSpeed = Math.max(8, Math.min(60, 30 - Math.abs(delta) * 2));
      setSpeed(newSpeed);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="relative overflow-hidden py-6 mask-fade">
      <style>{`
        .mask-fade {
          mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
      <div
        className="flex gap-6 whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
          <span
            key={i}
            className="text-lg sm:text-2xl font-display font-bold text-slate-700 hover:text-accent-cyan transition-colors cursor-default px-3"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Skill Card with 3D tilt + progress ring ────────────────────────────────
function SkillCard({ group, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const Icon = LucideIcons[group.icon] || Wrench;

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(hover: none)').matches) return;
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setSpotlight({ x: x * 100, y: y * 100 });
      card.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -8}deg) rotateY(${(x - 0.5) * 8}deg)`;
    };
    const handleLeave = () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      setSpotlight({ x: 50, y: 50 });
    };
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        className="relative glass rounded-2xl p-6 h-full transition-transform duration-200 ease-out overflow-hidden glow-border"
      >
        {/* Spotlight */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(59,130,246,0.1), transparent 50%)` }}
        />

        <div className="relative z-10">
          {/* Category header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
              <Icon size={18} className="text-ink-950" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-100">{group.category}</h3>
          </div>

          {/* Skills with progress bars */}
          <div className="space-y-3">
            {group.skills.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-300 font-body">{skill.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-ink-950/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                    style={{ boxShadow: '0 0 8px rgba(34,211,238,0.4)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Language Bar ────────────────────────────────────────────────────────────
function LanguageBar({ lang }) {
  const [ref, inView] = useInView();

  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-body text-slate-200 flex items-center gap-2">
          <Globe size={14} className="text-accent-cyan" />
          {lang.name}
          {lang.growing && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono">
              learning
            </span>
          )}
        </span>
        <span className="text-xs font-mono text-accent-cyan">{lang.level}</span>
      </div>
      <div className="h-2 bg-ink-950/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${lang.proficiency}%` } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
          style={{ boxShadow: '0 0 8px rgba(34,211,238,0.4)' }}
        />
      </div>
    </div>
  );
}

export default function Toolbox() {
  return (
    <section id="toolbox" className="relative py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4"
          >
            <Wrench size={14} className="text-accent-cyan" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Toolbox</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold"
          >
            Skills & <span className="text-gradient">Tools</span>
          </motion.h2>
        </div>

        {/* Marquee */}
        <div className="mb-16 -mx-6">
          <SkillMarquee />
        </div>

        {/* Skill cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skillGroups.map((group, i) => (
            <SkillCard key={group.category} group={group} index={i} />
          ))}
        </div>

        {/* Certifications + Languages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Award size={18} className="text-accent-purple" />
              <h3 className="text-lg font-display font-bold text-slate-100">Certifications</h3>
            </div>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0">
                    <Award size={16} className="text-accent-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-body text-slate-200">{cert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cert.issuer} · {cert.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Languages size={18} className="text-accent-cyan" />
              <h3 className="text-lg font-display font-bold text-slate-100">Languages</h3>
            </div>
            <div className="glass rounded-xl p-6 space-y-5">
              {languages.map((lang) => (
                <LanguageBar key={lang.name} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
