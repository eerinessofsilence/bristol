import { Anchor, ArrowDown, ClipboardCheck, Globe2, Truck, Warehouse } from 'lucide-react';

const routeSteps = [
  {
    icon: Globe2,
    title: 'Китай і Європа',
    description: 'Відправлення вантажу',
    role: 'Етап маршруту',
    tone: 'neutral',
  },
  {
    icon: Anchor,
    title: 'Порт Гданськ / Констанца',
    description: 'Координуємо прибуття',
    role: 'Координуємо',
    tone: 'coral',
  },
  {
    icon: ClipboardCheck,
    title: 'Митне оформлення',
    description: 'Виконують фахівці Митних систем',
    role: 'Виконуємо самі',
    tone: 'teal',
  },
  {
    icon: Truck,
    title: 'Доставка вантажу',
    description: 'Організовуємо перевезення',
    role: 'Координуємо',
    tone: 'coral',
  },
  {
    icon: Warehouse,
    title: 'Склад клієнта',
    description: 'Вивантаження',
    role: 'Кінцева точка',
    tone: 'neutral',
  },
] as const;

const toneClasses = {
  neutral: {
    card: 'border-white/15 bg-[#444441] text-white',
    icon: 'bg-white/10 text-white',
    role: 'bg-white/10 text-white/75',
    description: 'text-white/70',
  },
  coral: {
    card: 'border-[#d85a30] bg-[#712b13] text-[#f5c4b3]',
    icon: 'bg-[#faece7]/10 text-[#f5c4b3]',
    role: 'bg-[#faece7]/10 text-[#f5c4b3]',
    description: 'text-[#f5c4b3]/80',
  },
  teal: {
    card: 'border-[#1d9e75] bg-[#085041] text-[#9fe1cb] shadow-[0_18px_44px_rgba(29,158,117,0.2)]',
    icon: 'border border-[#9fe1cb]/15 bg-[#063f34] text-[#9fe1cb]',
    role: 'bg-[#9fe1cb] text-[#085041]',
    description: 'text-[#9fe1cb]/85',
  },
} as const;

export function Process() {
  return (
    <section id="how" className="bg-portway-primary scroll-mt-10 py-20 text-white md:py-24">
      <div className="page-wrap grid items-stretch gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="flex min-h-0 flex-col" data-reveal>
          <span className="section-tag section-tag-dark self-start">
            <span className="section-index">03 /</span>&nbsp; Маршрут
          </span>
          <h2 className="section-title mt-4 text-white">Як це працює</h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/60">
            Від порту відправлення до складу клієнта: одразу видно, де ми виконуємо митне оформлення
            самі, а де координуємо логістику.
          </p>
          <div className="relative mt-10 h-[320px] overflow-hidden rounded-[18px] lg:h-auto lg:min-h-[560px] lg:flex-1">
            <img
              src="/images/port-terminal-process.jpg"
              alt="Контейнерне судно під портовим краном"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-[#08130f]/45 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>

        <div data-reveal>
          <ol className="mx-auto max-w-xl" aria-label="Маршрут вантажу">
            {routeSteps.map((step, index) => {
              const Icon = step.icon;
              const colors = toneClasses[step.tone];
              const isPrimary = step.tone === 'teal';

              return (
                <li key={step.title} className="relative">
                  <article
                    className={`relative rounded-2xl border p-4 sm:p-5 ${
                      colors.card
                    } ${isPrimary ? 'customs-checkpoint-card sm:-mx-2 sm:px-7' : ''}`}
                  >
                    {isPrimary && (
                      <span className="customs-checkpoint-corners" aria-hidden="true" />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className="font-mono text-3xl leading-none font-semibold tracking-[0.06em] opacity-70 sm:text-[34px]"
                          aria-hidden="true"
                        >
                        {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${colors.role}`}
                        >
                          {step.role}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-4 sm:gap-5">
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-xl sm:size-12 ${colors.icon}`}
                          aria-hidden="true"
                        >
                          <Icon size={23} strokeWidth={2.2} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold tracking-tight sm:text-lg">
                            {step.title}
                          </h3>
                          <p className={`mt-1 text-sm leading-5 ${colors.description}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>

                  {index < routeSteps.length - 1 && (
                    <div
                      className="flex h-10 items-center justify-center text-white"
                      aria-hidden="true"
                    >
                      <ArrowDown size={26} strokeWidth={3.5} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <div
            className="mt-7 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2"
            aria-label="Легенда кольорів"
          >
            <div className="flex items-start gap-3 text-xs leading-5 text-white/65">
              <span
                className="mt-1 size-3 shrink-0 rounded-[3px] bg-[#1d9e75]"
                aria-hidden="true"
              />
              <span>
                <strong className="font-semibold text-white/90">Виконує “ClearGateCustoms”</strong>
                <br />
                митне оформлення
              </span>
            </div>
            <div className="flex items-start gap-3 text-xs leading-5 text-white/65">
              <span
                className="mt-1 size-3 shrink-0 rounded-[3px] bg-[#d85a30]"
                aria-hidden="true"
              />
              <span>
                <strong className="font-semibold text-white/90">Координує “ClearGateCustoms”</strong>
                <br />
                логістика
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
