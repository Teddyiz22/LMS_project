import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 500)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    updateVisibility()
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!isVisible) return null

  return <a aria-label="Back to top" className="fixed bottom-5 right-5 z-30 inline-flex size-11 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]" href="#home"><ArrowUp className="size-5" aria-hidden="true" /></a>
}

export default BackToTopButton
