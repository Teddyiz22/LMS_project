import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import TeacherMobileSidebar from '../components/teacher/TeacherMobileSidebar.jsx'
import TeacherNavbar from '../components/teacher/TeacherNavbar.jsx'
import TeacherSidebar from '../components/teacher/TeacherSidebar.jsx'

function TeacherLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return <div className="min-h-screen bg-[#F8FAFC] lg:flex"><TeacherSidebar collapsed={isCollapsed} onToggle={() => setIsCollapsed((collapsed) => !collapsed)} /><TeacherMobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} /><div className="min-w-0 flex-1"><TeacherNavbar onMenuClick={() => setIsMobileSidebarOpen(true)} /><main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>
}

export default TeacherLayout
