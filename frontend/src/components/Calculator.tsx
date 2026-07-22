import { useEffect, useMemo, useState } from 'react';
import { calculateQuote } from '../api/client';
import { currencies, productCategories } from '../data/content';
import type { QuoteResult } from '../types';
import { CustomSelect } from './ui/CustomSelect';
import { Button } from './ui/Button';
import { PricePicker } from './ui/PricePicker';

type Props = {
  onContact: () => void;
};

const initialResult: QuoteResult = {
  customsValueUah: 41500,
  duty: 0,
  vatBase: 41500,
  vat: 8300,
  total: 8300,
};

const formatMoney = (value: number) => `${Math.round(value).toLocaleString('uk-UA')} ₴`;

function calculateLocally(customsValue: number, currencyRate: number, dutyRate: number) {
  const customsValueUah = customsValue * currencyRate;
  const duty = customsValueUah * (dutyRate / 100);
  const vatBase = customsValueUah + duty;
  const vat = vatBase * 0.2;
  return { customsValueUah, duty, vatBase, vat, total: duty + vat };
}

export function Calculator({ onContact }: Props) {
  const [customsValue, setCustomsValue] = useState(1000);
  const [currencyRate, setCurrencyRate] = useState(41.5);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const dutyRate = productCategories[categoryIndex].duty;
  const [remoteResult, setRemoteResult] = useState<{ key: string; value: QuoteResult }>({
    key: '1000:41.5:0',
    value: initialResult,
  });

  const localResult = useMemo(
    () => calculateLocally(customsValue, currencyRate, dutyRate),
    [customsValue, currencyRate, dutyRate],
  );
  const calculationKey = `${customsValue}:${currencyRate}:${dutyRate}`;
  const result = remoteResult.key === calculationKey ? remoteResult.value : localResult;

  useEffect(() => {
    const requestKey = `${customsValue}:${currencyRate}:${dutyRate}`;
    const timer = window.setTimeout(() => {
      calculateQuote({ customsValue, currencyRate, dutyRate })
        .then((value) => setRemoteResult({ key: requestKey, value }))
        .catch(() => undefined);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [customsValue, currencyRate, dutyRate]);

  return (
    <section id="calc" className="bg-portway-soft scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap">
        <div
          className="grid overflow-hidden rounded-3xl bg-[#eff2f0] shadow-[0_20px_60px_rgba(22,34,30,0.1)] lg:grid-cols-[1.05fr_0.95fr]"
          data-reveal
        >
          <div className="p-7 md:p-11">
            <span className="section-tag">Орієнтовно</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Калькулятор митних платежів</h2>
            <p className="text-portway-ink-3 mt-2 text-sm">
              Оцініть мито та ПДВ ще до відправки вантажу.
            </p>
            <div className="mt-7">
              <label className="field-label" htmlFor="category">
                Категорія товару
              </label>
              <CustomSelect
                id="category"
                options={productCategories.map((category) => ({
                  label: category.label,
                  value: productCategories.indexOf(category),
                }))}
                value={categoryIndex}
                onChange={setCategoryIndex}
              />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="customsValue">
                  Митна вартість
                </label>
                <PricePicker
                  id="customsValue"
                  value={customsValue}
                  min={0}
                  step={10}
                  onChange={setCustomsValue}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="currency">
                  Валюта
                </label>
                <CustomSelect
                  id="currency"
                  options={currencies.map((currency) => ({
                    label: currency.label,
                    value: currency.rate,
                  }))}
                  value={currencyRate}
                  onChange={setCurrencyRate}
                />
              </div>
            </div>
            <p className="text-portway-ink-3/80 mt-4 text-xs leading-5">
              Розрахунок орієнтовний і не є підставою для сплати платежів. Точну суму та код УКТЗЕД
              визначить брокер після консультації.
            </p>
          </div>
          <div className="bg-portway-primary border-portway-mint/25 flex flex-col justify-center border-t p-7 text-white md:p-11 lg:border-t-0 lg:border-l">
            {[
              ['Митна вартість, ₴', formatMoney(result.customsValueUah)],
              [`Мито (${dutyRate}%)`, formatMoney(result.duty)],
              ['База ПДВ', formatMoney(result.vatBase)],
              ['ПДВ (20%)', formatMoney(result.vat)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between border-b border-white/10 py-3 text-sm"
              >
                <span className="text-white/55">{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className="mt-2 flex items-baseline justify-between pt-5">
              <span className="font-semibold">Разом платежів</span>
              <strong className="text-portway-mint text-3xl font-extrabold">
                {formatMoney(result.total)}
              </strong>
            </div>
            <Button variant="mint" className="mt-7 self-start" onClick={onContact}>
              Отримати точний розрахунок
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
