import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { testimonials } from '../data/content';

const cardStyles = [
  'bg-primary text-white lg:col-span-7',
  'bg-mint-soft text-ink lg:col-span-5',
  'border-line bg-white text-ink border lg:col-span-5',
  'bg-soft text-ink lg:col-span-7',
];

export function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const scrollToTestimonial = (index: number) => {
    const carousel = carouselRef.current;
    const card = carousel?.children[index] as HTMLElement | undefined;

    if (!carousel || !card) return;

    carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft, behavior: 'smooth' });
    setActiveTestimonial(index);
  };

  const updateActiveTestimonial = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const closestCard = Array.from(carousel.children).reduce(
      (closestIndex, card, index) =>
        Math.abs((card as HTMLElement).offsetLeft - carousel.offsetLeft - carousel.scrollLeft) <
        Math.abs(
          (carousel.children[closestIndex] as HTMLElement).offsetLeft -
            carousel.offsetLeft -
            carousel.scrollLeft,
        )
          ? index
          : closestIndex,
      0,
    );

    setActiveTestimonial(closestCard);
  };

  return (
    <section id="testimonials" className="scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center" data-reveal>
          <span className="section-tag">
            <span className="section-index">08 /</span>&nbsp; Відгуки
          </span>
          <h2 className="section-title mt-4">Спокійніше, коли весь маршрут під контролем</h2>
          <p className="text-ink-2 mt-5 max-w-2xl text-base leading-6 text-balance sm:text-lg sm:leading-7">
            Клієнти цінують передбачувані строки, зрозумілу комунікацію та одного координатора від
            порту до складу.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="mt-12 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-12 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          data-reveal
          onScroll={updateActiveTestimonial}
        >
          {testimonials.map((testimonial, index) => {
            const isDark = index === 0;

            return (
              <blockquote
                key={testimonial.author}
                className={`${cardStyles[index]} flex min-h-72 w-[calc(100%-1.5rem)] shrink-0 snap-start flex-col rounded-3xl p-7 sm:w-[calc(100%-3rem)] md:p-9 lg:w-auto lg:shrink`}
              >
                <div
                  className={`hidden size-12 place-items-center rounded-2xl md:grid ${
                    isDark ? 'text-mint bg-white/10' : 'bg-primary text-white'
                  }`}
                  aria-hidden="true"
                >
                  <Quote size={23} strokeWidth={2.2} />
                </div>

                <footer className="flex items-center gap-2.5 md:hidden">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className={`size-10 shrink-0 rounded-full object-cover ${isDark ? 'ring-mint/70 ring-2' : 'ring-primary/10 ring-2'}`}
                  />
                  <span className="min-w-0">
                    <cite className="block text-sm font-bold not-italic">{testimonial.author}</cite>
                    <span
                      className={`mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 ${isDark ? 'text-white/70' : 'text-ink-3'}`}
                    >
                      <span>{testimonial.role}</span>
                      <span aria-hidden="true">·</span>
                      <span aria-label={`Сфера: ${testimonial.sector}`}>{testimonial.sector}</span>
                    </span>
                  </span>
                </footer>

                <p
                  className={`mt-8 max-w-[46rem] text-lg leading-8 font-medium tracking-tight md:text-xl ${
                    isDark ? 'text-white/90' : ''
                  }`}
                >
                  {testimonial.quote}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ключові результати">
                  {testimonial.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className={
                        isDark
                          ? 'section-tag section-tag-dark !tracking-normal !normal-case'
                          : 'badge badge-sm border-primary/10 text-ink-2 bg-white/70'
                      }
                    >
                      {outcome}
                    </li>
                  ))}
                </ul>

                <footer className="mt-auto hidden items-center gap-2.5 pt-8 md:flex">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className={`size-10 shrink-0 rounded-full object-cover ${isDark ? 'ring-mint/70 ring-2' : 'ring-primary/10 ring-2'}`}
                  />
                  <span className="min-w-0">
                    <cite className="block text-sm font-bold not-italic">{testimonial.author}</cite>
                    <span
                      className={`mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 ${isDark ? 'text-white/70' : 'text-ink-3'}`}
                    >
                      <span>{testimonial.role}</span>
                      <span aria-hidden="true">·</span>
                      <span aria-label={`Сфера: ${testimonial.sector}`}>{testimonial.sector}</span>
                    </span>
                  </span>
                </footer>
              </blockquote>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between lg:hidden">
          <span className="text-ink-3 text-xs font-semibold tracking-[0.12em]" aria-live="polite">
            {String(activeTestimonial + 1).padStart(2, '0')} /{' '}
            {String(testimonials.length).padStart(2, '0')}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="border-line text-ink enabled:hover:bg-soft grid size-10 place-items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Попередній відгук"
              disabled={activeTestimonial === 0}
              onClick={() => scrollToTestimonial(activeTestimonial - 1)}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              className="bg-primary grid size-10 place-items-center rounded-full text-white transition-opacity enabled:hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Наступний відгук"
              disabled={activeTestimonial === testimonials.length - 1}
              onClick={() => scrollToTestimonial(activeTestimonial + 1)}
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
