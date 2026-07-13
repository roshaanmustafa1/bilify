<template>
  <section id="features" ref="containerRef" class="bg-slate-50 relative z-20">
    <!-- Header -->
    <div class="pt-32 pb-16 px-4">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Platform Capabilities</h2>
        <h3 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Designed for modern businesses.</h3>
        <p class="text-xl text-slate-600">Everything you need to manage your invoicing, quotations, and clients in one seamless, beautiful interface.</p>
      </div>
    </div>

    <!-- Pinned Scroll Layout -->
    <div class="max-w-7xl mx-auto px-4 pb-32 flex flex-col lg:flex-row gap-16 relative">
      
      <!-- Left side: Pinned Images -->
      <div class="hidden lg:block lg:w-1/2 relative">
        <div ref="pinnedImageContainer" class="sticky top-32 w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
          
          <!-- Image 1 -->
          <div ref="img1" class="absolute inset-0 w-full h-full flex items-center justify-center transition-all">
            <img src="../../assets/images/dashboard-dark.png" alt="Dashboard" class="w-full rounded-2xl shadow-2xl border border-slate-200/50" />
          </div>

          <!-- Image 2 -->
          <div ref="img2" class="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 scale-95 transition-all">
            <img src="../../assets/images/invoice-editor.png" alt="Invoice Editor" class="w-full rounded-2xl shadow-2xl border border-slate-200/50" />
          </div>

          <!-- Image 3 -->
          <div ref="img3" class="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 scale-95 transition-all">
            <div class="grid grid-cols-2 gap-4 w-full">
              <img src="../../assets/images/template-elegant.png" alt="Template Elegant" class="rounded-xl shadow-lg border border-slate-200/50 transform -translate-y-4" />
              <img src="../../assets/images/template-corporate.png" alt="Template Corporate" class="rounded-xl shadow-lg border border-slate-200/50 transform translate-y-4" />
            </div>
          </div>
          
          <!-- Image 4 -->
          <div ref="img4" class="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 scale-95 transition-all">
            <img src="../../assets/images/brand-identity.png" alt="Brand Identity" class="w-full rounded-2xl shadow-2xl border border-slate-200/50" />
          </div>
          
        </div>
      </div>

      <!-- Right side: Scrolling Text -->
      <div class="lg:w-1/2 space-y-32 py-32">
        
        <!-- Feature 1 -->
        <div class="feature-block h-screen lg:h-auto flex flex-col justify-center">
          <div class="lg:hidden w-full mb-8">
            <img src="../../assets/images/dashboard-dark.png" alt="Dashboard View" class="rounded-2xl shadow-xl w-full" />
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Icon icon="lucide:layout-dashboard" class="w-6 h-6" />
          </div>
          <h4 class="text-4xl font-bold text-slate-900 mb-6">Powerful Financial Dashboard</h4>
          <p class="text-xl text-slate-600 leading-relaxed mb-6">
            Get an instant overview of your business health. Track total invoices, quotations, and active clients in real-time. Toggle between light and dark modes for a comfortable viewing experience at any time of day.
          </p>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 text-slate-700">
              <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-emerald-500" />
              <span class="font-medium text-lg">Real-time metrics and analytics</span>
            </li>
            <li class="flex items-center gap-3 text-slate-700">
              <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-emerald-500" />
              <span class="font-medium text-lg">Quick actions for rapid workflows</span>
            </li>
          </ul>
        </div>

        <!-- Feature 2 -->
        <div class="feature-block h-screen lg:h-auto flex flex-col justify-center">
          <div class="lg:hidden w-full mb-8">
            <img src="../../assets/images/invoice-editor.png" alt="Invoice Editor" class="rounded-2xl shadow-xl w-full" />
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Icon icon="lucide:file-edit" class="w-6 h-6" />
          </div>
          <h4 class="text-4xl font-bold text-slate-900 mb-6">Intelligent Document Editor</h4>
          <p class="text-xl text-slate-600 leading-relaxed mb-6">
            Create perfect invoices and quotations in seconds. Our editor features a live preview that updates as you type, allowing you to instantly see exactly what your clients will receive.
          </p>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 text-slate-700">
              <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-emerald-500" />
              <span class="font-medium text-lg">Split-screen live preview</span>
            </li>
            <li class="flex items-center gap-3 text-slate-700">
              <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-emerald-500" />
              <span class="font-medium text-lg">AI Assistant to auto-fill details</span>
            </li>
          </ul>
        </div>

        <!-- Feature 3 -->
        <div class="feature-block h-screen lg:h-auto flex flex-col justify-center">
          <div class="lg:hidden w-full mb-8 grid grid-cols-2 gap-2">
            <img src="../../assets/images/template-elegant.png" alt="Templates" class="rounded-xl shadow-xl w-full" />
            <img src="../../assets/images/template-corporate.png" alt="Templates" class="rounded-xl shadow-xl w-full" />
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Icon icon="lucide:layout-template" class="w-6 h-6" />
          </div>
          <h4 class="text-4xl font-bold text-slate-900 mb-6">Stunning Professional Templates</h4>
          <p class="text-xl text-slate-600 leading-relaxed mb-6">
            Leave a lasting impression with beautifully crafted document templates. Switch seamlessly between Minimal, Corporate, Creative, and Elegant designs to perfectly match your brand identity.
          </p>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 text-slate-700">
              <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-emerald-500" />
              <span class="font-medium text-lg">One-click template switching</span>
            </li>
            <li class="flex items-center gap-3 text-slate-700">
              <Icon icon="lucide:check-circle-2" class="w-6 h-6 text-emerald-500" />
              <span class="font-medium text-lg">Pixel-perfect PDF exports</span>
            </li>
          </ul>
        </div>

        <!-- Feature 4 -->
        <div class="feature-block h-screen lg:h-auto flex flex-col justify-center">
          <div class="lg:hidden w-full mb-8">
            <img src="../../assets/images/brand-identity.png" alt="Brand Identity" class="rounded-2xl shadow-xl w-full" />
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Icon icon="lucide:building-2" class="w-6 h-6" />
          </div>
          <h4 class="text-4xl font-bold text-slate-900 mb-6">Manage Multiple Brands</h4>
          <p class="text-xl text-slate-600 leading-relaxed">
            Operating multiple companies? Bilify allows you to set up multiple brand identities, complete with custom logos, bank details, and localized currencies—all from a single account.
          </p>
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
  name: 'LandingFeatures',
  components: {
    Icon
  },
  setup() {
    const containerRef = ref(null);
    const pinnedImageContainer = ref(null);
    
    const img1 = ref(null);
    const img2 = ref(null);
    const img3 = ref(null);
    const img4 = ref(null);

    onMounted(() => {
      // Create ScrollTriggers for each feature block to swap the images
      const blocks = gsap.utils.toArray('.feature-block');
      const images = [img1.value, img2.value, img3.value, img4.value];

      blocks.forEach((block: any, i) => {
        ScrollTrigger.create({
          trigger: block,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            // Hide all
            images.forEach((img: any, index) => {
              gsap.to(img, { opacity: index === i ? 1 : 0, scale: index === i ? 1 : 0.95, duration: 0.5, ease: "power2.out" });
            });
          },
          onEnterBack: () => {
             images.forEach((img: any, index) => {
              gsap.to(img, { opacity: index === i ? 1 : 0, scale: index === i ? 1 : 0.95, duration: 0.5, ease: "power2.out" });
            });
          }
        });
      });
    });

    return {
      containerRef,
      pinnedImageContainer,
      img1, img2, img3, img4
    };
  }
});
</script>
