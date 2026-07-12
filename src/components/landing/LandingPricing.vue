<template>
  <section id="pricing" class="py-32 bg-[#f8fafc] relative">
    <div class="absolute top-0 left-0 w-full h-1/2 bg-slate-900 rounded-b-[4rem] z-0"></div>
    
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">Simple, transparent pricing.</h2>
        <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Choose the plan that best fits your needs. No hidden fees, ever.</p>
        
        <div class="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
          <button 
            @click="isYearly = false" 
            :class="!isYearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'"
            class="px-6 py-2 rounded-full font-bold text-sm transition-all"
          >
            Monthly
          </button>
          <button 
            @click="isYearly = true" 
            :class="isYearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'"
            class="px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2"
          >
            Yearly
            <span v-if="!isYearly" class="bg-emerald-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-black tracking-wider">Save 20%</span>
            <span v-else class="bg-emerald-100 text-emerald-700 text-[10px] uppercase px-2 py-0.5 rounded-full font-black tracking-wider">Save 20%</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
        <div v-for="(plan, index) in pricingPlans" :key="index" 
          class="relative rounded-[2rem] p-8 flex flex-col transition-transform duration-500"
          :class="[
            plan.isPopular 
              ? 'bg-slate-900 text-white shadow-[0_20px_50px_-12px_rgba(16,74,52,0.5)] border border-slate-700 lg:-translate-y-4' 
              : 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100'
          ]"
        >
          <div v-if="plan.isPopular" class="absolute -top-5 left-0 right-0 flex justify-center">
            <span class="bg-gradient-to-r from-emerald-400 to-primary text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</span>
          </div>
          
          <div class="mb-8">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p :class="plan.isPopular ? 'text-slate-400' : 'text-slate-500'" class="text-sm h-10">{{ plan.description }}</p>
          </div>
          
          <div class="mb-8 flex items-baseline gap-2">
            <span class="text-5xl font-black">${{ isYearly ? plan.priceYearly : plan.priceMonthly }}</span>
            <span :class="plan.isPopular ? 'text-slate-400' : 'text-slate-500'" class="font-medium">/month</span>
          </div>
          
          <ul class="space-y-4 mb-10 flex-1">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
              <div :class="plan.isPopular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/10 text-primary'" class="p-1 rounded-full shrink-0">
                <Icon icon="lucide:check" class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ feature }}</span>
            </li>
          </ul>
          
          <button 
            :class="plan.isPopular ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'" 
            class="w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02]"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'LandingPricing',
  components: {
    Icon
  },
  data() {
    return {
      isYearly: true,
      pricingPlans: [
        { name: 'Personal', priceMonthly: 19, priceYearly: 15, description: 'Ideal for freelancers and independent contractors.', features: ['Up to 50 Invoices/mo', 'Basic Templates', 'Standard Support', 'Mobile App Access'], isPopular: false },
        { name: 'Pro', priceMonthly: 39, priceYearly: 31, description: 'Perfect for growing businesses and small agencies.', features: ['Unlimited Invoices', 'Custom Branding', 'Advanced Analytics', 'Priority 24/7 Support'], isPopular: true },
        { name: 'Enterprise', priceMonthly: 79, priceYearly: 63, description: 'Tailored for large teams requiring maximum control.', features: ['Dedicated Account Manager', 'Custom Integrations', 'Multiple Workspaces', 'SLA Guarantee'], isPopular: false }
      ]
    };
  }
});
</script>
