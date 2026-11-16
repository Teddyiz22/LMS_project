import { Clock3, Star, Users } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

function CourseCard({ course }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden"><img alt={`${course.title} course`} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" src={course.image} /><Badge className="absolute left-4 top-4 bg-white/95 text-[#2563EB] ring-white/50" variant="info">{course.category}</Badge></div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-[#64748B]">By {course.instructor}</p>
        <h3 className="mt-2 text-lg font-semibold leading-6 text-[#1E293B]">{course.title}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#64748B]"><span className="inline-flex items-center gap-1"><Star className="size-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />{course.rating}</span><span className="inline-flex items-center gap-1"><Users className="size-4" aria-hidden="true" />{course.students}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-4" aria-hidden="true" />{course.duration}</span></div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className={`text-base font-bold ${course.price === 'Free' ? 'text-[#22C55E]' : 'text-[#1E293B]'}`}>{course.price}</span><Button href="#get-started" size="sm" variant="outline">View Course</Button></div>
      </div>
    </article>
  )
}

export default CourseCard
