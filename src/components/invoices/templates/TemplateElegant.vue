<template>
  <div class="bg-background font-sans max-w-[800px] mx-auto p-12 text-sm text-foreground">
    
    <!-- Elegant Header -->
    <div class="flex flex-col items-center justify-center border-b border-border/40 pb-10 mb-10 text-center">
      <div v-if="sender.logo" class="w-16 h-16 mb-6">
        <img :src="sender.logo" alt="Logo" class="w-full h-full object-contain" />
      </div>
      <h1 class="text-2xl font-light tracking-[0.2em] uppercase text-foreground mb-4">
        {{ sender.name }}
      </h1>
      <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-light tracking-wide max-w-lg">
        <span v-if="sender.address">{{ sender.address }}</span>
        <span v-if="sender.country">{{ sender.country }}</span>
        <span v-if="sender.phone">{{ sender.phone }}</span>
        <span v-if="sender.email">{{ sender.email }}</span>
        <span v-if="sender.website">{{ sender.website }}</span>
      </div>
    </div>

    <!-- Document Info & Client -->
    <div class="flex justify-between items-start mb-12">
      <div class="space-y-4">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-4">
          Invoice To
        </h2>
        <div class="font-medium text-lg text-foreground">{{ customer ? customer.name : "N/A" }}</div>
        <div v-if="customer && customer.company" class="text-foreground">{{ customer.company }}</div>
        <div class="text-muted-foreground font-light text-xs space-y-1">
          <div v-if="customer && customer.address">{{ customer.address }}</div>
          <div v-if="customer && customer.email">{{ customer.email }}</div>
          <div v-if="customer && customer.phone">{{ customer.phone }}</div>
        </div>
      </div>
      
      <div class="space-y-4 text-right">
        <h2 class="text-3xl font-light tracking-widest uppercase text-foreground">
          {{ type === "invoice" ? "Invoice" : "Quotation" }}
        </h2>
        <div class="text-sm font-light space-y-1 pt-2">
          <div class="flex justify-end gap-4">
            <span class="text-muted-foreground">Number:</span>
            <span class="font-medium text-foreground w-24">{{ document.invoiceNumber || document.quotationNumber }}</span>
          </div>
          <div class="flex justify-end gap-4">
            <span class="text-muted-foreground">Date:</span>
            <span class="font-medium text-foreground w-24">{{ document.date || "N/A" }}</span>
          </div>
          <div v-if="type === 'invoice' ? document.dueDate : document.validUntil" class="flex justify-end gap-4">
            <span class="text-muted-foreground">Due:</span>
            <span class="font-medium text-foreground w-24">{{ type === "invoice" ? document.dueDate : document.validUntil }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Items -->
    <div class="mb-12">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr>
            <th class="py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 w-1/2">Item Description</th>
            <th class="py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 text-center">Qty</th>
            <th class="py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 text-right">Rate</th>
            <th class="py-3 text-xs font-semibold uppercase tracking-widest text-foreground border-b border-border/40 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in document.items" :key="item.id">
            <td class="py-5 border-b border-border/20 pr-4">
              <div class="font-medium text-foreground">{{ item.name }}</div>
              <div v-if="item.description" class="text-muted-foreground font-light text-xs mt-1">{{ item.description }}</div>
            </td>
            <td class="py-5 border-b border-border/20 text-center font-light">{{ item.quantity }}</td>
            <td class="py-5 border-b border-border/20 text-right font-light text-muted-foreground">{{ formatCurrency(item.price) }}</td>
            <td class="py-5 border-b border-border/20 text-right font-medium text-foreground">{{ formatCurrency(item.quantity * item.price) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary & Payment -->
    <div class="flex justify-between items-start gap-12">
      <div class="flex-1 space-y-8">
        <div v-if="bank && bank.accountName">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3">
            Payment Details
          </h3>
          <div class="grid grid-cols-2 gap-y-2 text-xs font-light">
            <div class="text-muted-foreground">Bank</div>
            <div class="font-medium text-foreground">{{ bank.bankName || 'N/A' }}</div>
            <div class="text-muted-foreground">Account</div>
            <div class="font-medium text-foreground">{{ bank.accountName || 'N/A' }}</div>
            <div class="text-muted-foreground">Account No.</div>
            <div class="font-medium text-foreground">{{ bank.accountNumber || 'N/A' }}</div>
            <div v-if="bank.iban" class="text-muted-foreground">IBAN</div>
            <div v-if="bank.iban" class="font-medium text-foreground">{{ bank.iban }}</div>
          </div>
        </div>

        <div v-if="document.projectName">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-2">Project</h3>
          <p class="text-xs font-light">{{ document.projectName }}</p>
        </div>
      </div>

      <div class="w-64">
        <div class="space-y-3 font-light text-sm">
          <div class="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{{ formatCurrency(document.subtotal) }}</span>
          </div>
          <div v-if="document.taxTotal" class="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{{ formatCurrency(document.taxTotal) }}</span>
          </div>
          <div v-if="document.discount" class="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>-{{ formatCurrency(document.discount) }}</span>
          </div>
          <div class="flex justify-between font-medium text-lg pt-4 border-t border-border/40 mt-2 text-foreground">
            <span>Total Due</span>
            <span>{{ formatCurrency(document.total) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Notes -->
    <div class="mt-16 pt-8 border-t border-border/40 grid grid-cols-2 gap-8 text-xs font-light">
      <div v-if="document.terms">
        <h4 class="font-semibold uppercase tracking-widest text-muted-foreground mb-2">Terms & Conditions</h4>
        <div class="text-muted-foreground whitespace-pre-line">{{ document.terms }}</div>
      </div>
      <div v-if="document.notes">
        <h4 class="font-semibold uppercase tracking-widest text-muted-foreground mb-2">Notes</h4>
        <div class="text-muted-foreground whitespace-pre-line">{{ document.notes }}</div>
      </div>
    </div>

    <div class="mt-12 text-center text-xs font-light text-muted-foreground tracking-wide">
      Thank you for your business.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useSettingsStore } from "../../../store/settings";

export default defineComponent({
  name: "TemplateElegant",
  props: {
    type: { type: String, required: true },
    invoice: { type: Object, required: true },
    profile: { type: Object, required: true },
  },
  setup(props) {
    const settingsStore = useSettingsStore();
    const formatCurrency = (val: number) => {
      const curr = props.invoice?.currency || settingsStore.app.currency;
      return `${val} ${curr}`;
    };
    
    const document = computed(() => props.invoice);
    const sender = computed(() => props.profile);
    const customer = computed(() => props.invoice.customer);
    const bank = computed(() => props.invoice.bank || props.profile.bank || {});

    return {
      document,
      sender,
      customer,
      bank,
      formatCurrency
    };
  }
});
</script>
