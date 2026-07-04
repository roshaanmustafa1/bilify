<template>
 <div class="flex h-screen bg-muted dark:bg-background text-foreground">
 <!-- Sidebar -->
 <aside class="w-64 bg-background dark:bg-card border-r dark:border-border hidden md:flex flex-col">
 <div class="h-16 flex items-center px-6 border-b dark:border-border">
 <h1 class="text-xl font-bold text-primary">Smart Invoice</h1>
 </div>
 <nav class="flex-1 py-4 space-y-1 px-3">
 <router-link
 v-for="item in navItems"
 :key="item.name"
 :to="item.path"
 class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
 :class="[
 $route.path === item.path || $route.path.startsWith(item.path + '/') && item.path !== '/'
 ? 'bg-primary/10 text-primary' 
 : 'text-foreground dark:text-muted-foreground hover:bg-muted '
 ]"
 >
 <Icon :icon="item.icon" class="mr-3 h-5 w-5" />
 {{ item.name }}
 </router-link>
 </nav>
 <div class="p-4 border-t dark:border-border space-y-2">
 <button @click="toggleDark()" class="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted rounded-md transition-colors">
 <Icon :icon="isDark ? 'lucide:sun' : 'lucide:moon'" class="mr-3 h-5 w-5" />
 {{ isDark ? 'Light Mode' : 'Dark Mode' }}
 </button>
 <button @click="logout" class="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
 <Icon icon="lucide:log-out" class="mr-3 h-5 w-5" />
 Logout
 </button>
 </div>
 </aside>

 <!-- Main Content -->
 <main class="flex-1 flex flex-col overflow-hidden">
 <!-- Header -->
 <header class="h-16 flex items-center justify-between px-6 bg-background dark:bg-card border-b dark:border-border md:hidden">
 <h1 class="text-xl font-bold text-primary">Smart Invoice</h1>
 <button class="p-2 -mr-2 text-muted-foreground hover:text-foreground dark:text-muted-foreground">
 <Icon icon="lucide:menu" class="h-6 w-6" />
 </button>
 </header>
 
 <!-- Content -->
 <div class="flex-1 overflow-auto p-6">
 <router-view />
 </div>
 </main>
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'

export default defineComponent({
 name: 'MainLayout',
 components: {
 Icon
 },
 setup() {
 const authStore = useAuthStore()
 const router = useRouter()

 const navItems = [
 { name: 'Dashboard', path: '/', icon: 'lucide:layout-dashboard' },
 { name: 'Invoices', path: '/invoices', icon: 'lucide:file-text' },
 { name: 'Quotations', path: '/quotations', icon: 'lucide:file-signature' },
 { name: 'Customers', path: '/customers', icon: 'lucide:users' },
 { name: 'Company Profiles', path: '/profiles', icon: 'lucide:building-2' }
 ]

 const logout = () => {
 authStore.logout()
 router.push('/auth/login')
 }

 const isDark = useDark()
 const toggleDark = useToggle(isDark)

 return {
 navItems,
 logout,
 isDark,
 toggleDark
 }
 }
})
</script>
