<template>
  <section ref="sectionRef" class="py-20 bg-[#144b33] text-white relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        <div class="px-4 metric-block opacity-0 translate-y-10 flex flex-col items-center justify-center">
          <div class="text-5xl md:text-6xl font-normal mb-3 text-white flex items-center justify-center tracking-tight">
            <span ref="num1">0</span>x
          </div>
          <div class="text-white/80 font-medium text-sm md:text-base">Faster Invoicing</div>
        </div>
        
        <div class="px-4 metric-block opacity-0 translate-y-10 flex flex-col items-center justify-center">
          <div class="text-5xl md:text-6xl font-normal mb-3 text-white flex items-center justify-center tracking-tight">
            <span ref="num2">0</span>.2M
          </div>
          <div class="text-white/80 font-medium text-sm md:text-base">Invoices Generated</div>
        </div>
        
        <div class="px-4 metric-block opacity-0 translate-y-10 flex flex-col items-center justify-center">
          <div class="text-5xl md:text-6xl font-normal mb-3 text-white flex items-center justify-center tracking-tight">
            <span ref="num3">0</span>%
          </div>
          <div class="text-white/80 font-medium text-sm md:text-base">Customer Satisfaction</div>
        </div>
        
        <div class="px-4 metric-block opacity-0 translate-y-10 flex flex-col items-center justify-center">
          <div class="text-5xl md:text-6xl font-normal mb-3 text-white flex items-center justify-center tracking-tight">
            <span ref="num4">0</span>%
          </div>
          <div class="text-white/80 font-medium text-sm md:text-base">Lower Error</div>
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
          gsap.to(num1.value, { innerHTML: 5, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 1 } });
          gsap.to(num2.value, { innerHTML: 1, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 1 } }); // To make 1.2M, we start from 0.2M and animate the 1.
          gsap.to(num3.value, { innerHTML: 98, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 1 } });
          gsap.to(num4.value, { innerHTML: 30, duration: 2.5, ease: 'power2.out', snap: { innerHTML: 1 } });
        }
      });
    });

    return { sectionRef, num1, num2, num3, num4 };
  }
});
</script>
