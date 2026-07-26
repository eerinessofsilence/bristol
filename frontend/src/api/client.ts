import type {
  ExchangeRateResult,
  LeadPayload,
  ProductCodeSuggestion,
  QuoteRequest,
  QuoteResult,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const detail = response.status === 413
      ? 'Фото завеликі для завантаження. Додайте до трьох фото, не більше 10 МБ кожне.'
      : typeof payload === 'object' &&
          payload !== null &&
          'detail' in payload &&
          typeof payload.detail === 'string'
        ? payload.detail
        : 'Не вдалося виконати запит. Спробуйте ще раз.';
    throw new ApiError(detail, response.status);
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
      product_code: payload.productCode,
      weight_kg: payload.weightKg,
      currency_rate: payload.currencyRate,
    }),
  });
}

export function getUsdExchangeRate() {
  return request<ExchangeRateResult>('/api/v1/exchange-rates/usd');
}

export function getEurExchangeRate() {
  return request<ExchangeRateResult>('/api/v1/exchange-rates/eur');
}

export function suggestProductCodes(images: File[], description: string) {
  const body = new FormData();
  images.forEach((image) => body.append('images', image));
  body.append('description', description);

  return request<ProductCodeSuggestion>('/api/v1/product-codes/suggest', {
    method: 'POST',
    body,
  });
}
