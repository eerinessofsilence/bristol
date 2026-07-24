import type { ExchangeRateResult, LeadPayload, QuoteRequest, QuoteResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error('Не вдалося виконати запит. Спробуйте ще раз.');
  }

  return response.json() as Promise<T>;
}

export function createLead(payload: LeadPayload) {
  return request<{ id: string; message: string }>('/api/v1/leads', {
    method: 'POST',
    body: JSON.stringify({
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
      email: payload.email || null,
      source: payload.source,
    }),
  });
}

export function calculateQuote(payload: QuoteRequest) {
  return request<QuoteResult>('/api/v1/quotes/calculate', {
    method: 'POST',
    body: JSON.stringify({
      customs_value: payload.customsValue,
      currency_rate: payload.currencyRate,
      duty_rate: payload.dutyRate,
    }),
  });
}

export function getUsdExchangeRate() {
  return request<ExchangeRateResult>('/api/v1/exchange-rates/usd');
}
