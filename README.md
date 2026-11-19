# Edu Flow — Learning Management System

Edu Flow is a learning management system: students browse courses, enroll,
track progress and submit assignments; teachers create courses and
assignments and grade submissions; admins see users and courses at a glance.

## Stack

- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4, React Router 7, axios,
  Recharts. Runs on **http://localhost:5174**.
- **Backend:** Express 4 + MySQL 8 (`mysql2`), bcrypt, JSON Web Tokens,
  dotenv. Runs on **http://localhost:4001**. See `server/README.md` for the
  API reference.

## How to run

```bash
# 1. Install dependencies (frontend + API)
npm install
npm --prefix server install

# 2. Set up the database (MySQL 8)
mysql -u root -p -e "CREATE DATABASE eduflow CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
mysql -u root -p eduflow < server/database/schema.sql
mysql -u root -p eduflow < server/database/seeds/001_demo_data.sql

# 3. Configure the API
cp server/.env.example server/.env
# Edit server/.env: set DB_USER / DB_PASSWORD and a long random JWT_SECRET.

# 4. Create the first admin account (from the server folder)
cd server && npm run create-admin -- --email you@example.com --password 'a-long-password'

# 5. Start everything (one terminal, web + API together)
cd .. && npm run dev:all
```

Open http://localhost:5174. Sign in with a demo account below, or register
a new student/teacher account.

## Demo accounts (seed data — demo only)

| Role | Email | Password |
| --- | --- | --- |
| Student | alex.morgan@example.com | student123 |
| Teacher | maya.chen@eduflow.test | teacher123 |
| Teacher | daniel.foster@eduflow.test | teacher123 |
| Teacher | sofia.martinez@eduflow.test | teacher123 |
| Teacher | priya.shah@eduflow.test | teacher123 |

The admin account is **not** seeded — create it with `npm run create-admin`
(see step 4). The seed also creates 4 courses (6 lessons each), enrollments,
lesson progress, 5 assignments, 2 submissions and 3 scheduled classes, all
relative to today so the demo always looks current.

## Ports

| Part | Port |
| --- | --- |
| Frontend (Vite) | 5174 (`strictPort`, fails loudly if busy) |
| API (Express) | 4001 |

The Vite dev server proxies `/api` to `http://localhost:4001`, so the
frontend calls `/api/...` and never needs a full API URL in development.
To point the frontend at a different API, set `VITE_API_BASE_URL` in a
root `.env` file.

## Project layout

```
src/
  components/   landing sections, auth forms, student/teacher/admin chrome
  config/       api.js — API base URL
  context/      AuthContext — JWT session (localStorage / sessionStorage)
  data/         landingData.js — fallback content for the landing page
                (used only when the API is unreachable)
  layouts/      StudentLayout, TeacherLayout, AdminLayout
  pages/        public landing, auth, student/*, teacher/*, admin/*
  routes/       ProtectedRoute — role-based route guard
  services/     api.js (axios), authService, courseService,
                studentService, teacherService, adminService
server/
  src/          Express app: routes, controllers, models, middleware
  database/     schema.sql, migrations/001_initial.sql,
                seeds/001_demo_data.sql
```

## What v1 does not have yet

- No payments, no video hosting, no file uploads — assignment submissions
  are text + an optional link.
- No password-reset email (the forgot-password endpoint always answers the
  same generic message; no email is sent).
- No ratings yet — courses show "New" until a ratings feature is added.
- No class scheduling UI for teachers yet (classes exist in the API and
  show on student schedules).
- No tests yet.

See `TESTING-NOTES.md` for what was verified in this environment and what
still needs a machine with MySQL.
