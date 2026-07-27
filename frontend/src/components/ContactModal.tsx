import { Send, X } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { ApiError, createLead } from '../api/client';
import type { CalculatorQuote } from '../types';
import { Button } from './ui/Button';

type Props = {
  isOpen: boolean;
  quote: CalculatorQuote | null;
  onClose: () => void;
};

const initialForm = { firstName: '', lastName: '', phone: '', email: '' };

const formatMoney = (value: number) => `${Math.round(value).toLocaleString('uk-UA')} ₴`;

const ukrainianMobilePattern =
  /^\+380(?:39|50|63|66|67|68|73|75|77|91|92|93|94|95|96|97|98|99)\d{7}$/;

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('380')) digits = digits.slice(3);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  digits = digits.slice(0, 9);

  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return parts.length ? `+380 ${parts.join(' ')}` : '';
}

function normalizedPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return `+380${digits.startsWith('380') ? digits.slice(3) : digits}`;
}

export function ContactModal({ isOpen, quote, onClose }: Props) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submissionSucceeded, setSubmissionSucceeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) window.setTimeout(() => firstInputRef.current?.focus(), 50);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = normalizedPhone(form.phone);
    if (!ukrainianMobilePattern.test(phone)) {
      setPhoneError('Вкажіть номер у форматі +380 XX XXX XX XX');
      return;
    }

    setSubmitting(true);
    setStatus('');
    setSubmissionSucceeded(false);
    try {
      await createLead({
        ...form,
        phone,
        source: quote ? 'calculator_quote' : 'hero_consultation',
      });
      setSubmissionSucceeded(true);
      setStatus(
        `Заявку прийнято до опрацювання. Дякуємо, ${form.firstName}! Зателефонуємо найближчим часом.`,
      );
      setForm(initialForm);
    } catch (error) {
      setStatus(
        error instanceof ApiError
          ? error.message
          : 'Не вдалося надіслати заявку. Перевірте з’єднання і спробуйте ще раз.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="bg-primary/55 fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto p-3 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-[520px] overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-8 md:px-10 md:py-11"
      >
        <div className="relative flex min-h-9 items-center justify-center">
          <h2
            id="contact-title"
            className="px-10 text-center text-xl font-bold tracking-tight sm:px-12 sm:text-2xl"
          >
            {quote ? 'Уточнимо розрахунок' : 'Отримати консультацію'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="bg-soft hover:bg-line absolute top-1/2 right-0 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>
        <p className="text-ink-3 mt-3 text-center text-sm leading-5 text-balance">
          {quote
            ? 'Залиште контакти — менеджер перевірить документи та код УКТЗЕД і уточнить суму платежів.'
            : "Залиште контакти — менеджер зв'яжеться з вами і підбере оптимальне рішення для вашого вантажу."}
        </p>
        {quote && (
          <div className="bg-soft mt-5 rounded-2xl p-4">
            <p className="text-ink-3 text-xs font-semibold tracking-wide uppercase">
              Ваш розрахунок
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{formatMoney(quote.total)}</p>
            <div className="text-ink-3 mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span>Код УКТ ЗЕД: {quote.productCode}</span>
              <span>Вага: {quote.weightKg.toLocaleString('uk-UA')} кг</span>
            </div>
          </div>
        )}
        <form className={quote ? 'mt-2 sm:mt-4' : 'mt-5'} onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div>
              <label htmlFor="firstName" className="field-label">
                Ім'я
              </label>
              <input
                ref={firstInputRef}
                id="firstName"
                className="field-control"
                required
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                placeholder="Ваше ім'я"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="field-label">
                Прізвище
              </label>
              <input
                id="lastName"
                className="field-control"
                required
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                placeholder="Ваше прізвище"
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-5">
            <label htmlFor="phone" className="field-label">
              Телефон
            </label>
            <input
              id="phone"
              className="field-control"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(phoneError)}
              aria-describedby={phoneError ? 'phone-error' : undefined}
              value={form.phone}
              onChange={(event) => {
                const phone = formatPhone(event.target.value);
                setForm({ ...form, phone });
                if (ukrainianMobilePattern.test(normalizedPhone(phone))) setPhoneError('');
              }}
              onBlur={() => {
                if (form.phone && !ukrainianMobilePattern.test(normalizedPhone(form.phone))) {
                  setPhoneError('Вкажіть номер у форматі +380 XX XXX XX XX');
                }
              }}
              placeholder="+380 50 123 45 67"
            />
            {phoneError && (
              <p id="phone-error" className="mt-2 text-sm text-[#b42318]" role="alert">
                {phoneError}
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-5">
            <label htmlFor="email" className="field-label">
              Email <span className="text-ink-3 font-normal">(необов'язково)</span>
            </label>
            <input
              id="email"
              className="field-control"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" icon={Send} disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Надсилаємо…' : quote ? 'Уточнити розрахунок' : 'Замовити консультацію'}
          </Button>
          <p className="text-ink-3 mt-4 text-center text-xs leading-5 text-balance">
            Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних.
          </p>
          <p
            aria-live="polite"
            className={`rounded-lg border-l-2 px-3 py-2 text-sm ${
              status
                ? `mt-3 ${submissionSucceeded ? 'border-[#1d9e75] bg-[#e1f5ee] text-[#085041]' : 'border-[#d85a30] bg-[#faece7] text-[#712b13]'}`
                : 'sr-only'
            }`}
          >
            {status}
          </p>
        </form>
      </div>
    </div>
  );
}
