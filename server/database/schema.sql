CREATE DATABASE IF NOT EXISTS eduflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE eduflow;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  title VARCHAR(120) NULL,
  bio TEXT NULL,
  program VARCHAR(120) NULL,
  avatar_url VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_active (role, is_active)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  teacher_id BIGINT UNSIGNED NULL,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT NULL,
  category VARCHAR(80) NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  price_usd DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  image_url VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_slug (slug),
  KEY idx_courses_category_active (category, is_active),
  KEY idx_courses_teacher (teacher_id),
  KEY idx_courses_active_created (is_active, created_at),
  CONSTRAINT fk_courses_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_courses_price_nonnegative CHECK (price_usd >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lessons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NULL,
  video_url VARCHAR(500) NULL,
  position INT NOT NULL DEFAULT 0,
  duration_minutes INT NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lessons_course_position (course_id, position),
  CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT chk_lessons_duration_nonnegative CHECK (duration_minutes >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enrollments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enrollments_user_course (user_id, course_id),
  KEY idx_enrollments_course (course_id),
  CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lesson_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  lesson_id BIGINT UNSIGNED NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_lesson_progress_user_lesson (user_id, lesson_id),
  KEY idx_lesson_progress_course (user_id, course_id),
  CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_lesson_progress_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_lesson_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id BIGINT UNSIGNED NOT NULL,
  teacher_id BIGINT UNSIGNED NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  due_date DATETIME NULL,
  max_points INT NOT NULL DEFAULT 100,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_assignments_course_due (course_id, due_date),
  KEY idx_assignments_teacher (teacher_id),
  CONSTRAINT fk_assignments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_assignments_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_assignments_points_positive CHECK (max_points > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  assignment_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  link VARCHAR(500) NULL,
  status ENUM('submitted', 'graded') NOT NULL DEFAULT 'submitted',
  grade DECIMAL(5,2) NULL,
  feedback TEXT NULL,
  graded_by BIGINT UNSIGNED NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  graded_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_submissions_assignment_student (assignment_id, student_id),
  KEY idx_submissions_student (student_id),
  KEY idx_submissions_status (status),
  CONSTRAINT fk_submissions_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_submissions_graded_by FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_submissions_grade_range CHECK (grade IS NULL OR (grade >= 0 AND grade <= 1000))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS classes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id BIGINT UNSIGNED NOT NULL,
  teacher_id BIGINT UNSIGNED NULL,
  title VARCHAR(200) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  meeting_link VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_classes_course_start (course_id, starts_at),
  KEY idx_classes_teacher_start (teacher_id, starts_at),
  CONSTRAINT fk_classes_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_classes_ends_after_starts CHECK (ends_at > starts_at)
) ENGINE=InnoDB;
