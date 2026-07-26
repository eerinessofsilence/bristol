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
  const flag = flags[code];

  return (
    <img
      src={flag.src}
      alt={flag.label}
      className={`inline-block h-[1.125em] w-[1.6875em] shrink-0 rounded-[2px] object-cover align-[-0.14em] shadow-[0_0_0_1px_rgba(0,0,0,0.15)] ${className}`}
    />
  );
}
