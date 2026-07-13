<template>
  <div
    class="min-h-screen bg-[#f8fafc] text-slate-900 font-sans w-full overflow-x-hidden selection:bg-primary/20"
  >
    <div class="w-full container-fluid mx-auto">
      <LandingHeader />
      <LandingHero />
      <LandingMetrics />
      <LandingFeatures />
      <LandingPricing />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LandingHeader from "../components/landing/LandingHeader.vue";
import LandingHero from "../components/landing/section1/LandingHero.vue";
import LandingMetrics from "../components/landing/section2/LandingMetrics.vue";
import LandingFeatures from "../components/landing/section3/LandingFeatures.vue";
import LandingPricing from "../components/landing/section4/LandingPricing.vue";
import LandingFAQ from "../components/landing/section5/LandingFAQ.vue";
import LandingCTA from "../components/landing/section6/LandingCTA.vue";
import LandingFooter from "../components/landing/LandingFooter.vue";

export default defineComponent({
  name: "LandingView",
  components: {
    LandingHeader,
    LandingHero,
    LandingFeatures,
    LandingMetrics,
    LandingPricing,
    LandingFAQ,
    LandingCTA,
    LandingFooter,
  },
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
