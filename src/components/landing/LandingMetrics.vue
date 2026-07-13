<template>
  <section ref="sectionRef" class="py-24 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-900"></div>
    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800/50">
        
        <div class="px-4 metric-block opacity-0 translate-y-10">
          <div class="text-5xl font-black mb-2 text-emerald-400 flex items-center justify-center">
            <span ref="num1">0</span>%
          </div>
          <div class="text-slate-400 font-medium">Uptime Guarantee</div>
        </div>
        
        <div class="px-4 metric-block opacity-0 translate-y-10">
          <div class="text-5xl font-black mb-2 text-emerald-400 flex items-center justify-center">
            <span ref="num2">0</span>M+
          </div>
          <div class="text-slate-400 font-medium">Invoices Generated</div>
        </div>
        
        <div class="px-4 metric-block opacity-0 translate-y-10">
          <div class="text-5xl font-black mb-2 text-emerald-400 flex items-center justify-center">
            <span ref="num3">0</span>k
          </div>
          <div class="text-slate-400 font-medium">Active Businesses</div>
        </div>
        
        <div class="px-4 metric-block opacity-0 translate-y-10">
          <div class="text-5xl font-black mb-2 text-emerald-400 flex items-center justify-center">
            <span ref="num4">0</span>/5
          </div>
          <div class="text-slate-400 font-medium">Customer Satisfaction</div>
        </div>

      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'LandingMetrics',
  setup() {
    const sectionRef = ref(null);
    const num1 = ref(null);
    const num2 = ref(null);
    const num3 = ref(null);
    const num4 = ref(null);

    onMounted(() => {
      // Staggered entry for blocks
      gsap.to('.metric-block', {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Number counting animation
      ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(num1.value, { innerHTML: 99.9, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 0.1 } });
          gsap.to(num2.value, { innerHTML: 2, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 1 } });
          gsap.to(num3.value, { innerHTML: 15, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 1 } });
          gsap.to(num4.value, { innerHTML: 4.9, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 0.1 } });
        }
      });
    });

    return { sectionRef, num1, num2, num3, num4 };
  }
});
</script>
