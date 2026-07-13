<template>
  <section
    class="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white py-24"
  >
    <!-- Soft radial background glows -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-100/60 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-4 text-center relative z-10">
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-8"
      >
        <span class="w-2 h-2 bg-emerald-500 rounded-sm rotate-45"></span>
        Bilify Platform
      </div>

      <!-- Heading -->
      <h2
        class="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto"
      >
        Start Generating AI Invoices Today
      </h2>

      <!-- Subtitle -->
      <p class="text-slate-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
        Don't hesitate to reach out if you need assistance getting started with
        your billing automation.
      </p>

      <!-- CTAs -->
      <div class="flex items-center justify-center gap-4 mb-16">
        <router-link
          to="/auth/register"
          class="bg-gradient-to-r from-[#29855b] to-[#144b33] text-white px-8 py-3.5 rounded-xl font-bold text-base hover:opacity-90 transition-all duration-200 shadow-lg shadow-emerald-900/20"
        >
          Start for Free
        </router-link>
        <router-link
          to="/auth/register"
          class="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          Contact Sales
        </router-link>
      </div>

      <!-- Floating icons LEFT -->
      <div
        class="absolute left-8 lg:left-24 top-1/3 flex flex-col gap-6 pointer-events-none"
      >
        <div
          class="w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center"
        >
          <Icon icon="lucide:mail" class="w-6 h-6 text-slate-700" />
        </div>
        <div
          class="w-12 h-12 bg-gradient-to-br from-[#29855b] to-[#144b33] rounded-2xl shadow-lg flex items-center justify-center ml-4"
        >
          <Icon icon="lucide:zap" class="w-6 h-6 text-white" />
        </div>
      </div>

      <!-- Floating icons RIGHT -->
      <div
        class="absolute right-8 lg:right-24 top-1/3 flex flex-col gap-6 pointer-events-none"
      >
        <div
          class="w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center"
        >
          <Icon icon="lucide:bot" class="w-6 h-6 text-slate-700" />
        </div>
        <div
          class="w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mr-4"
        >
          <span class="flex gap-0.5">
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span class="w-3 h-3 rounded-full bg-slate-800"></span>
          </span>
        </div>
      </div>

      <!-- Dashboard Screenshot -->
      <div class="relative mx-auto max-w-7xl">
        <!-- Browser chrome bar -->
        <div
          class="bg-slate-100 rounded-t-2xl border border-b-0 border-slate-200 px-4 py-2.5 flex items-center gap-2"
        >
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <div
            class="flex-1 bg-white rounded-md text-center text-[10px] text-slate-400 py-1 mx-4 border border-slate-200"
          >
            https://bilify.app/dashboard
          </div>
          <div class="w-16"></div>
        </div>
        <!-- Screenshot image -->
        <div
          class="border border-t-0 border-slate-200 rounded-b-2xl overflow-hidden shadow-2xl shadow-emerald-100"
        >
          <img
            src="@/assets/images/dashboard-light.png"
            alt="Bilify Dashboard"
            class="w-full h-auto object-cover object-top"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "LandingCTA",
  components: { Icon },
});
</script>
