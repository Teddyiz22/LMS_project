import { Bell, ChevronDown, Menu, Search, UserCircle } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../ui/Avatar.jsx'

function Navbar({ onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
      <button aria-label="Open navigation menu" className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#1E293B] lg:hidden" onClick={onMenuClick} type="button"><Menu className="size-5" aria-hidden="true" /></button>
      <label className="relative hidden max-w-md flex-1 md:block">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm text-[#1E293B] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100" placeholder="Search courses, learners..." type="search" />
      </label>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button aria-label="View notifications" className="relative rounded-lg p-2 text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#1E293B]" type="button">
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
        </button>
        <div className="relative">
          <button aria-expanded={isProfileOpen} aria-haspopup="menu" className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-slate-100" onClick={() => setIsProfileOpen((open) => !open)} type="button">
            <Avatar name="Alex Morgan" size="sm" />
            <span className="hidden min-w-0 sm:block"><span className="block truncate text-sm font-medium text-[#1E293B]">Alex Morgan</span><span className="block text-xs text-[#64748B]">Administrator</span></span>
            <ChevronDown className="hidden size-4 text-slate-500 sm:block" aria-hidden="true" />
          </button>
          {isProfileOpen && <div className="absolute right-0 mt-2 w-44 rounded-lg border border-[#E2E8F0] bg-white p-1 shadow-lg" role="menu"><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#1E293B] hover:bg-slate-50" role="menuitem" type="button"><UserCircle className="size-4 text-[#64748B]" aria-hidden="true" />Profile</button><button className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-[#EF4444] hover:bg-red-50" role="menuitem" type="button">Sign out</button></div>}
        </div>
      </div>
    </header>
  )
}

export default Navbar
