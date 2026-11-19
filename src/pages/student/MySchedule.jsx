import { CalendarDays, Clock3, Video } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMySchedule } from '../../services/studentService.js'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function MySchedule() {
  const [schedule, setSchedule] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSchedule = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const { classes } = await getMySchedule()
      setSchedule(classes)
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadSchedule() }, [loadSchedule])

  const upcomingClasses = useMemo(
    () => [...schedule].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [schedule],
  )

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'My Schedule' }]} description="Plan your week around upcoming classes and focused learning time." title="My Schedule" />
      {isLoading ? (
        <LoadingState label="Loading your schedule…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadSchedule} />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
          <Card description="Join your next instructor-led learning session." title="Upcoming Classes">
            {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map((lesson) => (
                  <article className="rounded-xl border border-[#E2E8F0] p-4" key={lesson.id}>
                    <div className="flex gap-3">
                      <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ${lesson.color}`}>
                        <Video className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-semibold text-[#1E293B]">{lesson.title}</h2>
                        <p className="mt-1 text-sm text-[#64748B]">with {lesson.instructor}</p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {lesson.date}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                          <Clock3 className="size-3.5" aria-hidden="true" />
                          {lesson.time}
                        </p>
                      </div>
                    </div>
                    {lesson.meetingLink ? (
                      <Button className="mt-4 w-full" href={lesson.meetingLink} size="sm" variant="outline">Join Class</Button>
                    ) : (
                      <Button className="mt-4 w-full" disabled size="sm" variant="outline">No class link yet</Button>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">No classes scheduled. New sessions will appear here once your teachers schedule them.</p>
            )}
          </Card>
          <Card description="Your weekly class plan." title="This Week">
            <div className="overflow-x-auto">
              <div className="min-w-155">
                <div className="grid grid-cols-5 border-b border-[#E2E8F0]">
                  {weekDays.map((day) => <div className="p-3 text-center text-sm font-semibold text-[#1E293B]" key={day}>{day}</div>)}
                </div>
                <div className="grid min-h-80 grid-cols-5 divide-x divide-[#E2E8F0]">
                  {weekDays.map((day) => (
                    <div className="relative p-2" key={day}>
                      {upcomingClasses.filter((lesson) => lesson.day === day).map((lesson) => (
                        <div className={`rounded-lg p-2 text-xs ${lesson.color}`} key={lesson.id}>
                          <p className="font-semibold">{lesson.timeSlot}</p>
                          <p className="mt-1 font-medium leading-4">{lesson.title}</p>
                          <p className="mt-1 opacity-80">{lesson.instructor}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}
    </div>
  )
}

export default MySchedule
