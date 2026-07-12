<template>
  <div class="flex flex-col animate-in fade-in duration-500 w-full font-sans">
    <!-- Logo -->
    <div class="mb-6">
      <img src="/favicon.svg" alt="Bilify Logo" class="w-14 h-14" />
    </div>

    <!-- Headers -->
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
    <p class="text-[13px] text-gray-400 font-medium mb-12">
      Welcome to Bilify - Let's log in to your account
    </p>

    <!-- Error Alert -->
    <div
      v-if="error"
      class="mb-6 p-3 text-sm text-destructive bg-destructive/10 rounded-lg flex items-start gap-2 border border-destructive/20"
    >
      <Icon icon="lucide:alert-circle" class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{{ error }}</span>
    </div>

    <!-- Form -->
    <div class="space-y-6">
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
          @keyup.enter="handleLogin"
        />
      </div>

      <div class="space-y-2 text-left">
        <div class="flex items-center justify-between">
          <Label for="password" class="text-[13px] font-bold text-gray-900"
            >Password</Label
          >
          <a
            href="#"
            class="text-[13px] font-bold text-gray-900 hover:underline"
            >Forgot?</a
          >
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter Your Password"
          v-model="password"
          class="h-12 rounded-xl border-gray-300 focus-visible:ring-[#104a34] shadow-sm placeholder:text-gray-400"
          @keyup.enter="handleLogin"
        />
      </div>

      <Button
        class="w-full h-12 bg-[#104a34] hover:bg-[#0a3122] text-white rounded-xl text-sm font-semibold shadow-md transition-colors mt-2"
        @click="handleLogin"
        :disabled="loading"
      >
        <Icon
          v-if="loading"
          icon="lucide:loader-2"
          class="mr-2 h-5 w-5 animate-spin"
        />
        {{ loading ? "Logging in..." : "Log in" }}
      </Button>
    </div>

    <div class="text-center text-[13px] font-medium text-gray-500 mt-10">
      Don't have an account?
      <router-link
        to="/auth/register"
        class="text-gray-900 font-bold hover:underline"
        >Sign up</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "Login",
  components: {
    Label,
    Input,
    Button,
    Icon,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);

    const handleLogin = () => {
      error.value = "";
      loading.value = true;
      authStore
        .login(email.value, password.value)
        .then(() => {
          router.push("/app");
        })
        .catch((err: Error) => {
          error.value = err.message || "Login failed";
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return { email, password, error, loading, handleLogin };
  },
});
</script>
