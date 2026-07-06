import html2pdf from 'html2pdf.js'

export const generatePDF = (elementId: string, filename: string = 'document.pdf'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const originalElement = document.getElementById(elementId)
    if (!originalElement) {
      console.error(`Element with id ${elementId} not found.`)
      return reject(new Error('Element not found'))
    }

    // 1. Clone the template DOM element
    const clone = originalElement.cloneNode(true) as HTMLElement

    // 2. Programmatically append a specific class
    clone.classList.add('force-desktop')

    // 3. CRITICAL FIX: Bypass mobile media queries by removing responsive prefixes
    // This forces the cloned elements to evaluate their desktop classes as base classes universally
    const elements = clone.querySelectorAll('*')
    elements.forEach((el) => {
      let className = el.getAttribute('class')
      if (className) {
        // Strip md:, lg:, sm:, xl: prefixes from the cloned DOM
        const newClassName = className
          .replace(/md:/g, '')
          .replace(/lg:/g, '')
          .replace(/sm:/g, '')
          .replace(/xl:/g, '')
        el.setAttribute('class', newClassName)
      }
    })

    // 4. Create a hidden off-screen container and force desktop width
    const offScreenContainer = document.createElement('div')
    offScreenContainer.style.position = 'absolute'
    offScreenContainer.style.left = '-9999px'
    offScreenContainer.style.top = '0'
    offScreenContainer.style.width = '1200px' // Force fixed desktop width

    // Append clone to container, and container to DOM
    offScreenContainer.appendChild(clone)
    document.body.appendChild(offScreenContainer)

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 1200 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }

    // 5. Trigger PDF generation using isolated clone (No async/await)
    html2pdf().set(opt).from(clone).save()
      .then(() => {
        // 6. Cleanly remove the off-screen container from the DOM
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
