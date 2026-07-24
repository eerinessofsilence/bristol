export function Footer() {
  return (
    <footer className="bg-portway-primary overflow-hidden pt-20 text-white">
      <div className="page-wrap">
        <div className="grid gap-14 pb-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div className="footer-brand-lockup flex min-w-0 flex-col justify-between gap-16">
            <h2 className="from-portway-mint-muted to-portway-mint-soft w-full bg-linear-to-r via-[#b8cbc4] bg-clip-text text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.35] font-semibold tracking-tight text-balance text-transparent opacity-60">
              Розкажіть про вантаж — підготуємо план оформлення та маршрут до вашого складу.
            </h2>
            <div className="footer-brand-word leading-[0.82] font-extrabold tracking-[-0.055em] select-none">
              Митні системи
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:pt-1">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                Послуги
              </h3>
              <nav className="mt-4 space-y-2.5 text-sm text-white/75">
                <a className="block hover:text-white" href="#services">
                  Координація перевезення
                </a>
                <a className="block hover:text-white" href="#services">
                  Гданськ і Констанца
                </a>
                <a className="block hover:text-white" href="#services">
                  Доставка до складу
                </a>
                <a className="block hover:text-white" href="#calc">
                  Калькулятор
                </a>
              </nav>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                Компанія
              </h3>
              <nav className="mt-4 space-y-2.5 text-sm text-white/75">
                <a className="block hover:text-white" href="#how">
                  Як працюємо
                </a>
                <a className="block hover:text-white" href="#operate">
                  Підготовка
                </a>
                <a className="block hover:text-white" href="#faq">
                  Питання
                </a>
                <a className="block hover:text-white" href="#testimonials">
                  Відгуки
                </a>
                <a className="block hover:text-white" href="#calc">
                  Розрахувати платежі
                </a>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-4 py-7 text-xs text-white/40">
          <span>© 2026 Митні системи. Усі права захищено.</span>
          <nav className="flex gap-5" aria-label="Юридична інформація">
            <a href="/privacy" className="transition hover:text-white/80">
              Конфіденційність
            </a>
            <a href="/terms" className="transition hover:text-white/80">
              Умови використання
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
