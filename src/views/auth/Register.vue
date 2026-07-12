<template>
  <div class="flex flex-col animate-in fade-in duration-500 w-full font-sans">
    <!-- Logo -->
    <div class="mb-6">
      <img src="/favicon.svg" alt="Bilify Logo" class="w-14 h-14" />
    </div>

    <!-- Headers -->
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
    <p class="text-[13px] text-gray-400 font-medium mb-10">
      Welcome to Bilify - Let's create your account
    </p>

    <!-- Error/Success Alert -->
    <div
      v-if="error"
      :class="[
        'mb-6 p-3 text-sm rounded-lg flex items-start gap-2 border',
        isSuccessError
          ? 'text-green-700 bg-green-50 border-green-200'
          : 'text-destructive bg-destructive/10 border-destructive/20',
      ]"
    >
      <Icon
        :icon="isSuccessError ? 'lucide:check-circle' : 'lucide:alert-circle'"
        class="w-4 h-4 shrink-0 mt-0.5"
      />
      <span>{{ error }}</span>
    </div>

    <!-- Form -->
    <div class="space-y-6">
      <div class="space-y-2 text-left">
        <Label for="name" class="text-[13px] font-bold text-gray-900"
          >Name</Label
        >
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          v-model="name"
          class="h-12 rounded-xl border-gray-300 focus-visible:ring-[#104a34] shadow-sm text-sm placeholder:text-gray-400"
          @keyup.enter="handleRegister"
        />
      </div>

      <div class="space-y-2 text-left">
        <Label for="email" class="text-[13px] font-bold text-gray-900"
          >Email</Label
        >
        <Input
          id="email"
          type="email"
          placeholder="hi@bilify.com"
          v-model="email"
          class="h-12 rounded-xl border-gray-300 focus-visible:ring-[#104a34] shadow-sm text-sm placeholder:text-gray-400"
          @keyup.enter="handleRegister"
        />
      </div>

      <div class="space-y-2 text-left">
        <Label for="password" class="text-[13px] font-bold text-gray-900"
          >Password</Label
        >
        <Input
          id="password"
          type="password"
          placeholder="add a strong password"
          v-model="password"
          class="h-12 rounded-xl border-gray-300 focus-visible:ring-[#104a34] shadow-sm placeholder:text-gray-400"
          @keyup.enter="handleRegister"
        />
      </div>

      <Button
        class="w-full h-12 bg-[#104a34] hover:bg-[#0a3122] text-white rounded-xl text-sm font-semibold shadow-md transition-colors mt-2"
        @click="handleRegister"
        :disabled="loading"
      >
        <Icon
          v-if="loading"
          icon="lucide:loader-2"
          class="mr-2 h-5 w-5 animate-spin"
        />
        {{ loading ? "Creating account..." : "Sign up" }}
      </Button>
    </div>

    <div class="text-center text-[13px] font-medium text-gray-500 mt-10">
      Already have an account?
      <router-link
        to="/auth/login"
        class="text-gray-900 font-bold hover:underline"
        >Log in</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "Register",
  components: {
    Label,
    Input,
    Button,
    Icon,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);

    const isSuccessError = computed(() =>
      error.value.includes("Signup successful"),
    );

    const handleRegister = () => {
      error.value = "";
      loading.value = true;
      authStore
        .signup(email.value, password.value, name.value)
        .then(() => {
          router.push("/app");
        })
        .catch((err: Error) => {
          error.value = err.message || "Sign up failed";
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      name,
      email,
      password,
      error,
      loading,
      isSuccessError,
      handleRegister,
    };
  },
});
</script>
