<template>
  <Card>
    <CardHeader class="space-y-1 text-center">
      <CardTitle class="text-2xl">Create an account</CardTitle>
      <p class="text-sm text-muted-foreground">
        Enter your details below to create your account
      </p>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label for="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" v-model="name" />
      </div>
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          v-model="email"
        />
      </div>
      <div class="space-y-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" v-model="password" />
      </div>
      <Button class="w-full" @click="handleRegister"> Sign Up </Button>
      <div class="text-center text-sm">
        Already have an account?
        <router-link to="/auth/login" class="text-primary hover:underline"
          >Sign in</router-link
        >
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default defineComponent({
  name: "Register",
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Label,
    Input,
    Button,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const name = ref("");
    const email = ref("");
    const password = ref("");

    const handleRegister = () => {
      // Mock register
      authStore.login(); // Auto login
      router.push("/");
    };

    return {
      name,
      email,
      password,
      handleRegister,
    };
  },
});
</script>
