<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0" />
      <DialogContent
        :show-close-button="false"
        class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg p-0 gap-0 rounded-2xl shadow-2xl ring-1 ring-border bg-background flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-border bg-card shrink-0">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <Icon icon="lucide:user" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="font-semibold text-base text-foreground leading-tight">
                Customer Details
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" @click="$emit('update:open', false)">
            <Icon icon="lucide:x" class="h-4 w-4" />
          </Button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div v-if="customer" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Name</p>
                <p class="font-medium text-foreground mt-1">{{ customer.name || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Company</p>
                <p class="font-medium text-foreground mt-1">{{ customer.company || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Email</p>
                <p class="font-medium text-foreground mt-1">{{ customer.email || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Phone</p>
                <p class="font-medium text-foreground mt-1">{{ customer.phone || '—' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Address</p>
                <p class="font-medium text-foreground mt-1 whitespace-pre-wrap">{{ customer.address || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Country</p>
                <p class="font-medium text-foreground mt-1">{{ customer.country || '—' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Project Name</p>
                <p class="font-medium text-foreground mt-1">{{ customer.projectName || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-card shrink-0">
          <Button variant="outline" @click="$emit('update:open', false)">
            Close
          </Button>
          <Button @click="$emit('edit', customer)">
            <Icon icon="lucide:edit" class="h-4 w-4 mr-1.5" />
            Edit Customer
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
  name: 'CustomerViewModal',
  components: { Icon, Dialog, DialogContent, DialogPortal, DialogOverlay, Button },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    customer: {
      type: Object as PropType<Record<string, any> | null>,
      default: null,
    },
  },
  emits: ['update:open', 'edit'],
})
</script>
