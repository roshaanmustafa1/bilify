import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isImpersonating: false,
    impersonatedUserId: null as string | null
  }),
  actions: {
    startImpersonating(userId: string) {
      this.isImpersonating = true
      this.impersonatedUserId = userId
      // Optional: You could persist this in localStorage if you want it to survive refreshes
      // localStorage.setItem('impersonatedUserId', userId)
    },
    stopImpersonating() {
      this.isImpersonating = false
      this.impersonatedUserId = null
      // localStorage.removeItem('impersonatedUserId')
    }
  },
  getters: {
    currentEffectiveUserId: (state) => (realUserId: string | null): string | null => {
      if (state.isImpersonating && state.impersonatedUserId) {
        return state.impersonatedUserId
      }
      return realUserId
    }
  }
})
