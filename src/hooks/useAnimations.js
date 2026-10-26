import { useEffect, useRef, useState } from 'react';

/**
 * Scramble / Matrix-decode effect for text.
 * Returns the current display text and a function to trigger the effect.
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

export function useScramble(text, { speed = 40, duration = 800 } = {}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(null);

  const scramble = (targetText = text) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(targetText);
      return;
    }
    const startTime = performance.now();
    const steps = Math.floor(duration / speed);

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealed = Math.floor(progress * targetText.length);

      let result = '';
      for (let i = 0; i < targetText.length; i++) {
        if (i < revealed || targetText[i] === ' ') {
          result += targetText[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(targetText);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [display, scramble];
}

/**
 * Typewriter cycling effect — cycles through an array of strings.
 */
export function useTypewriter(words, { typeSpeed = 80, deleteSpeed = 40, pause = 1500 } = {}) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setText(words[0]);
      return;
    }

    const currentWord = words[wordIndex];
    let timeout;

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => {
          if (isDeleting) {
            return currentWord.substring(0, prev.length - 1);
          }
          return currentWord.substring(0, prev.length + 1);
        });
      }, isDeleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return text;
}

/**
 * Magnetic button effect — element follows the cursor slightly when hovering.
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const handleLeave = () => {
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return ref;
}
