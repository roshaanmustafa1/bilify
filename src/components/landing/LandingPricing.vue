<template>
  <section id="pricing" ref="pricingSection" class="py-32 bg-[#f8fafc] relative">
    <div class="absolute top-0 left-0 w-full h-1/2 bg-slate-900 rounded-b-[4rem] z-0"></div>
    
    <div class="max-w-6xl mx-auto px-4 relative z-10">
      <div class="text-center mb-16 opacity-0 translate-y-10 pricing-header">
        <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">Simple, transparent pricing.</h2>
        <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Choose the plan that fits your invoicing needs. Start creating professional documents today.</p>
        
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
          class="pricing-card relative rounded-[2rem] p-8 flex flex-col transition-transform duration-500 opacity-0 translate-y-16"
          :class="[
            plan.isPopular 
              ? 'bg-slate-900 text-white shadow-[0_20px_50px_-12px_rgba(16,74,52,0.5)] border border-slate-700' 
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
            :class="plan.isPopular ? 'bg-gradient-to-r from-[#29855b] to-[#144b33] text-white hover:from-[#237550] hover:to-[#103a27] shadow-lg shadow-[#29855b]/25' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'" 
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
import { defineComponent, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'LandingPricing',
  components: {
    Icon
  },
  setup() {
    const pricingSection = ref(null);
    const isYearly = ref(true);

    const pricingPlans = [
      { name: 'Starter', priceMonthly: 12, priceYearly: 9, description: 'Perfect for freelancers starting their journey.', features: ['Up to 20 Invoices/mo', '1 Company Profile', 'Standard Templates', 'Email Support'], isPopular: false },
      { name: 'Professional', priceMonthly: 29, priceYearly: 24, description: 'Ideal for growing agencies and consulting firms.', features: ['Unlimited Invoices', '3 Company Profiles', 'Premium Templates', 'Priority Support', 'AI Assistant (100 credits/mo)'], isPopular: true },
      { name: 'Enterprise', priceMonthly: 79, priceYearly: 63, description: 'For large teams requiring maximum scale.', features: ['Unlimited Invoices & Quotes', 'Unlimited Company Profiles', 'Custom Branding', 'Unlimited AI Assistant', 'Dedicated Account Manager'], isPopular: false }
    ];

    onMounted(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pricingSection.value,
          start: 'top 75%',
        }
      });

      tl.to('.pricing-header', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.pricing-card', { 
          opacity: 1, 
          y: (i) => i === 1 ? -16 : 0, // elevate middle card 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'back.out(1.2)' 
        }, "-=0.4");
    });

    return {
      pricingSection,
      isYearly,
      pricingPlans
    };
  }
});
</script>
