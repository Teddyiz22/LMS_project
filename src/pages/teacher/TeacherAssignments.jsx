import { FileText, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { createAssignment, deleteAssignment, getMyAssignments, getMyCourses } from '../../services/teacherService.js'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

const emptyAssignmentForm = {
  courseId: '',
  title: '',
  description: '',
  dueDate: '',
  maxPoints: 100,
}

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyAssignmentForm)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [assignmentData, courseData] = await Promise.all([getMyAssignments(), getMyCourses()])
      setAssignments(assignmentData.assignments)
      setCourses(courseData.courses)
      setForm((current) => ({ ...current, courseId: current.courseId || courseData.courses[0]?.id || '' }))
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleCreate = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!form.courseId || !form.title.trim() || !form.description.trim()) {
      setFormError('Choose a course and fill in the title and description.')
      return
    }
    setIsSaving(true)
    try {
      await createAssignment({
        courseId: form.courseId,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || undefined,
        maxPoints: Number(form.maxPoints) || 100,
      })
      setForm({ ...emptyAssignmentForm, courseId: form.courseId })
      setIsFormOpen(false)
      const { assignments: loaded } = await getMyAssignments()
      setAssignments(loaded)
    } catch (saveError) {
      setFormError(saveError.message || 'The assignment could not be created.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"? Submitted work will be removed as well.`)) return
    try {
      await deleteAssignment(assignment.id)
      setAssignments((current) => current.filter((item) => item.id !== assignment.id))
    } catch (deleteError) {
      setError(deleteError.message || 'The assignment could not be deleted.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Button disabled={courses.length === 0} onClick={() => setIsFormOpen(true)} size="sm"><Plus className="size-4" aria-hidden="true" />New assignment</Button>}
        breadcrumbs={[{ label: 'Teacher workspace' }, { label: 'Assignments' }]}
        description="Create assignments for your courses and track submissions."
        title="Assignments"
      />
      {isLoading ? (
        <LoadingState label="Loading your assignments…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          {isFormOpen && (
            <Card
              actions={<button aria-label="Close assignment form" className="text-sm font-medium text-[#2563EB]" onClick={() => setIsFormOpen(false)} type="button"><X className="size-4" aria-hidden="true" /></button>}
              description="Students will see this assignment in their workspace."
              title="New assignment"
            >
              <form className="space-y-4" onSubmit={handleCreate}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Course</span>
                    <select className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB]" onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))} value={form.courseId}>
                      {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Due date</span>
                    <input className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB]" onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} type="date" value={form.dueDate} />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Title</span>
                    <input className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} type="text" value={form.title} />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Max points</span>
                    <input className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" min="1" onChange={(event) => setForm((current) => ({ ...current, maxPoints: event.target.value }))} type="number" value={form.maxPoints} />
                  </label>
                </div>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Description</span>
                  <textarea className="min-h-24 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
                </label>
                {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{formError}</p>}
                <Button isLoading={isSaving} size="sm" type="submit">Create assignment</Button>
              </form>
            </Card>
          )}
          <Card description={`${assignments.length} assignment${assignments.length === 1 ? '' : 's'}`} title="Assignment list">
            {assignments.length === 0 ? (
              <p className="text-sm text-[#64748B]">
                {courses.length === 0 ? 'Create a course first, then add assignments to it.' : 'No assignments yet. Create one to give your students work.'}
              </p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {assignments.map((assignment) => (
                  <article className="flex flex-col gap-4 py-5 first:pt-0 md:flex-row md:items-center md:justify-between" key={assignment.id}>
                    <div className="flex gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                        <FileText className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="font-semibold text-[#1E293B]">{assignment.title}</h2>
                        <p className="mt-1 text-sm text-[#64748B]">{assignment.course}</p>
                        <p className="mt-1 text-xs text-[#64748B]">
                          Due {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'no due date'} · {assignment.maxPoints} points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <Badge variant="info">{assignment.submissionCount} submitted</Badge>
                      <Button onClick={() => handleDelete(assignment)} size="sm" variant="outline"><Trash2 className="size-4 text-[#EF4444]" aria-hidden="true" />Delete</Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

export default TeacherAssignments
