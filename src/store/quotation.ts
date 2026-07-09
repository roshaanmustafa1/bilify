import { defineStore } from 'pinia'
import { Customer } from './customer'
import { CompanySettings, BankSettings } from './settings'
import { InvoiceItem } from './invoice'
import { supabase } from '../services/supabase'

export interface Quotation {
  id?: string
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
    async fetchQuotations() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('quotations')
          .select('*')
        
        if (error) throw error
        
        this.quotations = data || []
        return data
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch quotations'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async addQuotation(quotation: Omit<Quotation, 'id'>) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('quotations')
          .insert([quotation])
          .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
          this.quotations.push(data[0])
          return data[0]
        }
        return null
      } catch (err: any) {
        this.error = err.message || 'Failed to create quotation'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async updateQuotation(id: string, payload: Partial<Quotation>) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('quotations')
          .update(payload)
          .eq('id', id)
          .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
          const index = this.quotations.findIndex(q => q.id === id)
          if (index !== -1) {
            this.quotations[index] = data[0]
          }
          return data[0]
        }
        return null
      } catch (err: any) {
        this.error = err.message || 'Failed to update quotation'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async deleteQuotation(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await supabase
          .from('quotations')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        this.quotations = this.quotations.filter(q => q.id !== id)
        return true
      } catch (err: any) {
        this.error = err.message || 'Failed to delete quotation'
        throw err
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    getQuotationById: (state) => (id: string) => state.quotations.find(q => q.id === id),
    totalQuotations: (state) => state.quotations.length
  }
})
