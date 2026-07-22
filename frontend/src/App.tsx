import { useEffect, useState } from 'react';
import { Calculator } from './components/Calculator';
import { ContactModal } from './components/ContactModal';
import { CoverageMap } from './components/CoverageMap';
import { Faq } from './components/Faq';
import { FloatingContactButton } from './components/FloatingContactButton';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { PortVideo } from './components/PortVideo';
import { Process } from './components/Process';
import { Services } from './components/Services';
import { useReveal } from './hooks/useReveal';

export function App() {
  const [contactOpen, setContactOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', hash);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const openContact = () => setContactOpen(true);

  return (
    <>
      <Hero onContact={openContact} />
      <main>
        <Intro />
        <Services onContact={openContact} />
        <Process />
        <PortVideo />
        <Calculator onContact={openContact} />
        <CoverageMap onContact={openContact} />
        <Faq />
      </main>
      <Footer onContact={openContact} />
      <FloatingContactButton onClick={openContact} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
