import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export interface Profile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country?: string;
  website?: string;
  logo?: string;
  bank?: {
    accountName: string;
    accountNumber: string;
    iban: string;
    bankName: string;
  };
  currency?: string;
  terms?: string;
  template?: string;
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profiles: [] as Profile[],
    activeProfileId: localStorage.getItem('activeProfileId') as string | null,
    loading: false,
    error: null as string | null
  }),
  actions: {
    setActiveProfile(id: string) {
      this.activeProfileId = id;
      localStorage.setItem('activeProfileId', id);
    },
    
    async fetchProfiles() {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase.from('company_profiles').select('*');
        if (error) throw error;
        this.profiles = data || [];
        
        if (this.profiles.length > 0 && !this.activeProfileId) {
          this.setActiveProfile(this.profiles[0].id as string);
        } else if (this.profiles.length > 0 && this.activeProfileId) {
          const exists = this.profiles.find(p => p.id === this.activeProfileId);
          if (!exists) this.setActiveProfile(this.profiles[0].id as string);
        }
        
        return data;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch profiles';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    },
    
    async createProfile(payload: Omit<Profile, 'id'>) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase.from('company_profiles').insert([payload]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          this.profiles.push(data[0]);
          if (!this.activeProfileId) {
            this.setActiveProfile(data[0].id);
          }
          return data[0];
        }
        return null;
      } catch (err: any) {
        this.error = err.message || 'Failed to create profile';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    },
    
    async patchProfile(id: string, payload: Partial<Profile>) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase.from('company_profiles').update(payload).eq('id', id).select();
        if (error) throw error;
        if (data && data.length > 0) {
          const index = this.profiles.findIndex(p => p.id === id);
          if (index !== -1) {
            this.profiles.splice(index, 1, data[0]);
          }
          return data[0];
        }
        return null;
      } catch (err: any) {
        this.error = err.message || 'Failed to patch profile';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    },
    
    async deleteProfile(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const { error } = await supabase.from('company_profiles').delete().eq('id', id);
        if (error) throw error;
        this.profiles = this.profiles.filter(p => p.id !== id);
        if (this.activeProfileId === id) {
          this.activeProfileId = this.profiles.length > 0 ? (this.profiles[0].id as string) : null;
          if (this.activeProfileId) {
            localStorage.setItem('activeProfileId', this.activeProfileId);
          } else {
            localStorage.removeItem('activeProfileId');
          }
        }
        return true;
      } catch (err: any) {
        this.error = err.message || 'Failed to delete profile';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    }
  },
  getters: {
    getProfileById: (state) => (id: string) => state.profiles.find(p => p.id === id),
    hasProfiles: (state) => state.profiles.length > 0
  }
});
