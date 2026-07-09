import { defineStore } from 'pinia'
import { Customer } from './customer'
import { CompanySettings, BankSettings } from './settings'
import { supabase } from '../services/supabase'

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
    async fetchInvoices() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
        
        if (error) throw error
        
        this.invoices = data || []
        return data
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch invoices'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async addInvoice(invoice: Omit<Invoice, 'id'>) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .insert([invoice])
          .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
          this.invoices.push(data[0])
          return data[0]
        }
        return null
      } catch (err: any) {
        this.error = err.message || 'Failed to create invoice'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async updateInvoice(id: string, payload: Partial<Invoice>) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .update(payload)
          .eq('id', id)
          .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
          const index = this.invoices.findIndex(i => i.id === id)
          if (index !== -1) {
            this.invoices[index] = data[0]
          }
          return data[0]
        }
        return null
      } catch (err: any) {
        this.error = err.message || 'Failed to update invoice'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async deleteInvoice(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        this.invoices = this.invoices.filter(i => i.id !== id)
        return true
      } catch (err: any) {
        this.error = err.message || 'Failed to delete invoice'
        throw err
      } finally {
        this.loading = false
      }
    }
  },
  getters: {
    getInvoiceById: (state) => (id: string) => state.invoices.find(i => i.id === id),
    totalInvoices: (state) => state.invoices.length,
    totalRevenue: (state) => state.invoices.reduce((sum, inv) => sum + inv.total, 0),
    recentInvoices: (state) => [...state.invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }
})
