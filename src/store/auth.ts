import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'

export interface AuthUser {
  id: string
  email: string | undefined
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    userId: (state): string | null => state.user?.id ?? null,
    userRole: (state): string => state.user?.role ?? 'user',
    isSuperAdmin: (state): boolean => state.user?.role === 'super_admin',
  },

  actions: {
    fetchUser(): Promise<AuthUser | null> {
      this.loading = true
      this.error = null

      return Promise.resolve(supabase.auth.getUser())
        .then(({ data, error }) => {
          if (error || !data.user) {
            this.user = null
            this.isAuthenticated = false
            return null
          }
          const authUser = data.user
          return Promise.resolve(
            supabase.from('profiles').select('role').eq('id', authUser.id).single()
          ).then(({ data: profile }) => {
            this.user = {
              id: authUser.id,
              email: authUser.email,
              role: (profile as any)?.role ?? 'user',
            }
            this.isAuthenticated = true
            return this.user
          })
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to fetch user session'
          this.user = null
          this.isAuthenticated = false
          return null
        })
        .finally(() => {
          this.loading = false
        })
    },

    login(email: string, password: string): Promise<void> {
      this.loading = true
      this.error = null

      return Promise.resolve(supabase.auth.signInWithPassword({ email, password }))
        .then(({ data, error }) => {
          if (error) throw error
          if (!data.session) throw new Error('No active session found. Please check your email for confirmation.')
          return this.fetchUser().then(() => undefined)
        })
        .catch((err: Error) => {
          if (err.message.includes('Invalid login credentials')) {
             this.error = 'Invalid email or password. If you just signed up, please check your email to confirm your account.'
          } else {
             this.error = err.message || 'Login failed'
          }
          throw new Error(this.error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    signup(email: string, password: string, fullName: string): Promise<void> {
      this.loading = true
      this.error = null

      return Promise.resolve(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
      )
        .then(({ data, error }) => {
          if (error) throw error
          
          if (!data.session) {
            // Supabase returns session as null if email confirmation is required!
            throw new Error('Signup successful! Please check your email to confirm your account before logging in.')
          }
          return this.fetchUser().then(() => undefined)
        })
        .catch((err: Error) => {
          this.error = err.message || 'Sign up failed'
          throw err
        })
        .finally(() => {
          this.loading = false
        })
    },

    logout(): Promise<void> {
      return Promise.resolve(supabase.auth.signOut())
        .then(() => {
          this.user = null
          this.isAuthenticated = false
        })
        .catch((err: Error) => {
          this.error = err.message || 'Logout failed'
        })
    },
  },
})
