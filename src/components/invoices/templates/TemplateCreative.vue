<template>
  <div
    class="bg-background font-sans max-w-[800px] mx-auto text-sm shadow-sm flex min-h-[800px]"
  >
    <!-- Sidebar -->
    <div
      class="w-1/3 bg-primary/10 p-4 border-r border-primary/20 flex flex-col"
    >
      <div class="mb-10 flex-shrink-0">
        <div
          class="w-52 h-auto bg-white p-2 rounded-xl shadow-sm flex items-center justify-center mb-6"
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
        <h2 class="text-xl font-bold text-primary mb-4">{{ sender.name }}</h2>
        <div class="space-y-3 text-foreground text-xs">
          <div v-if="sender.address" class="flex gap-2">
            <svg
              class="w-4 h-4 text-primary mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span
              >{{ sender.address }}<br v-if="sender.country" />{{
                sender.country
              }}</span
            >
          </div>
          <div v-if="sender.phone" class="flex gap-2 items-center">
            <svg
              class="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            <span>{{ sender.phone }}</span>
          </div>
          <div v-if="sender.email" class="flex gap-2 items-center">
            <svg
              class="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <span>{{ sender.email }}</span>
          </div>
          <div v-if="sender.website" class="flex gap-2 items-center">
            <svg
              class="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              ></path>
            </svg>
            <span>{{ sender.website }}</span>
          </div>
        </div>
      </div>

      <div class="mt-auto">
        <h3
          class="text-primary font-bold mb-3 uppercase tracking-wider text-xs"
        >
          Payment Details
        </h3>
        <div class="bg-background/50 p-4 rounded-xl space-y-2 text-xs">
          <div>
            <span
              class="text-muted-foreground block text-[10px] uppercase tracking-wide"
              >Bank Name</span
            >
            <span class="font-medium text-foreground">{{
              bank.bankName || "N/A"
            }}</span>
          </div>
          <div>
            <span
              class="text-muted-foreground block text-[10px] uppercase tracking-wide"
              >Account Name</span
            >
            <span class="font-medium text-foreground">{{
              bank.accountName || "N/A"
            }}</span>
          </div>
          <div>
            <span
              class="text-muted-foreground block text-[10px] uppercase tracking-wide"
              >Account Number</span
            >
            <span class="font-medium text-foreground">{{
              bank.accountNumber || "N/A"
            }}</span>
          </div>
          <div v-if="bank.iban">
            <span
              class="text-muted-foreground block text-[10px] uppercase tracking-wide"
              >IBAN</span
            >
            <span class="font-medium text-foreground">{{ bank.iban }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-2/3 p-6 flex flex-col bg-background">
      <div
        class="flex justify-between items-end mb-6 border-b-2 border-primary/20 pb-6"
      >
        <div>
          <h1
            class="text-4xl font-black text-foreground tracking-tight uppercase"
          >
            {{ type === "invoice" ? "Invoice" : "Quotation" }}
          </h1>
          <div class="text-primary font-medium mt-1">
            #{{ document.invoiceNumber || document.quotationNumber }}
          </div>
        </div>
        <div class="text-right text-sm">
          <div
            class="text-muted-foreground font-medium uppercase text-xs tracking-wider mb-1"
          >
            Date Issued
          </div>
          <div class="font-bold text-foreground">
            {{ document.date || "N/A" }}
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3
          class="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-1 pb-1 border-b-1 border-primary/10"
        >
          Billed To
        </h3>
        <div
          class="text-lg font-semibold text-foreground mb-1 pb-1 border-b-1 border-primary/10"
        >
          {{ customer ? customer.name : "N/A" }}
        </div>
        <div class="flex justify-between gap-2">
          <div class="text-muted-foreground mt-1 space-y-0.5 text-sm">
            <div v-if="customer && customer.company">
              <span class="text-foreground">Company : </span>
              {{ customer.company }}
            </div>
            <div v-if="customer && customer.address">
              <span class="text-foreground">Address : </span>
              {{ customer.address }}
            </div>
            <div v-if="customer && customer.email">
              <span class="text-foreground">Email : </span> {{ customer.email }}
            </div>
            <div v-if="customer && customer.phone">
              <span class="text-foreground">Phone : </span> {{ customer.phone }}
            </div>
          </div>
          <div class="flex flex-col gap-2 items-end">
            <div v-if="document.projectName">
              <div class="text-foreground">Project Name :</div>
              <div
                class="text-muted-foreground mt-1 space-y-0.5 text-sm text-end"
              >
                {{ document.projectName }}
              </div>
            </div>
            <div
              v-if="type === 'invoice' ? document.dueDate : document.validUntil"
            >
              <div class="text-foreground">Expiry Date :</div>
              <div
                class="text-muted-foreground mt-1 space-y-0.5 text-sm text-end"
              >
                {{
                  type === "invoice" ? document.dueDate : document.validUntil
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b-2 border-primary/20">
              <th
                class="py-3 text-muted-foreground font-bold text-xs uppercase tracking-wider w-1/2"
              >
                Description
              </th>
              <th
                class="py-3 text-muted-foreground font-bold text-xs uppercase tracking-wider text-center"
              >
                Qty
              </th>
              <th
                class="py-3 text-muted-foreground font-bold text-xs uppercase tracking-wider text-right"
              >
                Price
              </th>
              <th
                class="py-3 text-primary font-bold text-xs uppercase tracking-wider text-right"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in document.items"
              :key="item.id"
              class="border-b border-border/50"
            >
              <td class="py-4 pr-4">
                <div class="font-bold text-foreground">{{ item.name }}</div>
                <div
                  v-if="item.description"
                  class="text-muted-foreground text-xs mt-1"
                >
                  {{ item.description }}
                </div>
              </td>
              <td class="py-4 text-center font-medium">{{ item.quantity }}</td>
              <td class="py-4 text-right text-muted-foreground">
                {{ formatCurrency(item.price) }}
              </td>
              <td class="py-4 text-right font-bold text-foreground">
                {{ formatCurrency(item.quantity * item.price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="w-64 ml-auto mt-8 space-y-3">
        <div class="flex justify-between text-muted-foreground text-sm">
          <span>Subtotal</span>
          <span class="font-medium text-foreground">{{
            formatCurrency(document.subtotal)
          }}</span>
        </div>
        <div
          v-if="document.taxTotal"
          class="flex justify-between text-muted-foreground text-sm"
        >
          <span>Tax</span>
          <span class="font-medium text-foreground">{{
            formatCurrency(document.taxTotal)
          }}</span>
        </div>
        <div
          v-if="document.discount"
          class="flex justify-between text-red-500 text-sm"
        >
          <span>Discount</span>
          <span class="font-medium"
            >-{{ formatCurrency(document.discount) }}</span
          >
        </div>
        <div
          class="pt-3 border-t-2 border-primary flex justify-between font-black text-xl text-primary"
        >
          <span>Total</span>
          <span>{{ formatCurrency(document.total) }}</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="mt-12 text-xs text-muted-foreground space-y-4">
        <div v-if="document.terms">
          <p class="font-bold uppercase tracking-wider text-foreground mb-1">
            Terms & Conditions
          </p>
          <div class="whitespace-pre-line">{{ document.terms }}</div>
        </div>
        <div v-if="document.notes">
          <p class="font-bold uppercase tracking-wider text-foreground mb-1">
            Notes
          </p>
          <div class="whitespace-pre-line">{{ document.notes }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useSettingsStore } from "../../../store/settings";

export default defineComponent({
  name: "TemplateCreative",
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
      formatCurrency,
    };
  },
});
</script>
