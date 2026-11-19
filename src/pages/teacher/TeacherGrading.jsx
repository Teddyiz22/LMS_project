import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMyAssignments, getMyCourses, getSubmissions, gradeSubmission } from '../../services/teacherService.js'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

const statusFilters = ['all', 'submitted', 'graded']

function TeacherGrading() {
  const [submissions, setSubmissions] = useState([])
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [assignmentFilter, setAssignmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('submitted')
  const [selected, setSelected] = useState(null)
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [gradeError, setGradeError] = useState('')
  const [gradeMessage, setGradeMessage] = useState('')
  const [isGrading, setIsGrading] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [submissionData, courseData, assignmentData] = await Promise.all([
        getSubmissions(),
        getMyCourses(),
        getMyAssignments(),
      ])
      setSubmissions(submissionData.submissions)
      setCourses(courseData.courses)
      setAssignments(assignmentData.assignments)
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const visibleSubmissions = useMemo(
    () => submissions.filter((submission) => {
      const matchesCourse = courseFilter === 'all' || String(submission.courseId) === courseFilter
      const matchesAssignment = assignmentFilter === 'all' || String(submission.assignmentId) === assignmentFilter
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter
      return matchesCourse && matchesAssignment && matchesStatus
    }),
    [submissions, courseFilter, assignmentFilter, statusFilter],
  )

  // The submission row has no maxPoints; look it up from the assignment.
  const maxPointsFor = (submission) => {
    const assignment = assignments.find((item) => item.id === submission.assignmentId)
    return assignment?.maxPoints ?? 100
  }

  const openSubmission = (submission) => {
    setSelected(submission)
    setGrade(submission.grade !== null && submission.grade !== undefined ? String(submission.grade) : '')
    setFeedback(submission.feedback || '')
    setGradeError('')
    setGradeMessage('')
  }

  const handleGrade = async (event) => {
    event.preventDefault()
    if (!selected) return
    setGradeError('')
    setGradeMessage('')
    const numericGrade = Number(grade)
    const maxPoints = maxPointsFor(selected)
    if (grade === '' || Number.isNaN(numericGrade) || numericGrade < 0 || numericGrade > maxPoints) {
      setGradeError(`Enter a grade between 0 and ${maxPoints}.`)
      return
    }
    setIsGrading(true)
    try {
      await gradeSubmission(selected.id, { grade: numericGrade, feedback: feedback.trim() || undefined })
      setGradeMessage('Grade saved.')
      const { submissions: refreshed } = await getSubmissions()
      setSubmissions(refreshed)
      const updated = refreshed.find((item) => item.id === selected.id)
      if (updated) setSelected(updated)
    } catch (gradeErr) {
      setGradeError(gradeErr.message || 'The grade could not be saved.')
    } finally {
      setIsGrading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Teacher workspace' }, { label: 'Grading' }]} description="Review student submissions and record grades and feedback." title="Grading" />
      {isLoading ? (
        <LoadingState label="Loading submissions…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          <section className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="grading-course">Filter by course</label>
            <select className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" id="grading-course" onChange={(event) => { setCourseFilter(event.target.value); setAssignmentFilter('all') }} value={courseFilter}>
              <option value="all">All courses</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
            <label className="sr-only" htmlFor="grading-assignment">Filter by assignment</label>
            <select className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" id="grading-assignment" onChange={(event) => setAssignmentFilter(event.target.value)} value={assignmentFilter}>
              <option value="all">All assignments</option>
              {assignments.filter((assignment) => courseFilter === 'all' || String(assignment.courseId) === courseFilter).map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.title}</option>)}
            </select>
            <label className="sr-only" htmlFor="grading-status">Filter by status</label>
            <select className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm capitalize text-[#1E293B] outline-none focus:border-[#2563EB]" id="grading-status" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              {statusFilters.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </section>
          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card description={`${visibleSubmissions.length} submission${visibleSubmissions.length === 1 ? '' : 's'} shown`} title="Submissions">
              {visibleSubmissions.length === 0 ? (
                <p className="text-sm text-[#64748B]">No submissions in this list yet.</p>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {visibleSubmissions.map((submission) => (
                    <article className={`flex items-center justify-between gap-3 py-4 first:pt-0 ${selected?.id === submission.id ? 'rounded-lg bg-blue-50 px-3' : ''}`} key={submission.id}>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1E293B]">{submission.assignment}</p>
                        <p className="mt-1 text-sm text-[#64748B]">{submission.studentName} · {submission.course}</p>
                        <p className="mt-1 text-xs text-[#64748B]">Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={submission.status === 'graded' ? 'success' : 'warning'}>{submission.status}</Badge>
                        <Button onClick={() => openSubmission(submission)} size="sm" variant="outline">{submission.status === 'graded' ? 'Review' : 'Grade'}</Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>
            <Card description={selected ? `${selected.course} · ${selected.assignment}` : 'Pick a submission to review it.'} title={selected ? `Submission — ${selected.studentName}` : 'Grade submission'}>
              {!selected ? (
                <p className="text-sm text-[#64748B]">Select a submission on the left to read it and record a grade.</p>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[#64748B]">{selected.content}</p>
                  {selected.link && (
                    <p className="mt-3 text-sm">
                      <a className="font-medium text-[#2563EB] hover:text-blue-700" href={selected.link} rel="noreferrer" target="_blank">{selected.link}</a>
                    </p>
                  )}
                  <form className="mt-6 space-y-4 border-t border-[#E2E8F0] pt-5" onSubmit={handleGrade}>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Grade (out of {maxPointsFor(selected)})</span>
                      <input className="h-11 w-32 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" max={maxPointsFor(selected)} min="0" onChange={(event) => setGrade(event.target.value)} type="number" value={grade} />
                    </label>
                    <label>
                      <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Feedback (optional)</span>
                      <textarea className="min-h-24 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setFeedback(event.target.value)} placeholder="What did the student do well? What could improve?" value={feedback} />
                    </label>
                    {gradeError && <p className="rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{gradeError}</p>}
                    {gradeMessage && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{gradeMessage}</p>}
                    <Button isLoading={isGrading} size="sm" type="submit">Save grade</Button>
                  </form>
                </>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  )
}

export default TeacherGrading
