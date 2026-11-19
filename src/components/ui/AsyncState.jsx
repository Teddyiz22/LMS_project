import { AlertTriangle, LoaderCircle } from 'lucide-react'
import Button from './Button.jsx'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white p-10 text-sm text-[#64748B] shadow-sm">
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
      <p className="flex items-center justify-center gap-2 font-medium text-[#B91C1C]">
        <AlertTriangle className="size-4" aria-hidden="true" />
        Something went wrong
      </p>
      <p className="mt-2 text-sm text-[#64748B]">{message || 'The EduFlow API could not be reached. Check that the API server is running, then try again.'}</p>
      {onRetry && <Button className="mt-4" onClick={onRetry} size="sm" variant="outline">Try again</Button>}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-10 text-center shadow-sm">
      <p className="font-medium text-[#1E293B]">{title}</p>
      {description && <p className="mt-1 text-sm text-[#64748B]">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
