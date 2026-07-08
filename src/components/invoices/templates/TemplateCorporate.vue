<template>
  <div
    class="bg-background font-sans max-w-[800px] mx-auto text-sm border border-border/50 shadow-sm"
  >
    <!-- Header Band -->
    <div
      class="bg-primary text-primary-foreground p-6 flex justify-between items-start"
    >
      <div>
        <h1 class="text-3xl font-bold mb-2">
          {{ type === "invoice" ? "INVOICE" : "QUOTATION" }}
        </h1>
        <div class="text-primary-foreground/80">
          <div class="flex gap-4">
            <span class="w-24 font-semibold">Ref Number:</span>
            <span>{{
              document.invoiceNumber || document.quotationNumber
            }}</span>
          </div>
          <div class="flex gap-4 mt-1">
            <span class="w-24 font-semibold">Date:</span>
            <span>{{ document.date || "N/A" }}</span>
          </div>
        </div>
      </div>
      <div
        class="w-24 h-24 bg-white p-2 rounded shadow-sm flex items-center justify-center"
      >
        <img
          v-if="sender.logo"
          :src="sender.logo"
          alt="Logo"
          class="max-w-full max-h-full object-contain"
        />
        <div v-else class="text-primary font-bold text-xs text-center">
          {{ sender.name }}
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Info Section -->
      <div class="flex flex-col md:flex-row gap-8 mb-10">
        <div class="w-full md:w-1/2 border border-border rounded-sm">
          <div
            class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs"
          >
            From
          </div>
          <div class="p-4 space-y-1.5 text-muted-foreground">
            <div v-if="sender.name">
              <span class="font-bold text-foreground">Company: </span>
              {{ sender.name }}
            </div>
            <div v-if="sender.address">
              <span class="font-bold text-foreground">Address: </span>
              {{ sender.address }}
            </div>
            <div v-if="sender.country">
              <span class="font-bold text-foreground">Country: </span>
              {{ sender.country }}
            </div>
            <div v-if="sender.email">
              <span class="font-bold text-foreground">Email: </span>
              {{ sender.email }}
            </div>
            <div v-if="sender.phone">
              <span class="font-bold text-foreground">Phone: </span>
              {{ sender.phone }}
            </div>
            <div v-if="sender.website">
              <span class="font-bold text-foreground">Website: </span>
              {{ sender.website }}
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/2 border border-border rounded-sm">
          <div
            class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs"
          >
            Billed To
          </div>
          <div class="p-4 space-y-1.5 text-muted-foreground">
            <div>
              <span class="font-bold text-foreground">Name: </span>
              {{ customer ? customer.name : "N/A" }}
            </div>
            <div v-if="customer && customer.company">
              <span class="font-bold text-foreground">Company: </span>
              {{ customer.company }}
            </div>
            <div v-if="customer && customer.address">
              <span class="font-bold text-foreground">Address: </span>
              {{ customer.address }}
            </div>
            <div v-if="customer && customer.email">
              <span class="font-bold text-foreground">Email: </span>
              {{ customer.email }}
            </div>
            <div v-if="customer && customer.phone">
              <span class="font-bold text-foreground">Phone: </span>
              {{ customer.phone }}
            </div>
            <div
              v-if="document.projectName"
              class="mt-2 pt-2 border-t border-border border-dashed"
            >
              <span class="font-bold text-foreground">Project: </span
              >{{ document.projectName }}
            </div>
            <div
              v-if="type === 'invoice' ? document.dueDate : document.validUntil"
            >
              <span class="font-bold text-foreground">Expiry Date: </span>
              {{ type === "invoice" ? document.dueDate : document.validUntil }}
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-10 overflow-x-auto">
        <table
          class="w-full text-left border-collapse border border-border min-w-[500px]" style="table-layout: fixed;"
        >
          <thead>
            <tr class="bg-muted">
              <th
                class="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-r border-border text-foreground w-[50%]"
              >
                Description
              </th>
              <th
                class="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-r border-border text-foreground text-center w-[15%]"
              >
                Qty
              </th>
              <th
                class="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-r border-border text-foreground text-center w-[15%]"
              >
                Unit Price
              </th>
              <th
                class="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-border text-foreground text-center w-[20%]"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in document.items"
              :key="item.id"
              class="border-b border-border"
            >
              <td class="py-3 px-4 border-r border-border">
                <div class="font-semibold text-foreground">{{ item.name }}</div>
                <div
                  v-if="item.description"
                  class="text-muted-foreground text-xs mt-1"
                >
                  {{ item.description }}
                </div>
              </td>
              <td class="py-3 px-4 text-center border-r border-border">
                {{ item.quantity }}
              </td>
              <td class="py-3 px-4 text-center border-r border-border">
                {{ formatCurrency(item.price) }}
              </td>
              <td class="py-3 px-4 text-center font-medium">
                {{ formatCurrency(item.quantity * item.price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Section -->
      <div class="flex flex-col md:flex-row justify-between items-start gap-8">
        <div class="flex-1 space-y-6">
          <div
            v-if="bank && bank.accountName"
            class="border border-border rounded-sm"
          >
            <div
              class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs"
            >
              Payment Information
            </div>
            <div class="p-4 text-xs space-y-1">
              <div>
                <span class="font-semibold w-24 inline-block">Bank:</span>
                {{ bank.bankName }}
              </div>
              <div>
                <span class="font-semibold w-24 inline-block"
                  >Account Name:</span
                >
                {{ bank.accountName }}
              </div>
              <div>
                <span class="font-semibold w-24 inline-block">Account No:</span>
                {{ bank.accountNumber }}
              </div>
              <div v-if="bank.iban">
                <span class="font-semibold w-24 inline-block">IBAN:</span>
                {{ bank.iban }}
              </div>
            </div>
          </div>

          <div v-if="document.terms" class="text-xs">
            <p class="font-bold uppercase tracking-wider mb-2 text-foreground">
              Terms & Conditions
            </p>
            <div class="text-muted-foreground space-y-1">
              <div v-for="(line, idx) in document.terms.split('\n')" :key="idx">
                {{ line }}
              </div>
            </div>
          </div>

          <div v-if="document.notes" class="text-xs">
            <p class="font-bold uppercase tracking-wider mb-2 text-foreground">
              Notes
            </p>
            <div class="text-muted-foreground">{{ document.notes }}</div>
          </div>
        </div>

        <div class="w-full md:w-64 border border-border rounded-sm">
          <div
            class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs"
          >
            Summary
          </div>
          <div class="p-4 space-y-3">
            <div class="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(document.subtotal) }}</span>
            </div>
            <div
              v-if="document.taxTotal"
              class="flex justify-between text-muted-foreground"
            >
              <span>Tax:</span>
              <span>{{ formatCurrency(document.taxTotal) }}</span>
            </div>
            <div
              v-if="document.discount"
              class="flex justify-between text-red-500"
            >
              <span>Discount:</span>
              <span>-{{ formatCurrency(document.discount) }}</span>
            </div>
            <div
              class="pt-3 border-t border-border flex justify-between font-bold text-lg text-foreground"
            >
              <span>Total:</span>
              <span>{{ formatCurrency(document.total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-16 text-center text-xs text-muted-foreground border-t border-border pt-4"
      >
        This document is computer generated and requires no signature.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useSettingsStore } from "../../../store/settings";

export default defineComponent({
  name: "TemplateCorporate",
  props: {
    type: { type: String, required: true },
    invoice: { type: Object, required: true },
    profile: { type: Object, required: true },
  },
  computed: {
    ...mapState(useSettingsStore, ["app"]),
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
    },
  },
  methods: {
    formatCurrency(val: number) {
      const curr = this.invoice?.currency || this.app?.currency || "USD";
      return `${val} ${curr}`;
    },
  },
});
</script>
