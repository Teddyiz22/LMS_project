import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import AdminMobileSidebar from '../components/admin/AdminMobileSidebar.jsx'
import AdminNavbar from '../components/admin/AdminNavbar.jsx'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return <div className="min-h-screen bg-[#F8FAFC] lg:flex"><AdminSidebar collapsed={isCollapsed} onToggle={() => setIsCollapsed((collapsed) => !collapsed)} /><AdminMobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} /><div className="min-w-0 flex-1"><AdminNavbar onMenuClick={() => setIsMobileSidebarOpen(true)} /><main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>
}

export default AdminLayout
