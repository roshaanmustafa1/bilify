<template>
  <section id="faq" class="py-24 bg-slate-50 relative z-20">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
        >
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Features
        </div>
        <h2
          class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
        >
          Billing capabilities
        </h2>
        <p class="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          Tools and capabilities designed to automate your invoicing,
          quotations, and payment workflows.
        </p>
      </div>

      <!-- 2x2 Feature Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Card 1: Invoice Generation -->
        <div
          class="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group"
        >
          <!-- Illustration -->
          <div
            class="mb-8 relative h-44 flex items-center justify-center overflow-hidden"
          >
            <!-- Floating badge -->
            <div
              class="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
            >
              <Icon icon="lucide:scan" class="w-3 h-3 text-emerald-500" />
              Generating...
            </div>
            <!-- Visual boxes (document diagram) -->
            <div class="flex items-center gap-4 mt-6">
              <div
                class="w-24 h-28 rounded-xl border-2 border-emerald-200 bg-emerald-50 flex flex-col items-center justify-center shadow-lg group-hover:shadow-emerald-100 transition-shadow"
              >
                <Icon
                  icon="lucide:file-text"
                  class="w-8 h-8 text-emerald-500 mb-1"
                />
                <span
                  class="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider"
                  >Invoice</span
                >
              </div>
              <Icon icon="lucide:arrow-right" class="w-5 h-5 text-slate-300" />
              <div
                class="w-24 h-28 rounded-xl border-2 border-slate-100 bg-slate-50 flex flex-col items-center justify-center shadow-lg"
              >
                <Icon icon="lucide:send" class="w-8 h-8 text-slate-400 mb-1" />
                <span
                  class="text-[9px] font-semibold text-slate-400 uppercase tracking-wider"
                  >Client</span
                >
              </div>
            </div>
          </div>
          <!-- Text -->
          <h3 class="text-lg font-bold text-slate-900 mb-2">
            Smart invoice generation
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            Create professional invoices in seconds. Add line items, taxes, and
            discounts with full live preview before sending.
          </p>
        </div>

        <!-- Card 2: AI Quotation -->
        <div
          class="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group"
        >
          <!-- Illustration -->
          <div
            class="mb-8 relative h-44 flex items-center justify-center overflow-hidden"
          >
            <!-- Floating badge -->
            <div
              class="absolute top-0 right-6 z-10 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-200"
            >
              <Icon icon="lucide:check" class="w-3 h-3" />
              AI Approved
            </div>
            <!-- Visual: document lines to represent a quotation -->
            <div
              class="w-48 h-32 rounded-xl border border-slate-100 bg-slate-50 shadow-lg p-4 mt-6 relative"
            >
              <div class="space-y-2">
                <div class="h-2 bg-slate-200 rounded-full w-3/4"></div>
                <div class="h-2 bg-slate-200 rounded-full w-full"></div>
                <div class="h-2 bg-slate-200 rounded-full w-5/6"></div>
                <div class="h-2 bg-emerald-100 rounded-full w-2/3"></div>
              </div>
              <!-- Avatar -->
              <div
                class="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center"
              >
                <Icon icon="lucide:bot" class="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <!-- Text -->
          <h3 class="text-lg font-bold text-slate-900 mb-2">
            AI quotation builder
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            Let AI draft accurate quotations from your project details. Convert
            winning quotes directly into invoices with one click.
          </p>
        </div>

        <!-- Card 3: Real-time Notifications -->
        <div
          class="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group"
        >
          <!-- Illustration -->
          <div class="mb-8 relative h-44 flex items-center justify-center">
            <!-- Event tags -->
            <div class="flex flex-col gap-3 w-full max-w-xs mt-4">
              <div
                class="flex items-center justify-between text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 shadow-sm"
              >
                <span class="flex items-center gap-2"
                  ><Icon
                    icon="lucide:bell"
                    class="w-3.5 h-3.5 text-emerald-500"
                  />
                  Invoice viewed</span
                >
                <span class="flex items-center gap-2"
                  ><Icon
                    icon="lucide:file-check"
                    class="w-3.5 h-3.5 text-blue-400"
                  />
                  Quote accepted</span
                >
              </div>
              <!-- Central icon -->
              <div class="flex items-center justify-center">
                <div
                  class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#29855b] to-[#144b33] shadow-xl shadow-emerald-200 flex items-center justify-center"
                >
                  <Icon icon="lucide:zap" class="w-7 h-7 text-white" />
                </div>
              </div>
              <div
                class="flex items-center justify-between text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 shadow-sm"
              >
                <span class="flex items-center gap-2"
                  ><Icon
                    icon="lucide:credit-card"
                    class="w-3.5 h-3.5 text-purple-400"
                  />
                  Payment received</span
                >
                <span class="flex items-center gap-2"
                  ><Icon
                    icon="lucide:alert-circle"
                    class="w-3.5 h-3.5 text-amber-400"
                  />
                  Invoice overdue</span
                >
              </div>
            </div>
          </div>
          <!-- Text -->
          <h3 class="text-lg font-bold text-slate-900 mb-2">
            Real-time notifications
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            Stay informed when clients view invoices, accept quotes, make
            payments, or when payments become overdue.
          </p>
        </div>

        <!-- Card 4: PDF Reports -->
        <div
          class="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group"
        >
          <!-- Illustration -->
          <div class="mb-8 relative h-44 flex items-center justify-center">
            <div class="flex flex-col items-end gap-3 mt-4 w-full max-w-xs">
              <span class="text-slate-700 font-semibold text-sm self-center"
                >Revenue reports</span
              >
              <!-- Mini bar chart -->
              <div
                class="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm"
              >
                <div class="flex items-end gap-2 h-16">
                  <div
                    class="flex-1 bg-emerald-100 rounded"
                    style="height: 40%"
                  ></div>
                  <div
                    class="flex-1 bg-emerald-200 rounded"
                    style="height: 65%"
                  ></div>
                  <div
                    class="flex-1 bg-emerald-300 rounded"
                    style="height: 50%"
                  ></div>
                  <div
                    class="flex-1 bg-emerald-400 rounded"
                    style="height: 80%"
                  ></div>
                  <div
                    class="flex-1 bg-emerald-500 rounded"
                    style="height: 95%"
                  ></div>
                  <div
                    class="flex-1 bg-emerald-600 rounded"
                    style="height: 70%"
                  ></div>
                </div>
              </div>
              <!-- Checkmarks -->
              <div class="space-y-1.5 self-stretch">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <Icon
                    icon="lucide:check-circle"
                    class="w-3.5 h-3.5 text-emerald-500 shrink-0"
                  />
                  <span>Monthly earnings summary</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <Icon
                    icon="lucide:check-circle"
                    class="w-3.5 h-3.5 text-emerald-500 shrink-0"
                  />
                  <span>Client-wise billing breakdown</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <Icon
                    icon="lucide:check-circle"
                    class="w-3.5 h-3.5 text-emerald-500 shrink-0"
                  />
                  <span>Downloadable PDF exports</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Text -->
          <h3 class="text-lg font-bold text-slate-900 mb-2">
            PDF export & reporting
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed">
            Generate structured financial reports for audits, client reviews,
            and enterprise-level billing compliance.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "LandingFAQ",
  components: { Icon },
});
</script>
