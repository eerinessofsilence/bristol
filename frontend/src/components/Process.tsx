import { Check } from 'lucide-react';
import { steps } from '../data/content';
import { ButtonLink } from './ui/Button';

export function Process() {
  return (
    <section id="how" className="bg-portway-primary scroll-mt-10 py-20 text-white md:py-24">
      <div className="page-wrap grid gap-10 lg:grid-cols-2 lg:gap-14" data-reveal>
        <div className="flex min-h-0 flex-col">
          <span className="section-tag section-tag-dark self-start">Процес</span>
          <h2 className="section-title mt-4 text-white">Як це працює</h2>
          <p className="mt-4 text-base leading-7 text-white/60">
            Один менеджер координує весь процес — від першої консультації з клієнтом та протягом
            усього маршруту вантажу.
          </p>
          <div className="relative mt-10 h-[320px] overflow-hidden rounded-[18px] lg:h-auto lg:min-h-0 lg:flex-1">
            <img
              src="/images/port-terminal-process.jpg"
              alt="Контейнерне судно під портовим краном"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <ol>
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-portway-mint-muted/25 flex gap-5 border-b py-5 first:pt-0"
            >
              <span
                className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border-[3px] ${index === 0 ? 'border-portway-mint-muted bg-portway-mint text-[#08221a]' : 'border-portway-mint-muted text-portway-mint-muted'}`}
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
                  <ButtonLink
                    href="#calc"
                    variant="outline"
                    size="compact"
                    className="mt-4"
                  >
                    Отримати розрахунок
                  </ButtonLink>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
