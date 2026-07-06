<template>
  <div class="bg-background dark:bg-card overflow-hidden shadow md:shadow-md rounded-2xl md:rounded-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center border md:border-transparent dark:border-border">
    <div class="flex-shrink-0 mb-3 md:mb-0">
      <div class="rounded-xl md:rounded-md p-2 md:p-3 w-fit" :class="bgClass">
        <Icon :icon="icon" class="h-5 w-5 md:h-6 md:w-6" :class="iconClass" />
      </div>
    </div>
    <div class="md:ml-5 flex-1">
      <dl>
        <dt class="text-[11px] md:text-sm font-medium text-muted-foreground dark:text-muted-foreground truncate mb-1 md:mb-0">
          {{ title }}
        </dt>
        <dd>
          <div class="text-xl md:text-2xl font-bold text-foreground dark:text-primary-foreground">
            {{ value }}
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Icon } from '@iconify/vue'

export default defineComponent({
 name: 'StatCard',
 components: {
 Icon
 },
 props: {
 title: {
 type: String,
 required: true
 },
 value: {
 type: [String, Number],
 required: true
 },
 icon: {
 type: String,
 required: true
 },
 color: {
 type: String,
 default: 'blue'
 }
 },
  setup(props) {
    const bgClass = computed(() => {
      const colors: Record<string, string> = {
        blue: 'bg-blue-100 dark:bg-blue-900/30 md:bg-blue-500 md:dark:bg-blue-500',
        green: 'bg-green-100 dark:bg-green-900/30 md:bg-green-500 md:dark:bg-green-500',
        purple: 'bg-purple-100 dark:bg-purple-900/30 md:bg-purple-500 md:dark:bg-purple-500',
        orange: 'bg-orange-100 dark:bg-orange-900/30 md:bg-orange-500 md:dark:bg-orange-500',
        red: 'bg-red-100 dark:bg-red-900/30 md:bg-red-500 md:dark:bg-red-500'
      }
      return colors[props.color] || colors.blue
    })

    const iconClass = computed(() => {
      const colors: Record<string, string> = {
        blue: 'text-blue-600 dark:text-blue-400 md:text-white',
        green: 'text-green-600 dark:text-green-400 md:text-white',
        purple: 'text-purple-600 dark:text-purple-400 md:text-white',
        orange: 'text-orange-600 dark:text-orange-400 md:text-white',
        red: 'text-red-600 dark:text-red-400 md:text-white'
      }
      return colors[props.color] || colors.blue
    })

    return {
      bgClass,
      iconClass
    }
  }
})
</script>
