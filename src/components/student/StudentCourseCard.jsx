import { BookOpen, CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import ProgressBar from './ProgressBar.jsx'

function StudentCourseCard({ course, compact = false }) {
  return <article className={`overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm ${compact ? 'flex' : ''}`}><img alt="" className={compact ? 'h-28 w-28 shrink-0 object-cover sm:h-32 sm:w-36' : 'aspect-[16/9] w-full object-cover'} src={course.image} /><div className="min-w-0 flex-1 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><Badge variant="info">{course.category}</Badge>{course.progress === 100 && <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22C55E]"><CheckCircle2 className="size-3.5" aria-hidden="true" />Completed</span>}</div><h3 className="mt-2 line-clamp-2 font-semibold text-[#1E293B]">{course.title}</h3><p className="mt-1 text-sm text-[#64748B]">{course.instructor}</p><div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#64748B]"><span>{course.completedLessons} of {course.totalLessons} lessons</span><span className="font-semibold text-[#2563EB]">{course.progress}%</span></div><ProgressBar className="mt-2" value={course.progress} />{!compact && <Button className="mt-4 w-full" size="sm" variant="outline"><BookOpen className="size-4" aria-hidden="true" />View Course</Button>}</div></article>
}

export default StudentCourseCard
