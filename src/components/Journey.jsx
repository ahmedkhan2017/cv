import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { journey } from '@/data.js';
import JourneyPath from './JourneyPath.jsx';
import JourneyStop from './JourneyStop.jsx';

/**
 * The Journey section: a continuous vertical path with stops.
 * The glowing path draws itself as the user scrolls; an orb travels along it.
 * Each stop alternates sides and has a unique animated visual card.
 */
export default function Journey({ onContactClick }) {
  return (
    <section id="journey" className="relative py-20">
      {/* Section header */}
      <div className="text-center mb-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4"
        >
          <Map size={14} className="text-accent-cyan" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">The Journey</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-bold"
        >
          My <span className="text-gradient">Career Path</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 mt-4 max-w-xl mx-auto text-sm"
        >
          Seven stops so far — each one shaped how I build AI today. Scroll to follow the path.
        </motion.p>
      </div>

      {/* Path + stops */}
      <div className="relative max-w-6xl mx-auto px-6">
        <JourneyPath />
        <div className="relative z-10">
          {journey.map((stop, i) => (
            <JourneyStop key={stop.id} stop={stop} index={i} onContactClick={onContactClick} />
          ))}
        </div>
      </div>
    </section>
  );
}
