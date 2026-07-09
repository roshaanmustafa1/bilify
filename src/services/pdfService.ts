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
        // Tell html2canvas to simulate a 1024px wide viewport so Tailwind
        // desktop breakpoints (md:, lg:) are triggered even on mobile devices.
        windowWidth: 1024,
        onclone: (_clonedDoc: Document, clonedEl: HTMLElement) => {
          // Force the invoice element itself to desktop width so the template
          // renders identically on mobile and desktop.
          clonedEl.style.width = '800px'
          clonedEl.style.minWidth = '800px'
          clonedEl.style.maxWidth = '800px'
          clonedEl.style.maxHeight = 'none'
          clonedEl.style.overflow = 'visible'

          // Clear overflow / height constraints on every ancestor up to <body>
          // so nothing clips the content during canvas rendering.
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
