import { Minus, Plus } from 'lucide-react';

type Props = {
  id: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function PricePicker({ id, value, min = 0, step = 10, onChange }: Props) {
  const updateValue = (nextValue: number) => onChange(Math.max(min, nextValue));

  return (
    <div className="border-cleargatecustoms-line focus-within:border-cleargatecustoms-mint flex min-h-12 items-center rounded-xl border-[1.5px] bg-white py-1.5 pr-1.5 pl-4 transition duration-200 focus-within:shadow-[0_0_0_3px_rgba(63,181,140,0.1)]">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        aria-label="Митна вартість"
        className="text-cleargatecustoms-ink min-w-0 flex-1 bg-transparent text-sm outline-none"
        onChange={(event) => {
          const normalized = event.target.value.replace(',', '.');
          if (/^\d*\.?\d*$/.test(normalized)) updateValue(Number(normalized) || 0);
        }}
      />
      <div className="bg-cleargatecustoms-soft flex items-center rounded-lg p-0.5">
        <button
          type="button"
          aria-label="Зменшити митну вартість"
          className="text-cleargatecustoms-ink-2 hover:bg-cleargatecustoms-primary grid size-8 cursor-pointer place-items-center rounded-md transition duration-200 hover:text-white active:scale-90"
          onClick={() => updateValue(value - step)}
        >
          <Minus size={15} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          aria-label="Збільшити митну вартість"
          className="text-cleargatecustoms-ink-2 hover:bg-cleargatecustoms-mint hover:text-cleargatecustoms-primary grid size-8 cursor-pointer place-items-center rounded-md transition duration-200 active:scale-90"
          onClick={() => updateValue(value + step)}
        >
          <Plus size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
