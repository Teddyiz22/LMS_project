import { ArrowRight, CheckCircle2, PlayCircle, Star, Users } from 'lucide-react'
import Button from '../ui/Button.jsx'

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24" id="home">
      <div className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.12),transparent_30%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#2563EB]"><span className="size-2 rounded-full bg-[#38BDF8]" />Build skills that move you forward</span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl lg:leading-[1.08]">Learn New Skills.<br /><span className="text-[#2563EB]">Build Your Future.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#64748B]">Discover expert-led courses, develop practical skills, and take your career to the next level with EduFlow.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#featured-courses" size="lg">Explore Courses <ArrowRight className="size-4" aria-hidden="true" /></Button>
            <Button href="#get-started" size="lg" variant="outline"><PlayCircle className="size-4" aria-hidden="true" />Get Started</Button>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#64748B]">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#22C55E]" aria-hidden="true" />Learn at your own pace</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#22C55E]" aria-hidden="true" />Practical, project-based courses</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-3 shadow-2xl shadow-blue-900/10 sm:p-4">
            <img alt="Student learning from an online course" className="aspect-[4/3] w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1100&q=85" />
            <div className="absolute inset-x-7 bottom-7 rounded-xl border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur sm:inset-x-9 sm:bottom-9 sm:p-5">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">Course progress</p><p className="mt-1 text-base font-semibold text-[#1E293B]">Modern Web Development</p></div><span className="text-sm font-bold text-[#2563EB]">78%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-[78%] rounded-full bg-[#2563EB]" /></div>
            </div>
          </div>
          <div className="absolute -left-3 top-10 hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-lg sm:flex sm:items-center sm:gap-3 lg:-left-10"><span className="inline-flex size-10 items-center justify-center rounded-full bg-amber-50 text-[#F59E0B]"><Star className="size-5 fill-current" aria-hidden="true" /></span><div><p className="text-sm font-bold text-[#1E293B]">4.9/5 rating</p><p className="text-xs text-[#64748B]">from learners</p></div></div>
          <div className="absolute -bottom-5 right-2 hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-lg sm:flex sm:items-center sm:gap-3 lg:-right-7"><span className="inline-flex size-10 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]"><Users className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-bold text-[#1E293B]">10,000+</p><p className="text-xs text-[#64748B]">active learners</p></div></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
