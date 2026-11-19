# EduFlow API

Express 4 + MySQL 8 API for Edu Flow. Listens on **port 4001** by default
(`PORT` in `server/.env`). The frontend (Vite, port 5174) proxies `/api` to
this server in development.

## Setup

```bash
npm install
cp .env.example .env        # then set DB_* and a long random JWT_SECRET
```

Create the database and load the schema + demo seed from the repo root:

```bash
mysql -u root -p -e "CREATE DATABASE eduflow CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
mysql -u root -p eduflow < database/schema.sql
mysql -u root -p eduflow < database/seeds/001_demo_data.sql
```

Create the first admin account (idempotent — an existing email is never
overwritten, and the password is never printed):

```bash
npm run create-admin -- --email you@example.com --password 'a-long-password'
```

Start the API:

```bash
npm run dev     # watch mode (node --watch)
npm start       # production
```

## Health

`GET /api/health` reports the database state honestly:

- `{ "status": "ok", "database": "connected" }` when MySQL answers.
- HTTP **503** `{ "status": "degraded", "database": "disconnected" }` when
  it does not — never `ok` with a dead database.

## Auth

JWT, 1 hour (`JWT_EXPIRES_IN`). The token goes in
`Authorization: Bearer <token>`. If `JWT_SECRET` is unset or still the
`.env.example` placeholder, every protected endpoint answers **503**.

| Method & path | Who | Notes |
| --- | --- | --- |
| `POST /api/auth/register` | public | Roles `student` / `teacher` only (`admin` → 400). Duplicate email → 409. |
| `POST /api/auth/login` | public | Generic 401 for any mismatch. |
| `GET /api/auth/me` | any role | Requires a token. |
| `POST /api/auth/change-password` | any role | Needs the current password. |
| `POST /api/auth/forgot-password` | public | Always the same generic message; no email is sent in v1. |

## Courses (public catalogue)

| Method & path | Who | Notes |
| --- | --- | --- |
| `GET /api/courses` | public | `search`, `category`, `teacherId`, `page`, `limit` (max 48). |
| `GET /api/courses/:id` | public | Includes lessons; `isEnrolled` when signed in. |
| `POST /api/courses` | teacher/admin | Creates a course (owner = the caller). |
| `PUT /api/courses/:id` | teacher/admin | Owner only, unless admin. |
| `DELETE /api/courses/:id` | teacher/admin | Deactivates (sets `is_active = 0`); never hard-deletes. |
| `POST /api/courses/:id/lessons` | teacher/admin | Add a lesson (position is assigned automatically). |
| `PUT /api/courses/:id/lessons/:lessonId` | teacher/admin | |
| `DELETE /api/courses/:id/lessons/:lessonId` | teacher/admin | |
| `POST /api/courses/:id/enroll` | student | 201 new enrolment, 200 if already enrolled. |
| `POST /api/courses/:id/lessons/:lessonId/complete` | student | Marks a lesson complete (must be enrolled). |

## Student

All routes require role `student`.

| Method & path | Notes |
| --- | --- |
| `GET /api/student/dashboard` | Stats, courses, assignments, schedule, activity, achievements, current course. |
| `GET /api/student/courses` | Enrolled courses with progress and next lesson. |
| `GET /api/student/assignments` | Assignments for enrolled courses, with submission + grade. |
| `GET /api/student/schedule` | Upcoming classes for enrolled courses. |
| `GET /api/student/progress` | Stats, weekly activity, achievements, per-course completion. |
| `GET /api/student/profile` | `{ user, program, joined, enrolledCourses }`. |
| `PUT /api/student/profile` | `fullName`, `bio`, `program`. |
| `POST /api/student/assignments/:id/submit` | Text `content` + optional `link`. Re-submit is allowed while ungraded (clears the old grade); graded work returns 409. |

## Teacher

All routes allow roles `teacher` and `admin` (teachers only see their own
courses/assignments/submissions; admins see everything).

| Method & path | Notes |
| --- | --- |
| `GET /api/teacher/dashboard` | Stats, own courses, assignments, pending submissions, upcoming classes. |
| `GET /api/teacher/courses` | Own courses (including drafts/inactive). |
| `GET /api/teacher/assignments` | Own assignments with submission counts. |
| `POST /api/teacher/assignments` | `courseId`, `title`, `description`, `dueDate`, `maxPoints`. |
| `PUT /api/teacher/assignments/:id` | |
| `DELETE /api/teacher/assignments/:id` | |
| `GET /api/teacher/submissions` | Filters: `courseId`, `assignmentId`, `status` (`submitted` / `graded`). |
| `POST /api/teacher/submissions/:id/grade` | `grade` (0–1000, check against the assignment's `maxPoints`), `feedback`. |
| `GET /api/teacher/classes` | Own scheduled classes. |
| `POST /api/teacher/classes` | `courseId`, `title`, `startsAt`, `endsAt`, `meetingLink`. |
| `GET /api/teacher/students/:studentId/progress` | That student's progress in the teacher's courses. |

## Admin

All routes require role `admin`.

| Method & path | Notes |
| --- | --- |
| `GET /api/admin/overview` | User/course counts, enrollments, submissions, pending grading. |
| `GET /api/admin/users` | `role`, `search`, `page`, `limit`. |
| `GET /api/admin/courses` | `search`, `category`, `page`, `limit` (includes inactive). |

## Responses

Success: `{ "success": true, "data": ... }`.
Errors: `{ "success": false, "error": "message", "details": [...] }` with the
matching HTTP status (400 validation, 401 unauthenticated, 403 wrong role,
404 not found, 409 conflict, 503 database or JWT not configured).
