<template>
  <div
    class="bg-card text-card-foreground shadow-sm rounded-2xl p-6 flex flex-col justify-between border border-border/50 h-full relative overflow-hidden group hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-medium text-background">{{ title }}</h3>
      <div
        v-if="percentage"
        :class="[
          'px-2 py-0.5 rounded-md text-xs font-semibold',
          percentageColor === 'green'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        ]"
      >
        {{ percentage }}
      </div>
    </div>

    <div class="mb-2">
      <div class="text-3xl font-bold tracking-tight text-background">
        {{ value }}
      </div>
    </div>

    <div
      v-if="trendText"
      class="flex items-center gap-1.5 text-xs text-background mt-auto pt-2"
    >
      <svg
        class="w-4 h-4 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
      <span class="text-background">{{ trendText }}</span>
    </div>

    <!-- Decorative faint gradient spot on hover -->
    <div
      class="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "StatCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    percentage: {
      type: String,
      default: "",
    },
    percentageColor: {
      type: String,
      default: "green", // 'green' or 'red'
    },
    trendText: {
      type: String,
      default: "",
    },
  },
});
</script>
