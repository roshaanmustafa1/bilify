// src/services/pdfService.ts
// Calls the Supabase Edge Function which uses Browserless (Puppeteer) for
// server-side, viewport-independent PDF generation — identical output on
// mobile and desktop.

const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  'https://sjqmmkfafotvjhupujoi.supabase.co';
const SUPABASE_ANON_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_C3TvLpCopYeqcou9OXPjfg_iv9IJx10';

/**
 * Generate a PDF via Browserless (server-side Chromium).
 *
 * @param invoiceData  The full computed invoice/quotation object
 * @param templateName One of: 'TemplateMinimal' | 'TemplateCorporate' | 'TemplateCreative' | 'TemplateElegant'
 * @param type         'invoice' or 'quotation'
 * @param filename     Filename for the downloaded PDF
 */
export const generatePDF = async (
  invoiceData: Record<string, unknown>,
  templateName: string = 'TemplateMinimal',
  type: 'invoice' | 'quotation' = 'invoice',
  filename: string = 'document.pdf',
  elementId: string = 'invoice-pdf'
): Promise<void> => {
  const edgeFnUrl = `${SUPABASE_URL}/functions/v1/generate-pdf`

  const fallbackToClientPdf = async (fallbackErr: string) => {
    const el = document.getElementById(elementId) || document.getElementById('invoice-preview')
    if (el) {
      console.warn(`Server PDF generation failed (${fallbackErr}), falling back to client-side PDF...`)
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule
      const opt: any = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      await html2pdf().set(opt).from(el).save()
      return true
    }
    return false
  }

  let response: Response | null = null
  let networkErrMsg = ''
  try {
    response = await fetch(edgeFnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ invoiceData, templateName, type }),
    })
  } catch (networkErr: unknown) {
    networkErrMsg = networkErr instanceof Error ? networkErr.message : String(networkErr)
  }

  if (response && response.ok) {
    // Download the returned PDF blob
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return
  }

  let detail = networkErrMsg
  if (response && !response.ok) {
    try {
      const json = await response.json()
      detail = json.error || json.details || JSON.stringify(json)
    } catch {
      detail = await response.text()
    }
  }

  // Gracefully fallback to client-side generation if server-side Edge Function fails
  const handled = await fallbackToClientPdf(detail || 'Unknown error')
  if (!handled) {
    const status = response ? response.status : 'Network'
    throw new Error(`PDF generation failed (${status}): ${detail}`)
  }
}
