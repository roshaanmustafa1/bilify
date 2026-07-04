import { defineStore } from 'pinia'
import { Customer } from './customer'
import { CompanySettings, BankSettings } from './settings'

export interface InvoiceItem {
  id: string
  name: string
  description?: string
  quantity: number
  price: number
  taxRate: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  projectName?: string
  date: string
  dueDate: string
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
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
}

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [] as Invoice[]
  }),
  actions: {
    addInvoice(invoice: Omit<Invoice, 'id'>) {
      this.invoices.push({
        ...invoice,
        id: Date.now().toString()
      })
    },
    updateInvoice(id: string, payload: Partial<Invoice>) {
      const index = this.invoices.findIndex(i => i.id === id)
      if (index !== -1) {
        this.invoices[index] = { ...this.invoices[index], ...payload }
      }
    },
    deleteInvoice(id: string) {
      this.invoices = this.invoices.filter(i => i.id !== id)
    }
  },
  getters: {
    getInvoiceById: (state) => (id: string) => state.invoices.find(i => i.id === id),
    totalInvoices: (state) => state.invoices.length,
    totalRevenue: (state) => state.invoices.reduce((sum, inv) => sum + inv.total, 0),
    recentInvoices: (state) => [...state.invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }
})
