// src/services/pdfService.ts
// Calls the Supabase Edge Function which uses Browserless (Puppeteer) for
// server-side, viewport-independent PDF generation — identical output on
// mobile and desktop.

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = (
  (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY
) as string

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
  filename: string = 'document.pdf'
): Promise<void> => {
  const edgeFnUrl = `${SUPABASE_URL}/functions/v1/generate-pdf`

  let response: Response
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
    const msg = networkErr instanceof Error ? networkErr.message : String(networkErr)
    throw new Error(`Network error calling PDF service: ${msg}`)
  }

  if (!response.ok) {
    let detail = ''
    try {
      const json = await response.json()
      detail = json.error || json.details || JSON.stringify(json)
    } catch {
      detail = await response.text()
    }
    throw new Error(`PDF generation failed (${response.status}): ${detail}`)
  }

  // Download the returned PDF blob
  const blob = await response.blob()
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
