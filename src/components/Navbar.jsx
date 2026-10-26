import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, Sparkles, X } from 'lucide-react';
import { profile } from '@/data.js';
import { useScrollProgress, useScrollDirection } from '@/hooks/useScroll.js';

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'journey', label: 'Journey' },
  { id: 'pipeline', label: 'How I Build' },
  { id: 'projects', label: 'Projects' },
  { id: 'toolbox', label: 'Toolbox' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ journeyStops }) {
  const progress = useScrollProgress();
  const { direction, scrolled } = useScrollDirection();
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: '-12% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  const visible = mobileOpen || !scrolled || direction === 'up';

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-ink-900/40">
        <div
          className="h-full origin-left bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple transition-transform duration-100"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-0 top-3 z-50 px-3 sm:px-5 lg:top-5"
            aria-label="Primary navigation"
          >
            <div className="mx-auto max-w-6xl">
              <div className="glass-strong flex min-h-14 items-center justify-between gap-3 rounded-2xl px-3 py-2 shadow-2xl shadow-black/20 sm:px-4">
                <button
                  onClick={() => scrollTo('hero')}
                  className="group flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 text-left interactive"
                  data-cursor="Top"
                  aria-label="Go to home"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan shadow-lg shadow-accent-blue/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                    <Sparkles size={17} className="text-ink-950" />
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block truncate font-display text-sm font-bold leading-none text-slate-100">
                      {profile.name}
                    </span>
                    <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-accent-cyan/80">
                      AI · Software
                    </span>
                  </span>
                  <span className="font-display text-sm font-bold text-slate-100 sm:hidden">MAK</span>
                </button>

                <div className="hidden items-center gap-1 lg:flex">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className={`relative rounded-xl px-3 py-2 text-xs font-medium transition-colors interactive ${
                        activeSection === link.id
                          ? 'text-accent-cyan'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                      data-cursor="Go"
                    >
                      {link.label}
                      {activeSection === link.id && (
                        <motion.span
                          layoutId="active-nav"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="hidden items-center gap-2 xl:flex">
                  {journeyStops.slice(0, 7).map((stop) => (
                    <button
                      key={stop.id}
                      onClick={() => scrollTo(stop.id)}
                      className="h-2 w-2 rounded-full bg-slate-600 transition-all hover:scale-150 hover:bg-accent-cyan interactive"
                      aria-label={`Go to ${stop.title}`}
                      data-cursor={stop.date}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setMobileOpen((open) => !open)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-blue/20 bg-ink-950/50 text-slate-200 transition-all hover:border-accent-cyan/60 hover:text-accent-cyan interactive lg:hidden"
                  aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={mobileOpen}
                  data-cursor="Menu"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileOpen ? (
                      <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <X size={19} />
                      </motion.span>
                    ) : (
                      <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Menu size={19} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <AnimatePresence>
                {mobileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 overflow-hidden rounded-2xl glass-strong shadow-2xl shadow-black/30 lg:hidden"
                  >
                    <div className="grid gap-1 p-2 sm:grid-cols-2">
                      {NAV_LINKS.map((link, index) => (
                        <button
                          key={link.id}
                          onClick={() => scrollTo(link.id)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all interactive ${
                            activeSection === link.id
                              ? 'bg-accent-blue/15 text-accent-cyan'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-slate-600">0{index + 1}</span>
                            {link.label}
                          </span>
                          <ArrowUpRight size={15} className="text-slate-600" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
