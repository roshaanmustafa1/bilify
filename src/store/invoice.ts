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
          this.invoices = (data || []).map((inv: any) => {
            if ('invoice_number' in inv) inv.invoiceNumber = inv.invoice_number;
            if ('project_name' in inv) inv.projectName = inv.project_name;
            if ('due_date' in inv) inv.dueDate = inv.due_date;
            if ('customer_id' in inv) inv.customerId = inv.customer_id;
            if ('tax_total' in inv) inv.taxTotal = inv.tax_total;
            return inv as Invoice;
          })
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

      const dataToSave = { ...invoice } as any;
      if ('invoiceNumber' in dataToSave) { dataToSave.invoice_number = dataToSave.invoiceNumber; delete dataToSave.invoiceNumber; }
      if ('projectName' in dataToSave) { dataToSave.project_name = dataToSave.projectName; delete dataToSave.projectName; }
      if ('dueDate' in dataToSave) { dataToSave.due_date = dataToSave.dueDate; delete dataToSave.dueDate; }
      if ('customerId' in dataToSave) { dataToSave.customer_id = dataToSave.customerId; delete dataToSave.customerId; }
      if ('taxTotal' in dataToSave) { dataToSave.tax_total = dataToSave.taxTotal; delete dataToSave.taxTotal; }
      delete dataToSave.customer;
      delete dataToSave.company;
      delete dataToSave.bank;
      delete dataToSave.id;
      dataToSave.user_id = userId;

      return Promise.resolve(supabase.from('invoices').insert([dataToSave]).select())
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            const mapped = { ...data[0] } as any;
            if ('invoice_number' in mapped) mapped.invoiceNumber = mapped.invoice_number;
            if ('project_name' in mapped) mapped.projectName = mapped.project_name;
            if ('due_date' in mapped) mapped.dueDate = mapped.due_date;
            if ('customer_id' in mapped) mapped.customerId = mapped.customer_id;
            if ('tax_total' in mapped) mapped.taxTotal = mapped.tax_total;
            this.invoices.unshift(mapped as Invoice)
            return mapped as Invoice
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

      const dataToUpdate = { ...payload } as any;
      if ('invoiceNumber' in dataToUpdate) { dataToUpdate.invoice_number = dataToUpdate.invoiceNumber; delete dataToUpdate.invoiceNumber; }
      if ('projectName' in dataToUpdate) { dataToUpdate.project_name = dataToUpdate.projectName; delete dataToUpdate.projectName; }
      if ('dueDate' in dataToUpdate) { dataToUpdate.due_date = dataToUpdate.dueDate; delete dataToUpdate.dueDate; }
      if ('customerId' in dataToUpdate) { dataToUpdate.customer_id = dataToUpdate.customerId; delete dataToUpdate.customerId; }
      if ('taxTotal' in dataToUpdate) { dataToUpdate.tax_total = dataToUpdate.taxTotal; delete dataToUpdate.taxTotal; }
      delete dataToUpdate.customer;
      delete dataToUpdate.company;
      delete dataToUpdate.bank;
      delete dataToUpdate.id;
      delete dataToUpdate.user_id;

      return Promise.resolve(
        supabase.from('invoices').update(dataToUpdate).eq('id', id).select()
      )
        .then(({ data, error }) => {
          if (error) throw error
          if (data && data.length > 0) {
            const mapped = { ...data[0] } as any;
            if ('invoice_number' in mapped) mapped.invoiceNumber = mapped.invoice_number;
            if ('project_name' in mapped) mapped.projectName = mapped.project_name;
            if ('due_date' in mapped) mapped.dueDate = mapped.due_date;
            if ('customer_id' in mapped) mapped.customerId = mapped.customer_id;
            if ('tax_total' in mapped) mapped.taxTotal = mapped.tax_total;
            const index = this.invoices.findIndex(i => i.id === id)
            if (index !== -1) this.invoices[index] = mapped as Invoice
            return mapped as Invoice
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
