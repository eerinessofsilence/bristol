import { useEffect, useState } from 'react';
import { Calculator } from './components/Calculator';
import { ContactModal } from './components/ContactModal';
import { CoverageMap } from './components/CoverageMap';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { MissionValues } from './components/MissionValues';
import { Partners } from './components/Partners';
import { Process } from './components/Process';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { useReveal } from './hooks/useReveal';
import type { CalculatorQuote } from './types';

export function App() {
  const [contactQuote, setContactQuote] = useState<CalculatorQuote | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
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

  return (
    <>
      <Hero onRequestConsultation={() => setIsConsultationOpen(true)} />
      <main>
        <MissionValues />
        <Services onRequestConsultation={() => setIsConsultationOpen(true)} />
        <Intro />
        <Calculator onContact={setContactQuote} />
        <Process />
        <Testimonials />
        <Partners />
        <CoverageMap />
        <Faq />
      </main>
      <Footer />
      <ContactModal
        isOpen={contactQuote !== null || isConsultationOpen}
        quote={contactQuote}
        onClose={() => {
          setContactQuote(null);
          setIsConsultationOpen(false);
        }}
      />
    </>
  );
}
