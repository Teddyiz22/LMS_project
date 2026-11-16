import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import StudentMobileSidebar from '../components/student/StudentMobileSidebar.jsx'
import StudentNavbar from '../components/student/StudentNavbar.jsx'
import StudentSidebar from '../components/student/StudentSidebar.jsx'

function StudentLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return <div className="min-h-screen bg-[#F8FAFC] lg:flex"><StudentSidebar collapsed={isCollapsed} onToggle={() => setIsCollapsed((collapsed) => !collapsed)} /><StudentMobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} /><div className="min-w-0 flex-1"><StudentNavbar onMenuClick={() => setIsMobileSidebarOpen(true)} /><main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>
}

export default StudentLayout
