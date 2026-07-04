<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">
 {{ isEdit ? 'Edit Invoice' : 'Create Invoice' }}
 </h2>
 <div class="space-x-3">
 <Button variant="outline" @click="openAIAssistant">
 <Icon icon="lucide:sparkles" class="mr-2 h-4 w-4 text-purple-500" /> Use AI Assistant
 </Button>
 <Button @click="saveInvoice">
 <Icon icon="lucide:save" class="mr-2 h-4 w-4" /> Save
 </Button>
 <Button variant="secondary" @click="downloadPDF">
 <Icon icon="lucide:download" class="mr-2 h-4 w-4" /> Download PDF
 </Button>
 </div>
 </div>

 <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <!-- Form Side -->
 <Card>
 <CardHeader>
 <CardTitle>Invoice Details</CardTitle>
 </CardHeader>
 <CardContent class="space-y-6">
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Invoice Number</Label>
 <Input v-model="form.invoiceNumber" />
 </div>
 <div class="space-y-2">
 <Label>Customer</Label>
 <Select v-model="form.customerId" @update:modelValue="applyCustomer">
 <SelectTrigger>
 <SelectValue placeholder="Select Customer" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem v-for="c in customerStore.customers" :key="c.id" :value="c.id">
 {{ c.name }} ({{ c.company }})
 </SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Invoice Date</Label>
 <Input type="date" v-model="form.date" />
 </div>
 <div class="space-y-2">
 <Label>Due Date</Label>
 <Input type="date" v-model="form.dueDate" />
 </div>
 </div>
 
 <div class="space-y-2">
 <Label>Project Name</Label>
 <Input v-model="form.projectName" placeholder="E.g. Website Redesign" />
 </div>
 
 
 <div v-if="form.customer" class="border-t pt-4 space-y-4">
 <Label class="text-lg font-semibold">Billed To / Customer Details</Label>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Client Name</Label>
 <div class="relative">
 <Input v-model="form.customer.name" class="pr-8" />
 <button v-if="form.customer.name" @click="form.customer.name = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Company</Label>
 <div class="relative">
 <Input v-model="form.customer.company" class="pr-8" />
 <button v-if="form.customer.company" @click="form.customer.company = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Email</Label>
 <div class="relative">
 <Input type="email" v-model="form.customer.email" class="pr-8" />
 <button v-if="form.customer.email" @click="form.customer.email = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Phone</Label>
 <div class="relative">
 <Input v-model="form.customer.phone" class="pr-8" />
 <button v-if="form.customer.phone" @click="form.customer.phone = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Address</Label>
 <div class="relative">
 <Input v-model="form.customer.address" class="pr-8" />
 <button v-if="form.customer.address" @click="form.customer.address = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Country</Label>
 <div class="relative">
 <Input v-model="form.customer.country" class="pr-8" />
 <button v-if="form.customer.country" @click="form.customer.country = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 
 <div class="border-t pt-4 space-y-4">
 <div class="flex items-center justify-between">
 <Label class="text-lg font-semibold">Brand Identity / Sender</Label>
 <Select @update:modelValue="applyProfile">
 <SelectTrigger class="w-[200px]">
 <SelectValue placeholder="Load Profile..." />
 </SelectTrigger>
 <SelectContent>
 <SelectItem v-for="p in settingsStore.profiles" :key="p.id" :value="p.id">
 {{ p.name || 'Unnamed Profile' }}
 </SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Company Name</Label>
 <div class="relative">
 <Input v-model="form.company.name" class="pr-8" />
 <button v-if="form.company.name" @click="form.company.name = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Email</Label>
 <div class="relative">
 <Input type="email" v-model="form.company.email" class="pr-8" />
 <button v-if="form.company.email" @click="form.company.email = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Phone</Label>
 <div class="relative">
 <Input v-model="form.company.phone" class="pr-8" />
 <button v-if="form.company.phone" @click="form.company.phone = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Address</Label>
 <div class="relative">
 <Input v-model="form.company.address" class="pr-8" />
 <button v-if="form.company.address" @click="form.company.address = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Country</Label>
 <div class="relative">
 <Input v-model="form.company.country" class="pr-8" />
 <button v-if="form.company.country" @click="form.company.country = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Website</Label>
 <div class="relative">
 <Input v-model="form.company.website" class="pr-8" />
 <button v-if="form.company.website" @click="form.company.website = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Custom Logo</Label>
 <div class="flex items-center space-x-2">
 <div v-if="form.company.logo" class="w-10 h-10 border rounded overflow-hidden bg-muted flex items-center justify-center">
 <img :src="form.company.logo" alt="Logo" class="max-w-full max-h-full object-contain" />
 </div>
 <Input type="file" accept="image/*" @change="handleLogoUpload" class="flex-1" />
 <Button v-if="form.company.logo" variant="outline" size="sm" @click="form.company.logo = ''">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>
 </div>

 <div class="border-t pt-4 space-y-4">
 <Label class="text-lg font-semibold">Bank Details</Label>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Account Name</Label>
 <div class="relative">
 <Input v-model="form.bank.accountName" class="pr-8" />
 <button v-if="form.bank.accountName" @click="form.bank.accountName = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Account Number</Label>
 <div class="relative">
 <Input v-model="form.bank.accountNumber" class="pr-8" />
 <button v-if="form.bank.accountNumber" @click="form.bank.accountNumber = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>IBAN</Label>
 <div class="relative">
 <Input v-model="form.bank.iban" class="pr-8" />
 <button v-if="form.bank.iban" @click="form.bank.iban = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Bank Name</Label>
 <div class="relative">
 <Input v-model="form.bank.bankName" class="pr-8" />
 <button v-if="form.bank.bankName" @click="form.bank.bankName = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 </div>
 </div>

 <div class="border-t pt-4 space-y-4">
 <div class="flex items-center justify-between">
 <Label class="text-lg font-semibold">Items</Label>
 <Button variant="outline" size="sm" @click="addItem">
 <Icon icon="lucide:plus" class="mr-1 h-4 w-4" /> Add Item
 </Button>
 </div>
 
 <div v-for="(item, index) in form.items" :key="item.id" class="p-4 border rounded-lg space-y-4 relative bg-muted dark:bg-card/50">
 <button @click="removeItem(index)" class="absolute top-2 right-2 text-red-500 hover:text-red-700">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 <div class="grid grid-cols-12 gap-4">
 <div class="col-span-12 md:col-span-5 space-y-2">
 <Label>Item Name</Label>
 <Input v-model="item.name" placeholder="Item Name" />
 </div>
 <div class="col-span-4 md:col-span-2 space-y-2">
 <Label>Qty</Label>
 <Input type="number" v-model.number="item.quantity" />
 </div>
 <div class="col-span-8 md:col-span-3 space-y-2">
 <Label>Price</Label>
 <Input type="number" v-model.number="item.price" />
 </div>
 <div class="col-span-12 md:col-span-2 space-y-2 flex flex-col justify-end">
 <Label class="mb-2">Total</Label>
 <div class="font-medium pt-2">{{ formatCurrency(item.quantity * item.price) }}</div>
 </div>
 </div>
 </div>
 </div>

 <div class="space-y-2">
 <Label>Discount Amount</Label>
 <Input type="number" v-model.number="form.discount" />
 </div>

 <div class="border-t pt-4 space-y-4">
 <Label class="text-lg font-semibold">Document Settings</Label>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Currency</Label>
 <Select v-model="form.currency">
 <SelectTrigger>
 <SelectValue placeholder="Select Currency" />
 </SelectTrigger>
 <SelectContent class="max-h-[300px]">
 <!-- Major / English -->
 <SelectItem value="USD">USD - US Dollar</SelectItem>
 <SelectItem value="GBP">GBP - British Pound</SelectItem>
 <SelectItem value="EUR">EUR - Euro</SelectItem>
 <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
 <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
 <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
 
 <!-- Gulf / Middle East -->
 <SelectItem value="AED">AED - UAE Dirham</SelectItem>
 <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
 <SelectItem value="QAR">QAR - Qatari Riyal</SelectItem>
 <SelectItem value="OMR">OMR - Omani Rial</SelectItem>
 <SelectItem value="KWD">KWD - Kuwaiti Dinar</SelectItem>
 <SelectItem value="BHD">BHD - Bahraini Dinar</SelectItem>
 
 <!-- Asia / Other -->
 <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
 <SelectItem value="INR">INR - Indian Rupee</SelectItem>
 <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
 <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
 <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 <div class="space-y-2 mt-4">
 <Label>Terms and Conditions</Label>
 <Textarea v-model="form.terms" rows="3" />
 </div>
 <div class="space-y-2 mt-4">
 <Label>Notes</Label>
 <Textarea v-model="form.notes" rows="2" />
 </div>
 </div>
 </CardContent>
 </Card>

 <!-- Preview Side -->
 <div class="space-y-4">
 <div class="flex items-center space-x-4 bg-muted dark:bg-card p-4 rounded-lg">
 <Label class="whitespace-nowrap font-semibold">Select Template:</Label>
 <Select v-model="form.template">
 <SelectTrigger>
 <SelectValue placeholder="Choose a template" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="TemplateMinimal">Minimal</SelectItem>
 <SelectItem value="TemplateCorporate">Corporate</SelectItem>
 <SelectItem value="TemplateCreative">Creative</SelectItem>
 <SelectItem value="TemplateElegant">Elegant</SelectItem>
 </SelectContent>
 </Select>
 </div>
 
 <div class="sticky top-6">
 <div class="bg-muted dark:bg-card p-4 rounded-lg overflow-auto max-h-[80vh] shadow-inner">
 <InvoicePreview type="invoice" :document="computedInvoice" elementId="invoice-pdf" />
 </div>
 </div>
 </div>
 </div>
 
 <AIAssistantModal v-model:open="isAIModalOpen" @generated="handleAIGenerated" />
 </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { format, addDays } from 'date-fns'
import { useInvoiceStore, InvoiceItem, Invoice } from '../store/invoice'
import { useCustomerStore } from '../store/customer'
import { useSettingsStore } from '../store/settings'
import { generatePDF } from '../services/pdfService'
import { AIParseResult } from '../services/geminiService'

import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import InvoicePreview from '../components/invoices/InvoicePreview.vue'
import AIAssistantModal from '../components/invoices/AIAssistantModal.vue'

export default defineComponent({
 name: 'CreateInvoice',
 components: {
 Icon, Button, Card, CardHeader, CardTitle, CardContent,
 Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
 InvoicePreview, AIAssistantModal
 },
 setup() {
 const router = useRouter()
 const route = useRoute()
 const invoiceStore = useInvoiceStore()
 const customerStore = useCustomerStore()
 const settingsStore = useSettingsStore()

 const isEdit = ref(false)
 const isAIModalOpen = ref(false)
 
 const form = reactive({
 id: '',
 invoiceNumber: settingsStore.app.invoicePrefix + Date.now().toString().slice(-6),
 projectName: '',
 date: format(new Date(), 'yyyy-MM-dd'),
 dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
 customerId: '',
 customer: null as any,
  items: [] as InvoiceItem[],
 discount: 0,
 notes: '',
  template: settingsStore.app.defaultTemplate || 'TemplateMinimal',
 terms: settingsStore.app.terms,
 status: 'Draft' as Invoice['status'],
 company: { 
 name: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.name || '',
 address: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.address || '',
 country: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.country || '',
 phone: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.phone || '',
 email: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.email || '',
 website: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.website || '',
 taxId: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.taxId || '',
 logo: settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.logo || ''
 },
 bank: { ...(settingsStore.profiles.find(p => p.id === settingsStore.activeProfileId)?.bank || { accountName: '', accountNumber: '', iban: '', bankName: '' }) },
 currency: settingsStore.app.currency
 })

 const handleLogoUpload = (event: Event) => {
 const file = (event.target as HTMLInputElement).files?.[0]
 if (file) {
 const reader = new FileReader()
 reader.onload = (e) => {
 if (e.target?.result) {
 form.company.logo = e.target.result as string
 }
 }
 reader.readAsDataURL(file)
 }
 }

 onMounted(() => {
 const id = route.query.id as string
 if (id) {
 const inv = invoiceStore.getInvoiceById(id)
 if (inv) {
 isEdit.value = true
 Object.assign(form, JSON.parse(JSON.stringify(inv)))
 }
 } else if (route.query.ai === 'true') {
 isAIModalOpen.value = true
 } else {
 addItem()
 }
 })

 const addItem = () => {
 form.items.push({
 id: Date.now().toString(),
 name: '',
 quantity: 1,
 price: 0,
 taxRate: settingsStore.app.taxRate
 })
 }

 const removeItem = (index: number) => {
 form.items.splice(index, 1)
 }

 const computedInvoice = computed(() => {
 const subtotal = form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
 const taxTotal = form.items.reduce((sum, item) => sum + ((item.quantity * item.price) * (item.taxRate / 100)), 0)
 const total = subtotal + taxTotal - form.discount
 return {
 ...form,
 subtotal,
 taxTotal,
 total
 }
 })

 
 const applyCustomer = (id: any) => {
 if (!id) return;
 const cust = customerStore.getCustomerById(id);
 if (cust) {
 form.customer = { ...cust };
 }
 }
 
 const applyProfile = (id: any) => {
 if (!id) return;
 const profile = settingsStore.profiles.find(p => p.id === id)
 if (profile) {
 form.company.name = profile.name
 form.company.address = profile.address
 form.company.country = profile.country
 form.company.phone = profile.phone
 form.company.email = profile.email
 form.company.website = profile.website
 form.company.taxId = profile.taxId
 form.company.logo = profile.logo
 form.bank = { ...profile.bank }
 if (profile.currency) form.currency = profile.currency
 if (profile.terms) form.terms = profile.terms
 }
 }

 const saveInvoice = () => {
 if (!form.customerId) {
 alert('Please select a customer')
 return
 }
 
 // Update global defaults for next time
 settingsStore.updateApp({ currency: form.currency })
 
 if (isEdit.value) {
 invoiceStore.updateInvoice(form.id, computedInvoice.value as any)
 } else {
 invoiceStore.addInvoice(computedInvoice.value as any)
 }
 router.push('/invoices')
 }

 const downloadPDF = () => {
 generatePDF('invoice-pdf', `${form.invoiceNumber}.pdf`)
 }

 const openAIAssistant = () => {
 isAIModalOpen.value = true
 }

 const handleAIGenerated = (data: AIParseResult) => {
 // Create customer if names provided but not found
 if (data.customer?.name) {
 let cust = customerStore.customers.find(c => c.name.toLowerCase() === data.customer!.name!.toLowerCase())
 if (!cust) {
 customerStore.addCustomer({
 name: data.customer.name,
 company: data.customer.company || '',
 email: data.customer.email || '',
 phone: data.customer.phone || '',
 address: data.customer.address || '',
 country: '',
 taxId: ''
 })
 cust = customerStore.customers[customerStore.customers.length - 1]
 }
 form.customerId = cust.id
 }

 if (data.sender) {
 form.company = { ...form.company, ...data.sender }
 }
 
 if (data.bank) {
 form.bank = { ...form.bank, ...data.bank }
 }

 form.items = data.items.map((item, index) => ({
 id: Date.now().toString() + index,
 name: item.name,
 quantity: item.quantity,
 price: item.price,
 taxRate: data.taxRate ?? settingsStore.app.taxRate
 }))
 
 if (data.discount) {
 form.discount = data.discount
 }
 }

 const formatCurrency = (val: number) => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: settingsStore.app.currency }).format(val)
 }

 return {
 settingsStore,
 isEdit,
 form,
 customerStore,
 addItem,
 removeItem,
 computedInvoice,
 saveInvoice,
 downloadPDF,
 isAIModalOpen,
 openAIAssistant,
 handleAIGenerated,
 formatCurrency,
 handleLogoUpload,
 applyProfile,
 applyCustomer
 }
 }
})
</script>
