import { BadgeCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { ButtonLink } from './ui/Button';

const heroSlides = [
  '/images/hero/shenzhen-china.jpg',
  '/images/hero/ningbo-china.jpg',
  '/images/hero/guangzhou-china.jpg',
  '/images/hero/shanghai-china.jpg',
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: number | undefined;

    const stopSlideshow = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const startSlideshow = () => {
      stopSlideshow();

      if (reducedMotion.matches || document.visibilityState !== 'visible') return;

      timer = window.setInterval(() => {
        setActiveSlide((current) => (current + 1) % heroSlides.length);
      }, 6500);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startSlideshow();
      } else {
        stopSlideshow();
      }
    };

    startSlideshow();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', startSlideshow);

    return () => {
      stopSlideshow();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', startSlideshow);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const updateParallax = () => {
      frame = 0;

      if (reducedMotion.matches) {
        hero.style.setProperty('--hero-parallax-y', '0px');
        return;
      }

      const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
      const travel = Math.min(hero.offsetHeight * 0.18, 180);
      hero.style.setProperty('--hero-parallax-y', `${Math.round(progress * travel)}px`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    reducedMotion.addEventListener('change', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      reducedMotion.removeEventListener('change', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero relative h-screen min-h-[620px] overflow-hidden bg-[#b8ccc3]"
    >
      <div className="hero-parallax-media" aria-hidden="true">
        {heroSlides.map((src, index) => (
          <img
            key={src}
            className={`hero-parallax-image${index === activeSlide ? ' is-active' : ''}`}
            src={src}
            alt=""
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            draggable="false"
          />
        ))}
      </div>
      <div className="hero-photo-scrim absolute inset-0" aria-hidden="true" />
      <div className="hero-customs-pattern" aria-hidden="true" />
      <div className="page-wrap relative z-10 flex h-full items-center">
        <Header />
        <div className="max-w-[940px]">
          <div className="hero-customs-badge mb-6">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#085041] text-[#9fe1cb]"
              aria-hidden="true"
            >
              <BadgeCheck size={19} strokeWidth={2.4} />
            </span>
            <span>
              <span className="technical-label block text-[#085041]/55">Підтверджена послуга</span>
              <span className="block text-xs font-bold text-[#085041] sm:text-sm">
                Митне оформлення власними фахівцями
              </span>
            </span>
          </div>
          <h1 className="text-[42px] leading-[0.98] font-extrabold tracking-[-0.055em] sm:text-6xl lg:text-[64px]">
            Митне оформлення
            <br />
            вантажів з Китаю та Європи
          </h1>
          <p className="text-portway-ink-2 mt-7 max-w-[620px] text-base leading-7 sm:text-lg">
            Митне оформлення вантажу виконують власні фахівці Митних систем — від подання
            декларації до випуску. Додатково організовуємо супутню логістику: від порту прибуття
            до вивантаження на вашому складі.
          </p>
          <ButtonLink href="#calc" className="mt-9">
            Розрахувати митні платежі
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
