import { useId } from 'react'

function AuthInput({ as = 'input', className = '', error, id, label, ...props }) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`
  const Field = as

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#1E293B]" htmlFor={fieldId}>{label}</label>
      <Field aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#1E293B] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${as === 'textarea' ? 'min-h-28 resize-y' : 'h-10'} ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-red-100' : 'border-[#E2E8F0]'} ${className}`} id={fieldId} {...props} />
      {error && <p className="mt-1.5 text-xs text-[#EF4444]" id={errorId}>{error}</p>}
    </div>
  )
}

export default AuthInput
