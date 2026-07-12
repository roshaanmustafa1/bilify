<template>
  <section id="faq" class="py-32 bg-white">
    <div class="mx-auto px-4">
      <div class="text-center mb-16">
        <h2
          class="text-4xl md:text-5xl font-black tracking-tight mb-6 text-slate-900"
        >
          Frequently Asked Questions
        </h2>
        <p class="text-xl text-slate-600">Got questions? We've got answers.</p>
      </div>

      <div class="space-y-6">
        <div
          v-for="(item, index) in faqs"
          :key="index"
          class="border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300"
          :class="
            activeFaq === index
              ? 'bg-slate-50 shadow-md ring-1 ring-primary/10'
              : 'bg-white hover:border-slate-300'
          "
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
          >
            <span class="font-bold text-lg text-slate-900">{{
              item.question
            }}</span>
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500"
              :class="
                activeFaq === index
                  ? 'bg-primary text-white rotate-180'
                  : 'bg-slate-100 text-slate-500'
              "
            >
              <Icon
                :icon="activeFaq === index ? 'lucide:minus' : 'lucide:plus'"
                class="w-5 h-5"
              />
            </div>
          </button>

          <div
            class="grid transition-all duration-500 ease-in-out"
            :style="{ gridTemplateRows: activeFaq === index ? '1fr' : '0fr' }"
          >
            <div class="overflow-hidden">
              <div
                class="px-8 pb-8 text-slate-600 text-lg leading-relaxed pt-2"
              >
                {{ item.answer }}
              </div>
            </div>
          </div>
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
  components: {
    Icon,
  },
  data() {
    return {
      activeFaq: 0 as number | null,
      faqs: [
        {
          question: "What payment methods do you support?",
          answer:
            "We support all major credit cards, PayPal, bank transfers (ACH), and Apple/Google Pay through our seamless Stripe integration.",
        },
        {
          question: "Can I cancel my subscription at any time?",
          answer:
            "Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your billing dashboard with a single click.",
        },
        {
          question: "Do you offer a free trial?",
          answer:
            "Yes! We offer a completely unrestricted 14-day free trial on our Pro plan. No credit card is required to sign up.",
        },
        {
          question: "Is my financial data secure?",
          answer:
            "Security is our top priority. We use AES-256 encryption, maintain SOC2 compliance, and perform regular third-party security audits.",
        },
      ],
    };
  },
  methods: {
    toggleFaq(index: number) {
      this.activeFaq = this.activeFaq === index ? null : index;
    },
  },
});
</script>
