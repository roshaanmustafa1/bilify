import html2pdf from 'html2pdf.js'

export const generatePDF = (elementId: string, filename: string = 'document.pdf'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`Element with id ${elementId} not found.`)
      return reject(new Error('Element not found'))
    }

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        // Simulate a 1024px desktop viewport so Tailwind md:/lg: classes activate
        windowWidth: 1024,
        onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
          // ─────────────────────────────────────────────────────────────────
          // STEP 1: Inject CSS overrides into the cloned document.
          // Since CSS media queries are evaluated against the real browser
          // viewport (not windowWidth), we must force desktop layout via
          // !important rules regardless of the physical screen width.
          // ─────────────────────────────────────────────────────────────────
          const styleEl = clonedDoc.createElement('style')
          styleEl.textContent = `
            /* Force the invoice root to desktop width */
            #${elementId} {
              width: 800px !important;
              min-width: 800px !important;
              max-width: 800px !important;
              max-height: none !important;
              overflow: visible !important;
            }
            /* Force first child (template root) to full width */
            #${elementId} > * {
              width: 100% !important;
              max-width: 800px !important;
              min-width: 0 !important;
            }
            /* Prevent flex items from wrapping or stacking vertically */
            #${elementId} .flex {
              flex-wrap: nowrap !important;
            }
            #${elementId} .flex-col {
              flex-direction: column !important;
            }
            #${elementId} .flex-row {
              flex-direction: row !important;
            }
            /* Restore half-width columns (Billed By / Billed To, Account Details / Totals) */
            #${elementId} .w-1\\/2 {
              width: 50% !important;
            }
            /* Ensure table renders at full width and doesn't collapse */
            #${elementId} table {
              width: 100% !important;
              min-width: 500px !important;
            }
            /* Clear overflow on the table wrapper */
            #${elementId} .overflow-x-auto {
              overflow: visible !important;
            }
          `
          clonedDoc.head.appendChild(styleEl)

          // ─────────────────────────────────────────────────────────────────
          // STEP 2: Clear overflow / max-height on every ancestor so the
          // full invoice height is rendered without any clipping.
          // ─────────────────────────────────────────────────────────────────
          let parent = clonedEl.parentElement
          while (parent && parent.tagName !== 'BODY') {
            parent.style.maxHeight = 'none'
            parent.style.overflow = 'visible'
            parent.style.height = 'auto'
            parent.style.width = 'auto'
            parent = parent.parentElement
          }
        }
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    html2pdf().set(opt).from(element).save()
      .then(() => resolve())
      .catch((error: any) => {
        console.error('Error generating PDF:', error)
        reject(error)
      })
  })
}
