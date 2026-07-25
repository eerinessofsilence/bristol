import { BadgeCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { Button, ButtonLink } from './ui/Button';

const heroSlides = [
  '/images/hero/shenzhen-china.jpg',
  '/images/hero/ningbo-china.jpg',
  '/images/hero/guangzhou-china.jpg',
  '/images/hero/shanghai-china.jpg',
];

const heroHighlights = [
  'Розрахунок вартості онлайн',
  'Особистий менеджер',
  'Повний супровід',
  'Імпорт • Експорт',
];

type Props = {
  onRequestConsultation: () => void;
};

export function Hero({ onRequestConsultation }: Props) {
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
    let pointerX = 0;
    let pointerY = 0;

    const resetMotion = () => {
      hero.style.setProperty('--hero-parallax-y', '0px');
      hero.style.setProperty('--hero-parallax-scale', '1');
      hero.style.setProperty('--hero-media-x', '0px');
      hero.style.setProperty('--hero-media-y', '0px');
      hero.style.setProperty('--hero-grid-x', '0px');
      hero.style.setProperty('--hero-grid-y', '0px');
      hero.style.setProperty('--hero-glow-x', '0px');
      hero.style.setProperty('--hero-glow-y', '0px');
    };

    const updateMotion = () => {
      frame = 0;

      if (reducedMotion.matches) {
        resetMotion();
        return;
      }

      const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
      const travel = Math.min(hero.offsetHeight * 0.18, 180);
      hero.style.setProperty('--hero-parallax-y', `${Math.round(progress * travel)}px`);
      hero.style.setProperty('--hero-parallax-scale', `${1.015 + progress * 0.035}`);
      hero.style.setProperty('--hero-media-x', `${Math.round(pointerX * 8)}px`);
      hero.style.setProperty('--hero-media-y', `${Math.round(pointerY * 7)}px`);
      hero.style.setProperty('--hero-grid-x', `${Math.round(pointerX * 15)}px`);
      hero.style.setProperty(
        '--hero-grid-y',
        `${Math.round(progress * travel * 1.35 + pointerY * 13)}px`,
      );
      hero.style.setProperty('--hero-glow-x', `${Math.round(pointerX * -18)}px`);
      hero.style.setProperty(
        '--hero-glow-y',
        `${Math.round(progress * travel * -0.2 + pointerY * -10)}px`,
      );
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMotion);
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      pointerX = Math.min(Math.max(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1), 1);
      pointerY = Math.min(Math.max(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1), 1);
      requestUpdate();
    };

    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      requestUpdate();
    };

    updateMotion();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    reducedMotion.addEventListener('change', requestUpdate);
    hero.addEventListener('pointermove', updatePointer, { passive: true });
    hero.addEventListener('pointerleave', resetPointer);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      reducedMotion.removeEventListener('change', requestUpdate);
      hero.removeEventListener('pointermove', updatePointer);
      hero.removeEventListener('pointerleave', resetPointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="hero relative min-h-[max(43rem,100svh)] overflow-hidden bg-[#b8ccc3] md:h-screen md:min-h-[620px]"
    >
      <div className="hero-parallax-media" aria-hidden="true">
        {heroSlides.map((src, index) => (
          <img
            key={src}
            className={`hero-parallax-image${index === activeSlide ? 'is-active' : ''}`}
            src={src}
            alt=""
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            draggable="false"
          />
        ))}
      </div>
      <div className="hero-photo-scrim absolute inset-0" aria-hidden="true" />
      <div className="hero-parallax-glow" aria-hidden="true" />
      <div className="hero-customs-pattern" aria-hidden="true" />
      <div className="page-wrap relative z-10 flex min-h-[max(43rem,100svh)] items-center py-28 md:h-full md:min-h-0 md:py-0">
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
          <h1 className="max-w-[17ch] text-[clamp(2.05rem,9.2vw,3rem)] leading-[0.98] font-extrabold tracking-[-0.05em] sm:max-w-[18ch] sm:text-5xl lg:max-w-none lg:text-[52px]">
            Митне оформлення вантажів, експертний супровід та сучасні AI-рішення
          </h1>
          <p className="text-ink mt-6 max-w-[620px] text-[15px] leading-6 text-pretty sm:mt-7 sm:text-lg sm:leading-7">
            Відкриваємо бізнесу шлях до митного оформлення без зайвих перешкод. Митне оформлення
            виконують власні фахівці ClearGateCustoms — просто, прозоро і передбачувано.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {heroHighlights.map((label) => (
              <span key={label} className="glass-tag">
                {label}
              </span>
            ))}
          </div>
          <p className="text-ink-2 mt-8 text-sm font-semibold sm:text-base">
            Готові оформити вантаж без зайвих турбот?
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
            <ButtonLink href="#calc">Розрахувати вартість</ButtonLink>
            <Button type="button" variant="outline" onClick={onRequestConsultation}>
              Отримати консультацію
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
