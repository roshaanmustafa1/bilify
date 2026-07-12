<template>
  <div class="space-y-8 pb-8">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2 border-b pb-6"
    >
      <div>
        <h2 class="text-3xl font-bold text-foreground tracking-tight">
          Welcome back, Bilify!
        </h2>
        <p class="text-muted-foreground mt-1 text-sm">
          Manage your corporate finances with precision and ease.
        </p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          class="w-full md:w-auto font-medium shadow-sm hover:shadow-md transition-shadow"
          @click="$router.push('/app/quotations/create')"
        >
          <Icon icon="lucide:plus" class="mr-2 h-4 w-4" /> New Quotation
        </Button>
        <Button
          class="w-full md:w-auto font-medium"
          @click="$router.push('/app/invoices/create')"
        >
          <Icon icon="lucide:file-text" class="mr-2 h-4 w-4" /> New Invoice
        </Button>
      </div>
    </div>

    <!-- Stats Row -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white"
    >
      <StatCard
        title="Total Invoices"
        :value="invoiceStore.totalInvoices"
        percentage="+12.5%"
        trendText="84 new this month"
        class="bg-gradient-to-r from-[#29855b] to-[#144b33] text-white"
      />
      <StatCard
        title="Total Quotations"
        :value="quotationStore.totalQuotations"
        percentage="+8.2%"
        trendText="22 pending review"
        class="bg-gradient-to-r from-[#29855b] to-[#144b33] text-white"
      />
      <StatCard
        title="Total Customers"
        :value="customerStore.totalCustomers"
        percentage="+4.1%"
        trendText="14 new acquisitions"
        class="bg-gradient-to-r from-[#29855b] to-[#144b33] text-white"
      />
      <StatCard
        title="Associated Companies"
        :value="profileStore.profiles.length"
        percentage="+2.0%"
        percentageColor="green"
        trendText="Multi-entity active"
        class="bg-gradient-to-r from-[#29855b] to-[#144b33] text-white"
      />
    </div>

    <!-- Middle Row: Recent Invoices & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Invoices (Span 2) -->
      <div class="lg:col-span-2 flex flex-col">
        <Card class="flex-1">
          <CardHeader
            class="flex flex-row items-center justify-between pb-4 border-b border-border/40"
          >
            <div>
              <CardTitle class="text-xl">Recent Invoices</CardTitle>
              <p class="text-xs text-muted-foreground mt-1">
                Last 10 transactions processed across all entities.
              </p>
            </div>
            <router-link
              to="/app/invoices"
              class="text-sm font-semibold hover:underline text-primary"
              >View All</router-link
            >
          </CardHeader>
          <CardContent class="p-0">
            <div
              v-if="invoiceStore.recentInvoices.length === 0"
              class="text-center py-10 text-muted-foreground text-sm"
            >
              No invoices yet.
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead
                  class="text-[10px] uppercase text-muted-foreground bg-muted/30"
                >
                  <tr class="border-b bg-accent">
                    <th class="px-6 py-4 font-semibold tracking-wider border-b">
                      Client / ID
                    </th>
                    <th class="px-6 py-4 font-semibold tracking-wider">
                      Issue Date
                    </th>
                    <th class="px-6 py-4 font-semibold tracking-wider">
                      Amount
                    </th>
                    <th class="px-6 py-4 font-semibold tracking-wider">
                      Status
                    </th>
                    <th
                      class="px-6 py-4 font-semibold tracking-wider text-right"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/40">
                  <tr
                    v-for="inv in invoiceStore.recentInvoices"
                    :key="inv.id"
                    class="hover:bg-muted/30 transition-colors border-b"
                  >
                    <td class="px-6 py-4">
                      <p class="font-semibold text-foreground">
                        {{ getCustomerName(inv.customerId) }}
                      </p>
                      <p class="text-xs text-muted-foreground mt-0.5">
                        {{ inv.invoiceNumber }}
                      </p>
                    </td>
                    <td class="px-6 py-4 text-muted-foreground">
                      {{ inv.date }}
                    </td>
                    <td class="px-6 py-4 font-bold text-foreground">
                      {{ formatCurrency(inv.total) }}
                    </td>
                    <td class="px-6 py-4">
                      <Badge
                        :variant="
                          inv.status === 'Paid' ? 'default' : 'secondary'
                        "
                        :class="
                          inv.status === 'Paid'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : inv.status === 'Overdue'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        "
                      >
                        {{ inv.status.toUpperCase() }}
                      </Badge>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8 rounded-full"
                      >
                        <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Quick Actions (Span 1) -->
      <div class="space-y-6 flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle class="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-2 gap-4">
            <button
              @click="$router.push('/app/customers')"
              class="flex flex-col items-center justify-center p-5 border border-border rounded-2xl bg-muted/20 hover:bg-primary/40 transition-colors gap-3 group"
            >
              <Icon
                icon="lucide:user-plus"
                class="h-8 w-8 text-foreground/70 group-hover:text-primary transition-colors"
              />
              <span class="text-xs font-semibold text-center leading-tight"
                >New<br />Customer</span
              >
            </button>
            <button
              @click="openAI"
              class="flex flex-col items-center justify-center p-5 border border-border rounded-2xl bg-muted/20 hover:bg-primary/40 transition-colors gap-3 group"
            >
              <Icon
                icon="lucide:bot"
                class="h-8 w-8 text-foreground/70 group-hover:text-primary transition-colors"
              />
              <span class="text-xs font-semibold text-center leading-tight"
                >AI<br />Assistant</span
              >
            </button>
            <button
              class="flex flex-col items-center justify-center p-5 border border-border rounded-2xl bg-muted/20 hover:bg-primary/40 transition-colors gap-3 group"
            >
              <Icon
                icon="lucide:bar-chart-3"
                class="h-8 w-8 text-foreground/70 group-hover:text-primary transition-colors"
              />
              <span class="text-xs font-semibold text-center leading-tight"
                >Tax<br />Report</span
              >
            </button>
            <button
              class="flex flex-col items-center justify-center p-5 border border-border rounded-2xl bg-muted/20 hover:bg-primary/40 transition-colors gap-3 group"
            >
              <Icon
                icon="lucide:file-up"
                class="h-8 w-8 text-foreground/70 group-hover:text-primary transition-colors"
              />
              <span class="text-xs font-semibold text-center leading-tight"
                >Import<br />CSV</span
              >
            </button>
          </CardContent>
        </Card>

        <!-- Exclusive Promotional Banner -->
        <div
          class="relative overflow-hidden rounded-3xl bg-[#0f172a] text-white p-8 shadow-xl flex-1 flex flex-col justify-center border border-border/10"
        >
          <!-- Abstract Background Graphic -->
          <div class="absolute inset-0 opacity-40 pointer-events-none">
            <div
              class="absolute -right-20 -bottom-20 w-64 h-64 bg-[#10b981] rounded-full blur-[80px]"
            ></div>
            <div
              class="absolute -left-10 top-10 w-40 h-40 bg-[#3b82f6] rounded-full blur-[60px]"
            ></div>
          </div>
          <div class="relative z-10">
            <span
              class="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4"
              >Exclusive</span
            >
            <h3 class="text-2xl font-bold leading-tight mb-3">
              Professional<br />Financial Control
            </h3>
            <p class="text-xs text-white/70 mb-6 max-w-[200px] leading-relaxed">
              Unlock multi-currency support and advanced analytics dashboards
              with our Pro Suite.
            </p>
            <button
              class="flex items-center justify-center bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-full px-6 py-2.5 text-sm shadow-lg shadow-[#10b981]/20 transition-all w-fit group"
            >
              Get Started
              <Icon
                icon="lucide:arrow-right"
                class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Team & Sync Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-4 border-b border-border/40"
        >
          <CardTitle class="text-xl">Team Activity</CardTitle>
          <Button variant="ghost" size="icon" class="h-8 w-8 rounded-full">
            <Icon icon="lucide:user-plus" class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent class="space-y-6 pt-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Avatar"
                class="w-10 h-10 rounded-full border shadow-sm object-cover"
              />
              <div>
                <p class="font-semibold text-sm">Alexandra Deff</p>
                <p class="text-xs text-muted-foreground">
                  Reviewing Arc Invoice
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              class="bg-green-100/50 text-green-700 hover:bg-green-100 uppercase text-[9px] px-2 py-0.5 tracking-wider border-green-200"
              >Active</Badge
            >
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Avatar"
                class="w-10 h-10 rounded-full border shadow-sm object-cover"
              />
              <div>
                <p class="font-semibold text-sm">Edwin Adenike</p>
                <p class="text-xs text-muted-foreground">
                  Generating Tax Summary
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              class="bg-gray-100 text-gray-600 hover:bg-gray-200 uppercase text-[9px] px-2 py-0.5 tracking-wider"
              >Away</Badge
            >
          </div>
        </CardContent>
      </Card>

      <Card class="flex flex-col justify-center">
        <CardContent class="flex items-center justify-between p-8">
          <div class="flex items-center gap-6">
            <div class="relative w-20 h-20 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="transparent"
                  class="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  stroke-width="6"
                  fill="transparent"
                  class="text-primary"
                  stroke-dasharray="226"
                  stroke-dashoffset="56"
                  stroke-linecap="round"
                />
              </svg>
              <span class="font-bold text-lg text-foreground">75%</span>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-1">Cloud Sync Status</h3>
              <p
                class="text-sm text-muted-foreground max-w-[200px] leading-snug"
              >
                Last synced 2 minutes ago. All systems operational across 4
                nodes.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            class="font-semibold px-6 bg-muted/50 hover:bg-muted"
            >Refresh<br />Nodes</Button
          >
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
      router.push("/app/invoices/create?ai=true");
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
