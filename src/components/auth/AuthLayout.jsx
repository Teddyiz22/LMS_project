import { GraduationCap, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

function AuthLayout({ children, description, footer, title }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.42),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(56,189,248,0.2),transparent_30%)]" />
        <Link className="relative z-10 flex w-fit items-center gap-2.5 text-white" to="/"><span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#2563EB]"><GraduationCap className="size-5" aria-hidden="true" /></span><span className="text-xl font-bold tracking-tight">EduFlow</span></Link>
        <div className="relative z-10 max-w-md"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#38BDF8]">Learn with purpose</p><h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white">Practical learning for your next big step.</h2><p className="mt-5 text-lg leading-8 text-slate-300">Build skills with expert-led courses and a learning experience designed around progress.</p><div className="mt-10 flex items-center gap-3 rounded-xl border border-slate-700/70 bg-white/5 p-4"><ShieldCheck className="size-6 shrink-0 text-[#38BDF8]" aria-hidden="true" /><p className="text-sm leading-6 text-slate-300">This frontend demo uses mock authentication only. Real account security will be added with the future backend.</p></div></div>
        <p className="relative z-10 text-sm text-slate-500">© 2026 EduFlow</p>
      </aside>
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md"><Link className="mb-10 flex w-fit items-center gap-2.5 text-[#1E293B] lg:hidden" to="/"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#2563EB] text-white"><GraduationCap className="size-5" aria-hidden="true" /></span><span className="text-lg font-bold tracking-tight">EduFlow</span></Link><div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8"><span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#2563EB]">Demo authentication</span><h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl">{title}</h1>{description && <p className="mt-2 text-sm leading-6 text-[#64748B]">{description}</p>}<div className="mt-7">{children}</div></div>{footer && <div className="mt-6 text-center text-sm text-[#64748B]">{footer}</div>}</div>
      </main>
    </div>
  )
}

export default AuthLayout
