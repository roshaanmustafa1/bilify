// supabase/functions/generate-pdf/index.ts
// Deno Edge Function — renders invoice HTML and calls Browserless to generate PDF

const BROWSERLESS_API_KEY = Deno.env.get('BROWSERLESS_API_KEY') ?? ''
const BROWSERLESS_URL = `https://production-sfo.browserless.io/pdf?token=${BROWSERLESS_API_KEY}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(v: unknown): string {
  if (v == null) return ''
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fmt(val: unknown, currency: string): string {
  const n = Number(val) || 0
  return `${n} ${esc(currency)}`
}

// ─── HTML Page Wrapper ───────────────────────────────────────────────────────

function wrapHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1024" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            background:  '#ffffff',
            foreground:  '#0f172a',
            card:        { DEFAULT: '#ffffff', foreground: '#0f172a' },
            primary:     { DEFAULT: '#064e3b', foreground: '#ffffff' },
            secondary:   { DEFAULT: '#f1f5f9', foreground: '#0f172a' },
            muted:       { DEFAULT: '#eceff1', foreground: '#64748b' },
            accent:      { DEFAULT: '#eceff1', foreground: '#0f172a' },
            border:      '#e2e8f0',
            destructive: '#ef4444',
          },
          borderRadius: {
            sm: 'calc(0.75rem - 4px)',
            DEFAULT: '0.75rem',
            lg: '0.75rem',
          },
          fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
        }
      }
    }
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>
  ${bodyContent}
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.body.setAttribute('data-pdf-ready', 'true');
        });
      });
    });
  </script>
</body>
</html>`
}

// ─── Template: Minimal ───────────────────────────────────────────────────────

function renderMinimal(data: Record<string, unknown>, type: string): string {
  const sender   = (data.company as Record<string, unknown>) || {}
  const customer = (data.customer as Record<string, unknown>) || {}
  const bank     = (data.bank as Record<string, unknown>) || {}
  const currency = String(data.currency || 'USD')
  const items    = (data.items as Record<string, unknown>[]) || []

  const docNum     = type === 'invoice' ? esc(data.invoiceNumber) : esc(data.quotationNumber)
  const docDate    = esc(data.date) || 'N/A'
  const expiryDate = type === 'invoice' ? esc(data.dueDate) : esc(data.validUntil)
  const title      = type === 'invoice' ? 'INVOICE' : 'QUOTATION'
  const numLabel   = type === 'invoice' ? 'Invoice No #'   : 'Quotation No #'
  const dateLabel  = type === 'invoice' ? 'Invoice Date #' : 'Quotation Date #'

  const logoHtml = sender.logo
    ? `<img src="${esc(sender.logo)}" alt="Logo" style="max-width:180px;max-height:80px;object-fit:contain;" />`
    : sender.name
      ? `<h2 class="text-2xl font-bold text-primary text-right">${esc(sender.name)}</h2>`
      : `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" stroke="#4A154B" stroke-width="3"/><path d="M50 15L80 30V70L50 85L20 70V30L50 15Z" stroke="#1a2b6d" stroke-width="4"/></svg>`

  const invoiceColumns = (data.invoiceColumns as Record<string, any>[]) || [
    { id: 'name', label: 'Items Detail' },
    { id: 'qty', label: 'Quantity' },
    { id: 'price', label: 'Rate' },
    { id: 'rowTotal', label: 'Amount' }
  ]

  const theadHtml = invoiceColumns.map((col, idx) => {
    const isLast = idx === invoiceColumns.length - 1
    const borderStyle = isLast ? '' : 'style="border-right:1px solid rgba(255,255,255,0.2)"'
    
    let align = 'text-center'
    let width = ''
    if (col.id === 'name') { align = 'text-left'; width = 'w-full' }
    else if (col.id === 'qty') width = 'whitespace-nowrap px-4'
    else if (col.id === 'price') width = 'whitespace-nowrap px-4'
    else if (col.id === 'rowTotal') width = 'whitespace-nowrap px-4'
    else width = 'whitespace-nowrap px-4'

    return `<th class="py-3 px-4 font-normal text-sm ${align} ${width}" ${borderStyle}>${esc(col.label)}</th>`
  }).join('')

  const itemRows = items.map((item, i) => {
    const tds = invoiceColumns.map((col) => {
      let align = 'text-center'
      if (col.id === 'name') align = 'text-left'

      let content = ''
      if (col.id === 'name') {
        content = `<div class="flex"><span class="text-muted-foreground mr-2">${String(i + 1).padStart(2, '0')}.</span><div><span class="text-foreground">${esc(item.name)}</span>${item.description ? `<div class="text-muted-foreground text-xs mt-1">${esc(item.description)}</div>` : ''}</div></div>`
      } else if (col.id === 'qty') {
        content = String(Number(item.quantity) || 0).padStart(2, '0')
      } else if (col.id === 'price') {
        content = fmt(Number(item.price) || 0, currency)
      } else if (col.id === 'rowTotal') {
        content = fmt((Number(item.quantity) || 0) * (Number(item.price) || 0), currency)
      } else {
        if (col.type === 'formula') {
           content = fmt(Number((item as any)[col.id]) || 0, currency)
        } else {
           content = esc((item as any).customData?.[col.id] || '')
        }
      }

      return `<td class="py-4 px-4 text-foreground ${align}">${content}</td>`
    }).join('')

    return `<tr class="${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}">${tds}</tr>`
  }).join('')

  const termsLines = String(data.terms || '').split('\n')
    .map((line, i) => `<div class="flex gap-2"><span>${i + 1} :</span><span>${esc(line)}</span></div>`)
    .join('')

  return `<div class="bg-background p-8 font-sans max-w-[800px] mx-auto text-sm">
    <div class="flex flex-row justify-between items-start mb-6">
      <div>
        <h1 class="text-4xl font-bold text-primary mb-6 uppercase tracking-wider">${title}</h1>
        <div class="flex flex-col space-y-1 text-muted-foreground">
          <div class="flex"><span class="w-32">${numLabel}</span><span class="font-bold text-foreground">${docNum}</span></div>
          <div class="flex"><span class="w-32">${dateLabel}</span><span class="font-bold text-foreground">${docDate}</span></div>
        </div>
      </div>
      <div class="w-48 h-auto flex flex-col items-end justify-start">${logoHtml}</div>
    </div>
    <div class="border-b border-border mb-8"></div>
    <div class="flex flex-row gap-6 mb-8">
      <div class="w-1/2 bg-primary/10 p-5 rounded-lg">
        <h3 class="text-primary font-bold text-lg mb-3">Billed By</h3>
        <div class="space-y-1.5 text-foreground">
          ${sender.name    ? `<div><span class="font-bold">Company :</span> ${esc(sender.name)}</div>` : ''}
          ${sender.country ? `<div><span class="font-bold">Country :</span> ${esc(sender.country)}</div>` : ''}
          ${sender.address ? `<div><span class="font-bold">Address :</span> ${esc(sender.address)}</div>` : ''}
          ${sender.email   ? `<div><span class="font-bold">Email :</span> ${esc(sender.email)}</div>` : ''}
          ${sender.phone   ? `<div><span class="font-bold">Phone :</span> ${esc(sender.phone)}</div>` : ''}
          ${sender.website ? `<div><span class="font-bold">Website :</span> ${esc(sender.website)}</div>` : ''}
        </div>
      </div>
      <div class="w-1/2 bg-primary/10 p-5 rounded-lg">
        <h3 class="text-primary font-bold text-lg mb-3">Billed To</h3>
        <div class="space-y-1.5 text-foreground">
          <div><span class="font-bold">Client Name :</span> ${esc(customer.name) || 'N/A'}</div>
          ${customer.company ? `<div><span class="font-bold">Company :</span> ${esc(customer.company)}</div>` : ''}
          ${customer.address ? `<div><span class="font-bold">Address :</span> ${esc(customer.address)}</div>` : ''}
          ${customer.email   ? `<div><span class="font-bold">Email :</span> ${esc(customer.email)}</div>` : ''}
          ${customer.phone   ? `<div><span class="font-bold">Phone :</span> ${esc(customer.phone)}</div>` : ''}
          ${data.projectName ? `<div><span class="font-bold">Project Name :</span> ${esc(data.projectName)}</div>` : ''}
          ${expiryDate       ? `<div><span class="font-bold">${expiryLabel}</span> ${expiryDate}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="mb-12 border-b border-border" style="overflow:visible">
      <table class="w-full text-left border-collapse" style="min-width:500px;">
        <thead>
          <tr style="background:linear-gradient(to right,#29855b,#144b33);color:white;">
            ${theadHtml}
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>
    <div class="flex flex-row gap-12 mb-12">
      <div class="w-1/2 bg-primary/10 p-5 rounded-lg">
        <h3 class="text-primary font-bold text-lg pb-3 border-b border-border">Account Details</h3>
        <div class="space-y-1.5 text-foreground mt-3">
          <div><span class="font-bold">Account Name :</span> ${esc(bank.accountName) || esc(sender.name) || 'N/A'}</div>
          <div><span class="font-bold">Account Number :</span> ${esc(bank.accountNumber) || 'N/A'}</div>
          <div><span class="font-bold">IBAN :</span> ${esc(bank.iban) || 'N/A'}</div>
          <div><span class="font-bold">Bank :</span> ${esc(bank.bankName) || 'N/A'}</div>
        </div>
      </div>
      <div class="w-1/2">
        <div class="flex justify-between border-t border-b border-border py-3 mb-6">
          <span class="text-foreground font-medium text-base">Total Amount :</span>
          <span class="text-foreground font-medium text-base">${fmt(data.total, currency)}</span>
        </div>
        ${data.terms ? `<div><p class="font-bold text-foreground text-sm mb-3">Terms and Conditions :</p><div class="text-xs text-foreground space-y-1">${termsLines}</div></div>` : ''}
        ${data.notes ? `<div class="mt-4"><p class="font-bold text-foreground text-sm mb-3">Notes :</p><div class="text-xs text-foreground whitespace-pre-line">${esc(data.notes)}</div></div>` : ''}
      </div>
    </div>
    <div class="text-center text-xs text-muted-foreground mt-12 pb-4">
      This is an electronically generated document, no signature is required.
    </div>
  </div>`
}

// ─── Template: Corporate ─────────────────────────────────────────────────────

function renderCorporate(data: Record<string, unknown>, type: string): string {
  const sender   = (data.company as Record<string, unknown>) || {}
  const customer = (data.customer as Record<string, unknown>) || {}
  const bank     = (data.bank as Record<string, unknown>) || {}
  const currency = String(data.currency || 'USD')
  const items    = (data.items as Record<string, unknown>[]) || []

  const docNum     = type === 'invoice' ? esc(data.invoiceNumber) : esc(data.quotationNumber)
  const docDate    = esc(data.date) || 'N/A'
  const expiryDate = type === 'invoice' ? esc(data.dueDate) : esc(data.validUntil)
  const title      = type === 'invoice' ? 'INVOICE' : 'QUOTATION'

  const logoHtml = sender.logo
    ? `<img src="${esc(sender.logo)}" alt="Logo" class="max-w-full max-h-full object-contain" />`
    : `<div class="text-primary font-bold text-xs text-center">${esc(sender.name)}</div>`

  const invoiceColumns = (data.invoiceColumns as Record<string, any>[]) || [
    { id: 'name', label: 'Description' },
    { id: 'qty', label: 'Qty' },
    { id: 'price', label: 'Unit Price' },
    { id: 'rowTotal', label: 'Total' }
  ]

  const theadHtml = invoiceColumns.map((col, idx) => {
    const isLast = idx === invoiceColumns.length - 1
    const borderStyle = isLast ? 'border-b border-border' : 'border-b border-r border-border'
    
    let align = 'text-center'
    let width = ''
    if (col.id === 'name') { align = 'text-left'; width = 'w-full' }
    else if (col.id === 'qty') width = 'whitespace-nowrap px-4'
    else if (col.id === 'price') width = 'whitespace-nowrap px-4'
    else if (col.id === 'rowTotal') width = 'whitespace-nowrap px-4'
    else width = 'whitespace-nowrap px-4'

    return `<th class="py-3 px-4 font-bold text-xs uppercase tracking-wider text-foreground ${align} ${width} ${borderStyle}">${esc(col.label)}</th>`
  }).join('')

  const itemRows = items.map((item) => {
    const tds = invoiceColumns.map((col, idx) => {
      const isLast = idx === invoiceColumns.length - 1
      const borderStyle = isLast ? '' : 'border-r border-border'
      
      let align = 'text-center'
      if (col.id === 'name') align = 'text-left'

      let content = ''
      if (col.id === 'name') {
        content = `<div class="font-semibold text-foreground">${esc(item.name)}</div>${item.description ? `<div class="text-muted-foreground text-xs mt-1">${esc(item.description)}</div>` : ''}`
      } else if (col.id === 'qty') {
        content = String(Number(item.quantity) || 0)
      } else if (col.id === 'price') {
        content = fmt(Number(item.price) || 0, currency)
      } else if (col.id === 'rowTotal') {
        content = `<span class="font-medium">${fmt((Number(item.quantity) || 0) * (Number(item.price) || 0), currency)}</span>`
      } else {
        if (col.type === 'formula') {
           content = fmt(Number((item as any)[col.id]) || 0, currency)
        } else {
           content = esc((item as any).customData?.[col.id] || '')
        }
      }

      return `<td class="py-3 px-4 ${align} ${borderStyle}">${content}</td>`
    }).join('')

    return `<tr class="border-b border-border">${tds}</tr>`
  }).join('')

  const termsLines = String(data.terms || '').split('\n').map((l) => `<div>${esc(l)}</div>`).join('')

  return `<div class="bg-background font-sans max-w-[800px] mx-auto text-sm border border-border/50 shadow-sm">
    <div class="text-white p-6 flex justify-between items-start" style="background:linear-gradient(to right,#29855b,#144b33)">
      <div>
        <h1 class="text-3xl font-bold mb-2">${title}</h1>
        <div style="color:rgba(255,255,255,0.8)">
          <div class="flex gap-4"><span class="w-24 font-semibold">Ref Number:</span><span>${docNum}</span></div>
          <div class="flex gap-4 mt-1"><span class="w-24 font-semibold">Date:</span><span>${docDate}</span></div>
        </div>
      </div>
      <div class="w-24 h-24 bg-white p-2 rounded shadow-sm flex items-center justify-center">${logoHtml}</div>
    </div>
    <div class="p-6">
      <div class="flex flex-row gap-8 mb-10">
        <div class="w-1/2 border border-border rounded-sm">
          <div class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs">From</div>
          <div class="p-4 space-y-1.5 text-muted-foreground">
            ${sender.name    ? `<div><span class="font-bold text-foreground">Company: </span>${esc(sender.name)}</div>` : ''}
            ${sender.address ? `<div><span class="font-bold text-foreground">Address: </span>${esc(sender.address)}</div>` : ''}
            ${sender.country ? `<div><span class="font-bold text-foreground">Country: </span>${esc(sender.country)}</div>` : ''}
            ${sender.email   ? `<div><span class="font-bold text-foreground">Email: </span>${esc(sender.email)}</div>` : ''}
            ${sender.phone   ? `<div><span class="font-bold text-foreground">Phone: </span>${esc(sender.phone)}</div>` : ''}
            ${sender.website ? `<div><span class="font-bold text-foreground">Website: </span>${esc(sender.website)}</div>` : ''}
          </div>
        </div>
        <div class="w-1/2 border border-border rounded-sm">
          <div class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs">Billed To</div>
          <div class="p-4 space-y-1.5 text-muted-foreground">
            <div><span class="font-bold text-foreground">Name: </span>${esc(customer.name) || 'N/A'}</div>
            ${customer.company ? `<div><span class="font-bold text-foreground">Company: </span>${esc(customer.company)}</div>` : ''}
            ${customer.address ? `<div><span class="font-bold text-foreground">Address: </span>${esc(customer.address)}</div>` : ''}
            ${customer.email   ? `<div><span class="font-bold text-foreground">Email: </span>${esc(customer.email)}</div>` : ''}
            ${customer.phone   ? `<div><span class="font-bold text-foreground">Phone: </span>${esc(customer.phone)}</div>` : ''}
            ${data.projectName ? `<div class="mt-2 pt-2 border-t border-border border-dashed"><span class="font-bold text-foreground">Project: </span>${esc(data.projectName)}</div>` : ''}
            ${expiryDate       ? `<div><span class="font-bold text-foreground">${expiryLabel} </span>${expiryDate}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="mb-10" style="overflow:visible">
        <table class="w-full text-left border-collapse border border-border" style="min-width:500px;">
          <thead>
            <tr class="bg-muted">
              ${theadHtml}
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>
      <div class="flex flex-row justify-between items-start gap-8">
        <div class="flex-1 space-y-6">
          ${bank.accountName ? `
          <div class="border border-border rounded-sm">
            <div class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs">Payment Information</div>
            <div class="p-4 text-xs space-y-1">
              <div><span class="font-semibold w-24 inline-block">Bank:</span>${esc(bank.bankName)}</div>
              <div><span class="font-semibold w-24 inline-block">Account Name:</span>${esc(bank.accountName)}</div>
              <div><span class="font-semibold w-24 inline-block">Account No:</span>${esc(bank.accountNumber)}</div>
              ${bank.iban ? `<div><span class="font-semibold w-24 inline-block">IBAN:</span>${esc(bank.iban)}</div>` : ''}
            </div>
          </div>` : ''}
          ${data.terms ? `<div class="text-xs"><p class="font-bold uppercase tracking-wider mb-2 text-foreground">Terms &amp; Conditions</p><div class="text-muted-foreground space-y-1">${termsLines}</div></div>` : ''}
          ${data.notes ? `<div class="text-xs"><p class="font-bold uppercase tracking-wider mb-2 text-foreground">Notes</p><div class="text-muted-foreground">${esc(data.notes)}</div></div>` : ''}
        </div>
        <div class="w-64 border border-border rounded-sm">
          <div class="bg-muted px-4 py-2 font-bold text-foreground border-b border-border uppercase tracking-wider text-xs">Summary</div>
          <div class="p-4 space-y-3">
            <div class="flex justify-between text-muted-foreground"><span>Subtotal:</span><span>${fmt(data.subtotal, currency)}</span></div>
            ${Number(data.taxTotal) ? `<div class="flex justify-between text-muted-foreground"><span>Tax:</span><span>${fmt(data.taxTotal, currency)}</span></div>` : ''}
            ${Number(data.discount) ? `<div class="flex justify-between text-red-500"><span>Discount:</span><span>-${fmt(data.discount, currency)}</span></div>` : ''}
            <div class="pt-3 border-t border-border flex justify-between font-bold text-lg text-foreground"><span>Total:</span><span>${fmt(data.total, currency)}</span></div>
          </div>
        </div>
      </div>
      <div class="mt-16 text-center text-xs text-muted-foreground border-t border-border pt-4">This document is computer generated and requires no signature.</div>
    </div>
  </div>`
}

// ─── Template: Creative ──────────────────────────────────────────────────────

function renderCreative(data: Record<string, unknown>, type: string): string {
  const sender   = (data.company as Record<string, unknown>) || {}
  const customer = (data.customer as Record<string, unknown>) || {}
  const bank     = (data.bank as Record<string, unknown>) || {}
  const currency = String(data.currency || 'USD')
  const items    = (data.items as Record<string, unknown>[]) || []

  const docNum     = type === 'invoice' ? esc(data.invoiceNumber) : esc(data.quotationNumber)
  const docDate    = esc(data.date) || 'N/A'
  const expiryDate = type === 'invoice' ? esc(data.dueDate) : esc(data.validUntil)
  const title      = type === 'invoice' ? 'Invoice' : 'Quotation'

  const logoHtml = sender.logo
    ? `<img src="${esc(sender.logo)}" alt="Logo" class="max-w-full max-h-full object-contain" />`
    : `<div class="text-primary font-bold text-xs text-center">${esc(sender.name)}</div>`

  const invoiceColumns = (data.invoiceColumns as Record<string, any>[]) || [
    { id: 'name', label: 'Description' },
    { id: 'qty', label: 'Qty' },
    { id: 'price', label: 'Price' },
    { id: 'rowTotal', label: 'Total' }
  ]

  const theadHtml = invoiceColumns.map((col, idx) => {
    let align = 'text-center'
    let width = ''
    let colorClass = 'text-muted-foreground'
    if (col.id === 'name') { align = 'text-left'; width = 'w-full' }
    else if (col.id === 'qty') width = 'whitespace-nowrap px-4'
    else if (col.id === 'price') { align = 'text-right'; width = 'whitespace-nowrap px-4' }
    else if (col.id === 'rowTotal') { align = 'text-right'; width = 'whitespace-nowrap px-4'; colorClass = 'text-primary' }
    else { align = 'text-right'; width = 'whitespace-nowrap px-4' }

    return `<th class="py-3 ${colorClass} font-bold text-xs uppercase tracking-wider ${align} ${width}">${esc(col.label)}</th>`
  }).join('')

  const itemRows = items.map((item) => {
    const tds = invoiceColumns.map((col, idx) => {
      let align = 'text-center'
      if (col.id === 'name') align = 'text-left'
      else if (col.id === 'price' || col.id === 'rowTotal' || col.isCustom) align = 'text-right'

      let content = ''
      let extraClass = ''
      if (col.id === 'name') {
        content = `<div class="font-bold text-foreground">${esc(item.name)}</div>${item.description ? `<div class="text-muted-foreground text-xs mt-1">${esc(item.description)}</div>` : ''}`
      } else if (col.id === 'qty') {
        extraClass = 'font-medium'
        content = String(Number(item.quantity) || 0)
      } else if (col.id === 'price') {
        extraClass = 'text-muted-foreground'
        content = fmt(Number(item.price) || 0, currency)
      } else if (col.id === 'rowTotal') {
        extraClass = 'font-bold text-foreground'
        content = fmt((Number(item.quantity) || 0) * (Number(item.price) || 0), currency)
      } else {
        extraClass = 'text-muted-foreground'
        if (col.type === 'formula') {
           content = fmt(Number((item as any)[col.id]) || 0, currency)
        } else {
           content = esc((item as any).customData?.[col.id] || '')
        }
      }

      return `<td class="py-4 ${align} ${extraClass}">${content}</td>`
    }).join('')

    return `<tr class="border-b border-border/50">${tds}</tr>`
  }).join('')

  return `<div class="bg-background font-sans max-w-[800px] mx-auto text-sm shadow-sm flex flex-row" style="min-height:800px;">
    <div class="w-1/3 bg-primary/10 p-4 border-r border-primary/20 flex flex-col">
      <div class="mb-10 flex-shrink-0">
        <div class="bg-white p-2 rounded-xl shadow-sm flex items-center justify-center mb-6" style="width:130px;height:auto;">${logoHtml}</div>
        <h2 class="text-xl font-bold text-primary mb-4">${esc(sender.name)}</h2>
        <div class="space-y-3 text-foreground text-xs">
          ${sender.address ? `<div>${esc(sender.address)}${sender.country ? ', ' + esc(sender.country) : ''}</div>` : ''}
          ${sender.phone   ? `<div>${esc(sender.phone)}</div>` : ''}
          ${sender.email   ? `<div>${esc(sender.email)}</div>` : ''}
          ${sender.website ? `<div>${esc(sender.website)}</div>` : ''}
        </div>
      </div>
      <div class="mt-auto">
        <h3 class="text-primary font-bold mb-3 uppercase tracking-wider text-xs">Payment Details</h3>
        <div class="bg-background/50 p-4 rounded-xl space-y-2 text-xs">
          <div><span class="text-muted-foreground block text-[10px] uppercase tracking-wide">Bank Name</span><span class="font-medium text-foreground">${esc(bank.bankName) || 'N/A'}</span></div>
          <div><span class="text-muted-foreground block text-[10px] uppercase tracking-wide">Account Name</span><span class="font-medium text-foreground">${esc(bank.accountName) || 'N/A'}</span></div>
          <div><span class="text-muted-foreground block text-[10px] uppercase tracking-wide">Account Number</span><span class="font-medium text-foreground">${esc(bank.accountNumber) || 'N/A'}</span></div>
          ${bank.iban ? `<div><span class="text-muted-foreground block text-[10px] uppercase tracking-wide">IBAN</span><span class="font-medium text-foreground">${esc(bank.iban)}</span></div>` : ''}
        </div>
      </div>
    </div>
    <div class="w-2/3 p-6 flex flex-col bg-background">
      <div class="flex flex-row justify-between items-end mb-6 border-b-2 border-primary/20 pb-6 gap-4">
        <div>
          <h1 class="text-4xl font-black text-foreground tracking-tight uppercase">${title}</h1>
          <div class="text-primary font-medium mt-1">#${docNum}</div>
        </div>
        <div class="text-right text-sm">
          <div class="text-muted-foreground font-medium uppercase text-xs tracking-wider mb-1">Date Issued</div>
          <div class="font-bold text-foreground">${docDate}</div>
        </div>
      </div>
      <div class="mb-6">
        <h3 class="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-1 pb-1">Billed To</h3>
        <div class="text-lg font-semibold text-foreground mb-1">${esc(customer.name) || 'N/A'}</div>
        <div class="flex flex-row justify-between gap-2">
          <div class="text-muted-foreground mt-1 space-y-0.5 text-sm">
            ${customer.company ? `<div><span class="text-foreground">Company : </span>${esc(customer.company)}</div>` : ''}
            ${customer.address ? `<div><span class="text-foreground">Address : </span>${esc(customer.address)}</div>` : ''}
            ${customer.email   ? `<div><span class="text-foreground">Email : </span>${esc(customer.email)}</div>` : ''}
            ${customer.phone   ? `<div><span class="text-foreground">Phone : </span>${esc(customer.phone)}</div>` : ''}
          </div>
          <div class="flex flex-col gap-2 items-end">
            ${data.projectName ? `<div><div class="text-foreground">Project :</div><div class="text-muted-foreground text-sm text-end">${esc(data.projectName)}</div></div>` : ''}
            ${expiryDate       ? `<div><div class="text-foreground">${expiryLabel}</div><div class="text-muted-foreground text-sm text-end">${expiryDate}</div></div>` : ''}
          </div>
        </div>
      </div>
      <div class="mb-auto" style="overflow:visible">
      <table class="w-full text-left border-collapse" style="min-width:400px;">
          <thead>
            <tr class="border-b-2 border-primary/20">
              ${theadHtml}
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>
      <div class="w-64 ml-auto mt-8 space-y-3">
        <div class="flex justify-between text-muted-foreground text-sm"><span>Subtotal</span><span class="font-medium text-foreground">${fmt(data.subtotal, currency)}</span></div>
        ${Number(data.taxTotal) ? `<div class="flex justify-between text-muted-foreground text-sm"><span>Tax</span><span class="font-medium text-foreground">${fmt(data.taxTotal, currency)}</span></div>` : ''}
        ${Number(data.discount) ? `<div class="flex justify-between text-red-500 text-sm"><span>Discount</span><span class="font-medium">-${fmt(data.discount, currency)}</span></div>` : ''}
        <div class="pt-3 border-t-2 border-primary flex justify-between font-black text-xl text-primary"><span>Total</span><span>${fmt(data.total, currency)}</span></div>
      </div>
      ${data.terms || data.notes ? `
      <div class="mt-12 text-xs text-muted-foreground space-y-4">
        ${data.terms ? `<div><p class="font-bold uppercase tracking-wider text-foreground mb-1">Terms &amp; Conditions</p><div class="whitespace-pre-line">${esc(data.terms)}</div></div>` : ''}
        ${data.notes ? `<div><p class="font-bold uppercase tracking-wider text-foreground mb-1">Notes</p><div class="whitespace-pre-line">${esc(data.notes)}</div></div>` : ''}
      </div>` : ''}
    </div>
  </div>`
}

// ─── Template: Elegant ───────────────────────────────────────────────────────

function renderElegant(data: Record<string, unknown>, type: string): string {
  const sender   = (data.company as Record<string, unknown>) || {}
  const customer = (data.customer as Record<string, unknown>) || {}
  const bank     = (data.bank as Record<string, unknown>) || {}
  const currency = String(data.currency || 'USD')
  const items    = (data.items as Record<string, unknown>[]) || []

  const docNum     = type === 'invoice' ? esc(data.invoiceNumber) : esc(data.quotationNumber)
  const docDate    = esc(data.date) || 'N/A'
  const expiryDate = type === 'invoice' ? esc(data.dueDate) : esc(data.validUntil)
  const title      = type === 'invoice' ? 'Invoice' : 'Quotation'
  const numLabel   = type === 'invoice' ? 'Invoice Number :' : 'Quotation Number :'

  const logoHtml = sender.logo ? `<div class="mb-2"><img src="${esc(sender.logo)}" alt="Logo" style="height:auto;object-fit:contain;max-width:168px;" /></div>` : ''

  const invoiceColumns = (data.invoiceColumns as Record<string, any>[]) || [
    { id: 'name', label: 'Item Description' },
    { id: 'qty', label: 'Qty' },
    { id: 'price', label: 'Rate' },
    { id: 'rowTotal', label: 'Amount' }
  ]

  const theadHtml = invoiceColumns.map((col, idx) => {
    let align = 'text-center'
    let width = ''
    let colorClass = 'text-muted-foreground'
    if (col.id === 'name') { align = 'text-left'; width = 'w-full' }
    else if (col.id === 'qty') width = 'whitespace-nowrap px-4'
    else if (col.id === 'price') { align = 'text-right'; width = 'whitespace-nowrap px-4' }
    else if (col.id === 'rowTotal') { align = 'text-right'; width = 'whitespace-nowrap pl-4'; colorClass = 'text-foreground' }
    else { align = 'text-right'; width = 'whitespace-nowrap px-4' }

    return `<th class="py-3 text-xs font-semibold uppercase tracking-widest ${colorClass} border-b border-border/40 ${align} ${width}">${esc(col.label)}</th>`
  }).join('')

  const itemRows = items.map((item) => {
    const tds = invoiceColumns.map((col, idx) => {
      let align = 'text-center'
      if (col.id === 'name') align = 'text-left'
      else if (col.id === 'price' || col.id === 'rowTotal' || col.isCustom) align = 'text-right'

      let content = ''
      let extraClass = ''
      if (col.id === 'name') {
        extraClass = 'pr-4'
        content = `<div class="font-medium text-foreground">${esc(item.name)}</div>${item.description ? `<div class="text-muted-foreground font-light text-xs mt-1">${esc(item.description)}</div>` : ''}`
      } else if (col.id === 'qty') {
        extraClass = 'font-light'
        content = String(Number(item.quantity) || 0)
      } else if (col.id === 'price') {
        extraClass = 'font-light text-muted-foreground'
        content = fmt(Number(item.price) || 0, currency)
      } else if (col.id === 'rowTotal') {
        extraClass = 'font-medium text-foreground'
        content = fmt((Number(item.quantity) || 0) * (Number(item.price) || 0), currency)
      } else {
        extraClass = 'font-light text-muted-foreground'
        if (col.type === 'formula') {
           content = fmt(Number((item as any)[col.id]) || 0, currency)
        } else {
           content = esc((item as any).customData?.[col.id] || '')
        }
      }

      return `<td class="py-5 border-b border-border/20 ${align} ${extraClass}">${content}</td>`
    }).join('')

    return `<tr>${tds}</tr>`
  }).join('')

  return `<div class="bg-background font-sans max-w-[800px] mx-auto p-6 text-sm text-foreground">
    <div class="flex flex-col items-center justify-center border-b border-border/40 pb-10 mb-10 text-center">
      ${logoHtml}
      <h1 class="text-2xl font-light tracking-[0.2em] uppercase text-foreground mb-4">${esc(sender.name)}</h1>
      <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-light tracking-wide max-w-lg">
        ${sender.address ? `<span>${esc(sender.address)}</span>` : ''}
        ${sender.country ? `<span>${esc(sender.country)}</span>` : ''}
        ${sender.phone   ? `<span>${esc(sender.phone)}</span>` : ''}
        ${sender.email   ? `<span>${esc(sender.email)}</span>` : ''}
        ${sender.website ? `<span>${esc(sender.website)}</span>` : ''}
      </div>
    </div>
    <div class="flex flex-row justify-between items-start mb-12 gap-0">
      <div class="space-y-4">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-4">Invoice To</h2>
        <div class="text-foreground text-sm space-y-1">
          <div class="flex gap-4"><span class="font-light text-sm text-muted-foreground">Client Name : </span>${esc(customer.name) || 'N/A'}</div>
          ${customer.company ? `<div class="flex gap-4"><span class="font-light text-sm text-muted-foreground">Company : </span>${esc(customer.company)}</div>` : ''}
          ${customer.address ? `<div class="flex gap-4"><span class="font-light text-sm text-muted-foreground">Address : </span>${esc(customer.address)}</div>` : ''}
          ${customer.email   ? `<div class="flex gap-4"><span class="font-light text-sm text-muted-foreground">Email : </span>${esc(customer.email)}</div>` : ''}
          ${customer.phone   ? `<div class="flex gap-4"><span class="font-light text-sm text-muted-foreground">Phone : </span>${esc(customer.phone)}</div>` : ''}
        </div>
      </div>
      <div class="space-y-4 text-right w-auto">
        <div class="text-3xl font-light tracking-widest uppercase text-foreground">${title}</div>
        <div class="text-sm font-light space-y-1">
          <div class="flex justify-end gap-4"><span class="text-muted-foreground">${numLabel}</span><span class="font-medium text-foreground w-24">${docNum}</span></div>
          <div class="flex justify-end gap-4"><span class="text-muted-foreground">Date :</span><span class="font-medium text-foreground w-24">${docDate}</span></div>
          ${expiryDate ? `<div class="flex justify-end gap-4"><span class="text-muted-foreground">${expiryLabel}</span><span class="font-medium text-foreground w-24">${expiryDate}</span></div>` : ''}
        </div>
      </div>
    </div>
    <div class="mb-12" style="overflow:visible">
      <table class="w-full text-left border-collapse" style="min-width:500px;">
        <thead>
          <tr>
            ${theadHtml}
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>
    <div class="flex flex-row justify-between items-start gap-12">
      <div class="flex-1 space-y-8">
        ${bank.accountName ? `
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-3">Payment Details</h3>
          <div class="grid grid-cols-2 gap-y-2 text-xs font-light">
            <div class="text-muted-foreground">Bank</div><div class="font-medium text-foreground">${esc(bank.bankName) || 'N/A'}</div>
            <div class="text-muted-foreground">Account</div><div class="font-medium text-foreground">${esc(bank.accountName) || 'N/A'}</div>
            <div class="text-muted-foreground">Account No.</div><div class="font-medium text-foreground">${esc(bank.accountNumber) || 'N/A'}</div>
            ${bank.iban ? `<div class="text-muted-foreground">IBAN</div><div class="font-medium text-foreground">${esc(bank.iban)}</div>` : ''}
          </div>
        </div>` : ''}
        ${data.projectName ? `<div><h3 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-2">Project</h3><p class="text-xs font-light">${esc(data.projectName)}</p></div>` : ''}
      </div>
      <div class="w-64">
        <div class="space-y-3 font-light text-sm">
          <div class="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${fmt(data.subtotal, currency)}</span></div>
          ${Number(data.taxTotal) ? `<div class="flex justify-between text-muted-foreground"><span>Tax</span><span>${fmt(data.taxTotal, currency)}</span></div>` : ''}
          ${Number(data.discount) ? `<div class="flex justify-between text-muted-foreground"><span>Discount</span><span>-${fmt(data.discount, currency)}</span></div>` : ''}
          <div class="flex justify-between font-medium text-lg pt-4 border-t border-border/40 mt-2 text-foreground"><span>Total Due</span><span>${fmt(data.total, currency)}</span></div>
        </div>
      </div>
    </div>
    ${data.terms || data.notes ? `
    <div class="mt-16 pt-8 border-t border-border/40 flex flex-row gap-8 text-xs font-light">
      ${data.terms ? `<div class="w-1/2"><h4 class="font-semibold uppercase tracking-widest text-muted-foreground mb-2">Terms &amp; Conditions</h4><div class="text-muted-foreground whitespace-pre-line">${esc(data.terms)}</div></div>` : ''}
      ${data.notes ? `<div class="w-1/2"><h4 class="font-semibold uppercase tracking-widest text-muted-foreground mb-2">Notes</h4><div class="text-muted-foreground whitespace-pre-line">${esc(data.notes)}</div></div>` : ''}
    </div>` : ''}
    <div class="mt-12 text-center text-xs font-light text-muted-foreground tracking-wide">Thank you for your business.</div>
  </div>`
}

// ─── Router ──────────────────────────────────────────────────────────────────

function renderTemplate(data: Record<string, unknown>, templateName: string, type: string): string {
  switch (templateName) {
    case 'TemplateCorporate': return renderCorporate(data, type)
    case 'TemplateCreative':  return renderCreative(data, type)
    case 'TemplateElegant':   return renderElegant(data, type)
    default:                  return renderMinimal(data, type)
  }
}

// ─── Edge Function Handler ───────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { invoiceData, templateName = 'TemplateMinimal', type = 'invoice' } = body

    if (!invoiceData) {
      return new Response(
        JSON.stringify({ error: 'invoiceData is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const fullHtml = wrapHtml(renderTemplate(invoiceData, templateName, type))

    const pdfRes = await fetch(BROWSERLESS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: fullHtml,
        
        options: {
          format: 'A4',
          printBackground: true,
          margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        },
      }),
    })

    if (!pdfRes.ok) {
      const errText = await pdfRes.text()
      console.error('Browserless error:', errText)
      return new Response(
        JSON.stringify({ error: `Browserless error ${pdfRes.status}`, details: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pdfBytes = await pdfRes.arrayBuffer()
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Edge function error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
