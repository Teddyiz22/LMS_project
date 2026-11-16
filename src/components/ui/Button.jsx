import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const variantClasses = {
  primary: 'bg-[#2563EB] text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-600',
  secondary: 'bg-[#38BDF8] text-slate-950 shadow-sm hover:bg-sky-400 focus-visible:outline-sky-500',
  outline: 'border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-[#EF4444] text-white shadow-sm hover:bg-red-600 focus-visible:outline-red-500',
}

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

function Button({
  children,
  className = '',
  disabled = false,
  href,
  isLoading = false,
  size = 'md',
  to,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const isDisabled = disabled || isLoading
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (to) {
    return (
      <Link aria-disabled={isDisabled || undefined} className={`${classes} ${isDisabled ? 'pointer-events-none opacity-60' : ''}`} to={to} {...props}>
        {isLoading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        aria-disabled={isDisabled || undefined}
        className={`${classes} ${isDisabled ? 'pointer-events-none opacity-60' : ''}`}
        href={href}
        {...props}
      >
        {isLoading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {isLoading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export default Button
