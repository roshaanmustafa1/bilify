<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground">Create Customer</h2>
      <Button variant="outline" @click="$router.back()">Cancel</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" v-model="form.name" placeholder="John Doe" required />
            </div>
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="form.email" placeholder="john@example.com" />
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone</Label>
              <Input id="phone" v-model="form.phone" placeholder="+1 234 567 8900" />
            </div>
            <div class="space-y-2">
              <Label for="company">Company</Label>
              <Input id="company" v-model="form.company" placeholder="Acme Corp" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="address">Address</Label>
            <Textarea id="address" v-model="form.address" placeholder="123 Main St, City, Country" rows="3" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="country">Country</Label>
              <Input id="country" v-model="form.country" placeholder="United States" />
            </div>
            <div class="space-y-2">
              <Label for="projectName">Project Name</Label>
              <Input id="projectName" v-model="form.projectName" placeholder="Website Redesign" />
            </div>
          </div>

          <div v-if="error" class="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {{ error }}
          </div>

          <div class="pt-4 flex justify-end">
            <Button type="submit" :disabled="loading" class="w-full md:w-auto">
              <span v-if="loading">Creating...</span>
              <span v-else>Create Customer</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCustomerStore } from '../../store/customer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

export default {
  name: 'CreateCustomer',
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Label,
    Input,
    Textarea,
    Button
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        country: '',
        projectName: ''
      }
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['loading', 'error'])
  },
  methods: {
    ...mapActions(useCustomerStore, ['addCustomer']),
    
    submitForm() {
      if (!this.form.name) return;

      this.addCustomer(this.form)
        .then(() => {
          this.$router.push('/customers');
        })
        .catch((err) => {
          console.error('Failed to create customer:', err);
        });
    }
  }
};
</script>
