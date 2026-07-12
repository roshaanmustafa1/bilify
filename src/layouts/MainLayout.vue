<template>
  <div class="flex h-screen bg-muted dark:bg-background text-foreground">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-background dark:bg-card border-r dark:border-border hidden md:flex flex-col"
    >
      <div
        class="py-4 flex flex-col justify-center px-6 border-b dark:border-border"
      >
        <h1 class="text-xl font-bold text-primary leading-tight">Bilify</h1>
        <p
          class="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5"
        >
          Invoice & Quote Generator with AI
        </p>
      </div>
      <nav class="flex-1 py-4 space-y-1 px-3">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="[
            $route.path === item.path ||
            ($route.path.startsWith(item.path + '/') && item.path !== '/')
              ? 'bg-primary text-background'
              : 'text-foreground dark:text-muted-foreground hover:bg-primary/40 ',
          ]"
        >
          <Icon :icon="item.icon" class="mr-3 h-5 w-5" />
          {{ item.name }}
        </router-link>
      </nav>
      <div class="p-4 border-t dark:border-border space-y-2">
        <button
          @click="toggleDark()"
          class="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted rounded-md transition-colors"
        >
          <Icon
            :icon="isDark ? 'lucide:sun' : 'lucide:moon'"
            class="mr-3 h-5 w-5"
          />
          {{ isDark ? "Light Mode" : "Dark Mode" }}
        </button>
        <button
          @click="logout"
          class="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <Icon icon="lucide:log-out" class="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden bg-background">
      <!-- Header -->
      <header
        class="h-auto py-3 flex items-center justify-between px-4 bg-background dark:bg-card border-b dark:border-border md:hidden"
      >
        <div class="flex flex-col justify-center items-start">
          <h1 class="text-xl font-bold text-foreground leading-tight">
            Bilify
          </h1>
          <p
            class="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5"
          >
            Invoice & Quote Generator with AI
          </p>
        </div>
        <button
          @click="toggleDark()"
          class="p-2 text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors flex-shrink-0"
        >
          <Icon :icon="isDark ? 'lucide:sun' : 'lucide:moon'" class="h-5 w-5" />
        </button>
      </header>
      <!-- Content -->
      <div class="flex-1 overflow-auto flex flex-col p-4 md:p-6 pb-24 md:pb-6">
        <div class="flex-1">
          <router-view />
        </div>
        <AppFooter class="mt-8" />
      </div>

      <!-- Bottom Nav (Mobile) -->
      <nav
        class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background dark:bg-card border-t dark:border-border flex items-center justify-around px-1 z-50 overflow-x-auto no-scrollbar"
      >
        <router-link
          v-for="item in bottomNavItems"
          :key="item.name"
          :to="item.path"
          class="flex flex-col items-center justify-center w-[16%] min-w-[50px] h-14 rounded-xl transition-colors shrink-0"
          :class="[
            $route.path === item.path ||
            ($route.path.startsWith(item.path + '/') &&
              item.path !== '/' &&
              item.path !== '/invoices/create?ai=true')
              ? 'bg-[#dbd6fe] text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
              : 'text-muted-foreground hover:bg-muted',
          ]"
        >
          <Icon :icon="item.icon" class="h-5 w-5 mb-1" />
          <span
            class="text-[9px] font-medium truncate w-full text-center px-0.5"
            >{{ item.name }}</span
          >
        </router-link>
      </nav>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import AppFooter from "../components/Footer.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    Icon,
    AppFooter,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const navItems = [
      { name: "Dashboard", path: "/app", icon: "lucide:layout-dashboard" },
      { name: "Invoice & Quotation", path: "/app/invoices", icon: "lucide:file-text" },
      { name: "Customers", path: "/app/customers", icon: "lucide:users" },
      {
        name: "Company Profiles",
        path: "/app/profiles",
        icon: "lucide:building-2",
      },
    ];

    const bottomNavItems = [
      { name: "Home", path: "/app", icon: "lucide:layout-grid" },
      { name: "Inv & Quote", path: "/app/invoices", icon: "lucide:file-text" },
      { name: "Customers", path: "/app/customers", icon: "lucide:users" },
      { name: "Profiles", path: "/app/profiles", icon: "lucide:building-2" },
      { name: "AI", path: "/app/invoices/create?ai=true", icon: "lucide:bot" },
    ];

    const logout = () => {
      authStore.logout();
      router.push("/auth/login");
    };

    // Purely manual dark mode (ignores OS time/settings)
    const isDark = ref(false);

    onMounted(() => {
      const stored = localStorage.getItem("app-color-scheme");
      if (stored === "dark") {
        isDark.value = true;
        document.documentElement.classList.add("dark");
      } else {
        isDark.value = false;
        document.documentElement.classList.remove("dark");
        localStorage.setItem("app-color-scheme", "light");
      }
    });

    const toggleDark = () => {
      isDark.value = !isDark.value;
      if (isDark.value) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("app-color-scheme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("app-color-scheme", "light");
      }
    };

    return {
      navItems,
      bottomNavItems,
      logout,
      isDark,
      toggleDark,
    };
  },
});
</script>
