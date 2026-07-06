<template>
  <div :id="elementId" class="force-light bg-background text-foreground">
    <component 
      :is="selectedTemplateComponent" 
      :type="type"
      :invoice="document"
      :profile="sender"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useSettingsStore } from "../../store/settings";
import { useProfileStore } from "../../store/profile";
import { useCustomerStore } from "../../store/customer";

import TemplateMinimal from "./templates/TemplateMinimal.vue";
import TemplateCorporate from "./templates/TemplateCorporate.vue";
import TemplateCreative from "./templates/TemplateCreative.vue";
import TemplateElegant from "./templates/TemplateElegant.vue";

export default defineComponent({
  name: "InvoicePreview",
  components: {
    TemplateMinimal,
    TemplateCorporate,
    TemplateCreative,
    TemplateElegant
  },
  props: {
    type: {
      type: String,
      required: true, // 'invoice' or 'quotation'
    },
    document: {
      type: Object,
      required: true,
    },
    elementId: {
      type: String,
      default: "invoice-preview",
    },
  },
  setup(props) {
    const settingsStore = useSettingsStore();
    const customerStore = useCustomerStore();
    const profileStore = useProfileStore();

    const sender = computed(() => {
      if (
        props.document &&
        props.document.company &&
        props.document.company.name
      ) {
        return props.document.company;
      }
      const p =
        profileStore.profiles.find(
          (p) => p.id === profileStore.activeProfileId,
        ) || profileStore.profiles[0];
      return p || {};
    });

    const selectedTemplateComponent = computed(() => {
      // First check if a template is set on the document
      if (props.document.template) {
        return props.document.template;
      }
      // Check active profile
      const activeProfile = profileStore.profiles.find(p => p.id === profileStore.activeProfileId);
      if (activeProfile && activeProfile.template) {
        return activeProfile.template;
      }
      // Check app default
      if (settingsStore.app.defaultTemplate) {
        return settingsStore.app.defaultTemplate;
      }
      return 'TemplateMinimal';
    });

    return {
      sender,
      selectedTemplateComponent,
      document: computed(() => {
          return {
              ...props.document,
              customer: props.document.customer || customerStore.getCustomerById(props.document.customerId)
          }
      })
    };
  },
});
</script>
