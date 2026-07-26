export function Footer() {
  return (
    <footer className="footer-shell bg-primary text-white">
      <div className="page-wrap footer-content overflow-hidden">
        <div className="pt-16 sm:pt-20">
          <div className="grid gap-14 pb-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
            <div className="footer-brand-lockup flex min-w-0 flex-col justify-between gap-16">
              <h2 className="w-full text-3xl leading-[1.3] font-semibold tracking-tight text-balance text-white">
                Розкажіть про вантаж — підготуємо план оформлення та маршрут до вашого складу.
              </h2>
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
        </div>
        <div className="footer-brand-word text-primary-hover/40 leading-[0.82] font-extrabold tracking-[-0.055em] whitespace-nowrap select-none">
          ClearGateCustoms
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-4 py-7 text-xs text-white/40">
          <span>© 2026 ClearGateCustoms. Усі права захищено.</span>
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
