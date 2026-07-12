<template>
  <router-view />
</template>

<script>
import { mapActions } from 'pinia'
import { useAuthStore } from './store/auth'

export default {
  name: 'App',
  methods: {
    ...mapActions(useAuthStore, ['fetchUser']),
  },
  mounted() {
    // Hydrate auth state from existing Supabase session (survives page refresh)
    this.fetchUser()
  },
}
</script>
