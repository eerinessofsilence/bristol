type Props = {
  compact?: boolean;
};

const containers = [
  '#3fb58c',
  '#2e9a75',
  '#d98b4a',
  '#4e6a5f',
  '#c24c3c',
  '#2e9a75',
  '#4e6a5f',
  '#3fb58c',
  '#c24c3c',
  '#d98b4a',
];

export function PortScene({ compact = false }: Props) {
  const { t } = useTranslation();
  return (
    <div
      aria-label={t('Ілюстрація контейнерного судна в порту', 'Illustration of a container vessel in port')}
      role="img"
      className={`relative isolate h-full min-h-72 overflow-hidden bg-gradient-to-b from-[#dceee6] via-[#b8d9cb] to-[#74a696] ${compact ? '' : 'rounded-[18px]'}`}
    >
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-[#7fb0a0] to-[#43685c]" />
      <div className="absolute right-[8%] bottom-[18%] h-[58%] w-1.5 bg-[#22332e]">
        <div className="absolute top-0 right-0 h-1.5 w-36 bg-[#22332e]" />
        <div className="absolute top-0 right-20 h-24 w-0.5 bg-[#22332e]" />
      </div>
      <div className="absolute bottom-[16%] left-[13%] h-[17%] w-[63%] skew-x-[-12deg] rounded-b-[45%] bg-[#22332e]" />
      <div className="absolute bottom-[31%] left-[18%] grid w-[48%] grid-cols-5 gap-1">
        {containers.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className={`h-10 border border-black/10 ${index > 4 ? '-translate-y-11' : ''}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="absolute right-[20%] bottom-[30%] h-14 w-14 bg-[#37524b]">
        <div className="mt-3 ml-3 h-2 w-2 bg-[#9fc7b6]" />
      </div>
      <div className="absolute right-[12%] bottom-[11%] h-0.5 w-[24%] bg-white/30" />
      <div className="absolute bottom-[8%] left-[8%] h-0.5 w-[22%] bg-white/30" />
    </div>
  );
}
import { useTranslation } from '../i18n';
