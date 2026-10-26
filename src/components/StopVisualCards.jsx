import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, FileText, ExternalLink, BookOpen, Users, Video, MapPin, Calendar, HeartPulse, Database, Activity, TrendingUp } from 'lucide-react';
import { useCountUp, useInView } from '@/hooks/useScroll.js';
import { useMagnetic } from '@/hooks/useAnimations.js';

// ─── CGPA Counter Card (Stop 1) ─────────────────────────────────────────────
export function CgpaCard({ data }) {
  const [ref, inView] = useInView();
  const [countRef, cgpa] = useCountUp(3.49, { duration: 2000, decimals: 2 });
  const [certRef] = useInView();

  return (
    <div ref={ref} className={`mt-6 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
      <div className="glass rounded-2xl p-6 glow-border">
        {/* CGPA counter */}
        <div ref={countRef} className="flex items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#cgpaGrad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={inView ? { strokeDashoffset: 2 * Math.PI * 42 * (1 - 3.49 / 4.0) } : {}}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="cgpaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-bold text-gradient">{cgpa}</span>
              <span className="text-[10px] text-slate-500 font-mono">/ {data.cgpaMax}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">CGPA</p>
            <p className="text-lg font-display font-bold text-slate-100 mt-1">{data.degree}</p>
            <p className="text-sm text-slate-400 mt-1">{data.institution}</p>
          </div>
        </div>

        {/* Certification badge */}
        <div ref={certRef} className={`mt-6 flex items-center gap-3 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20 transition-all duration-700 ${certRef.current ? 'opacity-100' : 'opacity-0'}`}>
          <Award size={18} className="text-accent-purple shrink-0" />
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase">Certification</p>
            <p className="text-sm text-slate-200">{data.certification}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ABAP Code Editor Card (Stop 2) ─────────────────────────────────────────
export function AbapCodeCard({ data }) {
  const [ref, inView] = useInView();
  const [typedCode, setTypedCode] = useState('');
  const [snippetIndex, setSnippetIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTypedCode(data.codeSnippets?.[0]?.code || '');
      return;
    }

    const snippet = data.codeSnippets?.[snippetIndex] || data.codeSnippets?.[0];
    if (!snippet) return;
    setTypedCode('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= snippet.code.length) {
        setTypedCode(snippet.code.substring(0, i));
        i += 2;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setSnippetIndex((prev) => (prev + 1) % (data.codeSnippets?.length || 1));
        }, 3000);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [inView, snippetIndex, data.codeSnippets]);

  const currentSnippet = data.codeSnippets?.[snippetIndex];

  return (
    <div ref={ref} className={`mt-6 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
      <div className="glass rounded-2xl overflow-hidden glow-border font-mono text-sm">
        {/* Editor title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-accent-blue/15 bg-ink-900/50">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          <span className="ml-2 text-xs text-slate-500">
            {currentSnippet?.lang || 'ABAP'} — z_report.abap
          </span>
          <span className="ml-auto text-[10px] text-slate-600">SAP GUI</span>
        </div>

        {/* Code body */}
        <div className="p-4 min-h-[180px] bg-ink-950/60">
          <pre className="text-slate-300 whitespace-pre-wrap text-xs leading-relaxed">
            <span className="text-accent-cyan">{typedCode}</span>
            <span className="animate-pulse text-accent-blue">▋</span>
          </pre>
        </div>

        {/* Company footer */}
        <div className="px-4 py-2.5 border-t border-accent-blue/15 bg-ink-900/30 flex items-center gap-2">
          <FileText size={14} className="text-accent-blue" />
          <span className="text-xs text-slate-400">{data.company}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Urdu Paraphrasing Card (Stop 3) — emotional highlight ──────────────────
export function UrduCard({ data }) {
  const [ref, inView] = useInView();

  return (
    <div ref={ref} className={`mt-6 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-12'}`}>
      {/* Floating Urdu script characters */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {['اردو', 'نص', 'تشکیل', 'ماشین', 'زبان', 'سمجھ', 'تبدیلی'].map((word, i) => (
            <span
              key={i}
              className="absolute font-mono text-accent-purple/10 text-2xl"
              style={{
                top: `${10 + i * 12}%`,
                left: `${5 + (i % 3) * 30}%`,
                animation: `floatSlow ${8 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Main card */}
        <div className="glass-strong rounded-2xl p-8 relative z-10 border-accent-purple/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shrink-0">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-display font-bold text-slate-100">{data.projectTitle}</h4>
              <p className="text-sm text-slate-400 mt-1">{data.description}</p>
            </div>
          </div>

          {/* Meta info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-accent-cyan" />
              <span className="text-slate-500">Supervisor:</span>
              <span className="text-slate-300">{data.supervisor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-accent-cyan" />
              <span className="text-slate-500">Team:</span>
              <span className="text-slate-300">{data.team?.join(', ')}</span>
            </div>
          </div>

          {/* Publication card */}
          {data.paper && (
            <div className="p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-accent-purple" />
                <span className="text-xs font-mono text-slate-500 uppercase">Research Publication</span>
              </div>
              <p className="text-sm font-display text-slate-100 mb-3">"{data.paper.title}"</p>
              <a
                href={data.paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple/20 text-accent-purple text-xs font-medium hover:bg-accent-purple/30 transition-all interactive"
                data-cursor="Read"
              >
                Read Paper <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Demo video placeholder */}
          <a
            href={data.demoVideo}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent-cyan transition-colors interactive"
            data-cursor="Watch"
          >
            <Video size={16} /> Watch demo (placeholder)
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Phone Mockup Card (Stop 4) ──────────────────────────────────────────────
export function PhoneCard({ data }) {
  const [ref, inView] = useInView();
  const phoneRef = useRef(null);

  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone || window.matchMedia('(hover: none)').matches) return;
    const handler = (e) => {
      const rect = phone.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      phone.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
    };
    const reset = () => {
      phone.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    };
    phone.addEventListener('mousemove', handler);
    phone.addEventListener('mouseleave', reset);
    return () => {
      phone.removeEventListener('mousemove', handler);
      phone.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <div ref={ref} className={`mt-6 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
      <div className="glass rounded-2xl p-6 glow-border">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* 3D tilting phone */}
          <div className="perspective-1000 shrink-0">
            <div
              ref={phoneRef}
              className="preserve-3d transition-transform duration-200 ease-out"
              style={{ width: '140px', height: '280px' }}
            >
              <div className="w-full h-full rounded-[24px] bg-ink-950 border-2 border-slate-700 overflow-hidden shadow-2xl">
                {/* Notch */}
                <div className="h-5 bg-slate-800 flex items-center justify-center">
                  <div className="w-12 h-1 rounded-full bg-slate-600" />
                </div>
                {/* Screen content */}
                <div className="p-3 space-y-2">
                  <div className="h-6 rounded bg-gradient-to-r from-accent-blue/30 to-accent-cyan/30" />
                  <div className="h-3 rounded bg-slate-800 w-3/4" />
                  <div className="h-3 rounded bg-slate-800 w-1/2" />
                  <div className="h-20 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 mt-2" />
                  <div className="h-3 rounded bg-slate-800" />
                  <div className="h-3 rounded bg-slate-800 w-2/3" />
                  <div className="h-8 rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan mt-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Company info */}
          <div className="flex-1">
            <p className="text-lg font-display font-bold text-slate-100">{data.role}</p>
            <p className="text-sm text-slate-400 mt-1">{data.company}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
              <span className="text-xs font-mono text-accent-cyan">React Native</span>
              <span className="text-xs text-slate-500">Android App</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Window Card (Stop 5) ───────────────────────────────────────────────
export function ChatCard({ data }) {
  const [ref, inView] = useInView();
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisibleMessages(data.chatMessages?.length || 0);
      return;
    }

    const messages = data.chatMessages || [];
    let i = 0;
    const showNext = () => {
      if (i < messages.length) {
        setVisibleMessages(i + 1);
        i++;
        setTimeout(showNext, 1200);
      }
    };
    const timeout = setTimeout(showNext, 500);
    return () => clearTimeout(timeout);
  }, [inView, data.chatMessages]);

  return (
    <div ref={ref} className={`mt-6 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
      <div className="glass rounded-2xl overflow-hidden glow-border">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-accent-blue/15 bg-ink-900/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-xs font-bold text-ink-950">
            AI
          </div>
          <div>
            <p className="text-sm font-display text-slate-200">AI Training Bot</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
            </p>
          </div>
        </div>

        {/* Chat messages */}
        <div className="p-4 space-y-3 min-h-[240px] max-h-[280px] overflow-y-auto bg-ink-950/40">
          {(data.chatMessages || []).slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-ink-950 rounded-br-sm'
                    : 'glass text-slate-200 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {visibleMessages < (data.chatMessages?.length || 0) && (
            <div className="flex justify-start">
              <div className="glass px-3 py-2 rounded-xl">
                <span className="text-xs text-slate-500">typing</span>
                <span className="inline-flex gap-0.5 ml-1">
                  <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Company footer */}
        <div className="px-4 py-2.5 border-t border-accent-blue/15 bg-ink-900/30">
          <p className="text-xs text-slate-400">{data.company}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Card (Stop 6) ─────────────────────────────────────────────────
export function DashboardCard({ data }) {
  const [ref, inView] = useInView();

  return (
    <div ref={ref} className={`mt-6 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
      <div className="glass rounded-2xl p-6 glow-border">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {data.stats?.map((stat, i) => (
            <StatCounter key={i} stat={stat} inView={inView} delay={i * 150} />
          ))}
        </div>

        {/* Data flow animation */}
        <div className="relative h-16 rounded-xl bg-ink-950/60 overflow-hidden border border-accent-blue/10">
          <div className="absolute inset-0 flex items-center justify-around px-4">
            {['Pharmacy', 'Lab', 'Emergency', 'Reports'].map((dept, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                  <Activity size={14} className="text-accent-cyan" />
                </div>
                <span className="text-[8px] text-slate-500 font-mono">{dept}</span>
              </div>
            ))}
          </div>
          {/* Flowing data packets */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent">
            <div
              className="absolute top-0 w-2 h-2 rounded-full bg-accent-cyan"
              style={{ animation: 'dataFlow 3s linear infinite', boxShadow: '0 0 8px rgba(34,211,238,0.8)' }}
            />
          </div>
        </div>

        <style>{`
          @keyframes dataFlow {
            0% { left: 0; }
            100% { left: 100%; }
          }
        `}</style>

        {/* Company */}
        <div className="mt-4 flex items-center gap-2">
          <HeartPulse size={14} className="text-accent-blue" />
          <span className="text-xs text-slate-400">{data.company}</span>
        </div>
      </div>
    </div>
  );
}

function StatCounter({ stat, inView, delay }) {
  const [ref, value] = useCountUp(stat.value, { duration: 2000 });
  return (
    <div ref={ref} className="p-3 rounded-xl bg-ink-950/40 border border-accent-blue/10">
      <p className="text-2xl font-display font-bold text-gradient">
        {value}{stat.suffix}
      </p>
      <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">{stat.label}</p>
    </div>
  );
}

// ─── Campus Card (Stop 7) ────────────────────────────────────────────────────
export function CampusCard({ data, onContactClick }) {
  const [ref, inView] = useInView();
  const magRef = useMagnetic(0.2);

  return (
    <div ref={ref} className={`mt-6 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0 translate-y-12'}`}>
      <div className="glass-strong rounded-2xl p-8 glow-border relative overflow-hidden">
        {/* Parallax campus background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <div className="absolute bottom-0 left-0 right-0 h-32">
            {/* Simple forest/campus silhouette */}
            <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0,100 L0,60 L20,55 L30,40 L40,50 L60,35 L80,45 L100,30 L120,40 L140,25 L160,35 L180,20 L200,30 L220,25 L240,35 L260,20 L280,30 L300,25 L320,40 L340,35 L360,45 L380,40 L400,55 L400,100 Z" fill="#3B82F6" opacity="0.3" />
              <path d="M0,100 L0,75 L40,70 L60,60 L100,65 L140,55 L180,60 L220,50 L260,55 L300,50 L340,60 L380,55 L400,65 L400,100 Z" fill="#22D3EE" opacity="0.2" />
            </svg>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shrink-0">
              <GraduationCap size={22} className="text-ink-950" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-slate-100">{data.degree}</h4>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={12} /> {data.institution}
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Calendar size={12} /> {data.semester} · {data.location}
              </p>
            </div>
          </div>

          {/* Ending pulse */}
          <div className="mt-8 text-center py-6 border-t border-accent-blue/15">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan" />
              </span>
              <span className="text-2xl font-display font-bold text-gradient-animated">
                {data.endingText || "Next stop: your team?"}
              </span>
            </div>
            <button
              ref={magRef}
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-ink-950 font-body text-sm font-medium shadow-lg shadow-accent-blue/30 hover:shadow-accent-cyan/50 transition-all interactive"
              data-cursor="Contact"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual Card Router ──────────────────────────────────────────────────────
export function StopVisualCard({ stop, onContactClick }) {
  switch (stop.visual) {
    case 'cgpa':
      return <CgpaCard data={stop.details} />;
    case 'abap':
      return <AbapCodeCard data={stop.details} />;
    case 'urdu':
      return <UrduCard data={stop.details} />;
    case 'phone':
      return <PhoneCard data={stop.details} />;
    case 'chat':
      return <ChatCard data={stop.details} />;
    case 'dashboard':
      return <DashboardCard data={stop.details} />;
    case 'campus':
      return <CampusCard data={stop.details} onContactClick={onContactClick} />;
    default:
      return null;
  }
}
