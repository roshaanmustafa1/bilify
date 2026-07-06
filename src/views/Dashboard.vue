<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-foreground dark:text-primary-foreground">
          Dashboard
        </h2>
        <p class="text-muted-foreground md:hidden mt-1">Hello, Admin User</p>
      </div>
      <div class="grid grid-cols-2 md:flex md:space-x-3 gap-3 md:gap-0">
        <Button class="w-full md:w-auto" @click="$router.push('/invoices/create')">
          <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> New Invoice
        </Button>
        <Button variant="outline" class="w-full md:w-auto" @click="$router.push('/quotations/create')">
          <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> New Quotation
        </Button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Invoices"
        :value="invoiceStore.totalInvoices"
        icon="lucide:file-text"
        color="blue"
      />
      <StatCard
        title="Total Quotations"
        :value="quotationStore.totalQuotations"
        icon="lucide:file-signature"
        color="purple"
      />
      <StatCard
        title="Total Customers"
        :value="customerStore.totalCustomers"
        icon="lucide:users"
        color="green"
      />
      <StatCard
        title="Total Companies"
        :value="profileStore.profiles.length"
        icon="lucide:building"
        color="orange"
      />
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between border-b md:border-none pb-4 md:pb-6">
          <CardTitle>Recent Invoices</CardTitle>
          <router-link to="/invoices" class="text-sm text-blue-600 dark:text-blue-400 font-medium md:hidden hover:underline">View All</router-link>
        </CardHeader>
        <CardContent class="pt-4 md:pt-0">
          <div
            v-if="invoiceStore.recentInvoices.length === 0"
            class="text-center py-6 text-muted-foreground"
          >
            No invoices yet.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="inv in invoiceStore.recentInvoices"
              :key="inv.id"
              class="flex items-center justify-between p-4 border rounded-xl md:rounded-lg dark:border-border bg-muted/30 md:bg-transparent"
            >
              <div class="flex items-center gap-3 md:gap-0">
                <div class="md:hidden bg-background border p-2 rounded-full flex items-center justify-center">
                  <Icon icon="lucide:receipt" class="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p class="font-medium text-foreground">{{ inv.invoiceNumber }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ getCustomerName(inv.customerId) }}
                  </p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <p class="font-medium md:font-bold text-foreground">{{ formatCurrency(inv.total) }}</p>
                <Badge
                  :variant="inv.status === 'Paid' ? 'default' : 'secondary'"
                  class="mt-1"
                  >{{ inv.status }}</Badge
                >
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              @click="$router.push('/customers')"
              class="p-4 border dark:border-border rounded-xl md:rounded-lg flex items-center md:flex-col md:justify-center gap-4 md:gap-2 hover:bg-muted dark:hover:bg-card transition-colors text-left md:text-center"
            >
              <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl md:bg-transparent md:p-0">
                <Icon icon="lucide:users" class="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400 md:text-blue-500" />
              </div>
              <div>
                <div class="font-medium">Manage Customers</div>
                <div class="text-xs text-muted-foreground md:hidden mt-0.5">Update contact details and history</div>
              </div>
            </button>
            <button
              @click="openAI"
              class="p-4 border dark:border-border rounded-xl md:rounded-lg flex items-center md:flex-col md:justify-center gap-4 md:gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left md:text-center"
            >
              <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl md:bg-transparent md:p-0">
                <Icon icon="lucide:bot" class="h-6 w-6 md:h-8 md:w-8 text-purple-600 dark:text-purple-400 md:text-purple-500" />
              </div>
              <div>
                <div class="font-medium">AI Assistant</div>
                <div class="text-xs text-muted-foreground md:hidden mt-0.5">Automate tasks and insights</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { useInvoiceStore } from "../store/invoice";
import { useQuotationStore } from "../store/quotation";
import { useCustomerStore } from "../store/customer";
import { useSettingsStore } from "../store/settings";
import { useProfileStore } from "../store/profile";
import StatCard from "../components/dashboard/StatCard.vue";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default defineComponent({
  name: "Dashboard",
  components: {
    Icon,
    StatCard,
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
  },
  setup() {
    const router = useRouter();
    const invoiceStore = useInvoiceStore();
    const quotationStore = useQuotationStore();
    const customerStore = useCustomerStore();
    const settingsStore = useSettingsStore();
    const profileStore = useProfileStore();

    onMounted(() => {
      customerStore.fetchCustomers();
      profileStore.fetchProfiles();
      invoiceStore.fetchInvoices();
      quotationStore.fetchQuotations();
    });

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settingsStore.app.currency,
      }).format(value);
    };

    const getCustomerName = (id: string) => {
      const customer = customerStore.getCustomerById(id);
      return customer ? customer.name : "Unknown Customer";
    };

    const openAI = () => {
      router.push("/invoices/create?ai=true");
    };

    return {
      invoiceStore,
      quotationStore,
      customerStore,
      settingsStore,
      profileStore,
      formatCurrency,
      getCustomerName,
      openAI,
    };
  },
});
</script>
