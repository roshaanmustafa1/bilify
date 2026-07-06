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
    clone.classList.add('force-desktop')

    // 2. CRITICAL CSS OVERRIDE: Strip responsive prefixes securely
    // Tailwind's source order means base utilities (like flex-col) will override stripped 
    // desktop utilities (like flex-row) if both are present.
    // We explicitly remove the conflicting mobile base classes before stripping the md: prefix.
    const elements = clone.querySelectorAll('*')
    elements.forEach((el) => {
      let className = el.getAttribute('class')
      if (className) {
        // Resolve flex layout conflicts
        if (className.includes('md:flex-row')) {
          className = className.replace(/\bflex-col-reverse\b/g, '').replace(/\bflex-col\b/g, '')
        }
        // Resolve grid columns conflicts
        if (className.match(/md:grid-cols-\d+/)) {
          className = className.replace(/\bgrid-cols-\d+\b/g, '')
        }
        // Resolve gap conflicts
        if (className.match(/md:gap-\d+/)) {
          className = className.replace(/\bgap-\d+\b/g, '')
        }
        // Resolve alignment conflicts
        if (className.includes('md:items-end')) {
          className = className.replace(/\bitems-start\b/g, '')
        }
        if (className.includes('md:text-right')) {
          className = className.replace(/\btext-left\b/g, '')
        }
        if (className.includes('md:justify-end')) {
          className = className.replace(/\bjustify-start\b/g, '')
        }
        // Resolve width conflicts
        if (className.match(/md:w-/)) {
          className = className.replace(/\bw-full\b/g, '')
        }
        // Resolve border conflicts
        if (className.includes('md:border-b-0')) {
          className = className.replace(/\bborder-b\b/g, '')
        }

        // Finally, strip the md:, lg:, sm: prefixes to elevate them to base utilities
        className = className.replace(/md:/g, '').replace(/lg:/g, '').replace(/sm:/g, '').replace(/xl:/g, '')
        
        // Clean up extra spaces
        el.setAttribute('class', className.replace(/\s+/g, ' ').trim())
      }
    })

    // 3. Create a safe off-screen container
    // Avoiding left: -9999px as html2canvas can sometimes clip bounding boxes outside the viewport
    const offScreenContainer = document.createElement('div')
    offScreenContainer.style.position = 'absolute'
    offScreenContainer.style.top = '0'
    offScreenContainer.style.left = '0'
    offScreenContainer.style.width = '1200px' // Force fixed desktop width
    offScreenContainer.style.zIndex = '-9999'
    offScreenContainer.style.opacity = '0'
    offScreenContainer.style.pointerEvents = 'none'

    offScreenContainer.appendChild(clone)
    document.body.appendChild(offScreenContainer)

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 1200 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    // 4. Trigger PDF generation (No async/await per strict requirements)
    html2pdf().set(opt).from(clone).save()
      .then(() => {
        // 5. Cleanly remove the off-screen container from the DOM
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
