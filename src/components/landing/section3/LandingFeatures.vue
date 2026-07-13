<template>
  <section id="features" class="py-24 bg-white relative z-20 overflow-hidden">
    <!-- Decorative abstract shapes in background to match image -->
    <div class="absolute right-[-5%] top-[20%] w-[400px] h-[400px] bg-emerald-50 rounded-3xl rotate-12 z-0"></div>
    <div class="absolute right-[5%] bottom-[-10%] w-[300px] h-[300px] bg-emerald-100/50 rounded-3xl -rotate-12 z-0"></div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        <!-- Left Column -->
        <div class="w-full lg:w-5/12">
          <div class="text-emerald-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">FEATURE</div>
          <h2 class="text-4xl md:text-[2.75rem] leading-tight font-black text-slate-900 tracking-tight mb-10">
            Introducing Bilify AI
          </h2>

          <!-- Accordion -->
          <div class="space-y-0">
            <div 
              v-for="(item, index) in features" 
              :key="index"
              class="border-t border-slate-200 py-6 cursor-pointer"
              :class="{'border-b': index === features.length - 1}"
              @click="activeIndex = index"
            >
              <div class="flex justify-between items-center">
                <h3 
                  class="text-xl font-medium transition-colors duration-200"
                  :class="activeIndex === index ? 'text-slate-900' : 'text-slate-500'"
                >
                  {{ item.title }}
                </h3>
                <Icon 
                  :icon="activeIndex === index ? 'lucide:minus' : 'lucide:plus'" 
                  class="w-5 h-5 text-slate-400"
                />
              </div>
              
              <!-- Smooth height transition for accordion content -->
              <div 
                v-show="activeIndex === index"
                class="mt-4 text-slate-500 leading-relaxed pr-8 text-[15px]"
              >
                {{ item.description }}
              </div>
            </div>
          </div>

          <button class="mt-10 bg-[#35b58d] hover:bg-[#2c9876] text-white px-8 py-3.5 rounded font-medium text-base transition-colors shadow-lg shadow-emerald-500/20">
            Try Our AI
          </button>
        </div>

        <!-- Right Column -->
        <div class="w-full lg:w-7/12 relative">
          <div class="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative z-10 flex flex-col">
            
            <!-- Image Area -->
            <div class="p-3 bg-slate-50/50">
              <img src="../../../assets/images/dashboard-dark.png" alt="Dashboard View" class="w-full h-auto rounded-[1.5rem] shadow-sm border border-slate-200 object-cover" />
            </div>
            
            <!-- Bottom Text Area -->
            <div class="p-8 lg:p-10 bg-white">
              <h4 class="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span class="text-[#8b5cf6]">✨</span> Introducing Bilify AI
              </h4>
              <p class="text-slate-600 leading-relaxed text-[15px]">
                Our latest AI analyzes your billing data in real time and has 99% precision accuracy. With real time analysis, you can work seamlessly while generating professional invoices and quotations to increase your business productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Icon } from '@iconify/vue';

export default defineComponent({
  name: 'LandingFeatures',
  components: {
    Icon
  },
  setup() {
    const activeIndex = ref(0);
    const features = [
      {
        title: 'Manual & AI Generation',
        description: 'Our most advanced version yet — combining precision, speed, and real-time collaboration to supercharge your billing workflow.'
      },
      {
        title: 'Clear Instruction',
        description: 'Automatically extract data from your workflow to generate accurate invoices without manual data entry.'
      },
      {
        title: 'More \'Human\' Answers',
        description: 'Generate professional, tailored quotations in seconds. Easily convert approved quotes directly into active invoices.'
      },
      {
        title: 'Integrated',
        description: 'Accept payments seamlessly. Integrated directly into every invoice so you get paid faster with zero friction.'
      }
    ];

    return {
      activeIndex,
      features
    };
  }
});
</script>
