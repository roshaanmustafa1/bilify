<template>
  <div class="invoice-generator max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-8">
    <div class="flex items-center justify-between border-b border-border pb-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground tracking-tight">Invoice Generator</h1>
        <p class="text-muted-foreground mt-1">Orchestration workspace and print module integration.</p>
      </div>
      <Button @click="generatePDF" :disabled="isGeneratingPDF" class="min-w-[140px] shadow-sm">
        <span v-if="isGeneratingPDF" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Processing...
        </span>
        <span v-else class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download PDF
        </span>
      </Button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Left Column: Controls & Inputs -->
      <div class="xl:col-span-5 space-y-6">
        <!-- AI Parser Zone -->
        <AIInvoiceParser @parsed="handleParsedData" />
        
        <!-- Template Selector Component -->
        <TemplateSelector />
      </div>

      <!-- Right Column: Live Output Preview -->
      <div class="xl:col-span-7 bg-muted/20 rounded-xl p-4 md:p-8 flex items-start justify-center border border-border/50 overflow-x-auto">
        <div 
          id="invoice-render-container" 
          class="w-full max-w-[800px] bg-white shadow-xl transition-all duration-300 relative overflow-hidden"
          style="min-height: 1131px; min-width: 800px;"
        >
          <!-- Dynamic Rendering Directive -->
          <component 
            :is="activeTemplate" 
            :invoice="invoiceData" 
            :profile="resolvedProfile" 
            type="invoice" 
          />
          
          <div v-if="isGeneratingPDF" class="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50">
            <span class="text-foreground font-semibold flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-lg border border-border">
              <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Extracting Canvas Asset...
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useSettingsStore } from '../../../store/settings'
import { useCompanyProfilesStore } from '../../../store/modules/companyProfiles'

import AIInvoiceParser from '../../../components/invoices/AIInvoiceParser.vue'
import TemplateSelector from '../../../components/admin/TemplateSelector.vue'
import { Button } from '../../../components/ui/button'

import TemplateMinimal from '../../../components/invoices/templates/TemplateMinimal.vue'
import TemplateCorporate from '../../../components/invoices/templates/TemplateCorporate.vue'
import TemplateCreative from '../../../components/invoices/templates/TemplateCreative.vue'
import TemplateElegant from '../../../components/invoices/templates/TemplateElegant.vue'

export default {
  name: 'InvoiceGenerator',
  components: {
    AIInvoiceParser,
    TemplateSelector,
    Button,
    TemplateMinimal,
    TemplateCorporate,
    TemplateCreative,
    TemplateElegant
  },
  data() {
    return {
      isGeneratingPDF: false,
      invoiceData: {
        id: 'INV-TEMP',
        invoiceNumber: 'INV-1001',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        currency: 'USD',
        items: [
          { id: '1', name: 'Software Engineering Services', quantity: 10, price: 150, taxRate: 0 },
          { id: '2', name: 'UI/UX Design Alignment', quantity: 5, price: 120, taxRate: 0 }
        ],
        subtotal: 2100,
        taxTotal: 0,
        discount: 0,
        total: 2100,
        notes: 'Thank you for your business!',
        terms: 'Payment due upon receipt.',
        customer: {
          name: 'Acme Corporation',
          company: 'Acme Corp',
          email: 'billing@acmecorp.com',
          phone: '+1 (555) 987-6543',
          address: '456 Innovation Drive, Suite 200, Tech City, TC 90210'
        }
      },
      fallbackProfile: {
        name: 'Default Agency',
        address: '123 Main St, Remote City',
        email: 'hello@agency.com',
        phone: '+1 234 567 8900',
        bank: {
          bankName: 'Global Bank',
          accountName: 'Default Agency LLC',
          accountNumber: '000012345678'
        }
      }
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['app']),
    ...mapState(useCompanyProfilesStore, ['activeProfile']),
    activeTemplate() {
      return this.app?.defaultTemplate || 'TemplateMinimal'
    },
    resolvedProfile() {
      return this.activeProfile || this.fallbackProfile
    }
  },
  methods: {
    handleParsedData(parsedMap) {
      if (parsedMap) {
        // Map custom events from parsing modules into invoice properties
        this.invoiceData = { 
          ...this.invoiceData, 
          ...parsedMap 
        }
        
        // Ensure calculations run if items array is updated
        if (parsedMap.items) {
          const subtotal = parsedMap.items.reduce((acc, item) => acc + (item.quantity * item.price), 0)
          this.invoiceData.subtotal = subtotal
          this.invoiceData.total = subtotal - (this.invoiceData.discount || 0) + (this.invoiceData.taxTotal || 0)
        }
      }
    },
    generatePDF() {
      if (this.isGeneratingPDF) return
      
      this.isGeneratingPDF = true
      const element = document.getElementById('invoice-render-container')
      
      // Hook canvas extraction events onto html2canvas-pro using pure Promise pipelines
      import('html2canvas-pro')
        .then(({ default: html2canvas }) => {
          return html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
          })
        })
        .then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0)
          
          return import('html2pdf.js').then(({ default: html2pdf }) => {
            const wrapper = document.createElement('div')
            const img = document.createElement('img')
            img.src = imgData
            img.style.width = '100%'
            wrapper.appendChild(img)

            // Bind print execution anchors processing scaling definitions down to disk asset
            return html2pdf()
              .set({
                margin: 0,
                filename: `Invoice_${this.invoiceData.invoiceNumber || Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              })
              .from(wrapper)
              .save()
          })
        })
        .then(() => {
          this.isGeneratingPDF = false
        })
        .catch(error => {
          console.error('PDF Canvas Extraction Error:', error)
          this.isGeneratingPDF = false
        })
    }
  }
}
</script>
