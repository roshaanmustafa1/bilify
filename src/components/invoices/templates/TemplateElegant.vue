<template>
  <div
    class="bg-background font-sans max-w-[800px] mx-auto p-6 text-sm text-foreground"
  >
    <!-- Elegant Header -->
    <div
      class="flex flex-col items-center justify-center border-b border-border/40 pb-10 mb-10 text-center"
    >
      <div v-if="sender.logo" class="w-42 h-auto mb-2">
        <img
          :src="sender.logo"
          alt="Logo"
          class="w-full h-full object-contain"
        />
      </div>
      <h1
        class="text-2xl font-light tracking-[0.2em] uppercase text-foreground mb-4"
      >
        {{ sender.name }}
      </h1>
      <div
        class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-light tracking-wide max-w-lg"
      >
        <span v-if="sender.address">{{ sender.address }}</span>
        <span v-if="sender.country">{{ sender.country }}</span>
        <span v-if="sender.phone">{{ sender.phone }}</span>
        <span v-if="sender.email">{{ sender.email }}</span>
        <span v-if="sender.website">{{ sender.website }}</span>
      </div>
    </div>

    <!-- Document Info & Client -->
    <div class="flex flex-row justify-between items-start mb-12 gap-0">
      <div class="space-y-4">
        <h2
          class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-4"
        >
          Invoice To
        </h2>

        <div class="text-foreground text-sm space-y-1">
          <div class="flex justify-between gap-4">
            <span class="font-light text-sm text-muted-foreground"
              >Client Name : </span
            >{{ customer ? customer.name : "N/A" }}
          </div>
          <div
            v-if="customer && customer.company"
            class="flex justify-between gap-4"
          >
            <span class="font-light text-sm text-muted-foreground"
              >Company : </span
            >{{ customer.company }}
          </div>
          <div
            v-if="customer && customer.address"
            class="flex justify-between gap-4"
          >
            <span class="font-light text-sm text-muted-foreground"
              >Address : </span
            >{{ customer.address }}
          </div>
          <div
            v-if="customer && customer.email"
            class="flex justify-between gap-4"
          >
            <span class="font-light text-sm text-muted-foreground"
              >Email : </span
            >{{ customer.email }}
          </div>
          <div
            v-if="customer && customer.phone"
            class="flex justify-between gap-4"
          >
            <span class="font-light text-sm text-muted-foreground"
              >Phone : </span
            >{{ customer.phone }}
          </div>
        </div>
      </div>

      <div class="space-y-4 text-right w-auto">
        <div
          class="text-3xl font-light tracking-widest uppercase text-foreground"
        >
          {{ type === "invoice" ? "Invoice" : "Quotation" }}
        </div>
        <div class="text-sm font-light space-y-1">
          <div class="flex justify-end gap-4">
            <span class="text-muted-foreground">Quotation Number :</span>
            <span class="font-medium text-foreground w-24">{{
              document.invoiceNumber || document.quotationNumber
            }}</span>
          </div>
          <div class="flex justify-end gap-4">
            <span class="text-muted-foreground">Date :</span>
            <span class="font-medium text-foreground w-24">{{
              document.date || "N/A"
            }}</span>
          </div>
          <div
            v-if="type === 'invoice' ? document.dueDate : document.validUntil"
            class="flex justify-end gap-4"
          >
            <span class="text-muted-foreground">Due Date :</span>
            <span class="font-medium text-foreground w-24">{{
              type === "invoice" ? document.dueDate : document.validUntil
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Items -->
    <div class="mb-12 overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th
              v-for="col in (document.invoiceColumns || [
                { id: 'name', label: 'Item Description' },
                { id: 'qty', label: 'Qty' },
                { id: 'price', label: 'Rate' },
                { id: 'rowTotal', label: 'Amount' }
              ])"
              :key="col.id"
              class="py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40"
              :class="[
                col.id === 'name' ? 'w-full text-left' : '',
                col.id === 'qty' ? 'text-center whitespace-nowrap px-4' : '',
                col.id === 'price' ? 'text-right whitespace-nowrap px-4' : '',
                col.id === 'rowTotal' ? 'text-right text-foreground whitespace-nowrap pl-4' : '',
                col.isCustom ? 'text-center whitespace-nowrap px-4' : ''
              ]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in document.items" :key="item.id">
            <td
              v-for="col in (document.invoiceColumns || [
                { id: 'name' }, { id: 'qty' }, { id: 'price' }, { id: 'rowTotal' }
              ])"
              :key="col.id"
              class="py-5 border-b border-border/20"
              :class="[
                col.id === 'name' ? 'pr-4 w-full' : '',
                col.id === 'qty' ? 'text-center font-light whitespace-nowrap px-4' : '',
                col.id === 'price' ? 'text-right font-light text-muted-foreground whitespace-nowrap px-4' : '',
                col.id === 'rowTotal' ? 'text-right font-medium text-foreground whitespace-nowrap pl-4' : '',
                col.isCustom ? 'text-center font-light text-foreground whitespace-nowrap px-4' : ''
              ]"
            >
              <div v-if="col.id === 'name'">
                <div class="font-medium text-foreground">{{ item.name }}</div>
                <div
                  v-if="item.description"
                  class="text-muted-foreground font-light text-xs mt-1"
                >
                  {{ item.description }}
                </div>
              </div>
              <template v-else-if="col.id === 'qty'">{{ item.quantity }}</template>
              <template v-else-if="col.id === 'price'">{{ formatCurrency(item.price) }}</template>
              <template v-else-if="col.id === 'rowTotal'">{{ formatCurrency(item.quantity * item.price) }}</template>
              <template v-else>
                {{ col.type === 'formula' ? formatCurrency(item[col.id]) : (item.customData?.[col.id] || '') }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary & Payment -->
    <div class="flex flex-row justify-between items-start gap-12">
      <div class="flex-1 space-y-8">
        <div v-if="bank && bank.accountName">
          <h3
            class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3"
          >
            Payment Details
          </h3>
          <div class="grid grid-cols-2 gap-y-2 text-xs font-light">
            <div class="text-muted-foreground">Bank</div>
            <div class="font-medium text-foreground">
              {{ bank.bankName || "N/A" }}
            </div>
            <div class="text-muted-foreground">Account</div>
            <div class="font-medium text-foreground">
              {{ bank.accountName || "N/A" }}
            </div>
            <div class="text-muted-foreground">Account No.</div>
            <div class="font-medium text-foreground">
              {{ bank.accountNumber || "N/A" }}
            </div>
            <div v-if="bank.iban" class="text-muted-foreground">IBAN</div>
            <div v-if="bank.iban" class="font-medium text-foreground">
              {{ bank.iban }}
            </div>
          </div>
        </div>

        <div v-if="document.projectName">
          <h3
            class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-2"
          >
            Project
          </h3>
          <p class="text-xs font-light">{{ document.projectName }}</p>
        </div>
      </div>

      <div class="w-64">
        <div class="space-y-3 font-light text-sm">
          <div class="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{{ formatCurrency(document.subtotal) }}</span>
          </div>
          <div
            v-if="document.taxTotal"
            class="flex justify-between text-muted-foreground"
          >
            <span>Tax{{ document.taxRate ? ` (${document.taxRate}%)` : '' }}</span>
            <span>+{{ formatCurrency(document.taxTotal) }}</span>
          </div>
          <div
            v-if="document.discount"
            class="flex justify-between text-muted-foreground"
          >
            <span>Discount{{ document.discountType === 'percentage' ? ` (${document.globalDiscount}%)` : '' }}</span>
            <span class="text-red-500">-{{ formatCurrency(document.discount) }}</span>
          </div>
          <div
            class="flex justify-between font-medium text-lg pt-4 border-t border-border/40 mt-2 text-foreground"
          >
            <span>Total Due</span>
            <span>{{ formatCurrency(document.total) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Notes -->
    <div
      class="mt-16 pt-8 border-t border-border/40 flex flex-row gap-8 text-xs font-light"
    >
      <div v-if="document.terms" class="w-1/2">
        <h4
          class="font-semibold uppercase tracking-widest text-muted-foreground mb-2"
        >
          Terms & Conditions
        </h4>
        <div class="text-muted-foreground whitespace-pre-line">
          {{ document.terms }}
        </div>
      </div>
      <div v-if="document.notes" class="w-1/2">
        <h4
          class="font-semibold uppercase tracking-widest text-muted-foreground mb-2"
        >
          Notes
        </h4>
        <div class="text-muted-foreground whitespace-pre-line">
          {{ document.notes }}
        </div>
      </div>
    </div>

    <div
      class="mt-12 text-center text-xs font-light text-muted-foreground tracking-wide"
    >
      Thank you for your business.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useSettingsStore } from "../../../store/settings";

export default defineComponent({
  name: "TemplateElegant",
  props: {
    type: { type: String, required: true },
    invoice: { type: Object, required: true },
    profile: { type: Object, required: true },
  },
  computed: {
    ...mapState(useSettingsStore, ['app']),
    document() {
      return this.invoice;
    },
    sender() {
      return this.profile;
    },
    customer() {
      return this.invoice?.customer || {};
    },
    bank() {
      return this.invoice?.bank || this.profile?.bank || {};
    }
  },
  methods: {
    formatCurrency(val: number) {
      const curr = this.invoice?.currency || this.app?.currency || 'USD';
      return `${val} ${curr}`;
    }
  }
});
</script>
