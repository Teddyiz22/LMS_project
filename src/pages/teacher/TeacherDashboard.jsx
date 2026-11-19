import { ArrowRight, CalendarDays, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../../services/teacherService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'
import StudentStatCard from '../../components/student/StudentStatCard.jsx'

function TeacherDashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getDashboard()
      setDashboard(data)
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  const firstName = (user?.fullName || 'Teacher').split(' ')[0]
  const stats = dashboard?.stats || []
  const courses = dashboard?.courses || []
  const assignments = dashboard?.assignments || []
  const pendingSubmissions = dashboard?.pendingSubmissions || []
  const upcomingClasses = dashboard?.upcomingClasses || []

  const statCards = stats

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Teacher workspace' }, { label: 'Overview' }]} description="Keep your courses, assignments and students on track." title={`Welcome back, ${firstName}!`} />
      {isLoading ? (
        <LoadingState label="Loading your dashboard…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboard} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => <StudentStatCard key={stat.label} stat={stat} />)}
          </div>
          <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <Card
              actions={<Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/teacher/courses">All courses <ChevronRight className="size-4" aria-hidden="true" /></Link>}
              description="Your published and draft courses."
              title="My Courses"
            >
              {courses.length > 0 ? (
                <div className="divide-y divide-[#E2E8F0]">
                  {courses.slice(0, 4).map((course) => (
                    <div className="flex items-center justify-between gap-3 py-3 first:pt-0" key={course.id}>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1E293B]">{course.title}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{course.students} student{course.students === 1 ? '' : 's'} · {course.lessonCount} lessons · {course.isPublished ? 'Published' : 'Draft'}</p>
                      </div>
                      <Button size="sm" to="/teacher/courses" variant="outline">Manage</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">No courses yet. Create your first course to start teaching.</p>
              )}
              <Button className="mt-4" size="sm" to="/teacher/courses">Create a course</Button>
            </Card>
            <Card
              actions={<Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/teacher/grading">Grade now <ChevronRight className="size-4" aria-hidden="true" /></Link>}
              description="Submissions waiting for your grade."
              title="Pending Grading"
            >
              {pendingSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {pendingSubmissions.slice(0, 4).map((submission) => (
                    <div className="flex items-center justify-between gap-3" key={submission.id}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1E293B]">{submission.assignment}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{submission.studentName} · {submission.course}</p>
                      </div>
                      <Badge variant="warning">pending</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Nothing to grade right now.</p>
              )}
            </Card>
          </section>
          <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <Card
              actions={<Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/teacher/assignments">All assignments <ChevronRight className="size-4" aria-hidden="true" /></Link>}
              description="Assignments across your courses."
              title="Assignments"
            >
              {assignments.length > 0 ? (
                <div className="divide-y divide-[#E2E8F0]">
                  {assignments.slice(0, 4).map((assignment) => (
                    <div className="flex items-center justify-between gap-3 py-3 first:pt-0" key={assignment.id}>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1E293B]">{assignment.title}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{assignment.course} · due {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'no due date'}</p>
                      </div>
                      <span className="shrink-0 text-xs text-[#64748B]">{assignment.submissionCount} submitted</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">No assignments yet.</p>
              )}
            </Card>
            <Card description="Your next live teaching sessions." title="Upcoming Classes">
              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.slice(0, 3).map((lesson) => (
                    <div className="flex gap-3" key={lesson.id}>
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                        <CalendarDays className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1E293B]">{lesson.title}</p>
                        <p className="mt-1 text-xs text-[#64748B]">
                          {lesson.startsAt ? new Date(lesson.startsAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ''}{lesson.startsAt ? ` · ${new Date(lesson.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : ''}{lesson.endsAt ? ` – ${new Date(lesson.endsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">No classes scheduled yet.</p>
              )}
              <Link className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/teacher/courses">
                Manage courses <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}

export default TeacherDashboard
