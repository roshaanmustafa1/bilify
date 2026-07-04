import fs from 'fs';

function updateFile(file, type) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add form.template
  if (!content.includes(`template: settingsStore.app.defaultTemplate`)) {
    content = content.replace(
      `notes: '',`,
      `notes: '',\n  template: settingsStore.app.defaultTemplate || 'TemplateMinimal',`
    );
  }

  // 2. Add Template Selector UI
  const selectorHtml = `
 <!-- Preview Side -->
 <div class="space-y-4">
 <div class="flex items-center space-x-4 bg-muted dark:bg-card p-4 rounded-lg">
 <Label class="whitespace-nowrap font-semibold">Select Template:</Label>
 <Select v-model="form.template">
 <SelectTrigger>
 <SelectValue placeholder="Choose a template" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="TemplateMinimal">Minimal</SelectItem>
 <SelectItem value="TemplateCorporate">Corporate</SelectItem>
 <SelectItem value="TemplateCreative">Creative</SelectItem>
 <SelectItem value="TemplateElegant">Elegant</SelectItem>
 </SelectContent>
 </Select>
 </div>
 
 <div class="sticky top-6">
 <div class="bg-muted dark:bg-card p-4 rounded-lg overflow-auto max-h-[80vh] shadow-inner">
 <InvoicePreview type="${type}" :document="computedInvoice" elementId="invoice-pdf" />
 </div>
 </div>
 </div>
`;

  content = content.replace(
    /<!-- Preview Side -->\s*<div>\s*<div class="sticky top-6">\s*<div class="bg-muted dark:bg-card p-4 rounded-lg overflow-auto max-h-\[80vh\] shadow-inner">\s*<InvoicePreview type=".*?" :document="computedInvoice" elementId="invoice-pdf" \/>\s*<\/div>\s*<\/div>\s*<\/div>/,
    selectorHtml.trim()
  );

  fs.writeFileSync(file, content);
}

updateFile('./src/views/CreateInvoice.vue', 'invoice');
updateFile('./src/views/CreateQuotation.vue', 'quotation');
console.log('Done');
