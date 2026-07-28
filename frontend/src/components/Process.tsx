import { Anchor, ArrowDown, ClipboardCheck, Globe2, Truck, Warehouse } from 'lucide-react';
import type { ReactNode } from 'react';
import { CountryFlag } from './ui/CountryFlag';
import { useTranslation } from '../i18n';

type RouteStep = {
  icon: typeof Globe2;
  title: ReactNode;
  titleKey: string;
  description: string;
  role: string;
  tone: keyof typeof toneClasses;
};

function getRouteSteps(t: (ukrainian: string, english: string) => string): RouteStep[] {
  return [
  {
    icon: Globe2,
    title: (
      <>
        <span>{t('Китай', 'China')} </span>
        <CountryFlag code="cn" /> <span>{t('і Європа', 'and Europe')} </span>
        <CountryFlag code="eu" />
      </>
    ),
    titleKey: 'china-europe',
    description: t('Відправлення вантажу', 'Cargo departure'),
    role: t('Етап маршруту', 'Route stage'),
    tone: 'neutral',
  },
  {
    icon: Anchor,
    title: (
      <>
        <span>{t('Порт Гданськ', 'Port of Gdańsk')} </span>
        <CountryFlag code="pl" /> <span>{t('/ Констанца', '/ Constanța')} </span>
        <CountryFlag code="ro" />
      </>
    ),
    titleKey: 'ports',
    description: t('Координуємо прибуття', 'Arrival coordination'),
    role: t('Координуємо', 'We coordinate'),
    tone: 'coral',
  },
  {
    icon: ClipboardCheck,
    title: t('Митне оформлення', 'Customs clearance'),
    titleKey: 'clearance',
    description: t('Виконують фахівці ClearGateCustoms', 'Handled by ClearGateCustoms specialists'),
    role: t('Оформлюємо самі', 'Handled in-house'),
    tone: 'teal',
  },
  {
    icon: Truck,
    title: t('Доставка вантажу', 'Cargo delivery'),
    titleKey: 'delivery',
    description: t('Організовуємо перевезення', 'We arrange transportation'),
    role: t('Координуємо', 'We coordinate'),
    tone: 'coral',
  },
  {
    icon: Warehouse,
    title: t('Склад клієнта', 'Client warehouse'),
    titleKey: 'warehouse',
    description: t('Вивантаження', 'Unloading'),
    role: t('Кінцева точка', 'Final destination'),
    tone: 'neutral',
  },
  ];
}

const toneClasses = {
  neutral: {
    card: 'border-white/15 bg-[#444441] text-white',
    icon: 'bg-white/10 text-white',
    role: '!border-white/70 !bg-[#e5e8e6] !text-[#303330]',
    description: 'text-white/80',
  },
  coral: {
    card: 'border-[#e76f46] bg-[#712b13] text-[#ffe2d8]',
    icon: 'bg-[#faece7]/15 text-[#ffe2d8]',
    role: '!border-[#ffe2d8]/80 !bg-[#f7d8cc] !text-[#64220d]',
    description: 'text-[#f8cbbb]',
  },
  teal: {
    card: 'border-[#28b58a] bg-[#085041] text-[#c5f3e3] shadow-[0_18px_44px_rgba(29,158,117,0.2)]',
    icon: 'border border-[#c5f3e3]/20 bg-[#063f34] text-[#c5f3e3]',
    role: '!border-[#d7f7ec] !bg-[#c5f3e3] !text-[#06473a]',
    description: 'text-[#afe8d5]',
  },
} as const;

export function Process() {
  const { t } = useTranslation();
  const routeSteps = getRouteSteps(t);
  return (
    <section id="how" className="bg-primary scroll-mt-10 py-20 text-white md:py-24">
      <div className="page-wrap grid items-stretch gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="flex min-h-0 flex-col" data-reveal>
          <span className="section-tag section-tag-dark self-start">
            <span className="section-index">07 /</span>&nbsp; {t('Маршрут', 'Route')}
          </span>
          <h2 className="section-title mt-4 text-white">{t('Як це працює', 'How it works')}</h2>
          <p className="mt-4 max-w-lg text-base leading-6 text-white/60 sm:text-lg sm:leading-7">
            {t('Від порту відправлення до складу клієнта: одразу видно, де ми виконуємо митне оформлення самі, а де координуємо логістику.', 'From the departure port to the client’s warehouse: clearly see where we handle customs clearance ourselves and where we coordinate logistics.')}
          </p>
          <div className="relative mt-10 h-[320px] overflow-hidden rounded-[18px] lg:h-auto lg:min-h-[560px] lg:flex-1">
            <img
              src="/images/port-terminal-process.jpg"
              alt={t('Контейнерне судно під портовим краном', 'Container vessel beneath a port crane')}
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
          <ol className="mx-auto max-w-xl" aria-label={t('Маршрут вантажу', 'Cargo route')}>
            {routeSteps.map((step, index) => {
              const Icon = step.icon;
              const colors = toneClasses[step.tone];
              const isPrimary = step.tone === 'teal';

              return (
                <li key={step.titleKey} className="relative">
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
                          className="font-accent text-2xl leading-none font-semibold tracking-[0.06em] opacity-70"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`badge badge-xs ${colors.role}`}>{step.role}</span>
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
                          <p
                            className={`mt-1 text-base leading-6 sm:text-lg sm:leading-7 ${colors.description}`}
                          >
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
            aria-label={t('Легенда кольорів', 'Colour legend')}
          >
            <div className="flex items-start gap-3 text-xs leading-5 text-white/65">
              <span
                className="mt-1 size-3 shrink-0 rounded-[3px] bg-[#1d9e75]"
                aria-hidden="true"
              />
              <span>
                <strong className="font-semibold text-white/90">{t('Виконує ClearGateCustoms', 'Handled by ClearGateCustoms')}</strong>
                <br />
                {t('митне оформлення', 'customs clearance')}
              </span>
            </div>
            <div className="flex items-start gap-3 text-xs leading-5 text-white/65">
              <span
                className="mt-1 size-3 shrink-0 rounded-[3px] bg-[#d85a30]"
                aria-hidden="true"
              />
              <span>
                <strong className="font-semibold text-white/90">{t('Координує ClearGateCustoms', 'Coordinated by ClearGateCustoms')}</strong>
                <br />
                {t('логістика', 'logistics')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
