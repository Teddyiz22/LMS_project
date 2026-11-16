import { BookOpen } from 'lucide-react'

function InstructorCard({ instructor }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <img alt={instructor.name} className="aspect-[4/3] w-full object-cover" src={instructor.image} />
      <div className="p-5"><h3 className="text-lg font-semibold text-[#1E293B]">{instructor.name}</h3><p className="mt-1 text-sm font-medium text-[#2563EB]">{instructor.specialty}</p><p className="mt-3 text-sm leading-6 text-[#64748B]">{instructor.intro}</p><p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B]"><BookOpen className="size-4 text-[#2563EB]" aria-hidden="true" />{instructor.courses}</p></div>
    </article>
  )
}

export default InstructorCard
