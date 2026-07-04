import fs from 'fs';

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add applyCustomer to Select
  content = content.replace(
    `<Select v-model="form.customerId">`,
    `<Select v-model="form.customerId" @update:modelValue="applyCustomer">`
  );

  // 2. Add customer to form reactive object
  if (!content.includes(`customer: null as any,`)) {
    content = content.replace(
      `items: [] as`,
      `customer: null as any,\n  items: [] as`
    );
  }

  // 3. Add Billed To section before Brand Identity
  const billedToHtml = `
 <div v-if="form.customer" class="border-t pt-4 space-y-4">
 <Label class="text-lg font-semibold">Billed To / Customer Details</Label>
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-2">
 <Label>Client Name</Label>
 <div class="relative">
 <Input v-model="form.customer.name" class="pr-8" />
 <button v-if="form.customer.name" @click="form.customer.name = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Company</Label>
 <div class="relative">
 <Input v-model="form.customer.company" class="pr-8" />
 <button v-if="form.customer.company" @click="form.customer.company = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Email</Label>
 <div class="relative">
 <Input type="email" v-model="form.customer.email" class="pr-8" />
 <button v-if="form.customer.email" @click="form.customer.email = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Phone</Label>
 <div class="relative">
 <Input v-model="form.customer.phone" class="pr-8" />
 <button v-if="form.customer.phone" @click="form.customer.phone = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Address</Label>
 <div class="relative">
 <Input v-model="form.customer.address" class="pr-8" />
 <button v-if="form.customer.address" @click="form.customer.address = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 <div class="space-y-2">
 <Label>Country</Label>
 <div class="relative">
 <Input v-model="form.customer.country" class="pr-8" />
 <button v-if="form.customer.country" @click="form.customer.country = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 <Icon icon="lucide:x" class="h-4 w-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 `;
  
  if (!content.includes(`Billed To / Customer Details`)) {
    content = content.replace(
      `<div class="border-t pt-4 space-y-4">\n <div class="flex items-center justify-between">\n <Label class="text-lg font-semibold">Brand Identity / Sender</Label>`,
      billedToHtml + `\n <div class="border-t pt-4 space-y-4">\n <div class="flex items-center justify-between">\n <Label class="text-lg font-semibold">Brand Identity / Sender</Label>`
    );
  }

  // 4. Add applyCustomer method
  if (!content.includes(`const applyCustomer =`)) {
    const applyCustomerCode = `
 const applyCustomer = (id: string) => {
 if (!id) return;
 const cust = customerStore.getCustomerById(id);
 if (cust) {
 form.customer = { ...cust };
 }
 }
 `;
    content = content.replace(
      `const applyProfile = (id: any) => {`,
      applyCustomerCode + `\n const applyProfile = (id: any) => {`
    );
  }

  // 5. Export applyCustomer
  if (!content.includes(`applyCustomer\n }`)) {
    content = content.replace(
      `applyProfile\n  }`,
      `applyCustomer,\n  applyProfile\n  }`
    );
  }

  fs.writeFileSync(file, content);
}

updateFile('./src/views/CreateInvoice.vue');
updateFile('./src/views/CreateQuotation.vue');
console.log('Done');
