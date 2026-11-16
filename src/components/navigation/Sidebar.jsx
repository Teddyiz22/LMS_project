import { ChevronLeft, ChevronRight, GraduationCap, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigationItems.js'

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`hidden min-h-screen shrink-0 flex-col bg-[#111827] text-slate-300 transition-[width] duration-200 lg:flex ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex h-16 items-center border-b border-slate-700/70 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-sm">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          {!collapsed && <span className="truncate text-lg font-semibold tracking-tight text-white">EduFlow</span>}
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-3 py-5">
        <p className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${collapsed ? 'sr-only' : ''}`}>Workspace</p>
        <ul className="space-y-1">
          {navigationItems.map(({ disabled, icon: Icon, label, to }) => (
            <li key={label}>
              {disabled ? (
                <span className={`flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 ${collapsed ? 'justify-center px-2' : ''}`} title={`${label} is coming soon`}>
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{label}</span>}
                </span>
              ) : (
                <NavLink
                  className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${collapsed ? 'justify-center px-2' : ''} ${isActive ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  title={collapsed ? label : undefined}
                  to={to}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-700/70 p-3">
        <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${collapsed ? 'justify-center px-2' : ''}`} type="button" title={collapsed ? 'Log out' : undefined}>
          <LogOut className="size-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Log out</span>}
        </button>
        <button aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="mt-2 flex w-full items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" onClick={onToggle} type="button">
          {collapsed ? <ChevronRight className="size-5" aria-hidden="true" /> : <ChevronLeft className="size-5" aria-hidden="true" />}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
