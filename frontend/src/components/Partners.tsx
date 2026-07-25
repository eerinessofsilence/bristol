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
        <div className="mt-12 flex flex-wrap justify-center gap-4" data-reveal>
          {partners.map(({ name, logo }) => (
            <div
              key={name}
              className="border-line flex min-h-28 basis-[calc((100%-1rem)/2)] items-center justify-center rounded-2xl border bg-white px-6 shadow-[0_8px_24px_rgba(22,34,30,0.05)] sm:min-h-32 sm:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-3rem)/4)]"
            >
              <img src={logo} alt={name} className="h-8 max-w-[70%] object-contain sm:h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
