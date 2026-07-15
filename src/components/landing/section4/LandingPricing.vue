<template>
  <section id="pricing" class="py-0 bg-[#030a06] text-white relative">
    <!-- Subtle Background Glow -->
    <div
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div class="max-w-full mx-auto relative z-10">
      <div class="flex flex-col lg:flex-row items-stretch min-h-[540px]">
        <!-- Left Side: Text Content -->
        <div
          class="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-24"
        >
          <div
            class="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4"
          >
            AI Powered
          </div>
          <h2
            class="text-5xl md:text-6xl font-black text-white tracking-tight mb-8 leading-[1.1]"
          >
            Smart Invoicing & <br />
            Quotation
          </h2>
          <p class="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
            Experience the future of billing. Our AI analyzes your transaction
            data to automatically draft pixel-perfect invoices and precise
            quotations in seconds.
          </p>
          <ul class="space-y-8">
            <li class="flex items-start gap-5">
              <div
                class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                <Icon icon="lucide:zap" class="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h4 class="text-2xl font-bold text-white mb-2">
                  Lightning Fast
                </h4>
                <p class="text-slate-400 text-lg">
                  Generate complex quotations 10x faster with our advanced AI
                  data extraction.
                </p>
              </div>
            </li>
            <li class="flex items-start gap-5">
              <div
                class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                <Icon
                  icon="lucide:shield-check"
                  class="w-7 h-7 text-emerald-400"
                />
              </div>
              <div>
                <h4 class="text-2xl font-bold text-white mb-2">
                  Error-Free Accuracy
                </h4>
                <p class="text-slate-400 text-lg">
                  Our models are trained to detect anomalies and completely
                  prevent billing mistakes.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Right Side: CardSwap — must be relative+overflow-hidden so CardSwap (absolute bottom-right) is contained -->
        <div
          class="w-full lg:w-1/2 relative overflow-hidden"
          style="min-height: 700px"
        >
          <CardSwap
            :card-distance="55"
            :vertical-distance="60"
            :delay="3500"
            :pause-on-hover="true"
            :width="600"
            :height="500"
            :skew-amount="4"
            easing="elastic"
          >
            <!-- Card 1: Auto Invoice -->
            <Card class="!bg-[#0d0d0d] !border-white/20 flex flex-col">
              <div
                class="flex items-center gap-2.5 px-4 py-3 border-b border-white/15 shrink-0"
              >
                <Icon icon="lucide:file-text" class="w-4 h-4 text-white/60" />
                <span class="text-white/80 text-sm font-medium"
                  >Auto Invoice Generation</span
                >
              </div>
              <div class="flex-1 relative overflow-hidden">
                <img
                  src="../../../assets/images/invoice-editor.png"
                  alt="Invoice Editor"
                  class="w-full h-full object-cover object-top"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5"
                >
                  <span
                    class="text-[6rem] font-black text-white/10 leading-none select-none"
                    >1</span
                  >
                </div>
              </div>
            </Card>

            <!-- Card 2: Smart Quotation -->
            <Card class="!bg-[#0d0d0d] !border-white/20 flex flex-col">
              <div
                class="flex items-center gap-2.5 px-4 py-3 border-b border-white/15 shrink-0"
              >
                <Icon icon="lucide:calculator" class="w-4 h-4 text-white/60" />
                <span class="text-white/80 text-sm font-medium"
                  >Smart Quotation AI</span
                >
              </div>
              <div class="flex-1 relative overflow-hidden">
                <img
                  src="../../../assets/images/dashboard-dark.png"
                  alt="Dashboard"
                  class="w-full h-full object-cover object-top"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5"
                >
                  <span
                    class="text-[6rem] font-black text-white/10 leading-none select-none"
                    >2</span
                  >
                </div>
              </div>
            </Card>

            <!-- Card 3: AI Assistant -->
            <Card class="!bg-[#0d0d0d] !border-white/20 flex flex-col">
              <div
                class="flex items-center gap-2.5 px-4 py-3 border-b border-white/15 shrink-0"
              >
                <Icon icon="lucide:bot" class="w-4 h-4 text-white/60" />
                <span class="text-white/80 text-sm font-medium"
                  >24/7 Billing Assistant</span
                >
              </div>
              <div class="flex-1 relative overflow-hidden">
                <img
                  src="../../../assets/images/invoices-list.png"
                  alt="Invoices"
                  class="w-full h-full object-cover object-top"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5"
                >
                  <span
                    class="text-[6rem] font-black text-white/10 leading-none select-none"
                    >3</span
                  >
                </div>
              </div>
            </Card>
          </CardSwap>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import CardSwap, { Card } from "@/components/CardSwap.vue";
</script>

<script lang="ts">
export default {
  name: "LandingPricing",
};
</script>
