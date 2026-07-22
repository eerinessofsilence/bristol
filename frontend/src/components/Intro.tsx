export function Intro() {
  return (
    <section className="py-20 md:py-24">
      <div className="page-wrap grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div className="lg:sticky lg:top-36" data-reveal>
          <h2 className="section-title max-w-xl">
            Єдина координація від порту відправлення до складу клієнта.
          </h2>
          <p className="text-portway-ink-2 mt-7 max-w-xl leading-7">
            Спеціалізуємося на митному оформленні вантажів з Китаю та Європи.
            Bristol виступає посередником між експедиторами та лінійними
            агентами, напряму працює з портами Гданська та Констанци й
            супроводжує вантаж до складу клієнта в Україні.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Китай і Європа", "Митне оформлення", "Доставка до складу"].map(
              (tag) => (
                <span key={tag} className="glass-tag">
                  {tag}
                </span>
              ),
            )}
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
