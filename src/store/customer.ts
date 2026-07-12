import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { useAuthStore } from './auth';

export interface Customer {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  projectName?: string;
  country?: string;
}

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [] as Customer[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    fetchCustomers() {
      this.loading = true;
      this.error = null;

      return Promise.resolve(supabase.from('customers').select('*'))
        .then(({ data, error }) => {
          if (error) throw error;
          this.customers = (data || []).map((c: any) => {
            if ('project_name' in c) {
              c.projectName = c.project_name;
            }
            return c as Customer;
          });
          return data;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to fetch customers';
          throw err;
        })
        .finally(() => { this.loading = false; });
    },

    addCustomer(payload: Omit<Customer, 'id' | 'user_id'>) {
      this.loading = true;
      this.error = null;

      const authStore = useAuthStore();
      const userId = authStore.userId;

      if (!userId) {
        this.loading = false;
        this.error = 'Not authenticated';
        return Promise.reject(new Error('Not authenticated'));
      }

      const dataToSave = { ...payload } as any;
      if ('projectName' in dataToSave) {
        dataToSave.project_name = dataToSave.projectName;
        delete dataToSave.projectName;
      }
      dataToSave.user_id = userId;

      return Promise.resolve(
        supabase.from('customers').insert([dataToSave]).select()
      )
        .then(({ data, error }) => {
          if (error) throw error;
          if (data && data.length > 0) {
            this.customers.push(data[0]);
            return data[0];
          }
          return null;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to create customer';
          throw err;
        })
        .finally(() => { this.loading = false; });
    },

    updateCustomer(id: string, payload: Partial<Customer>) {
      this.loading = true;
      this.error = null;

      const dataToUpdate = { ...payload } as any;
      if ('projectName' in dataToUpdate) {
        dataToUpdate.project_name = dataToUpdate.projectName;
        delete dataToUpdate.projectName;
      }
      delete dataToUpdate.id;
      delete dataToUpdate.user_id;

      return Promise.resolve(
        supabase.from('customers').update(dataToUpdate).eq('id', id).select()
      )
        .then(({ data, error }) => {
          if (error) throw error;
          if (data && data.length > 0) {
            const updated = data[0] as any;
            if ('project_name' in updated) {
              updated.projectName = updated.project_name;
            }
            const index = this.customers.findIndex(c => c.id === id);
            if (index !== -1) this.customers.splice(index, 1, updated as Customer);
            return updated;
          }
          return null;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to update customer';
          throw err;
        })
        .finally(() => { this.loading = false; });
    },

    deleteCustomer(id: string) {
      this.loading = true;
      this.error = null;

      return Promise.resolve(supabase.from('customers').delete().eq('id', id))
        .then(({ error }) => {
          if (error) throw error;
          this.customers = this.customers.filter(c => c.id !== id);
          return true;
        })
        .catch((err: Error) => {
          this.error = err.message || 'Failed to delete customer';
          throw err;
        })
        .finally(() => { this.loading = false; });
    }
  },
  getters: {
    getCustomerById: (state) => (id: string) => state.customers.find(c => c.id === id),
    totalCustomers: (state) => state.customers.length
  }
});
