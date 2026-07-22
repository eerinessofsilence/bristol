import { X } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { createLead } from '../api/client';
import { Button } from './ui/Button';

type Props = {
  open: boolean;
  onClose: () => void;
};

const initialForm = { firstName: '', lastName: '', phone: '', email: '' };

export function ContactModal({ open, onClose }: Props) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) window.setTimeout(() => firstInputRef.current?.focus(), 50);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      await createLead({ ...form, source: 'website_callback' });
      setStatus(`Дякуємо, ${form.firstName}! Зателефонуємо найближчим часом.`);
      setForm(initialForm);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="bg-portway-primary/55 fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-5 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="relative my-auto w-full max-w-[520px] rounded-[22px] bg-white p-8 shadow-2xl md:px-10 md:py-11"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="bg-portway-soft hover:bg-portway-line absolute top-4 right-4 grid size-9 cursor-pointer place-items-center rounded-full transition"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
        <h2 id="contact-title" className="pr-8 text-2xl font-bold tracking-tight">
          Передзвонимо протягом 15 хвилин
        </h2>
        <p className="text-portway-ink-3 mt-3 text-sm leading-6">
          Залиште контакти — брокер зв'яжеться з вами і відповість на всі питання.
        </p>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
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
          <div className="mt-5">
            <label htmlFor="phone" className="field-label">
              Телефон
            </label>
            <input
              id="phone"
              className="field-control"
              type="tel"
              required
              minLength={7}
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="+38 (0__) ___-__-__"
            />
          </div>
          <div className="mt-5">
            <label htmlFor="email" className="field-label">
              Email <span className="text-portway-ink-3 font-normal">(необов'язково)</span>
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
          <Button type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Надсилаємо…' : 'Замовити дзвінок'}
          </Button>
          <p className="text-portway-ink-3 mt-4 text-center text-xs leading-5 text-balance">
            Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних.
          </p>
          <p aria-live="polite" className="text-portway-mint-deep mt-3 min-h-5 text-sm">
            {status}
          </p>
        </form>
      </div>
    </div>
  );
}
