<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md p-6 rounded-xl shadow-2xl bg-background border-border flex flex-col">
        
        <DialogHeader>
          <DialogTitle class="text-xl font-bold text-destructive flex items-center gap-2">
            <Icon icon="lucide:shield-alert" class="w-5 h-5" />
            Stealth Admin Access
          </DialogTitle>
        </DialogHeader>

        <!-- PIN Entry State -->
        <div v-if="!isUnlocked" class="space-y-4 mt-4">
          <p class="text-sm text-muted-foreground">Enter master PIN to unlock admin controls.</p>
          <Input 
            v-model="pin" 
            type="password" 
            placeholder="****" 
            class="text-center tracking-widest text-lg"
            @keyup.enter="verifyPin"
          />
          <div v-if="error" class="text-xs text-destructive">{{ error }}</div>
          <Button class="w-full" variant="destructive" @click="verifyPin">Unlock</Button>
        </div>

        <!-- Unlocked State: User List -->
        <div v-else class="space-y-4 mt-4">
          <div class="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
            <div>
              <p class="text-sm font-semibold text-foreground">Impersonation Status</p>
              <p class="text-xs text-muted-foreground">
                {{ isImpersonating ? `Active (${impersonatedUserId})` : 'Inactive' }}
              </p>
            </div>
            <Button v-if="isImpersonating" size="sm" variant="outline" @click="stopImpersonating">
              Stop
            </Button>
          </div>

          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Select User to Impersonate</p>
            <div 
              v-for="user in mockUsers" 
              :key="user.id"
              class="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors"
              @click="handleImpersonate(user.id)"
            >
              <div>
                <p class="text-sm font-medium text-foreground">{{ user.name }}</p>
                <p class="text-xs text-muted-foreground">{{ user.email }}</p>
              </div>
              <Icon icon="lucide:chevron-right" class="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useAdminStore } from '../store/admin'
import { Icon } from '@iconify/vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { DialogPortal, DialogOverlay } from 'reka-ui'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default defineComponent({
  name: 'StealthAdminModal',
  components: { Icon, Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay, Button, Input },
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:open'],
  data() {
    return {
      isUnlocked: false,
      pin: '',
      error: '',
      // Mock data - normally fetched from public.profiles where role = 'user'
      mockUsers: [
        { id: '1111-2222', name: 'Alice Corp', email: 'alice@example.com' },
        { id: '3333-4444', name: 'Bob Freelance', email: 'bob@example.com' }
      ]
    }
  },
  computed: {
    ...mapState(useAdminStore, ['isImpersonating', 'impersonatedUserId'])
  },
  methods: {
    ...mapActions(useAdminStore, ['startImpersonating', 'stopImpersonating']),
    
    verifyPin() {
      // Hardcoded for demo - in prod, verify against backend
      if (this.pin === '9999') {
        this.isUnlocked = true
        this.error = ''
      } else {
        this.error = 'Invalid PIN.'
        this.pin = ''
      }
    },
    handleImpersonate(id: string) {
      this.startImpersonating(id)
      this.$emit('update:open', false) // close modal after picking
    }
  },
  watch: {
    // Reset state when modal closes
    open(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.isUnlocked = false
          this.pin = ''
          this.error = ''
        }, 300)
      }
    }
  }
})
</script>
