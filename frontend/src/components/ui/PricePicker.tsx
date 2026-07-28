import { Minus, Plus } from 'lucide-react';
import { useTranslation } from '../../i18n';

type Props = {
  id: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function PricePicker({ id, value, min = 0, step = 10, onChange }: Props) {
  const { t } = useTranslation();
  const updateValue = (nextValue: number) => onChange(Math.max(min, nextValue));

  return (
    <div className="border-line focus-within:border-mint flex min-h-12 items-center rounded-xl border-[1.5px] bg-white py-1.5 pr-1.5 pl-4 transition duration-200 focus-within:shadow-[0_0_0_3px_rgba(63,181,140,0.1)]">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        aria-label={t('Митна вартість', 'Customs value')}
        className="text-ink min-w-0 flex-1 bg-transparent text-sm outline-none"
        onChange={(event) => {
          const normalized = event.target.value.replace(',', '.');
          if (/^\d*\.?\d*$/.test(normalized)) updateValue(Number(normalized) || 0);
        }}
      />
      <div className="bg-soft flex items-center rounded-lg p-0.5">
        <button
          type="button"
          aria-label={t('Зменшити митну вартість', 'Decrease customs value')}
          className="text-ink-2 hover:bg-primary grid size-8 cursor-pointer place-items-center rounded-md transition duration-200 hover:text-white active:scale-90"
          onClick={() => updateValue(value - step)}
        >
          <Minus size={15} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          aria-label={t('Збільшити митну вартість', 'Increase customs value')}
          className="text-ink-2 hover:bg-mint hover:text-primary grid size-8 cursor-pointer place-items-center rounded-md transition duration-200 active:scale-90"
          onClick={() => updateValue(value + step)}
        >
          <Plus size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
