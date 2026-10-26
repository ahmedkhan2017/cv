import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Star, Github, ExternalLink, FolderGit2 } from 'lucide-react';
import { projects, projectFilters, links } from '@/data.js';
import { useInView } from '@/hooks/useScroll.js';

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [stars, setStars] = useState(project.stars);
  const Icon = LucideIcons[project.icon] || FolderGit2;

  // 3D tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setSpotlight({ x: x * 100, y: y * 100 });

      const rotX = (y - 0.5) * -10;
      const rotY = (x - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    };
    const handleLeave = () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      setSpotlight({ x: 50, y: 50 });
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // Fetch GitHub stars if it's a real repo
  useEffect(() => {
    if (!project.github || project.github === '#') return;
    const match = project.github.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) return;

    fetch(`https://api.github.com/repos/${match[1]}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, [project.github]);

  const handleCardClick = () => {
    if (project.linksToStop) {
      document.getElementById(project.linksToStop)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group"
    >
      <div
        ref={cardRef}
        className="relative glass rounded-2xl p-6 h-full transition-transform duration-200 ease-out overflow-hidden interactive"
        data-cursor="View"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cursor spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(34,211,238,0.12), transparent 50%)`,
          }}
        />

        {/* Gradient border sweep on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-accent-blue/40 via-accent-cyan/30 to-accent-purple/40" style={{
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon + stars */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
              <Icon size={22} className="text-ink-950" />
            </div>
            {stars !== null && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span>{stars}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-display font-bold text-slate-100 mb-2 group-hover:text-accent-cyan transition-colors">
            {project.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-cyan/80">
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Language */}
          {project.language && (
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
              <span className="font-mono">{project.language}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive"
                data-cursor="GitHub"
              >
                <Github size={14} /> Code
              </a>
            )}
            {project.demo && project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive"
                data-cursor="Demo"
              >
                <ExternalLink size={14} /> Demo
              </a>
            )}
            {project.linksToStop && (
              <button
                onClick={handleCardClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive ml-auto"
                data-cursor="Story"
              >
                Story →
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <section id="projects" className="relative py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-4"
          >
            <FolderGit2 size={14} className="text-accent-cyan" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Side Quests</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold"
          >
            <span className="text-gradient">Projects</span>
          </motion.h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {projectFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-body transition-all interactive ${
                filter === f
                  ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-ink-950 font-medium'
                  : 'glass text-slate-400 hover:text-slate-200'
              }`}
              data-cursor="Filter"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* More on GitHub */}
        <div className="text-center mt-12">
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-sm font-body text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive"
            data-cursor="GitHub"
          >
            <Github size={18} /> More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
