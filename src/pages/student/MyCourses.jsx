import { Search, SlidersHorizontal } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMyCourses } from '../../services/studentService.js'
import StudentCourseCard from '../../components/student/StudentCourseCard.jsx'
import Button from '../../components/ui/Button.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [progress, setProgress] = useState('all')

  const loadCourses = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const { courses: loaded } = await getMyCourses()
      setCourses(loaded)
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadCourses() }, [loadCourses])

  const categories = useMemo(() => [...new Set(courses.map((course) => course.category))], [courses])
  const visibleCourses = useMemo(() => courses.filter((course) => {
    const matchesSearch = `${course.title} ${course.instructor}`.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || course.category === category
    const matchesProgress = progress === 'all' || (progress === 'completed' ? course.progress === 100 : progress === 'in-progress' ? course.progress > 0 && course.progress < 100 : course.progress < 50)
    return matchesSearch && matchesCategory && matchesProgress
  }), [courses, category, progress, search])

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'My Courses' }]} description="Find a course and pick up right where you left off." title="My Courses" />
      {isLoading ? (
        <LoadingState label="Loading your courses…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCourses} />
      ) : courses.length === 0 ? (
        <EmptyState
          title="You are not enrolled in any course yet."
          description="Browse the course catalogue on the home page and enroll to start learning."
          action={<Button size="sm" to="/">Browse courses</Button>}
        />
      ) : (
        <>
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="relative">
                <span className="sr-only">Search courses</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setSearch(event.target.value)} placeholder="Search courses or instructors" type="search" value={search} />
              </label>
              <label className="sr-only" htmlFor="course-category">Filter by category</label>
              <select className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" id="course-category" onChange={(event) => setCategory(event.target.value)} value={category}>
                <option value="all">All categories</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <label className="sr-only" htmlFor="course-progress">Filter by progress</label>
              <select className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" id="course-progress" onChange={(event) => setProgress(event.target.value)} value={progress}>
                <option value="all">All progress</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="starting">Under 50%</option>
              </select>
            </div>
          </section>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B]">{visibleCourses.length} course{visibleCourses.length === 1 ? '' : 's'} found</p>
            <Button className="hidden sm:inline-flex" size="sm" variant="outline"><SlidersHorizontal className="size-4" aria-hidden="true" />Filters active</Button>
          </div>
          {visibleCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleCourses.map((course) => <StudentCourseCard course={course} key={course.id} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-10 text-center">
              <p className="font-medium text-[#1E293B]">No courses match these filters.</p>
              <button className="mt-2 text-sm font-medium text-[#2563EB]" onClick={() => { setSearch(''); setCategory('all'); setProgress('all') }} type="button">Clear filters</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyCourses
