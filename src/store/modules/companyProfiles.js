import { defineStore } from 'pinia'
import { supabase } from '../../services/supabase'

export const useCompanyProfilesStore = defineStore('companyProfiles', {
  state: () => ({
    profiles: [],
    activeProfile: null,
    loading: false,
    error: null
  }),
  actions: {
    fetchProfiles() {
      this.loading = true
      this.error = null
      
      return supabase
        .from('company_profiles')
        .select('*')
        .then(({ data, error }) => {
          this.loading = false
          if (error) {
            this.error = error.message
            return Promise.reject(error)
          }
          this.profiles = data || []
          return data
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to fetch profiles'
          return Promise.reject(err)
        })
    },
    saveProfile(payload) {
      this.loading = true
      this.error = null
      
      return supabase
        .from('company_profiles')
        .insert([payload])
        .select()
        .then(({ data, error }) => {
          this.loading = false
          if (error) {
            this.error = error.message
            return Promise.reject(error)
          }
          if (data && data.length) {
            this.profiles.push(data[0])
            return data[0]
          }
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to save profile'
          return Promise.reject(err)
        })
    },
    patchProfile(id, payload) {
      this.loading = true
      this.error = null
      
      return supabase
        .from('company_profiles')
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
            const index = this.profiles.findIndex(p => p.id === id)
            if (index !== -1) {
              this.profiles.splice(index, 1, data[0])
            }
            if (this.activeProfile && this.activeProfile.id === id) {
              this.activeProfile = data[0]
            }
            return data[0]
          }
        })
        .catch(err => {
          this.loading = false
          this.error = err.message || 'Failed to patch profile'
          return Promise.reject(err)
        })
    }
  },
  getters: {
    getProfileById: state => id => state.profiles.find(p => p.id === id),
    hasProfiles: state => state.profiles.length > 0
  }
})
