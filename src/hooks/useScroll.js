import { useEffect, useRef, useState } from 'react';

/**
 * Initialise Lenis smooth scrolling and sync it with GSAP ScrollTrigger.
 * Returns nothing — just call it once at the top level.
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf;
    let lenis;

    (async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    })();

    return () => {
      if (lenis) lenis.destroy();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return lenisRef;
}

/**
 * Track the global scroll progress (0 → 1).
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return progress;
}

/**
 * Observe when an element enters the viewport and return a ref + visibility flag.
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.once !== false) observer.unobserve(el);
        } else if (options.once === false) {
          setInView(false);
        }
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, inView];
}

/**
 * Count-up animation triggered when an element is in view.
 */
export function useCountUp(target, { duration = 2000, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return [ref, decimals > 0 ? value.toFixed(decimals) : Math.round(value)];
}

/**
 * Detect whether the user is scrolling down or up.
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState('up');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setDirection(y > lastY ? 'down' : 'up');
      lastY = y;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return { direction, scrolled };
}
