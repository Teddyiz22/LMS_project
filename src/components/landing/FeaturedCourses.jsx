import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { courses as fallbackCourses } from '../../data/landingData.js'
import { listCourses } from '../../services/courseService.js'
import Button from '../ui/Button.jsx'
import CourseCard from './CourseCard.jsx'

function FeaturedCourses() {
  const [courses, setCourses] = useState(fallbackCourses)
  const [isLiveData, setIsLiveData] = useState(false)

  useEffect(() => {
    let isMounted = true
    listCourses({ page: 1, limit: 6 })
      .then((data) => {
        if (!isMounted) return
        if (data.items && data.items.length > 0) {
          setCourses(data.items)
          setIsLiveData(true)
        }
      })
      .catch(() => {
        // The API is not reachable: keep the built-in course list so the
        // landing page still looks right.
      })
    return () => { isMounted = false }
  }, [])

  return (
    <section className="bg-white py-16 sm:py-20" id="featured-courses">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">Curated for career growth</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">Popular Courses</h2><p className="mt-4 text-base leading-7 text-[#64748B]">Explore courses designed to help you gain practical knowledge.</p></div><Button href="#categories" variant="outline">View all categories <ArrowRight className="size-4" aria-hidden="true" /></Button></div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <CourseCard course={course} key={course.id || course.title} />)}</div>
        {!isLiveData && <p className="mt-6 text-center text-xs text-[#64748B]">Course list shown from built-in data because the EduFlow API is not reachable right now.</p>}
      </div>
    </section>
  )
}

export default FeaturedCourses
