import { defineStore } from 'pinia'
import { Customer } from './customer'
import { CompanySettings, BankSettings } from './settings'
import { InvoiceItem } from './invoice'

export interface Quotation {
  id: string
  quotationNumber: string
  projectName?: string
  date: string
  validUntil: string
  customerId: string
  customer?: Customer
  company?: CompanySettings
  bank?: BankSettings
  currency?: string
  items: InvoiceItem[]
  subtotal: number
  taxTotal: number
  discount: number
  total: number
  notes: string
  terms: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected'
}

export const useQuotationStore = defineStore('quotation', {
  state: () => ({
    quotations: [] as Quotation[]
  }),
  actions: {
    addQuotation(quotation: Omit<Quotation, 'id'>) {
      this.quotations.push({
        ...quotation,
        id: Date.now().toString()
      })
    },
    updateQuotation(id: string, payload: Partial<Quotation>) {
      const index = this.quotations.findIndex(q => q.id === id)
      if (index !== -1) {
        this.quotations[index] = { ...this.quotations[index], ...payload }
      }
    },
    deleteQuotation(id: string) {
      this.quotations = this.quotations.filter(q => q.id !== id)
    }
  },
  getters: {
    getQuotationById: (state) => (id: string) => state.quotations.find(q => q.id === id),
    totalQuotations: (state) => state.quotations.length
  }
})
