<template>
  <section class="py-24 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-900"></div>
    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800/50">
        <div class="px-4">
          <div class="text-5xl font-black mb-2 text-emerald-400">99.9%</div>
          <div class="text-slate-400 font-medium">Uptime Guarantee</div>
        </div>
        <div class="px-4">
          <div class="text-5xl font-black mb-2 text-emerald-400">2M+</div>
          <div class="text-slate-400 font-medium">Invoices Generated</div>
        </div>
        <div class="px-4">
          <div class="text-5xl font-black mb-2 text-emerald-400">15k</div>
          <div class="text-slate-400 font-medium">Active Businesses</div>
        </div>
        <div class="px-4">
          <div class="text-5xl font-black mb-2 text-emerald-400">4.9/5</div>
          <div class="text-slate-400 font-medium">Customer Satisfaction</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LandingMetrics'
});
</script>
