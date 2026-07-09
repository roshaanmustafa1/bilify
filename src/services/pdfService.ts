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
        // Capture in-place so CSS variables, styles, and layout are fully resolved
        onclone: (clonedDoc: Document) => {
          const clonedEl = clonedDoc.getElementById(elementId)
          if (clonedEl) {
            // Override any max-height or overflow constraints from parent containers
            clonedEl.style.maxHeight = 'none'
            clonedEl.style.overflow = 'visible'
            // Walk up and clear any constraining styles on parent nodes inside the cloned doc
            let parent = clonedEl.parentElement
            while (parent && parent !== clonedDoc.body) {
              parent.style.maxHeight = 'none'
              parent.style.overflow = 'visible'
              parent.style.height = 'auto'
              parent = parent.parentElement
            }
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
