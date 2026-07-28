type CountryFlagCode = 'cn' | 'eu' | 'pl' | 'ro';

const flags: Record<CountryFlagCode, { src: string; label: string }> = {
  cn: { src: '/images/flags/cn.svg', label: 'Прапор Китаю' },
  eu: { src: '/images/flags/eu.svg', label: 'Прапор Європейського Союзу' },
  pl: { src: '/images/flags/pl.svg', label: 'Прапор Польщі' },
  ro: { src: '/images/flags/ro.svg', label: 'Прапор Румунії' },
};

type Props = {
  code: CountryFlagCode;
  className?: string;
};

export function CountryFlag({ code, className = '' }: Props) {
  const { language } = useTranslation();
  const flag = flags[code];
  const labels: Record<CountryFlagCode, string> = {
    cn: 'Flag of China', eu: 'Flag of the European Union', pl: 'Flag of Poland', ro: 'Flag of Romania',
  };

  return (
    <img
      src={flag.src}
      alt={language === 'en' ? labels[code] : flag.label}
      className={`mx-1 inline-block h-[1.125em] w-[1.6875em] shrink-0 rounded-[1px] object-cover align-[-0.14em] shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)] ${className}`}
    />
  );
}
import { useTranslation } from '../../i18n';
