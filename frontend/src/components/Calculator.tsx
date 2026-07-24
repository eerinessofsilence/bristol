import { MessageCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateQuote, getUsdExchangeRate } from '../api/client';
import type { CalculatorQuote, ExchangeRateResult, QuoteResult } from '../types';
import { Button } from './ui/Button';
import { PricePicker } from './ui/PricePicker';

type Props = {
  onContact: (quote: CalculatorQuote) => void;
};

type RateStatus = 'loading' | 'success' | 'error';

const productCodePattern = /^\d{10}$/;

const formatMoney = (value?: number) =>
  value === undefined ? '—' : `${Math.round(value).toLocaleString('uk-UA')} ₴`;

const formatUsd = (value?: number) =>
  value === undefined
    ? '—'
    : value.toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const formatRateDate = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
};

const formatRate = (value: number) =>
  value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function Calculator({ onContact }: Props) {
  const [productCode, setProductCode] = useState('');
  const [weightKg, setWeightKg] = useState(100);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateResult | null>(null);
  const [rateStatus, setRateStatus] = useState<RateStatus>('loading');
  const [rateRequestId, setRateRequestId] = useState(0);
  const [remoteResult, setRemoteResult] = useState<{ key: string; value: QuoteResult } | null>(
    null,
  );
  const [remoteError, setRemoteError] = useState<{ key: string; message: string } | null>(null);
  const hasValidCode = productCodePattern.test(productCode);
  const calculationKey = `${productCode}:${weightKg}:${exchangeRate?.rate ?? ''}`;
  const result = remoteResult?.key === calculationKey ? remoteResult.value : null;
  const quoteError = remoteError?.key === calculationKey ? remoteError.message : '';

  useEffect(() => {
    let isActive = true;

    getUsdExchangeRate()
      .then((value) => {
        if (!isActive) return;
        setExchangeRate(value);
        setRateStatus('success');
      })
      .catch(() => {
        if (!isActive) return;
        setExchangeRate(null);
        setRateStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [rateRequestId]);

  useEffect(() => {
    if (!hasValidCode || weightKg <= 0 || exchangeRate === null) {
      return;
    }

    let isActive = true;
    const requestKey = `${productCode}:${weightKg}:${exchangeRate.rate}`;
    const timer = window.setTimeout(() => {
      calculateQuote({ productCode, weightKg, currencyRate: exchangeRate.rate })
        .then((value) => {
          if (!isActive) return;
          setRemoteResult({ key: requestKey, value });
          setRemoteError(null);
        })
        .catch((error: unknown) => {
          if (!isActive) return;
          setRemoteError({
            key: requestKey,
            message:
              error instanceof Error
                ? error.message
                : 'Не вдалося виконати розрахунок. Спробуйте ще раз.',
          });
        });
    }, 300);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [exchangeRate, hasValidCode, productCode, weightKg]);

  return (
    <section id="calc" className="customs-surface bg-portway-soft scroll-mt-10 py-14 md:py-24">
      <div className="page-wrap">
        <div
          className="customs-document-shell grid overflow-hidden rounded-3xl bg-[#eff2f0] shadow-[0_20px_60px_rgba(22,34,30,0.1)] lg:grid-cols-[1.05fr_0.95fr]"
          data-reveal
        >
          <div className="customs-document-page p-5 sm:p-7 md:p-11">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 sm:mb-7">
              <span className="section-tag">
                <span className="section-index">02 /</span>&nbsp; Розрахунок
              </span>
              <span className="technical-label hidden text-[#085041]/50 sm:inline">
                MS-CALC / UA-2026
              </span>
            </div>
            <h2 className="mt-4 text-[1.85rem] leading-[1.05] font-bold tracking-tight sm:text-3xl">
              Калькулятор митних платежів
            </h2>
            <p className="text-portway-ink-3 mt-2 text-sm">
              Вкажіть код УКТ ЗЕД і вагу вантажу — візьмемо критичну ціну з довідника ризиків.
            </p>
            <div className="mt-6 sm:mt-7">
              <label className="field-label" htmlFor="productCode">
                <span className="field-index" aria-hidden="true">
                  01
                </span>
                Код УКТ ЗЕД
              </label>
              <input
                id="productCode"
                value={productCode}
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                className="field-control font-mono tracking-[0.08em]"
                placeholder="Наприклад, 0201203000"
                onChange={(event) =>
                  setProductCode(event.target.value.replace(/\D/g, '').slice(0, 10))
                }
              />
              <p
                className={`mt-2 text-xs leading-5 ${
                  productCode.length > 0 && !hasValidCode ? 'text-[#9a3412]' : 'text-portway-ink-3'
                }`}
              >
                {productCode.length > 0 && !hasValidCode
                  ? 'Введіть 10 цифр коду УКТ ЗЕД.'
                  : 'Розрахунок доступний для кодів із одиницею виміру «кг».'}
              </p>
            </div>
            <div className="mt-5">
              <label className="field-label" htmlFor="weightKg">
                <span className="field-index" aria-hidden="true">
                  02
                </span>
                Вага вантажу, кг
              </label>
              <PricePicker id="weightKg" value={weightKg} min={0} step={1} onChange={setWeightKg} />
            </div>
            <div className="mt-2">
              <div className="min-h-5 text-xs leading-5" aria-live="polite">
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
                        setRateStatus('loading');
                        setRateRequestId((current) => current + 1);
                      }}
                    >
                      Спробувати ще раз
                    </button>
                  </p>
                )}
                {rateStatus === 'success' && exchangeRate && (
                  <p className="technical-label text-[#085041]/60" role="status">
                    USD: {formatRate(exchangeRate.rate)} ₴ · курс USD НБУ на{' '}
                    {formatRateDate(exchangeRate.exchangeDate)}
                  </p>
                )}
              </div>
            </div>
            <p className="text-portway-ink-3/80 mt-5 text-xs leading-5">
              Для кодів із кількісною одиницею виміру потрібен окремий розрахунок. Пошлина у цьому
              попередньому розрахунку становить 0%; ПДВ — 20%.
            </p>
            {quoteError && (
              <p className="mt-3 rounded-lg border border-[#d85a30]/30 bg-[#faece7] px-3 py-2 text-xs leading-5 text-[#712b13]">
                {quoteError}
              </p>
            )}
          </div>
          <div
            className="bg-portway-primary relative flex flex-col justify-center overflow-hidden border-t border-white/10 p-5 text-white sm:p-7 md:p-11 lg:border-t-0"
            aria-busy={hasValidCode && exchangeRate !== null && result === null && !quoteError}
          >
            <div className="relative z-10 mb-4 flex flex-col items-start gap-1 border-b border-white/10 pb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-x-3">
              <span className="technical-label whitespace-nowrap text-white/45">
                Розрахунковий лист
              </span>
              <span className="technical-label whitespace-nowrap text-[#9fe1cb]/70">
                Статус / попередній
              </span>
            </div>
            {[
              ['Критична ціна, USD/кг', result ? formatUsd(result.criticalPriceUsdPerKg) : '—'],
              ['Вартість за довідником, USD', result ? formatUsd(result.customsValueUsd) : '—'],
              ['Митна вартість, ₴', formatMoney(result?.customsValueUah)],
              ['Мито (0%)', formatMoney(result?.duty)],
              ['ПДВ (20%)', formatMoney(result?.vat)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-3 border-b border-white/10 py-3 text-sm"
              >
                <span className="min-w-0 text-white/55">{label}</span>
                <span className="shrink-0 font-mono text-xs font-medium tabular-nums sm:text-sm">
                  {value}
                </span>
              </div>
            ))}
            <div className="mt-2 flex flex-col gap-1 pt-5 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-semibold">Разом платежів</span>
              <strong className="text-portway-mint font-mono text-[1.7rem] font-semibold tracking-tight tabular-nums sm:text-3xl">
                {formatMoney(result?.total)}
              </strong>
            </div>
            <Button
              icon={MessageCircle}
              variant="mint"
              className="mt-6 w-full self-stretch sm:mt-7 sm:w-auto sm:self-start"
              disabled={result === null}
              onClick={() => {
                if (result === null) return;
                onContact({
                  productCode: result.productCode,
                  weightKg: result.weightKg,
                  criticalPriceUsdPerKg: result.criticalPriceUsdPerKg,
                  customsValueUsd: result.customsValueUsd,
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
