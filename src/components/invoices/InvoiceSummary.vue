<template>
  <Card class="mt-4">
    <CardContent class="p-6">
      <div class="flex flex-col md:flex-row justify-between gap-8">
        <!-- Controls Side -->
        <div class="w-full md:w-1/2 space-y-6">
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-foreground">Adjustments</h4>
            <div class="flex flex-wrap gap-4">
              <Button
                variant="outline"
                size="sm"
                @click="showDiscountInput = !showDiscountInput"
                :class="{
                  'bg-primary/10 border-primary/50 text-primary':
                    showDiscountInput,
                }"
              >
                <Icon icon="lucide:tag" class="mr-2 h-4 w-4" /> Add Discount
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="showTaxInput = !showTaxInput"
                :class="{
                  'bg-primary/10 border-primary/50 text-primary': showTaxInput,
                }"
              >
                <Icon icon="lucide:percent" class="mr-2 h-4 w-4" /> Add Tax
              </Button>
            </div>

            <div
              v-if="showDiscountInput"
              class="space-y-2 p-4 border rounded-lg bg-muted/20 animate-in fade-in slide-in-from-top-2"
            >
              <Label
                class="text-xs uppercase font-semibold text-muted-foreground"
                >Global Discount</Label
              >
              <div class="flex gap-2">
                <Select v-model="store.discountType">
                  <SelectTrigger class="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  v-model.number="store.globalDiscount"
                  class="flex-1"
                  placeholder="Discount Value"
                />
              </div>
            </div>

            <div
              v-if="showTaxInput"
              class="space-y-2 p-4 border rounded-lg bg-muted/20 animate-in fade-in slide-in-from-top-2"
            >
              <Label
                class="text-xs uppercase font-semibold text-muted-foreground"
                >Global Tax (%)</Label
              >
              <div class="flex gap-2 items-center">
                <Input
                  type="number"
                  v-model.number="store.globalTax"
                  class="flex-1"
                  placeholder="Tax Percentage"
                />
                <span class="text-muted-foreground font-medium px-2">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals Side -->
        <div class="w-full md:w-1/2 flex justify-end">
          <div
            class="w-full max-w-sm space-y-4 border rounded-xl p-6 bg-card shadow-sm flex flex-col justify-between"
          >
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center text-sm">
                <span class="text-muted-foreground font-medium">Subtotal</span>
                <span class="font-semibold">{{
                  formatCurrency(store.subtotal)
                }}</span>
              </div>

              <div
                v-if="store.calculatedDiscount > 0"
                class="flex justify-between items-center text-sm text-red-500"
              >
                <span class="font-medium"
                  >Discount ({{
                    store.discountType === "percentage"
                      ? store.globalDiscount + "%"
                      : "Flat"
                  }})</span
                >
                <span class="font-semibold"
                  >-{{ formatCurrency(store.calculatedDiscount) }}</span
                >
              </div>

              <div
                v-if="store.calculatedTax > 0"
                class="flex justify-between items-center text-sm text-muted-foreground"
              >
                <span class="font-medium">Tax ({{ store.globalTax }}%)</span>
                <span class="font-semibold"
                  >+{{ formatCurrency(store.calculatedTax) }}</span
                >
              </div>
            </div>
            <div>
              <Separator class="my-4" />
              <div class="flex justify-between items-end">
                <span class="text-lg font-bold text-foreground"
                  >Total Amount</span
                >
                <span class="text-2xl font-bold text-primary">{{
                  formatCurrency(store.finalTotal)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useInvoiceBuilderStore } from "../../store/invoiceBuilder";
import { useSettingsStore } from "../../store/settings";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

export default defineComponent({
  name: "InvoiceSummary",
  components: {
    Icon,
    Card,
    CardContent,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
  },
  setup() {
    const store = useInvoiceBuilderStore();
    const settingsStore = useSettingsStore();

    const showDiscountInput = ref(store.globalDiscount > 0);
    const showTaxInput = ref(store.globalTax > 0);

    watch(
      () => store.globalDiscount,
      (val) => {
        if (val > 0) showDiscountInput.value = true;
      },
    );
    watch(
      () => store.globalTax,
      (val) => {
        if (val > 0) showTaxInput.value = true;
      },
    );

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settingsStore.app.currency || "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);
    };

    return {
      store,
      showDiscountInput,
      showTaxInput,
      formatCurrency,
    };
  },
});
</script>
