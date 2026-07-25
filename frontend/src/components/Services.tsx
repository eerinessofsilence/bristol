import { Award, Calculator, Handshake, Zap } from 'lucide-react';
import { services } from '../data/content';
import { ButtonLink } from './ui/Button';

const serviceMarkers = ['УКТ ЗЕД · ДЕКЛАРАЦІЯ', 'КООРДИНАЦІЯ', 'ПОРТИ ЄС', 'ДОСТАВКА'] as const;

export function Services() {
  return (
    <>
      <section id="services" className="customs-surface bg-soft scroll-mt-10 py-20 md:py-24">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="section-tag">
              <span className="section-index">01 /</span>&nbsp; Послуги
            </span>
            <h2 className="section-title mt-4">Що ми робимо</h2>
            <p className="text-ink-2 mt-4 text-balance">
              Спеціалізуємося на митному оформленні вантажів з Китаю та Європи й супроводжуємо їх до
              складу клієнта.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {services.map(({ icon: Icon, title, description, primary }, index) => (
              <article
                key={title}
                className={`customs-service-card rounded-xl bg-white p-5 ${
                  primary
                    ? 'border-2 border-[#1d9e75] sm:col-span-2 sm:p-7 lg:col-span-3'
                    : 'border border-[#d3d1c7]/70'
                }`}
              >
                {primary && (
                  <span className="absolute -top-3.5 right-4 rounded-full border border-[#1d9e75]/20 bg-[#9fe1cb] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#085041] uppercase shadow-[0_6px_16px_rgba(29,158,117,0.16)]">
                    Основна послуга
                  </span>
                )}
                <p className="technical-label mb-4 text-[#085041]/55">
                  {String(index + 1).padStart(2, '0')} / {serviceMarkers[index]}
                </p>
                <div
                  className={
                    primary
                      ? 'sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-6'
                      : ''
                  }
                >
                  <div
                    className={`grid size-10 place-items-center rounded-[10px] ${primary ? 'bg-[#e1f5ee] text-[#085041]' : 'bg-[#faece7] text-[#712b13]'}`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3
                      className={`text-base font-bold tracking-tight ${primary ? 'mt-5 sm:mt-0 sm:text-xl' : 'mt-5'}`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-ink-3 mt-2 text-sm leading-6 ${primary ? 'max-w-3xl' : ''}`}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="section-tag">
              <span className="section-index">02 /</span>&nbsp; Переваги
            </span>
            <h2 className="section-title mt-4">Контроль на кожному етапі</h2>
            <p className="text-ink-2 mt-4 text-balance">
              Координуємо перевезення, оформлюємо вантажі та допомагаємо заздалегідь оцінити митні
              платежі.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-reveal>
            <article className="bg-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
              <div className="grid size-16 place-items-center rounded-2xl bg-white/10">
                <Handshake size={30} strokeWidth={2.4} />
              </div>
              <div className="mt-auto pt-7">
                <h3 className="text-xl font-bold">Відповідальний супровід</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Один менеджер координує експедиторів, лінійних агентів, портові служби та
                  перевізника.
                </p>
                <ButtonLink href="#calc" variant="outline" className="mt-6 w-full">
                  Перейти до розрахунку
                </ButtonLink>
              </div>
            </article>
            <article className="bg-mint-soft flex min-h-64 flex-col rounded-[18px] p-6 md:order-first md:col-span-2 lg:order-none lg:col-span-1">
              <div className="flex flex-1 flex-col justify-center pb-5">
                <strong className="text-3xl leading-none font-extrabold tracking-tight">
                  Без передоплати
                </strong>
                <p className="mt-2 font-semibold">за послуги ClearGateCustoms</p>
                <p className="text-ink-3 mt-2 text-sm leading-5">
                  Розрахунок проводиться після митного випуску вантажу. Після оформлення передаємо
                  митну декларацію.
                </p>
              </div>
              <span className="bg-ink-3/25 h-0.5 w-full shrink-0 rounded-full" aria-hidden="true" />
              <div className="flex flex-1 flex-col items-end justify-center pt-5 text-right">
                <strong className="text-3xl leading-none font-extrabold tracking-tight">
                  Вся Україна
                </strong>
                <p className="mt-2 font-semibold">доставка до адреси</p>
                <p className="text-ink-3 mt-2 text-sm leading-5">
                  Організовуємо перевезення до вашого складу або безпосередньо до клієнта.
                </p>
              </div>
            </article>
            <article className="bg-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
              <div className="grid size-16 place-items-center rounded-2xl bg-white/10">
                <Calculator size={30} strokeWidth={2.4} />
              </div>
              <div className="mt-auto pt-7">
                <h3 className="text-xl font-bold">Оцініть митні платежі</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Вкажіть категорію товару, митну вартість і валюту — калькулятор орієнтовно
                  розрахує мито, ПДВ та загальну суму платежів.
                </p>
                <ButtonLink href="#calc" variant="outline" className="mt-6 w-full">
                  Розрахувати платежі
                </ButtonLink>
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2" data-reveal>
            <article className="bg-soft flex flex-col gap-4 rounded-3xl p-7 md:p-9">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#e1f5ee] text-[#085041]">
                <Award size={26} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Високий професіоналізм</h3>
                <p className="text-ink-3 mt-3 text-sm leading-6">
                  Наші фахівці мають багатий досвід роботи в митній сфері, що дозволяє впевнено та
                  оперативно вирішувати будь-які проблеми і перешкоди, які виникають у процесі
                  оформлення.
                </p>
              </div>
            </article>
            <article className="bg-soft flex flex-col gap-4 rounded-3xl p-7 md:p-9">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#faece7] text-[#712b13]">
                <Zap size={26} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Швидке реагування</h3>
                <p className="text-ink-3 mt-3 text-sm leading-6">
                  Гарантуємо оперативність — розуміємо, наскільки важлива швидкість для вашого
                  бізнесу. Налагоджена комунікація з митними органами дозволяє мінімізувати
                  затримки.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
