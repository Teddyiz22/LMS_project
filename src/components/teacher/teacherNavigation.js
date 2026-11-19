import { BookOpen, ClipboardCheck, ClipboardList, LayoutDashboard } from 'lucide-react'

export const teacherNavigationItems = [
  { label: 'Overview', to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', to: '/teacher/courses', icon: BookOpen },
  { label: 'Assignments', to: '/teacher/assignments', icon: ClipboardList },
  { label: 'Grading', to: '/teacher/grading', icon: ClipboardCheck },
]
