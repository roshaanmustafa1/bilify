<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Quotations</h2>
 <Button @click="$router.push('/quotations/create')">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Create Quotation
 </Button>
 </div>

  <div v-if="quotationStore.quotations.length === 0" class="text-center py-12 text-muted-foreground border rounded-lg bg-card">
    No quotations found. Create your first quotation!
  </div>
  <div v-else class="space-y-4">
    <div
      v-for="quo in quotationStore.quotations"
      :key="quo.id"
      class="flex items-center justify-between p-4 border rounded-lg bg-card dark:border-border transition-all hover:shadow-sm"
    >
      <div class="flex items-center space-x-4">
        <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full hidden sm:block">
          <Icon icon="lucide:file-signature" class="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <p class="font-medium text-lg">{{ quo.quotationNumber }}</p>
          <p class="text-sm text-muted-foreground">
            {{ getCustomerName(quo.customerId) }} • {{ quo.date }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-6">
        <div class="text-right hidden sm:block">
          <p class="font-bold text-lg">{{ formatCurrency(quo.total) }}</p>
          <Badge :variant="quo.status === 'Accepted' ? 'default' : quo.status === 'Rejected' ? 'destructive' : 'outline'">
            {{ quo.status }}
          </Badge>
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="ghost" size="icon" @click="viewQuotation(quo.id || '')">
            <Icon icon="lucide:eye" class="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive/90 hover:bg-destructive/10" @click="quotationStore.deleteQuotation(quo.id || '')">
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
import { useQuotationStore } from '../store/quotation'
import { useCustomerStore } from '../store/customer'
import { useSettingsStore } from '../store/settings'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default defineComponent({
 name: 'Quotations',
 components: {
 Icon, Button, Card, Badge
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
