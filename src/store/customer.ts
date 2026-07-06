import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export interface Customer {
  id?: string;
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
    async fetchCustomers() {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase.from('customers').select('*');
        if (error) throw error;
        this.customers = data || [];
        return data;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch customers';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    },
    
    async addCustomer(payload: Omit<Customer, 'id'>) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase.from('customers').insert([payload]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          this.customers.push(data[0]);
          return data[0];
        }
        return null;
      } catch (err: any) {
        this.error = err.message || 'Failed to create customer';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    },
    
    async updateCustomer(id: string, payload: Partial<Customer>) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase.from('customers').update(payload).eq('id', id).select();
        if (error) throw error;
        if (data && data.length > 0) {
          const index = this.customers.findIndex(c => c.id === id);
          if (index !== -1) {
            this.customers.splice(index, 1, data[0]);
          }
          return data[0];
        }
        return null;
      } catch (err: any) {
        this.error = err.message || 'Failed to update customer';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    },
    
    async deleteCustomer(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) throw error;
        this.customers = this.customers.filter(c => c.id !== id);
        return true;
      } catch (err: any) {
        this.error = err.message || 'Failed to delete customer';
        return Promise.reject(err);
      } finally {
        this.loading = false;
      }
    }
  },
  getters: {
    getCustomerById: (state) => (id: string) => state.customers.find(c => c.id === id),
    totalCustomers: (state) => state.customers.length
  }
});
