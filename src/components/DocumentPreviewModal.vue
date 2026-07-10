<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0" />
      <DialogContent
        :show-close-button="false"
        class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[90vh] p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-background flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card shrink-0">
          <div class="flex items-center gap-3">
            <div :class="[
              'p-2 rounded-lg',
              type === 'invoice' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
            ]">
              <Icon
                :icon="type === 'invoice' ? 'lucide:file-text' : 'lucide:file-signature'"
                :class="[
                  'h-4 w-4',
                  type === 'invoice' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
                ]"
              />
            </div>
            <div>
              <p class="font-semibold text-sm text-foreground leading-tight">
                {{ docNumber }}
              </p>
              <p class="text-xs text-muted-foreground">{{ type === 'invoice' ? 'Invoice' : 'Quotation' }} Preview</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Badge
              v-if="document"
              :variant="statusVariant"
              class="text-xs"
            >
              {{ document.status }}
            </Badge>
            <Button variant="ghost" size="icon" @click="$emit('update:open', false)">
              <Icon icon="lucide:x" class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Scrollable Preview Body -->
        <div class="overflow-y-auto flex-1 bg-muted/30">
          <div v-if="document" class="py-6 px-4 flex justify-center">
            <div class="w-full max-w-3xl shadow-lg rounded-lg overflow-hidden">
              <InvoicePreview
                :type="type"
                :document="document"
                element-id="modal-invoice-preview"
              />
            </div>
          </div>
          <div v-else class="flex items-center justify-center py-20 text-muted-foreground">
            <Icon icon="lucide:loader-2" class="h-6 w-6 animate-spin mr-2" />
            Loading preview…
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-card shrink-0">
          <Button variant="outline" @click="$emit('update:open', false)">
            Close
          </Button>
          <Button @click="$emit('edit', document)">
            <Icon icon="lucide:edit" class="h-4 w-4 mr-1.5" />
            Edit {{ type === 'invoice' ? 'Invoice' : 'Quotation' }}
          </Button>
        </div>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogPortal, DialogOverlay } from 'reka-ui'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import InvoicePreview from './invoices/InvoicePreview.vue'

export default defineComponent({
  name: 'DocumentPreviewModal',
  components: { Icon, Dialog, DialogContent, DialogPortal, DialogOverlay, Button, Badge, InvoicePreview },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String as () => 'invoice' | 'quotation',
      required: true,
    },
    document: {
      type: Object as () => Record<string, any> | null,
      default: null,
    },
  },
  emits: ['update:open', 'edit'],
  setup(props) {
    const docNumber = computed(() => {
      if (!props.document) return ''
      return props.type === 'invoice'
        ? props.document.invoiceNumber
        : props.document.quotationNumber
    })

    const statusVariant = computed(() => {
      const s = props.document?.status
      if (!s) return 'outline'
      if (s === 'Paid' || s === 'Accepted') return 'default'
      if (s === 'Rejected') return 'destructive'
      if (s === 'Saved') return 'success'
      return 'outline'
    })

    return { docNumber, statusVariant }
  }
})
</script>
