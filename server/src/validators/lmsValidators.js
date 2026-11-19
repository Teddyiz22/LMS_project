// Course, lesson, assignment and submission validators. Each validator
// receives the request, returns an array of readable validation errors, and
// stores the cleaned payload on the request (validatedBody).

function asTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function asNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function asOptionalDate(value) {
  if (value === null || value === undefined || value === '') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isValidId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0
}

export function validatePagination(request) {
  const page = Math.max(1, asNumber(request.query?.page, 1) || 1)
  const limit = Math.min(48, Math.max(1, asNumber(request.query?.limit, 12) || 12))
  return { page, limit }
}

export function validateCourse(request) {
  const errors = []
  const body = request.body || {}

  const title = asTrimmedString(body.title)
  const description = asTrimmedString(body.description)
  const category = asTrimmedString(body.category)
  const level = asTrimmedString(body.level || 'Beginner')
  const price = asNumber(body.price ?? body.price_usd, 0)
  const imageUrl = asTrimmedString(body.image || body.image_url)
  const isPublished = body.is_published !== undefined
    ? Boolean(body.is_published)
    : (body.isPublished !== undefined ? Boolean(body.isPublished) : true)

  if (!title || title.length > 180) {
    errors.push('title is required and must be at most 180 characters.')
  }
  if (!category || category.length > 80) {
    errors.push('category is required and must be at most 80 characters.')
  }
  if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
    errors.push('level must be Beginner, Intermediate or Advanced.')
  }
  if (price < 0 || price > 100000) {
    errors.push('price must be between 0 and 100000.')
  }
  if (description.length > 10000) {
    errors.push('description must be at most 10000 characters.')
  }
  if (imageUrl.length > 500) {
    errors.push('image must be at most 500 characters.')
  }

  request.validatedBody = {
    title,
    description,
    category,
    level,
    price_usd: price,
    image_url: imageUrl || null,
    is_published: isPublished,
  }
  return errors
}

export function validateLesson(request) {
  const errors = []
  const body = request.body || {}

  const title = asTrimmedString(body.title)
  const content = asTrimmedString(body.content)
  const videoUrl = asTrimmedString(body.videoUrl || body.video_url)
  const durationMinutes = asNumber(body.durationMinutes ?? body.duration_minutes, 0)
  const isFree = Boolean(body.isFree ?? body.is_free ?? false)
  const position = asNumber(body.position, 0)

  if (!title || title.length > 200) {
    errors.push('title is required and must be at most 200 characters.')
  }
  if (content.length > 20000) {
    errors.push('content must be at most 20000 characters.')
  }
  if (videoUrl.length > 500) {
    errors.push('videoUrl must be at most 500 characters.')
  }
  if (durationMinutes < 0 || durationMinutes > 10080) {
    errors.push('durationMinutes must be between 0 and 10080.')
  }

  request.validatedBody = {
    title,
    content,
    video_url: videoUrl || null,
    duration_minutes: durationMinutes,
    is_free: isFree,
    position,
  }
  return errors
}

export function validateAssignment(request) {
  const errors = []
  const body = request.body || {}

  const courseId = Number(body.courseId ?? body.course_id)
  const title = asTrimmedString(body.title)
  const description = asTrimmedString(body.description)
  const dueDate = asOptionalDate(body.dueDate ?? body.due_date)
  const maxPoints = asNumber(body.maxPoints ?? body.max_points, 100)

  if (!isValidId(courseId)) {
    errors.push('courseId is required and must be a valid course id.')
  }
  if (!title || title.length > 200) {
    errors.push('title is required and must be at most 200 characters.')
  }
  if (description.length > 10000) {
    errors.push('description must be at most 10000 characters.')
  }
  if ((body.dueDate ?? body.due_date) && !dueDate) {
    errors.push('dueDate must be a valid date.')
  }
  if (!Number.isInteger(maxPoints) || maxPoints < 1 || maxPoints > 1000) {
    errors.push('maxPoints must be a whole number between 1 and 1000.')
  }

  request.validatedBody = {
    course_id: courseId,
    title,
    description,
    due_date: dueDate ? dueDate.toISOString().slice(0, 19).replace('T', ' ') : null,
    max_points: maxPoints,
  }
  return errors
}

export function validateAssignmentUpdate(request) {
  const errors = []
  const body = request.body || {}

  const title = asTrimmedString(body.title)
  const description = asTrimmedString(body.description)
  const dueDate = asOptionalDate(body.dueDate ?? body.due_date)
  const maxPoints = asNumber(body.maxPoints ?? body.max_points, 100)

  if (!title || title.length > 200) {
    errors.push('title is required and must be at most 200 characters.')
  }
  if (description.length > 10000) {
    errors.push('description must be at most 10000 characters.')
  }
  if ((body.dueDate ?? body.due_date) && !dueDate) {
    errors.push('dueDate must be a valid date.')
  }
  if (!Number.isInteger(maxPoints) || maxPoints < 1 || maxPoints > 1000) {
    errors.push('maxPoints must be a whole number between 1 and 1000.')
  }

  request.validatedBody = {
    title,
    description,
    due_date: dueDate ? dueDate.toISOString().slice(0, 19).replace('T', ' ') : null,
    max_points: maxPoints,
  }
  return errors
}

export function validateSubmission(request) {
  const errors = []
  const body = request.body || {}

  const content = asTrimmedString(body.content)
  const link = asTrimmedString(body.link)

  if (!content || content.length > 20000) {
    errors.push('content is required and must be at most 20000 characters.')
  }
  if (link && (link.length > 500 || !/^https?:\/\//i.test(link))) {
    errors.push('link must be a valid http(s) URL of at most 500 characters.')
  }

  request.validatedBody = { content, link: link || null }
  return errors
}

export function validateGrade(request) {
  const errors = []
  const body = request.body || {}

  const grade = Number(body.grade)
  const feedback = asTrimmedString(body.feedback)

  if (!Number.isFinite(grade) || grade < 0 || grade > 1000) {
    errors.push('grade is required and must be a number between 0 and 1000.')
  }
  if (feedback.length > 5000) {
    errors.push('feedback must be at most 5000 characters.')
  }

  request.validatedBody = { grade, feedback: feedback || null }
  return errors
}

export function validateClass(request) {
  const errors = []
  const body = request.body || {}

  const courseId = Number(body.courseId ?? body.course_id)
  const title = asTrimmedString(body.title)
  const startsAt = asOptionalDate(body.startsAt ?? body.starts_at)
  const endsAt = asOptionalDate(body.endsAt ?? body.ends_at)
  const meetingLink = asTrimmedString(body.meetingLink || body.meeting_link)

  if (!isValidId(courseId)) {
    errors.push('courseId is required and must be a valid course id.')
  }
  if (!title || title.length > 200) {
    errors.push('title is required and must be at most 200 characters.')
  }
  if (!startsAt) {
    errors.push('startsAt is required and must be a valid date.')
  }
  if (!endsAt) {
    errors.push('endsAt is required and must be a valid date.')
  }
  if (startsAt && endsAt && endsAt <= startsAt) {
    errors.push('endsAt must be after startsAt.')
  }
  if (meetingLink && (meetingLink.length > 500 || !/^https?:\/\//i.test(meetingLink))) {
    errors.push('meetingLink must be a valid http(s) URL of at most 500 characters.')
  }

  const toMysql = (date) => (date ? date.toISOString().slice(0, 19).replace('T', ' ') : null)
  request.validatedBody = {
    course_id: courseId,
    title,
    starts_at: toMysql(startsAt),
    ends_at: toMysql(endsAt),
    meeting_link: meetingLink || null,
  }
  return errors
}

export function validateProfile(request) {
  const errors = []
  const body = request.body || {}

  const fullName = asTrimmedString(body.fullName || body.full_name)
  const bio = asTrimmedString(body.bio)
  const program = asTrimmedString(body.program)

  if (!fullName || fullName.length > 120) {
    errors.push('fullName is required and must be at most 120 characters.')
  }
  if (bio.length > 2000) {
    errors.push('bio must be at most 2000 characters.')
  }
  if (program.length > 120) {
    errors.push('program must be at most 120 characters.')
  }

  request.validatedBody = {
    full_name: fullName,
    bio: bio || null,
    program: program || null,
  }
  return errors
}
