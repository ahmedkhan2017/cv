import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { profile, skillGroups, projects, links, journey } from '@/data.js';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const COMMANDS = {
  help: `Available commands:
  help     — show this list
  skills   — list my skills
  projects — list my projects
  contact  — show contact info
  journey  — list career stops
  clear    — clear the terminal
  exit     — close terminal`,
  skills: skillGroups.map(g => `${g.category}: ${g.skills.map(s => s.name).join(', ')}`).join('\n'),
  projects: projects.map(p => `  ${p.title} [${p.tags.join(', ')}] — ${p.description.substring(0, 60)}...`).join('\n'),
  contact: `Email: ${links.email}
LinkedIn: ${links.linkedin}
GitHub: ${links.github}
Location: ${profile.location}`,
  journey: journey.map((s, i) => `  ${i + 1}. ${s.date} — ${s.title}`).join('\n'),
};

export default function EasterEggs() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [history, setHistory] = useState([{ type: 'output', text: 'Welcome to the secret terminal. Type "help" for commands.' }]);
  const [input, setInput] = useState('');
  const [konamiIndex, setKonamiIndex] = useState(0);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const originalTitle = useRef('');

  // ─── Tab title change on visibility ──────────────────────────────────────
  useEffect(() => {
    originalTitle.current = document.title;
    const handler = () => {
      if (document.hidden) {
        document.title = 'Come back! 👋';
      } else {
        document.title = originalTitle.current;
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // ─── Keyboard listeners: `~` for terminal + Konami code ──────────────────
  useEffect(() => {
    const handler = (e) => {
      // Terminal toggle on `~`
      if (e.key === '`' || e.key === '~') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setTerminalOpen((prev) => !prev);
        }
      }

      // Konami code
      const expected = KONAMI[konamiIndex];
      if (e.key === expected || (expected === 'b' && e.key === 'b') || (expected === 'a' && e.key === 'a')) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI.length) {
          triggerKonami();
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [konamiIndex]);

  // Focus input when terminal opens
  useEffect(() => {
    if (terminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [terminalOpen]);

  // Auto-scroll terminal output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const triggerKonami = () => {
    // Particle explosion
    const colors = ['#3B82F6', '#22D3EE', '#8B5CF6', '#F59E0B', '#10B981'];
    for (let i = 0; i < 120; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${50 + (Math.random() - 0.5) * 30}vw`;
      piece.style.top = `${50}vh`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${1 + Math.random() * 2}s`;
      piece.style.borderRadius = '50%';
      const angle = Math.random() * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      piece.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      piece.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      piece.style.animation = 'confettiBurst 2s ease-out forwards';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3000);
    }
  };

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: cmd }];

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }
    if (trimmed === 'exit') {
      setTerminalOpen(false);
      setHistory([{ type: 'output', text: 'Welcome to the secret terminal. Type "help" for commands.' }]);
      return;
    }

    const output = COMMANDS[trimmed];
    if (output) {
      newHistory.push({ type: 'output', text: output });
    } else if (trimmed) {
      newHistory.push({ type: 'output', text: `Command not found: ${trimmed}. Type "help" for available commands.` });
    }

    setHistory(newHistory);
  };

  return (
    <>
      <style>{`
        @keyframes confettiBurst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>

      {/* Hidden terminal */}
      <AnimatePresence>
        {terminalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-[500px] z-[10001] glass-strong rounded-xl overflow-hidden font-mono"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-accent-blue/20 bg-ink-950/80">
              <TerminalIcon size={14} className="text-accent-cyan" />
              <span className="text-xs text-slate-400">secret-terminal — bash</span>
              <button
                onClick={() => setTerminalOpen(false)}
                className="ml-auto text-slate-500 hover:text-red-400 transition-colors"
                aria-label="Close terminal"
              >
                <X size={14} />
              </button>
            </div>

            {/* Output */}
            <div ref={outputRef} className="p-4 h-64 overflow-y-auto text-xs space-y-2 bg-ink-950/60">
              {history.map((entry, i) => (
                <div key={i} className={entry.type === 'input' ? 'text-accent-cyan' : 'text-slate-400'}>
                  {entry.type === 'input' ? (
                    <><span className="text-accent-blue">$</span> {entry.text}</>
                  ) : (
                    <pre className="whitespace-pre-wrap">{entry.text}</pre>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-accent-blue/20 bg-ink-950/80">
              <span className="text-accent-blue text-xs">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(input);
                    setInput('');
                  }
                }}
                className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none"
                placeholder="type a command..."
                aria-label="Terminal input"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami hint (subtle) */}
      <div className="fixed bottom-2 right-2 z-50 text-[8px] font-mono text-slate-800 pointer-events-none select-none">
        press ~ for terminal
      </div>
    </>
  );
}
