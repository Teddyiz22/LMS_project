import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function PageHeader({ action, breadcrumbs = [], description, title }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
              {breadcrumbs.map((crumb, index) => (
                <li className="flex items-center gap-1.5" key={`${crumb.label}-${index}`}>
                  {index > 0 && <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />}
                  {crumb.to ? <Link className="transition-colors hover:text-[#2563EB]" to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-[#1E293B] sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-[#64748B] sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
