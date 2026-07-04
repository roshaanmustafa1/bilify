import { defineStore } from 'pinia'

export interface CompanySettings {
  name: string
  address: string
  country: string
  phone: string
  email: string
  website: string
  taxId: string
  logo: string
}

export interface BankSettings {
  accountName: string
  accountNumber: string
  iban: string
  bankName: string
}

export interface CompanyProfile {
  id: string
  name: string
  address: string
  country: string
  phone: string
  email: string
  website: string
  taxId: string
  logo: string
  bank: BankSettings
  currency?: string
  terms?: string
  template?: string
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
    profiles: [
      {
        id: 'default',
        name: 'Smart Solutions Inc.',
        address: '123 Tech Lane, Silicon Valley, CA 94025',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'hello@smartsolutions.com',
        website: 'www.smartsolutions.com',
        taxId: 'US-987654321',
        logo: '',
        bank: {
          accountName: 'Smart Solutions Inc.',
          accountNumber: '02110107229041',
          iban: 'PK79MEZN0002110107229041',
          bankName: 'Meezan Bank'
        },
        currency: getDefaultCurrency(),
        terms: 'Payment is due within 30 days. Thank you for your business!'
      }
    ] as CompanyProfile[],
    activeProfileId: 'default',
    app: {
      currency: getDefaultCurrency(),
      taxRate: 10,
      invoicePrefix: 'INV-',
      quotationPrefix: 'QUO-',
      terms: 'Payment is due within 30 days. Thank you for your business!',
      defaultTemplate: 'TemplateMinimal'
    } as AppSettings
  }),
  actions: {
    addProfile(profile: Omit<CompanyProfile, 'id'>) {
      const newProfile = {
        ...profile,
        id: Date.now().toString()
      }
      this.profiles.push(newProfile)
      return newProfile
    },
    updateProfile(id: string, payload: Partial<Omit<CompanyProfile, 'id'>>) {
      const index = this.profiles.findIndex(p => p.id === id)
      if (index !== -1) {
        // Handle nested bank update carefully
        const existingProfile = this.profiles[index]
        const updatedBank = payload.bank 
          ? { ...existingProfile.bank, ...payload.bank }
          : existingProfile.bank

        this.profiles[index] = { 
          ...existingProfile, 
          ...payload,
          bank: updatedBank
        }
      }
    },
    deleteProfile(id: string) {
      this.profiles = this.profiles.filter(p => p.id !== id)
      if (this.activeProfileId === id) {
        this.activeProfileId = this.profiles.length > 0 ? this.profiles[0].id : ''
      }
    },
    setActiveProfile(id: string) {
      this.activeProfileId = id
    },
    updateApp(payload: Partial<AppSettings>) {
      this.app = { ...this.app, ...payload }
    }
  }
})
