<template>
  <footer class="bg-white/20 border-t border-slate-100 py-6 px-4">
    <div class="w-full mx-auto px-14">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div
            class="w-7 h-7 bg-gradient-to-br from-[#29855b] to-[#144b33] rounded-lg flex items-center justify-center"
          >
            <Icon icon="lucide:zap" class="w-4 h-4 text-white" />
          </div>
          <span class="font-black text-slate-900 text-lg tracking-tight"
            >Bilify</span
          >
        </router-link>

        <!-- Nav Links -->
        <nav class="flex items-center gap-8">
          <router-link
            to="/"
            class="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >Home</router-link
          >
          <a
            href="#features"
            class="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >Features</a
          >
          <a
            href="#pricing"
            class="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >Pricing</a
          >
          <a
            href="#"
            class="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >Blog</a
          >
          <a
            href="#"
            class="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >Contact</a
          >
        </nav>

        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a
            href="#"
            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:facebook" class="w-4 h-4 text-slate-600" />
          </a>
          <a
            href="#"
            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:instagram" class="w-4 h-4 text-slate-600" />
          </a>
          <a
            href="#"
            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:twitter" class="w-4 h-4 text-slate-600" />
          </a>
          <a
            href="#"
            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:linkedin" class="w-4 h-4 text-slate-600" />
          </a>
        </div>
      </div>

      <!-- Bottom row -->
      <div
        class="mt-5 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-2"
      >
        <p class="text-sm text-slate-400">All Rights Reserved Bilify © 2026</p>
        <a
          href="#"
          class="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        >
          Get this template
          <Icon icon="lucide:arrow-up-right" class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "LandingFooter",
  components: { Icon },
});
</script>
