<template>
 <Card>
 <CardHeader class="space-y-1 text-center">
 <CardTitle class="text-2xl">Sign in</CardTitle>
 <p class="text-sm text-muted-foreground">
 Enter your email below to sign in to your account
 </p>
 </CardHeader>
 <CardContent class="space-y-4">
 <div class="space-y-2">
 <Label for="email">Email</Label>
 <Input id="email" type="email" placeholder="m@example.com" v-model="email" />
 </div>
 <div class="space-y-2">
 <div class="flex items-center justify-between">
 <Label for="password">Password</Label>
 <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
 </div>
 <Input id="password" type="password" v-model="password" />
 </div>
 <Button class="w-full" @click="handleLogin">
 Sign In
 </Button>
 <div class="text-center text-sm">
 Don't have an account? 
 <router-link to="/auth/register" class="text-primary hover:underline">Sign up</router-link>
 </div>
 </CardContent>
 </Card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

export default defineComponent({
 name: 'Login',
 components: {
 Card, CardHeader, CardTitle, CardContent,
 Label, Input, Button
 },
 setup() {
 const router = useRouter()
 const authStore = useAuthStore()
 const email = ref('admin@example.com')
 const password = ref('password')

 const handleLogin = () => {
 // Mock login
 authStore.login()
 router.push('/')
 }

 return {
 email,
 password,
 handleLogin
 }
 }
})
</script>
