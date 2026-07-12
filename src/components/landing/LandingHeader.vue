<template>
  <div class="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] z-50">
    <header
      class="w-full h-16 bg-white/70 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-between px-6 transition-all duration-300 shadow-lg border border-border/50"
    >
      <!-- Logo -->
      <div
        class="font-bold text-xl flex items-center gap-2 tracking-tight text-slate-900"
      >
        <div
          class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <Icon icon="lucide:zap" class="w-4 h-4 text-white" />
        </div>
        Bilify
      </div>

      <!-- Center Nav -->
      <nav
        class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700"
      >
        <a href="#features" class="hover:text-primary transition-colors"
          >Features</a
        >
        <a href="#pricing" class="hover:text-primary transition-colors"
          >Pricing</a
        >
        <a href="#faq" class="hover:text-primary transition-colors">FAQ</a>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-5">
        <router-link
          to="/auth/login"
          class="text-slate-600 hover:text-primary transition-colors group"
          title="Favorites"
        >
          <Icon
            icon="lucide:heart"
            class="w-5 h-5 fill-transparent group-hover:fill-primary/20 transition-all"
            stroke-width="2"
          />
        </router-link>
        <router-link
          to="/auth/login"
          class="text-slate-600 hover:text-primary transition-colors group"
          title="Cart"
        >
          <Icon
            icon="lucide:shopping-bag"
            class="w-5 h-5 fill-transparent group-hover:fill-primary/20 transition-all"
            stroke-width="2"
          />
        </router-link>
        <router-link
          to="/auth/login"
          class="text-sm font-bold text-slate-800 hover:text-primary transition-colors ml-2"
        >
          Log In
        </router-link>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "LandingHeader",
  components: {
    Icon,
  },
});
</script>
