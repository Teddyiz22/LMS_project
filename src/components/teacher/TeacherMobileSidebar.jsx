import { GraduationCap, LogOut, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { teacherNavigationItems } from './teacherNavigation.js'

function TeacherMobileSidebar({ isOpen, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); onClose(); navigate('/') }

  return <div aria-hidden={!isOpen} className={`fixed inset-0 z-50 lg:hidden ${isOpen ? '' : 'pointer-events-none'}`}><button aria-label="Close teacher navigation" className={`absolute inset-0 bg-slate-950/45 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} tabIndex={isOpen ? 0 : -1} type="button" /><aside className={`relative flex h-full w-72 flex-col bg-[#111827] text-slate-300 shadow-2xl transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-16 items-center justify-between border-b border-slate-700/70 px-4"><div className="flex items-center gap-3"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#2563EB] text-white"><GraduationCap className="size-5" aria-hidden="true" /></span><span className="text-lg font-semibold tracking-tight text-white">EduFlow</span></div><button aria-label="Close teacher navigation" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" onClick={onClose} type="button"><X className="size-5" aria-hidden="true" /></button></div><nav aria-label="Teacher navigation" className="flex-1 px-3 py-5"><p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher space</p><ul className="space-y-1">{teacherNavigationItems.map(({ icon: Icon, label, to }) => <li key={to}><NavLink className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-[#2563EB] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} onClick={onClose} to={to}><Icon className="size-5" aria-hidden="true" />{label}</NavLink></li>)}</ul></nav><div className="border-t border-slate-700/70 p-3"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white" onClick={handleLogout} type="button"><LogOut className="size-5" aria-hidden="true" />Log out</button></div></aside></div>
}

export default TeacherMobileSidebar
