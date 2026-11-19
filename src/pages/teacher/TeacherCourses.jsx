import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { addLesson, createCourse, deleteCourse, deleteLesson, getCourse, updateCourse } from '../../services/courseService.js'
import { getMyCourses } from '../../services/teacherService.js'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

const emptyCourseForm = {
  title: '',
  description: '',
  category: 'Web Development',
  level: 'Beginner',
  price: 0,
  image: '',
  isPublished: true,
}

const categories = ['Web Development', 'Design', 'Data Science', 'Business', 'Marketing', 'Programming', 'Language', 'Other']
const levels = ['Beginner', 'Intermediate', 'Advanced']

function TeacherCourses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyCourseForm)
  const [editingId, setEditingId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lessons, setLessons] = useState([])
  const [newLesson, setNewLesson] = useState({ title: '', durationMinutes: '' })
  const [lessonError, setLessonError] = useState('')

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

  const openCreateForm = () => {
    setForm(emptyCourseForm)
    setEditingId(null)
    setLessons([])
    setFormError('')
    setIsFormOpen(true)
  }

  const openEditForm = async (course) => {
    setForm({
      title: course.title || '',
      description: course.description || '',
      category: course.category || 'Web Development',
      level: course.level || 'Beginner',
      price: Number(course.price || 0),
      image: course.image || '',
      isPublished: course.isPublished !== false,
    })
    setEditingId(course.id)
    setLessons([])
    setFormError('')
    setIsFormOpen(true)
    try {
      const detail = await getCourse(course.id)
      setLessons(detail.course?.lessons || [])
    } catch {
      setLessons([])
    }
  }

  const handleSaveCourse = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!form.title.trim() || !form.description.trim()) {
      setFormError('Title and description are required.')
      return
    }
    setIsSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        level: form.level,
        price: Number(form.price) || 0,
        image: form.image.trim() || undefined,
        isPublished: form.isPublished,
      }
      if (editingId) {
        await updateCourse(editingId, payload)
      } else {
        await createCourse(payload)
      }
      setIsFormOpen(false)
      setEditingId(null)
      await loadCourses()
    } catch (saveError) {
      setFormError(saveError.message || 'The course could not be saved.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? Students enrolled in it will lose access.`)) return
    try {
      await deleteCourse(course.id)
      await loadCourses()
    } catch (deleteError) {
      setError(deleteError.message || 'The course could not be deleted.')
    }
  }

  const handleAddLesson = async (event) => {
    event.preventDefault()
    setLessonError('')
    if (!editingId || !newLesson.title.trim()) {
      setLessonError('Enter a lesson title.')
      return
    }
    try {
      const created = await addLesson(editingId, {
        title: newLesson.title.trim(),
        durationMinutes: Number(newLesson.durationMinutes) || 0,
      })
      setLessons((current) => [...current, created.lesson || created])
      setNewLesson({ title: '', durationMinutes: '' })
    } catch (addError) {
      setLessonError(addError.message || 'The lesson could not be added.')
    }
  }

  const handleDeleteLesson = async (lesson) => {
    if (!editingId) return
    try {
      await deleteLesson(editingId, lesson.id)
      setLessons((current) => current.filter((item) => item.id !== lesson.id))
    } catch (deleteError) {
      setLessonError(deleteError.message || 'The lesson could not be deleted.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Button onClick={openCreateForm} size="sm"><Plus className="size-4" aria-hidden="true" />New course</Button>}
        breadcrumbs={[{ label: 'Teacher workspace' }, { label: 'My Courses' }]}
        description="Create courses, edit their details, and manage their lessons."
        title="My Courses"
      />
      {isLoading ? (
        <LoadingState label="Loading your courses…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCourses} />
      ) : (
        <>
          {isFormOpen && (
            <Card
              actions={<button aria-label="Close course form" className="text-sm font-medium text-[#2563EB]" onClick={() => setIsFormOpen(false)} type="button"><X className="size-4" aria-hidden="true" /></button>}
              description={editingId ? 'Update the course details below.' : 'Fill in the details for a new course.'}
              title={editingId ? 'Edit course' : 'New course'}
            >
              <form className="space-y-4" onSubmit={handleSaveCourse}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Title</span>
                    <input className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} type="text" value={form.title} />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Category</span>
                    <select className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB]" onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} value={form.category}>
                      {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Level</span>
                    <select className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB]" onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))} value={form.level}>
                      {levels.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Price (USD, 0 = free)</span>
                    <input className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" min="0" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} type="number" value={form.price} />
                  </label>
                </div>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Description</span>
                  <textarea className="min-h-24 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-[#1E293B]">Cover image URL (optional)</span>
                  <input className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="https://…" type="url" value={form.image} />
                </label>
                <label className="flex items-center gap-2 text-sm text-[#1E293B]">
                  <input checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} type="checkbox" />
                  Published (visible to students)
                </label>
                <p className="text-xs text-[#64748B]">The course duration is calculated automatically from its lessons.</p>
                {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{formError}</p>}
                <Button isLoading={isSaving} size="sm" type="submit">{editingId ? 'Save changes' : 'Create course'}</Button>
              </form>
              {editingId && (
                <div className="mt-8 border-t border-[#E2E8F0] pt-6">
                  <h3 className="font-semibold text-[#1E293B]">Lessons</h3>
                  {lessons.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {lessons.map((lesson, index) => (
                        <li className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm" key={lesson.id}>
                          <span className="min-w-0 truncate text-[#1E293B]">{index + 1}. {lesson.title}{lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ''}</span>
                          <button aria-label={`Delete lesson ${lesson.title}`} className="shrink-0 text-[#EF4444] hover:text-red-600" onClick={() => handleDeleteLesson(lesson)} type="button"><Trash2 className="size-4" aria-hidden="true" /></button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[#64748B]">No lessons yet.</p>
                  )}
                  <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleAddLesson}>
                    <input className="h-10 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" onChange={(event) => setNewLesson((current) => ({ ...current, title: event.target.value }))} placeholder="Lesson title" type="text" value={newLesson.title} />
                    <input className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] outline-none focus:border-[#2563EB] sm:w-32" min="0" onChange={(event) => setNewLesson((current) => ({ ...current, durationMinutes: event.target.value }))} placeholder="Minutes" type="number" value={newLesson.durationMinutes} />
                    <Button size="sm" type="submit">Add lesson</Button>
                  </form>
                  {lessonError && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-[#EF4444]">{lessonError}</p>}
                </div>
              )}
            </Card>
          )}
          <Card description={`${courses.length} course${courses.length === 1 ? '' : 's'}`} title="Course list">
            {courses.length === 0 ? (
              <p className="text-sm text-[#64748B]">No courses yet. Create your first course to start teaching.</p>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {courses.map((course) => (
                  <article className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between" key={course.id}>
                    <div className="flex min-w-0 gap-4">
                      {course.image && <img alt="" className="hidden size-16 shrink-0 rounded-lg object-cover sm:block" src={course.image} />}
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-[#1E293B]">{course.title}</h2>
                        <p className="mt-1 line-clamp-2 text-sm text-[#64748B]">{course.description}</p>
                        <p className="mt-2 text-xs text-[#64748B]">{course.category} · {course.level} · {course.students} student{course.students === 1 ? '' : 's'} · {course.lessonCount} lessons · {course.priceLabel}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                      <Badge variant={!course.isActive ? 'danger' : course.isPublished ? 'success' : 'default'}>{!course.isActive ? 'Inactive' : course.isPublished ? 'Published' : 'Draft'}</Badge>
                      <Button onClick={() => openEditForm(course)} size="sm" variant="outline"><Pencil className="size-4" aria-hidden="true" />Edit</Button>
                      <Button onClick={() => handleDeleteCourse(course)} size="sm" variant="outline"><Trash2 className="size-4 text-[#EF4444]" aria-hidden="true" />Delete</Button>
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

export default TeacherCourses
