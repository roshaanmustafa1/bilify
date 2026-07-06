<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Invoices</h2>
 <Button @click="$router.push('/invoices/create')">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Create Invoice
 </Button>
 </div>

  <div v-if="invoiceStore.invoices.length === 0" class="text-center py-12 text-muted-foreground border rounded-lg bg-card">
    No invoices found. Create your first invoice!
  </div>
  <div v-else class="space-y-4">
    <div
      v-for="inv in invoiceStore.invoices"
      :key="inv.id"
      class="flex items-center justify-between p-4 border rounded-lg bg-card dark:border-border transition-all hover:shadow-sm"
    >
      <div class="flex items-center space-x-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full hidden sm:block">
          <Icon icon="lucide:file-text" class="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p class="font-medium text-lg">{{ inv.invoiceNumber }}</p>
          <p class="text-sm text-muted-foreground">
            {{ getCustomerName(inv.customerId) }} • {{ inv.date }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-6">
        <div class="text-right hidden sm:block">
          <p class="font-bold text-lg">{{ formatCurrency(inv.total) }}</p>
          <Badge :variant="inv.status === 'Paid' ? 'default' : inv.status === 'Draft' ? 'outline' : 'secondary'">
            {{ inv.status }}
          </Badge>
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="ghost" size="icon" @click="viewInvoice(inv.id || '')">
            <Icon icon="lucide:eye" class="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive/90 hover:bg-destructive/10" @click="invoiceStore.deleteInvoice(inv.id || '')">
            <Icon icon="lucide:trash" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
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

export default defineComponent({
 name: 'Invoices',
 components: {
 Icon, Button, Card, Badge
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
