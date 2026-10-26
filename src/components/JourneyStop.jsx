import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, Rocket, Building2, BookOpen } from 'lucide-react';
import { StopVisualCard } from './StopVisualCards.jsx';
import { useInView } from '@/hooks/useScroll.js';

const TYPE_ICONS = {
  education: GraduationCap,
  internship: Building2,
  project: BookOpen,
  work: Briefcase,
  milestone: Rocket,
};

const TYPE_COLORS = {
  education: 'from-accent-blue to-accent-cyan',
  internship: 'from-amber-400 to-accent-blue',
  project: 'from-accent-purple to-accent-blue',
  work: 'from-accent-cyan to-emerald-400',
  milestone: 'from-accent-blue to-accent-purple',
};

export default function JourneyStop({ stop, index, onContactClick }) {
  const [ref, inView] = useInView({ threshold: 0.2, rootMargin: '-10% 0px -10% 0px' });
  const isLeft = index % 2 === 0;
  const Icon = TYPE_ICONS[stop.type] || Code2;
  const isEmotional = stop.visual === 'urdu';

  return (
    <div
      ref={ref}
      id={stop.id}
      className={`relative flex items-center min-h-[60vh] py-16 ${
        isEmotional ? 'min-h-[80vh]' : ''
      }`}
    >
      {/* Content — alternating sides, but stacked on mobile */}
      <div className={`w-full grid md:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'md:[direction:rtl]'}`}>
        {/* Narrative side */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`[direction:ltr] ${isLeft ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'}`}
        >
          {/* Date badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4 ${isLeft ? 'md:ml-auto' : ''}`}>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${TYPE_COLORS[stop.type]}`} />
            <span className="text-xs font-mono text-slate-300">{stop.date}</span>
          </div>

          {/* Type icon + title */}
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TYPE_COLORS[stop.type]} flex items-center justify-center shrink-0`}>
              <Icon size={20} className="text-ink-950" />
            </div>
            <h3 className={`text-2xl sm:text-3xl font-display font-bold ${isEmotional ? 'text-3xl sm:text-4xl lg:text-5xl text-gradient-animated' : 'text-slate-100'}`}>
              {stop.title}
            </h3>
          </div>

          {/* Narrative hook */}
          <p className={`text-base sm:text-lg ${isEmotional ? 'text-xl sm:text-2xl text-slate-200' : 'text-slate-400'} font-body leading-relaxed mb-4 ${isEmotional ? 'italic' : ''}`}>
            "{stop.hook}"
          </p>

          {/* Details bullets */}
          {stop.details?.bullets && (
            <ul className={`space-y-2 text-sm text-slate-400 font-body ${isLeft ? 'md:ml-auto' : ''} max-w-md`}>
              {stop.details.bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className={`flex gap-2 ${isLeft ? 'md:flex-row-reverse md:text-right' : ''}`}
                >
                  <span className="text-accent-cyan shrink-0 mt-1">▹</span>
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Visual card side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="[direction:ltr]"
        >
          <StopVisualCard stop={stop} onContactClick={onContactClick} />
        </motion.div>
      </div>
    </div>
  );
}
