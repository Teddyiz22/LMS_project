import { AtSign, Globe2, GraduationCap, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'

const footerLinks = ['Home', 'Explore Courses', 'Categories', 'About Us']
const courseLinks = ['Programming', 'Web Development', 'UI/UX Design', 'Data Science']

function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400" id="footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.25fr] lg:px-8"><div><a className="flex items-center gap-2.5 text-white" href="#home"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#2563EB]"><GraduationCap className="size-5" aria-hidden="true" /></span><span className="text-lg font-bold">EduFlow</span></a><p className="mt-4 max-w-xs text-sm leading-6">A modern learning platform built to help curious people develop practical skills and grow with confidence.</p><div className="mt-5 flex gap-2">{[{ icon: Globe2, label: 'LinkedIn' }, { icon: MessageCircle, label: 'X' }, { icon: Share2, label: 'Facebook' }, { icon: AtSign, label: 'Instagram' }].map(({ icon: Icon, label }) => <a aria-label={label} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" href="#footer" key={label}><Icon className="size-4" aria-hidden="true" /></a>)}</div></div><div><h2 className="text-sm font-semibold text-white">Quick links</h2><ul className="mt-4 space-y-3">{footerLinks.map((link) => <li key={link}><a className="text-sm transition hover:text-white" href={link === 'Home' ? '#home' : link === 'Explore Courses' ? '#featured-courses' : link === 'Categories' ? '#categories' : '#why-eduflow'}>{link}</a></li>)}</ul></div><div><h2 className="text-sm font-semibold text-white">Categories</h2><ul className="mt-4 space-y-3">{courseLinks.map((link) => <li key={link}><a className="text-sm transition hover:text-white" href="#categories">{link}</a></li>)}</ul></div><div><h2 className="text-sm font-semibold text-white">Contact</h2><ul className="mt-4 space-y-3 text-sm"><li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />hello@eduflow.example</li><li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />+1 (555) 010-2040</li><li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" aria-hidden="true" />Remote-first learning</li></ul></div></div>
      <div className="border-t border-slate-800"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:justify-between sm:px-6 lg:px-8"><p>© 2026 EduFlow. All rights reserved.</p><p>Portfolio demonstration project.</p></div></div>
    </footer>
  )
}

export default LandingFooter
