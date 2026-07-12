<template>
  <section id="features" class="py-32 bg-white relative z-20">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-20 max-w-2xl mx-auto">
        <h2 class="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Platform Capabilities</h2>
        <h3 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Empowering your business with cutting-edge tools.</h3>
        <p class="text-lg text-slate-600">Everything you need to manage your invoicing, quotations, and customers in one seamless, beautiful interface.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <div v-for="(feature, index) in features" :key="index" class="group relative">
          <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10 -m-4"></div>
          
          <div class="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
            <Icon :icon="feature.icon" class="w-8 h-8" stroke-width="1.5" />
          </div>
          
          <h4 class="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{{ feature.title }}</h4>
          <p class="text-slate-600 leading-relaxed text-lg">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'LandingFeatures',
  components: {
    Icon
  },
  data() {
    return {
      features: [
        { icon: 'lucide:layers', title: 'Scalable Infrastructure', description: 'Scale effortlessly to meet growing demands with our flexible and robust cloud architecture.' },
        { icon: 'lucide:pie-chart', title: 'Real-time Analytics', description: 'Get instant insights into your revenue with real-time analytics, empowering data-driven decisions.' },
        { icon: 'lucide:shield', title: 'Enterprise Security', description: 'Rest easy knowing your financial data is protected with top-of-the-line encryption and security.' },
        { icon: 'lucide:mouse-pointer-2', title: 'Intuitive Interface', description: 'Enjoy a beautiful, user-friendly interface designed for seamless navigation and speed.' },
        { icon: 'lucide:clock', title: '24/7 Premium Support', description: 'Receive round-the-clock support from our dedicated team to ensure a smooth billing experience.' },
        { icon: 'lucide:workflow', title: 'Automated Workflows', description: 'Put invoicing on autopilot. Set up recurring billing and automatic payment reminders effortlessly.' }
      ]
    };
  }
});
</script>
