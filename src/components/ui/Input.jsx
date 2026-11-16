import { useId } from 'react'

function Input({ className = '', disabled = false, error, id, label, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#1E293B]" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#1E293B] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-red-100' : 'border-[#E2E8F0]'} ${className}`}
        disabled={disabled}
        id={inputId}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#EF4444]" id={errorId}>{error}</p>}
    </div>
  )
}

export default Input
