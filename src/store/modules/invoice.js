import { defineStore } from 'pinia'
import { supabase } from '../../services/supabase'

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [],
    activeInvoice: null,
    loading: false,
    error: null
  }),
  actions: {
    fetchInvoices() {
      this.loading = true
      this.error = null
      
      return supabase
        .from('invoices')
        .select('*, customer:customers(*), company:company_profiles(*)')
        .then(({ data, error }) => {
          this.loading = false
          if (error) {
            this.error = error.message
            return Promise.reject(error)
          }
          this.invoices = data || []
          return data
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to fetch invoices'
          return Promise.reject(err)
        })
    },
    fetchInvoiceById(id) {
      this.loading = true
      this.error = null
      
      return supabase
        .from('invoices')
        .select('*, items:invoice_items(*), customer:customers(*), company:company_profiles(*)')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          this.loading = false
          if (error) {
            this.error = error.message
            return Promise.reject(error)
          }
          this.activeInvoice = data
          return data
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to fetch invoice'
          return Promise.reject(err)
        })
    },
    saveInvoice(payload) {
      this.loading = true
      this.error = null
      
      const { items, ...invoiceData } = payload
      
      return supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .then(({ data: invoiceRes, error: invoiceErr }) => {
          if (invoiceErr) {
            this.loading = false
            this.error = invoiceErr.message
            return Promise.reject(invoiceErr)
          }
          
          const newInvoice = invoiceRes[0]
          
          if (items && items.length > 0) {
            const itemsData = items.map(item => ({ ...item, invoice_id: newInvoice.id }))
            return supabase
              .from('invoice_items')
              .insert(itemsData)
              .select()
              .then(({ data: itemsRes, error: itemsErr }) => {
                this.loading = false
                if (itemsErr) {
                  this.error = itemsErr.message
                  return Promise.reject(itemsErr)
                }
                newInvoice.items = itemsRes || []
                this.invoices.push(newInvoice)
                return newInvoice
              })
          } else {
            this.loading = false
            newInvoice.items = []
            this.invoices.push(newInvoice)
            return newInvoice
          }
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to save invoice'
          return Promise.reject(err)
        })
    },
    patchInvoice(id, payload) {
      this.loading = true
      this.error = null
      
      return supabase
        .from('invoices')
        .update(payload)
        .eq('id', id)
        .select()
        .then(({ data, error }) => {
          this.loading = false
          if (error) {
            this.error = error.message
            return Promise.reject(error)
          }
          if (data && data.length) {
            const index = this.invoices.findIndex(i => i.id === id)
            if (index !== -1) {
              this.invoices.splice(index, 1, { ...this.invoices[index], ...data[0] })
            }
            if (this.activeInvoice && this.activeInvoice.id === id) {
              this.activeInvoice = { ...this.activeInvoice, ...data[0] }
            }
            return data[0]
          }
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to patch invoice'
          return Promise.reject(err)
        })
    },
    deleteInvoice(id) {
      this.loading = true
      this.error = null
      
      return supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          this.loading = false
          if (error) {
            this.error = error.message
            return Promise.reject(error)
          }
          this.invoices = this.invoices.filter(i => i.id !== id)
          if (this.activeInvoice && this.activeInvoice.id === id) {
            this.activeInvoice = null
          }
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to delete invoice'
          return Promise.reject(err)
        })
    },
    resetActiveInvoice() {
      this.activeInvoice = null
      this.error = null
    }
  },
  getters: {
    getInvoiceById: state => id => state.invoices.find(i => i.id === id),
    hasInvoices: state => state.invoices.length > 0
  }
})
