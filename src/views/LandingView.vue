<template>
  <div
    class="min-h-screen bg-[#f8fafc] text-slate-900 font-sans w-full overflow-x-hidden selection:bg-primary/20"
  >
    <div class="w-full container-fluid mx-auto">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingMetrics />
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
import LandingHero from "../components/landing/LandingHero.vue";
import LandingFeatures from "../components/landing/LandingFeatures.vue";
import LandingMetrics from "../components/landing/LandingMetrics.vue";
import LandingPricing from "../components/landing/LandingPricing.vue";
import LandingFAQ from "../components/landing/LandingFAQ.vue";
import LandingCTA from "../components/landing/LandingCTA.vue";
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
