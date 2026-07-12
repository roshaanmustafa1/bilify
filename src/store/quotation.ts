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
          this.quotations = (data || []).map((q: any) => {
            if ('quotation_number' in q) q.quotationNumber = q.quotation_number;
            if ('project_name' in q) q.projectName = q.project_name;
            if ('valid_until' in q) q.validUntil = q.valid_until;
            if ('customer_id' in q) q.customerId = q.customer_id;
            if ('tax_total' in q) q.taxTotal = q.tax_total;
            return q as Quotation;
          })
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

      const dataToSave = { ...quotation } as any;
      if ('quotationNumber' in dataToSave) { dataToSave.quotation_number = dataToSave.quotationNumber; delete dataToSave.quotationNumber; }
      if ('projectName' in dataToSave) { dataToSave.project_name = dataToSave.projectName; delete dataToSave.projectName; }
      if ('validUntil' in dataToSave) { dataToSave.valid_until = dataToSave.validUntil; delete dataToSave.validUntil; }
      if ('customerId' in dataToSave) { dataToSave.customer_id = dataToSave.customerId; delete dataToSave.customerId; }
      if ('taxTotal' in dataToSave) { dataToSave.tax_total = dataToSave.taxTotal; delete dataToSave.taxTotal; }
      delete dataToSave.customer;
      delete dataToSave.company;
      delete dataToSave.bank;
      delete dataToSave.id;
      dataToSave.user_id = userId;

      return Promise.resolve(supabase.from('quotations').insert([dataToSave]).select())
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            const mapped = { ...data[0] } as any;
            if ('quotation_number' in mapped) mapped.quotationNumber = mapped.quotation_number;
            if ('project_name' in mapped) mapped.projectName = mapped.project_name;
            if ('valid_until' in mapped) mapped.validUntil = mapped.valid_until;
            if ('customer_id' in mapped) mapped.customerId = mapped.customer_id;
            if ('tax_total' in mapped) mapped.taxTotal = mapped.tax_total;
            this.quotations.unshift(mapped as Quotation)
            return mapped as Quotation
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

      const dataToUpdate = { ...payload } as any;
      if ('quotationNumber' in dataToUpdate) { dataToUpdate.quotation_number = dataToUpdate.quotationNumber; delete dataToUpdate.quotationNumber; }
      if ('projectName' in dataToUpdate) { dataToUpdate.project_name = dataToUpdate.projectName; delete dataToUpdate.projectName; }
      if ('validUntil' in dataToUpdate) { dataToUpdate.valid_until = dataToUpdate.validUntil; delete dataToUpdate.validUntil; }
      if ('customerId' in dataToUpdate) { dataToUpdate.customer_id = dataToUpdate.customerId; delete dataToUpdate.customerId; }
      if ('taxTotal' in dataToUpdate) { dataToUpdate.tax_total = dataToUpdate.taxTotal; delete dataToUpdate.taxTotal; }
      delete dataToUpdate.customer;
      delete dataToUpdate.company;
      delete dataToUpdate.bank;
      delete dataToUpdate.id;
      delete dataToUpdate.user_id;

      return Promise.resolve(
        supabase.from('quotations').update(dataToUpdate).eq('id', id).select()
      )
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            const mapped = { ...data[0] } as any;
            if ('quotation_number' in mapped) mapped.quotationNumber = mapped.quotation_number;
            if ('project_name' in mapped) mapped.projectName = mapped.project_name;
            if ('valid_until' in mapped) mapped.validUntil = mapped.valid_until;
            if ('customer_id' in mapped) mapped.customerId = mapped.customer_id;
            if ('tax_total' in mapped) mapped.taxTotal = mapped.tax_total;
            const index = this.quotations.findIndex(q => q.id === id)
            if (index !== -1) this.quotations[index] = mapped as Quotation
            return mapped as Quotation
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
