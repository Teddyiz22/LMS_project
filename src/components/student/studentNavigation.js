import { BarChart3, BookOpen, CalendarDays, ClipboardList, LayoutDashboard, UserRound } from 'lucide-react'

export const studentNavigationItems = [
  { label: 'Overview', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', to: '/student/courses', icon: BookOpen },
  { label: 'My Assignments', to: '/student/assignments', icon: ClipboardList },
  { label: 'My Schedule', to: '/student/schedule', icon: CalendarDays },
  { label: 'My Progress', to: '/student/progress', icon: BarChart3 },
  { label: 'My Profile', to: '/student/profile', icon: UserRound },
]
