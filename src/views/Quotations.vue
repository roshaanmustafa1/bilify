<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Quotations</h2>
 <Button @click="$router.push('/quotations/create')">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Create Quotation
 </Button>
 </div>

 <Card>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Quotation Number</TableHead>
 <TableHead>Customer</TableHead>
 <TableHead>Date</TableHead>
 <TableHead>Valid Until</TableHead>
 <TableHead>Status</TableHead>
 <TableHead class="text-right">Total</TableHead>
 <TableHead class="text-right">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 <TableRow v-if="quotationStore.quotations.length === 0">
 <TableCell colspan="7" class="text-center h-24 text-muted-foreground">
 No quotations found. Create your first quotation!
 </TableCell>
 </TableRow>
 <TableRow v-for="quo in quotationStore.quotations" :key="quo.id">
 <TableCell class="font-medium">{{ quo.quotationNumber }}</TableCell>
 <TableCell>{{ getCustomerName(quo.customerId) }}</TableCell>
 <TableCell>{{ quo.date }}</TableCell>
 <TableCell>{{ quo.validUntil }}</TableCell>
 <TableCell>
 <Badge :variant="quo.status === 'Accepted' ? 'default' : quo.status === 'Rejected' ? 'destructive' : 'outline'">
 {{ quo.status }}
 </Badge>
 </TableCell>
 <TableCell class="text-right">{{ formatCurrency(quo.total) }}</TableCell>
 <TableCell class="text-right space-x-2">
 <Button variant="ghost" size="icon" @click="viewQuotation(quo.id || '')">
 <Icon icon="lucide:eye" class="h-4 w-4" />
 </Button>
 <Button variant="ghost" size="icon" class="text-red-500" @click="quotationStore.deleteQuotation(quo.id || '')">
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
import { useQuotationStore } from '../store/quotation'
import { useCustomerStore } from '../store/customer'
import { useSettingsStore } from '../store/settings'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

export default defineComponent({
 name: 'Quotations',
 components: {
 Icon, Button, Card, Badge,
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow
 },
 setup() {
 const router = useRouter()
 const quotationStore = useQuotationStore()
 const customerStore = useCustomerStore()
 const settingsStore = useSettingsStore()

 const getCustomerName = (id: string) => {
 const customer = customerStore.getCustomerById(id)
 return customer ? customer.name : 'Unknown'
 }

 onMounted(() => {
   quotationStore.fetchQuotations()
   customerStore.fetchCustomers() // ensure customers are loaded for names
 })

 const formatCurrency = (val: number) => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: settingsStore.app.currency }).format(val)
 }
 
 const viewQuotation = (id: string) => {
 router.push(`/quotations/create?id=${id}`)
 }

 return {
 quotationStore,
 getCustomerName,
 formatCurrency,
 viewQuotation
 }
 }
})
</script>
