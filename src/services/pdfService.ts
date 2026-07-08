import html2pdf from 'html2pdf.js'

export const generatePDF = (elementId: string, filename: string = 'document.pdf'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const originalElement = document.getElementById(elementId)
    if (!originalElement) {
      console.error(`Element with id ${elementId} not found.`)
      return reject(new Error('Element not found'))
    }

    // 1. Deep clone the template DOM element
    const clone = originalElement.cloneNode(true) as HTMLElement
    
    // Add a specialized class that our templates can use to enforce desktop-style 
    // rendering (e.g. flex-wrap: nowrap) during the PDF generation.
    clone.classList.add('pdf-export-mode')
    
    // Force the element itself to have the exact desktop dimensions we want
    clone.style.width = '1024px'
    clone.style.maxWidth = '1024px'
    clone.style.minWidth = '1024px'
    clone.style.margin = '0'
    clone.style.padding = '24px' // Provide some padding that might have been reliant on mx-auto
    
    // 2. Create a safe off-screen container matching standard desktop dimensions
    const offScreenContainer = document.createElement('div')
    offScreenContainer.style.position = 'absolute'
    offScreenContainer.style.top = '-9999px' // Hidden off-screen, but far enough not to interfere
    offScreenContainer.style.left = '-9999px'
    offScreenContainer.style.width = '1024px'
    offScreenContainer.style.backgroundColor = '#ffffff'
    
    // Append the clone to our hidden container, then to the document body so html2canvas can read it
    offScreenContainer.appendChild(clone)
    document.body.appendChild(offScreenContainer)

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      // Enforce the simulated windowWidth so any responsive logic in tailwind triggers at md/lg tier
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        windowWidth: 1024,
        logging: false 
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    // 3. Trigger PDF generation
    html2pdf().set(opt).from(offScreenContainer).save()
      .then(() => {
        // 4. Cleanly remove the off-screen container from the DOM
        if (document.body.contains(offScreenContainer)) {
          document.body.removeChild(offScreenContainer)
        }
        resolve()
      })
      .catch((error: any) => {
        console.error('Error generating PDF:', error)
        if (document.body.contains(offScreenContainer)) {
          document.body.removeChild(offScreenContainer)
        }
        reject(error)
      })
  })
}
