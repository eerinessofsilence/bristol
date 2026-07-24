import { partners } from '../data/content';

export function Partners() {
  return (
    <section id="partners" className="bg-soft scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <span className="section-tag">Партнери</span>
          <h2 className="section-title mt-4">Наші партнери</h2>
          <p className="text-ink-2 mt-4 text-balance">
            Координуємо доставку через провідні контейнерні лінії, з якими у нас діють договірні
            відносини.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-reveal>
          {partners.map((name) => (
            <div
              key={name}
              className="border-line flex min-h-24 items-center justify-center rounded-2xl border bg-white px-4 text-center shadow-[0_8px_24px_rgba(22,34,30,0.05)]"
            >
              <span className="text-ink-2 font-mono text-sm font-bold tracking-[0.08em] uppercase">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
