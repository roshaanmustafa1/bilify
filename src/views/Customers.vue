<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Customers</h2>
 <Dialog v-model:open="isDialogOpen">
 <DialogTrigger asChild>
 <Button>
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Add Customer
 </Button>
 </DialogTrigger>
 <DialogContent class="sm:max-w-[425px]">
 <DialogHeader>
 <DialogTitle>{{ editingId ? 'Edit Customer' : 'Add Customer' }}</DialogTitle>
 </DialogHeader>
 <div class="grid gap-4 py-4">
 <div class="grid gap-2">
 <Label for="name">Name</Label>
 <Input id="name" v-model="form.name" placeholder="John Doe" />
 </div>
 <div class="grid gap-2">
 <Label for="company">Company</Label>
 <Input id="company" v-model="form.company" placeholder="Acme Corp" />
 </div>
 <div class="grid gap-2">
 <Label for="email">Email</Label>
 <Input id="email" type="email" v-model="form.email" placeholder="john@example.com" />
 </div>
 <div class="grid gap-2">
 <Label for="phone">Phone</Label>
 <Input id="phone" v-model="form.phone" placeholder="+1 234 567 890" />
 </div>
 <div class="grid gap-2">
 <Label for="address">Address</Label>
 <Textarea id="address" v-model="form.address" placeholder="123 Main St..." />
 </div>
 <div class="grid gap-2">
 <Label for="country">Country</Label>
 <Input id="country" v-model="form.country" placeholder="United Arab Emirates" />
 </div>
 </div>
 <DialogFooter>
 <Button @click="saveCustomer">Save</Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>

 <Card>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Name</TableHead>
 <TableHead>Company</TableHead>
 <TableHead>Email</TableHead>
 <TableHead>Phone</TableHead>
 <TableHead class="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 <TableRow v-if="customerStore.customers.length === 0">
 <TableCell colspan="5" class="text-center h-24 text-muted-foreground">
 No customers found. Add your first customer!
 </TableCell>
 </TableRow>
 <TableRow v-for="customer in customerStore.customers" :key="customer.id">
 <TableCell class="font-medium">{{ customer.name }}</TableCell>
 <TableCell>{{ customer.company }}</TableCell>
 <TableCell>{{ customer.email }}</TableCell>
 <TableCell>{{ customer.phone }}</TableCell>
 <TableCell class="text-right space-x-2">
 <Button variant="ghost" size="icon" @click="editCustomer(customer)">
 <Icon icon="lucide:edit" class="h-4 w-4" />
 </Button>
 <Button variant="ghost" size="icon" class="text-red-500" @click="customerStore.deleteCustomer(customer.id)">
 <Icon icon="lucide:trash" class="h-4 w-4" />
 </Button>
 </TableCell>
 </TableRow>
 </TableBody>
 </Table>
 </Card>
 </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useCustomerStore, Customer } from '../store/customer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Card } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog'

export default defineComponent({
 name: 'Customers',
 components: {
 Icon, Button, Input, Label, Textarea, Card,
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
 Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
 },
 setup() {
 const customerStore = useCustomerStore()
 const isDialogOpen = ref(false)
 const editingId = ref<string | null>(null)
 
 const initialForm = {
 name: '', email: '', phone: '', company: '', address: '', country: '', taxId: ''
 }
 const form = reactive({ ...initialForm })

 const resetForm = () => {
 Object.assign(form, initialForm)
 editingId.value = null
 }

 const editCustomer = (customer: Customer) => {
 Object.assign(form, customer)
 editingId.value = customer.id
 isDialogOpen.value = true
 }

 const saveCustomer = () => {
 if (editingId.value) {
 customerStore.updateCustomer(editingId.value, form)
 } else {
 customerStore.addCustomer(form)
 }
 isDialogOpen.value = false
 resetForm()
 }

 return {
 customerStore,
 isDialogOpen,
 editingId,
 form,
 editCustomer,
 saveCustomer
 }
 }
})
</script>
