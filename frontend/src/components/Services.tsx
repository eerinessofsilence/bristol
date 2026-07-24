import { Calculator, Handshake } from 'lucide-react';
import { services } from '../data/content';
import { ButtonLink } from './ui/Button';

export function Services() {
  return (
    <>
      <section id="services" className="bg-portway-soft scroll-mt-10 py-20 md:py-24">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="section-tag">Повний цикл</span>
            <h2 className="section-title mt-4">Що ми робимо</h2>
            <p className="text-portway-ink-2 mt-4 text-balance">
              Спеціалізуємося на митному оформленні вантажів з Китаю та Європи й супроводжуємо їх до
              складу клієнта.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {services.map(({ icon: Icon, title, description, primary }) => (
              <article
                key={title}
                className={`rounded-xl bg-white p-5 ${primary ? 'border-2 border-[#1d9e75]' : 'border border-[#d3d1c7]/70'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`grid size-10 place-items-center rounded-[10px] ${primary ? 'bg-[#e1f5ee] text-[#085041]' : 'bg-[#faece7] text-[#712b13]'}`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  {primary && (
                    <span className="rounded-full bg-[#9fe1cb] px-2 py-1 text-[10px] font-bold tracking-wide text-[#085041] uppercase">
                      Основна послуга
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-base font-bold tracking-tight">{title}</h3>
                <p className="text-portway-ink-3 mt-2 text-sm leading-6">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="page-wrap grid gap-5 lg:grid-cols-3" data-reveal>
          <article className="bg-portway-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
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
          <article className="bg-portway-mint-soft flex min-h-64 flex-col rounded-[18px] p-6">
            <div className="flex flex-1 flex-col justify-center pb-5">
              <strong className="text-3xl leading-none font-extrabold tracking-tight">
                Без передоплати
              </strong>
              <p className="mt-2 font-semibold">за послуги Митних систем</p>
              <p className="text-portway-ink-3 mt-2 text-sm leading-5">
                Розрахунок проводиться після митного випуску вантажу. Після оформлення передаємо
                митну декларацію.
              </p>
            </div>
            <span
              className="bg-portway-ink-3/25 h-0.5 w-full shrink-0 rounded-full"
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col items-end justify-center pt-5 text-right">
              <strong className="text-3xl leading-none font-extrabold tracking-tight">
                Вся Україна
              </strong>
              <p className="mt-2 font-semibold">доставка до адреси</p>
              <p className="text-portway-ink-3 mt-2 text-sm leading-5">
                Організовуємо перевезення до вашого складу або безпосередньо до клієнта.
              </p>
            </div>
          </article>
          <article className="bg-portway-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
            <div className="grid size-16 place-items-center rounded-2xl bg-white/10">
              <Calculator size={30} strokeWidth={2.4} />
            </div>
            <div className="mt-auto pt-7">
              <h3 className="text-xl font-bold">Оцініть митні платежі</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Вкажіть категорію товару, митну вартість і валюту — калькулятор орієнтовно розрахує
                мито, ПДВ та загальну суму платежів.
              </p>
              <ButtonLink href="#calc" variant="outline" className="mt-6 w-full">
                Розрахувати платежі
              </ButtonLink>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
