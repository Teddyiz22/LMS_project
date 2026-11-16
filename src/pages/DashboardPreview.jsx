import { ArrowRight } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'

function DashboardPreview() {
  return (
    <div className="space-y-6">
      <PageHeader
        action={<Button><span>Explore workspace</span><ArrowRight className="size-4" aria-hidden="true" /></Button>}
        breadcrumbs={[{ label: 'Workspace' }, { label: 'Dashboard' }]}
        description="A reusable, responsive workspace shell for the next EduFlow implementation steps."
        title="Welcome to EduFlow"
      />
      <Card description="The navigation, profile menu, page header, cards, buttons, and status badges are ready to be reused." title="UI foundation ready">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-[#64748B]">This preview intentionally contains no course, learner, or role-specific dashboard functionality.</p>
          <Badge variant="success">Step 2 complete</Badge>
        </div>
      </Card>
    </div>
  )
}

export default DashboardPreview
