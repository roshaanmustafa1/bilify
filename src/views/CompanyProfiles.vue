<template>
 <div class="space-y-6">
 <div class="flex items-center justify-between">
 <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Company Profiles</h2>
 <Button @click="openCreateModal">
 <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Add Profile
 </Button>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <Card v-for="profile in settingsStore.profiles" :key="profile.id" class="relative group">
 <CardHeader class="pb-2">
 <div class="flex justify-between items-start">
 <div class="flex items-center space-x-3">
 <div v-if="profile.logo" class="w-10 h-10 border rounded overflow-hidden bg-muted flex items-center justify-center">
 <img :src="profile.logo" alt="Logo" class="max-w-full max-h-full object-contain" />
 </div>
 <div v-else class="w-10 h-10 border rounded bg-muted flex items-center justify-center text-muted-foreground">
 <Icon icon="lucide:building-2" class="w-5 h-5" />
 </div>
 <div>
 <CardTitle class="text-lg">{{ profile.name || 'Unnamed Profile' }}</CardTitle>
 <p class="text-sm text-muted-foreground">{{ profile.country }}</p>
 </div>
 </div>
 </div>
 </CardHeader>
 <CardContent>
 <div class="text-sm text-muted-foreground space-y-1 mb-4">
 <div class="flex items-center"><Icon icon="lucide:mail" class="w-3 h-3 mr-2 text-muted-foreground" /> {{ profile.email || 'N/A' }}</div>
 <div class="flex items-center"><Icon icon="lucide:phone" class="w-3 h-3 mr-2 text-muted-foreground" /> {{ profile.phone || 'N/A' }}</div>
 </div>
 
 <div class="flex justify-between items-center mt-4">
 <span v-if="settingsStore.activeProfileId === profile.id" class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Active Default</span>
 <span v-else></span>
 <div class="space-x-2">
 <Button variant="outline" size="sm" @click="settingsStore.setActiveProfile(profile.id)" v-if="settingsStore.activeProfileId !== profile.id">
 Set Active
 </Button>
 <Button variant="ghost" size="sm" @click="editProfile(profile)">
 <Icon icon="lucide:pencil" class="h-4 w-4" />
 </Button>
 <Button variant="ghost" size="sm" class="text-red-500 hover:text-red-700" @click="confirmDelete(profile.id)">
 <Icon icon="lucide:trash-2" class="h-4 w-4" />
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 <!-- Edit/Create Modal -->
 <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
 <DialogContent class="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
 <DialogHeader>
 <DialogTitle>{{ editingId ? 'Edit Profile' : 'Create Profile' }}</DialogTitle>
 </DialogHeader>
 <div class="space-y-6 py-4">
 <!-- Identity -->
 <div class="space-y-4">
 <h3 class="text-lg font-medium border-b pb-2">Brand Identity</h3>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Company Name</Label>
 <Input v-model="form.name" />
 </div>
 <div class="space-y-2">
 <Label>Tax ID</Label>
 <Input v-model="form.taxId" />
 </div>
 <div class="space-y-2">
 <Label>Email</Label>
 <Input type="email" v-model="form.email" />
 </div>
 <div class="space-y-2">
 <Label>Phone</Label>
 <Input v-model="form.phone" />
 </div>
 <div class="space-y-2">
 <Label>Address</Label>
 <Input v-model="form.address" />
 </div>
 <div class="space-y-2">
 <Label>Country</Label>
 <Input v-model="form.country" />
 </div>
 <div class="space-y-2">
 <Label>Website</Label>
 <Input v-model="form.website" />
 </div>
 <div class="space-y-2">
 <Label>Custom Logo</Label>
 <div class="flex items-center space-x-2">
 <div v-if="form.logo" class="w-10 h-10 border rounded overflow-hidden bg-muted flex items-center justify-center">
 <img :src="form.logo" alt="Logo" class="max-w-full max-h-full object-contain" />
 </div>
 <Input type="file" accept="image/*" @change="handleLogoUpload" class="flex-1" />
 <Button v-if="form.logo" variant="outline" size="sm" @click="form.logo = ''">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </Button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Default Currency</Label>
 <Select v-model="form.currency">
 <SelectTrigger>
 <SelectValue placeholder="Select Currency" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="USD">USD - US Dollar</SelectItem>
 <SelectItem value="GBP">GBP - British Pound</SelectItem>
 <SelectItem value="EUR">EUR - Euro</SelectItem>
 <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
 <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
 <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
 <SelectItem value="AED">AED - UAE Dirham</SelectItem>
 <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
 <SelectItem value="QAR">QAR - Qatari Riyal</SelectItem>
 <SelectItem value="OMR">OMR - Omani Rial</SelectItem>
 <SelectItem value="KWD">KWD - Kuwaiti Dinar</SelectItem>
 <SelectItem value="BHD">BHD - Bahraini Dinar</SelectItem>
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
 <Textarea v-model="form.terms" rows="3" placeholder="Default terms for this company..." />
 </div>
 </div>

 <!-- Bank -->
 <div class="space-y-4">
 <h3 class="text-lg font-medium border-b pb-2">Bank Details</h3>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Account Name</Label>
 <Input v-model="form.bank.accountName" />
 </div>
 <div class="space-y-2">
 <Label>Account Number</Label>
 <Input v-model="form.bank.accountNumber" />
 </div>
 <div class="space-y-2">
 <Label>IBAN</Label>
 <Input v-model="form.bank.iban" />
 </div>
 <div class="space-y-2">
 <Label>Bank Name</Label>
 <Input v-model="form.bank.bankName" />
 </div>
 </div>
 </div>
 </div>

 <DialogFooter>
 <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
 <Button @click="saveProfile">Save Profile</Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useSettingsStore, CompanyProfile } from '../store/settings'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default defineComponent({
 name: 'CompanyProfiles',
 components: {
 Icon, Button, Card, CardHeader, CardTitle, CardContent,
 Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
 Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
 },
 setup() {
 const settingsStore = useSettingsStore()
 const isModalOpen = ref(false)
 const editingId = ref<string | null>(null)
 
 const form = reactive({
 name: '',
 address: '',
 country: '',
 phone: '',
 email: '',
 website: '',
 taxId: '',
 logo: '',
 currency: 'USD',
 terms: 'Payment is due within 30 days. Thank you for your business!',
 bank: {
 accountName: '',
 accountNumber: '',
 iban: '',
 bankName: ''
 }
 })

 const resetForm = () => {
 editingId.value = null
 Object.assign(form, {
 name: '', address: '', country: '', phone: '', email: '', website: '', taxId: '', logo: '',
 currency: 'USD', terms: 'Payment is due within 30 days. Thank you for your business!',
 bank: { accountName: '', accountNumber: '', iban: '', bankName: '' }
 })
 }

 const openCreateModal = () => {
 resetForm()
 isModalOpen.value = true
 }

 const editProfile = (profile: CompanyProfile) => {
 editingId.value = profile.id
 Object.assign(form, JSON.parse(JSON.stringify(profile)))
 isModalOpen.value = true
 }

 const handleLogoUpload = (event: Event) => {
 const file = (event.target as HTMLInputElement).files?.[0]
 if (file) {
 const reader = new FileReader()
 reader.onload = (e) => {
 if (e.target?.result) {
 form.logo = e.target.result as string
 }
 }
 reader.readAsDataURL(file)
 }
 }

 const saveProfile = () => {
 if (!form.name) {
 alert("Company Name is required.")
 return
 }

 if (editingId.value) {
 settingsStore.updateProfile(editingId.value, { ...form })
 } else {
 settingsStore.addProfile({ ...form })
 }
 isModalOpen.value = false
 }

 const confirmDelete = (id: string) => {
 if (confirm('Are you sure you want to delete this profile?')) {
 settingsStore.deleteProfile(id)
 }
 }

 return {
 settingsStore,
 isModalOpen,
 editingId,
 form,
 openCreateModal,
 editProfile,
 handleLogoUpload,
 saveProfile,
 confirmDelete
 }
 }
})
</script>
