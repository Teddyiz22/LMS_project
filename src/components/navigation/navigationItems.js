import { BookOpen, LayoutDashboard, Users } from 'lucide-react'

export const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard-preview' },
  { disabled: true, icon: BookOpen, label: 'Courses' },
  { disabled: true, icon: Users, label: 'Learners' },
]
