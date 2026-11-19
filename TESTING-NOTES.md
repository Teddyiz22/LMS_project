# Edu Flow v1 — Testing notes

This file records what was verified in the build environment (which has
**no MySQL**) and what still needs to be run on a machine with MySQL.

## Verified here (no database needed)

- `npm run build` (frontend) passes.
- `node --check` passes on every new/changed server file.
- API starts without a database and answers honestly:
  - `GET /` → 200, `{ service: "eduflow-api" }`.
  - `GET /api/health` → **503** `{ status: "degraded", database: "disconnected" }`
    (never `ok` with no database).
  - `GET /api/auth/me` without a token → 401; with a fake token → 401;
    with no `JWT_SECRET` set → 503.
  - `POST /api/auth/register {}` → 400 with validation details.
  - `POST /api/auth/register` with `role: "admin"` → 400.
  - `GET /api/courses` with no database → 503 "Database is unavailable."
  - Unknown route → 404.
- Frontend preview serves the main routes with HTTP 200:
  `/`, `/login`, `/register`, `/student/dashboard` (redirects to `/login`
  when signed out — the guard works), `/teacher/dashboard`, `/admin`.

## Still needs your machine (MySQL 8)

Run these in the repo root (`LMS_project`), in order:

```bash
# 1. Install dependencies (frontend + API)
npm install
npm --prefix server install

# 2. Create the database and load schema + demo seed
mysql -u root -p -e "CREATE DATABASE eduflow CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
mysql -u root -p eduflow < server/database/schema.sql
mysql -u root -p eduflow < server/database/seeds/001_demo_data.sql

# 3. Configure the API (copy the example, then edit it)
cp server/.env.example server/.env
# In server/.env set:
#   DB_USER / DB_PASSWORD  — your MySQL user
#   JWT_SECRET             — a long random secret (at least 32 characters)
#   PORT=4001 and CLIENT_ORIGIN=http://localhost:5174 are already the defaults.

# 4. Create the first admin account
cd server
npm run create-admin -- --email you@example.com --password 'a-long-password'
cd ..

# 5. Start everything (one terminal)
npm run dev:all
```

Then open http://localhost:5174 and check:

1. **Health:** `curl http://localhost:4001/api/health` → 200
   `{ "status": "ok", "database": "connected" }`.
2. **Landing page:** the "Popular Courses" section shows the 4 seed courses
   from the API (Web Development Bootcamp, Python for Beginners, and two
   more). Stop the API and refresh — the same section falls back to the
   built-in list with a note that the API is unreachable.
3. **Student login:** `alex.morgan@example.com` / `student123` → lands on
   `/student/dashboard` with real stats, courses, assignments and schedule.
   Open My Assignments, open one, submit text + a link, and see it change
   to "submitted". Open My Profile, edit the bio, save, and see "Profile
   saved."
4. **Teacher login:** `maya.chen@eduflow.test` / `teacher123` → lands on
   `/teacher/dashboard`. In My Courses create a course, add two lessons,
   and see the course appear. In Assignments create an assignment. In
   Grading, open a pending submission, set a grade + feedback, save, and
   see it move to "graded". (The seed has 2 submissions; one is already
   graded, one is waiting.)
5. **Register:** create a new student account at `/register/student` — it
   signs in straight away. Creating an account with role `admin` is not
   possible from the site; admins are created only with `create-admin`.
6. **Admin:** sign in with the admin account created in step 4 → lands on
   `/admin` with user/course counts and both tables. A student or teacher
   who opens `/admin` is sent back to their own workspace.
7. **Wrong-role guard:** while signed in as a student, open
   `/teacher/dashboard` — you are sent back to `/student/dashboard`.
8. **Enroll (API only in v1):** there is no course detail page in the UI
   yet, so enrolling happens through the API:
   `curl -X POST http://localhost:4001/api/courses/2/enroll -H "Authorization: Bearer <student token>"`
   → 201, and the course then appears in the student's My Courses. The
   "View Course" buttons on course cards are placeholders until a detail
   page is built.

## Known v1 limits (by design)

- No payments, no video hosting, no file uploads — submissions are text +
  an optional link.
- No password-reset email: forgot-password always answers the same generic
  message and sends nothing.
- Courses show "New" instead of a star rating (there is no ratings table).
- Teachers cannot schedule classes from the UI yet (the API endpoints
  exist; classes show on student schedules).
- No automated tests yet.
- No course detail page yet: the "View Course" buttons on course cards do
  not open anything, and enrolling is API-only in v1 (see step 8 above).
- The old `/dashboard-preview` demo route was removed. The
  `DashboardPreview`, `DashboardLayout`, `Sidebar`, `MobileSidebar` and
  `navigationItems` files are still on disk but no longer routed to;
  `src/assets/hero.png`, `react.svg`, `vite.svg` were only used by the
  deleted `src/App.tsx`.
