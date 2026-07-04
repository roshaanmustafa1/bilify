import { defineStore } from 'pinia'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  country: string
  taxId: string
}

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [] as Customer[]
  }),
  actions: {
    addCustomer(customer: Omit<Customer, 'id'>) {
      this.customers.push({
        ...customer,
        id: Date.now().toString()
      })
    },
    updateCustomer(id: string, payload: Partial<Customer>) {
      const index = this.customers.findIndex(c => c.id === id)
      if (index !== -1) {
        this.customers[index] = { ...this.customers[index], ...payload }
      }
    },
    deleteCustomer(id: string) {
      this.customers = this.customers.filter(c => c.id !== id)
    }
  },
  getters: {
    getCustomerById: (state) => (id: string) => state.customers.find(c => c.id === id),
    totalCustomers: (state) => state.customers.length
  }
})
