import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profiles: [],
    activeProfileId: localStorage.getItem('activeProfileId') || null,
    loading: false,
    error: null
  }),
  actions: {
    setActiveProfile(id) {
      this.activeProfileId = id;
      localStorage.setItem('activeProfileId', id);
    },
    
    fetchProfiles() {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('company_profiles')
        .select('*')
        .then(({ data, error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          this.profiles = data || [];
          
          if (this.profiles.length > 0 && !this.activeProfileId) {
            this.setActiveProfile(this.profiles[0].id);
          } else if (this.profiles.length > 0 && this.activeProfileId) {
            const exists = this.profiles.find(p => p.id === this.activeProfileId);
            if (!exists) this.setActiveProfile(this.profiles[0].id);
          }
          
          return data;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to fetch profiles';
          return Promise.reject(err);
        });
    },
    
    createProfile(payload) {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('company_profiles')
        .insert([payload])
        .select()
        .then(({ data, error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          if (data && data.length > 0) {
            this.profiles.push(data[0]);
            if (!this.activeProfileId) {
              this.setActiveProfile(data[0].id);
            }
            return data[0];
          }
          return null;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to create profile';
          return Promise.reject(err);
        });
    },
    
    patchProfile(id, payload) {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('company_profiles')
        .update(payload)
        .eq('id', id)
        .select()
        .then(({ data, error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          if (data && data.length > 0) {
            const index = this.profiles.findIndex(p => p.id === id);
            if (index !== -1) {
              this.profiles.splice(index, 1, data[0]);
            }
            return data[0];
          }
          return null;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to patch profile';
          return Promise.reject(err);
        });
    },
    
    deleteProfile(id) {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('company_profiles')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          this.profiles = this.profiles.filter(p => p.id !== id);
          if (this.activeProfileId === id) {
            this.activeProfileId = this.profiles.length > 0 ? this.profiles[0].id : null;
            if (this.activeProfileId) {
              localStorage.setItem('activeProfileId', this.activeProfileId);
            } else {
              localStorage.removeItem('activeProfileId');
            }
          }
          return true;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to delete profile';
          return Promise.reject(err);
        });
    }
  },
  getters: {
    getProfileById: (state) => (id) => state.profiles.find(p => p.id === id),
    hasProfiles: (state) => state.profiles.length > 0
  }
});
