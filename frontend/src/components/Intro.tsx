export function Intro() {
  return (
    <section className="py-20 md:py-24">
      <div className="page-wrap grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div className="lg:sticky lg:top-36" data-reveal>
          <h2 className="section-title max-w-xl">
            Митне оформлення виконуємо самі. Логістику — організовуємо під ключ.
          </h2>
          <p className="text-ink-2 mt-7 max-w-xl leading-7">
            ClearGateCustoms — митний брокер, який безпосередньо здійснює декларування та митне
            оформлення вантажів з Китаю та Європи. Паралельно, як логістичний партнер, ми
            організовуємо доставку: координуємо роботу експедиторів і лінійних агентів у портах
            Гданська та Констанци та супроводжуємо вантаж до складу клієнта в Україні.
          </p>
          <p className="text-ink-2 mt-4 max-w-xl leading-7">
            Наші цінності — законність, надійність, прозорість, технологічність, відповідальність і
            швидкість, з повагою до кожного клієнта.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              'Митне оформлення',
              'Китай і Європа',
              'Координація доставки',
              'Доставка до складу',
            ].map((tag) => (
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
            src="/images/logistics-coordination.webp"
            alt="Логістичний координатор планує маршрут контейнерного вантажу"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
