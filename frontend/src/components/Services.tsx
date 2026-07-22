import { ArrowRight, Handshake, ShieldCheck } from 'lucide-react';
import { services } from '../data/content';

type Props = {
  onContact: () => void;
};

export function Services({ onContact }: Props) {
  return (
    <>
      <section id="services" className="bg-portway-soft scroll-mt-10 py-20 md:py-24">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="section-tag">Повний цикл</span>
            <h2 className="section-title mt-4">Що ми робимо</h2>
            <p className="text-portway-ink-3 mt-4">
              Митне оформлення та експедирування для імпортерів, яким потрібні швидкість,
              відповідність закону й зрозуміла ціна.
            </p>
          </div>
          <div className="mt-14 grid gap-11 md:grid-cols-3 md:gap-8" data-reveal>
            {services.map(({ icon: Icon, title, description }) => (
              <article key={title} className="text-center">
                <div className="bg-portway-primary mx-auto mb-6 grid size-[74px] place-items-center rounded-full text-white">
                  <Icon size={29} strokeWidth={2.4} />
                </div>
                <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                <p className="text-portway-ink-3 mx-auto mt-3 max-w-sm text-sm leading-6">
                  {description}
                </p>
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
              <h3 className="text-xl font-bold">Довіра в бізнесі</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Ліцензовані митні брокери в кожному великому порту, який ми обслуговуємо.
              </p>
              <button
                type="button"
                onClick={onContact}
                className="group text-portway-ink hover:bg-portway-mint-soft mt-6 flex w-full cursor-pointer items-center justify-between rounded-full bg-white px-5 py-3 text-sm font-semibold transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(22,34,30,0.12)] active:scale-[0.985] active:shadow-none"
              >
                Обговорити поставку
                <span className="bg-portway-primary group-hover:bg-portway-mint group-hover:text-portway-primary grid size-7 place-items-center rounded-full text-white transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={2.6} />
                </span>
              </button>
            </div>
          </article>
          <article className="bg-portway-mint-soft flex min-h-64 flex-col rounded-[18px] p-6">
            <div className="flex flex-1 flex-col justify-center pb-5">
              <strong className="text-5xl leading-none font-extrabold tracking-tight">100М+</strong>
              <p className="mt-2 font-semibold">задоволених клієнтів</p>
              <p className="text-portway-ink-3 mt-2 text-sm leading-5">
                Пропонуємо сплату мита від нашого імені для перевірених клієнтів.
              </p>
            </div>
            <div className="border-portway-mint/30 flex flex-1 flex-col justify-center border-t pt-5">
              <strong className="text-5xl leading-none font-extrabold tracking-tight">95%</strong>
              <p className="mt-2 font-semibold">своєчасних оформлень</p>
              <p className="text-portway-ink-3 mt-2 text-sm leading-5">
                Контролюємо кожен етап і повідомляємо про статус без зайвих запитів.
              </p>
            </div>
          </article>
          <article className="bg-portway-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
            <div className="grid size-16 place-items-center rounded-2xl bg-white/10">
              <ShieldCheck size={30} strokeWidth={2.4} />
            </div>
            <h3 className="mt-auto text-xl leading-7 font-bold">
              Прозорі тарифи — жодних несподіваних доплат без вашої згоди.
            </h3>
            <a
              href="#calc"
              className="group text-portway-ink hover:bg-portway-mint-soft mt-6 flex items-center justify-between rounded-full bg-white px-5 py-3 text-sm font-semibold transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(22,34,30,0.12)] active:scale-[0.985] active:shadow-none"
            >
              Перевірити тарифи
              <span className="bg-portway-primary group-hover:bg-portway-mint group-hover:text-portway-primary grid size-7 place-items-center rounded-full text-white transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                <ArrowRight size={14} strokeWidth={2.6} />
              </span>
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
