import { Camera, Phone, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApiError, calculateQuote, getUsdExchangeRate } from '../api/client';
import { productCategories } from '../data/content';
import type { CalculatorQuote, ExchangeRateResult, QuoteResult } from '../types';
import { Button } from './ui/Button';
import { PricePicker } from './ui/PricePicker';
import { ProductCodeFinderModal } from './ProductCodeFinderModal';

type Props = {
  onContact: (quote: CalculatorQuote | null) => void;
};

type RateStatus = 'loading' | 'success' | 'error';

const productCodePattern = /^\d{10}$/;

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

function ProductCategories() {
  return (
    <section className="bg-soft py-20 md:py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <span className="section-tag">
            <span className="section-index">05 /</span>&nbsp; Категорії товарів
          </span>
          <h2 className="mt-4 text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
            Основні товарні групи, з якими ми працюємо
          </h2>
          <p className="text-ink-3 mt-3 text-sm leading-6 text-balance">
            Оформлюємо регулярні та разові поставки цих категорій з Китаю та Європи.
          </p>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {productCategories.map(({ image, label }) => (
            <article
              key={label}
              className="group bg-primary relative flex aspect-[4/3] min-h-44 overflow-hidden rounded-2xl border border-[#9fe1cb]/60 p-5 shadow-[0_10px_24px_rgba(22,34,30,0.1)]"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
              />
              <span
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,21,18,0.12)_0%,rgba(12,21,18,0.9)_100%)]"
                aria-hidden="true"
              />
              <div className="relative z-10 mt-auto flex w-full flex-col items-start gap-3">
                <span className="max-w-[24ch] text-lg leading-6 font-bold text-white">{label}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Calculator({ onContact }: Props) {
  const [productCode, setProductCode] = useState('');
  const [weightKg, setWeightKg] = useState(100);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateResult | null>(null);
  const [rateStatus, setRateStatus] = useState<RateStatus>('loading');
  const [rateRequestId, setRateRequestId] = useState(0);
  const [isCodeFinderOpen, setIsCodeFinderOpen] = useState(false);
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
              error instanceof ApiError
                ? error.message
                : 'Не вдалося виконати розрахунок. Перевірте з’єднання і спробуйте ще раз.',
          });
        });
    }, 300);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [exchangeRate, hasValidCode, productCode, weightKg]);

  return (
    <>
      <section
        id="calc"
        className="customs-surface scroll-mt-28 bg-white py-14 md:scroll-mt-32 md:py-24"
      >
        <div className="page-wrap">
          <div
            className="customs-document-shell grid overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(22,34,30,0.1)] lg:grid-cols-[1.05fr_0.95fr]"
            data-reveal
          >
            <div className="customs-document-page min-w-0 p-5 sm:p-7 md:p-11">
              <div className="mb-6 box-content flex min-h-8 flex-wrap items-center justify-between gap-3 pb-4 sm:mb-7">
                <span className="section-tag">
                  <span className="section-index">04 /</span>&nbsp; Розрахунок
                </span>
                <span className="technical-label hidden text-[#085041]/50 sm:inline">
                  CGC-CALC / UA-2026
                </span>
              </div>
              <h2 className="mt-4 text-3xl leading-[1.05] font-bold tracking-tight">
                Калькулятор митних платежів
              </h2>
              <p className="text-ink-3 mt-2 text-sm text-balance">
                Вкажіть код УКТ ЗЕД і вагу вантажу.
              </p>
              <div className="mt-6 sm:mt-7">
                <label className="field-label" htmlFor="productCode">
                  <span className="field-index" aria-hidden="true">
                    01
                  </span>
                  Код УКТ ЗЕД
                </label>
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
                  <input
                    id="productCode"
                    value={productCode}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    className="field-control min-w-0 flex-1"
                    placeholder="Наприклад, 0201203000"
                    onChange={(event) =>
                      setProductCode(event.target.value.replace(/\D/g, '').slice(0, 10))
                    }
                  />
                  <Button
                    type="button"
                    icon={Camera}
                    variant="outline"
                    size="compact"
                    className="action-pill-flat w-full shrink-0 self-stretch sm:w-auto"
                    onClick={() => setIsCodeFinderOpen(true)}
                  >
                    <span className="sm:hidden">За фото</span>
                    <span className="hidden sm:inline">Визначити за фото</span>
                  </Button>
                </div>
                <p
                  className={`mt-2 text-xs leading-5 ${
                    productCode.length > 0 && !hasValidCode ? 'text-[#9a3412]' : 'text-ink-3'
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
                <PricePicker
                  id="weightKg"
                  value={weightKg}
                  min={0}
                  step={1}
                  onChange={setWeightKg}
                />
              </div>
              <div className="mt-2">
                <div className="min-h-5 text-xs leading-5" aria-live="polite">
                  {rateStatus === 'loading' && (
                    <p className="text-ink-3 flex items-center gap-2" role="status">
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
              <p className="text-ink-3/80 mt-5 text-xs leading-5">
                Для кодів із кількісною одиницею виміру потрібен окремий розрахунок. Ставка ввізного
                мита визначається за кодом УКТ ЗЕД; ПДВ — 20%.
              </p>
              {quoteError && (
                <p className="mt-3 rounded-lg border border-[#d85a30]/30 bg-[#faece7] px-3 py-2 text-xs leading-5 text-[#712b13]">
                  {quoteError}
                </p>
              )}
            </div>
            <div
              className="bg-primary relative flex min-w-0 flex-col overflow-hidden border-t border-white/10 p-5 text-white sm:p-7 md:p-11 lg:border-t-0"
              aria-busy={hasValidCode && exchangeRate !== null && result === null && !quoteError}
            >
              <div className="relative z-10 mb-4 box-content flex min-h-8 flex-col items-start gap-1 border-b border-white/10 pb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-x-3">
                <span className="technical-label whitespace-nowrap text-white/45">
                  Попередній розрахунок
                </span>
                <span className="technical-label whitespace-nowrap text-[#9fe1cb]/70">
                  Статус / орієнтовний
                </span>
              </div>
              <div className="relative z-10 flex flex-1 flex-col justify-center py-8 sm:py-12">
                <span className="technical-label text-[#9fe1cb]/70">Митні платежі</span>
                <h3 className="mt-3 max-w-[20ch] text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                  Орієнтовна сума платежів
                </h3>
                <strong className="text-mint font-accent mt-5 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                  {formatMoney(result?.total)}
                </strong>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                  {result
                    ? `Пільгова ставка мита — ${formatRate(result.dutyRatePercent)}%. Мито: ${formatMoney(result.duty)}, ПДВ: ${formatMoney(result.vat)}.`
                    : 'Підсумок включає мито та ПДВ. Розрахунок орієнтовний.'}
                </p>
              </div>
              <Button
                icon={Phone}
                variant="mint"
                className="relative z-10 mt-2 w-full gap-3 self-stretch py-2.5 pr-2.5 pl-4 text-left sm:w-auto sm:gap-8 sm:self-start sm:pl-6 [&>span:first-child]:leading-5 [&>span:first-child]:whitespace-normal sm:[&>span:first-child]:whitespace-nowrap"
                onClick={() => {
                  onContact(
                    result
                      ? {
                          productCode: result.productCode,
                          weightKg: result.weightKg,
                          criticalPriceUsdPerKg: result.criticalPriceUsdPerKg,
                          customsValueUsd: result.customsValueUsd,
                          total: result.total,
                        }
                      : null,
                  );
                }}
              >
                Запросити точний розрахунок
              </Button>
            </div>
          </div>
          <p className="text-ink-3 mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-balance">
            У розрахунку використовується пільгова ставка з Митного тарифу України. Странова
            преференція, зокрема 0%, не застосовується без підтвердженої країни походження та
            належного документа. Розрахунок має інформативний характер.
          </p>
        </div>
      </section>
      <ProductCategories />
      <ProductCodeFinderModal
        isOpen={isCodeFinderOpen}
        onClose={() => setIsCodeFinderOpen(false)}
        onSelect={setProductCode}
      />
    </>
  );
}
