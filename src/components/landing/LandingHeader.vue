<template>
  <div class="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] z-50">
      <header
      class="w-full h-16 bg-gradient-to-r from-[#29855b] to-[#144b33] rounded-full flex items-center justify-between px-6 transition-all duration-300 shadow-lg border border-white/10"
    >
      <!-- Logo -->
      <div
        class="font-bold text-xl flex items-center gap-2 tracking-tight text-white"
      >
        <div
          class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-lg"
        >
          <Icon icon="lucide:zap" class="w-4 h-4 text-white" />
        </div>
        Bilify
      </div>

      <!-- Center Nav -->
      <nav
        class="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90"
      >
        <a href="#home" class="hover:text-white transition-colors">Home</a>
        <a href="#metrics" class="hover:text-white transition-colors">Metrics</a>
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
        <a href="#faq" class="hover:text-white transition-colors">FAQ</a>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-4">
        <router-link
          to="/auth/login"
          class="text-sm font-bold text-white/90 hover:text-white transition-colors"
        >
          Log In
        </router-link>
        <router-link
          to="/auth/register"
          class="text-sm font-bold text-[#144b33] bg-white hover:bg-slate-50 px-5 py-2 rounded-full transition-colors shadow-sm"
        >
          Sign Up
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
