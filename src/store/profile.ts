import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { useAuthStore } from './auth';

export interface Profile {
  id?: string;
  user_id?: string;
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

    fetchProfiles() {
      this.loading = true;
      this.error = null;

      return Promise.resolve(supabase.from('company_profiles').select('*'))
        .then(({ data, error }) => {
          if (error) throw error;
          this.profiles = data || [];

          if (this.profiles.length > 0 && !this.activeProfileId) {
            this.setActiveProfile(this.profiles[0].id as string);
          } else if (this.profiles.length > 0 && this.activeProfileId) {
            const exists = this.profiles.find(p => p.id === this.activeProfileId);
            if (!exists) this.setActiveProfile(this.profiles[0].id as string);
          }

          return data;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to fetch profiles';
          throw err;
        })
        .finally(() => { this.loading = false; });
    },

    createProfile(payload: Omit<Profile, 'id' | 'user_id'>) {
      this.loading = true;
      this.error = null;

      const authStore = useAuthStore();
      const userId = authStore.userId;

      if (!userId) {
        this.loading = false;
        this.error = 'Not authenticated';
        return Promise.reject(new Error('Not authenticated'));
      }

      return Promise.resolve(
        supabase.from('company_profiles').insert([{ ...payload, user_id: userId }]).select()
      )
        .then(({ data, error }) => {
          if (error) throw error;
          if (data && data.length > 0) {
            this.profiles.push(data[0]);
            if (!this.activeProfileId) this.setActiveProfile(data[0].id);
            return data[0];
          }
          return null;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to create profile';
          throw err;
        })
        .finally(() => { this.loading = false; });
    },

    patchProfile(id: string, payload: Partial<Profile>) {
      this.loading = true;
      this.error = null;

      const { user_id: _uid, id: _pid, ...safePayload } = payload as any;

      return Promise.resolve(
        supabase.from('company_profiles').update(safePayload).eq('id', id).select()
      )
        .then(({ data, error }) => {
          if (error) throw error;
          if (data && data.length > 0) {
            const index = this.profiles.findIndex(p => p.id === id);
            if (index !== -1) this.profiles.splice(index, 1, data[0]);
            return data[0];
          }
          return null;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to patch profile';
          throw err;
        })
        .finally(() => { this.loading = false; });
    },

    deleteProfile(id: string) {
      this.loading = true;
      this.error = null;

      return Promise.resolve(supabase.from('company_profiles').delete().eq('id', id))
        .then(({ error }) => {
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
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to delete profile';
          throw err;
        })
        .finally(() => { this.loading = false; });
    }
  },
  getters: {
    getProfileById: (state) => (id: string) => state.profiles.find(p => p.id === id),
    hasProfiles: (state) => state.profiles.length > 0
  }
});
