<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Customers</h2>
        <p class="text-muted-foreground md:hidden mt-1">Manage your customers</p>
      </div>
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger asChild>
          <Button class="w-full md:w-auto">
            <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{{
              editingId ? "Edit Customer" : "Add Customer"
            }}</DialogTitle>
          </DialogHeader>
          <div class="py-2">
            <Card>
              <CardContent class="grid gap-4 pt-6">
                <div class="space-y-2">
                  <Label for="name" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Name</Label>
                  <Input id="name" v-model="form.name" placeholder="John Doe" />
                </div>
                <div class="space-y-2">
                  <Label for="company" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Company</Label>
                  <Input
                id="company"
                v-model="form.company"
                placeholder="Acme Corp"
              />
                </div>
                <div class="space-y-2">
                  <Label for="email" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Email</Label>
                  <Input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="john@example.com"
              />
                </div>
                <div class="space-y-2">
                  <Label for="phone" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Phone</Label>
                  <Input
                id="phone"
                v-model="form.phone"
                placeholder="+1 234 567 890"
              />
                </div>
                <div class="space-y-2">
                  <Label for="address" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Address</Label>
                  <Textarea
                id="address"
                v-model="form.address"
                placeholder="123 Main St..."
              />
                </div>
                <div class="space-y-2">
                  <Label for="country" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Country</Label>
                  <Input
                id="country"
                v-model="form.country"
                placeholder="United Arab Emirates"
              />
                </div>
                <div class="space-y-2">
                  <Label for="projectName" class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Project Name</Label>
                  <Input
                id="projectName"
                v-model="form.projectName"
                placeholder="Website Redesign"
              />
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button @click="saveCustomer">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  <div v-if="customerStore.customers.length === 0" class="text-center py-12 text-muted-foreground border rounded-lg bg-card">
    No customers found. Add your first customer!
  </div>
  <div v-else class="space-y-4">
    <div
      v-for="customer in customerStore.customers"
      :key="customer.id"
      class="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl md:rounded-lg bg-card dark:border-border transition-all hover:shadow-sm gap-4 md:gap-0"
    >
      <div class="flex items-center space-x-4">
        <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full md:bg-green-50 md:dark:bg-green-900/20">
          <Icon icon="lucide:users" class="h-6 w-6 text-green-600 dark:text-green-400 md:text-green-500" />
        </div>
        <div>
          <p class="font-medium text-lg text-foreground">{{ customer.name }}</p>
          <p class="text-sm text-muted-foreground">
            {{ customer.company || 'No Company' }} • {{ customer.email }}
          </p>
        </div>
      </div>
      <div class="flex items-center justify-between md:justify-end md:space-x-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-border">
        <div class="flex flex-col md:items-end gap-1 md:gap-0 text-left md:text-right">
          <p class="font-medium text-foreground">{{ customer.phone || 'No Phone' }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="ghost" size="icon" @click="editCustomer(customer)">
            <Icon icon="lucide:edit" class="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive/90 hover:bg-destructive/10" @click="customerStore.deleteCustomer(customer.id || '')">
            <Icon icon="lucide:trash" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useCustomerStore, Customer } from "../store/customer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";

export default defineComponent({
  name: "Customers",
  components: {
    Icon,
    Button,
    Input,
    Label,
    Textarea,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  },
  setup() {
    const customerStore = useCustomerStore();
    const isDialogOpen = ref(false);
    const editingId = ref<string | null>(null);

    onMounted(() => {
      customerStore.fetchCustomers();
    });

    const initialForm = {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      country: "",

      projectName: "",
    };
    const form = reactive({ ...initialForm });

    const resetForm = () => {
      Object.assign(form, initialForm);
      editingId.value = null;
    };

    const editCustomer = (customer: Customer) => {
      Object.assign(form, customer);
      editingId.value = customer.id || null;
      isDialogOpen.value = true;
    };

    const saveCustomer = async () => {
      if (editingId.value) {
        await customerStore.updateCustomer(editingId.value, form);
      } else {
        await customerStore.addCustomer(form);
      }
      isDialogOpen.value = false;
      resetForm();
    };

    return {
      customerStore,
      isDialogOpen,
      editingId,
      form,
      editCustomer,
      saveCustomer,
    };
  },
});
</script>
