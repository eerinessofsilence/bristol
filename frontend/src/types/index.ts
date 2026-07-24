export type LeadPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  source: string;
};

export type QuoteRequest = {
  customsValue: number;
  currencyRate: number;
  dutyRate: number;
};

export type QuoteResult = {
  customsValueUah: number;
  duty: number;
  vatBase: number;
  vat: number;
  total: number;
};

export type ExchangeRateResult = {
  currency: 'USD';
  rate: number;
  exchangeDate: string;
  fetchedAt: string;
  isStale: boolean;
};

export type CalculatorQuote = {
  category: string;
  customsValue: number;
  currency: string;
  dutyRate: number;
  total: number;
};
