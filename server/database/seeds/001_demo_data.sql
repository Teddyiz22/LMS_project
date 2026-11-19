-- EduFlow demo seed data (v1). Safe to re-run: inserts use explicit ids
-- with ON DUPLICATE KEY UPDATE / INSERT IGNORE, so a second run changes
-- nothing. Expects a fresh `eduflow` database created by schema.sql.
--
-- Demo accounts (passwords are demo-only — change them before any real use):
--   Student:  alex.morgan@example.com      / student123
--   Teachers: maya.chen@eduflow.test       / teacher123
--             daniel.foster@eduflow.test   / teacher123
--             sofia.martinez@eduflow.test  / teacher123
--             priya.shah@eduflow.test      / teacher123
-- Admin accounts are NOT seeded; create one with `npm run create-admin`.
--
-- Dates are relative to CURDATE() so the demo stays fresh whenever it runs:
-- pending assignments fall due in 3–5 days, classes in 2–6 days.

USE eduflow;

-- Teachers (bcrypt cost 12, password: teacher123).
INSERT INTO users (id, full_name, email, password_hash, role, title, bio, is_active)
VALUES
  (1, 'Maya Chen', 'maya.chen@eduflow.test', '$2b$12$/x9yNQ.DNpjd2oyJ3YO2.e5qrVw/.SjCN2sRERJR2TPFS2OpfZ7i2', 'teacher', 'Senior Web Developer', 'Web developer and instructor focused on modern, accessible frontends.', 1),
  (2, 'Daniel Foster', 'daniel.foster@eduflow.test', '$2b$12$/x9yNQ.DNpjd2oyJ3YO2.e5qrVw/.SjCN2sRERJR2TPFS2OpfZ7i2', 'teacher', 'Python Instructor', 'Software engineer teaching Python from first principles.', 1),
  (3, 'Sofia Martinez', 'sofia.martinez@eduflow.test', '$2b$12$/x9yNQ.DNpjd2oyJ3YO2.e5qrVw/.SjCN2sRERJR2TPFS2OpfZ7i2', 'teacher', 'Senior Product Designer', 'Product designer teaching UI/UX with Figma.', 1),
  (4, 'Priya Shah', 'priya.shah@eduflow.test', '$2b$12$/x9yNQ.DNpjd2oyJ3YO2.e5qrVw/.SjCN2sRERJR2TPFS2OpfZ7i2', 'teacher', 'Data Science Instructor', 'Data scientist teaching analysis and storytelling with data.', 1)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name), role = VALUES(role),
  title = VALUES(title), bio = VALUES(bio), is_active = VALUES(is_active);

-- Demo student (bcrypt cost 12, password: student123).
INSERT INTO users (id, full_name, email, password_hash, role, program, bio, is_active)
VALUES
  (5, 'Alex Morgan', 'alex.morgan@example.com', '$2b$12$YoZ/yAuVMlFlhvEKqQv2neQtyEhKRhW4xEPtKIi3425IL6423hMFm', 'student', 'Frontend Development Path', 'An aspiring frontend developer focused on building accessible, thoughtful web experiences.', 1)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name), role = VALUES(role),
  program = VALUES(program), bio = VALUES(bio), is_active = VALUES(is_active);

-- Courses (the four courses from the frontend demo).
INSERT INTO courses (id, teacher_id, title, slug, description, category, level, price_usd, image_url, is_published, is_active)
VALUES
  (1, 1, 'Complete Web Development Bootcamp', 'complete-web-development-bootcamp', 'Build modern, responsive websites from first principles: HTML, CSS, JavaScript and the tooling around them.', 'Web Development', 'Intermediate', 49.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 1, 1),
  (2, 2, 'Python Programming for Beginners', 'python-programming-for-beginners', 'Learn Python step by step: variables, control flow, functions and working with real data.', 'Programming', 'Beginner', 0.00, 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80', 1, 1),
  (3, 3, 'UI/UX Design with Figma', 'ui-ux-design-with-figma', 'Design products people enjoy: design thinking, components, prototyping and design systems in Figma.', 'UI/UX Design', 'Intermediate', 39.00, 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80', 1, 1),
  (4, 4, 'Data Analysis with Python', 'data-analysis-with-python', 'Turn raw data into decisions: pandas, cleaning, visualisation and telling a clear data story.', 'Data Science', 'Intermediate', 42.00, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 1, 1)
ON DUPLICATE KEY UPDATE
  teacher_id = VALUES(teacher_id), title = VALUES(title), description = VALUES(description),
  category = VALUES(category), level = VALUES(level), price_usd = VALUES(price_usd),
  image_url = VALUES(image_url), is_published = VALUES(is_published), is_active = VALUES(is_active);

-- Lessons: 6 per course.
INSERT INTO lessons (id, course_id, title, content, position, duration_minutes, is_free)
VALUES
  (101, 1, 'How the web works', 'Browsers, servers, HTTP and how a page gets from a server to a screen.', 1, 30, 1),
  (102, 1, 'HTML essentials', 'Semantic HTML: structure a page so it reads well for people and machines.', 2, 35, 0),
  (103, 1, 'CSS fundamentals', 'Selectors, the box model and cascade — the core of styling a page.', 3, 40, 0),
  (104, 1, 'Flexbox and Grid', 'Lay out pages with Flexbox and Grid instead of fragile hacks.', 4, 45, 0),
  (105, 1, 'JavaScript basics', 'Variables, functions and events: making a page respond to the user.', 5, 40, 0),
  (106, 1, 'Building responsive navigation', 'A navigation bar that works on a phone and a desktop, from one codebase.', 6, 35, 0),
  (201, 2, 'Setting up Python', 'Install Python, pick an editor and run your first program.', 1, 25, 1),
  (202, 2, 'Variables and data types', 'Numbers, strings, booleans and how Python stores values.', 2, 30, 0),
  (203, 2, 'Control flow', 'if/else, loops and making decisions in code.', 3, 35, 0),
  (204, 2, 'Functions and return values', 'Write reusable functions that solve one job well.', 4, 40, 0),
  (205, 2, 'Lists and dictionaries', 'Collections: keep many values together and look them up by key.', 5, 35, 0),
  (206, 2, 'Working with files', 'Read and write files, and handle errors when things go wrong.', 6, 30, 0),
  (301, 3, 'Design thinking basics', 'Empathise, define, ideate: start from the user, not the pixels.', 1, 30, 1),
  (302, 3, 'Figma workspace tour', 'Frames, layers and the tools you will use every day.', 2, 35, 0),
  (303, 3, 'Components and variants', 'Build once, reuse everywhere: the heart of a design system.', 3, 40, 0),
  (304, 3, 'Designing a component library', 'Buttons, inputs and cards as one consistent library.', 4, 45, 0),
  (305, 3, 'Prototyping flows', 'Connect screens into a flow a user can click through.', 5, 40, 0),
  (306, 3, 'Design system audit', 'Review an interface and document its colour, type, spacing and patterns.', 6, 35, 0),
  (401, 4, 'Python for data review', 'A quick Python refresher, focused on the parts data work uses.', 1, 30, 1),
  (402, 4, 'Working with pandas', 'DataFrames: filter, group and reshape tabular data.', 2, 40, 0),
  (403, 4, 'Cleaning messy data', 'Missing values, duplicates and types that lie.', 3, 40, 0),
  (404, 4, 'Visualising with charts', 'Pick the right chart and make it honest.', 4, 35, 0),
  (405, 4, 'Statistics essentials', 'Mean, median, spread — and what they hide.', 5, 35, 0),
  (406, 4, 'Data storytelling report', 'Turn a cleaned dataset into a concise story with a recommendation.', 6, 40, 0)
ON DUPLICATE KEY UPDATE
  title = VALUES(title), content = VALUES(content), position = VALUES(position),
  duration_minutes = VALUES(duration_minutes), is_free = VALUES(is_free);

-- Enrollments: Alex is enrolled in all four courses.
INSERT IGNORE INTO enrollments (user_id, course_id) VALUES
  (5, 1), (5, 2), (5, 3), (5, 4);

-- Lesson progress for Alex (dates spread over the last 6 days so the
-- weekly activity chart has data): web 5/6, python 3/6, ux 2/6, data 6/6.
INSERT IGNORE INTO lesson_progress (user_id, course_id, lesson_id, completed_at) VALUES
  (5, 1, 101, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '19:30:00')),
  (5, 1, 102, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '18:00:00')),
  (5, 1, 103, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:15:00')),
  (5, 1, 104, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '17:45:00')),
  (5, 1, 105, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '19:00:00')),
  (5, 2, 201, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '16:30:00')),
  (5, 2, 202, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '17:00:00')),
  (5, 2, 203, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '18:30:00')),
  (5, 3, 301, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '15:00:00')),
  (5, 3, 302, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '16:00:00')),
  (5, 4, 401, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY), '18:00:00')),
  (5, 4, 402, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '18:00:00')),
  (5, 4, 403, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '18:00:00')),
  (5, 4, 404, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 3 DAY), '18:00:00')),
  (5, 4, 405, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 2 DAY), '18:00:00')),
  (5, 4, 406, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '18:00:00'));

-- Assignments.
INSERT INTO assignments (id, course_id, teacher_id, title, description, due_date, max_points)
VALUES
  (1, 1, 1, 'Build a responsive product page', 'Create a responsive product page using semantic HTML, modern CSS, and reusable components.', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '23:59:00'), 100),
  (2, 2, 2, 'Python functions practice', 'Write and test reusable functions that solve three common data transformation tasks.', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 5 DAY), '23:59:00'), 100),
  (3, 3, 3, 'Design system audit', 'Review an interface and document its color, type, spacing, and component patterns.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 4 DAY), '23:59:00'), 100),
  (4, 4, 4, 'Data storytelling report', 'Turn a cleaned dataset into a concise visual story and supporting recommendation.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 21 DAY), '23:59:00'), 100),
  (5, 3, 3, 'Mobile app wireframe', 'Create a focused, five-screen wireframe for a mobile learning companion.', TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 24 DAY), '23:59:00'), 100)
ON DUPLICATE KEY UPDATE
  title = VALUES(title), description = VALUES(description),
  due_date = VALUES(due_date), max_points = VALUES(max_points);

-- Submissions: one submitted (awaiting grading), one graded.
INSERT IGNORE INTO submissions (id, assignment_id, student_id, content, link, status, grade, feedback, graded_by, submitted_at, graded_at)
VALUES
  (1, 3, 5, 'Audited the EduFlow course page: documented the colour palette (blue #2563EB primary, slate text), type scale, spacing rhythm and the card/button component patterns. Full notes in the linked document.', 'https://example.com/design-audit-notes', 'submitted', NULL, NULL, NULL, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 5 DAY), '14:20:00'), NULL),
  (2, 4, 5, 'Cleaned the sample sales dataset (1,240 rows), built three charts and wrote a two-page recommendation to focus the next campaign on the 25–34 age group.', 'https://example.com/data-story-report', 'graded', 92.00, 'Clear story and honest charts. The recommendation is well supported by the data — nice work.', 4, TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 23 DAY), '11:00:00'), TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 21 DAY), '09:30:00'));

-- Scheduled classes (live sessions in the next few days).
INSERT INTO classes (id, course_id, teacher_id, title, starts_at, ends_at, meeting_link)
VALUES
  (1, 1, 1, 'Live code review: responsive layouts', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '18:00:00'), TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:00:00'), 'https://meet.example.com/web-review'),
  (2, 2, 2, 'Python lab: working with functions', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 4 DAY), '17:30:00'), TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 4 DAY), '18:30:00'), 'https://meet.example.com/python-lab'),
  (3, 3, 3, 'Design critique circle', TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '16:00:00'), TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '17:00:00'), 'https://meet.example.com/design-critique')
ON DUPLICATE KEY UPDATE
  title = VALUES(title), starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at), meeting_link = VALUES(meeting_link);
