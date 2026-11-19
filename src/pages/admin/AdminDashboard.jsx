import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { getCourses, getOverview, getUsers } from '../../services/adminService.js'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import StudentStatCard from '../../components/student/StudentStatCard.jsx'
import { ErrorState, LoadingState } from '../../components/ui/AsyncState.jsx'

const roleVariant = { student: 'info', teacher: 'warning', admin: 'success' }

function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [userTotal, setUserTotal] = useState(0)
  const [userPage, setUserPage] = useState(1)
  const [userTotalPages, setUserTotalPages] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [courses, setCourses] = useState([])
  const [courseTotal, setCourseTotal] = useState(0)
  const [coursePage, setCoursePage] = useState(1)
  const [courseTotalPages, setCourseTotalPages] = useState(1)
  const [courseSearch, setCourseSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOverview = useCallback(async () => {
    const data = await getOverview()
    setOverview(data)
  }, [])

  const loadUsers = useCallback(async (page, role, search) => {
    const data = await getUsers({ role, search, page, limit: 10 })
    setUsers(data.items || [])
    setUserTotal(data.total || 0)
    setUserTotalPages(data.totalPages || 1)
  }, [])

  const loadCourses = useCallback(async (page, search) => {
    const data = await getCourses({ search, page, limit: 10 })
    setCourses(data.items || [])
    setCourseTotal(data.total || 0)
    setCourseTotalPages(data.totalPages || 1)
  }, [])

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      await Promise.all([
        loadOverview(),
        loadUsers(userPage, roleFilter, userSearch),
        loadCourses(coursePage, courseSearch),
      ])
    } catch (loadError) {
      setError(loadError.message || 'The EduFlow API could not be reached.')
    } finally {
      setIsLoading(false)
    }
  }, [loadOverview, loadUsers, loadCourses, userPage, roleFilter, userSearch, coursePage, courseSearch])

  useEffect(() => { loadAll() }, [loadAll])

  const stats = overview ? [
    { label: 'Total Users', value: String(overview.users.total), detail: `${overview.users.students} students · ${overview.users.teachers} teachers · ${overview.users.admins} admins`, tone: 'blue' },
    { label: 'Courses', value: String(overview.courses.total), detail: `${overview.courses.published} published`, tone: 'green' },
    { label: 'Enrollments', value: String(overview.enrollments), detail: 'Across all courses', tone: 'violet' },
    { label: 'Submissions', value: String(overview.submissions), detail: `${overview.pendingSubmissions} waiting for grading`, tone: 'amber' },
  ] : []

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ label: 'Admin workspace' }, { label: 'Overview' }]} description="See who is learning and teaching, and how the catalogue is doing." title="Admin Overview" />
      {isLoading ? (
        <LoadingState label="Loading the admin overview…" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAll} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => <StudentStatCard key={stat.label} stat={stat} />)}
          </div>
          <Card description={`${userTotal} user${userTotal === 1 ? '' : 's'}`} title="Users">
            <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="relative">
                <span className="sr-only">Search users</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  onChange={(event) => { setUserSearch(event.target.value); setUserPage(1) }}
                  placeholder="Search by name or email"
                  type="search"
                  value={userSearch}
                />
              </label>
              <label className="sr-only" htmlFor="user-role">Filter by role</label>
              <select className="h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm capitalize text-[#1E293B] outline-none focus:border-[#2563EB]" id="user-role" onChange={(event) => { setRoleFilter(event.target.value); setUserPage(1) }} value={roleFilter}>
                <option value="">All roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {users.length === 0 ? (
              <p className="text-sm text-[#64748B]">No users match these filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-160 text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-xs uppercase tracking-wide text-[#64748B]">
                      <th className="py-2 pr-3 font-medium">Name</th>
                      <th className="py-2 pr-3 font-medium">Email</th>
                      <th className="py-2 pr-3 font-medium">Role</th>
                      <th className="py-2 pr-3 font-medium">Joined</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((account) => (
                      <tr className="border-b border-slate-100 last:border-0" key={account.id}>
                        <td className="py-3 pr-3 font-medium text-[#1E293B]">{account.full_name}{account.title ? <span className="block text-xs font-normal text-[#64748B]">{account.title}</span> : null}</td>
                        <td className="py-3 pr-3 text-[#64748B]">{account.email}</td>
                        <td className="py-3 pr-3"><Badge variant={roleVariant[account.role] || 'default'}>{account.role}</Badge></td>
                        <td className="py-3 pr-3 text-[#64748B]">{account.created_at ? new Date(account.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                        <td className="py-3"><Badge variant={account.is_active ? 'success' : 'danger'}>{account.is_active ? 'Active' : 'Inactive'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[#64748B]">Page {userPage} of {userTotalPages}</p>
              <div className="flex gap-2">
                <Button disabled={userPage <= 1} onClick={() => setUserPage((page) => Math.max(1, page - 1))} size="sm" variant="outline">Previous</Button>
                <Button disabled={userPage >= userTotalPages} onClick={() => setUserPage((page) => page + 1)} size="sm" variant="outline">Next</Button>
              </div>
            </div>
          </Card>
          <Card description={`${courseTotal} course${courseTotal === 1 ? '' : 's'}`} title="Courses">
            <div className="mb-4">
              <label className="relative">
                <span className="sr-only">Search courses</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  className="h-10 w-full max-w-md rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  onChange={(event) => { setCourseSearch(event.target.value); setCoursePage(1) }}
                  placeholder="Search courses"
                  type="search"
                  value={courseSearch}
                />
              </label>
            </div>
            {courses.length === 0 ? (
              <p className="text-sm text-[#64748B]">No courses match this search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-160 text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-xs uppercase tracking-wide text-[#64748B]">
                      <th className="py-2 pr-3 font-medium">Course</th>
                      <th className="py-2 pr-3 font-medium">Teacher</th>
                      <th className="py-2 pr-3 font-medium">Students</th>
                      <th className="py-2 pr-3 font-medium">Lessons</th>
                      <th className="py-2 pr-3 font-medium">Price</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr className="border-b border-slate-100 last:border-0" key={course.id}>
                        <td className="py-3 pr-3 font-medium text-[#1E293B]">{course.title}<span className="block text-xs font-normal text-[#64748B]">{course.category} · {course.level}</span></td>
                        <td className="py-3 pr-3 text-[#64748B]">{course.instructor || '—'}</td>
                        <td className="py-3 pr-3 text-[#64748B]">{course.students}</td>
                        <td className="py-3 pr-3 text-[#64748B]">{course.lessonCount}</td>
                        <td className="py-3 pr-3 text-[#64748B]">{course.priceLabel}</td>
                        <td className="py-3"><Badge variant={!course.isActive ? 'danger' : course.isPublished ? 'success' : 'default'}>{!course.isActive ? 'Inactive' : course.isPublished ? 'Published' : 'Draft'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[#64748B]">Page {coursePage} of {courseTotalPages}</p>
              <div className="flex gap-2">
                <Button disabled={coursePage <= 1} onClick={() => setCoursePage((page) => Math.max(1, page - 1))} size="sm" variant="outline">Previous</Button>
                <Button disabled={coursePage >= courseTotalPages} onClick={() => setCoursePage((page) => page + 1)} size="sm" variant="outline">Next</Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
