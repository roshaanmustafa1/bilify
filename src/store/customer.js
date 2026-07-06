import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    loading: false,
    error: null
  }),
  actions: {
    fetchCustomers() {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('customers')
        .select('*')
        .then(({ data, error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          this.customers = data || [];
          return data;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to fetch customers';
          return Promise.reject(err);
        });
    },
    
    addCustomer(payload) {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('customers')
        .insert([payload])
        .select()
        .then(({ data, error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          if (data && data.length > 0) {
            this.customers.push(data[0]);
            return data[0];
          }
          return null;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to create customer';
          return Promise.reject(err);
        });
    },
    
    updateCustomer(id, payload) {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('customers')
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
            const index = this.customers.findIndex(c => c.id === id);
            if (index !== -1) {
              this.customers.splice(index, 1, data[0]);
            }
            return data[0];
          }
          return null;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to update customer';
          return Promise.reject(err);
        });
    },
    
    deleteCustomer(id) {
      this.loading = true;
      this.error = null;
      
      return supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          this.loading = false;
          if (error) {
            this.error = error.message;
            return Promise.reject(error);
          }
          this.customers = this.customers.filter(c => c.id !== id);
          return true;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message || 'Failed to delete customer';
          return Promise.reject(err);
        });
    }
  },
  getters: {
    getCustomerById: (state) => (id) => state.customers.find(c => c.id === id),
    totalCustomers: (state) => state.customers.length
  }
});
