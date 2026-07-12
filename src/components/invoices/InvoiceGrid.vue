<template>
  <div class="space-y-4">
    <div class="border rounded-lg bg-card overflow-x-auto shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="text-[10px] uppercase text-muted-foreground bg-muted/30">
          <tr class="border-b bg-accent">
            <th 
              v-for="col in store.invoiceColumns" 
              :key="col.id" 
              class="px-4 py-3 font-semibold tracking-wider relative whitespace-nowrap"
            >
              <div class="flex items-center gap-1 relative">
                <!-- Add Column Button before QTY -->
                <button
                  v-if="col.id === 'qty' && store.customColumnsCount < 2"
                  @click="openAddColumnDialog(col.id)"
                  class="absolute -left-6 w-5 h-5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors shadow-sm"
                  title="Add Custom Column Here"
                >
                  <Icon icon="lucide:plus" class="w-3 h-3" />
                </button>
                
                {{ col.label }}
                <button 
                  v-if="col.isCustom" 
                  @click="store.removeColumn(col.id)"
                  class="ml-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Icon icon="lucide:x" class="w-3 h-3" />
                </button>
              </div>
            </th>
            <th class="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/40">
          <tr v-for="(item, index) in store.computedLineItems" :key="item.id" class="hover:bg-muted/10 transition-colors">
            <td v-for="col in store.invoiceColumns" :key="col.id" class="px-4 py-2">
              <template v-if="col.id === 'name'">
                <Input v-model="store.lineItems[index].name" class="h-8 min-w-[200px] bg-background shadow-sm border-muted-foreground/20" placeholder="Item Name / Description" />
              </template>
              <template v-else-if="col.id === 'qty'">
                <Input type="number" v-model.number="store.lineItems[index].qty" class="h-8 w-24 bg-background shadow-sm border-muted-foreground/20" />
              </template>
              <template v-else-if="col.id === 'price'">
                <Input type="number" v-model.number="store.lineItems[index].price" class="h-8 w-32 bg-background shadow-sm border-muted-foreground/20" />
              </template>
              <template v-else-if="col.id === 'rowTotal'">
                <div class="font-semibold px-2 py-1 whitespace-nowrap">{{ formatCurrency(item.rowTotal) }}</div>
              </template>
              <template v-else>
                <!-- Custom Columns -->
                <template v-if="col.type === 'text'">
                  <Input v-model="store.lineItems[index].customData[col.id]" class="h-8 min-w-[120px] bg-background shadow-sm border-muted-foreground/20" placeholder="Text..." />
                </template>
                <template v-else-if="col.type === 'numeric'">
                  <Input type="number" v-model.number="store.lineItems[index].customData[col.id]" class="h-8 w-24 bg-background shadow-sm border-muted-foreground/20" />
                </template>
                <template v-else-if="col.type === 'formula'">
                  <div class="font-semibold px-2 py-1 bg-muted/50 rounded inline-block shadow-inner whitespace-nowrap">{{ formatCurrency(item[col.id]) }}</div>
                </template>
              </template>
            </td>
            <td class="px-4 py-2 text-right">
              <Button variant="ghost" size="icon" @click="store.removeLineItem(index)" class="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Icon icon="lucide:trash-2" class="h-4 w-4" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="flex">
      <Button variant="outline" size="sm" @click="store.addLineItem" class="shadow-sm">
        <Icon icon="lucide:plus" class="mr-1 h-4 w-4" /> Add Line Item
      </Button>
    </div>

    <!-- Add Column Dialog -->
    <Dialog v-model:open="isAddColumnOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Column</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label>Column Name</Label>
            <Input v-model="newColumn.label" placeholder="e.g. Weight, Serial No..." />
          </div>
          <div class="space-y-2">
            <Label>Column Type</Label>
            <Select v-model="newColumn.type">
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text (e.g., Remarks, Details)</SelectItem>
                <SelectItem value="numeric">Numeric (e.g., Weight, Fee)</SelectItem>
                <SelectItem value="formula">Formula (Multiply/Add)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div v-if="newColumn.type === 'formula'" class="space-y-4 p-4 border rounded-xl bg-muted/30">
            <h4 class="text-xs font-semibold uppercase text-muted-foreground">Formula Configuration</h4>
            <div class="grid grid-cols-3 gap-2 items-center">
              <Select v-model="newColumn.formulaConfig.operand1">
                <SelectTrigger><SelectValue placeholder="Col 1" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in numericColumns" :key="c.id" :value="c.id">{{ c.label }}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select v-model="newColumn.formulaConfig.operator">
                <SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="+">Add (+)</SelectItem>
                  <SelectItem value="*">Multiply (*)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select v-model="newColumn.formulaConfig.operand2">
                <SelectTrigger><SelectValue placeholder="Col 2" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="c in numericColumns" :key="c.id" :value="c.id">{{ c.label }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isAddColumnOpen = false">Cancel</Button>
          <Button @click="confirmAddColumn" :disabled="!newColumn.label || (newColumn.type === 'formula' && (!newColumn.formulaConfig.operand1 || !newColumn.formulaConfig.operand2))">Add Column</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { v4 as uuidv4 } from 'uuid'
import { useInvoiceBuilderStore, ColumnType } from '../../store/invoiceBuilder'
import { useSettingsStore } from '../../store/settings'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default defineComponent({
  name: 'InvoiceGrid',
  components: {
    Icon, Button, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
  },
  setup() {
    const store = useInvoiceBuilderStore()
    const settingsStore = useSettingsStore()
    
    const isAddColumnOpen = ref(false)
    const targetColumnId = ref('')
    
    const newColumn = ref({
      label: '',
      type: 'text' as ColumnType,
      formulaConfig: {
        operand1: '',
        operand2: '',
        operator: '*' as '*' | '+'
      }
    })

    const numericColumns = computed(() => store.numericColumns)

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settingsStore.app.currency || "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
      }).format(value || 0)
    }

    const openAddColumnDialog = (targetId: string) => {
      targetColumnId.value = targetId
      newColumn.value = {
        label: '',
        type: 'text',
        formulaConfig: { operand1: '', operand2: '', operator: '*' }
      }
      isAddColumnOpen.value = true
    }

    const confirmAddColumn = () => {
      const colId = `custom_${uuidv4().substring(0,8)}`
      store.addColumn({
        id: colId,
        label: newColumn.value.label,
        type: newColumn.value.type,
        isCustom: true,
        formulaConfig: newColumn.value.type === 'formula' ? { ...newColumn.value.formulaConfig } : undefined
      }, targetColumnId.value)
      
      isAddColumnOpen.value = false
      // Initialize custom data map for new column across all existing items
      if (newColumn.value.type !== 'formula') {
        store.lineItems.forEach(item => {
          item.customData[colId] = newColumn.value.type === 'numeric' ? 0 : ''
        })
      }
    }

    return {
      store,
      isAddColumnOpen,
      newColumn,
      numericColumns,
      formatCurrency,
      openAddColumnDialog,
      confirmAddColumn
    }
  }
})
</script>
