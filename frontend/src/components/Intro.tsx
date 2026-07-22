export function Intro() {
  return (
    <section className="py-20 md:py-24">
      <div className="page-wrap grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div className="lg:sticky lg:top-36" data-reveal>
          <h2 className="section-title max-w-xl">Оформлення й доставка — один партнер.</h2>
          <p className="text-portway-ink-2 mt-7 max-w-xl leading-7">
            Portway — приватна компанія з митного брокериджу та транспортного експедирування. Ми
            ведемо документацію, сплату митних платежів, портову обробку, зберігання та внутрішнє
            перевезення — щоб ваш вантаж рухався від судна до полиці швидко й у межах закону.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Прозорий вантаж', 'Швидка доставка', 'Робота по всій країні'].map((tag) => (
              <span key={tag} className="glass-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="h-[420px] overflow-hidden rounded-[18px] sm:h-[560px] lg:h-[720px]"
          data-reveal
        >
          <img
            src="/images/port-terminal-wide.jpg"
            alt="Контейнерне судно біля терміналу морського порту"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
