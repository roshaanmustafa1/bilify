<template>
 <Dialog :open="open" @update:open="$emit('update:open', $event)">
 <DialogContent class="sm:max-w-[500px]">
 <DialogHeader>
 <DialogTitle class="flex items-center text-purple-600">
 <Icon icon="lucide:sparkles" class="mr-2 h-5 w-5" />
 AI Assistant
 </DialogTitle>
 <p class="text-sm text-muted-foreground">
 Describe the invoice or quotation you want to create, and the AI will auto-fill the form for you.
 </p>
 </DialogHeader>
 
 <div class="py-4">
 <Textarea 
 v-model="prompt" 
 placeholder="E.g. Create an invoice for ABC Company. Add Website Development for $500, Hosting for $100, and 5% tax."
 rows="5"
 :disabled="loading"
 />
 <div v-if="error" class="mt-2 text-sm text-red-500">
 {{ error }}
 </div>
 </div>
 
 <DialogFooter>
 <Button variant="outline" @click="$emit('update:open', false)" :disabled="loading">Cancel</Button>
 <Button class="bg-purple-600 hover:bg-purple-700 text-primary-foreground" @click="handleGenerate" :disabled="loading || !prompt">
 <Icon v-if="loading" icon="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
 <Icon v-else icon="lucide:wand-2" class="mr-2 h-4 w-4" />
 {{ loading ? 'Generating...' : 'Generate' }}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { parseInvoicePrompt } from '../../services/grokService'

export default defineComponent({
 name: 'AIAssistantModal',
 components: {
 Icon, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
 Button, Textarea
 },
 props: {
 open: {
 type: Boolean,
 required: true
 }
 },
 emits: ['update:open', 'generated'],
 setup(_, { emit }) {
 const prompt = ref('')
 const loading = ref(false)
 const error = ref('')

 const handleGenerate = async () => {
 if (!prompt.value.trim()) return
 
 loading.value = true
 error.value = ''
 
 try {
 const data = await parseInvoicePrompt(prompt.value)
 emit('generated', data)
 prompt.value = ''
 emit('update:open', false)
 } catch (err: any) {
 error.value = err.message || 'An error occurred while generating.'
 } finally {
 loading.value = false
 }
 }

 return {
 prompt,
 loading,
 error,
 handleGenerate
 }
 }
})
</script>
