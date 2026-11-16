import { GraduationCap, Presentation } from 'lucide-react'

const roles = [
  { value: 'student', label: 'Student', description: 'Learn new skills at your own pace.', icon: GraduationCap },
  { value: 'teacher', label: 'Teacher', description: 'Create courses and share your expertise.', icon: Presentation },
]

function RoleSelector({ onChange, value }) {
  return <fieldset><legend className="text-sm font-medium text-[#1E293B]">I want to join as a</legend><div className="mt-2 grid gap-3 sm:grid-cols-2">{roles.map(({ description, icon: Icon, label, value: role }) => <label className={`cursor-pointer rounded-xl border p-4 transition ${value === role ? 'border-[#2563EB] bg-blue-50 ring-1 ring-[#2563EB]' : 'border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50'}`} key={role}><input checked={value === role} className="sr-only" name="role" onChange={() => onChange(role)} type="radio" value={role} /><Icon className={`size-5 ${value === role ? 'text-[#2563EB]' : 'text-[#64748B]'}`} aria-hidden="true" /><span className="mt-3 block text-sm font-semibold text-[#1E293B]">{label}</span><span className="mt-1 block text-xs leading-5 text-[#64748B]">{description}</span></label>)}</div></fieldset>
}

export default RoleSelector
