type Props = {
  onContact: () => void;
};

export function Footer({ onContact }: Props) {
  return (
    <footer className="bg-portway-primary overflow-hidden pt-20 text-white">
      <div className="page-wrap">
        <div className="grid gap-12 pb-14 lg:grid-cols-[1.3fr_1fr]">
          <h2 className="max-w-lg text-3xl leading-tight font-bold tracking-tight">
            Не дозволяйте митниці гальмувати ваш бізнес. Отримайте гарантований план оформлення.
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                Послуги
              </h3>
              <nav className="mt-4 space-y-2.5 text-sm text-white/75">
                <a className="block hover:text-white" href="#services">
                  Брокеридж
                </a>
                <a className="block hover:text-white" href="#services">
                  Портова обробка
                </a>
                <a className="block hover:text-white" href="#services">
                  Доставка
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
                  Географія
                </a>
                <a className="block hover:text-white" href="#faq">
                  Питання
                </a>
                <button
                  type="button"
                  className="cursor-pointer hover:text-white"
                  onClick={onContact}
                >
                  Контакти
                </button>
              </nav>
            </div>
          </div>
        </div>
        <div className="text-[clamp(64px,15vw,190px)] leading-[0.82] font-extrabold tracking-[-0.055em] select-none">
          Portway
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-4 py-7 text-xs text-white/40">
          <span>© 2026 Portway. Усі права захищено.</span>
          <nav className="flex gap-5" aria-label="Юридична інформація">
            <a href="/privacy" className="transition hover:text-white/80">
              Privacy
            </a>
            <a href="/terms" className="transition hover:text-white/80">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
