import { Bell, ChevronDown, Menu, Search, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

function AdminNavbar({ onMenuClick }) {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const fullName = user?.fullName || 'Admin'
  const handleLogout = () => { logout(); navigate('/') }

  return <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 sm:px-6"><button aria-label="Open admin navigation" className="rounded-lg p-2 text-[#64748B] transition hover:bg-slate-100 hover:text-[#1E293B] lg:hidden" onClick={onMenuClick} type="button"><Menu className="size-5" aria-hidden="true" /></button><div className="hidden min-w-32 sm:block"><p className="text-xs text-[#64748B]">Admin workspace</p><p className="text-sm font-semibold text-[#1E293B]">{location.pathname === '/admin' ? 'Overview' : 'Overview'}</p></div><label className="relative hidden max-w-md flex-1 md:block"><span className="sr-only">Search users or courses</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm text-[#1E293B] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100" placeholder="Search users or courses..." type="search" /></label><div className="ml-auto flex items-center gap-2 sm:gap-3"><div className="relative"><button aria-expanded={isNotificationsOpen} aria-label="View notifications" className="relative rounded-lg p-2 text-[#64748B] transition hover:bg-slate-100 hover:text-[#1E293B]" onClick={() => { setIsNotificationsOpen((open) => !open); setIsProfileOpen(false) }} type="button"><Bell className="size-5" aria-hidden="true" /></button>{isNotificationsOpen && <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-xl"><p className="px-2 py-1 text-sm font-semibold text-[#1E293B]">Notifications</p><p className="mt-1 rounded-lg bg-blue-50 p-3 text-sm text-[#64748B]">No new notifications.</p></div>}</div><div className="relative"><button aria-expanded={isProfileOpen} aria-haspopup="menu" className="flex items-center gap-2 rounded-lg p-1 text-left transition hover:bg-slate-100" onClick={() => { setIsProfileOpen((open) => !open); setIsNotificationsOpen(false) }} type="button"><Avatar name={fullName} size="sm" /><span className="hidden min-w-0 sm:block"><span className="block max-w-28 truncate text-sm font-medium text-[#1E293B]">{fullName}</span><span className="block text-xs capitalize text-[#64748B]">Admin</span></span><ChevronDown className="hidden size-4 text-slate-500 sm:block" aria-hidden="true" /></button>{isProfileOpen && <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-xl" role="menu"><Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1E293B] hover:bg-slate-50" role="menuitem" to="/admin"><UserRound className="size-4 text-[#64748B]" aria-hidden="true" />Admin overview</Link><button className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-[#EF4444] hover:bg-red-50" onClick={handleLogout} role="menuitem" type="button">Log out</button></div>}</div></div></header>
}

export default AdminNavbar
