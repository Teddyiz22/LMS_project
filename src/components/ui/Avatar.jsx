const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Avatar({ alt, className = '', name = 'User', size = 'md', src }) {
  const label = alt ?? name

  if (src) {
    return <img className={`shrink-0 rounded-full object-cover ${sizeClasses[size]} ${className}`} src={src} alt={label} />
  }

  return (
    <span
      aria-label={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-[#2563EB] ${sizeClasses[size]} ${className}`}
      role="img"
    >
      {getInitials(name)}
    </span>
  )
}

export default Avatar
