<template>
 <div class="bg-background dark:bg-card overflow-hidden shadow rounded-lg p-5">
 <div class="flex items-center">
 <div class="flex-shrink-0">
 <div class="rounded-md p-3" :class="colorClass">
 <Icon :icon="icon" class="h-6 w-6 text-primary-foreground" />
 </div>
 </div>
 <div class="ml-5 w-0 flex-1">
 <dl>
 <dt class="text-sm font-medium text-muted-foreground dark:text-muted-foreground truncate">
 {{ title }}
 </dt>
 <dd>
 <div class="text-2xl font-bold text-foreground dark:text-primary-foreground">
 {{ value }}
 </div>
 </dd>
 </dl>
 </div>
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
 const colorClass = computed(() => {
 const colors: Record<string, string> = {
 blue: 'bg-blue-500',
 green: 'bg-green-500',
 purple: 'bg-purple-500',
 orange: 'bg-orange-500',
 red: 'bg-red-500'
 }
 return colors[props.color] || colors.blue
 })

 return {
 colorClass
 }
 }
})
</script>
