<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Invoices</h2>
 <Button @click="$router.push('/invoices/create')">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Create Invoice
 </Button>
 </div>

 <Card>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Invoice Number</TableHead>
 <TableHead>Customer</TableHead>
 <TableHead>Date</TableHead>
 <TableHead>Status</TableHead>
 <TableHead class="text-right">Total</TableHead>
 <TableHead class="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 <TableRow v-if="invoiceStore.invoices.length === 0">
 <TableCell colspan="6" class="text-center h-24 text-muted-foreground">
 No invoices found. Create your first invoice!
 </TableCell>
 </TableRow>
 <TableRow v-for="inv in invoiceStore.invoices" :key="inv.id">
 <TableCell class="font-medium">{{ inv.invoiceNumber }}</TableCell>
 <TableCell>{{ getCustomerName(inv.customerId) }}</TableCell>
 <TableCell>{{ inv.date }}</TableCell>
 <TableCell>
 <Badge :variant="inv.status === 'Paid' ? 'default' : inv.status === 'Draft' ? 'outline' : 'secondary'">
 {{ inv.status }}
 </Badge>
 </TableCell>
 <TableCell class="text-right">{{ formatCurrency(inv.total) }}</TableCell>
 <TableCell class="text-right space-x-2">
 <Button variant="ghost" size="icon" @click="viewInvoice(inv.id || '')">
 <Icon icon="lucide:eye" class="h-4 w-4" />
 </Button>
 <Button variant="ghost" size="icon" class="text-red-500" @click="invoiceStore.deleteInvoice(inv.id || '')">
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
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useInvoiceStore } from '../store/invoice'
import { useCustomerStore } from '../store/customer'
import { useSettingsStore } from '../store/settings'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

export default defineComponent({
 name: 'Invoices',
 components: {
 Icon, Button, Card, Badge,
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow
 },
 setup() {
 const router = useRouter()
 const invoiceStore = useInvoiceStore()
 const customerStore = useCustomerStore()
 const settingsStore = useSettingsStore()

 const getCustomerName = (id: string) => {
 const customer = customerStore.getCustomerById(id)
 return customer ? customer.name : 'Unknown'
 }

 onMounted(() => {
 invoiceStore.fetchInvoices()
 customerStore.fetchCustomers()
 })

 const formatCurrency = (val: number) => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: settingsStore.app.currency }).format(val)
 }
 
 const viewInvoice = (id: string) => {
 // For now we'll route to create but this should ideally route to a view page or open a modal.
 // We will create a view or just edit. We route to create with ID to edit.
 router.push(`/invoices/create?id=${id}`)
 }

 return {
 invoiceStore,
 getCustomerName,
 formatCurrency,
 viewInvoice
 }
 }
})
</script>
