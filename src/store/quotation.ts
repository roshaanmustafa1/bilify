import { defineStore } from 'pinia'
import { Customer } from './customer'
import { CompanySettings, BankSettings } from './settings'
import { InvoiceItem } from './invoice'
import { supabase } from '../services/supabase'
import { useAuthStore } from './auth'

export interface Quotation {
  id?: string
  user_id?: string
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
  status: 'Draft' | 'Saved' | 'Sent' | 'Accepted' | 'Rejected'
  template?: string
}

export const useQuotationStore = defineStore('quotation', {
  state: () => ({
    quotations: [] as Quotation[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    fetchQuotations() {
      this.loading = true
      this.error = null

      return Promise.resolve(
        supabase.from('quotations').select('*').order('created_at', { ascending: false })
      )
        .then(({ data, error }) => {
          if (error) throw error
          this.quotations = data || []
          return data
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to fetch quotations'
          throw err
        })
        .finally(() => { this.loading = false })
    },

    addQuotation(quotation: Omit<Quotation, 'id' | 'user_id'>) {
      this.loading = true
      this.error = null

      const authStore = useAuthStore()
      const userId = authStore.userId

      if (!userId) {
        this.loading = false
        this.error = 'Not authenticated'
        return Promise.reject(new Error('Not authenticated'))
      }

      const payload = { ...quotation, user_id: userId }

      return Promise.resolve(supabase.from('quotations').insert([payload]).select())
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            this.quotations.unshift(data[0])
            return data[0]
          }
          return null
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to create quotation'
          throw err
        })
        .finally(() => { this.loading = false })
    },

    updateQuotation(id: string, payload: Partial<Quotation>) {
      this.loading = true
      this.error = null

      const { user_id: _uid, ...safePayload } = payload as any

      return Promise.resolve(
        supabase.from('quotations').update(safePayload).eq('id', id).select()
      )
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            const index = this.quotations.findIndex(q => q.id === id)
            if (index !== -1) this.quotations[index] = data[0]
            return data[0]
          }
          return null
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to update quotation'
          throw err
        })
        .finally(() => { this.loading = false })
    },

    deleteQuotation(id: string) {
      this.loading = true
      this.error = null

      return Promise.resolve(supabase.from('quotations').delete().eq('id', id))
        .then(({ error }) => {
          if (error) throw error
          this.quotations = this.quotations.filter(q => q.id !== id)
          return true
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to delete quotation'
          throw err
        })
        .finally(() => { this.loading = false })
    }
  },
  getters: {
    getQuotationById: (state) => (id: string) => state.quotations.find(q => q.id === id),
    totalQuotations: (state) => state.quotations.length
  }
})
