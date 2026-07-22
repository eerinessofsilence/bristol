import { useState } from 'react';
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
