<template>
  <footer class="py-4 text-center mt-auto border-t border-border shrink-0">
    <!-- The Secret Trigger -->
    <p 
      class="text-[10px] uppercase tracking-widest text-muted-foreground cursor-default select-none hover:text-foreground transition-colors"
      @click="handleSecretClick"
    >
      Bilify v1.0.0
    </p>

    <StealthAdminModal v-model:open="isModalOpen" />
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StealthAdminModal from './StealthAdminModal.vue'

export default defineComponent({
  name: 'AppFooter',
  components: {
    StealthAdminModal
  },
  data() {
    return {
      clickCount: 0,
      clickTimer: null as any,
      isModalOpen: false
    }
  },
  methods: {
    handleSecretClick() {
      this.clickCount++
      
      clearTimeout(this.clickTimer)
      this.clickTimer = setTimeout(() => {
        this.clickCount = 0
      }, 2000)

      if (this.clickCount >= 5) {
        this.clickCount = 0
        this.isModalOpen = true
      }
    }
  }
})
</script>
