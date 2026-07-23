import { Quote } from 'lucide-react';
import { testimonials } from '../data/content';

const cardStyles = [
  'bg-portway-primary text-white lg:col-span-7',
  'bg-portway-mint-soft text-portway-ink lg:col-span-5',
  'border-portway-line bg-white text-portway-ink border lg:col-span-5',
  'bg-portway-soft text-portway-ink lg:col-span-7',
];

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center" data-reveal>
          <span className="section-tag">Відгуки</span>
          <h2 className="section-title mt-4">Спокійніше, коли весь маршрут під контролем</h2>
          <p className="text-portway-ink-2 mt-5 max-w-2xl leading-7 text-balance">
            Клієнти цінують передбачувані строки, зрозумілу комунікацію та одного координатора від
            порту до складу.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12" data-reveal>
          {testimonials.map((testimonial, index) => {
            const isDark = index === 0;

            return (
              <blockquote
                key={testimonial.author}
                className={`${cardStyles[index]} flex min-h-72 flex-col rounded-3xl p-7 md:p-9`}
              >
                <div
                  className={`grid size-12 place-items-center rounded-2xl ${
                    isDark ? 'text-portway-mint bg-white/10' : 'bg-portway-primary text-white'
                  }`}
                  aria-hidden="true"
                >
                  <Quote size={23} strokeWidth={2.2} />
                </div>

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
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        isDark
                          ? 'border-white/15 bg-white/[0.08] text-white/80'
                          : 'border-portway-primary/10 text-portway-ink-2 bg-white/70'
                      }`}
                    >
                      {outcome}
                    </li>
                  ))}
                </ul>

                <footer className="mt-auto flex items-center gap-2.5 pt-8">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className={`size-10 shrink-0 rounded-full object-cover ${isDark ? 'ring-2 ring-portway-mint/70' : 'ring-2 ring-portway-primary/10'}`}
                  />
                  <span className="min-w-0">
                    <cite className="block text-sm font-bold not-italic">{testimonial.author}</cite>
                    <span
                      className={`mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-5 ${isDark ? 'text-white/70' : 'text-portway-ink-3'}`}
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
      </div>
    </section>
  );
}
