import { useState } from 'react'
import MobileSidebar from '../components/navigation/MobileSidebar.jsx'
import Navbar from '../components/navigation/Navbar.jsx'
import Sidebar from '../components/navigation/Sidebar.jsx'

function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:flex">
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((collapsed) => !collapsed)} />
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
