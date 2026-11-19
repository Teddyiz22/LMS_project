import { CalendarClock, FileText } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMyAssignments, submitAssignment } from '../../services/studentService.js'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

const filters = ['all', 'pending', 'submitted', 'graded', 'overdue']
const variants = { pending: 'warning', submitted: 'info', graded: 'success', overdue: 'danger' }

function MyAssignments() {
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submissionContent, setSubmissionContent] = useState('')
  const [submissionLink, setSubmissionLink] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadAssignments = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const { assignments: loaded } = await getMyAssignments()
      setAssignments(loaded)
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadAssignments() }, [loadAssignments])

  const visibleAssignments = useMemo(
    () => assignments.filter((assignment) => activeFilter === 'all' || assignment.status === activeFilter),
    [activeFilter, assignments],
  )

  const openAssignment = (assignment) => {
    setSelectedAssignment(assignment)
    setSubmissionContent(assignment.submission?.content || '')
    setSubmissionLink(assignment.submission?.link || '')
    setSubmissionError('')
    setSubmissionMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedAssignment) return
    if (!submissionContent.trim()) {
      setSubmissionError('Write your submission text first.')
      return
    }
    setSubmissionError('')
    setSubmissionMessage('')
    setIsSubmitting(true)
    try {
      await submitAssignment(selectedAssignment.id, {
        content: submissionContent.trim(),
        link: submissionLink.trim() || undefined,
      })
      setSubmissionMessage('Submitted. Your teacher will grade it soon.')
      const refreshed = await getMyAssignments()
      setAssignments(refreshed.assignments)
      const updated = refreshed.assignments.find((item) => item.id === selectedAssignment.id)
      if (updated) setSelectedAssignment(updated)
    } catch (submitError) {
      setSubmissionError(submitError.message || 'The submission could not be saved.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'My Assignments' }]} description="Review assignment requirements and keep your submissions on track." title="My Assignments" />
      {isLoading ? (
        <LoadingState label="Loading your assignments…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAssignments} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${activeFilter === filter ? 'bg-[#2563EB] text-white' : 'bg-white text-[#64748B] ring-1 ring-inset ring-[#E2E8F0] hover:text-[#2563EB]'}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter} <span className="ml-1 opacity-80">{filter === 'all' ? assignments.length : assignments.filter((item) => item.status === filter).length}</span>
              </button>
            ))}
          </div>
          <Card description={`${visibleAssignments.length} assignment${visibleAssignments.length === 1 ? '' : 's'} shown`} title="Assignment list">
            {visibleAssignments.length === 0 ? (
              <p className="text-sm text-[#64748B]">No assignments in this list yet.</p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {visibleAssignments.map((assignment) => (
                  <article className="flex flex-col gap-4 py-5 first:pt-0 md:flex-row md:items-center md:justify-between" key={assignment.id}>
                    <div className="flex gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                        <FileText className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="font-semibold text-[#1E293B]">{assignment.title}</h2>
                        <p className="mt-1 text-sm text-[#64748B]">{assignment.course}</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                          <CalendarClock className="size-3.5" aria-hidden="true" />
                          {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'} · {assignment.dueLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <Badge variant={variants[assignment.status]}>{assignment.status}</Badge>
                      <Button onClick={() => openAssignment(assignment)} size="sm" variant="outline">View details</Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
          {selectedAssignment && (
            <Card
              actions={<button aria-label="Close assignment details" className="text-sm font-medium text-[#2563EB]" onClick={() => setSelectedAssignment(null)} type="button">Close</button>}
              description={selectedAssignment.course}
              title={selectedAssignment.title}
            >
              <p className="text-sm leading-6 text-[#64748B]">{selectedAssignment.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge variant={variants[selectedAssignment.status]}>{selectedAssignment.status}</Badge>
                <span className="text-sm text-[#64748B]">
                  Due {selectedAssignment.dueDate ? new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'no due date'}
                </span>
                {selectedAssignment.submission?.grade !== null && selectedAssignment.submission?.grade !== undefined && (
                  <span className="text-sm font-semibold text-[#2563EB]">Grade: {selectedAssignment.submission.grade} / {selectedAssignment.maxPoints}</span>
                )}
              </div>
              {selectedAssignment.submission?.feedback && (
                <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-[#1E293B]">
                  <span className="font-medium">Teacher feedback: </span>{selectedAssignment.submission.feedback}
                </p>
              )}
              {(selectedAssignment.status === 'pending' || selectedAssignment.status === 'overdue' || selectedAssignment.status === 'submitted') && (
                <form className="mt-6 space-y-4 border-t border-[#E2E8F0] pt-5" onSubmit={handleSubmit}>
                  <h3 className="font-semibold text-[#1E293B]">{selectedAssignment.status === 'submitted' ? 'Update your submission' : 'Submit your work'}</h3>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Submission text</span>
                    <textarea
                      className="min-h-28 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                      onChange={(event) => setSubmissionContent(event.target.value)}
                      placeholder="Write your answer, or describe what you built…"
                      value={submissionContent}
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Link (optional)</span>
                    <input
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                      onChange={(event) => setSubmissionLink(event.target.value)}
                      placeholder="https://…"
                      type="url"
                      value={submissionLink}
                    />
                  </label>
                  {submissionError && <p className="rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{submissionError}</p>}
                  {submissionMessage && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{submissionMessage}</p>}
                  <Button isLoading={isSubmitting} size="sm" type="submit">{selectedAssignment.status === 'submitted' ? 'Update submission' : 'Submit assignment'}</Button>
                </form>
              )}
              {selectedAssignment.submission && selectedAssignment.status === 'graded' && (
                <div className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-5">
                  <h3 className="font-semibold text-[#1E293B]">Your submission</h3>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[#64748B]">{selectedAssignment.submission.content}</p>
                  {selectedAssignment.submission.link && (
                    <p className="text-sm">
                      <a className="font-medium text-[#2563EB] hover:text-blue-700" href={selectedAssignment.submission.link} rel="noreferrer" target="_blank">{selectedAssignment.submission.link}</a>
                    </p>
                  )}
                  <p className="text-xs text-[#64748B]">Submitted {selectedAssignment.submission.submittedAt ? new Date(selectedAssignment.submission.submittedAt).toLocaleString() : ''}</p>
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default MyAssignments
