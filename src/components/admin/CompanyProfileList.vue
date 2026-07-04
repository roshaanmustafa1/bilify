<template>
  <div class="company-profile-list bg-card border border-border shadow-sm rounded-lg overflow-hidden">
    <div class="p-6 border-b border-border flex justify-between items-center">
      <h2 class="text-xl font-semibold text-foreground">Registered Profiles</h2>
      <Button variant="outline" size="sm" @click="fetchProfiles" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </Button>
    </div>
    
    <div v-if="error" class="p-4 bg-destructive/10 text-destructive text-sm text-center border-b border-border">
      {{ error }}
    </div>

    <div class="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Tax ID</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="profiles.length === 0">
            <TableCell colspan="3" class="text-center h-24 text-muted-foreground">
              No profiles found. Add one above.
            </TableCell>
          </TableRow>
          <TableRow v-for="profile in profiles" :key="profile.id" :class="{ 'bg-muted/50': activeProfile?.id === profile.id }">
            <TableCell class="font-medium text-foreground">
              <div class="flex items-center gap-3">
                <img v-if="profile.logo" :src="profile.logo" alt="Logo" class="w-8 h-8 rounded object-cover border border-border" />
                <span>{{ profile.name || 'Unnamed' }}</span>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ profile.taxId || 'N/A' }}
            </TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="sm" @click="setActiveProfile(profile)">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapWritableState } from 'pinia'
import { useCompanyProfilesStore } from '../../store/modules/companyProfiles'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

export default {
  name: 'CompanyProfileList',
  components: {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  },
  computed: {
    ...mapState(useCompanyProfilesStore, ['profiles', 'loading', 'error']),
    ...mapWritableState(useCompanyProfilesStore, ['activeProfile'])
  },
  mounted() {
    this.fetchProfiles()
  },
  methods: {
    ...mapActions(useCompanyProfilesStore, ['fetchProfiles']),
    setActiveProfile(profile) {
      this.activeProfile = { ...profile }
    }
  }
}
</script>
