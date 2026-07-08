import { defineStore } from 'pinia'

export interface CompanySettings {
  name: string
  address: string
  country: string
  phone: string
  email: string
  website: string
  logo: string
}

export interface BankSettings {
  accountName: string
  accountNumber: string
  iban: string
  bankName: string
}


export interface AppSettings {
  currency: string
  taxRate: number
  invoicePrefix: string
  quotationPrefix: string
  terms: string
  defaultTemplate: string
}

const getDefaultCurrency = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    
    if (tz.includes('Karachi')) return 'PKR';
    if (tz.includes('Dubai')) return 'AED';
    if (tz.includes('Riyadh')) return 'SAR';
    if (tz.includes('Qatar')) return 'QAR';
    if (tz.includes('Muscat')) return 'OMR';
    if (tz.includes('Kuwait')) return 'KWD';
    if (tz.includes('Bahrain')) return 'BHD';
    
    if (tz.includes('London')) return 'GBP';
    if (tz.includes('Europe')) {
      if (tz.includes('Zurich')) return 'CHF';
      return 'EUR';
    }
    
    if (tz.includes('Calcutta') || tz.includes('Kolkata')) return 'INR';
    if (tz.includes('Singapore')) return 'SGD';
    if (tz.includes('Johannesburg')) return 'ZAR';
    if (tz.includes('Sydney') || tz.includes('Melbourne')) return 'AUD';
    if (tz.includes('Auckland')) return 'NZD';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'CAD';
    
    return 'USD';
  } catch (e) {
    return 'USD';
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    app: {
      currency: getDefaultCurrency(),
      taxRate: 0,
      invoicePrefix: 'INV-',
      quotationPrefix: 'QUO-',
      terms: 'Payment is due within 30 days. Thank you for your business!',
      defaultTemplate: 'TemplateMinimal'
    } as AppSettings
  }),
  actions: {
    updateApp(payload: Partial<AppSettings>) {
      this.app = { ...this.app, ...payload }
    }
  }
})
