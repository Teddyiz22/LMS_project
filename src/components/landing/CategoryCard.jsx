import { ArrowUpRight } from 'lucide-react'

function CategoryCard({ category }) {
  const Icon = category.icon
  return (
    <a className="group rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md" href="#featured-courses">
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white"><Icon className="size-5" aria-hidden="true" /></span>
      <div className="mt-5 flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#1E293B]">{category.name}</h3><p className="mt-1 text-sm leading-6 text-[#64748B]">{category.description}</p></div><ArrowUpRight className="size-5 shrink-0 text-slate-400 transition group-hover:text-[#2563EB]" aria-hidden="true" /></div>
      <p className="mt-4 text-sm font-medium text-[#2563EB]">{category.courses}</p>
    </a>
  )
}

export default CategoryCard
