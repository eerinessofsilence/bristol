export type LeadPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  source: string;
};

export type QuoteRequest = {
  productCode: string;
  weightKg: number;
  currencyRate: number;
};

export type QuoteResult = {
  productCode: string;
  weightKg: number;
  criticalPriceUsdPerKg: number;
  customsValueUsd: number;
  customsValueUah: number;
  duty: number;
  vatBase: number;
  vat: number;
  total: number;
};

export type ExchangeRateResult = {
  currency: 'USD' | 'EUR';
  rate: number;
  exchangeDate: string;
  fetchedAt: string;
  isStale: boolean;
};

export type CalculatorQuote = {
  productCode: string;
  weightKg: number;
  criticalPriceUsdPerKg: number;
  customsValueUsd: number;
  total: number;
};

export type ProductCodeCandidate = {
  code: string;
  titleUk: string;
  reasonUk: string;
  confidence: 'high' | 'medium' | 'low';
  calculatorSupported: boolean;
};

export type ProductCodeSuggestion = {
  identifiedProduct: string;
  candidates: ProductCodeCandidate[];
  needsMoreInfo: boolean;
  missingDetails: string[];
  disclaimer: string;
};
