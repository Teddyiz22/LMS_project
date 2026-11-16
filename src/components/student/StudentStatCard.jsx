import { BarChart3, BookOpen, CheckCircle2, Clock3 } from 'lucide-react'

const icons = { blue: BookOpen, green: CheckCircle2, violet: Clock3, amber: BarChart3 }
const tones = { blue: 'bg-blue-50 text-[#2563EB]', green: 'bg-green-50 text-[#22C55E]', violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-[#F59E0B]' }

function StudentStatCard({ stat }) {
  const Icon = icons[stat.tone]
  return <article className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#64748B]">{stat.label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-[#1E293B]">{stat.value}</p></div><span className={`inline-flex size-10 items-center justify-center rounded-xl ${tones[stat.tone]}`}><Icon className="size-5" aria-hidden="true" /></span></div><p className="mt-3 text-xs text-[#64748B]">{stat.detail}</p></article>
}

export default StudentStatCard
