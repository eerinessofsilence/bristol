import { useTranslation } from '../i18n';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer-shell bg-primary text-white">
      <div className="page-wrap footer-content overflow-hidden">
        <div className="pt-16 sm:pt-20">
          <div className="grid gap-14 pb-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
            <div className="footer-brand-lockup flex min-w-0 flex-col justify-between gap-16">
              <h2 className="w-full text-3xl leading-[1.3] font-semibold tracking-tight text-balance text-white">
                {t('Розкажіть про вантаж — підготуємо план оформлення та маршрут до вашого складу.', 'Tell us about your cargo—we will prepare a clearance plan and route to your warehouse.')}
              </h2>
              <div>
                <p className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                  Email
                </p>
                <a
                  href="mailto:cleargatecustoms@gmail.com"
                  className="mt-2 inline-block max-w-full text-lg font-semibold [overflow-wrap:anywhere] text-white/85 transition hover:text-white"
                >
                  cleargatecustoms@gmail.com
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:pt-1">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                  {t('Послуги', 'Services')}
                </h3>
                <nav className="mt-4 space-y-2.5 text-sm text-white/75">
                  <a className="block hover:text-white" href="#services">
                    {t('Координація перевезення', 'Transport coordination')}
                  </a>
                  <a className="block hover:text-white" href="#services">
                    {t('Гданськ і Констанца', 'Gdańsk and Constanța')}
                  </a>
                  <a className="block hover:text-white" href="#services">
                    {t('Доставка до складу', 'Delivery to warehouse')}
                  </a>
                  <a className="block hover:text-white" href="#calc">
                    {t('Калькулятор', 'Calculator')}
                  </a>
                </nav>
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                  {t('Компанія', 'Company')}
                </h3>
                <nav className="mt-4 space-y-2.5 text-sm text-white/75">
                  <a className="block hover:text-white" href="#how">
                    {t('Як працюємо', 'How it works')}
                  </a>
                  <a className="block hover:text-white" href="#operate">
                    {t('Підготовка', 'Preparation')}
                  </a>
                  <a className="block hover:text-white" href="#faq">
                    {t('Питання', 'FAQ')}
                  </a>
                  <a className="block hover:text-white" href="#testimonials">
                    {t('Відгуки', 'Reviews')}
                  </a>
                  <a className="block hover:text-white" href="#calc">
                    {t('Розрахувати платежі', 'Calculate charges')}
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
          <span>{t('© 2026 ClearGateCustoms. Усі права захищено.', '© 2026 ClearGateCustoms. All rights reserved.')}</span>
          <nav className="flex gap-5" aria-label={t('Юридична інформація', 'Legal information')}>
            <a href="/privacy" className="transition hover:text-white/80">
              {t('Конфіденційність', 'Privacy')}
            </a>
            <a href="/terms" className="transition hover:text-white/80">
              {t('Умови використання', 'Terms of use')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
