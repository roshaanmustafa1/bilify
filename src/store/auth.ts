import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    isAuthenticated: true // Set to true by default for testing as per mock backend
  }),
  actions: {
    login() {
      this.isAuthenticated = true
      this.user = { name: 'Admin User', email: 'admin@example.com' }
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
    }
  }
})
