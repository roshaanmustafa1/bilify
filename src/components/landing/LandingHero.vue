<template>
  <section
    class="relative w-full min-h-screen pt-32 pb-32 overflow-hidden bg-[#030a06] flex flex-col items-center justify-center font-sans text-white"
  >
    <Aurora
      :color-stops="['#171D22', '#7cff67', '#171D22']"
      :blend="0.8"
      :amplitude="1.0"
      :speed="0.8"
      class="absolute inset-0 z-0 opacity-80 pointer-events-none"
    />
    <!-- Background Connecting Lines -->
    <div
      class="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <svg
        class="absolute w-full h-full opacity-20"
        viewBox="0 0 1400 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Horizontal & Vertical dashed lines -->
        <path
          d="M 0 450 L 1400 450"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />
        <path
          d="M 700 0 L 700 900"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />

        <!-- Curved and angled connecting lines like the image -->
        <!-- Left curve -->
        <path
          d="M 250 150 L 250 400 Q 250 450 300 450 L 400 450"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />
        <path
          d="M 250 750 L 250 500 Q 250 450 200 450 L 0 450"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />

        <!-- Right curve -->
        <path
          d="M 1150 150 L 1150 400 Q 1150 450 1200 450 L 1400 450"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />
        <path
          d="M 1150 750 L 1150 500 Q 1150 450 1100 450 L 1000 450"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />

        <!-- Line connecting middle elements -->
        <path
          d="M 500 650 L 900 650"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />
        <path
          d="M 700 650 L 700 700"
          stroke="rgba(255,255,255,0.2)"
          stroke-width="1.5"
          stroke-dasharray="6 6"
        />

        <!-- Arrows/Dots -->
        <circle cx="250" cy="150" r="4" fill="rgba(255,255,255,0.4)" />
        <path
          d="M 245 135 L 250 125 L 255 135 Z"
          fill="rgba(255,255,255,0.4)"
        />

        <circle cx="1150" cy="150" r="4" fill="rgba(255,255,255,0.4)" />
        <path
          d="M 1145 165 L 1150 175 L 1155 165 Z"
          fill="rgba(255,255,255,0.4)"
        />

        <circle cx="250" cy="750" r="4" fill="rgba(255,255,255,0.4)" />
        <path
          d="M 245 765 L 250 775 L 255 765 Z"
          fill="rgba(255,255,255,0.4)"
        />

        <circle cx="1150" cy="750" r="4" fill="rgba(255,255,255,0.4)" />
        <path
          d="M 1145 735 L 1150 725 L 1155 735 Z"
          fill="rgba(255,255,255,0.4)"
        />

        <circle cx="700" cy="700" r="4" fill="rgba(255,255,255,0.4)" />
        <path
          d="M 695 715 L 700 725 L 705 715 Z"
          fill="rgba(255,255,255,0.4)"
        />
      </svg>
    </div>

    <!-- Main Content -->
    <div
      class="relative z-10 max-w-8xl mx-auto px-4 flex flex-col items-center text-center w-full"
    >
      <BlurText
        text="Smart Invoice & Quotation Generator"
        :delay="150"
        animate-by="words"
        direction="top"
        class="text-[3.5rem] md:text-[5.5rem] font-bold text-white tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto mt-16 font-sans justify-center"
      />

      <div
        ref="containerRef"
        class="relative inline-block max-w-2xl mx-auto mb-12"
      >
        <VariableProximity
          label="Bilify automates your billing workflow with AI-driven invoices, quotations, and secure payments, speeding up your business."
          class="text-lg md:text-xl text-slate-300 font-normal leading-relaxed text-center block"
          from-font-variation-settings="'wght' 400, 'opsz' 9"
          to-font-variation-settings="'wght' 800, 'opsz' 40"
          :container-ref="containerRef"
          :radius="100"
          falloff="linear"
        />
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4">
        <button
          class="px-8 py-4 rounded-full text-[15px] font-semibold text-white bg-gradient-to-r from-[#29855b] to-[#144b33] hover:from-[#237550] hover:to-[#103a27] shadow-[0_8px_20px_rgba(41,133,91,0.25)] transition-all"
        >
          Get started
        </button>
        <button
          class="px-8 py-4 rounded-full text-[15px] font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-sm"
        >
          View live demo
        </button>
      </div>

      <!-- Floating Elements Container -->
      <div
        class="absolute inset-0 w-full h-full pointer-events-none -z-10 hidden lg:block"
      >
        <!-- Top Left: Toggle Stats -->
        <div
          ref="float1"
          class="absolute top-[35%] left-[8%] bg-[#0a1913]/60 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 w-60"
        >
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <span class="text-[15px] font-medium text-slate-300"
                >8<span class="text-xs text-slate-500">hr</span></span
              >
              <span class="text-[11px] text-slate-400 font-medium"
                >Manual Billing</span
              >
            </div>
            <div
              class="w-8 h-[18px] bg-white/10 rounded-full flex items-center px-[2px]"
            >
              <div class="w-3.5 h-3.5 bg-white/50 rounded-full shadow-sm"></div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-[15px] font-bold text-emerald-400"
                >0.5<span class="text-xs text-emerald-600">hr</span></span
              >
              <span class="text-[11px] text-white font-semibold"
                >With Bilify</span
              >
            </div>
            <div
              class="w-8 h-[18px] bg-emerald-500/80 rounded-full flex items-center justify-end px-[2px]"
            >
              <div class="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        <!-- Top Right: Shield -->
        <div
          ref="float2"
          class="absolute top-[38%] right-[8%] bg-[#0a1913]/60 backdrop-blur-xl rounded-[20px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center"
        >
          <div
            class="flex items-center gap-1.5 mb-6 text-[12px] font-medium text-slate-300"
          >
            <Icon
              icon="lucide:check-circle-2"
              class="text-emerald-500 w-4 h-4"
            />
            Secured Proxy Protection
          </div>
          <div
            class="w-[84px] h-[84px] rounded-[24px] bg-emerald-500/10 relative flex items-center justify-center"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-[110%] h-[110%] rounded-full border border-dashed border-emerald-500/30 opacity-60 animate-spin-slow"
              ></div>
              <div
                class="absolute w-[130%] h-[130%] rounded-full border border-dashed border-emerald-500/20 opacity-40 animate-spin-slow"
                style="animation-direction: reverse; animation-duration: 12s"
              ></div>
            </div>
            <div
              class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] z-10"
            >
              <Icon icon="lucide:shield-check" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Layout Section -->
      <div
        class="mt-28 relative w-full max-w-5xl h-auto flex flex-col md:flex-row justify-between items-center gap-10 lg:gap-0 lg:px-4 z-10"
      >
        <!-- Bottom Left: Invoice Templates -->
        <div
          ref="float3"
          class="bg-[#0a1913]/60 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 w-64 lg:w-72 lg:-translate-y-8 relative pointer-events-auto"
        >
          <div class="text-[12px] font-semibold text-white mb-4 ml-1">
            Invoice Templates
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div
              class="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-sm"
            >
              <img
                src="@/assets/images/template-corporate.png"
                class="w-full h-full object-cover object-top opacity-90"
              />
            </div>
            <div
              class="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-sm"
            >
              <img
                src="@/assets/images/template-creative.png"
                class="w-full h-full object-cover object-top opacity-90"
              />
            </div>
            <div
              class="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-sm"
            >
              <img
                src="@/assets/images/template-elegant.png"
                class="w-full h-full object-cover object-top opacity-90"
              />
            </div>
            <div
              class="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-sm"
            >
              <img
                src="@/assets/images/template-minimal.png"
                class="w-full h-full object-cover object-top opacity-90"
              />
            </div>
          </div>
        </div>

        <!-- Middle: TrustLine Connections -->
        <div
          class="relative flex items-center justify-center lg:translate-y-6 pointer-events-auto"
        >
          <!-- Connected Icons (Left side of middle) -->
          <div
            class="absolute -left-16 -top-4 w-8 h-8 bg-[#0a1913]/80 backdrop-blur-md rounded-full shadow-md border border-white/10 flex items-center justify-center z-10"
          >
            <Icon icon="simple-icons:github" class="w-4 h-4 text-white" />
          </div>
          <div
            class="absolute -left-20 top-8 w-10 h-10 bg-[#0a1913]/80 backdrop-blur-md rounded-[14px] shadow-md border border-white/10 flex items-center justify-center z-10"
          >
            <Icon icon="lucide:droplets" class="w-5 h-5 text-blue-400" />
          </div>
          <div
            class="absolute -left-12 bottom-0 w-8 h-8 bg-[#0a1913]/80 backdrop-blur-md rounded-full shadow-md border border-white/10 flex items-center justify-center z-10"
          >
            <Icon icon="lucide:slack" class="w-4 h-4 text-purple-400" />
          </div>

          <!-- Connecting small lines -->
          <svg
            class="absolute -left-20 top-1/2 -translate-y-1/2 w-24 h-28 -z-10 pointer-events-none"
            viewBox="0 0 100 120"
          >
            <path
              d="M 20 20 Q 50 60 90 60"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
            />
            <path
              d="M 10 60 L 90 60"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
            />
            <path
              d="M 20 100 Q 50 60 90 60"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
            />
          </svg>

          <div
            class="bg-gradient-to-r from-[#29855b] to-[#144b33] text-white px-6 py-3 rounded-full text-[14px] font-bold shadow-[0_10px_30px_rgba(41,133,91,0.35)] flex items-center gap-2 relative z-20 border border-white/10"
          >
            <div class="bg-white/20 rounded-full p-[2px]">
              <Icon icon="lucide:zap" class="w-3.5 h-3.5 text-white" />
            </div>
            Bilify AI
          </div>

          <!-- Right dots connecting to right panel -->
          <div
            class="absolute -right-12 top-1/2 -translate-y-1/2 flex gap-1.5 items-center"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            ></div>
            <svg class="w-16" viewBox="0 0 50 10">
              <path
                d="M 0 5 L 50 5"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-width="1.5"
                stroke-dasharray="3 3"
              />
            </svg>
          </div>
        </div>

        <!-- Bottom Right: AI & Automations -->
        <div
          ref="float4"
          class="bg-[#0a1913]/60 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 w-72 lg:w-80 relative lg:translate-y-4 pointer-events-auto"
        >
          <div
            class="absolute -top-4 right-8 bg-[#0a1913] border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.5)] px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 z-20"
          >
            <Icon icon="lucide:bot" class="w-3.5 h-3.5 text-amber-400" /> AI &
            Automations
          </div>

          <div class="grid grid-cols-3 gap-y-8 gap-x-2 relative mt-3 z-10">
            <!-- connecting center lines -->
            <div
              class="absolute inset-0 flex items-center justify-center -z-10"
            >
              <svg
                class="w-full h-[90%]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M 16 16 L 50 50 L 84 16"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="2.5"
                />
                <path
                  d="M 16 84 L 50 50 L 84 84"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="2.5"
                />
                <path
                  d="M 50 16 L 50 84"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="2.5"
                />
              </svg>
            </div>

            <div class="flex flex-col items-center gap-1.5 bg-transparent">
              <div
                class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center ring-4 ring-[#0a1913]"
              >
                <Icon icon="lucide:file-text" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-medium text-slate-300"
                >Invoice</span
              >
            </div>
            <div class="flex flex-col items-center gap-1.5 opacity-0">
              <div class="w-10 h-10 rounded-full bg-white/10"></div>
              <span class="text-[10px] text-slate-400">Hidden</span>
            </div>
            <div class="flex flex-col items-center gap-1.5 bg-transparent">
              <div
                class="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center ring-4 ring-[#0a1913]"
              >
                <Icon icon="lucide:file-signature" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-medium text-slate-300">Quote</span>
            </div>

            <div class="flex flex-col items-center gap-1.5 bg-transparent">
              <div
                class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center ring-4 ring-[#0a1913]"
              >
                <Icon icon="lucide:bot" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-medium text-slate-300">AI</span>
            </div>
            <div
              class="flex flex-col items-center justify-center bg-transparent rounded-xl"
            >
              <div
                class="w-[52px] h-[52px] rounded-[16px] bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(245,158,11,0.2)] border border-amber-500/30 ring-4 ring-[#0a1913] z-10"
              >
                <Icon icon="lucide:layers" class="w-6 h-6" />
              </div>
            </div>
            <div class="flex flex-col items-center gap-1.5 bg-transparent">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-4 ring-[#0a1913]"
              >
                <Icon icon="lucide:brain" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-medium text-slate-300">Brain</span>
            </div>

            <div
              class="col-start-2 flex flex-col items-center gap-1.5 bg-transparent"
            >
              <div
                class="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-4 ring-[#0a1913]"
              >
                <Icon icon="lucide:receipt" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-medium text-slate-300"
                >Receipt</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import BlurText from "@/components/BlurText.vue";
import VariableProximity from "@/components/VariableProximity.vue";
import Aurora from "@/components/Aurora.vue";
import gsap from "gsap";

export default defineComponent({
  name: "LandingHero",
  components: {
    Icon,
    BlurText,
    VariableProximity,
    Aurora,
  },
  setup() {
    const containerRef = ref(null);
    const float1 = ref(null);
    const float2 = ref(null);
    const float3 = ref(null);
    const float4 = ref(null);

    onMounted(() => {
      // Setup floating animations using GSAP
      const floatOptions = {
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      };

      if (float1.value)
        gsap.to(float1.value, {
          y: "+=15",
          scale: 1.02,
          duration: 3.5,
          ...floatOptions,
        });
      if (float2.value)
        gsap.to(float2.value, {
          y: "-=10",
          scale: 1.03,
          duration: 4,
          delay: 0.5,
          ...floatOptions,
        });
      if (float3.value)
        gsap.to(float3.value, {
          y: "+=12",
          scale: 1.02,
          duration: 3.8,
          delay: 1,
          ...floatOptions,
        });
      if (float4.value)
        gsap.to(float4.value, {
          y: "-=15",
          scale: 1.01,
          duration: 4.2,
          delay: 0.2,
          ...floatOptions,
        });
    });

    return {
      containerRef,
      float1,
      float2,
      float3,
      float4,
    };
  },
});
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
