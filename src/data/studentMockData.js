// Demonstration-only data for the Step 5 frontend student workspace.
export const studentProfile = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  program: 'Frontend Development Path',
  joined: 'January 2026',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  bio: 'An aspiring frontend developer focused on building accessible, thoughtful web experiences.',
}

export const enrolledCourses = [
  { id: 'web-dev', title: 'Complete Web Development Bootcamp', instructor: 'Maya Chen', category: 'Web Development', progress: 78, completedLessons: 39, totalLessons: 50, currentLesson: 'Building responsive navigation', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', lastAccessed: 'Today' },
  { id: 'python', title: 'Python Programming for Beginners', instructor: 'Daniel Foster', category: 'Programming', progress: 52, completedLessons: 21, totalLessons: 40, currentLesson: 'Functions and return values', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80', lastAccessed: 'Yesterday' },
  { id: 'ux', title: 'UI/UX Design with Figma', instructor: 'Sofia Martinez', category: 'UI/UX Design', progress: 34, completedLessons: 12, totalLessons: 35, currentLesson: 'Designing a component library', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80', lastAccessed: 'Nov 8' },
  { id: 'data', title: 'Data Analysis with Python', instructor: 'Priya Shah', category: 'Data Science', progress: 100, completedLessons: 30, totalLessons: 30, currentLesson: 'Course completed', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', lastAccessed: 'Nov 2' },
]

export const assignments = [
  { id: 'responsive-page', title: 'Build a responsive product page', course: 'Complete Web Development Bootcamp', dueDate: 'Nov 13, 2026', dueLabel: 'Due in 3 days', status: 'pending', description: 'Create a responsive product page using semantic HTML, modern CSS, and reusable components.' },
  { id: 'python-functions', title: 'Python functions practice', course: 'Python Programming for Beginners', dueDate: 'Nov 15, 2026', dueLabel: 'Due in 5 days', status: 'pending', description: 'Write and test reusable functions that solve three common data transformation tasks.' },
  { id: 'design-system', title: 'Design system audit', course: 'UI/UX Design with Figma', dueDate: 'Nov 7, 2026', dueLabel: 'Submitted Nov 6', status: 'submitted', description: 'Review an interface and document its color, type, spacing, and component patterns.' },
  { id: 'data-story', title: 'Data storytelling report', course: 'Data Analysis with Python', dueDate: 'Oct 28, 2026', dueLabel: 'Graded Oct 30', status: 'graded', description: 'Turn a cleaned dataset into a concise visual story and supporting recommendation.' },
  { id: 'wireframe', title: 'Mobile app wireframe', course: 'UI/UX Design with Figma', dueDate: 'Oct 24, 2026', dueLabel: 'Overdue by 17 days', status: 'overdue', description: 'Create a focused, five-screen wireframe for a mobile learning companion.' },
]

export const upcomingClasses = [
  { id: 'web-review', title: 'Live code review: responsive layouts', instructor: 'Maya Chen', date: 'Tuesday, Nov 11', time: '6:00 PM – 7:00 PM', day: 'Tue', timeSlot: '6:00 PM', color: 'bg-blue-100 text-blue-700' },
  { id: 'python-lab', title: 'Python lab: working with functions', instructor: 'Daniel Foster', date: 'Thursday, Nov 13', time: '5:30 PM – 6:30 PM', day: 'Thu', timeSlot: '5:30 PM', color: 'bg-violet-100 text-violet-700' },
  { id: 'design-critique', title: 'Design critique circle', instructor: 'Sofia Martinez', date: 'Friday, Nov 14', time: '4:00 PM – 5:00 PM', day: 'Fri', timeSlot: '4:00 PM', color: 'bg-amber-100 text-amber-700' },
]

export const weeklyLearningActivity = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 0.8 },
  { day: 'Thu', hours: 2.8 },
  { day: 'Fri', hours: 1.9 },
  { day: 'Sat', hours: 3.4 },
  { day: 'Sun', hours: 2.1 },
]

export const achievements = [
  { title: 'Consistency streak', detail: '7 days of learning', type: 'badge' },
  { title: 'Web foundations', detail: 'Certificate earned', type: 'certificate' },
  { title: 'First project', detail: 'Project submitted', type: 'badge' },
]

export const studentStats = [
  { label: 'Enrolled Courses', value: '4', detail: '1 course completed', tone: 'blue' },
  { label: 'Completed Courses', value: '1', detail: 'Keep building momentum', tone: 'green' },
  { label: 'Learning Hours', value: '42.5', detail: '6.3 hours this week', tone: 'violet' },
  { label: 'Average Progress', value: '66%', detail: 'Across active courses', tone: 'amber' },
]
