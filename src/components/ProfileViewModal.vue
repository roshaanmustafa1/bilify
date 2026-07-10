<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0" />
      <DialogContent
        :show-close-button="false"
        class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl p-0 gap-0 rounded-2xl shadow-2xl ring-1 ring-border bg-background flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-border bg-card shrink-0">
          <div class="flex items-center gap-3">
            <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
              <Icon icon="lucide:building-2" class="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p class="font-semibold text-base text-foreground leading-tight">
                Company Profile Details
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" @click="$emit('update:open', false)">
            <Icon icon="lucide:x" class="h-4 w-4" />
          </Button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div v-if="profile" class="space-y-6">
            
            <div class="flex items-start gap-4">
              <div v-if="profile.logo" class="w-16 h-16 border rounded overflow-hidden bg-muted flex items-center justify-center shrink-0">
                <img :src="profile.logo" alt="Logo" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="flex-1">
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Company Name</p>
                <p class="font-bold text-lg text-foreground">{{ profile.name || '—' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Email</p>
                <p class="font-medium text-foreground mt-1">{{ profile.email || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Phone</p>
                <p class="font-medium text-foreground mt-1">{{ profile.phone || '—' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Address</p>
                <p class="font-medium text-foreground mt-1 whitespace-pre-wrap">{{ profile.address || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Country</p>
                <p class="font-medium text-foreground mt-1">{{ profile.country || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Website</p>
                <p class="font-medium text-foreground mt-1">{{ profile.website || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Default Currency</p>
                <p class="font-medium text-foreground mt-1">{{ profile.currency || 'USD' }}</p>
              </div>
            </div>

            <div>
              <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Terms & Conditions</p>
              <div class="mt-1 p-3 bg-muted/50 rounded-lg text-sm text-foreground whitespace-pre-wrap">{{ profile.terms || '—' }}</div>
            </div>

            <div v-if="profile.bank" class="pt-4 border-t border-border">
              <h3 class="font-semibold text-foreground mb-3">Bank Details</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Account Name</p>
                  <p class="font-medium text-foreground mt-1">{{ profile.bank.accountName || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Account Number</p>
                  <p class="font-medium text-foreground mt-1">{{ profile.bank.accountNumber || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">IBAN</p>
                  <p class="font-medium text-foreground mt-1">{{ profile.bank.iban || '—' }}</p>
                </div>
                <div>
                  <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Bank Name</p>
                  <p class="font-medium text-foreground mt-1">{{ profile.bank.bankName || '—' }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-card shrink-0">
          <Button variant="outline" @click="$emit('update:open', false)">
            Close
          </Button>
          <Button @click="$emit('edit', profile)">
            <Icon icon="lucide:edit" class="h-4 w-4 mr-1.5" />
            Edit Profile
          </Button>
        </div>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Icon } from '@iconify/vue'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogPortal, DialogOverlay } from 'reka-ui'
import { Button } from './ui/button'

export default defineComponent({
  name: 'ProfileViewModal',
  components: { Icon, Dialog, DialogContent, DialogPortal, DialogOverlay, Button },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    profile: {
      type: Object as PropType<Record<string, any> | null>,
      default: null,
    },
  },
  emits: ['update:open', 'edit'],
})
</script>
