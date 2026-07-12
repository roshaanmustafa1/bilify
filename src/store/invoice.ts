import { defineStore } from 'pinia'
import { Customer } from './customer'
import { CompanySettings, BankSettings } from './settings'
import { supabase } from '../services/supabase'
import { useAuthStore } from './auth'

export interface InvoiceItem {
  id: string
  name: string
  description?: string
  quantity: number
  price: number
  taxRate: number
}

export interface Invoice {
  id?: string
  user_id?: string
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
  status: 'Draft' | 'Saved' | 'Sent' | 'Paid' | 'Overdue'
  template?: string
}

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [] as Invoice[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    fetchInvoices() {
      this.loading = true
      this.error = null

      return Promise.resolve(
        supabase.from('invoices').select('*').order('created_at', { ascending: false })
      )
        .then(({ data, error }) => {
          if (error) throw error
          this.invoices = data || []
          return data
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to fetch invoices'
          throw err
        })
        .finally(() => { this.loading = false })
    },

    addInvoice(invoice: Omit<Invoice, 'id' | 'user_id'>) {
      this.loading = true
      this.error = null

      const authStore = useAuthStore()
      const userId = authStore.userId

      if (!userId) {
        this.loading = false
        this.error = 'Not authenticated'
        return Promise.reject(new Error('Not authenticated'))
      }

      const payload = { ...invoice, user_id: userId }

      return Promise.resolve(supabase.from('invoices').insert([payload]).select())
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            this.invoices.unshift(data[0])
            return data[0]
          }
          return null
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to create invoice'
          throw err
        })
        .finally(() => { this.loading = false })
    },

    updateInvoice(id: string, payload: Partial<Invoice>) {
      this.loading = true
      this.error = null

      const { user_id: _uid, ...safePayload } = payload as any

      return Promise.resolve(
        supabase.from('invoices').update(safePayload).eq('id', id).select()
      )
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            const index = this.invoices.findIndex(i => i.id === id)
            if (index !== -1) this.invoices[index] = data[0]
            return data[0]
          }
          return null
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to update invoice'
          throw err
        })
        .finally(() => { this.loading = false })
    },

    deleteInvoice(id: string) {
      this.loading = true
      this.error = null

      return Promise.resolve(supabase.from('invoices').delete().eq('id', id))
        .then(({ error }) => {
          if (error) throw error
          this.invoices = this.invoices.filter(i => i.id !== id)
          return true
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to delete invoice'
          throw err
        })
        .finally(() => { this.loading = false })
    }
  },
  getters: {
    getInvoiceById: (state) => (id: string) => state.invoices.find(i => i.id === id),
    totalInvoices: (state) => state.invoices.length,
    totalRevenue: (state) => state.invoices.reduce((sum, inv) => sum + inv.total, 0),
    recentInvoices: (state) => [...state.invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }
})
