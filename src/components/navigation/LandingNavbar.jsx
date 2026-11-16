import { GraduationCap, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'

const navigationLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Explore Courses', href: '#featured-courses' },
  { label: 'Categories', href: '#categories' },
  { label: 'About Us', href: '#why-eduflow' },
]

function LandingNavbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const updateActiveSection = () => {
      const current = [...navigationLinks].reverse().find(({ href }) => {
        const section = document.querySelector(href)
        return section && section.getBoundingClientRect().top <= 120
      })
      setActiveSection(current?.href.slice(1) ?? 'home')
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()
    return () => window.removeEventListener('scroll', updateActiveSection)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-2.5 text-[#1E293B]" href="#home" onClick={closeMenu}>
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-sm"><GraduationCap className="size-5" aria-hidden="true" /></span>
          <span className="text-lg font-bold tracking-tight">EduFlow</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map(({ href, label }) => (
            <a className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeSection === href.slice(1) ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#1E293B]'}`} href={href} key={href}>{label}</a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link className="rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] transition-colors hover:text-[#2563EB]" to="/login">Log in</Link>
          <Button size="sm" to="/register">Get Started</Button>
        </div>

        <button aria-expanded={isMenuOpen} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="rounded-lg p-2 text-[#1E293B] transition-colors hover:bg-slate-100 lg:hidden" onClick={() => setIsMenuOpen((open) => !open)} type="button">
          {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map(({ href, label }) => <a className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#2563EB]" href={href} key={href} onClick={closeMenu}>{label}</a>)}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Button onClick={closeMenu} to="/login" variant="outline">Log in</Button>
              <Button onClick={closeMenu} to="/register">Get Started</Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

export default LandingNavbar
