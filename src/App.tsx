import { useState, useEffect } from 'react';
import { journey } from '@/data.js';
import { useSmoothScroll } from '@/hooks/useScroll.js';

import Preloader from '@/components/Preloader.jsx';
import Navbar from '@/components/Navbar.jsx';
import Hero from '@/components/Hero.jsx';
import Journey from '@/components/Journey.jsx';
import Pipeline from '@/components/Pipeline.jsx';
import Projects from '@/components/Projects.jsx';
import Toolbox from '@/components/Toolbox.jsx';
import Contact from '@/components/Contact.jsx';
import CustomCursor from '@/components/CustomCursor.jsx';
import GradientOrbs from '@/components/GradientOrbs.jsx';
import NoiseOverlay from '@/components/NoiseOverlay.jsx';
import EasterEggs from '@/components/EasterEggs.jsx';

function App() {
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useSmoothScroll();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <CustomCursor />
      <NoiseOverlay />
      <GradientOrbs />
      <EasterEggs />

      <Navbar journeyStops={journey} />

      <main className="relative">
        <Hero onContactClick={scrollToContact} reducedMotion={reducedMotion} />
        <Journey onContactClick={scrollToContact} />
        <Pipeline />
        <Projects />
        <Toolbox />
        <Contact />
      </main>
    </>
  );
}

export default App;
