<template>
  <div class="bg-background p-8 font-sans max-w-[800px] mx-auto text-sm">
    <!-- Header -->
    <div class="flex flex-row justify-between items-start mb-6 gap-0">
      <div>
        <h1 class="text-3xl font-bold text-primary mb-6">
          {{ sender.name }}
        </h1>
        <div class="flex flex-col space-y-1 text-muted-foreground">
          <div class="flex">
            <span class="w-32">{{
              type === "invoice" ? "Invoice No #" : "Quotation No #"
            }}</span>
            <span class="font-bold text-foreground">{{
              document.invoiceNumber || document.quotationNumber
            }}</span>
          </div>
          <div class="flex">
            <span class="w-32">{{
              type === "invoice" ? "Invoice Date #" : "Quotation Date #"
            }}</span>
            <span class="font-bold text-foreground">{{
              document.date || "N/A"
            }}</span>
          </div>
        </div>
      </div>
      <div class="w-26 h-auto flex items-center justify-center overflow-hidden">
        <img
          v-if="sender.logo"
          :src="sender.logo"
          alt="Logo"
          class="max-w-full max-h-full object-contain"
        />
        <svg
          v-else
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-full"
        >
          <path
            d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
            stroke="#4A154B"
            stroke-width="3"
          />
          <path
            d="M50 15L80 30V70L50 85L20 70V30L50 15Z"
            stroke="#1a2b6d"
            stroke-width="4"
          />
          <path
            d="M40 40L30 50L40 60M60 40L70 50L60 60M45 70L55 30"
            stroke="#1a2b6d"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="border-b border-border mb-8"></div>

    <!-- Info Section -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="bg-primary/10 p-5 rounded-lg">
        <h3 class="text-primary font-bold text-lg mb-3">Billed By</h3>
        <div class="space-y-1.5 text-foreground">
          <div v-if="sender.name">
            <span class="font-bold text-foreground">Company :</span>
            {{ sender.name }}
          </div>
          <div v-if="sender.country">
            <span class="font-bold text-foreground">Country :</span>
            {{ sender.country }}
          </div>
          <div v-if="sender.address">
            <span class="font-bold text-foreground">Address :</span>
            {{ sender.address }}
          </div>
          <div v-if="sender.email">
            <span class="font-bold text-foreground">Email :</span>
            {{ sender.email }}
          </div>
          <div v-if="sender.phone">
            <span class="font-bold text-foreground">Phone :</span>
            {{ sender.phone }}
          </div>
          <div v-if="sender.website">
            <span class="font-bold text-foreground">Website :</span>
            {{ sender.website }}
          </div>
        </div>
      </div>
      <div class="bg-primary/10 p-5 rounded-lg">
        <h3 class="text-primary font-bold text-lg mb-3">Billed To</h3>
        <div class="space-y-1.5 text-foreground">
          <div>
            <span class="font-bold text-foreground">Client Name :</span>
            {{ customer ? customer.name : "N/A" }}
          </div>
          <div v-if="customer && customer.company">
            <span class="font-bold text-foreground">Company :</span>
            {{ customer.company }}
          </div>
          <div v-if="customer && customer.address">
            <span class="font-bold text-foreground">Address :</span>
            {{ customer.address }}
          </div>
          <div v-if="customer && customer.email">
            <span class="font-bold text-foreground">Email :</span>
            {{ customer.email }}
          </div>
          <div v-if="customer && customer.phone">
            <span class="font-bold text-foreground">Phone :</span>
            {{ customer.phone }}
          </div>
          <div v-if="document.projectName">
            <span class="font-bold text-foreground">Project Name :</span>
            {{ document.projectName }}
          </div>
          <div
            v-if="type === 'invoice' ? document.dueDate : document.validUntil"
          >
            <span class="font-bold text-foreground">Expiry Date :</span>
            {{ type === "invoice" ? document.dueDate : document.validUntil }}
          </div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mb-12 border-b border-border overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr class="bg-primary text-primary-foreground">
            <th
              class="py-3 px-4 font-normal text-sm border-r border-white/20 w-1/2"
            >
              Items Detail
            </th>
            <th
              class="py-3 px-4 font-normal text-sm text-center border-r border-white/20"
            >
              Quantity
            </th>
            <th
              class="py-3 px-4 font-normal text-sm text-center border-r border-white/20"
            >
              Rate
            </th>
            <th class="py-3 px-4 font-normal text-sm text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in document.items"
            :key="item.id"
            :class="index % 2 === 0 ? 'bg-background' : 'bg-primary/10/50'"
          >
            <td class="py-4 px-4">
              <div class="flex">
                <span class="text-muted-foreground mr-2"
                  >{{ String(index + 1).padStart(2, "0") }}.</span
                >
                <div>
                  <span class="text-foreground">{{ item.name }}</span>
                  <div
                    v-if="item.description"
                    class="text-muted-foreground text-xs mt-1"
                  >
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </td>
            <td class="py-4 px-4 text-center text-foreground">
              {{ String(item.quantity).padStart(2, "0") }}
            </td>
            <td class="py-4 px-4 text-center text-foreground">
              {{ formatCurrency(item.price) }}
            </td>
            <td class="py-4 px-4 text-center text-foreground">
              {{ formatCurrency(item.quantity * item.price) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer Section -->
    <div class="grid grid-cols-2 gap-12 mb-12">
      <div class="bg-primary/10 p-5 rounded-lg h-fit relative">
        <h3 class="text-primary font-bold text-lg pb-3 border-b border-border">
          Account Details
        </h3>
        <div class="space-y-1.5 text-foreground mt-3">
          <div>
            <span class="font-bold text-foreground">Account Holder Name :</span>
            {{ bank.accountName || sender.name }}
          </div>
          <div>
            <span class="font-bold text-foreground">Account Number :</span>
            {{ bank.accountNumber || "N/A" }}
          </div>
          <div>
            <span class="font-bold text-foreground">IBAN :</span>
            {{ bank.iban || "N/A" }}
          </div>
          <div>
            <span class="font-bold text-foreground">Bank :</span>
            {{ bank.bankName || "N/A" }}
          </div>
        </div>
      </div>

      <div>
        <div
          class="flex justify-between border-t border-b border-border py-3 mb-6"
        >
          <span class="text-foreground font-medium text-base"
            >Total Amount :</span
          >
          <span class="text-foreground font-medium text-base">{{
            formatCurrency(document.total)
          }}</span>
        </div>

        <div>
          <p class="font-bold text-foreground text-sm mb-3">
            Terms and Conditions :
          </p>
          <div class="text-xs text-foreground space-y-1">
            <div
              v-for="(line, idx) in (document.terms || '').split('\n')"
              :key="idx"
              class="flex gap-2"
            >
              <span>{{ idx + 1 }} :</span>
              <span>{{ line }}</span>
            </div>
          </div>
        </div>

        <div v-if="document.notes" class="mt-4">
          <p class="font-bold text-foreground text-sm mb-3">Notes :</p>
          <div class="text-xs text-foreground whitespace-pre-line">
            {{ document.notes }}
          </div>
        </div>
      </div>
    </div>

    <div class="text-center text-xs text-muted-foreground mt-12 pb-4">
      This is an electronically generated document, no signature is required.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useSettingsStore } from "../../../store/settings";

export default defineComponent({
  name: "TemplateMinimal",
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
