<template>
  <div class="min-h-screen w-full flex bg-background font-sans">
    <!-- Left Section -->
    <div class="w-full lg:w-[45%] flex flex-col relative p-6 bg-white">
      <div class="flex-1 flex items-center justify-center mt-8">
        <div class="w-full max-w-[360px]">
          <router-view />
        </div>
      </div>
    </div>

    <!-- Right Section (Hidden on Mobile) -->
    <div class="hidden lg:flex flex-1 p-4 bg-white">
      <div
        class="w-full h-full rounded-[2rem] relative overflow-hidden flex flex-col justify-center items-center bg-[#0d2a1f]"
      >
        <!-- ColorBends background -->
        <div class="absolute inset-0 z-0 opacity-80">
          <ColorBends
            :colors="['#0a2e20', '#175239', '#104a34']"
            :rotation="45"
            :speed="0.1"
            :scale="2"
            :frequency="3"
            :warp-strength="1"
            :mouse-influence="1"
            :noise="0.1"
            :parallax="0.5"
            :iterations="4"
            :intensity="1"
            :band-width="4"
            :transparent="true"
          />
        </div>

        <div
          class="relative z-10 w-full p-8 h-full flex flex-col justify-between"
        >
          <h1
            class="text-[6.5rem] font-serif italic text-white mb-1 leading-[1.1] tracking-tight"
          >
            Enter<br />
            the Future
          </h1>
          <h2 class="text-6xl text-white font-light mb-20 tracking-tight">
            of Invoicing today
          </h2>

          <!-- UI Mockup Graphic -->
          <div class="relative mt-12 w-full flex items-end justify-end gap-4">
            <!-- Bottom left mini square -->
            <div
              class="w-14 h-14 bg-white rounded-[1rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] z-30 flex items-center justify-center"
            >
              <div
                class="w-10 h-10 bg-[#123e2d] rounded-[0.5rem] flex items-center justify-center"
              >
                <Icon icon="lucide:zap" class="w-5 h-5 text-white" />
              </div>
            </div>
            <!-- Side nav pill (Capsule) -->
            <div
              class="w-12 bg-white rounded-full flex flex-col items-center justify-between py-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] h-[170px] z-20"
            >
              <div
                class="w-8 h-8 rounded-full bg-[#e8f1ec] flex items-center justify-center text-[#175239]"
              >
                <Icon
                  icon="lucide:home"
                  class="w-[18px] h-[18px]"
                  stroke-width="2.5"
                />
              </div>
              <div class="flex flex-col gap-1.5 opacity-40">
                <div class="flex gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                </div>
                <div class="flex gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                </div>
              </div>
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400"
              >
                <Icon icon="lucide:settings" class="w-5 h-5" />
              </div>
            </div>

            <div
              class="bg-[#fcfdfd] rounded-[1.5rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] w-[360px] relative z-10 border border-white/50"
            >
              <!-- Faint top-left icon -->
              <div class="mb-10 text-emerald-500/40">
                <Icon icon="lucide:bot" class="w-6 h-6" />
              </div>

              <h3 class="text-3xl font-extrabold text-gray-900 tracking-tight">
                45,231.00 $
              </h3>
              <p class="text-[12px] text-gray-400 font-medium mb-16">
                Total Invoiced (This Month)
              </p>

              <div class="flex justify-between items-end mb-8">
                <div>
                  <p class="text-[13px] font-bold text-gray-900 mb-0.5">
                    AI Quotations
                  </p>
                  <p
                    class="text-[11px] text-gray-500 font-medium tracking-wider"
                  >
                    Win rate: 94%
                  </p>
                </div>
                <p class="text-[13px] font-bold text-gray-900">142 Sent</p>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span
                  class="text-gray-300 font-extrabold italic tracking-widest text-xl"
                  >BILIFY AI</span
                >
                <div
                  class="px-4 py-1.5 bg-[#f0f2f4] rounded-full text-[11px] font-bold text-gray-600 transition-colors hover:bg-gray-200 cursor-pointer"
                >
                  View Reports
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";
import ColorBends from "../components/ColorBends.vue";

export default defineComponent({
  name: "AuthLayout",
  components: { Icon, ColorBends },
});
</script>
