import { defineStore } from 'pinia'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  taxRate: number
  category: string
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[]
  }),
  actions: {
    addProduct(product: Omit<Product, 'id'>) {
      this.products.push({
        ...product,
        id: Date.now().toString()
      })
    },
    updateProduct(id: string, payload: Partial<Product>) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...payload }
      }
    },
    deleteProduct(id: string) {
      this.products = this.products.filter(p => p.id !== id)
    }
  },
  getters: {
    getProductById: (state) => (id: string) => state.products.find(p => p.id === id)
  }
})
