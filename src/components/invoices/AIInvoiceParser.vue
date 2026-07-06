<template>
  <div
    class="ai-invoice-parser bg-card border border-border shadow-sm rounded-lg p-6"
  >
    <div class="mb-4">
      <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
        <span class="bg-primary/10 text-primary p-1.5 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </span>
        AI Invoice Parser
      </h2>
      <p class="text-sm text-muted-foreground mt-2">
        Paste raw invoice text or instructions below. The AI will automatically
        extract and structure the data.
      </p>
    </div>

    <div class="space-y-4">
      <div>
        <label
          for="rawText"
          class="block text-sm font-medium text-foreground mb-1"
          >Raw Text Data</label
        >
        <Textarea
          id="rawText"
          v-model="rawText"
          placeholder="Paste unstructured invoice data here (e.g. 'Bill to John Doe, 2 hours of consulting at $150/hr...')"
          rows="6"
          :disabled="isParsing"
          class="w-full resize-y font-mono text-sm"
        />
      </div>

      <div
        v-if="error"
        class="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive flex items-start gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mt-0.5 shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          @click="clearText"
          :disabled="isParsing || !rawText"
        >
          Clear
        </Button>
        <Button
          @click="parseInvoice"
          :disabled="isParsing || !rawText"
          class="min-w-[140px]"
        >
          <span v-if="isParsing" class="flex items-center gap-2">
            <svg
              class="animate-spin h-4 w-4 text-primary-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Parsing...
          </span>
          <span v-else>Extract Data</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import axios from "axios";
import { useInvoiceStore } from "../../store/modules/invoice";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

export default {
  name: "AIInvoiceParser",
  components: {
    Button,
    Textarea,
  },
  emits: ["parsed"],
  data() {
    return {
      rawText: "",
      isParsing: false,
      error: null,
    };
  },
  computed: {
    // Connect global runtime bindings to cross-functional Pinia nodes
    ...mapState(useInvoiceStore, ["invoices", "activeInvoice"]),
  },
  methods: {
    ...mapActions(useInvoiceStore, ["saveInvoice", "patchInvoice"]),

    clearText() {
      this.rawText = "";
      this.error = null;
    },

    parseInvoice() {
      if (!this.rawText.trim()) return;

      // State locking toggles tracking edge API response resolution variables
      this.isParsing = true;
      this.error = null;

      const payload = {
        prompt:
          "Extract billing parameters into structured invoice JSON schema",
        content: this.rawText,
      };

      // Handle networking requests strictly via Axios utilizing .then().catch() promise execution streams
      axios
        .post(
          "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY || ""}`, // Mocked key setup
            },
          },
        )
        .then((response) => {
          this.isParsing = false;
          const parsedData = response.data;

          // Bind event triggers bubbling successful parsing maps back out to parent router dashboard nodes upon server completion
          this.$emit("parsed", parsedData);

          this.rawText = "";
        })
        .catch((error) => {
          this.isParsing = false;
          this.error =
            error.response?.data?.error?.message ||
            error.message ||
            "An error occurred during AI invoice parsing.";
        });
    },
  },
};
</script>
