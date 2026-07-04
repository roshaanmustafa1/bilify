<template>
  <div class="template-selector bg-card border border-border shadow-sm rounded-lg p-6">
    <h2 class="text-xl font-semibold text-foreground mb-1">Invoice Templates</h2>
    <p class="text-muted-foreground text-sm mb-6">Select a default design template for your invoices and quotations.</p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="template in templates" 
        :key="template.id"
        @click="selectTemplate(template.id)"
        class="relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 group"
        :class="activeTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border bg-background'"
      >
        <div class="aspect-[3/4] rounded-lg bg-muted flex flex-col items-center justify-center mb-4 overflow-hidden border border-border/50 group-hover:bg-primary/10 transition-colors">
          <span class="text-4xl mb-2">{{ template.icon }}</span>
          <div class="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{{ template.name }}</div>
        </div>
        <div class="font-semibold text-foreground text-center">{{ template.name }}</div>
        <div class="text-xs text-muted-foreground text-center mt-1">{{ template.description }}</div>
        
        <div v-if="activeTemplate === template.id" class="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSettingsStore } from '../../store/settings'

export default {
  name: 'TemplateSelector',
  data() {
    return {
      templates: [
        { 
          id: 'TemplateMinimal', 
          name: 'Minimal', 
          icon: '✨',
          description: 'Clean space & simple dividers.'
        },
        { 
          id: 'TemplateCorporate', 
          name: 'Corporate', 
          icon: '🏢',
          description: 'Traditional solid header bands.'
        },
        { 
          id: 'TemplateCreative', 
          name: 'Creative', 
          icon: '🎨',
          description: 'Asymmetric with colored sidebar.'
        },
        { 
          id: 'TemplateElegant', 
          name: 'Elegant', 
          icon: '🖋️',
          description: 'Sophisticated typography focus.'
        }
      ]
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['app']),
    activeTemplate() {
      return this.app?.defaultTemplate || 'TemplateMinimal'
    }
  },
  methods: {
    ...mapActions(useSettingsStore, ['updateApp']),
    selectTemplate(id) {
      this.updateApp({ defaultTemplate: id })
    }
  }
}
</script>
