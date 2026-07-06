<template>
  <div class="company-profile-form p-6 bg-card rounded-lg border border-border shadow-sm">
    <h2 class="text-xl font-semibold mb-4 text-foreground">Company Configuration</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid gap-2">
        <Label for="name">Company Name</Label>
        <Input id="name" v-model="form.name" type="text" placeholder="Acme Corp" required />
      </div>
      <div class="grid gap-2">
        <Label for="logo">Logo URL</Label>
        <Input id="logo" v-model="form.logo" type="text" placeholder="https://example.com/logo.png" />
      </div>
      <div class="grid gap-2">
        <Label for="address">Address</Label>
        <Textarea id="address" v-model="form.address" rows="3" placeholder="123 Corporate Blvd..."></Textarea>
      </div>

      <div class="pt-2">
        <Button type="submit" :disabled="loading" class="w-full">
          {{ loading ? 'Saving...' : (form.id ? 'Update Profile' : 'Create Profile') }}
        </Button>
      </div>
      <div v-if="error" class="text-destructive text-sm mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCompanyProfilesStore } from '../../store/modules/companyProfiles'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'

export default {
  name: 'CompanyProfileForm',
  components: {
    Button,
    Input,
    Label,
    Textarea
  },
  data() {
    return {
      form: {
        name: '',
        logo: '',
        address: '',

      }
    }
  },
  computed: {
    ...mapState(useCompanyProfilesStore, ['loading', 'error', 'activeProfile'])
  },
  watch: {
    activeProfile: {
      immediate: true,
      handler(newProfile) {
        if (newProfile) {
          this.form = { ...newProfile }
        } else {
          this.form = {
            name: '',
            logo: '',
            address: '',

          }
        }
      }
    }
  },
  methods: {
    ...mapActions(useCompanyProfilesStore, ['saveProfile', 'patchProfile']),
    handleSubmit() {
      if (this.form.id) {
        this.patchProfile(this.form.id, this.form)
      } else {
        this.saveProfile(this.form)
      }
    }
  }
}
</script>
