import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle, AlertCircle, Loader2, Copy, Mail, Linkedin, Github, Clock, Rocket } from 'lucide-react';
import { profile, links, contactSubjects } from '@/data.js';
import { useMagnetic } from '@/hooks/useAnimations.js';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const formRef = useRef(null);
  const honeypotRef = useRef(null);
  const lastSubmitRef = useRef(0);

  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: contactSubjects[0],
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [charCount, setCharCount] = useState(0);
  const [toast, setToast] = useState(false);
  const [time, setTime] = useState('');

  const linkedinMag = useMagnetic(0.25);
  const githubMag = useMagnetic(0.25);

  // Live clock for Ilmenau
  useEffect(() => {
    const update = () => {
      const now = new Date().toLocaleTimeString('en-GB', {
        timeZone: profile.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(now);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.from_name.trim()) e.from_name = 'Name is required';
    if (!formData.from_email.trim()) {
      e.from_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      e.from_email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) {
      e.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      e.message = 'Message must be at least 10 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'message') setCharCount(value.length);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const triggerConfetti = () => {
    const colors = ['#3B82F6', '#22D3EE', '#8B5CF6', '#10B981', '#F59E0B'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check
    if (honeypotRef.current?.value) return;

    // Rate limit (60 seconds)
    const now = Date.now();
    if (now - lastSubmitRef.current < 60000) {
      setErrors({ form: 'Please wait a minute before sending another message.' });
      return;
    }

    if (!validate()) return;

    // Check EmailJS credentials
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus('error');
      setErrors({ form: 'Email service is not configured. Please use the direct email link below.' });
      return;
    }

    setStatus('loading');
    lastSubmitRef.current = Date.now();

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          subject: formData.subject,
          message: formData.message,
          to_email: links.email,
          reply_to: formData.from_email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setStatus('success');
      triggerConfetti();
      setFormData({ from_name: '', from_email: '', subject: contactSubjects[0], message: '' });
      setCharCount(0);
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      setErrors({ form: 'Something went wrong sending your message. Please try again or use the direct email link.' });
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = links.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900/30 to-ink-950 -z-10" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Giant animated headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
            <span className="text-gradient-animated">Let's build something</span>
            <br />
            <span className="text-slate-100">intelligent.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ─── Form ─────────────────────────────────────────────────────── */}
          <div className="glass-strong rounded-2xl p-6 sm:p-8 glow-border">
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Honeypot (hidden from users) */}
              <input
                ref={honeypotRef}
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="absolute opacity-0 pointer-events-none -left-[9999px]"
                aria-hidden="true"
              />

              {/* Name */}
              <FloatingInput
                label="Name"
                value={formData.from_name}
                onChange={(v) => handleChange('from_name', v)}
                error={errors.from_name}
                required
              />

              {/* Email */}
              <FloatingInput
                label="Email"
                type="email"
                value={formData.from_email}
                onChange={(v) => handleChange('from_email', v)}
                error={errors.from_email}
                required
              />

              {/* Subject dropdown */}
              <div className="relative">
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                  Subject (optional)
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full bg-ink-950/60 border border-accent-blue/15 rounded-xl px-4 py-3 text-sm text-slate-200 font-body focus:border-accent-cyan focus:outline-none transition-colors interactive"
                  data-cursor="Select"
                >
                  {contactSubjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="relative">
                <FloatingInput
                  label="Message"
                  value={formData.message}
                  onChange={(v) => handleChange('message', v)}
                  error={errors.message}
                  required
                  textarea
                  minLength={10}
                  charCount={charCount}
                />
              </div>

              {/* Form-level error */}
              {errors.form && (
                <p className="text-xs text-red-400 font-body" role="alert">{errors.form}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-body text-sm font-medium transition-all interactive ${
                  status === 'success'
                    ? 'bg-emerald-500 text-white'
                    : status === 'error'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-gradient-to-r from-accent-blue to-accent-cyan text-ink-950 shadow-lg shadow-accent-blue/30 hover:shadow-accent-cyan/50'
                }`}
                data-cursor="Send"
                aria-live="polite"
              >
                {status === 'loading' && (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle size={18} /> Sent!
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle size={18} /> Retry
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>

            {/* Success / error messages (aria-live) */}
            <div aria-live="assertive" className="mt-4">
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-300">
                      Thanks! I'll reply within 24-48 hours.
                    </p>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle size={18} className="text-red-400 shrink-0" />
                    <p className="text-sm text-red-300">
                      Couldn't send your message. Try again or use the direct email link.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── Sidebar: email, socials, clock ────────────────────────────── */}
          <div className="space-y-6">
            {/* Copy email */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Direct email</p>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${links.email}`}
                  className="text-sm text-slate-200 hover:text-accent-cyan transition-colors interactive break-all"
                  data-cursor="Email"
                >
                  {links.email}
                </a>
              </div>
              <button
                onClick={copyEmail}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive"
                data-cursor="Copy"
              >
                <Copy size={14} /> Copy email
              </button>
              {/* Toast */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-300"
                  >
                    <CheckCircle size={12} /> Copied to clipboard!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Social buttons */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Find me on</p>
              <div className="flex gap-3">
                <a
                  ref={linkedinMag}
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-slate-200 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive"
                  data-cursor="Open"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a
                  ref={githubMag}
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-slate-200 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive"
                  data-cursor="Open"
                >
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>

            {/* Live clock */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-accent-cyan" />
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Ilmenau local time</p>
                  <p className="text-lg font-mono text-slate-200 mt-1">{time}</p>
                </div>
              </div>
            </div>

            {/* Back to top rocket */}
            <button
              onClick={scrollTop}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass text-sm text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all interactive group"
              data-cursor="Top"
            >
              <Rocket size={18} className="group-hover:-translate-y-1 transition-transform" />
              Back to top
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 mt-20 pt-8 border-t border-accent-blue/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Muhammad Ahmed Khan</p>
          <p>Built with React, Three.js & GSAP</p>
        </div>
      </footer>
    </section>
  );
}

// ─── Floating Label Input ───────────────────────────────────────────────────
function FloatingInput({ label, value, onChange, error, type = 'text', required, textarea, minLength, charCount }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          minLength={minLength}
          rows={4}
          className={`w-full bg-ink-950/60 border rounded-xl px-4 pt-5 pb-2 text-sm text-slate-200 font-body focus:outline-none transition-all resize-none ${
            error ? 'border-red-500/50 animate-shake' : focused ? 'border-accent-cyan' : 'border-accent-blue/15'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={`w-full bg-ink-950/60 border rounded-xl px-4 pt-5 pb-2 text-sm text-slate-200 font-body focus:outline-none transition-all ${
            error ? 'border-red-500/50 animate-shake' : focused ? 'border-accent-cyan' : 'border-accent-blue/15'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      )}

      {/* Floating label */}
      <label
        htmlFor={inputId}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          active
            ? 'top-1.5 text-[10px] font-mono uppercase tracking-wider text-accent-cyan'
            : 'top-3.5 text-sm text-slate-500'
        }`}
      >
        {label}{required && <span className="text-red-400"> *</span>}
      </label>

      {/* Char counter (textarea only) */}
      {textarea && charCount !== undefined && (
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-600">
          {charCount} chars
        </div>
      )}

      {/* Error / success indicator */}
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
          <AlertCircle size={12} /> {error}
        </p>
      ) : active && !textarea ? (
        <CheckCircle size={14} className="absolute right-3 top-3.5 text-emerald-400" />
      ) : null}
    </div>
  );
}
