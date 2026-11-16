import { CalendarClock, FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import { assignments } from '../../data/studentMockData.js'

const filters = ['all', 'pending', 'submitted', 'graded', 'overdue']
const variants = { pending: 'warning', submitted: 'info', graded: 'success', overdue: 'danger' }

function MyAssignments() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const visibleAssignments = useMemo(() => assignments.filter((assignment) => activeFilter === 'all' || assignment.status === activeFilter), [activeFilter])

  return <div className="space-y-6"><PageHeader breadcrumbs={[{ label: 'Student workspace' }, { label: 'My Assignments' }]} description="Review assignment requirements and keep your submissions on track." title="My Assignments" /><div className="flex flex-wrap gap-2">{filters.map((filter) => <button className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${activeFilter === filter ? 'bg-[#2563EB] text-white' : 'bg-white text-[#64748B] ring-1 ring-inset ring-[#E2E8F0] hover:text-[#2563EB]'}`} key={filter} onClick={() => setActiveFilter(filter)} type="button">{filter} <span className="ml-1 opacity-80">{filter === 'all' ? assignments.length : assignments.filter((item) => item.status === filter).length}</span></button>)}</div><Card description={`${visibleAssignments.length} demonstration assignment${visibleAssignments.length === 1 ? '' : 's'} shown`} title="Assignment list"><div className="divide-y divide-[#E2E8F0]">{visibleAssignments.map((assignment) => <article className="flex flex-col gap-4 py-5 first:pt-0 md:flex-row md:items-center md:justify-between" key={assignment.id}><div className="flex gap-3"><span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><FileText className="size-5" aria-hidden="true" /></span><div><h2 className="font-semibold text-[#1E293B]">{assignment.title}</h2><p className="mt-1 text-sm text-[#64748B]">{assignment.course}</p><p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#64748B]"><CalendarClock className="size-3.5" aria-hidden="true" />{assignment.dueDate} · {assignment.dueLabel}</p></div></div><div className="flex items-center gap-3 self-end md:self-auto"><Badge variant={variants[assignment.status]}>{assignment.status}</Badge><Button onClick={() => setSelectedAssignment(assignment)} size="sm" variant="outline">View details</Button></div></article>)}</div></Card>{selectedAssignment && <Card actions={<button aria-label="Close assignment details" className="text-sm font-medium text-[#2563EB]" onClick={() => setSelectedAssignment(null)} type="button">Close</button>} description={selectedAssignment.course} title={selectedAssignment.title}><p className="text-sm leading-6 text-[#64748B]">{selectedAssignment.description}</p><div className="mt-4 flex flex-wrap items-center gap-3"><Badge variant={variants[selectedAssignment.status]}>{selectedAssignment.status}</Badge><span className="text-sm text-[#64748B]">Due {selectedAssignment.dueDate}</span><Button size="sm">{selectedAssignment.status === 'pending' ? 'Start assignment' : 'View submission'}</Button></div><p className="mt-4 text-xs text-[#64748B]">This is a demonstration detail view; submissions are not stored.</p></Card>}</div>
}

export default MyAssignments
