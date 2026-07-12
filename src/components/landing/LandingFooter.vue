<template>
  <footer class="bg-slate-50 border-t border-slate-200 py-16 px-16">
    <div
      class="mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div class="flex items-center gap-2 font-bold text-xl text-slate-900">
        <div
          class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
        >
          <Icon icon="lucide:zap" class="w-4 h-4 text-white" />
        </div>
        Bilify
      </div>
      <div class="flex items-center gap-8 text-sm font-bold text-slate-500">
        <a href="#" class="hover:text-primary transition-colors"
          >Privacy Policy</a
        >
        <a href="#" class="hover:text-primary transition-colors"
          >Terms of Service</a
        >
        <a href="#" class="hover:text-primary transition-colors">Contact</a>
      </div>
      <p class="text-slate-400 text-sm font-medium">
        &copy; 2026 Bilify, Inc. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "LandingFooter",
  components: {
    Icon,
  },
});
</script>
