import { MessageCircle, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { calculateQuote, getEurExchangeRate, getUsdExchangeRate } from '../api/client';
import { currencies, productCategories } from '../data/content';
import type { CalculatorQuote, ExchangeRateResult, QuoteResult } from '../types';
import { CustomSelect } from './ui/CustomSelect';
import { Button } from './ui/Button';
import { PricePicker } from './ui/PricePicker';

type Props = {
  onContact: (quote: CalculatorQuote) => void;
};

type ForeignCurrency = 'USD' | 'EUR';
type RateStatus = 'idle' | 'loading' | 'success' | 'error';

const formatMoney = (value?: number) =>
  value === undefined ? '—' : `${Math.round(value).toLocaleString('uk-UA')} ₴`;

const formatRateDate = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
};

const formatRate = (value: number) =>
  value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function calculateLocally(customsValue: number, currencyRate: number, dutyRate: number) {
  const customsValueUah = customsValue * currencyRate;
  const duty = customsValueUah * (dutyRate / 100);
  const vatBase = customsValueUah + duty;
  const vat = vatBase * 0.2;
  return { customsValueUah, duty, vatBase, vat, total: duty + vat };
}

export function Calculator({ onContact }: Props) {
  const [customsValue, setCustomsValue] = useState(1000);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [exchangeRates, setExchangeRates] = useState<
    Partial<Record<ForeignCurrency, ExchangeRateResult>>
  >({});
  const [rateStatuses, setRateStatuses] = useState<Record<ForeignCurrency, RateStatus>>({
    USD: 'loading',
    EUR: 'loading',
  });
  const [rateRequestId, setRateRequestId] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const dutyRate = productCategories[categoryIndex].duty;
  const category = productCategories[categoryIndex];
  const selectedCurrency = currencies[currencyIndex];
  const currency = selectedCurrency.code;
  const foreignCurrency: ForeignCurrency | null =
    currency === 'UAH' ? null : (currency as ForeignCurrency);
  const exchangeRate = foreignCurrency ? (exchangeRates[foreignCurrency] ?? null) : null;
  const rateStatus = foreignCurrency ? rateStatuses[foreignCurrency] : 'success';
  const currencyRate = foreignCurrency ? (exchangeRate?.rate ?? null) : selectedCurrency.rate;
  const [remoteResult, setRemoteResult] = useState<{
    key: string;
    value: QuoteResult;
  } | null>(null);

  const localResult = useMemo(
    () => (currencyRate === null ? null : calculateLocally(customsValue, currencyRate, dutyRate)),
    [customsValue, currencyRate, dutyRate],
  );
  const calculationKey = `${customsValue}:${currencyRate}:${dutyRate}`;
  const result = remoteResult?.key === calculationKey ? remoteResult.value : localResult;
  const currencyOptions = currencies.map((item, index) => ({
    label: item.label,
    value: index,
  }));

  useEffect(() => {
    if (foreignCurrency === null) return;

    let isActive = true;
    const getExchangeRate = foreignCurrency === 'USD' ? getUsdExchangeRate : getEurExchangeRate;

    getExchangeRate()
      .then((value) => {
        if (!isActive) return;
        setExchangeRates((current) => ({ ...current, [foreignCurrency]: value }));
        setRateStatuses((current) => ({ ...current, [foreignCurrency]: 'success' }));
      })
      .catch(() => {
        if (!isActive) return;
        setExchangeRates((current) => ({ ...current, [foreignCurrency]: undefined }));
        setRateStatuses((current) => ({ ...current, [foreignCurrency]: 'error' }));
      });

    return () => {
      isActive = false;
    };
  }, [foreignCurrency, rateRequestId]);

  useEffect(() => {
    if (currencyRate === null) return;

    const requestKey = `${customsValue}:${currencyRate}:${dutyRate}`;
    const timer = window.setTimeout(() => {
      calculateQuote({ customsValue, currencyRate, dutyRate })
        .then((value) => setRemoteResult({ key: requestKey, value }))
        .catch(() => undefined);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [customsValue, currencyRate, dutyRate]);

  return (
    <section id="calc" className="customs-surface bg-portway-soft scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap">
        <div
          className="customs-document-shell grid overflow-hidden rounded-3xl bg-[#eff2f0] shadow-[0_20px_60px_rgba(22,34,30,0.1)] lg:grid-cols-[1.05fr_0.95fr]"
          data-reveal
        >
          <div className="customs-document-page p-7 md:p-11">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 pb-4">
              <span className="section-tag">
                <span className="section-index">02 /</span>&nbsp; Розрахунок
              </span>
              <span className="technical-label hidden text-[#085041]/50 sm:inline">
                MS-CALC / UA-2026
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Калькулятор митних платежів</h2>
            <p className="text-portway-ink-3 mt-2 text-sm">
              Оцініть можливий розмір мита та ПДВ до оформлення вантажу.
            </p>
            <div className="mt-7">
              <label className="field-label" htmlFor="category">
                <span className="field-index" aria-hidden="true">
                  01
                </span>
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
                  <span className="field-index" aria-hidden="true">
                    02
                  </span>
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
                  <span className="field-index" aria-hidden="true">
                    03
                  </span>
                  Валюта
                </label>
                <CustomSelect
                  id="currency"
                  options={currencyOptions}
                  value={currencyIndex}
                  onChange={setCurrencyIndex}
                />
                {foreignCurrency && (
                  <div className="mt-2 min-h-5 text-xs leading-5" aria-live="polite">
                    {rateStatus === 'loading' && (
                      <p className="text-portway-ink-3 flex items-center gap-2" role="status">
                        <RefreshCw className="animate-spin" size={13} aria-hidden="true" />
                        Отримуємо актуальний курс НБУ…
                      </p>
                    )}
                    {rateStatus === 'error' && (
                      <p className="text-[#9a3412]" role="alert">
                        Курс НБУ тимчасово недоступний.{' '}
                        <button
                          type="button"
                          className="cursor-pointer font-semibold underline underline-offset-2"
                          onClick={() => {
                            setRateStatuses((current) => ({
                              ...current,
                              [foreignCurrency]: 'loading',
                            }));
                            setRateRequestId((current) => current + 1);
                          }}
                        >
                          Спробувати ще раз
                        </button>
                      </p>
                    )}
                    {rateStatus === 'success' && exchangeRate?.isStale && (
                      <p className="text-[#9a3412]" role="status">
                        Курс тимчасово недоступний, показано курс на{' '}
                        {formatRateDate(exchangeRate.exchangeDate)}
                      </p>
                    )}
                    {rateStatus === 'success' && exchangeRate && !exchangeRate.isStale && (
                      <p
                        className="technical-label w-full text-center text-[#085041]/60"
                        role="status"
                      >
                        Курс {foreignCurrency}: {formatRate(exchangeRate.rate)} ₴
                        <br />
                        НБУ на {formatRateDate(exchangeRate.exchangeDate)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-portway-ink-3/80 mt-4 text-xs leading-5">
              Розрахунок орієнтовний та має інформативний характер. Точна ставка мита залежить від
              коду УКТ ЗЕД, походження товару та особливостей поставки. Для остаточного розрахунку
              зверніться до менеджера.
            </p>
          </div>
          <div
            className="bg-portway-primary relative flex flex-col justify-center overflow-hidden border-t border-white/10 p-7 text-white md:p-11 lg:border-t-0"
            aria-busy={result === null}
          >
            <div className="relative z-10 mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <span className="technical-label text-white/45">Розрахунковий лист</span>
              <span className="technical-label text-[#9fe1cb]/70">Статус / попередній</span>
            </div>
            {[
              ['Митна вартість, ₴', formatMoney(result?.customsValueUah)],
              [`Мито (${dutyRate}%)`, formatMoney(result?.duty)],
              ['База ПДВ', formatMoney(result?.vatBase)],
              ['ПДВ (20%)', formatMoney(result?.vat)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between border-b border-white/10 py-3 text-sm"
              >
                <span className="text-white/55">{label}</span>
                <span className="font-mono text-xs font-medium tabular-nums sm:text-sm">
                  {value}
                </span>
              </div>
            ))}
            <div className="mt-2 flex items-baseline justify-between pt-5">
              <span className="font-semibold">Разом платежів</span>
              <strong className="text-portway-mint font-mono text-3xl font-semibold tracking-tight tabular-nums">
                {formatMoney(result?.total)}
              </strong>
            </div>
            <Button
              icon={MessageCircle}
              variant="mint"
              className="mt-7 self-start"
              disabled={result === null}
              onClick={() => {
                if (result === null) return;
                onContact({
                  category: category.label,
                  customsValue,
                  currency,
                  dutyRate,
                  total: result.total,
                });
              }}
            >
              Запросити точний розрахунок
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
