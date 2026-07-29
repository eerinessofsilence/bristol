import { Calculator, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button, ButtonLink } from './ui/Button';
import { useTranslation } from '../i18n';

const heroSlides = [
  '/images/hero/shenzhen-china.jpg',
  '/images/hero/ningbo-china.jpg',
  '/images/hero/guangzhou-china.jpg',
  '/images/hero/shanghai-china.jpg',
];

type Props = {
  onRequestConsultation: () => void;
};

export function Hero({ onRequestConsultation }: Props) {
  const { t } = useTranslation();
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

      if (
        reducedMotion.matches || document.visibilityState !== 'visible'
      ) {
        return;
      }

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
    const desktopPointer = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine)',
    );
    let frame = 0;

    const resetMotion = () => {
      hero.style.setProperty('--hero-parallax-y', '0px');
      hero.style.setProperty('--hero-grid-y', '0px');
      hero.style.setProperty('--hero-glow-y', '0px');
    };

    const updateMotion = () => {
      frame = 0;

      if (reducedMotion.matches || !desktopPointer.matches) {
        resetMotion();
        return;
      }

      const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
      const travel = Math.min(hero.offsetHeight * 0.18, 180);
      hero.style.setProperty('--hero-parallax-y', `${Math.round(progress * travel)}px`);
      hero.style.setProperty('--hero-grid-y', `${Math.round(progress * travel * 1.35)}px`);
      hero.style.setProperty('--hero-glow-y', `${Math.round(progress * travel * -0.2)}px`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMotion);
    };

    const stopParallax = () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      resetMotion();
    };

    const syncParallax = () => {
      stopParallax();
      if (reducedMotion.matches || !desktopPointer.matches) return;
      updateMotion();
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
    };

    syncParallax();
    reducedMotion.addEventListener('change', syncParallax);
    desktopPointer.addEventListener('change', syncParallax);

    return () => {
      stopParallax();
      reducedMotion.removeEventListener('change', syncParallax);
      desktopPointer.removeEventListener('change', syncParallax);
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
            className={['hero-parallax-image', index === activeSlide && 'is-active']
              .filter(Boolean)
              .join(' ')}
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
        <div className="max-w-[940px]">
          <h1 className="max-w-[17ch] text-4xl leading-[0.98] font-extrabold tracking-tighter text-balance sm:max-w-[18ch] sm:text-5xl lg:max-w-none">
            {t('Митне оформлення вантажів, експертний супровід та сучасні AI-рішення', 'Customs clearance, expert support and modern AI solutions')}
          </h1>
          <p className="text-ink mt-6 max-w-[620px] text-base leading-6 text-pretty sm:mt-7 sm:text-lg sm:leading-7">
            {t('Відкриваємо бізнесу шлях до митного оформлення без зайвих перешкод. ClearGateCustoms — просто, прозоро і передбачувано.', 'We clear the way for businesses to customs clearance without unnecessary barriers. ClearGateCustoms is simple, transparent and predictable.')}
          </p>
          <p className="text-ink mt-8 text-lg font-semibold sm:text-xl">
            {t('Готові оформити вантаж без зайвих турбот?', 'Ready to clear your cargo without the hassle?')}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
            <ButtonLink href="#calc" icon={Calculator}>
              {t('Розрахувати вартість', 'Calculate costs')}
            </ButtonLink>
            <Button type="button" icon={Phone} variant="outline" onClick={onRequestConsultation}>
              {t("Зв'язатися з нами", 'Contact us')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
