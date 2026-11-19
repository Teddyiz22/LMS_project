import { ArrowRight, Award, CalendarDays, ChevronRight, PlayCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../../services/studentService.js'
import LearningActivityChart from '../../components/student/LearningActivityChart.jsx'
import ProgressBar from '../../components/student/ProgressBar.jsx'
import StudentCourseCard from '../../components/student/StudentCourseCard.jsx'
import StudentStatCard from '../../components/student/StudentStatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const assignmentVariant = { pending: 'warning', submitted: 'info', graded: 'success', overdue: 'danger' }

function StudentDashboard() {
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

  const firstName = (user?.fullName || 'Student').split(' ')[0]
  const courses = dashboard?.courses || []
  const assignments = dashboard?.assignments || []
  const schedule = dashboard?.schedule || []
  const stats = dashboard?.stats || []
  const achievements = dashboard?.achievements || []
  const currentCourse = dashboard?.currentCourse || null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'Overview' }]} description="Continue your learning journey and achieve your goals." title={`Welcome back, ${firstName}!`} />
        <LoadingState label="Loading your dashboard…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'Overview' }]} description="Continue your learning journey and achieve your goals." title={`Welcome back, ${firstName}!`} />
        <ErrorState message={error} onRetry={loadDashboard} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'Overview' }]} description="Continue your learning journey and achieve your goals." title={`Welcome back, ${firstName}!`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StudentStatCard key={stat.label} stat={stat} />)}
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Card description="Pick up where you left off." title="Continue Learning">
          {currentCourse ? (
            <div className="overflow-hidden rounded-xl bg-slate-950 text-white sm:flex">
              <img alt="" className="aspect-[16/9] w-full object-cover sm:aspect-auto sm:w-2/5" src={currentCourse.image} />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm text-slate-300">{currentCourse.instructor}</p>
                <h2 className="mt-1 text-xl font-semibold">{currentCourse.title}</h2>
                <p className="mt-4 text-sm text-slate-300">Current lesson: <span className="font-medium text-white">{currentCourse.currentLesson}</span></p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{currentCourse.completedLessons} of {currentCourse.totalLessons} lessons</span>
                  <span className="font-semibold text-[#38BDF8]">{currentCourse.progress}%</span>
                </div>
                <ProgressBar className="mt-2 bg-slate-700" value={currentCourse.progress} />
                <Button className="mt-5 self-start" size="sm" to="/student/courses">
                  <PlayCircle className="size-4" aria-hidden="true" />Continue Learning
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="You are not enrolled in any course yet."
              description="Browse the course catalogue on the home page and enroll to start learning."
              action={<Button size="sm" to="/">Browse courses</Button>}
            />
          )}
        </Card>
        <Card
          actions={<Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/student/schedule">Full schedule <ChevronRight className="size-4" aria-hidden="true" /></Link>}
          description="Your next live learning sessions."
          title="Upcoming Classes"
        >
          {schedule.length > 0 ? (
            <div className="space-y-4">
              {schedule.slice(0, 2).map((lesson) => (
                <div className="flex gap-3" key={lesson.id}>
                  <span className="inline-flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-[#2563EB]">
                    <CalendarDays className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1E293B]">{lesson.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{lesson.date} · {lesson.time}</p>
                    <p className="mt-1 text-xs text-[#64748B]">with {lesson.instructor}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full" size="sm" variant="outline" to="/student/schedule">Join next class</Button>
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">No classes scheduled. New sessions will appear here once your teachers schedule them.</p>
          )}
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Card
          actions={<Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/student/courses">All courses <ChevronRight className="size-4" aria-hidden="true" /></Link>}
          description="Your current course progress."
          title="My Courses"
        >
          {courses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 3).map((course) => <StudentCourseCard course={course} key={course.id} />)}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">No enrolled courses yet.</p>
          )}
        </Card>
        <Card description="Time spent learning this week." title="Learning Activity">
          <LearningActivityChart data={dashboard?.weeklyLearningActivity} />
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Card
          actions={<Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/student/assignments">All assignments <ChevronRight className="size-4" aria-hidden="true" /></Link>}
          description="Stay on top of your deadlines."
          title="Upcoming Assignments"
        >
          {assignments.length > 0 ? (
            <div className="divide-y divide-[#E2E8F0]">
              {assignments.slice(0, 3).map((assignment) => (
                <div className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between" key={assignment.id}>
                  <div>
                    <p className="font-medium text-[#1E293B]">{assignment.title}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{assignment.course}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{assignment.dueLabel}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={assignmentVariant[assignment.status]}>{assignment.status}</Badge>
                    <Button size="sm" to="/student/assignments" variant="outline">View</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">No assignments yet.</p>
          )}
        </Card>
        <Card description="Small wins that mark your progress." title="Recent Achievements">
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div className="flex items-center gap-3" key={achievement.title}>
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B]">
                    <Award className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1E293B]">{achievement.title}</p>
                    <p className="text-xs text-[#64748B]">{achievement.detail}</p>
                  </div>
                </div>
              ))}
              <Link className="inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:text-blue-700" to="/student/progress">
                View learning progress <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">Complete lessons and submit assignments to earn achievements.</p>
          )}
        </Card>
      </section>
    </div>
  )
}

export default StudentDashboard
