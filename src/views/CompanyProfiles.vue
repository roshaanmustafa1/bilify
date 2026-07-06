<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">Company Profiles</h2>
      <Button @click="openCreateModal">
        <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> Add Profile
      </Button>
    </div>

    <div v-if="loading" class="text-muted-foreground">Loading profiles...</div>

    <div v-else class="space-y-4">
      <div v-if="profiles.length === 0" class="text-center py-12 text-muted-foreground border rounded-lg bg-card">
        No profiles found. Create your first company profile!
      </div>
      <div
        v-for="profile in profiles"
        :key="profile.id"
        class="flex items-center justify-between p-4 border rounded-lg bg-card dark:border-border transition-all hover:shadow-sm"
      >
        <div class="flex items-center space-x-4">
          <div v-if="profile.logo" class="w-12 h-12 border rounded-md overflow-hidden bg-muted flex items-center justify-center hidden sm:flex">
            <img :src="profile.logo" alt="Logo" class="max-w-full max-h-full object-contain" />
          </div>
          <div v-else class="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full hidden sm:block">
            <Icon icon="lucide:building-2" class="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <p class="font-medium text-lg">{{ profile.name || 'Unnamed Profile' }}</p>
              <Badge v-if="activeProfileId === profile.id" class="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 px-2 py-0.5 text-xs border-transparent">Active</Badge>
            </div>
            <p class="text-sm text-muted-foreground">
              {{ profile.email || 'No Email' }} • {{ profile.country || 'No Country' }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-6">
          <div class="text-right hidden sm:block">
            <p class="font-medium">{{ profile.phone || 'No Phone' }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" @click="handleSetActive(profile.id)" v-if="activeProfileId !== profile.id" class="hidden md:inline-flex">
              Set Active
            </Button>
            <Button variant="ghost" size="icon" @click="editProfile(profile)">
              <Icon icon="lucide:edit" class="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive/90 hover:bg-destructive/10" @click="confirmDelete(profile.id)">
              <Icon icon="lucide:trash" class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
      <DialogContent class="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editingId ? 'Edit Profile' : 'Create Profile' }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-6 py-4 px-1">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
            </CardHeader>
            <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Company Name</Label>
                <Input v-model="form.name" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Email</Label>
                <Input type="email" v-model="form.email" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Phone</Label>
                <Input v-model="form.phone" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Address</Label>
                <Input v-model="form.address" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Country</Label>
                <Input v-model="form.country" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Website</Label>
                <Input v-model="form.website" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Custom Logo</Label>
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
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Default Currency</Label>
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
              <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Terms and Conditions</Label>
              <Textarea v-model="form.terms" rows="3" placeholder="Default terms for this company..." />
            </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Account Name</Label>
                <Input v-model="form.bank.accountName" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Account Number</Label>
                <Input v-model="form.bank.accountNumber" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">IBAN</Label>
                <Input v-model="form.bank.iban" />
              </div>
              <div class="space-y-2">
                <Label class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Bank Name</Label>
                <Input v-model="form.bank.bankName" />
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        <div v-if="error" class="p-3 bg-destructive/10 text-destructive rounded-md text-sm mt-4">
          {{ error }}
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
          <Button @click="handleSaveProfile" :disabled="isSaving">
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Profile</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useProfileStore } from '../store/profile';
import { Icon } from '@iconify/vue';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default {
  name: 'CompanyProfiles',
  components: {
    Icon, Button, Badge, Card, CardHeader, CardTitle, CardContent,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Label, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
  },
  data() {
    return {
      isModalOpen: false,
      editingId: null,
      isSaving: false,
      form: {
        name: '',
        address: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        logo: '',
        currency: 'USD',
        terms: 'Payment is due within 30 days. Thank you for your business!',
        bank: { accountName: '', accountNumber: '', iban: '', bankName: '' }
      }
    };
  },
  computed: {
    ...mapState(useProfileStore, ['profiles', 'activeProfileId', 'loading', 'error'])
  },
  mounted() {
    this.fetchProfiles();
  },
  methods: {
    ...mapActions(useProfileStore, [
      'fetchProfiles', 
      'createProfile', 
      'patchProfile', 
      'deleteProfile',
      'setActiveProfile'
    ]),
    
    resetForm() {
      this.editingId = null;
      this.form = {
        name: '', address: '', country: '', phone: '', email: '', website: '', logo: '',
        currency: 'USD', terms: 'Payment is due within 30 days. Thank you for your business!',
        bank: { accountName: '', accountNumber: '', iban: '', bankName: '' }
      };
    },

    openCreateModal() {
      this.resetForm();
      this.isModalOpen = true;
    },

    editProfile(profile) {
      this.editingId = profile.id;
      // Deep copy to prevent directly mutating the store object via v-model
      this.form = JSON.parse(JSON.stringify(profile));
      this.isModalOpen = true;
    },

    handleLogoUpload(event) {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.form.logo = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    },

    handleSaveProfile() {
      if (!this.form.name) {
        alert("Company Name is required.");
        return;
      }

      this.isSaving = true;
      const promise = this.editingId 
        ? this.patchProfile(this.editingId, this.form)
        : this.createProfile(this.form);

      promise
        .then(() => {
          this.isSaving = false;
          this.isModalOpen = false;
        })
        .catch(err => {
          this.isSaving = false;
          console.error("Failed to save profile:", err);
        });
    },

    confirmDelete(id) {
      if (confirm('Are you sure you want to delete this profile?')) {
        this.deleteProfile(id).catch(err => {
          console.error("Failed to delete profile:", err);
        });
      }
    },
    
    handleSetActive(id) {
      this.setActiveProfile(id);
    }
  }
};
</script>
