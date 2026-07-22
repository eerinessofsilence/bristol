import { Check } from 'lucide-react';
import { steps } from '../data/content';

export function Process() {
  return (
    <section id="how" className="bg-portway-primary scroll-mt-10 py-20 text-white md:py-24">
      <div className="page-wrap">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="section-tag section-tag-dark">Процес</span>
            <h2 className="section-title mt-4 text-white">Як це працює</h2>
            <p className="mt-4 text-base leading-7 text-white/60">
              Від першої консультації до доставки на ваш склад — один менеджер координує документи,
              митницю, портову обробку й транспорт.
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14" data-reveal>
          <div className="h-[320px] overflow-hidden rounded-[18px] lg:h-auto lg:self-stretch">
            <img
              src="/images/port-terminal-process.jpg"
              alt="Контейнерне судно під портовим краном"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-5 border-b border-white/10 py-5 first:pt-0">
                <span
                  className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border-2 ${index === 0 ? 'border-portway-mint bg-portway-mint text-[#08221a]' : 'border-white/35 text-white/45'}`}
                >
                  <Check size={17} strokeWidth={2.8} />
                </span>
                <div>
                  <span className="text-2xl font-medium text-white/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{step.description}</p>
                  {index === 0 && (
                    <a
                      href="#calc"
                      className="text-portway-mint mt-2 inline-block text-sm font-semibold"
                    >
                      Дізнатися більше →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
