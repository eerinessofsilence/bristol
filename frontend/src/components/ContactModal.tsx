import { X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createLead } from "../api/client";
import type { CalculatorQuote } from "../types";
import { Button } from "./ui/Button";

type Props = {
  quote: CalculatorQuote | null;
  onClose: () => void;
};

const initialForm = { firstName: "", lastName: "", phone: "", email: "" };

const formatMoney = (value: number) =>
  `${Math.round(value).toLocaleString("uk-UA")} ₴`;

export function ContactModal({ quote, onClose }: Props) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = quote ? "hidden" : "";
    if (quote) window.setTimeout(() => firstInputRef.current?.focus(), 50);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [quote, onClose]);

  if (!quote) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      await createLead({ ...form, source: "calculator_quote" });
      setStatus(`Дякуємо, ${form.firstName}! Зателефонуємо найближчим часом.`);
      setForm(initialForm);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Сталася помилка. Спробуйте ще раз.",
      );
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
        <div className="relative flex min-h-9 items-center justify-center">
          <h2
            id="contact-title"
            className="px-12 text-center text-2xl font-bold tracking-tight"
          >
            Уточнимо розрахунок
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="bg-portway-soft hover:bg-portway-line absolute top-1/2 right-0 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>
        <p className="text-portway-ink-3 mt-3 text-sm leading-6">
          Ви вже зробили попередній розрахунок. Залиште контакти — менеджер
          перевірить документи та код УКТЗЕД і уточнить суму платежів.
        </p>
        <div className="bg-portway-soft mt-5 rounded-2xl p-4">
          <p className="text-portway-ink-3 text-xs font-semibold tracking-wide uppercase">
            Ваш розрахунок
          </p>
          <p className="mt-2 text-sm font-semibold">{quote.category}</p>
          <div className="text-portway-ink-3 mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span>
              Митна вартість: {quote.customsValue.toLocaleString("uk-UA")} {quote.currency}
            </span>
            <span>Платежі: {formatMoney(quote.total)}</span>
          </div>
        </div>
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
                onChange={(event) =>
                  setForm({ ...form, firstName: event.target.value })
                }
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
                onChange={(event) =>
                  setForm({ ...form, lastName: event.target.value })
                }
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
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              placeholder="+38 (0__) ___-__-__"
            />
          </div>
          <div className="mt-5">
            <label htmlFor="email" className="field-label">
              Email{" "}
              <span className="text-portway-ink-3 font-normal">
                (необов'язково)
              </span>
            </label>
            <input
              id="email"
              className="field-control"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? "Надсилаємо…" : "Уточнити розрахунок"}
          </Button>
          <p className="text-portway-ink-3 mt-4 text-center text-xs leading-5 text-balance">
            Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних.
          </p>
          <p
            aria-live="polite"
            className={`text-portway-mint-deep text-sm ${status ? "mt-3" : "sr-only"}`}
          >
            {status}
          </p>
        </form>
      </div>
    </div>
  );
}
