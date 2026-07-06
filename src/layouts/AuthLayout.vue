<template>
 <div class="min-h-screen flex items-center justify-center bg-muted dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
 <div class="max-w-md w-full space-y-8">
 <div>
 <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground dark:text-primary-foreground">
  Bilify
 </h2>
 </div>
 <router-view />
 </div>
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
 name: 'AuthLayout'
})
</script>
