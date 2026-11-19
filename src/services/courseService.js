import api from './api.js'

// Fallback cover for courses created without an image (the seed courses all
// have Unsplash covers; this is the same style so the catalogue stays visual).
export const COURSE_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'

// Map an API course row to the shape the UI cards expect:
// price as the display string ("Free" / "$49"), rating "New" when there is
// no rating yet, and a fallback cover image.
export function normalizeCourse(course) {
  if (!course || typeof course !== 'object') return course
  const price = Number(course.price || 0)
  return {
    ...course,
    price: course.priceLabel || (price === 0 ? 'Free' : `$${price % 1 === 0 ? price : price.toFixed(2)}`),
    rating: course.rating ?? 'New',
    image: course.image || COURSE_IMAGE_FALLBACK,
  }
}

export async function listCourses({ search = '', category = '', teacherId = null, page = 1, limit = 12 } = {}) {
  const data = await api.get('/courses', { params: { search, category, teacherId, page, limit } })
  return {
    ...data,
    items: (data.items || []).map(normalizeCourse),
  }
}

export async function getCourse(courseId) {
  const data = await api.get(`/courses/${courseId}`)
  return {
    ...data,
    course: data.course ? normalizeCourse(data.course) : data.course,
  }
}

export function createCourse(payload) {
  return api.post('/courses', payload)
}

export function updateCourse(courseId, payload) {
  return api.put(`/courses/${courseId}`, payload)
}

export function deleteCourse(courseId) {
  return api.delete(`/courses/${courseId}`)
}

export function enrollCourse(courseId) {
  return api.post(`/courses/${courseId}/enroll`)
}

export function completeLesson(courseId, lessonId) {
  return api.post(`/courses/${courseId}/lessons/${lessonId}/complete`)
}

export function addLesson(courseId, payload) {
  return api.post(`/courses/${courseId}/lessons`, {
    title: payload.title,
    content: payload.content || '',
    durationMinutes: payload.durationMinutes ?? payload.duration_minutes ?? 0,
    isFree: payload.isFree ?? false,
  })
}

export function updateLesson(courseId, lessonId, payload) {
  return api.put(`/courses/${courseId}/lessons/${lessonId}`, payload)
}

export function deleteLesson(courseId, lessonId) {
  return api.delete(`/courses/${courseId}/lessons/${lessonId}`)
}
