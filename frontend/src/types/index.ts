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
