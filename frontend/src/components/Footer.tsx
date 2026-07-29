import { useTranslation } from '../i18n';
import { Button } from './ui/Button';

function InstagramIcon() {
  return (
    <svg
      className="h-[21px] w-[21px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

type FooterProps = {
  onRequestConsultation: () => void;
};

export function Footer({ onRequestConsultation }: FooterProps) {
  const { t } = useTranslation();
  return (
    <footer className="footer-shell bg-primary text-white">
      <div className="page-wrap footer-content overflow-hidden">
        <div className="pt-16 sm:pt-20">
          <div className="grid gap-14 pb-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
            <div className="footer-brand-lockup flex min-w-0 flex-col justify-between gap-16">
              <div>
                <h2 className="w-full text-3xl leading-[1.3] font-semibold tracking-tight text-balance text-white">
                  {t(
                    'Розкажіть про вантаж — підготуємо план оформлення та маршрут до вашого складу.',
                    'Tell us about your cargo—we will prepare a clearance plan and route to your warehouse.',
                  )}
                </h2>
                <Button
                  type="button"
                  size="compact"
                  className="mt-6"
                  onClick={onRequestConsultation}
                >
                  {t('Отримати консультацію', 'Request a consultation')}
                </Button>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                  {t('Контакти', 'Contacts')}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:cleargatecustoms@gmail.com"
                    className="max-w-full text-lg font-semibold [overflow-wrap:anywhere] text-white/85 transition hover:text-white"
                  >
                    cleargatecustoms@gmail.com
                  </a>
                  <a
                    href="https://www.instagram.com/cleargatecustoms_ua?igsh=dDhhOGJjcG5kMzlv"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t(
                      'Instagram ClearGateCustoms — відкрити в новій вкладці',
                      'ClearGateCustoms Instagram — open in a new tab',
                    )}
                    className="focus-visible:outline-mint grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white/75 transition hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:pt-1">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-white/45 uppercase">
                  {t('Послуги', 'Services')}
                </h3>
                <nav className="mt-4 space-y-3.5 text-sm text-white/75">
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
                <nav className="mt-4 space-y-3.5 text-sm text-white/75">
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
        <div className="footer-brand-word leading-[0.82] font-extrabold tracking-[-0.055em] whitespace-nowrap text-white/[0.055] select-none">
          ClearGateCustoms
        </div>
        <div className="mt-4 py-6 text-xs text-white/60">
          <span>
            {t(
              '© 2026 ClearGateCustoms. Усі права захищено.',
              '© 2026 ClearGateCustoms. All rights reserved.',
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
