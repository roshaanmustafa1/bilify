<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Dashboard</h2>
 <div class="space-x-3">
 <Button @click="$router.push('/invoices/create')">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> New Invoice
 </Button>
 <Button variant="outline" @click="$router.push('/quotations/create')">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> New Quotation
 </Button>
 </div>
 </div>

 <!-- Stats -->
 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatCard
 title="Total Invoices"
 :value="invoiceStore.totalInvoices"
 icon="lucide:file-text"
 color="blue"
 />
 <StatCard
 title="Total Quotations"
 :value="quotationStore.totalQuotations"
 icon="lucide:file-signature"
 color="purple"
 />
 <StatCard
 title="Total Customers"
 :value="customerStore.totalCustomers"
 icon="lucide:users"
 color="green"
 />
 <StatCard
 title="Total Revenue"
 :value="formatCurrency(invoiceStore.totalRevenue)"
 icon="lucide:dollar-sign"
 color="orange"
 />
 </div>

 <!-- Recent Activity -->
 <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
 <Card>
 <CardHeader>
 <CardTitle>Recent Invoices</CardTitle>
 </CardHeader>
 <CardContent>
 <div v-if="invoiceStore.recentInvoices.length === 0" class="text-center py-6 text-muted-foreground">
 No invoices yet.
 </div>
 <div v-else class="space-y-4">
 <div v-for="inv in invoiceStore.recentInvoices" :key="inv.id" class="flex items-center justify-between p-4 border rounded-lg dark:border-border">
 <div>
 <p class="font-medium">{{ inv.invoiceNumber }}</p>
 <p class="text-sm text-muted-foreground">{{ getCustomerName(inv.customerId) }}</p>
 </div>
 <div class="text-right">
 <p class="font-bold">{{ formatCurrency(inv.total) }}</p>
 <Badge :variant="inv.status === 'Paid' ? 'default' : 'secondary'">{{ inv.status }}</Badge>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 
 <Card>
 <CardHeader>
 <CardTitle>Quick Actions</CardTitle>
 </CardHeader>
 <CardContent>
 <div class="grid grid-cols-2 gap-4">
 <button @click="$router.push('/customers')" class="p-4 border dark:border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted dark:hover:bg-card transition-colors">
 <Icon icon="lucide:users" class="h-8 w-8 text-blue-500" />
 <span>Manage Customers</span>
 </button>
 <button @click="$router.push('/products')" class="p-4 border dark:border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted dark:hover:bg-card transition-colors">
 <Icon icon="lucide:package" class="h-8 w-8 text-green-500" />
 <span>Manage Products</span>
 </button>
 <button @click="$router.push('/settings')" class="p-4 border dark:border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted dark:hover:bg-card transition-colors">
 <Icon icon="lucide:settings" class="h-8 w-8 text-muted-foreground" />
 <span>Settings</span>
 </button>
 <button @click="openAI" class="p-4 border dark:border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
 <Icon icon="lucide:sparkles" class="h-8 w-8 text-purple-500" />
 <span>AI Assistant</span>
 </button>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '../store/invoice'
import { useQuotationStore } from '../store/quotation'
import { useCustomerStore } from '../store/customer'
import { useSettingsStore } from '../store/settings'
import StatCard from '../components/dashboard/StatCard.vue'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default defineComponent({
 name: 'Dashboard',
 components: {
 Icon,
 StatCard,
 Button,
 Card,
 CardHeader,
 CardTitle,
 CardContent,
 Badge
 },
 setup() {
 const router = useRouter()
 const invoiceStore = useInvoiceStore()
 const quotationStore = useQuotationStore()
 const customerStore = useCustomerStore()
 const settingsStore = useSettingsStore()

 const formatCurrency = (value: number) => {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency: settingsStore.app.currency
 }).format(value)
 }

 const getCustomerName = (id: string) => {
 const customer = customerStore.getCustomerById(id)
 return customer ? customer.name : 'Unknown Customer'
 }

 const openAI = () => {
 router.push('/invoices/create?ai=true')
 }

 return {
 invoiceStore,
 quotationStore,
 customerStore,
 formatCurrency,
 getCustomerName,
 openAI
 }
 }
})
</script>
