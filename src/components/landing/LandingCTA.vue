<template>
  <section class="py-24 px-4 bg-white">
    <div class="max-w-6xl mx-auto rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden bg-slate-900">
      <!-- Re-use Aurora for massive visual impact -->
      <Aurora
        :color-stops="['#0a2e20', '#104a34', '#0d2a1f']"
        :blend="0.8"
        :amplitude="1.8"
        :speed="1.5"
        class="absolute inset-0 opacity-40 z-0 pointer-events-none"
      />
      
      <div class="relative z-10 flex flex-col items-center">
        <h2 class="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white">Ready to <span class="text-emerald-400">Start?</span></h2>
        <p class="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl font-medium">Join thousands of modern businesses scaling their operations with Bilify.</p>
        
        <div class="flex flex-wrap items-center justify-center gap-6 mb-12">
          <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <Icon icon="lucide:monitor" class="w-6 h-6 text-emerald-400" />
            <span class="font-bold text-white">Windows</span>
          </div>
          <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <Icon icon="lucide:apple" class="w-6 h-6 text-emerald-400" />
            <span class="font-bold text-white">macOS</span>
          </div>
          <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <Icon icon="lucide:globe" class="w-6 h-6 text-emerald-400" />
            <span class="font-bold text-white">Web App</span>
          </div>
        </div>
        
        <router-link to="/auth/register" class="bg-emerald-500 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_50px_-10px_rgba(16,185,129,0.6)]">
          Create Free Account
        </router-link>
        <p class="mt-6 text-slate-400 text-sm font-medium">No credit card required. 14-day free trial.</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';
import Aurora from '../Aurora.vue';

export default defineComponent({
  name: 'LandingCTA',
  components: {
    Icon,
    Aurora
  }
});
</script>
