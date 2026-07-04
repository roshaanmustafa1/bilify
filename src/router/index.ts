import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'invoices', name: 'Invoices', component: () => import('../views/Invoices.vue') },
      { path: 'invoices/create', name: 'CreateInvoice', component: () => import('../views/CreateInvoice.vue') },
      { path: 'quotations', name: 'Quotations', component: () => import('../views/Quotations.vue') },
      { path: 'quotations/create', name: 'CreateQuotation', component: () => import('../views/CreateQuotation.vue') },
      { path: 'customers', name: 'Customers', component: () => import('../views/Customers.vue') },
      { path: 'profiles', name: 'CompanyProfiles', component: () => import('../views/CompanyProfiles.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'Login', component: () => import('../views/auth/Login.vue') },
      { path: 'register', name: 'Register', component: () => import('../views/auth/Register.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
